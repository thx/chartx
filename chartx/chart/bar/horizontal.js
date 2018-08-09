define(
    "chartx/chart/bar/horizontal", [
        'chartx/chart/bar/index'
    ],
    function(Bar) {
        return Bar.extend({
            _init: function(node, data, opts) {
                _.deepExtend(this, {
                    xAxis: {
                        text: {
                            rotation: 90
                        }
                    },
                    yAxis: {
                        text: {
                            rotation: 90
                        }
                    }
                });
                this.dataFrame = this._initData(data);
            },
            draw: function() {
                this._setStages();
                this._initModule(); //初始化模块
                this._startDraw({
                    w: this.height,
                    h: this.width
                }); //开始绘图
                this._horizontal();
                this._drawEnd(); //绘制结束，添加到舞台
            },
            _horizontal: function() {
                var me = this;

                _.each([me.core.context, me.stageBg.context], function(ctx) {
                    ctx.x += (me.width - me.height) / 2;
                    ctx.y += (me.height - me.width) / 2;
                    ctx.rotation = 90;
                    ctx.rotateOrigin.x = me.height / 2;
                    ctx.rotateOrigin.y = me.width / 2;

                    ctx.scaleOrigin.x = me.height / 2;
                    ctx.scaleOrigin.y = me.width / 2;
                    ctx.scaleX = -1;
                });


                _.each(me._graphs.txtsSp.children, function(childSp) {
                    _.each(childSp.children, function(cs) {
                        var ctx = cs.context;
                        var w = ctx.width;
                        var h = ctx.height;

                        ctx.scaleOrigin.x = w / 2;
                        ctx.scaleOrigin.y = h / 2;
                        ctx.scaleX = -1;

                        ctx.rotation = 90;
                        ctx.rotateOrigin.x = w / 2;
                        ctx.rotateOrigin.y = h / 2;

                        var _cfy = cs._finalY;
                        cs._finalY -= w / 2 - h / 2;
                        ctx.y -= w / 2 - h / 2;

                        //TODO:这里暂时还不是最准确的计算， 后续完善
                        if( Math.abs(_cfy)+w > me._graphs.h ){
                            cs._finalY = -me._graphs.h + w / 2;
                        }
                    });
                });


                //把x轴文案做一次镜像反转
                _.each(this._xAxis.rulesSprite.children, function(xnode) {
                    var ctx = xnode._txt.context;
                    var rect = xnode._txt.getRect();
                    ctx.scaleOrigin.x = rect.x + rect.width / 2;
                    ctx.scaleOrigin.y = rect.y + rect.height / 2;
                    ctx.scaleY = -1
                });

                //把y轴文案做一次镜像反转
                _.each(this._yAxis.rulesSprite.children, function(ynode) {
                    var ctx = ynode._txt.context;
                    var rect = ynode._txt.getRect();
                    ctx.scaleOrigin.x = rect.x + rect.width / 2;
                    ctx.scaleOrigin.y = rect.y + rect.height / 2;
                    ctx.scaleY = -1
                });

            }
        });
    }
);