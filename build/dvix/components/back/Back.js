KISSY.add('dvix/components/back/Back', function (S, Dvix, Line, Tools) {
    var Canvax = Dvix.Canvax;
    var Back = function (opt) {
        this.w = 0;
        this.h = 0;
        this.pos = {
            x: 0,
            y: 0
        };
        this.xOrigin = {
            //原点开始的x轴线
            enabled: 1,
            thinkness: 1,
            strokeStyle: '#cccccc'
        };
        this.yOrigin = {
            //原点开始的y轴线               
            enabled: 1,
            thinkness: 1,
            strokeStyle: '#BEBEBE'
        };
        this.xAxis = {
            //x轴上的线
            enabled: 1,
            w: 0,
            data: [],
            //[{y:100},{}]
            // data        : [{y:0},{y:-100},{y:-200},{y:-300},{y:-400},{y:-500},{y:-600},{y:-700}],
            lineType: 'dashed',
            //线条类型(dashed = 虚线 | '' = 实线)
            thinkness: 1,
            strokeStyle: '#cccccc'
        };
        this.yAxis = {
            //y轴上的线
            enabled: 1,
            h: 0,
            data: [],
            //[{x:100},{}]
            // data        : [{x:100},{x:200},{x:300},{x:400},{x:500},{x:600},{x:700}],
            lineType: 'dashed',
            //线条类型(dashed = 虚线 | '' = 实线)
            thinkness: 1,
            strokeStyle: '#BEBEBE'
        };
        this.sprite = null;    //总的sprite
        //总的sprite
        this.xOriginSp = null;    //原点开始的x轴线
        //原点开始的x轴线
        this.yOriginSp = null;    //原点开始的y轴线
        //原点开始的y轴线
        this.xAxisSp = null;    //x轴上的线集合
        //x轴上的线集合
        this.yAxisSp = null;    //y轴上的线集合
        //y轴上的线集合
        this.init(opt);
    };
    Back.prototype = {
        init: function (opt) {
            _.deepExtend(this, opt);
            this.sprite = new Canvax.Display.Sprite();
        },
        setX: function ($n) {
            this.sprite.context.x = $n;
        },
        setY: function ($n) {
            this.sprite.context.y = $n;
        },
        draw: function (opt) {
            _.deepExtend(this, opt);
            this._configData(opt);
            this._widget();
            this.setX(this.pos.x);
            this.setY(this.pos.y);
        },
        //配置数据
        _configData: function (opt) {
            var self = this;
            self.w = opt.w || 0;
            self.h = opt.h || 0;
            if (opt.xAxis)
                self.xAxis.w = opt.xAxis.w || self.w, self.xAxis.data = opt.xAxis.data;
            if (opt.yAxis)
                self.yAxis.h = opt.yAxis.h || self.h, self.yAxis.data = opt.yAxis.data;
        },
        _widget: function () {
            var self = this;
            self.xAxisSp = new Canvax.Display.Sprite(), self.sprite.addChild(self.xAxisSp);
            self.yAxisSp = new Canvax.Display.Sprite(), self.sprite.addChild(self.yAxisSp);
            self.xOriginSp = new Canvax.Display.Sprite(), self.sprite.addChild(self.xOriginSp);
            self.yOriginSp = new Canvax.Display.Sprite(), self.sprite.addChild(self.yOriginSp)    //x轴上的线集合
;
            //x轴上的线集合
            var arr = self.xAxis.data;
            for (var a = 1, al = arr.length; a < al; a++) {
                var o = arr[a];
                var line = new Line({
                        context: {
                            xStart: 0,
                            yStart: o.y,
                            xEnd: self.xAxis.w,
                            yEnd: o.y,
                            lineType: self.xAxis.lineType,
                            lineWidth: self.xAxis.thinkness,
                            strokeStyle: self.xAxis.strokeStyle
                        }
                    });
                if (self.xAxis.enabled)
                    self.xAxisSp.addChild(line);
            }    //y轴上的线集合
            //y轴上的线集合
            var arr = self.yAxis.data;
            for (var a = 1, al = arr.length; a < al; a++) {
                var o = arr[a];
                var line = new Line({
                        context: {
                            xStart: o.x,
                            yStart: 0,
                            xEnd: o.x,
                            yEnd: -self.yAxis.h,
                            lineType: self.yAxis.lineType,
                            lineWidth: self.yAxis.thinkness,
                            strokeStyle: self.yAxis.strokeStyle
                        }
                    });
                if (self.yAxis.enabled)
                    self.yAxisSp.addChild(line);
            }    //原点开始的y轴线
            //原点开始的y轴线
            var line = new Line({
                    context: {
                        xEnd: 0,
                        yEnd: -self.h,
                        lineWidth: self.yOrigin.thinkness,
                        strokeStyle: self.yOrigin.strokeStyle
                    }
                });
            if (self.yOrigin.enabled)
                self.yOriginSp.addChild(line)    //原点开始的x轴线
;
            //原点开始的x轴线
            var line = new Line({
                    context: {
                        xEnd: self.w,
                        yEnd: 0,
                        lineWidth: self.xOrigin.thinkness,
                        strokeStyle: self.xOrigin.strokeStyle
                    }
                });
            if (self.xOrigin.enabled)
                self.xOriginSp.addChild(line);
            line.context.y = -0.5;
        }
    };
    return Back;
}, {
    requires: [
        'dvix/',
        'canvax/shape/Line',
        'dvix/utils/tools',
        'dvix/utils/deep-extend'
    ]
});