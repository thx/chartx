"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

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

var _canvax = _interopRequireDefault(require("canvax"));

var _index = _interopRequireDefault(require("../index"));

var _mmvis = require("mmvis");

var force = _interopRequireWildcard(require("../../../layout/force/index"));

var Rect = _canvax["default"].Shapes.Rect;
var Path = _canvax["default"].Shapes.Path;
var Arrow = _canvax["default"].Shapes.Arrow;
var Circle = _canvax["default"].Shapes.Circle;
var Text = _canvax["default"].Display.Text;
var Line = _canvax["default"].Shapes.Line;

var Force =
/*#__PURE__*/
function (_GraphsBase) {
  (0, _inherits2["default"])(Force, _GraphsBase);
  (0, _createClass2["default"])(Force, null, [{
    key: "defaultProps",
    value: function defaultProps() {
      return {
        keyField: {
          detail: 'key字段',
          "default": 'key'
        },
        valueField: {
          detail: 'value字段',
          "default": 'value'
        },
        node: {
          detail: '单个节点的配置',
          propertys: {
            shapeType: {
              detail: '节点图形',
              "default": 'circle'
            },
            maxWidth: {
              detail: '节点最大的width',
              "default": 200
            },
            width: {
              detail: '内容的width',
              "default": null
            },
            height: {
              detail: '内容的height',
              "default": null
            },
            radius: {
              detail: '圆角角度',
              "default": 6
            },
            fillStyle: {
              detail: '节点背景色',
              "default": '#acdf7d'
            },
            strokeStyle: {
              detail: '描边颜色',
              "default": '#e5e5e5'
            },
            padding: {
              detail: 'node节点容器到内容的边距',
              "default": 10
            },
            content: {
              detail: '节点内容配置',
              propertys: {
                field: {
                  detail: '内容字段',
                  documentation: '默认content字段',
                  "default": 'content'
                },
                fontColor: {
                  detail: '内容文本颜色',
                  "default": '#666'
                },
                format: {
                  detail: '内容格式化处理函数',
                  "default": null
                },
                textAlign: {
                  detail: "textAlign",
                  "default": "center"
                },
                textBaseline: {
                  detail: 'textBaseline',
                  "default": "middle"
                }
              }
            }
          }
        },
        line: {
          detail: '两个节点连线配置',
          propertys: {
            lineWidth: {
              detail: '线宽',
              "default": 1
            },
            strokeStyle: {
              detail: '连线的颜色',
              "default": '#e5e5e5'
            },
            lineType: {
              detail: '连线样式（虚线等）',
              "default": 'solid'
            },
            arrow: {
              detail: '是否有箭头',
              "default": true
            }
          }
        },
        status: {
          detail: '一些开关配置',
          propertys: {
            transform: {
              detail: "是否启动拖拽缩放整个画布",
              propertys: {
                fitView: {
                  detail: "自动缩放",
                  "default": '' //autoZoom

                },
                enabled: {
                  detail: "是否开启",
                  "default": true
                },
                scale: {
                  detail: "缩放值",
                  "default": 1
                },
                scaleOrigin: {
                  detail: "缩放原点",
                  "default": {
                    x: 0,
                    y: 0
                  }
                }
              }
            }
          }
        }
      };
    }
  }]);

  function Force(opt, app) {
    var _this;

    (0, _classCallCheck2["default"])(this, Force);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Force).call(this, opt, app));
    _this.type = "force";

    _mmvis._.extend(true, (0, _assertThisInitialized2["default"])(_this), (0, _mmvis.getDefaultProps)(Force.defaultProps()), opt);

    _this.domContainer = app.canvax.domView;

    _this.init();

    return _this;
  }

  (0, _createClass2["default"])(Force, [{
    key: "init",
    value: function init() {
      this.nodesSp = new _canvax["default"].Display.Sprite({
        id: "nodesSp"
      });
      this.edgesSp = new _canvax["default"].Display.Sprite({
        id: "edgesSp"
      });
      this.graphsSp = new _canvax["default"].Display.Sprite({
        id: "graphsSp"
      });
      this.graphsSp.addChild(this.edgesSp);
      this.graphsSp.addChild(this.nodesSp);
      this.sprite.addChild(this.graphsSp);
    }
  }, {
    key: "draw",
    value: function draw(opt) {
      !opt && (opt = {});

      _mmvis._.extend(true, this, opt);

      this.data = opt.data || this._initData();
      this.widget();
    }
  }, {
    key: "_initData",
    value: function _initData() {
      //和关系图那边保持data格式的统一
      var data = {
        nodes: [//{ type,key,content,ctype,width,height,x,y }
        ],
        edges: [//{ type,key[],content,ctype,width,height,x,y }
        ],
        size: {
          width: this.app.width,
          height: this.app.height
        }
      };
      var _nodeMap = {};

      for (var i = 0; i < this.dataFrame.length; i++) {
        var rowData = this.dataFrame.getRowDataAt(i);

        var fields = _mmvis._.flatten([(rowData[this.keyField] + "").split(",")]);

        var content = this._getContent(rowData);

        var key = fields.length == 1 ? fields[0] : fields;
        var element = new _canvax["default"].Display.Sprite({
          id: "nodeSp_" + key
        });
        this.graphsSp.addChild(element);
        var node = {
          type: "force",
          iNode: i,
          rowData: rowData,
          key: key,
          content: content,
          ctype: this._checkHtml(content) ? 'html' : 'canvas',
          //下面三个属性在_setElementAndSize中设置
          element: element,
          //外面传的layout数据可能没有element，widget的时候要检测下
          width: null,
          height: null,
          radius: 1,
          //默认为1
          //这个在layout的时候设置
          x: null,
          y: null,
          shapeType: null,
          //如果是edge，要填写这两节点
          source: null,
          target: null
        }; //_.extend(node, this._getElementAndSize(node));

        if (fields.length == 1) {
          node.shapeType = this.getProp(this.node.shapeType, node);
          data.nodes.push(node);
          _nodeMap[node.key] = node;
        } else {
          node.shapeType = "line";
          data.edges.push(node);
        }

        ;
      }

      ; //然后给edge填写source 和 target

      _mmvis._.each(data.edges, function (edge) {
        var keys = edge.key;
        edge.source = _nodeMap[keys[0]];
        edge.target = _nodeMap[keys[1]];
      });

      return data;
    }
  }, {
    key: "widget",
    value: function widget() {
      var _this2 = this;

      var me = this;
      var keyField = this.keyField;
      var valField = this.valueField;
      var links = this.data.edges.map(function (d) {
        //source: "Napoleon", target: "Myriel", value: 1
        return {
          source: d.source[keyField],
          target: d.target[keyField],
          value: d.rowData[valField],
          nodeData: d
        };
      });
      var nodes = this.data.nodes.map(function (d) {
        var node = Object.create(d);
        node.id = d.key;
        node.nodeData = d;
        return node;
      });
      var _this$data$size = this.data.size,
          width = _this$data$size.width,
          height = _this$data$size.height;
      var simulation = force.forceSimulation(nodes).force("link", force.forceLink(links).id(function (d) {
        return d.id;
      })).force("charge", force.forceManyBody()).force("center", force.forceCenter(width / 2, height / 2)).force("x", force.forceX(width / 2).strength(0.045)).force("y", force.forceY(height / 2).strength(0.045));
      nodes.forEach(function (node) {
        var fillStyle = me.getProp(me.node.fillStyle, node.nodeData);
        var strokeStyle = me.getProp(me.node.strokeStyle, node.nodeData); //let radius = _.flatten([me.getProp(me.node.radius, node)]);

        var _node = new Circle({
          context: {
            r: 8,
            fillStyle: fillStyle,
            strokeStyle: strokeStyle
          }
        });

        node.nodeData.element.addChild(_node);

        var _label = new Text(node.nodeData.rowData.label, {
          context: {
            fontSize: 11,
            fillStyle: "#bfa08b",
            textBaseline: "middle",
            textAlign: "center",
            globalAlpha: 0.7
          }
        });

        node.nodeData.element.addChild(_label);
      });
      links.forEach(function (link) {
        var lineWidth = me.getProp(me.line.lineWidth, link.nodeData);
        var strokeStyle = me.getProp(me.line.strokeStyle, link.nodeData);

        var _line = new Line({
          context: {
            lineWidth: lineWidth,
            strokeStyle: strokeStyle,
            start: {
              x: 0,
              y: 0
            },
            end: {
              x: 0,
              y: 0
            },
            globalAlpha: 0.4
          }
        });

        _this2.edgesSp.addChild(_line);

        link.line = _line;
      });
      simulation.on("tick", function () {
        if (simulation.alpha() <= 0.05) {
          simulation.stop();
          return;
        }

        ;
        nodes.forEach(function (node) {
          var elemCtx = node.nodeData.element.context;

          if (elemCtx) {
            elemCtx.x = node.x;
            elemCtx.y = node.y;
          }

          ;
        });
        links.forEach(function (link) {
          var lineCtx = link.line.context;

          if (lineCtx) {
            lineCtx.start.x = link.source.x;
            lineCtx.start.y = link.source.y;
            lineCtx.end.x = link.target.x;
            lineCtx.end.y = link.target.y;
          }
        });
      });
    }
    /**
     * 字符串是否含有html标签的检测
     */

  }, {
    key: "_checkHtml",
    value: function _checkHtml(str) {
      var reg = /<[^>]+>/g;
      return reg.test(str);
    }
  }, {
    key: "_getContent",
    value: function _getContent(rowData) {
      var me = this;

      var _c; //this.node.content;


      if (this._isField(this.node.content.field)) {
        _c = rowData[this.node.content.field];
      }

      ;

      if (me.node.content.format && _mmvis._.isFunction(me.node.content.format)) {
        _c = me.node.content.format.apply(this, [_c, rowData]);
      }

      ;
      return _c;
    }
  }, {
    key: "_isField",
    value: function _isField(str) {
      return ~this.dataFrame.fields.indexOf(str);
    }
  }, {
    key: "getNodesAt",
    value: function getNodesAt(index) {}
  }, {
    key: "getProp",
    value: function getProp(prop, nodeData) {
      var _prop = prop;

      if (this._isField(prop) && nodeData.rowData) {
        _prop = nodeData.rowData[prop];
      } else {
        if (_mmvis._.isArray(prop)) {
          _prop = prop[nodeData.iNode];
        }

        ;

        if (_mmvis._.isFunction(prop)) {
          _prop = prop.apply(this, [nodeData]);
        }

        ;
      }

      ;
      return _prop;
    }
  }]);
  return Force;
}(_index["default"]);

_mmvis.global.registerComponent(Force, 'graphs', 'force');

var _default = Force;
exports["default"] = _default;