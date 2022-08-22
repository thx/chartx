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

var _base = _interopRequireDefault(require("./base"));

var _tools = require("../../../utils/tools");

var _trigger2 = _interopRequireDefault(require("../../trigger"));

var _tree2 = _interopRequireDefault(require("../../../layout/tree/tree"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var _ = _canvax["default"]._,
    event = _canvax["default"].event;
var Circle = _canvax["default"].Shapes.Circle;
var Rect = _canvax["default"].Shapes.Rect; //内部交互需要同步回源数据的属性， 树状图要实现文本的编辑，所以content也要加入进来

var syncToOriginKeys = ['collapsed', 'style', 'content'];
var iconWidth = 20;
/**
 * 关系图中 包括了  配置，数据，和布局数据，
 * 默认用配置和数据可以完成绘图， 但是如果有布局数据，就绘图玩额外调用一次绘图，把布局数据传入修正布局效果
 */

var compactTree = /*#__PURE__*/function (_GraphsBase) {
  (0, _inherits2["default"])(compactTree, _GraphsBase);

  var _super = _createSuper(compactTree);

  function compactTree(opt, app) {
    var _this;

    (0, _classCallCheck2["default"])(this, compactTree);
    _this = _super.call(this, opt, app);
    _this.type = "compacttree";

    _.extend(true, (0, _assertThisInitialized2["default"])(_this), (0, _tools.getDefaultProps)(compactTree.defaultProps()), opt);

    return _this;
  }

  (0, _createClass2["default"])(compactTree, [{
    key: "draw",
    value: function draw(opt) {
      var _this2 = this;

      !opt && (opt = {});

      _.extend(true, this, opt);

      this.initData(opt.data).then(function (data) {
        _this2.data = data;

        _this2.layoutData();

        _this2.widget();

        _this2.induce.context.width = _this2.width;
        _this2.induce.context.height = _this2.height;
        _this2.sprite.context.x = parseInt(_this2.origin.x);
        _this2.sprite.context.y = parseInt(_this2.origin.y); //test bound
        // this._bound = new Rect({
        //     context: {
        //         x: this.data.extents.left,
        //         y: this.data.extents.top,
        //         width: this.data.size.width,
        //         height: this.data.size.height,
        //         lineWidth:1,
        //         strokeStyle: 'red'
        //     }
        // });
        // this.graphsSp.addChild( this._bound )

        _this2.graphsSp.context.x = Math.max((_this2.width - _this2.data.size.width) / 2, _this2.app.padding.left);
        _this2.graphsSp.context.y = _this2.height / 2;

        _this2.fire("complete");
      });
    } //如果dataTrigger.origin 有传入， 则已经这个origin为参考点做重新布局
    //TODO， 如果这个图的options中有配置 一个 符合 关系图的数据{nodes, edges, size}
    //那么这个时候的resetData还不能满足，因为resetData的第一个个参数是dataFrame， 而options.data其实已经算是配置了，
    //后面遇到这个情况再调整吧

  }, {
    key: "resetData",
    value: function resetData(dataFrame, dataTrigger) {
      var _this3 = this;

      this._resetData(dataFrame, dataTrigger).then(function () {
        _this3.fire("complete"); // Object.assign( this._bound.context, {
        //     x: this.data.extents.left,
        //     y: this.data.extents.top,
        //     width: this.data.size.width,
        //     height: this.data.size.height
        // } );

      });
    }
  }, {
    key: "widget",
    value: function widget() {
      this._drawEdges();

      this._drawNodes();
    } //$data如果用户设置了符合data的数据格式数据{nodes, edges, size, extents}，那就直接返回

  }, {
    key: "initData",
    value: function initData($data, $dataTrigger) {
      var _this4 = this;

      return new Promise(function (resolve) {
        if ($data && $data.nodes && $data.edges) {
          resolve($data);
          return;
        }

        ;
        var data = {
          // relation 也好，  tree也好， 最后都要转换成 nodes edges  渲染统一依赖 nodes 和 edges
          //{ type,key,content,ctype,width,height,x,y }
          nodes: [],
          //{ type,key[],content,ctype,width,height,x,y }
          edges: [],
          size: {
            width: 0,
            height: 0
          },
          treeOriginData: null,
          //原始全量的treeData
          treeData: null,
          //折叠过滤掉后的需要渲染的treeData
          nodesLength: 0
        };
        var originData = _this4.app._data;
        data.treeOriginData = originData; //TODO 这里可以 判断 $dataTrigger 如果是来自图表内部的 collapse 等， 
        //就可以不用走下面的 arrayToTreeJsonForRelation ， 后续优化
        //项目里一般都建议直接使用treeData的格式，但是这里要做一次判断是因为chartpark上面做的demo只能下面的格式

        /**
         * [ {id:1,label:''},{id:2,label:''},{id:'1,2',label:''} ]
         */
        //要把这个格式转成 {id:1,children: [{id:2}]} 这样的格式
        //注意，这里不能用dataFrame去做判断，判断不出来的，只能用原始的 originData

        if (Array.isArray(originData)) {
          data.treeOriginData = _this4.arrayToTreeJsonForRelation(_this4.app.dataFrame.jsonOrg, _this4);
        }

        var t = new Date().getTime(); //然后从treeOriginData 过滤掉 需要显示的子树 到 treeData
        //{treeData, nodeLength}这里设置了这两个属性

        Object.assign(data, _this4._filterTreeData(data.treeOriginData));
        var t1 = new Date().getTime();

        _this4._initAllDataSize(data).then(function () {
          //这个时候已经设置好了 treeData 的 size 属性width、height
          //可以开始布局了，布局完就可以设置好 data 的 nodes edges 和 size 属性
          resolve(data);
        });
      });
    } //treeOriginData 一定是一个 树结构的

  }, {
    key: "_filterTreeData",
    value: function _filterTreeData(treeOriginData) {
      var _this5 = this,
          _this$data;

      var nodesLength = 1;
      var collapsedField = this.node.collapse.field;
      var childrenField = this.childrenField;
      var nodes = [];
      var edges = []; // let treeData = {};
      // Object.assign( treeData, treeOriginData );
      // let childrenField = this.childrenField;
      // let children = treeOriginData[ childrenField ];
      // treeData[ childrenField ] = [];
      //parent指向的是treeData不是originData，这里要注意下

      var filter = function filter(treeOriginData, parent, depth, rowInd, treeData) {
        Object.assign(treeData, {
          depth: depth || 0,
          parent: parent,
          rowInd: rowInd //在parent中的Index

        }); //resetData的时候，有些节点原本有数据的

        var preChildrenList = treeData[childrenField] || [];
        Object.assign(treeData, treeOriginData);
        treeData['__originData'] = treeOriginData; //和原数据建立下关系，比如 treeData 中的一些数据便跟了要同步到原数据中去

        treeData[childrenField] = []; //开始构建nodes

        var content = _this5._getContent(treeData); //下面这个判断逻辑主要用在resetData的时候用


        if (treeData._node && content != treeData._node.content) {
          treeData._node = null;
          delete treeData._node;

          if (!treeData.style) {
            treeData.style = {
              width: 0,
              height: 0
            };
          }

          if (!treeOriginData.style || treeOriginData.style && (!treeOriginData.style.width || !treeOriginData.style.height)) {
            treeData.style.width = 0;
            treeData.style.height = 0;
          }
        }

        ;

        var node = _this5.getDefNode({
          type: 'tree'
        });

        Object.assign(node, {
          iNode: nodes.length,
          rowData: treeData,
          key: treeData[_this5.field],
          content: content,
          ctype: _this5._checkHtml(content) ? 'html' : 'canvas',
          width: 0,
          height: 0,
          depth: depth || 0 //深度

        }); //不能放到assign中去，  getProp的处理中可能依赖node.rowData

        node.shapeType = _this5.getProp(_this5.node.shapeType, node);
        node.preIconCharCode = _this5.getProp(_this5.node.preIcon.charCode, node);
        node.iconCharCodes = _this5.getProp(_this5.node.icons.charCode, node) || [];
        nodes.push(node);
        treeData._node = node;

        if (!treeData[collapsedField]) {
          //如果这个节点未折叠
          //检查他的子节点
          (treeOriginData[childrenField] || []).forEach(function (child, rowInd) {
            var preChildTreeData = preChildrenList.find(function (item) {
              return item[_this5.field] == child[_this5.field];
            }) || {};
            var childTreeData = filter(child, treeData, depth + 1, rowInd, preChildTreeData);
            treeData[childrenField].push(childTreeData);
            nodesLength++; //开始构建edges

            var rowData = {};
            var content = ''; //this._getContent(rowData);

            var edge = _this5.getDefNode({
              type: 'tree'
            });

            Object.assign(edge, {
              isTree: true,
              iNode: edges.length,
              rowData: rowData,
              key: [treeData[_this5.field], childTreeData[_this5.field]],
              //treeData[ this.field ]+","+child[ this.field ],
              content: content,
              ctype: _this5._checkHtml(content) ? 'html' : 'canvas',
              //如果是edge，要有source 和 target
              source: treeData._node,
              target: childTreeData._node,
              sourceTreeData: treeData,
              targetTreeData: childTreeData
            });
            edge.shapeType = _this5.getProp(_this5.line.shapeType, edge);
            edges.push(edge);
          });
        }

        return treeData;
      };

      var preTreeData = ((_this$data = this.data) === null || _this$data === void 0 ? void 0 : _this$data.treeData) || {};
      var treeData = filter(treeOriginData, null, 0, 0, preTreeData);
      return {
        treeData: treeData,
        nodesLength: nodesLength,
        nodes: nodes,
        edges: edges
      };
    } //所有对nodeData原始数据的改变都需要同步到原数据, 比如 collapsed 折叠状态, 还有动态计算出来的width 和 height

  }, {
    key: "_syncToOrigin",
    value: function _syncToOrigin(treeData) {
      for (var k in treeData) {
        if (syncToOriginKeys.indexOf(k) > -1) {
          treeData.__originData[k] = treeData[k];
        }
      }
    }
  }, {
    key: "_eachTreeDataHandle",
    value: function _eachTreeDataHandle(treeData, handle) {
      var _this6 = this;

      handle && handle(treeData);
      (treeData[this.childrenField] || []).forEach(function (nodeData) {
        _this6._eachTreeDataHandle(nodeData, handle);
      });
    }
  }, {
    key: "_initAllDataSize",
    value: function _initAllDataSize(data) {
      var _this7 = this;

      var treeData = data.treeData,
          nodesLength = data.nodesLength;
      var initNum = 0;
      return new Promise(function (resolve) {
        _this7._eachTreeDataHandle(treeData, function (treeDataItem) {
          //计算和设置node的尺寸
          _this7._setSize(treeDataItem).then(function () {
            _this7._setNodeBoundingClientWidth(treeDataItem); // 重新校验一下size， 比如菱形的 外界矩形是不一样的


            _this7.checkNodeSizeForShapeType(treeDataItem._node);

            initNum++;

            if (initNum == nodesLength) {
              //全部处理完毕了
              resolve(data);
            }
          });
        });
      });
    }
  }, {
    key: "_setNodeBoundingClientWidth",
    value: function _setNodeBoundingClientWidth(treeData) {
      var node = treeData._node;
      var boundingClientWidth = node.width || 0;

      if (node.shapeType != 'diamond' && node.depth) {
        if (treeData.__originData[this.childrenField] && treeData.__originData[this.childrenField].length) {
          boundingClientWidth += iconWidth;
        }

        ;
      }

      if (node.preIconCharCode) {
        boundingClientWidth += iconWidth;
      }

      ;

      if (node.iconCharCodes && node.iconCharCodes.length) {
        boundingClientWidth += iconWidth * node.iconCharCodes.length;
      }

      ;
      node.boundingClientWidth = boundingClientWidth;
    }
  }, {
    key: "_setSize",
    value: function _setSize(treeData) {
      var _this8 = this;

      return new Promise(function (resolve) {
        var node = treeData._node; //这里的width都是指内容的size

        var width = treeData.width || treeData.style && treeData.style.width || _this8.getProp(_this8.node.width, treeData);

        var height = treeData.height || treeData.style && treeData.style.height || _this8.getProp(_this8.node.height, treeData);

        if (width && height) {
          //如果node上面已经有了 尺寸 
          //（treeData中自己带了尺寸数据，或者node.width node.height设置了固定的尺寸配置）
          // 这个时候 contentElement 可能就是空（可以有可视范围内渲染优化，布局阶段不需要初始化contentElement），
          var sizeOpt = {
            width: width,
            height: height,
            contentElement: node.contentElement
          }; // opt -> contentElement,width,height 

          _.extend(node, sizeOpt);

          resolve(sizeOpt);
          return;
        }

        ; //如果配置中没有设置size并且treedata中没有记录size，那么就只能初始化了cotnent来动态计算

        _this8._initcontentElementAndSize(treeData).then(function (sizeOpt) {
          _.extend(node, sizeOpt);

          resolve(sizeOpt);
        });
      });
    } //通过 初始化 contnt 来动态计算 size 的走这里

  }, {
    key: "_initcontentElementAndSize",
    value: function _initcontentElementAndSize(treeData) {
      var _this9 = this;

      return new Promise(function (resolve) {
        var node = treeData._node; //那么，走到这里， 就说明需要动态的计算size尺寸，动态计算， 是一定要有contentElement的

        var contentType = node.ctype;

        if (_this9._isField(contentType)) {
          contentType = node.rowData[contentType];
        }

        ;
        !contentType && (contentType = 'canvas');

        var _initEle;

        if (contentType == 'canvas') {
          _initEle = _this9._getEleAndsetCanvasSize;
        }

        ;

        if (contentType == 'html') {
          _initEle = _this9._getEleAndsetHtmlSize;
        }

        ;

        _initEle.apply(_this9, [node]).then(function (sizeOpt) {
          // sizeOpt -> contentElement,width,height 
          _.extend(node, sizeOpt); //动态计算的尺寸，要写入到treeData中去，然后同步到 treeData的 originData，
          //这样就可以 和 整个originData一起存入数据库，后续可以加快再次打开的渲染速度


          if (!treeData.style) {
            treeData.style = {};
          }

          ;
          treeData.style.width = node.width;
          treeData.style.height = node.height;

          _this9._syncToOrigin(treeData);

          resolve(sizeOpt);
        });
      });
    }
  }, {
    key: "layoutData",
    value: function layoutData() {
      if (_.isFunction(this.layout)) {
        //layout需要设置好data中nodes的xy， 以及edges的points，和 size的width，height
        this.layout(this.data);
      } else {
        this.treeLayout(this.data); //tree中自己实现layout
      }
    }
  }, {
    key: "treeLayout",
    value: function treeLayout(data) {
      var _this10 = this;

      var childrenField = this.childrenField;
      var layoutIsHorizontal = this.rankdir == 'LR' || this.rankdir == 'RL'; //layoutIsHorizontal = false;

      var t1 = new Date().getTime();
      var spaceX = this.nodesep; //20;

      var spaceY = this.ranksep; //20;

      var layout = (0, _tree2["default"])({
        spacing: spaceX,
        nodeSize: function nodeSize(node) {
          //计算的尺寸已经node的数据为准， 不取treeData的
          var height = node.data._node.height || 0;
          var boundingClientWidth = node.data._node.boundingClientWidth || 0;

          if (layoutIsHorizontal) {
            return [height, boundingClientWidth + spaceY];
          }

          return [boundingClientWidth, height + spaceY]; //因为节点高度包含节点下方的间距
        },
        children: function children(data) {
          return data[childrenField];
        }
      });

      var _tree = layout.hierarchy(data.treeData);

      var _layout = layout(_tree);

      var left = 0,
          top = 0,
          right = 0,
          bottom = 0;
      var width = 0,
          height = 0;

      _layout.each(function (node) {
        if (layoutIsHorizontal) {
          var x = node.x;
          node.x = node.y;
          node.y = x;
        }

        ;
        left = Math.min(left, node.x);
        right = Math.max(right, node.x + node.data._node.boundingClientWidth);
        top = Math.min(top, node.y);
        bottom = Math.max(bottom, node.y + node.data._node.height + spaceY); //node的x y 都是矩形的中心点

        node.data._node.x = node.x + node.data._node.boundingClientWidth / 2;
        node.data._node.y = node.y + node.data._node.height / 2;
        node.data._node.depth = node.depth;
      });

      width = right - left;
      height = bottom - top - spaceY; ////设置edge的points

      data.edges.forEach(function (edge) {
        _this10.getEdgePoints(edge);
      });
      Object.assign(data, {
        size: {
          width: width,
          height: height
        },
        extents: {
          left: left,
          top: top,
          right: right,
          bottom: bottom
        }
      });
    } //可以继承覆盖

  }, {
    key: "getEdgePoints",
    value: function getEdgePoints(edge) {
      var points = []; //firstPoint

      var firstPoint = {
        x: parseInt(edge.source.x + edge.source.boundingClientWidth / 2),
        y: parseInt(edge.source.y)
      };

      if (!edge.source.depth) {
        //根节点
        firstPoint.x = parseInt(edge.source.x);
      }

      if (edge.source.shapeType == 'underLine') {
        firstPoint.y = parseInt(edge.source.y + edge.source.height / 2);
      }

      points.push(firstPoint);
      var secPoint = {
        x: firstPoint.x + 10,
        y: firstPoint.y
      };
      points.push(secPoint); //lastPoint

      var lastPoint = {
        x: parseInt(edge.target.x - edge.target.boundingClientWidth / 2),
        y: parseInt(edge.target.y)
      };

      if (edge.target.shapeType == 'underLine') {
        lastPoint.y = parseInt(edge.target.y + edge.target.height / 2);
      } //LR


      points.push({
        x: secPoint.x + parseInt((lastPoint.x - secPoint.x) / 2),
        y: lastPoint.y
      });
      points.push(lastPoint);
      edge.points = points;
      return points;
    }
  }, {
    key: "_drawNodes",
    value: function _drawNodes() {
      var _this11 = this;

      var me = this;

      _.each(this.data.nodes, function (node) {
        var key = node.rowData[_this11.field];

        var drawNode = function drawNode() {
          _this11._drawNode(node); //处理一些tree 相对 relation 特有的逻辑
          //collapse


          if (node.depth && _this11.node.collapse.enabled) {
            var iconId = key + "_collapse_icon";
            var iconBackId = key + "_collapse_icon_back";

            if (node.rowData[_this11.childrenField] && node.rowData.__originData[_this11.childrenField] && node.rowData.__originData[_this11.childrenField].length) {
              var charCode = _this11.node.collapse.openCharCode;

              if (!node.rowData.collapsed) {
                charCode = _this11.node.collapse.closeCharCode;
              }

              ;
              var iconText = String.fromCharCode(parseInt(_this11.getProp(charCode, node), 16));

              var fontSize = _this11.getProp(_this11.node.collapse.fontSize, node);

              var fontColor = _this11.getProp(_this11.node.collapse.fontColor, node);

              var fontFamily = _this11.getProp(_this11.node.collapse.fontFamily, node);

              var offsetX = _this11.getProp(_this11.node.collapse.offsetX, node);

              var offsetY = _this11.getProp(_this11.node.collapse.offsetY, node);

              var tipsContent = _this11.getProp(_this11.node.collapse.tipsContent, node);

              var background = _this11.getProp(_this11.node.collapse.background, node);

              var lineWidth = _this11.getProp(_this11.node.collapse.lineWidth, node);

              var strokeStyle = _this11.getProp(_this11.node.collapse.strokeStyle, node);

              var _collapseIcon = _this11.labelsSp.getChildById(iconId);

              var _collapseIconBack = _this11.labelsSp.getChildById(iconBackId);

              var x = parseInt(node.x + node.boundingClientWidth / 2 + offsetX - _this11.node.padding - fontSize / 4);

              if (node.shapeType == 'diamond') {
                x += _this11.node.padding + fontSize * 1 + 1;
              }

              var y = parseInt(node.y + offsetY); //collapseIcon的 位置默认为左右方向的xy

              var collapseCtx = {
                x: x,
                y: y + 1,
                fontSize: fontSize,
                fontFamily: fontFamily,
                fillStyle: fontColor,
                textAlign: "center",
                textBaseline: "middle",
                cursor: 'pointer'
              };
              var r = parseInt(fontSize * 0.5) + 2;
              var _collapseBackCtx = {
                x: x,
                y: y,
                r: r,
                fillStyle: background,
                strokeStyle: strokeStyle,
                lineWidth: lineWidth
              };

              if (_collapseIcon) {
                _collapseIcon.resetText(iconText);

                Object.assign(_collapseIcon.context, collapseCtx);
                Object.assign(_collapseIconBack.context, _collapseBackCtx);
              } else {
                _collapseIcon = new _canvax["default"].Display.Text(iconText, {
                  id: iconId,
                  context: collapseCtx
                });
                _collapseIconBack = new Circle({
                  id: iconBackId,
                  context: _collapseBackCtx
                });

                _this11.labelsSp.addChild(_collapseIconBack);

                _this11.labelsSp.addChild(_collapseIcon);

                _collapseIcon._collapseIconBack = _collapseIconBack;
                var _me = _this11; //这里不能用箭头函数，听我的没错

                _collapseIcon.on(event.types.get(), function (e) {
                  var trigger = _me.node.collapse;
                  e.eventInfo = {
                    trigger: trigger,
                    tipsContent: tipsContent,
                    nodes: [] //node

                  }; //下面的这个就只在鼠标环境下有就好了

                  if (_collapseIconBack.context) {
                    if (e.type == 'mousedown') {
                      _collapseIconBack.context.r += 1;
                    }

                    if (e.type == 'mouseup') {
                      _collapseIconBack.context.r -= 1;
                    }
                  }

                  ;

                  if (_me.node.collapse.triggerEventType.indexOf(e.type) > -1) {
                    this.nodeData.rowData.collapsed = !this.nodeData.rowData.collapsed;

                    _me._syncToOrigin(this.nodeData.rowData);

                    var _trigger = new _trigger2["default"](_me, {
                      origin: key
                    });

                    _me.app.resetData(null, _trigger);
                  }

                  _me.app.fire(e.type, e);
                });
              }

              ; //TODO: 这个赋值只能在这里处理， 因为resetData的时候， 每次node都是一个新的node数据
              //collapseIcon的引用就断了

              _collapseIcon.nodeData = node;
              node.collapseIcon = _collapseIcon;
              node.collapseIconBack = _collapseIconBack;
            } else {
              var _collapseIcon2 = _this11.labelsSp.getChildById(iconId);

              if (_collapseIcon2) _collapseIcon2.destroy();

              var _collapseIconBack2 = _this11.labelsSp.getChildById(iconBackId);

              if (_collapseIconBack2) _collapseIconBack2.destroy();
            }
          }

          var getIconStyle = function getIconStyle(prop, charCode) {
            var iconText = String.fromCharCode(parseInt(charCode, 16));
            var fontSize = me.getProp(prop.fontSize, node, charCode);
            var fontColor = me.getProp(prop.fontColor, node, charCode);
            var fontFamily = me.getProp(prop.fontFamily, node, charCode);
            var offsetX = me.getProp(prop.offsetX, node, charCode);
            var offsetY = me.getProp(prop.offsetY, node, charCode);
            var tipsContent = me.getProp(prop.tipsContent, node, charCode);
            return {
              iconText: iconText,
              fontSize: fontSize,
              fontColor: fontColor,
              fontFamily: fontFamily,
              offsetX: offsetX,
              offsetY: offsetY,
              tipsContent: tipsContent
            };
          }; //绘制preIcon


          if (node.preIconCharCode) {
            var preIconId = key + "_pre_icon";

            var _getIconStyle = getIconStyle(_this11.node.preIcon, node.preIconCharCode),
                _iconText = _getIconStyle.iconText,
                _fontSize = _getIconStyle.fontSize,
                _fontColor = _getIconStyle.fontColor,
                _fontFamily = _getIconStyle.fontFamily,
                _offsetX = _getIconStyle.offsetX,
                _offsetY = _getIconStyle.offsetY,
                _tipsContent = _getIconStyle.tipsContent;

            var _x = parseInt(node.x - node.boundingClientWidth / 2 + _this11.node.padding + _offsetX);

            var _y = parseInt(node.y + _offsetY); //collapseIcon的 位置默认为左右方向的xy


            var preIconCtx = {
              x: _x,
              y: _y + 1,
              fontSize: _fontSize,
              fontFamily: _fontFamily,
              fillStyle: _fontColor,
              textAlign: "left",
              textBaseline: "middle",
              cursor: 'pointer'
            };

            var _preIcon = _this11.labelsSp.getChildById(preIconId);

            if (_preIcon) {
              _preIcon.resetText(_iconText);

              Object.assign(_preIcon.context, preIconCtx);
            } else {
              _preIcon = new _canvax["default"].Display.Text(_iconText, {
                id: preIconId,
                context: preIconCtx
              });

              _this11.labelsSp.addChild(_preIcon);
            }

            ; //TODO: 这个赋值只能在这里处理， 因为resetData的时候， 每次node都是一个新的node数据
            //collapseIcon的引用就断了

            node.preIconEl = _preIcon;
          } else {
            if (node.preIconEl) {
              node.preIconEl.destroy();
              delete node.preIconEl;
            }
          } //绘制icons 待续...


          if (node.iconCharCodes && node.iconCharCodes.length) {
            var iconsSpId = key + "_icons_sp";
          } else {
            if (node.iconsSp) {
              node.iconsSp.destroy();
              delete node.iconsSp;
            }
          }
        };

        if (!node.contentElement) {
          //绘制的时候如果发现没有 contentElement，那么就要把 contentElement 初始化了
          _this11._initcontentElementAndSize(node.rowData).then(function () {
            drawNode();
          });
        } else {
          drawNode();
        }
      });
    }
  }, {
    key: "_destroy",
    value: function _destroy(item) {
      var _this12 = this;

      item.shapeElement && item.shapeElement.destroy();

      if (item.contentElement) {
        if (item.contentElement.destroy) {
          item.contentElement.destroy();
        } else {
          //否则就可定是个dom
          this.domContainer.removeChild(item.contentElement);
        }

        ;
      }

      ; //下面的几个是销毁edge上面的元素

      item.pathElement && item.pathElement.destroy();
      item.labelElement && item.labelElement.destroy();
      item.arrowElement && item.arrowElement.destroy();
      item.edgeIconElement && item.edgeIconElement.destroy();
      item.edgeIconBack && item.edgeIconBack.destroy(); //下面两个是tree中独有的

      item.collapseIcon && item.collapseIcon.destroy();
      item.collapseIconBack && item.collapseIconBack.destroy();
      item.preIconEl && item.preIconEl.destroy();

      if (Array.isArray(item[this.field])) {
        //是个edge的话，要检查下源头是不是没有子节点了， 没有子节点了， 还要把collapseIcon 都干掉
        var sourceNode = item.source;

        if (!this.data.edges.find(function (item) {
          return item[_this12.field][0] == sourceNode[_this12.field];
        })) {
          //如歌edges里面还有 targetNode[this.field] 开头的，targetNode 还有子节点, 否则就可以把 targetNode的collapseIcon去掉
          sourceNode.collapseIcon && sourceNode.collapseIcon.destroy();
          sourceNode.collapseIconBack && sourceNode.collapseIconBack.destroy();
        }
      }
    }
  }, {
    key: "arrayToTreeJsonForRelation",
    value: function arrayToTreeJsonForRelation(data) {
      var _this13 = this;

      // [ { key: 1, name: },{key:'1,2'} ] to [ { name: children: [ {}... ] } ] 
      var _nodes = {};
      var _edges = {};

      _.each(data, function (item) {
        var key = item[_this13.field] + '';

        if (key.split(',').length == 1) {
          _nodes[key] = item;
        } else {
          _edges[key] = item;
        }

        ;
      }); //先找到所有的一层


      var arr = [];

      _.each(_nodes, function (node, nkey) {
        var isFirstLev = true;

        _.each(_edges, function (edge, ekey) {
          ekey = ekey + '';

          if (ekey.split(',')[1] == nkey) {
            isFirstLev = false;
            return false;
          }
        });

        if (isFirstLev) {
          arr.push(node);
          node.__inRelation = true;
        }

        ;
      }); //有了第一层就好办了


      var getChildren = function getChildren(list) {
        _.each(list, function (node) {
          if (node.__cycle) return;
          var key = node[_this13.field];

          _.each(_edges, function (edge, ekey) {
            ekey = ekey + '';

            if (ekey.split(',')[0] == key) {
              //那么说明[1] 就是自己的children
              var childNode = _nodes[ekey.split(',')[1]];

              if (childNode) {
                if (!node[_this13.childrenField]) node[_this13.childrenField] = [];

                if (!_.find(node[_this13.childrenField], function (_child) {
                  return _child[_this13.field] == childNode[_this13.field];
                })) {
                  node[_this13.childrenField].push(childNode);
                }

                ; //node[ this.childrenField ].push( childNode );
                //如果这个目标节点__inRelation已经在关系结构中
                //那么说明形成闭环了，不需要再分析这个节点的children

                if (childNode.__inRelation) {
                  childNode.__cycle = true;
                }

                ;
              }
            }
          });

          if (node[_this13.childrenField] && node[_this13.childrenField].length) {
            getChildren(node[_this13.childrenField]);
          }

          ;
        });
      };

      getChildren(arr);
      return arr.length ? arr[0] : null;
    }
  }], [{
    key: "defaultProps",
    value: function defaultProps() {
      return {
        childrenField: {
          detail: '树结构数据的关联字段',
          documentation: '如果是树结构的关联数据，不是行列式，那么就通过这个字段来建立父子关系',
          "default": 'children'
        },
        rankdir: {
          detail: '布局方向',
          "default": 'LR'
        },
        layout: {
          detail: '紧凑的树布局方案， 也可以设置为一个function，自定义布局算法',
          "default": "tree"
        },
        layoutOpts: {
          detail: '布局引擎对应的配置',
          propertys: {}
        },
        ranksep: {
          detail: '排与排之间的距离',
          "default": 40
        },
        nodesep: {
          detail: '同级node之间的距离',
          "default": 20
        },
        node: {
          detail: '单个节点的配置',
          propertys: {
            content: {
              detail: ' 内容配置',
              propertys: {
                textAlign: {
                  detail: '左右对齐方式',
                  "default": 'left'
                }
              }
            },
            collapse: {
              detail: '树状图是否有节点收缩按钮',
              propertys: {
                enabled: {
                  detail: "是否开启",
                  "default": true
                },
                field: {
                  detail: "用来记录collapsed是否折叠的字段，在节点的数据上",
                  "default": "collapsed"
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
                  "default": 10
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
                  "default": 0
                },
                offsetY: {
                  detail: 'y方向偏移量',
                  "default": 0
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
            },
            preIcon: {
              detail: '内容前面的一个icon，主要用来描这个node的类型',
              propertys: {
                charCode: {
                  detail: "icon的iconfont字符串",
                  "default": ''
                },
                fontSize: {
                  detail: "icon字号大小",
                  "default": 18
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
                  "default": 0
                },
                offsetY: {
                  detail: 'y方向偏移量',
                  "default": 0
                }
              }
            },
            icons: {
              detail: '内容后面的一组icon，是个数组， 支持函数返回一组icon，单个icon的格式和preIcon保持一致',
              propertys: {
                charCode: {
                  detail: "icon的iconfont字符串",
                  "default": []
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
                  "default": 0
                },
                offsetY: {
                  detail: 'y方向偏移量',
                  "default": 0
                }
              }
            }
          }
        },
        line: {
          detail: '连线配置',
          propertys: {
            arrow: {
              detail: '箭头配置',
              propertys: {
                enabled: {
                  detail: '是否显示',
                  "default": false
                }
              }
            },
            edgeLabel: {
              detail: '连线文本',
              propertys: {
                enabled: {
                  detail: '是否要连线的文本',
                  "default": false
                }
              }
            },
            icon: {
              detail: '连线上的icon',
              propertys: {
                enabled: {
                  detail: '是否要连线上的icon',
                  "default": false
                }
              }
            }
          }
        }
      };
    }
  }]);
  return compactTree;
}(_base["default"]);

_base["default"].registerComponent(compactTree, 'graphs', 'compacttree');

var _default = compactTree;
exports["default"] = _default;