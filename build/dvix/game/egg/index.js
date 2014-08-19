KISSY.add('dvix/game/egg/', function (S, Dvix) {
    var _urls = [
            'http://gtms01.alicdn.com/tps/i1/T1inpxFAprXXXdzrYA-152-151.png',
            //锤子
            'http://gtms01.alicdn.com/tps/i1/T1VgByFvxfXXXdzrYA-152-151.png',
            //打击中的锤子
            'http://gtms01.alicdn.com/tps/i1/T1WxBzFENbXXaG4.rS-300-300.png',
            'http://gtms01.alicdn.com/tps/i1/T1jfXrFypmXXcXWHLe-35-32.png',
            'http://gtms01.alicdn.com/tps/i1/T15FByFuxvXXaffDbN-40-160.png',
            'http://gtms01.alicdn.com/tps/i1/T1xnRwFsdXXXX99eLj-56-78.png',
            'http://gtms03.alicdn.com/tps/i3/T1QlWyFtlbXXcFD3Pq-705-418.png'
        ];
    var Canvax = Dvix.Canvax;
    var eggGame = function (el, opt) {
        this.el = el;
        this.urls = _urls;
        this.images = [];
        this.width = el.width();
        this.height = el.height();
        this.init();
        this.eggMoveEnd = opt.eggMoveEnd || function () {
        };
        this.hummer = null;    //锤子
        //锤子
        this.eggMovie = null;    //蛋动画
        //蛋动画
        this.gameBegin = false;
    };
    var timer = null;
    var animate = function () {
        timer = requestAnimationFrame(animate);    //js/RequestAnimationFrame.js needs to be included too.
        //js/RequestAnimationFrame.js needs to be included too.
        Canvax.Animation.update();
    };
    eggGame.prototype = {
        init: function () {
            var self = this;
            this.canvax = new Canvax({ el: this.el });
            this.stage = new Canvax.Display.Stage({
                context: {
                    width: this.width,
                    height: this.height
                }
            });    //加载图片
            //加载图片
            if (this.urls.length > 0) {
                var imgLoad = new Canvax.Utils.ImagesLoader(this.urls);
                imgLoad.on('success', function (e) {
                    //alert("ok");
                    self.images = e.images;
                    self.draw();
                });
                imgLoad.start();
            }
        },
        draw: function () {
            this.stage.addChild(new Canvax.Display.Bitmap({
                img: this.images[6],
                context: {
                    width: this.width,
                    height: this.height
                }
            }));
            this.triggers = [];
            this.sprites = [];
            var pOrigins = [
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
                ];    //三个椭圆的原点坐标
            //三个椭圆的原点坐标
            for (var i = 0; i < 3; i++) {
                this.triggers.push(new Canvax.Shapes.Ellipse({
                    id: 't' + i,
                    context: {
                        x: pOrigins[i][0] + 63,
                        y: pOrigins[i][1] + 83,
                        hr: 63,
                        vr: 83,
                        cursor: 'pointer'
                    }
                }));
                var self = this;
                this.triggers[i].on('click', function (event) {
                    self.eggClick(this, event);
                });
                this.triggers[i].on('mouseover', function (event) {
                    self.eggHover(this, event);
                });
                this.stage.addChild(this.triggers[i]);
                this.sprites.push(new Canvax.Display.Sprite({
                    context: {
                        x: pOrigins[i][0],
                        y: pOrigins[i][1],
                        width: 126,
                        height: 166
                    }
                }));
                this.stage.addChild(this.sprites[i]);
            }
            ;
            this.hummer = new Canvax.Display.Bitmap({
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
            });
            this.sprites[0].addChild(this.hummer);    //准备蛋破裂的动画
            //准备蛋破裂的动画
            this.eggMovie = new Canvax.Display.Movieclip({
                autoPlay: true,
                overPlay: true,
                context: {
                    x: 0,
                    y: 0,
                    width: 126,
                    height: 166
                }
            });
            this.eggMovie.setFrameRate(3);
            this.eggMovie.on('end', function () {
                self.eggMoveEnd();
            })    //创建三张bitmap
;
            //创建三张bitmap
            var sl_l = new Canvax.Display.Bitmap({
                    img: this.images[3],
                    context: {
                        x: 20,
                        y: 40,
                        width: 35,
                        height: 32
                    }
                });
            var sl_m = new Canvax.Display.Bitmap({
                    img: this.images[4],
                    context: {
                        x: 45,
                        y: 10,
                        width: 40,
                        height: 160
                    }
                });
            var sl_r = new Canvax.Display.Bitmap({
                    img: this.images[5],
                    context: {
                        x: 65,
                        y: 40,
                        width: 56,
                        height: 78
                    }
                });    //光
            //光
            var sl_light = new Canvax.Display.Bitmap({
                    img: this.images[2],
                    context: {
                        x: -70,
                        y: -200,
                        width: 300,
                        height: 300
                    }
                });    //设置第一帧
            //设置第一帧
            this.eggMovie.addChild(sl_l);
            this.eggMovie.addChild(sl_m);
            this.eggMovie.addChild(sl_r);
            this.eggMovie.addChild(sl_light);
            this.canvax.addChild(this.stage);
        },
        eggClick: function (obj, event) {
            if (this.gameBegin) {
                return;
            }
            this.gameBegin = true;
            var self = this;    //开始动画
            //开始动画
            var tween1 = new Canvax.Animation.Tween({ rotation: 0 }).to({ rotation: 20 }, 200).onUpdate(function () {
                    self.hummer.context.rotation = this.rotation;
                }).start();
            var tween2 = new Canvax.Animation.Tween({ rotation: 2 }).to({ rotation: -20 }, 100).onUpdate(function () {
                    self.hummer.context.rotation = this.rotation;
                }).onComplete(function () {
                    cancelAnimationFrame(timer);
                    self.egg_slit(obj, event);
                });
            tween1.chain(tween2);
            animate();
        },
        //播放蛋破裂动画
        egg_slit: function (obj, e) {
            this.sprites[_.indexOf(this.triggers, obj)].addChild(this.eggMovie);
            this.eggMovie.autoPlay = true;    //this.eggMovie.play();
        },
        //this.eggMovie.play();
        eggHover: function (obj, e) {
            if (this.gameBegin) {
                //游戏已经开始了
                return;
            }
            this.sprites[_.indexOf(this.triggers, obj)].addChild(this.hummer);
        },
        reset: function () {
            this.gameBegin = false;
            this.hummer.remove();
            this.eggMovie.remove();
            this.eggMovie.gotoAndStop(0);
        }
    };
    return eggGame;
}, { requires: ['dvix/'] });