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

  var barGuide = function (_Component) {
    _inherits(barGuide, _Component);

    _createClass(barGuide, null, [{
      key: "defaultProps",
      value: function defaultProps() {
        return {
          field: {
            detail: '字段配置',
            "default": null
          },
          barField: {
            detail: '这个guide对应的bar Graph 的field',
            "default": null
          },
          yAxisAlign: {
            detail: '这个guide组件回到到哪个y轴',
            "default": 'left'
          },
          node: {
            detail: '单个节点配置',
            propertys: {
              shapeType: {
                detail: '节点绘制的图形类型',
                "default": 'circle'
              },
              lineWidth: {
                detail: '图表描边线宽',
                "default": 3
              },
              radius: {
                detail: '图形半径',
                "default": 6
              },
              fillStyle: {
                detail: '填充色',
                "default": '#19dea1'
              },
              strokeStyle: {
                detail: '描边色',
                "default": '#fff'
              }
            }
          },
          label: {
            detail: '文本配置',
            propertys: {
              fontSize: {
                detail: '字体大小',
                "default": 12
              },
              fontColor: {
                detail: '字体颜色',
                "default": '#19dea1'
              },
              verticalAlign: {
                detail: '垂直对齐方式',
                "default": 'bottom'
              },
              textAlign: {
                detail: '水平对齐方式',
                "default": 'center'
              },
              strokeStyle: {
                detail: '文本描边颜色',
                "default": '#fff'
              },
              lineWidth: {
                detail: '文本描边线宽',
                "default": 0
              },
              format: {
                detail: '文本格式处理函数',
                "default": null
              }
            }
          }
        };
      }
    }]);

    function barGuide(opt, app) {
      var _this;

      _classCallCheck(this, barGuide);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(barGuide).call(this, opt, app));
      _this.name = "barGuide";
      _this.data = null;
      _this.barDatas = null;
      _this._yAxis = null;
      _this.sprite = null;

      _mmvis._.extend(true, _assertThisInitialized(_this), (0, _mmvis.getDefaultProps)(barGuide.defaultProps()), opt);

      _this._yAxis = _this.app.getComponent({
        name: 'coord'
      })._yAxis[_this.yAxisAlign == "left" ? 0 : 1];
      _this.sprite = new _canvax2["default"].Display.Sprite();

      _this.app.graphsSprite.addChild(_this.sprite);

      return _this;
    }

    _createClass(barGuide, [{
      key: "reset",
      value: function reset(opt) {
        _mmvis._.extend(true, this, opt);

        this.barDatas = null;
        this.data = null;
        this.sprite.removeAllChildren();
        this.draw();
      }
    }, {
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
        this.setPosition();

        _mmvis._.each(me.app.getComponents({
          name: 'graphs'
        }), function (_g) {
          if (_g.type == "bar" && _g.data[me.barField]) {
            me.barDatas = _g.data[me.barField];
            return false;
          }
        });

        this.data = _mmvis._.flatten(me.app.dataFrame.getDataOrg(me.field));

        if (!this.barDatas) {
          return;
        }

        ;

        _mmvis._.each(this.data, function (val, i) {
          var y = -me._yAxis.getPosOfVal(val);
          var barData = me.barDatas[i];

          var _node = new _canvax2["default"].Shapes.Circle({
            context: {
              x: barData.x + barData.width / 2,
              y: y,
              r: me.node.radius,
              fillStyle: me.node.fillStyle,
              strokeStyle: me.node.strokeStyle,
              lineWidth: me.node.lineWidth
            }
          });

          var _label = val;

          if (_mmvis._.isFunction(me.label.format)) {
            _label = me.label.format(val, barData);
          }

          ;

          var _txt = new _canvax2["default"].Display.Text(_label, {
            context: {
              x: barData.x + barData.width / 2,
              y: y - me.node.radius - 1,
              fillStyle: me.label.fontColor,
              lineWidth: me.label.lineWidth,
              strokeStyle: me.label.strokeStyle,
              fontSize: me.label.fontSize,
              textAlign: me.label.textAlign,
              textBaseline: me.label.verticalAlign
            }
          });

          me.sprite.addChild(_node);
          me.sprite.addChild(_txt);
        });
      }
    }, {
      key: "_getProp",
      value: function _getProp(val, tgi, i) {
        var res = val;

        if (_mmvis._.isFunction(val)) {
          res = val.apply(this, [tgi, i]);
        }

        return res;
      }
    }]);

    return barGuide;
  }(_component2["default"]);

  _mmvis.global.registerComponent(barGuide, 'barGuide');

  exports["default"] = barGuide;
});