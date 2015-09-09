/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 模拟as3 中 的Bitmap类，目前还只是个简单的容易。
 */


define(
    "canvax/display/Bitmap",
    [
        "canvax/display/Shape",
        "canvax/core/Base"
    ],
    function(Shape , Base){
        var Bitmap = function(opt){
            var self = this;
            self.type = "bitmap";
      
            //TODO:这里不负责做img 的加载，所以这里的img是必须已经准备好了的img元素
            //如果img没准备好，会出现意想不到的错误，我不给你负责
            self.img  = opt.img || null; //bitmap的图片来源，可以是页面上面的img 也可以是某个canvas
      
            opt = Base.checkOpt( opt );
            self._context = {
                dx     : opt.context.dx, //图片切片的x位置
                dy     : opt.context.dy, //图片切片的y位置
                dWidth : opt.context.dWidth || 0, //切片的width
                dHeight: opt.context.dHeight|| 0  //切片的height
            }
      
            arguments.callee.superclass.constructor.apply(this, arguments);
      
        };
      
        Base.creatClass( Bitmap , Shape , {
            draw : function(ctx, style) {
                if (!this.img) {
                    //img都没有画个毛
                    return;
                };
                var image = this.img;
                if(!style.width || !style.height ){
                    ctx.drawImage(image, 0, 0);
                } else {
                    if( style.dx == undefined || style.dy == undefined  ){
                       ctx.drawImage(image, 0, 0, style.width, style.height);
                    } else {
                       !style.dWidth  && ( style.dWidth  = style.width  );
                       !style.dHeight && ( style.dHeight = style.height );
                       ctx.drawImage(image , style.dx , style.dy , style.dWidth , style.dHeight , 0 , 0 , style.width, style.height );
                    }
                }
            }
        });
      
        return Bitmap;

    }
)
