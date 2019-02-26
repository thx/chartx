import Component from "../component"
import Canvax from "canvax"
import { _, getDefaultProps, event } from "mmvis"

const Line = Canvax.Shapes.Line;
const Circle = Canvax.Shapes.Circle;

export default class markCloumn extends Component
{
    static defaultProps(){
        return {
            xVal : {
                detail: 'x的value值',
                default: null
            },
            x : {
                detail: 'x的像素值',
                default: null
            },
            markTo : {
                detail : '标准哪个目标字段',
                documentation: '如果设置了这个字段，那么line的起点将是这个graphs上的node节点',
                default : null
            },

            line : {
                detail: '线的配置',
                propertys: {
                    lineWidth: {
                        detail: '线宽',
                        default: 2
                    },
                    strokeStyle: {
                        detail: '线的颜色',
                        default:'#d5d5d5'
                    },
                    lineType: {
                        detail: '线的样式，虚线(dashed)实线(solid)',
                        default: 'solid'
                    },
                    startY: {
                        detail: 'startY',
                        default: 0
                    },
                    endY: {
                        detail: 'startY',
                        default: null  //'node'
                    }
                }
            },
            node : {
                detail: '数据图形节点',
                propertys: {
                    enabled : {
                        detail: '是否开启',
                        default: true
                    },
                    radius: {
                        detail: '节点半径',
                        default: 5
                    },
                    fillStyle: {
                        detail: '节点图形的背景色',
                        default: '#ffffff'
                    },
                    strokeStyle: {
                        detail: '节点图形的描边色，默认和line.strokeStyle保持一致',
                        default: null
                    },
                    lineWidth: {
                        detail: '节点图形边宽大小',
                        default: 2
                    }
                }
            }
        }
    }

    constructor( opt, app )
    {
        super(opt, app);
        this.name = "markcloumn";
        _.extend(true, this , getDefaultProps( markCloumn.defaultProps() ), opt );

        this._line  = null;
        this._nodes = new Canvax.Display.Sprite();
        this.nodes  = [];

        this.sprite = new Canvax.Display.Sprite();
        this.app.graphsSprite.addChild( this.sprite );
    }

    draw( opt )
    {
        !opt && (opt ={});
        this.width = opt.width;
        this.height = opt.height;
        this.origin = opt.origin;
        
        this.sprite.context.x = this.origin.x;
        this.sprite.context.y = this.origin.y;

        this._widget();
    }

    reset( opt ){
        opt && _.extend(true, this, opt);
        this._widget();
    }

    _widget(){
        var me = this;
        var _coord = this.app.getComponent({name:'coord'});
        var _xAxis = _coord._xAxis;

        var xNode;
        if( this.xVal != null ){
            xNode = _xAxis.getNodeInfoOfVal( this.xVal )
        };
        if( this.x != null ){
            xNode = _xAxis.getNodeInfoOfPos( this.x )
        };

        
        me._nodes.removeAllChildren();
        me.nodes = [];

        me.on("complete", function(){
            me._drawLine( xNode );
            me._drawNodes( xNode );
        });

        var i=0;

        var _graphs = this.app.getGraphs();
        _.each( _graphs, function( _g ){
            function _f(){
                i++;

                if( me.markTo && _.flatten([ _g.field ]).indexOf( me.markTo ) == -1 ){
                    //非markTo  的graph 跳过
                } else {
                    var nodes = _g.getNodesOfPos( xNode.x );
                    if( me.markTo ){
                        me.nodes = [ _.find( nodes, function( node ){
                            return node.field == me.markTo
                        } ) ];
                    } else {
                        me.nodes = me.nodes.concat( nodes );
                    }
                    
                };

                if( i == _graphs.length ){
                    me.fire("complete");
                };
            };
            if( _g.inited ){
                _f();
            } else {
                _g.on('complete', function(){
                    _f();
                });
            };
        } );
    }

    _drawLine( xNode ){
        var me = this;
        var lineOpt     = _.extend(true,{
            x           : parseInt(xNode.x),
            start       : { x: 0, y: 0 },
            end         : { x: 0, y: -me.height }, //默认贯穿整个画布
            lineWidth   : 1,
            strokeStyle : "#cccccc" 
        } , this.line);

        if( me.line.endY != null ){
            var y = 0;
            if( _.isNumber( me.line.endY ) ){
                y = me.line.endY;
            };
            if( me.line.endY == 'auto' ){
                _.each( me.nodes, function( node ){
                    y = Math.min( node.y );
                } );
            };
            lineOpt.end.y = y;
        };

        if( this._line ){
            _.extend( this._line.context , lineOpt );
        } else {
            this._line = new Line({
                context : lineOpt
            });
            this.sprite.addChild( this._line );
            this._line.on( event.types.get() , function (e) {
                e.eventInfo = {
                    //iNode : this.iNode,
                    xAxis : {},
                    nodes : me.nodes
                };
                if( me.xVal != null ){
                    e.eventInfo.xAxis.value = me.xVal;
                    e.eventInfo.xAxis.text = me.xVal+'';
                    e.eventInfo.title = me.xVal+'';
                };
                me.app.fire( e.type, e );
            });
        };
        //线条渲染结束
    }

    _drawNodes(){
        var me = this;
        _.each( me.nodes, function( nodeData ){
            var nodeCtx = _.extend({
                x           : nodeData.x,
                y           : nodeData.y, 
                cursor      : "pointer",
                r           : me.node.radius,
                lineWidth   : me.node.lineWidth   || nodeData.lineWidth,
                strokeStyle : me.node.strokeStyle || nodeData.color,
                fillStyle   : me.node.fillStyle   || nodeData.fillStyle
            });
            var _node = new Circle({
                context : nodeCtx
            });

            _node.on( event.types.get() , function (e) {
                e.eventInfo = {
                    //iNode : this.iNode,
                    xAxis : {},
                    nodes : [ nodeData ]
                };
                if( me.xVal != null ){
                    e.eventInfo.xAxis.value = me.xVal;
                    e.eventInfo.xAxis.text = me.xVal+'';
                    e.eventInfo.title = me.xVal+''
                };
                me.app.fire( e.type, e );
            });

            me._nodes.addChild( _node );
        } );
        this.sprite.addChild( this._nodes );
    }
}