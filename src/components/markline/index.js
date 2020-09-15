import Component from "../component"
import Canvax from "canvax"
import { getDefaultProps } from "../../utils/tools"

let _ = Canvax._;
let BrokenLine = Canvax.Shapes.BrokenLine;
let Sprite = Canvax.Display.Sprite;
let Text = Canvax.Display.Text;

class MarkLine extends Component
{
    static defaultProps(){
        return {
            markTo : {
                detail : '标准哪个目标字段',
                default : null
            },
            yVal : {
                detail: '组件的值',
                default: 0,
                documentation: '可能是个function，均值计算就是个function'
            },
            yPixel: {
                detail: '组件指定的具体y像素值',
                default: 0
            },
            line : {
                detail : '线的配置',
                propertys: {
                    strokeStyle : {
                        detail : '线的颜色',
                        default: '#999999'
                    },
                    lineWidth : {
                        detail : '线宽',
                        default: 1
                    },
                    lineType : {
                        detail : '线样式',
                        default: 'dashed'
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
                        default: '#666'
                    },
                    fontSize: {
                        detail : '文本字体大小',
                        default: 12
                    },
                    text : {
                        detail : '文本内容',
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

    constructor(opt , app)
    {
        super(opt , app);
        this.name = "markLine";

        this._yAxis = null;

        this.line       = {
            y           : 0,
            list        : []
        };

        this._txt = null;
        this._line = null;

        this.sprite  = new Sprite();
        this.app.graphsSprite.addChild( this.sprite );

        _.extend(true, this, getDefaultProps( MarkLine.defaultProps() ), opt);
    }

    draw( ){
        this._calculateProps();
        this.setPosition();
        this.widget();
    }

    _calculateProps(  ){
        let me = this;
        let opt = this._opt;

        //如果markline有target配置，那么只现在target配置里的字段的 markline, 推荐
        let field = opt.markTo;

        let _coord = this.app.getComponent({name:'coord'});

        if( field && _.indexOf( this.app.dataFrame.fields , field ) == -1 ){
            //如果配置的字段不存在，则不绘制
            return;
        };

        let _yAxis = _coord._yAxis[0]; //默认为左边的y轴
        
        if( field ){
            //如果有配置markTo就从 _coord._yAxis中找到这个markTo所属的yAxis对象
            _.each( _coord._yAxis, function( $yAxis, yi ){
                let fs = _.flatten([ $yAxis.field ]);
                if( _.indexOf( fs, field ) >= 0 ){
                    _yAxis = $yAxis;
                }
            } );
        };

        if( opt.yAxisAlign ){
            //如果有配置yAxisAlign，就直接通过yAxisAlign找到对应的
            _yAxis = _coord._yAxis[ opt.yAxisAlign=="left" ? 0 : 1 ];
        };

        let y;
        if( opt.y !== undefined && opt.y !== null ){
            //兼容老的配置，有些地方已经使用了y，都要改统一成yVal
            y = Number( opt.y );
        } else if( opt.yVal !== undefined && opt.yVal !== null ){
            y = Number( opt.yVal );
        } else {
            //如果没有配置这个y的属性，就 自动计算出来均值
            //但是均值是自动计算的，比如datazoom在draging的时候
            y = function(){
                let _fdata = this.app.dataFrame.getFieldData( field );
                let _count = 0;
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
            //_yAxis.setWaterLine( y );
            //_yAxis.draw();
            _yAxis.drawWaterLine( y );
        };

        let _fstyle = "#777";
        let fieldMap = _coord.getFieldMapOf( field );
        if( fieldMap ){
            _fstyle = fieldMap.color;
        };
        let lineStrokeStyle =  opt.line && opt.line.strokeStyle || _fstyle;
        let textFillStyle = opt.label && opt.label.fontColor || _fstyle;

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
        this.label.fontColor = textFillStyle;
     
        if( lineStrokeStyle ){
            this.line.strokeStyle = lineStrokeStyle;
        };

    }

    widget()
    {
        let me = this;

        let y = this._getYPos();

        let line = new BrokenLine({               //线条
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
            let txtCtx = {
                fillStyle: me.label.fontColor,
                fontSize : me.label.fontSize
            }
            let txt = new Text( me._getLabel() , {           //文字
                context : txtCtx
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

        let me = this;
        let y = this._getYPos();

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
        let me = this;
        let txt = me._txt;
        
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
        yVal = yVal || this.yVal;
        let y = yVal;
        if( _.isFunction( yVal ) ){
            y = yVal.apply( this );
        };

        return y;
    }

    _getYPos()
    {
        if( this._opt.yPixel ){
            //如果用户有指定的具体像素位置，则直接使用该值
            return -this._opt.yPixel
        }
        return -this._yAxis.getPosOfVal( this._getYVal() );;
    }

    _getLabel()
    {
        let str;
        let yVal = this._getYVal();
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

Component.registerComponent( MarkLine, 'markLine' );
export default  MarkLine
