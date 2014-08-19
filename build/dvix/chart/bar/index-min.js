KISSY.add('dvix/chart/bar/index-min', function (a, b, c, d, e, f, g, h, i, j) {
    var k = b.Canvax;
    return b.extend({
        init: function () {
            this.dataFrame = null, this._xAxis = null, this._yAxis = null, this._back = null, this._graphs = null, this._tips = null, this.stageTip = new k.Display.Sprite({ id: 'tip' }), this.core = new k.Display.Sprite({ id: 'core' }), this.stageBg = new k.Display.Sprite({ id: 'bg' }), this.stage.addChild(this.stageBg), this.stage.addChild(this.core), this.stage.addChild(this.stageTip);
        },
        draw: function (a, b) {
            b.rotate && this.rotate(b.rotate), this.dataFrame = this._initData(a, b), this._initModule(b, this.dataFrame), this._startDraw(), this._drawEnd(), this._arguments = arguments;
        },
        clear: function () {
            this.stageBg.removeAllChildren(), this.core.removeAllChildren(), this.stageTip.removeAllChildren();
        },
        reset: function (a, b) {
            this.clear(), this.width = parseInt(this.element.width()), this.height = parseInt(this.element.height()), this.draw(a, b);
        },
        _initModule: function (a, b) {
            this._xAxis = new f(a.xAxis, b.xAxis), this._yAxis = new g(a.yAxis, b.yAxis), this._back = new h(a.back), this._graphs = new i(a.graphs), this._tips = new j(a.tips);
        },
        _startDraw: function () {
            var a = this, b = 0, c = this.height - this._xAxis.h;
            a._yAxis.draw({
                pos: {
                    x: 0,
                    y: c
                },
                yMaxHeight: c
            }), b = a._yAxis.w, a._xAxis.draw({
                w: a.width - b,
                max: { left: -b },
                pos: {
                    x: b,
                    y: c
                }
            }), a._back.draw({
                w: a.width - b,
                h: c,
                xAxis: { data: a._yAxis.data },
                pos: {
                    x: b + this._xAxis.disOriginX,
                    y: c
                }
            }), this._graphs.draw(this._trimGraphs(), {
                w: this._xAxis.xGraphsWidth,
                h: this._yAxis.yGraphsHeight,
                pos: {
                    x: b + this._xAxis.disOriginX,
                    y: c
                }
            }), a._graphs.grow();
        },
        _trimGraphs: function () {
            var a = this._xAxis.data, b = this._yAxis.dataOrg, c = b.length, d = this._xAxis.xDis1, e = d / (c + 1);
            this._graphs.checkBarW(e);
            for (var f = this._yAxis.dataSection[this._yAxis.dataSection.length - 1], g = [], h = 0, i = a.length; i > h; h++)
                for (var j = 0; c > j; j++) {
                    !g[j] && (g[j] = []);
                    var k = -(b[j][h] - this._yAxis._baseNumber) / (f - this._yAxis._baseNumber) * this._yAxis.yGraphsHeight, l = a[h].x - d / 2 + e * (j + 1);
                    g[j][h] = {
                        value: b[j][h],
                        x: l,
                        y: k
                    };
                }
            return g;
        },
        _drawEnd: function () {
            var a = this;
            a.stageBg.addChild(a._back.sprite), a.core.addChild(a._xAxis.sprite), a.core.addChild(a._graphs.sprite), a.core.addChild(a._yAxis.sprite), a.stageTip.addChild(a._tips.sprite);
        }
    });
}, {
    requires: [
        'dvix/chart/',
        'dvix/utils/tools',
        'dvix/utils/datasection',
        'dvix/event/eventtype',
        './xaxis',
        'dvix/components/yaxis/yAxis',
        'dvix/components/back/Back',
        './graphs',
        'dvix/components/tips/Tips'
    ]
});