KISSY.add('dvix/chart/pregress/recharge-min', function (a, b, c, d, e, f, g) {
    var h = b.Canvax, i = function () {
            return timer = requestAnimationFrame(i), g.update(), timer;
        };
    return b.extend({
        init: function (a, b) {
            this.r = Math.min(this.width, this.height) / 2, this._beginAngle = 270, this.config = {
                ringWidth: 50,
                ringColor: '#f59622',
                bColor: '#3c3c3c',
                btnColor: 'white',
                crossLineColor: '#666666',
                rate: 0
            }, b && _.deepExtend(this.config, b), this.stage.addChild(new c({
                id: 'bg',
                context: {
                    x: this.width / 2,
                    y: this.height / 2,
                    r: this.r,
                    r0: this.r - this.config.ringWidth,
                    startAngle: 0,
                    endAngle: 360,
                    fillStyle: this.config.bColor,
                    lineJoin: 'round'
                }
            })), this.stage.addChild(new c({
                id: 'rate',
                context: {
                    x: this.width / 2,
                    y: this.height / 2,
                    r: this.r,
                    r0: this.r - this.config.ringWidth,
                    startAngle: 0,
                    endAngle: 0,
                    fillStyle: this.config.ringColor,
                    lineJoin: 'round'
                }
            }));
            var g = new d({
                    id: 'btn',
                    context: {
                        x: this.width / 2,
                        y: this.height / 2,
                        r: this.r - this.config.ringWidth,
                        fillStyle: this.config.btnColor
                    }
                }), i = 3 * g.context.r / 4 * 2, j = 3 * g.context.r / 4 * 2;
            window.addBtnSp = new h.Display.Sprite({
                id: 'cross',
                context: {
                    x: g.context.x - i / 2,
                    y: g.context.y - j / 2,
                    width: i,
                    height: j,
                    scaleOrigin: {
                        x: i / 2,
                        y: j / 2
                    },
                    rotateOrigin: {
                        x: i / 2,
                        y: j / 2
                    }
                }
            }), addBtnSp.addChild(new e({
                context: {
                    xStart: 0,
                    yStart: addBtnSp.context.height / 2,
                    xEnd: addBtnSp.context.width,
                    yEnd: addBtnSp.context.height / 2,
                    lineWidth: 1,
                    strokeStyle: this.config.crossLineColor
                }
            })), addBtnSp.addChild(new e({
                context: {
                    xStart: addBtnSp.context.width / 2,
                    yStart: 0,
                    xEnd: addBtnSp.context.width / 2,
                    yEnd: addBtnSp.context.height,
                    lineWidth: 1,
                    strokeStyle: this.config.crossLineColor
                }
            }));
            var k = 6, l = (addBtnSp.context.width - k) / 2, m = (addBtnSp.context.height - k) / 2;
            addBtnSp.addChild(new f({
                context: {
                    x: l,
                    y: m,
                    width: k,
                    height: k,
                    rotation: 45,
                    rotateOrigin: {
                        x: k / 2,
                        y: k / 2
                    },
                    fillStyle: this.config.crossLineColor
                }
            }));
            var n = this;
            g.on('tap', function () {
                n.fire('recharge');
            }), this.stage.getChildById('rate').on('touch', function (a) {
                n.holdHand(a);
            }).on('release', function (a) {
                n.releaseHand(a);
            }), this.stage.getChildById('bg').on('touch', function (a) {
                n.holdHand(a);
            }).on('release', function (a) {
                n.releaseHand(a);
            }), this.stage.addChild(g), this.stage.addChild(addBtnSp), this.config.rate > 0 && this.setRate(this.config.rate, !0);
        },
        draw: function () {
            this.canvax.addChild(this.stage);
        },
        setRate: function (a, b) {
            var c = this.stage.getChildById('rate');
            this.config.rate = a > 100 ? 100 : a;
            var d = this._beginAngle + (180 - this.rateToAngle()), e = this._beginAngle - (180 - this.rateToAngle());
            if (b)
                c.context.startAngle = d, c.context.endAngle = e;
            else {
                var f = {
                        s: c.context.startAngle,
                        e: c.context.endAngle
                    };
                new g.Tween(f).to({
                    s: d,
                    e: e
                }, 700).onUpdate(function () {
                    c.context.startAngle = this.s, c.context.endAngle = this.e;
                }).start(), i();
            }
        },
        rateToAngle: function () {
            return this.config.rate / 100 * 180;
        },
        holdHand: function (a) {
            var b = this, c = 100 - this.config.rate, d = b.config.bColor;
            'rate' == a.target.id && (c = this.config.rate, d = b.config.ringColor);
            var e = this.stage.getChildById('cross');
            e.context.visible = !1;
            var f = this.stage.getChildById('btn');
            new g.Tween({ ringWidth: this.config.ringWidth }).to({ ringWidth: 3 * this.config.ringWidth / 4 }, 300).onUpdate(function () {
                f.context.r = b.r - this.ringWidth;
            }).start();
            var j = new h.Display.Sprite({
                    id: 'holdTextSp',
                    context: {
                        x: f.context.x - f.context.r,
                        y: f.context.y - f.context.r,
                        width: f.context.r,
                        height: f.context.r
                    }
                }), k = new h.Display.Text('0', {
                    context: {
                        x: f.context.r,
                        y: f.context.r,
                        fillStyle: d,
                        fontSize: 25,
                        textAlign: 'right',
                        textBaseline: 'middle'
                    }
                }), l = new h.Display.Text('.00%', {
                    context: {
                        x: f.context.r,
                        y: f.context.r + 3,
                        fillStyle: d,
                        fontSize: 15,
                        textAlign: 'left',
                        textBaseline: 'middle'
                    }
                });
            j.addChild(k), j.addChild(l), this.stage.addChild(j), new g.Tween({ num: 0 }).to({ num: c }, 300).onUpdate(function () {
                k.resetText(parseInt(this.num).toString()), l.resetText('.' + this.num.toFixed(2).toString().split('.')[1] + '%');
            }).start(), i();
        },
        releaseHand: function (a) {
            g.removeAll(), this.stage.getChildById('holdTextSp').destroy();
            var b = this;
            'rate' == a.target.id;
            var c = this.stage.getChildById('btn'), d = this.stage.getChildById('cross');
            d.context.visible = !0, d.context.globalAlpha = 0, new g.Tween({
                ringWidth: this.r - c.context.r,
                rotation: 0,
                globalAlpha: 0
            }).to({
                ringWidth: this.config.ringWidth,
                rotation: 360,
                globalAlpha: 1
            }, 500).onUpdate(function () {
                c.context.r = b.r - this.ringWidth, d.context.rotation = this.rotation, d.context.globalAlpha = this.globalAlpha;
            }).start();
        }
    });
}, {
    requires: [
        'dvix/chart/',
        'canvax/shape/Sector',
        'canvax/shape/Circle',
        'canvax/shape/Line',
        'canvax/shape/Rect',
        'canvax/animation/Tween',
        'dvix/utils/deep-extend'
    ]
});