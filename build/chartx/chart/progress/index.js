define(
    "chartx/chart/progress/index",
    [
        "chartx/chart/index",
        "canvax/shape/Sector"
    ],
    function( Chart ,Sector ){
     
        return Chart.extend({
            init : function( el ,  data , opt ){

                this.secW   = 10,
                this.bColor = '#E6E6E6',
                this.pColor = '#8d76c4'

                _.extend( this , opt );
                this.r = Math.min( this.width , this.height ) / 2;
            },
            _initoptions : function( opt ){
            },
            draw : function( opt ){
                this._initoptions( opt );
                this.stage.addChild( new Sector({
                   context : {
                        x : parseInt(this.height / 2),
                        y : parseInt(this.width / 2),
     
                        r : this.r,
                        r0: this.r - this.secW,
                        startAngle : 0 ,
                        endAngle   : 360,
                        fillStyle  : this.bColor,
                        lineJoin   : "round"
                      }
                }) );
     
                this.stage.addChild( new Sector({
                   id : "speed",
                   context : {
                        x : parseInt(this.height / 2),
                        y : parseInt(this.width / 2),
     
                        r : this.r,
                        r0: this.r - this.secW,
                        startAngle : 0 ,
                        endAngle   : 1 ,
                        fillStyle  : this.pColor,
                        lineJoin   : "round"
                      }
                }) );
            },
            setSpeed : function( s ){
               this.stage.getChildById("speed").context.endAngle = s
            }
        });
     
    }
)
