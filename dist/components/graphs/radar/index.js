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

var _tools = require("../../../utils/tools");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var _ = _canvax["default"]._,
    event = _canvax["default"].event;
var Polygon = _canvax["default"].Shapes.Polygon;
var Circle = _canvax["default"].Shapes.Circle;

var RadarGraphs = /*#__PURE__*/function (_GraphsBase) {
  (0, _inherits2["default"])(RadarGraphs, _GraphsBase);

  var _super = _createSuper(RadarGraphs);

  function RadarGraphs(opt, app) {
    var _this;

    (0, _classCallCheck2["default"])(this, RadarGraphs);
    _this = _super.call(this, opt, app);
    _this.type = "radar";
    _this.enabledField = null;
    _this.groups = {//uv : {
      //   area : ,
      //   nodes: 
      //}
    };

    _.extend(true, (0, _assertThisInitialized2["default"])(_this), (0, _tools.getDefaultProps)(RadarGraphs.defaultProps()), opt);

    _this.init();

    return _this;
  }

  (0, _createClass2["default"])(RadarGraphs, [{
    key: "init",
    value: function init() {}
  }, {
    key: "draw",
    value: function draw(opt) {
      !opt && (opt = {}); //let me = this;

      _.extend(true, this, opt);

      this.data = this._trimGraphs();

      this._widget();

      this.sprite.context.x = this.origin.x;
      this.sprite.context.y = this.origin.y;
      this.fire("complete");
    }
  }, {
    key: "_widget",
    value: function _widget() {
      var me = this;

      var _coord = this.app.getComponent({
        name: 'coord'
      });

      var iGroup = 0;

      _.each(this.data, function (list, field) {
        var group = {};
        var pointList = [];

        _.each(list, function (node) {
          pointList.push([node.point.x, node.point.y]);
        });

        var fieldMap = _coord.getFieldMapOf(field);

        var _strokeStyle = me._getStyle(me.line.strokeStyle, fieldMap, iGroup, fieldMap.color);

        var _lineType = me._getStyle(me.line.lineType, fieldMap, iGroup, fieldMap.color);

        var polyCtx = {
          pointList: pointList,
          cursor: "pointer"
        };

        if (me.line.enabled) {
          polyCtx.lineWidth = me.line.lineWidth;
          polyCtx.strokeStyle = _strokeStyle;
          polyCtx.lineType = _lineType;
        }

        ;

        if (me.area.enabled) {
          polyCtx.fillStyle = me._getStyle(me.area.fillStyle, fieldMap, iGroup, fieldMap.color);
          polyCtx.fillAlpha = me._getStyle(me.area.fillAlpha, fieldMap, iGroup, 1);
        }

        ;

        var _poly = new Polygon({
          hoverClone: false,
          context: polyCtx
        });

        group.area = _poly;
        me.sprite.addChild(_poly);
        _poly.__hoverFillAlpha = _poly.context.fillAlpha + 0.2;
        _poly.__fillAlpha = _poly.context.fillAlpha;

        _poly.on(event.types.get(), function (e) {
          if (e.type == "mouseover") {
            this.context.fillAlpha = this.__hoverFillAlpha;
          }

          ;

          if (e.type == "mouseout") {
            this.context.fillAlpha = this.__fillAlpha;
          }

          ;
          me.app.fire(e.type, e);
        });

        if (me.node.enabled) {
          //绘制圆点
          var _nodes = [];

          _.each(list, function (node, i) {
            pointList.push([node.point.x, node.point.y]);

            var _node = new Circle({
              context: {
                cursor: "pointer",
                x: node.point.x,
                y: node.point.y,
                r: me.node.radius,
                lineWidth: me.node.lineWidth,
                strokeStyle: me.node.strokeStyle,
                fillStyle: _strokeStyle
              }
            });

            me.sprite.addChild(_node);
            _node.iNode = i;
            _node.nodeData = node;
            _node._strokeStyle = _strokeStyle;

            _node.on(event.types.get(), function (e) {
              //这样就会直接用这个aAxisInd了，不会用e.point去做计算
              e.aAxisInd = this.iNode;
              e.eventInfo = {
                trigger: me.node,
                nodes: [this.nodeData]
              };
              me.app.fire(e.type, e);
            });

            _nodes.push(_node);
          });

          group.nodes = _nodes;
        }

        ;
        me.groups[field] = group;
        iGroup++;
      });
    }
  }, {
    key: "tipsPointerOf",
    value: function tipsPointerOf(e) {
      var me = this;
      me.tipsPointerHideOf(e);

      if (e.eventInfo && e.eventInfo.nodes) {
        _.each(e.eventInfo.nodes, function (eventNode) {
          if (me.data[eventNode.field]) {
            _.each(me.data[eventNode.field], function (n, i) {
              if (eventNode.iNode == i) {
                me.focusOf(n);
              } //else {
              //    me.unfocusOf(n);
              //}

            });
          }

          ;
        });
      }
    }
  }, {
    key: "tipsPointerHideOf",
    value: function tipsPointerHideOf() {
      var me = this;

      _.each(me.data, function (g) {
        _.each(g, function (node) {
          me.unfocusOf(node);
        });
      });
    }
  }, {
    key: "focusOf",
    value: function focusOf(node) {
      if (node.focused) return;
      var me = this;
      var _node = me.groups[node.field].nodes[node.iNode];
      _node.context.r += 1;
      _node.context.fillStyle = me.node.strokeStyle;
      _node.context.strokeStyle = _node._strokeStyle;
      node.focused = true;
    }
  }, {
    key: "unfocusOf",
    value: function unfocusOf(node) {
      if (!node.focused) return;
      var me = this;
      var _node = me.groups[node.field].nodes[node.iNode];
      _node.context.r -= 1;
      _node.context.fillStyle = _node._strokeStyle;
      _node.context.strokeStyle = me.node.strokeStyle;
      node.focused = false;
    }
  }, {
    key: "hide",
    value: function hide(field) {
      //用来计算下面的hLen
      var _coord = this.app.getComponent({
        name: 'coord'
      });

      this.enabledField = _coord.filterEnabledFields(this.field);
      var group = this.groups[field];

      if (group) {
        group.area.context.visible = false;

        _.each(group.nodes, function (element) {
          element.context.visible = false;
        });
      }
    }
  }, {
    key: "show",
    value: function show(field) {
      var _coord = this.app.getComponent({
        name: 'coord'
      });

      this.enabledField = _coord.filterEnabledFields(this.field);
      var group = this.groups[field];

      if (group) {
        group.area.context.visible = true;

        _.each(group.nodes, function (element) {
          element.context.visible = true;
        });
      }
    }
  }, {
    key: "_trimGraphs",
    value: function _trimGraphs() {
      var me = this;

      var _coord = this.app.getComponent({
        name: 'coord'
      }); //用来计算下面的hLen


      this.enabledField = _coord.filterEnabledFields(this.field);
      var data = {};

      _.each(this.enabledField, function (field) {
        var dataOrg = me.dataFrame.getFieldData(field);

        var fieldMap = _coord.getFieldMapOf(field);

        var arr = [];

        _.each(_coord.aAxis.angleList, function (_a, i) {
          //弧度
          var _r = Math.PI * _a / 180;

          var point = _coord.getPointInRadianOfR(_r, _coord.getROfNum(dataOrg[i]));

          arr.push({
            type: "radar",
            field: field,
            iNode: i,
            rowData: me.dataFrame.getRowDataAt(i),
            focused: false,
            value: dataOrg[i],
            point: point,
            color: fieldMap.color
          });
        });

        data[field] = arr;
      });

      return data;
    }
  }, {
    key: "_getStyle",
    value: function _getStyle(style, fieldMap, iGroup, def) {
      var _s = def;

      if (_.isString(style) || _.isNumber(style)) {
        _s = style;
      }

      ;

      if (_.isArray(style)) {
        _s = style[iGroup];
      }

      ;

      if (_.isFunction(style)) {
        _s = style(iGroup, fieldMap);
      }

      ;

      if (_s === undefined || _s === null) {
        //只有undefined(用户配置了function),null才会认为需要还原皮肤色
        //“”都会认为是用户主动想要设置的，就为是用户不想他显示
        _s = def;
      }

      ;
      return _s;
    }
  }, {
    key: "getNodesAt",
    value: function getNodesAt(index) {
      //该index指当前
      var data = this.data;
      var _nodesInfoList = []; //节点信息集合

      _.each(this.enabledField, function (fs) {
        if (_.isArray(fs)) {
          _.each(fs, function (_fs) {
            //fs的结构两层到顶了
            var node = data[_fs][index];
            node && _nodesInfoList.push(node);
          });
        } else {
          var node = data[fs][index];
          node && _nodesInfoList.push(node);
        }
      });

      return _nodesInfoList;
    }
  }], [{
    key: "defaultProps",
    value: function defaultProps() {
      return {
        field: {
          detail: '字段配置',
          "default": null
        },
        line: {
          detail: '线配置',
          propertys: {
            enabled: {
              detail: '是否显示',
              "default": true
            },
            lineWidth: {
              detail: '线宽',
              "default": 2
            },
            strokeStyle: {
              detail: '线颜色',
              "default": null
            },
            lineType: {
              detail: '线条样式,默认solid，可选dashed',
              "default": 'solid'
            }
          }
        },
        area: {
          detail: '面积区域配置',
          propertys: {
            enabled: {
              detail: '是否显示',
              "default": true
            },
            fillStyle: {
              detail: '面积背景色',
              "default": null
            },
            fillAlpha: {
              detail: '面积透明度',
              "default": 0.1
            }
          }
        },
        node: {
          detail: '线上面的单数据节点图形配置',
          propertys: {
            enabled: {
              detail: '是否显示',
              "default": true
            },
            strokeStyle: {
              detail: '边框色',
              "default": '#ffffff'
            },
            radius: {
              detail: '半径',
              "default": 4
            },
            lineWidth: {
              detail: '边框大小',
              "default": 1
            }
          }
        }
      };
    }
  }]);
  return RadarGraphs;
}(_index["default"]);

_index["default"].registerComponent(RadarGraphs, 'graphs', 'radar');

var _default = RadarGraphs;
exports["default"] = _default;