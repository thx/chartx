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
var Line = _canvax["default"].Shapes.Line;
var Rect = _canvax["default"].Shapes.Rect;
var Arrow = _canvax["default"].Shapes.Arrow;
var Text = _canvax["default"].Display.Text;

var Cross = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(Cross, _Component);

  var _super = _createSuper(Cross);

  function Cross(opt, app) {
    var _this;

    (0, _classCallCheck2["default"])(this, Cross);
    _this = _super.call(this, opt, app);
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
      var xVal = this.aimPoint.xVal;
      var x = 0;

      if (xVal == null || xVal == undefined) {
        x = parseInt(width / 2);
      } else {
        x = _coord._xAxis.getPosOfVal(xVal);
      }

      var yVal = this.aimPoint.yVal;
      var y = 0;

      if (xVal == null || xVal == undefined) {
        y = parseInt(height / 2);
      } else {
        y = _coord._yAxis[0].getPosOfVal(yVal);
      }

      ; //四象限背景

      for (var i = 0, l = 4; i < l; i++) {
        var _x = 0,
            _y = 0,
            _w = 0,
            _h = 0;
        var quadrant = void 0;
        var textCtx = {};
        var textBackGroundCtx = {};

        switch (i) {
          case 0:
            _w = width - x;
            _h = height - y;
            _x = x;
            _y = -height;
            quadrant = 'rightTop';
            textCtx = {
              x: width - 8,
              y: _y + 4,
              textAlign: 'right',
              textBaseline: 'top'
            };
            textBackGroundCtx = {
              x: width,
              y: _y
            };
            break;

          case 1:
            _w = x;
            _h = height - y;
            _x = 0;
            _y = -height;
            quadrant = 'leftTop';
            textCtx = {
              x: _x + 8,
              y: _y + 4,
              textAlign: 'left',
              textBaseline: 'top'
            };
            textBackGroundCtx = {
              x: _x,
              y: _y
            };
            break;

          case 2:
            _w = x;
            _h = y;
            _x = 0;
            _y = -y;
            quadrant = 'leftBottom';
            textCtx = {
              x: 0 + 8,
              y: 0 - 4,
              textAlign: 'left',
              textBaseline: 'bottom'
            };
            textBackGroundCtx = {
              x: 0,
              y: 0
            };
            break;

          case 3:
            _w = width - x;
            _h = y;
            _x = x;
            _y = -y;
            quadrant = 'rightBottom';
            textCtx = {
              x: width - 8,
              y: 0 - 4,
              textAlign: 'right',
              textBaseline: 'bottom'
            };
            textBackGroundCtx = {
              x: width,
              y: 0
            };
            break;
        }

        var quadrantOpt = this.quadrant[quadrant];
        var ctx = {
          width: _w,
          height: _h,
          x: _x,
          y: _y,
          fillStyle: quadrantOpt.fillStyle,
          fillAlpha: quadrantOpt.fillAlpha
        };
        var quadrantId = '_quadrant_' + i;

        if (this[quadrantId]) {
          Object.assign(this[quadrantId].context, ctx);
        } else {
          this[quadrantId] = new Rect({
            id: quadrantId,
            context: ctx
          });
          me.sprite.addChild(this[quadrantId]);
        } //象限文本和象限文本背景的是否显示


        var visible = true;

        if (!_w || !_h || !quadrantOpt.label.text) {
          visible = false;
        } //设置象限文本


        textCtx.fillStyle = quadrantOpt.label.fontColor;
        textCtx.fontSize = quadrantOpt.label.fontSize;
        textCtx.visible = visible; //textCtx.x = 0;
        //textCtx.y = 0;

        var quadrantTextId = '_quadrant_text' + i;

        if (this[quadrantTextId]) {
          Object.assign(this[quadrantTextId].context, textCtx);
        } else {
          this[quadrantTextId] = new Text(quadrantOpt.label.text, {
            id: quadrantTextId,
            context: textCtx
          });
          me.sprite.addChild(this[quadrantTextId]);
        } //设置文本的背景


        textBackGroundCtx.fillStyle = quadrantOpt.label.fillStyle;
        textBackGroundCtx.fillAlpha = quadrantOpt.label.fillAlpha;
        textBackGroundCtx.visible = visible;
        Object.assign(textBackGroundCtx, {
          width: this[quadrantTextId].getTextWidth() + 16,
          height: this[quadrantTextId].getTextHeight() + 8
        });

        switch (i) {
          case 0:
            textBackGroundCtx.x = textBackGroundCtx.x - textBackGroundCtx.width;
            break;

          case 1:
            break;

          case 2:
            textBackGroundCtx.y = textBackGroundCtx.y - textBackGroundCtx.height;
            break;

          case 3:
            textBackGroundCtx.x = textBackGroundCtx.x - textBackGroundCtx.width;
            textBackGroundCtx.y = textBackGroundCtx.y - textBackGroundCtx.height;
            break;
        }

        var quadrantTextBackGroundId = '_quadrant_text_background_' + i;

        if (this[quadrantTextBackGroundId]) {
          Object.assign(this[quadrantTextBackGroundId].context, textBackGroundCtx);
        } else {
          this[quadrantTextBackGroundId] = new Rect({
            id: quadrantTextBackGroundId,
            context: textBackGroundCtx
          });
          me.sprite.addChild(this[quadrantTextBackGroundId]);
          this[quadrantTextBackGroundId].toBack(1);
        }
      } //开始绘制两交叉线


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

      ; //h箭头

      var _hArrowCtx = {
        x: 0,
        y: 0,
        control: {
          x: _hCtx.end.x - 10,
          y: _hCtx.end.y
        },
        point: {
          x: _hCtx.end.x,
          y: _hCtx.end.y
        },
        strokeStyle: _hCtx.strokeStyle,
        fillStyle: _hCtx.strokeStyle
      };

      if (me._hLineElementArrow) {
        Object.assign(me._hLineElementArrow.context.control, _hArrowCtx.control);
        Object.assign(me._hLineElementArrow.context.point, _hArrowCtx.point);
      } else {
        me._hLineElementArrow = new Arrow({
          id: '_hArrow',
          context: _hArrowCtx
        });
        me.sprite.addChild(me._hLineElementArrow);
      } //h上面的两个label


      ['begin', 'end'].forEach(function (type) {
        var _lineLabelCtx = {
          x: type == 'begin' ? 4 : width - 4,
          y: -y - 4,
          fillStyle: me.line.hLabel[type].fontColor,
          fontSize: me.line.hLabel[type].fontSize,
          textAlign: type == 'begin' ? 'left' : 'right',
          textBaseline: 'bottom'
        };
        var _elm = me['_hLineLabel' + type + 'Ctx'];

        if (_elm) {
          Object.assign(_elm.context, _lineLabelCtx);
        } else {
          _elm = me['_hLineLabel' + type + 'Ctx'] = new Text(me.line.hLabel[type].text, {
            context: _lineLabelCtx
          });
          me.sprite.addChild(_elm);
        }
      });
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

      ; //v箭头

      var _vArrowCtx = {
        x: 0,
        y: 0,
        control: {
          x: _vCtx.end.x,
          y: _vCtx.end.y + 10
        },
        point: {
          x: _vCtx.end.x,
          y: _vCtx.end.y
        },
        strokeStyle: _vCtx.strokeStyle,
        fillStyle: _vCtx.strokeStyle
      };

      if (me._vLineElementArrow) {
        Object.assign(me._vLineElementArrow.context.control, _vArrowCtx.control);
        Object.assign(me._vLineElementArrow.context.point, _vArrowCtx.point);
      } else {
        me._vLineElementArrow = new Arrow({
          id: '_vArrow',
          context: _vArrowCtx
        });
        me.sprite.addChild(me._vLineElementArrow);
      } //v上面的两个label


      ['begin', 'end'].forEach(function (type) {
        var _lineLabelCtx = {
          x: x - 4,
          y: type == 'begin' ? -4 : -height + 4,
          fillStyle: me.line.vLabel[type].fontColor,
          fontSize: me.line.vLabel[type].fontSize,
          textAlign: 'right',
          textBaseline: type == 'begin' ? 'bottom' : 'top'
        };
        var _elm = me['_vLineLabel' + type + 'Ctx'];

        if (_elm) {
          Object.assign(_elm.context, _lineLabelCtx);
        } else {
          _elm = me['_vLineLabel' + type + 'Ctx'] = new Text(me.line.vLabel[type].text, {
            context: _lineLabelCtx
          });
          me.sprite.addChild(_elm);
        }
      });
    }
  }], [{
    key: "defaultProps",
    value: function defaultProps() {
      return {
        aimPoint: {
          detail: '准心位置',
          propertys: {
            xVal: {
              detail: '准心x轴value',
              "default": null
            },
            yVal: {
              detail: '准心y轴value',
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
            },
            showArrow: {
              detail: '是否显示箭头',
              "default": true
            },
            vLabel: {
              detail: '纵向线方向的label',
              propertys: {
                begin: {
                  detail: '开始点label',
                  propertys: {
                    text: {
                      detail: '文本内容',
                      "default": ''
                    },
                    fontColor: {
                      detail: '文本颜色',
                      "default": '#999'
                    },
                    fontSize: {
                      detail: '文本大小',
                      "default": 12
                    }
                  }
                },
                end: {
                  detail: '结束点label',
                  propertys: {
                    text: {
                      detail: '文本内容',
                      "default": ''
                    },
                    fontColor: {
                      detail: '文本颜色',
                      "default": '#999'
                    },
                    fontSize: {
                      detail: '文本大小',
                      "default": 12
                    }
                  }
                }
              }
            },
            hLabel: {
              detail: '横向线方向的label',
              propertys: {
                begin: {
                  detail: '开始点label',
                  propertys: {
                    text: {
                      detail: '文本内容',
                      "default": ''
                    },
                    fontColor: {
                      detail: '文本颜色',
                      "default": '#999'
                    },
                    fontSize: {
                      detail: '文本大小',
                      "default": 12
                    }
                  }
                },
                end: {
                  detail: '结束点label',
                  propertys: {
                    text: {
                      detail: '文本内容',
                      "default": ''
                    },
                    fontColor: {
                      detail: '文本颜色',
                      "default": '#999'
                    },
                    fontSize: {
                      detail: '文本大小',
                      "default": 12
                    }
                  }
                }
              }
            }
          }
        },
        quadrant: {
          detail: '4象限设置',
          propertys: {
            rightTop: {
              detail: '第一象限',
              propertys: {
                fillStyle: {
                  detail: '象限区块背景色',
                  "default": '#ccc'
                },
                fillAlpha: {
                  detail: '象限区块背透明度',
                  "default": 0.1
                },
                label: {
                  detail: '象限文本设置',
                  propertys: {
                    text: {
                      detail: '文本内容',
                      "default": ''
                    },
                    fontColor: {
                      detail: '文本颜色',
                      "default": '#666'
                    },
                    fontSize: {
                      detail: '文本字体大小',
                      "default": 14
                    },
                    fillStyle: {
                      detail: '文本矩形背景色',
                      "default": '#e9e9f8'
                    },
                    fillAlpha: {
                      detail: '文本矩形背景透明度',
                      "default": 0.5
                    }
                  }
                }
              }
            },
            leftTop: {
              detail: '第二象限',
              propertys: {
                fillStyle: {
                  detail: '象限区块背景色',
                  "default": '#ccc'
                },
                fillAlpha: {
                  detail: '象限区块背透明度',
                  "default": 0.1
                },
                label: {
                  detail: '象限文本设置',
                  propertys: {
                    text: {
                      detail: '文本内容',
                      "default": ''
                    },
                    fontColor: {
                      detail: '文本颜色',
                      "default": '#666'
                    },
                    fontSize: {
                      detail: '文本字体大小',
                      "default": 14
                    },
                    fillStyle: {
                      detail: '文本矩形背景色',
                      "default": '#e9e9f8'
                    },
                    fillAlpha: {
                      detail: '文本矩形背景透明度',
                      "default": 0.5
                    }
                  }
                }
              }
            },
            leftBottom: {
              detail: '第三象限',
              propertys: {
                fillStyle: {
                  detail: '象限区块背景色',
                  "default": '#ccc'
                },
                fillAlpha: {
                  detail: '象限区块背透明度',
                  "default": 0.1
                },
                label: {
                  detail: '象限文本设置',
                  propertys: {
                    text: {
                      detail: '文本内容',
                      "default": ''
                    },
                    fontColor: {
                      detail: '文本颜色',
                      "default": '#666'
                    },
                    fontSize: {
                      detail: '文本字体大小',
                      "default": 14
                    },
                    fillStyle: {
                      detail: '文本矩形背景色',
                      "default": '#e9e9f8'
                    },
                    fillAlpha: {
                      detail: '文本矩形背景透明度',
                      "default": 0.5
                    }
                  }
                }
              }
            },
            rightBottom: {
              detail: '第四象限',
              propertys: {
                fillStyle: {
                  detail: '象限区块背景色',
                  "default": '#ccc'
                },
                fillAlpha: {
                  detail: '象限区块背透明度',
                  "default": 0.1
                },
                label: {
                  detail: '象限文本设置',
                  propertys: {
                    text: {
                      detail: '文本内容',
                      "default": ''
                    },
                    fontColor: {
                      detail: '文本颜色',
                      "default": '#666'
                    },
                    fontSize: {
                      detail: '文本字体大小',
                      "default": 14
                    },
                    fillStyle: {
                      detail: '文本矩形背景色',
                      "default": '#e9e9f8'
                    },
                    fillAlpha: {
                      detail: '文本矩形背景透明度',
                      "default": 0.5
                    }
                  }
                }
              }
            }
          }
        }
      };
    }
  }]);
  return Cross;
}(_component["default"]);

_component["default"].registerComponent(Cross, 'cross');

var _default = Cross;
exports["default"] = _default;