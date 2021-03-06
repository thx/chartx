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

var _group = _interopRequireDefault(require("./group"));

var _index = _interopRequireDefault(require("../index"));

var _canvax = require("canvax");

var _tools = require("../../../utils/tools");

var LineGraphs =
/*#__PURE__*/
function (_GraphsBase) {
  (0, _inherits2["default"])(LineGraphs, _GraphsBase);
  (0, _createClass2["default"])(LineGraphs, null, [{
    key: "defaultProps",
    value: function defaultProps() {
      return {
        field: {
          detail: '字段配置，支持二维数组格式',
          "default": null
        },
        yAxisAlign: {
          detail: '绘制在哪根y轴上面',
          "default": 'left'
        },
        _props: [_group["default"]]
      };
    }
  }]);

  function LineGraphs(opt, app) {
    var _this;

    (0, _classCallCheck2["default"])(this, LineGraphs);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(LineGraphs).call(this, opt, app));
    _this.type = "line";
    _this.enabledField = null;
    _this.groups = []; //群组集合

    _canvax._.extend(true, (0, _assertThisInitialized2["default"])(_this), (0, _tools.getDefaultProps)(LineGraphs.defaultProps()), opt);

    _this.init();

    return _this;
  }

  (0, _createClass2["default"])(LineGraphs, [{
    key: "init",
    value: function init() {}
  }, {
    key: "draw",
    value: function draw(opt) {
      !opt && (opt = {});
      this.width = opt.width;
      this.height = opt.height;

      _canvax._.extend(true, this.origin, opt.origin);

      this.sprite.context.x = this.origin.x;
      this.sprite.context.y = this.origin.y;
      this.data = this._trimGraphs();

      this._setGroupsForYfield(this.data, null, opt); //this.grow();


      if (this.animation && !opt.resize) {
        this.grow();
      } else {
        this.fire("complete");
      }

      return this;
    }
  }, {
    key: "resetData",
    value: function resetData(dataFrame, dataTrigger) {
      var me = this;

      if (dataFrame) {
        me.dataFrame = dataFrame;
        me.data = me._trimGraphs();
      }

      ;

      _canvax._.each(me.groups, function (g) {
        g.resetData(me.data[g.field].data, dataTrigger);
      });
    }
  }, {
    key: "setEnabledField",
    value: function setEnabledField() {
      //要根据自己的 field，从enabledFields中根据enabled数据，计算一个 enabled版本的field子集
      this.enabledField = this.app.getComponent({
        name: 'coord'
      }).filterEnabledFields(this.field);
    } //dataFrame

  }, {
    key: "_trimGraphs",
    value: function _trimGraphs() {
      var me = this;

      var _coord = this.app.getComponent({
        name: 'coord'
      }); //{"uv":{}.. ,"click": "pv":]}
      //这样按照字段摊平的一维结构


      var tmpData = {};
      me.setEnabledField();

      _canvax._.each(_canvax._.flatten(me.enabledField), function (field, i) {
        //let maxValue = 0;
        var fieldMap = me.app.getComponent({
          name: 'coord'
        }).getFieldMapOf(field); //单条line的全部data数据

        var _lineData = me.dataFrame.getFieldData(field);

        if (!_lineData) return; //console.log( JSON.stringify( _lineData ) )

        var _data = [];

        for (var b = 0, bl = _lineData.length; b < bl; b++) {
          //返回一个和value的结构对应的point结构{x:  y: }
          var point = _coord.getPoint({
            iNode: b,
            field: field,
            value: {
              //x:
              y: _lineData[b]
            }
          });

          var node = {
            type: "line",
            iGroup: i,
            iNode: b,
            field: field,
            value: _lineData[b],
            x: point.pos.x,
            y: point.pos.y,
            rowData: me.dataFrame.getRowDataAt(b),
            color: fieldMap.color //默认设置皮肤颜色，动态的在group里面会被修改

          };

          _data.push(node);
        }

        ;
        tmpData[field] = {
          yAxis: fieldMap.yAxis,
          field: field,
          data: _data
        };
      });

      return tmpData;
    }
    /**
     * 生长动画
     */

  }, {
    key: "grow",
    value: function grow(callback) {
      var gi = 0;
      var gl = this.groups.length;
      var me = this;

      _canvax._.each(this.groups, function (g) {
        g._grow(function () {
          gi++;
          callback && callback(g);

          if (gi == gl) {
            me.fire("complete");
          }
        });
      });

      return this;
    }
  }, {
    key: "show",
    value: function show(field) {
      var me = this; //过渡优化，有field的状态变化，可能就y轴的数据区间都有了变化，这里的优化就成了bug，所有的field都需要绘制一次
      //这个field不再这个graphs里面的，不相关
      // if( _.indexOf( _.flatten( [me.field] ), field ) == -1 ){
      //     return;
      // };

      this.data = this._trimGraphs();

      this._setGroupsForYfield(this.data, field);

      _canvax._.each(this.groups, function (g) {
        g.resetData(me.data[g.field].data);
      });
    }
  }, {
    key: "hide",
    value: function hide(field) {
      var me = this;
      var i = me.getGroupIndex(field);

      if (i > -1) {
        this.groups.splice(i, 1)[0].destroy(); //return; //这里不能直接return，和上面的show一样，同样的属于过渡优化，因为这个时候y轴的值域可能变了， 其他的graphs需要重新绘制
      }

      ;
      this.data = this._trimGraphs();

      _canvax._.each(this.groups, function (g) {
        g.resetData(me.data[g.field].data);
      });
    }
  }, {
    key: "getGroupIndex",
    value: function getGroupIndex(field) {
      var ind = -1;

      for (var i = 0, l = this.groups.length; i < l; i++) {
        if (this.groups[i].field === field) {
          ind = i;
          break;
        }
      }

      return ind;
    }
  }, {
    key: "getGroup",
    value: function getGroup(field) {
      return this.groups[this.getGroupIndex(field)];
    }
  }, {
    key: "_setGroupsForYfield",
    value: function _setGroupsForYfield(data, fields, opt) {
      var me = this;
      !opt && (opt = {});

      if (fields) {
        //如果有传入field参数，那么就说明只需要从data里面挑选指定的field来添加
        //一般用在add()执行的时候
        fields = _canvax._.flatten([fields]);
      }

      var _flattenField = _canvax._.flatten([this.field]);

      _canvax._.each(data, function (g, field) {
        if (fields && _canvax._.indexOf(fields, field) == -1) {
          //如果有传入fields，但是当前field不在fields里面的话，不需要处理
          //说明该group已经在graphs里面了
          return;
        }

        ;
        var fieldMap = me.app.getComponent({
          name: 'coord'
        }).getFieldMapOf(field); //iGroup 是这条group在本graphs中的ind，而要拿整个图表层级的index， 就是fieldMap.ind

        var iGroup = _canvax._.indexOf(_flattenField, field);

        var group = new _group["default"](fieldMap, iGroup, //不同于fieldMap.ind
        me._opt, me.ctx, me.height, me.width, me);
        group.draw({
          animation: me.animation && !opt.resize
        }, g.data);
        var insert = false; //在groups数组中插入到比自己_groupInd小的元素前面去

        for (var gi = 0, gl = me.groups.length; gi < gl; gi++) {
          if (iGroup < me.groups[gi].iGroup) {
            me.groups.splice(gi, 0, group);
            insert = true;
            me.sprite.addChildAt(group.sprite, gi);
            break;
          }
        }

        ; //否则就只需要直接push就好了

        if (!insert) {
          me.groups.push(group);
          me.sprite.addChild(group.sprite);
        }

        ;
      });
    }
  }, {
    key: "getNodesAt",
    value: function getNodesAt(ind, e) {
      var _nodesInfoList = []; //节点信息集合

      _canvax._.each(this.groups, function (group) {
        var node = group.getNodeInfoAt(ind, e);
        node && _nodesInfoList.push(node);
      });

      return _nodesInfoList;
    }
  }, {
    key: "getNodesOfPos",
    value: function getNodesOfPos(x) {
      var _nodesInfoList = []; //节点信息集合

      _canvax._.each(this.groups, function (group) {
        var node = group.getNodeInfoOfX(x);
        node && _nodesInfoList.push(node);
      });

      return _nodesInfoList;
    }
  }]);
  return LineGraphs;
}(_index["default"]);

_index["default"].registerComponent(LineGraphs, 'graphs', 'line');

var _default = LineGraphs;
exports["default"] = _default;