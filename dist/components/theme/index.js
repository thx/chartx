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

var _component = _interopRequireDefault(require("../component"));

var _canvax = require("canvax");

/**
 * 皮肤组件，不是一个具体的ui组件
 */
var Theme =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(Theme, _Component);

  function Theme(theme, app) {
    var _this;

    (0, _classCallCheck2["default"])(this, Theme);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Theme).call(this, theme, app));
    _this.name = "theme";
    _this.colors = theme || [];
    return _this;
  }

  (0, _createClass2["default"])(Theme, [{
    key: "set",
    value: function set(colors) {
      this.colors = colors;
      return this.colors;
    }
  }, {
    key: "get",
    value: function get(ind) {
      var colors = this.colors;

      if (!_canvax._.isArray(colors)) {
        colors = [colors];
      }

      ;
      return colors;
    }
  }, {
    key: "mergeTo",
    value: function mergeTo(colors) {
      if (!colors) {
        colors = [];
      }

      ;

      for (var i = 0, l = this.colors.length; i < l; i++) {
        if (colors[i]) {
          colors[i] = this.colors[i];
        } else {
          colors.push(this.colors[i]);
        }
      }

      ;
      return colors;
    }
  }]);
  return Theme;
}(_component["default"]);

_component["default"].registerComponent(Theme, 'theme');

var _default = Theme;
exports["default"] = _default;