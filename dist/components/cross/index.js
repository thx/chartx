"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../component", "canvax", "mmvis"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../component"), require("canvax"), require("mmvis"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.component, global.canvax, global.mmvis);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _component, _canvax, _mmvis) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _component2 = _interopRequireDefault(_component);

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

  var Line = _canvax2["default"].Shapes.Line;

  var Cross = function (_Component) {
    _inherits(Cross, _Component);

    _createClass(Cross, null, [{
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

      _classCallCheck(this, Cross);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Cross).call(this, opt, app));
      _this.name = "cross";
      _this.width = opt.width || 0;
      _this.height = opt.height || 0; //x,y都是准心的 x轴方向和y方向的 value值，不是真实的px，需要

      _this.x = null;
      _this.y = null;
      _this._hLine = null; //横向的线

      _this._vLine = null; //竖向的线

      _mmvis._.extend(true, _assertThisInitialized(_this), (0, _mmvis.getDefaultProps)(Cross.defaultProps()), opt);

      _this._yAxis = _this.app.getComponent({
        name: 'coord'
      })._yAxis[_this.yAxisAlign == "left" ? 0 : 1];
      _this.sprite = new _canvax2["default"].Display.Sprite();

      _this.app.graphsSprite.addChild(_this.sprite);

      return _this;
    }

    _createClass(Cross, [{
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
  }(_component2["default"]);

  _mmvis.global.registerComponent(Cross, 'cross');

  exports["default"] = Cross;
});