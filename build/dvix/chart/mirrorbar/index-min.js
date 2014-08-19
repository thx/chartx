KISSY.add('dvix/chart/mirrorbar/', function (a, b, c, d, e, f, g, h, i) {
    var j = b.Canvax;
    window.Canvax = j;
    var k = function () {
        this.version = '0.1', this.type = 'mirrorbar', this.canvax = null, this.element = null, this.width = 0, this.height = 0, this.config = {
            mode: 1,
            dataSection: { maxPart: 9 },
            event: { enabled: 1 }
        }, this.dataFrame = {
            org: [],
            data: [],
            yAxis: {
                fields: [],
                org: [],
                section: {
                    length: 2,
                    org: [],
                    _org: [],
                    data: [],
                    _data: [],
                    maxs: [],
                    _maxs: [],
                    _baseNumber: 0,
                    spanABS: 0
                },
                data: []
            },
            graphs: {
                data: [],
                disX: 0
            }
        }, this._chartWidth = 0, this._chartHeight = 0, this._chartCenterY = 0, this._disX = 10, this._disY = 10, this._disYAndO = 6, this._yMaxHeight = 0, this._yGraphsHeight = 0, this._xMaxWidth = 0, this._xGraphsWidth = 0, this._baseNumber = 0, this._yAxis = null, this._back = null, this._graphs = null, this._tips = null, this.init.apply(this, arguments);
    };
    return k.prototype = {
        init: function (a) {
            var b = this;
            b.element = a, b.width = parseInt(a.width()), b.height = parseInt(a.height()), b.canvax = new j({ el: b.element }), b.stageTip = new j.Display.Stage({
                id: 'tip',
                context: {
                    x: 0.5,
                    y: 0.5
                }
            }), b.stage = new j.Display.Stage({
                id: 'core',
                context: {
                    x: 0.5,
                    y: 0.5
                }
            }), b.stageBg = new j.Display.Stage({
                id: 'bg',
                context: {
                    x: 0.5,
                    y: 0.5
                }
            });
        },
        draw: function (a, b) {
            var c = this;
            c._initConfig(a, b), c._initModule(b), c._initData(), c._startDraw(), c._drawEnd();
        },
        _initConfig: function (a, b) {
            var c = this;
            if (c.dataFrame.org = a, b) {
                c.config.mode = b.mode || c.config.mode, c._disX = b.disX || c._disX, c._disY = b.disY || c._disY, c._disYAndO = b.disYAndO || 0 == b.disYAndO ? b.disYAndO : c._disYAndO;
                var d = b.event;
                d && (c.config.event.enabled = 0 == d.enabled ? 0 : c.config.event.enabled);
                var e = b.yAxis;
                e && (c.dataFrame.yAxis.fields = e.fields || c.dataFrame.yAxis.fields);
            }
        },
        _initModule: function (a) {
            var b = this;
            b._yAxis = new f(a.yAxis), b._back = new g(a.back), b._graphs = new h(a.graphs), b._tips = new i(a.tips);
        },
        _initData: function () {
            for (var a = this, b = [], c = a.dataFrame.org, d = 0, e = c[0].length; e > d; d++) {
                var f = {};
                f.field = c[0][d], f.index = d, f.data = [], b.push(f);
            }
            for (var d = 1, e = c.length; e > d; d++)
                for (var g = 0, h = c[d].length; h > g; g++)
                    b[g].data.push(c[d][g]);
            a.dataFrame.data = b;
            for (var c = a.dataFrame.data, d = 0, e = c.length; e > d; d++) {
                var f = c[d];
                if (0 == a.dataFrame.yAxis.fields.length)
                    0 != d && a.dataFrame.yAxis.org.push(f.data);
                else
                    for (var g = 0, h = a.dataFrame.yAxis.fields.length; h > g; g++)
                        f.field == a.dataFrame.yAxis.fields[g] && (a.dataFrame.yAxis.org[g] = f.data);
            }
        },
        _startDraw: function () {
            var a = this;
            a._trimSection(), a._chartWidth = a.width - 2 * a._disX, a._chartHeight = a.height - 2 * a._disY, a._yMaxHeight = a._chartHeight, a._yGraphsHeight = a._yMaxHeight, a._trimYAxis();
            var b = a._disX, c = a.height - a._disY;
            a._yAxis.draw({ data: a.dataFrame.yAxis.data }), a._yAxis.setX(b), a._yAxis.setY(c);
            var d = a._yAxis.w;
            2 == a.config.mode && (d = 0, a._disYAndO = 0), b = a._disX + d + a._disYAndO, a._xMaxWidth = a._chartWidth - d - a._disYAndO, a._xGraphsWidth = a._xMaxWidth, a._back.draw({
                w: a._chartWidth - d - a._disYAndO,
                h: c,
                xAxis: { data: a.dataFrame.yAxis.data }
            }), a._back.setX(b), a._back.setY(c), a._graphs.draw({
                w: a._xGraphsWidth,
                h: a._yGraphsHeight,
                data: a.dataFrame.graphs.data,
                disX: a.dataFrame.graphs.disX
            }), a._graphs.setX(b), a._graphs.setY(c), a.config.event.enabled && (a._graphs.sprite.on(e.HOLD, function (b) {
                a._onInduceHandler(b);
            }), a._graphs.sprite.on(e.DRAG, function (b) {
                a._onInduceHandler(b);
            }), a._graphs.sprite.on(e.RELEASE, function (b) {
                a._offInduceHandler(b);
            }));
        },
        _trimSection: function () {
            var b = this;
            console.log(b.dataFrame.yAxis.org);
            var c = b._getSection();
            b.dataFrame.yAxis.section.org = c.section, b.dataFrame.yAxis.section._org = c._section;
            var d = a.clone(b.dataFrame.yAxis.section.org), e = d.shift(), f = d.pop();
            b.dataFrame.yAxis.section.maxs.push(e), b.dataFrame.yAxis.section.maxs.push(f);
            var g = e + f;
            b.dataFrame.yAxis.section.data = d, b.dataFrame.yAxis.section.spanABS = g;
            var h = a.clone(b.dataFrame.yAxis.section._org), e = h.shift(), f = h.pop();
            b.dataFrame.yAxis.section._maxs.push(e), b.dataFrame.yAxis.section._maxs.push(f), b.dataFrame.yAxis.section._data = h, console.log(b.dataFrame.yAxis.section);
        },
        _getSection: function () {
            var b = this, c = [], e = [], f = b.dataFrame.yAxis.org, g = parseInt((b.config.dataSection.maxPart - 1) / 2);
            f.length <= 1 && f.push([0]);
            var h = d.section(f[0], g, { mode: 1 }), i = d.section(f[1], g, { mode: 1 }), j = h[h.length - 1], k = i[i.length - 1];
            j >= k ? i = a.clone(h) : h = a.clone(i), 0 == h[0] ? i.shift() : i.unshift(0), h.sort(function (a, b) {
                return b - a;
            });
            for (var l = [], m = 0, n = h.length; n > m; m++)
                l.push(-h[m]);
            return c = h.concat(i), e = l.concat(i), console.log({
                section: c,
                _section: e
            }), {
                section: c,
                _section: e
            };
        },
        _trimYAxis: function () {
            for (var a = this, b = a.dataFrame.yAxis.section.spanABS, c = a.dataFrame.yAxis.section._data, d = (a.dataFrame.yAxis.section.data, []), e = 0, f = c.length; f > e; e++) {
                -(c[e] - a._baseNumber) / (b - a._baseNumber) * a._yGraphsHeight;
            }
            a.dataFrame.yAxis.data = d;
        },
        _trimGraphs: function () {
            for (var a = this, b = a.dataFrame.yAxis.section[a.dataFrame.yAxis.section.length - 1], c = a.dataFrame.xAxis.org.length, d = a.dataFrame.yAxis.org, e = [], f = 0, g = d.length; g > f; f++)
                for (var h = 0, i = d[f].length; i > h; h++) {
                    e[f] ? '' : e[f] = [];
                    var j = -(d[f][h] - a._baseNumber) / (b - a._baseNumber) * a._yGraphsHeight;
                    j = isNaN(j) ? 0 : j, e[f][h] = {
                        value: d[f][h],
                        x: h / (c - 1) * a._xGraphsWidth,
                        y: j
                    };
                }
            1 == c && e[0] && e[0][0] && (e[0][0].x = parseInt(a._xGraphsWidth / 2)), a.dataFrame.graphs.data = e;
        },
        _drawEnd: function () {
            var a = this;
            a.stageBg.addChild(a._back.sprite), a.stage.addChild(a._graphs.sprite), a.stage.addChild(a._yAxis.sprite), a.stageTip.addChild(a._tips.sprite), a.canvax.addChild(a.stageBg), a.canvax.addChild(a.stage), a.canvax.addChild(a.stageTip);
        },
        _onInduceHandler: function (a) {
            for (var b = this, d = b._graphs.line.strokeStyle.overs, e = b._tips.opt.context, f = b._tips.opt.disTop, g = (a.info.iGroup, a.info.iNode), h = parseInt(a.info.nodeInfo.stageX), i = parseInt(f), j = [], k = b.dataFrame.graphs.data, l = 0, m = k.length; m > l; l++) {
                if (!j[l]) {
                    j[l] = [];
                    var n = {
                            content: e.prefix.values[l],
                            bold: e.bolds[l],
                            fontSize: e.fontSizes[l],
                            fillStyle: e.fillStyles[l],
                            sign: {
                                enabled: 1,
                                trim: 1,
                                fillStyle: d[l]
                            }
                        };
                    j[l].push(n);
                }
                var n = {
                        content: c.numAddSymbol(k[l][g].value),
                        bold: e.bolds[l],
                        fontSize: e.fontSizes[l],
                        fillStyle: e.fillStyles[l],
                        y_align: 1
                    };
                j[l].push(n);
            }
            var o = {
                    w: b.width,
                    h: b.height
                };
            o.tip = {
                x: h,
                y: i,
                data: j
            };
            var p = b._graphs.getY() - f;
            o.line = {
                x: h,
                y: parseInt(b._graphs.getY()),
                yEnd: -p
            };
            for (var j = [], k = a.info.nodesInfoList, l = 0, m = k.length; m > l; l++) {
                var n = {
                        x: parseInt(k[l].stageX),
                        y: parseInt(k[l].stageY),
                        fillStyle: d[l]
                    };
                j.push(n);
            }
            o.nodes = { data: j }, b._tips.remove(), b._tips.draw(o);
        },
        _offInduceHandler: function () {
            var a = this;
            a._tips && a._tips.remove();
        }
    }, k;
}, {
    requires: [
        'dvix/',
        'dvix/utils/tools',
        'dvix/utils/datasection',
        'dvix/event/eventtype',
        'dvix/components/yaxis/yAxis',
        'dvix/components/back/Back',
        'dvix/components/line/Graphs',
        'dvix/components/tips/Tips'
    ]
});