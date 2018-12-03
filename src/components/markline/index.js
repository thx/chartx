import Component from "../component"
import Canvax from "canvax"
import { _ } from "mmvis"

const BrokenLine = Canvax.Shapes.BrokenLine;
const Sprite = Canvax.Display.Sprite;
const Text = Canvax.Display.Text;

export default class MarkLine extends Component
{
    constructor(opt , app)
    {
        super(opt , app);

        this.name = "markline";

        this._yAxis = null;

        this.field  = null;

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

        this.sprite  = new Sprite();
        this.app.graphsSprite.addChild( this.sprite );

        opt && _.extend(true, this, opt);
    }

    draw( ){
        this._calculateProps();
        this.setPosition();
        this.widget();
    }

    _calculateProps(  ){
        var me = this;
        var opt = this._opt;

        //如果markline有target配置，那么只现在target配置里的字段的 markline, 推荐
        var field = opt.markTo;

        var _coord = this.app.getComponent({name:'coord'});

        if( field && _.indexOf( this.app.dataFrame.fields , field ) == -1 ){
            //如果配置的字段不存在，则不绘制
            return;
        };

        var _yAxis = _coord._yAxis[0]; //默认为左边的y轴
        
        if( field ){
            //如果有配置markTo就从 _coord._yAxis中找到这个markTo所属的yAxis对象
            _.each( _coord._yAxis, function( $yAxis, yi ){
                var fs = _.flatten([ $yAxis.field ]);
                if( _.indexOf( fs, field ) >= 0 ){
                    _yAxis = $yAxis;
                }
            } );
        };

        if( opt.yAxisAlign ){
            //如果有配置yAxisAlign，就直接通过yAxisAlign找到对应的
            _yAxis = _coord._yAxis[ opt.yAxisAlign=="left" ? 0 : 1 ];
        };

        var y;
        if( opt.y !== undefined && opt.y !== null ){
            y = Number( opt.y );
        } else {
            //如果没有配置这个y的属性，就 自动计算出来均值
            //但是均值是自动计算的，比如datazoom在draging的时候
            y = function(){
                var _fdata = this.app.dataFrame.getFieldData( field );
                var _count = 0;
                _.each( _fdata, function( val ){
                    if( Number( val ) ){
                        _count += val;
                    }
                } );
                return _count / _fdata.length;
            }
        };

        //y = this._getYVal( y );

        if( !isNaN(y) ) {
            //如果y是个function说明是均值，自动实时计算的，而且不会超过ydatasection的范围
            _yAxis.setWaterLine( y );
            _yAxis.draw();
        };

        var _fstyle = "#777";
        var fieldMap = _coord.getFieldMapOf( field );
        if( fieldMap ){
            _fstyle = fieldMap.color;
        };
        var lineStrokeStyle =  opt.line && opt.line.strokeStyle || _fstyle;
        var textFillStyle = opt.label && opt.label.fillStyle || _fstyle;

        //开始计算赋值到属性上面
        this._yAxis = _yAxis;
        this.width = _coord.width;
        this.height = _coord.height;
        this.yVal = y;
        this.pos = {
            x: _coord.origin.x,
            y: _coord.origin.y
        };
        this.line.list = [
            [0, 0],
            [this.width, 0]
        ];
        this.label.fillStyle = textFillStyle;
        this.field = field;
        if( lineStrokeStyle ){
            this.line.strokeStyle = lineStrokeStyle;
        };

    }

    widget()
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
        me.sprite.addChild(line);
        me._line = line;

        if(me.label.enabled){
            var txt = new Text( me._getLabel() , {           //文字
                context : me.label
            });
            this._txt = txt;
            me.sprite.addChild(txt);

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
        
        if( this._yAxis.align == "left" ){
            txt.context.x = 5;
        } else {
            txt.context.x = this.width - txt.getTextWidth() - 5; 
        };
            
        if(_.isNumber(me.label.y)){
            txt.context.y = me.label.y
        } else {
            txt.context.y = y - txt.getTextHeight() 
        };
    }

    _getYVal( yVal )
    {
        var yVal = yVal || this.yVal;
        var y = yVal;
        if( _.isFunction( yVal ) ){
            y = yVal.apply( this );
        };

        return y;
    }

    _getYPos()
    {
        return -this._yAxis.getPosOfVal( this._getYVal() );;
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
}