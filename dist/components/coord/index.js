"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../component", "canvax", "mmvis"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../component"), require("canvax"), require("mmvis"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.component, global.canvax, global.mmvis);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _component, _canvax, _mmvis) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _component2 = _interopRequireDefault(_component);

  var _canvax2 = _interopRequireDefault(_canvax);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  var coordBase = function (_Component) {
    _inherits(coordBase, _Component);

    _createClass(coordBase, null, [{
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
          }
        };
      }
    }]);

    function coordBase(opt, app) {
      var _this;

      _classCallCheck(this, coordBase);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(coordBase).call(this, opt, app));

      _mmvis._.extend(true, _assertThisInitialized(_this), (0, _mmvis.getDefaultProps)(coordBase.defaultProps()));

      _this.name = "coord";
      _this._opt = opt;
      _this.app = app;
      _this.dataFrame = _this.app.dataFrame;
      _this.sprite = new _canvax2["default"].Display.Sprite({
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


    _createClass(coordBase, [{
      key: "setFieldsMap",
      value: function setFieldsMap(axisExp) {
        var me = this;
        var fieldInd = 0;
        var axisType = axisExp.type || "yAxis";
        var fieldsArr = [];

        _mmvis._.each(this.getAxiss(axisExp), function (_axis) {
          if (_axis.field) {
            fieldsArr = fieldsArr.concat(_axis.field);
          }

          ;
        });

        function _set(fields) {
          if (_mmvis._.isString(fields)) {
            fields = [fields];
          }

          ;

          var clone_fields = _mmvis._.clone(fields);

          for (var i = 0, l = fields.length; i < l; i++) {
            if (_mmvis._.isString(fields[i])) {
              clone_fields[i] = {
                field: fields[i],
                enabled: true,
                //yAxis : me.getAxis({type:'yAxis', field:fields[i] }),
                color: me.app.getTheme(fieldInd),
                ind: fieldInd++
              };
              clone_fields[i][axisType] = me.getAxis({
                type: axisType,
                field: fields[i]
              });
            }

            ;

            if (_mmvis._.isArray(fields[i])) {
              clone_fields[i] = _set(fields[i], fieldInd);
            }

            ;
          }

          ;
          return clone_fields;
        }

        ;
        return _set(fieldsArr);
      }
    }, {
      key: "setFieldEnabled",
      value: function setFieldEnabled(field) {
        var me = this;

        function set(maps) {
          _mmvis._.each(maps, function (map, i) {
            if (_mmvis._.isArray(map)) {
              set(map);
            } else if (map.field && map.field == field) {
              map.enabled = !map.enabled;
            }
          });
        }

        set(me.fieldsMap);
      }
    }, {
      key: "getFieldMapOf",
      value: function getFieldMapOf(field) {
        var me = this;
        var fieldMap = null;

        function get(maps) {
          _mmvis._.each(maps, function (map, i) {
            if (_mmvis._.isArray(map)) {
              get(map);
            } else if (map.field && map.field == field) {
              fieldMap = map;
              return false;
            }
          });
        }

        get(me.fieldsMap);
        return fieldMap;
      }
    }, {
      key: "getEnabledFieldsOf",
      value: function getEnabledFieldsOf(axis) {
        var enabledFields = [];
        var axisType = axis ? axis.type : "yAxis";

        _mmvis._.each(this.fieldsMap, function (bamboo, b) {
          if (_mmvis._.isArray(bamboo)) {
            //多节竹子，堆叠
            var fields = []; //设置完fields后，返回这个group属于left还是right的axis

            _mmvis._.each(bamboo, function (obj, v) {
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
      }
    }, {
      key: "filterEnabledFields",
      value: function filterEnabledFields(fields) {
        var me = this;
        var arr = [];
        if (!_mmvis._.isArray(fields)) fields = [fields];

        _mmvis._.each(fields, function (f) {
          if (!_mmvis._.isArray(f)) {
            if (me.getFieldMapOf(f).enabled) {
              arr.push(f);
            }
          } else {
            //如果这个是个纵向数据，说明就是堆叠配置
            var varr = [];

            _mmvis._.each(f, function (v_f) {
              if (me.getFieldMapOf(v_f).enabled) {
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
    }, {
      key: "getPoint",
      value: function getPoint(opt) {}
    }, {
      key: "getAxisOriginPoint",
      value: function getAxisOriginPoint(exp) {}
    }, {
      key: "getOriginPos",
      value: function getOriginPos(exp) {}
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
        var expCount = 0;

        for (var p in opt) {
          expCount++;
        }

        ;

        _mmvis._.each(this._axiss, function (item) {
          var i = 0;

          for (var p in opt) {
            if (p == 'field') {
              //字段的判断条件不同
              var fs = _mmvis._.flatten([item[p]]);

              var expFs = _mmvis._.flatten([opt[p]]);

              var inFs = true;

              _mmvis._.each(expFs, function (exp) {
                if (_mmvis._.indexOf(fs, exp) == -1) {
                  //任何一个field不再fs内， 说明配对不成功
                  inFs = false;
                }
              });

              if (inFs) {
                i++;
              }

              ;
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
    }]);

    return coordBase;
  }(_component2["default"]);

  exports.default = coordBase;
});