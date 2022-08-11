"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _canvax = _interopRequireDefault(require("canvax"));

var _index = _interopRequireDefault(require("../index"));

var _tools = require("../../../utils/tools");

var _zoom = _interopRequireDefault(require("../../../utils/zoom"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var _ = _canvax["default"]._,
    event = _canvax["default"].event;
var Rect = _canvax["default"].Shapes.Rect;
var Diamond = _canvax["default"].Shapes.Diamond;
var Line = _canvax["default"].Shapes.Line;
var Path = _canvax["default"].Shapes.Path;
var BrokenLine = _canvax["default"].Shapes.BrokenLine;
var Circle = _canvax["default"].Shapes.Circle;
var Arrow = _canvax["default"].Shapes.Arrow;
var collapseIconWidth = 22;
var typeIconWidth = 20;
/**
 * 关系图中 包括了  配置，数据，和布局数据，
 * 默认用配置和数据可以完成绘图， 但是如果有布局数据，就绘图玩额外调用一次绘图，把布局数据传入修正布局效果
 * 
 * relation 也好，  tree也好， 最后都要转换成 nodes edges
 * 
 */

var RelationBase = /*#__PURE__*/function (_GraphsBase) {
  (0, _inherits2["default"])(RelationBase, _GraphsBase);

  var _super = _createSuper(RelationBase);

  function RelationBase(opt, app) {
    var _this;

    (0, _classCallCheck2["default"])(this, RelationBase);
    _this = _super.call(this, opt, app);
    _this.type = "relation";

    _.extend(true, (0, _assertThisInitialized2["default"])(_this), (0, _tools.getDefaultProps)(RelationBase.defaultProps()), opt);

    _this.domContainer = app.canvax.domView;
    _this.induce = null;

    _this.init();

    return _this;
  }

  (0, _createClass2["default"])(RelationBase, [{
    key: "init",
    value: function init() {
      this._initInduce();

      this.nodesSp = new _canvax["default"].Display.Sprite({
        id: "nodesSp"
      });
      this.nodesContentSp = new _canvax["default"].Display.Sprite({
        id: "nodesContentSp"
      });
      this.edgesSp = new _canvax["default"].Display.Sprite({
        id: "edgesSp"
      });
      this.arrowsSp = new _canvax["default"].Display.Sprite({
        id: "arrowsSp"
      });
      this.labelsSp = new _canvax["default"].Display.Sprite({
        id: "labelsSp"
      });
      this.graphsSp = new _canvax["default"].Display.Sprite({
        id: "graphsSp"
      }); //这个view和induce是一一对应的，在induce上面执行拖拽和滚轮缩放，操作的目标元素就是graphsView

      this.graphsView = new _canvax["default"].Display.Sprite({
        id: "graphsView"
      });
      this.graphsSp.addChild(this.edgesSp);
      this.graphsSp.addChild(this.nodesSp);
      this.graphsSp.addChild(this.nodesContentSp);
      this.graphsSp.addChild(this.arrowsSp);
      this.graphsSp.addChild(this.labelsSp);
      this.graphsView.addChild(this.graphsSp);
      this.sprite.addChild(this.graphsView);
      this.zoom = new _zoom["default"]();
    } //这个node是放在 nodes  和 edges 中的数据结构

  }, {
    key: "getDefNode",
    value: function getDefNode() {
      var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var node = _objectSpread({
        type: "relation",
        //tree中会覆盖为tree
        iNode: 0,
        rowData: null,
        key: "",
        content: '',
        ctype: 'canvas',
        //下面三个属性在_setElementAndSize中设置
        contentElement: null,
        //外面传的layout数据可能没有element，widget的时候要检测下
        width: null,
        height: null,
        //这个在layout的时候设置
        x: null,
        y: null,
        shapeType: null,
        focused: false,
        selected: false
      }, opt);

      return node;
    }
  }, {
    key: "checkNodeSizeForShapeType",
    value: function checkNodeSizeForShapeType(node) {
      //如果是菱形，还需要重新调整新的尺寸
      if (node.shapeType == 'diamond') {
        //因为node的尺寸前面计算出来的是矩形的尺寸，如果是菱形的话，这里就是指内接矩形的尺寸，
        //需要换算成外接矩形的尺寸
        var includedAngle = this.node.includedAngle / 2;
        var includeRad = includedAngle * Math.PI / 180;
        var width = node.width,
            height = node.height;
        node._innerBound = {
          width: width,
          height: height
        };
        var newWidthDiff = height / Math.tan(includeRad);
        var newHeightDiff = width * Math.tan(includeRad); //在内接矩形基础上扩展出来的外界矩形

        var newWidth = width + newWidthDiff;
        var newHeight = height + newHeightDiff; //node上面记录的width 和 height 永远是内容的 高宽, 但是像 diamond 等， 布局的时候的bound是要计算一个新的
        //布局的时候， 布局算法要优先取 layoutWidth  和  layoutHeight

        node.width = newWidth;
        node.height = newHeight;
      }

      ;
    }
  }, {
    key: "_initInduce",
    value: function _initInduce() {
      var me = this;
      this.induce = new Rect({
        id: "induce",
        context: {
          width: 0,
          height: 0,
          fillStyle: "#000000",
          globalAlpha: 0
        }
      });
      this.sprite.addChild(this.induce);
      var _mosedownIng = false;

      var _preCursor = me.app.canvax.domView ? "default" : me.app.canvax.domView.style.cursor; //滚轮缩放相关


      var _wheelHandleTimeLen = 32; //16*2

      var _wheelHandleTimeer = null;
      var _deltaY = 0;
      this.induce.on(event.types.get(), function (e) {
        if (me.status.transform.enabled) {
          var _contextmenu = me.app.getComponent({
            name: 'contextmenu'
          });

          if (!_contextmenu || !_contextmenu.isShow) {
            e.preventDefault();
            var point = e.target.localToGlobal(e.point, me.sprite); //鼠标拖拽移动

            if (e.type == "mousedown") {
              me.induce.toFront();
              _mosedownIng = true;
              me.app.canvax.domView && (me.app.canvax.domView.style.cursor = "move");
              me.zoom.mouseMoveTo(point);
            }

            ;

            if (e.type == "mouseup" || e.type == "mouseout") {
              me.induce.toBack();
              _mosedownIng = false;
              me.app.canvax.domView && (me.app.canvax.domView.style.cursor = _preCursor);
            }

            ;

            if (e.type == "mousemove") {
              if (_mosedownIng) {
                var _me$zoom$move = me.zoom.move(point),
                    x = _me$zoom$move.x,
                    y = _me$zoom$move.y;

                me.graphsView.context.x = parseInt(x);
                me.graphsView.context.y = parseInt(y);
              }
            }

            ; //滚轮缩放

            if (e.type == "wheel") {
              if (Math.abs(e.deltaY) > Math.abs(_deltaY)) {
                _deltaY = e.deltaY;
              }

              ;

              if (!_wheelHandleTimeer) {
                _wheelHandleTimeer = setTimeout(function () {
                  if (me.status.transform.wheelAction == 'offset') {
                    //移动的话用offset,偏移多少像素
                    var _me$zoom$offset = me.zoom.offset({
                      x: -e.deltaX * 2,
                      y: -e.deltaY * 2
                    }),
                        _x = _me$zoom$offset.x,
                        _y = _me$zoom$offset.y; //me.zoom.move( {x:zx, y:zy} );


                    me.graphsView.context.x = _x;
                    me.graphsView.context.y = _y;
                  }

                  if (me.status.transform.wheelAction == 'scale') {
                    // 缩放         
                    var _me$zoom$wheel = me.zoom.wheel(e, point),
                        scale = _me$zoom$wheel.scale,
                        _x2 = _me$zoom$wheel.x,
                        _y2 = _me$zoom$wheel.y;

                    me.graphsView.context.x = _x2;
                    me.graphsView.context.y = _y2;
                    me.graphsView.context.scaleX = scale;
                    me.graphsView.context.scaleY = scale;
                    me.status.transform.scale = scale;
                  }

                  _wheelHandleTimeer = null;
                  _deltaY = 0;
                }, _wheelHandleTimeLen);
              }

              ;
            }

            ;
          }
        }

        ; //induce 的 事件都 在 graph 上面派发，可以用

        e.eventInfo = {
          trigger: me,
          iNode: -1 //TODO:这里设置了的话，会导致多graphs里获取不到别的graphs的nodes信息了
          //nodes : me.getNodesAt( this.iNode ) 

        };
        me.app.fire(e.type, e);
      });
    }
  }, {
    key: "_resetData",
    value: function _resetData(data, dataTrigger) {
      var _this2 = this;

      var me = this;
      this._preData = this.data;
      return new Promise(function (resolve) {
        _this2.initData(data, dataTrigger).then(function (_data) {
          _this2.data = _data;

          _this2.layoutData();

          _.each(_this2._preData.nodes, function (preNode) {
            var nodeData = _.find(me.data.nodes, function (node) {
              return preNode.key == node.key;
            });

            if (!nodeData) {
              me._destroy(preNode);
            } else {
              //如果找到了，要从前面 复制几个属性过来
              nodeData.focused = preNode.focused;
              nodeData.selected = preNode.selected; //TODO:把原来的对象的 contentElement 搞过来， 就可以减少getChild的消耗
              //还有个更加重要的原因，这段代码解决了展开收起的抖动

              if (nodeData.ctype == preNode.ctype) {
                //类型没变， 就可以用同一个 contentElement
                nodeData.contentElement = preNode.contentElement;
              }

              ;
            }
          });

          _.each(_this2._preData.edges, function (preEdge) {
            if (!_.find(me.data.edges, function (edge) {
              return preEdge.key.join('_') == edge.key.join('_');
            })) {
              me._destroy(preEdge);
            }
          });

          _this2.widget();

          if (dataTrigger) {
            var origin = dataTrigger.origin || (dataTrigger.params || {}).origin; //兼容老的配置里面没有params，直接传origin的情况
            //钉住某个node为参考点（不移动)

            if (origin != undefined) {
              var preOriginNode = _.find(_this2._preData.nodes, function (node) {
                return node.key == origin;
              });

              var originNode = _.find(_this2.data.nodes, function (node) {
                return node.key == origin;
              });

              if (preOriginNode && originNode) {
                var offsetPos = {
                  x: parseInt(preOriginNode.x) - parseInt(originNode.x),
                  y: parseInt(preOriginNode.y) - parseInt(originNode.y)
                };

                var _this2$zoom$offset = _this2.zoom.offset(offsetPos),
                    x = _this2$zoom$offset.x,
                    y = _this2$zoom$offset.y;

                me.graphsView.context.x = parseInt(x);
                me.graphsView.context.y = parseInt(y);
              }

              ;
            }

            ;
          }

          ;
          resolve();
        });
      });
    }
  }, {
    key: "_destroy",
    value: function _destroy(item) {}
  }, {
    key: "_drawEdges",
    value: function _drawEdges() {
      var me = this;

      _.each(this.data.edges, function (edge) {
        var key = edge.key.join('_');

        if ((me.line.isTree || edge.isTree) && edge.points.length == 3) {
          //严格树状图的话（三个点），就转化成4个点的，有两个拐点
          me._setTreePoints(edge);
        }

        ;

        var lineShapeOpt = me._getLineShape(edge, me.line.inflectionRadius);

        var type = lineShapeOpt.type;
        var path = lineShapeOpt.path;
        var pointList = lineShapeOpt.pointList;
        var shape = type == 'path' ? Path : BrokenLine;
        var lineWidth = me.getProp(me.line.lineWidth, edge);
        var strokeStyle = me.getProp(me.line.strokeStyle, edge);
        var lineType = me.getProp(me.line.lineType, edge);
        var cursor = me.getProp(me.line.cursor, edge);
        var edgeId = 'edge_' + key;

        var _path = me.edgesSp.getChildById(edgeId);

        if (_path) {
          if (type == 'path') {
            _path.context.path = path;
          }

          if (type == 'brokenLine') {
            _path.context.pointList = pointList;
          }

          _path.context.lineWidth = lineWidth;
          _path.context.strokeStyle = strokeStyle;
          _path.context.lineType = lineType;
        } else {
          var _ctx = {
            lineWidth: lineWidth,
            strokeStyle: strokeStyle,
            lineType: lineType,
            cursor: cursor
          };

          if (type == 'path') {
            _ctx.path = path;
          }

          if (type == 'brokenLine') {
            //_ctx.smooth = true;
            //_ctx.curvature = 0.25;
            _ctx.pointList = pointList;
          }

          _path = new shape({
            id: edgeId,
            context: _ctx
          });

          _path.on(event.types.get(), function (e) {
            var node = this.nodeData;
            node.__no_value = true;
            e.eventInfo = {
              trigger: me.line,
              nodes: [node]
            };
            me.app.fire(e.type, e);
          });

          me.edgesSp.addChild(_path);
        }

        ;
        edge.pathElement = _path;
        _path.nodeData = edge; //edge也是一个node数据

        var arrowControl = edge.points.slice(-2, -1)[0];

        if (me.line.shapeType == "bezier") {
          if (me.rankdir == "TB" || me.rankdir == "BT") {
            arrowControl.x += (edge.source.x - edge.target.x) / 20;
          }

          if (me.rankdir == "LR" || me.rankdir == "RL") {
            arrowControl.y += (edge.source.y - edge.target.y) / 20;
          }
        }

        ;
        var edgeLabelId = 'label_' + key;
        var enabled = me.getProp(me.line.edgeLabel.enabled, edge);

        if (enabled) {
          var textAlign = me.getProp(me.node.content.textAlign, edge);
          var textBaseline = me.getProp(me.node.content.textBaseline, edge);
          var fontSize = me.getProp(me.line.edgeLabel.fontSize, edge);
          var fontColor = me.getProp(me.line.edgeLabel.fontColor, edge); // let offsetX      = me.getProp( me.line.edgeLabel.offsetX    , edge );
          // let offsetY      = me.getProp( me.line.edgeLabel.offsetY    , edge );

          var offset = me.getProp(me.line.icon.offset, edge);

          if (!offset) {
            //default 使用edge.x edge.y 也就是edge label的位置
            offset = {
              x: edge.x,
              y: edge.y
            };
          }

          ;

          var _edgeLabel = me.labelsSp.getChildById(edgeLabelId);

          if (_edgeLabel) {
            _edgeLabel.resetText(edge.content);

            _edgeLabel.context.x = offset.x;
            _edgeLabel.context.y = offset.y;
            _edgeLabel.context.fontSize = fontSize;
            _edgeLabel.context.fillStyle = fontColor;
            _edgeLabel.context.textAlign = textAlign;
            _edgeLabel.context.textBaseline = textBaseline;
          } else {
            _edgeLabel = new _canvax["default"].Display.Text(edge.content, {
              id: edgeLabelId,
              context: {
                x: offset.x,
                y: offset.y,
                fontSize: fontSize,
                fillStyle: fontColor,
                textAlign: textAlign,
                textBaseline: textBaseline
              }
            });

            _edgeLabel.on(event.types.get(), function (e) {
              var node = this.nodeData;
              node.__no_value = true;
              e.eventInfo = {
                trigger: me.line,
                nodes: [node]
              };
              me.app.fire(e.type, e);
            });

            me.labelsSp.addChild(_edgeLabel);
          }

          edge.labelElement = _edgeLabel;
          _edgeLabel.nodeData = edge;
        }

        ;
        var edgeIconEnabled = me.getProp(me.line.icon.enabled, edge);

        if (edgeIconEnabled) {
          var _chartCode = me.getProp(me.line.icon.charCode, edge);

          var charCode = String.fromCharCode(parseInt(_chartCode, 16));

          if (_chartCode != '') {
            var _lineWidth = me.getProp(me.line.icon.lineWidth, edge);

            var _strokeStyle = me.getProp(me.line.icon.strokeStyle, edge);

            var fontFamily = me.getProp(me.line.icon.fontFamily, edge);

            var _fontSize = me.getProp(me.line.icon.fontSize, edge);

            var _fontColor = me.getProp(me.line.icon.fontColor, edge);

            var background = me.getProp(me.line.icon.background, edge);
            var _textAlign = 'center';
            var _textBaseline = 'middle';

            var _offset = me.getProp(me.line.icon.offset, edge);

            var offsetX = me.getProp(me.line.icon.offsetX, edge);
            var offsetY = me.getProp(me.line.icon.offsetY, edge);

            if (!_offset) {
              //default 使用edge.x edge.y 也就是edge label的位置
              _offset = {
                x: parseInt(edge.x) + offsetX,
                y: parseInt(edge.y) + offsetY
              };
            }

            ;
            var _iconBackCtx = {
              x: _offset.x,
              y: _offset.y - 1,
              r: parseInt(_fontSize * 0.5) + 2,
              fillStyle: background,
              strokeStyle: _strokeStyle,
              lineWidth: _lineWidth
            };
            var edgeIconBackId = 'edge_item_icon_back_' + key;

            var _iconBack = me.labelsSp.getChildById(edgeIconBackId);

            if (_iconBack) {
              //_.extend( true, _iconBack.context, _iconBackCtx )
              Object.assign(_iconBack.context, _iconBackCtx);
            } else {
              _iconBack = new Circle({
                id: edgeIconBackId,
                context: _iconBackCtx
              });
              me.labelsSp.addChild(_iconBack);
            }

            ;
            edge.edgeIconBack = _iconBack;
            _iconBack.nodeData = edge;
            var edgeIconId = 'edge_item_icon_' + key;

            var _edgeIcon = me.labelsSp.getChildById(edgeIconId);

            if (_edgeIcon) {
              _edgeIcon.resetText(charCode);

              _edgeIcon.context.x = _offset.x;
              _edgeIcon.context.y = _offset.y;
              _edgeIcon.context.fontSize = _fontSize;
              _edgeIcon.context.fillStyle = _fontColor;
              _edgeIcon.context.textAlign = _textAlign;
              _edgeIcon.context.textBaseline = _textBaseline;
              _edgeIcon.context.fontFamily = fontFamily; //_edgeIcon.context.lineWidth    = lineWidth;
              //_edgeIcon.context.strokeStyle  = strokeStyle;
            } else {
              _edgeIcon = new _canvax["default"].Display.Text(charCode, {
                id: edgeIconId,
                context: {
                  x: _offset.x,
                  y: _offset.y,
                  fillStyle: _fontColor,
                  cursor: 'pointer',
                  fontSize: _fontSize,
                  textAlign: _textAlign,
                  textBaseline: _textBaseline,
                  fontFamily: fontFamily
                }
              });

              _edgeIcon.on(event.types.get(), function (e) {
                var node = this.nodeData;
                node.__no_value = true;
                var trigger = me.line;

                if (me.line.icon['on' + e.type]) {
                  trigger = me.line.icon;
                }

                ;
                e.eventInfo = {
                  trigger: trigger,
                  nodes: [node]
                };
                me.app.fire(e.type, e);
              });

              me.labelsSp.addChild(_edgeIcon);
            }

            edge.edgeIconElement = _edgeIcon;
            _edgeIcon.nodeData = edge;
          }
        }

        ;

        if (me.line.arrow.enabled) {
          var arrowId = "arrow_" + key;

          var _arrow = me.arrowsSp.getChildById(arrowId);

          if (_arrow) {
            //arrow 只监听了x y 才会重绘，，，暂时只能这样处理,手动的赋值control.x control.y
            //而不是直接把 arrowControl 赋值给 control
            _arrow.context.x = me.line.arrow.offsetX;
            _arrow.context.y = me.line.arrow.offsetY;
            _arrow.context.fillStyle = strokeStyle;
            _arrow.context.control.x = arrowControl.x;
            _arrow.context.control.y = arrowControl.y;
            _arrow.context.point = edge.points.slice(-1)[0];
            _arrow.context.strokeStyle = strokeStyle;
            _arrow.context.fillStyle = strokeStyle; // _.extend(true, _arrow, {
            //     control: arrowControl,
            //     point: edge.points.slice(-1)[0],
            //     strokeStyle: strokeStyle
            // } );
          } else {
            _arrow = new Arrow({
              id: arrowId,
              context: {
                x: me.line.arrow.offsetX,
                y: me.line.arrow.offsetY,
                control: arrowControl,
                point: edge.points.slice(-1)[0],
                strokeStyle: strokeStyle,
                fillStyle: strokeStyle
              }
            });
            me.arrowsSp.addChild(_arrow);
          }

          ;
          edge.arrowElement = _arrow;
        }

        ;
      });
    }
  }, {
    key: "_drawNode",
    value: function _drawNode(node) {
      var me = this;
      var shape = Rect;
      var nodeId = "node_" + node.key;
      var cursor = me.node.cursor;

      var _me$_getNodeStyle = me._getNodeStyle(node),
          lineWidth = _me$_getNodeStyle.lineWidth,
          fillStyle = _me$_getNodeStyle.fillStyle,
          strokeStyle = _me$_getNodeStyle.strokeStyle,
          radius = _me$_getNodeStyle.radius,
          shadowOffsetX = _me$_getNodeStyle.shadowOffsetX,
          shadowOffsetY = _me$_getNodeStyle.shadowOffsetY,
          shadowBlur = _me$_getNodeStyle.shadowBlur,
          shadowColor = _me$_getNodeStyle.shadowColor;

      var context = {
        x: parseInt(node.x) - parseInt(node.width / 2),
        y: parseInt(node.y) - parseInt(node.height / 2),
        width: node.width,
        height: node.height,
        cursor: cursor,
        lineWidth: lineWidth,
        fillStyle: fillStyle,
        strokeStyle: strokeStyle,
        radius: radius,
        shadowOffsetX: shadowOffsetX,
        shadowOffsetY: shadowOffsetY,
        shadowBlur: shadowBlur,
        shadowColor: shadowColor
      };

      if (node.shapeType == 'diamond') {
        shape = Diamond;
        context = {
          x: parseInt(node.x),
          y: parseInt(node.y),
          // x: parseInt(node.x) + parseInt(node.width / 2),
          // y: parseInt(node.y) + parseInt(node.height / 2),
          cursor: cursor,
          innerRect: node._innerBound,
          lineWidth: lineWidth,
          fillStyle: fillStyle,
          strokeStyle: strokeStyle,
          shadowOffsetX: shadowOffsetX,
          shadowOffsetY: shadowOffsetY,
          shadowBlur: shadowBlur,
          shadowColor: shadowColor
        };
      }

      ;

      if (node.shapeType == 'underLine') {}

      var _boxShape = me.nodesSp.getChildById(nodeId);

      if (_boxShape) {
        _.extend(_boxShape.context, context);
      } else {
        _boxShape = new shape({
          id: nodeId,
          hoverClone: false,
          context: context
        });
        me.nodesSp.addChild(_boxShape);

        _boxShape.on(event.types.get(), function (e) {
          var node = this.nodeData;
          node.__no_value = true;
          e.eventInfo = {
            trigger: me.node,
            nodes: [node]
          };

          if (me.node.focus.enabled) {
            if (e.type == "mouseover") {
              me.focusAt(this.nodeData);
            }

            if (e.type == "mouseout") {
              me.unfocusAt(this.nodeData);
            }
          }

          ;

          if (me.node.select.enabled && me.node.select.triggerEventType.indexOf(e.type) > -1) {
            //如果开启了图表的选中交互
            //TODO:这里不能
            var onbefore = me.node.select.onbefore;
            var onend = me.node.select.onend;

            if (!onbefore || typeof onbefore == 'function' && onbefore.apply(me, [this.nodeData]) !== false) {
              if (this.nodeData.selected) {
                //说明已经选中了
                me.unselectAt(this.nodeData);
              } else {
                me.selectAt(this.nodeData);
              }

              onend && typeof onend == 'function' && onend.apply(me, [this.nodeData]);
            }
          }

          ;
          me.app.fire(e.type, e);
        });
      }

      ;
      _boxShape.nodeData = node;
      node.shapeElement = _boxShape;

      if (me.node.select.list.indexOf(node.key) > -1) {
        me.selectAt(node);
      }

      ;

      if (node.ctype == "canvas") {
        node.contentElement.context.visible = true;
      }

      ;

      _boxShape.on("transform", function () {
        if (node.ctype == "canvas") {
          node.contentElement.context.x = parseInt(node.x);
          node.contentElement.context.y = parseInt(node.y);
        } else if (node.ctype == "html") {
          var devicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio : 1;

          var contentMatrix = _boxShape.worldTransform.clone();

          contentMatrix = contentMatrix.scale(1 / devicePixelRatio, 1 / devicePixelRatio);
          node.contentElement.style.transform = "matrix(" + contentMatrix.toArray().join() + ")";
          node.contentElement.style.transformOrigin = "left top"; //修改为左上角为旋转中心点来和canvas同步

          if (node.shapeType == 'diamond') {
            node.contentElement.style.left = -parseInt((node.width - node._innerBound.width) / 2 * me.status.transform.scale) + "px";
            node.contentElement.style.top = -parseInt((node.height - node._innerBound.height) / 2 * me.status.transform.scale) + "px";
          }

          ;
          node.contentElement.style.visibility = "visible";
        }

        ;
      });
    }
  }, {
    key: "_getNodeStyle",
    value: function _getNodeStyle(nodeData, targetPath) {
      var me = this;

      var radius = _.flatten([me.getProp(me.node.radius, nodeData)]);

      var target = me.node;

      if (targetPath == 'select') {
        target = me.node.select;
      }

      if (targetPath == 'focus') {
        target = me.node.focus;
      }

      var lineWidth = me.getProp(target.lineWidth, nodeData);
      var fillStyle = me.getProp(target.fillStyle, nodeData);
      var strokeStyle = me.getProp(target.strokeStyle, nodeData);
      var shadowOffsetX = me.getProp(target.shadow.shadowOffsetX, nodeData);
      var shadowOffsetY = me.getProp(target.shadow.shadowOffsetY, nodeData);
      var shadowBlur = me.getProp(target.shadow.shadowBlur, nodeData);
      var shadowColor = me.getProp(target.shadow.shadowColor, nodeData);
      return {
        lineWidth: lineWidth,
        fillStyle: fillStyle,
        strokeStyle: strokeStyle,
        radius: radius,
        shadowOffsetX: shadowOffsetX,
        shadowOffsetY: shadowOffsetY,
        shadowBlur: shadowBlur,
        shadowColor: shadowColor
      };
    }
  }, {
    key: "_setNodeStyle",
    value: function _setNodeStyle(nodeData, targetPath) {
      var _this$_getNodeStyle = this._getNodeStyle(nodeData, targetPath),
          lineWidth = _this$_getNodeStyle.lineWidth,
          fillStyle = _this$_getNodeStyle.fillStyle,
          strokeStyle = _this$_getNodeStyle.strokeStyle,
          shadowOffsetX = _this$_getNodeStyle.shadowOffsetX,
          shadowOffsetY = _this$_getNodeStyle.shadowOffsetY,
          shadowBlur = _this$_getNodeStyle.shadowBlur,
          shadowColor = _this$_getNodeStyle.shadowColor;

      if (nodeData.shapeElement && nodeData.shapeElement.context) {
        var ctx = nodeData.shapeElement.context;
        ctx.lineWidth = lineWidth;
        ctx.fillStyle = fillStyle;
        ctx.strokeStyle = strokeStyle;
        ctx.shadowOffsetX = shadowOffsetX;
        ctx.shadowOffsetY = shadowOffsetY;
        ctx.shadowBlur = shadowBlur;
        ctx.shadowColor = shadowColor;
      }
    }
  }, {
    key: "focusAt",
    value: function focusAt(key) {
      var nodeData = this.getNodeDataAt(key);

      if (nodeData) {
        !nodeData.selected && this._setNodeStyle(nodeData, 'focus');
        nodeData.focused = true;
      }
    }
  }, {
    key: "unfocusAt",
    value: function unfocusAt(key) {
      var nodeData = this.getNodeDataAt(key);

      if (nodeData) {
        !nodeData.selected && this._setNodeStyle(nodeData);
        nodeData.focused = false;
      }
    }
  }, {
    key: "selectAt",
    value: function selectAt(key) {
      var nodeData = this.getNodeDataAt(key);

      if (nodeData) {
        this._setNodeStyle(nodeData, 'select');

        nodeData.selected = true;

        if (this.node.select.list.indexOf(nodeData.key) == -1) {
          this.node.select.list.push(nodeData.key);
        }
      }
    }
  }, {
    key: "selectAll",
    value: function selectAll() {
      var _this3 = this;

      this.data.nodes.forEach(function (nodeData) {
        _this3.selectAt(nodeData);
      });
    }
  }, {
    key: "unselectAt",
    value: function unselectAt(key) {
      var nodeData = this.getNodeDataAt(key);

      if (nodeData) {
        nodeData.focused ? this._setNodeStyle(nodeData, 'focus') : this._setNodeStyle(nodeData);
        nodeData.selected = false;
        var selectedKeyInd = this.node.select.list.indexOf(nodeData.key);

        if (selectedKeyInd > -1) {
          this.node.select.list.splice(selectedKeyInd, 1);
        }
      }
    }
  }, {
    key: "unselectAll",
    value: function unselectAll() {
      var _this4 = this;

      this.data.nodes.forEach(function (nodeData) {
        _this4.unselectAt(nodeData);
      });
    }
  }, {
    key: "getNodeDataAt",
    value: function getNodeDataAt(key) {
      if (key.type && (key.type == "relation" || key.type == "tree")) {
        return key;
      }

      ;

      if (typeof key == 'string') {
        var keys = key.split(',');

        if (keys.length == 1) {
          return this.data.nodes.find(function (item) {
            return item.key == key;
          });
        }

        if (keys.length == 2) {
          return this.data.edges.find(function (item) {
            return item.key.join() == keys.join();
          });
        }
      }

      ;
    }
  }, {
    key: "_setTreePoints",
    value: function _setTreePoints(edge) {
      var points = edge.points;

      if (this.rankdir == "TB" || this.rankdir == "BT") {
        points[0] = {
          x: edge.source.x,
          y: edge.source.y + (this.rankdir == "BT" ? -1 : 1) * edge.source.height / 2
        };
        points.splice(1, 0, {
          x: edge.source.x,
          y: points.slice(-2, -1)[0].y
        });
      }

      if (this.rankdir == "LR" || this.rankdir == "RL") {
        var yDiff = parseInt(edge.source.shapeType == 'underLine' ? edge.source.height / 2 : 0);
        var xDiff = parseInt(edge.source.shapeType == 'underLine' ? collapseIconWidth : 0);
        var dir = this.rankdir == "RL" ? -1 : 1;
        points[0] = {
          x: parseInt(edge.source.x) + parseInt(dir * (edge.source.width / 2)) + dir * xDiff,
          y: parseInt(edge.source.y) + yDiff
        };
        points.splice(1, 0, {
          x: points.slice(-2, -1)[0].x,
          y: parseInt(edge.source.y) + yDiff
        });
      }

      edge.points = points;
    }
    /**
     * 
     * @param {shapeType,points} edge 
     * @param {number} inflectionRadius 拐点的圆角半径
     */

  }, {
    key: "_getLineShape",
    value: function _getLineShape(edge, inflectionRadius) {
      var points = edge.points;
      var line = {
        type: 'path',
        // pah or brokenLine
        pointList: null,
        path: str
      };
      var head = points[0];
      var tail = points.slice(-1)[0];
      var str = "M" + head.x + " " + head.y;

      if (edge.shapeType == "bezier") {
        if (points.length == 3) {
          str += ",Q" + points[1].x + " " + points[1].y + " " + tail.x + " " + tail.y;
        }

        if (points.length == 4) {
          str += ",C" + points[1].x + " " + points[1].y + " " + points[2].x + " " + points[2].y + " " + tail.x + " " + tail.y;
        }

        if (points.length >= 5) {
          line.type = 'brokenLine';
          line.pointList = points.map(function (item) {
            return [item.x, item.y];
          });
          return line;
        }
      }

      ;

      if (edge.shapeType == "brokenLine") {
        _.each(points, function (point, i) {
          if (i) {
            if (inflectionRadius && i < points.length - 1) {
              //圆角连线
              var prePoint = points[i - 1];
              var nextPoint = points[i + 1]; //要从这个点到上个点的半径距离，已point为控制点，绘制nextPoint的半径距离

              var radius = inflectionRadius; //radius要做次二次校验，取radius 以及 point 和prePoint距离以及和 nextPoint 的最小值
              //let _disPre = Math.abs(Math.sqrt( (prePoint.x - point.x)*(prePoint.x - point.x) + (prePoint.y - point.y)*(prePoint.y - point.y) ));
              //let _disNext = Math.abs(Math.sqrt( (nextPoint.x - point.x)*(nextPoint.x - point.x) + (nextPoint.y - point.y)*(nextPoint.y - point.y) ));

              var _disPre = Math.max(Math.abs(prePoint.x - point.x) / 2, Math.abs(prePoint.y - point.y) / 2);

              var _disNext = Math.max(Math.abs(nextPoint.x - point.x) / 2, Math.abs(nextPoint.y - point.y) / 2);

              radius = _.min([radius, _disPre, _disNext]); //console.log(Math.atan2( point.y - prePoint.y , point.x - prePoint.x ),Math.atan2( nextPoint.y - point.y , nextPoint.x - point.x ))

              if (point.x == prePoint.x && point.y == prePoint.y || point.x == nextPoint.x && point.y == nextPoint.y || Math.atan2(point.y - prePoint.y, point.x - prePoint.x) == Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x)) {
                //如果中间的这个点 ， 和前后的点在一个直线上面，就略过
                return;
              } else {
                var getPointOf = function getPointOf(p) {
                  var _atan2 = Math.atan2(p.y - point.y, p.x - point.x);

                  return {
                    x: point.x + radius * Math.cos(_atan2),
                    y: point.y + radius * Math.sin(_atan2)
                  };
                };

                ;
                var bezierBegin = getPointOf(prePoint);
                var bezierEnd = getPointOf(nextPoint);
                str += ",L" + bezierBegin.x + " " + bezierBegin.y + ",Q" + point.x + " " + point.y + " " + bezierEnd.x + " " + bezierEnd.y;
              }
            } else {
              //直角连线
              str += ",L" + point.x + " " + point.y;
            }

            ;
          }
        });
      }

      ;

      if (edge.target.shapeType == 'underLine') {
        var x = parseInt(edge.target.x) + parseInt(edge.target.width / 2);
        var childrenField = this.childrenField;

        if (edge.target.rowData.__originData[childrenField] && edge.target.rowData.__originData[childrenField].length) {
          x += collapseIconWidth;
        }

        ;
        str += ",L" + x + " " + (parseInt(edge.target.y) + parseInt(edge.target.height / 2));
      }

      ;
      line.path = str; //str += "z"

      return line;
    }
    /**
     * 字符串是否含有html标签的检测
     */

  }, {
    key: "_checkHtml",
    value: function _checkHtml(str) {
      var reg = /<[^>]+>/g;
      return reg.test(str);
    }
  }, {
    key: "_getContent",
    value: function _getContent(rowData) {
      var me = this;

      var _c; //this.node.content;


      var field = this.node.content.field;

      if (this._isField(field)) {
        _c = rowData[field];
      }

      ;

      if (me.node.content.format && _.isFunction(me.node.content.format)) {
        _c = me.node.content.format.apply(this, [_c, rowData]);
      } else {
        //否则用fieldConfig上面的
        var _coord = me.app.getComponent({
          name: 'coord'
        });

        var fieldConfig = _coord.getFieldConfig(field);

        if (fieldConfig) {
          _c = fieldConfig.getFormatValue(_c);
        }

        ;
      }

      return _c;
    }
  }, {
    key: "_isField",
    value: function _isField(str) {
      return ~this.dataFrame.fields.indexOf(str);
    }
  }, {
    key: "_getEleAndsetCanvasSize",
    value: function _getEleAndsetCanvasSize(node) {
      var _this5 = this;

      var me = this;
      return new Promise(function (resolve) {
        var content = node.content;
        var width = me.getProp(me.node.width, node);

        if (!width && node.width) {
          width = node.width;
        }

        var height = me.getProp(me.node.height, node);

        if (!height && node.height) {
          height = node.height;
        }

        var fontColor = me.getProp(me.node.content.fontColor, node);

        if (node.rowData.fontColor) {
          fontColor = node.rowData.fontColor;
        }

        if (node.rowData.style && node.rowData.style.fontColor) {
          fontColor = node.rowData.style.fontColor;
        }

        var context = {
          fillStyle: fontColor,
          textAlign: me.getProp(me.node.content.textAlign, node),
          textBaseline: me.getProp(me.node.content.textBaseline, node),
          fontSize: me.getProp(me.node.content.fontSize, node)
        };
        var contentLabelId = "content_label_" + node.key;

        var _contentLabel = node.contentElement || me.nodesContentSp.getChildById(contentLabelId);

        if (_contentLabel) {
          //已经存在的label
          _contentLabel.resetText(content);

          _.extend(_contentLabel.context, context);
        } else {
          //新创建text，根据 text 来计算node需要的width和height
          _contentLabel = new _canvax["default"].Display.Text(content, {
            id: contentLabelId,
            context: context
          });
          _contentLabel.context.visible = false;

          if (!_.isArray(node.key)) {
            me.nodesContentSp.addChild(_contentLabel);
          }

          ;
        }

        ;
        var inited;

        if (_this5.node.content.init && typeof _this5.node.content.init === 'function') {
          inited = _this5.node.content.init(node, _contentLabel);
        }

        ;

        if (inited && typeof inited.then == 'function') {
          inited.then(function () {
            if (!width) {
              width = _contentLabel.getTextWidth() + me.getProp(me.node.padding, node) * me.status.transform.scale * 2;
            }

            ;

            if (!height) {
              height = _contentLabel.getTextHeight() + me.getProp(me.node.padding, node) * me.status.transform.scale * 2;
            }

            ;
            resolve({
              contentElement: _contentLabel,
              width: parseInt(width),
              height: parseInt(height)
            });
          });
        } else {
          if (!width) {
            width = _contentLabel.getTextWidth() + me.getProp(me.node.padding, node) * me.status.transform.scale * 2;
          }

          ;

          if (!height) {
            height = _contentLabel.getTextHeight() + me.getProp(me.node.padding, node) * me.status.transform.scale * 2;
          }

          ;
          resolve({
            contentElement: _contentLabel,
            width: parseInt(width),
            height: parseInt(height)
          });
        }
      });
    }
  }, {
    key: "_getEleAndsetHtmlSize",
    value: function _getEleAndsetHtmlSize(node) {
      var _this6 = this;

      var me = this;
      return new Promise(function (resolve) {
        var content = node.content;
        var width = me.getProp(me.node.width, node);

        if (!width && me.node.rowData && node.rowData.width) {
          width = node.rowData.width;
        }

        var height = me.getProp(me.node.height, node);

        if (!height && me.node.rowData && node.rowData.height) {
          height = node.rowData.height;
        }

        var contentLabelClass = "__content_label_" + node.key;

        var _dom = node.contentElement || _this6.domContainer.getElementsByClassName(contentLabelClass)[0];

        if (!_dom) {
          _dom = document.createElement("div");
          _dom.className = "chartx_relation_node " + contentLabelClass;
          _dom.style.cssText += "; position:absolute;visibility:hidden;";

          _this6.domContainer.appendChild(_dom);
        } // else {
        //     _dom = _dom[0]
        // };


        _dom.style.cssText += "; color:" + me.getProp(me.node.content.fontColor, node) + ";";
        _dom.style.cssText += "; text-align:" + me.getProp(me.node.content.textAlign, node) + ";";
        _dom.style.cssText += "; vertical-align:" + me.getProp(me.node.content.textBaseline, node) + ";"; //TODO 这里注释掉， 就让dom自己内部去控制padding吧
        //_dom.style.cssText += "; padding:"+me.getProp(me.node.padding, node)+"px;"; 

        _dom.innerHTML = content;
        var inited;

        if (_this6.node.content.init && typeof _this6.node.content.init === 'function') {
          inited = _this6.node.content.init(node, _dom);
        }

        ;

        if (inited && typeof inited.then == 'function') {
          inited.then(function (opt) {
            if (!width) {
              width = _dom.offsetWidth; // + me.getProp(me.node.padding, node) * me.status.transform.scale * 2;
            }

            ;

            if (!height) {
              height = _dom.offsetHeight; // + me.getProp(me.node.padding, node) * me.status.transform.scale * 2;
            }

            ;
            resolve({
              contentElement: _dom,
              width: parseInt(width),
              height: parseInt(height)
            });
          });
        } else {
          if (!width) {
            width = _dom.offsetWidth; // + me.getProp(me.node.padding, node) * me.status.transform.scale * 2;
          }

          ;

          if (!height) {
            height = _dom.offsetHeight; // + me.getProp(me.node.padding, node) * me.status.transform.scale * 2;
          }

          ;
          resolve({
            contentElement: _dom,
            width: parseInt(width),
            height: parseInt(height)
          });
        }

        ;
      });
    }
  }, {
    key: "getNodesAt",
    value: function getNodesAt() {}
  }, {
    key: "getProp",
    value: function getProp(prop, nodeData) {
      var _prop = prop;

      if (this._isField(prop)) {
        _prop = nodeData.rowData[prop];
      } else {
        if (_.isArray(prop)) {
          _prop = prop[nodeData.iNode];
        }

        ;

        if (_.isFunction(prop)) {
          _prop = prop.apply(this, [nodeData]);
        }

        ;
      }

      ;
      return _prop;
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
        //rankdir: "TB",
        //align: "DR",
        //nodesep: 0,//同级node之间的距离
        //edgesep: 0,
        //ranksep: 0, //排与排之间的距离
        rankdir: {
          detail: '布局方向',
          "default": null
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
            shapeType: {
              detail: '节点图形，支持rect,diamond,underLine(adc用)',
              "default": 'rect'
            },
            maxWidth: {
              detail: '节点最大的width',
              "default": 200
            },
            cursor: {
              detail: '节点的鼠标样式',
              "default": 'pointer'
            },
            width: {
              detail: '节点的width,默认null（系统自动计算）, 也可以是个function，用户来计算每一个节点的width',
              "default": null
            },
            height: {
              detail: '节点的height,默认null（系统自动计算）, 也可以是个function，用户来计算每一个节点的height',
              "default": null
            },
            radius: {
              detail: '圆角角度，对rect生效',
              "default": 4
            },
            includedAngle: {
              detail: 'shapeType为diamond(菱形)的时候生效,x方向的夹角',
              "default": 60
            },
            fillStyle: {
              detail: '节点背景色',
              "default": '#ffffff'
            },
            lineWidth: {
              detail: '描边宽度',
              "default": 1
            },
            strokeStyle: {
              detail: '描边颜色',
              "default": '#e5e5e5'
            },
            shadow: {
              detail: '阴影设置',
              propertys: {
                shadowOffsetX: {
                  detail: 'x偏移量',
                  "default": 0
                },
                shadowOffsetY: {
                  detail: 'y偏移量',
                  "default": 0
                },
                shadowBlur: {
                  detail: '阴影模糊值',
                  "default": 0
                },
                shadowColor: {
                  detail: '阴影颜色',
                  "default": '#000000'
                }
              }
            },
            select: {
              detail: '选中效果',
              propertys: {
                enabled: {
                  detail: '是否开启选中',
                  "default": false
                },
                list: {
                  detail: '选中的node.key的集合,外部传入可以选中',
                  "default": []
                },
                triggerEventType: {
                  detail: '触发事件',
                  "default": 'click,tap'
                },
                shadow: {
                  detail: '选中效果的阴影设置',
                  propertys: {
                    shadowOffsetX: {
                      detail: 'x偏移量',
                      "default": 0
                    },
                    shadowOffsetY: {
                      detail: 'y偏移量',
                      "default": 0
                    },
                    shadowBlur: {
                      detail: '阴影模糊值',
                      "default": 0
                    },
                    shadowColor: {
                      detail: '阴影颜色',
                      "default": '#000000'
                    }
                  }
                },
                fillStyle: {
                  detail: 'hover节点背景色',
                  "default": '#ffffff'
                },
                lineWidth: {
                  detail: 'hover描边宽度',
                  "default": 1
                },
                strokeStyle: {
                  detail: 'hover描边颜色',
                  "default": '#e5e5e5'
                },
                onbefore: {
                  detail: '执行select处理函数的前处理函数，返回false则取消执行select',
                  "default": null
                },
                onend: {
                  detail: '执行select处理函数的后处理函数',
                  "default": null
                },
                content: {
                  detail: '选中后节点内容配置',
                  propertys: {
                    fontColor: {
                      detail: '内容文本颜色',
                      "default": '#666'
                    },
                    fontSize: {
                      detail: '内容文本大小（在canvas格式下有效）',
                      "default": 14
                    },
                    format: {
                      detail: '内容格式化处理函数',
                      "default": null
                    }
                  }
                }
              }
            },
            focus: {
              detail: 'hover效果',
              propertys: {
                enabled: {
                  detail: '是否开启hover效果',
                  "default": false
                },
                shadow: {
                  detail: '选中效果的阴影设置',
                  propertys: {
                    shadowOffsetX: {
                      detail: 'x偏移量',
                      "default": 0
                    },
                    shadowOffsetY: {
                      detail: 'y偏移量',
                      "default": 0
                    },
                    shadowBlur: {
                      detail: '阴影模糊值',
                      "default": 0
                    },
                    shadowColor: {
                      detail: '阴影颜色',
                      "default": '#000000'
                    }
                  }
                },
                fillStyle: {
                  detail: 'hover节点背景色',
                  "default": '#ffffff'
                },
                content: {
                  detail: 'hover后节点内容配置',
                  propertys: {
                    fontColor: {
                      detail: '内容文本颜色',
                      "default": '#666'
                    },
                    fontSize: {
                      detail: '内容文本大小（在canvas格式下有效）',
                      "default": 14
                    },
                    format: {
                      detail: '内容格式化处理函数',
                      "default": null
                    }
                  }
                },
                lineWidth: {
                  detail: 'hover描边宽度',
                  "default": 1
                },
                strokeStyle: {
                  detail: 'hover描边颜色',
                  "default": '#e5e5e5'
                }
              }
            },
            padding: {
              detail: 'node节点容器到内容的边距,节点内容是canvas的时候生效，dom节点不生效',
              "default": 10
            },
            content: {
              detail: '节点内容配置',
              propertys: {
                field: {
                  detail: '内容字段',
                  documentation: '默认content字段',
                  "default": 'content'
                },
                fontColor: {
                  detail: '内容文本颜色',
                  "default": '#666'
                },
                fontSize: {
                  detail: '内容文本大小（在canvas格式下有效）',
                  "default": 14
                },
                format: {
                  detail: '内容格式化处理函数',
                  "default": null
                },
                textAlign: {
                  detail: "textAlign",
                  "default": "center"
                },
                textBaseline: {
                  detail: 'textBaseline',
                  "default": "middle"
                },
                init: {
                  detail: '内容节点的初始化完成回调',
                  documentation: '在节点内容配置为需要异步完成的时候，比如节点内容配置为一个magix的view',
                  "default": null
                }
              }
            }
          }
        },
        line: {
          detail: '两个节点连线配置',
          propertys: {
            isTree: {
              detail: '是否树结构的连线',
              documentation: '非树结构启用该配置可能会有意想不到的惊喜，慎用',
              "default": false
            },
            inflectionRadius: {
              detail: '树状连线的拐点圆角半径',
              "default": 0
            },
            shapeType: {
              detail: '连线的图形样式 brokenLine or bezier',
              "default": 'bezier'
            },
            lineWidth: {
              detail: '线宽',
              "default": 1
            },
            strokeStyle: {
              detail: '连线的颜色',
              "default": '#e5e5e5'
            },
            lineType: {
              detail: '连线样式（虚线等）',
              "default": 'solid'
            },
            arrow: {
              detail: '连线箭头配置',
              propertys: {
                enabled: {
                  detail: '是否开启arrow设置',
                  "default": true
                },
                offsetX: {
                  detail: 'x方向偏移',
                  "default": 0
                },
                offsetY: {
                  detail: 'y方向偏移',
                  "default": 0
                }
              }
            },
            edgeLabel: {
              detail: '连线上面的label配置',
              propertys: {
                enabled: {
                  detail: '是否开启label设置',
                  "default": true
                },
                fontColor: {
                  detail: '文本颜色',
                  "default": '#ccc'
                },
                fontSize: {
                  detail: '文本大小',
                  "default": 12
                },
                // offsetX: {
                //     detail: 'x方向偏移量',
                //     default:0
                // },
                // offsetY: {
                //     detail: 'y方向偏移量',
                //     default:0
                // },
                offset: {
                  detail: 'label的位置，函数，参数是整个edge对象',
                  "default": null
                }
              }
            },
            icon: {
              detail: '连线上面的操作icon',
              propertys: {
                enabled: {
                  detail: '是否开启线上的icon设置',
                  "default": false
                },
                charCode: {
                  detail: 'iconfont上面对应的unicode中&#x后面的字符',
                  "default": null
                },
                lineWidth: {
                  detail: 'icon描边线宽',
                  "default": 1
                },
                strokeStyle: {
                  detail: 'icon的描边颜色',
                  "default": '#e5e5e5'
                },
                fontColor: {
                  detail: 'icon的颜色',
                  "default": '#e5e5e5'
                },
                fontFamily: {
                  detail: 'font-face的font-family设置',
                  "default": 'iconfont'
                },
                fontSize: {
                  detail: 'icon的字体大小',
                  "default": 14
                },
                offset: {
                  detail: 'icon的位置，函数，参数是整个edge对象',
                  "default": null
                },
                offsetX: {
                  detail: '在计算出offset后的X再次便宜量',
                  "default": 1
                },
                offsetY: {
                  detail: '在计算出offset后的Y再次便宜量',
                  "default": 2
                },
                background: {
                  detail: 'icon的背景颜色，背景为圆形',
                  "default": "#fff"
                }
              }
            },
            cursor: 'default'
          }
        },
        status: {
          detail: '一些开关配置',
          propertys: {
            transform: {
              detail: "是否启动拖拽缩放整个画布",
              propertys: {
                fitView: {
                  detail: "自动缩放",
                  "default": '' //autoZoom

                },
                enabled: {
                  detail: "是否开启",
                  "default": true
                },
                scale: {
                  detail: "缩放值",
                  "default": 1
                },
                scaleOrigin: {
                  detail: "缩放原点",
                  "default": {
                    x: 0,
                    y: 0
                  }
                },
                wheelAction: {
                  detail: "滚轮触屏滑动触发的行为，可选有scale和offset，默认offset",
                  "default": "offset"
                }
              }
            }
          }
        } //可以在这里注册所有的事件监听，会从induce上面派发

      };
    }
  }]);
  return RelationBase;
}(_index["default"]);

var _default = RelationBase;
exports["default"] = _default;