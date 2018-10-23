import Canvax from "canvax"
import {numAddSymbol} from "../../../utils/tools"
import DataSection from "../../../utils/datasection"
import Axis from "../axis"

const Line = Canvax.Shapes.Line;
const _ = Canvax._;

export default class yAxis extends Axis
{
	constructor( opt, data, _coord){

        super(opt, data, _coord);

        this._opt = opt;
        
        this.width   = null; //第一次计算后就会有值
        this.yMaxHeight = 0; //y轴最大高
        this.height = 0; //y轴第一条线到原点的高

        this.maxW    = 0;    //最大文本的 width
        this.field   = [];   //这个 轴 上面的 field 不需要主动配置。可以从graphs中拿

        this.title   = {
            text         : "",
            shapeType    : "text",
            fontColor    : '#999',
            fontSize     : 12,
            offset       : 2,
            textAlign    : "center",
            textBaseline : "middle",
            strokeStyle  : null,
            lineHeight   : 0
        };
        this._title = null; //this.label对应的文本对象

        this.enabled = true;
        this.tickLine= {//刻度线
            enabled      : 1,
            lineWidth    : 1, //线宽
            lineLength   : 4, //线长
            strokeStyle  : '#cccccc',
            distance     : 2
        };
        this.axisLine = {//轴线
            position     : "default",  //位置，default默认在min，可选 "center" 和 具体的值
            enabled      : 1,     
            lineWidth    : 1,
            strokeStyle  : '#cccccc'
        };
        this.label = {
            enabled      : 1,
            fontColor    : '#999',
            fontSize     : 12,
            format       : null,
            rotation     : 0,
            distance     : 3, //和刻度线的距离,
            textAlign    : null,//"right",
            lineHeight   : 1
        };
        
        if( opt.isH && (!opt.label || opt.label.rotaion === undefined) ){
            //如果是横向直角坐标系图
            this.label.rotation = 90;
        };

        this.pos = {
            x: 0,
            y: 0
        };
        this.align = "left"; //yAxis轴默认是再左边，但是再双轴的情况下，可能会right
        
        this.layoutData = []; //dataSection 对应的layout数据{y:-100, value:'1000'}

        this.sprite = null;

        //过滤器，可以用来过滤哪些yaxis 的 节点是否显示已经颜色之类的
        //@params params包括 dataSection , 索引index，txt(canvax element) ，line(canvax element) 等属性
        this.filter = null; //function(params){}; 

        this.isH = false; //是否横向

        this.animation = true;

        this.layoutType = "proportion"; //rule , peak, proportion

        this._axisLine = null;

        this.init(opt, data );
        
    }

    init(opt, data )
    {
        _.extend(true , this, opt);
        
        this.sprite = new Canvax.Display.Sprite({
            id: "yAxisSprite_"+new Date().getTime()
        });
        this.rulesSprite = new Canvax.Display.Sprite({
            id: "yRulesSprite_"+new Date().getTime()
        });
        this.sprite.addChild( this.rulesSprite );
    }

    draw(opt)
    {
        _.extend(true, this, (opt || {} ));

        //extend会设置好this.field
        //先要矫正子啊field确保一定是个array
        if( !_.isArray(this.field) ){
            this.field = [this.field];
        };
        
        this.initData();
        this.axisLength = this.height = parseInt( this.yMaxHeight - this._getYAxisDisLine() );
    
        this.setMinMaxOrigin();

        this._getTitle();
        
        this._trimYAxis();
        this._widget( opt );

        this.setX(this.pos.x);
        this.setY(this.pos.y);
        
    }

