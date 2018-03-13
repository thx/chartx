import Canvax from "canvax2d"
import GraphsBase from "../index"

const Polygon = Canvax.Shapes.Polygon;
const Circle = Canvax.Shapes.Circle;
const _ = Canvax._;

export default class RadarGraphs extends GraphsBase
{
    constructor(opts, root)
    {
        super( opts, root );

        this.type = "radar";
        
        this.enabledField = null;

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
            shapeType : "circle",
            r : 4,
            strokeStyle : "#ffffff",
            lineWidth : 1
        };

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
        var _coor = this.root._coord;

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
                pointList : pointList,
                cursor    : "pointer"
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
                hoverClone : false,
                context    : polyCtx
            });
            group.area = _poly;
            me.sprite.addChild( _poly );

            _poly.on("panstart mouseover panmove mousemove panend mouseout tap click dblclick", function(e) {
                
                if( e.type == "mouseover" ){
                    this.context.fillAlpha += 0.2
                };
                if( e.type == "mouseout" ){
                    this.context.fillAlpha -= 0.2
                };
                
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
                            cursor : "pointer",
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
                    _node._strokeStyle = _strokeStyle;
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

    tipsPointerOf( e )
    {
        var me = this;
        
        me.tipsPointerHideOf( e );

        if( e.eventInfo && e.eventInfo.nodes ){
            _.each( e.eventInfo.nodes, function( eventNode ){
                if( me.data[ eventNode.field ] ){
                    _.each( me.data[ eventNode.field ] , function( n, i ){
                        if( eventNode.nodeInd == i ){
                            me.focusOf(n);
                        }
                        //else {
                        //    me.unfocusOf(n);
                        //}
                    });
                };
            } );
        }
    }
    tipsPointerHideOf( e )
    {
        var me = this;
        _.each( me.data , function( g, i ){
            _.each( g , function( node ){
                me.unfocusOf( node );
            } );
        });
    }

    focusOf( node )
    {
        if( node.focused ) return;
        var me = this;
        var _node = me.groups[ node.field ].nodes[ node.nodeInd ];
        _node.context.r += 1;
        _node.context.fillStyle = me.node.strokeStyle;
        _node.context.strokeStyle = _node._strokeStyle;
        node.focused = true;
    }
    unfocusOf( node )
    {
        if( !node.focused ) return;
        var me = this;
        var _node = me.groups[ node.field ].nodes[ node.nodeInd ];
        _node.context.r -= 1;
        _node.context.fillStyle = _node._strokeStyle;
        _node.context.strokeStyle = me.node.strokeStyle;
        node.focused = false;
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
        var _coor = this.root._coord;

        //用来计算下面的hLen
        this.enabledField = this.root._coord.getEnabledFields( this.field );
        
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
                    nodeInd : i,
                    focused : false,
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