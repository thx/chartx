"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

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

var force = _interopRequireWildcard(require("d3-force"));

var _tools = require("../../../utils/tools");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var _ = _canvax["default"]._,
    event = _canvax["default"].event;
var Circle = _canvax["default"].Shapes.Circle;
var Text = _canvax["default"].Display.Text;
var Line = _canvax["default"].Shapes.Line;

var Force = /*#__PURE__*/function (_GraphsBase) {
  (0, _inherits2["default"])(Force, _GraphsBase);

  var _super = _createSuper(Force);

  function Force(opt, app) {
    var _this;

    (0, _classCallCheck2["default"])(this, Force);
    _this = _super.call(this, opt, app);
    _this.type = "force";

    _.extend(true, (0, _assertThisInitialized2["default"])(_this), (0, _tools.getDefaultProps)(Force.defaultProps()), opt);

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

      _.extend(true, this, opt);

      this.data = opt.data || this._initData();
      this.widget();
      this.fire("complete");
    }
  }, {
    key: "_initData",
    value: function _initData() {
      var _this2 = this;

      //和关系图那边保持data格式的统一
      var data = {
        nodes: [//{ type,key,label,ctype,width,height,x,y }
        ],
        edges: [//{ type,key[],label,ctype,width,height,x,y }
        ],
        size: {
          width: this.app.width,
          height: this.app.height
        }
      };
      var _nodeMap = {};
      var nodeValMin = 0,
          nodeValMax = 0,
          lineValMin = 0,
          lineValMax = 0;

      for (var i = 0; i < this.dataFrame.length; i++) {
        var rowData = this.dataFrame.getRowDataAt(i);

        var fields = _.flatten([(rowData[this.keyField] + "").split(",")]);

        var label = this._getContent(rowData);

        var key = fields.length == 1 ? fields[0] : fields;
        var value = rowData[this.field];
        var element = new _canvax["default"].Display.Sprite({
          id: "nodeSp_" + key
        });
        this.graphsSp.addChild(element);
        var node = {
          type: "force",
          field: this.field,
          iNode: i,
          rowData: rowData,
          key: key,
          value: value,
          label: label,
          //下面三个属性在_setElementAndSize中设置
          element: element,
          //外面传的layout数据可能没有element，widget的时候要检测下
          width: null,
          height: null,
          //radius : 1,    //默认为1
          //distance: 20,  //如果是
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

          if (value != undefined) {
            nodeValMin = Math.min(nodeValMin, value);
            nodeValMax = Math.max(nodeValMax, value);
          }
        } else {
          node.shapeType = "line";
          data.edges.push(node);

          if (value != undefined) {
            lineValMin = Math.min(lineValMin, value);
            lineValMax = Math.max(lineValMax, value);
          }
        }

        ;
      }

      ;
      this.nodeValMin = nodeValMin;
      this.nodeValMax = nodeValMax;
      this.lineValMin = lineValMin;
      this.lineValMax = lineValMax;
      data.nodes.forEach(function (node) {
        //计算 node的 半径 width height 和 style等
        node.radius = _this2.node.radius ? _this2.getProp(_this2.node.radius, node) : _this2._getNodeRadius(node);
        node.width = node.height = node.radius * 2;
      });
      data.edges.forEach(function (edge) {
        var keys = edge.key;
        edge.source = _nodeMap[keys[0]];
        edge.target = _nodeMap[keys[1]];
        edge.distance = _this2.line.distance ? _this2.getProp(_this2.node.distance, edge) : _this2._getLineDistance(edge);
      });
      return data;
    } //this.node.radius为null的时候 内部默认的计算radius的方法

  }, {
    key: "_getNodeRadius",
    value: function _getNodeRadius(nodeData) {
      var val = nodeData.value;
      var radius = this.node.radiusMin;

      if (val) {
        radius += (this.node.radiusMax - this.node.radiusMin) / (this.nodeValMax - this.nodeValMin) * val;
      }

      return parseInt(radius);
    } //this.line.distance 为null的时候 内部默认的计算 distance 的方法

  }, {
    key: "_getLineDistance",
    value: function _getLineDistance(nodeData) {
      var val = nodeData.value;
      var distance = this.line.distanceMin;

      if (val) {
        distance += (this.line.distanceMax - this.line.distanceMin) / (this.lineValMax - this.lineValMin) * val;
      }

      return parseInt(distance);
    }
  }, {
    key: "widget",
    value: function widget() {
      var _this3 = this;

      var me = this;
      var keyField = this.keyField;
      var field = this.field;
      var links = this.data.edges.map(function (d) {
        //source: "Napoleon", target: "Myriel", value: 1
        return {
          source: d.source[keyField],
          target: d.target[keyField],
          value: d.rowData[field],
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
      }).distance(function (edge, edgeIndex, edges) {
        var distance = edge.nodeData.distance;
        var distanceNodes = edge.source.nodeData.radius + edge.target.nodeData.radius;
        return Math.max(distance, distanceNodes);
      })).force("charge", force.forceManyBody().distanceMin(this.line.distanceMin).distanceMax(this.line.distanceMax).strength(this.node.strength)) //节点间作用力
      .force("center", force.forceCenter(width / 2, height / 2)).force('collide', force.forceCollide().radius(function (node, nodeIndex, nodes) {
        return node.nodeData.radius;
      })).force("x", force.forceX()).force("y", force.forceY()).alpha(0.5);
      nodes.forEach(function (node) {
        var fillStyle = me.getProp(me.node.fillStyle, node.nodeData);
        var strokeStyle = me.getProp(me.node.strokeStyle, node.nodeData);
        var lineWidth = me.getProp(me.node.lineWidth, node.nodeData);
        var nodeAlpha = me.getProp(me.node.nodeAlpha, node.nodeData); //写回nodeData里面，tips等地方需要

        node.nodeData.fillStyle = fillStyle;
        var r = node.nodeData.radius;

        var _node = new Circle({
          context: {
            r: r,
            fillStyle: fillStyle,
            strokeStyle: strokeStyle,
            lineWidth: lineWidth,
            globalAlpha: nodeAlpha,
            cursor: 'pointer'
          }
        });

        node.nodeData.element.addChild(_node);
        _node.nodeData = node.nodeData;

        _node.on(event.types.get(), function (e) {
          e.eventInfo = {
            trigger: 'this.node',
            nodes: [this.nodeData]
          };
          me.app.fire(e.type, e);
        });

        var labelFontSize = me.getProp(me.label.fontSize, node.nodeData);
        var labelFontColor = me.getProp(me.label.fontColor, node.nodeData);
        var labelTextBaseline = me.getProp(me.label.textBaseline, node.nodeData);
        var labelTextAlign = me.getProp(me.label.textAlign, node.nodeData);

        var _label = new Text(node.nodeData.label, {
          context: {
            fontSize: labelFontSize,
            fillStyle: labelFontColor,
            textBaseline: labelTextBaseline,
            textAlign: labelTextAlign,
            globalAlpha: 0.7
          }
        });

        node.nodeData.element.addChild(_label);
      });
      links.forEach(function (link) {
        var lineWidth = me.getProp(me.line.lineWidth, link.nodeData);
        var strokeStyle = me.getProp(me.line.strokeStyle, link.nodeData);
        var lineType = me.getProp(me.line.lineType, link.nodeData);
        var lineAlpha = me.getProp(me.line.lineAlpha, link.nodeData);
        link.nodeData.strokeStyle = strokeStyle;

        var _line = new Line({
          context: {
            lineWidth: lineWidth,
            strokeStyle: strokeStyle,
            lineType: lineType,
            start: {
              x: 0,
              y: 0
            },
            end: {
              x: 0,
              y: 0
            },
            globalAlpha: lineAlpha
          }
        });

        _this3.edgesSp.addChild(_line);

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

      var _c; //this.label;


      if (this._isField(this.label.field)) {
        _c = rowData[this.label.field];
      }

      ;

      if (me.label.format) {
        if (_.isFunction(me.label.format)) {
          _c = me.label.format.apply(this, [_c, rowData]);
        }
      } else {
        //否则用fieldConfig上面的
        var _coord = me.app.getComponent({
          name: 'coord'
        });

        var fieldConfig = _coord.getFieldConfig(me.keyField);

        if (fieldConfig) {
          _c = fieldConfig.getFormatValue(_c);
        }

        ;
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
    value: function getNodesAt() {}
  }, {
    key: "getProp",
    value: function getProp(prop, nodeData) {
      var _prop = prop;

      if (this._isField(prop) && nodeData.rowData) {
        _prop = nodeData.rowData[prop];
      } else {
        if (_.isArray(prop)) {
          _prop = prop[nodeData.iNode];
        }

        ;

        if (_.isFunction(prop)) {
          _prop = prop.apply(this, [nodeData]);
        }

        ;
      }

      ;
      return _prop;
    }
  }], [{
    key: "defaultProps",
    value: function defaultProps() {
      return {
        keyField: {
          detail: 'key字段',
          "default": ''
        },
        field: {
          detail: 'value字段，node，link都公用这个字段',
          "default": ''
        },
        node: {
          detail: '单个节点的配置',
          propertys: {
            shapeType: {
              detail: '节点图形',
              "default": 'circle'
            },
            radiusMin: {
              detail: '最小节点半径',
              "default": 6
            },
            radiusMax: {
              detail: '最大节点半径',
              "default": 30
            },
            radius: {
              detail: '节点半径',
              "default": null
            },
            fillStyle: {
              detail: '节点背景色',
              "default": '#acdf7d'
            },
            strokeStyle: {
              detail: '描边颜色',
              "default": '#e5e5e5'
            },
            lineWidth: {
              detail: '描边线宽',
              "default": 0
            },
            nodeAlpha: {
              detail: '节点透明度',
              "default": 1
            },
            strength: {
              detail: '节点之间作用力',
              "default": -300
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
            lineAlpha: {
              detail: '连线透明度',
              "default": 0.6
            },
            distanceMin: {
              detail: '最小连线距离',
              "default": 30
            },
            distanceMax: {
              detail: '最大连线距离',
              "default": 200
            },
            distance: {
              detail: '连线距离',
              "default": null
            },
            arrow: {
              detail: '是否有箭头',
              "default": true
            }
          }
        },
        label: {
          detail: '节点内容配置',
          propertys: {
            field: {
              detail: '内容字段',
              "default": 'label'
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
  return Force;
}(_index["default"]);

_index["default"].registerComponent(Force, 'graphs', 'force');

var _default = Force;
exports["default"] = _default;