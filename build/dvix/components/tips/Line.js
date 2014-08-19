KISSY.add('dvix/components/tips/Line', function (S, Canvax, CanvaxLine, Tools) {
    var Line = function (opt) {
        this.xStart = 0;
        this.yStart = 0;
        this.xEnd = 0;
        this.yEnd = 0;
        this.line = {
            lineType: 'dashed',
            //线条类型(dashed = 虚线 | '' = 实线)
            thinkness: 1,
            strokeStyle: '#333333'
        };
        this.sprite = null;
        this.init(opt);
    };
    Line.prototype = {
        init: function (opt) {
            var self = this;
            self._initConfig(opt);
            self.sprite = new Canvax.Display.Sprite({ id: 'tipLine' });
        },
        setX: function ($n) {
            this.sprite.context.x = $n;
        },
        setY: function ($n) {
            this.sprite.context.y = $n;
        },
        draw: function (opt) {
            var self = this;
            self._configData(opt);
            self._widget();
        },
        //初始化配置
        _initConfig: function (opt) {
            var self = this;
            if (opt) {
                self.line.lineType = opt.lineType == '' ? '' : self.line.lineType;
                self.line.thinkness = opt.thinkness || self.line.thinkness;
                self.line.strokeStyle = opt.strokeStyle || self.line.strokeStyle;
            }
        },
        //配置数据
        _configData: function (opt) {
            var self = this;
            if (opt) {
                self.xStart = opt.xStart || self.xStart;
                self.yStart = opt.yStart || self.yStart;
                self.xEnd = opt.xEnd || self.xEnd;
                self.yEnd = opt.yEnd || self.yEnd;
            }
        },
        _widget: function () {
            var self = this;
            var line = new CanvaxLine({
                    context: {
                        xStart: self.xStart,
                        yStart: self.yStart,
                        xEnd: self.xEnd,
                        yEnd: self.yEnd,
                        lineType: self.line.lineType,
                        lineWidth: self.line.thinkness,
                        strokeStyle: self.line.strokeStyle
                    }
                });
            self.sprite.addChild(line);
        }
    };
    return Line;
}, {
    requires: [
        'canvax/',
        'canvax/shape/Line',
        'dvix/utils/tools'
    ]
});