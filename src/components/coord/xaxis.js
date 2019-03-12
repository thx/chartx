import Canvax from "canvax"
import {numAddSymbol} from "../../utils/tools"
import { _, getDefaultProps } from "mmvis"
import Axis from "./axis"

const Line = Canvax.Shapes.Line;

export default class xAxis extends Axis
{
    static defaultProps(){
       return {}
    }

    constructor(opt, data, _coord)
    {
        super(opt, data.org);
        this.type = "xAxis";
       
        this._coord = _coord || {};
        this._title = null; //this.title对应的文本对象

        this._txts = [];
        this._axisLine = null;
    
        this._formatTextSection = []; //dataSection的值format后一一对应的值
        this._textElements = []; //_formatTextSection中每个文本对应的canvax.shape.Text对象

        this.pos = {
            x: 0,
            y: 0
        };
        this.layoutData = []; //{x:100, value:'1000',visible:true}
        this.sprite = null;
        this.isH = false; //是否为横向转向的x轴

        _.extend( true, this, getDefaultProps( xAxis.defaultProps() ) , opt);
        this.init(opt);
    }

    init(opt) 
    {
        this._setField();
        this._initHandle(opt);

        this.sprite = new Canvax.Display.Sprite({
            id: "xAxisSprite_"+new Date().getTime()
        });
        this.rulesSprite = new Canvax.Display.Sprite({
            id: "xRulesSprite_"+new Date().getTime()
        });
        this.sprite.addChild( this.rulesSprite );
    }

    _initHandle( opt )
    {
        var me = this;

        if( opt ){
            if( opt.isH && (!opt.label || opt.label.rotaion === undefined) ){
                //如果是横向直角坐标系图
                this.label.rotation = 90;
            };
        };

        this.setDataSection();

        me._formatTextSection = [];
        me._textElements = [];
        _.each( me.dataSection, function( val, i ){
            me._formatTextSection[ i ] = me._getFormatText(val, i);
            //从_formatTextSection中取出对应的格式化后的文本
            var txt = new Canvax.Display.Text( me._formatTextSection[i] , {
                context: {
                    fontSize: me.label.fontSize
                }
            });
            me._textElements[ i ] = txt;
        });

        if (this.label.rotation != 0 ) {
            //如果是旋转的文本，那么以右边为旋转中心点
            this.label.textAlign = "right";
        };

        this._getTitle();
        this._setXAxisHeight();
    }

    _setField( field ){
        if( field ){
            this.field = field;
        };
        //xAxis的field只有一个值
        this.field = _.flatten( [ this.field ] )[0];
    }

    draw(opt)
    {
        //首次渲染从 直角坐标系组件中会传入 opt,包含了width，origin等， 所有这个时候才能计算layoutData
        opt && _.extend(true, this, opt);

        this.setAxisLength( this.width );
        
        this._trimXAxis();

        this._widget( opt );

        this.setX(this.pos.x);
        this.setY(this.pos.y);

    }

