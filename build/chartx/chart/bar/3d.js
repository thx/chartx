define('chartx/chart/bar/3d/graphs',
    [
        "canvax/index",
        "canvax/shape/Rect",
        "chartx/utils/tools",
        "chartx/chart/theme",
        "canvax/animation/AnimationFrame",
        "canvax/shape/BrokenLine",
        "canvax/shape/Shapes",
        "chartx/utils/math3d/vec3",
        "chartx/utils/colorformat",
        "canvax/animation/AnimationFrame"
    ],
    function (Canvax, Rect, Tools, Theme, AnimationFrame, BrokenLine, Shapes, Vector3, ColorFormat, AnimationFrame) {
        

        var Graphs = function (root) {


            var opt = root.graphs;
            this.root = root;
            this.data = [];
            this.w = 0;
            this.h = 0;
            this.depth = 50;

            this._yAxisFieldsMap = {}; //{"uv":{index:0,fillStyle:"" , ...} ...}
            this._setyAxisFieldsMap();

            this.animation = true;

            this.pos = {
                x: 0,
                y: 0
            };

            this._colors = Theme.colors;

            this.bar = {
                width: 0,
                _width: 0,
                radius: 4
            };

            this.text = {
                enabled: false,
                fillStyle: '#999',
                fontSize: 12,
                format: null,
                lineWidth: 1,
                strokeStyle: 'white'
            };

            this.average = {
                enabled: false,
                field: "average",
                fieldInd: -1,
                fillStyle: "#c4c9d6",
                data: null
            };

            this.checked = {
                enabled: false,
                fillStyle: '#00A8E6',
                strokeStyle: '#00A8E6',
                globalAlpha: 0.1,
                lineWidth: 2
            }

            this.sort = null;

            this._barsLen = 0;

            this.eventEnabled = true;

            this.sprite = null;
            this.txtsSp = null;
            this.checkedSp = null;

            this.yDataSectionLen = 0; //y轴方向有多少个section

            _.deepExtend(this, opt);

            this._initaverage();

            this.init();


        };

        Graphs.prototype = {
            init: function () {
                this.sprite = new Canvax.Display.Sprite({
                    id: "graphsEl"
                });
                this.barsSp = new Canvax.Display.Sprite({
                    id: "barsSp"
                });
                this.txtsSp = new Canvax.Display.Sprite({
                    id: "txtsSp",
                    context: {
                        //visible: false
                    }
                });
                this.checkedSp = new Canvax.Display.Sprite({
                    id: "checkedSp"
                });
            },
            setX: function ($n) {
                this.sprite.context.x = $n
            },
            setY: function ($n) {
                this.sprite.context.y = $n
            },
            getInfo: function (index) {
                //该index指当前
                return this._getInfoHandler({
                    iGroup: index
                })
            },
            _checked: function ($o) {
                var me = this
                var index = $o.iNode
                var group = me.barsSp.getChildById('barGroup_' + index)
                if (!group) {
                    return
                }

                me.checkedSp.removeChildById('line_' + index)
                me.checkedSp.removeChildById('rect_' + index)
                var hoverRect = group.getChildAt(0)
                var x0 = hoverRect.context.x
                var x1 = hoverRect.context.x + hoverRect.context.width,
                    y = -me.h

                if ($o.checked) {
                    var rect = new Rect({
                        id: "rect_" + index,
                        pointChkPriority: false,
                        context: {
                            x: x0,
                            y: y,
                            width: hoverRect.context.width,
                            height: hoverRect.context.height,
                            fillStyle: me.checked.fillStyle,
                            globalAlpha: me.checked.globalAlpha
                        }
                    });
                    me.checkedSp.addChild(rect)

                    var line = new BrokenLine({
                        id: "line_" + index,
                        context: {
                            pointList: [
                                [x0, y],
                                [x1, y]
                            ],
                            strokeStyle: me.checked.strokeStyle,
                            lineWidth: me.checked.lineWidth
                        }
                    });
                    me.checkedSp.addChild(line)
                }
            },
            removeAllChecked: function () {
                var me = this
                me.checkedSp.removeAllChildren()
            },
            setBarStyle: function ($o) {
                var me = this
                var index = $o.iNode
                var group = me.barsSp.getChildById('barGroup_' + index)

                var fillStyle = $o.fillStyle || me._getColor(me.bar.fillStyle)
                for (var a = 0, al = group.getNumChildren(); a < al; a++) {
                    var rectEl = group.getChildAt(a)
                    rectEl.context.fillStyle = fillStyle
                }
            },
            _setyAxisFieldsMap: function () {
                var me = this;
                _.each(_.flatten(this.root.dataFrame.yAxis.field), function (field, i) {
                    me._yAxisFieldsMap[field] = {
                        index: i
                    };
                });
            },
            _initaverage: function () {
                if (this.average.enabled) {
                    _.each(this.root.dataFraem, function (fd, i) {
                        if (fd.field == this.average.field) {
                            this.average.fieldInd = i;
                        }
                    });
                }
            },
            _getColor: function (c, groups, vLen, i, h, v, value, field) {
                var style = null;
                if (_.isString(c)) {
                    style = c
                };
                if (_.isArray(c)) {
                    style = _.flatten(c)[this._yAxisFieldsMap[field].index];
                };
                if (_.isFunction(c)) {
                    style = c.apply(this, [{
                        iGroup: i,
                        iNode: h,
                        iLay: v,
                        field: field,
                        value: value,
                        xAxis: {
                            field: this.root._xAxis.field,
                            value: this.root._xAxis.data[h].content
                        }
                    }]);
                };
                if (!style || style == "") {
                    style = this._colors[this._yAxisFieldsMap[field].index];
                };
                return style;
            },
            //只用到了i v。 i＝＝ 一级分组， v 二级分组
            _getFieldFromIHV: function (i, h, v) {
                var yField = this.root._yAxis.field;
                var field = null;
                if (_.isString(yField[i])) {
                    field = yField[i];
                } else if (_.isArray(yField[i])) {
                    field = yField[i][v];
                }
                return field;
            },
            checkBarW: function (xDis1, xDis2) {
                if (this.bar.width) {
                    if (_.isFunction(this.bar.width)) {
                        this.bar._width = this.bar.width(xDis1);
                    } else {
                        this.bar._width = this.bar.width;
                    }
                } else {
                    this.bar._width = parseInt(xDis2) - (parseInt(Math.max(1, xDis2 * 0.3)));

                    //这里的判断逻辑用意已经忘记了，先放着， 有问题在看
                    if (this.bar._width == 1 && xDis1 > 3) {
                        this.bar._width = parseInt(xDis1) - 2;
                    };
                };
                this.bar._width < 1 && (this.bar._width = 1);
            },
            resetData: function (data, opt) {
                this.draw(data.data, opt);
            },
            draw: function (data, opt) {
                _.deepExtend(this, opt);
                if (data.length == 0) {
                    return;
                };

                var preLen = 0;
                this.data[0] && (preLen = this.data[0][0].length);

                this.data = data;
                var me = this;
                var groups = data.length;
                var itemW = 0;

                _.each(data, function (h_group, i) {
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
                    itemW = me.w / hLen;

                    me._barsLen = hLen * groups;

                    for (h = 0; h < hLen; h++) {
                        var groupH;
                        if (i == 0) {
                            //横向的分组
                            if (h <= preLen - 1) {
                                groupH = me.barsSp.getChildById("barGroup_" + h);
                            } else {
                                groupH = me.barsSp.getChildById("barGroup_" + h) ||
                                    new Canvax.Display.Sprite({
                                    id: "barGroup_" + h
                                });
                                me.barsSp.addChild(groupH);
                                groupH.iNode = h;
                                groupH.on("click dblclick mousedown mousemove mouseup", function (e) {
                                    if (!e.eventInfo) {
                                        e.eventInfo = me._getInfoHandler(this);
                                    };
                                });
                            };

                            if (me.eventEnabled) {
                                var hoverRect;

                                var _left = itemW * h;
                                var _right = _left + itemW;
                                var _top = (me.sort && me.sort == "desc") ? 0 : -me.h;
                                var _bottom = _top + me.h;
                                var _depth = me.root._back._depth;


                                hoverRect = groupH.getChildById("bhr_polygon_" + h) ||
                                    new Canvax.Display.Sprite({
                                        id: "bhr_polygon_" + h
                                    });

                                me.drawHoverCube(hoverRect, _left, _right, _top, _bottom, _depth);

                                    //toto:与back的深度一致
                                    //hoverRect.z = -100;

                                    groupH.addChild(hoverRect);
                               
                                hoverRect.iGroup = -1, hoverRect.iNode = h, hoverRect.iLay = -1;
                                    hoverRect.on("panstart mouseover mousemove mouseout click", function (e) {
                                        e.eventInfo = me._getInfoHandler(this, e);
                                    });
                               // }
                            }
                            ;
                        } else {
                            groupH = me.barsSp.getChildById("barGroup_" + h);
                        }
                        ;

                        //同上面，给txt做好分组
                        var txtGroupH;
                        if (i == 0) {
                            if (h <= preLen - 1) {
                                txtGroupH = me.txtsSp.getChildById("txtGroup_" + h);
                            } else {
                                txtGroupH = me.txtsSp.getChildById("txtGroup_" + h) ||
                                    new Canvax.Display.Sprite({
                                    id: "txtGroup_" + h
                                });
                                me.txtsSp.addChild(txtGroupH);
                                txtGroupH.iGroup = i;
                            }
                            ;
                        } else {
                            txtGroupH = me.txtsSp.getChildById("txtGroup_" + h);
                        }
                        ;

                        for (v = 0; v < vLen; v++) {
                            //单个的bar，从纵向的底部开始堆叠矩形
                            var rectData = h_group[v][h];
                            rectData.iGroup = i, rectData.iNode = h, rectData.iLay = v
                            var rectH = parseInt(Math.abs(rectData.y));
                            if (v > 0) {
                                rectH = rectH - parseInt(Math.abs(h_group[v - 1][h].y));
                            }
                            ;
                            var beginY = parseInt(rectData.y);

                            var fillStyle = me._getColor(me.bar.fillStyle, groups, vLen, i, h, v, rectData.value, rectData.field);

                            //根据第一行数据来配置下_yAxisFieldsMap中对应field的fillStyle
                            if (h == 0) {
                                var _yMap = me._yAxisFieldsMap[me._getFieldFromIHV(i, h, v)];
                                if (!_yMap.fillStyle) {
                                    _yMap.fillStyle = fillStyle;
                                }
                                ;
                            }

                            rectData.fillStyle = fillStyle;

                            var finalPos = {
                                x: Math.round(rectData.x - me.bar._width / 2),
                                y: beginY,
                                width: parseInt(me.bar._width),
                                height: rectH,
                                fillStyle: fillStyle,
                                scaleY: 1
                            };
                            var rectCxt = {
                                x: finalPos.x,
                                y: 0,
                                width: finalPos.width,
                                height: 0,
                                fillStyle: finalPos.fillStyle,
                                scaleY: 0
                            };

                            if (!!me.bar.radius && v == vLen - 1) {
                                var radiusR = Math.min(me.bar._width / 2, rectH);
                                radiusR = Math.min(radiusR, me.bar.radius);
                                rectCxt.radius = [radiusR, radiusR, 0, 0];
                            }
                            ;

                            if (!me.animation) {
                                delete rectCxt.scaleY;
                                rectCxt.y = finalPos.y;
                                rectCxt.height = finalPos.height;
                            }
                            ;

                            var rectEl = groupH.getChildById("bar_" + i + "_" + h + "_" + v) ||
                                    new Canvax.Display.Sprite({
                                    id: "bar_" + i + "_" + h + "_" + v
                                });

                                //四边形 转换为 立方体
                                me.drawCube(rectEl, rectCxt);

                                groupH.addChild(rectEl);

                            ;

                            rectEl.finalPos = finalPos;

                            rectEl.iGroup = i, rectEl.iNode = h, rectEl.iLay = v;

                            if (me.eventEnabled) {
                                rectEl.on("panstart mouseover mousemove mouseout click dblclick", function (e) {
                                    e.eventInfo = me._getInfoHandler(this, e);
                                    if (e.type == "mouseover") {
                                        this.parent.getChildById("bhr_" + this.iNode).context.globalAlpha = 0.1;
                                    }
                                    if (e.type == "mouseout") {
                                        this.parent.getChildById("bhr_" + this.iNode).context.globalAlpha = 0;
                                    }
                                });
                            }
                            ;

                            if (v == vLen - 1 && me.text.enabled) {
                                //文字
                                var contents = [rectData];

                                var infosp;
                                if (h <= preLen - 1) {
                                    infosp = txtGroupH.getChildById("infosp_" + i + "_" + h);
                                } else {
                                    infosp = txtGroupH.getChildById("infosp_" + i + "_" + h) ||
                                        new Canvax.Display.Sprite({
                                        id: "infosp_" + i + "_" + h,
                                        context: {
                                            visible: false
                                        }
                                    });
                                    infosp._hGroup = h;
                                    txtGroupH.addChild(infosp);
                                }
                                infosp.noSkip = true;
                                ;

                                if (vLen > 1) {
                                    for (var c = vLen - 2; c >= 0; c--) {
                                        contents.unshift(h_group[c][h]);
                                    }
                                }
                                ;

                                var infoWidth = 0;
                                var infoHeight = 0;

                                _.each(contents, function (cdata, ci) {
                                    var content = cdata.value;
                                    if (!me.animation && _.isFunction(me.text.format)) {
                                        content = me.text.format(cdata.value);
                                    }
                                    ;
                                    if (!me.animation && _.isNumber(content)) {
                                        content = Tools.numAddSymbol(content);
                                    }
                                    ;

                                    var txt;
                                    if (h <= preLen - 1) {
                                        txt = infosp.getChildById("info_txt_" + i + "_" + h + "_" + ci);
                                    } else {
                                        txt = new Canvax.Display.Text(content, {
                                            id: "info_txt_" + i + "_" + h + "_" + ci,
                                            context: {
                                                x: infoWidth + 2,
                                                fillStyle: cdata.fillStyle,
                                                fontSize: me.text.fontSize,
                                                lineWidth: me.text.lineWidth,
                                                strokeStyle: me.text.strokeStyle
                                            }
                                        });
                                        txt.z = -me.depth * 0.5;
                                        infosp.addChild(txt);
                                    }
                                    ;
                                    txt._text = content;
                                    infoWidth += txt.getTextWidth() + 2;
                                    infoHeight = Math.max(infoHeight, txt.getTextHeight());

                                    if (me.animation) {
                                        txt.resetText(0);
                                    }

                                    if (ci <= vLen - 2) {
                                        txt = new Canvax.Display.Text("/", {
                                            context: {
                                                x: infoWidth + 2,
                                                fillStyle: "#999"
                                            }
                                        });
                                        txt.z = -me.depth * 0.5;
                                        infoWidth += txt.getTextWidth() + 2;
                                        infosp.addChild(txt);
                                    }
                                    ;
                                });

                                infosp._finalX = rectData.x - infoWidth / 2;
                                infosp._finalY = finalPos.y - infoHeight;
                                infosp._centerX = rectData.x;
                                infosp.context.width = infoWidth;
                                infosp.context.height = infoHeight;
                                infosp.context.x = rectData.x - infoWidth / 2;

                                if (!me.animation) {
                                    infosp.context.y = finalPos.y - infoHeight - 15;
                                    //infosp.context.x = rectData.x - infoWidth / 2;
                                    infosp.context.visible = true;
                                }

                            }
                        }
                        ;
                    }
                });

                this.sprite.addChild(this.barsSp);

                this.sprite.addChild(this.checkedSp)

                if (this.text.enabled) {
                    this.sprite.addChild(this.txtsSp);
                }
                ;

                //如果有average模块配置。
                if (this.average.enabled && this.average.data) {
                    !this.averageSp && (this.averageSp = new Canvax.Display.Sprite({
                        id: "averageSp"
                    }));
                    _.each(this.average.layoutData, function (average, i) {
                        var averageRectC = {
                            x: itemW * i,
                            y: average.y,
                            fillStyle: me.average.fillStyle,
                            width: itemW,
                            height: 2
                        };
                        var averageLine;
                        if (i <= preLen - 1) {
                            averageLine = me.averageSp.getChildById("average_" + i);
                            averageLine.context.x = averageRectC.x;
                            averageLine.context.y = averageRectC.y;
                            averageLine.context.width = averageRectC.width;
                        } else {
                            averageLine = new Rect({
                                id: "average_" + i,
                                context: averageRectC
                            });
                            me.averageSp.addChild(averageLine);
                        }
                        ;

                    });
                    this.sprite.addChild(me.averageSp);
                }
                ;

                this.sprite.context.x = this.pos.x;
                this.sprite.context.y = this.pos.y;

                if (this.sort && this.sort == "desc") {
                    this.sprite.context.y -= this.h;
                }


            },
            _updateInfoTextPos: function (el, index) {
                if (this.root.type == "horizontal") {
                    return;
                }
                ;
                var infoWidth = 0;
                var infoHeight = 0;
                var cl = el.children.length;
                _.each(el.children, function (c, i) {
                    if (c.getTextWidth) {
                        c.context.x = infoWidth;
                        infoWidth += c.getTextWidth() + (i < cl ? 2 : 0);
                        infoHeight = Math.max(infoHeight, c.getTextHeight());
                    }
                    ;
                });
                //el.context.x = el._centerX - infoWidth / 2 + 1;

                el.context.width = infoWidth;
                el.context.height = infoHeight;
                if (index === 0) {
                    this.root._to3d(el);
                }


            },
            /**
             * 生长动画
             */
            grow: function (callback, opt) {
                var self = this;
                if (!this.animation) {
                    callback && callback(self);
                    return;
                }

                var sy = 1;
                if (this.sort && this.sort == "desc") {
                    sy = -1;
                }
                ;

                //先把已经不在当前range范围内的元素destroy掉
                if (self.data[0] && self.barsSp.children.length > self.data[0][0].length) {
                    for (var i = self.data[0][0].length, l = self.barsSp.children.length; i < l; i++) {
                        self.barsSp.getChildAt(i).destroy();
                        self.text.enabled && self.txtsSp.getChildAt(i).destroy();
                        self.averageSp && self.averageSp.getChildAt(i).destroy();
                        i--;
                        l--;
                    }
                    ;
                }
                ;

                var options = _.extend({
                    delay: Math.min(1000 / this._barsLen, 200),
                    easing: "Back.Out",
                    duration: 500
                }, opt);

                _.each(self.data, function (h_group, g) {
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
                                }

                                var options_Animation = {
                                    from: {
                                        y: 0,
                                        height: 0
                                    },
                                    to: {
                                        y: bar.finalPos.y,
                                        height: bar.finalPos.height
                                    },
                                    onUpdate: (function (bar, me) {
                                        var _sprite = bar;
                                        return function (arg) {
                                            me.drawCube(_sprite, {
                                                x: _sprite.finalPos.x,
                                                y: this.y,
                                                width: _sprite.finalPos.width,
                                                height: this.height
                                            });

                                            me.root._to3d(_sprite);

                                        };
                                    }(bar, self)),

                                    onComplete: function () {

                                    },
                                    id: bar.id,
                                    duration: options.duration,
                                    easing: options.easing,
                                    delay: h * options.delay
                                }

                                bar._tweenObj = AnimationFrame.registTween(options_Animation);

                            }
                            ;

                        }

                        //txt grow
                        if (self.text.enabled) {
                            var txtGroupH = self.txtsSp.getChildById("txtGroup_" + h);

                            var infosp = txtGroupH.getChildById("infosp_" + g + "_" + h);

                            if (self.root.type == "horizontal") {
                                infosp.context.x = infosp._finalX;
                            }


                            infosp.animate({
                                y: infosp._finalY-15,
                                x: infosp._finalX
                            }, {
                                duration: options.duration,
                                easing: options.easing,
                                delay: h * options.delay,
                                onUpdate: function () {
                                    this.context.visible = true;
                                },
                                onComplete: function () {
                                }
                            });
                            _.each(infosp.children, function (txt, index) {
                                if (txt._text) {
                                    if (txt._tweenObj) {
                                        AnimationFrame.destroyTween(txt._tweenObj);
                                    }
                                    ;
                                    txt._tweenObj = AnimationFrame.registTween({
                                        from: {
                                            v: txt.text
                                        },
                                        to: {
                                            v: txt._text
                                        },
                                        duration: options.duration,
                                        delay: h * options.delay,
                                        onUpdate: (function (txt, index) {

                                            return function () {
                                                var content = this.v;
                                                if (_.isFunction(self.text.format)) {
                                                    content = self.text.format(content);
                                                } else if (_.isNumber(content)) {
                                                    content = Tools.numAddSymbol(parseInt(content));
                                                }
                                                ;
                                                txt.resetText(content);
                                                if (txt.parent) {
                                                    self._updateInfoTextPos(txt.parent, index);
                                                } else {
                                                    txt.destroy();
                                                }
                                            }
                                        })(txt, index),


                                    })
                                }
                                ;
                            });
                        }
                    }
                    ;
                });
                window.setTimeout(function () {
                    callback && callback(self);
                }, 300 * (this.barsSp.children.length - 1));


            },
            _getInfoHandler: function (target) {
                var node = {
                    iGroup: target.iGroup,
                    iNode: target.iNode,
                    iLay: target.iLay,
                    nodesInfoList: this._getNodeInfo(target.iGroup, target.iNode, target.iLay)
                };
                return node;
            },
            _getNodeInfo: function (iGroup, iNode, iLay) {
                var arr = [];
                var me = this;
                var groups = me.data.length;

                iGroup == undefined && (iGroup = -1);
                iNode == undefined && (iNode = 0);
                iLay == undefined && (iLay = -1);

                _.each(me.data, function (h_group, i) {
                    var node;
                    var vLen = h_group.length;
                    if (vLen == 0) return;
                    var hLen = h_group[0].length;
                    for (h = 0; h < hLen; h++) {
                        if (h == iNode) {
                            for (v = 0; v < vLen; v++) {
                                if ((iGroup == i || iGroup == -1) && (iLay == v || iLay == -1)) {
                                    node = h_group[v][h]
                                    node.fillStyle = me._getColor(me.bar.fillStyle, groups, vLen, i, h, v, node.value, node.field);
                                    arr.push(node)
                                }
                            }
                        }
                    }
                });
                return arr;
            },
            drawHoverCube: function (sprite, _left, _right, _top, _bottom, _depth) {
                var me = this;
                var _strokeStyle = null;
                var _frontFillStyle = "#ccc";
                var _topFillStyle = "#ccc";
                var _sideFillStyle = "#ccc";
                var _globalAlpha = 0.3

                //左面
                var _pointList = [[_left, _top, 0], [_left, _top, _depth], [_left, _bottom, _depth], [_left, _bottom, 0]];
                var leftFace = me.drawFace("bhr_polygon_left", _pointList, _sideFillStyle, _strokeStyle, sprite);

                //前面
                var _pointList = [[_left, _top, 0], [_right, _top, 0], [_right, _bottom, 0], [_left, _bottom, 0]];
                var frontFace = me.drawFace("bhr_polygon_front", _pointList, _frontFillStyle, _strokeStyle, sprite);

                //右侧
                var _pointList = [[_right, _top, 0], [_right, _top, _depth], [_right, _bottom, _depth], [_right, _bottom, 0]];
                var rightFace = me.drawFace("bhr_polygon_right", _pointList, _sideFillStyle, _strokeStyle, sprite);


                //顶部
                var _pointList = [[_left, _top, 0], [_right, _top, 0], [_right, _top, _depth], [_left, _top, _depth]];
                var topFace = me.drawFace("bhr_polygon_top", _pointList, _topFillStyle, _strokeStyle, sprite);

                var _hoverEnter = function (e) {
                    leftFace.context.globalAlpha = _globalAlpha;
                    frontFace.context.globalAlpha = _globalAlpha;
                    rightFace.context.globalAlpha = _globalAlpha;
                    topFace.context.globalAlpha = _globalAlpha;

                };
                var _hoverLeave = function (e) {
                    leftFace.context.globalAlpha = 0;
                    frontFace.context.globalAlpha = 0;
                    rightFace.context.globalAlpha = 0;
                    topFace.context.globalAlpha = 0;
                };
                _hoverLeave();


                leftFace.hover(_hoverEnter, _hoverLeave);
                frontFace.hover(_hoverEnter, _hoverLeave);
                frontFace.hover(_hoverEnter, _hoverLeave);
                frontFace.hover(_hoverEnter, _hoverLeave);

                sprite.addChild(leftFace);
                sprite.addChild(frontFace);
                sprite.addChild(rightFace);
                sprite.addChild(topFace);
            },
            drawCube: function (sprite, rectCxt) {

                var me = this;

                //四边形 转换为 立方体
                var _left = rectCxt.x;
                var _right = _left + rectCxt.width;
                var _top = rectCxt.y;
                var _bottom = _top + rectCxt.height;
                var _depth = -1 * me.depth;


                //绘制样式
                var _strokeStyle = rectCxt.fillStyle;
                var _frontFillStyle = rectCxt.fillStyle;
                var _topFillStyle = ColorFormat.colorBrightness(rectCxt.fillStyle, 0.1);
                var _sideFillStyle = ColorFormat.colorBrightness(rectCxt.fillStyle, -0.1);

                //左面
                var _pointList = [[_left, _top, 0], [_left, _top, _depth], [_left, _bottom, _depth], [_left, _bottom, 0]];
                var leftFace = me.drawFace("polygon_left", _pointList, _sideFillStyle, _strokeStyle, sprite);

                //前面
                var _pointList = [[_left, _top, 0], [_right, _top, 0], [_right, _bottom, 0], [_left, _bottom, 0]];
                var frontFace = me.drawFace("polygon_front", _pointList, _frontFillStyle, _strokeStyle, sprite);

                //右侧
                var _pointList = [[_right, _top, 0], [_right, _top, _depth], [_right, _bottom, _depth], [_right, _bottom, 0]];
                var rightFace = me.drawFace("polygon_right", _pointList, _sideFillStyle, _strokeStyle, sprite);


                //顶部
                var _pointList = [[_left, _top, 0], [_right, _top, 0], [_right, _top, _depth], [_left, _top, _depth]];
                var topFace = me.drawFace("polygon_top", _pointList, _topFillStyle, _strokeStyle, sprite);


                sprite.addChild(leftFace);
                sprite.addChild(frontFace);
                sprite.addChild(rightFace);
                sprite.addChild(topFace);


            },
            drawFace: function (_id, _pointList, _fillStyle, _strokeStyle, sprite) {
                var _polygon = sprite.getChildById(_id) ||
                    new Shapes.Polygon({
                    id: _id,
                    pointChkPriority: false,
                    context: {
                        pointList: _pointList,
                        strokeStyle: _strokeStyle,
                        fillStyle: _fillStyle
                    }
                });

                _polygon.context.pointList = _pointList;
                _polygon.context.x = 0;
                _polygon.context.y = 0;

                return _polygon;
            },
            _depthTest: function (sprite) {

                (function (_sprite) {
                    var getLeaf = arguments.callee;
                    if (_sprite.children && _sprite.children.length > 0) {
                        _.each(_sprite.children, function (a, i) {
                            getLeaf(a);
                        })
                    } else {
                        var _parentSprite = _sprite.parent;

                        if (_sprite instanceof Shapes.Polygon && ~_parentSprite.id.indexOf('bar_')) {

                            var _frontFace = null;
                            var currFace = _sprite.context.pointList;
                            _.each(_parentSprite.children, function (o, i) {
                                if (~o.id.indexOf('front')) {
                                    _frontFace = o.context.pointList;
                                }
                            });

                            //判断该面的Z值为负数的点是否在前面的范围内
                            if (~_sprite.id.indexOf('left') || ~_sprite.id.indexOf('right')) {
                                var isCover = false;


                                var p1 = Vector3.fromValues(currFace[1][0], currFace[1][1], 0);
                                if (~_sprite.id.indexOf('left')) {
                                    var p2 = Vector3.fromValues(_frontFace[0][0], _frontFace[0][1], 0);
                                    var p3 = Vector3.fromValues(_frontFace[3][0], _frontFace[3][1], 0);
                                }
                                if (~_sprite.id.indexOf('right')) {
                                    var p2 = Vector3.fromValues(_frontFace[1][0], _frontFace[1][1], 0);
                                    var p3 = Vector3.fromValues(_frontFace[2][0], _frontFace[2][1], 0);
                                }


                                var _v1 = Vector3.create();
                                var _v2 = Vector3.create();
                                var _vc = Vector3.create();
                                //顶面指向Z轴负半轴的向量
                                Vector3.sub(_v1, p1, p2);
                                Vector3.normalize(_v1, _v1);
                                //前面指向Y轴正半轴的向量
                                Vector3.sub(_v2, p2, p3);
                                Vector3.normalize(_v2, _v2);

                                //二维空间中,XY的叉积指向Z轴的结果
                                Vector3.cross(_vc, _v1, _v2);

                                //根据不同的侧面判断Z的大小,取得是否在Y轴的左侧或右侧
                                if (~_sprite.id.indexOf('left') && _vc[2] < 0) {
                                    isCover = true;
                                } else if (~_sprite.id.indexOf('right') && _vc[2] > 0) {
                                    isCover = true;
                                }

                                if (isCover) {
                                    _sprite.context.visible = false;
                                }else{
                                    _sprite.context.visible = true;
                                }
                            }

                        }

                    }
                })(sprite);

            }
        };
        return Graphs;
    });


