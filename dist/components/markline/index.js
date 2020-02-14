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
var BrokenLine = _canvax["default"].Shapes.BrokenLine;
var Sprite = _canvax["default"].Display.Sprite;
var Text = _canvax["default"].Display.Text;

var MarkLine =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(MarkLine, _Component);
  (0, _createClass2["default"])(MarkLine, null, [{
    key: "defaultProps",
    value: function defaultProps() {
      return {
        markTo: {
          detail: '标准哪个目标字段',
          "default": null
        },
        yVal: {
          detail: '组件的值',
          "default": 0,
          documentation: '可能是个function，均值计算就是个function'
        },
        line: {
          detail: '线的配置',
          propertys: {
            strokeStyle: {
              detail: '线的颜色',
              "default": '#999999'
            },
            lineWidth: {
              detail: '线宽',
              "default": 1
            },
            lineType: {
              detail: '线样式',
              "default": 'dashed'
            }
          }
        },
        label: {
          detail: '文本',
          propertys: {
            enabled: {
              detail: '是否开启',
              "default": false
            },
            fontColor: {
              detail: '文本字体颜色',
              "default": '#999999'
            },
            fontSize: {
              detail: '文本字体大小',
              "default": 12
            },
            text: {
              detail: '文本内容',
              "default": null
            },
            format: {
              detail: '文本格式化函数',
              "default": null
            }
          }
        }
      };
    }
  }]);

  function MarkLine(opt, app) {
    var _this;

    (0, _classCallCheck2["default"])(this, MarkLine);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(MarkLine).call(this, opt, app));
    _this.name = "markLine";
    _this._yAxis = null;
    _this.line = {
      y: 0,
      list: []
    };
    _this._txt = null;
    _this._line = null;
    _this.sprite = new Sprite();

    _this.app.graphsSprite.addChild(_this.sprite);

    _.extend(true, (0, _assertThisInitialized2["default"])(_this), (0, _tools.getDefaultProps)(MarkLine.defaultProps()), opt);

    return _this;
  }

  (0, _createClass2["default"])(MarkLine, [{
    key: "draw",
    value: function draw() {
      this._calculateProps();

      this.setPosition();
      this.widget();
    }
  }, {
    key: "_calculateProps",
    value: function _calculateProps() {
      var me = this;
      var opt = this._opt; //如果markline有target配置，那么只现在target配置里的字段的 markline, 推荐

      var field = opt.markTo;

      var _coord = this.app.getComponent({
        name: 'coord'
      });

      if (field && _.indexOf(this.app.dataFrame.fields, field) == -1) {
        //如果配置的字段不存在，则不绘制
        return;
      }

      ;
      var _yAxis = _coord._yAxis[0]; //默认为左边的y轴

      if (field) {
        //如果有配置markTo就从 _coord._yAxis中找到这个markTo所属的yAxis对象
        _.each(_coord._yAxis, function ($yAxis, yi) {
          var fs = _.flatten([$yAxis.field]);

          if (_.indexOf(fs, field) >= 0) {
            _yAxis = $yAxis;
          }
        });
      }

      ;

      if (opt.yAxisAlign) {
        //如果有配置yAxisAlign，就直接通过yAxisAlign找到对应的
        _yAxis = _coord._yAxis[opt.yAxisAlign == "left" ? 0 : 1];
      }

      ;
      var y;

      if (opt.y !== undefined && opt.y !== null) {
        y = Number(opt.y);
      } else {
        //如果没有配置这个y的属性，就 自动计算出来均值
        //但是均值是自动计算的，比如datazoom在draging的时候
        y = function y() {
          var _fdata = this.app.dataFrame.getFieldData(field);

          var _count = 0;

          _.each(_fdata, function (val) {
            if (Number(val)) {
              _count += val;
            }
          });

          return _count / _fdata.length;
        };
      }

      ; //y = this._getYVal( y );

      if (!isNaN(y)) {
        //如果y是个function说明是均值，自动实时计算的，而且不会超过ydatasection的范围
        //_yAxis.setWaterLine( y );
        //_yAxis.draw();
        _yAxis.drawWaterLine(y);
      }

      ;
      var _fstyle = "#777";

      var fieldMap = _coord.getFieldMapOf(field);

      if (fieldMap) {
        _fstyle = fieldMap.color;
      }

      ;
      var lineStrokeStyle = opt.line && opt.line.strokeStyle || _fstyle;
      var textFillStyle = opt.label && opt.label.fontColor || _fstyle; //开始计算赋值到属性上面

      this._yAxis = _yAxis;
      this.width = _coord.width;
      this.height = _coord.height;
      this.yVal = y;
      this.pos = {
        x: _coord.origin.x,
        y: _coord.origin.y
      };
      this.line.list = [[0, 0], [this.width, 0]];
      this.label.fontColor = textFillStyle;

      if (lineStrokeStyle) {
        this.line.strokeStyle = lineStrokeStyle;
      }

      ;
    }
  }, {
    key: "widget",
    value: function widget() {
      var me = this;

      var y = this._getYPos();

      var line = new BrokenLine({
        //线条
        id: "line",
        context: {
          y: y,
          pointList: me.line.list,
          strokeStyle: me.line.strokeStyle,
          lineWidth: me.line.lineWidth,
          lineType: me.line.lineType
        }
      });
      me.sprite.addChild(line);
      me._line = line;

      if (me.label.enabled) {
        var txt = new Text(me._getLabel(), {
          //文字
          context: me.label
        });
        this._txt = txt;
        me.sprite.addChild(txt);

        me._setTxtPos(y);
      }

      this.line.y = y;
    }
  }, {
    key: "reset",
    value: function reset(opt) {
      opt && _.extend(true, this, opt);
      var me = this;

      var y = this._getYPos();

      if (y != this.line.y) {
        this._line.animate({
          y: y
        }, {
          duration: 300,
          onUpdate: function onUpdate(obj) {
            if (me.label.enabled) {
              me._txt.resetText(me._getLabel());

              me._setTxtPos(obj.y); //me._txt.context.y = obj.y - me._txt.getTextHeight();

            }
          } //easing: 'Back.Out' //Tween.Easing.Elastic.InOut

        });
      }

      ;
      this._line.context.strokeStyle = this.line.strokeStyle;
      this.line.y = y;
    }
  }, {
    key: "_setTxtPos",
    value: function _setTxtPos(y) {
      var me = this;
      var txt = me._txt;

      if (this._yAxis.align == "left") {
        txt.context.x = 5;
      } else {
        txt.context.x = this.width - txt.getTextWidth() - 5;
      }

      ;

      if (_.isNumber(me.label.y)) {
        txt.context.y = me.label.y;
      } else {
        txt.context.y = y - txt.getTextHeight();
      }

      ;
    }
  }, {
    key: "_getYVal",
    value: function _getYVal(yVal) {
      yVal = yVal || this.yVal;
      var y = yVal;

      if (_.isFunction(yVal)) {
        y = yVal.apply(this);
      }

      ;
      return y;
    }
  }, {
    key: "_getYPos",
    value: function _getYPos() {
      return -this._yAxis.getPosOfVal(this._getYVal());
      ;
    }
  }, {
    key: "_getLabel",
    value: function _getLabel() {
      var str;

      var yVal = this._getYVal();

      if (_.isFunction(this.label.format)) {
        str = this.label.format(yVal, this);
      } else {
        if (_.isString(this.label.text)) {
          str = this.label.text;
        } else {
          str = yVal;
        }

        ;
      }

      ;
      return str;
    }
  }]);
  return MarkLine;
}(_component["default"]);

_component["default"].registerComponent(MarkLine, 'markLine');

var _default = MarkLine;
exports["default"] = _default;