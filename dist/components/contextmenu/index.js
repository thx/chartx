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

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var _ = _canvax["default"]._;

var contextMenu = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(contextMenu, _Component);

  var _super = _createSuper(contextMenu);

  function contextMenu(opt, app) {
    var _this;

    (0, _classCallCheck2["default"])(this, contextMenu);
    _this = _super.call(this, opt, app);
    _this.name = "contextmenu";
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
      id: "contextMenuSprite"
    });

    _this.app.stage.addChild(_this.sprite);

    var me = (0, _assertThisInitialized2["default"])(_this);

    _this.sprite.on("destroy", function () {
      me._removeContent();
    });

    _this.isShow = false;

    _.extend(true, (0, _assertThisInitialized2["default"])(_this), (0, _tools.getDefaultProps)(contextMenu.defaultProps()), opt);

    _this.tipDomContainer = document ? document.body : null; //右键菜单只能放body下面
    // if( document ){
    //     if( this.containerIsBody ){
    //         this.tipDomContainer = document.body; 
    //     } else {
    //         this.tipDomContainer = this.app.canvax.domView;
    //     }
    // }; // (document && this.containerIsBody) ? document.body : null; //this.app.canvax.domView;

    return _this;
  }

  (0, _createClass2["default"])(contextMenu, [{
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

          this.sprite.toFront();
        } else {
          this._hideDialogMenus(e);
        }
      } else {
        this._hideDialogMenus(e);
      }

      this.onshow.apply(this, [e]);
      this.isShow = true;
    }
  }, {
    key: "hide",
    value: function hide(e) {
      if (!this.enabled) return;

      this._hideDialogMenus(e);

      this.onhide.apply(this, [e]);
      this.isShow = false;
    }
  }, {
    key: "_hideDialogMenus",
    value: function _hideDialogMenus() {
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
      }

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
    key: "_creatMenuDom",
    value: function _creatMenuDom(e) {
      var _this2 = this;

      if (document) {
        this._tipDom = document.createElement("div");
        this._tipDom.className = "context-menu-tips";
        this._tipDom.style.cssText += "; border-radius:" + this.borderRadius + "px;background:" + this.fillStyle + ";border:1px solid " + this.strokeStyle + ";visibility:hidden;position:" + (this.containerIsBody ? 'fixed' : 'absolute') + ";z-index:99999999;enabled:inline-block;*enabled:inline;*zoom:1;padding:6px;color:" + this.fontColor + ";line-height:1.5";
        this._tipDom.style.cssText += "; box-shadow:1px 1px 3px " + this.strokeStyle + ";";
        this._tipDom.style.cssText += "; border:none;white-space:nowrap;word-wrap:normal;";
        this._tipDom.style.cssText += "; text-align:left;";
        this._tipDom.style.cssText += "; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;";

        this._tipDom.onclick = function () {
          _this2.hide();
        };

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
      var tipxContent = this._getContent(e);

      if (!tipxContent && tipxContent !== 0) {
        return;
      }

      ;

      if (!this._tipDom) {
        this._tipDom = this._creatMenuDom(e);
      }

      ; //小程序等场景就无法创建_tipDom

      if (this._tipDom) {
        this._tipDom.innerHTML = tipxContent;
        this.dW = this._tipDom.offsetWidth;
        this.dH = this._tipDom.offsetHeight;
      }

      ;
      return tipxContent;
    }
  }, {
    key: "_getContent",
    value: function _getContent(e) {
      var tipsContent;

      if (this.content) {
        tipsContent = _.isFunction(this.content) ? this.content(e.eventInfo, e) : this.content;
      } else {
        tipsContent = '';
      }

      ;
      return tipsContent;
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
  }], [{
    key: "defaultProps",
    value: function defaultProps() {
      return {
        enabled: {
          detail: '是否开启右键菜单',
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
  return contextMenu;
}(_component["default"]);

_component["default"].registerComponent(contextMenu, 'contextmenu');

var _default2 = contextMenu;
exports["default"] = _default2;