define('chartx/chart/bar/3d/xaxis',
    [
        "canvax/index",
        "canvax/core/Base",
        "canvax/shape/Line",
        "chartx/utils/tools"
    ],
    function (Canvax, CanvaxBase, Line, Tools) {
        var xAxis = function (root) {

            var opt = root.xAxis,
                data = root.dataFrame.xAxis;
            this.root = root;
            this.graphw = 0;
            this.graphh = 0;
            this.yAxisW = 0;
            this.w = 0;
            this.h = 0;

            this.disY = 1;
            this.dis = 6; //线到文本的距离

            this.label = "";
            this._label = null; //this.label对应的文本对象

            this.line = {
                enabled: 1, //是否有line
                width: 1,
                height: 4,
                strokeStyle: '#cccccc'
            };

            this.text = {
                fillStyle: '#999',
                fontSize: 12,
                rotation: 0,
                format: null,
                textAlign: null
            };
            this.maxTxtH = 0;

            this.pos = {
                x: null,
                y: null
            };

            //this.display = "block";
            this.enabled = 1; //1,0 true ,false

            this.disXAxisLine = 6; //x轴两端预留的最小值
            this.disOriginX = 0; //背景中原点开始的x轴线与x轴的第一条竖线的偏移量
            this.xGraphsWidth = 0; //x轴宽(去掉两端)

            this.dataOrg = []; //源数据
            this.dataSection = []; //默认就等于源数据
            this._layoutDataSection = []; //dataSection的format后的数据
            this.data = []; //{x:100, content:'1000'}
            this.layoutData = []; //this.data(可能数据过多),重新编排过滤后的数据集合, 并根据此数组展现文字和线条
            this.sprite = null;

            this._textMaxWidth = 0;
            this.leftDisX = 0; //x轴最左边需要的间距。默认等于第一个x value字符串长度的一半

            //过滤器，可以用来过滤哪些yaxis 的 节点是否显示已经颜色之类的
            //@params params包括 dataSection , 索引index，txt(canvax element) ，line(canvax element) 等属性
            this.filter = null; //function(params){};

            this.isH = false; //是否为横向转向的x轴

            this.animation = false;
            this.resize = false;

            this.init(opt, data);
        };
        xAxis.prototype = {
            init: function (opt, data) {
                this.sprite = new Canvax.Display.Sprite({
                    id: "xAxisSprite"
                });
                this._initHandle(opt, data);
            },
            _initHandle: function (opt, data) {
                data && data.org && (this.dataOrg = data.org);

                if (opt) {
                    _.deepExtend(this, opt);
                }

                if (this.text.rotation != 0 && this.text.rotation % 90 == 0) {
                    this.isH = true;
                }

                if (!this.line.enabled) {
                    this.line.height = 1
                }

                if (this.dataSection.length == 0) {
                    this.dataSection = this._initDataSection(this.dataOrg);
                }
                ;

                //先计算出来显示文本
                this._layoutDataSection = this._formatDataSectionText(this.dataSection);

                //然后计算好最大的width 和 最大的height，外部组件需要用
                this._setTextMaxWidth();
                this._setXAxisHeight();

            },
            /**
             *return dataSection 默认为xAxis.dataOrg的的faltten
             *即 [ [1,2,3,4] ] -- > [1,2,3,4]
             */
            _initDataSection: function (data) {
                return _.flatten(data);
            },
            setX: function ($n) {
                this.sprite.context.x = $n
            },
            setY: function ($n) {
                this.sprite.context.y = $n
            },
            //数据变化，配置没变的情况
            resetData: function (data, opt) {
                //先在field里面删除一个字段，然后重新计算
                if (opt) {
                    _.deepExtend(this, opt);
                }
                ;
                this.sprite.removeAllChildren();
                this.dataSection = [];

                this._initHandle(null, data);

                this.draw();
            },
            getIndexOfVal: function (xvalue) {
                var i;

                for (var ii = 0, il = this.data.length; ii < il; ii++) {
                    var obj = this.data[ii];
                    if (obj.content == xvalue) {
                        i = ii;
                        break;
                    }
                }
                ;

                return i;
            },
            //配置和数据变化
            update: function (opt, data) {
                //先在field里面删除一个字段，然后重新计算
                _.deepExtend(this, opt);
                this.resetData(data);
            },
            draw: function (opt) {
                // this.data = [{x:0,content:'0000'},{x:100,content:'10000'},{x:200,content:'20000'},{x:300,content:'30000'},{x:400,content:'0000'},{x:500,content:'10000'},{x:600,content:'20000'}]
                if (this.data.length == 0) {

                }
                ;
                this._getLabel();
                this._initConfig(opt);
                this.data = this._trimXAxis(this.dataSection, this.xGraphsWidth);
                var me = this;
                _.each(this.data, function (obj, i) {
                    obj.layoutText = me._layoutDataSection[i];
                });

                this._trimLayoutData();

                this.setX(this.pos.x);
                this.setY(this.pos.y);

                if (this.enabled) { //this.display != "none"
                    this._widget();

                    if (!this.text.rotation) {
                        this._layout();
                    }
                }

                this.resize = false;
                // this.data = this.layoutData
            },
            _getLabel: function () {
                if (this.label && this.label != "") {

                    this._label = this.sprite.getChildById("xAxis_label_" + this.label) ||

                        new Canvax.Display.Text(this.label, {
                            id: "xAxis_label_" + this.label,
                        context: {
                            fontSize: this.text.fontSize,
                            textAlign: this.isH ? "center" : "left",
                            textBaseline: this.isH ? "top" : "middle",
                            fillStyle: this.text.fillStyle,
                            rotation: this.isH ? -90 : 0
                        }
                    });
                }
            },
            //初始化配置
            _initConfig: function (opt) {
                if (opt) {
                    _.deepExtend(this, opt);
                }
                ;

                this.yAxisW = Math.max(this.yAxisW, this.leftDisX);
                this.w = this.graphw - this.yAxisW;
                if (this.pos.x == null) {
                    this.pos.x = this.yAxisW + this.disOriginX;
                }
                ;
                if (this.pos.y == null) {
                    this.pos.y = this.graphh - this.h;
                }
                ;
                this.xGraphsWidth = parseInt(this.w - this._getXAxisDisLine());

                if (this._label) {
                    if (this.isH) {
                        this.xGraphsWidth -= this._label.getTextHeight() + 5
                    } else {
                        this.xGraphsWidth -= this._label.getTextWidth() + 5
                    }
                }
                ;
                this.disOriginX = parseInt((this.w - this.xGraphsWidth) / 2);
            },
            _trimXAxis: function (data, xGraphsWidth) {

                var tmpData = [];
                this.xDis1 = xGraphsWidth / data.length;
                for (var a = 0, al = data.length; a < al; a++) {
                    var o = {
                        'content': data[a],
                        'x': this.xDis1 * (a + 1) - this.xDis1 / 2
                    }
                    tmpData.push(o);
                }
                ;
                return tmpData;
            },
            _formatDataSectionText: function (arr) {
                if (!arr) {
                    arr = this.dataSection;
                }
                ;
                var me = this;
                var currArr = [];
                _.each(arr, function (val) {
                    currArr.push(me._getFormatText(val));
                });
                return currArr;
            },
            _getXAxisDisLine: function () { //获取x轴两端预留的距离
                var disMin = this.disXAxisLine
                var disMax = 2 * disMin
                var dis = disMin
                dis = disMin + this.w % _.flatten(this.dataOrg).length
                dis = dis > disMax ? disMax : dis
                dis = isNaN(dis) ? 0 : dis
                return dis
            },
            _setXAxisHeight: function () { //检测下文字的高等
                if (!this.enabled) { //this.display == "none"
                    this.dis = 0;
                    this.h = 3; //this.dis;//this.max.txtH;
                } else {
                    var txt = new Canvax.Display.Text(this._layoutDataSection[0] || "test", {
                        context: {
                            fontSize: this.text.fontSize
                        }
                    });

                    this.maxTxtH = txt.getTextHeight();

                    if (!!this.text.rotation) {
                        if (this.text.rotation % 90 == 0) {
                            this.h = this._textMaxWidth + this.line.height + this.disY + this.dis + 3;
                        } else {
                            var sinR = Math.sin(Math.abs(this.text.rotation) * Math.PI / 180);
                            var cosR = Math.cos(Math.abs(this.text.rotation) * Math.PI / 180);
                            this.h = sinR * this._textMaxWidth + txt.getTextHeight() + 5;
                            this.leftDisX = cosR * txt.getTextWidth() + 8;
                        }
                    } else {
                        this.h = this.disY + this.line.height + this.dis + this.maxTxtH;
                        this.leftDisX = txt.getTextWidth() / 2;
                    }
                }
            },
            _getFormatText: function (text) {
                var res;
                if (_.isFunction(this.text.format)) {
                    res = this.text.format(text);
                } else {
                    res = text
                }
                if (_.isArray(res)) {
                    res = Tools.numAddSymbol(res);
                }
                if (!res) {
                    res = text;
                }
                ;
                return res;
            },
            _widget: function () {
                var arr = this.layoutData

                if (this._label) {
                    this._label.context.x = this.xGraphsWidth + 5;
                    this.sprite.addChild(this._label);
                }
                ;

                var delay = Math.min(1000 / arr.length, 25);

                for (var a = 0, al = arr.length; a < al; a++) {

                    var xNode = this.sprite.getChildById("xNode" + a) ||
                        new Canvax.Display.Sprite({
                        id: "xNode" + a
                    });

                    var o = arr[a]
                    var x = o.x,
                        y = this.disY + this.line.height + this.dis

                    //文字
                    var txt = xNode.getChildById("xAxis_txt_" + a) ||
                        new Canvax.Display.Text((o.layoutText || o.content), {
                            id: "xAxis_txt_" + a,
                        context: {
                            fillStyle: this.text.fillStyle,
                            fontSize: this.text.fontSize,
                            rotation: -Math.abs(this.text.rotation),
                            textAlign: this.text.textAlign || (!!this.text.rotation ? "right" : "center"),
                            textBaseline: !!this.text.rotation ? "middle" : "top",
                            globalAlpha: 1
                        }
                    });

                    txt.context.x = x;
                    txt.context.y = y;
                    xNode.addChild(txt);

                    if (!!this.text.rotation && this.text.rotation != 90) {
                        txt.context.x += 5;
                        txt.context.y += 3;
                    }

                    if (this.line.enabled) {
                        //线条
                        var line = xNode.getChildById("xAxis_line_" + a) ||
                            new Line({
                                id: "xAxis_line_" + a,
                            context: {
                                lineWidth: this.line.width,
                                strokeStyle: this.line.strokeStyle
                            }
                        });

                        line.context.x = x;
                        line.context.y = this.disY;
                        line.xEnd = 0;
                        line.End = this.line.height + this.disY;

                        xNode.addChild(line);
                    }
                    ;

                    //这里可以由用户来自定义过滤 来 决定 该node的样式
                    _.isFunction(this.filter) && this.filter({
                        layoutData: arr,
                        index: a,
                        txt: txt,
                        line: line || null
                    });

                    this.sprite.addChild(xNode);

                    //if (false && this.animation && !this.resize) {
                    //    txt.animate({
                    //        globalAlpha: 1,
                    //        y: txt.context.y - 20
                    //    }, {
                    //        duration: 500,
                    //        easing: 'Back.Out', //Tween.Easing.Elastic.InOut
                    //        delay: a * delay,
                    //        id: txt.id
                    //    });
                    //} else {
                    //        txt.context.y = txt.context.y - 20;
                    //        txt.context.globalAlpha = 1;
                    //}
                    ;
                }
                ;
            },
            /*校验最后一个文本是否超出了界限。然后决定是否矫正*/
            _layout: function () {

                if (this.data.length == 0)
                    return;

                var popText = this.sprite.getChildAt(this.sprite.getNumChildren() - 1).getChildAt(0);
                if (popText) {
                    var pc = popText.context;
                    if (pc.textAlign == "center" &&
                        pc.x + popText.context.width / 2 > this.w) {
                        pc.x = this.w - popText.context.width / 2
                    }
                    ;
                    if (pc.textAlign == "left" &&
                        pc.x + popText.context.width > this.w) {
                        pc.x = this.w - popText.context.width
                    }
                    ;
                    if (this.sprite.getNumChildren() > 2) {
                        //倒数第二个text
                        var popPreText = this.sprite.getChildAt(this.sprite.getNumChildren() - 2).getChildAt(0);
                        var ppc = popPreText.context;
                        //如果最后一个文本 和 倒数第二个 重叠了，就 隐藏掉
                        if (ppc.visible && pc.x < ppc.x + ppc.width) {
                            pc.visible = false;
                        }
                    }
                }
            },
            _setTextMaxWidth: function () {
                var arr = this._layoutDataSection;
                var maxLenText = arr[0];

                for (var a = 0, l = arr.length; a < l; a++) {
                    if (arr[a].length > maxLenText.length) {
                        maxLenText = arr[a];
                    }
                }
                ;

                var txt = new Canvax.Display.Text(maxLenText || "test", {
                    context: {
                        fillStyle: this.text.fillStyle,
                        fontSize: this.text.fontSize
                    }
                });

                this._textMaxWidth = txt.getTextWidth();
                this._textMaxHeight = txt.getTextHeight();

                return this._textMaxWidth;
            },
            _trimLayoutData: function () {

                var tmp = []
                var arr = this.data

                var mw = this._textMaxWidth + 10;

                if (!!this.text.rotation) {
                    mw = this._textMaxHeight * 1.5;
                }
                ;

                //总共能多少像素展现
                var n = Math.min(Math.floor(this.w / mw), arr.length - 1); //能展现几个

                if (n >= arr.length - 1) {
                    this.layoutData = arr;
                } else {
                    //需要做间隔
                    var dis = Math.max(Math.ceil(arr.length / n - 1), 0); //array中展现间隔
                    //存放展现的数据
                    for (var a = 0; a < n; a++) {
                        var obj = arr[a + dis * a];
                        obj && tmp.push(obj);
                    }
                    ;
                    this.layoutData = tmp;
                }
                ;
            }
        };
        return xAxis;
    });

