//单环pie

import Canvax from "canvax2d"
import Tip from "../../components/tips/index"
import {colors as themeColors} from "../theme"
import _ from "underscore"

var Sector = Canvax.Shapes.Sector
var BrokenLine = Canvax.Shapes.BrokenLine
var Rect = Canvax.Shapes.Rect
var AnimationFrame = Canvax.AnimationFrame

export default class Pie
{
    constructor(opt, tipsOpt, domContainer)
    {
        this.data = null;
        this.sprite = null;
        this.branchSp = null;
        this.sectorsSp = null;
        this.checkedSp = null;
        this.branchTxt = null;

        this.dataLabel = {
            enabled: true,
            allowLine: true,
            format: null
        };

        this.checked = {
            enabled: false,
            r: 8,
            globalAlpha : 0.3
        }

        this.tips = _.deepExtend({
            enabled: true
        }, tipsOpt); //tip的confit
        this.domContainer = domContainer;
        this._tip = null; //tip的对象 tip的config 放到graphs的config中传递过来
        this.moveDis = undefined;

        this.init(opt);
        this.colorIndex = 0;
        this.sectors = [];
        this.sectorMap = [];
        this.isMoving = false;
        this.labelMaxCount = 15;
        this.labelList = [];
        this.completed = false;//首次加载动画是否完成
    }

    init(opt)
    {
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

        this.clear();
    }

    clear()
    {
        // this.domContainer.removeChildren()
        this.domContainer.innerHTML = ''
    }

    setX($n)
    {
        this.sprite.context.x = $n
    }

    setY($n)
    {
        this.sprite.context.y = $n
    }

