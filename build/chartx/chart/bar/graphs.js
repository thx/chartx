define(
    "chartx/chart/bar/graphs",
    [
        "canvax/index",
        "canvax/shape/Rect",
        "canvax/animation/Tween",
        "chartx/utils/tools"
    ],
    function(Canvax , Rect , Tween , Tools ){
 
        var Graphs = function( opt, root ){
            this.w = 0;
            this.h = 0;
            this.root = root;
           
            this.pos = {
                x : 0,
                y : 0
            };
    
            this._colors = ["#42a8d7",'#666666',"#6f8cb2" , "#c77029" , "#f15f60" , "#ecb44f" , "#ae833a" , "#896149" , "#4d7fff"];
    
            this.bar = {
                width  : 25,
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
                    var cl  = c[ i ];
                    if( !_.isArray( cl ) ){
                        cl  = [ cl ];
                    }
                    style = cl[ v ];
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
                // console.log(data)
                _.deepExtend(this , opt);
                if( data.length == 0 ){
                    return;
                };
    
                this.data = data; 
                var me    = this;
                var groups= data.length; 
                _.each( data , function( h_group , i){
                    /*
                    //h_group为横向的分组。如果yAxis.field = ["uv","pv"]的话，
                    //h_group就会为两组，一组代表uv 一组代表pv。
                    var spg = new Canvax.Display.Sprite({ id : "barGroup"+i });
                    */

                    //vLen 为一单元bar上面纵向堆叠的length
                    //比如yAxis.field = [
                    //    ["uv","pv"],  vLen == 2
                    //    "click"       vLen == 1
                    //]
                    var vLen   = h_group.length;
                    if( vLen == 0 ) return;
                    var hLen   = h_group[0].length;

                    for( h = 0 ; h < hLen ; h++ ){
                        var groupH;
                        if( i == 0 ){
                            //横向的分组
                            groupH = new Canvax.Display.Sprite({ id : "barGroup_" + h });
                            me.sprite.addChild(groupH);
                        
                            //横向的分组区片感应区
                            var itemW = me.w / hLen;
                            var hoverRect = new Rect({
                                id      : "bhr_"+h,
                                pointChkPriority : false,
                                context : {
                                    x           : itemW * h,
                                    y           : -me.h,
                                    width       : itemW,
                                    height      : me.h,
                                    fillStyle   : "#ccc",
                                    globalAlpha : 0
                                }
                            });
                            groupH.addChild( hoverRect );
                            hoverRect.hover(function(e){
                                this.context.globalAlpha = 0.1;
                            } , function(e){
                                this.context.globalAlpha = 0;
                            });
                            hoverRect.iGroup = h, hoverRect.iNode = -1, hoverRect.iLay = -1;
                            hoverRect.on("panstart mouseover mousemove mouseout", function(e){
                                e.tipsInfo = me._getInfoHandler( this , e );
                                me._fireHandler(e);
                            });  
                            
                        } else {
                            groupH = me.sprite.getChildById("barGroup_"+h)
                        };

                        for( v = 0 ; v < vLen ; v++ ){
                            //单个的bar，从纵向的底部开始堆叠矩形
                            var rectData = h_group[v][h];
                            rectData.iGroup = h, rectData.iNode = i, rectData.iLay = v
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
                            if( !!me.bar.radius ){
                                var radiusR   = Math.min( me.bar.width/2 , rectH );
                                radiusR = Math.min( radiusR , me.bar.radius );
                                rectCxt.radius = [radiusR , radiusR, 0 , 0];
                                if( v > 0 ){
                                    rectCxt.radius = [radiusR];
                                }
                            };
                            var rectEl   = new Rect({
                                context  : rectCxt
                            });
                            
                            groupH.addChild( rectEl );

                            //目前，只有再非堆叠柱状图的情况下才有柱子顶部的txt
                            if( vLen == 1 ){
                                //文字
                                var content = rectData.value
                                if( _.isFunction(me.text.format) ){
                                    content = me.text.format( content );
                                }else{
                                    content = Tools.numAddSymbol(content);
                                }
                                var txt = new Canvax.Display.Text( content ,
                                   {
                                    context : {
                                        fillStyle    : me.text.fillStyle,
                                        fontSize     : me.text.fontSize,
                                        textAlign    : me.text.textAlign
                                   }
                                });
                                txt.context.x = rectData.x - txt.getTextWidth() / 2;
                                txt.context.y = rectCxt.y - txt.getTextHeight();
                                if( txt.context.y + me.h < 0 ){
                                    txt.context.y = -me.h;
                                }
                                me.txtsSp.addChild(txt)
                            }
                        };

                        //支柱感应区
                        if(vLen > 0){
                            var rectCxt = {
                                x        : rectEl.context.x,
                                y        : -parseInt(Math.abs(rectData.y)),
                                width    : rectEl.context.width,
                                height   : parseInt(Math.abs(rectData.y)),
                                fillStyle: '#ff0000',
                                globalAlpha : 0
                            }

                            var hoverRect= new Rect({
                                id : "hbar_bigg_"+i+"smallg_"+h,
                                context  : rectCxt
                            });

                            groupH.addChild( hoverRect );
                            hoverRect.iGroup = h, hoverRect.iNode = i, hoverRect.iLay = -1
                            hoverRect.on("panstart mouseover mousemove mouseout", function(e){
                                e.tipsInfo = me._getInfoHandler( this , e );
                                me._fireHandler(e);
                                if( e.type == "mouseover" ){
                                    this.parent.getChildById("bhr_"+this.iGroup).context.globalAlpha = 0.1;
                                } 
                                if( e.type == "mouseout" ){
                                    this.parent.getChildById("bhr_"+this.iGroup).context.globalAlpha = 0;
                                }
                            })
                        }
                    }
                } );

                if( this.txtsSp.children.length > 0 ){
                    this.sprite.addChild(this.txtsSp);
                };
    
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
            _getInfoHandler:function( target ){
                // console.log(e.target.iLay)
                var node = {
                    iGroup        : target.iGroup,
                    iNode         : target.iNode,
                    iLay          : target.iLay,
                    nodesInfoList : this._getNodeInfo(target.iGroup, target.iNode, target.iLay)
                };
                return node
            },
            _getNodeInfo : function(iGroup, iNode, iLay){
                var arr = [];
                var me  = this;
                // console.log('===========================')
                // console.log(iGroup, iNode, iLay)
                var groups = me.data.length; 
                _.each(me.data , function( h_group , i){
                    var node
                    var vLen   = h_group.length;
                    if( vLen == 0 ) return;
                    var hLen   = h_group[0].length;
                    for( h = 0 ; h < hLen ; h++ ){
                        if(h == iGroup){
                            for( v = 0 ; v < vLen ; v++ ){
                                if(iNode == i || iNode == -1){
                                    // console.log(i, v, h)
                                    node = h_group[v][h]
                                    node.fillStyle = me._getColor( me.bar.fillStyle ,groups, vLen , i , h , v , node.value );
                                    // node.
                                    arr.push(node)
                                }
                            }
                        }
                    }
                })
                return arr;
            },
            _fireHandler:function(e){
                e.params  = {
                    iGroup : e.tipsInfo.iGroup,
                    iNode  : e.tipsInfo.iNode,
                    iLay   : e.tipsInfo.iLay
                }
                this.root.fire( e.type , e );
            }
        }; 
    
        return Graphs;
    } 
)