define('chartx/chart/bar/3d/yaxis',
    [
        "canvax/index",
        "canvax/core/Base",
        "canvax/shape/Line",
        "chartx/utils/tools",
        "chartx/utils/datasection"
    ],
    function (Canvax, CanvaxBase, Line, Tools, DataSection) {
        var yAxis = function (root) {

            var opt = root.yAxis,
                data = root.dataFrame.yAxis,
                data1 = root._getaverageData();

            this.root = root;

            this.w = 0;
            this.enabled = 1; //true false 1,0都可以
            this.dis = 6; //线到文本的距离
            this.maxW = 0; //最大文本的width
            this.field = null; //这个 轴 上面的 field

            this.label = "";
            this._label = null; //label的text对象

            this.line = {
                enabled: 1, //是否有line
                width: 4,
                lineWidth: 1,
                strokeStyle: '#cccccc'
            };

            this.text = {
                fillStyle: '#999',
                fontSize: 12,
                format: null,
                rotation: 0
            };
            this.pos = {
                x: 0,
                y: 0
            };
            this.place = "left"; //yAxis轴默认是再左边，但是再双轴的情况下，可能会right
            this.biaxial = false; //是否是双轴中的一份
            this.layoutData = []; //dataSection 对应的layout数据{y:-100, content:'1000'}
            this.dataSection = []; //从原数据 dataOrg 中 结果 datasection 重新计算后的数据

            //默认的 dataSectionGroup = [ dataSection ], dataSection 其实就是 dataSectionGroup 去重后的一维版本
            this.dataSectionGroup = []; 

            //如果middleweight有设置的话 dataSectionGroup 为被middleweight分割出来的n个数组>..[ [0,50 , 100],[100,500,1000] ]
            this.middleweight = null; 

            this.dataOrg = []; //源数据

            this.sprite = null;
            //this.x           = 0;
            //this.y           = 0;
            this.disYAxisTopLine = 6; //y轴顶端预留的最小值
            this.yMaxHeight = 0; //y轴最大高
            this.yGraphsHeight = 0; //y轴第一条线到原点的高

            this.baseNumber = null;
            this.basePoint = null; //value为baseNumber的point {x,y}

            //过滤器，可以用来过滤哪些yaxis 的 节点是否显示已经颜色之类的
            //@params params包括 dataSection , 索引index，txt(canvax element) ，line(canvax element) 等属性
            this.filter = null; //function(params){};

            this.isH = false; //是否横向

            this.animation = true;
            this.resize = false;

            this.sort = null; //"asc" //排序，默认从小到大, desc为从大到小，之所以不设置默认值为asc，是要用null来判断用户是否进行了配置

            this.init(opt, data , data1);
        };

        yAxis.prototype = {
            init: function (opt, data, data1) {
                _.deepExtend(this, opt);

                if (this.text.rotation != 0 && this.text.rotation % 90 == 0) {
                    this.isH = true;
                }
                ;

                this._initData(data , data1);
                this.sprite = new Canvax.Display.Sprite();
            },
            setX: function($n) {
                this.sprite.context.x = $n + (this.place == "left" ? this.maxW : 0);
                this.pos.x = $n;
            },
            setY: function($n) {
                this.sprite.context.y = $n;
                this.pos.y = $n;
            },
            setAllStyle: function (sty) {
                _.each(this.sprite.children, function (s) {
                    _.each(s.children, function (cel) {
                        if (cel.type == "text") {
                            cel.context.fillStyle = sty;
                        } else if (cel.type == "line") {
                            cel.context.strokeStyle = sty;
                        }
                    });
                });
            },
            //数据变化，配置没变的情况
            resetData: function (data, opt) {
                //先在field里面删除一个字段，然后重新计算
                if (opt) {
                    _.deepExtend(this, opt);
                }
                ;
                this.sprite.removeAllChildren();
                this.dataSection = [];
                this.dataSectionGroup = [];
                //_.deepExtend( this , opt );
                this._initData(data);
                this._trimYAxis();
                this._widget();
                //this.draw();
            },
            //配置和数据变化
            update: function (opt, data) {
                //先在field里面删除一个字段，然后重新计算
                this.sprite.removeAllChildren();
                this.dataSection = [];
                this.dataSectionGroup = [];
                _.deepExtend(this, opt);
                this._initData(data);
                this._trimYAxis();
                this._widget();
                //this.draw();
            },
            _getLabel: function () {
                if (this.label && this.label != "") {
                    this._label =this.sprite.getChildById('yAxis_label_'+this.label)||
                    new Canvax.Display.Text(this.label, {
                        id:'yAxis_label_'+this.label,
                        context: {

                            fontSize: this.text.fontSize,
                            textAlign: "left",
                            textBaseline: this.isH ? "top" : "bottom",
                            fillStyle: this.text.fillStyle,
                            rotation: this.isH ? -90 : 0
                        }
                    });
                }
            },
            draw: function (opt) {
                this.sprite.removeAllChildren();
                opt && _.deepExtend(this, opt);
                this._getLabel();
                this.yGraphsHeight = this.yMaxHeight - this._getYAxisDisLine();

                if (this._label) {
                    if (this.isH) {
                        this.yGraphsHeight -= this._label.getTextWidth();
                    } else {
                        this.yGraphsHeight -= this._label.getTextHeight();
                    }
                    this._label.context.y = -this.yGraphsHeight - 5;
                };

                this._trimYAxis();
                this._widget();

                this.setX(this.pos.x);
                this.setY(this.pos.y);


                this.resize = false;
            },
            //更具y轴的值来输出对应的在y轴上面的位置
            getYposFromVal : function( val ){
                var y = 0;
                var dsgLen = this.dataSectionGroup.length;
                var yGroupHeight = this.yGraphsHeight / dsgLen ;

                for( var i=0,l=dsgLen ; i<l ; i++ ){
                    var ds = this.dataSectionGroup[i];
                    var min = _.min(ds);
                    var max = _.max(ds);
                    var bottom = ds[0];
                    var top = ds.slice(-1)[0];
                    if( 
                        (val > min && val <= max) || 
                        ( this.sort == "desc" && val >= min && val < max )
                    ){
                        var y = -((val - bottom) / (top - bottom) * yGroupHeight + i*yGroupHeight) ;
                        break;
                    }
                };
                y = isNaN(y) ? 0 : parseInt(y);
                return y;
                
                /*
                var max = this.dataSection[this.dataSection.length - 1];
                var y = -(val - this._bottomNumber) / (max - this._bottomNumber) * this.yGraphsHeight;
                y = isNaN(y) ? 0 : parseInt(y);
                return y;
                */
            },
            _trimYAxis: function() {
                var max = this.dataSection[this.dataSection.length - 1];
                var tmpData = [];
                for (var a = 0, al = this.dataSection.length; a < al; a++) {

                    tmpData[a] = {
                        content: this.dataSection[a],
                        y: this.getYposFromVal( this.dataSection[a] )
                    };
                }

                this.layoutData = tmpData;

                //设置basePoint
                var basePy = -(this.baseNumber - this._bottomNumber) / (max - this._bottomNumber) * this.yGraphsHeight;
                basePy = isNaN(basePy) ? 0 : parseInt(basePy);
                this.basePoint = {
                    content: this.baseNumber,
                    y: basePy
                }
            },
            _getYAxisDisLine: function() { //获取y轴顶高到第一条线之间的距离
                var disMin = this.disYAxisTopLine
                var disMax = 2 * disMin
                var dis = disMin
                dis = disMin + this.yMaxHeight % this.dataSection.length;
                dis = dis > disMax ? disMax : dis
                return dis
            },
            _setDataSection: function (data, data1) {
                var arr = [];
                var d = (data.org || data.data || data);
                if( data1 && _.isArray(data1) ){
                    d = d.concat(data1);
                }
                if (!this.biaxial) {
                    arr = _.flatten( d ); //_.flatten( data.org );
                } else {
                    if (this.place == "left") {
                        arr = _.flatten(d[0]);
                        this.field = _.flatten([this.field[0]]);
                    } else {
                        arr = _.flatten(d[1]);
                        this.field = _.flatten([this.field[1]]);
                    }
                };
                for( var i = 0, il=arr.length; i<il ; i++ ){
                    arr[i] =  arr[i] || 0;
                };
                return arr;
            },
            //data1 == [1,2,3,4]
            _initData: function(data , data1) {
                var arr = this._setDataSection(data , data1);
                this.dataOrg = (data.org || data.data); //这里必须是data.org
                if (this.dataSection.length == 0) {
                    this.dataSection = DataSection.section(arr, 3);
                };

                //如果还是0
                if (this.dataSection.length == 0) {
                    this.dataSection = [0]
                };   
                this.dataSectionGroup = [ _.clone(this.dataSection) ];

                this._sort();
                this._setBottomAndBaseNumber();

                this._middleweight(); //如果有middleweight配置，需要根据配置来重新矫正下datasection
            },
            _sort: function(){
                if (this.sort) {
                    var sort = "asc";
                    if (_.isString(this.sort)) {
                        sort = this.sort;
                    }
                    if (_.isArray(this.sort)) {
                        var i = 0;
                        if (this.place == "right") {
                            i = 1;
                        };
                        if (this.sort[i]) {
                            sort = this.sort[i];
                        };
                    };
                    if (sort == "desc") {
                        this.dataSection.reverse();

                        //dataSectionGroup 从里到外全部都要做一次 reverse， 这样就可以对应上 dataSection.reverse()
                        _.each( this.dataSectionGroup , function( dsg , i ){
                            dsg.reverse();
                        } );
                        this.dataSectionGroup.reverse();
                        //dataSectionGroup reverse end
                    };
                };
            },
            _setBottomAndBaseNumber : function(){
                this._bottomNumber = this.dataSection[0];
                if (this.baseNumber == null) {
                    var min = _.min( this.dataSection );
                    this.baseNumber = min > 0 ? min : 0;
                }
            },
            _middleweight : function(){
                if( this.middleweight ){
                    //支持多个量级的设置
                    //量级的设置只支持非sort的柱状图场景，否则这里修改过的datasection会和 _initData 中sort过的逻辑有冲突
                    if( !_.isArray( this.middleweight ) ){
                        this.middleweight = [ this.middleweight ];
                    };

                    //拿到dataSection中的min和max后，用middleweight数据重新设置一遍dataSection
                    var dMin = _.min( this.dataSection );
                    var dMax = _.max( this.dataSection );
                    var newDS = [ dMin ];
                    var newDSG = [];

                    for( var i=0,l=this.middleweight.length ; i<l ; i++ ){
                        var preMiddleweight = dMin;
                        if( i > 0 ){
                            preMiddleweight = this.middleweight[ i-1 ];
                        };
                        var middleVal = preMiddleweight + parseInt( (this.middleweight[i] - preMiddleweight) / 2 );

                        newDS.push( middleVal );
                        newDS.push( this.middleweight[i] );

                        newDSG.push([
                            preMiddleweight,
                            middleVal,
                            this.middleweight[i]
                        ]);
                    };
                    var lastMW = parseInt( this.middleweight.slice(-1)[0] );
                    newDS.push( lastMW + parseInt( (dMax - lastMW) / 2 ) );
                    newDS.push( dMax );

                    newDSG.push([
                        lastMW,
                        lastMW + parseInt( (dMax - lastMW) / 2 ),
                        dMax
                    ]);

                    //好了。 到这里用简单的规则重新拼接好了新的 dataSection
                    this.dataSection = newDS;
                    this.dataSectionGroup = newDSG;

                    //因为重新设置过了 dataSection 所以要重新排序和设置bottom and base 值
                    this._sort();
                    this._setBottomAndBaseNumber();
                };                
            },
            resetWidth: function (w) {
                var self = this;
                self.w = w;
                if (self.line.enabled) {
                    self.sprite.context.x = w - self.dis - self.line.width;
                } else {
                    self.sprite.context.x = w - self.dis;
                }
            },
            _widget: function() {
                var self = this;
                if (!self.enabled) {
                    self.w = 0;
                    return;
                }
                var arr = this.layoutData;
                self.maxW = 0;
                self._label && self.sprite.addChild(self._label);
                for (var a = 0, al = arr.length; a < al; a++) {
                    var o = arr[a];
                    var x = 0,
                        y = o.y;
                    var content = o.content
                    if (_.isFunction(self.text.format)) {
                        content = self.text.format(content, self);
                    };
                    if( content === undefined || content === null ){
                        content = Tools.numAddSymbol( o.content );
                    };

                    var yNode = self.sprite.getChildById("yNode" + a) ||
                        new Canvax.Display.Sprite({
                        id: "yNode" + a
                    });


                    var textAlign = (self.place == "left" ? "right" : "left");
                    //为横向图表把y轴反转后的 逻辑
                    if (self.text.rotation == 90 || self.text.rotation == -90) {
                        textAlign = "center";
                        if (a == arr.length - 1) {
                            textAlign = "right";
                        }
                    };
                    var posy = y + (a == 0 ? -3 : 0) + (a == arr.length - 1 ? 3 : 0);
                    //为横向图表把y轴反转后的 逻辑
                    if (self.text.rotation == 90 || self.text.rotation == -90) {
                        if (a == arr.length - 1) {
                            posy = y - 2;
                        }
                        if (a == 0) {
                            posy = y;
                        }
                    };

                    //文字
                    var txt = yNode.getChildById("yAxis_txt_" + a) ||
                        new Canvax.Display.Text(content, {
                            id: "yAxis_txt_" + a,
                        context: {
                            fillStyle: self.text.fillStyle,
                            fontSize: self.text.fontSize,
                            rotation: -Math.abs(this.text.rotation),
                            textAlign: textAlign,
                            textBaseline: "middle",
                            globalAlpha: 0
                        }
                    });
                    txt.context.x = x + (self.place == "left" ? -5 : 5);
                    txt.context.y = posy + 20;
                    yNode.addChild(txt);

                    self.maxW = Math.max(self.maxW, txt.getTextWidth());
                    if (self.text.rotation == 90 || self.text.rotation == -90) {
                        self.maxW = Math.max(self.maxW, txt.getTextHeight());
                    }

                    if (self.line.enabled) {
                        //线条
                        var line = yNode.getChildById("yAxis_line_" + a) ||
                            new Line({
                                id: "yAxis_line_" + a,
                            context: {
                                lineWidth: self.line.lineWidth,
                                strokeStyle: self.line.strokeStyle
                            }
                        });
                        line.context.x = 0 + (self.place == "left" ? +1 : -1) * self.dis - 2;
                        line.context.y = y;
                        line.context.xEnd = self.line.width;
                        line.context.yEnd = 0;
                        yNode.addChild(line);
                    }
                    ;
                    //这里可以由用户来自定义过滤 来 决定 该node的样式
                    _.isFunction(self.filter) && self.filter({
                        layoutData: self.layoutData,
                        index: a,
                        txt: txt,
                        line: line
                    });

                    self.sprite.addChild(yNode);

                    //如果是resize的话也不要处理动画
                    if (false && self.animation && !self.resize) {
                        txt.animate({
                            globalAlpha: 1,
                            y: txt.context.y - 20
                        }, {
                            duration: 500,
                            easing: 'Back.Out', //Tween.Easing.Elastic.InOut
                            delay: a * 80,
                            id: txt.id
                        });
                    } else {
                        txt.context.y = txt.context.y - 20;
                        txt.context.globalAlpha = 1;
                    }
                };

                self.maxW += self.dis;

                //self.sprite.context.x = self.maxW + self.pos.x;
                //self.pos.x = self.maxW + self.pos.x;
                if (self.line.enabled) {
                    self.w = self.maxW + self.dis + self.line.width + self.pos.x;
                } else {
                    self.w = self.maxW + self.dis + self.pos.x;
                }
            }
        };

        return yAxis;

    });

