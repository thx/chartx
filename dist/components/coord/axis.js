"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "mmvis"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("mmvis"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.mmvis);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _mmvis) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

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

  var Axis = function (_baseAxis) {
    _inherits(Axis, _baseAxis);

    _createClass(Axis, null, [{
      key: "defaultProps",
      value: function defaultProps() {
        return {
          field: {
            detail: '轴字段配置',
            documentation: '目前x轴的field只支持单维度设置，也就是说只支持一条x轴',
            "default": []
          },
          layoutType: {
            detail: '布局方式',
            "default": 'rule'
          },
          width: {
            detail: '轴宽',
            "default": 0
          },
          height: {
            detail: '轴高',
            "default": 0
          },
          enabled: {
            detail: '是否显示轴',
            "default": true
          },
          animation: {
            detail: '是否开启动画',
            "default": true
          },
          title: {
            detail: '轴名称',
            propertys: {
              shapeType: "text",
              textAlign: {
                detail: '水平对齐方式',
                "default": 'center'
              },
              textBaseline: {
                detail: '基线对齐方式',
                "default": 'middle'
              },
              strokeStyle: {
                detail: '文本描边颜色',
                "default": null
              },
              lineHeight: {
                detail: '行高',
                "default": 0
              },
              text: {
                detail: '轴名称的内容',
                "default": ''
              },
              fontColor: {
                detail: '颜色',
                "default": '#999'
              },
              fontSize: {
                detail: '字体大小',
                "default": 12
              }
            }
          },
          tickLine: {
            detail: '刻度线',
            propertys: {
              enabled: {
                detail: '是否开启',
                "default": true
              },
              lineWidth: {
                detail: '刻度线宽',
                "default": 1
              },
              lineLength: {
                detail: '刻度线长度',
                "default": 4
              },
              distance: {
                detail: '和前面一个元素的距离',
                "default": 2
              },
              strokeStyle: {
                detail: '描边颜色',
                "default": '#cccccc'
              }
            }
          },
          axisLine: {
            detail: '轴线配置',
            propertys: {
              enabled: {
                detail: '是否有轴线',
                "default": true
              },
              position: {
                detail: '轴线的位置',
                documentation: 'default在align的位置（left，right），可选 "center" 和 具体的值',
                "default": 'default'
              },
              lineWidth: {
                detail: '轴线宽度',
                "default": 1
              },
              strokeStyle: {
                detail: '轴线的颜色',
                "default": '#cccccc'
              }
            }
          },
          label: {
            detail: '刻度文本',
            propertys: {
              enabled: {
                detail: '是否显示刻度文本',
                "default": true
              },
              fontColor: {
                detail: '文本颜色',
                "default": '#999'
              },
              fontSize: {
                detail: '字体大小',
                "default": 12
              },
              rotation: {
                detail: '旋转角度',
                "default": 0
              },
              format: {
                detail: 'label文本的格式化处理函数',
                "default": null
              },
              distance: {
                detail: '和轴线之间的间距',
                "default": 2
              },
              textAlign: {
                detail: '水平方向对齐方式',
                "default": 'center'
              },
              lineHeight: {
                detail: '文本的行高',
                "default": 1
              },
              evade: {
                detail: '是否开启逃避算法,目前的逃避只是隐藏',
                "default": true
              }
            }
          },
          filter: {
            detail: '过滤函数',
            documentation: '可以用来过滤哪些yaxis 的 节点是否显示已经颜色之类的',
            "default": null
          },
          trimLayout: {
            detail: '自定义的显示规则函数',
            documentation: '如果用户有手动的 trimLayout ，那么就全部visible为true，然后调用用户自己的过滤程序',
            "default": null
          }
        };
      }
    }]);

    function Axis(opt, dataOrg, _coord) {
      var _this;

      _classCallCheck(this, Axis);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Axis).call(this, opt, dataOrg));

      _mmvis._.extend(true, _assertThisInitialized(_this), (0, _mmvis.getDefaultProps)(Axis.defaultProps()));

      return _this;
    }

    _createClass(Axis, [{
      key: "drawWaterLine",
      value: function drawWaterLine(y) {
        //如果y在现有的数据区间里面， 就不需要重新计算和绘制了
        if (this.layoutType == "proportion") {
          if (y >= this._min && y <= this._max) {
            return;
          }
        }

        ;
        this.dataSection = [];
        this.setWaterLine(y);

        this._initHandle();

        this.draw();
      }
    }]);

    return Axis;
  }(_mmvis.axis);

  exports.default = Axis;
});