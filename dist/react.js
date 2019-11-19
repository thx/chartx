"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "react", "./index"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("react"), require("./index"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react, global.index);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _react, _index) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _index2 = _interopRequireDefault(_index);

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

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var chartxReact = function (_React$Component) {
    _inherits(chartxReact, _React$Component);

    function chartxReact(props) {
      var _this;

      _classCallCheck(this, chartxReact);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(chartxReact).call(this, props));
      _this.myRef = _react2["default"].createRef();
      _this.chart = null;
      _this.chartOptions = _this.getChartOptions(); //最终用来渲染的options，如果有props.chartId和props.options，两者会做一次extend

      return _this;
    }
    /**
     * 组件update完毕，reset对应的图表实例
     */


    _createClass(chartxReact, [{
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps, prevState) {
        var dom = this.myRef.current;
        var newChartOptions = this.getChartOptions(this.props);
        var data = this.props.data;

        if (!this.chart) {
          if (JSON.stringify(newChartOptions) === '{}') {
            return false; // 如果为空,返回false
          }

          ;
          this.createChart(dom, data, newChartOptions);
          return;
        }

        ;

        if (prevProps.width != this.props.width || prevProps.height != this.props.height || prevProps.className != this.props.className) {
          this.chart && this.chart.resize();
        }

        ;
        var optionsChange = JSON.stringify(this.getChartOptions(prevProps)) != JSON.stringify(newChartOptions);
        var dataChange = JSON.stringify(data) != JSON.stringify(prevProps.data);

        if (optionsChange) {
          this.chartOptions = newChartOptions;
          this.chart && this.chart.reset(newChartOptions, data);
        } else if (dataChange) {
          this.chart && this.chart.resetData(data);
        }

        ;
      }
    }, {
      key: "render",
      value: function render() {
        /*
        let styles = this.getStyles();
        return (
          <div ref={this.myRef} 
          className={"chartx-react " + this.props.className} 
          style={styles}
          ></div>
        );
        */
        var styles = this.getStyles();
        return _react2["default"].createElement("div", {
          ref: this.myRef,
          className: "chartx-react " + (this.props.className || ""),
          style: styles
        });
      }
    }, {
      key: "componentDidMount",
      value: function componentDidMount() {
        var dom = this.myRef.current;
        var data = this.props.data;

        if (JSON.stringify(this.chartOptions) === '{}') {
          //配置都没有，那么就不绘制图表了
          return false;
        }

        ;
        this.createChart(dom, data, this.chartOptions);
      }
    }, {
      key: "createChart",
      value: function createChart(dom, data, options) {
        this.chart = _index2["default"].create(dom, data, options);

        if (!_index2["default"]._registWindowOnResize) {
          //整个Chartx只需要注册一次window.onresize就够了
          window.addEventListener("resize", function (e) {
            _index2["default"].resize();
          }, false);
          _index2["default"]._registWindowOnResize = true;
        }

        ;
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.chart && this.chart.destroy();
      }
    }, {
      key: "getChartOptions",
      value: function getChartOptions(props) {
        var options = props ? props.options : this.props.options;
        var variables = props ? props.variables : this.props.variables;
        var data = props ? props.data : this.props.data;

        if (this.props.chartId) {
          options = _index2["default"].getOptions(this.props.chartId, options, data, variables);
        }

        ;
        return options;
      }
    }, {
      key: "getStyles",
      value: function getStyles() {
        var styles = {};
        this.setSize("width", styles);
        this.setSize("height", styles);
        return styles;
      }
    }, {
      key: "setSize",
      value: function setSize(sizeType, styles) {
        if (this.props[sizeType] != null) {
          var _width = this.props[sizeType];

          if (!isNaN(_width)) {
            if (_width < 1) {
              styles[sizeType] = _width * 100 + "%";
            } else {
              styles[sizeType] = _width + "px";
            }
          } else {
            if (typeof _width == "string") {
              styles[sizeType] = _width;
            }
          }
        }

        ;
      }
    }, {
      key: "getOptions",
      value: function getOptions(chartPark_cid) {
        return _index2["default"].getOptions(chartPark_cid);
      }
    }]);

    return chartxReact;
  }(_react2["default"].Component);

  _defineProperty(chartxReact, "defaultProps", {
    chartId: null,
    //chartpark项目中对应的图表id
    width: null,
    //支持 100px 100em 等字符串，也支持100number，会主动加上px，也支持小数0.5，主动变成50%
    height: null,
    //功能同上
    className: "",
    //附加在dom容器上面的className，有一个默认的 .chartx-react
    options: {},
    //用户传入的options配置，非必填，和chartId至少要有一个
    data: [],
    //图表渲染数据
    variables: {} //图表变量

  });

  exports["default"] = chartxReact;
});