import Component from "../component"
import Canvax from "canvax2d"
import {numAddSymbol} from "../../utils/tools"
import DataSection from "../../utils/datasection"

const Line = Canvax.Shapes.Line;
const _ = Canvax._;

export default class xAxis extends Component
{
    constructor(opts, data, _coordinate)
    {
        super();

        this._opts = opts;

        this._coordinate = _coordinate || {};

        this.width = 0;
        this.height = 0;

        this.label = "";
        this._label = null; //this.label对应的文本对象

        this.line = {
            enabled: 1, //是否有line
            width: 1,
            height: 4,
            marginTop : 2,
            strokeStyle: '#cccccc'
        };

        this.text = {
            fillStyle: '#999',
            fontSize: 12,
            rotation: 0,
            format: null,
            marginTop : 2,
            textAlign: "center"
        };
        this.maxTxtH = 0;

        this.pos = {
            x: 0,
            y: 0
        };

        this.display = true; //是否需要位置来绘制

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
        this.resize = false;

        //layoutType == "proportion"的时候才有效
        this.maxVal = null; 
        this.minVal = null; 

        this.ceilWidth = 0; //x方向一维均分长度, layoutType == peak 的时候要用到

        this.layoutType = "rule"; // rule（均分，起点在0） , peak（均分，起点在均分单位的中心）, proportion（实际数据真实位置，数据一定是number）

        //如果用户有手动的 trimLayout ，那么就全部visible为true，然后调用用户自己的过滤程序
        //trimLayout就事把arr种的每个元素的visible设置为true和false的过程
        //function
        this.trimLayout = null;

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

        if (this.text.rotation != 0 ) {
            if(this.text.rotation % 90 == 0){
                this.isH = true;
            };
            this.text.textAlign = "right";
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
        }
        return iNode
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

        this._widget();

        this.resize = false;
    }

    _getLabel()
    {
        if (this.label && this.label != "") {
            if( !this._label ){
                this._label = new Canvax.Display.Text(this.label, {
                    context: {
                        fontSize: this.text.fontSize,
                        textAlign: this.isH ? "center" : "left",
                        textBaseline: this.isH ? "top" : "middle",
                        fillStyle: this.text.fillStyle,
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
                x = this.ceilWidth * (ind+1) - this.ceilWidth/2;
            };
        };

        //if( this.posParseToInt ){
            return parseInt( x , 10 );
        //} else { 
            //return x;
        //}
        
    }

    _trimXAxis($data) 
    {
        var tmpData = [];
        var data = $data || this.dataSection;
        var width = this.width;

        //ceilWidth默认按照peak算, 而且不能按照dataSection的length来做分母
        this.ceilWidth = width / this.dataOrg.length;
        if( this.layoutType == "rule" ){
            this.ceilWidth = width / ( this.dataOrg.length - 1 )
        }

        for (var a = 0, al  = data.length; a < al; a++ ) {
            var layoutText = this._getFormatText( data[a] )
            var txt = new Canvax.Display.Text( layoutText , {
                context: {
                    fontSize: this.text.fontSize
                }
            });
            
            var o = {
                value   : data[a],
                layoutText : layoutText,
                x       : this.getPosX({
                    val : data[a],
                    ind : a,
                    dataLen: al,
                    width : width
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
        if (!this.display) {
            this.height = 3; 
        } else {
            var txt = new Canvax.Display.Text(this._layoutDataSection[0] || "test", {
                context: {
                    fontSize: this.text.fontSize
                }
            });

            this.maxTxtH = txt.getTextHeight();

            if (!!this.text.rotation) {
                if (this.text.rotation % 90 == 0) {
                    this.height = parseInt( this._textMaxWidth );
                } else {
                    var sinR = Math.sin(Math.abs(this.text.rotation) * Math.PI / 180);
                    var cosR = Math.cos(Math.abs(this.text.rotation) * Math.PI / 180);
                    this.height = parseInt(sinR * this._textMaxWidth + txt.getTextHeight() + 5);
                }
            } else {
                this.height = parseInt( this.maxTxtH );
            }

            this.height += this.line.height + this.line.marginTop + this.text.marginTop;
        }
    }

    _getFormatText(text)
    {
        var res;
        if (_.isFunction(this.text.format)) {
            res = this.text.format(text);
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

    _widget()
    {
        if( !this.display ) return;

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
                y = this.line.height + this.line.marginTop + this.text.marginTop;

            //文字
            var textContext = {
                x: o.text_x || o.x,
                y: y + 20,
                fillStyle: this.text.fillStyle,
                fontSize: this.text.fontSize,
                rotation: -Math.abs(this.text.rotation),
                textAlign: this.text.textAlign,
                textBaseline: !!this.text.rotation ? "middle" : "top",
                globalAlpha: 0
            };

            if (!!this.text.rotation && this.text.rotation != 90) {
                textContext.x += 5;
                textContext.y += 3;
            };

            if( xNode._txt ){
                //_.extend( xNode._txt.context , textContext );
                //debugger
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
                if (this.animation && !this.resize) {
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
            

            if (this.line.enabled) {
                var lineContext = {
                    x: x,
                    y: this.line.marginTop,
                    end : {
                        x : 0,
                        y : this.line.height
                    },
                    lineWidth: this.line.width,
                    strokeStyle: this.line.strokeStyle
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

    }

    _setTextMaxWidth()
    {
        var arr = this._layoutDataSection;
        var maxLenText = arr[0];

        for (var a = 0, l = arr.length; a < l; a++) {
            if ((arr[a]+'').length > maxLenText.length) {
                maxLenText = arr[a];
            }
        };

        var txt = new Canvax.Display.Text(maxLenText || "test", {
            context: {
                fillStyle: this.text.fillStyle,
                fontSize: this.text.fontSize
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

        if( !this.display || !l ) return;

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
        if( this._coordinate._root ){
            rootPaddingRight = this._coordinate._root.padding.right;
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
                if(!!me.text.rotation){
                    nextWidth = 35
                    currWidth = 35
                }

                
                var next_x = next.x;
                if( me.text.textAlign == "center" ){
                    next_x = next.x - nextWidth/2;
                };

                if( ii == l-2 ){
                    //next是最后一个
                    if( me.text.textAlign == "center" && (next.x+nextWidth/2) > me.width ){
                        next_x = me.width - nextWidth;
                        next.text_x = me.width - nextWidth/2 + me._getRootPR();
                    }
                    if( me.text.textAlign == "left" && (next.x+nextWidth) > me.width ){
                        next_x = me.width - nextWidth;
                        next.text_x = me.width - nextWidth;
                    }
                }

                if( next_x < curr.x+currWidth/2 ){
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