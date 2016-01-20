define(
    "chartx/chart/bar/graphs", [
        "canvax/index",
        "canvax/shape/Rect",
        "chartx/utils/tools",
        "chartx/chart/theme",
        "canvax/animation/AnimationFrame",
        "canvax/shape/BrokenLine"
    ],
    function(Canvax, Rect, Tools, Theme, AnimationFrame, BrokenLine) {

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
                width: 0,
                _width: 0,
                radius: 4
            };

            this.text = {
                enabled: false,
                fillStyle: '#999',
                fontSize: 12,
                format: null
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
            init: function() {
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
            setX: function($n) {
                this.sprite.context.x = $n
            },
            setY: function($n) {
                this.sprite.context.y = $n
            },
            getInfo: function(index) {
                //该index指当前
                return this._getInfoHandler({
                    iGroup: index
                })
            },
            _checked: function($o) {
                var me = this
                var index = $o.iGroup
                var group = me.barsSp.getChildById('barGroup_' + index)
                if (!group) {
                    return
                }

                me.checkedSp.removeChildById('line_' + index)
                me.checkedSp.removeChildById('rect_' + index)
                var hoverRect = group.getChildAt(0)
                var x0 = hoverRect.context.x + 1
                var x1 = hoverRect.context.x + hoverRect.context.width - 1,
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
            removeAllChecked: function() {
                var me = this
                me.checkedSp.removeAllChildren()
            },
            setBarStyle: function($o) {
                var me = this
                var index = $o.iGroup
                var group = me.barsSp.getChildById('barGroup_' + index)
                var fillStyle = $o.fillStyle || me._getColor(me.bar.fillStyle)
                for (var a = 0, al = group.getNumChildren(); a < al; a++) {
                    var rectEl = group.getChildAt(a)
                    rectEl.context.fillStyle = fillStyle
                }
            },
            _setyAxisFieldsMap: function() {
                var me = this;
                _.each(_.flatten(this.root.dataFrame.yAxis.field), function(field, i) {
                    me._yAxisFieldsMap[field] = i;
                });
            },
            _initaverage: function() {
                if (this.average.enabled) {
                    _.each(this.root.dataFraem, function(fd, i) {
                        if (fd.field == this.average.field) {
                            this.average.fieldInd = i;
                        }
                    });
                }
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
                    style = c.apply(this, [{
                        iGroup: i,
                        iNode: h,
                        iLay: v,
                        field: field,
                        value: value,
                        xAxis: {
                            field : this.root._xAxis.field,
                            value : this.root._xAxis.data[ h ].content
                        }
                    }]);
                };
                if (!style || style == "") {
                    style = this._colors[this._yAxisFieldsMap[field]];
                };
                return style;
            },
            checkBarW: function(xDis1, xDis2) {
                if (this.bar.width) {
                    if (_.isFunction(this.bar.width)) {
                        this.bar._width = this.bar.width(xDis1);
                    }
                };
                if (!this.bar.width) {
                    this.bar._width = parseInt(xDis2) - (parseInt(Math.max(1, xDis2 * 0.3)));
                };
                this.bar._width < 1 && (this.bar._width = 1);
                if (this.bar._width == 1 && xDis1 > 3) {
                    this.bar._width = parseInt(xDis1) - 2;
                };
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
                var itemW = 0;

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
                    itemW = me.w / hLen;

                    me._barsLen = hLen * groups;

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
                                groupH.iGroup = h;
                                groupH.on("click dblclick mousedown mousemove mouseup", function(e) {
                                    if (!e.eventInfo) {
                                        e.eventInfo = me._getInfoHandler(this);
                                    };
                                });
                            };

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

                        //同上面，给txt做好分组
                        var txtGroupH;
                        if (i == 0) {
                            if (h <= preLen - 1) {
                                txtGroupH = me.txtsSp.getChildById("txtGroup_" + h);
                            } else {
                                txtGroupH = new Canvax.Display.Sprite({
                                    id: "txtGroup_" + h
                                });
                                me.txtsSp.addChild(txtGroupH);
                                txtGroupH.iGroup = h;
                            };
                        } else {
                            txtGroupH = me.txtsSp.getChildById("txtGroup_" + h);
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
                                height: finalPos.height,
                                fillStyle: finalPos.fillStyle,
                                scaleY: 0
                            };
                            if (!!me.bar.radius && v == vLen - 1) {
                                var radiusR = Math.min(me.bar._width / 2, rectH);
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
                                rectEl.on("panstart mouseover mousemove mouseout click dblclick", function(e) {
                                    e.eventInfo = me._getInfoHandler(this, e);
                                    if (e.type == "mouseover") {
                                        this.parent.getChildById("bhr_" + this.iGroup).context.globalAlpha = 0.1;
                                    }
                                    if (e.type == "mouseout") {
                                        this.parent.getChildById("bhr_" + this.iGroup).context.globalAlpha = 0;
                                    }
                                });
                            };

                            if (v == vLen - 1 && me.text.enabled) {
                                //文字
                                var contents = [rectData];

                                var infosp;
                                if (h <= preLen - 1) {
                                    infosp = txtGroupH.getChildById("infosp_" + i + "_" + h);
                                } else {
                                    infosp = new Canvax.Display.Sprite({
                                        id: "infosp_" + i + "_" + h,
                                        context: {
                                            visible: false
                                        }
                                    });
                                    infosp._hGroup = h;
                                    txtGroupH.addChild(infosp);
                                };

                                if (vLen > 1) {
                                    for (var c = vLen - 2; c >= 0; c--) {
                                        contents.unshift(h_group[c][h]);
                                    }
                                };

                                var infoWidth = 0;
                                var infoHeight = 0;
                                _.each(contents, function(cdata, ci) {
                                    var content = cdata.value;
                                    if (!me.animation && _.isFunction(me.text.format)) {
                                        content = me.text.format(cdata.value);
                                    };
                                    if (!me.animation && _.isNumber(content)) {
                                        content = Tools.numAddSymbol(content);
                                    };

                                    var txt;
                                    if (h <= preLen - 1) {
                                        txt = infosp.getChildById("info_txt_" + i + "_" + h + "_" + ci);
                                    } else {
                                        txt = new Canvax.Display.Text(me.animation ? 0 : content, {
                                            id: "info_txt_" + i + "_" + h + "_" + ci,
                                            context: {
                                                x: infoWidth + 2,
                                                fillStyle: cdata.fillStyle,
                                                fontSize: me.text.fontSize
                                            }
                                        });
                                        infosp.addChild(txt);
                                    };
                                    txt._text = content;
                                    infoWidth += txt.getTextWidth() + 2;
                                    infoHeight = Math.max(infoHeight, txt.getTextHeight());

                                    if (ci <= vLen - 2) {
                                        txt = new Canvax.Display.Text("/", {
                                            context: {
                                                x: infoWidth + 2,
                                                fillStyle: "#999"
                                            }
                                        });
                                        infoWidth += txt.getTextWidth() + 2;
                                        infosp.addChild(txt);
                                    };
                                });

                                infosp._finalX = rectData.x - infoWidth / 2;
                                infosp._finalY = finalPos.y - infoHeight;
                                infosp._centerX = rectData.x;
                                infosp.context.width = infoWidth;
                                infosp.context.height = infoHeight;

                                if (!me.animation) {
                                    infosp.context.y = finalPos.y - infoHeight;
                                    infosp.context.x = rectData.x - infoWidth / 2;
                                    infosp.context.visible = true;
                                };
                            }
                        };
                    }
                });

                this.sprite.addChild(this.barsSp);

                this.sprite.addChild(this.checkedSp)

                if (this.text.enabled) {
                    this.sprite.addChild(this.txtsSp);
                };

                //如果有average模块配置。
                if (this.average.enabled && this.average.data) {
                    !this.averageSp && (this.averageSp = new Canvax.Display.Sprite({
                        id: "averageSp"
                    }));
                    _.each(this.average.layoutData, function(average, i) {
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
                        };

                    });
                    this.sprite.addChild(me.averageSp);
                };

                this.sprite.context.x = this.pos.x;
                this.sprite.context.y = this.pos.y;

                if (this.sort && this.sort == "desc") {
                    this.sprite.context.y -= this.h;
                };
            },
            _updateInfoTextPos: function(el) {
                if (this.root.type == "horizontal") {
                    return;
                };
                var infoWidth = 0;
                var infoHeight = 0;
                var cl = el.children.length;
                _.each(el.children, function(c, i) {
                    if (c.getTextWidth) {
                        c.context.x = infoWidth;
                        infoWidth += c.getTextWidth() + (i < cl ? 2 : 0);
                        infoHeight = Math.max(infoHeight, c.getTextHeight());
                    };
                });
                el.context.x = el._centerX - infoWidth / 2 + 1;
                el.context.width = infoWidth;
                el.context.height = infoHeight;
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

                //先把已经不在当前range范围内的元素destroy掉
                if (self.barsSp.children.length > self.data[0][0].length) {
                    for (var i = self.data[0][0].length, l = self.barsSp.children.length; i < l; i++) {
                        self.barsSp.getChildAt(i).destroy();
                        self.text.enabled && self.txtsSp.getChildAt(i).destroy();
                        self.averageSp && self.averageSp.getChildAt(i).destroy();
                        i--;
                        l--;
                    };
                };

                var options = _.extend({
                    delay: Math.min(1000 / this._barsLen, 80),
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
                            };

                        };

                        //txt grow

                        if (self.text.enabled) {
                            var txtGroupH = self.txtsSp.getChildById("txtGroup_" + h);

                            var infosp = txtGroupH.getChildById("infosp_" + g + "_" + h);

                            if (self.root.type == "horizontal") {
                                infosp.context.x = infosp._finalX;
                            };

                            infosp.animate({
                                y: infosp._finalY,
                                x: infosp._finalX
                            }, {
                                duration: options.duration,
                                easing: options.easing,
                                delay: h * options.delay,
                                onUpdate: function() {
                                    this.context.visible = true;
                                },
                                onComplete: function() {}
                            });

                            _.each(infosp.children, function(txt) {
                                if (txt._text) {
                                    if (txt._tweenObj) {
                                        AnimationFrame.destroyTween(txt._tweenObj);
                                    };
                                    txt._tweenObj = AnimationFrame.registTween({
                                        from: {
                                            v: txt.text
                                        },
                                        to: {
                                            v: txt._text
                                        },
                                        duration: options.duration + 300,
                                        delay: h * options.delay,
                                        onUpdate: function() {
                                            var content = this.v;
                                            if (_.isFunction(self.text.format)) {
                                                content = self.text.format(content);
                                            } else if (_.isNumber(content)) {
                                                content = Tools.numAddSymbol(parseInt(content));
                                            };
                                            txt.resetText(content);
                                            if (txt.parent) {
                                                self._updateInfoTextPos(txt.parent);
                                            } else {
                                                txt.destroy();
                                            }
                                        }
                                    })
                                };
                            });
                        }
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
                return node;
            },
            _getNodeInfo: function(iGroup, iNode, iLay) {
                var arr = [];
                var me = this;
                var groups = me.data.length;

                iGroup == undefined && (iGroup = 0);
                iNode == undefined && (iNode = -1);
                iLay == undefined && (iLay = -1);

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
);

