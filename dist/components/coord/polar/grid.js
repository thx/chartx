"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _canvax = _interopRequireDefault(require("canvax"));

var _tools = require("../../../utils/tools");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var _ = _canvax["default"]._,
    event = _canvax["default"].event;
var Line = _canvax["default"].Shapes.Line;
var Circle = _canvax["default"].Shapes.Circle;
var Polygon = _canvax["default"].Shapes.Polygon;

var polarGrid = /*#__PURE__*/function (_event$Dispatcher) {
  (0, _inherits2["default"])(polarGrid, _event$Dispatcher);

  var _super = _createSuper(polarGrid);

  function polarGrid(opt, app) {
    var _this;

    (0, _classCallCheck2["default"])(this, polarGrid);
    _this = _super.call(this, opt, app);
    _this.width = 0;
    _this.height = 0;
    _this.app = app; //该组件被添加到的目标图表项目，

    _this.pos = {
      x: 0,
      y: 0
    };
    _this.dataSection = [];
    _this.sprite = null; //总的sprite

    _this.induce = null; //最外层的那个网，用来触发事件

    _.extend(true, (0, _assertThisInitialized2["default"])(_this), (0, _tools.getDefaultProps)(polarGrid.defaultProps()), opt);

    _this.init(opt);

    return _this;
  }

  (0, _createClass2["default"])(polarGrid, [{
    key: "init",
    value: function init() {
      this.sprite = new _canvax["default"].Display.Sprite();
    }
  }, {
    key: "setX",
    value: function setX($n) {
      this.sprite.context.x = $n;
    }
  }, {
    key: "setY",
    value: function setY($n) {
      this.sprite.context.y = $n;
    }
  }, {
    key: "draw",
    value: function draw(opt) {
      _.extend(true, this, opt);

      this._widget();

      this.setX(this.pos.x);
      this.setY(this.pos.y);
    }
  }, {
    key: "clean",
    value: function clean() {
      this.sprite.removeAllChildren();
    }
  }, {
    key: "reset",
    value: function reset(opt) {
      /*
      this.sprite.removeAllChildren();
      this.draw( opt );
      */
    }
  }, {
    key: "_widget",
    value: function _widget() {
      var me = this;

      _.each(this.dataSection, function (num, i) {
        if (num) {
          var r = me.app.getROfNum(num);
          var points = me.app.getPointsOfR(r);
          var ctx = {
            //lineType : me.ring.lineType,
            lineWidth: me.ring.lineWidth,
            strokeStyle: me._getStyle(me.ring.strokeStyle, i - 1),
            //me.ring.strokeStyle,
            fillStyle: me._getStyle(me.ring.fillStyle, i - 1),
            fillAlpha: me.ring.fillAlpha
          };

          var _ring;

          var ringType = Circle;

          if (me.ring.shapeType == "circle") {
            ctx.r = r;
            _ring = new ringType({
              context: ctx
            });
          } else {
            ctx.pointList = [];

            _.each(points, function (point, i) {
              if (i < points.length) {
                ctx.pointList.push([point.x, point.y]);
              }
            });

            ringType = Polygon;
            _ring = new ringType({
              context: ctx
            });
          }

          ;
          me.sprite.addChildAt(_ring, 0);

          if (i == me.dataSection.length - 1) {
            ctx.fillAlpha = 0;
            ctx.fillStyle = "#ffffff";
            me.induce = new ringType({
              context: ctx
            });
            me.sprite.addChild(me.induce);
          }

          ; //绘制中心出发的蜘蛛网线

          var aAxisLayoutData = [];

          _.each(points, function (point) {
            var _line = new Line({
              context: {
                end: point,
                lineWidth: me.ring.lineWidth,
                strokeStyle: me.ring.strokeStyle
              }
            });

            me.sprite.addChild(_line);
          });
        }
      });
    }
  }, {
    key: "_getStyle",
    value: function _getStyle(color, i) {
      if (_.isArray(color)) {
        return color[i % color.length];
      }

      return color;
    }
  }], [{
    key: "defaultProps",
    value: function defaultProps() {
      return {
        enabled: {
          detail: '是否开启grid',
          "default": false
        },
        ring: {
          detail: '环背景线',
          propertys: {
            shapeType: {
              detail: '线的图形样式，默认poly，可选circle',
              "default": 'poly'
            },
            lineType: {
              detail: '线条样式，sold实线，dashed虚线',
              "default": 'sold'
            },
            lineWidth: {
              detail: '线宽',
              "default": 1
            },
            strokeStyle: {
              detail: '线颜色',
              "default": '#e5e5e5'
            },
            fillStyle: {
              detail: '环填充色,支持函数配置',
              "default": null
            },
            fillAlpha: {
              detail: '环填充的透明度',
              "default": 0.5
            }
          }
        },
        ray: {
          detail: '射线',
          propertys: {
            enabled: {
              detail: '是否开启',
              "default": true
            },
            lineWidth: {
              detail: '线宽',
              "default": 1
            },
            strokeStyle: {
              detail: '线颜色',
              "default": '#e5e5e5'
            }
          }
        }
      };
    }
  }]);
  return polarGrid;
}(event.Dispatcher);

exports["default"] = polarGrid;