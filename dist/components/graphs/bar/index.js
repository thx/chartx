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

var _tools = require("../../../utils/tools");

var _color = require("../../../utils/color");

var _index2 = _interopRequireDefault(require("../index"));

var _numeral = _interopRequireDefault(require("numeral"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var _ = _canvax["default"]._,
    event = _canvax["default"].event;
var AnimationFrame = _canvax["default"].AnimationFrame;
var Rect = _canvax["default"].Shapes.Rect;

var BarGraphs = /*#__PURE__*/function (_GraphsBase) {
  (0, _inherits2["default"])(BarGraphs, _GraphsBase);

  var _super = _createSuper(BarGraphs);

  function BarGraphs(opt, app) {
    var _this;

    (0, _classCallCheck2["default"])(this, BarGraphs);
    _this = _super.call(this, opt, app);
    _this.type = "bar";
    _this.enabledField = null;
    _this.node = {
      _width: 0,
      _count: 0 //总共有多少个bar

    }; //分组的选中，不是选中具体的某个node，这里的选中靠groupRegion来表现出来
    //只有在第一个graphs bar 上配置有效

    _this.select = {
      _fillStyle: "#092848" //和bar.fillStyle一样可以支持array function

    };
    _this._barsLen = 0;
    _this.txtsSp = null;

    _.extend(true, (0, _assertThisInitialized2["default"])(_this), (0, _tools.getDefaultProps)(BarGraphs.defaultProps()), opt);

    _this.init();

    return _this;
  }

  (0, _createClass2["default"])(BarGraphs, [{
    key: "init",
    value: function init() {
      this.barsSp = new _canvax["default"].Display.Sprite({
        id: "barsSp"
      });
      this.txtsSp = new _canvax["default"].Display.Sprite({
        id: "txtsSp",
        context: {//visible: false
        }
      });
    }
  }, {
    key: "getNodesAt",
    value: function getNodesAt(index) {
      //该index指当前
      var data = this.data;
      var _nodesInfoList = []; //节点信息集合

      _.each(this.enabledField, function (fs) {
        if (_.isArray(fs)) {
          _.each(fs, function (_fs) {
            //fs的结构两层到顶了
            var nodeData = data[_fs] ? data[_fs][index] : null;
            nodeData && _nodesInfoList.push(nodeData);
          });
        } else {
          var nodeData = data[fs] ? data[fs][index] : null;
          nodeData && _nodesInfoList.push(nodeData);
        }
      });

      return _nodesInfoList;
    }
  }, {
    key: "_getTargetField",
    value: function _getTargetField(b, v, i, field) {
      if (_.isString(field)) {
        return field;
      } else if (_.isArray(field)) {
        var res = field[b];

        if (_.isString(res)) {
          return res;
        } else if (_.isArray(res)) {
          return res[v];
        }

        ;
      }
    }
  }, {
    key: "_getColor",
    value: function _getColor(color, nodeData) {
      var me = this;
      var field = nodeData.field;

      var _flattenField = _.flatten([this.field]);

      var fieldConfig = this.app.getComponent({
        name: 'coord'
      }).getFieldConfig(field);

      if (_.isFunction(color)) {
        color = color.apply(this, [nodeData]);
      }

      ; //field对应的索引，， 取颜色这里不要用i

      if (_.isString(color)) {//color = color
      }

      ;

      if (_.isArray(color)) {
        color = _.flatten(color)[_.indexOf(_flattenField, field)];
      }

      ;

      if (color && color.lineargradient && color.lineargradient.length) {
        //如果是个线性渐变的话，就需要加上渐变的位置
        color.points = [0, nodeData.rectHeight, 0, 0];
      }

      ;

      if (color === undefined || color === null) {
        //只有undefined(用户配置了function),null才会认为需要还原皮肤色
        //“”都会认为是用户主动想要设置的，就为是用户不想他显示
        color = fieldConfig.color;
      }

      ;
      return color;
    }
  }, {
    key: "_getProp",
    value: function _getProp(s, node) {
      if (_.isFunction(s)) {
        var _nodesInfo = [];

        if (node != undefined) {
          _nodesInfo.push(node);
        }

        ;
        return s.apply(this, _nodesInfo);
      }

      ;
      return s;
    }
  }, {
    key: "_getBarWidth",
    value: function _getBarWidth(cellWidth, ceilWidth2) {
      if (this.node.width) {
        if (_.isFunction(this.node.width)) {
          this.node._width = this.node.width(cellWidth);
        } else {
          this.node._width = this.node.width;
        }
      } else {
        this.node._width = ceilWidth2 - Math.max(1, ceilWidth2 * 0.2); //这里的判断逻辑用意已经忘记了，先放着， 有问题在看

        if (this.node._width == 1 && cellWidth > 3) {
          this.node._width = cellWidth - 2;
        }

        ;
      }

      ;
      this.node._width < 1 && (this.node._width = 1);
      this.node._width = parseInt(this.node._width);

      if (this.node._width > this.node.maxWidth) {
        this.node._width = this.node.maxWidth;
      }

      ;
      return this.node._width;
    }
  }, {
    key: "show",
    value: function show() {
      this.draw();
    }
  }, {
    key: "hide",
    value: function hide(field) {
      _.each(this.barsSp.children, function (h_groupSp, h) {
        var _bar = h_groupSp.getChildById("bar_" + h + "_" + field);

        _bar && _bar.destroy();
      });

      _.each(this.txtsSp.children, function (sp, h) {
        var _label = sp.getChildById("text_" + h + "_" + field);

        _label && _label.destroy();
      });

      this.draw();
    }
  }, {
    key: "resetData",
    value: function resetData(dataFrame) {
      if (dataFrame) {
        this.dataFrame = dataFrame;
      }

      ;
      this.draw();
    }
  }, {
    key: "clean",
    value: function clean() {
      this.data = {};
      this.barsSp.removeAllChildren();

      if (this.label.enabled) {
        this.txtsSp.removeAllChildren();
      }

      ;
    }
  }, {
    key: "draw",
    value: function draw(opt) {
      !opt && (opt = {}); //第二个data参数去掉，直接trimgraphs获取最新的data

      _.extend(true, this, opt);

      var me = this;
      var animate = me.animation && !opt.resize;
      this.data = this._trimGraphs();

      if (this.enabledField.length == 0 || this._dataLen == 0) {
        me._preDataLen = 0;
        this.clean();
        return;
      }

      ;
      var preDataLen = me._preDataLen; //纵向的分组，主要用于 resetData 的时候，对比前后data数量用

      var groupsLen = this.enabledField.length;
      var itemW = 0;
      me.node._count = 0;
      var preGraphs = 0;
      var barGraphs = me.app.getComponents({
        name: 'graphs',
        type: 'bar'
      });

      _.each(barGraphs, function (graph, i) {
        if (graph == me) {
          preGraphs = i;
        }

        ;
      });

      var _coord = this.app.getComponent({
        name: 'coord'
      });

      _.each(this.enabledField, function (h_group, i) {
        h_group = _.flatten([h_group]);
        /*
        //h_group为横向的分组。如果yAxis.field = ["uv","pv"]的话，
        //h_group就会为两组，一组代表uv 一组代表pv。
        let spg = new Canvax.Display.Sprite({ id : "barGroup"+i });
        */
        //vLen 为一单元bar上面纵向堆叠的 length
        //比如yAxis.field = [?
        //    ["uv","pv"],  vLen == 2
        //    "ppc"       vLen == 1
        //]
        //if (h <= preDataLen - 1)的话说明本次绘制之前sprite里面已经有bar了。需要做特定的动画效果走过去

        var vLen = h_group.length;
        if (vLen == 0) return; //itemW 还是要跟着xAxis的xDis保持一致

        itemW = me.width / me._dataLen;
        me._barsLen = me._dataLen * groupsLen; // this bind到了 对应的元素上面

        function barGroupSectedHandle(e) {
          if (me.select.enabled && me.select.triggerEventType.indexOf(e.type) > -1) {
            //如果开启了图表的选中交互
            var ind = me.dataFrame.range.start + this.iNode; //region触发的selected，需要把所有的graphs都执行一遍

            if (_.indexOf(me.select.inds, ind) > -1) {
              //说明已经选中了
              _.each(barGraphs, function (barGraph) {
                barGraph.unselectAt(ind);
              });
            } else {
              _.each(barGraphs, function (barGraph) {
                barGraph.selectAt(ind);
              });
            }

            ;
          }

          ;
        }

        ;

        for (var h = 0; h < me._dataLen; h++) {
          //bar的group
          var groupH = null;

          if (i == 0) {
            //横向的分组
            if (h <= preDataLen - 1) {
              groupH = me.barsSp.getChildById("barGroup_" + h);
            } else {
              groupH = new _canvax["default"].Display.Sprite({
                id: "barGroup_" + h
              });
              me.barsSp.addChild(groupH);
              groupH.iNode = h;
            }

            ;

            if (!preGraphs) {
              //只有preGraphs == 0，第一组graphs的时候才需要加载这个region
              //这个x轴单元 nodes的分组，添加第一个rect用来接受一些事件处理
              //以及显示selected状态
              var groupRegion = void 0;
              var groupRegionWidth = itemW * me.select.width;

              if (me.select.width > 1) {
                //说明是具体指
                groupRegionWidth = me.select.width;
              }

              ;

              if (h <= preDataLen - 1) {
                groupRegion = groupH.getChildById("group_region_" + h);
                groupRegion.context.width = groupRegionWidth;
                groupRegion.context.x = itemW * h + (itemW - groupRegionWidth) / 2;
                groupRegion.context.globalAlpha = _.indexOf(me.select.inds, me.dataFrame.range.start + h) > -1 ? me.select.alpha : 0;
              } else {
                groupRegion = new Rect({
                  id: "group_region_" + h,
                  pointChkPriority: false,
                  hoverClone: false,
                  xyToInt: false,
                  context: {
                    x: itemW * h + (itemW - groupRegionWidth) / 2,
                    y: -me.height,
                    width: groupRegionWidth,
                    height: me.height,
                    fillStyle: me._getGroupRegionStyle(h),
                    globalAlpha: _.indexOf(me.select.inds, me.dataFrame.range.start + h) > -1 ? me.select.alpha : 0
                  }
                });
                groupH.addChild(groupRegion);
                groupRegion.iNode = h; //触发注册的事件

                groupRegion.on(event.types.get(), function (e) {
                  e.eventInfo = {
                    trigger: me,
                    iNode: this.iNode //TODO:这里设置了的话，会导致多graphs里获取不到别的graphs的nodes信息了
                    //nodes : me.getNodesAt( this.iNode ) 

                  };
                  barGroupSectedHandle.bind(this)(e); //触发root统一设置e.eventInfo.nodes,所以上面不需要设置

                  me.app.fire(e.type, e);
                });
              }
            }

            ;
          } else {
            groupH = me.barsSp.getChildById("barGroup_" + h);
          }

          ; //txt的group begin

          var txtGroupH = null;

          if (i == 0) {
            if (h <= preDataLen - 1) {
              txtGroupH = me.txtsSp.getChildById("txtGroup_" + h);
            } else {
              txtGroupH = new _canvax["default"].Display.Sprite({
                id: "txtGroup_" + h
              });
              me.txtsSp.addChild(txtGroupH);
              txtGroupH.iGroup = i;
            }

            ;
          } else {
            txtGroupH = me.txtsSp.getChildById("txtGroup_" + h);
          }

          ; //txt的group begin

          for (var v = 0; v < vLen; v++) {
            me.node._count++; //单个的bar，从纵向的底部开始堆叠矩形

            var nodeData = me.data[h_group[v]][h];
            nodeData.iGroup = i, nodeData.iNode = h, nodeData.iLay = v;
            var rectHeight = nodeData.y - nodeData.fromY;

            if (isNaN(nodeData.value)) {
              rectHeight = 0;
            } else {
              if (Math.abs(rectHeight) < me.node.minHeight) {
                rectHeight = me.node.minHeight;
              }
            }

            ;
            nodeData.rectHeight = rectHeight;

            var fillStyle = me._getColor(me.node.fillStyle, nodeData);

            nodeData.color = fillStyle; //如果用户配置了渐变， 那么tips里面就取对应的中间位置的颜色
            //fillStyle instanceof CanvasGradient 在小程序里会出错。改用fillStyle.addColorStop来嗅探

            if (fillStyle.addColorStop) {
              if (me.node.fillStyle.lineargradient) {
                var _middleStyle = me.node.fillStyle.lineargradient[parseInt(me.node.fillStyle.lineargradient.length / 2)];

                if (_middleStyle) {
                  nodeData.color = _middleStyle.color;
                }

                ;
              }
            }

            ;
            var finalPos = {
              x: Math.round(nodeData.x),
              y: nodeData.fromY,
              width: me.node._width,
              height: rectHeight,
              fillStyle: fillStyle,
              fillAlpha: me.node.fillAlpha,
              scaleY: -1
            };
            nodeData.width = finalPos.width;

            var rectFill = me._getFillStyle(finalPos.fillStyle, finalPos);

            var rectCtx = {
              x: finalPos.x,
              y: nodeData.yOriginPoint.pos,
              //0,
              width: finalPos.width,
              height: finalPos.height,
              fillStyle: rectFill,
              fillAlpha: me.node.fillAlpha,
              scaleY: 0,
              cursor: 'pointer'
            };

            if (!!me.node.radius && nodeData.isLeaf && !me.proportion) {
              var radiusR = Math.min(me.node._width / 2, Math.abs(rectHeight));
              radiusR = Math.min(radiusR, me.node.radius);
              rectCtx.radius = [radiusR, radiusR, 0, 0];
            }

            ;

            if (!animate) {
              delete rectCtx.scaleY;
              rectCtx.y = finalPos.y;
            }

            ;
            var rectEl = null;
            var barId = "bar_" + h + "_" + nodeData.field;

            if (h <= preDataLen - 1) {
              rectEl = groupH.getChildById(barId);
            }

            ;

            if (rectEl) {
              rectEl.context.fillStyle = fillStyle;
            } else {
              rectEl = new Rect({
                id: barId,
                context: rectCtx
              });
              rectEl.field = nodeData.field;
              groupH.addChild(rectEl); //是否在单个柱子上面启动事件监听

              if (me.node.eventEnabled) {
                rectEl.on(event.types.get(), function (e) {
                  e.eventInfo = {
                    trigger: 'this.node',
                    //me.node,
                    nodes: [this.nodeData]
                  };
                  barGroupSectedHandle.bind(this)(e);
                  me.app.fire(e.type, e);
                });
              }
            }

            ;
            rectEl.finalPos = finalPos;
            rectEl.iGroup = i, rectEl.iNode = h, rectEl.iLay = v; //nodeData, nodeElement ， data和图形之间互相引用的属性约定

            rectEl.nodeData = nodeData;
            nodeData.nodeElement = rectEl;
            me.node.filter && me.node.filter.apply(rectEl, [nodeData, me]); //label begin ------------------------------

            if (me.label.enabled) {
              var value = nodeData.value;

              if (me.label.format) {
                if (_.isFunction(me.label.format)) {
                  var _formatc = me.label.format.apply(me, [value, nodeData]);

                  ; //me.label.format(value, nodeData);

                  if (_formatc !== undefined || _formatc !== null) {
                    value = _formatc;
                  }
                }

                if (typeof me.label.format == 'string') {
                  value = (0, _numeral["default"])(value).format(me.label.format);
                }
              } else {
                //否则用fieldConfig上面的
                var fieldConfig = _coord.getFieldConfig(nodeData.field);

                if (fieldConfig) {
                  value = fieldConfig.getFormatValue(value);
                }

                ;
              }

              ;

              if (value === undefined || value === null || value === "") {
                continue;
              }

              ;
              var textCtx = {
                fillStyle: me._getProp(me.label.fontColor, nodeData) || finalPos.fillStyle,
                fontSize: me._getProp(me.label.fontSize, nodeData),
                lineWidth: me._getProp(me.label.lineWidth, nodeData),
                strokeStyle: me._getProp(me.label.strokeStyle, nodeData) || finalPos.fillStyle,
                //textAlign     : me.label.textAlign, 在后面的_getTextAlign中设置
                textBaseline: me._getProp(me.label.verticalAlign, nodeData),
                rotation: me._getProp(me.label.rotation, nodeData)
              }; //然后根据position, offset确定x,y

              var _textPos = me._getTextPos(finalPos, nodeData);

              textCtx.x = _textPos.x;
              textCtx.y = _textPos.y;
              textCtx.textAlign = me._getTextAlign(finalPos, nodeData); //文字

              var textEl = null;
              var textId = "text_" + h + "_" + nodeData.field;

              if (h <= preDataLen - 1) {
                textEl = txtGroupH.getChildById(textId);
              }

              ;

              if (textEl) {
                //do something
                textEl.resetText(value);
                textEl.context.x = textCtx.x;
                textEl.context.y = textCtx.y;
              } else {
                textEl = new _canvax["default"].Display.Text(value, {
                  id: textId,
                  context: textCtx
                });
                textEl.field = nodeData.field;
                txtGroupH.addChild(textEl);
              }

              ;

              if (!animate) {//TODO：现在暂时没有做text的animate
              }

              ;
            } //label end ------------------------------

          }

          ;
        }
      });

      this.sprite.addChild(this.barsSp); //如果有text设置， 就要吧text的txtsSp也添加到sprite

      if (this.label.enabled) {
        this.sprite.addChild(this.txtsSp);
      }

      ;
      this.sprite.context.x = this.origin.x;
      this.sprite.context.y = this.origin.y;
      this.grow(function () {
        me.fire("complete");
      }, {
        delay: 0,
        duration: 300,
        animate: animate
      });
      me._preDataLen = me._dataLen;
    }
  }, {
    key: "_getFillStyle",
    value: function _getFillStyle(fillColor, rect) {
      if (typeof fillColor == 'string' && (0, _color.colorIsHex)(fillColor)) {
        var _style = {
          points: [0, rect.height, 0, 0],
          lineargradient: [{
            position: 0,
            color: (0, _color.colorRgba)(fillColor, 1)
          }, {
            position: 1,
            color: (0, _color.colorRgba)(fillColor, 0.6)
          }]
        };
        return _style;
      } else {
        return fillColor;
      }
    }
  }, {
    key: "setEnabledField",
    value: function setEnabledField() {
      //要根据自己的 field，从enabledFields中根据enabled数据，计算一个 enabled版本的field子集
      this.enabledField = this.app.getComponent({
        name: 'coord'
      }).filterEnabledFields(this.field);
    }
  }, {
    key: "_getGroupRegionStyle",
    value: function _getGroupRegionStyle(iNode) {
      var me = this;
      var _groupRegionStyle = me.select.fillStyle;

      if (_.isArray(me.select.fillStyle)) {
        _groupRegionStyle = me.select.fillStyle[iNode];
      }

      ;

      if (_.isFunction(me.select.fillStyle)) {
        _groupRegionStyle = me.select.fillStyle.apply(this, [{
          iNode: iNode,
          rowData: me.dataFrame.getRowDataAt(iNode)
        }]);
      }

      ;

      if (_groupRegionStyle === undefined || _groupRegionStyle === null) {
        return me.select._fillStyle;
      }

      ;
      return _groupRegionStyle;
    }
  }, {
    key: "_trimGraphs",
    value: function _trimGraphs() {
      var me = this;

      var _coord = this.app.getComponent({
        name: 'coord'
      }); //用来计算下面的hLen


      this.setEnabledField();
      this.data = {};
      var layoutGraphs = [];
      var hLen = 0; //总共有多少列（ 一个xAxis单元分组内 ）

      var preHLen = 0; //自己前面有多少个列（ 一个xAxis单元分组内 ）

      var _preHLenOver = false;

      if (!this.absolute) {
        _.each(me.app.getComponents({
          name: 'graphs',
          type: 'bar'
        }), function (_g) {
          if (!_g.absolute) {
            if (_g === me) {
              _preHLenOver = true;
            }

            ;

            if (_preHLenOver) {
              //排在me后面的 graphs，需要计算setEnabledField，才能计算出来 全部的hLen
              _g.setEnabledField();
            } else {
              preHLen += _g.enabledField.length;
            }

            hLen += _g.enabledField.length;
            layoutGraphs.push(_g);
          }
        });
      } else {
        layoutGraphs = [this];
        hLen = this.enabledField.length;
      }

      ;

      var cellWidth = _coord.getAxis({
        type: 'xAxis'
      }).getCellLength(); //x方向的二维长度，就是一个bar分组里面可能有n个子bar柱子，那么要二次均分


      var ceilWidth2 = cellWidth / (hLen + 1); //知道了ceilWidth2 后 检测下 barW是否需要调整

      var barW = this._getBarWidth(cellWidth, ceilWidth2);

      var barDis = ceilWidth2 - barW;

      if (this.node.xDis != null) {
        barDis = this.node.xDis;
      }

      ;
      var disLeft = (cellWidth - barW * hLen - barDis * (hLen - 1)) / 2;

      if (preHLen) {
        disLeft += (barDis + barW) * preHLen;
      }

      ; //let tmpData = [];
      //然后计算出对于结构的dataOrg

      var dataOrg = this.dataFrame.getDataOrg(this.enabledField);
      var selectOpt = me.getGraphSelectOpt(); //自己的select.inds为空的情况下，才需要寻找是不是别的graphs设置了inds

      if (!me.select.inds.length && selectOpt && selectOpt.inds && selectOpt.inds.length) {
        me.select.inds = _.clone(selectOpt.inds);
      }

      ; //dataOrg和field是一一对应的

      _.each(dataOrg, function (hData, b) {
        //hData，可以理解为一根竹子 横向的分组数据，这个hData上面还可能有纵向的堆叠
        //tempBarData 一根柱子的数据， 这个柱子是个数据，上面可以有n个子元素对应的竹节
        var tempBarData = [];

        _.each(hData, function (vSectionData, v) {
          tempBarData[v] = []; //vSectionData 代表某个字段下面的一组数据比如 uv

          me._dataLen = vSectionData.length; //vSectionData为具体的一个field对应的一组数据

          _.each(vSectionData, function (val, i) {
            var vCount = val;

            if (me.proportion) {
              //先计算总量
              vCount = 0;

              _.each(hData, function (team) {
                vCount += team[i];
              });
            }

            ;

            var field = me._getTargetField(b, v, i, me.enabledField); //返回一个和value的结构对应的point结构{x:  y: }


            var point = _coord.getPoint({
              iNode: i,
              vIndex: v,
              field: field,
              value: {
                //x:
                y: val
              }
            });

            var _x = point.pos.x;
            var x = _x - cellWidth / 2 + disLeft + (barW + barDis) * b;
            var y = 0;

            if (me.proportion) {
              y = -val / vCount * _coord.height;
            } else {
              y = point.pos.y;
            }

            ;

            if (isNaN(y)) {
              y = 0;
            }

            ;

            var yOriginPoint = _coord.getAxisOriginPoint({
              field: field
            });

            function _getFromY(tempBarData, v, i, val, y) {
              var preData = tempBarData[v - 1];

              if (!preData) {
                return yOriginPoint.pos;
              }

              ;
              var preY = preData[i].y;
              var preVal = preData[i].value;
              var yBaseNumber = yOriginPoint.value;

              if (val >= yBaseNumber) {
                //如果大于基线的，那么就寻找之前所有大于基线的
                if (preVal >= yBaseNumber) {
                  //能找到，先把pre的isLeaf设置为false
                  preData[i].isLeaf = false;
                  return preY;
                } else {
                  return _getFromY(tempBarData, v - 1, i, val, y);
                }
              } else {
                if (preVal < yBaseNumber) {
                  //能找到，先把pre的isLeaf设置为false
                  preData[i].isLeaf = false;
                  return preY;
                } else {
                  return _getFromY(tempBarData, v - 1, i, val, y);
                }
              }
            } //找到其着脚点,一般就是 yOriginPoint.pos


            var fromY = _getFromY(tempBarData, v, i, val, y);

            y += fromY - yOriginPoint.pos;
            var nodeData = {
              type: "bar",
              value: val,
              vInd: v,
              //如果是堆叠图的话，这个node在堆叠中得位置
              vCount: vCount,
              //纵向方向的总数,比瑞堆叠了uv(100),pv(100),那么这个vCount就是200，比例柱状图的话，外部tips定制content的时候需要用到
              field: field,
              fromX: x,
              fromY: fromY,
              x: x,
              y: y,
              width: barW,
              yOriginPoint: yOriginPoint,
              isLeaf: true,
              xAxis: _coord.getAxis({
                type: 'xAxis'
              }).getNodeInfoOfX(_x),
              iNode: i,
              rowData: me.dataFrame.getRowDataAt(i),
              color: null,
              //focused       : false,  //是否获取焦点，外扩
              selected: false //是否选中

            };

            if (!me.data[nodeData.field]) {
              me.data[nodeData.field] = tempBarData[v];
            }

            ; //如果某个graph 配置了select ----start

            if (_.indexOf(me.select.inds, i) > -1) {
              nodeData.selected = true;
            }

            ;
            tempBarData[v].push(nodeData);
          });
        }); //tempBarData.length && tmpData.push( tempBarData );

      });

      return me.data; //return tmpData;
    }
  }, {
    key: "_getTextAlign",
    value: function _getTextAlign(bar, nodeData) {
      var textAlign = this.label.textAlign;

      if (nodeData.value < nodeData.yOriginPoint.value) {
        if (textAlign == "left") {
          textAlign = "right";
        } else if (textAlign == "right") {
          textAlign = "left";
        }
      }

      ;
      return textAlign;
    }
  }, {
    key: "_getTextPos",
    value: function _getTextPos(bar, nodeData) {
      var me = this;
      var point = {
        x: 0,
        y: 0
      };
      var x = bar.x,
          y = bar.y;
      var isNegative = true; //是负数

      if (bar.y >= nodeData.y) {
        isNegative = false;
      }

      ;

      switch (me.label.position) {
        case "top":
          x = bar.x + bar.width / 2;
          y = bar.y + bar.height;

          if (isNegative) {
            y += 16;
          }

          ;
          break;

        case "topRight":
          x = bar.x + bar.width;
          y = bar.y + bar.height;

          if (isNegative) {
            y += 16;
          }

          ;
          break;

        case "right":
          x = bar.x + bar.width;
          y = bar.y + bar.height / 2;
          break;

        case "rightBottom":
          x = bar.x + bar.width;
          y = bar.y;
          break;

        case "bottom":
          x = bar.x + bar.width / 2;
          y = bar.y;
          break;

        case "bottomLeft":
          x = bar.x;
          y = bar.y;
          break;

        case "left":
          x = bar.x;
          y = bar.y + bar.height / 2;
          break;

        case "leftTop":
          x = bar.x;
          y = bar.y + bar.height;

          if (isNegative) {
            y += 16;
          }

          ;
          break;

        case "center":
          x = bar.x + bar.width / 2;
          y = bar.y + bar.height / 2;
          break;
      }

      ;
      x -= me.label.offsetX;
      var i = 1;

      if (nodeData.value < nodeData.yOriginPoint.value) {
        i = -1;
      }

      ;
      y -= i * me.label.offsetY;
      point.x = x;
      point.y = y;
      return point;
    }
    /**
     * 生长动画
     */

  }, {
    key: "grow",
    value: function grow(callback, opt) {
      var me = this; //console.log( me._preDataLen+"|"+ me._dataLen)
      //先把已经不在当前range范围内的元素destroy掉

      if (me._preDataLen > me._dataLen) {
        for (var i = me._dataLen, l = me._preDataLen; i < l; i++) {
          me.barsSp.getChildAt(i).destroy();
          me.label.enabled && me.txtsSp.getChildAt(i).destroy();
          i--;
          l--;
        }

        ;
      }

      ;

      if (!opt.animate) {
        callback && callback(me);
        return;
      }

      ;
      var sy = 1;

      var optsions = _.extend({
        delay: Math.min(1000 / this._barsLen, 80),
        easing: "Linear.None",
        //"Back.Out",
        duration: 500
      }, opt);

      var barCount = 0;

      _.each(me.enabledField, function (h_group) {
        h_group = _.flatten([h_group]);
        var vLen = h_group.length;
        if (vLen == 0) return;

        for (var h = 0; h < me._dataLen; h++) {
          for (var v = 0; v < vLen; v++) {
            var nodeData = me.data[h_group[v]][h];
            var group = me.barsSp.getChildById("barGroup_" + h);
            var bar = group.getChildById("bar_" + h + "_" + nodeData.field);

            if (optsions.duration == 0) {
              bar.context.scaleY = sy;
              bar.context.y = sy * sy * bar.finalPos.y;
              bar.context.x = bar.finalPos.x;
              bar.context.width = bar.finalPos.width;
              bar.context.height = bar.finalPos.height;
            } else {
              if (bar._tweenObj) {
                AnimationFrame.destroyTween(bar._tweenObj);
              }

              ;
              bar._tweenObj = bar.animate({
                scaleY: sy,
                y: sy * bar.finalPos.y,
                x: bar.finalPos.x,
                width: bar.finalPos.width,
                height: bar.finalPos.height
              }, {
                duration: optsions.duration,
                easing: optsions.easing,
                delay: h * optsions.delay,
                onUpdate: function onUpdate() {
                  this.context.fillStyle = me._getFillStyle(this.nodeData.color, this.context);
                },
                onComplete: function onComplete(arg) {
                  if (arg.width < 3 && this.context) {
                    this.context.radius = 0;
                  }

                  barCount++;

                  if (barCount === me.node._count) {
                    callback && callback(me);
                  }
                },
                id: bar.id
              });
            }

            ;
          }

          ;
        }

        ;
      });
    } //这里的ind是包含了start的全局index
    //为什么需要传全局的index呢， 因为这个接口需要对外抛出，外部用户并不需要知道当前dataFrame.range.start

  }, {
    key: "selectAt",
    value: function selectAt(ind) {
      var me = this;
      if (_.indexOf(this.select.inds, ind) > -1) return;
      this.select.inds.push(ind); //因为这里是带上了start的全局的index，

      var index = ind - this.dataFrame.range.start;

      _.each(this.data, function (list) {
        var nodeData = list[index];
        nodeData.selected = true;
        me.setNodeElementStyle(nodeData);
      });

      var group = this.barsSp.getChildById("barGroup_" + index);

      if (group) {
        var groupRegion = group.getChildById("group_region_" + index);

        if (groupRegion) {
          groupRegion.context.globalAlpha = this.select.alpha;
        }
      }
    } //这里的ind是包含了start的全局index

  }, {
    key: "unselectAt",
    value: function unselectAt(ind) {
      var me = this;
      if (_.indexOf(this.select.inds, ind) == -1) return;

      var _index = _.indexOf(this.select.inds, ind);

      this.select.inds.splice(_index, 1);
      var index = ind - this.dataFrame.range.start;

      _.each(this.data, function (list) {
        var nodeData = list[index];
        nodeData.selected = false;
        me.setNodeElementStyle(nodeData);
      });

      var group = this.barsSp.getChildById("barGroup_" + index);

      if (group) {
        var groupRegion = group.getChildById("group_region_" + index);

        if (groupRegion) {
          groupRegion.context.globalAlpha = 0;
        }
      }
    }
  }, {
    key: "getSelectedRowList",
    value: function getSelectedRowList() {
      var rowDatas = [];
      var me = this;

      _.each(me.select.inds, function (ind) {
        //TODO: 这里的inds 是全局的，而getRowDataAt只能获取到当前视图内的数据
        //所以用这个接口会有问题
        //let index = ind - me.dataFrame.range.start;
        //rowDatas.push( me.dataFrame.getRowDataAt( index ) )
        rowDatas.push(me.dataFrame.jsonOrg[ind]);
      });

      return rowDatas;
    }
  }, {
    key: "setNodeElementStyle",
    value: function setNodeElementStyle(nodeData) {
      var me = this;

      var fillStyle = me._getColor(me.node.fillStyle, nodeData);

      nodeData.nodeElement.context.fillStyle = fillStyle;
    }
  }, {
    key: "getGraphSelectOpt",
    value: function getGraphSelectOpt() {
      var me = this; //如果某个graph 配置了select ----start

      var selectOpt = me._opt.select;

      if (!selectOpt) {
        var barGraphs = me.app.getComponents({
          name: 'graphs',
          type: 'bar'
        });

        _.each(barGraphs, function (barGraph) {
          if (selectOpt) return false;

          if (!selectOpt && barGraph._opt.select) {
            selectOpt = barGraph.select;
          }

          ;
        });
      }

      ;
      return selectOpt;
    }
  }], [{
    key: "defaultProps",
    value: function defaultProps() {
      return {
        field: {
          detail: '字段设置',
          documentation: '支持二维数组格式的设置，一维方向就是横向分组，二维方向就是纵向的堆叠',
          "default": null
        },
        yAxisAlign: {
          detail: '绘制在哪根y轴上面',
          "default": 'left'
        },
        absolute: {
          detail: '是否脱离graphs的位置计算',
          documentation: '\
                    trimGraphs的时候是否需要和其他的 bar graphs一起并排计算，\
                    true的话这个就会和别的重叠,\
                    和css中得absolute概念一致，脱离文档流的绝对定位',
          "default": false
        },
        proportion: {
          detail: '比例柱状图',
          "default": false
        },
        node: {
          detail: '单个数据对应的图形设置',
          propertys: {
            width: {
              detail: 'bar的宽度',
              "default": 0
            },
            maxWidth: {
              detail: '最大width',
              "default": 50
            },
            minWidth: {
              detail: '最小width',
              "default": 1
            },
            minHeight: {
              detail: '最小height',
              "default": 0
            },
            radius: {
              detail: '叶子节点的圆角半径',
              "default": 10
            },
            fillStyle: {
              detail: 'bar填充色',
              "default": null
            },
            fillAlpha: {
              detail: 'bar透明度',
              "default": 0.95
            },
            xDis: {
              detail: '单分组内bar之间的间隔',
              "default": null
            },
            filter: {
              detail: 'bar过滤处理器',
              "default": null
            },
            eventEnabled: {
              detail: '是否在单个柱子上面启动事件的监听',
              "default": true
            }
          }
        },
        label: {
          detail: '文本设置',
          propertys: {
            enabled: {
              detail: '是否开启',
              "default": false
            },
            fontColor: {
              detail: '文本颜色',
              "default": null,
              documentation: '如果有设置text.fontColor那么优先使用fontColor'
            },
            fontSize: {
              detail: '文本字体大小',
              "default": 12
            },
            format: {
              detail: '文本格式化处理函数',
              "default": null
            },
            lineWidth: {
              detail: '文本描边线宽',
              "default": 0
            },
            strokeStyle: {
              detail: '文本描边颜色',
              "default": null
            },
            rotation: {
              detail: '旋转角度',
              "default": 0
            },
            textAlign: {
              detail: '水平对齐方式',
              documentation: 'left center right',
              "default": 'center'
            },
            verticalAlign: {
              detail: '垂直基线对齐方式',
              documentation: 'top middle bottom',
              "default": 'bottom'
            },
            position: {
              detail: '文本布局位置',
              documentation: 'top,topRight,right,rightBottom,bottom,bottomLeft,left,leftTop,center',
              "default": 'top'
            },
            offsetX: {
              detail: 'x偏移量',
              "default": 0
            },
            offsetY: {
              detail: 'y偏移量',
              "default": 0
            }
          }
        },
        select: {
          detail: '分组选中',
          documentation: '\
                    分组的选中，不是选中具体的某个node，这里的选中靠groupRegion来表现出来,\
                    目前只有在第一个graphs bar 上配置有效',
          propertys: {
            enabled: {
              detail: '是否开启',
              "default": false
            },
            inds: {
              detail: '选中的分组索引集合',
              documentation: '选中的列的索引集合,注意，这里的ind不是当前视图的ind，而是加上了dataFrame.range.start的全局ind',
              "default": []
            },
            width: {
              detail: '选中态背景宽度',
              "default": 1
            },
            alpha: {
              detail: '选中态背景透明度',
              "default": 0.2
            },
            fillStyle: {
              detail: '选中态背景填充色',
              "default": null
            },
            triggerEventType: {
              detail: '触发选中效果的事件',
              "default": 'click,tap'
            }
          }
        }
      };
    }
  }]);
  return BarGraphs;
}(_index2["default"]);

_index2["default"].registerComponent(BarGraphs, 'graphs', 'bar');

var _default = BarGraphs;
exports["default"] = _default;