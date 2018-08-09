/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 矩现 类  （不规则）
 *
 *
 * 对应context的属性有
 * @width 宽度
 * @height 高度
 * @radius 如果是圆角的，则为【上右下左】顺序的圆角半径数组
 **/


define(
    "canvax/shape/Rect",
    [
        "canvax/display/Shape",
        "canvax/core/Base"
    ],
    function(Shape , Base){
        var Rect = function(opt){
            var self = this;
            self.type = "rect";
      
            opt = Base.checkOpt( opt );
            self._context = {
                 width         : opt.context.width || 0,//{number},  // 必须，宽度
                 height        : opt.context.height|| 0,//{number},  // 必须，高度
                 radius        : opt.context.radius|| []     //{array},   // 默认为[0]，圆角 
            }
            arguments.callee.superclass.constructor.apply(this, arguments);
        };
      
        Base.creatClass( Rect , Shape , {
            /**
             * 绘制圆角矩形
             * @param {Context2D} ctx Canvas 2D上下文
             * @param {Object} style 样式
             */
            _buildRadiusPath: function(ctx, style) {
                //左上、右上、右下、左下角的半径依次为r1、r2、r3、r4
                //r缩写为1         相当于 [1, 1, 1, 1]
                //r缩写为[1]       相当于 [1, 1, 1, 1]
                //r缩写为[1, 2]    相当于 [1, 2, 1, 2]
                //r缩写为[1, 2, 3] 相当于 [1, 2, 3, 2]
                var x = 0;
                var y = 0;
                var width = this.context.width;
                var height = this.context.height;
            
                var r = Base.getCssOrderArr(style.radius);
             
                ctx.moveTo( parseInt(x + r[0]), parseInt(y));
                ctx.lineTo( parseInt(x + width - r[1]), parseInt(y));
                r[1] !== 0 && ctx.quadraticCurveTo(
                        x + width, y, x + width, y + r[1]
                        );
                ctx.lineTo( parseInt(x + width), parseInt(y + height - r[2]));
                r[2] !== 0 && ctx.quadraticCurveTo(
                        x + width, y + height, x + width - r[2], y + height
                        );
                ctx.lineTo( parseInt(x + r[3]), parseInt(y + height));
                r[3] !== 0 && ctx.quadraticCurveTo(
                        x, y + height, x, y + height - r[3]
                        );
                ctx.lineTo( parseInt(x), parseInt(y + r[0]));
                r[0] !== 0 && ctx.quadraticCurveTo(x, y, x + r[0], y);
            },
            /**
             * 创建矩形路径
             * @param {Context2D} ctx Canvas 2D上下文
             * @param {Object} style 样式
             */
            draw : function(ctx, style) {
                if(!style.$model.radius.length) {
                    if(!!style.fillStyle){
                       ctx.fillRect( 0 , 0 ,this.context.width,this.context.height)
                    }
                    if(!!style.lineWidth){
                       ctx.strokeRect( 0 , 0 , this.context.width,this.context.height);
                    }
                } else {
                    this._buildRadiusPath(ctx, style);
                }
                return;
            },
      
            /**
             * 返回矩形区域，用于局部刷新和文字定位
             * @param {Object} style
             */
            getRect : function(style) {
                    var lineWidth;
                    var style = style ? style : this.context;
                    if (style.fillStyle || style.strokeStyle) {
                        lineWidth = style.lineWidth || 1;
                    }
                    else {
                        lineWidth = 0;
                    }
                    return {
                          x : Math.round(0 - lineWidth / 2),
                          y : Math.round(0 - lineWidth / 2),
                          width : this.context.width + lineWidth,
                          height : this.context.height + lineWidth
                    };
                }
      
        } );
        return Rect;
    } 
);
