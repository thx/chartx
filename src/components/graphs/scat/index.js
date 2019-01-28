import Canvax from "canvax"
import GraphsBase from "../index"
import { _,event,getDefaultProps } from "mmvis"

const Circle = Canvax.Shapes.Circle;
const Rect = Canvax.Shapes.Rect;
const Line = Canvax.Shapes.Line;

export default class ScatGraphs extends GraphsBase
{
    static defaultProps(){
        return {
            field: {
                detail: '字段配置',
                default: null
            },
            aniOrigin: {
                detail: '节点动画的原点',
                default:'default',
                documentation: '可选的还有center（坐标正中）、origin（坐标原点）'
            },
            node: {
                detail: '单数据节点图形设置',
                propertys: {
                    shapeType: {
                        detail: '图形类型',
                        default: 'circle',
                        documentation: '节点的现状可以是圆 ，也可以是rect，也可以是三角形，后面两种后面实现'
                    },
                    maxRadius: {
                        detail: '节点最大半径',
                        default: 25
                    },
                    minRadius: {
                        detail: '节点最小半径',
                        default: 5
                    },
                    radius: {
                        detail: '半径',
                        default: null
                    },
                    normalRadius: {
                        detail: '默认半径',
                        default: 15
                    },
                    fillStyle: {
                        detail: '节点景色',
                        default: null
                    },
                    fillAlpha: {
                        detail: '节点透明度',
                        default: 0.8
                    },
                    strokeStyle: {
                        detail: '节点描边颜色',
                        default: null
                    },
                    lineWidth: {
                        detail: '节点描边线宽',
                        default: 0
                    },
                    lineAlpha: {
                        detail : '节点描边透明度',
                        default: 0
                    },
    
                    focus: {
                        detail: "节点hover态设置",
                        propertys: {
                            enabled: {
                                detail: '是否开启',
                                default: true
                            },
                            lineWidth: {
                                detail: 'hover后的边框大小',
                                default: 6
                            },
                            lineAlpha: {
                                detail: 'hover后的边框透明度',
                                default: 0.2
                            },
                            fillAlpha: {
                                detail: 'hover后的背景透明度',
                                default: 0.8
                            }
                        }
                    },
    
                    select: {
                        detail: "节点选中态设置",
                        propertys: {
                            enabled: {
                                detail: '是否开启',
                                default: false
                            },
                            lineWidth: {
                                detail: '选中后的边框大小',
                                default: 8
                            },
                            lineAlpha: {
                                detail: '选中后的边框透明度',
                                default: 0.4
                            },
                            fillAlpha: {
                                detail: '选中后的背景透明度',
                                default: 1
                            }
                        }
                    }
                }
            },
            line: {
                detail: '每个节点和指标轴线的连线',
                propertys: {
                    enabled: {
                        detail: '是否开启',
                        default: false
                    },
                    lineWidth: {
                        detail: '连线宽',
                        default: 1
                    },
                    strokeStyle: {
                        detail: '连线颜色',
                        default: '#ccc'
                    },
                    lineType: {
                        detail: '连线类型',
                        default: 'dashed'
                    }
                }
            },
            label: {
                detail: '文本设置',
                propertys: {
                    enabled: {
                        detail: '是否开启',
                        default: true
                    },
                    field: {
                        detail: '获取label的字段',
                        default: null
                    },
                    format: {
                        detail: 'label格式化处理函数',
                        default:function(txt, nodeData){ 
                            return txt 
                        }
                    },
                    fontSize: {
                        detail: 'label字体大小',
                        default: 13
                    },
                    fontColor: {
                        detail: '字体颜色',
                        default: '#888'
                    },
                    strokeStyle: {
                        detail: '字体描边颜色',
                        default: '#ffffff'
                    },
                    lineWidth: {
                        detail: '描边大小',
                        default: 0
                    },
    
                    textAlign: {
                        detail: '水平对齐方式',
                        default:'center'
                    },
                    verticalAlign: {
                        detail: '垂直基线对齐方式',
                        default:'middle'
                    },
                    position: {
                        detail: '文本布局位置',
                        documentation:'auto(目前等于center，还未实现),center,top,right,bottom,left',
                        default:'center'
                    },
                    offsetX: {
                        detail: 'x方向偏移量',
                        default: 0
                    },
                    offsetY: {
                        detail: 'y方向偏移量',
                        default: 0
                    }
                }
            }
        }
    }

