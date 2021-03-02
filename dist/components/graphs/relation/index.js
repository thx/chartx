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

var _data2 = require("./data");

var _zoom = _interopRequireDefault(require("../../../utils/zoom"));

var _index2 = _interopRequireDefault(require("../../../layout/dagre/index"));

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
              detail: '节点图形，支持rect,diamond',
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
              detail: '内容的width',
              "default": null
            },
            height: {
              detail: '内容的height',
              "default": null
            },
            radius: {
              detail: '圆角角度，对rect生效',
              "default": 6
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
                  "default": 'click'
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
                  "default": true
                },
                charCode: {
                  detail: 'iconfont上面对应的unicode中&#x后面的字符',
                  "default": null
                },
                lineWidth: {
                  detail: 'icon描边线宽',
                  "default": 0
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
                  "default": 16
                },
                offset: {
                  detail: 'icon的位置，函数，参数是整个edge对象',
                  "default": null
                }
              }
            },
            cursor: 'default'
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
                },
                wheelAction: {
                  detail: "滚轮触屏滑动触发的行为，可选有scale和offset，默认offset",
                  "default": "offset"
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
          var point = e.target.localToGlobal(e.point, me.sprite); //鼠标拖拽移动

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

              me.graphsView.context.x = parseInt(x);
              me.graphsView.context.y = parseInt(y);
            }
          }

          ; //滚轮缩放

          if (e.type == "wheel") {
            console.log(_deltaY, e.deltaY);

            if (Math.abs(e.deltaY) > Math.abs(_deltaY)) {
              _deltaY = e.deltaY;
            }

            ;

            if (!_wheelHandleTimeer) {
              _wheelHandleTimeer = setTimeout(function () {
                if (me.status.transform.wheelAction == 'offset') {
                  //移动的话用offset,偏移多少像素
                  var _me$zoom$offset = me.zoom.offset({
                    x: -e.deltaX,
                    y: -e.deltaY
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

        ;
      });
    }
  }, {
    key: "draw",
    value: function draw(opt) {
      var _this2 = this;

      !opt && (opt = {});

      _.extend(true, this, opt);

      this._initData(opt.data).then(function (data) {
        _this2.data = data;

        _this2._layoutData();

        _this2.widget();

        _this2.induce.context.width = _this2.width;
        _this2.induce.context.height = _this2.height;
        _this2.sprite.context.x = parseInt(_this2.origin.x);
        _this2.sprite.context.y = parseInt(_this2.origin.y);

        var _offsetLeft = (_this2.width - _this2.data.size.width) / 2;

        if (_offsetLeft < 0) {
          _offsetLeft = 0;
        }

        ;

        var _offsetTop = (_this2.height - _this2.data.size.height) / 2;

        if (_offsetTop < 0) {
          _offsetTop = 0;
        }

        ;
        _this2.graphsSp.context.x = parseInt(_offsetLeft);
        _this2.graphsSp.context.y = parseInt(_offsetTop);

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
        _this3.fire("complete");
      });
    }
  }, {
    key: "_resetData",
    value: function _resetData(data, dataTrigger) {
      var _this4 = this;

      var me = this;
      this._preData = this.data;
      return new Promise(function (resolve) {
        _this4._initData(data).then(function (_data) {
          _this4.data = _data;

          _this4._layoutData();

          _.each(_this4._preData.nodes, function (preNode) {
            var nodeData = _.find(me.data.nodes, function (node) {
              return preNode.key == node.key;
            });

            if (!nodeData) {
              me._destroy(preNode);
            } else {
              //如果找到了，要从前面
              nodeData.focused = preNode.focused;
              nodeData.selected = preNode.selected;
            }
          });

          _.each(_this4._preData.edges, function (preEdge) {
            if (!_.find(me.data.edges, function (edge) {
              return preEdge.key.join('_') == edge.key.join('_');
            })) {
              me._destroy(preEdge);
            }
          });

          _this4.widget(); //钉住某个node为参考点（不移动)


          if (dataTrigger && dataTrigger.origin) {
            var preOriginNode = _.find(_this4._preData.nodes, function (node) {
              return node.key == dataTrigger.origin;
            });

            var originNode = _.find(_this4.data.nodes, function (node) {
              return node.key == dataTrigger.origin;
            });

            if (preOriginNode && originNode) {
              var offsetPos = {
                x: parseInt(preOriginNode.x) - parseInt(originNode.x),
                y: parseInt(preOriginNode.y) - parseInt(originNode.y)
              };

              var _this4$zoom$offset = _this4.zoom.offset(offsetPos),
                  x = _this4$zoom$offset.x,
                  y = _this4$zoom$offset.y;

              me.graphsView.context.x = parseInt(x);
              me.graphsView.context.y = parseInt(y);
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
    }
  }, {
    key: "_getDefNode",
    value: function _getDefNode() {
      var node = {
        type: "relation",
        iNode: 0,
        rowData: null,
        key: "",
        content: '',
        _contentInited: false,
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
        //如果是edge，要填写这两节点
        source: null,
        target: null,
        focused: false,
        selected: false
      };
      return node;
    } //$data如果用户设置了符合data的数据格式数据{nodes, edges, size}，那就直接返回

  }, {
    key: "_initData",
    value: function _initData($data) {
      var _this5 = this;

      return new Promise(function (resolve) {
        if ($data && $data.nodes && $data.edges) {
          resolve($data);
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
        var originData = _this5.app._data;

        if ((0, _data2.checkDataIsJson)(originData, _this5.field, _this5.childrenField)) {
          _this5.jsonData = (0, _data2.jsonToArrayForRelation)(originData, _this5, _this5.childrenField);
          _this5.dataFrame = _this5.app.dataFrame = (0, _dataFrame["default"])(_this5.jsonData);
        } else {
          if (_this5.layout == "tree") {
            //源数据就是图表标准数据，只需要转换成json的Children格式
            //app.dataFrame.jsonOrg ==> [{name: key:} ...] 不是children的树结构
            _this5.jsonData = (0, _data2.arrayToTreeJsonForRelation)(_this5.app.dataFrame.jsonOrg, _this5);
          }

          ;
        }

        ;

        for (var i = 0; i < _this5.dataFrame.length; i++) {
          var rowData = _this5.dataFrame.getRowDataAt(i);

          var fields = _.flatten([(rowData[_this5.field] + "").split(",")]);

          var content = _this5._getContent(rowData);

          var node = _this5._getDefNode();

          Object.assign(node, {
            iNode: i,
            rowData: rowData,
            key: fields.length == 1 ? fields[0] : fields,
            content: content,
            ctype: _this5._checkHtml(content) ? 'html' : 'canvas'
          });

          if (fields.length == 1) {
            //isNode
            node.shapeType = _this5.getProp(_this5.node.shapeType, node);
            Object.assign(node, _this5.layoutOpts.node);
            data.nodes.push(node);
          } else {
            // isEdge
            node.shapeType = _this5.getProp(_this5.line.shapeType, node);
            Object.assign(node, _this5.layoutOpts.edge);
            data.edges.push(node);
          }

          ;
        }

        ;

        _this5._initAllDataSize(data).then(function (data) {
          resolve(data);
        });
      });
    }
  }, {
    key: "_initAllDataSize",
    value: function _initAllDataSize(data) {
      var _this6 = this;

      return new Promise(function (resolve) {
        var _nodeMap = {};
        var initNum = 0;
        data.nodes.concat(data.edges).forEach(function (node) {
          _nodeMap[node.key] = node; //计算和设置node的尺寸

          _this6._initContentAndGetSize(node).then(function (opt) {
            _.extend(node, opt); //如果是菱形，还需要重新调整新的尺寸


            if (node.shapeType == 'diamond') {
              //因为node的尺寸前面计算出来的是矩形的尺寸，如果是菱形的话，这里就是指内接矩形的尺寸，
              //需要换算成外接矩形的尺寸
              var innerRect = {
                //内接矩形
                width: node.width,
                height: node.height
              };
              var includedAngle = _this6.node.includedAngle / 2;
              var includeRad = includedAngle * Math.PI / 180;
              var newWidthDiff = innerRect.height / Math.tan(includeRad);
              var newHeightDiff = innerRect.width * Math.tan(includeRad); //在内接矩形基础上扩展出来的外界矩形

              var newWidth = innerRect.width + newWidthDiff;
              var newHeight = innerRect.height + newHeightDiff; //把新的菱形的外界边界回写

              node._innerRect = {
                width: node.width,
                height: node.height
              };
              node.width = newWidth;
              node.height = newHeight;
            }

            ;
            node._contentInited = true;
            initNum++; //如果所有的node的size都初始化完毕

            if (initNum == data.nodes.length + data.edges.length) {
              //all is inited
              //然后给edge填写source 和 target
              _.each(data.edges, function (edge) {
                var keys = edge.key;
                edge.source = _nodeMap[keys[0]];
                edge.target = _nodeMap[keys[1]];
              });

              resolve(data);
            }

            ;
          });
        });
      });
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
      /*
      me.g.edges().forEach( e => {
          let edge = me.g.edge(e);
          console.log( edge )
      } );
      */
      this._drawEdges();

      this._drawNodes();
    }
  }, {
    key: "_drawEdges",
    value: function _drawEdges() {
      var me = this;

      _.each(this.data.edges, function (edge) {
        console.log(edge.points);
        var key = edge.key.join('_');

        if (me.line.isTree && edge.points.length == 3) {
          //严格树状图的话（三个点），就转化成4个点的，有两个拐点
          me._setTreePoints(edge);
        }

        ;

        var path = me._getPathStr(edge, me.line.inflectionRadius);

        var lineWidth = me.getProp(me.line.lineWidth, edge);
        var strokeStyle = me.getProp(me.line.strokeStyle, edge);
        var lineType = me.getProp(me.line.lineType, edge);
        var cursor = me.getProp(me.line.cursor, edge);
        var edgeId = 'edge_' + key;

        var _path = me.edgesSp.getChildById(edgeId);

        if (_path) {
          _path.context.path = path;
          _path.context.lineWidth = lineWidth;
          _path.context.strokeStyle = strokeStyle;
          _path.context.lineType = lineType;
        } else {
          _path = new Path({
            id: edgeId,
            context: {
              path: path,
              lineWidth: lineWidth,
              strokeStyle: strokeStyle,
              lineType: lineType,
              cursor: cursor
            }
          });

          _path.on(event.types.get(), function (e) {
            e.eventInfo = {
              trigger: me.line,
              nodes: [this.nodeData]
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
              e.eventInfo = {
                trigger: me.line,
                nodes: [this.nodeData]
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
          var edgeIconId = 'edge_item_' + key;
          var charCode = String.fromCharCode(parseInt(me.getProp(me.line.icon.charCode, edge), 16));

          if (charCode) {
            var _lineWidth = me.getProp(me.line.icon.lineWidth, edge);

            var _strokeStyle = me.getProp(me.line.icon.strokeStyle, edge);

            var fontFamily = me.getProp(me.line.icon.fontFamily, edge);

            var _fontSize = me.getProp(me.line.icon.fontSize, edge);

            var _fontColor = me.getProp(me.line.icon.fontColor, edge);

            var _textAlign = 'center';
            var _textBaseline = 'middle';

            var _offset = me.getProp(me.line.icon.offset, edge);

            if (!_offset) {
              //default 使用edge.x edge.y 也就是edge label的位置
              _offset = {
                x: edge.x,
                y: edge.y
              };
            }

            ;

            var _edgeIcon = me.labelsSp.getChildById(edgeIconId);

            if (_edgeIcon) {
              _edgeIcon.resetText(charCode);

              _edgeIcon.context.x = _offset.x;
              _edgeIcon.context.y = _offset.y;
              _edgeIcon.context.fontSize = _fontSize;
              _edgeIcon.context.fillStyle = _fontColor;
              _edgeIcon.context.textAlign = _textAlign;
              _edgeIcon.context.textBaseline = _textBaseline;
              _edgeIcon.context.fontFamily = fontFamily;
              _edgeIcon.context.lineWidth = _lineWidth;
              _edgeIcon.context.strokeStyle = _strokeStyle;
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
                  fontFamily: fontFamily,
                  lineWidth: _lineWidth,
                  strokeStyle: _strokeStyle
                }
              });

              _edgeIcon.on(event.types.get(), function (e) {
                var trigger = me.line;

                if (me.line.icon['on' + e.type]) {
                  trigger = me.line.icon;
                }

                ;
                e.eventInfo = {
                  trigger: trigger,
                  nodes: [this.nodeData]
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
    key: "_drawNodes",
    value: function _drawNodes() {
      var me = this;

      _.each(this.data.nodes, function (node) {
        me._drawNode(node);
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
          cursor: cursor,
          innerRect: node._innerRect,
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
          e.eventInfo = {
            trigger: me.node,
            nodes: [this.nodeData]
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

          if (me.node.select.enabled && e.type == me.node.select.triggerEventType) {
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
            node.contentElement.style.left = -parseInt(node._innerRect.width / 2 * me.status.transform.scale) + "px";
            node.contentElement.style.top = -parseInt(node._innerRect.height / 2 * me.status.transform.scale) + "px";
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
      var _this7 = this;

      this.data.nodes.forEach(function (nodeData) {
        _this7.selectAt(nodeData);
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
      var _this8 = this;

      this.data.nodes.forEach(function (nodeData) {
        _this8.unselectAt(nodeData);
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
    key: "_initContentAndGetSize",
    value: function _initContentAndGetSize(node) {
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
      var _this9 = this;

      var me = this;
      return new Promise(function (resolve) {
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

        if (_this9.node.content.init && typeof _this9.node.content.init === 'function') {
          inited = _this9.node.content.init(node, _contentLabel);
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
              width: width,
              height: height
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
            width: width,
            height: height
          });
        }
      });
    }
  }, {
    key: "_getEleAndsetHtmlSize",
    value: function _getEleAndsetHtmlSize(node) {
      var _this10 = this;

      var me = this;
      return new Promise(function (resolve) {
        var content = node.content;
        var width = node.rowData.width,
            height = node.rowData.height;
        var contentLabelClass = "__content_label_" + node.key;

        var _dom = _this10.domContainer.getElementsByClassName(contentLabelClass);

        if (!_dom.length) {
          _dom = document.createElement("div");
          _dom.className = "chartx_relation_node " + contentLabelClass;
          _dom.style.cssText += "; position:absolute;visibility:hidden;";

          _this10.domContainer.appendChild(_dom);
        } else {
          _dom = _dom[0];
        }

        ;
        _dom.style.cssText += "; color:" + me.getProp(me.node.content.fontColor, node) + ";";
        _dom.style.cssText += "; text-align:" + me.getProp(me.node.content.textAlign, node) + ";";
        _dom.style.cssText += "; vertical-align:" + me.getProp(me.node.content.textBaseline, node) + ";"; //_dom.style.cssText += "; padding:"+me.getProp(me.node.padding, node)+"px;";

        _dom.innerHTML = content;
        var inited;

        if (_this10.node.content.init && typeof _this10.node.content.init === 'function') {
          inited = _this10.node.content.init(node, _dom);
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
              width: width,
              height: height
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
            width: width,
            height: height
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
  }]);
  return Relation;
}(_index["default"]);

_index["default"].registerComponent(Relation, 'graphs', 'relation');

var _default = Relation;
exports["default"] = _default;