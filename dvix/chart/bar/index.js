KISSY.add(function(S, Chart , Tools, DataSection, EventType, xAxis, yAxis, Back, Graphs , Tips){
    /*
     *@node chart在dom里的目标容器节点。
    */
    var Canvax = Chart.Canvax;

    return Chart.extend( {

        init:function(){
            this.dataFrame     =  null;                    //数据集合，由_initData 初始化
 
            this._xAxis        =  null;
            this._yAxis        =  null;
            this._back         =  null;
            this._graphs       =  null;
            this._tips         =  null;


            this.stageTip = new Canvax.Display.Sprite({
                id      : 'tip'
            });

            this.core    = new Canvax.Display.Sprite({
                id      : 'core'
            });
            this.stageBg  = new Canvax.Display.Sprite({
                id      : 'bg'
            });

            this.stage.addChild(this.stageBg);
            this.stage.addChild(this.core);
            this.stage.addChild(this.stageTip);

        },
        draw:function(data, opt){
            if( opt.rotate ) {
              this.rotate( opt.rotate );
            }

            this.dataFrame = this._initData( data , opt );                 //初始化数据

            this._initModule( opt , this.dataFrame );                      //初始化模块  

            this._startDraw();                         //开始绘图

            this._drawEnd();                           //绘制结束，添加到舞台
          
            this._arguments = arguments;

            //下面这个是全局调用测试的时候用的
            //window.hoho = this;
        },
        clear:function(){
            this.stageBg.removeAllChildren()
            this.core.removeAllChildren()
            this.stageTip.removeAllChildren()
        },
        reset:function(data, opt){
            this.clear()
            this.width   = parseInt(this.element.width());
            this.height  = parseInt(this.element.height());
            this.draw(data, opt)
        },
        _initModule:function(opt , data){
            this._xAxis  = new xAxis(opt.xAxis , data.xAxis);
            this._yAxis  = new yAxis(opt.yAxis , data.yAxis);
            this._back   = new Back(opt.back);
            this._graphs = new Graphs(opt.graphs);
            this._tips   = new Tips(opt.tips)
        },
        _startDraw : function(){
            var self = this;

            //首先
            var x = 0;
            var y = parseInt(this.height - this._xAxis.h)
            
            //绘制yAxis
            self._yAxis.draw({
                pos : {
                    x : 0,
                    y : y
                },
                yMaxHeight : y 
            });

            x = self._yAxis.w

            //绘制x轴
            self._xAxis.draw({
                w    :   self.width - x ,
                max  :   {
                    left  : -x
                },
                pos  : {
                    x : x,
                    y : y
                }
            });

            //绘制背景网格
            self._back.draw({
                w    : self.width - x ,
                h    : y,
                xAxis:{
                    data : self._yAxis.data
                },
                pos : {
                    x : x + this._xAxis.disOriginX,
                    y : y
                }
            });

            //绘制主图形区域
            this._graphs.draw( this._trimGraphs() , {
                w    : this._xAxis.xGraphsWidth,
                h    : this._yAxis.yGraphsHeight,
                pos  : {
                     x : x + this._xAxis.disOriginX ,
                     y : y
                }
            });

            //执行生长动画
            self._graphs.grow();
          
        },
        _trimGraphs:function(){

            var xArr     = this._xAxis.data;
            var yArr     = this._yAxis.dataOrg;
            var fields   = yArr.length;

            var xDis1    = this._xAxis.xDis1;
            //x方向的二维长度，就是一个bar分组里面可能有n个子bar柱子，那么要二次均分
            var xDis2    = xDis1 / (fields+1);

            //知道了xDis2 后 检测下 barW是否需要调整
            this._graphs.checkBarW( xDis2 );

            var maxYAxis = this._yAxis.dataSection[ this._yAxis.dataSection.length - 1 ];
            var tmpData  = [];
            for( var a = 0 , al = xArr.length; a < al ; a++ ){
                for( var b = 0 ; b < fields ; b ++ ){
                    !tmpData[b] && (tmpData[b] = []);
                    var y = -(yArr[b][a]-this._yAxis._baseNumber) / (maxYAxis - this._yAxis._baseNumber) * this._yAxis.yGraphsHeight;
                    var x = xArr[a].x - xDis1/2 + xDis2 * (b+1)
                    tmpData[b][a] = {
                        value : yArr[b][a],
                        x     : x,
                        y     : y
                    }
                }
            };
            return tmpData;
        },
        _drawEnd:function(){
            var self = this;
            self.stageBg.addChild(self._back.sprite)

            self.core.addChild(self._xAxis.sprite);
            self.core.addChild(self._graphs.sprite);
            self.core.addChild(self._yAxis.sprite);

            self.stageTip.addChild(self._tips.sprite)
           
        }
    });
    
} , {
    requires: [
        'dvix/chart/',
        'dvix/utils/tools',
        'dvix/utils/datasection',
        'dvix/event/eventtype',
        './xaxis',
        'dvix/components/yaxis/yAxis',
        'dvix/components/back/Back',
        './graphs',
        'dvix/components/tips/Tips'
    ]
});
