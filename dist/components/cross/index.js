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

var _tools = require("../../utils/tools");

var _ = _canvax["default"]._;
var Line = _canvax["default"].Shapes.Line;
var Rect = _canvax["default"].Shapes.Rect;

var Cross =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(Cross, _Component);
  (0, _createClass2["default"])(Cross, null, [{
    key: "defaultProps",
    value: function defaultProps() {
      return {
        aimPoint: {
          detail: '准心位置',
          propertys: {
            x: {
              detail: 'x',
              "default": null
            },
            y: {
              detail: 'y',
              "default": null
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
        },
        quadrant: {
          detail: '背景设置，按照被cross分割的4个象限来设置背景(右上，左上，左下，右下)',
          propertys: {
            fillStyle: {
              detail: '填充颜色，可以是数组（右上，左上，左下，右下），也可以是函数',
              "default": '#666'
            },
            fillAlpha: {
              detail: '填充透明度，可以是数组（右上，左上，左下，右下），也可以是函数',
              "default": 0.1
            },
            label: {
              detail: '象限文本设置',
              propertys: {
                enabled: {
                  detail: '是否开启',
                  "default": true
                },
                fontColor: {
                  detail: '文本颜色',
                  "default": '#666'
                },
                fontSize: {
                  detail: '文本字体大小',
                  "default": 14
                }
              }
            }
          }
        }
      };
    }
  }]);

  function Cross(opt, app) {
    var _this;

    (0, _classCallCheck2["default"])(this, Cross);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Cross).call(this, opt, app));
    _this.name = "cross";

    _.extend(true, (0, _assertThisInitialized2["default"])(_this), (0, _tools.getDefaultProps)(Cross.defaultProps()), opt);

    _this._yAxis = _this.app.getComponent({
      name: 'coord'
    })._yAxis[_this.yAxisAlign == "left" ? 0 : 1];
    _this.sprite = new _canvax["default"].Display.Sprite();

    _this.app.graphsSprite.addChild(_this.sprite, 0); //放到所有graphs的下面


    return _this;
  }

  (0, _createClass2["default"])(Cross, [{
    key: "draw",
    value: function draw() {
      this._widget();
    }
  }, {
    key: "reset",
    value: function reset(opt) {
      debugger;
      opt && _.extend(true, this, opt);

      this._widget();
    }
  }, {
    key: "_widget",
    value: function _widget() {
      var me = this;

      var _coord = this.app.getComponent({
        name: 'coord'
      });

      this.pos = {
        x: _coord.origin.x,
        y: _coord.origin.y
      };
      this.setPosition();
      var width = _coord.width;
      var height = _coord.height;
      var xVal = this.aimPoint.x;
      var x = 0;

      if (xVal == null || xVal == undefined) {
        x = parseInt(width / 2);
      } else {
        x = _coord._xAxis.getPosOfVal(xVal);
      }

      var yVal = this.aimPoint.y;
      var y = 0;

      if (xVal == null || xVal == undefined) {
        y = parseInt(height / 2);
      } else {
        y = _coord._yAxis[0].getPosOfVal(yVal);
      }

      ;
      var _hCtx = {
        //横向线条
        start: {
          x: 0,
          y: -y
        },
        end: {
          x: width,
          y: -y
        },
        strokeStyle: me.line.strokeStyle,
        lineWidth: me.line.lineWidth,
        lineType: me.line.lineType
      };

      if (me._hLineElement) {
        //_.extend( me._hLineElement.context , _hCtx );
        me._hLineElement.context.start.y = _hCtx.start.y;
        me._hLineElement.context.end.y = _hCtx.end.y;
      } else {
        me._hLineElement = new Line({
          context: _hCtx
        });
        me.sprite.addChild(me._hLineElement);
      }

      ;
      var _vCtx = {
        start: {
          x: x,
          y: 0
        },
        end: {
          x: x,
          y: -height
        },
        strokeStyle: me.line.strokeStyle,
        lineWidth: me.line.lineWidth,
        lineType: me.line.lineType
      };

      if (me._vLineElement) {
        //_.extend( me._vLineElement.context , _vCtx );
        me._vLineElement.context.start.x = _vCtx.start.x;
        me._vLineElement.context.end.x = _vCtx.end.x;
      } else {
        me._vLineElement = new Line({
          //线条
          context: _vCtx
        });
        me.sprite.addChild(me._vLineElement);
      }

      ; // TODO 四象限背景，待实现
      // for( let i=0,l=4; i<l; i++ ){
      //     let _x = 0,_y=0;
      //     let _width = width - this.aimPoint.x;
      //     if( i % 2 ){
      //         _width = this.aimPoint.x;
      //     }
      //     let _height= height - this.aimPoint.y;
      //     if( i<2 ){
      //         _height= this.aimPoint.y;
      //     };
      //     let rectCtx = {
      //         width : _width,
      //         height: _height,
      //         x     : _x
      //     }
      // }
    }
  }]);
  return Cross;
}(_component["default"]);

_component["default"].registerComponent(Cross, 'cross');

var _default = Cross;
exports["default"] = _default;