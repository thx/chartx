"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _canvax = _interopRequireDefault(require("canvax"));

var _parse = _interopRequireDefault(require("./core/parse"));

var _setting = _interopRequireDefault(require("./setting"));

//图表皮肤
var _ = _canvax["default"]._,
    $ = _canvax["default"].$,
    AnimationFrame = _canvax["default"].AnimationFrame;
var globalTheme = ["#ff8533", "#73ace6", "#82d982", "#e673ac", "#cd6bed", "#8282d9", "#c0e650", "#e6ac73", "#6bcded", "#73e6ac", "#ed6bcd", "#9966cc"];
var components = {
  /*
  modules:{
      coord : {
          empty : ..,
          rect  : ..,
          ...
      },
      graphs : {
          //empty : .., //一般只有coord才会有empty
          bar   : ..,
          ...
      }
  },
  get: function( name, type ){}
  */
};
var _default = {
  chartxVersion: '1.1.121',
  create: function create(el, data, opt) {
    var otherOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var chart = null;
    var me = this;

    var _destroy = function _destroy() {
      me.instances[chart.id] = null;
      delete me.instances[chart.id];
    }; //这个el如果之前有绘制过图表，那么就要在instances中找到图表实例，然后销毁
    //小程序版本中外面会带id过来


    var chart_id = el.id || $.query(el).getAttribute("chart_id");

    if (chart_id != undefined) {
      var _chart = me.instances[chart_id];

      if (_chart) {
        _chart.destroy();

        _chart.off && _chart.off("destroy", _destroy);
      }

      ;
      delete me.instances[chart_id];
    }

    ;

    var componentModules = me._getComponentModules(); //如果用户没有配置coord，说明这个图表是一个默认目标系的图表，比如标签云


    var Chart = me._getComponentModule('chart'); //try {


    chart = new Chart(el, data, opt, componentModules, otherOptions);

    if (chart) {
      chart.draw();
      me.instances[chart.id] = chart;
      chart.on("destroy", _destroy);
    }

    ; //} catch(err){
    //    throw "Chatx Error：" + err
    //};

    return chart;
  },
  setGlobalTheme: function setGlobalTheme(colors) {
    globalTheme = colors;
  },
  getGlobalTheme: function getGlobalTheme() {
    return globalTheme;
  },
  parse: _parse["default"],
  instances: {},
  getChart: function getChart(chartId) {
    return this.instances[chartId];
  },
  resize: function resize() {
    //调用全局的这个resize方法，会把当前所有的 chart instances 都执行一遍resize
    for (var c in this.instances) {
      this.instances[c].resize();
    }
  },
  //第二个参数是用户要用来覆盖chartpark中的配置的options
  getOptionsOld: function getOptionsOld(chartPark_cid) {
    var JsonSerialize = {
      prefix: '[[JSON_FUN_PREFIX_',
      suffix: '_JSON_FUN_SUFFIX]]'
    };

    var parse = function parse(string) {
      return JSON.parse(string, function (key, value) {
        if (typeof value === 'string' && value.indexOf(JsonSerialize.suffix) > 0 && value.indexOf(JsonSerialize.prefix) == 0) {
          return new Function('return ' + value.replace(JsonSerialize.prefix, '').replace(JsonSerialize.suffix, ''))();
        }

        ;
        return value;
      }) || {};
    };

    return parse(decodeURIComponent(this.options[chartPark_cid] || '%7B%7D'));
  },
  getOptionsNew: function getOptionsNew(chartPark_cid, data, variables) {
    var chartConfig = this.options[chartPark_cid];
    var code = decodeURIComponent(chartConfig.code);
    var range = chartConfig.range;
    return _parse["default"].parse(code, range, data, variables);
  },

  /** 
   * 获取图表配置并解析
   * 
   * @param {int} chartPark_cid  chartpark图表id
   * @param {Object} userOptions 用户自定义图表options，若无chartPark_cid时默认使用该配置，否则使用该配置覆盖原chartpark中的图表配置
   * @param {Array} data 绘制图表使用的数据
   * @param {Object | Function} variables 用于覆盖chartpark图表配置的变量，为Function时，其返回值必须为Object
   * @returns {Object} 正常情况返回图表配置，否则返回{}
  */
  getOptions: function getOptions(chartPark_cid, userOptions, data, variables) {
    if (!this.options[chartPark_cid]) {
      return userOptions || {};
    }

    ;
    var chartConfig = this.options[chartPark_cid];
    var optionsFromChartPark = typeof chartConfig === 'string' ? this.getOptionsOld(chartPark_cid) : this.getOptionsNew(chartPark_cid, data || [], variables || {});

    if (userOptions) {
      optionsFromChartPark = _.extend(true, optionsFromChartPark, userOptions);
    }

    ;
    return optionsFromChartPark;
  },
  calculateOptions: function calculateOptions(chartPark_cid, data, variables) {
    return this.getOptions(chartPark_cid, undefined, data, variables);
  },
  _getComponentModules: function _getComponentModules() {
    var comps = components;

    if (!comps.modules) {
      comps.modules = {};
    }

    ;

    if (!comps.get) {
      comps.get = function (name, type) {
        if (!type) {
          type = "empty";
        }

        ;
        name = name.toLowerCase();
        type = type.toLowerCase();
        var _module = comps.modules[name];

        if (_module && _module[type]) {
          return _module[type];
        }

        ;
      };
    }

    ;
    return comps;
  },

  /**
   * @param {compModule} 要注册进去的模块名称
   * @param {name} 要获取的comp名称
   * @param {type} 模块子类型 graphs.bar
   */
  registerComponent: function registerComponent(compModule, name) {
    var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "empty";

    var comps = this._getComponentModules().modules;

    name = name.toLowerCase();
    type = type.toLowerCase();
    var _comp = comps[name];

    if (!_comp) {
      _comp = comps[name] = {};
    }

    ;

    if (!_comp[type]) {
      _comp[type] = compModule;
    }

    ;
    return comps;
  },

  /**
   * 
   * @param {name} 要获取的comp名称
   * @param { type } 后面可以传传两个参数 
   */
  _getComponentModule: function _getComponentModule(name) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'empty';
    name = name.toLowerCase();
    type = type.toLowerCase();

    var _comp = this._getComponentModules().modules[name];

    return _comp ? _comp[type] : undefined;
  },
  setAnimationEnabled: function setAnimationEnabled(bool) {
    return AnimationFrame.setAnimationEnabled(bool);
  },
  getAnimationEnabled: function getAnimationEnabled(bool) {
    return AnimationFrame.getAnimationEnabled();
  },
  //所有布局算法
  layout: {},
  registerLayout: function registerLayout(name, algorithm) {
    this.layout[name] = algorithm;
  },
  props: {},
  getProps: function getProps() {
    //计算全量的 props 属性用来提供智能提示 begin
    //这部分代码没必要部署到 打包的环境， 只是chartpark需要用来做智能提示， 自动化测试
    var allProps = {};

    var allModules = this._getComponentModules().modules;

    var _loop = function _loop(n) {
      if (n == 'chart') return "continue";
      allProps[n] = {
        detail: n,
        propertys: {} //typeMap: {}

      };

      var _graphNames = void 0;

      if (n == 'graphs') {
        _graphNames = _.map(allModules.graphs, function (val, key) {
          return key;
        });
        allProps.graphs.documentation = "可选的graphs类型有：\n" + _graphNames.join('\n');
      }

      ;
      var allConstructorProps = {}; //整个原型链路上面的 defaultProps

      var protoModule = null;

      for (var mn in allModules[n]) {
        if (protoModule) break;
        protoModule = allModules[n][mn].prototype;
      }

      ;

      function _setProps(m) {
        var constructorModule = m.constructor.__proto__; //m.constructor;

        if (!constructorModule._isComponentRoot) {
          _setProps(constructorModule.prototype);
        }

        ;

        if (constructorModule.defaultProps && _.isFunction(constructorModule.defaultProps)) {
          var _dprops = constructorModule.defaultProps();

          _.extend(allConstructorProps, _dprops);
        }

        ;
      }

      ;

      _setProps(protoModule);

      allProps[n].propertys = _.extend(allConstructorProps, allProps[n].propertys);

      var _loop2 = function _loop2(_mn) {
        var module = allModules[n][_mn];
        var moduleProps = module.defaultProps ? module.defaultProps() : {}; //处理props上面所有的 _props 依赖 begin

        function setChildProps(p) {
          if (p._props) {
            var _propsIsArray = _.isArray(p._props);

            for (var k in p._props) {
              if (!_propsIsArray) {
                p[k] = {
                  detail: k,
                  propertys: {}
                };
              }

              ;
              var _module = p._props[k];

              if (_module.defaultProps) {
                (function () {
                  var _setProps = function _setProps(m) {
                    if (m.__proto__.__proto__) {
                      _setProps(m.__proto__);
                    }

                    ;

                    if (m.defaultProps && _.isFunction(m.defaultProps)) {
                      var _dprops = m.defaultProps();

                      if (_dprops._props) {
                        //如果子元素还有 _props 依赖， 那么就继续处理
                        setChildProps(_dprops);
                      }

                      ;
                      _dprops && _.extend(allConstructorProps, _dprops);
                    }

                    ;
                  };

                  var _moduleProps = _module.defaultProps(); //先把ta原型上面的所有属性都添加到 _moduleProps 


                  var allConstructorProps = {};
                  ;

                  _setProps(_module.__proto__);

                  _moduleProps = _.extend(allConstructorProps, _moduleProps);

                  if (_propsIsArray) {
                    _.extend(p, _moduleProps);
                  } else {
                    p[k].propertys = _moduleProps;
                    setChildProps(p[k].propertys);
                  }

                  ;
                })();
              }

              ;
            }
          }
        }

        ;
        setChildProps(moduleProps); //处理props上面所有的 _props 依赖 end
        //这里不能用下面的 extend 方法，

        moduleProps = _.extend({}, allConstructorProps, moduleProps); //如果原型上面是有type 属性的，那么说明，自己是type分类路由的一个分支，放到typeMap下面

        if (allConstructorProps.type) {
          if (!allProps[n].typeMap) allProps[n].typeMap = {};

          if (n == 'graphs') {
            moduleProps.type.values = _graphNames;
            moduleProps.type.documentation = "可选的graphs类型有：\n" + _graphNames.join('\n');
          }

          ;
          allProps[n].typeMap[_mn] = moduleProps;
        } else {
          _.extend(allProps[n].propertys, moduleProps);
        }

        ;
      };

      for (var _mn in allModules[n]) {
        _loop2(_mn);
      }

      ;
    };

    for (var n in allModules) {
      var _ret = _loop(n);

      if (_ret === "continue") continue;
    }

    ;
    this.props = allProps; //计算全量的 props 属性用来提供智能提示 begin

    return this.props;
  },
  setPadding: function setPadding(padding) {
    _setting["default"].padding = padding;
  },
  //兼容有的地方已经用了Chartx.Canvax
  canvax: _canvax["default"]
};
exports["default"] = _default;