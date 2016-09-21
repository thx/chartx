/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 正n边形（n>=3）
 *
 * 对应context的属性有 
 *
 * @r 正n边形外接圆半径
 * @r 指明正几边形
 *
 * @pointList 私有，从上面的r和n计算得到的边界值的集合
 */
define(
    "canvax/shape/Isogon", [
        "canvax/core/Base",
        "canvax/shape/Polygon"
    ],
    function(Base, Polygon) {
        var Isogon = function(opt) {
            var self = this;
            opt = Base.checkOpt(opt);
            self._context = _.deepExtend({
                pointList: [], //从下面的r和n计算得到的边界值的集合
                r: 0, //{number},  // 必须，正n边形外接圆半径
                n: 0 //{number},  // 必须，指明正几边形
            } , opt.context);
            self.setPointList(self._context);
            opt.context = self._context;
            arguments.callee.superclass.constructor.apply(this, arguments);
            this.type = "isogon";
        };
        Base.creatClass(Isogon, Polygon, {
            setPointList: function(style) {
                var n = style.n, r = style.r;
                var dStep = 2 * Math.PI / n;
                var beginDeg = -Math.PI / 2;
                var deg = beginDeg;
                for (var i = 0, end = n; i < end; i++) {
                    style.pointList.push([r * Math.cos(deg), r * Math.sin(deg)]);
                    deg += dStep;
                };
            }
        });
        return Isogon;
    }
);