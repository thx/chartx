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

var _trigger = _interopRequireDefault(require("../trigger"));

var _tools = require("../../utils/tools");

var _ = _canvax["default"]._,
    event = _canvax["default"].event;
var Circle = _canvax["default"].Shapes.Circle;

var Legend =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(Legend, _Component);
  (0, _createClass2["default"])(Legend, null, [{
    key: "defaultProps",
    value: function defaultProps() {
      return {
        data: {
          detail: '图例数据',
          "default": [],
          documentation: '\
                    数据结构为：{name: "uv", color: "#ff8533", field: "" ...}\
                    如果手动传入数据只需要前面这三个 enabled: true, ind: 0\
                    外部只需要传field和fillStyle就行了\
                    '
        },
        position: {
          detail: '图例位置',
          documentation: '图例所在的方向top,right,bottom,left',
          "default": 'top'
        },
        direction: {
          detail: '图例布局方向',
          "default": 'h',
          documentation: '横向 top,bottom --> h left,right -- >v'
        },
        textAlign: {
          detail: '水平方向的对其，默认居左对其',
          "default": 'left',
          documentation: '可选left，center，right'
        },
        verticalAlign: {
          detail: '垂直方向的对其方式，默认居中（待实现）',
          "default": 'middle',
          documentation: '可选top，middle，bottom'
        },
        icon: {
          detail: '图标设置',
          propertys: {
            height: {
              detail: '高',
              "default": 26
            },
            width: {
              detail: '图标宽',
              "default": 'auto'
            },
            shapeType: {
              detail: '图标的图形类型，目前只实现了圆形',
              "default": 'circle'
            },
            radius: {
              detail: '图标（circle）半径',
              "default": 5
            },
            lineWidth: {
              detail: '图标描边宽度',
              "default": 1
            },
            fillStyle: {
              detail: '图标颜色，一般会从data里面取，这里是默认色',
              "default": null
            }
          }
        },
        label: {
          detail: '文本配置',
          propertys: {
            textAlign: {
              detail: '水平对齐方式',
              "default": 'left'
            },
            textBaseline: {
              detail: '文本基线对齐方式',
              "default": 'middle'
            },
            fontColor: {
              detail: '文本颜色',
              "default": '#333333'
            },
            cursor: {
              detail: '鼠标样式',
              "default": 'pointer'
            },
            format: {
              detail: '文本格式化处理函数',
              "default": null
            }
          }
        },
        triggerEventType: {
          detail: '触发事件',
          "default": 'click,tap'
        },
        activeEnabled: {
          detail: '是否启动图例的交互事件',
          "default": true
        },
        tipsEnabled: {
          detail: '是否开启图例的tips',
          "default": false
        }
      };
    }
  }]);

  function Legend(opt, app) {
    var _this;

    (0, _classCallCheck2["default"])(this, Legend);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Legend).call(this, opt, app));
    _this.name = "legend";

    _.extend(true, (0, _assertThisInitialized2["default"])(_this), (0, _tools.getDefaultProps)(Legend.defaultProps()), opt);
    /* data的数据结构为
    [
        //descartes中用到的时候还会带入yAxis
        {name: "uv", color: "#ff8533", field: '' ...如果手动传入数据只需要前面这三个 enabled: true, ind: 0, } //外部只需要传field和fillStyle就行了 activate是内部状态
    ]
    */


    _this.data = _this._getLegendData(opt); //this.position = "top" ; //图例所在的方向top,right,bottom,left
    //this.direction = "h"; //横向 top,bottom --> h left,right -- >v

    if (!opt.direction && opt.position) {
      if (_this.position == "left" || _this.position == "right") {
        _this.direction = 'v';
      } else {
        _this.direction = 'h';
      }

      ;
    }

    ;
    _this.sprite = new _canvax["default"].Display.Sprite({
      id: "LegendSprite",
      context: {
        x: _this.pos.x,
        y: _this.pos.y
      }
    });

    _this.app.stage.addChild(_this.sprite);

    _this.widget(); //图例是需要自己绘制完成后，才能拿到高宽来设置自己的位置


    _this.layout();

    return _this;
  }

  (0, _createClass2["default"])(Legend, [{
    key: "_getLegendData",
    value: function _getLegendData(opt) {
      var legendData = opt.data;

      if (legendData) {
        _.each(legendData, function (item, i) {
          item.enabled = true;
          item.ind = i;
        }); //delete opt.data;

      } else {
        legendData = this.app.getLegendData();
      }

      ;
      return legendData || [];
    }
  }, {
    key: "layout",
    value: function layout() {
      var app = this.app;
      var width = this.width + this.margin.left + this.margin.right;
      var height = this.height + this.margin.top + this.margin.bottom;
      var x = app.padding.left;
      var y = app.padding.top;

      if (this.position == "right") {
        x = app.width - app.padding.right - width;
      }

      ;

      if (this.position == "bottom") {
        y = app.height - app.padding.bottom - height + this.icon.height / 2; //TODO:这样的设置到了中线了
      }

      ;
      var layoutWidth, layoutHeight; //然后把app的padding扩展开来

      if (this.position == "left" || this.position == "right") {
        // v
        app.padding[this.position] += width;
        layoutWidth = width;
        layoutHeight = app.height - app.padding.top - app.padding.bottom;
      } else if (this.position == "top" || this.position == "bottom") {
        // h
        app.padding[this.position] += height;
        layoutWidth = app.width - app.padding.right - app.padding.left;
        layoutHeight = height;
      }

      ; //然后计算textAlign,上面的pos.x 已经是按照默认的left计算过了的

      if (this.textAlign == 'center') {
        x += layoutWidth / 2 - this.width / 2;
      }

      ;

      if (this.textAlign == 'right') {
        x += layoutWidth - this.width;
      }

      ;
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
        if (this.textAlign == "left" && (this.position == "top" || this.position == "bottom")) {
          this.pos.x = _coord.getSizeAndOrigin().origin.x + this.icon.radius;
        }

        ;
      }

      ;
      this.setPosition();
    }
  }, {
    key: "widget",
    value: function widget() {
      var me = this;
      var viewWidth = this.app.width - this.app.padding.left - this.app.padding.right;
      var viewHeight = this.app.height - this.app.padding.top - this.app.padding.bottom;
      var maxItemWidth = 0;
      var width = 0,
          height = 0;
      var x = 0,
          y = 0;
      var rows = 1;
      var isOver = false; //如果legend过多

      _.each(this.data, function (obj, i) {
        if (isOver) return;
        var fillStyle = !obj.enabled ? "#ccc" : obj.color || "#999";

        if (me.icon.fillStyle) {
          var _fillStyle = me._getProp(me.icon.fillStyle, obj);

          if (_fillStyle) {
            fillStyle = _fillStyle;
          }
        }

        ;

        var _icon = new Circle({
          id: "legend_field_icon_" + i,
          context: {
            x: 0,
            y: me.icon.height / 3,
            fillStyle: fillStyle,
            r: me.icon.radius,
            cursor: "pointer"
          }
        });

        _icon.on(event.types.get(), function (e) {//... 代理到sprit上面处理
        });

        var _text = obj.name;

        if (me.label.format) {
          _text = me.label.format(obj.name, obj);
        }

        ;
        var txt = new _canvax["default"].Display.Text(_text, {
          id: "legend_field_txt_" + i,
          context: {
            x: me.icon.radius + 3,
            y: me.icon.height / 3,
            textAlign: me.label.textAlign,
            //"left",
            textBaseline: me.label.textBaseline,
            //"middle",
            fillStyle: me.label.fontColor,
            //"#333", //obj.color
            cursor: me.label.cursor //"pointer"

          }
        });
        txt.on(event.types.get(), function (e) {//... 代理到sprit上面处理
        });
        var txtW = txt.getTextWidth();
        var itemW = txtW + me.icon.radius * 2 + 20;
        maxItemWidth = Math.max(maxItemWidth, itemW);
        var spItemC = {
          height: me.icon.height
        };

        if (me.direction == "v") {
          if (y + me.icon.height > viewHeight) {
            if (x > viewWidth * 0.3) {
              isOver = true;
              return;
            }

            ;
            x += maxItemWidth;
            y = 0;
          }

          ;
          spItemC.x = x;
          spItemC.y = y;
          y += me.icon.height;
          height = Math.max(height, y);
        } else {
          //横向排布
          if (x + itemW > viewWidth) {
            if (me.icon.height * (rows + 1) > viewHeight * 0.3) {
              isOver = true;
              return;
            }

            ;
            x = 0;
            rows++;
          }

          ;
          spItemC.x = x;
          spItemC.y = me.icon.height * (rows - 1);
          x += itemW;
          width = Math.max(width, x);
        }

        ;
        var sprite = new _canvax["default"].Display.Sprite({
          id: "legend_field_" + i,
          context: spItemC
        });
        sprite.addChild(_icon);
        sprite.addChild(txt);
        sprite.context.width = itemW;
        me.sprite.addChild(sprite);
        sprite.on(event.types.get(), function (e) {
          if (me.triggerEventType.indexOf(e.type) > -1 && me.activeEnabled) {
            //只有一个field的时候，不支持取消
            if (_.filter(me.data, function (obj) {
              return obj.enabled;
            }).length == 1) {
              if (obj.enabled) {
                return;
              }
            }

            ;
            obj.enabled = !obj.enabled;
            _icon.context.fillStyle = !obj.enabled ? "#ccc" : obj.color || "#999";

            if (obj.enabled) {
              me.app.show(obj.name, new _trigger["default"](this, obj));
            } else {
              me.app.hide(obj.name, new _trigger["default"](this, obj));
            }

            ;
          }

          ;

          if (me.tipsEnabled) {
            if (e.type == 'mouseover' || e.type == 'mousemove') {
              e.eventInfo = me._getInfoHandler(e, obj);
            }

            ;

            if (e.type == 'mouseout') {
              delete e.eventInfo;
            }

            ;
            me.app.fire(e.type, e);
          }

          ;
        });
      });

      if (this.direction == "h") {
        me.width = me.sprite.context.width = width;
        me.height = me.sprite.context.height = me.icon.height * rows;
      } else {
        me.width = me.sprite.context.width = x + maxItemWidth;
        me.height = me.sprite.context.height = height;
      } //me.width = me.sprite.context.width  = width;
      //me.height = me.sprite.context.height = height;

    }
  }, {
    key: "_getInfoHandler",
    value: function _getInfoHandler(e, data) {
      return {
        type: "legend",
        triggerType: 'legend',
        trigger: this,
        tipsEnabled: this.tipsEnabled,
        //title : data.name,
        nodes: [{
          name: data.name,
          fillStyle: data.color
        }]
      };
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
  }]);
  return Legend;
}(_component["default"]);

_component["default"].registerComponent(Legend, 'legend');

var _default = Legend;
exports["default"] = _default;