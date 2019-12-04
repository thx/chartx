"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "canvax", "mmvis"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("canvax"), require("mmvis"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.canvax, global.mmvis);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _canvax, _mmvis) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

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

  var Line = _canvax2["default"].Shapes.Line;
  var Rect = _canvax2["default"].Shapes.Rect;

  var rectGrid = function (_event$Dispatcher) {
    _inherits(rectGrid, _event$Dispatcher);

    _createClass(rectGrid, null, [{
      key: "defaultProps",
      value: function defaultProps() {
        return {
          enabled: {
            detail: '是否开启grid绘制',
            "default": true
          },
          line: {
            detail: '网格线条配置',
            propertys: {
              xDimension: {
                detail: '一维方向的网格线',
                propertys: {
                  enabled: {
                    detail: '是否开启',
                    "default": true
                  },
                  data: [],
                  lineType: {
                    detail: '线的样式，虚线或者实现',
                    "default": 'solid'
                  },
                  lineWidth: {
                    detail: '线宽',
                    "default": 1
                  },
                  strokeStyle: {
                    detail: '线颜色',
                    "default": '#f0f0f0'
                  }
                }
              },
              yDimension: {
                detail: '二维方向的网格线',
                propertys: {
                  enabled: {
                    detail: '是否开启',
                    "default": false
                  },
                  data: [],
                  lineType: {
                    detail: '线的样式，虚线或者实现',
                    "default": 'solid'
                  },
                  lineWidth: {
                    detail: '线宽',
                    "default": 1
                  },
                  strokeStyle: {
                    detail: '线颜色',
                    "default": '#f0f0f0'
                  }
                }
              }
            }
          },
          fill: {
            detail: '背景色配置',
            propertys: {
              xDimension: {
                detail: '以为方向的背景色块，x方向',
                propertys: {
                  enabled: {
                    detail: '是否开启',
                    "default": false
                  },
                  splitVals: {
                    detail: "从x轴上面用来分割区块的vals",
                    "default": null //默认等于xaxis的dataSection

                  },
                  fillStyle: {
                    detail: '背景颜色',
                    "default": null
                  },
                  alpha: {
                    detail: '背景透明度',
                    "default": null
                  }
                }
              },
              yDimension: {
                detail: '以为方向的背景色块，y方向',
                propertys: {
                  enabled: {
                    detail: '是否开启',
                    "default": false
                  },
                  splitVals: {
                    detail: "从x轴上面用来分割区块的vals",
                    "default": null
                  },
                  fillStyle: {
                    detail: '背景颜色',
                    "default": null
                  },
                  alpha: {
                    detail: '背景透明度',
                    "default": null
                  }
                }
              }
            }
          }
        };
      }
    }]);

    function rectGrid(opt, _coord) {
      var _this;

      _classCallCheck(this, rectGrid);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(rectGrid).call(this, opt, _coord));

      _mmvis._.extend(true, _assertThisInitialized(_this), (0, _mmvis.getDefaultProps)(rectGrid.defaultProps()));

      _this.width = 0;
      _this.height = 0;
      _this._coord = _coord; //该组件被添加到的目标图表项目，

      _this.pos = {
        x: 0,
        y: 0
      };
      _this.sprite = null; //总的sprite

      _this.xAxisSp = null; //x轴上的线集合

      _this.yAxisSp = null; //y轴上的线集合

      _this.init(opt);

      return _this;
    }

    _createClass(rectGrid, [{
      key: "init",
      value: function init(opt) {
        _mmvis._.extend(true, this, opt);

        this.sprite = new _canvax2["default"].Display.Sprite();
      }
    }, {
      key: "setX",
      value: function setX($n) {
        this.sprite.context.x = $n;
      }
    }, {
      key: "setY",
      value: function setY($n) {
        this.sprite.context.y = $n;
      }
    }, {
      key: "draw",
      value: function draw(opt) {
        _mmvis._.extend(true, this, opt); //this._configData(opt);


        this._widget();

        this.setX(this.pos.x);
        this.setY(this.pos.y);
      }
    }, {
      key: "clean",
      value: function clean() {
        this.sprite.removeAllChildren();
      }
    }, {
      key: "reset",
      value: function reset(opt) {
        this.sprite.removeAllChildren();
        this.draw(opt);
      }
    }, {
      key: "_widget",
      value: function _widget() {
        var self = this;

        if (!this.enabled) {
          return;
        }

        ;
        var _yAxis = self._coord._yAxis[0];
        var _xAxis = self._coord._xAxis;
        this.fillSp = new _canvax2["default"].Display.Sprite();
        this.sprite.addChild(this.fillSp);

        _mmvis._.each([self.fill.xDimension, self.fill.yDimension], function (fill, ind) {
          var _axis = ind ? _yAxis : _xAxis;

          var splitVals = [];

          if (fill.enabled) {
            if (!fill.splitVals) {
              splitVals = _axis.dataSection;
            } else {
              splitVals = [_axis.dataSection[0]].concat(_mmvis._.flatten([fill.splitVals]));
              splitVals.push(_axis.dataSection.slice(-1)[0]);
            }

            var fillRanges = [];

            if (splitVals.length >= 2) {
              var range = [];

              for (var i = 0, l = splitVals.length; i < l; i++) {
                var pos = _axis.getPosOf({
                  val: splitVals[i]
                });

                if (!range.length) {
                  range.push(pos);
                  continue;
                }

                if (range.length == 1) {
                  if (pos - range[0] < 1) {
                    continue;
                  } else {
                    range.push(pos);
                    fillRanges.push(range);
                    var nextBegin = range[1];
                    range = [nextBegin];
                  }
                }
              }

              ; //fill的区间数据准备好了

              _mmvis._.each(fillRanges, function (range, rInd) {
                var rectCtx = {
                  fillStyle: self.getProp(fill.fillStyle, rInd, "#000"),
                  fillAlpha: self.getProp(fill.alpha, rInd, 0.02 * (rInd % 2))
                };

                if (!ind) {
                  //x轴上面排列的fill
                  rectCtx.x = range[0];
                  rectCtx.y = 0;
                  rectCtx.width = range[1] - range[0];
                  rectCtx.height = -self.height;
                } else {
                  //y轴上面排列的fill
                  rectCtx.x = 0;
                  rectCtx.y = -range[0];
                  rectCtx.width = self.width;
                  rectCtx.height = -(range[1] - range[0]);
                }

                var fillRect = new Rect({
                  context: rectCtx
                });
                self.fillSp.addChild(fillRect);
              });
            }
          }
        });

        self.xAxisSp = new _canvax2["default"].Display.Sprite(), self.sprite.addChild(self.xAxisSp);
        self.yAxisSp = new _canvax2["default"].Display.Sprite(), self.sprite.addChild(self.yAxisSp);
        var arr = _yAxis.layoutData;

        for (var a = 0, al = arr.length; a < al; a++) {
          var o = arr[a];
          if (!o.visible) continue;
          var line = new Line({
            id: "back_line_" + a,
            context: {
              y: o.y,
              lineType: self.getProp(self.line.xDimension.lineType, a, 'solid'),
              lineWidth: self.getProp(self.line.xDimension.lineWidth, a, 1),
              strokeStyle: self.getProp(self.line.xDimension.strokeStyle, a, '#f0f0f0'),
              visible: true
            }
          });

          if (self.line.xDimension.enabled) {
            self.xAxisSp.addChild(line);
            line.context.start.x = 0;
            line.context.end.x = self.width;
          }

          ;
        }

        ; //y轴方向的线集合

        var arr = _xAxis.layoutData;

        for (var a = 0, al = arr.length; a < al; a++) {
          var o = arr[a];
          var line = new Line({
            context: {
              x: o.x,
              start: {
                x: 0,
                y: 0
              },
              end: {
                x: 0,
                y: -self.height
              },
              lineType: self.getProp(self.line.yDimension.lineType, a, 'solid'),
              lineWidth: self.getProp(self.line.yDimension.lineWidth, a, 1),
              strokeStyle: self.getProp(self.line.yDimension.strokeStyle, a, '#f0f0f0'),
              visible: true
            }
          });

          if (self.line.yDimension.enabled) {
            self.yAxisSp.addChild(line);
          }

          ;
        }

        ;
      }
    }, {
      key: "getProp",
      value: function getProp(prop, i, def) {
        var res = def;

        if (prop != null && prop != undefined) {
          if (_mmvis._.isString(prop) || _mmvis._.isNumber(prop)) {
            res = prop;
          }

          if (_mmvis._.isFunction(prop)) {
            res = prop.apply(this, [i, def]);
          }

          if (_mmvis._.isArray(prop)) {
            res = prop[i];
          }
        }

        ;
        return res;
      }
    }]);

    return rectGrid;
  }(_mmvis.event.Dispatcher);

  exports.default = rectGrid;
});