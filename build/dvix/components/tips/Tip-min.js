KISSY.add('dvix/components/tips/Tip', function (a, b, c, d, e) {
    var f = function (a) {
        this.w = 0, this.h = 0, this.data = [[
                1,
                2
            ]], this.text = {
            disX: 4,
            disY: 4
        }, this.back = {
            enabled: 1,
            disX: 28,
            disY: 11,
            strokeStyle: '#333333',
            thinkness: 1.5,
            fillStyle: '#FFFFFF',
            radius: [
                4,
                4,
                4,
                4
            ]
        }, this._lay = {
            x_maxH: [],
            y_maxW: [],
            y_maxAllW: []
        }, this.sprite = null, this.widgetSp = null, this.txtSp = null, this.backSp = null, this.init(a);
    };
    return f.prototype = {
        init: function (a) {
            var c = this;
            c._initConfig(a), c.sprite = new b.Display.Sprite();
        },
        setX: function (a) {
            this.sprite.context.x = a;
        },
        setY: function (a) {
            this.sprite.context.y = a;
        },
        draw: function (a) {
            var b = this;
            b._configData(a), b._widget();
        },
        _initConfig: function (a) {
            var b = this;
            if (a) {
                var c = a.text;
                c && (b.text.disX = c.disX || b.text.disX, b.text.disY = c.disY || b.text.disY);
                var d = a.back;
                d && (b.back.enabled = 0 == d.enabled ? 0 : b.back.enabled, b.back.disX = d.disX || 0 == d.disX ? d.disX : b.back.disX, b.back.disY = d.disY || 0 == d.disY ? d.disY : b.back.disY, b.back.strokeStyle = d.strokeStyle || b.back.strokeStyle, b.back.thinkness = d.thinkness || b.back.thinkness, b.back.fillStyle = d.fillStyle || b.back.fillStyle, b.back.radius = d.radius || b.back.radius);
            }
        },
        _configData: function (a) {
            var b = this;
            a && (b.data = a.data || b.data);
        },
        _widget: function () {
            var a = this;
            a.widgetSp = new b.Display.Sprite(), a.sprite.addChild(a.widgetSp), a.backSp = new b.Display.Sprite(), a.widgetSp.addChild(a.backSp), a.txtSp = new b.Display.Sprite(), a.widgetSp.addChild(a.txtSp);
            var f = a._lay, g = a.data.length, h = 0;
            a.data[0] && (h = a.data[0].length);
            for (var i = 0, j = a.data.length; j > i; i++) {
                var k = 0, l = new b.Display.Sprite();
                a.txtSp.addChild(l);
                for (var m = 0, n = a.data[i].length; n > m; m++) {
                    var o = a.data[i][m], p = o.bold || 'normal', q = o.fillStyle || '#000000', r = o.fontSize || 13, s = e.numAddSymbol(o.content) || '', t = new b.Display.Text(s, {
                            context: {
                                fillStyle: q,
                                fontSize: r,
                                fontWeight: p
                            }
                        });
                    if (l.addChild(t), k = Math.max(k, t.getTextHeight()), f.y_maxW[m] || (f.y_maxW[m] = 0, f.y_maxAllW[m] = 0), f.y_maxW[m] < t.getTextWidth() && (f.y_maxW[m] = t.getTextWidth(), f.y_maxAllW[m] = f.y_maxW[m]), o.sign && o.sign.enabled) {
                        var u = o.sign.radius || 4, v = o.sign.disX || 4;
                        f.y_maxAllW[m] = Number(f.y_maxW[m]) + 2 * Number(u) + Number(v);
                    }
                }
                f.x_maxH.push(k);
            }
            for (var w = 0, x = a.data.length; x > w; w++)
                for (var l = a.txtSp.getChildAt(w), y = 0, z = a.data[w].length; z > y; y++) {
                    var o = a.data[w][y], t = l.getChildAt(y), A = e.getArrMergerNumber(f.y_maxAllW, 0, y - 1) + y * a.text.disY, B = w > 0 ? e.getArrMergerNumber(f.x_maxH, 0, w - 1) + w * a.text.disX : 0;
                    l.context.y = B, B = 0;
                    var C = o.y_align || 2, D = o.x_align || 2;
                    if (2 == C ? A += (f.y_maxAllW[y] - t.getTextWidth()) / 2 : 3 == C && (A = A + f.y_maxAllW[y] - t.getTextWidth()), 2 == D ? B += (f.x_maxH[w] - t.getTextHeight()) / 2 : 3 == D && (B = B + f.x_maxH[w] - t.getTextHeight()), o.sign) {
                        var u = o.sign.radius || 4, v = o.sign.disX || 4, q = o.sign.fillStyle || '#000000';
                        if (o.sign.enabled && o.sign.trim) {
                            var E = new c({
                                    context: {
                                        r: u,
                                        fillStyle: q
                                    }
                                });
                            l.addChild(E), E.context.x = parseInt(u), E.context.y = parseInt(B + t.getTextHeight() / 2), A = E.context.x + u + v;
                        }
                    }
                    A = parseInt(A), B = parseInt(B), t.context.x = A, t.context.y = B;
                }
            var F, G, H = (h - 1) * a.text.disY, I = (g - 1) * a.text.disX;
            a.back.enabled || (a.back.disX = 0, a.back.disY = 0), a.txtSp.context.x = a.back.disX, a.txtSp.context.y = a.back.disY, F = e.getArrMergerNumber(f.y_maxAllW) + 2 * a.back.disX + H, G = e.getArrMergerNumber(f.x_maxH) + 2 * a.back.disY + I, a.w = F, a.h = G;
            var A = parseInt(-F / 2), B = parseInt(-G / 2);
            a.widgetSp.context.x = A, a.widgetSp.context.y = B, a.back.enabled && a.backSp.addChild(new d({
                context: {
                    width: F,
                    height: G,
                    strokeStyle: a.back.strokeStyle,
                    lineWidth: a.back.thinkness,
                    fillStyle: a.back.fillStyle,
                    radius: a.back.radius
                }
            }));
        }
    }, f;
}, {
    requires: [
        'canvax/',
        'canvax/shape/Circle',
        'canvax/shape/Rect',
        'dvix/utils/tools'
    ]
});