define('chartx/chart/bar/3d/back',
    [
        "canvax/index",
        "canvax/shape/Line",
        "chartx/utils/tools",
        "canvax/shape/Shapes"
    ],
    function (Canvax, Line, Tools,Shapes) {
        var Back = function (root) {

            var opt = root.back;
            this.root = root;
            this.w = 0;
            this.h = 0;
            this._depth = -100;

            this.pos = {
                x: 0,
                y: 0
            }

            this.enabled = 1;

            this.xOrigin = {                                //原点开始的x轴线
                enabled: 1,
                lineWidth: 1,
                strokeStyle: '#e6e6e6'
            }
            this.yOrigin = {                                //原点开始的y轴线
                enabled: 1,
                lineWidth: 1,
                strokeStyle: '#e6e6e6',
                biaxial: false
            }
            this.xAxis = {                                //x轴上的线
                enabled: 1,
                data: [],                      //[{y:100},{}]
                org: null,                    //x轴坐标原点，默认为上面的data[0]
                // data     : [{y:0},{y:-100},{y:-200},{y:-300},{y:-400},{y:-500},{y:-600},{y:-700}],
                lineType: 'solid',                //线条类型(dashed = 虚线 | '' = 实线)
                lineWidth: 1,
                strokeStyle: '#f0f0f0', //'#e5e5e5',
                filter: null
            }
            this.yAxis = {                                //y轴上的线
                enabled: 1,
                data: [],                      //[{x:100},{}]
                org: null,                    //y轴坐标原点，默认为上面的data[0]
                // data     : [{x:100},{x:200},{x:300},{x:400},{x:500},{x:600},{x:700}],
                lineType: 'solid',                      //线条类型(dashed = 虚线 | '' = 实线)
                lineWidth: 1,
                strokeStyle: '#f0f0f0',//'#e5e5e5',
                filter: null
            }

            this.sprite = null;                       //总的sprite
            this.xAxisSp = null;                       //x轴上的线集合
            this.yAxisSp = null;                       //y轴上的线集合

            this.animation = true;
            this.resize = false;

            this.init(opt);
        };

        Back.prototype = {

            init: function (opt) {
                _.deepExtend(this, opt);
                if (opt && opt.depth) {
                    this._depth = -opt.depth;
                }
                this.sprite = new Canvax.Display.Sprite();
            },
            setX: function ($n) {
                this.sprite.context.x = $n
            },
            setY: function ($n) {
                this.sprite.context.y = $n
            },

            draw: function (opt) {
                _.deepExtend(this, opt);
                //this._configData(opt);
                this._widget();
                this.setX(this.pos.x);
                this.setY(this.pos.y);
            },
            update: function (opt) {
                this.sprite.removeAllChildren();
                this.draw(opt);
            },
            _widget: function () {
                var self = this;

                var _depth = this._depth;
                if (!this.enabled) {
                    return
                }



                if( self.root && self.root._yAxis && self.root._yAxis.dataSectionGroup ){
                    self.yGroupSp  = new Canvax.Display.Sprite(),  self.sprite.addChild(self.yGroupSp);
                    for( var g = 0 , gl=self.root._yAxis.dataSectionGroup.length ; g < gl ; g++ ){
                        var yGroupHeight = self.root._yAxis.yGraphsHeight / gl ;
                        //var groupRect = new Shapes.Rect({
                        //    context : {
                        //        x : 0,
                        //        y : -yGroupHeight * g,
                        //        width : self.w,
                        //        height : -yGroupHeight,
                        //        fillStyle : "#000",
                        //        globalAlpha : 0.025 * (g%2)
                        //    }
                        //});

                        var _id="Back_section_"+g;
                        var _pointList=[];
                        var _left = 0;
                        var _right = _left + self.w;
                        var _top = -yGroupHeight * g;
                        var _bottom = _top  -yGroupHeight;

                        var _pointList=[[_left,_top,0],[_left,_top,_depth],[_right,_top,_depth],[_right,_bottom,_depth],[_left,_bottom,_depth],[_left,_bottom,0]];

                        var _polygon = self.yGroupSp.getChildById(_id) ||
                            new Shapes.Polygon({
                                id: _id,
                                pointChkPriority: false,
                                context: {
                                    pointList: _pointList,
                                    fillStyle: "#000",
                                    globalAlpha :  0.04 * (g%2)
                                }
                            });

                        _polygon.context.pointList = _pointList;
                        _polygon.context.x = 0;
                        _polygon.context.y = 0;


                        self.yGroupSp.addChild( _polygon );
                    };
                };




                self.xAxisSp = self.sprite.getChildById('Back_xAsix') ||
                    new Canvax.Display.Sprite({
                        id: 'Back_xAsix'
                    }),
                    self.sprite.addChild(self.xAxisSp);
                self.yAxisSp = self.sprite.getChildById('Back_yAsix') ||
                    new Canvax.Display.Sprite({
                        id: 'Back_yAsix'
                    }),
                    self.sprite.addChild(self.yAxisSp)

                //x轴方向的线集合
                var arr = self.xAxis.data;
                for (var a = 0, al = arr.length; a < al; a++) {
                    var o = arr[a];
                    var line = self.xAxisSp.getChildById("back_line_xAxis" + a)||
                        new Line({
                        id: "back_line_xAxis" + a,
                        context: {
                            lineType: self.xAxis.lineType,
                            lineWidth: self.xAxis.lineWidth,
                            strokeStyle: self.xAxis.strokeStyle
                        }
                    });

                    line.context.xStart=0;
                    line.context.yStart=o.y;
                    line.context.xEnd=self.w;
                    line.context.yEnd= o.y;

                    //todo:line的context不能保留额外的值
                    line.zStart=_depth;
                    line.zEnd=_depth;

                    if (self.xAxis.enabled) {
                        _.isFunction(self.xAxis.filter) && self.xAxis.filter({
                            layoutData: self.yAxis.data,
                            index: a,
                            line: line
                        });
                        self.xAxisSp.addChild(line);

                        //if (false && this.animation && !this.resize) {
                        //    line.animate({
                        //        xStart: 0,
                        //        xEnd: self.w
                        //    }, {
                        //        duration: 500,
                        //        //easing : 'Back.Out',//Tween.Easing.Elastic.InOut
                        //        delay: (al - a) * 80,
                        //        id: line.id
                        //    });
                        //} else {
                        //    line.context.xStart = 0;
                        //    line.context.xEnd = self.w;
                        //}

                        //绘制Z轴的线条
                        var line =self.xAxisSp.getChildById("back_line_xAxis_z" + a)||
                            new Line({
                            id: "back_line_xAxis_z" + a,
                            context: {
                                lineType: self.xAxis.lineType,
                                lineWidth: self.xAxis.lineWidth,
                                strokeStyle: self.xAxis.strokeStyle
                            }
                        });

                        line.context.xStart=0;
                        line.context.yStart=o.y;
                        line.context.xEnd=0;
                        line.context.yEnd=o.y;

                        line.zStart=0;
                        line.zEnd=_depth;
                        self.xAxisSp.addChild(line);

                    }

                }
                ;

                //y轴方向的线集合
                var arr = self.yAxis.data
                for (var a = 0, al = arr.length; a < al; a++) {
                    var o = arr[a]
                    var line = self.yAxisSp.getChildById('back_line_yAxis'+a)||
                        new Line({
                            id:'back_line_yAxis'+a,
                        context: {
                            lineType: self.yAxis.lineType,
                            lineWidth: self.yAxis.lineWidth,
                            strokeStyle: self.yAxis.strokeStyle,
                            visible: o.x ? true : false
                        }
                    })
                    line.context.xStart= o.x;
                    line.context.yStart=0;
                    line.context.xEnd= o.x;
                    line.context.yEnd=-self.h;
                    line.zStart=_depth;
                    line.zEnd=_depth;

                    if (self.yAxis.enabled) {
                        _.isFunction(self.yAxis.filter) && self.yAxis.filter({
                            layoutData: self.xAxis.data,
                            index: a,
                            line: line
                        });
                        self.yAxisSp.addChild(line);

                        //绘制Z轴的线条
                        var line =self.yAxisSp.getChildById('back_line_yAxis_z'+a)||
                            new Line({
                                id:'back_line_yAxis_z'+a,
                            context: {
                                lineType: self.yAxis.lineType,
                                lineWidth: self.yAxis.lineWidth,
                                strokeStyle: self.yAxis.strokeStyle,
                                visible: o.x ? true : false
                            }
                        })
                        line.context.xStart= o.x;
                        line.context.yStart=0;
                        line.context.xEnd= o.x;
                        line.context.yEnd=0;
                        line.zStart=0;
                        line.zEnd=_depth;

                        self.yAxisSp.addChild(line);
                    }
                }
                var line = self.yAxisSp.getChildById('back_line_yAxis_00')||
                    new Line({
                        id:'back_line_yAxis_00',
                        context: {
                            lineType: self.yAxis.lineType,
                            lineWidth: self.yAxis.lineWidth,
                            strokeStyle: self.yAxis.strokeStyle,
                            visible: o.x ? true : false
                        }
                    })
                line.context.xStart= 0;
                line.context.yStart=0;
                line.context.xEnd= 0;
                line.context.yEnd=-self.h;
                line.zStart=_depth;
                line.zEnd=_depth;
                self.yAxisSp.addChild(line);
                ;

                //原点开始的y轴线
                var xAxisOrg = (self.yAxis.org == null ? 0 : _.find(self.yAxis.data, function (obj) {
                    return obj.content == self.yAxis.org
                }).x );

                //self.yAxis.org = xAxisOrg;
                var line = self.sprite.getChildById('Back_xAxisOrg')||
                    new Line({
                        id:'Back_xAxisOrg',
                    context: {
                        lineWidth: self.yOrigin.lineWidth,
                        strokeStyle: self.yOrigin.strokeStyle
                    }
                });
                line.context.xStart= xAxisOrg;
                line.context.yStart=0;
                line.context.xEnd= xAxisOrg;
                line.context.yEnd=-self.h;
                line.zStart=0;
                line.zEnd=0;

                if (self.yOrigin.enabled)
                    self.sprite.addChild(line)

                if (self.yOrigin.biaxial) {
                    var lineR = self.sprite.getChildById('Back_biaxial')||
                        new Line({
                        id:'Back_biaxial',
                        context: {
                            lineWidth: self.yOrigin.lineWidth,
                            strokeStyle: self.yOrigin.strokeStyle
                        }
                    })

                    line.context.xStart= self.w;
                    line.context.yStart=0;
                    line.context.xEnd= self.w;
                    line.context.yEnd=-self.h;
                    lineR.zStart=0;
                    lineR.zEnd=0;
                    if (self.yOrigin.enabled)
                        self.sprite.addChild(lineR)

                }

                //原点开始的x轴线
                var yAxisOrg = (self.xAxis.org == null ? 0 : _.find(self.xAxis.data, function (obj) {
                    return obj.content == self.xAxis.org
                }).y );

                //self.xAxis.org = yAxisOrg;
                var line = self.sprite.getChildById("Back_yAxisOrg")||
                    new Line({
                    id:"Back_yAxisOrg",
                    context: {
                        lineWidth: self.xOrigin.lineWidth,
                        strokeStyle: self.xOrigin.strokeStyle
                    }
                })
                line.context.xStart= yAxisOrg;
                line.context.yStart=0;
                line.context.xEnd= self.w;
                line.context.yEnd=yAxisOrg;
                line.zStart=0;
                line.zEnd=0;
                if (self.xOrigin.enabled)
                    self.sprite.addChild(line)
            }

        };

        return Back;
    });

