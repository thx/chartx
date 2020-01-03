"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _index = _interopRequireDefault(require("./index"));

//https://babeljs.io/repl/#?babili=false&evaluate=true&lineWrap=false&presets=es2015%2Creact%2Cstage-0&code=function%20hello()%20%7B%0A%20%20return%20%3Cdiv%3EHello%20world!%3C%2Fdiv%3E%3B%0A%7D
//用上面的地址转换成es的react模块，不用jsx
var chartxReact =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2["default"])(chartxReact, _React$Component);

  function chartxReact(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, chartxReact);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(chartxReact).call(this, props));
    _this.myRef = _react["default"].createRef();
    _this.chart = null;
    _this.chartOptions = _this.getChartOptions(); //最终用来渲染的options，如果有props.chartId和props.options，两者会做一次extend

    return _this;
  }
  /**
   * 组件update完毕，reset对应的图表实例
   */


  (0, _createClass2["default"])(chartxReact, [{
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
    /**
     * 构建一个用来渲染图表的容易dom节点
     */

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
      return _react["default"].createElement("div", {
        ref: this.myRef,
        className: "chartx-react " + (this.props.className || ""),
        style: styles
      });
    }
    /**
     * 组件首次转载完毕
     * create对应的图表
     */

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
      this.chart = _index["default"].create(dom, data, options);

      if (!_index["default"]._registWindowOnResize) {
        //整个Chartx只需要注册一次window.onresize就够了
        window.addEventListener("resize", function (e) {
          _index["default"].resize();
        }, false);
        _index["default"]._registWindowOnResize = true;
      }

      ;
    }
    /**
     * 组件销毁
     * 销毁对应的图表
     */

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
        options = _index["default"].getOptions(this.props.chartId, options, data, variables);
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
      return _index["default"].getOptions(chartPark_cid);
    }
  }]);
  return chartxReact;
}(_react["default"].Component);

(0, _defineProperty2["default"])(chartxReact, "defaultProps", {
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
var _default = chartxReact;
exports["default"] = _default;