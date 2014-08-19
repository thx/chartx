KISSY.add(function( S , Chart ,Sector ){
   var Canvax  = Chart.Canvax;

   return Chart.extend({
       config : {
           secW: 10,
           bColor: '#E6E6E6',
           pColor: '#8d76c4'
       },
       init : function( el , opt ){
           this._initConfig( opt );
           this.r = Math.min( this.width , this.height ) / 2;
       },
       _initConfig : function( opt ){
           _.extend( this.config , opt );
       },
       draw : function( opt ){
           this._initConfig( opt );
           this.stage.addChild( new Sector({
              context : {
                   x : this.height / 2,
                   y : this.width / 2,

                   r : this.r,
                   r0: this.r - this.config.secW,
                   startAngle : 0 ,
                   endAngle   : 359.999,
                   fillStyle  : this.config.bColor,
                   lineJoin   : "round"
                 }
           }) );

           this.stage.addChild( new Sector({
              id : "speed",
              context : {
                   x : this.height / 2,
                   y : this.width / 2,

                   r : this.r,
                   r0: this.r - this.config.secW,
                   startAngle : 0 ,
                   endAngle   : 1 ,
                   fillStyle  : this.config.pColor,
                   lineJoin   : "round"
                 }
           }) );
       },
       setSpeed : function( s ){
          this.stage.getChildById("speed").context.endAngle = s
       }
   });

} , {
   requires : [
     "dvix/chart/",
     "canvax/shape/Sector"
   ]
})
