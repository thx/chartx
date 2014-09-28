KISSY.add('dvix/chart/radar/graphs', function (S, Canvax, Circle, Tween) {
    var Graphs = function (opt, data) {
        this.w = 0;
        this.h = 0;
        this.pos = {
            x: 0,
            y: 0
        };
        this._colors = [
            '#6f8cb2',
            '#c77029',
            '#f15f60',
            '#ecb44f',
            '#ae833a',
            '#896149'
        ];    //圆圈默认半径
        //圆圈默认半径
        this.r = 10;
        this.sprite = null;
        this._circles = [];    //所有圆点的集合
        //所有圆点的集合
        _.deepExtend(this, opt);
        this.init(data);
    };
    Graphs.prototype = {
        init: function () {
            this.sprite = new Canvax.Display.Sprite({ id: 'graphsEl' });
        },
        setX: function ($n) {
            this.sprite.context.x = $n;
        },
        setY: function ($n) {
            this.sprite.context.y = $n;
        },
        getFillStyle: function (i, ii, value) {
            var fillStyle = null;
            if (_.isArray(this.fillStyle)) {
                fillStyle = this.fillStyle[ii];
            }
            if (_.isFunction(this.fillStyle)) {
                fillStyle = this.fillStyle(i, ii, value);
            }
            if (!fillStyle || fillStyle == '') {
                fillStyle = this._colors[ii];
            }
            return fillStyle;
        },
        draw: function (data, opt) {
            _.deepExtend(this, opt);
            if (data.length == 0) {
                return;
            }    //这个分组是只x方向的一维分组
            //这个分组是只x方向的一维分组
            var barGroupLen = data[0].length;
            for (var i = 0; i < barGroupLen; i++) {
                var sprite = new Canvax.Display.Sprite({ id: 'barGroup' + i });
                for (var ii = 0, iil = data.length; ii < iil; ii++) {
                    var barData = data[ii][i];
                    var circle = new Circle({
                            context: {
                                x: barData.x,
                                y: barData.y,
                                fillStyle: this.getFillStyle(i, ii, barData.value),
                                r: this.r,
                                globalAlpha: 0
                            }
                        });
                    sprite.addChild(circle);
                    this._circles.push(circle);
                }
                this.sprite.addChild(sprite);
            }
            this.setX(this.pos.x);
            this.setY(this.pos.y);
        },
        /**
         * 生长动画
         */
        grow: function () {
            var self = this;
            var timer = null;
            var growAnima = function () {
                var bezierT = new Tween.Tween({ h: 0 }).to({ h: 100 }, 500).onUpdate(function () {
                        for (var i = 0, l = self._circles.length; i < l; i++) {
                            self._circles[i].context.globalAlpha = this.h / 100;
                            self._circles[i].context.r = this.h / 100 * self.r;
                        }
                    }).onComplete(function () {
                        cancelAnimationFrame(timer);
                    }).start();
                animate();
            };
            function animate() {
                timer = requestAnimationFrame(animate);
                Tween.update();
            }
            ;
            growAnima();
        }
    };
    return Graphs;
}, {
    requires: [
        'canvax/',
        'canvax/shape/Circle',
        'canvax/animation/Tween'
    ]
});