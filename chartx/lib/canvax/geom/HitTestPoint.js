/**
 * Canvax
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 * 点击检测 类
 * */
define(
    "canvax/geom/HitTestPoint",
    [
        "canvax/core/Base",
        "canvax/geom/Math"
    ],
    function(Base , myMath){
        /**
         * 图形空间辅助类
         * isInside：是否在区域内部
         * isOutside：是否在区域外部
         * TODO:本检测只为进一步的 详细 检测。也就是说 进过了基本的矩形范围检测后才会
         */
        var HitTestPoint={};
        /**
         * 包含判断
         * shape : 图形
         * x ： 横坐标
         * y ： 纵坐标
         */
        function isInside(shape , point) {
            var x = point.x;
            var y = point.y;
            if (!shape || !shape.type) {
                // 无参数或不支持类型
                return false;
            };
            //数学运算，主要是line，brokenLine
            return _mathMethod( shape, x, y);
        };
    
        /**
         * zoneType ： 图形类型
         * x ： 横坐标
         * y ： 纵坐标
         * true表示坐标处在图形中
         */
        function _mathMethod(shape,x, y) {
            // 在矩形内则部分图形需要进一步判断
            switch (shape.type) {
                case 'line':
                    return _isInsideLine(shape.context, x, y);
                case 'brokenline':
                    return _isInsideBrokenLine(shape, x, y);
                case 'text':
                    return true;
                case 'rect':
                    return true;
                case 'circle':
                    return _isInsideCircle(shape , x, y);
                case 'ellipse':
                    return _isPointInElipse(shape , x , y);
                case 'sector':
                    return _isInsideSector(shape , x, y);
                case 'path':
                case 'droplet':
                    return _isInsidePath(shape , x, y);
                case 'polygon':
                case 'isogon':
                    return _isInsidePolygon(shape , x, y);
            }
        };
        /**
         * !isInside
         */
        function isOutside(shape, x, y) {
            return !isInside(shape, x, y);
        };
    
        /**
         * 线段包含判断
         */
        function _isInsideLine( context , x , y ) {
            var _x1 = context.xStart;
            var _y1 = context.yStart;
            var _x2 = context.xEnd;
            var _y2 = context.yEnd;
            var _l  = context.lineWidth;
            var _a = 0;
            var _b = _x1;
    
            if (_x1 !== _x2) {
                _a = (_y1 - _y2) / (_x1 - _x2);
                _b = (_x1 * _y2 - _x2 * _y1) / (_x1 - _x2) ;
            }
            else {
                return Math.abs(x - _x1) <= _l / 2;
            }
    
            var _s = (_a * x - y + _b) * (_a * x - y + _b) / (_a * _a + 1);
            return  _s <= _l / 2 * _l / 2;
        };
    
        function _isInsideBrokenLine(shape, x, y) {
            var context   = shape.context;
            var pointList = context.pointList;
            var lineArea;
            var insideCatch = false;
            for (var i = 0, l = pointList.length - 1; i < l; i++) {
                lineArea = {
                    xStart : pointList[i][0],
                    yStart : pointList[i][1],
                    xEnd   : pointList[i + 1][0],
                    yEnd   : pointList[i + 1][1],
                    lineWidth : context.lineWidth
                };
                if (!_isInsideRectangle(
                            {
                                x : Math.min(lineArea.xStart, lineArea.xEnd)
                    - lineArea.lineWidth,
                   y : Math.min(lineArea.yStart, lineArea.yEnd)
                    - lineArea.lineWidth,
                   width : Math.abs(lineArea.xStart - lineArea.xEnd)
                    + lineArea.lineWidth,
                   height : Math.abs(lineArea.yStart - lineArea.yEnd)
                    + lineArea.lineWidth
                            },
                            x,y
                            )
                   ) {
                       // 不在矩形区内跳过
                       continue;
                   }
                insideCatch = _isInsideLine(lineArea, x, y);
                if (insideCatch) {
                    break;
                }
            }
            return insideCatch;
        };

    
        /**
         * 矩形包含判断
         */
        function _isInsideRectangle(shape, x, y) {
            if (x >= shape.x
                    && x <= (shape.x + shape.width)
                    && y >= shape.y
                    && y <= (shape.y + shape.height)
               ) {
                   return true;
               }
            return false;
        };
    
        /**
         * 圆形包含判断
         */
        function _isInsideCircle(shape, x, y , r) {
            var context = shape.context;
            !r && ( r = context.r );
            return (x * x + y * y) < r * r;
        };
    
        /**
         * 扇形包含判断
         */
        function _isInsideSector(shape, x, y) {
            var context = shape.context
            if (!_isInsideCircle(shape, x, y)
                    || ( context.r0 > 0 && _isInsideCircle( shape ,x, y , context.r0))
               ){
                   // 大圆外或者小圆内直接false
                   return false;
               }
            else {
                // 判断夹角
                var startAngle = myMath.degreeTo360(context.startAngle);            // 起始角度[0,360)
                var endAngle   = myMath.degreeTo360(context.endAngle);              // 结束角度(0,360]
    
                //计算该点所在的角度
                var angle      = myMath.degreeTo360( (Math.atan2(y , x ) / Math.PI * 180) % 360 );
                
                var regIn      = true;  //如果在start和end的数值中，end大于start而且是顺时针则regIn为true
                if ( (startAngle > endAngle && !context.clockwise ) || (startAngle < endAngle && context.clockwise ) ) {
                    regIn      = false; //out
                }
                //度的范围，从小到大
                var regAngle   = [ 
                    Math.min( startAngle , endAngle ) , 
                    Math.max( startAngle , endAngle ) 
                ];
    
    
                var inAngleReg = angle > regAngle[0] && angle < regAngle[1];
                return (inAngleReg && regIn) || (!inAngleReg && !regIn);
            }
        };
    
        /*
         *椭圆包含判断
         * */
        function _isPointInElipse(shape , x , y) {
            var context = shape.context;
            var center  = { x:0 , y:0 };
            //x半径
            var XRadius = context.hr;
            var YRadius = context.vr;
    
            var p = {
                x : x,
                y : y
            }
            
            var iRes;
    
            p.x -= center.x;
            p.y -= center.y;
    
            p.x *= p.x;
            p.y *= p.y;
    
            XRadius *= XRadius;
            YRadius *= YRadius;
    
            iRes = YRadius * p.x + XRadius * p.y - XRadius * YRadius;
    
            return (iRes < 0);
        };
    
        /**
         * 多边形包含判断
         */
        function _isInsidePolygon(shape, x, y) {
            /**
             * 射线判别法
             * 如果一个点在多边形内部，任意角度做射线肯定会与多边形要么有一个交点，要么有与多边形边界线重叠
             * 如果一个点在多边形外部，任意角度做射线要么与多边形有一个交点，
             * 要么有两个交点，要么没有交点，要么有与多边形边界线重叠。
             */
            var context = shape.context ? shape.context : shape;
            var polygon = context.pointList ;
            var i;
            var j;
            var N = polygon.length;
            var inside = false;
            var redo = true;
            var v;
    
            for (i = 0; i < N; ++i) {
                // 是否在顶点上
                if (polygon[i][0] == x && polygon[i][1] == y ) {
                    redo = false;
                    inside = true;
                    break;
                }
            }
    
            if (redo) {
                redo = false;
                inside = false;
                for (i = 0,j = N - 1;i < N;j = i++) {
                    if ((polygon[i][1] < y && y < polygon[j][1])
                            || (polygon[j][1] < y && y < polygon[i][1])
                       ) {
                           if (x <= polygon[i][0] || x <= polygon[j][0]) {
                               v = (y - polygon[i][1])
                                   * (polygon[j][0] - polygon[i][0])
                                   / (polygon[j][1] - polygon[i][1])
                                   + polygon[i][0];
                               if (x < v) {          // 在线的左侧
                                   inside = !inside;
                               }
                               else if (x == v) {   // 在线上
                                   inside = true;
                                   break;
                               }
                           }
                       }
                    else if (y == polygon[i][1]) {
                        if (x < polygon[i][0]) {    // 交点在顶点上
                            polygon[i][1] > polygon[j][1] ? --y : ++y;
                            //redo = true;
                            break;
                        }
                    }
                    else if (polygon[i][1] == polygon[j][1] // 在水平的边界线上
                            && y == polygon[i][1]
                            && ((polygon[i][0] < x && x < polygon[j][0])
                                || (polygon[j][0] < x && x < polygon[i][0]))
                            ) {
                                inside = true;
                                break;
                            }
                }
            }
            return inside;
        };
        /**
         * 路径包含判断，依赖多边形判断
         */
        function _isInsidePath(shape, x, y) {
            var context = shape.context;
            var pointList = context.pointList;
            var insideCatch = false;
            for (var i = 0, l = pointList.length; i < l; i++) {
                insideCatch = _isInsidePolygon(
                    { pointList : pointList[i] }, x, y
                );
                if (insideCatch) {
                    break;
                }
            }
            return insideCatch;
        };
        HitTestPoint = {
            isInside : isInside,
            isOutside : isOutside
        };
        return HitTestPoint;
    }
);
