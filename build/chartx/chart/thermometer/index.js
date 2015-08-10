define(
    "chartx/chart/thermometer/index",
    [
        'chartx/chart/index',
        'chartx/utils/tools',
        'chartx/utils/datasection',
        './graphs',
        "chartx/components/tips/tip",
        'chartx/utils/simple-data-format'
    ],
    function(Chart , Tools, DataSection, Graphs, Tip, dataFormat){
        /*
         *@node chart在dom里的目标容器节点。
        */
        var Canvax = Chart.Canvax;

        return Chart.extend( {

            _graphs : null,
            // _tip    : null,

            init:function(node , data , opts){
                this.dis = {                         //背景与容器上下左右距离
                    left  : 50,
                    right : 0,
                    top   : 0,
                    bottom: 0
                },

                graphsW    = 0                  //图形区域的宽高
                graphsH    = 0

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
            _initData  : dataFormat,
            _initModule:function(){
                this._graphs = new Graphs(this.graphs , this.canvax.getDomContainer());
            },
            _startDraw : function( opt ){
                this.graphsW = this.width - this.dis.left - this.dis.right
                this.graphsH = this.height- this.dis.top  - this.dis.bottom

                this._graphs.draw({
                    w    : this.graphsW,
                    h    : this.graphsH,
                    data : this.dataFrame.data[this.dataFrame.graphs.field[0]],
                    // turn : [],
                    pos  : {
                         x : this.dis.left,
                         y : this.dis.top
                    }
                });
            },
    
            _drawEnd:function(){
                // this.stageBg.addChild(this._back.sprite)
    
                // this.core.addChild(this._xAxis.sprite);
                this.core.addChild(this._graphs.sprite);
                // this.core.addChild(this._yAxis.sprite);
               
                // this.stageTip.addChild(this._tip.sprite);

                //执行生长动画
                // this._graphs.grow();

                // this.fire('complete');
            },
        });
    }
);
