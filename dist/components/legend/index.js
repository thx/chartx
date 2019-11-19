"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../component", "canvax", "mmvis", "../trigger"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../component"), require("canvax"), require("mmvis"), require("../trigger"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.component, global.canvax, global.mmvis, global.trigger);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _component, _canvax, _mmvis, _trigger) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _component2 = _interopRequireDefault(_component);

  var _canvax2 = _interopRequireDefault(_canvax);

  var _trigger2 = _interopRequireDefault(_trigger);

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

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
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

  var Circle = _canvax2["default"].Shapes.Circle;

  var Legend = function (_Component) {
    _inherits(Legend, _Component);

    _createClass(Legend, null, [{
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
                "default": '#999'
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
          activeEnabled: {
            detail: '是否启动图例的',
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

      _classCallCheck(this, Legend);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Legend).call(this, opt, app));
      _this.name = "legend";

      _mmvis._.extend(true, _assertThisInitialized(_this), (0, _mmvis.getDefaultProps)(Legend.defaultProps()), opt);
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
      _this.sprite = new _canvax2["default"].Display.Sprite({
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

    _createClass(Legend, [{
      key: "_getLegendData",
      value: function _getLegendData(opt) {
        var legendData = opt.data;

        if (legendData) {
          _mmvis._.each(legendData, function (item, i) {
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
          y = app.height - app.padding.bottom - height / 2; //TODO:这样的设置到了中线了
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

        _mmvis._.each(this.data, function (obj, i) {
          if (isOver) return;

          var _icon = new Circle({
            id: "legend_field_icon_" + i,
            context: {
              x: 0,
              y: me.icon.height / 3,
              fillStyle: !obj.enabled ? "#ccc" : obj.color || "#999",
              r: me.icon.radius,
              cursor: "pointer"
            }
          });

          _icon.on(_mmvis.event.types.get(), function (e) {//... 代理到sprit上面处理
          });

          var _text = obj.name;

          if (me.label.format) {
            _text = me.label.format(obj.name, obj);
          }

          ;
          var txt = new _canvax2["default"].Display.Text(_text, {
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
          txt.on(_mmvis.event.types.get(), function (e) {//... 代理到sprit上面处理
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
          var sprite = new _canvax2["default"].Display.Sprite({
            id: "legend_field_" + i,
            context: spItemC
          });
          sprite.addChild(_icon);
          sprite.addChild(txt);
          sprite.context.width = itemW;
          me.sprite.addChild(sprite);
          sprite.on(_mmvis.event.types.get(), function (e) {
            if (e.type == "click" && me.activeEnabled) {
              //只有一个field的时候，不支持取消
              if (_mmvis._.filter(me.data, function (obj) {
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
                me.app.show(obj.name, new _trigger2["default"](this, obj));
              } else {
                me.app.hide(obj.name, new _trigger2["default"](this, obj));
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
    }]);

    return Legend;
  }(_component2["default"]);

  _mmvis.global.registerComponent(Legend, 'legend');

  exports["default"] = Legend;
});