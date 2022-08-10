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

var _layout = require("../../../layout/venn/layout");

var _circleintersection = require("../../../layout/venn/circleintersection");

var _fmin = require("fmin");

var _tools = require("../../../utils/tools");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var _ = _canvax["default"]._,
    event = _canvax["default"].event;
var Text = _canvax["default"].Display.Text;
var Path = _canvax["default"].Shapes.Path;
var Circle = _canvax["default"].Shapes.Circle;

var VennGraphs = /*#__PURE__*/function (_GraphsBase) {
  (0, _inherits2["default"])(VennGraphs, _GraphsBase);

  var _super = _createSuper(VennGraphs);

  function VennGraphs(opt, app) {
    var _this;

    (0, _classCallCheck2["default"])(this, VennGraphs);
    _this = _super.call(this, opt, app);
    _this.type = "venn";
    _this.vennData = null;

    _.extend(true, (0, _assertThisInitialized2["default"])(_this), (0, _tools.getDefaultProps)(VennGraphs.defaultProps()), opt); //_trimGraphs后，计算出来本次data的一些属性


    _this._dataCircleLen = 0;
    _this._dataLabelLen = 0;
    _this._dataPathLen = 0;

    _this.init();

    return _this;
  }

  (0, _createClass2["default"])(VennGraphs, [{
    key: "init",
    value: function init() {
      this.venn_circles = new _canvax["default"].Display.Sprite({
        id: "venn_circles"
      });
      this.sprite.addChild(this.venn_circles);
      this.venn_paths = new _canvax["default"].Display.Sprite({
        id: "venn_paths"
      });
      this.sprite.addChild(this.venn_paths);
      this.venn_labels = new _canvax["default"].Display.Sprite({
        id: "venn_labels"
      });
      this.sprite.addChild(this.venn_labels);
    }
  }, {
    key: "draw",
    value: function draw(opt) {
      !opt && (opt = {});

      _.extend(true, this, opt);

      this.data = this._trimGraphs();

      this._widget();

      this.sprite.context.x = this.app.padding.left;
      this.sprite.context.y = this.app.padding.top;
      this.fire("complete");
    }
  }, {
    key: "resetData",
    value: function resetData(dataFrame) {
      this.dataFrame = dataFrame;
      this.data = this._trimGraphs();

      this._widget();
    }
  }, {
    key: "_trimGraphs",
    value: function _trimGraphs() {
      var me = this;

      var data = me._vennData();

      var layoutFunction = _layout.venn;
      var loss = _layout.lossFunction;
      var orientation = Math.PI / 2;
      var orientationOrder = null;
      var normalize = true;
      var circles = {};
      var textCentres = {};
      this._dataCircleLen = 0;
      this._dataLabelLen = 0;
      this._dataPathLen = 0;

      if (data.length > 0) {
        var solution = layoutFunction(data, {
          lossFunction: loss
        });

        if (normalize) {
          solution = (0, _layout.normalizeSolution)(solution, orientation, orientationOrder);
        }

        ; //第4个参数本是padding，但是这里的width,height已经是减去过padding的
        //所以就传0

        circles = (0, _layout.scaleSolution)(solution, this.width, this.height, 0);
        textCentres = computeTextCentres(circles, data);
      }

      ;
      var circleInd = 0;
      var pathInd = 0;

      _.each(data, function (d) {
        if (d.label) {
          if (d.sets.length > 1 && !me.label.showInter) {//不显示path的文本
            // ...
          } else {
            d.labelPosition = textCentres[d.nodeId];
            me._dataLabelLen++;
          }
        }

        ;

        if (d.sets.length > 1) {
          var _path = intersectionAreaPath(d.sets.map(function (set) {
            return circles[set];
          }));

          d.shape = {
            type: 'path',
            path: _path,
            pathInd: pathInd++
          };
          me._dataPathLen++;
        } else if (d.sets.length == 1) {
          d.shape = _.extend({
            type: 'circle',
            circleInd: circleInd++
          }, circles[d.nodeId]);
          me._dataCircleLen++;
        }
      });

      return data;
    }
  }, {
    key: "_vennData",
    value: function _vennData() {
      var data = [];
      var me = this;

      for (var i = 0, l = this.dataFrame.length; i < l; i++) {
        var rowData = me.dataFrame.getRowDataAt(i);
        var obj = {
          type: "venn",
          field: me.field,
          iNode: i,
          nodeId: null,
          rowData: rowData,
          sets: null,
          //size和value是同一个值，size是 vennLayout 需要用到的属性
          //value是 chartx中和其他图表的值属性保持统一，比如tips中就会读取value
          size: null,
          value: null,
          //这两个在绘制的时候赋值
          fillStyle: null,
          strokeStyle: null,
          label: null,
          labelPosition: null
        };

        for (var p in rowData) {
          var val = rowData[p];

          if (p == me.keyField) {
            if (_.isString(val)) {
              val = val.split(/[,|]/);
            }

            ;
            obj.sets = val;
            obj.nodeId = val.join();

            if (!me.label.field) {
              //如果没有设置label的field
              //那么就默认获取keyField
              obj.label = val.join();
            }

            ;
          }

          ;

          if (p == me.field) {
            obj.size = val;
            obj.value = val;
          }

          ;

          if (p == me.label.field) {
            obj.label = val;
          }

          ;
        }

        data.push(obj);
      }

      ;
      return data;
    }
  }, {
    key: "_getStyle",
    value: function _getStyle(style, ind, nodeData, defColor) {
      var color;

      if (_.isString(style)) {
        color = style;
      }

      if (_.isFunction(style)) {
        color = style(nodeData);
      }

      if (!color && ind != undefined) {
        color = this.app.getTheme(ind);
      }

      if (!color && defColor != undefined) {
        color = defColor;
      }

      return color;
    }
  }, {
    key: "_widget",
    value: function _widget() {
      var me = this; //那么有多余的元素要去除掉 begin

      if (me.venn_circles.children.length > me._dataCircleLen) {
        for (var i = me._dataCircleLen; i < me.venn_circles.children.length; i++) {
          me.venn_circles.getChildAt(i--).destroy();
        }
      }

      ;

      if (me.venn_paths.children.length > me._dataPathLen) {
        for (var _i = me._dataPathLen; _i < me.venn_paths.children.length; _i++) {
          me.venn_paths.getChildAt(_i--).destroy();
        }
      }

      ;

      if (me.venn_labels.children.length > me._dataLabelLen) {
        for (var _i2 = me._dataLabelLen; _i2 < me.venn_labels.children.length; _i2++) {
          me.venn_labels.getChildAt(_i2--).destroy();
        }
      }

      ; //那么有多余的元素要去除掉 end

      var circleInd = 0;
      var pathInd = 0;
      var labelInd = 0;

      _.each(this.data, function (nodeData) {
        var shape = nodeData.shape;

        var _shape;

        var isNewShape = true;

        if (shape) {
          var context;

          if (shape.type == 'circle') {
            var fillStyle = me._getStyle(me.node.fillStyle, shape.circleInd, nodeData);

            var strokeStyle = me._getStyle(me.node.strokeStyle, shape.circleInd, nodeData);

            nodeData.fillStyle = fillStyle;
            nodeData.strokeStyle = strokeStyle;
            context = {
              x: shape.x,
              y: shape.y,
              r: shape.radius,
              fillStyle: fillStyle,
              fillAlpha: me.node.fillAlpha,
              lineWidth: me.node.lineWidth,
              strokeStyle: strokeStyle,
              strokeAlpha: me.node.strokeAlpha
            };
            _shape = me.venn_circles.getChildAt(circleInd++);

            if (!_shape) {
              _shape = new Circle({
                pointChkPriority: false,
                hoverClone: false,
                context: context
              });
              me.venn_circles.addChild(_shape);
            } else {
              isNewShape = false;

              _shape.animate(context);
            }
          }

          ;

          if (nodeData.shape.type == 'path') {
            context = {
              path: shape.path,
              fillStyle: "#ffffff",
              fillAlpha: 0,
              //me.node.fillAlpha,
              lineWidth: me.node.lineWidth,
              strokeStyle: "#ffffff",
              strokeAlpha: 0 //me.node.strokeAlpha

            };
            _shape = me.venn_paths.getChildAt(pathInd++);

            if (!_shape) {
              _shape = new Path({
                pointChkPriority: false,
                context: context
              });
              me.venn_paths.addChild(_shape);
            } else {
              isNewShape = false;
              _shape.context.path = shape.path; //_shape.animate( context )
            }
          }

          ;
          _shape.nodeData = nodeData;
          nodeData._node = _shape;
          me.node.focus.enabled && _shape.hover(function () {
            me.focusAt(this.nodeData.iNode);
          }, function () {
            !this.nodeData.selected && me.unfocusAt(this.nodeData.iNode);
          }); //新创建的元素才需要绑定事件，因为复用的原件已经绑定过事件了

          if (isNewShape) {
            _shape.on(event.types.get(), function (e) {
              e.eventInfo = {
                trigger: 'this.node',
                //me.node,
                title: null,
                nodes: [this.nodeData]
              }; //fire到root上面去的是为了让root去处理tips

              me.app.fire(e.type, e);
            });
          }

          ;
        }

        if (nodeData.label && me.label.enabled) {
          var fontColor = me._getStyle(me.label.fontColor, shape.circleInd, nodeData, "#999");

          var fontSize = me.label.fontSize;

          if (nodeData.sets.length > 1) {
            if (!me.label.showInter) {
              fontSize = 0;
            } else {
              fontSize -= 2;
            }
          }

          ;

          if (fontSize) {
            var _textContext = {
              x: nodeData.labelPosition.x,
              y: nodeData.labelPosition.y,
              fontSize: fontSize,
              //fontFamily: me.label.fontFamily,
              textBaseline: "middle",
              textAlign: "center",
              fontWeight: me.label.fontWeight,
              fillStyle: fontColor
            };

            var _txt = me.venn_labels.getChildAt(labelInd++);

            if (!_txt) {
              _txt = new Text(nodeData.label, {
                context: _textContext
              });
              me.venn_labels.addChild(_txt);
            } else {
              _txt.resetText(nodeData.label);

              _txt.animate(_textContext);
            }
          }
        }
      });
    }
  }, {
    key: "focusAt",
    value: function focusAt(ind) {
      var nodeData = this.data[ind];
      if (!this.node.focus.enabled || nodeData.focused) return;
      var nctx = nodeData._node.context; //nctx.strokeAlpha += 0.5;

      if (nodeData.sets.length > 1) {
        //path
        nctx.strokeAlpha = 1;
      } else {
        //circle
        nctx.strokeAlpha = this.node.focus.strokeAlpha;
      }

      nodeData.focused = true;
    }
  }, {
    key: "unfocusAt",
    value: function unfocusAt(ind) {
      var nodeData = this.data[ind];
      if (!this.node.focus.enabled || !nodeData.focused) return;
      var nctx = nodeData._node.context; //nctx.strokeAlpha = 0.5;

      nctx.strokeAlpha = this.node.strokeAlpha;
      nodeData.focused = false;
    }
  }, {
    key: "selectAt",
    value: function selectAt(ind) {
      var nodeData = this.data[ind];
      if (!this.node.select.enabled || nodeData.selected) return;
      var nctx = nodeData._node.context;
      nctx.lineWidth = this.node.select.lineWidth;
      nctx.strokeAlpha = this.node.select.strokeAlpha;
      nctx.strokeStyle = this.node.select.strokeStyle;
      nodeData.selected = true;
    }
  }, {
    key: "unselectAt",
    value: function unselectAt(ind) {
      var nodeData = this.data[ind];
      if (!this.node.select.enabled || !nodeData.selected) return;
      var nctx = nodeData._node.context;
      nctx.strokeStyle = this.node.strokeStyle;
      nodeData.selected = false;
    }
  }], [{
    key: "defaultProps",
    value: function defaultProps() {
      return {
        field: {
          detail: 'value字段',
          "default": 'value'
        },
        keyField: {
          detail: 'key字段',
          "default": 'name'
        },
        node: {
          detail: '单个节点配置',
          propertys: {
            strokeStyle: {
              detail: '边框颜色',
              "default": null
            },
            lineWidth: {
              detail: '边框大小',
              "default": 2
            },
            strokeAlpha: {
              detail: '边框透明度',
              "default": 0
            },
            fillStyle: {
              detail: '背景色',
              "default": null
            },
            fillAlpha: {
              detail: '背景透明度',
              "default": 0.25
            },
            focus: {
              detail: 'hover设置',
              propertys: {
                enabled: {
                  detail: '是否开启',
                  "default": true
                },
                strokeAlpha: {
                  detail: '边框透明度',
                  "default": 0.3
                }
              }
            },
            select: {
              detail: '选中设置',
              propertys: {
                enabled: {
                  detail: '是否开启',
                  "default": true
                },
                lineWidth: {
                  detail: '描边宽度',
                  "default": 2
                },
                strokeStyle: {
                  detail: '描边颜色',
                  "default": '#666666'
                }
              }
            }
          }
        },
        label: {
          detail: '文本设置',
          propertys: {
            field: {
              detail: '获取文本的字段',
              "default": null
            },
            fontSize: {
              detail: '字体大小',
              "default": 14
            },
            fontColor: {
              detail: '文本颜色',
              "default": null
            },
            fontWeight: {
              detail: 'fontWeight',
              "default": 'normal'
            },
            showInter: {
              detail: '是否显示相交部分的文本',
              "default": true
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
  return VennGraphs;
}(_index["default"]); //venn computeTextCentres 需要的相关代码 begin


function getOverlappingCircles(circles) {
  var ret = {},
      circleids = [];

  for (var circleid in circles) {
    circleids.push(circleid);
    ret[circleid] = [];
  }

  for (var i = 0; i < circleids.length; i++) {
    var a = circles[circleids[i]];

    for (var j = i + 1; j < circleids.length; ++j) {
      var b = circles[circleids[j]],
          d = (0, _circleintersection.distance)(a, b);

      if (d + b.radius <= a.radius + 1e-10) {
        ret[circleids[j]].push(circleids[i]);
      } else if (d + a.radius <= b.radius + 1e-10) {
        ret[circleids[i]].push(circleids[j]);
      }
    }
  }

  return ret;
}

function computeTextCentres(circles, areas) {
  var ret = {},
      overlapped = getOverlappingCircles(circles);

  for (var i = 0; i < areas.length; ++i) {
    var area = areas[i].sets,
        areaids = {},
        exclude = {};

    for (var j = 0; j < area.length; ++j) {
      areaids[area[j]] = true;
      var overlaps = overlapped[area[j]];

      for (var k = 0; k < overlaps.length; ++k) {
        exclude[overlaps[k]] = true;
      }
    }

    var interior = [],
        exterior = [];

    for (var setid in circles) {
      if (setid in areaids) {
        interior.push(circles[setid]);
      } else if (!(setid in exclude)) {
        exterior.push(circles[setid]);
      }
    }

    var centre = computeTextCentre(interior, exterior);
    ret[area] = centre;

    if (centre.disjoint && areas[i].size > 0) {
      console.log("WARNING: area " + area + " not represented on screen");
    }
  }

  return ret;
}

function computeTextCentre(interior, exterior) {
  var points = [],
      i;

  for (i = 0; i < interior.length; ++i) {
    var c = interior[i];
    points.push({
      x: c.x,
      y: c.y
    });
    points.push({
      x: c.x + c.radius / 2,
      y: c.y
    });
    points.push({
      x: c.x - c.radius / 2,
      y: c.y
    });
    points.push({
      x: c.x,
      y: c.y + c.radius / 2
    });
    points.push({
      x: c.x,
      y: c.y - c.radius / 2
    });
  }

  var initial = points[0],
      margin = circleMargin(points[0], interior, exterior);

  for (i = 1; i < points.length; ++i) {
    var m = circleMargin(points[i], interior, exterior);

    if (m >= margin) {
      initial = points[i];
      margin = m;
    }
  } // maximize the margin numerically


  var solution = (0, _fmin.nelderMead)(function (p) {
    return -1 * circleMargin({
      x: p[0],
      y: p[1]
    }, interior, exterior);
  }, [initial.x, initial.y], {
    maxIterations: 500,
    minErrorDelta: 1e-10
  }).x;
  var ret = {
    x: solution[0],
    y: solution[1]
  }; // check solution, fallback as needed (happens if fully overlapped
  // etc)

  var valid = true;

  for (i = 0; i < interior.length; ++i) {
    if ((0, _circleintersection.distance)(ret, interior[i]) > interior[i].radius) {
      valid = false;
      break;
    }
  }

  for (i = 0; i < exterior.length; ++i) {
    if ((0, _circleintersection.distance)(ret, exterior[i]) < exterior[i].radius) {
      valid = false;
      break;
    }
  }

  if (!valid) {
    if (interior.length == 1) {
      ret = {
        x: interior[0].x,
        y: interior[0].y
      };
    } else {
      var areaStats = {};
      (0, _circleintersection.intersectionArea)(interior, areaStats);

      if (areaStats.arcs.length === 0) {
        ret = {
          'x': 0,
          'y': -1000,
          disjoint: true
        };
      } else if (areaStats.arcs.length == 1) {
        ret = {
          'x': areaStats.arcs[0].circle.x,
          'y': areaStats.arcs[0].circle.y
        };
      } else if (exterior.length) {
        // try again without other circles
        ret = computeTextCentre(interior, []);
      } else {
        // take average of all the points in the intersection
        // polygon. this should basically never happen
        // and has some issues:
        // https://github.com/benfred/venn.js/issues/48#issuecomment-146069777
        ret = (0, _circleintersection.getCenter)(areaStats.arcs.map(function (a) {
          return a.p1;
        }));
      }
    }
  }

  return ret;
}

function circleMargin(current, interior, exterior) {
  var margin = interior[0].radius - (0, _circleintersection.distance)(interior[0], current),
      i,
      m;

  for (i = 1; i < interior.length; ++i) {
    m = interior[i].radius - (0, _circleintersection.distance)(interior[i], current);

    if (m <= margin) {
      margin = m;
    }
  }

  for (i = 0; i < exterior.length; ++i) {
    m = (0, _circleintersection.distance)(exterior[i], current) - exterior[i].radius;

    if (m <= margin) {
      margin = m;
    }
  }

  return margin;
}

function circlePath(x, y, r) {
  var ret = [];
  ret.push("\nM", x, y);
  ret.push("\nm", -r, 0);
  ret.push("\na", r, r, 0, 1, 0, r * 2, 0);
  ret.push("\na", r, r, 0, 1, 0, -r * 2, 0);
  return ret.join(" ");
}
/** returns a svg path of the intersection area of a bunch of circles */


function intersectionAreaPath(circles) {
  var stats = {};
  (0, _circleintersection.intersectionArea)(circles, stats);
  var arcs = stats.arcs;

  if (arcs.length === 0) {
    return "M 0 0";
  } else if (arcs.length == 1) {
    var circle = arcs[0].circle;
    return circlePath(circle.x, circle.y, circle.radius);
  } else {
    // draw path around arcs
    var ret = ["\nM", arcs[0].p2.x, arcs[0].p2.y];

    for (var i = 0; i < arcs.length; ++i) {
      var arc = arcs[i],
          r = arc.circle.radius,
          wide = arc.width > r;
      ret.push("\nA", r, r, 0, wide ? 1 : 0, 1, arc.p1.x, arc.p1.y);
    }

    return ret.join(" ") + " z";
  }
} //venn computeTextCentres 需要的相关代码 end


_index["default"].registerComponent(VennGraphs, 'graphs', 'venn');

var _default = VennGraphs;
exports["default"] = _default;