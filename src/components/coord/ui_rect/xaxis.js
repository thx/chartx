import Canvax from "canvax"
import {numAddSymbol} from "../../../utils/tools"
import DataSection from "../../../utils/datasection"

const Line = Canvax.Shapes.Line;
const _ = Canvax._;

export default class xAxis extends Canvax.Event.EventDispatcher
{
    constructor(opt, data, _coord)
    {
        super();

        this._opts = opt;

        this._coord = _coord || {};

        this.width = 0;
        this.height = 0;

        this.name  = "";
        this._name = null; //this.label对应的文本对象
    
        this.enabled = true;
        this.tickLine = {
            enabled    : 1, //是否有刻度线
            lineWidth  : 1, //线宽
            lineLength : 4, //线长
            distance   : 2,
            strokeStyle: '#cccccc'
        };
        this.axisLine = {
            enabled    : 1, //是否有轴线
            lineWidth  : 1,
            strokeStyle: '#cccccc'
        };
        this.label = {
            enabled    : 1,
            fontColor  : '#999',
            fontSize   : 12,
            rotation   : 0,
            format     : null,
            distance   : 2,
            textAlign  : "center",
            lineHeight : 1
        };
        
        if( opt.isH && (!opt.label || opt.label.rotaion === undefined) ){
            //如果是横向直角坐标系图
            this.label.rotation = 90;
        };

        this.maxTxtH = 0;

        this.pos = {
            x: 0,
            y: 0
        };

        this.dataOrg = []; //源数据
        this.dataSection = []; //默认就等于源数据,也可以用户自定义传入来指定

        this.layoutData = []; //{x:100, value:'1000',visible:true}

        this.sprite = null;

        //过滤器，可以用来过滤哪些yaxis 的 节点是否显示已经颜色之类的
        //@params params包括 dataSection , 索引index，txt(canvax element) ，line(canvax element) 等属性
        this.filter = null; //function(params){}; 

        this.isH = false; //是否为横向转向的x轴

        this.animation = true;

        //layoutType == "proportion"的时候才有效
        this.maxVal = null; 
        this.minVal = null; 

        this.ceilWidth = 0; //x方向一维均分长度, layoutType == peak 的时候要用到

        this.layoutType = "rule"; // rule（均分，起点在0） , peak（均分，起点在均分单位的中心）, proportion（实际数据真实位置，数据一定是number）

        //如果用户有手动的 trimLayout ，那么就全部visible为true，然后调用用户自己的过滤程序
        //trimLayout就事把arr种的每个元素的visible设置为true和false的过程
        //function
        this.trimLayout = null;

        this.posParseToInt = false; //比如在柱状图中，有得时候需要高精度的能间隔1px的柱子，那么x轴的计算也必须要都是整除的

        _.extend(true , this, opt);

        this.init(opt, data);

        //xAxis的field只有一个值,
        this.field = _.flatten( [ this.field ] )[0];
    }

    init(opt, data) 
    {
        this.sprite = new Canvax.Display.Sprite({
            id: "xAxisSprite"
        });
        this.rulesSprite = new Canvax.Display.Sprite({
            id: "rulesSprite"
        });
        this.sprite.addChild( this.rulesSprite );
        this._initHandle( data );
        
    }

    _initHandle( data )
    {
        if( data && data.field ){
            this.field = data.field;
        }

        if(data && data.org){
            this.dataOrg = _.flatten( data.org );
        };

        if( !this._opts.dataSection && this.dataOrg ){
            //如果没有传入指定的dataSection，才需要计算dataSection
            this.dataSection = this._initDataSection(this.dataOrg);
        };        

        if (this.label.rotation != 0 ) {
            //如果是旋转的文本，那么以右边为旋转中心点
            this.label.textAlign = "right";
        };

        //取第一个数据来判断xaxis的刻度值类型是否为 number
        this.minVal == null && (this.minVal = _.min( this.dataSection ));
        if( isNaN(this.minVal) || this.minVal==Infinity ){
            this.minVal = 0;
        };
        this.maxVal == null && (this.maxVal = _.max( this.dataSection ));
        if( isNaN(this.maxVal) || this.maxVal==Infinity ){
            this.maxVal = 1;
        };

        this._setXAxisHeight();

    }

    /**
     *return dataSection 默认为xAxis.dataOrg的的faltten
     *即 [ [1,2,3,4] ] -- > [1,2,3,4]
     */
    _initDataSection(data)
    {
        var arr = _.flatten(data);
        if( this.layoutType == "proportion" ){
            if( arr.length == 1 ){
               arr.push( 0 );
               arr.push( arr[0]*2 );
            };
            arr = arr.sort(function(a,b){return a-b});
            arr = DataSection.section(arr)
        };
        return arr;
    }

