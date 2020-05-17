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

var _trans = _interopRequireDefault(require("./trans"));

var _tools = require("../../../utils/tools");

var _color = require("../../../utils/color");

var _ = _canvax["default"]._,
    event = _canvax["default"].event;
var Text = _canvax["default"].Display.Text;
var Path = _canvax["default"].Shapes.Path;
var Rect = _canvax["default"].Shapes.Rect;

var Map =
/*#__PURE__*/
function (_GraphsBase) {
  (0, _inherits2["default"])(Map, _GraphsBase);
  (0, _createClass2["default"])(Map, null, [{
    key: "defaultProps",
    value: function defaultProps() {
      return {
        field: {
          detail: '数据中的adcode字段',
          "default": 'adcode',
          documentation: '数据中的adcode字段，用来对应上地图中的某个区块的adcode，从而找到这个区块对应的这一条数据'
        },
        valueField: {
          detail: '数据中的值字段',
          "default": 'value',
          documentation: '作为field字段的补充，通过field字段找到数据后，用来从数据中取值'
        },
        mapAdcode: {
          detail: '当前绘制的地图adcode',
          "default": null
        },
        adcodeUrlTempl: {
          detail: 'adcode的url模板',
          "default": 'http://geo.datav.aliyun.com/areas_v2/bound/{adcode}_full.json',
          documentation: '如果是是配置的adcode，那么和他对应的url模板'
        },
        geoJson: {
          detail: '要绘制的geoJson数据',
          "default": null
        },
        geoJsonUrl: {
          detail: '要绘制的geoJson的url',
          "default": null
        },
        geoJsonFilter: {
          detail: 'geoJson的二次过滤处理',
          "default": function _default(json) {
            return json;
          }
        },
        specialArea: {
          detail: '要排除掉不绘制的数据集合，可以是adcode，也可以是name',
          "default": []
        },
        themeColor: {
          detail: '主题色',
          "default": "#6E7586",
          documentation: '默认的主题色彩，所有的有数据的area都是在这个颜色的基础上做透明度变化，同时也是默认的hover色'
        },
        node: {
          detail: '单个元素图形配置',
          propertys: {
            drawBegin: {
              detail: '开始绘制的钩子函数',
              "default": function _default() {}
            },
            drawEnd: {
              detail: '开始绘制的钩子函数',
              "default": function _default() {}
            },
            fillStyle: {
              detail: '单个区块背景色',
              "default": null //'#fff' //从themeColor获取默认 , 默认为空就会没有颜色的区块不会有事件点击

            },
            fillAlpha: {
              detail: '单个区块透明度',
              "default": 0.9
            },
            maxFillAlpha: {
              detail: '单个区块最大透明度',
              "default": 1
            },
            minFillAlpha: {
              detail: '单个区块最小透明度',
              "default": 0.4
            },
            strokeStyle: {
              detail: '单个区块描边颜色',
              "default": "#ccc"
            },
            strokeAlpha: {
              detail: '单个区块描边透明度',
              "default": 1
            },
            lineWidth: {
              detail: '单个区块描边线宽',
              "default": 1
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
                  "default": 1
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
              "default": null
            },
            fontSize: {
              detail: '文本字体大小',
              "default": 12
            },
            fontColor: {
              detail: '文本颜色',
              "default": '#666',
              documentation: 'align为center的时候的颜色，align为其他属性时候取node的颜色'
            }
          }
        }
      };
    }
  }]);

  function Map(opt, app) {
    var _this;

    (0, _classCallCheck2["default"])(this, Map);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Map).call(this, opt, app));
    _this.type = "map";
    _this.maxValue = 0;
    _this.dataOrg = []; //this.dataFrame.getFieldData( this.field )

    _this.data = []; //layoutData list , default is empty Array

    _.extend(true, (0, _assertThisInitialized2["default"])(_this), (0, _tools.getDefaultProps)(Map.defaultProps()), opt);

    _this.init();

    return _this;
  }

  (0, _createClass2["default"])(Map, [{
    key: "init",
    value: function init() {
      this._pathsp = new _canvax["default"].Display.Sprite({
        id: "nodePathSp"
      });
      this._textsp = new _canvax["default"].Display.Sprite({
        id: "textsp"
      });
      this._marksp = new _canvax["default"].Display.Sprite({
        id: "markSp"
      });

      this._initInduce();

      this.sprite.addChild(this._pathsp);
      this.sprite.addChild(this._textsp);
      this.sprite.addChild(this._marksp);
    }
  }, {
    key: "_initInduce",
    value: function _initInduce() {
      var me = this;
      this._include = new Rect({
        context: {
          x: this.app.padding.left,
          y: this.app.padding.top,
          width: this.width,
          height: this.height,
          fillStyle: "rgba(0,0,0,0)"
        }
      });

      this._include.on(event.types.get(), function (e) {
        e.eventInfo = {
          trigger: me,
          nodes: []
        };
        me.app.fire(e.type, e);
      });

      this.sprite.addChild(this._include);
    }
  }, {
    key: "draw",
    value: function draw(opt) {
      var _this2 = this;

      !opt && (opt = {}); //第二个data参数去掉，直接trimgraphs获取最新的data

      _.extend(true, this, opt);

      var values = this.dataFrame.getFieldData(this.valueField);
      this.maxValue = _.max(values);
      this.minValue = _.min(values);
      this.getGeoData().then(function (geoData) {
        if (geoData) {
          var graphBBox = {
            x: _this2.app.padding.left,
            y: _this2.app.padding.top,
            width: _this2.width,
            height: _this2.height
          };

          _this2._widget(geoData, graphBBox);
        }
      });
      this._include.context.width = this.width;
      this._include.context.height = this.height;
    }
  }, {
    key: "_widget",
    value: function _widget(geoData, graphBBox) {
      var _this3 = this;

      var elements = [];
      var geoGraphs = (0, _trans["default"])(geoData, graphBBox, this.specialArea);
      geoGraphs.forEach(function (geoGraph) {
        var rowData = _this3.dataFrame.getRowDataOf({
          adcode: geoGraph.adcode
        });

        if (rowData.length) {
          geoGraph.rowData = rowData[0];
        }

        ;

        var fillStyle = _this3._getProp(_this3.node, "fillStyle", geoGraph);

        var fillAlpha = _this3._getProp(_this3.node, "fillAlpha", geoGraph);

        var strokeStyle = _this3._getProp(_this3.node, "strokeStyle", geoGraph);

        var strokeAlpha = _this3._getProp(_this3.node, "strokeAlpha", geoGraph);

        geoGraph.color = fillStyle;
        var pathCtx = {
          x: graphBBox.x + (graphBBox.width - geoData.transform.width) / 2,
          y: graphBBox.y + (graphBBox.height - geoData.transform.height) / 2,
          path: geoGraph.path,
          lineWidth: _this3.node.lineWidth,
          fillStyle: fillStyle,
          fillAlpha: fillAlpha,
          strokeStyle: strokeStyle,
          strokeAlpha: strokeAlpha,
          lineType: _this3.node.lineType
        };
        var nodePath = new Path({
          id: 'path_' + geoGraph.adcode,
          context: pathCtx
        });
        nodePath.nodeData = geoGraph;
        nodePath.geoData = geoData;
        geoGraph.nodeElement = nodePath;

        _this3.node.drawBegin.bind(_this3)(geoGraph);

        _this3._pathsp.addChild(nodePath); // if( geoGraph.name == "浙江省" ){
        //     //test    
        //     let nodePathBox = nodePath.getBound();
        //     let globalPos = nodePath.localToGlobal( nodePathBox );
        //     nodePathBox.x = globalPos.x;
        //     nodePathBox.y = globalPos.y;
        //     this._pathsp.addChild( new Rect({
        //         context: {
        //             ...nodePathBox,
        //             lineWidth:1,
        //             strokeStyle:"red"
        //         }
        //     }) )
        // }


        _this3.node.drawEnd.bind(_this3)(geoGraph); //drawEnd中可能把这个node销毁了


        nodePath.context && elements.push(nodePath);
        var me = _this3; //有些区块在外面会告诉你( drawBegin or drawEnd ) 会在geoGraph中标注上告诉你不用监听事件
        //因为有些时候某些比较小的区块，比如深圳 上海，等，周边的区块没数据的时候，如果也检测事件，那么这些小区块会难以选中

        if (fillStyle && _this3.node.fillAlpha && !geoGraph.pointerEventsNone && nodePath.context) {
          nodePath.context.cursor = 'pointer';
          nodePath.on(event.types.get(), function (e) {
            e.eventInfo = {
              //iNode : this.iNode,
              trigger: me.node,
              nodes: [this.nodeData]
            };

            if (e.type == 'mouseover') {
              me.focusAt(this.nodeData.adcode);
            }

            ;

            if (e.type == 'mouseout') {
              !this.nodeData.selected && me.unfocusAt(this.nodeData.adcode);
            }

            ;
            me.app.fire(e.type, e);
          });
        }

        ;
      });
      return elements;
    }
  }, {
    key: "focusAt",
    value: function focusAt(adcode) {
      var _path = this._pathsp.getChildById('path_' + adcode);

      var geoGraph = _path.nodeData;

      if (_path) {
        var _path$context = _path.context,
            fillStyle = _path$context.fillStyle,
            fillAlpha = _path$context.fillAlpha,
            strokeStyle = _path$context.strokeStyle,
            strokeAlpha = _path$context.strokeAlpha;
        _path._default = {
          fillStyle: fillStyle,
          fillAlpha: fillAlpha,
          strokeStyle: strokeStyle,
          strokeAlpha: strokeAlpha
        };
        var focusFillStyle = this._getProp(this.node.focus, "fillStyle", geoGraph) || fillStyle;
        var focusFillAlpha = this._getProp(this.node.focus, "fillAlpha", geoGraph) || fillAlpha;
        var focusStrokeStyle = this._getProp(this.node.focus, "strokeStyle", geoGraph) || strokeStyle;
        var focusStrokeAlpha = this._getProp(this.node.focus, "strokeAlpha", geoGraph) || strokeAlpha;
        _path.context.fillStyle = focusFillStyle;
        _path.context.fillAlpha = focusFillAlpha;
        _path.context.strokeStyle = focusStrokeStyle;
        _path.context.strokeAlpha = focusStrokeAlpha;
      }
    }
  }, {
    key: "unfocusAt",
    value: function unfocusAt(adcode) {
      var _path = this._pathsp.getChildById('path_' + adcode);

      if (_path) {
        var _path$_default = _path._default,
            fillStyle = _path$_default.fillStyle,
            fillAlpha = _path$_default.fillAlpha,
            strokeStyle = _path$_default.strokeStyle,
            strokeAlpha = _path$_default.strokeAlpha;
        _path.context.fillStyle = fillStyle;
        _path.context.fillAlpha = fillAlpha;
        _path.context.strokeStyle = strokeStyle;
        _path.context.strokeAlpha = strokeAlpha;
      }
    }
  }, {
    key: "drawChildren",
    value: function drawChildren(adcode) {
      var _this4 = this;

      return new Promise(function (resolve) {
        _this4.getGeoData({
          mapAdcode: adcode
        }).then(function (geoData) {
          if (geoData) {
            var _path = _this4._pathsp.getChildById('path_' + adcode);

            var pathBBox = _path.getBound();

            var globalPos = _path.localToGlobal(pathBBox);

            pathBBox.x = globalPos.x;
            pathBBox.y = globalPos.y;
            resolve(_this4._widget(geoData, pathBBox));
          }
        });
      });
    }
  }, {
    key: "getGeoData",
    value: function getGeoData() {
      var _this5 = this;

      var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this;
      return new Promise(function (resolve, reject) {
        if (opt.mapAdcode !== null || opt.geoJsonUrl) {
          var url = opt.geoJsonUrl || _this5.adcodeUrlTempl.replace(new RegExp('\\{adcode\\}', 'gm'), opt.mapAdcode);

          if (!_this5.app.__geoDataMap) _this5.app.__geoDataMap = {};

          if (_this5.app.__geoDataMap[url]) {
            resolve(_this5.app.__geoDataMap[url]);
          } else {
            fetch(url).then(function (data) {
              if (data.ok) {
                data.json().then(function (d) {
                  var _d = _this5.geoJsonFilter(d);

                  _this5.app.__geoDataMap[url] = {
                    json: _d || d
                  };
                  resolve(_this5.app.__geoDataMap[url]);
                });
              } else {
                resolve(null);
              }
            })["catch"](function (error) {
              reject(error);
            });
          }
        } else if (opt.geoJson) {
          resolve({
            json: opt.geoJson
          });
        }
      });
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

      if (type == "fillStyle") {
        var rowData = nodeData.rowData;

        if (rowData) {
          if (rowData[type] !== undefined) {
            value = rowData[type];
          } else {
            var val = rowData[this.valueField];

            if (!isNaN(val) && val != '') {
              var alpha = (val - this.minValue) / (this.maxValue - this.minValue) * (this.node.fillAlpha - this.node.minFillAlpha) + this.node.minFillAlpha;
              value = (0, _color.colorRgba)(this.themeColor, parseFloat(alpha.toFixed(2)));
            }
          }
        }
      }

      return value;
    }
  }]);
  return Map;
}(_index["default"]);

_index["default"].registerComponent(Map, 'graphs', 'map');

var _default2 = Map;
exports["default"] = _default2;