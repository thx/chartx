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

var _canvax = _interopRequireDefault(require("canvax"));

var _tools = require("../../utils/tools");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var _ = _canvax["default"]._,
    event = _canvax["default"].event;
var Line = _canvax["default"].Shapes.Line;
var Rect = _canvax["default"].Shapes.Rect;

var rectGrid = /*#__PURE__*/function (_event$Dispatcher) {
  (0, _inherits2["default"])(rectGrid, _event$Dispatcher);

  var _super = _createSuper(rectGrid);

  function rectGrid(opt, _coord) {
    var _this;

    (0, _classCallCheck2["default"])(this, rectGrid);
    _this = _super.call(this, opt, _coord);

    _.extend(true, (0, _assertThisInitialized2["default"])(_this), (0, _tools.getDefaultProps)(rectGrid.defaultProps()));

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

  (0, _createClass2["default"])(rectGrid, [{
    key: "init",
    value: function init(opt) {
      _.extend(true, this, opt);

      this.sprite = new _canvax["default"].Display.Sprite();
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
      _.extend(true, this, opt); //this._configData(opt);


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
      this.fillSp = new _canvax["default"].Display.Sprite();
      this.sprite.addChild(this.fillSp);

      _.each([self.fill.xDimension, self.fill.yDimension], function (fill, ind) {
        var _axis = ind ? _yAxis : _xAxis;

        var splitVals = [];

        if (fill.enabled) {
          if (!fill.splitVals) {
            splitVals = _axis.dataSection;
          } else {
            splitVals = _.flatten([fill.splitVals]); // splitVals = [_axis.dataSection[0]].concat(_.flatten([fill.splitVals]));
            // let lastSectionVal = _axis.dataSection.slice(-1)[0];
            // if( splitVals.indexOf( lastSectionVal ) == -1 ){
            //   splitVals.push( lastSectionVal );
            // }
          }

          ;
          var fillRanges = [];

          if (splitVals.length) {
            //splitVals去重
            splitVals = _.uniq(splitVals);
            var range = [0];

            var _loop = function _loop(i, l) {
              var val = splitVals[i];

              var pos = _axis.getPosOf({
                val: val
              });

              if (range.length == 1) {
                //TODO: 目前轴的计算有bug， 超过的部分返回也是0
                // if( (
                //         splitVals.length == 1 || 
                //         (
                //             splitVals.length > 1 && 
                //             ( 
                //                 fillRanges.length && (fillRanges.slice(-1)[0][0] || fillRanges.slice(-1)[0][1] )
                //             ) 
                //         )
                //     ) && pos == 0 ){
                //     pos = self.width;
                // };
                if (!pos && _axis.type == 'xAxis' && _axis.layoutType == 'rule') {
                  var dataFrame = self._coord.app.dataFrame;

                  var orgData = _.find(dataFrame.jsonOrg, function (item) {
                    return item[_axis.field] == val;
                  });

                  if (orgData) {
                    var orgIndex = orgData.__index__;

                    if (orgIndex <= dataFrame.range.start) {
                      pos = 0;
                    }

                    if (orgIndex >= dataFrame.range.end) {
                      pos = self.width;
                    }
                  }
                }

                ;
                range.push(pos);
                fillRanges.push(range);
                var nextBegin = range[1];
                range = [nextBegin];
              }
            };

            for (var i = 0, l = splitVals.length; i < l; i++) {
              _loop(i, l);
            }

            ; //fill的区间数据准备好了

            _.each(fillRanges, function (range, rInd) {
              if (!range || range && range.length && range[1] == range[0]) return;
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

              var _text = self.getProp(fill.splitLabels, rInd, "");

              if (_text) {
                var fontColor = self.getProp(fill.fontColor, rInd, "#666");
                var fontSize = self.getProp(fill.fontSize, rInd, 12);
                var textAlign = 'center';
                var textBaseline = 'top';
                var x = rectCtx.x + rectCtx.width / 2;
                var y = rectCtx.height + 8;

                if (ind) {
                  //y轴上面排列的fill
                  textAlign = 'left';
                  textBaseline = 'middle';
                  x = rectCtx.x + 8;
                  y = rectCtx.y + rectCtx.height / 2;
                }

                var txt = new _canvax["default"].Display.Text(_text, {
                  context: {
                    fontSize: fontSize,
                    fillStyle: fontColor,
                    x: x,
                    y: y,
                    textAlign: textAlign,
                    //"center",//this.isH ? "center" : "left",
                    textBaseline: textBaseline //"middle", //this.isH ? "top" : "middle",

                  }
                });
                self.fillSp.addChild(txt);
              }
            });
          }
        }
      });

      self.xAxisSp = new _canvax["default"].Display.Sprite(), self.sprite.addChild(self.xAxisSp);
      self.yAxisSp = new _canvax["default"].Display.Sprite(), self.sprite.addChild(self.yAxisSp);
      var arr = _yAxis ? _yAxis.layoutData : [];

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

      arr = _xAxis.layoutData;

      for (var _a = 0, _al = arr.length; _a < _al; _a++) {
        var _o = arr[_a];

        var _line = new Line({
          context: {
            x: _o.x,
            start: {
              x: 0,
              y: 0
            },
            end: {
              x: 0,
              y: -self.height
            },
            lineType: self.getProp(self.line.yDimension.lineType, _a, 'solid'),
            lineWidth: self.getProp(self.line.yDimension.lineWidth, _a, 1),
            strokeStyle: self.getProp(self.line.yDimension.strokeStyle, _a, '#f0f0f0'),
            visible: true
          }
        });

        if (self.line.yDimension.enabled) {
          self.yAxisSp.addChild(_line);
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
        if (_.isString(prop) || _.isNumber(prop)) {
          res = prop;
        }

        if (_.isFunction(prop)) {
          res = prop.apply(this, [i, def]);
        }

        if (_.isArray(prop)) {
          res = prop[i];
        }
      }

      ;
      return res;
    }
  }], [{
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
                  "default": '#e6e6e6'
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
                splitLabels: {
                  detail: "对应splitVals的文本",
                  "default": null
                },
                fontColor: {
                  detail: "对应splitLabels的文本颜色",
                  "default": null
                },
                fontSize: {
                  detail: "对应splitLabels的文本字体大小",
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
                splitLabels: {
                  detail: "对应splitVals的文本",
                  "default": null
                },
                fontColor: {
                  detail: "对应splitLabels的文本颜色",
                  "default": null
                },
                fontSize: {
                  detail: "对应splitLabels的文本字体大小",
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
  return rectGrid;
}(event.Dispatcher);

exports["default"] = rectGrid;