define("chartx/chart/bar/3d",
    [
        'chartx/chart/index',
        'chartx/utils/tools',
        'chartx/utils/datasection',
        'chartx/components/tips/tip',
        'chartx/utils/dataformat',
        'chartx/chart/bar/3d/xaxis',
        'chartx/chart/bar/3d/yaxis',
        'chartx/chart/bar/3d/back',
        'chartx/chart/bar/3d/graphs',
        "canvax/shape/Shapes",

    ],
    function (Chart, Tools, DataSection, Tip, dataFormat, xAxis, yAxis, Back, Graphs,Shapes) {

        var Canvax = Chart.Canvax;
        var Bar3d = Chart.extend({
            init: function (node, data, opts) {
                this._xAxis = null;
                this._yAxis = null;
                this._back = null;
                this._graphs = null;
                this._tip = null;

                this._node = node;
                this._data = data;
                this._opts = opts;

                _.deepExtend(this, opts);

                this.dataFrame = this._initData(data);

            },
            draw: function () {
                //测试三维效果
                var polygon = new Shapes.Polygon({
                    id : "polygon",
                    dragEnabled : true,
                    context : {
                        x:0,
                        y:0,
                        smooth : true,
                        pointList : [[120,42],[175,75],[225,144],[162,207],[90,180],[55,134],[82,90]],
                        fillStyle:"red",
                        strokeStyle:"blue",
                        lineWidth : 1
                    }
                });




                this.stage.addChild(polygon);




                return;
                this._setStages();

                this._initModule(); //初始化模块

                this._startDraw(); //开始绘图

                this._drawEnd(); //绘制结束，添加到舞台

                this.inited = true;
            },
            _setStages: function () {
                this.core = new Canvax.Display.Sprite({
                    id: 'core'
                });

                this.stage.addChild(this.core);
            },
            _initModule: function() {
                //因为tips放在graphs中，so 要吧tips的conf传到graphs中
                this._graphs = new Graphs(
                    this.graphs,
                    this
                );

                this._xAxis = new xAxis(this.xAxis, this.dataFrame.xAxis);

                this._yAxis = new yAxis(this.yAxis, this.dataFrame.yAxis, 0);

                this._back = new Back(this.back);
                this._tip = new Tip(this.tips, this.canvax.getDomContainer());
            },
            _startDraw: function(opt) {

                //绘制yAxis
                this._yAxis.draw({
                    pos: {
                        x: this.padding.left,
                        y: this.height - this.padding.bottom
                    },
                    yMaxHeight: 400
                });




            },
            _drawEnd: function() {
                var me = this

                this.core.addChild(this._xAxis.sprite);
                this.core.addChild(this._graphs.sprite);
                this.core.addChild(this._yAxis.sprite);


            },
            _initData: function (data, opt) {

                var d;

                d = dataFormat.apply(this, arguments);

                _.each(d.yAxis.field, function (field, i) {
                    if (!_.isArray(field)) {
                        field = [field];
                        d.yAxis.org[i] = [d.yAxis.org[i]];
                    }
                });
                return d;
            },



        });
        return Bar3d;
    });