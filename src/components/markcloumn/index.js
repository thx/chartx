import Component from "../component"
import Canvax from "canvax"
import { global,_, getDefaultProps, event } from "mmvis"

const Line = Canvax.Shapes.Line;
const Circle = Canvax.Shapes.Circle;
const Text = Canvax.Display.Text;

class markCloumn extends Component
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
                    enabled: {
                        detail: '是否开启',
                        default:true
                    },
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
            },
            label : {
                detail : '文本',
                propertys : {
                    enabled : {
                        detail : '是否开启',
                        default: false
                    },
                    fontColor: {
                        detail : '文本字体颜色',
                        default: null
                    },
                    fontSize: {
                        detail : '文本字体大小',
                        default: 12
                    },
                    text : {
                        detail : '文本内容',
                        documentation:"可以是函数",
                        default: null
                    },
                    format : {
                        detail : '文本格式化函数',
                        default: null
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

        this.sprite = new Canvax.Display.Sprite();
        this.app.graphsSprite.addChild( this.sprite );

        this._line  = null;
        this._lineSp = new Canvax.Display.Sprite();
        this.sprite.addChild( this._lineSp );

        this.nodes  = [];
        this._nodes = new Canvax.Display.Sprite();
        this.sprite.addChild( this._nodes );
        
        this._labels = new Canvax.Display.Sprite();
        this.sprite.addChild( this._labels );
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

        me.nodes = [];

        me.on("complete", function(){
            me._drawLine( xNode );
            me._drawNodes( xNode );
            me._drawLabels( xNode );
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
                        var _node = _.find( nodes, function( node ){
                            return node.field == me.markTo
                        } );
                        _node && (me.nodes = [ _node ]);
                    } else {
                        me.nodes = me.nodes.concat( nodes );
                    };
                    
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
        if( !me.line.enabled ) return;
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
            this._lineSp.addChild( this._line );
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
        if( !me.node.enabled ) return;

        me._nodes.removeAllChildren();
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

    }

    _drawLabels(){
        
        var me = this;
        if( !me.node.enabled ) return;

        me._labels.removeAllChildren();
        _.each( me.nodes, function( nodeData ){
            var labelCtx = {
                x           : nodeData.x,
                y           : nodeData.y - me.node.radius - 2, 
                fillStyle   : me.label.fontColor || nodeData.color,
                fontSize    : me.label.fontSize,
                textAlign   : "center",
                textBaseline: "bottom"
            };
            var text = me.label.text;
            if( _.isFunction( text ) ){
                text = text.apply( me, [ nodeData ] )
            }
            var _label = new Text( text , {
                context : labelCtx
            } );
            me._labels.addChild( _label );
        } );

    }
}


global.registerComponent( markCloumn, 'markcloumn' );

export default markCloumn;
