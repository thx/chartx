"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _component = _interopRequireDefault(require("../component"));

var _canvax = _interopRequireDefault(require("canvax"));

var _mmvis = require("mmvis");

var Line = _canvax["default"].Shapes.Line;

var Cross =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(Cross, _Component);
  (0, _createClass2["default"])(Cross, null, [{
    key: "defaultProps",
    value: function defaultProps() {
      return {
        aimPoint: {
          detail: '准心位置',
          propertys: {
            x: {
              detail: 'x',
              "default": 0
            },
            y: {
              detail: 'y',
              "default": 0
            }
          }
        },
        line: {
          detail: '线配置',
          propertys: {
            strokeStyle: {
              detail: '线颜色',
              "default": '#cccccc'
            },
            lineWidth: {
              detail: '线宽',
              "default": 1
            },
            lineType: {
              detail: '线样式类型',
              "default": 'solid'
            }
          }
        }
      };
    }
  }]);

  function Cross(opt, app) {
    var _this;

    (0, _classCallCheck2["default"])(this, Cross);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Cross).call(this, opt, app));
    _this.name = "cross";
    _this.width = opt.width || 0;
    _this.height = opt.height || 0; //x,y都是准心的 x轴方向和y方向的 value值，不是真实的px，需要

    _this.x = null;
    _this.y = null;
    _this._hLine = null; //横向的线

    _this._vLine = null; //竖向的线

    _mmvis._.extend(true, (0, _assertThisInitialized2["default"])(_this), (0, _mmvis.getDefaultProps)(Cross.defaultProps()), opt);

    _this._yAxis = _this.app.getComponent({
      name: 'coord'
    })._yAxis[_this.yAxisAlign == "left" ? 0 : 1];
    _this.sprite = new _canvax["default"].Display.Sprite();

    _this.app.graphsSprite.addChild(_this.sprite);

    return _this;
  }

  (0, _createClass2["default"])(Cross, [{
    key: "draw",
    value: function draw() {
      var me = this;

      var _coord = this.app.getComponent({
        name: 'coord'
      });

      this.pos = {
        x: _coord.origin.x,
        y: _coord.origin.y
      };
      this.width = _coord.width;
      this.height = _coord.height;
      this.aimPoint = {
        x: this.width / 2,
        y: this.height / 2
      };
      this.setPosition();
      me._hLine = new Line({
        //横向线条
        context: {
          start: {
            x: 0,
            y: -this.aimPoint.y
          },
          end: {
            x: me.width,
            y: -this.aimPoint.y
          },
          strokeStyle: me.line.strokeStyle,
          lineWidth: me.line.lineWidth,
          lineType: me.line.lineType
        }
      });
      me.sprite.addChild(me._hLine);
      me._vLine = new Line({
        //线条
        context: {
          start: {
            x: this.aimPoint.x,
            y: 0
          },
          end: {
            x: this.aimPoint.x,
            y: -me.height
          },
          strokeStyle: me.line.strokeStyle,
          lineWidth: me.line.lineWidth,
          lineType: me.line.lineType
        }
      });
      me.sprite.addChild(me._vLine);
    }
  }]);
  return Cross;
}(_component["default"]);

_mmvis.global.registerComponent(Cross, 'cross');

var _default = Cross;
exports["default"] = _default;