/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 多边形 类  （不规则）
 *
 * 对应context的属性有
 * @pointList 多边形各个顶角坐标
 **/


define(
    "canvax/shape/Polygon", [
        "canvax/core/Base",
        "canvax/shape/BrokenLine"
    ],
    function(Base, BrokenLine) {
        var Polygon = function(opt , atype) {
            var self = this;
            opt = Base.checkOpt(opt);

            if(atype !== "clone"){
                var start = opt.context.pointList[0];
                var end   = opt.context.pointList[ opt.context.pointList.length - 1 ];
                if( opt.context.smooth ){
                    opt.context.pointList.unshift( end );
                } else {
                    opt.context.pointList.push( start );
                }
            };
            
            arguments.callee.superclass.constructor.apply(this, arguments);

            if(atype !== "clone" && opt.context.smooth && end){

            };

            self._drawTypeOnly = null;
            self.type = "polygon";
        };
        Base.creatClass(Polygon, BrokenLine, {
            draw: function(ctx, context) {
                if (context.fillStyle) {
                    if (context.lineType == 'dashed' || context.lineType == 'dotted') {
                        var pointList = context.pointList;
                        //特殊处理，虚线围不成path，实线再build一次
                        ctx.save();
                        ctx.beginPath();
                        ctx.moveTo(pointList[0][0], pointList[0][1]);
                        for (var i = 1, l = pointList.length; i < l; i++) {
                            ctx.lineTo(pointList[i][0], pointList[i][1]);
                        };
                        ctx.closePath();
                        ctx.restore();
                        ctx.fill();
                        this._drawTypeOnly = "stroke";
                    };
                };
                //如果下面不加save restore，canvas会把下面的path和上面的path一起算作一条path。就会绘制了一条实现边框和一虚线边框。
                ctx.save();
                ctx.beginPath();
                this._draw(ctx, context);
                ctx.closePath();
                ctx.restore();
            }
        });
        return Polygon;
    }
);