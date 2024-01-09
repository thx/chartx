"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _canvax = _interopRequireDefault(require("canvax"));

var _index = _interopRequireDefault(require("../index"));

var _tools = require("../../../utils/tools");

var _color = require("../../../utils/color");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var _ = _canvax["default"]._; // https://zhuanlan.zhihu.com/p/271906562
// https://www.cnblogs.com/guojikun/p/10663487.html

var Progress = /*#__PURE__*/function (_GraphsBase) {
  (0, _inherits2["default"])(Progress, _GraphsBase);

  var _super = _createSuper(Progress);

  function Progress(opt, app) {
    var _this;

    (0, _classCallCheck2["default"])(this, Progress);
    _this = _super.call(this, opt, app);
    _this.type = "progress";

    _.extend(true, (0, _assertThisInitialized2["default"])(_this), (0, _tools.getDefaultProps)(Progress.defaultProps()), opt);

    _this.bgNodeData = null; //背景的nodeData数据，和data里面的结构保持一致

    _this.init();

    return _this;
  }

  (0, _createClass2["default"])(Progress, [{
    key: "init",
    value: function init() {}
  }, {
    key: "draw",
    value: function draw(opt) {
      !opt && (opt = {});
      var me = this;

      _.extend(true, this, opt);

      me.grow(function (process) {
        me.data = me._trimGraphs(process);

        me._widget();
      });
      this.sprite.context.x = this.origin.x;
      this.sprite.context.y = this.origin.y;
      this.fire("complete");
    }
  }, {
    key: "_trimGraphs",
    value: function _trimGraphs(scale) {
      var me = this;

      if (scale == undefined) {
        scale = 1;
      }

      ;

      var _coord = this.app.getComponent({
        name: 'coord'
      }); //用来计算下面的hLen


      this.enabledField = _coord.filterEnabledFields(this.field); //整个的

      var _startAngle = me.startAngle || _coord.startAngle;

      var _allAngle = me.allAngle || _coord.allAngle; //let _endAngle = startAngle + allAngle;


      this.bgNodeData = this._getNodeData(_startAngle, _allAngle);
      this.bgNodeData.fillStyle = this._getStyle(this.bgNodeData, this.bgColor);
      var data = {};

      _.each(this.enabledField, function (field) {
        var dataOrg = me.dataFrame.getFieldData(field);
        var nodeDatas = [];

        _.each(dataOrg, function (val, i) {
          var targetVal = val;
          val *= scale;
          var preNodeData = nodeDatas.slice(-1)[0];
          var startAngle = preNodeData ? preNodeData.endAngle : _startAngle;
          var allAngle = _allAngle * (Math.min(val, 100) / 100) * (val / targetVal);

          var nodeData = me._getNodeData(startAngle, allAngle, field, val, i);

          nodeData.fillStyle = me._getStyle(nodeData, me.node.fillStyle);
          nodeDatas.push(nodeData);
        });

        data[field] = nodeDatas;
      });

      return data;
    }
  }, {
    key: "_getNodeData",
    value: function _getNodeData(startAngle, allAngle, field, val, i) {
      var me = this;

      var _coord = this.app.getComponent({
        name: 'coord'
      });

      var middleAngle = startAngle + Math.min(allAngle, 180);
      var endAngle = startAngle + allAngle;
      var startRadian = Math.PI * startAngle / 180; //起始弧度

      var middleRadian = Math.PI * middleAngle / 180;
      var endRadian = Math.PI * endAngle / 180; //终点弧度

      var outRadius = me.radius || _coord.radius;
      var innerRadius = outRadius - me.node.width;

      var startOutPoint = _coord.getPointInRadianOfR(startRadian, outRadius);

      var middleOutPoint = _coord.getPointInRadianOfR(middleRadian, outRadius);

      var endOutPoint = _coord.getPointInRadianOfR(endRadian, outRadius);

      var startInnerPoint = _coord.getPointInRadianOfR(startRadian, innerRadius);

      var middleInnerPoint = _coord.getPointInRadianOfR(middleRadian, innerRadius);

      var endInnerPoint = _coord.getPointInRadianOfR(endRadian, innerRadius);

      var nodeData = {
        field: field,
        value: val,
        text: val,
        //value format后的数据
        iNode: i,
        allAngle: allAngle,
        startAngle: startAngle,
        middleAngle: middleAngle,
        endAngle: endAngle,
        startRadian: startRadian,
        middleRadian: middleRadian,
        endRadian: endRadian,
        outRadius: outRadius,
        innerRadius: innerRadius,
        startOutPoint: startOutPoint,
        middleOutPoint: middleOutPoint,
        endOutPoint: endOutPoint,
        startInnerPoint: startInnerPoint,
        middleInnerPoint: middleInnerPoint,
        endInnerPoint: endInnerPoint,
        rowData: me.dataFrame.getRowDataAt(i),
        fillStyle: null
      };

      if (field) {
        if (me.label.format) {
          if (_.isFunction(me.label.format)) {
            nodeData.text = me.label.format.apply(this, [val, nodeData]);
          }
        } else {
          //否则用fieldConfig上面的
          var _coord2 = me.app.getComponent({
            name: 'coord'
          });

          var fieldConfig = _coord2.getFieldConfig(field);

          if (fieldConfig) {
            if (nodeData.value.toString().indexOf('.') > -1) {
              if (nodeData.value.toString().split('.')[1].length > 2) {
                nodeData.value = nodeData.value.toFixed(2);
              }
            }

            nodeData.text = fieldConfig.getFormatValue(nodeData.value);
          }
        }
      }

      ;
      return nodeData;
    }
  }, {
    key: "_widget",
    value: function _widget() {
      var me = this;

      if (me.bgEnabled) {
        var bgPathStr = me._getPathStr(this.bgNodeData);

        if (me._bgPathElement) {
          me._bgPathElement.context.path = bgPathStr;
        } else {
          me._bgPathElement = new _canvax["default"].Shapes.Path({
            context: {
              path: bgPathStr
            }
          });
          me.sprite.addChild(me._bgPathElement);
        }

        ;
        me._bgPathElement.context.lineWidth = this.node.width;
        me._bgPathElement.context.strokeStyle = this.bgNodeData.fillStyle;
      }

      ;

      _.each(this.data, function (nodeDatas) {
        _.each(nodeDatas, function (nodeData, i) {
          var pathStr = me._getBarPathStr1(nodeData);

          var elId = "progress_bar_" + nodeData.field + "_" + i;
          var pathElement = me.sprite.getChildById(elId);

          if (pathElement) {
            pathElement.context.path = pathStr;
          } else {
            pathElement = new _canvax["default"].Shapes.Path({
              id: elId,
              context: {
                path: pathStr
              }
            });
            me.sprite.addChild(pathElement);
          }

          ;
          pathElement.context.lineWidth = me.node.width;
          var style = nodeData.fillStyle;
          var allColors = [];

          if (style && style.lineargradient) {
            var start = _objectSpread({}, style.lineargradient[0]);

            var end = _objectSpread({}, style.lineargradient.slice(-1)[0]);

            var lineargradient = [start, end];

            if (nodeData.endAngle > nodeData.middleAngle) {
              //超过了180度的话要绘制第二条
              allColors = (0, _color.gradient)(style.lineargradient[0].color, style.lineargradient.slice(-1)[0].color, parseInt(nodeData.allAngle / 10));
              end.color = allColors[17];
            } //let newLineargradient = 
            // let _style = me.ctx.createLinearGradient( nodeData.startOutPoint.x ,nodeData.startOutPoint.y, nodeData.middleOutPoint.x, nodeData.middleOutPoint.y );
            // _.each( lineargradient , function( item ){
            //     _style.addColorStop( item.position , item.color);
            // });


            style = {
              lineargradient: lineargradient,
              points: [nodeData.startOutPoint.x, nodeData.startOutPoint.y, nodeData.middleOutPoint.x, nodeData.middleOutPoint.y]
            };
          }

          ;
          pathElement.context.strokeStyle = style;

          if (nodeData.endAngle > nodeData.middleAngle) {
            //超过了180度的话要绘制第二条
            var _pathStr = me._getBarPathStr2(nodeData);

            var _elId = "progress_bar_" + nodeData.field + "_" + i + "_2";

            var _pathElement = me.sprite.getChildById(_elId);

            if (_pathElement) {
              _pathElement.context.path = _pathStr;
            } else {
              _pathElement = new _canvax["default"].Shapes.Path({
                id: _elId,
                context: {
                  path: _pathStr
                }
              });
              me.sprite.addChild(_pathElement);
            }

            ;
            _pathElement.context.lineWidth = me.node.width;
            var _style = nodeData.fillStyle;

            if (_style && _style.lineargradient) {
              var _start = _objectSpread({}, _style.lineargradient[0]);

              _start.color = allColors[17];

              var _end = _objectSpread({}, _style.lineargradient.slice(-1)[0]);

              var _lineargradient = [_start, _end]; // let _style = me.ctx.createLinearGradient( nodeData.middleOutPoint.x ,nodeData.middleOutPoint.y, nodeData.endOutPoint.x, nodeData.endOutPoint.y );
              // _.each( lineargradient , function( item ){
              //     _style.addColorStop( item.position , item.color);
              // });
              // style = _style;

              _style = {
                lineargradient: _lineargradient,
                points: [nodeData.middleOutPoint.x, nodeData.middleOutPoint.y, nodeData.endOutPoint.x, nodeData.endOutPoint.y]
              };
            }

            ;
            _pathElement.context.strokeStyle = _style;
          }

          if (me.label.enabled) {
            var labelSpId = "progress_label_" + nodeData.field + "_sprite_" + i;
            var labelSpElement = me.sprite.getChildById(labelSpId);

            if (labelSpElement) {
              labelSpElement;
            } else {
              labelSpElement = new _canvax["default"].Display.Sprite({
                id: labelSpId
              });
              me.sprite.addChild(labelSpElement);
            }

            ;
            labelSpElement.context.x = me.label.offsetX - 6; //%好会占一部分位置 所以往左边偏移6

            labelSpElement.context.y = me.label.offsetY;
            var labelCtx = {
              fillStyle: me.label.fontColor || nodeData.fillStyle,
              fontSize: me.label.fontSize,
              lineWidth: me.label.lineWidth,
              strokeStyle: me.label.strokeStyle,
              textAlign: me.label.textAlign,
              textBaseline: me.label.verticalAlign,
              rotation: me.label.rotation
            };
            var labelId = "progress_label_" + nodeData.field + "_" + i;
            var labelElement = labelSpElement.getChildById(labelId);

            if (labelElement) {
              labelElement.resetText(nodeData.text);

              _.extend(labelElement.context, labelCtx);
            } else {
              labelElement = new _canvax["default"].Display.Text(nodeData.text, {
                id: labelId,
                context: labelCtx
              });
              labelSpElement.addChild(labelElement);
            }

            ;
            var labelSymbolId = "progress_label_" + nodeData.field + "_symbol_" + i;
            var labelSymbolElement = labelSpElement.getChildById(labelSymbolId);
            var lebelSymbolCxt = {
              x: labelElement.getTextWidth() / 2 + 2,
              y: 3,
              fillStyle: me.label.unitColor || me.label.fontColor || nodeData.fillStyle,
              fontSize: me.label.unitFontSize,
              textAlign: "left",
              textBaseline: me.label.verticalAlign
            };

            if (labelSymbolElement) {
              _.extend(labelSymbolElement.context, lebelSymbolCxt);
            } else {
              var unitText = me.label.unit;
              labelSymbolElement = new _canvax["default"].Display.Text(unitText, {
                id: labelSymbolId,
                context: lebelSymbolCxt
              });
              labelSpElement.addChild(labelSymbolElement);
            }

            ;
          }

          ;
        });
      });
    }
  }, {
    key: "_getPathStr",
    value: function _getPathStr(nodeData) {
      var pathStr = "M" + nodeData.startOutPoint.x + " " + nodeData.startOutPoint.y;
      pathStr += "A" + nodeData.outRadius + " " + nodeData.outRadius + " 0 0 1 " + nodeData.middleOutPoint.x + " " + nodeData.middleOutPoint.y;
      pathStr += "A" + nodeData.outRadius + " " + nodeData.outRadius + " 0 0 1 " + nodeData.endOutPoint.x + " " + nodeData.endOutPoint.y; // let actionType = "L";
      // if( nodeData.allAngle % 360 == 0 ){
      //     //actionType = "M" 
      // };
      // pathStr += actionType+nodeData.endInnerPoint.x+" "+nodeData.endInnerPoint.y;
      // pathStr += "A"+nodeData.innerRadius+" "+nodeData.innerRadius+" 0 0 0 " + nodeData.middleInnerPoint.x + " "+ nodeData.middleInnerPoint.y;
      // pathStr += "A"+nodeData.innerRadius+" "+nodeData.innerRadius+" 0 0 0 " + nodeData.startInnerPoint.x + " "+ nodeData.startInnerPoint.y;
      // pathStr += "Z";

      return pathStr;
    }
  }, {
    key: "_getBarPathStr1",
    value: function _getBarPathStr1(nodeData) {
      var pathStr = "M" + nodeData.startOutPoint.x + " " + nodeData.startOutPoint.y;
      pathStr += "A" + nodeData.outRadius + " " + nodeData.outRadius + " 0 0 1 " + nodeData.middleOutPoint.x + " " + nodeData.middleOutPoint.y; //pathStr += "A"+nodeData.outRadius+" "+nodeData.outRadius+" 0 0 1 " + nodeData.endOutPoint.x + " "+ nodeData.endOutPoint.y;

      return pathStr;
    }
  }, {
    key: "_getBarPathStr2",
    value: function _getBarPathStr2(nodeData) {
      var pathStr = "M" + nodeData.middleOutPoint.x + " " + nodeData.middleOutPoint.y; //pathStr += "A"+nodeData.outRadius+" "+nodeData.outRadius+" 0 0 1 " + nodeData.middleOutPoint.x + " "+ nodeData.middleOutPoint.y;

      pathStr += "A" + nodeData.outRadius + " " + nodeData.outRadius + " 0 0 1 " + nodeData.endOutPoint.x + " " + nodeData.endOutPoint.y;
      return pathStr;
    }
  }, {
    key: "_getStyle",
    value: function _getStyle(nodeData, prop, def) {
      var me = this;

      var _coord = this.app.getComponent({
        name: 'coord'
      });

      var fieldConfig = _coord.getFieldConfig(nodeData.field);

      def = def || (fieldConfig ? fieldConfig.color : "#171717");
      var style = prop;

      if (prop) {
        if (_.isString(prop)) {
          style = prop;
        }

        ;

        if (_.isArray(prop)) {
          style = prop[nodeData.iNode];
        }

        ;

        if (_.isFunction(prop)) {
          style = prop.apply(this, arguments);
        }

        ;
      }

      if (!style) {
        style = def;
      }

      return style;
    }
  }], [{
    key: "defaultProps",
    value: function defaultProps() {
      return {
        field: {
          detail: '字段配置',
          "default": null
        },
        aniEasing: {
          detail: '缓动函数',
          "default": "Quintic.Out"
        },
        node: {
          detail: '进度条设置',
          propertys: {
            width: {
              detail: '进度条的宽度',
              "default": 16
            },
            fillStyle: {
              detail: '进度条的填充色',
              documentation: '可以是单个颜色，也可以是数组，也可以是一个函数,也可以是个lineargradient',
              "default": null
            }
          }
        },
        label: {
          detail: '进度值文本',
          propertys: {
            enabled: {
              detail: '是否启用label',
              "default": 'true'
            },
            unit: {
              detail: '单位值，默认%',
              "default": '%'
            },
            unitColor: {
              detail: '单位值的颜色',
              "default": null
            },
            unitFontSize: {
              detail: '单位值的大小',
              "default": 14
            },
            fontColor: {
              detail: 'label颜色',
              "default": null //默认同node.fillStyle

            },
            fontSize: {
              detail: 'label文本大小',
              "default": 26
            },
            fixNum: {
              detail: 'toFixed的位数',
              "default": 2
            },
            format: {
              detail: 'label格式化处理函数',
              "default": null
            },
            lineWidth: {
              detail: 'label文本描边线宽',
              "default": null
            },
            strokeStyle: {
              detail: 'label描边颜色',
              "default": null
            },
            rotation: {
              detail: 'label旋转角度',
              "default": 0
            },
            textAlign: {
              detail: 'label textAlign',
              "default": 'center',
              values: ['left', 'center', 'right']
            },
            //left center right
            verticalAlign: {
              detail: 'label verticalAlign',
              "default": 'middle',
              values: ['top', 'middle', 'bottom']
            },
            //top middle bottom
            position: {
              detail: 'label位置',
              "default": 'origin'
            },
            offsetX: {
              detail: 'label在x方向的偏移量',
              "default": 0
            },
            offsetY: {
              detail: 'label在y方向的偏移量',
              "default": 0
            }
          }
        },
        bgEnabled: {
          detail: '是否开启背景',
          "default": true
        },
        bgColor: {
          detail: '进度条背景颜色',
          "default": '#f7f7f7'
        },
        radius: {
          detail: '半径',
          "default": null
        },
        allAngle: {
          detail: '总角度',
          documentation: '默认为null，则和坐标系同步',
          "default": null
        },
        startAngle: {
          detail: '其实角度',
          documentation: '默认为null，则和坐标系同步',
          "default": null
        }
      };
    }
  }]);
  return Progress;
}(_index["default"]);

_index["default"].registerComponent(Progress, 'graphs', 'progress');

var _default = Progress;
exports["default"] = _default;