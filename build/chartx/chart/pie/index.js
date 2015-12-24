define(
    "chartx/chart/pie/pie", [
        "canvax/index",
        "canvax/shape/Sector",
        "canvax/shape/Line",
        "canvax/shape/BrokenLine",
        "canvax/shape/Rect",
        "chartx/utils/tools",
        "canvax/animation/AnimationFrame",
        "chartx/components/tips/tip",
        "chartx/chart/theme"
    ],
    function(Canvax, Sector, Line, BrokenLine, Rect, Tools, AnimationFrame, Tip, Theme) {
        var Pie = function(opt, tipsOpt, domContainer) {
            this.data = null;
            this.sprite = null;
            this.branchSp = null;
            this.sectorsSp = null;
            this.checkedSp = null;
            //this.angleOffset = -90; //正常情况下，饼图的扇形0度是从3点钟开始，-90表示从12点开始；改值只能是90的倍数

            this.dataLabel = {
                enabled: true,
                allowLine: true,
                format: null
            };

            this.tips = _.deepExtend({
                enabled: true
            }, tipsOpt); //tip的confit
            this.domContainer = domContainer;
            this._tip = null; //tip的对象 tip的config 放到graphs的config中传递过来

            this.init(opt);
            this.colorIndex = 0;
            this.sectors = [];
            this.sectorMap = [];
            this.isMoving = false;

            this.labelList = [];

        };

        Pie.prototype = {
            init: function(opt) {
                _.deepExtend(this, opt);
                this.sprite = new Canvax.Display.Sprite();

                this.sectorsSp = new Canvax.Display.Sprite();
                this.sprite.addChild(this.sectorsSp);

                this.checkedSp = new Canvax.Display.Sprite();
                this.sprite.addChild(this.checkedSp);

                this._tip = new Tip(this.tips, this.domContainer);
                this._tip._getDefaultContent = this._getTipDefaultContent;
                this.sprite.addChild(this._tip.sprite);
                if (this.dataLabel.enabled) {
                    this.branchSp = new Canvax.Display.Sprite();
                };
                this._configData();
                this._configColors();
            },
            setX: function($n) {
                this.sprite.context.x = $n
            },
            setY: function($n) {
                this.sprite.context.y = $n
            },
            //配置数据
            _configData: function() {
                var self = this;
                self.total = 0;
                self.angleOffset = Number.isNaN(self.startAngle) ? 0 : self.startAngle;
                self.angleOffset = self.angleOffset % 360;
                self.currentAngle = 0 + self.angleOffset;
                var limitAngle = 360 + self.angleOffset;
                var adjustFontSize = 12 * self.boundWidth / 1000;
                self.labelFontSize = adjustFontSize < 12 ? 12 : adjustFontSize;
                var percentFixedNum = 2;
                var data = self.data.data;
                self.clickMoveDis = self.r / 11;
                if (data.length && data.length > 0) {

                    for (var i = 0; i < data.length; i++) {
                        self.total += data[i].y;
                    }
                    if (self.total > 0) {
                        var maxIndex = 0;
                        var maxPercentageOffsetIndex = 0;
                        var totalFixedPercent = 0;
                        for (var j = 0; j < data.length; j++) {
                            var percentage = data[j].y / self.total;
                            var fixedPercentage = +((percentage * 100).toFixed(percentFixedNum));
                            var percentageOffset = Math.abs(percentage * 100 - fixedPercentage);
                            totalFixedPercent += fixedPercentage;

                            if (j > 0 && percentage > data[maxIndex].orginPercentage) {
                                maxIndex = j;
                            }

                            if (j > 0 && percentageOffset > data[maxPercentageOffsetIndex].percentageOffset) {
                                maxPercentageOffsetIndex = j;
                            }

                            var angle = 360 * percentage;
                            var endAngle = self.currentAngle + angle > limitAngle ? limitAngle : self.currentAngle + angle;
                            var cosV = Math.cos((self.currentAngle + angle / 2) / 180 * Math.PI);
                            var sinV = Math.sin((self.currentAngle + angle / 2) / 180 * Math.PI);
                            var midAngle = self.currentAngle + angle / 2;
                            cosV = cosV.toFixed(5);
                            sinV = sinV.toFixed(5);
                            var quadrant = function(ang) {
                                if (ang > limitAngle) {
                                    ang = limitAngle;
                                }

                                ang = ang % 360;
                                var angleRatio = parseInt(ang / 90);
                                if (ang >= 0) {
                                    switch (angleRatio) {
                                        case 0:
                                            return 1;
                                            break;
                                        case 1:
                                            return 2;
                                            break;
                                        case 2:
                                            return 3;
                                            break;
                                        case 3:
                                        case 4:
                                            return 4;
                                            break;
                                    }
                                } else if (ang < 0) {
                                    switch (angleRatio) {
                                        case 0:
                                            return 4;
                                            break;
                                        case -1:
                                            return 3;
                                            break;
                                        case -2:
                                            return 2;
                                            break;
                                        case -3:
                                        case -4:
                                            return 1;
                                            break;
                                    }
                                }
                            }(midAngle);
                            _.extend(data[j], {
                                start: self.currentAngle,
                                end: endAngle,
                                midAngle: midAngle,
                                outOffsetx: self.clickMoveDis * cosV,
                                outOffsety: self.clickMoveDis * sinV,
                                centerx: (self.r - self.clickMoveDis) * cosV,
                                centery: (self.r - self.clickMoveDis) * sinV,
                                outx: (self.r + self.clickMoveDis) * cosV,
                                outy: (self.r + self.clickMoveDis) * sinV,
                                edgex: (self.r + 2 * self.clickMoveDis) * cosV,
                                edgey: (self.r + 2 * self.clickMoveDis) * sinV,
                                orginPercentage: percentage,
                                percentage: fixedPercentage,
                                percentageOffset: percentageOffset,
                                txt: fixedPercentage + '%',
                                quadrant: quadrant,
                                labelDirection: quadrant == 1 || quadrant == 4 ? 1 : 0,
                                index: j,
                                isMax: false,
                                checked: false //是否点击选中
                            });

                            self.currentAngle += angle;
                            if (self.currentAngle > limitAngle) self.currentAngle = limitAngle;
                        };
                        data[maxIndex].isMax = true;
                        //处理保留小数后百分比总和不等于100的情况
                        var totalPercentOffset = (100 - totalFixedPercent).toFixed(percentFixedNum);
                        if (totalPercentOffset != 0) {
                            data[maxPercentageOffsetIndex].percentage += +totalPercentOffset;
                            data[maxPercentageOffsetIndex].percentage = parseFloat(data[maxPercentageOffsetIndex].percentage).toFixed(percentFixedNum);
                            data[maxPercentageOffsetIndex].txt = parseFloat(data[maxPercentageOffsetIndex].percentage).toFixed(percentFixedNum) + '%';
                        };
                    }
                }
            },
            getList: function() {
                var self = this;
                var list = [];
                if (self.sectors && self.sectors.length > 0) {
                    list = self.sectors;
                };
                return list;
            },
            getLabelList: function() {
                return this.labelList;
            },
            getTopAndBottomIndex: function() {
                var me = this;
                var data = self.data;
                var indexs = {};
                var topBase = 270;
                var bottomBase = 90;
                var preTopDis = 90,
                    preBottomDis = 90,
                    currentTopDis, currentBottomDis;
                if (data.length > 0) {
                    _.each(self.data, function() {
                        //bottom
                        if (data.quadrant == 1 || data.quadrant == 2) {
                            currentBottomDis = Math.abs(data.middleAngle - bottomBase);
                            if (currentBottomDis < preBottomDis) {
                                indexs.bottomIndex = data.index;
                                preBottomDis = currentBottomDis;
                            }
                        }
                        //top
                        else if (data.quadrant == 3 || data.quadrant == 4) {
                            currentTopDis = Math.abs(data.middleAngle - topBase);
                            if (currentTopDis < preTopDis) {
                                indexs.topIndex = data.index;
                                preTopDis = currentTopDis;
                            }
                        }
                    })
                }
                return indexs;
            },
            getColorByIndex: function(colors, index) {
                if (index >= colors.length) {
                    //若数据条数刚好比颜色数组长度大1,会导致最后一个扇形颜色与第一个颜色重复
                    if ((this.data.data.length - 1) % colors.length == 0 && (index % colors.length == 0)) {
                        index = index % colors.length + 1;
                    } else {
                        index = index % colors.length;
                    }
                };
                return colors[index];
            },
            _configColors: function() {
                this.colors = this.colors ? this.colors : Theme.colors;
            },
            draw: function(opt) {
                var self = this;
                self.setX(self.x);
                self.setY(self.y);
                self._widget();
                //this.sprite.context.globalAlpha = 0;      
                if (opt.animation) {
                    self.grow();
                }
                if (opt.complete) {
                    opt.complete.call(self);
                }
            },
            focus: function(index, callback) {
                var self = this;
                var sec = self.sectorMap[index].sector;
                var secData = self.data.data[index];
                secData._selected = true;
                sec.animate({
                    x: secData.outOffsetx,
                    y: secData.outOffsety
                }, {
                    duration: 100,
                    onComplete: function() {
                        //secData.checked = true;
                        callback && callback();
                    }
                });
            },
            unfocus: function(index, callback) {
                var self = this;
                var sec = self.sectorMap[index].sector;
                var secData = self.data.data[index];
                secData._selected = false;
                sec.animate({
                    x: 0,
                    y: 0
                }, {
                    duration: 100,
                    onComplete: function() {
                        callback && callback();
                        //secData.checked = false;
                    }
                });
            },
            check: function(index) {
                var sec = this.sectorMap[index].sector;
                var secData = this.data.data[index];
                if (secData.checked) {
                    return
                };
                var me = this;
                if (!secData._selected) {
                    this.focus(index, function() {
                        me.addCheckedSec(sec);
                    });
                } else {
                    this.addCheckedSec(sec);
                };
                secData.checked = true;
            },
            uncheck: function(index) {
                var sec = this.sectorMap[index].sector;
                var secData = this.data.data[index];
                if (!secData.checked) {
                    return
                };
                var me = this;
                me.delCheckedSec(sec, function() {
                    me.unfocus(index);
                });
                secData.checked = false;
            },
            grow: function() {
                var self = this;
                var timer = null;
                _.each(self.sectors, function(sec, index) {
                    if (sec.context) {
                        sec.context.r0 = 0;
                        sec.context.r = 0;
                        sec.context.startAngle = self.angleOffset;
                        sec.context.endAngle = self.angleOffset;
                    }
                });
                self._hideDataLabel();

                AnimationFrame.registTween({
                    from: {
                        process: 0,
                        r: 0,
                        r0: 0
                    },
                    to: {
                        process: 1,
                        r: self.r,
                        r0: self.r0
                    },
                    duration: 800,
                    easing: "Back.Out",
                    onUpdate: function() {
                        for (var i = 0; i < self.sectors.length; i++) {
                            var sec = self.sectors[i];
                            var secc = sec.context;
                            if (secc) {
                                secc.r = this.r;
                                secc.r0 = this.r0;
                                secc.globalAlpha = this.process;
                                if (i == 0) {
                                    secc.startAngle = sec.startAngle;
                                    secc.endAngle = sec.startAngle + (sec.endAngle - sec.startAngle) * this.process;
                                } else {
                                    var lastEndAngle = function(index) {
                                        var lastIndex = index - 1;
                                        var lastSecc = self.sectors[lastIndex].context;
                                        if (lastIndex == 0) {
                                            return lastSecc ? lastSecc.endAngle : 0;
                                        }
                                        if (lastSecc) {
                                            return lastSecc.endAngle;
                                        } else {
                                            return arguments.callee(lastIndex);
                                        }
                                    }(i);
                                    secc.startAngle = lastEndAngle;
                                    secc.endAngle = secc.startAngle + (sec.endAngle - sec.startAngle) * this.process;
                                }
                            }
                        }
                    },
                    onComplete: function() {
                        self._showDataLabel();
                    }
                });
            },
            _showDataLabel: function() {
                if (this.branchSp) {
                    this.branchSp.context.globalAlpha = 1;
                    _.each(this.labelList, function(lab) {
                        lab.labelEle.style.display = "block"
                    });
                }
            },
            _hideDataLabel: function() {
                if (this.branchSp) {
                    this.branchSp.context.globalAlpha = 0;
                    _.each(this.labelList, function(lab) {
                        lab.labelEle.style.display = "none"
                    });
                }
            },
            _showTip: function(e, ind) {
                this._tip.show(this._geteventInfo(e, ind));
            },
            _hideTip: function(e) {
                this._tip.hide(e);
            },
            _moveTip: function(e, ind) {
                this._tip.move(this._geteventInfo(e, ind))
            },
            _getTipDefaultContent: function(info) {
                return "<div style='color:" + info.fillStyle + "'><div style='padding-bottom:3px;'>" + info.name + "：" + info.value + "</div>" + parseInt(info.percentage) + "%</div>";
            },
            _geteventInfo: function(e, ind) {
                var data = this.data.data[ind];
                var fillColor = this.getColorByIndex(this.colors, ind);
                e.eventInfo = {
                    iNode: ind,
                    name: data.name,
                    percentage: data.percentage,
                    value: data.y,
                    fillStyle: fillColor,
                    data: this.data.org[ind]
                };
                return e;
            },
            _sectorFocus: function(e, index) {
                if (this.sectorMap[index]) {
                    if (this.focusCallback && e) {
                        this.focusCallback.focus(e, index);
                    }
                }
            },
            _sectorUnfocus: function(e, index) {
                if (this.focusCallback && e) {
                    this.focusCallback.unfocus(e, index);
                }
            },
            _getByIndex: function(index) {
                return this.sectorMap[index];
            },
            _widgetLabel: function(quadrant, indexs, lmin, rmin, isEnd, ySpaceInfo) {
                var self = this;
                var data = self.data.data;
                var sectorMap = self.sectorMap;
                var minTxtDis = 15;
                var labelOffsetX = 5;
                var outCircleRadius = self.r + 2 * self.clickMoveDis;
                var currentIndex, baseY, clockwise, isleft, minPercent;
                var currentY, adjustX, txtDis, bkLineStartPoint, bklineMidPoint, bklineEndPoint, branchLine, brokenline, branchTxt, bwidth, bheight, bx, by;
                var isMixed, yBound, remainingNum, remainingY, adjustY;

                clockwise = quadrant == 2 || quadrant == 4;
                isleft = quadrant == 2 || quadrant == 3;
                isup = quadrant == 3 || quadrant == 4;
                minPercent = isleft ? lmin : rmin;
                for (i = 0; i < indexs.length; i++) {
                    currentIndex = indexs[i];
                    //若Y值小于最小值，不画label    
                    if (data[currentIndex].y != 0 && data[currentIndex].percentage <= minPercent) continue
                    currentY = data[currentIndex].edgey;
                    adjustX = Math.abs(data[currentIndex].edgex);
                    txtDis = currentY - baseY;

                    if (i != 0 && ((Math.abs(txtDis) < minTxtDis) || (isup && txtDis < 0) || (!isup && txtDis > 0))) {
                        currentY = isup ? baseY + minTxtDis : baseY - minTxtDis;
                        if (outCircleRadius - Math.abs(currentY) > 0) {
                            adjustX = Math.sqrt(Math.pow(outCircleRadius, 2) - Math.pow(currentY, 2));
                        }

                        if ((isleft && (-adjustX > data[currentIndex].edgex)) || (!isleft && (adjustX < data[currentIndex].edgex))) {
                            adjustX = Math.abs(data[currentIndex].edgex);
                        }
                    }

                    if (isEnd) {
                        yBound = isleft ? ySpaceInfo.left : ySpaceInfo.right;
                        remainingNum = indexs.length - i;
                        remainingY = isup ? yBound - remainingNum * minTxtDis : yBound + remainingNum * minTxtDis;
                        if ((isup && currentY > remainingY) || !isup && currentY < remainingY) {
                            currentY = remainingY;
                        }
                    }

                    bkLineStartPoint = [data[currentIndex].outx, data[currentIndex].outy];
                    bklineMidPoint = [isleft ? -adjustX : adjustX, currentY];
                    bklineEndPoint = [isleft ? -adjustX - labelOffsetX : adjustX + labelOffsetX, currentY];
                    baseY = currentY;
                    if (!isEnd) {
                        if (isleft) {
                            ySpaceInfo.left = baseY;
                        } else {
                            ySpaceInfo.right = baseY;
                        }
                    }
                    //指示线
                    branchLine = new Line({
                        context: {
                            xStart: data[currentIndex].centerx,
                            yStart: data[currentIndex].centery,
                            xEnd: data[currentIndex].outx,
                            yEnd: data[currentIndex].outy,
                            lineWidth: 1,
                            strokeStyle: sectorMap[currentIndex].color,
                            lineType: 'solid'
                        }
                    });
                    brokenline = new BrokenLine({
                        context: {
                            lineType: 'solid',
                            smooth: false,
                            pointList: [bkLineStartPoint, bklineMidPoint, bklineEndPoint],
                            lineWidth: 1,
                            strokeStyle: sectorMap[currentIndex].color
                        }
                    });
                    //指示文字
                    var labelTxt = '';
                    var formatReg = /\{.+?\}/g;
                    var point = data[currentIndex];
                    if (self.dataLabel.format) {
                        if (_.isFunction(self.dataLabel.format)) {
                            labelTxt = this.dataLabel.format(data[currentIndex]);
                        } else {
                            labelTxt = self.dataLabel.format.replace(formatReg, function(match, index) {
                                var matchStr = match.replace(/\{([\s\S]+?)\}/g, '$1');
                                var vals = matchStr.split('.');
                                var obj = eval(vals[0]);
                                var pro = vals[1];
                                return obj[pro];
                            });
                            if (labelTxt) {
                                labelTxt = "<span>" + labelTxt + "</span>"
                            };
                        }
                    };
                    labelTxt || (labelTxt = "<span>" + data[currentIndex].name + ' : ' + data[currentIndex].txt + "</span>");

                    branchTxt = document.createElement("div");
                    branchTxt.style.cssText = " ;position:absolute;left:-1000px;top:-1000px;color:" + sectorMap[currentIndex].color + ""
                    branchTxt.innerHTML = labelTxt;
                    self.domContainer.appendChild(branchTxt);
                    bwidth = branchTxt.offsetWidth;
                    bheight = branchTxt.offsetHeight;
                    //branchTxt.style.display = "none"

                    bx = isleft ? -adjustX : adjustX;
                    by = currentY;

                    switch (quadrant) {
                        case 1:
                            bx += labelOffsetX;
                            by -= bheight / 2;
                            break;
                        case 2:
                            bx -= (bwidth + labelOffsetX);
                            by -= bheight / 2;
                            break;
                        case 3:
                            bx -= (bwidth + labelOffsetX);
                            by -= bheight / 2;
                            break;
                        case 4:
                            bx += labelOffsetX;
                            by -= bheight / 2;
                            break;
                    };

                    //branchTxt.context.x = bx;
                    //branchTxt.context.y = by;

                    branchTxt.style.left = bx + self.x + "px";
                    branchTxt.style.top = by + self.y + "px";

                    if (self.dataLabel.allowLine) {
                        self.branchSp.addChild(branchLine);
                        self.branchSp.addChild(brokenline);
                    };

                    self.sectorMap[currentIndex].label = {
                        line1: branchLine,
                        line2: brokenline,
                        label: branchTxt
                    };

                    self.labelList.push({
                        width: bwidth,
                        height: bheight,
                        x: bx + self.x,
                        y: by + self.y,
                        data: data[currentIndex],
                        labelTxt: labelTxt,
                        labelEle: branchTxt
                    });
                }
            },
            _hideLabel: function(index) {
                if (this.sectorMap[index]) {
                    var label = this.sectorMap[index].label;
                    label.line1.context.visible = false;
                    label.line2.context.visible = false;
                    label.label.style.display = "none";
                }
            },
            _showLabel: function(index) {
                if (this.sectorMap[index]) {
                    var label = this.sectorMap[index].label;
                    label.line1.context.visible = true;
                    label.line2.context.visible = true;
                    label.label.style.display = "block";
                }
            },
            _startWidgetLabel: function() {
                var self = this;
                var data = self.data.data;
                var rMinPercentage = 0,
                    lMinPercentage = 0;
                var quadrantsOrder = [];
                var quadrantInfo = [{
                    indexs: [],
                    count: 0
                }, {
                    indexs: [],
                    count: 0
                }, {
                    indexs: [],
                    count: 0
                }, {
                    indexs: [],
                    count: 0
                }];
                //默认从top开始画
                var widgetInfo = {
                    right: {
                        startQuadrant: 4,
                        endQuadrant: 1,
                        clockwise: true,
                        indexs: []
                    },
                    left: {
                        startQuadrant: 3,
                        endQuadrant: 2,
                        clockwise: false,
                        indexs: []
                    }
                }
                for (var i = 0; i < data.length; i++) {
                    var cur = data[i].quadrant;
                    quadrantInfo[cur - 1].indexs.push(i);
                    quadrantInfo[cur - 1].count++;
                }

                //1,3象限的绘制顺序需要反转
                if (quadrantInfo[0].count > 1) quadrantInfo[0].indexs.reverse();
                if (quadrantInfo[2].count > 1) quadrantInfo[2].indexs.reverse();

                if (quadrantInfo[0].count > quadrantInfo[3].count) {
                    widgetInfo.right.startQuadrant = 1;
                    widgetInfo.right.endQuadrant = 4;
                    widgetInfo.right.clockwise = false;
                }

                if (quadrantInfo[1].count > quadrantInfo[2].count) {
                    widgetInfo.left.startQuadrant = 2;
                    widgetInfo.left.endQuadrant = 3;
                    widgetInfo.left.clockwise = true;
                }

                widgetInfo.right.indexs = quadrantInfo[widgetInfo.right.startQuadrant - 1].indexs.concat(quadrantInfo[widgetInfo.right.endQuadrant - 1].indexs);
                widgetInfo.left.indexs = quadrantInfo[widgetInfo.left.startQuadrant - 1].indexs.concat(quadrantInfo[widgetInfo.left.endQuadrant - 1].indexs);

                var overflowIndexs, sortedIndexs;
                if (widgetInfo.right.indexs.length > 15) {
                    sortedIndexs = widgetInfo.right.indexs.slice(0);
                    sortedIndexs.sort(function(a, b) {
                        return data[b].percentage - data[a].percentage;
                    });
                    overflowIndexs = sortedIndexs.slice(15);
                    rMinPercentage = data[overflowIndexs[0]].percentage;
                }
                if (widgetInfo.left.indexs.length > 15) {
                    sortedIndexs = widgetInfo.left.indexs.slice(0);
                    sortedIndexs.sort(function(a, b) {
                        return data[b].percentage - data[a].percentage;
                    });
                    overflowIndexs = sortedIndexs.slice(15);
                    lMinPercentage = data[overflowIndexs[0]].percentage;
                }

                quadrantsOrder.push(widgetInfo.right.startQuadrant);
                quadrantsOrder.push(widgetInfo.right.endQuadrant);
                quadrantsOrder.push(widgetInfo.left.startQuadrant);
                quadrantsOrder.push(widgetInfo.left.endQuadrant);

                var ySpaceInfo = {}

                for (i = 0; i < quadrantsOrder.length; i++) {
                    var isEnd = i == 1 || i == 3;
                    self._widgetLabel(quadrantsOrder[i], quadrantInfo[quadrantsOrder[i] - 1].indexs, lMinPercentage, rMinPercentage, isEnd, ySpaceInfo)
                }
            },
            _getAngleTime: function(secc) {
                return Math.abs(secc.startAngle - secc.endAngle) / 360 * 500
            },
            addCheckedSec: function(sec , callback) {
                var secc = sec.context;
                var sector = new Sector({
                    context: {
                        x: secc.x,
                        y: secc.y,
                        r0: secc.r,
                        r: secc.r + 8,
                        startAngle: secc.startAngle,
                        endAngle: secc.startAngle + 0.5, //secc.endAngle,
                        fillStyle: secc.fillStyle,
                        globalAlpha: 0.5
                    },
                    id: 'checked_' + sec.id
                });
                this.checkedSp.addChild(sector);
                sector.animate({
                    endAngle: secc.endAngle
                }, {
                    duration: this._getAngleTime(secc),
                    onComplete : function(){
                        callback && callback();
                    }
                });
            },
            delCheckedSec: function(sec, callback) {
                var checkedSec = this.checkedSp.getChildById('checked_' + sec.id);
                checkedSec.animate({
                    //endAngle : checkedSec.context.startAngle+0.5
                    startAngle: checkedSec.context.endAngle - 0.3
                }, {
                    onComplete: function() {
                        checkedSec.destroy();
                        callback && callback();
                    },
                    duration: 150
                });
            },
            _widget: function() {
                var self = this;
                var data = self.data.data;
                var moreSecData;
                if (data.length > 0 && self.total > 0) {
                    self.branchSp && self.sprite.addChild(self.branchSp);
                    for (var i = 0; i < data.length; i++) {
                        if (self.colorIndex >= self.colors.length) self.colorIndex = 0;
                        var fillColor = self.getColorByIndex(self.colors, i);
                        if (data[i].end > data[i].start) {
                            //扇形主体          
                            var sector = new Sector({
                                hoverClone: false,
                                context: {
                                    x: data[i].sliced ? data[i].outOffsetx : 0,
                                    y: data[i].sliced ? data[i].outOffsety : 0,
                                    r0: self.r0,
                                    r: self.r,
                                    startAngle: data[i].start,
                                    endAngle: data[i].end,
                                    fillStyle: fillColor,
                                    index: data[i].index,
                                    cursor: "pointer"
                                },
                                id: 'sector' + i
                            });
                            sector.__data = data[i];
                            sector.__colorIndex = i;
                            sector.__dataIndex = i;
                            sector.__isSliced = data[i].sliced;
                            //扇形事件
                            sector.hover(function(e) {
                                var me = this;
                                if (self.tips.enabled) {
                                    self._showTip(e, this.__dataIndex);
                                };
                                var secData = self.data.data[this.__dataIndex];
                                if (!secData.checked) {
                                    self._sectorFocus(e, this.__dataIndex);
                                    self.focus(this.__dataIndex);
                                }
                            }, function(e) {
                                if (self.tips.enabled) {
                                    self._hideTip(e);
                                };
                                var secData = self.data.data[this.__dataIndex];
                                if (!secData.checked) {
                                    self._sectorUnfocus(e, this.__dataIndex);
                                    self.unfocus(this.__dataIndex);
                                }
                            });

                            sector.on('mousedown mouseup click mousemove', function(e) {
                                self._geteventInfo(e, this.__dataIndex);
                                if (e.type == "click") {
                                    self.secClick(this);
                                };
                                if (e.type == "mousemove") {
                                    if (self.tips.enabled) {
                                        self._moveTip(e, this.__dataIndex);
                                    }
                                };
                            });

                            self.sectorsSp.addChildAt(sector, 0);
                            moreSecData = {
                                name: data[i].name,
                                value: data[i].y,
                                sector: sector,
                                context: sector.context,
                                originx: sector.context.x,
                                originy: sector.context.y,
                                r: self.r,
                                startAngle: sector.context.startAngle,
                                endAngle: sector.context.endAngle,
                                color: fillColor,
                                index: i,
                                percentage: data[i].percentage,
                                visible: true
                            };
                            self.sectors.push(moreSecData);
                        } else if (data[i].end == data[i].start) {
                            self.sectors.push({
                                name: data[i].name,
                                sector: null,
                                context: null,
                                originx: 0,
                                originy: 0,
                                r: self.r,
                                startAngle: data[i].start,
                                endAngle: data[i].end,
                                color: fillColor,
                                index: i,
                                percentage: 0,
                                visible: true
                            });
                        }
                    }

                    if (self.sectors.length > 0) {
                        self.sectorMap = {};
                        for (var i = 0; i < self.sectors.length; i++) {
                            self.sectorMap[self.sectors[i].index] = self.sectors[i];
                        }
                    }

                    if (self.dataLabel.enabled) {
                        self._startWidgetLabel();
                    }
                }
            },
            secClick: function(sectorEl) {
                var secData = this.data.data[sectorEl.__dataIndex];
                if( sectorEl.clickIng ){
                    return;
                };
                sectorEl.clickIng = true;
                if (!secData.checked) {
                    this.addCheckedSec(sectorEl , function(){
                        sectorEl.clickIng = false;
                    });
                } else {
                    this.delCheckedSec(sectorEl , function(){
                        sectorEl.clickIng = false;
                    });
                };
                secData.checked = !secData.checked;
            }
        };

        return Pie;
    })

