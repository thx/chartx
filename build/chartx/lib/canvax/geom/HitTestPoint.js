/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 碰撞检测 类
 *
 * 目前只支持点 和 shape 的检测， 暂时不支持shape的碰撞检测
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
         * getTextWidth：测算单行文本宽度
         * TODO:本检测只为进一步的 详细 检测。也就是说 进过了基本的矩形范围检测后才会
         * 使用本检测方法
         */
        var HitTestPoint={};
    
        /**
         * 包含判断
         * @param {string} shape : 图形
         * @param {number} x ： 横坐标
         * @param {number} y ： 纵坐标
         */
        function isInside(shape , point) {
            var x = point.x;
            var y = point.y;
            if( shape.type == "bitmap" ){
                //如果是bitmap
                return true;
            }
    
            if (!shape || !shape.type) {
                // 无参数或不支持类型
                return false;
            }
            var zoneType = shape.type;
    
    
            //数学运算，主要是line，brokenLine
            var _mathReturn = _mathMethod(zoneType, shape, x, y);
    
            if (typeof _mathReturn != 'undefined') {
                return _mathReturn;
            }
    
            if (zoneType != 'beziercurve'&& shape.buildPath && Base._pixelCtx.isPointInPath) {
                   return _buildPathMethod(shape, Base._pixelCtx, x, y);
            } else if (Base._pixelCtx.getImageData) {
                return _pixelMethod(shape, x, y);
            }
    
            // 上面的方法都行不通时
            switch (zoneType) {
                    //水滴----------------------11
                case 'droplet':
                    return true;    // Todo，不精确
                case 'ellipse':
                    return true;     // Todo，不精确
                    //路径，椭圆，曲线等-----------------13
                default:
                    return false;   // Todo，暂不支持
            }
        }
    
        /**
         * 用数学方法判断，三个方法中最快，但是支持的shape少
         *
         * @param {string} zoneType ： 图形类型
         * * @param {number} x ： 横坐标
         * @param {number} y ： 纵坐标
         * @return {boolean=} true表示坐标处在图形中
         */
        function _mathMethod(zoneType,shape,x, y) {
            // 在矩形内则部分图形需要进一步判断
            switch (zoneType) {
                //线-----------------------1
                case 'line':
                    return _isInsideLine(shape.context, x, y);
                    //折线----------------------2
                case 'brokenLine':
                    return _isInsideBrokenLine(shape, x, y);
                    //文本----------------------3
                case 'text':
                    return true;
                    //矩形----------------------4
                case 'rect':
                    return true;
                    //圆形----------------------5
                case 'circle':
                    return _isInsideCircle(shape , x, y);
                    //椭圆
                case 'ellipse':
                    return _isPointInElipse(shape , x , y);
                    //扇形----------------------6
                case 'sector':
                    return _isInsideSector(shape , x, y);
                    //path---------------------7
                case 'path':
                    return _isInsidePath(shape , x, y);
                    //多边形-------------------8
                case 'polygon':
                case 'isogon':
                    return _isInsidePolygon(shape , x, y);
                    //图片----------------------10
                case 'image':
                    return true;
            }
        }
    
        /**
         * 通过buildPath方法来判断，三个方法中较快，但是不支持线条类型的shape，
         * 而且excanvas不支持isPointInPath方法
         *
         * @param {Object} shapeClazz ： shape类
         * @param {Object} context : 上下文
         * @param {Object} context ：目标区域
         * @param {number} x ： 横坐标
         * @param {number} y ： 纵坐标
         * @return {boolean} true表示坐标处在图形中
         */
        function _buildPathMethod(shape, context, x, y) {
            var context = shape.context;
            // 图形类实现路径创建了则用类的path
            context.beginPath();
            shape.buildPath(context, context);
            context.closePath();
            return context.isPointInPath(x, y);
        }
    
        /**
         * 通过像素值来判断，三个方法中最慢，但是支持广,不足之处是excanvas不支持像素处理,flashCanvas支持还好
         *
         * @param {Object} shapeClazz ： shape类
         * @param {Object} context ：目标区域
         * @param {number} x ： 横坐标
         * @param {number} y ： 纵坐标
         * @return {boolean} true表示坐标处在图形中
         */
        function _pixelMethod(shape, x, y) {
            var context  = shape.context;
            
            var _context = Base._pixelCtx;
                
            _context.save();
            _context.beginPath();
            Base.setContextStyle( _context , context.$model );
           
            _context.transform.apply( _context , shape.getConcatenatedMatrix().toArray() );
    
            //这个时候肯定是做过矩形范围检测过来的
            //所以，shape._rect 肯定都是已经有值的
            _context.clearRect( shape._rect.x-10 , shape._rect.y-10 , shape._rect.width+20 , shape._rect.height+20 );
    
    
            shape.draw( _context,  context );

            _context.globalAlpha = 1;

            shape.drawEnd(_context);
            _context.closePath();
            _context.restore();
    
            //对鼠标的坐标也做相同的变换
            var _transformStage = shape.getConcatenatedMatrix()
            if( _transformStage ){
                var inverseMatrix = _transformStage.clone();
    
                var originPos = [x, y];
                inverseMatrix.mulVector( originPos , [ x , y , 1 ] );
    
                x = originPos[0];
                y = originPos[1];
            }
    
            return _isPainted(_context, x , y);
        };
    
        /**
         * 坐标像素值，判断坐标是否被作色
         *
         * @param {Object} context : 上下文
         * @param {number} x : 横坐标
         * @param {number} y : 纵坐标
         * @param {number=} unit : 触发的精度，越大越容易触发，可选，缺省是为1
         * @return {boolean} 已经被画过返回true
         */
        function _isPainted(context, x, y, unit) {
            var pixelsData;
    
            if (typeof unit != 'undefined') {
                unit = Math.floor((unit || 1 )/ 2);
                pixelsData = context.getImageData(
                        x - unit,
                        y - unit,
                        unit + unit,
                        unit + unit
                        ).data;
            }
            else {
                pixelsData = context.getImageData(x, y, 1, 1).data;
            }
    
            var len = pixelsData.length;
            while (len--) {
                if (pixelsData[len] !== 0) {
                    return true;
                }
            }
    
            return false;
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
         * 警告：下面这段代码会很难看，建议跳过~
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
