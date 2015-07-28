define(
    "chartx/chart/scat/graphs",
    [
        "canvax/index",
        "canvax/shape/Circle",
        "canvax/shape/Rect",
        "canvax/animation/Tween"
    ],
    function( Canvax , Circle , Rect , Tween ){
 
        var Graphs = function( opt , data ){
            this.w = 0;
            this.h = 0;
           
            this.pos = {
                x : 0,
                y : 0
            };

            this.circle = {
                r : 12  //圆圈默认半径
            }
    
            this._colors = ["#6f8cb2" , "#c77029" , "#f15f60" , "#ecb44f" , "#ae833a" , "#896149"];
            
            this.sprite = null;
    
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
                var self = this;
                _.deepExtend(this , opt);
                if( data.length == 0 ){
                    return;
                };
                self.data = data;

                this.induce = new Rect({
                    id    : "induce",
                    context:{
                        y           : -this.h,
                        width       : this.w,
                        height      : this.h,
                        fillStyle   : '#000000',
                        globalAlpha : 0,
                        cursor      : 'pointer'
                    }
                });

                this.sprite.addChild(this.induce);

                this.induce.on("panstart mouseover", function(e){
                    e.tipsInfo = null;
                });
                this.induce.on("panmove mousemove", function(e){
                    e.tipsInfo = null;
                });

    
                //这个分组是只x方向的一维分组
                var barGroupLen = data[0].length;
   
                for( var i = 0 ; i < barGroupLen ; i++ ){
                    var sprite = new Canvax.Display.Sprite({ id : "barGroup"+i });
                    for( var ii = 0 , iil = data.length ; ii < iil ; ii++ ){
                        var barData = data[ii][i];
    
                        var circle = new Circle({
                            hoverClone : false,
                            context : {
                                x           : barData.x,
                                y           : barData.y,
                                fillStyle   : this.getFillStyle( i , ii , barData.value ),
                                r           : this.circle.r,
                                globalAlpha : 0,
                                cursor      : "pointer"
                            }
                        });
                        sprite.addChild( circle );

                        circle.iGroup = ii;
                        circle.iNode  = i;

                        circle.on("panstart mouseover", function(e){
                            e.tipsInfo = self._getInfoHandler(e);
                            this.context.globalAlpha = 0.9;
                            this.context.r ++;
                        });
                        circle.on("panmove mousemove", function(e){
                            e.tipsInfo = self._getInfoHandler(e);
                            
                        });
                        circle.on("panend mouseout", function(e){
                            e.tipsInfo = {};
                            this.context.globalAlpha = 0.8;
                            this.context.r --;
                        });
                        circle.on("tap click", function(e){
                            e.tipsInfo = self._getInfoHandler(e);
                        });

                        this._circles.push( circle );
                    }
                    this.sprite.addChild( sprite );
                };
    
                this.setX( this.pos.x );
                this.setY( this.pos.y );
            },
            _getInfoHandler : function(e){
                var target = e.target;
                var node = {
                    iGroup        : target.iGroup,
                    iNode         : target.iNode,
                    nodesInfoList : this._getNodeInfo(target.iGroup, target.iNode)
                };
                return node
            },
            _getNodeInfo : function( iGroup , iNode ){
                var arr  = [];
                arr.push( this.data[iGroup][iNode] );
                return arr;
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
                           self._circles[i].context.globalAlpha = this.h / 100 * 0.8;
                           self._circles[i].context.r = this.h / 100 * self.circle.r;
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
);
