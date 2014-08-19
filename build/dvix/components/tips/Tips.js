KISSY.add('dvix/components/tips/Tips', function (S, Canvax, Tip, Line, Nodes, Tools) {
    var Tips = function (opt) {
        this.w = 0;
        this.h = 0;
        this.opt = {
            disTop: 30,
            //tip中心离顶部的距离
            dis: 2,
            //tip最靠左右两边的距离
            context: null    //配置内容等
        };
        //配置内容等
        this.config = {
            tip: {
                x: 0,
                //x坐标               
                y: 0,
                //y坐标
                data: []
            },
            line: {
                x: '',
                y: ''
            },
            nodes: { data: [] }
        };
        this.sprite = null;
        this.line = null;
        this.tip = null;
        this.nodes = null;
        this.init(opt);
    };
    Tips.prototype = {
        init: function (opt) {
            var self = this;
            self._initConfig(opt);
            self.sprite = new Canvax.Display.Sprite();
        },
        setX: function ($n) {
            this.sprite.context.x = $n;
        },
        setY: function ($n) {
            this.sprite.context.y = $n;
        },
        draw: function (config) {
            var self = this;
            self._initModule();
            self._configData(config);
            self._startDraw();
            self._endDraw();
        },
        remove: function () {
            var self = this;
            self._remove();
        },
        //初始化配置
        _initConfig: function (opt) {
            var self = this;
            if (opt) {
                self.opt.dis = opt.dis || opt.dis == 0 ? opt.dis : self.opt.dis;
                self.opt.disTop = opt.disTop || opt.disTop == 0 ? opt.disTop : self.opt.disTop;
                self.opt.context = opt.context;
                self.opt.tip = opt.tip;
                self.opt.line = opt.line;
                self.opt.nodes = opt.nodes;
            }
        },
        _initModule: function () {
            var self = this;
            if (self.opt.tip) {
                self.tip = new Tip(self.opt.tip);
            }
            if (self.opt.line) {
                self.line = new Line(self.opt.line);
            }
            if (self.opt.nodes) {
                self.nodes = new Nodes(self.opt.nodes);
            }
        },
        //配置数据
        _configData: function (config) {
            var self = this;
            if (config) {
                self.w = config.w || self.w;
                self.h = config.h || self.h;
                var tip = config.tip;
                if (tip) {
                    self.config.tip.x = tip.x || self.config.tip.x;
                    self.config.tip.y = tip.y || self.config.tip.y;
                    self.config.tip.data = tip.data || self.config.tip.data;
                }
                var line = config.line;
                if (line) {
                    self.config.line = config.line;
                }
                var nodes = config.nodes;
                if (nodes) {
                    self.config.nodes = config.nodes;
                }
            }
        },
        _remove: function () {
            var self = this;
            self.sprite.removeAllChildren();
            self.line = null;
            self.tip = null;
            self.nodes = null;
        },
        _startDraw: function () {
            var self = this;
            if (self.opt.tip) {
                self.tip.draw({ data: self.config.tip.data });
                var x = self.config.tip.x, y = self.config.tip.y;
                var p = self._allShow(self.w, self.h, {
                        w: self.tip.w,
                        h: self.tip.h
                    }, {
                        x: x,
                        y: y
                    }, self.opt.dis);
                x = p.x, y = p.y;
                self.tip.setX(x), self.tip.setY(y);
            }
            if (self.opt.line) {
                self.line.draw(self.config.line);
                self.line.setX(self.config.line.x), self.line.setY(self.config.line.y);
            }
            if (self.opt.nodes) {
                self.nodes.draw(self.config.nodes);
            }
        },
        _endDraw: function () {
            var self = this;
            if (self.opt.line) {
                self.sprite.addChild(self.line.sprite);
            }
            if (self.opt.nodes) {
                self.sprite.addChild(self.nodes.sprite);
            }
            if (self.opt.tip) {
                self.sprite.addChild(self.tip.sprite);
            }
        },
        //全显
        _allShow: function ($w, $h, $i, $p, $dis) {
            var dis = $dis || $dis == 0 ? $dis : 4;
            var w = $w, h = $h;
            var x = $p.x, y = $p.y;
            if ($p.x - $i.w / 2 < dis) {
                x = $i.w / 2 + dis;
            }
            if ($p.x + $i.w / 2 > w - dis) {
                x = w - $i.w / 2 - dis;
            }
            if ($p.y - $i.h / 2 < dis) {
                y = $i.h / 2 + dis;
            }
            if ($p.y + $i.h / 2 > h - dis) {
                y = h - $i.h / 2 - dis;
            }
            return {
                x: x,
                y: y
            };
        }
    };
    return Tips;
}, {
    requires: [
        'canvax/',
        'dvix/components/tips/Tip',
        'dvix/components/tips/Line',
        'dvix/components/tips/Nodes',
        'dvix/utils/tools'
    ]
});