/**
 * 在无线直通车试用的充值进度条
 **/
KISSY.add(function( S , Chart , Sector , Circle , Line , Rect , Tween ){
   var Canvax  = Chart.Canvax;
   var animate  = function(){
        timer   = requestAnimationFrame( animate ); 
        Tween.update();
        return timer;
   };

   return Chart.extend({
       init : function( el , opt ){
           this.r = Math.min( this.width , this.height ) / 2;
           this._beginAngle = 270;
           this.config = {
               ringWidth : 50,
               ringColor : '#f59622',
               bColor    : '#3c3c3c',
               btnColor  : 'white',
               crossLineColor : '#666666',
               rate      : 0  // 0 - 100
           }

           opt && _.deepExtend( this.config , opt );

           this.stage.addChild( new Sector({
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

           this.stage.addChild( new Sector({
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

           var btn = new Circle({
               id : "btn",
               context : {
                   x : this.width/2,
                   y : this.height/2,
                   r : this.r - this.config.ringWidth,
                   fillStyle : this.config.btnColor
               }
           });

           
           //添加十字的图形
           var spW  = btn.context.r * 3 / 4 * 2;
           var spH  = btn.context.r * 3 / 4 * 2;
           window.addBtnSp = new Canvax.Display.Sprite({
               id      : "cross",
               context : {
                   x   : (btn.context.x - spW / 2) ,
                   y   : (btn.context.y - spH / 2) ,
                   width : spW,
                   height: spH,
                   scaleOrigin : {
                       x : spW / 2,
                       y : spH / 2
                   },
                   rotateOrigin : {
                       x : spW / 2,
                       y : spH / 2
                   }
                }
           });
           addBtnSp.addChild(new Line({
               context : {
                   xStart : 0,
                   yStart : addBtnSp.context.height / 2,
                   xEnd : addBtnSp.context.width,
                   yEnd : addBtnSp.context.height / 2,
                   lineWidth : 1,
                   strokeStyle : this.config.crossLineColor
               }
           }));

           addBtnSp.addChild(new Line({
               context : {
                   xStart : addBtnSp.context.width / 2,
                   yStart : 0,
                   xEnd : addBtnSp.context.width / 2,
                   yEnd : addBtnSp.context.height,
                   lineWidth : 1,
                   strokeStyle : this.config.crossLineColor
               }
           }));

           var crossRectWidth = 6;
           var rw = (addBtnSp.context.width - crossRectWidth) / 2;
           var rh = (addBtnSp.context.height - crossRectWidth)/ 2;
           addBtnSp.addChild(new Rect({
               context : {
                   x   :  rw ,
                   y   :  rh ,
                   width : crossRectWidth,
                   height: crossRectWidth,
                   rotation : 45,
                   rotateOrigin : {
                      x : crossRectWidth / 2,
                      y : crossRectWidth / 2
                   },
                   fillStyle : this.config.crossLineColor
           
               }
           }));
           //添加十字的图形结束

           var self = this;
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
           this.stage.addChild( addBtnSp );

           if( this.config.rate > 0 ){
               this.setRate( this.config.rate , true );
           };

       },
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

               new Tween.Tween( angBegin )
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
           var cross = this.stage.getChildById("cross");
           cross.context.visible = false; //把加号隐藏

           var btn   = this.stage.getChildById("btn");
          
           new Tween.Tween( { ringWidth : this.config.ringWidth } )
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

           new Tween.Tween( { num : 0 } )
               .to( { num : num }, 300 )
               .onUpdate( function () {
                    text.resetText( parseInt(this.num).toString() );
                    text_float.resetText( "." + this.num.toFixed(2).toString().split(".")[1] + "%" );
               } ).start(); 
           animate();

       },
       releaseHand : function( e ){
           Tween.removeAll();
           this.stage.getChildById("holdTextSp").destroy();

           var self = this;
           if( e.target.id == "rate" ){
               
           }
           var btn = this.stage.getChildById("btn");
           var cross = this.stage.getChildById("cross");
           cross.context.visible = true; //把加号隐藏
           cross.context.globalAlpha    = 0;
          
           new Tween.Tween( { ringWidth : ( this.r - btn.context.r ) ,  rotation : 0 , globalAlpha : 0 } )
               .to( { ringWidth : this.config.ringWidth , rotation : 360 , globalAlpha : 1 }, 500 )
               .onUpdate( function () {
                   btn.context.r             = self.r - this.ringWidth;
                   cross.context.rotation    = this.rotation;
                   cross.context.globalAlpha = this.globalAlpha;
               } ).start(); 
       }

   });

} , {
   requires : [
     "dvix/chart/",
     "canvax/shape/Sector",
     "canvax/shape/Circle",
     "canvax/shape/Line",
     "canvax/shape/Rect",
     "canvax/animation/Tween",
     "dvix/utils/deep-extend"
   ]
})


