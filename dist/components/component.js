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

var _canvax = _interopRequireDefault(require("canvax"));

var _mmvis = require("mmvis");

var Component =
/*#__PURE__*/
function (_event$Dispatcher) {
  (0, _inherits2["default"])(Component, _event$Dispatcher);
  (0, _createClass2["default"])(Component, null, [{
    key: "defaultProps",
    value: function defaultProps() {
      return {
        enabled: {
          detail: '是否开启该组件',
          "default": false
        }
      };
    }
  }, {
    key: "_isComponentRoot",
    value: function _isComponentRoot() {
      return true;
    }
  }]);

  function Component(opt, app) {
    var _this;

    (0, _classCallCheck2["default"])(this, Component);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Component).call(this, opt, app));

    _mmvis._.extend(true, (0, _assertThisInitialized2["default"])(_this), (0, _mmvis.getDefaultProps)(Component.defaultProps()), opt);

    _this.name = "component"; //组件名称

    _this.type = null; //组件子类型，比如 Graphs组件下面的bar,line,scat等
    //this.enabled = false; //是否加载该组件

    _this._opt = opt;
    _this.app = app; //这个组件挂在哪个app上面（图表）

    _this.width = 0;
    _this.height = 0; //height 不包含margin

    _this.pos = {
      x: 0,
      y: 0
    };
    _this.margin = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
    _this.__cid = _canvax["default"].utils.createId("comp_");
    return _this;
  }

  (0, _createClass2["default"])(Component, [{
    key: "init",
    value: function init(opt, data) {}
  }, {
    key: "draw",
    value: function draw() {} //组件的销毁

  }, {
    key: "destroy",
    value: function destroy() {}
  }, {
    key: "reset",
    value: function reset() {}
  }, {
    key: "resetData",
    value: function resetData() {
      console.log((this.type || '') + '暂无resetData的实现');
    }
  }, {
    key: "setPosition",
    value: function setPosition(pos) {
      !pos && (pos = this.pos);
      pos.x && (this.sprite.context.x = pos.x);
      pos.y && (this.sprite.context.y = pos.y);
    }
  }, {
    key: "layout",
    value: function layout() {}
  }]);
  return Component;
}(_mmvis.event.Dispatcher);

exports["default"] = Component;