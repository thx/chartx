import Canvax from "canvax2d"
import Group from "./group"
import {getDisMinATArr} from "../../utils/tools"

const _ = Canvax._;
const Rect = Canvax.Shapes.Rect;

export default class LineGraphs extends Canvax.Event.EventDispatcher
{
    constructor(opts, root)
    {
        super();

        this.type = "line";

        //这里所有的opts都要透传给 group
        this._opts = opts || {};
        this.root = root;

        this.width = 0;
        this.height = 0;
        this.origin = {
            x : 0,
            y : 0
        };

        //默认给左轴
        this.yAxisAlign = "left";

        //TODO: 这里应该是root.stage.ctx 由canvax提供，先这样
        this.ctx = root.stage.canvas.getContext("2d");
        this.dataFrame = root.dataFrame; //root.dataFrame的引用
        this.data = []; //二维 [[{x:0,y:-100,...},{}],[]]

        //chartx 2.0版本，yAxis的field配置移到了每个图表的Graphs对象上面来
        this.field = opts.field;
        this.enabledField = null;
        
        this.groups = []; //群组集合

        this.sprite = null;

        this.eventEnabled = true;

        this.init(this._opts);
    }

    init(opts)
    {
        opts.yAxisAlign && (this.yAxisAlign = opts.yAxisAlign);
        this.sprite = new Canvax.Display.Sprite();
    }

    draw(opts)
    {
        this.width = opts.width;
        this.height = opts.height;
        _.extend( true, this.origin, opts.origin );

        this.sprite.context.x = this.origin.x;
        this.sprite.context.y = this.origin.y;

        this.data = this._trimGraphs();

        this._setGroupsForYfield( this.data );

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
        var me = this;
        var _coor = this.root._coordinate;
        
        //{"uv":{}.. ,"click": "pv":]}
        //这样按照字段摊平的一维结构
        var tmpData = {}; 

        me.setEnabledField();

        var _yAxis = this.yAxisAlign == "right" ? _coor._yAxisRight : _coor._yAxisLeft;

        _.each( _.flatten( me.enabledField ) , function( field, i ){
            //var maxValue = 0;

            //单条line的全部data数据
            var _lineData = me.root.dataFrame.getFieldData(field);
            if( !_lineData ) return;

            var _data = [];

            for (var b = 0, bl = _lineData.length; b < bl; b++) {
                var _xAxis = me.root._coordinate ? me.root._coordinate._xAxis : me.root._xAxis;
                var x = _xAxis.getPosX( {
                    ind : b,
                    dataLen : bl,
                    layoutType : me.root._coordinate ? me.root._coordinate.xAxis.layoutType : me.root._xAxis.layoutType
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
        var me = this;
        
        //这个field不再这个graphs里面的，不相关
        if( _.indexOf( _.flatten( [me.field] ), field ) == -1 ){
            return;
        }

        this.data = this._trimGraphs();
        this._setGroupsForYfield( this.data , field );
        
        _.each(this.groups, function(g, i) {
            g.resetData( me.data[ g.field ].data );
        });
    }

    /*
     *删除 ind
     **/
    remove( field )
    {
        
        var me = this;
        var i = me.getGroupIndex( field );

        if( !this.groups.length || i < 0 ){
            return;
        }

        this.groups.splice(i, 1)[0].destroy();
        this.data = this._trimGraphs();

        _.each(this.groups, function(g, i) {
            g.resetData( me.data[ g.field ].data );
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
        var me = this;

        if( fields ){
            //如果有传入field参数，那么就说明只需要从data里面挑选指定的field来添加
            //一般用在add()执行的时候
            fields = _.flatten( [fields] );
        }

        var _flattenField = _.flatten( [ this.field ] );

        _.each( data , function( g, field ){
        
            if( fields && _.indexOf( fields, field ) == -1 ){
                //如果有传入fields，但是当前field不在fields里面的话，不需要处理
                //说明该group已经在graphs里面了
                return;
            }

            var fieldMap = me.root._coordinate.getFieldMapOf( field );
            
            //groupInd 是这条group在本graphs中的ind，而要拿整个图表层级的index， 就是fieldMap.ind
            var groupInd = _.indexOf( _flattenField, field );

            var group = new Group(
                fieldMap,
                groupInd, //不同于fieldMap.ind
                me._opts,
                me.ctx,
                me.height,
                me.width
            );

            group.draw( {}, g.data );

            var insert = false;
            //在groups数组中插入到比自己_groupInd小的元素前面去
            for( var gi=0,gl=me.groups.length ; gi<gl ; gi++ ){
                if( groupInd < me.groups[gi].groupInd ){

                    me.groups.splice( gi , 0 , group );
                    insert=true;
                    me.sprite.addChildAt(group.sprite , gi);
                    
                    break;
                }
            };
            //否则就只需要直接push就好了
            if( !insert ){
                me.groups.push(group);
                me.sprite.addChild(group.sprite);
            };

        } );

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
}