    //配置和数据变化
    resetData( dataFrame )
    {
        this._initHandle( dataFrame );
        this.draw({
            resetData : true
        });
    }

    getIndexOfVal(xvalue)
    {
        var i;
        for( var ii=0,il=this.layoutData.length ; ii<il ; ii++ ){
            var obj = this.layoutData[ii];
            if(obj.value == xvalue){
                i = ii;
                break;
            }
        };

        return i;
    }

    getIndexOfX( x )
    {
        var iNode = 0;
        if( this.layoutType == "peak" ){
            iNode = parseInt( x / this.ceilWidth );
            if( iNode == this.dataOrg.length ){
                iNode = this.dataOrg.length - 1;
            }
        }

        if( this.layoutType == "rule" ){
            iNode = parseInt((x + (this.ceilWidth / 2)) / this.ceilWidth);
            if(this.dataOrg.length == 1 ){
                //如果只有一个数据
                iNode = 0;
            }
        }

        if( this.layoutType == "proportion" ){
            iNode = parseInt( x  / ((this.maxVal-this.minVal)/this.width ) );
        }

        return iNode
    }

    getNodeInfoOfX( x ){
        //nodeInfo 一般是给tips用，和data中得数据比就是少了个textWidth
        //这里和用 data 计算 layoutData的 trimgraphs 中不一样得是
        //这里的val获取必须在dataOrg中获取，统一的dataLen 也必须是用的 this.dataOrg.length
        var ind = this.getIndexOfX( x );

        var val = this.dataOrg[ ind ];
        var dataLen = this.dataOrg.length;
        var x = x;

        if( this.layoutType == "proportion" ){
            val = (this.maxVal-this.minVal) * ( x/this.width ) + this.minVal;
        } else {
            x = this.getPosX({
                val : val,
                ind : ind,
                dataLen: dataLen,
                width : this.width
            });
        };

        var o = {
            ind    : ind,
            value  : val,
            text   : this._getFormatText( val ), //text是format后的数据
            x      : x,
            field  : this.field
        };

        return o;
    }
    
    draw(opt)
    {
        //首次渲染从 直角坐标系组件中会传入 opt
        if( !opt.resetData ){
            this._getName();
            this._computerConfig(opt);
        };
        
        this.layoutData = this._trimXAxis(this.dataSection);
        this._trimLayoutData();

        this.sprite.context.x = this.pos.x;
        this.sprite.context.y = this.pos.y;

        this._widget( opt );

    }

    _getName()
    {
        if (this.name && this.name != "") {
            if( !this._name ){
                this._name = new Canvax.Display.Text(this.name, {
                    context: {
                        fontSize: this.label.fontSize,
                        textAlign: this.isH ? "center" : "left",
                        textBaseline: this.isH ? "top" : "middle",
                        fillStyle: this.label.fontColor,
                        rotation: this.isH ? -90 : 0
                    }
                });
            } else {
                this._name.resetText( this.name );
            }
        }
    }

    //初始化配置
    _computerConfig(opt)
    {
        if (opt) {
            _.extend(true, this, opt);
        };

        if (this._name) {
            if (this.isH) {
                this.width -= this._name.getTextHeight() + 5
            } else {
                this.width -= this._name.getTextWidth() + 5
            }
        };
    }

    //获取x对应的位置
    //val ind 至少要有一个
    getPosX( opt )
    {
        var x = 0;
        var val = opt.val; 
        var ind = "ind" in opt ? opt.ind : _.indexOf( this.dataSection , val );//如果没有ind 那么一定要有val
        var dataLen = "dataLen" in opt ? opt.dataLen : this.dataSection.length;
        var width = "width" in opt ? opt.width : this.width;
        var layoutType = "layoutType" in opt ? opt.layoutType : this.layoutType;

        if( dataLen == 1 ){
            x =  width / 2;
        } else {
            if( layoutType == "rule" ){
                //折线图的xyaxis就是 rule
                x = ind / (dataLen - 1) * width;
            };
            if( layoutType == "proportion" ){
                //按照数据真实的值在minVal - maxVal 区间中的比例值
                if( val == undefined ){
                    val = (ind * (this.maxVal - this.minVal)/(dataLen-1)) + this.minVal;
                };
                x = width * ( (val - this.minVal) / (this.maxVal - this.minVal) );
            };
            if( layoutType == "peak" ){
                //柱状图的就是peak
                var _ceilWidth = width / dataLen;
                if( this.posParseToInt ){
                    _ceilWidth = parseInt( _ceilWidth );
                };

                x = _ceilWidth * (ind+1) - _ceilWidth/2;
            };
        };

        if( isNaN(x) ){
            x = 0;
        };

        return parseInt( x , 10 );
        
    }

