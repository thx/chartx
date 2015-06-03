define(
    "chartx/chart/progress/index",
    [
        "canvax/index",
        "chartx/chart/index",
        "canvax/shape/Sector",
        "canvax/animation/Tween"
    ],
    function( Canvax , Chart ,Sector , Tween ){
     
        return Chart.extend({
            init : function( el ,  data , opts ){

                this.barWidth    = 10,
                this.normalColor = '#E6E6E6',
                this.progColor   = '#8d76c4',
                this.startAngle  = -90;
                this.endAngle    = this.startAngle;
                this.currRatio   = 0; //当前比率

                //进度文字
                this.text        = {
                    enabled   : 1,
                    fillStyle : "#666",
                    format    : null,
                    fontSize  : 30
                }

                _.deepExtend( this , opts );

                !this.r && (this.r = Math.min( this.width , this.height ) / 2);

                this.tween = null;
            },
            draw : function( opt ){
                this.stage.addChild( new Sector({
                   context : {
                        x : parseInt(this.width  / 2),
                        y : parseInt(this.height / 2),
     
                        r : this.r,
                        r0: this.r - this.barWidth,
                        startAngle : this.startAngle ,
                        endAngle   : this.startAngle + 360,
                        fillStyle  : this.normalColor,
                        lineJoin   : "round"
                      }
                }) );
     
                this.stage.addChild( new Sector({
                   id : "speed",
                   context : {
                        x  : parseInt(this.width  / 2),
                        y  : parseInt(this.height / 2),
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
                                x  : parseInt(this.width  / 2),
                                y  : parseInt(this.height / 2),
                                fillStyle   : this.text.fillStyle,
                                fontSize    : this.text.fontSize,
                                textAlign   : "center",
                                textBaseline: "middle" 
                            }
                  	    })
                    )
                }
            },
            //设置比例0-100
            _setRatio : function( s ){
                this.stage.getChildById("speed").context.endAngle = s / 100 * 360 + this.startAngle;
            },
            setRatio  : function( s ){
                var self  = this;
                var timer = null;
                var growAnima = function(){
                   self.tween = new Tween.Tween( { r : self.currRatio } )
                   .to( { r : s } , 1100 )
                   .easing( Tween.Easing.Quintic.Out )
                   .onUpdate( function (  ) {
                       
                       self._setRatio( this.r );
                       self.currRatio = this.r;

                       self.fire("ratioChange" , { currRatio : this.r } );

                       var txt = parseInt( this.r ) + "%";
                       if( _.isFunction( self.text.format ) ){
                           txt = self.text.format( this.r );
                       }
                       self.stage.getChildById("ratioText").resetText( txt );

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
