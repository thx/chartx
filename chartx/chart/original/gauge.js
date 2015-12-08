define(
    "chartx/chart/original/gauge", [
        'chartx/chart/index',
        'chartx/utils/tools',
        'chartx/utils/gradient-color',
        'chartx/utils/datasection',
        'chartx/chart/original/gauge/graphs',
        "chartx/components/tips/tip",
        // 'chartx/utils/simple-data-format'
        'chartx/utils/dataformat'
    ],
    function(Chart, Tools, GradientColor, DataSection, Graphs, Tip, dataFormat) {
        /*
         *@node chart在dom里的目标容器节点。
         */
        var Canvax = Chart.Canvax;

        return Chart.extend({

            padding: {                               //四周间隔
                left: 2,
                right: 2,
                top: 2,
                bottom: 2
            },

            graphs: {
            },

            _graphs: null,

            init: function(node, data, opts) {

                if (opts.dataZoom) {
                    this.padding.bottom += 46;
                    this.dataZoom = {
                        start: 0,
                        end: data.length - 2 //因为第一行是title
                    }
                }; 

                _.deepExtend(this, opts);
                this.dataFrame = this._initData(data, opts);
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
            },
            draw: function() {

                this._setStages();

                this._initModule();              //初始化模块  

                this._startDraw();               //开始绘图

                this._drawEnd();                 //绘制结束，添加到舞台

                this._initDataZoom()

                this.inited = true;

                // this.aaa.on = function(o){
                //     fire()
                //     _graphs.updateRange(o)
                // }
            },
            updateTitle : function(num){
                this._graphs.updateTitle({
                    title : num
                })
            },
            _initData: function(data, opts) {
                var d = dataFormat.apply(this, arguments);
                var tmp = []

                return d;
            },
            _initModule: function() {
                this._graphs = new Graphs(this.graphs, this.canvax.getDomContainer());
            },
            _initDataZoom : function(){
                var me = this
                require(["chartx/components/datazoom/index"], function(DataZoom) {
                    console.log(me.height - me.padding.bottom)
                    var dataZoomOpt = _.deepExtend({
                        w: me.width - me.padding.left - me.padding.right,
                        // count: me._data.length - 1,
                        // h : me._xAxis.h,
                        pos: {
                            x: 0,
                            y: me._graphs.h, 
                        },
                        getRange: function(range) {
                            // me.dataZoom.range = range;

                            // me.resetData(me._data);
                        }
                    } , me.dataZoom); 

                    me._dataZoom = new DataZoom(dataZoomOpt); 

                    me.core.addChild(me._dataZoom.sprite)

                })
            },
            _startDraw: function(opt) {
                var me = this
                var w = me.width - me.padding.left - me.padding.right
                var h = me.height - me.padding.top - me.padding.bottom

                var cx= parseInt(w / 2), cy = parseInt(h / 2)
                var ox= cx, oy = h - 20 - me.padding.bottom

                var o = me._trimGraphs()

                //绘制主图形区域
                me._graphs.draw({
                    w  : w,
                    h  : h,
                    pos: {
                        x: ox,
                        y: oy
                    }
                });
            },

            _trimGraphs: function() {
                var me = this
                var o = {

                }

                return o
            },

            _drawEnd: function() {
                // this.stageBg.addChild(this._back.sprite)
                this.core.context.y = this.padding.top
                this.core.context.x = this.padding.left

                this.core.addChild(this._graphs.sprite);

                // this.stageTip.addChild(this._tip.sprite);

                //执行生长动画
                // this._graphs.grow();

                // this.fire('complete');
            },
        });
    }
);
