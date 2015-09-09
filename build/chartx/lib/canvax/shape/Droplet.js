/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 水滴形 类
 *
 * 对应context的属性有
 * @hr 水滴横宽（中心到水平边缘最宽处距离）
 * @vr 水滴纵高（中心到尖端距离）
 **/

define(
    "canvax/shape/Droplet",
    [
        "canvax/display/Shape",
        "canvax/core/Base"
    ],
    function(Shape,Base){

        var Droplet = function(opt){
            var self = this;
            self.type = "droplet";
      
            opt = Base.checkOpt( opt );
            self._context = {
                hr : opt.context.hr || 0 , //{number},  // 必须，水滴横宽（中心到水平边缘最宽处距离）
                vr : opt.context.vr || 0   //{number},  // 必须，水滴纵高（中心到尖端距离）
            }
      
      
            arguments.callee.superclass.constructor.apply(this, arguments);
        };
      
        Base.creatClass( Droplet , Shape , {
            draw : function(ctx, style) {
      
                ctx.moveTo( 0 , style.hr);
                ctx.bezierCurveTo(
                    style.hr,
                    style.hr,
                    style.hr * 3 / 2,
                    - style.hr / 3,
                    0,
                    - style.vr
                    );
                ctx.bezierCurveTo(
                    - style.hr * 3 / 2,
                    - style.hr / 3,
                    - style.hr,
                    style.hr,
                    0,
                    style.hr
                    );
                return;
            },
            getRect : function(style){
                var lineWidth;
                var style = style ? style : this.context;
                if (style.fillStyle || style.strokeStyle) {
                    lineWidth = style.lineWidth || 1;
                } else {
                    lineWidth = 0;
                }
                return {
                      x : Math.round(0 - style.hr - lineWidth / 2),
                      y : Math.round(0 - style.vr - lineWidth / 2),
                      width : style.hr * 2 + lineWidth,
                      height : style.hr + style.vr + lineWidth
                };
      
            }
      
        } );
      
        return Droplet;
      
    }
)
