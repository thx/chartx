"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "canvax", "../index", "mmvis"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("canvax"), require("../index"), require("mmvis"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.canvax, global.index, global.mmvis);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _canvax, _index, _mmvis) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _canvax2 = _interopRequireDefault(_canvax);

  var _index2 = _interopRequireDefault(_index);

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

  var Polygon = _canvax2["default"].Shapes.Polygon;
  var Circle = _canvax2["default"].Shapes.Circle;

  var RadarGraphs = function (_GraphsBase) {
    _inherits(RadarGraphs, _GraphsBase);

    _createClass(RadarGraphs, null, [{
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

    function RadarGraphs(opt, app) {
      var _this;

      _classCallCheck(this, RadarGraphs);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(RadarGraphs).call(this, opt, app));
      _this.type = "radar";
      _this.enabledField = null;
      _this.groups = {//uv : {
        //   area : ,
        //   nodes: 
        //}
      };

      _mmvis._.extend(true, _assertThisInitialized(_this), (0, _mmvis.getDefaultProps)(RadarGraphs.defaultProps()), opt);

      _this.init();

      return _this;
    }

    _createClass(RadarGraphs, [{
      key: "init",
      value: function init() {}
    }, {
      key: "draw",
      value: function draw(opt) {
        !opt && (opt = {});
        var me = this;

        _mmvis._.extend(true, this, opt);

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

        _mmvis._.each(this.data, function (list, field) {
          var group = {};
          var pointList = [];

          _mmvis._.each(list, function (node, i) {
            pointList.push([node.point.x, node.point.y]);
          });

          var fieldMap = _coord.getFieldMapOf(field);

          var _strokeStyle = me._getStyle(me.line.strokeStyle, iGroup, fieldMap.color, fieldMap);

          var polyCtx = {
            pointList: pointList,
            cursor: "pointer"
          };

          if (me.line.enabled) {
            polyCtx.lineWidth = me.line.lineWidth;
            polyCtx.strokeStyle = _strokeStyle;
          }

          ;

          if (me.area.enabled) {
            polyCtx.fillStyle = me._getStyle(me.area.fillStyle, iGroup, fieldMap.color, fieldMap);
            polyCtx.fillAlpha = me._getStyle(me.area.fillAlpha, iGroup, 1, fieldMap);
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

          _poly.on(_mmvis.event.types.get(), function (e) {
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

            _mmvis._.each(list, function (node, i) {
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

              _node.on(_mmvis.event.types.get(), function (e) {
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
          _mmvis._.each(e.eventInfo.nodes, function (eventNode) {
            if (me.data[eventNode.field]) {
              _mmvis._.each(me.data[eventNode.field], function (n, i) {
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
      value: function tipsPointerHideOf(e) {
        var me = this;

        _mmvis._.each(me.data, function (g, i) {
          _mmvis._.each(g, function (node) {
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

          _mmvis._.each(group.nodes, function (element) {
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

          _mmvis._.each(group.nodes, function (element) {
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

        _mmvis._.each(this.enabledField, function (field) {
          var dataOrg = me.dataFrame.getFieldData(field);

          var fieldMap = _coord.getFieldMapOf(field);

          var arr = [];

          _mmvis._.each(_coord.aAxis.angleList, function (_a, i) {
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
      value: function _getStyle(style, iGroup, def, fieldMap) {
        var _s = def;

        if (_mmvis._.isString(style) || _mmvis._.isNumber(style)) {
          _s = style;
        }

        ;

        if (_mmvis._.isArray(style)) {
          _s = style[iGroup];
        }

        ;

        if (_mmvis._.isFunction(style)) {
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

        _mmvis._.each(this.enabledField, function (fs, i) {
          if (_mmvis._.isArray(fs)) {
            _mmvis._.each(fs, function (_fs, ii) {
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
    }]);

    return RadarGraphs;
  }(_index2["default"]);

  _mmvis.global.registerComponent(RadarGraphs, 'graphs', 'radar');

  exports["default"] = RadarGraphs;
});