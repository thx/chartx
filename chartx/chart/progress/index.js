define(
    "chartx/chart/progress/index",
    [
        "canvax/index",
        "chartx/chart/index",
        "canvax/shape/Sector",
        "canvax/shape/Circle",
        "canvax/animation/Tween"
    ],
    function( Canvax , Chart ,Sector , Circle , Tween ){
     
        return Chart.extend({
            init : function( el ,  data , opts ){

                this.barWidth    = 10;
                this.axisWidth   = null;//背景轴的width，默认等于barWidth
                this.normalColor = '#E6E6E6';
                this.progColor   = '#8d76c4';
                this.startAngle  = -90;
                this.angleCount    = 360;
                this.currRatio   = 0; //当前比率

                //进度文字
                this.text        = {
                    enabled   : 1,
                    fillStyle : "#666",
                    format    : null,
                    fontSize  : 30
                };

                _.deepExtend( this , opts );

                !this.axisWidth && ( this.axisWidth = this.barWidth )

                !this.r && (this.r = Math.min( this.width , this.height ) / 2);

                this.tween = null;
            },
            draw : function( opt ){

                var br  = this.r - ( this.barWidth - this.axisWidth )/2;
                var br0 = this.r - this.axisWidth - ( this.barWidth - this.axisWidth )/2
                this.stage.addChild( this._getCircle( this.startAngle , this.r - this.barWidth/2 , this.axisWidth/2 , this.normalColor ) );
                this.stage.addChild( this._getCircle( this.startAngle + this.angleCount , this.r - this.barWidth/2 , this.axisWidth/2 , this.normalColor ) );
                this.stage.addChild( new Sector({
                   context : {
                        x  : this.width / 2,
                        y  : this.height / 2,
     
                        r  : br,
                        r0 : br0,
                        startAngle : this.startAngle ,
                        endAngle   : this.startAngle + this.angleCount,
                        fillStyle  : this.normalColor,
                        lineJoin   : "round"
                      }
                }) );


     
                this._circle = this._getCircle( this.startAngle , this.r-this.barWidth/2 , this.barWidth/2 , this.progColor );
                this.stage.addChild( this._circle );
                this.stage.addChild( this._circle.clone() );
                this.stage.addChild( new Sector({
                   id : "speed",
                   context : {
                        x  : this.width  / 2,
                        y  : this.height / 2,
                        r  : this.r,
                        r0 : this.r - this.barWidth,
                        startAngle : this.startAngle ,
                        endAngle   : this.startAngle ,
                        fillStyle  : this.progColor,
                        lineJoin   : "round"
                      }
                }) );

                if( this.text.enabled ){
                    var content = this.currRatio + "%";
                    if( _.isFunction( this.text.format ) ){
                        content = this.text.format( this.currRatio );
                    }
                    this.stage.addChild( new Canvax.Display.Text(content,
                        {
                            id  : "ratioText",
                            context : {
                                x  : this.width  / 2,
                                y  : this.height / 2,
                                fillStyle   : this.text.fillStyle,
                                fontSize    : this.text.fontSize,
                                textAlign   : "center",
                                textBaseline: "middle"
                            }
                  	    })
                    )
                }
            },
            _getCircle : function( angle , r , cr , fillStyle){
                var radian = Math.PI / 180 * angle;
                var c = new Circle({
                    xyToInt : false,
                    context : {
                        x   : Math.cos( radian ) * r + this.width  / 2,
                        y   : Math.sin( radian ) * r + this.height / 2,
                        r   : cr,
                        fillStyle : fillStyle
                    }
                });
                return c;
            },
            _resetCirclePos : function( angle , r  ){
                var radian = Math.PI / 180 * angle;
                var r      = this.r-this.barWidth/2;
                var x      = Math.cos( radian ) * r + this.width  / 2;
                var y      = Math.sin( radian ) * r + this.height / 2;
                this._circle.context.x = x;
                this._circle.context.y = y;
            },
            //设置比例0-100
            _setRatio : function( s ){
                var currAngle = s / 100 * this.angleCount + this.startAngle;
                this.stage.getChildById("speed").context.endAngle = currAngle;
                this._resetCirclePos( currAngle );
            },
            setRatio  : function( s ){
                var self  = this;
                var timer = null;
                var times = 700 * Math.abs(s - self.currRatio) / 100;
                var growAnima = function(){
                   self.tween = new Tween.Tween( { r : self.currRatio } )
                   .to( { r : s } , times )
                   .easing( Tween.Easing.Quadratic.Out )
                   .onUpdate( function (  ) {
                       
                       self._setRatio( this.r );
                       self.currRatio = this.r;

                       self.fire("ratioChange" , { currRatio : this.r } );

                       var txt = parseInt( this.r ) + "%";
                       if( _.isFunction( self.text.format ) ){
                           txt = self.text.format( this.r );
                       }
                       if(self.text.enabled){
                           self.stage.getChildById("ratioText").resetText( txt );
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
        });
     
    }
)
