import Component from "../component"
import Canvax from "canvax2d"
import {numAddSymbol} from "../../utils/tools"
import DataSection from "../../utils/datasection"

const Line = Canvax.Shapes.Line;
const _ = Canvax._;

export default class xAxis extends Component
{
    constructor(opts, data, _coord)
    {
        super();

        this._opts = opts;

        this._coord = _coord || {};

        this.width = 0;
        this.height = 0;

        this.label = "";
        this._label = null; //this.label对应的文本对象

        this.ruler = {
            enabled : true,
            line : {
                enabled    : 1, //是否有line
                lineWidth  : 1,
                height     : 4,
                marginTop  : 2,
                strokeStyle: '#cccccc'
            },
            text : {
                fontColor  : '#999',
                fontSize   : 12,
                rotation   : 0,
                format     : null,
                marginTop  : 2,
                textAlign  : "center",
                lineHeight : 1
            }
        };

        this.maxTxtH = 0;

        this.pos = {
            x: 0,
            y: 0
        };

        this.dataOrg = []; //源数据
        this.dataSection = []; //默认就等于源数据,也可以用户自定义传入来指定

        this._layoutDataSection = []; //dataSection的 format 后的数据
        this.layoutData = []; //{x:100, value:'1000',visible:true}

        this.sprite = null;

        this._textMaxWidth = 0;

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

        _.extend(true , this, opts);

        this.init(opts, data);

        //xAxis的field只有一个值,
        this.field = _.flatten( [ this.field ] )[0];
    }

    init(opts, data) 
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

        if (this.ruler.text.rotation != 0 ) {
            //如果是旋转的文本，那么以右边为旋转中心点
            this.ruler.text.textAlign = "right";
        };


        //先计算出来显示文本
        this._layoutDataSection = this._formatDataSectionText(this.dataSection);

        //然后计算好最大的 width 和 最大的height，外部组件需要用
        this._setTextMaxWidth();
        this._setXAxisHeight();

        //取第一个数据来判断xaxis的刻度值类型是否为 number
        this.minVal == null && (this.minVal = _.min( this.dataSection ));
        if( isNaN(this.minVal) || this.minVal==Infinity ){
            this.minVal = 0;
        };
        this.maxVal == null && (this.maxVal = _.max( this.dataSection ));
        if( isNaN(this.maxVal) || this.maxVal==Infinity ){
            this.maxVal = 1;
        };

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
        this.draw();
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

        var layoutText = this._getFormatText( val );

        var o = {
            ind        : ind,
            value      : val,
            layoutText : layoutText,
            x          : x,

            field      : this.field
        };

