define(
    "chartx/chart/hybrid/bar_line", [
        'canvax/index',
        'chartx/chart/bar/index',
        'chartx/chart/line/index',
        'chartx/utils/dataformat',
        'chartx/components/yaxis/yAxis',
        'chartx/chart/line/graphs',
        'chartx/chart/line/tips'
    ],
    function(Canvax, Bar, Line, dataFormat, yAxis, lineGraphs, Tips) {
        //再柱状图的基础上开发柱折混合图表
        return Bar.extend({
            _yAxisR: null,
            init: function(node, data, opts) {
                //覆盖默认配置begin
                this.graphs = {
                    fill: {
                        alpha: 0
                    }
                };

                this._opts = opts;

                //覆盖默认配置end
                _.deepExtend(this, opts);

                this.dataFrame = this._initData(data, {
                    yAxis: this.yAxis.bar,
                    xAxis: this.xAxis
                });


                //附加折线部分
                this._lineChart = {
                    dataFrame: dataFormat(data, {
                        yAxis: this.yAxis.line,
                        xAxis: this.xAxis
                    }),
                    _graphs: null
                }
            },
            draw: function() {
                this._setStages();

                //柱状图初始化模块
                this._initModule();
                //附加折线的graphs module
                this._lineChart._graphs = new lineGraphs(this.graphs, this);

                //覆盖掉bar中的tip组件
                this._tip = new Tips(this.tips, this._lineChart.dataFrame, this.canvax.getDomContainer());

                //附加的折线图的y轴放在右侧
                this._yAxisR = new yAxis(
                    _.extend(_.clone(this.yAxis.line), {
                        place: "right"
                    }),
                    this._lineChart.dataFrame.yAxis
                );
                this.core.addChild(this._yAxisR.sprite);

                this._startDraw(); //开始绘图

                this._drawEnd(); //绘制结束，添加到舞台

                //附加的lineChart._graphs 添加到core
                this.core.addChild(this._lineChart._graphs.sprite);

                this.inited = true;

            },
            _startDraw: function(opt) {
                var me = this;
                var y = parseInt(me.height - me._xAxis.h);
                var graphsH = y - this.padding.top;

                //绘制yAxis
                me._yAxis.draw({
                    pos: {
                        x: this.padding.left,
                        y: y
                    },
                    yMaxHeight: graphsH
                });
                var _yAxisW = me._yAxis.w;

                //绘制右侧的y轴给line用
                var _yAxisRW = 0;
                if (me._yAxisR) {
                    me._yAxisR.draw({
                        pos: {
                            x: 0,
                            y: y
                        },
                        yMaxHeight: me._yAxis.yGraphsHeight
                    });
                    _yAxisRW = me._yAxisR.w;
                    //me._yAxisR.setX(me.width - _yAxisRW);
                    me._yAxisR.setX(this.width - _yAxisRW - this.padding.right + 1);
                };

                //绘制x轴
                me._xAxis.draw({
                    graphh: me.height,
                    graphw: me.width - _yAxisRW - this.padding.right,
                    yAxisW: _yAxisW
                });
                if (me._xAxis.yAxisW != _yAxisW) {
                    //说明在xaxis里面的时候被修改过了。那么要同步到yaxis
                    me._yAxis.resetWidth(me._xAxis.yAxisW);
                    _yAxisW = me._xAxis.yAxisW;
                };
                var _graphsH = Math.max(me._yAxis.yGraphsHeight, me._yAxisR.yGraphsHeight);
                var _graphsW = me._xAxis.xGraphsWidth;
                //绘制背景网格
                me._back.draw({
                    w: _graphsW,
                    h: _graphsH,
                    yOrigin: {
                        biaxial: true
                    },
                    xAxis: {
                        data: me._yAxis.layoutData
                    },
                    yAxis: {
                        data: me._xAxis.layoutData
                    },
                    pos: {
                        x: _yAxisW,
                        y: y
                    }
                });


                var o = this._trimGraphs();
                this._yValueMaxs = o.yValueMaxs;
                this._yLen = o.yLen;
                this._yCenters = o.yCenters;

                //绘制柱状图主图形区域
                me._graphs.draw(o.data, {
                    w: _graphsW,
                    h: _graphsH,
                    pos: {
                        x: _yAxisW,
                        y: y
                    },
                    yDataSectionLen: me._yAxis.dataSection.length,
                    sort : this._yAxis.sort
                });

                //绘制折线图主图形区域
                me._lineChart._graphs.draw({
                    w: _graphsW,
                    h: _graphsH,
                    data: Line.prototype._trimGraphs.apply(me, [me._yAxisR, me._lineChart.dataFrame]),
                    disX: Line.prototype._getGraphsDisX.apply(me, []),
                    smooth: me.smooth
                });
                me._lineChart._graphs.setX(_yAxisW), me._lineChart._graphs.setY(y);
                me._lineChart._graphs.grow(function(g) {
                    if (me._opts.markLine) {
                        Line.prototype._initMarkLine.apply(me, [g, me._lineChart.dataFrame]);
                    };
                    if (me._opts.markPoint) {
                        Line.prototype._initMarkPoint.apply(me, [g, me._opts.markPoint]);
                    }
                    //me._initMarkLine( me._opts , g );
                });

                me._lineChart._graphs.sprite.getChildById("induce").context.visible = false;
            },
            //获取折线部分的tip info信息
            _getLineTipInfo: function(e) {
                //横向分组索引
                var igroup = e.target.iGroup;
                var _nodesInfoList = []; //节点信息集合
                var groups = this._lineChart._graphs.groups;
                if (!e.eventInfo) {
                    return;
                }
                for (var a = 0, al = groups.length; a < al; a++) {
                    var o = groups[a].getNodeInfoAt(igroup);
                    if (o) {
                        o.field = this._lineChart.dataFrame.yAxis.field[o._groupInd];
                        _nodesInfoList.push(o);
                    }
                };
                e.eventInfo.nodesInfoList = e.eventInfo.nodesInfoList.concat(_nodesInfoList);

                return {
                    x: this._xAxis.sprite.localToGlobal({
                        x: this._xAxis.data[igroup].x,
                        y: 0
                    }).x,
                    lineH: this._graphs.h,
                    lineTop: this._lineChart._graphs.induce.localToGlobal().y
                }
            },
            bindEvent: function() {
                var me = this;
                this.core.on("panstart mouseover", function(e) {
                    me._setXaxisYaxisToTipsInfo(e);
                    me._tip.show(e, me._getLineTipInfo(e));
                });
                this.core.on("panstart mousemove", function(e) {
                    me._setXaxisYaxisToTipsInfo(e);
                    me._tip.show(e, me._getLineTipInfo(e));
                });
                this.core.on("panstart mouseout", function(e) {
                    me._tip.hide(e);
                });
            }
        });
    }
);