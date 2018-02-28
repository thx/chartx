import Canvax from "canvax2d"
import GraphsBase from "../index"

const Circle = Canvax.Shapes.Circle;
const Rect = Canvax.Shapes.Rect;
const _ = Canvax._;

export default class ScatGraphs extends GraphsBase
{
    constructor(opts, root)
    {
        super( opts, root );

        this.type = "scat";

        this.node = {
            shapeType   : "circle", //节点的现状可以是圆 ，也可以是rect，也可以是三角形，后面两种后面实现
            maxR    : 20,  //圆圈默认最大半径
            minR    : 5,
            r       : null,
            normalR : 10,
            fillStyle : null,
            fillAlpha : 0.8,

            strokeStyle : null,
            lineWidth : 0,
            lineAlpha : 0,
            
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
        
        this.text = {
            enabled : true,
            field : null,
            format : function(text){ return text },
            fontSize: 12,
            fontColor: "#777"
        };

        _.extend( true, this , opts );

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
        this.sprite.addChild( this._shapesp );
        this.sprite.addChild( this._textsp )
    }

    draw(opts)
    {
        _.extend( true, this , opts );
        this.data = this._trimGraphs(); 
        this._widget();
        this.sprite.context.x = this.origin.x;
        this.sprite.context.y = this.origin.y;

        if( this.animation ){
            this.grow();
        };

        return this;
    }

    getNodesAt()
    {
        return []
    }

    _trimGraphs()
    {
        var tmplData = [];

        var dataLen  = this.root.dataFrame.org.length - 1; //减去title fields行
        var xField = this.root._coordinate._xAxis.field;

        for( var i=0; i<dataLen; i++ ){
            
            var rowData = this.root.dataFrame.getRowData(i);
            var xValue = rowData[ xField ];
            var yValue = rowData[ this.field ];
            var xPos = this.root._coordinate._xAxis.getPosX({ val : xValue });
            var yPos = this.root._coordinate._getYaxisOfField( this.field ).getYposFromVal( yValue );

            var fieldMap = this.root._coordinate.getFieldMapOf( this.field );

            var nodeLayoutData = {
                rowData  : rowData,
                x        : xPos,
                y        : yPos,
                value    : {
                    x    : xValue,
                    y    : yValue
                },
                field    : this.field,
                color    : fieldMap.color,
                nodeInd  : i,

                focused  : false,
                selected : false,

                //下面的属性都单独设置
                r        : null,   //这里先不设置，在下面的_setR里单独设置
                fillStyle   : null,
                strokeStyle : null,
                lineWidth : 0,
                shapeType : null,
                shape : null, //对应的canvax 节点， 在widget之后赋值
                text : null
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
        if( this.node.r != null ){
            if( _.isString( this.node.r ) && rowData[ this.node.r ] ){
                //如果配置了某个字段作为r，那么就要自动计算比例
                if( !this._rData && !this._rMaxValue && !this._rMinValue ){
                    this._rData = this.root.dataFrame.getFieldData( this.node.r );
                    this._rMaxValue = _.max( this._rData );
                    this._rMinValue = _.min( this._rData );
                };
                var rVal = rowData[ this.node.r ];
                r = this.node.minR + (rVal-this._rMinValue)/( this._rMaxValue-this._rMinValue ) * ( this.node.maxR - this.node.minR )

            };
            if( _.isFunction( this.node.r ) ){
                r = this.node.r( rowData );
            };
            if( !isNaN( parseInt( this.node.r ) ) ){
                r = parseInt( this.node.r )
            };
        };
        nodeLayoutData.r = r;
        return this;

    }

    _setText( nodeLayoutData )
    {
        if( this.text.field != null ){
            if( _.isString( this.text.field ) && nodeLayoutData.rowData[ this.text.field ] ){
                nodeLayoutData.text = nodeLayoutData.rowData[ this.text.field ]
            }
        }
    }

    _setFillStyle( nodeLayoutData )
    {
        nodeLayoutData.fillStyle = this._getStyle( this.node.fillStyle, nodeLayoutData );
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
            _style = style[ nodeLayoutData.groupInd ]
        };
        if( _.isFunction( style ) ){
            _style = style( nodeLayoutData );
        };
        if( !_style ){
            _style = nodeLayoutData.color;
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
            shapeType = shapeType[ nodeLayoutData.groupInd ]
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

        _.each( me.data , function( nodeData, iNode ){

            var _context = me._getNodeContext( nodeData );
            var Shape = nodeData.shapeType == "circle" ? Circle : Rect;

            var _node = new Shape({
                id: "shape_"+iNode,
                hoverClone : false,
                context : _context
            });
            me._shapesp.addChild( _node );

            //数据和canvax原件相互引用
            _node.nodeData = nodeData;
            _node.iNode = iNode;
            nodeData.shape = _node;

            me.node.focus.enabled && _node.hover(function(e){
                me.focusAt( this.nodeData.nodeInd );
            } , function(e){
                !this.nodeData.selected && me.unfocusAt( this.nodeData.nodeInd );
            });

            _node.on("mousedown mouseup panstart mouseover panmove mousemove panend mouseout tap click dblclick", function(e) {
               
                e.eventInfo = {
                    title : null,
                    nodes : [ this.nodeData ]
                };
                if( this.nodeData.text ){
                    e.eventInfo.title = this.nodeData.text;
                };
       
                //fire到root上面去的是为了让root去处理tips
                me.root.fire( e.type, e );

                me.triggerEvent( me.node , e );
            });

            //如果有label
            if( nodeData.text && me.text.enabled ){
                
                var text = nodeData.text
                var _text =  new Canvax.Display.Text( text , {
                    id: "text_"+iNode,
                    context: me._getTextContext( nodeData )
                });
        
                me._textsp.addChild(_text);

                //图形节点和text文本相互引用
                _node.text = _text;
                _text.shape = _node;
            }
        
        } );
     
    }

    _getTextContext( nodeData )
    {
        var ctx = {
            x: nodeData.x,
            y: nodeData.y,
            fillStyle: this.text.fontColor,
            fontSize: this.text.fontSize,
            textAlign : 'center',
            textBaseline : 'middle'
        };
        if( this.animation ){
            ctx.x = 0;
            ctx.y = 0;
        };
        return ctx;
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
            r : nodeData.r,
            fillStyle : nodeData.fillStyle,
            strokeStyle : nodeData.strokeStyle,
            lineWidth : nodeData.lineWidth,
            fillAlpha : this.node.fillAlpha,
            cursor : "pointer"
        };

        if( this.animation ){
            ctx.x = 0;
            ctx.y = 0;
            ctx.r = 1;
        };
        return ctx;
    }

    /**
     * 生长动画
     */
    grow()
    {
        _.each( this.data , function( nodeData ){
            nodeData.shape.animate({
                x : nodeData.x,
                y : nodeData.y,
                r : nodeData.r
            }, {
                onUpdate: function( opts ){
                    if( this.text ){
                        this.text.context.x = opts.x;
                        this.text.context.y = opts.y;
                    }
                },
                delay : Math.round(Math.random()*300)
            })
        } );
    }


    focusAt( ind ){
        var nodeData = this.data[ ind ];
        if( !this.node.focus.enabled || nodeData.focused ) return;

        var nctx = nodeData.shape.context; 
        nctx.lineWidth = this.node.focus.lineWidth;
        nctx.lineAlpha = this.node.focus.lineAlpha;
        nctx.fillAlpha = this.node.focus.fillAlpha;
        nodeData.focused = true;
    }
    
    unfocusAt( ind ){
        var nodeData = this.data[ ind ];
        if( !this.node.focus.enabled || !nodeData.focused ) return;
        var nctx = nodeData.shape.context; 
        nctx.lineWidth = this.node.lineWidth;
        nctx.lineAlpha = this.node.lineAlpha;
        nctx.fillAlpha = this.node.fillAlpha;

        nodeData.focused = false;
    }
    
    selectAt( ind ){
        
        var nodeData = this.data[ ind ];
        if( !this.node.select.enabled || nodeData.selected ) return;
        
        var nctx = nodeData.shape.context; 
        nctx.lineWidth = this.node.select.lineWidth;
        nctx.lineAlpha = this.node.select.lineAlpha;
        nctx.fillAlpha = this.node.select.fillAlpha;

        nodeData.selected = true;
    }

    unselectAt( ind ){
        var nodeData = this.data[ ind ];
        if( !this.node.select.enabled || !nodeData.selected ) return;
       
        var nctx = nodeData.shape.context; 

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
