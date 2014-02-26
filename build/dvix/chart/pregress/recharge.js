KISSY.add("dvix/chart/pregress/recharge" , function( S , Chart ){
   var Canvax  = Chart.Canvax;
   var animate  = function(){
        timer   = requestAnimationFrame( animate ); 
        Canvax.Animation.update();
        return timer;
   };

   var Recharge = function( el , opt ){
       var self = this;
       this.canvax = new Canvax( {
               el : el
       } );
       this.width  = parseInt( el.width() );
       this.height = parseInt( el.height());
       this.r = Math.min( this.width , this.height ) / 2;

       this._beginAngle = 270;

       this.config = _.extend({
          ringWidth : 50,
          ringColor : '#f59622',
          bColor    : '#3c3c3c',
          btnColor  : 'white',
          rate      : 0 , // 0 - 100
       }, opt );
   
       this.stage = new Canvax.Display.Stage();

       this.stage.addChild( new Canvax.Shapes.Sector({
          id      : "bg",
          context : {
               x : this.width / 2,
               y : this.height / 2,

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
               x : this.width / 2,
               y : this.height / 2,

               r : this.r,
               r0: this.r - this.config.ringWidth,
               startAngle : 0,
               endAngle   : 0,
               fillStyle  : this.config.ringColor,
               lineJoin   : "round"
             }
       }) );

       var btn = new Canvax.Shapes.Circle({
           id : "btn",
           context : {
               x : this.width/2,
               y : this.height/2,
               r : this.r - this.config.ringWidth,
               fillStyle : this.config.btnColor
           }
       });

       btn.on("tap" , function(){
           self.fire("recharge")
       });

       this.stage.getChildById("rate").on("touch" , function( e ){
           self.holdHand( e )
       }).on("release" , function( e ){
           self.releaseHand( e );
       });

       this.stage.getChildById("bg").on("touch" , function( e ){
           self.holdHand( e )
       }).on("release" , function( e ){
           self.releaseHand( e );
       });

       this.stage.addChild( btn );

       if( this.config.rate > 0 ){
           this.setRate( this.config.rate , true );
       };

       arguments.callee.superclass.constructor.apply(this, arguments);

   };

   
   Canvax.Base.creatClass( Recharge , Chart , {
       draw : function( opt ){
           this.canvax.addChild( this.stage );
       },
       setRate : function( r , notUseTween ){
           var rate = this.stage.getChildById("rate");
           this.config.rate = r > 100 ? 100 : r;
           var sA   = this._beginAngle + (180 - this.rateToAngle());
           var eA   = this._beginAngle - (180 - this.rateToAngle());
           if ( notUseTween ) {
               rate.context.startAngle = sA;
               rate.context.endAngle   = eA;
           } else {
               var angBegin = {
                   s : rate.context.startAngle,
                   e : rate.context.endAngle
               }

               new Canvax.Animation.Tween( angBegin )
                   .to( { s : sA , e : eA }, 700 )
                   .onUpdate( function () {
                     rate.context.startAngle = this.s;
                     rate.context.endAngle   = this.e;
                   } ).start(); 
               animate();
           }
       },
       rateToAngle : function(){
           return this.config.rate / 100 * 180
       },
       holdHand    : function( e ){
           var self  = this;
           var num   = 100 - this.config.rate;;
           var color = self.config.bColor;
           if( e.target.id == "rate" ){
               num   = this.config.rate;
               color = self.config.ringColor;
           } 
           var btn = this.stage.getChildById("btn");
          
           new Canvax.Animation.Tween( { ringWidth : this.config.ringWidth } )
               .to( { ringWidth : this.config.ringWidth * 3 / 4 }, 300 )
               .onUpdate( function () {
                   btn.context.r   = self.r - this.ringWidth
               } ).start();  

           var textSp = new Canvax.Display.Sprite({
               id      : "holdTextSp",
               context : {
                   x   : btn.context.x - btn.context.r,
                   y   : btn.context.y - btn.context.r,
                 width : btn.context.r,
                height : btn.context.r
               }
           });
           var text  = new Canvax.Display.Text("0" , {
               context : {
                     x            : btn.context.r,
                     y            : btn.context.r,
                     fillStyle    : color,
                     fontSize     : 25,
                     textAlign    : "right",
                     textBaseline : "middle"
               }
           } );

           var text_float  = new Canvax.Display.Text(".00%" , {
               context : {
                     x            : btn.context.r,
                     y            : btn.context.r + 3,
                     fillStyle    : color,
                     fontSize     : 15,
                     textAlign    : "left",
                     textBaseline : "middle"
               }
           } );
           textSp.addChild( text );
           textSp.addChild( text_float );
           this.stage.addChild( textSp );

           new Canvax.Animation.Tween( { num : 0 } )
               .to( { num : num }, 300 )
               .onUpdate( function () {
                    text.resetText( parseInt(this.num).toString() );
                    text_float.resetText( "." + this.num.toFixed(2).toString().split(".")[1] + "%" );
               } ).start(); 
           animate();

       },
       releaseHand : function( e ){
           Canvax.Animation.removeAll();
           this.stage.getChildById("holdTextSp").destroy();

           var self = this;
           if( e.target.id == "rate" ){
               
           }
           var btn = this.stage.getChildById("btn");
          
           new Canvax.Animation.Tween( { ringWidth : ( this.r - btn.context.r ) } )
               .to( { ringWidth : this.config.ringWidth }, 500 )
               .onUpdate( function () {
                   btn.context.r   = self.r - this.ringWidth
               } ).start(); 

       }
   } );


   return Recharge;

} , {
   requires : [
     "dvix/chart/"
   ]
})


