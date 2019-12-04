"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "canvax", "../index", "../../../layout/partition", "mmvis"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("canvax"), require("../index"), require("../../../layout/partition"), require("mmvis"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.canvax, global.index, global.partition, global.mmvis);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _canvax, _index, _partition, _mmvis) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _canvax2 = _interopRequireDefault(_canvax);

  var _index2 = _interopRequireDefault(_index);

  var _partition2 = _interopRequireDefault(_partition);

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

  var Sector = _canvax2["default"].Shapes.Sector;

  var sunburstGraphs = function (_GraphsBase) {
    _inherits(sunburstGraphs, _GraphsBase);

    _createClass(sunburstGraphs, null, [{
      key: "defaultProps",
      value: function defaultProps() {
        return {
          keyField: {
            detail: 'key字段',
            "default": 'name'
          },
          valueField: {
            detail: 'value字段',
            "default": 'value'
          },
          parentField: {
            detail: 'parent字段',
            "default": 'parent'
          },
          node: {
            detail: '单个节点图形设置',
            propertys: {
              strokeStyle: {
                detail: '描边色',
                "default": '#ffffff'
              },
              lineWidth: {
                detail: '描边线宽',
                "default": 1
              },
              strokeAlpha: {
                detail: '描边边框透明度',
                "default": 1
              },
              fillStyle: {
                detail: '背景色',
                "default": null
              },
              fillAlpha: {
                detail: '背景透明度',
                "default": 1
              },
              blurAlpha: {
                detail: '非激活状态透明度',
                documentation: '比如选中其中一项，其他不先关的要降低透明度',
                "default": 0.4
              }
            }
          }
        };
      }
    }]);

    function sunburstGraphs(opt, app) {
      var _this;

      _classCallCheck(this, sunburstGraphs);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(sunburstGraphs).call(this, opt, app));
      _this.type = "sunburst";

      _mmvis._.extend(true, _assertThisInitialized(_this), (0, _mmvis.getDefaultProps)(sunburstGraphs.defaultProps()), opt);

      _this.data = []; //布局算法布局后的数据

      _this.dataGroup = []; //data数据按照深度的分组

      _this.init();

      return _this;
    }

    _createClass(sunburstGraphs, [{
      key: "init",
      value: function init() {}
    }, {
      key: "draw",
      value: function draw(opt) {
        !opt && (opt = {});

        _mmvis._.extend(true, this, opt);

        this.data = this._trimGraphs();
        this.dataGroup = this._getDataGroupOfDepth();

        this._widget();

        this.sprite.context.x = this.width / 2 + this.origin.x;
        this.sprite.context.y = this.height / 2 + this.origin.y;
        this.fire("complete");
      }
    }, {
      key: "_trimGraphs",
      value: function _trimGraphs() {
        var me = this;
        var radius = parseInt(Math.min(this.width, this.height) / 2);
        var partition = (0, _partition2["default"])().sort(null).size([2 * Math.PI, radius * radius]).value(function (d) {
          //return 1; 
          return d[me.valueField]; //d.size
        }); //安装深度分组

        var _treeData = this._tansTreeData();

        this.data = partition(_treeData, 0);
        return this.data;
      }
    }, {
      key: "_getDataGroupOfDepth",
      value: function _getDataGroupOfDepth() {
        var map = {};

        _mmvis._.each(this.data, function (d) {
          map[d.depth] = [];
        });

        _mmvis._.each(this.data, function (d) {
          map[d.depth].push(d);
        });

        var arr = [];

        for (var p in map) {
          arr.push(map[p]);
        }

        return arr;
      }
    }, {
      key: "_tansTreeData",
      value: function _tansTreeData() {
        var dataFrame = this.dataFrame;
        var treeData = {};
        var keyData = dataFrame.getFieldData(this.keyField);
        var valueData = dataFrame.getFieldData(this.valueField);
        var parentData = dataFrame.getFieldData(this.parentField); //用parentField去找index

        function findChild(obj, parent, ki) {
          var parentKey = parent ? parent.name : undefined;

          for (var i = ki || 0; i < parentData.length; i++) {
            var key = parentData[i];

            if (!key && key !== 0) {
              key = undefined;
            }

            ;

            if (parentKey === key) {
              obj.name = keyData[i];
              obj.iNode = i;
              var value = valueData[i];

              if (!!value || value === 0) {
                obj.value = value;
              }

              ; //然后寻找到parent.key === obj.name的，作为children

              _mmvis._.each(parentData, function (key, ki) {
                if (key === obj.name) {
                  //这个是obj的children
                  if (!obj.children) {
                    obj.children = [];
                  }

                  ;
                  var child = {};
                  findChild(child, obj, ki);
                  obj.children.push(child);
                }
              });

              break;
            }

            ;
          }

          ;
        }

        ;
        findChild(treeData);
        return treeData;
      }
    }, {
      key: "_widget",
      value: function _widget() {
        var me = this;

        _mmvis._.each(this.dataGroup, function (group, g) {
          _mmvis._.each(group, function (layoutData, i) {
            if (!layoutData.depth) {
              //最中间的大圆隐藏
              return;
            }

            ;
            var r = Math.sqrt(layoutData.y + layoutData.dy);
            var sectorContext = {
              r0: Math.sqrt(layoutData.y),
              r: Math.sqrt(layoutData.y) + 2,
              startAngle: layoutData.x * 180 / Math.PI,
              endAngle: (layoutData.x + layoutData.dx) * 180 / Math.PI,
              //secc.endAngle,
              fillStyle: layoutData.color || me.app.getTheme(layoutData.iNode),
              strokeStyle: me.node.strokeStyle,
              lineWidth: me.node.lineWidth,
              globalAlpha: 0
            };
            var sector = new Sector({
              id: "sector_" + g + "_" + i,
              context: sectorContext
            });
            sector.layoutData = layoutData;
            layoutData.sector = sector;
            layoutData.group = group; //所在的group

            me.sprite.addChild(sector);
            sector.hover(function (e) {
              me._focus(layoutData, group);
            }, function (e) {
              me._unfocus(layoutData, group);
            });
            sector.on(_mmvis.event.types.get(), function (e) {
              //fire到root上面去的是为了让root去处理tips
              e.eventInfo = {
                trigger: me.node,
                iNode: layoutData.iNode
              };
              me.app.fire(e.type, e);
            });

            if (g <= 1) {
              sector.context.r = r;
              sector.context.globalAlpha = 1;
            } else {
              //从第二组开始，延时动画出现
              setTimeout(function () {
                if (!sector.context) {
                  //这个时候可能图表已经被销毁了
                  return;
                }

                sector.context.globalAlpha = 1;
                sector.animate({
                  r: r
                }, {
                  duration: 350
                });
              }, 350 * (g - 1));
            }
          });
        });
      }
    }, {
      key: "getNodesAt",
      value: function getNodesAt(iNode) {
        var nodes = [];

        if (iNode !== undefined) {
          var node = _mmvis._.find(this.data, function (item) {
            return item.iNode == iNode;
          }); //type给到tips用主要


          node.type = 'sunburst';
          node && nodes.push(node);
        }

        ;
        return nodes;
      }
    }, {
      key: "_focus",
      value: function _focus(layoutData, group) {
        var me = this;

        _mmvis._.each(group, function (d) {
          if (d !== layoutData) {
            d.sector.context.globalAlpha = me.node.blurAlpha;

            me._focusChildren(d, function (child) {
              child.sector.context.globalAlpha = me.node.blurAlpha;
            });
          }
        });

        me._focusParent(layoutData);
      }
    }, {
      key: "_unfocus",
      value: function _unfocus(layoutData, group) {
        var me = this;

        _mmvis._.each(this.data, function (d) {
          d.sector && (d.sector.context.globalAlpha = 1);
        });
      }
    }, {
      key: "_focusChildren",
      value: function _focusChildren(d, callback) {
        var me = this;

        if (d.children && d.children.length) {
          _mmvis._.each(d.children, function (child) {
            callback(child);

            me._focusChildren(child, callback);
          });
        }
      }
    }, {
      key: "_focusParent",
      value: function _focusParent(layoutData) {
        var me = this;

        if (layoutData.parent && layoutData.parent.sector && layoutData.parent.group) {
          _mmvis._.each(layoutData.parent.group, function (d) {
            if (d === layoutData.parent) {
              d.sector.context.globalAlpha = 1;

              me._focusParent(layoutData.parent);
            } else {
              d.sector.context.globalAlpha = me.node.blurAlpha;
            }
          });
        }
      }
    }]);

    return sunburstGraphs;
  }(_index2["default"]);

  _mmvis.global.registerComponent(sunburstGraphs, 'graphs', 'sunburst');

  exports["default"] = sunburstGraphs;
});