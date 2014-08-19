KISSY.add('dvix/components/tips/Nodes', function (a, b, c) {
    var d = function (a) {
        this.data = [], this.sprite = null, this.init(a);
    };
    return d.prototype = {
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
        },
        _configData: function (a) {
            var b = this;
            a && (b.data = a.data || b.data);
        },
        _widget: function () {
            for (var a = this, b = a.data, d = 0, e = b.length; e > d; d++) {
                var f = b[d], g = f.radius || 4, h = f.fillStyle || '#000000', i = f.strokeStyle || '#000000', j = f.thinkness || 0 == f.thinkness ? f.thinkness : 1.5, k = new c({
                        context: {
                            r: g,
                            fillStyle: h,
                            strokeStyle: i,
                            lineWidth: j
                        }
                    });
                a.sprite.addChild(k), k.context.x = f.x, k.context.y = f.y;
            }
        }
    }, d;
}, {
    requires: [
        'canvax/',
        'canvax/shape/Circle',
        'dvix/utils/tools'
    ]
});