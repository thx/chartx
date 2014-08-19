KISSY.add('dvix/components/xaxis/xAxis', function (a, b, c, d) {
    var e = b.Canvax, f = function (a, b) {
            this.w = 0, this.h = 0, this.disY = 0, this.dis = 6, this.line = {
                enabled: 1,
                width: 1,
                height: 4,
                strokeStyle: '#cccccc'
            }, this.max = {
                left: 0,
                right: 0,
                txtH: 14
            }, this.text = {
                mode: 1,
                fillStyle: '#999999',
                fontSize: 13
            }, this.disXAxisLine = 6, this.disOriginX = 0, this.xGraphsWidth = 0, this.dataOrg = [], this.dataSection = [], this.data = [], this.layoutData = [], this.sprite = null, this.txtSp = null, this.lineSp = null, this.init(a, b);
        };
    return f.prototype = {
        init: function (a, b) {
            this.dataOrg = b.org, a && _.deepExtend(this, a), this.dataSection = this._initDataSection(this.dataOrg), this.sprite = new e.Display.Sprite(), this._checkText();
        },
        _initDataSection: function (a) {
            return _.flatten(a);
        },
        setX: function (a) {
            this.sprite.context.x = a;
        },
        setY: function (a) {
            this.sprite.context.y = a;
        },
        draw: function (a) {
            this._initConfig(a), this.data = this._trimXAxis(this.dataSection, this.xGraphsWidth), this._trimLayoutData(), 'none' != this.diaplay && (this._widget(), this._layout()), this.setX(this.pos.x + this.disOriginX), this.setY(this.pos.y);
        },
        _initConfig: function (a) {
            a && _.deepExtend(this, a), this.max.right = this.w, this.xGraphsWidth = this.w - this._getXAxisDisLine(), this.disOriginX = parseInt((this.w - this.xGraphsWidth) / 2), this.max.left += this.disOriginX, this.max.right -= this.disOriginX;
        },
        _trimXAxis: function (a, b) {
            for (var c = [], d = b / (a.length + 1), e = 0, f = a.length; f > e; e++) {
                var g = {
                        content: a[e],
                        x: parseInt(d * (e + 1))
                    };
                c.push(g);
            }
            return c;
        },
        _getXAxisDisLine: function () {
            var a = this.disXAxisLine, b = 2 * a, c = a;
            return c = a + this.w % this.dataOrg.length, c = c > b ? b : c, c = isNaN(c) ? 0 : c;
        },
        _checkText: function () {
            var a = new e.Display.Text('test', { context: { fontSize: this.text.fontSize } });
            this.max.txtH = a.getTextHeight(), this.h = 'none' == this.diaplay ? this.max.txtH : this.disY + this.line.height + this.dis + this.max.txtH;
        },
        _widget: function () {
            var a = this.layoutData;
            this.txtSp = new e.Display.Sprite(), this.sprite.addChild(this.txtSp), this.lineSp = new e.Display.Sprite(), this.sprite.addChild(this.lineSp);
            for (var b = 0, f = a.length; f > b; b++) {
                var g = a[b], h = g.x, i = this.disY + this.line.height + this.dis, j = d.numAddSymbol(g.content), k = new e.Display.Text(j, {
                        context: {
                            x: h,
                            y: i,
                            fillStyle: this.text.fillStyle,
                            fontSize: this.text.fontSize
                        }
                    });
                this.txtSp.addChild(k);
            }
            for (var a = 1 == this.text.mode ? this.layoutData : this.data, b = 0, f = a.length; f > b; b++) {
                var g = a[b], h = g.x, l = new c({
                        id: b,
                        context: {
                            x: h,
                            y: 0,
                            xEnd: 0,
                            yEnd: this.line.height,
                            lineWidth: this.line.width,
                            strokeStyle: this.line.strokeStyle
                        }
                    });
                l.context.y = this.disY, this.lineSp.addChild(l);
            }
            for (var b = 0, f = this.txtSp.getNumChildren(); f > b; b++) {
                var k = this.txtSp.getChildAt(b), h = parseInt(k.context.x - k.getTextWidth() / 2);
                k.context.x = h;
            }
        },
        _layout: function () {
            var a = this.txtSp.getChildAt(0), b = this.txtSp.getChildAt(this.txtSp.getNumChildren() - 1);
            a && a.context.x < this.max.left && (a.context.x = parseInt(this.max.left)), b && Number(b.context.x + Number(b.getTextWidth())) > this.max.right && (b.context.x = parseInt(this.max.right - b.getTextWidth()));
        },
        _trimLayoutData: function () {
            for (var a = [], b = this.data, c = 0, f = 0, g = b.length; g > f; f++) {
                var h = b[f], i = d.numAddSymbol(h.content), j = new e.Display.Text(i, {
                        context: {
                            fillStyle: this.text.fillStyle,
                            fontSize: this.text.fontSize
                        }
                    });
                c = Math.max(c, j.getTextWidth());
            }
            for (var k = this.max.right, l = Math.min(Math.floor(k / c), b.length), m = Math.max(Math.ceil(b.length / l - 1), 0), f = 0; l > f; f++) {
                var n = b[f + m * f];
                n && a.push(n);
            }
            this.layoutData = a;
        }
    }, f;
}, {
    requires: [
        'dvix/',
        'canvax/shape/Line',
        'dvix/utils/tools',
        'dvix/utils/deep-extend'
    ]
});