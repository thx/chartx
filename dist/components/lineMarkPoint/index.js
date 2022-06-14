"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _component = _interopRequireDefault(require("../component"));

var _canvax = _interopRequireDefault(require("canvax"));

var _tools = require("../../utils/tools");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var _ = _canvax["default"]._;
var Rect = _canvax["default"].Shapes.Rect;

var lineMarkPoint = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(lineMarkPoint, _Component);

  var _super = _createSuper(lineMarkPoint);

  function lineMarkPoint(opt, app) {
    var _this;

    (0, _classCallCheck2["default"])(this, lineMarkPoint);
    _this = _super.call(this, opt, app);
    _this.name = "lineMarkPoint";

    _.extend(true, (0, _assertThisInitialized2["default"])(_this), (0, _tools.getDefaultProps)(lineMarkPoint.defaultProps()), opt);

    _this.lineDatas = null;
    _this.sprite = new _canvax["default"].Display.Sprite();

    _this.app.graphsSprite.addChild(_this.sprite);

    return _this;
  }

  (0, _createClass2["default"])(lineMarkPoint, [{
    key: "reset",
    value: function reset(opt) {
      _.extend(true, this, opt);

      this.lineDatas = null;
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
      var lineGraphs = me.app.getComponent({
        name: 'graphs',
        type: "line",
        field: me.lineField
      });
      me.lineDatas = lineGraphs.data[me.lineField].data;
      var iNode = this.app.getComponent({
        name: "coord"
      }).getAxis({
        type: "xAxis"
      }).getIndexOfVal(this.xValue);

      if (iNode == -1) {
        return;
      }

      ;
      var nodeData = this.lineDatas[iNode];
      var preNodeData = iNode ? this.lineDatas[iNode - 1] : null;
      var nextNodeData = iNode == me.lineDatas.length ? null : this.lineDatas[iNode + 1];

      if (nodeData.y != undefined) {
        var x = nodeData.x;

        var _txtSp = new _canvax["default"].Display.Sprite({
          context: {
            x: x
          }
        });

        this.sprite.addChild(_txtSp);
        var txtHeight = 0;

        var _label = new _canvax["default"].Display.Text(me.label.text, {
          context: {
            fillStyle: this.label.fontColor,
            fontSize: this.label.fontSize,
            textAlign: 'center',
            textBaseline: 'top'
          }
        });

        _txtSp.addChild(_label);

        txtHeight = _label.getTextHeight();

        var txtWidth = _label.getTextWidth();

        var _bgRect;

        var padding = 0; //如果有背景，那么就要加上背景的padding

        if (this.label.background.enabled) {
          padding = this.label.background.padding;
          txtHeight += padding * 2;
          txtWidth += padding * 2;
          _txtSp.context.x -= padding; //sp的y会在下面单独计算好

          _label.context.x += padding;
          _label.context.y += padding;
          var r = me.label.background.radius; //添加一下背景

          _bgRect = new Rect({
            context: {
              x: -txtWidth / 2 + padding,
              width: txtWidth,
              height: txtHeight,
              radius: [r, r, r, r],
              fillStyle: me.label.background.fillStyle,
              strokeStyle: me.label.background.strokeStyle,
              lineWidth: me.label.background.lineWidth
            }
          });

          _txtSp.addChild(_bgRect, 0);
        }

        ;

        if (txtWidth / 2 + x > _coord.width) {
          _txtSp.context.x = _coord.width;
          _label.context.textAlign = "right";
          _bgRect && (_bgRect.context.x -= txtWidth / 2 - padding);
        }

        ;

        if (x - txtWidth / 2 < 0) {
          _txtSp.context.x = 0;
          _label.context.textAlign = "left";
          _bgRect && (_bgRect.context.x += txtWidth / 2 - padding);
        }

        ; //计算y的位置

        var _me$_getNodeYandLineP = me._getNodeYandLinePointList(nodeData, preNodeData, nextNodeData, _coord, txtHeight),
            y = _me$_getNodeYandLineP.y,
            pointList = _me$_getNodeYandLineP.pointList;

        _txtSp.context.y = y;

        if (me.line.enabled) {
          var _line = new _canvax["default"].Shapes.BrokenLine({
            context: {
              pointList: pointList,
              strokeStyle: me.line.strokeStyle,
              lineWidth: me.line.lineWidth
            }
          });

          me.sprite.addChild(_line, 0);
        }
      }
    }
  }, {
    key: "_getNodeYandLinePointList",
    value: function _getNodeYandLinePointList(nodeData, preNodeData, nextNodeData, _coord, txtHeight) {
      var appHeight = this.app.height;
      var coordHeight = _coord.height;
      var y = nodeData.y;
      var lineLength = !this.line.enabled ? 3 : this.line.lineLength;
      var lineDis = this.line.lineDis; //line到node的距离

      var position = "online";

      if (preNodeData && preNodeData.y < nodeData.y || nextNodeData && nextNodeData.y < nodeData.y) {
        position = 'offline'; //在线的下方
      }

      ;

      if (position == "online" && Math.abs(y) + lineLength + lineDis + txtHeight > coordHeight) {
        //在上面但是超过了坐标系顶部空间
        position = "offline";
      }

      ;

      if (position == "offline" && Math.abs(y) < lineLength + txtHeight + lineDis) {
        //在线下面，但是超出了坐标系底部空间
        position = "online";
      }

      ;
      var top = 0;

      if (position == "online") {
        top = y - lineLength - lineDis - txtHeight;
      } else {
        top = y + lineDis + lineLength;
      }

      ; //默认offline

      var pointList = [[nodeData.x, top], [nodeData.x, nodeData.y + lineDis]];

      if (position == "online") {
        pointList = [[nodeData.x, top + txtHeight], [nodeData.x, nodeData.y - lineDis]];
      }

      return {
        y: top,
        pointList: pointList
      };
    }
  }], [{
    key: "defaultProps",
    value: function defaultProps() {
      return {
        lineField: {
          detail: '对应的line字段',
          "default": null
        },
        xValue: {
          detail: '在lineFile字段的折线上对应点的x轴的值',
          "default": null
        },
        line: {
          detail: 'line的配置',
          propertys: {
            enabled: {
              detail: '是否要指示线',
              "default": true
            },
            lineWidth: {
              detail: '线宽',
              "default": 2
            },
            strokeStyle: {
              detail: '线颜色',
              "default": '#ccc'
            },
            lineLength: {
              detail: '线的长度，也就是label到line的距离',
              "default": 8
            },
            lineDis: {
              detail: 'line到折线上面node的距离',
              "default": 3
            }
          }
        },
        label: {
          detail: 'markpoint标注的文本配置',
          propertys: {
            text: {
              detail: 'label内容',
              "default": ''
            },
            fontSize: {
              detail: 'label的文本大小',
              "default": 12
            },
            fontColor: {
              detail: '文本颜色',
              "default": '#666'
            },
            background: {
              detail: 'label的background配置',
              propertys: {
                enabled: {
                  detail: 'label是否需要背景',
                  "default": true
                },
                fillStyle: {
                  detail: 'label的背景颜色',
                  "default": '#f5f5f6'
                },
                radius: {
                  detail: 'label的背景圆角',
                  "default": 6
                },
                strokeStyle: {
                  detail: 'label的背景边框颜色',
                  "default": '#f5f5f6'
                },
                lineWidth: {
                  detail: '背景描边',
                  "default": 1
                },
                padding: {
                  detail: 'background和label之间的距离',
                  "default": 6
                }
              }
            }
          }
        }
      };
    }
  }]);
  return lineMarkPoint;
}(_component["default"]);

_component["default"].registerComponent(lineMarkPoint, 'lineMarkPoint');

var _default = lineMarkPoint;
exports["default"] = _default;