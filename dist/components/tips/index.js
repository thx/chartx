"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _component = _interopRequireDefault(require("../component"));

var _canvax = _interopRequireDefault(require("canvax"));

var _tools = require("../../utils/tools");

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

    _this.tipDomContainer = null;

    if (document) {
      if (_this.containerIsBody) {
        _this.tipDomContainer = document.body;
      } else {
        _this.tipDomContainer = _this.app.canvax.domView;
      }
    }

    ; // (document && this.containerIsBody) ? document.body : null; //this.app.canvax.domView;

    return _this;
  }

  (0, _createClass2["default"])(Tips, [{
    key: "show",
    value: function show(e) {
      var _this2 = this;

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

        content.then(function (content) {
          if (content) {
            _this2._setPosition(e);

            _this2.sprite.toFront();
          } else {
            _this2._hideDialogTips(e);
          }
        });
      } else {
        this._hideDialogTips(e);
      }

      this._tipsPointerShow(e);

      this.onshow.apply(this, [e]);
    }
  }, {
    key: "move",
    value: function move(e) {
      var _this3 = this;

      if (!this.enabled) return;

      if (e.eventInfo) {
        this.eventInfo = e.eventInfo;

        var content = this._setContent(e);

        content.then(function (content) {
          if (content) {
            _this3._setPosition(e);
          } else {
            //move的时候hide的只有dialogTips, pointer不想要隐藏
            _this3._hideDialogTips();
          }
        });
      }

      ;

      this._tipsPointerMove(e);

      this.onmove.apply(this, [e]);
    }
  }, {
    key: "hide",
    value: function hide(e) {
      //console.log('tips hide')
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
      if (!this._tipDom) return;
      var domBounding = this.app.canvax.el.getBoundingClientRect();
      var domBX = domBounding.x || domBounding.left;
      var domBY = domBounding.y || domBounding.top;
      var x, y;

      if (this.containerIsBody) {
        var globalPoint = e.target.localToGlobal(e.point);
        x = this._checkX(globalPoint.x + domBX + this.offsetX);
        y = this._checkY(globalPoint.y + domBY + this.offsetY);
      } else {
        x = this._checkX(e.offsetX + domBX + this.offsetX);
        y = this._checkY(e.offsetY + domBY + this.offsetY);
        x -= domBX;
        y -= domBY;
      } //let x = this._checkX( e.clientX + this.offsetX);
      //let y = this._checkY( e.clientY + this.offsetY);


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
      if (document) {
        this._tipDom = document.createElement("div");
        this._tipDom.className = "chart-tips";
        this._tipDom.style.cssText += "; border-radius:" + this.borderRadius + "px;background:" + this.fillStyle + ";border:1px solid " + this.strokeStyle + ";visibility:hidden;position:" + (this.containerIsBody ? 'fixed' : 'absolute') + ";z-index:99999999;enabled:inline-block;*enabled:inline;*zoom:1;padding:6px;color:" + this.fontColor + ";line-height:1.5";
        this._tipDom.style.cssText += "; box-shadow:1px 1px 3px " + this.strokeStyle + ";";
        this._tipDom.style.cssText += "; border:none;white-space:nowrap;word-wrap:normal;";
        this._tipDom.style.cssText += "; text-align:left;pointer-events:none;";
        this._tipDom.style.cssText += "; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;";
        this.tipDomContainer && this.tipDomContainer.appendChild(this._tipDom);
        return this._tipDom;
      }
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
      var _this4 = this;

      return new Promise(function (resolve) {
        var tipxContent = _this4._getContent(e);

        if (!tipxContent && tipxContent !== 0) {
          resolve('');
          return;
        }

        ;

        if (!_this4._tipDom) {
          _this4._tipDom = _this4._creatTipDom(e);
        }

        ; //小程序等场景就无法创建_tipDom

        if (_this4._tipDom) {
          if (tipxContent.then) {
            tipxContent.then(function (tipxContent) {
              _this4._tipDom.innerHTML = tipxContent;
              _this4.dW = _this4._tipDom.offsetWidth;
              _this4.dH = _this4._tipDom.offsetHeight;
              resolve(tipxContent);
            });
          } else {
            _this4._tipDom.innerHTML = tipxContent;
            _this4.dW = _this4._tipDom.offsetWidth;
            _this4.dH = _this4._tipDom.offsetHeight;
            resolve(tipxContent);
          }
        }

        ;
      });
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
      var hasNodesContent = false;

      if (info.nodes.length) {
        str += "<table >";

        if (info.title !== undefined && info.title !== null && info.title !== "") {
          str += "<tr><td colspan='2' style='text-align:left;padding-left:3px;'>";
          str += "<span style='font-size:12px;padding:4px;color:#333;'>" + info.title + "</span>";
          str += "</td></tr>";
          hasNodesContent = true;
        }

        ;

        _.each(info.nodes, function (node, i) {
          // if (!node.value && node.value !== 0) {
          //     return;
          // };
          var style = node.color || node.fillStyle || node.strokeStyle;
          var name, value;

          var fieldConfig = _coord.getFieldConfig(node.field); //node.name优先级最高，是因为像 pie funnel cloud 等一维图表，会有name属性
          //关系图中会有content


          name = node.name || node.label || (fieldConfig || {}).name || node.content || node.field || '';
          str += "<tr>";

          if ((0, _typeof2["default"])(node.value) == 'object') {
            //主要是用在散点图的情况
            if (node.value && node.value.x) {
              var xfieldConfig = _coord.getFieldConfig(info.xAxis.field);

              var xName = xfieldConfig && xfieldConfig.name || info.xAxis.field;
              var xvalue = xfieldConfig ? xfieldConfig.getFormatValue(node.value.x) : node.value.x;
              str += "<td style='padding:0px 6px;'>" + xName + "：<span style='color:" + style + "'>" + xvalue + "</span></td>";
              hasNodesContent = true;
            }

            if (node.value && node.value.y) {
              value = fieldConfig ? fieldConfig.getFormatValue(node.value.y) : node.value.y;
              str += "<td style='padding:0px 6px;'>" + name + "：<span style='color:" + style + "'>" + value + "</span></td>";
              hasNodesContent = true;
            }
          } else {
            value = fieldConfig ? fieldConfig.getFormatValue(node.value) : node.value;
            var hasValue = node.value || node.value === 0;

            if (!hasValue && !node.__no_value) {
              style = "#ddd";
              value = '--';
            }

            if (!node.__no__name) {
              str += "<td style='padding:0px 6px;color:" + (!hasValue && !node.__no_value ? '#ddd' : '#a0a0a0;') + "'>" + name + "</td>";
              hasNodesContent = true;
            }

            if (!node.__no_value) {
              str += "<td style='padding:0px 6px;font-weight:bold;'>";
              str += "<span style='color:" + style + "'>" + value + "</span>";

              if (node.subValue) {
                str += "<span style='padding-left:6px;font-weight:normal;'>" + node.subValue + "</span>";
                hasNodesContent = true;
              }

              ;
              str += "</td>";
            }
          }

          str += "</tr>";
        });

        str += "</table>";
      }

      if (!hasNodesContent) {
        str = "";
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

      var left = 0;
      var clientWidth = document.documentElement.clientWidth;

      if (x < left) {
        x = left;
      } else if (x + w > clientWidth) {
        x = clientWidth - w;
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

      var top = 0;
      var clientHeight = document.documentElement.clientHeight;

      if (y < top) {
        y = top;
      } else if (y + h > clientHeight) {
        y = clientHeight - h;
      }

      return y;
    }
  }, {
    key: "_tipsPointerShow",
    value: function _tipsPointerShow(e) {
      var _this5 = this;

      //legend等组件上面的tips是没有xAxis等轴信息的
      if (!e.eventInfo || !e.eventInfo.xAxis) {
        return;
      }

      ;

      var _coord = this.app.getComponent({
        name: 'coord'
      }); //目前只实现了直角坐标系的tipsPointer


      if (!_coord || _coord.type != 'rect') return;
      if (!this.pointer) return; //自动检测到如果数据里有一个柱状图的数据， 那么就启用region的pointer

      e.eventInfo.nodes.forEach(function (node) {
        if (node.type == "bar") {
          _this5.pointer = "region";
        }
      });
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
      if (!this.pointer || !this._tipsPointer) return;
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
        containerIsBody: {
          detail: 'tips的html内容是否放到body下面，默认true，false则放到图表自身的容器内',
          "default": true
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
          "default": 0.38
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