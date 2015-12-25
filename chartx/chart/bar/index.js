define(
    "chartx/chart/bar/index", [
        'chartx/chart/index',
        'chartx/utils/tools',
        'chartx/utils/datasection',
        'chartx/chart/bar/xaxis',
        'chartx/chart/bar/yaxis',
        'chartx/components/back/Back',
        'chartx/chart/bar/graphs',
        'chartx/components/tips/tip',
        'chartx/utils/dataformat',
        'chartx/components/datazoom/index'
    ],
    function(Chart, Tools, DataSection, xAxis, yAxis, Back, Graphs, Tip, dataFormat, DataZoom) {
        /*
         *@node chart在dom里的目标容器节点。
         */
        var Canvax = Chart.Canvax;
        var Bar = Chart.extend({
            _xAxis: null,
            _yAxis: null,
            _back: null,
            _graphs: null,
            _tip: null,
            _checkedList: [], //所有的选择对象
            _currCheckedList: [], //当前的选择对象(根据dataZoom.start, dataZoom.end 过滤)

            init: function(node, data, opts) {

                this._node = node;
                this._data = data;
                this._opts = opts;

                if (opts.dataZoom) {
                    this.padding.bottom += 46;
                    this.dataZoom = {
                        range: {
                            start: 0,
                            end: data.length - 1 //因为第一行是title
                        }
                    }
                };

                if (opts.proportion) {
                    this.proportion = opts.proportion;
                    this._initProportion(node, data, opts);
                } else {
                    _.deepExtend(this, opts);
                };

                this.dataFrame = this._initData(data);
            },
            /*
             * 如果只有数据改动的情况
             */
            resetData: function(data) {
                this.dataFrame = this._initData(data, this);
                this._xAxis.resetData(this.dataFrame.xAxis, {
                    animation: false
                });
                this._yAxis.resetData(this.dataFrame.yAxis, {
                    animation: false
                });
                this._graphs.resetData(this._trimGraphs());
                this._graphs.grow(function() {
                    //callback
                }, {
                    delay: 0
                });
            },
            getCheckedCurrList: function() {
                var me = this
                return _.filter(me._getCurrCheckedList(), function(o) {
                    return o
                })
            },
            getCheckedList: function() { //获取选择之后的对象列表 列表中不含空对象 [eventInfo,evnetInfo,....]
                var me = this
                return _.filter(me._checkedList, function(o) {
                    return o
                })
            },
            cancelChecked: function(eventInfo) { //取消选择某个对象
                var me = this
                if (eventInfo) {
                    eventInfo.iGroup -= me.dataZoom.range.start
                    me._checked(eventInfo)
                }
            },
            getGroupChecked: function( e ) {
                var checked = false;
                _.each(this.getCheckedList(), function(obj) {
                    if (obj && obj.iGroup == e.eventInfo.iGroup) {
                        checked = true;
                    }
                });
                return checked
            },
            //如果为比例柱状图的话
            _initProportion: function(node, data, opts) {
                !opts.tips && (opts.tips = {});
                opts.tips = _.deepExtend(opts.tips, {
                    content: function(info) {
                        var str = "<table>";
                        var self = this;
                        _.each(info.nodesInfoList, function(node, i) {
                            str += "<tr style='color:" + self.text.fillStyle + "'>";
                            var prefixName = self.prefix[i];
                            if (prefixName) {
                                str += "<td>" + prefixName + "：</td>";
                            } else {
                                if (node.field) {
                                    str += "<td>" + node.field + "：</td>";
                                }
                            };
                            str += "<td>" + Tools.numAddSymbol(node.value) + "（" + Math.round(node.value / node.vCount * 100) + "%）</td></tr>";
                        });
                        str += "</table>";
                        return str;
                    }
                });

                _.deepExtend(this, opts);
                _.deepExtend(this.yAxis, {
                    dataSection: [0, 20, 40, 60, 80, 100],
                    text: {
                        format: function(n) {
                            return n + "%"
                        }
                    }
                });

                !this.graphs && (this.graphs = {});
                _.deepExtend(this.graphs, {
                    bar: {
                        radius: 0
                    }
                });
            },
            _setStages: function() {
                this.core = new Canvax.Display.Sprite({
                    id: 'core'
                });
                this.stageBg = new Canvax.Display.Sprite({
                    id: 'bg'
                });
                this.stageTip = new Canvax.Display.Sprite({
                    id: 'tip'
                });

                this.stage.addChild(this.stageBg);
                this.stage.addChild(this.core);
                this.stage.addChild(this.stageTip);

                if (this.rotate) {
                    this._rotate(this.rotate);
                }
            },
            draw: function() {

                this._setStages();

                this._initModule(); //初始化模块  

                this._startDraw(); //开始绘图

                this._drawEnd(); //绘制结束，添加到舞台

                this.inited = true;

            },
            _initData: function(data, opt) {
                var d;
                var dataZoom = (this.dataZoom || (opt && opt.dataZoom));
                if (dataZoom) {
                    var datas = [data[0]];
                    datas = datas.concat(data.slice(dataZoom.range.start + 1, dataZoom.range.end + 1));
                    d = dataFormat.apply(this, [datas, opt]);
                } else {
                    d = dataFormat.apply(this, arguments);
                };

                _.each(d.yAxis.field, function(field, i) {
                    if (!_.isArray(field)) {
                        field = [field];
                        d.yAxis.org[i] = [d.yAxis.org[i]];
                    }
                });

                return d;
            },
            _getaverageData: function() {
                var averageData = [];
                var me = this;
                if (this._graphs && this._graphs.average && this._graphs.average.data) {
                    return this._graphs.average.data
                };
                if (this._graphs.average.enabled) {
                    _.each(this.dataFrame.data, function(fd, i) {
                        if (fd.field == me._graphs.average.field) {
                            averageData = fd.data;
                        }
                    });
                };
                this._graphs.average.data = averageData;
                return averageData;
            },
            _setaverageLayoutData: function() {
                var layoutData = [];
                var me = this;
                if (this._graphs.average.enabled) {
                    var maxYAxis = this._yAxis.dataSection[this._yAxis.dataSection.length - 1];
                    _.each(this._graphs.average.data, function(fd, i) {
                        layoutData.push({
                            value: fd,
                            y: -(fd - me._yAxis._bottomNumber) / Math.abs(maxYAxis - me._yAxis._bottomNumber) * me._yAxis.yGraphsHeight
                        });
                    });
                    this._graphs.average.layoutData = layoutData;
                };
            },
            _initModule: function() {
                //因为tips放在graphs中，so 要吧tips的conf传到graphs中
                this._graphs = new Graphs(
                    this.graphs,
                    this
                );

                this._xAxis = new xAxis(this.xAxis, this.dataFrame.xAxis);

                this._yAxis = new yAxis(this.yAxis, this.dataFrame.yAxis, this._getaverageData());

                this._back = new Back(this.back);
                this._tip = new Tip(this.tips, this.canvax.getDomContainer());
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

                if (this.dataZoom) {
                    this.__cloneBar = this._getCloneBar();
                    this._yAxis.resetData(this.__cloneBar.thumbBar.dataFrame.yAxis, {
                        animation: false
                    });
                };

                var _yAxisW = this._yAxis.w;

                //绘制x轴
                this._xAxis.draw({
                    graphh: h - this.padding.bottom,
                    graphw: w - this.padding.right,
                    yAxisW: _yAxisW,
                    uniform: this._graphs.bar.uniform
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


                if (this.dataZoom) {
                    this._initDataZoom();
                }
            },

            //把这个点位置对应的x轴数据和y轴数据存到tips的info里面
            //方便外部自定义tip是的content
            _setXaxisYaxisToTipsInfo: function(e) {
                if (!e.eventInfo) {
                    return;
                }
                e.eventInfo.xAxis = {
                    field: this.dataFrame.xAxis.field,
                    value: this.dataFrame.xAxis.org[0][e.eventInfo.iGroup]
                }
                var me = this;
                _.each(e.eventInfo.nodesInfoList, function(node, i) {
                    if (_.isArray(me.dataFrame.yAxis.field[node.iNode])) {
                        node.field = me.dataFrame.yAxis.field[node.iNode][node.iLay];
                    } else {
                        node.field = me.dataFrame.yAxis.field[node.iNode]
                    }
                });
            },
            _trimGraphs: function(_xAxis, _yAxis) {
                _xAxis || (_xAxis = this._xAxis);
                _yAxis || (_yAxis = this._yAxis);
                var xArr = _xAxis.data;
                var yArr = _yAxis.dataOrg;
                var hLen = yArr.length; //bar的横向分组length

                var xDis1 = _xAxis.xDis1;
                //x方向的二维长度，就是一个bar分组里面可能有n个子bar柱子，那么要二次均分
                var xDis2 = xDis1 / (hLen + 1);

                //知道了xDis2 后 检测下 barW是否需要调整
                this._graphs.checkBarW && this._graphs.checkBarW(xDis1, xDis2);

                var maxYAxis = _yAxis.dataSection[_yAxis.dataSection.length - 1];
                var tmpData = [];
                var center = [],
                    yValueMaxs = [],
                    yLen = [];

                var me = this;
                for (var b = 0; b < hLen; b++) {
                    !tmpData[b] && (tmpData[b] = []);
                    yValueMaxs[b] = 0;
                    center[b] = {};
                    var yArrList = yArr[b];

                    _.each(yArrList, function(subv, v) {
                        !tmpData[b][v] && (tmpData[b][v] = []);

                        if (me.dataZoom) {
                            subv = subv.slice(me.dataZoom.range.start, me.dataZoom.range.end);
                        };

                        _.each(subv, function(val, i) {

                            if (!xArr[i]) {
                                return;
                            };

                            var vCount = 0;
                            if (me.proportion) {
                                //先计算总量
                                _.each(yArrList, function(team, ti) {
                                    vCount += team[i]
                                });
                            };

                            var x = xArr[i].x - xDis1 / 2 + xDis2 * (b + 1);

                            var y = 0;
                            if (me.proportion) {
                                y = -val / vCount * _yAxis.yGraphsHeight;
                            } else {
                                y = -(val - _yAxis._bottomNumber) / Math.abs(maxYAxis - _yAxis._bottomNumber) * _yAxis.yGraphsHeight;
                            };
                            if (v > 0) {
                                y += tmpData[b][v - 1][i].y;
                            };

                            //如果有排序的话
                            if (me._yAxis.sort && me._yAxis.sort == "desc") {
                                y = -(_yAxis.yGraphsHeight - Math.abs(y));
                            };

                            var node = {
                                value: val,
                                field: me._getTargetField(b, v, i, _yAxis.field),
                                x: x,
                                y: y
                            };

                            if (me.proportion) {
                                node.vCount = vCount;
                            };

                            tmpData[b][v].push(node);


                            yValueMaxs[b] += Number(val)
                            yLen = subv.length
                        });
                    });
                };

                for (var a = 0, al = yValueMaxs.length; a < al; a++) {
                    center[a].agValue = yValueMaxs[a] / yLen
                    center[a].agPosition = -(yValueMaxs[a] / yLen - _yAxis._bottomNumber) / (maxYAxis - _yAxis._bottomNumber) * _yAxis.yGraphsHeight
                };
                //均值
                this.dataFrame.yAxis.center = center;

                return {
                    data: tmpData
                };
            },
            _getTargetField: function(b, v, i, field) {
                if (!field) {
                    field = this._yAxis.field;
                };
                if (_.isString(field)) {
                    return field;
                } else if (_.isArray(field)) {
                    var res = field[b];
                    if (_.isString(res)) {
                        return res;
                    } else if (_.isArray(res)) {
                        return res[v];
                    };
                }
            },
            _drawEnd: function() {
                var me = this
                this.stageBg.addChild(this._back.sprite)

                this.core.addChild(this._xAxis.sprite);
                this.core.addChild(this._graphs.sprite);
                this.core.addChild(this._yAxis.sprite);

                this.stageTip.addChild(this._tip.sprite);

                //执行生长动画
                this._graphs.grow(function(g) {
                    if (me._opts.markLine) {
                        me._initMarkLine(g);
                    };
                    if (me._opts.markPoint) {
                        me._initMarkPoint(g);
                    };
                });

                this.bindEvent();
            },
            _initDataZoom: function() {
                var me = this;
                //require(["chartx/components/datazoom/index"], function(DataZoom) {
                //初始化datazoom模块

                var dataZoomOpt = _.deepExtend({
                    w: me._xAxis.xGraphsWidth,
                    count: me._data.length - 1,
                    //h : me._xAxis.h,
                    pos: {
                        x: me._xAxis.pos.x,
                        y: me._xAxis.pos.y + me._xAxis.h
                    },
                    dragIng: function(range) {
                        if (parseInt(range.start) == parseInt(me.dataZoom.range.start) && parseInt(range.end) == parseInt(me.dataZoom.range.end)) {
                            return;
                        };
                        if (me.dataZoom.range.end <= me.dataZoom.range.start) {
                            me.dataZoom.range.end = me.dataZoom.range.start + 1;
                        };

                        me.dataZoom.range.start = parseInt(range.start);
                        me.dataZoom.range.end = parseInt(range.end);

                        me.dataFrame = me._initData(me._data, this);
                        me._xAxis.resetData(me.dataFrame.xAxis, {
                            animation: false
                        });

                        me._graphs.average.data = null;
                        me._graphs.w = me._xAxis.xGraphsWidth;
                        me._getaverageData();
                        me._setaverageLayoutData();

                        me._graphs.resetData(me._trimGraphs());
                        me._graphs.grow(function() {
                            //callback
                        }, {
                            delay: 0,
                            easing: "Quadratic.Out",
                            duration: 300
                        });

                        me._removeChecked()
                    },
                    dragEnd: function(range) {
                        me._updateChecked()
                    }
                }, me.dataZoom);

                //me._getCloneBar();

                me._dataZoom = new DataZoom(dataZoomOpt);

                var graphssp = this.__cloneBar.thumbBar._graphs.sprite;
                graphssp.id = graphssp.id + "_datazoomthumbbarbg"
                graphssp.context.x = 0;
                graphssp.context.y = me._dataZoom.h - me._dataZoom.barY;
                graphssp.context.scaleY = me._dataZoom.barH / this.__cloneBar.thumbBar._graphs.h;

                me._dataZoom.dataZoomBg.addChild(graphssp);
                me.core.addChild(me._dataZoom.sprite);

                this.__cloneBar.thumbBar.destroy();
                this.__cloneBar.cloneEl.parentNode.removeChild(this.__cloneBar.cloneEl);
                //});
            },
            _getCloneBar: function() {
                var me = this;
                var cloneEl = me.el.cloneNode();
                cloneEl.innerHTML = "";
                cloneEl.id = me.el.id + "_currclone";
                cloneEl.style.position = "absolute";
                cloneEl.style.width = me.el.offsetWidth + "px";
                cloneEl.style.height = me.el.offsetHeight + "px";
                cloneEl.style.top = "10000px";
                document.body.appendChild(cloneEl);

                var opts = _.deepExtend({}, me._opts);
                _.deepExtend(opts, {
                    graphs: {
                        bar: {
                            fillStyle: me.dataZoom.normalColor || "#ececec"
                        },
                        animation: false,
                        eventEnabled: false,
                        text: {
                            enabled: false
                        },
                        average: {
                            enabled: false
                        }
                    },
                    dataZoom: null,
                    xAxis: {
                        //enabled: false
                    },
                    yAxis: {
                        //enabled: false
                    }
                });

                var thumbBar = new Bar(cloneEl, me._data, opts);
                thumbBar.draw();
                return {
                    thumbBar: thumbBar,
                    cloneEl: cloneEl
                }
            },
            _initMarkLine: function(g) {
                var me = this
                require(['chartx/components/markline/index'], function(MarkLine) {
                    for (var a = 0, al = me._yAxis.dataOrg.length; a < al; a++) {
                        var index = a
                        var center = me.dataFrame.yAxis.center[a].agPosition
                        var strokeStyle = g.sprite.children[0] ? g.sprite.children[0].children[a + 1].context.fillStyle : '#000000'

                        var content = me.dataFrame.yAxis.field[a] + '均值'
                        if (me.markLine.text && me.markLine.text.enabled) {

                            if (_.isFunction(me.markLine.text.format)) {
                                var o = {
                                    iGroup: index,
                                    value: me.dataFrame.yAxis.center[index].agValue
                                }
                                content = me.markLine.text.format(o)
                            }
                        }
                        var o = {
                            w: me._xAxis.xGraphsWidth,
                            h: me._yAxis.yGraphsHeight,
                            origin: {
                                x: me._back.pos.x,
                                y: me._back.pos.y
                            },
                            field: _.isArray(me._yAxis.field[a]) ? me._yAxis.field[a][0] : me._yAxis.field[a],
                            line: {
                                y: center,
                                list: [
                                    [0, 0],
                                    [me._xAxis.xGraphsWidth, 0]
                                ],
                                strokeStyle: strokeStyle
                            },
                            text: {
                                content: content,
                                fillStyle: strokeStyle
                            },
                        }

                        new MarkLine(_.deepExtend(o, me._opts.markLine)).done(function() {
                            me.core.addChild(this.sprite)
                        })
                    }
                })
            },
            _initMarkPoint: function(g) {
                var me = this;
                var gOrigin = {
                    x: g.sprite.context.x,
                    y: g.sprite.context.y
                };

                require(["chartx/components/markpoint/index"], function(MarkPoint) {
                    _.each(g.data, function(group, i) {
                        var vLen = group.length;

                        _.each(group, function(hgroup) {
                            _.each(hgroup, function(bar) {
                                var barObj = _.clone(bar);
                                barObj.x += gOrigin.x;
                                barObj.y += gOrigin.y;
                                var mpCtx = {
                                    value: barObj.value,
                                    shapeType: "droplet",
                                    markTarget: barObj.field,
                                    //注意，这里视觉上面的分组和数据上面的分组不一样，所以inode 和 igroup 给出去的时候要反过来
                                    iGroup: barObj.iNode,
                                    iNode: barObj.iGroup,
                                    iLay: barObj.iLay,
                                    point: {
                                        x: barObj.x,
                                        y: barObj.y
                                    }
                                };
                                new MarkPoint(me._opts, mpCtx).done(function() {
                                    me.core.addChild(this.sprite);
                                    var mp = this;
                                    this.shape.hover(function(e) {
                                        this.context.hr++;
                                        this.context.cursor = "pointer";
                                        e.stopPropagation();
                                    }, function(e) {
                                        this.context.hr--;
                                        e.stopPropagation();
                                    });
                                    this.shape.on("mousemove", function(e) {
                                        e.stopPropagation();
                                    });
                                    this.shape.on("tap click", function(e) {
                                        e.stopPropagation();
                                        e.eventInfo = mp;
                                        me.fire("markpointclick", e);
                                    });
                                });
                            });
                        });
                    });
                });
            },

            _removeChecked: function() {
                this._graphs.removeAllChecked()
            },
            _updateChecked: function() {
                var me = this
                me._currCheckedList = me._getCurrCheckedList()
                for (var a = 0, al = me._currCheckedList.length; a < al; a++) {
                    var o = me._currCheckedList[a]
                    me._checkedBar({
                        iGroup: o.iGroup - me.dataZoom.range.start,
                        checked: true,
                    })
                }
            },

            _getCurrCheckedList: function() {
                var me = this
                return _.filter(me._checkedList, function(o) {
                    if (o) {
                        if (o.iGroup >= me.dataZoom.range.start && o.iGroup <= me.dataZoom.range.end) {
                            return o
                        }
                    }
                })
            },
            _checked: function(eventInfo) { //当点击graphs时 触发选中状态
                var me = this
                if (!me._graphs.checked.enabled) {
                    return
                }
                var i = eventInfo.iGroup + me.dataZoom.range.start

                var checked = true
                if (me._checkedList[i]) { //如果已经选中
                    me._checkedList[i] = null
                    checked = false
                } else { //如果没选中                           
                    me._checkedList[i] = eventInfo
                }
                me._checkedBar({
                    iGroup: eventInfo.iGroup,
                    checked: checked
                })
                me._checkedMiniBar({
                    iGroup: i,
                    checked: checked
                })

                eventInfo.iGroup = i
            },
            _checkedBar: function($o) { //选择bar
                var me = this
                var graphs = me._graphs
                graphs._checked($o)
            },
            _checkedMiniBar: function($o) { //选择缩略的bar
                var me = this
                var graphs = me.__cloneBar.thumbBar._graphs
                var fillStyle = ''
                if ($o.checked) {
                    fillStyle = (me._opts.dataZoom.checked && me._opts.dataZoom.checked.fillStyle) || fillStyle
                }
                graphs.setBarStyle({
                    iGroup: $o.iGroup,
                    fillStyle: fillStyle
                })
            },

            bindEvent: function() {
                var me = this;
                this._graphs.sprite.on("panstart mouseover", function(e) {
                    me._setXaxisYaxisToTipsInfo(e);
                    me._tip.show(e);
                    me.fire(e.type, e);
                });
                this._graphs.sprite.on("panmove mousemove", function(e) {
                    me._setXaxisYaxisToTipsInfo(e);
                    me._tip.move(e);
                    me.fire(e.type, e);
                });
                this._graphs.sprite.on("panend mouseout", function(e) {
                    me._tip.hide(e);
                    me.fire(e.type, e);
                });
                this._graphs.sprite.on("tap click mousedown mouseup", function(e) {
                    if (e.type == 'click') {
                        me.fire('checkedBefor');
                        me._checked(_.clone(e.eventInfo));
                    }
                    me._setXaxisYaxisToTipsInfo(e);
                    me.fire(e.type, e);
                });
            }
        });
        return Bar;
    }
);