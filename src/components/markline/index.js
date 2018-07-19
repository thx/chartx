import Component from "../component"
import Canvax from "canvax"

const BrokenLine = Canvax.Shapes.BrokenLine;
const Sprite = Canvax.Display.Sprite;
const Text = Canvax.Display.Text;
const _ = Canvax._;

export default class MarkLine extends Component
{
    constructor(opt , _yAxis)
    {
        super(opt , _yAxis);

        this._yAxis = _yAxis;
        this.w      = 0;
        this.h      = 0
        this.field  = null;
        this.origin = {
            x : 0 , y : 0
        };

        this.markTo = null; //默认给所有字段都现实一条markline，有设置的话，配置给固定的几个 field 显示markline
        this.yVal = 0;     //y 的值，可能是个function，均值计算就是个function
        
        this.line       = {
            y           : 0,
            list        : [],
            strokeStyle : '#999',
            lineWidth   : 1,
            smooth      : false,
            lineType    : 'dashed'
        };

        this.label = {
            enabled     : false,
            fillStyle   : '#999999',
            fontSize    : 12,
            text        : null, //"markline",
            lineType    : 'dashed',
            lineWidth   : 1,
            strokeStyle : "white",
            format      : null
        };

        this._txt = null;
        this._line = null;
       
        opt && _.extend(true, this, opt);

        this.init();
    }

    init()
    {
        var me = this;

        this.sprite  = new Sprite();

        this.core  = new Sprite({ 
            context : {
                x : this.origin.x,
                y : this.origin.y
            }
        });

        this.sprite.addChild( this.core );

        //me.draw();    
    }

    _getYVal()
    {
        var y = this.yVal;
        if( _.isFunction( this.yVal ) ){
            y = this.yVal( this );
        };

        return y;
    }

    _getYPos()
    {
        return this._yAxis.getYposFromVal( this._getYVal() );;
    }

    _getLabel()
    {
        var str;
        var yVal = this._getYVal();
        if( _.isFunction( this.label.format ) ){
            str = this.label.format( yVal , this );
        } else {
            if( _.isString( this.label.text ) ){
                str = this.label.text;
            } else {
                str = yVal;
            };
        };
        return str;
    }

    draw()
    {
        var me = this;

        var y = this._getYPos();

        var line = new BrokenLine({               //线条
            id : "line",
            context : {
                y           : y,
                pointList   : me.line.list,
                strokeStyle : me.line.strokeStyle,
                lineWidth   : me.line.lineWidth,
                lineType    : me.line.lineType
            }
        });
        me.core.addChild(line);
        me._line = line;


        if(me.label.enabled){
            var txt = new Text( me._getLabel() , {           //文字
                context : me.label
            })
            this._txt = txt
            me.core.addChild(txt)

            me._setTxtPos( y );
        }
    
        this.line.y = y;
    }

    reset(opt)
    {
        opt && _.extend(true, this, opt);

        var me = this;
        var y = this._getYPos();

        if( y != this.line.y ){
            this._line.animate({
                y: y
            }, {
                duration: 300,
                onUpdate: function( obj ){
                    if( me.label.enabled ){
                        me._txt.resetText( me._getLabel() );
                        me._setTxtPos( obj.y )
                        //me._txt.context.y = obj.y - me._txt.getTextHeight();
                    }
                }
                //easing: 'Back.Out' //Tween.Easing.Elastic.InOut
            });
        };
        this._line.context.strokeStyle = this.line.strokeStyle;

        this.line.y = y;
    }

    _setTxtPos( y )
    {
        var me = this;
        var txt = me._txt;
        if(_.isNumber(me.label.x)){
            txt.context.x = me.label.x
        } else {
            txt.context.x = this.w - txt.getTextWidth() - 5; 
        }
        if(_.isNumber(me.label.y)){
            txt.context.y = me.label.y
        } else {
            txt.context.y = y - txt.getTextHeight() 
        }
    }
}