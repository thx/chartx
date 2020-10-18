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

var _canvax = _interopRequireDefault(require("canvax"));

var _index = _interopRequireDefault(require("../index"));

var _tools = require("../../../utils/tools");

var _color = require("../../../utils/color");

var _ = _canvax["default"]._,
    event = _canvax["default"].event;
var Text = _canvax["default"].Display.Text;
var Polygon = _canvax["default"].Shapes.Polygon;

var FunnelGraphs =
/*#__PURE__*/
function (_GraphsBase) {
  (0, _inherits2["default"])(FunnelGraphs, _GraphsBase);
  (0, _createClass2["default"])(FunnelGraphs, null, [{
    key: "defaultProps",
    value: function defaultProps() {
      return {
        field: {
          detail: '字段配置',
          "default": null
        },
        sort: {
          detail: '排序规则',
          "default": null
        },
        node: {
          detail: '单个元素图形配置',
          propertys: {
            margin: {
              detail: 'node节点之间的间距',
              "default": 2
            },
            maxWidth: {
              detail: '最大的元素宽',
              "default": null
            },
            minWidth: {
              detail: '最小的元素宽',
              "default": null
            },
            spireWidth: {
              detail: '漏斗的塔尖的宽度，默认等于minWidth',
              documentation: '如果想要实现全三角的效果，可以设置为0',
              "default": null
            },
            height: {
              detail: '高',
              "default": 0,
              documentation: '漏斗单元高，如果options没有设定， 就会被自动计算为 this.height/dataOrg.length'
            },
            drawEnd: {
              detail: '单个节点绘制完毕处理函数',
              "default": function _default() {}
            },
            fillStyle: {
              detail: '单个区块背景色',
              "default": null //'#fff' //从themeColor获取默认 , 默认为空就会没有颜色的区块不会有事件点击

            },
            fillAlpha: {
              detail: '单个区块透明度',
              "default": 1
            },
            maxFillStyle: {
              detail: '单个区块数值最大的颜色值',
              "default": null
            },
            maxFillAlpha: {
              detail: '单个区块最大透明度',
              "default": 1
            },
            minFillAlpha: {
              detail: '单个区块最小透明度',
              "default": 0.5
            },
            strokeStyle: {
              detail: '单个区块描边颜色',
              "default": null
            },
            strokeAlpha: {
              detail: '单个区块描边透明度',
              "default": 1
            },
            lineWidth: {
              detail: '单个区块描边线宽',
              "default": 0
            },
            lineType: {
              detail: '区块描边样式',
              "default": 'solid'
            },
            focus: {
              detail: "单个区块hover态设置",
              propertys: {
                enabled: {
                  detail: '是否开启',
                  "default": true
                },
                fillStyle: {
                  detail: 'hover态单个区块背景色',
                  "default": null //从themeColor获取默认

                },
                fillAlpha: {
                  detail: 'hover态单个区块透明度',
                  "default": 0.95
                },
                strokeStyle: {
                  detail: 'hover态单个区块描边颜色',
                  "default": null //默认获取themeColor

                },
                strokeAlpha: {
                  detail: 'hover态单个区块描边透明度',
                  "default": null //默认获取themeColor

                },
                lineWidth: {
                  detail: 'hover态单个区块描边线宽',
                  "default": null
                },
                lineType: {
                  detail: 'hover态区块描边样式',
                  "default": null
                }
              }
            },
            select: {
              detail: "单个区块选中态设置",
              propertys: {
                enabled: {
                  detail: '是否开启',
                  "default": false
                },
                fillStyle: {
                  detail: '选中态单个区块背景色',
                  "default": null //从themeColor获取默认

                },
                fillAlpha: {
                  detail: '选中态单个区块透明度',
                  "default": 1
                },
                strokeStyle: {
                  detail: '选中态单个区块描边颜色',
                  "default": null
                },
                strokeAlpha: {
                  detail: '选中态单个区块描边颜色',
                  "default": null
                },
                lineWidth: {
                  detail: '选中态单个区块描边线宽',
                  "default": null
                },
                lineType: {
                  detail: '选中态区块描边样式',
                  "default": null
                }
              }
            }
          }
        },
        label: {
          detail: '文本配置',
          propertys: {
            enabled: {
              detail: '是否开启文本',
              "default": true
            },
            textAlign: {
              detail: '文本布局位置(left,center,right)',
              "default": 'center'
            },
            textBaseline: {
              detail: '文本基线对齐方式',
              "default": 'middle'
            },
            format: {
              detail: '文本格式化处理函数',
              "default": function _default(num) {
                return (0, _tools.numAddSymbol)(num);
              }
            },
            fontSize: {
              detail: '文本字体大小',
              "default": 13
            },
            fontColor: {
              detail: '文本颜色',
              "default": '#ffffff',
              documentation: 'align为center的时候的颜色，align为其他属性时候取node的颜色'
            }
          }
        }
      };
    }
  }]);

  function FunnelGraphs(opt, app) {
    var _this;

    (0, _classCallCheck2["default"])(this, FunnelGraphs);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(FunnelGraphs).call(this, opt, app));
    _this.type = "funnel";
    _this.dataOrg = []; //this.dataFrame.getFieldData( this.field )

    _this.data = []; //layoutData list , default is empty Array

    _this.maxValue = null;
    _this.minValue = null;

    _.extend(true, (0, _assertThisInitialized2["default"])(_this), (0, _tools.getDefaultProps)(FunnelGraphs.defaultProps()), opt);

    _this.init();

    return _this;
  }

  (0, _createClass2["default"])(FunnelGraphs, [{
    key: "init",
    value: function init() {
      if (!this.node.maxFillStyle) {
        this.node.maxFillStyle = this.app.getTheme(0);
      }

      this._nodesp = new _canvax["default"].Display.Sprite({
        id: "nodeSp"
      });
      this._textsp = new _canvax["default"].Display.Sprite({
        id: "textsp"
      });
      this.sprite.addChild(this._nodesp);
      this.sprite.addChild(this._textsp);
    }
  }, {
    key: "_computerAttr",
    value: function _computerAttr() {
      debugger;

      if (this.field) {
        this.dataOrg = this.dataFrame.getFieldData(this.field);
      }

      ;
      this.maxValue = _.max(this.dataOrg);
      this.minValue = _.min(this.dataOrg); //计算一些基础属性，比如maxNodeWidth等， 加入外面没有设置

      if (this.node.maxWidth == null) {
        this.node.maxWidth = parseInt(this.width * 1);
      }

      ;

      if (this.node.minWidth == null) {
        if (this.maxValue == this.minValue) {
          this.node.minWidth = this.node.maxValue;
        } else {
          this.node.minWidth = parseInt(this.node.maxWidth * (this.minValue / this.maxValue)); //this.node.minWidth = parseInt( this.node.maxWidth * 1/this.dataOrg.length );
        }
      }

      ;

      if (this.node.spireWidth == null) {
        this.node.spireWidth = this.node.minWidth;
      }

      ;

      if (!this.node.height) {
        this.node.height = parseInt(this.height / this.dataOrg.length);
      }

      ;
    }
  }, {
    key: "draw",
    value: function draw(opt) {
      !opt && (opt = {}); //第二个data参数去掉，直接trimgraphs获取最新的data

      _.extend(true, this, opt); //let me = this;
      //let animate = me.animation && !opt.resize;


      this._computerAttr();

      this.data = this._trimGraphs();

      this._drawGraphs();

      this.sprite.context.x = this.origin.x + this.width / 2;
      this.sprite.context.y = this.origin.y;
    }
  }, {
    key: "_trimGraphs",
    value: function _trimGraphs() {
      if (!this.field) return;
      var me = this; //let dataOrg = _.clone( this.dataOrg );

      var layoutData = [];

      _.each(this.dataOrg, function (num, i) {
        var ld = {
          type: "funnel",
          field: me.field,
          rowData: me.dataFrame.getRowDataAt(i),
          value: num,
          width: me._getNodeWidth(num),
          color: '',
          //me.app.getTheme(i),//默认从皮肤中获取
          cursor: "pointer",
          //下面得都在layoutData的循环中计算
          label: '',
          middlePoint: null,
          iNode: -1,
          points: []
        };
        ld.color = me._getProp(me.node, 'fillStyle', ld);
        layoutData.push(ld);
      });

      if (this.sort) {
        layoutData = layoutData.sort(function (a, b) {
          if (me.sort == "desc") {
            return b.value - a.value;
          } else {
            return a.value - b.value;
          }
        });
      }

      ;

      _.each(layoutData, function (ld, i) {
        ld.iNode = i;
        ld.label = me.label.format(ld.value, ld);
      });

      _.each(layoutData, function (ld, i) {
        ld.points = me._getPoints(ld, layoutData[i + 1], layoutData[i - 1]);
        ld.middlePoint = {
          x: 0,
          y: (ld.iNode + 0.5) * me.node.height
        };
      });

      return layoutData;
    }
  }, {
    key: "_getNodeWidth",
    value: function _getNodeWidth(num) {
      var width = this.node.maxWidth;

      if (this.maxValue != this.minValue) {
        width = parseInt(this.node.minWidth + (this.node.maxWidth - this.node.minWidth) / (this.maxValue - this.minValue) * (num - this.minValue));
      }

      ;
      return width;
    }
  }, {
    key: "_getPoints",
    value: function _getPoints(layoutData, nextLayoutData, preLayoutData) {
      var points = [];
      var topY = layoutData.iNode * this.node.height;
      var bottomY = topY + this.node.height;

      if (this.sort !== "asc") {
        points.push([-layoutData.width / 2, topY]); //左上

        points.push([layoutData.width / 2, topY]); //右上
        //let bottomWidth = this.node.minWidth;
        //if( nextLayoutData ){

        var bottomWidth = nextLayoutData ? nextLayoutData.width : layoutData.width; //};

        if (!nextLayoutData && this.node.spireWidth != null && this.maxValue != this.minValue) {
          //说明最后一个节点
          bottomWidth = Math.min(this.node.spireWidth, bottomWidth);
        }

        points.push([bottomWidth / 2, bottomY]); //右下

        points.push([-bottomWidth / 2, bottomY]); //左下
      } else {
        //正金字塔结构的话，是从最上面一个 data 的 top 取min开始
        //let topWidth = this.node.minWidth;
        //if( preLayoutData ){
        var topWidth = preLayoutData ? preLayoutData.width : layoutData.width; //};

        if (!preLayoutData && this.node.spireWidth != null && this.maxValue != this.minValue) {
          //说明最后一个节点
          topWidth = Math.min(this.node.spireWidth, topWidth);
        }

        points.push([-topWidth / 2, topY]); //左上

        points.push([topWidth / 2, topY]); //右上

        points.push([layoutData.width / 2, bottomY]); //右下

        points.push([-layoutData.width / 2, bottomY]); //左下
      }

      return points;
    }
  }, {
    key: "_drawGraphs",
    value: function _drawGraphs() {
      var me = this;

      _.each(this.data, function (ld) {
        //let fillStyle   = this._getProp(this.node, "fillStyle", geoGraph);
        var fillAlpha = me._getProp(me.node, "fillAlpha", ld);

        var strokeStyle = me._getProp(me.node, "strokeStyle", ld);

        var strokeAlpha = me._getProp(me.node, "strokeAlpha", ld);

        var lineWidth = me._getProp(me.node, "lineWidth", ld);

        var lineType = me._getProp(me.node, "lineType", ld);

        var _polygon = new Polygon({
          id: "funel_item_" + ld.iNode,
          hoverClone: false,
          context: {
            pointList: ld.points,
            fillStyle: ld.color,
            cursor: ld.cursor,
            fillAlpha: fillAlpha,
            strokeStyle: strokeStyle,
            strokeAlpha: strokeAlpha,
            lineWidth: lineWidth,
            lineType: lineType
          }
        });

        ld.nodeElement = _polygon;

        me._nodesp.addChild(_polygon);

        _polygon.nodeData = ld;

        _polygon.on(event.types.get(), function (e) {
          e.eventInfo = {
            trigger: me.node,
            title: me.field,
            nodes: [this.nodeData]
          };

          if (e.type == 'mouseover') {
            me.focusAt(this.nodeData.iNode);
          }

          ;

          if (e.type == 'mouseout') {
            !this.nodeData.selected && me.unfocusAt(this.nodeData.iNode);
          }

          ; //fire到root上面去的是为了让root去处理tips

          me.app.fire(e.type, e);
        });

        var textAlign = "center";
        var textPoint = {
          x: ld.middlePoint.x,
          y: ld.middlePoint.y
        };

        if (me.label.textAlign == "left") {
          textPoint.x = ld.points[0][0] - (ld.points[0][0] - ld.points[3][0]) / 2;
          textPoint.x -= 15;
          textAlign = "right";
        }

        ;

        if (me.label.textAlign == "right") {
          textPoint.x = ld.points[1][0] - (ld.points[1][0] - ld.points[2][0]) / 2;
          textPoint.x += 15;
          textAlign = "left";
        }

        ;
        ld.textPoint = textPoint;

        var _text = new Text(ld.label, {
          context: {
            x: textPoint.x,
            y: textPoint.y,
            fontSize: me.label.fontSize,
            fillStyle: me.label.textAlign == "center" ? me.label.fontColor : ld.color,
            textAlign: textAlign,
            textBaseline: me.label.textBaseline
          }
        });

        me._textsp.addChild(_text);

        me.node.drawEnd(ld);
      });
    }
  }, {
    key: "focusAt",
    value: function focusAt(iNode) {
      var _el = this._nodesp.getChildById('funel_item_' + iNode);

      var nodeData = _el.nodeData;

      if (_el) {
        var _el$context = _el.context,
            fillStyle = _el$context.fillStyle,
            fillAlpha = _el$context.fillAlpha,
            strokeStyle = _el$context.strokeStyle,
            strokeAlpha = _el$context.strokeAlpha;
        _el._default = {
          fillStyle: fillStyle,
          fillAlpha: fillAlpha,
          strokeStyle: strokeStyle,
          strokeAlpha: strokeAlpha
        };
        var focusFillStyle = this._getProp(this.node.focus, "fillStyle", nodeData) || fillStyle;
        var focusFillAlpha = this._getProp(this.node.focus, "fillAlpha", nodeData) || fillAlpha;
        var focusStrokeStyle = this._getProp(this.node.focus, "strokeStyle", nodeData) || strokeStyle;
        var focusStrokeAlpha = this._getProp(this.node.focus, "strokeAlpha", nodeData) || strokeAlpha;

        var focusLineWidth = this._getProp(this.node.focus, "lineWidth", nodeData);

        var focusLineType = this._getProp(this.node.focus, "lineType", nodeData);

        _el.context.fillStyle = focusFillStyle;
        _el.context.fillAlpha = focusFillAlpha;
        _el.context.strokeStyle = focusStrokeStyle;
        _el.context.strokeAlpha = focusStrokeAlpha;
        _el.context.lineWidth = focusLineWidth;
        _el.context.lineType = focusLineType;
      }
    }
  }, {
    key: "unfocusAt",
    value: function unfocusAt(iNode) {
      var _el = this._nodesp.getChildById('funel_item_' + iNode);

      if (_el) {
        var _el$_default = _el._default,
            fillStyle = _el$_default.fillStyle,
            fillAlpha = _el$_default.fillAlpha,
            strokeStyle = _el$_default.strokeStyle,
            strokeAlpha = _el$_default.strokeAlpha,
            lineType = _el$_default.lineType,
            lineWidth = _el$_default.lineWidth;
        _el.context.fillStyle = fillStyle;
        _el.context.fillAlpha = fillAlpha;
        _el.context.strokeStyle = strokeStyle;
        _el.context.strokeAlpha = strokeAlpha;
        _el.context.lineWidth = lineWidth;
        _el.context.lineType = lineType;
      }
    }
  }, {
    key: "_getProp",
    value: function _getProp(propPath, type, nodeData) {
      var configValue = propPath[type];
      var value;

      if (_.isFunction(configValue)) {
        value = configValue.apply(this, [nodeData, this.dataFrame]);
      } else {
        value = configValue;
      }

      ;

      if (type == "fillStyle") {
        var rowData = nodeData.rowData;

        if (rowData) {
          if (rowData[type] !== undefined) {
            value = rowData[type];
          } else {
            var val = rowData[this.field];

            if (!isNaN(val) && val != '') {
              var alpha = (val - this.minValue) / (this.maxValue - this.minValue) * (this.node.fillAlpha - this.node.minFillAlpha) + this.node.minFillAlpha;

              if (isNaN(alpha)) {
                //所有的数值都相同的时候，alpha会是NaN
                alpha = 1;
              }

              ;
              value = (0, _color.colorRgba)(this.node.maxFillStyle, parseFloat(alpha.toFixed(2)));
            }
          }
        }
      }

      return value;
    }
  }]);
  return FunnelGraphs;
}(_index["default"]);

_index["default"].registerComponent(FunnelGraphs, 'graphs', 'funnel');

var _default2 = FunnelGraphs;
exports["default"] = _default2;