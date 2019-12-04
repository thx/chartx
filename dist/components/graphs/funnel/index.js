"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "canvax", "../index", "../../../utils/tools", "mmvis"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("canvax"), require("../index"), require("../../../utils/tools"), require("mmvis"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.canvax, global.index, global.tools, global.mmvis);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _canvax, _index, _tools, _mmvis) {
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

  var Text = _canvax2["default"].Display.Text;
  var Polygon = _canvax2["default"].Shapes.Polygon;

  var FunnelGraphs = function (_GraphsBase) {
    _inherits(FunnelGraphs, _GraphsBase);

    _createClass(FunnelGraphs, null, [{
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
          maxNodeWidth: {
            detail: '最大的元素宽',
            "default": null
          },
          minNodeWidth: {
            detail: '最小的元素宽',
            "default": 0
          },
          minVal: {
            detail: '漏斗的塔尖',
            "default": 0
          },
          node: {
            detail: '单个元素图形配置',
            propertys: {
              height: {
                detail: '高',
                "default": 0,
                documentation: '漏斗单元高，如果options没有设定， 就会被自动计算为 this.height/dataOrg.length'
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

      _classCallCheck(this, FunnelGraphs);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(FunnelGraphs).call(this, opt, app));
      _this.type = "funnel";
      _this.dataOrg = []; //this.dataFrame.getFieldData( this.field )

      _this.data = []; //layoutData list , default is empty Array

      _this._maxVal = null;
      _this._minVal = null;

      _mmvis._.extend(true, _assertThisInitialized(_this), (0, _mmvis.getDefaultProps)(FunnelGraphs.defaultProps()), opt);

      _this.init();

      return _this;
    }

    _createClass(FunnelGraphs, [{
      key: "init",
      value: function init() {}
    }, {
      key: "_computerAttr",
      value: function _computerAttr() {
        if (this.field) {
          this.dataOrg = this.dataFrame.getFieldData(this.field);
        }

        ;
        this._maxVal = _mmvis._.max(this.dataOrg);
        this._minVal = _mmvis._.min(this.dataOrg); //计算一些基础属性，比如maxNodeWidth等， 加入外面没有设置

        if (!this.maxNodeWidth) {
          this.maxNodeWidth = this.width * 0.7;
        }

        ;

        if (!this.node.height) {
          this.node.height = this.height / this.dataOrg.length;
        }

        ;
      }
    }, {
      key: "draw",
      value: function draw(opt) {
        !opt && (opt = {}); //第二个data参数去掉，直接trimgraphs获取最新的data

        _mmvis._.extend(true, this, opt);

        var me = this;
        var animate = me.animation && !opt.resize;

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
        var me = this; //var dataOrg = _.clone( this.dataOrg );

        var layoutData = [];

        _mmvis._.each(this.dataOrg, function (num, i) {
          var ld = {
            type: "funnel",
            field: me.field,
            rowData: me.dataFrame.getRowDataAt(i),
            value: num,
            width: me._getNodeWidth(num),
            color: me.app.getTheme(i),
            //默认从皮肤中获取
            cursor: "pointer",
            //下面得都在layoutData的循环中计算
            label: '',
            middlePoint: null,
            iNode: -1,
            points: []
          };
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

        _mmvis._.each(layoutData, function (ld, i) {
          ld.iNode = i;
          ld.label = me.label.format(ld.value, ld);
        });

        _mmvis._.each(layoutData, function (ld, i) {
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
        var width = this.minNodeWidth + (this.maxNodeWidth - this.minNodeWidth) / (this._maxVal - this.minVal) * (num - this.minVal);
        return parseInt(width);
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

          var bottomWidth = this.minNodeWidth;

          if (nextLayoutData) {
            bottomWidth = nextLayoutData.width;
          }

          ;
          points.push([bottomWidth / 2, bottomY]); //右下

          points.push([-bottomWidth / 2, bottomY]); //左下
        } else {
          //正金字塔结构的话，是从最上面一个 data 的 top 取min开始
          var topWidth = this.minNodeWidth;

          if (preLayoutData) {
            topWidth = preLayoutData.width;
          }

          ;
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

        _mmvis._.each(this.data, function (ld) {
          var _polygon = new Polygon({
            context: {
              pointList: ld.points,
              fillStyle: ld.color,
              cursor: ld.cursor
            }
          });

          me.sprite.addChild(_polygon);
          _polygon.nodeData = ld;

          _polygon.on(_mmvis.event.types.get(), function (e) {
            e.eventInfo = {
              trigger: me.node,
              title: me.field,
              nodes: [this.nodeData]
            }; //fire到root上面去的是为了让root去处理tips

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

          me.sprite.addChild(_text);
        });
      }
    }]);

    return FunnelGraphs;
  }(_index2["default"]);

  _mmvis.global.registerComponent(FunnelGraphs, 'graphs', 'funnel');

  exports["default"] = FunnelGraphs;
});