/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 多边形 类  （不规则）
 *
 *
 * 对应context的属性有
 * @lineType 边框类型 可以是 dashed or solid
 * @pointList 多边形各个顶角坐标
 **/


define(
    "canvax/shape/Polygon",
    [
        "canvax/display/Shape",
        "canvax/core/Base"
    ],
    function(Shape , Base){

        var Polygon=function(opt){
            var self = this;
            self.type = "polygon";
            self._hasFillAndStroke = true;
            opt = Base.checkOpt( opt );
            self._context = {
                lineType      : opt.context.lineType  || null,
                pointList     : opt.context.pointList || []  //{Array},   // 必须，多边形各个顶角坐标
            }
            arguments.callee.superclass.constructor.apply(this, arguments);
     
        };
     
       
        Base.creatClass( Polygon , Shape , {
            draw : function(ctx, style) {
                ctx.save();
                ctx.beginPath();
                this.buildPath(ctx, style);
                ctx.closePath();
     
                if ( style.strokeStyle || style.lineWidth ) {
                    ctx.stroke();
                }
     
                if (style.fillStyle) {
                    if (style.lineType == 'dashed' || style.lineType == 'dotted') {
                           // 特殊处理，虚线围不成path，实线再build一次
                           ctx.beginPath();
                           this.buildPath(
                               ctx, 
                               {
                                lineType  :  "solid",
                                lineWidth : style.lineWidth,
                                pointList : style.pointList
                               }
                               );
                           ctx.closePath();
                       }
                    ctx.fill();
                }
     
                ctx.restore();
     
                return true;
         
            },
            buildPath : function(ctx, style) {
                var pointList = style.pointList;
                // 开始点和结束点重复
                var start = pointList[0];
                var end = pointList[pointList.length-1];
                if (start && end) {
                    if (start[0] == end[0] &&
                        start[1] == end[1]) {
                            // 移除最后一个点
                            pointList.pop();
                        }
                }
                if (pointList.length < 2) {
                    return;
                }
             
                if (!style.lineType || style.lineType == 'solid') {
                    //默认为实线
                    ctx.moveTo(pointList[0][0],pointList[0][1]);
                    for (var i = 1, l = pointList.length; i < l; i++) {
                        ctx.lineTo(pointList[i][0],pointList[i][1]);
                    }
                    ctx.lineTo(pointList[0][0], pointList[0][1]);
                } else if (style.lineType == 'dashed' || style.lineType == 'dotted') {
                    var dashLength= (style.lineWidth || 1)*(style.lineType == 'dashed'? 5 : 1 );
                    ctx.moveTo(pointList[0][0],pointList[0][1]);
                    for (var i = 1, l = pointList.length; i < l; i++) {
                        this.dashedLineTo(
                                ctx,
                                pointList[i - 1][0], pointList[i - 1][1],
                                pointList[i][0], pointList[i][1],
                                dashLength
                                );
                    }
                    this.dashedLineTo(
                            ctx,
                            pointList[pointList.length - 1][0], 
                            pointList[pointList.length - 1][1],
                            pointList[0][0],
                            pointList[0][1],
                            dashLength
                            );
                }
                
                return;
            },
            getRect : function(context) {
                var context = context ? context : this.context;
                return this.getRectFormPointList( context );
            }
     
        } );
     
        return Polygon;
    }
);
