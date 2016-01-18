define(
    "chartx/chart/hybrid/bar_tgi", [
        'chartx/chart/bar/index',
        'chartx/components/yaxis/yAxis'
    ],
    function(Bar , yAxis) {
        return Bar.extend({
            _init: function(node, data, opts) {
                this.tgi = {
                    yAxis: {
                        field: "tgi",
                        text : {
                            format : function(num){
                                if( num == 200 ){
debugger
                                }
                                return num
                            }
                        }
                    }
                };

                if (opts.tgi) {
                    _.deepExtend(this.tgi, opts.tgi);
                };
                var me = this;
                this._tgiData = _.find(this.dataFrame.data , function(item){ return item.field == me.tgi.yAxis.field });

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
            _setTgiYaxis: function() {
                var me = this;
                this._yAxisR = new yAxis(_.extend(_.clone(this.tgi.yAxis), {
                    place: "right"
                }), me._tgiData);
                this.maxOrgYaxis = _.max( this._yAxisR.dataSection );
                this._yAxisR._bottomNumber = 0;
                this._yAxisR.baseNumber = 0;
                this._yAxisR.dataSection = [ 0 , 100 , 200 ];
            },
            _tgiDraw: function() {
                //this._xAxis.sprite.context.scaleX = 0.9
                if (this._yAxisR) {
                    this.core.addChild(this._yAxisR.sprite);
                };
            },
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

                if (this.dataZoom.enabled) {
                    this.__cloneBar = this._getCloneBar();
                    this._yAxis.resetData(this.__cloneBar.thumbBar.dataFrame.yAxis, {
                        animation: false
                    });
                };

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
                }
            }
        });
    }
);