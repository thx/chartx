/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 模拟as3 DisplayList 中的shape 类
 */



define(
    "canvax/display/Shape",
    [
        "canvax/display/DisplayObject",
        "canvax/core/Base"
    ],
    function( DisplayObject , Base  ){

        var Shape = function(opt){
            
            var self = this;
            //元素是否有hover事件 和 chick事件，由addEvenetLister和remiveEventLister来触发修改
            self._hoverable  = false;
            self._clickable  = false;
     
            //over的时候如果有修改样式，就为true
            self._hoverClass = false;
            self.hoverClone  = true;    //是否开启在hover的时候clone一份到active stage 中 
            self.pointChkPriority = true; //在鼠标mouseover到该节点，然后mousemove的时候，是否优先检测该节点
     
            //拖拽drag的时候显示在activShape的副本
            self._dragDuplicate = null;
     
            //元素是否 开启 drag 拖动，这个有用户设置传入
            //self.draggable = opt.draggable || false;
     
            self.type = self.type || "shape" ;
            opt.draw && (self.draw=opt.draw);
            
            //处理所有的图形一些共有的属性配置
            self.initCompProperty(opt);

            arguments.callee.superclass.constructor.apply(this , arguments);
            self._rect = null;
        };
     
        Base.creatClass(Shape , DisplayObject , {
           init : function(){
           },
           initCompProperty : function( opt ){
               for( var i in opt ){
                   if( i != "id" && i != "context"){
                       this[i] = opt[i];
                   }
               }
           },
           /*
            *下面两个方法为提供给 具体的 图形类覆盖实现，本shape类不提供具体实现
            *draw() 绘制   and   setRect()获取该类的矩形边界
           */
           draw:function(){
           
           },
           drawEnd : function(ctx){
               if(this._hasFillAndStroke){
                   //如果在子shape类里面已经实现stroke fill 等操作， 就不需要统一的d
                   return;
               }
     
               //style 要从diaplayObject的 context上面去取
               var style = this.context;
         
               //fill stroke 之前， 就应该要closepath 否则线条转角口会有缺口。
               //drawTypeOnly 由继承shape的具体绘制类提供
               if ( this._drawTypeOnly != "stroke" && this.type != "path"){
                   ctx.closePath();
               }
     
               if ( style.strokeStyle && style.lineWidth ){
                   ctx.stroke();
               }
               //比如贝塞尔曲线画的线,drawTypeOnly==stroke，是不能使用fill的，后果很严重
               if (style.fillStyle && this._drawTypeOnly!="stroke"){
                   ctx.fill();
               }
               
           },
     
     
           render : function(){
              var ctx  = this.getStage().context2D;
              
              if (this.context.type == "shape"){
                  //type == shape的时候，自定义绘画
                  //这个时候就可以使用self.graphics绘图接口了，该接口模拟的是as3的接口
                  this.draw.apply( this );
              } else {
                  //这个时候，说明该shape是调用已经绘制好的 shape 模块，这些模块全部在../shape目录下面
                  if( this.draw ){
                      ctx.beginPath();
                      this.draw( ctx , this.context );
                      this.drawEnd( ctx );
                  }
              }
           }
           ,
           /*
            * 画虚线
            */
           dashedLineTo:function(ctx, x1, y1, x2, y2, dashLength) {
                 dashLength = typeof dashLength == 'undefined'
                              ? 3 : dashLength;
                 dashLength = Math.max( dashLength , this.context.lineWidth );
                 var deltaX = x2 - x1;
                 var deltaY = y2 - y1;
                 var numDashes = Math.floor(
                     Math.sqrt(deltaX * deltaX + deltaY * deltaY) / dashLength
                 );
                 for (var i = 0; i < numDashes; ++i) {
                     var x = parseInt(x1 + (deltaX / numDashes) * i);
                     var y = parseInt(y1 + (deltaY / numDashes) * i);
                     ctx[i % 2 === 0 ? 'moveTo' : 'lineTo']( x , y );
                     if( i == (numDashes-1) && i%2 === 0){
                         ctx.lineTo( x2 , y2 );
                     }
                 }
           },
           /*
            *从cpl节点中获取到4个方向的边界节点
            *@param  context 
            *
            **/
           getRectFormPointList : function( context ){
               var minX =  Number.MAX_VALUE;
               var maxX =  Number.MIN_VALUE;
               var minY =  Number.MAX_VALUE;
               var maxY =  Number.MIN_VALUE;
      
               var cpl = context.pointList; //this.getcpl();
               for(var i = 0, l = cpl.length; i < l; i++) {
                   if (cpl[i][0] < minX) {
                       minX = cpl[i][0];
                   }
                   if (cpl[i][0] > maxX) {
                       maxX = cpl[i][0];
                   }
                   if (cpl[i][1] < minY) {
                       minY = cpl[i][1];
                   }
                   if (cpl[i][1] > maxY) {
                       maxY = cpl[i][1];
                   }
               }
     
               var lineWidth;
               if (context.strokeStyle || context.fillStyle  ) {
                   lineWidth = context.lineWidth || 1;
               } else {
                   lineWidth = 0;
               }
               return {
                   x      : Math.round(minX - lineWidth / 2),
                   y      : Math.round(minY - lineWidth / 2),
                   width  : maxX - minX + lineWidth,
                   height : maxY - minY + lineWidth
               };
           }
        });
     
        return Shape;
     
     }
)
