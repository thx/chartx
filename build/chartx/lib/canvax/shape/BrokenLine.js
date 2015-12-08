/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 折线 类
 *
 * 对应context的属性有
 * @pointList 各个顶角坐标
 **/

define(
    "canvax/shape/BrokenLine", [
        "canvax/display/Shape",
        "canvax/core/Base",
        "canvax/geom/SmoothSpline"
    ],
    function(Shape, Base, SmoothSpline) {
        var BrokenLine = function(opt , atype) {
            var self = this;
            self.type = "brokenline";
            self._drawTypeOnly = "stroke";
            opt = Base.checkOpt(opt);
            if( atype !== "clone" ){
                self._initPointList(opt.context);
            };
            self._context = _.deepExtend({
                lineType: null,
                smooth: false,
                pointList: [], //{Array}  // 必须，各个顶角坐标
                smoothFilter: null
            }, opt.context );

            arguments.callee.superclass.constructor.apply(this, arguments);
        };

        Base.creatClass(BrokenLine, Shape, {
            $watch: function(name, value, preValue) {
                if (name == "pointList") {
                    this._initPointList(this.context, value, preValue);
                }
            },
            _initPointList: function(context, value, preValue) {
                var myC = context;
                if (myC.smooth) {
                    //smoothFilter -- 比如在折线图中。会传一个smoothFilter过来做point的纠正。
                    //让y不能超过底部的原点
                    var obj = {
                        points: myC.pointList
                    }
                    if (_.isFunction(myC.smoothFilter)) {
                        obj.smoothFilter = myC.smoothFilter;
                    }
                    this._notWatch = true; //本次转换不出发心跳
                    var currL = SmoothSpline(obj);

                    if (value) {
                        currL[currL.length - 1][0] = value[value.length - 1][0];
                    };
                    myC.pointList = currL;
                    this._notWatch = false;
                };
            },
            //polygon需要覆盖draw方法，所以要把具体的绘制代码作为_draw抽离出来
            draw: function(ctx, context) {
                this._draw(ctx, context);
            },
            _draw: function(ctx, context) {
                var pointList = context.pointList;
                if (pointList.length < 2) {
                    // 少于2个点就不画了~
                    return;
                };
                if (!context.lineType || context.lineType == 'solid') {
                    //默认为实线
                    //TODO:目前如果 有设置smooth 的情况下是不支持虚线的
                    ctx.moveTo(pointList[0][0], pointList[0][1]);
                    for (var i = 1, l = pointList.length; i < l; i++) {
                        ctx.lineTo(pointList[i][0], pointList[i][1]);
                    };
                } else if (context.lineType == 'dashed' || context.lineType == 'dotted') {
                    if (context.smooth) {
                        for (var si = 0, sl = pointList.length; si < sl; si++) {
                            if (si == sl-1) {
                                break;
                            };
                            ctx.moveTo( pointList[si][0] , pointList[si][1] );
                            ctx.lineTo( pointList[si+1][0] , pointList[si+1][1] );
                            si+=1;
                        };
                    } else {
                        //画虚线的方法  
                        ctx.moveTo(pointList[0][0], pointList[0][1]);
                        for (var i = 1, l = pointList.length; i < l; i++) {
                            var fromX = pointList[i - 1][0];
                            var toX = pointList[i][0];
                            var fromY = pointList[i - 1][1];
                            var toY = pointList[i][1];
                            this.dashedLineTo(ctx, fromX, fromY, toX, toY, 5);
                        };
                    }
                };
                return;
            },
            getRect: function(context) {
                var context = context ? context : this.context;
                return this.getRectFormPointList(context);
            }
        });
        return BrokenLine;
    }
);