    _computerCeilWidth(){
        //ceilWidth默认按照peak算, 而且不能按照dataSection的length来做分母
        var width = this.width;
        var ceilWidth = width;
        if( this.dataOrg.length ){
            ceilWidth = width / this.dataOrg.length;
            if( this.layoutType == "rule" ){
                if( this.dataOrg.length == 1 ){
                    ceilWidth = width / 2;
                } else {
                    ceilWidth = width / ( this.dataOrg.length - 1 )
                }
            }
        };

        if( this.posParseToInt ){
            ceilWidth = parseInt( ceilWidth );
        };
        
        return ceilWidth;
    }

    _trimXAxis($data) 
    {
        var tmpData = [];
        var data = $data || this.dataSection;
        
        this.ceilWidth = this._computerCeilWidth();

        for (var a = 0, al  = data.length; a < al; a++ ) {
            var text = this._getFormatText( data[a] );
            var txt = new Canvax.Display.Text( text , {
                context: {
                    fontSize: this.label.fontSize
                }
            });
            
            var o = {
                ind : a,
                value   : data[a],
                text    : text,
                x       : this.getPosX({
                    val : data[a],
                    ind : a,
                    dataLen: al,
                    width : this.width
                }),
                textWidth: txt.getTextWidth(),
                field : this.field
            };

            tmpData.push( o );
        };
        return tmpData;
    }

    _getFormatText( val )
    {
        var res;
        if (_.isFunction(this.label.format)) {
            res = this.label.format( val );
        } else {
            res = val
        }
        
        if (_.isArray(res)) {
            res = Tools.numAddSymbol(res);
        }
        if (!res) {
            res = val;
        };
        return res;
    }

    _widget( opt )
    {
        if( !this.enabled ) return;
        !opt && (opt ={});

        var arr = this.layoutData

        if (this._name) {
            this._name.context.x = this.width + 5;
            this.sprite.addChild(this._name);
        };

        var delay = Math.min(1000 / arr.length, 25);

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

        
            if ( this.label.enabled && !!arr[a].visible ){
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

                if( xNode._txt ){
                    //_.extend( xNode._txt.context , textContext );
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

                //xNode._txt.context.visible = !!arr[a].visible;
            };
            

            if ( this.tickLine.enabled && !!arr[a].visible ) {
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
            };

            //这里可以由用户来自定义过滤 来 决定 该node的样式
            _.isFunction(this.filter) && this.filter({
                layoutData: arr,
                index: a,
                txt: xNode._txt,
                line: xNode._line || null
            });
            
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
            var _axisline = new Line({
                context : {
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
                }
            });
            this.sprite.addChild( _axisline );
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

                        var txt = new Canvax.Display.Text( me._getFormatText(val) , {
                            context: {
                                fontSize: me.label.fontSize
                            }
                        });
            
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

                        //没有设置旋转
                        if( me.isH ){
                            //横向柱状图
                            
                        };

                        _maxTextHeight = Math.max( _maxTextHeight, height);
                    
                } );
            };

            this.height = _maxTextHeight + this.tickLine.lineLength + this.tickLine.distance + this.label.distance;
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
        if( this._coord._root ){
            rootPaddingRight = this._coord._root.padding.right;
        }
        return rootPaddingRight;
    }

    _checkOver()
    {
        var me = this;
        var arr = me.layoutData;

        //现在的柱状图的自定义datasection有缺陷
        if( me.trimLayout ){
            //如果用户有手动的 trimLayout ，那么就全部visible为true，然后调用用户自己的过滤程序
            //trimLayout就事把arr种的每个元素的visible设置为true和false的过程
            me.trimLayout( arr );
            return;
        }

        var l = arr.length;  
        var textAlign = me.label.textAlign;              

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
                        next._text_x = me.width - nextWidth/2;
                    }
                    if( textAlign == "left" && (next.x+nextWidth) > me.width ){
                        next_left_x = me.width - nextWidth;
                        next._text_x = me.width - nextWidth;
                    }
                }

                //重叠，容许2px的误差
                if( next_left_x - curr_right_x < -2 ){
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