    constructor(opt, app)
    {
        super( opt, app );
        this.type = "scat";

        //计算半径的时候需要用到， 每次执行_trimGraphs都必须要初始化一次
        this._rData = null;
        this._rMaxValue = null;
        this._rMinValue = null;

        _.extend( true, this , getDefaultProps( ScatGraphs.defaultProps() ), opt );

        this.init();
    }

    init()
    {
        this._shapesp = new Canvax.Display.Sprite({ 
            id : "shapesp"
        });
        this._textsp = new Canvax.Display.Sprite({ 
            id : "textsp"
        });
        this._linesp = new Canvax.Display.Sprite({ 
            id : "textsp"
        });
        
        this.sprite.addChild( this._linesp );
        this.sprite.addChild( this._shapesp );
        this.sprite.addChild( this._textsp );
    }

    draw(opt)
    {
        !opt && (opt ={});

        _.extend( true, this , opt );
        this.data = this._trimGraphs(); 
        this._widget();
        this.sprite.context.x = this.origin.x;
        this.sprite.context.y = this.origin.y;

        var me = this;
        if( this.animation && !opt.resize && !me.inited ){
            this.grow( function(){
                me.fire("complete");
            } );
        } else {
            this.fire("complete");
        }

        return this;
    }

    resetData( dataFrame , dataTrigger )
    {
        this.dataFrame = dataFrame;
        this.data = this._trimGraphs(); 
        this._widget();
    }

    getNodesAt()
    {
        return []
    }

    _trimGraphs()
    {
        var tmplData = [];

        var _coord = this.app.getComponent({name:'coord'});
        var dataLen  = this.dataFrame.length;

        ////计算半径的时候需要用到， 每次执行_trimGraphs都必须要初始化一次
        this._rData = null;
        this._rMaxValue = null;
        this._rMinValue = null;

        for( var i=0; i<dataLen; i++ ){
            
            var rowData = this.dataFrame.getRowDataAt(i);
            var fieldMap = _coord.getFieldMapOf( this.field );

            var point = _coord.getPoint( {
                iNode : i,
                field : this.field,
                value : {
                    //x:
                    y : rowData[ this.field ]
                }
            } );

            var nodeLayoutData = {
                rowData    : rowData,
                x          : point.pos.x,
                y          : point.pos.y,
                value      : point.value,
                field      : this.field,
                fieldColor : fieldMap.color,
                iNode      : i,

                focused    : false,
                selected   : false,

                //下面的属性都单独设置
                radius     : null,   //这里先不设置，在下面的_setR里单独设置
                fillStyle  : null,
                color      : null,
                strokeStyle: null,
                lineWidth  : 0,
                shapeType  : null,
                label      : null,

                nodeElement: null //对应的canvax 节点， 在widget之后赋值
            };

            this._setR( nodeLayoutData );
            this._setFillStyle( nodeLayoutData );
            this._setStrokeStyle( nodeLayoutData );
            this._setLineWidth( nodeLayoutData );
            this._setNodeType( nodeLayoutData );
            this._setText( nodeLayoutData );

            tmplData.push( nodeLayoutData );
        };

        return tmplData;
    }

