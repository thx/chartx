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

var _ = _canvax["default"]._,
    event = _canvax["default"].event;
var BrokenLine = _canvax["default"].Shapes.BrokenLine;
var Arrow = _canvax["default"].Shapes.Arrow;
var Text = _canvax["default"].Display.Text;

var relationBackLine =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(relationBackLine, _Component);
  (0, _createClass2["default"])(relationBackLine, null, [{
    key: "defaultProps",
    value: function defaultProps() {
      return {
        key: {
          detail: '和relation的line保持一致，用逗号分割',
          "default": null
        },
        line: {
          detail: '线的配置',
          propertys: {
            enabled: {
              detail: '是否开启',
              "default": true
            },
            pointList: {
              detail: '回链线的points',
              "default": null
            },
            lineWidth: {
              detail: '线宽',
              "default": 1
            },
            strokeStyle: {
              detail: '线的颜色',
              "default": '#e5e5e5'
            },
            lineType: {
              detail: '线的样式，虚线(dashed)实线(solid)',
              "default": 'solid'
            },
            dissY: {
              detail: '拐点和起始节点的距离',
              "default": null
            }
          }
        },
        icon: {
          detail: 'line上面的icon',
          propertys: {
            enabled: {
              detail: '是否开启线上的icon设置',
              "default": true
            },
            charCode: {
              detail: 'iconfont上面对应的unicode中&#x后面的字符',
              "default": null
            },
            lineWidth: {
              detail: 'icon描边线宽',
              "default": 0
            },
            strokeStyle: {
              detail: 'icon的描边颜色',
              "default": '#e5e5e5'
            },
            fontColor: {
              detail: 'icon的颜色',
              "default": '#e5e5e5'
            },
            fontFamily: {
              detail: 'font-face的font-family设置',
              "default": 'iconfont'
            },
            fontSize: {
              detail: 'icon的字体大小',
              "default": 16
            },
            offset: {
              detail: 'icon的位置，函数，参数是整个edge对象',
              "default": null
            }
          }
        }
      };
    }
  }]);

  function relationBackLine(opt, app) {
    var _this;

    (0, _classCallCheck2["default"])(this, relationBackLine);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(relationBackLine).call(this, opt, app));
    _this.name = "relation_backline";

    _.extend(true, (0, _assertThisInitialized2["default"])(_this), (0, _tools.getDefaultProps)(relationBackLine.defaultProps()), opt);

    _this.pointList = null;
    _this.sprite = new _canvax["default"].Display.Sprite();
    _this._line = null;
    _this._arrow = null;
    _this._label = null;
    _this._icon = null;
    return _this;
  }

  (0, _createClass2["default"])(relationBackLine, [{
    key: "draw",
    value: function draw(opt) {
      !opt && (opt = {});
      this.width = opt.width;
      this.height = opt.height;
      this.origin = opt.origin;

      this._widget();
    }
  }, {
    key: "reset",
    value: function reset(opt) {
      opt && _.extend(true, this, opt);

      this._widget();
    }
  }, {
    key: "_widget",
    value: function _widget() {
      var _this2 = this;

      var _graphs = this.app.getGraphs();

      if (_graphs.length) {
        var _graph = _graphs[0];

        _graph.on('complete', function () {
          _this2._setPoints(_graph);

          _this2._drawLine();

          _this2._drawArrow();

          _this2._drawIcon();

          _graph.graphsSp.addChild(_this2.sprite);
        });
      }

      ;
    }
  }, {
    key: "_setPoints",
    value: function _setPoints(_graph) {
      if (!this.line.pointList) {
        var key = this.key;

        var beginNode = _graph.data.nodes.find(function (_g) {
          return _g.key == key.split(',')[0];
        });

        var beginNodeBBox = {
          x: beginNode.x - beginNode.width / 2,
          y: beginNode.y - beginNode.height / 2,
          width: beginNode.width,
          height: beginNode.height
        };

        var endNode = _graph.data.nodes.find(function (_g) {
          return _g.key == key.split(',')[1];
        });

        var endNodeBBox = {
          x: endNode.x - endNode.width / 2,
          y: endNode.y - endNode.height / 2,
          width: endNode.width,
          height: endNode.height
        };
        var fristPoint = [beginNodeBBox.x + beginNodeBBox.width, beginNodeBBox.y + beginNodeBBox.height / 2];
        var secondPoint = [beginNodeBBox.x + beginNodeBBox.width + 20, beginNodeBBox.y + beginNodeBBox.height / 2];
        var endPoint;
        var isAbove = secondPoint[1] < endNodeBBox.y + endNodeBBox.height / 2;

        if (isAbove) {
          //连接endNode上面的点
          endPoint = [endNodeBBox.x + endNodeBBox.width / 2, endNodeBBox.y];
        } else {
          //连接endNode下面的点
          endPoint = [endNodeBBox.x + endNodeBBox.width / 2, endNodeBBox.y + endNodeBBox.height];
        }

        ;
        var dissY;

        if (this.line.dissY == null) {
          if (isAbove) {
            //在上面的话，像下是最近的路径，优先检测向下的连线
            var diss = beginNodeBBox.y + beginNodeBBox.height - endNodeBBox.y;

            if (Math.abs(diss) > 20) {
              //距离足够，可以往下连接
              dissY = beginNodeBBox.height / 2 + diss / 2;
            } else {
              //距离不够就往上走，肯定够
              dissY = Math.min(beginNodeBBox.y - 20, endNodeBBox.y - 20) - secondPoint[1];
            }
          } else {
            //起始点再目标点的下面
            var _diss = beginNodeBBox.y - (endNodeBBox.y + endNodeBBox.height);

            if (_diss > 20) {
              //向上探测，间距足够的话
              dissY = -(beginNodeBBox.height / 2 + _diss / 2);
            } else {
              //向上空间不够， 只能向下了， 海阔天空
              dissY = Math.max(beginNodeBBox.y + beginNodeBBox.height + 20, endNodeBBox.y + endNodeBBox.height + 20) - secondPoint[1];
            }

            ;
          }
        } else {
          dissY = this.line.dissY;
        }

        ;
        var thirdPoint, secondLastPoint;
        thirdPoint = [secondPoint[0], secondPoint[1] + dissY];
        secondLastPoint = [endPoint[0], secondPoint[1] + dissY];
        this.pointList = [fristPoint, secondPoint, thirdPoint, secondLastPoint, endPoint];
      } else {
        this.pointList = this.line.pointList;
      }
    }
  }, {
    key: "_drawLine",
    value: function _drawLine() {
      var me = this;
      if (!me.line.enabled) return;
      var lineOpt = {
        pointList: this.pointList,
        lineWidth: this.line.lineWidth,
        strokeStyle: this.line.strokeStyle,
        lineType: this.line.lineType
      };

      if (this._line) {
        _.extend(this._line.context, lineOpt);
      } else {
        this._line = new BrokenLine({
          context: lineOpt
        });
        this.sprite.addChild(this._line);
      }

      ; //线条渲染结束
    }
  }, {
    key: "_drawArrow",
    value: function _drawArrow() {
      var pointsList = this.pointList;
      var offsetY = 2;
      var endPoint = pointsList[pointsList.length - 1];
      var secondLastPoint = pointsList[pointsList.length - 2];

      if (secondLastPoint[1] < endPoint[1]) {
        offsetY = -2;
      }

      var strokeStyle = this.line.strokeStyle;
      var ctx = {
        y: offsetY,
        control: {
          x: secondLastPoint[0],
          y: secondLastPoint[1]
        },
        point: {
          x: endPoint[0],
          y: endPoint[1]
        },
        strokeStyle: strokeStyle,
        fillStyle: strokeStyle
      };

      if (this._arrow) {
        _.extend(true, this._arrow.context, ctx); // this._line.context.y = ctx.y;
        // this._line.context.control.x = ctx.control.x;
        // this._line.context.control.y = ctx.control.y;
        // this._line.context.point.x = ctx.point.x;
        // this._line.context.point.y = ctx.point.y;
        // this._line.context.strokeStyle = ctx.strokeStyle;
        // this._line.context.fillStyle = ctx.fillStyle;

      } else {
        this._arrow = new Arrow({
          context: ctx
        });
        this.sprite.addChild(this._arrow);
      }
    }
  }, {
    key: "_drawIcon",
    value: function _drawIcon() {
      var me = this;

      if (this.icon.enabled) {
        var charCode = String.fromCharCode(parseInt(this._getProp(this.icon.charCode, this), 16));

        if (charCode) {
          var secondPoint = this.pointList[1];

          var lineWidth = this._getProp(this.icon.lineWidth, this);

          var strokeStyle = this._getProp(this.icon.strokeStyle, this);

          var fontFamily = this._getProp(this.icon.fontFamily, this);

          var fontSize = this._getProp(this.icon.fontSize, this);

          var fontColor = this._getProp(this.icon.fontColor, this);

          var textAlign = 'center';
          var textBaseline = 'middle';

          var offset = this._getProp(this.icon.offset, this);

          if (!offset) {
            //default 使用edge.x edge.y 也就是edge label的位置
            offset = {
              x: secondPoint[0],
              y: secondPoint[1]
            };
          }

          ;

          if (this._icon) {
            this._icon.resetText(charCode);

            this._icon.context.x = offset.x;
            this._icon.context.y = offset.y;
            this._icon.context.fontSize = fontSize;
            this._icon.context.fillStyle = fontColor;
            this._icon.context.textAlign = textAlign;
            this._icon.context.textBaseline = textBaseline;
            this._icon.context.fontFamily = fontFamily;
            this._icon.context.lineWidth = lineWidth;
            this._icon.context.strokeStyle = strokeStyle;
          } else {
            this._icon = new _canvax["default"].Display.Text(charCode, {
              context: {
                x: offset.x,
                y: offset.y,
                fillStyle: fontColor,
                cursor: 'pointer',
                fontSize: fontSize,
                textAlign: textAlign,
                textBaseline: textBaseline,
                fontFamily: fontFamily,
                lineWidth: lineWidth,
                strokeStyle: strokeStyle
              }
            });

            this._icon.on(event.types.get(), function (e) {
              var trigger = me.line;

              if (me.icon['on' + e.type]) {
                trigger = me.icon;
              }

              ;
              e.eventInfo = {
                trigger: trigger,
                nodes: [{
                  name: me.key
                }]
              };
              me.app.fire(e.type, e);
            });

            me.sprite.addChild(this._icon);
          }
        }
      }
    }
  }, {
    key: "_getProp",
    value: function _getProp(prop, nodeData) {
      var _prop = prop;

      if (_.isFunction(prop)) {
        _prop = prop.apply(this, [nodeData]);
      }

      ;
      return _prop;
    }
  }]);
  return relationBackLine;
}(_component["default"]);

_component["default"].registerComponent(relationBackLine, 'relation_backline');

var _default = relationBackLine;
exports["default"] = _default;