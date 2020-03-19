"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _canvax = _interopRequireDefault(require("canvax"));

var _index = _interopRequireDefault(require("../index"));

var _global = _interopRequireDefault(require("../../../global"));

var _dataFrame = _interopRequireDefault(require("../../../core/dataFrame"));

var _tools = require("../../../utils/tools");

var _data = require("./data");

var _zoom = _interopRequireDefault(require("./zoom"));

var _index2 = _interopRequireDefault(require("../../../layout/dagre/index"));

var _ = _canvax["default"]._,
    event = _canvax["default"].event;
var Rect = _canvax["default"].Shapes.Rect;
var Path = _canvax["default"].Shapes.Path;
var Circle = _canvax["default"].Shapes.Circle;
var Arrow = _canvax["default"].Shapes.Arrow;
/**
 * 关系图中 包括了  配置，数据，和布局数据，
 * 默认用配置和数据可以完成绘图， 但是如果有布局数据，就绘图玩额外调用一次绘图，把布局数据传入修正布局效果
 */

var Relation =
/*#__PURE__*/
function (_GraphsBase) {
  (0, _inherits2["default"])(Relation, _GraphsBase);
  (0, _createClass2["default"])(Relation, null, [{
    key: "defaultProps",
    value: function defaultProps() {
      return {
        field: {
          detail: 'key字段设置',
          documentation: '',
          "default": null
        },
        childrenField: {
          detail: '树结构数据的关联字段',
          documentation: '如果是树结构的关联数据，不是行列式，那么就通过这个字段来建立父子关系',
          "default": 'children'
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
        node: {
          detail: '单个节点的配置',
          propertys: {
            shapeType: {
              detail: '节点图形，目前只支持rect',
              "default": 'rect'
            },
            maxWidth: {
              detail: '节点最大的width',
              "default": 200
            },
            width: {
              detail: '内容的width',
              "default": null
            },
            height: {
              detail: '内容的height',
              "default": null
            },
            radius: {
              detail: '圆角角度',
              "default": 6
            },
            fillStyle: {
              detail: '节点背景色',
              "default": '#ffffff'
            },
            strokeStyle: {
              detail: '描边颜色',
              "default": '#e5e5e5'
            },
            padding: {
              detail: 'node节点容器到内容的边距',
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
              detail: '是否有箭头',
              "default": true
            }
          }
        },
        layout: {
          detail: '采用的布局引擎,比如dagre',
          "default": "dagre"
        },
        layoutOpts: {
          detail: '布局引擎对应的配置,dagre详见dagre的官方wiki',
          propertys: {}
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
                }
              }
            }
          }
        }
      };
    }
  }]);

  function Relation(opt, app) {
    var _this;

    (0, _classCallCheck2["default"])(this, Relation);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Relation).call(this, opt, app));
    _this.type = "relation";

    _.extend(true, (0, _assertThisInitialized2["default"])(_this), (0, _tools.getDefaultProps)(Relation.defaultProps()), opt);

    if (_this.layout === 'dagre') {
      var dagreOpts = {
        graph: {
          rankdir: 'TB',
          nodesep: 10,
          ranksep: 10,
          edgesep: 10,
          acyclicer: "greedy"
        },
        node: {},
        edge: {
          labelpos: 'c' //labeloffset: 0

        }
      };

      _.extend(true, dagreOpts, _this.layoutOpts);

      _.extend(true, _this.layoutOpts, dagreOpts);

      if (!_this.rankdir) {
        _this.rankdir = _this.layoutOpts.graph.rankdir;
      } else {
        //如果有设置this.randdir 则已经 ta 为准
        _this.layoutOpts.graph.rankdir = _this.rankdir;
      }

      ;
    }

    ;
    _this.domContainer = app.canvax.domView;
    _this.induce = null;

    _this.init();

    return _this;
  }

  (0, _createClass2["default"])(Relation, [{
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
      var _preCursor = me.app.canvax.domView.style.cursor; //滚轮缩放相关

      var _wheelHandleTimeLen = 32; //16*2

      var _wheelHandleTimeer = null;
      var _deltaY = 0;
      this.induce.on(event.types.get(), function (e) {
        if (me.status.transform.enabled) {
          e.preventDefault();
          var point = e.target.localToGlobal(e.point, me.sprite);

          if (e.type == "mousedown") {
            me.induce.toFront();
            _mosedownIng = true;
            me.app.canvax.domView.style.cursor = "move";
            me.zoom.mouseMoveTo(point);
          }

          ;

          if (e.type == "mouseup" || e.type == "mouseout") {
            me.induce.toBack();
            _mosedownIng = false;
            me.app.canvax.domView.style.cursor = _preCursor;
          }

          ;

          if (e.type == "mousemove") {
            if (_mosedownIng) {
              var _me$zoom$move = me.zoom.move(point),
                  x = _me$zoom$move.x,
                  y = _me$zoom$move.y;

              me.graphsView.context.x = x;
              me.graphsView.context.y = y;
            }
          }

          ;

          if (e.type == "wheel") {
            if (Math.abs(e.deltaY) > Math.abs(_deltaY)) {
              _deltaY = e.deltaY;
            }

            ;

            if (!_wheelHandleTimeer) {
              _wheelHandleTimeer = setTimeout(function () {
                var _me$zoom$wheel = me.zoom.wheel(e, point),
                    scale = _me$zoom$wheel.scale,
                    x = _me$zoom$wheel.x,
                    y = _me$zoom$wheel.y;

                me.graphsView.context.x = x;
                me.graphsView.context.y = y;
                me.graphsView.context.scaleX = scale;
                me.graphsView.context.scaleY = scale;
                me.status.transform.scale = scale;
                _wheelHandleTimeer = null;
                _deltaY = 0;
              }, _wheelHandleTimeLen);
            }

            ;
          }

          ;
        }

        ;
      });
    } //全局画布

  }, {
    key: "scale",
    value: function scale(_scale, globalScaleOrigin) {}
  }, {
    key: "draw",
    value: function draw(opt) {
      !opt && (opt = {});

      _.extend(true, this, opt);

      this.data = opt.data || this._initData();

      this._layoutData();

      this.widget();
      this.sprite.context.x = this.origin.x;
      this.sprite.context.y = this.origin.y;

      var _offsetLeft = (this.width - this.data.size.width) / 2;

      if (_offsetLeft < 0) {
        _offsetLeft = 0;
      }

      ;

      var _offsetTop = (this.height - this.data.size.height) / 2;

      if (_offsetTop < 0) {
        _offsetTop = 0;
      }

      ;
      this.graphsSp.context.x = _offsetLeft;
      this.graphsSp.context.y = _offsetTop;
    } //如果dataTrigger.origin 有传入， 则已经这个origin为参考点做重新布局

  }, {
    key: "resetData",
    value: function resetData(data, dataTrigger) {
      var me = this;
      this._preData = this.data; //如果data是外界定义好的nodes，edges的格式，直接用外界的

      this.data = data.nodes && data.edges ? data : this._initData();

      this._layoutData();

      _.each(this._preData.nodes, function (preNode) {
        if (!_.find(me.data.nodes, function (node) {
          return preNode.key == node.key;
        })) {
          me._destroy(preNode);
        }
      });

      _.each(this._preData.edges, function (preEdge) {
        if (!_.find(me.data.edges, function (edge) {
          return preEdge.key.join('_') == edge.key.join('_');
        })) {
          me._destroy(preEdge);
        }
      });

      this.widget(); //钉住某个node为参考点（不移动）

      if (dataTrigger && dataTrigger.origin) {
        var preOriginNode = _.find(this._preData.nodes, function (node) {
          return node.key == dataTrigger.origin;
        });

        var originNode = _.find(this.data.nodes, function (node) {
          return node.key == dataTrigger.origin;
        });

        if (preOriginNode && originNode) {
          var offsetPos = {
            x: preOriginNode.x - originNode.x,
            y: preOriginNode.y - originNode.y
          };

          var _this$zoom$offset = this.zoom.offset(offsetPos),
              x = _this$zoom$offset.x,
              y = _this$zoom$offset.y;

          me.graphsView.context.x = x;
          me.graphsView.context.y = y;
        }

        ;
      }
    }
  }, {
    key: "_destroy",
    value: function _destroy(item) {
      item.boxElement && item.boxElement.destroy();

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
    }
  }, {
    key: "_initData",
    value: function _initData() {
      var data = {
        nodes: [//{ type,key,content,ctype,width,height,x,y }
        ],
        edges: [//{ type,key[],content,ctype,width,height,x,y }
        ],
        size: {
          width: 0,
          height: 0
        }
      };
      var originData = this.app._data;

      if ((0, _data.checkDataIsJson)(originData, this.field, this.childrenField)) {
        this.jsonData = (0, _data.jsonToArrayForRelation)(originData, this, this.childrenField);
        this.dataFrame = this.app.dataFrame = (0, _dataFrame["default"])(this.jsonData);
      } else {
        if (this.layout == "tree") {
          //源数据就是图表标准数据，只需要转换成json的Children格式
          //app.dataFrame.jsonOrg ==> [{name: key:} ...] 不是children的树结构
          //tree layout算法需要children格式的数据，蛋疼
          this.jsonData = (0, _data.arrayToTreeJsonForRelation)(this.app.dataFrame.jsonOrg, this);
        }

        ;
      }

      ;
      var _nodeMap = {};

      for (var i = 0; i < this.dataFrame.length; i++) {
        var rowData = this.dataFrame.getRowDataAt(i);

        var fields = _.flatten([(rowData[this.field] + "").split(",")]);

        var content = this._getContent(rowData);

        var node = {
          type: "relation",
          iNode: i,
          rowData: rowData,
          key: fields.length == 1 ? fields[0] : fields,
          content: content,
          ctype: this._checkHtml(content) ? 'html' : 'canvas',
          //下面三个属性在_setElementAndSize中设置
          contentElement: null,
          //外面传的layout数据可能没有element，widget的时候要检测下
          width: null,
          height: null,
          //这个在layout的时候设置
          x: null,
          y: null,
          shapeType: null,
          //如果是edge，要填写这两节点
          source: null,
          target: null
        };

        _.extend(node, this._getElementAndSize(node));

        if (fields.length == 1) {
          // isNode
          node.shapeType = this.getProp(this.node.shapeType, node);
          data.nodes.push(node);
          Object.assign(node, this.layoutOpts.node);
          _nodeMap[node.key] = node;
        } else {
          // isEdge
          node.shapeType = this.getProp(this.line.shapeType, node); //node.labeloffset = 0;
          //node.labelpos = 'l';
          //额外的会有minlen weight labelpos labeloffset 四个属性可以配置

          Object.assign(node, this.layoutOpts.edge);
          data.edges.push(node);
        }

        ;
      }

      ; //然后给edge填写source 和 target

      _.each(data.edges, function (edge) {
        var keys = edge.key;
        edge.source = _nodeMap[keys[0]];
        edge.target = _nodeMap[keys[1]];
      });

      return data;
    }
  }, {
    key: "_layoutData",
    value: function _layoutData() {
      if (this.layout == "dagre") {
        this._dagreLayout(this.data);
      } else if (this.layout == "tree") {
        this._treeLayout(this.data);
      } else if (_.isFunction(this.layout)) {
        //layout需要设置好data中nodes的xy， 以及edges的points，和 size的width，height
        this.layout(this.data);
      }

      ;
    }
  }, {
    key: "_dagreLayout",
    value: function _dagreLayout(data) {
      //https://github.com/dagrejs/dagre/wiki
      var layout = _global["default"].layout.dagre || _index2["default"];
      var g = new layout.graphlib.Graph();
      g.setGraph(this.layoutOpts.graph);
      g.setDefaultEdgeLabel(function () {
        //其实我到现在都还没搞明白setDefaultEdgeLabel的作用
        return {};
      });

      _.each(data.nodes, function (node) {
        g.setNode(node.key, node);
      });

      _.each(data.edges, function (edge) {
        //后面的参数直接把edge对象传入进去的话，setEdge会吧point 和 x y 等信息写回edge
        g.setEdge.apply(g, (0, _toConsumableArray2["default"])(edge.key).concat([edge])); //g.setEdge(edge.key[0],edge.key[1]);
      });

      layout.layout(g);
      data.size.width = g.graph().width;
      data.size.height = g.graph().height; //this.g = g;

      return data;
    } //TODO: 待实现，目前其实用dagre可以直接实现tree，但是如果可以用更加轻便的tree也可以尝试下

  }, {
    key: "_treeLayout",
    value: function _treeLayout() {// let tree = global.layout.tree().separation(function(a, b) {
      //     //设置横向节点之间的间距
      //     let totalWidth = a.width + b.width;
      //     return (totalWidth/2) + 10;
      // });
      // let nodes = tree.nodes( this.jsonData[0] ).reverse();
      // let links = tree.links(nodes);
    }
  }, {
    key: "widget",
    value: function widget() {
      var me = this;
      /*
      me.g.edges().forEach( e => {
          let edge = me.g.edge(e);
          console.log( edge )
      } );
      */

      _.each(this.data.edges, function (edge) {
        var key = edge.key.join('_');

        if (me.line.isTree && edge.points.length == 3) {
          //严格树状图的话（三个点），就转化成4个点的，有两个拐点
          me._setTreePoints(edge);
        }

        ;

        var path = me._getPathStr(edge, me.line.inflectionRadius);

        var lineWidth = me.getProp(me.line.lineWidth, edge);
        var strokeStyle = me.getProp(me.line.strokeStyle, edge);
        var edgeId = 'edge_' + key;

        var _path = me.edgesSp.getChildById(edgeId);

        if (_path) {
          _path.context.path = path;
          _path.context.lineWidth = lineWidth;
          _path.context.strokeStyle = strokeStyle;
        } else {
          _path = new Path({
            id: edgeId,
            context: {
              path: path,
              lineWidth: lineWidth,
              strokeStyle: strokeStyle
            }
          });
          me.edgesSp.addChild(_path);
        }

        ;
        edge.pathElement = _path;
        var arrowControl = edge.points.slice(-2, -1)[0];

        if (me.line.shapeType == "bezier") {
          if (me.rankdir == "TB" || me.rankdir == "BT") {
            arrowControl.x += (edge.source.x - edge.target.x) / 20;
          }

          if (me.rankdir == "LR" || me.rankdir == "RL") {
            arrowControl.y += (edge.source.y - edge.target.y) / 20;
          }
        }

        ; // edge的xy 就是 可以用来显示label的位置
        // let _circle = new Circle({
        //     context : {
        //         r : 2,
        //         x : edge.x,
        //         y : edge.y,
        //         fillStyle: "red"
        //     }
        // })
        //me.labelsSp.addChild( _circle );

        var edgeLabelId = 'label_' + key;
        var textAlign = me.getProp(me.node.content.textAlign, edge);
        var textBaseline = me.getProp(me.node.content.textBaseline, edge);

        var _edgeLabel = me.labelsSp.getChildById(edgeLabelId);

        if (_edgeLabel) {
          _edgeLabel.resetText(edge.content);

          _edgeLabel.context.x = edge.x;
          _edgeLabel.context.y = edge.y;
          _edgeLabel.context.fontSize = 12;
          _edgeLabel.context.fillStyle = "#ccc";
          _edgeLabel.context.textAlign = textAlign;
          _edgeLabel.context.textBaseline = textBaseline;
        } else {
          _edgeLabel = new _canvax["default"].Display.Text(edge.content, {
            id: edgeLabelId,
            context: {
              x: edge.x,
              y: edge.y,
              fontSize: 12,
              fillStyle: "#ccc",
              //me.getProp(me.node.content.fontColor, edge),
              textAlign: textAlign,
              textBaseline: textBaseline
            }
          });
          me.labelsSp.addChild(_edgeLabel);
        }

        edge.labelElement = _edgeLabel;

        if (me.line.arrow) {
          var arrowId = "arrow_" + key;

          var _arrow = me.arrowsSp.getChildById(arrowId);

          if (_arrow) {
            //arrow 只监听了x y 才会重绘，，，暂时只能这样处理,手动的赋值control.x control.y
            //而不是直接把 arrowControl 赋值给 control
            _arrow.context.control.x = arrowControl.x;
            _arrow.context.control.y = arrowControl.y;
            _arrow.context.point = edge.points.slice(-1)[0];
            _arrow.context.strokeStyle = strokeStyle; // _.extend(true, _arrow, {
            //     control: arrowControl,
            //     point: edge.points.slice(-1)[0],
            //     strokeStyle: strokeStyle
            // } );
          } else {
            _arrow = new Arrow({
              id: arrowId,
              context: {
                control: arrowControl,
                point: edge.points.slice(-1)[0],
                strokeStyle: strokeStyle //fillStyle: strokeStyle

              }
            });
            me.arrowsSp.addChild(_arrow);
          }

          edge.arrowElement = _arrow;
        }

        ;
      });

      _.each(this.data.nodes, function (node) {
        var nodeId = "node_" + node.key;
        var context = {
          x: node.x - node.width / 2,
          y: node.y - node.height / 2,
          width: node.width,
          height: node.height,
          lineWidth: 1,
          fillStyle: me.getProp(me.node.fillStyle, node),
          strokeStyle: me.getProp(me.node.strokeStyle, node),
          radius: _.flatten([me.getProp(me.node.radius, node)])
        };

        var _boxShape = me.nodesSp.getChildById(nodeId);

        if (_boxShape) {
          _.extend(_boxShape.context, context);
        } else {
          _boxShape = new Rect({
            id: nodeId,
            context: context
          });
          me.nodesSp.addChild(_boxShape);

          _boxShape.on(event.types.get(), function (e) {
            e.eventInfo = {
              trigger: me.node,
              nodes: [this.nodeData]
            };
            me.app.fire(e.type, e);
          });
        }

        ;
        _boxShape.nodeData = node;
        node.boxElement = _boxShape;

        _boxShape.on("transform", function () {
          if (node.ctype == "canvas") {
            node.contentElement.context.x = node.x;
            node.contentElement.context.y = node.y;
          } else if (node.ctype == "html") {
            var devicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
            node.contentElement.style.transform = "matrix(" + _boxShape.worldTransform.clone().scale(1 / devicePixelRatio, 1 / devicePixelRatio).toArray().join() + ")";
            node.contentElement.style.transformOrigin = "left top"; //修改为左上角为旋转中心点来和canvas同步

            node.contentElement.style.marginLeft = me.getProp(me.node.padding, node) * me.status.transform.scale + "px";
            node.contentElement.style.marginTop = me.getProp(me.node.padding, node) * me.status.transform.scale + "px";
            node.contentElement.style.visibility = "visible";
          }
        });
      });

      this.induce.context.width = this.width;
      this.induce.context.height = this.height;
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
        points[0] = {
          x: edge.source.x + (this.rankdir == "RL" ? -1 : 1) * edge.source.width / 2,
          y: edge.source.y
        };
        points.splice(1, 0, {
          x: points.slice(-2, -1)[0].x,
          y: edge.source.y
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
    key: "_getPathStr",
    value: function _getPathStr(edge, inflectionRadius) {
      var points = edge.points;
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

      ; //str += "z"

      return str;
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


      if (this._isField(this.node.content.field)) {
        _c = rowData[this.node.content.field];
      }

      ;

      if (me.node.content.format && _.isFunction(me.node.content.format)) {
        _c = me.node.content.format.apply(this, [_c, rowData]);
      }

      ;
      return _c;
    }
  }, {
    key: "_isField",
    value: function _isField(str) {
      return ~this.dataFrame.fields.indexOf(str);
    }
  }, {
    key: "_getElementAndSize",
    value: function _getElementAndSize(node) {
      var me = this;
      var contentType = node.ctype;

      if (me._isField(contentType)) {
        contentType = node.rowData[contentType];
      }

      ;
      !contentType && (contentType = 'canvas');

      if (contentType == 'canvas') {
        return me._getEleAndsetCanvasSize(node);
      }

      ;

      if (contentType == 'html') {
        return me._getEleAndsetHtmlSize(node);
      }

      ;
    }
  }, {
    key: "_getEleAndsetCanvasSize",
    value: function _getEleAndsetCanvasSize(node) {
      var me = this;
      var content = node.content;
      var width = node.rowData.width,
          height = node.rowData.height; //let sprite = new Canvax.Display.Sprite({});

      var context = {
        fillStyle: me.getProp(me.node.content.fontColor, node),
        textAlign: me.getProp(me.node.content.textAlign, node),
        textBaseline: me.getProp(me.node.content.textBaseline, node)
      }; //console.log(node.key);

      var contentLabelId = "content_label_" + node.key;

      var _contentLabel = me.nodesContentSp.getChildById(contentLabelId);

      if (_contentLabel) {
        _contentLabel.resetText(content);

        _.extend(_contentLabel.context, context);
      } else {
        //先创建text，根据 text 来计算node需要的width和height
        _contentLabel = new _canvax["default"].Display.Text(content, {
          id: contentLabelId,
          context: context
        });

        if (!_.isArray(node.key)) {
          me.nodesContentSp.addChild(_contentLabel);
        }

        ;
      }

      if (!width) {
        width = _contentLabel.getTextWidth() + me.getProp(me.node.padding, node) * me.status.transform.scale * 2;
      }

      ;

      if (!height) {
        height = _contentLabel.getTextHeight() + me.getProp(me.node.padding, node) * me.status.transform.scale * 2;
      }

      ;
      return {
        contentElement: _contentLabel,
        width: width,
        height: height
      };
    }
  }, {
    key: "_getEleAndsetHtmlSize",
    value: function _getEleAndsetHtmlSize(node) {
      var me = this;
      var content = node.content;
      var width = node.rowData.width,
          height = node.rowData.height;

      var _dom = document.createElement("div");

      _dom.className = "chartx_relation_node";
      _dom.style.cssText += "; position:absolute;visibility:hidden;";
      _dom.style.cssText += "; color:" + me.getProp(me.node.content.fontColor, node) + ";";
      _dom.style.cssText += "; text-align:" + me.getProp(me.node.content.textAlign, node) + ";";
      _dom.style.cssText += "; vertical-align:" + me.getProp(me.node.content.textBaseline, node) + ";";
      _dom.innerHTML = content;
      this.domContainer.appendChild(_dom);

      if (!width) {
        width = _dom.offsetWidth + me.getProp(me.node.padding, node) * me.status.transform.scale * 2;
      }

      ;

      if (!height) {
        height = _dom.offsetHeight + me.getProp(me.node.padding, node) * me.status.transform.scale * 2;
      }

      ;
      return {
        contentElement: _dom,
        width: width,
        height: height
      };
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
  }]);
  return Relation;
}(_index["default"]);

_index["default"].registerComponent(Relation, 'graphs', 'relation');

var _default = Relation;
exports["default"] = _default;