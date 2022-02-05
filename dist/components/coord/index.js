"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _component = _interopRequireDefault(require("../component"));

var _canvax = _interopRequireDefault(require("canvax"));

var _tools = require("../../utils/tools");

var _numeral = _interopRequireDefault(require("numeral"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var _ = _canvax["default"]._;

var coordBase = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(coordBase, _Component);

  var _super = _createSuper(coordBase);

  function coordBase(opt, app) {
    var _this;

    (0, _classCallCheck2["default"])(this, coordBase);
    _this = _super.call(this, opt, app);

    _.extend(true, (0, _assertThisInitialized2["default"])(_this), (0, _tools.getDefaultProps)(coordBase.defaultProps()));

    _this.name = "coord";
    _this._opt = opt;
    _this.app = app;
    _this.dataFrame = _this.app.dataFrame;
    _this.sprite = new _canvax["default"].Display.Sprite({
      name: "coord_" + opt.type
    });

    _this.app.coordSprite.addChild(_this.sprite);
    /*
    吧原始的field转换为对应结构的显示树
    ["uv"] --> [
        {field:'uv',enabled:true ,yAxis: yAxisleft }
        ...
    ]
    */


    _this.fieldsMap = null;
    _this.induce = null;
    _this._axiss = []; //所有轴的集合

    return _this;
  } //和原始field结构保持一致，但是对应的field换成 {field: , enabled:...}结构


  (0, _createClass2["default"])(coordBase, [{
    key: "setFieldsMap",
    value: function setFieldsMap(axisExp) {
      var me = this;
      var ind = 0;
      var axisType = axisExp.type || "yAxis";
      var fieldsArr = [];

      _.each(this.getAxiss(axisExp), function (_axis) {
        if (_axis.field) {
          fieldsArr = fieldsArr.concat(_axis.field);
        }

        ;
      });

      var graphs = _.flatten([this.app._opt.graphs]);

      function _set(fields) {
        if (_.isString(fields)) {
          fields = [fields];
        }

        ;

        var clone_fields = _.clone(fields);

        var _loop = function _loop(i, l) {
          var field = fields[i];

          if (_.isString(field)) {
            var color = me.app.getTheme(ind);
            var graph;
            var graphFieldInd;
            var graphColorProp; //graphs.find( graph => {_.flatten([graph.field]).indexOf( field )} ).color;

            for (var _i = 0, _l = graphs.length; _i < _l; _i++) {
              graph = graphs[_i];
              graphFieldInd = _.flatten([graph.field]).indexOf(field);

              if (graphFieldInd > -1) {
                graphColorProp = graph.color;
                break;
              }
            }

            ;

            if (graphColorProp) {
              if (typeof graphColorProp == 'string') {
                color = graphColorProp;
              }

              if (Array.isArray(graphColorProp)) {
                color = graphColorProp[graphFieldInd];
              }

              if (typeof graphColorProp == 'function') {
                color = graphColorProp.apply(me.app, [graph]);
              }
            }

            ;
            var config = me.fieldsConfig[field];

            var fieldItem = _objectSpread({
              field: field,
              name: field,
              //fieldConfig中可能会覆盖
              enabled: true,
              color: color,
              ind: ind++
            }, me.fieldsConfig[field] || {});

            fieldItem.getFormatValue = function (value) {
              if (config && config.format) {
                if (typeof config.format == 'string') {
                  //如果传入的是 字符串，那么就认为是 numeral 的格式字符串
                  value = (0, _numeral["default"])(value).format(config.format);
                }

                if (typeof config.format == 'function') {
                  //如果传入的是 字符串，那么就认为是 numeral 的格式字符串
                  value = config.format.apply(me, {
                    field: field
                  });
                }
              } else {
                value = (0, _typeof2["default"])(value) == "object" ? JSON.stringify(value) : (0, _numeral["default"])(value).format('0,0');
              }

              ;
              return value;
            };

            fieldItem[axisType] = me.getAxis({
              type: axisType,
              field: field
            });
            clone_fields[i] = fieldItem;
          }

          ;

          if (_.isArray(field)) {
            clone_fields[i] = _set(field, ind);
          }

          ;
        };

        for (var i = 0, l = fields.length; i < l; i++) {
          _loop(i, l);
        }

        ;
        return clone_fields;
      }

      ;
      return _set(fieldsArr);
    } //设置 fieldsMap 中对应field 的 enabled状态

  }, {
    key: "setFieldEnabled",
    value: function setFieldEnabled(field) {
      var me = this;

      function set(maps) {
        _.each(maps, function (map) {
          if (_.isArray(map)) {
            set(map);
          } else if (map.field && map.field == field) {
            map.enabled = !map.enabled;
          }
        });
      }

      set(me.fieldsMap);
    } //从FieldsMap中获取对应的config

  }, {
    key: "getFieldConfig",
    value: function getFieldConfig(field) {
      var me = this;
      var fieldConfig = null;

      function get(maps) {
        _.each(maps, function (map) {
          if (_.isArray(map)) {
            get(map);
          } else if (map.field && map.field == field) {
            fieldConfig = map;
            return false;
          }
        });
      }

      get(me.fieldsMap);
      return fieldConfig;
    } //从 fieldsMap 中过滤筛选出来一个一一对应的 enabled为true的对象结构
    //这个方法还必须要返回的数据里描述出来多y轴的结构。否则外面拿到数据后并不好处理那个数据对应哪个轴

  }, {
    key: "getEnabledFieldsOf",
    value: function getEnabledFieldsOf(axis) {
      var enabledFields = [];
      var axisType = axis ? axis.type : "yAxis";

      _.each(this.fieldsMap, function (bamboo) {
        if (_.isArray(bamboo)) {
          //多节竹子，堆叠
          var fields = []; //设置完fields后，返回这个group属于left还是right的axis

          _.each(bamboo, function (obj) {
            if (obj[axisType] === axis && obj.field && obj.enabled) {
              fields.push(obj.field);
            }
          });

          fields.length && enabledFields.push(fields);
        } else {
          //单节棍
          if (bamboo[axisType] === axis && bamboo.field && bamboo.enabled) {
            enabledFields.push(bamboo.field);
          }
        }

        ;
      });

      return enabledFields;
    } //如果有传参数 fields 进来，那么就把这个指定的 fields 过滤掉 enabled==false的field
    //只留下enabled的field 结构

  }, {
    key: "filterEnabledFields",
    value: function filterEnabledFields(fields) {
      var me = this;
      var arr = [];
      if (!_.isArray(fields)) fields = [fields];

      _.each(fields, function (f) {
        if (!_.isArray(f)) {
          if (me.getFieldConfig(f).enabled) {
            arr.push(f);
          }
        } else {
          //如果这个是个纵向数据，说明就是堆叠配置
          var varr = [];

          _.each(f, function (v_f) {
            if (me.getFieldConfig(v_f).enabled) {
              varr.push(v_f);
            }
          });

          if (varr.length) {
            arr.push(varr);
          }
        }
      });

      return arr;
    }
  }, {
    key: "getAxisDataFrame",
    value: function getAxisDataFrame(fields) {
      return {
        field: fields,
        org: this.dataFrame.getDataOrg(fields, function (val) {
          if (val === undefined || val === null || val == "") {
            return val;
          }

          return isNaN(Number(val)) ? val : Number(val);
        })
      };
    }
  }, {
    key: "hide",
    value: function hide(field) {
      this.changeFieldEnabled(field);
    }
  }, {
    key: "show",
    value: function show(field) {
      this.changeFieldEnabled(field);
    }
  }, {
    key: "getSizeAndOrigin",
    value: function getSizeAndOrigin() {
      return {
        width: this.width,
        height: this.height,
        origin: this.origin
      };
    }
    /**
     * @param { opt.field  } field 用来查找对应的yAxis
     * @param { opt.iNode  } iNode 用来查找对应的xaxis的value
     * @param { opt.value {xval: yval:} }
     */

  }, {
    key: "getPoint",
    value: function getPoint() {}
  }, {
    key: "getAxisOriginPoint",
    value: function getAxisOriginPoint() {}
  }, {
    key: "getOriginPos",
    value: function getOriginPos() {} //获取对应轴的接口

  }, {
    key: "getAxis",
    value: function getAxis(opt) {
      var axiss = this.getAxiss(opt);
      return axiss[0];
    }
  }, {
    key: "getAxiss",
    value: function getAxiss(opt) {
      var arr = [];
      var expCount = Object.keys(opt).length;

      _.each(this._axiss, function (item) {
        var i = 0;

        for (var p in opt) {
          if (p == 'field') {
            (function () {
              //字段的判断条件不同
              var fs = _.flatten([item[p]]);

              var expFs = _.flatten([opt[p]]);

              var inFs = true;

              _.each(expFs, function (exp) {
                if (_.indexOf(fs, exp) == -1) {
                  //任何一个field不再fs内， 说明配对不成功
                  inFs = false;
                }
              });

              if (inFs) {
                i++;
              }

              ;
            })();
          } else {
            if (JSON.stringify(item[p]) == JSON.stringify(opt[p])) {
              i++;
            }

            ;
          }

          ;
        }

        ;

        if (expCount == i) {
          arr.push(item);
        }

        ;
      });

      return arr;
    }
  }], [{
    key: "defaultProps",
    value: function defaultProps() {
      return {
        type: {
          detail: '坐标系组件',
          documentation: "坐标系组件，可选值有'rect'（二维直角坐标系）,'polar'（二维极坐标系）,'box'（三维直角坐标系） ",
          insertText: "type: ",
          "default": "",
          values: ["rect", "polar", "box", "polar3d"]
        },
        width: {
          detail: '坐标系width',
          "default": 0
        },
        height: {
          detail: '坐标系height',
          "default": 0
        },
        origin: {
          detail: '坐标系原点',
          propertys: {
            x: {
              detail: '原点x位置',
              "default": 0
            },
            y: {
              detail: '原点x位置',
              "default": 0
            }
          }
        },
        fieldsConfig: {
          detail: '字段的配置信息({uv:{name:"",format:""}})，包括中文名称和格式化单位，内部使用numeral做格式化',
          "default": {}
        }
      };
    }
  }]);
  return coordBase;
}(_component["default"]);

exports["default"] = coordBase;