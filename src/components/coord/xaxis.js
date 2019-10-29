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
        var me = this;
        !opt && (opt ={});
        if (!me.enabled) {
            me.height = 0;  //width不能为0
            return;
        };

        var arr = me.layoutData;
        var visibleInd = 0;

        for (var a = 0, al = arr.length; a < al; a++) {
             
            _.isFunction(me.filter) && me.filter({
                layoutData : arr,
                index      : a
            });

            var o = arr[a];
            if( !o.visible ){
                continue;
            };

            var x = o.x,
                y = me.tickLine.lineLength + me.tickLine.distance + me.label.distance;

            var _node = me.rulesSprite.getChildAt( visibleInd );

            //文字 
            var textContext = {
                x            : o._text_x || o.x,
                y            : y,
                fillStyle    : this.label.fontColor,
                fontSize     : this.label.fontSize,
                rotation     : -Math.abs(this.label.rotation),
                textAlign    : this.label.textAlign,
                lineHeight   : this.label.lineHeight,
                textBaseline : !!this.label.rotation ? "middle" : "top",
                globalAlpha  : 1
            };
            if (!!this.label.rotation && this.label.rotation != 90) {
                textContext.x += 5;
                textContext.y += 3;
            };

            //tick line
            var tickLineContext = {
                x     : x,
                y     : this.tickLine.distance,
                end   : {
                    x : 0,
                    y : this.tickLine.lineLength
                },
                lineWidth  : this.tickLine.lineWidth,
                strokeStyle: this.tickLine.strokeStyle
            };

            var duration = 300;
            var delay    = visibleInd * (Math.min(1000 / arr.length, 25));
            if (!me.animation || opt.resize) {
                duration = 0;
                delay    = 0;
            };

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
                    id: "xNode" + visibleInd
                });


                 //新建line
                 if( me.tickLine.enabled ){
                    _node._tickLine = new Line({
                        id: "xAxis_tickline_" + visibleInd,
                        context: tickLineContext
                    });
                    _node.addChild( _node._tickLine );
                };

                //新建txt
                if( me.label.enabled ){
                    _node._txt = new Canvax.Display.Text(o.text, {
                        id: "xAxis_txt_" + visibleInd,
                        context: textContext
                    });
                    _node.addChild( _node._txt );
                    if (me.animation && !opt.resize) {
                        _node._txt.context.y += 20;
                        _node._txt.context.globalAlpha = 0;
                        _node._txt.animate( {
                            y: textContext.y,
                            globalAlpha: 1
                        }, {
                            duration: 500,
                            delay: delay,
                            id: _node._txt.id
                        });
                    };
                }

               

                me.rulesSprite.addChild( _node );
            };
            visibleInd++;
        };
        
        //把sprite.children中多余的给remove掉
        if( this.rulesSprite.children.length >= visibleInd ){
            for( var al = visibleInd,pl = this.rulesSprite.children.length;al<pl;al++  ){
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
            
        };

        if( this._title ) {
            this._title.context.y = this.height - this._title.getTextHeight() / 2;
            this._title.context.x = this.width / 2;
            this.sprite.addChild( this._title );
        };

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
                    if( next_left_x + nextWidth > me.width + me._getRootPR()){
                        //只有最后一个溢出了，才需要检测
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