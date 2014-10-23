KISSY.add('dvix/chart/line/tips', function (S, Canvax, Line, Circle, Rect) {
    var Tips = function (opt, data, tipsContainer) {
        this.container = tipsContainer;
        this.sprite = null;
        this.context = null;    // tips的详细内容
        // tips的详细内容
        this._line = null;
        this._nodes = null;
        this._tip = null;
        this._back = null;    //prefix  在tips里面放在具体value值前面的文案
        //prefix  在tips里面放在具体value值前面的文案
        this.prefix = data.yAxis.field;
        this.init(opt);
    };
    Tips.prototype = {
        init: function (opt) {
            _.deepExtend(this, opt);
            this.sprite = new Canvax.Display.Sprite({ id: 'tips' });
        },
        show: function (e) {
            var tipsPoint = this._getTipsPoint(e);
            this._initLine(e, tipsPoint);
            this._initNodes(e, tipsPoint);
            this._initContext(e, tipsPoint);
            this._initBack(e, tipsPoint);    //initBack后 要把tip show，然后把xy对应到back的xy上面来
            //initBack后 要把tip show，然后把xy对应到back的xy上面来
            this._moveContext();
        },
        move: function (e) {
            this._resetPosition(e);
        },
        hide: function (e) {
            this.sprite.removeAllChildren();
            this._removeContext();
        },
        _getTipsPoint: function (e) {
            return e.target.localToGlobal(e.info.nodesInfoList[e.info.iGroup]);
        },
        _resetPosition: function (e) {
            var tipsPoint = this._getTipsPoint(e);
            this._line.context.x = tipsPoint.x;
            this._resetNodesPosition(e, tipsPoint);    //在setBack之前一定要先先reset Context,
                                                       //因为back需要context最新的width和height
            //在setBack之前一定要先先reset Context,
            //因为back需要context最新的width和height
            this._resetContext(e);
            this._back.context.x = this._getBackX(e, tipsPoint);
            this._moveContext();
        },
        /**
         * line相关------------------------
         */
        _initLine: function (e, tipsPoint) {
            var lineOpt = _.deepExtend({
                    x: tipsPoint.x,
                    y: e.target.localToGlobal().y,
                    xStart: 0,
                    yStart: e.target.context.height,
                    xEnd: 0,
                    yEnd: 0,
                    lineType: 'dashed',
                    lineWidth: 1,
                    strokeStyle: '#333333'
                }, this.line);
            this._line = new Line({
                id: 'tipsLine',
                context: lineOpt
            });
            this.sprite.addChild(this._line);
        },
        /**
         *nodes相关-------------------------
         */
        _initNodes: function (e, tipsPoint) {
            this._nodes = new Canvax.Display.Sprite({
                id: 'tipsNodes',
                context: {
                    x: tipsPoint.x,
                    y: e.target.localToGlobal().y
                }
            });
            var self = this;
            _.each(e.info.nodesInfoList, function (node) {
                self._nodes.addChild(new Circle({
                    context: {
                        y: e.target.context.height - Math.abs(node.y),
                        r: 3,
                        fillStyle: node.fillStyle,
                        strokeStyle: '#ffffff',
                        lineWidth: 3
                    }
                }));
            });
            this.sprite.addChild(this._nodes);
        },
        _resetNodesPosition: function (e, tipsPoint) {
            var self = this;
            this._nodes.context.x = tipsPoint.x;
            _.each(e.info.nodesInfoList, function (node, i) {
                self._nodes.getChildAt(i).context.y = e.target.context.height - Math.abs(node.y);
            });
        },
        /**
         *context相关-------------------------
         */
        _initContext: function (e, tipsPoint) {
            this._tip = S.all('<div class=\'chart-tips\' style=\'visibility:hidden;position:absolute;<D-r>display:inline-block;*display:inline;*zoom:1;padding:6px;\'></div>');
            this._tip.html(this._getContext(e));
            this.container.append(this._tip);
        },
        _removeContext: function () {
            this._tip.remove();
            this._tip = null;
        },
        _resetContext: function (e) {
            this._tip.html(this._getContext(e));
        },
        _moveContext: function (e) {
            this._tip.css({
                visibility: 'visible',
                left: this._back.context.x + 'px',
                top: this._back.context.y + 'px'
            });
        },
        _getContext: function (e) {
            var tipsContext = this.context;
            if (!tipsContext) {
                tipsContext = this._getDefaultContext(e);
            }
            return tipsContext;
        },
        _getDefaultContext: function (e) {
            var str = '<table>';
            var self = this;
            _.each(e.info.nodesInfoList, function (node, i) {
                str += '<tr style=\'color:' + node.fillStyle + '\'><td>' + self.prefix[i] + '</td><td>' + node.value + '</td></tr>';
            });
            str += '</table>';
            return str;
        },
        /**
         *Back相关-------------------------
         */
        _initBack: function (e, tipsPoint) {
            var w = this._tip.outerWidth();
            var h = this._tip.outerHeight();
            var opt = {
                    x: this._getBackX(e, tipsPoint),
                    y: e.target.localToGlobal().y,
                    width: w,
                    height: h,
                    lineWidth: 1,
                    strokeStyle: '#333333',
                    fillStyle: '#ffffff',
                    radius: [5]
                };
            this._back = new Rect({
                id: 'tipsBack',
                context: opt
            });
            this.sprite.addChild(this._back);
        },
        /**
         *获取back要显示的x
         */
        _getBackX: function (e, tipsPoint) {
            var w = this._tip.outerWidth() + 2;    //后面的2 是 两边的linewidth
            //后面的2 是 两边的linewidth
            var x = tipsPoint.x - w / 2;
            var stageW = e.target.getStage().context.width;
            if (x < 0) {
                x = 0;
            }
            if (x + w > stageW) {
                x = stageW - w;
            }
            return x;
        }
    };
    return Tips;
}, {
    requires: [
        'canvax/',
        'canvax/shape/Line',
        'canvax/shape/Circle',
        'canvax/shape/Rect',
        'dvix/utils/deep-extend'
    ]
});