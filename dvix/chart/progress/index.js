KISSY.add(function( S , Chart ,Sector ){
   var Canvax  = Chart.Canvax;

   return Chart.extend({
       options : {
           secW: 10,
           bColor: '#E6E6E6',
           pColor: '#8d76c4'
       },
       init : function( el , opt ){
           this._initoptions( opt );
           this.r = Math.min( this.width , this.height ) / 2;
       },
       _initoptions : function( opt ){
           _.extend( this.options , opt );
       },
       draw : function( opt ){
           this._initoptions( opt );
           this.stage.addChild( new Sector({
              context : {
                   x : parseInt(this.height / 2),
                   y : parseInt(this.width / 2),

                   r : this.r,
                   r0: this.r - this.options.secW,
                   startAngle : 0 ,
                   endAngle   : 360,
                   fillStyle  : this.options.bColor,
                   lineJoin   : "round"
                 }
           }) );

           this.stage.addChild( new Sector({
              id : "speed",
              context : {
                   x : parseInt(this.height / 2),
                   y : parseInt(this.width / 2),

                   r : this.r,
                   r0: this.r - this.options.secW,
                   startAngle : 0 ,
                   endAngle   : 1 ,
                   fillStyle  : this.options.pColor,
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
