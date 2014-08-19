KISSY.add('dvix/components/back/Back', function (a, b, c) {
    var d = b.Canvax, e = function (a) {
            this.w = 0, this.h = 0, this.pos = {
                x: 0,
                y: 0
            }, this.xOrigin = {
                enabled: 1,
                thinkness: 1,
                strokeStyle: '#cccccc'
            }, this.yOrigin = {
                enabled: 1,
                thinkness: 1,
                strokeStyle: '#BEBEBE'
            }, this.xAxis = {
                enabled: 1,
                w: 0,
                data: [],
                lineType: 'dashed',
                thinkness: 1,
                strokeStyle: '#cccccc'
            }, this.yAxis = {
                enabled: 1,
                h: 0,
                data: [],
                lineType: 'dashed',
                thinkness: 1,
                strokeStyle: '#BEBEBE'
            }, this.sprite = null, this.xOriginSp = null, this.yOriginSp = null, this.xAxisSp = null, this.yAxisSp = null, this.init(a);
        };
    return e.prototype = {
        init: function (a) {
            _.deepExtend(this, a), this.sprite = new d.Display.Sprite();
        },
        setX: function (a) {
            this.sprite.context.x = a;
        },
        setY: function (a) {
            this.sprite.context.y = a;
        },
        draw: function (a) {
            _.deepExtend(this, a), this._configData(a), this._widget(), this.setX(this.pos.x), this.setY(this.pos.y);
        },
        _configData: function (a) {
            var b = this;
            b.w = a.w || 0, b.h = a.h || 0, a.xAxis && (b.xAxis.w = a.xAxis.w || b.w, b.xAxis.data = a.xAxis.data), a.yAxis && (b.yAxis.h = a.yAxis.h || b.h, b.yAxis.data = a.yAxis.data);
        },
        _widget: function () {
            var a = this;
            a.xAxisSp = new d.Display.Sprite(), a.sprite.addChild(a.xAxisSp), a.yAxisSp = new d.Display.Sprite(), a.sprite.addChild(a.yAxisSp), a.xOriginSp = new d.Display.Sprite(), a.sprite.addChild(a.xOriginSp), a.yOriginSp = new d.Display.Sprite(), a.sprite.addChild(a.yOriginSp);
            for (var b = a.xAxis.data, e = 1, f = b.length; f > e; e++) {
                var g = b[e], h = new c({
                        context: {
                            xStart: 0,
                            yStart: g.y,
                            xEnd: a.xAxis.w,
                            yEnd: g.y,
                            lineType: a.xAxis.lineType,
                            lineWidth: a.xAxis.thinkness,
                            strokeStyle: a.xAxis.strokeStyle
                        }
                    });
                a.xAxis.enabled && a.xAxisSp.addChild(h);
            }
            for (var b = a.yAxis.data, e = 1, f = b.length; f > e; e++) {
                var g = b[e], h = new c({
                        context: {
                            xStart: g.x,
                            yStart: 0,
                            xEnd: g.x,
                            yEnd: -a.yAxis.h,
                            lineType: a.yAxis.lineType,
                            lineWidth: a.yAxis.thinkness,
                            strokeStyle: a.yAxis.strokeStyle
                        }
                    });
                a.yAxis.enabled && a.yAxisSp.addChild(h);
            }
            var h = new c({
                    context: {
                        xEnd: 0,
                        yEnd: -a.h,
                        lineWidth: a.yOrigin.thinkness,
                        strokeStyle: a.yOrigin.strokeStyle
                    }
                });
            a.yOrigin.enabled && a.yOriginSp.addChild(h);
            var h = new c({
                    context: {
                        xEnd: a.w,
                        yEnd: 0,
                        lineWidth: a.xOrigin.thinkness,
                        strokeStyle: a.xOrigin.strokeStyle
                    }
                });
            a.xOrigin.enabled && a.xOriginSp.addChild(h), h.context.y = -0.5;
        }
    }, e;
}, {
    requires: [
        'dvix/',
        'canvax/shape/Line',
        'dvix/utils/tools',
        'dvix/utils/deep-extend'
    ]
});