KISSY.add('dvix/components/line/Graphs', function (S, Dvix, Rect, Tools, Tween, EventType, Group) {
    var Canvax = Dvix.Canvax;
    var Graphs = function (opt) {
        this.w = 0;
        this.h = 0;
        this.y = 0;
        this.line = {
            strokeStyle: {
                normals: [
                    '#f8ab5e',
                    '#E55C5C'
                ],
                overs: []
            },
            alpha: {
                normals: [
                    0.8,
                    0.7
                ],
                overs: []
            }
        };
        this.data = [];    //二维 [[{x:0,y:-100,...},{}],[]]
        //二维 [[{x:0,y:-100,...},{}],[]]
        this.disX = 0;    //点与点之间的间距
        //点与点之间的间距
        this.groups = [];    //群组集合     
        //群组集合     
        this.iGroup = 0;    //群组索引(哪条线)
        //群组索引(哪条线)
        this.iNode = -1;    //节点索引(那个点)
        //节点索引(那个点)
        this._nodesInfoList = [];    //多条线同个节点索引上的节点信息集合
        //多条线同个节点索引上的节点信息集合
        this._nodesYList = [];    //多条线同个节点索引上的节点信息(x坐标)集合
        //多条线同个节点索引上的节点信息(x坐标)集合
        this.sprite = null;
        this.induce = null;
        this.init(opt);
    };
    Graphs.prototype = {
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
        getX: function () {
            return this.sprite.context.x;
        },
        getY: function () {
            return this.sprite.context.y;
        },
        draw: function (opt) {
            var self = this;
            self._configData(opt);
            self._widget();
        },
        /**
         * 生长动画
         */
        grow: function () {
            var self = this;
            var timer = null;
            var growAnima = function () {
                var bezierT = new Tween.Tween({ h: 0 }).to({ h: self.h }, 500).onUpdate(function () {
                        self.sprite.context.scaleY = this.h / self.h;
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
        },
        //初始化配置
        _initConfig: function (opt) {
            var self = this;
            if (opt) {
                var line = opt.line;
                if (line) {
                    var strokeStyle = line.strokeStyle;
                    if (strokeStyle) {
                        self.line.strokeStyle.normals = strokeStyle.normals || self.line.strokeStyle.normals;
                        if (strokeStyle.overs && strokeStyle.overs.length) {
                            self.line.strokeStyle.overs = strokeStyle.overs;
                        } else {
                            self.line.strokeStyle.overs = self.line.strokeStyle.normals;
                        }
                    }
                    var alpha = line.alpha;
                    if (alpha) {
                        self.line.alpha.normals = alpha.normals || self.line.alpha.normals;
                    }
                }
            }
        },
        //配置数据
        _configData: function (opt) {
            var self = this;
            var opt = opt || {};
            self.w = opt.w || 0;
            self.h = opt.h || 0;
            self.y = opt.y || 0;
            self.data = opt.data || [];
            self.disX = opt.disX || [];
        },
        _widget: function () {
            var self = this;
            for (var a = 0, al = self.data.length; a < al; a++) {
                var group = new Group({
                        line: { strokeStyle: self.line.strokeStyle.normals[a] },
                        fill: {
                            strokeStyle: self.line.strokeStyle.normals[a],
                            alpha: self.line.alpha.normals[a]
                        }
                    });
                group.draw({ data: self.data[a] });
                self.sprite.addChild(group.sprite);
                self.groups.push(group);
            }
            self.induce = new Rect({
                id: 'induce',
                context: {
                    y: -self.h,
                    width: self.w,
                    height: self.h,
                    fillStyle: '#000000',
                    globalAlpha: 0
                }
            });
            self.sprite.addChild(self.induce);
            self.induce.on(EventType.HOLD, function (e) {
                var o = self._getInfoHandler(e);
                e.info = o;
            });
            self.induce.on(EventType.DRAG, function (e) {
                var o = self._getInfoHandler(e);
                e.info = o;
            });
            self.induce.on(EventType.RELEASE, function (e) {
                var o = {
                        iGroup: self.iGroup,
                        iNode: self.iNode
                    };
                e.info = o;
                self.iGroup = 0, self.iNode = -1;
            });
        },
        _getInfoHandler: function (e) {
            var self = this;
            var point = e.point;
            console.log(point.x + '|' + point.y)    // var stagePoint
;
            // var stagePoint
            var x = Number(point.x), y = Number(point.y) - Number(self.h);
            var n = x / (self.disX / 2);
            n = n % 2 == 0 ? n : n + 1;
            var tmpINode = parseInt(n / 2);
            if (tmpINode >= self.data[0].length) {
                return;
            }
            if (tmpINode != self.iNode) {
                self._nodesInfoList = []    //节点信息集合
;
                //节点信息集合
                self._nodesYList = []    //节点y轴坐标集合
;
                //节点y轴坐标集合
                for (var a = 0, al = self.groups.length; a < al; a++) {
                    var group = self.groups[a];
                    var o = group.getNodeInfoAt(tmpINode);
                    self._nodesInfoList.push(o);
                    self._nodesYList.push(o.y);
                }
            }
            var tmpIGroup = Tools.getDisMinATArr(y, self._nodesYList);
            if (tmpIGroup == self.iGroup && tmpINode == self.iNode) {
            } else {
                self.iGroup = tmpIGroup, self.iNode = tmpINode;
                var nodeInfo = self.groups[tmpIGroup].getNodeInfoAt(tmpINode);
                var o = {
                        iGroup: self.iGroup,
                        iNode: self.iNode,
                        nodeInfo: S.clone(nodeInfo),
                        nodesInfoList: S.clone(self._nodesInfoList)
                    };
                return o;
            }
            self.iNode = tmpINode;
            return;
        }
    };
    return Graphs;
}, {
    requires: [
        'dvix/',
        'canvax/shape/Rect',
        'dvix/utils/tools',
        'canvax/animation/Tween',
        'dvix/event/eventtype',
        'dvix/components/line/Group'
    ]
});