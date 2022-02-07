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

var _component = _interopRequireDefault(require("../component"));

var _canvax = _interopRequireDefault(require("canvax"));

var _tools = require("../../utils/tools");

var _numeral = _interopRequireDefault(require("numeral"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var _ = _canvax["default"]._;
var Rect = _canvax["default"].Shapes.Rect;
var Line = _canvax["default"].Shapes.Line;

var Tips = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(Tips, _Component);

  var _super = _createSuper(Tips);

  function Tips(opt, app) {
    var _this;

    (0, _classCallCheck2["default"])(this, Tips);
    _this = _super.call(this, opt, app);
    _this.name = "tips";
    _this.tipDomContainer = document ? document.body : null; //this.app.canvax.domView;

    _this.cW = 0; //容器的width

    _this.cH = 0; //容器的height

    _this.dW = 0; //html的tips内容width

    _this.dH = 0; //html的tips内容Height

    _this._tipDom = null;
    _this._tipsPointer = null; //所有调用tip的 event 上面 要附带有符合下面结构的eventInfo属性
    //会deepExtend到this.indo上面来

    _this.eventInfo = null;
    _this.sprite = null;
    _this.sprite = new _canvax["default"].Display.Sprite({
      id: "TipSprite"
    });

    _this.app.stage.addChild(_this.sprite);

    var me = (0, _assertThisInitialized2["default"])(_this);

    _this.sprite.on("destroy", function () {
      //me._tipDom = null;
      me._removeContent();
    });

    _.extend(true, (0, _assertThisInitialized2["default"])(_this), (0, _tools.getDefaultProps)(Tips.defaultProps()), opt);

    return _this;
  }

  (0, _createClass2["default"])(Tips, [{
    key: "show",
    value: function show(e) {
      if (!this.enabled) return;

      if (e.eventInfo) {
        this.eventInfo = e.eventInfo; //TODO:这里要优化，canvax后续要提供直接获取canvax实例的方法

        var stage = e.target.getStage();

        if (stage) {
          this.cW = stage.context.width;
          this.cH = stage.context.height;
        } else {
          if (e.target.type == 'canvax') {
            this.cW = e.target.width;
            this.cH = e.target.height;
          }

          ;
        }

        ;

        var content = this._setContent(e);

        if (content) {
          this._setPosition(e);

          this.sprite.toFront(); //比如散点图，没有hover到点的时候，也要显示，所有放到最下面
          //反之，如果只有hover到点的时候才显示point，那么就放这里
          //this._tipsPointerShow(e);
        } else {
          this._hide(e);
        }
      }

      ;

      this._tipsPointerShow(e);

      this.onshow.apply(this, [e]);
    }
  }, {
    key: "move",
    value: function move(e) {
      if (!this.enabled) return;

      if (e.eventInfo) {
        this.eventInfo = e.eventInfo;

        var content = this._setContent(e);

        if (content) {
          this._setPosition(e); //比如散点图，没有hover到点的时候，也要显示，所有放到最下面
          //反之，如果只有hover到点的时候才显示point，那么就放这里
          //this._tipsPointerMove(e)

        } else {
          //move的时候hide的只有dialogTips, pointer不想要隐藏
          this._hideDialogTips();
        }
      }

      ;

      this._tipsPointerMove(e);

      this.onmove.apply(this, [e]);
    }
  }, {
    key: "hide",
    value: function hide(e) {
      this._hide(e);

      this.onhide.apply(this, [e]);
    }
  }, {
    key: "_hide",
    value: function _hide(e) {
      if (!this.enabled) return;

      this._hideDialogTips(e);

      this._tipsPointerHide(e);
    }
  }, {
    key: "_hideDialogTips",
    value: function _hideDialogTips() {
      if (this.eventInfo) {
        this.eventInfo = null;
        this.sprite.removeAllChildren();

        this._removeContent();
      }

      ;
    }
    /**
     *@pos {x:0,y:0}
     */

  }, {
    key: "_setPosition",
    value: function _setPosition(e) {
      //tips直接修改为fixed，所以定位直接用e.x e.y 2020-02-27
      if (!this.enabled) return;
      if (!this._tipDom) return; //let x = this._checkX( e.clientX + this.offsetX);
      //let y = this._checkY( e.clientY + this.offsetY);

      var domBounding = this.app.canvax.el.getBoundingClientRect();

      var x = this._checkX(e.offsetX + domBounding.x + this.offsetX);

      var y = this._checkY(e.offsetY + domBounding.y + this.offsetY);

      this._tipDom.style.cssText += ";visibility:visible;left:" + x + "px;top:" + y + "px;";

      if (this.positionOfPoint == "left") {
        this._tipDom.style.left = this._checkX(e.x - this.offsetX - this._tipDom.offsetWidth) + "px";
      }

      ;
    }
    /**
     *content相关-------------------------
     */

  }, {
    key: "_creatTipDom",
    value: function _creatTipDom(e) {
      this._tipDom = document.createElement("div");
      this._tipDom.className = "chart-tips";
      this._tipDom.style.cssText += "; border-radius:" + this.borderRadius + "px;background:" + this.fillStyle + ";border:1px solid " + this.strokeStyle + ";visibility:hidden;position:fixed;z-index:99999;enabled:inline-block;*enabled:inline;*zoom:1;padding:6px;color:" + this.fontColor + ";line-height:1.5";
      this._tipDom.style.cssText += "; box-shadow:1px 1px 3px " + this.strokeStyle + ";";
      this._tipDom.style.cssText += "; border:none;white-space:nowrap;word-wrap:normal;";
      this._tipDom.style.cssText += "; text-align:left;pointer-events:none;";
      this._tipDom.style.cssText += "; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;";
      this.tipDomContainer && this.tipDomContainer.appendChild(this._tipDom);
    }
  }, {
    key: "_removeContent",
    value: function _removeContent() {
      if (!this._tipDom) return;
      this.tipDomContainer && this.tipDomContainer.removeChild(this._tipDom);
      this._tipDom = null;
    }
  }, {
    key: "_setContent",
    value: function _setContent(e) {
      var tipxContent = this._getContent(e);

      if (!tipxContent && tipxContent !== 0) {
        return;
      }

      ;

      if (!this._tipDom) {
        this._creatTipDom(e);
      }

      ;
      this._tipDom.innerHTML = tipxContent;
      this.dW = this._tipDom.offsetWidth;
      this.dH = this._tipDom.offsetHeight;
      return tipxContent;
    }
  }, {
    key: "_getContent",
    value: function _getContent(e) {
      var tipsContent;

      if (this.content) {
        tipsContent = _.isFunction(this.content) ? this.content(e.eventInfo, e) : this.content;
      } else {
        tipsContent = this._getDefaultContent(e.eventInfo);
      }

      ;
      return tipsContent;
    }
  }, {
    key: "_getDefaultContent",
    value: function _getDefaultContent(info) {
      var _coord = this.app.getComponent({
        name: 'coord'
      });

      var str = "";

      if (!info.nodes.length && !info.tipsContent) {
        return str;
      }

      ;

      if (info.nodes.length) {
        str += "<table >";

        if (info.title !== undefined && info.title !== null && info.title !== "") {
          str += "<tr><td colspan='2' style='text-align:left'>";
          str += "<span style='font-size:12px;padding:4px;color:#333;'>" + info.title + "</span>";
          str += "</td></tr>";
        }

        ;

        _.each(info.nodes, function (node, i) {
          // if (!node.value && node.value !== 0) {
          //     return;
          // };
          var hasValue = node.value || node.value === 0;
          var style = node.color || node.fillStyle || node.strokeStyle;
          var name, value;

          var fieldConfig = _coord.getFieldConfig(node.field);

          name = fieldConfig.name || node.name || node.field || node.content || node.label;
          value = fieldConfig.getFormatValue(node.value);

          if (!hasValue) {
            style = "#ddd";
            value = '--';
          }

          str += "<tr>";
          str += "<td style='padding:0px 6px;color:" + (!hasValue ? '#ddd' : '#a0a0a0;') + "'>" + name + "</td>";
          str += "<td style='padding:0px 6px;'><span style='color:" + style + "'>" + value + "</span></td>";
          str += "</tr>";
        });

        str += "</table>";
      }

      if (info.tipsContent) {
        str += info.tipsContent;
      }

      return str;
    }
    /**
     *检测是x方向超过了视窗
     */

  }, {
    key: "_checkX",
    value: function _checkX(x) {
      var w = this.dW + 2; //后面的2 是 两边的 linewidth

      var scrollLeft = document.body.scrollLeft;
      var clientWidth = document.body.clientWidth;

      if (x < scrollLeft) {
        x = scrollLeft;
      } else if (x + w > clientWidth) {
        x = scrollLeft + (clientWidth - w);
      }

      return x;
    }
    /**
     *检测是y方向超过了视窗
     */

  }, {
    key: "_checkY",
    value: function _checkY(y) {
      var h = this.dH + 2; //后面的2 是 两边的 linewidth

      var scrollTop = document.body.scrollTop;
      var clientHeight = document.documentElement.clientHeight;

      if (y < scrollTop) {
        y = scrollTop;
      } else if (y + h > clientHeight) {
        y = scrollTop + (clientHeight - h);
      }

      return y;
    }
  }, {
    key: "_tipsPointerShow",
    value: function _tipsPointerShow(e) {
      //legend等组件上面的tips是没有xAxis等轴信息的
      if (!e.eventInfo || !e.eventInfo.xAxis) {
        return;
      }

      ;

      var _coord = this.app.getComponent({
        name: 'coord'
      }); //目前只实现了直角坐标系的tipsPointer


      if (!_coord || _coord.type != 'rect') return;
      if (!this.pointer) return;
      var el = this._tipsPointer;
      var y = _coord.origin.y - _coord.height;
      var x = 0;

      if (this.pointer == "line") {
        x = _coord.origin.x + e.eventInfo.xAxis.x;
      }

      if (this.pointer == "region") {
        var regionWidth = _coord._xAxis.getCellLengthOfPos(e.eventInfo.xAxis.x);

        x = _coord.origin.x + e.eventInfo.xAxis.x - regionWidth / 2;

        if (e.eventInfo.xAxis.ind < 0) {
          //当没有任何数据的时候， e.eventInfo.xAxis.ind==-1
          x = _coord.origin.x;
        }
      }

      if (!el) {
        if (this.pointer == "line") {
          el = new Line({
            //xyToInt : false,
            context: {
              x: x,
              y: y,
              start: {
                x: 0,
                y: 0
              },
              end: {
                x: 0,
                y: _coord.height
              },
              lineWidth: this.pointerLineWidth,
              strokeStyle: this.pointerColor
            }
          });
        }

        ;

        if (this.pointer == "region") {
          var _regionWidth = _coord._xAxis.getCellLengthOfPos(x);

          el = new Rect({
            //xyToInt : false,
            context: {
              width: _regionWidth,
              height: _coord.height,
              x: x,
              y: y,
              fillStyle: this.pointerColor,
              globalAlpha: this.pointerRegionAlpha
            }
          });
        }

        ;
        this.app.graphsSprite.addChild(el, 0);
        this._tipsPointer = el;
      } else {
        if (this.pointerAnim && _coord._xAxis.layoutType != "proportion") {
          if (el.__animation) {
            el.__animation.stop();
          }

          ;
          el.__animation = el.animate({
            x: x,
            y: y
          }, {
            duration: 200
          });
        } else {
          el.context.x = x;
          el.context.y = y;
        }
      }
    }
  }, {
    key: "_tipsPointerHide",
    value: function _tipsPointerHide(e) {
      //legend等组件上面的tips是没有xAxis等轴信息的
      if (!e.eventInfo || !e.eventInfo.xAxis) {
        return;
      }

      ;

      var _coord = this.app.getComponent({
        name: 'coord'
      }); //目前只实现了直角坐标系的tipsPointer


      if (!_coord || _coord.type != 'rect') return;
      if (!this.pointer || !this._tipsPointer) return;

      this._tipsPointer.destroy();

      this._tipsPointer = null;
    }
  }, {
    key: "_tipsPointerMove",
    value: function _tipsPointerMove(e) {
      //legend等组件上面的tips是没有xAxis等轴信息的
      if (!e.eventInfo || !e.eventInfo.xAxis) {
        return;
      }

      ;

      var _coord = this.app.getComponent({
        name: 'coord'
      }); //目前只实现了直角坐标系的tipsPointer


      if (!_coord || _coord.type != 'rect') return;
      if (!this.pointer || !this._tipsPointer) return; //console.log("move");

      var el = this._tipsPointer;
      var x = _coord.origin.x + e.eventInfo.xAxis.x;

      if (this.pointer == "region") {
        var regionWidth = _coord._xAxis.getCellLengthOfPos(e.eventInfo.xAxis.x);

        x = _coord.origin.x + e.eventInfo.xAxis.x - regionWidth / 2;

        if (e.eventInfo.xAxis.ind < 0) {
          //当没有任何数据的时候， e.eventInfo.xAxis.ind==-1
          x = _coord.origin.x;
        }
      }

      ;
      var y = _coord.origin.y - _coord.height;

      if (x == el.__targetX) {
        return;
      }

      ;

      if (this.pointerAnim && _coord._xAxis.layoutType != "proportion") {
        if (el.__animation) {
          el.__animation.stop();
        }

        ;
        el.__targetX = x;
        el.__animation = el.animate({
          x: x,
          y: y
        }, {
          duration: 200,
          onComplete: function onComplete() {
            delete el.__targetX;
            delete el.__animation;
          }
        });
      } else {
        el.context.x = x;
        el.context.y = y;
      }
    }
  }], [{
    key: "defaultProps",
    value: function defaultProps() {
      return {
        enabled: {
          detail: '是否开启Tips',
          "default": true
        },
        content: {
          detail: '自定义tips的内容（html）',
          "default": null
        },
        borderRadius: {
          detail: 'tips的边框圆角半径',
          "default": 5
        },
        strokeStyle: {
          detail: 'tips边框颜色',
          "default": '#ccc'
        },
        fillStyle: {
          detail: 'tips背景色',
          "default": 'rgba(255,255,255,0.95)'
        },
        fontColor: {
          detail: 'tips文本颜色',
          "default": '#999999'
        },
        positionOfPoint: {
          detail: 'tips在触发点的位置，默认在右侧',
          "default": 'right'
        },
        offsetX: {
          detail: 'tips内容到鼠标位置的偏移量x',
          "default": 10
        },
        offsetY: {
          detail: 'tips内容到鼠标位置的偏移量y',
          "default": 10
        },
        positionInRange: {
          detail: 'tip的浮层是否限定在画布区域(废弃)',
          "default": false
        },
        pointer: {
          detail: '触发tips的时候的指针样式',
          "default": 'line',
          documentation: 'tips的指针,默认为直线，可选为："line" | "region"(柱状图中一般用region)'
        },
        pointerColor: {
          detail: 'tips指针样式的颜色',
          "default": "#ccc"
        },
        pointerLineWidth: {
          detail: 'pointer为line的时候，设置指针line的线宽，默认1.5',
          "default": 1
        },
        pointerRegionAlpha: {
          detail: 'pointer为region的时候，设置指针region的透明度',
          "default": 0.25
        },
        pointerAnim: {
          detail: 'tips移动的时候，指针是否开启动画',
          "default": true
        },
        linkageName: {
          detail: 'tips的多图表联动，相同的图表会执行事件联动，这个属性注意要保证y轴的width是一致的',
          "default": null
        },
        onshow: {
          detail: 'show的时候的事件',
          "default": function _default() {}
        },
        onmove: {
          detail: 'move的时候的事件',
          "default": function _default() {}
        },
        onhide: {
          detail: 'hide的时候的事件',
          "default": function _default() {}
        }
      };
    }
  }]);
  return Tips;
}(_component["default"]);

_component["default"].registerComponent(Tips, 'tips');

var _default2 = Tips;
exports["default"] = _default2;