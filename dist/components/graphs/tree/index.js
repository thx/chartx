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

var _index = _interopRequireDefault(require("../relation/index"));

var _dataFrame = _interopRequireDefault(require("../../../core/dataFrame"));

var _tools = require("../../../utils/tools");

var _trigger2 = _interopRequireDefault(require("../../trigger"));

var _data2 = require("../relation/data");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var _ = _canvax["default"]._,
    event = _canvax["default"].event;
var Rect = _canvax["default"].Shapes.Rect;
var Diamond = _canvax["default"].Shapes.Diamond;
var Path = _canvax["default"].Shapes.Path;
var Circle = _canvax["default"].Shapes.Circle;
var Arrow = _canvax["default"].Shapes.Arrow;
/**
 * 关系图中 包括了  配置，数据，和布局数据，
 * 默认用配置和数据可以完成绘图， 但是如果有布局数据，就绘图玩额外调用一次绘图，把布局数据传入修正布局效果
 */

var Tree = /*#__PURE__*/function (_GraphsBase) {
  (0, _inherits2["default"])(Tree, _GraphsBase);

  var _super = _createSuper(Tree);

  function Tree(opt, app) {
    var _this;

    (0, _classCallCheck2["default"])(this, Tree);
    _this = _super.call(this, opt, app);
    _this.type = "tree";
    _this.shrinked = []; //所有被设置了收缩的node的key

    _.extend(true, (0, _assertThisInitialized2["default"])(_this), (0, _tools.getDefaultProps)(Tree.defaultProps()), opt);

    return _this;
  }

  (0, _createClass2["default"])(Tree, [{
    key: "_initData",
    value: function _initData(_data) {
      var _this2 = this;

      return new Promise(function (resolve) {
        if (_data && _data.nodes && _data.edges) {
          resolve(_data);
          return;
        }

        ;
        var data = {
          //{ type,key,content,ctype,width,height,x,y }
          nodes: [],
          //{ type,key[],content,ctype,width,height,x,y }
          edges: [],
          size: {
            width: 0,
            height: 0
          }
        };
        var originData = _this2.app._data;

        if ((0, _data2.checkDataIsJson)(originData, _this2.field, _this2.childrenField)) {
          _this2.jsonData = (0, _data2.jsonToArrayForRelation)(originData, _this2, _this2.childrenField);
          _this2.dataFrame = _this2.app.dataFrame = (0, _dataFrame["default"])(_this2.jsonData);
        } else {
          //源数据就是图表标准数据，只需要转换成json的Children格式
          //app.dataFrame.jsonOrg ==> [{name: key:} ...] 不是children的树结构
          _this2.jsonData = (0, _data2.arrayToTreeJsonForRelation)(_this2.app.dataFrame.jsonOrg, _this2);
        }

        ;

        var setData = function setData(list, parentRowData) {
          list.forEach(function (rowData) {
            var key = rowData[_this2.field];

            var content = _this2._getContent(rowData); //let preNode = this._preData ? this._preData.nodes.find( item => item.key == key ) : null


            var node = _this2._getDefNode();

            Object.assign(node, {
              type: 'tree',
              iNode: rowData.__index__,
              rowData: rowData,
              key: key,
              content: content,
              ctype: _this2._checkHtml(content) ? 'html' : 'canvas'
            });
            node.shapeType = _this2.getProp(_this2.node.shapeType, node);
            Object.assign(node, _this2.layoutOpts.node);
            data.nodes.push(node); //如果有parent，那么就还有连线需要处理

            if (parentRowData) {
              //edge在relation中也是一个标准的node数据结构
              var edgeKey = [parentRowData[_this2.field], rowData[_this2.field]]; //let preEdge = this._preData ? this._preData.edges.find( item => item.key.join(',') == edgeKey.join(',') ) : null

              var edge = _this2._getDefNode();

              var edgeFilter = {};
              edgeFilter[_this2.field] = edgeKey.join(',');

              var edgeRowDatas = _this2.dataFrame.getRowDataOf(edgeFilter);

              if (edgeRowDatas && edgeRowDatas.length) {
                //edgeRowData
                var edgeRowData = edgeRowDatas[0];

                var edgeContent = _this2._getContent(edgeRowData);

                Object.assign(edge, {
                  type: 'tree',
                  iNode: edgeRowData.__index__,
                  rowData: edgeRowData,
                  key: edgeKey,
                  content: edgeContent,
                  ctype: _this2._checkHtml(edgeContent) ? 'html' : 'canvas'
                });
                edge.shapeType = _this2.getProp(_this2.line.shapeType, edge);
                Object.assign(edge, _this2.layoutOpts.edge);
                data.edges.push(edge);
              }
            }

            ;

            if (rowData.children && _this2.shrinked.indexOf(key) == -1) {
              setData(rowData.children, rowData);
            }

            ;
          });
        };

        setData(_this2.jsonData);

        _this2._initAllDataSize(data).then(function (data) {
          resolve(data);
        });
      });
    }
  }, {
    key: "_drawNodes",
    value: function _drawNodes() {
      var _this3 = this;

      var me = this;

      _.each(this.data.nodes, function (node) {
        _this3._drawNode(node); //shrink


        if (_this3.node.shrink.enabled) {
          if (node.rowData.children && node.rowData.children.length) {
            var iconId = node.key + "_shrink_icon";
            var iconBackId = node.key + "_shrink_icon_back";
            var charCode = _this3.node.shrink.openCharCode;

            if (_this3.shrinked.indexOf(node.key) == -1) {
              charCode = _this3.node.shrink.closeCharCode;
            }

            ;
            var iconText = String.fromCharCode(parseInt(_this3.getProp(charCode, node), 16));

            var fontSize = _this3.getProp(_this3.node.shrink.fontSize, node);

            var fontColor = _this3.getProp(_this3.node.shrink.fontColor, node);

            var fontFamily = _this3.getProp(_this3.node.shrink.fontFamily, node);

            var offsetX = _this3.getProp(_this3.node.shrink.offsetX, node);

            var offsetY = _this3.getProp(_this3.node.shrink.offsetY, node);

            var tipsContent = _this3.getProp(_this3.node.shrink.tipsContent, node);

            var background = _this3.getProp(_this3.node.shrink.background, node);

            var lineWidth = _this3.getProp(_this3.node.shrink.lineWidth, node);

            var strokeStyle = _this3.getProp(_this3.node.shrink.strokeStyle, node);

            var _shrinkIcon = _this3.labelsSp.getChildById(iconId);

            var _shrinkIconBack = _this3.labelsSp.getChildById(iconBackId);

            var x = parseInt(node.x + node.width / 2 + offsetX);
            var y = parseInt(node.y + offsetY); //shrinkIcon的 位置默认为左右方向的xy

            var shrinkCtx = {
              x: x,
              y: y + 1,
              fontSize: fontSize,
              fontFamily: fontFamily,
              fillStyle: fontColor,
              textAlign: "center",
              textBaseline: "middle",
              cursor: 'pointer'
            };
            var _shrinkBackCtx = {
              x: x,
              y: y,
              r: parseInt(fontSize * 0.5) + 2,
              fillStyle: background,
              strokeStyle: strokeStyle,
              lineWidth: lineWidth
            };

            if (_shrinkIcon) {
              _shrinkIcon.resetText(iconText);

              Object.assign(_shrinkIcon.context, shrinkCtx);
              Object.assign(_shrinkIconBack.context, _shrinkBackCtx);
            } else {
              _shrinkIcon = new _canvax["default"].Display.Text(iconText, {
                id: iconId,
                context: shrinkCtx
              });
              _shrinkIconBack = new Circle({
                id: iconBackId,
                context: _shrinkBackCtx
              });

              _this3.labelsSp.addChild(_shrinkIconBack);

              _this3.labelsSp.addChild(_shrinkIcon);

              _shrinkIcon._shrinkIconBack = _shrinkIconBack;

              _shrinkIcon.on(event.types.get(), function (e) {
                var trigger = _this3.node.shrink;
                e.eventInfo = {
                  trigger: trigger,
                  tipsContent: tipsContent,
                  nodes: [] //node

                }; //下面的这个就只在鼠标环境下有就好了

                if (_shrinkIconBack.context) {
                  if (e.type == 'mousedown') {
                    _shrinkIconBack.context.r += 1;
                  }

                  if (e.type == 'mouseup') {
                    _shrinkIconBack.context.r -= 1;
                  }
                }

                ;

                if (_this3.node.shrink.triggerEventType.indexOf(e.type) > -1) {
                  if (_this3.shrinked.indexOf(node.key) == -1) {
                    _this3.shrinked.push(node.key);
                  } else {
                    for (var i = 0, l = _this3.shrinked.length; i < l; i++) {
                      if (_this3.shrinked[i] == node.key) {
                        _this3.shrinked.splice(i, 1);

                        i--;
                        l--;
                      }
                    }
                  }

                  ;

                  var _trigger = new _trigger2["default"](me, {
                    origin: node.key
                  });

                  _this3.app.resetData(null, _trigger);
                }

                _this3.app.fire(e.type, e);
              });
            }

            ; //TODO: 这个赋值只能在这里处理， 因为resetData的时候， 每次node都是一个新的node数据
            //shrinkIcon的引用就断了

            _shrinkIcon.nodeData = node;
            node.shrinkIcon = _shrinkIcon;
            node.shrinkIconBack = _shrinkIconBack;
          }
        }
      });
    }
  }, {
    key: "_destroy",
    value: function _destroy(item) {
      item.shapeElement && item.shapeElement.destroy();

      if (item.contentElement.destroy) {
        item.contentElement.destroy();
      } else {
        //否则就可定是个dom
        this.domContainer.removeChild(item.contentElement);
      }

      ; //下面的几个是销毁edge上面的元素

      item.pathElement && item.pathElement.destroy();
      item.labelElement && item.labelElement.destroy();
      item.arrowElement && item.arrowElement.destroy();
      item.edgeIconElement && item.edgeIconElement.destroy();
      item.edgeIconBack && item.edgeIconBack.destroy(); //下面两个是tree中独有的

      item.shrinkIcon && item.shrinkIcon.destroy();
      item.shrinkIconBack && item.shrinkIconBack.destroy();

      if (Array.isArray(item.key)) {
        //是个edge的话，要检查下源头是不是没有子节点了， 没有子节点了， 还要把shrinkIcon 都干掉
        var sourceNode = item.source;

        if (!this.data.edges.find(function (item) {
          return item.key[0] == sourceNode.key;
        })) {
          //如歌edges里面还有 targetNode.key 开头的，targetNode 还有子节点, 否则就可以把 targetNode的shrinkIcon去掉
          sourceNode.shrinkIcon && sourceNode.shrinkIcon.destroy();
          sourceNode.shrinkIconBack && sourceNode.shrinkIconBack.destroy();
        }
      }
    }
  }], [{
    key: "defaultProps",
    value: function defaultProps() {
      return {
        field: {
          detail: 'key字段设置',
          documentation: '',
          "default": null
        },
        node: {
          detail: '单个节点的配置',
          propertys: {
            shrink: {
              detail: '树状图是否有节点收缩按钮',
              propertys: {
                enabled: {
                  detail: "是否开启",
                  "default": true
                },
                triggerEventType: {
                  detail: '触发事件',
                  "default": 'click,tap'
                },
                openCharCode: {
                  detail: "点击后触发展开的icon chartCode，当前状态为收缩",
                  "default": ''
                },
                closeCharCode: {
                  detail: "点击后触发收缩的icon chartCode，当前状态为展开",
                  "default": ''
                },
                fontSize: {
                  detail: "icon字号大小",
                  "default": 12
                },
                fontColor: {
                  detail: "icon字体颜色",
                  "default": '#666'
                },
                fontFamily: {
                  detail: "icon在css中的fontFamily",
                  "default": 'iconfont'
                },
                tipsContent: {
                  detail: '鼠标移动到收缩icon上面的tips内容',
                  "default": ''
                },
                offsetX: {
                  detail: 'x方向偏移量',
                  "default": 10
                },
                offsetY: {
                  detail: 'y方向偏移量',
                  "default": 1
                },
                background: {
                  detail: 'icon的 背景色',
                  "default": '#fff'
                },
                lineWidth: {
                  detail: '边框大小',
                  "default": 1
                },
                strokeStyle: {
                  detail: '描边颜色',
                  "default": '#667894'
                }
              }
            }
          }
        }
      };
    }
  }]);
  return Tree;
}(_index["default"]);

_index["default"].registerComponent(Tree, 'graphs', 'tree');

var _default = Tree;
exports["default"] = _default;