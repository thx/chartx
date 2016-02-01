define(
    "chartx/chart/hybrid/bar_tgi", [
        'canvax/index',
        'chartx/chart/index',
        'chartx/chart/bar/index',
        'chartx/components/yaxis/yAxis',
        //'chartx/chart/bar/yaxis',
        'canvax/shape/Line',
        'chartx/utils/datasection'
    ],
    function(Canvax, Chart, Bar, yAxis, Line, DataSection) {
        var barTgi = Bar.extend({
            _init: function(node, data, opts) {
                var me = this;
                this.tgi = {
                    yAxis: {
                        field: "tgi",
                        text: {
                            format: function(num) {
                                if (num == 200 && (me.maxOrgYaxis > 100)) {
                                    return me.maxOrgYaxis;
                                };
                                return num;
                            }
                        },
                        place: "right"
                    },
                    back: {
                        line: {
                            strokeStyle: "#b7e6f8"
                        }
                    }
                };

                if (opts.tgi) {
                    _.deepExtend(this.tgi, opts.tgi);
                };
                var me = this;
                this._tgiData = _.find(this.dataFrame.data, function(item) {
                    return item.field == me.tgi.yAxis.field
                });

                this.on("_dataZoomDragIng _resetData", function(e) {
                    me.redraw();
                });

            },
            draw: function() {
                this._setStages();
                this._initModule(); //初始化模块
                this._setTgiYaxis();
                this._startDraw(); //开始绘图
                this._drawEnd(); //绘制结束，添加到舞台
                this._tgiDraw();
                this.inited = true;
            },
            redraw: function() {
                var me = this;
                this._tgiData = _.find(this.dataFrame.data, function(item) {
                    return item.field == me.tgi.yAxis.field
                });

                this.maxOrgYaxis = _.max(DataSection.section(this._tgiData.data, 3));
                this._yAxisR.dataSection = [0, 100, 200];
                this._yAxisR.draw();

                this._tgiGraphs.removeAllChildren();

                this._tgiGraphsDraw();

            },
            /*
             * 如果只有数据改动的情况
             */
            resetData: function(data) {
                this._data = data;

                this.dataFrame = this._initData(data, this);
                this._xAxis.resetData(this.dataFrame.xAxis, {
                    animation: false
                });

                if (this.dataZoom.enabled) {
                    this.__cloneBar = this._getCloneBar( barTgi );
                    this._yAxis.resetData(this.__cloneBar.thumbBar.dataFrame.yAxis, {
                        animation: false
                    });
                    this._dataZoom.sprite.destroy();
                    this._initDataZoom();
                } else {
                    this._yAxis.resetData(this.dataFrame.yAxis, {
                        animation: false
                    });
                };
                this._graphs.resetData(this._trimGraphs());
                this._graphs.grow(function() {
                    //callback
                }, {
                    delay: 0
                });
                this.fire("_resetData");
            },
            _setTgiYaxis: function() {
                var me = this;
                this._yAxisR = new yAxis(_.extend(_.clone(this.tgi.yAxis), {
                    place: "right"
                }), me._tgiData);
                this.maxOrgYaxis = _.max(this._yAxisR.dataSection);
                this._yAxisR._bottomNumber = 0;
                this._yAxisR.baseNumber = 0;
                this._yAxisR.dataSection = [0, 100, 200];
                //window.ya = this._yAxisR
            },
            _tgiDraw: function() {
                //this._xAxis.sprite.context.scaleX = 0.9
                if (this._yAxisR) {
                    this.core.addChild(this._yAxisR.sprite);
                };

                this._tgiBg = new Canvax.Display.Sprite({
                    id: 'tgiBg',
                    context: {
                        x: this._back.sprite.context.x,
                        y: this._back.sprite.context.y
                    }
                });

                this.core.addChildAt(this._tgiBg, 0);

                var midLine = new Line({
                    context: {
                        xStart: this._graphs.w,
                        yStart: this._yAxisR.layoutData[1].y,
                        xEnd: 0,
                        yEnd: this._yAxisR.layoutData[1].y,
                        lineWidth: 2,
                        strokeStyle: this.tgi.back.line.strokeStyle
                    }
                });
                var rLine = new Line({
                    context: {
                        xStart: this._graphs.w,
                        yStart: 0,
                        xEnd: this._graphs.w,
                        yEnd: -this._graphs.h,
                        lineWidth: 2,
                        strokeStyle: this.tgi.back.line.strokeStyle
                    }
                });
                this._tgiBg.addChild(midLine);
                this._tgiBg.addChild(rLine);

                this._tgiGraphs = new Canvax.Display.Sprite({
                    id: 'tgiGraphs',
                    context: {
                        x: this._graphs.sprite.context.x,
                        y: this._graphs.sprite.context.y
                    }
                });
                this.core.addChild(this._tgiGraphs);

                this._tgiGraphsDraw();
            },
            _tgiGraphsDraw: function() {
                var me = this;
                var dLen = this._tgiData.data.length;
                var itemW = this._graphs.w / dLen;
                _.each(this._tgiData.data, function(num, i) {

                    var x = itemW * i + (itemW-me._graphs.bar._width) / 2 ;
                    var y = 0;
                    if (num <= 100) {
                        y = -me._graphs.h / 2 * num / 100;
                    } else {
                        y = -(me._graphs.h / 2 + (me._graphs.h / 2 * (num - 100) / (me.maxOrgYaxis - 100)))
                    };
                    var tgiLine = new Line({
                        context: {
                            xStart: x,
                            yStart: y,
                            xEnd: x + me._graphs.bar._width + 2 ,
                            yEnd: y,
                            lineWidth: 2,
                            strokeStyle: (num > 100 ? "#43cbb5" : "#ff6060")
                        }
                    });
                    me._tgiGraphs.addChild(tgiLine);
                });
            },
            //继承覆盖了 bar 的_sartDraw方法
            _startDraw: function(opt) {
                var w = (opt && opt.w) || this.width;
                var h = (opt && opt.h) || this.height;
                var y = parseInt(h - this._xAxis.h);
                var graphsH = y - this.padding.top - this.padding.bottom;

                //绘制yAxis
                this._yAxis.draw({
                    pos: {
                        x: this.padding.left,
                        y: y - this.padding.bottom
                    },
                    yMaxHeight: graphsH
                });

                var _yAxisW = this._yAxis.w;

                //有双轴
                var _yAxisRW = 0;
                if (this._yAxisR) {
                    this._yAxisR.draw({
                        pos: {
                            x: 0, //this.padding.right,
                            y: y - this.padding.bottom
                        },
                        yMaxHeight: graphsH
                    });
                    _yAxisRW = this._yAxisR.w;
                    this._yAxisR.setX(this.width - _yAxisRW - this.padding.right + 1);
                };

                if (this.dataZoom.enabled) {
                    this.__cloneBar = this._getCloneBar( barTgi );
                    this._yAxis.resetData(this.__cloneBar.thumbBar.dataFrame.yAxis, {
                        animation: false
                    });
                };

                //绘制x轴
                this._xAxis.draw({
                    graphh: h - this.padding.bottom,
                    graphw: this.width - _yAxisRW - this.padding.right,
                    yAxisW: _yAxisW
                });
                if (this._xAxis.yAxisW != _yAxisW) {
                    //说明在xaxis里面的时候被修改过了。那么要同步到yaxis
                    this._yAxis.resetWidth(this._xAxis.yAxisW);
                    _yAxisW = this._xAxis.yAxisW;
                };

                var _graphsH = this._yAxis.yGraphsHeight;
                //绘制背景网格
                this._back.draw({
                    w: this._xAxis.xGraphsWidth,
                    h: _graphsH,
                    xAxis: {
                        data: this._yAxis.layoutData
                    },
                    yAxis: {
                        data: this._xAxis.layoutData
                    },
                    pos: {
                        x: _yAxisW,
                        y: y - this.padding.bottom
                    }
                });

                this._setaverageLayoutData();

                var o = this._trimGraphs();
                //绘制主图形区域
                this._graphs.draw(o.data, {
                    w: this._xAxis.xGraphsWidth,
                    h: this._yAxis.yGraphsHeight,
                    pos: {
                        x: _yAxisW,
                        y: y - this.padding.bottom
                    },
                    yDataSectionLen: this._yAxis.dataSection.length,
                    sort: this._yAxis.sort
                });

                if (this.dataZoom.enabled) {
                    this._initDataZoom();
                };
            }
        });

        return barTgi;
    }
);

