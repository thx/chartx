define("chartx/chart/bar/3d",
    [
        'chartx/chart/index',
        'chartx/utils/tools',
        'chartx/utils/datasection',
        'chartx/components/tips/tip',
        'chartx/utils/dataformat',
        'chartx/components/datazoom/index',
        'chartx/components/legend/index',
        'chartx/chart/bar/3d/xaxis',
        'chartx/chart/bar/3d/yaxis',
        'chartx/chart/bar/3d/back',
        'chartx/chart/bar/3d/graphs',
        "canvax/shape/Shapes",
        'chartx/utils/math3d/vec3',
        'chartx/utils/math3d/vec4',
        'chartx/utils/math3d/mat4',
        'chartx/utils/math3d/quat',
    ],
    function (Chart, Tools, DataSection, Tip, dataFormat, DataZoom, Legend, xAxis, yAxis, Back, Graphs, Shapes, Vector3, Vector4,Matrix,Quaternion) {


        var Canvax = Chart.Canvax;
        var Bar3d = Chart.extend({
            init: function (node, data, opts) {

                this._xAxis = null;
                this._yAxis = null;
                this._back = null;
                this._graphs = null;
                this._tip = null;
                this._checkedList = []; //所有的选择对象
                this._currCheckedList = []; //当前的选择对象(根据dataZoom.start, dataZoom.end 过滤)

                this._node = node;
                this._data = data;
                this._opts = opts;

                this.dataZoom = {
                    enabled: false,
                    range: {
                        start: 0,
                        end: data.length - 1 //因为第一行是title
                    }
                };
                if (opts.dataZoom) {
                    this.dataZoom.enabled = true;
                    this.padding.bottom += (opts.dataZoom.height || 46);
                }


                if (opts.proportion) {
                    this.proportion = opts.proportion;
                    this._initProportion(node, data, opts);
                } else {
                    _.deepExtend(this, opts);
                }


                this.dataFrame = this._initData(data);

                this._setLegend();

                //吧原始的field转换为对应结构的显示树
                //["uv"] --> [{field:'uv',enabled:true , fillStyle: }]
                this._fieldsDisplayMap = this.__setFieldsDisplay(this._opts.yAxis.field || this._opts.yAxis.bar.field);

                //一些继承自该类的constructor 会拥有_init来做一些覆盖，比如横向柱状图
                this._init && this._init(node, data, opts);


                //3d场景初始化
                this._projectMatrix = Matrix.create();
                this._viewMatrix = Matrix.create();
                this._viewProjectMatrix = Matrix.create();


                //初始化投影矩阵
                this._initProjection();

                //初始化相机
                this._eye = Vector3.fromValues(0, 0, this.height * 2);
                this._rotation = {
                    x: 25,
                    y: 25
                };
                _.extend(this._rotation, this._opts.rotation);
                this._rotationCamera();
                //调整相机位置
                this._adjustmentFitPosition();



            },
            _reset: function (obj) {
                //初始化投影矩阵
                this._initProjection();
                //初始化相机
                this._eye = Vector3.fromValues(0, 0, this.height);
                this._rotation = {
                    x: 25,
                    y: 25
                };
                _.extend(this._rotation, obj.options.rotation);
                this._rotationCamera();
                //调整相机位置
                this._adjustmentFitPosition();
            },
            _initProjection:function(){
                //透视矩阵
                var fovy = 45 * Math.PI / 180;
                var aspect = this.width / this.height;
                var near = 0.1;
                var far = 1000;
                Matrix.perspective(this._projectMatrix, fovy, aspect, near, far);

            },

            _initCamera: function () {
                var me = this;
                var center = [0, 0, 0];
                var up = [0, 1, 0];
                var eye = this._eye;
                Matrix.lookAt(this._viewMatrix, eye, center, up);
                Matrix.multiply(this._viewProjectMatrix, this._projectMatrix, this._viewMatrix);

            },
            _rotationCamera: function () {
                var me = this;
                var rotateX = me._rotation.x;
                var rotateY = me._rotation.y;
                var rotation = Quaternion.create();
                var m = Matrix.create();
                var length=Vector3.length(this._eye);
                var origin = Vector3.fromValues(0, 0, length);

                rotateX = rotateX !== undefined ? Math.max(10, Math.min(rotateX, 45)) : 25;
                rotateY = rotateY !== undefined ? Math.max(10, Math.min(rotateY, 45)) : 25;


                Quaternion.rotateY(rotation, rotation, rotateY * Math.PI / 180);
                Quaternion.rotateX(rotation, rotation, -1 * rotateX * Math.PI / 180);

                Matrix.fromQuat(m, rotation);
                Vector3.transformMat4(me._eye, origin, m);
                me._initCamera();

            },
            _adjustmentFitPosition: function () { //调整相机到最合适的位置
                var me = this;

                //构建世界空间特殊点
                var _widht = me.width * 0.5;
                var _heght = me.height * 0.5;
                var _depth = me.back && me.back.depth || 100;
                var _point = [];
                var _screenPoints = [];
                var isFineTuning = false;   //是否微调
                var _scale = Vector3.create();
                var padding = 5;


                for (i = 0, t = 0; i < 24; i = i + 3) {
                    _point[i] = i % 2 === 0 ? -1 * _widht : _widht;
                    _point[i + 1] = _.indexOf([2, 3, 6, 7], t) === -1 ? _heght : -1 * _heght;
                    _point[i + 2] = t < 4 ? 0 : -1 * _depth
                    t++;
                }

                while (true) {
                    me._initCamera();
                    _screenPoints = me._worldToScreen(_point);

                    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
                    for (i = 0; i < _screenPoints.length; i = i + 3) {
                        minX = Math.min(minX, _screenPoints[i]);
                        maxX = Math.max(maxX, _screenPoints[i]);

                        minY = Math.min(minY, _screenPoints[i + 1]);
                        maxY = Math.max(maxY, _screenPoints[i + 1]);
                    }
                    if (minX < padding || minY < padding || maxX > me.width - padding || maxY > me.height - padding) {
                        if (isFineTuning) {
                            isFineTuning = false;

                            Vector3.scale(me._eye, me._eye, 9 / 10);
                            //Vector3.normalize(_scale,me._eye);
                            //Vector3.add(me._eye, me._eye, _scale);
                            me._initCamera();
                            break;
                        }
                        Vector3.scale(_scale, me._eye, 0.5);
                        Vector3.add(me._eye, me._eye, _scale);

                    } else {

                        isFineTuning = true;
                        //Vector3.normalize(_scale,me._eye);
                        Vector3.scale(_scale, me._eye, 0.1);
                        Vector3.sub(me._eye, me._eye, _scale);

                    }

                }

            },

            /*
             * 如果只有数据改动的情况
             */
            resetData: function (data) {
                this._data = data;

                this.dataFrame = this._initData(data, this);
                this._xAxis.resetData(this.dataFrame.xAxis, {
                    animation: false
                });

                if (this.dataZoom.enabled) {
                    this.__cloneBar = this._getCloneBar();
                    this._yAxis.resetData(this.__cloneBar.thumbBar.dataFrame.yAxis, {
                        animation: false
                    });
                    this._dataZoom.sprite.destroy();
                    this._initDataZoom();
                } else {
                    this._yAxis.resetData(this.dataFrame.yAxis, {
                        animation: false
                    });
                }
                ;
                this._graphs.resetData(this._trimGraphs());
                this._graphs.grow(function () {
                    //callback
                }, {
                    delay: 0
                });
                this.fire("_resetData");
            },
            getCheckedCurrList: function () {
                var me = this
                return _.filter(me._getCurrCheckedList(), function (o) {
                    return o
                })
            },
            getCheckedList: function () { //获取选择之后的对象列表 列表中不含空对象 [eventInfo,evnetInfo,....]
                var me = this
                return _.filter(me._checkedList, function (o) {
                    return o
                })
            },
            //和原始field结构保持一致，但是对应的field换成 {field: , enabled:}结构
            __setFieldsDisplay: function (fields) {
                var clone_fields = _.clone(fields);
                for (var i = 0, l = fields.length; i < l; i++) {
                    if (_.isString(fields[i])) {
                        clone_fields[i] = {
                            field: fields[i],
                            enabled: true
                        }
                    }
                    if (_.isArray(fields[i])) {
                        clone_fields[i] = this.__setFieldsDisplay(fields[i]);
                    }
                }
                ;
                return clone_fields;
            },
            _getFieldsOfDisplay: function (maps) {
                var fields = [];
                !maps && ( maps = this._fieldsDisplayMap );
                for (var i = 0, l = maps.length; i < l; i++) {
                    if (_.isArray(maps[i])) {
                        var _fs = this._getFieldsOfDisplay(maps[i]);
                        _fs.length > 0 && (fields[i] = _fs);
                    } else if (maps[i].field && maps[i].enabled) {
                        fields[i] = maps[i].field;
                    }
                    ;
                }
                ;
                return fields;
            },
            //设置_fieldsDisplayMap中对应field 的 enabled状态
            _setFieldDisplay: function (field) {
                var me = this;

                function set(maps) {
                    _.each(maps, function (map, i) {
                        if (_.isArray(map)) {
                            set(map)
                        } else if (map.field && map.field == field) {
                            map.enabled = !map.enabled;
                        }
                    });
                }

                set(me._fieldsDisplayMap);
            },
            //TODO：bar中用来改变yAxis.field的临时 方案
            _resetOfLengend: function (field) {
                var me = this;

                me._setFieldDisplay(field);

                _.deepExtend(this, {
                    yAxis: {
                        field: me._getFieldsOfDisplay()
                    }
                });

                if (this.graphs && this.graphs.bar && _.isFunction(this.graphs.bar.fillStyle)) {
                    var _fillStyle = this.graphs.bar.fillStyle;
                    this.graphs.bar.fillStyle = function (f) {
                        var res = _fillStyle(f);
                        if (!res) {
                            if (me._legend) {
                                res = me._legend.getStyle(f.field).fillStyle;
                            }
                        }
                        return res;
                    }
                } else {
                    _.deepExtend(this, {
                        graphs: {
                            bar: {
                                fillStyle: function (f) {

                                    if (me._legend) {
                                        return me._legend.getStyle(f.field).fillStyle;
                                    }
                                }
                            }
                        }
                    });
                }


                for (var i = 0, l = this.canvax.children.length; i < l; i++) {
                    var stage = this.canvax.getChildAt(i);
                    for (var s = 0, sl = stage.children.length; s < sl; s++) {
                        var sp = stage.getChildAt(s);
                        if (sp.id == "LegendSprite" || sp.id == "legend_tip") {
                            continue
                        }
                        stage.getChildAt(s).destroy();
                        s--;
                        sl--;
                    }
                }
                ;

                this.dataFrame = this._initData(this._data);
                this.draw();
            },
            _setLegend: function () {

                var me = this;
                if (!this.legend || (this.legend && "enabled" in this.legend && !this.legend.enabled)) return;
                //设置legendOpt
                var legendOpt = _.deepExtend({
                    enabled: true,
                    label: function (info) {
                        return info.field
                    },
                    onChecked: function (field) {
                        me._resetOfLengend(field);
                    },
                    onUnChecked: function (field) {
                        me._resetOfLengend(field);
                    }
                }, this._opts.legend);

                this._legend = new Legend(this._getLegendData(), legendOpt);
                this._legend.sprite.noTransform = true;
                this.stage.addChild(this._legend.sprite);
                this._legend.pos({
                    x: 0,
                    y: this.padding.top
                });
                this.padding.top += this._legend.height;
            },
            //只有field为多组数据的时候才需要legend
            _getLegendData: function () {
                var me = this;
                var data = [];
                _.each(_.flatten(me.dataFrame.yAxis.field), function (f, i) {
                    data.push({
                        field: f,
                        value: null,
                        fillStyle: null
                    });
                });
                return data;
            },
            checkAt: function (index) {
                var me = this
                var i = index - me.dataZoom.range.start
                var o = me._graphs.getInfo(i)

                me._checkedList[index] = o

                me._checkedBar({
                    iNode: i,
                    checked: true
                });
                me._checkedMiniBar({
                    iNode: index,
                    checked: true
                });

                o.iNode = index
            },
            uncheckAt: function (index) { //取消选择某个对象 index是全局index
                var me = this
                var i = index - me.dataZoom.range.start
                if (me._checkedList[index]) {
                    me._checked(me._graphs.getInfo(i))
                }
                ;
            },
            uncheckAll: function () {
                for (var i = 0, l = this._checkedList.length; i < l; i++) {
                    var obj = this._checkedList[i];
                    if (obj) {
                        this.uncheckAt(i);
                    }
                }
                ;
                this._checkedList = [];
                this._currCheckedList = [];
            },
            checkOf: function (xvalue) {
                this.checkAt(this._xAxis.getIndexOfVal(xvalue) + this.dataZoom.range.start);
            },
            uncheckOf: function (xvalue) {
                this.uncheckAt(this._xAxis.getIndexOfVal(xvalue) + this.dataZoom.range.start);
            },
            getGroupChecked: function (e) {
                var checked = false;
                _.each(this.getCheckedList(), function (obj) {
                    if (obj && obj.iNode == e.eventInfo.iNode) {
                        checked = true;
                    }
                });
                return checked
            },
            //如果为比例柱状图的话
            _initProportion: function (node, data, opts) {
                !opts.tips && (opts.tips = {});
                opts.tips = _.deepExtend(opts.tips, {
                    content: function (info) {
                        var str = "<table>";
                        var self = this;
                        _.each(info.nodesInfoList, function (node, i) {
                            str += "<tr style='color:" + node.fillStyle + "'>";
                            var prefixName = self.prefix[i];
                            if (prefixName) {
                                str += "<td>" + prefixName + "：</td>";
                            } else {
                                if (node.field) {
                                    str += "<td>" + node.field + "：</td>";
                                }
                            }
                            ;
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
                        format: function (n) {
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
            _setStages: function () {
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
            draw: function () {

                this._setStages();

                this._initModule(); //初始化模块

                this._startDraw(); //开始绘图

                this._drawEnd(); //绘制结束，添加到舞台

                this.inited = true;
                this._to3d(this.stage);


            },
            _initData: function (data, opt) {

                var d;
                if (this.dataZoom.enabled) {
                    var datas = [data[0]];
                    datas = datas.concat(data.slice(this.dataZoom.range.start + 1, this.dataZoom.range.end + 1 + 1));
                    d = dataFormat.apply(this, [datas, opt]);
                } else {
                    d = dataFormat.apply(this, arguments);
                }
                ;

                //var d = dataFormat.apply(this, arguments);

                _.each(d.yAxis.field, function (field, i) {
                    if (!_.isArray(field)) {
                        field = [field];
                        d.yAxis.org[i] = [d.yAxis.org[i]];
                    }
                });
                return d;
            },
            _getaverageData: function () {
                var averageData = [];
                var me = this;
                if (this._graphs && this._graphs.average && this._graphs.average.data) {
                    return this._graphs.average.data
                }
                ;
                if (this._graphs.average.enabled) {
                    _.each(this.dataFrame.data, function (fd, i) {
                        if (fd.field == me._graphs.average.field) {
                            averageData = fd.data;
                        }
                    });
                }
                ;
                this._graphs.average.data = averageData;
                return averageData;
            },
            _setaverageLayoutData: function () {
                var layoutData = [];
                var me = this;
                if (this._graphs.average.enabled) {
                    var maxYAxis = this._yAxis.dataSection[this._yAxis.dataSection.length - 1];
                    _.each(this._graphs.average.data, function (fd, i) {
                        layoutData.push({
                            value: fd,
                            y: -(fd - me._yAxis._bottomNumber) / Math.abs(maxYAxis - me._yAxis._bottomNumber) * me._yAxis.yGraphsHeight
                        });
                    });
                    this._graphs.average.layoutData = layoutData;
                }
                ;
            },
            _initModule: function() {
                //因为tips放在graphs中，so 要吧tips的conf传到graphs中
                this._graphs = new Graphs(this);

                this._xAxis = new xAxis(this);

                this._yAxis = new yAxis(this);

                this._back = new Back(this);
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

                if (this.dataZoom.enabled) {
                    this.__cloneBar = this._getCloneBar();
                    this._yAxis.resetData(this.__cloneBar.thumbBar.dataFrame.yAxis, {
                        animation: false
                    });
                    this._yAxis.setX(this._yAxis.pos.x);
                }
                ;

                var _yAxisW = this._yAxis.w;

                //绘制x轴
                this._xAxis.draw({
                    graphh: h - this.padding.bottom,
                    graphw: w - this.padding.right,
                    yAxisW: _yAxisW
                });
                if (this._xAxis.yAxisW != _yAxisW) {
                    //说明在xaxis里面的时候被修改过了。那么要同步到yaxis
                    this._yAxis.resetWidth(this._xAxis.yAxisW);
                    _yAxisW = this._xAxis.yAxisW;
                }

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
                ;

                //如果有legend，调整下位置,和设置下颜色
                if (this._legend && !this._legend.inited) {
                    this._legend.pos({x: _yAxisW});

                    for (var f in this._graphs._yAxisFieldsMap) {
                        var ffill = this._graphs._yAxisFieldsMap[f].fillStyle;
                        this._legend.setStyle(f, {fillStyle: ffill});
                    }
                    ;
                    this._legend.inited = true;
                }



            },

            //把这个点位置对应的x轴数据和y轴数据存到tips的info里面
            //方便外部自定义tip是的content
            _setXaxisYaxisToTipsInfo: function (e) {
                if (!e.eventInfo) {
                    return;
                }
                ;

                e.eventInfo.xAxis = {
                    field: this.dataFrame.xAxis.field,
                    value: this.dataFrame.xAxis.org[0][e.eventInfo.iNode]
                };
                var me = this;

                _.each(e.eventInfo.nodesInfoList, function (node, i) {
                    //把这个group当前是否选中状态记录
                    if (me._checkedList[node.iNode + me.dataZoom.range.start]) {
                        node.checked = true;
                    } else {
                        node.checked = false;
                    }
                    ;
                });

                e.eventInfo.dataZoom = me.dataZoom;

                e.eventInfo.rowData = this.dataFrame.getRowData(e.eventInfo.iNode);

                e.eventInfo.iNode += this.dataZoom.range.start;
            },
            _trimGraphs: function (_xAxis, _yAxis) {

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

                    _.each(yArrList, function (subv, v) {
                        !tmpData[b][v] && (tmpData[b][v] = []);

                        if (me.dataZoom.enabled) {
                            subv = subv.slice(me.dataZoom.range.start, me.dataZoom.range.end + 1);
                        }
                        ;

                        _.each(subv, function (val, i) {

                            if (!xArr[i]) {
                                return;
                            }
                            ;

                            var vCount = 0;
                            if (me.proportion) {
                                //先计算总量
                                _.each(yArrList, function (team, ti) {
                                    vCount += team[i]
                                });
                            }
                            ;

                            var x = xArr[i].x - xDis1 / 2 + xDis2 * (b + 1);

                            var y = 0;
                            if (me.proportion) {
                                y = -val / vCount * _yAxis.yGraphsHeight;
                            } else {
                                y = -(val - _yAxis._bottomNumber) / Math.abs(maxYAxis - _yAxis._bottomNumber) * _yAxis.yGraphsHeight;
                            }
                            ;
                            if (v > 0) {
                                y += tmpData[b][v - 1][i].y;
                            }
                            ;

                            //如果有排序的话
                            if (me._yAxis.sort && me._yAxis.sort == "desc") {
                                y = -(_yAxis.yGraphsHeight - Math.abs(y));
                            }
                            ;

                            var node = {
                                value: val,
                                field: me._getTargetField(b, v, i, _yAxis.field),
                                x: x,
                                y: y
                            };

                            if (me.proportion) {
                                node.vCount = vCount;
                            }
                            ;

                            tmpData[b][v].push(node);


                            yValueMaxs[b] += Number(val)
                            yLen = subv.length
                        });
                    });
                }
                ;

                for (var a = 0, al = yValueMaxs.length; a < al; a++) {
                    center[a].agValue = yValueMaxs[a] / yLen
                    center[a].agPosition = -(yValueMaxs[a] / yLen - _yAxis._bottomNumber) / (maxYAxis - _yAxis._bottomNumber) * _yAxis.yGraphsHeight
                }
                ;
                //均值
                this.dataFrame.yAxis.center = center;

                return {
                    data: tmpData
                };
            },
            _getTargetField: function (b, v, i, field) {
                if (!field) {
                    field = this._yAxis.field;
                }
                ;
                if (_.isString(field)) {
                    return field;
                } else if (_.isArray(field)) {
                    var res = field[b];
                    if (_.isString(res)) {
                        return res;
                    } else if (_.isArray(res)) {
                        return res[v];
                    }
                    ;
                }
            },
            _drawEnd: function() {
                var me = this
                this.stageBg.addChild(this._back.sprite);

                this.core.addChild(this._xAxis.sprite);
                this.core.addChild(this._graphs.sprite);
                this.core.addChild(this._yAxis.sprite);

                this.stageTip.addChild(this._tip.sprite);

                //执行生长动画
                this._graphs.grow(function (g) {
                    if (me._opts.markLine) {
                        me._initMarkLine(g);
                    }
                    ;
                    if (me._opts.markPoint) {
                        me._initMarkPoint(g);
                    }
                    ;
                });

                this.bindEvent();
            },
            _initDataZoom: function () {
                var me = this;
                //require(["chartx/components/datazoom/index"], function(DataZoom) {
                //初始化 datazoom 模块

                var dataZoomOpt = _.deepExtend({
                    w: me._xAxis.xGraphsWidth,
                    count: me._data.length - 1,
                    //h : me._xAxis.h,
                    pos: {
                        x: me._xAxis.pos.x,
                        y: me._xAxis.pos.y + me._xAxis.h
                    },
                    dragIng: function (range) {
                        //if (me.dataZoom.range.end <= me.dataZoom.range.start) {
                        //    me.dataZoom.range.end = me.dataZoom.range.start + 1;
                        //};
                        if (
                            parseInt(me.dataZoom.range.start) == parseInt(range.start)
                            && parseInt(me.dataZoom.range.end) == parseInt(range.end)
                        ) {
                            return;
                        }
                        ;
//console.log("start:"+me.dataZoom.range.start+"___end:"+me.dataZoom.range.end)
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
                        me._graphs.grow(function () {
                            //callback
                        }, {
                            delay: 0,
                            easing: "Quadratic.Out",
                            duration: 300
                        });

                        me._removeChecked();

                        me.fire("_dataZoomDragIng");
                    },
                    dragEnd: function (range) {
                        me._updateChecked()
                    }
                }, me.dataZoom);

                //me._getCloneBar();

                me._dataZoom = new DataZoom(dataZoomOpt);

                var graphssp = this.__cloneBar.thumbBar._graphs.sprite;
                graphssp.id = graphssp.id + "_datazoomthumbbarbg"
                graphssp.context.x = 0;
                graphssp.context.y = me._dataZoom.barH + me._dataZoom.barY;

                graphssp.context.scaleY = me._dataZoom.barH / this.__cloneBar.thumbBar._graphs.h;

                me._dataZoom.dataZoomBg.addChild(graphssp);
                //me._dataZoom.sprite.noSkip=true;
                me.core.addChild(me._dataZoom.sprite);

                this.__cloneBar.thumbBar.destroy();
                this.__cloneBar.cloneEl.parentNode.removeChild(this.__cloneBar.cloneEl);
                //});
            },
            _getCloneBar: function () {
                var me = this;
                barConstructor = this.constructor;//(barConstructor || Bar);
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
                    dataZoom: {
                        enabled: false
                    },
                    xAxis: {
                        //enabled: false
                    },
                    yAxis: {
                        //enabled: false
                    }
                });

                var thumbBar = new barConstructor(cloneEl, me._data, opts);
                thumbBar.draw();
                return {
                    thumbBar: thumbBar,
                    cloneEl: cloneEl
                }
            },
            _initMarkLine: function (g) {
                var me = this
                require(['chartx/components/markline/index'], function (MarkLine) {
                    var yfieldFlat = _.flatten(me._yAxis.field);
                    for (var a = 0, al = yfieldFlat.length; a < al; a++) {
                        var index = a;
                        var center = null;

                        if (!me.dataFrame.yAxis.center[a]) {
                            continue
                        } else {
                            center = me.dataFrame.yAxis.center[a].agPosition
                        }
                        ;

                        var strokeStyle = g._yAxisFieldsMap[yfieldFlat[a]].fillStyle; //g.sprite.children[0] ? g.sprite.children[0].children[a + 1].context.fillStyle : '#000000'

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

                        new MarkLine(_.deepExtend(o, me._opts.markLine)).done(function () {
                            me.core.addChild(this.sprite);
                            me._to3d(this.sprite);
                            var points = null;
                            _.each(this.sprite.children, function (_shape) {
                                if (_shape instanceof Shapes.BrokenLine) {
                                    points = _shape.context.pointList;
                                }
                            });

                            var p1 = Vector3.fromValues(points[0][0], points[0][1], 0);
                            var p2 = Vector3.fromValues(points[1][0], points[1][1], 0);

                            var v1 = Vector3.create();
                            Vector3.sub(v1, p2, p1);
                            var v2 = Vector3.fromValues(1, 0, 0);

                            var angle = Vector3.angle(v1, v2);
                            this.txt.context.rotation = angle * 180 / Math.PI;

                        })
                    }
                })
            },
            _initMarkPoint: function (g) {
                var me = this;
                var gOrigin = {
                    x: g.sprite.context.x,
                    y: g.sprite.context.y
                };

                require(["chartx/components/markpoint/index"], function (MarkPoint) {
                    _.each(g.data, function (group, i) {
                        var vLen = group.length;

                        _.each(group, function (hgroup) {
                            _.each(hgroup, function (bar) {
                                var barObj = _.clone(bar);
                                barObj.x += gOrigin.x;
                                barObj.y += gOrigin.y;
                                var mpCtx = {
                                    value: barObj.value,
                                    shapeType: "droplet",
                                    markTarget: barObj.field,
                                    //注意，这里视觉上面的分组和数据上面的分组不一样，所以inode 和 iNode 给出去的时候要反过来
                                    iGroup: barObj.iGroup,
                                    iNode: barObj.iNode,
                                    iLay: barObj.iLay,
                                    point: {
                                        x: barObj.x,
                                        y: barObj.y,
                                    }
                                };
                                new MarkPoint(me._opts, mpCtx).done(function () {
                                    me.core.addChild(this.sprite);
                                    if (this.shape)this.shape.z = -25;
                                    if (this.shapeBg)this.shapeBg.z = -25;
                                    if (this.shapeCircle) this.shapeCircle.z = -25;
                                    me._to3d(this.sprite);
                                    var mp = this;
                                    this.shape.hover(function (e) {
                                        this.context.hr++;
                                        this.context.cursor = "pointer";
                                        e.stopPropagation();
                                    }, function (e) {
                                        this.context.hr--;
                                        e.stopPropagation();
                                    });
                                    this.shape.on("mousemove", function (e) {
                                        e.stopPropagation();
                                    });
                                    this.shape.on("tap click", function (e) {
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

            _removeChecked: function () {
                this._graphs.removeAllChecked()
            },
            _updateChecked: function () {
                var me = this
                me._currCheckedList = me._getCurrCheckedList()
                for (var a = 0, al = me._currCheckedList.length; a < al; a++) {
                    var o = me._currCheckedList[a]
                    me._checkedBar({
                        iNode: o.iNode - me.dataZoom.range.start,
                        checked: true,
                    })
                }
            },

            _getCurrCheckedList: function () {
                var me = this
                return _.filter(me._checkedList, function (o) {
                    if (o) {
                        if (o.iNode >= me.dataZoom.range.start && o.iNode <= me.dataZoom.range.end) {
                            return o
                        }
                    }
                })
            },
            _checked: function (eventInfo) { //当点击graphs时 触发选中状态
                var me = this
                if (!me._graphs.checked.enabled) {
                    return
                }
                var i = eventInfo.iNode + me.dataZoom.range.start

                var checked = true
                if (me._checkedList[i]) { //如果已经选中
                    me._checkedList[i] = null
                    checked = false
                } else { //如果没选中
                    me._checkedList[i] = eventInfo
                }
                me._checkedBar({
                    iNode: eventInfo.iNode,
                    checked: checked
                })
                me._checkedMiniBar({
                    iNode: i,
                    checked: checked
                })

                eventInfo.iNode = i
            },
            _checkedBar: function ($o) { //选择bar
                var me = this
                var graphs = me._graphs
                graphs._checked($o)
            },
            _checkedMiniBar: function ($o) { //选择缩略的bar
                if (this.dataZoom.enabled) {
                    var me = this
                    var graphs = me.__cloneBar.thumbBar._graphs
                    var fillStyle = ''
                    if ($o.checked) {
                        fillStyle = (me._opts.dataZoom.checked && me._opts.dataZoom.checked.fillStyle) || fillStyle
                    }
                    graphs.setBarStyle({
                        iNode: $o.iNode,
                        fillStyle: fillStyle
                    })
                }
            },

            bindEvent: function () {
                var me = this;
                this._graphs.sprite.on("panstart mouseover", function (e) {
                    me._setXaxisYaxisToTipsInfo(e);
                    me._tip.show(e);
                    me.fire(e.type, e);
                });
                this._graphs.sprite.on("panmove mousemove", function (e) {
                    me._setXaxisYaxisToTipsInfo(e);
                    me._tip.move(e);
                    me.fire(e.type, e);
                });
                this._graphs.sprite.on("panend mouseout", function (e) {
                    me._tip.hide(e);
                    me.fire(e.type, e);
                });
                this._graphs.sprite.on("tap click dblclick mousedown mouseup", function (e) {
                    if (e.type == 'click') {
                        me.fire('checkedBefor');
                        me._checked(_.clone(e.eventInfo));
                    }
                    ;
                    me._setXaxisYaxisToTipsInfo(e);
                    me.fire(e.type, e);
                });

                this.on('_to3d', function () {
                    me._to3d(me.stage);
                });




            },

            //projection to screen
            //基本变换过程为:local ===> screen ===> world ===> projection
            //             ===> screen ===> local
            _worldToScreen: function (ps) {
                var me = this;

                var p = new Array(ps.length);
                var one = Vector4.create();
                var out = Vector4.create();
                for (var x = 0, y = 0, z = 0; x < ps.length; x = x + 3) {
                    y = x + 1;
                    z = x + 2;
                    Vector4.set(one, ps[x], ps[y], ps[z], 1);

                    Vector3.transformMat4(out, one, me._viewProjectMatrix);
                    p[x] = (( out[0] + 1 ) * me.width ) / 2.0;
                    p[y] = ( ( out[1] - 1 ) * me.height ) / (-2.0);
                    p[z] = out[2];

                }
                return p;

            },
            _projectionToScreen: function (_shapes, _worldPosition) {
                var me = this;
                var _projectionPosition = null, _z, _points, _arr;
                if (_shapes instanceof Shapes.Line) {
                    _points = [];
                    _projectionPosition = [];
                    _z = [
                        _shapes.zStart,
                        _shapes.zEnd
                    ];
                    _.each(_worldPosition, function (o, i) {

                        _arr = me._worldToScreen([
                            _worldPosition[i].x,
                            _worldPosition[i].y,
                            (_z[i] || 0)]);
                        _projectionPosition.push(
                            {
                                x: _arr[0],
                                y: _arr[1]
                            }
                        )
                    });

                } else if (_shapes instanceof Shapes.Polygon || _shapes instanceof Shapes.BrokenLine) {
                    _projectionPosition = [];
                    _.each(_worldPosition, function (o, i) {
                        _arr = me._worldToScreen([
                            o.x,
                            o.y,
                            (_shapes.context.pointList[i][2] || 0)]);
                        _projectionPosition.push(
                            {
                                x: _arr[0],
                                y: _arr[1]
                            }
                        )
                    });
                } else {
                    _arr = me._worldToScreen([
                        _worldPosition.x,
                        _worldPosition.y,
                        _shapes.z || 0]);
                    _projectionPosition = {
                        x: _arr[0],
                        y: _arr[1]
                    }
                }
                return _projectionPosition;
            },
            _localToScreen: function (_shapes) {
                var _globalPosition = null;
                var _rootSprite = _shapes.parent;
                if (_shapes instanceof Shapes.Line) {

                    var _start = _rootSprite.localToGlobal({
                        x: _shapes.context.xStart + _shapes.context.x,
                        y: _shapes.context.yStart + _shapes.context.y
                    });

                    var _end = _rootSprite.localToGlobal({
                        x: _shapes.context.xEnd + _shapes.context.x,
                        y: _shapes.context.yEnd + _shapes.context.y
                    });


                    _globalPosition = [_start, _end];

                } else if (_shapes instanceof Shapes.Polygon || _shapes instanceof Shapes.BrokenLine) {
                    _globalPosition = [];
                    _.each(_shapes.context.pointList, function (o, i) {
                        var _pos = _rootSprite.localToGlobal({
                            x: o[0] + _shapes.context.x,
                            y: o[1] + _shapes.context.y
                        });
                        _globalPosition.push(_pos);
                    });
                } else {
                    _globalPosition = _rootSprite.localToGlobal({
                        x: _shapes.context.x,
                        y: _shapes.context.y
                    });
                }
                return _globalPosition;
            },
            _screenToWorld: function (_shapes, _width, _height, _globalPosition) {
                var _worldPosition = null;
                if (_shapes instanceof Shapes.Line) {
                    var _start = {
                        x: _globalPosition[0].x - _width * 0.5,
                        y: _height * 0.5 - _globalPosition[0].y
                    };

                    var _end = {
                        x: _globalPosition[1].x - _width * 0.5,
                        y: _height * 0.5 - _globalPosition[1].y
                    };
                    _worldPosition = [_start, _end];

                } else if (_shapes instanceof Shapes.Polygon || _shapes instanceof Shapes.BrokenLine) {
                    _worldPosition = [];
                    _.each(_globalPosition, function (o, i) {
                        var _pos = {
                            x: o.x - _width * 0.5,
                            y: _height * 0.5 - o.y
                        };
                        _worldPosition.push(_pos);
                    })

                } else {

                    _worldPosition = {
                        x: _globalPosition.x - _width * 0.5,
                        y: _height * 0.5 - _globalPosition.y
                    };
                }
                return _worldPosition;

            },
            _screenToLocal: function (_shapes, _projectionPosition) {
                var _rootSprite = _shapes.parent;
                var _pointList = [];
                if (_shapes instanceof Shapes.Line) {

                    var _start = _rootSprite.globalToLocal({
                        x: _projectionPosition[0].x,
                        y: _projectionPosition[0].y
                    });

                    var _end = _rootSprite.globalToLocal({
                        x: _projectionPosition[1].x,
                        y: _projectionPosition[1].y
                    });

                    _shapes.context.xStart = _start.x;
                    _shapes.context.yStart = _start.y;

                    _shapes.context.xEnd = _end.x;
                    _shapes.context.yEnd = _end.y;

                    _shapes.context.x = 0;
                    _shapes.context.y = 0;


                } else if (_shapes instanceof Shapes.Polygon || _shapes instanceof Shapes.BrokenLine) {
                    _.each(_projectionPosition, function (o, i) {
                        var _pos = _rootSprite.globalToLocal({
                            x: o.x,
                            y: o.y
                        });
                        _pointList.push([
                            _pos.x,
                            _pos.y
                        ]);
                    });
                    _shapes.context.pointList = _pointList;

                    _shapes.context.x = 0;
                    _shapes.context.y = 0;

                } else {
                    var pos = _rootSprite.globalToLocal({
                        x: _projectionPosition.x,
                        y: _projectionPosition.y
                    })
                    _shapes.context.x = pos.x;
                    _shapes.context.y = pos.y;
                }
            },
            _to3d: function (sprite) {
                //noTransform  不做转换
                //noSkip  只变换本身,不变换子元素
                var me = this;
                var _globalPosition, _worldPosition, _projectionPosition;
                (function (node) {
                    var getLeaf = arguments.callee;
                    if(node.noTransform) return;
                    if (node.children && node.children.length > 0 && !node.noSkip) {
                        _.each(node.children, function (a, i) {
                            getLeaf(a);
                        })
                    } else {
                        _globalPosition = me._localToScreen(node);
                        _worldPosition = me._screenToWorld(node, me.width, me.height, _globalPosition);
                        _projectionPosition = me._projectionToScreen(node, _worldPosition);
                        me._screenToLocal(node, _projectionPosition);

                    }
                })(sprite)
                me._graphs._depthTest(sprite);
            }


        });

        return Bar3d;
    });