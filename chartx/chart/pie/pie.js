define(
        "chartx/chart/pie/pie",
        [
        "canvax/index",
        "canvax/shape/Sector",
        "canvax/shape/Line",
        "canvax/shape/BrokenLine",
        "canvax/shape/Rect",
        "chartx/utils/tools",
        "canvax/animation/Tween",
        "chartx/components/tips/tip"
        ],
        function (Canvax, Sector, Line, BrokenLine, Rect, Tools, Tween, Tip) {
            var Pie = function (opt, tipsOpt, domContainer) {
                this.data = null;
                this.sprite = null;
                this.branchSp = null;
                this.branchTxtSp = null;

                this.dataLabel = {
                    enabled: true
                };

                this.tips = _.deepExtend({ enabled: true }, tipsOpt); //tip的confit
                this.domContainer = domContainer;
                this._tip = null; //tip的对象 tip的config 放到graphs的config中传递过来

                this.init(opt);
                this.colorIndex = 0;
                this.sectors = [];
                this.sectorMap = [];
                this.isMoving = false;

            };

            Pie.prototype = {
                init: function (opt) {
                    _.deepExtend(this, opt);
                    this.sprite = new Canvax.Display.Sprite();

                    this._tip = new Tip(this.tips, this.domContainer);
                    this._tip._getDefaultContent = this._getTipDefaultContent;
                    this.sprite.addChild(this._tip.sprite);

                    if (this.dataLabel.enabled) {
                        this.branchSp = new Canvax.Display.Sprite();
                        this.branchTxtSp = new Canvax.Display.Sprite();
                    }
                    this._configData();
                    this._configColors();
                },
                setX: function ($n) {
                    this.sprite.context.x = $n
                },
                setY: function ($n) {
                    this.sprite.context.y = $n
                },
                //配置数据
                _configData: function () {
                    var self = this;
                    self.total = 0;
                    self.currentAngle = 0;
                    var adjustFontSize = 12 * self.boundWidth / 1000;
                    self.labelFontSize = adjustFontSize < 12 ? 12 : adjustFontSize;

                    var data = self.data.data;
                    self.clickMoveDis = self.r / 11;
                    if (data.length && data.length > 0) {

                        for (var i = 0; i < data.length; i++) {
                            self.total += data[i].y;
                        }
                        if (self.total > 0) {
                            var maxIndex = 0;
                            for (var j = 0; j < data.length; j++) {
                                if (j > 0 && percentage * 100 > data[maxIndex].percentage) {
                                    maxIndex = j;
                                }
                                var percentage = data[j].y / self.total;
                                var angle = 360 * percentage;
                                var endAngle = self.currentAngle + angle > 360 ? 360 : self.currentAngle + angle;
                                var cosV = Math.cos((self.currentAngle + angle / 2) / 180 * Math.PI);
                                var sinV = Math.sin((self.currentAngle + angle / 2) / 180 * Math.PI);
                                var midAngle = self.currentAngle + angle / 2;
                                cosV = cosV.toFixed(5);
                                sinV = sinV.toFixed(5);
                                var quadrant = function (ang) {
                                    if (ang > 360) {
                                        ang = 360;
                                    }
                                    if (0 <= ang && ang <= 90) {
                                        return 1;
                                    }
                                    else if (90 < ang && ang <= 180) {
                                        return 2;
                                    }
                                    else if (180 < ang && ang <= 270) {
                                        return 3;
                                    }
                                    else if (270 < ang && ang <= 360) {
                                        return 4;
                                    }
                                } (midAngle);
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
                                    percentage: (percentage * 100).toFixed(1),
                                    txt: (percentage * 100).toFixed(1) + '%',
                                    quadrant: quadrant,
                                    labelDirection: quadrant == 1 || quadrant == 4 ? 1 : 0,
                                    index: j,
                                    isMax: false
                                })

                                self.currentAngle += angle;
                                if (self.currentAngle > 360) self.currentAngle = 360;
                            }
                            data[maxIndex].isMax = true;
                        }
                    }
                },
                getList: function () {
                    var self = this;
                    var list = [];
                    if (self.sectors && self.sectors.length > 0) {
                        list = self.sectors;
                    }
                    return list;
                },
                showHideSector: function (index) {
                    var self = this;
                    var sectorMap = self.sectorMap;
                    if (sectorMap[index]) {
                        if (sectorMap[index].visible) {
                            self._hideSector(index);
                        }
                        else {
                            self._showSector(index);
                        }
                    }
                },
                slice: function (index) {
                    var self = this;
                    var sectorMap = self.sectorMap;
                    if (sectorMap[index] && !self.isMoving) {
                        self.moveSector(sectorMap[index].sector);
                    }
                },
                getTopAndBottomIndex: function () {
                    var me = this;
                    var data = self.data;
                    var indexs = {};
                    var topBase = 270;
                    var bottomBase = 90;
                    var preTopDis = 90, preBottomDis = 90, currentTopDis, currentBottomDis;
                    if (data.length > 0) {
                        _.each(self.data, function () {
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
                getColorByIndex: function (colors, index) {
                    if (index >= colors.length) {
                        //若数据条数刚好比颜色数组长度大1,会导致最后一个扇形颜色与第一个颜色重复
                        if ((this.data.data.length - 1) % colors.length == 0 && (index % colors.length == 0)) {
                            index = index % colors.length + 1;
                        }
                        else {
                            index = index % colors.length;
                        }
                    }
                    return colors[index];
                },
                _configColors: function () {
                    var defaultColors = ['#f05836','#7270b1','#359cde','#4fd2c4','#f4c646','#999','#FF7D00', '#516DCC', '#8ACC5F', '#A262CB', '#FFD202', '#CC3E3C', '#00A5FF', '#009964', '#CCB375', '#694C99'];
                    this.colors = this.colors ? this.colors : defaultColors;
                },
                draw: function (opt) {
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
                moveSector: function (clickSec) {
                    if (!clickSec) return;
                    var self = this;
                    var data = self.data.data;
                    var moveTimer = null;
                    var move = new Tween.Tween({ percent: 0 })
                        .to({ percent: 1 }, 100)
                        .easing(Tween.Easing.Quadratic.InOut)
                        .onUpdate(function () {
                            var me = this;
                            _.each(self.sectors, function (sec) {
                                if (sec.context) {
                                    if (sec.index == clickSec.__dataIndex && !sec.sector.__isSelected) {
                                        sec.context.x = data[sec.sector.__dataIndex].outOffsetx * me.percent;
                                        sec.context.y = data[sec.sector.__dataIndex].outOffsety * me.percent;
                                    }
                                    else if (sec.sector.__isSelected) {
                                        sec.context.x = data[sec.sector.__dataIndex].outOffsetx * (1 - me.percent);
                                        sec.context.y = data[sec.sector.__dataIndex].outOffsety * (1 - me.percent);
                                    }
                                }
                            })
                        })
                    .onComplete(function () {
                        cancelAnimationFrame(moveTimer);
                        _.each(self.sectors, function (sec) {
                            if (sec.sector) {
                                sec = sec.sector;
                                if (sec.__dataIndex == clickSec.__dataIndex && !sec.__isSelected) {
                                    sec.__isSelected = true;
                                }
                                else if (sec.__isSelected) {
                                    sec.__isSelected = false;
                                }
                            }
                        })
                        self.isMoving = false;
                    })
                    .start();
                    function moveAni() {
                        moveTimer = requestAnimationFrame(moveAni);
                        Tween.update();
                    }
                    self.isMoving = true;
                    moveAni();
                },
                grow: function () {
                    var self = this;
                    var timer = null;
                    _.each(self.sectors, function (sec, index) {
                        if (sec.context) {
                            sec.context.r0 = 0;
                            sec.context.r = 0;
                            sec.context.startAngle = 0;
                            sec.context.endAngle = 0;
                        }
                    })
                    self._hideDataLabel();
                    var growAnima = function () {
                        var pieOpen = new Tween.Tween({ process: 0, r: 0, r0: 0 })
                            .to({ process: 1, r: self.r, r0: self.r0 }, 800)
                            .onUpdate(function () {
                                var me = this;
                                for (var i = 0; i < self.sectors.length; i++) {
                                    if (self.sectors[i].context) {
                                        self.sectors[i].context.r = me.r;
                                        self.sectors[i].context.r0 = me.r0;
                                        self.sectors[i].context.globalAlpha = me.process;
                                        if (i == 0) {
                                            self.sectors[i].context.startAngle = self.sectors[i].startAngle;
                                            self.sectors[i].context.endAngle = self.sectors[i].endAngle * me.process;
                                        }
                                        else {
                                            var lastEndAngle = function (index) {
                                                var lastIndex = index - 1;
                                                if (lastIndex == 0) {
                                                    return self.sectors[lastIndex].context ? self.sectors[lastIndex].context.endAngle : 0;
                                                }
                                                if (self.sectors[lastIndex].context) {
                                                    return self.sectors[lastIndex].context.endAngle;
                                                }
                                                else {
                                                    return arguments.callee(lastIndex);
                                                }
                                            } (i);
                                            self.sectors[i].context.startAngle = lastEndAngle;
                                            self.sectors[i].context.endAngle = self.sectors[i].context.startAngle + (self.sectors[i].endAngle - self.sectors[i].startAngle) * me.process;
                                        }
                                    }
                                }
                            }).onComplete(function () {
                                cancelAnimationFrame(timer);
                                self.isMoving = false;
                                self._showDataLabel();
                            }).start();
                        animate();
                    };
                    function animate() {
                        timer = requestAnimationFrame(animate);
                        Tween.update();
                    };
                    self.isMoving = true;
                    growAnima();
                },
                _showDataLabel: function () {
                    if (this.branchSp && this.branchTxtSp) {
                        this.branchSp.context.globalAlpha = 1;
                        this.branchTxtSp.context.globalAlpha = 1;
                    }
                },
                _hideDataLabel: function () {
                    if (this.branchSp && this.branchTxtSp) {
                        this.branchSp.context.globalAlpha = 0;
                        this.branchTxtSp.context.globalAlpha = 0;
                    }
                },
                _showTip: function (e, ind) {
                    this._tip.show(this._getTipsInfo(e, ind));
                },
                _hideTip: function (e) {
                    this._tip.hide(e);
                },
                _moveTip: function (e, ind) {
                    this._tip.move(this._getTipsInfo(e, ind))
                },
                _getTipDefaultContent: function (info) {
                    return "<div style='color:" + info.fillStyle + "'><div style='padding-bottom:3px;'>" + info.name + "：" + info.value + "</div>" + parseInt(info.percentage) + "%</div>";
                },
                _getTipsInfo: function (e, ind) {
                    var data = this.data.data[ind];

                    var fillColor = this.getColorByIndex(this.colors, ind);

                    e.tipsInfo = {
                        iNode: ind,
                        name: data.name,
                        percentage: data.percentage,
                        value: data.y,
                        fillStyle: fillColor,
                        data: this.data.org[ind]
                    };
                    return e;
                },
                _hideSector: function (index) {
                    if (this.sectorMap[index]) {
                        this.sectorMap[index].context.visible = false;
                        this.sectorMap[index].visible = false;
                        this._hideLabel(index);
                    }
                },
                _showSector: function (index) {
                    if (this.sectorMap[index]) {
                        this.sectorMap[index].context.visible = true;
                        this.sectorMap[index].visible = true;
                        this._showLabel(index);
                    }
                },
                _sectorFocus: function (e , index) {
                    if (this.sectorMap[index]) {
                        if (this.focusCallback && e) {
                            this.focusCallback.focus(e , index);
                        }
                    }
                },
                _sectorUnfocus: function (e , index) {
                    if (this.focusCallback && e) {
                        this.focusCallback.unfocus(e , index);
                    }
                },
                _sectorClick : function(e , index){
                    if (this.sectorMap[index]) {
                        if (this.clickCallback) {
                            this.clickCallback(e , index );
                        }
                    }
                },
                _getByIndex: function (index) {
                    return this.sectorMap[index];
                },
                _widgetLabel: function (quadrant, indexs, lmin, rmin) {
                    var self = this;
                    var data = self.data.data;
                    var sectorMap = self.sectorMap;
                    var minTxtDis = 20;
                    var labelOffsetX = 5;
                    var outCircleRadius = self.r + 2 * self.clickMoveDis;
                    var currentIndex, baseY, clockwise, isleft, minPercent;
                    var currentY, adjustX, txtDis, bkLineStartPoint, bklineMidPoint, bklineEndPoint, branchLine, brokenline, branchTxt, bwidth, bheight, bx, by;

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
                        bkLineStartPoint = [data[currentIndex].outx, data[currentIndex].outy];
                        bklineMidPoint = [isleft ? -adjustX : adjustX, currentY];
                        bklineEndPoint = [isleft ? -adjustX - labelOffsetX : adjustX + labelOffsetX, currentY];
                        baseY = currentY;
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
                        })
                        //指示文字
                        var labelTxt = '';
                        var formatReg = /\{.+?\}/g;
                        var point = data[currentIndex];
                        if (self.dataLabel.format) {
                            labelTxt = self.dataLabel.format.replace(formatReg, function (match, index) {
                                var matchStr = match.replace(/\{([\s\S]+?)\}/g, '$1');
                                var vals = matchStr.split('.');
                                var obj = eval(vals[0]);
                                var pro = vals[1];
                                return obj[pro];
                            });
                        }
                        else {
                            labelTxt = data[currentIndex].name + ' : ' + data[currentIndex].txt;
                        }
                        branchTxt = new Canvax.Display.Text(labelTxt, {
                            context: {
                                x: data[currentIndex].edgex,
                                y: data[currentIndex].edgey,
                                fontSize: self.labelFontSize,
                                fontWeight: 'normal',
                                fillStyle: sectorMap[currentIndex].color
                            }
                        });
                        bwidth = branchTxt.getTextWidth();
                        bheight = branchTxt.getTextHeight();
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
                        }
                        branchTxt.context.x = bx;
                        branchTxt.context.y = by;
                        self.branchSp.addChild(branchLine);
                        self.branchSp.addChild(brokenline);
                        self.branchTxtSp.addChild(branchTxt);
                        self.sectorMap[currentIndex].label = {
                            line1: branchLine,
                            line2: brokenline,
                            label: branchTxt
                        }
                    }
                },
                _hideLabel: function (index) {
                    if (this.sectorMap[index]) {
                        var label = this.sectorMap[index].label;
                        label.line1.context.visible = false;
                        label.line2.context.visible = false;
                        label.label.context.visible = false;
                    }
                },
                _showLabel: function (index) {
                    if (this.sectorMap[index]) {
                        var label = this.sectorMap[index].label;
                        label.line1.context.visible = true;
                        label.line2.context.visible = true;
                        label.label.context.visible = true;
                    }
                },
                _startWidgetLabel: function () {
                    var self = this;
                    var data = self.data.data;
                    var rMinPercentage = 0, lMinPercentage = 0;
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
                        sortedIndexs.sort(function (a, b) {
                            return data[b].percentage - data[a].percentage;
                        });
                        overflowIndexs = sortedIndexs.slice(15);
                        rMinPercentage = data[overflowIndexs[0]].percentage;
                    }
                    if (widgetInfo.left.indexs.length > 15) {
                        sortedIndexs = widgetInfo.left.indexs.slice(0);
                        sortedIndexs.sort(function (a, b) {
                            return data[b].percentage - data[a].percentage;
                        });
                        overflowIndexs = sortedIndexs.slice(15);
                        lMinPercentage = data[overflowIndexs[0]].percentage;
                    }

                    quadrantsOrder.push(widgetInfo.right.startQuadrant);
                    quadrantsOrder.push(widgetInfo.left.startQuadrant);
                    quadrantsOrder.push(widgetInfo.right.endQuadrant);
                    quadrantsOrder.push(widgetInfo.left.endQuadrant);

                    for (i = 0; i < quadrantsOrder.length; i++) {
                        self._widgetLabel(quadrantsOrder[i], quadrantInfo[quadrantsOrder[i] - 1].indexs, lMinPercentage, rMinPercentage)
                    }
                },
                _widget: function () {
                    var self = this;
                    var data = self.data.data;
                    var moreSecData;
                    if (data.length > 0 && self.total > 0) {
                        self.branchSp && self.sprite.addChild(self.branchSp);
                        self.branchTxtSp && self.sprite.addChild(self.branchTxtSp);
                        for (var i = 0; i < data.length; i++) {
                            if (self.colorIndex >= self.colors.length) self.colorIndex = 0;
                            var fillColor = self.getColorByIndex(self.colors, i);
                            if (data[i].end > data[i].start) {
                                //扇形主体          
                                var sector = new Sector({
                                    hoverClone: false,
                                    context: {
                                        x: data[i].selected ? data[i].outOffsetx : 0,
                                        y: data[i].selected ? data[i].outOffsety : 0,
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
                                sector.__isSelected = data[i].selected;
                                //扇形事件
                                sector.hover(function (e) {
                                    var me = this;
                                    //if (!self.isMoving) {
                                    if (self.tips.enabled) {
                                        self._showTip(e, this.__dataIndex);
                                    }
                                    self._sectorFocus( e , this.__dataIndex );
                                    //}
                                    self.allowPointSelect && self.moveSector(this);
                                }, function (e) {
                                    //if (!self.isMoving) {
                                    if (self.tips.enabled) {
                                        self._hideTip(e);
                                    }
                                    self._sectorUnfocus(e , this.__dataIndex);
                                    //}
                                    self.allowPointSelect && self.moveSector(this);
                                });
                                sector.on('mousemove', function (e) {
                                    if (self.tips.enabled) {
                                        self._moveTip(e, this.__dataIndex);
                                    }
                                });

                                sector.on('click' , function(e){
                                    self._sectorClick( e , this.__dataIndex );
                                });

                                self.sprite.addChild(sector);
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
                            }
                            else if (data[i].end == data[i].start) {
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
                }
            };

            return Pie;
        })

