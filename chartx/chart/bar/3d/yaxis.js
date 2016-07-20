define('chartx/chart/bar/3d/yaxis',
    [
        "canvax/index",
        "canvax/core/Base",
        "canvax/shape/Rect",
        "chartx/utils/tools",
        "chartx/utils/datasection"
    ],
    function (Canvax, CanvaxBase, Rect, Tools, DataSection) {
        var Yaxis = function (opt, data , data1) {

            this.w = 0;
            this.enabled = 1; //true false 1,0都可以
            this.text = {
                fillStyle: '#999',
                fontSize: 12,
                format: null,
                rotation: 0
            };
            this.pos = {
                x: 0,
                y: 0
            };

            this.layoutData = []; //dataSection 对应的layout数据{y:-100, content:'1000'}
            this.dataSection = []; //从原数据 dataOrg 中 结果 datasection 重新计算后的数据
            this.dataOrg = []; //源数据

            this.sprite = null;

            this.disYAxisTopLine = 6; //y轴顶端预留的最小值
            this.yMaxHeight = 0; //y轴最大高
            this.yGraphsHeight = 0; //y轴第一条线到原点的高

            this.label = "";
            this._label = null; //label的text对象

            this.isH = false; //是否横向
            this.sort = null; //"asc" //排序，默认从小到大, desc为从大到小，之所以不设置默认值为asc，是要用null来判断用户是否进行了配置


            this.init(opt, data , data1);
        };

        Yaxis.prototype = {
            init: function (opt, data , data1) {
                _.deepExtend(this, opt);


                this._initData(data , data1);
                this.sprite = new Canvax.Display.Sprite();
            },
            setX: function($n) {
                this.sprite.context.x = $n + (this.place == "left" ? this.maxW : 0);
                this.pos.x = $n;
            },
            setY: function($n) {
                this.sprite.context.y = $n;
                this.pos.y = $n;
            },
            draw: function (opt) {

                this.sprite.removeAllChildren();
                opt && _.deepExtend(this, opt);
                this._getLabel();
                this.yGraphsHeight = this.yMaxHeight - this._getYAxisDisLine();

                if (this._label) {
                    if (this.isH) {
                        this.yGraphsHeight -= this._label.getTextWidth();
                    } else {
                        this.yGraphsHeight -= this._label.getTextHeight();
                    }
                    this._label.context.y = -this.yGraphsHeight - 5;
                };

                this._trimYAxis();
                this._widget();

                this.setX(this.pos.x);
                this.setY(this.pos.y);

                this.resize = false;
            },
            tansValToPos : function( val ){
                var max = this.dataSection[this.dataSection.length - 1];
                var y = -(val - this._bottomNumber) / (max - this._bottomNumber) * this.yGraphsHeight;
                y = isNaN(y) ? 0 : parseInt(y);
                return y;
            },
            _trimYAxis: function() {
                var max = this.dataSection[this.dataSection.length - 1];
                var tmpData = [];
                for (var a = 0, al = this.dataSection.length; a < al; a++) {

                    tmpData[a] = {
                        content: this.dataSection[a],
                        y: this.tansValToPos( this.dataSection[a] )
                    };
                }

                this.layoutData = tmpData;

                //设置basePoint
                var basePy = -(this.baseNumber - this._bottomNumber) / (max - this._bottomNumber) * this.yGraphsHeight;
                basePy = isNaN(basePy) ? 0 : parseInt(basePy);
                this.basePoint = {
                    content: this.baseNumber,
                    y: basePy
                }
            },
            _getLabel: function() {
                if (this.label && this.label != "") {
                    this._label = new Canvax.Display.Text(this.label, {
                        context: {
                            fontSize: this.text.fontSize,
                            textAlign: "left",
                            textBaseline: this.isH ? "top" : "bottom",
                            fillStyle: this.text.fillStyle,
                            rotation: this.isH ? -90 : 0
                        }
                    });
                }
            },
            _getYAxisDisLine: function() { //获取y轴顶高到第一条线之间的距离
                var disMin = this.disYAxisTopLine
                var disMax = 2 * disMin
                var dis = disMin
                dis = disMin + this.yMaxHeight % this.dataSection.length;
                dis = dis > disMax ? disMax : dis
                return dis
            },
            _setDataSection: function(data , data1) {
                var arr = [];
                var d = (data.org || data.data || data);
                if( data1 && _.isArray(data1) ){
                    d = d.concat(data1);
                }

                arr = _.flatten( d ); //_.flatten( data.org );

                for( var i = 0, il=arr.length; i<il ; i++ ){
                    arr[i] =  arr[i] || 0;
                };
                return arr;
            },

            _initData: function(data , data1) {
                var arr = this._setDataSection(data , data1);
                this.dataOrg = (data.org || data.data); //这里必须是data.org
                if (this.dataSection.length == 0) {
                    this.dataSection = DataSection.section(arr, 3);
                };

                //如果还是0
                if (this.dataSection.length == 0) {
                    this.dataSection = [0]
                };

                if (this.sort) {
                    var sort = "asc";
                    if (_.isString(this.sort)) {
                        sort = this.sort;
                    }
                    if (_.isArray(this.sort)) {
                        var i = 0;
                        if (this.place == "right") {
                            i = 1;
                        };
                        if (this.sort[i]) {
                            sort = this.sort[i];
                        };
                    };
                    if (sort == "desc") {
                        this.dataSection.reverse();
                    };
                };

                this._bottomNumber = this.dataSection[0];
                /*
                 if(arr.length == 1){
                 this.dataSection[0] = arr[0] * 2;
                 this._bottomNumber  = 0;
                 }
                 */
                if (this.baseNumber == null) {
                    this.baseNumber = this._bottomNumber > 0 ? this._bottomNumber : 0;
                }
            },
            _widget: function() {
                var self = this;
                if (!self.enabled) {
                    self.w = 0;
                    return;
                }
                var arr = this.layoutData;
                self.maxW = 0;
                self._label && self.sprite.addChild(self._label);
                for (var a = 0, al = arr.length; a < al; a++) {
                    var o = arr[a];
                    var x = 0,
                        y = o.y;
                    var content = o.content
                    if (_.isFunction(self.text.format)) {
                        content = self.text.format(content, self);
                    };
                    if( content === undefined || content === null ){
                        content = Tools.numAddSymbol( o.content );
                    };

                    var yNode = new Canvax.Display.Sprite({
                        id: "yNode" + a
                    });


                    var textAlign = (self.place == "left" ? "right" : "left");
                    //为横向图表把y轴反转后的 逻辑
                    if (self.text.rotation == 90 || self.text.rotation == -90) {
                        textAlign = "center";
                        if (a == arr.length - 1) {
                            textAlign = "right";
                        }
                    };
                    var posy = y + (a == 0 ? -3 : 0) + (a == arr.length - 1 ? 3 : 0);
                    //为横向图表把y轴反转后的 逻辑
                    if (self.text.rotation == 90 || self.text.rotation == -90) {
                        if (a == arr.length - 1) {
                            posy = y - 2;
                        }
                        if (a == 0) {
                            posy = y;
                        }
                    };

                    //文字
                    var txt = new Canvax.Display.Text(content, {
                        id: "yAxis_txt_" + CanvaxBase.getUID(),
                        context: {
                            x: x + (self.place == "left" ? -5 : 5),
                            y: posy + 20,
                            fillStyle: self.text.fillStyle,
                            fontSize: self.text.fontSize,
                            rotation: -Math.abs(this.text.rotation),
                            textAlign: textAlign,
                            textBaseline: "middle",
                            globalAlpha: 0
                        }
                    });
                    yNode.addChild(txt);

                    self.maxW = Math.max(self.maxW, txt.getTextWidth());
                    if (self.text.rotation == 90 || self.text.rotation == -90) {
                        self.maxW = Math.max(self.maxW, txt.getTextHeight());
                    }


                    //这里可以由用户来自定义过滤 来 决定 该node的样式
                    _.isFunction(self.filter) && self.filter({
                        layoutData: self.layoutData,
                        index: a,
                        txt: txt
                    });

                    self.sprite.addChild(yNode);

                    //如果是resize的话也不要处理动画
                    if (self.animation && !self.resize) {
                        txt.animate({
                            globalAlpha: 1,
                            y: txt.context.y - 20
                        }, {
                            duration: 500,
                            easing: 'Back.Out', //Tween.Easing.Elastic.InOut
                            delay: a * 80,
                            id: txt.id
                        });
                    } else {
                        txt.context.y = txt.context.y - 20;
                        txt.context.globalAlpha = 1;
                    }
                };

                self.maxW += self.dis;

                self.w = self.maxW + self.dis + self.pos.x;

            }
        };

        return Yaxis;
    });