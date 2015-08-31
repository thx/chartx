define(
        'chartx/chart/pie/index',
        [
        'chartx/chart/index',
        'chartx/chart/pie/pie'
        ],
        function (Chart, Pie) {
            /*
            *@node chart在dom里的目标容器节点。
            */
            var Canvax = Chart.Canvax;

            return Chart.extend({
                init: function (node, data, opts) {
                    this.config = {
                        mode: 1,
                        event: {
                            enabled: 1
                        }
                    };
                    this.xAxis = {
                        field  : null
                    };
                    this.yAxis = {
                        field  : null
                    };
                    _.deepExtend(this, opts);
                    this.dataFrame = this._initData(data, this);
                },
                draw: function () {
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

                    this._initModule();                      //初始化模块
                    this._startDraw();                         //开始绘图
                    this._drawEnd();                           //绘制结束，添加到舞台      
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
                                    value: item.value,
                                    percentage: item.percentage
                                });
                            }
                        }
                    }
                    return list;
                },
                //show: function (index) {
                //    this._pie && this._pie.showHideSector(index);
                //},
                focusAt : function(index){
                    if(this._pie){
                        this._pie._sectorFocus( null , index);
                        var sector = this.getByIndex(index).sector; 
                        if( !sector.__isSelected ){
                            this._pie.moveSector( sector );
                        }
                    }
                },
                blurAt  : function(index){
                    if(this._pie){
                        this._pie._sectorUnfocus( null , index);
                        var sector = this.getByIndex(index).sector;
                        if( sector.__isSelected ){
                            this._pie.moveSector( sector );
                        }
                    }
                },
                slice: function (index) {
                    this._pie && this._pie.slice(index);
                },
                _initData: function (arr, opt) {
                    var data = [];

                    /*
                     * 用校正处理， 把pie的data入参规范和chartx数据格式一致
                     **/
                    if( !this.xAxis.field ){
                        data = arr;
                    } else {
                        
                        var titles  = arr.shift();
                        var xFieldInd = _.indexOf(titles , this.xAxis.field );
                        var yFieldInd = xFieldInd++;
                        if( yFieldInd >= titles.length ){
                            yFieldInd = 0;
                        };
                        if( this.yAxis.field ){
                            yFieldInd = _.indexOf(titles , this.yAxis.field );
                        };
                        _.each( arr , function( row ){
                            var rowData = [];
                            rowData.push( row[xFieldInd] );
                            rowData.push( row[yFieldInd] );
                            data.push( rowData );
                        } );
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
                    if (!self.dataLabel.enabled) {
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
                        allowPointSelect: self.allowPointSelect || true,
                        animation: self.animation,
                        colors: self.colors,
                        focusCallback: {
                            focus: function (e , index) {
                                e.sectorIndex = index;
                                self.fire('focused' , e);
                            },
                            unfocus: function (e , index) {
                                e.sectorIndex = index;
                                self.fire('unfocused' , e);
                            }
                        },
                        clickCallback : function( e , index ){
                            e.sectorIndex = index;
                            self.fire("click" , e);
                        }
                    };

                    if (self.dataLabel) {
                        self.pie.dataLabel = self.dataLabel;
                    }

                    self._pie = new Pie(self.pie, self.tips, self.canvax.getDomContainer());
                },
                _startDraw: function () {
                    this._pie.draw(this);
                },
                _drawEnd: function () {
                    this.core.addChild(this._pie.sprite);
                    if (this._tip) this.stageTip.addChild(this._tip.sprite);
                    this.fire('complete', { data: this.getList() });
                }
            });
        });

