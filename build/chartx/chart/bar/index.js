define(
    "chartx/chart/bar/graphs",
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
    
            this._colors = ["#42a8d7",'#666666',"#6f8cb2" , "#c77029" , "#f15f60" , "#ecb44f" , "#ae833a" , "#896149" , "#4d7fff"];
    
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
            this.txtsSp = null ;
    
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
            _getColor : function( c ,groups, vLen , i , h , v , value){
                var style = null;
                if( _.isString( c ) ){
                    style = c
                }
                if( _.isArray( c ) ){
                    style = _.flatten(c)[ vLen > 1 ? v+i*groups % (vLen*(i+1)) : i ]
                }
                if( _.isFunction( c ) ){
                    style = c( {
                        iGroup : i,
                        iNode  : h,
                        iLay   : v,
                        value  : value
                    } );
                }
                if( !style || style == "" ){
                    style = this._colors[ vLen > 1 ? v+i*groups % (vLen*(i+1)) : i ];
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
                var me    = this;
                var groups= data.length; 
                _.each( data , function( h_group , i){
                    //h_group为横向的分组。如果yAxis.field = ["uv","pv"]的话，
                    //h_group就会为两组，一组代表uv 一组代表pv。
                    var spg = new Canvax.Display.Sprite({ id : "barGroup"+i });

                    //vLen 为一单元bar上面纵向堆叠的length
                    //比如yAxis.field = [
                    //    ["uv","pv"],  vLen == 2
                    //    "click"       vLen == 1
                    //]
                    var vLen   = h_group.length;
                    if( vLen == 0 ) return;

                    for( h = 0 ; h < h_group[0].length ; h++ ){
                        var spv = new Canvax.Display.Sprite({ id : "spv"+i+"_h_"+h });
                        for( v = 0 ; v < vLen ; v++ ){
                            //单个的bar，从纵向的底部开始堆叠矩形
                            var rectData = h_group[v][h];
                            var rectH    = parseInt(Math.abs(rectData.y));
                            if( v > 0 ){
                                rectH    = rectH - parseInt(Math.abs( h_group[v-1][h].y) );
                            }
                            var fillStyle= me._getColor( me.bar.fillStyle ,groups, vLen , i , h , v , rectData.value );
                            var rectCxt  = {
                                x        : Math.round(rectData.x - me.bar.width/2),
                                y        : parseInt(rectData.y),
                                width    : parseInt(me.bar.width),
                                height   : rectH,
                                fillStyle: fillStyle 
                            };
                            var rectEl   = new Rect({
                                context  : rectCxt
                            });
                            console.log( rectCxt.x );
                            spv.addChild( rectEl );
                        };
                        spg.addChild(spv);
                    }
                    me.sprite.addChild( spg );
                } );

                /*
                //这个分组是只x方向的一维分组
                var barGroupLen = data[0].length;

    
                for( var i = 0 ; i < barGroupLen ; i++ ){
                    var sprite      = new Canvax.Display.Sprite({ id : "barGroup"+i });
                    var spriteHover = new Canvax.Display.Sprite({ id : "barGroupHover"+i });
                    for( var ii = 0 , iil = data.length ; ii < iil ; ii++ ){
                        
                        var barData = data[ii][i];
                        var fillStyle = this._getColor( this.bar.fillStyle , i , ii , barData.value );
                        var barH      = parseInt(Math.abs(barData.y));
                        
                        var rectCxt   = {
                            x         : Math.round(barData.x - this.bar.width/2),
                            y         : parseInt(barData.y),
                            width     : parseInt(this.bar.width),
                            height    : barH,
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
    
                        var itemSecH   = this.h/( this.yDataSectionLen - 1 );
                        var hoverRectH = Math.ceil(barH/itemSecH) * itemSecH;
                        var hoverRect  = new Rect({
                            id : "bar_"+ii+"_"+i+"hover",
                            context : {
                                x           : Math.round(barData.x - this.bar.width/2),
                                y           : -hoverRectH,
                                width       : parseInt(this.bar.width),
                                height      : hoverRectH,
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
                                target.x      --;
                                target.width  += 2;

                                me.sprite.addChild(me._tip.sprite);
                                me._tip.show( me._setTipsInfoHandler(e , this.row , this.column ) );

                            }); 
                            hoverRect.on("mousemove" , function(e){
                                me._tip.move( me._setTipsInfoHandler(e , this.row , this.column ) );
                            }); 
                            hoverRect.on("mouseout" , function(e){
                                var target    = this.target.context;
                                target.x      ++;
                                target.width  -= 2;
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
                                //x  : barData.x,
                                //y  : rectCxt.y,
                                fillStyle    : this.text.fillStyle,
                                fontSize     : this.text.fontSize,
                                textAlign    : this.text.textAlign
                           }
                        });
                        txt.context.x = barData.x - txt.getTextWidth() / 2;
                        txt.context.y = rectCxt.y - txt.getTextHeight();
                        if( txt.context.y + this.h < 0 ){
                            txt.context.y = -this.h;
                        }

                        this.txtsSp.addChild(txt)

                        sprite.addChild( rect );
                        spriteHover.addChild( hoverRect );
                    }

                    this.sprite.addChild( sprite );
                    this.sprite.addChild( spriteHover );
                }
                this.sprite.addChild(this.txtsSp);
                */
    
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
                       self.sprite.context.scaleY = this.h / self.h;
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
    "chartx/chart/bar/tips",
    [
        "chartx/components/tips/tip"
    ],
    function(){
    
    }
)


define(
    "chartx/chart/bar/xaxis",
    [
        "chartx/components/xaxis/xAxis"
    ],
    function( xAxisBase ){
        var xAxis = function( opt , data ){
            this.xDis1 = 0; //x方向一维均分长度
            xAxis.superclass.constructor.apply( this , arguments );
        };
        Chartx.extend( xAxis , xAxisBase , {
            _trimXAxis:function( data , xGraphsWidth ){
                
                var tmpData = [];
                this.xDis1  = xGraphsWidth / data.length;
                for (var a = 0, al  = data.length; a < al; a++ ) {
                    var o = {
                        'content' : data[a], 
                        'x'       : this.xDis1 * (a+1) - this.xDis1/2
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
                this.dataFrame = this._initData( data );
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
            _initData  : function( data ){
                var d = dataFormat.apply( this , [data] );
                _.each( d.yAxis.field , function(field , i){
                    if( !_.isArray( field ) ){
                        field = [field];
                        d.yAxis.org[ i ] = [ d.yAxis.org[ i ] ];
                    }
                } );
                return d;
            },
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
                var me       = this;
                var xArr     = this._xAxis.data;
                var yArr     = this._yAxis.dataOrg;
                var hLen     = yArr.length; //bar的横向分组length
                
                var xDis1    = this._xAxis.xDis1;
                //x方向的二维长度，就是一个bar分组里面可能有n个子bar柱子，那么要二次均分
                var xDis2    = xDis1 / (hLen+1);
    
                //知道了xDis2 后 检测下 barW是否需要调整
                this._graphs.checkBarW( xDis2 );
    
                var maxYAxis = this._yAxis.dataSection[ this._yAxis.dataSection.length - 1 ];
                var tmpData  = [];

                for( var b = 0 ; b < hLen ; b ++ ){
                    !tmpData[b] && (tmpData[b] = []);
                    _.each( yArr[b] , function( subv , v ){
                        !tmpData[b][v] && (tmpData[b][v] = []);
                        _.each( subv , function( val , i ){
                            var x = xArr[i].x - xDis1/2 + xDis2 * (b+1);
                            var y = -(val-me._yAxis._bottomNumber) / (maxYAxis - me._yAxis._bottomNumber) * me._yAxis.yGraphsHeight;
                            if( v > 0 ){
                                y += tmpData[b][v-1][i].y
                            };
                            tmpData[b][v].push({
                                value : val,
                                x     : x,
                                y     : y
                            });
                        } );
                    } );
                }
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
