/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 线条 类
 *
 *
 * 对应context的属性有
 * @lineType  可选 虚线 实现 的 类型
 * @xStart    必须，起点横坐标
 * @yStart    必须，起点纵坐标
 * @xEnd      必须，终点横坐标
 * @yEnd      必须，终点纵坐标
 **/

define(
    "canvax/shape/Line", [
        "canvax/display/Shape",
        "canvax/core/Base"
    ],
    function(Shape, Base) {
        var Line = function(opt) {
            var self = this;
            this.type = "line";
            this.drawTypeOnly = "stroke";
            opt = Base.checkOpt(opt);
            self._context = {
                lineType: opt.context.lineType || null, //可选 虚线 实现 的 类型
                xStart: opt.context.xStart || 0, //{number},  // 必须，起点横坐标
                yStart: opt.context.yStart || 0, //{number},  // 必须，起点纵坐标
                xEnd: opt.context.xEnd || 0, //{number},  // 必须，终点横坐标
                yEnd: opt.context.yEnd || 0, //{number},  // 必须，终点纵坐标
                dashLength: opt.context.dashLength
            }
            arguments.callee.superclass.constructor.apply(this, arguments);
        };


        Base.creatClass(Line, Shape, {
            /**
             * 创建线条路径
             * ctx Canvas 2D上下文
             * style 样式
             */
            draw: function(ctx, style) {
                if (!style.lineType || style.lineType == 'solid') {
                    //默认为实线
                    ctx.moveTo(parseInt(style.xStart), parseInt(style.yStart));
                    ctx.lineTo(parseInt(style.xEnd), parseInt(style.yEnd));
                } else if (style.lineType == 'dashed' || style.lineType == 'dotted') {
                    this.dashedLineTo(
                        ctx,
                        style.xStart, style.yStart,
                        style.xEnd, style.yEnd,
                        style.dashLength
                    );
                }
            },

            /**
             * 返回矩形区域，用于局部刷新和文字定位
             * style
             */
            getRect: function(style) {
                var lineWidth = style.lineWidth || 1;
                var style = style ? style : this.context;
                return {
                    x: Math.min(style.xStart, style.xEnd) - lineWidth,
                    y: Math.min(style.yStart, style.yEnd) - lineWidth,
                    width: Math.abs(style.xStart - style.xEnd) + lineWidth,
                    height: Math.abs(style.yStart - style.yEnd) + lineWidth
                };
            }

        });

        return Line;
    }
);