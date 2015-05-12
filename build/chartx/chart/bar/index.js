define(
    "chartx/chart/bar/index",
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
    function(Chart , Tools, DataSection, xAxis, yAxis, Back, Graphs , dataFormat ){
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
                this.core    = new Canvax.Display.Sprite({
                    id      : 'core'
                });
                this.stageBg  = new Canvax.Display.Sprite({
                    id      : 'bg'
                });
    
                this.stage.addChild(this.stageBg);
                this.stage.addChild(this.core);


                if( this.rotate ) {
                  this._rotate( this.rotate );
                }
    
                this._initModule();                      //初始化模块  
    
                this._startDraw();                         //开始绘图
    
                this._drawEnd();                           //绘制结束，添加到舞台
              
                this._arguments = arguments;
    
            },
            _initData  : dataFormat,
            _initModule:function(){
                this._xAxis  = new xAxis(this.xAxis , this.dataFrame.xAxis);
                this._yAxis  = new yAxis(this.yAxis , this.dataFrame.yAxis);
                this._back   = new Back(this.back);

                //因为tips放在graphs中，so 要吧tips的conf传到graphs中
                this._graphs = new Graphs(
                        this.graphs , 
                        this.tips , 
                        this.canvax.getDomContainer(),
                        this.dataFrame
                        );
            },
            _startDraw : function(){
                var y = parseInt(this.height - this._xAxis.h)
                
                //绘制yAxis
                this._yAxis.draw({
                    pos : {
                        x : 0,
                        y : y
                    },
                    yMaxHeight : y 
                });

                var _yAxisW = this._yAxis.w;

                //绘制x轴
                this._xAxis.draw({
                    graphh :   this.height,
                    graphw :   this.width,
                    yAxisW :   _yAxisW
                });
                if( this._xAxis.yAxisW != _yAxisW ){
                    //说明在xaxis里面的时候被修改过了。那么要同步到yaxis
                    this._yAxis.resetWidth( this._xAxis.yAxisW );
                    _yAxisW = this._xAxis.yAxisW;
                };

                var _graphsH = this._yAxis.yGraphsHeight;
                //Math.abs(this._yAxis.layoutData[ 0 ].y - this._yAxis.layoutData.slice(-1)[0].y);
                //绘制背景网格
                this._back.draw({
                    w    : this._xAxis.w ,
                    h    : _graphsH,
                    xAxis:{
                        data : this._yAxis.layoutData
                    },
                    yAxis:{
                        data : this._xAxis.layoutData
                    },
                    pos  : {
                        x : _yAxisW,
                        y : y
                    }
                });

            
                //绘制主图形区域
                this._graphs.draw( this._trimGraphs() , {
                    w    : this._xAxis.xGraphsWidth,
                    h    : this._yAxis.yGraphsHeight,
                    pos  : {
                         x : _yAxisW ,
                         y : y
                    },
                    yDataSectionLen : this._yAxis.dataSection.length
                });
    
                //执行生长动画
                this._graphs.grow();
              
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
                        var y = -(yArr[b][a]-this._yAxis._bottomNumber) / (maxYAxis - this._yAxis._bottomNumber) * this._yAxis.yGraphsHeight;
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
                this.stageBg.addChild(this._back.sprite)
    
                this.core.addChild(this._xAxis.sprite);
                this.core.addChild(this._graphs.sprite);
                this.core.addChild(this._yAxis.sprite);
               
            }
            
        });
        
    }
);
