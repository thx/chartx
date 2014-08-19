KISSY.add('dvix/components/line/Graphs', function (a, b, c, d, e, f, g) {
    var h = function (a) {
        this.w = 0, this.h = 0, this.y = 0, this.line = {
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
        }, this.data = [], this.disX = 0, this.groups = [], this.iGroup = 0, this.iNode = -1, this._nodesInfoList = [], this._nodesYList = [], this.sprite = null, this.induce = null, this.init(a);
    };
    return h.prototype = {
        init: function (a) {
            var c = this;
            c._initConfig(a), c.sprite = new b.Display.Sprite();
        },
        setX: function (a) {
            this.sprite.context.x = a;
        },
        setY: function (a) {
            this.sprite.context.y = a;
        },
        getX: function () {
            return this.sprite.context.x;
        },
        getY: function () {
            return this.sprite.context.y;
        },
        draw: function (a) {
            var b = this;
            b._configData(a), b._widget();
        },
        grow: function () {
            function a() {
                c = requestAnimationFrame(a), e.update();
            }
            var b = this, c = null, d = function () {
                    new e.Tween({ h: 0 }).to({ h: b.h }, 500).onUpdate(function () {
                        b.sprite.context.scaleY = this.h / b.h;
                    }).onComplete(function () {
                        cancelAnimationFrame(c);
                    }).start();
                    a();
                };
            d();
        },
        _initConfig: function (a) {
            var b = this;
            if (a) {
                var c = a.line;
                if (c) {
                    var d = c.strokeStyle;
                    d && (b.line.strokeStyle.normals = d.normals || b.line.strokeStyle.normals, b.line.strokeStyle.overs = d.overs && d.overs.length ? d.overs : b.line.strokeStyle.normals);
                    var e = c.alpha;
                    e && (b.line.alpha.normals = e.normals || b.line.alpha.normals);
                }
            }
        },
        _configData: function (a) {
            var b = this, a = a || {};
            b.w = a.w || 0, b.h = a.h || 0, b.y = a.y || 0, b.data = a.data || [], b.disX = a.disX || [];
        },
        _widget: function () {
            for (var a = this, b = 0, d = a.data.length; d > b; b++) {
                var e = new g({
                        line: { strokeStyle: a.line.strokeStyle.normals[b] },
                        fill: {
                            strokeStyle: a.line.strokeStyle.normals[b],
                            alpha: a.line.alpha.normals[b]
                        }
                    });
                e.draw({ data: a.data[b] }), a.sprite.addChild(e.sprite), a.groups.push(e);
            }
            a.induce = new c({
                id: 'induce',
                context: {
                    y: -a.h,
                    width: a.w,
                    height: a.h,
                    fillStyle: '#000000',
                    globalAlpha: 0
                }
            }), a.sprite.addChild(a.induce), a.induce.on(f.HOLD, function (b) {
                var c = a._getInfoHandler(b);
                b.info = c;
            }), a.induce.on(f.DRAG, function (b) {
                var c = a._getInfoHandler(b);
                b.info = c;
            }), a.induce.on(f.RELEASE, function (b) {
                var c = {
                        iGroup: a.iGroup,
                        iNode: a.iNode
                    };
                b.info = c, a.iGroup = 0, a.iNode = -1;
            });
        },
        _getInfoHandler: function (b) {
            var c = this, e = b.point;
            console.log(e.x + '|' + e.y);
            var f = Number(e.x), g = Number(e.y) - Number(c.h), h = f / (c.disX / 2);
            h = h % 2 == 0 ? h : h + 1;
            var i = parseInt(h / 2);
            if (!(i >= c.data[0].length)) {
                if (i != c.iNode) {
                    c._nodesInfoList = [], c._nodesYList = [];
                    for (var j = 0, k = c.groups.length; k > j; j++) {
                        var l = c.groups[j], m = l.getNodeInfoAt(i);
                        c._nodesInfoList.push(m), c._nodesYList.push(m.y);
                    }
                }
                var n = d.getDisMinATArr(g, c._nodesYList);
                if (n != c.iGroup || i != c.iNode) {
                    c.iGroup = n, c.iNode = i;
                    var o = c.groups[n].getNodeInfoAt(i), m = {
                            iGroup: c.iGroup,
                            iNode: c.iNode,
                            nodeInfo: a.clone(o),
                            nodesInfoList: a.clone(c._nodesInfoList)
                        };
                    return m;
                }
                c.iNode = i;
            }
        }
    }, h;
}, {
    requires: [
        'canvax/',
        'canvax/shape/Rect',
        'dvix/utils/tools',
        'canvax/animation/Tween',
        'dvix/event/eventtype',
        'dvix/components/line/Group'
    ]
});