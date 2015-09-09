/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 贝塞尔曲线 类
 *
 * 对应context的属性有
 * @xStart 起点横坐标
 * @yStart 起点纵坐标
 * @cpX1   第一个关联点横坐标
 * @cpY1   第一个关联点纵坐标
 * @cpX2   第二个关联点横坐标  缺省即为二次贝塞尔曲线
 * @cpY2   第二个关联点纵坐标
 * @xEnd   终点横坐标
 * @yEnd   终点纵坐标
 */

define(
    "canvax/shape/Beziercurve",
    [
        "canvax/display/Shape",
        "canvax/core/Base",
        "canvax/display/Point"
    ],
    function( Shape , Base , Point ){
        var Beziercurve = function(opt){
            var self           = this;
            self.type          = "beziercurve";
            self._drawTypeOnly = "stroke";//线条只能描边，填充的画出了问题别怪我没提醒
            self.length        = undefined;
      
      
            //在diaplayobject组织context的之前就要把 这个 shape 需要的 style 字段 提供出来
            //displayobject 会merge 到 context去
            opt.context || (opt.context = {});
            self._context = {
                 xStart : opt.context.xStart  || 0 , //        : {number} 必须，起点横坐标
                 yStart : opt.context.yStart  || 0 , //       : {number},   必须，起点纵坐标
                 cpX1   : opt.context.cpX1    || 0 , //       : {number},  // 必须，第一个关联点横坐标
                 cpY1   : opt.context.cpY1    || 0 , //      : {number},  // 必须，第一个关联点纵坐标
                 cpX2   : opt.context.cpX2    || 0 , //第二个关联点横坐标  缺省即为二次贝塞尔曲线
                 cpY2   : opt.context.cpY2    || 0 , //       : {number},  // 可选，第二个关联点纵坐标
                 xEnd   : opt.context.xEnd    || 0 , //       : {number},  // 必须，终点横坐标
                 yEnd   : opt.context.yEnd    || 0   //       : {number},  // 必须，终点纵坐标
            }
            arguments.callee.superclass.constructor.apply(this , arguments);
        };
      
        Base.creatClass(Beziercurve , Shape , {
          draw : function(ctx, style) {
              ctx.moveTo(style.xStart, style.yStart);
              if (typeof style.cpX2 != 'undefined' && typeof style.cpY2 != 'undefined') {
                  ctx.bezierCurveTo(
                      style.cpX1, style.cpY1,
                      style.cpX2, style.cpY2,
                      style.xEnd, style.yEnd
                      );
              } else {
                  ctx.quadraticCurveTo(
                      style.cpX1, style.cpY1,
                      style.xEnd, style.yEnd
                      );
              }
      
          },
          getRect : function(style) {
              var style = style ? style : this.context;
      
              var _minX = Math.min(style.xStart, style.xEnd, style.cpX1);
              var _minY = Math.min(style.yStart, style.yEnd, style.cpY1);
              var _maxX = Math.max(style.xStart, style.xEnd, style.cpX1);
              var _maxY = Math.max(style.yStart, style.yEnd, style.cpY1);
              var _x2 = style.cpX2;
              var _y2 = style.cpY2;
      
              if (typeof _x2 != 'undefined'
                      && typeof _y2 != 'undefined'
                 ) {
                     _minX = Math.min(_minX, _x2);
                     _minY = Math.min(_minY, _y2);
                     _maxX = Math.max(_maxX, _x2);
                     _maxY = Math.max(_maxY, _y2);
                 }
      
              var lineWidth = style.lineWidth || 1;
              return {
                    x : _minX - lineWidth,
                    y : _minY - lineWidth,
                    width : _maxX - _minX + lineWidth,
                    height : _maxY - _minY + lineWidth
              };
          },
          //下面为Beziercurve匀速曲线运动相关，来自@墨川的 天猫欢乐城
          /**
           * @param  {number} -- t {0, 1}
           * @return {number} -- length of the bezier arc from 0 to t
           */
          getLength: function(t) {
              var TOTAL_SIMPSON_STEP = 100;
              if(t==undefined){
                 t = 1;
              }
              var stepCounts = parseInt(TOTAL_SIMPSON_STEP * t),
              i;
      
              if (stepCounts & 1) stepCounts++;
              if (stepCounts == 0) return 0.0;
      
              var halfCounts = stepCounts >> 1;
              var sum1 = 0,
                  sum2 = 0;
              var dStep = t / stepCounts;
      
              for (i = 0; i < halfCounts; i++) {
                  sum1 += this._getSpeedLength((2 * i + 1) * dStep);
              }
              for (i = 1; i < halfCounts; i++) {
                  sum2 += this._getSpeedLength((2 * i) * dStep);
              }
      
              return (this._getSpeedLength(0) + this._getSpeedLength(1) + 2 * sum2 + 4 * sum1) * dStep / 3;
          },
          /**
           * @param  {number} -- t {0, 1}
           * @return {Point}  -- return point at the given time in the bezier arc 
           */
          getPointByTime: function(t) {
              var it = 1 - t,
              it2 = it * it,
              it3 = it2 * it;
              var t2 = t * t,
                  t3 = t2 * t;
              var context = this.context.$model;
              return new Point(it3 * context.xStart + 3 * it2 * t * context.cpX1 + 3 * it * t2 * context.cpX2 + t3 * context.xEnd,
                      it3 * context.yStart + 3 * it2 * t * context.cpY1 + 3 * it * t2 * context.cpY2 + t3 * context.yEnd
                      );
          },
          /**
           * @param  {number} -- len
           * @return {Point}  -- point at the given length
           */
          getPointByLen: function(len) {
              if( this._length == undefined ){
                 this._length = this.getLength();
              }
              if (len > this._length) {
                  return { x : this.context.$model.xEnd , y : this.context.$model.yEnd };
              }
      
              var t1 = len / this._length,
                  t2;
              do {
                  t2 = t1 - (this.getLength(t1) - len) / this._getSpeedLength(t1);
                  if (Math.abs(t1 - t2) < 0.01) break;
      
                  t1 = t2;
      
              } while (true);
              return this.getPointByTime(t2);
          },
          getPointsByStep: function(step) {
              step = step || 1;
              var len = this.getLength();
              var i = 0;
              var points = [];
              while (i < len) {
                  points.push(this.getPointByLen(i));
                  i += step;
              }
              points.push(this.getPointByLen(len))
                  return points;
          },
          /**
           * @param  {number} -- step = (1/pointsSize);
           * @return {Array}  -- points in the arc stepd by 'step' param
           */
          getPointsByTime: function(step) {
              step = step || .01;
              var t = 0;
              var points = [];
              while (t < 1) {
                  points.push(this.getPointByTime(t));
                  t += step;
              }
              points.push(this.getPointByTime(1));
              return points;
          },
          /**
           * @inner func
           */
          _getSpeedLength: function(t) {
              var it = 1 - t,
              it2 = it * it,
              t2 = t * t;
              var context = this.context.$model;
              var x = -3 * context.xStart * it2 + 3 * context.cpX1 * it2 - 6 * context.cpX1 * it * t + 6 * context.cpX2 * it * t - 3 * context.cpX2 * t2 + 3 * context.xEnd * t2;
              var y = -3 * context.yEnd * it2 + 3 * context.cpY1 * it2 - 6 * context.cpY1 * it * t + 6 * context.cpY2 * it * t - 3 * context.cpY2 * t2 + 3 * context.yEnd * t2;
      
              return Math.sqrt(x * x + y * y);
          }
        });
      
        return Beziercurve;
    } 
);
