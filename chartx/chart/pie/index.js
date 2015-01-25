define(
        'chartx/chart/pie/index',
        [
        'chartx/chart/index',
        'chartx/chart/pie/pie'
        ],
        function (Chart, Pie ) {
            /*
             *@node chart在dom里的目标容器节点。
             */
            var Canvax = Chart.Canvax;

            return Chart.extend({
                init: function (node , data , opts) {
                    this.config = {
                        mode: 1,
                        event: {
                            enabled: 1
                        }
                    };
                    _.deepExtend( this , opts );
                    this.dataFrame = this._initData( data , this );

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
                    //this.stage.addChild(this.stageBg);
                    this.stage.addChild(this.core);

                    this._initModule();                      //初始化模块
                    this._startDraw();                         //开始绘图
                    this._drawEnd();                           //绘制结束，添加到舞台      

                    this._arguments = arguments;

                },
                getByIndex: function (index) {
                    return this._pie._getByIndex(index);
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
                                list.push({
                                    name: item.name,
                                    index: item.index,
                                    color: item.color,
                                    r: item.r,
                                    percentage: item.percentage
                                });
                            }
                        }
                    }
                    return list;
                },
                show: function (index) {
                    this._pie && this._pie.showHideSector(index);
                },
                slice: function (index) {
                    this._pie && this._pie.slice(index);
                },
                _initData: function (data, opt) {
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
                            }
                            else if (typeof data[i] == 'object') {
                                obj.name = data[i].name;
                                obj.y = parseFloat(data[i].y);
                                obj.sliced = data[i].sliced || false;
                                obj.selected = data[i].selected || false;
                            }

                            if (obj.name) dataFrame.data.push(obj);
                        }
                    }
                    return dataFrame;
                },
                clear: function () {
                    this.stageBg.removeAllChildren()
                        this.core.removeAllChildren()
                        this.stageTip.removeAllChildren();
                },
                reset: function (data, opt) {
                    this.clear()
                        this.width = parseInt(this.element.width());
                    this.height = parseInt(this.element.height());
                    this.draw(data, opt)
                },
                _initModule: function () {
                    var self = this;
                    var w = self.width;
                    var h = self.height;
                    var r = Math.min(w, h) * 2 / 3 / 2;
                    var r0 = parseInt(self.innerRadius || 0);
                    var maxInnerRadius = r * 2 / 3;
                    r0 = r0 >= 0 ? r0 : 0;
                    r0 = r0 <= maxInnerRadius ? r0 : maxInnerRadius;
                    var pieX = w / 2;
                    var pieY = h / 2;
                    self.pie = {
                        x: pieX,
                        y: pieY,
                        r0: r0,
                        r: r,
                        boundWidth: w,
                        boundHeight: h,
                        data: self.dataFrame,
                        dataLabel: self.dataLabel,
                        strokeWidth: self.strokeWidth,
                        allowPointSelect: self.allowPointSelect,
                        animation: self.animation,
                        colors:self.colors,
                        focusCallback: {
                            focus: function (index) {
                                self.fire('focused');
                            },
                            unfocus: function () {
                                self.fire('unfocused');
                            }
                        }
                    };

                    self._pie = new Pie(self.pie , self.tips , self.canvax.getDomContainer());
                },
                _startDraw: function () {
                    this._pie.draw(this);
                },
                _drawEnd: function () {
                    this.core.addChild(this._pie.sprite);
                    if (this._tip) this.stageTip.addChild(this._tip.sprite);
                    this.fire('complete');
                }
            });
        });
