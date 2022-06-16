"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _canvax = _interopRequireDefault(require("canvax"));

var _tools = require("../../../utils/tools");

var _color = require("../../../utils/color");

var _numeral = _interopRequireDefault(require("numeral"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var _ = _canvax["default"]._,
    event = _canvax["default"].event;
var AnimationFrame = _canvax["default"].AnimationFrame;
var BrokenLine = _canvax["default"].Shapes.BrokenLine;
var Circle = _canvax["default"].Shapes.Circle;
var Isogon = _canvax["default"].Shapes.Isogon;
var Rect = _canvax["default"].Shapes.Rect;
var Path = _canvax["default"].Shapes.Path;

var LineGraphsGroup = /*#__PURE__*/function (_event$Dispatcher) {
  (0, _inherits2["default"])(LineGraphsGroup, _event$Dispatcher);

  var _super = _createSuper(LineGraphsGroup);

  function LineGraphsGroup(fieldConfig, iGroup, opt, ctx, h, w, _graphs) {
    var _this;

    var bottomFieldMap = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : {};
    (0, _classCallCheck2["default"])(this, LineGraphsGroup);
    _this = _super.call(this);
    _this._graphs = _graphs;
    _this._opt = opt;
    _this.fieldConfig = fieldConfig;
    _this.field = null; //在extend之后要重新设置

    _this.iGroup = iGroup;
    _this._yAxis = fieldConfig.yAxis;
    _this.ctx = ctx;
    _this.w = w;
    _this.h = h;
    _this.y = 0;
    _this.data = [];
    _this.sprite = null;
    _this._pointList = []; //brokenline最终的状态

    _this._currPointList = []; //brokenline 动画中的当前状态

    _this._line = null;
    _this._bottomPointList = []; // bottomLine的最终状态

    _this._currBottomPointList = []; // bottomLine 动画中的当前状态

    _this._bottomLine = null; //设置默认的color 为 fieldConfig.color

    _this.color = fieldConfig.color;

    _.extend(true, (0, _assertThisInitialized2["default"])(_this), (0, _tools.getDefaultProps)(LineGraphsGroup.defaultProps()), opt); //TODO group中得field不能直接用opt中得field， 必须重新设置， 
    //group中得field只有一个值，代表一条折线, 后面要扩展extend方法，可以控制过滤哪些key值不做extend


    _this.field = fieldConfig.field; //iGroup 在yAxis.field中对应的值

    _this.clipRect = null;
    _this.__currFocusInd = -1;
    _this._growed = false; //_bottomField如果有， 那么在画area的时候起点是_bottomField上面的值，而不是从默认的坐标0开始

    _this._bottomField = bottomFieldMap[_this.field];

    _this.init(opt);

    return _this;
  }

  (0, _createClass2["default"])(LineGraphsGroup, [{
    key: "init",
    value: function init() {
      this.sprite = new _canvax["default"].Display.Sprite();
      this.graphSprite = new _canvax["default"].Display.Sprite();
      this.sprite.addChild(this.graphSprite);
      this.lineSprite = new _canvax["default"].Display.Sprite();
      this.graphSprite.addChild(this.lineSprite); //hover效果的node被添加到的容器

      this._focusNodes = new _canvax["default"].Display.Sprite({});
      this.sprite.addChild(this._focusNodes);
      this._nodes = new _canvax["default"].Display.Sprite({});
      this.sprite.addChild(this._nodes);
      this._labels = new _canvax["default"].Display.Sprite({});
      this.sprite.addChild(this._labels);
    }
  }, {
    key: "_clean",
    value: function _clean() {
      this.lineSprite.removeAllChildren();

      this._focusNodes.removeAllChildren();

      this._nodes.removeAllChildren();

      this._labels.removeAllChildren();

      this._line = null;
      this._bottomLine = null;
      this._area = null;
    }
  }, {
    key: "draw",
    value: function draw(opt, data) {
      _.extend(true, this, opt);

      this.data = data;

      this._widget(opt);
    } //自我销毁

  }, {
    key: "destroy",
    value: function destroy() {
      var me = this;
      me.sprite.animate({
        globalAlpha: 0
      }, {
        duration: 300,
        onComplete: function onComplete() {
          me.sprite.remove();
        }
      });
    } //styleType , normals , iGroup

  }, {
    key: "_getColor",
    value: function _getColor(s, iNode) {
      var color = this._getProp(s, iNode);

      if (color === undefined || color === null) {
        //这个时候可以先取线的style，和线保持一致
        color = this._getLineStrokeStyle();

        if (s && s.lineargradient) {
          color = s.lineargradient[parseInt(s.lineargradient.length / 2)].color;
        }

        ; //因为_getLineStrokeStyle返回的可能是个渐变对象，所以要用isString过滤掉

        if (!color || !_.isString(color)) {
          //那么最后，取this.fieldConfig.color
          color = this.fieldConfig.color; //this._getProp(this.color, iNode) //this.color会被写入到fieldMap.color
        }
      }

      ;
      return color;
    }
  }, {
    key: "_getProp",
    value: function _getProp(s, iNode) {
      if (_.isArray(s)) {
        return s[this.iGroup];
      }

      ;

      if (_.isFunction(s)) {
        var _nodesInfo = [];

        if (iNode != undefined) {
          _nodesInfo.push(this.data[iNode]);
        }

        ;
        return s.apply(this, _nodesInfo);
      }

      ;
      return s;
    } //这个是tips需要用到的 

  }, {
    key: "getNodeInfoAt",
    value: function getNodeInfoAt($index, e) {
      var o = this.data[$index];

      if (e && e.eventInfo && e.eventInfo.dimension_1) {
        var lt = e.eventInfo.dimension_1.layoutType;

        if (lt == 'proportion') {
          //$index则代表的xpos，需要计算出来data中和$index最近的值作为 node
          var xDis;

          for (var i = 0, l = this.data.length; i < l; i++) {
            var _node = this.data[i];

            var _xDis = Math.abs(_node.x - $index);

            if (xDis == undefined || _xDis < xDis) {
              xDis = _xDis;
              o = _node;
              continue;
            }

            ;
          }

          ;
        }

        ;
      }

      ;
      return o;
    }
    /**
     * 
     * @param {object} opt 
     * @param {data} data 
     * 
     * 触发这次reset的触发原因比如{name : 'datazoom', left:-1,right:1},  
     * dataTrigger 描述了数据变化的原因和变化的过程，比如上面的数据 left少了一个数据，right多了一个数据
     * @param {object} dataTrigger 
     */

  }, {
    key: "resetData",
    value: function resetData(data, dataTrigger, opt) {
      var me = this;

      if (data) {
        this.data = data;
      }

      ;

      if (!dataTrigger || !dataTrigger.comp) {
        //如果是系统级别的调用，需要从新执行绘制, 不是内部的触发比如（datazoom）
        me._growed = false;

        if (me.clipRect) {
          me.clipRect.destroy();
          me.clipRect = null;
        }

        ;

        me._widget(this);

        me._grow();
      } else {
        debugger;
        me._pointList = this._getPointList(this.data);
        me._bottomPointList = this._getBottomPointList();
        var plen = me._pointList.length;
        var cplen = me._currPointList.length;
        var params = {
          left: 0,
          //默认左边数据没变
          right: plen - cplen
        };

        if (dataTrigger && dataTrigger.params) {
          _.extend(params, dataTrigger.params);
        }

        ;

        if (params.left) {
          if (params.left > 0) {
            this._currPointList = this._pointList.slice(0, params.left).concat(this._currPointList);

            if (this._bottomField) {
              this._currBottomPointList = this._bottomPointList.slice(0, params.left).concat(this._currBottomPointList);
            }
          }

          if (params.left < 0) {
            this._currPointList.splice(0, Math.abs(params.left));

            if (this._bottomField) {
              this._currBottomPointList.splice(0, Math.abs(params.left));
            }
          }
        }

        ;

        if (params.right) {
          if (params.right > 0) {
            this._currPointList = this._currPointList.concat(this._pointList.slice(-params.right));

            if (this._bottomField) {
              this._currBottomPointList = this._currBottomPointList.concat(this._bottomPointList.slice(-params.right));
            }
          }

          if (params.right < 0) {
            this._currPointList.splice(this._currPointList.length - Math.abs(params.right));

            if (this._bottomField) {
              this._currBottomPointList.splice(this._currBottomPointList.length - Math.abs(params.right));
            }
          }
        }

        ;

        me._createNodes();

        me._createTexts();

        me._transition();
      }
    } //数据变化后的切换动画

  }, {
    key: "_transition",
    value: function _transition(callback) {
      var me = this;
      debugger;

      if (!me.data.length) {
        //因为在index中有调用
        if (me._line.context) {
          me._line.context.pointList = [];
        }

        ;

        if (me._bottomLine.context) {
          me._bottomLine.context.pointList = [];
        }

        ;

        if (me._area && me._area.context) {
          me._area.context.path = '';
        }

        ;
        callback && callback(me);
        return;
      }

      ;

      function _update(pointList, bottomPointList) {
        if (!me._line) {
          me.sprite._removeTween(me._transitionTween);

          me._transitionTween = null;
          return;
        }

        if (me._line.context) {
          me._line.context.pointList = _.clone(pointList);
          me._line.context.strokeStyle = me._getLineStrokeStyle();
        }

        if (me._bottomField && me._bottomLine && me._bottomLine.context) {
          me._bottomLine.context.pointList = _.clone(bottomPointList);
          me._bottomLine.context.strokeStyle = me._getLineStrokeStyle();
        }

        if (me._area && me._area.context) {
          me._area.context.path = me._getFillPath(me._line, me._bottomLine);
          me._area.context.fillStyle = me._getFillStyle();
        }

        var iNode = 0;

        _.each(pointList, function (point, i) {
          if (_.isNumber(point[1])) {
            if (me._nodes) {
              var _node = me._nodes.getChildAt(iNode);

              if (_node) {
                _node.context.x = point[0];
                _node.context.y = point[1];
              }
            }

            if (me._labels) {
              var _text = me._labels.getChildAt(iNode);

              if (_text) {
                _text.context.x = point[0];
                _text.context.y = point[1] - 3 - 3;

                me._checkTextPos(_text, i);
              }
            }

            iNode++;
          }
        });
      }

      ;

      if (!this._growed) {
        //如果还在入场中
        me._currPointList = me._pointList;
        me._currBottomPointList = me._bottomPointList;

        _update(me._currPointList, me._currBottomPointList);

        return;
      }

      this._transitionTween = AnimationFrame.registTween({
        from: me._getPointPosStr(me._currPointList, me._currBottomPointList),
        to: me._getPointPosStr(me._pointList, me._bottomPointList),
        desc: me.field,
        onUpdate: function onUpdate(arg) {
          for (var p in arg) {
            var currPointerList = p.split("_")[0] == 'p' ? me._currPointList : me._currBottomPointList;
            var ind = parseInt(p.split("_")[2]);
            var xory = parseInt(p.split("_")[1]);
            currPointerList[ind] && (currPointerList[ind][xory] = arg[p]); //p_1_n中间的1代表x or y
          }

          ;

          _update(me._currPointList, me._currBottomPointList);
        },
        onComplete: function onComplete() {
          me.sprite._removeTween(me._transitionTween);

          me._transitionTween = null; //在动画结束后强制把目标状态绘制一次。
          //解决在onUpdate中可能出现的异常会导致绘制有问题。
          //这样的话，至少最后的结果会是对的。

          _update(me._pointList, me._bottomPointList);

          callback && callback(me);
        }
      });

      this.sprite._tweens.push(this._transitionTween);
    } //首次加载的进场动画

  }, {
    key: "_grow",
    value: function _grow(callback) {
      var _this2 = this;

      var _coord = this._graphs.app.getCoord();

      var width = _coord.width,
          height = _coord.height;
      this.clipRect = new Rect({
        context: {
          x: 0,
          //-100,
          y: -height - 3,
          width: 0,
          height: height + 6,
          fillStyle: 'green'
        }
      });
      var growTo = {
        width: width
      };
      this.lineSprite.clipTo(this.clipRect);
      this.graphSprite.addChild(this.clipRect);

      if (this.line.growDriction == 'rightLeft') {
        this.clipRect.context.x = width;
        growTo.x = 0;
      }

      ;
      this.clipRect.animate(growTo, {
        duration: this._graphs.aniDuration,
        onUpdate: function onUpdate() {
          var clipRectCtx = _this2.clipRect.context;

          _this2._nodes.children.concat(_this2._labels.children).forEach(function (el) {
            var _ctx = el.context;

            if (_ctx.globalAlpha == 0 && _ctx.x >= clipRectCtx.x && _ctx.x <= clipRectCtx.x + clipRectCtx.width) {
              el.animate({
                globalAlpha: 1
              }, {
                duration: 300
              });
            }
          });
        },
        onComplete: function onComplete() {
          _this2._growed = true;
          callback && callback();
        }
      });
    }
  }, {
    key: "_getPointPosStr",
    value: function _getPointPosStr(pointList, bottomPointList) {
      var obj = {};
      pointList.forEach(function (p, i) {
        if (!p) {
          //折线图中这个节点可能没有
          return;
        }

        ;
        obj["p_1_" + i] = p[1]; //p_y==p_1

        obj["p_0_" + i] = p[0]; //p_x==p_0
      });
      bottomPointList.forEach(function (p, i) {
        if (!p) {
          //折线图中这个节点可能没有
          return;
        }

        ;
        obj["bp_1_" + i] = p[1]; //p_y==p_1

        obj["bp_0_" + i] = p[0]; //p_x==p_0
      });
      return obj;
    }
  }, {
    key: "_getPointList",
    value: function _getPointList(data) {
      var list = [];

      for (var a = 0, al = data.length; a < al; a++) {
        var o = data[a];
        list.push([o.x, o.y]);
      }

      ;
      return list;
    }
  }, {
    key: "_widget",
    value: function _widget(opt) {
      var me = this;
      !opt && (opt = {});

      if (opt.isResize) {
        me._growed = true;
      }

      ; //绘制之前先自清空

      me._clean();

      me._pointList = this._getPointList(me.data);

      if (me._pointList.length == 0) {
        //filter后，data可能length==0
        return;
      }

      ;
      var list = me._pointList;
      me._currPointList = list;

      var strokeStyle = me._getLineStrokeStyle(list); //_getLineStrokeStyle 在配置线性渐变的情况下会需要


      var blineCtx = {
        pointList: list,
        lineWidth: me.line.lineWidth,
        y: me.y,
        strokeStyle: strokeStyle,
        smooth: me.line.smooth,
        curvature: me.line.curvature,
        lineType: me._getProp(me.line.lineType),
        lineDash: me.line.lineDash,
        //TODO: 不能用_getProp
        lineJoin: 'bevel',
        smoothFilter: function smoothFilter(rp) {
          //smooth为true的话，折线图需要对折线做一些纠正，不能超过底部
          if (rp[1] > 0) {
            rp[1] = 0;
          } else if (Math.abs(rp[1]) > me.h) {
            rp[1] = -me.h;
          }
        },
        lineCap: "round"
      };

      if (me.line.shadowBlur) {
        blineCtx.shadowBlur = me.line.shadowBlur, blineCtx.shadowColor = me.line.shadowColor || strokeStyle, blineCtx.shadowOffsetY = me.line.shadowOffsetY;
        blineCtx.shadowOffsetX = me.line.shadowOffsetX;
      }

      ;
      var bline = new BrokenLine({
        //线条
        context: blineCtx
      });
      bline.on(event.types.get(), function (e) {
        e.eventInfo = {
          trigger: me.line,
          nodes: []
        };

        me._graphs.app.fire(e.type, e);
      });

      if (!this.line.enabled) {
        bline.context.visible = false;
      }

      ;
      me.lineSprite.addChild(bline);
      me._line = bline;

      if (me.area.enabled) {
        if (this._bottomField) {
          //如果有 _bottomField
          me._bottomPointList = this._getBottomPointList();
          var _list = me._bottomPointList;
          me._currBottomPointList = _list;
          var bottomLineCtx = {};
          Object.assign(bottomLineCtx, blineCtx);
          bottomLineCtx.pointList = me._bottomPointList;
          var bottomLine = new BrokenLine({
            //线条
            context: bottomLineCtx
          });

          if (!this.area.bottomLine.enabled) {
            bottomLine.context.visible = false;
          }

          ;
          me.lineSprite.addChild(bottomLine);
          me._bottomLine = bottomLine;
        }

        var area = new Path({
          //填充
          context: {
            path: me._getFillPath(me._line, me._bottomLine),
            fillStyle: me._getFillStyle(),
            globalAlpha: _.isArray(me.area.alpha) ? 1 : me.area.alpha
          }
        });
        area.on(event.types.get(), function (e) {
          e.eventInfo = {
            trigger: me.area,
            nodes: []
          };

          me._graphs.app.fire(e.type, e);
        });
        me.lineSprite.addChild(area);
        me._area = area;
      }

      me._createNodes(opt);

      me._createTexts(opt);
    }
  }, {
    key: "_getBottomPointList",
    value: function _getBottomPointList() {
      var _this3 = this;

      if (!this._bottomField) return [];

      var _coord = this._graphs.app.getCoord();

      var bottomData = this._graphs.dataFrame.getFieldData(this._bottomField);

      this._yAxis.addValToSection(bottomData); //把bottomData的数据也同步到y轴的dataSection, 可能y轴需要更新


      var _bottomPointList = [];
      bottomData.forEach(function (item, i) {
        var point = _coord.getPoint({
          iNode: i,
          field: _this3.field,
          value: {
            //x:
            y: item
          }
        });

        _bottomPointList.push([point.pos.x, point.pos.y]);
      });
      return _bottomPointList;
    }
  }, {
    key: "_getFirstNode",
    value: function _getFirstNode() {
      var _firstNode = null;

      for (var i = 0, l = this.data.length; i < l; i++) {
        var nodeData = this.data[i];

        if (_.isNumber(nodeData.y)) {
          if (_firstNode === null || this.yAxisAlign == "right") {
            //_yAxis为右轴的话，
            _firstNode = nodeData;
          }

          if (this.yAxisAlign !== "right" && _firstNode !== null) {
            break;
          }
        }

        ;
      }

      return _firstNode;
    }
  }, {
    key: "_getFillStyle",
    value: function _getFillStyle() {
      var me = this;
      var fill_gradient = null;

      var _fillStyle;

      if (_.isArray(me.area.alpha)) {
        var _me$ctx;

        //alpha如果是数组，那么就是渐变背景，那么就至少要有两个值
        //如果拿回来的style已经是个gradient了，那么就不管了
        me.area.alpha.length = 2;

        if (me.area.alpha[0] == undefined) {
          me.area.alpha[0] = 0;
        }

        ;

        if (me.area.alpha[1] == undefined) {
          me.area.alpha[1] = 0;
        }

        ;

        var lps = this._getLinearGradientPoints('area');

        if (!lps) return; //创建一个线性渐变

        fill_gradient = (_me$ctx = me.ctx).createLinearGradient.apply(_me$ctx, (0, _toConsumableArray2["default"])(lps));
        var areaStyle = me.area.fillStyle || me.line.strokeStyle || me.color;
        var rgb = (0, _color.colorRgb)(areaStyle);
        var rgba0 = rgb.replace(')', ', ' + me._getProp(me.area.alpha[0]) + ')').replace('RGB', 'RGBA');
        fill_gradient.addColorStop(0, rgba0);
        var rgba1 = rgb.replace(')', ', ' + me.area.alpha[1] + ')').replace('RGB', 'RGBA');
        fill_gradient.addColorStop(1, rgba1);
        _fillStyle = fill_gradient;
      }

      ; //也可以传入一个线性渐变

      if (this.area.fillStyle && this.area.fillStyle.lineargradient) {
        var _me$ctx2;

        var lineargradient = this.area.fillStyle.lineargradient; //如果是右轴的话，渐变色要对应的反转

        if (this.yAxisAlign == 'right') {
          lineargradient = lineargradient.reverse();
        }

        ; //如果用户配置 填充是一个线性渐变

        var _lps = this._getLinearGradientPoints('area');

        if (!_lps) return;
        fill_gradient = (_me$ctx2 = me.ctx).createLinearGradient.apply(_me$ctx2, (0, _toConsumableArray2["default"])(_lps));

        _.each(lineargradient, function (item) {
          fill_gradient.addColorStop(item.position, item.color);
        });

        _fillStyle = fill_gradient;
      }

      if (!_fillStyle) {
        // _fillStyle 可以 接受渐变色，可以不用_getColor， _getColor会过滤掉渐变色
        _fillStyle = me._getProp(me.area.fillStyle) || me._getLineStrokeStyle(null, "area");
      }

      return _fillStyle;
    }
  }, {
    key: "_getLineStrokeStyle",
    value: function _getLineStrokeStyle(pointList) {
      var graphType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'line';
      var me = this;

      var _style;

      if (!this._opt.line || !this._opt.line.strokeStyle) {
        //如果用户没有配置line.strokeStyle，那么就用默认的
        return this.color;
      }

      ;
      var lineargradient = this._opt.line.strokeStyle.lineargradient;

      if (lineargradient) {
        var _me$ctx3;

        //如果是右轴的话，渐变色要对应的反转
        if (this.yAxisAlign == 'right') {
          lineargradient = lineargradient.reverse();
        }

        ; //如果用户配置 填充是一个线性渐变

        var lps = this._getLinearGradientPoints(graphType, pointList);

        if (!lps) return;
        _style = (_me$ctx3 = me.ctx).createLinearGradient.apply(_me$ctx3, (0, _toConsumableArray2["default"])(lps));

        _.each(lineargradient, function (item) {
          _style.addColorStop(item.position, item.color);
        });

        return _style;
      } else {
        _style = this._getColor(this._opt.line.strokeStyle);
        return _style;
      }
    }
  }, {
    key: "_getLinearGradientPoints",
    value: function _getLinearGradientPoints() {
      var graphType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'line';
      var pointList = arguments.length > 1 ? arguments[1] : undefined;
      //如果graphType 传入的是area，并且，用户并没有配area.lineargradientDriction,那么就会默认和line.lineargradientDriction对齐
      var driction = this[graphType].lineargradientDriction || this.line.lineargradientDriction;
      !pointList && (pointList = this._line.context.pointList);
      var linearPointStart, linearPointEnd;

      if (driction == 'topBottom') {
        //top -> bottom
        var topX = 0,
            topY = 0,
            bottomX = 0,
            bottomY = 0;

        for (var i = 0, l = pointList.length; i < l; i++) {
          var point = pointList[i];
          var y = point[1];

          if (!isNaN(y)) {
            topY = Math.min(y, topY);
            bottomY = Math.max(y, bottomY);
          }
        }

        linearPointStart = {
          x: topX,
          y: topY
        };
        linearPointEnd = {
          x: bottomX,
          y: bottomY
        };

        if (graphType == 'area') {
          //面积图的话，默认就需要一致绘制到底的x轴位置去了
          linearPointEnd.y = 0;
        }
      } else {
        //left->right
        var leftX,
            rightX,
            leftY = 0,
            rightY = 0;

        for (var _i = 0, _l = pointList.length; _i < _l; _i++) {
          var _point2 = pointList[_i];
          var x = _point2[0];
          var _y = _point2[1];

          if (!isNaN(x) && !isNaN(_y)) {
            if (leftX == undefined) {
              leftX = x;
            } else {
              leftX = Math.min(x, leftX);
            }

            rightX = Math.max(x, leftX);
          }
        }

        ;
        linearPointStart = {
          x: leftX,
          y: leftY
        };
        linearPointEnd = {
          x: rightX,
          y: rightY
        };
      }

      if (linearPointStart.x == undefined || linearPointStart.y == undefined || linearPointEnd.x == undefined || linearPointEnd.y == undefined) {
        return null;
      }

      return [linearPointStart.x, linearPointStart.y, linearPointEnd.x, linearPointEnd.y];
    }
  }, {
    key: "_createNodes",
    value: function _createNodes() {
      var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var me = this;
      var list = me._currPointList;
      var iNode = 0; //这里不能和下面的a对等，以为list中有很多无效的节点

      for (var a = 0, al = list.length; a < al; a++) {
        var _nodeColor = me._getColor(me.node.strokeStyle || me.color, a);

        me.data[a].color = _nodeColor; //回写回data里，tips的是用的到

        var nodeEnabled = me.node.enabled;

        if (list.length == 1 && !nodeEnabled) {
          nodeEnabled = true; //只有一个数据的时候， 强制显示node
        } // if( !nodeEnabled ){
        //     //不能写return， 是因为每个data的color还是需要计算一遍
        //     continue;
        // };


        var _point = me._currPointList[a];

        if (!_point || !_.isNumber(_point[1])) {
          //折线图中有可能这个point为undefined
          continue;
        }

        ;
        var x = _point[0];
        var y = _point[1];
        var globalAlpha = 0;

        if (this.clipRect && me._growed) {
          var clipRectCtx = this.clipRect.context;

          if (x >= clipRectCtx.x && x <= clipRectCtx.x + clipRectCtx.width) {
            globalAlpha = 1;
          }
        }

        ;
        var lineWidth = me.node.lineWidth || me.line.lineWidth;
        var context = {
          x: x,
          y: y,
          r: me._getProp(me.node.radius, a),
          lineWidth: me._getProp(lineWidth, a) || 2,
          strokeStyle: _nodeColor,
          fillStyle: me._getProp(me.node.fillStyle, a) || _nodeColor,
          visible: nodeEnabled && !!me._getProp(me.node.visible, a),
          globalAlpha: globalAlpha
        };
        var nodeConstructor = Circle;

        var _shapeType = me._getProp(me.node.shapeType, a);

        if (_shapeType == "isogon") {
          nodeConstructor = Isogon;
          context.n = me._getProp(me.node.isogonPointNum, a);
        }

        ;

        if (_shapeType == "path") {
          nodeConstructor = Path;
          context.path = me._getProp(me.node.path, a);
        }

        ;
        var nodeEl = me._nodes.children[iNode]; //同一个元素，才能直接extend context

        if (nodeEl) {
          if (nodeEl.type == _shapeType) {
            _.extend(nodeEl.context, context);
          } else {
            nodeEl.destroy(); //重新创建一个新的元素放到相同位置

            nodeEl = new nodeConstructor({
              context: context
            });

            me._nodes.addChildAt(nodeEl, iNode);
          }

          ;
        } else {
          nodeEl = new nodeConstructor({
            context: context
          });

          me._nodes.addChild(nodeEl);
        }

        ;

        if (me.node.corner) {
          //拐角才有节点
          var _y2 = me._pointList[a][1];
          var pre = me._pointList[a - 1];
          var next = me._pointList[a + 1];

          if (pre && next) {
            if (_y2 == pre[1] && _y2 == next[1]) {
              nodeEl.context.visible = false;
            }
          }
        }

        ;
        me.data[a].nodeEl = nodeEl;
        iNode++;
      }

      ; //把过多的节点删除了

      if (me._nodes.children.length > iNode) {
        for (var i = iNode, l = me._nodes.children.length; i < l; i++) {
          me._nodes.children[i].destroy();

          i--;
          l--;
        }
      }

      ;
    }
  }, {
    key: "_createTexts",
    value: function _createTexts() {
      var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var me = this;
      var list = me._currPointList;

      var _coord = this._graphs.app.getCoord();

      if (me.label.enabled) {
        //节点上面的文本info
        var iNode = 0; //这里不能和下面的a对等，以为list中有很多无效的节点

        for (var a = 0, al = list.length; a < al; a++) {
          var _point = list[a];

          if (!_point || !_.isNumber(_point[1])) {
            //折线图中有可能这个point为undefined
            continue;
          }

          ;
          var x = _point[0];
          var y = _point[1] - this.node.radius - 2;
          var globalAlpha = 0;

          if (this.clipRect && opt._growed) {
            var clipRectCtx = this.clipRect.context;

            if (x >= clipRectCtx.x && x <= clipRectCtx.x + clipRectCtx.width) {
              globalAlpha = 1;
            }
          }

          ;
          var context = {
            x: x,
            y: y,
            fontSize: this.label.fontSize,
            textAlign: this.label.textAlign,
            textBaseline: this.label.textBaseline,
            fillStyle: me._getColor(me.label.fontColor, a),
            lineWidth: 1,
            strokeStyle: "#ffffff",
            globalAlpha: globalAlpha
          };
          var nodeData = me.data[a];
          var value = nodeData.value;

          if (me.label.format) {
            //如果有单独给label配置format，就用label上面的配置
            if (_.isFunction(me.label.format)) {
              value = me.label.format.apply(me, [value, nodeData]);
            }

            if (typeof me.label.format == 'string') {
              value = (0, _numeral["default"])(value).format(me.label.format);
            }
          } else {
            //否则用fieldConfig上面的
            var fieldConfig = _coord.getFieldConfig(this.field);

            if (fieldConfig) {
              value = fieldConfig.getFormatValue(value);
            }

            ;
          }

          ;

          if (value == undefined || value == null) {
            continue;
          }

          ;
          var _label = this._labels.children[iNode];

          if (_label) {
            _label.resetText(value);

            _.extend(_label.context, context);
          } else {
            _label = new _canvax["default"].Display.Text(value, {
              context: context
            });

            me._labels.addChild(_label);

            me._checkTextPos(_label, a);
          }

          iNode++;
        }

        ; //把过多的label节点删除了

        if (me._labels.children.length > iNode) {
          for (var i = iNode, l = me._labels.children.length; i < l; i++) {
            me._labels.children[i].destroy();

            i--;
            l--;
          }
        }

        ;
      }

      ;
    }
  }, {
    key: "_checkTextPos",
    value: function _checkTextPos(_label, ind) {
      var me = this;
      var list = me._currPointList;
      var pre = list[ind - 1];
      var next = list[ind + 1];

      if (pre && next && pre[1] < _label.context.y && next[1] < _label.context.y) {
        _label.context.y += 12;
        _label.context.textBaseline = "top";
      }
    }
  }, {
    key: "_getFillPath",
    value: function _getFillPath(line, bottomLine) {
      //填充
      var pointList = _.clone(line.context.pointList);

      var bottomPointList = bottomLine ? _.clone(bottomLine.context.pointList) : [];
      var path = "";
      var originPos = -this._yAxis.originPos;
      var _currPath = null;

      _.each(pointList, function (point, i) {
        if (_.isNumber(point[1])) {
          if (_currPath === null) {
            _currPath = [];
          }

          _currPath.push(point);
        } else {
          // not a number
          if (_currPath && _currPath.length) {
            getOnePath();
          }

          ;
        }

        if (i == pointList.length - 1 && _.isNumber(point[1])) {
          getOnePath();
        }
      });

      function getOnePath() {
        var _first = _currPath[0];
        var _firstIndex = null;
        var _last = _currPath[_currPath.length - 1];
        var _lastIndex = null;

        if (bottomPointList.length) {
          for (var _i2 = 0, l = bottomPointList.length; _i2 < l; _i2++) {
            var item = bottomPointList[_i2];

            if (_firstIndex != null && _lastIndex != null) {
              break;
            }

            if (_firstIndex == null && _first[0] == item[0]) {
              _firstIndex = _i2;
            }

            if (_lastIndex == null && _last[0] == item[0]) {
              _lastIndex = _i2;
            }
          }

          var i = 0;

          while (i <= _lastIndex - _firstIndex) {
            _currPath.push(bottomPointList[_lastIndex - i]);

            i++;
          }

          _currPath.push([_first[0], _first[1]]);

          debugger;
        } else {
          _currPath.push([_last[0], originPos], [_first[0], originPos], [_first[0], _first[1]]);
        }

        path += (0, _tools.getPath)(_currPath);
        _currPath = null;
      }

      return path;
    } //根据x方向的 val来 获取对应的node， 这个node可能刚好是一个node， 也可能两个node中间的某个位置

  }, {
    key: "getNodeInfoOfX",
    value: function getNodeInfoOfX(x) {
      var me = this;
      var nodeInfo;

      for (var i = 0, l = this.data.length; i < l; i++) {
        if (this.data[i].value !== null && Math.abs(this.data[i].x - x) <= 1) {
          //左右相差不到1px的，都算
          nodeInfo = this.data[i];
          return nodeInfo;
        }
      }

      ;

      var getPointFromXInLine = function getPointFromXInLine(x, line) {
        var p = {
          x: x,
          y: 0
        };
        p.y = line[0][1] + (line[1][1] - line[0][1]) / (line[1][0] - line[0][0]) * (x - line[0][0]);
        return p;
      };

      var point;

      var search = function search(points) {
        if (x < points[0][0] || x > points.slice(-1)[0][0]) {
          return;
        }

        ;
        var midInd = parseInt(points.length / 2);

        if (Math.abs(points[midInd][0] - x) <= 1) {
          point = {
            x: points[midInd][0],
            y: points[midInd][1]
          };
          return;
        }

        ;
        var _pl = [];

        if (x > points[midInd][0]) {
          if (x < points[midInd + 1][0]) {
            point = getPointFromXInLine(x, [points[midInd], points[midInd + 1]]);
            return;
          } else {
            _pl = points.slice(midInd + 1);
          }
        } else {
          if (x > points[midInd - 1][0]) {
            point = getPointFromXInLine(x, [points[midInd - 1], points[midInd]]);
            return;
          } else {
            _pl = points.slice(0, midInd);
          }
        }

        ;
        search(_pl);
      };

      this._line && search(this._line.context.pointList);

      if (!point || point.y == undefined) {
        return null;
      }

      ; //和data 中数据的格式保持一致

      var node = {
        type: "line",
        iGroup: me.iGroup,
        iNode: -1,
        //并非data中的数据，而是计算出来的数据
        field: me.field,
        value: this._yAxis.getValOfPos(-point.y),
        x: point.x,
        y: point.y,
        rowData: null,
        //非data中的数据，没有rowData
        color: me._getProp(me.node.strokeStyle) || me._getLineStrokeStyle()
      };
      return node;
    }
  }, {
    key: "tipsPointerOf",
    value: function tipsPointerOf(e) {
      if (e.eventInfo) {
        var iNode = e.eventInfo.iNode;

        if (iNode != this.__currFocusInd && this.__currFocusInd != -1) {
          this.unfocusOf(this.__currFocusInd);
        }

        ;
        this.focusOf(e.eventInfo.iNode);
      }
    }
  }, {
    key: "tipsPointerHideOf",
    value: function tipsPointerHideOf(e) {
      if (e.eventInfo) {
        this.unfocusOf(e.eventInfo.iNode);
      }
    }
  }, {
    key: "focusOf",
    value: function focusOf(iNode) {
      var node = this.data[iNode];

      if (node) {
        var _node = node.nodeEl;

        if (_node && !node.focused && this.__currFocusInd != iNode) {
          //console.log( 'focusOf' )
          _node._fillStyle = _node.context.fillStyle;
          _node.context.fillStyle = 'white';
          _node.context.r += _node.context.lineWidth / 2;
          _node._visible = _node.context.visible;
          _node.context.visible = true;

          var _focusNode = _node.clone();

          this._focusNodes.addChild(_focusNode); //_focusNode.context.r += 6;


          _focusNode.context.visible = true;
          _focusNode.context.lineWidth = 0; //不需要描边

          _focusNode.context.fillStyle = _node.context.strokeStyle;
          _focusNode.context.globalAlpha = this.node.focus.alpha;

          _focusNode.animate({
            r: _focusNode.context.r + this.node.focus.radiusDiff
          }, {
            duration: 300
          });

          this.__currFocusInd = iNode;
        }

        node.focused = true;
      }
    }
  }, {
    key: "unfocusOf",
    value: function unfocusOf(iNode) {
      if (this.__currFocusInd > -1) {
        iNode = this.__currFocusInd;
      }

      ;
      var node = this.data[iNode];

      if (node) {
        this._focusNodes.removeAllChildren();

        var _node = node.nodeEl;

        if (_node && node.focused) {
          //console.log('unfocus')
          _node.context.fillStyle = _node._fillStyle;
          _node.context.r -= _node.context.lineWidth / 2;
          _node.context.visible = _node._visible;
          node.focused = false;
          this.__currFocusInd = -1;
        }

        ;
      }
    }
  }], [{
    key: "defaultProps",
    value: function defaultProps() {
      return {
        line: {
          detail: '线配置',
          propertys: {
            enabled: {
              detail: '是否开启',
              "default": true
            },
            growDriction: {
              detail: '生长动画的方向，默认为从左到右（leftRgiht）,可选rightLeft',
              "default": 'leftRight'
            },
            strokeStyle: {
              detail: '线的颜色',
              "default": undefined //不会覆盖掉constructor中的定义

            },
            lineargradientDriction: {
              detail: '线的填充色是渐变对象的话，这里用来描述方向，默认从上到下（topBottom）,可选leftRight',
              "default": 'topBottom' //可选 leftRight

            },
            lineWidth: {
              detail: '线的宽度',
              "default": 2
            },
            lineType: {
              detail: '线的样式',
              "default": 'solid'
            },
            lineDash: {
              detail: '虚线的线段样式，默认[6,3]',
              "default": [2, 5]
            },
            smooth: {
              detail: '是否平滑处理',
              "default": true
            },
            curvature: {
              detail: '折线smooth为true的时候，配置的曲率，默认 0.25',
              "default": undefined
            },
            shadowOffsetX: {
              detail: '折线的X方向阴影偏移量',
              "default": 0
            },
            shadowOffsetY: {
              detail: '折线的Y方向阴影偏移量',
              "default": 4
            },
            shadowBlur: {
              detail: '折线的阴影模糊效果',
              "default": 0
            },
            shadowColor: {
              detail: '折线的阴影颜色，默认和折线的strokeStyle同步， 如果strokeStyle是一个渐变色，那么shadowColor就会失效，变成默认的黑色，需要手动设置该shadowColor',
              "default": null
            }
          }
        },
        node: {
          detail: '单个数据节点配置，对应线上的小icon图形',
          propertys: {
            enabled: {
              detail: '是否开启',
              "default": true
            },
            shapeType: {
              detail: '节点icon的图形类型，默认circle',
              documentation: '可选有"isogon"(正多边形)，"path"（自定义path路径，待实现）',
              "default": 'circle'
            },
            isogonPointNum: {
              detail: 'shapeType为"isogon"时有效，描述正多边形的边数',
              "default": 3
            },
            path: {
              detail: 'shapeType为path的时候，描述图形的path路径',
              "default": null
            },
            corner: {
              detail: '拐角才有节点',
              "default": false
            },
            radius: {
              detail: '节点半径',
              "default": 3
            },
            fillStyle: {
              detail: '节点图形的背景色',
              "default": null
            },
            strokeStyle: {
              detail: '节点图形的描边色，默认和line.strokeStyle保持一致',
              "default": null
            },
            lineWidth: {
              detail: '节点图形边宽大小,默认跟随line.lineWidth',
              "default": null
            },
            visible: {
              detail: '节点是否显示,支持函数',
              "default": true
            },
            focus: {
              detail: "节点hover态设置",
              propertys: {
                radiusDiff: {
                  detail: 'hover后的背景节点半径相差，正数为变大值,默认为4',
                  "default": 4
                },
                alpha: {
                  detail: 'hover后的背景节点透明度，默认为0.5',
                  "default": 0.5
                }
              }
            }
          }
        },
        label: {
          detail: '文本配置',
          propertys: {
            enabled: {
              detail: '是否开启',
              "default": false
            },
            fontColor: {
              detail: '文本颜色',
              "default": null
            },
            strokeStyle: {
              detail: '文本描边色',
              "default": null
            },
            fontSize: {
              detail: '文本字体大小',
              "default": 12
            },
            format: {
              detail: '文本格式化处理函数',
              "default": null
            },
            textAlign: {
              detail: '水平布局方式',
              "default": 'center'
            },
            textBaseline: {
              detail: '垂直布局方式',
              "default": 'bottom'
            }
          }
        },
        area: {
          detail: '面积区域配置',
          propertys: {
            enabled: {
              detail: '是否开启',
              "default": true
            },
            lineargradientDriction: {
              detail: '面积的填充色是渐变对象的话，这里用来描述方向，默认null(就会从line中取),从上到下（topBottom）,可选leftRight',
              "default": null //默认null（就会和line保持一致），可选 topBottom leftRight

            },
            fillStyle: {
              detail: '面积背景色',
              "default": null
            },
            alpha: {
              detail: '面积透明度',
              "default": 0.25
            },
            bottomLine: {
              detail: 'area的底部线配置',
              propertys: {
                enabled: {
                  detail: '是否开启',
                  "default": true
                }
              }
            }
          }
        }
      };
    }
  }]);
  return LineGraphsGroup;
}(event.Dispatcher);

exports["default"] = LineGraphsGroup;