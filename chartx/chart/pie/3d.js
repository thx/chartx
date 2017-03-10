define(
    'chartx/chart/pie/3d', [
        'chartx/chart/index',
        'chartx/chart/pie/3d/pie',
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
                this.config = {
                    mode: 1,
                    event: {
                        enabled: 1
                    }
                };
                this.xAxis = {
                    field: null
                };
                this.yAxis = {
                    field: null
                };
                this.rotation = {
                    x: 45,
                    y: 0
                };

                this.thickness = 26.25;


                _.deepExtend(this, opts);
                this.dataFrame = this._initData(data, this);

            },
            draw: function () {
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
                this.stage.addChild(this.core);

                this._initModule(); //初始化模块
                this._startDraw(); //开始绘图
                this._drawEnd(); //绘制结束，添加到舞台  
                this.inited = true;
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
                    }
                    if (this.yAxis.field) {
                        yFieldInd = _.indexOf(titles, this.yAxis.field);
                    }
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

                var r0 = parseInt(self.innerRadius || 0);
                var maxInnerRadius = r * 2 / 3;
                r0 = r0 >= 0 ? r0 : 0;
                r0 = r0 <= maxInnerRadius ? r0 : maxInnerRadius;
                var pieX = w / 2 + this.padding.left;
                var pieY = h / 2 + this.padding.top;
                self.pie = {
                    x: pieX,
                    y: pieY,
                    r0: r0,
                    r: r,
                    rotation: self.rotation,
                    thickness: self.thickness,
                    boundWidth: w,
                    boundHeight: h,
                    data: self.dataFrame,
                    //dataLabel: self.dataLabel, 
                    animation: self.animation,
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

                self._pie.sprite.on("mousedown mousemove mouseup click dblclick", function (e) {
                    self.fire(e.type, e);
                });
            },
            _startDraw: function () {
                this._pie.draw(this);
            },
            _drawEnd: function () {
                this.core.addChild(this._pie.sprite);
            }


        });
    });