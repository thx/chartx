KISSY.add('dvix/chart/line/index-min', function (a, b, c, d, e, f, g, h, i, j) {
    var k = b.Canvax;
    return b.extend({
        init: function () {
            this.config = {
                mode: 1,
                event: { enabled: 1 }
            }, this.dataFrame = null, this._xAxis = null, this._yAxis = null, this._back = null, this._graphs = null, this._tips = null, this.stageTip = new k.Display.Sprite({ id: 'tip' }), this.core = new k.Display.Sprite({ id: 'core' }), this.stageBg = new k.Display.Sprite({ id: 'bg' }), this.stage.addChild(this.stageBg), this.stage.addChild(this.core), this.stage.addChild(this.stageTip);
        },
        draw: function (a, b) {
            b.rotate && this.rotate(b.rotate), this.dataFrame = this._initData(a, b), this._initModule(b, this.dataFrame), this._startDraw(), this._drawEnd(), this._arguments = arguments;
        },
        clear: function () {
            this.stageBg.removeAllChildren(), this.core.removeAllChildren(), this.stageTip.removeAllChildren();
        },
        rotate: function (a) {
            var b = this.width, c = this.height;
            this.width = c, this.height = b;
            var d = this;
            _.each(this.stage.children, function (e) {
                e.context.rotation = a || -90, e.context.x = (b - c) / 2, e.context.y = (c - b) / 2, e.context.rotateOrigin.x = d.width * e.context.$model.scaleX / 2, e.context.rotateOrigin.y = d.height * e.context.$model.scaleY / 2;
            });
        },
        reset: function (a, b) {
            this.clear(), this.width = parseInt(this.element.width()), this.height = parseInt(this.element.height()), this.draw(a, b);
        },
        _initModule: function (a, b) {
            this._xAxis = new f(a.xAxis, b.xAxis), this._yAxis = new g(a.yAxis, b.yAxis), this._back = new h(a.back), this._graphs = new i(a.graphs), this._tips = new j(a.tips);
        },
        _startDraw: function () {
            var a = 0, b = this.height - this._xAxis.h;
            this._yAxis.draw({
                pos: {
                    x: a,
                    y: b
                },
                yMaxHeight: b
            });
            var c = this._yAxis.w;
            if (a = c, this._xAxis.draw({
                    w: this.width - c,
                    max: { left: -c },
                    pos: {
                        x: a,
                        y: b
                    }
                }), this._back.draw({
                    w: this.width - c,
                    h: b,
                    xAxis: { data: this._yAxis.data },
                    pos: {
                        x: a + this._xAxis.disOriginX,
                        y: b
                    }
                }), this._graphs.draw({
                    w: this._xAxis.xGraphsWidth,
                    h: this._yAxis.yGraphsHeight,
                    data: this._trimGraphs(),
                    disX: this._getGraphsDisX()
                }), this._graphs.setX(a + this._xAxis.disOriginX), this._graphs.setY(b), this._graphs.grow(), this.config.event.enabled) {
                var d = this;
                this._graphs.sprite.on(e.HOLD, function (a) {
                    d._onInduceHandler(a);
                }), this._graphs.sprite.on(e.DRAG, function (a) {
                    d._onInduceHandler(a);
                }), this._graphs.sprite.on(e.RELEASE, function (a) {
                    d._offInduceHandler(a);
                });
            }
        },
        _trimGraphs: function () {
            for (var a = this._yAxis.dataSection[this._yAxis.dataSection.length - 1], b = this.dataFrame.xAxis.org[0].length, c = this.dataFrame.yAxis.org, d = [], e = 0, f = c.length; f > e; e++)
                for (var g = 0, h = c[e].length; h > g; g++) {
                    d[e] ? '' : d[e] = [];
                    var i = -(c[e][g] - this._yAxis._baseNumber) / (a - this._yAxis._baseNumber) * this._yAxis.yGraphsHeight;
                    i = isNaN(i) ? 0 : i, d[e][g] = {
                        value: c[e][g],
                        x: g / (b - 1) * this._xAxis.xGraphsWidth,
                        y: i
                    };
                }
            return 1 == b && d[0] && d[0][0] && (d[0][0].x = parseInt(this._xAxis.xGraphsWidth / 2)), d;
        },
        _getGraphsDisX: function () {
            return this._xAxis.xGraphsWidth / (this.dataFrame.xAxis.org[0].length - 1);
        },
        _drawEnd: function () {
            this.stageBg.addChild(this._back.sprite), this.core.addChild(this._xAxis.sprite), this.core.addChild(this._graphs.sprite), this.core.addChild(this._yAxis.sprite), this.stageTip.addChild(this._tips.sprite);
        },
        _onInduceHandler: function (a) {
            if (a.info) {
                for (var b = this._graphs.line.strokeStyle.overs, d = this._tips.opt.context, e = this._tips.opt.disTop, f = (a.info.iGroup, a.info.iNode), g = [], h = this._graphs.data, i = 0, j = h.length; j > i; i++) {
                    if (!g[i]) {
                        g[i] = [];
                        var k = {
                                content: d.prefix.values[i],
                                bold: d.bolds[i],
                                fontSize: d.fontSizes[i],
                                fillStyle: d.fillStyles[i],
                                sign: {
                                    enabled: 1,
                                    trim: 1,
                                    fillStyle: b[i]
                                }
                            };
                        g[i].push(k);
                    }
                    var k = {
                            content: c.numAddSymbol(h[i][f].value),
                            bold: d.bolds[i],
                            fontSize: d.fontSizes[i],
                            fillStyle: d.fillStyles[i],
                            y_align: 1
                        };
                    g[i].push(k);
                }
                var l = (parseInt(a.info.nodeInfo.stageX), parseInt(e), a.target.localToGlobal(a.info.nodeInfo, this.core)), m = {
                        w: this.width,
                        h: this.height
                    };
                m.tip = {
                    x: l.x,
                    y: l.y,
                    data: g
                };
                var n = this._graphs.getY() - e;
                m.line = {
                    x: l.x,
                    y: parseInt(this._graphs.getY()),
                    yEnd: -n
                };
                for (var g = [], h = a.info.nodesInfoList, i = 0, j = h.length; j > i; i++) {
                    h[i].y = a.target.context.height - Math.abs(h[i].y);
                    var o = a.target.localToGlobal(h[i], this.core), k = {
                            x: parseInt(o.x),
                            y: parseInt(o.y),
                            fillStyle: b[i]
                        };
                    g.push(k);
                }
                m.nodes = { data: g }, this._tips.remove(), this._tips.draw(m);
            }
        },
        _offInduceHandler: function () {
            this._tips && this._tips.remove();
        }
    });
}, {
    requires: [
        'dvix/chart/',
        'dvix/utils/tools',
        'dvix/utils/datasection',
        'dvix/event/eventtype',
        './xAxis',
        'dvix/components/yaxis/yAxis',
        'dvix/components/back/Back',
        'dvix/components/line/Graphs',
        'dvix/components/tips/Tips'
    ]
});