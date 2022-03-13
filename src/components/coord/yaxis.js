import Canvax from "canvax"
import {getDefaultProps} from "../../utils/tools"
import Axis from "./axis"
import numeral from "numeral"

let _ = Canvax._;
let Line = Canvax.Shapes.Line;

export default class yAxis extends Axis
{
    static defaultProps(){
        return {
            align : {
                detail : '左右轴设置',
                default: 'left'
            },
            layoutType : {
                detail : '布局方式',
                default: 'proportion'
            }
        }
    }

	constructor( opt, data, _coord){

        super(opt, data.org);
        this.type   = "yAxis";
        this._coord = _coord || {};

        this._title = null;//this.label对应的文本对象
        this._axisLine  = null;

        this.maxW   = 0;//最大文本的 width
        this.pos    = {
            x: 0,
            y: 0
        };
        this.yMaxHeight = 0;//y轴最大高
        this.layoutData = []; //dataSection 对应的layout数据{y:-100, value:'1000'}
        this.sprite     = null;
        this.isH        = false; //是否横向

        _.extend( true, this, getDefaultProps( yAxis.defaultProps() ) , opt );
        
        this.init(opt);
        
    }

    init(opt )
    {
        this._setField();
        this._initHandle( opt );

        this.sprite = new Canvax.Display.Sprite({
            id: "yAxisSprite_"+new Date().getTime()
        });
        this.rulesSprite = new Canvax.Display.Sprite({
            id: "yRulesSprite_"+new Date().getTime()
        });
        this.sprite.addChild( this.rulesSprite );
    }

    _initHandle( opt ){
        if( opt ){
            if( opt.isH && (!opt.label || opt.label.rotaion === undefined) ){
                //如果是横向直角坐标系图
                this.label.rotation = 90;
            };
    
            //yAxis中的label.textAlign 要额外处理，默认是center。
            //除非用户强制设置textAlign，否则就要根据this.align做一次二次处理
            if( !opt.label || !opt.label.textAlign ){
                this.label.textAlign = this.align == "left" ? "right" : "left"
            };
        };

        this.setDataSection();
        this._getTitle();
        this._setYaxisWidth();
    }

    _setField( field ){
        if( field ){
            this.field = field;
        };
        //extend会设置好this.field
        //先要矫正子啊field确保一定是个array
        if( !_.isArray(this.field) ){
            this.field = [this.field];
        };
    }

    /**
     * 
     * opt  pos,yMaxHeight,resize
     */
    draw(opt)
    {
        
        _.extend(true, this, (opt || {} ));

        this.height = parseInt( this.yMaxHeight - this._getYAxisDisLine() );
    
        this.setAxisLength( this.height );

        this.sprite.cleanAnimates();

        this._trimYAxis();
        
        this._widget( opt );

        this.setX(this.pos.x);
        this.setY(this.pos.y);
        
    }

    //配置和数据变化
    resetData( dataFrame )
    {
        //如果用户没有指定width，那么resetData的时候需要清空一下width，用新的数据重新设置
        if( !('width' in this._opt) ){
            this.width = 0;
        };
        this._setField(dataFrame.field);
        this.resetDataOrg( dataFrame.org );
        
        this._initHandle();
        this.draw();
    }

    setX($n)
    {
        this.sprite.context.x = $n;
        this.pos.x = $n;
    }

    setY($n)
    {
        this.sprite.context.y = $n;
        this.pos.y = $n;
    }

    //目前和xAxis一样
    _getTitle()
    {
        if ( this.title.text ) {
            if( !this._title ){
                let rotation = 0;
                if( this.align == "left" ){
                    rotation = -90;
                } else {
                    rotation = 90;
                    if( this.isH ){
                        rotation = 270;
                    }
                };
                this._title = new Canvax.Display.Text(this.title.text, {
                    context: {
                        fontSize: this.title.fontSize,
                        textAlign: this.title.textAlign,  //"center",//this.isH ? "center" : "left",
                        textBaseline: this.title.textBaseline,//"middle", //this.isH ? "top" : "middle",
                        fillStyle: this.title.fontColor,
                        strokeStyle: this.title.strokeStyle,
                        lineWidth : this.title.lineWidth,
                        rotation: rotation
                    }
                });
            } else {
                this._title.resetText( this.title.text );
            }
        }
    }

    _setYaxisWidth(){
        //待实现
    }