define("chartx/chart/bar/3d",
    [
        'chartx/chart/index',
        'chartx/utils/tools',
        'chartx/utils/datasection',
        'chartx/components/tips/tip',
        'chartx/utils/dataformat',
        'chartx/components/datazoom/index',
        'chartx/components/legend/index',
        'chartx/chart/bar/3d/xaxis',
        'chartx/chart/bar/3d/yaxis',
        'chartx/chart/bar/3d/back',
        'chartx/chart/bar/3d/graphs',
        "canvax/shape/Shapes",
        'chartx/utils/math3d/vec3',
        'chartx/utils/math3d/vec4',
        'chartx/utils/math3d/mat4',
        'chartx/utils/math3d/quat',
    ],
    function (Chart, Tools, DataSection, Tip, dataFormat, DataZoom, Legend, xAxis, yAxis, Back, Graphs, Shapes, Vector3, Vector4,Matrix,Quaternion) {


        var Canvax = Chart.Canvax;
        var Bar3d = Chart.extend({
            init: function (node, data, opts) {

                this._xAxis = null;
                this._yAxis = null;
                this._back = null;
                this._graphs = null;
                this._tip = null;
                this._checkedList = []; //所有的选择对象
                this._currCheckedList = []; //当前的选择对象(根据dataZoom.start, dataZoom.end 过滤)

                this._node = node;
                this._data = data;
                this._opts = opts;

                this.dataZoom = {
                    enabled: false,
                    range: {
                        start: 0,
                        end: data.length - 1 //因为第一行是title
                    }
                };
                if (opts.dataZoom) {
                    this.dataZoom.enabled = true;
                    this.padding.bottom += (opts.dataZoom.height || 46);
                }


                if (opts.proportion) {
                    this.proportion = opts.proportion;
                    this._initProportion(node, data, opts);
                } else {
                    _.deepExtend(this, opts);
                }


                this.dataFrame = this._initData(data);

                this._setLegend();

                //吧原始的field转换为对应结构的显示树
                //["uv"] --> [{field:'uv',enabled:true , fillStyle: }]
                this._fieldsDisplayMap = this.__setFieldsDisplay(this._opts.yAxis.field || this._opts.yAxis.bar.field);

                //一些继承自该类的constructor 会拥有_init来做一些覆盖，比如横向柱状图
                this._init && this._init(node, data, opts);


                //3d场景初始化
                this._projectMatrix = Matrix.create();
                this._viewMatrix = Matrix.create();
                this._viewProjectMatrix = Matrix.create();


                //初始化投影矩阵
                this._initProjection();

                //初始化相机
                this._eye = Vector3.fromValues(0, 0, this.height * 2);
                this._rotation = {
                    x: 25,
                    y: 25
                };
                _.extend(this._rotation, this._opts.rotation);
                this._rotationCamera();
                //调整相机位置
                this._adjustmentFitPosition();



            },
            _reset: function (obj) {
                //初始化投影矩阵
                this._initProjection();
                //初始化相机
                this._eye = Vector3.fromValues(0, 0, this.height);
                this._rotation = {
                    x: 25,
                    y: 25
                };
                _.extend(this._rotation, obj.options.rotation);
                this._rotationCamera();
                //调整相机位置
                this._adjustmentFitPosition();
            },
            _initProjection:function(){
                //透视矩阵
                var fovy = 45 * Math.PI / 180;
                var aspect = this.width / this.height;
                var near = 0.1;
                var far = 1000;
                Matrix.perspective(this._projectMatrix, fovy, aspect, near, far);

            },

            _initCamera: function () {
                var me = this;
                var center = [0, 0, 0];
                var up = [0, 1, 0];
                var eye = this._eye;
                Matrix.lookAt(this._viewMatrix, eye, center, up);
                Matrix.multiply(this._viewProjectMatrix, this._projectMatrix, this._viewMatrix);

            },
            _rotationCamera: function () {
                var me = this;
                var rotateX = me._rotation.x;
                var rotateY = me._rotation.y;
                var rotation = Quaternion.create();
                var m = Matrix.create();
                var length=Vector3.length(this._eye);
                var origin = Vector3.fromValues(0, 0, length);

                rotateX = rotateX !== undefined ? Math.max(10, Math.min(rotateX, 45)) : 25;
                rotateY = rotateY !== undefined ? Math.max(10, Math.min(rotateY, 45)) : 25;


                Quaternion.rotateY(rotation, rotation, rotateY * Math.PI / 180);
                Quaternion.rotateX(rotation, rotation, -1 * rotateX * Math.PI / 180);

                Matrix.fromQuat(m, rotation);
                Vector3.transformMat4(me._eye, origin, m);
                me._initCamera();

            },
            _adjustmentFitPosition: function () { //调整相机到最合适的位置
                var me = this;

                //构建世界空间特殊点
                var _widht = me.width * 0.5;
                var _heght = me.height * 0.5;
                var _depth = me.back && me.back.depth || 100;
                var _point = [];
                var _screenPoints = [];
                var isFineTuning = false;   //是否微调
                var _scale = Vector3.create();
                var padding = 5;


                for (i = 0, t = 0; i < 24; i = i + 3) {
                    _point[i] = i % 2 === 0 ? -1 * _widht : _widht;
                    _point[i + 1] = _.indexOf([2, 3, 6, 7], t) === -1 ? _heght : -1 * _heght;
                    _point[i + 2] = t < 4 ? 0 : -1 * _depth
                    t++;
                }

                while (true) {
                    me._initCamera();
                    _screenPoints = me._worldToScreen(_point);

                    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
                    for (i = 0; i < _screenPoints.length; i = i + 3) {
                        minX = Math.min(minX, _screenPoints[i]);
                        maxX = Math.max(maxX, _screenPoints[i]);

                        minY = Math.min(minY, _screenPoints[i + 1]);
                        maxY = Math.max(maxY, _screenPoints[i + 1]);
                    }
                    if (minX < padding || minY < padding || maxX > me.width - padding || maxY > me.height - padding) {
                        if (isFineTuning) {
                            isFineTuning = false;

                            Vector3.scale(me._eye, me._eye, 9 / 10);
                            //Vector3.normalize(_scale,me._eye);
                            //Vector3.add(me._eye, me._eye, _scale);
                            me._initCamera();
                            break;
                        }
                        Vector3.scale(_scale, me._eye, 0.5);
                        Vector3.add(me._eye, me._eye, _scale);

                    } else {

                        isFineTuning = true;
                        //Vector3.normalize(_scale,me._eye);
                        Vector3.scale(_scale, me._eye, 0.1);
                        Vector3.sub(me._eye, me._eye, _scale);

                    }

                }

            },

            /*
             * 如果只有数据改动的情况
             */
            resetData: function (data) {
                this._data = data;

                this.dataFrame = this._initData(data, this);
                this._xAxis.resetData(this.dataFrame.xAxis, {
                    animation: false
                });

                if (this.dataZoom.enabled) {
                    this.__cloneBar = this._getCloneBar();
                    this._yAxis.resetData(this.__cloneBar.thumbBar.dataFrame.yAxis, {
                        animation: false
                    });
                    this._dataZoom.sprite.destroy();
                    this._initDataZoom();
                } else {
                    this._yAxis.resetData(this.dataFrame.yAxis, {
                        animation: false
                    });
                }
                ;
                this._graphs.resetData(this._trimGraphs());
                this._graphs.grow(function () {
                    //callback
                }, {
                    delay: 0
                });
                this.fire("_resetData");
            },
            getCheckedCurrList: function () {
                var me = this
                return _.filter(me._getCurrCheckedList(), function (o) {
                    return o
                })
            },
            getCheckedList: function () { //获取选择之后的对象列表 列表中不含空对象 [eventInfo,evnetInfo,....]
                var me = this
                return _.filter(me._checkedList, function (o) {
                    return o
                })
            },
            //和原始field结构保持一致，但是对应的field换成 {field: , enabled:}结构
            __setFieldsDisplay: function (fields) {
                var clone_fields = _.clone(fields);
                for (var i = 0, l = fields.length; i < l; i++) {
                    if (_.isString(fields[i])) {
                        clone_fields[i] = {
                            field: fields[i],
                            enabled: true
                        }
                    }
                    if (_.isArray(fields[i])) {
                        clone_fields[i] = this.__setFieldsDisplay(fields[i]);
                    }
                }
                ;
                return clone_fields;
            },
            _getFieldsOfDisplay: function (maps) {
                var fields = [];
                !maps && ( maps = this._fieldsDisplayMap );
                for (var i = 0, l = maps.length; i < l; i++) {
                    if (_.isArray(maps[i])) {
                        var _fs = this._getFieldsOfDisplay(maps[i]);
                        _fs.length > 0 && (fields[i] = _fs);
                    } else if (maps[i].field && maps[i].enabled) {
                        fields[i] = maps[i].field;
                    }
                    ;
                }
                ;
                return fields;
            },
            //设置_fieldsDisplayMap中对应field 的 enabled状态
            _setFieldDisplay: function (field) {
                var me = this;

                function set(maps) {
                    _.each(maps, function (map, i) {
                        if (_.isArray(map)) {
                            set(map)
                        } else if (map.field && map.field == field) {
                            map.enabled = !map.enabled;
                        }
                    });
                }

                set(me._fieldsDisplayMap);
            },
            //TODO：bar中用来改变yAxis.field的临时 方案
            _resetOfLengend: function (field) {
                var me = this;

                me._setFieldDisplay(field);

                _.deepExtend(this, {
                    yAxis: {
                        field: me._getFieldsOfDisplay()
                    }
                });

                if (this.graphs && this.graphs.bar && _.isFunction(this.graphs.bar.fillStyle)) {
                    var _fillStyle = this.graphs.bar.fillStyle;
                    this.graphs.bar.fillStyle = function (f) {
                        var res = _fillStyle(f);
                        if (!res) {
                            if (me._legend) {
                                res = me._legend.getStyle(f.field).fillStyle;
                            }
                        }
                        return res;
                    }
                } else {
                    _.deepExtend(this, {
                        graphs: {
                            bar: {
                                fillStyle: function (f) {

                                    if (me._legend) {
                                        return me._legend.getStyle(f.field).fillStyle;
                                    }
                                }
                            }
                        }
                    });
                }


                for (var i = 0, l = this.canvax.children.length; i < l; i++) {
                    var stage = this.canvax.getChildAt(i);
                    for (var s = 0, sl = stage.children.length; s < sl; s++) {
                        var sp = stage.getChildAt(s);
                        if (sp.id == "LegendSprite" || sp.id == "legend_tip") {
                            continue
                        }
                        stage.getChildAt(s).destroy();
                        s--;
                        sl--;
                    }
                }
                ;

                this.dataFrame = this._initData(this._data);
                this.draw();
            },
            _setLegend: function () {

                var me = this;
                if (!this.legend || (this.legend && "enabled" in this.legend && !this.legend.enabled)) return;
                //设置legendOpt
                var legendOpt = _.deepExtend({
                    enabled: true,
                    label: function (info) {
                        return info.field
                    },
                    onChecked: function (field) {
                        me._resetOfLengend(field);
                    },
                    onUnChecked: function (field) {
                        me._resetOfLengend(field);
                    }
                }, this._opts.legend);

                this._legend = new Legend(this._getLegendData(), legendOpt);
                this._legend.sprite.noTransform = true;
                this.stage.addChild(this._legend.sprite);
                this._legend.pos({
                    x: 0,
                    y: this.padding.top
                });
                this.padding.top += this._legend.height;
            },
            //只有field为多组数据的时候才需要legend
            _getLegendData: function () {
                var me = this;
                var data = [];
                _.each(_.flatten(me.dataFrame.yAxis.field), function (f, i) {
                    data.push({
                        field: f,
                        value: null,
                        fillStyle: null
                    });
                });
                return data;
            },
            checkAt: function (index) {
                var me = this
                var i = index - me.dataZoom.range.start
                var o = me._graphs.getInfo(i)

                me._checkedList[index] = o

                me._checkedBar({
                    iNode: i,
                    checked: true
                });
                me._checkedMiniBar({
                    iNode: index,
                    checked: true
                });

                o.iNode = index
            },
            uncheckAt: function (index) { //取消选择某个对象 index是全局index
                var me = this
                var i = index - me.dataZoom.range.start
                if (me._checkedList[index]) {
                    me._checked(me._graphs.getInfo(i))
                }
                ;
            },
            uncheckAll: function () {
                for (var i = 0, l = this._checkedList.length; i < l; i++) {
                    var obj = this._checkedList[i];
                    if (obj) {
                        this.uncheckAt(i);
                    }
                }
                ;
                this._checkedList = [];
                this._currCheckedList = [];
            },
            checkOf: function (xvalue) {
                this.checkAt(this._xAxis.getIndexOfVal(xvalue) + this.dataZoom.range.start);
            },
            uncheckOf: function (xvalue) {
                this.uncheckAt(this._xAxis.getIndexOfVal(xvalue) + this.dataZoom.range.start);
            },
            getGroupChecked: function (e) {
                var checked = false;
                _.each(this.getCheckedList(), function (obj) {
                    if (obj && obj.iNode == e.eventInfo.iNode) {
                        checked = true;
                    }
                });
                return checked
            },
            //如果为比例柱状图的话
            _initProportion: function (node, data, opts) {
                !opts.tips && (opts.tips = {});
                opts.tips = _.deepExtend(opts.tips, {
                    content: function (info) {
                        var str = "<table>";
                        var self = this;
                        _.each(info.nodesInfoList, function (node, i) {
                            str += "<tr style='color:" + node.fillStyle + "'>";
                            var prefixName = self.prefix[i];
                            if (prefixName) {
                                str += "<td>" + prefixName + "：</td>";
                            } else {
                                if (node.field) {
                                    str += "<td>" + node.field + "：</td>";
                                }
                            }
                            ;
                            str += "<td>" + Tools.numAddSymbol(node.value) + "（" + Math.round(node.value / node.vCount * 100) + "%）</td></tr>";
                        });
                        str += "</table>";
                        return str;
                    }
                });

                _.deepExtend(this, opts);
                _.deepExtend(this.yAxis, {
                    dataSection: [0, 20, 40, 60, 80, 100],
                    text: {
                        format: function (n) {
                            return n + "%"
                        }
                    }
                });

                !this.graphs && (this.graphs = {});
                _.deepExtend(this.graphs, {
                    bar: {
                        radius: 0
                    }
                });
            },
            _setStages: function () {
                this.core = new Canvax.Display.Sprite({
                    id: 'core'
                });
                this.stageBg = new Canvax.Display.Sprite({
                    id: 'bg'
                });
                this.stageTip = new Canvax.Display.Sprite({
                    id: 'tip'
                });

                this.stage.addChild(this.stageBg);
                this.stage.addChild(this.core);
                this.stage.addChild(this.stageTip);

                if (this.rotate) {
                    this._rotate(this.rotate);
                }
            },
            draw: function () {

                this._setStages();

                this._initModule(); //初始化模块

                this._startDraw(); //开始绘图

                this._drawEnd(); //绘制结束，添加到舞台

                this.inited = true;
                this._to3d(this.stage);


            },
            _initData: function (data, opt) {

                var d;
                if (this.dataZoom.enabled) {
                    var datas = [data[0]];
                    datas = datas.concat(data.slice(this.dataZoom.range.start + 1, this.dataZoom.range.end + 1 + 1));
                    d = dataFormat.apply(this, [datas, opt]);
                } else {
                    d = dataFormat.apply(this, arguments);
                }
                ;

                //var d = dataFormat.apply(this, arguments);

                _.each(d.yAxis.field, function (field, i) {
                    if (!_.isArray(field)) {
                        field = [field];
                        d.yAxis.org[i] = [d.yAxis.org[i]];
                    }
                });
                return d;
            },
            _getaverageData: function () {
                var averageData = [];
                var me = this;
                if (this._graphs && this._graphs.average && this._graphs.average.data) {
                    return this._graphs.average.data
                }
                ;
                if (this._graphs.average.enabled) {
                    _.each(this.dataFrame.data, function (fd, i) {
                        if (fd.field == me._graphs.average.field) {
                            averageData = fd.data;
                        }
                    });
                }
                ;
                this._graphs.average.data = averageData;
                return averageData;
            },
            _setaverageLayoutData: function () {
                var layoutData = [];
                var me = this;
                if (this._graphs.average.enabled) {
                    var maxYAxis = this._yAxis.dataSection[this._yAxis.dataSection.length - 1];
                    _.each(this._graphs.average.data, function (fd, i) {
                        layoutData.push({
                            value: fd,
                            y: -(fd - me._yAxis._bottomNumber) / Math.abs(maxYAxis - me._yAxis._bottomNumber) * me._yAxis.yGraphsHeight
                        });
                    });
                    this._graphs.average.layoutData = layoutData;
                }
                ;
            },
            _initModule: function() {
                //因为tips放在graphs中，so 要吧tips的conf传到graphs中
                this._graphs = new Graphs(this);

                this._xAxis = new xAxis(this);

                this._yAxis = new yAxis(this);

                this._back = new Back(this);
                this._tip = new Tip(this.tips, this.canvax.getDomContainer());
            },
            _startDraw: function(opt) {
                var w = (opt && opt.w) || this.width;
                var h = (opt && opt.h) || this.height;
                var y = parseInt(h - this._xAxis.h);
                var graphsH = y - this.padding.top - this.padding.bottom;

                //绘制yAxis
                this._yAxis.draw({
                    pos: {
                        x: this.padding.left,
                        y: y - this.padding.bottom
                    },
                    yMaxHeight: graphsH
                });

                if (this.dataZoom.enabled) {
                    this.__cloneBar = this._getCloneBar();
                    this._yAxis.resetData(this.__cloneBar.thumbBar.dataFrame.yAxis, {
                        animation: false
                    });
                    this._yAxis.setX(this._yAxis.pos.x);
                }
                ;

                var _yAxisW = this._yAxis.w;

                //绘制x轴
                this._xAxis.draw({
                    graphh: h - this.padding.bottom,
                    graphw: w - this.padding.right,
                    yAxisW: _yAxisW
                });
                if (this._xAxis.yAxisW != _yAxisW) {
                    //说明在xaxis里面的时候被修改过了。那么要同步到yaxis
                    this._yAxis.resetWidth(this._xAxis.yAxisW);
                    _yAxisW = this._xAxis.yAxisW;
                }

                var _graphsH = this._yAxis.yGraphsHeight;
                //绘制背景网格
                this._back.draw({
                    w: this._xAxis.xGraphsWidth,
                    h: _graphsH,
                    xAxis: {
                        data: this._yAxis.layoutData
                    },
                    yAxis: {
                        data: this._xAxis.layoutData
                    },
                    pos: {
                        x: _yAxisW,
                        y: y - this.padding.bottom
                    }
                });

                this._setaverageLayoutData();

                var o = this._trimGraphs();
                //绘制主图形区域
                this._graphs.draw(o.data, {
                    w: this._xAxis.xGraphsWidth,
                    h: this._yAxis.yGraphsHeight,
                    pos: {
                        x: _yAxisW,
                        y: y - this.padding.bottom
                    },
                    yDataSectionLen: this._yAxis.dataSection.length,
                    sort: this._yAxis.sort
                });


                if (this.dataZoom.enabled) {
                    this._initDataZoom();
                }
                ;

                //如果有legend，调整下位置,和设置下颜色
                if (this._legend && !this._legend.inited) {
                    this._legend.pos({x: _yAxisW});

                    for (var f in this._graphs._yAxisFieldsMap) {
                        var ffill = this._graphs._yAxisFieldsMap[f].fillStyle;
                        this._legend.setStyle(f, {fillStyle: ffill});
                    }
                    ;
                    this._legend.inited = true;
                }



            },

            //把这个点位置对应的x轴数据和y轴数据存到tips的info里面
            //方便外部自定义tip是的content
            _setXaxisYaxisToTipsInfo: function (e) {
                if (!e.eventInfo) {
                    return;
                }
                ;

                e.eventInfo.xAxis = {
                    field: this.dataFrame.xAxis.field,
                    value: this.dataFrame.xAxis.org[0][e.eventInfo.iNode]
                };
                var me = this;

                _.each(e.eventInfo.nodesInfoList, function (node, i) {
                    //把这个group当前是否选中状态记录
                    if (me._checkedList[node.iNode + me.dataZoom.range.start]) {
                        node.checked = true;
                    } else {
                        node.checked = false;
                    }
                    ;
                });

                e.eventInfo.dataZoom = me.dataZoom;

                e.eventInfo.rowData = this.dataFrame.getRowData(e.eventInfo.iNode);

                e.eventInfo.iNode += this.dataZoom.range.start;
            },
            _trimGraphs: function (_xAxis, _yAxis) {

                _xAxis || (_xAxis = this._xAxis);
                _yAxis || (_yAxis = this._yAxis);
                var xArr = _xAxis.data;
                var yArr = _yAxis.dataOrg;
                var hLen = yArr.length; //bar的横向分组length

                var xDis1 = _xAxis.xDis1;
                //x方向的二维长度，就是一个bar分组里面可能有n个子bar柱子，那么要二次均分
                var xDis2 = xDis1 / (hLen + 1);

                //知道了xDis2 后 检测下 barW是否需要调整
                this._graphs.checkBarW && this._graphs.checkBarW(xDis1, xDis2);

                var maxYAxis = _yAxis.dataSection[_yAxis.dataSection.length - 1];
                var tmpData = [];
                var center = [],
                    yValueMaxs = [],
                    yLen = [];

                var me = this;
                for (var b = 0; b < hLen; b++) {
                    !tmpData[b] && (tmpData[b] = []);
                    yValueMaxs[b] = 0;
                    center[b] = {};
                    var yArrList = yArr[b];

                    _.each(yArrList, function (subv, v) {
                        !tmpData[b][v] && (tmpData[b][v] = []);

                        if (me.dataZoom.enabled) {
                            subv = subv.slice(me.dataZoom.range.start, me.dataZoom.range.end + 1);
                        }
                        ;

                        _.each(subv, function (val, i) {

                            if (!xArr[i]) {
                                return;
                            }
                            ;

                            var vCount = 0;
                            if (me.proportion) {
                                //先计算总量
                                _.each(yArrList, function (team, ti) {
                                    vCount += team[i]
                                });
                            }
                            ;

                            var x = xArr[i].x - xDis1 / 2 + xDis2 * (b + 1);

                            var y = 0;
                            if (me.proportion) {
                                y = -val / vCount * _yAxis.yGraphsHeight;
                            } else {
                                y = _yAxis.getYposFromVal( val );

                               // y = -(val - _yAxis._bottomNumber) / Math.abs(maxYAxis - _yAxis._bottomNumber) * _yAxis.yGraphsHeight;
                            }
                            ;
                            if (v > 0) {
                                y += tmpData[b][v - 1][i].y;
                            }
                            ;

                            //如果有排序的话
                            if (me._yAxis.sort && me._yAxis.sort == "desc") {
                                y = -(_yAxis.yGraphsHeight - Math.abs(y));
                            }
                            ;

                            var node = {
                                value: val,
                                field: me._getTargetField(b, v, i, _yAxis.field),
                                x: x,
                                y: y
                            };

                            if (me.proportion) {
                                node.vCount = vCount;
                            }
                            ;

                            tmpData[b][v].push(node);


                            yValueMaxs[b] += Number(val)
                            yLen = subv.length
                        });
                    });
                }
                ;

                for (var a = 0, al = yValueMaxs.length; a < al; a++) {
                    center[a].agValue = yValueMaxs[a] / yLen
                    center[a].agPosition = -(yValueMaxs[a] / yLen - _yAxis._bottomNumber) / (maxYAxis - _yAxis._bottomNumber) * _yAxis.yGraphsHeight
                }
                ;
                //均值
                this.dataFrame.yAxis.center = center;

                return {
                    data: tmpData
                };
            },
            _getTargetField: function (b, v, i, field) {
                if (!field) {
                    field = this._yAxis.field;
                }
                ;
                if (_.isString(field)) {
                    return field;
                } else if (_.isArray(field)) {
                    var res = field[b];
                    if (_.isString(res)) {
                        return res;
                    } else if (_.isArray(res)) {
                        return res[v];
                    }
                    ;
                }
            },
            _drawEnd: function() {
                var me = this
                this.stageBg.addChild(this._back.sprite);

                this.core.addChild(this._xAxis.sprite);
                this.core.addChild(this._graphs.sprite);
                this.core.addChild(this._yAxis.sprite);

                this.stageTip.addChild(this._tip.sprite);

                //执行生长动画
                this._graphs.grow(function (g) {
                    if (me._opts.markLine) {
                        me._initMarkLine(g);
                    }
                    ;
                    if (me._opts.markPoint) {
                        me._initMarkPoint(g);
                    }
                    ;
                });

                this.bindEvent();
            },
            _initDataZoom: function () {
                var me = this;
                //require(["chartx/components/datazoom/index"], function(DataZoom) {
                //初始化 datazoom 模块

                var dataZoomOpt = _.deepExtend({
                    w: me._xAxis.xGraphsWidth,
                    count: me._data.length - 1,
                    //h : me._xAxis.h,
                    pos: {
                        x: me._xAxis.pos.x,
                        y: me._xAxis.pos.y + me._xAxis.h
                    },
                    dragIng: function (range) {
                        //if (me.dataZoom.range.end <= me.dataZoom.range.start) {
                        //    me.dataZoom.range.end = me.dataZoom.range.start + 1;
                        //};
                        if (
                            parseInt(me.dataZoom.range.start) == parseInt(range.start)
                            && parseInt(me.dataZoom.range.end) == parseInt(range.end)
                        ) {
                            return;
                        }
                        ;
//console.log("start:"+me.dataZoom.range.start+"___end:"+me.dataZoom.range.end)
                        me.dataZoom.range.start = parseInt(range.start);
                        me.dataZoom.range.end = parseInt(range.end);
                        me.dataFrame = me._initData(me._data, this);
                        me._xAxis.resetData(me.dataFrame.xAxis, {
                            animation: false
                        });

                        me._graphs.average.data = null;
                        me._graphs.w = me._xAxis.xGraphsWidth;
                        me._getaverageData();
                        me._setaverageLayoutData();

                        me._graphs.resetData(me._trimGraphs());
                        me._graphs.grow(function () {
                            //callback
                        }, {
                            delay: 0,
                            easing: "Quadratic.Out",
                            duration: 300
                        });

                        me._removeChecked();

                        me.fire("_dataZoomDragIng");
                    },
                    dragEnd: function (range) {
                        me._updateChecked()
                    }
                }, me.dataZoom);

                //me._getCloneBar();

                me._dataZoom = new DataZoom(dataZoomOpt);

                var graphssp = this.__cloneBar.thumbBar._graphs.sprite;
                graphssp.id = graphssp.id + "_datazoomthumbbarbg"
                graphssp.context.x = 0;
                graphssp.context.y = me._dataZoom.barH + me._dataZoom.barY;

                graphssp.context.scaleY = me._dataZoom.barH / this.__cloneBar.thumbBar._graphs.h;

                me._dataZoom.dataZoomBg.addChild(graphssp);
                //me._dataZoom.sprite.noSkip=true;
                me.core.addChild(me._dataZoom.sprite);

                this.__cloneBar.thumbBar.destroy();
                this.__cloneBar.cloneEl.parentNode.removeChild(this.__cloneBar.cloneEl);
                //});
            },
            _getCloneBar: function () {
                var me = this;
                barConstructor = this.constructor;//(barConstructor || Bar);
                var cloneEl = me.el.cloneNode();
                cloneEl.innerHTML = "";
                cloneEl.id = me.el.id + "_currclone";
                cloneEl.style.position = "absolute";
                cloneEl.style.width = me.el.offsetWidth + "px";
                cloneEl.style.height = me.el.offsetHeight + "px";
                cloneEl.style.top = "10000px";
                document.body.appendChild(cloneEl);

                var opts = _.deepExtend({}, me._opts);
                _.deepExtend(opts, {
                    graphs: {
                        bar: {
                            fillStyle: me.dataZoom.normalColor || "#ececec"
                        },
                        animation: false,
                        eventEnabled: false,
                        text: {
                            enabled: false
                        },
                        average: {
                            enabled: false
                        }
                    },
                    dataZoom: {
                        enabled: false
                    },
                    xAxis: {
                        //enabled: false
                    },
                    yAxis: {
                        //enabled: false
                    }
                });

                var thumbBar = new barConstructor(cloneEl, me._data, opts);
                thumbBar.draw();
                return {
                    thumbBar: thumbBar,
                    cloneEl: cloneEl
                }
            },
            _initMarkLine: function (g) {
                var me = this
                require(['chartx/components/markline/index'], function (MarkLine) {
                    var yfieldFlat = _.flatten(me._yAxis.field);
                    for (var a = 0, al = yfieldFlat.length; a < al; a++) {
                        var index = a;
                        var center = null;

                        if (!me.dataFrame.yAxis.center[a]) {
                            continue
                        } else {
                            center = me.dataFrame.yAxis.center[a].agPosition
                        }
                        ;

                        var strokeStyle = g._yAxisFieldsMap[yfieldFlat[a]].fillStyle; //g.sprite.children[0] ? g.sprite.children[0].children[a + 1].context.fillStyle : '#000000'

                        var content = me.dataFrame.yAxis.field[a] + '均值'
                        if (me.markLine.text && me.markLine.text.enabled) {

                            if (_.isFunction(me.markLine.text.format)) {
                                var o = {
                                    iGroup: index,
                                    value: me.dataFrame.yAxis.center[index].agValue
                                }
                                content = me.markLine.text.format(o)
                            }
                        }
                        var o = {
                            w: me._xAxis.xGraphsWidth,
                            h: me._yAxis.yGraphsHeight,
                            origin: {
                                x: me._back.pos.x,
                                y: me._back.pos.y
                            },
                            field: _.isArray(me._yAxis.field[a]) ? me._yAxis.field[a][0] : me._yAxis.field[a],
                            line: {
                                y: center,
                                list: [
                                    [0, 0],
                                    [me._xAxis.xGraphsWidth, 0]
                                ],
                                strokeStyle: strokeStyle
                            },
                            text: {
                                content: content,
                                fillStyle: strokeStyle
                            },
                        }

                        new MarkLine(_.deepExtend(o, me._opts.markLine)).done(function () {
                            me.core.addChild(this.sprite);
                            me._to3d(this.sprite);
                            var points = null;
                            _.each(this.sprite.children, function (_shape) {
                                if (_shape instanceof Shapes.BrokenLine) {
                                    points = _shape.context.pointList;
                                }
                            });

                            var p1 = Vector3.fromValues(points[0][0], points[0][1], 0);
                            var p2 = Vector3.fromValues(points[1][0], points[1][1], 0);

                            var v1 = Vector3.create();
                            Vector3.sub(v1, p2, p1);
                            var v2 = Vector3.fromValues(1, 0, 0);

                            var angle = Vector3.angle(v1, v2);
                            this.txt.context.rotation = angle * 180 / Math.PI;

                        })
                    }
                })
            },
            _initMarkPoint: function (g) {
                var me = this;
                var gOrigin = {
                    x: g.sprite.context.x,
                    y: g.sprite.context.y
                };

                require(["chartx/components/markpoint/index"], function (MarkPoint) {
                    _.each(g.data, function (group, i) {
                        var vLen = group.length;

                        _.each(group, function (hgroup) {
                            _.each(hgroup, function (bar) {
                                var barObj = _.clone(bar);
                                barObj.x += gOrigin.x;
                                barObj.y += gOrigin.y;
                                var mpCtx = {
                                    value: barObj.value,
                                    shapeType: "droplet",
                                    markTarget: barObj.field,
                                    //注意，这里视觉上面的分组和数据上面的分组不一样，所以inode 和 iNode 给出去的时候要反过来
                                    iGroup: barObj.iGroup,
                                    iNode: barObj.iNode,
                                    iLay: barObj.iLay,
                                    point: {
                                        x: barObj.x,
                                        y: barObj.y,
                                    }
                                };
                                new MarkPoint(me._opts, mpCtx).done(function () {
                                    me.core.addChild(this.sprite);
                                    if (this.shape)this.shape.z = -25;
                                    if (this.shapeBg)this.shapeBg.z = -25;
                                    if (this.shapeCircle) this.shapeCircle.z = -25;
                                    me._to3d(this.sprite);
                                    var mp = this;
                                    this.shape.hover(function (e) {
                                        this.context.hr++;
                                        this.context.cursor = "pointer";
                                        e.stopPropagation();
                                    }, function (e) {
                                        this.context.hr--;
                                        e.stopPropagation();
                                    });
                                    this.shape.on("mousemove", function (e) {
                                        e.stopPropagation();
                                    });
                                    this.shape.on("tap click", function (e) {
                                        e.stopPropagation();
                                        e.eventInfo = mp;
                                        me.fire("markpointclick", e);
                                    });
                                });
                            });
                        });
                    });
                });
            },

            _removeChecked: function () {
                this._graphs.removeAllChecked()
            },
            _updateChecked: function () {
                var me = this
                me._currCheckedList = me._getCurrCheckedList()
                for (var a = 0, al = me._currCheckedList.length; a < al; a++) {
                    var o = me._currCheckedList[a]
                    me._checkedBar({
                        iNode: o.iNode - me.dataZoom.range.start,
                        checked: true,
                    })
                }
            },

            _getCurrCheckedList: function () {
                var me = this
                return _.filter(me._checkedList, function (o) {
                    if (o) {
                        if (o.iNode >= me.dataZoom.range.start && o.iNode <= me.dataZoom.range.end) {
                            return o
                        }
                    }
                })
            },
            _checked: function (eventInfo) { //当点击graphs时 触发选中状态
                var me = this
                if (!me._graphs.checked.enabled) {
                    return
                }
                var i = eventInfo.iNode + me.dataZoom.range.start

                var checked = true
                if (me._checkedList[i]) { //如果已经选中
                    me._checkedList[i] = null
                    checked = false
                } else { //如果没选中
                    me._checkedList[i] = eventInfo
                }
                me._checkedBar({
                    iNode: eventInfo.iNode,
                    checked: checked
                })
                me._checkedMiniBar({
                    iNode: i,
                    checked: checked
                })

                eventInfo.iNode = i
            },
            _checkedBar: function ($o) { //选择bar
                var me = this
                var graphs = me._graphs
                graphs._checked($o)
            },
            _checkedMiniBar: function ($o) { //选择缩略的bar
                if (this.dataZoom.enabled) {
                    var me = this
                    var graphs = me.__cloneBar.thumbBar._graphs
                    var fillStyle = ''
                    if ($o.checked) {
                        fillStyle = (me._opts.dataZoom.checked && me._opts.dataZoom.checked.fillStyle) || fillStyle
                    }
                    graphs.setBarStyle({
                        iNode: $o.iNode,
                        fillStyle: fillStyle
                    })
                }
            },

            bindEvent: function () {
                var me = this;
                this._graphs.sprite.on("panstart mouseover", function (e) {
                    me._setXaxisYaxisToTipsInfo(e);
                    me._tip.show(e);
                    me.fire(e.type, e);
                });
                this._graphs.sprite.on("panmove mousemove", function (e) {
                    me._setXaxisYaxisToTipsInfo(e);
                    me._tip.move(e);
                    me.fire(e.type, e);
                });
                this._graphs.sprite.on("panend mouseout", function (e) {
                    me._tip.hide(e);
                    me.fire(e.type, e);
                });
                this._graphs.sprite.on("tap click dblclick mousedown mouseup", function (e) {
                    if (e.type == 'click') {
                        me.fire('checkedBefor');
                        me._checked(_.clone(e.eventInfo));
                    }
                    ;
                    me._setXaxisYaxisToTipsInfo(e);
                    me.fire(e.type, e);
                });

                this.on('_to3d', function () {
                    me._to3d(me.stage);
                });




            },

            //projection to screen
            //基本变换过程为:local ===> screen ===> world ===> projection
            //             ===> screen ===> local
            _worldToScreen: function (ps) {
                var me = this;

                var p = new Array(ps.length);
                var one = Vector4.create();
                var out = Vector4.create();
                for (var x = 0, y = 0, z = 0; x < ps.length; x = x + 3) {
                    y = x + 1;
                    z = x + 2;
                    Vector4.set(one, ps[x], ps[y], ps[z], 1);

                    Vector3.transformMat4(out, one, me._viewProjectMatrix);
                    p[x] = (( out[0] + 1 ) * me.width ) / 2.0;
                    p[y] = ( ( out[1] - 1 ) * me.height ) / (-2.0);
                    p[z] = out[2];

                }
                return p;

            },
            _projectionToScreen: function (_shapes, _worldPosition) {
                var me = this;
                var _projectionPosition = null, _z, _points, _arr;
                if (_shapes instanceof Shapes.Line) {
                    _points = [];
                    _projectionPosition = [];
                    _z = [
                        _shapes.zStart,
                        _shapes.zEnd
                    ];
                    _.each(_worldPosition, function (o, i) {

                        _arr = me._worldToScreen([
                            _worldPosition[i].x,
                            _worldPosition[i].y,
                            (_z[i] || 0)]);
                        _projectionPosition.push(
                            {
                                x: _arr[0],
                                y: _arr[1]
                            }
                        )
                    });

                } else if (_shapes instanceof Shapes.Polygon || _shapes instanceof Shapes.BrokenLine) {
                    _projectionPosition = [];
                    _.each(_worldPosition, function (o, i) {
                        _arr = me._worldToScreen([
                            o.x,
                            o.y,
                            (_shapes.context.pointList[i][2] || 0)]);
                        _projectionPosition.push(
                            {
                                x: _arr[0],
                                y: _arr[1]
                            }
                        )
                    });
                } else {
                    _arr = me._worldToScreen([
                        _worldPosition.x,
                        _worldPosition.y,
                        _shapes.z || 0]);
                    _projectionPosition = {
                        x: _arr[0],
                        y: _arr[1]
                    }
                }
                return _projectionPosition;
            },
            _localToScreen: function (_shapes) {
                var _globalPosition = null;
                var _rootSprite = _shapes.parent;
                if (_shapes instanceof Shapes.Line) {

                    var _start = _rootSprite.localToGlobal({
                        x: _shapes.context.xStart + _shapes.context.x,
                        y: _shapes.context.yStart + _shapes.context.y
                    });

                    var _end = _rootSprite.localToGlobal({
                        x: _shapes.context.xEnd + _shapes.context.x,
                        y: _shapes.context.yEnd + _shapes.context.y
                    });


                    _globalPosition = [_start, _end];

                } else if (_shapes instanceof Shapes.Polygon || _shapes instanceof Shapes.BrokenLine) {
                    _globalPosition = [];
                    _.each(_shapes.context.pointList, function (o, i) {
                        var _pos = _rootSprite.localToGlobal({
                            x: o[0] + _shapes.context.x,
                            y: o[1] + _shapes.context.y
                        });
                        _globalPosition.push(_pos);
                    });
                } else {
                    _globalPosition = _rootSprite.localToGlobal({
                        x: _shapes.context.x,
                        y: _shapes.context.y
                    });
                }
                return _globalPosition;
            },
            _screenToWorld: function (_shapes, _width, _height, _globalPosition) {
                var _worldPosition = null;
                if (_shapes instanceof Shapes.Line) {
                    var _start = {
                        x: _globalPosition[0].x - _width * 0.5,
                        y: _height * 0.5 - _globalPosition[0].y
                    };

                    var _end = {
                        x: _globalPosition[1].x - _width * 0.5,
                        y: _height * 0.5 - _globalPosition[1].y
                    };
                    _worldPosition = [_start, _end];

                } else if (_shapes instanceof Shapes.Polygon || _shapes instanceof Shapes.BrokenLine) {
                    _worldPosition = [];
                    _.each(_globalPosition, function (o, i) {
                        var _pos = {
                            x: o.x - _width * 0.5,
                            y: _height * 0.5 - o.y
                        };
                        _worldPosition.push(_pos);
                    })

                } else {

                    _worldPosition = {
                        x: _globalPosition.x - _width * 0.5,
                        y: _height * 0.5 - _globalPosition.y
                    };
                }
                return _worldPosition;

            },
            _screenToLocal: function (_shapes, _projectionPosition) {
                var _rootSprite = _shapes.parent;
                var _pointList = [];
                if (_shapes instanceof Shapes.Line) {

                    var _start = _rootSprite.globalToLocal({
                        x: _projectionPosition[0].x,
                        y: _projectionPosition[0].y
                    });

                    var _end = _rootSprite.globalToLocal({
                        x: _projectionPosition[1].x,
                        y: _projectionPosition[1].y
                    });

                    _shapes.context.xStart = _start.x;
                    _shapes.context.yStart = _start.y;

                    _shapes.context.xEnd = _end.x;
                    _shapes.context.yEnd = _end.y;

                    _shapes.context.x = 0;
                    _shapes.context.y = 0;


                } else if (_shapes instanceof Shapes.Polygon || _shapes instanceof Shapes.BrokenLine) {
                    _.each(_projectionPosition, function (o, i) {
                        var _pos = _rootSprite.globalToLocal({
                            x: o.x,
                            y: o.y
                        });
                        _pointList.push([
                            _pos.x,
                            _pos.y
                        ]);
                    });
                    _shapes.context.pointList = _pointList;

                    _shapes.context.x = 0;
                    _shapes.context.y = 0;

                } else {
                    var pos = _rootSprite.globalToLocal({
                        x: _projectionPosition.x,
                        y: _projectionPosition.y
                    })
                    _shapes.context.x = pos.x;
                    _shapes.context.y = pos.y;
                }
            },
            _to3d: function (sprite) {
                //noTransform  不做转换
                //noSkip  只变换本身,不变换子元素
                var me = this;
                var _globalPosition, _worldPosition, _projectionPosition;
                (function (node) {
                    var getLeaf = arguments.callee;
                    if(node.noTransform) return;
                    if (node.children && node.children.length > 0 && !node.noSkip) {
                        _.each(node.children, function (a, i) {
                            getLeaf(a);
                        })
                    } else {
                        _globalPosition = me._localToScreen(node);
                        _worldPosition = me._screenToWorld(node, me.width, me.height, _globalPosition);
                        _projectionPosition = me._projectionToScreen(node, _worldPosition);
                        me._screenToLocal(node, _projectionPosition);

                    }
                })(sprite)
                me._graphs._depthTest(sprite);
            }


        });

        return Bar3d;
    });