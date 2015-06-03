define(
    "chartx/chart/scat/xaxis",
    [
        "chartx/components/xaxis/xAxis",
        "chartx/utils/datasection"
    ],
    function(xAxisBase , DataSection ){
        var xAxis = function( opt , data ){
            this.xDis = 0; //x方向一维均分长度
            xAxis.superclass.constructor.apply( this , arguments );
        };
        Chartx.extend( xAxis , xAxisBase , {
            _initDataSection  : function( arr ){ 
                var arr = _.flatten( arr ); //Tools.getChildsArr( data.org );
                var dataSection = DataSection.section(arr);
                this._baseNumber = dataSection[0];
    
                if( dataSection.length == 1 ){
                    //TODO;散点图中的xaxis不应该只有一个值，至少应该有个区间
                    dataSection.push( 100 );
                }
                return dataSection;
            },
            /**
             *@param data 就是上面 _initDataSection计算出来的dataSection
             */
            _trimXAxis : function( data , xGraphsWidth ){
                var tmpData = [];
                this.xDis  = xGraphsWidth / (data.length-1);
                for (var a = 0, al  = data.length; a < al; a++ ) {
                    var o = {
                        'content' : data[a], 
                        'x'       : this.xDis * a
                    }
                    tmpData.push( o );
                }
                return tmpData;
            } 
        } );
    
        return xAxis;
    }
);


define(
    "chartx/chart/scat/graphs",
    [
        "canvax/index",
        "canvax/shape/Circle",
        "canvax/animation/Tween"
    ],
    function( Canvax , Circle , Tween ){
 
        var Graphs = function( opt , data ){
            this.w = 0;
            this.h = 0;
           
            this.pos = {
                x : 0,
                y : 0
            }
    
            this._colors = ["#6f8cb2" , "#c77029" , "#f15f60" , "#ecb44f" , "#ae833a" , "#896149"];
    
    
            //圆圈默认半径
            this.r = 10;
    
            this.sprite = null ;
    
            this._circles = [];  //所有圆点的集合
    
            _.deepExtend(this , opt);
    
            this.init( data );
    
        };
    
        Graphs.prototype = {
            init : function(){
                this.sprite = new Canvax.Display.Sprite({ id : "graphsEl" });
            },
            setX:function($n){
                this.sprite.context.x = $n
            },
            setY:function($n){
                this.sprite.context.y = $n
            },
            getFillStyle : function( i , ii , value){
                var fillStyle = null;
                
                if( _.isArray( this.fillStyle ) ){
                    fillStyle = this.fillStyle[ii]
                }
                if( _.isFunction( this.fillStyle ) ){
                    fillStyle = this.fillStyle( i , ii , value );
                }
                if( !fillStyle || fillStyle=="" ){
                    fillStyle = this._colors[ii];
                }
                return fillStyle;
            },
            draw : function(data , opt){
                _.deepExtend(this , opt);
                if( data.length == 0 ){
                    return;
                }
    
                //这个分组是只x方向的一维分组
                var barGroupLen = data[0].length;
   
                for( var i = 0 ; i < barGroupLen ; i++ ){
                    var sprite = new Canvax.Display.Sprite({ id : "barGroup"+i });
                    for( var ii = 0 , iil = data.length ; ii < iil ; ii++ ){
                        var barData = data[ii][i];
    
                        var circle = new Circle({
                            context : {
                                x           : barData.x,
                                y           : barData.y,
                                fillStyle   : this.getFillStyle( i , ii , barData.value ),
                                r           : this.r,
                                globalAlpha : 0
                            }
                        });
                        sprite.addChild( circle );
                        this._circles.push( circle );
                    }
                    this.sprite.addChild( sprite );
                }
    
                this.setX( this.pos.x );
                this.setY( this.pos.y );
            },
            /**
             * 生长动画
             */
            grow : function(){
                var self  = this;
                var timer = null;
    
                var growAnima = function(){
                   var bezierT = new Tween.Tween( { h : 0 } )
                   .to( { h : 100 }, 500 )
                   .onUpdate( function () {
    
                       for( var i=0 , l=self._circles.length ; i<l ; i++ ){
                           self._circles[i].context.globalAlpha = this.h / 100;
                           self._circles[i].context.r = this.h / 100 * self.r;
                       }
                       
                   } ).onComplete( function(){
                       cancelAnimationFrame( timer );
                   }).start();
                   animate();
                };
                function animate(){
                    timer    = requestAnimationFrame( animate ); 
                    Tween.update();
                };
                growAnima();
            }
        }; 
    
        return Graphs;
    
    }
)


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
    
                //绘制背景网格
                this._back.draw({
                    w    : this._xAxis.w ,
                    h    : y,
                    xAxis:{
                        data : this._yAxis.layoutData
                    },
                    yAxis:{
                        data : this._xAxis.layoutData
                    },
                    pos : {
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
                        var y = -(yArr[i][ii]-this._yAxis._bottomNumber) / (maxYAxis - this._yAxis._bottomNumber) * this._yAxis.yGraphsHeight;
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
