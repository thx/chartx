"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "canvax", "mmvis"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("canvax"), require("mmvis"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.canvax, global.mmvis);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _canvax, _mmvis) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _canvax2 = _interopRequireDefault(_canvax);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  var Component = function (_event$Dispatcher) {
    _inherits(Component, _event$Dispatcher);

    _createClass(Component, null, [{
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

      _classCallCheck(this, Component);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Component).call(this, opt, app));

      _mmvis._.extend(true, _assertThisInitialized(_this), (0, _mmvis.getDefaultProps)(Component.defaultProps()), opt);

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
      _this.__cid = _canvax2["default"].utils.createId("comp_");
      return _this;
    }

    _createClass(Component, [{
      key: "init",
      value: function init(opt, data) {}
    }, {
      key: "draw",
      value: function draw() {}
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

  exports.default = Component;
});