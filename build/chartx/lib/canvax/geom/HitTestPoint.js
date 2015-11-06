/**
 * Canvax
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 * 点击检测 类
 
 * 下面是关于射线判断和非零环绕 两算法的资料
 * http://www.zhihu.com/question/28416085 
 * http://geomalgorithms.com/a03-_inclusion.html
 * http://alienryderflex.com/polygon/
 * */
define(
    "canvax/geom/HitTestPoint", [
        "canvax/core/Base",
        "canvax/geom/Math"
    ],
    function(Base, myMath) {
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

        /*  第一版的非零环绕算法，用到了 反三角函数。比下面的优化版本要慢，代码也要多
        function _isInsidePolygon_WindingNumber(shape, x, y) {
            //非零环绕法之——回转数法，回转数是拓扑学中的一个基本概念，具有很重要的性质和用途。
            //这需要具备相当的数学知识，否则会非常乏味和难以理解。我们暂时只需要记住回转数的一个特性就行了：
            //当回转数为 0 时，点在闭合曲线外部。
            var context = shape.context ? shape.context : shape;
            var poly = context.pointList; //poly 多边形顶点，数组成员的格式同 p
            var sum = 0;
            for (var i = 0, l = poly.length, j = l - 1; i < l; j = i, i++) {
                var sx = poly[i][0],
                    sy = poly[i][1],
                    tx = poly[j][0],
                    ty = poly[j][1]

                //点与多边形顶点重合或在多边形的边上
                if ((sx - x) * (x - tx) >= 0 && (sy - y) * (y - ty) >= 0 && (x - sx) * (ty - sy) === (y - sy) * (tx - sx)) {
                    return true;
                };

                //点与相邻顶点连线的夹角
                var angle = Math.atan2(sy - y, sx - x) - Math.atan2(ty - y, tx - x);

                //确保夹角不超出取值范围（-π 到 π）
                if (angle >= Math.PI) {
                    angle = angle - Math.PI * 2
                } else if (angle <= -Math.PI) {
                    angle = angle + Math.PI * 2
                };
                sum += angle;
            };
            // 计算回转数并判断点和多边形的几何关系
            return Math.round(sum / Math.PI) === 0 ? false : true;
        };
        */

        //http://geomalgorithms.com/a03-_inclusion.html
        //winding优化方案，这样就不需要用到反三角函数，就会快很多。
        //非零环绕数规则（Nonzero Winding Number Rule）：若环绕数为0表示在多边形内，非零表示在多边形外
        //首先使多边形的边变为矢量。将环绕数初始化为零。再从任意位置p作一条射线。
        //当从p点沿射线方向移动时，对在每个方向上穿过射线的边计数，每当多边形的边从右到左穿过射线时，环绕数加1，从左到右时，环绕数减1。
        //处理完多边形的所有相关边之后，若环绕数为非零，则p为内部点，否则，p是外部点。
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
            /*
            var coords = _.flatten(poly);
            var wn = 0;
            for (var shiftP, shift = coords[1] > y, i = 3; i < coords.length; i += 2) {
                shiftP = shift;
                shift = coords[i] > y;
                if (shiftP != shift) {
                    var n = (shiftP ? 1 : 0) - (shift ? 1 : 0);
                    if (n * ((coords[i - 3] - x) * (coords[i - 0] - y) - (coords[i - 2] - y) * (coords[i - 1] - x)) > 0) {
                        wn += n;
                    }
                };
            };
            */
            return wn;
        };

        /**
         * 多边形包含判断 even odd rule
         * 射线判别法
         * 如果一个点在多边形内部，任意角度做射线肯定会与多边形要么有一个交点，要么有与多边形边界线重叠
         * 如果一个点在多边形外部，任意角度做射线要么与多边形有一个交点，
         * 要么有两个交点，要么没有交点，要么有与多边形边界线重叠。
         * 但是因为射线判断法 在 有自我交集的 path中 会有问题，所以决定该用非零环绕法，同时因为canvas的fill api 也是用到非零环绕来渲染
         */
        /*
        function _isInsidePolygon_CrossingNumber(shape, x, y) {
            var context = shape.context ? shape.context : shape;
            var polygon = context.pointList;
            var i;
            var j;
            var N = polygon.length;
            var inside = false;
            var redo = true;
            var v;

            for (i = 0; i < N; ++i) {
                // 是否在顶点上
                if (polygon[i][0] == x && polygon[i][1] == y) {
                    redo = false;
                    inside = true;
                    break;
                }
            };

            if (redo) {
                redo = false;
                inside = false;
                for (i = 0, j = N - 1; i < N; j = i++) {
                    if ((polygon[i][1] < y && y < polygon[j][1]) || (polygon[j][1] < y && y < polygon[i][1])) {
                        if (x <= polygon[i][0] || x <= polygon[j][0]) {
                            v = (y - polygon[i][1]) * (polygon[j][0] - polygon[i][0]) / (polygon[j][1] - polygon[i][1]) + polygon[i][0];
                            if (x < v) { // 在线的左侧
                                inside = !inside;
                            } else if (x == v) { // 在线上
                                inside = true;
                                break;
                            }
                        }
                    } else if (y == polygon[i][1]) {
                        if (x < polygon[i][0]) { // 交点在顶点上
                            polygon[i][1] > polygon[j][1] ? --y : ++y;
                            //redo = true;
                            break;
                        }
                    } else if (polygon[i][1] == polygon[j][1] // 在水平的边界线上
                        && y == polygon[i][1] && ((polygon[i][0] < x && x < polygon[j][0]) || (polygon[j][0] < x && x < polygon[i][0]))
                    ) {
                        inside = true;
                        break;
                    }
                }
            }
            return inside;
        };
        */
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