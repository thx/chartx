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

  var lineSchedu = function (_Component) {
    _inherits(lineSchedu, _Component);

    _createClass(lineSchedu, null, [{
      key: "defaultProps",
      value: function defaultProps() {
        return {
          lineField: {
            detail: '对应的line字段',
            "default": null
          },
          style: {
            detail: '默认色',
            "default": '#3995ff'
          },
          fillStyle: {
            detail: '节点填充色',
            "default": "#ffffff"
          },
          lineWidth: {
            detail: '线宽',
            "default": 2
          },
          radius: {
            detail: '圆点半径',
            "default": 6
          },
          timeFontSize: {
            detail: '时间文本大小',
            "default": 14
          },
          timeFontColor: {
            detail: '时间文本颜色',
            "default": '#606060'
          },
          listFontSize: {
            detail: '列表信息文本大小',
            "default": 12
          }
        };
      }
    }]);

    function lineSchedu(opt, app) {
      var _this;

      _classCallCheck(this, lineSchedu);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(lineSchedu).call(this, opt, app));
      _this.name = "lineSchedu";

      _mmvis._.extend(true, _assertThisInitialized(_this), (0, _mmvis.getDefaultProps)(lineSchedu.defaultProps()), opt);

      _this.lineDatas = null;
      _this.sprite = new _canvax2["default"].Display.Sprite();

      _this.app.graphsSprite.addChild(_this.sprite);

      return _this;
    }

    _createClass(lineSchedu, [{
      key: "reset",
      value: function reset(opt) {
        _mmvis._.extend(true, this, opt);

        this.lineDatas = null;
        this.sprite.removeAllChildren();
        this.draw();
      }
    }, {
      key: "draw",
      value: function draw() {
        var me = this;

        var _coord = this.app.getComponent({
          name: 'coord'
        });

        this.pos = {
          x: _coord.origin.x,
          y: _coord.origin.y
        };
        this.setPosition();
        var lineGraphs = me.app.getComponent({
          name: 'graphs',
          type: "line",
          field: me.lineField
        });
        me.lineDatas = lineGraphs.data[me.lineField].data;
        var iNode = this.app.getComponent({
          name: "coord"
        }).getAxis({
          type: "xAxis"
        }).getIndexOfVal(this.time);

        if (iNode == -1) {
          return;
        }

        ;
        var nodeData = this.lineDatas[iNode];

        if (nodeData.y != undefined) {
          var y = me._getNodeY(nodeData, _coord);

          var x = nodeData.x;

          var _txtSp = new _canvax2["default"].Display.Sprite({
            context: {
              x: x - 20
            }
          });

          this.sprite.addChild(_txtSp);
          var txtHeight = 0;

          var _title = new _canvax2["default"].Display.Text(me.time, {
            context: {
              fillStyle: this.timeFontColor || this.style,
              fontSize: this.timeFontSize
            }
          });

          _txtSp.addChild(_title);

          var txtHeight = _title.getTextHeight();

          var txtWidth = _title.getTextWidth();

          var _list = new _canvax2["default"].Display.Text(_mmvis._.flatten([me.list]).join("\n"), {
            context: {
              y: txtHeight,
              fillStyle: this.listFontColor || this.style,
              fontSize: this.listFontSize
            }
          });

          _txtSp.addChild(_list);

          txtHeight += _list.getTextHeight();
          txtWidth = Math.max(txtWidth, _list.getTextWidth());

          if (txtWidth + x - 20 > _coord.width + me.app.padding.right) {
            _txtSp.context.x = _coord.width + me.app.padding.right;
            _title.context.textAlign = "right";
            _list.context.textAlign = "right";
          }

          ;
          var tsTop = 0;

          if (me.status == "online") {
            tsTop = y - (this.radius + 3) - txtHeight;

            if (Math.abs(tsTop) > _coord.origin.y) {
              tsTop = -_coord.origin.y;
              y = -(_coord.origin.y - (this.radius + 3) - txtHeight);
            }

            ;
          } else {
            tsTop = y + (this.radius + 3);

            if (tsTop + txtHeight > 0) {
              tsTop = -txtHeight;
              y = -(this.radius + 3) - txtHeight;
            }

            ;
          }

          ;
          _txtSp.context.y = tsTop;

          var _line = new _canvax2["default"].Shapes.BrokenLine({
            context: {
              pointList: [[x, y], [x, nodeData.y]],
              strokeStyle: me.style,
              lineWidth: me.lineWidth
            }
          });

          me.sprite.addChild(_line);

          var _node = new _canvax2["default"].Shapes.Circle({
            context: {
              x: x,
              y: y,
              r: me.radius,
              fillStyle: me.fillStyle,
              strokeStyle: me.style,
              lineWidth: me.lineWidth
            }
          });

          me.sprite.addChild(_node);
        }
      }
    }, {
      key: "_getNodeY",
      value: function _getNodeY(nodeData, _coord) {
        var appHeight = this.app.height;
        var coordHeight = _coord.height;
        var y = nodeData.y;

        if (this.status == "online") {
          y -= Math.min(50, (appHeight - Math.abs(y)) * 0.3);
        } else {
          y += Math.min(50, Math.abs(y) * 0.3);
        }

        ;
        return y;
      }
    }]);

    return lineSchedu;
  }(_component2["default"]);

  _mmvis.global.registerComponent(lineSchedu, 'lineSchedu');

  exports["default"] = lineSchedu;
});