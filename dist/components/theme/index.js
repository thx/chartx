"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../component", "mmvis"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../component"), require("mmvis"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.component, global.mmvis);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _component, _mmvis) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _component2 = _interopRequireDefault(_component);

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

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
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

  var Theme = function (_Component) {
    _inherits(Theme, _Component);

    function Theme(theme, app) {
      var _this;

      _classCallCheck(this, Theme);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Theme).call(this, theme, app));
      _this.name = "theme";
      _this.colors = theme || [];
      return _this;
    }

    _createClass(Theme, [{
      key: "set",
      value: function set(colors) {
        this.colors = colors;
        return this.colors;
      }
    }, {
      key: "get",
      value: function get(ind) {
        var colors = this.colors;

        if (!_mmvis._.isArray(colors)) {
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
  }(_component2["default"]);

  _mmvis.global.registerComponent(Theme, 'theme');

  exports["default"] = Theme;
});