    _setR( nodeLayoutData )
    {

        var r = this.node.normalRadius;
        var rowData = nodeLayoutData.rowData;
        if( this.node.radius != null ){
            if( _.isString( this.node.radius ) && rowData[ this.node.radius ] ){
                //如果配置了某个字段作为r，那么就要自动计算比例
                if( !this._rData && !this._rMaxValue && !this._rMinValue ){
                    this._rData = this.dataFrame.getFieldData( this.node.radius );
                    this._rMaxValue = _.max( this._rData );
                    this._rMinValue = _.min( this._rData );
                };

                var rVal = rowData[ this.node.radius ];

                if( this._rMaxValue ==  this._rMinValue ){
                    r = this.node.minRadius + ( this.node.maxRadius - this.node.minRadius )/2;
                } else {
                    r = this.node.minRadius + (rVal-this._rMinValue)/( this._rMaxValue-this._rMinValue ) * ( this.node.maxRadius - this.node.minRadius )
                };
            };
            if( _.isFunction( this.node.radius ) ){
                r = this.node.radius( rowData );
            };
            if( !isNaN( parseInt( this.node.radius ) ) ){
                r = parseInt( this.node.radius )
            };
        };
        nodeLayoutData.radius = r;
        return this;

    }

    _setText( nodeLayoutData )
    {
        if( this.label.field != null ){
            if( _.isString( this.label.field ) && nodeLayoutData.rowData[ this.label.field ] ){
                nodeLayoutData.label = this.label.format( nodeLayoutData.rowData[ this.label.field ], nodeLayoutData );
            }
        }
    }

    _setFillStyle( nodeLayoutData )
    {
        nodeLayoutData.color = nodeLayoutData.fillStyle = this._getStyle( this.node.fillStyle, nodeLayoutData );
        return this;
    }

    _setStrokeStyle( nodeLayoutData )
    {
        nodeLayoutData.strokeStyle = this._getStyle( (this.node.strokeStyle || this.node.fillStyle), nodeLayoutData );
        return this;
    }

    _getStyle( style, nodeLayoutData )
    {
        var _style = style;
        if( _.isArray( style ) ){
            _style = style[ nodeLayoutData.iGroup ]
        };
        if( _.isFunction( style ) ){
            _style = style( nodeLayoutData );
        };
        if( !_style ){
            _style = nodeLayoutData.fieldColor;
        };
        return _style;
    }

    _setLineWidth( nodeLayoutData )
    {
        nodeLayoutData.lineWidth = this.node.lineWidth;
        return this;
    }

    _setNodeType( nodeLayoutData )
    {
        var shapeType = this.node.shapeType;
        if( _.isArray( shapeType ) ){
            shapeType = shapeType[ nodeLayoutData.iGroup ]
        };
        if( _.isFunction( shapeType ) ){
            shapeType = shapeType( nodeLayoutData );
        };
        if( !shapeType ){
            shapeType = "circle"
        };
        nodeLayoutData.shapeType = shapeType;
        return this;
    }

