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

var _index = _interopRequireDefault(require("../index"));

var _group = _interopRequireDefault(require("./group"));

var _dataSection = _interopRequireDefault(require("../../../core/dataSection"));

var _tools = require("../../../utils/tools");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var _ = _canvax["default"]._,
    event = _canvax["default"].event;
var Text = _canvax["default"].Display.Text;
var Circle = _canvax["default"].Shapes.Circle;
var Line = _canvax["default"].Shapes.Line;
var Rect = _canvax["default"].Shapes.Rect;
var Sector = _canvax["default"].Shapes.Sector;

var PlanetGraphs = /*#__PURE__*/function (_GraphsBase) {
  (0, _inherits2["default"])(PlanetGraphs, _GraphsBase);

  var _super = _createSuper(PlanetGraphs);

  function PlanetGraphs(opt, app) {
    var _this;

    (0, _classCallCheck2["default"])(this, PlanetGraphs);
    _this = _super.call(this, opt, app);
    _this.type = "planet";
    _this.groupDataFrames = [];
    _this.groupField = null;
    _this._ringGroups = []; //groupField对应的 group 对象
    //planet自己得grid，不用polar的grid

    _this.grid = {
      rings: {
        _section: []
      }
    };

    _.extend(true, (0, _assertThisInitialized2["default"])(_this), (0, _tools.getDefaultProps)(PlanetGraphs.defaultProps()), opt);

    if (_this.center.radius == 0 || !_this.center.enabled) {
      _this.center.radius = 0;
      _this.center.margin = 0;
      _this.center.enabled = false;
    }

    ;
    _this.__scanIngCurOration = 0;

    _this.init();

    return _this;
  }

  (0, _createClass2["default"])(PlanetGraphs, [{
    key: "init",
    value: function init() {
      this.gridSp = new _canvax["default"].Display.Sprite({
        id: "gridSp"
      });
      this.groupSp = new _canvax["default"].Display.Sprite({
        id: "groupSp"
      });
      this.scanSp = new _canvax["default"].Display.Sprite({
        id: "scanSp"
      });
      this.centerSp = new _canvax["default"].Display.Sprite({
        id: "centerSp"
      });
      this.sprite.addChild(this.gridSp);
      this.sprite.addChild(this.groupSp);
      this.sprite.addChild(this.scanSp);
      this.sprite.addChild(this.centerSp);
    }
  }, {
    key: "draw",
    value: function draw(opt) {
      !opt && (opt = {});

      _.extend(true, this, opt);

      this._dataGroupHandle();

      this._drawGroups();

      this._drawBack();

      this._drawBewrite();

      this._drawCenter();

      this._drawScan();

      this.fire("complete");
    }
  }, {
    key: "_getMaxR",
    value: function _getMaxR() {
      var _circleMaxR;

      if (this.graphs && this.graphs.group && this.graphs.group.circle) {
        _circleMaxR = this.graphs.group.circle.maxRadius;
      }

      if (_circleMaxR == undefined) {
        _circleMaxR = 30;
      }

      ;
      return _circleMaxR;
    }
  }, {
    key: "_drawGroups",
    value: function _drawGroups() {
      var me = this;
      var groupRStart = this.center.radius + this.center.margin;
      var maxRadius = me.app.getComponent({
        name: 'coord'
      }).getMaxDisToViewOfOrigin() - me.center.radius - me.center.margin;

      var _circleMaxR = this._getMaxR();

      _.each(this.groupDataFrames, function (df, i) {
        var toR = groupRStart + maxRadius * (df.length / me.dataFrame.length);

        var _g = new _group["default"](_.extend(true, {
          iGroup: i,
          groupLen: me.groupDataFrames.length,
          rRange: {
            start: groupRStart,
            to: toR
          },
          width: me.width - _circleMaxR * 2,
          height: me.height - _circleMaxR * 2,
          selectInds: me.selectInds
        }, me._opt), df, me);

        groupRStart = _g.rRange.to;

        me._ringGroups.push(_g);

        me.grid.rings._section.push({
          radius: _g.rRange.to
        });
      });

      _.each(me._ringGroups, function (_g) {
        me.sprite.addChild(_g.sprite);
      });
    }
  }, {
    key: "_drawCenter",
    value: function _drawCenter() {
      var me = this;

      if (this.center.enabled) {
        //绘制中心实心圆
        this._center = new Circle({
          hoverClone: false,
          context: {
            x: this.origin.x,
            y: this.origin.y,
            fillStyle: this.center.fillStyle,
            r: this.center.radius,
            cursor: this.center.cursor
          }
        }); //绘制实心圆上面的文案

        this._centerTxt = new Text(this.center.text, {
          context: {
            x: this.origin.x,
            y: this.origin.y,
            fontSize: this.center.fontSize,
            textAlign: "center",
            textBaseline: "middle",
            fillStyle: this.center.fontColor
          }
        }); //给圆点添加事件

        this._center.on(event.types.get(), function (e) {
          e.eventInfo = {
            title: me.center.text,
            trigger: me.center,
            nodes: [me.center]
          };

          if (me.center['onclick']) {
            if (e.type == 'mousedown') {
              me._center.context.r += 2;
            }

            if (e.type == 'mouseup') {
              me._center.context.r -= 2;
            }
          }

          ;
          me.app.fire(e.type, e);
        });

        this.centerSp.addChild(this._center);
        this.centerSp.addChild(this._centerTxt);
      }
    }
  }, {
    key: "_drawBack",
    value: function _drawBack() {
      var me = this;

      var _coord = this.app.getComponent({
        name: 'coord'
      });

      if (me.grid.rings._section.length == 1) {
        //如果只有一个，那么就强制添加到3个
        var _diffR = (me.grid.rings._section[0].radius - me.center.radius) / me.grid.rings.count;

        me.grid.rings._section = [];

        for (var i = 0; i < me.grid.rings.count; i++) {
          me.grid.rings._section.push({
            radius: me.center.radius + _diffR * (i + 1)
          });
        }
      } else {
        me.grid.rings.count = me.grid.rings._section.length;
      }

      ;

      for (var _i = me.grid.rings._section.length - 1; _i >= 0; _i--) {
        var _scale = me.grid.rings._section[_i];
        me.gridSp.addChild(new Circle({
          context: {
            x: _coord.origin.x,
            y: _coord.origin.y,
            r: _scale.radius,
            lineWidth: me._getBackProp(me.grid.rings.lineWidth, _i),
            strokeStyle: me._getBackProp(me.grid.rings.strokeStyle, _i),
            fillStyle: me._getBackProp(me.grid.rings.fillStyle, _i)
          }
        }));
      }

      ; //如果back.rays.count非0， 则绘制从圆心出发的射线

      if (me.grid.rays.count > 1) {
        var cx = _coord.origin.x;
        var cy = _coord.origin.y;
        var itemAng = 360 / me.grid.rays.count;

        var _r = _coord.getMaxDisToViewOfOrigin(); //Math.max( me.w, me.h );


        if (me.grid.rings._section.length) {
          _r = me.grid.rings._section.slice(-1)[0].radius;
        }

        for (var _i2 = 0, l = me.grid.rays.count; _i2 < l; _i2++) {
          var radian = itemAng * _i2 / 180 * Math.PI;

          var tx = cx + _r * Math.cos(radian);

          var ty = cy + _r * Math.sin(radian);

          me.gridSp.addChild(new Line({
            context: {
              start: {
                x: cx,
                y: cy
              },
              end: {
                x: tx,
                y: ty
              },
              lineWidth: me._getBackProp(me.grid.rays.lineWidth, _i2),
              strokeStyle: me._getBackProp(me.grid.rays.strokeStyle, _i2),
              globalAlpha: me.grid.rays.globalAlpha
            }
          }));
        }

        ;
      }

      ;

      var _clipRect = new Rect({
        name: "clipRect",
        context: {
          x: _coord.origin.x - me.app.width / 2,
          y: _coord.origin.y - me.height / 2,
          width: me.app.width,
          height: me.height
        }
      });

      me.gridSp.clipTo(_clipRect); //TODO：理论上下面这句应该可以神略了才行

      me.sprite.addChild(_clipRect);
    }
  }, {
    key: "_getBackProp",
    value: function _getBackProp(p, i) {
      //let iGroup = i;
      var res = null;

      if (_.isFunction(p)) {
        res = p.apply(this, [{
          //iGroup : iGroup,
          scaleInd: i,
          count: this.grid.rings._section.length,
          groups: this._ringGroups,
          graphs: this
        }]);
      }

      ;

      if (_.isString(p) || _.isNumber(p)) {
        res = p;
      }

      ;

      if (_.isArray(p)) {
        res = p[i];
      }

      ;
      return res;
    }
  }, {
    key: "_drawBewrite",
    value: function _drawBewrite() {
      var me = this; //如果开启了描述中线

      if (me.bewrite.enabled) {
        var _draw = function _draw(direction, _txt, _powerTxt, _weakTxt) {
          //先绘制右边的
          _powerTxt.context.x = direction * me.center.radius + direction * 20;

          _bewriteSp.addChild(_powerTxt);

          _bewriteSp.addChild(new Line({
            context: {
              lineType: 'dashed',
              start: {
                x: _powerTxt.context.x,
                y: 0
              },
              end: {
                x: direction * (_txt ? _graphR / 2 - _txtWidth / 2 : _graphR),
                y: 0
              },
              lineWidth: 1,
              strokeStyle: "#ccc"
            }
          }));

          if (_txt) {
            _txt.context.x = direction * (_graphR / 2);

            _bewriteSp.addChild(_txt);

            _bewriteSp.addChild(new Line({
              context: {
                lineType: 'dashed',
                start: {
                  x: direction * (_graphR / 2 + _txtWidth / 2),
                  y: 0
                },
                end: {
                  x: direction * _graphR,
                  y: 0
                },
                lineWidth: 1,
                strokeStyle: "#ccc"
              }
            }));
          }

          ;
          _weakTxt.context.x = direction * _graphR;

          _bewriteSp.addChild(_weakTxt);
        };

        var _txt, _txtWidth, _powerTxt, _weakTxt;

        if (me.bewrite.text) {
          _txt = new _canvax["default"].Display.Text(me.bewrite.text, {
            context: {
              fillStyle: me.bewrite.fontColor,
              fontSize: me.bewrite.fontSize,
              textBaseline: "middle",
              textAlign: "center"
            }
          });
          _txtWidth = _txt.getTextWidth();
        }

        ;
        _powerTxt = new _canvax["default"].Display.Text("强", {
          context: {
            fillStyle: me.bewrite.fontColor,
            fontSize: me.bewrite.fontSize,
            textBaseline: "middle",
            textAlign: "center"
          }
        });
        _weakTxt = new _canvax["default"].Display.Text("弱", {
          context: {
            fillStyle: me.bewrite.fontColor,
            fontSize: me.bewrite.fontSize,
            textBaseline: "middle",
            textAlign: "center"
          }
        });

        var _bewriteSp = new _canvax["default"].Display.Sprite({
          context: {
            x: this.origin.x,
            y: this.origin.y
          }
        });

        me.sprite.addChild(_bewriteSp);

        var _graphR = me.width / 2;

        _draw(1, _txt.clone(), _powerTxt.clone(), _weakTxt.clone());

        _draw(-1, _txt.clone(), _powerTxt.clone(), _weakTxt.clone());
      }

      ;
    }
  }, {
    key: "scan",
    value: function scan() {
      var me = this;
      this._scanAnim && this._scanAnim.stop();

      var _scanSp = me._getScanSp(); //开始动画


      if (me.__scanIngCurOration == 360) {
        _scanSp.context.rotation = 0;
      }

      ;
      me._scanAnim = _scanSp.animate({
        rotation: 360,
        globalAlpha: 1
      }, {
        duration: 1000 * ((360 - me.__scanIngCurOration) / 360),
        onUpdate: function onUpdate(e) {
          me.__scanIngCurOration = e.rotation;
        },
        onComplete: function onComplete() {
          _scanSp.context.rotation = 0;
          me._scanAnim = _scanSp.animate({
            rotation: 360
          }, {
            duration: 1000,
            repeat: 1000,
            //一般repeat不到1000
            onUpdate: function onUpdate(e) {
              me.__scanIngCurOration = e.rotation;
            }
          });
        }
      });
    }
  }, {
    key: "_drawScan",
    value: function _drawScan(callback) {
      var me = this;

      if (me.scan.enabled) {
        var _scanSp = me._getScanSp(); //开始动画


        if (me.__scanIngCurOration == 360) {
          _scanSp.context.rotation = 0;
        }

        ;
        me._scanAnim && me._scanAnim.stop();
        me._scanAnim = _scanSp.animate({
          rotation: 360,
          globalAlpha: 1
        }, {
          duration: 1000 * ((360 - me.__scanIngCurOration) / 360),
          onUpdate: function onUpdate(e) {
            me.__scanIngCurOration = e.rotation;
          },
          onComplete: function onComplete() {
            _scanSp.context.rotation = 0;
            me._scanAnim = _scanSp.animate({
              rotation: 360
            }, {
              duration: 1000,
              repeat: me.scan.repeat - 2,
              onUpdate: function onUpdate(e) {
                me.__scanIngCurOration = e.rotation;
              },
              onComplete: function onComplete() {
                _scanSp.context.rotation = 0;
                me._scanAnim = _scanSp.animate({
                  rotation: 360,
                  globalAlpha: 0
                }, {
                  duration: 1000,
                  onUpdate: function onUpdate(e) {
                    me.__scanIngCurOration = e.rotation;
                  },
                  onComplete: function onComplete() {
                    _scanSp.destroy();

                    me.__scanSp = null;
                    delete me.__scanSp;
                    me.__scanIngCurOration = 0;
                    callback && callback();
                  }
                });
              }
            });
          }
        });
      }

      ;
    }
  }, {
    key: "_getScanSp",
    value: function _getScanSp() {
      var me = this; //先准备scan元素

      var _scanSp = me.__scanSp;

      if (!_scanSp) {
        _scanSp = new _canvax["default"].Display.Sprite({
          context: {
            x: this.origin.x,
            y: this.origin.y,
            globalAlpha: 0,
            rotation: me.__scanIngCurOration
          }
        });
        me.scanSp.addChild(_scanSp);
        me.__scanSp = _scanSp;
        var r = me.scan.r || me.height / 2 - 10;
        var fillStyle = me.scan.fillStyle || me.center.fillStyle; //如果开启了扫描效果

        var count = me.scan.angle;

        for (var i = 0, l = count; i < l; i++) {
          var node = new Sector({
            context: {
              r: r,
              fillStyle: fillStyle,
              clockwise: true,
              startAngle: 360 - i,
              endAngle: 359 - i,
              globalAlpha: me.scan.alpha - me.scan.alpha / count * i
            }
          });

          _scanSp.addChild(node);
        }

        ;

        var _line = new Line({
          context: {
            end: {
              x: r,
              y: 0
            },
            lineWidth: 1,
            strokeStyle: fillStyle
          }
        });

        _scanSp.addChild(_line);
      }

      ; //准备scan元素完毕

      return _scanSp;
    }
  }, {
    key: "_dataGroupHandle",
    value: function _dataGroupHandle() {
      var groupFieldInd = _.indexOf(this.dataFrame.fields, this.groupField);

      if (groupFieldInd >= 0) {
        //有分组字段，就还要对dataFrame中的数据分下组，然后给到 groupDataFrames
        var titles = this.dataFrame.org[0];
        var _dmap = {}; //以分组的字段值做为key

        _.each(this.dataFrame.org, function (row, i) {
          if (i) {
            //从i==1 行开始，因为第一行是titles
            if (!_dmap[row[groupFieldInd]]) {
              //如果没有记录，先创建
              _dmap[row[groupFieldInd]] = [_.clone(titles)];
            }

            ;

            _dmap[row[groupFieldInd]].push(row);
          }
        });

        for (var r in _dmap) {
          this.groupDataFrames.push((0, _dataSection["default"])(_dmap[r]));
        }

        ;
      } else {
        //如果分组字段不存在，则认为数据不需要分组，直接全部作为 group 的一个子集合
        this.groupDataFrames.push(this.dataFrame);
      }

      ;
    } //graphs方法

  }, {
    key: "show",
    value: function show(field, trigger) {
      this.getAgreeNodeData(trigger, function (data) {
        data.nodeElement && (data.nodeElement.context.visible = true);
        data.labelElement && (data.labelElement.context.visible = true);
      });
    }
  }, {
    key: "hide",
    value: function hide(field, trigger) {
      this.getAgreeNodeData(trigger, function (data) {
        data.nodeElement && (data.nodeElement.context.visible = false);
        data.labelElement && (data.labelElement.context.visible = false);
      });
    }
  }, {
    key: "getAgreeNodeData",
    value: function getAgreeNodeData(trigger, callback) {
      _.each(this._ringGroups, function (_g) {
        _.each(_g._rings, function (ring) {
          _.each(ring.planets, function (data) {
            var rowData = data.rowData;

            if (trigger.params.name == rowData[trigger.params.field]) {
              //这个数据符合
              //data.nodeElement.context.visible = false;
              //data.labelElement.context.visible = false;
              callback && callback(data);
            }

            ;
          });
        });
      });
    } //获取所有有效的在布局中的nodeData

  }, {
    key: "getLayoutNodes",
    value: function getLayoutNodes() {
      var nodes = [];

      _.each(this._ringGroups, function (rg) {
        _.each(rg.planets, function (node) {
          if (node.pit) {
            nodes.push(node);
          }

          ;
        });
      });

      return nodes;
    } //获取所有无效的在不在布局的nodeData

  }, {
    key: "getInvalidNodes",
    value: function getInvalidNodes() {
      var nodes = [];

      _.each(this._ringGroups, function (rg) {
        _.each(rg.planets, function (node) {
          if (!node.pit) {
            nodes.push(node);
          }

          ;
        });
      });

      return nodes;
    } //ind 对应源数据中的index

  }, {
    key: "selectAt",
    value: function selectAt(ind) {
      var me = this;

      _.each(me._ringGroups, function (_g) {
        _g.selectAt(ind);
      });
    } //selectAll

  }, {
    key: "selectAll",
    value: function selectAll() {
      var me = this;

      _.each(me.dataFrame.getFieldData("__index__"), function (_ind) {
        me.selectAt(_ind);
      });
    } //ind 对应源数据中的index

  }, {
    key: "unselectAt",
    value: function unselectAt(ind) {
      var me = this;

      _.each(me._ringGroups, function (_g) {
        _g.unselectAt(ind);
      });
    } //unselectAll

  }, {
    key: "unselectAll",
    value: function unselectAll() {
      var me = this;

      _.each(me.dataFrame.getFieldData("__index__"), function (_ind) {
        me.unselectAt(_ind);
      });
    } //获取所有的节点数据

  }, {
    key: "getSelectedNodes",
    value: function getSelectedNodes() {
      var arr = [];

      _.each(this._ringGroups, function (_g) {
        arr = arr.concat(_g.getSelectedNodes());
      });

      return arr;
    } //获取所有的节点数据对应的原始数据行

  }, {
    key: "getSelectedRowList",
    value: function getSelectedRowList() {
      var arr = [];

      _.each(this._ringGroups, function (_g) {
        var rows = [];

        _.each(_g.getSelectedNodes(), function (nodeData) {
          rows.push(nodeData.rowData);
        });

        arr = arr.concat(rows);
      });

      return arr;
    }
  }, {
    key: "getNodesAt",
    value: function getNodesAt() {}
  }, {
    key: "resetData",
    value: function resetData(dataFrame) {
      this.clean();
      this.dataFrame = dataFrame;

      this._dataGroupHandle();

      this._drawGroups();

      this._drawScan();
    }
  }, {
    key: "clean",
    value: function clean() {
      var me = this;
      me.groupDataFrames = [];

      _.each(me._ringGroups, function (_g) {
        _g.sprite.destroy();
      });

      me._ringGroups = [];
    }
  }], [{
    key: "defaultProps",
    value: function defaultProps() {
      return {
        field: {
          detail: '字段设置',
          "default": null
        },
        center: {
          detail: '中心点设置',
          propertys: {
            enabled: {
              detail: '是否显示中心',
              "default": true
            },
            text: {
              detail: '中心区域文本',
              "default": 'center'
            },
            radius: {
              detail: '中心圆半径',
              "default": 30
            },
            fillStyle: {
              detail: '中心背景色',
              "default": '#70629e'
            },
            fontSize: {
              detail: '中心字体大小',
              "default": 15
            },
            fontColor: {
              detail: '中心字体颜色',
              "default": '#ffffff'
            },
            margin: {
              detail: '中区区域和外围可绘图区域距离',
              "default": 20
            },
            cursor: {
              detail: '中心节点的鼠标手势',
              "default": 'default'
            }
          }
        },
        selectInds: {
          detail: '选中的数据索引',
          "default": []
        },
        grid: {
          detail: '星系图自己的grid',
          propertys: {
            rings: {
              detail: '环配置',
              propertys: {
                fillStyle: {
                  detail: '背景色',
                  "default": null
                },
                strokeStyle: {
                  detail: '环线色',
                  "default": null
                },
                lineWidth: {
                  detail: '环线宽',
                  "default": 1
                },
                count: {
                  detail: '分几环',
                  "default": 3
                }
              }
            },
            rays: {
              detail: '射线配置',
              propertys: {
                count: {
                  detail: '射线数量',
                  "default": 0
                },
                globalAlpha: {
                  detail: '线透明度',
                  "default": 0.4
                },
                strokeStyle: {
                  detail: '线色',
                  "default": '#10519D'
                },
                lineWidth: {
                  detail: '线宽',
                  "default": 1
                }
              }
            }
          }
        },
        bewrite: {
          detail: 'planet的趋势描述',
          propertys: {
            enabled: {
              detail: '是否开启趋势描述',
              "default": false
            },
            text: {
              detail: '描述文本',
              "default": null
            },
            fontColor: {
              detail: 'fontColor',
              "default": '#999'
            },
            fontSize: {
              detail: 'fontSize',
              "default": 12
            }
          }
        },
        scan: {
          detail: '扫描效果',
          propertys: {
            enabled: {
              detail: '是否开启扫描效果',
              "default": false
            },
            fillStyle: {
              detail: '扫描效果颜色',
              "default": null //默认取 me._graphs.center.fillStyle

            },
            alpha: {
              detail: '起始透明度',
              "default": 0.6
            },
            angle: {
              detail: '扫描效果的覆盖角度',
              "default": 90
            },
            r: {
              detail: '扫描效果覆盖的半径',
              "default": null
            },
            repeat: {
              detail: '扫描次数',
              "default": 3
            }
          }
        },
        _props: [_group["default"]]
      };
    }
  }]);
  return PlanetGraphs;
}(_index["default"]);

_index["default"].registerComponent(PlanetGraphs, 'graphs', 'planet');

var _default = PlanetGraphs;
exports["default"] = _default;