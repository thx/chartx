KISSY.add('dvix/chart/pregress/index-min', function (a, b, c) {
    b.Canvax;
    return b.extend({
        config: {
            ringWidth: 20,
            ringColor: '#8d76c4',
            bColor: '#E6E6E6'
        },
        init: function (a, b) {
            this._initConfig(b), this.r = Math.min(this.width, this.height) / 2;
        },
        _initConfig: function (a) {
            _.extend(this.config, a);
        },
        draw: function (a) {
            this._initConfig(a), this.stage.addChild(new c({
                context: {
                    x: this.height / 2,
                    y: this.width / 2,
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
                    x: this.height / 2,
                    y: this.width / 2,
                    r: this.r,
                    r0: this.r - this.config.ringWidth,
                    startAngle: 0,
                    endAngle: 0,
                    fillStyle: this.config.ringColor,
                    lineJoin: 'round'
                }
            }));
        },
        setRate: function (a) {
            this.stage.getChildById('rate').context.endAngle = a;
        }
    });
}, {
    requires: [
        'dvix/chart/',
        'canvax/shape/Sector'
    ]
});