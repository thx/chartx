KISSY.add('dvix/components/tips/Tips', function (a, b, c, d, e) {
    var f = b.Canvax, g = function (a) {
            this.w = 0, this.h = 0, this.opt = {
                disTop: 30,
                dis: 2,
                context: null
            }, this.config = {
                tip: {
                    x: 0,
                    y: 0,
                    data: []
                },
                line: {
                    x: '',
                    y: ''
                },
                nodes: { data: [] }
            }, this.sprite = null, this.line = null, this.tip = null, this.nodes = null, this.init(a);
        };
    return g.prototype = {
        init: function (a) {
            var b = this;
            b._initConfig(a), b.sprite = new f.Display.Sprite();
        },
        setX: function (a) {
            this.sprite.context.x = a;
        },
        setY: function (a) {
            this.sprite.context.y = a;
        },
        draw: function (a) {
            var b = this;
            b._initModule(), b._configData(a), b._startDraw(), b._endDraw();
        },
        remove: function () {
            var a = this;
            a._remove();
        },
        _initConfig: function (a) {
            var b = this;
            a && (b.opt.dis = a.dis || 0 == a.dis ? a.dis : b.opt.dis, b.opt.disTop = a.disTop || 0 == a.disTop ? a.disTop : b.opt.disTop, b.opt.context = a.context, b.opt.tip = a.tip, b.opt.line = a.line, b.opt.nodes = a.nodes);
        },
        _initModule: function () {
            var a = this;
            a.opt.tip && (a.tip = new c(a.opt.tip)), a.opt.line && (a.line = new d(a.opt.line)), a.opt.nodes && (a.nodes = new e(a.opt.nodes));
        },
        _configData: function (a) {
            var b = this;
            if (a) {
                b.w = a.w || b.w, b.h = a.h || b.h;
                var c = a.tip;
                c && (b.config.tip.x = c.x || b.config.tip.x, b.config.tip.y = c.y || b.config.tip.y, b.config.tip.data = c.data || b.config.tip.data);
                var d = a.line;
                d && (b.config.line = a.line);
                var e = a.nodes;
                e && (b.config.nodes = a.nodes);
            }
        },
        _remove: function () {
            var a = this;
            a.sprite.removeAllChildren(), a.line = null, a.tip = null, a.nodes = null;
        },
        _startDraw: function () {
            var a = this;
            if (a.opt.tip) {
                a.tip.draw({ data: a.config.tip.data });
                var b = a.config.tip.x, c = a.config.tip.y, d = a._allShow(a.w, a.h, {
                        w: a.tip.w,
                        h: a.tip.h
                    }, {
                        x: b,
                        y: c
                    }, a.opt.dis);
                b = d.x, c = d.y, a.tip.setX(b), a.tip.setY(c);
            }
            a.opt.line && (a.line.draw(a.config.line), a.line.setX(a.config.line.x), a.line.setY(a.config.line.y)), a.opt.nodes && a.nodes.draw(a.config.nodes);
        },
        _endDraw: function () {
            var a = this;
            a.opt.line && a.sprite.addChild(a.line.sprite), a.opt.nodes && a.sprite.addChild(a.nodes.sprite), a.opt.tip && a.sprite.addChild(a.tip.sprite);
        },
        _allShow: function (a, b, c, d, e) {
            var f = e || 0 == e ? e : 4, g = a, h = b, i = d.x, j = d.y;
            return d.x - c.w / 2 < f && (i = c.w / 2 + f), d.x + c.w / 2 > g - f && (i = g - c.w / 2 - f), d.y - c.h / 2 < f && (j = c.h / 2 + f), d.y + c.h / 2 > h - f && (j = h - c.h / 2 - f), {
                x: i,
                y: j
            };
        }
    }, g;
}, {
    requires: [
        'dvix/',
        'dvix/components/tips/Tip',
        'dvix/components/tips/Line',
        'dvix/components/tips/Nodes',
        'dvix/utils/tools'
    ]
});