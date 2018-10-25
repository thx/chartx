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

        this.sprite  = new Sprite();
        
        this.core  = new Sprite({ 
            context : {
                x : this.origin.x,
                y : this.origin.y
            }
        });

        this.sprite.addChild( this.core );
    }


    //markLine begin
    static register(opt,app)
    {
        var app = app;
        var me = this;

        if( !_.isArray( opt ) ){
            opt = [ opt ];
        };

        _.each( opt, function( ML ){
            //如果markline有target配置，那么只现在target配置里的字段的 markline, 推荐
            var field = ML.markTo;

            if( field && _.indexOf( app.dataFrame.fields , field ) == -1 ){
                //如果配置的字段不存在，则不绘制
                return;
            }

            var _yAxis = app._coord._yAxis[0]; //默认为左边的y轴
            
            if( field ){
                //如果有配置markTo就从me._coord._yAxis中找到这个markTo所属的yAxis对象
                _.each( app._coord._yAxis, function( $yAxis, yi ){
                    var fs = _.flatten([ $yAxis.field ]);
                    if( _.indexOf( fs, field ) >= 0 ){
                        _yAxis = $yAxis;
                    }
                } );
            }

            if( ML.yAxisAlign ){
                //如果有配置yAxisAlign，就直接通过yAxisAlign找到对应的
                _yAxis = app._coord._yAxis[ ML.yAxisAlign=="left"?0:1 ];
            }

            var y;
            if( ML.y !== undefined && ML.y !== null ){
                y = Number( ML.y );
            } else {
                //如果没有配置这个y的属性，就 自动计算出来均值
                //但是均值是自动计算的，比如datazoom在draging的时候
                y = function(){
                    var _fdata = app.dataFrame.getFieldData( field );
                    var _count = 0;
                    _.each( _fdata, function( val ){
                        if( Number( val ) ){
                            _count += val;
                        }
                    } );
                    return _count / _fdata.length;
                }
            };

            if( !isNaN(y) ) {
                //如果y是个function说明是均值，自动实时计算的，而且不会超过ydatasection的范围
                _yAxis.setWaterLine( y );
            };

            app.components.push( {
                type : "once",
                plug : {
                    draw : function(){

                        var _fstyle = "#777";
                        var fieldMap = app._coord.getFieldMapOf( field );
                        if( fieldMap ){
                            _fstyle = fieldMap.color;
                        };
                        var lineStrokeStyle =  ML.line && ML.line.strokeStyle || _fstyle;
                        var textFillStyle = ML.label && ML.label.fillStyle || _fstyle;
        
                        me.creatOneMarkLine( app, ML, y, _yAxis, lineStrokeStyle, textFillStyle, field );
                    }
                }
            } );

        } );
    }

    static creatOneMarkLine( app, ML, yVal, _yAxis, lineStrokeStyle, textFillStyle, field )
    {

        var o = {
            w: app._coord.width,
            h: app._coord.height,
            yVal: yVal,
            origin: {
                x: app._coord.origin.x,
                y: app._coord.origin.y
            },
            line: {
                list: [
                    [0, 0],
                    [app._coord.width, 0]
                ]
                //strokeStyle: lineStrokeStyle
            },
            label: {
                fillStyle: textFillStyle
            },
            field: field
        };

        if( lineStrokeStyle ){
            o.line.strokeStyle = lineStrokeStyle;
        };

        var _markLine = new this( _.extend( true, ML, o) , _yAxis );
        app.components.push( {
            type : "markLine",
            plug : _markLine
        } );
        app.graphsSprite.addChild( _markLine.sprite );
    }
    //markLine end

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