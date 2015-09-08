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
        'chartx/utils/dataformat',
        'chartx/components/anchor/Anchor',
        'chartx/components/tips/tip'
    ],
    function(Chart , Tools, DataSection, xAxis, yAxis, Back, Graphs , dataFormat , Anchor , Tip){
        /*
         *@node chart在dom里的目标容器节点。
        */
        var Canvax = Chart.Canvax;
    
        return Chart.extend( {
    
            init:function(node , data , opts){
    
                this._xAxis   =  null;
                this._yAxis   =  null;
                this._back    =  null;
                this._graphs  =  null;
                this._anchor  =  null;

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
            },
            _initData  : dataFormat,
            _initModule:function(){
                this._xAxis  = new xAxis(this.xAxis , this.dataFrame.xAxis);
                this._yAxis  = new yAxis(this.yAxis , this.dataFrame.yAxis);
                this._back   = new Back(this.back);
                this._anchor = new Anchor(this.anchor);
                this._graphs = new Graphs(this.graphs , this.dataFrame.zAxis);
                this._tip    = new Tip(this.tips, this.canvax.getDomContainer());
                this._tip._getDefaultContent = this._getTipDefaultContent;

                this.stageBg.addChild(this._back.sprite);
                this.core.addChild(this._xAxis.sprite);
                this.core.addChild(this._yAxis.sprite);
                this.core.addChild(this._graphs.sprite);
                this.core.addChild(this._anchor.sprite);
                this.stageTip.addChild(this._tip.sprite);

            },
            _getTipDefaultContent : function( nodeInfo ){
                return nodeInfo.xAxis.field+"："+nodeInfo.nodesInfoList[0].value;
            },
            _startDraw : function(opt){
                var w = (opt && opt.w) || this.width;
                var h = (opt && opt.h) || this.height;
                var y = parseInt( h - this._xAxis.h );
                
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
                    graphh :   h,
                    graphw :   w,
                    yAxisW :   _yAxisW
                });
                if( this._xAxis.yAxisW != _yAxisW ){
                    //说明在xaxis里面的时候被修改过了。那么要同步到yaxis
                    this._yAxis.resetWidth( this._xAxis.yAxisW );
                    _yAxisW = this._xAxis.yAxisW;
                };
    
                var _graphsH = this._yAxis.yGraphsHeight;
                //绘制背景网格
                this._back.draw({
                    w    : this._xAxis.xGraphsWidth ,
                    h    : _graphsH,
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
                    h    : _graphsH,
                    pos  : {
                         x : _yAxisW ,
                         y : y
                    }
                });
    
                //执行生长动画
                this._graphs.grow();

                if(this._anchor.enabled){
                    //绘制点位线
                    this._anchor.draw({
                        w    : this._xAxis.xGraphsWidth,//w - _yAxisW,
                        h    : _graphsH,
                        cross  : {
                            x : this._back.yAxis.org,
                            y : _graphsH+this._back.xAxis.org
                        },
                        pos   : {
                            x : _yAxisW,
                            y : y - _graphsH
                        }
                    } , this._xAxis , this._yAxis );
                    this._anchor.hide()
                };

                this._bindEvent();
              
            },
            _setXaxisYaxisToeventInfo : function( e ){
                var self = this;
                e.eventInfo.xAxis = {
                    field : self.dataFrame.xAxis.field[ e.eventInfo.iGroup ],
                    value : self.dataFrame.xAxis.org[ e.eventInfo.iGroup ][ e.eventInfo.iNode ]
                };
                if( e.target.zAxis ){
                    e.eventInfo.zAxis = e.target.zAxis;
                };
                _.each( e.eventInfo.nodesInfoList , function( node , i ){
                    node.field = self.dataFrame.yAxis.field[ e.eventInfo.iGroup ]
                } );
                
            },
            _bindEvent  : function(){
                var self = this;
                this._graphs.sprite.on("panstart mouseover", function(e){
                    if( self._anchor.enabled ){
                        self._anchor.show();
                    };
                    //console.log(e.eventInfo)
                    if( e.eventInfo ){
                        self._setXaxisYaxisToeventInfo(e);
                        self._tip.show( e );
                    }
                });
                this._graphs.sprite.on("panmove mousemove", function(e){
                    var cross = e.point;
                    if( e.target.id != "induce" ){
                        //那么肯定是从散点上面触发的，
                        cross = e.target.localToGlobal( e.point , self._graphs.sprite );
                        cross.y += self._graphs.h;
                    }
                    if( self._anchor.enabled ){
                        self._anchor.resetCross( cross );
                    }
                    if( e.eventInfo ){
                        self._setXaxisYaxisToeventInfo(e);
                        self._tip.move( e );
                    }

                });
                this._graphs.sprite.on("panend mouseout", function(e){
                    if( self._anchor.enabled ){
                        self._anchor.hide();
                    }
                    if( e.eventInfo ){
                        self._tip.hide( e );
                    }
                });
                this._graphs.sprite.on("tap click", function(e){
                });

            },
            _trimGraphs : function(){
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
                        var xbaseNum = this._xAxis._baseNumber;
                        if( xbaseNum == undefined || xbaseNum == null ){
                            xbaseNum = this._xAxis._baseNumber = this._xAxis.dataSection[0];
                        };
                        var x = (xArr[i][ii] - xbaseNum) / (maxXAxis - xbaseNum) * this._xAxis.w;
    
                        tmpData[i][ii] = {
                            //value : {
                            //    x : xArr[i][ii],
                            //    y : yArr[i][ii]
                            //},
                            value : yArr[i][ii],
                            x : x,
                            y : y
                        }
                    }
                }
                
                return tmpData;
            },
            _drawEnd:function(){
                
            }
        });
        
    }
);