    _trimYAxis()
    {
        let me = this;
        let tmpData = [];
        
        for (let i = 0, l = this.dataSection.length; i < l; i++) {
            
            let layoutData = {
                value   : this.dataSection[ i ],
                y       : -Math.abs( this.getPosOf( {
                    val : this.dataSection[ i ],
                    ind : i
                } ) ),
                visible : true,
                text    : ""
            };

            //把format提前
            layoutData.text = me._getFormatText( layoutData.value, i );

            tmpData.push( layoutData );

        }

        let _preShowInd = 0;
        for (let a = 0, al = tmpData.length; a < al; a++) {
            if( a == 0 ) continue;

            if( _preShowInd == 0 ){
                if( tmpData[a].text == tmpData[ _preShowInd ].text ){
                    //如果后面的format后的数据和前面的节点的format后数据相同
                    tmpData[a].visible = false;
                } else {
                    _preShowInd = a;
                }
            } else {
                if( tmpData[a].text == tmpData[ _preShowInd ].text ){
                    tmpData[_preShowInd].visible = false;
                    
                }
                _preShowInd = a;
            }
        };

        //TODO: 最后的问题就是dataSection中得每个只如果format后都相同的话，就会出现最上面最下面两个一样得刻度
        this.layoutData = tmpData;

        if( this.trimLayout ){
            //如果用户有手动的 trimLayout ，那么就全部visible为true，然后调用用户自己的过滤程序
            //trimLayout就事把arr种的每个元素的visible设置为true和false的过程
            this.trimLayout( tmpData );
        };
    }

    _getFormatText( value, i )
    {
        if ( this.label.format ) {
            //如果有单独给label配置format，就用label上面的配置
            if( _.isFunction(this.label.format) ){
                value = this.label.format.apply( this, arguments );
            }
            if( typeof this.label.format == 'string' ){
                value = numeral( value ).format( this.label.format )
            }
        } else {
            
            //否则用fieldConfig上面的, 因为y轴上面可能会汇集了多个field，那么只取在fieldsConfig上面配置过的第一个field即可
            let config;
            let _fields = _.flatten([this.field]);
            for( let i=0,l=_fields.length; i<l; i++ ){
                config = this._coord.fieldsConfig[ _fields[i] ];
                if( config ) break;
            };
           
            if( config ){
                value = this._coord.getFormatValue(value, config, i )
            };
        };

        return value;
    }

    _getYAxisDisLine() 
    { //获取y轴顶高到第一条线之间的距离         
        let disMin = 0
        let disMax = 2 * disMin
        let dis = disMin
        dis = disMin + this.yMaxHeight % this.dataSection.length;
        dis = dis > disMax ? disMax : dis
        return dis
    }

    resetWidth(width)
    {
        let me = this;
        me.width = width;
        if( me.align == "left" ){
            me.rulesSprite.context.x = me.width;
        }
    }

