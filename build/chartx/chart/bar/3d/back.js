define('chartx/chart/bar/3d/back',
    [
        "canvax/index",
        "canvax/shape/Line",
        "chartx/utils/tools"
    ],
    function (Canvax, Line, Tools) {
        var Back = function (root) {

            var opt = root.back;
            this.root = root;
            this.w = 0;
            this.h = 0;
            this._depth = -100;

            this.pos = {
                x: 0,
                y: 0
            }

            this.enabled = 1;

            this.xOrigin = {                                //原点开始的x轴线
                enabled: 1,
                lineWidth: 1,
                strokeStyle: '#e6e6e6'
            }
            this.yOrigin = {                                //原点开始的y轴线
                enabled: 1,
                lineWidth: 1,
                strokeStyle: '#e6e6e6',
                biaxial: false
            }
            this.xAxis = {                                //x轴上的线
                enabled: 1,
                data: [],                      //[{y:100},{}]
                org: null,                    //x轴坐标原点，默认为上面的data[0]
                // data     : [{y:0},{y:-100},{y:-200},{y:-300},{y:-400},{y:-500},{y:-600},{y:-700}],
                lineType: 'solid',                //线条类型(dashed = 虚线 | '' = 实线)
                lineWidth: 1,
                strokeStyle: '#f0f0f0', //'#e5e5e5',
                filter: null
            }
            this.yAxis = {                                //y轴上的线
                enabled: 1,
                data: [],                      //[{x:100},{}]
                org: null,                    //y轴坐标原点，默认为上面的data[0]
                // data     : [{x:100},{x:200},{x:300},{x:400},{x:500},{x:600},{x:700}],
                lineType: 'solid',                      //线条类型(dashed = 虚线 | '' = 实线)
                lineWidth: 1,
                strokeStyle: '#f0f0f0',//'#e5e5e5',
                filter: null
            }

            this.sprite = null;                       //总的sprite
            this.xAxisSp = null;                       //x轴上的线集合
            this.yAxisSp = null;                       //y轴上的线集合

            this.animation = true;
            this.resize = false;

            this.init(opt);
        };

        Back.prototype = {

            init: function (opt) {
                _.deepExtend(this, opt);
                if (opt && opt.depth) {
                    this._depth = -opt.depth;
                }
                this.sprite = new Canvax.Display.Sprite();
            },
            setX: function ($n) {
                this.sprite.context.x = $n
            },
            setY: function ($n) {
                this.sprite.context.y = $n
            },

            draw: function (opt) {
                _.deepExtend(this, opt);
                //this._configData(opt);
                this._widget();
                this.setX(this.pos.x);
                this.setY(this.pos.y);
            },
            update: function (opt) {
                this.sprite.removeAllChildren();
                this.draw(opt);
            },
            _widget: function () {
                var self = this;

                var _depth = this._depth;
                if (!this.enabled) {
                    return
                }
                self.xAxisSp = self.sprite.getChildById('Back_xAsix') ||
                    new Canvax.Display.Sprite({
                        id: 'Back_xAsix'
                    }),
                    self.sprite.addChild(self.xAxisSp);
                self.yAxisSp = self.sprite.getChildById('Back_yAsix') ||
                    new Canvax.Display.Sprite({
                        id: 'Back_yAsix'
                    }),
                    self.sprite.addChild(self.yAxisSp)

                //x轴方向的线集合
                var arr = self.xAxis.data;
                for (var a = 0, al = arr.length; a < al; a++) {
                    var o = arr[a];
                    var line = self.xAxisSp.getChildById("back_line_xAxis" + a)||
                        new Line({
                        id: "back_line_xAxis" + a,
                        context: {
                            lineType: self.xAxis.lineType,
                            lineWidth: self.xAxis.lineWidth,
                            strokeStyle: self.xAxis.strokeStyle
                        }
                    });

                    line.context.xStart=0;
                    line.context.yStart=o.y;
                    line.context.xEnd=self.w;
                    line.context.yEnd= o.y;

                    //todo:line的context不能保留额外的值
                    line.zStart=_depth;
                    line.zEnd=_depth;

                    if (self.xAxis.enabled) {
                        _.isFunction(self.xAxis.filter) && self.xAxis.filter({
                            layoutData: self.yAxis.data,
                            index: a,
                            line: line
                        });
                        self.xAxisSp.addChild(line);

                        //if (false && this.animation && !this.resize) {
                        //    line.animate({
                        //        xStart: 0,
                        //        xEnd: self.w
                        //    }, {
                        //        duration: 500,
                        //        //easing : 'Back.Out',//Tween.Easing.Elastic.InOut
                        //        delay: (al - a) * 80,
                        //        id: line.id
                        //    });
                        //} else {
                        //    line.context.xStart = 0;
                        //    line.context.xEnd = self.w;
                        //}

                        //绘制Z轴的线条
                        var line =self.xAxisSp.getChildById("back_line_xAxis_z" + a)||
                            new Line({
                            id: "back_line_xAxis_z" + a,
                            context: {
                                lineType: self.xAxis.lineType,
                                lineWidth: self.xAxis.lineWidth,
                                strokeStyle: self.xAxis.strokeStyle
                            }
                        });

                        line.context.xStart=0;
                        line.context.yStart=o.y;
                        line.context.xEnd=0;
                        line.context.yEnd=o.y;

                        line.zStart=0;
                        line.zEnd=_depth;
                        self.xAxisSp.addChild(line);

                    }

                }
                ;

                //y轴方向的线集合
                var arr = self.yAxis.data
                for (var a = 0, al = arr.length; a < al; a++) {
                    var o = arr[a]
                    var line = self.yAxisSp.getChildById('back_line_yAxis'+a)||
                        new Line({
                            id:'back_line_yAxis'+a,
                        context: {
                            lineType: self.yAxis.lineType,
                            lineWidth: self.yAxis.lineWidth,
                            strokeStyle: self.yAxis.strokeStyle,
                            visible: o.x ? true : false
                        }
                    })
                    line.context.xStart= o.x;
                    line.context.yStart=0;
                    line.context.xEnd= o.x;
                    line.context.yEnd=-self.h;
                    line.zStart=_depth;
                    line.zEnd=_depth;

                    if (self.yAxis.enabled) {
                        _.isFunction(self.yAxis.filter) && self.yAxis.filter({
                            layoutData: self.xAxis.data,
                            index: a,
                            line: line
                        });
                        self.yAxisSp.addChild(line);

                        //绘制Z轴的线条
                        var line =self.yAxisSp.getChildById('back_line_yAxis_z'+a)||
                            new Line({
                                id:'back_line_yAxis_z'+a,
                            context: {
                                lineType: self.yAxis.lineType,
                                lineWidth: self.yAxis.lineWidth,
                                strokeStyle: self.yAxis.strokeStyle,
                                visible: o.x ? true : false
                            }
                        })
                        line.context.xStart= o.x;
                        line.context.yStart=0;
                        line.context.xEnd= o.x;
                        line.context.yEnd=0;
                        line.zStart=0;
                        line.zEnd=_depth;

                        self.yAxisSp.addChild(line);
                    }
                }
                var line = self.yAxisSp.getChildById('back_line_yAxis_00')||
                    new Line({
                        id:'back_line_yAxis_00',
                        context: {
                            lineType: self.yAxis.lineType,
                            lineWidth: self.yAxis.lineWidth,
                            strokeStyle: self.yAxis.strokeStyle,
                            visible: o.x ? true : false
                        }
                    })
                line.context.xStart= 0;
                line.context.yStart=0;
                line.context.xEnd= 0;
                line.context.yEnd=-self.h;
                line.zStart=_depth;
                line.zEnd=_depth;
                self.yAxisSp.addChild(line);
                ;

                //原点开始的y轴线
                var xAxisOrg = (self.yAxis.org == null ? 0 : _.find(self.yAxis.data, function (obj) {
                    return obj.content == self.yAxis.org
                }).x );

                //self.yAxis.org = xAxisOrg;
                var line = self.sprite.getChildById('Back_xAxisOrg')||
                    new Line({
                        id:'Back_xAxisOrg',
                    context: {
                        lineWidth: self.yOrigin.lineWidth,
                        strokeStyle: self.yOrigin.strokeStyle
                    }
                });
                line.context.xStart= xAxisOrg;
                line.context.yStart=0;
                line.context.xEnd= xAxisOrg;
                line.context.yEnd=-self.h;
                line.zStart=0;
                line.zEnd=0;

                if (self.yOrigin.enabled)
                    self.sprite.addChild(line)

                if (self.yOrigin.biaxial) {
                    var lineR = self.sprite.getChildById('Back_biaxial')||
                        new Line({
                        id:'Back_biaxial',
                        context: {
                            lineWidth: self.yOrigin.lineWidth,
                            strokeStyle: self.yOrigin.strokeStyle
                        }
                    })

                    line.context.xStart= self.w;
                    line.context.yStart=0;
                    line.context.xEnd= self.w;
                    line.context.yEnd=-self.h;
                    lineR.zStart=0;
                    lineR.zEnd=0;
                    if (self.yOrigin.enabled)
                        self.sprite.addChild(lineR)

                }

                //原点开始的x轴线
                var yAxisOrg = (self.xAxis.org == null ? 0 : _.find(self.xAxis.data, function (obj) {
                    return obj.content == self.xAxis.org
                }).y );

                //self.xAxis.org = yAxisOrg;
                var line = self.sprite.getChildById("Back_yAxisOrg")||
                    new Line({
                    id:"Back_yAxisOrg",
                    context: {
                        lineWidth: self.xOrigin.lineWidth,
                        strokeStyle: self.xOrigin.strokeStyle
                    }
                })
                line.context.xStart= yAxisOrg;
                line.context.yStart=0;
                line.context.xEnd= self.w;
                line.context.yEnd=yAxisOrg;
                line.zStart=0;
                line.zEnd=0;
                if (self.xOrigin.enabled)
                    self.sprite.addChild(line)
            }

        };

        return Back;
    });