    //配置和数据变化
    resetData( dataFrame )
    {
        this._setField(dataFrame.field)
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

    _getTitle()
    {
        if ( this.title.text ) {
            if( !this._title ){
                this._title = new Canvax.Display.Text(this.title.text, {
                    context: {
                        fontSize: this.title.fontSize,
                        textAlign: this.title.textAlign,  //"center",//this.isH ? "center" : "left",
                        textBaseline: this.title.textBaseline,//"middle", //this.isH ? "top" : "middle",
                        fillStyle: this.title.fontColor,
                        strokeStyle: this.title.strokeStyle,
                        lineWidth : this.title.lineWidth,
                        rotation: this.isH ? -180 : 0
                    }
                });
            } else {
                this._title.resetText( this.title.text );
            }
        }
    }

    _setXAxisHeight()
    { //检测下文字的高等
        var me = this;
        if (!me.enabled) {
            me.height = 0; 
        } else {
            var _maxTextHeight = 0;

            if( this.label.enabled ){
                _.each( me.dataSection, function( val, i ){

                        //从_formatTextSection中取出对应的格式化后的文本
                        var txt = me._textElements[i];
            
                        var textWidth = txt.getTextWidth();
                        var textHeight = txt.getTextHeight();
                        var width = textWidth; //文本在外接矩形width
                        var height = textHeight;//文本在外接矩形height

                        if (!!me.label.rotation) {
                            //有设置旋转
                            if ( me.label.rotation == 90 ) {
                                width  = textHeight;
                                height = textWidth;
                            } else {
                                var sinR = Math.sin(Math.abs(me.label.rotation) * Math.PI / 180);
                                var cosR = Math.cos(Math.abs(me.label.rotation) * Math.PI / 180);
                                height = parseInt( sinR * textWidth );
                                width = parseInt( cosR * textWidth );
                            };
                        };

                        _maxTextHeight = Math.max( _maxTextHeight, height);
                    
                } );
            };

            this.height = _maxTextHeight + this.tickLine.lineLength + this.tickLine.distance + this.label.distance;

            if (this._title) {
                this.height += this._title.getTextHeight()
            };

        }
    }
    
    getNodeInfoOfX( x ){
        var ind = this.getIndexOfPos( x );
        var val = this.getValOfInd( ind );//this.getValOfPos(x);//
        var pos = this.getPosOf( {
            ind : ind,
            val : val
        } );
        return this._getNodeInfo( ind, val, pos );
    }

    getNodeInfoOfVal( val ){
        var ind = this.getIndexOfVal( val );
        var pos = this.getPosOf( {
            ind : ind,
            val : val
        } );
        return this._getNodeInfo( ind, val, pos );
    }

    _getNodeInfo( ind,val,pos ){
        var o = {
            ind        : ind,
            value      : val,
            text       : this._getFormatText( val, ind), //text是 format 后的数据
            x          : pos, //这里不能直接用鼠标的x
            field      : this.field,
            layoutType : this.layoutType
        };
        return o;
    }

    _trimXAxis() 
    {
        var tmpData = [];
        var data = this.dataSection;

        for (var a = 0, al  = data.length; a < al; a++ ) {
            var text = this._formatTextSection[a];
            var txt = this._textElements[a];
            
            var o = {
                ind : a,
                value   : data[a],
                text    : text,
                x       : this.getPosOf( {
                    val : data[a],
                    ind : a
                } ),
                textWidth: txt.getTextWidth(),
                field : this.field,
                visible: null //trimgrapsh的时候才设置
            };

            tmpData.push( o );
        };
        this.layoutData = tmpData;

        this._trimLayoutData();

        return tmpData;
    }

    _getFormatText( val )
    {
        var res = val;
        if ( _.isFunction(this.label.format) ) {
            res = this.label.format.apply( this, arguments );
        };
        if ( _.isNumber(res) && this.layoutType == "proportion"  ) {
            res = numAddSymbol(res);
        };
        return res;
    }

    _widget( opt )
    {
        if( !this.enabled ) return;
        !opt && (opt ={});

        var me = this;
        var arr = this.layoutData;
        
        if (this._title) {
            this._title.context.y = this.height - this._title.getTextHeight() / 2;
            this._title.context.x = this.width / 2;
            this.sprite.addChild(this._title);
        };

        var delay = Math.min(1000 / arr.length, 25);

        var labelVisibleInd = 0;
        //var lineVisibleInd = 0;

        for (var a = 0, al = arr.length; a < al; a++) {
            var xNodeId = "xNode" + a;

            var xNode = this.rulesSprite.getChildById(xNodeId) 
            if( !xNode ){
                xNode = new Canvax.Display.Sprite({
                    id: xNodeId
                });
                this.rulesSprite.addChild(xNode);
            };

            var o = arr[a]
            var x = o.x,
                y = this.tickLine.lineLength + this.tickLine.distance + this.label.distance;

        
            if ( this.label.enabled ){
                if( !!arr[a].visible ){
                    
                    //文字
                    var textContext = {
                        x: o._text_x || o.x,
                        y: y + 20,
                        fillStyle    : this.label.fontColor,
                        fontSize     : this.label.fontSize,
                        rotation     : -Math.abs(this.label.rotation),
                        textAlign    : this.label.textAlign,
                        lineHeight   : this.label.lineHeight,
                        textBaseline : !!this.label.rotation ? "middle" : "top",
                        globalAlpha  : 0
                    };

                    if (!!this.label.rotation && this.label.rotation != 90) {
                        textContext.x += 5;
                        textContext.y += 3;
                    };

                    if( labelVisibleInd < me._txts.length ){
                        //_.extend( xNode._txt.context , textContext );
                        xNode._txt = me._txts[ labelVisibleInd ]
                        xNode._txt.resetText( o.text+"" );
                        if( this.animation ){
                            xNode._txt.animate( {
                                x : textContext.x
                            } , {
                                duration : 300
                            });
                        } else {
                            xNode._txt.context.x = textContext.x
                        }

                    } else {

                        xNode._txt = new Canvax.Display.Text(o.text, {
                            id: "xAxis_txt_" + a,
                            context: textContext
                        });
                        xNode.addChild( xNode._txt );
                        me._txts.push( xNode._txt );

                        //新建的 txt的 动画方式
                        if (this.animation && !opt.resize) {
                            xNode._txt.animate({
                                globalAlpha: 1,
                                y: xNode._txt.context.y - 20
                            }, {
                                duration: 500,
                                easing: 'Back.Out', //Tween.Easing.Elastic.InOut
                                delay: a * delay,
                                id: xNode._txt.id
                            });
                        } else {
                            xNode._txt.context.y = xNode._txt.context.y - 20;
                            xNode._txt.context.globalAlpha = 1;
                        };
                    };

                    labelVisibleInd++;
                } 
                //xNode._txt.context.visible = !!arr[a].visible;
            };
            

            if ( this.tickLine.enabled ) {
                if( !!arr[a].visible ){
                    var lineContext = {
                        x: x,
                        y: this.tickLine.distance,
                        end : {
                            x : 0,
                            y : this.tickLine.lineLength
                        },
                        lineWidth: this.tickLine.lineWidth,
                        strokeStyle: this.tickLine.strokeStyle
                    };
                    if( xNode._line ){
                        //_.extend( xNode._txt.context , textContext );
                        if( this.animation ){
                            xNode._line.animate({
                                x : lineContext.x
                            } , {
                                duration : 300
                            })
                        } else {
                            xNode._line.context.x = lineContext.x;
                        };
                    } else {
                        xNode._line = new Line({
                            context: lineContext
                        });
                        xNode.addChild(xNode._line);
                    }
                } else {
                    if( xNode._line ){
                        xNode._line.destroy();
                        xNode._line = null;
                    }
                }
            };

            //这里可以由用户来自定义过滤 来 决定 该node的样式
            _.isFunction(this.filter) && this.filter({
                layoutData: arr,
                index: a,
                txt: xNode._txt,
                line: xNode._line || null
            });
            
        };

        //_txts还有多的，就要干掉
        if( me._txts.length > labelVisibleInd ){
            for( var i= labelVisibleInd; i<me._txts.length; i++){
                me._txts.splice( i-- , 1 )[0].destroy();
            }
        };

        //把sprite.children中多余的给remove掉
        if( this.rulesSprite.children.length > arr.length ){
            for( var al = arr.length,pl = this.rulesSprite.children.length;al<pl;al++  ){
                this.rulesSprite.getChildAt( al ).remove();
                al--,pl--;
            };
        };

        //轴线
        if( this.axisLine.enabled ){
            var _axisLineCtx = {
                start : {
                    x : 0,
                    y : 0
                },
                end   : {
                    x : this.width,
                    y : 0
                },
                lineWidth   : this.axisLine.lineWidth,
                strokeStyle : this.axisLine.strokeStyle
            };

            if( !this._axisLine ){
                var _axisLine = new Line({
                    context : _axisLineCtx
                });
                this.sprite.addChild( _axisLine );
                this._axisLine = _axisLine;
            } else {
                this._axisLine.animate( _axisLineCtx );
            };
            
        }

    }

 

    _trimLayoutData()
    {
        var me = this;
        var arr = this.layoutData;
        var l = arr.length;

        if( !this.enabled || !l ) return;

        // rule , peak, proportion
        if( me.layoutType == "proportion" ){
            this._checkOver();
        };
        if( me.layoutType == "peak" ){
            //TODO: peak暂时沿用 _checkOver ，这是保险的万无一失的。
            this._checkOver();
        };
        if( me.layoutType == "rule" ){
            this._checkOver();
        };

    }

    _getRootPR()
    {
        //找到paddingRight,在最后一个文本右移的时候需要用到
        var rootPaddingRight = 0;
        if( this._coord.app ){
            rootPaddingRight = this._coord.app.padding.right;
        };
        return rootPaddingRight;
    }

    _checkOver()
    {
        var me = this;
        var arr = me.layoutData;
        var l = arr.length;  
        var textAlign = me.label.textAlign; 

    
        //如果用户设置不想要做重叠检测
        if( !this.label.evade || me.trimLayout ){
            _.each( arr , function( layoutItem ){
                layoutItem.visible = true;
            } );

            if( me.trimLayout ){
                //如果用户有手动的 trimLayout ，那么就全部visible为true，然后调用用户自己的过滤程序
                //trimLayout就事把arr种的每个元素的visible设置为true和false的过程
                me.trimLayout( arr );
            };

            //要避免最后一个label绘制出去了
            //首先找到最后一个visible的label
            var lastNode;
            for( var i=l-1; i>=0; i-- ){
                if( lastNode ) break;
                if( arr[i].visible ) lastNode = arr[i];
            };
            if( lastNode ){
                if( textAlign == "center" && (lastNode.x+lastNode.textWidth/2) > me.width ){
                    lastNode._text_x = me.width - lastNode.textWidth/2 + me._getRootPR();
                };
                if( textAlign == "left" && (lastNode.x+lastNode.textWidth) > me.width ){
                    lastNode._text_x = me.width - lastNode.textWidth;
                };
            };

            return;
        };

                     

        function checkOver(i){
            var curr = arr[i];
            
            if( curr === undefined ){
                return;
            };
            curr.visible = true;

            for( var ii=i; ii<l-1; ii++ ){
                var next = arr[ii+1];

                var nextWidth = next.textWidth;
                var currWidth = curr.textWidth;

                //如果有设置rotation，那么就固定一个最佳可视单位width为35  暂定
                if(!!me.label.rotation){
                    nextWidth = Math.min( nextWidth, 22 );
                    currWidth = Math.min( currWidth, 22 );
                };
                
                //默认left
                var next_left_x = next.x; //下个节点的起始
                var curr_right_x = curr.x+currWidth; //当前节点的终点

                if( textAlign == "center" ){
                    next_left_x = next.x - nextWidth/2;
                    curr_right_x = curr.x+currWidth/2;
                };
                if( textAlign  == "right" ){
                    next_left_x = next.x - nextWidth;
                    curr_right_x = curr.x;
                };

                if( ii == l-2 ){
                    //next是最后一个
                    if( textAlign == "center" && (next.x+nextWidth/2) > me.width ){
                        next_left_x = me.width - nextWidth;
                        next._text_x = me.width - nextWidth/2 + me._getRootPR();
                    }
                    if( textAlign == "left" && (next.x+nextWidth) > me.width ){
                        next_left_x = me.width - nextWidth;
                        next._text_x = me.width - nextWidth;
                    }
                };

                //必须要有1px的间隔
                if( next_left_x - curr_right_x < 1 ){
                    if( ii == l-2 ){
                        //最后一个的话，反把前面的给hide
                        next.visible = true;
                        curr.visible = false;
                        return;
                    } else {
                        next.visible = false;
                    }
                } else {
                    checkOver( ii+1 );
                    break;
                }
            };
        };

        checkOver(0);
    }
}