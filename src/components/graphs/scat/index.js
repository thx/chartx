import Canvax from "canvax"
import GraphsBase from "../index"

const Circle = Canvax.Shapes.Circle;
const Rect = Canvax.Shapes.Rect;
const Line = Canvax.Shapes.Line;
const _ = Canvax._;

export default class ScatGraphs extends GraphsBase
{
    constructor(opt, root)
    {
        super( opt, root );

        this.type = "scat";

        this.field  = null;

        //TODO:待开发，用groupField来做分组，比如分组出男女两组，然后方便做图例（目前没给scat实现合适的图例）
        this.groupField = null; 

        this.node = {
            shapeType : "circle", //节点的现状可以是圆 ，也可以是rect，也可以是三角形，后面两种后面实现
            maxRadius : 25,  //圆圈默认最大半径
            minRadius : 5,
            radius    : null,
            normalR   : 15,
            fillStyle : null,
            fillAlpha : 0.8,

            strokeStyle : null,
            lineWidth   : 0,
            lineAlpha   : 0,
            
            focus : {
                enabled : true,
                lineWidth : 6,
                lineAlpha : 0.2,
                fillAlpha : 0.8
            },
            select : {
                enabled : true,
                lineWidth : 8,
                lineAlpha : 0.4,
                fillAlpha : 1
            }

            //onclick ondblclick 注册的事件都是小写
        };

        //从node点到垂直坐标y==0的连线
        //气球的绳子
        this.line = {
            enabled: false,
            lineWidth : 1,
            strokeStyle : "#ccc",
            lineType : "dashed"
        };
        
        this.label = {
            enabled : true,
            field : null,
            format : function(txt, nodeData){ 
                return txt 
            },
            fontSize: 13,
            fontColor: "#888",//"#888",//如果外面设置为null等false值，就会被自动设置为nodeData.fillStyle
            strokeStyle : "#ffffff",
            lineWidth : 0,

            //rotation : 0, //柱状图中有需求， 这里没有目前
            align : "center",  //left center right
            verticalAlign : "middle", //top middle bottom
            position : "center", //auto(目前等于center，还未实现),center,top,right,bottom,left
            offsetX : 0,
            offsetY : 0
        };

        //动画的起始位置， 默认x=data.x y = 0
        this.aniOrigin = "default" //center（坐标正中） origin（坐标原点）
        
        _.extend( true, this , opt );

        //计算半径的时候需要用到， 每次执行_trimGraphs都必须要初始化一次
        this._rData = null;
        this._rMaxValue = null;
        this._rMinValue = null;


        this.init( );
    }

    init()
    {
        this.sprite = new Canvax.Display.Sprite({ 
            id : "graphsEl"
        });

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

        var dataLen  = this.dataFrame.length;
        var xField = this.root._coord._xAxis.field;

        ////计算半径的时候需要用到， 每次执行_trimGraphs都必须要初始化一次
        this._rData = null;
        this._rMaxValue = null;
        this._rMinValue = null;

        for( var i=0; i<dataLen; i++ ){
            
            var rowData = this.dataFrame.getRowData(i);
            var xValue = rowData[ xField ];
            var yValue = rowData[ this.field ];
            var xPos = this.root._coord._xAxis.getPosX({ val : xValue });
            var yPos = this.root._coord._getYaxisOfField( this.field ).getYposFromVal( yValue );

            var fieldMap = this.root._coord.getFieldMapOf( this.field );

            var nodeLayoutData = {
                rowData  : rowData,
                x        : xPos,
                y        : yPos,
                value    : {
                    x    : xValue,
                    y    : yValue
                },
                field    : this.field,
                fieldColor : fieldMap.color,
                iNode    : i,

                focused  : false,
                selected : false,

                //下面的属性都单独设置
                radius      : null,   //这里先不设置，在下面的_setR里单独设置
                fillStyle   : null,
                color       : null,
                strokeStyle : null,
                lineWidth : 0,
                shapeType : null,
                label : null,

                nodeElement : null //对应的canvax 节点， 在widget之后赋值
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

        var r = this.node.normalR;
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

                _nodeElement.on("mousedown mouseup panstart mouseover panmove mousemove panend mouseout tap click dblclick", function(e) {
                    
                     e.eventInfo = {
                         title : null,
                         nodes : [ this.nodeData ]
                     };
                     if( this.nodeData.label ){
                         e.eventInfo.title = this.nodeData.label;
                     };
            
                     //fire到root上面去的是为了让root去处理tips
                     me.root.fire( e.type, e );
                     me.triggerEvent( me.node , e );
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
                    _labelContext = me._getTextContext( _label, _nodeElement );
                    //_label.animate( _labelContext );
                    _.extend( _label.context , _labelContext );
                    me._textsp.addChild( _label );
                    
                } else {
                    _label.resetText(  nodeData.label );
                    _labelContext = me._getTextContext( _label, _nodeElement );
                    _label.animate( _labelContext );
                };

                //图形节点和text文本相互引用
                _nodeElement._label = _label;
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

    _getTextContext( _label, _nodeElement )
    {
        var textPoint = this._getTextPosition( _label, _nodeElement.context );

        var fontSize = this.label.fontSize;
        if( _label.getTextWidth() > _nodeElement.context.r*2 ){
            fontSize -= 2;
        };
        
        var ctx = {
            x: textPoint.x,
            y: textPoint.y,
            fillStyle: this.label.fontColor || _nodeElement.context.fillStyle,
            fontSize: fontSize,
            strokeStyle : this.label.strokeStyle || _nodeElement.context.fillStyle,
            lineWidth : this.label.lineWidth,
            textAlign : this.label.align,
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
            ctx.x = this.root._coord._yAxis[0]._axisLine.context.x;//0;
            ctx.y = this.root._coord._xAxis._axisLine.context.y;//0;
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
                    if( this._label && this._label.context ){
                        var _textPoint = me._getTextPosition( this._label, opt );
                        this._label.context.x = _textPoint.x;
                        this._label.context.y = _textPoint.y;
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