        return o;
    }
    
    draw(opts)
    {
        //首次渲染从 直角坐标系组件中会传入 opts
        this._getLabel();
        this._computerConfit(opts);
        this.layoutData = this._trimXAxis(this.dataSection);

        this._trimLayoutData();

        this.sprite.context.x = this.pos.x;
        this.sprite.context.y = this.pos.y;

        this._widget( opts );

    }

    _getLabel()
    {
        if (this.label && this.label != "") {
            if( !this._label ){
                this._label = new Canvax.Display.Text(this.label, {
                    context: {
                        fontSize: this.ruler.text.fontSize,
                        textAlign: this.isH ? "center" : "left",
                        textBaseline: this.isH ? "top" : "middle",
                        fillStyle: this.ruler.text.fontColor,
                        rotation: this.isH ? -90 : 0
                    }
                });
            } else {
                this._label.resetText( this.label );
            }
        }
    }

    //初始化配置
    _computerConfit(opts)
    {
        if (opts) {
            _.extend(true, this, opts);
        };

        if (this._label) {
            if (this.isH) {
                this.width -= this._label.getTextHeight() + 5
            } else {
                this.width -= this._label.getTextWidth() + 5
            }
        };
    }

    //获取x对应的位置
    //val ind 至少要有一个
    getPosX( opts )
    {
        var x = 0;
        var val = opts.val; 
        var ind = "ind" in opts ? opts.ind : _.indexOf( this.dataSection , val );//如果没有ind 那么一定要有val
        var dataLen = "dataLen" in opts ? opts.dataLen : this.dataSection.length;
        var width = "width" in opts ? opts.width : this.width;
        var layoutType = "layoutType" in opts ? opts.layoutType : this.layoutType;

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
            var layoutText = this._getFormatText( data[a] )
            var txt = new Canvax.Display.Text( layoutText , {
                context: {
                    fontSize: this.ruler.text.fontSize
                }
            });
            
            var o = {
                ind : a,
                value   : data[a],
                layoutText : layoutText,
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

    _formatDataSectionText(arr)
    {
        if (!arr) {
            arr = this.dataSection;
        };
        var me = this;
        var currArr = [];
        _.each(arr, function(val) {
            currArr.push(me._getFormatText(val));
        });
        return currArr;
    }


    _setXAxisHeight()
    { //检测下文字的高等
        if (!this.ruler.enabled) {
            this.height = 3; 
        } else {
            var txt = new Canvax.Display.Text(this._layoutDataSection[0] || "test", {
                context: {
                    fontSize: this.ruler.text.fontSize
                }
            });

            this.maxTxtH = txt.getTextHeight();

            if (!!this.ruler.text.rotation) {
                if (this.ruler.text.rotation % 90 == 0) {
                    this.height = parseInt( this._textMaxWidth );
                } else {
                    var sinR = Math.sin(Math.abs(this.ruler.text.rotation) * Math.PI / 180);
                    var cosR = Math.cos(Math.abs(this.ruler.text.rotation) * Math.PI / 180);
                    this.height = parseInt(sinR * this._textMaxWidth + txt.getTextHeight() + 5);
                }
            } else {
                this.height = parseInt( this.maxTxtH );
            }

            this.height += this.ruler.line.height + this.ruler.line.marginTop + this.ruler.text.marginTop;
        }
    }

    _getFormatText(text)
    {
        var res;
        if (_.isFunction(this.ruler.text.format)) {
            res = this.ruler.text.format(text);
        } else {
            res = text
        }
        
        if (_.isArray(res)) {
            res = Tools.numAddSymbol(res);
        }
        if (!res) {
            res = text;
        };
        return res;
    }

    _widget( opts )
    {
        if( !this.ruler.enabled ) return;
        !opts && (opts ={});

        var arr = this.layoutData

        if (this._label) {
            this._label.context.x = this.width + 5;
            this.sprite.addChild(this._label);
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
            }


            xNode.context.visible = !!arr[a].visible;

            var o = arr[a]
            var x = o.x,
                y = this.ruler.line.height + this.ruler.line.marginTop + this.ruler.text.marginTop;

            //文字
            var textContext = {
                x: o._text_x || o.x,
                y: y + 20,
                fillStyle    : this.ruler.text.fontColor,
                fontSize     : this.ruler.text.fontSize,
                rotation     : -Math.abs(this.ruler.text.rotation),
                textAlign    : this.ruler.text.textAlign,
                lineHeight   : this.ruler.text.lineHeight,
                textBaseline : !!this.ruler.text.rotation ? "middle" : "top",
                globalAlpha  : 0
            };

            if (!!this.ruler.text.rotation && this.ruler.text.rotation != 90) {
                textContext.x += 5;
                textContext.y += 3;
            };

            if( xNode._txt ){
                //_.extend( xNode._txt.context , textContext );
                xNode._txt.resetText( o.layoutText+"" );
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

                xNode._txt = new Canvax.Display.Text(o.layoutText, {
                    id: "xAxis_txt_" + a,
                    context: textContext
                });
                xNode.addChild( xNode._txt );

                //新建的 txt的 动画方式
                if (this.animation && !opts.resize) {
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
            

            if (this.ruler.line.enabled) {
                var lineContext = {
                    x: x,
                    y: this.ruler.line.marginTop,
                    end : {
                        x : 0,
                        y : this.ruler.line.height
                    },
                    lineWidth: this.ruler.line.lineWidth,
                    strokeStyle: this.ruler.line.strokeStyle
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
        var _axisline = new Line({
            context : {
                start       : {
                    x : 0,
                    y : 0
                },
                end         : {
                    x : this.width,
                    y : 0
                },
                lineWidth   : this.ruler.line.lineWidth,
                strokeStyle : this.ruler.line.strokeStyle
            }
        });
        this.sprite.addChild( _axisline );

    }

    _setTextMaxWidth()
    {
        var arr = this._layoutDataSection;
        var _maxLenText = arr[0]; 
        //第一个值可能是null, undefined
        if( _maxLenText === null || _maxLenText === undefined ){
            _maxLenText = "";
        };

        for (var a = 0, l = arr.length; a < l; a++) {
            if( arr[a] === null || arr[a] === undefined ){
                continue;
            };
            if ((arr[a]+'').length > _maxLenText.length) {
                _maxLenText = arr[a];
            }
        };

        var txt = new Canvax.Display.Text( _maxLenText || "test", {
            context: {
                fillStyle: this.ruler.text.fontColor,
                fontSize: this.ruler.text.fontSize
            }
        });

        this._textMaxWidth = txt.getTextWidth();
        this._textMaxHeight = txt.getTextHeight();

        return this._textMaxWidth;
    }

    _trimLayoutData()
    {
        var me = this;
        var arr = this.layoutData;
        var l = arr.length;

        if( !this.ruler.enabled || !l ) return;

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
        var textAlign = me.ruler.text.textAlign;              

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
                if(!!me.ruler.text.rotation){
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

                if( next_left_x < curr_right_x ){
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