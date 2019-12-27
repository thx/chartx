"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

/**
 * 每个组件中对外影响的时候，要抛出一个trigger对象
 * 上面的comp属性就是触发这个trigger的组件本身
 * params属性则是这次trigger的一些动作参数
 * 目前legend和datazoom组件都有用到
 */
var Trigger = function Trigger(comp) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  (0, _classCallCheck2["default"])(this, Trigger);
  this.comp = comp;
  this.params = params;
};

exports["default"] = Trigger;