    //配置和数据变化
    resetData( dataFrame )
    {
        this.dataSection = [];
        this.dataSectionGroup = [];
        if( dataFrame ){
            dataFrame.field && (this.field = dataFrame.field);
            dataFrame.org && (this.dataOrg = dataFrame.org);//这里必须是data.org
        };
        
        this.draw();

        /*
        this.initData();
        this.setMinMaxOrigin();

        this._trimYAxis();
        this._widget();
        */
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
                var rotation = 0;
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


    _trimYAxis()
    {
        var me = this;
        var tmpData = [];
        
        for (var i = 0, l = this.dataSection.length; i < l; i++) {
            var layoutData = {
                value   : this.dataSection[ i ],
                y       : this.getPosFromVal( this.dataSection[ i ] ),
                visible : true,
                text    : ""
            };

            //把format提前
            var text = layoutData.value;
            if (_.isFunction(me.label.format)) {
                text = me.label.format.apply(this, [text, i ]);
            };
            if( text === undefined || text === null ){
                text = numAddSymbol( layoutData.value );
            };  
            layoutData.text = text;

            tmpData.push( layoutData );

        }

        var _preShowInd = 0;
        for (var a = 0, al = tmpData.length; a < al; a++) {
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
    }

    _getYAxisDisLine() 
    { //获取y轴顶高到第一条线之间的距离         
        var disMin = 0
        var disMax = 2 * disMin
        var dis = disMin
        dis = disMin + this.yMaxHeight % this.dataSection.length;
        dis = dis > disMax ? disMax : dis
        return dis
    }

    resetWidth(width)
    {
        var me = this;
        me.width = width;
        if( me.align == "left" ){
            me.rulesSprite.context.x = me.width;
        }
    }

    _widget( opt )
    {
        var me = this;
        !opt && (opt ={});
        if (!me.enabled) {
            me.width = 0;
            return;
        };
        
        var arr = this.layoutData;
        me.maxW = 0;

        for (var a = 0, al = arr.length; a < al; a++) {
            var o = arr[a];
            if( !o.visible ){
                continue;
            };
            var y = o.y;

            var value = o.value;

            var textAlign = me.label.textAlign || (me.align == "left" ? "right" : "left");
 
            var posy = y + (a == 0 ? -3 : 0) + (a == arr.length - 1 ? 3 : 0);
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

            var yNode = this.rulesSprite.getChildAt(a);

            if( yNode ){
                if( yNode._txt && this.label.enabled ){

                    if (me.animation && !opt.resize) {
                        yNode._txt.animate({
                            y: posy
                        }, {
                            duration: 500,
                            delay: a*80,
                            id: yNode._txt.id
                        });
                    } else {
                        yNode._txt.context.y = posy;
                    };
                    
                    yNode._txt.resetText( o.text );
                };

                if( yNode._tickLine && this.tickLine.enabled ){
                    if (me.animation && !opt.resize) {
                        yNode._tickLine.animate({
                            y: y
                        }, {
                            duration: 500,
                            delay: a*80,
                            id: yNode._tickLine.id
                        });
                    } else {
                        yNode._tickLine.context.y = y;
                    }
                };

            } else {
                yNode = new Canvax.Display.Sprite({
                    id: "yNode" + a
                });

                var aniFrom = 20;
                if( o.value == me.origin ){
                    aniFrom = 0;
                };

                if( o.value < me.origin ){
                    aniFrom = -20;
                };

                var lineX = 0
                if (me.tickLine.enabled) {
                    //线条
                    lineX = me.align == "left" ? - me.tickLine.lineLength - me.tickLine.distance : me.tickLine.distance;
                    var line = new Line({
                        context: {
                            x: lineX ,
                            y: y,
                            end : {
                                x : me.tickLine.lineLength,
                                y : 0
                            },
                            lineWidth: me.tickLine.lineWidth,
                            strokeStyle: me._getStyle(me.tickLine.strokeStyle)
                        }
                    });
                    yNode.addChild(line);
                    yNode._tickLine = line;
                };

                //文字
                if( me.label.enabled ){
                    var txtX = me.align == "left" ? lineX - me.label.distance : lineX + me.tickLine.lineLength + me.label.distance;
                    if( this.isH ){
                        txtX = txtX + (me.align == "left"?-1:1)* 4
                    };
                    var txt = new Canvax.Display.Text( o.text , {
                        id: "yAxis_txt_" + me.align + "_" + a,
                        context: {
                            x: txtX,
                            y: posy + aniFrom,
                            fillStyle: me._getStyle(me.label.fontColor),
                            fontSize: me.label.fontSize,
                            rotation: -Math.abs(me.label.rotation),
                            textAlign: textAlign,
                            textBaseline: "middle",
                            lineHeight  : me.label.lineHeight,
                            globalAlpha: 0
                        }
                    });
                    yNode.addChild(txt);
                    yNode._txt = txt;

                    
                    if (me.label.rotation == 90 || me.label.rotation == -90) {
                        me.maxW = Math.max(me.maxW, txt.getTextHeight());
                    } else {
                        me.maxW = Math.max(me.maxW, txt.getTextWidth());
                    };

                    //这里可以由用户来自定义过滤 来 决定 该node的样式
                    _.isFunction(me.filter) && me.filter({
                        layoutData: me.layoutData,
                        index: a,
                        txt: txt,
                        line: line
                    });

                    me.rulesSprite.addChild(yNode);

            
                    if (me.animation && !opt.resize) {
                        txt.animate({
                            globalAlpha: 1,
                            y: txt.context.y - aniFrom
                        }, {
                            duration: 500,
                            easing: 'Back.Out', //Tween.Easing.Elastic.InOut
                            delay: (a+1) * 80,
                            id: txt.id
                        });
                    } else {
                        txt.context.y = txt.context.y - aniFrom;
                        txt.context.globalAlpha = 1;
                    }
                };
            }
        };

        //把 rulesSprite.children中多余的给remove掉
        if( me.rulesSprite.children.length > arr.length ){
            for( var al = arr.length,pl = me.rulesSprite.children.length;al<pl;al++  ){
                me.rulesSprite.getChildAt( al ).remove();
                al--,pl--;
            };
        };

        if( me.width === null ){
            me.width = parseInt( me.maxW + me.label.distance  );
            if (me.tickLine.enabled) {
                me.width += parseInt( me.tickLine.lineLength + me.tickLine.distance );
            }
            if ( me._title ){
                me.width += me._title.getTextHeight();
            }
        }

        var _originX = 0;
        if( me.align == "left" ){
            me.rulesSprite.context.x = me.width;
            _originX = me.width;
        }

        //轴线
        if( me.axisLine.enabled ){
            var _axisLine = new Line({
                context : {
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
                }
            });
            this.sprite.addChild( _axisLine );
            this._axisLine = _axisLine;
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
        var res = s;
        if (_.isFunction(s)) {
            res = s.call( this , this );
        };
        if( !s ){
            res = "#999";
        };
        return res
    }
}