    //根据layoutdata开始绘制
    _widget()
    {
        var me = this;

        //那么有多余的元素要去除掉 begin
        if( me._shapesp.children.length > me.data.length ){
            for( var i=me.data.length; i<me._shapesp.children.length; i++ ){
                me._shapesp.getChildAt( i-- ).destroy();
            }
        };
        if( me._textsp.children.length > me.data.length ){
            for( var i=me.data.length; i<me._textsp.children.length; i++ ){
                me._textsp.getChildAt( i-- ).destroy();
            }
        };
        if( me._linesp.children.length > me.data.length ){
            for( var i=me.data.length; i<me._linesp.children.length; i++ ){
                me._linesp.getChildAt( i-- ).destroy();
            }
        };
        //那么有多余的元素要去除掉 end

        _.each( me.data , function( nodeData, iNode ){

            var _context = me._getNodeContext( nodeData );
            var Shape = nodeData.shapeType == "circle" ? Circle : Rect;

            var _nodeElement = me._shapesp.getChildAt( iNode );
            if( !_nodeElement ){
                _nodeElement = new Shape({
                    id: "shape_"+iNode,
                    hoverClone : false,
                    context : _context
                });
                me._shapesp.addChild( _nodeElement );

                _nodeElement.on(event.types.get(), function(e) {
                    
                     e.eventInfo = {
                         title : null,
                         trigger : me.node,
                         nodes : [ this.nodeData ]
                     };
                     if( this.nodeData.label ){
                         e.eventInfo.title = this.nodeData.label;
                     };
            
                     //fire到root上面去的是为了让root去处理tips
                     me.app.fire( e.type, e );
                 });

            } else {
                //_nodeElement.context = _context;
                //_.extend( _nodeElement.context, _context );
                _nodeElement.animate( _context );
            };
        
            //数据和canvax原件相互引用
            _nodeElement.nodeData = nodeData;
            _nodeElement.iNode = iNode;
            nodeData.nodeElement = _nodeElement;

            me.node.focus.enabled && _nodeElement.hover(function(e){
                me.focusAt( this.nodeData.iNode );
            } , function(e){
                !this.nodeData.selected && me.unfocusAt( this.nodeData.iNode );
            });

            

            if( me.line.enabled ){

                var _line = me._linesp.getChildAt( iNode );
                var _lineContext = {
                    start : {
                        x : _context.x,
                        y : _context.y+_context.r
                    },
                    end : {
                        x : _context.x,
                        y : 0
                    },
                    lineWidth : me.line.lineWidth,
                    strokeStyle : me.line.strokeStyle,
                    lineType: me.line.lineType
                };

                if(!_line){
                    _line = new Line({
                        context : _lineContext
                    });
                    me._linesp.addChild( _line );
                } else {
                    _line.animate( _lineContext )
                }

                _nodeElement._line = _line;
                
            };

            //如果有label
            if( nodeData.label && me.label.enabled ){
        
                var _label = me._textsp.getChildAt( iNode );
                var _labelContext = {};
                if( !_label ){
                    _label = new Canvax.Display.Text( nodeData.label , {
                        id: "scat_text_"+iNode,
                        context: {}
                    });
                    _labelContext = me._getTextContext( _label, _context );
                    //_label.animate( _labelContext );
                    _.extend( _label.context , _labelContext );
                    me._textsp.addChild( _label );
                    
                } else {
                    _label.resetText(  nodeData.label );
                    _labelContext = me._getTextContext( _label, _context );
                    _label.animate( _labelContext );
                };

                //图形节点和text文本相互引用
                _nodeElement.labelElement = _label;
                _label.nodeElement = _nodeElement;
            };
        
        } );
     
    }

    _getTextPosition( _label, opt )
    {
        var x=0,y=0;
        switch( this.label.position ){
            case "center" :
                x = opt.x;
                y = opt.y;
                break;
            case "top" :
                x = opt.x;
                y = opt.y - opt.r;
                break;
            case "right" :
                x = opt.x + opt.r;
                y = opt.y;
                break;
            case "bottom" :
                x = opt.x;
                y = opt.y + opt.r;
                break;
            case "left" :
                x = opt.x - opt.r;
                y = opt.y;
                break;
            case "auto" :
                x = opt.x;
                y = opt.y;
                if( _label.getTextWidth() > opt.r*2 ){
                    y = opt.y + opt.r + _label.getTextHeight() * 0.5;
                };
                break;
        };

        var point = {
            x: x + this.label.offsetX,
            y: y + this.label.offsetY
        };

        return point;
    }

    _getTextContext( _label, _context )
    {
        var textPoint = this._getTextPosition( _label, _context );

        var fontSize = this.label.fontSize;
        if( _label.getTextWidth() > _context.r*2 ){
            fontSize -= 2;
        };
        
        var ctx = {
            x: textPoint.x,
            y: textPoint.y,
            fillStyle: this.label.fontColor || _context.fillStyle,
            fontSize: fontSize,
            strokeStyle : this.label.strokeStyle || _context.fillStyle,
            lineWidth : this.label.lineWidth,
            textAlign : this.label.textAlign,
            textBaseline : this.label.verticalAlign
        };

        if( this.animation && !this.inited ){
            this._setCtxAniOrigin(ctx);
        };
        
        return ctx;
    }

