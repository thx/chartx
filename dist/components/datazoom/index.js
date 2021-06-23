"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _component = _interopRequireDefault(require("../component"));

var _canvax = _interopRequireDefault(require("canvax"));

var _trigger = _interopRequireDefault(require("../trigger"));

var _tools = require("../../utils/tools");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var _ = _canvax["default"]._;
var Line = _canvax["default"].Shapes.Line;
var Rect = _canvax["default"].Shapes.Rect;
var Polygon = _canvax["default"].Shapes.Polygon;

var dataZoom = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(dataZoom, _Component);

  var _super = _createSuper(dataZoom);

  function dataZoom(opt, app) {
    var _this;

    (0, _classCallCheck2["default"])(this, dataZoom);
    _this = _super.call(this, opt, app);
    _this.name = "dataZoom";
    _this._cloneChart = null;
    _this.count = 1; //把w 均为为多少个区间， 同样多节点的line 和  bar， 这个count相差一

    _this.dataLen = 1; //总共有多少条数据 

    _this.axisLayoutType = null;

    _this.dragIng = function () {};

    _this.dragEnd = function () {};

    _this.disPart = {};
    _this._preRange = null;
    _this._btnLeft = null;
    _this._btnRight = null;
    _this._underline = null;
    _this.sprite = new _canvax["default"].Display.Sprite({
      id: "dataZoom",
      context: {
        x: _this.pos.x,
        y: _this.pos.y
      }
    });
    _this.sprite.noSkip = true;
    _this.dataZoomBg = new _canvax["default"].Display.Sprite({
      id: "dataZoomBg"
    });
    _this.dataZoomBtns = new _canvax["default"].Display.Sprite({
      id: "dataZoomBtns"
    });

    _this.sprite.addChild(_this.dataZoomBg);

    _this.sprite.addChild(_this.dataZoomBtns);

    app.stage.addChild(_this.sprite); //如果组件是布局在左右两侧位置的话，说明组件是竖立的，那么要把用户设置的width和height对调

    if (opt.position == 'left' || opt.position == 'right') {
      var _width = opt.width;
      var _height = opt.height;
      opt.height = _width;
      opt.width = _height;
      if (opt.width === undefined) delete opt.width;
      if (opt.height === undefined) delete opt.height;
    }

    ; //预设默认的opt.dataZoom

    _.extend(true, (0, _assertThisInitialized2["default"])(_this), (0, _tools.getDefaultProps)(dataZoom.defaultProps()), opt);

    if (!("margin" in opt)) {
      if (_this.position == 'bottom') {
        _this.margin.top = 10;
      }

      if (_this.position == 'top') {
        _this.margin.bottom = 10;
      }
    }

    _this.axis = null; //对应哪个轴

    _this.layout();

    return _this;
  } //datazoom begin


  (0, _createClass2["default"])(dataZoom, [{
    key: "layout",
    value: function layout() {
      var app = this.app;

      if (this.position == "bottom") {
        //目前dataZoom是固定在bottom位置的
        //_getDataZoomOpt中会矫正x
        this.pos.y = app.height - (this.height + app.padding.bottom + this.margin.bottom);
        app.padding.bottom += this.height + this.margin.top + this.margin.bottom;
      }

      ;

      if (this.position == "top") {
        this.pos.y = app.padding.top + this.margin.top;
        app.padding.top += this.height + this.margin.top + this.margin.bottom;
      }

      ;

      if (this.position == "left") {
        this.pos.x = -((this.width - this.height) / 2) + app.padding.left + this.margin.left;
        this.pos.y = app.height - app.padding.bottom - this.margin.bottom - this.width / 2 - this.height / 2; //因为是把组件 旋转了 90du，所以这个的width 要用height

        app.padding.left += this.height + this.margin.left + this.margin.right;
      }

      ;

      if (this.position == "right") {
        this.pos.x = -((this.width - this.height) / 2) + app.padding.left + this.margin.left;
        this.pos.y = app.height - app.padding.bottom - this.margin.bottom - this.width / 2 - this.height / 2; //因为是把组件 旋转了 90du，所以这个的width 要用height

        app.padding.right += this.height + this.margin.left + this.margin.right;
      }

      ;
    }
  }, {
    key: "_getCloneChart",
    value: function _getCloneChart() {
      var me = this;
      var app = this.app;

      var _coord = app.getCoord();

      var chartConstructor = app.constructor; //(barConstructor || Bar);

      var cloneEl = app.el.cloneNode();
      cloneEl.innerHTML = "";
      cloneEl.id = app.el.id + "_currclone";
      cloneEl.style.position = "absolute";
      cloneEl.style.width = this.width + "px";
      cloneEl.style.height = this.btnHeight + "px"; //app.el.offsetHeight + "px";

      cloneEl.style.top = "10000px";
      document.body.appendChild(cloneEl); //let opt = _.extend(true, {}, me._opt);
      //_.extend(true, opt, me.getCloneChart() );
      //clone的chart只需要coord 和 graphs 配置就可以了
      //因为画出来后也只需要拿graphs得sprite去贴图

      var graphsOpt = [];

      _.each(app.getComponents({
        name: 'graphs'
      }), function (_g) {
        var _field = _g.enabledField || _g.field;

        if (_.flatten([_field]).length) {
          var _opt = _.extend(true, {}, _g._opt);

          _opt.field = _field;
          var miniOpt = {};

          if (_g.type == "bar") {
            miniOpt = {
              node: {//fillStyle: "#ececec"
              }
            };

            if (me.graphStyle) {
              miniOpt.node.fillStyle = me.graphStyle;
            }

            ;
          }

          ;

          if (_g.type == "line") {
            miniOpt = {
              line: {
                lineWidth: 1 //strokeStyle: "#ececec"

              },
              node: {
                enabled: false
              },
              area: {//fillStyle: "#ececec"
              }
            };

            if (me.graphStyle) {
              miniOpt.line.strokeStyle = me.graphStyle;
              miniOpt.area.fillStyle = me.graphStyle;
            }

            ;
          }

          ;

          var _h = _coord.height || app.el.offsetHeight;

          var radiusScale = me.btnHeight / _h || 1;

          if (_g.type == "scat") {
            miniOpt = {
              node: {
                //fillStyle : "#ececec",
                radiusScale: radiusScale
              }
            };

            if (me.graphStyle) {//散点图用图形自己的颜色
              //miniOpt.node.fillStyle = me.graphStyle;
            }

            ;
          }

          ;
          graphsOpt.push(_.extend(true, _opt, miniOpt, {
            label: {
              enabled: false
            },
            animation: false
          }));
        }
      });

      var opt = {
        coord: app._opt.coord,
        graphs: graphsOpt
      };

      if (opt.coord.horizontal) {
        delete opt.coord.horizontal;
      }

      ;
      opt.coord.enabled = false;
      opt.coord.padding = 0;
      var thumbChart = new chartConstructor(cloneEl, app._data, opt, app.componentModules);
      thumbChart.draw();
      return {
        thumbChart: thumbChart,
        cloneEl: cloneEl
      };
    }
  }, {
    key: "_setDataZoomOpt",
    value: function _setDataZoomOpt() {
      var app = this.app;
      var coordSize = app.getComponent({
        name: 'coord'
      }).getSizeAndOrigin();
      var me = this;
      var defaultWidth = coordSize.width;

      if (this.position == 'left' || this.position == 'right') {
        defaultWidth = coordSize.height || 150;
      }

      ; //初始化 datazoom 模块

      _.extend(true, this, {
        width: this.width || parseInt(defaultWidth),
        pos: {
          x: this.pos.x || coordSize.origin.x
        },
        dragIng: function dragIng(range) {
          var trigger;

          if (me.axisLayoutType == 'proportion') {
            trigger = new _trigger["default"](me, {
              min: range.start,
              max: range.end
            });

            app.dataFrame.filters['datazoom' + me.__cid] = function (rowData) {
              //如果有用户自定义的
              if (me.dragIngDataFilter) {
                return me.dragIngDataFilter.apply(me, [rowData, range]);
              }

              var field = Array.isArray(me.axis.field) ? me.axis.field[0] : me.axis.field;
              var val = rowData[field];
              var min = Math.min.apply(Math, (0, _toConsumableArray2["default"])(me.axis.dataSection));
              var max = Math.max.apply(Math, (0, _toConsumableArray2["default"])(me.axis.dataSection));
              var width = me.width;
              var startVal = min + (max - min) * (range.start / width);
              var endVal = min + (max - min) * (range.end / width);
              return val >= startVal && val <= endVal;
            };
          } else {
            trigger = new _trigger["default"](me, {
              left: app.dataFrame.range.start - range.start,
              right: range.end - app.dataFrame.range.end
            });

            _.extend(app.dataFrame.range, range);
          }

          ;
          console.log(range); //不想要重新构造dataFrame，所以第一个参数为null

          app.resetData(null, trigger);
          app.fire("dataZoomDragIng");
        },
        dragEnd: function dragEnd() {
          app.updateChecked && app.updateChecked();
          app.fire("dataZoomDragEnd");
        }
      });
    } //datazoom end

  }, {
    key: "draw",
    value: function draw() {
      //设置一些opt，需要用到 coord 坐标系的一些size数据，只有draw的时候才有
      this._setDataZoomOpt();

      this._cloneChart = this._getCloneChart();

      var _coord = this._cloneChart.thumbChart.getComponent({
        name: 'coord'
      });

      var _xAxis = _coord._xAxis;
      this.axis = _xAxis;

      if (this.position == 'left') {
        this.axis = _coord._yAxisLeft;
      }

      ;

      if (this.position == 'right') {
        this.axis = _coord._yAxisRight;
      }

      ;
      this.axisLayoutType = this.axis.layoutType; //和line bar等得xAxis.layoutType 一一对应

      this._computeAttrs(); //这个组件可以在init的时候就绘制好


      this.widget();

      this._setLines(); //统一的也只有rect的选择区域， 才需要复制一份图形，作为datazoom的minimap


      this.setMiniGroupsMap();
      this.setPosition(); //如果是left right 两侧的话， 需要做下旋转

      if (this.position == 'left' || this.position == 'right') {
        var xAxisHeight = this.app.getComponent({
          name: 'coord'
        })._xAxis.height;

        this.sprite.context.rotation = -90;
        this.sprite.context.rotateOrigin = {
          x: this.width / 2,
          y: this.height / 2
        };
        this.sprite.context.y -= xAxisHeight;

        if (!this._opt.width) {
          this.sprite.context.y -= this.width / 2;
          this.sprite.context.x -= this.width / 2;
        }
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.sprite.destroy();
    }
  }, {
    key: "reset",
    value: function reset(opt) {
      !opt && (opt = {});
      var _preCount = this.count;
      var _preStart = this.range.start;
      var _preEnd = this.range.end;
      opt && _.extend(true, this, opt);
      this._cloneChart = this._getCloneChart(); //cloneChart;

      this._computeAttrs(opt);

      if (_preCount != this.count || opt.range && (opt.range.start != _preStart || opt.range.end != _preEnd)) {
        this.widget();

        this._setLines();
      }

      ;
      this.setMiniGroupsMap();
    } //计算属性

  }, {
    key: "_computeAttrs",
    value: function _computeAttrs() {
      var _cloneChart = this._cloneChart.thumbChart;
      this.dataLen = _cloneChart.dataFrame.length;

      switch (this.axisLayoutType) {
        case "rule":
          this.count = this.dataLen - 1;
          break;

        case "peak":
          this.count = this.dataLen;
          break;

        case "proportion":
          this.count = this.width;
          break;
      }

      ;

      if (!this._opt.range || this._opt.range && !this._opt.range.max || this.range.max > this.count) {
        this.range.max = this.count - 1;
      }

      ;

      if (!this._opt.range || this._opt.range && !this._opt.range.end || this.range.end > this.dataLen - 1) {
        this.range.end = this.dataLen - 1;

        if (this.axisLayoutType == "proportion") {
          this.range.end = this.count - 1;
        }

        ;
      }

      ; //left right 两个拖拽块之间的距离边界

      this.disPart = this._getDisPart();
      this.btnHeight = this.height - this.btnOut;
    }
  }, {
    key: "_getDisPart",
    value: function _getDisPart() {
      var me = this;
      var min = Math.max(parseInt(me.range.min / 2 / me.count * me.width), 23);
      var max = parseInt((me.range.max + 1) / me.count * me.width); //柱状图用得这种x轴布局，不需要 /2

      if (this.axisLayoutType == "peak") {
        min = Math.max(parseInt(me.range.min / me.count * me.width), 23);
      }

      ;

      if (this.axisLayoutType == "proportion") {
        //min = min;
        max = me.width;
      }

      ;
      return {
        min: min,
        max: max
      };
    }
  }, {
    key: "_getRangeEnd",
    value: function _getRangeEnd(end) {
      if (end === undefined) {
        end = this.range.end;
      }

      if (this.axisLayoutType == "peak") {
        end += 1;
      }

      if (this.axisLayoutType == "proportion") {
        end += 1;
      }

      return end;
    }
  }, {
    key: "widget",
    value: function widget() {
      var me = this;

      var setLines = function setLines() {
        me._setLines.apply(me, arguments);
      };

      if (me.bg.enabled) {
        var bgFillStyle = me.bg.fillStyle;

        if (bgFillStyle && bgFillStyle.lineargradient && bgFillStyle.lineargradient.length) {
          var _style = me.ctx.createLinearGradient(0, me.btnHeight, me.width, me.btnHeight);

          _.each(bgFillStyle.lineargradient, function (item) {
            _style.addColorStop(item.position, item.color);
          });

          bgFillStyle = _style;
        }

        ;

        if (!bgFillStyle && me.shapeType == 'triangle') {
          bgFillStyle = '#e6e6e6';
        }

        ;
        var bgRectCtx = {
          x: 0,
          y: 0,
          width: me.width,
          height: me.btnHeight,
          lineWidth: me.bg.lineWidth,
          strokeStyle: me.bg.strokeStyle,
          fillStyle: bgFillStyle,
          fillAlpha: me.bg.glpha
        };
        var _bgTriangleCtx = {
          x: 0,
          y: 0,
          pointList: [[0, me.btnHeight], [me.width, me.btnHeight], [me.width, 0]],
          lineWidth: me.bg.lineWidth,
          strokeStyle: me.bg.strokeStyle,
          fillStyle: bgFillStyle,
          globalAlpha: me.bg.glpha
        };

        if (me._bgElement) {
          me._bgElement.animate(bgRectCtx, {
            onUpdate: setLines
          });
        } else {
          if (me.shapeType == 'rect') {
            me._bgElement = new Rect({
              context: bgRectCtx
            });
          } else {
            me._bgElement = new Polygon({
              context: _bgTriangleCtx
            });
          }

          ;
          me.dataZoomBg.addChild(me._bgElement);
        }
      }

      if (me.underline.enabled) {
        var underlineCtx = {
          start: {
            x: me.range.start / me.count * me.width + me.btnWidth / 2,
            y: me.btnHeight
          },
          end: {
            x: me._getRangeEnd() / me.count * me.width - me.btnWidth / 2,
            y: me.btnHeight
          },
          lineWidth: me.underline.lineWidth,
          strokeStyle: me.underline.strokeStyle || me.color
        };

        if (me._underline) {
          me._underline.animate(underlineCtx, {
            onUpdate: setLines
          });
        } else {
          me._underline = me._addLine(underlineCtx);
          me.dataZoomBg.addChild(me._underline);
        }

        ;
      }

      var btnLeftCtx = {
        x: me.range.start / me.count * me.width,
        y: -me.btnOut / 2 + 1,
        width: me.btnWidth,
        height: me.btnHeight + me.btnOut,
        fillStyle: me.left.fillStyle || me.color,
        cursor: me.left.eventEnabled && "move"
      };

      if (me._btnLeft) {
        me._btnLeft.animate(btnLeftCtx, {
          onUpdate: setLines
        });
      } else {
        me._btnLeft = new Rect({
          id: 'btnLeft',
          dragEnabled: me.left.eventEnabled,
          hoverClone: false,
          context: btnLeftCtx
        });

        me._btnLeft.on("draging", function () {
          this.context.y = -me.btnOut / 2 + 1;

          if (this.context.x < 0) {
            this.context.x = 0;
          }

          ;

          if (this.context.x > me._btnRight.context.x - me.btnWidth) {
            this.context.x = me._btnRight.context.x - me.btnWidth;
          }

          ;

          if (me._btnRight.context.x + me.btnWidth - this.context.x > me.disPart.max) {
            this.context.x = me._btnRight.context.x + me.btnWidth - me.disPart.max - 1;
          }

          if (me._btnRight.context.x + me.btnWidth - this.context.x < me.disPart.min) {
            this.context.x = me._btnRight.context.x + me.btnWidth - me.disPart.min;
          }

          if (me.shapeType == 'rect') {
            me._rangeElement.context.width = me._btnRight.context.x - this.context.x - me.btnWidth;
            me._rangeElement.context.x = this.context.x + me.btnWidth;
          }

          if (me.shapeType == 'triangle') {
            me._rangeElement.context.pointList = me._getRangeTrianglePoints();
          }

          me._setRange();
        });

        me._btnLeft.on("dragend", function () {
          me.dragEnd(me.range);
        });

        this.dataZoomBtns.addChild(this._btnLeft);
      }

      ;
      var btnRightCtx = {
        x: me._getRangeEnd() / me.count * me.width - me.btnWidth + 1,
        y: -me.btnOut / 2 + 1,
        width: me.btnWidth,
        height: me.btnHeight + me.btnOut,
        fillStyle: me.right.fillStyle || me.color,
        cursor: me.right.eventEnabled && "move"
      };

      if (me._btnRight) {
        me._btnRight.animate(btnRightCtx, {
          onUpdate: setLines
        });
      } else {
        me._btnRight = new Rect({
          id: 'btnRight',
          dragEnabled: me.right.eventEnabled,
          hoverClone: false,
          context: btnRightCtx
        });

        me._btnRight.on("draging", function () {
          this.context.y = -me.btnOut / 2 + 1;

          if (this.context.x > me.width - me.btnWidth) {
            this.context.x = me.width - me.btnWidth + 1;
          }

          ;

          if (this.context.x + me.btnWidth - me._btnLeft.context.x > me.disPart.max) {
            this.context.x = me.disPart.max - (me.btnWidth - me._btnLeft.context.x) + 1;
          }

          ;

          if (this.context.x + me.btnWidth - me._btnLeft.context.x < me.disPart.min) {
            this.context.x = me.disPart.min - me.btnWidth + me._btnLeft.context.x;
          }

          ;

          if (me.shapeType == 'rect') {
            me._rangeElement.context.width = this.context.x - me._btnLeft.context.x - me.btnWidth;
            me._rangeElement.context.x = me._btnLeft.context.x + me.btnWidth;
          }

          ;

          if (me.shapeType == 'triangle') {
            me._rangeElement.context.pointList = me._getRangeTrianglePoints();
          }

          ;

          me._setRange();
        });

        me._btnRight.on("dragend", function () {
          me.dragEnd(me.range);
        });

        this.dataZoomBtns.addChild(this._btnRight);
      }

      ;
      var rangeWidth = btnRightCtx.x - btnLeftCtx.x + me.btnWidth;
      var rangeHeight = this.btnHeight - 1;
      var rangeX = btnLeftCtx.x;
      var rangeY = 1;
      var rangeFillStyle = me.range.fillStyle;

      if (rangeFillStyle && rangeFillStyle.lineargradient && rangeFillStyle.lineargradient.length) {
        var _style2 = me.ctx.createLinearGradient(0, me.btnHeight, me.width, me.btnHeight);

        _.each(rangeFillStyle.lineargradient, function (item) {
          _style2.addColorStop(item.position, item.color);
        });

        rangeFillStyle = _style2;
      }

      ;
      var rangeRectCtx = {
        x: rangeX,
        y: rangeY,
        width: rangeWidth,
        height: rangeHeight,
        fillStyle: rangeFillStyle,
        fillAlpha: me.range.alpha,
        cursor: "move"
      };
      var bgTriangleCtx = {
        x: rangeX,
        y: rangeY,
        pointList: me._getRangeTrianglePoints(),
        fillStyle: rangeFillStyle,
        fillAlpha: me.range.alpha,
        cursor: "move"
      };

      if (this._rangeElement) {
        this._rangeElement.animate(rangeRectCtx, {
          onUpdate: setLines
        });
      } else {
        //中间矩形拖拽区域
        if (this.shapeType == 'rect') {
          this._rangeElement = new Rect({
            id: 'btnRange',
            dragEnabled: true,
            hoverClone: false,
            context: rangeRectCtx
          });

          this._rangeElement.on("draging", function () {
            this.context.y = 1;

            if (this.context.x < 0) {
              this.context.x = 0;
            }

            ;

            if (this.context.x > me.width - this.context.width) {
              this.context.x = me.width - this.context.width;
            }

            ;
            me._btnLeft.context.x = this.context.x;
            me._btnRight.context.x = this.context.x + this.context.width - me.btnWidth;

            me._setRange("btnRange");
          });

          this._rangeElement.on("dragend", function () {
            me.dragEnd(me.range);
          });
        } else {
          this._rangeElement = new Polygon({
            id: 'btnRange',
            //dragEnabled : true,
            //hoverClone  : false,
            context: bgTriangleCtx
          }); //三角形的 zoom 暂时不需要添加事件
        }

        ; //addChild到1 ， 因为0的bg

        this.dataZoomBtns.addChild(this._rangeElement, 0);
      }

      ;

      if (!this.linesLeft) {
        this.linesLeft = new _canvax["default"].Display.Sprite({
          id: "linesLeft"
        });

        if (this.left.eventEnabled) {
          this._addLines({
            sprite: this.linesLeft
          });
        }

        ;
        this.dataZoomBtns.addChild(this.linesLeft);
      }

      ;

      if (!this.linesRight) {
        this.linesRight = new _canvax["default"].Display.Sprite({
          id: "linesRight"
        });

        if (this.right.eventEnabled) {
          this._addLines({
            sprite: this.linesRight
          });
        }

        ;
        this.dataZoomBtns.addChild(this.linesRight);
      }

      ;

      if (!this.linesCenter && this.shapeType == 'rect') {
        this.linesCenter = new _canvax["default"].Display.Sprite({
          id: "linesCenter"
        });

        this._addLines({
          count: 3,
          //dis    : 1,
          sprite: this.linesCenter,
          strokeStyle: this.color
        });

        this.dataZoomBtns.addChild(this.linesCenter);
      }

      ;
    }
  }, {
    key: "_getRangeTrianglePoints",
    value: function _getRangeTrianglePoints() {
      var btnLeftCtx = this._btnLeft.context;
      var btnRightCtx = this._btnRight.context;
      var rangeX = btnLeftCtx.x;
      var rangeWidth = btnRightCtx.x - btnLeftCtx.x + this.btnWidth;
      var rangeHeight = this.btnHeight - 1;
      var bgWidth = this.width;
      return [[rangeX, rangeHeight], [rangeX + rangeWidth, rangeHeight], [rangeX + rangeWidth, rangeHeight * (1 - (rangeX + rangeWidth) / bgWidth)], [rangeX, rangeHeight * (1 - rangeX / bgWidth)]];
    }
  }, {
    key: "_setRange",
    value: function _setRange(trigger) {
      var me = this;

      var _end = me._getRangeEnd();

      var _preDis = _end - me.range.start;

      var start = me._btnLeft.context.x / me.width * me.count;
      var end = (me._btnRight.context.x + me.btnWidth) / me.width * me.count; //console.log( (me._btnRight.context.x + me.btnWidth)+"|"+ me.width + "|" + me.count )

      if (this.axisLayoutType == "peak") {
        start = Math.round(start);
        end = Math.round(end);
      } else if (this.axisLayoutType == "rule") {
        start = parseInt(start);
        end = parseInt(end);
      } else {
        start = parseInt(start);
        end = parseInt(end);
        ;
      }

      ;

      if (trigger == "btnRange") {
        //如果是拖动中间部分，那么要保持 end-start的总量一致
        if (end - start != _preDis) {
          end = start + _preDis;
        }
      }

      ;

      if (start != me.range.start || end != _end) {
        me.range.start = start;

        if (me.axisLayoutType == "peak") {
          end -= 1;
        }

        ;
        me.range.end = end;
        me.dragIng(me.range);
      }

      ;

      me._setLines();
    }
  }, {
    key: "_setRange_bak",
    value: function _setRange_bak(trigger) {
      var me = this;

      var _start = me._preRange ? me._preRange.start : 0;

      var _end = me._preRange ? me._preRange.end : 0;

      var _preDis = me._preRange ? _end - me._preRange.start : 0;

      var start = me._btnLeft.context.x / me.width * me.count;
      var end = (me._btnRight.context.x + me.btnWidth) / me.width * me.count; //console.log( (me._btnRight.context.x + me.btnWidth)+"|"+ me.width + "|" + me.count )

      if (this.axisLayoutType == "peak") {
        start = Math.round(start);
        end = Math.round(end);
      } else if (this.axisLayoutType == "rule") {
        start = parseInt(start);
        end = parseInt(end);
      } else {
        start = parseInt(start);
        end = parseInt(end);
        ;
      }

      ;

      if (trigger == "btnRange") {
        //如果是拖动中间部分，那么要保持 end-start的总量一致
        if (me._preRange && end - start != _preDis) {
          end = start + _preDis;
        }
      }

      ;

      if (!me._preRange || start != _start || end != _end) {
        me.range.start = start;

        if (me.axisLayoutType == "peak") {
          end -= 1;
        }

        ;
        me.range.end = end;
        me.dragIng(me.range);
        me._preRange = Object.assign({}, me.range);
      }

      ;

      me._setLines();
    }
  }, {
    key: "_setLines",
    value: function _setLines() {
      var me = this;
      var linesLeft = this.linesLeft;
      var linesRight = this.linesRight;
      var btnLeft = this._btnLeft;
      var btnRight = this._btnRight;
      linesLeft.context.x = btnLeft.context.x + (btnLeft.context.width - linesLeft.context.width) / 2;
      linesLeft.context.y = btnLeft.context.y + (btnLeft.context.height - linesLeft.context.height) / 2;
      linesRight.context.x = btnRight.context.x + (btnRight.context.width - linesRight.context.width) / 2;
      linesRight.context.y = btnRight.context.y + (btnRight.context.height - linesRight.context.height) / 2; //矩形的选择框才有必要放中间的标示线

      if (me.shapeType == 'rect') {
        var linesCenter = this.linesCenter;
        var btnRange = this._rangeElement;
        linesCenter.context.x = btnRange.context.x + (btnRange.context.width - linesCenter.context.width) / 2;
        linesCenter.context.y = btnRange.context.y + (btnRange.context.height - linesCenter.context.height) / 2;
      }

      if (me.underline.enabled) {
        me._underline.context.start.x = linesLeft.context.x + me.btnWidth / 2;
        me._underline.context.end.x = linesRight.context.x + me.btnWidth / 2;
      }
    }
  }, {
    key: "_addLines",
    value: function _addLines($o) {
      var me = this;
      var count = $o.count || 2;
      var sprite = $o.sprite;
      var dis = $o.dis || 2;
      var a;

      for (a = 0; a < count; a++) {
        sprite.addChild(me._addLine({
          x: a * dis,
          strokeStyle: $o.strokeStyle || ''
        }));
      }

      sprite.context.width = a * dis - 1;
      sprite.context.height = 6;
    }
  }, {
    key: "_addLine",
    value: function _addLine($o) {
      var o = $o || {};
      var line = new Line({
        id: o.id || '',
        context: {
          x: o.x || 0,
          y: o.y || 0,
          start: {
            x: o.start ? o.start.x : 0,
            y: o.start ? o.start.y : 0
          },
          end: {
            x: o.end ? o.end.x : 0,
            y: o.end ? o.end.y : 6
          },
          lineWidth: o.lineWidth || 1,
          strokeStyle: o.strokeStyle || '#ffffff'
        }
      });
      return line;
    }
  }, {
    key: "setMiniGroupsMap",
    value: function setMiniGroupsMap() {
      if (this.shapeType == 'triangle') {
        return;
      }

      ; //这里不是直接获取_graphs.sprite 而是获取 _graphs.core，切记切记

      if (this.__graphssp) {
        this.__graphssp.destroy();
      }

      ;
      var graphssp = this._cloneChart.thumbChart.graphsSprite;
      graphssp.setEventEnable(false);

      var _coor = this._cloneChart.thumbChart.getComponent({
        name: 'coord'
      });

      graphssp.id = graphssp.id + "_datazoomthumbChartbg";
      graphssp.context.x = -_coor.origin.x; //0;
      //缩放到横条范围内

      graphssp.context.scaleY = this.btnHeight / _coor.height;
      graphssp.context.scaleX = this.width / _coor.width;
      graphssp.context.globalAlpha = this.graphAlpha;
      this.dataZoomBg.addChild(graphssp, 0);
      this.__graphssp = graphssp;

      this._cloneChart.thumbChart.destroy();

      this._cloneChart.cloneEl.parentNode.removeChild(this._cloneChart.cloneEl);
    }
  }], [{
    key: "defaultProps",
    value: function defaultProps() {
      return {
        position: {
          detail: '位置，默认bottom,其他可选left,right,top',
          "default": 'bottom'
        },
        height: {
          detail: '高',
          "default": 24
        },
        width: {
          detail: '宽',
          "default": 0 //默认0，从轴去取width

        },
        color: {
          detail: '拖拽轴的主题颜色，比如其他按钮如果没有单独设置颜色，就继承该值',
          "default": '#809fff'
        },
        shapeType: {
          detail: '背景的图形形状,可选rect，triangle',
          "default": 'rect' // rect,triangle

        },
        range: {
          //propotion中，start 和 end代表的是数值的大小
          detail: '范围设置',
          propertys: {
            start: {
              detail: '开始位置',
              "default": 0
            },
            end: {
              detail: '结束位置，默认为null，表示到最后',
              "default": null
            },
            max: {
              detail: '最多可以选择多大的数据区间',
              "default": null
            },
            min: {
              detail: '最少可以选择多大的数据区间',
              "default": 1
            },
            eventEnabled: {
              detail: '是否响应事件',
              "default": true
            },
            fillStyle: {
              detail: '填充色',
              "default": '#000000'
            },
            alpha: {
              detail: '透明度',
              "default": 0.015
            }
          }
        },
        left: {
          detail: '左边按钮',
          propertys: {
            eventEnabled: {
              detail: '是否响应事件',
              "default": true
            },
            fillStyle: {
              detail: '颜色，默认取组件.color',
              "default": ''
            }
          }
        },
        right: {
          detail: '右边按钮',
          propertys: {
            eventEnabled: {
              detail: '是否响应事件',
              "default": true
            },
            fillStyle: {
              detail: '颜色，默认取组件.color',
              "default": ''
            }
          }
        },
        bg: {
          detail: '背景设置',
          propertys: {
            enabled: {
              detail: '是否开启',
              "default": true
            },
            fillStyle: {
              detail: '填充色',
              "default": ''
            },
            alpha: {
              detail: '透明度',
              "default": 0.5
            },
            strokeStyle: {
              detail: '边框色',
              "default": '#e6e6e6'
            },
            lineWidth: {
              detail: '线宽',
              "default": 1
            }
          }
        },
        graphAlpha: {
          detail: '图形的透明度',
          "default": 0.6
        },
        graphStyle: {
          detail: '图形的颜色',
          "default": '#dddddd'
        },
        underline: {
          detail: 'underline',
          propertys: {
            enabled: {
              detail: '是否开启',
              "default": true
            },
            strokeStyle: {
              detail: '线条色',
              "default": null
            },
            lineWidth: {
              detail: '线宽',
              "default": 2
            }
          }
        },
        btnOut: {
          detail: 'left,right按钮突出的大小',
          "default": 4
        },
        btnHeight: {
          detail: 'left,right按钮高',
          "default": 20,
          documentation: 'left,right按钮的高，不在left，right下面，统一在这个属性里， 以为要强制保持一致'
        },
        btnWidth: {
          detail: 'left,right按钮的宽',
          "default": 9,
          documentation: 'left,right按钮的宽，不在left，right下面，统一在这个属性里， 以为要强制保持一致'
        }
      };
    }
  }]);
  return dataZoom;
}(_component["default"]);

_component["default"].registerComponent(dataZoom, 'dataZoom');

var _default = dataZoom;
exports["default"] = _default;