"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "canvax", "../index", "../../../layout/sankey/index", "mmvis"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("canvax"), require("../index"), require("../../../layout/sankey/index"), require("mmvis"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.canvax, global.index, global.index, global.mmvis);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _canvax, _index, _index3, _mmvis) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _canvax2 = _interopRequireDefault(_canvax);

  var _index2 = _interopRequireDefault(_index);

  var _index4 = _interopRequireDefault(_index3);

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

  var Path = _canvax2["default"].Shapes.Path;
  var Rect = _canvax2["default"].Shapes.Rect;

  var sankeyGraphs = function (_GraphsBase) {
    _inherits(sankeyGraphs, _GraphsBase);

    _createClass(sankeyGraphs, null, [{
      key: "defaultProps",
      value: function defaultProps() {
        return {
          keyField: {
            detail: 'key字段',
            "default": null
          },
          valueField: {
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
    }]);

    function sankeyGraphs(opt, app) {
      var _this;

      _classCallCheck(this, sankeyGraphs);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(sankeyGraphs).call(this, opt, app));
      _this.type = "sankey";

      _mmvis._.extend(true, _assertThisInitialized(_this), (0, _mmvis.getDefaultProps)(sankeyGraphs.defaultProps()), opt);

      _this.init();

      return _this;
    }

    _createClass(sankeyGraphs, [{
      key: "init",
      value: function init() {
        this._links = new _canvax2["default"].Display.Sprite();
        this._nodes = new _canvax2["default"].Display.Sprite();
        this._labels = new _canvax2["default"].Display.Sprite();
        this.sprite.addChild(this._links);
        this.sprite.addChild(this._nodes);
        this.sprite.addChild(this._labels);
      }
    }, {
      key: "draw",
      value: function draw(opt) {
        !opt && (opt = {});

        _mmvis._.extend(true, this, opt);

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
        var valueDatas = me.dataFrame.getFieldData(me.valueField);
        var parentFields = me.dataFrame.getFieldData(me.parentField);
        var nodeMap = {}; //name:ind

        _mmvis._.each(keyDatas, function (key, i) {
          var nodeNames = [];

          if (me.parentField) {
            nodeNames.push(parentFields[i]);
          }

          ;
          nodeNames = nodeNames.concat(key.split(/[|]/));

          _mmvis._.each(nodeNames, function (name) {
            if (nodeMap[name] === undefined) {
              nodeMap[name] = nodes.length;
              nodes.push({
                name: name
              });
            }
          });
        });

        _mmvis._.each(keyDatas, function (key, i) {
          //var nodeNames = key.split(/[,|]/);
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

        return (0, _index4["default"])().nodeWidth(this.node.width).nodePadding(this.node.padding).nodeSort(this.node.sort).size([this.width, this.height]).nodes(nodes).links(links).layout(16);
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

        if (_mmvis._.isArray(color)) {
          color = color[ind];
        }

        if (_mmvis._.isFunction(color)) {
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

        _mmvis._.each(nodes, function (node, i) {
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

        _mmvis._.each(links, function (link, i) {
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

          _path.on(_mmvis.event.types.get(), function (e) {
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
            e.eventInfo = {
              trigger: me.node,
              title: linkData.source.name + " --<span style='position:relative;top:-0.5px;font-size:16px;left:-3px;'>></span> " + linkData.target.name,
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

        _mmvis._.each(nodes, function (node) {
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
          var label = new _canvax2["default"].Display.Text(txt, {
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
    }]);

    return sankeyGraphs;
  }(_index2["default"]);

  _mmvis.global.registerComponent(sankeyGraphs, 'graphs', 'sankey');

  exports["default"] = sankeyGraphs;
});