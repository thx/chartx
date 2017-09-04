import Component from "../component"
import Canvax from "canvax2d"
import _ from "underscore"

var Line = Canvax.Shapes.Line;
var Circle = Canvax.Shapes.Circle;

export default class Anchor extends Component
{
	constructor( opt )
	{
		super();

        this.w = 0;
        this.h = 0;
        this.xAxis   = {
            lineWidth   : 1,
            fillStyle   : '#0088cf',
            lineType    : "dashed"
        }
        this.yAxis   = {
            lineWidth   : 1,
            fillStyle   : '#0088cf',
            lineType    : "dashed"
        }
        this.node    = {
            enabled     : 1,                 //是否有
            r           : 2,                 //半径 node 圆点的半径
            fillStyle   : '#0088cf',
            strokeStyle : '#0088cf',
            lineWidth   : 2
        }
        this.text    = {
            enabled   : 0,
            fillStyle : "#0088cf"
        }

        this.pos     = {
            x           : 0,
            y           : 0
        }   
        this.cross   = {
            x           : 0,
            y           : 0
        }

        this.sprite  = null;

        this._txt    = null;
        this._circle = null;
        this._xAxis  = null;
        this._yAxis  = null;

        this.init( opt );
	}

	init( opt )
	{
        if( opt ){
            _.deepExtend( this , opt );
        }

        this.sprite = new Canvax.Display.Sprite({
            id : "AnchorSprite"
        });
    }

    draw(opt , _xAxis , _yAxis)
    {
        this._xAxis = _xAxis;
        this._yAxis = _yAxis;
        this._initConfig( opt );
        this.sprite.context.x = this.pos.x;
        this.sprite.context.y = this.pos.y;
        this._widget();
    }

    show()
    {
        this.sprite.context.visible = true;
        this._circle.context.visible= true;
        if( this._txt ){
            this._txt.context.visible = true;
        }
    }

    hide()
    {
        this.sprite.context.visible = false;
        this._circle.context.visible= false;
        if( this._txt ){
            this._txt.context.visible = false;
        }
    }

    //初始化配置
    _initConfig( opt )
    {
        if( opt ){
            _.deepExtend( this , opt );
        }
    }

    resetCross( cross )
    {
        this._xLine.context.yStart = cross.y;
        this._xLine.context.yEnd   = cross.y;
        this._yLine.context.xStart = cross.x;
        this._yLine.context.xEnd   = cross.x;

        var nodepos = this.sprite.localToGlobal( cross );
        this._circle.context.x     = nodepos.x;
        this._circle.context.y     = nodepos.y;

        if(this.text.enabled){
            var nodepos = this.sprite.localToGlobal( cross );
            this._txt.context.x = parseInt(nodepos.x);
            this._txt.context.y = parseInt(nodepos.y);
            
            var xd    = this._xAxis.dataSection;
            var xdl   = xd.length;
            var xText = parseInt(cross.x / this.w * (xd[ xdl - 1 ] - xd[0]) + xd[0]);

            var yd    = this._yAxis.dataSection;
            var ydl   = yd.length;
            var yText = parseInt( (this.h - cross.y) / this.h * (yd[ ydl - 1 ] - yd[0]) + yd[0]);
            this._txt.resetText("（X："+xText+"，Y："+yText+"）");

            if( cross.y <= 20 ){
                this._txt.context.textBaseline = "top"
            } else {
                this._txt.context.textBaseline = "bottom"
            }
            if( cross.x <= this._txt.getTextWidth() ){
                this._txt.context.textAlign    = "left"
            } else {
                this._txt.context.textAlign    = "right"
            }
        }
    }

    _widget()
    {
        var self = this;

        self._xLine = new Line({
            id      : 'x',
            context : {
                xStart      : 0,
                yStart      : self.cross.y,
                xEnd        : self.w,
                yEnd        : self.cross.y,
                lineWidth   : self.xAxis.lineWidth,
                strokeStyle : self.xAxis.fillStyle,
                lineType    : self.xAxis.lineType
            }
        });
        self.sprite.addChild(self._xLine);

        self._yLine = new Line({
            id      : 'y',
            context : {
                xStart      : self.cross.x,
                yStart      : 0,
                xEnd        : self.cross.x,
                yEnd        : self.h,
                lineWidth   : self.yAxis.lineWidth,
                strokeStyle : self.yAxis.fillStyle,
                lineType    : self.yAxis.lineType
            }
        });
        this.sprite.addChild(self._yLine);

        var nodepos = self.sprite.localToGlobal( self.cross );
        self._circle = new Circle({
            context : {
                x           : parseInt(nodepos.x),
                y           : parseInt(nodepos.y),
                r           : self._getProp( self.node.r ),
                fillStyle   : self._getProp( self.node.fillStyle ) || "#ff0000",
                strokeStyle : self._getProp( self.node.strokeStyle ) || '#cc3300',
                lineWidth   : self._getProp( self.node.lineWidth ) || 4
            }
        });
        self.sprite.getStage().addChild(self._circle);

        if(self.text.enabled){
            self._txt = new Canvax.Display.Text( "" , {
                context : {
                    x : parseInt(nodepos.x),
                    y : parseInt(nodepos.y),
                    textAlign : "right",
                    textBaseline : "bottom",
                    fillStyle    : self.text.fillStyle
                }
            } );
            self.sprite.getStage().addChild(self._txt);
        }
    }

    _getProp( s )
    {
        if( _.isFunction( s ) ){
            return s();
        }
        return s
    } 
};