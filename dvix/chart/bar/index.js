KISSY.add(function(S, Chart , Tools, DataSection, EventType, xAxis, yAxis, Back, Graphs, Tips){
    /*
     *@node chart在dom里的目标容器节点。
    */
    var Canvax = Chart.Canvax;

    return Chart.extend( {

        init:function(){
            this.type          =  'scat';                  //图表类型(折线图)
        
            this.dataFrame     =  {                        //数据框架集合
                org        :[],                            //最原始的数据  
                data       :[],                            //最原始的数据转化后的数据格式：[o,o,o] o={field:'val1',index:0,data:[1,2,3]}
                yAxis      :{                              //y轴
                    fields     :  [],                      //字段集合 对应this.data
                    org        :  [],                      //二维 原始数据[[100,200],[1000,2000]]
                    data       :  []                       //坐标数据[{y:100,content:'100'},{y:200,content:'200'}] 与back.data相同但当config.yAxis.mode=2时    该值进行删减且重算，back.data不受影响
                },
                xAxis      :{                              //x轴
                    field      :  '',                      //字段 对应this.data
                    org        :  [],                      //原始数据['星期一','星期二']
                    data       :  []                       //坐标数据[{x:100,content:'星期一'},{x:200,content:'星期二'}]
                },
                graphs     :{                              //图形
                    data       :  [],                      //二维 数据集合等[[{x:0,y:-100},{}],[]]
                    disX       :  0                        //每两个点之间的距离
                }
            }

            this._chartWidth   =  0;                       //图表渲染区域宽(去掉左右留空)
            this._chartHeight  =  0;                       //图表渲染区域高(去掉上下留空)

            this._disX         =  0;                       //图表区域离左右的距离
            this._disY         =  6;                       //图表区域离上下的距离
            this.disYAndO      =  6;                       //y轴原点之间的距离


            this._baseNumber   =  0;                       //基础点

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

            this._initConfig( opt );               //初始化配置

            this._initData( data );                          //初始化数据

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
        _initConfig:function(opt){
            _.deepExtend( this.dataFrame.yAxis , opt.yAxis );
            _.deepExtend( this.dataFrame.xAxis , opt.xAxis );
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
            // self.dataFrame.yAxis.org = [[201,245,288,546,123,1000,445],[500,200,700,200,100,300,400]]
            // self.dataFrame.xAxis.org = ['星期一','星期二','星期三','星期四','星期五','星期六','星期日']
            

            //先计算出图表区域的大小
            self._chartWidth  = self.width  - 2 * self._disX
            self._chartHeight = self.height - 2 * self._disY

            var x = self._disX
            var y = this.height - self._xAxis.h - self._disY

            //绘制yAxis
            self._yAxis.draw({
                pos : {
                    x : x,
                    y : y
                },
                yMaxHeight : self._chartHeight - self._xAxis.h
            });


            var _yAxisW = self._yAxis.w
            
            x = self._disX + _yAxisW + self.disYAndO

            //绘制x轴
            self._xAxis.draw({
                w    :   self._chartWidth - _yAxisW - self.disYAndO,
                max  :   {
                    left  : -(_yAxisW + self.disYAndO)
                },
                pos  : {
                    x : x,
                    y : y
                }
            });

            //绘制背景网格
            self._back.draw({
                w    : self._chartWidth - _yAxisW - self.disYAndO,
                h    : y,
                xAxis:{
                    data : self._yAxis.data
                }
            });
            self._back.setX(x), self._back.setY(y)

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
        './xAxis',
        'dvix/components/yaxis/yAxis',
        'dvix/components/back/Back',
        './Graphs',
        'dvix/components/tips/Tips'
    ]
});
