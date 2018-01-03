import Canvax from "canvax2d"
import Group from "./group"
import markColumn from "./markcolumn"
import {getDisMinATArr} from "../../utils/tools"
import {colors as themeColors} from "../theme"

const _ = Canvax._;
const Rect = Canvax.Shapes.Rect;

export default class LineGraphs extends Canvax.Event.EventDispatcher
{
    constructor(opt, root)
    {
        super();

        this.type = "line";


        this.width = 0;
        this.height = 0;

        this.pos = {
            x : 0,
            y : 0
        }

        //这里所有的opt都要透传给 group
        this._opt = opt || {};
        this.root = root;

        //TODO: 这里应该是root.stage.ctx 由canvax提供，先这样
        this.ctx = root.stage.canvas.getContext("2d");
        this.dataFrame = this._opt.dataFrame || root.dataFrame; //root.dataFrame的引用
        this.data = []; //二维 [[{x:0,y:-100,...},{}],[]]

        //chartx 2.0版本，yAxis的field配置移到了每个图表的Graphs对象上面来
        this.field = null;
        this.enabledField = null;
        
        this.groups = []; //群组集合     

        this.iGroup = 0; //群组索引(哪条线)
        this.iNode = -1; //节点索引(那个点)

        this.sprite = null;
        //this.induce = null;

        this.eventEnabled = true;

        this.init(this._opt);
    }


    init(opt)
    {
        this._opt = opt;
        _.extend(true, this, opt);
        this.sprite = new Canvax.Display.Sprite();
    }

    draw(opt)
    {
        _.extend(true, this, opt);

        this.sprite.context.x = this.pos.x;
        this.sprite.context.y = this.pos.y;

        this.data = this._trimGraphs();

        this._setGroupsForYfield( this.data );
        
        this._widget(opt, this.data);

        this.grow();

        return this;
        
    }

    resetData(dataFrame, dataTrigger)
    {
        
        var me = this;

        if( dataFrame ){
            me.dataFrame = dataFrame;
            me.data = me._trimGraphs();
        };

        _.each( me.groups, function(g){
            g.resetData( me.data[ g.field ].data , dataTrigger );
        } );
    }

    setEnabledField()
    {
        //要根据自己的 field，从enabledFields中根据enabled数据，计算一个 enabled版本的field子集
        this.enabledField = this.root._coordinate.getEnabledFields( this.field );
    }

    //_yAxis, dataFrame
    _trimGraphs()
    {
        var self = this;
        var _coor = this.root._coordinate;
        
        //{"uv":{}.. ,"click": "pv":]}
        //这样按照字段摊平的一维结构
        var tmpData = {}; 

        self.setEnabledField();

        var _yAxis = this.yAxisAlign == "right" ? _coor._yAxisRight : _coor._yAxisLeft;

        _.each( _.flatten( self.enabledField ) , function( field, i ){
            //var maxValue = 0;

            //单条line的全部data数据
            var _lineData = self.root.dataFrame.getFieldData(field);
            if( !_lineData ) return;

            var _data = [];

            for (var b = 0, bl = _lineData.length; b < bl; b++) {
                var _xAxis = self.root._coordinate ? self.root._coordinate._xAxis : self.root._xAxis;
                var x = _xAxis.getPosX( {
                    ind : b,
                    dataLen : bl,
                    layoutType : self.root._coordinate ? self.root._coordinate.xAxis.layoutType : self.root._xAxis.layoutType
                } );
                
                var y = _.isNumber( _lineData[b] ) ? _yAxis.getYposFromVal( _lineData[b] ) : undefined; //_lineData[b] 没有数据的都统一设置为undefined，说明这个地方没有数据

                var node = {
                    value: _lineData[b],
                    x: x,
                    y: y
                };

                _data.push( node );
                
            };

            tmpData[ field ] = {
                yAxis: _yAxis,
                field: field,
                data: _data
            };

        } );
    
        return tmpData;
    }

    /**
     * 生长动画
     */
    grow(callback)
    {
        var gi = 0;
        var gl = this.groups.length;
        var me = this;
        _.each(this.groups, function(g, i) {
            g._grow(function(){
                gi++;
                callback && callback( g );
                if( gi == gl ){
                    me.fire("complete");
                }
            });
        });
        return this;
    }

    add( field )
    {
        var self = this;
        
        //这个field不再这个graphs里面的，不相关
        if( _.indexOf( _.flatten( [self.field] ), field ) == -1 ){
            return;
        }

        this.data = this._trimGraphs();
        this._setGroupsForYfield( this.data , field );
        
        _.each(this.groups, function(g, i) {
            g.resetData( self.data[ g.field ].data );
        });
    }

