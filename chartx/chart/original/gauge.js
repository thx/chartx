define(
    "chartx/chart/original/gauge", [
        'chartx/chart/index',
        'chartx/utils/tools',
        'chartx/utils/gradient-color',
        'chartx/utils/datasection',
        'chartx/chart/original/gauge/graphs',
        'chartx/chart/original/gauge/xaxis',
        "chartx/components/tips/tip",
        'chartx/utils/dataformat'
    ],
    function(Chart, Tools, GradientColor, DataSection, Graphs, XAxis, Tip, dataFormat) {
        /*
         *@node chart在dom里的目标容器节点。
         */
        var Canvax = Chart.Canvax;

        return Chart.extend({
            xAxis : {
            },

            _graphs: null,
            _xAxis : null,

            init: function(node, data, opts) {
                this.padding.top = 10, this.padding.bottom = 5
                if (opts.dataZoom) {
                    this.padding.bottom += 46;
                    this.dataZoom = {
                        start: 0,
                        end: data.length - 2 //因为第一行是title
                    }
                }else{
                    this.padding.bottom = 10
                }
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

                this.stage.addChild(this.stageBg);
                this.stage.addChild(this.core);
            },
            draw: function() {
                this._setStages();

                this._initModule();              //初始化模块  

                this._startDraw();               //开始绘图

                this._drawEnd();                 //绘制结束，添加到舞台

                if (this.dataZoom) {
                    this._initDataZoom()
                }

                this.inited = true;
            },
            updateTitle : function($o){
                this._graphs.updateTitle({
                    title : $o.num,
                    duration : $o.duration
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
                    var w = me.width - me.padding.left - me.padding.right - 4
                    var x = 2
                    var dataZoomOpt = _.deepExtend({
                        w: w,
                        // count: 1,
                        // h : me._xAxis.height,
                        h : 30,
                        color : '#00a8e6',
                        pos: {
                            x: x,
                            y: me.height - me.padding.top - me.padding.bottom 
                        },
                        dragIng:function(o){
                            me._updateRange(o)
                        },
                        dragEnd:function(o){
                            me.fire("datazoomRange", o);
                        }
                    } , me.dataZoom); 

                    me._dataZoom = new DataZoom(dataZoomOpt);
                    me._updateRange(me._dataZoom.range)
                    me.core.addChild(me._dataZoom.sprite)


                    me.xAxis.width = w - 1
                    me._xAxis  = new XAxis(me.xAxis)
                    me._xAxis.draw({
                        pos : {
                            x : 0,
                            y : me._dataZoom.barY + me._dataZoom.barH
                        }
                    })

                    me._dataZoom.dataZoomBg.addChild(me._xAxis.sprite);
                })
            },
            _startDraw: function(opt) {
                var me = this
                var w  = me.width - me.padding.left - me.padding.right
                var h  = me.height - me.padding.top - me.padding.bottom
                var ox = parseInt(w / 2), oy = h
                //绘制主图形区域
                me._graphs.draw({
                    w  : w - me.padding.bottom ,
                    h  : h,
                    pos: {
                        x: ox,
                        y: oy
                    }
                });
                var y = parseInt((h - me._graphs.h) / 2 + me._graphs.maxR)
                me._graphs.setY(y)
            },

            _updateRange:function($o){
                var me = this
                var start = parseInt($o.start), end = parseInt($o.end)
                me._graphs.updateRange({
                    scale    : {
                        start  : start / me.dataZoom.count,
                        end    : end / me.dataZoom.count
                    },
                    subtitle : {
                        start : start,
                        end   : end 
                    }
                })
            },
            _drawEnd: function() {
                this.core.context.y = this.padding.top
                this.core.context.x = this.padding.left

                this.core.addChild(this._graphs.sprite);
            },
        });
    }
);
