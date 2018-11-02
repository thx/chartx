import Canvax from "canvax"
import GraphsBase from "../index"

const Polygon = Canvax.Shapes.Polygon;
const Circle = Canvax.Shapes.Circle;
const _ = Canvax._;

export default class RadarGraphs extends GraphsBase
{
    constructor(opt, root)
    {
        super( opt, root );

        this.type  = "radar";
        
        this.field = null;
        this.enabledField = null;

        this.line = {
            shapeType   : "brokenLine",
            enabled     : true,
            lineWidth   : 2,
            strokeStyle :null
        };
        this.area = {
            shapeType : "path",
            enabled   : true,
            fillStyle : null,
            fillAlpha : 0.1
        };
        this.node = {
            enabled     : true,
            shapeType   : "circle",
            radius      : 4,
            strokeStyle : "#ffffff",
            lineWidth   : 1
        };

        this.groups = {
            //uv : {
            //   area : ,
            //   nodes: 
            //}
        };

        _.extend( true, this , opt );

        this.init();
    }

    init()
    {
        this.sprite = new Canvax.Display.Sprite({ 
            id : "graphsEl"
        });
    }

    draw(opt)
    {
        !opt && (opt ={});
        
        var me = this;
        _.extend(true, this, opt);
        this.data = this._trimGraphs();
        
        this._widget();

        this.sprite.context.x = this.origin.x;
        this.sprite.context.y = this.origin.y;

        this.fire("complete");
    }

    _widget()
    {
        var me = this;
        var _coord = this.root._coord;

        var iGroup = 0;
        _.each( this.data, function( list , field ){

            var group = {};

            var pointList = [];
            _.each( list , function( node, i ){
                pointList.push([ node.point.x, node.point.y ]);
            } );

            var fieldMap = _coord.getFieldMapOf( field );

            var _strokeStyle = me._getStyle( me.line.strokeStyle , iGroup, fieldMap.color, fieldMap );

            var polyCtx = {
                pointList : pointList,
                cursor    : "pointer"
            };

            if( me.line.enabled ){
                polyCtx.lineWidth = me.line.lineWidth;
                polyCtx.strokeStyle = _strokeStyle;
            };
            if( me.area.enabled ){
                polyCtx.fillStyle = me._getStyle( me.area.fillStyle , iGroup, fieldMap.color, fieldMap );
                polyCtx.fillAlpha = me._getStyle( me.area.fillAlpha , iGroup, 1, fieldMap );
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
                            r : me.node.radius,
                            lineWidth : me.node.lineWidth,
                            strokeStyle : me.node.strokeStyle,
                            fillStyle : _strokeStyle
                        }
                    });
                    me.sprite.addChild( _node );
                    _node.iNode = i;
                    _node.nodeData = node;
                    _node._strokeStyle = _strokeStyle;
                    _node.on("panstart mouseover panmove mousemove panend mouseout tap click dblclick", function(e) {

                        me.fire( e.type, e );
                        //图表触发，用来处理Tips

                        //这样就会直接用这个aAxisInd了，不会用e.point去做计算
                        e.aAxisInd = this.iNode;
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

            iGroup++;
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
                        if( eventNode.iNode == i ){
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
        var _node = me.groups[ node.field ].nodes[ node.iNode ];
        _node.context.r += 1;
        _node.context.fillStyle = me.node.strokeStyle;
        _node.context.strokeStyle = _node._strokeStyle;
        node.focused = true;
    }
    unfocusOf( node )
    {
        if( !node.focused ) return;
        var me = this;
        var _node = me.groups[ node.field ].nodes[ node.iNode ];
        _node.context.r -= 1;
        _node.context.fillStyle = _node._strokeStyle;
        _node.context.strokeStyle = me.node.strokeStyle;
        node.focused = false;
    }

    hide( field )
    {

    }

    show( field )
    {

    }

    _trimGraphs()
    {
        var me = this;
        var _coord = this.root._coord;

        //用来计算下面的hLen
        this.enabledField = this.root._coord.getEnabledFields( this.field );
        
        var data = {}
        _.each( this.enabledField, function( field ){
            var dataOrg = me.dataFrame.getFieldData(field);
            var fieldMap = _coord.getFieldMapOf( field );
            var arr = [];

            _.each( _coord.aAxis.angleList , function( _a , i ){
                //弧度
                var _r = Math.PI * _a / 180;
                var point = _coord.getPointInRadianOfR( _r, _coord.getROfNum(dataOrg[i]) );
                arr.push( {
                    field   : field,
                    iNode   : i,
                    rowData : me.dataFrame.getRowDataAt(i),
                    focused : false,
                    value   : dataOrg[i],
                    point   : point,
                    color   : fieldMap.color
                } );
            } );
            data[ field ] = arr;
        } );
        return data;
    }

    _getStyle( style, iGroup ,def, fieldMap )
    {
        var _s = def;
        if( _.isString( style ) || _.isNumber( style ) ){
            _s = style;
        };
        if( _.isArray( style ) ){
            _s = style[ iGroup ];
        };
        if( _.isFunction( style ) ){
            _s = style( iGroup, fieldMap );
        };
        if( _s === undefined || _s === null ){
            //只有undefined(用户配置了function),null才会认为需要还原皮肤色
            //“”都会认为是用户主动想要设置的，就为是用户不想他显示
            _s = def;
        };
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