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

  var Line = _canvax2["default"].Shapes.Line;
  var Circle = _canvax2["default"].Shapes.Circle;
  var Polygon = _canvax2["default"].Shapes.Polygon;

  var polarGrid = function (_event$Dispatcher) {
    _inherits(polarGrid, _event$Dispatcher);

    _createClass(polarGrid, null, [{
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

    function polarGrid(opt, app) {
      var _this;

      _classCallCheck(this, polarGrid);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(polarGrid).call(this, opt, app));
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

      _mmvis._.extend(true, _assertThisInitialized(_this), (0, _mmvis.getDefaultProps)(polarGrid.defaultProps()), opt);

      _this.init(opt);

      return _this;
    }

    _createClass(polarGrid, [{
      key: "init",
      value: function init() {
        this.sprite = new _canvax2["default"].Display.Sprite();
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
        _mmvis._.extend(true, this, opt);

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

        _mmvis._.each(this.dataSection, function (num, i) {
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

              _mmvis._.each(points, function (point, i) {
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

            _mmvis._.each(points, function (point) {
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
        if (_mmvis._.isArray(color)) {
          return color[i % color.length];
        }

        return color;
      }
    }]);

    return polarGrid;
  }(_mmvis.event.Dispatcher);

  exports.default = polarGrid;
});