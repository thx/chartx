define(
    'chartx/chart/pie/index', [
        'chartx/chart/index',
        'chartx/chart/pie/pie'
    ],
    function(Chart, Pie) {
        /*
         *@node chart在dom里的目标容器节点。
         */
        var Canvax = Chart.Canvax;

        return Chart.extend({
            init: function(node, data, opts) {
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
                _.deepExtend(this, opts);
                this.dataFrame = this._initData(data, this);
            },
            draw: function() {
                //console.log("pie draw");
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
            getByIndex: function(index) {
                return this._pie._getByIndex(index);
            },
            getLabelList: function() {
                return this._pie.getLabelList();
            },
            getList: function() {
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
                                checked : idata.checked
                            });
                        }
                    }
                };
                return list;
            },
            getCheckedList : function(){
                var cl = [];
                _.each( this.getList() , function( item ){
                    if( item.checked ){
                        cl.push( item );
                    }
                } );
                return cl;
            },
            focusAt: function(index) {
                if (this._pie) {
                    this._pie.focus( index );
                }
            },
            unfocusAt: function(index) {
                if (this._pie) {
                    this._pie.unfocus( index );
                }
            },
            checkAt: function(index) {
                if (this._pie) {
                    this._pie.check( index );
                }
            },
            uncheckAt: function(index) {
                if (this._pie) {
                    this._pie.uncheck( index );
                }
            },
            _initData: function(arr, opt) {
                var data = [];
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
                if (_.isArray(arr)) {
                    for (var i = 0; i < arr.length; i++) {
                        var obj = {};
                        if (_.isArray(arr[i])) {
                            obj.name = arr[i][0];
                            obj.y = parseFloat(arr[i][1]);
                            obj.sliced = false;
                            obj.selected = false;
                        } else if (typeof arr[i] == 'object') {
                            obj.name = arr[i].name;
                            obj.y = parseFloat(arr[i].y);
                            obj.sliced = arr[i].sliced || false;
                            obj.selected = arr[i].selected || false;
                        }

                        if (obj.name) dataFrame.data.push(obj);
                    }
                }
                if (data.length > 0 && opt.sort == 'asc' || opt.sort == 'desc') {
                    dataFrame.org.sort(function(a, b) {
                        if (opt.sort == 'desc') {
                            return a[1] - b[1];
                        } else if (opt.sort == 'asc') {
                            return b[1] - a[1];
                        }
                    });
                    dataFrame.data.sort(function(a, b) {
                        if (opt.sort == 'desc') {
                            return a.y - b.y;
                        } else if (opt.sort == 'asc') {
                            return b.y - a.y;
                        }
                    });
                }

                return dataFrame;

            },
            clear: function() {
                this.stageBg.removeAllChildren()
                this.core.removeAllChildren()
                this.stageTip.removeAllChildren();
            },
            reset: function(data, opt) {
                this.clear()
                this.width = parseInt(this.element.width());
                this.height = parseInt(this.element.height());
                this.draw(data, opt)
            },
            _initModule: function() {
                var self = this;
                var w = self.width;
                var h = self.height;

                var r = Math.min(w, h) * 2 / 3 / 2;
                if (self.dataLabel && self.dataLabel.enabled == false) {
                    r = Math.min(w, h) / 2;
                    //要预留clickMoveDis位置来hover sector 的时候外扩
                    r -= r / 11;
                }

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
                    //dataLabel: self.dataLabel, 
                    animation: self.animation,
                    startAngle: parseInt(self.startAngle),
                    colors: self.colors,
                    focusCallback: {
                        focus: function(e, index) {
                            self.fire('focus', e);
                        },
                        unfocus: function(e, index) {
                            self.fire('unfocus', e);
                        }
                    }
                };

                if (self.dataLabel) {
                    self.pie.dataLabel = self.dataLabel;
                };

                self._pie = new Pie(self.pie, self.tips, self.canvax.getDomContainer());

                self._pie.sprite.on("mousedown mousemove mouseup click" , function(e){
                    
                    self.fire( e.type , e );
                });
            },
            _startDraw: function() {
                this._pie.draw(this);
            },
            _drawEnd: function() {
                this.core.addChild(this._pie.sprite);
                if (this._tip) this.stageTip.addChild(this._tip.sprite);
                this.fire('complete', {
                    data: this.getList()
                });
            }
        });
    });