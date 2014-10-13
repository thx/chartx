KISSY.add('dvix/chart/radar/back', function (S, Canvax, Isogon, Line) {
    var Back = function (opt) {
        this.width = 0;
        this.height = 0;
        this.pos = {
            x: 0,
            y: 0
        };
        this.r = 0;    //蜘蛛网的最大半径
        //蜘蛛网的最大半径
        this.yDataSection = [];
        this.xDataSection = [];
        this.strokeStyle = '#999999';
        this.lineWidth = 1;
        this.sprite = null;
        this.init(opt);
    };
    Back.prototype = {
        init: function (opt) {
            _.deepExtend(this, opt);
            this.sprite = new Canvax.Display.Sprite({ id: 'back' });
        },
        draw: function (opt) {
            _.deepExtend(this, opt);
            this._layout();
            this._widget();
        },
        _layout: function () {
            this.sprite.context.x = this.pos.x;
            this.sprite.context.y = this.pos.y;
        },
        _widget: function () {
            var isogonOrigin = parseInt(Math.asin(Math.PI / 180 * 45) * this.r);
            for (var i = 0, l = this.yDataSection.length; i < l; i++) {
                var isogon = new Isogon({
                        id: 'isogon_' + i,
                        context: {
                            x: isogonOrigin,
                            y: isogonOrigin,
                            r: this.r / l * (i + 1),
                            n: this.xDataSection.length,
                            strokeStyle: this.strokeStyle,
                            lineWidth: this.lineWidth
                        }
                    });
                this.sprite.addChild(isogon);
            }
            var pointList = this.sprite.children[this.sprite.children.length - 1].context.$pointList;
            for (var ii = 0, ll = pointList.length; ii < ll; ii++) {
                var line = new Line({
                        id: 'line_' + ii,
                        context: {
                            xStart: isogonOrigin,
                            yStart: isogonOrigin,
                            xEnd: pointList[ii][0] + isogonOrigin,
                            yEnd: pointList[ii][1] + isogonOrigin,
                            lineWidth: this.lineWidth,
                            strokeStyle: this.strokeStyle
                        }
                    });
                this.sprite.addChild(line);
            }
        }
    };
    return Back;
}, {
    requires: [
        'canvax/',
        'canvax/shape/Isogon',
        'canvax/shape/Line',
        'dvix/utils/deep-extend'
    ]
});