define(
    "chartx/chart/bar/xaxis",
    [
        "chartx/components/xaxis/xAxis"
    ],
    function( xAxisBase ){
        var xAxis = function( opt , data ){
            this.xDis1 = 0; //x方向一维均分长度
            xAxis.superclass.constructor.apply( this , arguments );
        };
        Chartx.extend( xAxis , xAxisBase , {
            _trimXAxis:function( data , xGraphsWidth ){
                
                var tmpData = [];
                this.xDis1  = xGraphsWidth / data.length;
                for (var a = 0, al  = data.length; a < al; a++ ) {
                    var o = {
                        'content' : data[a], 
                        'x'       : this.xDis1 * (a+1) - this.xDis1/2
                    }
                    tmpData.push( o );
                };
                return tmpData;
            } 
        } );
    
        return xAxis;
    } 
);


define(
    "chartx/chart/bar/yaxis",
    [
        "chartx/components/yaxis/yAxis"
    ],
    function( yAxisBase ){
        var yAxis = function( opt , data , data1){
            yAxis.superclass.constructor.apply( this , [ ( opt.bar ? opt.bar : opt ) , data , data1 ] );
        };
        Chartx.extend( yAxis , yAxisBase , {
            _setDataSection : function( data , data1 ){
                var arr = [];
                _.each( data.org , function( d , i ){
                    var varr = [];
                    var len  = d[0].length;
                    var vLen = d.length;
                    var min = 0;
                    for( var i = 0 ; i<len ; i++ ){
                        var count = 0;
                        for( var ii = 0 ; ii < vLen ; ii++ ){
                            count += d[ii][i];
                            min = Math.min( d[ii][i], min );
                        }
                        varr.push( count );
                    };
                    varr.push(min);
                    arr.push( varr );
                } );
                if( !data1 ){
                    data1 = [];
                }
                return _.flatten(arr).concat( data1 );
            }
        } );
    
        return yAxis;
    } 
);


