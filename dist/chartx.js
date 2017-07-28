var Chartx = (function () {
'use strict';

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







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

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

var _$1 = {};
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

_$1.values = function (obj) {
  var keys = _$1.keys(obj);
  var length = keys.length;
  var values = new Array(length);
  for (var i = 0; i < length; i++) {
    values[i] = obj[keys[i]];
  }
  return values;
};

_$1.keys = nativeKeys || function (obj) {
  if (obj !== Object(obj)) throw new TypeError('Invalid object');
  var keys = [];
  for (var key in obj) {
    if (_$1.has(obj, key)) keys.push(key);
  }return keys;
};

_$1.has = function (obj, key) {
  return hasOwnProperty.call(obj, key);
};

var each = _$1.each = _$1.forEach = function (obj, iterator, context) {
  if (obj == null) return;
  if (nativeForEach && obj.forEach === nativeForEach) {
    obj.forEach(iterator, context);
  } else if (obj.length === +obj.length) {
    for (var i = 0, length = obj.length; i < length; i++) {
      if (iterator.call(context, obj[i], i, obj) === breaker) return;
    }
  } else {
    var keys = _$1.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
    }
  }
};

_$1.compact = function (array) {
  return _$1.filter(array, _$1.identity);
};

_$1.filter = _$1.select = function (obj, iterator, context) {
  var results = [];
  if (obj == null) return results;
  if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
  each(obj, function (value, index, list) {
    if (iterator.call(context, value, index, list)) results.push(value);
  });
  return results;
};

each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function (name) {
  _$1['is' + name] = function (obj) {
    return toString.call(obj) == '[object ' + name + ']';
  };
});

{
  _$1.isFunction = function (obj) {
    return typeof obj === 'function';
  };
}

_$1.isFinite = function (obj) {
  return isFinite(obj) && !isNaN(parseFloat(obj));
};

_$1.isNaN = function (obj) {
  return _$1.isNumber(obj) && obj != +obj;
};

_$1.isBoolean = function (obj) {
  return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
};

_$1.isNull = function (obj) {
  return obj === null;
};

_$1.isEmpty = function (obj) {
  if (obj == null) return true;
  if (_$1.isArray(obj) || _$1.isString(obj)) return obj.length === 0;
  for (var key in obj) {
    if (_$1.has(obj, key)) return false;
  }return true;
};

_$1.isElement = function (obj) {
  return !!(obj && obj.nodeType === 1);
};

_$1.isArray = nativeIsArray || function (obj) {
  return toString.call(obj) == '[object Array]';
};

_$1.isObject = function (obj) {
  return obj === Object(obj);
};

_$1.identity = function (value) {
  return value;
};

