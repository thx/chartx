define(
    "chartx/chart/scat/index",
    [
        'chartx/chart/index',
        'chartx/utils/tools',
        'chartx/utils/datasection',
        './xaxis',
        'chartx/components/yaxis/yAxis',
        'chartx/components/back/Back',
        './graphs',
        'chartx/utils/dataformat'
    ],
    function(Chart , Tools, DataSection, xAxis, yAxis, Back, Graphs , dataFormat){
        /*
         *@node chart在dom里的目标容器节点。
        */
        var Canvax = Chart.Canvax;
    
        return Chart.extend( {
    
            init:function(node , data , opts){
    
                this._xAxis        =  null;
                this._yAxis        =  null;
                this._back         =  null;
                this._graphs       =  null;
    


                _.deepExtend( this , opts );
                this.dataFrame = this._initData( data , this );

            },
            draw:function(){
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

                if( this.rotate ) {
                  this._rotate( this.rotate );
                }
    
                this._initModule();                      //初始化模块  
    
                this._startDraw();                         //开始绘图
    
                this._drawEnd();                           //绘制结束，添加到舞台
              
                this._arguments = arguments;
    
                //下面这个是全局调用测试的时候用的
                //window.hoho = this;
            },
            _initData  : dataFormat,
            _initModule:function(){
                this._xAxis  = new xAxis(this.xAxis , this.dataFrame.xAxis);
                this._yAxis  = new yAxis(this.yAxis , this.dataFrame.yAxis);
                this._back   = new Back(this.back);
                this._graphs = new Graphs(this.graphs);
            },
            _startDraw : function(){
                //首先
                var x = 0;
                var y = this.height - this._xAxis.h
                
                //绘制yAxis
                this._yAxis.draw({
                    pos : {
                        x : 0,
                        y : y
                    },
                    yMaxHeight : y 
                });
    
                x = this._yAxis.w
    
                //绘制x轴
                this._xAxis.draw({
                    w    :   this.width - x ,
                    max  :   {
                        left  : -x
                    },
                    pos  : {
                        x : x,
                        y : y
                    }
                });
    
                //绘制背景网格
                this._back.draw({
                    w    : this.width - x ,
                    h    : y,
                    xAxis:{
                        data : this._yAxis.data
                    },
                    yAxis:{
                        data : this._xAxis.data
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
                this._graphs.grow();
              
            },
            _trimGraphs:function(){
                var xArr     = this._xAxis.dataOrg;
                var yArr     = this._yAxis.dataOrg;
    
                /**
                 *下面三行代码，为了在用户的xAxis.field 和 yAxis.field 数量不同的情况下
                 *自动扔掉多余的field数，保证每个点都有x，y坐标值
                 *这样的情况是散点图和 折线 柱状图 的x 轴不一样的地方
                 */
                var fields   = Math.min(yArr.length , xArr.length);
                xArr.length  = fields;
                yArr.length  = fields;
    
                var xDis    = this._xAxis.xDis;
    
                var maxYAxis = this._yAxis.dataSection[ this._yAxis.dataSection.length - 1 ];
                var maxXAxis = this._xAxis.dataSection[ this._xAxis.dataSection.length - 1 ];
    
                var tmpData  = [];
    
                for( var i = 0 , il = yArr.length; i < il ; i++ ){
                    !tmpData[i] && (tmpData[i] = []);
                    for( var ii = 0 , iil = yArr[i].length ; ii < iil ; ii++ ){
                        var y = -(yArr[i][ii]-this._yAxis._baseNumber) / (maxYAxis - this._yAxis._baseNumber) * this._yAxis.yGraphsHeight;
                        var x = (xArr[i][ii]-this._xAxis._baseNumber) / (maxXAxis - this._xAxis._baseNumber) * this._xAxis.w;
    
                        tmpData[i][ii] = {
                            value : {
                                x : xArr[i][ii],
                                y : yArr[i][ii]
                            },
                            x : x,
                            y : y
                        }
                    }
                }
                return tmpData;
            },
            _drawEnd:function(){
                this.stageBg.addChild(this._back.sprite);
                this.core.addChild(this._xAxis.sprite);
                this.core.addChild(this._graphs.sprite);
                this.core.addChild(this._yAxis.sprite);
            }
        });
        
    }
);
