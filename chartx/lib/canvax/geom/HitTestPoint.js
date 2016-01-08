/**
 * Canvax
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 * 点击检测 类
 * */
define(
    "canvax/geom/HitTestPoint", [
        "canvax/geom/Math"
    ],
    function(myMath) {
        /**
         * TODO:本检测只为进一步的 详细 检测。也就是说 进过了基本的矩形范围检测后才会
         */
        var HitTestPoint = {};
        /**
         * 包含判断
         * shape : 图形
         * x : 横坐标
         * y : 纵坐标
         */
        function isInside(shape, point) {
            var x = point.x;
            var y = point.y;
            if (!shape || !shape.type) {
                // 无参数或不支持类型
                return false;
            };
            //数学运算，主要是line，brokenLine
            return _pointInShape(shape, x, y);
        };

        function _pointInShape(shape, x, y) {
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
                    return _isInsideCircle(shape, x, y);
                case 'ellipse':
                    return _isPointInElipse(shape, x, y);
                case 'sector':
                    return _isInsideSector(shape, x, y);
                case 'path':
                case 'droplet':
                    return _isInsidePath(shape, x, y);
                case 'polygon':
                case 'isogon':
                    return _isInsidePolygon_WindingNumber(shape, x, y);
                    //return _isInsidePolygon_CrossingNumber(shape, x, y);
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
        function _isInsideLine(context, x, y) {
            var x0 = context.xStart;
            var y0 = context.yStart;
            var x1 = context.xEnd;
            var y1 = context.yEnd;
            var _l = Math.max(context.lineWidth , 3);
            var _a = 0;
            var _b = x0;

            if(
                (y > y0 + _l && y > y1 + _l) 
                || (y < y0 - _l && y < y1 - _l) 
                || (x > x0 + _l && x > x1 + _l) 
                || (x < x0 - _l && x < x1 - _l) 
            ){
                return false;
            }

            if (x0 !== x1) {
                _a = (y0 - y1) / (x0 - x1);
                _b = (x0 * y1 - x1 * y0) / (x0 - x1);
            } else {
                return Math.abs(x - x0) <= _l / 2;
            }

            var _s = (_a * x - y + _b) * (_a * x - y + _b) / (_a * _a + 1);
            return _s <= _l / 2 * _l / 2;
        };

        function _isInsideBrokenLine(shape, x, y) {
            var context = shape.context;
            var pointList = context.pointList;
            var lineArea;
            var insideCatch = false;
            for (var i = 0, l = pointList.length - 1; i < l; i++) {
                lineArea = {
                    xStart: pointList[i][0],
                    yStart: pointList[i][1],
                    xEnd: pointList[i + 1][0],
                    yEnd: pointList[i + 1][1],
                    lineWidth: context.lineWidth
                };
                if (!_isInsideRectangle({
                            x: Math.min(lineArea.xStart, lineArea.xEnd) - lineArea.lineWidth,
                            y: Math.min(lineArea.yStart, lineArea.yEnd) - lineArea.lineWidth,
                            width: Math.abs(lineArea.xStart - lineArea.xEnd) + lineArea.lineWidth,
                            height: Math.abs(lineArea.yStart - lineArea.yEnd) + lineArea.lineWidth
                        },
                        x, y
                    )) {
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
            if (x >= shape.x && x <= (shape.x + shape.width) && y >= shape.y && y <= (shape.y + shape.height)) {
                return true;
            }
            return false;
        };

        /**
         * 圆形包含判断
         */
        function _isInsideCircle(shape, x, y, r) {
            var context = shape.context;
            !r && (r = context.r);
            return (x * x + y * y) < r * r;
        };

        /**
         * 扇形包含判断
         */
        function _isInsideSector(shape, x, y) {
            var context = shape.context
            if (!_isInsideCircle(shape, x, y) || (context.r0 > 0 && _isInsideCircle(shape, x, y, context.r0))) {
                // 大圆外或者小圆内直接false
                return false;
            } else {
                // 判断夹角
                var startAngle = myMath.degreeTo360(context.startAngle); // 起始角度[0,360)
                var endAngle = myMath.degreeTo360(context.endAngle); // 结束角度(0,360]

                //计算该点所在的角度
                var angle = myMath.degreeTo360((Math.atan2(y, x) / Math.PI * 180) % 360);

                var regIn = true; //如果在start和end的数值中，end大于start而且是顺时针则regIn为true
                if ((startAngle > endAngle && !context.clockwise) || (startAngle < endAngle && context.clockwise)) {
                    regIn = false; //out
                }
                //度的范围，从小到大
                var regAngle = [
                    Math.min(startAngle, endAngle),
                    Math.max(startAngle, endAngle)
                ];

                var inAngleReg = angle > regAngle[0] && angle < regAngle[1];
                return (inAngleReg && regIn) || (!inAngleReg && !regIn);
            }
        };

        /*
         *椭圆包含判断
         * */
        function _isPointInElipse(shape, x, y) {
            var context = shape.context;
            var center = {
                x: 0,
                y: 0
            };
            //x半径
            var XRadius = context.hr;
            var YRadius = context.vr;

            var p = {
                x: x,
                y: y
            };

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
         * 多边形包含判断 Nonzero Winding Number Rule
         */

        function _isInsidePolygon_WindingNumber(shape, x, y) {
            var context = shape.context ? shape.context : shape;
            var poly = _.clone(context.pointList); //poly 多边形顶点，数组成员的格式同 p
            poly.push(poly[0]); //记得要闭合
            var wn = 0;
            for (var shiftP, shift = poly[0][1] > y, i = 1; i < poly.length; i++) {
                //先做线的检测，如果是在两点的线上，就肯定是在认为在图形上
                var inLine = _isInsideLine({
                    xStart : poly[i-1][0],
                    yStart : poly[i-1][1],
                    xEnd   : poly[i][0],
                    yEnd   : poly[i][1],
                    lineWidth : (context.lineWidth || 1)
                } , x , y);
                if ( inLine ){
                    return true;
                };
                //如果有fillStyle ， 那么肯定需要做面的检测
                if (context.fillStyle) {
                    shiftP = shift;
                    shift = poly[i][1] > y;
                    if (shiftP != shift) {
                        var n = (shiftP ? 1 : 0) - (shift ? 1 : 0);
                        if (n * ((poly[i - 1][0] - x) * (poly[i][1] - y) - (poly[i - 1][1] - y) * (poly[i][0] - x)) > 0) {
                            wn += n;
                        }
                    };
                }
            };
            return wn;
        };

        /**
         * 路径包含判断，依赖多边形判断
         */
        function _isInsidePath(shape, x, y) {
            var context = shape.context;
            var pointList = context.pointList;
            var insideCatch = false;
            for (var i = 0, l = pointList.length; i < l; i++) {
                insideCatch = _isInsidePolygon_WindingNumber({
                    pointList: pointList[i],
                    lineWidth: context.lineWidth,
                    fillStyle: context.fillStyle
                }, x, y);
                if (insideCatch) {
                    break;
                }
            }
            return insideCatch;
        };
        HitTestPoint = {
            isInside: isInside,
            isOutside: isOutside
        };
        return HitTestPoint;
    }
);