KISSY.add('dvix/chart/bar/graphs-min', function (a, b, c, d) {
    var e = b.Canvax, f = function (a, b) {
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
            ], this.barW = 12, this.sprite = null, _.deepExtend(this, a), this.init(b);
        };
    return f.prototype = {
        init: function () {
            this.sprite = new e.Display.Sprite({ id: 'graphsEl' });
        },
        setX: function (a) {
            this.sprite.context.x = a;
        },
        setY: function (a) {
            this.sprite.context.y = a;
        },
        getFillStyle: function (a, b, c) {
            var d = null;
            return _.isArray(this.fillStyle) && (d = this.fillStyle[b]), _.isFunction(this.fillStyle) && (d = this.fillStyle(a, b, c)), d && '' != d || (d = this._colors[b]), d;
        },
        checkBarW: function (a) {
            this.barW >= a && (this.barW = a - 1);
        },
        draw: function (a, b) {
            if (_.deepExtend(this, b), 0 != a.length) {
                for (var d = a[0].length, f = 0; d > f; f++) {
                    for (var g = new e.Display.Sprite({ id: 'barGroup' + f }), h = 0, i = a.length; i > h; h++) {
                        var j = a[h][f], k = new c({
                                context: {
                                    x: Math.round(j.x - this.barW / 2),
                                    y: j.y,
                                    width: this.barW,
                                    height: Math.abs(j.y),
                                    fillStyle: this.getFillStyle(f, h, j.value),
                                    radius: [
                                        this.barW / 2,
                                        this.barW / 2,
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
    }, f;
}, {
    requires: [
        'dvix/',
        'canvax/shape/Rect',
        'canvax/animation/Tween'
    ]
});