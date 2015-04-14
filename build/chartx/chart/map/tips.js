define(
    "chartx/chart/map/tips",
    [
        "canvax/index",
        "canvax/shape/Circle",
        "chartx/components/tips/tip",
        "canvax/shape/Polygon",
        "canvax/animation/Tween"
    ],
    function( Canvax , Circle , Tip , Polygon , Tween ){
        var Tips = function( opt , data , tipDomContainer ){
            this.sprite      = null;

            this._triangle   = null;
            this._tip        = null;
            this.prefix      = [];

            this._mapScale       = 1;

            this.cPointStyle = "white";

            this._nearestPoint= null;
            this._thirdPoint  = null;
            this._tween       = null;

            this.init(opt , data , tipDomContainer);
        };

        Tips.prototype = {
            init : function(opt , data , tipDomContainer){
                
                _.deepExtend(this , opt);
                this.sprite = new Canvax.Display.Sprite({
                    id : "map-tips"
                });
    
                opt = _.deepExtend({
                    //prefix  : data.field
                    //content : "中国地图"
                    //重置tips的默认内容函数
                    _getDefaultContent : function( info ){
                        
                        var str  = "<table>";
                        var self = this;
                        str +=     "<tr style='color:#999'><td colspan='2'>"+info.area.value+"</td></tr>"
                        _.each( info.nodesInfoList , function( node , i ){
                            str+= "<tr style='color:#999'>";
                            var prefixName = self.prefix[i];
                            if( !prefixName ) {
                                prefixName = node.field
                            }
                            str += "<td>"+ prefixName +"：</td>";
                            str += "<td>"+ node.value +"</td></tr>";
                        });
                        str+="</table>";
                        return str;
                    }
                } , opt);

                this._tip = new Tip( _.deepExtend( {
                    alpha       : 1,
                    fillStyle   : "#ffffff",
                    strokeStyle : "#b0b0b0"
                } , opt ) , tipDomContainer );
            },
            show : function(e , mapData){
                this.sprite.addChild( this._tip.sprite );
                this._tip.show(e);
                this._weight(e);
                this._tip.sprite.toFront();
                this.sprite.toFront();
                this._triangle.context.globalAlpha = 0.7;
            },
            move : function(e){
                this._tip.move(e);
            },
            hide : function(e){
                this._tip.hide(e);
                this._cPoint   && this._cPoint.remove();
                this._triangle && (this._triangle.context.globalAlpha = 0);
            },
            _weight : function(e){
                var br = this._tip.backR;
                //cp -- > textX , textY
                var targetOffSet = e.target.localToGlobal();
                var cPoint = [ 
                    e.target.mapData.textX * this._mapScale + targetOffSet.x, 
                    e.target.mapData.textY * this._mapScale + targetOffSet.y
                ];
                this._cPoint = new Circle({
                    context : {
                        x : cPoint[0],
                        y : cPoint[1],
                        r : 3,
                        fillStyle : this.cPointStyle
                    }
                });
                this.sprite.addChild( this._cPoint );


                var tp = "left"
                if( cPoint[0] < this._mapScale * 560 / 2 ){
                    tp = "right";
                }
        
                //最靠近cPoint的 一个 背景三角形的 校准点到cPoint的距离
                var mr = 80;

                //先计算出来最靠近cPoint 的 校准点
                var nearestPoint = [
                    cPoint[0] + Math.cos(-Math.PI*(tp=="left" ? 3 : 2)/5) * mr,
                    cPoint[1] + Math.sin(-Math.PI*(tp=="left" ? 3 : 2)/5) * mr
                ];
                
                if( nearestPoint[1] < 0 ){
                    nearestPoint[1] = 2;
                }

                //先得到tip的高宽，来计算第二个点
                var tipW = this._tip.dW;
                var tipH = this._tip.dH;

                var thirdPoint = [
                    nearestPoint[0] + (tp=="left" ? -tipW : tipW ), // - tipW,
                    nearestPoint[1] + tipH 
                ];

                if( this._thirdPoint && this._nearestPoint ){
                   
                    //如果两个点已经有记录，就要做动画效果
                    var me = this;
                    var timer = null;
                    if(me._tween){
                        me._tween.stop();
                    }
                    var Anima = function(){
                        me._tween = new Tween.Tween( {
                                n0 : me._nearestPoint[0], 
                                n1 : me._nearestPoint[1]
                            } )
                            .to( { 
                                n0 : nearestPoint[0], 
                                n1 : nearestPoint[1]
                            }, 500 )
                            .easing(Tween.Easing.Exponential.Out)
                            .onUpdate( function (  ) {
                                me._nearestPoint[0] = this.n0;
                                me._nearestPoint[1] = this.n1;
                                me._thirdPoint[0] = this.n0 + (tp=="left" ? -tipW : tipW );
                                me._thirdPoint[1] = this.n1 + tipH;
                                
                                var n_p = me._nearestPoint;
                                var t_p = me._thirdPoint;
                                me._triangle.context.pointList = [
                                    cPoint ,
                                    [ n_p[0]    , n_p[1]+br ] ,
                                    [ t_p[0]+(tp=="left" ? br : -br) , t_p[1] ]
                                ];

                                //然后吧tip移动到对应的 计算出来的两个点上面
                                var _tipPos = me.sprite.localToGlobal({
                                    x : tp=="left" ? me._thirdPoint[0] : me._nearestPoint[0],
                                    y : me._nearestPoint[1]
                                });

                                me._tip.setPosition({
                                    pos : _tipPos
                                });
                            } ).onComplete( function(){
                                cancelAnimationFrame( timer );
                                me._tween = null;
                            }).start();
                        animate();
                    };
                    function animate(){
                        timer    = requestAnimationFrame( animate ); 
                        Tween.update();
                    };
                    Anima();
                } else {
                    var n_p = nearestPoint;
                    var t_p = thirdPoint;
                    this._triangle = new Polygon({
                        context : {
                            pointList   : [
                                cPoint , 
                                [ n_p[0]    , n_p[1]+br ] ,
                                [ t_p[0] + (tp=="left" ? br : -br) , t_p[1] ]
                            ],
                            fillStyle   : "white",
                            globalAlpha : 0.7
                        }
                    });
                    this.sprite.addChild( this._triangle );
                    this._thirdPoint   = thirdPoint;
                    this._nearestPoint = nearestPoint;

                    //然后吧tip移动到对应的 计算出来的两个点上面
                    var _tipPos = this.sprite.localToGlobal({
                        x : tp=="left" ? thirdPoint[0] : nearestPoint[0],
                        y : nearestPoint[1]
                    });

                    this._tip.setPosition({
                        pos : _tipPos
                    });
                };
            }
        };

        return Tips;
    }
)
