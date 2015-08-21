define(
    "chartx/chart/original/sector",
    [
        'chartx/chart/index',
        'chartx/utils/tools',
        'chartx/utils/gradient-color',
        'chartx/utils/datasection',
        // "chartx/components/xaxis/xAxis",
        // "chartx/components/yaxis/yAxis",
        "./sector/xAxis",
        "./sector/yAxis",
        'chartx/chart/original/sector/graphs',
        "chartx/components/tips/tip",
        // 'chartx/utils/simple-data-format'
        'chartx/utils/dataformat'
    ],
    function(Chart , Tools, GradientColor, DataSection, xAxis, yAxis, Graphs, Tip, dataFormat){
        /*
         *@node chart在dom里的目标容器节点。
        */
        var Canvax = Chart.Canvax;

        return Chart.extend( {

            dis     : {                         //背景与容器上下左右距离
                left  : 10,
                right : 10,
                top   : 10,
                bottom: 10
            },

            graphs : {
                fillStyle   :  {
                    first   :  '#28ADE5',
                    last    :  '#87CCEA',
                    end     :  '#F6F5F4'
                }
            },

            _xAxis  : null,
            _yAxis  : null,
            _graphs : null,

            init:function(node , data , opts){
                _.deepExtend( this , opts );
               this.dataFrame = this._initData( data, opts );
            },
            _setStages : function(){
                this.core    = new Canvax.Display.Sprite({
                    id      : 'core'
                });
                this.stageBg  = new Canvax.Display.Sprite({
                    id      : 'bg'
                });
                this.stageTip  = new Canvax.Display.Sprite({
                    id      : 'tip'
                });

                this.stage.addChild(this.stageBg);
                this.stage.addChild(this.core);
                this.stage.addChild(this.stageTip);
            },
            draw:function(){

                this._setStages();

                this._initModule();                        //初始化模块  
    
                this._startDraw();                         //开始绘图
                
                this._drawEnd();                           //绘制结束，添加到舞台
                
            },
            _initData  : function(data, opts){
                var d = dataFormat.apply(this, arguments);
                var tmp = []
                var data1 = d.xAxis.org[0]
                var data2 = d.yAxis.org[0]
                _.each(data1 , function(value, i){
                    var o = {
                        index : i,
                        xAxis : value,
                        yAxis : data2[i]
                    }
                    tmp.push(o)
                })

                var data  = _.sortBy(tmp, 'xAxis')
                var xAxis = []
                var yAxis = [] 
                _.each(data, function(o, i){
                    xAxis.push(o.xAxis)
                    yAxis.push(o.yAxis)
                })
                d.xAxis.org[0] = xAxis
                d.yAxis.org[0] = yAxis
                d.graphs = {
                    org : data 
                }
                return d;
            },
            _initModule:function(){
                this._xAxis  = new xAxis(this.xAxis , this.dataFrame.xAxis);
                this._yAxis  = new yAxis(this.yAxis , this.dataFrame.yAxis);
                this._graphs = new Graphs(this.graphs , this.canvax.getDomContainer());
            },
            _startDraw : function( opt ){
                var w = (opt && opt.w) || this.width  - this.dis.left - this.dis.right
                var h = (opt && opt.h) || this.height - this.dis.top  - this.dis.bottom
                var y = parseInt( h - this._xAxis.h )
                 //绘制yAxis
                this._yAxis.draw({
                    pos : {
                        x : 0,
                        y : y
                    },
                    yMaxHeight : y 
                });
               
                var _yAxisW = Math.ceil(this._yAxis.w);

                //绘制x轴
                this._xAxis.draw({
                    graphh :   h,
                    graphw :   w,
                    yAxisW :   _yAxisW
                });
                if( this._xAxis.yAxisW != _yAxisW ){
                    //说明在xaxis里面的时候被修改过了。那么要同步到yaxis
                    this._yAxis.resetWidth( this._xAxis.yAxisW );
                    _yAxisW = this._xAxis.yAxisW;
                };

                this.graphsw = Math.min(parseInt(w - _yAxisW), y)
                this.graphsH = this.graphsw

                y = parseInt(this.dis.top + this.graphsH)
                this._yAxis.setY(y), this._xAxis.setY(y)

                var o = this._trimGraphs()

                //绘制主图形区域
                this._graphs.draw({
                    pos : {
                        x : _yAxisW,
                        y : y
                    },
                    data : o.data
                });

                this._yAxis.updateLayout(o.yAxisData)
                this._xAxis.updateLayout(o.xAxisData)
            },
            
            _trimGraphs:function(){
                var me   = this
                var graphs  = [], yAxis = [], xAxis = []
                var data = this.dataFrame.graphs.org
                var max  = data[data.length - 1].xAxis
                var maxR = this.graphsw

                var colors = new GradientColor(me.graphs.fillStyle.first, me.graphs.fillStyle.last, data.length - 1)
                colors.push(me.graphs.fillStyle.end)

                _.each(data, function(o, i){
                    graphs.unshift({
                        r          : Math.floor((o.xAxis / max) * maxR),
                        startAngle : -90,
                        endAngle   : 0,

                        fillStyle  : colors[i]
                    })

                    yAxis.push({
                        y : -Math.floor((o.xAxis / max) * maxR)
                    })
                    xAxis.push({
                        x : Math.floor((o.xAxis / max) * maxR)
                    })
                })

                return {data:graphs, yAxisData:yAxis, xAxisData:xAxis}
            },

            _drawEnd:function(){
                // this.stageBg.addChild(this._back.sprite)
                
                this.core.context.y = this.dis.top
                this.core.context.x = this.dis.left

                this.core.addChild(this._xAxis.sprite);
                this.core.addChild(this._graphs.sprite);
                this.core.addChild(this._yAxis.sprite);
               
                // this.stageTip.addChild(this._tip.sprite);

                //执行生长动画
                // this._graphs.grow();

                // this.fire('complete');
            },
        });
    }
);
