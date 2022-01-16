import Canvax from "canvax"
import GraphsBase from "../index"
import { getDefaultProps } from "../../../utils/tools"

let {_, event} = Canvax;
let Polygon = Canvax.Shapes.Polygon;
let Circle = Canvax.Shapes.Circle;

class RadarGraphs extends GraphsBase
{
    static defaultProps(){
        return {
            field: {
                detail:'字段配置',
                default: null
            },
            line: {
                detail: '线配置',
                propertys: {
                    enabled: {
                        detail: '是否显示',
                        default:true
                    },
                    lineWidth: {
                        detail: '线宽',
                        default: 2
                    },
                    strokeStyle: {
                        detail: '线颜色',
                        default:null
                    },
                    lineType: {
                        detail: '线条样式,默认solid，可选dashed',
                        default: 'solid'
                    }
                }
            },
            area: {
                detail: '面积区域配置',
                propertys: {
                    enabled: {
                        detail: '是否显示',
                        default:true
                    },
                    fillStyle: {
                        detail: '面积背景色',
                        default: null
                    },
                    fillAlpha: {
                        detail: '面积透明度',
                        default:0.1
                    }
                }
            },
            node: {
                detail: '线上面的单数据节点图形配置',
                propertys: {
                    enabled: {
                        detail: '是否显示',
                        default:true
                    },
                    strokeStyle: {
                        detail: '边框色',
                        default: '#ffffff'
                    },
                    radius: {
                        detail: '半径',
                        default:4
                    },
                    lineWidth: {
                        detail: '边框大小',
                        default:1
                    }
                }
            }
        }
    }
    constructor(opt, app)
    {
        super( opt, app );
        this.type  = "radar";
        
        this.enabledField = null;

        this.groups = {
            //uv : {
            //   area : ,
            //   nodes: 
            //}
        };

        _.extend( true, this , getDefaultProps( RadarGraphs.defaultProps() ), opt );

        this.init();
    }

    init()
    {

    }

    draw(opt)
    {
        !opt && (opt ={});
        
        //let me = this;
        _.extend(true, this, opt);
        this.data = this._trimGraphs();
        
        this._widget();

        this.sprite.context.x = this.origin.x;
        this.sprite.context.y = this.origin.y;

        this.fire("complete");
    }

