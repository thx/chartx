/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 圆形 类
 *
 * 坐标原点再圆心
 *
 * 对应context的属性有
 * @r 圆半径
 **/


define(
    "canvax/shape/Circle",
    [
        "canvax/display/Shape",
        "canvax/core/Base"
    ],
    function(Shape , Base) {
        var Circle = function(opt) {
            var self = this;
            self.type = "circle";

            opt = Base.checkOpt( opt );

            //默认情况下面，circle不需要把xy进行parentInt转换
            ( "xyToInt" in opt ) || ( opt.xyToInt = false );

            self._context = {
                r : opt.context.r || 0   //{number},  // 必须，圆半径
            }
            arguments.callee.superclass.constructor.apply(this, arguments);
        }

        Base.creatClass(Circle , Shape , {
           /**
             * 创建圆形路径
             * @param {Context2D} ctx Canvas 2D上下文
             * @param {Object} style 样式
             */
            draw : function(ctx, style) {
                if (!style) {
                  return;
                }
                ctx.arc(0 , 0, style.r, 0, Math.PI * 2, true);
            },

            /**
             * 返回矩形区域，用于局部刷新和文字定位
             * @param {Object} style
             */
            getRect : function(style) {
                var lineWidth;
                var style = style ? style : this.context;
                if (style.fillStyle || style.strokeStyle ) {
                    lineWidth = style.lineWidth || 1;
                } else {
                    lineWidth = 0;
                }
                return {
                    x : Math.round(0 - style.r - lineWidth / 2),
                    y : Math.round(0 - style.r - lineWidth / 2),
                    width : style.r * 2 + lineWidth,
                    height : style.r * 2 + lineWidth
                };
            }
        });

        return Circle;
    }
)
