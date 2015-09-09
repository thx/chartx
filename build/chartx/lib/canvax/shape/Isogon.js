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
    "canvax/shape/Isogon",
    [
        "canvax/display/Shape",
        "canvax/core/Base"
    ],
    function(Shape , Base){

        var Isogon = function(opt){
            var self = this;
            this.type = "isogon";
      
            opt = Base.checkOpt( opt );
            self._context = {
                 pointList : [],//从下面的r和n计算得到的边界值的集合
                 //x             : 0,//{number},  // 必须，正n边形外接圆心横坐标
                 //y             : 0,//{number},  // 必须，正n边形外接圆心纵坐标
                 r :opt.context.r  || 0,//{number},  // 必须，正n边形外接圆半径
                 n :opt.context.n  || 0 //{number},  // 必须，指明正几边形
            }
      
            arguments.callee.superclass.constructor.apply(this, arguments);
      
            self.setPointList( self.context );
        };
      
      
        var sin = Math.sin;
        var cos = Math.cos;
        var PI = Math.PI;
      
        Base.creatClass(Isogon , Shape , {
            /**
             * 创建n角星（n>=3）路径
             * @param {Context2D} ctx Canvas 2D上下文
             * @param {Object} style 样式
             */
            draw : function(ctx, style) {
                var pointList = this.context.pointList;
                if( pointList.length == 0 ) {
                    return;
                }
                // 绘制
                ctx.moveTo(pointList[0][0], pointList[0][1]);
                for (var i = 0; i < pointList.length; i ++) {
                    ctx.lineTo(pointList[i][0], pointList[i][1]);
                }
                return;
            },
      
            setPointList : function( style ){
                var n = style.n;
                if (!n || n < 2) { return; }
      
                var x = 0;
                var y = 0;
                var r = style.r;
      
                var dStep    = 2 * PI / n;
                var beginDeg = -PI / 2;
                var deg      = beginDeg;
          
                // 记录边界点，用于判断insight
                var pointList = style.pointList = [];
                for (var i = 0, end = n; i < end; i ++) {
                    pointList.push([x + r * cos(deg), y + r * sin(deg)]);
                    deg += dStep;
                }
                deg = beginDeg
                pointList.push([
                    x + r * cos(deg),
                    x + r * sin(deg)
                ]);
            },
      
            /**
             * 返回矩形区域，用于局部刷新和文字定位
             * @param {Object} style
             */
            getRect : function( context ) {
                var context = context ? context : this.context;
                return this.getRectFormPointList( context );
            }
        });
      
        return Isogon;
    }
);
