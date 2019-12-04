"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "canvax", "../../utils/tools", "mmvis", "./axis"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("canvax"), require("../../utils/tools"), require("mmvis"), require("./axis"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.canvax, global.tools, global.mmvis, global.axis);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _canvax, _tools, _mmvis, _axis) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _canvax2 = _interopRequireDefault(_canvax);

  var _axis2 = _interopRequireDefault(_axis);

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

  var Line = _canvax2["default"].Shapes.Line;

  var yAxis = function (_Axis) {
    _inherits(yAxis, _Axis);

    _createClass(yAxis, null, [{
      key: "defaultProps",
      value: function defaultProps() {
        return {
          align: {
            detail: '左右轴设置',
            "default": 'left'
          },
          layoutType: {
            detail: '布局方式',
            "default": 'proportion'
          }
        };
      }
    }]);

    function yAxis(opt, data, _coord) {
      var _this;

      _classCallCheck(this, yAxis);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(yAxis).call(this, opt, data.org));
      _this.type = "yAxis";
      _this._coord = _coord || {};
      _this._title = null; //this.label对应的文本对象

      _this._axisLine = null;
      _this.maxW = 0; //最大文本的 width

      _this.pos = {
        x: 0,
        y: 0
      };
      _this.yMaxHeight = 0; //y轴最大高

      _this.layoutData = []; //dataSection 对应的layout数据{y:-100, value:'1000'}

      _this.sprite = null;
      _this.isH = false; //是否横向

      _mmvis._.extend(true, _assertThisInitialized(_this), (0, _mmvis.getDefaultProps)(yAxis.defaultProps()), opt);

      _this.init(opt);

      return _this;
    }

    _createClass(yAxis, [{
      key: "init",
      value: function init(opt) {
        this._setField();

        this._initHandle(opt);

        this.sprite = new _canvax2["default"].Display.Sprite({
          id: "yAxisSprite_" + new Date().getTime()
        });
        this.rulesSprite = new _canvax2["default"].Display.Sprite({
          id: "yRulesSprite_" + new Date().getTime()
        });
        this.sprite.addChild(this.rulesSprite);
      }
    }, {
      key: "_initHandle",
      value: function _initHandle(opt) {
        if (opt) {
          if (opt.isH && (!opt.label || opt.label.rotaion === undefined)) {
            //如果是横向直角坐标系图
            this.label.rotation = 90;
          }

          ; //yAxis中的label.textAlign 要额外处理，默认是center。
          //除非用户强制设置textAlign，否则就要根据this.align做一次二次处理

          if (!opt.label || !opt.label.textAlign) {
            this.label.textAlign = this.align == "left" ? "right" : "left";
          }

          ;
        }

        ;
        this.setDataSection();

        this._getTitle();

        this._setYaxisWidth();
      }
    }, {
      key: "_setField",
      value: function _setField(field) {
        if (field) {
          this.field = field;
        }

        ; //extend会设置好this.field
        //先要矫正子啊field确保一定是个array

        if (!_mmvis._.isArray(this.field)) {
          this.field = [this.field];
        }

        ;
      }
    }, {
      key: "draw",
      value: function draw(opt) {
        _mmvis._.extend(true, this, opt || {});

        this.height = parseInt(this.yMaxHeight - this._getYAxisDisLine());
        this.setAxisLength(this.height);
        this.sprite.cleanAnimates();

        this._trimYAxis();

        this._widget(opt);

        this.setX(this.pos.x);
        this.setY(this.pos.y);
      }
    }, {
      key: "resetData",
      value: function resetData(dataFrame) {
        this._setField(dataFrame.field);

        this.resetDataOrg(dataFrame.org);

        this._initHandle();

        this.draw();
      }
    }, {
      key: "setX",
      value: function setX($n) {
        this.sprite.context.x = $n;
        this.pos.x = $n;
      }
    }, {
      key: "setY",
      value: function setY($n) {
        this.sprite.context.y = $n;
        this.pos.y = $n;
      }
    }, {
      key: "_getTitle",
      value: function _getTitle() {
        if (this.title.text) {
          if (!this._title) {
            var rotation = 0;

            if (this.align == "left") {
              rotation = -90;
            } else {
              rotation = 90;

              if (this.isH) {
                rotation = 270;
              }
            }

            ;
            this._title = new _canvax2["default"].Display.Text(this.title.text, {
              context: {
                fontSize: this.title.fontSize,
                textAlign: this.title.textAlign,
                //"center",//this.isH ? "center" : "left",
                textBaseline: this.title.textBaseline,
                //"middle", //this.isH ? "top" : "middle",
                fillStyle: this.title.fontColor,
                strokeStyle: this.title.strokeStyle,
                lineWidth: this.title.lineWidth,
                rotation: rotation
              }
            });
          } else {
            this._title.resetText(this.title.text);
          }
        }
      }
    }, {
      key: "_setYaxisWidth",
      value: function _setYaxisWidth() {//待实现
      }
    }, {
      key: "_trimYAxis",
      value: function _trimYAxis() {
        var me = this;
        var tmpData = [];

        for (var i = 0, l = this.dataSection.length; i < l; i++) {
          var layoutData = {
            value: this.dataSection[i],
            y: -Math.abs(this.getPosOf({
              val: this.dataSection[i],
              ind: i
            })),
            visible: true,
            text: ""
          }; //把format提前

          var text = layoutData.value;

          if (_mmvis._.isFunction(me.label.format)) {
            text = me.label.format.apply(this, [text, i]);
          }

          ;

          if ((text === undefined || text === null) && me.layoutType == "proportion") {
            text = (0, _tools.numAddSymbol)(layoutData.value);
          }

          ;
          layoutData.text = text;
          tmpData.push(layoutData);
        }

        var _preShowInd = 0;

        for (var a = 0, al = tmpData.length; a < al; a++) {
          if (a == 0) continue;

          if (_preShowInd == 0) {
            if (tmpData[a].text == tmpData[_preShowInd].text) {
              //如果后面的format后的数据和前面的节点的format后数据相同
              tmpData[a].visible = false;
            } else {
              _preShowInd = a;
            }
          } else {
            if (tmpData[a].text == tmpData[_preShowInd].text) {
              tmpData[_preShowInd].visible = false;
            }

            _preShowInd = a;
          }
        }

        ; //TODO: 最后的问题就是dataSection中得每个只如果format后都相同的话，就会出现最上面最下面两个一样得刻度

        this.layoutData = tmpData;

        if (this.trimLayout) {
          //如果用户有手动的 trimLayout ，那么就全部visible为true，然后调用用户自己的过滤程序
          //trimLayout就事把arr种的每个元素的visible设置为true和false的过程
          this.trimLayout(tmpData);
        }

        ;
      }
    }, {
      key: "_getYAxisDisLine",
      value: function _getYAxisDisLine() {
        //获取y轴顶高到第一条线之间的距离         
        var disMin = 0;
        var disMax = 2 * disMin;
        var dis = disMin;
        dis = disMin + this.yMaxHeight % this.dataSection.length;
        dis = dis > disMax ? disMax : dis;
        return dis;
      }
    }, {
      key: "resetWidth",
      value: function resetWidth(width) {
        var me = this;
        me.width = width;

        if (me.align == "left") {
          me.rulesSprite.context.x = me.width;
        }
      }
    }, {
      key: "_widget",
      value: function _widget(opt) {
        var me = this;
        !opt && (opt = {});

        if (!me.enabled) {
          me.width = 0;
          return;
        }

        ;
        var arr = this.layoutData;
        var visibleInd = 0;
        me.maxW = 0;

        for (var a = 0, al = arr.length; a < al; a++) {
          _mmvis._.isFunction(me.filter) && me.filter({
            layoutData: arr,
            index: a
          });
          var o = arr[a];

          if (!o.visible) {
            continue;
          }

          ;
          var y = o.y;
          var textAlign = me.label.textAlign;
          var posy = y + (a == 0 ? -3 : 0) + (a == arr.length - 1 ? 3 : 0); //为横向图表把y轴反转后的 逻辑

          if (me.label.rotation == 90 || me.label.rotation == -90) {
            textAlign = "center";

            if (a == arr.length - 1) {
              posy = y - 2;
              textAlign = "right";
            }

            if (a == 0) {
              posy = y;
            }
          }

          ;
          var aniFrom = 16;

          if (o.value == me.origin) {
            aniFrom = 0;
          }

          ;

          if (o.value < me.origin) {
            aniFrom = -16;
          }

          ;
          var lineX = 0;
          var tickLineContext;

          if (me.tickLine.enabled) {
            //线条
            lineX = me.align == "left" ? -me.tickLine.lineLength - me.tickLine.distance : me.tickLine.distance;
            tickLineContext = {
              x: lineX,
              y: y,
              end: {
                x: me.tickLine.lineLength,
                y: 0
              },
              lineWidth: me.tickLine.lineWidth,
              strokeStyle: me._getStyle(me.tickLine.strokeStyle)
            };
          }

          ; //文字

          var textContext;

          if (me.label.enabled) {
            var txtX = me.align == "left" ? lineX - me.label.distance : lineX + me.tickLine.lineLength + me.label.distance;

            if (this.isH) {
              txtX = txtX + (me.align == "left" ? -1 : 1) * 4;
            }

            ;
            textContext = {
              x: txtX,
              y: posy,
              fillStyle: me._getStyle(me.label.fontColor),
              fontSize: me.label.fontSize,
              rotation: -Math.abs(me.label.rotation),
              textAlign: textAlign,
              textBaseline: "middle",
              lineHeight: me.label.lineHeight,
              globalAlpha: 1
            };
          }

          ;
          var duration = 300;

          if (!me.animation || opt.resize) {
            duration = 0;
          }

          ;

          var _node = this.rulesSprite.getChildAt(visibleInd);

          if (_node) {
            if (_node._tickLine && me.tickLine.enabled) {
              _node._tickLine.animate(tickLineContext, {
                duration: duration,
                id: _node._tickLine.id
              });
            }

            ;

            if (_node._txt && me.label.enabled) {
              _node._txt.animate(textContext, {
                duration: duration,
                id: _node._txt.id
              });

              _node._txt.resetText(o.text);
            }

            ;
          } else {
            _node = new _canvax2["default"].Display.Sprite({
              id: "_node" + visibleInd
            }); //新建line

            if (me.tickLine.enabled) {
              _node._tickLine = new Line({
                id: "yAxis_tickline_" + visibleInd,
                context: tickLineContext
              });

              _node.addChild(_node._tickLine);
            }

            ; //文字

            if (me.label.enabled) {
              _node._txt = new _canvax2["default"].Display.Text(o.text, {
                id: "yAxis_txt_" + visibleInd,
                context: textContext
              });

              _node.addChild(_node._txt);

              if (me.label.rotation == 90 || me.label.rotation == -90) {
                me.maxW = Math.max(me.maxW, _node._txt.getTextHeight());
              } else {
                me.maxW = Math.max(me.maxW, _node._txt.getTextWidth());
              }

              ;

              if (me.animation && !opt.resize) {
                _node._txt.context.y = y + aniFrom;
                _node._txt.context.globalAlpha = 0;

                _node._txt.animate({
                  y: textContext.y,
                  globalAlpha: 1
                }, {
                  duration: 300,
                  id: _node._txt.id
                });
              }
            }

            ;
            me.rulesSprite.addChild(_node);
          }

          ;
          visibleInd++;
        }

        ; //把 rulesSprite.children中多余的给remove掉

        if (me.rulesSprite.children.length >= visibleInd) {
          for (var al = visibleInd, pl = me.rulesSprite.children.length; al < pl; al++) {
            me.rulesSprite.getChildAt(al).remove();
            al--, pl--;
          }

          ;
        }

        ; //没有width，并且用户也没有设置过width

        if (!me.width && !('width' in me._opt)) {
          me.width = parseInt(me.maxW + me.label.distance);

          if (me.tickLine.enabled) {
            me.width += parseInt(me.tickLine.lineLength + me.tickLine.distance);
          }

          if (me._title) {
            me.width += me._title.getTextHeight();
          }
        }

        ;
        var _originX = 0;

        if (me.align == "left") {
          me.rulesSprite.context.x = me.width;
          _originX = me.width;
        }

        ; //轴线

        if (me.axisLine.enabled) {
          var _axisLineCtx = {
            start: {
              x: _originX,
              y: 0
            },
            end: {
              x: _originX,
              y: -me.height
            },
            lineWidth: me.axisLine.lineWidth,
            strokeStyle: me._getStyle(me.axisLine.strokeStyle)
          };

          if (!this._axisLine) {
            var _axisLine = new Line({
              context: _axisLineCtx
            });

            this.sprite.addChild(_axisLine);
            this._axisLine = _axisLine;
          } else {
            this._axisLine.animate(_axisLineCtx);
          }
        }

        if (this._title) {
          this._title.context.y = -this.height / 2;
          this._title.context.x = this._title.getTextHeight() / 2;

          if (this.align == "right") {
            this._title.context.x = this.width - this._title.getTextHeight() / 2;
          }

          ;
          this.sprite.addChild(this._title);
        }

        ;
      }
    }, {
      key: "_getStyle",
      value: function _getStyle(s) {
        var res = s;

        if (_mmvis._.isFunction(s)) {
          res = s.call(this, this);
        }

        ;

        if (!s) {
          res = "#999";
        }

        ;
        return res;
      }
    }]);

    return yAxis;
  }(_axis2["default"]);

  exports.default = yAxis;
});