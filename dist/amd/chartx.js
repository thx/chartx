define(function () { 'use strict';

var commonjsGlobal$1 = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule$1(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var _ = {};
var breaker = {};
var ArrayProto = Array.prototype;
var ObjProto = Object.prototype;
var toString = ObjProto.toString;
var hasOwnProperty = ObjProto.hasOwnProperty;

var nativeForEach = ArrayProto.forEach;
var nativeFilter = ArrayProto.filter;
var nativeIndexOf = ArrayProto.indexOf;
var nativeIsArray = Array.isArray;
var nativeKeys = Object.keys;

_.values = function (obj) {
  var keys = _.keys(obj);
  var length = keys.length;
  var values = new Array(length);
  for (var i = 0; i < length; i++) {
    values[i] = obj[keys[i]];
  }
  return values;
};

_.keys = nativeKeys || function (obj) {
  if (obj !== Object(obj)) throw new TypeError('Invalid object');
  var keys = [];
  for (var key in obj) {
    if (_.has(obj, key)) keys.push(key);
  }return keys;
};

_.has = function (obj, key) {
  return hasOwnProperty.call(obj, key);
};

var each = _.each = _.forEach = function (obj, iterator, context) {
  if (obj == null) return;
  if (nativeForEach && obj.forEach === nativeForEach) {
    obj.forEach(iterator, context);
  } else if (obj.length === +obj.length) {
    for (var i = 0, length = obj.length; i < length; i++) {
      if (iterator.call(context, obj[i], i, obj) === breaker) return;
    }
  } else {
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
    }
  }
};

_.compact = function (array) {
  return _.filter(array, _.identity);
};

_.filter = _.select = function (obj, iterator, context) {
  var results = [];
  if (obj == null) return results;
  if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
  each(obj, function (value, index, list) {
    if (iterator.call(context, value, index, list)) results.push(value);
  });
  return results;
};

each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function (name) {
  _['is' + name] = function (obj) {
    return toString.call(obj) == '[object ' + name + ']';
  };
});

if (!_.isArguments(arguments)) {
  _.isArguments = function (obj) {
    return !!(obj && _.has(obj, 'callee'));
  };
}

{
  _.isFunction = function (obj) {
    return typeof obj === 'function';
  };
}

_.isFinite = function (obj) {
  return isFinite(obj) && !isNaN(parseFloat(obj));
};

_.isNaN = function (obj) {
  return _.isNumber(obj) && obj != +obj;
};

_.isBoolean = function (obj) {
  return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
};

_.isNull = function (obj) {
  return obj === null;
};

_.isEmpty = function (obj) {
  if (obj == null) return true;
  if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
  for (var key in obj) {
    if (_.has(obj, key)) return false;
  }return true;
};

_.isElement = function (obj) {
  return !!(obj && obj.nodeType === 1);
};

_.isArray = nativeIsArray || function (obj) {
  return toString.call(obj) == '[object Array]';
};

_.isObject = function (obj) {
  return obj === Object(obj);
};

_.identity = function (value) {
  return value;
};

_.indexOf = function (array, item, isSorted) {
  if (array == null) return -1;
  var i = 0,
      length = array.length;
  if (isSorted) {
    if (typeof isSorted == 'number') {
      i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
    } else {
      i = _.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
  }
  if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
  for (; i < length; i++) {
    if (array[i] === item) return i;
  }return -1;
};

_.isWindow = function (obj) {
  return obj != null && obj == obj.window;
};

// Internal implementation of a recursive `flatten` function.
var flatten = function flatten(input, shallow, output) {
  if (shallow && _.every(input, _.isArray)) {
    return concat.apply(output, input);
  }
  each(input, function (value) {
    if (_.isArray(value) || _.isArguments(value)) {
      shallow ? push.apply(output, value) : flatten(value, shallow, output);
    } else {
      output.push(value);
    }
  });
  return output;
};

// Flatten out an array, either recursively (by default), or just one level.
_.flatten = function (array, shallow) {
  return flatten(array, shallow, []);
};

_.every = _.all = function (obj, iterator, context) {
  iterator || (iterator = _.identity);
  var result = true;
  if (obj == null) return result;
  if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
  each(obj, function (value, index, list) {
    if (!(result = result && iterator.call(context, value, index, list))) return breaker;
  });
  return !!result;
};

/**
*
*如果是深度extend，第一个参数就设置为true
*/
_.extend = function () {
  var options,
      name,
      src,
      copy,
      clone,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false;
  if (typeof target === "boolean") {
    deep = target;
    target = arguments[1] || {};
    i = 2;
  }
  if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== "object" && !_.isFunction(target)) {
    target = {};
  }
  if (length === i) {
    target = this;
    --i;
  }
  for (; i < length; i++) {
    if ((options = arguments[i]) != null) {
      for (name in options) {
        src = target[name];
        copy = options[name];
        if (target === copy) {
          continue;
        }

        if (deep && copy && _.isObject(copy) && !_.isArray(copy)) {
          target[name] = _.extend(deep, clone, copy);
        } else {
          target[name] = copy;
        }
        /*
        if ( deep && copy ) {  
            if ( _.isArray(copy) ) {  
                clone = src && _.isArray(src) ? src : [];  
            } else {  
                clone = src && _.isObject(src) ? src : {};  
            }  
            target[ name ] = _.extend( deep, clone, copy );  
        } else if ( copy !== undefined ) {  
            target[ name ] = copy;  
        }  
        */
      }
    }
  }
  return target;
};

_.clone = function (obj) {
  if (!_.isObject(obj)) return obj;
  return _.isArray(obj) ? obj.slice() : _.extend(true, {}, obj);
};

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com 
*/
var Utils = {
    mainFrameRate: 60, //默认主帧率
    now: 0,
    /*像素检测专用*/
    _pixelCtx: null,
    __emptyFunc: function __emptyFunc() {},
    //retina 屏幕优化
    _devicePixelRatio: window.devicePixelRatio || 1,
    _UID: 0, //该值为向上的自增长整数值
    getUID: function getUID() {
        return this._UID++;
    },
    createId: function createId(name) {
        if (!name) {}
        //if end with a digit, then append an undersBase before appending
        var charCode = name.charCodeAt(name.length - 1);
        if (charCode >= 48 && charCode <= 57) name += "_";
        return name + Utils.getUID();
    },
    canvasSupport: function canvasSupport() {
        return !!document.createElement('canvas').getContext;
    },

    initElement: function initElement(canvas) {
        if (window.FlashCanvas && FlashCanvas.initElement) {
            FlashCanvas.initElement(canvas);
        }
    },

    /**
     * 按照css的顺序，返回一个[上,右,下,左]
     */
    getCssOrderArr: function getCssOrderArr(r) {
        var r1;
        var r2;
        var r3;
        var r4;

        if (typeof r === 'number') {
            r1 = r2 = r3 = r4 = r;
        } else if (r instanceof Array) {
            if (r.length === 1) {
                r1 = r2 = r3 = r4 = r[0];
            } else if (r.length === 2) {
                r1 = r3 = r[0];
                r2 = r4 = r[1];
            } else if (r.length === 3) {
                r1 = r[0];
                r2 = r4 = r[1];
                r3 = r[2];
            } else {
                r1 = r[0];
                r2 = r[1];
                r3 = r[2];
                r4 = r[3];
            }
        } else {
            r1 = r2 = r3 = r4 = 0;
        }
        return [r1, r2, r3, r4];
    },

    isWebGLSupported: function isWebGLSupported() {
        var contextOptions = { stencil: true };
        try {
            if (!window.WebGLRenderingContext) //不存在直接return
                {
                    return false;
                }
            var canvas = document.createElement('canvas'),
                gl = canvas.getContext('webgl', contextOptions) || canvas.getContext('experimental-webgl', contextOptions);
            return !!(gl && gl.getContextAttributes().stencil); //还要确实检测是否支持webGL模式
        } catch (e) {
            return false;
        }
    },
    checkOpt: function checkOpt(opt) {
        if (!opt) {
            opt = {
                context: {}
            };
        } else {
            if (!opt.context) {
                opt.context = {};
            }
        }
        return opt;
    }
};

/**
 * Point
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 */
var Point = function () {
    function Point() {
        var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        classCallCheck(this, Point);

        if (arguments.length == 1 && _typeof(arguments[0]) == 'object') {
            var arg = arguments[0];
            if ("x" in arg && "y" in arg) {
                this.x = arg.x * 1;
                this.y = arg.y * 1;
            } else {
                var i = 0;
                for (var p in arg) {
                    if (i == 0) {
                        this.x = arg[p] * 1;
                    } else {
                        this.y = arg[p] * 1;
                        break;
                    }
                    i++;
                }
            }
        } else {
            this.x = x * 1;
            this.y = y * 1;
        }
    }

    createClass(Point, [{
        key: "toArray",
        value: function toArray$$1() {
            return [this.x, this.y];
        }
    }]);
    return Point;
}();

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * canvas 上委托的事件管理
 */
var CanvaxEvent = function CanvaxEvent(evt, params) {

    var eventType = "CanvaxEvent";
    if (_.isString(evt)) {
        eventType = evt;
    }
    if (_.isObject(evt) && evt.type) {
        eventType = evt.type;
    }

    this.target = null;
    this.currentTarget = null;
    this.type = eventType;
    this.point = null;

    this._stopPropagation = false; //默认不阻止事件冒泡
};
CanvaxEvent.prototype = {
    stopPropagation: function stopPropagation() {
        this._stopPropagation = true;
    }
};

var settings = {
  //设备分辨率
  RESOLUTION: window.devicePixelRatio || 1,

  /**
   * Target frames per millisecond.
   *
   * @static
   * @memberof PIXI.settings
   * @type {number}
   * @default 0.06
   */
  TARGET_FPMS: 0.06,

  /**
   * If set to true WebGL will attempt make textures mimpaped by default.
   * Mipmapping will only succeed if the base texture uploaded has power of two dimensions.
   *
   * @static
   * @memberof PIXI.settings
   * @type {boolean}
   * @default true
   */
  MIPMAP_TEXTURES: true,

  /**
   * Default filter resolution.
   *
   * @static
   * @memberof PIXI.settings
   * @type {number}
   * @default 1
   */
  FILTER_RESOLUTION: 1,

  // TODO: maybe change to SPRITE.BATCH_SIZE: 2000
  // TODO: maybe add PARTICLE.BATCH_SIZE: 15000

  /**
   * The default sprite batch size.
   *
   * The default aims to balance desktop and mobile devices.
   *
   * @static
   * @memberof PIXI.settings
   * @type {number}
   * @default 4096
   */
  SPRITE_BATCH_SIZE: 4096,

  /**
   * The prefix that denotes a URL is for a retina asset.
   *
   * @static
   * @memberof PIXI.settings
   * @type {RegExp|string}
   * @example `@2x`
   * @default /@(.+)x/
   */
  RETINA_PREFIX: /@(.+)x/,

  /**
   * The default render options if none are supplied to {@link PIXI.WebGLRenderer}
   * or {@link PIXI.CanvasRenderer}.
   *
   * @static
   * @constant
   * @memberof PIXI.settings
   * @type {object}
   * @property {HTMLCanvasElement} view=null
   * @property {number} resolution=1
   * @property {boolean} antialias=false
   * @property {boolean} forceFXAA=false
   * @property {boolean} autoResize=false
   * @property {boolean} transparent=false
   * @property {number} backgroundColor=0x000000
   * @property {boolean} clearBeforeRender=true
   * @property {boolean} preserveDrawingBuffer=false
   * @property {boolean} roundPixels=false
   */
  RENDER_OPTIONS: {
    view: null,
    antialias: true,
    forceFXAA: false,
    autoResize: false,
    transparent: true,
    backgroundColor: 0x000000,
    clearBeforeRender: true,
    preserveDrawingBuffer: false,
    roundPixels: false
  },

  /**
   * Default transform type.
   *
   * @static
   * @memberof PIXI.settings
   * @type {PIXI.TRANSFORM_MODE}
   * @default PIXI.TRANSFORM_MODE.STATIC
   */
  TRANSFORM_MODE: 0,

  /**
   * Default Garbage Collection mode.
   *
   * @static
   * @memberof PIXI.settings
   * @type {PIXI.GC_MODES}
   * @default PIXI.GC_MODES.AUTO
   */
  GC_MODE: 0,

  /**
   * Default Garbage Collection max idle.
   *
   * @static
   * @memberof PIXI.settings
   * @type {number}
   * @default 3600
   */
  GC_MAX_IDLE: 60 * 60,

  /**
   * Default Garbage Collection maximum check count.
   *
   * @static
   * @memberof PIXI.settings
   * @type {number}
   * @default 600
   */
  GC_MAX_CHECK_COUNT: 60 * 10,

  /**
   * Default wrap modes that are supported by pixi.
   *
   * @static
   * @memberof PIXI.settings
   * @type {PIXI.WRAP_MODES}
   * @default PIXI.WRAP_MODES.CLAMP
   */
  WRAP_MODE: 0,

  /**
   * The scale modes that are supported by pixi.
   *
   * @static
   * @memberof PIXI.settings
   * @type {PIXI.SCALE_MODES}
   * @default PIXI.SCALE_MODES.LINEAR
   */
  SCALE_MODE: 0,

  /**
   * Default specify float precision in shaders.
   *
   * @static
   * @memberof PIXI.settings
   * @type {PIXI.PRECISION}
   * @default PIXI.PRECISION.MEDIUM
   */
  PRECISION: 'mediump'

};

var addOrRmoveEventHand = function addOrRmoveEventHand(domHand, ieHand) {
    if (document[domHand]) {
        var _ret = function () {
            var eventDomFn = function eventDomFn(el, type, fn) {
                if (el.length) {
                    for (var i = 0; i < el.length; i++) {
                        eventDomFn(el[i], type, fn);
                    }
                } else {
                    el[domHand](type, fn, false);
                }
            };

            
            return {
                v: eventDomFn
            };
        }();

        if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
    } else {
        var _ret2 = function () {
            var eventFn = function eventFn(el, type, fn) {
                if (el.length) {
                    for (var i = 0; i < el.length; i++) {
                        eventFn(el[i], type, fn);
                    }
                } else {
                    el[ieHand]("on" + type, function () {
                        return fn.call(el, window.event);
                    });
                }
            };

            
            return {
                v: eventFn
            };
        }();

        if ((typeof _ret2 === "undefined" ? "undefined" : _typeof(_ret2)) === "object") return _ret2.v;
    }
};

var $ = {
    // dom操作相关代码
    query: function query(el) {
        if (_.isString(el)) {
            return document.getElementById(el);
        }
        if (el.nodeType == 1) {
            //则为一个element本身
            return el;
        }
        if (el.length) {
            return el[0];
        }
        return null;
    },
    offset: function offset(el) {
        var box = el.getBoundingClientRect(),
            doc = el.ownerDocument,
            body = doc.body,
            docElem = doc.documentElement,


        // for ie  
        clientTop = docElem.clientTop || body.clientTop || 0,
            clientLeft = docElem.clientLeft || body.clientLeft || 0,


        // In Internet Explorer 7 getBoundingClientRect property is treated as physical, 
        // while others are logical. Make all logical, like in IE8. 
        zoom = 1;
        if (body.getBoundingClientRect) {
            var bound = body.getBoundingClientRect();
            zoom = (bound.right - bound.left) / body.clientWidth;
        }
        if (zoom > 1) {
            clientTop = 0;
            clientLeft = 0;
        }
        var top = box.top / zoom + (window.pageYOffset || docElem && docElem.scrollTop / zoom || body.scrollTop / zoom) - clientTop,
            left = box.left / zoom + (window.pageXOffset || docElem && docElem.scrollLeft / zoom || body.scrollLeft / zoom) - clientLeft;

        return {
            top: top,
            left: left
        };
    },
    addEvent: addOrRmoveEventHand("addEventListener", "attachEvent"),
    removeEvent: addOrRmoveEventHand("removeEventListener", "detachEvent"),
    pageX: function pageX(e) {
        if (e.pageX) return e.pageX;else if (e.clientX) return e.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);else return null;
    },
    pageY: function pageY(e) {
        if (e.pageY) return e.pageY;else if (e.clientY) return e.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);else return null;
    },
    /**
     * 创建dom
     * @param {string} id dom id 待用
     * @param {string} type : dom type， such as canvas, div etc.
     */
    createCanvas: function createCanvas(_width, _height, id) {
        var canvas = document.createElement("canvas");
        canvas.style.position = 'absolute';
        canvas.style.width = _width + 'px';
        canvas.style.height = _height + 'px';
        canvas.style.left = 0;
        canvas.style.top = 0;
        canvas.setAttribute('width', _width * settings.RESOLUTION);
        canvas.setAttribute('height', _height * settings.RESOLUTION);
        canvas.setAttribute('id', id);
        return canvas;
    },
    createView: function createView(_width, _height, id) {
        var view = document.createElement("div");
        view.className = "canvax-view";
        view.style.cssText += "position:relative;width:" + _width + "px;height:" + _height + "px;";

        var stageView = document.createElement("div");
        stageView.style.cssText += "position:absolute;width:" + _width + "px;height:" + _height + "px;";

        //用来存放一些dom元素
        var domView = document.createElement("div");
        domView.style.cssText += "position:absolute;width:" + _width + "px;height:" + _height + "px;";

        view.appendChild(stageView);
        view.appendChild(domView);

        return {
            view: view,
            stageView: stageView,
            domView: domView
        };
    }
    //dom相关代码结束
};

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 */
var _mouseEventTypes = ["click", "dblclick", "mousedown", "mousemove", "mouseup", "mouseout"];
var _hammerEventTypes = ["pan", "panstart", "panmove", "panend", "pancancel", "panleft", "panright", "panup", "pandown", "press", "pressup", "swipe", "swipeleft", "swiperight", "swipeup", "swipedown", "tap"];

var EventHandler = function EventHandler(canvax, opt) {
    this.canvax = canvax;

    this.curPoints = [new Point(0, 0)]; //X,Y 的 point 集合, 在touch下面则为 touch的集合，只是这个touch被添加了对应的x，y
    //当前激活的点对应的obj，在touch下可以是个数组,和上面的 curPoints 对应
    this.curPointsTarget = [];

    this._touching = false;
    //正在拖动，前提是_touching=true
    this._draging = false;

    //当前的鼠标状态
    this._cursor = "default";

    this.target = this.canvax.view;
    this.types = [];

    //mouse体统中不需要配置drag,touch中会用到第三方的touch库，每个库的事件名称可能不一样，
    //就要这里配置，默认实现的是hammerjs的,所以默认可以在项目里引入hammerjs http://hammerjs.github.io/
    this.drag = {
        start: "panstart",
        move: "panmove",
        end: "panend"
    };

    _.extend(true, this, opt);
};

//这样的好处是document.compareDocumentPosition只会在定义的时候执行一次。
var contains = document.compareDocumentPosition ? function (parent, child) {
    if (!child) {
        return false;
    }
    return !!(parent.compareDocumentPosition(child) & 16);
} : function (parent, child) {
    if (!child) {
        return false;
    }
    return child !== child && (parent.contains ? parent.contains(child) : true);
};

EventHandler.prototype = {
    init: function init() {

        //依次添加上浏览器的自带事件侦听
        var me = this;
        if (me.target.nodeType == undefined) {
            //如果target.nodeType没有的话， 说明该target为一个jQuery对象 or kissy 对象or hammer对象
            //即为第三方库，那么就要对接第三方库的事件系统。默认实现hammer的大部分事件系统
            if (!me.types || me.types.length == 0) {
                me.types = _hammerEventTypes;
            }
        } else if (me.target.nodeType == 1) {
            me.types = _mouseEventTypes;
        }

        _.each(me.types, function (type) {
            //不再关心浏览器环境是否 'ontouchstart' in window 
            //而是直接只管传给事件模块的是一个原生dom还是 jq对象 or hammer对象等
            if (me.target.nodeType == 1) {
                $.addEvent(me.target, type, function (e) {
                    me.__mouseHandler(e);
                });
            } else {
                me.target.on(type, function (e) {
                    me.__libHandler(e);
                });
            }
        });
    },
    /*
    * 原生事件系统------------------------------------------------begin
    * 鼠标事件处理函数
    **/
    __mouseHandler: function __mouseHandler(e) {
        var me = this;
        var root = me.canvax;

        root.updateViewOffset();

        me.curPoints = [new Point($.pageX(e) - root.viewOffset.left, $.pageY(e) - root.viewOffset.top)];

        //理论上来说，这里拿到point了后，就要计算这个point对应的target来push到curPointsTarget里，
        //但是因为在drag的时候其实是可以不用计算对应target的。
        //所以放在了下面的me.__getcurPointsTarget( e , curMousePoint );常规mousemove中执行

        var curMousePoint = me.curPoints[0];
        var curMouseTarget = me.curPointsTarget[0];

        //模拟drag,mouseover,mouseout 部分代码 begin-------------------------------------------------

        //mousedown的时候 如果 curMouseTarget.dragEnabled 为true。就要开始准备drag了
        if (e.type == "mousedown") {
            //如果curTarget 的数组为空或者第一个为false ，，，
            if (!curMouseTarget) {
                var obj = root.getObjectsUnderPoint(curMousePoint, 1)[0];
                if (obj) {
                    me.curPointsTarget = [obj];
                }
            }
            curMouseTarget = me.curPointsTarget[0];
            if (curMouseTarget && curMouseTarget.dragEnabled) {
                //鼠标事件已经摸到了一个
                me._touching = true;
            }
        }

        if (e.type == "mouseup" || e.type == "mouseout" && !contains(root.view, e.toElement || e.relatedTarget)) {
            if (me._draging == true) {
                //说明刚刚在拖动
                me._dragEnd(e, curMouseTarget, 0);
                curMouseTarget.fire("dragend");
            }
            me._draging = false;
            me._touching = false;
        }

        if (e.type == "mouseout") {
            if (!contains(root.view, e.toElement || e.relatedTarget)) {
                me.__getcurPointsTarget(e, curMousePoint);
            }
        } else if (e.type == "mousemove") {
            //|| e.type == "mousedown" ){
            //拖动过程中就不在做其他的mouseover检测，drag优先
            if (me._touching && e.type == "mousemove" && curMouseTarget) {
                //说明正在拖动啊
                if (!me._draging) {

                    //begin drag
                    curMouseTarget.fire("dragstart");
                    //有可能该child没有hover style
                    if (!curMouseTarget._globalAlpha) {
                        curMouseTarget._globalAlpha = curMouseTarget.context.$model.globalAlpha;
                    }

                    //先把本尊给隐藏了
                    curMouseTarget.context.globalAlpha = 0;
                    //然后克隆一个副本到activeStage

                    var cloneObject = me._clone2hoverStage(curMouseTarget, 0);
                    cloneObject.context.globalAlpha = curMouseTarget._globalAlpha;
                } else {
                    //drag move ing
                    me._dragMoveHander(e, curMouseTarget, 0);
                }
                me._draging = true;
            } else {
                //常规mousemove检测
                //move事件中，需要不停的搜索target，这个开销挺大，
                //后续可以优化，加上和帧率相当的延迟处理
                me.__getcurPointsTarget(e, curMousePoint);
            }
        } else {
            //其他的事件就直接在target上面派发事件
            var child = curMouseTarget;
            if (!child) {
                child = root;
            }
            me.__dispatchEventInChilds(e, [child]);
            me._cursorHander(child);
        }

        if (root.preventDefault) {
            //阻止默认浏览器动作(W3C) 
            if (e && e.preventDefault) {
                e.preventDefault();
            } else {
                window.event.returnValue = false;
            }
        }
    },
    __getcurPointsTarget: function __getcurPointsTarget(e, point) {
        var me = this;
        var root = me.canvax;
        var oldObj = me.curPointsTarget[0];

        if (oldObj && !oldObj.context) {
            oldObj = null;
        }

        var e = new CanvaxEvent(e);

        if (e.type == "mousemove" && oldObj && oldObj._hoverClass && oldObj.pointChkPriority && oldObj.getChildInPoint(point)) {
            //小优化,鼠标move的时候。计算频率太大，所以。做此优化
            //如果有target存在，而且当前元素正在hoverStage中，而且当前鼠标还在target内,就没必要取检测整个displayList了
            //开发派发常规mousemove事件
            e.target = e.currentTarget = oldObj;
            e.point = oldObj.globalToLocal(point);
            oldObj.dispatchEvent(e);
            return;
        }
        var obj = root.getObjectsUnderPoint(point, 1)[0];

        if (oldObj && oldObj != obj || e.type == "mouseout") {
            if (oldObj && oldObj.context) {
                me.curPointsTarget[0] = null;
                e.type = "mouseout";
                e.toTarget = obj;
                e.target = e.currentTarget = oldObj;
                e.point = oldObj.globalToLocal(point);
                oldObj.dispatchEvent(e);
            }
        }

        if (obj && oldObj != obj) {
            me.curPointsTarget[0] = obj;
            e.type = "mouseover";
            e.fromTarget = oldObj;
            e.target = e.currentTarget = obj;
            e.point = obj.globalToLocal(point);
            obj.dispatchEvent(e);
        }

        if (e.type == "mousemove" && obj) {
            e.target = e.currentTarget = oldObj;
            e.point = oldObj.globalToLocal(point);
            oldObj.dispatchEvent(e);
        }
        me._cursorHander(obj, oldObj);
    },
    _cursorHander: function _cursorHander(obj, oldObj) {
        if (!obj && !oldObj) {
            this._setCursor("default");
        }
        if (obj && oldObj != obj && obj.context) {
            this._setCursor(obj.context.$model.cursor);
        }
    },
    _setCursor: function _setCursor(cursor) {
        if (this._cursor == cursor) {
            //如果两次要设置的鼠标状态是一样的
            return;
        }
        this.canvax.view.style.cursor = cursor;
        this._cursor = cursor;
    },
    /*
    * 原生事件系统------------------------------------------------end
    */

    /*
     *第三方库的事件系统------------------------------------------------begin
     *触屏事件处理函数
     * */
    __libHandler: function __libHandler(e) {
        var me = this;
        var root = me.canvax;
        root.updateViewOffset();
        // touch 下的 curPointsTarget 从touches中来
        //获取canvax坐标系统里面的坐标
        me.curPoints = me.__getCanvaxPointInTouchs(e);
        if (!me._draging) {
            //如果在draging的话，target已经是选中了的，可以不用 检测了
            me.curPointsTarget = me.__getChildInTouchs(me.curPoints);
        }
        if (me.curPointsTarget.length > 0) {
            //drag开始
            if (e.type == me.drag.start) {
                //dragstart的时候touch已经准备好了target， curPointsTarget 里面只要有一个是有效的
                //就认为drags开始
                _.each(me.curPointsTarget, function (child, i) {
                    if (child && child.dragEnabled) {
                        //只要有一个元素就认为正在准备drag了
                        me._draging = true;

                        //有可能该child没有hover style
                        if (!child._globalAlpha) {
                            child._globalAlpha = child.context.$model.globalAlpha;
                        }

                        //然后克隆一个副本到activeStage
                        me._clone2hoverStage(child, i);

                        //先把本尊给隐藏了
                        child.context.globalAlpha = 0;

                        child.fire("dragstart");

                        return false;
                    }
                });
            }

            //dragIng
            if (e.type == me.drag.move) {
                if (me._draging) {
                    _.each(me.curPointsTarget, function (child, i) {
                        if (child && child.dragEnabled) {
                            me._dragMoveHander(e, child, i);
                        }
                    });
                }
            }

            //drag结束
            if (e.type == me.drag.end) {
                if (me._draging) {
                    _.each(me.curPointsTarget, function (child, i) {
                        if (child && child.dragEnabled) {
                            me._dragEnd(e, child, 0);
                            child.fire("dragend");
                        }
                    });
                    me._draging = false;
                }
            }
            me.__dispatchEventInChilds(e, me.curPointsTarget);
        } else {
            //如果当前没有一个target，就把事件派发到canvax上面
            me.__dispatchEventInChilds(e, [root]);
        }
    },
    //从touchs中获取到对应touch , 在上面添加上canvax坐标系统的x，y
    __getCanvaxPointInTouchs: function __getCanvaxPointInTouchs(e) {
        var me = this;
        var root = me.canvax;
        var curTouchs = [];
        _.each(e.point, function (touch) {
            curTouchs.push({
                x: CanvaxEvent.pageX(touch) - root.viewOffset.left,
                y: CanvaxEvent.pageY(touch) - root.viewOffset.top
            });
        });
        return curTouchs;
    },
    __getChildInTouchs: function __getChildInTouchs(touchs) {
        var me = this;
        var root = me.canvax;
        var touchesTarget = [];
        _.each(touchs, function (touch) {
            touchesTarget.push(root.getObjectsUnderPoint(touch, 1)[0]);
        });
        return touchesTarget;
    },
    /*
    *第三方库的事件系统------------------------------------------------begin
    */

    /*
     *@param {array} childs 
     * */
    __dispatchEventInChilds: function __dispatchEventInChilds(e, childs) {
        if (!childs && !("length" in childs)) {
            return false;
        }
        var me = this;
        var hasChild = false;
        _.each(childs, function (child, i) {
            if (child) {
                hasChild = true;
                var ce = new CanvaxEvent(e);
                ce.target = ce.currentTarget = child || this;
                ce.stagePoint = me.curPoints[i];
                ce.point = ce.target.globalToLocal(ce.stagePoint);
                child.dispatchEvent(ce);
            }
        });
        return hasChild;
    },
    //克隆一个元素到hover stage中去
    _clone2hoverStage: function _clone2hoverStage(target, i) {
        var me = this;
        var root = me.canvax;
        var _dragDuplicate = root._bufferStage.getChildById(target.id);
        if (!_dragDuplicate) {
            _dragDuplicate = target.clone(true);
            _dragDuplicate._transform = target.getConcatenatedMatrix();

            /**
             *TODO: 因为后续可能会有手动添加的 元素到_bufferStage 里面来
             *比如tips
             *这类手动添加进来的肯定是因为需要显示在最外层的。在hover元素之上。
             *所有自动添加的hover元素都默认添加在_bufferStage的最底层
             **/
            root._bufferStage.addChildAt(_dragDuplicate, 0);
        }
        _dragDuplicate.context.globalAlpha = target._globalAlpha;
        target._dragPoint = target.globalToLocal(me.curPoints[i]);
        return _dragDuplicate;
    },
    //drag 中 的处理函数
    _dragMoveHander: function _dragMoveHander(e, target, i) {

        var me = this;
        var root = me.canvax;
        var _point = target.globalToLocal(me.curPoints[i]);

        //要对应的修改本尊的位置，但是要告诉引擎不要watch这个时候的变化
        target._noHeart = true;
        var _moveStage = target.moveing;
        target.moveing = true;
        target.context.x += _point.x - target._dragPoint.x;
        target.context.y += _point.y - target._dragPoint.y;
        target.fire("dragmove");
        target.moveing = _moveStage;
        target._noHeart = false;
        //同步完毕本尊的位置

        //这里只能直接修改_transform 。 不能用下面的修改x，y的方式。
        var _dragDuplicate = root._bufferStage.getChildById(target.id);
        _dragDuplicate._transform = target.getConcatenatedMatrix();

        //worldTransform在renderer的时候计算
        //_dragDuplicate.worldTransform = null;
        //_dragDuplicate.setWorldTransform();

        //直接修改的_transform不会出发心跳上报， 渲染引擎不制动这个stage需要绘制。
        //所以要手动出发心跳包
        _dragDuplicate.heartBeat();
    },
    //drag结束的处理函数
    //TODO: dragend的还需要处理end的点是否还在元素上面，要恢复hover状态
    _dragEnd: function _dragEnd(e, target, i) {
        var me = this;
        var root = me.canvax;

        //_dragDuplicate 复制在_bufferStage 中的副本
        var _dragDuplicate = root._bufferStage.getChildById(target.id);
        _dragDuplicate.destroy();

        target.context.globalAlpha = target._globalAlpha;
    }
};

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 事件管理类
 */
/**
 * 构造函数.
 * @name EventDispatcher
 * @class EventDispatcher类是可调度事件的类的基类，它允许显示列表上的任何对象都是一个事件目标。
 */
var EventManager = function EventManager() {
    //事件映射表，格式为：{type1:[listener1, listener2], type2:[listener3, listener4]}
    this._eventMap = {};
};

EventManager.prototype = {
    /*
     * 注册事件侦听器对象，以使侦听器能够接收事件通知。
     */
    _addEventListener: function _addEventListener(type, listener) {

        if (typeof listener != "function") {
            //listener必须是个function呐亲
            return false;
        }
        var addResult = true;
        var self = this;
        _.each(type.split(" "), function (type) {
            var map = self._eventMap[type];
            if (!map) {
                map = self._eventMap[type] = [];
                map.push(listener);
                self._eventEnabled = true;
                return true;
            }

            if (_.indexOf(map, listener) == -1) {
                map.push(listener);
                self._eventEnabled = true;
                return true;
            }

            addResult = false;
        });
        return addResult;
    },
    /**
     * 删除事件侦听器。
     */
    _removeEventListener: function _removeEventListener(type, listener) {
        if (arguments.length == 1) return this.removeEventListenerByType(type);

        var map = this._eventMap[type];
        if (!map) {
            return false;
        }

        for (var i = 0; i < map.length; i++) {
            var li = map[i];
            if (li === listener) {
                map.splice(i, 1);
                if (map.length == 0) {
                    delete this._eventMap[type];
                    //如果这个如果这个时候child没有任何事件侦听
                    if (_.isEmpty(this._eventMap)) {
                        //那么该元素不再接受事件的检测
                        this._eventEnabled = false;
                    }
                }
                return true;
            }
        }

        return false;
    },
    /**
     * 删除指定类型的所有事件侦听器。
     */
    _removeEventListenerByType: function _removeEventListenerByType(type) {
        var map = this._eventMap[type];
        if (!map) {
            delete this._eventMap[type];

            //如果这个如果这个时候child没有任何事件侦听
            if (_.isEmpty(this._eventMap)) {
                //那么该元素不再接受事件的检测
                this._eventEnabled = false;
            }

            return true;
        }
        return false;
    },
    /**
     * 删除所有事件侦听器。
     */
    _removeAllEventListeners: function _removeAllEventListeners() {
        this._eventMap = {};
        this._eventEnabled = false;
    },
    /**
    * 派发事件，调用事件侦听器。
    */
    _dispatchEvent: function _dispatchEvent(e) {
        var map = this._eventMap[e.type];

        if (map) {
            if (!e.target) e.target = this;
            map = map.slice();

            for (var i = 0; i < map.length; i++) {
                var listener = map[i];
                if (typeof listener == "function") {
                    listener.call(this, e);
                }
            }
        }

        if (!e._stopPropagation) {
            //向上冒泡
            if (this.parent) {
                e.currentTarget = this.parent;
                this.parent._dispatchEvent(e);
            }
        }
        return true;
    },
    /**
       * 检查是否为指定事件类型注册了任何侦听器。
       */
    _hasEventListener: function _hasEventListener(type) {
        var map = this._eventMap[type];
        return map != null && map.length > 0;
    }
};

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 事件派发类
 */
var EventDispatcher = function (_EventManager) {
    inherits(EventDispatcher, _EventManager);

    function EventDispatcher() {
        classCallCheck(this, EventDispatcher);
        return possibleConstructorReturn(this, (EventDispatcher.__proto__ || Object.getPrototypeOf(EventDispatcher)).call(this));
    }

    createClass(EventDispatcher, [{
        key: "on",
        value: function on(type, listener) {
            this._addEventListener(type, listener);
            return this;
        }
    }, {
        key: "addEventListener",
        value: function addEventListener(type, listener) {
            this._addEventListener(type, listener);
            return this;
        }
    }, {
        key: "un",
        value: function un(type, listener) {
            this._removeEventListener(type, listener);
            return this;
        }
    }, {
        key: "removeEventListener",
        value: function removeEventListener(type, listener) {
            this._removeEventListener(type, listener);
            return this;
        }
    }, {
        key: "removeEventListenerByType",
        value: function removeEventListenerByType(type) {
            this._removeEventListenerByType(type);
            return this;
        }
    }, {
        key: "removeAllEventListeners",
        value: function removeAllEventListeners() {
            this._removeAllEventListeners();
            return this;
        }

        //params 要传给evt的eventhandler处理函数的参数，会被merge到Canvax event中

    }, {
        key: "fire",
        value: function fire(eventType, params) {
            var e = new CanvaxEvent(eventType);

            if (params) {
                for (var p in params) {
                    if (p in e) {
                        //params中的数据不能覆盖event属性
                    } else {
                        e[p] = params[p];
                    }
                }
            }

            var me = this;
            _.each(eventType.split(" "), function (eType) {
                e.currentTarget = me;
                me.dispatchEvent(e);
            });
            return this;
        }
    }, {
        key: "dispatchEvent",
        value: function dispatchEvent(event) {
            //this instanceof DisplayObjectContainer ==> this.children
            //TODO: 这里import DisplayObjectContainer 的话，在displayObject里面的import EventDispatcher from "../event/EventDispatcher";
            //会得到一个undefined，感觉是成了一个循环依赖的问题，所以这里换用简单的判断来判断自己是一个容易，拥有children
            if (this.children && event.point) {
                var target = this.getObjectsUnderPoint(event.point, 1)[0];
                if (target) {
                    target.dispatchEvent(event);
                }
                return;
            }

            if (this.context && event.type == "mouseover") {
                //记录dispatchEvent之前的心跳
                var preHeartBeat = this._heartBeatNum;
                var pregAlpha = this.context.$model.globalAlpha;
                this._dispatchEvent(event);
                if (preHeartBeat != this._heartBeatNum) {
                    this._hoverClass = true;
                    if (this.hoverClone) {
                        var canvax = this.getStage().parent;
                        //然后clone一份obj，添加到_bufferStage 中
                        var activShape = this.clone(true);
                        activShape._transform = this.getConcatenatedMatrix();
                        canvax._bufferStage.addChildAt(activShape, 0);
                        //然后把自己隐藏了

                        //用一个临时变量_globalAlpha 来存储自己之前的alpha
                        this._globalAlpha = pregAlpha;
                        this.context.globalAlpha = 0;
                    }
                }
                return;
            }

            this._dispatchEvent(event);

            if (this.context && event.type == "mouseout") {
                if (this._hoverClass) {
                    //说明刚刚over的时候有添加样式
                    var canvax = this.getStage().parent;
                    this._hoverClass = false;

                    canvax._bufferStage.removeChildById(this.id);

                    if (this._globalAlpha) {
                        this.context.globalAlpha = this._globalAlpha;
                        delete this._globalAlpha;
                    }
                }
            }

            return this;
        }
    }, {
        key: "hasEvent",
        value: function hasEvent(type) {
            return this._hasEventListener(type);
        }
    }, {
        key: "hasEventListener",
        value: function hasEventListener(type) {
            return this._hasEventListener(type);
        }
    }, {
        key: "hover",
        value: function hover(overFun, outFun) {
            this.on("mouseover", overFun);
            this.on("mouseout", outFun);
            return this;
        }
    }, {
        key: "once",
        value: function once(type, listener) {
            var me = this;
            var onceHandle = function onceHandle() {
                listener.apply(me, arguments);
                this.un(type, onceHandle);
            };
            this.on(type, onceHandle);
            return this;
        }
    }]);
    return EventDispatcher;
}(EventManager);

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * | a | c | tx|
 * | b | d | ty|
 * | 0 | 0 | 1 |
 *
 * @class
 * @memberof PIXI
 *
 *
 * Matrix 矩阵库 用于整个系统的几何变换计算
 */

var Matrix = function Matrix(a, b, c, d, tx, ty) {
    this.a = a != undefined ? a : 1;
    this.b = b != undefined ? b : 0;
    this.c = c != undefined ? c : 0;
    this.d = d != undefined ? d : 1;
    this.tx = tx != undefined ? tx : 0;
    this.ty = ty != undefined ? ty : 0;
    this.array = null;
};

Matrix.prototype = {
    concat: function concat(mtx) {
        var a = this.a;
        var c = this.c;
        var tx = this.tx;

        this.a = a * mtx.a + this.b * mtx.c;
        this.b = a * mtx.b + this.b * mtx.d;
        this.c = c * mtx.a + this.d * mtx.c;
        this.d = c * mtx.b + this.d * mtx.d;
        this.tx = tx * mtx.a + this.ty * mtx.c + mtx.tx;
        this.ty = tx * mtx.b + this.ty * mtx.d + mtx.ty;
        return this;
    },
    concatTransform: function concatTransform(x, y, scaleX, scaleY, rotation) {
        var cos = 1;
        var sin = 0;
        if (rotation % 360) {
            var r = rotation * Math.PI / 180;
            cos = Math.cos(r);
            sin = Math.sin(r);
        }

        this.concat(new Matrix(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y));
        return this;
    },
    rotate: function rotate(angle) {
        //目前已经提供对顺时针逆时针两个方向旋转的支持
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);

        var a = this.a;
        var c = this.c;
        var tx = this.tx;

        if (angle > 0) {
            this.a = a * cos - this.b * sin;
            this.b = a * sin + this.b * cos;
            this.c = c * cos - this.d * sin;
            this.d = c * sin + this.d * cos;
            this.tx = tx * cos - this.ty * sin;
            this.ty = tx * sin + this.ty * cos;
        } else {
            var st = Math.sin(Math.abs(angle));
            var ct = Math.cos(Math.abs(angle));

            this.a = a * ct + this.b * st;
            this.b = -a * st + this.b * ct;
            this.c = c * ct + this.d * st;
            this.d = -c * st + ct * this.d;
            this.tx = ct * tx + st * this.ty;
            this.ty = ct * this.ty - st * tx;
        }
        return this;
    },
    scale: function scale(sx, sy) {
        this.a *= sx;
        this.d *= sy;
        this.tx *= sx;
        this.ty *= sy;
        return this;
    },
    translate: function translate(dx, dy) {
        this.tx += dx;
        this.ty += dy;
        return this;
    },
    identity: function identity() {
        //初始化
        this.a = this.d = 1;
        this.b = this.c = this.tx = this.ty = 0;
        return this;
    },
    invert: function invert() {
        //逆向矩阵
        var a = this.a;
        var b = this.b;
        var c = this.c;
        var d = this.d;
        var tx = this.tx;
        var i = a * d - b * c;

        this.a = d / i;
        this.b = -b / i;
        this.c = -c / i;
        this.d = a / i;
        this.tx = (c * this.ty - d * tx) / i;
        this.ty = -(a * this.ty - b * tx) / i;
        return this;
    },
    clone: function clone() {
        return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
    },
    toArray: function toArray(transpose, out) {
        if (arguments.length == 0) {
            //canvas2d 中不会有任何的参数传入
            return [this.a, this.b, this.c, this.d, this.tx, this.ty];
        }

        //webgl的glsl需要用的时候，需要传入transpose 来转换为一个3*3完整矩阵
        if (!this.array) {
            this.array = new Float32Array(9);
        }

        var array = out || this.array;

        if (transpose) {
            array[0] = this.a;
            array[1] = this.b;
            array[2] = 0;
            array[3] = this.c;
            array[4] = this.d;
            array[5] = 0;
            array[6] = this.tx;
            array[7] = this.ty;
            array[8] = 1;
        } else {
            array[0] = this.a;
            array[1] = this.c;
            array[2] = this.tx;
            array[3] = this.b;
            array[4] = this.d;
            array[5] = this.ty;
            array[6] = 0;
            array[7] = 0;
            array[8] = 1;
        }

        return array;
    },
    /**
     * 矩阵左乘向量
     */
    mulVector: function mulVector(v) {
        var aa = this.a,
            ac = this.c,
            atx = this.tx;
        var ab = this.b,
            ad = this.d,
            aty = this.ty;

        var out = [0, 0];
        out[0] = v[0] * aa + v[1] * ac + atx;
        out[1] = v[0] * ab + v[1] * ad + aty;

        return out;
    }
};

var commonjsGlobal$$1 = typeof window !== 'undefined' ? window : typeof commonjsGlobal$1 !== 'undefined' ? commonjsGlobal$1 : typeof self !== 'undefined' ? self : {};





function createCommonjsModule$$1(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var Tween = createCommonjsModule$$1(function (module, exports) {
/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */


var _Group = function () {
	this._tweens = {};
	this._tweensAddedDuringUpdate = {};
};

_Group.prototype = {
	getAll: function () {

		return Object.keys(this._tweens).map(function (tweenId) {
			return this._tweens[tweenId];
		}.bind(this));

	},

	removeAll: function () {

		this._tweens = {};

	},

	add: function (tween) {

		this._tweens[tween.getId()] = tween;
		this._tweensAddedDuringUpdate[tween.getId()] = tween;

	},

	remove: function (tween) {

		delete this._tweens[tween.getId()];
		delete this._tweensAddedDuringUpdate[tween.getId()];

	},

	update: function (time, preserve) {

		var tweenIds = Object.keys(this._tweens);

		if (tweenIds.length === 0) {
			return false;
		}

		time = time !== undefined ? time : TWEEN.now();

		// Tweens are updated in "batches". If you add a new tween during an update, then the
		// new tween will be updated in the next batch.
		// If you remove a tween during an update, it will normally still be updated. However,
		// if the removed tween was added during the current batch, then it will not be updated.
		while (tweenIds.length > 0) {
			this._tweensAddedDuringUpdate = {};

			for (var i = 0; i < tweenIds.length; i++) {

				if (this._tweens[tweenIds[i]].update(time) === false) {
					this._tweens[tweenIds[i]]._isPlaying = false;

					if (!preserve) {
						delete this._tweens[tweenIds[i]];
					}
				}
			}

			tweenIds = Object.keys(this._tweensAddedDuringUpdate);
		}

		return true;

	}
};

var TWEEN = new _Group();

TWEEN.Group = _Group;
TWEEN._nextId = 0;
TWEEN.nextId = function () {
	return TWEEN._nextId++;
};


// Include a performance.now polyfill.
// In node.js, use process.hrtime.
if (typeof (window) === 'undefined' && typeof (process) !== 'undefined') {
	TWEEN.now = function () {
		var time = process.hrtime();

		// Convert [seconds, nanoseconds] to milliseconds.
		return time[0] * 1000 + time[1] / 1000000;
	};
}
// In a browser, use window.performance.now if it is available.
else if (typeof (window) !== 'undefined' &&
         window.performance !== undefined &&
		 window.performance.now !== undefined) {
	// This must be bound, because directly assigning this function
	// leads to an invocation exception in Chrome.
	TWEEN.now = window.performance.now.bind(window.performance);
}
// Use Date.now if it is available.
else if (Date.now !== undefined) {
	TWEEN.now = Date.now;
}
// Otherwise, use 'new Date().getTime()'.
else {
	TWEEN.now = function () {
		return new Date().getTime();
	};
}


TWEEN.Tween = function (object, group) {
	this._object = object;
	this._valuesStart = {};
	this._valuesEnd = {};
	this._valuesStartRepeat = {};
	this._duration = 1000;
	this._repeat = 0;
	this._repeatDelayTime = undefined;
	this._yoyo = false;
	this._isPlaying = false;
	this._reversed = false;
	this._delayTime = 0;
	this._startTime = null;
	this._easingFunction = TWEEN.Easing.Linear.None;
	this._interpolationFunction = TWEEN.Interpolation.Linear;
	this._chainedTweens = [];
	this._onStartCallback = null;
	this._onStartCallbackFired = false;
	this._onUpdateCallback = null;
	this._onCompleteCallback = null;
	this._onStopCallback = null;
	this._group = group || TWEEN;
	this._id = TWEEN.nextId();

};

TWEEN.Tween.prototype = {
	getId: function getId() {
		return this._id;
	},

	isPlaying: function isPlaying() {
		return this._isPlaying;
	},

	to: function to(properties, duration) {

		this._valuesEnd = properties;

		if (duration !== undefined) {
			this._duration = duration;
		}

		return this;

	},

	start: function start(time) {

		this._group.add(this);

		this._isPlaying = true;

		this._onStartCallbackFired = false;

		this._startTime = time !== undefined ? typeof time === 'string' ? TWEEN.now() + parseFloat(time) : time : TWEEN.now();
		this._startTime += this._delayTime;

		for (var property in this._valuesEnd) {

			// Check if an Array was provided as property value
			if (this._valuesEnd[property] instanceof Array) {

				if (this._valuesEnd[property].length === 0) {
					continue;
				}

				// Create a local copy of the Array with the start value at the front
				this._valuesEnd[property] = [this._object[property]].concat(this._valuesEnd[property]);

			}

			// If `to()` specifies a property that doesn't exist in the source object,
			// we should not set that property in the object
			if (this._object[property] === undefined) {
				continue;
			}

			// Save the starting value.
			this._valuesStart[property] = this._object[property];

			if ((this._valuesStart[property] instanceof Array) === false) {
				this._valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
			}

			this._valuesStartRepeat[property] = this._valuesStart[property] || 0;

		}

		return this;

	},

	stop: function stop() {

		if (!this._isPlaying) {
			return this;
		}

		this._group.remove(this);
		this._isPlaying = false;

		if (this._onStopCallback !== null) {
			this._onStopCallback(this._object);
		}

		this.stopChainedTweens();
		return this;

	},

	end: function end() {

		this.update(this._startTime + this._duration);
		return this;

	},

	stopChainedTweens: function stopChainedTweens() {

		for (var i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
			this._chainedTweens[i].stop();
		}

	},

	delay: function delay(amount) {

		this._delayTime = amount;
		return this;

	},

	repeat: function repeat(times) {

		this._repeat = times;
		return this;

	},

	repeatDelay: function repeatDelay(amount) {

		this._repeatDelayTime = amount;
		return this;

	},

	yoyo: function yoyo(yoyo) {

		this._yoyo = yoyo;
		return this;

	},

	easing: function easing(easing) {

		this._easingFunction = easing;
		return this;

	},

	interpolation: function interpolation(interpolation) {

		this._interpolationFunction = interpolation;
		return this;

	},

	chain: function chain() {

		this._chainedTweens = arguments;
		return this;

	},

	onStart: function onStart(callback) {

		this._onStartCallback = callback;
		return this;

	},

	onUpdate: function onUpdate(callback) {

		this._onUpdateCallback = callback;
		return this;

	},

	onComplete: function onComplete(callback) {

		this._onCompleteCallback = callback;
		return this;

	},

	onStop: function onStop(callback) {

		this._onStopCallback = callback;
		return this;

	},

	update: function update(time) {

		var property;
		var elapsed;
		var value;

		if (time < this._startTime) {
			return true;
		}

		if (this._onStartCallbackFired === false) {

			if (this._onStartCallback !== null) {
				this._onStartCallback(this._object);
			}

			this._onStartCallbackFired = true;
		}

		elapsed = (time - this._startTime) / this._duration;
		elapsed = elapsed > 1 ? 1 : elapsed;

		value = this._easingFunction(elapsed);

		for (property in this._valuesEnd) {

			// Don't update properties that do not exist in the source object
			if (this._valuesStart[property] === undefined) {
				continue;
			}

			var start = this._valuesStart[property] || 0;
			var end = this._valuesEnd[property];

			if (end instanceof Array) {

				this._object[property] = this._interpolationFunction(end, value);

			} else {

				// Parses relative end values with start as base (e.g.: +10, -3)
				if (typeof (end) === 'string') {

					if (end.charAt(0) === '+' || end.charAt(0) === '-') {
						end = start + parseFloat(end);
					} else {
						end = parseFloat(end);
					}
				}

				// Protect against non numeric properties.
				if (typeof (end) === 'number') {
					this._object[property] = start + (end - start) * value;
				}

			}

		}

		if (this._onUpdateCallback !== null) {
			this._onUpdateCallback(this._object);
		}

		if (elapsed === 1) {

			if (this._repeat > 0) {

				if (isFinite(this._repeat)) {
					this._repeat--;
				}

				// Reassign starting values, restart by making startTime = now
				for (property in this._valuesStartRepeat) {

					if (typeof (this._valuesEnd[property]) === 'string') {
						this._valuesStartRepeat[property] = this._valuesStartRepeat[property] + parseFloat(this._valuesEnd[property]);
					}

					if (this._yoyo) {
						var tmp = this._valuesStartRepeat[property];

						this._valuesStartRepeat[property] = this._valuesEnd[property];
						this._valuesEnd[property] = tmp;
					}

					this._valuesStart[property] = this._valuesStartRepeat[property];

				}

				if (this._yoyo) {
					this._reversed = !this._reversed;
				}

				if (this._repeatDelayTime !== undefined) {
					this._startTime = time + this._repeatDelayTime;
				} else {
					this._startTime = time + this._delayTime;
				}

				return true;

			} else {

				if (this._onCompleteCallback !== null) {

					this._onCompleteCallback(this._object);
				}

				for (var i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
					// Make the chained tweens start exactly at the time they should,
					// even if the `update()` method was called way past the duration of the tween
					this._chainedTweens[i].start(this._startTime + this._duration);
				}

				return false;

			}

		}

		return true;

	}
};


TWEEN.Easing = {

	Linear: {

		None: function (k) {

			return k;

		}

	},

	Quadratic: {

		In: function (k) {

			return k * k;

		},

		Out: function (k) {

			return k * (2 - k);

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k;
			}

			return - 0.5 * (--k * (k - 2) - 1);

		}

	},

	Cubic: {

		In: function (k) {

			return k * k * k;

		},

		Out: function (k) {

			return --k * k * k + 1;

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k;
			}

			return 0.5 * ((k -= 2) * k * k + 2);

		}

	},

	Quartic: {

		In: function (k) {

			return k * k * k * k;

		},

		Out: function (k) {

			return 1 - (--k * k * k * k);

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k;
			}

			return - 0.5 * ((k -= 2) * k * k * k - 2);

		}

	},

	Quintic: {

		In: function (k) {

			return k * k * k * k * k;

		},

		Out: function (k) {

			return --k * k * k * k * k + 1;

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k * k;
			}

			return 0.5 * ((k -= 2) * k * k * k * k + 2);

		}

	},

	Sinusoidal: {

		In: function (k) {

			return 1 - Math.cos(k * Math.PI / 2);

		},

		Out: function (k) {

			return Math.sin(k * Math.PI / 2);

		},

		InOut: function (k) {

			return 0.5 * (1 - Math.cos(Math.PI * k));

		}

	},

	Exponential: {

		In: function (k) {

			return k === 0 ? 0 : Math.pow(1024, k - 1);

		},

		Out: function (k) {

			return k === 1 ? 1 : 1 - Math.pow(2, - 10 * k);

		},

		InOut: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			if ((k *= 2) < 1) {
				return 0.5 * Math.pow(1024, k - 1);
			}

			return 0.5 * (- Math.pow(2, - 10 * (k - 1)) + 2);

		}

	},

	Circular: {

		In: function (k) {

			return 1 - Math.sqrt(1 - k * k);

		},

		Out: function (k) {

			return Math.sqrt(1 - (--k * k));

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return - 0.5 * (Math.sqrt(1 - k * k) - 1);
			}

			return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);

		}

	},

	Elastic: {

		In: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);

		},

		Out: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;

		},

		InOut: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			k *= 2;

			if (k < 1) {
				return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
			}

			return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;

		}

	},

	Back: {

		In: function (k) {

			var s = 1.70158;

			return k * k * ((s + 1) * k - s);

		},

		Out: function (k) {

			var s = 1.70158;

			return --k * k * ((s + 1) * k + s) + 1;

		},

		InOut: function (k) {

			var s = 1.70158 * 1.525;

			if ((k *= 2) < 1) {
				return 0.5 * (k * k * ((s + 1) * k - s));
			}

			return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);

		}

	},

	Bounce: {

		In: function (k) {

			return 1 - TWEEN.Easing.Bounce.Out(1 - k);

		},

		Out: function (k) {

			if (k < (1 / 2.75)) {
				return 7.5625 * k * k;
			} else if (k < (2 / 2.75)) {
				return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
			} else if (k < (2.5 / 2.75)) {
				return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
			} else {
				return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
			}

		},

		InOut: function (k) {

			if (k < 0.5) {
				return TWEEN.Easing.Bounce.In(k * 2) * 0.5;
			}

			return TWEEN.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;

		}

	}

};

TWEEN.Interpolation = {

	Linear: function (v, k) {

		var m = v.length - 1;
		var f = m * k;
		var i = Math.floor(f);
		var fn = TWEEN.Interpolation.Utils.Linear;

		if (k < 0) {
			return fn(v[0], v[1], f);
		}

		if (k > 1) {
			return fn(v[m], v[m - 1], m - f);
		}

		return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);

	},

	Bezier: function (v, k) {

		var b = 0;
		var n = v.length - 1;
		var pw = Math.pow;
		var bn = TWEEN.Interpolation.Utils.Bernstein;

		for (var i = 0; i <= n; i++) {
			b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
		}

		return b;

	},

	CatmullRom: function (v, k) {

		var m = v.length - 1;
		var f = m * k;
		var i = Math.floor(f);
		var fn = TWEEN.Interpolation.Utils.CatmullRom;

		if (v[0] === v[m]) {

			if (k < 0) {
				i = Math.floor(f = m * (1 + k));
			}

			return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);

		} else {

			if (k < 0) {
				return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
			}

			if (k > 1) {
				return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
			}

			return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);

		}

	},

	Utils: {

		Linear: function (p0, p1, t) {

			return (p1 - p0) * t + p0;

		},

		Bernstein: function (n, i) {

			var fc = TWEEN.Interpolation.Utils.Factorial;

			return fc(n) / fc(i) / fc(n - i);

		},

		Factorial: (function () {

			var a = [1];

			return function (n) {

				var s = 1;

				if (a[n]) {
					return a[n];
				}

				for (var i = n; i > 1; i--) {
					s *= i;
				}

				a[n] = s;
				return s;

			};

		})(),

		CatmullRom: function (p0, p1, p2, p3, t) {

			var v0 = (p2 - p0) * 0.5;
			var v1 = (p3 - p1) * 0.5;
			var t2 = t * t;
			var t3 = t * t2;

			return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (- 3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;

		}

	}

};

// UMD (Universal Module Definition)
(function (root) {

	if (typeof undefined === 'function' && undefined.amd) {

		// AMD
		undefined([], function () {
			return TWEEN;
		});

	} else {

		// Node.js
		module.exports = TWEEN;

	}

})(commonjsGlobal$$1);
});

//import Tween from "./Tween"
/**
 * 设置 AnimationFrame begin
 */
var lastTime = 0;
var vendors = ['ms', 'moz', 'webkit', 'o'];
for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
}
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function () {
            callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
}
if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
    };
}

//管理所有图表的渲染任务
var _taskList = []; //[{ id : task: }...]
var _requestAid = null;

function enabledAnimationFrame() {
    if (!_requestAid) {
        _requestAid = requestAnimationFrame(function () {
            //console.log("frame__" + _taskList.length);
            //if ( Tween.getAll().length ) {
            Tween.update(); //tween自己会做length判断
            //};
            var currTaskList = _taskList;
            _taskList = [];
            _requestAid = null;
            while (currTaskList.length > 0) {
                currTaskList.shift().task();
            }
        });
    }
    return _requestAid;
}

/*
 * @param task 要加入到渲染帧队列中的任务
 * @result frameid
 */
function registFrame($frame) {
    if (!$frame) {
        return;
    }
    _taskList.push($frame);
    return enabledAnimationFrame();
}

/*
 *  @param task 要从渲染帧队列中删除的任务
 */
function destroyFrame($frame) {
    var d_result = false;
    for (var i = 0, l = _taskList.length; i < l; i++) {
        if (_taskList[i].id === $frame.id) {
            d_result = true;
            _taskList.splice(i, 1);
            i--;
            l--;
        }
    }
    if (_taskList.length == 0) {
        cancelAnimationFrame(_requestAid);
        _requestAid = null;
    }
    return d_result;
}

/* 
 * @param opt {from , to , onUpdate , onComplete , ......}
 * @result tween
 */
function registTween(options) {
    var opt = _.extend({
        from: null,
        to: null,
        duration: 500,
        onStart: function onStart() {},
        onUpdate: function onUpdate() {},
        onComplete: function onComplete() {},
        onStop: function onStop() {},
        repeat: 0,
        delay: 0,
        easing: 'Linear.None',
        desc: '' //动画描述，方便查找bug
    }, options);

    var tween = {};
    var tid = "tween_" + Utils.getUID();
    opt.id && (tid = tid + "_" + opt.id);

    if (opt.from && opt.to) {
        (function () {
            var animate = function animate() {

                if (tween._isCompleteed || tween._isStoped) {
                    tween = null;
                    return;
                }
                registFrame({
                    id: tid,
                    task: animate,
                    desc: opt.desc,
                    tween: tween
                });
            };

            tween = new Tween.Tween(opt.from).to(opt.to, opt.duration).onStart(function () {
                //opt.onStart.apply( this )
                opt.onStart(opt.from);
            }).onUpdate(function () {
                //opt.onUpdate.apply( this );
                opt.onUpdate(opt.from);
            }).onComplete(function () {
                destroyFrame({
                    id: tid
                });
                tween._isCompleteed = true;
                //opt.onComplete.apply( this , [this] ); //执行用户的conComplete
                opt.onComplete(opt.from);
            }).onStop(function () {
                destroyFrame({
                    id: tid
                });
                tween._isStoped = true;
                //opt.onStop.apply( this , [this] );
                opt.onStop(opt.from);
            }).repeat(opt.repeat).delay(opt.delay).easing(Tween.Easing[opt.easing.split(".")[0]][opt.easing.split(".")[1]]);

            tween.id = tid;
            tween.start();

            
            animate();
        })();
    }
    return tween;
}
/*
 * @param tween
 * @result void(0)
 */
function destroyTween(tween, msg) {
    tween.stop();
}

var AnimationFrame = {
    registFrame: registFrame,
    destroyFrame: destroyFrame,
    registTween: registTween,
    destroyTween: destroyTween
};

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 把canvax元素的context实现监听属性改动
 * 来给整个引擎提供心跳包的触发机制
 */

function Observe(scope) {

    var stopRepeatAssign = true;

    var pmodel = {},
        //要返回的对象
    accessores = {},
        //内部用于转换的对象
    _Publics = ["$watch", "$model"],
        //公共属性，不需要get set 化的
    model = {}; //这是pmodel上的$model属性

    var Publics = _Publics;

    function loop(name, val) {
        if (_.indexOf(_Publics, name) === -1) {
            //非 _Publics 中的值，都要先设置好对应的val到model上
            model[name] = val;
        }

        var valueType = typeof val === "undefined" ? "undefined" : _typeof(val);

        if (_.indexOf(Publics, name) > -1) {
            return;
        }

        if (valueType === "function") {
            Publics.push(name); //函数无需要转换，也可以做为公共属性存在
        } else {
            var accessor = function accessor(neo) {
                //创建监控属性或数组，自变量，由用户触发其改变

                var value = model[name],
                    preValue = value,
                    complexValue;

                if (arguments.length) {
                    //写操作
                    //set 的 值的 类型
                    var neoType = typeof neo === "undefined" ? "undefined" : _typeof(neo);

                    if (stopRepeatAssign) {
                        return; //阻止重复赋值
                    }

                    if (value !== neo) {
                        if (neo && neoType === "object" && !(neo instanceof Array) && !neo.addColorStop // neo instanceof CanvasGradient
                        ) {
                                value = neo.$model ? neo : Observe(neo, neo);
                                complexValue = value.$model;
                            } else {
                            //如果是其他数据类型
                            value = neo;
                        }

                        //accessor.value = value;
                        model[name] = complexValue ? complexValue : value; //更新$model中的值

                        if (valueType != neoType) {
                            //如果set的值类型已经改变，
                            //那么也要把对应的valueType修改为对应的neoType
                            valueType = neoType;
                        }

                        if (pmodel.$watch) {
                            pmodel.$watch.call(pmodel, name, value, preValue);
                        }
                    }
                } else {
                    //读操作
                    //读的时候，发现value是个obj，而且还没有defineProperty
                    //那么就临时defineProperty一次
                    if (value && valueType === "object" && !(value instanceof Array) && !value.$model && !value.addColorStop) {

                        value = Observe(value, value);
                        value.$watch = pmodel.$watch;
                        //accessor.value = value;
                        model[name] = value;
                    }
                    return value;
                }
            };
            //accessor.value = val;

            accessores[name] = {
                set: accessor,
                get: accessor,
                enumerable: true
            };
        }
    }

    for (var i in scope) {
        loop(i, scope[i]);
    }

    pmodel = defineProperties(pmodel, accessores, Publics); //生成一个空的ViewModel

    _.forEach(Publics, function (name) {
        if (scope[name]) {
            //然后为函数等不被监控的属性赋值
            if (typeof scope[name] == "function") {
                pmodel[name] = function () {
                    scope[name].apply(this, arguments);
                };
            } else {
                pmodel[name] = scope[name];
            }
        }
    });

    pmodel.$model = model;

    pmodel.hasOwnProperty = function (name) {
        return name in pmodel.$model;
    };

    stopRepeatAssign = false;

    return pmodel;
}

var defineProperty$1 = Object.defineProperty;
//如果浏览器不支持ecma262v5的Object.defineProperties或者存在BUG，比如IE8
//标准浏览器使用__defineGetter__, __defineSetter__实现
try {
    defineProperty$1({}, "_", {
        value: "x"
    });
    var defineProperties = Object.defineProperties;
} catch (e) {
    if ("__defineGetter__" in Object) {
        defineProperty$1 = function defineProperty$$1(obj, prop, desc) {
            if ('value' in desc) {
                obj[prop] = desc.value;
            }
            if ('get' in desc) {
                obj.__defineGetter__(prop, desc.get);
            }
            if ('set' in desc) {
                obj.__defineSetter__(prop, desc.set);
            }
            return obj;
        };
        defineProperties = function defineProperties(obj, descs) {
            for (var prop in descs) {
                if (descs.hasOwnProperty(prop)) {
                    defineProperty$1(obj, prop, descs[prop]);
                }
            }
            return obj;
        };
    }
}

var RENDERER_TYPE = {
    UNKNOWN: 0,
    WEBGL: 1,
    CANVAS: 2
};



var SHAPES = {
    POLY: 0,
    RECT: 1,
    CIRC: 2,
    ELIP: 3
};






//会影响到transform改变的context属性
var TRANSFORM_PROPS = ["x", "y", "scaleX", "scaleY", "rotation", "scaleOrigin", "rotateOrigin"];

//所有和样式相关的属性
//appha 有 自己的 处理方式
var STYLE_PROPS = ["lineWidth", "lineAlpha", "strokeStyle", "fillStyle", "fillAlpha", "globalAlpha"];

/**
 * 线段包含判断
 * @points [0,0,0,0]
 */
var _isInsideLine = function _isInsideLine(points, x, y, lineWidth) {
    var x0 = points[0];
    var y0 = points[1];
    var x1 = points[2];
    var y1 = points[3];
    var _l = Math.max(lineWidth, 3);
    var _a = 0;
    var _b = x0;

    if (y > y0 + _l && y > y1 + _l || y < y0 - _l && y < y1 - _l || x > x0 + _l && x > x1 + _l || x < x0 - _l && x < x1 - _l) {
        return false;
    }

    if (x0 !== x1) {
        _a = (y0 - y1) / (x0 - x1);
        _b = (x0 * y1 - x1 * y0) / (x0 - x1);
    } else {
        return Math.abs(x - x0) <= _l / 2;
    }

    var _s = (_a * x - y + _b) * (_a * x - y + _b) / (_a * _a + 1);
    return _s <= _l / 2 * _l / 2;
};

function insideLine(data, x, y, line) {
    var points = data.shape.points;
    var lineWidth = data.lineWidth;
    var insideCatch = false;
    for (var i = 0; i < points.length; ++i) {
        insideCatch = _isInsideLine(points.slice(i, i + 4), x, y, lineWidth);
        if (insideCatch) {
            break;
        }
        i += 1;
    }
    return insideCatch;
}

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 模拟as3 DisplayList 的 现实对象基类
 */
var DisplayObject = function (_EventDispatcher) {
    inherits(DisplayObject, _EventDispatcher);

    function DisplayObject(opt) {
        classCallCheck(this, DisplayObject);

        //相对父级元素的矩阵
        var _this = possibleConstructorReturn(this, (DisplayObject.__proto__ || Object.getPrototypeOf(DisplayObject)).call(this, opt));

        _this._transform = null;
        _this.worldTransform = null;
        //_transform如果有修改，则_transformChange为true，renderer的时候worldTransform
        _this._transformChange = false;

        //心跳次数
        _this._heartBeatNum = 0;

        //元素对应的stage元素
        _this.stage = null;

        //元素的父元素
        _this.parent = null;

        _this.xyToInt = "xyToInt" in opt ? opt.xyToInt : true; //是否对xy坐标统一int处理，默认为true，但是有的时候可以由外界用户手动指定是否需要计算为int，因为有的时候不计算比较好，比如，进度图表中，再sector的两端添加两个圆来做圆角的进度条的时候，圆circle不做int计算，才能和sector更好的衔接

        _this.moveing = false; //如果元素在最轨道运动中的时候，最好把这个设置为true，这样能保证轨迹的丝搬顺滑，否则因为xyToInt的原因，会有跳跃

        //创建好context
        _this.context = _this._createContext(opt);

        _this.type = opt.type || "DisplayObject";

        _this.id = opt.id || Utils.createId(_this.type);

        _this.init.apply(_this, arguments);

        //所有属性准备好了后，先要计算一次this._updateTransform()得到_tansform
        _this._updateTransform();
        return _this;
    }

    createClass(DisplayObject, [{
        key: "init",
        value: function init() {}
    }, {
        key: "_createContext",
        value: function _createContext(opt) {
            var self = this;

            var optCtx = opt.context || {};

            var _contextATTRS = {
                width: optCtx.width || 0,
                height: optCtx.height || 0,
                x: optCtx.x || 0,
                y: optCtx.y || 0,
                scaleX: optCtx.scaleX || 1,
                scaleY: optCtx.scaleY || 1,
                scaleOrigin: optCtx.scaleOrigin || {
                    x: 0,
                    y: 0
                },
                rotation: optCtx.rotation || 0,
                rotateOrigin: optCtx.rotateOrigin || {
                    x: 0,
                    y: 0
                },
                visible: optCtx.visible || true,
                globalAlpha: optCtx.globalAlpha || 1

                //样式部分迁移到shape中
                //cursor        : optCtx.cursor || "default",
                //fillAlpha     : optCtx.fillAlpha || 1,//context2d里没有，自定义
                //fillStyle     : optCtx.fillStyle || null,//"#000000",

                //lineCap       : optCtx.lineCap || null,//默认都是直角
                //lineJoin      : optCtx.lineJoin || null,//这两个目前webgl里面没实现
                //miterLimit    : optCtx.miterLimit || null,//miterLimit 属性设置或返回最大斜接长度,只有当 lineJoin 属性为 "miter" 时，miterLimit 才有效。

                //lineAlpha     : optCtx.lineAlpha || 1,//context2d里没有，自定义
                //strokeStyle   : optCtx.strokeStyle || null,
                //lineType      : optCtx.lineType || "solid", //context2d里没有，自定义线条的type，默认为实线
                //lineWidth     : optCtx.lineWidth || null
            };

            //平凡的clone数据非常的耗时，还是走回原来的路
            //var _contextATTRS = _.extend( true , _.clone(CONTEXT_DEFAULT), opt.context );

            _.extend(true, _contextATTRS, opt.context);

            //有些引擎内部设置context属性的时候是不用上报心跳的，比如做热点检测的时候
            self._notWatch = false;

            //不需要发心跳信息
            self._noHeart = false;

            //_contextATTRS.$owner = self;
            _contextATTRS.$watch = function (name, value, preValue) {
                //下面的这些属性变化，都会需要重新组织矩阵属性 _transform 
                var obj = self; //this.$owner;

                if (_.indexOf(TRANSFORM_PROPS, name) > -1) {
                    obj._updateTransform();
                    obj._transformChange = true;
                }

                if (obj._notWatch) {
                    return;
                }

                if (obj.$watch) {
                    obj.$watch(name, value, preValue);
                }

                if (obj._noHeart) {
                    return;
                }

                obj.heartBeat({
                    convertType: "context",
                    shape: obj,
                    name: name,
                    value: value,
                    preValue: preValue
                });
            };

            //执行init之前，应该就根据参数，把context组织好线
            return Observe(_contextATTRS);
        }

        /* @myself 是否生成自己的镜像 
         * 克隆又两种，一种是镜像，另外一种是绝对意义上面的新个体
         * 默认为绝对意义上面的新个体，新对象id不能相同
         * 镜像基本上是框架内部在实现  镜像的id相同 主要用来把自己画到另外的stage里面，比如
         * mouseover和mouseout的时候调用*/

    }, {
        key: "clone",
        value: function clone(myself) {
            var conf = {
                id: this.id,
                context: _.clone(this.context.$model),
                isClone: true
            };

            var newObj;
            if (this.type == 'text') {
                newObj = new this.constructor(this.text, conf);
            } else {
                newObj = new this.constructor(conf);
            }

            newObj.id = conf.id;

            if (this.children) {
                newObj.children = this.children;
            }

            if (this.graphics) {
                newObj.graphics = this.graphics.clone();
            }

            if (!myself) {
                newObj.id = Utils.createId(newObj.type);
            }
            return newObj;
        }
    }, {
        key: "heartBeat",
        value: function heartBeat(opt) {
            //stage存在，才说self代表的display已经被添加到了displayList中，绘图引擎需要知道其改变后
            //的属性，所以，通知到stage.displayAttrHasChange
            var stage = this.getStage();
            if (stage) {
                this._heartBeatNum++;
                stage.heartBeat && stage.heartBeat(opt);
            }
        }
    }, {
        key: "getCurrentWidth",
        value: function getCurrentWidth() {
            return Math.abs(this.context.$model.width * this.context.$model.scaleX);
        }
    }, {
        key: "getCurrentHeight",
        value: function getCurrentHeight() {
            return Math.abs(this.context.$model.height * this.context.$model.scaleY);
        }
    }, {
        key: "getStage",
        value: function getStage() {
            if (this.stage) {
                return this.stage;
            }
            var p = this;
            if (p.type != "stage") {
                while (p.parent) {
                    p = p.parent;
                    if (p.type == "stage") {
                        break;
                    }
                }
                if (p.type !== "stage") {
                    //如果得到的顶点display 的type不是Stage,也就是说不是stage元素
                    //那么只能说明这个p所代表的顶端display 还没有添加到displayList中，也就是没有没添加到
                    //stage舞台的childen队列中，不在引擎渲染范围内
                    return false;
                }
            }
            //一直回溯到顶层object， 即是stage， stage的parent为null
            this.stage = p;
            return p;
        }
    }, {
        key: "localToGlobal",
        value: function localToGlobal(point, container) {
            !point && (point = new Point(0, 0));
            var cm = this.getConcatenatedMatrix(container);

            if (cm == null) return Point(0, 0);
            var m = new Matrix(1, 0, 0, 1, point.x, point.y);
            m.concat(cm);
            return new Point(m.tx, m.ty); //{x:m.tx, y:m.ty};
        }
    }, {
        key: "globalToLocal",
        value: function globalToLocal(point, container) {
            !point && (point = new Point(0, 0));

            if (this.type == "stage") {
                return point;
            }
            var cm = this.getConcatenatedMatrix(container);

            if (cm == null) return new Point(0, 0); //{x:0, y:0};
            cm.invert();
            var m = new Matrix(1, 0, 0, 1, point.x, point.y);
            m.concat(cm);
            return new Point(m.tx, m.ty); //{x:m.tx, y:m.ty};
        }
    }, {
        key: "localToTarget",
        value: function localToTarget(point, target) {
            var p = localToGlobal(point);
            return target.globalToLocal(p);
        }
    }, {
        key: "getConcatenatedMatrix",
        value: function getConcatenatedMatrix(container) {
            var cm = new Matrix();
            for (var o = this; o != null; o = o.parent) {
                cm.concat(o._transform);
                if (!o.parent || container && o.parent && o.parent == container || o.parent && o.parent.type == "stage") {
                    //if( o.type == "stage" || (o.parent && container && o.parent.type == container.type ) ) {
                    return cm; //break;
                }
            }
            return cm;
        }

        /*
         *设置元素的是否响应事件检测
         *@bool  Boolean 类型
         */

    }, {
        key: "setEventEnable",
        value: function setEventEnable(bool) {
            if (_.isBoolean(bool)) {
                this._eventEnabled = bool;
                return true;
            }
            return false;
        }

        /*
         *查询自己在parent的队列中的位置
         */

    }, {
        key: "getIndex",
        value: function getIndex() {
            if (!this.parent) {
                return;
            }
            return _.indexOf(this.parent.children, this);
        }

        /*
         *元素在z轴方向向下移动
         *@num 移动的层级
         */

    }, {
        key: "toBack",
        value: function toBack(num) {
            if (!this.parent) {
                return;
            }
            var fromIndex = this.getIndex();
            var toIndex = 0;

            if (_.isNumber(num)) {
                if (num == 0) {
                    //原地不动
                    return;
                }
                toIndex = fromIndex - num;
            }
            var me = this.parent.children.splice(fromIndex, 1)[0];
            if (toIndex < 0) {
                toIndex = 0;
            }
            this.parent.addChildAt(me, toIndex);
        }

        /*
         *元素在z轴方向向上移动
         *@num 移动的层数量 默认到顶端
         */

    }, {
        key: "toFront",
        value: function toFront(num) {
            if (!this.parent) {
                return;
            }
            var fromIndex = this.getIndex();
            var pcl = this.parent.children.length;
            var toIndex = pcl;

            if (_.isNumber(num)) {
                if (num == 0) {
                    //原地不动
                    return;
                }
                toIndex = fromIndex + num + 1;
            }
            var me = this.parent.children.splice(fromIndex, 1)[0];
            if (toIndex > pcl) {
                toIndex = pcl;
            }
            this.parent.addChildAt(me, toIndex - 1);
        }
    }, {
        key: "_updateTransform",
        value: function _updateTransform() {
            var _transform = new Matrix();
            _transform.identity();
            var context = this.context;
            //是否需要Transform
            if (context.scaleX !== 1 || context.scaleY !== 1) {
                //如果有缩放
                //缩放的原点坐标
                var origin = new Point(context.scaleOrigin);
                if (origin.x || origin.y) {
                    _transform.translate(-origin.x, -origin.y);
                }
                _transform.scale(context.scaleX, context.scaleY);
                if (origin.x || origin.y) {
                    _transform.translate(origin.x, origin.y);
                }
            }

            var rotation = context.rotation;
            if (rotation) {
                //如果有旋转
                //旋转的原点坐标
                var origin = new Point(context.rotateOrigin);
                if (origin.x || origin.y) {
                    _transform.translate(-origin.x, -origin.y);
                }
                _transform.rotate(rotation % 360 * Math.PI / 180);
                if (origin.x || origin.y) {
                    _transform.translate(origin.x, origin.y);
                }
            }

            //如果有位移
            var x, y;
            if (this.xyToInt && !this.moveing) {
                //当这个元素在做轨迹运动的时候，比如drag，animation如果实时的调整这个x ， y
                //那么该元素的轨迹会有跳跃的情况发生。所以加个条件过滤，
                var x = parseInt(context.x);
                var y = parseInt(context.y);

                if (parseInt(context.lineWidth, 10) % 2 == 1 && context.strokeStyle) {
                    x += 0.5;
                    y += 0.5;
                }
            } else {
                x = context.x;
                y = context.y;
            }

            if (x != 0 || y != 0) {
                _transform.translate(x, y);
            }
            this._transform = _transform;
            return _transform;
        }

        //获取全局的世界坐标系内的矩阵
        //世界坐标是从上而下的，所以只要和parent的直接坐标相乘就好了

    }, {
        key: "setWorldTransform",
        value: function setWorldTransform() {
            //if( !this.worldTransform ){
            var cm = new Matrix();
            cm.concat(this._transform);
            cm.concat(this.parent.worldTransform);
            this.worldTransform = cm;
            //};
            return this.worldTransform;
        }

        //显示对象的选取检测处理函数

    }, {
        key: "getChildInPoint",
        value: function getChildInPoint(point) {

            var result = false; //检测的结果

            //第一步，吧glob的point转换到对应的obj的层级内的坐标系统
            //if( this.type != "stage" && this.parent && this.parent.type != "stage" ) {
            //    point = this.parent.globalToLocal( point );
            //};
            //var m = new Matrix( Settings.RESOLUTION, 0, 0, Settings.RESOLUTION, point.x , point.y);
            //m.concat( this.worldTransform );

            var x = point.x;
            var y = point.y;

            //对鼠标的坐标也做相同的变换
            if (this.worldTransform) {

                var inverseMatrix = this.worldTransform.clone().invert();
                var originPos = [x * settings.RESOLUTION, y * settings.RESOLUTION];

                originPos = inverseMatrix.mulVector(originPos);

                x = originPos[0];
                y = originPos[1];
            }

            if (this.graphics) {
                result = this.containsPoint({ x: x, y: y });
            }

            return result;
        }
    }, {
        key: "containsPoint",
        value: function containsPoint(point) {
            var inside = false;
            for (var i = 0; i < this.graphics.graphicsData.length; ++i) {
                var data = this.graphics.graphicsData[i];
                if (data.shape) {
                    //先检测fill， fill的检测概率大些。
                    //像circle,ellipse这样的shape 就直接把lineWidth算在fill里面计算就好了，所以他们是没有insideLine的
                    if (data.hasFill() && data.shape.contains(point.x, point.y)) {
                        inside = true;
                        if (inside) {
                            break;
                        }
                    }

                    //circle,ellipse等就没有points
                    if (data.hasLine() && data.shape.points) {
                        //然后检测是否和描边碰撞
                        inside = insideLine(data, point.x, point.y);
                        if (inside) {
                            break;
                        }
                    }
                }
            }
            return inside;
        }

        /*
        * animate
        * @param toContent 要动画变形到的属性集合
        * @param options tween 动画参数
        */

    }, {
        key: "animate",
        value: function animate(toContent, options, context) {

            if (!context) {
                context = this.context;
            }

            var to = toContent;
            var from = null;
            for (var p in to) {
                if (_.isObject(to[p])) {

                    //options必须传递一份copy出去，比如到下一个animate
                    this.animate(to[p], _.extend({}, options), context[p]);
                    //如果是个object
                    continue;
                }
                if (isNaN(to[p]) && to[p] !== '' && to[p] !== null && to[p] !== undefined) {
                    delete to[p];
                    continue;
                }
                if (!from) {
                    from = {};
                }
                from[p] = context[p];
            }

            if (!from) {
                //这里很重要，不能删除。 
                //比如line.animate({start:{x:0,y:0}} , {duration:500});
                //那么递归到start的时候  from 的值依然为null
                //如果这个时候继续执行的话，会有很严重的bug
                //line.context.start 会 被赋值了 line对象上的所有属性，严重的bug
                return;
            }

            !options && (options = {});
            options.from = from;
            options.to = to;

            var self = this;
            var upFun = function upFun() {};
            if (options.onUpdate) {
                upFun = options.onUpdate;
            }
            var tween;
            options.onUpdate = function (status) {
                //如果context不存在说明该obj已经被destroy了，那么要把他的tween给destroy
                if (!context && tween) {
                    AnimationFrame.destroyTween(tween);
                    tween = null;
                    return;
                }
                for (var p in status) {
                    context[p] = status[p];
                }
                upFun.apply(self, [status]);
            };

            var compFun = function compFun() {};
            if (options.onComplete) {
                compFun = options.onComplete;
            }
            options.onComplete = function (status) {
                compFun.apply(self, arguments);
            };
            tween = AnimationFrame.registTween(options);
            return tween;
        }

        //从树中删除

    }, {
        key: "remove",
        value: function remove() {
            if (this.parent) {
                this.parent.removeChild(this);
                this.parent = null;
            }
        }
    }, {
        key: "destroy",
        value: function destroy() {
            this._destroy();
        }

        //元素的自我销毁

    }, {
        key: "_destroy",
        value: function _destroy() {
            this.remove();
            this.fire("destroy");
            //把自己从父节点中删除了后做自我清除，释放内存
            this.context = null;
            delete this.context;
        }
    }]);
    return DisplayObject;
}(EventDispatcher);

/** 
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 模拟as3的DisplayList 中的容器类
 */
var DisplayObjectContainer = function (_DisplayObject) {
    inherits(DisplayObjectContainer, _DisplayObject);

    function DisplayObjectContainer(opt) {
        classCallCheck(this, DisplayObjectContainer);

        var _this = possibleConstructorReturn(this, (DisplayObjectContainer.__proto__ || Object.getPrototypeOf(DisplayObjectContainer)).call(this, opt));

        _this.children = [];
        _this.mouseChildren = [];
        //所有的容器默认支持event 检测，因为 可能有里面的shape是eventEnable是true的
        //如果用户有强制的需求让容器下的所有元素都 不可检测，可以调用
        //DisplayObjectContainer的 setEventEnable() 方法
        _this._eventEnabled = true;
        return _this;
    }

    createClass(DisplayObjectContainer, [{
        key: "addChild",
        value: function addChild(child, index) {
            if (!child) {
                return;
            }
            if (this.getChildIndex(child) != -1) {
                child.parent = this;
                return child;
            }
            //如果他在别的子元素中，那么就从别人那里删除了
            if (child.parent) {
                child.parent.removeChild(child);
            }

            if (index === undefined) {
                index = this.children.length;
            }

            this.children.splice(index, 0, child);

            child.parent = this;

            if (this.heartBeat) {
                this.heartBeat({
                    convertType: "children",
                    target: child,
                    src: this
                });
            }

            if (this._afterAddChild) {
                this._afterAddChild(child);
            }

            return child;
        }
    }, {
        key: "addChildAt",
        value: function addChildAt(child, index) {
            return this.addChild(child, index);
        }
    }, {
        key: "removeChild",
        value: function removeChild(child) {
            return this.removeChildAt(_.indexOf(this.children, child));
        }
    }, {
        key: "removeChildAt",
        value: function removeChildAt(index) {
            if (index < 0 || index > this.children.length - 1) {
                return false;
            }
            var child = this.children[index];
            if (child != null) {
                child.parent = null;
            }
            this.children.splice(index, 1);

            if (this.heartBeat) {
                this.heartBeat({
                    convertType: "children",
                    target: child,
                    src: this
                });
            }

            if (this._afterDelChild) {
                this._afterDelChild(child, index);
            }

            return child;
        }
    }, {
        key: "removeChildById",
        value: function removeChildById(id) {
            for (var i = 0, len = this.children.length; i < len; i++) {
                if (this.children[i].id == id) {
                    return this.removeChildAt(i);
                }
            }
            return false;
        }
    }, {
        key: "removeAllChildren",
        value: function removeAllChildren() {
            while (this.children.length > 0) {
                this.removeChildAt(0);
            }
        }

        //集合类的自我销毁

    }, {
        key: "destroy",
        value: function destroy() {
            /*
            if( this.parent ){
                this.parent.removeChild(this);
                this.parent = null;
            };
            this.fire("destroy");
            */
            this._destroy();
            //依次销毁所有子元素
            for (var i = 0, l = this.children.length; i < l; i++) {
                this.getChildAt(i).destroy();
                i--;
                l--;
            }
        }

        /*
         *@id 元素的id
         *@boolen 是否深度查询，默认就在第一层子元素中查询
         **/

    }, {
        key: "getChildById",
        value: function getChildById(id, boolen) {
            if (!boolen) {
                for (var i = 0, len = this.children.length; i < len; i++) {
                    if (this.children[i].id == id) {
                        return this.children[i];
                    }
                }
            } else {
                //深度查询
                //TODO:暂时未实现
                return null;
            }
            return null;
        }
    }, {
        key: "getChildAt",
        value: function getChildAt(index) {
            if (index < 0 || index > this.children.length - 1) return null;
            return this.children[index];
        }
    }, {
        key: "getChildIndex",
        value: function getChildIndex(child) {
            return _.indexOf(this.children, child);
        }
    }, {
        key: "setChildIndex",
        value: function setChildIndex(child, index) {
            if (child.parent != this) return;
            var oldIndex = _.indexOf(this.children, child);
            if (index == oldIndex) return;
            this.children.splice(oldIndex, 1);
            this.children.splice(index, 0, child);
        }
    }, {
        key: "getNumChildren",
        value: function getNumChildren() {
            return this.children.length;
        }

        //获取x,y点上的所有object  num 需要返回的obj数量

    }, {
        key: "getObjectsUnderPoint",
        value: function getObjectsUnderPoint(point, num) {
            var result = [];

            for (var i = this.children.length - 1; i >= 0; i--) {
                var child = this.children[i];

                if (child == null || !child._eventEnabled && !child.dragEnabled || !child.context.$model.visible) {
                    continue;
                }
                if (child instanceof DisplayObjectContainer) {
                    //是集合
                    if (child.mouseChildren && child.getNumChildren() > 0) {
                        var objs = child.getObjectsUnderPoint(point);
                        if (objs.length > 0) {
                            result = result.concat(objs);
                        }
                    }
                } else {
                    //非集合，可以开始做getChildInPoint了
                    if (child.getChildInPoint(point)) {
                        result.push(child);
                        if (num != undefined && !isNaN(num)) {
                            if (result.length == num) {
                                return result;
                            }
                        }
                    }
                }
            }
            return result;
        }
    }]);
    return DisplayObjectContainer;
}(DisplayObject);

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * stage 类， 再as3中，stage则代表整个舞台。是唯一的根节点
 * 但是再canvax中，因为分层设计的需要。stage 舞台 同样代表一个canvas元素，但是不是再整个引擎设计
 * 里面， 不是唯一的根节点。而是会交由canvax类来统一管理其层级
 */
var Stage = function (_DisplayObjectContain) {
    inherits(Stage, _DisplayObjectContain);

    function Stage(opt) {
        classCallCheck(this, Stage);


        opt.type = "stage";

        var _this = possibleConstructorReturn(this, (Stage.__proto__ || Object.getPrototypeOf(Stage)).call(this, opt));

        _this.canvas = null;
        _this.ctx = null; //渲染的时候由renderer决定,这里不做初始值
        //stage正在渲染中
        _this.stageRending = false;
        _this._isReady = false;
        return _this;
    }

    createClass(Stage, [{
        key: "init",
        value: function init() {}

        //由canvax的afterAddChild 回调

    }, {
        key: "initStage",
        value: function initStage(canvas, width, height) {
            var self = this;
            self.canvas = canvas;
            var model = self.context;
            model.width = width;
            model.height = height;
            model.scaleX = Utils._devicePixelRatio;
            model.scaleY = Utils._devicePixelRatio;
            self._isReady = true;
        }
    }, {
        key: "heartBeat",
        value: function heartBeat(opt) {
            //shape , name , value , preValue 
            //displayList中某个属性改变了
            if (!this._isReady) {
                //在stage还没初始化完毕的情况下，无需做任何处理
                return;
            }
            opt || (opt = {}); //如果opt为空，说明就是无条件刷新
            opt.stage = this;

            //TODO临时先这么处理
            this.parent && this.parent.heartBeat(opt);
        }
    }]);
    return Stage;
}(DisplayObjectContainer);

var SystemRenderer = function () {
    function SystemRenderer() {
        var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : RENDERER_TYPE.UNKNOWN;
        var app = arguments[1];
        var options = arguments[2];
        classCallCheck(this, SystemRenderer);

        this.type = type; //2canvas,1webgl
        this.app = app;

        //prepare options
        if (options) {
            for (var i in settings.RENDER_OPTIONS) {
                if (typeof options[i] === 'undefined') {
                    options[i] = settings.RENDER_OPTIONS[i];
                }
            }
        } else {
            options = settings.RENDER_OPTIONS;
        }

        this.options = options;

        this.requestAid = null;

        this._heartBeat = false; //心跳，默认为false，即false的时候引擎处于静默状态 true则启动渲染

        this._preRenderTime = 0;
    }

    //如果引擎处于静默状态的话，就会启动


    createClass(SystemRenderer, [{
        key: 'startEnter',
        value: function startEnter() {
            var self = this;
            if (!self.requestAid) {
                self.requestAid = AnimationFrame.registFrame({
                    id: "enterFrame", //同时肯定只有一个enterFrame的task
                    task: function task() {
                        self.enterFrame.apply(self);
                    }
                });
            }
        }
    }, {
        key: 'enterFrame',
        value: function enterFrame() {
            var self = this;
            //不管怎么样，enterFrame执行了就要把
            //requestAid null 掉
            self.requestAid = null;
            Utils.now = new Date().getTime();
            if (self._heartBeat) {

                //var _begin = new Date().getTime();
                self.render(this.app);
                //var _end = new Date().getTime();
                //$(document.body).append( "<br />render："+ (_end - _begin) );

                self._heartBeat = false;
                //渲染完了，打上最新时间挫
                self._preRenderTime = new Date().getTime();
            }
        }
    }, {
        key: '_convertCanvax',
        value: function _convertCanvax(opt) {
            var me = this;
            _.each(me.app.children, function (stage) {
                stage.context[opt.name] = opt.value;
            });
        }
    }, {
        key: 'heartBeat',
        value: function heartBeat(opt) {
            //displayList中某个属性改变了
            var self = this;
            if (opt) {
                //心跳包有两种，一种是某元素的可视属性改变了。一种是children有变动
                //分别对应convertType  为 context  and children
                if (opt.convertType == "context") {
                    var stage = opt.stage;
                    var shape = opt.shape;
                    var name = opt.name;
                    var value = opt.value;
                    var preValue = opt.preValue;

                    if (shape.type == "canvax") {
                        self._convertCanvax(opt);
                    } else {
                        if (!self.app.convertStages[stage.id]) {
                            self.app.convertStages[stage.id] = {
                                stage: stage,
                                convertShapes: {}
                            };
                        }
                        if (shape) {
                            if (!self.app.convertStages[stage.id].convertShapes[shape.id]) {
                                self.app.convertStages[stage.id].convertShapes[shape.id] = {
                                    shape: shape,
                                    convertType: opt.convertType
                                };
                            } else {
                                //如果已经上报了该 shape 的心跳。
                                return;
                            }
                        }
                    }
                }

                if (opt.convertType == "children") {
                    //元素结构变化，比如addchild removeChild等
                    var target = opt.target;
                    var stage = opt.src.getStage();
                    if (stage || target.type == "stage") {
                        //如果操作的目标元素是Stage
                        stage = stage || target;
                        if (!self.app.convertStages[stage.id]) {
                            self.app.convertStages[stage.id] = {
                                stage: stage,
                                convertShapes: {}
                            };
                        }
                    }
                }

                if (!opt.convertType) {
                    //无条件要求刷新
                    var stage = opt.stage;
                    if (!self.app.convertStages[stage.id]) {
                        self.app.convertStages[stage.id] = {
                            stage: stage,
                            convertShapes: {}
                        };
                    }
                }
            } else {
                //无条件要求全部刷新，一般用在resize等。
                _.each(self.app.children, function (stage, i) {
                    self.app.convertStages[stage.id] = {
                        stage: stage,
                        convertShapes: {}
                    };
                });
            }
            if (!self._heartBeat) {
                //如果发现引擎在静默状态，那么就唤醒引擎
                self._heartBeat = true;
                self.startEnter();
            } else {
                //否则智慧继续确认心跳
                self._heartBeat = true;
            }
        }
    }]);
    return SystemRenderer;
}();

var CanvasGraphicsRenderer = function () {
    function CanvasGraphicsRenderer(renderer) {
        classCallCheck(this, CanvasGraphicsRenderer);

        this.renderer = renderer;
    }

    /**
    * @param displayObject
    * @stage 也可以displayObject.getStage()获取。
    */


    createClass(CanvasGraphicsRenderer, [{
        key: 'render',
        value: function render(displayObject, stage, globalAlpha) {
            var renderer = this.renderer;
            var graphicsData = displayObject.graphics.graphicsData;
            var ctx = stage.ctx;

            for (var i = 0; i < graphicsData.length; i++) {
                var data = graphicsData[i];
                var shape = data.shape;

                var fillStyle = data.fillStyle;
                var strokeStyle = data.strokeStyle;

                var fill = data.hasFill() && data.fillAlpha;
                var line = data.hasLine() && data.lineAlpha;

                ctx.lineWidth = data.lineWidth;

                if (data.type === SHAPES.POLY) {
                    ctx.beginPath();

                    this.renderPolygon(shape.points, shape.closed, ctx);

                    if (fill) {
                        ctx.globalAlpha = data.fillAlpha * globalAlpha;
                        ctx.fillStyle = fillStyle;
                        ctx.fill();
                    }
                    if (line) {
                        ctx.globalAlpha = data.lineAlpha * globalAlpha;
                        ctx.strokeStyle = strokeStyle;
                        ctx.stroke();
                    }
                } else if (data.type === SHAPES.RECT) {
                    if (fill) {
                        ctx.globalAlpha = data.fillAlpha * globalAlpha;
                        ctx.fillStyle = fillStyle;
                        ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
                    }
                    if (line) {
                        ctx.globalAlpha = data.lineAlpha * globalAlpha;
                        ctx.strokeStyle = strokeStyle;
                        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
                    }
                } else if (data.type === SHAPES.CIRC) {

                    // TODO - 这里应该可以不需要走graphics，而直接设置好radius
                    ctx.beginPath();
                    ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
                    ctx.closePath();

                    if (fill) {
                        ctx.globalAlpha = data.fillAlpha * globalAlpha;
                        ctx.fillStyle = fillStyle;
                        ctx.fill();
                    }
                    if (line) {
                        ctx.globalAlpha = data.lineAlpha * globalAlpha;
                        ctx.strokeStyle = strokeStyle;
                        ctx.stroke();
                    }
                } else if (data.type === SHAPES.ELIP) {
                    var w = shape.width * 2;
                    var h = shape.height * 2;

                    var x = shape.x - w / 2;
                    var y = shape.y - h / 2;

                    ctx.beginPath();

                    var kappa = 0.5522848;
                    var ox = w / 2 * kappa; // control point offset horizontal
                    var oy = h / 2 * kappa; // control point offset vertical
                    var xe = x + w; // x-end
                    var ye = y + h; // y-end
                    var xm = x + w / 2; // x-middle
                    var ym = y + h / 2; // y-middle

                    ctx.moveTo(x, ym);
                    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
                    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
                    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
                    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);

                    ctx.closePath();

                    if (fill) {
                        ctx.globalAlpha = data.fillAlpha * globalAlpha;
                        ctx.fillStyle = fillStyle;
                        ctx.fill();
                    }
                    if (line) {
                        ctx.globalAlpha = data.lineAlpha * globalAlpha;
                        ctx.strokeStyle = strokeStyle;
                        ctx.stroke();
                    }
                }
            }
        }
    }, {
        key: 'renderPolygon',
        value: function renderPolygon(points, close, ctx) {
            ctx.moveTo(points[0], points[1]);

            for (var j = 1; j < points.length / 2; ++j) {
                ctx.lineTo(points[j * 2], points[j * 2 + 1]);
            }

            if (close) {
                ctx.closePath();
            }
        }
    }]);
    return CanvasGraphicsRenderer;
}();

var CanvasRenderer = function (_SystemRenderer) {
    inherits(CanvasRenderer, _SystemRenderer);

    function CanvasRenderer(app) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        classCallCheck(this, CanvasRenderer);

        var _this = possibleConstructorReturn(this, (CanvasRenderer.__proto__ || Object.getPrototypeOf(CanvasRenderer)).call(this, RENDERER_TYPE.CANVAS, app, options));

        _this.CGR = new CanvasGraphicsRenderer(_this);
        return _this;
    }

    createClass(CanvasRenderer, [{
        key: 'render',
        value: function render(app) {
            var me = this;
            me.app = app;
            _.each(_.values(app.convertStages), function (convertStage) {
                me.renderStage(convertStage.stage);
            });
            app.convertStages = {};
        }
    }, {
        key: 'renderStage',
        value: function renderStage(stage) {
            if (!stage.ctx) {
                stage.ctx = stage.canvas.getContext("2d");
            }
            stage.stageRending = true;
            stage.setWorldTransform();
            this._clear(stage);
            this._render(stage);
            stage.stageRending = false;
        }
    }, {
        key: '_render',
        value: function _render(stage, displayObject, globalAlpha) {
            if (!displayObject) {
                displayObject = stage;
            }
            if (!globalAlpha) {
                globalAlpha = 1;
            }

            var $MC = displayObject.context.$model;

            if (!displayObject.worldTransform || displayObject._transformChange || displayObject.parent._transformChange) {
                displayObject.setWorldTransform();
                displayObject._transformChange = true;
            }

            globalAlpha *= $MC.globalAlpha;

            if (!$MC.visible || globalAlpha <= 0) {
                return;
            }

            //因为已经采用了setTransform了， 非shape元素已经不需要执行transform 和 render
            if (displayObject.graphics) {

                var ctx = stage.ctx;

                ctx.setTransform.apply(ctx, displayObject.worldTransform.toArray());

                //如果 graphicsData.length==0 的情况下才需要执行_draw来组织graphics数据
                if (!displayObject.graphics.graphicsData.length) {
                    //当渲染器开始渲染app的时候，app下面的所有displayObject都已经准备好了对应的世界矩阵
                    displayObject._draw(displayObject.graphics); //_draw会完成绘制准备好 graphicsData
                }

                this.CGR.render(displayObject, stage, globalAlpha);
            }

            if (displayObject.type == "text") {
                //如果是文本
                var ctx = stage.ctx;
                ctx.setTransform.apply(ctx, displayObject.worldTransform.toArray());
                displayObject.render(ctx);
            }

            if (displayObject.children) {
                for (var i = 0, len = displayObject.children.length; i < len; i++) {
                    this._render(stage, displayObject.children[i], globalAlpha);
                }
            }

            displayObject._transformChange = false;
        }
    }, {
        key: '_clear',
        value: function _clear(stage) {
            var ctx = stage.ctx;
            ctx.setTransform.apply(ctx, stage.worldTransform.toArray());
            ctx.clearRect(0, 0, this.app.width, this.app.height);
        }
    }]);
    return CanvasRenderer;
}(SystemRenderer);

//import WebGLRenderer from './webgl/WebGLRenderer';

function autoRenderer(app, options) {
    return new CanvasRenderer(app, options);
    /*
       if (app.webGL && utils.isWebGLSupported())
       {
           return new WebGLRenderer( app , options);
       };
       return new CanvasRenderer( app , options);
       */
}

/**
 * Application {{PKG_VERSION}}
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 主引擎 类
 *
 * 负责所有canvas的层级管理，和心跳机制的实现,捕获到心跳包后 
 * 分发到对应的stage(canvas)来绘制对应的改动
 * 然后 默认有实现了shape的 mouseover  mouseout  drag 事件
 *
 **/

//utils
var Application = function (_DisplayObjectContain) {
    inherits(Application, _DisplayObjectContain);

    function Application(opt) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        classCallCheck(this, Application);

        opt.type = "canvax";

        var _this = possibleConstructorReturn(this, (Application.__proto__ || Object.getPrototypeOf(Application)).call(this, opt));

        _this._cid = new Date().getTime() + "_" + Math.floor(Math.random() * 100);

        _this.el = $.query(opt.el);

        _this.width = parseInt("width" in opt || _this.el.offsetWidth, 10);
        _this.height = parseInt("height" in opt || _this.el.offsetHeight, 10);

        var viewObj = $.createView(_this.width, _this.height, _this._cid);
        _this.view = viewObj.view;
        _this.stageView = viewObj.stageView;
        _this.domView = viewObj.domView;

        _this.el.innerHTML = "";
        _this.el.appendChild(_this.view);

        _this.viewOffset = $.offset(_this.view);
        _this.lastGetRO = 0; //最后一次获取 viewOffset 的时间

        _this.webGL = opt.webGL;
        _this.renderer = autoRenderer(_this, options);

        _this.event = null;

        //是否阻止浏览器默认事件的执行
        _this.preventDefault = true;
        if (opt.preventDefault === false) {
            _this.preventDefault = false;
        }

        //该属性在systenRender里面操作，每帧由心跳上报的 需要重绘的stages 列表
        _this.convertStages = {};

        _this.context.$model.width = _this.width;
        _this.context.$model.height = _this.height;

        //然后创建一个用于绘制激活 shape 的 stage 到activation
        _this._bufferStage = null;
        _this._creatHoverStage();

        //创建一个如果要用像素检测的时候的容器
        _this._createPixelContext();

        //设置一个默认的matrix做为app的世界根节点坐标
        _this.worldTransform = new Matrix().identity();
        return _this;
    }

    createClass(Application, [{
        key: "registEvent",
        value: function registEvent(opt) {
            //初始化事件委托到root元素上面
            this.event = new EventHandler(this, opt);
            this.event.init();
            return this.event;
        }
    }, {
        key: "resize",
        value: function resize(opt) {
            //重新设置坐标系统 高宽 等。
            this.width = parseInt(opt && "width" in opt || this.el.offsetWidth, 10);
            this.height = parseInt(opt && "height" in opt || this.el.offsetHeight, 10);

            this.view.style.width = this.width + "px";
            this.view.style.height = this.height + "px";

            this.viewOffset = $.offset(this.view);
            this.context.$model.width = this.width;
            this.context.$model.height = this.height;

            var me = this;
            var reSizeCanvas = function reSizeCanvas(ctx) {
                var canvas = ctx.canvas;
                canvas.style.width = me.width + "px";
                canvas.style.height = me.height + "px";
                canvas.setAttribute("width", me.width * Utils._devicePixelRatio);
                canvas.setAttribute("height", me.height * Utils._devicePixelRatio);

                //如果是swf的话就还要调用这个方法。
                if (ctx.resize) {
                    ctx.resize(me.width, me.height);
                }
            };
            _.each(this.children, function (s, i) {
                s.context.$model.width = me.width;
                s.context.$model.height = me.height;
                reSizeCanvas(s.canvas);
            });

            this.domView.style.width = this.width + "px";
            this.domView.style.height = this.height + "px";

            this.heartBeat();
        }
    }, {
        key: "getHoverStage",
        value: function getHoverStage() {
            return this._bufferStage;
        }
    }, {
        key: "_creatHoverStage",
        value: function _creatHoverStage() {
            //TODO:创建stage的时候一定要传入width height  两个参数
            this._bufferStage = new Stage({
                id: "activCanvas" + new Date().getTime(),
                context: {
                    width: this.context.$model.width,
                    height: this.context.$model.height
                }
            });
            //该stage不参与事件检测
            this._bufferStage._eventEnabled = false;
            this.addChild(this._bufferStage);
        }

        /**
         * 用来检测文本width height 
         * @return {Object} 上下文
        */

    }, {
        key: "_createPixelContext",
        value: function _createPixelContext() {
            var _pixelCanvas = $.query("_pixelCanvas");
            if (!_pixelCanvas) {
                _pixelCanvas = $.createCanvas(0, 0, "_pixelCanvas");
            } else {
                //如果又的话 就不需要在创建了
                return;
            }
            document.body.appendChild(_pixelCanvas);
            Utils.initElement(_pixelCanvas);
            if (Utils.canvasSupport()) {
                //canvas的话，哪怕是display:none的页可以用来左像素检测和measureText文本width检测
                _pixelCanvas.style.display = "none";
            } else {
                //flashCanvas 的话，swf如果display:none了。就做不了measureText 文本宽度 检测了
                _pixelCanvas.style.zIndex = -1;
                _pixelCanvas.style.position = "absolute";
                _pixelCanvas.style.left = -this.context.$model.width + "px";
                _pixelCanvas.style.top = -this.context.$model.height + "px";
                _pixelCanvas.style.visibility = "hidden";
            }
            Utils._pixelCtx = _pixelCanvas.getContext('2d');
        }
    }, {
        key: "updateViewOffset",
        value: function updateViewOffset() {
            var now = new Date().getTime();
            if (now - this.lastGetRO > 1000) {
                this.viewOffset = $.offset(this.view);
                this.lastGetRO = now;
            }
        }
    }, {
        key: "_afterAddChild",
        value: function _afterAddChild(stage, index) {
            var canvas;

            if (!stage.canvas) {
                canvas = $.createCanvas(this.context.$model.width, this.context.$model.height, stage.id);
            } else {
                canvas = stage.canvas;
            }

            if (this.children.length == 1) {
                this.stageView.appendChild(canvas);
            } else if (this.children.length > 1) {
                if (index === undefined) {
                    //如果没有指定位置，那么就放到 _bufferStage 的下面。
                    this.stageView.insertBefore(canvas, this._bufferStage.canvas);
                } else {
                    //如果有指定的位置，那么就指定的位置来
                    if (index >= this.children.length - 1) {
                        this.stageView.appendChild(canvas);
                    } else {
                        this.stageView.insertBefore(canvas, this.children[index].canvas);
                    }
                }
            }

            Utils.initElement(canvas);
            stage.initStage(canvas, this.context.$model.width, this.context.$model.height);
        }
    }, {
        key: "_afterDelChild",
        value: function _afterDelChild(stage) {
            this.stageView.removeChild(stage.canvas);
        }
    }, {
        key: "heartBeat",
        value: function heartBeat(opt) {
            if (this.children.length > 0) {
                this.renderer.heartBeat(opt);
            }
        }
    }, {
        key: "toDataURL",
        value: function toDataURL() {
            var canvas = Base._createCanvas("curr_base64_canvas", this.width, this.height);
            var ctx = canvas.getContext("2d");

            _.each(this.children, function (stage) {
                ctx.drawImage(stage.canvas, 0, 0);
            });

            return canvas.toDataURL();
        }
    }]);
    return Application;
}(DisplayObjectContainer);

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 模拟as3 中 的sprite类，目前还只是个简单的容易。
 */
var Sprite = function (_DisplayObjectContain) {
  inherits(Sprite, _DisplayObjectContain);

  function Sprite(opt) {
    classCallCheck(this, Sprite);

    opt = Utils.checkOpt(opt);
    opt.type = "sprite";
    return possibleConstructorReturn(this, (Sprite.__proto__ || Object.getPrototypeOf(Sprite)).call(this, opt));
  }

  return Sprite;
}(DisplayObjectContainer);

var GraphicsData = function () {
    function GraphicsData(lineWidth, strokeStyle, lineAlpha, fillStyle, fillAlpha, shape) {
        classCallCheck(this, GraphicsData);

        this.lineWidth = lineWidth;
        this.strokeStyle = strokeStyle;
        this.lineAlpha = lineAlpha;

        this.fillStyle = fillStyle;
        this.fillAlpha = fillAlpha;

        this.shape = shape;
        this.type = shape.type;

        this.holes = [];

        //这两个可以被后续修改， 具有一票否决权
        //比如polygon的 虚线描边。必须在fill的poly上面设置line为false
        this.fill = true;
        this.line = true;
    }

    createClass(GraphicsData, [{
        key: "clone",
        value: function clone() {
            var cloneGraphicsData = new GraphicsData(this.lineWidth, this.strokeStyle, this.lineAlpha, this.fillStyle, this.fillAlpha, this.shape);
            cloneGraphicsData.fill = this.fill;
            cloneGraphicsData.line = this.line;
            return cloneGraphicsData;
        }
    }, {
        key: "addHole",
        value: function addHole(shape) {
            this.holes.push(shape);
        }

        //从宿主graphics中同步最新的style属性

    }, {
        key: "synsStyle",
        value: function synsStyle(style) {
            //console.log("line:"+this.line+"__fill:"+this.fill)
            //从shape中把绘图需要的style属性同步过来
            if (this.line) {
                this.lineWidth = style.lineWidth;
                this.strokeStyle = style.strokeStyle;
                this.lineAlpha = style.lineAlpha;
            }

            if (this.fill) {
                this.fillStyle = style.fillStyle;
                this.fillAlpha = style.fillAlpha;
            }
        }
    }, {
        key: "hasFill",
        value: function hasFill() {
            return this.fillStyle && this.fill && this.shape.closed !== undefined && this.shape.closed;
        }
    }, {
        key: "hasLine",
        value: function hasLine() {
            return this.strokeStyle && this.lineWidth && this.line;
        }
    }, {
        key: "destroy",
        value: function destroy() {
            this.shape = null;
            this.holes = null;
        }
    }]);
    return GraphicsData;
}();

var arcToSegmentsCache = {};
var segmentToBezierCache = {};
var boundsOfCurveCache = {};
var _join = Array.prototype.join;

/* Adapted from http://dxr.mozilla.org/mozilla-central/source/content/svg/content/src/nsSVGPathDataParser.cpp
 * by Andrea Bogazzi code is under MPL. if you don't have a copy of the license you can take it here
 * http://mozilla.org/MPL/2.0/
 */
function arcToSegments(toX, toY, rx, ry, large, sweep, rotateX) {
  var argsString = _join.call(arguments);
  if (arcToSegmentsCache[argsString]) {
    return arcToSegmentsCache[argsString];
  }

  var PI = Math.PI,
      th = rotateX * PI / 180,
      sinTh = Math.sin(th),
      cosTh = Math.cos(th),
      fromX = 0,
      fromY = 0;

  rx = Math.abs(rx);
  ry = Math.abs(ry);

  var px = -cosTh * toX * 0.5 - sinTh * toY * 0.5,
      py = -cosTh * toY * 0.5 + sinTh * toX * 0.5,
      rx2 = rx * rx,
      ry2 = ry * ry,
      py2 = py * py,
      px2 = px * px,
      pl = rx2 * ry2 - rx2 * py2 - ry2 * px2,
      root = 0;

  if (pl < 0) {
    var s = Math.sqrt(1 - pl / (rx2 * ry2));
    rx *= s;
    ry *= s;
  } else {
    root = (large === sweep ? -1.0 : 1.0) * Math.sqrt(pl / (rx2 * py2 + ry2 * px2));
  }

  var cx = root * rx * py / ry,
      cy = -root * ry * px / rx,
      cx1 = cosTh * cx - sinTh * cy + toX * 0.5,
      cy1 = sinTh * cx + cosTh * cy + toY * 0.5,
      mTheta = calcVectorAngle(1, 0, (px - cx) / rx, (py - cy) / ry),
      dtheta = calcVectorAngle((px - cx) / rx, (py - cy) / ry, (-px - cx) / rx, (-py - cy) / ry);

  if (sweep === 0 && dtheta > 0) {
    dtheta -= 2 * PI;
  } else if (sweep === 1 && dtheta < 0) {
    dtheta += 2 * PI;
  }

  // Convert into cubic bezier segments <= 90deg
  var segments = Math.ceil(Math.abs(dtheta / PI * 2)),
      result = [],
      mDelta = dtheta / segments,
      mT = 8 / 3 * Math.sin(mDelta / 4) * Math.sin(mDelta / 4) / Math.sin(mDelta / 2),
      th3 = mTheta + mDelta;

  for (var i = 0; i < segments; i++) {
    result[i] = segmentToBezier(mTheta, th3, cosTh, sinTh, rx, ry, cx1, cy1, mT, fromX, fromY);
    fromX = result[i][4];
    fromY = result[i][5];
    mTheta = th3;
    th3 += mDelta;
  }
  arcToSegmentsCache[argsString] = result;
  return result;
}

function segmentToBezier(th2, th3, cosTh, sinTh, rx, ry, cx1, cy1, mT, fromX, fromY) {
  var argsString2 = _join.call(arguments);
  if (segmentToBezierCache[argsString2]) {
    return segmentToBezierCache[argsString2];
  }

  var costh2 = Math.cos(th2),
      sinth2 = Math.sin(th2),
      costh3 = Math.cos(th3),
      sinth3 = Math.sin(th3),
      toX = cosTh * rx * costh3 - sinTh * ry * sinth3 + cx1,
      toY = sinTh * rx * costh3 + cosTh * ry * sinth3 + cy1,
      cp1X = fromX + mT * (-cosTh * rx * sinth2 - sinTh * ry * costh2),
      cp1Y = fromY + mT * (-sinTh * rx * sinth2 + cosTh * ry * costh2),
      cp2X = toX + mT * (cosTh * rx * sinth3 + sinTh * ry * costh3),
      cp2Y = toY + mT * (sinTh * rx * sinth3 - cosTh * ry * costh3);

  segmentToBezierCache[argsString2] = [cp1X, cp1Y, cp2X, cp2Y, toX, toY];
  return segmentToBezierCache[argsString2];
}

/*
 * Private
 */
function calcVectorAngle(ux, uy, vx, vy) {
  var ta = Math.atan2(uy, ux),
      tb = Math.atan2(vy, vx);
  if (tb >= ta) {
    return tb - ta;
  } else {
    return 2 * Math.PI - (ta - tb);
  }
}

/**
 * Draws arc
 * @param {graphics} graphics
 * @param {Number} fx
 * @param {Number} fy
 * @param {Array} coords
 */
var drawArc = function drawArc(graphics, fx, fy, coords) {
  var rx = coords[0],
      ry = coords[1],
      rot = coords[2],
      large = coords[3],
      sweep = coords[4],
      tx = coords[5],
      ty = coords[6],
      segs = [[], [], [], []],
      segsNorm = arcToSegments(tx - fx, ty - fy, rx, ry, large, sweep, rot);

  for (var i = 0, len = segsNorm.length; i < len; i++) {
    segs[i][0] = segsNorm[i][0] + fx;
    segs[i][1] = segsNorm[i][1] + fy;
    segs[i][2] = segsNorm[i][2] + fx;
    segs[i][3] = segsNorm[i][3] + fy;
    segs[i][4] = segsNorm[i][4] + fx;
    segs[i][5] = segsNorm[i][5] + fy;
    graphics.bezierCurveTo.apply(graphics, segs[i]);
  }
};

/**
 * Calculate bounding box of a elliptic-arc
 * @param {Number} fx start point of arc
 * @param {Number} fy
 * @param {Number} rx horizontal radius
 * @param {Number} ry vertical radius
 * @param {Number} rot angle of horizontal axe
 * @param {Number} large 1 or 0, whatever the arc is the big or the small on the 2 points
 * @param {Number} sweep 1 or 0, 1 clockwise or counterclockwise direction
 * @param {Number} tx end point of arc
 * @param {Number} ty
 */
var getBoundsOfArc = function getBoundsOfArc(fx, fy, rx, ry, rot, large, sweep, tx, ty) {

  var fromX = 0,
      fromY = 0,
      bound,
      bounds = [],
      segs = arcToSegments(tx - fx, ty - fy, rx, ry, large, sweep, rot);

  for (var i = 0, len = segs.length; i < len; i++) {
    bound = getBoundsOfCurve(fromX, fromY, segs[i][0], segs[i][1], segs[i][2], segs[i][3], segs[i][4], segs[i][5]);
    bounds.push({ x: bound[0].x + fx, y: bound[0].y + fy });
    bounds.push({ x: bound[1].x + fx, y: bound[1].y + fy });
    fromX = segs[i][4];
    fromY = segs[i][5];
  }
  return bounds;
};

/**
 * Calculate bounding box of a beziercurve
 * @param {Number} x0 starting point
 * @param {Number} y0
 * @param {Number} x1 first control point
 * @param {Number} y1
 * @param {Number} x2 secondo control point
 * @param {Number} y2
 * @param {Number} x3 end of beizer
 * @param {Number} y3
 */
// taken from http://jsbin.com/ivomiq/56/edit  no credits available for that.
function getBoundsOfCurve(x0, y0, x1, y1, x2, y2, x3, y3) {
  var argsString = _join.call(arguments);
  if (boundsOfCurveCache[argsString]) {
    return boundsOfCurveCache[argsString];
  }

  var sqrt = Math.sqrt,
      min = Math.min,
      max = Math.max,
      abs = Math.abs,
      tvalues = [],
      bounds = [[], []],
      a,
      b,
      c,
      t,
      t1,
      t2,
      b2ac,
      sqrtb2ac;

  b = 6 * x0 - 12 * x1 + 6 * x2;
  a = -3 * x0 + 9 * x1 - 9 * x2 + 3 * x3;
  c = 3 * x1 - 3 * x0;

  for (var i = 0; i < 2; ++i) {
    if (i > 0) {
      b = 6 * y0 - 12 * y1 + 6 * y2;
      a = -3 * y0 + 9 * y1 - 9 * y2 + 3 * y3;
      c = 3 * y1 - 3 * y0;
    }

    if (abs(a) < 1e-12) {
      if (abs(b) < 1e-12) {
        continue;
      }
      t = -c / b;
      if (0 < t && t < 1) {
        tvalues.push(t);
      }
      continue;
    }
    b2ac = b * b - 4 * c * a;
    if (b2ac < 0) {
      continue;
    }
    sqrtb2ac = sqrt(b2ac);
    t1 = (-b + sqrtb2ac) / (2 * a);
    if (0 < t1 && t1 < 1) {
      tvalues.push(t1);
    }
    t2 = (-b - sqrtb2ac) / (2 * a);
    if (0 < t2 && t2 < 1) {
      tvalues.push(t2);
    }
  }

  var x,
      y,
      j = tvalues.length,
      jlen = j,
      mt;
  while (j--) {
    t = tvalues[j];
    mt = 1 - t;
    x = mt * mt * mt * x0 + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * x3;
    bounds[0][j] = x;

    y = mt * mt * mt * y0 + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * y3;
    bounds[1][j] = y;
  }

  bounds[0][jlen] = x0;
  bounds[1][jlen] = y0;
  bounds[0][jlen + 1] = x3;
  bounds[1][jlen + 1] = y3;
  var result = [{
    x: min.apply(null, bounds[0]),
    y: min.apply(null, bounds[1])
  }, {
    x: max.apply(null, bounds[0]),
    y: max.apply(null, bounds[1])
  }];
  boundsOfCurveCache[argsString] = result;
  return result;
}

var Arc = {
  drawArc: drawArc,
  getBoundsOfCurve: getBoundsOfCurve,
  getBoundsOfArc: getBoundsOfArc
};

var Rectangle = function () {
    function Rectangle() {
        var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        classCallCheck(this, Rectangle);

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = SHAPES.RECT;
        this.closed = true;
    }

    createClass(Rectangle, [{
        key: 'clone',
        value: function clone() {
            return new Rectangle(this.x, this.y, this.width, this.height);
        }
    }, {
        key: 'copy',
        value: function copy(rectangle) {
            this.x = rectangle.x;
            this.y = rectangle.y;
            this.width = rectangle.width;
            this.height = rectangle.height;

            return this;
        }
    }, {
        key: 'contains',
        value: function contains(x, y) {
            if (this.width <= 0 || this.height <= 0) {
                return false;
            }

            if (x >= this.x && x < this.x + this.width) {
                if (y >= this.y && y < this.y + this.height) {
                    return true;
                }
            }

            return false;
        }
    }]);
    return Rectangle;
}();

var Circle = function () {
    function Circle() {
        var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var radius = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        classCallCheck(this, Circle);

        this.x = x;

        this.y = y;

        this.radius = radius;

        this.type = SHAPES.CIRC;

        this.closed = true;
    }

    createClass(Circle, [{
        key: 'clone',
        value: function clone() {
            return new Circle(this.x, this.y, this.radius);
        }
    }, {
        key: 'contains',
        value: function contains(x, y) {
            if (this.radius <= 0) {
                return false;
            }

            var r2 = this.radius * this.radius;
            var dx = this.x - x;
            var dy = this.y - y;

            dx *= dx;
            dy *= dy;

            return dx + dy <= r2;
        }
    }, {
        key: 'getBounds',
        value: function getBounds() {
            return new Rectangle(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
        }
    }]);
    return Circle;
}();

var Ellipse = function () {
    function Ellipse() {
        var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        classCallCheck(this, Ellipse);

        this.x = x;

        this.y = y;

        this.width = width;

        this.height = height;

        this.type = SHAPES.ELIP;

        this.closed = true;
    }

    createClass(Ellipse, [{
        key: 'clone',
        value: function clone() {
            return new Ellipse(this.x, this.y, this.width, this.height);
        }
    }, {
        key: 'contains',
        value: function contains(x, y) {
            if (this.width <= 0 || this.height <= 0) {
                return false;
            }

            var normx = (x - this.x) / this.width;
            var normy = (y - this.y) / this.height;

            normx *= normx;
            normy *= normy;

            return normx + normy <= 1;
        }
    }, {
        key: 'getBounds',
        value: function getBounds() {
            return new Rectangle(this.x - this.width, this.y - this.height, this.width, this.height);
        }
    }]);
    return Ellipse;
}();

var Polygon = function () {
    function Polygon() {
        for (var _len = arguments.length, points = Array(_len), _key = 0; _key < _len; _key++) {
            points[_key] = arguments[_key];
        }

        classCallCheck(this, Polygon);

        var point_0 = points[0];
        if (Array.isArray(point_0)) {
            points = point_0;
        }

        if (point_0 && "x" in point_0 && "y" in point_0) {
            var p = [];

            for (var i = 0, il = points.length; i < il; i++) {
                p.push(points[i].x, points[i].y);
            }

            points = p;
        }

        this.closed = true;

        this.points = points;

        this.type = SHAPES.POLY;
    }

    createClass(Polygon, [{
        key: "clone",
        value: function clone() {
            return new Polygon(this.points.slice());
        }
    }, {
        key: "close",
        value: function close() {
            var points = this.points;
            if (points[0] !== points[points.length - 2] || points[1] !== points[points.length - 1]) {
                points.push(points[0], points[1]);
            }
            this.closed = true;
        }
    }, {
        key: "contains",
        value: function contains(x, y) {
            return this._isInsidePolygon_WindingNumber(x, y);
        }

        /**
         * 多边形包含判断 Nonzero Winding Number Rule
         */

    }, {
        key: "_isInsidePolygon_WindingNumber",
        value: function _isInsidePolygon_WindingNumber(x, y) {
            var points = this.points;
            var wn = 0;
            for (var shiftP, shift = points[1] > y, i = 3; i < points.length; i += 2) {
                shiftP = shift;
                shift = points[i] > y;
                if (shiftP != shift) {
                    var n = (shiftP ? 1 : 0) - (shift ? 1 : 0);
                    if (n * ((points[i - 3] - x) * (points[i - 0] - y) - (points[i - 2] - y) * (points[i - 1] - x)) > 0) {
                        wn += n;
                    }
                }
            }
            return wn;
        }
    }]);
    return Polygon;
}();

function bezierCurveTo(fromX, fromY, cpX, cpY, cpX2, cpY2, toX, toY) {
    var path = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : [];

    var n = 20;
    var dt = 0;
    var dt2 = 0;
    var dt3 = 0;
    var t2 = 0;
    var t3 = 0;

    path.push(fromX, fromY);

    for (var i = 1, j = 0; i <= n; ++i) {
        j = i / n;

        dt = 1 - j;
        dt2 = dt * dt;
        dt3 = dt2 * dt;

        t2 = j * j;
        t3 = t2 * j;

        path.push(dt3 * fromX + 3 * dt2 * j * cpX + 3 * dt * t2 * cpX2 + t3 * toX, dt3 * fromY + 3 * dt2 * j * cpY + 3 * dt * t2 * cpY2 + t3 * toY);
    }

    return path;
}

/*
* Graphics绘图法则
* 单个grahics实例里的fill line 样式属性，都从对应shape.context 中获取
* 
*/

var Graphics = function () {
    function Graphics(shape) {
        classCallCheck(this, Graphics);

        this.lineWidth = 1;
        this.strokeStyle = null;
        this.lineAlpha = 1;
        this.fillStyle = null;
        this.fillAlpha = 1;

        //比如path m 0 0 l 0 0 m 1 1 l 1 1
        //就会有两条graphicsData数据产生
        this.graphicsData = [];
        this.currentPath = null;

        this.dirty = 0; //用于检测图形对象是否已更改。 如果这是设置为true，那么图形对象将被重新计算。
        this.clearDirty = 0; //用于检测我们是否清除了图形webGL数据

        this._webGL = {};
        this.worldAlpha = 1;
        this.tint = 0xFFFFFF; //目标对象附加颜色

        this.Bound = {
            x: 0, y: 0, width: 0, height: 0
        };
    }

    createClass(Graphics, [{
        key: 'setStyle',
        value: function setStyle(context) {
            //从 shape 中把绘图需要的style属性同步过来
            var model = context.$model;
            this.lineWidth = model.lineWidth;
            this.strokeStyle = model.strokeStyle;
            this.lineAlpha = model.lineAlpha * model.globalAlpha;

            this.fillStyle = model.fillStyle;
            this.fillAlpha = model.fillAlpha * model.globalAlpha;

            var g = this;

            //一般都是先设置好style的，所以 ， 当后面再次设置新的style的时候
            //会把所有的data都修改
            //TODO: 后面需要修改, 能精准的确定是修改 graphicsData 中的哪个data
            if (this.graphicsData.length) {
                _.each(this.graphicsData, function (gd, i) {
                    gd.synsStyle(g);
                });
            }
        }
    }, {
        key: 'clone',
        value: function clone() {

            var clone = new Graphics();

            clone.dirty = 0;

            // copy graphics data
            for (var i = 0; i < this.graphicsData.length; ++i) {
                clone.graphicsData.push(this.graphicsData[i].clone());
            }

            clone.currentPath = clone.graphicsData[clone.graphicsData.length - 1];
            return clone;
        }
    }, {
        key: 'moveTo',
        value: function moveTo(x, y) {
            var shape = new Polygon([x, y]);

            shape.closed = false;
            this.drawShape(shape);

            return this;
        }
    }, {
        key: 'lineTo',
        value: function lineTo(x, y) {
            if (this.currentPath) {
                this.currentPath.shape.points.push(x, y);
                this.dirty++;
            } else {
                this.moveTo(0, 0);
            }
            return this;
        }
    }, {
        key: 'quadraticCurveTo',
        value: function quadraticCurveTo(cpX, cpY, toX, toY) {
            if (this.currentPath) {
                if (this.currentPath.shape.points.length === 0) {
                    this.currentPath.shape.points = [0, 0];
                }
            } else {
                this.moveTo(0, 0);
            }

            var n = 20;
            var points = this.currentPath.shape.points;
            var xa = 0;
            var ya = 0;

            if (points.length === 0) {
                this.moveTo(0, 0);
            }

            var fromX = points[points.length - 2];
            var fromY = points[points.length - 1];

            for (var i = 1; i <= n; ++i) {
                var j = i / n;

                xa = fromX + (cpX - fromX) * j;
                ya = fromY + (cpY - fromY) * j;

                points.push(xa + (cpX + (toX - cpX) * j - xa) * j, ya + (cpY + (toY - cpY) * j - ya) * j);
            }

            this.dirty++;

            return this;
        }
    }, {
        key: 'bezierCurveTo',
        value: function bezierCurveTo$$1(cpX, cpY, cpX2, cpY2, toX, toY) {
            if (this.currentPath) {
                if (this.currentPath.shape.points.length === 0) {
                    this.currentPath.shape.points = [0, 0];
                }
            } else {
                this.moveTo(0, 0);
            }

            var points = this.currentPath.shape.points;

            var fromX = points[points.length - 2];
            var fromY = points[points.length - 1];

            points.length -= 2;

            bezierCurveTo(fromX, fromY, cpX, cpY, cpX2, cpY2, toX, toY, points);

            this.dirty++;

            return this;
        }
    }, {
        key: 'arcTo',
        value: function arcTo(x1, y1, x2, y2, radius) {
            if (this.currentPath) {
                if (this.currentPath.shape.points.length === 0) {
                    this.currentPath.shape.points.push(x1, y1);
                }
            } else {
                this.moveTo(x1, y1);
            }

            var points = this.currentPath.shape.points;
            var fromX = points[points.length - 2];
            var fromY = points[points.length - 1];
            var a1 = fromY - y1;
            var b1 = fromX - x1;
            var a2 = y2 - y1;
            var b2 = x2 - x1;
            var mm = Math.abs(a1 * b2 - b1 * a2);

            if (mm < 1.0e-8 || radius === 0) {
                if (points[points.length - 2] !== x1 || points[points.length - 1] !== y1) {
                    points.push(x1, y1);
                }
            } else {
                var dd = a1 * a1 + b1 * b1;
                var cc = a2 * a2 + b2 * b2;
                var tt = a1 * a2 + b1 * b2;
                var k1 = radius * Math.sqrt(dd) / mm;
                var k2 = radius * Math.sqrt(cc) / mm;
                var j1 = k1 * tt / dd;
                var j2 = k2 * tt / cc;
                var cx = k1 * b2 + k2 * b1;
                var cy = k1 * a2 + k2 * a1;
                var px = b1 * (k2 + j1);
                var py = a1 * (k2 + j1);
                var qx = b2 * (k1 + j2);
                var qy = a2 * (k1 + j2);
                var startAngle = Math.atan2(py - cy, px - cx);
                var endAngle = Math.atan2(qy - cy, qx - cx);

                this.arc(cx + x1, cy + y1, radius, startAngle, endAngle, b1 * a2 > b2 * a1);
            }

            this.dirty++;

            return this;
        }
    }, {
        key: 'arc',
        value: function arc(cx, cy, radius, startAngle, endAngle) {
            var anticlockwise = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

            if (startAngle === endAngle) {
                return this;
            }

            if (!anticlockwise && endAngle <= startAngle) {
                endAngle += Math.PI * 2;
            } else if (anticlockwise && startAngle <= endAngle) {
                startAngle += Math.PI * 2;
            }

            var sweep = endAngle - startAngle;
            var segs = Math.ceil(Math.abs(sweep) / (Math.PI * 2)) * 48;

            if (sweep === 0) {
                return this;
            }

            var startX = cx + Math.cos(startAngle) * radius;
            var startY = cy + Math.sin(startAngle) * radius;

            // If the currentPath exists, take its points. Otherwise call `moveTo` to start a path.
            var points = this.currentPath ? this.currentPath.shape.points : null;

            if (points) {
                if (points[points.length - 2] !== startX || points[points.length - 1] !== startY) {
                    points.push(startX, startY);
                }
            } else {
                this.moveTo(startX, startY);
                points = this.currentPath.shape.points;
            }

            var theta = sweep / (segs * 2);
            var theta2 = theta * 2;

            var cTheta = Math.cos(theta);
            var sTheta = Math.sin(theta);

            var segMinus = segs - 1;

            var remainder = segMinus % 1 / segMinus;

            for (var i = 0; i <= segMinus; ++i) {
                var real = i + remainder * i;

                var angle = theta + startAngle + theta2 * real;

                var c = Math.cos(angle);
                var s = -Math.sin(angle);

                points.push((cTheta * c + sTheta * s) * radius + cx, (cTheta * -s + sTheta * c) * radius + cy);
            }

            this.dirty++;

            return this;
        }
    }, {
        key: 'drawRect',
        value: function drawRect(x, y, width, height) {
            this.drawShape(new Rectangle(x, y, width, height));
            return this;
        }
    }, {
        key: 'drawCircle',
        value: function drawCircle(x, y, radius) {
            this.drawShape(new Circle(x, y, radius));

            return this;
        }
    }, {
        key: 'drawEllipse',
        value: function drawEllipse(x, y, width, height) {
            this.drawShape(new Ellipse(x, y, width, height));

            return this;
        }
    }, {
        key: 'drawPolygon',
        value: function drawPolygon(path) {
            // prevents an argument assignment deopt
            // see section 3.1: https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
            var points = path;

            var closed = true;

            if (points instanceof Polygon) {
                closed = points.closed;
                points = points.points;
            }

            if (!Array.isArray(points)) {
                // prevents an argument leak deopt
                // see section 3.2: https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
                points = new Array(arguments.length);

                for (var i = 0; i < points.length; ++i) {
                    points[i] = arguments[i]; // eslint-disable-line prefer-rest-params
                }
            }

            var shape = new Polygon(points);

            shape.closed = closed;

            this.drawShape(shape);

            return this;
        }
    }, {
        key: 'clear',
        value: function clear() {
            if (this.graphicsData.length > 0) {
                this.dirty++;
                this.clearDirty++;
                this.graphicsData.length = 0;
            }

            this.currentPath = null;

            return this;
        }
    }, {
        key: 'drawShape',
        value: function drawShape(shape) {
            if (this.currentPath) {
                if (this.currentPath.shape.points.length <= 2) {
                    this.graphicsData.pop();
                }
            }

            this.currentPath = null;

            var data = new GraphicsData(this.lineWidth, this.strokeStyle, this.lineAlpha, this.fillStyle, this.fillAlpha, shape);

            this.graphicsData.push(data);

            if (data.type === SHAPES.POLY) {
                data.shape.closed = data.shape.closed;
                this.currentPath = data;
            }

            this.dirty++;

            return data;
        }
    }, {
        key: 'beginPath',
        value: function beginPath() {
            this.currentPath = null;
        }
    }, {
        key: 'closePath',
        value: function closePath() {
            var currentPath = this.currentPath;

            if (currentPath && currentPath.shape) {
                currentPath.shape.close();
            }

            return this;
        }

        /**
        * Update the bounds of the object
        *
        */

    }, {
        key: 'updateLocalBounds',
        value: function updateLocalBounds() {
            var minX = Infinity;
            var maxX = -Infinity;

            var minY = Infinity;
            var maxY = -Infinity;

            if (this.graphicsData.length) {
                var shape = 0;
                var x = 0;
                var y = 0;
                var w = 0;
                var h = 0;

                for (var i = 0; i < this.graphicsData.length; i++) {
                    var data = this.graphicsData[i];
                    var type = data.type;
                    var lineWidth = data.lineWidth;

                    shape = data.shape;

                    if (type === SHAPES.RECT || type === SHAPES.RREC) {
                        x = shape.x - lineWidth / 2;
                        y = shape.y - lineWidth / 2;
                        w = shape.width + lineWidth;
                        h = shape.height + lineWidth;

                        minX = x < minX ? x : minX;
                        maxX = x + w > maxX ? x + w : maxX;

                        minY = y < minY ? y : minY;
                        maxY = y + h > maxY ? y + h : maxY;
                    } else if (type === SHAPES.CIRC) {
                        x = shape.x;
                        y = shape.y;
                        w = shape.radius + lineWidth / 2;
                        h = shape.radius + lineWidth / 2;

                        minX = x - w < minX ? x - w : minX;
                        maxX = x + w > maxX ? x + w : maxX;

                        minY = y - h < minY ? y - h : minY;
                        maxY = y + h > maxY ? y + h : maxY;
                    } else if (type === SHAPES.ELIP) {
                        x = shape.x;
                        y = shape.y;
                        w = shape.width + lineWidth / 2;
                        h = shape.height + lineWidth / 2;

                        minX = x - w < minX ? x - w : minX;
                        maxX = x + w > maxX ? x + w : maxX;

                        minY = y - h < minY ? y - h : minY;
                        maxY = y + h > maxY ? y + h : maxY;
                    } else {
                        // POLY
                        var points = shape.points;
                        var x2 = 0;
                        var y2 = 0;
                        var dx = 0;
                        var dy = 0;
                        var rw = 0;
                        var rh = 0;
                        var cx = 0;
                        var cy = 0;

                        for (var j = 0; j + 2 < points.length; j += 2) {
                            x = points[j];
                            y = points[j + 1];
                            x2 = points[j + 2];
                            y2 = points[j + 3];
                            dx = Math.abs(x2 - x);
                            dy = Math.abs(y2 - y);
                            h = lineWidth;
                            w = Math.sqrt(dx * dx + dy * dy);

                            if (w < 1e-9) {
                                continue;
                            }

                            rw = (h / w * dy + dx) / 2;
                            rh = (h / w * dx + dy) / 2;
                            cx = (x2 + x) / 2;
                            cy = (y2 + y) / 2;

                            minX = cx - rw < minX ? cx - rw : minX;
                            maxX = cx + rw > maxX ? cx + rw : maxX;

                            minY = cy - rh < minY ? cy - rh : minY;
                            maxY = cy + rh > maxY ? cy + rh : maxY;
                        }
                    }
                }
            } else {
                minX = 0;
                maxX = 0;
                minY = 0;
                maxY = 0;
            }

            this.Bound = {
                x: minX,
                y: minY,
                width: maxX - minX,
                height: maxY - minY
            };
            return this;
        }
    }, {
        key: 'getBound',
        value: function getBound() {
            return this.updateLocalBounds().Bound;
        }
    }, {
        key: 'destroy',
        value: function destroy(options) {

            for (var i = 0; i < this.graphicsData.length; ++i) {
                this.graphicsData[i].destroy();
            }
            for (var id in this._webGL) {
                for (var j = 0; j < this._webGL[id].data.length; ++j) {
                    this._webGL[id].data[j].destroy();
                }
            }

            this.graphicsData = null;
            this.currentPath = null;
            this._webGL = null;
        }
    }]);
    return Graphics;
}();

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 模拟as3 DisplayList 中的shape 类
 */
var Shape = function (_DisplayObject) {
    inherits(Shape, _DisplayObject);

    function Shape(opt) {
        classCallCheck(this, Shape);

        opt = Utils.checkOpt(opt);
        var styleContext = {
            cursor: opt.context.cursor || "default",

            fillAlpha: opt.context.fillAlpha || 1, //context2d里没有，自定义
            fillStyle: opt.context.fillStyle || null, //"#000000",

            lineCap: opt.context.lineCap || "round", //默认都是直角
            lineJoin: opt.context.lineJoin || "round", //这两个目前webgl里面没实现
            miterLimit: opt.context.miterLimit || null, //miterLimit 属性设置或返回最大斜接长度,只有当 lineJoin 属性为 "miter" 时，miterLimit 才有效。

            lineAlpha: opt.context.lineAlpha || 1, //context2d里没有，自定义
            strokeStyle: opt.context.strokeStyle || null,
            lineType: opt.context.lineType || "solid", //context2d里没有，自定义线条的type，默认为实线
            lineWidth: opt.context.lineWidth || null
        };

        var _context = _.extend(true, styleContext, opt.context);
        opt.context = _context;

        if (opt.id === undefined && opt.type !== undefined) {
            opt.id = Utils.createId(opt.type);
        }

        //over的时候如果有修改样式，就为true
        var _this = possibleConstructorReturn(this, (Shape.__proto__ || Object.getPrototypeOf(Shape)).call(this, opt));

        _this._hoverClass = false;
        _this.hoverClone = true; //是否开启在hover的时候clone一份到active stage 中 
        _this.pointChkPriority = true; //在鼠标mouseover到该节点，然后mousemove的时候，是否优先检测该节点

        _this._eventEnabled = false; //是否响应事件交互,在添加了事件侦听后会自动设置为true

        _this.dragEnabled = opt.dragEnabled || false; //"dragEnabled" in opt ? opt.dragEnabled : false;   //是否启用元素的拖拽

        //拖拽drag的时候显示在activShape的副本
        _this._dragDuplicate = null;

        _this.type = _this.type || "shape";

        //处理所有的图形一些共有的属性配置,把除开id,context之外的所有属性，全部挂载到this上面
        _this.initCompProperty(opt);

        //如果该元素是clone而来，则不需要绘制
        if (!_this.isClone) {
            //如果是clone对象的话就直接
            _this.graphics = new Graphics();
            _this._draw(_this.graphics);
        } else {
            _this.graphics = null;
        }

        return _this;
    }

    createClass(Shape, [{
        key: "_draw",
        value: function _draw(graphics) {
            if (graphics.graphicsData.length == 0) {
                //先设置好当前graphics的style
                graphics.setStyle(this.context);
                this.draw(graphics);
            }
        }
    }, {
        key: "draw",
        value: function draw() {}
    }, {
        key: "clearGraphicsData",
        value: function clearGraphicsData() {
            this.graphics.clear();
        }
    }, {
        key: "$watch",
        value: function $watch(name, value, preValue) {
            if (_.indexOf(STYLE_PROPS, name) > -1) {
                this.graphics.setStyle(this.context);
            }
            this.watch(name, value, preValue);
        }
    }, {
        key: "initCompProperty",
        value: function initCompProperty(opt) {
            for (var i in opt) {
                if (i != "id" && i != "context") {
                    this[i] = opt[i];
                }
            }
        }
    }, {
        key: "getBound",
        value: function getBound() {
            return this.graphics.updateLocalBounds().Bound;
        }

        /*
         * 画虚线
         */

    }, {
        key: "dashedLineTo",
        value: function dashedLineTo(graphics, x1, y1, x2, y2, dashLength) {
            dashLength = typeof dashLength == 'undefined' ? 3 : dashLength;
            dashLength = Math.max(dashLength, this.context.$model.lineWidth);
            var deltaX = x2 - x1;
            var deltaY = y2 - y1;
            var numDashes = Math.floor(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / dashLength);
            for (var i = 0; i < numDashes; ++i) {
                var x = parseInt(x1 + deltaX / numDashes * i);
                var y = parseInt(y1 + deltaY / numDashes * i);
                graphics[i % 2 === 0 ? 'moveTo' : 'lineTo'](x, y);
                if (i == numDashes - 1 && i % 2 === 0) {
                    graphics.lineTo(x2, y2);
                }
            }
        }
    }]);
    return Shape;
}(DisplayObject);

/**
 * Canvax--Text
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 文本 类
 **/
var Text = function (_DisplayObject) {
    inherits(Text, _DisplayObject);

    function Text(text, opt) {
        classCallCheck(this, Text);

        opt.type = "text";

        opt.context = _.extend({
            font: "",
            fontSize: 13, //字体大小默认13
            fontWeight: "normal",
            fontFamily: "微软雅黑,sans-serif",
            textDecoration: null,
            fillStyle: 'blank',
            strokeStyle: null,
            lineWidth: 0,
            lineHeight: 1.2,
            backgroundColor: null,
            textBackgroundColor: null
        }, opt.context);

        var _this = possibleConstructorReturn(this, (Text.__proto__ || Object.getPrototypeOf(Text)).call(this, opt));

        _this._reNewline = /\r?\n/;
        _this.fontProperts = ["fontStyle", "fontVariant", "fontWeight", "fontSize", "fontFamily"];
        _this.context.font = _this._getFontDeclaration();

        _this.text = text.toString();

        _this.context.width = _this.getTextWidth();
        _this.context.height = _this.getTextHeight();
        return _this;
    }

    createClass(Text, [{
        key: "$watch",
        value: function $watch(name, value, preValue) {

            //context属性有变化的监听函数
            if (_.indexOf(this.fontProperts, name) >= 0) {
                this.context[name] = value;
                //如果修改的是font的某个内容，就重新组装一遍font的值，
                //然后通知引擎这次对context的修改上报心跳
                this.context.font = this._getFontDeclaration();
                this.context.width = this.getTextWidth();
                this.context.height = this.getTextHeight();
            }
        }
    }, {
        key: "_setContextStyle",
        value: function _setContextStyle(ctx, style) {
            // 简单判断不做严格类型检测
            for (var p in style) {
                if (p != "textBaseline" && p in ctx) {
                    if (style[p] || _.isNumber(style[p])) {
                        if (p == "globalAlpha") {
                            //透明度要从父节点继承
                            ctx[p] *= style[p];
                        } else {
                            ctx[p] = style[p];
                        }
                    }
                }
            }
            return;
        }
    }, {
        key: "render",
        value: function render(ctx) {
            this._renderText(ctx, this._getTextLines());
        }
    }, {
        key: "resetText",
        value: function resetText(text) {
            this.text = text.toString();
            this.heartBeat();
        }
    }, {
        key: "getTextWidth",
        value: function getTextWidth() {
            var width = 0;
            Utils._pixelCtx.save();
            Utils._pixelCtx.font = this.context.$model.font;
            width = this._getTextWidth(Utils._pixelCtx, this._getTextLines());
            Utils._pixelCtx.restore();
            return width;
        }
    }, {
        key: "getTextHeight",
        value: function getTextHeight() {
            return this._getTextHeight(Utils._pixelCtx, this._getTextLines());
        }
    }, {
        key: "_getTextLines",
        value: function _getTextLines() {
            return this.text.split(this._reNewline);
        }
    }, {
        key: "_renderText",
        value: function _renderText(ctx, textLines) {
            ctx.save();
            this._setContextStyle(ctx, this.context.$model);
            this._renderTextStroke(ctx, textLines);
            this._renderTextFill(ctx, textLines);
            ctx.restore();
        }
    }, {
        key: "_getFontDeclaration",
        value: function _getFontDeclaration() {
            var self = this;
            var fontArr = [];

            _.each(this.fontProperts, function (p) {
                var fontP = self.context[p];
                if (p == "fontSize") {
                    fontP = parseFloat(fontP) + "px";
                }
                fontP && fontArr.push(fontP);
            });

            return fontArr.join(' ');
        }
    }, {
        key: "_renderTextFill",
        value: function _renderTextFill(ctx, textLines) {
            if (!this.context.$model.fillStyle) return;

            this._boundaries = [];
            var lineHeights = 0;

            for (var i = 0, len = textLines.length; i < len; i++) {
                var heightOfLine = this._getHeightOfLine(ctx, i, textLines);
                lineHeights += heightOfLine;

                this._renderTextLine('fillText', ctx, textLines[i], 0, //this._getLeftOffset(),
                this._getTopOffset() + lineHeights, i);
            }
        }
    }, {
        key: "_renderTextStroke",
        value: function _renderTextStroke(ctx, textLines) {
            if (!this.context.$model.strokeStyle || !this.context.$model.lineWidth) return;

            var lineHeights = 0;

            ctx.save();
            if (this.strokeDashArray) {
                if (1 & this.strokeDashArray.length) {
                    this.strokeDashArray.push.apply(this.strokeDashArray, this.strokeDashArray);
                }
                supportsLineDash && ctx.setLineDash(this.strokeDashArray);
            }

            ctx.beginPath();
            for (var i = 0, len = textLines.length; i < len; i++) {
                var heightOfLine = this._getHeightOfLine(ctx, i, textLines);
                lineHeights += heightOfLine;

                this._renderTextLine('strokeText', ctx, textLines[i], 0, //this._getLeftOffset(),
                this._getTopOffset() + lineHeights, i);
            }
            ctx.closePath();
            ctx.restore();
        }
    }, {
        key: "_renderTextLine",
        value: function _renderTextLine(method, ctx, line, left, top, lineIndex) {
            top -= this._getHeightOfLine() / 4;
            if (this.context.$model.textAlign !== 'justify') {
                this._renderChars(method, ctx, line, left, top, lineIndex);
                return;
            }
            var lineWidth = ctx.measureText(line).width;
            var totalWidth = this.context.$model.width;

            if (totalWidth > lineWidth) {
                var words = line.split(/\s+/);
                var wordsWidth = ctx.measureText(line.replace(/\s+/g, '')).width;
                var widthDiff = totalWidth - wordsWidth;
                var numSpaces = words.length - 1;
                var spaceWidth = widthDiff / numSpaces;

                var leftOffset = 0;
                for (var i = 0, len = words.length; i < len; i++) {
                    this._renderChars(method, ctx, words[i], left + leftOffset, top, lineIndex);
                    leftOffset += ctx.measureText(words[i]).width + spaceWidth;
                }
            } else {
                this._renderChars(method, ctx, line, left, top, lineIndex);
            }
        }
    }, {
        key: "_renderChars",
        value: function _renderChars(method, ctx, chars, left, top) {
            ctx[method](chars, 0, top);
        }
    }, {
        key: "_getHeightOfLine",
        value: function _getHeightOfLine() {
            return this.context.$model.fontSize * this.context.$model.lineHeight;
        }
    }, {
        key: "_getTextWidth",
        value: function _getTextWidth(ctx, textLines) {
            var maxWidth = ctx.measureText(textLines[0] || '|').width;
            for (var i = 1, len = textLines.length; i < len; i++) {
                var currentLineWidth = ctx.measureText(textLines[i]).width;
                if (currentLineWidth > maxWidth) {
                    maxWidth = currentLineWidth;
                }
            }
            return maxWidth;
        }
    }, {
        key: "_getTextHeight",
        value: function _getTextHeight(ctx, textLines) {
            return this.context.$model.fontSize * textLines.length * this.context.$model.lineHeight;
        }

        /**
         * @private
         * @return {Number} Top offset
         */

    }, {
        key: "_getTopOffset",
        value: function _getTopOffset() {
            var t = 0;
            switch (this.context.$model.textBaseline) {
                case "top":
                    t = 0;
                    break;
                case "middle":
                    t = -this.context.$model.height / 2;
                    break;
                case "bottom":
                    t = -this.context.$model.height;
                    break;
            }
            return t;
        }
    }, {
        key: "getRect",
        value: function getRect() {
            var c = this.context;
            var x = 0;
            var y = 0;
            //更具textAlign 和 textBaseline 重新矫正 xy
            if (c.textAlign == "center") {
                x = -c.width / 2;
            }
            if (c.textAlign == "right") {
                x = -c.width;
            }
            if (c.textBaseline == "middle") {
                y = -c.height / 2;
            }
            if (c.textBaseline == "bottom") {
                y = -c.height;
            }

            return {
                x: x,
                y: y,
                width: c.width,
                height: c.height
            };
        }
    }]);
    return Text;
}(DisplayObject);

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 向量操作类
 * */
function Vector(x, y) {
    var vx = 0,
        vy = 0;
    if (arguments.length == 1 && _.isObject(x)) {
        var arg = arguments[0];
        if (_.isArray(arg)) {
            vx = arg[0];
            vy = arg[1];
        } else if (arg.hasOwnProperty("x") && arg.hasOwnProperty("y")) {
            vx = arg.x;
            vy = arg.y;
        }
    }
    this._axes = [vx, vy];
}
Vector.prototype = {
    distance: function distance(v) {
        var x = this._axes[0] - v._axes[0];
        var y = this._axes[1] - v._axes[1];

        return Math.sqrt(x * x + y * y);
    }
};

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 处理为平滑线条
 */
/**
 * @inner
 */
function interpolate(p0, p1, p2, p3, t, t2, t3) {
    var v0 = (p2 - p0) * 0.25;
    var v1 = (p3 - p1) * 0.25;
    return (2 * (p1 - p2) + v0 + v1) * t3 + (-3 * (p1 - p2) - 2 * v0 - v1) * t2 + v0 * t + p1;
}
/**
 * 多线段平滑曲线 
 * opt ==> points , isLoop
 */
var SmoothSpline = function (opt) {
    var points = opt.points;
    var isLoop = opt.isLoop;
    var smoothFilter = opt.smoothFilter;

    var len = points.length;
    if (len == 1) {
        return points;
    }
    var ret = [];
    var distance = 0;
    var preVertor = new Vector(points[0]);
    var iVtor = null;
    for (var i = 1; i < len; i++) {
        iVtor = new Vector(points[i]);
        distance += preVertor.distance(iVtor);
        preVertor = iVtor;
    }

    preVertor = null;
    iVtor = null;

    //基本上等于曲率
    var segs = distance / 6;

    segs = segs < len ? len : segs;
    for (var i = 0; i < segs; i++) {
        var pos = i / (segs - 1) * (isLoop ? len : len - 1);
        var idx = Math.floor(pos);

        var w = pos - idx;

        var p0;
        var p1 = points[idx % len];
        var p2;
        var p3;
        if (!isLoop) {
            p0 = points[idx === 0 ? idx : idx - 1];
            p2 = points[idx > len - 2 ? len - 1 : idx + 1];
            p3 = points[idx > len - 3 ? len - 1 : idx + 2];
        } else {
            p0 = points[(idx - 1 + len) % len];
            p2 = points[(idx + 1) % len];
            p3 = points[(idx + 2) % len];
        }

        var w2 = w * w;
        var w3 = w * w2;

        var rp = [interpolate(p0[0], p1[0], p2[0], p3[0], w, w2, w3), interpolate(p0[1], p1[1], p2[1], p3[1], w, w2, w3)];

        _.isFunction(smoothFilter) && smoothFilter(rp);

        ret.push(rp);
    }
    return ret;
};

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 数学 类
 *
 **/

var _cache = {
    sin: {}, //sin缓存
    cos: {} //cos缓存
};
var _radians = Math.PI / 180;

/**
 * @param angle 弧度（角度）参数
 * @param isDegrees angle参数是否为角度计算，默认为false，angle为以弧度计量的角度
 */
function sin(angle, isDegrees) {
    angle = (isDegrees ? angle * _radians : angle).toFixed(4);
    if (typeof _cache.sin[angle] == 'undefined') {
        _cache.sin[angle] = Math.sin(angle);
    }
    return _cache.sin[angle];
}

/**
 * @param radians 弧度参数
 */
function cos(angle, isDegrees) {
    angle = (isDegrees ? angle * _radians : angle).toFixed(4);
    if (typeof _cache.cos[angle] == 'undefined') {
        _cache.cos[angle] = Math.cos(angle);
    }
    return _cache.cos[angle];
}

/**
 * 角度转弧度
 * @param {Object} angle
 */
function degreeToRadian(angle) {
    return angle * _radians;
}

/**
 * 弧度转角度
 * @param {Object} angle
 */
function radianToDegree(angle) {
    return angle / _radians;
}

/*
 * 校验角度到360度内
 * @param {angle} number
 */
function degreeTo360(angle) {
    var reAng = (360 + angle % 360) % 360; //Math.abs(360 + Math.ceil( angle ) % 360) % 360;
    if (reAng == 0 && angle !== 0) {
        reAng = 360;
    }
    return reAng;
}

function getIsgonPointList(n, r) {
    var pointList = [];
    var dStep = 2 * Math.PI / n;
    var beginDeg = -Math.PI / 2;
    var deg = beginDeg;
    for (var i = 0, end = n; i < end; i++) {
        pointList.push([r * Math.cos(deg), r * Math.sin(deg)]);
        deg += dStep;
    }
    return pointList;
}

function getSmoothPointList(pList, smoothFilter) {
    //smoothFilter -- 比如在折线图中。会传一个smoothFilter过来做point的纠正。
    //让y不能超过底部的原点
    var obj = {
        points: pList
    };
    if (_.isFunction(smoothFilter)) {
        obj.smoothFilter = smoothFilter;
    }

    var currL = SmoothSpline(obj);
    if (pList && pList.length > 0) {
        currL.push(pList[pList.length - 1]);
    }

    return currL;
}

var myMath = {
    PI: Math.PI,
    sin: sin,
    cos: cos,
    degreeToRadian: degreeToRadian,
    radianToDegree: radianToDegree,
    degreeTo360: degreeTo360,
    getIsgonPointList: getIsgonPointList,
    getSmoothPointList: getSmoothPointList
};

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 折线 类
 *
 * 对应context的属性有
 * @pointList 各个顶角坐标
 **/
var BrokenLine = function (_Shape) {
    inherits(BrokenLine, _Shape);

    function BrokenLine(opt) {
        classCallCheck(this, BrokenLine);

        opt = Utils.checkOpt(opt);

        var _context = _.extend({
            lineType: null,
            smooth: false,
            pointList: [], //{Array}  // 必须，各个顶角坐标
            smoothFilter: Utils.__emptyFunc
        }, opt.context);

        if (!opt.isClone && _context.smooth) {
            _context.pointList = myMath.getSmoothPointList(_context.pointList);
        }

        opt.context = _context;
        opt.type = "brokenline";

        return possibleConstructorReturn(this, (BrokenLine.__proto__ || Object.getPrototypeOf(BrokenLine)).call(this, opt));
    }

    createClass(BrokenLine, [{
        key: "watch",
        value: function watch(name, value, preValue) {
            if (name == "pointList" || name == "smooth" || name == "lineType") {
                this.graphics.clear();
            }
        }
    }, {
        key: "draw",
        value: function draw(graphics) {
            var context = this.context;
            var pointList = context.pointList;
            if (pointList.length < 2) {
                //少于2个点就不画了~
                return this;
            }
            if (!context.lineType || context.lineType == 'solid') {
                //默认为实线
                //TODO:目前如果 有设置smooth 的情况下是不支持虚线的
                graphics.moveTo(pointList[0][0], pointList[0][1]);
                for (var i = 1, l = pointList.length; i < l; i++) {
                    graphics.lineTo(pointList[i][0], pointList[i][1]);
                }
            } else if (context.lineType == 'dashed' || context.lineType == 'dotted') {
                if (context.smooth) {
                    for (var si = 0, sl = pointList.length; si < sl; si++) {
                        if (si == sl - 1) {
                            break;
                        }
                        graphics.moveTo(pointList[si][0], pointList[si][1]);
                        graphics.lineTo(pointList[si + 1][0], pointList[si + 1][1]);
                        si += 1;
                    }
                } else {
                    //画虚线的方法  
                    for (var i = 1, l = pointList.length; i < l; i++) {
                        var fromX = pointList[i - 1][0];
                        var toX = pointList[i][0];
                        var fromY = pointList[i - 1][1];
                        var toY = pointList[i][1];
                        this.dashedLineTo(graphics, fromX, fromY, toX, toY, 5);
                    }
                }
            }
            return this;
        }
    }]);
    return BrokenLine;
}(Shape);

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 圆形 类
 *
 * 坐标原点再圆心
 *
 * 对应context的属性有
 * @r 圆半径
 **/
var Circle$2 = function (_Shape) {
    inherits(Circle, _Shape);

    function Circle(opt) {
        classCallCheck(this, Circle);

        //opt = Utils.checkOpt( opt );
        //默认情况下面，circle不需要把xy进行parentInt转换
        /*
        var opt = {
            type : "circle",
            xyToInt : false,
            context : {
                r : 0
            }
        };
        */

        opt = _.extend(true, {
            type: "circle",
            xyToInt: false,
            context: {
                r: 0
            }
        }, Utils.checkOpt(opt));

        return possibleConstructorReturn(this, (Circle.__proto__ || Object.getPrototypeOf(Circle)).call(this, opt));
    }

    createClass(Circle, [{
        key: "watch",
        value: function watch(name, value, preValue) {
            if (name == "r") {
                this.graphics.clear();
            }
        }
    }, {
        key: "draw",
        value: function draw(graphics) {
            graphics.drawCircle(0, 0, this.context.$model.r);
        }
    }]);
    return Circle;
}(Shape);

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * Path 类，Path主要用于把svgpath 字符串转换为pointList，然后构建graphicsData
 *
 * 对应context的属性有
 * @path path串
 **/
var Path = function (_Shape) {
    inherits(Path, _Shape);

    function Path(opt) {
        classCallCheck(this, Path);


        var _context = _.extend({
            pointList: [], //从下面的path中计算得到的边界点的集合
            path: "" //字符串 必须，路径。例如:M 0 0 L 0 10 L 10 10 Z (一个三角形)
            //M = moveto
            //L = lineto
            //H = horizontal lineto
            //V = vertical lineto
            //C = curveto
            //S = smooth curveto
            //Q = quadratic Belzier curve
            //T = smooth quadratic Belzier curveto
            //Z = closepath
        }, opt.context);
        opt.context = _context;
        opt.__parsePathData = null;
        opt.type = "path";

        return possibleConstructorReturn(this, (Path.__proto__ || Object.getPrototypeOf(Path)).call(this, opt));
    }

    createClass(Path, [{
        key: "watch",
        value: function watch(name, value, preValue) {
            if (name == "path") {
                //如果path有变动，需要自动计算新的pointList
                this.graphics.clear();
            }
        }
    }, {
        key: "_parsePathData",
        value: function _parsePathData(data) {
            if (this.__parsePathData) {
                return this.__parsePathData;
            }
            if (!data) {
                return [];
            }
            //分拆子分组
            this.__parsePathData = [];
            var paths = _.compact(data.replace(/[Mm]/g, "\\r$&").split('\\r'));
            var me = this;
            _.each(paths, function (pathStr) {
                me.__parsePathData.push(me._parseChildPathData(pathStr));
            });
            return this.__parsePathData;
        }
    }, {
        key: "_parseChildPathData",
        value: function _parseChildPathData(data) {
            // command string
            var cs = data;
            // command chars
            var cc = ['m', 'M', 'l', 'L', 'v', 'V', 'h', 'H', 'z', 'Z', 'c', 'C', 'q', 'Q', 't', 'T', 's', 'S', 'a', 'A'];
            cs = cs.replace(/  /g, ' ');
            cs = cs.replace(/ /g, ',');
            //cs = cs.replace(/(.)-/g, "$1,-");
            cs = cs.replace(/(\d)-/g, '$1,-');
            cs = cs.replace(/,,/g, ',');
            var n;
            // create pipes so that we can split the data
            for (n = 0; n < cc.length; n++) {
                cs = cs.replace(new RegExp(cc[n], 'g'), '|' + cc[n]);
            }
            // create array
            var arr = cs.split('|');
            var ca = [];
            // init context point
            var cpx = 0;
            var cpy = 0;
            for (n = 1; n < arr.length; n++) {
                var str = arr[n];
                var c = str.charAt(0);
                str = str.slice(1);
                str = str.replace(new RegExp('e,-', 'g'), 'e-');

                //有的时候，比如“22，-22” 数据可能会经常的被写成22-22，那么需要手动修改
                //str = str.replace(new RegExp('-', 'g'), ',-');
                //str = str.replace(/(.)-/g, "$1,-")
                var p = str.split(',');

                if (p.length > 0 && p[0] === '') {
                    p.shift();
                }

                for (var i = 0; i < p.length; i++) {
                    p[i] = parseFloat(p[i]);
                }
                while (p.length > 0) {
                    if (isNaN(p[0])) {
                        break;
                    }
                    var cmd = null;
                    var points = [];

                    var ctlPtx;
                    var ctlPty;
                    var prevCmd;

                    var rx;
                    var ry;
                    var psi;
                    var fa;
                    var fs;

                    var x1 = cpx;
                    var y1 = cpy;

                    // convert l, H, h, V, and v to L
                    switch (c) {
                        case 'l':
                            cpx += p.shift();
                            cpy += p.shift();
                            cmd = 'L';
                            points.push(cpx, cpy);
                            break;
                        case 'L':
                            cpx = p.shift();
                            cpy = p.shift();
                            points.push(cpx, cpy);
                            break;
                        case 'm':
                            cpx += p.shift();
                            cpy += p.shift();
                            cmd = 'M';
                            points.push(cpx, cpy);
                            c = 'l';
                            break;
                        case 'M':
                            cpx = p.shift();
                            cpy = p.shift();
                            cmd = 'M';
                            points.push(cpx, cpy);
                            c = 'L';
                            break;

                        case 'h':
                            cpx += p.shift();
                            cmd = 'L';
                            points.push(cpx, cpy);
                            break;
                        case 'H':
                            cpx = p.shift();
                            cmd = 'L';
                            points.push(cpx, cpy);
                            break;
                        case 'v':
                            cpy += p.shift();
                            cmd = 'L';
                            points.push(cpx, cpy);
                            break;
                        case 'V':
                            cpy = p.shift();
                            cmd = 'L';
                            points.push(cpx, cpy);
                            break;
                        case 'C':
                            points.push(p.shift(), p.shift(), p.shift(), p.shift());
                            cpx = p.shift();
                            cpy = p.shift();
                            points.push(cpx, cpy);
                            break;
                        case 'c':
                            points.push(cpx + p.shift(), cpy + p.shift(), cpx + p.shift(), cpy + p.shift());
                            cpx += p.shift();
                            cpy += p.shift();
                            cmd = 'C';
                            points.push(cpx, cpy);
                            break;
                        case 'S':
                            ctlPtx = cpx;
                            ctlPty = cpy;
                            prevCmd = ca[ca.length - 1];
                            if (prevCmd.command === 'C') {
                                ctlPtx = cpx + (cpx - prevCmd.points[2]);
                                ctlPty = cpy + (cpy - prevCmd.points[3]);
                            }
                            points.push(ctlPtx, ctlPty, p.shift(), p.shift());
                            cpx = p.shift();
                            cpy = p.shift();
                            cmd = 'C';
                            points.push(cpx, cpy);
                            break;
                        case 's':
                            ctlPtx = cpx, ctlPty = cpy;
                            prevCmd = ca[ca.length - 1];
                            if (prevCmd.command === 'C') {
                                ctlPtx = cpx + (cpx - prevCmd.points[2]);
                                ctlPty = cpy + (cpy - prevCmd.points[3]);
                            }
                            points.push(ctlPtx, ctlPty, cpx + p.shift(), cpy + p.shift());
                            cpx += p.shift();
                            cpy += p.shift();
                            cmd = 'C';
                            points.push(cpx, cpy);
                            break;
                        case 'Q':
                            points.push(p.shift(), p.shift());
                            cpx = p.shift();
                            cpy = p.shift();
                            points.push(cpx, cpy);
                            break;
                        case 'q':
                            points.push(cpx + p.shift(), cpy + p.shift());
                            cpx += p.shift();
                            cpy += p.shift();
                            cmd = 'Q';
                            points.push(cpx, cpy);
                            break;
                        case 'T':
                            ctlPtx = cpx, ctlPty = cpy;
                            prevCmd = ca[ca.length - 1];
                            if (prevCmd.command === 'Q') {
                                ctlPtx = cpx + (cpx - prevCmd.points[0]);
                                ctlPty = cpy + (cpy - prevCmd.points[1]);
                            }
                            cpx = p.shift();
                            cpy = p.shift();
                            cmd = 'Q';
                            points.push(ctlPtx, ctlPty, cpx, cpy);
                            break;
                        case 't':
                            ctlPtx = cpx, ctlPty = cpy;
                            prevCmd = ca[ca.length - 1];
                            if (prevCmd.command === 'Q') {
                                ctlPtx = cpx + (cpx - prevCmd.points[0]);
                                ctlPty = cpy + (cpy - prevCmd.points[1]);
                            }
                            cpx += p.shift();
                            cpy += p.shift();
                            cmd = 'Q';
                            points.push(ctlPtx, ctlPty, cpx, cpy);
                            break;
                        case 'A':
                            rx = p.shift(); //x半径
                            ry = p.shift(); //y半径
                            psi = p.shift(); //旋转角度
                            fa = p.shift(); //角度大小 
                            fs = p.shift(); //时针方向

                            x1 = cpx, y1 = cpy;
                            cpx = p.shift(), cpy = p.shift();
                            cmd = 'A';
                            points = [rx, ry, psi, fa, fs, cpx, cpy, x1, y1];
                            break;
                        case 'a':
                            rx = p.shift();
                            ry = p.shift();
                            psi = p.shift();
                            fa = p.shift();
                            fs = p.shift();

                            x1 = cpx, y1 = cpy;
                            cpx += p.shift();
                            cpy += p.shift();
                            cmd = 'A';
                            points = [rx, ry, psi, fa, fs, cpx, cpy, x1, y1];
                            break;

                    }

                    ca.push({
                        command: cmd || c,
                        points: points
                    });
                }

                if (c === 'z' || c === 'Z') {
                    ca.push({
                        command: 'z',
                        points: []
                    });
                }
            }
            return ca;
        }

        //重新根的path绘制 graphics

    }, {
        key: "draw",
        value: function draw(graphics) {
            //graphics.beginPath();
            this.__parsePathData = null;
            this.context.$model.pointList = [];

            var pathArray = this._parsePathData(this.context.$model.path);

            for (var g = 0, gl = pathArray.length; g < gl; g++) {
                for (var i = 0, l = pathArray[g].length; i < l; i++) {
                    var c = pathArray[g][i].command,
                        p = pathArray[g][i].points;
                    switch (c) {
                        case 'L':
                            graphics.lineTo(p[0], p[1]);
                            break;
                        case 'M':
                            graphics.moveTo(p[0], p[1]);
                            break;
                        case 'C':
                            graphics.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
                            break;
                        case 'Q':
                            graphics.quadraticCurveTo(p[0], p[1], p[2], p[3]);
                            break;
                        case 'A':
                            //前面6个元素用来放path的A 6个参数，path A命令详见
                            Arc.drawArc(graphics, p[7], p[8], p);
                            break;
                        case 'z':
                            graphics.closePath();
                            break;
                    }
                }
            }
            return this;
        }
    }]);
    return Path;
}(Shape);

/**
 * Canvax
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 水滴形 类
 * 派生自Path类
 *
 * 对应context的属性有
 * @hr 水滴横宽（中心到水平边缘最宽处距离）
 * @vr 水滴纵高（中心到尖端距离）
 **/
var Droplet = function (_Path) {
    inherits(Droplet, _Path);

    function Droplet(opt) {
        var _this;

        classCallCheck(this, Droplet);

        opt = _.extend({
            type: "droplet",
            context: {
                hr: 0, //{number},  // 必须，水滴横宽（中心到水平边缘最宽处距离）
                vr: 0 //{number},  // 必须，水滴纵高（中心到尖端距离）
            }
        }, Utils.checkOpt(opt));

        var my = (_this = possibleConstructorReturn(this, (Droplet.__proto__ || Object.getPrototypeOf(Droplet)).call(this, opt)), _this);

        _this.context.$model.path = _this.createPath();
        return _this;
    }

    createClass(Droplet, [{
        key: "watch",
        value: function watch(name, value, preValue) {
            if (name == "hr" || name == "vr") {
                this.context.$model.path = this.createPath();
            }
        }
    }, {
        key: "createPath",
        value: function createPath() {
            var model = this.context.$model;
            var ps = "M 0 " + model.hr + " C " + model.hr + " " + model.hr + " " + model.hr * 3 / 2 + " " + -model.hr / 3 + " 0 " + -model.vr;
            ps += " C " + -model.hr * 3 / 2 + " " + -model.hr / 3 + " " + -model.hr + " " + model.hr + " 0 " + model.hr + "z";
            return ps;
        }
    }]);
    return Droplet;
}(Path);

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 椭圆形 类
 *
 * 对应context的属性有 
 *
 * @hr 椭圆横轴半径
 * @vr 椭圆纵轴半径
 */
var Ellipse$2 = function (_Shape) {
    inherits(Ellipse, _Shape);

    function Ellipse(opt) {
        classCallCheck(this, Ellipse);

        opt = _.extend({
            type: "ellipse",
            context: {
                hr: 0, //{number},  // 必须，水滴横宽（中心到水平边缘最宽处距离）
                vr: 0 //{number},  // 必须，水滴纵高（中心到尖端距离）
            }
        }, Utils.checkOpt(opt));

        return possibleConstructorReturn(this, (Ellipse.__proto__ || Object.getPrototypeOf(Ellipse)).call(this, opt));
    }

    createClass(Ellipse, [{
        key: "watch",
        value: function watch(name, value, preValue) {
            if (name == "hr" || name == "vr") {
                this.graphics.clear();
            }
        }
    }, {
        key: "draw",
        value: function draw(graphics) {
            graphics.drawEllipse(0, 0, this.context.$model.hr * 2, this.context.$model.vr * 2);
        }
    }]);
    return Ellipse;
}(Shape);

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 多边形 类  （不规则）
 *
 * 对应context的属性有
 * @pointList 多边形各个顶角坐标
 **/
var Polygon$2 = function (_Shape) {
    inherits(Polygon, _Shape);

    function Polygon(opt) {
        classCallCheck(this, Polygon);

        var _context = _.extend({
            lineType: null,
            smooth: false,
            pointList: [], //{Array}  // 必须，各个顶角坐标
            smoothFilter: Utils.__emptyFunc
        }, opt.context);

        if (!opt.isClone) {
            var start = _context.pointList[0];
            var end = _context.pointList.slice(-1)[0];
            if (_context.smooth) {
                _context.pointList.unshift(end);
                _context.pointList = myMath.getSmoothPointList(_context.pointList);
            }
        }

        opt.context = _context;
        opt.type = "polygon";

        return possibleConstructorReturn(this, (Polygon.__proto__ || Object.getPrototypeOf(Polygon)).call(this, opt));
    }

    createClass(Polygon, [{
        key: "watch",
        value: function watch(name, value, preValue) {
            //调用parent的setGraphics
            if (name == "pointList" || name == "smooth" || name == "lineType") {
                this.graphics.clear();
            }
        }
    }, {
        key: "draw",
        value: function draw(graphics) {
            //graphics.beginPath();
            var context = this.context;
            var pointList = context.pointList;
            if (pointList.length < 2) {
                //少于2个点就不画了~
                return;
            }

            graphics.moveTo(pointList[0][0], pointList[0][1]);
            for (var i = 1, l = pointList.length; i < l; i++) {
                graphics.lineTo(pointList[i][0], pointList[i][1]);
            }
            graphics.closePath();

            //如果为虚线
            if (context.lineType == 'dashed' || context.lineType == 'dotted') {
                //首先把前面的draphicsData设置为fill only
                //也就是把line强制设置为false，这点很重要，否则你虚线画不出来，会和这个实现重叠了
                graphics.currentPath.line = false;

                if (context.smooth) {
                    //如果是smooth，本身已经被用曲率打散过了，不需要采用间隔法
                    for (var si = 0, sl = pointList.length; si < sl; si++) {
                        if (si == sl - 1) {
                            break;
                        }
                        graphics.moveTo(pointList[si][0], pointList[si][1]);
                        graphics.lineTo(pointList[si + 1][0], pointList[si + 1][1]);
                        si += 1;
                    }
                } else {
                    //画虚线的方法  
                    graphics.moveTo(pointList[0][0], pointList[0][1]);
                    for (var i = 1, l = pointList.length; i < l; i++) {
                        var fromX = pointList[i - 1][0];
                        var toX = pointList[i][0];
                        var fromY = pointList[i - 1][1];
                        var toY = pointList[i][1];
                        this.dashedLineTo(graphics, fromX, fromY, toX, toY, 5);
                    }
                }
            }

            graphics.closePath();
            return;
        }
    }]);
    return Polygon;
}(Shape);

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 正n边形（n>=3）
 *
 * 对应context的属性有 
 *
 * @r 正n边形外接圆半径
 * @r 指明正几边形
 *
 * @pointList 私有，从上面的r和n计算得到的边界值的集合
 */
var Isogon = function (_Polygon) {
    inherits(Isogon, _Polygon);

    function Isogon(opt) {
        classCallCheck(this, Isogon);

        var _context = _.extend({
            pointList: [], //从下面的r和n计算得到的边界值的集合
            r: 0, //{number},  // 必须，正n边形外接圆半径
            n: 0 //{number},  // 必须，指明正几边形
        }, opt.context);
        _context.pointList = myMath.getIsgonPointList(_context.n, _context.r);

        opt.context = _context;
        opt.type = "isogon";

        return possibleConstructorReturn(this, (Isogon.__proto__ || Object.getPrototypeOf(Isogon)).call(this, opt));
    }

    createClass(Isogon, [{
        key: "watch",
        value: function watch(name, value, preValue) {
            if (name == "r" || name == "n") {
                //如果path有变动，需要自动计算新的pointList
                this.context.$model.pointList = myMath.getIsgonPointList(this.context.$model.n, this.context.$model.r);
            }
            if (name == "pointList" || name == "smooth" || name == "lineType") {
                this.graphics.clear();
            }
        }
    }]);
    return Isogon;
}(Polygon$2);

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 线条 类
 *
 *
 * 对应context的属性有
 * @lineType  可选 虚线 实现 的 类型
 * @xStart    必须，起点横坐标
 * @yStart    必须，起点纵坐标
 * @xEnd      必须，终点横坐标
 * @yEnd      必须，终点纵坐标
 **/
var Line = function (_Shape) {
    inherits(Line, _Shape);

    function Line(opt) {
        classCallCheck(this, Line);

        var _context = _.extend({
            lineType: null, //可选 虚线 实现 的 类型
            start: {
                x: 0, // 必须，起点横坐标
                y: 0 // 必须，起点纵坐标
            },
            end: {
                x: 0, // 必须，终点横坐标
                y: 0 // 必须，终点纵坐标
            },
            dashLength: 3 // 虚线间隔
        }, opt.context);
        opt.context = _context;

        opt.type = "line";

        return possibleConstructorReturn(this, (Line.__proto__ || Object.getPrototypeOf(Line)).call(this, opt));
    }

    createClass(Line, [{
        key: "watch",
        value: function watch(name, value, preValue) {
            //并不清楚是start.x 还是end.x， 当然，这并不重要
            if (name == "x" || name == "y") {
                this.graphics.clear();
            }
        }
    }, {
        key: "draw",
        value: function draw(graphics) {
            var model = this.context.$model;
            if (!model.lineType || model.lineType == 'solid') {
                graphics.moveTo(model.start.x, model.start.y);
                graphics.lineTo(model.end.x, model.end.y);
            } else if (model.lineType == 'dashed' || model.lineType == 'dotted') {
                this.dashedLineTo(graphics, model.start.x, model.start.y, model.end.x, model.end.y, model.dashLength);
            }
            return this;
        }
    }]);
    return Line;
}(Shape);

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 矩现 类  （不规则）
 *
 *
 * 对应context的属性有
 * @width 宽度
 * @height 高度
 * @radius 如果是圆角的，则为【上右下左】顺序的圆角半径数组
 **/
var Rect = function (_Shape) {
    inherits(Rect, _Shape);

    function Rect(opt) {
        classCallCheck(this, Rect);

        var _context = _.extend({
            width: 0,
            height: 0,
            radius: []
        }, opt.context);
        opt.context = _context;
        opt.type = "rect";

        return possibleConstructorReturn(this, (Rect.__proto__ || Object.getPrototypeOf(Rect)).call(this, opt));
    }

    createClass(Rect, [{
        key: "watch",
        value: function watch(name, value, preValue) {
            if (name == "width" || name == "height" || name == "radius") {
                this.graphics.clear();
            }
        }

        /**
         * 绘制圆角矩形
         */

    }, {
        key: "_buildRadiusPath",
        value: function _buildRadiusPath(graphics) {
            var model = this.context.$model;
            //左上、右上、右下、左下角的半径依次为r1、r2、r3、r4
            //r缩写为1         相当于 [1, 1, 1, 1]
            //r缩写为[1]       相当于 [1, 1, 1, 1]
            //r缩写为[1, 2]    相当于 [1, 2, 1, 2]
            //r缩写为[1, 2, 3] 相当于 [1, 2, 3, 2]
            var x = 0;
            var y = 0;
            var width = model.width;
            var height = model.height;

            var r = Utils.getCssOrderArr(model.radius);
            var G = graphics;

            var sy = 1;
            if (height >= 0) {
                sy = -1;
            }

            G.moveTo(parseInt(x + r[0]), parseInt(height));

            G.lineTo(parseInt(x + width - r[1]), parseInt(height));

            r[1] !== 0 && G.quadraticCurveTo(x + width, height, parseInt(x + width), parseInt(height + r[1] * sy));
            G.lineTo(parseInt(x + width), parseInt(y - r[2] * sy));

            r[2] !== 0 && G.quadraticCurveTo(x + width, y, parseInt(x + width - r[2]), parseInt(y));
            G.lineTo(parseInt(x + r[3]), parseInt(y));
            r[3] !== 0 && G.quadraticCurveTo(x, y, parseInt(x), parseInt(y - r[3] * sy));
            G.lineTo(parseInt(x), parseInt(y + height + r[0] * sy));
            r[0] !== 0 && G.quadraticCurveTo(x, y + height, parseInt(x + r[0]), parseInt(y + height));
        }
    }, {
        key: "draw",
        value: function draw(graphics) {
            var model = this.context.$model;
            if (!model.radius.length) {
                graphics.drawRect(0, 0, model.width, model.height);
            } else {
                this._buildRadiusPath(graphics);
            }
            graphics.closePath();
            return;
        }
    }]);
    return Rect;
}(Shape);

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 扇形 类
 *
 * 坐标原点再圆心
 *
 * 对应context的属性有
 * @r0 默认为0，内圆半径指定后将出现内弧，同时扇边长度 = r - r0
 * @r  必须，外圆半径
 * @startAngle 起始角度(0, 360)
 * @endAngle   结束角度(0, 360)
 **/
var Sector = function (_Shape) {
    inherits(Sector, _Shape);

    function Sector(opt) {
        classCallCheck(this, Sector);

        var _context = _.extend({
            pointList: [], //边界点的集合,私有，从下面的属性计算的来
            r0: 0, // 默认为0，内圆半径指定后将出现内弧，同时扇边长度 = r - r0
            r: 0, //{number},  // 必须，外圆半径
            startAngle: 0, //{number},  // 必须，起始角度[0, 360)
            endAngle: 0, //{number},  // 必须，结束角度(0, 360]
            clockwise: false //是否顺时针，默认为false(顺时针)
        }, opt.context);

        opt.context = _context;
        opt.regAngle = [];
        opt.isRing = false; //是否为一个圆环
        opt.type = "sector";

        return possibleConstructorReturn(this, (Sector.__proto__ || Object.getPrototypeOf(Sector)).call(this, opt));
    }

    createClass(Sector, [{
        key: "watch",
        value: function watch(name, value, preValue) {
            if (name == "r0" || name == "r" || name == "startAngle" || name == "endAngle" || name == "clockwise") {
                //因为这里的graphs不一样。
                this.graphics.clear();
            }
        }
    }, {
        key: "draw",
        value: function draw(graphics) {
            var model = this.context.$model;
            // 形内半径[0,r)
            var r0 = typeof model.r0 == 'undefined' ? 0 : model.r0;
            var r = model.r; // 扇形外半径(0,r]
            var startAngle = myMath.degreeTo360(model.startAngle); // 起始角度[0,360)
            var endAngle = myMath.degreeTo360(model.endAngle); // 结束角度(0,360]

            if (model.startAngle != model.endAngle && Math.abs(model.startAngle - model.endAngle) % 360 == 0) {
                //if( startAngle == endAngle && model.startAngle != model.endAngle ) {
                //如果两个角度相等，那么就认为是个圆环了
                this.isRing = true;
                startAngle = 0;
                endAngle = 360;
            }

            startAngle = myMath.degreeToRadian(startAngle);
            endAngle = myMath.degreeToRadian(endAngle);

            //处理下极小夹角的情况
            //if( endAngle - startAngle < 0.025 ){
            //    startAngle -= 0.003
            //}

            var G = graphics;
            //G.beginPath();
            if (this.isRing) {
                if (model.r0 == 0) {
                    //圆
                    G.drawCircle(0, 0, model.r);
                } else {
                    //圆环
                    if (model.fillStyle && model.fillAlpha) {
                        G.beginPath();
                        G.arc(0, 0, r, startAngle, endAngle, model.clockwise);
                        if (model.r0 == 0) {
                            G.lineTo(0, 0);
                        } else {
                            G.arc(0, 0, r0, endAngle, startAngle, !model.clockwise);
                        }
                        G.closePath();
                        G.currentPath.lineWidth = 0;
                        G.currentPath.strokeStyle = null;
                        G.currentPath.lineAlpha = 0;
                        G.currentPath.line = false;
                    }
                    if (model.lineWidth && model.strokeStyle && model.lineAlpha) {
                        G.beginPath();
                        G.arc(0, 0, r, startAngle, endAngle, model.clockwise);
                        G.closePath();
                        G.currentPath.fillStyle = null;
                        G.currentPath.fill = false;

                        G.beginPath();
                        G.arc(0, 0, r0, endAngle, startAngle, !model.clockwise);
                        G.closePath();
                        G.currentPath.fillStyle = null;
                        G.currentPath.fill = false;
                    }
                }
            } else {
                //正常的扇形状
                G.beginPath();
                G.arc(0, 0, r, startAngle, endAngle, model.clockwise);
                if (model.r0 == 0) {
                    G.lineTo(0, 0);
                } else {
                    G.arc(0, 0, r0, endAngle, startAngle, !model.clockwise);
                }
                G.closePath();
            }
            //G.closePath();
        }
    }]);
    return Sector;
}(Shape);

//shapes
var Canvax = {
    App: Application
};

Canvax.Display = {
    DisplayObject: DisplayObject,
    DisplayObjectContainer: DisplayObjectContainer,
    Stage: Stage,
    Sprite: Sprite,
    Shape: Shape,
    Point: Point,
    Text: Text
};

Canvax.Shapes = {
    BrokenLine: BrokenLine,
    Circle: Circle$2,
    Droplet: Droplet,
    Ellipse: Ellipse$2,
    Isogon: Isogon,
    Line: Line,
    Path: Path,
    Polygon: Polygon$2,
    Rect: Rect,
    Sector: Sector
};

Canvax.Event = {
    EventDispatcher: EventDispatcher,
    EventManager: EventManager
};

Canvax.AnimationFrame = AnimationFrame;

Canvax._ = _;

var canvax = Canvax;

var underscore = createCommonjsModule$1(function (module, exports) {
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  {
    if ('object' !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof undefined === 'function' && undefined.amd) {
    undefined('underscore', [], function() {
      return _;
    });
  }
}.call(commonjsGlobal$1));
});

//扩展underscore，主要是deepExtend
function mixinUnderscore() {
    var arrays,
        basicObjects,
        _deepClone,
        deepExtend,
        _deepExtendCouple,
        isBasicObject,
        __slice = [].slice;

    _deepClone = function deepClone(obj) {
        var func, isArr;
        if (!underscore.isObject(obj) || underscore.isFunction(obj)) {
            return obj;
        }
        if (underscore.isDate(obj)) {
            return new Date(obj.getTime());
        }
        if (underscore.isRegExp(obj)) {
            return new RegExp(obj.source, obj.toString().replace(/.*\//, ""));
        }
        isArr = underscore.isArray(obj || underscore.isArguments(obj));
        func = function func(memo, value, key) {
            if (isArr) {
                memo.push(_deepClone(value));
            } else {
                memo[key] = _deepClone(value);
            }
            return memo;
        };
        return underscore.reduce(obj, func, isArr ? [] : {});
    };

    isBasicObject = function isBasicObject(object) {
        return (object == null || object == undefined || object.prototype === {}.prototype || object.prototype === Object.prototype) && underscore.isObject(object) && !underscore.isArray(object) && !underscore.isFunction(object) && !underscore.isDate(object) && !underscore.isRegExp(object) && !underscore.isArguments(object);
    };

    basicObjects = function basicObjects(object) {
        return underscore.filter(underscore.keys(object), function (key) {
            return isBasicObject(object[key]);
        });
    };

    arrays = function arrays(object) {
        return underscore.filter(underscore.keys(object), function (key) {
            return underscore.isArray(object[key]);
        });
    };

    _deepExtendCouple = function deepExtendCouple(destination, source, maxDepth) {
        if (!source) {
            return destination;
        }
        var combine, recurse, sharedArrayKey, sharedArrayKeys, sharedObjectKey, sharedObjectKeys, _i, _j, _len, _len1;
        if (maxDepth == null) {
            maxDepth = 20;
        }
        if (maxDepth <= 0) {
            console.warn('_.deepExtend(): Maximum depth of recursion hit.');
            return underscore.extend(destination, source);
        }
        sharedObjectKeys = underscore.intersection(basicObjects(destination), basicObjects(source));
        recurse = function recurse(key) {
            return source[key] = _deepExtendCouple(destination[key], source[key], maxDepth - 1);
        };
        for (var _i = 0, _len = sharedObjectKeys.length; _i < _len; _i++) {
            sharedObjectKey = sharedObjectKeys[_i];
            recurse(sharedObjectKey);
        }
        sharedArrayKeys = underscore.intersection(arrays(destination), arrays(source));
        combine = function combine(key) {
            //TODO:这里做点修改，array的话就不需要做并集了。直接整个array覆盖。因为
            //在大部分的场景里，array的话，应该要看成是一个basicObject
            return source[key];

            //return source[key] = _.union(destination[key], source[key]);
        };
        for (var _j = 0, _len1 = sharedArrayKeys.length; _j < _len1; _j++) {
            sharedArrayKey = sharedArrayKeys[_j];
            combine(sharedArrayKey);
        }
        return underscore.extend(destination, source);
    };

    deepExtend = function deepExtend() {
        var finalObj, maxDepth, objects, _i;
        objects = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), maxDepth = arguments[_i++];
        if (!underscore.isNumber(maxDepth)) {
            objects.push(maxDepth);
            maxDepth = 20;
        }
        if (objects.length <= 1) {
            return objects[0];
        }
        if (maxDepth <= 0) {
            return underscore.extend.apply(this, objects);
        }
        finalObj = objects.shift();
        while (objects.length > 0) {
            finalObj = _deepExtendCouple(finalObj, _deepClone(objects.shift()), maxDepth);
        }
        return finalObj;
    };

    underscore.mixin({
        deepClone: _deepClone,
        isBasicObject: isBasicObject,
        basicObjects: basicObjects,
        arrays: arrays,
        deepExtend: deepExtend
    });
}

//如果应用传入的数据是[{name:name, sex:sex ...} , ...] 这样的数据，就自动转换为chartx需要的矩阵格式数据
function parse2MatrixData(list) {
    //检测第一个数据是否为一个array, 否就是传入了一个json格式的数据
    if (list.length > 0 && !underscore.isArray(list[0])) {
        var newArr = [];
        var fields = [];
        var fieldNum = 0;
        for (var i = 0, l = list.length; i < l; i++) {
            var row = list[i];
            if (i == 0) {
                for (var f in row) {
                    fields.push(f);
                }
                newArr.push(fields);
                fieldNum = fields.length;
            }
            var _rowData = [];
            for (var ii = 0; ii < fieldNum; ii++) {
                _rowData.push(row[fields[ii]]);
            }
            newArr.push(_rowData);
        }

        return newArr;
    } else {
        return list;
    }
}

/**
 * 数字千分位加','号
 * @param  {[Number]} $n [数字]
 * @param  {[type]} $s [千分位上的符号]
 * @return {[String]}    [根据$s提供的值 对千分位进行分隔 并且小数点上自动加上'.'号  组合成字符串]
 */
function numAddSymbol($n, $s) {
    var s = Number($n);
    var symbol = $s ? $s : ',';
    if (!s) {
        return String($n);
    }
    if (s >= 1000) {
        var num = parseInt(s / 1000);
        return String($n.toString().replace(num, num + symbol));
    } else {
        return String($n);
    }
}

function getEl(el) {
    if (underscore.isString(el)) {
        return document.getElementById(el);
    }
    if (el.nodeType == 1) {
        //则为一个element本身
        return el;
    }
    if (el.length) {
        return el[0];
    }
    return null;
}

//在一个数组中 返回比对$arr中的值离$n最近的值的索引
function getDisMinATArr($n, $arr) {
    var index = 0;
    var n = Math.abs($n - $arr[0]);
    for (var a = 1, al = $arr.length; a < al; a++) {
        if (n > Math.abs($n - $arr[a])) {
            n = Math.abs($n - $arr[a]);
            index = a;
        }
    }
    return index;
}

/**
* 获取一个path路径
* @param  {[Array]} $arr    [数组]
* @return {[String]}        [path字符串]
*/
function getPath($arr) {
    var M = 'M',
        L = 'L',
        Z = 'z';
    var s = '';
    if (underscore.isArray($arr[0])) {
        s = M + $arr[0][0] + ' ' + $arr[0][1];
    } else {
        s = M + $arr[0].x + ' ' + $arr[0].y;
    }
    for (var a = 1, al = $arr.length; a < al; a++) {
        var x = 0,
            y = 0,
            item = $arr[a];
        if (underscore.isArray(item)) {
            x = item[0];
            y = item[1];
        } else {
            x = item.x;
            y = item.y;
        }
        s += ' ' + L + x + ' ' + y;
    }
    // s += ' ' + Z
    return s;
}

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck$1 = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass$1 = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits$1 = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn$1 = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Chart = function (_Canvax$Event$EventDi) {
    inherits$1(Chart, _Canvax$Event$EventDi);

    function Chart(node, data, opts) {
        classCallCheck$1(this, Chart);

        //先处理好undersocre的插件,主要是deepExtend
        mixinUnderscore();

        var _this = possibleConstructorReturn$1(this, (Chart.__proto__ || Object.getPrototypeOf(Chart)).call(this, node, data, opts));

        _this.Canvax = canvax;

        _this.el = getEl(node); //chart 在页面里面的容器节点，也就是要把这个chart放在哪个节点里
        _this.width = parseInt(_this.el.offsetWidth); //图表区域宽
        _this.height = parseInt(_this.el.offsetHeight); //图表区域高

        _this.padding = {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        };

        //Canvax实例
        _this.canvax = new canvax.App({
            el: _this.el,
            webGL: false
        });
        _this.canvax.registEvent();
        _this.stage = new canvax.Display.Stage({
            id: "main-chart-stage" + new Date().getTime()
        });
        _this.canvax.addChild(_this.stage);

        //组件管理机制
        _this.plugs = [];

        _this.inited = false;
        _this.dataFrame = null; //每个图表的数据集合 都 存放在dataFrame中。

        _this.init.apply(_this, arguments);

        var me = _this;
        if (opts.waterMark) {
            //添加水印的临时解决方案
            setTimeout(function () {
                me._initWaterMark(opts.waterMark);
            }, 50);
        }
        return _this;
    }

    createClass$1(Chart, [{
        key: "init",
        value: function init() {}
    }, {
        key: "draw",
        value: function draw() {}

        /*
         * chart的销毁
         */

    }, {
        key: "destroy",
        value: function destroy() {
            this.clean();
            if (this.el) {
                this.el.innerHTML = "";
                this.el = null;
            }
            this._destroy && this._destroy();
            this.fire("destroy");
        }

        /*
         * 清除整个图表
         **/

    }, {
        key: "clean",
        value: function clean() {
            for (var i = 0, l = this.canvax.children.length; i < l; i++) {
                var stage = this.canvax.getChildAt(i);
                for (var s = 0, sl = stage.children.length; s < sl; s++) {
                    stage.getChildAt(s).destroy();
                    s--;
                    sl--;
                }
            }
        }

        /**
         * 容器的尺寸改变重新绘制
         */

    }, {
        key: "resize",
        value: function resize() {
            var _w = parseInt(this.el.offsetWidth);
            var _h = parseInt(this.el.offsetHeight);
            if (_w == this.width && _h == this.height) return;
            this.clean();
            this.width = _w;
            this.height = _h;
            this.canvax.resize();
            this.inited = false;
            this.draw({
                resize: true
            });
            this.inited = true;
        }

        /**
         * reset有两种情况，一是data数据源改变， 一个options的参数配置改变。
         * @param obj {data , options}
         * 这个是最简单粗暴的reset方式，全部叉掉重新画，但是如果有些需要比较细腻的reset，比如
         * line，bar数据变化是在原有的原件上面做平滑的变动的话，需要在各自图表的构造函数中重置该函数
         */

    }, {
        key: "reset",
        value: function reset(obj) {
            this._reset && this._reset(obj);
            var d = this.dataFrame.org || [];
            if (obj && obj.options) {
                underscore.deepExtend(this, obj.options);
            }
            if (obj && obj.data) {
                d = obj.data;
            }
            d && this.resetData(d);
            this.plugs = [];
            this.clean();
            this.canvax.getDomContainer().innerHTML = "";
            this.draw();
        }

        //这个resetData一般会被具体的chart实例给覆盖实现

    }, {
        key: "resetData",
        value: function resetData(data) {
            this.dataFrame = this._initData(data);
        }
    }, {
        key: "_rotate",
        value: function _rotate(angle) {
            var currW = this.width;
            var currH = this.height;
            this.width = currH;
            this.height = currW;

            var self = this;
            underscore.each(self.stage.children, function (sprite) {
                sprite.context.rotation = angle || -90;
                sprite.context.x = (currW - currH) / 2;
                sprite.context.y = (currH - currW) / 2;
                sprite.context.rotateOrigin.x = self.width * sprite.context.$model.scaleX / 2;
                sprite.context.rotateOrigin.y = self.height * sprite.context.$model.scaleY / 2;
            });
        }

        //默认每个chart都要内部实现一个_initData

    }, {
        key: "_initData",
        value: function _initData(data) {
            return data;
        }

        //插件管理相关代码begin

    }, {
        key: "initPlugsModules",
        value: function initPlugsModules(opt) {}

        //所有plug触发更新

    }, {
        key: "plugsReset",
        value: function plugsReset(opt, e) {}
    }, {
        key: "drawPlugs",
        value: function drawPlugs() {
            do {
                var p = this.plugs.shift();
                p && p.plug && p.plug.draw && p.plug.draw();
            } while (this.plugs.length > 0);
        }

        //插件相关代码end

        //添加水印

    }, {
        key: "_initWaterMark",
        value: function _initWaterMark(waterMarkOpt) {
            var text = waterMarkOpt.content || "waterMark";
            var sp = new canvax.Display.Sprite({
                id: "watermark",
                context: {
                    //rotation : 45,
                    //rotateOrigin : {
                    //    x : this.width/2,
                    //    y : this.height/2
                    //}
                }
            });
            var textEl = new canvax.Display.Text(text, {
                context: {
                    fontSize: waterMarkOpt.fontSize || 20,
                    strokeStyle: waterMarkOpt.strokeStyle || "#ccc",
                    lineWidth: waterMarkOpt.lineWidth || 2
                }
            });

            var textW = textEl.getTextWidth();
            var textH = textEl.getTextHeight();

            var rowCount = parseInt(this.height / (textH * 5)) + 1;
            var coluCount = parseInt(this.width / (textW * 1.5)) + 1;

            for (var r = 0; r < rowCount; r++) {
                for (var c = 0; c < coluCount; c++) {
                    //TODO:text 的 clone有问题
                    //var cloneText = textEl.clone();
                    var _textEl = new canvax.Display.Text(text, {
                        context: {
                            rotation: 45,
                            fontSize: waterMarkOpt.fontSize || 25,
                            strokeStyle: waterMarkOpt.strokeStyle || "#ccc",
                            lineWidth: waterMarkOpt.lineWidth || 0,
                            fillStyle: waterMarkOpt.fillStyle || "#ccc",
                            globalAlpha: waterMarkOpt.globalAlpha || 0.1
                        }
                    });
                    _textEl.context.x = textW * 1.5 * c + textW * .25;
                    _textEl.context.y = textH * 5 * r;
                    sp.addChild(_textEl);
                }
            }

            this.stage.addChild(sp);
        }
    }]);
    return Chart;
}(canvax.Event.EventDispatcher);

var component = function (_Canvax$Event$EventDi) {
    inherits$1(component, _Canvax$Event$EventDi);

    function component(opt, data) {
        classCallCheck$1(this, component);

        var _this = possibleConstructorReturn$1(this, (component.__proto__ || Object.getPrototypeOf(component)).call(this, opt, data));

        _this.enabled = false; //是否加载该组件
        _this.display = true; //该组件是否显示，不显示的话就不占据物理空间
        return _this;
    }

    createClass$1(component, [{
        key: "init",
        value: function init(opt, data) {}

        //组件的销毁

    }, {
        key: "destroy",
        value: function destroy() {}
    }, {
        key: "reset",
        value: function reset() {}
    }]);
    return component;
}(canvax.Event.EventDispatcher);

var Tips = function (_Component) {
    inherits$1(Tips, _Component);

    function Tips(opt, tipDomContainer) {
        classCallCheck$1(this, Tips);

        var _this = possibleConstructorReturn$1(this, (Tips.__proto__ || Object.getPrototypeOf(Tips)).call(this));

        _this.tipDomContainer = tipDomContainer;
        _this.cW = 0; //容器的width
        _this.cH = 0; //容器的height

        _this.dW = 0; //html的tips内容width
        _this.dH = 0; //html的tips内容Height

        _this.backR = "5px"; //背景框的 圆角 

        _this.sprite = null;
        _this.content = null; //tips的详细内容

        _this.fillStyle = "rgba(255,255,255,0.95)"; //"#000000";
        _this.text = {
            fillStyle: "#999"
        };
        _this.strokeStyle = "#ccc";

        _this.place = "right"; //在鼠标的左（右）边

        _this._tipDom = null;
        //this._back   = null;

        _this.offset = 10; //tips内容到鼠标位置的偏移量

        //所有调用tip的 event 上面 要附带有符合下面结构的tipsInfo属性
        //会deepExtend到this.indo上面来
        _this.tipsInfo = {
            //nodesInfoList : [],//[{value: , fillStyle : ...} ...]符合iNode的所有Group上面的node的集合
            //iGroup        : 0, //数据组的索引对应二维数据map的x
            //iNode         : 0  //数据点的索引对应二维数据map的y
        };
        _this.prefix = [];
        _this.positionInRange = false; //tip的浮层是否限定在画布区域
        _this.enabled = true; //tips是默认显示的
        _this.init(opt);
        return _this;
    }

    createClass$1(Tips, [{
        key: "init",
        value: function init(opt) {
            underscore.deepExtend(this, opt);
            this.sprite = new canvax.Display.Sprite({
                id: "TipSprite"
            });
            var self = this;
            this.sprite.on("destroy", function () {
                self._tipDom = null;
            });
        }
    }, {
        key: "show",
        value: function show(e) {

            if (!this.enabled) return;
            this.hide();

            var stage = e.target.getStage();
            this.cW = stage.context.width;
            this.cH = stage.context.height;

            this._initContent(e);

            this.setPosition(e);

            this.sprite.toFront();
        }
    }, {
        key: "move",
        value: function move(e) {
            if (!this.enabled) return;
            this._setContent(e);
            this.setPosition(e);
        }
    }, {
        key: "hide",
        value: function hide() {
            if (!this.enabled) return;
            this.sprite.removeAllChildren();
            this._removeContent();
        }

        /**
         *@pos {x:0,y:0}
         */

    }, {
        key: "setPosition",
        value: function setPosition(e) {
            if (!this.enabled) return;
            if (!this._tipDom) return;
            var pos = e.pos || e.target.localToGlobal(e.point);
            var x = this._checkX(pos.x + this.offset);
            var y = this._checkY(pos.y + this.offset);

            this._tipDom.style.cssText += ";visibility:visible;left:" + x + "px;top:" + y + "px;-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;";

            if (this.place == "left") {
                this._tipDom.style.left = this._checkX(pos.x - this.offset - this._tipDom.offsetWidth) + "px";
            }
        }

        /**
         *content相关-------------------------
         */

    }, {
        key: "_initContent",
        value: function _initContent(e) {

            var me = this;
            this._tipDom = document.createElement("div");
            this._tipDom.className = "chart-tips";
            this._tipDom.style.cssText += "；-moz-border-radius:" + this.backR + "; -webkit-border-radius:" + this.backR + "; border-radius:" + this.backR + ";background:" + this.fillStyle + ";border:1px solid " + this.strokeStyle + ";visibility:hidden;position:absolute;display:inline-block;*display:inline;*zoom:1;padding:6px;color:" + this.text.fillStyle + ";line-height:1.5";
            this._tipDom.style.cssText += "; -moz-box-shadow:1px 1px 3px " + this.strokeStyle + "; -webkit-box-shadow:1px 1px 3px " + this.strokeStyle + "; box-shadow:1px 1px 3px " + this.strokeStyle + ";";
            this._tipDom.style.cssText += "; border:none;white-space:nowrap;word-wrap:normal;";
            this.tipDomContainer.appendChild(this._tipDom);
            this._setContent(e);

            /*
            this._tipDom.addEventListener("mouseover" , function(e){
                //console.log("tips-mouseover:"+e.fromTarget)
            });
            this._tipDom.addEventListener("mousemove" , function(e){
                //console.log("tips-mousemove+++targetId:"+e.target.id+"-====currentTargetId"+e.currentTarget.id)
            });
            this._tipDom.addEventListener("mouseout" , function(e){
                //console.log("tips-mouseout")
            });
            */
        }
    }, {
        key: "_removeContent",
        value: function _removeContent() {
            if (!this._tipDom) {
                return;
            }
            this.tipDomContainer.removeChild(this._tipDom);
            this._tipDom = null;
        }
    }, {
        key: "_setContent",
        value: function _setContent(e) {
            if (!this._tipDom) {
                return;
            }
            var tipxContent = this._getContent(e);
            if (tipxContent === "_hide_" || tipxContent === "") {
                this.hide();
                return;
            }

            this._tipDom.innerHTML = tipxContent;
            this.dW = this._tipDom.offsetWidth;
            this.dH = this._tipDom.offsetHeight;
        }
    }, {
        key: "_getContent",
        value: function _getContent(e) {
            //_.extend( this.tipsInfo , (e.tipsInfo || e.eventInfo || {}) );
            var _info = e.tipsInfo || e.eventInfo;
            if (_info) {
                this.tipsInfo = _info;
            }
            //this.tipsInfo = e.tipsInfo || e.eventInfo || {};

            var tipsContent = underscore.isFunction(this.content) ? this.content(this.tipsInfo) : this.content;
            //只有undefined false null才会继续走默认配置， "" 0 都会认为是用户的意思
            if (!tipsContent && tipsContent != 0) {
                tipsContent = this._getDefaultContent(this.tipsInfo);
            }
            return tipsContent;
        }
    }, {
        key: "_getDefaultContent",
        value: function _getDefaultContent(info) {
            var str = "<table style='border:none'>";
            var self = this;
            underscore.each(info.nodesInfoList, function (node, i) {
                str += "<tr style='color:" + (node.color || node.fillStyle || node.strokeStyle) + "'>";
                var tsStyle = "style='border:none;white-space:nowrap;word-wrap:normal;'";
                var prefixName = self.prefix[i];
                if (prefixName) {
                    str += "<td " + tsStyle + ">" + prefixName + "：</td>";
                } else {
                    if (node.field) {
                        str += "<td " + tsStyle + ">" + node.field + "：</td>";
                    }
                }
                str += "<td " + tsStyle + ">" + numAddSymbol(node.value) + "</td></tr>";
            });
            str += "</table>";
            return str;
        }

        /**
         *获取back要显示的x
         *并且校验是否超出了界限
         */

    }, {
        key: "_checkX",
        value: function _checkX(x) {
            if (this.positionInRange) {
                var w = this.dW + 2; //后面的2 是 两边的 linewidth
                if (x < 0) {
                    x = 0;
                }
                if (x + w > this.cW) {
                    x = this.cW - w;
                }
            }
            return x;
        }

        /**
         *获取back要显示的x
         *并且校验是否超出了界限
         */

    }, {
        key: "_checkY",
        value: function _checkY(y) {
            if (this.positionInRange) {
                var h = this.dH + 2; //后面的2 是 两边的 linewidth
                if (y < 0) {
                    y = 0;
                }
                if (y + h > this.cH) {
                    y = this.cH - h;
                }
            }
            return y;
        }
    }]);
    return Tips;
}(component);

var colors = ["#ff8533", "#73ace6", "#82d982", "#e673ac", "#cd6bed", "#8282d9", "#c0e650", "#e6ac73", "#6bcded", "#73e6ac", "#ed6bcd", "#9966cc"];

//单环pie

var Sector$1 = canvax.Shapes.Sector;
var BrokenLine$1 = canvax.Shapes.BrokenLine;
var AnimationFrame$1 = canvax.AnimationFrame;

var Pie$1 = function () {
    function Pie(opt, tipsOpt, domContainer) {
        classCallCheck$1(this, Pie);

        this.data = null;
        this.sprite = null;
        this.branchSp = null;
        this.sectorsSp = null;
        this.checkedSp = null;
        this.branchTxt = null;

        this.dataLabel = {
            enabled: true,
            allowLine: true,
            format: null
        };

        this.checked = {
            enabled: false,
            r: 8,
            globalAlpha: 0.3
        };

        this.tips = underscore.deepExtend({
            enabled: true
        }, tipsOpt); //tip的confit
        this.domContainer = domContainer;
        this._tips = null; //tip的对象 tip的config 放到graphs的config中传递过来
        this.moveDis = undefined;

        this.init(opt);
        this.colorIndex = 0;
        this.sectors = [];
        this.sectorMap = [];
        this.isMoving = false;
        this.labelMaxCount = 15;
        this.labelList = [];
        this.completed = false; //首次加载动画是否完成
    }

    createClass$1(Pie, [{
        key: "init",
        value: function init(opt) {
            underscore.deepExtend(this, opt);
            this.sprite = new canvax.Display.Sprite();

            this.sectorsSp = new canvax.Display.Sprite();
            this.sprite.addChild(this.sectorsSp);

            this.checkedSp = new canvax.Display.Sprite();
            this.sprite.addChild(this.checkedSp);

            this._tips = new Tips(this.tips, this.domContainer);
            this._tips._getDefaultContent = this._getTipDefaultContent;
            this.sprite.addChild(this._tips.sprite);
            if (this.dataLabel.enabled) {
                this.branchSp = new canvax.Display.Sprite();
            }
            this._configData();
            this._configColors();

            this.clear();
        }
    }, {
        key: "clear",
        value: function clear() {
            // this.domContainer.removeChildren()
            this.domContainer.innerHTML = '';
        }
    }, {
        key: "setX",
        value: function setX($n) {
            this.sprite.context.x = $n;
        }
    }, {
        key: "setY",
        value: function setY($n) {
            this.sprite.context.y = $n;
        }

        //配置数据

    }, {
        key: "_configData",
        value: function _configData() {
            var self = this;
            self.total = 0;
            self.angleOffset = underscore.isNaN(self.startAngle) ? -90 : self.startAngle;
            self.angleOffset = self.angleOffset % 360;
            self.currentAngle = 0 + self.angleOffset;
            var limitAngle = 360 + self.angleOffset;
            var adjustFontSize = 12 * self.boundWidth / 1000;
            self.labelFontSize = adjustFontSize < 12 ? 12 : adjustFontSize;
            var percentFixedNum = 2;
            var data = self.data ? self.data.data : [];
            if (self.moveDis === undefined) {
                self.moveDis = self.r / 11;
            }
            if (data.length && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    self.total += data[i].y;
                }
                if (self.total > 0) {
                    var maxIndex = 0;
                    var maxPercentageOffsetIndex = 0;
                    var totalFixedPercent = 0;
                    for (var j = 0; j < data.length; j++) {
                        var percentage = data[j].y / self.total;
                        var fixedPercentage = +(percentage * 100).toFixed(percentFixedNum);
                        var percentageOffset = Math.abs(percentage * 100 - fixedPercentage);
                        totalFixedPercent += fixedPercentage;

                        if (j > 0 && percentage > data[maxIndex].orginPercentage) {
                            maxIndex = j;
                        }

                        if (j > 0 && percentageOffset > data[maxPercentageOffsetIndex].percentageOffset) {
                            maxPercentageOffsetIndex = j;
                        }

                        var angle = 360 * percentage;
                        var endAngle = self.currentAngle + angle > limitAngle ? limitAngle : self.currentAngle + angle;
                        var cosV = Math.cos((self.currentAngle + angle / 2) / 180 * Math.PI);
                        var sinV = Math.sin((self.currentAngle + angle / 2) / 180 * Math.PI);
                        var midAngle = self.currentAngle + angle / 2;
                        cosV = cosV.toFixed(5);
                        sinV = sinV.toFixed(5);
                        var quadrant = function (ang) {
                            if (ang >= limitAngle) {
                                ang = limitAngle;
                            }
                            ang = ang % 360;
                            var angleRatio = parseInt(ang / 90);
                            if (ang >= 0) {
                                switch (angleRatio) {
                                    case 0:
                                        return 1;
                                        break;
                                    case 1:
                                        return 2;
                                        break;
                                    case 2:
                                        return 3;
                                        break;
                                    case 3:
                                    case 4:
                                        return 4;
                                        break;
                                }
                            } else if (ang < 0) {
                                switch (angleRatio) {
                                    case 0:
                                        return 4;
                                        break;
                                    case -1:
                                        return 3;
                                        break;
                                    case -2:
                                        return 2;
                                        break;
                                    case -3:
                                    case -4:
                                        return 1;
                                        break;
                                }
                            }
                        }(midAngle);
                        underscore.extend(data[j], {
                            start: self.currentAngle,
                            end: endAngle,
                            midAngle: midAngle,
                            outOffsetx: self.moveDis * cosV,
                            outOffsety: self.moveDis * sinV,
                            centerx: (self.r - self.moveDis) * cosV,
                            centery: (self.r - self.moveDis) * sinV,
                            outx: (self.r + self.moveDis) * cosV,
                            outy: (self.r + self.moveDis) * sinV,
                            edgex: (self.r + 2 * self.moveDis) * cosV,
                            edgey: (self.r + 2 * self.moveDis) * sinV,
                            orginPercentage: percentage,
                            percentage: fixedPercentage,
                            percentageOffset: percentageOffset,
                            txt: fixedPercentage + '%',
                            quadrant: quadrant,
                            labelDirection: quadrant == 1 || quadrant == 4 ? 1 : 0,
                            index: j,
                            isMax: false,
                            checked: false //是否点击选中
                        });
                        self.currentAngle += angle;
                        if (self.currentAngle > limitAngle) self.currentAngle = limitAngle;
                    }
                    data[maxIndex].isMax = true;
                    //处理保留小数后百分比总和不等于100的情况
                    //总会有除不尽的情况（如1，1，1，每份都是33.33333...，没必要做修正）
                    //var totalPercentOffset = (100 - totalFixedPercent).toFixed(percentFixedNum);
                    //if (totalPercentOffset != 0) {
                    //    data[maxPercentageOffsetIndex].percentage += +totalPercentOffset;
                    //    data[maxPercentageOffsetIndex].percentage = parseFloat(data[maxPercentageOffsetIndex].percentage).toFixed(percentFixedNum);
                    //    data[maxPercentageOffsetIndex].txt = parseFloat(data[maxPercentageOffsetIndex].percentage).toFixed(percentFixedNum) + '%';
                    //};
                }
            }
        }
    }, {
        key: "getList",
        value: function getList() {
            var self = this;
            var list = [];
            if (self.sectors && self.sectors.length > 0) {
                list = self.sectors;
            }
            return list;
        }
    }, {
        key: "getLabelList",
        value: function getLabelList() {
            return this.labelList;
        }
    }, {
        key: "getColorByIndex",
        value: function getColorByIndex(colors$$1, index) {
            if (index >= colors$$1.length) {
                //若数据条数刚好比颜色数组长度大1,会导致最后一个扇形颜色与第一个颜色重复
                if ((this.data.data.length - 1) % colors$$1.length == 0 && index % colors$$1.length == 0) {
                    index = index % colors$$1.length + 1;
                } else {
                    index = index % colors$$1.length;
                }
            }
            return colors$$1[index];
        }
    }, {
        key: "_configColors",
        value: function _configColors() {
            this.colors = this.colors ? this.colors : colors;
        }
    }, {
        key: "draw",
        value: function draw(opt) {
            var self = this;
            self.setX(self.x);
            self.setY(self.y);
            self._widget();
            //this.sprite.context.globalAlpha = 0;      
            if (opt.animation) {
                self.grow();
            }

            if (opt.complete) {
                opt.complete.call(self);
            }
        }
    }, {
        key: "focus",
        value: function focus(index, callback) {
            var self = this;
            var sec = self.sectorMap[index].sector;
            var secData = self.data.data[index];
            secData._selected = true;
            sec.animate({
                x: secData.outOffsetx,
                y: secData.outOffsety
            }, {
                duration: 100,
                onComplete: function onComplete() {
                    //secData.checked = true;
                    callback && callback();
                }
            });
        }
    }, {
        key: "unfocus",
        value: function unfocus(index, callback) {
            var self = this;
            var sec = self.sectorMap[index].sector;
            var secData = self.data.data[index];
            secData._selected = false;
            sec.animate({
                x: 0,
                y: 0
            }, {
                duration: 100,
                onComplete: function onComplete() {
                    callback && callback();
                    //secData.checked = false;
                }
            });
        }
    }, {
        key: "check",
        value: function check(index) {
            var me = this;
            if (!this.sectorMap.length) {
                return;
            }
            var e = {};
            me._geteventInfo(e, index);
            me.checked.checkedBeforCallBack(e);
            if (e.eventInfo.iNode == -1) {
                return;
            }

            var sec = this.sectorMap[index].sector;
            var secData = this.data.data[index];
            if (secData.checked) {
                return;
            }

            if (!secData._selected) {
                this.focus(index, function () {
                    me.addCheckedSec(sec);
                });
            } else {
                this.addCheckedSec(sec);
            }
            secData.checked = true;

            me.checked.checkedCallBack(e);
        }
    }, {
        key: "uncheck",
        value: function uncheck(index) {
            var sec = this.sectorMap[index].sector;
            var secData = this.data.data[index];
            if (!secData.checked) {
                return;
            }
            var me = this;
            me.cancelCheckedSec(sec, function () {
                me.unfocus(index);
            });
            secData.checked = false;

            var e = {};
            me._geteventInfo(e, index);
            me.checked.uncheckedCallBack(e);
        }
    }, {
        key: "uncheckAll",
        value: function uncheckAll() {
            var me = this;
            underscore.each(this.sectorMap, function (sm, i) {
                var sec = sm.sector;
                var secData = me.data.data[i];
                if (secData.checked) {
                    me.uncheck(i);
                    //me.cancelCheckedSec(sec);
                    //secData.checked = false;
                }
            });
        }
    }, {
        key: "grow",
        value: function grow() {
            var self = this;
            var timer = null;
            underscore.each(self.sectors, function (sec, index) {
                if (sec.context) {
                    sec.context.r0 = 0;
                    sec.context.r = 0;
                    sec.context.startAngle = self.angleOffset;
                    sec.context.endAngle = self.angleOffset;
                }
            });

            self._hideGrowLabel();

            AnimationFrame$1.registTween({
                from: {
                    process: 0,
                    r: 0,
                    r0: 0
                },
                to: {
                    process: 1,
                    r: self.r,
                    r0: self.r0
                },
                duration: 500,
                //easing: "Back.In",
                onUpdate: function onUpdate(status) {
                    for (var i = 0; i < self.sectors.length; i++) {
                        var sec = self.sectors[i];
                        var secc = sec.context;
                        if (secc) {
                            secc.r = status.r;
                            secc.r0 = status.r0;
                            secc.globalAlpha = status.process;
                            if (i == 0) {
                                secc.startAngle = sec.startAngle;
                                secc.endAngle = sec.startAngle + (sec.endAngle - sec.startAngle) * status.process;
                            } else {
                                var lastEndAngle = function (index) {
                                    var lastIndex = index - 1;
                                    var lastSecc = self.sectors[lastIndex].context;
                                    if (lastIndex == 0) {
                                        return lastSecc ? lastSecc.endAngle : 0;
                                    }
                                    if (lastSecc) {
                                        return lastSecc.endAngle;
                                    } else {
                                        return arguments.callee(lastIndex);
                                    }
                                }(i);
                                secc.startAngle = lastEndAngle;
                                secc.endAngle = secc.startAngle + (sec.endAngle - sec.startAngle) * status.process;
                            }

                            //如果已经被选中，有一个选中态
                            if (sec.sector._checkedSec) {

                                /*
                                x: secc.x,
                                y: secc.y,
                                r0: secc.r,
                                r: secc.r + 8,
                                startAngle: secc.startAngle,
                                endAngle: secc.startAngle + 0.5, //secc.endAngle,
                                fillStyle: secc.fillStyle,
                                globalAlpha: 0.3
                                */
                                sec.sector._checkedSec.context.r0 = secc.r - 1;
                                sec.sector._checkedSec.context.r = secc.r + self.checked.r;
                                sec.sector._checkedSec.context.startAngle = secc.startAngle;
                                sec.sector._checkedSec.context.endAngle = secc.endAngle;
                            }
                        }
                    }
                },
                onComplete: function onComplete() {
                    self._showGrowLabel();
                    self.completed = true;
                }
            });
        }
    }, {
        key: "_showGrowLabel",
        value: function _showGrowLabel() {
            if (this.branchSp) {
                this.branchSp.context.globalAlpha = 1;
                underscore.each(this.branchSp.children, function (bl) {
                    bl.context.globalAlpha = 1;
                });
                underscore.each(this.labelList, function (lab) {
                    lab.labelEle.style.visibility = "visible";
                });
            }
        }
    }, {
        key: "_hideGrowLabel",
        value: function _hideGrowLabel() {
            if (this.branchSp) {
                //this.branchSp.context.globalAlpha = 0;
                //TODO: 这里canvax有个bug，不能用上面的方法
                underscore.each(this.branchSp.children, function (bl) {
                    bl.context.globalAlpha = 0;
                });
                underscore.each(this.labelList, function (lab) {
                    lab.labelEle.style.visibility = "hidden";
                });
            }
        }
    }, {
        key: "_showTip",
        value: function _showTip(e, ind) {
            this._tips.show(this._geteventInfo(e, ind));
        }
    }, {
        key: "_hideTip",
        value: function _hideTip(e) {
            this._tips.hide(e);
        }
    }, {
        key: "_moveTip",
        value: function _moveTip(e, ind) {
            this._tips.move(this._geteventInfo(e, ind));
        }
    }, {
        key: "_getTipDefaultContent",
        value: function _getTipDefaultContent(info) {
            return "<div style='color:" + info.fillStyle + ";border:none;white-space:nowrap;word-wrap:normal;'><div style='padding-bottom:3px;'>" + info.name + "：" + info.value + "</div>" + parseInt(info.percentage) + "%</div>";
        }
    }, {
        key: "_geteventInfo",
        value: function _geteventInfo(e, ind) {

            var data = this.data.data[ind];
            var fillColor = this.getColorByIndex(this.colors, ind);
            e.eventInfo = {
                iNode: ind,
                name: data.name,
                percentage: data.percentage,
                value: data.y,
                fillStyle: fillColor,
                data: this.data.data[ind],
                checked: data.checked
            };
            return e;
        }
    }, {
        key: "_sectorFocus",
        value: function _sectorFocus(e, index) {
            if (this.sectorMap[index]) {
                if (this.focusCallback && e) {
                    this.focusCallback.focus(e, index);
                }
            }
        }
    }, {
        key: "_sectorUnfocus",
        value: function _sectorUnfocus(e, index) {
            if (this.focusCallback && e) {
                this.focusCallback.unfocus(e, index);
            }
        }
    }, {
        key: "_getByIndex",
        value: function _getByIndex(index) {
            return this.sectorMap[index];
        }
    }, {
        key: "_widgetLabel",
        value: function _widgetLabel(quadrant, indexs, lmin, rmin, isEnd, ySpaceInfo) {
            var self = this;
            var count = 0;
            var data = self.data.data;
            var sectorMap = self.sectorMap;
            var minTxtDis = 15;
            var labelOffsetX = 5;
            var outCircleRadius = self.r + 2 * self.moveDis;
            var currentIndex, baseY, clockwise, isleft, isup, minY, minPercent;
            var currentY, adjustX, txtDis, bkLineStartPoint, bklineMidPoint, bklineEndPoint, brokenline, branchTxt, bwidth, bheight, bx, by;
            var isMixed, yBound, remainingNum, remainingY, adjustY;

            clockwise = quadrant == 2 || quadrant == 4;
            isleft = quadrant == 2 || quadrant == 3;
            isup = quadrant == 3 || quadrant == 4;
            minY = isleft ? lmin : rmin;

            //label的绘制顺序做修正，label的Y值在饼图上半部分（isup）时，Y值越小的先画，反之Y值在饼图下部分时，Y值越大的先画.
            if (indexs.length > 0) {
                indexs.sort(function (a, b) {
                    return isup ? data[a].edgey - data[b].edgey : data[b].edgey - data[a].edgey;
                });
            }

            for (var i = 0; i < indexs.length; i++) {
                currentIndex = indexs[i];
                //若Y值小于最小值，不画label    
                if (data[currentIndex].ignored || data[currentIndex].y < minY || count >= self.labelMaxCount) continue;
                count++;
                currentY = data[currentIndex].edgey;
                adjustX = Math.abs(data[currentIndex].edgex);
                txtDis = currentY - baseY;

                if (i != 0 && (Math.abs(txtDis) < minTxtDis || isup && txtDis < 0 || !isup && txtDis > 0)) {
                    currentY = isup ? baseY + minTxtDis : baseY - minTxtDis;
                    if (outCircleRadius - Math.abs(currentY) > 0) {
                        adjustX = Math.sqrt(Math.pow(outCircleRadius, 2) - Math.pow(currentY, 2));
                    }

                    if (isleft && -adjustX > data[currentIndex].edgex || !isleft && adjustX < data[currentIndex].edgex) {
                        adjustX = Math.abs(data[currentIndex].edgex);
                    }
                }

                if (isEnd) {
                    yBound = isleft ? ySpaceInfo.left : ySpaceInfo.right;
                    remainingNum = indexs.length - i;
                    remainingY = isup ? yBound - remainingNum * minTxtDis : yBound + remainingNum * minTxtDis;
                    if (isup && currentY > remainingY || !isup && currentY < remainingY) {
                        currentY = remainingY;
                    }
                }

                bkLineStartPoint = [data[currentIndex].outx, data[currentIndex].outy];
                bklineMidPoint = [isleft ? -adjustX : adjustX, currentY];
                bklineEndPoint = [isleft ? -adjustX - labelOffsetX : adjustX + labelOffsetX, currentY];
                baseY = currentY;
                if (!isEnd) {
                    if (isleft) {
                        ySpaceInfo.left = baseY;
                    } else {
                        ySpaceInfo.right = baseY;
                    }
                }

                //指示线
                brokenline = new BrokenLine$1({
                    context: {
                        lineType: 'solid',
                        smooth: false,
                        pointList: [[data[currentIndex].centerx, data[currentIndex].centery], [data[currentIndex].outx, data[currentIndex].outy], bkLineStartPoint, bklineMidPoint, bklineEndPoint],
                        lineWidth: 1,
                        strokeStyle: sectorMap[currentIndex].color
                    }
                });
                window.bl = brokenline;
                //指示文字
                var labelTxt = '';
                var formatReg = /\{.+?\}/g;
                var point = data[currentIndex];
                if (self.dataLabel.format) {
                    if (underscore.isFunction(self.dataLabel.format)) {
                        labelTxt = this.dataLabel.format(data[currentIndex]);
                    } else {
                        labelTxt = self.dataLabel.format.replace(formatReg, function (match, index) {
                            var matchStr = match.replace(/\{([\s\S]+?)\}/g, '$1');
                            var vals = matchStr.split('.');
                            //var obj = eval(vals[0]);
                            var obj = new Function('return ' + vals[0])();
                            var pro = vals[1];
                            return obj[pro];
                        });
                        if (labelTxt) {
                            labelTxt = "<span>" + labelTxt + "</span>";
                        }
                    }
                }
                labelTxt || (labelTxt = "<span>" + data[currentIndex].name + ' : ' + data[currentIndex].txt + "</span>");

                branchTxt = document.createElement("div");
                branchTxt.style.cssText = " ;position:absolute;left:-1000px;top:-1000px;color:" + sectorMap[currentIndex].color + "";
                branchTxt.innerHTML = labelTxt;
                self.domContainer.appendChild(branchTxt);
                bwidth = branchTxt.offsetWidth;
                bheight = branchTxt.offsetHeight;

                this.branchTxt = branchTxt;
                //branchTxt.style.display = "none"

                bx = isleft ? -adjustX : adjustX;
                by = currentY;

                switch (quadrant) {
                    case 1:
                        bx += labelOffsetX;
                        by -= bheight / 2;
                        break;
                    case 2:
                        bx -= bwidth + labelOffsetX;
                        by -= bheight / 2;
                        break;
                    case 3:
                        bx -= bwidth + labelOffsetX;
                        by -= bheight / 2;
                        break;
                    case 4:
                        bx += labelOffsetX;
                        by -= bheight / 2;
                        break;
                }

                branchTxt.style.left = bx + self.x + "px";
                branchTxt.style.top = by + self.y + "px";

                if (self.dataLabel.allowLine) {
                    self.branchSp.addChild(brokenline);
                }

                self.sectorMap[currentIndex].label = {
                    line: brokenline,
                    label: branchTxt,
                    visible: true
                };

                self.labelList.push({
                    width: bwidth,
                    height: bheight,
                    x: bx + self.x,
                    y: by + self.y,
                    data: data[currentIndex],
                    labelTxt: labelTxt,
                    labelEle: branchTxt
                });
            }
        }
    }, {
        key: "_showLabelAll",
        value: function _showLabelAll(ind) {
            var me = this;
            underscore.each(this.sectorMap, function (sec, i) {
                me._showLabel(i);
            });
        }
    }, {
        key: "_hideLabelAll",
        value: function _hideLabelAll(ind) {
            var me = this;
            underscore.each(this.sectorMap, function (sec, i) {
                me._hideLabel(i);
            });
        }
    }, {
        key: "_hideLabel",
        value: function _hideLabel(index) {
            if (this.sectorMap[index]) {
                var label = this.sectorMap[index].label;
                label.line.context.visible = false;
                label.label.style.display = "none";
                label.visible = false;
            }
        }
    }, {
        key: "_showLabel",
        value: function _showLabel(index) {
            if (this.sectorMap[index]) {
                var label = this.sectorMap[index].label;
                label.line.context.visible = true;
                label.label.style.display = "block";
                label.visible = true;
            }
        }
    }, {
        key: "_startWidgetLabel",
        value: function _startWidgetLabel() {
            var self = this;
            var data = self.data.data;
            var rMinPercentage = 0,
                lMinPercentage = 0,
                rMinY = 0,
                lMinY = 0;
            var quadrantsOrder = [];
            var quadrantInfo = [{
                indexs: [],
                count: 0
            }, {
                indexs: [],
                count: 0
            }, {
                indexs: [],
                count: 0
            }, {
                indexs: [],
                count: 0
            }];
            //默认从top开始画
            var widgetInfo = {
                right: {
                    startQuadrant: 4,
                    endQuadrant: 1,
                    clockwise: true,
                    indexs: []
                },
                left: {
                    startQuadrant: 3,
                    endQuadrant: 2,
                    clockwise: false,
                    indexs: []
                }
            };
            for (var i = 0; i < data.length; i++) {
                var cur = data[i].quadrant;
                quadrantInfo[cur - 1].indexs.push(i);
                quadrantInfo[cur - 1].count++;
            }

            //1,3象限的绘制顺序需要反转
            if (quadrantInfo[0].count > 1) quadrantInfo[0].indexs.reverse();
            if (quadrantInfo[2].count > 1) quadrantInfo[2].indexs.reverse();

            if (quadrantInfo[0].count > quadrantInfo[3].count) {
                widgetInfo.right.startQuadrant = 1;
                widgetInfo.right.endQuadrant = 4;
                widgetInfo.right.clockwise = false;
            }

            if (quadrantInfo[1].count > quadrantInfo[2].count) {
                widgetInfo.left.startQuadrant = 2;
                widgetInfo.left.endQuadrant = 3;
                widgetInfo.left.clockwise = true;
            }

            widgetInfo.right.indexs = quadrantInfo[widgetInfo.right.startQuadrant - 1].indexs.concat(quadrantInfo[widgetInfo.right.endQuadrant - 1].indexs);
            widgetInfo.left.indexs = quadrantInfo[widgetInfo.left.startQuadrant - 1].indexs.concat(quadrantInfo[widgetInfo.left.endQuadrant - 1].indexs);

            var overflowIndexs, sortedIndexs;

            if (widgetInfo.right.indexs.length > self.labelMaxCount) {
                sortedIndexs = widgetInfo.right.indexs.slice(0);
                sortedIndexs.sort(function (a, b) {
                    return data[b].y - data[a].y;
                });
                overflowIndexs = sortedIndexs.slice(self.labelMaxCount);
                rMinPercentage = data[overflowIndexs[0]].percentage;
                rMinY = data[overflowIndexs[0]].y;
            }
            if (widgetInfo.left.indexs.length > self.labelMaxCount) {
                sortedIndexs = widgetInfo.left.indexs.slice(0);
                sortedIndexs.sort(function (a, b) {
                    return data[b].y - data[a].y;
                });
                overflowIndexs = sortedIndexs.slice(self.labelMaxCount);
                lMinPercentage = data[overflowIndexs[0]].percentage;
                lMinY = data[overflowIndexs[0]].y;
            }

            quadrantsOrder.push(widgetInfo.right.startQuadrant);
            quadrantsOrder.push(widgetInfo.right.endQuadrant);
            quadrantsOrder.push(widgetInfo.left.startQuadrant);
            quadrantsOrder.push(widgetInfo.left.endQuadrant);

            var ySpaceInfo = {};

            for (var i = 0; i < quadrantsOrder.length; i++) {
                var isEnd = i == 1 || i == 3;
                self._widgetLabel(quadrantsOrder[i], quadrantInfo[quadrantsOrder[i] - 1].indexs, lMinY, rMinY, isEnd, ySpaceInfo);
            }
        }
    }, {
        key: "_getAngleTime",
        value: function _getAngleTime(secc) {
            return Math.abs(secc.startAngle - secc.endAngle) / 360 * 500;
        }
    }, {
        key: "addCheckedSec",
        value: function addCheckedSec(sec, callback) {
            var secc = sec.context;
            var sector = new Sector$1({
                context: {
                    x: secc.x,
                    y: secc.y,
                    r0: secc.r - 1,
                    r: secc.r + this.checked.r,
                    startAngle: secc.startAngle,
                    endAngle: secc.startAngle, //secc.endAngle,
                    fillStyle: secc.fillStyle,
                    globalAlpha: this.checked.globalAlpha
                },
                id: 'checked_' + sec.id
            });
            sec._checkedSec = sector;

            this.checkedSp.addChild(sector);

            if (this.completed) {
                sector.animate({
                    endAngle: secc.endAngle
                }, {
                    duration: this._getAngleTime(secc),
                    onComplete: function onComplete() {
                        callback && callback();
                    }
                });
            } else {
                sector.context.endAngle = secc.endAngle;
            }
        }
    }, {
        key: "cancelCheckedSec",
        value: function cancelCheckedSec(sec, callback) {
            //var checkedSec = this.checkedSp.getChildById('checked_' + sec.id);
            var checkedSec = sec._checkedSec;

            checkedSec.animate({
                //endAngle : checkedSec.context.startAngle+0.5
                startAngle: checkedSec.context.endAngle - 0.3
            }, {
                onComplete: function onComplete() {
                    delete sec._checkedSec;
                    checkedSec.destroy();
                    callback && callback();
                },
                duration: 150
            });
        }
    }, {
        key: "_widget",
        value: function _widget() {
            var self = this;
            var data = self.data ? self.data.data : [];
            var moreSecData;
            if (data.length > 0 && self.total > 0) {
                self.branchSp && self.sprite.addChild(self.branchSp);
                for (var i = 0; i < data.length; i++) {
                    if (self.colorIndex >= self.colors.length) self.colorIndex = 0;
                    var fillColor = self.getColorByIndex(self.colors, i);
                    //扇形主体          
                    var sector = new Sector$1({
                        hoverClone: false,
                        context: {
                            x: data[i].sliced ? data[i].outOffsetx : 0,
                            y: data[i].sliced ? data[i].outOffsety : 0,
                            r0: self.r0,
                            r: self.r,
                            startAngle: data[i].start,
                            endAngle: data[i].end,
                            fillStyle: fillColor,
                            index: data[i].index,
                            cursor: "pointer"
                        },
                        id: 'sector' + i
                    });
                    sector.__data = data[i];
                    sector.__colorIndex = i;
                    sector.__dataIndex = i;
                    sector.__isSliced = data[i].sliced;
                    //扇形事件
                    self.event.enabled && sector.hover(function (e) {

                        var me = this;
                        if (self.tips.enabled) {
                            self._showTip(e, this.__dataIndex);
                        }
                        var secData = self.data.data[this.__dataIndex];
                        if (!secData.checked) {
                            self._sectorFocus(e, this.__dataIndex);
                            self.focus(this.__dataIndex);
                        }
                    }, function (e) {

                        if (self.tips.enabled) {
                            self._hideTip(e);
                        }

                        //上面的_showTip会设置一下eventInfo，所以这里必须显式的调用下_geteventInfo来设置一下eventInfo
                        self._geteventInfo(e, this.__dataIndex);
                        var secData = self.data.data[this.__dataIndex];
                        if (!secData.checked) {
                            self._sectorUnfocus(e, this.__dataIndex);
                            self.unfocus(this.__dataIndex);
                        }
                    });

                    self.event.enabled && sector.on('mousedown mouseup click mousemove dblclick', function (e) {
                        self._geteventInfo(e, this.__dataIndex);
                        if (e.type == "click") {
                            self.secClick(this, e);
                        }
                        if (e.type == "mousemove") {
                            if (self.tips.enabled) {
                                self._moveTip(e, this.__dataIndex);
                            }
                        }
                    });

                    if (!data[i].ignored) {
                        self.sectorsSp.addChildAt(sector, 0);
                    }

                    moreSecData = {
                        name: data[i].name,
                        value: data[i].y,
                        sector: sector,
                        context: sector.context,
                        originx: sector.context.x,
                        originy: sector.context.y,
                        r: self.r,
                        startAngle: sector.context.startAngle,
                        endAngle: sector.context.endAngle,
                        color: fillColor,
                        index: i,
                        percentage: data[i].percentage,
                        visible: true
                    };

                    self.sectors.push(moreSecData);
                }

                if (self.sectors.length > 0) {
                    //self.sectorMap = {};
                    self.sectorMap = [];
                    for (var i = 0; i < self.sectors.length; i++) {
                        self.sectorMap[self.sectors[i].index] = self.sectors[i];
                    }
                }
                if (self.dataLabel.enabled) {
                    self._startWidgetLabel();
                }
            }
        }
    }, {
        key: "secClick",
        value: function secClick(sectorEl, e) {
            if (!this.checked.enabled) return;

            this.checked.checkedBeforCallBack(e);
            if (e.eventInfo.iNode == -1) {
                return;
            }

            var secData = this.data.data[sectorEl.__dataIndex];
            if (sectorEl.clickIng) {
                return;
            }
            sectorEl.clickIng = true;
            secData.checked = !secData.checked;
            e.eventInfo.checked = secData.checked;

            if (secData.checked) {
                this.addCheckedSec(sectorEl, function () {
                    sectorEl.clickIng = false;
                });
                this.checked.checkedCallBack(e);
            } else {
                this.cancelCheckedSec(sectorEl, function () {
                    sectorEl.clickIng = false;
                });
                this.checked.uncheckedCallBack(e);
            }
        }
    }]);
    return Pie;
}();

var Circle$1 = canvax.Shapes.Circle;

var Legend = function (_Component) {
    inherits$1(Legend, _Component);

    function Legend(data, opt) {
        classCallCheck$1(this, Legend);

        /* data的数据结构为
        [
        {field: "uv", fillStyle: "#ff8533", activate: true} //外部只需要传field和fillStyle就行了 activate是内部状态
        ]
        */
        var _this = possibleConstructorReturn$1(this, (Legend.__proto__ || Object.getPrototypeOf(Legend)).call(this));

        _this.data = data || [];

        _this.width = 0;
        _this.height = 0;
        _this.tag = {
            height: 20
        };

        _this.icon = {
            r: 5,
            lineWidth: 1,
            fillStyle: "#999"
        };

        _this.tips = {
            enabled: false
        };

        _this.onChecked = function () {};
        _this.onUnChecked = function () {};

        _this._labelColor = "#999";

        //this.label = null; // label 格式化函数配置

        _this.layoutType = "h"; //横向 horizontal--> h

        _this.sprite = null;

        _this.init(opt);
        return _this;
    }

    createClass$1(Legend, [{
        key: "init",
        value: function init(opt) {
            if (opt) {
                underscore.deepExtend(this, opt);
            }
            this.sprite = new canvax.Display.Sprite({
                id: "LegendSprite"
            });

            this._widget();
        }
    }, {
        key: "pos",
        value: function pos(_pos) {
            _pos.x && (this.sprite.context.x = _pos.x);
            _pos.y && (this.sprite.context.y = _pos.y);
        }
    }, {
        key: "draw",
        value: function draw(opt) {
            //this._widget();
        }
    }, {
        key: "_showTips",
        value: function _showTips(e) {
            if (!this.tips.enabled) return;

            if (this._hideTimer) {
                clearTimeout(this._hideTimer);
            }
            this._hideTimer = null;

            if (!this._legendTip) {
                this._legendTip = new canvax.Display.Sprite({
                    id: 'legend_tip'
                });
                var stage = this.sprite.getStage();
                stage.addChild(this._legendTip);
                this._tips = new Tips(this.tips, stage.parent.domView);
                this._tips._getDefaultContent = function (info) {
                    return info.field;
                };
                this._legendTip.addChild(this._tips.sprite);
            }
            this._tips.show(e);
        }
    }, {
        key: "_hideTips",
        value: function _hideTips(e) {
            var me = this;
            this._hideTimer = setTimeout(function () {
                me._tips.hide();
            }, 300);
        }

        // label 格式化函数配置

    }, {
        key: "label",
        value: function label(info) {
            return info.field;
        }
    }, {
        key: "setStyle",
        value: function setStyle(field, style) {
            var me = this;
            underscore.each(this.data, function (obj, i) {
                if (obj.field == field) {
                    if (style.fillStyle) {
                        obj.fillStyle = style.fillStyle;
                        var icon = me.sprite.getChildById("lenend_field_" + i).getChildById("lenend_field_icon_" + i);
                        icon.context.fillStyle = style.fillStyle;
                    }
                }
            });
        }
    }, {
        key: "getStyle",
        value: function getStyle(field) {
            var me = this;
            var data = null;
            underscore.each(this.data, function (obj, i) {
                if (obj.field == field) {
                    data = obj;
                }
            });
            return data;
        }
    }, {
        key: "_widget",
        value: function _widget() {
            var me = this;

            var width = 0,
                height = 0;
            underscore.each(this.data, function (obj, i) {

                //如果外面没有设置过，就默认为激活状态
                if (obj.activate == undefined || obj.activate) {
                    obj.activate = true;
                } else {
                    obj.activate = false;
                }

                var icon = new Circle$1({
                    id: "lenend_field_icon_" + i,
                    context: {
                        x: 0,
                        y: me.tag.height / 2,
                        fillStyle: obj.activate ? "#ccc" : obj.fillStyle || me._labelColor,
                        r: me.icon.r,
                        cursor: "pointer"
                    }
                });

                icon.hover(function (e) {
                    me._showTips(me._getInfoHandler(e, obj));
                }, function (e) {
                    me._hideTips(e);
                });
                icon.on("mousemove", function (e) {
                    me._showTips(me._getInfoHandler(e, obj));
                });

                icon.on("click", function () {});

                var content = me.label(obj);
                var txt = new canvax.Display.Text(content, {
                    id: "lenend_field_txt_" + i,
                    context: {
                        x: me.icon.r + 3,
                        y: me.tag.height / 2,
                        textAlign: "left",
                        textBaseline: "middle",
                        fillStyle: "#333", //obj.fillStyle
                        cursor: "pointer"
                    }
                });

                txt.hover(function (e) {
                    me._showTips(me._getInfoHandler(e, obj));
                }, function (e) {
                    me._hideTips(e);
                });
                txt.on("mousemove", function (e) {
                    me._showTips(me._getInfoHandler(e, obj));
                });
                txt.on("click", function () {});

                var txtW = txt.getTextWidth();
                var itemW = txtW + me.icon.r * 2 + 20;

                var spItemC = {
                    height: me.tag.height
                };

                if (me.layoutType == "v") {
                    height += me.tag.height;
                    spItemC.y = height;
                    width = Math.max(width, itemW);
                } else {
                    height = me.tag.height;
                    spItemC.x = width;
                    width += itemW;
                }
                var sprite = new canvax.Display.Sprite({
                    id: "lenend_field_" + i,
                    context: spItemC
                });
                sprite.addChild(icon);
                sprite.addChild(txt);

                sprite.context.width = itemW;
                me.sprite.addChild(sprite);

                sprite.on("click", function (e) {

                    //只有一个field的时候，不支持取消
                    if (underscore.filter(me.data, function (obj) {
                        return obj.activate;
                    }).length == 1) {
                        if (obj.activate) {
                            return;
                        }
                    }

                    icon.context.fillStyle = obj.activate ? "#ccc" : obj.fillStyle || me._labelColor;
                    obj.activate = !obj.activate;
                    if (obj.activate) {
                        me.onChecked(obj.field);
                    } else {
                        me.onUnChecked(obj.field);
                    }
                });
            });

            //向后兼容有
            me.width = me.sprite.context.width = width;
            me.height = me.sprite.context.height = height;
        }
    }, {
        key: "_getInfoHandler",
        value: function _getInfoHandler(e, data) {
            e.eventInfo = {
                field: data.field,
                fillStyle: data.fillStyle
            };
            return e;
        }
    }]);
    return Legend;
}(component);

var _class = function (_Chart) {
    inherits$1(_class, _Chart);

    function _class(node, data, opts) {
        classCallCheck$1(this, _class);

        var _this = possibleConstructorReturn$1(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, node, data, opts));
        // this.element = node;


        _this.type = "pie";

        _this.data = data;
        _this.ignoreFields = [];
        _this._opts = opts;
        _this.options = opts;
        _this.event = {
            enabled: true
        };
        _this.xAxis = {
            field: null
        };
        _this.yAxis = {
            field: null
        };
        underscore.deepExtend(_this, opts);

        _this.dataFrame = _this._initData(data, _this);
        _this._setLengend();

        _this.stageBg = new canvax.Display.Sprite({
            id: 'bg'
        });
        _this.core = new canvax.Display.Sprite({
            id: 'core'
        });
        _this.stageTip = new canvax.Display.Stage({
            id: 'stageTip'
        });
        _this.canvax.addChild(_this.stageTip);
        _this.stageTip.toFront();

        _this.draw();
        return _this;
    }

    createClass$1(_class, [{
        key: "draw",
        value: function draw() {
            this._initModule(); //初始化模块
            this._startDraw(); //开始绘图
            this._drawEnd(); //绘制结束，添加到舞台  
            this.inited = true;
        }
    }, {
        key: "getByIndex",
        value: function getByIndex() {
            return this._pie._getByIndex(index);
        }
    }, {
        key: "getList",
        value: function getList() {
            var self = this;
            var list = [];
            var item;
            if (self._pie) {
                var sectorList = self._pie.getList();
                if (sectorList.length > 0) {
                    for (var i = 0; i < sectorList.length; i++) {
                        item = sectorList[i];
                        var idata = self._pie.data.data[i];

                        list.push({
                            name: item.name,
                            index: item.index,
                            iNode: item.index, //和上面一样的意思，向后兼容，后面慢慢取消掉index
                            color: item.color,
                            r: item.r,
                            value: item.value,
                            percentage: item.percentage,
                            checked: idata.checked
                        });
                    }
                }
            }
            return list;
        }
    }, {
        key: "getCheckedList",
        value: function getCheckedList() {
            var cl = [];
            underscore.each(this.getList(), function (item) {
                if (item.checked) {
                    cl.push(item);
                }
            });
            return cl;
        }
    }, {
        key: "focusAt",
        value: function focusAt(index) {
            if (this._pie) {
                this._pie.focus(index);
            }
        }
    }, {
        key: "unfocusAt",
        value: function unfocusAt(index) {
            if (this._pie) {
                this._pie.unfocus(index);
            }
        }
    }, {
        key: "checkAt",
        value: function checkAt(index) {
            if (this._pie) {
                this._pie.check(index);
            }
        }
    }, {
        key: "uncheckAt",
        value: function uncheckAt(index) {
            if (this._pie) {
                this._pie.uncheck(index);
            }
        }
    }, {
        key: "uncheckAll",
        value: function uncheckAll() {
            if (this._pie) {
                this._pie.uncheckAll();
            }
        }
    }, {
        key: "checkOf",
        value: function checkOf(xvalue) {
            this.checkAt(this.getIndexOf(xvalue));
        }
    }, {
        key: "uncheckOf",
        value: function uncheckOf(xvalue) {
            this.uncheckAt(this.getIndexOf(xvalue));
        }
    }, {
        key: "getLabelList",
        value: function getLabelList() {
            return this._pie.getLabelList();
        }
    }, {
        key: "showLabelAt",
        value: function showLabelAt(index) {
            this._pie && this._pie._showLabel(index);
        }
    }, {
        key: "hideLabelAt",
        value: function hideLabelAt(index) {
            this._pie && this._pie._hideLabel(index);
        }
    }, {
        key: "showLabelOf",
        value: function showLabelOf(xvalue) {
            this.showLabelAt(this.getIndexOf(xvalue));
        }
    }, {
        key: "hideLabelOf",
        value: function hideLabelOf(xvalue) {
            this.hideLabelAt(this.getIndexOf(xvalue));
        }
    }, {
        key: "showLabelAll",
        value: function showLabelAll() {
            var me = this;
            underscore.each(this.getLabelList(), function (label, i) {
                me.showLabelAt(i);
            });
        }
    }, {
        key: "hideLabelAll",
        value: function hideLabelAll() {
            var me = this;
            underscore.each(this.getLabelList(), function (label, i) {
                me.hideLabelAt(i);
            });
        }
    }, {
        key: "getIndexOf",
        value: function getIndexOf(xvalue) {
            var i;
            var list = this.getList();
            for (var ii = 0, il = list.length; ii < il; ii++) {
                if (list[ii].name == xvalue) {
                    i = ii;
                    break;
                }
            }
            return i;
        }
    }, {
        key: "_initData",
        value: function _initData(arr, opt) {
            if (!arr || arr.length == 0) {
                return dataFrame;
            }

            //检测第一个数据是否为一个array, 否就是传入了一个json格式的数据
            if (arr.length > 0 && !underscore.isArray(arr[0])) {
                arr = parse2MatrixData(arr);
            }

            var data = [];
            var arr = underscore.clone(arr);

            /*
            * @释剑
            * 用校正处理， 把pie的data入参规范和chartx数据格式一致
            **/
            if (!this.xAxis.field) {
                data = arr;
            } else {

                var titles = arr.shift();
                var xFieldInd = underscore.indexOf(titles, this.xAxis.field);
                var yFieldInd = xFieldInd + 1;
                if (yFieldInd >= titles.length) {
                    yFieldInd = 0;
                }
                if (this.yAxis.field) {
                    yFieldInd = underscore.indexOf(titles, this.yAxis.field);
                }
                underscore.each(arr, function (row) {
                    var rowData = [];
                    if (underscore.isArray(row)) {
                        rowData.push(row[xFieldInd]);
                        rowData.push(row[yFieldInd]);
                    } else if ((typeof row === "undefined" ? "undefined" : _typeof$1(row)) == 'object') {
                        rowData.push(row['name']);
                        rowData.push(row['y']);
                    }
                    data.push(rowData);
                });
            }

            //矫正结束                    
            var dataFrame = {};
            dataFrame.org = data;
            dataFrame.data = [];
            if (underscore.isArray(data)) {
                for (var i = 0; i < data.length; i++) {
                    var obj = {};
                    if (underscore.isArray(data[i])) {

                        obj.name = data[i][0];
                        obj.y = parseFloat(data[i][1]);
                        obj.sliced = false;
                        obj.selected = false;
                    } else if (_typeof$1(data[i]) == 'object') {

                        obj.name = data[i].name;
                        obj.y = parseFloat(data[i].y);
                        obj.sliced = data[i].sliced || false;
                        obj.selected = data[i].selected || false;
                    }

                    if (obj.name) dataFrame.data.push(obj);
                }
            }
            if (data.length > 0 && opt.sort == 'asc' || opt.sort == 'desc') {
                dataFrame.org.sort(function (a, b) {
                    if (opt.sort == 'desc') {
                        return a[1] - b[1];
                    } else if (opt.sort == 'asc') {
                        return b[1] - a[1];
                    }
                });
                dataFrame.data.sort(function (a, b) {
                    if (opt.sort == 'desc') {
                        return a.y - b.y;
                    } else if (opt.sort == 'asc') {
                        return b.y - a.y;
                    }
                });
            }

            if (dataFrame.data.length > 0) {
                for (var i = 0; i < dataFrame.data.length; i++) {
                    if (underscore.contains(this.ignoreFields, dataFrame.data[i].name)) {
                        dataFrame.data[i].ignored = true;
                        dataFrame.data[i].y = 0;
                    }
                }
            }

            return dataFrame;
        }
    }, {
        key: "clear",
        value: function clear() {
            this.stageBg.removeAllChildren();
            this.core.removeAllChildren();
            this.stageTip.removeAllChildren();
        }
    }, {
        key: "reset",
        value: function reset(obj) {
            obj = obj || {};
            this.clear();
            this._pie.clear();
            var data = obj.data || this.data;
            underscore.deepExtend(this, obj.options);
            this.dataFrame = this._initData(data, this.options);
            this.draw();
        }
    }, {
        key: "_initModule",
        value: function _initModule() {
            var self = this;
            var w = self.width;
            var h = self.height;
            w -= this.padding.left + this.padding.right;
            h -= this.padding.top + this.padding.bottom;

            var r = Math.min(w, h) * 2 / 3 / 2;
            if (self.dataLabel && self.dataLabel.enabled == false) {
                r = Math.min(w, h) / 2;
                //要预留moveDis位置来hover sector 的时候外扩
                r -= r / 11;
            }
            r = parseInt(r);

            //某些情况下容器没有高宽等，导致r计算为负数，会报错
            if (r < 0) {
                r = 1;
            }

            var r0 = parseInt(self.innerRadius || 0);
            var maxInnerRadius = r - 10;
            r0 = r0 >= 0 ? r0 : 0;
            r0 = r0 <= maxInnerRadius ? r0 : maxInnerRadius;
            if (r0 < 0) {
                r0 = 0;
            }

            var pieX = w / 2 + this.padding.left;
            var pieY = h / 2 + this.padding.top;
            self.pie = {
                x: pieX,
                y: pieY,
                r0: r0,
                r: r,
                boundWidth: w,
                boundHeight: h,
                data: self.dataFrame,
                //dataLabel: self.dataLabel, 
                animation: self.animation,
                event: self.event,
                startAngle: parseInt(self.startAngle),
                colors: self.colors,
                focusCallback: {
                    focus: function focus(e, index) {
                        self.fire('focus', e);
                    },
                    unfocus: function unfocus(e, index) {
                        self.fire('unfocus', e);
                    }
                },
                moveDis: self.moveDis,
                checked: self.checked ? underscore.extend({
                    enabled: true,
                    checkedCallBack: function checkedCallBack(e) {
                        self.fire("checked", e);
                    },
                    checkedBeforCallBack: function checkedBeforCallBack(e) {
                        self.fire("checkedBefor", e);
                    },
                    uncheckedCallBack: function uncheckedCallBack(e) {
                        self.fire("unchecked", e);
                    }
                }, self.checked) : { enabled: false }
            };

            if (self.dataLabel) {
                self.pie.dataLabel = self.dataLabel;
            }

            self._pie = new Pie$1(self.pie, self.tips, self.canvax.domView);

            self.event.enabled && self._pie.sprite.on("mousedown mousemove mouseup click dblclick", function (e) {
                self.fire(e.type, e);
            });
        }
    }, {
        key: "_startDraw",
        value: function _startDraw() {
            this._pie.draw(this);
            var me = this;
            //如果有legend，调整下位置,和设置下颜色
            if (this._legend && !this._legend.inited) {
                underscore.each(this.getList(), function (item, i) {
                    var ffill = item.color;
                    me._legend.setStyle(item.name, { fillStyle: ffill });
                });
                this._legend.inited = true;
            }
        }
    }, {
        key: "_drawEnd",
        value: function _drawEnd() {
            this.core.addChild(this._pie.sprite);
            if (this._tip) this.stageTip.addChild(this._tip.sprite);
            this.fire('complete', {
                data: this.getList()
            });
            this.stage.addChild(this.core);
        }
    }, {
        key: "remove",
        value: function remove(field) {
            var me = this;
            var data = me.data;
            if (field && data.length > 1) {
                for (var i = 1; i < data.length; i++) {
                    if (data[i][0] == field && !underscore.contains(me.ignoreFields, field)) {
                        me.ignoreFields.push(field);
                        //console.log(me.ignoreFields.toString());
                    }
                }
            }
            me.reset();
        }
    }, {
        key: "add",
        value: function add(field) {
            var me = this;
            var data = me.data;
            if (field && data.length > 1) {
                for (var i = 1; i < data.length; i++) {
                    if (data[i][0] == field && underscore.contains(me.ignoreFields, field)) {
                        me.ignoreFields.splice(underscore.indexOf(me.ignoreFields, field), 1);
                    }
                }
            }
            me.reset();
        }

        //设置图例 begin

    }, {
        key: "_setLengend",
        value: function _setLengend() {
            var me = this;
            if (!this.legend || this.legend && "enabled" in this.legend && !this.legend.enabled) return;
            //设置legendOpt
            var legendOpt = underscore.deepExtend({
                legend: true,
                label: function label(info) {
                    return info.field;
                },
                onChecked: function onChecked(field) {
                    me.add(field);
                },
                onUnChecked: function onUnChecked(field) {
                    me.remove(field);
                },
                layoutType: "v"
            }, this._opts.legend);
            this._legend = new Legend(this._getLegendData(), legendOpt);
            this.stage.addChild(this._legend.sprite);
            this._legend.pos({
                x: this.width - this._legend.width,
                y: this.height / 2 - this._legend.h / 2
            });

            this.padding.right += this._legend.width;
        }
    }, {
        key: "_getLegendData",
        value: function _getLegendData() {
            var me = this;
            var data = [];
            underscore.each(this.dataFrame.data, function (obj, i) {
                data.push({
                    field: obj.name,
                    value: obj.y,
                    fillStyle: null
                });
            });

            return data;
        }
    }]);
    return _class;
}(Chart);

var Line$1 = canvax.Shapes.Line;
var Rect$2 = canvax.Shapes.Rect;

var dataZoom = function (_Component) {
    inherits$1(dataZoom, _Component);

    function dataZoom(opt) {
        classCallCheck$1(this, dataZoom);

        //0-1
        var _this = possibleConstructorReturn$1(this, (dataZoom.__proto__ || Object.getPrototypeOf(dataZoom)).call(this));

        _this.range = {
            start: 0,
            end: '',
            max: 1,
            min: 0
        };
        _this.count = 1;
        _this.pos = {
            x: 0,
            y: 0
        };
        _this.left = {
            eventEnabled: true
        };
        _this.right = {
            eventEnabled: true
        };
        _this.center = {
            fillStyle: '#ffffff',
            globalAlpha: 0
        };

        _this.w = 0;
        _this.h = 40;

        _this.color = opt.color || "#008ae6";

        _this.bg = {
            enabled: true,
            fillStyle: "",
            strokeStyle: "#e6e6e6",
            lineWidth: 1
        };

        _this.underline = {
            enabled: true,
            strokeStyle: _this.color,
            lineWidth: 2
        };

        _this.dragIng = function () {};
        _this.dragEnd = function () {};

        _this.range.max = 0;
        _this.range.end = 0;
        _this.disPart = {};
        _this.barAddH = 8;
        _this.barH = _this.h - _this.barAddH;
        _this.barY = 6 / 2;
        _this.btnW = 8;
        _this.btnFillStyle = _this.color;
        _this._btnLeft = null;
        _this._btnRight = null;
        _this._underline = null;

        _this.zoomBg = null;

        opt && underscore.deepExtend(_this, opt);
        _this._computeAttrs(opt);
        _this.init(opt);
        return _this;
    }

    createClass$1(dataZoom, [{
        key: "init",
        value: function init(opt) {
            var me = this;
            me.sprite = new canvax.Display.Sprite({
                id: "dataZoom",
                context: {
                    x: me.pos.x,
                    y: me.pos.y
                }
            });
            me.sprite.noSkip = true;
            me.dataZoomBg = new canvax.Display.Sprite({
                id: "dataZoomBg"
            });
            me.dataZoomBtns = new canvax.Display.Sprite({
                id: "dataZoomBtns"
            });
            me.sprite.addChild(me.dataZoomBg);
            me.sprite.addChild(me.dataZoomBtns);

            me.widget();
            me._setLines();
        }
    }, {
        key: "destroy",
        value: function destroy() {
            this.sprite.destroy();
        }
    }, {
        key: "reset",
        value: function reset(opt, zoomBgSp) {
            opt && underscore.deepExtend(this, opt);
            this._computeAttrs(opt);

            this.widget();
            //this._setLines();
            this.setZoomBg(zoomBgSp);
        }

        //计算属性

    }, {
        key: "_computeAttrs",
        value: function _computeAttrs(opt) {

            if (!opt.range || !opt.range.max) {
                this.range.max = this.count;
            }

            if (this.range.end == '' && (!opt.range || !opt.range.end) || parseInt(this.range.end) > this.count - 1) {
                this.range.end = this.count - 1;
            }

            //这里为了避免外面没有传入number
            this.range.start = parseInt(this.range.start);
            this.range.end = parseInt(this.range.end);

            this.disPart = this._getDisPart();
            this.barH = this.h - this.barAddH;
        }
    }, {
        key: "widget",
        value: function widget() {
            var me = this;
            var setLines = function setLines() {
                me._setLines.apply(me, arguments);
            };
            if (me.bg.enabled) {
                var bgRectCtx = {
                    x: 0,
                    y: me.barY,
                    width: me.w,
                    height: me.barH,
                    lineWidth: me.bg.lineWidth,
                    strokeStyle: me.bg.strokeStyle,
                    fillStyle: me.bg.fillStyle
                };
                if (me._bgRect) {
                    me._bgRect.animate(bgRectCtx, {
                        onUpdate: setLines
                    });
                } else {
                    me._bgRect = new Rect$2({
                        context: bgRectCtx
                    });
                    me.dataZoomBg.addChild(me._bgRect);
                }
            }

            if (me.underline.enabled) {
                var underlineCtx = {
                    xStart: me.range.start / me.count * me.w + me.btnW / 2,
                    yStart: me.barY + me.barH + 2,
                    xEnd: (me.range.end + 1) / me.count * me.w - me.btnW / 2,
                    yEnd: me.barY + me.barH + 2,
                    lineWidth: me.underline.lineWidth,
                    strokeStyle: me.underline.strokeStyle
                };

                if (me._underline) {
                    me._underline.animate(underlineCtx, {
                        onUpdate: setLines
                    });
                } else {
                    me._underline = me._addLine(underlineCtx);
                    me.dataZoomBg.addChild(me._underline);
                }
            }

            var btnLeftCtx = {
                x: me.range.start / me.count * me.w,
                y: me.barY - me.barAddH / 2 + 1,
                width: me.btnW,
                height: me.barH + me.barAddH,
                fillStyle: me.btnFillStyle,
                cursor: me.left.eventEnabled && "move"
            };
            if (me._btnLeft) {
                me._btnLeft.animate(btnLeftCtx, {
                    onUpdate: setLines
                });
            } else {
                me._btnLeft = new Rect$2({
                    id: 'btnLeft',
                    dragEnabled: me.left.eventEnabled,
                    context: btnLeftCtx
                });
                me._btnLeft.on("draging", function () {
                    this.context.y = me.barY - me.barAddH / 2 + 1;
                    if (this.context.x < 0) {
                        this.context.x = 0;
                    }
                    if (this.context.x > me._btnRight.context.x - me.btnW - 2) {
                        this.context.x = me._btnRight.context.x - me.btnW - 2;
                    }
                    if (me._btnRight.context.x + me.btnW - this.context.x > me.disPart.max) {
                        this.context.x = me._btnRight.context.x + me.btnW - me.disPart.max;
                    }
                    if (me._btnRight.context.x + me.btnW - this.context.x < me.disPart.min) {
                        this.context.x = me._btnRight.context.x + me.btnW - me.disPart.min;
                    }
                    me.rangeRect.context.width = me._btnRight.context.x - this.context.x - me.btnW;
                    me.rangeRect.context.x = this.context.x + me.btnW;
                    me._setRange();
                });
                me._btnLeft.on("dragend", function () {
                    me.dragEnd(me.range);
                });
                this.dataZoomBtns.addChild(this._btnLeft);
            }

            var btnRightCtx = {
                x: (me.range.end + 1) / me.count * me.w - me.btnW,
                y: me.barY - me.barAddH / 2 + 1,
                width: me.btnW,
                height: me.barH + me.barAddH,
                fillStyle: me.btnFillStyle,
                cursor: me.right.eventEnabled && "move"
            };

            if (me._btnRight) {
                me._btnRight.animate(btnRightCtx, {
                    onUpdate: setLines
                });
            } else {
                me._btnRight = new Rect$2({
                    id: 'btnRight',
                    dragEnabled: me.right.eventEnabled,
                    context: btnRightCtx
                });
                me._btnRight.on("draging", function () {
                    this.context.y = me.barY - me.barAddH / 2 + 1;
                    if (this.context.x > me.w - me.btnW) {
                        this.context.x = me.w - me.btnW;
                    }
                    if (this.context.x + me.btnW - me._btnLeft.context.x > me.disPart.max) {
                        this.context.x = me.disPart.max - (me.btnW - me._btnLeft.context.x);
                    }
                    if (this.context.x + me.btnW - me._btnLeft.context.x < me.disPart.min) {
                        this.context.x = me.disPart.min - (me.btnW - me._btnLeft.context.x);
                    }
                    me.rangeRect.context.width = this.context.x - me._btnLeft.context.x - me.btnW;
                    me._setRange();
                });
                me._btnRight.on("dragend", function () {
                    me.dragEnd(me.range);
                });
                this.dataZoomBtns.addChild(this._btnRight);
            }

            var rangeRectCtx = {
                x: btnLeftCtx.x + me.btnW,
                y: this.barY + 1,
                width: btnRightCtx.x - btnLeftCtx.x - me.btnW,
                height: this.barH - 1,
                fillStyle: me.center.fillStyle,
                globalAlpha: me.center.globalAlpha,
                cursor: "move"
            };
            if (this.rangeRect) {
                this.rangeRect.animate(rangeRectCtx, {
                    onUpdate: setLines
                });
            } else {
                //中间矩形拖拽区域
                this.rangeRect = new Rect$2({
                    id: 'btnCenter',
                    dragEnabled: true,
                    context: rangeRectCtx
                });
                this.rangeRect.on("draging", function (e) {
                    this.context.y = me.barY + 1;
                    if (this.context.x < me.btnW) {
                        this.context.x = me.btnW;
                    }
                    if (this.context.x > me.w - this.context.width - me.btnW) {
                        this.context.x = me.w - this.context.width - me.btnW;
                    }
                    me._btnLeft.context.x = this.context.x - me.btnW;
                    me._btnRight.context.x = this.context.x + this.context.width;
                    me._setRange();
                });
                this.rangeRect.on("dragend", function () {
                    me.dragEnd(me.range);
                });
                this.dataZoomBtns.addChild(this.rangeRect);
            }

            if (!this.linesLeft) {
                this.linesLeft = new canvax.Display.Sprite({ id: "linesLeft" });
                if (this.left.eventEnabled) {
                    this._addLines({
                        sprite: this.linesLeft
                    });
                }
                this.dataZoomBtns.addChild(this.linesLeft);
            }
            if (!this.linesRight) {
                this.linesRight = new canvax.Display.Sprite({ id: "linesRight" });
                if (this.right.eventEnabled) {
                    this._addLines({
                        sprite: this.linesRight
                    });
                }
                this.dataZoomBtns.addChild(this.linesRight);
            }

            if (!this.linesCenter) {
                this.linesCenter = new canvax.Display.Sprite({ id: "linesCenter" });
                this._addLines({
                    count: 6,
                    // dis    : 1,
                    sprite: this.linesCenter,
                    strokeStyle: this.btnFillStyle
                });
                this.dataZoomBtns.addChild(this.linesCenter);
            }
        }
    }, {
        key: "_getDisPart",
        value: function _getDisPart() {
            var me = this;
            return {
                min: me.range.min / me.count * me.w,
                max: me.range.max / me.count * me.w
            };
        }
    }, {
        key: "_setRange",
        value: function _setRange() {
            var me = this;

            var start = me._btnLeft.context.x / me.w * (me.count - 1);
            var end = (me._btnRight.context.x + me.btnW) / me.w * (me.count - 1);
            me.range.start = start;
            me.range.end = end;
            //@比例range @像素range @单位总数 @width
            me.dragIng(me.range, {
                start: me._btnLeft.context.x,
                end: me._btnRight.context.x + me.btnW
            }, me.count, me.w);
            me._setLines();
        }
    }, {
        key: "_setLines",
        value: function _setLines() {

            var me = this;
            var linesLeft = this.linesLeft;
            var linesRight = this.linesRight;
            var linesCenter = this.linesCenter;

            var btnLeft = this._btnLeft;
            var btnRight = this._btnRight;
            var btnCenter = this.rangeRect;

            linesLeft.context.x = btnLeft.context.x + (btnLeft.context.width - linesLeft.context.width) / 2;
            linesLeft.context.y = btnLeft.context.y + (btnLeft.context.height - linesLeft.context.height) / 2;

            linesRight.context.x = btnRight.context.x + (btnRight.context.width - linesRight.context.width) / 2;
            linesRight.context.y = btnRight.context.y + (btnRight.context.height - linesRight.context.height) / 2;

            linesCenter.context.x = btnCenter.context.x + (btnCenter.context.width - linesCenter.context.width) / 2;
            linesCenter.context.y = btnCenter.context.y + (btnCenter.context.height - linesCenter.context.height) / 2;

            if (me.underline.enabled) {
                me._underline.context.xStart = linesLeft.context.x + me.btnW / 2;
                me._underline.context.xEnd = linesRight.context.x + me.btnW / 2;
            }
        }
    }, {
        key: "_addLines",
        value: function _addLines($o) {
            var me = this;
            var count = $o.count || 2;
            var sprite = $o.sprite;
            var dis = $o.dis || 2;
            for (var a = 0, al = count; a < al; a++) {
                sprite.addChild(me._addLine({
                    x: a * dis,
                    strokeStyle: $o.strokeStyle || ''
                }));
            }
            sprite.context.width = a * dis - 1, sprite.context.height = 6;
        }
    }, {
        key: "_addLine",
        value: function _addLine($o) {
            var o = $o || {};
            var line = new Line$1({
                id: o.id || '',
                context: {
                    x: o.x || 0,
                    y: o.y || 0,
                    start: {
                        x: o.xStart || 0,
                        y: o.yStart || 0
                    },
                    end: {
                        x: o.xEnd || 0,
                        y: o.yEnd || 6
                    },
                    lineWidth: o.lineWidth || 1,
                    strokeStyle: o.strokeStyle || '#ffffff'
                }
            });
            return line;
        }
    }, {
        key: "setZoomBg",
        value: function setZoomBg(zoomBgSp) {

            if (this.zoomBg) {
                zoomBgSp.context.x = this.zoomBg.context.x;
                zoomBgSp.context.y = this.zoomBg.context.y;
                zoomBgSp.context.scaleY = this.zoomBg.context.scaleY;
                this.zoomBg.destroy();
            }
            this.zoomBg = zoomBgSp;
            this.dataZoomBg.addChild(zoomBgSp);
        }
    }]);
    return dataZoom;
}(component);

var BrokenLine$2 = canvax.Shapes.BrokenLine;
var Sprite$1 = canvax.Display.Sprite;
var Text$1 = canvax.Display.Text;

var Legend$2 = function (_Component) {
    inherits$1(Legend, _Component);

    function Legend() {
        classCallCheck$1(this, Legend);

        var _this = possibleConstructorReturn$1(this, (Legend.__proto__ || Object.getPrototypeOf(Legend)).call(this));

        _this._yAxis = _yAxis;
        _this.w = 0;
        _this.h = 0;
        _this.field = null;
        _this.origin = {
            x: 0, y: 0
        };

        _this.markTo = null; //默认给所有字段都现实一条markline，有设置的话，配置给固定的几个 field 显示markline
        _this.value = 0;
        _this.line = {
            y: 0,
            list: [],
            strokeStyle: '#999',
            lineWidth: 1,
            smooth: false,
            lineType: 'dashed'
        };

        _this.text = {
            enabled: true,
            content: '',
            fillStyle: '#999999',
            fontSize: 12,
            format: null,
            lineType: 'dashed',
            lineWidth: 1,
            strokeStyle: "white"
        };

        _this.filter = function () {};

        _this._txt = null;
        _this._line = null;

        opt && underscore.deepExtend(_this, opt);
        _this.init();
        return _this;
    }

    createClass$1(Legend, [{
        key: "init",
        value: function init() {
            var me = this;

            this.sprite = new Sprite$1({
                context: {
                    x: this.origin.x,
                    y: this.origin.y
                }
            });
            me.widget();
        }
    }, {
        key: "draw",
        value: function draw() {}
    }, {
        key: "widget",
        value: function widget() {
            var me = this;

            var line = new BrokenLine$2({ //线条
                id: "line",
                context: {
                    y: me.line.y,
                    pointList: me.line.list,
                    strokeStyle: me.line.strokeStyle,
                    lineWidth: me.line.lineWidth,
                    lineType: me.line.lineType
                }
            });
            me.sprite.addChild(line);
            me._line = line;

            if (me.text.enabled) {
                var txt = new Text$1(me.text.content, { //文字
                    context: me.text
                });
                this._txt = txt;
                me.sprite.addChild(txt);

                if (underscore.isNumber(me.text.x)) {
                    txt.context.x = me.text.x, txt.context.y = me.text.y;
                } else {
                    txt.context.x = this.w - txt.getTextWidth();
                    txt.context.y = me.line.y - txt.getTextHeight();
                }
            }

            me.filter(me);
        }
    }, {
        key: "reset",
        value: function reset(opt) {
            opt && underscore.deepExtend(this, opt);
            if (this.line.y != this._line.context.y) {
                this._line.animate({
                    y: this.line.y
                }, {
                    duration: 500,
                    easing: 'Back.Out' //Tween.Easing.Elastic.InOut
                });
            }
            this._line.context.strokeStyle = this.line.strokeStyle;
            this._txt && this._txt.resetText(this.text.context);
        }
    }]);
    return Legend;
}(component);

var Circle$2$1 = canvax.Shapes.Circle;
var Droplet$1 = canvax.Shapes.Droplet;

var markPoint = function (_Component) {
    inherits$1(markPoint, _Component);

    function markPoint() {
        classCallCheck$1(this, markPoint);

        var _this = possibleConstructorReturn$1(this, (markPoint.__proto__ || Object.getPrototypeOf(markPoint)).call(this));

        _this.markTo = null;
        _this.data = data; //这里的data来自加载markpoint的各个chart，结构都会有不一样，但是没关系。data在markpoint本身里面不用作业务逻辑，只会在fillStyle 等是function的时候座位参数透传给用户
        _this.point = {
            x: 0, y: 0
        };
        _this.normalColor = "#6B95CF";
        _this.shapeType = "droplet"; //"circle";
        _this.fillStyle = null;
        _this.strokeStyle = null;
        _this.lineWidth = 1;
        _this.globalAlpha = 0.9;

        _this.duration = 800; //如果有动画，则代表动画时长
        _this.easing = null; //动画类型

        //droplet opts
        _this.hr = 8;
        _this.vr = 12;

        //circle opts
        _this.r = 5;

        _this.sprite = null;
        _this.shape = null;

        _this.iGroup = null;
        _this.iNode = null;
        _this.iLay = null;

        _this.realTime = false; //是否是实时的一个点，如果是的话会有动画
        _this.filter = function () {}; //过滤函数

        if ("markPoint" in userOpts) {
            underscore.deepExtend(_this, userOpts.markPoint);
        }
        chartOpts && underscore.deepExtend(_this, chartOpts);

        _this.init();
        return _this;
    }

    createClass$1(markPoint, [{
        key: "init",
        value: function init() {
            var me = this;
            this.sprite = new canvax.Display.Sprite({
                context: {
                    x: this.point.x,
                    y: this.point.y,
                    globalAlpha: this.globalAlpha
                }
            });
            this.sprite.on("destroy", function (e) {});
            me.widget();
        }
    }, {
        key: "widget",
        value: function widget() {
            this._fillStyle = this._getColor(this.fillStyle, this.data);
            this._strokeStyle = this._getColor(this.strokeStyle, this.data);
            switch (this.shapeType.toLocaleLowerCase()) {
                case "circle":
                    this._initCircleMark();
                    break;
                case "droplet":
                    this._initDropletMark();
                    break;
            }
        }
    }, {
        key: "rePosition",
        value: function rePosition(point) {
            this.point = point;
            this.sprite.context.x = this.point.x;
            this.sprite.context.y = this.point.y;
        }
    }, {
        key: "_getColor",
        value: function _getColor(c, data, normalColor) {
            var color = c;
            if (underscore.isFunction(c)) {
                color = c(data);
            }
            //缺省颜色
            if (!color || color == "") {
                //如果有传normal进来，就不管normalColor参数是什么，都直接用
                if (arguments.length >= 3) {
                    color = normalColor;
                } else {
                    color = this.normalColor;
                }
            }
            return color;
        }
    }, {
        key: "_done",
        value: function _done() {
            this.shape.context.visible = true;
            this.shapeBg && (this.shapeBg.context.visible = true);
            this.shapeCircle && (this.shapeCircle.context.visible = true);
            underscore.isFunction(this.filter) && this.filter(this);
        }
    }, {
        key: "_initCircleMark",
        value: function _initCircleMark() {
            var me = this;
            var ctx = {
                r: me.r,
                fillStyle: me._fillStyle,
                lineWidth: me.lineWidth,
                strokeStyle: me._strokeStyle,
                //globalAlpha : me.globalAlpha,
                cursor: "point",
                visible: false
            };
            me.shape = new Circle$2$1({
                context: ctx
            });
            me.sprite.addChild(me.shape);
            me._realTimeAnimate();
            me._done();
        }
    }, {
        key: "destroy",
        value: function destroy() {
            this.sprite.destroy();
        }
    }, {
        key: "_realTimeAnimate",
        value: function _realTimeAnimate() {
            var me = this;
            if (me.realTime) {
                if (!me.shapeBg) {
                    me.shapeBg = me.shape.clone();
                    me.sprite.addChildAt(me.shapeBg, 0);
                }
            }
        }
    }, {
        key: "_initDropletMark",
        value: function _initDropletMark() {
            var me = this;
            var ctx = {
                y: -me.vr,
                scaleY: -1,
                hr: me.hr,
                vr: me.vr,
                fillStyle: me._fillStyle,
                lineWidth: me.lineWidth,
                strokeStyle: me._strokeStyle,
                //globalAlpha : me.globalAlpha,
                cursor: "point",
                visible: false
            };
            me.shape = new Droplet$1({
                hoverClone: false,
                context: ctx
            });
            me.sprite.addChild(me.shape);

            var circleCtx = {
                y: -me.vr,
                x: 1,
                r: Math.max(me.hr - 6, 2),
                fillStyle: "#fff",
                visible: false
            };
            me.shapeCircle = new Circle$2$1({
                context: circleCtx
            });
            me.sprite.addChild(me.shapeCircle);

            me._done();
        }
    }]);
    return markPoint;
}(component);

var Line$2 = canvax.Shapes.Line;
var Circle$3 = canvax.Shapes.Circle;

var Anchor = function (_Component) {
    inherits$1(Anchor, _Component);

    function Anchor() {
        classCallCheck$1(this, Anchor);

        var _this = possibleConstructorReturn$1(this, (Anchor.__proto__ || Object.getPrototypeOf(Anchor)).call(this));

        _this.w = 0;
        _this.h = 0;
        _this.xAxis = {
            lineWidth: 1,
            fillStyle: '#0088cf',
            lineType: "dashed"
        };
        _this.yAxis = {
            lineWidth: 1,
            fillStyle: '#0088cf',
            lineType: "dashed"
        };
        _this.node = {
            enabled: 1, //是否有
            r: 2, //半径 node 圆点的半径
            fillStyle: '#0088cf',
            strokeStyle: '#0088cf',
            lineWidth: 0
        };
        _this.text = {
            enabled: 0,
            fillStyle: "#0088cf"
        };

        _this.pos = {
            x: 0,
            y: 0
        };
        _this.cross = {
            x: 0,
            y: 0
        };

        _this.sprite = null;

        _this._txt = null;
        _this._circle = null;
        _this._xAxis = null;
        _this._yAxis = null;

        _this.init(opt);
        return _this;
    }

    createClass$1(Anchor, [{
        key: "init",
        value: function init(opt) {
            if (opt) {
                underscore.deepExtend(this, opt);
            }

            this.sprite = new canvax.Display.Sprite({
                id: "AnchorSprite"
            });
        }
    }, {
        key: "draw",
        value: function draw(opt, _xAxis, _yAxis) {
            this._xAxis = _xAxis;
            this._yAxis = _yAxis;
            this._initConfig(opt);
            this.sprite.context.x = this.pos.x;
            this.sprite.context.y = this.pos.y;
            this._widget();
        }
    }, {
        key: "show",
        value: function show() {
            this.sprite.context.visible = true;
            this._circle.context.visible = true;
            if (this._txt) {
                this._txt.context.visible = true;
            }
        }
    }, {
        key: "hide",
        value: function hide() {
            this.sprite.context.visible = false;
            this._circle.context.visible = false;
            if (this._txt) {
                this._txt.context.visible = false;
            }
        }

        //初始化配置

    }, {
        key: "_initConfig",
        value: function _initConfig(opt) {
            if (opt) {
                underscore.deepExtend(this, opt);
            }
        }

        //瞄准

    }, {
        key: "aim",
        value: function aim(cross) {
            this._xLine.context.yStart = cross.y;
            this._xLine.context.yEnd = cross.y;
            this._yLine.context.xStart = cross.x;
            this._yLine.context.xEnd = cross.x;

            var nodepos = this.sprite.localToGlobal(cross);
            this._circle.context.x = nodepos.x;
            this._circle.context.y = nodepos.y;

            if (this.text.enabled) {
                var nodepos = this.sprite.localToGlobal(cross);
                this._txt.context.x = parseInt(nodepos.x);
                this._txt.context.y = parseInt(nodepos.y);

                var xd = this._xAxis.dataSection;
                var xdl = xd.length;
                var xText = parseInt(cross.x / this.w * (xd[xdl - 1] - xd[0]) + xd[0]);

                var yd = this._yAxis.dataSection;
                var ydl = yd.length;
                var yText = parseInt((this.h - cross.y) / this.h * (yd[ydl - 1] - yd[0]) + yd[0]);
                this._txt.resetText("（X：" + xText + "，Y：" + yText + "）");

                if (cross.y <= 20) {
                    this._txt.context.textBaseline = "top";
                } else {
                    this._txt.context.textBaseline = "bottom";
                }
                if (cross.x <= this._txt.getTextWidth()) {
                    this._txt.context.textAlign = "left";
                } else {
                    this._txt.context.textAlign = "right";
                }
            }
        }
    }, {
        key: "_widget",
        value: function _widget() {
            var self = this;

            self._xLine = new Line$2({
                id: 'x',
                context: {
                    start: {
                        x: 0,
                        y: self.cross.y
                    },
                    end: {
                        x: self.w,
                        y: self.cross.y
                    },
                    lineWidth: self.xAxis.lineWidth,
                    strokeStyle: self.xAxis.fillStyle,
                    lineType: self.xAxis.lineType
                }
            });
            self.sprite.addChild(self._xLine);

            self._yLine = new Line$2({
                id: 'y',
                context: {
                    start: {
                        x: self.cross.x,
                        y: 0
                    },
                    end: {
                        x: self.cross.x,
                        y: self.h
                    },
                    lineWidth: self.yAxis.lineWidth,
                    strokeStyle: self.yAxis.fillStyle,
                    lineType: self.yAxis.lineType
                }
            });
            this.sprite.addChild(self._yLine);

            var nodepos = self.sprite.localToGlobal(self.cross);
            self._circle = new Circle$3({
                context: {
                    x: parseInt(nodepos.x),
                    y: parseInt(nodepos.y),
                    r: self._getProp(self.node.r),
                    fillStyle: self._getProp(self.node.fillStyle) || "#ff0000",
                    strokeStyle: self._getProp(self.node.strokeStyle) || '#cc3300',
                    lineWidth: self._getProp(self.node.lineWidth)
                }
            });
            self.sprite.getStage().addChild(self._circle);

            if (self.text.enabled) {
                self._txt = new canvax.Display.Text("", {
                    context: {
                        x: parseInt(nodepos.x),
                        y: parseInt(nodepos.y),
                        textAlign: "right",
                        textBaseline: "bottom",
                        fillStyle: self.text.fillStyle
                    }
                });
                self.sprite.getStage().addChild(self._txt);
            }
        }
    }, {
        key: "_getProp",
        value: function _getProp(s) {
            if (underscore.isFunction(s)) {
                return s();
            }
            return s;
        }
    }]);
    return Anchor;
}(component);

var Descartes = function (_Chart) {
    inherits$1(Descartes, _Chart);

    function Descartes(node, data, opts) {
        classCallCheck$1(this, Descartes);

        //不管传入的是data = [ ['xfield','yfield'] , ['2016', 111]]
        //还是 data = [ {xfiled, 2016, yfield: 1111} ]，这样的格式，
        //通过parse2MatrixData最终转换的是data = [ ['xfield','yfield'] , ['2016', 111]] 这样 chartx的数据格式
        data = parse2MatrixData(data);

        var _this = possibleConstructorReturn$1(this, (Descartes.__proto__ || Object.getPrototypeOf(Descartes)).call(this, node, data, opts));

        _this._node = node;
        _this._data = data;
        _this._opts = opts;

        //坐标系统
        _this._coordinate = null;
        _this.coordinate = {
            xAxis: {
                //波峰波谷布局模型，默认是柱状图的，折线图种需要做覆盖
                layoutType: "peak",
                //默认为false，x轴的计量是否需要取整， 这样 比如某些情况下得柱状图的柱子间隔才均匀。
                //比如一像素间隔的柱状图，如果需要精确的绘制出来每个柱子的间距是1px， 就必须要把这里设置为true
                posParseToInt: false
            }
        };

        //直角坐标系的绘图模块
        _this._graphs = null;

        //直角坐标系的tooltip
        _this._tips = null;

        //预设dataZoom的区间数据
        _this.dataZoom = {
            h: 30,
            range: {
                start: 0,
                end: data.length - 1 //因为第一行是title
            }
        };

        return _this;
    }

    createClass$1(Descartes, [{
        key: "setStages",
        value: function setStages() {
            this.stageTip = new canvax.Display.Sprite({
                id: 'tip'
            });
            this.core = new canvax.Display.Sprite({
                id: 'core'
            });

            this.stage.addChild(this.core);
            this.stage.addChild(this.stageTip);
        }
    }, {
        key: "_horizontal",
        value: function _horizontal() {
            var me = this;

            underscore.each([me._graphs], function (_graphs) {
                var ctx = _graphs.sprite.context;
                ctx.x += (me.width - me.height) / 2;
                ctx.y += (me.height - me.width) / 2 + me.padding.top;
                ctx.rotation = 90;
                ctx.rotateOrigin.x = me.height / 2;
                ctx.rotateOrigin.y = me.width / 2;
                ctx.scaleOrigin.x = me.height / 2;
                ctx.scaleOrigin.y = me.width / 2;
                ctx.scaleX = -1;

                underscore.each(_graphs.txtsSp.children, function (childSp) {
                    underscore.each(childSp.children, function (cs) {
                        var ctx = cs.context;
                        var w = ctx.width;
                        var h = ctx.height;

                        ctx.scaleOrigin.x = w / 2;
                        ctx.scaleOrigin.y = h / 2;
                        ctx.scaleX = -1;

                        ctx.rotation = 90;
                        ctx.rotateOrigin.x = w / 2;
                        ctx.rotateOrigin.y = h / 2;

                        var _cfy = cs._finalY;
                        cs._finalY -= w / 2 - h / 2;
                        if (!cs.upOfYbaseNumber) {
                            //不在基准线之上的话
                            cs._finalY += w / 2;
                        }

                        //TODO:这里暂时还不是最准确的计算， 后续完善
                        if (Math.abs(_cfy) + w > me._graphs.h) {
                            cs._finalY = -me._graphs.h + w / 2;
                        }
                    });
                });
            });
        }
    }, {
        key: "initPlugsModules",
        value: function initPlugsModules(opt) {
            if (this._opts.legend && this._initLegend) {
                this._initLegend(opt);
            }
            if (this._opts.markLine && this._initMarkLine) {
                this._initMarkLine(opt);
            }
            if (this._opts.markPoint && this._initMarkPoint) {
                this._initMarkPoint(opt);
            }
            if (this._opts.dataZoom && this._initDataZoom) {
                this._initDataZoom(opt);
            }
            if (this._opts.anchor && this._initAnchor) {
                this._initAnchor(opt);
            }
        }

        //所有plug触发更新

    }, {
        key: "plugsReset",
        value: function plugsReset(opt, e) {
            var me = this;
            underscore.each(this.plugs, function (p, i) {
                if (p.type == "markLine") {
                    p.plug.reset({
                        line: {
                            y: p.plug._yAxis.getYposFromVal(p.plug.value)
                        }
                    }, i);
                    return;
                }

                if (p.type == "markPoint") {
                    p.plug.reset();
                    return;
                }

                if (p.type == "dataZoom") {
                    if (!e || e && e.trigger != "dataZoom") {
                        me.__cloneChart = me._getCloneChart();
                        p.plug.reset({
                            count: me._data.length - 1
                        }, me.__cloneChart.thumbChart._graphs.sprite);
                    }
                    return;
                }
                p.plug.reset && p.plug.reset(opt);
            });
        }

        //设置图例 begin

    }, {
        key: "_initLegend",
        value: function _initLegend(e) {
            !e && (e = {});
            var me = this;
            //if( !this.legend || (this.legend && "enabled" in this.legend && !this.legend.enabled) ) return;
            //设置legendOpt
            var legendOpt = underscore.deepExtend({
                enabled: true,
                label: function label(info) {
                    return info.field;
                },
                onChecked: function onChecked(field) {
                    me.add(field);
                },
                onUnChecked: function onUnChecked(field) {
                    me.remove(field);
                }
            }, me._opts.legend);

            var _legend = new Legend(me._getLegendData(), legendOpt);

            _legend.draw = function () {
                me.drawLegend(_legend);
            };

            _legend.pos({
                x: 0,
                y: me.padding.top + (e.resize ? -_legend.height : 0)
            });

            !e.resize && (me.padding.top += _legend.height);

            this.plugs.push({
                type: "legend",
                plug: _legend
            });
            me.core.addChild(_legend.sprite);
        }

        //只有field为多组数据的时候才需要legend

    }, {
        key: "_getLegendData",
        value: function _getLegendData() {
            var me = this;
            var data = [];
            underscore.each(me._coordinate.yAxisFields, function (f, i) {
                data.push({
                    field: f,
                    fillStyle: null
                });
            });
            return data;
        }
        ////设置图例end


        //datazoom begin

    }, {
        key: "_getCloneChart",
        value: function _getCloneChart() {
            var me = this;
            barConstructor = this.constructor; //(barConstructor || Bar);
            var cloneEl = me.el.cloneNode();
            cloneEl.innerHTML = "";
            cloneEl.id = me.el.id + "_currclone";
            cloneEl.style.position = "absolute";
            cloneEl.style.width = me.el.offsetWidth + "px";
            cloneEl.style.height = me.el.offsetHeight + "px";
            cloneEl.style.top = "10000px";
            document.body.appendChild(cloneEl);

            var opts = underscore.deepExtend({}, me._opts);
            underscore.deepExtend(opts, me.getCloneChart());

            delete opts.dataZoom;

            var thumbChart = new barConstructor(cloneEl, me._data, opts);
            thumbChart.draw();

            return {
                thumbChart: thumbChart,
                cloneEl: cloneEl
            };
        }
    }, {
        key: "_initDataZoom",
        value: function _initDataZoom() {
            var me = this;

            me.padding.bottom += me.dataZoom.h;
            me.__cloneChart = me._getCloneChart();

            this.plugs.push({
                type: "once",
                plug: {
                    draw: function draw() {

                        me._dataZoom = new dataZoom(me.drawDataZoom());

                        var graphssp = me.__cloneChart.thumbChart._graphs.sprite;
                        graphssp.id = graphssp.id + "_datazoomthumbChartbg";
                        graphssp.context.x = 0;
                        graphssp.context.y = me._dataZoom.barH + me._dataZoom.barY;

                        graphssp.context.scaleY = me._dataZoom.barH / me.__cloneChart.thumbChart._graphs.h;

                        me._dataZoom.setZoomBg(graphssp);

                        me.__cloneChart.thumbChart.destroy();
                        me.__cloneChart.cloneEl.parentNode.removeChild(me.__cloneChart.cloneEl);

                        me.plugs.push({
                            type: "dataZoom",
                            plug: me._dataZoom
                        });
                        me.core.addChild(me._dataZoom.sprite);
                    }
                }
            });
        }
        //datazoom end


        //markLine begin

    }, {
        key: "_initMarkLine",
        value: function _initMarkLine() {
            var me = this;

            if (!underscore.isArray(me.markLine)) {
                me.markLine = [me.markLine];
            }

            underscore.each(me.markLine, function (ML) {
                //如果markline有target配置，那么只现在target配置里的字段的 markline, 推荐
                var field = ML.markTo;
                var _yAxis = me._coordinate._yAxis[0]; //默认为左边的y轴

                if (field) {
                    //如果有配置markTo就从me._coordinate._yAxis中找到这个markTo所属的yAxis对象
                    underscore.each(me._coordinate._yAxis, function ($yAxis, yi) {
                        var fs = underscore.flatten([$yAxis.field]);
                        if (underscore.indexOf(fs, field) >= 0) {
                            _yAxis = $yAxis;
                        }
                    });
                }

                var y;
                if (ML.y !== undefined && ML.y !== null) {
                    y = Number(ML.y);
                }
                if (!isNaN(y)) {
                    _yAxis.resetDataSection(y);
                }

                var name = field;

                me.plugs.push({
                    type: "once",
                    plug: {
                        draw: function draw() {
                            me.drawMarkLine(name, y, _yAxis, ML);
                        }
                    }
                });
            });
        }
    }, {
        key: "creatOneMarkLine",
        value: function creatOneMarkLine(yVal, yPos, lineStrokeStyle, label, textFillStyle, field, ML, _yAxis) {
            var me = this;
            var o = {
                w: me._coordinate.graphsWidth,
                h: me._coordinate.graphsHeight,
                value: yVal,
                origin: {
                    x: me._coordinate.graphsX,
                    y: me._coordinate.graphsY
                },
                line: {
                    y: yPos,
                    list: [[0, 0], [me._coordinate.graphsWidth, 0]],
                    strokeStyle: lineStrokeStyle
                },
                text: {
                    content: label,
                    fillStyle: textFillStyle
                },
                field: field
            };

            var _markLine = new MarkLine(underscore.deepExtend(ML, o), _yAxis);
            me.plugs.push({
                type: "markLine",
                plug: _markLine
            });
            me.core.addChild(_markLine.sprite);
        }
        //markLine end


    }, {
        key: "_initMarkPoint",
        value: function _initMarkPoint() {
            //目前由bar和line各自覆盖
            this.drawMarkPoint();
        }
    }, {
        key: "creatOneMarkPoint",
        value: function creatOneMarkPoint(opts, mpCtx) {
            var me = this;
            var _mp = new MarkPoint(opts, mpCtx);
            _mp.shape.hover(function (e) {
                this.context.hr++;
                this.context.cursor = "pointer";
                e.stopPropagation();
            }, function (e) {
                this.context.hr--;
                e.stopPropagation();
            });
            _mp.shape.on("mousemove", function (e) {
                e.stopPropagation();
            });
            _mp.shape.on("tap click", function (e) {
                e.stopPropagation();
                e.eventInfo = _mp;
                me.fire("markpointclick", e);
            });

            me.plugs.push({
                type: "markPoint",
                plug: _mp
            });

            me.core.addChild(_mp.sprite);

            return _mp;
        }
    }, {
        key: "_initAnchor",
        value: function _initAnchor(e) {

            var me = this;

            this.plugs.push({
                type: "once",
                plug: {
                    draw: function draw() {

                        var _anchor = new Anchor(me.anchor);
                        me.core.addChild(_anchor.sprite);

                        var _graphsH = me._coordinate.graphsHeight;
                        var _graphsW = me._coordinate.graphsWidth;

                        _anchor.draw({
                            w: _graphsW,
                            h: _graphsH,
                            //cross: {
                            //    x: 0,
                            //    y: _graphsH + 0
                            //},
                            pos: {
                                x: me._coordinate.graphsX,
                                y: me._coordinate.graphsY - _graphsH
                            }
                        });

                        me._anchor = _anchor;

                        me.drawAnchor(_anchor);

                        me.plugs.push({
                            type: "anchor",
                            plug: {
                                draw: function draw() {
                                    me.drawAnchor(_anchor);
                                }
                            }
                        });
                    }
                }
            });
        }
    }]);
    return Descartes;
}(Chart);

function normalizeTickInterval(interval, magnitude) {
    var normalized, i;
    // var multiples = [1, 2, 2.5, 5, 10];
    var multiples = [1, 2, 5, 10];
    // round to a tenfold of 1, 2, 2.5 or 5
    normalized = interval / magnitude;

    // normalize the interval to the nearest multiple
    for (var i = 0; i < multiples.length; i++) {
        interval = multiples[i];
        if (normalized <= (multiples[i] + (multiples[i + 1] || multiples[i])) / 2) {
            break;
        }
    }

    // multiply back to the correct magnitude
    interval *= magnitude;

    return interval;
}

function correctFloat(num) {
    return parseFloat(num.toPrecision(14));
}

function getLinearTickPositions(arr, $maxPart, $cfg) {

    arr = underscore.without(arr, undefined, null, "");

    var scale = $cfg && $cfg.scale ? parseFloat($cfg.scale) : 1;
    //返回的数组中的值 是否都为整数(思霏)  防止返回[8, 8.2, 8.4, 8.6, 8.8, 9]   应该返回[8, 9]
    var isInt = $cfg && $cfg.isInt ? 1 : 0;

    if (isNaN(scale)) {
        scale = 1;
    }

    var max = underscore.max(arr);
    var initMax = max;
    max *= scale;
    var min = underscore.min(arr);

    if (min == max) {
        if (max > 0) {
            min = 0;
            return [min, max];
            // min= Math.round(max/2);
        } else if (max < 0) {
            return [max, 0];
            //min = max*2;
        } else {
            max = 1;
            return [0, max];
        }
    }

    var length = max - min;
    if (length) {
        var tempmin = min; //保证min>0的时候不会出现负数
        min -= length * 0.05;
        // S.log(min +":"+ tempmin)
        if (min < 0 && tempmin >= 0) {
            min = 0;
        }
        max += length * 0.05;
    }

    var tickInterval = (max - min) * 0.3; //72 / 365;
    var magnitude = Math.pow(10, Math.floor(Math.log(tickInterval) / Math.LN10));

    tickInterval = normalizeTickInterval(tickInterval, magnitude);
    if (isInt) {
        tickInterval = Math.ceil(tickInterval);
    }

    var pos,
        lastPos,
        roundedMin = correctFloat(Math.floor(min / tickInterval) * tickInterval),
        roundedMax = correctFloat(Math.ceil(max / tickInterval) * tickInterval),
        tickPositions = [];

    // Populate the intermediate values
    pos = roundedMin;
    while (pos <= roundedMax) {

        // Place the tick on the rounded value
        tickPositions.push(pos);

        // Always add the raw tickInterval, not the corrected one.
        pos = correctFloat(pos + tickInterval);

        // If the interval is not big enough in the current min - max range to actually increase
        // the loop variable, we need to break out to prevent endless loop. Issue #619
        if (pos === lastPos) {
            break;
        }

        // Record the last value
        lastPos = pos;
    }
    if (tickPositions.length >= 3) {
        if (tickPositions[tickPositions.length - 2] >= initMax) {
            tickPositions.pop();
        }
    }
    return tickPositions;
}

var DataSection = {
    section: function section($arr, $maxPart, $cfg) {
        return underscore.uniq(getLinearTickPositions($arr, $maxPart, $cfg));
    }
};

var Line$3 = canvax.Shapes.Line;

var xAxis = function (_Component) {
    inherits$1(xAxis, _Component);

    function xAxis(opt, data, coordinate) {
        classCallCheck$1(this, xAxis);

        var _this = possibleConstructorReturn$1(this, (xAxis.__proto__ || Object.getPrototypeOf(xAxis)).call(this));

        _this._coordinate = coordinate || {};

        //TODO:这个 graphw 目前是有问题的， 它实际是包括了yAxisW
        _this.graphw = 0;
        _this.graphh = 0;
        _this.yAxisW = 0;
        _this.width = 0;
        _this.height = 0;

        _this.disY = 1;
        _this.dis = 6; //线到文本的距离

        _this.label = "";
        _this._label = null; //this.label对应的文本对象

        _this.line = {
            enabled: 1, //是否有line
            width: 1,
            height: 4,
            strokeStyle: '#cccccc'
        };

        _this.text = {
            fillStyle: '#999',
            fontSize: 12,
            rotation: 0,
            format: null,
            textAlign: "center"
        };
        _this.maxTxtH = 0;

        _this.pos = {
            x: null,
            y: null
        };

        _this.display = true; //是否需要位置来绘制

        _this.disXAxisLine = 6; //x轴两端预留的最小值
        _this.disOriginX = 0; //背景中原点开始的x轴线与x轴的第一条竖线的偏移量
        _this.xGraphsWidth = 0; //x轴宽(去掉两端)

        _this.dataOrg = []; //源数据
        _this.dataSection = []; //默认就等于源数据
        _this._layoutDataSection = []; //dataSection的 format 后的数据
        _this.data = []; //{x:100, content:'1000'}
        _this.layoutData = []; //this.data(可能数据过多),重新编排过滤后的数据集合, 并根据此数组展现文字和线条
        _this.sprite = null;

        _this._textMaxWidth = 0;
        _this.leftDisX = 0; //x轴最左边需要的间距。默认等于第一个x value字符串长度的一半

        //过滤器，可以用来过滤哪些yaxis 的 节点是否显示已经颜色之类的
        //@params params包括 dataSection , 索引index，txt(canvax element) ，line(canvax element) 等属性
        _this.filter = null; //function(params){}; 

        _this.isH = false; //是否为横向转向的x轴

        _this.animation = true;
        _this.resize = false;

        //layoutType == "proportion"的时候才有效
        _this.maxVal = null;
        _this.minVal = null;

        _this.xDis = 0; //x方向一维均分长度, layoutType == peak 的时候要用到

        _this.layoutType = "rule"; // rule（均分，起点在0） , peak（均分，起点在均分单位的中心）, proportion（实际数据真实位置，数据一定是number）

        //如果用户有手动的 trimLayout ，那么就全部visible为true，然后调用用户自己的过滤程序
        //trimLayout就事把arr种的每个元素的visible设置为true和false的过程
        //function
        _this.trimLayout = null;

        _this.posParseToInt = false; //主要是柱状图里面有需要 要均匀间隔1px的时候需要

        _this.init(opt, data);
        return _this;
    }

    createClass$1(xAxis, [{
        key: "init",
        value: function init(opt, data) {
            this.sprite = new canvax.Display.Sprite({
                id: "xAxisSprite"
            });
            this.rulesSprite = new canvax.Display.Sprite({
                id: "rulesSprite"
            });
            this.sprite.addChild(this.rulesSprite);
            this._initHandle(opt, data);
        }
    }, {
        key: "_initHandle",
        value: function _initHandle(opt, data) {

            if (data && data.org) {
                this.dataOrg = data.org;
            }

            if (opt) {
                underscore.deepExtend(this, opt);
                if (!opt.dataSection && this.dataOrg) {
                    //如果没有传入指定的dataSection，才需要计算dataSection
                    this.dataSection = this._initDataSection(this.dataOrg);
                }
            }

            if (this.text.rotation != 0) {
                if (this.text.rotation % 90 == 0) {
                    this.isH = true;
                }
                this.text.textAlign = "right";
            }

            if (!this.line.enabled) {
                this.line.height = 1;
            }

            //先计算出来显示文本
            this._layoutDataSection = this._formatDataSectionText(this.dataSection);

            //然后计算好最大的 width 和 最大的height，外部组件需要用
            this._setTextMaxWidth();
            this._setXAxisHeight();

            //取第一个数据来判断xaxis的刻度值类型是否为 number
            this.minVal == null && (this.minVal = underscore.min(this.dataSection));
            if (isNaN(this.minVal) || this.minVal == Infinity) {
                this.minVal = 0;
            }
            this.maxVal == null && (this.maxVal = underscore.max(this.dataSection));
            if (isNaN(this.maxVal) || this.maxVal == Infinity) {
                this.maxVal = 1;
            }
        }

        /**
         *return dataSection 默认为xAxis.dataOrg的的faltten
         *即 [ [1,2,3,4] ] -- > [1,2,3,4]
         */

    }, {
        key: "_initDataSection",
        value: function _initDataSection(data) {
            var arr = underscore.flatten(data);
            if (this.layoutType == "proportion") {
                arr = DataSection.section(arr);
            }
            return arr;
        }
    }, {
        key: "setX",
        value: function setX($n) {
            this.sprite.context.x = $n;
        }
    }, {
        key: "setY",
        value: function setY($n) {
            this.sprite.context.y = $n;
        }

        //配置和数据变化

    }, {
        key: "reset",
        value: function reset(opt, data) {
            //先在field里面删除一个字段，然后重新计算
            opt && underscore.deepExtend(this, opt);

            this._initHandle(opt, data);

            this.draw();
        }

        //数据变化，配置没变的情况

    }, {
        key: "resetData",
        value: function resetData(data) {
            this.sprite.removeAllChildren();
            this.dataSection = [];

            this._initHandle(null, data);

            this.draw();
        }
    }, {
        key: "getIndexOfVal",
        value: function getIndexOfVal(xvalue) {
            var i;
            for (var ii = 0, il = this.data.length; ii < il; ii++) {
                var obj = this.data[ii];
                if (obj.content == xvalue) {
                    i = ii;
                    break;
                }
            }

            return i;
        }
    }, {
        key: "draw",
        value: function draw(opt) {

            // this.data = [{x:0,content:'0000'},{x:100,content:'10000'},{x:200,content:'20000'},{x:300,content:'30000'},{x:400,content:'0000'},{x:500,content:'10000'},{x:600,content:'20000'}]
            if (this.data.length == 0) {}
            this._getLabel();
            this._initConfig(opt);
            this.data = this._trimXAxis(this.dataSection, this.xGraphsWidth);
            var me = this;
            underscore.each(this.data, function (obj, i) {
                obj.layoutText = me._layoutDataSection[i];
            });

            this._trimLayoutData();

            this.setX(this.pos.x);
            this.setY(this.pos.y);

            this._widget();

            this.resize = false;
            // this.data = this.layoutData
        }
    }, {
        key: "_getLabel",
        value: function _getLabel() {
            if (this.label && this.label != "") {
                if (!this._label) {
                    this._label = new canvax.Display.Text(this.label, {
                        context: {
                            fontSize: this.text.fontSize,
                            textAlign: this.isH ? "center" : "left",
                            textBaseline: this.isH ? "top" : "middle",
                            fillStyle: this.text.fillStyle,
                            rotation: this.isH ? -90 : 0
                        }
                    });
                } else {
                    this._label.resetText(this.label);
                }
            }
        }

        //初始化配置

    }, {
        key: "_initConfig",
        value: function _initConfig(opt) {
            if (opt) {
                underscore.deepExtend(this, opt);
            }

            this.yAxisW = Math.max(this.yAxisW, this.leftDisX);
            this.width = this.graphw - this.yAxisW;
            if (this.pos.x == null) {
                this.pos.x = this.yAxisW + this.disOriginX;
            }
            if (this.pos.y == null) {
                this.pos.y = this.graphh - this.height;
            }
            this.xGraphsWidth = parseInt(this.width - this._getXAxisDisLine());

            if (this._label) {
                if (this.isH) {
                    this.xGraphsWidth -= this._label.getTextHeight() + 5;
                } else {
                    this.xGraphsWidth -= this._label.getTextWidth() + 5;
                }
            }
            this.disOriginX = parseInt((this.width - this.xGraphsWidth) / 2);
        }

        //获取x对应的位置
        //val ind 至少要有一个

    }, {
        key: "getPosX",
        value: function getPosX(opt) {
            var x = 0;
            var val = opt.val;
            var ind = "ind" in opt ? opt.ind : underscore.indexOf(this.dataSection, val); //如果没有ind 那么一定要有val
            var dataLen = "dataLen" in opt ? opt.dataLen : this.dataSection.length;
            var xGraphsWidth = "xGraphsWidth" in opt ? opt.xGraphsWidth : this.xGraphsWidth;
            var layoutType = "layoutType" in opt ? opt.layoutType : this.layoutType;

            if (dataLen == 1) {
                x = xGraphsWidth / 2;
            } else {
                if (layoutType == "rule") {
                    //折线图的xyaxis就是 rule
                    x = ind / (dataLen - 1) * xGraphsWidth;
                }
                if (layoutType == "proportion") {
                    //按照数据真实的值在minVal - maxVal 区间中的比例值
                    if (val == undefined) {
                        val = ind * (this.maxVal - this.minVal) / (dataLen - 1) + this.minVal;
                    }
                    x = xGraphsWidth * ((val - this.minVal) / (this.maxVal - this.minVal));
                }
                if (layoutType == "peak") {
                    //柱状图的就是peak 
                    x = this.xDis * (ind + 1) - this.xDis / 2;
                }
                //if( layoutType == "step" ){
                //    x = (xGraphsWidth / (dataLen + 1)) * (ind + 1);
                //};
            }

            if (this.posParseToInt) {
                return parseInt(x, 10);
            } else {
                return x;
            }
        }
    }, {
        key: "_trimXAxis",
        value: function _trimXAxis($data, $xGraphsWidth) {

            var tmpData = [];
            var data = $data || this.dataSection;
            var xGraphsWidth = xGraphsWidth || this.xGraphsWidth;

            this.xDis = xGraphsWidth / data.length; //这个属性目前主要是柱状图有分组柱状图的场景在用

            for (var a = 0, al = data.length; a < al; a++) {
                var layoutText = this._getFormatText(data[a]);
                var txt = new canvax.Display.Text(layoutText, {
                    context: {
                        fontSize: this.text.fontSize
                    }
                });

                var o = {
                    'content': data[a],
                    'x': this.getPosX({
                        val: data[a],
                        ind: a,
                        dataLen: al,
                        xGraphsWidth: xGraphsWidth
                    }),
                    'textWidth': txt.getTextWidth()
                };

                tmpData.push(o);
            }
            return tmpData;
        }
    }, {
        key: "_formatDataSectionText",
        value: function _formatDataSectionText(arr) {
            if (!arr) {
                arr = this.dataSection;
            }
            var me = this;
            var currArr = [];
            underscore.each(arr, function (val) {
                currArr.push(me._getFormatText(val));
            });
            return currArr;
        }
    }, {
        key: "_getXAxisDisLine",
        value: function _getXAxisDisLine() {
            //获取x轴两端预留的距离
            var disMin = this.disXAxisLine;
            var disMax = 2 * disMin;
            var dis = disMin;
            dis = disMin + this.width % underscore.flatten(this.dataOrg).length;
            dis = dis > disMax ? disMax : dis;
            dis = isNaN(dis) ? 0 : dis;
            return dis;
        }
    }, {
        key: "_setXAxisHeight",
        value: function _setXAxisHeight() {
            //检测下文字的高等
            if (!this.display) {
                //this.display == "none"
                this.dis = 0;
                this.height = 3; //this.dis;//this.max.txtH;
            } else {
                var txt = new canvax.Display.Text(this._layoutDataSection[0] || "test", {
                    context: {
                        fontSize: this.text.fontSize
                    }
                });

                this.maxTxtH = txt.getTextHeight();

                if (!!this.text.rotation) {
                    if (this.text.rotation % 90 == 0) {
                        this.height = this._textMaxWidth + this.line.height + this.disY + this.dis + 3;
                    } else {
                        var sinR = Math.sin(Math.abs(this.text.rotation) * Math.PI / 180);
                        var cosR = Math.cos(Math.abs(this.text.rotation) * Math.PI / 180);
                        this.height = sinR * this._textMaxWidth + txt.getTextHeight() + 5;
                        this.leftDisX = cosR * txt.getTextWidth() + 8;
                    }
                } else {
                    this.height = this.disY + this.line.height + this.dis + this.maxTxtH;
                    this.leftDisX = txt.getTextWidth() / 2;
                }
            }
        }
    }, {
        key: "_getFormatText",
        value: function _getFormatText(text) {
            var res;
            if (underscore.isFunction(this.text.format)) {
                res = this.text.format(text);
            } else {
                res = text;
            }
            if (underscore.isArray(res)) {
                res = Tools.numAddSymbol(res);
            }
            if (!res) {
                res = text;
            }
            return res;
        }
    }, {
        key: "_widget",
        value: function _widget() {
            if (!this.display) return;

            var arr = this.layoutData;

            if (this._label) {
                this._label.context.x = this.xGraphsWidth + 5;
                this.sprite.addChild(this._label);
            }

            var delay = Math.min(1000 / arr.length, 25);

            for (var a = 0, al = arr.length; a < al; a++) {
                var xNodeId = "xNode" + a;

                var xNode = this.rulesSprite.getChildById(xNodeId);
                if (!xNode) {
                    xNode = new canvax.Display.Sprite({
                        id: xNodeId
                    });
                    this.rulesSprite.addChild(xNode);
                }

                xNode.context.visible = !!arr[a].visible;

                var o = arr[a];
                var x = o.x,
                    y = this.disY + this.line.height + this.dis;

                //文字
                var textContext = {
                    x: o.text_x || o.x,
                    y: y + 20,
                    fillStyle: this.text.fillStyle,
                    fontSize: this.text.fontSize,
                    rotation: -Math.abs(this.text.rotation),
                    textAlign: this.text.textAlign,
                    textBaseline: !!this.text.rotation ? "middle" : "top",
                    globalAlpha: 0
                };

                if (!!this.text.rotation && this.text.rotation != 90) {
                    textContext.x += 5;
                    textContext.y += 3;
                }

                if (xNode._txt) {
                    //_.extend( xNode._txt.context , textContext );
                    //debugger
                    xNode._txt.resetText(o.layoutText + "");
                    if (this.animation) {
                        xNode._txt.animate({
                            x: textContext.x
                        }, {
                            duration: 300
                        });
                    } else {
                        xNode._txt.context.x = textContext.x;
                    }
                } else {

                    xNode._txt = new canvax.Display.Text(o.layoutText, {
                        id: "xAxis_txt_" + a,
                        context: textContext
                    });
                    xNode.addChild(xNode._txt);

                    //新建的 txt的 动画方式
                    if (this.animation && !this.resize) {
                        xNode._txt.animate({
                            globalAlpha: 1,
                            y: xNode._txt.context.y - 20
                        }, {
                            duration: 500,
                            easing: 'Back.Out', //Tween.Easing.Elastic.InOut
                            delay: a * delay,
                            id: xNode._txt.id
                        });
                    } else {
                        xNode._txt.context.y = xNode._txt.context.y - 20;
                        xNode._txt.context.globalAlpha = 1;
                    }
                }

                if (this.line.enabled) {
                    var lineContext = {
                        x: x,
                        y: this.disY,
                        end: {
                            x: 0,
                            y: this.line.height + this.disY
                        },
                        lineWidth: this.line.width,
                        strokeStyle: this.line.strokeStyle
                    };
                    if (xNode._line) {
                        //_.extend( xNode._txt.context , textContext );
                        if (this.animation) {
                            xNode._line.animate({
                                x: lineContext.x
                            }, {
                                duration: 300
                            });
                        } else {
                            xNode._line.context.x = lineContext.x;
                        }
                    } else {
                        xNode._line = new Line$3({
                            context: lineContext
                        });
                        xNode.addChild(xNode._line);
                    }
                }

                //这里可以由用户来自定义过滤 来 决定 该node的样式
                underscore.isFunction(this.filter) && this.filter({
                    layoutData: arr,
                    index: a,
                    txt: xNode._txt,
                    line: xNode._line || null
                });
            }

            //把sprite.children中多余的给remove掉
            if (this.rulesSprite.children.length > arr.length) {
                for (var al = arr.length, pl = this.rulesSprite.children.length; al < pl; al++) {
                    this.rulesSprite.getChildAt(al).remove();
                    al--, pl--;
                }
            }
        }
    }, {
        key: "_setTextMaxWidth",
        value: function _setTextMaxWidth() {
            var arr = this._layoutDataSection;
            var maxLenText = arr[0];

            for (var a = 0, l = arr.length; a < l; a++) {
                if ((arr[a] + '').length > maxLenText.length) {
                    maxLenText = arr[a];
                }
            }

            var txt = new canvax.Display.Text(maxLenText || "test", {
                context: {
                    fillStyle: this.text.fillStyle,
                    fontSize: this.text.fontSize
                }
            });

            this._textMaxWidth = txt.getTextWidth();
            this._textMaxHeight = txt.getTextHeight();

            return this._textMaxWidth;
        }
    }, {
        key: "_trimLayoutData",
        value: function _trimLayoutData() {
            var me = this;
            var arr = this.data;
            var l = arr.length;

            if (!this.display || !l) return;

            // rule , peak, proportion
            if (me.layoutType == "proportion") {
                this._checkOver();
            }
            if (me.layoutType == "peak") {
                //TODO: peak暂时沿用 _checkOver ，这是保险的万无一失的。
                this._checkOver();
            }

            if (me.layoutType == "rule") {
                this._checkOver();
            }
        }
    }, {
        key: "_getRootPR",
        value: function _getRootPR() {
            //找到paddingRight,在最后一个文本右移的时候需要用到
            var rootPaddingRight = 0;
            if (this._coordinate._root) {
                rootPaddingRight = this._coordinate._root.padding.right;
            }
            return rootPaddingRight;
        }
    }, {
        key: "_checkOver",
        value: function _checkOver() {
            var me = this;
            var arr = me.data;

            //现在的柱状图的自定义datasection有缺陷
            if (me.trimLayout) {
                //如果用户有手动的 trimLayout ，那么就全部visible为true，然后调用用户自己的过滤程序
                //trimLayout就事把arr种的每个元素的visible设置为true和false的过程
                me.trimLayout(arr);
                me.layoutData = me.data;
                return;
            }

            var l = arr.length;

            function checkOver(i) {
                var curr = arr[i];

                if (curr === undefined) {
                    return;
                }
                curr.visible = true;
                for (var ii = i; ii < l - 1; ii++) {
                    var next = arr[ii + 1];

                    var nextWidth = next.textWidth;
                    var currWidth = curr.textWidth;

                    //如果有设置rotation，那么就固定一个最佳可视单位width为35  暂定
                    if (!!me.text.rotation) {
                        nextWidth = 35;
                        currWidth = 35;
                    }

                    var next_x = next.x;
                    if (me.text.textAlign == "center") {
                        next_x = next.x - nextWidth / 2;
                    }

                    if (ii == l - 2) {
                        //next是最后一个
                        if (me.text.textAlign == "center" && next.x + nextWidth / 2 > me.width) {
                            next_x = me.width - nextWidth;
                            next.text_x = me.width - nextWidth / 2 + me._getRootPR();
                        }
                        if (me.text.textAlign == "left" && next.x + nextWidth > me.width) {
                            next_x = me.width - nextWidth;
                            next.text_x = me.width - nextWidth;
                        }
                    }

                    if (next_x < curr.x + currWidth / 2) {
                        if (ii == l - 2) {
                            //最后一个的话，反把前面的给hide
                            next.visible = true;
                            curr.visible = false;
                            return;
                        } else {
                            next.visible = false;
                        }
                    } else {
                        checkOver(ii + 1);
                        break;
                    }
                }
            }

            checkOver(0);

            this.layoutData = this.data;
        }
    }]);
    return xAxis;
}(component);

var Line$4 = canvax.Shapes.Line;

var yAxis = function (_Component) {
    inherits$1(yAxis, _Component);

    function yAxis(opt, data) {
        classCallCheck$1(this, yAxis);

        var _this = possibleConstructorReturn$1(this, (yAxis.__proto__ || Object.getPrototypeOf(yAxis)).call(this));

        _this._opt = opt;

        _this.width = null;
        _this.display = true; //true false 1,0都可以
        _this.dis = 6; //线到文本的距离
        _this.maxW = 0; //最大文本的 width
        _this.field = []; //这个 轴 上面的 field

        _this.label = "";
        _this._label = null; //label 的text对象

        _this.line = {
            enabled: 1, //是否有line
            width: 4,
            lineWidth: 1,
            strokeStyle: '#cccccc'
        };

        _this.text = {
            fillStyle: '#999',
            fontSize: 12,
            format: null,
            rotation: 0
        };
        _this.pos = {
            x: 0,
            y: 0
        };
        _this.place = "left"; //yAxis轴默认是再左边，但是再双轴的情况下，可能会right
        _this.biaxial = false; //是否是双轴中的一份
        _this.layoutData = []; //dataSection 对应的layout数据{y:-100, content:'1000'}
        _this.dataSection = []; //从原数据 dataOrg 中 结果 datasection 重新计算后的数据

        //默认的 dataSectionGroup = [ dataSection ], dataSection 其实就是 dataSectionGroup 去重后的一维版本
        _this.dataSectionGroup = [];

        //如果middleweight有设置的话 dataSectionGroup 为被middleweight分割出来的n个数组>..[ [0,50 , 100],[100,500,1000] ]
        _this.middleweight = null;

        _this.dataOrg = data.org || []; //源数据

        _this.sprite = null;
        //this.x           = 0;
        //this.y           = 0;
        _this.disYAxisTopLine = 6; //y轴顶端预留的最小值
        _this.yMaxHeight = 0; //y轴最大高
        _this.yGraphsHeight = 0; //y轴第一条线到原点的高

        _this.baseNumber = null; //为非负number
        _this.basePoint = null; //value为 baseNumber 的point {x,y}
        _this.bottomNumber = null; //如果手动设置了 bottomNumber 为负数，则baseNumber＝0，否则baseNumber 就 等于设置的 bottomNumber

        _this._yOriginTrans = 0; //当设置的 baseNumber 和datasection的min不同的时候，


        //过滤器，可以用来过滤哪些yaxis 的 节点是否显示已经颜色之类的
        //@params params包括 dataSection , 索引index，txt(canvax element) ，line(canvax element) 等属性
        _this.filter = null; //function(params){}; 

        _this.isH = false; //是否横向

        _this.animation = true;
        _this.resize = false;

        _this.sort = null; //"asc" //排序，默认从小到大, desc为从大到小，之所以不设置默认值为asc，是要用null来判断用户是否进行了配置

        _this.layoutType = "proportion"; // rule , peak, proportion

        _this.init(opt, data);
        return _this;
    }

    createClass$1(yAxis, [{
        key: "init",
        value: function init(opt, data) {
            underscore.deepExtend(this, opt);

            if (this.text.rotation != 0 && this.text.rotation % 90 == 0) {
                this.isH = true;
            }

            this._initData(data);
            this.sprite = new canvax.Display.Sprite({
                id: "yAxisSprite_" + new Date().getTime()
            });
            this.rulesSprite = new canvax.Display.Sprite({
                id: "yRulesSprite_" + new Date().getTime()
            });
            this.sprite.addChild(this.rulesSprite);
        }

        //配置和数据变化

    }, {
        key: "reset",
        value: function reset(opt, data) {
            this.dataSection = [];
            this.dataSectionGroup = [];

            opt && underscore.deepExtend(this, opt);

            if (data.org) {
                this.dataOrg = data.org; //这里必须是data.org
            }

            this._initData(data);
            this._trimYAxis();
            this._widget();
        }
    }, {
        key: "setX",
        value: function setX($n) {
            this.sprite.context.x = $n + (this.place == "left" ? Math.max(this.maxW, this.width - this.pos.x - this.dis - this.line.width) : 0);
            this.pos.x = $n;
        }
    }, {
        key: "setY",
        value: function setY($n) {
            this.sprite.context.y = $n;
            this.pos.y = $n;
        }
    }, {
        key: "setAllStyle",
        value: function setAllStyle(sty) {
            underscore.each(this.rulesSprite.children, function (s) {
                underscore.each(s.children, function (cel) {
                    if (cel.type == "text") {
                        cel.context.fillStyle = sty;
                    } else if (cel.type == "line") {
                        cel.context.strokeStyle = sty;
                    }
                });
            });
        }
    }, {
        key: "_getLabel",
        value: function _getLabel() {
            var _label = "";
            if (underscore.isArray(this.label)) {
                _label = this.label[this.place == "left" ? 0 : 1];
            } else {
                _label = this.label;
            }

            if (_label && _label != "") {
                this._label = new canvax.Display.Text(_label, {
                    context: {
                        fontSize: this.text.fontSize,
                        textAlign: this.place, //"left",
                        textBaseline: this.isH ? "top" : "bottom",
                        fillStyle: this.text.fillStyle,
                        rotation: this.isH ? -90 : 0
                    }
                });
            }
        }
    }, {
        key: "draw",
        value: function draw(opt) {
            opt && underscore.deepExtend(this, opt);
            this._getLabel();
            this.yGraphsHeight = this.yMaxHeight - this._getYAxisDisLine();

            if (this._label) {
                if (this.isH) {
                    this.yGraphsHeight -= this._label.getTextWidth();
                } else {
                    this.yGraphsHeight -= this._label.getTextHeight();
                }
                this._label.context.y = -this.yGraphsHeight - 5;
            }

            this._trimYAxis();
            this._widget();

            this.setX(this.pos.x);
            this.setY(this.pos.y);

            this.resize = false;
        }

        //更具y轴的值来输出对应的在y轴上面的位置

    }, {
        key: "getYposFromVal",
        value: function getYposFromVal(val) {

            var y = 0;
            var dsgLen = this.dataSectionGroup.length;
            var yGroupHeight = this.yGraphsHeight / dsgLen;

            for (var i = 0, l = dsgLen; i < l; i++) {
                var ds = this.dataSectionGroup[i];
                var min = underscore.min(ds);
                var max = underscore.max(ds);
                var valInd = underscore.indexOf(ds, val);

                if (val >= min && val <= max || valInd >= 0) {
                    if (this.layoutType == "proportion") {
                        var _baseNumber = this.baseNumber;
                        //如果 baseNumber 并不在这个区间
                        if (_baseNumber < min || _baseNumber > max) {
                            _baseNumber = min;
                        } else {
                            //如果刚好在这个区间Group

                        }
                        var maxGroupDisABS = Math.max(Math.abs(max - _baseNumber), Math.abs(_baseNumber - min));
                        var amountABS = Math.abs(max - min);
                        var h = maxGroupDisABS / amountABS * yGroupHeight;

                        y = (val - _baseNumber) / maxGroupDisABS * h + i * yGroupHeight;
                    }
                    if (this.layoutType == "rule") {
                        //line 的xaxis就是 rule
                        y = valInd / (ds.length - 1) * yGroupHeight;
                    }
                    if (this.layoutType == "peak") {
                        //bar的xaxis就是 peak
                        y = yGroupHeight / ds.length * (valInd + 1) - yGroupHeight / ds.length / 2;
                    }

                    y += this._yOriginTrans;
                    break;
                }
            }
            //返回的y是以最底端为坐标原点的坐标值，所以就是负数
            if (this.sort == "desc") {
                y = Math.abs(this.yGraphsHeight - Math.abs(y));
            }
            return -y;
        }
    }, {
        key: "getValFromYpos",
        value: function getValFromYpos(y) {
            var start = this.layoutData[0];
            var end = this.layoutData.slice(-1)[0];
            var val = (end.content - start.content) * ((y - start.y) / (end.y - start.y)) + start.content;
            return val;
        }
    }, {
        key: "_getYOriginTrans",
        value: function _getYOriginTrans(baseNumber) {
            var y = 0;
            var dsgLen = this.dataSectionGroup.length;
            var yGroupHeight = this.yGraphsHeight / dsgLen;

            for (var i = 0, l = dsgLen; i < l; i++) {
                var ds = this.dataSectionGroup[i];
                var min = underscore.min(ds);
                var max = underscore.max(ds);

                var amountABS = Math.abs(max - min);

                if (baseNumber >= min && baseNumber <= max) {
                    y = (baseNumber - min) / amountABS * yGroupHeight + i * yGroupHeight;
                    break;
                }
            }

            y = isNaN(y) ? 0 : parseInt(y);

            if (this.sort == "desc") {
                //如果是倒序的
                y = -(yGroupHeight - Math.abs(y));
            }

            return y;
        }
    }, {
        key: "_trimYAxis",
        value: function _trimYAxis() {

            var tmpData = [];
            //这里指的是坐标圆点0，需要移动的距离，因为如果有负数的话，最下面的坐标圆点应该是那个负数。
            //this._yOriginTrans = this._getYOriginTrans( 0 );


            var originVal = underscore.min(this.dataSection);
            if (originVal < 0) {
                originVal = 0;
            }

            //originVal = this.baseNumber;

            this._yOriginTrans = this._getYOriginTrans(originVal);

            //设置 basePoint
            this.basePoint = {
                content: this.baseNumber,
                y: this.getYposFromVal(this.baseNumber)
            };

            for (var a = 0, al = this.dataSection.length; a < al; a++) {
                tmpData[a] = {
                    content: this.dataSection[a],
                    y: this.getYposFromVal(this.dataSection[a])
                };
            }
            this.layoutData = tmpData;
        }
    }, {
        key: "_getYAxisDisLine",
        value: function _getYAxisDisLine() {
            //获取y轴顶高到第一条线之间的距离         
            var disMin = this.disYAxisTopLine;
            var disMax = 2 * disMin;
            var dis = disMin;
            dis = disMin + this.yMaxHeight % this.dataSection.length;
            dis = dis > disMax ? disMax : dis;
            return dis;
        }
    }, {
        key: "_setDataSection",
        value: function _setDataSection(data) {
            var vLen = 1;
            var field = data.field;

            //如果没有传field，那么就默认按照一维数据获取section
            if (field) {
                if (!underscore.isArray(field)) {
                    field = [field];
                }
                underscore.each(data.field, function (f) {
                    vLen = Math.max(vLen, 1);
                    if (underscore.isArray(f)) {
                        underscore.each(f, function (_f) {
                            vLen = Math.max(vLen, 2);
                        });
                    }
                });
            }

            if (vLen == 1) {
                return this._oneDimensional(data);
            }
            if (vLen == 2) {
                return this._twoDimensional(data);
            }
        }
    }, {
        key: "_oneDimensional",
        value: function _oneDimensional(data) {
            var arr = [];
            var d = data.org || data.data || data;
            if (!this.biaxial) {
                arr = underscore.flatten(d); //_.flatten( data.org );
            } else {
                if (this.place == "left") {
                    arr = underscore.flatten(d[0]);
                    this.field = underscore.flatten([this.field[0]]);
                } else {
                    arr = underscore.flatten(d[1]);
                    this.field = underscore.flatten([this.field[1]]);
                }
            }
            for (var i = 0, il = arr.length; i < il; i++) {
                arr[i] = arr[i] || 0;
            }

            return arr;
        }

        //二维的yAxis设置，肯定是堆叠的比如柱状图，后续也会做堆叠的折线图， 就是面积图

    }, {
        key: "_twoDimensional",
        value: function _twoDimensional(data) {
            var arr = [];
            var min;
            underscore.each(data.org, function (d, i) {
                if (!d.length) {
                    return;
                }

                //有数据的情况下 
                if (!underscore.isArray(d[0])) {
                    arr.push(d);
                    return;
                }

                var varr = [];
                var len = d[0].length;
                var vLen = d.length;

                for (var i = 0; i < len; i++) {
                    var up_count = 0;
                    var up_i = 0;

                    var down_count = 0;
                    var down_i = 0;

                    for (var ii = 0; ii < vLen; ii++) {
                        !min && (min = d[ii][i]);
                        min = Math.min(min, d[ii][i]);

                        if (d[ii][i] >= 0) {
                            up_count += d[ii][i];
                            up_i++;
                        } else {
                            down_count += d[ii][i];
                            down_i++;
                        }
                    }
                    up_i && varr.push(up_count);
                    down_i && varr.push(down_count);
                }
                arr.push(varr);
            });
            arr.push(min);
            return underscore.flatten(arr);
        }
    }, {
        key: "_initData",
        value: function _initData(data) {

            //TODO:begin 临时解决多y轴的情况下，有两个自定义datasection的情况
            if (underscore.isArray(this.dataSection) && this.dataSection.length && underscore.isArray(this.dataSection[0])) {
                this.dataSection = this.dataSection[this.place == "left" ? 0 : 1] || [];
            }
            //end

            //先要矫正子啊field确保一定是个array
            if (!underscore.isArray(this.field)) {
                this.field = [this.field];
            }

            var arr = this._setDataSection(data);
            if (this.bottomNumber != null) {
                arr.push(this.bottomNumber);
            }
            if (arr.length == 1) {
                arr.push(arr[0] * 2);
            }

            //如果用户传入了自定义的dataSection， 那么优先级最高
            if (!this._opt.dataSection) {

                if (this._opt.baseNumber != undefined) {
                    arr.push(this.baseNumber);
                }
                if (this._opt.minNumber != undefined) {
                    arr.push(this.minNumber);
                }
                if (this._opt.maxNumber != undefined) {
                    arr.push(this.maxNumber);
                }

                for (var ai = 0, al = arr.length; ai < al; ai++) {
                    arr[ai] = Number(arr[ai]);
                    if (isNaN(arr[ai])) {
                        arr.splice(ai, 1);
                        ai--;
                        al--;
                    }
                }

                this.dataSection = DataSection.section(arr, 3);
            }

            //如果还是0
            if (this.dataSection.length == 0) {
                this.dataSection = [0];
            }
            this.dataSectionGroup = [underscore.clone(this.dataSection)];

            this._sort();
            this._setBottomAndBaseNumber();

            this._middleweight(); //如果有middleweight配置，需要根据配置来重新矫正下datasection
        }

        //yVal 要被push到datasection 中去的 值

    }, {
        key: "resetDataSection",
        value: function resetDataSection(yVal) {

            if (yVal < underscore.min(this.dataSection) || yVal > underscore.max(this.dataSection)) {
                this.dataSection.push(yVal);
                this._initData({
                    //field: this.field,
                    org: this.dataSection
                });
            }
        }
    }, {
        key: "_sort",
        value: function _sort() {
            if (this.sort) {
                var sort = this._getSortType();
                if (sort == "desc") {
                    this.dataSection.reverse();

                    //dataSectionGroup 从里到外全部都要做一次 reverse， 这样就可以对应上 dataSection.reverse()
                    underscore.each(this.dataSectionGroup, function (dsg, i) {
                        dsg.reverse();
                    });
                    this.dataSectionGroup.reverse();
                    //dataSectionGroup reverse end
                }
            }
        }
    }, {
        key: "_getSortType",
        value: function _getSortType() {
            var _sort;
            if (underscore.isString(this.sort)) {
                _sort = this.sort;
            }
            if (underscore.isArray(this.sort)) {
                _sort = this.sort[this.place == "left" ? 0 : 1];
            }
            if (!_sort) {
                _sort = "asc";
            }
            return _sort;
        }
    }, {
        key: "_setBottomAndBaseNumber",
        value: function _setBottomAndBaseNumber() {
            if (this.bottomNumber == null) {
                this.bottomNumber = this.dataSection[0];
            }

            //没人情况下 baseNumber 就是datasection的最小值
            if (this._opt.baseNumber == undefined || this._opt.baseNumber == null) {
                this.baseNumber = this.dataSection[0]; //_.min( this.dataSection );
                if (this.baseNumber < 0) {
                    this.baseNumber = 0;
                }
            }
        }
    }, {
        key: "_middleweight",
        value: function _middleweight() {
            if (this.middleweight) {
                //支持多个量级的设置
                //量级的设置只支持非sort的柱状图场景，否则这里修改过的datasection会和 _initData 中sort过的逻辑有冲突
                if (!underscore.isArray(this.middleweight)) {
                    this.middleweight = [this.middleweight];
                }

                //拿到dataSection中的min和 max 后，用middleweight数据重新设置一遍dataSection
                var dMin = underscore.min(this.dataSection);
                var dMax = underscore.max(this.dataSection);
                var newDS = [dMin];
                var newDSG = [];

                for (var i = 0, l = this.middleweight.length; i < l; i++) {
                    var preMiddleweight = dMin;
                    if (i > 0) {
                        preMiddleweight = this.middleweight[i - 1];
                    }
                    var middleVal = preMiddleweight + parseInt((this.middleweight[i] - preMiddleweight) / 2);

                    newDS.push(middleVal);
                    newDS.push(this.middleweight[i]);

                    newDSG.push([preMiddleweight, middleVal, this.middleweight[i]]);
                }
                var lastMW = this.middleweight.slice(-1)[0];
                newDS.push(lastMW + (dMax - lastMW) / 2);
                newDS.push(dMax);

                newDSG.push([lastMW, lastMW + (dMax - lastMW) / 2, dMax]);

                //好了。 到这里用简单的规则重新拼接好了新的 dataSection
                this.dataSection = newDS;
                this.dataSectionGroup = newDSG;

                //因为重新设置过了 dataSection 所以要重新排序和设置bottom and base 值
                this._sort();
                this._setBottomAndBaseNumber();
            }
        }
    }, {
        key: "resetWidth",
        value: function resetWidth(width) {
            var self = this;
            self.width = width;
            if (self.line.enabled) {
                self.sprite.context.x = width - self.dis - self.line.width;
            } else {
                self.sprite.context.x = width - self.dis;
            }
        }
    }, {
        key: "_widget",
        value: function _widget() {
            var self = this;
            if (!self.display) {
                self.width = 0;
                return;
            }

            var arr = this.layoutData;
            self.maxW = 0;
            self._label && self.sprite.addChild(self._label);
            for (var a = 0, al = arr.length; a < al; a++) {
                var o = arr[a];
                var x = 0,
                    y = o.y;
                var content = o.content;

                if (underscore.isFunction(self.text.format)) {
                    content = self.text.format(content, self);
                }
                if (content === undefined || content === null) {
                    content = Tools.numAddSymbol(o.content);
                }

                var textAlign = self.place == "left" ? "right" : "left";
                //为横向图表把y轴反转后的 逻辑
                if (self.text.rotation == 90 || self.text.rotation == -90) {
                    textAlign = "center";
                    if (a == arr.length - 1) {
                        textAlign = "right";
                    }
                }
                var posy = y + (a == 0 ? -3 : 0) + (a == arr.length - 1 ? 3 : 0);
                //为横向图表把y轴反转后的 逻辑
                if (self.text.rotation == 90 || self.text.rotation == -90) {
                    if (a == arr.length - 1) {
                        posy = y - 2;
                    }
                    if (a == 0) {
                        posy = y;
                    }
                }

                var yNode = this.rulesSprite.getChildAt(a);

                if (yNode) {
                    if (yNode._txt) {
                        if (yNode._txt.context.y != posy) {
                            yNode._txt.animate({
                                y: posy
                            }, {
                                duration: 500,
                                delay: a * 80,
                                id: yNode._txt.id
                            });
                        }
                        yNode._txt.resetText(content);
                    }

                    yNode._line && yNode._line.animate({
                        y: y
                    }, {
                        duration: 500,
                        delay: a * 80,
                        id: yNode._line.id
                    });
                } else {
                    yNode = new canvax.Display.Sprite({
                        id: "yNode" + a
                    });

                    var aniDis = 20;
                    if (content == self.baseNumber) {
                        aniDis = 0;
                    }
                    if (content < self.baseNumber) {
                        aniDis = -20;
                    }

                    //文字
                    var txt = new canvax.Display.Text(content, {
                        id: "yAxis_txt_" + self.place + "_" + a,
                        context: {
                            x: x + (self.place == "left" ? -5 : 5),
                            y: posy + aniDis,
                            fillStyle: self._getProp(self.text.fillStyle),
                            fontSize: self.text.fontSize,
                            rotation: -Math.abs(this.text.rotation),
                            textAlign: textAlign,
                            textBaseline: "middle",
                            globalAlpha: 0
                        }
                    });
                    yNode.addChild(txt);
                    yNode._txt = txt;

                    self.maxW = Math.max(self.maxW, txt.getTextWidth());
                    if (self.text.rotation == 90 || self.text.rotation == -90) {
                        self.maxW = Math.max(self.maxW, txt.getTextHeight());
                    }

                    if (self.line.enabled) {
                        //线条
                        var line = new Line$4({
                            context: {
                                x: 0 + (self.place == "left" ? +1 : -1) * self.dis - 2,
                                y: y,
                                end: {
                                    x: self.line.width,
                                    y: 0
                                },
                                lineWidth: self.line.lineWidth,
                                strokeStyle: self._getProp(self.line.strokeStyle)
                            }
                        });
                        yNode.addChild(line);
                        yNode._line = line;
                    }
                    //这里可以由用户来自定义过滤 来 决定 该node的样式
                    underscore.isFunction(self.filter) && self.filter({
                        layoutData: self.layoutData,
                        index: a,
                        txt: txt,
                        line: line
                    });

                    self.rulesSprite.addChild(yNode);

                    //如果是resize的话也不要处理动画
                    if (self.animation && !self.resize) {
                        txt.animate({
                            globalAlpha: 1,
                            y: txt.context.y - aniDis
                        }, {
                            duration: 500,
                            easing: 'Back.Out', //Tween.Easing.Elastic.InOut
                            delay: (a + 1) * 80,
                            id: txt.id
                        });
                    } else {
                        txt.context.y = txt.context.y - aniDis;
                        txt.context.globalAlpha = 1;
                    }
                }
            }

            //把 rulesSprite.children中多余的给remove掉
            if (self.rulesSprite.children.length > arr.length) {
                for (var al = arr.length, pl = self.rulesSprite.children.length; al < pl; al++) {
                    self.rulesSprite.getChildAt(al).remove();
                    al--, pl--;
                }
            }

            self.maxW += self.dis;

            //self.rulesSprite.context.x = self.maxW + self.pos.x;
            //self.pos.x = self.maxW + self.pos.x;
            if (self.width == null) {
                if (self.line.enabled) {
                    self.width = self.maxW + self.dis + self.line.width + self.pos.x;
                } else {
                    self.width = self.maxW + self.dis + self.pos.x;
                }
            }
        }
    }, {
        key: "_getProp",
        value: function _getProp(s) {
            var res = s;
            if (underscore.isFunction(s)) {
                res = s.call(this, this);
            }
            if (!s) {
                res = "#999";
            }
            return res;
        }
    }]);
    return yAxis;
}(component);

var Line$5 = canvax.Shapes.Line;
var Rect$3 = canvax.Shapes.Rect;

var Back = function (_Component) {
    inherits$1(Back, _Component);

    function Back(opt, root) {
        classCallCheck$1(this, Back);

        var _this = possibleConstructorReturn$1(this, (Back.__proto__ || Object.getPrototypeOf(Back)).call(this, opt, root));

        _this.w = 0;
        _this.h = 0;
        _this.root = root; //该组件被添加到的目标图表项目，

        _this.pos = {
            x: 0,
            y: 0
        };

        _this.enabled = 1;

        _this.xOrigin = { //原点开始的x轴线
            enabled: 1,
            lineWidth: 1,
            strokeStyle: '#ccc'
        };
        _this.yOrigin = { //原点开始的y轴线               
            enabled: 1,
            lineWidth: 1,
            strokeStyle: '#ccc'
        };
        _this.xAxis = { //x轴上的线
            enabled: 1,
            data: [], //[{y:100},{}]
            org: null, //x轴坐标原点，默认为上面的data[0]
            // data     : [{y:0},{y:-100},{y:-200},{y:-300},{y:-400},{y:-500},{y:-600},{y:-700}],
            lineType: 'solid', //线条类型(dashed = 虚线 | '' = 实线)
            lineWidth: 1,
            strokeStyle: '#f0f0f0', //'#e5e5e5',
            filter: null
        };
        _this.yAxis = { //y轴上的线
            enabled: 0,
            data: [], //[{x:100},{}]
            xDis: 0,
            org: null, //y轴坐标原点，默认为上面的data[0]
            // data     : [{x:100},{x:200},{x:300},{x:400},{x:500},{x:600},{x:700}],
            lineType: 'solid', //线条类型(dashed = 虚线 | '' = 实线)
            lineWidth: 1,
            strokeStyle: '#f0f0f0', //'#e5e5e5',
            filter: null
        };
        _this.fill = {
            fillStyle: null,
            alpha: null
        };

        _this.sprite = null; //总的sprite
        _this.xAxisSp = null; //x轴上的线集合
        _this.yAxisSp = null; //y轴上的线集合

        _this.animation = true;
        _this.resize = false;

        _this.init(opt);
        return _this;
    }

    createClass$1(Back, [{
        key: "init",
        value: function init(opt) {
            underscore.deepExtend(this, opt);
            this.sprite = new canvax.Display.Sprite();
        }
    }, {
        key: "setX",
        value: function setX($n) {
            this.sprite.context.x = $n;
        }
    }, {
        key: "setY",
        value: function setY($n) {
            this.sprite.context.y = $n;
        }
    }, {
        key: "draw",
        value: function draw(opt) {
            underscore.deepExtend(this, opt);
            //this._configData(opt);
            this._widget();
            this.setX(this.pos.x);
            this.setY(this.pos.y);
        }
    }, {
        key: "clean",
        value: function clean() {
            this.sprite.removeAllChildren();
        }
    }, {
        key: "reset",
        value: function reset(opt) {
            this.sprite.removeAllChildren();
            this.draw(opt);
        }
    }, {
        key: "_widget",
        value: function _widget() {

            var self = this;
            if (!this.enabled) {
                return;
            }

            var _yAxis = self.root._yAxisLeft || self.root._yAxis || self.root;

            if (self.root && _yAxis && _yAxis.dataSectionGroup) {
                self.yGroupSp = new canvax.Display.Sprite(), self.sprite.addChild(self.yGroupSp);
                for (var g = 0, gl = _yAxis.dataSectionGroup.length; g < gl; g++) {
                    var yGroupHeight = _yAxis.yGraphsHeight / gl;
                    var groupRect = new Rect$3({
                        context: {
                            x: 0,
                            y: -yGroupHeight * g,
                            width: self.w,
                            height: -yGroupHeight,
                            fillStyle: self.fill.fillStyle || "#000",
                            fillAlpha: self.fill.alpha || 0.025 * (g % 2)
                        }
                    });

                    self.yGroupSp.addChild(groupRect);
                }
            }

            self.xAxisSp = new canvax.Display.Sprite(), self.sprite.addChild(self.xAxisSp);
            self.yAxisSp = new canvax.Display.Sprite(), self.sprite.addChild(self.yAxisSp);

            //x轴方向的线集合
            var arr = self.xAxis.data;
            for (var a = 0, al = arr.length; a < al; a++) {
                var o = arr[a];

                var line = new Line$5({
                    id: "back_line_" + a,
                    context: {
                        y: o.y,
                        lineType: self.xAxis.lineType,
                        lineWidth: self.xAxis.lineWidth,
                        strokeStyle: self.xAxis.strokeStyle
                    }
                });
                if (self.xAxis.enabled) {
                    underscore.isFunction(self.xAxis.filter) && self.xAxis.filter.apply(line, [{
                        layoutData: self.yAxis.data,
                        index: a,
                        line: line
                    }, self]);
                    self.xAxisSp.addChild(line);

                    if (this.animation && !this.resize) {
                        line.animate({
                            start: {
                                x: 0
                            },
                            end: {
                                x: self.w
                            }
                        }, {
                            duration: 500,
                            //easing : 'Back.Out',//Tween.Easing.Elastic.InOut
                            delay: (al - a) * 80,
                            id: line.id
                        });
                    } else {
                        line.context.xStart = 0;
                        line.context.xEnd = self.w;
                    }
                }
            }

            //y轴方向的线集合
            var arr = self.yAxis.data;
            for (var a = 0, al = arr.length; a < al; a++) {
                var o = arr[a];
                var line = new Line$5({
                    context: {
                        x: o.x,
                        start: {
                            x: 0,
                            y: 0
                        },
                        end: {
                            x: 0,
                            y: -self.h
                        },
                        lineType: self.yAxis.lineType,
                        lineWidth: self.yAxis.lineWidth,
                        strokeStyle: self.yAxis.strokeStyle,
                        visible: o.x ? true : false
                    }
                });
                if (self.yAxis.enabled) {
                    underscore.isFunction(self.yAxis.filter) && self.yAxis.filter.apply(line, [{
                        layoutData: self.xAxis.data,
                        index: a,
                        line: line
                    }, self]);
                    self.yAxisSp.addChild(line);
                }
            }

            //原点开始的y轴线
            var xAxisOrg = self.yAxis.org == null ? 0 : underscore.find(self.yAxis.data, function (obj) {
                return obj.content == self.yAxis.org;
            }).x;

            //self.yAxis.org = xAxisOrg;
            var line = new Line$5({
                context: {
                    start: {
                        x: xAxisOrg,
                        y: 0
                    },
                    end: {
                        x: xAxisOrg,
                        y: -self.h
                    },
                    lineWidth: self.yOrigin.lineWidth,
                    strokeStyle: self.yOrigin.strokeStyle
                }
            });
            if (self.yOrigin.enabled) self.sprite.addChild(line);

            if (this.root._yAxisRight) {
                var lineR = new Line$5({
                    context: {
                        start: {
                            x: self.w,
                            y: self.w
                        },
                        end: {
                            x: 0,
                            y: -self.h
                        },
                        lineWidth: self.yOrigin.lineWidth,
                        strokeStyle: self.yOrigin.strokeStyle
                    }
                });
                if (self.yOrigin.enabled) self.sprite.addChild(lineR);
            }

            var line = new Line$5({
                context: {
                    start: {
                        x: 0,
                        y: _yAxis.basePoint.y
                    },
                    end: {
                        x: self.w,
                        y: _yAxis.basePoint.y
                    },
                    lineWidth: self.xOrigin.lineWidth,
                    strokeStyle: self.xOrigin.strokeStyle
                }
            });
            if (self.xOrigin.enabled) self.sprite.addChild(line);
        }
    }]);
    return Back;
}(component);

var Descartes_Component = function (_Component) {
    inherits$1(Descartes_Component, _Component);

    function Descartes_Component(opt, root) {
        classCallCheck$1(this, Descartes_Component);

        var _this = possibleConstructorReturn$1(this, (Descartes_Component.__proto__ || Object.getPrototypeOf(Descartes_Component)).call(this));

        _this._root = root;

        _this._xAxis = null;
        _this._yAxis = [];

        _this._yAxisLeft = null;
        _this._yAxisRight = null;
        _this._back = null;

        _this.graphsWidth = 0;
        _this.graphsHeight = 0;
        _this.graphsX = 0;
        _this.graphsY = 0;

        _this.horizontal = false;

        _this.dataFrame = _this._root.dataFrame;

        _this.xAxis = {
            field: _this.dataFrame.fields[0]
        };
        _this.yAxis = {
            field: _this.dataFrame.fields.slice(1)
        };
        _this.back = {};

        if (opt.horizontal) {
            _this.xAxis.text = {
                rotation: 90
            };
            _this.yAxis.text = {
                rotation: 90
            };
        }

        if ("display" in opt) {
            //如果有给直角坐标系做配置display，就直接通知到xAxis，yAxis，back三个子组件
            _this.xAxis.display = opt.display;
            _this.yAxis.display = opt.display;
            _this.back.enabled = opt.display;
        }

        //所有yAxis的fields 打平后的集合
        //这个集合不是dataFrame.fields，而是从用户的 coordinate 配置中获取，因为位置之类的会不一样
        _this.yAxisFields = [];

        //吧原始的field转换为对应结构的显示树
        //["uv"] --> [{field:'uv',enabled:true , fillStyle: }]
        _this.fieldsDisplayMap = null; //this._opts.yAxis.field || this._opts.yAxis.bar.field );

        _this.init(opt);
        return _this;
    }

    createClass$1(Descartes_Component, [{
        key: "init",
        value: function init(opt) {
            var me = this;
            underscore.deepExtend(this, opt);

            me.sprite = new canvax.Display.Sprite({
                id: "coordinate"
            });
            me._initModules();

            //创建好了坐标系统后，设置 _fieldsDisplayMap 的值，
            // _fieldsDisplayMap 的结构里包含每个字段是否在显示状态的enabled 和 这个字段属于哪个yAxis
            this.fieldsDisplayMap = this._setFieldsDisplay();

            //回写xAxis和yAxis到opt上面。如果用户没有传入任何xAxis 和yAxis的话，
            //这回写很有必要
            opt.xAxis = this.xAxis;
            opt.yAxis = this.yAxis;
        }

        //@opt --> coordinate 节点配置

    }, {
        key: "reset",
        value: function reset(opt, dataFrame) {
            var me = this;
            !opt && (opt = {});
            underscore.deepExtend(this, opt);
            this.dataFrame = dataFrame;

            var _xAxisDataFrame = this._getXaxisDataFrame(this.xAxis.field);
            this._xAxis.reset(opt.xAxis, _xAxisDataFrame);

            var newYaxisFields = [];

            underscore.each(this._yAxis, function (_yAxis) {
                //这个_yAxis是具体的y轴实例
                var yAxisDataFrame = me._getYaxisDataFrame(_yAxis.field);
                var _opt = {};

                if (opt && opt.yAxis) {
                    //TODO: 其实这个场景很少的，一般都是resetData
                    //说明reset有配置的修改
                    var yAxis$$1 = opt.yAxis;
                    if (!underscore.isArray(yAxis$$1)) {
                        yAxis$$1 = [yAxis$$1];
                    }

                    if (_yAxis.place == "left") {
                        //当前是left的话，要从opt里面找到对应的配置
                        _opt = underscore.find(yAxis$$1, function (ya) {
                            return ya.place == "left";
                        }) || yAxis$$1[0];
                    } else {
                        //当前是right的话
                        _opt = underscore.find(yAxis$$1, function (ya) {
                            return ya.place == "right";
                        }) || yAxis$$1[1];
                    }

                    if (_opt && _opt.field) {
                        //有配置新的field进来的话，就说明要切换字段了
                        newYaxisFields = newYaxisFields.concat(underscore.flatten([_opt.field]));

                        //那么 dataFrame 也要重新获取
                        yAxisDataFrame = me._getYaxisDataFrame(_opt.field);
                    }
                }

                _yAxis.reset(_opt, yAxisDataFrame);

                if (newYaxisFields.length > 0) {
                    me.yAxisFields = newYaxisFields;
                }
            });

            this._back.reset({
                animation: false,
                xAxis: {
                    data: this._yAxisLeft.layoutData
                }
            });
        }
    }, {
        key: "draw",
        value: function draw(opt) {
            var _padding = this._root.padding;
            var h = opt.h || this._root.height;
            var w = opt.w || this._root.width;

            if (this.horizontal) {
                //如果是横向的坐标系统，也就是xy对调，那么高宽也要对调
                var _num = w;
                w = h;
                h = _num;
            }

            var y = h - this._xAxis.height;
            var graphsH = y - _padding.top - _padding.bottom;

            //绘制yAxis
            this._yAxisLeft.draw({
                pos: {
                    x: _padding.left,
                    y: y - _padding.bottom
                },
                yMaxHeight: graphsH,
                resize: opt.resize
            });

            var _yAxisW = this._yAxisLeft.width;

            //如果有双轴
            var _yAxisRW = 0;
            if (this._yAxisRight) {
                this._yAxisRight.draw({
                    pos: {
                        x: 0,
                        y: y - _padding.bottom
                    },
                    yMaxHeight: graphsH,
                    resize: opt.resize
                });
                _yAxisRW = this._yAxisRight.width;
                this._yAxisRight.setX(w - _yAxisRW - _padding.right + 1);
            }

            //绘制x轴
            this._xAxis.draw({
                graphh: h - _padding.bottom,
                graphw: w - _yAxisRW - _padding.right,
                yAxisW: _yAxisW + _padding.left, //左边的yAxisWidth
                resize: opt.resize
            });
            if (this._xAxis.yAxisW != _yAxisW) {
                //说明在xaxis里面的时候被修改过了。那么要同步到yaxis
                this._yAxisLeft.resetWidth(this._xAxis.yAxisW);
                _yAxisW = this._xAxis.yAxisW;
            }

            this.graphsWidth = this._xAxis.xGraphsWidth;
            this.graphsHeight = this._yAxisLeft.yGraphsHeight;
            this.graphsX = _yAxisW;
            this.graphsY = y - _padding.bottom;

            //绘制背景网格
            this._back.draw({
                w: this.graphsWidth,
                h: this.graphsHeight,
                xAxis: {
                    data: this._yAxisLeft.layoutData
                },
                yAxis: {
                    data: this._xAxis.layoutData
                },
                yOrigin: {
                    biaxial: this.biaxial
                },
                pos: {
                    x: this.graphsX,
                    y: this.graphsY
                },
                resize: opt.resize
            });

            if (this.horizontal) {
                this._horizontal({
                    w: w,
                    h: h
                });
            }
        }
    }, {
        key: "_initModules",
        value: function _initModules() {

            var _xAxisDataFrame = this._getXaxisDataFrame(this.xAxis.field);
            this._xAxis = new xAxis(this.xAxis, _xAxisDataFrame, this);
            this.sprite.addChild(this._xAxis.sprite);

            //这里定义的是配置
            var yAxis$$1 = this.yAxis;
            var yAxisLeft, yAxisRight;
            var yAxisLeftDataFrame, yAxisRightDataFrame;

            if (!underscore.isArray(yAxis$$1)) {
                yAxis$$1 = [yAxis$$1];
            }

            //left是一定有的
            yAxisLeft = underscore.find(yAxis$$1, function (ya) {
                return ya.place == "left";
            }) || yAxis$$1[0];
            yAxisLeft.place = "left";

            yAxisLeftDataFrame = this._getYaxisDataFrame(yAxisLeft.field);

            this.yAxisFields = underscore.flatten([yAxisLeft.field]);

            //如果过_yAxis配置是个数组，就说明要配置两个y轴对象，就是拥有左右双轴了
            if (yAxis$$1.length > 1) {
                yAxisRight = underscore.find(yAxis$$1, function (ya) {
                    return ya.place == "right";
                }) || yAxis$$1[1];

                yAxisRight.place = "right";
                yAxisRightDataFrame = this._getYaxisDataFrame(yAxisRight.field);
                this.yAxisFields = this.yAxisFields.concat(underscore.flatten([yAxisRight.field]));
            }

            this._yAxisLeft = new yAxis(yAxisLeft, yAxisLeftDataFrame);
            this._yAxisLeft.axis = yAxisLeft;
            //不参与yDatasection的field， remove(field)的时候有用
            this._yAxisLeft.enabledFields = [];
            this.sprite.addChild(this._yAxisLeft.sprite);
            this._yAxis.push(this._yAxisLeft);

            if (yAxisRight) {
                this._yAxisRight = new yAxis(yAxisRight, yAxisRightDataFrame);
                this._yAxisRight.axis = yAxisRight;
                //不参与yDatasection的field， remove(field)的时候有用
                this._yAxisRight.enabledFields = [];
                this.sprite.addChild(this._yAxisRight.sprite);
                this._yAxis.push(this._yAxisRight);
            }

            this._back = new Back(this.back, this);
            this.sprite.addChild(this._back.sprite);
        }

        /**
         * 
         * @param {x,y} size 
         */

    }, {
        key: "_horizontal",
        value: function _horizontal() {

            var me = this;
            var w = me._root.width;
            var h = me._root.height;

            underscore.each([me.sprite.context], function (ctx) {
                ctx.x += (w - h) / 2;
                ctx.y += (h - w) / 2 + me._root.padding.top;
                ctx.rotation = 90;
                ctx.rotateOrigin.x = h / 2;
                ctx.rotateOrigin.y = w / 2;
                ctx.scaleOrigin.x = h / 2;
                ctx.scaleOrigin.y = w / 2;
                ctx.scaleX = -1;
            });

            //把x轴文案做一次镜像反转
            underscore.each(underscore.flatten([this._xAxis]), function (_xAxis) {
                underscore.each(_xAxis.rulesSprite.children, function (xnode) {
                    var ctx = xnode._txt.context;
                    var rect = xnode._txt.getRect();
                    ctx.scaleOrigin.x = rect.x + rect.width / 2;
                    ctx.scaleOrigin.y = rect.y + rect.height / 2;
                    ctx.scaleY = -1;
                });
            });

            //把y轴文案做一次镜像反转
            underscore.each(underscore.flatten([this._yAxis]), function (_yAxis) {
                underscore.each(_yAxis.rulesSprite.children, function (ynode) {
                    var ctx = ynode._txt.context;
                    var rect = ynode._txt.getRect();
                    ctx.scaleOrigin.x = rect.x + rect.width / 2;
                    ctx.scaleOrigin.y = rect.y + rect.height / 2;
                    ctx.scaleY = -1;
                });
            });
        }
    }, {
        key: "getPosX",
        value: function getPosX(opt) {
            return this._xAxis.getPosX(opt);
        }
    }, {
        key: "_getYaxisDataFrame",
        value: function _getYaxisDataFrame(fields) {
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
        key: "_getXaxisDataFrame",
        value: function _getXaxisDataFrame(fields) {
            return {
                field: fields,
                org: this.dataFrame.getDataOrg(fields)
            };
        }
    }, {
        key: "removeField",
        value: function removeField(field) {
            var me = this;

            underscore.each(this._yAxis, function (_yAxis, i) {
                var fs = _yAxis.field;
                if (!underscore.isArray(fs)) {
                    fs = [fs];
                }
                var _fs = underscore.flatten(fs);
                var ind = underscore.indexOf(_fs, field);
                if (ind > -1) {
                    //那么说明这个yAxis轴上面有这个字段，这个yaxis需要reset
                    if (underscore.indexOf(_yAxis.enabledFields, field) == -1) {
                        _yAxis.enabledFields.push(field);
                    }
                    _fs = underscore.difference(_fs, _yAxis.enabledFields);
                    _yAxis.reset(null, me._getYaxisDataFrame(_fs));
                }
            });

            //然后yAxis更新后，对应的背景也要更新
            this._back.reset({
                animation: false,
                xAxis: {
                    data: this._yAxisLeft.layoutData
                }
            });
        }
    }, {
        key: "addField",
        value: function addField(field, targetYAxis) {

            var _yAxis = null;
            if (targetYAxis == "left") {
                _yAxis = this._yAxisLeft;
            }
            if (targetYAxis == "right") {
                _yAxis = this._yAxisRight;
            }

            var _fs = [];
            underscore.each(this._yAxis, function (_y, i) {
                var fs = _y.field;
                if (!underscore.isArray(fs)) {
                    fs = [fs];
                }
                fs = underscore.flatten(fs);

                var ind = underscore.indexOf(fs, field);
                if (ind > -1) {
                    //那么说明这个yAxis轴上面有这个字段，这个yaxis需要reset
                    _yAxis = _y;
                    _fs = fs;
                    return false;
                }
            });

            if (!_yAxis) {
                //如果都没有找到，就默认把left作为被添加目标
                _yAxis = this._yAxisLeft;

                //同时，说明是新加的field，出来没有配置过的
                this.yAxisFields.push(field);
            }

            //找到了_yAxis后，如果它不在_yAxis的enabledFields里，就不需要做任何操作，说明当前已经在显示
            var ind = underscore.indexOf(_yAxis.enabledFields, field);
            if (ind == -1) {
                return;
            } else {
                //需要update

                //先从禁用里面取消
                _yAxis.enabledFields.splice(ind, 1);

                //然后重新设置该yAxisDataFrame
                _fs = underscore.difference(_fs, _yAxis.enabledFields);
                _yAxis.reset(null, this._getYaxisDataFrame(_fs));

                //然后yAxis更新后，对应的背景也要更新,目前被添加到了left才需要updata back
                if (_yAxis.place == "left") {
                    this._back.reset({
                        animation: false,
                        xAxis: {
                            data: this._yAxisLeft.layoutData
                        }
                    });
                }
            }
        }

        //查询field在哪个yAxis上面

    }, {
        key: "getYaxisOfField",
        value: function getYaxisOfField(field) {
            var me = this;
            var Axis;
            underscore.each(this._yAxis, function (_yAxis, i) {
                var fs = _yAxis.field;
                var _fs = underscore.flatten([fs]);
                var ind = underscore.indexOf(_fs, field);
                if (ind > -1) {
                    //那么说明这个yAxis轴上面有这个字段，这个yaxis需要reset
                    Axis = _yAxis;
                    return false;
                }
            });
            return Axis;
        }

        //和原始field结构保持一致，但是对应的field换成 {field: , enabled:}结构

    }, {
        key: "_setFieldsDisplay",
        value: function _setFieldsDisplay(fields) {
            if (!fields) {
                var yAxis$$1 = this.yAxis;
                if (!underscore.isArray(yAxis$$1)) {
                    yAxis$$1 = [yAxis$$1];
                }

                fields = [];

                underscore.each(yAxis$$1, function (item, i) {
                    fields = fields.concat(item.field);
                });
            }

            if (underscore.isString(fields)) {
                fields = [fields];
            }
            var clone_fields = underscore.clone(fields);
            for (var i = 0, l = fields.length; i < l; i++) {
                if (underscore.isString(fields[i])) {
                    clone_fields[i] = {
                        field: fields[i],
                        enabled: true,
                        yAxis: this.getYaxisOfField(fields[i])
                    };
                }
                if (underscore.isArray(fields[i])) {
                    clone_fields[i] = this._setFieldsDisplay(fields[i]);
                }
            }
            return clone_fields;
        }

        //从 fieldsDisplayMap 中过滤筛选出来一个一一对应的 enabled为true的对象结构
        //这个方法还必须要返回的数据里描述出来多y轴的结构。否则外面拿到数据后并不好处理那个数据对应哪个轴

    }, {
        key: "getFieldsOfDisplay",
        value: function getFieldsOfDisplay(maps) {
            var fmap = {
                left: [], right: []
            };

            underscore.each(this.fieldsDisplayMap, function (bamboo, b) {
                if (underscore.isArray(bamboo)) {
                    //多节竹子

                    var place;
                    var fields = [];

                    //设置完fields后，返回这个group属于left还是right的axis
                    underscore.each(bamboo, function (obj, v) {
                        if (obj.field && obj.enabled) {
                            place = obj.yAxis.place;
                            fields.push(obj.field);
                        }
                    });

                    fields.length && fmap[place].push(fields);
                } else {
                    //单节棍
                    if (bamboo.field && bamboo.enabled) {
                        fmap[bamboo.yAxis.place].push(bamboo.field);
                    }
                }
            });

            return fmap;
        }

        //设置 fieldsDisplayMap 中对应field 的 enabled状态

    }, {
        key: "setFieldDisplay",
        value: function setFieldDisplay(field) {
            var me = this;
            function set$$1(maps) {
                underscore.each(maps, function (map, i) {
                    if (underscore.isArray(map)) {
                        set$$1(map);
                    } else if (map.field && map.field == field) {
                        map.enabled = !map.enabled;
                    }
                });
            }
            set$$1(me.fieldsDisplayMap);
        }
    }, {
        key: "getDisplayObjectOfField",
        value: function getDisplayObjectOfField(field) {
            var me = this;
            var obj = null;
            function get$$1(maps) {
                underscore.each(maps, function (map, i) {
                    if (underscore.isArray(map)) {
                        get$$1(map);
                    } else if (map.field && map.field == field) {
                        obj = map;
                        return false;
                    }
                });
            }
            get$$1(me.fieldsDisplayMap);
            return obj;
        }
    }]);
    return Descartes_Component;
}(component);

var AnimationFrame$2 = canvax.AnimationFrame;
var BrokenLine$3 = canvax.Shapes.BrokenLine;
var Rect$4 = canvax.Shapes.Rect;

var Graphs = function (_Canvax$Event$EventDi) {
    inherits$1(Graphs, _Canvax$Event$EventDi);

    function Graphs(opt, root) {
        classCallCheck$1(this, Graphs);

        var _this = possibleConstructorReturn$1(this, (Graphs.__proto__ || Object.getPrototypeOf(Graphs)).call(this, opt, root));

        _this.data = [];

        _this.root = root;
        _this._yAxisFieldsMap = {}; //{"uv":{index:0,fillStyle:"" , ...} ...}
        _this._setyAxisFieldsMap(opt);

        //存储graphs对应的xAxis 和 yAxis实例，后续柱折混合图里对修改传入的yAxis实例
        _this._xAxis = _this.root._coordinate._xAxis;
        _this._yAxis = _this.root._coordinate._yAxis;

        _this.animation = true;

        _this.pos = {
            x: 0,
            y: 0
        };

        _this.colors = colors;

        _this.bar = {
            width: 0,
            _width: 0,
            radius: 4,
            fillStyle: null,
            filter: function filter() {}, //用来定制bar的样式
            count: 0, //总共有多少个bar
            xDis: null
        };

        _this.text = {
            enabled: false,
            fillStyle: '#999',
            fontSize: 12,
            format: null,
            lineWidth: 1,
            strokeStyle: 'white'
        };

        _this.checked = {
            enabled: false,
            fillStyle: '#00A8E6',
            strokeStyle: '#00A8E6',
            fillAlpha: 0.1,
            lineWidth: 2
        };

        _this.sort = null;

        _this._barsLen = 0;

        _this.eventEnabled = true;

        _this.sprite = null;
        _this.txtsSp = null;
        _this.checkedSp = null;

        underscore.deepExtend(_this, opt);

        _this.init();
        return _this;
    }

    createClass$1(Graphs, [{
        key: "init",
        value: function init() {
            this.sprite = new canvax.Display.Sprite({
                id: "graphsEl"
            });

            this.core = new canvax.Display.Sprite({
                id: "bar_graphs_core"
            });
            this.sprite.addChild(this.core);

            this.barsSp = new canvax.Display.Sprite({
                id: "barsSp"
            });
            this.txtsSp = new canvax.Display.Sprite({
                id: "txtsSp",
                context: {
                    //visible: false
                }
            });
            this.checkedSp = new canvax.Display.Sprite({
                id: "checkedSp"
            });
        }
    }, {
        key: "getInfo",
        value: function getInfo(index) {
            //该index指当前
            return this._getInfoHandler({
                iNode: index
            });
        }
    }, {
        key: "_getTargetField",
        value: function _getTargetField(b, v, i, field) {
            if (underscore.isString(field)) {
                return field;
            } else if (underscore.isArray(field)) {
                var res = field[b];
                if (underscore.isString(res)) {
                    return res;
                } else if (underscore.isArray(res)) {
                    return res[v];
                }
            }
        }
    }, {
        key: "checkedAt",
        value: function checkedAt($o) {
            var me = this;
            var index = $o.iNode;
            var group = me.barsSp.getChildById('barGroup_' + index);
            if (!group) {
                return;
            }

            me.checkedSp.removeChildById('line_' + index);
            me.checkedSp.removeChildById('rect_' + index);
            var hoverRect = group.getChildAt(0);
            var x0 = hoverRect.context.x;
            var x1 = hoverRect.context.x + hoverRect.context.width,
                y = -me.h;

            if ($o.checked && !me.checkedSp.getChildById("rect_" + index)) {
                var rect = new Rect$4({
                    id: "rect_" + index,
                    pointChkPriority: false,
                    context: {
                        x: x0,
                        y: y,
                        width: hoverRect.context.width,
                        height: hoverRect.context.height,
                        fillStyle: me.checked.fillStyle,
                        fillAlpha: me.checked.fillAlpha
                    }
                });
                me.checkedSp.addChild(rect);

                var line = new BrokenLine$3({
                    id: "line_" + index,
                    context: {
                        pointList: [[x0, y], [x1, y]],
                        strokeStyle: me.checked.strokeStyle,
                        lineWidth: me.checked.lineWidth
                    }
                });
                me.checkedSp.addChild(line);
            }
        }
    }, {
        key: "removeAllChecked",
        value: function removeAllChecked() {
            var me = this;
            me.checkedSp.removeAllChildren();
        }
    }, {
        key: "setBarStyle",
        value: function setBarStyle($o) {
            var me = this;
            var index = $o.iNode;
            var group = me.barsSp.getChildById('barGroup_' + index);

            var fillStyle = $o.fillStyle || me._getColor(me.bar.fillStyle);
            for (var a = 0, al = group.getNumChildren(); a < al; a++) {
                var rectEl = group.getChildAt(a);
                rectEl.context.fillStyle = fillStyle;
            }
        }
    }, {
        key: "_setyAxisFieldsMap",
        value: function _setyAxisFieldsMap(opt) {
            var me = this;
            !opt && (opt = {});
            //柱折混合图，会再opt里传入一份yAxisFields
            var yAxisFields = opt.yAxisFields || this.root._coordinate.yAxisFields;
            underscore.each(yAxisFields, function (field, i) {
                me._yAxisFieldsMap[field] = {
                    index: i
                };
            });
        }
    }, {
        key: "_getColor",
        value: function _getColor(c, groups, vLen, i, h, v, value, field) {
            var style = null;
            if (underscore.isString(c)) {
                style = c;
            }
            if (underscore.isArray(c)) {
                style = underscore.flatten(c)[this._yAxisFieldsMap[field].index];
            }
            if (underscore.isFunction(c)) {
                style = c.apply(this, [{
                    iGroup: i,
                    iNode: h,
                    iLay: v,
                    field: field,
                    value: value,
                    xAxis: {
                        field: this._xAxis.field,
                        value: this._xAxis.data[h].content
                    }
                }]);
            }
            if (!style || style == "") {
                style = this.colors[this._yAxisFieldsMap[field].index];
            }
            return style;
        }
    }, {
        key: "_getBarWidth",
        value: function _getBarWidth(xDis1, xDis2) {
            if (this.bar.width) {
                if (underscore.isFunction(this.bar.width)) {
                    this.bar._width = this.bar.width(xDis1);
                } else {
                    this.bar._width = this.bar.width;
                }
            } else {
                this.bar._width = parseInt(xDis2) - parseInt(Math.max(1, xDis2 * 0.3));

                //这里的判断逻辑用意已经忘记了，先放着， 有问题在看
                if (this.bar._width == 1 && xDis1 > 3) {
                    this.bar._width = parseInt(xDis1) - 2;
                }
            }
            this.bar._width < 1 && (this.bar._width = 1);
            return this.bar._width;
        }
    }, {
        key: "add",
        value: function add(field) {}
    }, {
        key: "remove",
        value: function remove(field) {}
    }, {
        key: "reset",
        value: function reset(opt) {
            this.draw(opt);
        }
    }, {
        key: "clean",
        value: function clean() {
            this.data = [];
            this.barsSp.removeAllChildren();
            this.checkedSp.removeAllChildren();
            if (this.text.enabled) {
                this.txtsSp.removeAllChildren();
            }
        }
    }, {
        key: "draw",
        value: function draw(opt) {
            //第二个data参数去掉，直接trimgraphs获取最新的data

            underscore.deepExtend(this, opt);

            var data = this._trimGraphs();

            if (data.length == 0 || data[0].length == 0) {
                this.clean();
                return;
            }

            var preLen = 0; //纵向的分组，主要用于resetData的时候，对比前后data数量用
            this.data[0] && (preLen = this.data[0][0].length);

            this.data = data;
            var me = this;
            var groups = data.length;
            var itemW = 0;

            me.bar.count = 0;

            underscore.each(data, function (h_group, i) {
                /*
                //h_group为横向的分组。如果yAxis.field = ["uv","pv"]的话，
                //h_group就会为两组，一组代表uv 一组代表pv。
                var spg = new Canvax.Display.Sprite({ id : "barGroup"+i });
                */

                //vLen 为一单元bar上面纵向堆叠的length
                //比如yAxis.field = [?
                //    ["uv","pv"],  vLen == 2
                //    "click"       vLen == 1
                //]

                //if (h <= preLen - 1)的话说明本次绘制之前sprite里面已经有bar了。需要做特定的动画效果走过去

                var vLen = h_group.length;
                if (vLen == 0) return;

                //hlen为数据有多长
                var hLen = h_group[0].length;

                //itemW 还是要跟着xAxis的xDis保持一致
                itemW = me.w / hLen;

                me._barsLen = hLen * groups;

                for (var h = 0; h < hLen; h++) {
                    var groupH;
                    if (i == 0) {
                        //横向的分组
                        if (h <= preLen - 1) {
                            groupH = me.barsSp.getChildById("barGroup_" + h);
                        } else {
                            groupH = new canvax.Display.Sprite({
                                id: "barGroup_" + h
                            });
                            me.barsSp.addChild(groupH);
                            groupH.iNode = h;
                            groupH.on("click dblclick mousedown mousemove mouseup", function (e) {
                                if (!e.eventInfo) {
                                    e.eventInfo = me._getInfoHandler(this);
                                }
                            });
                        }

                        if (me.eventEnabled) {
                            var hoverRect;
                            if (h <= preLen - 1) {
                                hoverRect = groupH.getChildById("bhr_" + h);
                                hoverRect.context.width = itemW;
                                hoverRect.context.x = itemW * h;
                            } else {
                                hoverRect = new Rect$4({
                                    id: "bhr_" + h,
                                    pointChkPriority: false,
                                    hoverClone: false,
                                    context: {
                                        x: itemW * h,
                                        y: me.sort && me.sort == "desc" ? 0 : -me.h,
                                        width: itemW,
                                        height: me.h,
                                        fillStyle: "#ccc",
                                        fillAlpha: 0
                                    }
                                });
                                groupH.addChild(hoverRect);
                                hoverRect.hover(function (e) {
                                    this.context.fillAlpha = 0.1;
                                }, function (e) {
                                    this.context.fillAlpha = 0;
                                });
                                hoverRect.iGroup = -1, hoverRect.iNode = h, hoverRect.iLay = -1;
                                hoverRect.on("panstart mouseover mousemove mouseout click", function (e) {
                                    e.eventInfo = me._getInfoHandler(this, e);
                                });
                            }
                        }
                    } else {
                        groupH = me.barsSp.getChildById("barGroup_" + h);
                    }

                    //同上面，给txt做好分组
                    var txtGroupH;
                    if (i == 0) {
                        if (h <= preLen - 1) {
                            txtGroupH = me.txtsSp.getChildById("txtGroup_" + h);
                        } else {
                            txtGroupH = new canvax.Display.Sprite({
                                id: "txtGroup_" + h
                            });
                            me.txtsSp.addChild(txtGroupH);
                            txtGroupH.iGroup = i;
                        }
                    } else {
                        txtGroupH = me.txtsSp.getChildById("txtGroup_" + h);
                    }

                    for (var v = 0; v < vLen; v++) {

                        me.bar.count++;

                        //单个的bar，从纵向的底部开始堆叠矩形
                        var rectData = h_group[v][h];
                        rectData.iGroup = i, rectData.iNode = h, rectData.iLay = v;

                        var fillStyle = me._getColor(me.bar.fillStyle, groups, vLen, i, h, v, rectData.value, rectData.field);

                        //根据第一行数据来配置下_yAxisFieldsMap中对应field的fillStyle
                        if (h == 0) {
                            var _yMap = me._yAxisFieldsMap[rectData.field];
                            if (!_yMap.fillStyle) {
                                _yMap.fillStyle = fillStyle;
                            }
                        }

                        rectData.fillStyle = fillStyle;

                        var rectH = rectData.y - rectData.fromY;

                        if (isNaN(rectH) || Math.abs(rectH) < 1) {
                            rectH = 0;
                        }

                        var finalPos = {
                            x: Math.round(rectData.x),
                            y: rectData.fromY,
                            width: parseInt(me.bar._width),
                            height: rectH,
                            fillStyle: fillStyle,
                            scaleY: -1
                        };
                        rectData.width = finalPos.width;

                        var rectCxt = {
                            x: finalPos.x,
                            y: rectData.yBasePoint.y, //0,
                            width: finalPos.width,
                            height: finalPos.height,
                            fillStyle: finalPos.fillStyle,
                            scaleY: 0
                        };

                        if (!!me.bar.radius && rectData.isLeaf) {
                            var radiusR = Math.min(me.bar._width / 2, Math.abs(rectH));
                            radiusR = Math.min(radiusR, me.bar.radius);
                            rectCxt.radius = [radiusR, radiusR, 0, 0];
                        }

                        if (!me.animation) {
                            delete rectCxt.scaleY;
                            rectCxt.y = finalPos.y;
                        }

                        var rectEl;
                        if (h <= preLen - 1) {
                            rectEl = groupH.getChildById("bar_" + i + "_" + h + "_" + v);
                            rectEl.context.fillStyle = fillStyle;
                        } else {
                            rectEl = new Rect$4({
                                id: "bar_" + i + "_" + h + "_" + v,
                                context: rectCxt
                            });
                            groupH.addChild(rectEl);
                        }

                        rectEl.finalPos = finalPos;

                        rectEl.iGroup = i, rectEl.iNode = h, rectEl.iLay = v;

                        me.bar.filter.apply(rectEl, [rectData, me]);

                        if (me.eventEnabled) {
                            rectEl.on("panstart mouseover mousemove mouseout click dblclick", function (e) {
                                e.eventInfo = me._getInfoHandler(this, e);
                                if (e.type == "mouseover") {
                                    this.parent.getChildById("bhr_" + this.iNode).context.fillAlpha = 0.1;
                                }
                                if (e.type == "mouseout") {
                                    this.parent.getChildById("bhr_" + this.iNode).context.fillAlpha = 0;
                                }
                            });
                        }

                        //叶子节点上面放置info
                        if (rectData.isLeaf && me.text.enabled) {

                            //文字
                            var infosp;
                            if (h <= preLen - 1) {
                                infosp = txtGroupH.getChildById("infosp_" + i + "_" + h + "_" + v);
                            } else {
                                //console.log("infosp_" + i + "_" + h + "_" + v);
                                infosp = new canvax.Display.Sprite({
                                    id: "infosp_" + i + "_" + h + "_" + v,
                                    context: {
                                        y: rectData.yBasePoint.y,
                                        visible: false
                                    }
                                });
                                infosp._hGroup = h;
                                txtGroupH.addChild(infosp);
                            }

                            var contents = [];
                            for (var c = vLen - 1; c >= 0; c--) {
                                //在baseNumber同一侧的数据放在一个叶子节点上面显示
                                if (rectData.value > rectData.yBasePoint.content === h_group[c][h].value > h_group[c][h].yBasePoint.content) {
                                    contents.push(h_group[c][h]);
                                }
                            }

                            var infoWidth = 0;
                            var infoHeight = 0;

                            underscore.each(contents, function (cdata, ci) {
                                var content = cdata.value;
                                if (underscore.isFunction(me.text.format)) {
                                    var _formatc = me.text.format.apply(me, [content, cdata]);
                                    if (!!_formatc || _formatc === "" || _formatc === 0) {
                                        content = _formatc;
                                    }
                                }
                                if (!me.animation && underscore.isNumber(content)) {
                                    content = numAddSymbol(content);
                                }

                                if (content === "") {
                                    return;
                                }

                                if (ci > 0 && infosp.children.length > 0) {
                                    txt = new canvax.Display.Text("/", {
                                        context: {
                                            x: infoWidth + 2,
                                            fillStyle: "#999"
                                        }
                                    });
                                    infoWidth += txt.getTextWidth() + 2;
                                    infosp.addChild(txt);
                                }

                                var txt;
                                if (h <= preLen - 1) {
                                    txt = infosp.getChildById("info_txt_" + i + "_" + h + "_" + ci);
                                } else {
                                    txt = new canvax.Display.Text(content, {
                                        id: "info_txt_" + i + "_" + h + "_" + ci,
                                        context: {
                                            x: infoWidth + 2,
                                            fillStyle: cdata.fillStyle,
                                            fontSize: me.text.fontSize,
                                            lineWidth: me.text.lineWidth,
                                            strokeStyle: me.text.strokeStyle
                                        }
                                    });
                                    infosp.addChild(txt);
                                }
                                txt._text = cdata.value;
                                txt._data = cdata;
                                infoWidth += txt.getTextWidth() + 2;
                                infoHeight = Math.max(infoHeight, txt.getTextHeight());

                                if (me.animation) {
                                    var beginNumber = 0;
                                    if (content >= 100) {
                                        beginNumber = 100;
                                    }
                                    if (content >= 1000) {
                                        beginNumber = 1000;
                                    }
                                    if (content >= 10000) {
                                        beginNumber = 10000;
                                    }
                                    if (content >= 100000) {
                                        beginNumber = 100900;
                                    }
                                    //beginNumber 和 content保持同样位数，这样动画的时候不会跳动
                                    txt.resetText(beginNumber);
                                }
                            });

                            infosp._finalX = rectData.x + me.bar._width / 2 - infoWidth / 2;

                            //如果数据在basepoint下方
                            if (rectData.value < rectData.yBasePoint.content) {
                                infosp._finalY = rectData.y + 3; //3 只是个偏移量，没有什么特别的意思
                            } else {
                                infosp._finalY = rectData.y - infoHeight;
                                infosp.upOfYbaseNumber = true;
                            }
                            //if( rectData.value )

                            infosp._centerX = rectData.x + me.bar._width / 2;
                            infosp.context.width = infoWidth;
                            infosp.context.height = infoHeight;

                            if (!me.animation) {
                                infosp.context.y = infosp._finalY;
                                infosp.context.x = infosp._finalX;
                                infosp.context.visible = true;
                            }
                        }
                    }
                }
            });

            this.core.addChild(this.barsSp);

            this.core.addChild(this.checkedSp);

            if (this.text.enabled) {
                this.core.addChild(this.txtsSp);
            }

            this.core.context.x = this.pos.x;
            this.core.context.y = this.pos.y;

            if (this.sort && this.sort == "desc") {
                this.core.context.y -= this.h;
            }

            this.grow(function () {
                me.fire("complete");
            }, {
                delay: 0,
                easing: me.proportion ? "Quadratic.Line" : "Quadratic.Out",
                duration: 300
            });
        }
    }, {
        key: "_trimGraphs",
        value: function _trimGraphs() {

            var _xAxis = this._xAxis;
            var _yAxis = this._yAxis;

            var xArr = _xAxis.data;
            var hLen = 0;
            underscore.each(_yAxis, function (_yaxis) {
                hLen += _yaxis.field.length;
            });

            var xDis1 = _xAxis.xDis;
            //x方向的二维长度，就是一个bar分组里面可能有n个子bar柱子，那么要二次均分
            var xDis2 = xDis1 / (hLen + 1);
            //知道了xDis2 后 检测下 barW是否需要调整
            var barW = this._getBarWidth(xDis1, xDis2);
            var barDis = xDis2 - barW;
            if (this.bar.xDis != null) {
                barDis = this.bar.xDis;
            }

            var disLeft, disRight;
            disLeft = disRight = (xDis1 - barW * hLen - barDis * (hLen - 1)) / 2;

            var tmpData = [];
            var me = this;

            underscore.each(_yAxis, function (_yaxis, yind) {
                //dataOrg和field是一一对应的
                underscore.each(_yaxis.dataOrg, function (hData, b) {
                    //hData，可以理解为一根竹子 横向的分组数据，这个hData上面还可能有纵向的堆叠

                    //tempBarData 一根柱子的数据， 这个柱子是个数据，上面可以有n个子元素对应的竹节
                    var tempBarData = [];
                    underscore.each(hData, function (vSectionData, v) {
                        tempBarData[v] = [];
                        //vSectionData 代表某个字段下面的一组数据比如 uv
                        underscore.each(vSectionData, function (val, i) {
                            if (!xArr[i]) {
                                return;
                            }

                            var vCount = 0;
                            if (me.proportion) {
                                //先计算总量
                                underscore.each(hData, function (team, ti) {
                                    vCount += team[i];
                                });
                            }

                            var x = xArr[i].x - xDis1 / 2 + disLeft + (barW + barDis) * b;
                            if (yind > 0) {
                                x += (barW + barDis) * _yAxis[yind - 1].dataOrg.length;
                            }

                            var y = 0;
                            if (me.proportion) {
                                y = -val / vCount * _yaxis.yGraphsHeight;
                            } else {
                                y = _yaxis.getYposFromVal(val);
                            }

                            function _getFromY(tempBarData, v, i, val, y, yBasePoint) {
                                var preData = tempBarData[v - 1];
                                if (!preData) {
                                    return yBasePoint.y;
                                }

                                var preY = preData[i].y;
                                var preVal = preData[i].value;
                                var yBaseNumber = yBasePoint.content;
                                if (val >= yBaseNumber) {
                                    //如果大于基线的，那么就寻找之前所有大于基线的
                                    if (preVal >= yBaseNumber) {
                                        //能找到，先把pre的isLeaf设置为false
                                        preData[i].isLeaf = false;
                                        return preY;
                                    } else {
                                        return _getFromY(tempBarData, v - 1, i, val, y, yBasePoint);
                                    }
                                } else {
                                    if (preVal < yBaseNumber) {
                                        //能找到，先把pre的isLeaf设置为false
                                        preData[i].isLeaf = false;
                                        return preY;
                                    } else {
                                        return _getFromY(tempBarData, v - 1, i, val, y, yBasePoint);
                                    }
                                }
                            }

                            //找到其着脚点,一般就是 yAxis.basePoint
                            var fromY = _getFromY(tempBarData, v, i, val, y, _yaxis.basePoint);
                            y += fromY - _yaxis.basePoint.y;

                            //如果有排序的话
                            //TODO:这个逻辑好像有问题
                            if (_yaxis.sort && _yaxis.sort == "desc") {
                                y = -(_yaxis.yGraphsHeight - Math.abs(y));
                            }

                            var node = {
                                value: val,
                                field: me._getTargetField(b, v, i, _yaxis.field),
                                fromX: x,
                                fromY: fromY,
                                x: x,
                                y: y,
                                yBasePoint: _yaxis.basePoint,
                                isLeaf: true,
                                xAxis: {
                                    field: me._xAxis.field,
                                    value: xArr[i].content,
                                    layoutText: xArr[i].layoutText
                                }
                            };

                            if (me.proportion) {
                                node.vCount = vCount;
                            }

                            tempBarData[v].push(node);
                        });
                    });

                    tempBarData.length && tmpData.push(tempBarData);
                });
            });
            return tmpData;
        }
    }, {
        key: "_updateInfoTextPos",
        value: function _updateInfoTextPos(el) {

            var infoWidth = 0;
            var infoHeight = 0;
            var cl = el.children.length;
            underscore.each(el.children, function (c, i) {
                if (c.getTextWidth) {
                    c.context.x = infoWidth;
                    infoWidth += c.getTextWidth() + (i < cl ? 2 : 0);
                    infoHeight = Math.max(infoHeight, c.getTextHeight());
                }
            });
            el.context.x = el._centerX - infoWidth / 2;
            el.context.width = infoWidth;
            el.context.height = infoHeight;
        }

        /**
         * 生长动画
         */

    }, {
        key: "grow",
        value: function grow(callback, opt) {

            var me = this;
            if (!this.animation) {
                callback && callback(me);
                return;
            }
            var sy = 1;
            if (this.sort && this.sort == "desc") {
                sy = -1;
            }

            //先把已经不在当前range范围内的元素destroy掉
            if (me.data[0] && me.data[0].length && me.barsSp.children.length > me.data[0][0].length) {
                for (var i = me.data[0][0].length, l = me.barsSp.children.length; i < l; i++) {
                    me.barsSp.getChildAt(i).destroy();
                    me.text.enabled && me.txtsSp.getChildAt(i).destroy();
                    i--;
                    l--;
                }
            }

            var options = underscore.extend({
                delay: Math.min(1000 / this._barsLen, 80),
                easing: "Back.Out",
                duration: 500
            }, opt);

            var barCount = 0;
            underscore.each(me.data, function (h_group, g) {
                var vLen = h_group.length;
                if (vLen == 0) return;
                var hLen = h_group[0].length;
                for (var h = 0; h < hLen; h++) {
                    for (var v = 0; v < vLen; v++) {

                        var group = me.barsSp.getChildById("barGroup_" + h);

                        var bar = group.getChildById("bar_" + g + "_" + h + "_" + v);
                        //console.log("finalPos"+bar.finalPos.y)

                        if (options.duration == 0) {
                            bar.context.scaleY = sy;
                            bar.context.y = sy * sy * bar.finalPos.y;
                            bar.context.x = bar.finalPos.x;
                            bar.context.width = bar.finalPos.width;
                            bar.context.height = bar.finalPos.height;
                        } else {
                            if (bar._tweenObj) {
                                AnimationFrame$2.destroyTween(bar._tweenObj);
                            }
                            bar._tweenObj = bar.animate({
                                scaleY: sy,
                                y: sy * bar.finalPos.y,
                                x: bar.finalPos.x,
                                width: bar.finalPos.width,
                                height: bar.finalPos.height
                            }, {
                                duration: options.duration,
                                easing: options.easing,
                                delay: h * options.delay,
                                onUpdate: function onUpdate(arg) {},
                                onComplete: function onComplete(arg) {
                                    if (arg.width < 3) {
                                        this.context.radius = 0;
                                    }

                                    barCount++;

                                    if (barCount === me.bar.count) {
                                        callback && callback(me);
                                    }
                                },
                                id: bar.id
                            });
                        }

                        //txt grow
                        if (me.text.enabled) {
                            var txtGroupH = me.txtsSp.getChildById("txtGroup_" + h);

                            var infosp = txtGroupH.getChildById("infosp_" + g + "_" + h + "_" + v);
                            if (infosp) {

                                infosp.animate({
                                    y: infosp._finalY,
                                    x: infosp._finalX
                                }, {
                                    duration: options.duration,
                                    easing: options.easing,
                                    delay: h * options.delay,
                                    onUpdate: function onUpdate() {
                                        this.context.visible = true;
                                    },
                                    onComplete: function onComplete() {}
                                });

                                underscore.each(infosp.children, function (txt) {
                                    if (txt._text || txt._text === 0) {
                                        if (txt._tweenObj) {
                                            AnimationFrame$2.destroyTween(txt._tweenObj);
                                        }
                                        txt._tweenObj = AnimationFrame$2.registTween({
                                            from: {
                                                v: txt.text
                                            },
                                            to: {
                                                v: txt._text
                                            },
                                            duration: options.duration + 100,
                                            delay: h * options.delay,
                                            onUpdate: function onUpdate(arg) {
                                                var content = arg.v;
                                                if (underscore.isFunction(me.text.format)) {
                                                    var _formatc = me.text.format.apply(me, [content, txt._data]);
                                                    if (!!_formatc || _formatc === "" || _formatc === 0) {
                                                        content = _formatc;
                                                    }
                                                } else if (underscore.isNumber(content)) {
                                                    content = numAddSymbol(parseInt(content));
                                                }
                                                txt.resetText(content);
                                                if (txt.parent) {
                                                    me._updateInfoTextPos(txt.parent);
                                                } else {
                                                    txt.destroy();
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    }
                }
            });
            //callback && callback(me);
            /*
            window.setTimeout(function() {
                callback && callback(me);
            }, 300 * (this.barsSp.children.length - 1));
            */
        }
    }, {
        key: "_getInfoHandler",
        value: function _getInfoHandler(target) {
            var node = {
                iGroup: target.iGroup,
                iNode: target.iNode,
                iLay: target.iLay,
                nodesInfoList: this._getNodeInfo(target.iGroup, target.iNode, target.iLay)
            };
            return node;
        }
    }, {
        key: "_getNodeInfo",
        value: function _getNodeInfo(iGroup, iNode, iLay) {
            var arr = [];
            var me = this;
            var groups = me.data.length;

            iGroup == undefined && (iGroup = -1);
            iNode == undefined && (iNode = 0);
            iLay == undefined && (iLay = -1);

            underscore.each(me.data, function (h_group, i) {
                var node;
                var vLen = h_group.length;
                if (vLen == 0) return;
                var hLen = h_group[0].length;
                for (var h = 0; h < hLen; h++) {
                    if (h == iNode) {
                        for (var v = 0; v < vLen; v++) {
                            if ((iGroup == i || iGroup == -1) && (iLay == v || iLay == -1)) {
                                node = h_group[v][h];
                                node.fillStyle = me._getColor(me.bar.fillStyle, groups, vLen, i, h, v, node.value, node.field);
                                arr.push(node);
                            }
                        }
                    }
                }
            });
            return arr;
        }
    }]);
    return Graphs;
}(canvax.Event.EventDispatcher);

/**
* 把原始的数据
* field1 field2 field3
*   1      2      3
*   2      3      4
* 这样的数据格式转换为内部的
* [{field:'field1',index:0,data:[1,2]} ......]
* 这样的结构化数据格式。
*/
var dataFrame = function (data) {

    var dataFrame = { //数据框架集合
        org: [], //最原始的数据  
        data: [], //最原始的数据转化后的数据格式：[o,o,o] o={field:'val1',index:0,data:[1,2,3]}
        getRowData: _getRowData,
        getFieldData: _getFieldData,
        getDataOrg: getDataOrg,
        fields: []
    };

    if (!data || data.length == 0) {
        return dataFrame;
    }

    //检测第一个数据是否为一个array, 否就是传入了一个json格式的数据
    if (data.length > 0 && !underscore.isArray(data[0])) {
        data = parse2MatrixData(data);
    }

    dataFrame.org = data;
    dataFrame.fields = data[0] ? data[0] : []; //所有的字段集合;

    var total = []; //已经处理成[o,o,o]   o={field:'val1',index:0,data:[1,2,3]}
    for (var a = 0, al = dataFrame.fields.length; a < al; a++) {
        var o = {};
        o.field = dataFrame.fields[a];
        o.index = a;
        o.data = [];
        total.push(o);
    }
    dataFrame.data = total;

    //填充好total的data并且把属于yAxis的设置为number
    for (var a = 1, al = data.length; a < al; a++) {
        for (var b = 0, bl = data[a].length; b < bl; b++) {
            total[b].data.push(data[a][b]);
        }
    }

    //会按照$field的格式转换成对应一一对应的 org 的结构
    function getDataOrg($field, format, totalList, lev) {

        if (!lev) lev = 0;

        var arr = totalList || total;
        if (!arr) {
            return;
        }
        if (!format) {
            format = function format(e) {
                return e;
            };
        }

        function _format(data) {
            for (var i = 0, l = data.length; i < l; i++) {
                data[i] = format(data[i]);
            }
            return data;
        }

        if (!underscore.isArray($field)) {
            $field = [$field];
        }

        //这个时候的arr只是totalList的过滤，还没有完全的按照$field 中的排序
        var newData = [];
        for (var i = 0, l = $field.length; i < l; i++) {
            var fieldInTotal = false; //如果该field在数据里面根本没有，那么就说明是无效的field配置
            if (underscore.isArray($field[i])) {
                newData.push(getDataOrg($field[i], format, totalList, lev + 1));
            } else {

                var _fieldData = newData;
                if (!lev) {
                    _fieldData = [];
                }
                for (var ii = 0, iil = arr.length; ii < iil; ii++) {
                    if ($field[i] == arr[ii].field) {
                        fieldInTotal = true;
                        _fieldData.push(_format(arr[ii].data));
                        break;
                    }
                }
                if (!lev) {
                    newData.push(_fieldData);
                }
            }
        }
        return newData;
    }

    /*
     * 获取某一行数据
    */
    function _getRowData(index) {
        var o = {};
        var data = dataFrame.data;
        for (var a = 0, al = data.length; a < al; a++) {
            if (data[a]) {
                o[data[a].field] = data[a].data[index];
            }
        }
        return o;
    }

    function _getFieldData(field) {
        var data;
        underscore.each(dataFrame.data, function (d) {
            if (d.field == field) {
                data = d;
            }
        });
        if (data) {
            return data.data;
        } else {
            return [];
        }
    }

    return dataFrame;
};

var Bar = function (_Chart) {
    inherits$1(Bar, _Chart);

    function Bar(node, data, opts) {
        classCallCheck$1(this, Bar);

        var _this = possibleConstructorReturn$1(this, (Bar.__proto__ || Object.getPrototypeOf(Bar)).call(this, node, data, opts));

        _this.type = "bar";

        //目前只有 bar有 checked 设置
        _this._checkedList = []; //所有的选择对象
        _this._currCheckedList = []; //当前可可视范围内的选择对象(根据dataZoom.start, dataZoom.end 过滤)

        //如果需要绘制百分比的柱状图
        if (opts.graphs && opts.graphs.proportion) {
            _this._initProportion(node, data, opts);
        } else {
            underscore.deepExtend(_this, opts);
        }

        _this.dataFrame = _this._initData(data);
        //一些继承自该类的 constructor 会拥有_init来做一些覆盖，比如横向柱状图,柱折混合图...
        _this._init && _this._init(node, data, opts);
        _this.draw();
        return _this;
    }

    createClass$1(Bar, [{
        key: "draw",
        value: function draw(opt) {
            !opt && (opt = {});
            this.setStages(opt);
            if (this.rotate) {
                this._rotate(this.rotate);
            }
            this._initModule(opt); //初始化模块  
            this.initPlugsModules(opt); //初始化组件
            this._startDraw(opt); //开始绘图

            if (this._coordinate.horizontal) {
                this._horizontal();
            }

            this.drawPlugs(opt); //绘图完，开始绘制插件
            this.inited = true;
        }
    }, {
        key: "_startDraw",
        value: function _startDraw(opt) {
            var me = this;
            !opt && (opt = {});

            //先绘制好坐标系统
            this._coordinate.draw(opt);

            //然后绘制主图形区域
            this._graphs.on("complete", function (g) {
                me.fire("complete");
            });
            this._graphs.draw({
                w: this._coordinate.graphsWidth,
                h: this._coordinate.graphsHeight,
                pos: {
                    x: this._coordinate.graphsX,
                    y: this._coordinate.graphsY
                },
                sort: this._coordinate._yAxis.sort,
                inited: this.inited,
                resize: opt.resize
            });

            this.bindEvent();
        }
    }, {
        key: "_initModule",
        value: function _initModule(opt) {
            var me = this;
            //首先是创建一个坐标系对象
            this._coordinate = new Descartes_Component(this.coordinate, this);
            this.core.addChild(this._coordinate.sprite);

            this._graphs = new Graphs(this.graphs, this);
            this.core.addChild(this._graphs.sprite);

            this._tips = new Tips(this.tips, this.canvax.domView);

            this.stageTip.addChild(this._tips.sprite);
        }
    }, {
        key: "_initData",
        value: function _initData(data) {
            var d;
            if (this._opts.dataZoom) {
                var datas = [data[0]];
                datas = datas.concat(data.slice(this.dataZoom.range.start + 1, this.dataZoom.range.end + 1 + 1));
                d = dataFrame(datas);
            } else {
                d = dataFrame(data);
            }
            return d;
        }

        /*
         * 如果只有数据改动的情况
         */

    }, {
        key: "resetData",
        value: function resetData(data, e) {
            this._data = parse2MatrixData(data);
            this.dataFrame = this._initData(data);
            this._reset(this, e);
            this.fire("_resetData");
        }
    }, {
        key: "_reset",
        value: function _reset(opt, e) {
            var me = this;
            opt = !opt ? this : opt;
            me._removeChecked();
            this._coordinate.reset(opt.coordinate, this.dataFrame);
            this._graphs.reset(opt.graphs);
            this.plugsReset(opt, e);
        }

        //TODO：bar中用来改变yAxis.field的临时 方案

    }, {
        key: "add",
        value: function add(field) {
            var displayObj = this._coordinate.getDisplayObjectOfField(field);
            if (!displayObj) return;
            if (displayObj.enabled) return;

            this._fieldChange(field, displayObj.yAxis);

            this._graphs.clean();
            this._reset(this);
        }
    }, {
        key: "remove",
        value: function remove(field) {
            var displayObj = this._coordinate.getDisplayObjectOfField(field);
            if (!displayObj) return;
            if (!displayObj.enabled) return;

            this._fieldChange(field, displayObj.yAxis);

            this._graphs.clean();
            this._reset(this);
        }

        //TODO: 这里目前是把graphs删除了重新绘制， 后续会在graphs提供add和remove来实现更加精细的操作
        //field改变的字段， _yAxis改变的字段对应的y轴

    }, {
        key: "_fieldChange",
        value: function _fieldChange(field, _yAxis) {
            //先设置好yAxis.field
            this._coordinate.setFieldDisplay(field);
            var newDisplayFieldsMap = this._coordinate.getFieldsOfDisplay();

            if (_yAxis) {
                if (underscore.isArray(this.coordinate.yAxis)) {
                    if (_yAxis.place == "left") {
                        this.coordinate.yAxis[0].field = newDisplayFieldsMap.left;
                    } else {
                        this.coordinate.yAxis[1].field = newDisplayFieldsMap.right;
                    }
                } else {
                    this.coordinate.yAxis.field = newDisplayFieldsMap.left;
                }
            }
        }

        //把这个点位置对应的x轴数据和y轴数据存到tips的info里面
        //方便外部自定义 tip 是的content

    }, {
        key: "_setXaxisYaxisToTipsInfo",
        value: function _setXaxisYaxisToTipsInfo(e, isAddStart) {
            if (!e.eventInfo) {
                return;
            }
            e.eventInfo.xAxis = {
                field: this._coordinate.xAxis.field,
                value: this._coordinate._xAxis.dataOrg[0][e.eventInfo.iNode]
            };

            var me = this;

            underscore.each(e.eventInfo.nodesInfoList, function (node, i) {
                //把这个group当前是否选中状态记录
                if (me._checkedList[node.iNode + me.dataZoom.range.start]) {
                    node.checked = true;
                } else {
                    node.checked = false;
                }
            });

            e.eventInfo.dataZoom = me.dataZoom;

            e.eventInfo.rowData = this.dataFrame.getRowData(e.eventInfo.iNode);

            if (!isAddStart) {
                e.eventInfo.iNode += this.dataZoom.range.start;
            }
        }

        //横向比例柱状图

    }, {
        key: "_initProportion",
        value: function _initProportion(node, data, opts) {
            !opts.tips && (opts.tips = {});

            opts.tips = underscore.deepExtend({
                content: function content(info) {

                    var str = "<table style='border:none'>";
                    var self = this;
                    underscore.each(info.nodesInfoList, function (node, i) {
                        str += "<tr style='color:" + (node.color || node.fillStyle) + "'>";
                        var prefixName = self.prefix[i];
                        var tsStyle = "style='border:none;white-space:nowrap;word-wrap:normal;'";
                        if (prefixName) {
                            str += "<td " + tsStyle + ">" + prefixName + "：</td>";
                        } else {
                            if (node.field) {
                                str += "<td " + tsStyle + ">" + node.field + "：</td>";
                            }
                        }
                        str += "<td " + tsStyle + ">" + numAddSymbol(node.value);
                        if (node.vCount) {
                            str += "（" + Math.round(node.value / node.vCount * 100) + "%）";
                        }
                        str += "</td></tr>";
                    });
                    str += "</table>";
                    return str;
                }
            }, opts.tips);

            underscore.deepExtend(this, opts);
            underscore.each(underscore.flatten([this.coordinate.yAxis]), function (yAxis) {
                underscore.deepExtend(yAxis, {
                    dataSection: [0, 20, 40, 60, 80, 100],
                    text: {
                        format: function format(n) {
                            return n + "%";
                        }
                    }
                });
            });

            !this.graphs && (this.graphs = {});
            underscore.deepExtend(this.graphs, {
                bar: {
                    radius: 0
                }
            });
        }

        //绘制图例

    }, {
        key: "drawLegend",
        value: function drawLegend(_legend) {
            _legend.pos({
                x: this._coordinate.graphsX
            });
            for (var f in this._graphs._yAxisFieldsMap) {
                var ffill = this._graphs._yAxisFieldsMap[f].fillStyle;
                _legend.setStyle(f, {
                    fillStyle: ffill
                });
            }
        }

        //datazoom begin

    }, {
        key: "drawDataZoom",
        value: function drawDataZoom(_datazoom) {
            //TODO: 后续会修改在这里回掉一个_datazoom实例，然后在这里draw
            var me = this;

            //初始化 datazoom 模块
            var dataZoomOpt = underscore.deepExtend({
                w: me._coordinate.graphsWidth,
                count: me._data.length - 1, //_data第一行是title，所以正式的count应该是 length-1
                //h : me._coordinate._xAxis.height,
                pos: {
                    x: me._coordinate.graphsX,
                    y: me._coordinate.graphsY + me._coordinate._xAxis.height
                },
                dragIng: function dragIng(range, pixRange, count, width) {

                    //完美解决dataZoom对柱状图的区间选择问题
                    var itemW = width / count;
                    var start = 0;
                    for (i = 0; i < count; i++) {
                        if (itemW * i + itemW / 2 > pixRange.start) {
                            start = i;
                            break;
                        }
                    }
                    var end = 0;
                    for (i = count - 1; i >= 0; i--) {
                        if (itemW * i + itemW / 2 < pixRange.end) {
                            end = i;
                            break;
                        }
                    }
                    //完美解决dataZoom对柱状图的区间选择问题

                    if (me.dataZoom.range.start == start && me.dataZoom.range.end == end) {
                        return;
                    }
                    me.dataZoom.range.start = start;
                    me.dataZoom.range.end = end;

                    me.resetData(me._data, {
                        trigger: "dataZoom"
                    });

                    me._removeChecked();

                    me.fire("dataZoomDragIng");
                },
                dragEnd: function dragEnd(range) {
                    me._updateChecked();
                }
            }, me.dataZoom);

            return dataZoomOpt;
        }
    }, {
        key: "getCloneChart",
        value: function getCloneChart() {
            return {
                graphs: {
                    bar: {
                        fillStyle: this.dataZoom.normalColor || "#ececec"
                    },
                    animation: false,
                    eventEnabled: false,
                    text: {
                        enabled: false
                    }
                },
                dataZoom: {
                    enabled: false
                }
            };
        }
        //datazoom end

    }, {
        key: "drawMarkLine",
        value: function drawMarkLine(field, yVal, _yAxis, ML) {
            var me = this;

            var yPos = 0,
                label = '';
            var label = "markline";

            if (yVal !== undefined && yVal !== null) {
                yPos = _yAxis.getYposFromVal(yVal);
                field && (label = field);
            } else {
                //没有配置y，则取均值
                if (!field) {
                    //如果没有配置y值，也没有配置所属哪个field，那么就不画
                    return;
                }

                //获取均值
                underscore.each(_yAxis.field, function (_field, i) {
                    if (_field == field) {
                        var arr = _yAxis.dataOrg[i];
                        yVal = (underscore.max(arr) - underscore.min(arr)) / 2;
                    }
                });
                yPos = _yAxis.getYposFromVal(yVal);
                label = field + '均值';
            }
            label += "：" + yVal;

            var o = {
                value: yVal
            };

            if (field) {
                if (!me._graphs._yAxisFieldsMap[field]) {
                    //如果markto 的目标field在_yAxisFieldsMap中没有，直接跳过
                    return;
                }
                o.i = me._graphs._yAxisFieldsMap[field].ind;
                o.field = field;
            }

            if (ML.text && ML.text.enabled) {
                if (underscore.isFunction(ML.text.format)) {
                    label = ML.text.format(o);
                }
            }

            function getProp(obj, p, def) {
                var val;
                if (!obj || obj && !obj[p]) {
                    return def;
                }
                if (underscore.isFunction(obj[p])) {
                    return obj[p](o);
                }
                return obj[p];
            }

            //TODO: 整个markline的设置里面。 就 下面这三行和 line chart的设置不同， 可以考虑统一处理
            var _fstyle = field ? me._graphs._yAxisFieldsMap[field].fillStyle : "#999";
            var lineStrokeStyle = getProp(ML.line, "strokeStyle", _fstyle);
            var textFillStyle = getProp(ML.text, "fillStyle", _fstyle);

            this.creatOneMarkLine(yVal, yPos, lineStrokeStyle, label, textFillStyle, field, ML, _yAxis);
        }
        //markLine end

        //markpoint begin

    }, {
        key: "drawMarkPoint",
        value: function drawMarkPoint() {
            var me = this;

            me.plugs.push({
                type: "once",
                plug: {
                    draw: function draw() {

                        var g = me._graphs;
                        var gOrigin = {
                            x: g.sprite.context.x + g.bar._width / 2,
                            y: g.sprite.context.y - 3
                        };
                        var _t = me.markPoint.markTo;

                        underscore.each(g.data, function (group, i) {
                            underscore.each(group, function (hgroup) {
                                underscore.each(hgroup, function (bar) {
                                    if (_t && !(underscore.isArray(_t) && underscore.indexOf(_t, bar.field) >= 0 || _t === bar.field || underscore.isFunction(_t))) {
                                        return;
                                    }

                                    var barObj = underscore.clone(bar);
                                    barObj.x += gOrigin.x;
                                    barObj.y += gOrigin.y;
                                    var mpCtx = {
                                        value: barObj.value,
                                        shapeType: "droplet",
                                        markTo: barObj.field,
                                        //注意，这里视觉上面的分组和数据上面的分组不一样，所以inode 和 iNode 给出去的时候要反过来
                                        iGroup: barObj.iGroup,
                                        iNode: barObj.iNode,
                                        iLay: barObj.iLay,
                                        point: {
                                            x: barObj.x,
                                            y: barObj.y
                                        }
                                    };

                                    if (underscore.isFunction(_t) && !_t(mpCtx)) {
                                        //如果MarkTo是个表达式函数，返回为false的话
                                        return;
                                    }

                                    me.creatOneMarkPoint(me._opts, mpCtx);
                                });
                            });
                        });
                    }
                }
            });
        }
        //markpoint end

        //checked相关 begin

    }, {
        key: "getCheckedCurrList",
        value: function getCheckedCurrList() {
            var me = this;
            return underscore.filter(me._getCurrCheckedList(), function (o) {
                return o;
            });
        }
    }, {
        key: "getCheckedList",
        value: function getCheckedList() {
            //获取选择之后的对象列表 列表中不含空对象 [eventInfo,evnetInfo,....]
            var me = this;
            return underscore.filter(me._checkedList, function (o) {
                return o;
            });
        }
    }, {
        key: "checkAt",
        value: function checkAt(index) {
            var me = this;
            var i = index - me.dataZoom.range.start;
            var o = me._graphs.getInfo(i);
            me._checkedList[index] = o;
            me._checkedBar({
                iNode: i,
                checked: true
            });
            me._checkedMiniBar({
                iNode: index,
                checked: true
            });
            o.iNode = index;
            me.fire('checked', {
                eventInfo: o
            });
        }
    }, {
        key: "uncheckAt",
        value: function uncheckAt(index) {
            //取消选择某个对象 index是全局index
            var me = this;
            var i = index - me.dataZoom.range.start;
            if (me._checkedList[index]) {
                me._checked(me._graphs.getInfo(i));
            }
        }
    }, {
        key: "uncheckAll",
        value: function uncheckAll() {
            for (var i = 0, l = this._checkedList.length; i < l; i++) {
                var obj = this._checkedList[i];
                if (obj) {
                    this.uncheckAt(i);
                }
            }
            this._checkedList = [];
            this._currCheckedList = [];
        }
    }, {
        key: "checkOf",
        value: function checkOf(xvalue) {
            //TODO:这个有个bug就是，如果当前dataRange是0-5， xvalue如果是在第6个的话，这里是无效的，因为getIndexOfVal取不到值
            //后续优化
            this.checkAt(this._coordinate._xAxis.getIndexOfVal(xvalue) + this.dataZoom.range.start);
        }
    }, {
        key: "uncheckOf",
        value: function uncheckOf(xvalue) {
            this.uncheckAt(this._coordinate._xAxis.getIndexOfVal(xvalue) + this.dataZoom.range.start);
        }
    }, {
        key: "getGroupChecked",
        value: function getGroupChecked(e) {
            var checked = false;
            underscore.each(this.getCheckedList(), function (obj) {
                if (obj && obj.iNode == e.eventInfo.iNode) {
                    checked = true;
                }
            });
            return checked;
        }
    }, {
        key: "_removeChecked",
        value: function _removeChecked() {
            this._graphs.removeAllChecked();
        }
    }, {
        key: "_updateChecked",
        value: function _updateChecked() {
            var me = this;
            me._currCheckedList = me._getCurrCheckedList();
            for (var a = 0, al = me._currCheckedList.length; a < al; a++) {
                var o = me._currCheckedList[a];
                me._checkedBar({
                    iNode: o.iNode - me.dataZoom.range.start,
                    checked: true
                });
            }
        }
    }, {
        key: "_getCurrCheckedList",
        value: function _getCurrCheckedList() {
            var me = this;
            return underscore.filter(me._checkedList, function (o) {
                if (o) {
                    if (o.iNode >= me.dataZoom.range.start && o.iNode <= me.dataZoom.range.end) {
                        return o;
                    }
                }
            });
        }
    }, {
        key: "_checked",
        value: function _checked(eventInfo) {
            //当点击graphs时 触发选中状态
            var me = this;
            if (!me._graphs.checked.enabled) {
                return;
            }
            var i = eventInfo.iNode + me.dataZoom.range.start;

            var checked = true;
            if (me._checkedList[i]) {
                //如果已经选中
                me._checkedList[i] = null;
                checked = false;
            } else {
                //如果没选中                           
                me._checkedList[i] = eventInfo;
            }
            me._checkedBar({
                iNode: eventInfo.iNode,
                checked: checked
            });
            me._checkedMiniBar({
                iNode: i,
                checked: checked
            });

            eventInfo.iNode = i;

            return checked;
        }
    }, {
        key: "_checkedBar",
        value: function _checkedBar($o) {
            //选择bar
            this._graphs.checkedAt($o);
        }
    }, {
        key: "_checkedMiniBar",
        value: function _checkedMiniBar($o) {
            //选择缩略的bar
            if (this._opts.dataZoom) {
                var me = this;
                var graphs = me.__cloneChart.thumbChart._graphs;
                var fillStyle = '';
                if ($o.checked) {
                    fillStyle = me._opts.dataZoom.checked && me._opts.dataZoom.checked.fillStyle || fillStyle;
                }
                graphs.setBarStyle({
                    iNode: $o.iNode,
                    fillStyle: fillStyle
                });
            }
        }

        //checked相关 end

    }, {
        key: "_setTipsInfoHand",
        value: function _setTipsInfoHand(e) {
            this._setXaxisYaxisToTipsInfo(e);
        }
    }, {
        key: "bindEvent",
        value: function bindEvent() {
            var me = this;
            this.core.on("panstart mouseover", function (e) {
                me._setTipsInfoHand(e);
                me._tips.show(e);
                me.fire(e.type, e);
            });
            this.core.on("panmove mousemove", function (e) {
                me._setTipsInfoHand(e);
                me._tips.move(e);
                me.fire(e.type, e);
            });
            this.core.on("panend mouseout", function (e) {
                me._tips.hide(e);
                me.fire(e.type, e);
            });
            this.core.on("tap click dblclick mousedown mouseup", function (e) {
                var isAddStart = false;
                if (e.type == 'click') {
                    //在click上面触发 checked
                    me.fire('checkedBefor', e);

                    if (e.eventInfo && e.eventInfo.iNode > -1) {
                        if (me._checked(e.eventInfo)) {
                            me.fire('checked', e);
                        } else {
                            me.fire('unchecked', e);
                        }
                        isAddStart = true;
                    }
                }
                me._setTipsInfoHand(e, isAddStart);
                me.fire(e.type, e);
            });
        }
    }]);
    return Bar;
}(Descartes);

//十六进制颜色值的正则表达式 
var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;

/*16进制颜色转为RGB格式*/
var colorRgb = function colorRgb(hex) {
    var sColor = hex.toLowerCase();
    if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
            var sColorNew = "#";
            for (var i = 1; i < 4; i += 1) {
                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值  
        var sColorChange = [];
        for (var i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
        }
        return "RGB(" + sColorChange.join(",") + ")";
    } else {
        return sColor;
    }
};

var colorRgba = function colorRgba(hex, a) {
    return colorRgb(hex).replace(')', ',' + a + ')').replace('RGB', 'RGBA');
};

/*RGB颜色转换为16进制*/
var colorHex = function colorHex(rgb) {
    var that = rgb;
    if (/^(rgb|RGB)/.test(that)) {
        var aColor = that.replace(/(?:||rgb|RGB)*/g, "").split(",");
        var strHex = "#";
        for (var i = 0; i < aColor.length; i++) {
            var hex = Number(aColor[i]).toString(16);
            if (hex === "0") {
                hex += hex;
            }
            strHex += hex;
        }
        if (strHex.length !== 7) {
            strHex = that;
        }
        return strHex;
    } else if (reg.test(that)) {
        var aNum = that.replace(/#/, "").split("");
        if (aNum.length === 6) {
            return that;
        } else if (aNum.length === 3) {
            var numHex = "#";
            for (var i = 0; i < aNum.length; i += 1) {
                numHex += aNum[i] + aNum[i];
            }
            return numHex;
        }
    } else {
        return that;
    }
};

/**增加颜色的明亮度
 *hex: #ff00ff
 *lum: 0.1 颜色#ff00ff明亮度增加0.1,-0.2明亮度减少0.2
 */
var colorLuminance = function colorLuminance(hex, lum) {
    // Validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, "");
    if (hex.length < 6) {
        hex = hex.replace(/(.)/g, '$1$1');
    }
    lum = lum || 0;
    // Convert to decimal and change luminosity
    var rgb = "#",
        c;
    for (var i = 0; i < 3; ++i) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }
    return rgb;
};
/**
 * HSL颜色值转换为RGB.
 * 换算公式改编自 http://en.wikipedia.org/wiki/HSL_color_space.
 * h, s, 和 l 设定在 [0, 1] 之间
 * 返回的 r, g, 和 b 在 [0, 255]之间
 *
 * @param   Number  h       色相
 * @param   Number  s       饱和度
 * @param   Number  l       亮度
 * @return  Array           RGB色值数值
 */
var hslToRgb = function hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

/**
 * RGB 颜色值转换为 HSL.
 * 转换公式参考自 http://en.wikipedia.org/wiki/HSL_color_space.
 * r, g, 和 b 需要在 [0, 255] 范围内
 * 返回的 h, s, 和 l 在 [0, 1] 之间
 *
 * @param   Number  r       红色色值
 * @param   Number  g       绿色色值
 * @param   Number  b       蓝色色值
 * @return  Array           HSL各值数组
 */
var rgbToHsl = function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h,
        s,
        l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);break;
            case g:
                h = (b - r) / d + 2;break;
            case b:
                h = (r - g) / d + 4;break;
        }
        h /= 6;
    }

    return [h, s, l];
};

var ColorFormat = {
    colorRgb: colorRgb,
    colorRgba: colorRgba,
    colorHex: colorHex,
    colorBrightness: colorLuminance,
    hslToRgb: hslToRgb,
    rgbToHsl: rgbToHsl
};

var AnimationFrame$3 = canvax.AnimationFrame;
var BrokenLine$4 = canvax.Shapes.BrokenLine;
var Circle$4 = canvax.Shapes.Circle;
var Path$1 = canvax.Shapes.Path;

var LineGraphsGroup = function (_Canvax$Event$EventDi) {
    inherits$1(LineGraphsGroup, _Canvax$Event$EventDi);

    function LineGraphsGroup(field, a, opt, ctx, sort, yAxis, h, w) {
        classCallCheck$1(this, LineGraphsGroup);

        var _this = possibleConstructorReturn$1(this, (LineGraphsGroup.__proto__ || Object.getPrototypeOf(LineGraphsGroup)).call(this));

        _this.field = field; //_groupInd 在yAxis.field中对应的值
        _this._groupInd = a;
        _this._nodeInd = -1;
        _this._yAxis = yAxis;
        _this.sort = sort;
        _this.ctx = ctx;
        _this.w = w;
        _this.h = h;
        _this.y = 0;

        _this.animation = true;
        _this.resize = false;

        _this.colors = colors;

        _this.line = { //线
            enabled: 1,
            strokeStyle: _this.colors[_this._groupInd],
            lineWidth: 2,
            lineType: "solid",
            smooth: true
        };

        _this.node = { //节点 
            enabled: 1, //是否有
            corner: false, //模式[false || 0 = 都有节点 | true || 1 = 拐角才有节点]
            r: 3, //半径 node 圆点的半径
            fillStyle: '#ffffff',
            strokeStyle: null,
            lineWidth: 2
        };

        _this.text = {
            enabled: 0,
            fillStyle: null,
            strokeStyle: null,
            fontSize: 13,
            format: null

        };

        _this.fill = { //填充
            fillStyle: null,
            alpha: 0.05
        };

        _this.dataOrg = []; //data的原始数据
        _this.data = []; //data会在wight中过滤一遍，把两边的空节点剔除
        _this.sprite = null;

        _this._pointList = []; //brokenline最终的状态
        _this._currPointList = []; //brokenline 动画中的当前状态
        _this._bline = null;

        //从配置里面转换后的一些私有属性
        _this.__lineStrokeStyle = null;

        _this.init(opt);
        return _this;
    }

    createClass$1(LineGraphsGroup, [{
        key: "init",
        value: function init(opt) {
            underscore.deepExtend(this, opt);

            //如果opt中没有 node fill的设置，那么要把fill node 的style和line做同步
            //!this.node.strokeStyle && (this.node.strokeStyle = this._getLineStrokeStyle());
            //!this.fill.fillStyle && (this.fill.fillStyle = this._getLineStrokeStyle());

            this.sprite = new canvax.Display.Sprite();
            var me = this;
            this.sprite.on("destroy", function () {
                if (me._growTween) {
                    AnimationFrame$3.destroyTween(me._growTween);
                }
            });
        }
    }, {
        key: "draw",
        value: function draw(opt) {
            underscore.deepExtend(this, opt);
            this._widget();
        }
    }, {
        key: "update",
        value: function update(opt) {
            if (!this._bline) {
                return;
            }
            underscore.deepExtend(this, opt);
            if (opt.data) {
                this._pointList = this._getPointList(this.data);
                this._grow();
            }
            if (opt._groupInd !== undefined) {
                var _strokeStyle = this._getLineStrokeStyle();
                this._bline.context.strokeStyle = _strokeStyle;
                this._fill.context.fillStyle = this._getFillStyle() || _strokeStyle;
                this._setNodesStyle();
            }
        }

        //自我销毁

    }, {
        key: "destroy",
        value: function destroy() {
            var me = this;
            me.sprite.animate({
                globalAlpha: 0
            }, {
                duration: 300,
                complate: function complate() {
                    me.sprite.remove();
                }
            });
        }

        //styleType , normals , groupInd

    }, {
        key: "_getColor",
        value: function _getColor(s) {
            var color = this._getProp(s);
            if (!color || color == "") {
                color = this.colors[this._groupInd];
            }
            return color;
        }
    }, {
        key: "_getProp",
        value: function _getProp(s) {
            if (underscore.isArray(s)) {
                return s[this._groupInd];
            }
            if (underscore.isFunction(s)) {
                var obj = {
                    iGroup: this._groupInd,
                    iNode: this._nodeInd,
                    field: this.field
                };
                if (this._nodeInd >= 0) {
                    obj.value = this.dataOrg[this._nodeInd].value;
                }

                return s.apply(this, [obj]);
            }
            return s;
        }
    }, {
        key: "_createNodeInfo",
        value: function _createNodeInfo() {
            var me = this;
            var obj = {};
            obj.r = me._getProp(me.node.r);
            obj.fillStyle = me._getProp(me.node.fillStyle) || "#ffffff";
            obj.strokeStyle = me._getProp(me.node.strokeStyle) || me._getLineStrokeStyle();
            obj.color = obj.strokeStyle;
            obj.lineWidth = me._getProp(me.node.lineWidth) || 2;
            obj.alpha = me._getProp(me.fill.alpha);
            obj.field = me.field;
            obj._groupInd = me._groupInd;
            return obj;
        }

        //这个是tips需要用到的 

    }, {
        key: "getNodeInfoAt",
        value: function getNodeInfoAt($index) {
            var me = this;
            me._nodeInd = $index;
            var o = underscore.clone(me.dataOrg[$index]);
            if (o && o.value != null && o.value != undefined && o.value !== "") {
                return underscore.extend(o, me._createNodeInfo());
            } else {
                return null;
            }
        }

        //根据x方向的 val来 获取对应的node， 这个node可能刚好是一个node， 也可能两个node中间的某个位置

    }, {
        key: "getNodeInfoOfX",
        value: function getNodeInfoOfX(x) {
            var me = this;
            var nodeInfo;
            for (var i = 0, l = this.dataOrg.length; i < l; i++) {
                if (Math.abs(this.dataOrg[i].x - x) <= 1) {
                    //左右相差不到1px的，都算
                    nodeInfo = this.getNodeInfoAt(i);
                    return nodeInfo;
                }
            }

            var getPointFromXInLine = function getPointFromXInLine(x, line) {
                var p = { x: x, y: 0 };
                p.y = line[0][1] + (line[1][1] - line[0][1]) / (line[1][0] - line[0][0]) * (x - line[0][0]);
                return p;
            };

            var point;
            var search = function search(points) {

                if (x < points[0][0] || x > points.slice(-1)[0][0]) {
                    return;
                }

                var midInd = parseInt(points.length / 2);
                if (Math.abs(points[midInd][0] - x) <= 1) {
                    point = {
                        x: points[midInd][0],
                        y: points[midInd][1]
                    };
                    return;
                }
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
                search(_pl);
            };

            search(this._bline.context.pointList);

            if (!point) {
                return null;
            }

            point.value = me._yAxis.getValFromYpos(point.y); //null;
            me._nodeInd = -1;
            return underscore.extend(point, me._createNodeInfo());
        }
    }, {
        key: "reset",
        value: function reset(opt) {
            var me = this;
            me._pointList = this._getPointList(opt.data.groupData);
            var plen = me._pointList.length;
            var cplen = me._currPointList.length;
            if (plen < cplen) {
                for (var i = plen, l = cplen; i < l; i++) {
                    me._circles && me._circles.removeChildAt(i);
                    me._texts && me._texts.removeChildAt(i);
                    l--;
                    i--;
                }
                me._currPointList.length = plen;
            }

            if (plen > cplen) {
                diffLen = plen - cplen;
                for (var i = 0; i < diffLen; i++) {
                    me._currPointList.push(underscore.clone(me._currPointList[cplen - 1]));
                }
            }

            //me._circles && me._circles.removeAllChildren();
            //me._texts && me._texts.removeAllChildren();
            me._createNodes();
            me._createTexts();
            me._grow();
        }
    }, {
        key: "_grow",
        value: function _grow(callback) {

            var me = this;
            if (!me.animation || me.resize || me._currPointList.length == 0) {
                //TODO: 在禁止了animation的时候， 如果用户监听了complete事件，必须要加setTimeout，才能触发
                setTimeout(function () {
                    callback && callback(me);
                }, 10);
                return;
            }

            function _update(list) {
                var _strokeStyle = me._getLineStrokeStyle();
                me._bline.context.pointList = underscore.clone(list);
                me._bline.context.strokeStyle = _strokeStyle;

                me._fill.context.path = me._fillLine(me._bline);
                me._fill.context.fillStyle = me._getFillStyle() || _strokeStyle;
                me._circles && underscore.each(me._circles.children, function (circle, i) {
                    var ind = parseInt(circle.id.split("_")[1]);
                    circle.context.y = list[ind][1];
                    circle.context.x = list[ind][0];
                });

                me._texts && underscore.each(me._texts.children, function (text, i) {
                    var ind = parseInt(text.id.split("_")[1]);
                    text.context.y = list[ind][1] - 3;
                    text.context.x = list[ind][0];
                    me._checkTextPos(text, i);
                });
            }

            this._growTween = AnimationFrame$3.registTween({
                from: me._getPointPosStr(me._currPointList),
                to: me._getPointPosStr(me._pointList),
                desc: me.field + ' animation',
                onUpdate: function onUpdate(arg) {
                    for (var p in arg) {
                        var ind = parseInt(p.split("_")[2]);
                        var xory = parseInt(p.split("_")[1]);
                        me._currPointList[ind] && (me._currPointList[ind][xory] = arg[p]); //p_1_n中间的1代表x or y
                    }
                    _update(me._currPointList);
                },
                onComplete: function onComplete() {
                    me._growTween = null;
                    //在动画结束后强制把目标状态绘制一次。
                    //解决在onUpdate中可能出现的异常会导致绘制有问题。
                    //这样的话，至少最后的结果会是对的。
                    _update(me._pointList);
                    callback && callback(me);
                }
            });
        }
    }, {
        key: "_getPointPosStr",
        value: function _getPointPosStr(list) {
            var obj = {};
            underscore.each(list, function (p, i) {
                obj["p_1_" + i] = p[1]; //p_y==p_1
                obj["p_0_" + i] = p[0]; //p_x==p_0
            });
            return obj;
        }
    }, {
        key: "_isNotNum",
        value: function _isNotNum(val) {
            return val === undefined || isNaN(val) || val === null || val === "";
        }
    }, {
        key: "_filterEmptyValue",
        value: function _filterEmptyValue(list) {

            //从左边开始 删除 value为非number的item
            for (var i = 0, l = list.length; i < l; i++) {
                if (this._isNotNum(list[i].value)) {
                    list.shift();
                    l--;
                    i--;
                } else {
                    break;
                }
            }

            //从右边开始删除 value为非number的item
            for (var i = list.length - 1; i > 0; i--) {
                if (this._isNotNum(list[i].value)) {
                    list.pop();
                } else {
                    break;
                }
            }
        }
    }, {
        key: "_getPointList",
        value: function _getPointList(data) {

            var me = this;

            me.dataOrg = underscore.clone(data);
            me._filterEmptyValue(data);

            var list = [];
            for (var a = 0, al = data.length; a < al; a++) {
                var o = data[a];
                list.push([o.x, o.y]);
            }
            return list;
        }
    }, {
        key: "_widget",
        value: function _widget() {
            var me = this;

            me._pointList = this._getPointList(me.data);

            if (me._pointList.length == 0) {
                //filter后，data可能length==0
                return;
            }
            var list = [];
            if (me.animation && !me.resize) {
                for (var a = 0, al = me.data.length; a < al; a++) {
                    var o = me.data[a];
                    var sourceInd = 0;
                    //如果是属于双轴中的右轴。
                    if (me._yAxis.place == "right") {
                        sourceInd = al - 1;
                    }
                    list.push([o.x, me.data[sourceInd].y]);
                }
            } else {
                list = me._pointList;
            }

            me._currPointList = list;

            var bline = new BrokenLine$4({ //线条
                context: {
                    pointList: list,
                    //strokeStyle: me._getLineStrokeStyle(),
                    lineWidth: me.line.lineWidth,
                    y: me.y,
                    smooth: me.line.smooth,
                    lineType: me._getProp(me.line.lineType),
                    //smooth为true的话，折线图需要对折线做一些纠正，不能超过底部
                    smoothFilter: function smoothFilter(rp) {
                        if (rp[1] > 0) {
                            rp[1] = 0;
                        } else if (Math.abs(rp[1]) > me.h) {
                            rp[1] = -me.h;
                        }
                    },
                    lineCap: "round"
                }
            });
            if (!this.line.enabled) {
                bline.context.visible = false;
            }
            me.sprite.addChild(bline);
            me._bline = bline;

            var _strokeStyle = me._getLineStrokeStyle();
            bline.context.strokeStyle = _strokeStyle;

            var fill = new Path$1({ //填充
                context: {
                    path: me._fillLine(bline),
                    fillStyle: me._getFillStyle() || _strokeStyle, //fill_gradient || me._getColor(me.fill.fillStyle),
                    globalAlpha: underscore.isArray(me.fill.alpha) ? 1 : me.fill.alpha //me._getProp( me.fill.alpha )
                }
            });
            me.sprite.addChild(fill);
            me._fill = fill;
            me._createNodes();
            me._createTexts();
        }
    }, {
        key: "_getFillStyle",
        value: function _getFillStyle() {

            var me = this;

            var fill_gradient = null;
            var _fillStyle = me.fill.fillStyle;

            if (!_fillStyle) {
                //如果没有配置的fillStyle，那么就取对应的line.strokeStyle
                _fillStyle = me._getLineStrokeStyle("fillStyle");
            }

            _fillStyle && (_fillStyle = me._getColor(me.fill.fillStyle));

            if (underscore.isArray(me.fill.alpha) && !(_fillStyle instanceof CanvasGradient)) {
                //alpha如果是数组，那么就是渐变背景，那么就至少要有两个值
                //如果拿回来的style已经是个gradient了，那么就不管了
                me.fill.alpha.length = 2;
                if (me.fill.alpha[0] == undefined) {
                    me.fill.alpha[0] = 0;
                }
                if (me.fill.alpha[1] == undefined) {
                    me.fill.alpha[1] = 0;
                }

                //从bline中找到最高的点
                var topP = underscore.min(me._bline.context.pointList, function (p) {
                    return p[1];
                });
                //创建一个线性渐变
                fill_gradient = me.ctx.createLinearGradient(topP[0], topP[1], topP[0], 0);

                var rgb = ColorFormat.colorRgb(_fillStyle);
                var rgba0 = rgb.replace(')', ', ' + me._getProp(me.fill.alpha[0]) + ')').replace('RGB', 'RGBA');
                fill_gradient.addColorStop(0, rgba0);

                var rgba1 = rgb.replace(')', ', ' + me.fill.alpha[1] + ')').replace('RGB', 'RGBA');
                fill_gradient.addColorStop(1, rgba1);

                _fillStyle = fill_gradient;
            }

            return _fillStyle;
        }
    }, {
        key: "_getLineStrokeStyle",
        value: function _getLineStrokeStyle(from) {
            var me = this;

            if (this.line.strokeStyle.lineargradient) {
                //如果填充是一个线性渐变
                //从bline中找到最高的点
                var topP = underscore.min(me._bline.context.pointList, function (p) {
                    return p[1];
                });
                var bottomP = underscore.max(me._bline.context.pointList, function (p) {
                    return p[1];
                });
                if (from == "fillStyle") {
                    bottomP = [0, 0];
                }
                //var bottomP = [ 0 , 0 ];
                //创建一个线性渐变
                this.__lineStrokeStyle = me.ctx.createLinearGradient(topP[0], topP[1], topP[0], bottomP[1]);

                if (!underscore.isArray(this.line.strokeStyle.lineargradient)) {
                    this.line.strokeStyle.lineargradient = [this.line.strokeStyle.lineargradient];
                }

                underscore.each(this.line.strokeStyle.lineargradient, function (item, i) {
                    me.__lineStrokeStyle.addColorStop(item.position, item.color);
                });
            } else {
                this.__lineStrokeStyle = this._getColor(this.line.strokeStyle);
            }
            return this.__lineStrokeStyle;
        }
    }, {
        key: "_setNodesStyle",
        value: function _setNodesStyle() {
            var me = this;
            var list = me._currPointList;
            if ((me.node.enabled || list.length == 1) && !!me.line.lineWidth) {
                //拐角的圆点
                for (var a = 0, al = list.length; a < al; a++) {
                    me._nodeInd = a;
                    var nodeEl = me._circles.getChildAt(a);
                    var strokeStyle = me._getProp(me.node.strokeStyle) || me._getLineStrokeStyle();
                    nodeEl.context.fillStyle = list.length == 1 ? strokeStyle : me._getProp(me.node.fillStyle) || "#ffffff";
                    nodeEl.context.strokeStyle = strokeStyle;

                    me._nodeInd = -1;
                }
            }
        }
    }, {
        key: "_createNodes",
        value: function _createNodes() {
            var me = this;
            var list = me._currPointList;

            if ((me.node.enabled || list.length == 1) && !!me.line.lineWidth) {
                //拐角的圆点
                if (!this._circles) {
                    this._circles = new canvax.Display.Sprite({});
                    this.sprite.addChild(this._circles);
                }

                for (var a = 0, al = list.length; a < al; a++) {
                    var context = {
                        x: me._currPointList[a][0],
                        y: me._currPointList[a][1],
                        r: me._getProp(me.node.r),
                        lineWidth: me._getProp(me.node.lineWidth) || 2,
                        fillStyle: me.node.fillStyle
                    };

                    var circle = me._circles.children[a];
                    if (circle) {
                        underscore.extend(circle.context, context);
                    } else {
                        circle = new Circle$4({
                            id: "circle_" + a,
                            context: context
                        });
                        me._circles.addChild(circle);
                    }

                    if (me.node.corner) {
                        //拐角才有节点
                        var y = me._pointList[a][1];
                        var pre = me._pointList[a - 1];
                        var next = me._pointList[a + 1];
                        if (pre && next) {
                            if (y == pre[1] && y == next[1]) {
                                circle.context.visible = false;
                            }
                        }
                    }
                }
                if (me._circles.children.length > list.length) {
                    for (var i = me._circles.children.length, l = list.length; i < l; i++) {
                        me._circles.children[i].destroy();
                        i--;
                        l--;
                    }
                }
            }
            this._setNodesStyle();
        }
    }, {
        key: "_createTexts",
        value: function _createTexts() {

            var me = this;
            var list = me._currPointList;

            if (me.text.enabled) {
                //节点上面的文本info
                if (!this._texts) {
                    this._texts = new canvax.Display.Sprite({});
                    this.sprite.addChild(this._texts);
                }

                for (var a = 0, al = list.length; a < al; a++) {
                    me._nodeInd = a;
                    var fontFillStyle = me._getProp(me.text.fillStyle) || me._getProp(me.node.strokeStyle) || me._getLineStrokeStyle();
                    me._nodeInd = -1;
                    var context = {
                        x: me._currPointList[a][0],
                        y: me._currPointList[a][1] - 3,
                        fontSize: this.text.fontSize,
                        textAlign: "center",
                        textBaseline: "bottom",
                        fillStyle: fontFillStyle,
                        lineWidth: 1,
                        strokeStyle: "#ffffff"
                    };

                    var content = me.data[a].value;
                    if (underscore.isFunction(me.text.format)) {
                        content = me.text.format.apply(me, [content, a]) || content;
                    }

                    var text = this._texts.children[a];
                    if (text) {
                        text.resetText(content);
                        underscore.extend(text.context, context);
                    } else {
                        text = new canvax.Display.Text(content, {
                            id: "text_" + a,
                            context: context
                        });
                        me._texts.addChild(text);
                        me._checkTextPos(text, a);
                    }
                }

                if (me._texts.children.length > list.length) {
                    for (var i = me._texts.children.length, l = list.length; i < l; i++) {
                        me._texts.children[i].destroy();
                        i--;
                        l--;
                    }
                }
            }
            this._setNodesStyle();
        }
    }, {
        key: "_checkTextPos",
        value: function _checkTextPos(text, ind) {
            var me = this;
            var list = me._currPointList;
            var pre = list[ind - 1];
            var next = list[ind + 1];
            if (ind == 0) {
                text.context.textAlign = "left";
            }
            if (ind == list.length - 1) {
                text.context.textAlign = "right";
            }

            if (pre && next && pre[1] < text.context.y && next[1] < text.context.y) {
                text.context.y += 7;
                text.context.textBaseline = "top";
            }
        }
    }, {
        key: "_fillLine",
        value: function _fillLine(bline) {
            //填充直线
            var fillPath = underscore.clone(bline.context.pointList);
            if (fillPath.length == 0) {
                return "";
            }
            var baseY = 0;
            if (this.sort == "desc") {
                baseY = -this.h;
            }
            fillPath.push([fillPath[fillPath.length - 1][0], baseY], [fillPath[0][0], baseY], [fillPath[0][0], fillPath[0][1]]);
            return getPath(fillPath);
        }
    }]);
    return LineGraphsGroup;
}(canvax.Event.EventDispatcher);

var Line$8 = canvax.Shapes.Line;
var Circle$5 = canvax.Shapes.Circle;

var markColumn = function (_Canvax$Event$EventDi) {
    inherits$1(markColumn, _Canvax$Event$EventDi);

    function markColumn(opt, data) {
        classCallCheck$1(this, markColumn);

        var _this = possibleConstructorReturn$1(this, (markColumn.__proto__ || Object.getPrototypeOf(markColumn)).call(this));

        _this.xVal = null;
        _this.enabled = true;
        _this.line = {
            enabled: 1,
            eventEnabled: true
            //strokeStyle : null
        };
        _this.node = {
            enabled: 1
            //strokeStyle : null
            //backFillStyle : null
        };

        _this.sprite = null;
        _this._line = null;
        _this._nodes = null;
        _this._isShow = false;
        _this.enabled = true;

        _this.y = 0;
        _this.h = 0;

        //TODO:
        //暂时继承CanvaxEventDispatcher 只有 DisplayObject才行， 以为其他对象没有_eventMap
        //临时加上
        _this._eventMap = {};

        _this.init(opt, data);
        return _this;
    }

    createClass$1(markColumn, [{
        key: "init",
        value: function init(opt, data) {
            underscore.deepExtend(this, opt);
            this.sprite = new canvax.Display.Sprite({
                id: "tips"
            });
        }
    }, {
        key: "show",
        value: function show(e, pointInfo) {
            this.eventInfo = e.eventInfo;

            if (e.eventInfo.markcolumn) {
                underscore.deepExtend(this, e.eventInfo.markcolumn);
            }
            if (!this.enabled) {
                this.hide();
                return this;
            }
            this.sprite.context.visible = true;
            this._showLine(pointInfo);
            this._showNodes(e, pointInfo);
            return this;
        }
    }, {
        key: "hide",
        value: function hide() {
            this.sprite.context.visible = false;
        }
    }, {
        key: "move",
        value: function move(e, pointInfo) {
            this.eventInfo = e.eventInfo;

            if (this._line) {
                this._line.context.x = parseInt(pointInfo.x);
            }
            if (pointInfo.xVal !== undefined) {
                this.xVal = pointInfo.xVal;
            }
            this._resetNodesStatus(e, pointInfo);
        }
    }, {
        key: "destroy",
        value: function destroy() {
            this.sprite.destroy();
            this._line = null;
            this._nodes = null;
        }
        /**
         * line相关------------------------
         */

    }, {
        key: "_showLine",
        value: function _showLine(pointInfo) {
            var me = this;
            var lineOpt = underscore.deepExtend({
                x: parseInt(pointInfo.x),
                y: me.y,
                start: {
                    x: 0,
                    y: me.h
                },
                end: {
                    x: 0,
                    y: 0
                },
                lineWidth: 1,
                strokeStyle: this.line.strokeStyle || "#cccccc"
            }, this.line);
            if (this.line.enabled) {
                if (this._line) {
                    underscore.extend(this._line.context, lineOpt);
                } else {
                    this._line = new Line$8({
                        id: "tipsLine",
                        context: lineOpt
                    });
                    this._line.name = "_markcolumn_line";
                    this.sprite.addChild(this._line);

                    if (this.line.eventEnabled) {
                        this._line.on("mouseover", function (evt) {
                            if (evt.fromTarget && evt.fromTarget.name == "_markcolumn_node") {
                                return;
                            }
                            evt.eventInfo = me.eventInfo;
                            if (me.xVal !== null) {
                                evt.eventInfo.xAxis = { value: me.xVal };
                            }
                            me.fire("mouseover", evt);
                        });
                        this._line.on("mousemove", function (evt) {
                            evt.eventInfo = me.eventInfo;
                            if (me.xVal !== null) {
                                evt.eventInfo.xAxis = { value: me.xVal };
                            }
                            me.fire("mousemove", evt);
                        });
                        this._line.on("mouseout", function (evt) {
                            if (evt.toTarget && evt.toTarget.name == "_markcolumn_node") {
                                return;
                            }
                            evt.eventInfo = me.eventInfo;
                            if (me.xVal !== null) {
                                evt.eventInfo.xAxis = { value: me.xVal };
                            }
                            me.fire("mouseout", evt);
                        });
                    }
                }
            }
            return this;
        }

        /**
         *nodes相关-------------------------
         */

    }, {
        key: "_showNodes",
        value: function _showNodes(e, pointInfo) {

            var me = this;
            if (!this.node.enabled) {
                return;
            }
            if (this._nodes) {
                this._resetNodesStatus(e, pointInfo);
            } else {
                this._nodes = new canvax.Display.Sprite({
                    context: {
                        x: parseInt(pointInfo.x),
                        y: me.y
                    }
                });
                var me = this;

                underscore.each(e.eventInfo.nodesInfoList, function (node) {
                    var csp = new canvax.Display.Sprite({
                        context: {
                            y: me.h - Math.abs(node.y)
                        }
                    });

                    var bigCircle = new Circle$5({
                        context: {
                            r: node.r + 2,
                            fillStyle: me.node.backFillStyle || "white", //node.fillStyle,
                            strokeStyle: me.node.strokeStyle || node.strokeStyle,
                            lineWidth: node.lineWidth,
                            cursor: 'pointer'
                        }
                    });

                    bigCircle.name = '_markcolumn_node', bigCircle.eventInfo = {
                        iGroup: 0, //node._groupInd,
                        iNode: e.eventInfo.iNode,
                        nodesInfoList: [node]
                    };

                    csp.addChild(bigCircle);

                    me._nodes.addChild(csp);

                    bigCircle.on("mouseover", function (evt) {
                        if (evt.fromTarget && (evt.fromTarget.name == "_markcolumn_line" || evt.fromTarget.name == "_markcolumn_node")) {
                            return;
                        }
                        evt.eventInfo = evt.target.eventInfo;

                        if (me.xVal !== null) {
                            evt.eventInfo.xAxis = { value: me.xVal };
                        }
                        me.fire("mouseover", evt);
                    });
                    bigCircle.on("mousemove", function (evt) {
                        evt.eventInfo = evt.target.eventInfo;
                        if (me.xVal !== null) {
                            evt.eventInfo.xAxis = { value: me.xVal };
                        }
                        me.fire("mousemove", evt);
                    });
                    bigCircle.on("mouseout", function (evt) {
                        if (evt.toTarge && (evt.toTarget.name == "_markcolumn_line" || evt.toTarget.name == "_markcolumn_node")) {
                            return;
                        }
                        evt.eventInfo = evt.target.eventInfo;
                        if (me.xVal !== null) {
                            evt.eventInfo.xAxis = { value: me.xVal };
                        }
                        me.fire("mouseout", evt);
                    });
                    bigCircle.on("click", function (evt) {
                        // evt.target.eventInfo.nodeInfo = evt.target.eventInfo.nodesInfoList[0]
                        // var eventInfo = _.clone(evt.target.eventInfo)
                        // delete eventInfo.nodesInfoList
                        var o = {
                            eventInfo: underscore.clone(evt.target.eventInfo)
                        };
                        if (me.xVal !== null) {
                            o.eventInfo.xAxis = { value: me.xVal };
                        }
                        me.sprite.fire("nodeclick", o);
                    });
                });
                this.sprite.addChild(this._nodes);
            }

            return this;
        }

        /**
        * 重置nodes的状态
        */

    }, {
        key: "_resetNodesStatus",
        value: function _resetNodesStatus(e, pointInfo) {
            if (!this.enabled || !this.node.enabled) {
                return;
            }
            var me = this;
            if (this._nodes.children.length != e.eventInfo.nodesInfoList.length) {
                this._nodes.removeAllChildren();
                this._nodes = null;
                this._showNodes(e, pointInfo);
            }
            this._nodes.context.x = parseInt(pointInfo.x);
            underscore.each(e.eventInfo.nodesInfoList, function (node, i) {
                var csps = me._nodes.getChildAt(i).context;
                csps.y = me.h - Math.abs(node.y);

                var bigCircle = me._nodes.getChildAt(i).getChildAt(0);
                bigCircle.eventInfo = {
                    iGroup: 0, //node._groupInd,
                    iNode: e.eventInfo.iNode,
                    nodesInfoList: [node]
                };
            });
        }
    }]);
    return markColumn;
}(canvax.Event.EventDispatcher);

var Rect$5 = canvax.Shapes.Rect;

var LineGraphs = function (_Canvax$Event$EventDi) {
    inherits$1(LineGraphs, _Canvax$Event$EventDi);

    function LineGraphs(opt, root) {
        classCallCheck$1(this, LineGraphs);

        var _this = possibleConstructorReturn$1(this, (LineGraphs.__proto__ || Object.getPrototypeOf(LineGraphs)).call(this));

        _this.w = 0;
        _this.h = 0;
        _this.x = 0;
        _this.y = 0;

        //这里所有的opt都要透传给 group
        _this.opt = opt || {};
        _this.root = root;
        _this.ctx = root.stage.context2D;
        _this.dataFrame = _this.opt.dataFrame || root.dataFrame; //root.dataFrame的引用
        _this.data = []; //二维 [[{x:0,y:-100,...},{}],[]]

        //这里在用的时候不直接使用 root._coordinate._yAxis
        //而是先用this._yAxis存储起来
        //方便比如bar_line柱折混合的时候覆盖掉
        _this._yAxis = _this.root._coordinate._yAxis;

        //field默认从 直角坐标系的yAxisFields中获取 获取

        //['uv','pv','click'] 这样的一维结构集合，哪怕是双轴的yAxis
        //就算是在混合图表里， 也是全量的集合
        _this.field = _this.root._coordinate.yAxisFields; //this.dataFrame.yAxis.field;


        //一个记录了原始yAxis.field 一些基本信息的map
        //{ "uv" : {ind : 0 , _yAxis : , line} ...}
        _this._yAxisFieldsMap = {};
        _this._setyAxisFieldsMap(_this.field);

        _this.disX = 0; //点与点之间的间距
        _this.groups = []; //群组集合     

        _this.iGroup = 0; //群组索引(哪条线)
        _this.iNode = -1; //节点索引(那个点)

        _this.sprite = null;
        _this.induce = null;

        _this.eventEnabled = true;

        //TODO:
        //暂时继承CanvaxEventDispatcher 只有 DisplayObject才行， 以为其他对象没有_eventMap
        //临时加上
        _this._eventMap = {};

        _this.init(_this.opt);
        return _this;
    }

    createClass$1(LineGraphs, [{
        key: "init",
        value: function init(opt) {
            this.opt = opt;
            underscore.deepExtend(this, opt);
            this.sprite = new canvax.Display.Sprite();
        }
    }, {
        key: "setX",
        value: function setX($n) {
            this.sprite.context.x = $n;
        }
    }, {
        key: "setY",
        value: function setY($n) {
            this.sprite.context.y = $n;
        }
    }, {
        key: "getX",
        value: function getX() {
            return this.sprite.context.x;
        }
    }, {
        key: "getY",
        value: function getY() {
            return this.sprite.context.y;
        }
    }, {
        key: "draw",
        value: function draw(opt) {
            underscore.deepExtend(this, opt);

            this.setX(this.x);
            this.setY(this.y);

            this.disX = this._getGraphsDisX();

            this.data = this._trimGraphs();

            this._setGroupsForYfield(this.data);

            this._widget(opt, this.data);

            this.grow();

            return this;
        }
    }, {
        key: "reset",
        value: function reset(opt, dataFrame) {

            var me = this;

            if (dataFrame) {
                me.dataFrame = dataFrame;
                me.data = me._trimGraphs();
            }

            if (opt) {
                underscore.deepExtend(me, opt);
                if (opt.yAxisChange) {
                    me.yAxisFieldChange(opt.yAxisChange, this.dataFrame);
                }
            }

            this.disX = this._getGraphsDisX();

            for (var a = 0, al = me.field.length; a < al; a++) {
                //var group = me.groups[a];
                var group = underscore.find(me.groups, function (g) {
                    return g.field == me.field[a];
                });
                group && group.reset({
                    data: me.data[group.field]
                });
            }
        }

        //_yAxis, dataFrame

    }, {
        key: "_trimGraphs",
        value: function _trimGraphs() {
            var self = this;
            var _dataFrame = self.dataFrame || self.root.dataFrame;

            //{"uv":{}.. ,"click": "pv":]}
            //这样按照字段摊平的一维结构
            var tmpData = {};

            function __trimGraphs(_yAxis) {
                var _fields = _yAxis.field;
                if (!underscore.isArray(_fields)) {
                    _fields = [_fields];
                }

                underscore.each(_fields, function (field, i) {
                    var maxValue = 0;

                    //单条line的全部data数据
                    var _lineData = _dataFrame.getFieldData(field);
                    if (!_lineData) return;

                    var _groupData = [];
                    for (var b = 0, bl = _lineData.length; b < bl; b++) {
                        var _xAxis = self.root._coordinate ? self.root._coordinate._xAxis : self.root._xAxis;
                        var x = _xAxis.getPosX({
                            ind: b,
                            dataLen: bl,
                            layoutType: self.root._coordinate ? self.root._coordinate.xAxis.layoutType : self.root._xAxis.layoutType
                        });

                        var y = _yAxis.getYposFromVal(_lineData[b]);
                        y = isNaN(y) ? 0 : y;
                        _groupData.push({
                            value: _lineData[b],
                            x: x,
                            y: y
                        });

                        maxValue += _lineData[b];
                    }

                    tmpData[field] = {
                        yAxis: _yAxis,
                        field: field,
                        groupData: _groupData,
                        average: {
                            value: maxValue / bl,
                            position: _yAxis.getYposFromVal(maxValue / bl)
                        }
                    };
                });
            }

            //可能被外部覆盖的时候，没有赋值一个数组结构
            underscore.each(underscore.flatten([this._yAxis]), function (axis, i) {
                __trimGraphs(axis);
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
            underscore.each(this.groups, function (g, i) {
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
        key: "_setyAxisFieldsMap",
        value: function _setyAxisFieldsMap(fields) {
            var me = this;
            //me._yAxisFieldsMap = {};
            underscore.each(underscore.flatten(fields), function (field, i) {
                var _yAxisF = me._yAxisFieldsMap[field];
                if (_yAxisF) {
                    me._yAxisFieldsMap[field].ind = i;
                } else {
                    me._yAxisFieldsMap[field] = {
                        group: null,
                        ind: i,
                        yAxisInd: 0 //0为依赖左边的y轴，1为右边的y轴
                    };
                }
            });
        }

        /*
        * 如果配置的yAxis有修改
        */

    }, {
        key: "yAxisFieldChange",
        value: function yAxisFieldChange(yAxisChange, dataFrame) {
            this.dataFrame = dataFrame;
            this.data = this._trimGraphs();

            var me = this;
            underscore.isString(yAxisChange) && (yAxisChange = [yAxisChange]);

            //如果新的yAxis.field有需要del的
            for (var i = 0, l = me.field.length; i < l; i++) {
                var _f = me.field[i];
                var dopy = underscore.find(yAxisChange, function (f) {
                    return f == _f;
                });
                if (!dopy) {
                    me.remove(i);
                    me.field.splice(i, 1);
                    delete me._yAxisFieldsMap[_f];
                    i--;
                    l--;
                }
            }

            //然后把新的field设置好
            this.field = me.root._coordinate ? me.root._coordinate.yAxisFields : this.dataFrame.yAxis.field;
            //remove掉被去掉的field后，重新整理下 _yAxisFieldsMap
            me._setyAxisFieldsMap(this.field);

            //新的field配置有需要add的
            underscore.each(yAxisChange, function (opy, i) {
                var fopy = underscore.find(me.groups, function (f) {
                    return f.field == opy;
                });
                if (!fopy) {
                    me.add(opy);
                }
            });

            underscore.each(me.groups, function (g, i) {
                g.update(underscore.extend({
                    _groupInd: i
                }, me.opt));
            });
        }

        //add 和 remove 都不涉及到 _yAxisFieldsMap 的操作,只有reset才会重新构建 _yAxisFieldsMap

    }, {
        key: "add",
        value: function add(field) {

            this.data = this._trimGraphs();

            this._setGroupsForYfield(this.data, field);

            this.update();
        }

        /*
         *删除 ind
         **/

    }, {
        key: "remove",
        value: function remove(i) {
            this.groups.splice(i, 1)[0].destroy();
            this.data = this._trimGraphs();
            this.update();
        }

        /*
         * 更新下最新的状态
         **/

    }, {
        key: "update",
        value: function update(opt) {
            var self = this;
            underscore.each(this.groups, function (g, i) {
                g.update({
                    data: self.data[g.field].groupData
                });
            });
        }
    }, {
        key: "_setGroupsForYfield",
        value: function _setGroupsForYfield(data, fields) {

            var self = this;

            if (fields) {
                //如果有传入field参数，那么就说明只需要从data里面挑选指定的field来添加
                //一般用在add()执行的时候
                fields = underscore.flatten([fields]);
            }

            underscore.each(data, function (g, field) {
                if (fields && underscore.indexOf(fields, field) == -1) {
                    //如果有传入fields，但是当前field不在fields里面的话，不需要处理
                    //说明该group已经在graphs里面了
                    return;
                }
                //记录起来该字段对应的应该是哪个_yAxis
                var yfm = self._yAxisFieldsMap[field];
                var _groupInd = yfm.ind;

                var group = new LineGraphsGroup(field, _groupInd, self.opt, self.ctx, g.yAxis.sort, g.yAxis, self.h, self.w);

                group.draw({
                    data: g.groupData,
                    resize: self.resize
                });

                yfm.group = group;

                var insert = false;
                //在groups数组中插入到比自己_groupInd小的元素前面去
                for (var gi = 0, gl = self.groups.length; gi < gl; gi++) {
                    if (_groupInd < self.groups[gi]._groupInd) {

                        self.groups.splice(gi, 0, group);
                        insert = true;
                        self.sprite.addChildAt(group.sprite, gi);

                        break;
                    }
                }
                //否则就只需要直接push就好了
                if (!insert) {
                    self.groups.push(group);
                    self.sprite.addChild(group.sprite);
                }
            });
        }
    }, {
        key: "_widget",
        value: function _widget(opt) {
            var self = this;

            self.induce = new Rect$5({
                id: "induce",
                context: {
                    y: -self.h,
                    width: self.w,
                    height: self.h,
                    fillStyle: '#000000',
                    globalAlpha: 0,
                    cursor: 'pointer'
                }
            });

            self.sprite.addChild(self.induce);

            if (self.eventEnabled) {

                self.induce.on("panstart mouseover", function (e) {
                    e.eventInfo = self._getInfoHandler(e);
                });
                self.induce.on("panmove mousemove", function (e) {
                    e.eventInfo = self._getInfoHandler(e);
                });
                self.induce.on("panend mouseout", function (e) {
                    e.eventInfo = self._getInfoHandler(e);
                    self.iGroup = 0, self.iNode = -1;
                });
                self.induce.on("tap click", function (e) {
                    e.eventInfo = self._getInfoHandler(e);
                });
            }
            self.resize = false;
        }
    }, {
        key: "_getInfoHandler",
        value: function _getInfoHandler(e) {

            var x = e.point.x,
                y = e.point.y - this.h;
            //todo:底层加判断
            x = x > this.w ? this.w : x;

            var tmpINode = this.disX == 0 ? 0 : parseInt((x + this.disX / 2) / this.disX);

            var _nodesInfoList = []; //节点信息集合

            for (var a = 0, al = this.groups.length; a < al; a++) {
                var o = this.groups[a].getNodeInfoAt(tmpINode);
                o && _nodesInfoList.push(o);
            }

            var tmpIGroup = getDisMinATArr(y, underscore.pluck(_nodesInfoList, "y"));

            this.iGroup = tmpIGroup, this.iNode = tmpINode;
            //iGroup 第几条线   iNode 第几个点   都从0开始
            var node = {
                iGroup: this.iGroup,
                iNode: this.iNode,
                nodesInfoList: underscore.clone(_nodesInfoList)
            };
            return node;
        }
    }, {
        key: "getNodesInfoOfx",
        value: function getNodesInfoOfx(x) {
            var _nodesInfoList = []; //节点信息集合
            for (var a = 0, al = this.groups.length; a < al; a++) {
                var o = this.groups[a].getNodeInfoOfX(x);
                o && _nodesInfoList.push(o);
            }
            var node = {
                iGroup: -1,
                iNode: -1,
                nodesInfoList: underscore.clone(_nodesInfoList)
            };
            return node;
        }
    }, {
        key: "createMarkColumn",
        value: function createMarkColumn(x, opt) {
            var ml = new markColumn(opt);
            this.sprite.addChild(ml.sprite);
            ml.h = this.induce.context.height;
            ml.y = -ml.h;
            var e = {
                eventInfo: this.getNodesInfoOfx(x)
            };
            ml.show(e, { x: x });
            ml.data = e.eventInfo;

            return ml;
        }

        //每两个点之间的距离

    }, {
        key: "_getGraphsDisX",
        value: function _getGraphsDisX() {
            var dsl = this.dataFrame.org.length - 1;
            var n = this.w / (dsl - 1);
            if (dsl == 1) {
                n = 0;
            }
            return n;
        }

        //这里得到的ind 和 groundInd不同，这里是真实的索引

    }, {
        key: "getIndexOfField",
        value: function getIndexOfField(field) {
            var i = -1;
            underscore.each(this.groups, function (g, ii) {
                if (g.field == field) {
                    i = ii;
                    return false;
                }
            });
            return i;
        }
    }]);
    return LineGraphs;
}(canvax.Event.EventDispatcher);

var LineTips = function (_Canvax$Event$EventDi) {
    inherits$1(LineTips, _Canvax$Event$EventDi);

    function LineTips(opt, tipDomContainer, data) {
        classCallCheck$1(this, LineTips);

        var _this = possibleConstructorReturn$1(this, (LineTips.__proto__ || Object.getPrototypeOf(LineTips)).call(this));

        _this.sprite = null;

        _this._tips = null;
        _this._markColumn = null;

        _this._isShow = false;
        _this.enabled = true;

        _this.induce = null; //graphs中的induce，用来触发事件系统

        _this.init(opt, tipDomContainer, data);
        return _this;
    }

    createClass$1(LineTips, [{
        key: "init",
        value: function init(opt, tipDomContainer, data) {
            var me = this;

            underscore.deepExtend(this, opt);
            this.sprite = new canvax.Display.Sprite({
                id: "tips"
            });

            this._tips = new Tips(opt, tipDomContainer);
            this.sprite.addChild(this._tips.sprite);

            this._markColumn = new markColumn(underscore.extend({
                line: {
                    eventEnabled: false
                }
            }, opt));
            this.sprite.addChild(this._markColumn.sprite);

            this._markColumn.on("mouseover", function (e) {
                //因为柱折混合图中得 bar的tips移动到 折线的圆点上面的时候会  hide掉 tip
                //所以这里再show回去
                setTimeout(function () {
                    if (me._isShow == false) {
                        //单独的在line中是不会执行到这里的，line中调用的show 始终会把_isShow 设置为 true
                        me.show(e);
                    }
                }, 6);
            });
        }
    }, {
        key: "setInduce",
        value: function setInduce(induce) {
            this.induce = induce;
            var ictx = induce.context;
            var ictxLocPos = induce.localToGlobal();
            this.layout = {
                x: ictxLocPos.x,
                y: ictxLocPos.y,
                width: ictx.width,
                height: ictx.height
            };
            this._markColumn.y = this.layout.y;
            this._markColumn.h = this.layout.height;
        }
    }, {
        key: "reset",
        value: function reset(opt) {
            underscore.deepExtend(this._tips, opt);
        }

        //从柱状折图中传过来的tipsPoint参数会添加lineTop,lineH的属性用来绘制markCloumn

    }, {
        key: "show",
        value: function show(e) {
            if (!this.enabled || !e.eventInfo) return;

            var tipsPoint = this._getTipsPoint(e);
            this._tips.show(e, tipsPoint);
            this._markColumn.show(e, tipsPoint);
            this._isShow = true;
        }
    }, {
        key: "move",
        value: function move(e) {
            if (!this.enabled || !e.eventInfo) return;
            var tipsPoint = this._getTipsPoint(e);
            this._markColumn.move(e, tipsPoint);
            this._tips.move(e);
        }
    }, {
        key: "hide",
        value: function hide(e) {
            if (!this.enabled) return;
            this._tips.hide(e);
            this._markColumn.hide(e);
            this._isShow = false;
        }
    }, {
        key: "_getTipsPoint",
        value: function _getTipsPoint(e) {
            var target = this.induce || e.target;
            var point = target.localToGlobal(e.eventInfo.nodesInfoList[e.eventInfo.iGroup]);
            if (e.eventInfo.tipsLine) {
                point.x = e.eventInfo.tipsLine.x;
            }
            return point;
        }
    }]);
    return LineTips;
}(canvax.Event.EventDispatcher);

var Line$6 = function (_Chart) {
    inherits$1(Line, _Chart);

    function Line(node, data, opts) {
        classCallCheck$1(this, Line);

        var _this = possibleConstructorReturn$1(this, (Line.__proto__ || Object.getPrototypeOf(Line)).call(this, node, data, opts));

        _this.type = "line";
        _this.coordinate.xAxis.layoutType = "rule";

        underscore.deepExtend(_this, opts);
        _this.dataFrame = _this._initData(data);

        //一些继承自该类的 constructor 会拥有_init来做一些覆盖，暂时没有场景，先和bar保持一致
        _this._init && _this._init(node, data, opts);
        _this.draw();
        return _this;
    }

    createClass$1(Line, [{
        key: "draw",
        value: function draw(opt) {
            !opt && (opt = {});
            this.setStages();
            if (this.rotate) {
                this._rotate(this.rotate);
            }
            this._initModule(opt); //初始化模块  
            this.initPlugsModules(opt); // 初始化组件
            this._startDraw(opt); //开始绘图
            this.drawPlugs(opt); //开始绘制插件
            this.inited = true;
        }
    }, {
        key: "reset",
        value: function reset(opt) {

            var me = this;

            if (opt && opt.options) {
                underscore.deepExtend(this, opt.options);

                //如果有配置yAxis.field，说明要覆盖之前的yAxis.field配置
                if (opt.options.coordinate && opt.options.coordinate.yAxis && opt.options.coordinate.yAxis.field) {
                    if (!opt.options.graphs) {
                        opt.options.graphs = {};
                    }
                    opt.options.graphs.yAxisChange = opt.options.coordinate.yAxis.field;
                }
            }

            var d = this.dataFrame.org || [];
            if (opt && opt.data) {
                this._data = Tools.parse2MatrixData(opt.data); //加上这句，用来更新datazoom
                d = opt.data;
            }

            //不管opt里面有没有传入数据，option的改变也会影响到 dataFrame 。
            this.dataFrame = this._initData(d, this);

            this._reset(opt.options);
        }

        /*
         * 如果只有数据改动的情况
         */

    }, {
        key: "resetData",
        value: function resetData(data, e) {
            this._data = Tools.parse2MatrixData(data);
            this.dataFrame = this._initData(data, this);
            this._reset(this, e);
        }
    }, {
        key: "_reset",
        value: function _reset(opt, e) {
            var me = this;
            opt = !opt ? this : opt;

            this._coordinate.reset(opt.coordinate, this.dataFrame);

            this._graphs.reset(opt.graphs, this.dataFrame);

            this.plugsReset(opt, e);
        }

        /*
         *添加一个yAxis字段，也就是添加一条brokenline折线
         *@params field 添加的字段
         **/

    }, {
        key: "add",
        value: function add(field, targetYAxis) {
            this._coordinate.addField(field, targetYAxis);
            this._graphs.add(field);
        }

        /*
         *删除一个yaxis字段，也就是删除一条brokenline线
         *@params target 也可以是字段名字，也可以是 index
         **/

    }, {
        key: "remove",
        value: function remove(target, _ind) {
            var ind = null;
            if (underscore.isNumber(target)) {
                //说明是索引
                ind = target;
            } else {
                //说明是名字，转换为索引
                ind = this._graphs.getIndexOfField(target);
            }
            if (ind > -1) {
                this._remove(ind, target);
            }
        }
    }, {
        key: "_remove",
        value: function _remove(ind, target) {
            this._coordinate.removeField(target);
            //然后就是删除graphs中对应的brokenline，并且把剩下的brokenline缓动到对应的位置
            this._graphs.remove(ind);
        }
    }, {
        key: "_initData",
        value: function _initData(data, opt) {
            var d;
            var dataZoom = this.dataZoom || opt && opt.dataZoom;

            if (this._opts.dataZoom) {
                var datas = [data[0]];
                datas = datas.concat(data.slice(parseInt(dataZoom.range.start) + 1, parseInt(dataZoom.range.end) + 1 + 1));
                d = dataFrame.apply(this, [datas, opt]);
            } else {
                d = dataFrame.apply(this, arguments);
            }
            return d;
        }
    }, {
        key: "_initModule",
        value: function _initModule(opt) {
            var me = this;
            //首先是创建一个坐标系对象
            this._coordinate = new Descartes_Component(this.coordinate, this);
            this.core.addChild(this._coordinate.sprite);

            this._graphs = new LineGraphs(this.graphs, this);
            this.core.addChild(this._graphs.sprite);

            this._tip = new LineTips(this.tips, this.canvax.domView, this.dataFrame);
            this._tip._markColumn.on("mouseover", function (e) {

                //新版本(canvax2.0.0)的canvax中这里的e.target 为_markColumn对象（这是对的）
                //所有需要用这个来修正下
                e.target = e.toTarget ? e.toTarget : e.target;

                me._setXaxisYaxisToTipsInfo(e);
                me._tip.show(e);
            });

            this.stageTip.addChild(this._tip.sprite);

            //initModule 里面全部都是只数据和module的设置，
            //所以_initPlugsModules里的plug还有可以修改layout的机会
        }
    }, {
        key: "_startDraw",
        value: function _startDraw(opt) {
            var me = this;

            //初始化一些在开始绘制的时候就要处理的plug，这些plug可能会影响到布局，比如legend，datazoom

            this._coordinate.draw(opt);

            this._graphs.draw({
                x: this._coordinate.graphsX,
                y: this._coordinate.graphsY,
                w: this._coordinate.graphsWidth,
                h: this._coordinate.graphsHeight,
                smooth: this.smooth,
                inited: this.inited,
                resize: opt.resize
            }).on("complete", function () {
                me.fire("complete");
            });

            //绘制完grapsh后，要把induce 给到 _tips.induce
            this._tip.setInduce(this._graphs.induce);

            var me = this;
            this.bindEvent(this.core);
            this._tip.sprite.on('nodeclick', function (e) {
                me._setXaxisYaxisToTipsInfo(e);
                me.fire("nodeclick", e.eventInfo);
            });
        }
    }, {
        key: "drawLegend",
        value: function drawLegend(_legend) {
            _legend.pos({
                x: this._coordinate.graphsX
            });
            underscore.each(this._graphs.groups, function (g) {
                _legend.setStyle(g.field, {
                    fillStyle: g.__lineStrokeStyle
                });
            });
        }

        //datazoom begin

    }, {
        key: "drawDataZoom",
        value: function drawDataZoom() {
            var me = this;

            var dataZoomOpt = underscore.deepExtend({
                w: me._coordinate.graphsWidth,

                pos: {
                    x: me._coordinate.graphsX,
                    y: me._coordinate.graphsY + me._coordinate._xAxis.height
                },
                count: me._data.length - 1 - 1,
                dragIng: function dragIng(range, pixRange, count, width) {

                    //这个计算start end 和bar不同
                    var itemW = width / count;
                    var start = null,
                        end = null;
                    for (var i = 0; i <= count; i++) {
                        if (start === null && itemW * i + itemW / 2 > pixRange.start) {
                            start = i;
                        }
                        if (end === null && itemW * i + itemW / 2 > pixRange.end) {
                            end = i;
                        }
                        if (end !== null) {
                            break;
                        }
                    }

                    if (start == me.dataZoom.range.start && end == me.dataZoom.range.end) {
                        return;
                    }

                    me.dataZoom.range.start = parseInt(start);
                    me.dataZoom.range.end = parseInt(end);

                    me.resetData(me._data, {
                        trigger: "dataZoom"
                    });

                    me.fire("dataZoomDragIng");
                }
            }, me.dataZoom);

            //这样里和bar不一样，需要减一个
            dataZoomOpt.range.end = parseInt(dataZoomOpt.range.end);
            dataZoomOpt.range.end--;

            return dataZoomOpt;
        }
    }, {
        key: "getCloneChart",
        value: function getCloneChart(lineConstructor) {
            return {
                graphs: {
                    line: {
                        lineWidth: 1,
                        strokeStyle: "#ececec"
                    },
                    node: {
                        enabled: false
                    },
                    fill: {
                        alpha: 0.5,
                        fillStyle: "#ececec"
                    },
                    animation: false,
                    eventEnabled: false,
                    text: {
                        enabled: false
                    }
                }
            };
        }

        //datazoom end


        //markpoint begin

    }, {
        key: "drawMarkPoint",
        value: function drawMarkPoint(e) {

            var me = this;
            var _t = me.markPoint.markTo;

            underscore.each(me._coordinate._yAxis, function (_yAxis, yi) {
                var fs = underscore.flatten([_yAxis.field]);
                underscore.each(fs, function (field, i) {
                    if (_t && !(underscore.isArray(_t) && underscore.indexOf(_t, field) >= 0 || _t === field || underscore.isFunction(_t))) {
                        return;
                    }

                    me.plugs.push({
                        type: "once",
                        plug: {
                            draw: function draw() {

                                var g = me._graphs._yAxisFieldsMap[field].group;
                                underscore.each(g.data, function (node, i) {

                                    var circle = g._circles.children[i];
                                    var mpCtx = {
                                        value: node.value,
                                        field: g.field,
                                        point: circle.localToGlobal(),
                                        r: circle.context.r + 2,
                                        groupLen: g.data.length,
                                        iNode: i,
                                        iGroup: g._groupInd
                                    };

                                    if (underscore.isFunction(_t) && !_t(mpCtx)) {
                                        //如果MarkTo是个表达式函数，返回为false的话
                                        return;
                                    }

                                    if (me._opts.markPoint && me._opts.markPoint.shapeType != "circle") {
                                        mpCtx.point.y -= circle.context.r + 3;
                                    }

                                    var _mp = me.creatOneMarkPoint(me._opts, mpCtx);

                                    circle.on("heartBeat", function () {
                                        _mp.rePosition(this.localToGlobal());
                                    });
                                });
                            }
                        }
                    });
                });
            });
        }
        //markpoint end

        //markline begin

    }, {
        key: "drawMarkLine",
        value: function drawMarkLine(field, yVal, _yAxis, ML) {
            var me = this;

            var yPos = 0,
                label = '';
            var label = "markline";

            if (yVal !== undefined && yVal !== null) {
                yPos = _yAxis.getYposFromVal(yVal);
                field && (label = field);
            } else {
                //没有配置y，则取均值
                if (!field) {
                    //如果没有配置y值，也没有配置所属哪个field，那么就不画
                    return;
                }

                var average = me._graphs.data[field].average;
                yVal = average.value;
                if (yVal === undefined || yVal === null) return;
                yPos = parseInt(average.position);
                label = field + '均值';
            }
            label += "：" + yVal;

            var o = {
                value: yVal
            };

            if (field) {
                o.i = me._graphs._yAxisFieldsMap[field].ind;
                o.field = field;
            }

            if (ML.text && ML.text.enabled) {
                if (underscore.isFunction(ML.text.format)) {
                    label = ML.text.format(o);
                }
            }

            function getProp(obj, p, def) {
                var val;
                if (!obj || obj && !obj[p]) {
                    return def;
                }
                if (underscore.isFunction(obj[p])) {
                    return obj[p](o);
                }
                return obj[p];
            }
            var g = field && me._graphs._yAxisFieldsMap[field].group;
            var lineStrokeStyle = getProp(ML.line, "strokeStyle", g ? g.line.strokeStyle : "#999");
            var textFillStyle = getProp(ML.text, "fillStyle", g ? g.line.strokeStyle : "#999");

            this.creatOneMarkLine(yVal, yPos, lineStrokeStyle, label, textFillStyle, field, ML, _yAxis);
        }
        //markline end

    }, {
        key: "drawAnchor",
        value: function drawAnchor(_anchor) {
            var pos = {
                x: this._coordinate._xAxis.data[this.anchor.xIndex].x,
                y: this._coordinate.graphsHeight + this._graphs.data[this._coordinate._yAxis[0].field[0]].groupData[this.anchor.xIndex].y
            };
            _anchor.aim(pos);
        }
    }, {
        key: "bindEvent",
        value: function bindEvent(spt, _setXaxisYaxisToTipsInfo) {

            var me = this;
            _setXaxisYaxisToTipsInfo || (_setXaxisYaxisToTipsInfo = me._setXaxisYaxisToTipsInfo);
            spt.on("panstart mouseover", function (e) {
                if (me._tip.enabled && e.eventInfo && e.eventInfo.nodesInfoList.length > 0) {
                    //me._tip.hide(e);
                    _setXaxisYaxisToTipsInfo.apply(me, [e]);
                    me._tip.show(e);
                }
            });
            spt.on("panmove mousemove", function (e) {
                if (me._tip.enabled && e.eventInfo) {
                    if (e.eventInfo.nodesInfoList.length > 0) {
                        _setXaxisYaxisToTipsInfo.apply(me, [e]);
                        if (me._tip._isShow) {
                            me._tip.move(e);
                        } else {
                            me._tip.show(e);
                        }
                    } else {
                        if (me._tip._isShow) {
                            me._tip.hide(e);
                        }
                    }
                }
            });
            spt.on("panend mouseout", function (e) {
                if (e.toTarget && (e.toTarget.name == '_markcolumn_node' || e.toTarget.name == '_markcolumn_line')) {
                    return;
                }
                if (me._tip.enabled) {
                    me._tip.hide(e);
                }
            });
            spt.on("tap", function (e) {
                if (me._tip.enabled && e.eventInfo && e.eventInfo.nodesInfoList.length > 0) {
                    me._tip.hide(e);
                    _setXaxisYaxisToTipsInfo.apply(me, [e]);
                    me._tip.show(e);
                }
            });
            spt.on("click", function (e) {
                _setXaxisYaxisToTipsInfo.apply(me, [e]);
                me.fire("click", e.eventInfo);
            });
        }

        //把这个点位置对应的x轴数据和y轴数据存到tips的info里面
        //方便外部自定义tip是的content

    }, {
        key: "_setXaxisYaxisToTipsInfo",
        value: function _setXaxisYaxisToTipsInfo(e) {

            if (!e.eventInfo || !this._coordinate._xAxis.dataOrg.length) {
                return;
            }

            var value;

            if (e.eventInfo.xAxis && e.eventInfo.xAxis.value) {
                value = e.eventInfo.xAxis.value;
            } else {
                value = this._coordinate._xAxis.dataOrg[0][e.eventInfo.iNode];
            }

            var me = this;
            e.eventInfo.xAxis = underscore.extend({
                field: this._coordinate._xAxis.field[0],
                value: value
            }, e.eventInfo.xAxis);

            e.eventInfo.dataZoom = me.dataZoom;

            e.eventInfo.rowData = this.dataFrame.getRowData(e.eventInfo.iNode);

            e.eventInfo.iNode += parseInt(this.dataZoom.range.start);
        }
    }, {
        key: "createMarkColumn",
        value: function createMarkColumn(xVal, opt) {
            return this._graphs.createMarkColumn(this._coordinate.getPosX({ val: xVal }), underscore.extend(opt, { xVal: xVal }));
        }
    }, {
        key: "moveMarkColumnTo",
        value: function moveMarkColumnTo(mcl, xval, opt) {
            var x = this._coordinate.getPosX({ val: xval });
            return mcl.move({
                eventInfo: this._graphs.getNodesInfoOfx(x)
            }, {
                x: x,
                xVal: xval
            });
        }
    }]);
    return Line;
}(Descartes);

var Chartx = {
    Pie: _class,
    Bar: Bar,
    Line: Line$6
};

return Chartx;

});
