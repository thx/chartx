"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "canvax", "mmvis", "../component"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("canvax"), require("mmvis"), require("../component"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.canvax, global.mmvis, global.component);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _canvax, _mmvis, _component) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _canvax2 = _interopRequireDefault(_canvax);

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

  var waterMark = function (_Component) {
    _inherits(waterMark, _Component);

    _createClass(waterMark, null, [{
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

    function waterMark(opt, app) {
      var _this;

      _classCallCheck(this, waterMark);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(waterMark).call(this, opt, app));
      _this.name = "waterMark";
      _this.width = _this.app.width;
      _this.height = _this.app.height;

      _mmvis._.extend(true, _assertThisInitialized(_this), (0, _mmvis.getDefaultProps)(waterMark.defaultProps()), opt);

      _this.spripte = new _canvax2["default"].Display.Sprite({
        id: "watermark"
      });

      _this.app.stage.addChild(_this.spripte);

      _this.draw();

      return _this;
    }

    _createClass(waterMark, [{
      key: "draw",
      value: function draw() {
        var textEl = new _canvax2["default"].Display.Text(this.text, {
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
            //var cloneText = textEl.clone();
            var _textEl = new _canvax2["default"].Display.Text(this.text, {
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
    }]);

    return waterMark;
  }(_component2["default"]);

  _mmvis.global.registerComponent(waterMark, 'waterMark');

  exports["default"] = waterMark;
});