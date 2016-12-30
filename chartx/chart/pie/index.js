define(
    'chartx/chart/pie/index', [
        'chartx/chart/index',
        'chartx/chart/pie/pie',
        'chartx/components/legend/index'
    ],
    function (Chart, Pie, Legend) {
        /*
        *@node chart在dom里的目标容器节点。
        */
        var Canvax = Chart.Canvax;

        return Chart.extend({
            // element : null,
            // opts    : null,
            init: function (node, data, opts) {
                // this.element = node;
                this.data = data;
                this.ignoreFields = [];
                this._opts = opts;
                this.options = opts;
                this.event = {
                    enabled : true
                }
                this.xAxis = {
                    field: null
                };
                this.yAxis = {
                    field: null
                };
                _.deepExtend(this, opts);

                this.dataFrame = this._initData(data, this);
                this._setLengend();

                this.stageBg = new Canvax.Display.Sprite({
                    id: 'bg'
                });
                this.core = new Canvax.Display.Sprite({
                    id: 'core'
                });
                this.stageTip = new Canvax.Display.Stage({
                    id: 'stageTip'
                });
                this.canvax.addChild(this.stageTip);
                this.stageTip.toFront();
                
            },
            draw: function () {
                this._initModule(); //初始化模块
                this._startDraw(); //开始绘图
                this._drawEnd(); //绘制结束，添加到舞台  
                this.inited = true;
            },
            getByIndex: function (index) {
                return this._pie._getByIndex(index);
            },
            getLabelList: function () {
                return this._pie.getLabelList();
            },
            getList: function () {
                var self = this;
                var list = [];
                var item;
                if (self._pie) {
                    var sectorList = self._pie.getList();
                    if (sectorList.length > 0) {
                        for (var i = 0; i < sectorList.length; i++) {
                            item = sectorList[i];
                            var idata = self._pie.data.data[i];

                            list.push({
                                name: item.name,
                                index: item.index,
                                color: item.color,
                                r: item.r,
                                value: item.value,
                                percentage: item.percentage,
                                checked: idata.checked
                            });
                        }
                    }
                };
                return list;
            },
            getCheckedList: function () {
                var cl = [];
                _.each(this.getList(), function (item) {
                    if (item.checked) {
                        cl.push(item);
                    }
                });
                return cl;
            },
            focusAt: function (index) {
                if (this._pie) {
                    this._pie.focus(index);
                }
            },
            unfocusAt: function (index) {
                if (this._pie) {
                    this._pie.unfocus(index);
                }
            },
            checkAt: function (index) {
                if (this._pie) {
                    this._pie.check(index);
                }
            },
            uncheckAt: function (index) {
                if (this._pie) {
                    this._pie.uncheck(index);
                }
            },
            uncheckAll: function () {
                if (this._pie) {
                    this._pie.uncheckAll();
                }
            },
            checkOf: function (xvalue) {
                this.checkAt(this._getIndexOfxName(xvalue));
            },
            uncheckOf: function (xvalue) {
                this.uncheckAt(this._getIndexOfxName(xvalue));
            },
            _getIndexOfxName: function (xvalue) {
                var i;
                var list = this.getList();
                for (var ii = 0, il = list.length; ii < il; ii++) {
                    if (list[ii].name == xvalue) {
                        i = ii;
                        break;
                    }
                }
                return i;
            },
            _initData: function(arr, opt) {
                var data = [];
                var arr = _.clone(arr);
            
                /*
                * @释剑
                * 用校正处理， 把pie的data入参规范和chartx数据格式一致
                **/
                if (!this.xAxis.field) {
                    data = arr;
                } else {

                    var titles = arr.shift();
                    var xFieldInd = _.indexOf(titles, this.xAxis.field);
                    var yFieldInd = xFieldInd + 1;
                    if (yFieldInd >= titles.length) {
                        yFieldInd = 0;
                    };
                    if (this.yAxis.field) {
                        yFieldInd = _.indexOf(titles, this.yAxis.field);
                    };
                    _.each(arr, function(row) {
                        var rowData = [];
                        if (_.isArray(row)) {
                            rowData.push(row[xFieldInd]);
                            rowData.push(row[yFieldInd]);
                        } else if (typeof row == 'object') {
                            rowData.push(row['name']);
                            rowData.push(row['y']);
                        }
                        data.push(rowData);
                    });
                };

                //矫正结束                    
                var dataFrame = {};
                dataFrame.org = data;
                dataFrame.data = [];
                if (_.isArray(data)) {
                    for (var i = 0; i < data.length; i++) {
                        var obj = {};
                        if (_.isArray(data[i])) {

                            obj.name = data[i][0];
                            obj.y = parseFloat(data[i][1]);
                            obj.sliced = false;
                            obj.selected = false;

                        } else if (typeof data[i] == 'object') {

                            obj.name = data[i].name;
                            obj.y = parseFloat(data[i].y);
                            obj.sliced = data[i].sliced || false;
                            obj.selected = data[i].selected || false;

                        }

                        if (obj.name) dataFrame.data.push(obj);
                    }
                }
                if (data.length > 0 && opt.sort == 'asc' || opt.sort == 'desc') {
                    dataFrame.org.sort(function (a, b) {
                        if (opt.sort == 'desc') {
                            return a[1] - b[1];
                        } else if (opt.sort == 'asc') {
                            return b[1] - a[1];
                        }
                    });
                    dataFrame.data.sort(function (a, b) {
                        if (opt.sort == 'desc') {
                            return a.y - b.y;
                        } else if (opt.sort == 'asc') {
                            return b.y - a.y;
                        }
                    });
                }

                if (dataFrame.data.length > 0) {
                    for (i = 0; i < dataFrame.data.length; i++) {
                        if (_.contains(this.ignoreFields, dataFrame.data[i].name)) {
                            dataFrame.data[i].ignored = true;
                            dataFrame.data[i].y = 0;
                        }
                    }


                }

                return dataFrame;

            },
            clear: function () {
                this.stageBg.removeAllChildren()
                this.core.removeAllChildren()
                this.stageTip.removeAllChildren();
            },
            reset: function (obj) {
                obj = obj || {};
                this.clear();
                this._pie.clear();
                var data = obj.data || this.data;
                _.deepExtend(this, obj.options);
                this.dataFrame = this._initData(data, this.options);
                this.draw();
            },
            _initModule: function () {
                var self = this;
                var w = self.width;
                var h = self.height;
                w -= (this.padding.left + this.padding.right);
                h -= (this.padding.top + this.padding.bottom);

                var r = Math.min(w, h) * 2 / 3 / 2;
                if (self.dataLabel && self.dataLabel.enabled == false) {
                    r = Math.min(w, h) / 2;
                    //要预留clickMoveDis位置来hover sector 的时候外扩
                    r -= r / 11;
                };
                r = parseInt( r );

                //某些情况下容器没有高宽等，导致r计算为负数，会报错
                if( r < 0 ){
                    r = 1;
                };

                var r0 = parseInt(self.innerRadius || 0);
                var maxInnerRadius = r - 20;
                r0 = r0 >= 0 ? r0 : 0;
                r0 = r0 <= maxInnerRadius ? r0 : maxInnerRadius;
                if( r0 < 0 ){
                    r0 = 0;
                };

                var pieX = w / 2 + this.padding.left;
                var pieY = h / 2 + this.padding.top;
                self.pie = {
                    x: pieX,
                    y: pieY,
                    r0: r0,
                    r: r,
                    boundWidth: w,
                    boundHeight: h,
                    data: self.dataFrame,
                    //dataLabel: self.dataLabel, 
                    animation: self.animation,
                    event: self.event,
                    startAngle: parseInt(self.startAngle),
                    colors: self.colors,
                    focusCallback: {
                        focus: function (e, index) {
                            self.fire('focus', e);
                        },
                        unfocus: function (e, index) {
                            self.fire('unfocus', e);
                        }
                    },
                    checked: (self.checked ? self.checked : { enabled: false })
                };

                if (self.dataLabel) {
                    self.pie.dataLabel = self.dataLabel;
                };

                self._pie = new Pie(self.pie, self.tips, self.canvax.getDomContainer());

                self.event.enabled && self._pie.sprite.on("mousedown mousemove mouseup click dblclick", function (e) {
                    self.fire(e.type, e);
                });
            },
            _startDraw: function () {
                this._pie.draw(this);
                var me = this;                
                //如果有legend，调整下位置,和设置下颜色
                if (this._legend && !this._legend.inited) {
                    _.each(this.getList(), function (item, i) {
                        var ffill = item.color;
                        me._legend.setStyle(item.name, { fillStyle: ffill });
                    });
                    this._legend.inited = true;
                };
            },
            _drawEnd: function () {
                this.core.addChild(this._pie.sprite);
                if (this._tip) this.stageTip.addChild(this._tip.sprite);
                this.fire('complete', {
                    data: this.getList()
                });
                this.stage.addChild(this.core);
            },
            remove: function (field) {
                var me = this;
                var data = me.data;
                if (field && data.length > 1) {
                    for (var i = 1; i < data.length; i++) {
                        if (data[i][0] == field && !_.contains(me.ignoreFields, field)) {
                            me.ignoreFields.push(field);
                            //console.log(me.ignoreFields.toString());
                        }
                    }
                }
                me.reset();
            },
            add: function (field) {
                var me = this;
                var data = me.data;
                if (field && data.length > 1) {
                    for (var i = 1; i < data.length; i++) {
                        if (data[i][0] == field && _.contains(me.ignoreFields, field)) {
                            me.ignoreFields.splice(_.indexOf(me.ignoreFields, field), 1);
                        }
                    }
                }
                me.reset();
            },
            //设置图例 begin
            _setLengend: function () {
                var me = this;
                if ( !this.legend || (this.legend && "enabled" in this.legend && !this.legend.enabled) ) return;
                //设置legendOpt
                var legendOpt = _.deepExtend({
                    legend:true,
                    label: function (info) {
                        return info.field
                    },
                    onChecked: function (field) {
                        me.add(field);
                    },
                    onUnChecked: function (field) {
                        me.remove(field);
                    },
                    layoutType: "v"
                }, this._opts.legend);
                this._legend = new Legend(this._getLegendData(), legendOpt);
                this.stage.addChild(this._legend.sprite);
                this._legend.pos({
                    x: this.width - this._legend.width,
                    y: this.height / 2 - this._legend.h / 2
                });

                this.padding.right += this._legend.width;
            },
            _getLegendData: function () {
                var me = this;
                var data = [];                
                _.each(this.dataFrame.data, function (obj, i) {
                    data.push({
                        field: obj.name,
                        value: obj.y,
                        fillStyle: null
                    });
                });

                return data;
            }
            ////设置图例end
        });
    });