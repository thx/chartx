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
    
            this._colors = ["#6f8cb2" , "#c77029" , "#f15f60" , "#ecb44f" , "#ae833a" , "#896149"];
    
            this.bar = {
                width  : 12,
                radius : 2
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