    /*
     *删除 ind
     **/
    remove( field )
    {
        
        var self = this;
        var i = self.getGroupIndex( field );

        if( !this.groups.length || i < 0 ){
            return;
        }

        this.groups.splice(i, 1)[0].destroy();
        this.data = this._trimGraphs();

        _.each(this.groups, function(g, i) {
            g.resetData( self.data[ g.field ].data );
        });
    }

    getGroupIndex( field )
    {
        var ind = -1;
        for( var i=0,l=this.groups.length; i<l; i++  ){
            if( this.groups[i].field === field ){
                ind = i;
                break;
            }
        }
        return ind
    }

    getGroup( field )
    {
       return this.groups[ this.getGroupIndex(field) ]
    }

    _setGroupsForYfield(data , fields)
    {
        var self = this;

        if( fields ){
            //如果有传入field参数，那么就说明只需要从data里面挑选指定的field来添加
            //一般用在add()执行的时候
            fields = _.flatten( [fields] );
        }

        _.each( data , function( g, field ){
        
            if( fields && _.indexOf( fields, field ) == -1 ){
                //如果有传入fields，但是当前field不在fields里面的话，不需要处理
                //说明该group已经在graphs里面了
                return;
            }

            var fieldMap = self.root._coordinate.getFieldMapOf( field );
            var _groupInd = fieldMap.ind;

            var group = new Group(
                field,
                _groupInd,
                self._opt,
                self.ctx,
                g.yAxis.sort,
                g.yAxis,
                self.height,
                self.width,
                fieldMap.style
            );

            group.draw({
                resize : self.resize
            }, g.data );

            var insert = false;
            //在groups数组中插入到比自己_groupInd小的元素前面去
            for( var gi=0,gl=self.groups.length ; gi<gl ; gi++ ){
                if( _groupInd < self.groups[gi]._groupInd ){

                    self.groups.splice( gi , 0 , group );
                    insert=true;
                    self.sprite.addChildAt(group.sprite , gi);
                    
                    break;
                }
            };
            //否则就只需要直接push就好了
            if( !insert ){
                self.groups.push(group);
                self.sprite.addChild(group.sprite);
            };

        } );

    }

    _widget(opt)
    {
        var self = this;
        self.resize = false;
    }

    getNodesAt( ind )
    {
        var _nodesInfoList = []; //节点信息集合
        _.each( this.groups, function( group ){
            var node = group.getNodeInfoAt( ind );
            node && _nodesInfoList.push( node );
        } );
        return _nodesInfoList;
    }

    //废除
    _getInfoHandler(e)
    {
        
        var x = e.point.x,
            y = e.point.y - this.height;
        //todo:底层加判断
        x = x > this.width ? this.width : x;

        var _disX = this._getGraphsDisX();

        var tmpINode = _disX == 0 ? 0 : parseInt((x + (_disX / 2)) / _disX);

        var _nodesInfoList = []; //节点信息集合

        for (var a = 0, al = this.groups.length; a < al; a++) {
            var o = this.groups[a].getNodeInfoAt(tmpINode);
            o && _nodesInfoList.push(o);
        };

        var tmpIGroup = getDisMinATArr(y, _.pluck(_nodesInfoList, "y"));

        this.iGroup = tmpIGroup, this.iNode = tmpINode;
        //iGroup 第几条线   iNode 第几个点   都从0开始
        var node = {
            iGroup: this.iGroup,
            iNode: this.iNode,
            nodesInfoList: _.clone(_nodesInfoList)
        };
        return node;
    }

    //每两个点之间的距离
    _getGraphsDisX()
    {
        var dsl = this.dataFrame.org.length - 1;
        var n = this.width / (dsl - 1);
        if (dsl == 1) {
            n = 0
        }
        return n
    }

    getNodesInfoOfx( x )
    {
        var _nodesInfoList = []; //节点信息集合
        for (var a = 0, al = this.groups.length; a < al; a++) {
            var o = this.groups[a].getNodeInfoOfX(x);
            o && _nodesInfoList.push(o);
        };
        var node = {
            iGroup: -1,
            iNode: -1,
            nodesInfoList: _.clone(_nodesInfoList)
        };
        return node;
    }

    createMarkColumn( x , opt )
    {
        var ml = new markColumn( opt );
        this.sprite.addChild( ml.sprite );

        ml.h = this.induce.context.height;
        ml.y = -ml.h;
        var e = {
            eventInfo :  this.getNodesInfoOfx(x)
        }
        ml.show( e , {x : x} );
        ml.data = e.eventInfo;

        return ml;
    }

}