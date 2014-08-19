KISSY.add('dvix/chart/bar/graphs-min', function (a, b, c, d) {
    var e = function (a, b) {
        this.w = 0, this.h = 0, this.pos = {
            x: 0,
            y: 0
        }, this._colors = [
            '#6f8cb2',
            '#c77029',
            '#f15f60',
            '#ecb44f',
            '#ae833a',
            '#896149'
        ], this.bar = { width: 12 }, this.bar.width = 12, this.sprite = null, _.deepExtend(this, a), this.init(b);
    };
    return e.prototype = {
        init: function () {
            this.sprite = new b.Display.Sprite({ id: 'graphsEl' });
        },
        setX: function (a) {
            this.sprite.context.x = a;
        },
        setY: function (a) {
            this.sprite.context.y = a;
        },
        getBarFillStyle: function (a, b, c) {
            var d = null;
            return _.isArray(this.bar.fillStyle) && (d = this.bar.fillStyle[b]), _.isFunction(this.bar.fillStyle) && (d = this.bar.fillStyle(a, b, c)), d && '' != d || (d = this._colors[b]), d;
        },
        checkBarW: function (a) {
            this.bar.width >= a && (this.bar.width = a - 1);
        },
        draw: function (a, d) {
            if (_.deepExtend(this, d), 0 != a.length) {
                for (var e = a[0].length, f = 0; e > f; f++) {
                    for (var g = new b.Display.Sprite({ id: 'barGroup' + f }), h = 0, i = a.length; i > h; h++) {
                        var j = a[h][f], k = new c({
                                context: {
                                    x: Math.round(j.x - this.bar.width / 2) + 0.5,
                                    y: parseInt(j.y) + 0.5,
                                    width: parseInt(this.bar.width),
                                    height: parseInt(Math.abs(j.y)),
                                    fillStyle: this.getBarFillStyle(f, h, j.value),
                                    radius: [
                                        this.bar.width / 2,
                                        this.bar.width / 2,
                                        0,
                                        0
                                    ]
                                }
                            });
                        g.addChild(k);
                    }
                    this.sprite.addChild(g);
                }
                this.setX(this.pos.x), this.setY(this.pos.y);
            }
        },
        grow: function () {
            function a() {
                c = requestAnimationFrame(a), d.update();
            }
            var b = this, c = null, e = function () {
                    new d.Tween({ h: 0 }).to({ h: b.h }, 500).onUpdate(function () {
                        b.sprite.context.scaleY = this.h / b.h;
                    }).onComplete(function () {
                        cancelAnimationFrame(c);
                    }).start();
                    a();
                };
            e();
        }
    }, e;
}, {
    requires: [
        'canvax/',
        'canvax/shape/Rect',
        'canvax/animation/Tween'
    ]
});