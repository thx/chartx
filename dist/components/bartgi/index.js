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

var _component = _interopRequireDefault(require("../component"));

var _canvax = _interopRequireDefault(require("canvax"));

var _mmvis = require("mmvis");

var Line = _canvax["default"].Shapes.Line;

var barTgi =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(barTgi, _Component);
  (0, _createClass2["default"])(barTgi, null, [{
    key: "defaultProps",
    value: function defaultProps() {
      return {
        field: {
          detail: '字段配置',
          "default": null
        },
        barField: {
          detail: '这个bartgi组件对应的bar Graph 的field',
          "default": null
        },
        yAxisAlign: {
          detail: '这个bartgi组件回到到哪个y轴',
          "default": 'left'
        },
        standardVal: {
          detail: 'tgi标准线',
          "default": 100
        },
        line: {
          detail: 'bar对应的tgi线配置',
          propertys: {
            lineWidth: {
              detail: '线宽',
              "default": 3
            },
            strokeStyle: {
              detail: '线颜色',
              "default": function _default(val, i) {
                if (val >= this.standardVal) {
                  return "#43cbb5";
                } else {
                  return "#ff6060";
                }
              }
            }
          }
        }
      };
    }
  }]);

  function barTgi(opt, app) {
    var _this;

    (0, _classCallCheck2["default"])(this, barTgi);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(barTgi).call(this, opt, app));
    _this.name = "barTgi"; //this.field = null;
    //this.barField = null;

    _this.data = null;
    _this.barDatas = null;
    _this._yAxis = null; //this.yAxisAlign = "left";

    _this.sprite = null; //this.standardVal = 100;

    _this.pos = {
      x: 0,
      y: 0
    };
    /*
    this.line = {
        lineWidth : 3,
        strokeStyle : function( val, i ){
            if( val >= this.standardVal ){
                return "#43cbb5"
            } else {
                return "#ff6060"
            }
        }
    };
    */

    _mmvis._.extend(true, (0, _assertThisInitialized2["default"])(_this), (0, _mmvis.getDefaultProps)(barTgi.defaultProps()), opt);

    _this._yAxis = _this.app.getComponent({
      name: 'coord'
    })._yAxis[_this.yAxisAlign == "left" ? 0 : 1];
    _this.sprite = new _canvax["default"].Display.Sprite();

    _this.app.graphsSprite.addChild(_this.sprite);

    return _this;
  }

  (0, _createClass2["default"])(barTgi, [{
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

      _mmvis._.each(this.data, function (tgi, i) {
        var y = -me._yAxis.getPosOfVal(tgi);
        var barData = me.barDatas[i];

        var _tgiLine = new Line({
          context: {
            start: {
              x: barData.x,
              y: y
            },
            end: {
              x: barData.x + barData.width,
              y: y
            },
            lineWidth: 2,
            strokeStyle: me._getProp(me.line.strokeStyle, tgi, i)
          }
        });

        me.sprite.addChild(_tgiLine);
      });
    }
  }, {
    key: "_getProp",
    value: function _getProp(val, tgi, i) {
      var res = val;

      if (_mmvis._.isFunction(val)) {
        res = val.apply(this, [tgi, i]);
      }

      ;
      return res;
    }
  }]);
  return barTgi;
}(_component["default"]);

_mmvis.global.registerComponent(barTgi, 'barTgi');

var _default2 = barTgi;
exports["default"] = _default2;