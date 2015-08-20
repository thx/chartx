define(
    "chartx/chart/scat/graphs",
    [
        "canvax/index",
        "canvax/shape/Circle",
        "canvax/shape/Rect",
        "canvax/animation/Tween"
    ],
    function( Canvax , Circle , Rect , Tween ){
 
        var Graphs = function( opt , zAxis ){
            this.zAxis = zAxis;
            this.w = 0;
            this.h = 0;
           
            this.pos = {
                x : 0,
                y : 0
            };

            this.circle = {
                maxR : 20,  //圆圈默认最大半径
                minR : 3,
                r : null,
                normalR : 10
            }
    
            this._colors = ["#6f8cb2" , "#c77029" , "#f15f60" , "#ecb44f" , "#ae833a" , "#896149"];
            
            this.sprite = null;
    
            this._circles = [];  //所有圆点的集合
    
            _.deepExtend(this , opt);
    
            this.init( );
    
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
            getR : function(d){
                var r = this.circle.r;
                if( _.isFunction(r) ){
                    return r(d)
                } else {
                    return r;
                };
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

                var zMax = 1;

                if( this.zAxis.field && this.zAxis.field.length > 0 ){
                    zMax = _.max( _.flatten(this.zAxis.org) );
                }

                for( var i = 0 ; i < barGroupLen ; i++ ){
                    var sprite = new Canvax.Display.Sprite({ id : "barGroup"+i });
                    for( var ii = 0 , iil = data.length ; ii < iil ; ii++ ){
                        var d = data[ii][i];
                        var zAxisV  = this.zAxis.org[ii] && this.zAxis.org[ii][i];
                        var r       = this.getR(d) ||
                                      (zAxisV ? Math.max(this.circle.maxR*(zAxisV/zMax) , this.circle.minR) : this.circle.normalR );
                        var circle = new Circle({
                            hoverClone : false,
                            context : {
                                x           : d.x,
                                y           : d.y,
                                fillStyle   : this.getFillStyle( i , ii , d.value ),
                                r           : r,
                                globalAlpha : 0,
                                cursor      : "pointer"
                            }
                        });
                        sprite.addChild( circle );

                        circle.iGroup = ii;
                        circle.iNode  = i;
                        circle.r      = r;

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
                           var _circle = self._circles[i];
                           _circle.context.globalAlpha = this.h / 100 * 0.8;
                           _circle.context.r = this.h / 100 * _circle.r;
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
