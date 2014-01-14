KISSY.add("visualization/chart/uploading/" , function(S , Canvax){
   var loadIng = function( el ){
       this.canvax = new Canvax( {
               el : el
       } );
       this.secW   = 20;
       this.width  = parseInt( el.width() );
       this.height = parseInt( el.height());

       this.r = Math.min( this.width , this.height ) / 2;
       this.stage_bg = new Canvax.Display.Stage({
           context : {
               width  : this.width,
               height : this.height
           }
       });
       this.stage = new Canvax.Display.Stage({
           context : {
               width  : this.width,
               height : this.height
           }
       });

       this.stage_bg.addChild( new Canvax.Shapes.Sector({
          context : {
               x : this.height / 2,
               y : this.width / 2,

               r : this.r,
               r0: this.r - this.secW,
               startAngle : 0 ,
               endAngle   : 360,
               fillStyle  : "#E6E6E6",
               lineJoin   : "round"
             }
       }) );

       this.stage.addChild( new Canvax.Shapes.Sector({
          id : "speed",
          context : {
               x : this.height / 2,
               y : this.width / 2,

               r : this.r,
               r0: this.r - this.secW,
               startAngle : 0 ,
               endAngle   : 1 ,
               fillStyle  : "#DB7F9A",
               lineJoin   : "round"
             }
       }) );
   };

   loadIng.prototype = {
       draw : function( opt ){
          this.canvax.addChild( this.stage_bg );
          this.canvax.addChild( this.stage );
       },
       setSpeed : function( s ){
          this.stage.getChildById("speed").context.endAngle = s
       }
   };

   return loadIng;

} , {
   requires : [
     "canvax/"
   ]
})
