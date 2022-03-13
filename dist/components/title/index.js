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

var _trigger = _interopRequireDefault(require("../trigger"));

var _tools = require("../../utils/tools");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var _ = _canvax["default"]._,
    event = _canvax["default"].event;

var Title = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(Title, _Component);

  var _super = _createSuper(Title);

  function Title(opt, app) {
    var _this;

    (0, _classCallCheck2["default"])(this, Title);
    _this = _super.call(this, opt, app);
    _this.name = "title";

    _.extend(true, (0, _assertThisInitialized2["default"])(_this), (0, _tools.getDefaultProps)(Title.defaultProps()), opt);

    _this.sprite = new _canvax["default"].Display.Sprite({
      id: "titleSprite",
      context: {}
    });

    _this.app.stage.addChild(_this.sprite);

    _this.widget(); //图例是需要自己绘制完成后，才能拿到高宽来设置自己的位置


    _this.layout();

    return _this;
  }

  (0, _createClass2["default"])(Title, [{
    key: "widget",
    value: function widget() {
      var textAlign = "left";

      if (this.text) {
        var txtStyle = this._getProp(this.textStyle) || {};
        var txt = new _canvax["default"].Display.Text(this.text, {
          id: "title_txt",
          context: {
            x: this.margin.left,
            y: this.margin.top,
            fillStyle: txtStyle.fontColor || this.text.fontColor,
            fontSize: this.text.fontSize,
            textAlign: textAlign,
            textBaseline: 'bottom'
          }
        });

        for (var p in txtStyle) {
          if (p in txt.context) {
            txt.context[p] = txtStyle[p];
          }
        }

        ;
        this.sprite.addChild(txt);
        this.width += txt.getTextWidth() + 6;
        this.height += txt.getTextHeight();
        txt.context.y = this.height;
      }

      if (this.desc) {
        var descStyle = this._getProp(this.descStyle) || {};
        var desc = new _canvax["default"].Display.Text(this.desc, {
          id: "title_txt",
          context: {
            x: this.width + this.margin.left,
            y: this.height,
            fillStyle: descStyle.fontColor || this.text.fontColor,
            fontSize: this.text.fontSize,
            textAlign: textAlign,
            textBaseline: 'bottom'
          }
        });

        for (var _p in descStyle) {
          if (_p in desc.context) {
            desc.context[_p] = descStyle[_p];
          }
        }

        this.sprite.addChild(desc);
        this.width += desc.getTextWidth();
        this.height = Math.max(desc.getTextHeight(), this.height);
        desc.context.y = this.height;
      }
    }
  }, {
    key: "layout",
    value: function layout() {
      var app = this.app;
      var height = this.height + this.margin.top + this.margin.bottom;
      var x = app.padding.left;
      var y = app.padding.top;

      if (this.position == "top-left") {
        x = app.padding.left;
      }

      ;

      if (this.position == "top-right") {
        x = app.width - app.padding.right - this.margin.right - this.width;
      }

      ;
      app.padding.top += height;
      this.pos = {
        x: x,
        y: y
      };
      return this.pos;
    }
  }, {
    key: "draw",
    value: function draw() {
      //为了在直角坐标系中，让 textAlign left的时候，图例和坐标系左侧对齐， 好看点, 用心良苦啊
      var _coord = this.app.getComponent({
        name: 'coord'
      });

      if (_coord && _coord.type == 'rect') {
        if (this.position == 'top-right') {//this.pos.x = 
        } else {
          this.pos.x = _coord.getSizeAndOrigin().origin.x;
        }
      }

      ;
      this.setPosition();
    }
  }, {
    key: "_getProp",
    value: function _getProp(prop, nodeData) {
      var _prop = prop;

      if (_.isArray(prop)) {
        _prop = prop[nodeData.ind];
      }

      ;

      if (_.isFunction(prop)) {
        _prop = prop.apply(this, [nodeData]);
      }

      ;
      return _prop;
    }
  }], [{
    key: "defaultProps",
    value: function defaultProps() {
      return {
        position: {
          detail: '图例位置',
          documentation: '默认top-left,可选top-right',
          "default": 'top-left'
        },
        text: {
          detail: '标题内容',
          "default": ''
        },
        textStyle: {
          detail: '主标题样式',
          propertys: {
            fontColor: {
              detail: '字体颜色',
              "default": '#666'
            },
            fontSize: {
              detail: '字体大小',
              "default": '14'
            },
            style: {
              detail: '样式集合',
              "default": null
            }
          }
        },
        desc: {
          detail: '描述内容',
          "default": ''
        },
        descStyle: {
          detail: '描述的样式',
          propertys: {
            fontColor: {
              detail: '字体颜色',
              "default": '#999'
            },
            fontSize: {
              detail: '字体大小',
              "default": '12'
            },
            style: {
              detail: '样式集合',
              "default": null
            }
          }
        },
        margin: {
          propertys: {
            bottom: {
              "default": 10
            }
          }
        }
      };
    }
  }]);
  return Title;
}(_component["default"]);

_component["default"].registerComponent(Title, 'title');

var _default = Title;
exports["default"] = _default;