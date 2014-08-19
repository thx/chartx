KISSY.add('dvix/game/egg/', function (a, b) {
    var c = [
            'http://gtms01.alicdn.com/tps/i1/T1inpxFAprXXXdzrYA-152-151.png',
            'http://gtms01.alicdn.com/tps/i1/T1VgByFvxfXXXdzrYA-152-151.png',
            'http://gtms01.alicdn.com/tps/i1/T1WxBzFENbXXaG4.rS-300-300.png',
            'http://gtms01.alicdn.com/tps/i1/T1jfXrFypmXXcXWHLe-35-32.png',
            'http://gtms01.alicdn.com/tps/i1/T15FByFuxvXXaffDbN-40-160.png',
            'http://gtms01.alicdn.com/tps/i1/T1xnRwFsdXXXX99eLj-56-78.png',
            'http://gtms03.alicdn.com/tps/i3/T1QlWyFtlbXXcFD3Pq-705-418.png'
        ], d = b.Canvax, e = function (a, b) {
            this.el = a, this.urls = c, this.images = [], this.width = a.width(), this.height = a.height(), this.init(), this.eggMoveEnd = b.eggMoveEnd || function () {
            }, this.hummer = null, this.eggMovie = null, this.gameBegin = !1;
        }, f = null, g = function () {
            f = requestAnimationFrame(g), d.Animation.update();
        };
    return e.prototype = {
        init: function () {
            var a = this;
            if (this.canvax = new d({ el: this.el }), this.stage = new d.Display.Stage({
                    context: {
                        width: this.width,
                        height: this.height
                    }
                }), this.urls.length > 0) {
                var b = new d.Utils.ImagesLoader(this.urls);
                b.on('success', function (b) {
                    a.images = b.images, a.draw();
                }), b.start();
            }
        },
        draw: function () {
            this.stage.addChild(new d.Display.Bitmap({
                img: this.images[6],
                context: {
                    width: this.width,
                    height: this.height
                }
            })), this.triggers = [], this.sprites = [];
            for (var a = [
                        [
                            97,
                            103
                        ],
                        [
                            303,
                            121
                        ],
                        [
                            513,
                            103
                        ]
                    ], b = 0; 3 > b; b++) {
                this.triggers.push(new d.Shapes.Ellipse({
                    id: 't' + b,
                    context: {
                        x: a[b][0] + 63,
                        y: a[b][1] + 83,
                        hr: 63,
                        vr: 83,
                        cursor: 'pointer'
                    }
                }));
                var c = this;
                this.triggers[b].on('click', function (a) {
                    c.eggClick(this, a);
                }), this.triggers[b].on('mouseover', function (a) {
                    c.eggHover(this, a);
                }), this.stage.addChild(this.triggers[b]), this.sprites.push(new d.Display.Sprite({
                    context: {
                        x: a[b][0],
                        y: a[b][1],
                        width: 126,
                        height: 166
                    }
                })), this.stage.addChild(this.sprites[b]);
            }
            this.hummer = new d.Display.Bitmap({
                id: 'hummer',
                img: this.images[0],
                context: {
                    x: 20,
                    y: -100,
                    width: 150,
                    height: 150,
                    rotateOrigin: {
                        x: 120,
                        y: 100
                    }
                }
            }), this.sprites[0].addChild(this.hummer), this.eggMovie = new d.Display.Movieclip({
                autoPlay: !0,
                overPlay: !0,
                context: {
                    x: 0,
                    y: 0,
                    width: 126,
                    height: 166
                }
            }), this.eggMovie.setFrameRate(3), this.eggMovie.on('end', function () {
                c.eggMoveEnd();
            });
            var e = new d.Display.Bitmap({
                    img: this.images[3],
                    context: {
                        x: 20,
                        y: 40,
                        width: 35,
                        height: 32
                    }
                }), f = new d.Display.Bitmap({
                    img: this.images[4],
                    context: {
                        x: 45,
                        y: 10,
                        width: 40,
                        height: 160
                    }
                }), g = new d.Display.Bitmap({
                    img: this.images[5],
                    context: {
                        x: 65,
                        y: 40,
                        width: 56,
                        height: 78
                    }
                }), h = new d.Display.Bitmap({
                    img: this.images[2],
                    context: {
                        x: -70,
                        y: -200,
                        width: 300,
                        height: 300
                    }
                });
            this.eggMovie.addChild(e), this.eggMovie.addChild(f), this.eggMovie.addChild(g), this.eggMovie.addChild(h), this.canvax.addChild(this.stage);
        },
        eggClick: function (a, b) {
            if (!this.gameBegin) {
                this.gameBegin = !0;
                var c = this, e = new d.Animation.Tween({ rotation: 0 }).to({ rotation: 20 }, 200).onUpdate(function () {
                        c.hummer.context.rotation = this.rotation;
                    }).start(), h = new d.Animation.Tween({ rotation: 2 }).to({ rotation: -20 }, 100).onUpdate(function () {
                        c.hummer.context.rotation = this.rotation;
                    }).onComplete(function () {
                        cancelAnimationFrame(f), c.egg_slit(a, b);
                    });
                e.chain(h), g();
            }
        },
        egg_slit: function (a) {
            this.sprites[_.indexOf(this.triggers, a)].addChild(this.eggMovie), this.eggMovie.autoPlay = !0;
        },
        eggHover: function (a) {
            this.gameBegin || this.sprites[_.indexOf(this.triggers, a)].addChild(this.hummer);
        },
        reset: function () {
            this.gameBegin = !1, this.hummer.remove(), this.eggMovie.remove(), this.eggMovie.gotoAndStop(0);
        }
    }, e;
}, { requires: ['dvix/'] });