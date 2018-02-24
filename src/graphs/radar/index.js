import Canvax from "canvax2d"
import Theme from "../../theme"

const Polygon = Canvax.Shapes.Polygon;
const Circle = Canvax.Shapes.Circle;
const _ = Canvax._;

export default class RadarGraphs extends Canvax.Event.EventDispatcher
{
    constructor(opts, root)
    {
        super( opts, root );

        this.type = "radar";

        //这里所有的opts都要透传给 group
        this._opts = opts || {};
        this.root = root;
        this.ctx = root.stage.canvas.getContext("2d");
        
        this.data = []; //二维 [[{x:0,y:-100,...},{}],[]] ,所有的grapsh里面的data都存储的是layout数据
        this.enabledField = null;

        this.width = 0;
        this.height = 0;
        this.origin = {
            x: 0,
            y: 0
        };

        this.line = {
            enabled : true,
            lineWidth : 2,
            strokeStyle :null
        };
        this.area = {
            enabled : true,
            fillStyle : null,
            fillAlpha : 0.1
        };
        this.node = {
            enabled : true,
            r : 4,
            strokeStyle : "#ffffff",
            lineWidth : 1
        };

        this.animation = true;

        this.field = null;

        this.sprite   = null;

        this.groups = {
            //uv : {
            //   area : ,
            //   nodes: 
            //}
        };

        _.extend( true, this , opts );

        this.init();
    }

    init()
    {
        this.sprite = new Canvax.Display.Sprite({ 
            id : "graphsEl"
        });
    }

    draw(opts)
    {
        var me = this;
        _.extend(true, this, opts);
        this.data = this._trimGraphs();
        
        this._widget();

        this.sprite.context.x = this.origin.x;
        this.sprite.context.y = this.origin.y;
    }

    _widget()
    {
        var me = this;
        var _coor = this.root._coordinate;

        var groupInd = 0;
        _.each( this.data, function( list , field ){

            var group = {};

            var pointList = [];
            _.each( list , function( node, i ){
                pointList.push([ node.point.x, node.point.y ]);
            } );

            var fieldMap = _coor.getFieldMapOf( field );

            var _strokeStyle = me._getStyle( me.line.strokeStyle , groupInd, fieldMap.color, fieldMap );

            var polyCtx = {
                pointList : pointList
            };

            if( me.line.enabled ){
                polyCtx.lineWidth = me.line.lineWidth;
                polyCtx.strokeStyle = _strokeStyle;
            };
            if( me.area.enabled ){
                polyCtx.fillStyle = me._getStyle( me.area.fillStyle , groupInd, fieldMap.color, fieldMap );
                polyCtx.fillAlpha = me._getStyle( me.area.fillAlpha , groupInd, 1, fieldMap );
            };

            var _poly = new Polygon({
                context : polyCtx
            });
            group.area = _poly;
            me.sprite.addChild( _poly );

            _poly.on("panstart mouseover panmove mousemove panend mouseout tap click dblclick", function(e) {
                me.fire( e.type, e );
                //图表触发，用来处理Tips
                me.root.fire( e.type, e );
            });
            
            if( me.node.enabled ){
                //绘制圆点
                var _nodes = [];
                _.each( list , function( node, i ){
                    pointList.push([ node.point.x, node.point.y ]);
                    var _node = new Circle({
                        context : {
                            x : node.point.x,
                            y : node.point.y,
                            r : me.node.r,
                            lineWidth : me.node.lineWidth,
                            strokeStyle : me.node.strokeStyle,
                            fillStyle : _strokeStyle
                        }
                    });
                    me.sprite.addChild( _node );
                    _node.nodeInd = i;
                    _node.nodeData = node;
                    _node.on("panstart mouseover panmove mousemove panend mouseout tap click dblclick", function(e) {
                        me.fire( e.type, e );
                        //图表触发，用来处理Tips

                        //这样就会直接用这个aAxisInd了，不会用e.point去做计算
                        e.aAxisInd = this.nodeInd;
                        e.eventInfo = {
                            nodes : [ this.nodeData ]
                        };
                        me.root.fire( e.type, e );
                    });
                    _nodes.push( _node );
                } );
                group.nodes = _nodes;
            };

            me.groups[ field ] = group;

            groupInd++;
        } );
    }

    remove( field )
    {

    }

    add( field )
    {

    }

    _trimGraphs()
    {
        var me = this;
        var _coor = this.root._coordinate;

        //用来计算下面的hLen
        this.enabledField = this.root._coordinate.getEnabledFields( this.field );
        
        var data = {}
        _.each( this.enabledField, function( field ){
            var dataOrg = me.root.dataFrame.getFieldData(field);
            var fieldMap = _coor.getFieldMapOf( field );
            var arr = [];

            _.each( _coor.aAxis.angleList , function( _a , i ){
                //弧度
                var _r = Math.PI * _a / 180;
                var point = _coor.getPointInRadianOfR( _r, _coor.getROfNum(dataOrg[i]) );
                arr.push( {
                    field : field,
                    value : dataOrg[i],
                    point : point,
                    color : fieldMap.color
                } );
            } );
            data[ field ] = arr;
        } );

        return data;
    }

    _getStyle( style, groupInd ,def, fieldMap )
    {
        var _s = def;
        if( _.isString( style ) || _.isNumber( style ) ){
            _s = style;
        }
        if( _.isArray( style ) ){
            _s = style[ groupInd ];
        }
        if( _.isFunction( style ) ){
            _s = style( groupInd, fieldMap );
        }
        return _s;
    }

    getNodesAt(index)
    {
        //该index指当前
        var data = this.data;
        var _nodesInfoList = []; //节点信息集合
        
        _.each( this.enabledField, function( fs, i ){
            if( _.isArray(fs) ){
                _.each( fs, function( _fs, ii ){
                    //fs的结构两层到顶了
                    var node = data[ _fs ][ index ];
                    node && _nodesInfoList.push( node );
                } );
            } else {
                var node = data[ fs ][ index ];
                node && _nodesInfoList.push( node );
            }
        } );
        
        return _nodesInfoList;
    }
}