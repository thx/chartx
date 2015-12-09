define(
    "chartx/chart/bar/graphs", [
        "canvax/index",
        "canvax/shape/Rect",
        "chartx/utils/tools",
        "chartx/chart/theme",
        "canvax/animation/AnimationFrame"
    ],
    function(Canvax, Rect, Tools, Theme, AnimationFrame) {

        var Graphs = function(opt, root) {
            this.data = [];
            this.w = 0;
            this.h = 0;
            this.root = root;
            this._yAxisFieldsMap = {};
            this._setyAxisFieldsMap();

            this.animation = true;

            this.pos = {
                x: 0,
                y: 0
            };

            this._colors = Theme.colors;

            this.bar = {
                width: 20,
                radius: 4
            };
            this.text = {
                enabled: 0,
                fillStyle: '#999',
                fontSize: 12,
                format: null
            };
            this.sort = null;

            this.eventEnabled = true;

            this.sprite = null;
            this.txtsSp = null;

            this.yDataSectionLen = 0; //y轴方向有多少个section

            _.deepExtend(this, opt);

            this.init();
        };

        Graphs.prototype = {
            init: function() {
                this.sprite = new Canvax.Display.Sprite({
                    id: "graphsEl"
                });
                this.barsSp = this.txtsSp = new Canvax.Display.Sprite({
                    id: "barsSp"
                });
                this.txtsSp = new Canvax.Display.Sprite({
                    id: "txtsSp",
                    context: {
                        visible: false
                    }
                });
            },
            setX: function($n) {
                this.sprite.context.x = $n
            },
            setY: function($n) {
                this.sprite.context.y = $n
            },
            _setyAxisFieldsMap: function() {
                var me = this;
                _.each(_.flatten(this.root.dataFrame.yAxis.field), function(field, i) {
                    me._yAxisFieldsMap[field] = i;
                });
            },
            _getColor: function(c, groups, vLen, i, h, v, value, field) {
                var style = null;
                if (_.isString(c)) {
                    style = c
                };
                if (_.isArray(c)) {
                    style = _.flatten(c)[this._yAxisFieldsMap[field]];
                };
                if (_.isFunction(c)) {
                    style = c({
                        iGroup: i,
                        iNode: h,
                        iLay: v,
                        field: field,
                        value: value
                    });
                };
                if (!style || style == "") {
                    style = this._colors[this._yAxisFieldsMap[field]];
                };
                return style;
            },
            checkBarW: function(xDis) {
                this.bar.width = parseInt(xDis) - (parseInt(Math.max(1, xDis * 0.3)));
                this.bar.width < 1 && (this.bar.width = 1);
            },
            resetData: function(data, opt) {
                this.draw(data.data, opt);
            },
            draw: function(data, opt) {
                _.deepExtend(this, opt);
                if (data.length == 0) {
                    return;
                };

                var preLen = 0;
                this.data[0] && (preLen = this.data[0][0].length);

                this.data = data;
                var me = this;
                var groups = data.length;

                _.each(data, function(h_group, i) {
                    /*
                    //h_group为横向的分组。如果yAxis.field = ["uv","pv"]的话，
                    //h_group就会为两组，一组代表uv 一组代表pv。
                    var spg = new Canvax.Display.Sprite({ id : "barGroup"+i });
                    */

                    //vLen 为一单元bar上面纵向堆叠的length
                    //比如yAxis.field = [?
                    //    ["uv","pv"],  vLen == 2
                    //    "click"       vLen == 1
                    //]

                    //if (h <= preLen - 1)的话说明本次绘制之前sprite里面已经有bar了。需要做特定的动画效果走过去

                    var vLen = h_group.length;
                    if (vLen == 0) return;
                    var hLen = h_group[0].length;

                    for (h = 0; h < hLen; h++) {
                        var groupH;
                        if (i == 0) {
                            //横向的分组
                            if (h <= preLen - 1) {
                                groupH = me.barsSp.getChildById("barGroup_" + h);
                            } else {
                                groupH = new Canvax.Display.Sprite({
                                    id: "barGroup_" + h
                                });
                                me.barsSp.addChild(groupH);
                            };

                            //横向的分组区片感应区
                            var itemW = me.w / hLen;
                            //console.log(itemW+":")

                            if (me.eventEnabled) {
                                var hoverRect;
                                if (h <= preLen - 1) {
                                    hoverRect = groupH.getChildById("bhr_" + h);
                                    hoverRect.context.width = itemW;
                                    hoverRect.context.x = itemW * h;
                                } else {
                                    hoverRect = new Rect({
                                        id: "bhr_" + h,
                                        pointChkPriority: false,
                                        context: {
                                            x: itemW * h,
                                            y: -me.h,
                                            width: itemW,
                                            height: me.h,
                                            fillStyle: "#ccc",
                                            globalAlpha: 0
                                        }
                                    });
                                    groupH.addChild(hoverRect);
                                    hoverRect.hover(function(e) {
                                        this.context.globalAlpha = 0.1;
                                    }, function(e) {
                                        this.context.globalAlpha = 0;
                                    });
                                    hoverRect.iGroup = h, hoverRect.iNode = -1, hoverRect.iLay = -1;
                                    hoverRect.on("panstart mouseover mousemove mouseout click", function(e) {
                                        e.eventInfo = me._getInfoHandler(this, e);
                                    });
                                }
                            };
                        } else {
                            groupH = me.barsSp.getChildById("barGroup_" + h);
                        };

                        for (v = 0; v < vLen; v++) {
                            //单个的bar，从纵向的底部开始堆叠矩形
                            var rectData = h_group[v][h];
                            rectData.iGroup = h, rectData.iNode = i, rectData.iLay = v
                            var rectH = parseInt(Math.abs(rectData.y));
                            if (v > 0) {
                                rectH = rectH - parseInt(Math.abs(h_group[v - 1][h].y));
                            };
                            var beginY = parseInt(rectData.y);

                            var fillStyle = me._getColor(me.bar.fillStyle, groups, vLen, i, h, v, rectData.value, rectData.field);

                            var finalPos = {
                                x: Math.round(rectData.x - me.bar.width / 2),
                                y: beginY,
                                width: parseInt(me.bar.width),
                                height: rectH,
                                fillStyle: fillStyle,
                                scaleY: 1
                            };
                            var rectCxt = {
                                x: finalPos.x,
                                y: 0,
                                width: finalPos.width,
                                height: finalPos.height,
                                fillStyle: finalPos.fillStyle,
                                scaleY: 0
                            };
                            if (!!me.bar.radius && v == vLen - 1) {
                                var radiusR = Math.min(me.bar.width / 2, rectH);
                                radiusR = Math.min(radiusR, me.bar.radius);
                                rectCxt.radius = [radiusR, radiusR, 0, 0];
                            };

                            if (!me.animation) {
                                delete rectCxt.scaleY;
                                rectCxt.y = finalPos.y;
                            };

                            var rectEl;
                            if (h <= preLen - 1) {
                                rectEl = groupH.getChildById("bar_" + i + "_" + h + "_" + v);
                            } else {
                                rectEl = new Rect({
                                    id: "bar_" + i + "_" + h + "_" + v,
                                    context: rectCxt
                                });
                                groupH.addChild(rectEl);
                            };

                            rectEl.finalPos = finalPos;

                            rectEl.iGroup = h, rectEl.iNode = i, rectEl.iLay = v;

                            if (me.eventEnabled) {
                                rectEl.on("panstart mouseover mousemove mouseout click", function(e) {
                                    e.eventInfo = me._getInfoHandler(this, e);
                                    if (e.type == "mouseover") {
                                        this.parent.getChildById("bhr_" + this.iGroup).context.globalAlpha = 0.1;
                                    }
                                    if (e.type == "mouseout") {
                                        this.parent.getChildById("bhr_" + this.iGroup).context.globalAlpha = 0;
                                    }
                                });
                            };

                            //目前，只有再非堆叠柱状图的情况下才有柱子顶部的txt
                            if (vLen == 1) {
                                //文字
                                var content = rectData.value
                                if (_.isFunction(me.text.format)) {
                                    content = me.text.format(content);
                                } else {
                                    content = Tools.numAddSymbol(content);
                                };

                                var context = {
                                    fillStyle: me.text.fillStyle,
                                    fontSize: me.text.fontSize
                                };

                                var txt = new Canvax.Display.Text(content, context);
                                txt.context.x = rectData.x - txt.getTextWidth() / 2;
                                txt.context.y = rectCxt.y - txt.getTextHeight();
                                if (txt.context.y + me.h < 0) {
                                    txt.context.y = -me.h;
                                };
                                me.txtsSp.addChild(txt)
                            }
                        };
                    }
                });

                this.sprite.addChild(this.barsSp);

                if (this.txtsSp.children.length > 0) {
                    this.sprite.addChild(this.txtsSp);
                };

                this.sprite.context.x = this.pos.x;
                this.sprite.context.y = this.pos.y;

                if (this.sort && this.sort == "desc") {
                    this.sprite.context.y -= this.h;
                };
            },
            /**
             * 生长动画
             */
            grow: function(callback, opt) {
                var self = this;
                if (!this.animation) {
                    callback && callback(self);
                    return;
                };
                var sy = 1;
                if (this.sort && this.sort == "desc") {
                    sy = -1;
                };
                if (self.barsSp.children.length > self.data[0][0].length) {
                    for (var i = self.data[0][0].length, l = self.barsSp.children.length; i < l; i++) {
                        self.barsSp.getChildAt(i).destroy();
                        i--;
                        l--;
                    };
                };

                var options = _.extend({
                    delay: 80,
                    easing: "Back.Out",
                    duration: 500
                }, opt);

                _.each(self.data, function(h_group, g) {
                    var vLen = h_group.length;
                    if (vLen == 0) return;
                    var hLen = h_group[0].length;
                    for (h = 0; h < hLen; h++) {
                        for (v = 0; v < vLen; v++) {

                            var group = self.barsSp.getChildById("barGroup_" + h);

                            var bar = group.getChildById("bar_" + g + "_" + h + "_" + v);
                            //console.log("finalPos"+bar.finalPos.y)

                            if (options.duration == 0) {
                                bar.context.scaleY = sy;
                                bar.context.y = sy * sy * bar.finalPos.y;
                                bar.context.x = bar.finalPos.x;
                                bar.context.width = bar.finalPos.width;
                                bar.context.height = bar.finalPos.height;
                            } else {
                                if (bar._tweenObj) {
                                    AnimationFrame.destroyTween(bar._tweenObj);
                                };
                                bar._tweenObj = bar.animate({
                                    scaleY: sy,
                                    y: sy * bar.finalPos.y,
                                    x: bar.finalPos.x,
                                    width: bar.finalPos.width,
                                    height: bar.finalPos.height
                                }, {
                                    duration: options.duration,
                                    easing: options.easing,
                                    delay: h * options.delay,
                                    onUpdate: function(arg) {

                                    },
                                    onComplete: function(arg) {
                                        
                                        if (arg.width < 3) {
                                            this.context.radius = 0;
                                        }
                                    },
                                    id: bar.id
                                });
                            }

                        };
                    };
                });


                window.setTimeout(function() {
                    callback && callback(self);
                }, 300 * (this.barsSp.children.length - 1));
            },
            _getInfoHandler: function(target) {
                var node = {
                    iGroup: target.iGroup,
                    iNode: target.iNode,
                    iLay: target.iLay,
                    nodesInfoList: this._getNodeInfo(target.iGroup, target.iNode, target.iLay)
                };
                return node
            },
            _getNodeInfo: function(iGroup, iNode, iLay) {
                var arr = [];
                var me = this;
                var groups = me.data.length;
                _.each(me.data, function(h_group, i) {
                    var node;
                    var vLen = h_group.length;
                    if (vLen == 0) return;
                    var hLen = h_group[0].length;
                    for (h = 0; h < hLen; h++) {
                        if (h == iGroup) {
                            for (v = 0; v < vLen; v++) {
                                if ((iNode == i || iNode == -1) && (iLay == v || iLay == -1)) {
                                    node = h_group[v][h]
                                    node.fillStyle = me._getColor(me.bar.fillStyle, groups, vLen, i, h, v, node.value, node.field);
                                    arr.push(node)
                                }
                            }
                        }
                    }
                });
                return arr;
            }
        };
        return Graphs;
    }
)