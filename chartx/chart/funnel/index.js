define(
    "chartx/chart/funnel/index",
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

            dis : {                         //背景与容器上下左右距离
                left  : 2,
                right : 2,
                top   : 2,
                bottom: 2,

                backX : 2,                            //图形区域x方向一端与背景的距离
                backY : 2                             //图形区域y方向一端与背景的距离
            },

            _graphs : null,
            _tip    : null,

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

                // if( this.rotate ) {
                //   this._rotate( this.rotate );
                // }
            },
            draw:function(){
                    
                this._setStages();

                this._initModule();                        //初始化模块  
    
                this._startDraw();                         //开始绘图
    
                this._drawEnd();                           //绘制结束，添加到舞台

                this.inited = true;
                
            },
            _initData  : dataFormat,
            _initModule:function(){
                this._graphs = new Graphs(this.graphs)
            },
            _startDraw : function( opt ){
                this._graphs.draw( this._trimGraphs(), {
                    pos  : {
                         x : 0 ,
                         y : 0
                    }
                });
            },
            _trimGraphs:function(){
                return []
            },
            _drawEnd:function(){
                // this.stageBg.addChild(this._back.sprite)
    
                // this.core.addChild(this._xAxis.sprite);
                this.core.addChild(this._graphs.sprite);
                // this.core.addChild(this._yAxis.sprite);
               
                // this.stageTip.addChild(this._tip.sprite);

                //执行生长动画
                // this._graphs.grow();
            },
        });
    }
);