    _setCtxAniOrigin( ctx ) {
        if( this.aniOrigin == "default" ){
            ctx.y = 0;
        };
        if( this.aniOrigin == "origin" ){
            var _coord = this.app.getComponent({name:'coord'});
            var originPoint = _coord.getOriginPos( {field: this.field} );
            ctx.x = originPoint.x;
            ctx.y = originPoint.y;
        };
        if( this.aniOrigin == "center" ){
            ctx.x = this.width/2;
            ctx.y = -(this.height/2);
        }; 
    }

    _getNodeContext( nodeData )
    {
        if( nodeData.shapeType == "circle" ){
            return this._getCircleContext( nodeData );
        }
    }

    _getCircleContext( nodeData )
    {
        var ctx = {
            x : nodeData.x,
            y : nodeData.y,
            r : nodeData.radius,
            fillStyle : nodeData.fillStyle,
            strokeStyle : nodeData.strokeStyle,
            lineWidth : nodeData.lineWidth,
            fillAlpha : this.node.fillAlpha,
            cursor : "pointer"
        };

        if( this.animation && !this.inited ){
            
            this._setCtxAniOrigin(ctx);

            ctx.r = 1;
        };
        return ctx;
    }

    /**
     * 生长动画
     */
    grow( callback )
    {
        var i = 0;
        var l = this.data.length-1;
        var me = this;
        _.each( this.data , function( nodeData ){
            nodeData.nodeElement.animate({
                x : nodeData.x,
                y : nodeData.y,
                r : nodeData.radius
            }, {
                onUpdate: function( opt ){
                    if( this.labelElement && this.labelElement.context ){
                        var _textPoint = me._getTextPosition( this.labelElement, opt );
                        this.labelElement.context.x = _textPoint.x;
                        this.labelElement.context.y = _textPoint.y;
                    };
                    if( this._line && this._line.context ){
                        this._line.context.start.y = opt.y+opt.r;
                    };
                },
                delay : Math.round(Math.random()*300),
                onComplete : function(){
                    i = i+1;
                    if( i == l ){
                        callback && callback();
                    }
                }
            })
        } );
    }


    focusAt( ind ){
        var nodeData = this.data[ ind ];
        if( !this.node.focus.enabled || nodeData.focused ) return;

        var nctx = nodeData.nodeElement.context; 
        nctx.lineWidth = this.node.focus.lineWidth;
        nctx.lineAlpha = this.node.focus.lineAlpha;
        nctx.fillAlpha = this.node.focus.fillAlpha;
        nodeData.focused = true;
    }
    
    unfocusAt( ind ){
        var nodeData = this.data[ ind ];
        if( !this.node.focus.enabled || !nodeData.focused ) return;
        var nctx = nodeData.nodeElement.context; 
        nctx.lineWidth = this.node.lineWidth;
        nctx.lineAlpha = this.node.lineAlpha;
        nctx.fillAlpha = this.node.fillAlpha;

        nodeData.focused = false;
    }
    
    selectAt( ind ){
        
        var nodeData = this.data[ ind ];
        if( !this.node.select.enabled || nodeData.selected ) return;
        
        var nctx = nodeData.nodeElement.context; 
        nctx.lineWidth = this.node.select.lineWidth;
        nctx.lineAlpha = this.node.select.lineAlpha;
        nctx.fillAlpha = this.node.select.fillAlpha;

        nodeData.selected = true;
    }

    unselectAt( ind ){
        var nodeData = this.data[ ind ];
        if( !this.node.select.enabled || !nodeData.selected ) return;
       
        var nctx = nodeData.nodeElement.context; 

        if( nodeData.focused ) {
            //有e 说明这个函数是事件触发的，鼠标肯定还在node上面
            nctx.lineWidth = this.node.focus.lineWidth;
            nctx.lineAlpha = this.node.focus.lineAlpha;
            nctx.fillAlpha = this.node.focus.fillAlpha;
        } else {
            nctx.lineWidth = this.node.lineWidth;
            nctx.lineAlpha = this.node.lineAlpha;
            nctx.fillAlpha = this.node.fillAlpha;
        }

        nodeData.selected = false;
    }

}
