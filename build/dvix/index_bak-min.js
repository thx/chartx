KISSY.add('dvix/index', function (a) {
    function b() {
        return !!document.createElement('canvas').getContext;
    }
    function c(b, c) {
        a.use('dvix/chart/' + b.name.toLowerCase() + '/', function (a, d) {
            b = new d(b.el), c(b);
        });
    }
    function d(a) {
        return function (b) {
            this.name = a, this.el = b;
            var c = this;
            this._readyHand = [], this.done = function (a) {
                this.chart ? a.apply(this, [this.chart]) : this._readyHand.push(a);
            }, i(this, function (a) {
                if (c.chart = a, c._readyHand.length > 0)
                    for (var b = 0, d = c._readyHand.length; d > b; b++)
                        c.done(c._readyHand[b]);
            });
        };
    }
    window.Site = {
        local: !!~location.search.indexOf('local'),
        daily: !!~location.search.indexOf('daily'),
        debug: !!~location.search.indexOf('debug'),
        build: !!~location.search.indexOf('build')
    };
    var e = 'http://g.tbcdn.cn/thx/charts';
    Site.local && (e = './'), Site.daily && (e = 'http://g.assets.daily.taobao.net/thx/canvax/1.0.0/'), KISSY.config({
        packages: [
            {
                name: 'dvix',
                path: e,
                debug: Site.debug
            },
            {
                name: 'canvax',
                path: 'http://g.tbcdn.cn/thx/',
                debug: Site.debug
            }
        ]
    });
    var f = [];
    b() || f.push('http://g.tbcdn.cn/thx/canvax/library/flashCanvas/flashcanvas.js');
    var g = !1, h = [], i = function (b, d) {
            !g && f.length > 0 ? (b && d && h.push({
                chart: b,
                callback: d
            }), function () {
                var b = arguments.callee;
                a.getScript(f.shift(), {
                    success: function () {
                        f.length > 0 ? b() : (g = !0, h.length > 0 && !function () {
                            var a = arguments.callee, b = h.shift();
                            c(b.chart, function (c) {
                                b.callback(c), h.length > 0 && a();
                            });
                        }());
                    }
                });
            }()) : c(b, d);
        };
    i();
    var j = {};
    return j.BrokenLine = d('brokenline'), j.upLoading = d('uploading'), j;
});