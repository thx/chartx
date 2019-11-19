"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../component", "canvax", "mmvis"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../component"), require("canvax"), require("mmvis"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.component, global.canvax, global.mmvis);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _component, _canvax, _mmvis) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _component2 = _interopRequireDefault(_component);

  var _canvax2 = _interopRequireDefault(_canvax);

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

  var AnimationFrame = _canvax2["default"].AnimationFrame;

  var GraphsBase = function (_Component) {
    _inherits(GraphsBase, _Component);

    _createClass(GraphsBase, null, [{
      key: "defaultProps",
      value: function defaultProps() {
        return {
          type: {
            detail: '绘图组件',
            "default": "",
            insertText: "type: ",
            values: ["bar", "line", "pie", "scat"] //具体的在index中批量设置，

          },
          animation: {
            detail: '是否开启入场动画',
            "default": true
          },
          aniDuration: {
            detail: '动画时长',
            "default": 500
          }
        };
      }
    }]);

    function GraphsBase(opt, app) {
      var _this;

      _classCallCheck(this, GraphsBase);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(GraphsBase).call(this, opt, app)); //这里不能把opt个extend进this

      _mmvis._.extend(true, _assertThisInitialized(_this), (0, _mmvis.getDefaultProps)(GraphsBase.defaultProps()));

      _this.name = "graphs"; //这里所有的opts都要透传给 group

      _this._opt = opt || {};
      _this.app = app;
      _this.ctx = app.stage.canvas.getContext("2d");
      _this.dataFrame = app.dataFrame; //app.dataFrame的引用

      _this.data = null; //没个graphs中自己_trimGraphs的数据

      _this.width = 0;
      _this.height = 0;
      _this.origin = {
        x: 0,
        y: 0
      };
      _this.inited = false;
      _this.sprite = new _canvax2["default"].Display.Sprite({
        name: "graphs_" + opt.type
      });

      _this.app.graphsSprite.addChild(_this.sprite);

      _this._growTween = null;

      var me = _assertThisInitialized(_this);

      _this.sprite.on("destroy", function () {
        if (me._growTween) {
          AnimationFrame.destroyTween(me._growTween);
          me._growTween = null;
        }

        ;
      });

      return _this;
    }

    _createClass(GraphsBase, [{
      key: "tipsPointerOf",
      value: function tipsPointerOf(e) {}
    }, {
      key: "tipsPointerHideOf",
      value: function tipsPointerHideOf(e) {}
    }, {
      key: "focusAt",
      value: function focusAt(ind, field) {}
    }, {
      key: "unfocusAt",
      value: function unfocusAt(ind, field) {}
    }, {
      key: "selectAt",
      value: function selectAt(ind, field) {}
    }, {
      key: "unselectAt",
      value: function unselectAt(ind, field) {}
    }, {
      key: "getSelectedList",
      value: function getSelectedList() {
        return [];
      }
    }, {
      key: "getSelectedRowList",
      value: function getSelectedRowList() {
        return [];
      }
    }, {
      key: "hide",
      value: function hide(field) {}
    }, {
      key: "show",
      value: function show(field) {}
    }, {
      key: "getLegendData",
      value: function getLegendData() {}
    }, {
      key: "triggerEvent",
      value: function triggerEvent(e) {
        var trigger = e.eventInfo.trigger || this;
        var fn = trigger["on" + e.type];

        if (fn && _mmvis._.isFunction(fn)) {
          //如果有在pie的配置上面注册对应的事件，则触发
          if (e.eventInfo && e.eventInfo.nodes && e.eventInfo.nodes.length) {
            //完整的nodes数据在e.eventInfo中有，但是添加第二个参数，如果nodes只有一个数据就返回单个，多个则数组
            if (e.eventInfo.nodes.length == 1) {
              fn.apply(this, [e, e.eventInfo.nodes[0]]);
            } else {
              fn.apply(this, [e, e.eventInfo.nodes]);
            }

            ;
          } else {
            /*
            var _arr = [];
            _.each( arguments, function(item, i){
                if( !!i ){
                    _arr.push( item );
                }
            } );
            */
            fn.apply(this, arguments);
          }
        }

        ;
      }
    }, {
      key: "grow",
      value: function grow(callback, opt) {
        !opt && (opt = {});
        var me = this;
        var duration = this.aniDuration;

        if (!this.animation) {
          duration = 0;
        }

        ;
        var from = 0;
        var to = 1;
        if ("from" in opt) from = opt.from;
        if ("to" in opt) to = opt.to;
        this._growTween = AnimationFrame.registTween({
          from: {
            process: from
          },
          to: {
            process: to
          },
          duration: duration,
          onUpdate: function onUpdate(status) {
            _mmvis._.isFunction(callback) && callback(status.process);
          },
          onComplete: function onComplete(status) {
            this._growTween = null;
            me.fire("complete");
          }
        });
      }
    }]);

    return GraphsBase;
  }(_component2["default"]);

  exports.default = GraphsBase;
});