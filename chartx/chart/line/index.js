define(
    "chartx/chart/line/index",
    [
        'chartx/chart/index',
        'chartx/utils/tools',
        'chartx/utils/datasection',
        './xaxis',
        'chartx/components/yaxis/yAxis',
        'chartx/components/back/Back',
        'chartx/components/anchor/Anchor',
        'chartx/components/line/Graphs',
        './tips',
        'chartx/utils/dataformat'
    ],
    function(Chart, Tools, DataSection, xAxis, yAxis, Back, Anchor, Graphs, Tips , dataFormat){
        /*
         *@node chart在dom里的目标容器节点。
        */
        var Canvax = Chart.Canvax;
    
        return Chart.extend( {
    
            init:function(node , data , opts){
                this.event         = {
                    enabled   : 0,
                    This      : this,
                    on        : null
                }
    
                this._xAxis   =  null;
                this._yAxis   =  null;
                this._anchor  =  null;
                this._back    =  null;
                this._graphs  =  null;
                this._tips    =  null;

                //this._preTipsInode =  null; //如果有tips的话，最近的一次tip是在iNode

                _.deepExtend( this , opts );
                this.dataFrame = this._initData( data , this );
            },
            draw:function(){
                this.stageTip = new Canvax.Display.Sprite({
                    id      : 'tip'
                });
                this.core     = new Canvax.Display.Sprite({
                    id      : 'core'
                });
                this.stageBg  = new Canvax.Display.Sprite({
                    id      : 'bg'
                });
    
                this.stage.addChild( this.stageBg );
                this.stage.addChild( this.core );
                this.stage.addChild( this.stageTip );

                if( this.rotate ) {
                    this._rotate( this.rotate );
                }
                this._initModule();                        //初始化模块  
    
                this._startDraw();                         //开始绘图
              
                this._arguments = arguments;
    
            },
            /*
             *添加一个yAxis字段，也就是添加一条brokenline折线
             *@params field 添加的字段
             *@params ind 添加到哪个位置 默认在最后面
             **/
            add : function( field , ind ){
            
                if( _.indexOf( this.yAxis.field , field ) >= 0 ){
                    return;
                }

                var i = this.yAxis.field.length;
                if( ind != undefined && ind != null ){
                    i = ind;
                };


                //首先，yAxis要重新计算
                if( ind == undefined ){
                    this.yAxis.field.push( field );
                    ind = this.yAxis.field.length-1;
                } else {
                    this.yAxis.field.splice(ind , 0 , field);
                }
                this.dataFrame = this._initData( this.dataFrame.org , this );

                this._yAxis.update( this.yAxis , this.dataFrame.yAxis );

                //然后yAxis更新后，对应的背景也要更新
                this._back.update({
                    xAxis:{
                        data : this._yAxis.layoutData
                    }
                });

                this._graphs.add({
                    data : this._trimGraphs()
                } , ind);
                //this._graphs.update();


            },
            /*
             *删除一个yaxis字段，也就是删除一条brokenline线
             *@params target 也可以是字段名字，也可以是 index
             **/
            remove : function( target ){
                var ind = null;
                if( _.isNumber(target) ){
                    //说明是索引
                    ind = target;
                } else {
                    //说明是名字，转换为索引
                    ind = _.indexOf( this.yAxis.field , target );
                }
                if( ind != null && ind != undefined && ind != -1 ){
                    this._remove(ind);
                }
            },
            _remove : function( ind ){
            
                //首先，yAxis要重新计算
                //先在dataFrame中更新yAxis的数据
                this.dataFrame.yAxis.field.splice(ind , 1);
                this.dataFrame.yAxis.org.splice(ind , 1);
                //this.yAxis.field.splice(ind , 1);

                this._yAxis.update( this.yAxis , this.dataFrame.yAxis );

                //然后yAxis更新后，对应的背景也要更新
                this._back.update({
                    xAxis:{
                        data : this._yAxis.layoutData
                    }
                });

                //然后就是删除graphs中对应的brokenline，并且把剩下的brokenline缓动到对应的位置
                this._graphs.remove(ind);
                this._graphs.update({
                    data : this._trimGraphs()
                });
            },
            _initData  : dataFormat,
            _initModule:function(){
                this._xAxis  = new xAxis(this.xAxis , this.dataFrame.xAxis);
                this._yAxis  = new yAxis(this.yAxis , this.dataFrame.yAxis);
                this._back   = new Back(this.back);
                this._anchor = new Anchor(this.anchor);
                this._graphs = new Graphs( this.graphs, this);
                this._tips   = new Tips(this.tips , this.dataFrame , this.canvax.getDomContainer());

                this.stageBg.addChild(this._back.sprite);
                this.stageBg.addChild(this._anchor.sprite);
                this.core.addChild(this._xAxis.sprite);
                this.core.addChild(this._yAxis.sprite);
                this.core.addChild(this._graphs.sprite);
                this.stageTip.addChild(this._tips.sprite);
            },
            _startDraw : function(){
                // this.dataFrame.yAxis.org = [[201,245,288,546,123,1000,445],[500,200,700,200,100,300,400]]
                // this.dataFrame.xAxis.org = ['星期一','星期二','星期三','星期四','星期五','星期六','星期日']
                var y = this.height - this._xAxis.h;
                
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
            
                

                this._graphs.draw({
                    w    : this._xAxis.xGraphsWidth,
                    h    : this._yAxis.yGraphsHeight,
                    data : this._trimGraphs(),
                    disX : this._getGraphsDisX(),
                    smooth : this.smooth
                });

                this._graphs.setX( _yAxisW ), this._graphs.setY(y)
    
                //执行生长动画
                this._graphs.grow();
    
                var self = this;
                this._graphs.sprite.on( "panstart mouseover" ,function(e){
                    if( self._tips.enabled &&
                        //self._preTipsInode && self._preTipsInode != e.tipsInfo.iNode &&
                        e.tipsInfo.nodesInfoList.length > 0
                        ){
                            self._setXaxisYaxisToTipsInfo(e);
                            self._tips.show( e );

                            //触发
                            //self.fire( "" , e );
                    }
                });
                this._graphs.sprite.on( "panmove mousemove" ,function(e){
                    if( self._tips.enabled ){
                        if( e.tipsInfo.nodesInfoList.length > 0 ){
                            self._setXaxisYaxisToTipsInfo(e);
                            if( self._tips._isShow ){
                                self._tips.move( e );
                            } else {
                                self._tips.show( e );
                            }
                        } else {
                            if( self._tips._isShow ){
                                self._tips.hide( e );
                            }
                        }
                    }
                });
                this._graphs.sprite.on( "panend mouseout" ,function(e){
                    if( self._tips.enabled ){
                        self._tips.hide( e );
                    }
                });


                if(this._anchor.enabled){
                    //绘制点位线
                    var pos = this._getPosAtGraphs(this._anchor.xIndex, this._anchor.num)
                    this._anchor.draw({
                        w    : this.width - _yAxisW,
                        h    : _graphsH,
                        cross  : {
                            x : pos.x,
                            y : _graphsH + pos.y
                        },
                        pos   : {
                            x : _yAxisW,
                            y : y - _graphsH
                        }
                    });
                    //, this._anchor.setY(y)
                }
            },
            //把这个点位置对应的x轴数据和y轴数据存到tips的info里面
            //方便外部自定义tip是的content
            _setXaxisYaxisToTipsInfo : function( e ){
                e.tipsInfo.xAxis = {
                    field : this.dataFrame.xAxis.field,
                    value : this.dataFrame.xAxis.org[0][ e.tipsInfo.iNode ]
                }
                var me = this;
                _.each( e.tipsInfo.nodesInfoList , function( node , i ){
                    node.field = me.dataFrame.yAxis.field[ node._groupInd ];
                } );
            },
            _trimGraphs:function(){
                var maxYAxis = this._yAxis.dataSection[ this._yAxis.dataSection.length - 1 ];
                var arr      = this.dataFrame.yAxis.org;
                var tmpData  = [];
                for (var a = 0, al = arr.length; a < al; a++ ) {
                    for (var b = 0, bl = arr[a].length ; b < bl; b++ ) {
                        !tmpData[a] ? tmpData[a] = [] : '';
                        if( b >= this._xAxis.data.length ){
                            break;
                        }
                        var x = this._xAxis.data[b].x;
                        var y = - (arr[a][b] - this._yAxis._bottomNumber) / (maxYAxis - this._yAxis._bottomNumber) * this._yAxis.yGraphsHeight
                        y = isNaN(y) ? 0 : y
                        tmpData[a][b] = {
                            value : arr[a][b],
                            x : x,
                            y : y
                        };
                    }
                }
                return tmpData
            },
            //根据x轴分段索引和具体值,计算出处于Graphs中的坐标
            _getPosAtGraphs:function(index,num){
                //debugger
                var x = this._xAxis.data[index].x;
                var y = this._graphs.data[0][index].y
                return {x:x, y:y}
            },
            //每两个点之间的距离
            _getGraphsDisX:function(){
                var dsl = this._xAxis.dataSection.length;
                var n   = this._xAxis.xGraphsWidth / (dsl - 1);
                if( dsl == 1){
                    n = 0
                }
                return n
            },
            _click:function(o){
                var self = this.This                            //this = this.event
                if(_.isFunction(self.on)){
                    self.on(o)
                }
            }
        });
    
    } 
);