define(
    'chartx/chart/pie/index', [
        'chartx/chart/index',
        'chartx/chart/pie/pie'
    ],
    function(Chart, Pie) {
        /*
         *@node chart在dom里的目标容器节点。
         */
        var Canvax = Chart.Canvax;

        return Chart.extend({
            init: function(node, data, opts) {
                this.config = {
                    mode: 1,
                    event: {
                        enabled: 1
                    }
                };
                this.xAxis = {
                    field: null
                };
                this.yAxis = {
                    field: null
                };
                _.deepExtend(this, opts);
                this.dataFrame = this._initData(data, this);
            },
            draw: function() {
                //console.log("pie draw");
                this.stageBg = new Canvax.Display.Sprite({
                    id: 'bg'
                });
                this.core = new Canvax.Display.Sprite({
                    id: 'core'
                });
                this.stageTip = new Canvax.Display.Stage({
                    id: 'stageTip'
                });
                this.canvax.addChild(this.stageTip);
                this.stageTip.toFront();
                this.stage.addChild(this.core);

                this._initModule(); //初始化模块
                this._startDraw(); //开始绘图
                this._drawEnd(); //绘制结束，添加到舞台  
                this.inited = true;
            },
            getByIndex: function(index) {
                return this._pie._getByIndex(index);
            },
            getLabelList: function() {
                return this._pie.getLabelList();
            },
            getList: function() {
                var self = this;
                var list = [];
                var item;
                if (self._pie) {
                    var sectorList = self._pie.getList();
                    if (sectorList.length > 0) {
                        for (var i = 0; i < sectorList.length; i++) {
                            item = sectorList[i];
                            var idata = self._pie.data.data[i];
                            
                            list.push({
                                name: item.name,
                                index: item.index,
                                color: item.color,
                                r: item.r,
                                value: item.value,
                                percentage: item.percentage,
                                checked : idata.checked
                            });
                        }
                    }
                };
                return list;
            },
            getCheckedList : function(){
                var cl = [];
                _.each( this.getList() , function( item ){
                    if( item.checked ){
                        cl.push( item );
                    }
                } );
                return cl;
            },
            focusAt: function(index) {
                if (this._pie) {
                    this._pie.focus( index );
                }
            },
            unfocusAt: function(index) {
                if (this._pie) {
                    this._pie.unfocus( index );
                }
            },
            check: function(index) {
                if (this._pie) {
                    this._pie.check( index );
                }
            },
            uncheck: function(index) {
                if (this._pie) {
                    this._pie.uncheck( index );
                }
            },
            _initData: function(arr, opt) {
                var data = [];
                /*
                 * @释剑
                 * 用校正处理， 把pie的data入参规范和chartx数据格式一致
                 **/
                if (!this.xAxis.field) {
                    data = arr;
                } else {

                    var titles = arr.shift();
                    var xFieldInd = _.indexOf(titles, this.xAxis.field);
                    var yFieldInd = xFieldInd + 1;
                    if (yFieldInd >= titles.length) {
                        yFieldInd = 0;
                    };
                    if (this.yAxis.field) {
                        yFieldInd = _.indexOf(titles, this.yAxis.field);
                    };
                    _.each(arr, function(row) {
                        var rowData = [];
                        if (_.isArray(row)) {
                            rowData.push(row[xFieldInd]);
                            rowData.push(row[yFieldInd]);
                        } else if (typeof row == 'object') {
                            rowData.push(row['name']);
                            rowData.push(row['y']);
                        }
                        data.push(rowData);
                    });
                };

                //矫正结束                    
                var dataFrame = {};
                dataFrame.org = data;
                dataFrame.data = [];
                if (_.isArray(arr)) {
                    for (var i = 0; i < arr.length; i++) {
                        var obj = {};
                        if (_.isArray(arr[i])) {
                            obj.name = arr[i][0];
                            obj.y = parseFloat(arr[i][1]);
                            obj.sliced = false;
                            obj.selected = false;
                        } else if (typeof arr[i] == 'object') {
                            obj.name = arr[i].name;
                            obj.y = parseFloat(arr[i].y);
                            obj.sliced = arr[i].sliced || false;
                            obj.selected = arr[i].selected || false;
                        }

                        if (obj.name) dataFrame.data.push(obj);
                    }
                }
                if (data.length > 0 && opt.sort == 'asc' || opt.sort == 'desc') {
                    dataFrame.org.sort(function(a, b) {
                        if (opt.sort == 'desc') {
                            return a[1] - b[1];
                        } else if (opt.sort == 'asc') {
                            return b[1] - a[1];
                        }
                    });
                    dataFrame.data.sort(function(a, b) {
                        if (opt.sort == 'desc') {
                            return a.y - b.y;
                        } else if (opt.sort == 'asc') {
                            return b.y - a.y;
                        }
                    });
                }

                return dataFrame;

            },
            clear: function() {
                this.stageBg.removeAllChildren()
                this.core.removeAllChildren()
                this.stageTip.removeAllChildren();
            },
            reset: function(data, opt) {
                this.clear()
                this.width = parseInt(this.element.width());
                this.height = parseInt(this.element.height());
                this.draw(data, opt)
            },
            _initModule: function() {
                var self = this;
                var w = self.width;
                var h = self.height;

                var r = Math.min(w, h) * 2 / 3 / 2;
                if (self.dataLabel && self.dataLabel.enabled == false) {
                    r = Math.min(w, h) / 2;
                    //要预留clickMoveDis位置来hover sector 的时候外扩
                    r -= r / 11;
                }

                var r0 = parseInt(self.innerRadius || 0);
                var maxInnerRadius = r * 2 / 3;
                r0 = r0 >= 0 ? r0 : 0;
                r0 = r0 <= maxInnerRadius ? r0 : maxInnerRadius;
                var pieX = w / 2;
                var pieY = h / 2;
                self.pie = {
                    x: pieX,
                    y: pieY,
                    r0: r0,
                    r: r,
                    boundWidth: w,
                    boundHeight: h,
                    data: self.dataFrame,
                    //dataLabel: self.dataLabel, 
                    animation: self.animation,
                    startAngle: parseInt(self.startAngle),
                    colors: self.colors,
                    focusCallback: {
                        focus: function(e, index) {
                            self.fire('focus', e);
                        },
                        unfocus: function(e, index) {
                            self.fire('unfocus', e);
                        }
                    }
                };

                if (self.dataLabel) {
                    self.pie.dataLabel = self.dataLabel;
                };

                self._pie = new Pie(self.pie, self.tips, self.canvax.getDomContainer());

                self._pie.sprite.on("mousedown mousemove mouseup click" , function(e){
                    self.fire( e.type , e );
                });
            },
            _startDraw: function() {
                this._pie.draw(this);
            },
            _drawEnd: function() {
                this.core.addChild(this._pie.sprite);
                if (this._tip) this.stageTip.addChild(this._tip.sprite);
                this.fire('complete', {
                    data: this.getList()
                });
            }
        });
    });