    //配置数据
    _configData()
    {
        var self = this;
        self.total = 0;
        self.angleOffset = _.isNaN(self.startAngle) ? -90 : self.startAngle;
        self.angleOffset = self.angleOffset % 360;
        self.currentAngle = 0 + self.angleOffset;
        var limitAngle = 360 + self.angleOffset;
        var adjustFontSize = 12 * self.boundWidth / 1000;
        self.labelFontSize = adjustFontSize < 12 ? 12 : adjustFontSize;
        var percentFixedNum = 2;                
        var data = self.data ? self.data.data : [];
        if( self.moveDis === undefined ){
            self.moveDis = self.r / 11;
        }
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
                    var quadrant = function (ang) {
                        if (ang >= limitAngle) {
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
                    } (midAngle);
                    _.extend(data[j], {
                        start: self.currentAngle,
                        end: endAngle,
                        midAngle: midAngle,
                        outOffsetx: self.moveDis * cosV,
                        outOffsety: self.moveDis * sinV,
                        centerx: (self.r - self.moveDis) * cosV,
                        centery: (self.r - self.moveDis) * sinV,
                        outx: (self.r + self.moveDis) * cosV,
                        outy: (self.r + self.moveDis) * sinV,
                        edgex: (self.r + 2 * self.moveDis) * cosV,
                        edgey: (self.r + 2 * self.moveDis) * sinV,
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
                //总会有除不尽的情况（如1，1，1，每份都是33.33333...，没必要做修正）
                //var totalPercentOffset = (100 - totalFixedPercent).toFixed(percentFixedNum);
                //if (totalPercentOffset != 0) {
                //    data[maxPercentageOffsetIndex].percentage += +totalPercentOffset;
                //    data[maxPercentageOffsetIndex].percentage = parseFloat(data[maxPercentageOffsetIndex].percentage).toFixed(percentFixedNum);
                //    data[maxPercentageOffsetIndex].txt = parseFloat(data[maxPercentageOffsetIndex].percentage).toFixed(percentFixedNum) + '%';
                //};
            }
        }
    }

    getList()
    {
        var self = this;
        var list = [];
        if (self.sectors && self.sectors.length > 0) {
            list = self.sectors;
        };
        return list;
    }

    getLabelList()
    {
        return this.labelList;
    }

    getColorByIndex(colors, index)
    {
        if (index >= colors.length) {
            //若数据条数刚好比颜色数组长度大1,会导致最后一个扇形颜色与第一个颜色重复
            if ((this.data.data.length - 1) % colors.length == 0 && (index % colors.length == 0)) {
                index = index % colors.length + 1;
            } else {
                index = index % colors.length;
            }
        };
        return colors[index];
    }

    _configColors()
    {
        this.colors = this.colors ? this.colors : themeColors;
    }

    draw(opt)
    {
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
    }

    focus(index, callback)
    {
        var self = this;
        var sec = self.sectorMap[index].sector;
        var secData = self.data.data[index];
        secData._selected = true;
        sec.animate({
            x: secData.outOffsetx,
            y: secData.outOffsety
        }, {
            duration: 100,
            onComplete: function () {
                //secData.checked = true;
                callback && callback();
            }
        });
    }

    unfocus(index, callback) 
    {
        var self = this;
        var sec = self.sectorMap[index].sector;
        var secData = self.data.data[index];
        secData._selected = false;
        sec.animate({
            x: 0,
            y: 0
        }, {
            duration: 100,
            onComplete: function () {
                callback && callback();
                //secData.checked = false;
            }
        });
    }

    check(index)
    {
        var me = this;
        if( !this.sectorMap.length ){
            return;
        };
        var e = {};
        me._geteventInfo(e, index);
        me.checked.checkedBeforCallBack(e);
        if( e.eventInfo.iNode == -1 ){
                return;
        };

        var sec = this.sectorMap[index].sector;
        var secData = this.data.data[index];
        if (secData.checked) {
            return
        };
        
        if (!secData._selected) {
            this.focus(index, function () {
                me.addCheckedSec(sec);
            });
        } else {
            this.addCheckedSec(sec);
        };
        secData.checked = true;


        me.checked.checkedCallBack(e);
    }

    uncheck(index) 
    {
        var sec = this.sectorMap[index].sector;
        var secData = this.data.data[index];
        if (!secData.checked) {
            return
        };
        var me = this;
        me.cancelCheckedSec(sec, function () {
            me.unfocus(index);
        });
        secData.checked = false;
        
        var e = {};
        me._geteventInfo(e, index);
        me.checked.uncheckedCallBack(e);
    }

    uncheckAll() 
    {
        var me = this;
        _.each(this.sectorMap, function (sm, i) {
            var sec = sm.sector;
            var secData = me.data.data[i];
            if (secData.checked) {
                me.uncheck( i );
                //me.cancelCheckedSec(sec);
                //secData.checked = false;
            }
        });
    }

    grow() 
    {
        var self = this;
        var timer = null;
        _.each(self.sectors, function (sec, index) {
            if (sec.context) {
                sec.context.r0 = 0;
                sec.context.r = 0;
                sec.context.startAngle = self.angleOffset;
                sec.context.endAngle = self.angleOffset;
            }
        });

        self._hideGrowLabel();

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
            duration: 500,
            //easing: "Back.In",
            onUpdate: function () {
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
                            var lastEndAngle = function (index) {
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
                            } (i);
                            secc.startAngle = lastEndAngle;
                            secc.endAngle = secc.startAngle + (sec.endAngle - sec.startAngle) * this.process;
                        }

                        //如果已经被选中，有一个选中态
                        if(sec.sector._checkedSec){

                            /*
                            x: secc.x,
                            y: secc.y,
                            r0: secc.r,
                            r: secc.r + 8,
                            startAngle: secc.startAngle,
                            endAngle: secc.startAngle + 0.5, //secc.endAngle,
                            fillStyle: secc.fillStyle,
                            globalAlpha: 0.3
                            */
                            sec.sector._checkedSec.context.r0 = secc.r - 1;
                            sec.sector._checkedSec.context.r  = secc.r + self.checked.r;
                            sec.sector._checkedSec.context.startAngle = secc.startAngle;
                            sec.sector._checkedSec.context.endAngle = secc.endAngle;
                        }
                    }
                }
            },
            onComplete: function () {
                self._showGrowLabel();
                self.completed = true;
            }
        });
    }

    _showGrowLabel()
    {
        if (this.branchSp) {
            this.branchSp.context.globalAlpha = 1;
            _.each( this.branchSp.children, function(bl){
                bl.context.globalAlpha = 1;
            } );
            _.each(this.labelList, function (lab) {
                lab.labelEle.style.visibility = "visible"
            });
        }
    }

    _hideGrowLabel()
    {
        if (this.branchSp) {
            //this.branchSp.context.globalAlpha = 0;
            //TODO: 这里canvax有个bug，不能用上面的方法
            _.each( this.branchSp.children, function(bl){
                bl.context.globalAlpha = 0;
            } );
            _.each(this.labelList, function (lab) {
                lab.labelEle.style.visibility = "hidden"
            });
        }
    }

    _showTip(e, ind) 
    {
        this._tip.show(this._geteventInfo(e, ind));
    }

    _hideTip(e) 
    {
        this._tip.hide(e);
    }

    _moveTip(e, ind)
    {
        this._tip.move(this._geteventInfo(e, ind))
    }

    _getTipDefaultContent(info) 
    {
        return "<div style='color:" + info.fillStyle + ";border:none;white-space:nowrap;word-wrap:normal;'><div style='padding-bottom:3px;'>" + info.name + "：" + info.value + "</div>" + parseInt(info.percentage) + "%</div>";
    }

    _geteventInfo(e, ind) 
    {
        
        var data = this.data.data[ind];
        var fillColor = this.getColorByIndex(this.colors, ind);
        e.eventInfo = {
            iNode: ind,
            name: data.name,
            percentage: data.percentage,
            value: data.y,
            fillStyle: fillColor,
            data: this.data.data[ind],
            checked: data.checked
        };
        return e;
    }

    _sectorFocus(e, index) 
    {
        if (this.sectorMap[index]) {
            if (this.focusCallback && e) {
                this.focusCallback.focus(e, index);
            }
        }
    }

    _sectorUnfocus(e, index) 
    {
        if (this.focusCallback && e) {
            this.focusCallback.unfocus(e, index);
        }
    }

    _getByIndex(index) 
    {
        return this.sectorMap[index];
    }

    _widgetLabel(quadrant, indexs, lmin, rmin, isEnd, ySpaceInfo) 
    {
        var self = this;
        var count = 0;
        var data = self.data.data;
        var sectorMap = self.sectorMap;
        var minTxtDis = 15;
        var labelOffsetX = 5;
        var outCircleRadius = self.r + 2 * self.moveDis;
        var currentIndex, baseY, clockwise, isleft,isup,minY, minPercent;
        var currentY, adjustX, txtDis, bkLineStartPoint, bklineMidPoint, bklineEndPoint, brokenline, branchTxt, bwidth, bheight, bx, by;
        var isMixed, yBound, remainingNum, remainingY, adjustY;
        
        clockwise = quadrant == 2 || quadrant == 4;
        isleft = quadrant == 2 || quadrant == 3;
        isup = quadrant == 3 || quadrant == 4;
        minY = isleft ? lmin : rmin;

        //label的绘制顺序做修正，label的Y值在饼图上半部分（isup）时，Y值越小的先画，反之Y值在饼图下部分时，Y值越大的先画.
        if (indexs.length > 0) {
            indexs.sort(function (a, b) {
                return isup ? data[a].edgey - data[b].edgey : data[b].edgey - data[a].edgey;
            })
        }
        
        for (var i = 0; i < indexs.length; i++) {
            currentIndex = indexs[i];
            //若Y值小于最小值，不画label    
            if (data[currentIndex].ignored || data[currentIndex].y < minY || count >= self.labelMaxCount) continue
            count++;
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
            };


            //指示线
            brokenline = new BrokenLine({
                context: {
                    lineType: 'solid',
                    smooth: false,
                    pointList: [
                        [data[currentIndex].centerx , data[currentIndex].centery],
                        [data[currentIndex].outx , data[currentIndex].outy],
                        bkLineStartPoint, 
                        bklineMidPoint, 
                        bklineEndPoint
                    ],
                    lineWidth: 1,
                    strokeStyle: sectorMap[currentIndex].color
                }
            });
            window.bl = brokenline;
            //指示文字
            var labelTxt = '';
            var formatReg = /\{.+?\}/g;
            var point = data[currentIndex];
            if (self.dataLabel.format) {
                if (_.isFunction(self.dataLabel.format)) {
                    labelTxt = this.dataLabel.format(data[currentIndex]);
                } else {
                    labelTxt = self.dataLabel.format.replace(formatReg, function (match, index) {
                        var matchStr = match.replace(/\{([\s\S]+?)\}/g, '$1');
                        var vals = matchStr.split('.');
                        //var obj = eval(vals[0]);
                        var obj = (new Function('return ' + vals[0]))();
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

            this.branchTxt = branchTxt
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

            branchTxt.style.left = bx + self.x + "px";
            branchTxt.style.top = by + self.y + "px";

            if (self.dataLabel.allowLine) {
                self.branchSp.addChild(brokenline);
            };

            self.sectorMap[currentIndex].label = {
                line: brokenline,
                label: branchTxt,
                visible: true
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
    }

    _showLabelAll( ind )
    {
        var me = this;
        _.each(this.sectorMap , function( sec , i ){
            me._showLabel(i);
        });
    }

    _hideLabelAll( ind ) 
    {
        var me = this;
        _.each(this.sectorMap , function( sec , i ){
            me._hideLabel(i);
        });
    }

    _hideLabel(index) 
    {
        if (this.sectorMap[index]) {
            var label = this.sectorMap[index].label;
            label.line.context.visible = false;
            label.label.style.display = "none";
            label.visible = false;
        };
    }

    _showLabel(index) 
    {
        if (this.sectorMap[index]) {
            var label = this.sectorMap[index].label;
            label.line.context.visible = true;
            label.label.style.display = "block";
            label.visible = true;
        }
    }

    _startWidgetLabel()
    {
        var self = this;
        var data = self.data.data;
        var rMinPercentage = 0,
            lMinPercentage = 0,
            rMinY = 0,
            lMinY = 0;
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
        
        if (widgetInfo.right.indexs.length > self.labelMaxCount) {
            sortedIndexs = widgetInfo.right.indexs.slice(0);
            sortedIndexs.sort(function (a, b) {
                return data[b].y - data[a].y;
            });
            overflowIndexs = sortedIndexs.slice(self.labelMaxCount);
            rMinPercentage = data[overflowIndexs[0]].percentage;
            rMinY = data[overflowIndexs[0]].y;
        }
        if (widgetInfo.left.indexs.length > self.labelMaxCount) {
            sortedIndexs = widgetInfo.left.indexs.slice(0);
            sortedIndexs.sort(function (a, b) {
                return data[b].y - data[a].y;
            });
            overflowIndexs = sortedIndexs.slice(self.labelMaxCount);
            lMinPercentage = data[overflowIndexs[0]].percentage;
            lMinY = data[overflowIndexs[0]].y;
        }

        quadrantsOrder.push(widgetInfo.right.startQuadrant);
        quadrantsOrder.push(widgetInfo.right.endQuadrant);
        quadrantsOrder.push(widgetInfo.left.startQuadrant);
        quadrantsOrder.push(widgetInfo.left.endQuadrant);

        var ySpaceInfo = {}

        for (var i = 0; i < quadrantsOrder.length; i++) {
            var isEnd = i == 1 || i == 3;
            self._widgetLabel(quadrantsOrder[i], quadrantInfo[quadrantsOrder[i] - 1].indexs, lMinY, rMinY, isEnd, ySpaceInfo)
        }
    }

    _getAngleTime(secc)
    {
        return Math.abs(secc.startAngle - secc.endAngle) / 360 * 500
    }

    addCheckedSec(sec, callback) 
    {
        var secc = sec.context;
        var sector = new Sector({
            context: {
                x: secc.x,
                y: secc.y,
                r0: secc.r - 1,
                r: secc.r + this.checked.r,
                startAngle: secc.startAngle,
                endAngle: secc.startAngle, //secc.endAngle,
                fillStyle: secc.fillStyle,
                globalAlpha: this.checked.globalAlpha
            },
            id: 'checked_' + sec.id
        });
        sec._checkedSec = sector

        this.checkedSp.addChild(sector);

        if( this.completed ){
            sector.animate({
                endAngle: secc.endAngle
            }, {
                duration: this._getAngleTime(secc),
                onComplete: function () {
                    callback && callback();
                }
            });
        } else {
            sector.context.endAngle = secc.endAngle;
        }
    }

    cancelCheckedSec(sec, callback) 
    {
        //var checkedSec = this.checkedSp.getChildById('checked_' + sec.id);
        var checkedSec = sec._checkedSec;
        
        checkedSec.animate({
            //endAngle : checkedSec.context.startAngle+0.5
            startAngle: checkedSec.context.endAngle - 0.3
        }, {
            onComplete: function () {
                delete sec._checkedSec;
                checkedSec.destroy();
                callback && callback();
            },
            duration: 150
        });
    }

    _widget() 
    {
        var self = this;
        var data = self.data ? self.data.data : [];
        var moreSecData;
        if (data.length > 0 && self.total > 0) {
            self.branchSp && self.sprite.addChild(self.branchSp);
            for (var i = 0; i < data.length; i++) {
                if (self.colorIndex >= self.colors.length) self.colorIndex = 0;
                var fillColor = self.getColorByIndex(self.colors, i);
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
                self.event.enabled && sector.hover(function (e) {

                    var me = this;
                    if (self.tips.enabled) {
                        self._showTip(e, this.__dataIndex);
                    };
                    var secData = self.data.data[this.__dataIndex];
                    if (!secData.checked) {
                        self._sectorFocus(e, this.__dataIndex);
                        self.focus(this.__dataIndex);
                    }
                }, function (e) {
                
                    if (self.tips.enabled) {
                        self._hideTip(e);
                    };

                    //上面的_showTip会设置一下eventInfo，所以这里必须显式的调用下_geteventInfo来设置一下eventInfo
                    self._geteventInfo(e, this.__dataIndex);
                    var secData = self.data.data[this.__dataIndex];
                    if (!secData.checked) {
                        self._sectorUnfocus(e, this.__dataIndex);
                        self.unfocus(this.__dataIndex);
                    }
                });

                self.event.enabled && sector.on('mousedown mouseup click mousemove dblclick', function (e) {
                    self._geteventInfo(e, this.__dataIndex);
                    if (e.type == "click") {
                        self.secClick(this, e);
                    };
                    if (e.type == "mousemove") {
                        if (self.tips.enabled) {
                            self._moveTip(e, this.__dataIndex);
                        }
                    };
                });

                if (!data[i].ignored) {
                    self.sectorsSp.addChildAt(sector, 0);
                };

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

            if (self.sectors.length > 0) {
                //self.sectorMap = {};
                self.sectorMap = [];
                for (var i = 0; i < self.sectors.length; i++) {
                    self.sectorMap[self.sectors[i].index] = self.sectors[i];
                }
            }
            if (self.dataLabel.enabled) {
                self._startWidgetLabel();
            }
        }
    }

    secClick(sectorEl, e) 
    {
        if (!this.checked.enabled) return;
        
        this.checked.checkedBeforCallBack(e);
        if( e.eventInfo.iNode == -1 ){
                return;
        };

        var secData = this.data.data[sectorEl.__dataIndex];
        if (sectorEl.clickIng) {
            return;
        };
        sectorEl.clickIng = true;
        secData.checked = !secData.checked;
        e.eventInfo.checked = secData.checked;

        if (secData.checked) {
            this.addCheckedSec(sectorEl, function () {
                sectorEl.clickIng = false;
            });
            this.checked.checkedCallBack( e );
        } else {
            this.cancelCheckedSec(sectorEl, function () {
                sectorEl.clickIng = false;
            });
            this.checked.uncheckedCallBack( e );
        };
        
    }
}