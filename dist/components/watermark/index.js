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

var _tools = require("../../utils/tools");

var _component = _interopRequireDefault(require("../component"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var _ = _canvax["default"]._;

var waterMark = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(waterMark, _Component);

  var _super = _createSuper(waterMark);

  function waterMark(opt, app) {
    var _this;

    (0, _classCallCheck2["default"])(this, waterMark);
    _this = _super.call(this, opt, app);
    _this.name = "waterMark";
    _this.width = _this.app.width;
    _this.height = _this.app.height;

    _.extend(true, (0, _assertThisInitialized2["default"])(_this), (0, _tools.getDefaultProps)(waterMark.defaultProps()), opt);

    _this.spripte = new _canvax["default"].Display.Sprite({
      id: "watermark"
    });

    _this.app.stage.addChild(_this.spripte);

    _this.draw();

    return _this;
  }

  (0, _createClass2["default"])(waterMark, [{
    key: "draw",
    value: function draw() {
      var textEl = new _canvax["default"].Display.Text(this.text, {
        context: {
          fontSize: this.fontSize,
          fillStyle: this.fontColor
        }
      });
      var textW = textEl.getTextWidth();
      var textH = textEl.getTextHeight();
      var rowCount = parseInt(this.height / (textH * 5)) + 1;
      var coluCount = parseInt(this.width / (textW * 1.5)) + 1;

      for (var r = 0; r < rowCount; r++) {
        for (var c = 0; c < coluCount; c++) {
          //TODO:text 的 clone有问题
          //let cloneText = textEl.clone();
          var _textEl = new _canvax["default"].Display.Text(this.text, {
            context: {
              rotation: this.rotation,
              fontSize: this.fontSize,
              fillStyle: this.fontColor,
              globalAlpha: this.alpha
            }
          });

          _textEl.context.x = textW * 1.5 * c + textW * .25;
          _textEl.context.y = textH * 5 * r;
          this.spripte.addChild(_textEl);
        }
      }
    }
  }], [{
    key: "defaultProps",
    value: function defaultProps() {
      return {
        text: {
          detail: '水印内容',
          "default": 'chartx'
        },
        fontSize: {
          detail: '字体大小',
          "default": 20
        },
        fontColor: {
          detail: '水印颜色',
          "default": '#cccccc'
        },
        alpha: {
          detail: '水印透明度',
          "default": 0.2
        },
        rotation: {
          detail: '水印旋转角度',
          "default": 45
        }
      };
    }
  }]);
  return waterMark;
}(_component["default"]);

_component["default"].registerComponent(waterMark, 'waterMark');

var _default = waterMark;
exports["default"] = _default;