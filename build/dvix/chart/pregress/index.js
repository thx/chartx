KISSY.add("dvix/chart/pregress/index" , function( S , Dvix ){
   var Canvax  = Dvix.Canvax;
   var preGress = function( el , opt ){
       this.canvax = new Canvax( {
               el : el
       } );
       this.width  = parseInt( el.width() );
       this.height = parseInt( el.height());

       this.config = _.extend({
          ringWidth : 20,
          ringColor : '#8d76c4',
          bColor    : '#E6E6E6'
       }, opt );

       this.r = Math.min( this.width , this.height ) / 2;
   
       this.stage = new Canvax.Display.Stage();

       this.stage.addChild( new Canvax.Shapes.Sector({
          context : {
               x : this.height / 2,
               y : this.width / 2,

               r : this.r,
               r0: this.r - this.config.ringWidth,
               startAngle : 0 ,
               endAngle   : 360,
               fillStyle  : this.config.bColor,
               lineJoin   : "round"
             }
       }) );

       this.stage.addChild( new Canvax.Shapes.Sector({
          id : "rate",
          context : {
               x : this.height / 2,
               y : this.width / 2,

               r : this.r,
               r0: this.r - this.config.ringWidth,
               startAngle : 0 ,
               endAngle   : 0 ,
               fillStyle  : this.config.ringColor,
               lineJoin   : "round"
             }
       }) );

   };

   preGress.prototype = {
       draw : function( opt ){
          this.canvax.addChild( this.stage );
       },
       setRate : function( s ){
          this.stage.getChildById("rate").context.endAngle = s
       }
   };

   return preGress;

} , {
   requires : [
     "dvix/"
   ]
})
