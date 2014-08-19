KISSY.add('dvix/chart/pregress/index', function (S, Chart, Sector) {
    var Canvax = Chart.Canvax;
    return Chart.extend({
        config: {
            ringWidth: 20,
            ringColor: '#8d76c4',
            bColor: '#E6E6E6'
        },
        init: function (el, opt) {
            this._initConfig(opt);
            this.r = Math.min(this.width, this.height) / 2;
        },
        _initConfig: function (opt) {
            _.extend(this.config, opt);
        },
        draw: function (opt) {
            this._initConfig(opt);
            this.stage.addChild(new Sector({
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
            }));
            this.stage.addChild(new Sector({
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
        setRate: function (s) {
            this.stage.getChildById('rate').context.endAngle = s;
        }
    });
}, {
    requires: [
        'dvix/chart/',
        'canvax/shape/Sector'
    ]
});