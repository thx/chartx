KISSY.add("dvix/components/pie/Pie", function (S, Canvax, Sector, Line, Rect, Tools, Tween) {
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
      self.labelFontSize = 12 * self.pie.boundWidth / 800;
      var data = self.data.data;
      var clickMoveDis = self.pie.r / 8;

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
              var endAngle = self.currentAngle + angle;
              var cosV = Math.cos((self.currentAngle + angle / 2) / 180 * Math.PI);
              var sinV = Math.sin((self.currentAngle + angle / 2) / 180 * Math.PI);
              var midAngle = self.currentAngle + (endAngle - self.currentAngle) / 2;

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
                outx: clickMoveDis * cosV,
                outy: clickMoveDis * sinV,
                centerx: (self.pie.r - clickMoveDis) * cosV,
                centery: (self.pie.r - clickMoveDis) * sinV,
                edgex: (self.pie.r + 2 * clickMoveDis) * cosV,
                edgey: (self.pie.r + 2 * clickMoveDis) * sinV,
                percentage: (percentage * 100).toFixed(1),
                txt: (percentage * 100).toFixed(1) + '%',
                quadrant: quadrant,
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
    getColorByIndex: function (colors, index) {
      if (index >= colors.length) {
        index = index % colors.length;
      }
      return colors[index];
    },
    _configColors: function () {
      var defaultColors = ['#95CEFF', '#434348', '#90ED7D', '#F7A35C', '#8085E9', '#F15C80', '#E4D354', '#8085E8', '#8D4653', '#91E8E1'];
      this.colors = this.colors ? this.colors : defaultColors;
    },
    draw: function (opt) {
      var self = this;
      self.setX(self.pie.x);
      self.setY(self.pie.y);
      self._widget();
      //this.sprite.context.globalAlpha = 0;      
      if (opt.animation) {
        S.each(self.sectors, function (sec, index) {
          sec.context.r0 = 0;
          sec.context.r = 0;
          sec.context.startAngle = 0;
          sec.context.endAngle = 0;
        })
        self._hideDataLabel();
        self.grow();
      }
    },
    grow: function () {
      var self = this;
      var timer = null;
      var growAnima = function () {
        var pieOpen = new Tween.Tween({ process: 0, r: 0, r0: 0 })
               .to({ process: 1, r: self.pie.r, r0: self.pie.r0 }, 800)
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
      this.branchSp.context.globalAlpha = 1;
      this.branchTxtSp.context.globalAlpha = 1;
    },
    _hideDataLabel: function () {
      this.branchSp.context.globalAlpha = 0;
      this.branchTxtSp.context.globalAlpha = 0;
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
    _widget: function () {
      var self = this;
      var data = self.data.data;
      if (data.length > 0 && self.total > 0) {

        self.branchSp && self.sprite.addChild(self.branchSp);
        self.branchTxtSp && self.sprite.addChild(self.branchTxtSp);

        for (var i = 0; i < data.length; i++) {
          if (self.colorIndex >= self.colors.length) self.colorIndex = 0;
          var fillColor = self.getColorByIndex(self.colors, i);

          if (self.dataLabel.enabled) {
            //指示线
            var branchLine = new Line({
              context: {
                xStart: data[i].centerx,
                yStart: data[i].centery,
                xEnd: data[i].edgex,
                yEnd: data[i].edgey,
                lineWidth: 1,
                strokeStyle: fillColor,
                lineType: 'solid'
              }
            });
            //指示文字            
            var branchTxt = new Canvax.Display.Text(data[i].name + ' : ' + data[i].txt, {
              context: {
                x: data[i].edgex,
                y: data[i].edgey,
                //fillStyle: fillColor,
                //strokeStyle: fillColor,              
                fontSize: self.labelFontSize,
                fontWeight: 'normal'
              }
            });
            var bwidth = branchTxt.getTextWidth();
            var bheight = branchTxt.getTextHeight();
            var bx = data[i].edgex;
            var by = data[i].edgey;
            var txtOffsetX = 2;

            switch (data[i].quadrant) {
              case 1:
                bx += txtOffsetX;
                by -= bheight / 2;
                break;
              case 2:
                bx -= (bwidth + txtOffsetX);
                by -= bheight / 2;
                break;
              case 3:
                bx -= (bwidth + txtOffsetX);
                by -= bheight / 2;
                break;
              case 4:
                bx += txtOffsetX;
                by -= bheight / 2;
                break;
            }
            branchTxt.context.x = bx;
            branchTxt.context.y = by;
            self.branchSp.addChild(branchLine);
            self.branchTxtSp.addChild(branchTxt);
          }

          //扇形主体
          var sector = new Sector({
            context: {
              x: data[i].selected ? data[i].outx : 0,
              y: data[i].selected ? data[i].outy : 0,
              //x: i == 1 ? data[i].outx : 0,
              //y: i == 1 ? data[i].outy :0,
              //shadowColor: "black",
              //shadowOffsetX: 0,
              //shadowOffsetY: 0,
              //shadowBlur: 5,
              r0: self.pie.r0,
              r: self.pie.r,
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
            if (!self.isMoving) {
              //this.context.shadowBlur = 20;
              var target = e.target;
              var globalPoint = target.localToGlobal(e.point);
              self._redrawTip(this);
              self._moveTip(globalPoint);
              self._showTip();
            }
          }, function () {
            if (!self.isMoving) {
              //this.context.shadowBlur = 5;
              self._hideTip();
            }
            //if (!self.isMoving) this.context.strokeStyle = self.getColorByIndex(self.colors, this.__colorIndex);
          })
          sector.on('mousemove', function (e) {
            var target = e.target;
            var globalPoint = target.localToGlobal(e.point);
            self._moveTip(globalPoint);
          })

          sector.on('click', function () {
            var clickSec = this;
            self.allowPointSelect && S.each(self.sectors, function (sec) {
              sec = sec.sector;
              if (sec.__dataIndex == clickSec.__dataIndex && !sec.__isSelected) {
                sec.context.x += data[sec.__dataIndex].outx;
                sec.context.y += data[sec.__dataIndex].outy;
                sec.__isSelected = true;
              }
              else if (sec.__isSelected) {
                sec.context.x -= data[sec.__dataIndex].outx;
                sec.context.y -= data[sec.__dataIndex].outy;
                sec.__isSelected = false;
              }
            })
          })
          self.sprite.addChild(sector);

          self.sectors.push({
            sector: sector,
            context: sector.context,
            r: self.pie.r,
            startAngle: sector.context.startAngle,
            endAngle: sector.context.endAngle,
            color: fillColor
          });
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
        "canvax/shape/Rect",
        "dvix/utils/tools",
        "canvax/animation/Tween",
        "dvix/utils/deep-extend"
    ]
})
