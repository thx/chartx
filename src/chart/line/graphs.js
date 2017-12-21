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

        this.w = 0;
        this.h = 0;
        this.x = 0;
        this.y = 0;

        //这里所有的opt都要透传给 group
        this.opt = opt || {};
        this.root = root;
        this.ctx = root.stage.context2D;
        this.dataFrame = this.opt.dataFrame || root.dataFrame; //root.dataFrame的引用
        this.data = []; //二维 [[{x:0,y:-100,...},{}],[]]

        //这里在用的时候不直接使用 root._coordinate._yAxis
        //而是先用this._yAxis存储起来
        //方便比如bar_line柱折混合的时候覆盖掉
        this._yAxis = this.root._coordinate._yAxis;

        //field默认从 直角坐标系的 yAxisFields 中获取 获取

        //['uv','pv','click'] 这样的一维结构集合，哪怕是双轴的yAxis
        //就算是在混合图表里， 也是全量的集合
        this.field = this.root._coordinate.yAxisFields;//this.dataFrame.yAxis.field;


        //一个记录了原始yAxis.field 一些基本信息的map
        //{ "uv" : {ind : 0 , _yAxis : , line} ...}
        this._yAxisFieldsMap = {};
        this._setyAxisFieldsMap( this.field );

        
        this.disX = 0; //点与点之间的间距
        this.groups = []; //群组集合     

        this.iGroup = 0; //群组索引(哪条线)
        this.iNode = -1; //节点索引(那个点)

        this.sprite = null;
        this.induce = null;

        this.eventEnabled = true;

        this.init(this.opt);
    }


    init(opt)
    {
        this.opt = opt;
        _.extend(true, this, opt);
        this.sprite = new Canvax.Display.Sprite();

        this.core = new Canvax.Display.Sprite();
        this.sprite.addChild( this.core );
    }

    draw(opt)
    {
        _.extend(true, this, opt);

        this.core.context.x = this.x;
        this.core.context.y = this.y;

        this.disX = this._getGraphsDisX();

        this.data = this._trimGraphs();

        this._setGroupsForYfield( this.data );
        
        this._widget(opt, this.data);

        this.grow();

        return this;
        
    }

    resetData(dataFrame)
    {
        
        var me = this;

        if( dataFrame ){
            me.dataFrame = dataFrame;
            me.data = me._trimGraphs();
        };

        this.disX = this._getGraphsDisX();

        for (var a = 0, al = me.field.length; a < al; a++) {
            //var group = me.groups[a];
            var group = _.find( me.groups , function(g){
                return g.field == me.field[a]
            } );
            group && group.resetData( me.data[ group.field ].data , dataFrame.trigger );
        };
    }

    //_yAxis, dataFrame
    _trimGraphs()
    {
        var self = this;
        var _dataFrame = self.dataFrame || self.root.dataFrame;
        
        //{"uv":{}.. ,"click": "pv":]}
        //这样按照字段摊平的一维结构
        var tmpData = {}; 

        function __trimGraphs(_yAxis ) {
            var _fields = _yAxis.field;
            if( !_.isArray( _fields ) ){
                _fields = [_fields];
            };

            _.each( _fields , function( field, i ){
                //var maxValue = 0;

                //单条line的全部data数据
                var _lineData = _dataFrame.getFieldData(field);
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
        };
   
        //可能被外部覆盖的时候，没有赋值一个数组结构
        _.each( _.flatten( [this._yAxis] ) , function( axis , i ){
            __trimGraphs( axis );
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

    _setyAxisFieldsMap( fields )
    {
        var me = this;
        //me._yAxisFieldsMap = {};
        _.each(_.flatten( fields ), function(field, i) {
            var _yAxisF = me._yAxisFieldsMap[field];
            if( _yAxisF ){
                me._yAxisFieldsMap[field].ind = i;
            } else {
                me._yAxisFieldsMap[field] = {
                    group: null,
                    ind: i,
                    yAxisInd: 0 //0为依赖左边的y轴，1为右边的y轴
                };
            }
        });
    }

    //add 和 remove 都不涉及到 _yAxisFieldsMap 的操作,只有reset才会重新构建 _yAxisFieldsMap
    add( field )
    {
        var self = this;
        
        this.data = this._trimGraphs();
        this._setGroupsForYfield( this.data , field );
        
        _.each(this.groups, function(g, i) {
            g.reset( {} , self.data[ g.field ].data );
        });
    }

    /*
     *删除 ind
     **/
    remove(i)
    {
        var self = this;

        this.groups.splice(i, 1)[0].destroy();
        this.data = this._trimGraphs();

        _.each(this.groups, function(g, i) {
            g.reset( {} , self.data[ g.field ].data );
        });
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
            //记录起来该字段对应的应该是哪个_yAxis
            var yfm = self._yAxisFieldsMap[ field ];
            var _groupInd = yfm.ind;

            var group = new Group(
                field,
                _groupInd,
                self.opt,
                self.ctx,
                g.yAxis.sort,
                g.yAxis,
                self.h,
                self.w
            );

            group.draw({
                resize : self.resize
            }, g.data );

            yfm.group = group;

            var insert = false;
            //在groups数组中插入到比自己_groupInd小的元素前面去
            for( var gi=0,gl=self.groups.length ; gi<gl ; gi++ ){
                if( _groupInd < self.groups[gi]._groupInd ){

                    self.groups.splice( gi , 0 , group );
                    insert=true;
                    self.core.addChildAt(group.sprite , gi);
                    
                    break;
                }
            };
            //否则就只需要直接push就好了
            if( !insert ){
                self.groups.push(group);
                self.core.addChild(group.sprite);
            };

        } );

    }

    _widget(opt)
    {
        var self = this;

        
        self.induce = new Rect({
            id: "induce",
            context: {
                y: -self.h,
                width: self.w,
                height: self.h,
                fillStyle: '#000000',
                globalAlpha: 0,
                cursor: 'pointer'
            }
        });

        self.core.addChild(self.induce);

        if(self.eventEnabled){
            self.induce.on("panstart mouseover", function(e) {
                e.eventInfo = self._getInfoHandler(e);
            })
            self.induce.on("panmove mousemove", function(e) {
                e.eventInfo = self._getInfoHandler(e);
            })
            self.induce.on("panend mouseout", function(e) {
                e.eventInfo = self._getInfoHandler(e);
                self.iGroup = 0, self.iNode = -1
            })
            self.induce.on("tap click", function(e) {
                e.eventInfo = self._getInfoHandler(e);
            })
        }
        
        self.resize = false;
    }

    _getInfoHandler(e)
    {
        
        var x = e.point.x,
            y = e.point.y - this.h;
        //todo:底层加判断
        x = x > this.w ? this.w : x;

        var tmpINode = this.disX == 0 ? 0 : parseInt((x + (this.disX / 2)) / this.disX);

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
        this.core.addChild( ml.sprite );

        ml.h = this.induce.context.height;
        ml.y = -ml.h;
        var e = {
            eventInfo :  this.getNodesInfoOfx(x)
        }
        ml.show( e , {x : x} );
        ml.data = e.eventInfo;

        return ml;
    }

    //每两个点之间的距离
    _getGraphsDisX()
    {
        var dsl = this.dataFrame.org.length - 1;
        var n = this.w / (dsl - 1);
        if (dsl == 1) {
            n = 0
        }
        return n
    }

    //这里得到的ind 和 groundInd不同，这里是真实的索引
    getIndexOfField( field )
    {
        var i = -1;
        _.each( this.groups , function( g , ii ){
            if( g.field == field ){
                i = ii;
                return false;
            }
        } );
        return i;
    }

}