_$1.indexOf = function (array, item, isSorted) {
  if (array == null) return -1;
  var i = 0,
      length = array.length;
  if (isSorted) {
    if (typeof isSorted == 'number') {
      i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
    } else {
      i = _$1.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
  }
  if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
  for (; i < length; i++) {
    if (array[i] === item) return i;
  }return -1;
};

_$1.isWindow = function (obj) {
  return obj != null && obj == obj.window;
};

/**
*
*如果是深度extend，第一个参数就设置为true
*/
_$1.extend = function () {
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
  if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== "object" && !_$1.isFunction(target)) {
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

        if (deep && copy && _$1.isObject(copy) && !_$1.isArray(copy)) {
          target[name] = _$1.extend(deep, clone, copy);
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
_$1.clone = function (obj) {
  if (!_$1.isObject(obj)) return obj;
  return _$1.isArray(obj) ? obj.slice() : _$1.extend(true, {}, obj);
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
    if (_$1.isString(evt)) {
        eventType = evt;
    }
    if (_$1.isObject(evt) && evt.type) {
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

var $$1 = {
    // dom操作相关代码
    query: function query(el) {
        if (_$1.isString(el)) {
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

    _$1.extend(true, this, opt);
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

        _$1.each(me.types, function (type) {
            //不再关心浏览器环境是否 'ontouchstart' in window 
            //而是直接只管传给事件模块的是一个原生dom还是 jq对象 or hammer对象等
            if (me.target.nodeType == 1) {
                $$1.addEvent(me.target, type, function (e) {
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

        me.curPoints = [new Point($$1.pageX(e) - root.viewOffset.left, $$1.pageY(e) - root.viewOffset.top)];

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
                _$1.each(me.curPointsTarget, function (child, i) {
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
                    _$1.each(me.curPointsTarget, function (child, i) {
                        if (child && child.dragEnabled) {
                            me._dragMoveHander(e, child, i);
                        }
                    });
                }
            }

            //drag结束
            if (e.type == me.drag.end) {
                if (me._draging) {
                    _$1.each(me.curPointsTarget, function (child, i) {
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
        _$1.each(e.point, function (touch) {
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
        _$1.each(touchs, function (touch) {
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
        _$1.each(childs, function (child, i) {
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
        _dragDuplicate.worldTransform = null;
        _dragDuplicate.getWorldTransform();

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
        _$1.each(type.split(" "), function (type) {
            var map = self._eventMap[type];
            if (!map) {
                map = self._eventMap[type] = [];
                map.push(listener);
                self._eventEnabled = true;
                return true;
            }

            if (_$1.indexOf(map, listener) == -1) {
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
                    if (_$1.isEmpty(this._eventMap)) {
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
            if (_$1.isEmpty(this._eventMap)) {
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
            _$1.each(eventType.split(" "), function (eType) {
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

/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */

var TWEEN = TWEEN || function () {

	var _tweens = [];

	return {

		getAll: function getAll() {

			return _tweens;
		},

		removeAll: function removeAll() {

			_tweens = [];
		},

		add: function add(tween) {

			_tweens.push(tween);
		},

		remove: function remove(tween) {

			var i = _$1.indexOf(_tweens, tween); //_tweens.indexOf(tween);

			if (i !== -1) {
				_tweens.splice(i, 1);
			}
		},

		update: function update(time, preserve) {

			if (_tweens.length === 0) {
				return false;
			}

			var i = 0;

			time = time !== undefined ? time : TWEEN.now();

			while (i < _tweens.length) {

				/* old 
    if (_tweens[i].update(time) || preserve) {
    i++;
    } else {
    _tweens.splice(i, 1);
    }
    */

				//new code
				//in real world, tween.update has chance to remove itself, so we have to handle this situation.
				//in certain cases, onUpdateCallback will remove instances in _tweens, which make _tweens.splice(i, 1) fail
				//@litao.lt@alibaba-inc.com
				var _t = _tweens[i];
				var _updateRes = _t.update(time);

				if (!_tweens[i]) {
					break;
				}
				if (_t === _tweens[i]) {
					if (_updateRes || preserve) {
						i++;
					} else {
						_tweens.splice(i, 1);
					}
				}
			}

			return true;
		}
	};
}();

// Include a performance.now polyfill.
// In node.js, use process.hrtime.
if (typeof window === 'undefined' && typeof process !== 'undefined') {
	TWEEN.now = function () {
		var time = process.hrtime();

		// Convert [seconds, nanoseconds] to milliseconds.
		return time[0] * 1000 + time[1] / 1000000;
	};
}
// In a browser, use window.performance.now if it is available.
else if (typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined) {
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

TWEEN.Tween = function (object) {

	var _object = object;
	var _valuesStart = {};
	var _valuesEnd = {};
	var _valuesStartRepeat = {};
	var _duration = 1000;
	var _repeat = 0;
	var _repeatDelayTime;
	var _yoyo = false;
	var _isPlaying = false;
	var _reversed = false;
	var _delayTime = 0;
	var _startTime = null;
	var _easingFunction = TWEEN.Easing.Linear.None;
	var _interpolationFunction = TWEEN.Interpolation.Linear;
	var _chainedTweens = [];
	var _onStartCallback = null;
	var _onStartCallbackFired = false;
	var _onUpdateCallback = null;
	var _onCompleteCallback = null;
	var _onStopCallback = null;

	this.to = function (properties, duration) {

		_valuesEnd = properties;

		if (duration !== undefined) {
			_duration = duration;
		}

		return this;
	};

	this.start = function (time) {

		TWEEN.add(this);

		_isPlaying = true;

		_onStartCallbackFired = false;

		_startTime = time !== undefined ? time : TWEEN.now();
		_startTime += _delayTime;

		for (var property in _valuesEnd) {

			// Check if an Array was provided as property value
			if (_valuesEnd[property] instanceof Array) {

				if (_valuesEnd[property].length === 0) {
					continue;
				}

				// Create a local copy of the Array with the start value at the front
				_valuesEnd[property] = [_object[property]].concat(_valuesEnd[property]);
			}

			// If `to()` specifies a property that doesn't exist in the source object,
			// we should not set that property in the object
			if (_object[property] === undefined) {
				continue;
			}

			// Save the starting value.
			_valuesStart[property] = _object[property];

			if (_valuesStart[property] instanceof Array === false) {
				_valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
			}

			_valuesStartRepeat[property] = _valuesStart[property] || 0;
		}

		return this;
	};

	this.stop = function () {

		if (!_isPlaying) {
			return this;
		}

		TWEEN.remove(this);
		_isPlaying = false;

		if (_onStopCallback !== null) {
			_onStopCallback.call(_object, _object);
		}

		this.stopChainedTweens();
		return this;
	};

	this.end = function () {

		this.update(_startTime + _duration);
		return this;
	};

	this.stopChainedTweens = function () {

		for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
			_chainedTweens[i].stop();
		}
	};

	this.delay = function (amount) {

		_delayTime = amount;
		return this;
	};

	this.repeat = function (times) {

		_repeat = times;
		return this;
	};

	this.repeatDelay = function (amount) {

		_repeatDelayTime = amount;
		return this;
	};

	this.yoyo = function (yoyo) {

		_yoyo = yoyo;
		return this;
	};

	this.easing = function (easing) {

		_easingFunction = easing;
		return this;
	};

	this.interpolation = function (interpolation) {

		_interpolationFunction = interpolation;
		return this;
	};

	this.chain = function () {

		_chainedTweens = arguments;
		return this;
	};

	this.onStart = function (callback) {

		_onStartCallback = callback;
		return this;
	};

	this.onUpdate = function (callback) {

		_onUpdateCallback = callback;
		return this;
	};

	this.onComplete = function (callback) {

		_onCompleteCallback = callback;
		return this;
	};

	this.onStop = function (callback) {

		_onStopCallback = callback;
		return this;
	};

	this.update = function (time) {

		var property;
		var elapsed;
		var value;

		if (time < _startTime) {
			return true;
		}

		if (_onStartCallbackFired === false) {

			if (_onStartCallback !== null) {
				_onStartCallback.call(_object, _object);
			}

			_onStartCallbackFired = true;
		}

		elapsed = (time - _startTime) / _duration;
		elapsed = elapsed > 1 ? 1 : elapsed;

		value = _easingFunction(elapsed);

		for (property in _valuesEnd) {

			// Don't update properties that do not exist in the source object
			if (_valuesStart[property] === undefined) {
				continue;
			}

			var start = _valuesStart[property] || 0;
			var end = _valuesEnd[property];

			if (end instanceof Array) {

				_object[property] = _interpolationFunction(end, value);
			} else {

				// Parses relative end values with start as base (e.g.: +10, -3)
				if (typeof end === 'string') {

					if (end.charAt(0) === '+' || end.charAt(0) === '-') {
						end = start + parseFloat(end);
					} else {
						end = parseFloat(end);
					}
				}

				// Protect against non numeric properties.
				if (typeof end === 'number') {
					_object[property] = start + (end - start) * value;
				}
			}
		}

		if (_onUpdateCallback !== null) {
			_onUpdateCallback.call(_object, value);
		}

		if (elapsed === 1) {

			if (_repeat > 0) {

				if (isFinite(_repeat)) {
					_repeat--;
				}

				// Reassign starting values, restart by making startTime = now
				for (property in _valuesStartRepeat) {

					if (typeof _valuesEnd[property] === 'string') {
						_valuesStartRepeat[property] = _valuesStartRepeat[property] + parseFloat(_valuesEnd[property]);
					}

					if (_yoyo) {
						var tmp = _valuesStartRepeat[property];

						_valuesStartRepeat[property] = _valuesEnd[property];
						_valuesEnd[property] = tmp;
					}

					_valuesStart[property] = _valuesStartRepeat[property];
				}

				if (_yoyo) {
					_reversed = !_reversed;
				}

				if (_repeatDelayTime !== undefined) {
					_startTime = time + _repeatDelayTime;
				} else {
					_startTime = time + _delayTime;
				}

				return true;
			} else {

				if (_onCompleteCallback !== null) {

					_onCompleteCallback.call(_object, _object);
				}

				for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
					// Make the chained tweens start exactly at the time they should,
					// even if the `update()` method was called way past the duration of the tween
					_chainedTweens[i].start(_startTime + _duration);
				}

				return false;
			}
		}

		return true;
	};
};

TWEEN.Easing = {

	Linear: {

		None: function None(k) {

			return k;
		}

	},

	Quadratic: {

		In: function In(k) {

			return k * k;
		},

		Out: function Out(k) {

			return k * (2 - k);
		},

		InOut: function InOut(k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k;
			}

			return -0.5 * (--k * (k - 2) - 1);
		}

	},

	Cubic: {

		In: function In(k) {

			return k * k * k;
		},

		Out: function Out(k) {

			return --k * k * k + 1;
		},

		InOut: function InOut(k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k;
			}

			return 0.5 * ((k -= 2) * k * k + 2);
		}

	},

	Quartic: {

		In: function In(k) {

			return k * k * k * k;
		},

		Out: function Out(k) {

			return 1 - --k * k * k * k;
		},

		InOut: function InOut(k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k;
			}

			return -0.5 * ((k -= 2) * k * k * k - 2);
		}

	},

	Quintic: {

		In: function In(k) {

			return k * k * k * k * k;
		},

		Out: function Out(k) {

			return --k * k * k * k * k + 1;
		},

		InOut: function InOut(k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k * k;
			}

			return 0.5 * ((k -= 2) * k * k * k * k + 2);
		}

	},

	Sinusoidal: {

		In: function In(k) {

			return 1 - Math.cos(k * Math.PI / 2);
		},

		Out: function Out(k) {

			return Math.sin(k * Math.PI / 2);
		},

		InOut: function InOut(k) {

			return 0.5 * (1 - Math.cos(Math.PI * k));
		}

	},

	Exponential: {

		In: function In(k) {

			return k === 0 ? 0 : Math.pow(1024, k - 1);
		},

		Out: function Out(k) {

			return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
		},

		InOut: function InOut(k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			if ((k *= 2) < 1) {
				return 0.5 * Math.pow(1024, k - 1);
			}

			return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
		}

	},

	Circular: {

		In: function In(k) {

			return 1 - Math.sqrt(1 - k * k);
		},

		Out: function Out(k) {

			return Math.sqrt(1 - --k * k);
		},

		InOut: function InOut(k) {

			if ((k *= 2) < 1) {
				return -0.5 * (Math.sqrt(1 - k * k) - 1);
			}

			return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
		}

	},

	Elastic: {

		In: function In(k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
		},

		Out: function Out(k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;
		},

		InOut: function InOut(k) {

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

		In: function In(k) {

			var s = 1.70158;

			return k * k * ((s + 1) * k - s);
		},

		Out: function Out(k) {

			var s = 1.70158;

			return --k * k * ((s + 1) * k + s) + 1;
		},

		InOut: function InOut(k) {

			var s = 1.70158 * 1.525;

			if ((k *= 2) < 1) {
				return 0.5 * (k * k * ((s + 1) * k - s));
			}

			return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
		}

	},

	Bounce: {

		In: function In(k) {

			return 1 - TWEEN.Easing.Bounce.Out(1 - k);
		},

		Out: function Out(k) {

			if (k < 1 / 2.75) {
				return 7.5625 * k * k;
			} else if (k < 2 / 2.75) {
				return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
			} else if (k < 2.5 / 2.75) {
				return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
			} else {
				return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
			}
		},

		InOut: function InOut(k) {

			if (k < 0.5) {
				return TWEEN.Easing.Bounce.In(k * 2) * 0.5;
			}

			return TWEEN.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
		}

	}

};

TWEEN.Interpolation = {

	Linear: function Linear(v, k) {

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

	Bezier: function Bezier(v, k) {

		var b = 0;
		var n = v.length - 1;
		var pw = Math.pow;
		var bn = TWEEN.Interpolation.Utils.Bernstein;

		for (var i = 0; i <= n; i++) {
			b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
		}

		return b;
	},

	CatmullRom: function CatmullRom(v, k) {

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

		Linear: function Linear(p0, p1, t) {

			return (p1 - p0) * t + p0;
		},

		Bernstein: function Bernstein(n, i) {

			var fc = TWEEN.Interpolation.Utils.Factorial;

			return fc(n) / fc(i) / fc(n - i);
		},

		Factorial: function () {

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
		}(),

		CatmullRom: function CatmullRom(p0, p1, p2, p3, t) {

			var v0 = (p2 - p0) * 0.5;
			var v1 = (p3 - p1) * 0.5;
			var t2 = t * t;
			var t3 = t * t2;

			return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
		}

	}

};

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
            TWEEN.update(); //tween自己会做length判断
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
    var opt = _$1.extend({
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

            tween = new TWEEN.Tween(opt.from).to(opt.to, opt.duration).onStart(function () {
                opt.onStart.apply(this);
            }).onUpdate(function () {
                opt.onUpdate.apply(this);
            }).onComplete(function () {
                destroyFrame({
                    id: tid
                });
                tween._isCompleteed = true;
                opt.onComplete.apply(this, [this]); //执行用户的conComplete
            }).onStop(function () {
                destroyFrame({
                    id: tid
                });
                tween._isStoped = true;
                opt.onStop.apply(this, [this]);
            }).repeat(opt.repeat).delay(opt.delay).easing(TWEEN.Easing[opt.easing.split(".")[0]][opt.easing.split(".")[1]]);

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
 * 属性工厂，ie下面用VBS提供支持
 * 来给整个引擎提供心跳包的触发机制
 */

function Observe(scope) {

    //scope.$model = scope;
    //return scope;

    var stopRepeatAssign = true;

    var pmodel = {},
        //要返回的对象
    accessores = {},
        //内部用于转换的对象
    _VBPublics = ["$skipArray", "$watch", "$model"],
        //公共属性，不需要get set 化的
    model = {}; //这是pmodel上的$model属性

    var VBPublics = _VBPublics.concat(scope.$skipArray || []);

    function loop(name, val) {
        if (_$1.indexOf(_VBPublics, name) === -1) {
            //非_VBPublics中的值，都要先设置好对应的val到model上
            model[name] = val;
        }

        var valueType = typeof val === "undefined" ? "undefined" : _typeof(val);

        if (_$1.indexOf(VBPublics, name) > -1) {
            return;
        }

        if (valueType === "function") {
            VBPublics.push(name); //函数无需要转换，也可以做为公共属性存在
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

    pmodel = defineProperties(pmodel, accessores, VBPublics); //生成一个空的ViewModel

    _$1.forEach(VBPublics, function (name) {
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
//IE6-8使用VBScript类的set get语句实现
if (!defineProperties && window.VBArray) {
    (function () {
        var VBMediator = function VBMediator(description, name, value) {
            var fn = description[name] && description[name].set;
            if (arguments.length === 3) {
                fn(value);
            } else {
                return fn();
            }
        };

        window.execScript(["Function parseVB(code)", "\tExecuteGlobal(code)", "End Function"].join("\n"), "VBScript");

        
        defineProperties = function defineProperties(publics, description, array) {
            publics = array.slice(0);
            publics.push("hasOwnProperty");
            var className = "VBClass" + setTimeout("1"),
                owner = {},
                buffer = [];
            buffer.push("Class " + className, "\tPrivate [__data__], [__proxy__]", "\tPublic Default Function [__const__](d, p)", "\t\tSet [__data__] = d: set [__proxy__] = p", "\t\tSet [__const__] = Me", //链式调用
            "\tEnd Function");
            _$1.forEach(publics, function (name) {
                //添加公共属性,如果此时不加以后就没机会了
                if (owner[name] !== true) {
                    owner[name] = true; //因为VBScript对象不能像JS那样随意增删属性
                    buffer.push("\tPublic [" + name + "]"); //你可以预先放到  skipArray 中
                }
            });
            for (var name in description) {
                owner[name] = true;
                buffer.push(
                //由于不知对方会传入什么,因此set, let都用上
                "\tPublic Property Let [" + name + "](val)", //setter
                "\t\tCall [__proxy__]([__data__], \"" + name + "\", val)", "\tEnd Property", "\tPublic Property Set [" + name + "](val)", //setter
                "\t\tCall [__proxy__]([__data__], \"" + name + "\", val)", "\tEnd Property", "\tPublic Property Get [" + name + "]", //getter
                "\tOn Error Resume Next", //必须优先使用set语句,否则它会误将数组当字符串返回
                "\t\tSet[" + name + "] = [__proxy__]([__data__],\"" + name + "\")", "\tIf Err.Number <> 0 Then", "\t\t[" + name + "] = [__proxy__]([__data__],\"" + name + "\")", "\tEnd If", "\tOn Error Goto 0", "\tEnd Property");
            }
            buffer.push("End Class"); //类定义完毕
            buffer.push("Function " + className + "Factory(a, b)", //创建实例并传入两个关键的参数
            "\tDim o", "\tSet o = (New " + className + ")(a, b)", "\tSet " + className + "Factory = o", "End Function");
            window.parseVB(buffer.join("\r\n")); //先创建一个VB类工厂
            return window[className + "Factory"](description, VBMediator); //得到其产品
        };
    })();
}

var RENDERER_TYPE = {
    UNKNOWN: 0,
    WEBGL: 1,
    CANVAS: 2
};

var DRAW_MODES = {
    POINTS: 0,
    LINES: 1,
    LINE_LOOP: 2,
    LINE_STRIP: 3,
    TRIANGLES: 4,
    TRIANGLE_STRIP: 5,
    TRIANGLE_FAN: 6
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
        _this.worldTransform = null; //webgl 渲染器中专用

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

            _$1.extend(true, _contextATTRS, opt.context);

            //有些引擎内部设置context属性的时候是不用上报心跳的，比如做热点检测的时候
            self._notWatch = false;

            //不需要发心跳信息
            self._noHeart = false;

            //_contextATTRS.$owner = self;
            _contextATTRS.$watch = function (name, value, preValue) {
                //下面的这些属性变化，都会需要重新组织矩阵属性 _transform 
                var obj = self; //this.$owner;

                if (_$1.indexOf(TRANSFORM_PROPS, name) > -1) {
                    obj._updateTransform();

                    //stage本身就是世界坐标，所以其worldTransform不需要动态修改
                    if (obj.parent && obj.type != "stage" && obj.parent.worldTransform) {
                        obj.worldTransform = null;
                        //只有parent有worldTransform，就可以算出自己对应的世界坐标
                        obj.getWorldTransform();
                        if (obj.children) {
                            //如果自己还有子元素，那么子元素的世界坐标也都要对应的调整
                            obj.updateChildWorldTransform();
                        }
                    }
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
                context: _$1.clone(this.context.$model),
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
            if (_$1.isBoolean(bool)) {
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
            return _$1.indexOf(this.parent.children, this);
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

            if (_$1.isNumber(num)) {
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

            if (_$1.isNumber(num)) {
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
        key: "getWorldTransform",
        value: function getWorldTransform() {
            var cm;
            if (!this.worldTransform) {
                cm = new Matrix();
                cm.concat(this._transform);
                cm.concat(this.parent.worldTransform);
                this.worldTransform = cm;
            }
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
        value: function animate(toContent, options) {
            var to = toContent;
            var from = {};
            for (var p in to) {
                if (isNaN(to[p]) && to[p] !== '' && to[p] !== null && to[p] !== undefined) {
                    continue;
                }
                from[p] = this.context[p];
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
            options.onUpdate = function () {
                //如果context不存在说明该obj已经被destroy了，那么要把他的tween给destroy
                if (!self.context && tween) {
                    AnimationFrame.destroyTween(tween);
                    tween = null;
                    return;
                }
                for (var p in this) {
                    self.context[p] = this[p];
                }
                upFun.apply(self, [this]);
            };
            var compFun = function compFun() {};
            if (options.onComplete) {
                compFun = options.onComplete;
            }
            options.onComplete = function (opt) {
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

            if (this.worldTransform) {
                //如果过自己已经有了世界坐标了，那么要把新添加进来的所有节点包括其子节点都设置好世界坐标
                this.updateChildWorldTransform();
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
            return this.removeChildAt(_$1.indexOf(this.children, child));
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
            return _$1.indexOf(this.children, child);
        }
    }, {
        key: "setChildIndex",
        value: function setChildIndex(child, index) {
            if (child.parent != this) return;
            var oldIndex = _$1.indexOf(this.children, child);
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

        //更新所有子节点的世界坐标

    }, {
        key: "updateChildWorldTransform",
        value: function updateChildWorldTransform() {
            _$1.each(this.children, function (obj) {
                obj.getWorldTransform();
                if (obj.children) {
                    obj.updateChildWorldTransform();
                }
            });
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

                var _begin = new Date().getTime();
                self.render(this.app);
                var _end = new Date().getTime();

                $(document.body).append("<br />render：" + (_end - _begin));

                self._heartBeat = false;
                //渲染完了，打上最新时间挫
                self._preRenderTime = new Date().getTime();
            }
        }
    }, {
        key: '_convertCanvax',
        value: function _convertCanvax(opt) {
            var me = this;
            _$1.each(me.app.children, function (stage) {
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
                _$1.each(self.app.children, function (stage, i) {
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
        value: function render(displayObject, stage) {
            var renderer = this.renderer;
            var graphicsData = displayObject.graphics.graphicsData;
            var ctx = stage.ctx;
            var $MC = displayObject.context.$model;
            var $PMC = displayObject.parent.context.$model;

            if (displayObject.parent) {
                $MC.globalAlpha *= $PMC.globalAlpha;
            }

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
                        ctx.globalAlpha = data.fillAlpha;
                        ctx.fillStyle = fillStyle;
                        ctx.fill();
                    }
                    if (line) {
                        ctx.globalAlpha = data.lineAlpha;
                        ctx.strokeStyle = strokeStyle;
                        ctx.stroke();
                    }
                } else if (data.type === SHAPES.RECT) {
                    if (fill) {
                        ctx.globalAlpha = data.fillAlpha;
                        ctx.fillStyle = fillStyle;
                        ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
                    }
                    if (line) {
                        ctx.globalAlpha = data.lineAlpha;
                        ctx.strokeStyle = strokeStyle;
                        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
                    }
                } else if (data.type === SHAPES.CIRC) {

                    // TODO - 这里应该可以不需要走graphics，而直接设置好radius
                    ctx.beginPath();
                    ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
                    ctx.closePath();

                    if (fill) {
                        ctx.globalAlpha = data.fillAlpha;
                        ctx.fillStyle = fillStyle;
                        ctx.fill();
                    }
                    if (line) {
                        ctx.globalAlpha = data.lineAlpha;
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
                        ctx.globalAlpha = data.fillAlpha;
                        ctx.fillStyle = fillStyle;
                        ctx.fill();
                    }
                    if (line) {
                        ctx.globalAlpha = data.lineAlpha;
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
            _$1.each(_$1.values(app.convertStages), function (convertStage) {
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
            this._clear(stage);
            this._render(stage);
            stage.stageRending = false;
        }
    }, {
        key: '_render',
        value: function _render(stage, displayObject) {
            if (!displayObject) {
                displayObject = stage;
            }

            //因为已经采用了setTransform了， 非shape元素已经不需要执行transform 和 render
            if (displayObject.graphics) {
                if (!displayObject.context.$model.visible || displayObject.context.$model.globalAlpha <= 0) {
                    return;
                }

                var ctx = stage.ctx;

                ctx.setTransform.apply(ctx, displayObject.worldTransform.toArray());

                //如果 graphicsData.length==0 的情况下才需要执行_draw来组织graphics数据
                if (!displayObject.graphics.graphicsData.length) {
                    //当渲染器开始渲染app的时候，app下面的所有displayObject都已经准备好了对应的世界矩阵
                    displayObject._draw(displayObject.graphics); //_draw会完成绘制准备好 graphicsData
                }

                this.CGR.render(displayObject, stage, this);
            }

            if (displayObject.type == "text") {
                //如果是文本
                var ctx = stage.ctx;
                ctx.setTransform.apply(ctx, displayObject.worldTransform.toArray());
                displayObject.render(ctx);
            }

            if (displayObject.children) {
                for (var i = 0, len = displayObject.children.length; i < len; i++) {
                    this._render(stage, displayObject.children[i]);
                }
            }
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

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/**
 * Helper class to create a webGL Context
 *
 * @class
 * @memberof PIXI.glCore
 * @param canvas {HTMLCanvasElement} the canvas element that we will get the context from
 * @param options {Object} An options object that gets passed in to the canvas element containing the context attributes,
 *                         see https://developer.mozilla.org/en/docs/Web/API/HTMLCanvasElement/getContext for the options available
 * @return {WebGLRenderingContext} the WebGL context
 */
var createContext = function(canvas, options)
{
    var gl = canvas.getContext('webgl', options) || 
         canvas.getContext('experimental-webgl', options);

    if (!gl)
    {
        // fail, not able to get a context
        throw new Error('This browser does not support webGL. Try using the canvas renderer');
    }

    return gl;
};

var createContext_1 = createContext;

// var GL_MAP = {};

/**
 * @param gl {WebGLRenderingContext} The current WebGL context
 * @param attribs {*}
 * @param state {*}
 */
var setVertexAttribArrays = function (gl, attribs, state)
{
    var i;
    if(state)
    {
        var tempAttribState = state.tempAttribState,
            attribState = state.attribState;

        for (i = 0; i < tempAttribState.length; i++)
        {
            tempAttribState[i] = false;
        }

        // set the new attribs
        for (i = 0; i < attribs.length; i++)
        {
            tempAttribState[attribs[i].attribute.location] = true;
        }

        for (i = 0; i < attribState.length; i++)
        {
            if (attribState[i] !== tempAttribState[i])
            {
                attribState[i] = tempAttribState[i];

                if (state.attribState[i])
                {
                    gl.enableVertexAttribArray(i);
                }
                else
                {
                    gl.disableVertexAttribArray(i);
                }
            }
        }

    }
    else
    {
        for (i = 0; i < attribs.length; i++)
        {
            var attrib = attribs[i];
            gl.enableVertexAttribArray(attrib.attribute.location);
        }
    }
};

var setVertexAttribArrays_1 = setVertexAttribArrays;

var EMPTY_ARRAY_BUFFER = new ArrayBuffer(0);

/**
 * Helper class to create a webGL buffer
 *
 * @class
 * @memberof PIXI.glCore
 * @param gl {WebGLRenderingContext} The current WebGL rendering context
 * @param type {gl.ARRAY_BUFFER | gl.ELEMENT_ARRAY_BUFFER} @mat
 * @param data {ArrayBuffer| SharedArrayBuffer|ArrayBufferView} an array of data
 * @param drawType {gl.STATIC_DRAW|gl.DYNAMIC_DRAW|gl.STREAM_DRAW}
 */
var Buffer = function(gl, type, data, drawType)
{

	/**
     * The current WebGL rendering context
     *
     * @member {WebGLRenderingContext}
     */
	this.gl = gl;

	/**
     * The WebGL buffer, created upon instantiation
     *
     * @member {WebGLBuffer}
     */
	this.buffer = gl.createBuffer();

	/**
     * The type of the buffer
     *
     * @member {gl.ARRAY_BUFFER|gl.ELEMENT_ARRAY_BUFFER}
     */
	this.type = type || gl.ARRAY_BUFFER;

	/**
     * The draw type of the buffer
     *
     * @member {gl.STATIC_DRAW|gl.DYNAMIC_DRAW|gl.STREAM_DRAW}
     */
	this.drawType = drawType || gl.STATIC_DRAW;

	/**
     * The data in the buffer, as a typed array
     *
     * @member {ArrayBuffer| SharedArrayBuffer|ArrayBufferView}
     */
	this.data = EMPTY_ARRAY_BUFFER;

	if(data)
	{
		this.upload(data);
	}

	this._updateID = 0;
};

/**
 * Uploads the buffer to the GPU
 * @param data {ArrayBuffer| SharedArrayBuffer|ArrayBufferView} an array of data to upload
 * @param offset {Number} if only a subset of the data should be uploaded, this is the amount of data to subtract
 * @param dontBind {Boolean} whether to bind the buffer before uploading it
 */
Buffer.prototype.upload = function(data, offset, dontBind)
{
	// todo - needed?
	if(!dontBind) this.bind();

	var gl = this.gl;

	data = data || this.data;
	offset = offset || 0;

	if(this.data.byteLength >= data.byteLength)
	{
		gl.bufferSubData(this.type, offset, data);
	}
	else
	{
		gl.bufferData(this.type, data, this.drawType);
	}

	this.data = data;
};
/**
 * Binds the buffer
 *
 */
Buffer.prototype.bind = function()
{
	var gl = this.gl;
	gl.bindBuffer(this.type, this.buffer);
};

Buffer.createVertexBuffer = function(gl, data, drawType)
{
	return new Buffer(gl, gl.ARRAY_BUFFER, data, drawType);
};

Buffer.createIndexBuffer = function(gl, data, drawType)
{
	return new Buffer(gl, gl.ELEMENT_ARRAY_BUFFER, data, drawType);
};

Buffer.create = function(gl, type, data, drawType)
{
	return new Buffer(gl, type, data, drawType);
};

/**
 * Destroys the buffer
 *
 */
Buffer.prototype.destroy = function(){
	this.gl.deleteBuffer(this.buffer);
};

var GLBuffer = Buffer;

/**
 * Helper class to create a WebGL Texture
 *
 * @class
 * @memberof PIXI.glCore
 * @param gl {WebGLRenderingContext} The current WebGL context
 * @param width {number} the width of the texture
 * @param height {number} the height of the texture
 * @param format {number} the pixel format of the texture. defaults to gl.RGBA
 * @param type {number} the gl type of the texture. defaults to gl.UNSIGNED_BYTE
 */
var Texture = function(gl, width, height, format, type)
{
	/**
	 * The current WebGL rendering context
	 *
	 * @member {WebGLRenderingContext}
	 */
	this.gl = gl;


	/**
	 * The WebGL texture
	 *
	 * @member {WebGLTexture}
	 */
	this.texture = gl.createTexture();

	/**
	 * If mipmapping was used for this texture, enable and disable with enableMipmap()
	 *
	 * @member {Boolean}
	 */
	// some settings..
	this.mipmap = false;


	/**
	 * Set to true to enable pre-multiplied alpha
	 *
	 * @member {Boolean}
	 */
	this.premultiplyAlpha = false;

	/**
	 * The width of texture
	 *
	 * @member {Number}
	 */
	this.width = width || -1;
	/**
	 * The height of texture
	 *
	 * @member {Number}
	 */
	this.height = height || -1;

	/**
	 * The pixel format of the texture. defaults to gl.RGBA
	 *
	 * @member {Number}
	 */
	this.format = format || gl.RGBA;

	/**
	 * The gl type of the texture. defaults to gl.UNSIGNED_BYTE
	 *
	 * @member {Number}
	 */
	this.type = type || gl.UNSIGNED_BYTE;


};

/**
 * Uploads this texture to the GPU
 * @param source {HTMLImageElement|ImageData|HTMLVideoElement} the source image of the texture
 */
Texture.prototype.upload = function(source)
{
	this.bind();

	var gl = this.gl;


	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha);

	var newWidth = source.videoWidth || source.width;
	var newHeight = source.videoHeight || source.height;

	if(newHeight !== this.height || newWidth !== this.width)
	{
		gl.texImage2D(gl.TEXTURE_2D, 0, this.format, this.format, this.type, source);
	}
	else
	{
    	gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, this.format, this.type, source);
	}

	// if the source is a video, we need to use the videoWidth / videoHeight properties as width / height will be incorrect.
	this.width = newWidth;
	this.height = newHeight;

};

var FLOATING_POINT_AVAILABLE = false;

/**
 * Use a data source and uploads this texture to the GPU
 * @param data {TypedArray} the data to upload to the texture
 * @param width {number} the new width of the texture
 * @param height {number} the new height of the texture
 */
Texture.prototype.uploadData = function(data, width, height)
{
	this.bind();

	var gl = this.gl;


	if(data instanceof Float32Array)
	{
		if(!FLOATING_POINT_AVAILABLE)
		{
			var ext = gl.getExtension("OES_texture_float");

			if(ext)
			{
				FLOATING_POINT_AVAILABLE = true;
			}
			else
			{
				throw new Error('floating point textures not available');
			}
		}

		this.type = gl.FLOAT;
	}
	else
	{
		// TODO support for other types
		this.type = this.type || gl.UNSIGNED_BYTE;
	}

	// what type of data?
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha);


	if(width !== this.width || height !== this.height)
	{
		gl.texImage2D(gl.TEXTURE_2D, 0, this.format,  width, height, 0, this.format, this.type, data || null);
	}
	else
	{
		gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, width, height, this.format, this.type, data || null);
	}

	this.width = width;
	this.height = height;


//	texSubImage2D
};

/**
 * Binds the texture
 * @param  location
 */
Texture.prototype.bind = function(location)
{
	var gl = this.gl;

	if(location !== undefined)
	{
		gl.activeTexture(gl.TEXTURE0 + location);
	}

	gl.bindTexture(gl.TEXTURE_2D, this.texture);
};

/**
 * Unbinds the texture
 */
Texture.prototype.unbind = function()
{
	var gl = this.gl;
	gl.bindTexture(gl.TEXTURE_2D, null);
};

/**
 * @param linear {Boolean} if we want to use linear filtering or nearest neighbour interpolation
 */
Texture.prototype.minFilter = function( linear )
{
	var gl = this.gl;

	this.bind();

	if(this.mipmap)
	{
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, linear ? gl.LINEAR_MIPMAP_LINEAR : gl.NEAREST_MIPMAP_NEAREST);
	}
	else
	{
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, linear ? gl.LINEAR : gl.NEAREST);
	}
};

/**
 * @param linear {Boolean} if we want to use linear filtering or nearest neighbour interpolation
 */
Texture.prototype.magFilter = function( linear )
{
	var gl = this.gl;

	this.bind();

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, linear ? gl.LINEAR : gl.NEAREST);
};

/**
 * Enables mipmapping
 */
Texture.prototype.enableMipmap = function()
{
	var gl = this.gl;

	this.bind();

	this.mipmap = true;

	gl.generateMipmap(gl.TEXTURE_2D);
};

/**
 * Enables linear filtering
 */
Texture.prototype.enableLinearScaling = function()
{
	this.minFilter(true);
	this.magFilter(true);
};

/**
 * Enables nearest neighbour interpolation
 */
Texture.prototype.enableNearestScaling = function()
{
	this.minFilter(false);
	this.magFilter(false);
};

/**
 * Enables clamping on the texture so WebGL will not repeat it
 */
Texture.prototype.enableWrapClamp = function()
{
	var gl = this.gl;

	this.bind();

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
};

/**
 * Enable tiling on the texture
 */
Texture.prototype.enableWrapRepeat = function()
{
	var gl = this.gl;

	this.bind();

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
};

Texture.prototype.enableWrapMirrorRepeat = function()
{
	var gl = this.gl;

	this.bind();

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
};


/**
 * Destroys this texture
 */
Texture.prototype.destroy = function()
{
	var gl = this.gl;
	//TODO
	gl.deleteTexture(this.texture);
};

/**
 * @static
 * @param gl {WebGLRenderingContext} The current WebGL context
 * @param source {HTMLImageElement|ImageData} the source image of the texture
 * @param premultiplyAlpha {Boolean} If we want to use pre-multiplied alpha
 */
Texture.fromSource = function(gl, source, premultiplyAlpha)
{
	var texture = new Texture(gl);
	texture.premultiplyAlpha = premultiplyAlpha || false;
	texture.upload(source);

	return texture;
};

/**
 * @static
 * @param gl {WebGLRenderingContext} The current WebGL context
 * @param data {TypedArray} the data to upload to the texture
 * @param width {number} the new width of the texture
 * @param height {number} the new height of the texture
 */
Texture.fromData = function(gl, data, width, height)
{
	//console.log(data, width, height);
	var texture = new Texture(gl);
	texture.uploadData(data, width, height);

	return texture;
};


var GLTexture = Texture;

/**
 * Helper class to create a webGL Framebuffer
 *
 * @class
 * @memberof PIXI.glCore
 * @param gl {WebGLRenderingContext} The current WebGL rendering context
 * @param width {Number} the width of the drawing area of the frame buffer
 * @param height {Number} the height of the drawing area of the frame buffer
 */
var Framebuffer = function(gl, width, height)
{
    /**
     * The current WebGL rendering context
     *
     * @member {WebGLRenderingContext}
     */
    this.gl = gl;

    /**
     * The frame buffer
     *
     * @member {WebGLFramebuffer}
     */
    this.framebuffer = gl.createFramebuffer();

    /**
     * The stencil buffer
     *
     * @member {WebGLRenderbuffer}
     */
    this.stencil = null;

    /**
     * The stencil buffer
     *
     * @member {PIXI.glCore.GLTexture}
     */
    this.texture = null;

    /**
     * The width of the drawing area of the buffer
     *
     * @member {Number}
     */
    this.width = width || 100;
    /**
     * The height of the drawing area of the buffer
     *
     * @member {Number}
     */
    this.height = height || 100;
};

/**
 * Adds a texture to the frame buffer
 * @param texture {PIXI.glCore.GLTexture}
 */
Framebuffer.prototype.enableTexture = function(texture)
{
    var gl = this.gl;

    this.texture = texture || new GLTexture(gl);

    this.texture.bind();

    //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,  this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    this.bind();

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture.texture, 0);
};

/**
 * Initialises the stencil buffer
 */
Framebuffer.prototype.enableStencil = function()
{
    if(this.stencil)return;

    var gl = this.gl;

    this.stencil = gl.createRenderbuffer();

    gl.bindRenderbuffer(gl.RENDERBUFFER, this.stencil);

    // TODO.. this is depth AND stencil?
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.stencil);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL,  this.width  , this.height );


};

/**
 * Erases the drawing area and fills it with a colour
 * @param  r {Number} the red value of the clearing colour
 * @param  g {Number} the green value of the clearing colour
 * @param  b {Number} the blue value of the clearing colour
 * @param  a {Number} the alpha value of the clearing colour
 */
Framebuffer.prototype.clear = function( r, g, b, a )
{
    this.bind();

    var gl = this.gl;

    gl.clearColor(r, g, b, a);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

/**
 * Binds the frame buffer to the WebGL context
 */
Framebuffer.prototype.bind = function()
{
    var gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer );
};

/**
 * Unbinds the frame buffer to the WebGL context
 */
Framebuffer.prototype.unbind = function()
{
    var gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null );
};
/**
 * Resizes the drawing area of the buffer to the given width and height
 * @param  width  {Number} the new width
 * @param  height {Number} the new height
 */
Framebuffer.prototype.resize = function(width, height)
{
    var gl = this.gl;

    this.width = width;
    this.height = height;

    if ( this.texture )
    {
        this.texture.uploadData(null, width, height);
    }

    if ( this.stencil )
    {
        // update the stencil buffer width and height
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.stencil);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, width, height);
    }
};

/**
 * Destroys this buffer
 */
Framebuffer.prototype.destroy = function()
{
    var gl = this.gl;

    //TODO
    if(this.texture)
    {
        this.texture.destroy();
    }

    gl.deleteFramebuffer(this.framebuffer);

    this.gl = null;

    this.stencil = null;
    this.texture = null;
};

/**
 * Creates a frame buffer with a texture containing the given data
 * @static
 * @param gl {WebGLRenderingContext} The current WebGL rendering context
 * @param width {Number} the width of the drawing area of the frame buffer
 * @param height {Number} the height of the drawing area of the frame buffer
 * @param data {ArrayBuffer| SharedArrayBuffer|ArrayBufferView} an array of data
 */
Framebuffer.createRGBA = function(gl, width, height, data)
{
    var texture = GLTexture.fromData(gl, null, width, height);
    texture.enableNearestScaling();
    texture.enableWrapClamp();

    //now create the framebuffer object and attach the texture to it.
    var fbo = new Framebuffer(gl, width, height);
    fbo.enableTexture(texture);

    //fbo.enableStencil(); // get this back on soon!

    fbo.unbind();

    return fbo;
};

/**
 * Creates a frame buffer with a texture containing the given data
 * @static
 * @param gl {WebGLRenderingContext} The current WebGL rendering context
 * @param width {Number} the width of the drawing area of the frame buffer
 * @param height {Number} the height of the drawing area of the frame buffer
 * @param data {ArrayBuffer| SharedArrayBuffer|ArrayBufferView} an array of data
 */
Framebuffer.createFloat32 = function(gl, width, height, data)
{
    // create a new texture..
    var texture = new GLTexture.fromData(gl, data, width, height);
    texture.enableNearestScaling();
    texture.enableWrapClamp();

    //now create the framebuffer object and attach the texture to it.
    var fbo = new Framebuffer(gl, width, height);
    fbo.enableTexture(texture);

    fbo.unbind();

    return fbo;
};

var GLFramebuffer$1 = Framebuffer;

/**
 * @class
 * @memberof PIXI.glCore.shader
 * @param gl {WebGLRenderingContext} The current WebGL context {WebGLProgram}
 * @param vertexSrc {string|string[]} The vertex shader source as an array of strings.
 * @param fragmentSrc {string|string[]} The fragment shader source as an array of strings.
 * @param attributeLocations {Object} An attribute location map that lets you manually set the attribute locations
 * @return {WebGLProgram} the shader program
 */
var compileProgram = function(gl, vertexSrc, fragmentSrc, attributeLocations)
{
    var glVertShader = compileShader(gl, gl.VERTEX_SHADER, vertexSrc);
    var glFragShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);

    var program = gl.createProgram();

    gl.attachShader(program, glVertShader);
    gl.attachShader(program, glFragShader);

    // optionally, set the attributes manually for the program rather than letting WebGL decide..
    if(attributeLocations)
    {
        for(var i in attributeLocations)
        {
            gl.bindAttribLocation(program, attributeLocations[i], i);
        }
    }


    gl.linkProgram(program);

    // if linking fails, then log and cleanup
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    {
        console.error('Pixi.js Error: Could not initialize shader.');
        console.error('gl.VALIDATE_STATUS', gl.getProgramParameter(program, gl.VALIDATE_STATUS));
        console.error('gl.getError()', gl.getError());

        // if there is a program info log, log it
        if (gl.getProgramInfoLog(program) !== '')
        {
            console.warn('Pixi.js Warning: gl.getProgramInfoLog()', gl.getProgramInfoLog(program));
        }

        gl.deleteProgram(program);
        program = null;
    }

    // clean up some shaders
    gl.deleteShader(glVertShader);
    gl.deleteShader(glFragShader);

    return program;
};

/**
 * @private
 * @param gl {WebGLRenderingContext} The current WebGL context {WebGLProgram}
 * @param type {Number} the type, can be either VERTEX_SHADER or FRAGMENT_SHADER
 * @param vertexSrc {string|string[]} The vertex shader source as an array of strings.
 * @return {WebGLShader} the shader
 */
var compileShader = function (gl, type, src)
{
    var shader = gl.createShader(type);

    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        console.log(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
};

var compileProgram_1 = compileProgram;

var mapSize = function(gl, type) 
{
    if(!GL_TABLE) 
    {
        var typeNames = Object.keys(GL_TO_GLSL_TYPES);

        GL_TABLE = {};

        for(var i = 0; i < typeNames.length; ++i) 
        {
            var tn = typeNames[i];
            GL_TABLE[ gl[tn] ] = GL_TO_GLSL_TYPES[tn];
        }
    }

  return GL_TABLE[type];
};

var GL_TABLE = null;

var GL_TO_GLSL_TYPES = {
  'FLOAT':       'float',
  'FLOAT_VEC2':  'vec2',
  'FLOAT_VEC3':  'vec3',
  'FLOAT_VEC4':  'vec4',

  'INT':         'int',
  'INT_VEC2':    'ivec2',
  'INT_VEC3':    'ivec3',
  'INT_VEC4':    'ivec4',
  
  'BOOL':        'bool',
  'BOOL_VEC2':   'bvec2',
  'BOOL_VEC3':   'bvec3',
  'BOOL_VEC4':   'bvec4',
  
  'FLOAT_MAT2':  'mat2',
  'FLOAT_MAT3':  'mat3',
  'FLOAT_MAT4':  'mat4',
  
  'SAMPLER_2D':  'sampler2D'  
};

var mapType = mapSize;

/**
 * @class
 * @memberof PIXI.glCore.shader
 * @param type {String}
 * @return {Number}
 */
var mapSize$1 = function(type) 
{ 
    return GLSL_TO_SIZE[type];
};


var GLSL_TO_SIZE = {
    'float':    1,
    'vec2':     2,
    'vec3':     3,
    'vec4':     4,

    'int':      1,
    'ivec2':    2,
    'ivec3':    3,
    'ivec4':    4,

    'bool':     1,
    'bvec2':    2,
    'bvec3':    3,
    'bvec4':    4,

    'mat2':     4,
    'mat3':     9,
    'mat4':     16,

    'sampler2D':  1
};

var mapSize_1 = mapSize$1;

/**
 * Extracts the attributes
 * @class
 * @memberof PIXI.glCore.shader
 * @param gl {WebGLRenderingContext} The current WebGL rendering context
 * @param program {WebGLProgram} The shader program to get the attributes from
 * @return attributes {Object}
 */
var extractAttributes = function(gl, program)
{
    var attributes = {};

    var totalAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

    for (var i = 0; i < totalAttributes; i++)
    {
        var attribData = gl.getActiveAttrib(program, i);
        var type = mapType(gl, attribData.type);

        attributes[attribData.name] = {
            type:type,
            size:mapSize_1(type),
            location:gl.getAttribLocation(program, attribData.name),
            //TODO - make an attribute object
            pointer: pointer
        };
    }

    return attributes;
};

var pointer = function(type, normalized, stride, start){
    // console.log(this.location)
    gl.vertexAttribPointer(this.location,this.size, type || gl.FLOAT, normalized || false, stride || 0, start || 0);
};

var extractAttributes_1 = extractAttributes;

/**
 * @class
 * @memberof PIXI.glCore.shader
 * @param type {String} Type of value
 * @param size {Number}
 */
var defaultValue = function(type, size) 
{
    switch (type)
    {
        case 'float':
            return 0;

        case 'vec2': 
            return new Float32Array(2 * size);

        case 'vec3':
            return new Float32Array(3 * size);

        case 'vec4':     
            return new Float32Array(4 * size);
            
        case 'int':
        case 'sampler2D':
            return 0;

        case 'ivec2':   
            return new Int32Array(2 * size);

        case 'ivec3':
            return new Int32Array(3 * size);

        case 'ivec4': 
            return new Int32Array(4 * size);

        case 'bool':     
            return false;

        case 'bvec2':

            return booleanArray( 2 * size);

        case 'bvec3':
            return booleanArray(3 * size);

        case 'bvec4':
            return booleanArray(4 * size);

        case 'mat2':
            return new Float32Array([1, 0,
                                     0, 1]);

        case 'mat3': 
            return new Float32Array([1, 0, 0,
                                     0, 1, 0,
                                     0, 0, 1]);

        case 'mat4':
            return new Float32Array([1, 0, 0, 0,
                                     0, 1, 0, 0,
                                     0, 0, 1, 0,
                                     0, 0, 0, 1]);
    }
};

var booleanArray = function(size)
{
    var array = new Array(size);

    for (var i = 0; i < array.length; i++) 
    {
        array[i] = false;
    }

    return array;
};

var defaultValue_1 = defaultValue;

/**
 * Extracts the uniforms
 * @class
 * @memberof PIXI.glCore.shader
 * @param gl {WebGLRenderingContext} The current WebGL rendering context
 * @param program {WebGLProgram} The shader program to get the uniforms from
 * @return uniforms {Object}
 */
var extractUniforms = function(gl, program)
{
	var uniforms = {};

    var totalUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

    for (var i = 0; i < totalUniforms; i++)
    {
    	var uniformData = gl.getActiveUniform(program, i);
    	var name = uniformData.name.replace(/\[.*?\]/, "");
        var type = mapType(gl, uniformData.type );

    	uniforms[name] = {
    		type:type,
    		size:uniformData.size,
    		location:gl.getUniformLocation(program, name),
    		value:defaultValue_1(type, uniformData.size)
    	};
    }

	return uniforms;
};

var extractUniforms_1 = extractUniforms;

/**
 * Sets the float precision on the shader. If the precision is already present this function will do nothing
 * @param {string} src       the shader source
 * @param {string} precision The float precision of the shader. Options are 'lowp', 'mediump' or 'highp'.
 *
 * @return {string} modified shader source
 */
var setPrecision = function(src, precision)
{
    if(src.substring(0, 9) !== 'precision')
    {
        return 'precision ' + precision + ' float;\n' + src;
    }

    return src;
};

var setPrecision_1 = setPrecision;

/**
 * Extracts the attributes
 * @class
 * @memberof PIXI.glCore.shader
 * @param gl {WebGLRenderingContext} The current WebGL rendering context
 * @param uniforms {Array} @mat ?
 * @return attributes {Object}
 */
var generateUniformAccessObject = function(gl, uniformData)
{
    // this is the object we will be sending back.
    // an object hierachy will be created for structs
    var uniforms = {data:{}};

    uniforms.gl = gl;

    var uniformKeys= Object.keys(uniformData);

    for (var i = 0; i < uniformKeys.length; i++)
    {
        var fullName = uniformKeys[i];

        var nameTokens = fullName.split('.');
        var name = nameTokens[nameTokens.length - 1];


        var uniformGroup = getUniformGroup(nameTokens, uniforms);

        var uniform =  uniformData[fullName];
        uniformGroup.data[name] = uniform;

        uniformGroup.gl = gl;

        Object.defineProperty(uniformGroup, name, {
            get: generateGetter(name),
            set: generateSetter(name, uniform)
        });
    }

    return uniforms;
};

var generateGetter = function(name)
{
	var template = getterTemplate.replace('%%', name);
	return new Function(template); // jshint ignore:line
};

var generateSetter = function(name, uniform)
{
    var template = setterTemplate.replace(/%%/g, name);
    var setTemplate;

    if(uniform.size === 1)
    {
        setTemplate = GLSL_TO_SINGLE_SETTERS[uniform.type];
    }
    else
    {
        setTemplate = GLSL_TO_ARRAY_SETTERS[uniform.type];
    }

    if(setTemplate)
    {
        template += "\nthis.gl." + setTemplate + ";";
    }

  	return new Function('value', template); // jshint ignore:line
};

var getUniformGroup = function(nameTokens, uniform)
{
    var cur = uniform;

    for (var i = 0; i < nameTokens.length - 1; i++)
    {
        var o = cur[nameTokens[i]] || {data:{}};
        cur[nameTokens[i]] = o;
        cur = o;
    }

    return cur;
};

var getterTemplate = [
    'return this.data.%%.value;',
].join('\n');

var setterTemplate = [
    'this.data.%%.value = value;',
    'var location = this.data.%%.location;'
].join('\n');


var GLSL_TO_SINGLE_SETTERS = {

    'float':    'uniform1f(location, value)',

    'vec2':     'uniform2f(location, value[0], value[1])',
    'vec3':     'uniform3f(location, value[0], value[1], value[2])',
    'vec4':     'uniform4f(location, value[0], value[1], value[2], value[3])',

    'int':      'uniform1i(location, value)',
    'ivec2':    'uniform2i(location, value[0], value[1])',
    'ivec3':    'uniform3i(location, value[0], value[1], value[2])',
    'ivec4':    'uniform4i(location, value[0], value[1], value[2], value[3])',

    'bool':     'uniform1i(location, value)',
    'bvec2':    'uniform2i(location, value[0], value[1])',
    'bvec3':    'uniform3i(location, value[0], value[1], value[2])',
    'bvec4':    'uniform4i(location, value[0], value[1], value[2], value[3])',

    'mat2':     'uniformMatrix2fv(location, false, value)',
    'mat3':     'uniformMatrix3fv(location, false, value)',
    'mat4':     'uniformMatrix4fv(location, false, value)',

    'sampler2D':'uniform1i(location, value)'
};

var GLSL_TO_ARRAY_SETTERS = {

    'float':    'uniform1fv(location, value)',

    'vec2':     'uniform2fv(location, value)',
    'vec3':     'uniform3fv(location, value)',
    'vec4':     'uniform4fv(location, value)',

    'int':      'uniform1iv(location, value)',
    'ivec2':    'uniform2iv(location, value)',
    'ivec3':    'uniform3iv(location, value)',
    'ivec4':    'uniform4iv(location, value)',

    'bool':     'uniform1iv(location, value)',
    'bvec2':    'uniform2iv(location, value)',
    'bvec3':    'uniform3iv(location, value)',
    'bvec4':    'uniform4iv(location, value)',

    'sampler2D':'uniform1iv(location, value)'
};

var generateUniformAccessObject_1 = generateUniformAccessObject;

/**
 * Helper class to create a webGL Shader
 *
 * @class
 * @memberof PIXI.glCore
 * @param gl {WebGLRenderingContext}
 * @param vertexSrc {string|string[]} The vertex shader source as an array of strings.
 * @param fragmentSrc {string|string[]} The fragment shader source as an array of strings.
 * @param precision {precision]} The float precision of the shader. Options are 'lowp', 'mediump' or 'highp'.
 * @param attributeLocations {object} A key value pair showing which location eact attribute should sit eg {position:0, uvs:1}
 */
var Shader = function(gl, vertexSrc, fragmentSrc, precision, attributeLocations)
{
	/**
	 * The current WebGL rendering context
	 *
	 * @member {WebGLRenderingContext}
	 */
	this.gl = gl;

	if(precision)
	{
		vertexSrc = setPrecision_1(vertexSrc, precision);
		fragmentSrc = setPrecision_1(fragmentSrc, precision);
	}

	/**
	 * The shader program
	 *
	 * @member {WebGLProgram}
	 */
	// First compile the program..
	this.program = compileProgram_1(gl, vertexSrc, fragmentSrc, attributeLocations);

	/**
	 * The attributes of the shader as an object containing the following properties
	 * {
	 * 	type,
	 * 	size,
	 * 	location,
	 * 	pointer
	 * }
	 * @member {Object}
	 */
	// next extract the attributes
	this.attributes = extractAttributes_1(gl, this.program);

    this.uniformData = extractUniforms_1(gl, this.program);

	/**
	 * The uniforms of the shader as an object containing the following properties
	 * {
	 * 	gl,
	 * 	data
	 * }
	 * @member {Object}
	 */
	this.uniforms = generateUniformAccessObject_1( gl, this.uniformData );

};
/**
 * Uses this shader
 */
Shader.prototype.bind = function()
{
	this.gl.useProgram(this.program);
};

/**
 * Destroys this shader
 * TODO
 */
Shader.prototype.destroy = function()
{
	this.attributes = null;
	this.uniformData = null;
	this.uniforms = null;

	var gl = this.gl;
	gl.deleteProgram(this.program);
};


var GLShader = Shader;

// state object//


/**
 * Helper class to work with WebGL VertexArrayObjects (vaos)
 * Only works if WebGL extensions are enabled (they usually are)
 *
 * @class
 * @memberof PIXI.glCore
 * @param gl {WebGLRenderingContext} The current WebGL rendering context
 */
function VertexArrayObject(gl, state)
{
    this.nativeVaoExtension = null;

    if(!VertexArrayObject.FORCE_NATIVE)
    {
        this.nativeVaoExtension = gl.getExtension('OES_vertex_array_object') ||
                                  gl.getExtension('MOZ_OES_vertex_array_object') ||
                                  gl.getExtension('WEBKIT_OES_vertex_array_object');
    }

    this.nativeState = state;

    if(this.nativeVaoExtension)
    {
        this.nativeVao = this.nativeVaoExtension.createVertexArrayOES();

        var maxAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);

        // VAO - overwrite the state..
        this.nativeState = {
            tempAttribState: new Array(maxAttribs),
            attribState: new Array(maxAttribs)
        };
    }

    /**
     * The current WebGL rendering context
     *
     * @member {WebGLRenderingContext}
     */
    this.gl = gl;

    /**
     * An array of attributes
     *
     * @member {Array}
     */
    this.attributes = [];

    /**
     * @member {PIXI.glCore.GLBuffer}
     */
    this.indexBuffer = null;

    /**
     * A boolean flag
     *
     * @member {Boolean}
     */
    this.dirty = false;
}

VertexArrayObject.prototype.constructor = VertexArrayObject;
var VertexArrayObject_1 = VertexArrayObject;

/**
* Some devices behave a bit funny when using the newer extensions (im looking at you ipad 2!)
* If you find on older devices that things have gone a bit weird then set this to true.
*/
/**
 * Lets the VAO know if you should use the WebGL extension or the native methods.
 * Some devices behave a bit funny when using the newer extensions (im looking at you ipad 2!)
 * If you find on older devices that things have gone a bit weird then set this to true.
 * @static
 * @property {Boolean} FORCE_NATIVE
 */
VertexArrayObject.FORCE_NATIVE = false;

/**
 * Binds the buffer
 */
VertexArrayObject.prototype.bind = function()
{
    if(this.nativeVao)
    {
        this.nativeVaoExtension.bindVertexArrayOES(this.nativeVao);

        if(this.dirty)
        {
            this.dirty = false;
            this.activate();
        }
    }
    else
    {

        this.activate();
    }

    return this;
};

/**
 * Unbinds the buffer
 */
VertexArrayObject.prototype.unbind = function()
{
    if(this.nativeVao)
    {
        this.nativeVaoExtension.bindVertexArrayOES(null);
    }

    return this;
};

/**
 * Uses this vao
 */
VertexArrayObject.prototype.activate = function()
{

    var gl = this.gl;
    var lastBuffer = null;

    for (var i = 0; i < this.attributes.length; i++)
    {
        var attrib = this.attributes[i];

        if(lastBuffer !== attrib.buffer)
        {
            attrib.buffer.bind();
            lastBuffer = attrib.buffer;
        }

        gl.vertexAttribPointer(attrib.attribute.location,
                               attrib.attribute.size,
                               attrib.type || gl.FLOAT,
                               attrib.normalized || false,
                               attrib.stride || 0,
                               attrib.start || 0);
    }

    setVertexAttribArrays_1(gl, this.attributes, this.nativeState);

    if(this.indexBuffer)
    {
        this.indexBuffer.bind();
    }

    return this;
};

/**
 *
 * @param buffer     {PIXI.gl.GLBuffer}
 * @param attribute  {*}
 * @param type       {String}
 * @param normalized {Boolean}
 * @param stride     {Number}
 * @param start      {Number}
 */
VertexArrayObject.prototype.addAttribute = function(buffer, attribute, type, normalized, stride, start)
{
    this.attributes.push({
        buffer:     buffer,
        attribute:  attribute,

        location:   attribute.location,
        type:       type || this.gl.FLOAT,
        normalized: normalized || false,
        stride:     stride || 0,
        start:      start || 0
    });

    this.dirty = true;

    return this;
};

/**
 *
 * @param buffer   {PIXI.gl.GLBuffer}
 */
VertexArrayObject.prototype.addIndex = function(buffer/*, options*/)
{
    this.indexBuffer = buffer;

    this.dirty = true;

    return this;
};

/**
 * Unbinds this vao and disables it
 */
VertexArrayObject.prototype.clear = function()
{
    // var gl = this.gl;

    // TODO - should this function unbind after clear?
    // for now, no but lets see what happens in the real world!
    if(this.nativeVao)
    {
        this.nativeVaoExtension.bindVertexArrayOES(this.nativeVao);
    }

    this.attributes.length = 0;
    this.indexBuffer = null;

    return this;
};

/**
 * @param type  {Number}
 * @param size  {Number}
 * @param start {Number}
 */
VertexArrayObject.prototype.draw = function(type, size, start)
{
    var gl = this.gl;

    if(this.indexBuffer)
    {
        gl.drawElements(type, size || this.indexBuffer.data.length, gl.UNSIGNED_SHORT, (start || 0) * 2 );
    }
    else
    {
        // TODO need a better way to calculate size..
        gl.drawArrays(type, start, size || this.getSize());
    }

    return this;
};

/**
 * Destroy this vao
 */
VertexArrayObject.prototype.destroy = function()
{
    // lose references
    this.gl = null;
    this.indexBuffer = null;
    this.attributes = null;
    this.nativeState = null;

    if(this.nativeVao)
    {
        this.nativeVaoExtension.deleteVertexArrayOES(this.nativeVao);
    }

    this.nativeVaoExtension = null;
    this.nativeVao = null;
};

VertexArrayObject.prototype.getSize = function()
{
    var attrib = this.attributes[0];
    return attrib.buffer.data.length / (( attrib.stride/4 ) || attrib.attribute.size);
};

var index$1 = {
    compileProgram: compileProgram_1,
    defaultValue: defaultValue_1,
    extractAttributes: extractAttributes_1,
    extractUniforms: extractUniforms_1,
    generateUniformAccessObject: generateUniformAccessObject_1,
    setPrecision: setPrecision_1,
    mapSize: mapSize_1,
    mapType: mapType
};

var index$1$1 = createCommonjsModule(function (module) {
var gl = {
    createContext:          createContext_1,
    setVertexAttribArrays:  setVertexAttribArrays_1,
    GLBuffer:               GLBuffer,
    GLFramebuffer:          GLFramebuffer$1,
    GLShader:               GLShader,
    GLTexture:              GLTexture,
    VertexArrayObject:      VertexArrayObject_1,
    shader:                 index$1
};

// Export for Node-compatible environments
if ('object' !== 'undefined' && module.exports)
{
    // Export the module
    module.exports = gl;
}

// Add to the browser window pixi.gl
if (typeof window !== 'undefined')
{
    // add the window object
    window.PIXI = window.PIXI || {};
    window.PIXI.glCore = gl;
}
});

var GLFramebuffer = index$1$1.GLFramebuffer;

var RenderTarget = function () {
    function RenderTarget(gl, width, height, resolution, root) {
        classCallCheck(this, RenderTarget);

        this.gl = gl;

        // framebuffer 是WebGL渲染的终点。当你看屏幕时，其他就是在看 framebuffer 中的内容。
        this.frameBuffer = null;

        this.clearColor = [0, 0, 0, 0];

        this.size = new Rectangle(0, 0, 1, 1);

        /**
         * 设备分辨率
         */
        this.resolution = resolution || settings.RESOLUTION;

        //投影矩阵，把所有的顶点投射到webgl的[-1,1]的坐标系内
        this.projectionMatrix = new Matrix();

        this.frame = null;

        this.defaultFrame = new Rectangle();
        this.destinationFrame = null;
        this.sourceFrame = null;

        this.root = root;

        this.frameBuffer = new GLFramebuffer(gl, 100, 100);
        this.frameBuffer.framebuffer = null;

        this.setFrame();

        this.resize(width, height);
    }

    createClass(RenderTarget, [{
        key: 'clear',
        value: function clear(clearColor) {
            var cc = clearColor || this.clearColor;

            this.frameBuffer.clear(cc[0], cc[1], cc[2], cc[3]); // r,g,b,a);
        }
    }, {
        key: 'setFrame',
        value: function setFrame(destinationFrame, sourceFrame) {
            this.destinationFrame = destinationFrame || this.destinationFrame || this.defaultFrame;
            this.sourceFrame = sourceFrame || this.sourceFrame || destinationFrame;
        }

        //在WebGLRenderer中被调用

    }, {
        key: 'activate',
        value: function activate() {
            var gl = this.gl;

            this.frameBuffer.bind();

            this.calculateProjection(this.destinationFrame, this.sourceFrame);

            if (this.destinationFrame !== this.sourceFrame) {
                gl.enable(gl.SCISSOR_TEST);
                gl.scissor(this.destinationFrame.x | 0, this.destinationFrame.y | 0, this.destinationFrame.width * this.resolution | 0, this.destinationFrame.height * this.resolution | 0);
            } else {
                gl.disable(gl.SCISSOR_TEST);
            }

            gl.viewport(this.destinationFrame.x | 0, this.destinationFrame.y | 0, this.destinationFrame.width * this.resolution | 0, this.destinationFrame.height * this.resolution | 0);
        }

        //计算投影矩阵，把所有的顶点数据投射到 webgl 的 [-1,1] 坐标系内来

    }, {
        key: 'calculateProjection',
        value: function calculateProjection(destinationFrame, sourceFrame) {
            var pm = this.projectionMatrix;

            sourceFrame = sourceFrame || destinationFrame;

            pm.identity();

            pm.a = 1 / destinationFrame.width;
            pm.d = -1 / destinationFrame.height;

            pm.tx = -1 - sourceFrame.x * pm.a;
            pm.ty = 1 - sourceFrame.y * pm.d;
        }

        //stage 的 size发生变化，需要重新初始化这些对象的size，尤其是 projectionMatrix 投影举证

    }, {
        key: 'resize',
        value: function resize(width, height) {
            width = width | 0;
            height = height | 0;

            if (this.size.width === width && this.size.height === height) {
                return;
            }

            this.size.width = width;
            this.size.height = height;

            this.defaultFrame.width = width;
            this.defaultFrame.height = height;

            this.frameBuffer.resize(width * this.resolution, height * this.resolution);

            var projectionFrame = this.frame || this.size;

            this.calculateProjection(projectionFrame);
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.frameBuffer.destroy();
            this.frameBuffer = null;
        }
    }]);
    return RenderTarget;
}();

var DEPTH_TEST = 1;
var FRONT_FACE = 2;
var CULL_FACE = 3;

var WebGLState = function () {
    function WebGLState(gl) {
        classCallCheck(this, WebGLState);


        this.activeState = new Uint8Array(16);

        this.defaultState = new Uint8Array(16);

        this.defaultState[0] = 1;

        this.stackIndex = 0;

        this.stack = [];

        this.gl = gl;

        this.maxAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);

        this.attribState = {
            tempAttribState: new Array(this.maxAttribs),
            attribState: new Array(this.maxAttribs)
        };

        // check we have vao..
        this.nativeVaoExtension = gl.getExtension('OES_vertex_array_object') || gl.getExtension('MOZ_OES_vertex_array_object') || gl.getExtension('WEBKIT_OES_vertex_array_object');
    }

    createClass(WebGLState, [{
        key: 'push',
        value: function push() {
            var state = this.stack[++this.stackIndex];

            if (!state) {
                state = this.stack[this.stackIndex] = new Uint8Array(16);
            }

            for (var i = 0; i < this.activeState.length; i++) {
                this.activeState[i] = state[i];
            }
        }
    }, {
        key: 'pop',
        value: function pop() {
            var state = this.stack[--this.stackIndex];

            this.setState(state);
        }
    }, {
        key: 'setState',
        value: function setState(state) {
            this.setDepthTest(state[DEPTH_TEST]);
            this.setFrontFace(state[FRONT_FACE]);
            this.setCullFace(state[CULL_FACE]);
        }
    }, {
        key: 'setDepthTest',
        value: function setDepthTest(value) {
            value = value ? 1 : 0;

            if (this.activeState[DEPTH_TEST] === value) {
                return;
            }

            this.activeState[DEPTH_TEST] = value;
            this.gl[value ? 'enable' : 'disable'](this.gl.DEPTH_TEST);
        }
    }, {
        key: 'setCullFace',
        value: function setCullFace(value) {
            value = value ? 1 : 0;

            if (this.activeState[CULL_FACE] === value) {
                return;
            }

            this.activeState[CULL_FACE] = value;
            this.gl[value ? 'enable' : 'disable'](this.gl.CULL_FACE);
        }
    }, {
        key: 'setFrontFace',
        value: function setFrontFace(value) {
            value = value ? 1 : 0;

            if (this.activeState[FRONT_FACE] === value) {
                return;
            }

            this.activeState[FRONT_FACE] = value;
            this.gl.frontFace(this.gl[value ? 'CW' : 'CCW']);
        }
    }, {
        key: 'resetAttributes',
        value: function resetAttributes() {
            for (var i = 0; i < this.attribState.tempAttribState.length; i++) {
                this.attribState.tempAttribState[i] = 0;
            }

            for (var _i = 0; _i < this.attribState.attribState.length; _i++) {
                this.attribState.attribState[_i] = 0;
            }

            for (var _i2 = 1; _i2 < this.maxAttribs; _i2++) {
                this.gl.disableVertexAttribArray(_i2);
            }
        }
    }, {
        key: 'resetToDefault',
        value: function resetToDefault() {
            if (this.nativeVaoExtension) {
                this.nativeVaoExtension.bindVertexArrayOES(null);
            }

            this.resetAttributes();

            for (var i = 0; i < this.activeState.length; ++i) {
                this.activeState[i] = 32;
            }

            this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false);

            this.setState(this.defaultState);
        }
    }]);
    return WebGLState;
}();

function hex2rgb(hex, out) {
  //hex可能是“#ff0000” 也可能是 0xff0000
  if (hex.replace) {
    hex = parseInt(hex.replace("#", "0X"), 16);
  }

  out = out || [];

  out[0] = (hex >> 16 & 0xFF) / 255;
  out[1] = (hex >> 8 & 0xFF) / 255;
  out[2] = (hex & 0xFF) / 255;

  return out;
}

var WebGLGraphicsData = function () {
  function WebGLGraphicsData(gl, shader, attribsState) {
    classCallCheck(this, WebGLGraphicsData);

    this.gl = gl;

    this.color = [0, 0, 0]; // color split!


    this.points = [];

    /**
     * The indices of the vertices
     * @member {number[]}
     */
    this.indices = [];
    /**
     * The main buffer
     * @member {WebGLBuffer}
     */
    this.buffer = index$1$1.GLBuffer.createVertexBuffer(gl);

    /**
     * The index buffer
     * @member {WebGLBuffer}
     */
    this.indexBuffer = index$1$1.GLBuffer.createIndexBuffer(gl);

    /**
     * Whether this graphics is dirty or not
     * @member {boolean}
     */
    this.dirty = true;

    this.glPoints = null;
    this.glIndices = null;

    /**
     *
     * @member {PIXI.Shader}
     */
    this.shader = shader;

    this.vao = new index$1$1.VertexArrayObject(gl, attribsState).addIndex(this.indexBuffer).addAttribute(this.buffer, shader.attributes.aVertexPosition, gl.FLOAT, false, 4 * 6, 0).addAttribute(this.buffer, shader.attributes.aColor, gl.FLOAT, false, 4 * 6, 2 * 4);
  }

  /**
   * Resets the vertices and the indices
   */


  createClass(WebGLGraphicsData, [{
    key: 'reset',
    value: function reset() {
      this.points.length = 0;
      this.indices.length = 0;
    }

    /**
     * Binds the buffers and uploads the data
     */

  }, {
    key: 'upload',
    value: function upload() {
      this.glPoints = new Float32Array(this.points);
      this.buffer.upload(this.glPoints);

      this.glIndices = new Uint16Array(this.indices);
      this.indexBuffer.upload(this.glIndices);

      this.dirty = false;
    }

    /**
     * Empties all the data
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      this.color = null;
      this.points = null;
      this.indices = null;

      this.vao.destroy();
      this.buffer.destroy();
      this.indexBuffer.destroy();

      this.gl = null;

      this.buffer = null;
      this.indexBuffer = null;

      this.glPoints = null;
      this.glIndices = null;
    }
  }]);
  return WebGLGraphicsData;
}();

var PRECISION = settings.PRECISION;

var GLShader$2 = index$1$1.GLShader;

function checkPrecision(src) {
    if (src instanceof Array) {
        if (src[0].substring(0, 9) !== 'precision') {
            var copy = src.slice(0);

            copy.unshift('precision ' + PRECISION + ' float;');

            return copy;
        }
    } else if (src.substring(0, 9) !== 'precision') {
        return 'precision ' + PRECISION + ' float;\n' + src;
    }

    return src;
}

/**
 * Wrapper class, webGL Shader for Pixi.
 * Adds precision string if vertexSrc or fragmentSrc have no mention of it.
 *
 * @class
 * @extends GLShader
 * @memberof PIXI
 */

var Shader$1 = function (_GLShader) {
    inherits(Shader, _GLShader);

    /**
     *
     * @param {WebGLRenderingContext} gl - The current WebGL rendering context
     * @param {string|string[]} vertexSrc - The vertex shader source as an array of strings.
     * @param {string|string[]} fragmentSrc - The fragment shader source as an array of strings.
     */
    function Shader(gl, vertexSrc, fragmentSrc) {
        classCallCheck(this, Shader);
        return possibleConstructorReturn(this, (Shader.__proto__ || Object.getPrototypeOf(Shader)).call(this, gl, checkPrecision(vertexSrc), checkPrecision(fragmentSrc)));
    }

    return Shader;
}(GLShader$2);

var PrimitiveShader = function (_Shader) {
    inherits(PrimitiveShader, _Shader);

    function PrimitiveShader(gl) {
        classCallCheck(this, PrimitiveShader);
        return possibleConstructorReturn(this, (PrimitiveShader.__proto__ || Object.getPrototypeOf(PrimitiveShader)).call(this, gl,
        //vertex shader
        ['attribute vec2 aVertexPosition;', 'attribute vec4 aColor;', 'uniform mat3 translationMatrix;', 'uniform mat3 projectionMatrix;', 'uniform float alpha;', 'uniform vec3 tint;', 'varying vec4 vColor;', 'void main(void){', '   gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);', '   vColor = aColor * vec4(tint * alpha, alpha);', '}'].join('\n'),
        // fragment shader
        ['varying vec4 vColor;', 'void main(void){', '   gl_FragColor = vColor;', '}'].join('\n')));
    }

    return PrimitiveShader;
}(Shader$1);

function buildLine(graphicsData, webGLData) {
    var points = graphicsData.points;

    if (points.length === 0) {
        return;
    }

    var firstPoint = { x: points[0], y: points[1] };
    var lastPoint = { x: points[points.length - 2], y: points[points.length - 1] };

    if (firstPoint.x === lastPoint.x && firstPoint.y === lastPoint.y) {
        points = points.slice();

        points.pop();
        points.pop();

        lastPoint = { x: points[points.length - 2], y: points[points.length - 1] };

        var midPointX = lastPoint.x + (firstPoint.x - lastPoint.x) * 0.5;
        var midPointY = lastPoint.y + (firstPoint.y - lastPoint.y) * 0.5;

        points.unshift(midPointX, midPointY);
        points.push(midPointX, midPointY);
    }

    var verts = webGLData.points;
    var indices = webGLData.indices;
    var length = points.length / 2;
    var indexCount = points.length;
    var indexStart = verts.length / 6;

    var width = graphicsData.lineWidth / 2;

    var color = hex2rgb(graphicsData.strokeStyle);
    var alpha = graphicsData.lineAlpha;
    var r = color[0] * alpha;
    var g = color[1] * alpha;
    var b = color[2] * alpha;

    var p1x = points[0];
    var p1y = points[1];
    var p2x = points[2];
    var p2y = points[3];
    var p3x = 0;
    var p3y = 0;

    var perpx = -(p1y - p2y);
    var perpy = p1x - p2x;
    var perp2x = 0;
    var perp2y = 0;
    var perp3x = 0;
    var perp3y = 0;

    var dist = Math.sqrt(perpx * perpx + perpy * perpy);

    perpx /= dist;
    perpy /= dist;
    perpx *= width;
    perpy *= width;

    // start
    verts.push(p1x - perpx, p1y - perpy, r, g, b, alpha);

    verts.push(p1x + perpx, p1y + perpy, r, g, b, alpha);

    for (var i = 1; i < length - 1; ++i) {
        p1x = points[(i - 1) * 2];
        p1y = points[(i - 1) * 2 + 1];

        p2x = points[i * 2];
        p2y = points[i * 2 + 1];

        p3x = points[(i + 1) * 2];
        p3y = points[(i + 1) * 2 + 1];

        perpx = -(p1y - p2y);
        perpy = p1x - p2x;

        dist = Math.sqrt(perpx * perpx + perpy * perpy);
        perpx /= dist;
        perpy /= dist;
        perpx *= width;
        perpy *= width;

        perp2x = -(p2y - p3y);
        perp2y = p2x - p3x;

        dist = Math.sqrt(perp2x * perp2x + perp2y * perp2y);
        perp2x /= dist;
        perp2y /= dist;
        perp2x *= width;
        perp2y *= width;

        var a1 = -perpy + p1y - (-perpy + p2y);
        var b1 = -perpx + p2x - (-perpx + p1x);
        var c1 = (-perpx + p1x) * (-perpy + p2y) - (-perpx + p2x) * (-perpy + p1y);
        var a2 = -perp2y + p3y - (-perp2y + p2y);
        var b2 = -perp2x + p2x - (-perp2x + p3x);
        var c2 = (-perp2x + p3x) * (-perp2y + p2y) - (-perp2x + p2x) * (-perp2y + p3y);

        var denom = a1 * b2 - a2 * b1;

        if (Math.abs(denom) < 0.1) {
            denom += 10.1;
            verts.push(p2x - perpx, p2y - perpy, r, g, b, alpha);

            verts.push(p2x + perpx, p2y + perpy, r, g, b, alpha);

            continue;
        }

        var px = (b1 * c2 - b2 * c1) / denom;
        var py = (a2 * c1 - a1 * c2) / denom;
        var pdist = (px - p2x) * (px - p2x) + (py - p2y) * (py - p2y);

        if (pdist > 196 * width * width) {
            perp3x = perpx - perp2x;
            perp3y = perpy - perp2y;

            dist = Math.sqrt(perp3x * perp3x + perp3y * perp3y);
            perp3x /= dist;
            perp3y /= dist;
            perp3x *= width;
            perp3y *= width;

            verts.push(p2x - perp3x, p2y - perp3y);
            verts.push(r, g, b, alpha);

            verts.push(p2x + perp3x, p2y + perp3y);
            verts.push(r, g, b, alpha);

            verts.push(p2x - perp3x, p2y - perp3y);
            verts.push(r, g, b, alpha);

            indexCount++;
        } else {
            verts.push(px, py);
            verts.push(r, g, b, alpha);

            verts.push(p2x - (px - p2x), p2y - (py - p2y));
            verts.push(r, g, b, alpha);
        }
    }

    p1x = points[(length - 2) * 2];
    p1y = points[(length - 2) * 2 + 1];

    p2x = points[(length - 1) * 2];
    p2y = points[(length - 1) * 2 + 1];

    perpx = -(p1y - p2y);
    perpy = p1x - p2x;

    dist = Math.sqrt(perpx * perpx + perpy * perpy);
    perpx /= dist;
    perpy /= dist;
    perpx *= width;
    perpy *= width;

    verts.push(p2x - perpx, p2y - perpy);
    verts.push(r, g, b, alpha);

    verts.push(p2x + perpx, p2y + perpy);
    verts.push(r, g, b, alpha);

    indices.push(indexStart);

    for (var _i = 0; _i < indexCount; ++_i) {
        indices.push(indexStart++);
    }

    indices.push(indexStart - 1);
}

var earcut_1 = earcut;

function earcut(data, holeIndices, dim) {

    dim = dim || 2;

    var hasHoles = holeIndices && holeIndices.length,
        outerLen = hasHoles ? holeIndices[0] * dim : data.length,
        outerNode = linkedList(data, 0, outerLen, dim, true),
        triangles = [];

    if (!outerNode) return triangles;

    var minX, minY, maxX, maxY, x, y, size;

    if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim);

    // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox
    if (data.length > 80 * dim) {
        minX = maxX = data[0];
        minY = maxY = data[1];

        for (var i = dim; i < outerLen; i += dim) {
            x = data[i];
            y = data[i + 1];
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
        }

        // minX, minY and size are later used to transform coords into integers for z-order calculation
        size = Math.max(maxX - minX, maxY - minY);
    }

    earcutLinked(outerNode, triangles, dim, minX, minY, size);

    return triangles;
}

// create a circular doubly linked list from polygon points in the specified winding order
function linkedList(data, start, end, dim, clockwise) {
    var i, last;

    if (clockwise === (signedArea(data, start, end, dim) > 0)) {
        for (i = start; i < end; i += dim) last = insertNode(i, data[i], data[i + 1], last);
    } else {
        for (i = end - dim; i >= start; i -= dim) last = insertNode(i, data[i], data[i + 1], last);
    }

    if (last && equals(last, last.next)) {
        removeNode(last);
        last = last.next;
    }

    return last;
}

// eliminate colinear or duplicate points
function filterPoints(start, end) {
    if (!start) return start;
    if (!end) end = start;

    var p = start,
        again;
    do {
        again = false;

        if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
            removeNode(p);
            p = end = p.prev;
            if (p === p.next) return null;
            again = true;

        } else {
            p = p.next;
        }
    } while (again || p !== end);

    return end;
}

// main ear slicing loop which triangulates a polygon (given as a linked list)
function earcutLinked(ear, triangles, dim, minX, minY, size, pass) {
    if (!ear) return;

    // interlink polygon nodes in z-order
    if (!pass && size) indexCurve(ear, minX, minY, size);

    var stop = ear,
        prev, next;

    // iterate through ears, slicing them one by one
    while (ear.prev !== ear.next) {
        prev = ear.prev;
        next = ear.next;

        if (size ? isEarHashed(ear, minX, minY, size) : isEar(ear)) {
            // cut off the triangle
            triangles.push(prev.i / dim);
            triangles.push(ear.i / dim);
            triangles.push(next.i / dim);

            removeNode(ear);

            // skipping the next vertice leads to less sliver triangles
            ear = next.next;
            stop = next.next;

            continue;
        }

        ear = next;

        // if we looped through the whole remaining polygon and can't find any more ears
        if (ear === stop) {
            // try filtering points and slicing again
            if (!pass) {
                earcutLinked(filterPoints(ear), triangles, dim, minX, minY, size, 1);

            // if this didn't work, try curing all small self-intersections locally
            } else if (pass === 1) {
                ear = cureLocalIntersections(ear, triangles, dim);
                earcutLinked(ear, triangles, dim, minX, minY, size, 2);

            // as a last resort, try splitting the remaining polygon into two
            } else if (pass === 2) {
                splitEarcut(ear, triangles, dim, minX, minY, size);
            }

            break;
        }
    }
}

// check whether a polygon node forms a valid ear with adjacent nodes
function isEar(ear) {
    var a = ear.prev,
        b = ear,
        c = ear.next;

    if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

    // now make sure we don't have other points inside the potential ear
    var p = ear.next.next;

    while (p !== ear.prev) {
        if (pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
            area(p.prev, p, p.next) >= 0) return false;
        p = p.next;
    }

    return true;
}

function isEarHashed(ear, minX, minY, size) {
    var a = ear.prev,
        b = ear,
        c = ear.next;

    if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

    // triangle bbox; min & max are calculated like this for speed
    var minTX = a.x < b.x ? (a.x < c.x ? a.x : c.x) : (b.x < c.x ? b.x : c.x),
        minTY = a.y < b.y ? (a.y < c.y ? a.y : c.y) : (b.y < c.y ? b.y : c.y),
        maxTX = a.x > b.x ? (a.x > c.x ? a.x : c.x) : (b.x > c.x ? b.x : c.x),
        maxTY = a.y > b.y ? (a.y > c.y ? a.y : c.y) : (b.y > c.y ? b.y : c.y);

    // z-order range for the current triangle bbox;
    var minZ = zOrder(minTX, minTY, minX, minY, size),
        maxZ = zOrder(maxTX, maxTY, minX, minY, size);

    // first look for points inside the triangle in increasing z-order
    var p = ear.nextZ;

    while (p && p.z <= maxZ) {
        if (p !== ear.prev && p !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
            area(p.prev, p, p.next) >= 0) return false;
        p = p.nextZ;
    }

    // then look for points in decreasing z-order
    p = ear.prevZ;

    while (p && p.z >= minZ) {
        if (p !== ear.prev && p !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
            area(p.prev, p, p.next) >= 0) return false;
        p = p.prevZ;
    }

    return true;
}

// go through all polygon nodes and cure small local self-intersections
function cureLocalIntersections(start, triangles, dim) {
    var p = start;
    do {
        var a = p.prev,
            b = p.next.next;

        if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {

            triangles.push(a.i / dim);
            triangles.push(p.i / dim);
            triangles.push(b.i / dim);

            // remove two nodes involved
            removeNode(p);
            removeNode(p.next);

            p = start = b;
        }
        p = p.next;
    } while (p !== start);

    return p;
}

// try splitting polygon into two and triangulate them independently
function splitEarcut(start, triangles, dim, minX, minY, size) {
    // look for a valid diagonal that divides the polygon into two
    var a = start;
    do {
        var b = a.next.next;
        while (b !== a.prev) {
            if (a.i !== b.i && isValidDiagonal(a, b)) {
                // split the polygon in two by the diagonal
                var c = splitPolygon(a, b);

                // filter colinear points around the cuts
                a = filterPoints(a, a.next);
                c = filterPoints(c, c.next);

                // run earcut on each half
                earcutLinked(a, triangles, dim, minX, minY, size);
                earcutLinked(c, triangles, dim, minX, minY, size);
                return;
            }
            b = b.next;
        }
        a = a.next;
    } while (a !== start);
}

// link every hole into the outer loop, producing a single-ring polygon without holes
function eliminateHoles(data, holeIndices, outerNode, dim) {
    var queue = [],
        i, len, start, end, list;

    for (i = 0, len = holeIndices.length; i < len; i++) {
        start = holeIndices[i] * dim;
        end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
        list = linkedList(data, start, end, dim, false);
        if (list === list.next) list.steiner = true;
        queue.push(getLeftmost(list));
    }

    queue.sort(compareX);

    // process holes from left to right
    for (i = 0; i < queue.length; i++) {
        eliminateHole(queue[i], outerNode);
        outerNode = filterPoints(outerNode, outerNode.next);
    }

    return outerNode;
}

function compareX(a, b) {
    return a.x - b.x;
}

// find a bridge between vertices that connects hole with an outer ring and and link it
function eliminateHole(hole, outerNode) {
    outerNode = findHoleBridge(hole, outerNode);
    if (outerNode) {
        var b = splitPolygon(outerNode, hole);
        filterPoints(b, b.next);
    }
}

// David Eberly's algorithm for finding a bridge between hole and outer polygon
function findHoleBridge(hole, outerNode) {
    var p = outerNode,
        hx = hole.x,
        hy = hole.y,
        qx = -Infinity,
        m;

    // find a segment intersected by a ray from the hole's leftmost point to the left;
    // segment's endpoint with lesser x will be potential connection point
    do {
        if (hy <= p.y && hy >= p.next.y) {
            var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
            if (x <= hx && x > qx) {
                qx = x;
                if (x === hx) {
                    if (hy === p.y) return p;
                    if (hy === p.next.y) return p.next;
                }
                m = p.x < p.next.x ? p : p.next;
            }
        }
        p = p.next;
    } while (p !== outerNode);

    if (!m) return null;

    if (hx === qx) return m.prev; // hole touches outer segment; pick lower endpoint

    // look for points inside the triangle of hole point, segment intersection and endpoint;
    // if there are no points found, we have a valid connection;
    // otherwise choose the point of the minimum angle with the ray as connection point

    var stop = m,
        mx = m.x,
        my = m.y,
        tanMin = Infinity,
        tan;

    p = m.next;

    while (p !== stop) {
        if (hx >= p.x && p.x >= mx &&
                pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {

            tan = Math.abs(hy - p.y) / (hx - p.x); // tangential

            if ((tan < tanMin || (tan === tanMin && p.x > m.x)) && locallyInside(p, hole)) {
                m = p;
                tanMin = tan;
            }
        }

        p = p.next;
    }

    return m;
}

// interlink polygon nodes in z-order
function indexCurve(start, minX, minY, size) {
    var p = start;
    do {
        if (p.z === null) p.z = zOrder(p.x, p.y, minX, minY, size);
        p.prevZ = p.prev;
        p.nextZ = p.next;
        p = p.next;
    } while (p !== start);

    p.prevZ.nextZ = null;
    p.prevZ = null;

    sortLinked(p);
}

// Simon Tatham's linked list merge sort algorithm
// http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html
function sortLinked(list) {
    var i, p, q, e, tail, numMerges, pSize, qSize,
        inSize = 1;

    do {
        p = list;
        list = null;
        tail = null;
        numMerges = 0;

        while (p) {
            numMerges++;
            q = p;
            pSize = 0;
            for (i = 0; i < inSize; i++) {
                pSize++;
                q = q.nextZ;
                if (!q) break;
            }

            qSize = inSize;

            while (pSize > 0 || (qSize > 0 && q)) {

                if (pSize === 0) {
                    e = q;
                    q = q.nextZ;
                    qSize--;
                } else if (qSize === 0 || !q) {
                    e = p;
                    p = p.nextZ;
                    pSize--;
                } else if (p.z <= q.z) {
                    e = p;
                    p = p.nextZ;
                    pSize--;
                } else {
                    e = q;
                    q = q.nextZ;
                    qSize--;
                }

                if (tail) tail.nextZ = e;
                else list = e;

                e.prevZ = tail;
                tail = e;
            }

            p = q;
        }

        tail.nextZ = null;
        inSize *= 2;

    } while (numMerges > 1);

    return list;
}

// z-order of a point given coords and size of the data bounding box
function zOrder(x, y, minX, minY, size) {
    // coords are transformed into non-negative 15-bit integer range
    x = 32767 * (x - minX) / size;
    y = 32767 * (y - minY) / size;

    x = (x | (x << 8)) & 0x00FF00FF;
    x = (x | (x << 4)) & 0x0F0F0F0F;
    x = (x | (x << 2)) & 0x33333333;
    x = (x | (x << 1)) & 0x55555555;

    y = (y | (y << 8)) & 0x00FF00FF;
    y = (y | (y << 4)) & 0x0F0F0F0F;
    y = (y | (y << 2)) & 0x33333333;
    y = (y | (y << 1)) & 0x55555555;

    return x | (y << 1);
}

// find the leftmost node of a polygon ring
function getLeftmost(start) {
    var p = start,
        leftmost = start;
    do {
        if (p.x < leftmost.x) leftmost = p;
        p = p.next;
    } while (p !== start);

    return leftmost;
}

// check if a point lies within a convex triangle
function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
    return (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 &&
           (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 &&
           (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0;
}

// check if a diagonal between two polygon nodes is valid (lies in polygon interior)
function isValidDiagonal(a, b) {
    return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) &&
           locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b);
}

// signed area of a triangle
function area(p, q, r) {
    return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
}

// check if two points are equal
function equals(p1, p2) {
    return p1.x === p2.x && p1.y === p2.y;
}

// check if two segments intersect
function intersects(p1, q1, p2, q2) {
    if ((equals(p1, q1) && equals(p2, q2)) ||
        (equals(p1, q2) && equals(p2, q1))) return true;
    return area(p1, q1, p2) > 0 !== area(p1, q1, q2) > 0 &&
           area(p2, q2, p1) > 0 !== area(p2, q2, q1) > 0;
}

// check if a polygon diagonal intersects any polygon segments
function intersectsPolygon(a, b) {
    var p = a;
    do {
        if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i &&
                intersects(p, p.next, a, b)) return true;
        p = p.next;
    } while (p !== a);

    return false;
}

// check if a polygon diagonal is locally inside the polygon
function locallyInside(a, b) {
    return area(a.prev, a, a.next) < 0 ?
        area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 :
        area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
}

// check if the middle point of a polygon diagonal is inside the polygon
function middleInside(a, b) {
    var p = a,
        inside = false,
        px = (a.x + b.x) / 2,
        py = (a.y + b.y) / 2;
    do {
        if (((p.y > py) !== (p.next.y > py)) && (px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x))
            inside = !inside;
        p = p.next;
    } while (p !== a);

    return inside;
}

// link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
// if one belongs to the outer ring and another to a hole, it merges it into a single ring
function splitPolygon(a, b) {
    var a2 = new Node(a.i, a.x, a.y),
        b2 = new Node(b.i, b.x, b.y),
        an = a.next,
        bp = b.prev;

    a.next = b;
    b.prev = a;

    a2.next = an;
    an.prev = a2;

    b2.next = a2;
    a2.prev = b2;

    bp.next = b2;
    b2.prev = bp;

    return b2;
}

// create a node and optionally link it with previous one (in a circular doubly linked list)
function insertNode(i, x, y, last) {
    var p = new Node(i, x, y);

    if (!last) {
        p.prev = p;
        p.next = p;

    } else {
        p.next = last.next;
        p.prev = last;
        last.next.prev = p;
        last.next = p;
    }
    return p;
}

function removeNode(p) {
    p.next.prev = p.prev;
    p.prev.next = p.next;

    if (p.prevZ) p.prevZ.nextZ = p.nextZ;
    if (p.nextZ) p.nextZ.prevZ = p.prevZ;
}

function Node(i, x, y) {
    // vertice index in coordinates array
    this.i = i;

    // vertex coordinates
    this.x = x;
    this.y = y;

    // previous and next vertice nodes in a polygon ring
    this.prev = null;
    this.next = null;

    // z-order curve value
    this.z = null;

    // previous and next nodes in z-order
    this.prevZ = null;
    this.nextZ = null;

    // indicates whether this is a steiner point
    this.steiner = false;
}

// return a percentage difference between the polygon area and its triangulation area;
// used to verify correctness of triangulation
earcut.deviation = function (data, holeIndices, dim, triangles) {
    var hasHoles = holeIndices && holeIndices.length;
    var outerLen = hasHoles ? holeIndices[0] * dim : data.length;

    var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
    if (hasHoles) {
        for (var i = 0, len = holeIndices.length; i < len; i++) {
            var start = holeIndices[i] * dim;
            var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
            polygonArea -= Math.abs(signedArea(data, start, end, dim));
        }
    }

    var trianglesArea = 0;
    for (i = 0; i < triangles.length; i += 3) {
        var a = triangles[i] * dim;
        var b = triangles[i + 1] * dim;
        var c = triangles[i + 2] * dim;
        trianglesArea += Math.abs(
            (data[a] - data[c]) * (data[b + 1] - data[a + 1]) -
            (data[a] - data[b]) * (data[c + 1] - data[a + 1]));
    }

    return polygonArea === 0 && trianglesArea === 0 ? 0 :
        Math.abs((trianglesArea - polygonArea) / polygonArea);
};

function signedArea(data, start, end, dim) {
    var sum = 0;
    for (var i = start, j = end - dim; i < end; i += dim) {
        sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
        j = i;
    }
    return sum;
}

// turn a polygon in a multi-dimensional array form (e.g. as in GeoJSON) into a form Earcut accepts
earcut.flatten = function (data) {
    var dim = data[0][0].length,
        result = {vertices: [], holes: [], dimensions: dim},
        holeIndex = 0;

    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            for (var d = 0; d < dim; d++) result.vertices.push(data[i][j][d]);
        }
        if (i > 0) {
            holeIndex += data[i - 1].length;
            result.holes.push(holeIndex);
        }
    }
    return result;
};

function buildPoly(graphicsData, webGLData) {
    graphicsData.points = graphicsData.shape.points.slice();

    var points = graphicsData.points;

    if (graphicsData.hasFill() && graphicsData.fillAlpha && points.length >= 6) {
        var holeArray = [];
        var holes = graphicsData.holes;

        for (var i = 0; i < holes.length; i++) {
            var hole = holes[i];

            holeArray.push(points.length / 2);

            points = points.concat(hole.points);
        }

        var verts = webGLData.points;
        var indices = webGLData.indices;

        var length = points.length / 2;

        var color = hex2rgb(graphicsData.fillStyle);
        var alpha = graphicsData.fillAlpha;
        var r = color[0] * alpha;
        var g = color[1] * alpha;
        var b = color[2] * alpha;

        var triangles = earcut_1(points, holeArray, 2);

        if (!triangles) {
            return;
        }

        var vertPos = verts.length / 6;

        for (var _i = 0; _i < triangles.length; _i += 3) {
            indices.push(triangles[_i] + vertPos);
            indices.push(triangles[_i] + vertPos);
            indices.push(triangles[_i + 1] + vertPos);
            indices.push(triangles[_i + 2] + vertPos);
            indices.push(triangles[_i + 2] + vertPos);
        }

        for (var _i2 = 0; _i2 < length; _i2++) {
            verts.push(points[_i2 * 2], points[_i2 * 2 + 1], r, g, b, alpha);
        }
    }

    if (graphicsData.hasLine() && graphicsData.lineAlpha) {
        buildLine(graphicsData, webGLData);
    }
}

function buildRectangle(graphicsData, webGLData) {

    var rectData = graphicsData.shape;
    var x = rectData.x;
    var y = rectData.y;
    var width = rectData.width;
    var height = rectData.height;

    if (graphicsData.hasFill() && graphicsData.fillAlpha) {
        var color = hex2rgb(graphicsData.fillStyle);
        var alpha = graphicsData.fillAlpha;

        var r = color[0] * alpha;
        var g = color[1] * alpha;
        var b = color[2] * alpha;

        var verts = webGLData.points;
        var indices = webGLData.indices;

        var vertPos = verts.length / 6;

        // start
        verts.push(x, y);
        verts.push(r, g, b, alpha);

        verts.push(x + width, y);
        verts.push(r, g, b, alpha);

        verts.push(x, y + height);
        verts.push(r, g, b, alpha);

        verts.push(x + width, y + height);
        verts.push(r, g, b, alpha);

        // insert 2 dead triangles..
        indices.push(vertPos, vertPos, vertPos + 1, vertPos + 2, vertPos + 3, vertPos + 3);
    }

    if (graphicsData.hasLine() && graphicsData.lineAlpha) {
        var tempPoints = graphicsData.points;

        graphicsData.points = [x, y, x + width, y, x + width, y + height, x, y + height, x, y];

        buildLine(graphicsData, webGLData);

        graphicsData.points = tempPoints;
    }
}

function buildCircle(graphicsData, webGLData) {

    var circleData = graphicsData.shape;
    var x = circleData.x;
    var y = circleData.y;
    var width = void 0;
    var height = void 0;

    if (graphicsData.type === SHAPES.CIRC) {
        width = circleData.radius;
        height = circleData.radius;
    } else {
        width = circleData.width;
        height = circleData.height;
    }

    var totalSegs = Math.floor(30 * Math.sqrt(circleData.radius)) || Math.floor(15 * Math.sqrt(circleData.width + circleData.height));

    var seg = Math.PI * 2 / totalSegs;

    if (graphicsData.hasFill() && graphicsData.fillAlpha) {
        var color = hex2rgb(graphicsData.fillStyle);
        var alpha = graphicsData.fillAlpha;

        var r = color[0] * alpha;
        var g = color[1] * alpha;
        var b = color[2] * alpha;

        var verts = webGLData.points;
        var indices = webGLData.indices;

        var vecPos = verts.length / 6;

        indices.push(vecPos);

        for (var i = 0; i < totalSegs + 1; i++) {
            verts.push(x, y, r, g, b, alpha);

            verts.push(x + Math.sin(seg * i) * width, y + Math.cos(seg * i) * height, r, g, b, alpha);

            indices.push(vecPos++, vecPos++);
        }

        indices.push(vecPos - 1);
    }

    if (graphicsData.hasLine() && graphicsData.lineAlpha) {
        var tempPoints = graphicsData.points;

        graphicsData.points = [];

        for (var _i = 0; _i < totalSegs + 1; _i++) {
            graphicsData.points.push(x + Math.sin(seg * _i) * width, y + Math.cos(seg * _i) * height);
        }

        buildLine(graphicsData, webGLData);

        graphicsData.points = tempPoints;
    }
}

var GraphicsRenderer = function () {
    function GraphicsRenderer(renderer) {
        classCallCheck(this, GraphicsRenderer);

        this.renderer = renderer;
        this.graphicsDataPool = [];
        this.primitiveShader = null;
        this.gl = renderer.gl;
        this.CONTEXT_UID = 0;
    }

    createClass(GraphicsRenderer, [{
        key: 'onContextChange',
        value: function onContextChange() {
            this.gl = this.renderer.gl;
            this.CONTEXT_UID = this.renderer.CONTEXT_UID;
            this.primitiveShader = new PrimitiveShader(this.gl);
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.renderer = null;

            for (var i = 0; i < this.graphicsDataPool.length; ++i) {
                this.graphicsDataPool[i].destroy();
            }

            this.graphicsDataPool = null;
        }
    }, {
        key: 'render',
        value: function render(displayObject, stage) {
            var renderer = this.renderer;
            var gl = renderer.gl;
            var graphics = displayObject.graphics;

            var webGLData = void 0;
            var webGL = graphics._webGL[this.CONTEXT_UID];

            if (!webGL || graphics.dirty !== webGL.dirty) {
                this.updateGraphics(graphics);

                webGL = graphics._webGL[this.CONTEXT_UID];
            }

            var shader = this.primitiveShader;

            renderer.bindShader(shader);

            for (var i = 0, n = webGL.data.length; i < n; i++) {
                webGLData = webGL.data[i];
                var shaderTemp = webGLData.shader;

                renderer.bindShader(shaderTemp);

                shaderTemp.uniforms.translationMatrix = displayObject.worldTransform.toArray(true);
                shaderTemp.uniforms.tint = hex2rgb(graphics.tint);
                shaderTemp.uniforms.alpha = graphics.worldAlpha;

                renderer.bindVao(webGLData.vao);
                webGLData.vao.draw(gl.TRIANGLE_STRIP, webGLData.indices.length);
            }
        }
    }, {
        key: 'updateGraphics',
        value: function updateGraphics(graphics) {
            var gl = this.renderer.gl;

            var webGL = graphics._webGL[this.CONTEXT_UID];

            if (!webGL) {
                webGL = graphics._webGL[this.CONTEXT_UID] = { lastIndex: 0, data: [], gl: gl, clearDirty: -1, dirty: -1 };
            }

            webGL.dirty = graphics.dirty;

            if (graphics.clearDirty !== webGL.clearDirty) {
                webGL.clearDirty = graphics.clearDirty;

                for (var i = 0; i < webGL.data.length; i++) {
                    this.graphicsDataPool.push(webGL.data[i]);
                }

                webGL.data.length = 0;
                webGL.lastIndex = 0;
            }

            var webGLData = void 0;

            for (var _i = webGL.lastIndex; _i < graphics.graphicsData.length; _i++) {
                var data = graphics.graphicsData[_i];

                webGLData = this.getWebGLData(webGL, 0);

                if (data.type === SHAPES.POLY) {
                    buildPoly(data, webGLData);
                }
                if (data.type === SHAPES.RECT) {
                    buildRectangle(data, webGLData);
                } else if (data.type === SHAPES.CIRC || data.type === SHAPES.ELIP) {
                    buildCircle(data, webGLData);
                }

                webGL.lastIndex++;
            }

            this.renderer.bindVao(null);

            for (var _i2 = 0; _i2 < webGL.data.length; _i2++) {
                webGLData = webGL.data[_i2];

                if (webGLData.dirty) {
                    webGLData.upload();
                }
            }
        }
    }, {
        key: 'getWebGLData',
        value: function getWebGLData(gl, type) {
            var webGLData = gl.data[gl.data.length - 1];

            if (!webGLData || webGLData.points.length > 320000) {
                webGLData = this.graphicsDataPool.pop() || new WebGLGraphicsData(this.renderer.gl, this.primitiveShader, this.renderer.state.attribsState);

                webGLData.reset(type);
                gl.data.push(webGLData);
            }

            webGLData.dirty = true;

            return webGLData;
        }
    }]);
    return GraphicsRenderer;
}();

var CONTEXT_UID = 0;

var WebGLStageRenderer = function () {
    function WebGLStageRenderer(stage, app) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        classCallCheck(this, WebGLStageRenderer);

        this.type = RENDERER_TYPE.WEBGL;
        this.width = app.width;
        this.height = app.height;
        this.canvas = stage.canvas;

        /*
        * WebGL程序必须有一个用于处理上下文丢失（Lost Context）的机制
        * 导致上下文丢失的原因：
        * 移动设备电力不足
        * 其他外因导致GPU重置
        * 当浏览器标签页处于后台时，浏览器抛弃了上下文
        * 耗费资源过多，浏览器抛弃了上下文
        */
        this.handleContextLost = this.handleContextLost.bind(this);
        this.handleContextRestored = this.handleContextRestored.bind(this);
        this.canvas.addEventListener('webglcontextlost', this.handleContextLost, false);
        this.canvas.addEventListener('webglcontextrestored', this.handleContextRestored, false);

        this._backgroundColorRgba = [0, 0, 0, 0];

        this._contextOptions = {
            alpha: options.transparent,
            antialias: options.antialias,
            premultipliedAlpha: options.transparent && options.transparent !== 'notMultiplied',
            stencil: true,
            preserveDrawingBuffer: options.preserveDrawingBuffer
        };

        this.gl = options.context || index$1$1.createContext(this.canvas, this._contextOptions);

        this.CONTEXT_UID = CONTEXT_UID++;

        this.state = new WebGLState(this.gl);

        this._activeShader = null;

        this._activeVao = null;

        this._activeRenderTarget = null;

        this.drawModes = this.mapWebGLDrawModes();

        this.webglGR = new GraphicsRenderer(this);

        this._initContext();
    }

    createClass(WebGLStageRenderer, [{
        key: '_initContext',
        value: function _initContext() {
            var gl = this.gl;

            // restore a context if it was previously lost
            if (gl.isContextLost() && gl.getExtension('WEBGL_lose_context')) {
                gl.getExtension('WEBGL_lose_context').restoreContext();
            }

            this.state.resetToDefault();

            this.rootRenderTarget = new RenderTarget(gl, this.width, this.height, settings.RESOLUTION, true);
            this.rootRenderTarget.clearColor = this._backgroundColorRgba;

            this.bindRenderTarget(this.rootRenderTarget);

            this.webglGR.onContextChange();
        }
    }, {
        key: 'render',
        value: function render(displayObject, stage) {
            if (!this.gl || this.gl.isContextLost()) {
                return;
            }

            this.webglGR.render(displayObject, stage);
        }
    }, {
        key: 'resize',
        value: function resize(width, height) {
            this.rootRenderTarget.resize(width, height);
            if (this._activeRenderTarget === this.rootRenderTarget) {
                this.rootRenderTarget.activate();

                if (this._activeShader) {
                    this._activeShader.uniforms.projectionMatrix = this.rootRenderTarget.projectionMatrix.toArray(true);
                }
            }
        }
    }, {
        key: 'clear',
        value: function clear(clearColor) {
            this._activeRenderTarget.clear(clearColor);
        }
    }, {
        key: 'bindRenderTarget',
        value: function bindRenderTarget(renderTarget) {
            if (renderTarget !== this._activeRenderTarget) {
                this._activeRenderTarget = renderTarget;
                renderTarget.activate();

                if (this._activeShader) {
                    this._activeShader.uniforms.projectionMatrix = renderTarget.projectionMatrix.toArray(true);
                }
            }
            return this;
        }
    }, {
        key: 'bindShader',
        value: function bindShader(shader) {
            if (this._activeShader !== shader) {
                this._activeShader = shader;
                shader.bind();
                shader.uniforms.projectionMatrix = this._activeRenderTarget.projectionMatrix.toArray(true);
            }

            return this;
        }
    }, {
        key: 'createVao',
        value: function createVao() {
            return new index$1$1.VertexArrayObject(this.gl, this.state.attribState);
        }
    }, {
        key: 'bindVao',
        value: function bindVao(vao) {
            if (this._activeVao === vao) {
                return this;
            }

            if (vao) {
                vao.bind();
            } else if (this._activeVao) {
                this._activeVao.unbind();
            }

            this._activeVao = vao;

            return this;
        }
    }, {
        key: 'reset',
        value: function reset() {
            this._activeShader = null;
            this._activeRenderTarget = this.rootRenderTarget;

            this.rootRenderTarget.activate();

            this.state.resetToDefault();

            return this;
        }
    }, {
        key: 'handleContextLost',
        value: function handleContextLost(event) {
            event.preventDefault();
        }
    }, {
        key: 'handleContextRestored',
        value: function handleContextRestored() {
            this._initContext();
            this.textureManager.removeAll();
        }
    }, {
        key: 'mapWebGLDrawModes',
        value: function mapWebGLDrawModes() {
            var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            object[DRAW_MODES.POINTS] = this.gl.POINTS;
            object[DRAW_MODES.LINES] = this.gl.LINES;
            object[DRAW_MODES.LINE_LOOP] = this.gl.LINE_LOOP;
            object[DRAW_MODES.LINE_STRIP] = this.gl.LINE_STRIP;
            object[DRAW_MODES.TRIANGLES] = this.gl.TRIANGLES;
            object[DRAW_MODES.TRIANGLE_STRIP] = this.gl.TRIANGLE_STRIP;
            object[DRAW_MODES.TRIANGLE_FAN] = this.gl.TRIANGLE_FAN;

            return object;
        }
    }, {
        key: 'destroy',
        value: function destroy(removeView) {
            this.destroyPlugins();

            this.canvas.removeEventListener('webglcontextlost', this.handleContextLost);
            this.canvas.removeEventListener('webglcontextrestored', this.handleContextRestored);

            get(WebGLStageRenderer.prototype.__proto__ || Object.getPrototypeOf(WebGLStageRenderer.prototype), 'destroy', this).call(this, removeView);

            this.uid = 0;

            this.handleContextLost = null;
            this.handleContextRestored = null;

            this._contextOptions = null;
            this.gl.useProgram(null);

            if (this.gl.getExtension('WEBGL_lose_context')) {
                this.gl.getExtension('WEBGL_lose_context').loseContext();
            }

            this.gl = null;
        }
    }]);
    return WebGLStageRenderer;
}();

var WebGLRenderer = function (_SystemRenderer) {
    inherits(WebGLRenderer, _SystemRenderer);

    function WebGLRenderer(app) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        classCallCheck(this, WebGLRenderer);
        return possibleConstructorReturn(this, (WebGLRenderer.__proto__ || Object.getPrototypeOf(WebGLRenderer)).call(this, RENDERER_TYPE.CANVAS, app, options));
    }

    createClass(WebGLRenderer, [{
        key: 'render',
        value: function render(app) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var me = this;

            me.app = app;
            _$1.extend(this.options, options);

            _$1.each(_$1.values(app.convertStages), function (convertStage) {
                me.renderStage(convertStage.stage);
            });

            app.convertStages = {};
        }
    }, {
        key: 'renderStage',
        value: function renderStage(stage) {
            if (!stage.webGLStageRenderer) {
                stage.webGLStageRenderer = new WebGLStageRenderer(stage, app, this.options);
            }
            stage.stageRending = true;
            this._clear(stage);
            this._render(stage);
            stage.stageRending = false;
        }
    }, {
        key: '_render',
        value: function _render(stage, displayObject) {
            if (!displayObject) {
                displayObject = stage;
            }

            if (displayObject.graphics) {
                if (!displayObject.context.$model.visible || displayObject.context.$model.globalAlpha <= 0) {
                    return;
                }

                if (!displayObject.graphics.graphicsData.length) {
                    displayObject._draw(displayObject.graphics);
                }

                stage.webGLStageRenderer.render(displayObject, stage);
            }

            if (displayObject.children) {
                for (var i = 0, len = displayObject.children.length; i < len; i++) {
                    this._render(stage, displayObject.children[i]);
                }
            }
        }
    }, {
        key: '_clear',
        value: function _clear(stage) {
            stage.webGLStageRenderer.clear();
        }
    }]);
    return WebGLRenderer;
}(SystemRenderer);

function autoRenderer(app, options) {
    if (app.webGL && Utils.isWebGLSupported()) {
        return new WebGLRenderer(app, options);
    }
    return new CanvasRenderer(app, options);
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

        _this.el = $$1.query(opt.el);

        _this.width = parseInt("width" in opt || _this.el.offsetWidth, 10);
        _this.height = parseInt("height" in opt || _this.el.offsetHeight, 10);

        var viewObj = $$1.createView(_this.width, _this.height, _this._cid);
        _this.view = viewObj.view;
        _this.stageView = viewObj.stageView;
        _this.domView = viewObj.domView;

        _this.el.innerHTML = "";
        _this.el.appendChild(_this.view);

        _this.viewOffset = $$1.offset(_this.view);
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

            this.viewOffset = $$1.offset(this.view);
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
            _$1.each(this.children, function (s, i) {
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
            var _pixelCanvas = $$1.query("_pixelCanvas");
            if (!_pixelCanvas) {
                _pixelCanvas = $$1.createCanvas(0, 0, "_pixelCanvas");
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
                this.viewOffset = $$1.offset(this.view);
                this.lastGetRO = now;
            }
        }
    }, {
        key: "_afterAddChild",
        value: function _afterAddChild(stage, index) {
            var canvas;

            if (!stage.canvas) {
                canvas = $$1.createCanvas(this.context.$model.width, this.context.$model.height, stage.id);
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

            _$1.each(this.children, function (stage) {
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
                _$1.each(this.graphicsData, function (gd, i) {
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

        var _context = _$1.extend(true, styleContext, opt.context);
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
            if (_$1.indexOf(STYLE_PROPS, name) > -1) {
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

        opt.context = _$1.extend({
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
            if (_$1.indexOf(this.fontProperts, name) >= 0) {
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
                    if (style[p] || _$1.isNumber(style[p])) {
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

            _$1.each(this.fontProperts, function (p) {
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
    if (arguments.length == 1 && _$1.isObject(x)) {
        var arg = arguments[0];
        if (_$1.isArray(arg)) {
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

        _$1.isFunction(smoothFilter) && smoothFilter(rp);

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

        var _context = _$1.extend({
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

        opt = _$1.extend(true, {
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


        var _context = _$1.extend({
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
            var paths = _$1.compact(data.replace(/[Mm]/g, "\\r$&").split('\\r'));
            var me = this;
            _$1.each(paths, function (pathStr) {
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

        opt = _$1.extend({
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

        opt = _$1.extend({
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

        var _context = _$1.extend({
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

        var _context = _$1.extend({
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

        var _context = _$1.extend({
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

        var _context = _$1.extend({
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

        var _context = _$1.extend({
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

            if (startAngle != endAngle && Math.abs(startAngle - endAngle) % 360 == 0) {
                //if( startAngle == endAngle && model.startAngle != model.endAngle ) {
                //如果两个角度相等，那么就认为是个圆环了
                this.isRing = true;
                startAngle = 0;
                endAngle = 360;
            }

            startAngle = myMath.degreeToRadian(startAngle);
            endAngle = myMath.degreeToRadian(endAngle);

            //处理下极小夹角的情况
            if (endAngle - startAngle < 0.025) {
                startAngle -= 0.003;
            }

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

var canvax = Canvax;

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule$1(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

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
}.call(commonjsGlobal));
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
        for (_i = 0, _len = sharedObjectKeys.length; _i < _len; _i++) {
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
        for (_j = 0, _len1 = sharedArrayKeys.length; _j < _len1; _j++) {
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

        var _this = possibleConstructorReturn$1(this, (Chart.__proto__ || Object.getPrototypeOf(Chart)).call(this));

        _this.Canvax = canvax;

        _this.el = getEl(node); //chart 在页面里面的容器节点，也就是要把这个chart放在哪个节点里
        _this.width = parseInt(_this.el.offsetWidth); //图表区域宽
        _this.height = parseInt(_this.el.offsetHeight); //图表区域高

        _this.padding = {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10

            //Canvax实例
        };_this.canvax = new canvax.App({
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
        return _this;
    }

    createClass$1(Chart, [{
        key: "getPlug",
        value: function getPlug(type, id) {
            var obj = underscore.find(this.plugs, function (plug) {
                if (id != undefined) {
                    return plug.type == type && plug.id == id;
                } else {
                    return plug.type == type;
                }
            });
            if (obj) {
                return obj.plug;
            }
        }
    }, {
        key: "removePlug",
        value: function removePlug(plug) {
            this.plugs.splice(underscore.indexOf(this.plugs, plug), 1);
        }
    }, {
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
         * reset有两种情况，一是 data 数据源改变， 一个options的参数配置改变。
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
    }]);
    return Chart;
}(canvax.Event.EventDispatcher);

var component = function () {
    function component(opt, data) {
        classCallCheck$1(this, component);

        this.enabled = false; //是否加载该组件
        this.display = true; //该组件是否显示，不显示的话就不占据物理空间
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
}();

var tips = function (_Component) {
    inherits$1(tips, _Component);

    function tips(opt, tipDomContainer) {
        classCallCheck$1(this, tips);

        var _this = possibleConstructorReturn$1(this, (tips.__proto__ || Object.getPrototypeOf(tips)).call(this));

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

    createClass$1(tips, [{
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

            this.tipDomContainer.appendChild(this._tipDom);
            this._setContent(e);

            this._tipDom.addEventListener("mouseover", function (e) {
                //console.log("tips-mouseover:"+e.fromTarget)
            });
            this._tipDom.addEventListener("mousemove", function (e) {
                console.log("tips-mousemove+++targetId:" + e.target.id + "-====currentTargetId" + e.currentTarget.id);
            });
            this._tipDom.addEventListener("mouseout", function (e) {
                console.log("tips-mouseout");
            });
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
                str += "<td " + tsStyle + ">" + Tools.numAddSymbol(node.value) + "</td></tr>";
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
    return tips;
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
        this._tip = null; //tip的对象 tip的config 放到graphs的config中传递过来
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

            this._tip = new tips(this.tips, this.domContainer);
            this._tip._getDefaultContent = this._getTipDefaultContent;
            this.sprite.addChild(this._tip.sprite);
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
                onUpdate: function onUpdate() {
                    for (var i = 0; i < self.sectors.length; i++) {
                        var sec = self.sectors[i];
                        var secc = sec.context;
                        if (secc) {
                            secc.r = this.r;
                            secc.r0 = this.r0;
                            secc.globalAlpha = this.process;
                            if (i == 0) {
                                secc.startAngle = sec.startAngle;
                                secc.endAngle = sec.startAngle + (sec.endAngle - sec.startAngle) * this.process;
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
                                secc.endAngle = secc.startAngle + (sec.endAngle - sec.startAngle) * this.process;
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
            this._tip.show(this._geteventInfo(e, ind));
        }
    }, {
        key: "_hideTip",
        value: function _hideTip(e) {
            this._tip.hide(e);
        }
    }, {
        key: "_moveTip",
        value: function _moveTip(e, ind) {
            this._tip.move(this._geteventInfo(e, ind));
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

            for (i = 0; i < quadrantsOrder.length; i++) {
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

var _class$1 = function (_Component) {
    inherits$1(_class, _Component);

    function _class(data, opt) {
        classCallCheck$1(this, _class);

        var _this = possibleConstructorReturn$1(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this));

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

        //this.label = null; //label格式化函数配置

        _this.layoutType = "h"; //横向 horizontal--> h

        _this.sprite = null;

        _this.init(opt);
        return _this;
    }

    createClass$1(_class, [{
        key: "init",
        value: function init(opt) {
            if (opt) {
                _.deepExtend(this, opt);
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
                this._tips = new tips(this.tips, stage.parent.getDomContainer());
                this._tips._getDefaultContent = function (info) {
                    return info.field;
                };
                this._legendTip.addChild(this._tips.sprite);
            }
            this._tips.show(e);
        }
    }, {
        key: "_hide",
        value: function _hide(e) {
            var me = this;
            this._hideTimer = setTimeout(function () {
                me._tips.hide();
            }, 300);
        }

        //label格式化函数配置

    }, {
        key: "label",
        value: function label(info) {
            return info.field + "：" + info.value;
        }
    }, {
        key: "setStyle",
        value: function setStyle(field, style) {
            var me = this;
            _.each(this.data, function (obj, i) {
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
            _.each(this.data, function (obj, i) {
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
            _.each(this.data, function (obj, i) {

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
                    me._hide(e);
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
                    me._hide(e);
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
                    if (_.filter(me.data, function (obj) {
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
            if (data.value) {
                e.eventInfo.value = data.value;
            }
            return e;
        }
    }]);
    return _class;
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
                for (i = 0; i < dataFrame.data.length; i++) {
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
            this._legend = new _class$1(this._getLegendData(), legendOpt);
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

var Chartx = {
    Pie: _class
};

return Chartx;

}());
