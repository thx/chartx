
/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 椭圆形 类
 *
 * 对应context的属性有 
 *
 * @hr 椭圆横轴半径
 * @vr 椭圆纵轴半径
 */


define(
    "canvax/shape/Ellipse",
    [
        "canvax/display/Shape",
        "canvax/core/Base"
    ],
    function(Shape,Base){

        var Ellipse = function(opt){
            var self = this;
            self.type = "ellipse";
     
            opt = Base.checkOpt( opt );
            self._context = {
                //x             : 0 , //{number},  // 丢弃
                //y             : 0 , //{number},  // 丢弃，原因同circle
                hr : opt.context.hr || 0 , //{number},  // 必须，椭圆横轴半径
                vr : opt.context.vr || 0   //{number},  // 必须，椭圆纵轴半径
            }
     
            arguments.callee.superclass.constructor.apply(this, arguments);
        };
     
        Base.creatClass(Ellipse , Shape , {
            draw :  function(ctx, style) {
                var r = (style.hr > style.vr) ? style.hr : style.vr;
                var ratioX = style.hr / r; //横轴缩放比率
                var ratioY = style.vr / r;
                
                ctx.scale(ratioX, ratioY);
                ctx.arc(
                    0, 0, r, 0, Math.PI * 2, true
                    );
                if ( document.createElement('canvas').getContext ){
                   //ie下面要想绘制个椭圆出来，就不能执行这步了
                   //算是excanvas 实现上面的一个bug吧
                   ctx.scale(1/ratioX, 1/ratioY);
     
                }
                return;
            },
            getRect : function(style){
                var lineWidth;
                var style = style ? style : this.context;
                if (style.fillStyle || style.strokeStyle) {
                    lineWidth = style.lineWidth || 1;
                }
                else {
                    lineWidth = 0;
                }
                return {
                      x : Math.round(0 - style.hr - lineWidth / 2),
                      y : Math.round(0 - style.vr - lineWidth / 2),
                      width : style.hr * 2 + lineWidth,
                      height : style.vr * 2 + lineWidth
                };
     
            }
        });
     
        return Ellipse;
     
    } 
)
