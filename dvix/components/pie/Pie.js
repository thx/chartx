KISSY.add("dvix/components/pie/Pie", function (S, Canvax, Sector, Line, BrokenLine, Rect, Tools, Tween) {
  var Pie = function (opt, data) {
    this.data = data;
    this.sprite = null;
    this.branchSp = null;
    this.branchTxtSp = null;
    this.init(opt);
    this.colorIndex = 0;
    this.sectors = [];
    this.isMoving = false;
  };

  Pie.prototype = {
    init: function (opt) {
      _.deepExtend(this, opt);
      this.sprite = new Canvax.Display.Sprite();
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
      self.labelFontSize = 12 * self.boundWidth / 1000;
      var data = self.data.data;
      self.clickMoveDis = self.r / 8;
      if (data.length && data.length > 0) {
        if (data.length == 1) {
          S.mix(data[0], {
            start: 0,
            end: 360,
            percentage: 100,
            txt: 100 + '%',
            isMax: true
          })
        }
        else {
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

              var quadrant = function (ang) {
                if (0 <= ang && ang <= 90) {
                  return 1;
                }
                else if (90 < ang && ang <= 180) {
                  return 2;
                }
                else if (180 < ang && ang <= 270) {
                  return 3;
                }
                else if (270 < ang && ang < 360) {
                  return 4;
                }
              } (midAngle);

              S.mix(data[j], {
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
              self.currentAngle += angle
            }
            data[maxIndex].isMax = true;
          }
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
        S.each(self.data, function () {
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
      var defaultColors = ['#95CEFF', '#434348', '#90ED7D', '#F7A35C', '#8085E9', '#F15C80', '#E4D354', '#8085E8', '#8D4653', '#91E8E1'];
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
      var self = this;
      var data = self.data.data;
      var moveTimer = null;
      var move = new Tween.Tween({ percent: 0 })
      .to({ percent: 1 }, 200)
      .easing(Tween.Easing.Quadratic.InOut)
      .onUpdate(function () {
        var me = this;
        S.each(self.sectors, function (sec) {
          if (sec.sector.__dataIndex == clickSec.__dataIndex && !sec.sector.__isSelected) {
            sec.context.x = data[sec.sector.__dataIndex].outOffsetx * me.percent;
            sec.context.y = data[sec.sector.__dataIndex].outOffsety * me.percent;
          }
          else if (sec.sector.__isSelected) {
            sec.context.x = data[sec.sector.__dataIndex].outOffsetx * (1 - me.percent);
            sec.context.y = data[sec.sector.__dataIndex].outOffsety * (1 - me.percent);
          }
        })
      })
      .onComplete(function () {
        cancelAnimationFrame(moveTimer);
        S.each(self.sectors, function (sec) {
          sec = sec.sector;
          if (sec.__dataIndex == clickSec.__dataIndex && !sec.__isSelected) {
            sec.__isSelected = true;
          }
          else if (sec.__isSelected) {
            sec.__isSelected = false;
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
      S.each(self.sectors, function (sec, index) {
        sec.context.r0 = 0;
        sec.context.r = 0;
        sec.context.startAngle = 0;
        sec.context.endAngle = 0;
      })
      self._hideDataLabel();
      var growAnima = function () {
        var pieOpen = new Tween.Tween({ process: 0, r: 0, r0: 0 })
               .to({ process: 1, r: self.r, r0: self.r0 }, 800)
               .onUpdate(function () {
                 var me = this;
                 for (var i = 0; i < self.sectors.length; i++) {
                   self.sectors[i].context.r = me.r;
                   self.sectors[i].context.r0 = me.r0;
                   self.sectors[i].context.globalAlpha = me.process;
                   if (i == 0) {
                     self.sectors[i].context.startAngle = self.sectors[i].startAngle;
                     self.sectors[i].context.endAngle = self.sectors[i].endAngle * me.process;
                   }
                   else {
                     self.sectors[i].context.startAngle = self.sectors[i - 1].context.endAngle;
                     self.sectors[i].context.endAngle = self.sectors[i].context.startAngle + (self.sectors[i].endAngle - self.sectors[i].startAngle) * me.process;
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
    _showTip: function () {
      var self = this;
      if (self.tipCallback) {
        self.tipCallback.isshow(true);
      }
    },
    _hideTip: function () {
      var self = this;
      if (self.tipCallback) {
        self.tipCallback.isshow(false);
      }
    },
    _moveTip: function (pos) {
      var self = this;
      if (self.tipCallback) {
        self.tipCallback.position(pos);
      }
    },
    _redrawTip: function (opt) {
      var self = this;
      if (self.tipCallback) {
        self.tipCallback.update(opt);
      }
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
        if (data[currentIndex].percentage <= minPercent) continue
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
          //扇形主体          
          var sector = new Sector({
            context: {
              x: data[i].selected ? data[i].outOffsetx : 0,
              y: data[i].selected ? data[i].outOffsety : 0,
              //x: i == 1 ? data[i].outOffsetx : 0,
              //y: i == 1 ? data[i].outOffsety :0,
              //shadowColor: "black",
              //shadowOffsetX: 0,
              //shadowOffsetY: 0,
              //shadowBlur: 5,
              r0: self.r0,
              r: self.r,
              startAngle: data[i].start,
              endAngle: data[i].end,
              fillStyle: fillColor,
              index: data[i].index,
              lineWidth: self.strokeWidth,
              strokeStyle: '#fff'
              //clockwise: true
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
            if (!self.isMoving) {
              var target = e.target;
              var globalPoint = target.localToGlobal(e.point);
              self._redrawTip(me);
              self._moveTip(globalPoint);
              self._showTip();
            }
          }, function () {
            if (!self.isMoving) {
              self._hideTip();
            }
          })
          sector.on('mousemove', function (e) {
            var target = e.target;
            var globalPoint = target.localToGlobal(e.point);
            self._moveTip(globalPoint);
          })

          sector.on('click', function () {            
            var clickSec = this;
            if (!self.isMoving) {
              self.allowPointSelect && self.moveSector(clickSec);
            }
          })
          self.sprite.addChild(sector);
          moreSecData = {
            sector: sector,
            context: sector.context,
            originx: sector.context.x,
            originy: sector.context.y,
            r: self.r,
            startAngle: sector.context.startAngle,
            endAngle: sector.context.endAngle,
            color: fillColor,
            visible: true
          };
          self.sectors.push(moreSecData);
        }

        if (self.sectors.length > 0) {
          self.sectorMap = {};
          for (var i = 0; i < self.sectors.length; i++) {
            self.sectorMap[self.sectors[i].sector.__dataIndex] = self.sectors[i];
          }
        }
        if (self.dataLabel.enabled) {
          self._startWidgetLabel();
        }
      }
    }
  };

  return Pie;

}, {
  requires: [
        "canvax/",
        "canvax/shape/Sector",
        "canvax/shape/Line",
        "canvax/shape/BrokenLine",
        "canvax/shape/Rect",
        "dvix/utils/tools",
        "canvax/animation/Tween",
        "dvix/utils/deep-extend"
    ]
})
