define(
    "chartx/components/xaxis/xAxis", [
        "canvax/index",
        "canvax/shape/Line",
        "chartx/utils/tools"
    ],
    function(Canvax, Line, Tools) {
        var xAxis = function(opt, data) {
            this.graphw = 0;
            this.graphh = 0;
            this.yAxisW = 0;
            this.w = 0;
            this.h = 0;

            this.disY = 1;
            this.dis = 6; //线到文本的距离

            this.line = {
                enabled: 1, //是否有line
                width: 1,
                height: 4,
                strokeStyle: '#cccccc'
            }

            this.text = {
                fillStyle: '#999999',
                fontSize: 12,
                rotation: 0,
                format: null,
                textAlign: null
            }
            this.maxTxtH = 0;

            this.pos = {
                x: null,
                y: null
            }

            //this.display = "block";
            this.enabled = 1; //1,0 true ,false 

            this.disXAxisLine = 6; //x轴两端预留的最小值
            this.disOriginX = 0; //背景中原点开始的x轴线与x轴的第一条竖线的偏移量
            this.xGraphsWidth = 0; //x轴宽(去掉两端)

            this.dataOrg = []; //源数据
            this.dataSection = []; //默认就等于源数据
            this._layoutDataSection = []; //dataSection的format后的数据
            this.data = []; //{x:100, content:'1000'}
            this.layoutData = []; //this.data(可能数据过多),重新编排过滤后的数据集合, 并根据此数组展现文字和线条
            this.sprite = null;

            this._textMaxWidth = 0;
            this.leftDisX = 0; //x轴最左边需要的间距。默认等于第一个x value字符串长度的一半

            //过滤器，可以用来过滤哪些yaxis 的 节点是否显示已经颜色之类的
            //@params params包括 dataSection , 索引index，txt(canvax element) ，line(canvax element) 等属性
            this.filter = null; //function(params){}; 

            this.init(opt, data);
        };

        xAxis.prototype = {
            init: function(opt, data) {
                this.dataOrg = data.org;

                if (opt) {
                    _.deepExtend(this, opt);
                }

                if (!this.line.enabled) {
                    this.line.height = 1
                }

                this.sprite = new Canvax.Display.Sprite({
                    id: "xAxisSprite"
                });


                if (this.dataSection.length == 0) {
                    this.dataSection = this._initDataSection(this.dataOrg);
                };

                //先计算出来显示文本
                this._layoutDataSection = this._formatDataSectionText( this.dataSection );

                //然后计算好最大的width 和 最大的height，外部组件需要用
                this._setTextMaxWidth();
                this._setXAxisHeight();
            },
            /**
             *return dataSection 默认为xAxis.dataOrg的的faltten
             *即 [ [1,2,3,4] ] -- > [1,2,3,4]
             */
            _initDataSection: function(data) {
                return _.flatten(data);
            },
            setX: function($n) {
                this.sprite.context.x = $n
            },
            setY: function($n) {
                this.sprite.context.y = $n
            },
            draw: function(opt) {
                // this.data = [{x:0,content:'0000'},{x:100,content:'10000'},{x:200,content:'20000'},{x:300,content:'30000'},{x:400,content:'0000'},{x:500,content:'10000'},{x:600,content:'20000'}]
            
                this._initConfig(opt);
                this.data = this._trimXAxis(this.dataSection, this.xGraphsWidth);
                var me = this;
                _.each( this.data , function( obj , i){
                    obj.layoutText = me._layoutDataSection[i];
                } );
                
                this._trimLayoutData();

                this.setX(this.pos.x);
                this.setY(this.pos.y);

                if (this.enabled) { //this.display != "none"
                    this._widget();

                    if (!this.text.rotation) {
                        this._layout();
                    }
                }
                // this.data = this.layoutData
            },

            //初始化配置
            _initConfig: function(opt) {
                if (opt) {
                    _.deepExtend(this, opt);
                };

                this.yAxisW = Math.max(this.yAxisW, this.leftDisX);
                this.w = this.graphw - this.yAxisW;
                if (this.pos.x == null) {
                    this.pos.x = this.yAxisW + this.disOriginX;
                }
                if (this.pos.y == null) {
                    this.pos.y = this.graphh - this.h;
                }

                this.xGraphsWidth = this.w - this._getXAxisDisLine()
                this.disOriginX = parseInt((this.w - this.xGraphsWidth) / 2);
            },
            _trimXAxis: function(data, xGraphsWidth) {
                var tmpData = [];
                var dis = xGraphsWidth / (data.length + 1);
                for (var a = 0, al = data.length; a < al; a++) {
                    var o = {
                        'content': data[a],
                        'x': parseInt(dis * (a + 1))
                    }
                    tmpData.push(o);
                }
                return tmpData;
            },
            _formatDataSectionText : function(arr){
                if( !arr ){
                    arr = this.dataSection;
                };
                var me = this;
                var currArr = [];
                _.each( arr  , function( val ){
                    currArr.push( me._getFormatText( val ) );
                } );
                return currArr;
            },
            _getXAxisDisLine: function() { //获取x轴两端预留的距离
                var disMin = this.disXAxisLine
                var disMax = 2 * disMin
                var dis = disMin
                dis = disMin + this.w % this.dataOrg.length
                dis = dis > disMax ? disMax : dis
                dis = isNaN(dis) ? 0 : dis
                return dis
            },
            _setXAxisHeight: function() { //检测下文字的高等
                if (!this.enabled) { //this.display == "none"
                    this.dis = 0;
                    this.h = 3; //this.dis;//this.max.txtH;
                } else {
                    var txt = new Canvax.Display.Text(this._layoutDataSection[0] || "test", {
                        context: {
                            fontSize: this.text.fontSize
                        }
                    });

                    this.maxTxtH = txt.getTextHeight();

                    if (!!this.text.rotation) {
                        if (this.text.rotation % 90 == 0) {
                            this.h = this._textMaxWidth + this.line.height + this.disY + this.dis + 3;
                        } else {
                            var sinR = Math.sin(Math.abs(this.text.rotation) * Math.PI / 180);
                            var cosR = Math.cos(Math.abs(this.text.rotation) * Math.PI / 180);
                            this.h = sinR * this._textMaxWidth + txt.getTextHeight() + 5;
                            this.leftDisX = cosR * txt.getTextWidth() + 8;
                        }
                    } else {
                        this.h = this.disY + this.line.height + this.dis + this.maxTxtH;
                        this.leftDisX = txt.getTextWidth() / 2;
                    }
                }
            },
            _getFormatText: function(text) {
                var res;
                if (_.isFunction(this.text.format)) {
                    res = this.text.format(text);
                } else {
                    res = text
                }
                if( _.isArray( res ) ){
                    res = Tools.numAddSymbol(res);
                }
                return res;
            },
            _widget: function() {
                var arr = this.layoutData

                for (var a = 0, al = arr.length; a < al; a++) {

                    var xNode = new Canvax.Display.Sprite({
                        id: "xNode" + a
                    });

                    var o = arr[a]
                    var x = o.x,
                        y = this.disY + this.line.height + this.dis

                    //文字
                    var txt = new Canvax.Display.Text( o.layoutText , {
                        context: {
                            x: x,
                            y: y,
                            fillStyle: this.text.fillStyle,
                            fontSize: this.text.fontSize,
                            rotation: -Math.abs(this.text.rotation),
                            textAlign: this.text.textAlign || (!!this.text.rotation ? "right" : "center"),
                            textBaseline: !!this.text.rotation ? "middle" : "top"
                        }
                    });
                    xNode.addChild(txt);
                    if (!!this.text.rotation && this.text.rotation != 90) {
                        txt.context.x += 5;
                        txt.context.y += 3;
                    }

                    if (this.line.enabled) {
                        //线条
                        var line = new Line({
                            context: {
                                x: x,
                                y: this.disY,
                                xEnd: 0,
                                yEnd: this.line.height + this.disY,
                                lineWidth: this.line.width,
                                strokeStyle: this.line.strokeStyle
                            }
                        });
                        xNode.addChild(line);
                    }

                    //这里可以由用户来自定义过滤 来 决定 该node的样式
                    _.isFunction(this.filter) && this.filter({
                        layoutData: arr,
                        index: a,
                        txt: txt,
                        line: line || null
                    });

                    this.sprite.addChild(xNode);
                };

            },
            /*校验最后一个文本是否超出了界限。然后决定是否矫正*/
            _layout: function() {

                if (this.sprite.getNumChildren() == 0)
                    return;

                var popText = this.sprite.getChildAt(this.sprite.getNumChildren() - 1).getChildAt(0);
                if (popText) {
                    var pc = popText.context;
                    if (pc.textAlign == "center" &&
                        pc.x + popText.context.width / 2 > this.w) {
                        pc.x = this.w - popText.context.width / 2
                    };
                    if (pc.textAlign == "left" &&
                        pc.x + popText.context.width > this.w) {
                        pc.x = this.w - popText.context.width
                    };
                    if (this.sprite.getNumChildren() >= 2) {
                        //倒数第二个text
                        var popPreText = this.sprite.getChildAt(this.sprite.getNumChildren() - 2).getChildAt(0);

                        var ppc = popPreText.context;

                        //如果最后一个文本 和 倒数第二个 重叠了，就 隐藏掉
                        if (ppc.visible && pc.x < ppc.x + ppc.width) {
                            pc.visible = false;
                        }
                    }
                }
            },
            _setTextMaxWidth: function() {
                var arr = this._layoutDataSection;
                var maxLenText = arr[0];

                for (var a = 0, l = arr.length; a < l; a++) {
                    if (arr[a].length > maxLenText.length) {
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
            },
            _trimLayoutData: function() {

                var tmp = []
                var arr = this.data

                var mw = this._textMaxWidth + 10;

                if (!!this.text.rotation) {
                    mw = this._textMaxHeight * 1.5;
                };

                //总共能多少像素展现
                var n = Math.min(Math.floor(this.w / mw), arr.length - 1); //能展现几个

                if (n >= arr.length - 1) {
                    this.layoutData = arr;
                } else {
                    //需要做间隔
                    var dis = Math.max(Math.ceil(arr.length / n - 1), 0); //array中展现间隔
                    //存放展现的数据
                    for (var a = 0; a < n; a++) {
                        var obj = arr[a + dis * a];
                        obj && tmp.push(obj);
                    };
                    this.layoutData = tmp;
                };
            }
        };

        return xAxis;

    }
)