    _widget( opt )
    {
        let me = this;
        !opt && (opt ={});
        if (!me.enabled) {
            me.width = 0;
            return;
        };
        
        let arr = this.layoutData;
        let visibleInd = 0;
        me.maxW = 0;

        for (let a = 0, al = arr.length; a < al; a++) {
             
            _.isFunction(me.filter) && me.filter({
                layoutData : arr,
                index      : a
            });

            let o = arr[a];
            if( !o.visible ){
                continue;
            };
            
            let y = o.y;

            let textAlign = me.label.textAlign;
 
            let posy = y + (a == 0 ? -3 : 0) + (a == arr.length - 1 ? 3 : 0);
            //为横向图表把y轴反转后的 逻辑
            if (me.label.rotation == 90 || me.label.rotation == -90) {
                textAlign = "center";
                if (a == arr.length - 1) {
                    posy = y - 2;
                    textAlign = "right";
                }
                if (a == 0) {
                    posy = y;
                }
            };


            let aniFrom = 16;
            if( o.value == me.origin ){
                aniFrom = 0;
            };
            if( o.value < me.origin ){
                aniFrom = -16;
            };
            let lineX = 0;
            let tickLineContext;
            if (me.tickLine.enabled) {
                //线条
                lineX = me.align == "left" ? - me.tickLine.lineLength - me.tickLine.distance : me.tickLine.distance;
                tickLineContext = {
                    x: lineX ,
                    y: y,
                    end : {
                        x : me.tickLine.lineLength,
                        y : 0
                    },
                    lineWidth: me.tickLine.lineWidth,
                    strokeStyle: me._getStyle(me.tickLine.strokeStyle)
                }
            };

            //文字
            let textContext;
            if( me.label.enabled ){
                let txtX = me.align == "left" ? lineX - me.label.distance : lineX + me.tickLine.lineLength + me.label.distance;
                if( this.isH ){
                    txtX = txtX + (me.align == "left"?-1:1)* 4
                };
                textContext = {
                    x: txtX,
                    y: posy,
                    fillStyle: me._getStyle(me.label.fontColor),
                    fontSize: me.label.fontSize,
                    rotation: -Math.abs(me.label.rotation),
                    textAlign: textAlign,
                    textBaseline: "middle",
                    lineHeight: me.label.lineHeight,
                    globalAlpha : 1
                };
            };

            let duration = 300;
            if (!me.animation || opt.resize) {
                duration = 0;
            };

            let _node = this.rulesSprite.getChildAt( visibleInd );

            if( _node ){

                if( _node._tickLine && me.tickLine.enabled ){
                    _node._tickLine.animate( tickLineContext, {
                        duration: duration,
                        id: _node._tickLine.id
                    });
                };

                if( _node._txt && me.label.enabled ){
                    _node._txt.animate( textContext, {
                        duration: duration,
                        id: _node._txt.id
                    });
                    _node._txt.resetText( o.text );

                };
            
            } else {
                _node = new Canvax.Display.Sprite({
                    id: "_node" + visibleInd
                });

                //新建line
                if( me.tickLine.enabled ){
                    _node._tickLine = new Line({
                        id: "yAxis_tickline_" + visibleInd,
                        context: tickLineContext
                    });
                    _node.addChild( _node._tickLine );
                };

                //文字
                if( me.label.enabled ){
      
                    _node._txt = new Canvax.Display.Text(o.text, {
                        id: "yAxis_txt_" + visibleInd,
                        context: textContext
                    });
                    _node.addChild( _node._txt );

                    if (me.animation && !opt.resize) {
                        _node._txt.context.y = y + aniFrom;
                        _node._txt.context.globalAlpha = 0;
                        _node._txt.animate({
                            y: textContext.y,
                            globalAlpha: 1
                        }, {
                            duration: 300,
                            id : _node._txt.id
                        });
                    } 
                };

                me.rulesSprite.addChild(_node);
            };

            if( me.label.enabled ){
                if (me.label.rotation == 90 || me.label.rotation == -90) {
                    me.maxW = Math.max(me.maxW, _node._txt.getTextHeight());
                } else {
                    me.maxW = Math.max(me.maxW, _node._txt.getTextWidth());
                };
            };
            
            visibleInd ++;
        };
        
        //把 rulesSprite.children中多余的给remove掉
        if( me.rulesSprite.children.length >= visibleInd ){
            for( let al = visibleInd,pl = me.rulesSprite.children.length;al<pl;al++  ){
                me.rulesSprite.getChildAt( al ).remove();
                al--,pl--;
            };
        };

        //没有width，并且用户也没有设置过width
        if( !me.width && !('width' in me._opt) ){
            me.width = parseInt( me.maxW + me.label.distance  );
            if (me.tickLine.enabled) {
                me.width += parseInt( me.tickLine.lineLength + me.tickLine.distance );
            }
            if ( me._title ){
                me.width += me._title.getTextHeight();
            }
        };

        let _originX = 0;
        if( me.align == "left" ){
            me.rulesSprite.context.x = me.width;
            _originX = me.width;
        };

        //轴线
        if( me.axisLine.enabled ){
            let _axisLineCtx = {
                start : {
                    x : _originX,
                    y : 0
                },
                end   : {
                    x : _originX,
                    y : -me.height
                },
                lineWidth   : me.axisLine.lineWidth,
                strokeStyle : me._getStyle(me.axisLine.strokeStyle)
            };

            if( !this._axisLine ){
                let _axisLine = new Line({
                    context : _axisLineCtx
                });
                this.sprite.addChild( _axisLine );
                this._axisLine = _axisLine;
            } else {
                this._axisLine.animate( _axisLineCtx );
            }
        }

        if (this._title) {
            this._title.context.y = -this.height/2;
            this._title.context.x = this._title.getTextHeight() / 2;
            if( this.align == "right" ){
                this._title.context.x = this.width - this._title.getTextHeight() / 2;
            };
            this.sprite.addChild(this._title);
        };
    }


    _getStyle(s)
    {
        let res = s;
        if (_.isFunction(s)) {
            res = s.call( this , this );
        };
        if( !s ){
            res = "#999";
        };
        return res
    }
}