define(
    "chartx/chart/bar/index", [
        'chartx/chart/index',
        'chartx/utils/tools',
        'chartx/utils/datasection',
        'chartx/chart/bar/xaxis',
        'chartx/chart/bar/yaxis',
        'chartx/components/back/Back',
        'chartx/chart/bar/graphs',
        'chartx/components/tips/tip',
        'chartx/utils/dataformat',
        'chartx/components/datazoom/index'
    ],
    function(Chart, Tools, DataSection, xAxis, yAxis, Back, Graphs, Tip, dataFormat, DataZoom) {
        /*
         *@node chart在dom里的目标容器节点。
         */
        var Canvax = Chart.Canvax;
        var Bar = Chart.extend({
            init: function(node, data, opts) {

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
                };

                if (opts.proportion) {
                    this.proportion = opts.proportion;
                    this._initProportion(node, data, opts);
                } else {
                    _.deepExtend(this, opts);
                };

                this.dataFrame = this._initData(data);

                //一些继承自该类的constructor 会拥有_init来做一些覆盖，比如横向柱状图
                this._init && this._init(node, data, opts);
            },
            /*
             * 如果只有数据改动的情况
             */
            resetData: function(data) {
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
                };
                this._graphs.resetData(this._trimGraphs());
                this._graphs.grow(function() {
                    //callback
                }, {
                    delay: 0
                });
            },
            getCheckedCurrList: function() {
                var me = this
                return _.filter(me._getCurrCheckedList(), function(o) {
                    return o
                })
            },
            getCheckedList: function() { //获取选择之后的对象列表 列表中不含空对象 [eventInfo,evnetInfo,....]
                var me = this
                return _.filter(me._checkedList, function(o) {
                    return o
                })
            },
            checkAt: function(index) {
                var me = this
                var i = index - me.dataZoom.range.start
                var o = me._graphs.getInfo(i)

                me._checkedList[index] = o

                me._checkedBar({
                    iGroup: i,
                    checked: true
                })
                me._checkedMiniBar({
                    iGroup: index,
                    checked: true
                })

                o.iGroup = index
            },
            uncheckAt: function(index) { //取消选择某个对象 index是全局index
                var me = this
                var i = index - me.dataZoom.range.start
                me._checked(me._graphs.getInfo(i))
            },
            uncheckAll: function(){
                for( var i = 0, l = this._checkedList.length  ; i<l ; i++ ){
                    var obj= this._checkedList[i];
                    if( obj ){
                        this.uncheckAt(i);
                    }
                };
                this._checkedList = [];
                this._currCheckedList = [];
            },
            getGroupChecked: function(e) {
                var checked = false;
                _.each(this.getCheckedList(), function(obj) {
                    if (obj && obj.iGroup == e.eventInfo.iGroup) {
                        checked = true;
                    }
                });
                return checked
            },
            //如果为比例柱状图的话
            _initProportion: function(node, data, opts) {
                !opts.tips && (opts.tips = {});
                opts.tips = _.deepExtend(opts.tips, {
                    content: function(info) {
                        var str = "<table>";
                        var self = this;
                        _.each(info.nodesInfoList, function(node, i) {
                            str += "<tr style='color:" + self.text.fillStyle + "'>";
                            var prefixName = self.prefix[i];
                            if (prefixName) {
                                str += "<td>" + prefixName + "：</td>";
                            } else {
                                if (node.field) {
                                    str += "<td>" + node.field + "：</td>";
                                }
                            };
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
                        format: function(n) {
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
            _setStages: function() {
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
            draw: function() {

                this._setStages();

                this._initModule(); //初始化模块  

                this._startDraw(); //开始绘图

                this._drawEnd(); //绘制结束，添加到舞台

                this.inited = true;

            },
            _initData: function(data, opt) {
                var d;
                if (this.dataZoom.enabled) {
                    var datas = [data[0]];
                    datas = datas.concat(data.slice(this.dataZoom.range.start + 1, this.dataZoom.range.end + 1));
                    d = dataFormat.apply(this, [datas, opt]);
                } else {
                    d = dataFormat.apply(this, arguments);
                };

                _.each(d.yAxis.field, function(field, i) {
                    if (!_.isArray(field)) {
                        field = [field];
                        d.yAxis.org[i] = [d.yAxis.org[i]];
                    }
                });

                return d;
            },
            _getaverageData: function() {
                var averageData = [];
                var me = this;
                if (this._graphs && this._graphs.average && this._graphs.average.data) {
                    return this._graphs.average.data
                };
                if (this._graphs.average.enabled) {
                    _.each(this.dataFrame.data, function(fd, i) {
                        if (fd.field == me._graphs.average.field) {
                            averageData = fd.data;
                        }
                    });
                };
                this._graphs.average.data = averageData;
                return averageData;
            },
            _setaverageLayoutData: function() {
                var layoutData = [];
                var me = this;
                if (this._graphs.average.enabled) {
                    var maxYAxis = this._yAxis.dataSection[this._yAxis.dataSection.length - 1];
                    _.each(this._graphs.average.data, function(fd, i) {
                        layoutData.push({
                            value: fd,
                            y: -(fd - me._yAxis._bottomNumber) / Math.abs(maxYAxis - me._yAxis._bottomNumber) * me._yAxis.yGraphsHeight
                        });
                    });
                    this._graphs.average.layoutData = layoutData;
                };
            },
            _initModule: function() {
                //因为tips放在graphs中，so 要吧tips的conf传到graphs中
                this._graphs = new Graphs(
                    this.graphs,
                    this
                );

                this._xAxis = new xAxis(this.xAxis, this.dataFrame.xAxis);

                this._yAxis = new yAxis(this.yAxis, this.dataFrame.yAxis, this._getaverageData());

                this._back = new Back(this.back);
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
                };

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
                };

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
            },

            //把这个点位置对应的x轴数据和y轴数据存到tips的info里面
            //方便外部自定义tip是的content
            _setXaxisYaxisToTipsInfo: function(e) {
                if (!e.eventInfo) {
                    return;
                }
                e.eventInfo.xAxis = {
                    field: this.dataFrame.xAxis.field,
                    value: this.dataFrame.xAxis.org[0][e.eventInfo.iGroup]
                }
                var me = this;
                _.each(e.eventInfo.nodesInfoList, function(node, i) {
                    if (_.isArray(me.dataFrame.yAxis.field[node.iNode])) {
                        node.field = me.dataFrame.yAxis.field[node.iNode][node.iLay];
                    } else {
                        node.field = me.dataFrame.yAxis.field[node.iNode]
                    };

                    //把这个group当前是否选中状态记录
                    if (me._checkedList[node.iGroup]) {
                        node.checked = true;
                    } else {
                        node.checked = false;
                    }
                });

                e.eventInfo.dataZoom = me.dataZoom;
            },
            _trimGraphs: function(_xAxis, _yAxis) {

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

                    _.each(yArrList, function(subv, v) {
                        !tmpData[b][v] && (tmpData[b][v] = []);

                        if (me.dataZoom.enabled) {
                            subv = subv.slice(me.dataZoom.range.start, me.dataZoom.range.end);
                        };

                        _.each(subv, function(val, i) {

                            if (!xArr[i]) {
                                return;
                            };

                            var vCount = 0;
                            if (me.proportion) {
                                //先计算总量
                                _.each(yArrList, function(team, ti) {
                                    vCount += team[i]
                                });
                            };

                            var x = xArr[i].x - xDis1 / 2 + xDis2 * (b + 1);

                            var y = 0;
                            if (me.proportion) {
                                y = -val / vCount * _yAxis.yGraphsHeight;
                            } else {
                                y = -(val - _yAxis._bottomNumber) / Math.abs(maxYAxis - _yAxis._bottomNumber) * _yAxis.yGraphsHeight;
                            };
                            if (v > 0) {
                                y += tmpData[b][v - 1][i].y;
                            };

                            //如果有排序的话
                            if (me._yAxis.sort && me._yAxis.sort == "desc") {
                                y = -(_yAxis.yGraphsHeight - Math.abs(y));
                            };

                            var node = {
                                value: val,
                                field: me._getTargetField(b, v, i, _yAxis.field),
                                x: x,
                                y: y
                            };

                            if (me.proportion) {
                                node.vCount = vCount;
                            };

                            tmpData[b][v].push(node);


                            yValueMaxs[b] += Number(val)
                            yLen = subv.length
                        });
                    });
                };

                for (var a = 0, al = yValueMaxs.length; a < al; a++) {
                    center[a].agValue = yValueMaxs[a] / yLen
                    center[a].agPosition = -(yValueMaxs[a] / yLen - _yAxis._bottomNumber) / (maxYAxis - _yAxis._bottomNumber) * _yAxis.yGraphsHeight
                };
                //均值
                this.dataFrame.yAxis.center = center;

                return {
                    data: tmpData
                };
            },
            _getTargetField: function(b, v, i, field) {
                if (!field) {
                    field = this._yAxis.field;
                };
                if (_.isString(field)) {
                    return field;
                } else if (_.isArray(field)) {
                    var res = field[b];
                    if (_.isString(res)) {
                        return res;
                    } else if (_.isArray(res)) {
                        return res[v];
                    };
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
                this._graphs.grow(function(g) {
                    if (me._opts.markLine) {
                        me._initMarkLine(g);
                    };
                    if (me._opts.markPoint) {
                        me._initMarkPoint(g);
                    };
                });

                this.bindEvent();
            },
            _initDataZoom: function() {
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
                    dragIng: function(range) {
                        if (parseInt(range.start) == parseInt(me.dataZoom.range.start) && parseInt(range.end) == parseInt(me.dataZoom.range.end)) {
                            return;
                        };
                        if (me.dataZoom.range.end <= me.dataZoom.range.start) {
                            me.dataZoom.range.end = me.dataZoom.range.start + 1;
                        };

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
                        me._graphs.grow(function() {
                            //callback
                        }, {
                            delay: 0,
                            easing: "Quadratic.Out",
                            duration: 300
                        });

                        me._removeChecked();

                        me.fire("_dataZoomDragIng");
                    },
                    dragEnd: function(range) {
                        me._updateChecked()
                    }
                }, me.dataZoom);

                //me._getCloneBar();

                me._dataZoom = new DataZoom(dataZoomOpt);

                var graphssp = this.__cloneBar.thumbBar._graphs.sprite;
                graphssp.id = graphssp.id + "_datazoomthumbbarbg"
                graphssp.context.x = 0;
                graphssp.context.y = me._dataZoom.height - me._dataZoom.barY;
                graphssp.context.scaleY = me._dataZoom.barH / this.__cloneBar.thumbBar._graphs.h;

                me._dataZoom.dataZoomBg.addChild(graphssp);
                me.core.addChild(me._dataZoom.sprite);

                this.__cloneBar.thumbBar.destroy();
                this.__cloneBar.cloneEl.parentNode.removeChild(this.__cloneBar.cloneEl);
                //});
            },
            _getCloneBar: function( barConstructor ) {
                var me = this;
                barConstructor = (barConstructor || Bar);
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
            _initMarkLine: function(g) {
                var me = this
                require(['chartx/components/markline/index'], function(MarkLine) {
                    for (var a = 0, al = me._yAxis.dataOrg.length; a < al; a++) {
                        var index = a
                        var center = me.dataFrame.yAxis.center[a].agPosition
                        var strokeStyle = g.sprite.children[0] ? g.sprite.children[0].children[a + 1].context.fillStyle : '#000000'

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

                        new MarkLine(_.deepExtend(o, me._opts.markLine)).done(function() {
                            me.core.addChild(this.sprite)
                        })
                    }
                })
            },
            _initMarkPoint: function(g) {
                var me = this;
                var gOrigin = {
                    x: g.sprite.context.x,
                    y: g.sprite.context.y
                };

                require(["chartx/components/markpoint/index"], function(MarkPoint) {
                    _.each(g.data, function(group, i) {
                        var vLen = group.length;

                        _.each(group, function(hgroup) {
                            _.each(hgroup, function(bar) {
                                var barObj = _.clone(bar);
                                barObj.x += gOrigin.x;
                                barObj.y += gOrigin.y;
                                var mpCtx = {
                                    value: barObj.value,
                                    shapeType: "droplet",
                                    markTarget: barObj.field,
                                    //注意，这里视觉上面的分组和数据上面的分组不一样，所以inode 和 igroup 给出去的时候要反过来
                                    iGroup: barObj.iNode,
                                    iNode: barObj.iGroup,
                                    iLay: barObj.iLay,
                                    point: {
                                        x: barObj.x,
                                        y: barObj.y
                                    }
                                };
                                new MarkPoint(me._opts, mpCtx).done(function() {
                                    me.core.addChild(this.sprite);
                                    var mp = this;
                                    this.shape.hover(function(e) {
                                        this.context.hr++;
                                        this.context.cursor = "pointer";
                                        e.stopPropagation();
                                    }, function(e) {
                                        this.context.hr--;
                                        e.stopPropagation();
                                    });
                                    this.shape.on("mousemove", function(e) {
                                        e.stopPropagation();
                                    });
                                    this.shape.on("tap click", function(e) {
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

            _removeChecked: function() {
                this._graphs.removeAllChecked()
            },
            _updateChecked: function() {
                var me = this
                me._currCheckedList = me._getCurrCheckedList()
                for (var a = 0, al = me._currCheckedList.length; a < al; a++) {
                    var o = me._currCheckedList[a]
                    me._checkedBar({
                        iGroup: o.iGroup - me.dataZoom.range.start,
                        checked: true,
                    })
                }
            },

            _getCurrCheckedList: function() {
                var me = this
                return _.filter(me._checkedList, function(o) {
                    if (o) {
                        if (o.iGroup >= me.dataZoom.range.start && o.iGroup <= me.dataZoom.range.end) {
                            return o
                        }
                    }
                })
            },
            _checked: function(eventInfo) { //当点击graphs时 触发选中状态
                var me = this
                if (!me._graphs.checked.enabled) {
                    return
                }
                var i = eventInfo.iGroup + me.dataZoom.range.start

                var checked = true
                if (me._checkedList[i]) { //如果已经选中
                    me._checkedList[i] = null
                    checked = false
                } else { //如果没选中                           
                    me._checkedList[i] = eventInfo
                }
                me._checkedBar({
                    iGroup: eventInfo.iGroup,
                    checked: checked
                })
                me._checkedMiniBar({
                    iGroup: i,
                    checked: checked
                })

                eventInfo.iGroup = i
            },
            _checkedBar: function($o) { //选择bar
                var me = this
                var graphs = me._graphs
                graphs._checked($o)
            },
            _checkedMiniBar: function($o) { //选择缩略的bar
                if (this.dataZoom.enabled) {
                    var me = this
                    var graphs = me.__cloneBar.thumbBar._graphs
                    var fillStyle = ''
                    if ($o.checked) {
                        fillStyle = (me._opts.dataZoom.checked && me._opts.dataZoom.checked.fillStyle) || fillStyle
                    }
                    graphs.setBarStyle({
                        iGroup: $o.iGroup,
                        fillStyle: fillStyle
                    })
                }
            },

            bindEvent: function() {
                var me = this;
                this._graphs.sprite.on("panstart mouseover", function(e) {
                    me._setXaxisYaxisToTipsInfo(e);
                    me._tip.show(e);
                    me.fire(e.type, e);
                });
                this._graphs.sprite.on("panmove mousemove", function(e) {
                    me._setXaxisYaxisToTipsInfo(e);
                    me._tip.move(e);
                    me.fire(e.type, e);
                });
                this._graphs.sprite.on("panend mouseout", function(e) {
                    me._tip.hide(e);
                    me.fire(e.type, e);
                });
                this._graphs.sprite.on("tap click dblclick mousedown mouseup", function(e) {
                    if (e.type == 'click') {
                        me.fire('checkedBefor');
                        me._checked(_.clone(e.eventInfo));
                    }
                    me._setXaxisYaxisToTipsInfo(e);
                    me.fire(e.type, e);
                });
            }
        });
        return Bar;
    }
);


