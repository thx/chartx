KISSY.add('dvix/components/yaxis/yAxis', function (a, b, c, d, e) {
    var f = function (a, b) {
        this.w = 0, this.display = 'block', this.mode = 1, this.dis = 6, this.line = {
            enabled: 1,
            width: 6,
            height: 3,
            strokeStyle: '#BEBEBE'
        }, this.text = {
            fillStyle: 'blank',
            fontSize: 12
        }, this.data = [], this.dataSection = [], this.dataOrg = [], this.sprite = null, this.txtSp = null, this.lineSp = null, this.x = 0, this.y = 0, this.disYAxisTopLine = 6, this.yMaxHeight = 0, this.yGraphsHeight = 0, this.init(a, b);
    };
    return f.prototype = {
        init: function (a, c) {
            _.deepExtend(this, a), this._initData(c), this.sprite = new b.Display.Sprite();
        },
        setX: function (a) {
            this.sprite.context.x = a;
        },
        setY: function (a) {
            this.sprite.context.y = a;
        },
        draw: function (a) {
            _.deepExtend(this, a), this.yGraphsHeight = this.yMaxHeight - this._getYAxisDisLine(), this.setX(this.pos.x), this.setY(this.pos.y), this._trimYAxis(), this._widget();
        },
        _trimYAxis: function () {
            for (var a = this.dataSection[this.dataSection.length - 1], b = [], c = 0, d = this.dataSection.length; d > c; c++) {
                var e = -(this.dataSection[c] - this._baseNumber) / (a - this._baseNumber) * this.yGraphsHeight;
                e = isNaN(e) ? 0 : parseInt(e), b[c] = {
                    content: this.dataSection[c],
                    y: e
                };
            }
            this.data = b;
        },
        _getYAxisDisLine: function () {
            var a = this.disYAxisTopLine, b = 2 * a, c = a;
            return c = a + this.yMaxHeight % this.dataSection.length, c = c > b ? b : c;
        },
        _initData: function (a) {
            var b = _.flatten(a.org);
            this.dataOrg = a.org, this.dataSection = e.section(b), this._baseNumber = this.dataSection[0], 1 == b.length && (this.dataSection[0] = 2 * b[0], this._baseNumber = 0);
        },
        _widget: function () {
            var a = this;
            if ('none' == a.display)
                return a.w = 0, void 0;
            var e = this.data;
            if (2 == a.mode) {
                var f = [];
                e.length > 2 && (f.push(e[0]), f.push(e[e.length - 1]), e = f);
            }
            a.txtSp = new b.Display.Sprite(), a.sprite.addChild(a.txtSp), a.lineSp = new b.Display.Sprite(), a.sprite.addChild(a.lineSp);
            for (var g = 0, h = 0, i = e.length; i > h; h++) {
                var j = e[h], k = 0, l = j.y, m = d.numAddSymbol(j.content), n = new b.Display.Text(m, {
                        context: {
                            x: k,
                            y: l,
                            fillStyle: a.text.fillStyle,
                            fontSize: a.text.fontSize,
                            textAlign: 2 == a.mode ? 'left' : 'right',
                            textBaseline: 'middle'
                        }
                    });
                if (2 == a.mode && 2 == e.length) {
                    var o = n.getTextHeight();
                    0 == h ? n.context.y = l - parseInt(o / 2) - 2 : 1 == h && (n.context.y = l + parseInt(o / 2) + 2);
                }
                a.txtSp.addChild(n), g = Math.max(g, n.getTextWidth());
                var p = new c({
                        id: h,
                        context: {
                            x: 0,
                            y: l,
                            xEnd: a.line.width,
                            yEnd: 0,
                            lineWidth: a.line.height,
                            strokeStyle: a.line.strokeStyle
                        }
                    });
                a.lineSp.addChild(p);
            }
            a.txtSp.context.x = 2 == a.mode ? 0 : g, a.lineSp.context.x = g + a.dis, a.line.enabled ? a.w = g + a.dis + a.line.width : (a.lineSp.context.visible = !1, a.w = g + a.dis);
        }
    }, f;
}, {
    requires: [
        'canvax/',
        'canvax/shape/Line',
        'dvix/utils/tools',
        'dvix/utils/datasection'
    ]
});