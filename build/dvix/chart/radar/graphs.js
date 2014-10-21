KISSY.add('dvix/chart/radar/graphs', function (S, Canvax, Polygon, Circle, Tween) {
    var Graphs = function (opt, data) {
        this.width = 0;
        this.height = 0;
        this.pos = {
            x: 0,
            y: 0
        };
        this.r = 0;    //蜘蛛网的最大半径
        //蜘蛛网的最大半径
        this.dataOrg = [];
        this.yDataSection = [];
        this.xDataSection = [];
        this._colors = [
            '#6f8cb2',
            '#c77029',
            '#f15f60',
            '#ecb44f',
            '#ae833a',
            '#896149'
        ];
        this.lineWidth = 1;
        this.sprite = null;
        this.init(data);
    };
    Graphs.prototype = {
        init: function (opt) {
            _.deepExtend(this, opt);
            this.sprite = new Canvax.Display.Sprite({ id: 'graphsEl' });
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
            this.dataOrg = data;
            _.deepExtend(this, opt);
            this._layout();
            this._widget();
        },
        _layout: function () {
            this.sprite.context.x = this.pos.x;
            this.sprite.context.y = this.pos.y;
        },
        _widget: function () {
            if (this.dataOrg.length == 0) {
                return;
            }
            var n = this.dataOrg[0].length;
            if (!n || n < 2) {
                return;
            }
            var x = parseInt(Math.asin(Math.PI / 180 * 45) * this.r);
            var y = x;
            var dStep = 2 * Math.PI / n;
            var beginDeg = -Math.PI / 2;
            var deg = beginDeg;
            var mxYDataSection = this.yDataSection[this.yDataSection.length - 1];
            for (var i = 0, l = this.dataOrg.length; i < l; i++) {
                var pointList = [];
                var circles = new Canvax.Display.Sprite({});
                for (var ii = 0, end = n; ii < end; ii++) {
                    var r = this.r * (this.dataOrg[i][ii] / mxYDataSection);
                    var px = x + r * Math.cos(deg);
                    var py = y + r * Math.sin(deg);
                    pointList.push([
                        px,
                        py
                    ]);
                    deg += dStep;
                    circles.addChild(new Circle({
                        context: {
                            x: px,
                            y: py,
                            r: 5,
                            fillStyle: this._colors[i],
                            strokeStyle: '#ffffff',
                            lineWidth: 2
                        }
                    }));
                }
                deg = beginDeg;
                var polygonBg = new Polygon({
                        id: 'radar_bg_' + i,
                        context: {
                            pointList: pointList,
                            globalAlpha: 0.3,
                            fillStyle: this._colors[i]
                        }
                    });
                var polygonBorder = new Polygon({
                        id: 'radar_Border_' + i,
                        context: {
                            pointList: pointList,
                            lineWidth: 2,
                            strokeStyle: this._colors[i]
                        }
                    });
                this.sprite.addChild(polygonBg);
                this.sprite.addChild(polygonBorder);
                this.sprite.addChild(circles);
            }
        }
    };
    return Graphs;
}, {
    requires: [
        'canvax/',
        'canvax/shape/Polygon',
        'canvax/shape/Circle',
        'canvax/animation/Tween'
    ]
});