    _widget()
    {
        let me = this;
        let _coord = this.app.getComponent({name:'coord'});

        let iGroup = 0;
        _.each( this.data, function( list , field ){

            let group = {
            };

            let pointList = [];
            _.each( list , function( node ){
                pointList.push([ node.point.x, node.point.y ]);
            } );

            let fieldMap = _coord.getFieldMapOf( field );

            let _strokeStyle = me._getStyle( me.line.strokeStyle , fieldMap, iGroup, fieldMap.color );            
            let _lineType    = me._getStyle( me.line.lineType    , fieldMap, iGroup, fieldMap.color );

            let polyCtx = {
                pointList : pointList,
                cursor    : "pointer"
            };

            if( me.line.enabled ){
                polyCtx.lineWidth = me.line.lineWidth;
                polyCtx.strokeStyle = _strokeStyle;
                polyCtx.lineType = _lineType;
            };
            if( me.area.enabled ){
                polyCtx.fillStyle = me._getStyle( me.area.fillStyle , fieldMap, iGroup, fieldMap.color );
                polyCtx.fillAlpha = me._getStyle( me.area.fillAlpha , fieldMap, iGroup, 1 );
            };

            let _poly = new Polygon({
                hoverClone : false,
                context    : polyCtx
            });
            group.area = _poly;
            me.sprite.addChild( _poly );
            _poly.__hoverFillAlpha = _poly.context.fillAlpha + 0.2;
            _poly.__fillAlpha = _poly.context.fillAlpha;

            _poly.on(event.types.get(), function(e) {
                
                if( e.type == "mouseover" ){
                    this.context.fillAlpha = this.__hoverFillAlpha
                };
                if( e.type == "mouseout" ){
                    this.context.fillAlpha = this.__fillAlpha
                };
                
                me.app.fire( e.type, e );
            });
            

            let _nodes = [];
            if( me.node.enabled ){
                //绘制圆点
                _.each( list , function( node, i ){
                    pointList.push([ node.point.x, node.point.y ]);
                    let _node = new Circle({
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
                    _node.on(event.types.get(), function(e) {

                        //这样就会直接用这个aAxisInd了，不会用e.point去做计算
                        e.aAxisInd = this.iNode;
                        e.eventInfo = {
                            trigger : me.node,
                            nodes : [ this.nodeData ]
                        };
                        me.app.fire( e.type, e );
                    });
                    _nodes.push( _node );
                } );
            };

            group.nodes = _nodes;

            me.groups[ field ] = group;

            iGroup++;
        } );
    }

    tipsPointerOf( e )
    {
        let me = this;
        
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
    tipsPointerHideOf( )
    {
        let me = this;
        _.each( me.data , function( g ){
            _.each( g , function( node ){
                me.unfocusOf( node );
            } );
        });
    }

    focusOf( node )
    {
        if( node.focused ) return;
        let me = this;
        if(me.node.enabled){
            let _node = me.groups[ node.field ].nodes[ node.iNode ];
            _node.context.r += 1;
            _node.context.fillStyle = me.node.strokeStyle;
            _node.context.strokeStyle = _node._strokeStyle;
        }
        node.focused = true;
    }
    unfocusOf( node )
    {
        if( !node.focused ) return;
        let me = this;
        if(me.node.enabled){
            let _node = me.groups[ node.field ].nodes[ node.iNode ];
            _node.context.r -= 1;
            _node.context.fillStyle = _node._strokeStyle;
            _node.context.strokeStyle = me.node.strokeStyle;
        }
        node.focused = false;
    }

    hide( field )
    {
        //用来计算下面的hLen
        let _coord = this.app.getComponent({name:'coord'});
        this.enabledField = _coord.filterEnabledFields( this.field );
        let group = this.groups[ field ];
        if( group ){
            group.area.context.visible = false;
            _.each( group.nodes, function( element ){
                element.context.visible = false;
            } );
            
        }
    }

    show( field )
    {
        let _coord = this.app.getComponent({name:'coord'});
        this.enabledField = _coord.filterEnabledFields( this.field );
        let group = this.groups[ field ];
        if( group ){
            group.area.context.visible = true;
            _.each( group.nodes, function( element ){
                element.context.visible = true;
            } );
        }
    }

    _trimGraphs()
    {
        let me = this;
        let _coord = this.app.getComponent({name:'coord'});

        //用来计算下面的hLen
        this.enabledField = _coord.filterEnabledFields( this.field );
        
        let data = {}
        _.each( this.enabledField, function( field ){
            let dataOrg = me.dataFrame.getFieldData(field);
            let fieldMap = _coord.getFieldMapOf( field );
            let arr = [];

            _.each( _coord.aAxis.angleList , function( _a , i ){
                //弧度
                let _r = Math.PI * _a / 180;
                let point = _coord.getPointInRadianOfR( _r, _coord.getROfNum(dataOrg[i]) );
                arr.push( {
                    type    : "radar",
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

    _getStyle( style, fieldMap, iGroup ,def )
    {
        let _s = def;
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
        let data = this.data;
        let _nodesInfoList = []; //节点信息集合
        
        _.each( this.enabledField, function( fs ){
            if( _.isArray(fs) ){
                _.each( fs, function( _fs ){
                    //fs的结构两层到顶了
                    let node = data[ _fs ][ index ];
                    node && _nodesInfoList.push( node );
                } );
            } else {
                let node = data[ fs ][ index ];
                node && _nodesInfoList.push( node );
            }
        } );
        
        return _nodesInfoList;
    }
}

GraphsBase.registerComponent( RadarGraphs, 'graphs', 'radar' );

export default RadarGraphs;