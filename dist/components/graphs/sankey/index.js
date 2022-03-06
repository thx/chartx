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

var _canvax = _interopRequireDefault(require("canvax"));

var _index = _interopRequireDefault(require("../index"));

var _index2 = _interopRequireDefault(require("../../../layout/sankey/index"));

var _tools = require("../../../utils/tools");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var _ = _canvax["default"]._,
    event = _canvax["default"].event;
var Path = _canvax["default"].Shapes.Path;
var Rect = _canvax["default"].Shapes.Rect;

var sankeyGraphs = /*#__PURE__*/function (_GraphsBase) {
  (0, _inherits2["default"])(sankeyGraphs, _GraphsBase);

  var _super = _createSuper(sankeyGraphs);

  function sankeyGraphs(opt, app) {
    var _this;

    (0, _classCallCheck2["default"])(this, sankeyGraphs);
    _this = _super.call(this, opt, app);
    _this.type = "sankey";

    _.extend(true, (0, _assertThisInitialized2["default"])(_this), (0, _tools.getDefaultProps)(sankeyGraphs.defaultProps()), opt);

    _this.init();

    return _this;
  }

  (0, _createClass2["default"])(sankeyGraphs, [{
    key: "init",
    value: function init() {
      this._links = new _canvax["default"].Display.Sprite();
      this._nodes = new _canvax["default"].Display.Sprite();
      this._labels = new _canvax["default"].Display.Sprite();
      this.sprite.addChild(this._links);
      this.sprite.addChild(this._nodes);
      this.sprite.addChild(this._labels);
    }
  }, {
    key: "draw",
    value: function draw(opt) {
      !opt && (opt = {});

      _.extend(true, this, opt);

      this.data = this._trimGraphs();

      this._widget();

      this.sprite.context.x = this.origin.x;
      this.sprite.context.y = this.origin.y;
      this.fire("complete");
    }
  }, {
    key: "_trimGraphs",
    value: function _trimGraphs() {
      var me = this;
      var nodes = [];
      var links = [];
      var keyDatas = me.dataFrame.getFieldData(me.keyField);
      var valueDatas = me.dataFrame.getFieldData(me.field);
      var parentFields = me.dataFrame.getFieldData(me.parentField);
      var nodeMap = {}; //name:ind

      _.each(keyDatas, function (key, i) {
        var nodeNames = [];

        if (me.parentField) {
          nodeNames.push(parentFields[i]);
        }

        ;
        nodeNames = nodeNames.concat(key.split(/[|]/));

        _.each(nodeNames, function (name) {
          if (nodeMap[name] === undefined) {
            nodeMap[name] = nodes.length;
            nodes.push({
              name: name
            });
          }
        });
      });

      _.each(keyDatas, function (key, i) {
        //let nodeNames = key.split(/[,|]/);
        var nodeNames = [];

        if (me.parentField) {
          nodeNames.push(parentFields[i]);
        }

        ;
        nodeNames = nodeNames.concat(key.split(/[|]/));

        if (nodeNames.length == 2) {
          links.push({
            source: nodeMap[nodeNames[0]],
            target: nodeMap[nodeNames[1]],
            value: valueDatas[i]
          });
        }
      });

      return (0, _index2["default"])().nodeWidth(this.node.width).nodePadding(this.node.padding).nodeSort(this.node.sort).size([this.width, this.height]).nodes(nodes).links(links).layout(16);
    }
  }, {
    key: "_widget",
    value: function _widget() {
      this._drawNodes();

      this._drawLinks();

      this._drawLabels();
    }
  }, {
    key: "_getColor",
    value: function _getColor(style, node, ind) {
      var me = this;
      var color = style;

      if (_.isArray(color)) {
        color = color[ind];
      }

      if (_.isFunction(color)) {
        color = color(node);
      }

      if (!color) {
        color = me.app.getTheme(ind);
      }

      return color;
    }
  }, {
    key: "_drawNodes",
    value: function _drawNodes() {
      var nodes = this.data.nodes();
      var me = this;

      _.each(nodes, function (node, i) {
        node.field = me.field;

        var nodeColor = me._getColor(me.node.fillStyle, node, i);

        var nodeEl = new Rect({
          xyToInt: false,
          context: {
            x: node.x,
            y: node.y,
            width: me.data.nodeWidth(),
            height: Math.max(node.dy, 1),
            fillStyle: nodeColor
          }
        });
        nodeEl.data = node;

        me._nodes.addChild(nodeEl);
      });
    }
  }, {
    key: "_drawLinks",
    value: function _drawLinks() {
      var links = this.data.links();
      var me = this;

      _.each(links, function (link, i) {
        var linkColor = me._getColor(me.line.strokeStyle, link, i);

        var d = me.data.link()(link);

        var _path = new Path({
          xyToInt: false,
          context: {
            path: d,
            fillStyle: linkColor,
            //lineWidth: Math.max(1, link.dy),
            globalAlpha: me.line.alpha,
            cursor: "pointer"
          }
        });

        _path.__glpha = me.line.alpha;
        _path.link = link;

        _path.on(event.types.get(), function (e) {
          if (me.line.focus.enabled) {
            if (e.type == 'mouseover') {
              this.__glpha += 0.1;
            }

            ;

            if (e.type == 'mouseout') {
              this.__glpha -= 0.1;
            }

            ;
          }

          ;
          var linkData = this.link; //type给tips用

          linkData.type = "sankey";
          link.field = me.field;
          link.__no__name = true;
          e.eventInfo = {
            trigger: me.node,
            title: linkData.source.name + " <span style='display:inline-block;margin-left:4px;position:relative;top:-0.5px;font-size:16px;left:-3px;'>></span> " + linkData.target.name,
            nodes: [linkData]
          }; //fire到root上面去的是为了让root去处理tips

          me.app.fire(e.type, e);
        });

        me._links.addChild(_path);
      });
    }
  }, {
    key: "_drawLabels",
    value: function _drawLabels() {
      var nodes = this.data.nodes();
      var me = this;

      _.each(nodes, function (node) {
        var textAlign = me.label.textAlign;
        var x = node.x + me.data.nodeWidth() + 4;
        /*
        if( x > me.width/2 ){
            x  = node.x - 4;
            textAlign = 'right';
        } else {
            x += 4;
        };
        */

        var y = node.y + Math.max(node.dy / 2, 1);
        var txt = me.label.format ? me.label.format(node.name, node) : node.name;
        var label = new _canvax["default"].Display.Text(txt, {
          context: {
            x: x,
            y: y,
            fillStyle: me.label.fontColor,
            fontSize: me.label.fontSize,
            textAlign: textAlign,
            textBaseline: me.label.verticalAlign
          }
        });

        me._labels.addChild(label);

        if (label.getTextWidth() + x > me.width) {
          label.context.x = node.x - 4;
          label.context.textAlign = 'right';
        }

        ;
      });
    }
  }], [{
    key: "defaultProps",
    value: function defaultProps() {
      return {
        keyField: {
          detail: 'key字段',
          "default": null
        },
        field: {
          detail: 'value字段',
          "default": 'value'
        },
        parentField: {
          detail: 'parent字段',
          "default": null
        },
        node: {
          detail: 'node',
          propertys: {
            width: {
              detail: '节点宽',
              "default": 18
            },
            padding: {
              detail: '节点间距',
              "default": 10
            },
            sort: {
              detail: '节点排序字段',
              "default": function _default(a, b) {
                return a.y - b.y;
              }
            },
            fillStyle: {
              detail: '节点背景色',
              "default": null
            }
          }
        },
        line: {
          detail: '线设置',
          propertys: {
            strokeStyle: {
              detail: '线颜色',
              "default": 'blue'
            },
            alpha: {
              detail: '线透明度',
              "default": 0.3
            },
            focus: {
              detail: '图形的hover设置',
              propertys: {
                enabled: {
                  detail: '是否开启',
                  "default": true
                }
              }
            }
          }
        },
        label: {
          detail: '文本设置',
          propertys: {
            fontColor: {
              detail: '文本颜色',
              "default": '#666666'
            },
            fontSize: {
              detail: '文本字体大小',
              "default": 12
            },
            textAlign: {
              detail: '水平对齐方式',
              "default": 'left'
            },
            verticalAlign: {
              detail: '垂直对齐方式',
              "default": 'middle'
            },
            format: {
              detail: '文本格式函数',
              "default": null
            }
          }
        }
      };
    }
  }, {
    key: "polyfill",
    value: function polyfill(opt) {
      if (opt.valueField) {
        //20220304 所有的graph都统一一个field
        opt.field = opt.valueField;
        delete opt.valueField;
      }

      return opt;
    }
  }]);
  return sankeyGraphs;
}(_index["default"]);

_index["default"].registerComponent(sankeyGraphs, 'graphs', 'sankey');

var _default2 = sankeyGraphs;
exports["default"] = _default2;