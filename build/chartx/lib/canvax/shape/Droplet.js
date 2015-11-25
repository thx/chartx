/**
 * Canvax
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 水滴形 类
 * 派生自Path类
 *
 * 对应context的属性有
 * @hr 水滴横宽（中心到水平边缘最宽处距离）
 * @vr 水滴纵高（中心到尖端距离）
 **/
define(
    "canvax/shape/Droplet",
    [
        "canvax/core/Base",
        "canvax/shape/Path"
    ],
    function(Base,Path){
        var Droplet = function(opt){
            var self = this;
            opt = Base.checkOpt( opt );
            self._context = {
                hr : opt.context.hr || 0 , //{number},  // 必须，水滴横宽（中心到水平边缘最宽处距离）
                vr : opt.context.vr || 0   //{number},  // 必须，水滴纵高（中心到尖端距离）
            };
            arguments.callee.superclass.constructor.apply(this, arguments);
            self.type = "droplet";
        };
        Base.creatClass( Droplet , Path , {
            draw : function(ctx, style) {
               var ps = "M 0 "+style.hr+" C "+style.hr+" "+style.hr+" "+( style.hr*3/2 ) +" "+(-style.hr/3)+" 0 "+(-style.vr);
               ps += " C "+(-style.hr * 3/ 2)+" "+(-style.hr / 3)+" "+(-style.hr)+" "+style.hr+" 0 "+ style.hr;
               this.context.path = ps;
               this._draw(ctx , style);
            }
        } );
        return Droplet;
    }
);
