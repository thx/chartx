define(
    "chartx/chart/bar/horizontal",
    [
        'chartx/chart/index',
        'chartx/utils/tools',
        'chartx/utils/datasection',
        // './xaxis',
        'chartx/components/xaxis/xAxis_h',
        'chartx/components/yaxis/yAxis_h',
        'chartx/components/back/Back',
        './horizontal/graphs',
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
                // var currobj = this.dataFrame.xAxis;
                // this.dataFrame.xAxis = this.dataFrame.yAxis;
                // this.dataFrame.yAxis = currobj;
            },
            draw:function(){
                this.core    = new Canvax.Display.Sprite({
                    id      : 'core'
                });
                this.stageBg = new Canvax.Display.Sprite({
                    id      : 'bg'
                });
    
                this.stage.addChild(this.stageBg);
                this.stage.addChild(this.core);


                if( this.rotate ) {
                  this._rotate( this.rotate );
                }
    
                this._initModule();                        //初始化模块  
    
                this._startDraw();                         //开始绘图
    
                this._drawEnd();                           //绘制结束，添加到舞台
              
                this._arguments = arguments;
    
            },
            _initData  : dataFormat,
            _initModule:function(){
                // console.log(this.dataFrame.xAxis)
                this._xAxis  = new xAxis(this.xAxis , this.dataFrame.xAxis);
                // console.log(this.dataFrame.yAxis)
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
                /*
                //绘制x轴
                this._xAxis.draw({
                    w    :   this.width - _yAxisW ,
                    max  :   {
                        left  : -_yAxisW
                    },
                    pos  : {
                        x : _yAxisW,
                        y : y
                    }
                });
                */
                this._xAxis.draw({
                    graphh :   this.height,
                    graphw :   this.width,
                    yAxisW :   _yAxisW
                });
                // console.log(this._xAxis.yAxisW , _yAxisW)
                if( this._xAxis.yAxisW != _yAxisW ){
                    //说明在xaxis里面的时候被修改过了。那么要同步到yaxis
                    this._yAxis.resetWidth( this._xAxis.yAxisW );
                    _yAxisW = this._xAxis.yAxisW;
                };

                //绘制背景网格
                this._back.draw({
                    
                    w    : this.width - _yAxisW ,
                    h    : y,
                    xAxis:{
                        data : [{}].concat(this._yAxis.data)
                    },
                    yAxis:{
                        enabled :1,
                        data : this._xAxis.layoutData
                    },
                    pos : {
                        x : _yAxisW,// + this._xAxis.disOriginX,
                        y : y
                    }
                    // 
                    // w    : this._xAxis.w ,
                    // h    : y,
                    // // xAxis:{
                    // //     data : this._yAxis.layoutData
                    // // },
                    // // yAxis:{
                    // //     data : this._xAxis.layoutData
                    // // },
                    // pos  : {
                    //     x : _yAxisW,
                    //     y : y
                    // }
                });

                //绘制主图形区域
                this._graphs.draw( this._trimGraphs() , {
                    w    : this._xAxis.xGraphsWidth,
                    h    : this._yAxis.yGraphsHeight,
                    pos  : {
                         x : _yAxisW, //+ this._xAxis.disOriginX ,
                         y : y
                    },
                    yDataSectionLen : this._xAxis.dataSection.length
                });
    
                //执行生长动画
                this._graphs.grow();
              
            },
            _trimGraphs:function(){
                var yArr = this._yAxis.data
                var xArr = this._xAxis.dataOrg
                var fields   = xArr.length;
                var yDis1 = this._yAxis.yDis1

                //x方向的二维长度，就是一个bar分组里面可能有n个子bar柱子，那么要二次均分
                var yDis2    = yDis1 / (fields+1);
    
                //知道了yDis2 后 检测下 barW是否需要调整
                this._graphs.checkBarW( yDis2 );
    
                var maxXAxis = this._xAxis.dataSection[ this._xAxis.dataSection.length - 1 ];
                var tmpData  = [];
                for( var a = 0 , al = yArr.length; a < al ; a++ ){
                    for( var b = 0 ; b < fields ; b ++ ){
                        !tmpData[b] && (tmpData[b] = []);
                        var x = -(xArr[b][a]) / (maxXAxis) * this._xAxis.xGraphsWidth;
                        var y = yArr[a].y - yDis1/2 + yDis2 * (b+1)
                        tmpData[b][a] = {
                            value : xArr[b][a],
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


define(
    "chartx/chart/bar/horizontal/graphs",
    [
        "canvax/index",
        "canvax/shape/Rect",
        "canvax/animation/Tween",
        "chartx/components/tips/tip",
        "chartx/utils/tools"
    ],
    function(Canvax , Rect , Tween , Tip, Tools ){
 
        var Graphs = function( opt , tips , domContainer , dataFrame ){
            this.dataFrame = dataFrame;
            this.w = 0;
            this.h = 0;
           
            this.pos = {
                x : 0,
                y : 0
            }
    
            this._colors = ["#42a8d7",'#666666',"#6f8cb2" , "#c77029" , "#f15f60" , "#ecb44f" , "#ae833a" , "#896149"];
    
            this.bar = {
                width  : 12,
                radius : 2
            }

            this.text = {
                    enabled   : 0,
                    fillStyle : '#999999',
                    fontSize  : 12,
                    textAlign : "left",
                    format    : null
            }
            

            this.eventEnabled = true;
    
            this.sprite = null ;
            this.txtsSp = null

            this.yDataSectionLen = 0; //y轴方向有多少个section
    
            _.deepExtend(this , opt);
    
            this._tip = new Tip( tips , domContainer );
            
            this.init( );
        };
    
        Graphs.prototype = {
            init : function( ){
                this.sprite = new Canvax.Display.Sprite({ id : "graphsEl" });
                this.txtsSp = new Canvax.Display.Sprite({ id : "txtsSp" , context:{visible:false}});
            },
            setX:function($n){
                this.sprite.context.x = $n
            },
            setY:function($n){
                this.sprite.context.y = $n
            },
            _getColor : function( c , i , ii , value){
                var style = null;
                if( _.isString( c ) ){
                    style = c
                }
                if( _.isArray( c ) ){
                    style = c[ii]
                }
                if( _.isFunction( c ) ){
                    style = c( {
                        iGroup : ii,
                        iNode  : i,
                        value  : value
                    } );//i , ii , value );
                }
                if( !style || style == "" ){
                    style = this._colors[ii]
                }
                return style;
            },
            checkBarW : function( xDis ){
                if( this.bar.width >= xDis ){
                    this.bar.width = xDis-1 > 1 ? xDis - 1 : 1;
                }

            },
            draw : function(data , opt){
                _.deepExtend(this , opt);
                if( data.length == 0 ){
                    return;
                }
    
                this.data = data;
    
                //这个分组是只x方向的一维分组
                var barGroupLen = data[0].length;

    
                for( var i = 0 ; i < barGroupLen ; i++ ){
                    var sprite      = new Canvax.Display.Sprite({ id : "barGroup"+i });
                    var spriteHover = new Canvax.Display.Sprite({ id : "barGroupHover"+i });
                    for( var ii = 0 , iil = data.length ; ii < iil ; ii++ ){
                        var barData = data[ii][i];
                        // console.log(barData.y)
                        var fillStyle = this._getColor( this.bar.fillStyle , i , ii , barData.value );
                        var barH      = parseInt(Math.abs(barData.x));
                        var rectCxt   = {
                            // x         : Math.round(barData.x - this.bar.width/2),
                            // y         : parseInt(barData.y),
                            // width     : parseInt(this.bar.width),
                            // height    : barH,
                            x         : 0,
                            y         : Math.round(barData.y - this.bar.width/2),
                            width     : barH,
                            height    : parseInt(this.bar.width),
                            fillStyle : fillStyle
                        };

                        if( !!this.bar.radius ){
                            var radiusR   = Math.min( this.bar.width/2 , barH );
                            radiusR = Math.min( radiusR , this.bar.radius );
                            rectCxt.radius = [radiusR , radiusR, 0 , 0];
                        }
                        var rect = new Rect({
                            id      : "bar_"+ii+"_"+i,
                            context : rectCxt
                        });
    
                        // var itemSecH   = this.h/( this.yDataSectionLen - 1 );
                        // var hoverRectH = Math.ceil(barH/itemSecH) * itemSecH;
                        var hoverRect  = new Rect({
                            id : "bar_"+ii+"_"+i+"hover",
                            context : {
                                // x           : Math.round(barData.x - this.bar.width/2),
                                // y           : -hoverRectH,
                                // width       : parseInt(this.bar.width),
                                // height      : hoverRectH,
                                x           : 0,
                                y           : Math.round(barData.y - this.bar.width/2),
                                width       : this.w,
                                height      : parseInt(this.bar.width),
                                fillStyle   : "black",
                                globalAlpha : 0,
                                cursor      : "pointer"
                            }
                        }); 
    
                        hoverRect.target = rect;
                        hoverRect.row    = i;
                        hoverRect.column = ii;

                        if( this.eventEnabled ) {
                            var me = this;
                            hoverRect.on("mouseover" , function(e){
                                var target    = this.target.context;
                                target.y      --;
                                target.height += 2;

                                me.sprite.addChild(me._tip.sprite);
                                me._tip.show( me._setTipsInfoHandler(e , this.row , this.column ) );

                            }); 
                            hoverRect.on("mousemove" , function(e){
                                me._tip.move( me._setTipsInfoHandler(e , this.row , this.column ) );
                            }); 
                            hoverRect.on("mouseout" , function(e){
                                var target    = this.target.context;
                                target.y      ++;
                                target.height -= 2;
                                me._tip.hide(e);
                                me.sprite.removeChild(me._tip.sprite);
                            }); 
                        }
                        
                         //文字
                        var content = barData.value
                        if( _.isFunction(this.text.format) ){
                            content = this.text.format( content );
                        }else{
                            content = Tools.numAddSymbol(content);
                        }

                        var txt = new Canvax.Display.Text( content ,
                           {
                            context : {
                                x  : barH + 2,
                                y  : barData.y,
                                fillStyle    : this.text.fillStyle,
                                fontSize     : this.text.fontSize,
                                textAlign    : this.text.textAlign
                           }
                        });
                        if(txt.context.x + txt.getTextWidth()> this.w){
                            txt.context.x = barH - txt.getTextWidth() - 2  
                        }
                        txt.context.y = barData.y - txt.getTextHeight() / 2
                        this.txtsSp.addChild(txt)

                        sprite.addChild( rect );
                        spriteHover.addChild( hoverRect );
                    }
                    this.sprite.addChild( sprite );
                    this.sprite.addChild( spriteHover );
                }
                this.sprite.addChild(this.txtsSp)

                this.sprite.context.x = this.pos.x;
                this.sprite.context.y = this.pos.y;
            },
            /**
             * 生长动画
             */
            grow : function(){
                var self  = this;
                var timer = null;
                var growAnima = function(){
                   var bezierT = new Tween.Tween( { h : 0 } )
                   .to( { h : self.h }, 500 )
                   .onUpdate( function (  ) {
                       self.sprite.context.scaleX = this.h / self.h;
                   } ).onComplete( function(){
                       self._growEnd();
                       cancelAnimationFrame( timer );
                   }).start();
                   animate();
                };
                function animate(){
                    timer    = requestAnimationFrame( animate ); 
                    Tween.update();
                };
                growAnima();
            },
             _growEnd : function(){
                if(this.text.enabled){
                    this.txtsSp.context.visible = true
                }
            },
            _setXaxisYaxisToTipsInfo : function(e){
                e.tipsInfo.xAxis = {
                    field : this.dataFrame.xAxis.field,
                    value : this.dataFrame.xAxis.org[0][ e.tipsInfo.iNode ]
                }
                var me = this;
                _.each( e.tipsInfo.nodesInfoList , function( node , i ){
                    node.field = me.dataFrame.yAxis.field[ i ];
                } );
            },
            _setTipsInfoHandler : function(e  , iNode ,iGroup){
                e.tipsInfo = {
                    iGroup        : iGroup,
                    iNode         : iNode,
                    nodesInfoList : this._getNodeInfo(iNode)
                };
                this._setXaxisYaxisToTipsInfo( e ); 
                return e;
            },
            _getNodeInfo : function( iNode ){
                var arr = [];
                var me  = this;
                _.each( this.data , function( group , i ){
                    var node = _.clone(group[iNode]);
                    node.fillStyle = me._getColor( me.bar.fillStyle , iNode , i , node.value );
                    arr.push(node);
                } );
                return arr;
            }
        }; 
    
        return Graphs;
    } 
)


define(
    "chartx/chart/bar/horizontal/tips",
    [
        "chartx/components/tips/tip"
    ],
    function(){
    
    }
)


define(
    "chartx/chart/bar/horizontal/xaxis",
    [
        "chartx/components/xaxis/xAxis_h"
    ],
    function( xAxisBase ){
        var xAxis = function( opt , data ){
            this.xDis1 = 0; //x方向一维均分长度
            xAxis.superclass.constructor.apply( this , arguments );
        };
        Chartx.extend( xAxis , xAxisBase , {
            // _trimXAxis:function( data , xGraphsWidth ){
            //     var tmpData = [];
            //     this.xDis1  = xGraphsWidth / data.length;
            //     for (var a = 0, al  = data.length; a < al; a++ ) {
            //         var o = {
            //             'content' : data[a], 
            //             'x'       : this.xDis1 * (a+1) - this.xDis1/2
            //         }
            //         tmpData.push( o );
            //     }
                
            //     return tmpData;
            // } 
        } );
    
        return xAxis;
    } 
);
