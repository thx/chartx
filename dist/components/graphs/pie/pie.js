"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _canvax = _interopRequireDefault(require("canvax"));

//单环pie
var _ = _canvax["default"]._,
    event = _canvax["default"].event;
var Sector = _canvax["default"].Shapes.Sector;
var Path = _canvax["default"].Shapes.Path;
var Text = _canvax["default"].Display.Text;
var AnimationFrame = _canvax["default"].AnimationFrame;

var Pie =
/*#__PURE__*/
function (_event$Dispatcher) {
  (0, _inherits2["default"])(Pie, _event$Dispatcher);

  function Pie(_graphs, data) {
    var _this;

    (0, _classCallCheck2["default"])(this, Pie);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Pie).call(this));
    _this.width = 0;
    _this.height = 0;
    _this.origin = {
      x: 0,
      y: 0
    }; //这个pie所属的graphs对象

    _this._graphs = _graphs;
    _this.domContainer = _graphs.app.canvax.domView;
    _this.data = data;
    _this.sprite = null;
    _this.textSp = null;
    _this.sectorsSp = null;
    _this.selectedSp = null;

    _this.init();

    _this.sectors = [];
    _this.textMaxCount = 15;
    _this.textList = [];
    _this.completed = false; //首次加载动画是否完成

    return _this;
  }

  (0, _createClass2["default"])(Pie, [{
    key: "init",
    value: function init() {
      this.sprite = new _canvax["default"].Display.Sprite();
      this.sectorsSp = new _canvax["default"].Display.Sprite();
      this.sprite.addChild(this.sectorsSp);
      this.selectedSp = new _canvax["default"].Display.Sprite();
      this.sprite.addChild(this.selectedSp);

      if (this._graphs.label.enabled) {
        this.textSp = new _canvax["default"].Display.Sprite();
      }

      ;
    }
  }, {
    key: "draw",
    value: function draw(opt) {
      var me = this;

      _.extend(true, this, opt);

      this.sprite.context.x = me.origin.x;
      this.sprite.context.y = me.origin.y;

      me._widget();
    }
  }, {
    key: "resetData",
    value: function resetData(data) {
      var me = this;
      this.data = data;
      me.destroyLabel();
      var completedNum = 0;

      for (var i = 0; i < me.sectors.length; i++) {
        var sec = me.sectors[i];
        var secData = this.data.list[i];
        sec.animate({
          r: secData.outRadius,
          startAngle: secData.startAngle,
          endAngle: secData.endAngle
        }, {
          duration: 280,
          onComplete: function onComplete() {
            completedNum++;

            if (completedNum == me.sectors.length) {
              if (me._graphs.label.enabled) {
                me._startWidgetLabel();
              }

              ;
            }
          }
        });
      }
    }
  }, {
    key: "_widget",
    value: function _widget() {
      var me = this;
      var list = me.data.list;
      var total = me.data.total; //let moreSecData;

      if (list.length > 0 && total > 0) {
        me.textSp && me.sprite.addChild(me.textSp);

        for (var i = 0; i < list.length; i++) {
          var item = list[i];
          debugger; //扇形主体          

          var sector = new Sector({
            hoverClone: false,
            xyToInt: false,
            //扇形不需要自动取整
            context: {
              x: item.focused ? item.outOffsetx : 0,
              y: item.focused ? item.outOffsety : 0,
              r0: item.innerRadius,
              r: item.outRadius,
              startAngle: item.startAngle,
              endAngle: item.endAngle,
              fillStyle: item.fillStyle,
              //iNode: item.iNode,
              cursor: "pointer"
            },
            id: 'sector' + i
          });
          sector.nodeData = item;
          item.focusEnabled && sector.hover(function () {
            me.focusOf(this.nodeData);
          }, function () {
            !this.nodeData.selected && me.unfocusOf(this.nodeData);
          }); //触发注册的事件

          sector.on(event.types.get(), function (e) {
            //me.fire( e.type, e );
            e.eventInfo = {
              trigger: me._graphs.node,
              nodes: [this.nodeData]
            }; //图表触发，用来处理Tips

            me._graphs.app.fire(e.type, e);
          });
          me.sectorsSp.addChildAt(sector, 0);
          me.sectors.push(sector);
        }

        ;

        if (me._graphs.label.enabled) {
          me._startWidgetLabel();
        }

        ;
      }
    }
  }, {
    key: "focusOf",
    value: function focusOf(node, callback) {
      if (node.focused) return;
      var me = this;
      var sec = me.sectors[node.iNode];
      sec.animate({
        x: node.outOffsetx,
        y: node.outOffsety
      }, {
        duration: 100,
        onComplete: function onComplete() {
          callback && callback();
        }
      });
      node.focused = true;
    }
  }, {
    key: "unfocusOf",
    value: function unfocusOf(node, callback) {
      if (!node.focused) return;
      var me = this;
      var sec = me.sectors[node.iNode];
      sec.animate({
        x: 0,
        y: 0
      }, {
        duration: 100,
        onComplete: function onComplete() {
          callback && callback();
        }
      });
      node.focused = false;
    }
  }, {
    key: "selectOf",
    value: function selectOf(node) {
      var me = this;

      if (!this.sectors.length || !node.selectEnabled) {
        return;
      }

      ;
      var sec = this.sectors[node.iNode];

      if (node.selected) {
        return;
      }

      ;

      if (!node.focused) {
        node._focusTigger = "select";
        this.focusOf(node, function () {
          me.addCheckedSec(sec);
        });
      } else {
        this.addCheckedSec(sec);
      }

      ;
      node.selected = true;
    }
  }, {
    key: "unselectOf",
    value: function unselectOf(node) {
      var sec = this.sectors[node.iNode];

      if (!node.selected || !node.selectEnabled) {
        return;
      }

      ;
      var me = this;
      me.cancelCheckedSec(sec, function () {
        if (node._focusTigger == "select") {
          me.unfocusOf(node);
        }

        ;
      });
      node.selected = false;
    }
  }, {
    key: "addCheckedSec",
    value: function addCheckedSec(sec, callback) {
      var secc = sec.context;
      var nodeData = sec.nodeData;
      if (!secc) return;
      var sector = new Sector({
        xyToInt: false,
        context: {
          x: secc.x,
          y: secc.y,
          r0: secc.r - 1,
          r: secc.r + nodeData.selectedR,
          startAngle: secc.startAngle,
          endAngle: secc.startAngle,
          //secc.endAngle,
          fillStyle: secc.fillStyle,
          globalAlpha: nodeData.selectedAlpha
        },
        id: 'selected_' + sec.id
      });
      sec._selectedSec = sector;
      this.selectedSp.addChild(sector);

      if (this.completed) {
        sector.animate({
          endAngle: secc.endAngle
        }, {
          duration: this._getAngleTime(secc),
          onComplete: function onComplete() {
            callback && callback();
          }
        });
      } else {
        sector.context.endAngle = secc.endAngle;
      }
    }
  }, {
    key: "cancelCheckedSec",
    value: function cancelCheckedSec(sec, callback) {
      var selectedSec = sec._selectedSec;
      selectedSec.animate({
        startAngle: selectedSec.context.endAngle - 0.5
      }, {
        duration: this._getAngleTime(sec.context),
        onComplete: function onComplete() {
          delete sec._selectedSec;
          selectedSec.destroy();
          callback && callback();
        }
      });
    }
  }, {
    key: "_getAngleTime",
    value: function _getAngleTime(secc) {
      return Math.abs(secc.startAngle - secc.endAngle) / 360 * 500;
    }
  }, {
    key: "grow",
    value: function grow(callback) {
      var me = this;

      _.each(me.sectors, function (sec) {
        if (sec.context) {
          sec.context.r0 = 0;
          sec.context.r = 0;
          sec.context.startAngle = me._graphs.startAngle;
          sec.context.endAngle = me._graphs.startAngle;
        }
      });

      me._hideGrowLabel();

      var _tween = AnimationFrame.registTween({
        from: {
          process: 0
        },
        to: {
          process: 1
        },
        duration: 500,
        onUpdate: function onUpdate(status) {
          for (var i = 0; i < me.sectors.length; i++) {
            var sec = me.sectors[i];
            var nodeData = sec.nodeData;
            var secc = sec.context;
            var _startAngle = nodeData.startAngle;
            var _endAngle = nodeData.endAngle;
            var _r = nodeData.outRadius;
            var _r0 = nodeData.innerRadius;

            if (secc) {
              secc.r = _r * status.process;
              secc.r0 = _r0 * status.process;

              if (i == 0) {
                secc.startAngle = _startAngle;
                secc.endAngle = _startAngle + (_endAngle - _startAngle) * status.process;
              } else {
                var lastEndAngle = function (iNode) {
                  var lastIndex = iNode - 1;
                  var lastSecc = me.sectors[lastIndex].context;

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
                secc.endAngle = secc.startAngle + (_endAngle - _startAngle) * status.process;
              } //如果已经被选中，有一个选中态


              if (sec._selectedSec) {
                sec._selectedSec.context.r0 = secc.r - 1;
                sec._selectedSec.context.r = secc.r + nodeData.selectedR;
                sec._selectedSec.context.startAngle = secc.startAngle;
                sec._selectedSec.context.endAngle = secc.endAngle;
              }
            }
          }
        },
        onComplete: function onComplete() {
          //把下面me.sprite._tweens.push( _tween );的 动画实例删除
          me.sprite._removeTween(_tween);

          me._showGrowLabel();

          me.completed = true;
          callback && callback();
        }
      });

      me.sprite._tweens.push(_tween);
    }
  }, {
    key: "_widgetLabel",
    value: function _widgetLabel(quadrant, indexs, lmin, rmin, isEnd, ySpaceInfo) {
      var me = this;
      var count = 0;
      var data = me.data.list;
      var minTxtDis = 15;
      var textOffsetX = 5;
      var currentIndex;
      var preY, currentY, adjustX, txtDis, bwidth, bheight, bx, by;
      var yBound, remainingNum, remainingY;
      var clockwise = quadrant == 2 || quadrant == 4;
      var isleft = quadrant == 2 || quadrant == 3;
      var isup = quadrant == 3 || quadrant == 4;
      var minY = isleft ? lmin : rmin; //text的绘制顺序做修正，text的Y值在饼图上半部分（isup）时，Y值越小的先画，反之Y值在饼图下部分时，Y值越大的先画.

      if (indexs.length > 0) {
        indexs.sort(function (a, b) {
          return isup ? data[a].edgey - data[b].edgey : data[b].edgey - data[a].edgey;
        });
      }

      for (var i = 0; i < indexs.length; i++) {
        currentIndex = indexs[i];
        var itemData = data[currentIndex];
        var outCircleRadius = itemData.outRadius + itemData.moveDis; //若Y值小于最小值，不画text    

        if (!itemData.enabled || itemData.y < minY || count >= me.textMaxCount) continue;
        count++;
        currentY = itemData.edgey;
        adjustX = Math.abs(itemData.edgex);
        txtDis = currentY - preY;

        if (i != 0 && (Math.abs(txtDis) < minTxtDis || isup && txtDis < 0 || !isup && txtDis > 0)) {
          currentY = isup ? preY + minTxtDis : preY - minTxtDis;

          if (outCircleRadius - Math.abs(currentY) > 0) {
            adjustX = Math.sqrt(Math.pow(outCircleRadius, 2) - Math.pow(currentY, 2));
          }

          if (isleft && -adjustX > itemData.edgex || !isleft && adjustX < itemData.edgex) {
            adjustX = Math.abs(itemData.edgex);
          }
        }

        if (isEnd) {
          yBound = isleft ? ySpaceInfo.left : ySpaceInfo.right;
          remainingNum = indexs.length - i;
          remainingY = isup ? yBound - remainingNum * minTxtDis : yBound + remainingNum * minTxtDis;

          if (isup && currentY > remainingY || !isup && currentY < remainingY) {
            currentY = remainingY;
          }
        }

        preY = currentY;

        if (!isEnd) {
          if (isleft) {
            ySpaceInfo.left = preY;
          } else {
            ySpaceInfo.right = preY;
          }
        }

        ;
        var currentX = isleft ? -adjustX - textOffsetX : adjustX + textOffsetX;
        var globalX = currentX + me.origin.x;
        var globalY = currentY + me.origin.y;

        if (globalX > me._graphs.app.width || globalY < 0 || globalY > me._graphs.app.height) {
          return;
        }

        ;
        var pathStr = "M" + itemData.centerx + "," + itemData.centery;
        pathStr += "Q" + itemData.outx + "," + itemData.outy + "," + currentX + "," + currentY;
        var path = new Path({
          context: {
            lineType: 'solid',
            path: pathStr,
            lineWidth: 1,
            strokeStyle: itemData.fillStyle
          }
        });
        var textTxt = itemData.labelText;
        var textEle = void 0;

        if (me.domContainer) {
          textEle = document.createElement("div");
          textEle.style.cssText = " ;position:absolute;left:-1000px;top:-1000px;color:" + itemData.fillStyle + "";
          textEle.innerHTML = textTxt;
          me.domContainer.appendChild(textEle);
          bwidth = textEle.offsetWidth;
          bheight = textEle.offsetHeight;
        } else {
          //小程序等版本里面没有domContainer， 需要直接用cavnas绘制
          textEle = new Text(textTxt, {
            context: {
              fillStyle: itemData.fillStyle
            }
          });
          me.textSp.addChild(textEle);
          bwidth = Math.ceil(textEle.getTextWidth());
          bheight = Math.ceil(textEle.getTextHeight());
        }

        bx = isleft ? -adjustX : adjustX;
        by = currentY;

        switch (quadrant) {
          case 1:
            bx += textOffsetX;
            by -= bheight / 2;
            break;

          case 2:
            bx -= bwidth + textOffsetX;
            by -= bheight / 2;
            break;

          case 3:
            bx -= bwidth + textOffsetX;
            by -= bheight / 2;
            break;

          case 4:
            bx += textOffsetX;
            by -= bheight / 2;
            break;
        }

        ; //如果是dom 的话就会有style属性

        if (textEle.style) {
          textEle.style.left = bx + me.origin.x + "px";
          textEle.style.top = by + me.origin.y + "px";
        } else if (textEle.context) {
          textEle.context.x = bx;
          textEle.context.y = by;
        }

        ;
        me.textSp.addChild(path);
        me.textList.push({
          width: bwidth,
          height: bheight,
          x: bx + me.origin.x,
          y: by + me.origin.y,
          data: itemData,
          textTxt: textTxt,
          textEle: textEle
        });
      }
    }
  }, {
    key: "_startWidgetLabel",
    value: function _startWidgetLabel() {
      var me = this;
      var data = me.data.list;
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
      }]; //默认从top开始画

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
      };

      for (var i = 0; i < data.length; i++) {
        var cur = data[i].quadrant;
        quadrantInfo[cur - 1].indexs.push(i);
        quadrantInfo[cur - 1].count++;
      } //1,3象限的绘制顺序需要反转


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

      if (widgetInfo.right.indexs.length > me.textMaxCount) {
        sortedIndexs = widgetInfo.right.indexs.slice(0);
        sortedIndexs.sort(function (a, b) {
          return data[b].y - data[a].y;
        });
        overflowIndexs = sortedIndexs.slice(me.textMaxCount);
        rMinPercentage = data[overflowIndexs[0]].percentage;
        rMinY = data[overflowIndexs[0]].y;
      }

      if (widgetInfo.left.indexs.length > me.textMaxCount) {
        sortedIndexs = widgetInfo.left.indexs.slice(0);
        sortedIndexs.sort(function (a, b) {
          return data[b].y - data[a].y;
        });
        overflowIndexs = sortedIndexs.slice(me.textMaxCount);
        lMinPercentage = data[overflowIndexs[0]].percentage;
        lMinY = data[overflowIndexs[0]].y;
      }

      quadrantsOrder.push(widgetInfo.right.startQuadrant);
      quadrantsOrder.push(widgetInfo.right.endQuadrant);
      quadrantsOrder.push(widgetInfo.left.startQuadrant);
      quadrantsOrder.push(widgetInfo.left.endQuadrant);
      var ySpaceInfo = {};

      for (var _i = 0; _i < quadrantsOrder.length; _i++) {
        var isEnd = _i == 1 || _i == 3;

        me._widgetLabel(quadrantsOrder[_i], quadrantInfo[quadrantsOrder[_i] - 1].indexs, lMinY, rMinY, isEnd, ySpaceInfo);
      }
    }
  }, {
    key: "destroyLabel",
    value: function destroyLabel() {
      var me = this;

      if (this.textSp) {
        this.textSp.removeAllChildren();
      }

      ;

      _.each(this.textList, function (lab) {
        if (me.domContainer) {
          me.domContainer.removeChild(lab.textEle);
        }
      });

      this.textList = [];
    }
  }, {
    key: "_showGrowLabel",
    value: function _showGrowLabel() {
      if (this.textSp && this.textSp.context) {
        this.textSp.context.globalAlpha = 1;

        _.each(this.textList, function (lab) {
          if (lab.textEle.style) {
            lab.textEle.style.visibility = "visible";
          }
        });
      }
    }
  }, {
    key: "_hideGrowLabel",
    value: function _hideGrowLabel() {
      if (this.textSp && this.textSp.context) {
        this.textSp.context.globalAlpha = 0;

        _.each(this.textList, function (lab) {
          if (lab.textEle.style) {
            lab.textEle.style.visibility = "hidden";
          }
        });
      }
    }
  }]);
  return Pie;
}(event.Dispatcher);

exports["default"] = Pie;