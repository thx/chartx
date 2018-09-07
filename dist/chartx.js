var Chartx = (function () {
	'use strict';

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

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

	var _$1 = {};
	var breaker = {};
	var ArrayProto = Array.prototype;
	var ObjProto = Object.prototype;

	// Create quick reference variables for speed access to core prototypes.
	var push = ArrayProto.push;
	var slice = ArrayProto.slice;
	var concat = ArrayProto.concat;
	var toString = ObjProto.toString;
	var hasOwnProperty = ObjProto.hasOwnProperty;

	// All **ECMAScript 5** native function implementations that we hope to use
	// are declared here.
	var nativeForEach = ArrayProto.forEach;
	var nativeMap = ArrayProto.map;
	var nativeFilter = ArrayProto.filter;
	var nativeEvery = ArrayProto.every;
	var nativeSome = ArrayProto.some;
	var nativeIndexOf = ArrayProto.indexOf;
	var nativeIsArray = Array.isArray;
	var nativeKeys = Object.keys;

	var shallowProperty = function shallowProperty(key) {
	  return function (obj) {
	    return obj == null ? void 0 : obj[key];
	  };
	};
	var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
	var getLength = shallowProperty('length');
	var isArrayLike = function isArrayLike(collection) {
	  var length = getLength(collection);
	  return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
	};

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

	//if (!_.isArguments(arguments)) {
	_$1.isArguments = function (obj) {
	  return !!(obj && _$1.has(obj, 'callee'));
	};
	//}

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

	// Internal implementation of a recursive `flatten` function.
	var flatten = function flatten(input, shallow, output) {
	  if (shallow && _$1.every(input, _$1.isArray)) {
	    return concat.apply(output, input);
	  }
	  each(input, function (value) {
	    if (_$1.isArray(value) || _$1.isArguments(value)) {
	      shallow ? push.apply(output, value) : flatten(value, shallow, output);
	    } else {
	      output.push(value);
	    }
	  });
	  return output;
	};

	// Flatten out an array, either recursively (by default), or just one level.
	_$1.flatten = function (array, shallow) {
	  return flatten(array, shallow, []);
	};

	_$1.every = _$1.all = function (obj, iterator, context) {
	  iterator || (iterator = _$1.identity);
	  var result = true;
	  if (obj == null) return result;
	  if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
	  each(obj, function (value, index, list) {
	    if (!(result = result && iterator.call(context, value, index, list))) return breaker;
	  });
	  return !!result;
	};

	// Return the minimum element (or element-based computation).
	_$1.min = function (obj, iterator, context) {
	  if (!iterator && _$1.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
	    return Math.min.apply(Math, obj);
	  }
	  if (!iterator && _$1.isEmpty(obj)) return Infinity;
	  var result = { computed: Infinity, value: Infinity };
	  each(obj, function (value, index, list) {
	    var computed = iterator ? iterator.call(context, value, index, list) : value;
	    computed < result.computed && (result = { value: value, computed: computed });
	  });
	  return result.value;
	};
	// Return the maximum element or (element-based computation).
	// Can't optimize arrays of integers longer than 65,535 elements.
	// See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
	_$1.max = function (obj, iterator, context) {
	  if (!iterator && _$1.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
	    return Math.max.apply(Math, obj);
	  }
	  if (!iterator && _$1.isEmpty(obj)) return -Infinity;
	  var result = { computed: -Infinity, value: -Infinity };
	  each(obj, function (value, index, list) {
	    var computed = iterator ? iterator.call(context, value, index, list) : value;
	    computed > result.computed && (result = { value: value, computed: computed });
	  });
	  return result.value;
	};

	// Return the first value which passes a truth test. Aliased as `detect`.
	_$1.find = _$1.detect = function (obj, iterator, context) {
	  var result;
	  any(obj, function (value, index, list) {
	    if (iterator.call(context, value, index, list)) {
	      result = value;
	      return true;
	    }
	  });
	  return result;
	};
	// Determine if at least one element in the object matches a truth test.
	// Delegates to **ECMAScript 5**'s native `some` if available.
	// Aliased as `any`.
	var any = _$1.some = _$1.any = function (obj, iterator, context) {
	  iterator || (iterator = _$1.identity);
	  var result = false;
	  if (obj == null) return result;
	  if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
	  each(obj, function (value, index, list) {
	    if (result || (result = iterator.call(context, value, index, list))) return breaker;
	  });
	  return !!result;
	};
	// Return a version of the array that does not contain the specified value(s).
	_$1.without = function (array) {
	  return _$1.difference(array, slice.call(arguments, 1));
	};
	// Take the difference between one array and a number of other arrays.
	// Only the elements present in just the first array will remain.
	_$1.difference = function (array) {
	  var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
	  return _$1.filter(array, function (value) {
	    return !_$1.contains(rest, value);
	  });
	};
	// Produce a duplicate-free version of the array. If the array has already
	// been sorted, you have the option of using a faster algorithm.
	// Aliased as `unique`.
	_$1.uniq = _$1.unique = function (array, isSorted, iterator, context) {
	  if (_$1.isFunction(isSorted)) {
	    context = iterator;
	    iterator = isSorted;
	    isSorted = false;
	  }
	  var initial = iterator ? _$1.map(array, iterator, context) : array;
	  var results = [];
	  var seen = [];
	  each(initial, function (value, index) {
	    if (isSorted ? !index || seen[seen.length - 1] !== value : !_$1.contains(seen, value)) {
	      seen.push(value);
	      results.push(array[index]);
	    }
	  });
	  return results;
	};
	// Return the results of applying the iterator to each element.
	// Delegates to **ECMAScript 5**'s native `map` if available.
	_$1.map = _$1.collect = function (obj, iterator, context) {
	  var results = [];
	  if (obj == null) return results;
	  if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
	  each(obj, function (value, index, list) {
	    results.push(iterator.call(context, value, index, list));
	  });
	  return results;
	};
	// Determine if the array or object contains a given value (using `===`).
	// Aliased as `include`.
	_$1.contains = _$1.include = function (obj, target) {
	  if (obj == null) return false;
	  if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
	  return any(obj, function (value) {
	    return value === target;
	  });
	};

	// Convenience version of a common use case of `map`: fetching a property.
	_$1.pluck = function (obj, key) {
	  return _$1.map(obj, function (value) {
	    return value[key];
	  });
	};

	// Return a random integer between min and max (inclusive).
	_$1.random = function (min, max) {
	  if (max == null) {
	    max = min;
	    min = 0;
	  }
	  return min + Math.floor(Math.random() * (max - min + 1));
	};

	// Shuffle a collection.
	_$1.shuffle = function (obj) {
	  return _$1.sample(obj, Infinity);
	};

	_$1.sample = function (obj, n, guard) {
	  if (n == null || guard) {
	    if (!isArrayLike(obj)) obj = _$1.values(obj);
	    return obj[_$1.random(obj.length - 1)];
	  }
	  var sample = isArrayLike(obj) ? _$1.clone(obj) : _$1.values(obj);
	  var length = getLength(sample);
	  n = Math.max(Math.min(n, length), 0);
	  var last = length - 1;
	  for (var index = 0; index < n; index++) {
	    var rand = _$1.random(index, last);
	    var temp = sample[index];
	    sample[index] = sample[rand];
	    sample[rand] = temp;
	  }
	  return sample.slice(0, n);
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

	        //if( deep && copy && _.isObject( copy ) &&  && !_.isArray( copy ) && !_.isFunction( copy ) ){
	        if (deep && copy && _$1.isObject(copy) && copy.constructor === Object) {
	          target[name] = _$1.extend(deep, src, copy);
	        } else {
	          target[name] = copy;
	        }
	      }
	    }
	  }
	  return target;
	};

	_$1.clone = function (obj) {
	  if (!_$1.isObject(obj)) return obj;
	  return _$1.isArray(obj) ? obj.slice() : _$1.extend(true, {}, obj);
	};

	var settings = {
	  //设备分辨率
	  RESOLUTION: window.devicePixelRatio || 1,

	  /**
	   * Target frames per millisecond.
	   */
	  TARGET_FPMS: 0.06,

	  /**
	   * If set to true WebGL will attempt make textures mimpaped by default.
	   * Mipmapping will only succeed if the base texture uploaded has power of two dimensions.
	   */
	  MIPMAP_TEXTURES: true,

	  /**
	   * Default filter resolution.
	   */
	  FILTER_RESOLUTION: 1,

	  // TODO: maybe change to SPRITE.BATCH_SIZE: 2000
	  // TODO: maybe add PARTICLE.BATCH_SIZE: 15000

	  /**
	   * The default sprite batch size.
	   *
	   * The default aims to balance desktop and mobile devices.
	   */
	  SPRITE_BATCH_SIZE: 4096,

	  /**
	   * The prefix that denotes a URL is for a retina asset.
	   */
	  RETINA_PREFIX: /@(.+)x/,

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

	  TRANSFORM_MODE: 0,

	  GC_MODE: 0,

	  GC_MAX_IDLE: 60 * 60,

	  GC_MAX_CHECK_COUNT: 60 * 10,

	  WRAP_MODE: 0,

	  SCALE_MODE: 0,

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
	        view.style.cssText += "position:relative;width:100%;height:100%;";

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
	 * @author 释剑 (李涛, litao.lt@alibaba-inc.com 
	*/
	var Utils = {
	    mainFrameRate: 60, //默认主帧率
	    now: 0,
	    /*给文本检测高宽专用*/
	    _pixelCtx: null,
	    __emptyFunc: function __emptyFunc() {},
	    //retina 屏幕优化
	    _devicePixelRatio: window.devicePixelRatio || 1,
	    _UID: 0, //该值为向上的自增长整数值
	    getUID: function getUID() {
	        return this._UID++;
	    },
	    createId: function createId(name) {
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
	        return canvas;
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

	Utils._pixelCtx = Utils.initElement($.createCanvas(1, 1, "_pixelCanvas")).getContext('2d');

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
	                me.__getcurPointsTarget(e, curMousePoint, true);
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
	                    me._dragIngHander(e, curMouseTarget, 0);
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

	    //notInRootView 真正的mouseout,鼠标已经不在图表的节点内了
	    __getcurPointsTarget: function __getcurPointsTarget(e, point, notInRootView) {
	        var me = this;
	        var root = me.canvax;
	        var oldObj = me.curPointsTarget[0];

	        if (oldObj && !oldObj.context) {
	            oldObj = null;
	        }

	        var e = new CanvaxEvent(e);

	        if (e.type == "mousemove" && oldObj && oldObj._hoverClass && oldObj.hoverClone && oldObj.pointChkPriority && oldObj.getChildInPoint(point)) {
	            //小优化,鼠标move的时候。计算频率太大，所以。做此优化
	            //如果有target存在，而且当前元素正在hoverStage中，而且当前鼠标还在target内,就没必要取检测整个displayList了
	            //开发派发常规mousemove事件
	            e.target = e.currentTarget = oldObj;
	            e.point = oldObj.globalToLocal(point);
	            oldObj.dispatchEvent(e);
	            return;
	        }
	        var obj = notInRootView ? null : root.getObjectsUnderPoint(point, 1)[0];

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
	                            me._dragIngHander(e, child, i);
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
	    *第三方库的事件系统------------------------------------------------end
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
	    _dragIngHander: function _dragIngHander(e, target, i) {

	        var me = this;
	        var root = me.canvax;
	        var _point = target.globalToLocal(me.curPoints[i]);

	        //要对应的修改本尊的位置，但是要告诉引擎不要watch这个时候的变化
	        target._noHeart = true;
	        var _moveStage = target.moveing;
	        target.moveing = true;
	        target.context.x += _point.x - target._dragPoint.x;
	        target.context.y += _point.y - target._dragPoint.y;
	        target.fire("draging");
	        target.moveing = _moveStage;
	        target._noHeart = false;
	        //同步完毕本尊的位置

	        //这里只能直接修改_transform 。 不能用下面的修改x，y的方式。
	        var _dragDuplicate = root._bufferStage.getChildById(target.id);
	        _dragDuplicate._transform = target.getConcatenatedMatrix();

	        //worldTransform在renderer的时候计算
	        _dragDuplicate.worldTransform = null;

	        //setWorldTransform都统一在render中执行，这里注释掉
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
	        _dragDuplicate && _dragDuplicate.destroy();

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
	            //{currentTarget,point,target,type,_stopPropagation}
	            var e = new CanvaxEvent(eventType);

	            if (params) {
	                for (var p in params) {
	                    if (p != "type") {
	                        e[p] = params[p];
	                    }
	                    //然后，currentTarget要修正为自己
	                    e.currentTarget = this;
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
	                if (this._hoverClass && this.hoverClone) {
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

	var commonjsGlobal$1 = typeof window !== 'undefined' ? window : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : typeof self !== 'undefined' ? self : {};





	function createCommonjsModule$1(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var Tween = createCommonjsModule$1(function (module, exports) {
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

	})(commonjsGlobal$1);
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
	    destroyTween: destroyTween,
	    Tween: Tween,
	    taskList: _taskList
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
	        if (_$1.indexOf(_Publics, name) === -1) {
	            //非 _Publics 中的值，都要先设置好对应的val到model上
	            model[name] = val;
	        }

	        var valueType = typeof val === "undefined" ? "undefined" : _typeof(val);

	        if (_$1.indexOf(Publics, name) > -1) {
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

	    _$1.forEach(Publics, function (name) {
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

	        _this.clip = null; //裁剪的图形对象

	        //创建好context
	        _this.context = _this._createContext(opt);

	        _this.type = opt.type || "DisplayObject";

	        _this.id = opt.id || Utils.createId(_this.type);

	        _this._trackList = []; //一个元素可以追踪另外元素的变动

	        _this.init.apply(_this, arguments);

	        //所有属性准备好了后，先要计算一次this._updateTransform()得到_tansform
	        _this._updateTransform();
	        return _this;
	    }

	    createClass(DisplayObject, [{
	        key: "init",
	        value: function init() {}
	    }, {
	        key: "clipTo",
	        value: function clipTo(node) {
	            this.clip = node;
	            node.isClip = true;
	        }
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

	                if (!obj.context) {
	                    //如果这个obj的context已经不存在了，那么就什么都不处理，
	                    //TODO:后续还要把自己给destroy 并且要把在 动画队列里面的动画也干掉
	                    return;
	                }

	                if (name == "globalGalpha") {
	                    obj._globalAlphaChange = true;
	                }

	                if (_$1.indexOf(TRANSFORM_PROPS, name) > -1) {
	                    obj._updateTransform();
	                    obj._transformChange = true;
	                }

	                if (obj._notWatch) {
	                    return;
	                }

	                if (obj.$watch) {
	                    //执行的内部$watch的时候必须把_notWatch 设置为true，否则会死循环调用
	                    obj._notWatch = true;
	                    obj.$watch(name, value, preValue);
	                    obj._notWatch = false;
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

	        //TODO:track目前还没测试过,需要的时候再测试

	    }, {
	        key: "track",
	        value: function track(el) {
	            if (_$1.indexOf(this._trackList, el) == -1) {
	                this._trackList.push(el);
	            }
	        }
	    }, {
	        key: "untrack",
	        value: function untrack(el) {
	            var ind = _$1.indexOf(this._trackList, el);
	            if (ind > -1) {
	                this._trackList.splice(ind, 1);
	            }
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
	        key: "setWorldTransform",
	        value: function setWorldTransform() {
	            //if( !this.worldTransform ){
	            var cm = new Matrix();
	            cm.concat(this._transform);
	            this.parent && cm.concat(this.parent.worldTransform);
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

	            if (this.type == "text") {
	                //文本框的先单独处理
	                var _rect = this.getRect();
	                if (!_rect.width || !_rect.height) {
	                    return false;
	                }
	                //正式开始第一步的矩形范围判断
	                if (x >= _rect.x && x <= _rect.x + _rect.width && (_rect.height >= 0 && y >= _rect.y && y <= _rect.y + _rect.height || _rect.height < 0 && y <= _rect.y && y >= _rect.y + _rect.height)) {
	                    //那么就在这个元素的矩形范围内
	                    result = true;
	                } else {
	                    //如果连矩形内都不是，那么肯定的，这个不是我们要找的shap
	                    result = false;
	                }
	                return result;
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
	            if (!context) {
	                //这个时候如果还是找不到context说明这个 el 已经被destroy了
	                return;
	            }

	            var to = toContent;
	            var from = null;
	            for (var p in to) {
	                if (_$1.isObject(to[p])) {

	                    //options必须传递一份copy出去，比如到下一个animate
	                    this.animate(to[p], _$1.extend({}, options), context[p]);
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
	            options.desc = "tweenType:DisplayObject.animate__id:" + this.id + "__objectType:" + this.type;
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

	            //依次销毁所有子元素
	            for (var i = 0, l = this.children.length; i < l; i++) {
	                this.getChildAt(i).destroy();
	                i--;
	                l--;
	            }
	            this._destroy();
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
	                this.app.children.length && self.render(this.app);
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
	        value: function render(displayObject, stage, globalAlpha, isClip) {
	            var renderer = this.renderer;
	            var graphicsData = displayObject.graphics.graphicsData;
	            var ctx = stage.ctx;

	            for (var i = 0; i < graphicsData.length; i++) {
	                var data = graphicsData[i];
	                var shape = data.shape;

	                var fillStyle = data.fillStyle;
	                var strokeStyle = data.strokeStyle;

	                var fill = data.hasFill() && data.fillAlpha && !isClip;
	                var line = data.hasLine() && data.lineAlpha && !isClip;

	                ctx.lineWidth = data.lineWidth;

	                if (data.type === SHAPES.POLY) {
	                    ctx.beginPath();

	                    this.renderPolygon(shape.points, shape.closed, ctx, isClip);

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
	                    if (isClip) {
	                        //ctx.beginPath();
	                        //rect本身已经是个close的path
	                        ctx.rect(shape.x, shape.y, shape.width, shape.height);
	                        //ctx.closePath();
	                    }

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
	        value: function renderPolygon(points, close, ctx, isClip) {
	            ctx.moveTo(points[0], points[1]);

	            for (var j = 1; j < points.length / 2; ++j) {
	                ctx.lineTo(points[j * 2], points[j * 2 + 1]);
	            }

	            if (close || isClip) {
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
	            stage.setWorldTransform();
	            this._clear(stage);
	            this._render(stage, stage, stage.context.globalAlpha);
	            stage.stageRending = false;
	        }
	    }, {
	        key: '_render',
	        value: function _render(stage, displayObject, globalAlpha) {
	            var ctx = stage.ctx;

	            if (!ctx) {
	                return;
	            }

	            var $MC = displayObject.context.$model;

	            if (!displayObject.worldTransform || displayObject._transformChange || displayObject.parent && displayObject.parent._transformChange) {
	                displayObject.setWorldTransform();
	                displayObject._transformChange = true;
	            }

	            globalAlpha *= $MC.globalAlpha;

	            if (!$MC.visible || displayObject.isClip) {
	                return;
	            }

	            ctx.setTransform.apply(ctx, displayObject.worldTransform.toArray());

	            var isClipSave = false;
	            if (displayObject.clip && displayObject.clip.graphics) {
	                //如果这个对象有一个裁剪路径对象，那么就绘制这个裁剪路径
	                var _clip = displayObject.clip;
	                ctx.save();
	                isClipSave = true;

	                if (!_clip.worldTransform || _clip._transformChange || _clip.parent._transformChange) {
	                    _clip.setWorldTransform();
	                    _clip._transformChange = true;
	                }
	                ctx.setTransform.apply(ctx, _clip.worldTransform.toArray());

	                //如果 graphicsData.length==0 的情况下才需要执行_draw来组织graphics数据
	                if (!_clip.graphics.graphicsData.length) {
	                    //当渲染器开始渲染app的时候，app下面的所有displayObject都已经准备好了对应的世界矩阵
	                    _clip._draw(_clip.graphics); //_draw会完成绘制准备好 graphicsData
	                }
	                this.CGR.render(_clip, stage, globalAlpha, isClipSave);

	                _clip._transformChange = false;

	                ctx.clip();
	            }

	            //因为已经采用了setTransform了， 非shape元素已经不需要执行transform 和 render
	            if (displayObject.graphics) {
	                //如果 graphicsData.length==0 的情况下才需要执行_draw来组织graphics数据
	                if (!displayObject.graphics.graphicsData.length) {
	                    //当渲染器开始渲染app的时候，app下面的所有displayObject都已经准备好了对应的世界矩阵
	                    displayObject._draw(displayObject.graphics); //_draw会完成绘制准备好 graphicsData
	                }

	                //globalAlpha == 0 的话，只是不需要render，但是graphics的graphicsData还是要计算的
	                //事件检测的时候需要用到graphics.graphicsData
	                if (!!globalAlpha) {
	                    this.CGR.render(displayObject, stage, globalAlpha);
	                }
	            }

	            if (displayObject.type == "text") {
	                //如果是文本
	                displayObject.render(ctx, globalAlpha);
	            }

	            if (displayObject.children) {
	                for (var i = 0, len = displayObject.children.length; i < len; i++) {
	                    this._render(stage, displayObject.children[i], globalAlpha);
	                }
	            }

	            displayObject._transformChange = false;

	            if (isClipSave) {
	                //如果这个对象有裁剪对象， 则要恢复，裁剪之前的环境
	                ctx.restore();
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
	        key: "destroy",
	        value: function destroy() {
	            for (var i = 0, l = this.children.length; i < l; i++) {
	                var stage = this.children[i];
	                stage.destroy();
	                stage.canvas = null;
	                stage.ctx = null;
	                stage = null;
	                i--, l--;
	            }
	            this.view.removeChild(this.stageView);
	            this.view.removeChild(this.domView);
	            this.el.removeChild(this.view);
	            this.el.innerHTML = "";
	            this.event = null;
	            this._bufferStage = null;
	        }
	    }, {
	        key: "resize",
	        value: function resize(opt) {
	            //重新设置坐标系统 高宽 等。
	            this.width = parseInt(opt && "width" in opt || this.el.offsetWidth, 10);
	            this.height = parseInt(opt && "height" in opt || this.el.offsetHeight, 10);

	            //this.view  width height都一直设置为100%
	            //this.view.style.width  = this.width +"px";
	            //this.view.style.height = this.height+"px";

	            this.viewOffset = $.offset(this.view);
	            this.context.$model.width = this.width;
	            this.context.$model.height = this.height;

	            var me = this;
	            var reSizeCanvas = function reSizeCanvas(canvas) {
	                canvas.style.width = me.width + "px";
	                canvas.style.height = me.height + "px";
	                canvas.setAttribute("width", me.width * Utils._devicePixelRatio);
	                canvas.setAttribute("height", me.height * Utils._devicePixelRatio);
	            };
	            _$1.each(this.children, function (s, i) {
	                s.context.$model.width = me.width;
	                s.context.$model.height = me.height;
	                reSizeCanvas(s.canvas);
	            });

	            this.stageView.style.width = this.width + "px";
	            this.stageView.style.height = this.height + "px";
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
	            var canvas = $.createCanvas(this.width, this.height, "curr_base64_canvas");
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
	            /*
	            if (this.width <= 0 || this.height <= 0)
	            {
	                return false;
	            }
	            */
	            if (this.height * y < 0 || this.width * x < 0) {
	                return false;
	            }

	            if (x >= this.x && x <= this.x + this.width && (this.height >= 0 && y >= this.y && y <= this.y + this.height || this.height < 0 && y <= this.y && y >= this.y + this.height)) {
	                return true;
	            }

	            return false;

	            //当x和 width , y和height都 为正或者都未负数的情况下，才可能在范围内

	            /*
	            if (x >= this.x && x < this.x + this.width)
	            {
	                if (y >= this.y && y < this.y + this.height)
	                {
	                    return true;
	                }
	            }
	            */

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

	            //this.currentPath = null;
	            this.beginPath();

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

	        if (text === null || text === undefined) {
	            text = "";
	        }

	        opt.context = _$1.extend({
	            font: "",
	            fontSize: 13, //字体大小默认13
	            fontWeight: "normal",
	            fontFamily: "微软雅黑,sans-serif",
	            textBaseline: "top",
	            textAlign: "left",

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
	        value: function _setContextStyle(ctx, style, globalAlpha) {
	            // 简单判断不做严格类型检测
	            for (var p in style) {
	                if (p != "textBaseline" && p in ctx) {
	                    if (style[p] || _$1.isNumber(style[p])) {
	                        if (p == "globalAlpha") {
	                            //透明度要从父节点继承
	                            //ctx[p] = style[p] * globalAlpha; //render里面已经做过相乘了，不需要重新*
	                            ctx.globalAlpha = globalAlpha;
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
	        value: function render(ctx, globalAlpha) {
	            this._renderText(ctx, this._getTextLines(), globalAlpha);
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
	            if (Utils._pixelCtx) {
	                Utils._pixelCtx.save();
	                Utils._pixelCtx.font = this.context.$model.font;
	                width = this._getTextWidth(Utils._pixelCtx, this._getTextLines());
	                Utils._pixelCtx.restore();
	            }
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
	        value: function _renderText(ctx, textLines, globalAlpha) {
	            if (!ctx) return;
	            ctx.save();
	            this._setContextStyle(ctx, this.context.$model, globalAlpha);
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
	            if (!ctx) return;

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
	    var List = [];

	    var Len = pList.length;
	    var _currList = [];
	    _$1.each(pList, function (point, i) {

	        if (isNotValibPoint(point)) {
	            //undefined , [ number, null] 等结构
	            if (_currList.length) {
	                List = List.concat(_getSmoothGroupPointList(_currList, smoothFilter));
	                _currList = [];
	            }

	            List.push(point);
	        } else {
	            //有效的point 都push 进_currList 准备做曲线设置
	            _currList.push(point);
	        }

	        if (i == Len - 1) {
	            if (_currList.length) {
	                List = List.concat(_getSmoothGroupPointList(_currList, smoothFilter));
	                _currList = [];
	            }
	        }
	    });

	    return List;
	}

	function _getSmoothGroupPointList(pList, smoothFilter) {
	    var obj = {
	        points: pList
	    };
	    if (_$1.isFunction(smoothFilter)) {
	        obj.smoothFilter = smoothFilter;
	    }

	    var currL = SmoothSpline(obj);
	    if (pList && pList.length > 0) {
	        currL.push(pList[pList.length - 1]);
	    }

	    return currL;
	}

	function isNotValibPoint(point) {
	    var res = !point || _$1.isArray(point) && point.length >= 2 && (!_$1.isNumber(point[0]) || !_$1.isNumber(point[1])) || "x" in point && !_$1.isNumber(point.x) || "y" in point && !_$1.isNumber(point.y);

	    return res;
	}
	function isValibPoint(point) {
	    return !isNotValibPoint(point);
	}

	var myMath = {
	    PI: Math.PI,
	    sin: sin,
	    cos: cos,
	    degreeToRadian: degreeToRadian,
	    radianToDegree: radianToDegree,
	    degreeTo360: degreeTo360,
	    getIsgonPointList: getIsgonPointList,
	    getSmoothPointList: getSmoothPointList,
	    isNotValibPoint: isNotValibPoint,
	    isValibPoint: isValibPoint
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
	            _context.pointList = myMath.getSmoothPointList(_context.pointList, _context.smoothFilter);
	        }

	        opt.context = _context;
	        opt.type = "brokenline";

	        //保存好原始值
	        var _this = possibleConstructorReturn(this, (BrokenLine.__proto__ || Object.getPrototypeOf(BrokenLine)).call(this, opt));

	        _this._pointList = _context.pointList;
	        return _this;
	    }

	    createClass(BrokenLine, [{
	        key: "watch",
	        value: function watch(name, value, preValue) {
	            if (name == "pointList" || name == "smooth" || name == "lineType") {
	                if (name == "pointList" && this.context.smooth) {
	                    this.context.pointList = myMath.getSmoothPointList(value, this.context.smoothFilter);
	                    this._pointList = value;
	                }
	                if (name == "smooth") {
	                    //如果是smooth的切换
	                    if (value) {
	                        //从原始中拿数据重新生成
	                        this.context.pointList = myMath.getSmoothPointList(this._pointList, this.context.smoothFilter);
	                    } else {
	                        this.context.pointList = this._pointList;
	                    }
	                }
	                this.graphics.clear();
	            }
	        }
	    }, {
	        key: "draw",
	        value: function draw(graphics) {
	            var context = this.context;
	            var pointList = context.pointList;
	            var beginPath = false;

	            for (var i = 0, l = pointList.length; i < l; i++) {
	                var point = pointList[i];
	                var nextPoint = pointList[i + 1];
	                if (myMath.isValibPoint(point)) {
	                    if (!context.lineType || context.lineType == 'solid') {
	                        //实线的绘制
	                        if (!beginPath) {
	                            graphics.moveTo(point[0], point[1]);
	                        } else {
	                            graphics.lineTo(point[0], point[1]);
	                        }
	                    } else if (context.lineType == 'dashed' || context.lineType == 'dotted') {
	                        //如果是虚线

	                        //如果是曲线
	                        if (context.smooth) {
	                            //就直接做间隔好了
	                            //TODO: 这个情况会有点稀疏，要优化
	                            if (!beginPath) {
	                                graphics.moveTo(point[0], point[1]);
	                            } else {
	                                graphics.lineTo(point[0], point[1]);
	                                beginPath = false;
	                                i++; //跳过下一个点
	                                continue;
	                            }
	                        } else {
	                            //point 有效，而且 next也有效的话
	                            //直线的虚线
	                            if (myMath.isValibPoint(nextPoint)) {
	                                this.dashedLineTo(graphics, point[0], point[1], nextPoint[0], nextPoint[1], 5);
	                            }
	                        }
	                    }

	                    beginPath = true;
	                } else {
	                    beginPath = false;
	                }
	            }

	            /*
	            if (!context.lineType || context.lineType == 'solid') {
	                //默认为实线
	                //TODO:目前如果 有设置smooth 的情况下是不支持虚线的
	                graphics.moveTo(pointList[0][0], pointList[0][1]);
	                for (var i = 1, l = pointList.length; i < l; i++) {
	                    graphics.lineTo(pointList[i][0], pointList[i][1]);
	                };
	              } else if (context.lineType == 'dashed' || context.lineType == 'dotted') {
	                if (context.smooth) {
	                    for (var si = 0, sl = pointList.length; si < sl; si++) {
	                        if (si == sl-1) {
	                            break;
	                        };
	                        graphics.moveTo( pointList[si][0] , pointList[si][1] );
	                        graphics.lineTo( pointList[si+1][0] , pointList[si+1][1] );
	                        si+=1;
	                      };
	                } else {
	                    //画虚线的方法  
	                    for (var i = 1, l = pointList.length; i < l; i++) {
	                        var fromX = pointList[i - 1][0];
	                        var toX = pointList[i][0];
	                        var fromY = pointList[i - 1][1];
	                        var toY = pointList[i][1];
	                        this.dashedLineTo(graphics, fromX, fromY, toX, toY, 5);
	                    };
	                }
	                
	            };
	            */
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
	            var r = this.context.$model.r;
	            if (r < 0) {
	                r = 0;
	            }
	            graphics.drawCircle(0, 0, r);
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
	                this.isRing = false; //是否为一个圆环，这里也要开始初始化一下
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

	Canvax._ = _$1;
	Canvax.$ = $;
	Canvax.utils = Utils;

	var canvax = Canvax;

	var _colors = ["#ff8533", "#73ace6", "#82d982", "#e673ac", "#cd6bed", "#8282d9", "#c0e650", "#e6ac73", "#6bcded", "#73e6ac", "#ed6bcd", "#9966cc"];
	var theme = {
	    colors: _colors,
	    set: function set(colors) {
	        this.colors = colors;

	        /*
	        var me = this;
	        _.each( colors, function( color , i ){
	            me.colors[i] = color;
	        } );
	        */

	        return this.colors;
	    },
	    get: function get() {
	        return this.colors;
	    }
	};

	//图表皮肤

	var global$1 = {
	    setGlobalTheme: function setGlobalTheme(colors) {
	        theme.set(colors);
	    },
	    getGlobalTheme: function getGlobalTheme() {
	        return theme.get();
	    },

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

	    getOptions: function getOptions(chartPark_cid, options) {
	        //chartPark_cid,chartpark中的图表id
	        if (!options) {
	            options = this.options;
	        }
	        if (!options[chartPark_cid]) {
	            return;
	        }        var JsonSerialize = {
	            prefix: '[[JSON_FUN_PREFIX_',
	            suffix: '_JSON_FUN_SUFFIX]]'
	        };
	        var parse = function parse(string) {
	            return JSON.parse(string, function (key, value) {
	                if (typeof value === 'string' && value.indexOf(JsonSerialize.suffix) > 0 && value.indexOf(JsonSerialize.prefix) == 0) {
	                    return new Function('return ' + value.replace(JsonSerialize.prefix, '').replace(JsonSerialize.suffix, ''))();
	                }

	                return value;
	            }) || {};
	        };
	        var opt = parse(decodeURIComponent(options[chartPark_cid] || {}));
	        return opt;
	    }
	};

	var _$3 = canvax._;

	//如果应用传入的数据是[{name:name, sex:sex ...} , ...] 这样的数据，就自动转换为chartx需要的矩阵格式数据
	function parse2MatrixData(list) {
	    if (list === undefined || list === null) {
	        list = [];
	    }    //检测第一个数据是否为一个array, 否就是传入了一个json格式的数据
	    if (list.length > 0 && !_$3.isArray(list[0])) {
	        var newArr = [];
	        var fields = [];
	        var fieldNum = 0;
	        for (var i = 0, l = list.length; i < l; i++) {
	            var row = list[i];
	            if (i == 0) {
	                for (var f in row) {
	                    fields.push(f);
	                }                newArr.push(fields);
	                fieldNum = fields.length;
	            }            var _rowData = [];
	            for (var ii = 0; ii < fieldNum; ii++) {
	                _rowData.push(row[fields[ii]]);
	            }            newArr.push(_rowData);
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
	    }    if (s >= 1000) {
	        var num = parseInt(s / 1000);
	        return String($n.toString().replace(num, num + symbol));
	    } else {
	        return String($n);
	    }
	}

	function getEl(el) {
	    if (_$3.isString(el)) {
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
	    var start = {
	        x: 0,
	        y: 0
	    };
	    if (_$3.isArray($arr[0])) {
	        start.x = $arr[0][0];
	        start.y = $arr[0][1];
	        s = M + $arr[0][0] + ' ' + $arr[0][1];
	    } else {
	        start = $arr[0];
	        s = M + $arr[0].x + ' ' + $arr[0].y;
	    }
	    for (var a = 1, al = $arr.length; a < al; a++) {
	        var x = 0,
	            y = 0,
	            item = $arr[a];
	        if (_$3.isArray(item)) {
	            x = item[0];
	            y = item[1];
	        } else {
	            x = item.x;
	            y = item.y;
	        }
	        //s += ' ' + L + x + ' ' + y
	        if (x == start.x && y == start.y) {
	            s += ' ' + Z;
	        } else {
	            s += ' ' + L + x + ' ' + y;
	        }
	    }

	    // s += ' ' + Z
	    return s;
	}

	/**
	* 把原始的数据
	* field1 field2 field3
	*   1      2      3
	*   2      3      4
	* 这样的数据格式转换为内部的
	* [{field:'field1',index:0,data:[1,2]} ......]
	* 这样的结构化数据格式。
	*/

	var _$4 = canvax._;

	function DataFrame (data, opt) {

	    var dataFrame = { //数据框架集合
	        length: 0,
	        org: [], //最原始的数据，一定是个行列式，因为如果发现是json格式数据，会自动转换为行列式
	        data: [], //最原始的数据转化后的数据格式：[o,o,o] o={field:'val1',index:0,data:[1,2,3]}
	        getRowData: _getRowData,
	        getFieldData: _getFieldData,
	        getDataOrg: getDataOrg,
	        fields: [],
	        range: {
	            start: 0,
	            end: 0
	        }
	    };

	    if (!data || data.length == 0) {
	        return dataFrame;
	    }
	    //检测第一个数据是否为一个array, 否就是传入了一个json格式的数据
	    if (data.length > 0 && !_$4.isArray(data[0])) {
	        data = parse2MatrixData(data);
	        dataFrame.length = data.length;
	    } else {
	        dataFrame.length = data.length - 1;
	    }
	    //设置好数据区间end值
	    dataFrame.range.end = dataFrame.length - 1;
	    //然后检查opts中是否有dataZoom.range
	    if (opt && opt.dataZoom && opt.dataZoom.range) {
	        _$4.extend(dataFrame.range, opt.dataZoom.range);
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
	    }    dataFrame.data = total;

	    //填充好total的data并且把属于yAxis的设置为number
	    for (var a = 1, al = data.length; a < al; a++) {
	        for (var b = 0, bl = data[a].length; b < bl; b++) {

	            /*
	            var _val = data[a][b];
	            if( !isNaN( _val ) ){
	                _val = Number( _val );
	            };
	            */

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
	            }            return data;
	        }
	        if (!_$4.isArray($field)) {
	            $field = [$field];
	        }
	        //这个时候的arr只是totalList的过滤，还没有完全的按照$field 中的排序
	        var newData = [];
	        for (var i = 0, l = $field.length; i < l; i++) {
	            if (_$4.isArray($field[i])) {
	                newData.push(getDataOrg($field[i], format, totalList, lev + 1));
	            } else {

	                var _fieldData = newData;
	                if (!lev) {
	                    _fieldData = [];
	                }                for (var ii = 0, iil = arr.length; ii < iil; ii++) {
	                    if ($field[i] == arr[ii].field) {
	                        _fieldData.push(_format(arr[ii].data.slice(dataFrame.range.start, dataFrame.range.end + 1)));
	                        break;
	                    }
	                }                if (!lev) {
	                    newData.push(_fieldData);
	                }            }        }
	        return newData;
	    }
	    /*
	     * 获取某一行数据
	    */
	    function _getRowData(index) {
	        var o = {};
	        var data = dataFrame.data;
	        for (var a = 0; a < data.length; a++) {
	            o[data[a].field] = data[a].data[dataFrame.range.start + index];
	        }        return o;
	    }

	    function _getFieldData(field) {
	        var data;
	        _$4.each(dataFrame.data, function (d) {
	            if (d.field == field) {
	                data = d;
	            }
	        });
	        if (data) {
	            return data.data.slice(dataFrame.range.start, dataFrame.range.end + 1);
	        } else {
	            return [];
	        }
	    }

	    return dataFrame;
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

	var _$5 = canvax._;

	var padding = 20;

	var Chart = function (_Canvax$Event$EventDi) {
	    inherits$1(Chart, _Canvax$Event$EventDi);

	    function Chart(node, data, opt) {
	        classCallCheck$1(this, Chart);

	        var _this = possibleConstructorReturn$1(this, (Chart.__proto__ || Object.getPrototypeOf(Chart)).call(this, node, data, opt));

	        _this.Canvax = canvax;

	        _this._node = node;
	        //不管传入的是data = [ ['xfield','yfield'] , ['2016', 111]]
	        //还是 data = [ {xfiled, 2016, yfield: 1111} ]，这样的格式，
	        //通过parse2MatrixData最终转换的是data = [ ['xfield','yfield'] , ['2016', 111]] 这样 chartx的数据格式
	        //后面有些地方比如 一些graphs中会使用dataFrame.org，， 那么这个dataFrame.org和_data的区别是，
	        //_data是全量数据， dataFrame.org是_data经过dataZoom运算过后的子集
	        _this._data = parse2MatrixData(data);
	        _this._opts = opt;

	        _this.el = getEl(node); //chart 在页面里面的容器节点，也就是要把这个chart放在哪个节点里
	        _this.width = parseInt(_this.el.offsetWidth); //图表区域宽
	        _this.height = parseInt(_this.el.offsetHeight); //图表区域高

	        //padding 不支持用户设置， 主要是给内部组件比如 配置了 legend的话，
	        //legend如果在top，就会把图表的padding.top修改，减去legend的height
	        _this.padding = {
	            top: padding,
	            right: padding,
	            bottom: padding,
	            left: padding
	        };

	        //Canvax实例
	        _this.canvax = new canvax.App({
	            el: _this.el,
	            webGL: false
	        });
	        _this.canvax.registEvent();

	        _this.id = "chartx_" + _this.canvax.id;
	        _this.el.setAttribute("chart_id", _this.id);
	        _this.el.setAttribute("chartx_version", "2.0");

	        //设置stage ---------------------------------------------------------begin
	        _this.stage = new canvax.Display.Stage({
	            id: "main-chart-stage"
	        });
	        _this.canvax.addChild(_this.stage);
	        //设置stage ---------------------------------------------------------end

	        //构件好coord 和 graphs 的根容器
	        _this.setCoord_Graphs_Sp();

	        //初始化_graphs为空数组
	        _this._graphs = [];

	        //组件管理机制,所有的组件都绘制在这个地方
	        _this.components = [];

	        _this.inited = false;
	        _this.dataFrame = null; //每个图表的数据集合 都 存放在dataFrame中。

	        _this._theme = _$5.extend([], theme.colors); //theme.colors;  //皮肤对象，opts里面可能有theme皮肤组件

	        _this.init.apply(_this, arguments);

	        return _this;
	    }

	    createClass$1(Chart, [{
	        key: "init",
	        value: function init() {}
	    }, {
	        key: "draw",
	        value: function draw() {}

	        //ind 如果有就获取对应索引的具体颜色值

	    }, {
	        key: "getTheme",
	        value: function getTheme(ind) {
	            var colors = this._theme;
	            if (ind != undefined) {
	                return colors[ind % colors.length] || "#ccc";
	            }            return colors;
	        }
	    }, {
	        key: "setCoord_Graphs_Sp",
	        value: function setCoord_Graphs_Sp() {
	            //坐标系存放的容器
	            this.coordSprite = new canvax.Display.Sprite({
	                id: 'coordSprite'
	            });
	            this.stage.addChild(this.coordSprite);

	            //graphs管理
	            this.graphsSprite = new canvax.Display.Sprite({
	                id: 'graphsSprite'
	            });
	            this.stage.addChild(this.graphsSprite);
	        }

	        /*
	         * chart的销毁
	         */

	    }, {
	        key: "destroy",
	        value: function destroy() {
	            this._clean();
	            if (this.el) {
	                this.el.removeAttribute("chart_id");
	                this.el.removeAttribute("chartx_version");
	                this.canvax.destroy();
	                this.el = null;
	            }            this._destroy && this._destroy();
	            this.fire("destroy");
	        }

	        /*
	         * 清除整个图表
	         **/

	    }, {
	        key: "_clean",
	        value: function _clean() {
	            //保留所有的stage，stage下面得元素全部 destroy 掉
	            for (var i = 0, l = this.canvax.children.length; i < l; i++) {
	                var stage = this.canvax.getChildAt(i);
	                for (var s = 0, sl = stage.children.length; s < sl; s++) {
	                    stage.getChildAt(s).destroy();
	                    s--;
	                    sl--;
	                }
	            }
	            //因为上面的destroy把 this.coordSprite 和 this.graphsSprite 这两个预设的容器给destroy了
	            //所以要重新设置一遍准备好。
	            this.setCoord_Graphs_Sp();

	            this.components = []; //组件清空
	            this._graphs = []; //绘图组件清空
	            this.canvax.domView.innerHTML = "";
	            //padding数据也要重置为起始值
	            this.padding = {
	                top: padding,
	                right: padding,
	                bottom: padding,
	                left: padding
	            };
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

	            this.width = _w;
	            this.height = _h;
	            this.canvax.resize();
	            this.inited = false;

	            this._clean();
	            this.draw({
	                resize: true
	            });

	            this.inited = true;
	        }

	        /**
	         * reset 其实就是重新绘制整个图表，不再做详细的拆分opts中有哪些变化，来做对应的细致的变化，简单粗暴的全部重新创立
	         */

	    }, {
	        key: "reset",
	        value: function reset(opt, data) {
	            !opt && (opt = {});

	            _$5.extend(true, this._opts, opt);

	            //和上面的不同this._opts存储的都是用户设置的配置
	            //而下面的这个extend到this上面， this上面的属性都有包含默认配置的情况
	            _$5.extend(true, this, opt);

	            if (data) {
	                this._data = parse2MatrixData(data);
	            }
	            this.dataFrame = this.initData(this._data, opt);

	            this._clean();
	            this.draw(opt);
	        }

	        /*
	         * 只响应数据的变化，不涉及配置变化
	         * 
	         * @dataTrigger 一般是触发这个data reset的一些场景数据，
	         * 比如如果是 datazoom 触发的， 就会有 trigger数据{ name:'datazoom', left:1,right:1 }
	         */

	    }, {
	        key: "resetData",
	        value: function resetData(data, dataTrigger) {
	            if (data) {
	                this._data = parse2MatrixData(data);
	                this.dataFrame = this.initData(this._data);
	            }            this._resetData && this._resetData(dataTrigger);
	            this.fire("resetData");
	        }
	    }, {
	        key: "initData",
	        value: function initData() {
	            return DataFrame.apply(this, arguments);
	        }

	        //插件管理相关代码begin

	    }, {
	        key: "initComponents",
	        value: function initComponents() {
	            var me = this;
	            //TODO: theme 组件优先级最高，在registerComponents之前已经加载过
	            var notComponents = ["coord", "graphs", "theme"];
	            for (var _p in this._opts) {

	                if (_$5.indexOf(notComponents, _p) == -1) {
	                    var _comp = this._opts[_p];
	                    if (!_$5.isArray(_comp)) {
	                        _comp = [_comp];
	                    }                    _$5.each(_comp, function (compOpt) {
	                        var compConstructor = me.componentsMap[_p];
	                        if (compConstructor && compConstructor.register) {
	                            compConstructor.register(compOpt, me);
	                        }                    });
	                }
	            }
	        }

	        //所有plug触发更新

	    }, {
	        key: "componentsReset",
	        value: function componentsReset(trigger) {
	            var me = this;
	            _$5.each(this.components, function (p, i) {

	                if (trigger && trigger.name == p.type) {
	                    //如果这次reset就是由自己触发的，那么自己这个components不需要reset，负责观察就好
	                    return;
	                }
	                if (p.type == "dataZoom") {
	                    p.plug.reset({}, me._getCloneChart());
	                    return;
	                }
	                p.plug.reset && p.plug.reset(me[p.type] || {}, me.dataFrame);
	            });
	        }
	    }, {
	        key: "drawComponents",
	        value: function drawComponents() {
	            for (var i = 0, l = this.components.length; i < l; i++) {
	                var p = this.components[i];
	                p.plug && p.plug.draw && p.plug.draw();
	                if (p.type == "once") {
	                    this.components.splice(i, 1);
	                    i--;
	                    //l--; l重新计算p.plug.draw 可能会改变components
	                }
	                l = this.components.length;
	            }
	        }
	    }, {
	        key: "getComponentsByType",
	        value: function getComponentsByType(type) {
	            var arr = [];
	            _$5.each(this.components, function (c) {
	                if (c.type == type) {
	                    arr.push(c.plug);
	                }
	            });
	            return arr;
	        }
	    }, {
	        key: "getComponentById",
	        value: function getComponentById(id) {
	            var comp;
	            _$5.each(this.components, function (c) {
	                if (c.id == id) {
	                    comp = c;
	                    return false;
	                }
	            });
	            return comp ? comp.plug : null;
	        }
	        //插件相关代码end


	        //获取graphs列表根据type

	    }, {
	        key: "getGraphsByType",
	        value: function getGraphsByType(type) {
	            var arr = [];
	            _$5.each(this._graphs, function (g) {
	                if (g.type == type) {
	                    arr.push(g);
	                }
	            });
	            return arr;
	        }

	        //获取graphs根据id

	    }, {
	        key: "getGraphById",
	        value: function getGraphById(id) {
	            var _g;
	            _$5.each(this._graphs, function (g) {
	                if (g.id == id) {
	                    _g = g;
	                    return false;
	                }
	            });
	            return _g;
	        }
	    }]);
	    return Chart;
	}(canvax.Event.EventDispatcher);

	var _$6 = canvax._;

	/**
	 * 所有坐标系的基类，一些坐标系中复用的代码，沉淀在这里
	 * 空坐标系，一些非直角坐标系，极坐标系的图表，就会直接创建一个空坐标系图表，然后添加组件
	 */

	var Coord = function (_Chart) {
	    inherits$1(Coord, _Chart);

	    function Coord(node, data, opt, graphsMap, componentsMap) {
	        classCallCheck$1(this, Coord);

	        var _this = possibleConstructorReturn$1(this, (Coord.__proto__ || Object.getPrototypeOf(Coord)).call(this, node, data, opt));

	        _this.graphsMap = graphsMap;
	        _this.componentsMap = componentsMap;

	        //这里不要直接用data，而要用 this._data
	        _this.dataFrame = _this.initData(_this._data, opt);

	        _this._graphs = [];
	        if (opt.graphs) {
	            opt.graphs = _$6.flatten([opt.graphs]);
	        }
	        _$6.extend(true, _this, _this.setDefaultOpts(opt));

	        //this.draw();

	        return _this;
	    }

	    createClass$1(Coord, [{
	        key: "setDefaultOpts",
	        value: function setDefaultOpts(opt) {
	            return opt;
	        }

	        //覆盖基类中得draw，和基类的draw唯一不同的是，descartes 会有 drawEndHorizontal 的操作
	        //create的时候调用没有opt参数
	        //resize（opt=={resize : true}） 和 reset的时候会有 opt参数传过来

	    }, {
	        key: "draw",
	        value: function draw(opt) {
	            if (this._opts.theme) {
	                //如果用户有配置皮肤组件，优先级最高
	                //皮肤就是一组颜色

	                //假如用户就只传了一个颜色值
	                if (!_$6.isArray(this._opts.theme)) {
	                    this._opts.theme = [this._opts.theme];
	                }
	                var _theme = new this.componentsMap.theme(this._opts.theme, this);
	                this._theme = _theme.get(); //如果用户有设置图表皮肤组件，那么就全部用用户自己设置的，不再用merge
	            }            this.initModule(opt); //初始化模块  
	            this.initComponents(opt); //初始化组件, 来自己chart.js模块

	            if (this._coord && this._coord.horizontal) {
	                this.drawBeginHorizontal && this.drawBeginHorizontal();
	            }
	            this.startDraw(opt); //开始绘图，包括坐标系和graphs 和 components

	            if (this._coord && this._coord.horizontal) {
	                this.drawEndHorizontal && this.drawEndHorizontal();
	            }        }
	    }, {
	        key: "initModule",
	        value: function initModule(opt) {
	            var me = this;
	            //首先是创建一个坐标系对象
	            if (this.CoordComponents) {
	                this._coord = new this.CoordComponents(this.coord, this);
	                this.coordSprite.addChild(this._coord.sprite);
	            }
	            _$6.each(this.graphs, function (graphs) {
	                var _g = new me.graphsMap[graphs.type](graphs, me);
	                me._graphs.push(_g);
	                me.graphsSprite.addChild(_g.sprite);
	            });
	        }
	    }, {
	        key: "startDraw",
	        value: function startDraw(opt) {

	            var me = this;
	            !opt && (opt = {});
	            var _coord = this._coord;

	            var width = this.width - this.padding.left - this.padding.right;
	            var height = this.height - this.padding.top - this.padding.bottom;
	            var origin = { x: this.padding.left, y: this.padding.top };

	            if (this._coord) {
	                //先绘制好坐标系统
	                this._coord.draw(opt);
	                width = this._coord.width;
	                height = this._coord.height;
	                origin = this._coord.origin;
	            }
	            if (this.dataFrame.length == 0) {
	                //如果没有数据，不需要绘制graphs
	                me.fire("complete");
	                return;
	            }
	            var graphsCount = this._graphs.length;
	            var completeNum = 0;

	            opt = _$6.extend(opt, {
	                width: width,
	                height: height,
	                origin: origin
	            });

	            _$6.each(this._graphs, function (_g) {
	                _g.on("complete", function (g) {
	                    completeNum++;
	                    if (completeNum == graphsCount) {
	                        me.fire("complete");
	                    }
	                    _g.inited = true;
	                });
	                _g.draw(opt);
	            });

	            this.drawComponents(opt); //绘图完，开始绘制插件，来自己chart.js模块

	            this.bindEvent();
	        }

	        //reset之前是应该已经 merge过了 opt ，  和准备好了dataFrame

	    }, {
	        key: "_resetData",
	        value: function _resetData(dataTrigger) {
	            var me = this;
	            if (this._coord) {
	                this._coord.resetData(this.dataFrame, dataTrigger);
	            }
	            _$6.each(this._graphs, function (_g) {
	                _g.resetData(me.dataFrame, dataTrigger);
	            });

	            this.componentsReset(dataTrigger);
	        }
	    }, {
	        key: "show",
	        value: function show(field, legendData) {
	            this._coord.addField(field, legendData);
	            _$6.each(this._graphs, function (_g) {
	                _g.show(field, legendData);
	            });
	        }
	    }, {
	        key: "hide",
	        value: function hide(field, legendData) {
	            this._coord.removeField(field, legendData);
	            _$6.each(this._graphs, function (_g) {
	                _g.hide(field, legendData);
	            });
	        }

	        //坐标系图表的集中事件绑定处理

	    }, {
	        key: "bindEvent",
	        value: function bindEvent() {
	            var me = this;
	            this.on("panstart mouseover", function (e) {
	                var _tips = me.getComponentById("tips");
	                if (_tips) {
	                    me.setTipsInfo.apply(me, [e]);
	                    _tips.show(e);
	                    me._tipsPointerAtAllGraphs(e);
	                }            });
	            this.on("panmove mousemove", function (e) {
	                var _tips = me.getComponentById("tips");
	                if (_tips) {
	                    me.setTipsInfo.apply(me, [e]);
	                    _tips.move(e);
	                    me._tipsPointerAtAllGraphs(e);
	                }            });
	            this.on("panend mouseout", function (e) {
	                //如果e.toTarget有货，但是其实这个point还是在induce 的范围内的
	                //那么就不要执行hide，顶多只显示这个点得tips数据
	                var _tips = me.getComponentById("tips");
	                if (_tips && !(e.toTarget && me._coord && me._coord.induce && me._coord.induce.containsPoint(me._coord.induce.globalToLocal(e.target.localToGlobal(e.point))))) {
	                    _tips.hide(e);
	                    me._tipsPointerHideAtAllGraphs(e);
	                }            });
	            this.on("tap", function (e) {
	                var _tips = me.getComponentById("tips");
	                if (_tips) {
	                    _tips.hide(e);
	                    me.setTipsInfo.apply(me, [e]);
	                    _tips.show(e);
	                    me._tipsPointerAtAllGraphs(e);
	                }            });
	        }

	        //默认的基本tipsinfo处理，极坐标和笛卡尔坐标系统会覆盖

	    }, {
	        key: "setTipsInfo",
	        value: function setTipsInfo(e) {
	            if (!e.eventInfo) {
	                e.eventInfo = {};
	            }            if (!e.eventInfo.nodes || !e.eventInfo.nodes.length) {
	                var nodes = [];
	                _$6.each(this._graphs, function (_g) {
	                    nodes = nodes.concat(_g.getNodesAt(e));
	                });
	                e.eventInfo.nodes = nodes;
	            }
	        }

	        //把这个point拿来给每一个graphs执行一次测试，给graphs上面的shape触发激活样式

	    }, {
	        key: "_tipsPointerAtAllGraphs",
	        value: function _tipsPointerAtAllGraphs(e) {
	            _$6.each(this._graphs, function (_g) {
	                _g.tipsPointerOf(e);
	            });
	        }
	    }, {
	        key: "_tipsPointerHideAtAllGraphs",
	        value: function _tipsPointerHideAtAllGraphs(e) {
	            _$6.each(this._graphs, function (_g) {
	                _g.tipsPointerHideOf(e);
	            });
	        }
	    }]);
	    return Coord;
	}(Chart);

	var _$7 = canvax._;

	var coorBase = function (_Canvax$Event$EventDi) {
	    inherits$1(coorBase, _Canvax$Event$EventDi);

	    function coorBase(opt, root) {
	        classCallCheck$1(this, coorBase);

	        var _this = possibleConstructorReturn$1(this, (coorBase.__proto__ || Object.getPrototypeOf(coorBase)).call(this, opt, root));

	        _this._opts = opt;
	        _this.root = root;
	        _this.dataFrame = _this.root.dataFrame;

	        //这个width为坐标系的width，height， 不是 图表的width和height（图表的widht，height有padding等）
	        _this.width = 0;
	        _this.height = 0;
	        _this.origin = {
	            x: 0,
	            y: 0
	        };

	        _this.sprite = null;

	        /*
	        吧原始的field转换为对应结构的显示树
	        ["uv"] --> [
	            {field:'uv',enabled:true ,yAxis: yAxisleft }
	            ...
	        ]
	        */
	        _this.fieldsMap = null;
	        _this.induce = null;
	        return _this;
	    }

	    //设置 fieldsMap 中对应field 的 enabled状态


	    createClass$1(coorBase, [{
	        key: "setFieldEnabled",
	        value: function setFieldEnabled(field) {
	            var me = this;
	            function set$$1(maps) {
	                _$7.each(maps, function (map, i) {
	                    if (_$7.isArray(map)) {
	                        set$$1(map);
	                    } else if (map.field && map.field == field) {
	                        map.enabled = !map.enabled;
	                    }
	                });
	            }
	            set$$1(me.fieldsMap);
	        }
	    }, {
	        key: "getFieldMapOf",
	        value: function getFieldMapOf(field) {
	            var me = this;
	            var fieldMap = null;
	            function get$$1(maps) {
	                _$7.each(maps, function (map, i) {
	                    if (_$7.isArray(map)) {
	                        get$$1(map);
	                    } else if (map.field && map.field == field) {
	                        fieldMap = map;
	                        return false;
	                    }
	                });
	            }
	            get$$1(me.fieldsMap);
	            return fieldMap;
	        }

	        //如果有传参数 fields 进来，那么就把这个指定的 fields 过滤掉 enabled==false的field
	        //只留下enabled的field 结构

	    }, {
	        key: "filterEnabledFields",
	        value: function filterEnabledFields(fields) {
	            var me = this;
	            var arr = [];
	            if (!_$7.isArray(fields)) fields = [fields];
	            _$7.each(fields, function (f) {
	                if (!_$7.isArray(f)) {
	                    if (me.getFieldMapOf(f).enabled) {
	                        arr.push(f);
	                    }
	                } else {
	                    //如果这个是个纵向数据，说明就是堆叠配置
	                    var varr = [];
	                    _$7.each(f, function (v_f) {
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
	        key: "removeField",
	        value: function removeField(field) {
	            this.changeFieldEnabled(field);
	        }
	    }, {
	        key: "addField",
	        value: function addField(field) {
	            this.changeFieldEnabled(field);
	        }
	    }]);
	    return coorBase;
	}(canvax.Event.EventDispatcher);

	var _$8 = canvax._;

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

	    arr = _$8.without(arr, undefined, null, "");

	    var scale = $cfg && $cfg.scale ? parseFloat($cfg.scale) : 1;
	    //返回的数组中的值 是否都为整数(思霏)  防止返回[8, 8.2, 8.4, 8.6, 8.8, 9]   应该返回[8, 9]
	    var isInt = $cfg && $cfg.isInt ? 1 : 0;

	    if (isNaN(scale)) {
	        scale = 1;
	    }
	    var max = _$8.max(arr);
	    var initMax = max;
	    max *= scale;
	    var min = _$8.min(arr);

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
	        return _$8.uniq(getLinearTickPositions($arr, $maxPart, $cfg));
	    }
	};

	var Line$1 = canvax.Shapes.Line;
	var _$9 = canvax._;

	var xAxis = function (_Canvax$Event$EventDi) {
	    inherits$1(xAxis, _Canvax$Event$EventDi);

	    function xAxis(opt, data, _coord) {
	        classCallCheck$1(this, xAxis);

	        var _this = possibleConstructorReturn$1(this, (xAxis.__proto__ || Object.getPrototypeOf(xAxis)).call(this));

	        _this._opt = opt;

	        _this._coord = _coord || {};

	        _this.width = 0;
	        _this.height = 0;

	        _this.title = {
	            text: "",
	            shapeType: "text",
	            fontColor: '#999',
	            fontSize: 12,
	            offset: 2,
	            textAlign: "center",
	            textBaseline: "middle",
	            strokeStyle: null,
	            lineHeight: 0
	        };
	        _this._title = null; //this.title对应的文本对象

	        _this.enabled = true;
	        _this.tickLine = {
	            enabled: 1, //是否有刻度线
	            lineWidth: 1, //线宽
	            lineLength: 4, //线长
	            offset: 2,
	            strokeStyle: '#cccccc'
	        };
	        _this.axisLine = {
	            enabled: 1, //是否有轴线
	            lineWidth: 1,
	            strokeStyle: '#cccccc'
	        };
	        _this.label = {
	            enabled: 1,
	            fontColor: '#999',
	            fontSize: 12,
	            rotation: 0,
	            format: null,
	            offset: 2,
	            textAlign: "center",
	            lineHeight: 1,
	            evade: true //是否开启逃避检测，目前的逃避只是隐藏
	        };
	        if (opt.isH && (!opt.label || opt.label.rotaion === undefined)) {
	            //如果是横向直角坐标系图
	            _this.label.rotation = 90;
	        }
	        _this.maxTxtH = 0;

	        _this.pos = {
	            x: 0,
	            y: 0
	        };

	        _this.dataOrg = []; //源数据
	        _this.dataSection = []; //默认就等于源数据,也可以用户自定义传入来指定
	        _this._formatTextSection = []; //dataSection的值format后一一对应的值
	        _this._textElements = []; //_formatTextSection中每个文本对应的canvax.shape.Text对象

	        _this.layoutData = []; //{x:100, value:'1000',visible:true}

	        _this.sprite = null;

	        //过滤器，可以用来过滤哪些yaxis 的 节点是否显示已经颜色之类的
	        //@params params包括 dataSection , 索引index，txt(canvax element) ，line(canvax element) 等属性
	        _this.filter = null; //function(params){}; 

	        _this.isH = false; //是否为横向转向的x轴

	        _this.animation = true;

	        //layoutType == "proportion"的时候才有效
	        _this.maxVal = null;
	        _this.minVal = null;

	        _this.ceilWidth = 0; //x方向一维均分长度, layoutType == peak 的时候要用到

	        _this.layoutType = "rule"; // rule（均分，起点在0） , peak（均分，起点在均分单位的中心）, proportion（实际数据真实位置，数据一定是number）

	        //如果用户有手动的 trimLayout ，那么就全部visible为true，然后调用用户自己的过滤程序
	        //trimLayout就事把arr种的每个元素的visible设置为true和false的过程
	        //function
	        _this.trimLayout = null;

	        _this.posParseToInt = false; //比如在柱状图中，有得时候需要高精度的能间隔1px的柱子，那么x轴的计算也必须要都是整除的

	        _$9.extend(true, _this, opt);

	        _this.init(opt, data);

	        //xAxis的field只有一个值,
	        _this.field = _$9.flatten([_this.field])[0];
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

	            this._initHandle(data);
	        }
	    }, {
	        key: "_initHandle",
	        value: function _initHandle(data) {
	            var me = this;

	            if (data && data.field) {
	                this.field = data.field;
	            }

	            if (data && data.org) {
	                this.dataOrg = _$9.flatten(data.org);
	            }
	            if (!this._opt.dataSection && this.dataOrg) {
	                //如果没有传入指定的dataSection，才需要计算dataSection
	                this.dataSection = this._initDataSection(this.dataOrg);
	            }
	            me._formatTextSection = [];
	            me._textElements = [];
	            _$9.each(me.dataSection, function (val, i) {
	                me._formatTextSection[i] = me._getFormatText(val, i);
	                //从_formatTextSection中取出对应的格式化后的文本
	                var txt = new canvax.Display.Text(me._formatTextSection[i], {
	                    context: {
	                        fontSize: me.label.fontSize
	                    }
	                });
	                me._textElements[i] = txt;
	            });

	            if (this.label.rotation != 0) {
	                //如果是旋转的文本，那么以右边为旋转中心点
	                this.label.textAlign = "right";
	            }
	            //取第一个数据来判断xaxis的刻度值类型是否为 number
	            !("minVal" in this._opt) && (this.minVal = _$9.min(this.dataSection));
	            if (isNaN(this.minVal) || this.minVal == Infinity) {
	                this.minVal = 0;
	            }            !("maxVal" in this._opt) && (this.maxVal = _$9.max(this.dataSection));
	            if (isNaN(this.maxVal) || this.maxVal == Infinity) {
	                this.maxVal = 1;
	            }
	            this._getName();

	            this._setXAxisHeight();
	        }

	        /**
	         *return dataSection 默认为xAxis.dataOrg的的faltten
	         *即 [ [1,2,3,4] ] -- > [1,2,3,4]
	         */

	    }, {
	        key: "_initDataSection",
	        value: function _initDataSection(data) {
	            var arr = _$9.flatten(data);
	            if (this.layoutType == "proportion") {
	                if (arr.length == 1) {
	                    arr.push(0);
	                    arr.push(arr[0] * 2);
	                }                arr = arr.sort(function (a, b) {
	                    return a - b;
	                });
	                arr = DataSection.section(arr);
	            }            return arr;
	        }

	        //配置和数据变化

	    }, {
	        key: "resetData",
	        value: function resetData(dataFrame) {
	            this._initHandle(dataFrame);
	            this.draw();
	        }
	    }, {
	        key: "getIndexOfVal",
	        value: function getIndexOfVal(xvalue) {
	            var i;
	            for (var ii = 0, il = this.layoutData.length; ii < il; ii++) {
	                var obj = this.layoutData[ii];
	                if (obj.value == xvalue) {
	                    i = ii;
	                    break;
	                }
	            }
	            return i;
	        }
	    }, {
	        key: "getIndexOfX",
	        value: function getIndexOfX(x) {
	            var iNode = 0;
	            if (this.layoutType == "peak") {
	                iNode = parseInt(x / this.ceilWidth);
	                if (iNode == this.dataOrg.length) {
	                    iNode = this.dataOrg.length - 1;
	                }
	            }

	            if (this.layoutType == "rule") {
	                iNode = parseInt((x + this.ceilWidth / 2) / this.ceilWidth);
	                if (this.dataOrg.length == 1) {
	                    //如果只有一个数据
	                    iNode = 0;
	                }
	            }

	            if (this.layoutType == "proportion") {
	                iNode = parseInt(x / ((this.maxVal - this.minVal) / this.width));
	            }

	            return iNode;
	        }
	    }, {
	        key: "getNodeInfoOfX",
	        value: function getNodeInfoOfX(x) {
	            //nodeInfo 一般是给tips用，和data中得数据比就是少了个textWidth
	            //这里和用 data 计算 layoutData的 trimgraphs 中不一样得是
	            //这里的val获取必须在dataOrg中获取，统一的dataLen 也必须是用的 this.dataOrg.length
	            var ind = this.getIndexOfX(x);

	            var val = this.dataOrg[ind];
	            var dataLen = this.dataOrg.length;
	            var x = x;

	            if (this.layoutType == "proportion") {
	                val = (this.maxVal - this.minVal) * (x / this.width) + this.minVal;
	            } else {
	                x = this.getPosX({
	                    val: val,
	                    ind: ind,
	                    dataLen: dataLen,
	                    width: this.width
	                });
	            }
	            var o = {
	                ind: ind,
	                value: val,
	                text: val, //text是format后的数据
	                x: x,
	                field: this.field
	            };

	            o.text = this._getFormatText(val, ind, o);

	            return o;
	        }
	    }, {
	        key: "_setXAxisHeight",
	        value: function _setXAxisHeight() {
	            //检测下文字的高等
	            var me = this;
	            if (!me.enabled) {
	                me.height = 0;
	            } else {
	                var _maxTextHeight = 0;

	                if (this.label.enabled) {
	                    _$9.each(me.dataSection, function (val, i) {

	                        //从_formatTextSection中取出对应的格式化后的文本
	                        var txt = me._textElements[i];

	                        var textWidth = txt.getTextWidth();
	                        var textHeight = txt.getTextHeight();
	                        var height = textHeight; //文本在外接矩形height

	                        if (!!me.label.rotation) {
	                            //有设置旋转
	                            if (me.label.rotation == 90) {
	                                height = textWidth;
	                            } else {
	                                var sinR = Math.sin(Math.abs(me.label.rotation) * Math.PI / 180);
	                                var cosR = Math.cos(Math.abs(me.label.rotation) * Math.PI / 180);
	                                height = parseInt(sinR * textWidth);
	                            }                        }
	                        _maxTextHeight = Math.max(_maxTextHeight, height);
	                    });
	                }
	                this.height = _maxTextHeight + this.tickLine.lineLength + this.tickLine.offset + this.label.offset;

	                if (this._title) {
	                    this.height += this._title.getTextHeight();
	                }            }
	        }
	    }, {
	        key: "_getName",
	        value: function _getName() {
	            if (this.title.text) {
	                if (!this._title) {
	                    this._title = new canvax.Display.Text(this.title.text, {
	                        context: {
	                            fontSize: this.title.fontSize,
	                            textAlign: this.title.textAlign, //"center",//this.isH ? "center" : "left",
	                            textBaseline: this.title.textBaseline, //"middle", //this.isH ? "top" : "middle",
	                            fillStyle: this.title.fontColor,
	                            strokeStyle: this.title.strokeStyle,
	                            lineWidth: this.title.lineWidth,
	                            rotation: this.isH ? -180 : 0
	                        }
	                    });
	                } else {
	                    this._title.resetText(this.title.text);
	                }
	            }
	        }
	    }, {
	        key: "draw",
	        value: function draw(opt) {
	            //首次渲染从 直角坐标系组件中会传入 opt,包含了width，origin等， 所有这个时候才能计算layoutData
	            opt && _$9.extend(true, this, opt);

	            this.layoutData = this._trimXAxis(this.dataSection);
	            this._trimLayoutData();

	            this.sprite.context.x = this.pos.x;
	            this.sprite.context.y = this.pos.y;

	            this._widget(opt);
	        }

	        //获取x对应的位置
	        //val ind 至少要有一个

	    }, {
	        key: "getPosX",
	        value: function getPosX(opt) {
	            var x = 0;
	            var val = opt.val;
	            var ind = "ind" in opt ? opt.ind : _$9.indexOf(this.dataSection, val); //如果没有ind 那么一定要有val
	            var dataLen = "dataLen" in opt ? opt.dataLen : this.dataSection.length;
	            var width = "width" in opt ? opt.width : this.width;
	            var layoutType = "layoutType" in opt ? opt.layoutType : this.layoutType;

	            if (dataLen == 1) {
	                x = width / 2;
	            } else {
	                if (layoutType == "rule") {
	                    //折线图的xyaxis就是 rule
	                    x = ind / (dataLen - 1) * width;
	                }                if (layoutType == "proportion") {
	                    //按照数据真实的值在minVal - maxVal 区间中的比例值
	                    if (val == undefined) {
	                        val = ind * (this.maxVal - this.minVal) / (dataLen - 1) + this.minVal;
	                    }                    x = width * ((val - this.minVal) / (this.maxVal - this.minVal));
	                }                if (layoutType == "peak") {
	                    //柱状图的就是peak
	                    var _ceilWidth = width / dataLen;
	                    if (this.posParseToInt) {
	                        _ceilWidth = parseInt(_ceilWidth);
	                    }
	                    x = _ceilWidth * (ind + 1) - _ceilWidth / 2;
	                }            }
	            if (isNaN(x)) {
	                x = 0;
	            }
	            return parseInt(x, 10);
	        }
	    }, {
	        key: "_computerCeilWidth",
	        value: function _computerCeilWidth() {
	            //ceilWidth默认按照peak算, 而且不能按照dataSection的length来做分母
	            var width = this.width;
	            var ceilWidth = width;
	            if (this.dataOrg.length) {
	                ceilWidth = width / this.dataOrg.length;
	                if (this.layoutType == "rule") {
	                    if (this.dataOrg.length == 1) {
	                        ceilWidth = width / 2;
	                    } else {
	                        ceilWidth = width / (this.dataOrg.length - 1);
	                    }
	                }
	            }
	            if (this.posParseToInt) {
	                ceilWidth = parseInt(ceilWidth);
	            }
	            return ceilWidth;
	        }
	    }, {
	        key: "_trimXAxis",
	        value: function _trimXAxis($data) {
	            var tmpData = [];
	            var data = $data || this.dataSection;

	            this.ceilWidth = this._computerCeilWidth();

	            for (var a = 0, al = data.length; a < al; a++) {
	                var text = this._formatTextSection[a];
	                var txt = this._textElements[a];

	                var o = {
	                    ind: a,
	                    value: data[a],
	                    text: text,
	                    x: this.getPosX({
	                        val: data[a],
	                        ind: a,
	                        dataLen: al,
	                        width: this.width
	                    }),
	                    textWidth: txt.getTextWidth(),
	                    field: this.field
	                };

	                tmpData.push(o);
	            }            return tmpData;
	        }
	    }, {
	        key: "_getFormatText",
	        value: function _getFormatText(val, i) {
	            var res;
	            if (_$9.isFunction(this.label.format)) {
	                res = this.label.format.apply(this, arguments);
	            } else {
	                res = val;
	            }

	            if (_$9.isArray(res)) {
	                res = Tools.numAddSymbol(res);
	            }
	            if (!res) {
	                res = val;
	            }            return res;
	        }
	    }, {
	        key: "_widget",
	        value: function _widget(opt) {
	            if (!this.enabled) return;
	            !opt && (opt = {});

	            var arr = this.layoutData;

	            if (this._title) {
	                this._title.context.y = this.height - this._title.getTextHeight() / 2;
	                this._title.context.x = this.width / 2;
	                this.sprite.addChild(this._title);
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
	                var o = arr[a];
	                var x = o.x,
	                    y = this.tickLine.lineLength + this.tickLine.offset + this.label.offset;

	                if (this.label.enabled && !!arr[a].visible) {
	                    //文字
	                    var textContext = {
	                        x: o._text_x || o.x,
	                        y: y + 20,
	                        fillStyle: this.label.fontColor,
	                        fontSize: this.label.fontSize,
	                        rotation: -Math.abs(this.label.rotation),
	                        textAlign: this.label.textAlign,
	                        lineHeight: this.label.lineHeight,
	                        textBaseline: !!this.label.rotation ? "middle" : "top",
	                        globalAlpha: 0
	                    };

	                    if (!!this.label.rotation && this.label.rotation != 90) {
	                        textContext.x += 5;
	                        textContext.y += 3;
	                    }
	                    if (xNode._txt) {
	                        //_.extend( xNode._txt.context , textContext );
	                        xNode._txt.resetText(o.text + "");
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

	                        xNode._txt = new canvax.Display.Text(o.text, {
	                            id: "xAxis_txt_" + a,
	                            context: textContext
	                        });
	                        xNode.addChild(xNode._txt);

	                        //新建的 txt的 动画方式
	                        if (this.animation && !opt.resize) {
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
	                        }                    }
	                    //xNode._txt.context.visible = !!arr[a].visible;
	                }
	                if (this.tickLine.enabled && !!arr[a].visible) {
	                    var lineContext = {
	                        x: x,
	                        y: this.tickLine.offset,
	                        end: {
	                            x: 0,
	                            y: this.tickLine.lineLength
	                        },
	                        lineWidth: this.tickLine.lineWidth,
	                        strokeStyle: this.tickLine.strokeStyle
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
	                        }                    } else {
	                        xNode._line = new Line$1({
	                            context: lineContext
	                        });
	                        xNode.addChild(xNode._line);
	                    }
	                }
	                //这里可以由用户来自定义过滤 来 决定 该node的样式
	                _$9.isFunction(this.filter) && this.filter({
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
	                }            }
	            //轴线
	            if (this.axisLine.enabled) {
	                var _axisline = new Line$1({
	                    context: {
	                        start: {
	                            x: 0,
	                            y: 0
	                        },
	                        end: {
	                            x: this.width,
	                            y: 0
	                        },
	                        lineWidth: this.axisLine.lineWidth,
	                        strokeStyle: this.axisLine.strokeStyle
	                    }
	                });
	                this.sprite.addChild(_axisline);
	            }
	        }
	    }, {
	        key: "_trimLayoutData",
	        value: function _trimLayoutData() {
	            var me = this;
	            var arr = this.layoutData;
	            var l = arr.length;

	            if (!this.enabled || !l) return;

	            // rule , peak, proportion
	            if (me.layoutType == "proportion") {
	                this._checkOver();
	            }            if (me.layoutType == "peak") {
	                //TODO: peak暂时沿用 _checkOver ，这是保险的万无一失的。
	                this._checkOver();
	            }            if (me.layoutType == "rule") {
	                this._checkOver();
	            }        }
	    }, {
	        key: "_getRootPR",
	        value: function _getRootPR() {
	            //找到paddingRight,在最后一个文本右移的时候需要用到
	            var rootPaddingRight = 0;
	            if (this._coord._root) {
	                rootPaddingRight = this._coord._root.padding.right;
	            }
	            return rootPaddingRight;
	        }
	    }, {
	        key: "_checkOver",
	        value: function _checkOver() {
	            var me = this;
	            var arr = me.layoutData;

	            //现在的柱状图的自定义datasection有缺陷
	            if (me.trimLayout) {
	                //如果用户有手动的 trimLayout ，那么就全部visible为true，然后调用用户自己的过滤程序
	                //trimLayout就事把arr种的每个元素的visible设置为true和false的过程
	                me.trimLayout(arr);
	                return;
	            }
	            //如果用户设置不想要做重叠检测
	            if (!this.label.evade) {
	                _$9.each(arr, function (layoutItem) {
	                    layoutItem.visible = true;
	                });
	                return;
	            }
	            var l = arr.length;
	            var textAlign = me.label.textAlign;

	            function checkOver(i) {
	                var curr = arr[i];

	                if (curr === undefined) {
	                    return;
	                }                curr.visible = true;

	                for (var ii = i; ii < l - 1; ii++) {
	                    var next = arr[ii + 1];

	                    var nextWidth = next.textWidth;
	                    var currWidth = curr.textWidth;

	                    //如果有设置rotation，那么就固定一个最佳可视单位width为35  暂定
	                    if (!!me.label.rotation) {
	                        nextWidth = Math.min(nextWidth, 22);
	                        currWidth = Math.min(currWidth, 22);
	                    }
	                    //默认left
	                    var next_left_x = next.x; //下个节点的起始
	                    var curr_right_x = curr.x + currWidth; //当前节点的终点

	                    if (textAlign == "center") {
	                        next_left_x = next.x - nextWidth / 2;
	                        curr_right_x = curr.x + currWidth / 2;
	                    }                    if (textAlign == "right") {
	                        next_left_x = next.x - nextWidth;
	                        curr_right_x = curr.x;
	                    }
	                    if (ii == l - 2) {
	                        //next是最后一个
	                        if (textAlign == "center" && next.x + nextWidth / 2 > me.width) {
	                            next_left_x = me.width - nextWidth;
	                            next._text_x = me.width - nextWidth / 2;
	                        }
	                        if (textAlign == "left" && next.x + nextWidth > me.width) {
	                            next_left_x = me.width - nextWidth;
	                            next._text_x = me.width - nextWidth;
	                        }
	                    }

	                    //重叠，容许2px的误差
	                    if (next_left_x - curr_right_x < -2) {
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
	                }            }
	            checkOver(0);
	        }
	    }]);
	    return xAxis;
	}(canvax.Event.EventDispatcher);

	var Line$2 = canvax.Shapes.Line;
	var _$10 = canvax._;

	var yAxis = function (_Canvax$Event$EventDi) {
	    inherits$1(yAxis, _Canvax$Event$EventDi);

	    function yAxis(opt, data) {
	        classCallCheck$1(this, yAxis);

	        var _this = possibleConstructorReturn$1(this, (yAxis.__proto__ || Object.getPrototypeOf(yAxis)).call(this));

	        _this._opt = opt;

	        _this.width = null; //第一次计算后就会有值
	        _this.yMaxHeight = 0; //y轴最大高
	        _this.height = 0; //y轴第一条线到原点的高

	        _this.maxW = 0; //最大文本的 width
	        _this.field = []; //这个 轴 上面的 field 不需要主动配置。可以从graphs中拿

	        _this.title = {
	            text: "",
	            shapeType: "text",
	            fontColor: '#999',
	            fontSize: 12,
	            offset: 2,
	            textAlign: "center",
	            textBaseline: "middle",
	            strokeStyle: null,
	            lineHeight: 0
	        };
	        _this._title = null; //this.label对应的文本对象

	        _this.enabled = true;
	        _this.tickLine = { //刻度线
	            enabled: 1,
	            lineWidth: 1, //线宽
	            lineLength: 4, //线长
	            strokeStyle: '#cccccc',
	            distance: 2
	        };
	        _this.axisLine = { //轴线
	            enabled: 1,
	            lineWidth: 1,
	            strokeStyle: '#cccccc'
	        };
	        _this.label = {
	            enabled: 1,
	            fontColor: '#999',
	            fontSize: 12,
	            format: null,
	            rotation: 0,
	            distance: 3, //和刻度线的距离,
	            textAlign: null, //"right",
	            lineHeight: 1
	        };

	        if (opt.isH && (!opt.label || opt.label.rotaion === undefined)) {
	            //如果是横向直角坐标系图
	            _this.label.rotation = 90;
	        }
	        _this.pos = {
	            x: 0,
	            y: 0
	        };
	        _this.align = "left"; //yAxis轴默认是再左边，但是再双轴的情况下，可能会right

	        _this.layoutData = []; //dataSection 对应的layout数据{y:-100, value:'1000'}
	        _this.dataSection = []; //从原数据 dataOrg 中 结果 datasection 重新计算后的数据
	        _this.waterLine = null; //水位data，需要混入 计算 dataSection， 如果有设置waterLineData， dataSection的最高水位不会低于这个值

	        //默认的 dataSectionGroup = [ dataSection ], dataSection 其实就是 dataSectionGroup 去重后的一维版本
	        _this.dataSectionGroup = [];

	        //如果middleweight有设置的话 dataSectionGroup 为被middleweight分割出来的n个数组>..[ [0,50 , 100],[100,500,1000] ]
	        _this.middleweight = null;

	        _this.dataOrg = data.org || []; //源数据

	        _this.sprite = null;

	        _this.baseNumber = null; //默认为0，如果dataSection最小值小于0，则baseNumber为最小值，如果dataSection最大值大于0，则baseNumber为最大值
	        _this.basePoint = null; //value为 baseNumber 的point {x,y}
	        _this.min = null;
	        _this.max = null; //后面加的，目前还没用

	        _this._yOriginTrans = 0; //当设置的 baseNumber 和datasection的min不同的时候，


	        //过滤器，可以用来过滤哪些yaxis 的 节点是否显示已经颜色之类的
	        //@params params包括 dataSection , 索引index，txt(canvax element) ，line(canvax element) 等属性
	        _this.filter = null; //function(params){}; 

	        _this.isH = false; //是否横向

	        _this.animation = true;

	        _this.sort = null; //"asc" //排序，默认从小到大, desc为从大到小，之所以不设置默认值为asc，是要用null来判断用户是否进行了配置

	        _this.layoutType = "proportion"; // rule , peak, proportion

	        _this.init(opt, data);

	        _this._getName();
	        return _this;
	    }

	    createClass$1(yAxis, [{
	        key: "init",
	        value: function init(opt, data) {
	            _$10.extend(true, this, opt);

	            //extend会设置好this.field
	            //先要矫正子啊field确保一定是个array
	            if (!_$10.isArray(this.field)) {
	                this.field = [this.field];
	            }
	            this._initData();

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
	        key: "resetData",
	        value: function resetData(dataFrame) {
	            this.dataSection = [];
	            this.dataSectionGroup = [];

	            if (dataFrame && dataFrame.field) {
	                this.field = dataFrame.field;
	            }

	            if (dataFrame && dataFrame.org) {
	                this.dataOrg = dataFrame.org; //这里必须是data.org
	            }
	            this._initData();

	            this._trimYAxis();
	            this._widget();
	        }
	    }, {
	        key: "setX",
	        value: function setX($n) {
	            this.sprite.context.x = $n;
	            this.pos.x = $n;
	        }
	    }, {
	        key: "setY",
	        value: function setY($n) {
	            this.sprite.context.y = $n;
	            this.pos.y = $n;
	        }

	        //目前和xAxis一样

	    }, {
	        key: "_getName",
	        value: function _getName() {
	            if (this.title.text) {
	                if (!this._title) {
	                    var rotation = 0;
	                    if (this.align == "left") {
	                        rotation = -90;
	                    } else {
	                        rotation = 90;
	                        if (this.isH) {
	                            rotation = 270;
	                        }
	                    }                    this._title = new canvax.Display.Text(this.title.text, {
	                        context: {
	                            fontSize: this.title.fontSize,
	                            textAlign: this.title.textAlign, //"center",//this.isH ? "center" : "left",
	                            textBaseline: this.title.textBaseline, //"middle", //this.isH ? "top" : "middle",
	                            fillStyle: this.title.fontColor,
	                            strokeStyle: this.title.strokeStyle,
	                            lineWidth: this.title.lineWidth,
	                            rotation: rotation
	                        }
	                    });
	                } else {
	                    this._title.resetText(this.title.text);
	                }
	            }
	        }
	    }, {
	        key: "draw",
	        value: function draw(opt) {
	            !opt && (opt = {});
	            opt && _$10.extend(true, this, opt);

	            this.height = parseInt(this.yMaxHeight - this._getYAxisDisLine());

	            this._trimYAxis();
	            this._widget(opt);

	            this.setX(this.pos.x);
	            this.setY(this.pos.y);
	        }

	        //更具y轴的值来输出对应的在y轴上面的位置

	    }, {
	        key: "getYposFromVal",
	        value: function getYposFromVal(val) {

	            var y = 0;
	            var dsgLen = this.dataSectionGroup.length;
	            var yGroupHeight = this.height / dsgLen;

	            for (var i = 0, l = dsgLen; i < l; i++) {
	                var ds = this.dataSectionGroup[i];
	                var min = _$10.min(ds);
	                var max = _$10.max(ds);
	                var valInd = _$10.indexOf(ds, val);

	                if (val >= min && val <= max || valInd >= 0) {
	                    if (this.layoutType == "proportion") {
	                        var _baseNumber = this.baseNumber;
	                        //如果 baseNumber 并不在这个区间
	                        if (_baseNumber < min || _baseNumber > max) {
	                            _baseNumber = min;
	                        }
	                        var maxGroupDisABS = Math.max(Math.abs(max - _baseNumber), Math.abs(_baseNumber - min));
	                        var amountABS = Math.abs(max - min);
	                        var h = maxGroupDisABS / amountABS * yGroupHeight;
	                        y = (val - _baseNumber) / maxGroupDisABS * h + i * yGroupHeight;

	                        if (isNaN(y)) {
	                            y = i * yGroupHeight;
	                        }
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
	            if (isNaN(y)) {
	                y = 0;
	            }
	            return -Math.abs(y);
	        }
	    }, {
	        key: "getValFromYpos",
	        value: function getValFromYpos(y) {
	            var start = this.layoutData[0];
	            var end = this.layoutData.slice(-1)[0];
	            var val = (end.value - start.value) * ((y - start.y) / (end.y - start.y)) + start.value;
	            return val;
	        }
	    }, {
	        key: "_getYOriginTrans",
	        value: function _getYOriginTrans(baseNumber) {
	            var y = 0;
	            var dsgLen = this.dataSectionGroup.length;
	            var yGroupHeight = this.height / dsgLen;

	            for (var i = 0, l = dsgLen; i < l; i++) {
	                var ds = this.dataSectionGroup[i];
	                var min = _$10.min(ds);
	                var max = _$10.max(ds);

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
	            var me = this;
	            var tmpData = [];

	            /*
	            //这里指的是坐标圆点0，需要移动的距离，因为如果有负数的话，最下面的坐标圆点应该是那个负数。
	            //this._yOriginTrans = this._getYOriginTrans( 0 );
	            var originVal = _.min(this.dataSection);
	            if( originVal < 0  ){
	                originVal = 0;
	            };
	            */

	            var originVal = this.baseNumber;
	            this._yOriginTrans = this._getYOriginTrans(originVal);

	            //设置 basePoint
	            this.basePoint = {
	                value: this.baseNumber,
	                y: this.getYposFromVal(this.baseNumber)
	            };

	            for (var i = 0, l = this.dataSection.length; i < l; i++) {
	                var layoutData = {
	                    value: this.dataSection[i],
	                    y: this.getYposFromVal(this.dataSection[i]),
	                    visible: true,
	                    text: ""
	                };

	                //把format提前
	                var text = layoutData.value;
	                if (_$10.isFunction(me.label.format)) {
	                    text = me.label.format.apply(this, [text, i]);
	                }                if (text === undefined || text === null) {
	                    text = numAddSymbol(layoutData.value);
	                }                layoutData.text = text;

	                tmpData.push(layoutData);
	            }

	            var _preShowInd = 0;
	            for (var a = 0, al = tmpData.length; a < al; a++) {
	                if (a == 0) continue;

	                if (_preShowInd == 0) {
	                    if (tmpData[a].text == tmpData[_preShowInd].text) {
	                        //如果后面的format后的数据和前面的节点的format后数据相同
	                        tmpData[a].visible = false;
	                    } else {
	                        _preShowInd = a;
	                    }
	                } else {
	                    if (tmpData[a].text == tmpData[_preShowInd].text) {
	                        tmpData[_preShowInd].visible = false;
	                    }
	                    _preShowInd = a;
	                }
	            }
	            //TODO: 最后的问题就是dataSection中得每个只如果format后都相同的话，就会出现最上面最下面两个一样得刻度
	            this.layoutData = tmpData;
	        }
	    }, {
	        key: "_getYAxisDisLine",
	        value: function _getYAxisDisLine() {
	            //获取y轴顶高到第一条线之间的距离         
	            var disMin = 0;
	            var disMax = 2 * disMin;
	            var dis = disMin;
	            dis = disMin + this.yMaxHeight % this.dataSection.length;
	            dis = dis > disMax ? disMax : dis;
	            return dis;
	        }
	    }, {
	        key: "_setDataSection",
	        value: function _setDataSection() {
	            //如果有堆叠，比如[ ["uv","pv"], "click" ]
	            //那么这个 this.dataOrg， 也是个对应的结构
	            //vLen就会等于2
	            var vLen = 1;

	            _$10.each(this.field, function (f) {
	                vLen = Math.max(vLen, 1);
	                if (_$10.isArray(f)) {
	                    _$10.each(f, function (_f) {
	                        vLen = Math.max(vLen, 2);
	                    });
	                }
	            });

	            if (vLen == 1) {
	                return this._oneDimensional();
	            }            if (vLen == 2) {
	                return this._twoDimensional();
	            }        }
	    }, {
	        key: "_oneDimensional",
	        value: function _oneDimensional() {
	            var arr = _$10.flatten(this.dataOrg); //_.flatten( data.org );

	            for (var i = 0, il = arr.length; i < il; i++) {
	                arr[i] = arr[i] || 0;
	            }
	            return arr;
	        }

	        //二维的yAxis设置，肯定是堆叠的比如柱状图，后续也会做堆叠的折线图， 就是面积图

	    }, {
	        key: "_twoDimensional",
	        value: function _twoDimensional() {
	            var d = this.dataOrg;
	            var arr = [];
	            var min;
	            _$10.each(d, function (d, i) {
	                if (!d.length) {
	                    return;
	                }
	                //有数据的情况下 
	                if (!_$10.isArray(d[0])) {
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

	                        var _val = d[ii][i];
	                        if (!_val && _val !== 0) {
	                            continue;
	                        }
	                        min == undefined && (min = _val);
	                        min = Math.min(min, _val);

	                        if (_val >= 0) {
	                            up_count += _val;
	                            up_i++;
	                        } else {
	                            down_count += _val;
	                            down_i++;
	                        }
	                    }
	                    up_i && varr.push(up_count);
	                    down_i && varr.push(down_count);
	                }                arr.push(varr);
	            });
	            arr.push(min);
	            return _$10.flatten(arr);
	        }
	    }, {
	        key: "_initData",
	        value: function _initData() {
	            var me = this;

	            var arr = this._setDataSection();

	            if (this.waterLine != null) {
	                arr.push(this.waterLine);
	            }

	            if (this._opt.min != null) {
	                arr.push(this.min);
	            }            if (arr.length == 1) {
	                arr.push(arr[0] * 2);
	            }
	            //如果用户传入了自定义的dataSection， 那么优先级最高
	            if (!this._opt.dataSection) {

	                if (this._opt.baseNumber != undefined) {
	                    arr.push(this.baseNumber);
	                }                if (this._opt.minNumber != undefined) {
	                    arr.push(this.minNumber);
	                }                if (this._opt.maxNumber != undefined) {
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
	            } else {
	                this.dataSection = this._opt.dataSection;
	            }
	            //如果还是0
	            if (this.dataSection.length == 0) {
	                this.dataSection = [0];
	            }            if (_$10.min(this.dataSection) < this._opt.min) {
	                var minDiss = me._opt.min - _$10.min(me.dataSection);
	                //如果用户有硬性要求min，而且计算出来的dataSection还是比min小的话
	                _$10.each(this.dataSection, function (num, i) {
	                    me.dataSection[i] += minDiss;
	                });
	            }
	            //如果有 middleweight 设置，就会重新设置dataSectionGroup
	            this.dataSectionGroup = [_$10.clone(this.dataSection)];

	            this._sort();
	            this._setBottomAndBaseNumber();

	            this._middleweight(); //如果有middleweight配置，需要根据配置来重新矫正下datasection
	        }

	        //yVal 要被push到datasection 中去的 值

	    }, {
	        key: "setWaterLine",
	        value: function setWaterLine(yVal) {
	            if (yVal <= this.waterLine) return;
	            this.waterLine = yVal;
	            if (yVal < _$10.min(this.dataSection) || yVal > _$10.max(this.dataSection)) {
	                //waterLine不再当前section的区间内，需要重新计算整个datasection    
	                this._initData();
	            }        }
	    }, {
	        key: "_sort",
	        value: function _sort() {
	            if (this.sort) {
	                var sort = this._getSortType();
	                if (sort == "desc") {
	                    this.dataSection.reverse();

	                    //dataSectionGroup 从里到外全部都要做一次 reverse， 这样就可以对应上 dataSection.reverse()
	                    _$10.each(this.dataSectionGroup, function (dsg, i) {
	                        dsg.reverse();
	                    });
	                    this.dataSectionGroup.reverse();
	                    //dataSectionGroup reverse end
	                }            }        }
	    }, {
	        key: "_getSortType",
	        value: function _getSortType() {
	            var _sort;
	            if (_$10.isString(this.sort)) {
	                _sort = this.sort;
	            }
	            if (_$10.isArray(this.sort)) {
	                _sort = this.sort[this.align == "left" ? 0 : 1];
	            }
	            if (!_sort) {
	                _sort = "asc";
	            }
	            return _sort;
	        }
	    }, {
	        key: "_setBottomAndBaseNumber",
	        value: function _setBottomAndBaseNumber() {
	            if (this.min == null) {
	                //this.min = this.dataSection[0];
	                this.min = _$10.min(this.dataSection);
	            }
	            //没人情况下 baseNumber 就是datasection的最小值
	            if (this._opt.baseNumber == undefined || this._opt.baseNumber == null) {
	                this.baseNumber = 0; //this.dataSection[0];//_.min( this.dataSection );
	                if (_$10.max(this.dataSection) < 0) {
	                    this.baseNumber = _$10.max(this.dataSection);
	                }                if (_$10.min(this.dataSection) > 0) {
	                    this.baseNumber = _$10.min(this.dataSection);
	                }            }        }
	    }, {
	        key: "_middleweight",
	        value: function _middleweight() {
	            if (this.middleweight) {
	                //支持多个量级的设置
	                //量级的设置只支持非sort的柱状图场景，否则这里修改过的datasection会和 _initData 中sort过的逻辑有冲突
	                if (!_$10.isArray(this.middleweight)) {
	                    this.middleweight = [this.middleweight];
	                }
	                //拿到dataSection中的min和 max 后，用middleweight数据重新设置一遍dataSection
	                var dMin = _$10.min(this.dataSection);
	                var dMax = _$10.max(this.dataSection);
	                var newDS = [dMin];
	                var newDSG = [];

	                for (var i = 0, l = this.middleweight.length; i < l; i++) {
	                    var preMiddleweight = dMin;
	                    if (i > 0) {
	                        preMiddleweight = this.middleweight[i - 1];
	                    }                    var middleVal = preMiddleweight + parseInt((this.middleweight[i] - preMiddleweight) / 2);

	                    newDS.push(middleVal);
	                    newDS.push(this.middleweight[i]);

	                    newDSG.push([preMiddleweight, middleVal, this.middleweight[i]]);
	                }                var lastMW = this.middleweight.slice(-1)[0];

	                if (dMax > lastMW) {
	                    newDS.push(lastMW + (dMax - lastMW) / 2);
	                    newDS.push(dMax);
	                    newDSG.push([lastMW, lastMW + (dMax - lastMW) / 2, dMax]);
	                }

	                //好了。 到这里用简单的规则重新拼接好了新的 dataSection
	                this.dataSection = newDS;
	                this.dataSectionGroup = newDSG;

	                //因为重新设置过了 dataSection 所以要重新排序和设置bottom and base 值
	                this._sort();
	                this._setBottomAndBaseNumber();
	            }        }
	    }, {
	        key: "resetWidth",
	        value: function resetWidth(width) {
	            var me = this;
	            me.width = width;
	            if (me.align == "left") {
	                me.rulesSprite.context.x = me.width;
	            }
	        }
	    }, {
	        key: "_widget",
	        value: function _widget(opt) {
	            var me = this;
	            !opt && (opt = {});
	            if (!me.enabled) {
	                me.width = 0;
	                return;
	            }
	            var arr = this.layoutData;
	            me.maxW = 0;

	            for (var a = 0, al = arr.length; a < al; a++) {
	                var o = arr[a];
	                if (!o.visible) {
	                    continue;
	                }                var y = o.y;

	                var value = o.value;

	                var textAlign = me.label.textAlign || (me.align == "left" ? "right" : "left");

	                var posy = y + (a == 0 ? -3 : 0) + (a == arr.length - 1 ? 3 : 0);
	                //为横向图表把y轴反转后的 逻辑
	                if (me.label.rotation == 90 || me.label.rotation == -90) {
	                    textAlign = "center";
	                    if (a == arr.length - 1) {
	                        posy = y - 2;
	                        textAlign = "right";
	                    }
	                    if (a == 0) {
	                        posy = y;
	                    }
	                }
	                var yNode = this.rulesSprite.getChildAt(a);

	                if (yNode) {
	                    if (yNode._txt && this.label.enabled) {

	                        if (me.animation && !opt.resize) {
	                            yNode._txt.animate({
	                                y: posy
	                            }, {
	                                duration: 500,
	                                delay: a * 80,
	                                id: yNode._txt.id
	                            });
	                        } else {
	                            yNode._txt.context.y = posy;
	                        }
	                        yNode._txt.resetText(o.text);
	                    }
	                    if (yNode._tickLine && this.tickLine.enabled) {
	                        if (me.animation && !opt.resize) {
	                            yNode._tickLine.animate({
	                                y: y
	                            }, {
	                                duration: 500,
	                                delay: a * 80,
	                                id: yNode._tickLine.id
	                            });
	                        } else {
	                            yNode._tickLine.context.y = y;
	                        }
	                    }                } else {
	                    yNode = new canvax.Display.Sprite({
	                        id: "yNode" + a
	                    });

	                    var aniFrom = 20;
	                    if (o.value == me.baseNumber) {
	                        aniFrom = 0;
	                    }
	                    if (o.value < me.baseNumber) {
	                        aniFrom = -20;
	                    }
	                    var lineX = 0;
	                    if (me.tickLine.enabled) {
	                        //线条
	                        lineX = me.align == "left" ? -me.tickLine.lineLength - me.tickLine.distance : me.tickLine.distance;
	                        var line = new Line$2({
	                            context: {
	                                x: lineX,
	                                y: y,
	                                end: {
	                                    x: me.tickLine.lineLength,
	                                    y: 0
	                                },
	                                lineWidth: me.tickLine.lineWidth,
	                                strokeStyle: me._getProp(me.tickLine.strokeStyle)
	                            }
	                        });
	                        yNode.addChild(line);
	                        yNode._tickLine = line;
	                    }
	                    //文字
	                    if (me.label.enabled) {
	                        var txtX = me.align == "left" ? lineX - me.label.distance : lineX + me.tickLine.lineLength + me.label.distance;
	                        if (this.isH) {
	                            txtX = txtX + (me.align == "left" ? -1 : 1) * 4;
	                        }                        var txt = new canvax.Display.Text(o.text, {
	                            id: "yAxis_txt_" + me.align + "_" + a,
	                            context: {
	                                x: txtX,
	                                y: posy + aniFrom,
	                                fillStyle: me._getProp(me.label.fontColor),
	                                fontSize: me.label.fontSize,
	                                rotation: -Math.abs(me.label.rotation),
	                                textAlign: textAlign,
	                                textBaseline: "middle",
	                                lineHeight: me.label.lineHeight,
	                                globalAlpha: 0
	                            }
	                        });
	                        yNode.addChild(txt);
	                        yNode._txt = txt;

	                        if (me.label.rotation == 90 || me.label.rotation == -90) {
	                            me.maxW = Math.max(me.maxW, txt.getTextHeight());
	                        } else {
	                            me.maxW = Math.max(me.maxW, txt.getTextWidth());
	                        }
	                        //这里可以由用户来自定义过滤 来 决定 该node的样式
	                        _$10.isFunction(me.filter) && me.filter({
	                            layoutData: me.layoutData,
	                            index: a,
	                            txt: txt,
	                            line: line
	                        });

	                        me.rulesSprite.addChild(yNode);

	                        if (me.animation && !opt.resize) {
	                            txt.animate({
	                                globalAlpha: 1,
	                                y: txt.context.y - aniFrom
	                            }, {
	                                duration: 500,
	                                easing: 'Back.Out', //Tween.Easing.Elastic.InOut
	                                delay: (a + 1) * 80,
	                                id: txt.id
	                            });
	                        } else {
	                            txt.context.y = txt.context.y - aniFrom;
	                            txt.context.globalAlpha = 1;
	                        }
	                    }                }
	            }
	            //把 rulesSprite.children中多余的给remove掉
	            if (me.rulesSprite.children.length > arr.length) {
	                for (var al = arr.length, pl = me.rulesSprite.children.length; al < pl; al++) {
	                    me.rulesSprite.getChildAt(al).remove();
	                    al--, pl--;
	                }            }
	            if (me.width === null) {
	                me.width = parseInt(me.maxW + me.label.distance);
	                if (me.tickLine.enabled) {
	                    me.width += parseInt(me.tickLine.lineLength + me.tickLine.distance);
	                }
	                if (me._title) {
	                    me.width += me._title.getTextHeight();
	                }
	            }

	            var _originX = 0;
	            if (me.align == "left") {
	                me.rulesSprite.context.x = me.width;
	                _originX = me.width;
	            }

	            //轴线
	            if (me.axisLine.enabled) {
	                var _axisLine = new Line$2({
	                    context: {
	                        start: {
	                            x: _originX,
	                            y: 0
	                        },
	                        end: {
	                            x: _originX,
	                            y: -me.height
	                        },
	                        lineWidth: me.axisLine.lineWidth,
	                        strokeStyle: me._getProp(me.axisLine.strokeStyle)
	                    }
	                });
	                this.sprite.addChild(_axisLine);
	            }

	            if (this._title) {
	                this._title.context.y = -this.height / 2;
	                this._title.context.x = this._title.getTextHeight() / 2;
	                if (this.align == "right") {
	                    this._title.context.x = this.width - this._title.getTextHeight() / 2;
	                }                this.sprite.addChild(this._title);
	            }        }
	    }, {
	        key: "_getProp",
	        value: function _getProp(s) {
	            var res = s;
	            if (_$10.isFunction(s)) {
	                res = s.call(this, this);
	            }
	            if (!s) {
	                res = "#999";
	            }
	            return res;
	        }
	    }]);
	    return yAxis;
	}(canvax.Event.EventDispatcher);

	var Line$3 = canvax.Shapes.Line;
	var Rect$1 = canvax.Shapes.Rect;
	var _$11 = canvax._;

	var descartesGrid = function (_Canvax$Event$EventDi) {
	    inherits$1(descartesGrid, _Canvax$Event$EventDi);

	    function descartesGrid(opt, root) {
	        classCallCheck$1(this, descartesGrid);

	        var _this = possibleConstructorReturn$1(this, (descartesGrid.__proto__ || Object.getPrototypeOf(descartesGrid)).call(this, opt, root));

	        _this.width = 0;
	        _this.height = 0;
	        _this.root = root; //该组件被添加到的目标图表项目，

	        _this.pos = {
	            x: 0,
	            y: 0
	        };

	        _this.enabled = 1;

	        _this.xDirection = { //x方向上的线
	            shapeType: "line",
	            enabled: 1,
	            data: [], //[{y:100},{}]
	            lineType: 'solid', //线条类型(dashed = 虚线 | '' = 实线)
	            lineWidth: 1,
	            strokeStyle: '#f0f0f0', //'#e5e5e5',
	            filter: null
	        };
	        _this.yDirection = { //y方向上的线
	            shapeType: "line",
	            enabled: 0,
	            data: [], //[{x:100},{}]
	            lineType: 'solid', //线条类型(dashed = 虚线 | '' = 实线)
	            lineWidth: 1,
	            strokeStyle: '#f0f0f0', //'#e5e5e5',
	            filter: null
	        };

	        _this.fill = {
	            enabled: true,
	            fillStyle: null,
	            alpha: null
	        };

	        _this.sprite = null; //总的sprite
	        _this.xAxisSp = null; //x轴上的线集合
	        _this.yAxisSp = null; //y轴上的线集合

	        _this.init(opt);
	        return _this;
	    }

	    createClass$1(descartesGrid, [{
	        key: "init",
	        value: function init(opt) {
	            _$11.extend(true, this, opt);
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
	            _$11.extend(true, this, opt);
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
	            var _yAxis = self.root._yAxis[0];

	            if (self.fill.enabled && self.root && _yAxis && _yAxis.dataSectionGroup && _yAxis.dataSectionGroup.length > 1) {
	                self.yGroupSp = new canvax.Display.Sprite(), self.sprite.addChild(self.yGroupSp);
	                for (var g = 0, gl = _yAxis.dataSectionGroup.length; g < gl; g++) {
	                    var yGroupHeight = _yAxis.height / gl;
	                    var groupRect = new Rect$1({
	                        context: {
	                            x: 0,
	                            y: -yGroupHeight * g,
	                            width: self.width,
	                            height: -yGroupHeight,
	                            fillStyle: self.fill.fillStyle || "#000",
	                            fillAlpha: self.fill.alpha || 0.025 * (g % 2)
	                        }
	                    });

	                    self.yGroupSp.addChild(groupRect);
	                }            }
	            self.xAxisSp = new canvax.Display.Sprite(), self.sprite.addChild(self.xAxisSp);
	            self.yAxisSp = new canvax.Display.Sprite(), self.sprite.addChild(self.yAxisSp);

	            //x轴方向的线集合
	            var arr = self.xDirection.data;
	            for (var a = 0, al = arr.length; a < al; a++) {
	                var o = arr[a];

	                var line = new Line$3({
	                    id: "back_line_" + a,
	                    context: {
	                        y: o.y,
	                        lineType: self.xDirection.lineType,
	                        lineWidth: self.xDirection.lineWidth,
	                        strokeStyle: self.xDirection.strokeStyle
	                    }
	                });
	                if (self.xDirection.enabled) {
	                    _$11.isFunction(self.xDirection.filter) && self.xDirection.filter.apply(line, [{
	                        layoutData: self.yDirection.data,
	                        index: a,
	                        line: line
	                    }, self]);

	                    self.xAxisSp.addChild(line);

	                    line.context.start.x = 0;
	                    line.context.end.x = self.width;
	                }            }
	            //y轴方向的线集合
	            var arr = self.yDirection.data;
	            for (var a = 0, al = arr.length; a < al; a++) {
	                var o = arr[a];
	                var line = new Line$3({
	                    context: {
	                        x: o.x,
	                        start: {
	                            x: 0,
	                            y: 0
	                        },
	                        end: {
	                            x: 0,
	                            y: -self.height
	                        },
	                        lineType: self.yDirection.lineType,
	                        lineWidth: self.yDirection.lineWidth,
	                        strokeStyle: self.yDirection.strokeStyle,
	                        visible: o.x ? true : false
	                    }
	                });
	                if (self.yDirection.enabled) {
	                    _$11.isFunction(self.yDirection.filter) && self.yDirection.filter.apply(line, [{
	                        layoutData: self.xDirection.data,
	                        index: a,
	                        line: line
	                    }, self]);
	                    self.yAxisSp.addChild(line);
	                }
	            }        }
	    }]);
	    return descartesGrid;
	}(canvax.Event.EventDispatcher);

	var _$12 = canvax._;
	var Rect$2 = canvax.Shapes.Rect;

	var Rect_Component = function (_coorBase) {
	    inherits$1(Rect_Component, _coorBase);

	    function Rect_Component(opt, root) {
	        classCallCheck$1(this, Rect_Component);

	        var _this = possibleConstructorReturn$1(this, (Rect_Component.__proto__ || Object.getPrototypeOf(Rect_Component)).call(this, opt, root));

	        _this.type = "rect";

	        _this._xAxis = null;
	        _this._yAxis = [];

	        _this._yAxisLeft = null;
	        _this._yAxisRight = null;
	        _this._grid = null;

	        _this.horizontal = false;

	        _this.xAxis = {
	            field: _this.dataFrame.fields[0]
	        };
	        _this.yAxis = [{
	            field: _this.dataFrame.fields.slice(1)
	        }];
	        _this.grid = {};

	        _$12.extend(true, _this, opt);

	        if (opt.horizontal) {
	            _this.xAxis.isH = true;
	            _$12.each(_this.yAxis, function (yAxis$$1) {
	                yAxis$$1.isH = true;
	            });
	        }
	        if ("enabled" in opt) {
	            //如果有给直角坐标系做配置display，就直接通知到xAxis，yAxis，grid三个子组件
	            _$12.extend(true, _this.xAxis, {
	                enabled: opt.enabled
	            });
	            _$12.each(_this.yAxis, function (yAxis$$1) {
	                _$12.extend(true, yAxis$$1, {
	                    enabled: opt.enabled
	                });
	            });

	            /*
	            this.xAxis.enabled = opt.enabled;
	            _.each( this.yAxis , function( yAxis ){
	                yAxis.enabled = opt.enabled;
	            });
	            */

	            _this.grid.enabled = opt.enabled;
	        }
	        _this.init(opt);
	        return _this;
	    }

	    createClass$1(Rect_Component, [{
	        key: "init",
	        value: function init(opt) {
	            this.sprite = new canvax.Display.Sprite({
	                id: "coord"
	            });
	            this._initModules();
	            //创建好了坐标系统后，设置 _fieldsDisplayMap 的值，
	            // _fieldsDisplayMap 的结构里包含每个字段是否在显示状态的enabled 和 这个字段属于哪个yAxis
	            this.fieldsMap = this._setFieldsMap();
	        }
	    }, {
	        key: "resetData",
	        value: function resetData(dataFrame, dataTrigger) {
	            var me = this;
	            this.dataFrame = dataFrame;

	            var _xAxisDataFrame = this._getAxisDataFrame(this.xAxis.field);
	            this._xAxis.resetData(_xAxisDataFrame);

	            _$12.each(this._yAxis, function (_yAxis) {
	                //这个_yAxis是具体的y轴实例
	                var yAxisDataFrame = me._getAxisDataFrame(_yAxis.field);
	                _yAxis.resetData(yAxisDataFrame);
	            });

	            this._grid.reset({
	                animation: false,
	                xDirection: {
	                    data: this._yAxisLeft.layoutData
	                }
	            });
	        }
	    }, {
	        key: "draw",
	        value: function draw(opt) {
	            //在绘制的时候，要先拿到xAxis的高

	            !opt && (opt = {});

	            var _padding = this.root.padding;

	            var h = opt.height || this.root.height;
	            var w = opt.width || this.root.width;
	            if (this.horizontal) {
	                //如果是横向的坐标系统，也就是xy对调，那么高宽也要对调
	                var _num = w;
	                w = h;
	                h = _num;
	            }
	            var y = h - this._xAxis.height - _padding.bottom;
	            var _yAxisW = 0;
	            var _yAxisRW = 0;

	            //绘制yAxis
	            if (this._yAxisLeft) {
	                this._yAxisLeft.draw({
	                    pos: {
	                        x: _padding.left,
	                        y: y
	                    },
	                    yMaxHeight: y - _padding.top,
	                    resize: opt.resize
	                });
	                _yAxisW = this._yAxisLeft.width;
	            }

	            //如果有双轴
	            if (this._yAxisRight) {
	                this._yAxisRight.draw({
	                    pos: {
	                        x: 0,
	                        y: y
	                    },
	                    yMaxHeight: y - _padding.top,
	                    resize: opt.resize
	                });
	                _yAxisRW = this._yAxisRight.width;
	            }
	            //绘制x轴
	            this._xAxis.draw({
	                pos: {
	                    x: _padding.left + _yAxisW,
	                    y: y
	                },
	                width: w - _yAxisW - _padding.left - _yAxisRW - _padding.right,
	                resize: opt.resize
	            });

	            this._yAxisRight && this._yAxisRight.setX(_yAxisW + _padding.left + this._xAxis.width);

	            //绘制背景网格
	            this._grid.draw({
	                width: this._xAxis.width,
	                height: this._yAxis[0].height,
	                xDirection: {
	                    data: this._yAxis[0].layoutData
	                },
	                yDirection: {
	                    data: this._xAxis.layoutData
	                },
	                pos: {
	                    x: _yAxisW + _padding.left,
	                    y: y
	                },
	                resize: opt.resize
	            });

	            this.width = this._xAxis.width;
	            this.height = this._yAxis[0].height;
	            this.origin.x = _yAxisW + _padding.left;
	            this.origin.y = y;

	            this._initInduce();

	            if (this.horizontal) {
	                this._horizontal({
	                    w: w,
	                    h: h
	                });

	                /*
	                this.width = this._yAxis[0].height;
	                this.height = this._xAxis.width;
	                this.origin.x = this._xAxis.height + _padding.left;
	                this.origin.y = this._yAxis[0].height + _padding.top;
	                */
	            }
	        }
	    }, {
	        key: "_initModules",
	        value: function _initModules() {
	            this._grid = new descartesGrid(this.grid, this);
	            this.sprite.addChild(this._grid.sprite);

	            var _xAxisDataFrame = this._getAxisDataFrame(this.xAxis.field);
	            this._xAxis = new xAxis(this.xAxis, _xAxisDataFrame, this);
	            this.sprite.addChild(this._xAxis.sprite);

	            //这里定义的是配置
	            var yAxis$$1 = this.yAxis;
	            var yAxisLeft, yAxisRight;
	            var yAxisLeftDataFrame, yAxisRightDataFrame;

	            // yAxis 肯定是个数组
	            if (!_$12.isArray(yAxis$$1)) {
	                yAxis$$1 = [yAxis$$1];
	            }
	            //left是一定有的
	            yAxisLeft = _$12.find(yAxis$$1, function (ya) {
	                return ya.align == "left";
	            });

	            if (yAxisLeft) {
	                yAxisLeftDataFrame = this._getAxisDataFrame(yAxisLeft.field);
	                this._yAxisLeft = new yAxis(yAxisLeft, yAxisLeftDataFrame);
	                this._yAxisLeft.axis = yAxisLeft;
	                this.sprite.addChild(this._yAxisLeft.sprite);
	                this._yAxis.push(this._yAxisLeft);
	            }

	            yAxisRight = _$12.find(yAxis$$1, function (ya) {
	                return ya.align == "right";
	            });
	            if (yAxisRight) {
	                yAxisRightDataFrame = this._getAxisDataFrame(yAxisRight.field);
	                this._yAxisRight = new yAxis(yAxisRight, yAxisRightDataFrame);
	                this._yAxisRight.axis = yAxisRight;
	                this.sprite.addChild(this._yAxisRight.sprite);
	                this._yAxis.push(this._yAxisRight);
	            }        }

	        /**
	         * 
	         * @param {x,y} size 
	         */

	    }, {
	        key: "_horizontal",
	        value: function _horizontal(opt) {
	            var me = this;
	            var w = opt.h;
	            var h = opt.w;

	            _$12.each([me.sprite.context], function (ctx) {

	                ctx.x += (w - h) / 2;
	                ctx.y += (h - w) / 2;

	                var origin = {
	                    x: h / 2,
	                    y: w / 2
	                };

	                ctx.rotation = 90;
	                ctx.rotateOrigin = origin;
	            });
	        }
	    }, {
	        key: "getPosX",
	        value: function getPosX(opt) {
	            return this._xAxis.getPosX(opt);
	        }
	    }, {
	        key: "_getAxisDataFrame",
	        value: function _getAxisDataFrame(fields) {
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

	        //从 fieldsMap 中过滤筛选出来一个一一对应的 enabled为true的对象结构
	        //这个方法还必须要返回的数据里描述出来多y轴的结构。否则外面拿到数据后并不好处理那个数据对应哪个轴

	    }, {
	        key: "getEnabledFields",
	        value: function getEnabledFields(fields) {
	            if (fields) {
	                //如果有传参数 fields 进来，那么就把这个指定的 fields 过滤掉 enabled==false的field
	                //只留下enabled的field 结构
	                return this.filterEnabledFields(fields);
	            }
	            var fmap = {
	                left: [], right: []
	            };

	            _$12.each(this.fieldsMap, function (bamboo, b) {
	                if (_$12.isArray(bamboo)) {
	                    //多节竹子，堆叠

	                    var align;
	                    var fields = [];

	                    //设置完fields后，返回这个group属于left还是right的axis
	                    _$12.each(bamboo, function (obj, v) {
	                        if (obj.field && obj.enabled) {
	                            align = obj.yAxis.align;
	                            fields.push(obj.field);
	                        }
	                    });

	                    fields.length && fmap[align].push(fields);
	                } else {
	                    //单节棍
	                    if (bamboo.field && bamboo.enabled) {
	                        fmap[bamboo.yAxis.align].push(bamboo.field);
	                    }
	                }            });

	            return fmap;
	        }

	        //由coor_base中得addField removeField来调用

	    }, {
	        key: "changeFieldEnabled",
	        value: function changeFieldEnabled(field) {
	            this.setFieldEnabled(field);
	            var fieldMap = this.getFieldMapOf(field);
	            var enabledFields = this.getEnabledFields()[fieldMap.yAxis.align];
	            fieldMap.yAxis.resetData(this._getAxisDataFrame(enabledFields));

	            //然后yAxis更新后，对应的背景也要更新
	            this._grid.reset({
	                animation: false,
	                xDirection: {
	                    data: this._yAxisLeft ? this._yAxisLeft.layoutData : this._yAxisRight.layoutData
	                }
	            });
	        }

	        //查询field在哪个yAxis上面,外部查询的话直接用fieldMap._yAxis

	    }, {
	        key: "_getYaxisOfField",
	        value: function _getYaxisOfField(field) {
	            var Axis;
	            _$12.each(this._yAxis, function (_yAxis, i) {
	                var fs = _yAxis.field;
	                var _fs = _$12.flatten([fs]);
	                var ind = _$12.indexOf(_fs, field);
	                if (ind > -1) {
	                    //那么说明这个yAxis轴上面有这个字段，这个yaxis需要reset
	                    Axis = _yAxis;
	                    return false;
	                }
	            });
	            return Axis;
	        }

	        //和原始field结构保持一致，但是对应的field换成 {field: , enabled:...}结构

	    }, {
	        key: "_setFieldsMap",
	        value: function _setFieldsMap() {
	            var me = this;
	            var fieldInd = 0;

	            function _set(fields) {
	                if (!fields) {
	                    var yAxis$$1 = me.yAxis;
	                    if (!_$12.isArray(yAxis$$1)) {
	                        yAxis$$1 = [yAxis$$1];
	                    }                    fields = [];
	                    _$12.each(yAxis$$1, function (item, i) {
	                        if (item.field) {
	                            fields = fields.concat(item.field);
	                        }                    });
	                }
	                if (_$12.isString(fields)) {
	                    fields = [fields];
	                }
	                var clone_fields = _$12.clone(fields);
	                for (var i = 0, l = fields.length; i < l; i++) {
	                    if (_$12.isString(fields[i])) {

	                        clone_fields[i] = {
	                            field: fields[i],
	                            enabled: true,
	                            yAxis: me._getYaxisOfField(fields[i]),
	                            color: me.root.getTheme(fieldInd),
	                            ind: fieldInd++
	                        };
	                    }
	                    if (_$12.isArray(fields[i])) {
	                        clone_fields[i] = _set(fields[i], fieldInd);
	                    }
	                }
	                return clone_fields;
	            }
	            return _set();
	        }
	    }, {
	        key: "_initInduce",
	        value: function _initInduce() {
	            var me = this;
	            me.induce = new Rect$2({
	                id: "induce",
	                context: {
	                    x: me.origin.x,
	                    y: me.origin.y - me.height,
	                    width: me.width,
	                    height: me.height,
	                    fillStyle: '#000000',
	                    globalAlpha: 0,
	                    cursor: 'pointer'
	                }
	            });

	            if (!me.sprite.getChildById("induce")) {
	                me.sprite.addChild(me.induce);
	            }
	            me.induce.on("panstart mouseover panmove mousemove panend mouseout tap click dblclick", function (e) {
	                //e.eventInfo = me._getInfoHandler(e);
	                me.fire(e.type, e);
	                //图表触发，用来处理Tips
	                me.root.fire(e.type, e);
	            });
	        }
	    }, {
	        key: "getTipsInfoHandler",
	        value: function getTipsInfoHandler(e) {
	            //这里只获取xAxis的刻度信息;
	            var induceX = e.point.x;
	            if (e.target !== this.induce) {
	                induceX = this.induce.globalToLocal(e.target.localToGlobal(e.point)).x;
	            }
	            var xNode = this._xAxis.getNodeInfoOfX(induceX);

	            var obj = {
	                xAxis: xNode,
	                title: xNode.text,
	                nodes: [
	                    //遍历_graphs 去拿东西
	                ]
	            };

	            if (e.eventInfo) {
	                obj = _$12.extend(obj, e.eventInfo);

	                //把xNode信息写到eventInfo上面
	                if (obj.xAxis) {
	                    e.eventInfo.xAxis = xNode;
	                }            }
	            return obj;
	        }
	    }]);
	    return Rect_Component;
	}(coorBase);

	var _$13 = canvax._;

	var Rect$3 = function (_CoordBase) {
	    inherits$1(Rect, _CoordBase);

	    function Rect(node, data, opts, graphsMap, componentsMap) {
	        classCallCheck$1(this, Rect);

	        //坐标系统
	        var _this = possibleConstructorReturn$1(this, (Rect.__proto__ || Object.getPrototypeOf(Rect)).call(this, node, data, opts, graphsMap, componentsMap));

	        _this.CoordComponents = Rect_Component;
	        _this._coord = null;
	        return _this;
	    }

	    //设置这个坐标系下面特有的 opts 默认值
	    //以及往this上面写部分默认数据
	    //在CoordBase中被调用


	    createClass$1(Rect, [{
	        key: "setDefaultOpts",
	        value: function setDefaultOpts(opts) {
	            var me = this;
	            me.coord = {
	                xAxis: {
	                    //波峰波谷布局模型，默认是柱状图的，折线图种需要做覆盖
	                    layoutType: "rule", //"peak",  
	                    //默认为false，x轴的计量是否需要取整， 这样 比如某些情况下得柱状图的柱子间隔才均匀。
	                    //比如一像素间隔的柱状图，如果需要精确的绘制出来每个柱子的间距是1px， 就必须要把这里设置为true
	                    posParseToInt: false
	                }
	            };

	            opts = _$13.clone(opts);
	            if (opts.coord.yAxis) {
	                var _nyarr = [];
	                //TODO: 因为我们的deep extend 对于数组是整个对象引用过去，所以，这里需要
	                //把每个子元素单独clone一遍，恩恩恩， 在canvax中优化extend对于array的处理
	                _$13.each(_$13.flatten([opts.coord.yAxis]), function (yopt) {
	                    _nyarr.push(_$13.clone(yopt));
	                });
	                opts.coord.yAxis = _nyarr;
	            } else {
	                opts.coord.yAxis = [];
	            }

	            //根据opt中得Graphs配置，来设置 coord.yAxis
	            if (opts.graphs) {
	                //有graphs的就要用找到这个graphs.field来设置coord.yAxis
	                for (var i = 0; i < opts.graphs.length; i++) {
	                    var graphs = opts.graphs[i];
	                    if (graphs.type == "bar") {
	                        //如果graphs里面有柱状图，那么就整个xAxis都强制使用 peak 的layoutType
	                        me.coord.xAxis.layoutType = "peak";
	                    }
	                    if (graphs.field) {
	                        //没有配置field的话就不绘制这个 graphs了
	                        var align = "left"; //默认left
	                        if (graphs.yAxisAlign == "right") {
	                            align = "right";
	                        }
	                        var optsYaxisObj = null;
	                        optsYaxisObj = _$13.find(opts.coord.yAxis, function (obj, i) {
	                            return obj.align == align || !obj.align && i == (align == "left" ? 0 : 1);
	                        });

	                        if (!optsYaxisObj) {
	                            optsYaxisObj = {
	                                align: align,
	                                field: []
	                            };
	                            opts.coord.yAxis.push(optsYaxisObj);
	                        } else {
	                            if (!optsYaxisObj.align) {
	                                optsYaxisObj.align = align;
	                            }
	                        }

	                        if (!optsYaxisObj.field) {
	                            optsYaxisObj.field = [];
	                        } else {
	                            if (!_$13.isArray(optsYaxisObj.field)) {
	                                optsYaxisObj.field = [optsYaxisObj.field];
	                            }
	                        }

	                        if (_$13.isArray(graphs.field)) {
	                            optsYaxisObj.field = optsYaxisObj.field.concat(graphs.field);
	                        } else {
	                            optsYaxisObj.field.push(graphs.field);
	                        }
	                    } else {
	                        //在，直角坐标系中，每个graphs一定要有一个field设置，如果没有，就去掉这个graphs
	                        opts.graphs.splice(i--, 1);
	                    }
	                }
	            }            //再梳理一遍yAxis，get没有align的手动配置上align
	            //要手动把yAxis 按照 left , right的顺序做次排序
	            var _lys = [],
	                _rys = [];
	            _$13.each(opts.coord.yAxis, function (yAxis, i) {
	                if (!yAxis.align) {
	                    yAxis.align = i ? "right" : "left";
	                }
	                if (yAxis.align == "left") {
	                    _lys.push(yAxis);
	                } else {
	                    _rys.push(yAxis);
	                }
	            });
	            opts.coord.yAxis = _lys.concat(_rys);

	            return opts;
	        }
	    }, {
	        key: "drawBeginHorizontal",
	        value: function drawBeginHorizontal() {
	            //横向了之后， 要把4个padding值轮换一下
	            //top,right 对调 ， bottom,left 对调
	            var padding = this.padding;

	            var num = padding.top;
	            padding.top = padding.right;
	            padding.right = padding.bottom;
	            padding.bottom = padding.left;
	            padding.left = num;
	        }

	        //绘制完毕后的横向处理

	    }, {
	        key: "drawEndHorizontal",
	        value: function drawEndHorizontal() {
	            var me = this;

	            var ctx = me.graphsSprite.context;
	            ctx.x += (me.width - me.height) / 2;
	            ctx.y += (me.height - me.width) / 2;
	            ctx.rotation = 90;
	            ctx.rotateOrigin = { x: me.height / 2, y: me.width / 2 };

	            function _horizontalText(el) {

	                if (el.children) {
	                    _$13.each(el.children, function (_el) {
	                        _horizontalText(_el);
	                    });
	                }                if (el.type == "text") {

	                    var ctx = el.context;
	                    var w = ctx.width;
	                    var h = ctx.height;

	                    ctx.rotation = ctx.rotation - 90;
	                }            }

	            _$13.each(me._graphs, function (_graphs) {
	                _horizontalText(_graphs.sprite);
	            });
	        }

	        //只有field为多组数据的时候才需要legend，给到legend组件来调用

	    }, {
	        key: "getLegendData",
	        value: function getLegendData() {
	            var me = this;
	            var data = [];

	            _$13.each(_$13.flatten(me._coord.fieldsMap), function (map, i) {
	                //因为yAxis上面是可以单独自己配置field的，所以，这部分要过滤出 legend data
	                var isGraphsField = false;
	                _$13.each(me.graphs, function (gopt) {
	                    if (_$13.indexOf(_$13.flatten([gopt.field]), map.field) > -1) {
	                        isGraphsField = true;
	                        return false;
	                    }
	                });

	                if (isGraphsField) {
	                    data.push({
	                        enabled: map.enabled,
	                        name: map.field,
	                        field: map.field,
	                        ind: map.ind,
	                        color: map.color,
	                        yAxis: map.yAxis
	                    });
	                }
	            });
	            return data;
	        }
	        ////设置图例end

	        //把这个点位置对应的x轴数据和y轴数据存到 tips 的 info 里面
	        //方便外部自定义 tip 是的 content

	    }, {
	        key: "setTipsInfo",
	        value: function setTipsInfo(e) {

	            e.eventInfo = this._coord.getTipsInfoHandler(e);

	            //如果具体的e事件对象中有设置好了得 e.eventInfo.nodes，那么就不再遍历_graphs去取值
	            //比如鼠标移动到多柱子组合的具体某根bar上面，e.eventInfo.nodes = [ {bardata} ] 就有了这个bar的数据
	            //那么tips就只显示这个bardata的数据
	            if (!e.eventInfo.nodes || !e.eventInfo.nodes.length) {
	                var nodes = [];
	                var iNode = e.eventInfo.xAxis.ind;
	                _$13.each(this._graphs, function (_g) {
	                    nodes = nodes.concat(_g.getNodesAt(iNode));
	                });
	                e.eventInfo.nodes = nodes;
	            }
	        }
	    }]);
	    return Rect;
	}(Coord);

	var Line$4 = canvax.Shapes.Line;
	var Circle$1 = canvax.Shapes.Circle;
	var Polygon$1 = canvax.Shapes.Polygon;

	var _$14 = canvax._;

	var polarGrid = function (_Canvax$Event$EventDi) {
	    inherits$1(polarGrid, _Canvax$Event$EventDi);

	    function polarGrid(opt, root) {
	        classCallCheck$1(this, polarGrid);

	        var _this = possibleConstructorReturn$1(this, (polarGrid.__proto__ || Object.getPrototypeOf(polarGrid)).call(this, opt, root));

	        _this.width = 0;
	        _this.height = 0;
	        _this.root = root; //该组件被添加到的目标图表项目，

	        _this.pos = {
	            x: 0,
	            y: 0
	        };

	        _this.enabled = false;

	        //环
	        _this.ring = {
	            shapeType: "poly",
	            lineType: "sold",
	            lineWidth: 1,
	            strokeStyle: "#e5e5e5", //["#f9f9f9", "#f7f7f7"],
	            fillStyle: null, //["#f9f9f9", "#f7f7f7"],
	            fillAlpha: 0.5
	        };

	        //射线
	        _this.ray = {
	            enabled: true,
	            lineWidth: 1,
	            strokeStyle: "#e5e5e5"
	        };

	        _this.dataSection = [];

	        _this.sprite = null; //总的sprite

	        _this.animation = true;

	        _this.induce = null; //最外层的那个网，用来触发事件

	        _this.init(opt);
	        return _this;
	    }

	    createClass$1(polarGrid, [{
	        key: "init",
	        value: function init(opt) {
	            _$14.extend(true, this, opt);
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
	            _$14.extend(true, this, opt);

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
	            var me = this;
	            _$14.each(this.dataSection, function (num, i) {

	                if (num) {
	                    var r = me.root.getROfNum(num);
	                    var points = me.root.getPointsOfR(r);

	                    var ctx = {
	                        //lineType : me.ring.lineType,
	                        lineWidth: me.ring.lineWidth,
	                        strokeStyle: me._getStyle(me.ring.strokeStyle, i - 1), //me.ring.strokeStyle,
	                        fillStyle: me._getStyle(me.ring.fillStyle, i - 1),
	                        fillAlpha: me.ring.fillAlpha
	                    };

	                    var _ring;
	                    var ringType = Circle$1;
	                    if (me.ring.shapeType == "circle") {
	                        ctx.r = r;
	                        _ring = new ringType({
	                            context: ctx
	                        });
	                    } else {
	                        ctx.pointList = [];
	                        _$14.each(points, function (point, i) {
	                            if (i < points.length) {
	                                ctx.pointList.push([point.x, point.y]);
	                            }
	                        });
	                        ringType = Polygon$1;
	                        _ring = new ringType({
	                            context: ctx
	                        });
	                    }                    me.sprite.addChildAt(_ring, 0);

	                    if (i == me.dataSection.length - 1) {
	                        ctx.fillAlpha = 0;
	                        ctx.fillStyle = "#ffffff";
	                        me.induce = new ringType({
	                            context: ctx
	                        });
	                        me.sprite.addChild(me.induce);
	                    }
	                    _$14.each(points, function (point) {
	                        var _line = new Line$4({
	                            context: {
	                                end: point,
	                                lineWidth: me.ring.lineWidth,
	                                strokeStyle: me.ring.strokeStyle
	                            }
	                        });
	                        me.sprite.addChild(_line);
	                    });
	                }
	            });
	        }
	    }, {
	        key: "_getStyle",
	        value: function _getStyle(color, i) {
	            if (_$14.isArray(color)) {
	                return color[i % color.length];
	            }
	            return color;
	        }
	    }]);
	    return polarGrid;
	}(canvax.Event.EventDispatcher);

	//极坐标 坐标轴

	var _$15 = canvax._;

	var polarComponent = function (_coorBase) {
	    inherits$1(polarComponent, _coorBase);

	    function polarComponent(opt, root) {
	        classCallCheck$1(this, polarComponent);

	        var _this = possibleConstructorReturn$1(this, (polarComponent.__proto__ || Object.getPrototypeOf(polarComponent)).call(this, opt, root));

	        _this.type = "polar";

	        _this.allAngle = 360; //默认是个周园

	        _this.aAxis = {
	            field: null,
	            layoutType: "average", // average 弧度均分， proportion 和直角坐标中的一样
	            data: [],
	            angleList: [], //对应layoutType下的角度list
	            beginAngle: -90,

	            //刻度尺,在最外沿的蜘蛛网上面
	            layoutData: [], //aAxis.data的 label.format后版本
	            enabled: opt.aAxis && opt.aAxis.field,
	            label: {
	                enabled: true,
	                format: function format(v) {
	                    return v;
	                },
	                fontColor: "#666"
	            }
	        };

	        _this.rAxis = {
	            field: [],
	            dataSection: null,
	            //半径刻度尺,从中心点触发，某个角度达到最外沿的蜘蛛网为止
	            enabled: false
	        };

	        _this.grid = {
	            enabled: false
	        };

	        _this.maxR = null;
	        _this.squareRange = true; //default true, 说明将会绘制一个width===height的矩形范围内，否则就跟着画布走

	        _$15.extend(true, _this, opt);

	        if (!_this.aAxis.field) {
	            //如果aAxis.field都没有的话，是没法绘制grid的，所以grid的enabled就是false
	            _this.grid.enabled = false;
	        }
	        _this.init(opt);
	        return _this;
	    }

	    createClass$1(polarComponent, [{
	        key: "init",
	        value: function init(opt) {
	            this.sprite = new canvax.Display.Sprite({
	                id: "coord_polar"
	            });

	            this._initModules();

	            //创建好了坐标系统后，设置 _fieldsDisplayMap 的值，
	            // _fieldsDisplayMap 的结构里包含每个字段是否在显示状态的enabled 和 这个字段属于哪个yAxis
	            this.fieldsMap = this._setFieldsMap();
	        }
	    }, {
	        key: "resetData",
	        value: function resetData(dataFrame, dataTrigger) {}
	    }, {
	        key: "draw",
	        value: function draw(opt) {
	            !opt && (opt = {});

	            //先计算好要绘制的width,height, origin
	            this._computeAttr();

	            this.rAxis.dataSection = this._getRDataSection();
	            this.aAxis.data = this.root.dataFrame.getFieldData(this.aAxis.field);

	            this._setAAxisAngleList();

	            if (this.grid.enabled) {

	                this._grid.draw({
	                    pos: this.origin,
	                    width: this.width,
	                    height: this.height,
	                    dataSection: this.rAxis.dataSection
	                }, this);

	                if (this.aAxis.enabled) {
	                    this._drawAAxisScale();
	                }
	                this._initInduce();
	            }        }
	    }, {
	        key: "changeFieldEnabled",
	        value: function changeFieldEnabled(field) {

	            this.setFieldEnabled(field);

	            this.rAxis.dataSection = this._getRDataSection();
	            this.aAxis.data = this.root.dataFrame.getFieldData(this.aAxis.field);

	            if (this.grid.enabled) {

	                this._grid.reset({
	                    dataSection: this.rAxis.dataSection
	                }, this);
	            }        }

	        //从 fieldsMap 中过滤筛选出来一个一一对应的 enabled为true的对象结构
	        //这个方法还必须要返回的数据里描述出来多y轴的结构。否则外面拿到数据后并不好处理那个数据对应哪个轴

	    }, {
	        key: "getEnabledFields",
	        value: function getEnabledFields(fields) {
	            if (fields) {
	                //如果有传参数 fields 进来，那么就把这个指定的 fields 过滤掉 enabled==false的field
	                //只留下enabled的field 结构
	                return this.filterEnabledFields(fields);
	            }
	            var fmap = [];

	            _$15.each(this.fieldsMap, function (bamboo, b) {
	                if (_$15.isArray(bamboo)) {
	                    //多节竹子
	                    var fields = [];

	                    //设置完fields后，返回这个group属于left还是right的axis
	                    _$15.each(bamboo, function (obj, v) {
	                        if (obj.field && obj.enabled) {
	                            fields.push(obj.field);
	                        }
	                    });

	                    fields.length && fmap.push(fields);
	                } else {
	                    //单节棍
	                    if (bamboo.field && bamboo.enabled) {
	                        fmap.push(bamboo.field);
	                    }
	                }            });

	            return fmap;
	        }

	        //和原始field结构保持一致，但是对应的field换成 {field: , enabled:...}结构
	        //目前没用到二维堆叠的功能，但是这段代码和直角坐标系中得保持一致，具备这样得能力

	    }, {
	        key: "_setFieldsMap",
	        value: function _setFieldsMap() {
	            var me = this;
	            var fieldInd = 0;

	            function _set(fields) {
	                if (!fields) {
	                    fields = me.rAxis.field;
	                }
	                if (_$15.isString(fields)) {
	                    fields = [fields];
	                }
	                var clone_fields = _$15.clone(fields);
	                for (var i = 0, l = fields.length; i < l; i++) {
	                    if (_$15.isString(fields[i])) {
	                        clone_fields[i] = {
	                            field: fields[i],
	                            enabled: true,
	                            color: me.root.getTheme(fieldInd),
	                            ind: fieldInd++,
	                            group: null //这个field对应的ui分组
	                        };
	                    }
	                    if (_$15.isArray(fields[i])) {
	                        clone_fields[i] = _set(fields[i], fieldInd);
	                    }
	                }
	                return clone_fields;
	            }
	            return _set();
	        }
	    }, {
	        key: "_getRDataSection",
	        value: function _getRDataSection() {
	            var me = this;
	            //如果用户有主动配置了dataSection,是不需要计算dataSection的
	            //目前没有做堆叠的dataSection，后面有需要直接从yAxis的模块中拿
	            if (!this._opts.rAxis.dataSection) {
	                var arr = [];
	                _$15.each(_$15.flatten([me.rAxis.field]), function (field) {
	                    arr = arr.concat(me.root.dataFrame.getFieldData(field));
	                });

	                var _dataSection = DataSection.section(arr, 3);

	                return _dataSection;
	            }
	        }
	    }, {
	        key: "_initModules",
	        value: function _initModules() {
	            if (this.grid.enabled) {
	                this._grid = new polarGrid(this.grid, this);
	                this.sprite.addChild(this._grid.sprite);
	            }            if (this.aAxis.enabled && this.grid.enabled) {
	                this._aAxisScaleSp = new canvax.Display.Sprite({
	                    id: "aAxisScaleSp"
	                });
	                this.sprite.addChild(this._aAxisScaleSp);
	            }        }
	    }, {
	        key: "_computeAttr",
	        value: function _computeAttr() {
	            var _padding = this.root.padding;
	            var rootWidth = this.root.width;
	            var rootHeight = this.root.height;

	            if (!("width" in this._opts)) {
	                this.width = rootWidth - _padding.left - _padding.right;
	            }            if (!("height" in this._opts)) {
	                this.height = rootHeight - _padding.top - _padding.bottom;
	            }
	            if (this.aAxis.enabled) {
	                this.width -= 20 * 2;
	                this.height -= 20 * 2;
	            }
	            //重置width和height ， 不能和上面的计算origin调换位置
	            if (this.squareRange) {
	                var _num = Math.min(this.width, this.height);
	                this.width = this.height = _num;
	            }
	            if (!("origin" in this._opts)) {
	                //如果没有传入任何origin数据，则默认为中心点
	                //origin是相对画布左上角的
	                this.origin = {
	                    x: _padding.left + (rootWidth - _padding.left - _padding.right) / 2, //rootWidth/2,
	                    y: _padding.top + (rootHeight - _padding.top - _padding.bottom) / 2 //rootHeight/2
	                };
	            }
	            //计算maxR
	            //如果外面要求过 maxR，
	            var origin = this.origin;
	            var _maxR;
	            if (origin.x != this.width / 2 || origin.y != this.height / 2) {
	                var _distances = [origin.x, this.width - origin.x, origin.y, this.height - origin.y];
	                _maxR = _$15.max(_distances);
	            } else {
	                _maxR = Math.max(this.width / 2, this.height / 2);
	            }
	            if (!(this.maxR != null && this.maxR <= _maxR)) {
	                this.maxR = _maxR;
	            }        }

	        //获取极坐标系内任意半径上的弧度集合
	        //[ [{point , radian} , {point , radian}] ... ]

	    }, {
	        key: "getRadiansAtR",
	        value: function getRadiansAtR(r, width, height) {

	            var me = this;
	            if (width == undefined) {
	                width = this.width;
	            }            if (height == undefined) {
	                height = this.height;
	            }
	            var _rs = [];
	            if (r > this.maxR) {
	                return [];
	            } else {
	                //下面的坐标点都是已经origin为原点的坐标系统里

	                //矩形的4边框线段
	                var _padding = this.root.padding;

	                //这个origin 是相对在width，height矩形范围内的圆心，
	                //而this.origin 是在整个画布的位置
	                var origin = {
	                    x: this.origin.x - _padding.left - (this.width - width) / 2,
	                    y: this.origin.y - _padding.top - (this.height - height) / 2
	                };
	                var x, y;

	                //于上边界的相交点
	                //最多有两个交点
	                var distanceT = origin.y;
	                if (distanceT < r) {
	                    x = Math.sqrt(Math.pow(r, 2) - Math.pow(distanceT, 2));
	                    _rs = _rs.concat(this._filterPointsInRect([{ x: -x, y: -distanceT }, { x: x, y: -distanceT }], origin, width, height));
	                }
	                //于右边界的相交点
	                //最多有两个交点
	                var distanceR = width - origin.x;
	                if (distanceR < r) {
	                    y = Math.sqrt(Math.pow(r, 2) - Math.pow(distanceR, 2));
	                    _rs = _rs.concat(this._filterPointsInRect([{ x: distanceR, y: -y }, { x: distanceR, y: y }], origin, width, height));
	                }                //于下边界的相交点
	                //最多有两个交点
	                var distanceB = height - origin.y;
	                if (distanceB < r) {
	                    x = Math.sqrt(Math.pow(r, 2) - Math.pow(distanceB, 2));
	                    _rs = _rs.concat(this._filterPointsInRect([{ x: x, y: distanceB }, { x: -x, y: distanceB }], origin, width, height));
	                }                //于左边界的相交点
	                //最多有两个交点
	                var distanceL = origin.x;
	                if (distanceL < r) {
	                    y = Math.sqrt(Math.pow(r, 2) - Math.pow(distanceL, 2));
	                    _rs = _rs.concat(this._filterPointsInRect([{ x: -distanceL, y: y }, { x: -distanceL, y: -y }], origin, width, height));
	                }
	                var arcs = []; //[ [{point , radian} , {point , radian}] ... ]
	                //根据相交点的集合，分割弧段
	                if (_rs.length == 0) {
	                    //说明整圆都在画布内
	                    //[ [0 , 2*Math.PI] ];
	                    arcs.push([{ point: { x: r, y: 0 }, radian: 0 }, { point: { x: r, y: 0 }, radian: Math.PI * 2 }]);
	                } else {
	                    //分割多段
	                    _$15.each(_rs, function (point, i) {
	                        var nextInd = i == _rs.length - 1 ? 0 : i + 1;
	                        var nextPoint = _rs.slice(nextInd, nextInd + 1)[0];
	                        arcs.push([{ point: point, radian: me.getRadianInPoint(point) }, { point: nextPoint, radian: me.getRadianInPoint(nextPoint) }]);
	                    });
	                }
	                //过滤掉不在rect内的弧线段
	                for (var i = 0, l = arcs.length; i < l; i++) {
	                    if (!this._checkArcInRect(arcs[i], r, origin, width, height)) {
	                        arcs.splice(i, 1);
	                        i--, l--;
	                    }
	                }                return arcs;
	            }
	        }
	    }, {
	        key: "_filterPointsInRect",
	        value: function _filterPointsInRect(points, origin, width, height) {
	            for (var i = 0, l = points.length; i < l; i++) {
	                if (!this._checkPointInRect(points[i], origin, width, height)) {
	                    //该点不在root rect范围内，去掉
	                    points.splice(i, 1);
	                    i--, l--;
	                }
	            }            return points;
	        }
	    }, {
	        key: "_checkPointInRect",
	        value: function _checkPointInRect(p, origin, width, height) {
	            var _tansRoot = { x: p.x + origin.x, y: p.y + origin.y };
	            return !(_tansRoot.x < 0 || _tansRoot.x > width || _tansRoot.y < 0 || _tansRoot.y > height);
	        }

	        //检查由n个相交点分割出来的圆弧是否在rect内

	    }, {
	        key: "_checkArcInRect",
	        value: function _checkArcInRect(arc, r, origin, width, height) {
	            var start = arc[0];
	            var to = arc[1];
	            var differenceR = to.radian - start.radian;
	            if (to.radian < start.radian) {
	                differenceR = Math.PI * 2 + to.radian - start.radian;
	            }            var middleR = (start.radian + differenceR / 2) % (Math.PI * 2);
	            return this._checkPointInRect(this.getPointInRadianOfR(middleR, r), origin, width, height);
	        }

	        //获取某个点相对圆心的弧度值

	    }, {
	        key: "getRadianInPoint",
	        value: function getRadianInPoint(point) {
	            var pi2 = Math.PI * 2;
	            return (Math.atan2(point.y, point.x) + pi2) % pi2;
	        }

	        //获取某个弧度方向，半径为r的时候的point坐标点位置

	    }, {
	        key: "getPointInRadianOfR",
	        value: function getPointInRadianOfR(radian, r) {
	            var pi = Math.PI;
	            var x = Math.cos(radian) * r;
	            if (radian == pi / 2 || radian == pi * 3 / 2) {
	                //90度或者270度的时候
	                x = 0;
	            }            var y = Math.sin(radian) * r;
	            if (radian % pi == 0) {
	                y = 0;
	            }            return {
	                x: x,
	                y: y
	            };
	        }

	        //获取这个num在dataSectio中对应的半径

	    }, {
	        key: "getROfNum",
	        value: function getROfNum(num) {
	            var r = 0;
	            var maxNum = _$15.max(this.rAxis.dataSection);
	            var minNum = 0; //Math.min( this.rAxis.dataSection );
	            var maxR = parseInt(Math.max(this.width, this.height) / 2);

	            r = maxR * ((num - minNum) / (maxNum - minNum));
	            return r;
	        }

	        //获取在r的半径上面，沿aAxis的points

	    }, {
	        key: "getPointsOfR",
	        value: function getPointsOfR(r) {
	            var me = this;
	            var points = [];
	            _$15.each(me.aAxis.angleList, function (_a) {
	                //弧度
	                var _r = Math.PI * _a / 180;
	                var point = me.getPointInRadianOfR(_r, r);
	                points.push(point);
	            });
	            return points;
	        }
	    }, {
	        key: "_setAAxisAngleList",
	        value: function _setAAxisAngleList() {
	            var me = this;

	            me.aAxis.angleList = [];

	            var aAxisArr = this.aAxis.data;
	            if (this.aAxis.layoutType == "average") {
	                aAxisArr = [];
	                for (var i = 0, l = this.aAxis.data.length; i < l; i++) {
	                    aAxisArr.push(i);
	                }
	            }
	            var allAngle = this.allAngle;

	            var min = 0;
	            var max = _$15.max(aAxisArr);
	            if (this.aAxis.layoutType == "average") {
	                max++;
	            }
	            _$15.each(aAxisArr, function (p) {
	                //角度
	                var _a = (allAngle * ((p - min) / (max - min)) + me.aAxis.beginAngle + allAngle) % allAngle;
	                me.aAxis.angleList.push(_a);
	            });
	        }
	    }, {
	        key: "_drawAAxisScale",
	        value: function _drawAAxisScale() {
	            //绘制aAxis刻度尺
	            var me = this;
	            var r = me.getROfNum(_$15.max(this.rAxis.dataSection));
	            var points = me.getPointsOfR(r + 3);

	            me._aAxisScaleSp.context.x = this.origin.x;
	            me._aAxisScaleSp.context.y = this.origin.y;

	            _$15.each(this.aAxis.data, function (value, i) {

	                if (!me.aAxis.label.enabled) return;

	                var point = points[i];
	                var c = {
	                    x: point.x,
	                    y: point.y,
	                    fillStyle: me.aAxis.label.fontColor
	                };

	                var text = me.aAxis.label.format(value);
	                _$15.extend(c, me._getTextAlignForPoint(Math.atan2(point.y, point.x)));
	                me._aAxisScaleSp.addChild(new canvax.Display.Text(text, {
	                    context: c
	                }));

	                me.aAxis.layoutData.push(text);
	            });
	        }

	        /**
	         *把弧度分为4大块区域-90 --> 0 , 0-->90 , 90-->180, -180-->-90
	         **/

	    }, {
	        key: "_getTextAlignForPoint",
	        value: function _getTextAlignForPoint(r) {
	            var textAlign = "center";
	            var textBaseline = "bottom";

	            /* 默认的就不用判断了
	            if(r==-Math.PI/2){
	                return {
	                    textAlign    : "center",
	                    textBaseline : "bottom"
	                }
	            }
	            */
	            if (r > -Math.PI / 2 && r < 0) {
	                textAlign = "left";
	                textBaseline = "bottom";
	            }
	            if (r == 0) {
	                textAlign = "left";
	                textBaseline = "middle";
	            }
	            if (r > 0 && r < Math.PI / 2) {
	                textAlign = "left";
	                textBaseline = "top";
	            }
	            if (r == Math.PI / 2) {
	                textAlign = "center";
	                textBaseline = "top";
	            }
	            if (r > Math.PI / 2 && r < Math.PI) {
	                textAlign = "right";
	                textBaseline = "top";
	            }
	            if (r == Math.PI || r == -Math.PI) {
	                textAlign = "right";
	                textBaseline = "middle";
	            }
	            if (r > -Math.PI && r < -Math.PI / 2) {
	                textAlign = "right";
	                textBaseline = "bottom";
	            }
	            return {
	                textAlign: textAlign,
	                textBaseline: textBaseline
	            };
	        }
	    }, {
	        key: "getAxisNodeOf",
	        value: function getAxisNodeOf(e) {
	            var me = this;
	            var aAxisInd = me.getAAxisIndOf(e);

	            if (aAxisInd === undefined) {
	                return;
	            }

	            var node = {
	                ind: aAxisInd,
	                value: me.aAxis.data[aAxisInd],
	                text: me.aAxis.layoutData[aAxisInd],
	                angle: me.aAxis.angleList[aAxisInd]
	            };
	            return node;
	        }

	        //从event中计算出来这个e.point对应origin的index分段索引值

	    }, {
	        key: "getAAxisIndOf",
	        value: function getAAxisIndOf(e) {
	            var me = this;

	            if (e.aAxisInd !== undefined) {
	                return e.aAxisInd;
	            }
	            if (!me.aAxis.angleList.length) {
	                return;
	            }
	            var point = e.point;

	            //angle全部都换算到0-360范围内
	            var angle = (me.getRadianInPoint(point) * 180 / Math.PI - me.aAxis.beginAngle) % me.allAngle;
	            var r = Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.y, 2));

	            var aAxisInd = 0;
	            var aLen = me.aAxis.angleList.length;
	            _$15.each(me.aAxis.angleList, function (_a, i) {

	                _a = (_a - me.aAxis.beginAngle) % me.allAngle;

	                var nextInd = i + 1;
	                var nextAngle = (me.aAxis.angleList[nextInd] - me.aAxis.beginAngle) % me.allAngle;
	                if (i == aLen - 1) {
	                    nextInd = 0;
	                    nextAngle = me.allAngle;
	                }
	                //把两个极角坐标都缩放到r所在的维度上面
	                if (angle >= _a && angle <= nextAngle) {
	                    //说明就再这个angle区间
	                    if (angle - _a < nextAngle - angle) {
	                        aAxisInd = i;
	                    } else {
	                        aAxisInd = nextInd;
	                    }
	                    return false;
	                }            });
	            return aAxisInd;
	        }
	    }, {
	        key: "_initInduce",
	        value: function _initInduce() {
	            var me = this;
	            me.induce = this._grid.induce;
	            me.induce && me.induce.on("panstart mouseover panmove mousemove panend mouseout tap click dblclick", function (e) {
	                me.fire(e.type, e);
	                //图表触发，用来处理Tips
	                me.root.fire(e.type, e);
	            });
	        }
	    }, {
	        key: "getTipsInfoHandler",
	        value: function getTipsInfoHandler(e) {
	            //这里只获取xAxis的刻度信息;
	            var me = this;

	            var aNode = me.getAxisNodeOf(e);

	            var obj = {
	                //aAxis : aNode,
	                //title : aNode.label,
	                nodes: [
	                    //遍历_graphs 去拿东西
	                ]
	            };
	            if (aNode) {
	                obj.aAxis = aNode;
	                obj.title = aNode.text;
	            }
	            if (e.eventInfo) {
	                obj = _$15.extend(obj, e.eventInfo);
	            }            return obj;
	        }
	    }]);
	    return polarComponent;
	}(coorBase);

	var _$16 = canvax._;

	var Polar = function (_CoordBase) {
	    inherits$1(Polar, _CoordBase);

	    function Polar(node, data, opt, graphsMap, componentsMap) {
	        classCallCheck$1(this, Polar);

	        //坐标系统
	        var _this = possibleConstructorReturn$1(this, (Polar.__proto__ || Object.getPrototypeOf(Polar)).call(this, node, data, opt, graphsMap, componentsMap));

	        _this.CoordComponents = polarComponent;
	        _this._coord = null;

	        return _this;
	    }

	    //设置这个坐标系下面特有的 opt 默认值
	    //以及往this上面写部分默认数据
	    //在CoordBase中被调用


	    createClass$1(Polar, [{
	        key: "setDefaultOpts",
	        value: function setDefaultOpts(opt) {
	            this.coord = {
	                rAxis: {
	                    field: []
	                }
	            };

	            //根据graphs.field 来 配置 this.coord.rAxis.field -------------------
	            if (!_$16.isArray(this.coord.rAxis.field)) {
	                this.coord.rAxis.field = [this.coord.rAxis.field];
	            }            if (opt.graphs) {
	                //有graphs的就要用找到这个graphs.field来设置coord.rAxis
	                var arrs = [];
	                _$16.each(opt.graphs, function (graphs) {
	                    if (graphs.field) {
	                        //没有配置field的话就不绘制这个 graphs了
	                        var _fs = graphs.field;
	                        if (!_$16.isArray(_fs)) {
	                            _fs = [_fs];
	                        }                        arrs = arrs.concat(_fs);
	                    }                });
	            }            this.coord.rAxis.field = this.coord.rAxis.field.concat(arrs);

	            return opt;
	        }
	    }, {
	        key: "getLegendData",
	        value: function getLegendData() {
	            var legendData = [
	                //{name: "uv", style: "#ff8533", enabled: true, ind: 0}
	            ];
	            _$16.each(this._graphs, function (_g) {
	                _$16.each(_g.getLegendData(), function (item) {

	                    if (_$16.find(legendData, function (d) {
	                        return d.name == item.name;
	                    })) return;

	                    var data = _$16.extend(true, {}, item);
	                    data.color = item.fillStyle || item.color || item.style;

	                    legendData.push(data);
	                });
	            });
	            return legendData;
	        }

	        //把这个点位置对应的x轴数据和y轴数据存到tips的info里面
	        //方便外部自定义tip是的content

	    }, {
	        key: "setTipsInfo",
	        value: function setTipsInfo(e) {
	            e.eventInfo = this._coord.getTipsInfoHandler(e);
	            //如果具体的e事件对象中有设置好了得e.eventInfo.nodes，那么就不再遍历_graphs去取值
	            if (!e.eventInfo.nodes || !e.eventInfo.nodes.length) {
	                var nodes = [];
	                var iNode = e.eventInfo.aAxis.ind;
	                _$16.each(this._graphs, function (_g) {
	                    nodes = nodes.concat(_g.getNodesAt(iNode));
	                });
	                e.eventInfo.nodes = nodes;
	            }        }
	    }]);
	    return Polar;
	}(Coord);

	var _$17 = canvax._;

	var GraphsBase = function (_Canvax$Event$EventDi) {
	    inherits$1(GraphsBase, _Canvax$Event$EventDi);

	    function GraphsBase(opt, root) {
	        classCallCheck$1(this, GraphsBase);

	        //这里所有的opts都要透传给 group
	        var _this = possibleConstructorReturn$1(this, (GraphsBase.__proto__ || Object.getPrototypeOf(GraphsBase)).call(this, opt, root));

	        _this._opts = opt || {};
	        _this.root = root;
	        _this.ctx = root.stage.canvas.getContext("2d");
	        _this.dataFrame = root.dataFrame; //root.dataFrame的引用

	        _this.data = null; //没个graphs中自己_trimGraphs的数据

	        _this.sprite = null;

	        _this.width = 0;
	        _this.height = 0;
	        _this.origin = {
	            x: 0,
	            y: 0
	        };

	        _this.animation = true;
	        _this.inited = false;
	        return _this;
	    }

	    createClass$1(GraphsBase, [{
	        key: "tipsPointerOf",
	        value: function tipsPointerOf(e) {}
	    }, {
	        key: "tipsPointerHideOf",
	        value: function tipsPointerHideOf(e) {}
	    }, {
	        key: "focusAt",
	        value: function focusAt(ind, field) {}
	    }, {
	        key: "unfocusAt",
	        value: function unfocusAt(ind, field) {}
	    }, {
	        key: "selectAt",
	        value: function selectAt(ind, field) {}
	    }, {
	        key: "unselectAt",
	        value: function unselectAt(ind, field) {}
	        //获取选中的 数据点

	    }, {
	        key: "getSelectedList",
	        value: function getSelectedList() {
	            return [];
	        }
	        //获取选中的 列数据, 比如柱状图中的多分组，选中一列数据，则包函了这分组内的所有柱子

	    }, {
	        key: "getSelectedRowList",
	        value: function getSelectedRowList() {
	            return [];
	        }
	    }, {
	        key: "hide",
	        value: function hide(field) {}
	    }, {
	        key: "show",
	        value: function show(field) {}
	    }, {
	        key: "getLegendData",
	        value: function getLegendData() {}

	        //触发事件, 事件处理函数中的this都指向对应的graphs对象。

	    }, {
	        key: "triggerEvent",
	        value: function triggerEvent(eventTargetOpt, e) {
	            var fn = eventTargetOpt["on" + e.type];
	            if (fn && _$17.isFunction(fn)) {
	                if (e.eventInfo && e.eventInfo.nodes && e.eventInfo.nodes.length) {
	                    if (e.eventInfo.nodes.length == 1) {
	                        fn.apply(this, [e, e.eventInfo.nodes[0]]);
	                    } else {
	                        fn.apply(this, [e, e.eventInfo.nodes]);
	                    }
	                } else {
	                    var _arr = [];
	                    _$17.each(arguments, function (item, i) {
	                        if (!!i) {
	                            _arr.push(item);
	                        }
	                    });
	                    fn.apply(this, _arr);
	                }
	            }        }
	    }]);
	    return GraphsBase;
	}(canvax.Event.EventDispatcher);

	var AnimationFrame$1 = canvax.AnimationFrame;
	var BrokenLine$1 = canvax.Shapes.BrokenLine;
	var Rect$4 = canvax.Shapes.Rect;
	var _$18 = canvax._;

	var BarGraphs = function (_GraphsBase) {
	    inherits$1(BarGraphs, _GraphsBase);

	    function BarGraphs(opt, root) {
	        classCallCheck$1(this, BarGraphs);

	        var _this = possibleConstructorReturn$1(this, (BarGraphs.__proto__ || Object.getPrototypeOf(BarGraphs)).call(this, opt, root));

	        _this.type = "bar";

	        _this.field = null;
	        _this.enabledField = null;

	        _this.yAxisAlign = "left"; //默认设置为左y轴
	        _this._xAxis = _this.root._coord._xAxis;

	        //trimGraphs的时候是否需要和其他的 bar graphs一起并排计算，true的话这个就会和别的重叠
	        //和css中得absolute概念一致，脱离文档流的绝对定位
	        _this.absolute = false;

	        _this.proportion = false; //比例柱状图，比例图首先肯定是个堆叠图

	        _this.node = {
	            shapeType: 'rect',
	            width: 0,
	            _width: 0,
	            maxWidth: 50,
	            minWidth: 1,
	            minHeight: 0,

	            radius: 3,
	            fillStyle: null,
	            fillAlpha: 0.95,
	            _count: 0, //总共有多少个bar
	            xDis: null,
	            filter: null
	        };

	        _this.label = {
	            enabled: false,
	            animation: true,
	            fontColor: null, //如果有设置text.fontColor那么优先使用fontColor
	            fontSize: 12,
	            format: null,
	            lineWidth: 0,
	            strokeStyle: null,

	            rotation: 0,
	            align: "center", //left center right
	            verticalAlign: "bottom", //top middle bottom
	            position: "top", //top,topRight,right,rightBottom,bottom,bottomLeft,left,leftTop,center
	            offsetX: 0,
	            offsetY: 0
	        };

	        //分组的选中，不是选中具体的某个node，这里的选中靠groupRegion来表现出来
	        _this.select = {
	            enabled: false,
	            alpha: 0.2,
	            fillStyle: null,
	            _fillStyle: "#092848", //和bar.fillStyle一样可以支持array function
	            triggerEventType: "click",
	            width: 1,
	            inds: [] //选中的列的索引集合,注意，这里的ind不是当前视图的ind，而是加上了dataFrame.range.start的全局ind
	        };

	        _this._barsLen = 0;

	        _this.txtsSp = null;

	        _$18.extend(true, _this, opt);

	        _this.init();

	        return _this;
	    }

	    createClass$1(BarGraphs, [{
	        key: "init",
	        value: function init() {
	            this.sprite = new canvax.Display.Sprite({
	                id: "graphsEl"
	            });

	            this.barsSp = new canvax.Display.Sprite({
	                id: "barsSp"
	            });
	            this.txtsSp = new canvax.Display.Sprite({
	                id: "txtsSp",
	                context: {
	                    //visible: false
	                }
	            });
	        }
	    }, {
	        key: "getNodesAt",
	        value: function getNodesAt(index) {
	            //该index指当前
	            var data = this.data;

	            var _nodesInfoList = []; //节点信息集合
	            _$18.each(this.enabledField, function (fs, i) {
	                if (_$18.isArray(fs)) {
	                    _$18.each(fs, function (_fs, ii) {
	                        //fs的结构两层到顶了
	                        var nodeData = data[_fs] ? data[_fs][index] : null;
	                        nodeData && _nodesInfoList.push(nodeData);
	                    });
	                } else {
	                    var nodeData = data[fs] ? data[fs][index] : null;
	                    nodeData && _nodesInfoList.push(nodeData);
	                }
	            });

	            return _nodesInfoList;
	        }
	    }, {
	        key: "_getTargetField",
	        value: function _getTargetField(b, v, i, field) {
	            if (_$18.isString(field)) {
	                return field;
	            } else if (_$18.isArray(field)) {
	                var res = field[b];
	                if (_$18.isString(res)) {
	                    return res;
	                } else if (_$18.isArray(res)) {
	                    return res[v];
	                }            }
	        }
	    }, {
	        key: "_getColor",
	        value: function _getColor(c, rectData, _flattenField) {
	            var value = rectData.value;
	            var field = rectData.field;

	            var fieldMap = this.root._coord.getFieldMapOf(field);
	            var color;

	            //field对应的索引，， 取颜色这里不要用i
	            if (_$18.isString(c)) {
	                color = c;
	            }            if (_$18.isArray(c)) {
	                color = _$18.flatten(c)[_$18.indexOf(_flattenField, field)];
	            }            if (_$18.isFunction(c)) {
	                color = c.apply(this, [rectData]);
	            }
	            if (color === undefined || color === null) {
	                //只有undefined(用户配置了function),null才会认为需要还原皮肤色
	                //“”都会认为是用户主动想要设置的，就为是用户不想他显示
	                color = fieldMap.color;
	            }
	            return color;
	        }
	    }, {
	        key: "_getBarWidth",
	        value: function _getBarWidth(ceilWidth, ceilWidth2) {
	            if (this.node.width) {
	                if (_$18.isFunction(this.node.width)) {
	                    this.node._width = this.node.width(ceilWidth);
	                } else {
	                    this.node._width = this.node.width;
	                }
	            } else {
	                this.node._width = ceilWidth2 - Math.max(1, ceilWidth2 * 0.2);

	                //这里的判断逻辑用意已经忘记了，先放着， 有问题在看
	                if (this.node._width == 1 && ceilWidth > 3) {
	                    this.node._width = ceilWidth - 2;
	                }            }            this.node._width < 1 && (this.node._width = 1);
	            this.node._width = parseInt(this.node._width);
	            if (this.node._width > this.node.maxWidth) {
	                this.node._width = this.node.maxWidth;
	            }            return this.node._width;
	        }
	    }, {
	        key: "show",
	        value: function show(field) {
	            this.draw();
	        }
	    }, {
	        key: "hide",
	        value: function hide(field) {
	            _$18.each(this.barsSp.children, function (h_groupSp, h) {
	                var _bar = h_groupSp.getChildById("bar_" + h + "_" + field);
	                _bar && _bar.destroy();
	            });
	            _$18.each(this.txtsSp.children, function (sp, h) {
	                var _label = sp.getChildById("text_" + h + "_" + field);
	                _label && _label.destroy();
	            });

	            this.draw();
	        }
	    }, {
	        key: "resetData",
	        value: function resetData(dataFrame, dataTrigger) {
	            this.dataFrame = dataFrame;
	            this.draw();
	        }
	    }, {
	        key: "clean",
	        value: function clean() {
	            this.data = {};
	            this.barsSp.removeAllChildren();
	            if (this.label.enabled) {
	                this.txtsSp.removeAllChildren();
	            }        }
	    }, {
	        key: "draw",
	        value: function draw(opt) {

	            !opt && (opt = {});

	            //第二个data参数去掉，直接trimgraphs获取最新的data
	            _$18.extend(true, this, opt);

	            var me = this;

	            var animate = me.animation && !opt.resize;

	            this.data = this._trimGraphs();

	            if (this.enabledField.length == 0 || this._dataLen == 0) {
	                me._preDataLen = 0;
	                this.clean();
	                return;
	            }
	            var preDataLen = me._preDataLen; //纵向的分组，主要用于 resetData 的时候，对比前后data数量用

	            var groupsLen = this.enabledField.length;
	            var itemW = 0;

	            me.node._count = 0;

	            var _flattenField = _$18.flatten([this.field]);

	            _$18.each(this.enabledField, function (h_group, i) {

	                h_group = _$18.flatten([h_group]);
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

	                //if (h <= preDataLen - 1)的话说明本次绘制之前sprite里面已经有bar了。需要做特定的动画效果走过去

	                var vLen = h_group.length;
	                if (vLen == 0) return;

	                //itemW 还是要跟着xAxis的xDis保持一致
	                itemW = me.width / me._dataLen;

	                me._barsLen = me._dataLen * groupsLen;

	                for (var h = 0; h < me._dataLen; h++) {

	                    //bar的group
	                    var groupH = null;
	                    if (i == 0) {
	                        //横向的分组
	                        if (h <= preDataLen - 1) {
	                            groupH = me.barsSp.getChildById("barGroup_" + h);
	                        } else {
	                            groupH = new canvax.Display.Sprite({
	                                id: "barGroup_" + h
	                            });
	                            me.barsSp.addChild(groupH);
	                            groupH.iNode = h;
	                        }
	                        //这个x轴单元 nodes的分组，添加第一个rect用来接受一些事件处理
	                        //以及显示selected状态
	                        var groupRegion;
	                        var groupRegionWidth = itemW * me.select.width;
	                        if (me.select.width > 1) {
	                            //说明是具体指
	                            groupRegionWidth = me.select.width;
	                        }
	                        if (h <= preDataLen - 1) {
	                            groupRegion = groupH.getChildById("group_region_" + h);
	                            groupRegion.context.width = groupRegionWidth;
	                            groupRegion.context.x = itemW * h + (itemW - groupRegionWidth) / 2;
	                        } else {

	                            groupRegion = new Rect$4({
	                                id: "group_region_" + h,
	                                pointChkPriority: false,
	                                hoverClone: false,
	                                xyToInt: false,
	                                context: {
	                                    x: itemW * h + (itemW - groupRegionWidth) / 2,
	                                    y: -me.height,
	                                    width: groupRegionWidth,
	                                    height: me.height,
	                                    fillStyle: me._getGroupRegionStyle(h),
	                                    globalAlpha: _$18.indexOf(me.select.inds, me.dataFrame.range.start + h) > -1 ? me.select.alpha : 0
	                                }
	                            });
	                            groupH.addChild(groupRegion);

	                            groupRegion.iNode = h;
	                            //触发注册的事件
	                            groupRegion.on('mousedown mouseup panstart mouseover panmove mousemove panend mouseout tap click dblclick', function (e) {

	                                e.eventInfo = {
	                                    iNode: this.iNode
	                                    //TODO:这里设置了的话，会导致多graphs里获取不到别的graphs的nodes信息了
	                                    //nodes : me.getNodesAt( this.iNode ) 
	                                };

	                                //触发root统一设置e.eventInfo.nodes,所以上面不需要设置
	                                me.root.fire(e.type, e);

	                                if (me.select.enabled && e.type == me.select.triggerEventType) {
	                                    //如果开启了图表的选中交互
	                                    var ind = me.dataFrame.range.start + this.iNode;
	                                    if (_$18.indexOf(me.select.inds, ind) > -1) {
	                                        //说明已经选中了
	                                        me.unselectAt(ind);
	                                    } else {
	                                        me.selectAt(ind);
	                                    }
	                                }
	                                me.triggerEvent(me, e);
	                            });
	                        }
	                    } else {
	                        groupH = me.barsSp.getChildById("barGroup_" + h);
	                    }
	                    //txt的group begin
	                    var txtGroupH = null;
	                    if (i == 0) {
	                        if (h <= preDataLen - 1) {
	                            txtGroupH = me.txtsSp.getChildById("txtGroup_" + h);
	                        } else {
	                            txtGroupH = new canvax.Display.Sprite({
	                                id: "txtGroup_" + h
	                            });
	                            me.txtsSp.addChild(txtGroupH);
	                            txtGroupH.iGroup = i;
	                        }                    } else {
	                        txtGroupH = me.txtsSp.getChildById("txtGroup_" + h);
	                    }                    //txt的group begin

	                    for (var v = 0; v < vLen; v++) {

	                        me.node._count++;

	                        //单个的bar，从纵向的底部开始堆叠矩形
	                        var rectData = me.data[h_group[v]][h];

	                        rectData.iGroup = i, rectData.iNode = h, rectData.iLay = v;

	                        var fillStyle = me._getColor(me.node.fillStyle, rectData, _flattenField);

	                        rectData.color = fillStyle;

	                        var rectH = rectData.y - rectData.fromY;

	                        if (isNaN(rectH)) {
	                            rectH = 0;
	                        } else {
	                            if (Math.abs(rectH) < me.node.minHeight) {
	                                rectH = me.node.minHeight;
	                            }
	                        }
	                        var finalPos = {
	                            x: Math.round(rectData.x),
	                            y: rectData.fromY,
	                            width: me.node._width,
	                            height: rectH,
	                            fillStyle: fillStyle,
	                            fillAlpha: me.node.fillAlpha,
	                            scaleY: -1
	                        };
	                        rectData.width = finalPos.width;

	                        var rectCtx = {
	                            x: finalPos.x,
	                            y: rectData.yBasePoint.y, //0,
	                            width: finalPos.width,
	                            height: finalPos.height,
	                            fillStyle: finalPos.fillStyle,
	                            fillAlpha: me.node.fillAlpha,
	                            scaleY: 0
	                        };

	                        if (!!me.node.radius && rectData.isLeaf && !me.proportion) {
	                            var radiusR = Math.min(me.node._width / 2, Math.abs(rectH));
	                            radiusR = Math.min(radiusR, me.node.radius);
	                            rectCtx.radius = [radiusR, radiusR, 0, 0];
	                        }
	                        if (!animate) {
	                            delete rectCtx.scaleY;
	                            rectCtx.y = finalPos.y;
	                        }
	                        var rectEl = null;
	                        var barId = "bar_" + h + "_" + rectData.field;
	                        if (h <= preDataLen - 1) {
	                            rectEl = groupH.getChildById(barId);
	                        }                        if (rectEl) {
	                            rectEl.context.fillStyle = fillStyle;
	                        } else {
	                            rectEl = new Rect$4({
	                                id: barId,
	                                context: rectCtx
	                            });
	                            rectEl.field = rectData.field;
	                            groupH.addChild(rectEl);
	                        }
	                        rectEl.finalPos = finalPos;
	                        rectEl.iGroup = i, rectEl.iNode = h, rectEl.iLay = v;

	                        //nodeData, nodeElement ， data和图形之间互相引用的属性约定
	                        rectEl.nodeData = rectData;
	                        rectData.nodeElement = rectEl;

	                        me.node.filter && me.node.filter.apply(rectEl, [rectData, me]);

	                        //label begin ------------------------------
	                        if (me.label.enabled) {

	                            var value = rectData.value;
	                            if (_$18.isFunction(me.label.format)) {
	                                var _formatc = me.label.format(value, rectData);
	                                if (_formatc !== undefined || _formatc !== null) {
	                                    value = _formatc;
	                                }
	                            }
	                            if (value === undefined || value === null || value === "") {
	                                continue;
	                            }
	                            if (_$18.isNumber(value)) {
	                                value = numAddSymbol(value);
	                            }
	                            var textCtx = {
	                                fillStyle: me.label.fontColor || finalPos.fillStyle,
	                                fontSize: me.label.fontSize,
	                                lineWidth: me.label.lineWidth,
	                                strokeStyle: me.label.strokeStyle || finalPos.fillStyle,
	                                //textAlign   : me.label.align,
	                                textBaseline: me.label.verticalAlign,
	                                rotation: me.label.rotation
	                            };
	                            //然后根据position, offset确定x,y
	                            var _textPos = me._getTextPos(finalPos, rectData);
	                            textCtx.x = _textPos.x;
	                            textCtx.y = _textPos.y;
	                            textCtx.textAlign = me._getTextAlign(finalPos, rectData);

	                            //文字
	                            var textEl = null;
	                            var textId = "text_" + h + "_" + rectData.field;
	                            if (h <= preDataLen - 1) {
	                                textEl = txtGroupH.getChildById(textId);
	                            }                            if (textEl) {
	                                //do something
	                                textEl.resetText(value);
	                                textEl.context.x = textCtx.x;
	                                textEl.context.y = textCtx.y;
	                            } else {
	                                textEl = new canvax.Display.Text(value, {
	                                    id: textId,
	                                    context: textCtx
	                                });
	                                textEl.field = rectData.field;
	                                txtGroupH.addChild(textEl);
	                            }                        }
	                        //label end ------------------------------
	                    }                }
	            });

	            this.sprite.addChild(this.barsSp);
	            //如果有text设置， 就要吧text的txtsSp也添加到sprite
	            if (this.label.enabled) {
	                this.sprite.addChild(this.txtsSp);
	            }
	            this.sprite.context.x = this.origin.x;
	            this.sprite.context.y = this.origin.y;

	            this.grow(function () {
	                me.fire("complete");
	            }, {
	                delay: 0,
	                duration: 300,
	                animate: animate
	            });

	            me._preDataLen = me._dataLen;
	        }
	    }, {
	        key: "setEnabledField",
	        value: function setEnabledField() {
	            //要根据自己的 field，从enabledFields中根据enabled数据，计算一个 enabled版本的field子集
	            this.enabledField = this.root._coord.getEnabledFields(this.field);
	        }
	    }, {
	        key: "_getGroupRegionStyle",
	        value: function _getGroupRegionStyle(iNode) {
	            var me = this;
	            var _groupRegionStyle = me.select.fillStyle;
	            if (_$18.isArray(me.select.fillStyle)) {
	                _groupRegionStyle = me.select.fillStyle[h];
	            }            if (_$18.isFunction(me.select.fillStyle)) {
	                _groupRegionStyle = me.select.fillStyle.apply(this, [{
	                    iNode: iNode,
	                    rowData: me.dataFrame.getRowData(iNode)
	                }]);
	            }            if (_groupRegionStyle === undefined || _groupRegionStyle === null) {
	                return me.select._fillStyle;
	            }
	            return _groupRegionStyle;
	        }
	    }, {
	        key: "_trimGraphs",
	        value: function _trimGraphs() {
	            var me = this;
	            var _xAxis = this._xAxis;
	            var _coord = this.root._coord;

	            //用来计算下面的hLen
	            this.setEnabledField();
	            this.data = {};

	            var layoutGraphs = [];
	            var hLen = 0; //总共有多少列（ 一个xAxis单元分组内 ）
	            var preHLen = 0; //自己前面有多少个列（ 一个xAxis单元分组内 ）
	            var _preHLenOver = false;

	            if (!this.absolute) {
	                _$18.each(this.root._graphs, function (_g) {
	                    if (!_g.absolute && _g.type == "bar") {
	                        if (_g === me) {
	                            _preHLenOver = true;
	                        }                        if (_preHLenOver) {
	                            //排在me后面的 graphs，需要计算setEnabledField，才能计算出来 全部的hLen
	                            _g.setEnabledField();
	                        } else {
	                            preHLen += _g.enabledField.length;
	                        }
	                        hLen += _g.enabledField.length;
	                        layoutGraphs.push(_g);
	                    }
	                });
	            } else {
	                layoutGraphs = [this];
	                hLen = this.enabledField.length;
	            }
	            var ceilWidth = _xAxis.ceilWidth;
	            //x方向的二维长度，就是一个bar分组里面可能有n个子bar柱子，那么要二次均分
	            var ceilWidth2 = ceilWidth / (hLen + 1);

	            //知道了ceilWidth2 后 检测下 barW是否需要调整
	            var barW = this._getBarWidth(ceilWidth, ceilWidth2);
	            var barDis = ceilWidth2 - barW;
	            if (this.node.xDis != null) {
	                barDis = this.node.xDis;
	            }
	            var disLeft = (ceilWidth - barW * hLen - barDis * (hLen - 1)) / 2;
	            if (preHLen) {
	                disLeft += (barDis + barW) * preHLen;
	            }
	            //var tmpData = [];
	            var _yAxis = this.yAxisAlign == "left" ? _coord._yAxisLeft : _coord._yAxisRight;

	            //然后计算出对于结构的dataOrg
	            var dataOrg = this.dataFrame.getDataOrg(this.enabledField);

	            //dataOrg和field是一一对应的
	            _$18.each(dataOrg, function (hData, b) {
	                //hData，可以理解为一根竹子 横向的分组数据，这个hData上面还可能有纵向的堆叠

	                //tempBarData 一根柱子的数据， 这个柱子是个数据，上面可以有n个子元素对应的竹节
	                var tempBarData = [];
	                _$18.each(hData, function (vSectionData, v) {
	                    tempBarData[v] = [];
	                    //vSectionData 代表某个字段下面的一组数据比如 uv

	                    me._dataLen = vSectionData.length;

	                    //vSectionData为具体的一个field对应的一组数据
	                    _$18.each(vSectionData, function (val, i) {

	                        var vCount = val;
	                        if (me.proportion) {
	                            //先计算总量
	                            vCount = 0;
	                            _$18.each(hData, function (team, ti) {
	                                vCount += team[i];
	                            });
	                        }
	                        var _x = _xAxis.getPosX({
	                            ind: i,
	                            dataLen: me._dataLen,
	                            layoutType: _coord ? _coord.xAxis.layoutType : me.root._xAxis.layoutType
	                        });

	                        var x = _x - ceilWidth / 2 + disLeft + (barW + barDis) * b;

	                        var y = 0;
	                        if (me.proportion) {
	                            y = -val / vCount * _yAxis.height;
	                        } else {
	                            y = _yAxis.getYposFromVal(val);
	                        }
	                        function _getFromY(tempBarData, v, i, val, y, yBasePoint) {
	                            var preData = tempBarData[v - 1];
	                            if (!preData) {
	                                return yBasePoint.y;
	                            }
	                            var preY = preData[i].y;
	                            var preVal = preData[i].value;
	                            var yBaseNumber = yBasePoint.value;
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
	                        var fromY = _getFromY(tempBarData, v, i, val, y, _yAxis.basePoint);
	                        y += fromY - _yAxis.basePoint.y;

	                        var nodeData = {
	                            type: "bar",
	                            value: val,
	                            vInd: v, //如果是堆叠图的话，这个node在堆叠中得位置
	                            vCount: vCount, //纵向方向的总数,比瑞堆叠了uv(100),pv(100),那么这个vCount就是200，比例柱状图的话，外部tips定制content的时候需要用到
	                            field: me._getTargetField(b, v, i, me.enabledField),
	                            fromX: x,
	                            fromY: fromY,
	                            x: x,
	                            y: y,
	                            width: barW,
	                            yBasePoint: _yAxis.basePoint,
	                            isLeaf: true,
	                            xAxis: _xAxis.getNodeInfoOfX(_x),
	                            iNode: i,
	                            rowData: me.dataFrame.getRowData(i),
	                            color: null
	                        };

	                        if (!me.data[nodeData.field]) {
	                            me.data[nodeData.field] = tempBarData[v];
	                        }
	                        tempBarData[v].push(nodeData);
	                    });
	                });

	                //tempBarData.length && tmpData.push( tempBarData );
	            });

	            return me.data;
	            //return tmpData;
	        }
	    }, {
	        key: "_getTextAlign",
	        value: function _getTextAlign(bar, rectData) {
	            var align = this.label.align;
	            if (rectData.value < rectData.yBasePoint.value) {
	                if (align == "left") {
	                    align = "right";
	                } else if (align == "right") {
	                    align = "left";
	                }
	            }            return align;
	        }
	    }, {
	        key: "_getTextPos",
	        value: function _getTextPos(bar, rectData) {

	            var me = this;
	            var point = {
	                x: 0, y: 0
	            };
	            var x = bar.x,
	                y = bar.y;
	            switch (me.label.position) {
	                case "top":
	                    x = bar.x + bar.width / 2;
	                    y = bar.y + bar.height;
	                    break;
	                case "topRight":
	                    x = bar.x + bar.width;
	                    y = bar.y + bar.height;
	                    break;
	                case "right":
	                    x = bar.x + bar.width;
	                    y = bar.y + bar.height / 2;
	                    break;
	                case "rightBottom":
	                    x = bar.x + bar.width;
	                    y = bar.y;
	                    break;
	                case "bottom":
	                    x = bar.x + bar.width / 2;
	                    y = bar.y;
	                    break;
	                case "bottomLeft":
	                    x = bar.x;
	                    y = bar.y;
	                    break;
	                case "left":
	                    x = bar.x;
	                    y = bar.y + bar.height / 2;
	                    break;
	                case "leftTop":
	                    x = bar.x;
	                    y = bar.y + bar.height;
	                    break;
	                case "center":
	                    x = bar.x + bar.width / 2;
	                    y = bar.y + bar.height / 2;
	                    break;
	            }            x -= me.label.offsetX;

	            var i = 1;
	            if (rectData.value < rectData.yBasePoint.value) {
	                i = -1;
	            }            y -= i * me.label.offsetY;
	            point.x = x;
	            point.y = y;
	            return point;
	        }

	        /**
	         * 生长动画
	         */

	    }, {
	        key: "grow",
	        value: function grow(callback, opt) {

	            var me = this;
	            //console.log( me._preDataLen+"|"+ me._dataLen)
	            //先把已经不在当前range范围内的元素destroy掉
	            if (me._preDataLen > me._dataLen) {
	                for (var i = me._dataLen, l = me._preDataLen; i < l; i++) {
	                    me.barsSp.getChildAt(i).destroy();
	                    me.label.enabled && me.txtsSp.getChildAt(i).destroy();
	                    i--;
	                    l--;
	                }            }
	            if (!opt.animate) {
	                callback && callback(me);
	                return;
	            }            var sy = 1;

	            var optsions = _$18.extend({
	                delay: Math.min(1000 / this._barsLen, 80),
	                easing: "Linear.None", //"Back.Out",
	                duration: 500
	            }, opt);

	            var barCount = 0;
	            _$18.each(me.enabledField, function (h_group, g) {
	                h_group = _$18.flatten([h_group]);
	                var vLen = h_group.length;
	                if (vLen == 0) return;

	                for (var h = 0; h < me._dataLen; h++) {
	                    for (var v = 0; v < vLen; v++) {

	                        var rectData = me.data[h_group[v]][h];

	                        var group = me.barsSp.getChildById("barGroup_" + h);

	                        var bar = group.getChildById("bar_" + h + "_" + rectData.field);

	                        if (optsions.duration == 0) {
	                            bar.context.scaleY = sy;
	                            bar.context.y = sy * sy * bar.finalPos.y;
	                            bar.context.x = bar.finalPos.x;
	                            bar.context.width = bar.finalPos.width;
	                            bar.context.height = bar.finalPos.height;
	                        } else {
	                            if (bar._tweenObj) {
	                                AnimationFrame$1.destroyTween(bar._tweenObj);
	                            }                            bar._tweenObj = bar.animate({
	                                scaleY: sy,
	                                y: sy * bar.finalPos.y,
	                                x: bar.finalPos.x,
	                                width: bar.finalPos.width,
	                                height: bar.finalPos.height
	                            }, {
	                                duration: optsions.duration,
	                                easing: optsions.easing,
	                                delay: h * optsions.delay,
	                                onUpdate: function onUpdate(arg) {},
	                                onComplete: function onComplete(arg) {
	                                    if (arg.width < 3 && this.context) {
	                                        this.context.radius = 0;
	                                    }

	                                    barCount++;

	                                    if (barCount === me.node._count) {
	                                        callback && callback(me);
	                                    }
	                                },
	                                id: bar.id
	                            });
	                        }                    }                }            });
	        }

	        //这里的ind是包含了start的全局index

	    }, {
	        key: "selectAt",
	        value: function selectAt(ind) {
	            if (_$18.indexOf(this.select.inds, ind) > -1) return;

	            this.select.inds.push(ind);

	            var index = ind - this.dataFrame.range.start;
	            var group = this.barsSp.getChildById("barGroup_" + index);
	            if (group) {
	                var groupRegion = group.getChildById("group_region_" + index);
	                if (groupRegion) {
	                    groupRegion.context.globalAlpha = this.select.alpha;
	                }
	            }
	        }

	        //这里的ind是包含了start的全局index

	    }, {
	        key: "unselectAt",
	        value: function unselectAt(ind) {
	            if (_$18.indexOf(this.select.inds, ind) == -1) return;

	            var _index = _$18.indexOf(this.select.inds, ind);
	            this.select.inds.splice(_index, 1);

	            var index = ind - this.dataFrame.range.start;
	            var group = this.barsSp.getChildById("barGroup_" + index);
	            if (group) {
	                var groupRegion = group.getChildById("group_region_" + index);
	                if (groupRegion) {
	                    groupRegion.context.globalAlpha = 0;
	                }
	            }
	        }
	    }, {
	        key: "getSelectedRowList",
	        value: function getSelectedRowList() {
	            var rowDatas = [];
	            var me = this;

	            _$18.each(me.select.inds, function (ind) {
	                var index = ind - me.dataFrame.range.start;
	                rowDatas.push(me.dataFrame.getRowData(index));
	            });

	            return rowDatas;
	        }
	    }]);
	    return BarGraphs;
	}(GraphsBase);

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

	var AnimationFrame$2 = canvax.AnimationFrame;
	var BrokenLine$2 = canvax.Shapes.BrokenLine;
	var Rect$5 = canvax.Shapes.Rect;
	var Circle$3 = canvax.Shapes.Circle;
	var Path$1 = canvax.Shapes.Path;

	var _$19 = canvax._;

	var LineGraphsGroup = function (_Canvax$Event$EventDi) {
	    inherits$1(LineGraphsGroup, _Canvax$Event$EventDi);

	    function LineGraphsGroup(fieldMap, iGroup, opt, ctx, h, w) {
	        classCallCheck$1(this, LineGraphsGroup);

	        var _this = possibleConstructorReturn$1(this, (LineGraphsGroup.__proto__ || Object.getPrototypeOf(LineGraphsGroup)).call(this));

	        _this._opt = opt;
	        _this.fieldMap = fieldMap;
	        _this.field = null; //在extend之后要重新设置
	        _this.iGroup = iGroup;

	        _this._yAxis = fieldMap.yAxis;

	        _this.ctx = ctx;
	        _this.w = w;
	        _this.h = h;
	        _this.y = 0;

	        _this.line = { //线
	            enabled: 1,
	            shapeType: "brokenLine", //折线
	            strokeStyle: fieldMap.color,
	            lineWidth: 2,
	            lineType: "solid",
	            smooth: true
	        };

	        _this.icon = { //节点 
	            enabled: 1, //是否有
	            shapeType: "circle",
	            corner: false, //模式[false || 0 = 都有节点 | true || 1 = 拐角才有节点]
	            radius: 3, //半径 icon 圆点的半径
	            fillStyle: '#ffffff',
	            strokeStyle: null,
	            lineWidth: 2
	        };

	        _this.label = {
	            enabled: 0,
	            fontColor: null,
	            strokeStyle: null,
	            fontSize: 12,
	            format: null
	        };

	        _this.area = { //填充
	            shapeType: "path",
	            enabled: 1,
	            fillStyle: null,
	            alpha: 0.3
	        };

	        _this.data = [];
	        _this.sprite = null;

	        _this._pointList = []; //brokenline最终的状态
	        _this._currPointList = []; //brokenline 动画中的当前状态
	        _this._bline = null;

	        _$19.extend(true, _this, opt);

	        //TODO group中得field不能直接用opt中得field， 必须重新设置， 
	        //group中得field只有一个值，代表一条折线, 后面要扩展extend方法，可以控制过滤哪些key值不做extend
	        _this.field = fieldMap.field; //iGroup 在yAxis.field中对应的值

	        _this.init(opt);
	        return _this;
	    }

	    createClass$1(LineGraphsGroup, [{
	        key: "init",
	        value: function init(opt) {
	            this.sprite = new canvax.Display.Sprite();
	            var me = this;
	            this.sprite.on("destroy", function () {
	                if (me._growTween) {
	                    AnimationFrame$2.destroyTween(me._growTween);
	                }
	            });
	        }
	    }, {
	        key: "draw",
	        value: function draw(opt, data) {
	            _$19.extend(true, this, opt);
	            this.data = data;
	            this._widget(opt);
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
	                onComplete: function onComplete() {
	                    me.sprite.remove();
	                }
	            });
	        }

	        //styleType , normals , iGroup

	    }, {
	        key: "_getColor",
	        value: function _getColor(s, iNode) {
	            var color = this._getProp(s, iNode);
	            if (color === undefined || color === null) {
	                //这个时候可以先取线的style，和线保持一致
	                color = this._getLineStrokeStyle();

	                //因为_getLineStrokeStyle返回的可能是个渐变对象，所以要用isString过滤掉
	                if (!color || !_$19.isString(color)) {
	                    //那么最后，取this.fieldMap.color
	                    color = this.fieldMap.color;
	                }
	            }            return color;
	        }
	    }, {
	        key: "_getProp",
	        value: function _getProp(s, iNode) {
	            if (_$19.isArray(s)) {
	                return s[this.iGroup];
	            }            if (_$19.isFunction(s)) {
	                return s.apply(this, [this.getNodeInfoAt(iNode)]);
	            }            return s;
	        }

	        //这个是tips需要用到的 

	    }, {
	        key: "getNodeInfoAt",
	        value: function getNodeInfoAt($index) {
	            var o = this.data[$index];
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
	        value: function resetData(data, dataTrigger) {
	            var me = this;

	            if (data) {
	                this.data = data;
	            }
	            me._pointList = this._getPointList(this.data);
	            var plen = me._pointList.length;
	            var cplen = me._currPointList.length;

	            if (!dataTrigger) {
	                dataTrigger = {
	                    name: 'normal',
	                    left: 0, //默认左边数据没变
	                    right: plen - cplen
	                };
	            }
	            if (dataTrigger.left) {
	                if (dataTrigger.left > 0) {
	                    this._currPointList = this._pointList.slice(0, dataTrigger.left).concat(this._currPointList);
	                }
	                if (dataTrigger.left < 0) {
	                    this._currPointList.splice(0, Math.abs(dataTrigger.left));
	                }
	            }
	            if (dataTrigger.right) {
	                if (dataTrigger.right > 0) {
	                    this._currPointList = this._currPointList.concat(this._pointList.slice(-dataTrigger.right));
	                }
	                if (dataTrigger.right < 0) {
	                    this._currPointList.splice(this._currPointList.length - Math.abs(dataTrigger.right));
	                }
	            }
	            me._createNodes();
	            me._createTexts();
	            me._grow();
	        }
	    }, {
	        key: "_grow",
	        value: function _grow(callback, opt) {
	            var me = this;

	            if (!me.data.length) {
	                //因为在index中有调用
	                callback && callback(me);
	                return;
	            }
	            function _update(list) {
	                me._bline.context.pointList = _$19.clone(list);
	                me._bline.context.strokeStyle = me._getLineStrokeStyle(list);

	                me._area.context.path = me._fillLine(me._bline);
	                me._area.context.fillStyle = me._getFillStyle();

	                var iNode = 0;
	                _$19.each(list, function (point, i) {
	                    if (_$19.isNumber(point[1])) {
	                        if (me._circles) {
	                            var _circle = me._circles.getChildAt(iNode);
	                            if (_circle) {
	                                _circle.context.x = point[0];
	                                _circle.context.y = point[1];
	                            }
	                        }
	                        if (me._labels) {
	                            var _text = me._labels.getChildAt(iNode);
	                            if (_text) {
	                                _text.context.x = point[0];
	                                _text.context.y = point[1] - 3;
	                                me._checkTextPos(_text, i);
	                            }
	                        }
	                        iNode++;
	                    }
	                });
	            }
	            this._growTween = AnimationFrame$2.registTween({
	                from: me._getPointPosStr(me._currPointList),
	                to: me._getPointPosStr(me._pointList),
	                desc: me.field,
	                onUpdate: function onUpdate(arg) {
	                    for (var p in arg) {
	                        var ind = parseInt(p.split("_")[2]);
	                        var xory = parseInt(p.split("_")[1]);
	                        me._currPointList[ind] && (me._currPointList[ind][xory] = arg[p]); //p_1_n中间的1代表x or y
	                    }                    _update(me._currPointList);
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
	            _$19.each(list, function (p, i) {
	                if (!p) {
	                    //折线图中这个节点可能没有
	                    return;
	                }
	                obj["p_1_" + i] = p[1]; //p_y==p_1
	                obj["p_0_" + i] = p[0]; //p_x==p_0
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
	            }            return list;
	        }
	    }, {
	        key: "_widget",
	        value: function _widget(opt) {
	            var me = this;
	            !opt && (opt = {});

	            me._pointList = this._getPointList(me.data);

	            if (me._pointList.length == 0) {
	                //filter后，data可能length==0
	                return;
	            }            var list = [];
	            if (opt.animation) {
	                var firstNode = this._getFirstNode();
	                var firstY = firstNode ? firstNode.y : undefined;
	                for (var a = 0, al = me.data.length; a < al; a++) {
	                    var o = me.data[a];
	                    list.push([o.x, _$19.isNumber(o.y) ? firstY : o.y]);
	                }            } else {
	                list = me._pointList;
	            }
	            me._currPointList = list;

	            var bline = new BrokenLine$2({ //线条
	                context: {
	                    pointList: list,
	                    lineWidth: me.line.lineWidth,
	                    y: me.y,
	                    strokeStyle: me._getLineStrokeStyle(list), //_getLineStrokeStyle 在配置线性渐变的情况下会需要
	                    smooth: me.line.smooth,
	                    lineType: me._getProp(me.line.lineType),
	                    smoothFilter: function smoothFilter(rp) {
	                        //smooth为true的话，折线图需要对折线做一些纠正，不能超过底部
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
	            }            me.sprite.addChild(bline);
	            me._bline = bline;

	            var area = new Path$1({ //填充
	                context: {
	                    path: me._fillLine(bline),
	                    fillStyle: me._getFillStyle(),
	                    globalAlpha: _$19.isArray(me.area.alpha) ? 1 : me.area.alpha
	                }
	            });

	            if (!this.area.enabled) {
	                area.context.visible = false;
	            }
	            me.sprite.addChild(area);
	            me._area = area;

	            me._createNodes();
	            me._createTexts();
	        }
	    }, {
	        key: "_getFirstNode",
	        value: function _getFirstNode() {
	            var _firstNode = null;
	            for (var i = 0, l = this.data.length; i < l; i++) {
	                var nodeData = this.data[i];
	                if (_$19.isNumber(nodeData.y)) {
	                    if (_firstNode === null || this._yAxis.place == "right") {
	                        //_yAxis为右轴的话，
	                        _firstNode = nodeData;
	                    }
	                    if (this._yAxis.place !== "right" && _firstNode !== null) {
	                        break;
	                    }
	                }            }

	            return _firstNode;
	        }
	    }, {
	        key: "_getFillStyle",
	        value: function _getFillStyle() {
	            var me = this;

	            var fill_gradient = null;

	            // _fillStyle 可以 接受渐变色，可以不用_getColor， _getColor会过滤掉渐变色
	            var _fillStyle = me._getProp(me.area.fillStyle) || me._getLineStrokeStyle(null, "fillStyle");

	            if (_$19.isArray(me.area.alpha) && !(_fillStyle instanceof CanvasGradient)) {
	                //alpha如果是数组，那么就是渐变背景，那么就至少要有两个值
	                //如果拿回来的style已经是个gradient了，那么就不管了
	                me.area.alpha.length = 2;
	                if (me.area.alpha[0] == undefined) {
	                    me.area.alpha[0] = 0;
	                }                if (me.area.alpha[1] == undefined) {
	                    me.area.alpha[1] = 0;
	                }
	                //从bline中找到最高的点
	                var topP = _$19.min(me._bline.context.pointList, function (p) {
	                    return p[1];
	                });

	                if (topP[0] === undefined || topP[1] === undefined) {
	                    return null;
	                }
	                //创建一个线性渐变
	                fill_gradient = me.ctx.createLinearGradient(topP[0], topP[1], topP[0], 0);

	                var rgb = ColorFormat.colorRgb(_fillStyle);
	                var rgba0 = rgb.replace(')', ', ' + me._getProp(me.area.alpha[0]) + ')').replace('RGB', 'RGBA');
	                fill_gradient.addColorStop(0, rgba0);

	                var rgba1 = rgb.replace(')', ', ' + me.area.alpha[1] + ')').replace('RGB', 'RGBA');
	                fill_gradient.addColorStop(1, rgba1);

	                _fillStyle = fill_gradient;
	            }
	            return _fillStyle;
	        }
	    }, {
	        key: "_getLineStrokeStyle",
	        value: function _getLineStrokeStyle(pointList, from) {
	            var me = this;
	            var _style;
	            if (!this._opt.line || !this._opt.line.strokeStyle) {
	                //如果用户没有配置line.strokeStyle，那么就用默认的
	                return this.line.strokeStyle;
	            }
	            if (this._opt.line.strokeStyle.lineargradient) {
	                //如果用户配置 填充是一个线性渐变
	                //从bline中找到最高的点
	                !pointList && (pointList = this._bline.context.pointList);

	                var topP = _$19.min(pointList, function (p) {
	                    return p[1];
	                });
	                var bottomP = _$19.max(pointList, function (p) {
	                    return p[1];
	                });
	                if (from == "fillStyle") {
	                    bottomP = [0, 0];
	                }
	                if (topP[0] === undefined || topP[1] === undefined || bottomP[1] === undefined) {
	                    return null;
	                }

	                //var bottomP = [ 0 , 0 ];
	                //创建一个线性渐变
	                //console.log( topP[0] + "|"+ topP[1]+ "|"+  topP[0]+ "|"+ bottomP[1] )
	                _style = me.ctx.createLinearGradient(topP[0], topP[1], topP[0], bottomP[1]);
	                _$19.each(this._opt.line.strokeStyle.lineargradient, function (item, i) {
	                    _style.addColorStop(item.position, item.color);
	                });

	                return _style;
	            } else {
	                //构造函数中执行的这个方法，还没有line属性
	                //if( this.line && this.line.strokeStyle ){
	                //    _style = this.line.strokeStyle
	                //} else {
	                _style = this._getColor(this._opt.line.strokeStyle);
	                //}
	                return _style;
	            }
	        }
	    }, {
	        key: "_createNodes",
	        value: function _createNodes() {
	            var me = this;
	            var list = me._currPointList;

	            if ((me.icon.enabled || list.length == 1) && !!me.line.lineWidth) {
	                //拐角的圆点
	                if (!this._circles) {
	                    this._circles = new canvax.Display.Sprite({});
	                    this.sprite.addChild(this._circles);
	                }

	                var iNode = 0; //这里不能和下面的a对等，以为list中有很多无效的节点
	                for (var a = 0, al = list.length; a < al; a++) {
	                    var _point = me._currPointList[a];
	                    if (!_point || !_$19.isNumber(_point[1])) {
	                        //折线图中有可能这个point为undefined
	                        continue;
	                    }
	                    var context = {
	                        x: _point[0],
	                        y: _point[1],
	                        r: me._getProp(me.icon.radius, a),
	                        lineWidth: me._getProp(me.icon.lineWidth, a) || 2,
	                        strokeStyle: me._getColor(me.icon.strokeStyle, a),
	                        fillStyle: me.icon.fillStyle
	                    };

	                    var circle = me._circles.children[iNode];
	                    if (circle) {
	                        _$19.extend(circle.context, context);
	                    } else {
	                        circle = new Circle$3({
	                            context: context
	                        });
	                        me._circles.addChild(circle);
	                    }
	                    if (me.icon.corner) {
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
	                    iNode++;
	                }
	                //把过多的circle节点删除了
	                if (me._circles.children.length > iNode) {
	                    for (var i = iNode, l = me._circles.children.length; i < l; i++) {
	                        me._circles.children[i].destroy();
	                        i--;
	                        l--;
	                    }
	                }            }        }
	    }, {
	        key: "_createTexts",
	        value: function _createTexts() {

	            var me = this;
	            var list = me._currPointList;

	            if (me.label.enabled) {
	                //节点上面的文本info
	                if (!this._labels) {
	                    this._labels = new canvax.Display.Sprite({});
	                    this.sprite.addChild(this._labels);
	                }

	                var iNode = 0; //这里不能和下面的a对等，以为list中有很多无效的节点
	                for (var a = 0, al = list.length; a < al; a++) {
	                    var _point = list[a];
	                    if (!_point || !_$19.isNumber(_point[1])) {
	                        //折线图中有可能这个point为undefined
	                        continue;
	                    }
	                    var context = {
	                        x: _point[0],
	                        y: _point[1] - 3,
	                        fontSize: this.label.fontSize,
	                        textAlign: "center",
	                        textBaseline: "bottom",
	                        fillStyle: me._getColor(me.label.fontColor, a),
	                        lineWidth: 1,
	                        strokeStyle: "#ffffff"
	                    };

	                    var value = me.data[a].value;
	                    if (_$19.isFunction(me.label.format)) {
	                        value = me.label.format(value, me.data[a]) || value;
	                    }
	                    if (value == undefined || value == null) {
	                        continue;
	                    }
	                    var _label = this._labels.children[iNode];
	                    if (_label) {
	                        _label.resetText(value);
	                        _$19.extend(_label.context, context);
	                    } else {
	                        _label = new canvax.Display.Text(value, {
	                            context: context
	                        });
	                        me._labels.addChild(_label);
	                        me._checkTextPos(_label, a);
	                    }
	                    iNode++;
	                }
	                //把过多的circle节点删除了
	                if (me._labels.children.length > iNode) {
	                    for (var i = iNode, l = me._labels.children.length; i < l; i++) {
	                        me._labels.children[i].destroy();
	                        i--;
	                        l--;
	                    }
	                }            }        }
	    }, {
	        key: "_checkTextPos",
	        value: function _checkTextPos(_label, ind) {
	            var me = this;
	            var list = me._currPointList;
	            var pre = list[ind - 1];
	            var next = list[ind + 1];

	            if (pre && next && pre[1] < _label.context.y && next[1] < _label.context.y) {
	                _label.context.y += 7;
	                _label.context.textBaseline = "top";
	            }
	        }
	    }, {
	        key: "_fillLine",
	        value: function _fillLine(bline) {
	            //填充直线
	            var fillPath = _$19.clone(bline.context.pointList);

	            var path = "";
	            var baseY = this._yAxis.basePoint.y;

	            var _currPath = null;

	            _$19.each(fillPath, function (point, i) {
	                if (_$19.isNumber(point[1])) {
	                    if (_currPath === null) {
	                        _currPath = [];
	                    }
	                    _currPath.push(point);
	                } else {
	                    // not a number
	                    if (_currPath && _currPath.length) {
	                        getOnePath();
	                    }                }

	                if (i == fillPath.length - 1 && _$19.isNumber(point[1])) {
	                    getOnePath();
	                }
	            });

	            function getOnePath() {
	                _currPath.push([_currPath[_currPath.length - 1][0], baseY], [_currPath[0][0], baseY], [_currPath[0][0], _currPath[0][1]]);
	                path += getPath(_currPath);
	                _currPath = null;
	            }

	            return path;
	        }
	    }]);
	    return LineGraphsGroup;
	}(canvax.Event.EventDispatcher);

	var _$20 = canvax._;
	var Rect$6 = canvax.Shapes.Rect;

	var LineGraphs = function (_GraphsBase) {
	    inherits$1(LineGraphs, _GraphsBase);

	    function LineGraphs(opt, root) {
	        classCallCheck$1(this, LineGraphs);

	        var _this = possibleConstructorReturn$1(this, (LineGraphs.__proto__ || Object.getPrototypeOf(LineGraphs)).call(this, opt, root));

	        _this.type = "line";

	        //默认给左轴
	        _this.yAxisAlign = "left";

	        _this.field = null;
	        _this.enabledField = null;

	        _this.groups = []; //群组集合

	        _$20.extend(true, _this, opt);

	        _this.init(_this._opts);
	        return _this;
	    }

	    createClass$1(LineGraphs, [{
	        key: "init",
	        value: function init(opt) {
	            opt.yAxisAlign && (this.yAxisAlign = opt.yAxisAlign);
	            this.sprite = new canvax.Display.Sprite();
	        }
	    }, {
	        key: "draw",
	        value: function draw(opt) {
	            !opt && (opt = {});
	            this.width = opt.width;
	            this.height = opt.height;
	            _$20.extend(true, this.origin, opt.origin);

	            this.sprite.context.x = this.origin.x;
	            this.sprite.context.y = this.origin.y;

	            this.data = this._trimGraphs();

	            this._setGroupsForYfield(this.data, null, opt);

	            //this.grow();
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
	            _$20.each(me.groups, function (g) {
	                g.resetData(me.data[g.field].data, dataTrigger);
	            });
	        }
	    }, {
	        key: "setEnabledField",
	        value: function setEnabledField() {
	            //要根据自己的 field，从enabledFields中根据enabled数据，计算一个 enabled版本的field子集
	            this.enabledField = this.root._coord.getEnabledFields(this.field);
	        }

	        //_yAxis, dataFrame

	    }, {
	        key: "_trimGraphs",
	        value: function _trimGraphs() {
	            var me = this;
	            var _coor = this.root._coord;

	            //{"uv":{}.. ,"click": "pv":]}
	            //这样按照字段摊平的一维结构
	            var tmpData = {};

	            me.setEnabledField();

	            var _yAxis = this.yAxisAlign == "right" ? _coor._yAxisRight : _coor._yAxisLeft;

	            _$20.each(_$20.flatten(me.enabledField), function (field, i) {
	                //var maxValue = 0;

	                var fieldMap = me.root._coord.getFieldMapOf(field);

	                //单条line的全部data数据
	                var _lineData = me.dataFrame.getFieldData(field);
	                if (!_lineData) return;

	                var _data = [];

	                for (var b = 0, bl = _lineData.length; b < bl; b++) {
	                    var _xAxis = me.root._coord ? me.root._coord._xAxis : me.root._xAxis;
	                    var x = _xAxis.getPosX({
	                        ind: b,
	                        dataLen: bl,
	                        layoutType: me.root._coord ? me.root._coord.xAxis.layoutType : me.root._xAxis.layoutType
	                    });

	                    var y = _$20.isNumber(_lineData[b]) ? _yAxis.getYposFromVal(_lineData[b]) : undefined; //_lineData[b] 没有数据的都统一设置为undefined，说明这个地方没有数据

	                    var node = {
	                        type: "line",
	                        iGroup: i,
	                        iNode: b,
	                        field: field,
	                        value: _lineData[b],
	                        x: x,
	                        y: y,
	                        rowData: me.dataFrame.getRowData(b),
	                        color: fieldMap.color
	                    };

	                    _data.push(node);
	                }
	                tmpData[field] = {
	                    yAxis: _yAxis,
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
	            _$20.each(this.groups, function (g, i) {
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
	            var me = this;

	            //这个field不再这个graphs里面的，不相关
	            if (_$20.indexOf(_$20.flatten([me.field]), field) == -1) {
	                return;
	            }
	            this.data = this._trimGraphs();
	            this._setGroupsForYfield(this.data, field);

	            _$20.each(this.groups, function (g, i) {
	                g.resetData(me.data[g.field].data);
	            });
	        }
	    }, {
	        key: "hide",
	        value: function hide(field) {
	            var me = this;
	            var i = me.getGroupIndex(field);

	            if (!this.groups.length || i < 0) {
	                return;
	            }
	            this.groups.splice(i, 1)[0].destroy();
	            this.data = this._trimGraphs();

	            _$20.each(this.groups, function (g, i) {
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
	                fields = _$20.flatten([fields]);
	            }

	            var _flattenField = _$20.flatten([this.field]);

	            _$20.each(data, function (g, field) {

	                if (fields && _$20.indexOf(fields, field) == -1) {
	                    //如果有传入fields，但是当前field不在fields里面的话，不需要处理
	                    //说明该group已经在graphs里面了
	                    return;
	                }
	                var fieldMap = me.root._coord.getFieldMapOf(field);

	                //iGroup 是这条group在本graphs中的ind，而要拿整个图表层级的index， 就是fieldMap.ind
	                var iGroup = _$20.indexOf(_flattenField, field);

	                var group = new LineGraphsGroup(fieldMap, iGroup, //不同于fieldMap.ind
	                me._opts, me.ctx, me.height, me.width);

	                group.draw({
	                    animation: me.animation && !opt.resize
	                }, g.data);

	                var insert = false;
	                //在groups数组中插入到比自己_groupInd小的元素前面去
	                for (var gi = 0, gl = me.groups.length; gi < gl; gi++) {
	                    if (iGroup < me.groups[gi].iGroup) {

	                        me.groups.splice(gi, 0, group);
	                        insert = true;
	                        me.sprite.addChildAt(group.sprite, gi);

	                        break;
	                    }
	                }                //否则就只需要直接push就好了
	                if (!insert) {
	                    me.groups.push(group);
	                    me.sprite.addChild(group.sprite);
	                }            });
	        }
	    }, {
	        key: "getNodesAt",
	        value: function getNodesAt(ind) {
	            var _nodesInfoList = []; //节点信息集合
	            _$20.each(this.groups, function (group) {
	                var node = group.getNodeInfoAt(ind);
	                node && _nodesInfoList.push(node);
	            });
	            return _nodesInfoList;
	        }
	    }]);
	    return LineGraphs;
	}(GraphsBase);

	var Circle$4 = canvax.Shapes.Circle;
	var Rect$7 = canvax.Shapes.Rect;
	var Line$5 = canvax.Shapes.Line;
	var _$21 = canvax._;

	var ScatGraphs = function (_GraphsBase) {
	    inherits$1(ScatGraphs, _GraphsBase);

	    function ScatGraphs(opt, root) {
	        classCallCheck$1(this, ScatGraphs);

	        var _this = possibleConstructorReturn$1(this, (ScatGraphs.__proto__ || Object.getPrototypeOf(ScatGraphs)).call(this, opt, root));

	        _this.type = "scat";

	        _this.field = null;

	        //TODO:待开发，用groupField来做分组，比如分组出男女两组，然后方便做图例（目前没给scat实现合适的图例）
	        _this.groupField = null;

	        _this.node = {
	            shapeType: "circle", //节点的现状可以是圆 ，也可以是rect，也可以是三角形，后面两种后面实现
	            maxRadius: 25, //圆圈默认最大半径
	            minRadius: 5,
	            radius: null,
	            normalR: 15,
	            fillStyle: null,
	            fillAlpha: 0.8,

	            strokeStyle: null,
	            lineWidth: 0,
	            lineAlpha: 0,

	            focus: {
	                enabled: true,
	                lineWidth: 6,
	                lineAlpha: 0.2,
	                fillAlpha: 0.8
	            },
	            select: {
	                enabled: true,
	                lineWidth: 8,
	                lineAlpha: 0.4,
	                fillAlpha: 1

	                //onclick ondblclick 注册的事件都是小写
	            } };

	        //从node点到垂直坐标y==0的连线
	        //气球的绳子
	        _this.line = {
	            enabled: false,
	            lineWidth: 1,
	            strokeStyle: "#ccc",
	            lineType: "dashed"
	        };

	        _this.label = {
	            enabled: true,
	            field: null,
	            format: function format(txt, nodeData) {
	                return txt;
	            },
	            fontSize: 12,
	            fontColor: null, //"#888",//如果外面设置为null等false值，就会被自动设置为nodeData.fillStyle
	            strokeStyle: "#ffffff",
	            lineWidth: 2,

	            rotation: 0,
	            align: "center", //left center right
	            verticalAlign: "top", //top middle bottom
	            position: "bottom", //auto(目前等于center，还未实现),center,top,right,bottom,left
	            offsetX: 0,
	            offsetY: 0
	        };

	        //动画的起始位置， 默认x=data.x y = 0
	        _this.aniOrigin = "default"; //center（坐标正中） origin（坐标原点）

	        _$21.extend(true, _this, opt);

	        //计算半径的时候需要用到， 每次执行_trimGraphs都必须要初始化一次
	        _this._rData = null;
	        _this._rMaxValue = null;
	        _this._rMinValue = null;

	        _this.init();
	        return _this;
	    }

	    createClass$1(ScatGraphs, [{
	        key: "init",
	        value: function init() {
	            this.sprite = new canvax.Display.Sprite({
	                id: "graphsEl"
	            });

	            this._shapesp = new canvax.Display.Sprite({
	                id: "shapesp"
	            });
	            this._textsp = new canvax.Display.Sprite({
	                id: "textsp"
	            });
	            this._linesp = new canvax.Display.Sprite({
	                id: "textsp"
	            });

	            this.sprite.addChild(this._linesp);
	            this.sprite.addChild(this._shapesp);
	            this.sprite.addChild(this._textsp);
	        }
	    }, {
	        key: "draw",
	        value: function draw(opt) {
	            !opt && (opt = {});

	            _$21.extend(true, this, opt);
	            this.data = this._trimGraphs();
	            this._widget();
	            this.sprite.context.x = this.origin.x;
	            this.sprite.context.y = this.origin.y;

	            var me = this;
	            if (this.animation && !opt.resize && !me.inited) {
	                this.grow(function () {
	                    me.fire("complete");
	                });
	            } else {
	                this.fire("complete");
	            }

	            return this;
	        }
	    }, {
	        key: "resetData",
	        value: function resetData(dataFrame, dataTrigger) {
	            this.dataFrame = dataFrame;
	            this.data = this._trimGraphs();
	            this._widget();
	        }
	    }, {
	        key: "getNodesAt",
	        value: function getNodesAt() {
	            return [];
	        }
	    }, {
	        key: "_trimGraphs",
	        value: function _trimGraphs() {
	            var tmplData = [];

	            var dataLen = this.dataFrame.length;
	            var xField = this.root._coord._xAxis.field;

	            ////计算半径的时候需要用到， 每次执行_trimGraphs都必须要初始化一次
	            this._rData = null;
	            this._rMaxValue = null;
	            this._rMinValue = null;

	            for (var i = 0; i < dataLen; i++) {

	                var rowData = this.dataFrame.getRowData(i);
	                var xValue = rowData[xField];
	                var yValue = rowData[this.field];
	                var xPos = this.root._coord._xAxis.getPosX({ val: xValue });
	                var yPos = this.root._coord._getYaxisOfField(this.field).getYposFromVal(yValue);

	                var fieldMap = this.root._coord.getFieldMapOf(this.field);

	                var nodeLayoutData = {
	                    rowData: rowData,
	                    x: xPos,
	                    y: yPos,
	                    value: {
	                        x: xValue,
	                        y: yValue
	                    },
	                    field: this.field,
	                    fieldColor: fieldMap.color,
	                    iNode: i,

	                    focused: false,
	                    selected: false,

	                    //下面的属性都单独设置
	                    radius: null, //这里先不设置，在下面的_setR里单独设置
	                    fillStyle: null,
	                    color: null,
	                    strokeStyle: null,
	                    lineWidth: 0,
	                    shapeType: null,
	                    label: null,

	                    _node: null //对应的canvax 节点， 在widget之后赋值
	                };

	                this._setR(nodeLayoutData);
	                this._setFillStyle(nodeLayoutData);
	                this._setStrokeStyle(nodeLayoutData);
	                this._setLineWidth(nodeLayoutData);
	                this._setNodeType(nodeLayoutData);
	                this._setText(nodeLayoutData);

	                tmplData.push(nodeLayoutData);
	            }
	            return tmplData;
	        }
	    }, {
	        key: "_setR",
	        value: function _setR(nodeLayoutData) {

	            var r = this.node.normalR;
	            var rowData = nodeLayoutData.rowData;
	            if (this.node.radius != null) {
	                if (_$21.isString(this.node.radius) && rowData[this.node.radius]) {
	                    //如果配置了某个字段作为r，那么就要自动计算比例
	                    if (!this._rData && !this._rMaxValue && !this._rMinValue) {
	                        this._rData = this.dataFrame.getFieldData(this.node.radius);
	                        this._rMaxValue = _$21.max(this._rData);
	                        this._rMinValue = _$21.min(this._rData);
	                    }
	                    var rVal = rowData[this.node.radius];

	                    if (this._rMaxValue == this._rMinValue) {
	                        r = this.node.minRadius + (this.node.maxRadius - this.node.minRadius) / 2;
	                    } else {
	                        r = this.node.minRadius + (rVal - this._rMinValue) / (this._rMaxValue - this._rMinValue) * (this.node.maxRadius - this.node.minRadius);
	                    }                }                if (_$21.isFunction(this.node.radius)) {
	                    r = this.node.radius(rowData);
	                }                if (!isNaN(parseInt(this.node.radius))) {
	                    r = parseInt(this.node.radius);
	                }            }            nodeLayoutData.radius = r;
	            return this;
	        }
	    }, {
	        key: "_setText",
	        value: function _setText(nodeLayoutData) {
	            if (this.label.field != null) {
	                if (_$21.isString(this.label.field) && nodeLayoutData.rowData[this.label.field]) {
	                    nodeLayoutData.label = this.label.format(nodeLayoutData.rowData[this.label.field], nodeLayoutData);
	                }
	            }
	        }
	    }, {
	        key: "_setFillStyle",
	        value: function _setFillStyle(nodeLayoutData) {
	            nodeLayoutData.color = nodeLayoutData.fillStyle = this._getStyle(this.node.fillStyle, nodeLayoutData);
	            return this;
	        }
	    }, {
	        key: "_setStrokeStyle",
	        value: function _setStrokeStyle(nodeLayoutData) {
	            nodeLayoutData.strokeStyle = this._getStyle(this.node.strokeStyle || this.node.fillStyle, nodeLayoutData);
	            return this;
	        }
	    }, {
	        key: "_getStyle",
	        value: function _getStyle(style, nodeLayoutData) {
	            var _style = style;
	            if (_$21.isArray(style)) {
	                _style = style[nodeLayoutData.iGroup];
	            }            if (_$21.isFunction(style)) {
	                _style = style(nodeLayoutData);
	            }            if (!_style) {
	                _style = nodeLayoutData.fieldColor;
	            }            return _style;
	        }
	    }, {
	        key: "_setLineWidth",
	        value: function _setLineWidth(nodeLayoutData) {
	            nodeLayoutData.lineWidth = this.node.lineWidth;
	            return this;
	        }
	    }, {
	        key: "_setNodeType",
	        value: function _setNodeType(nodeLayoutData) {
	            var shapeType = this.node.shapeType;
	            if (_$21.isArray(shapeType)) {
	                shapeType = shapeType[nodeLayoutData.iGroup];
	            }            if (_$21.isFunction(shapeType)) {
	                shapeType = shapeType(nodeLayoutData);
	            }            if (!shapeType) {
	                shapeType = "circle";
	            }            nodeLayoutData.shapeType = shapeType;
	            return this;
	        }

	        //根据layoutdata开始绘制

	    }, {
	        key: "_widget",
	        value: function _widget() {
	            var me = this;

	            //那么有多余的元素要去除掉 begin
	            if (me._shapesp.children.length > me.data.length) {
	                for (var i = me.data.length; i < me._shapesp.children.length; i++) {
	                    me._shapesp.getChildAt(i--).destroy();
	                }
	            }            if (me._textsp.children.length > me.data.length) {
	                for (var i = me.data.length; i < me._textsp.children.length; i++) {
	                    me._textsp.getChildAt(i--).destroy();
	                }
	            }            if (me._linesp.children.length > me.data.length) {
	                for (var i = me.data.length; i < me._linesp.children.length; i++) {
	                    me._linesp.getChildAt(i--).destroy();
	                }
	            }            //那么有多余的元素要去除掉 end

	            _$21.each(me.data, function (nodeData, iNode) {

	                var _context = me._getNodeContext(nodeData);
	                var Shape = nodeData.shapeType == "circle" ? Circle$4 : Rect$7;

	                var _node = me._shapesp.getChildAt(iNode);
	                if (!_node) {
	                    _node = new Shape({
	                        id: "shape_" + iNode,
	                        hoverClone: false,
	                        context: _context
	                    });
	                    me._shapesp.addChild(_node);

	                    _node.on("mousedown mouseup panstart mouseover panmove mousemove panend mouseout tap click dblclick", function (e) {

	                        e.eventInfo = {
	                            title: null,
	                            nodes: [this.nodeData]
	                        };
	                        if (this.nodeData.label) {
	                            e.eventInfo.title = this.nodeData.label;
	                        }
	                        //fire到root上面去的是为了让root去处理tips
	                        me.root.fire(e.type, e);
	                        me.triggerEvent(me.node, e);
	                    });
	                } else {
	                    //_node.context = _context;
	                    //_.extend( _node.context, _context );
	                    _node.animate(_context);
	                }
	                //数据和canvax原件相互引用
	                _node.nodeData = nodeData;
	                _node.iNode = iNode;
	                nodeData._node = _node;

	                me.node.focus.enabled && _node.hover(function (e) {
	                    me.focusAt(this.nodeData.iNode);
	                }, function (e) {
	                    !this.nodeData.selected && me.unfocusAt(this.nodeData.iNode);
	                });

	                if (me.line.enabled) {

	                    var _line = me._linesp.getChildAt(iNode);
	                    var _lineContext = {
	                        start: {
	                            x: _context.x,
	                            y: _context.y + _context.r
	                        },
	                        end: {
	                            x: _context.x,
	                            y: 0
	                        },
	                        lineWidth: me.line.lineWidth,
	                        strokeStyle: me.line.strokeStyle,
	                        lineType: me.line.lineType
	                    };

	                    if (!_line) {
	                        _line = new Line$5({
	                            context: _lineContext
	                        });
	                        me._linesp.addChild(_line);
	                    } else {
	                        _line.animate(_lineContext);
	                    }

	                    _node._line = _line;
	                }
	                //如果有label
	                if (nodeData.label && me.label.enabled) {

	                    var _labelContext = me._getTextContext(nodeData);
	                    var _label = me._textsp.getChildAt(iNode);
	                    if (!_label) {
	                        _label = new canvax.Display.Text(nodeData.label, {
	                            id: "scat_text_" + iNode,
	                            context: _labelContext
	                        });
	                        me._textsp.addChild(_label);
	                    } else {
	                        _label.resetText(nodeData.label);
	                        _label.animate(_labelContext);
	                    }

	                    //图形节点和text文本相互引用
	                    _node._label = _label;
	                    _label._node = _node;
	                }            });
	        }
	    }, {
	        key: "_getTextPosition",
	        value: function _getTextPosition(opt) {
	            var x = 0,
	                y = 0;
	            switch (this.label.position) {
	                case "center":
	                    x = opt.x;
	                    y = opt.y;
	                    break;
	                case "top":
	                    x = opt.x;
	                    y = opt.y - opt.r;
	                    break;
	                case "right":
	                    x = opt.x + opt.r;
	                    y = opt.y;
	                    break;
	                case "bottom":
	                    x = opt.x;
	                    y = opt.y + opt.r;
	                    break;
	                case "left":
	                    x = opt.x - opt.r;
	                    y = opt.y;
	                    break;
	                case "auto":
	                    x = opt.x;
	                    y = opt.y;
	                    break;
	            }
	            var point = {
	                x: x + this.label.offsetX,
	                y: y + this.label.offsetY
	            };

	            return point;
	        }
	    }, {
	        key: "_getTextContext",
	        value: function _getTextContext(nodeData) {

	            var textPoint = this._getTextPosition({
	                x: nodeData.x,
	                y: nodeData.y,
	                r: nodeData.radius
	            });

	            var ctx = {
	                x: textPoint.x,
	                y: textPoint.y,
	                fillStyle: this.label.fontColor || nodeData.fillStyle,
	                fontSize: this.label.fontSize,
	                strokeStyle: this.label.strokeStyle || nodeData.fillStyle,
	                lineWidth: this.label.lineWidth,
	                textAlign: this.label.align,
	                textBaseline: this.label.verticalAlign
	            };

	            if (this.animation && !this.inited) {
	                if (this.aniOrigin == "default") {
	                    ctx.y = 0;
	                }                if (this.aniOrigin == "origin") {
	                    ctx.x = 0;
	                    ctx.y = 0;
	                }                if (this.aniOrigin == "center") {
	                    ctx.x = this.width / 2;
	                    ctx.y = -(this.height / 2);
	                }            }            return ctx;
	        }
	    }, {
	        key: "_getNodeContext",
	        value: function _getNodeContext(nodeData) {
	            if (nodeData.shapeType == "circle") {
	                return this._getCircleContext(nodeData);
	            }
	        }
	    }, {
	        key: "_getCircleContext",
	        value: function _getCircleContext(nodeData) {
	            var ctx = {
	                x: nodeData.x,
	                y: nodeData.y,
	                r: nodeData.radius,
	                fillStyle: nodeData.fillStyle,
	                strokeStyle: nodeData.strokeStyle,
	                lineWidth: nodeData.lineWidth,
	                fillAlpha: this.node.fillAlpha,
	                cursor: "pointer"
	            };

	            if (this.animation && !this.inited) {

	                if (this.aniOrigin == "default") {
	                    //ctx.x = 0;
	                    ctx.y = 0;
	                }
	                if (this.aniOrigin == "origin") {
	                    ctx.x = 0;
	                    ctx.y = 0;
	                }
	                if (this.aniOrigin == "center") {
	                    ctx.x = this.width / 2;
	                    ctx.y = -(this.height / 2);
	                }

	                ctx.r = 1;
	            }            return ctx;
	        }

	        /**
	         * 生长动画
	         */

	    }, {
	        key: "grow",
	        value: function grow(callback) {
	            var i = 0;
	            var l = this.data.length - 1;
	            var me = this;
	            _$21.each(this.data, function (nodeData) {
	                nodeData._node.animate({
	                    x: nodeData.x,
	                    y: nodeData.y,
	                    r: nodeData.radius
	                }, {
	                    onUpdate: function onUpdate(opt) {
	                        if (this._label) {
	                            var _textPoint = me._getTextPosition(opt);
	                            this._label.context.x = _textPoint.x;
	                            this._label.context.y = _textPoint.y;
	                        }                        if (this._line) {
	                            this._line.context.start.y = opt.y + opt.r;
	                        }                    },
	                    delay: Math.round(Math.random() * 300),
	                    onComplete: function onComplete() {
	                        i = i + 1;
	                        if (i == l) {
	                            callback && callback();
	                        }
	                    }
	                });
	            });
	        }
	    }, {
	        key: "focusAt",
	        value: function focusAt(ind) {
	            var nodeData = this.data[ind];
	            if (!this.node.focus.enabled || nodeData.focused) return;

	            var nctx = nodeData._node.context;
	            nctx.lineWidth = this.node.focus.lineWidth;
	            nctx.lineAlpha = this.node.focus.lineAlpha;
	            nctx.fillAlpha = this.node.focus.fillAlpha;
	            nodeData.focused = true;
	        }
	    }, {
	        key: "unfocusAt",
	        value: function unfocusAt(ind) {
	            var nodeData = this.data[ind];
	            if (!this.node.focus.enabled || !nodeData.focused) return;
	            var nctx = nodeData._node.context;
	            nctx.lineWidth = this.node.lineWidth;
	            nctx.lineAlpha = this.node.lineAlpha;
	            nctx.fillAlpha = this.node.fillAlpha;

	            nodeData.focused = false;
	        }
	    }, {
	        key: "selectAt",
	        value: function selectAt(ind) {

	            var nodeData = this.data[ind];
	            if (!this.node.select.enabled || nodeData.selected) return;

	            var nctx = nodeData._node.context;
	            nctx.lineWidth = this.node.select.lineWidth;
	            nctx.lineAlpha = this.node.select.lineAlpha;
	            nctx.fillAlpha = this.node.select.fillAlpha;

	            nodeData.selected = true;
	        }
	    }, {
	        key: "unselectAt",
	        value: function unselectAt(ind) {
	            var nodeData = this.data[ind];
	            if (!this.node.select.enabled || !nodeData.selected) return;

	            var nctx = nodeData._node.context;

	            if (nodeData.focused) {
	                //有e 说明这个函数是事件触发的，鼠标肯定还在node上面
	                nctx.lineWidth = this.node.focus.lineWidth;
	                nctx.lineAlpha = this.node.focus.lineAlpha;
	                nctx.fillAlpha = this.node.focus.fillAlpha;
	            } else {
	                nctx.lineWidth = this.node.lineWidth;
	                nctx.lineAlpha = this.node.lineAlpha;
	                nctx.fillAlpha = this.node.fillAlpha;
	            }

	            nodeData.selected = false;
	        }
	    }]);
	    return ScatGraphs;
	}(GraphsBase);

	//单环pie

	var Sector$1 = canvax.Shapes.Sector;
	var Path$2 = canvax.Shapes.Path;
	var Rect$8 = canvax.Shapes.Rect;
	var AnimationFrame$3 = canvax.AnimationFrame;
	var _$22 = canvax._;

	var Pie = function (_Canvax$Event$EventDi) {
	    inherits$1(Pie, _Canvax$Event$EventDi);

	    function Pie(_graphs, data) {
	        classCallCheck$1(this, Pie);

	        var _this = possibleConstructorReturn$1(this, (Pie.__proto__ || Object.getPrototypeOf(Pie)).call(this));

	        _this.width = 0;
	        _this.height = 0;
	        _this.origin = {
	            x: 0,
	            y: 0
	        };

	        //这个pie所属的graphs对象
	        _this._graphs = _graphs;

	        _this.domContainer = _graphs.root.canvax.domView;

	        _this.data = data;

	        _this.sprite = null;
	        _this.textSp = null;
	        _this.sectorsSp = null;
	        _this.selectedSp = null;

	        _this.init();

	        _this.sectors = [];
	        _this.textMaxCount = 15;
	        _this.textList = [];

	        _this.completed = false; //首次加载动画是否完成
	        return _this;
	    }

	    createClass$1(Pie, [{
	        key: "init",
	        value: function init() {

	            this.sprite = new canvax.Display.Sprite();

	            this.sectorsSp = new canvax.Display.Sprite();
	            this.sprite.addChild(this.sectorsSp);

	            this.selectedSp = new canvax.Display.Sprite();
	            this.sprite.addChild(this.selectedSp);

	            if (this._graphs.label.enabled) {
	                this.textSp = new canvax.Display.Sprite();
	            }        }
	    }, {
	        key: "draw",
	        value: function draw(opt) {
	            var me = this;

	            _$22.extend(true, this, opt);

	            this.sprite.context.x = me.origin.x;
	            this.sprite.context.y = me.origin.y;

	            me._widget();
	        }
	    }, {
	        key: "resetData",
	        value: function resetData(data) {
	            var me = this;
	            this.data = data;

	            me.destroyLabel();

	            var completedNum = 0;
	            for (var i = 0; i < me.sectors.length; i++) {
	                var sec = me.sectors[i];
	                var secData = this.data.list[i];

	                sec.animate({
	                    r: secData.outRadius,
	                    startAngle: secData.startAngle,
	                    endAngle: secData.endAngle
	                }, {
	                    duration: 280,
	                    onComplete: function onComplete() {
	                        completedNum++;
	                        if (completedNum == me.sectors.length) {
	                            if (me._graphs.label.enabled) {
	                                me._startWidgetLabel();
	                            }                        }
	                    }
	                });
	            }
	        }
	    }, {
	        key: "_widget",
	        value: function _widget() {
	            var me = this;
	            var list = me.data.list;
	            var total = me.data.total;
	            if (list.length > 0 && total > 0) {
	                me.textSp && me.sprite.addChild(me.textSp);
	                for (var i = 0; i < list.length; i++) {
	                    var item = list[i];

	                    //扇形主体          
	                    var sector = new Sector$1({
	                        hoverClone: false,
	                        xyToInt: false, //扇形不需要自动取整
	                        context: {
	                            x: item.focused ? item.outOffsetx : 0,
	                            y: item.focused ? item.outOffsety : 0,
	                            r0: item.innerRadius,
	                            r: item.outRadius,
	                            startAngle: item.startAngle,
	                            endAngle: item.endAngle,
	                            fillStyle: item.fillStyle,
	                            //iNode: item.iNode,
	                            cursor: "pointer"
	                        },
	                        id: 'sector' + i
	                    });

	                    sector.nodeData = item;

	                    item.focusEnabled && sector.hover(function (e) {
	                        me.focusOf(this.nodeData);
	                    }, function (e) {
	                        !this.nodeData.selected && me.unfocusOf(this.nodeData);
	                    });

	                    //触发注册的事件
	                    sector.on('mousedown mouseup panstart mouseover panmove mousemove panend mouseout tap click dblclick', function (e) {

	                        //me.fire( e.type, e );

	                        e.eventInfo = {
	                            nodes: [this.nodeData]
	                        };

	                        //图表触发，用来处理Tips
	                        me._graphs.root.fire(e.type, e);
	                        me._graphs.triggerEvent(me._graphs.node, e);
	                    });

	                    me.sectorsSp.addChildAt(sector, 0);
	                    me.sectors.push(sector);
	                }
	                if (me._graphs.label.enabled) {
	                    me._startWidgetLabel();
	                }            }
	        }
	    }, {
	        key: "focusOf",
	        value: function focusOf(node, callback) {
	            if (node.focused) return;
	            var me = this;
	            var sec = me.sectors[node.iNode];

	            sec.animate({
	                x: node.outOffsetx,
	                y: node.outOffsety
	            }, {
	                duration: 100,
	                onComplete: function onComplete() {
	                    callback && callback();
	                }
	            });
	            node.focused = true;
	        }
	    }, {
	        key: "unfocusOf",
	        value: function unfocusOf(node, callback) {
	            if (!node.focused) return;
	            var me = this;

	            var sec = me.sectors[node.iNode];
	            sec.animate({
	                x: 0,
	                y: 0
	            }, {
	                duration: 100,
	                onComplete: function onComplete() {
	                    callback && callback();
	                }
	            });

	            node.focused = false;
	        }
	    }, {
	        key: "selectOf",
	        value: function selectOf(node, e) {
	            var me = this;
	            if (!this.sectors.length || !node.selectEnabled) {
	                return;
	            }
	            var sec = this.sectors[node.iNode];

	            if (node.selected) {
	                return;
	            }
	            if (!node.focused) {
	                node._focusTigger = "select";
	                this.focusOf(node, function () {
	                    me.addCheckedSec(sec);
	                });
	            } else {
	                this.addCheckedSec(sec);
	            }            node.selected = true;
	        }
	    }, {
	        key: "unselectOf",
	        value: function unselectOf(node, e) {
	            var sec = this.sectors[node.iNode];
	            if (!node.selected || !node.selectEnabled) {
	                return;
	            }            var me = this;
	            me.cancelCheckedSec(sec, function () {
	                if (node._focusTigger == "select") {
	                    me.unfocusOf(node);
	                }            });
	            node.selected = false;
	        }
	    }, {
	        key: "addCheckedSec",
	        value: function addCheckedSec(sec, callback) {
	            var secc = sec.context;
	            var nodeData = sec.nodeData;

	            if (!secc) return;

	            var sector = new Sector$1({
	                xyToInt: false,
	                context: {
	                    x: secc.x,
	                    y: secc.y,
	                    r0: secc.r - 1,
	                    r: secc.r + nodeData.selectedR,
	                    startAngle: secc.startAngle,
	                    endAngle: secc.startAngle, //secc.endAngle,
	                    fillStyle: secc.fillStyle,
	                    globalAlpha: nodeData.selectedAlpha
	                },
	                id: 'selected_' + sec.id
	            });
	            sec._selectedSec = sector;

	            this.selectedSp.addChild(sector);

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
	            var selectedSec = sec._selectedSec;

	            selectedSec.animate({
	                startAngle: selectedSec.context.endAngle - 0.5
	            }, {
	                duration: this._getAngleTime(sec.context),
	                onComplete: function onComplete() {
	                    delete sec._selectedSec;
	                    selectedSec.destroy();
	                    callback && callback();
	                }
	            });
	        }
	    }, {
	        key: "_getAngleTime",
	        value: function _getAngleTime(secc) {
	            return Math.abs(secc.startAngle - secc.endAngle) / 360 * 500;
	        }
	    }, {
	        key: "grow",
	        value: function grow(callback) {
	            var me = this;

	            _$22.each(me.sectors, function (sec, iNode) {
	                if (sec.context) {
	                    sec.context.r0 = 0;
	                    sec.context.r = 0;
	                    sec.context.startAngle = me._graphs.startAngle;
	                    sec.context.endAngle = me._graphs.startAngle;
	                }
	            });

	            me._hideGrowLabel();

	            AnimationFrame$3.registTween({
	                from: {
	                    process: 0
	                },
	                to: {
	                    process: 1
	                },
	                duration: 500,
	                onUpdate: function onUpdate(status) {
	                    for (var i = 0; i < me.sectors.length; i++) {
	                        var sec = me.sectors[i];
	                        var nodeData = sec.nodeData;
	                        var secc = sec.context;

	                        var _startAngle = nodeData.startAngle;
	                        var _endAngle = nodeData.endAngle;
	                        var _r = nodeData.outRadius;
	                        var _r0 = nodeData.innerRadius;

	                        if (secc) {
	                            secc.r = _r * status.process;
	                            secc.r0 = _r0 * status.process;
	                            if (i == 0) {
	                                secc.startAngle = _startAngle;
	                                secc.endAngle = _startAngle + (_endAngle - _startAngle) * status.process;
	                            } else {
	                                var lastEndAngle = function (iNode) {
	                                    var lastIndex = iNode - 1;
	                                    var lastSecc = me.sectors[lastIndex].context;
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
	                                secc.endAngle = secc.startAngle + (_endAngle - _startAngle) * status.process;
	                            }
	                            //如果已经被选中，有一个选中态
	                            if (sec._selectedSec) {
	                                sec._selectedSec.context.r0 = secc.r - 1;
	                                sec._selectedSec.context.r = secc.r + nodeData.selectedR;
	                                sec._selectedSec.context.startAngle = secc.startAngle;
	                                sec._selectedSec.context.endAngle = secc.endAngle;
	                            }
	                        }
	                    }
	                },

	                onComplete: function onComplete() {
	                    me._showGrowLabel();
	                    me.completed = true;

	                    callback && callback();
	                }
	            });
	        }
	    }, {
	        key: "_widgetLabel",
	        value: function _widgetLabel(quadrant, indexs, lmin, rmin, isEnd, ySpaceInfo) {
	            var me = this;
	            var count = 0;
	            var data = me.data.list;
	            var minTxtDis = 15;
	            var textOffsetX = 5;

	            var currentIndex;
	            var preY, currentY, adjustX, txtDis, bwidth, bheight, bx, by;
	            var yBound, remainingNum, remainingY;
	            var isleft = quadrant == 2 || quadrant == 3;
	            var isup = quadrant == 3 || quadrant == 4;
	            var minY = isleft ? lmin : rmin;

	            //text的绘制顺序做修正，text的Y值在饼图上半部分（isup）时，Y值越小的先画，反之Y值在饼图下部分时，Y值越大的先画.
	            if (indexs.length > 0) {
	                indexs.sort(function (a, b) {
	                    return isup ? data[a].edgey - data[b].edgey : data[b].edgey - data[a].edgey;
	                });
	            }

	            for (var i = 0; i < indexs.length; i++) {
	                currentIndex = indexs[i];
	                var itemData = data[currentIndex];
	                var outCircleRadius = itemData.outRadius + itemData.moveDis;

	                //若Y值小于最小值，不画text    
	                if (!itemData.enabled || itemData.y < minY || count >= me.textMaxCount) continue;
	                count++;
	                currentY = itemData.edgey;
	                adjustX = Math.abs(itemData.edgex);
	                txtDis = currentY - preY;

	                if (i != 0 && (Math.abs(txtDis) < minTxtDis || isup && txtDis < 0 || !isup && txtDis > 0)) {
	                    currentY = isup ? preY + minTxtDis : preY - minTxtDis;
	                    if (outCircleRadius - Math.abs(currentY) > 0) {
	                        adjustX = Math.sqrt(Math.pow(outCircleRadius, 2) - Math.pow(currentY, 2));
	                    }

	                    if (isleft && -adjustX > itemData.edgex || !isleft && adjustX < itemData.edgex) {
	                        adjustX = Math.abs(itemData.edgex);
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

	                preY = currentY;
	                if (!isEnd) {
	                    if (isleft) {
	                        ySpaceInfo.left = preY;
	                    } else {
	                        ySpaceInfo.right = preY;
	                    }
	                }
	                var pathStr = "M" + itemData.centerx + "," + itemData.centery;
	                pathStr += "Q" + itemData.outx + "," + itemData.outy + "," + (isleft ? -adjustX - textOffsetX : adjustX + textOffsetX) + "," + currentY;

	                var path = new Path$2({
	                    context: {
	                        lineType: 'solid',
	                        path: pathStr,
	                        lineWidth: 1,
	                        strokeStyle: itemData.fillStyle
	                    }
	                });

	                //指示文字
	                /*
	                var textTxt = itemData.labelText;
	                //如果用户format过，那么就用用户指定的格式
	                //如果没有就默认拼接
	                if( !this._graphs.label.format ){
	                    if( textTxt ){
	                        textTxt = textTxt + "：" + itemData.percentage + "%" 
	                    } else {
	                        textTxt = itemData.percentage + "%" 
	                    }
	                };
	                */

	                var textTxt = itemData.labelText;
	                var branchTxt = document.createElement("div");
	                branchTxt.style.cssText = " ;position:absolute;left:-1000px;top:-1000px;color:" + itemData.fillStyle + "";
	                branchTxt.innerHTML = textTxt;
	                me.domContainer.appendChild(branchTxt);
	                bwidth = branchTxt.offsetWidth;
	                bheight = branchTxt.offsetHeight;

	                bx = isleft ? -adjustX : adjustX;
	                by = currentY;

	                switch (quadrant) {
	                    case 1:
	                        bx += textOffsetX;
	                        by -= bheight / 2;
	                        break;
	                    case 2:
	                        bx -= bwidth + textOffsetX;
	                        by -= bheight / 2;
	                        break;
	                    case 3:
	                        bx -= bwidth + textOffsetX;
	                        by -= bheight / 2;
	                        break;
	                    case 4:
	                        bx += textOffsetX;
	                        by -= bheight / 2;
	                        break;
	                }
	                branchTxt.style.left = bx + me.origin.x + "px";
	                branchTxt.style.top = by + me.origin.y + "px";

	                me.textSp.addChild(path);

	                me.textList.push({
	                    width: bwidth,
	                    height: bheight,
	                    x: bx + me.origin.x,
	                    y: by + me.origin.y,
	                    data: itemData,
	                    textTxt: textTxt,
	                    textEle: branchTxt
	                });
	            }
	        }
	    }, {
	        key: "_startWidgetLabel",
	        value: function _startWidgetLabel() {
	            var me = this;
	            var data = me.data.list;
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

	            if (widgetInfo.right.indexs.length > me.textMaxCount) {
	                sortedIndexs = widgetInfo.right.indexs.slice(0);
	                sortedIndexs.sort(function (a, b) {
	                    return data[b].y - data[a].y;
	                });
	                overflowIndexs = sortedIndexs.slice(me.textMaxCount);
	                rMinPercentage = data[overflowIndexs[0]].percentage;
	                rMinY = data[overflowIndexs[0]].y;
	            }
	            if (widgetInfo.left.indexs.length > me.textMaxCount) {
	                sortedIndexs = widgetInfo.left.indexs.slice(0);
	                sortedIndexs.sort(function (a, b) {
	                    return data[b].y - data[a].y;
	                });
	                overflowIndexs = sortedIndexs.slice(me.textMaxCount);
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
	                me._widgetLabel(quadrantsOrder[i], quadrantInfo[quadrantsOrder[i] - 1].indexs, lMinY, rMinY, isEnd, ySpaceInfo);
	            }
	        }
	    }, {
	        key: "destroyLabel",
	        value: function destroyLabel() {
	            var me = this;
	            if (this.textSp) {
	                this.textSp.removeAllChildren();
	            }            _$22.each(this.textList, function (lab) {
	                me.domContainer.removeChild(lab.textEle);
	            });
	            this.textList = [];
	        }
	    }, {
	        key: "_showGrowLabel",
	        value: function _showGrowLabel() {
	            if (this.textSp && this.textSp.context) {
	                this.textSp.context.globalAlpha = 1;
	                _$22.each(this.textList, function (lab) {
	                    lab.textEle.style.visibility = "visible";
	                });
	            }
	        }
	    }, {
	        key: "_hideGrowLabel",
	        value: function _hideGrowLabel() {
	            if (this.textSp && this.textSp.context) {
	                this.textSp.context.globalAlpha = 0;
	                _$22.each(this.textList, function (lab) {
	                    lab.textEle.style.visibility = "hidden";
	                });
	            }
	        }
	    }]);
	    return Pie;
	}(canvax.Event.EventDispatcher);

	var _$23 = canvax._;

	var PieGraphs = function (_GraphsBase) {
	    inherits$1(PieGraphs, _GraphsBase);

	    function PieGraphs(opt, root) {
	        classCallCheck$1(this, PieGraphs);

	        var _this = possibleConstructorReturn$1(this, (PieGraphs.__proto__ || Object.getPrototypeOf(PieGraphs)).call(this, opt, root));

	        _this.type = "pie";

	        _this.field = null;
	        _this.sort = null; //默认不排序，可以配置为asc,desc

	        //groupField主要是给legend用的， 所有在legend中需要显示的分组数据，都用groupField
	        //其他图也都统一， 不要改
	        _this.groupField = null;

	        _this.node = {
	            shapeType: "sector",

	            radius: null, //每个扇形单元的半径，也可以配置一个字段，就成了丁格尔玫瑰图
	            innerRadius: 0, //扇形的内圆半径
	            outRadius: null, //最大外围半径
	            minRadius: 10, //outRadius - innerRadius ， 也就是radius的最小值
	            moveDis: 15, //要预留moveDis位置来hover sector 的时候外扩

	            fillStyle: null, //this.root.getTheme(),
	            focus: {
	                enabled: true
	            },
	            select: {
	                enabled: false,
	                radius: 5,
	                alpha: 0.7
	            }
	        };

	        _this.label = {
	            field: null, //默认获取field的值，但是可以单独设置
	            enabled: false,
	            format: null
	        };

	        _this.startAngle = -90;
	        _this.allAngles = 360;

	        _this.init(opt);
	        return _this;
	    }

	    createClass$1(PieGraphs, [{
	        key: "init",
	        value: function init(opt) {
	            _$23.extend(true, this, opt);

	            this.sprite = new canvax.Display.Sprite();

	            //初步设置下data，主要legend等需要用到
	            this.data = this._dataHandle();
	        }
	    }, {
	        key: "_computerProps",
	        value: function _computerProps() {
	            var w = this.width;
	            var h = this.height;

	            //根据配置情况重新修正 outRadius ，innerRadius ------------
	            if (!this.node.outRadius) {
	                var outRadius = Math.min(w, h) / 2;
	                if (this.label.enabled) {
	                    //要预留moveDis位置来hover sector 的时候外扩
	                    outRadius -= this.node.moveDis;
	                }                this.node.outRadius = parseInt(outRadius);
	            }            if (this.node.radius !== null && _$23.isNumber(this.node.radius)) {
	                //如果用户有直接配置 radius，那么radius优先，用来计算
	                this.node.radius = Math.max(this.node.radius, this.node.minRadius);
	                //this.node.outRadius = this.node.innerRadius + this.node.radius;
	                this.node.innerRadius = this.node.outRadius - this.node.radius;
	            }
	            //要保证sec具有一个最小的radius
	            if (this.node.outRadius - this.node.innerRadius < this.node.minRadius) {
	                this.node.innerRadius = this.node.outRadius - this.node.minRadius;
	            }            if (this.node.innerRadius < 0) {
	                this.node.innerRadius = 0;
	            }            // end --------------------------------------------------
	        }

	        /**
	         * opt ==> {width,height,origin}
	         */

	    }, {
	        key: "draw",
	        value: function draw(opt) {
	            !opt && (opt = {});

	            _$23.extend(true, this, opt);
	            this._computerProps();

	            //这个时候就是真正的计算布局用得layoutdata了
	            this._pie = new Pie(this, this._trimGraphs(this.data));
	            this._pie.draw(opt);

	            var me = this;
	            if (this.animation && !opt.resize) {
	                this._pie.grow(function () {
	                    me.fire("complete");
	                });
	            } else {
	                this.fire("complete");
	            }

	            this.sprite.addChild(this._pie.sprite);
	        }
	    }, {
	        key: "show",
	        value: function show(label) {
	            this._setEnabled(label, true);
	        }
	    }, {
	        key: "hide",
	        value: function hide(label) {
	            this._setEnabled(label, false);
	        }
	    }, {
	        key: "_setEnabled",
	        value: function _setEnabled(label, status) {
	            var me = this;

	            _$23.each(this.data, function (item) {
	                if (item.label === label) {
	                    item.enabled = status;
	                    return false;
	                }
	            });

	            me._pie.resetData(me._trimGraphs(me.data));
	        }
	    }, {
	        key: "_dataHandle",
	        value: function _dataHandle() {
	            var me = this;
	            var _coor = me.root._coord;

	            var data = [];
	            var dataFrame = me.dataFrame;

	            for (var i = 0, l = dataFrame.length; i < l; i++) {
	                var rowData = dataFrame.getRowData(i);
	                var color = me.root.getTheme(i);
	                var layoutData = {
	                    rowData: rowData, //把这一行数据给到layoutData引用起来
	                    focused: false, //是否获取焦点，外扩
	                    focusEnabled: me.node.focus.enabled,

	                    selected: false, //是否选中
	                    selectEnabled: me.node.select.enabled,
	                    selectedR: me.node.select.radius,
	                    selectedAlpha: me.node.select.alpha,
	                    enabled: true, //是否启用，显示在列表中

	                    fillStyle: color,
	                    color: color, //加个color属性是为了给tips用

	                    value: rowData[me.field],
	                    label: rowData[me.groupField || me.label.field || me.field],
	                    labelText: null, //绘制的时候再设置,label format后的数据
	                    iNode: i
	                };

	                if (_$23.isFunction(this.node.fillStyle)) {
	                    var _color = this.node.fontColor(layoutData);
	                    if (!_color) {
	                        layoutData.fillStyle = layoutData.color = _color;
	                    }                }
	                data.push(layoutData);
	            }
	            if (data.length && me.sort) {
	                data.sort(function (a, b) {
	                    if (me.sort == 'asc') {
	                        return a.value - b.value;
	                    } else {
	                        return b.value - a.value;
	                    }
	                });

	                //重新设定下ind
	                _$23.each(data, function (d, i) {
	                    d.iNode = i;
	                });
	            }
	            return data;
	        }
	    }, {
	        key: "_trimGraphs",
	        value: function _trimGraphs(data) {
	            var me = this;
	            var total = 0;

	            me.currentAngle = 0 + me.startAngle % 360; //me.allAngles;
	            var limitAngle = me.allAngles + me.startAngle % me.allAngles;

	            var percentFixedNum = 2;

	            //下面连个变量当node.r设置为数据字段的时候用
	            var maxRval = 0;
	            var minRval = 0;

	            if (data.length) {
	                //先计算出来value的总量
	                for (var i = 0; i < data.length; i++) {
	                    //enabled为false的secData不参与计算
	                    if (!data[i].enabled) continue;

	                    total += data[i].value;
	                    if (me.node.radius && _$23.isString(me.node.radius) && me.node.radius in data[i].rowData) {
	                        var _r = Number(data[i].rowData[me.node.radius]);
	                        maxRval = Math.max(maxRval, _r);
	                        minRval = Math.min(minRval, _r);
	                    }
	                }
	                if (total > 0) {

	                    for (var j = 0; j < data.length; j++) {
	                        var percentage = data[j].value / total;

	                        //enabled为false的sec，比率就设置为0
	                        if (!data[j].enabled) {
	                            percentage = 0;
	                        }
	                        var fixedPercentage = +(percentage * 100).toFixed(percentFixedNum);

	                        var angle = me.allAngles * percentage;
	                        var endAngle = me.currentAngle + angle > limitAngle ? limitAngle : me.currentAngle + angle;
	                        var cosV = Math.cos((me.currentAngle + angle / 2) / 180 * Math.PI);
	                        var sinV = Math.sin((me.currentAngle + angle / 2) / 180 * Math.PI);
	                        var midAngle = me.currentAngle + angle / 2;
	                        cosV = cosV.toFixed(5);
	                        sinV = sinV.toFixed(5);
	                        var quadrant = function (ang) {
	                            if (ang >= limitAngle) {
	                                ang = limitAngle;
	                            }
	                            ang = ang % me.allAngles;
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

	                        var outRadius = me.node.outRadius;
	                        if (me.node.radius && _$23.isString(me.node.radius) && me.node.radius in data[j].rowData) {
	                            var _rr = Number(data[j].rowData[me.node.radius]);
	                            outRadius = parseInt((me.node.outRadius - me.node.innerRadius) * ((_rr - minRval) / (maxRval - minRval)) + me.node.innerRadius);
	                        }
	                        var moveDis = me.node.moveDis;

	                        _$23.extend(data[j], {
	                            outRadius: outRadius,
	                            innerRadius: me.node.innerRadius,
	                            startAngle: me.currentAngle, //起始角度
	                            endAngle: endAngle, //结束角度
	                            midAngle: midAngle, //中间角度

	                            moveDis: moveDis,

	                            outOffsetx: moveDis * 0.7 * cosV, //focus的事实外扩后圆心的坐标x
	                            outOffsety: moveDis * 0.7 * sinV, //focus的事实外扩后圆心的坐标y

	                            centerx: outRadius * cosV,
	                            centery: outRadius * sinV,
	                            outx: (outRadius + moveDis) * cosV,
	                            outy: (outRadius + moveDis) * sinV,
	                            edgex: (outRadius + moveDis) * cosV,
	                            edgey: (outRadius + moveDis) * sinV,

	                            orginPercentage: percentage,
	                            percentage: fixedPercentage,

	                            quadrant: quadrant, //象限
	                            labelDirection: quadrant == 1 || quadrant == 4 ? 1 : 0,
	                            iNode: j
	                        });

	                        //这个时候可以计算下label，因为很多时候外部label如果是配置的
	                        data[j].labelText = me._getLabelText(data[j]);

	                        me.currentAngle += angle;

	                        if (me.currentAngle > limitAngle) {
	                            me.currentAngle = limitAngle;
	                        }
	                    }                }
	            }

	            return {
	                list: data,
	                total: total
	            };
	        }
	    }, {
	        key: "_getLabelText",
	        value: function _getLabelText(itemData) {
	            var str;
	            if (this.label.enabled) {
	                if (this.label.format) {
	                    if (_$23.isFunction(this.label.format)) {
	                        str = this.label.format(itemData.label, itemData);
	                    }
	                } else {
	                    var _field = this.label.field || this.groupField;
	                    if (_field) {
	                        str = itemData.rowData[_field] + "：" + itemData.percentage + "%";
	                    } else {
	                        str = itemData.percentage + "%";
	                    }
	                }
	            }
	            return str;
	        }
	    }, {
	        key: "getList",
	        value: function getList() {
	            return this.data;
	        }
	    }, {
	        key: "getLegendData",
	        value: function getLegendData() {
	            //return this.data;
	            var legendData = [];
	            _$23.each(this.data, function (item) {
	                legendData.push({
	                    name: item.label,
	                    color: item.fillStyle,
	                    enabled: item.enabled
	                });
	            });
	            return legendData;
	        }
	    }, {
	        key: "tipsPointerOf",
	        value: function tipsPointerOf(e) {}
	    }, {
	        key: "tipsPointerHideOf",
	        value: function tipsPointerHideOf(e) {}
	    }, {
	        key: "focusAt",
	        value: function focusAt(ind) {
	            var nodeData = this._pie.data.list[ind];

	            if (!this.node.focus.enabled) return;

	            this._pie.focusOf(nodeData);
	        }
	    }, {
	        key: "unfocusAt",
	        value: function unfocusAt(ind) {
	            var nodeData = this._pie.data.list[ind];
	            if (!nodeData.node.focus.enabled) return;
	            this._pie.unfocusOf(nodeData);
	        }
	    }, {
	        key: "selectAt",
	        value: function selectAt(ind) {
	            var nodeData = this._pie.data.list[ind];
	            if (!this.node.select.enabled) return;
	            this._pie.selectOf(nodeData);
	        }
	    }, {
	        key: "unselectAt",
	        value: function unselectAt(ind) {
	            var nodeData = this._pie.data.list[ind];
	            if (!this.node.select.enabled) return;
	            this._pie.unselectOf(nodeData);
	        }
	    }]);
	    return PieGraphs;
	}(GraphsBase);

	var Polygon$3 = canvax.Shapes.Polygon;
	var Circle$5 = canvax.Shapes.Circle;
	var _$24 = canvax._;

	var RadarGraphs = function (_GraphsBase) {
	    inherits$1(RadarGraphs, _GraphsBase);

	    function RadarGraphs(opt, root) {
	        classCallCheck$1(this, RadarGraphs);

	        var _this = possibleConstructorReturn$1(this, (RadarGraphs.__proto__ || Object.getPrototypeOf(RadarGraphs)).call(this, opt, root));

	        _this.type = "radar";

	        _this.field = null;
	        _this.enabledField = null;

	        _this.line = {
	            shapeType: "brokenLine",
	            enabled: true,
	            lineWidth: 2,
	            strokeStyle: null
	        };
	        _this.area = {
	            shapeType: "path",
	            enabled: true,
	            fillStyle: null,
	            fillAlpha: 0.1
	        };
	        _this.icon = {
	            enabled: true,
	            shapeType: "circle",
	            radius: 4,
	            strokeStyle: "#ffffff",
	            lineWidth: 1
	        };

	        _this.groups = {
	            //uv : {
	            //   area : ,
	            //   nodes: 
	            //}
	        };

	        _$24.extend(true, _this, opt);

	        _this.init();
	        return _this;
	    }

	    createClass$1(RadarGraphs, [{
	        key: "init",
	        value: function init() {
	            this.sprite = new canvax.Display.Sprite({
	                id: "graphsEl"
	            });
	        }
	    }, {
	        key: "draw",
	        value: function draw(opt) {
	            !opt && (opt = {});
	            _$24.extend(true, this, opt);
	            this.data = this._trimGraphs();

	            this._widget();

	            this.sprite.context.x = this.origin.x;
	            this.sprite.context.y = this.origin.y;

	            this.fire("complete");
	        }
	    }, {
	        key: "_widget",
	        value: function _widget() {
	            var me = this;
	            var _coord = this.root._coord;

	            var iGroup = 0;
	            _$24.each(this.data, function (list, field) {

	                var group = {};

	                var pointList = [];
	                _$24.each(list, function (node, i) {
	                    pointList.push([node.point.x, node.point.y]);
	                });

	                var fieldMap = _coord.getFieldMapOf(field);

	                var _strokeStyle = me._getStyle(me.line.strokeStyle, iGroup, fieldMap.color, fieldMap);

	                var polyCtx = {
	                    pointList: pointList,
	                    cursor: "pointer"
	                };

	                if (me.line.enabled) {
	                    polyCtx.lineWidth = me.line.lineWidth;
	                    polyCtx.strokeStyle = _strokeStyle;
	                }                if (me.area.enabled) {
	                    polyCtx.fillStyle = me._getStyle(me.area.fillStyle, iGroup, fieldMap.color, fieldMap);
	                    polyCtx.fillAlpha = me._getStyle(me.area.fillAlpha, iGroup, 1, fieldMap);
	                }
	                var _poly = new Polygon$3({
	                    hoverClone: false,
	                    context: polyCtx
	                });
	                group.area = _poly;
	                me.sprite.addChild(_poly);

	                _poly.on("panstart mouseover panmove mousemove panend mouseout tap click dblclick", function (e) {

	                    if (e.type == "mouseover") {
	                        this.context.fillAlpha += 0.2;
	                    }                    if (e.type == "mouseout") {
	                        this.context.fillAlpha -= 0.2;
	                    }
	                    me.fire(e.type, e);
	                    //图表触发，用来处理Tips
	                    me.root.fire(e.type, e);
	                });

	                if (me.icon.enabled) {
	                    //绘制圆点
	                    var _nodes = [];
	                    _$24.each(list, function (node, i) {
	                        pointList.push([node.point.x, node.point.y]);
	                        var _node = new Circle$5({
	                            context: {
	                                cursor: "pointer",
	                                x: node.point.x,
	                                y: node.point.y,
	                                r: me.icon.radius,
	                                lineWidth: me.icon.lineWidth,
	                                strokeStyle: me.icon.strokeStyle,
	                                fillStyle: _strokeStyle
	                            }
	                        });
	                        me.sprite.addChild(_node);
	                        _node.iNode = i;
	                        _node.nodeData = node;
	                        _node._strokeStyle = _strokeStyle;
	                        _node.on("panstart mouseover panmove mousemove panend mouseout tap click dblclick", function (e) {

	                            me.fire(e.type, e);
	                            //图表触发，用来处理Tips

	                            //这样就会直接用这个aAxisInd了，不会用e.point去做计算
	                            e.aAxisInd = this.iNode;
	                            e.eventInfo = {
	                                nodes: [this.nodeData]
	                            };
	                            me.root.fire(e.type, e);
	                        });
	                        _nodes.push(_node);
	                    });
	                    group.nodes = _nodes;
	                }
	                me.groups[field] = group;

	                iGroup++;
	            });
	        }
	    }, {
	        key: "tipsPointerOf",
	        value: function tipsPointerOf(e) {
	            var me = this;

	            me.tipsPointerHideOf(e);

	            if (e.eventInfo && e.eventInfo.nodes) {
	                _$24.each(e.eventInfo.nodes, function (eventNode) {
	                    if (me.data[eventNode.field]) {
	                        _$24.each(me.data[eventNode.field], function (n, i) {
	                            if (eventNode.iNode == i) {
	                                me.focusOf(n);
	                            }
	                            //else {
	                            //    me.unfocusOf(n);
	                            //}
	                        });
	                    }                });
	            }
	        }
	    }, {
	        key: "tipsPointerHideOf",
	        value: function tipsPointerHideOf(e) {
	            var me = this;
	            _$24.each(me.data, function (g, i) {
	                _$24.each(g, function (node) {
	                    me.unfocusOf(node);
	                });
	            });
	        }
	    }, {
	        key: "focusOf",
	        value: function focusOf(node) {
	            if (node.focused) return;
	            var me = this;
	            var _node = me.groups[node.field].nodes[node.iNode];
	            _node.context.r += 1;
	            _node.context.fillStyle = me.icon.strokeStyle;
	            _node.context.strokeStyle = _node._strokeStyle;
	            node.focused = true;
	        }
	    }, {
	        key: "unfocusOf",
	        value: function unfocusOf(node) {
	            if (!node.focused) return;
	            var me = this;
	            var _node = me.groups[node.field].nodes[node.iNode];
	            _node.context.r -= 1;
	            _node.context.fillStyle = _node._strokeStyle;
	            _node.context.strokeStyle = me.icon.strokeStyle;
	            node.focused = false;
	        }
	    }, {
	        key: "hide",
	        value: function hide(field) {}
	    }, {
	        key: "show",
	        value: function show(field) {}
	    }, {
	        key: "_trimGraphs",
	        value: function _trimGraphs() {
	            var me = this;
	            var _coord = this.root._coord;

	            //用来计算下面的hLen
	            this.enabledField = this.root._coord.getEnabledFields(this.field);

	            var data = {};
	            _$24.each(this.enabledField, function (field) {
	                var dataOrg = me.dataFrame.getFieldData(field);
	                var fieldMap = _coord.getFieldMapOf(field);
	                var arr = [];

	                _$24.each(_coord.aAxis.angleList, function (_a, i) {
	                    //弧度
	                    var _r = Math.PI * _a / 180;
	                    var point = _coord.getPointInRadianOfR(_r, _coord.getROfNum(dataOrg[i]));
	                    arr.push({
	                        field: field,
	                        iNode: i,
	                        rowData: me.dataFrame.getRowData(i),
	                        focused: false,
	                        value: dataOrg[i],
	                        point: point,
	                        color: fieldMap.color
	                    });
	                });
	                data[field] = arr;
	            });
	            return data;
	        }
	    }, {
	        key: "_getStyle",
	        value: function _getStyle(style, iGroup, def, fieldMap) {
	            var _s = def;
	            if (_$24.isString(style) || _$24.isNumber(style)) {
	                _s = style;
	            }            if (_$24.isArray(style)) {
	                _s = style[iGroup];
	            }            if (_$24.isFunction(style)) {
	                _s = style(iGroup, fieldMap);
	            }            if (color === undefined || color === null) {
	                //只有undefined(用户配置了function),null才会认为需要还原皮肤色
	                //“”都会认为是用户主动想要设置的，就为是用户不想他显示
	                color = def;
	            }            return _s;
	        }
	    }, {
	        key: "getNodesAt",
	        value: function getNodesAt(index) {
	            //该index指当前
	            var data = this.data;
	            var _nodesInfoList = []; //节点信息集合

	            _$24.each(this.enabledField, function (fs, i) {
	                if (_$24.isArray(fs)) {
	                    _$24.each(fs, function (_fs, ii) {
	                        //fs的结构两层到顶了
	                        var node = data[_fs][index];
	                        node && _nodesInfoList.push(node);
	                    });
	                } else {
	                    var node = data[fs][index];
	                    node && _nodesInfoList.push(node);
	                }
	            });

	            return _nodesInfoList;
	        }
	    }]);
	    return RadarGraphs;
	}(GraphsBase);

	var noop = { value: function value() {} };

	function dispatch() {
	  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
	    if (!(t = arguments[i] + "") || t in _) throw new Error("illegal type: " + t);
	    _[t] = [];
	  }
	  return new Dispatch(_);
	}

	function Dispatch(_) {
	  this._ = _;
	}

	function parseTypenames(typenames, types) {
	  return typenames.trim().split(/^|\s+/).map(function (t) {
	    var name = "",
	        i = t.indexOf(".");
	    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
	    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
	    return { type: t, name: name };
	  });
	}

	Dispatch.prototype = dispatch.prototype = {
	  constructor: Dispatch,
	  on: function on(typename, callback) {
	    var _ = this._,
	        T = parseTypenames(typename + "", _),
	        t,
	        i = -1,
	        n = T.length;

	    // If no callback was specified, return the callback of the given type and name.
	    if (arguments.length < 2) {
	      while (++i < n) {
	        if ((t = (typename = T[i]).type) && (t = get$1(_[t], typename.name))) return t;
	      }return;
	    }

	    // If a type was specified, set the callback for the given type and name.
	    // Otherwise, if a null callback was specified, remove callbacks of the given name.
	    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
	    while (++i < n) {
	      if (t = (typename = T[i]).type) _[t] = set$1(_[t], typename.name, callback);else if (callback == null) for (t in _) {
	        _[t] = set$1(_[t], typename.name, null);
	      }
	    }

	    return this;
	  },
	  copy: function copy() {
	    var copy = {},
	        _ = this._;
	    for (var t in _) {
	      copy[t] = _[t].slice();
	    }return new Dispatch(copy);
	  },
	  call: function call(type, that) {
	    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) {
	      args[i] = arguments[i + 2];
	    }if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
	    for (t = this._[type], i = 0, n = t.length; i < n; ++i) {
	      t[i].value.apply(that, args);
	    }
	  },
	  apply: function apply(type, that, args) {
	    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
	    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) {
	      t[i].value.apply(that, args);
	    }
	  }
	};

	function get$1(type, name) {
	  for (var i = 0, n = type.length, c; i < n; ++i) {
	    if ((c = type[i]).name === name) {
	      return c.value;
	    }
	  }
	}

	function set$1(type, name, callback) {
	  for (var i = 0, n = type.length; i < n; ++i) {
	    if (type[i].name === name) {
	      type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
	      break;
	    }
	  }
	  if (callback != null) type.push({ name: name, value: callback });
	  return type;
	}

	// Word cloud layout by Jason Davies, https://www.jasondavies.com/wordcloud/

	var cloudRadians = Math.PI / 180,
	    cw = 1 << 11 >> 5,
	    ch = 1 << 11;

	var cloud = function cloud() {
	  var size = [256, 256],
	      text = cloudText,
	      font = cloudFont,
	      fontSize = cloudFontSize,
	      fontStyle = cloudFontNormal,
	      fontWeight = cloudFontNormal,
	      rotate = cloudRotate,
	      padding = cloudPadding,
	      spiral = archimedeanSpiral,
	      words = [],
	      timeInterval = Infinity,
	      event = dispatch("word", "end"),
	      timer = null,
	      random = Math.random,
	      cloud = {},
	      canvas = cloudCanvas;

	  cloud.canvas = function (_) {
	    return arguments.length ? (canvas = functor(_), cloud) : canvas;
	  };

	  cloud.start = function () {
	    var contextAndRatio = getContext(canvas()),
	        board = zeroArray((size[0] >> 5) * size[1]),
	        bounds = null,
	        n = words.length,
	        i = -1,
	        tags = [],
	        data = words.map(function (d, i) {
	      d.text = text.call(this, d, i);
	      d.font = font.call(this, d, i);
	      d.style = fontStyle.call(this, d, i);
	      d.weight = fontWeight.call(this, d, i);
	      d.rotate = rotate.call(this, d, i);
	      d.size = ~~fontSize.call(this, d, i);
	      d.padding = padding.call(this, d, i);
	      return d;
	    }).sort(function (a, b) {
	      return b.size - a.size;
	    });

	    if (timer) clearInterval(timer);
	    timer = setInterval(step, 0);
	    step();

	    return cloud;

	    function step() {
	      var start = Date.now();
	      while (Date.now() - start < timeInterval && ++i < n && timer) {
	        var d = data[i];
	        d.x = size[0] * (random() + .5) >> 1;
	        d.y = size[1] * (random() + .5) >> 1;
	        cloudSprite(contextAndRatio, d, data, i);
	        if (d.hasText && place(board, d, bounds)) {
	          tags.push(d);
	          event.call("word", cloud, d);
	          if (bounds) cloudBounds(bounds, d);else bounds = [{ x: d.x + d.x0, y: d.y + d.y0 }, { x: d.x + d.x1, y: d.y + d.y1 }];
	          // Temporary hack
	          d.x -= size[0] >> 1;
	          d.y -= size[1] >> 1;
	        }
	      }
	      if (i >= n) {
	        cloud.stop();
	        event.call("end", cloud, tags, bounds);
	      }
	    }
	  };

	  cloud.stop = function () {
	    if (timer) {
	      clearInterval(timer);
	      timer = null;
	    }
	    return cloud;
	  };

	  function getContext(canvas) {
	    canvas.width = canvas.height = 1;
	    var ratio = Math.sqrt(canvas.getContext("2d").getImageData(0, 0, 1, 1).data.length >> 2);
	    canvas.width = (cw << 5) / ratio;
	    canvas.height = ch / ratio;

	    var context = canvas.getContext("2d");
	    context.fillStyle = context.strokeStyle = "red";
	    context.textAlign = "center";

	    return { context: context, ratio: ratio };
	  }

	  function place(board, tag, bounds) {
	    var perimeter = [{ x: 0, y: 0 }, { x: size[0], y: size[1] }],
	        startX = tag.x,
	        startY = tag.y,
	        maxDelta = Math.sqrt(size[0] * size[0] + size[1] * size[1]),
	        s = spiral(size),
	        dt = random() < .5 ? 1 : -1,
	        t = -dt,
	        dxdy,
	        dx,
	        dy;

	    while (dxdy = s(t += dt)) {
	      dx = ~~dxdy[0];
	      dy = ~~dxdy[1];

	      if (Math.min(Math.abs(dx), Math.abs(dy)) >= maxDelta) break;

	      tag.x = startX + dx;
	      tag.y = startY + dy;

	      if (tag.x + tag.x0 < 0 || tag.y + tag.y0 < 0 || tag.x + tag.x1 > size[0] || tag.y + tag.y1 > size[1]) continue;
	      // TODO only check for collisions within current bounds.
	      if (!bounds || !cloudCollide(tag, board, size[0])) {
	        if (!bounds || collideRects(tag, bounds)) {
	          var sprite = tag.sprite,
	              w = tag.width >> 5,
	              sw = size[0] >> 5,
	              lx = tag.x - (w << 4),
	              sx = lx & 0x7f,
	              msx = 32 - sx,
	              h = tag.y1 - tag.y0,
	              x = (tag.y + tag.y0) * sw + (lx >> 5),
	              last;
	          for (var j = 0; j < h; j++) {
	            last = 0;
	            for (var i = 0; i <= w; i++) {
	              board[x + i] |= last << msx | (i < w ? (last = sprite[j * w + i]) >>> sx : 0);
	            }
	            x += sw;
	          }
	          delete tag.sprite;
	          return true;
	        }
	      }
	    }
	    return false;
	  }

	  cloud.timeInterval = function (_) {
	    return arguments.length ? (timeInterval = _ == null ? Infinity : _, cloud) : timeInterval;
	  };

	  cloud.words = function (_) {
	    return arguments.length ? (words = _, cloud) : words;
	  };

	  cloud.size = function (_) {
	    return arguments.length ? (size = [+_[0], +_[1]], cloud) : size;
	  };

	  cloud.font = function (_) {
	    return arguments.length ? (font = functor(_), cloud) : font;
	  };

	  cloud.fontStyle = function (_) {
	    return arguments.length ? (fontStyle = functor(_), cloud) : fontStyle;
	  };

	  cloud.fontWeight = function (_) {
	    return arguments.length ? (fontWeight = functor(_), cloud) : fontWeight;
	  };

	  cloud.rotate = function (_) {
	    return arguments.length ? (rotate = functor(_), cloud) : rotate;
	  };

	  cloud.text = function (_) {
	    return arguments.length ? (text = functor(_), cloud) : text;
	  };

	  cloud.spiral = function (_) {
	    return arguments.length ? (spiral = spirals[_] || _, cloud) : spiral;
	  };

	  cloud.fontSize = function (_) {
	    return arguments.length ? (fontSize = functor(_), cloud) : fontSize;
	  };

	  cloud.padding = function (_) {
	    return arguments.length ? (padding = functor(_), cloud) : padding;
	  };

	  cloud.random = function (_) {
	    return arguments.length ? (random = _, cloud) : random;
	  };

	  cloud.on = function () {
	    var value = event.on.apply(event, arguments);
	    return value === event ? cloud : value;
	  };

	  return cloud;
	};

	function cloudText(d) {
	  return d.text;
	}

	function cloudFont() {
	  return "serif";
	}

	function cloudFontNormal() {
	  return "normal";
	}

	function cloudFontSize(d) {
	  return Math.sqrt(d.value);
	}

	function cloudRotate() {
	  return (~~(Math.random() * 6) - 3) * 30;
	}

	function cloudPadding() {
	  return 1;
	}

	// Fetches a monochrome sprite bitmap for the specified text.
	// Load in batches for speed.
	function cloudSprite(contextAndRatio, d, data, di) {
	  if (d.sprite) return;
	  var c = contextAndRatio.context,
	      ratio = contextAndRatio.ratio;

	  c.clearRect(0, 0, (cw << 5) / ratio, ch / ratio);
	  var x = 0,
	      y = 0,
	      maxh = 0,
	      n = data.length;
	  --di;
	  while (++di < n) {
	    d = data[di];
	    c.save();
	    c.font = d.style + " " + d.weight + " " + ~~((d.size + 1) / ratio) + "px " + d.font;
	    var w = c.measureText(d.text + "m").width * ratio,
	        h = d.size << 1;
	    if (d.rotate) {
	      var sr = Math.sin(d.rotate * cloudRadians),
	          cr = Math.cos(d.rotate * cloudRadians),
	          wcr = w * cr,
	          wsr = w * sr,
	          hcr = h * cr,
	          hsr = h * sr;
	      w = Math.max(Math.abs(wcr + hsr), Math.abs(wcr - hsr)) + 0x1f >> 5 << 5;
	      h = ~~Math.max(Math.abs(wsr + hcr), Math.abs(wsr - hcr));
	    } else {
	      w = w + 0x1f >> 5 << 5;
	    }
	    if (h > maxh) maxh = h;
	    if (x + w >= cw << 5) {
	      x = 0;
	      y += maxh;
	      maxh = 0;
	    }
	    if (y + h >= ch) break;
	    c.translate((x + (w >> 1)) / ratio, (y + (h >> 1)) / ratio);
	    if (d.rotate) c.rotate(d.rotate * cloudRadians);
	    c.fillText(d.text, 0, 0);
	    if (d.padding) c.lineWidth = 2 * d.padding, c.strokeText(d.text, 0, 0);
	    c.restore();
	    d.width = w;
	    d.height = h;
	    d.xoff = x;
	    d.yoff = y;
	    d.x1 = w >> 1;
	    d.y1 = h >> 1;
	    d.x0 = -d.x1;
	    d.y0 = -d.y1;
	    d.hasText = true;
	    x += w;
	  }
	  var pixels = c.getImageData(0, 0, (cw << 5) / ratio, ch / ratio).data,
	      sprite = [];
	  while (--di >= 0) {
	    d = data[di];
	    if (!d.hasText) continue;
	    var w = d.width,
	        w32 = w >> 5,
	        h = d.y1 - d.y0;
	    // Zero the buffer
	    for (var i = 0; i < h * w32; i++) {
	      sprite[i] = 0;
	    }x = d.xoff;
	    if (x == null) return;
	    y = d.yoff;
	    var seen = 0,
	        seenRow = -1;
	    for (var j = 0; j < h; j++) {
	      for (var i = 0; i < w; i++) {
	        var k = w32 * j + (i >> 5),
	            m = pixels[(y + j) * (cw << 5) + (x + i) << 2] ? 1 << 31 - i % 32 : 0;
	        sprite[k] |= m;
	        seen |= m;
	      }
	      if (seen) seenRow = j;else {
	        d.y0++;
	        h--;
	        j--;
	        y++;
	      }
	    }
	    d.y1 = d.y0 + seenRow;
	    d.sprite = sprite.slice(0, (d.y1 - d.y0) * w32);
	  }
	}

	// Use mask-based collision detection.
	function cloudCollide(tag, board, sw) {
	  sw >>= 5;
	  var sprite = tag.sprite,
	      w = tag.width >> 5,
	      lx = tag.x - (w << 4),
	      sx = lx & 0x7f,
	      msx = 32 - sx,
	      h = tag.y1 - tag.y0,
	      x = (tag.y + tag.y0) * sw + (lx >> 5),
	      last;
	  for (var j = 0; j < h; j++) {
	    last = 0;
	    for (var i = 0; i <= w; i++) {
	      if ((last << msx | (i < w ? (last = sprite[j * w + i]) >>> sx : 0)) & board[x + i]) return true;
	    }
	    x += sw;
	  }
	  return false;
	}

	function cloudBounds(bounds, d) {
	  var b0 = bounds[0],
	      b1 = bounds[1];
	  if (d.x + d.x0 < b0.x) b0.x = d.x + d.x0;
	  if (d.y + d.y0 < b0.y) b0.y = d.y + d.y0;
	  if (d.x + d.x1 > b1.x) b1.x = d.x + d.x1;
	  if (d.y + d.y1 > b1.y) b1.y = d.y + d.y1;
	}

	function collideRects(a, b) {
	  return a.x + a.x1 > b[0].x && a.x + a.x0 < b[1].x && a.y + a.y1 > b[0].y && a.y + a.y0 < b[1].y;
	}

	function archimedeanSpiral(size) {
	  var e = size[0] / size[1];
	  return function (t) {
	    return [e * (t *= .1) * Math.cos(t), t * Math.sin(t)];
	  };
	}

	function rectangularSpiral(size) {
	  var dy = 4,
	      dx = dy * size[0] / size[1],
	      x = 0,
	      y = 0;
	  return function (t) {
	    var sign = t < 0 ? -1 : 1;
	    // See triangular numbers: T_n = n * (n + 1) / 2.
	    switch (Math.sqrt(1 + 4 * sign * t) - sign & 3) {
	      case 0:
	        x += dx;break;
	      case 1:
	        y += dy;break;
	      case 2:
	        x -= dx;break;
	      default:
	        y -= dy;break;
	    }
	    return [x, y];
	  };
	}

	// TODO reuse arrays?
	function zeroArray(n) {
	  var a = [],
	      i = -1;
	  while (++i < n) {
	    a[i] = 0;
	  }return a;
	}

	function cloudCanvas() {
	  return document.createElement("canvas");
	}

	function functor(d) {
	  return typeof d === "function" ? d : function () {
	    return d;
	  };
	}

	var spirals = {
	  archimedean: archimedeanSpiral,
	  rectangular: rectangularSpiral
	};

	var _$25 = canvax._;
	var Text$1 = canvax.Display.Text;

	var CloudGraphs = function (_GraphsBase) {
	    inherits$1(CloudGraphs, _GraphsBase);

	    function CloudGraphs(opt, root) {
	        classCallCheck$1(this, CloudGraphs);

	        var _this = possibleConstructorReturn$1(this, (CloudGraphs.__proto__ || Object.getPrototypeOf(CloudGraphs)).call(this, opt, root));

	        _this.type = "cloud";

	        _this.field = null;

	        var me = _this;

	        //坚持一个数据节点的设置都在一个node下面
	        _this.node = {
	            fontFamily: "Impact",
	            fontColor: function fontColor(nodeData) {
	                return me.root.getTheme(nodeData.iNode);
	            },
	            fontSize: function fontSize() {
	                //fontSize默认12-50的随机值
	                return this.minFontSize + Math.random() * this.maxFontSize;
	            },
	            maxFontSize: 30,
	            _maxFontSizeVal: 0, //fontSizer如果配置为一个field的话， 找出这个field数据的最大值
	            minFontSize: 16,
	            _minFontSizeVal: null, //fontSizer如果配置为一个field的话， 找出这个field数据的最小值

	            fontWeight: "normal",

	            format: function format(str, tag) {
	                return str;
	            },

	            padding: 10,

	            rotation: function rotation() {
	                return (~~(Math.random() * 6) - 3) * 30;
	            },

	            strokeStyle: null,
	            focus: {
	                enabled: true
	            },
	            select: {
	                enabled: true,
	                lineWidth: 2,
	                strokeStyle: "#666"
	            }
	        };

	        _$25.extend(true, _this, opt);

	        _this.init();
	        return _this;
	    }

	    createClass$1(CloudGraphs, [{
	        key: "init",
	        value: function init() {
	            this.sprite = new canvax.Display.Sprite({
	                id: "graphsEl"
	            });
	        }
	    }, {
	        key: "draw",
	        value: function draw(opt) {
	            !opt && (opt = {});
	            _$25.extend(true, this, opt);
	            this._drawGraphs();
	            this.sprite.context.x = this.width / 2;
	            this.sprite.context.y = this.height / 2;

	            this.fire("complete");
	        }
	    }, {
	        key: "getDaraFrameIndOfVal",
	        value: function getDaraFrameIndOfVal(val) {
	            var me = this;
	            var df = this.dataFrame;
	            var org = _$25.find(df.data, function (d) {
	                return d.field == me.field;
	            });
	            var ind = _$25.indexOf(org.data, val);
	            return ind;
	        }
	    }, {
	        key: "_getFontSize",
	        value: function _getFontSize(rowData, val) {
	            var size = this.node.minFontSize;

	            if (_$25.isFunction(this.node.fontSize)) {
	                size = this.node.fontSize(rowData);
	            }
	            if (_$25.isString(this.node.fontSize) && this.node.fontSize in rowData) {
	                var val = Number(rowData[this.node.fontSize]);
	                if (!isNaN(val)) {
	                    size = this.node.minFontSize + (this.node.maxFontSize - this.node.minFontSize) / (this.node._maxFontSizeVal - this.node._minFontSizeVal) * (val - this.node._minFontSizeVal);
	                }
	            }

	            if (_$25.isNumber(this.node.fontSize)) {
	                size = this.node.fontSize;
	            }

	            return size;
	        }
	    }, {
	        key: "_getRotate",
	        value: function _getRotate(item, ind) {
	            var rotation = this.node.rotation;
	            if (_$25.isFunction(this.node.rotation)) {
	                rotation = this.node.rotation(item, ind) || 0;
	            }            return rotation;
	        }
	    }, {
	        key: "_getFontColor",
	        value: function _getFontColor(nodeData) {
	            var color;
	            if (_$25.isString(this.node.fontColor)) {
	                color = this.node.fontColor;
	            }
	            if (_$25.isFunction(this.node.fontColor)) {
	                color = this.node.fontColor(nodeData);
	            }

	            if (color === undefined || color === null) {
	                //只有undefined才会认为需要一个抄底色
	                //“”都会认为是用户主动想要设置的，就为是用户不想他显示
	                color = "#ccc";
	            }            return color;
	        }
	    }, {
	        key: "_drawGraphs",
	        value: function _drawGraphs() {
	            var me = this;
	            if (_$25.isString(this.node.fontSize)) {
	                _$25.each(me.dataFrame.getFieldData(this.node.fontSize), function (val) {
	                    me.node._maxFontSizeVal = Math.max(me.node._maxFontSizeVal, val);
	                    me.node._minFontSizeVal = Math.min(me.node._minFontSizeVal, val);
	                });
	            }

	            var layout = cloud().size([me.width, me.height]).words(me.dataFrame.getFieldData(me.field).map(function (d, ind) {
	                var rowData = me.root.dataFrame.getRowData(me.getDaraFrameIndOfVal(d)); //这里不能直接用i去从dataFrame里查询,因为cloud layout后，可能会扔掉渲染不下的部分
	                var tag = {
	                    rowData: rowData,
	                    field: me.field,
	                    value: d,
	                    text: null,
	                    size: me._getFontSize(rowData, d),
	                    iNode: ind,
	                    color: null //在绘制的时候统一设置
	                };

	                tag.fontColor = me._getFontColor(tag);
	                tag.text = me.node.format(d, tag) || d;

	                return tag;
	            })).padding(me.node.padding).rotate(function (item, ind) {
	                //return 0;
	                return me._getRotate(item, ind);
	            }).font(me.node.fontFamily).fontSize(function (d) {
	                return d.size;
	            }).on("end", draw);

	            layout.start();

	            function draw(data, e) {

	                me.data = data;
	                me.sprite.removeAllChildren();

	                _$25.each(data, function (tag, i) {

	                    tag.iNode = i;
	                    tag.dataLen = data.length;

	                    tag.focused = false;
	                    tag.selected = false;

	                    var tagTxt = new Text$1(tag.text, {
	                        context: {
	                            x: tag.x,
	                            y: tag.y,
	                            fontSize: tag.size,
	                            fontFamily: tag.font,
	                            rotation: tag.rotate,
	                            textBaseline: "middle",
	                            textAlign: "center",
	                            cursor: 'pointer',
	                            fontWeight: me.node.fontWeight,
	                            fillStyle: tag.fontColor
	                        }
	                    });
	                    me.sprite.addChild(tagTxt);

	                    me.node.focus.enabled && tagTxt.hover(function (e) {
	                        me.focusAt(this.nodeData.iNode);
	                    }, function (e) {
	                        !this.nodeData.selected && me.unfocusAt(this.nodeData.iNode);
	                    });

	                    tagTxt.nodeData = tag;
	                    tag._node = tagTxt;
	                    tagTxt.on("mousedown mouseup panstart mouseover panmove mousemove panend mouseout tap click dblclick", function (e) {

	                        e.eventInfo = {
	                            title: null,
	                            nodes: [this.nodeData]
	                        };
	                        if (this.nodeData.text) {
	                            e.eventInfo.title = this.nodeData.text;
	                        }
	                        //fire到root上面去的是为了让root去处理tips
	                        me.root.fire(e.type, e);
	                        me.triggerEvent(me.node, e);
	                    });
	                });
	            }
	        }
	    }, {
	        key: "focusAt",
	        value: function focusAt(ind) {
	            var nodeData = this.data[ind];
	            if (!this.node.focus.enabled || nodeData.focused) return;

	            var nctx = nodeData._node.context;
	            nctx.fontSize += 3;
	            nodeData.focused = true;
	        }
	    }, {
	        key: "unfocusAt",
	        value: function unfocusAt(ind) {
	            var nodeData = this.data[ind];
	            if (!this.node.focus.enabled || !nodeData.focused) return;
	            var nctx = nodeData._node.context;
	            nctx.fontSize -= 3;
	            nodeData.focused = false;
	        }
	    }, {
	        key: "selectAt",
	        value: function selectAt(ind) {

	            var nodeData = this.data[ind];
	            if (!this.node.select.enabled || nodeData.selected) return;

	            var nctx = nodeData._node.context;
	            nctx.lineWidth = this.node.select.lineWidth;
	            nctx.lineAlpha = this.node.select.lineAlpha;
	            nctx.strokeStyle = this.node.select.strokeStyle;

	            nodeData.selected = true;
	        }
	    }, {
	        key: "unselectAt",
	        value: function unselectAt(ind) {
	            var nodeData = this.data[ind];
	            if (!this.node.select.enabled || !nodeData.selected) return;
	            var nctx = nodeData._node.context;
	            nctx.strokeStyle = this.node.strokeStyle;

	            nodeData.selected = false;
	        }
	    }]);
	    return CloudGraphs;
	}(GraphsBase);

	var _$26 = canvax._;
	var Text$2 = canvax.Display.Text;
	var Circle$6 = canvax.Shapes.Circle;

	var PlanetGroup = function () {
	    function PlanetGroup(opt, dataFrame, _graphs) {
	        classCallCheck$1(this, PlanetGroup);


	        this._opts = opt;
	        this.dataFrame = dataFrame;
	        this._graphs = _graphs;
	        this.root = _graphs.root;
	        this._coord = this.root._coord;

	        this.field = null;

	        this.iGroup = 0;
	        this.groupLen = 1;

	        //分组可以绘制的半径范围
	        this.rRange = {
	            start: 0,
	            to: 0
	        };

	        this.width = 0;
	        this.height = 0;

	        this.node = {
	            shapeType: "circle",
	            maxR: 30, //15
	            minR: 5,
	            lineWidth: 2,
	            strokeStyle: "#fff",
	            fillStyle: '#f2fbfb',
	            radius: 15, //也可以是个function,也可以配置{field:'pv'}来设置字段， 自动计算r

	            focus: {
	                enabled: true
	            },
	            select: {
	                enabled: true,
	                lineWidth: 2,
	                strokeStyle: "#666"
	            }
	        };

	        this.label = {
	            enabled: true,
	            fontColor: "#666",
	            fontSize: 13,
	            position: null
	        };

	        this.sort = "desc";
	        this.sortField = null;

	        this.layoutType = "radian";

	        //坑位，用来做占位
	        this.pit = {
	            radius: 30
	        };

	        this.planets = [];

	        this.maxRingNum = 0;
	        this.ringNum = 0;

	        _$26.extend(true, this, opt);

	        //circle.maxR 绝对不能大于最大 占位 pit.radius
	        if (this.node.maxR > this.pit.radius) {
	            this.pit.radius = this.node.maxR;
	        }
	        this.init();
	    }

	    createClass$1(PlanetGroup, [{
	        key: "init",
	        value: function init() {
	            this.sprite = new canvax.Display.Sprite({
	                id: "group_" + this.iGroup,
	                context: {
	                    x: this._coord.origin.x,
	                    y: this._coord.origin.y
	                }
	            });

	            this._trimGraphs();

	            this.draw();
	        }
	    }, {
	        key: "_trimGraphs",
	        value: function _trimGraphs() {
	            var me = this;

	            if ((this._coord.maxR - this.rRange.to) / (this.pit.radius * 2) < this.groupLen - 1 - this.iGroup) {
	                //要保证后面的group至少能有意个ringNum
	                this.rRange.to = this._coord.maxR - (this.groupLen - 1 - this.iGroup) * this.pit.radius * 2;
	            }            if (this.rRange.to - this.rRange.start < this.pit.radius * 2) {
	                this.rRange.to = this.rRange.start + this.pit.radius * 2;
	            }
	            //计算该group中可以最多分布多少ring
	            if (!this.maxRingNum) {
	                this.maxRingNum = parseInt((this.rRange.to - this.rRange.start) / (this.pit.radius * 2), 10);

	                /* TODO: 这个目前有问题
	                //如果可以划10个环，但是其实数据只有8条， 那么就 当然是只需要划分8ring
	                //this.ringNum = Math.min( this.maxRingNum , this.dataFrame.length );
	                */
	                this.ringNum = this.maxRingNum;
	            }
	            //重新计算修改 rRange.to的值
	            this.rRange.to = this.rRange.start + this.ringNum * this.pit.radius * 2;

	            //根据数据创建n个星球
	            var planets = [];

	            var dataLen = this.dataFrame.length;
	            for (var i = 0; i < dataLen; i++) {

	                var rowData = this.dataFrame.getRowData(i);
	                var planetLayoutData = {
	                    groupLen: this.groupLen,
	                    iGroup: me.iGroup,
	                    iNode: i,
	                    node: null, //canvax元素
	                    rowData: rowData,

	                    //下面这些都只能在绘制的时候确定然后赋值
	                    iRing: null,
	                    iPlanet: null,
	                    fillStyle: null,
	                    color: null, //给tips用
	                    strokeStyle: null,

	                    pit: null, //假设这个planet是个萝卜，那么 pit 就是这个萝卜的坑

	                    ringInd: -1,

	                    field: me.field,
	                    label: rowData[me.field],

	                    focused: false,
	                    selected: false
	                };

	                planets.push(planetLayoutData);
	            }
	            if (me.sortField) {
	                planets = planets.sort(function (a, b) {
	                    var field = me.sortField;
	                    if (me.sort == "desc") {
	                        return b.rowData[field] - a.rowData[field];
	                    } else {
	                        return a.rowData[field] - b.rowData[field];
	                    }
	                });
	                //修正下 排序过后的 iNode
	                _$26.each(planets, function (planet, i) {
	                    planet.iNode = i;
	                });
	            }
	            this._rings = this["_setRings_" + this.layoutType + "Range"](planets);

	            this.planets = planets;
	        }

	        //根据弧度对应可以排列多少个星球的占比来分段

	    }, {
	        key: "_setRings_radianRange",
	        value: function _setRings_radianRange(planets) {
	            var me = this;
	            var _rings = [];

	            for (var i = 0, l = this.ringNum; i < l; i++) {
	                var _r = i * this.pit.radius * 2 + this.pit.radius + this.rRange.start;

	                if (!me._graphs.center.enabled) {
	                    _r = i * this.pit.radius * 2 + this.rRange.start;
	                }
	                //该半径上面的弧度集合
	                var arcs = this._coord.getRadiansAtR(_r, me.width, me.height);

	                //测试代码begin---------------------------------------------------
	                //用来绘制弧度的辅助线
	                /*
	                _.each( arcs, function( arc ){
	                    var sector = new Canvax.Shapes.Sector({
	                        context: {
	                            r: _r,
	                            startAngle: arc[0].radian*180/Math.PI,
	                            endAngle: arc[1].radian*180/Math.PI, //secc.endAngle,
	                            strokeStyle: "#ccc",
	                            lineWidth:1
	                        },
	                    });
	                    me.sprite.addChild( sector );
	                } );
	                */
	                //测试代码end------------------------------------------------------

	                //该半径圆弧上，可以绘制一个星球的最小弧度值
	                var minRadianItem = Math.atan(this.pit.radius / _r);

	                _rings.push({
	                    arcs: arcs,
	                    pits: [], //萝卜坑
	                    planets: [], //将要入坑的萝卜
	                    radius: _r, //这个ring所在的半径轨道
	                    max: 0 //这个环上面最多能布局下的 planet 数量
	                });
	            }
	            var allplanetsMax = 0; //所有ring里面

	            //计算每个环的最大可以创建星球数量,然后把所有的数量相加做分母。
	            //然后计算自己的比例去 planets 里面拿对应比例的数据

	            _$26.each(_rings, function (ring, i) {
	                //先计算上这个轨道上排排站一共可以放的下多少个星球
	                //一个星球需要多少弧度
	                var minRadian = Math.asin(me.pit.radius / ring.radius) * 2;
	                if (ring.radius == 0) {
	                    //说明就在圆心
	                    minRadian = Math.PI * 2;
	                }
	                var _count = 0;

	                _$26.each(ring.arcs, function (arc) {
	                    var _adiff = me._getDiffRadian(arc[0].radian, arc[1].radian);
	                    if (_adiff >= minRadian) {
	                        var _arc_count = parseInt(_adiff / minRadian, 10);
	                        _count += _arc_count;
	                        //这个弧段里可以放_count个坑位
	                        for (var p = 0; p < _arc_count; p++) {
	                            var pit = {
	                                hasRadish: false, //是否已经有萝卜(一个萝卜一个坑)
	                                start: (arc[0].radian + minRadian * p + Math.PI * 2) % (Math.PI * 2)
	                            };
	                            pit.middle = (pit.start + minRadian / 2 + Math.PI * 2) % (Math.PI * 2);
	                            pit.to = (pit.start + minRadian + Math.PI * 2) % (Math.PI * 2);

	                            ring.pits.push(pit);

	                            //测试占位情况代码begin---------------------------------------------
	                            /*
	                            var point = me._coord.getPointInRadianOfR( pit.middle , ring.radius )
	                            me.sprite.addChild(new Circle({
	                                context:{
	                                    x : point.x,
	                                    y : point.y,
	                                    r : me.pit.radius,
	                                    fillStyle: "#ccc",
	                                    strokeStyle: "red",
	                                    lineWidth: 1,
	                                    globalAlpha:0.3
	                                }
	                            }));
	                            */
	                            //测试占位情况代码end-----------------------------------------------     
	                        }                    }
	                });
	                ring.max = _count;
	                allplanetsMax += _count;

	                //坑位做次随机乱序
	                ring.pits = _$26.shuffle(ring.pits);
	            });

	            //allplanetsMax有了后作为分明， 可以给每个ring去分摊 planet 了
	            var preAllCount = 0;
	            _$26.each(_rings, function (ring, i) {

	                if (preAllCount >= planets.length) {
	                    return false;
	                }
	                var num = Math.ceil(ring.max / allplanetsMax * planets.length);
	                num = Math.min(ring.max, num);

	                ring.planets = planets.slice(preAllCount, preAllCount + num);
	                if (i == _rings.length - 1) {
	                    ring.planets = planets.slice(preAllCount);
	                }                preAllCount += num;

	                //给每个萝卜分配一个坑位
	                _$26.each(ring.planets, function (planet, ii) {

	                    if (ii >= ring.pits.length) {
	                        //如果萝卜已经比这个ring上面的坑要多，就要扔掉， 没办法的
	                        return;
	                    }
	                    var pits = _$26.filter(ring.pits, function (pit) {
	                        return !pit.hasRadish;
	                    });

	                    var targetPit = pits[parseInt(Math.random() * pits.length)];
	                    targetPit.hasRadish = true;
	                    planet.pit = targetPit;
	                });
	            });

	            return _rings;
	        }
	    }, {
	        key: "_getDiffRadian",
	        value: function _getDiffRadian(_start, _to) {
	            var _adiff = _to - _start;
	            if (_to < _start) {
	                _adiff = (_to + Math.PI * 2 - _start) % (Math.PI * 2);
	            }
	            return _adiff;
	        }

	        //索引区间分段法 待实现

	    }, {
	        key: "_setRings_indexRange",
	        value: function _setRings_indexRange(planets) {}

	        //值区间分段法
	        //todo:这样确实就很可能数据集中在两段中间没有 待实现

	    }, {
	        key: "_setRings_valRange",
	        value: function _setRings_valRange(planets) {}
	    }, {
	        key: "draw",
	        value: function draw() {
	            var me = this;
	            _$26.each(this._rings, function (ring, i) {
	                var _ringCtx = {
	                    rotation: 0
	                };
	                if (ring.arcs.length == 1 && ring.arcs[0][0].radian == 0 && ring.arcs[0][1].radian == Math.PI * 2) {
	                    //如果这个是一个整个的内圆，那么就做个随机的旋转
	                    _ringCtx.rotation = parseInt(Math.random() * 360);
	                }                var _ringSp = new canvax.Display.Sprite({
	                    context: _ringCtx
	                });

	                _$26.each(ring.planets, function (p, ii) {
	                    if (!p.pit) {
	                        //如果这个萝卜没有足够的坑位可以放，很遗憾，只能扔掉了
	                        return;
	                    }
	                    var point = me._coord.getPointInRadianOfR(p.pit.middle, ring.radius);

	                    var r = me._getRProp(me.node.radius, i, ii, p);

	                    //计算该萝卜在坑位（pit）中围绕pit的圆心可以随机移动的范围（r）
	                    var _transR = me.node.maxR - r;
	                    //然后围绕pit的圆心随机找一个点位，重新设置Point
	                    var _randomTransR = parseInt(Math.random() * _transR);
	                    var _randomAngle = parseInt(Math.random() * 360);
	                    var _randomRadian = _randomAngle * Math.PI / 180;
	                    if (_randomTransR != 0) {
	                        //说明还是在圆心， 就没必要重新计算point
	                        point.x += Math.sin(_randomRadian) * _randomTransR;
	                        point.y += Math.cos(_randomRadian) * _randomTransR;
	                    }
	                    var _fillStyle = me._getProp(me.node.fillStyle, i, ii, p);
	                    var _strokeStyle = me._getProp(me.node.strokeStyle, i, ii, p);

	                    var circleCtx = {
	                        x: point.x,
	                        y: point.y,
	                        r: r,
	                        fillStyle: _fillStyle,
	                        lineWidth: me._getProp(me.node.lineWidth, i, ii, p),
	                        strokeStyle: _strokeStyle,
	                        cursor: "pointer"
	                    };

	                    //设置好p上面的fillStyle 和 strokeStyle
	                    p.color = p.fillStyle = _fillStyle;
	                    p.strokeStyle = _strokeStyle;
	                    p.iRing = i;
	                    p.iPlanet = ii;

	                    var _node = new Circle$6({
	                        hoverClone: false,
	                        context: circleCtx
	                    });

	                    _node.on("mousedown mouseup panstart mouseover panmove mousemove panend mouseout tap click dblclick", function (e) {

	                        e.eventInfo = {
	                            title: null,
	                            nodes: [this.nodeData]
	                        };
	                        if (this.nodeData.label) {
	                            e.eventInfo.title = this.nodeData.label;
	                        }
	                        //fire到root上面去的是为了让root去处理tips
	                        me.root.fire(e.type, e);
	                        me._graphs.triggerEvent(me.node, e);
	                    });

	                    //互相用属性引用起来
	                    _node.nodeData = p;
	                    p.node = _node;

	                    _node.ringInd = i;
	                    _node.planetIndInRing = ii;

	                    _ringSp.addChild(_node);

	                    //然后添加label
	                    //绘制实心圆上面的文案
	                    var _labelCtx = {
	                        x: point.x,
	                        y: point.y, //point.y + r +3
	                        fontSize: me.label.fontSize,
	                        textAlign: "center",
	                        textBaseline: "middle",
	                        fillStyle: me.label.fontColor,
	                        rotation: -_ringCtx.rotation,
	                        rotateOrigin: {
	                            x: 0,
	                            y: 0 //-(r + 3)
	                        }
	                    };
	                    var _text = new canvax.Display.Text(p.label, {
	                        context: _labelCtx
	                    });

	                    var _labelWidth = _text.getTextWidth();
	                    var _labelHeight = _text.getTextHeight();

	                    if (me.label.position) {
	                        if (_$26.isFunction(me.label.position)) {
	                            var _pos = me.label.position({
	                                node: _node,
	                                circleR: r,
	                                circleCenter: {
	                                    x: point.x,
	                                    y: point.y
	                                },
	                                textWidth: _labelWidth,
	                                textHeight: _labelHeight
	                            });

	                            _labelCtx.rotation = -_ringCtx.rotation;
	                            _labelCtx.rotateOrigin = {
	                                x: -(_pos.x - _labelCtx.x),
	                                y: -(_pos.y - _labelCtx.y)
	                            };
	                            _labelCtx.x = _pos.x;
	                            _labelCtx.y = _pos.y;

	                            if (_labelWidth > r * 2) {
	                                _labelCtx.fontSize = me.label.fontSize - 3;
	                            }
	                        }
	                    } else {
	                        //如果没有制定position。就用默认的布局方案。
	                        if (_labelWidth > r * 2) {
	                            _labelCtx.y = point.y + r + 3;
	                            _labelCtx.textBaseline = "top";
	                            _labelCtx.rotation = -_ringCtx.rotation;
	                            _labelCtx.rotateOrigin = {
	                                x: 0,
	                                y: -(r + 3)
	                            };
	                        }                    }

	                    //TODO:这里其实应该是直接可以修改 _text.context. 属性的
	                    //但是这里版本的canvax有问题。先重新创建文本对象吧
	                    _text = new canvax.Display.Text(p.label, {
	                        context: _labelCtx
	                    });

	                    //互相用属性引用起来
	                    _node.textNode = _text;
	                    _text.nodeData = p;
	                    p.textNode = _text;

	                    _ringSp.addChild(_text);
	                });

	                me.sprite.addChild(_ringSp);
	            });
	        }
	    }, {
	        key: "_getRProp",
	        value: function _getRProp(r, ringInd, iNode, nodeData) {
	            var me = this;

	            if (_$26.isString(r) && _$26.indexOf(me.dataFrame.fields, r) > -1) {
	                if (this.__rValMax == undefined && this.__rValMax == undefined) {
	                    this.__rValMax = 0;
	                    this.__rValMin = 0;
	                    _$26.each(me.planets, function (planet) {
	                        me.__rValMax = Math.max(me.__rValMax, planet.rowData[r]);
	                        me.__rValMin = Math.min(me.__rValMin, planet.rowData[r]);
	                    });
	                }                var rVal = nodeData.rowData[r];

	                return me.node.minR + (rVal - this.__rValMin) / (this.__rValMax - this.__rValMin) * (me.node.maxR - me.node.minR);
	            }            return me._getProp(r, ringInd, iNode, nodeData);
	        }
	    }, {
	        key: "_getProp",
	        value: function _getProp(p, ringInd, iNode, nodeData) {
	            var iGroup = this.iGroup;
	            if (_$26.isFunction(p)) {
	                //return p.apply( this , [ nodeData ] );
	                return p(nodeData);
	            }            return p;
	        }
	    }]);
	    return PlanetGroup;
	}();

	var _$27 = canvax._;
	var Text$3 = canvax.Display.Text;
	var Circle$7 = canvax.Shapes.Circle;
	var Line$6 = canvax.Shapes.Line;
	var Rect$9 = canvax.Shapes.Rect;

	var PlanetGraphs = function (_GraphsBase) {
	    inherits$1(PlanetGraphs, _GraphsBase);

	    function PlanetGraphs(opt, root) {
	        classCallCheck$1(this, PlanetGraphs);

	        var _this = possibleConstructorReturn$1(this, (PlanetGraphs.__proto__ || Object.getPrototypeOf(PlanetGraphs)).call(this, opt, root));

	        _this.type = "planet";

	        _this.field = null;
	        //圆心原点坐标
	        _this.center = {
	            enabled: true,
	            text: "center",
	            radius: 30,
	            fillStyle: "#70629e",
	            fontSize: 15,
	            fontColor: "#ffffff",
	            margin: 20 //最近ring到太阳的距离
	        };

	        _this.groupDataFrames = [];
	        _this.groupField = null;
	        _this._ringGroups = []; //groupField对应的 group 对象

	        //planet自己得grid，不用polar的grid
	        _this.grid = {
	            rings: {
	                fillStyle: null,
	                strokeStyle: null,
	                lineWidth: 1,
	                section: [], //环形刻度线集合
	                count: 3 //在 section.length>1 的时候会被修改为 section.length
	            },
	            rays: {
	                count: 0,
	                lineWidth: 1,
	                strokeStyle: "#10519D",
	                globalAlpha: 0.4
	            }
	        };

	        _$27.extend(true, _this, opt);

	        if (_this.center.radius == 0 || !_this.center.enabled) {
	            _this.center.radius = 0;
	            _this.center.margin = 0;
	            _this.center.enabled = false;
	        }
	        _this.init();
	        return _this;
	    }

	    createClass$1(PlanetGraphs, [{
	        key: "init",
	        value: function init() {
	            this.sprite = new canvax.Display.Sprite({
	                id: "graphsEl"
	            });

	            this.gridSp = new canvax.Display.Sprite({
	                id: "gridSp"
	            });

	            this.sprite.addChild(this.gridSp);
	            this.dataGroupHandle();
	        }
	    }, {
	        key: "draw",
	        value: function draw(opt) {

	            !opt && (opt = {});

	            _$27.extend(true, this, opt);

	            this.drawGroups();

	            this.drawCenter();

	            this.fire("complete");
	        }
	    }, {
	        key: "show",
	        value: function show(field, legendData) {

	            this.getAgreeNodeData(legendData, function (data) {
	                data.node.context.visible = true;
	                data.textNode.context.visible = true;
	            });
	        }
	    }, {
	        key: "hide",
	        value: function hide(field, legendData) {
	            this.getAgreeNodeData(legendData, function (data) {
	                data.node.context.visible = false;
	                data.textNode.context.visible = false;
	            });
	        }
	    }, {
	        key: "getAgreeNodeData",
	        value: function getAgreeNodeData(legendData, callback) {
	            _$27.each(this._ringGroups, function (_g) {
	                _$27.each(_g._rings, function (ring, i) {
	                    _$27.each(ring.planets, function (data, ii) {
	                        var rowData = data.rowData;
	                        if (legendData.name == rowData[legendData.field]) {
	                            //这个数据符合
	                            //data.node.context.visible = false;
	                            //data.textNode.context.visible = false;
	                            callback && callback(data);
	                        }                    });
	                });
	            });
	        }
	    }, {
	        key: "getLegendData",
	        value: function getLegendData() {
	            var list = [];
	            var legendDataList = [];
	            if (this.legendField) {

	                _$27.each(this.dataFrame.getFieldData(this.legendField), function (val) {
	                    if (_$27.indexOf(list, val) == -1) {
	                        list.push(val);
	                        legendDataList.push({
	                            name: val,
	                            field: this.legendField,
	                            color: "#ff8533",
	                            enabled: true,
	                            ind: 0
	                        });
	                    }                });
	            }
	            return legendDataList;
	        }
	    }, {
	        key: "_getMaxR",
	        value: function _getMaxR() {
	            var _circleMaxR;
	            try {
	                _circleMaxR = this.graphs.group.circle.maxR;
	            } catch (e) {}
	            if (_circleMaxR == undefined) {
	                _circleMaxR = 30;
	            }            return _circleMaxR;
	        }
	    }, {
	        key: "drawGroups",
	        value: function drawGroups() {
	            var me = this;

	            var groupRStart = this.center.radius + this.center.margin;

	            var maxR = me.root._coord.maxR - me.center.radius - me.center.margin;
	            var _circleMaxR = this._getMaxR();

	            _$27.each(this.groupDataFrames, function (df, i) {

	                var toR = groupRStart + maxR * (df.length / me.dataFrame.length);

	                var _g = new PlanetGroup(_$27.extend(true, {
	                    iGroup: i,
	                    groupLen: me.groupDataFrames.length,
	                    rRange: {
	                        start: groupRStart,
	                        to: toR
	                    },
	                    width: me.width - _circleMaxR * 2,
	                    height: me.height - _circleMaxR * 2
	                }, me._opts), df, me);

	                groupRStart = _g.rRange.to;

	                me._ringGroups.push(_g);

	                me.grid.rings.section.push({
	                    radius: _g.rRange.to
	                });
	            });

	            me.drawBack();

	            _$27.each(me._ringGroups, function (_g) {
	                me.sprite.addChild(_g.sprite);
	            });
	        }
	    }, {
	        key: "drawCenter",
	        value: function drawCenter() {
	            if (this.center.enabled) {
	                //绘制中心实心圆
	                this._center = new Circle$7({
	                    context: {
	                        x: this.origin.x,
	                        y: this.origin.y,
	                        fillStyle: this.center.fillStyle,
	                        r: this.center.radius
	                    }
	                });
	                //绘制实心圆上面的文案
	                this._centerTxt = new Text$3(this.center.text, {
	                    context: {
	                        x: this.origin.x,
	                        y: this.origin.y,
	                        fontSize: this.center.fontSize,
	                        textAlign: "center",
	                        textBaseline: "middle",
	                        fillStyle: this.center.fontColor
	                    }
	                });
	                this.sprite.addChild(this._center);
	                this.sprite.addChild(this._centerTxt);
	            }
	        }
	    }, {
	        key: "drawBack",
	        value: function drawBack() {
	            var me = this;

	            if (me.grid.rings.section.length == 1) {

	                //如果只有一个，那么就强制添加到3个
	                var _diffR = (me.grid.rings.section[0].radius - me.center.radius) / me.grid.rings.count;
	                me.grid.rings.section = [];
	                for (var i = 0; i < me.grid.rings.count; i++) {
	                    me.grid.rings.section.push({
	                        radius: me.center.radius + _diffR * (i + 1)
	                    });
	                }
	            } else {
	                me.grid.rings.count = me.grid.rings.section.length;
	            }
	            for (var i = me.grid.rings.section.length - 1; i >= 0; i--) {
	                var _scale = me.grid.rings.section[i];
	                me.gridSp.addChild(new Circle$7({
	                    context: {
	                        x: me.root._coord.origin.x,
	                        y: me.root._coord.origin.y,
	                        r: _scale.radius,
	                        lineWidth: me._getBackProp(me.grid.rings.lineWidth, i),
	                        strokeStyle: me._getBackProp(me.grid.rings.strokeStyle, i),
	                        fillStyle: me._getBackProp(me.grid.rings.fillStyle, i)
	                    }
	                }));
	            }
	            //如果back.rays.count非0， 则绘制从圆心出发的射线
	            if (me.grid.rays.count > 1) {
	                var cx = this.root._coord.origin.x;
	                var cy = this.root._coord.origin.y;
	                var itemAng = 360 / me.grid.rays.count;
	                var _r = me.root._coord.maxR; //Math.max( me.w, me.h );

	                if (me.grid.rings.section.length) {
	                    _r = me.grid.rings.section.slice(-1)[0].radius;
	                }

	                for (var i = 0, l = me.grid.rays.count; i < l; i++) {
	                    var radian = itemAng * i / 180 * Math.PI;
	                    var tx = cx + _r * Math.cos(radian);
	                    var ty = cy + _r * Math.sin(radian);

	                    me.gridSp.addChild(new Line$6({
	                        context: {
	                            start: {
	                                x: cx,
	                                y: cy
	                            },
	                            end: {
	                                x: tx,
	                                y: ty
	                            },
	                            lineWidth: me._getBackProp(me.grid.rays.lineWidth, i),
	                            strokeStyle: me._getBackProp(me.grid.rays.strokeStyle, i),
	                            globalAlpha: me.grid.rays.globalAlpha
	                        }
	                    }));
	                }            }
	            var _clipRect = new Rect$9({
	                name: "clipRect",
	                context: {
	                    x: me.root._coord.origin.x - me.root.width / 2,
	                    y: me.root._coord.origin.y - me.height / 2,
	                    width: me.root.width,
	                    height: me.height
	                }
	            });
	            me.gridSp.clipTo(_clipRect);
	            me.sprite.addChild(_clipRect);
	        }
	    }, {
	        key: "_getBackProp",
	        value: function _getBackProp(p, i) {
	            var res = null;
	            if (_$27.isFunction(p)) {
	                res = p.apply(this, [{
	                    //iGroup : iGroup,
	                    scaleInd: i,
	                    count: this.grid.rings.section.length,

	                    groups: this._ringGroups,
	                    graphs: this
	                }]);
	            }            if (_$27.isString(p) || _$27.isNumber(p)) {
	                res = p;
	            }            if (_$27.isArray(p)) {
	                res = p[i];
	            }            return res;
	        }
	    }, {
	        key: "dataGroupHandle",
	        value: function dataGroupHandle() {
	            var groupFieldInd = _$27.indexOf(this.dataFrame.fields, this.groupField);
	            if (groupFieldInd >= 0) {
	                //有分组字段，就还要对dataFrame中的数据分下组，然后给到 groupDataFrames
	                var titles = this.dataFrame.org[0];
	                var _dmap = {}; //以分组的字段值做为key

	                _$27.each(this.dataFrame.org, function (row, i) {
	                    if (i) {
	                        //从i==1 行开始，因为第一行是titles
	                        if (!_dmap[row[groupFieldInd]]) {
	                            //如果没有记录，先创建
	                            _dmap[row[groupFieldInd]] = [_$27.clone(titles)];
	                        }                        _dmap[row[groupFieldInd]].push(row);
	                    }
	                });

	                for (var r in _dmap) {
	                    this.groupDataFrames.push(DataFrame(_dmap[r]));
	                }            } else {
	                //如果分组字段不存在，则认为数据不需要分组，直接全部作为 group 的一个子集合
	                this.groupDataFrames.push(this.dataFrame);
	            }        }

	        //获取所有有效的在布局中的nodeData

	    }, {
	        key: "getLayoutNodes",
	        value: function getLayoutNodes() {
	            var nodes = [];
	            _$27.each(this._ringGroups, function (rg) {
	                _$27.each(rg.planets, function (node) {
	                    if (node.pit) {
	                        nodes.push(node);
	                    }                });
	            });
	            return nodes;
	        }

	        //获取所有无效的在不在布局的nodeData

	    }, {
	        key: "getInvalidNodes",
	        value: function getInvalidNodes() {
	            var nodes = [];
	            _$27.each(this._ringGroups, function (rg) {
	                _$27.each(rg.planets, function (node) {
	                    if (!node.pit) {
	                        nodes.push(node);
	                    }                });
	            });
	            return nodes;
	        }
	    }]);
	    return PlanetGraphs;
	}(GraphsBase);

	var _$28 = canvax._;
	var Text$4 = canvax.Display.Text;
	var Polygon$4 = canvax.Shapes.Polygon;

	var FunnelGraphs = function (_GraphsBase) {
	    inherits$1(FunnelGraphs, _GraphsBase);

	    function FunnelGraphs(opt, root) {
	        classCallCheck$1(this, FunnelGraphs);

	        var _this = possibleConstructorReturn$1(this, (FunnelGraphs.__proto__ || Object.getPrototypeOf(FunnelGraphs)).call(this, opt, root));

	        _this.type = "funnel";

	        _this.field = null;
	        _this.dataOrg = []; //this.dataFrame.getFieldData( this.field )
	        _this.data = []; //layoutData list , default is empty Array
	        _this.sort = null;

	        _this.invert = false; //默认为倒立的金字塔结构

	        _this._maxVal = null;
	        _this._minVal = null;
	        _this.maxNodeWidth = null;
	        _this.minNodeWidth = 0;
	        _this.minVal = 0; //漏斗的塔尖，默认为0

	        _this.node = {
	            shapeType: "polygon", //节点的现状可以是圆 ，也可以是rect，也可以是三角形，后面两种后面实现
	            height: 0, //漏斗单元高，如果options没有设定， 就会被自动计算为 this.height/dataOrg.length

	            fillStyle: null, //目前主要用皮肤来实现配色，暂时node.fillStyle没用到，但是先定义起来
	            lineWidth: 0,
	            strokeStyle: null,

	            focus: {
	                enabled: true
	            },
	            select: {
	                enabled: true,
	                lineWidth: 2,
	                strokeStyle: "#666"
	            }
	        };

	        _this.label = {
	            enabled: true,
	            align: "center", // left , center, right
	            format: function format(num) {
	                return numAddSymbol(num);
	            },
	            fontColor: "#ffffff",
	            fontSize: 13,
	            textBaseline: "middle"
	        };

	        _$28.extend(true, _this, opt);

	        _this.init();
	        return _this;
	    }

	    createClass$1(FunnelGraphs, [{
	        key: "init",
	        value: function init() {
	            this.sprite = new canvax.Display.Sprite({
	                name: "funnelGraphsEl"
	            });
	        }
	    }, {
	        key: "_computerAttr",
	        value: function _computerAttr() {
	            if (this.field) {
	                this.dataOrg = this.dataFrame.getFieldData(this.field);
	            }            this._maxVal = _$28.max(this.dataOrg);
	            this._minVal = _$28.min(this.dataOrg);

	            //计算一些基础属性，比如maxNodeWidth等， 加入外面没有设置
	            if (!this.maxNodeWidth) {
	                this.maxNodeWidth = this.width * 0.7;
	            }
	            if (!this.node.height) {
	                this.node.height = this.height / this.dataOrg.length;
	            }
	            if (this.sort == "asc") {
	                //倒序的话
	                this.invert = true;
	            }            if (this.sort == "desc") {
	                //倒序的话
	                this.invert = false;
	            }        }
	    }, {
	        key: "draw",
	        value: function draw(opt) {
	            !opt && (opt = {});

	            //第二个data参数去掉，直接trimgraphs获取最新的data
	            _$28.extend(true, this, opt);

	            var me = this;

	            var animate = me.animation && !opt.resize;

	            this._computerAttr();

	            this.data = this._trimGraphs();

	            this._drawGraphs();

	            this.sprite.context.x = this.origin.x + this.width / 2;
	            this.sprite.context.y = this.origin.y;
	        }
	    }, {
	        key: "_trimGraphs",
	        value: function _trimGraphs() {
	            if (!this.field) return;

	            var me = this;
	            //var dataOrg = _.clone( this.dataOrg );

	            var layoutData = [];

	            _$28.each(this.dataOrg, function (num, i) {

	                var ld = {
	                    type: "funnel",
	                    field: me.field,
	                    rowData: me.dataFrame.getRowData(i),
	                    value: num,
	                    width: me._getNodeWidth(num),
	                    color: me.root.getTheme(i), //默认从皮肤中获取
	                    cursor: "pointer",

	                    //下面得都在layoutData的循环中计算
	                    label: '',
	                    middlePoint: null,
	                    iNode: -1,
	                    points: []
	                };
	                layoutData.push(ld);
	            });

	            if (this.sort) {
	                layoutData = layoutData.sort(function (a, b) {
	                    if (me.sort == "desc") {
	                        return b.value - a.value;
	                    } else {
	                        return a.value - b.value;
	                    }
	                });
	            }
	            _$28.each(layoutData, function (ld, i) {
	                ld.iNode = i;
	                ld.label = me.label.format(ld.value, ld);
	            });
	            _$28.each(layoutData, function (ld, i) {
	                ld.points = me._getPoints(ld, layoutData[i + 1], layoutData[i - 1]);
	                ld.middlePoint = {
	                    x: 0,
	                    y: (ld.iNode + 0.5) * me.node.height
	                };
	            });

	            return layoutData;
	        }
	    }, {
	        key: "_getNodeWidth",
	        value: function _getNodeWidth(num) {
	            var width = this.minNodeWidth + (this.maxNodeWidth - this.minNodeWidth) / (this._maxVal - this.minVal) * (num - this.minVal);
	            return parseInt(width);
	        }
	    }, {
	        key: "_getPoints",
	        value: function _getPoints(layoutData, nextLayoutData, preLayoutData) {
	            var points = [];
	            var topY = layoutData.iNode * this.node.height;
	            var bottomY = topY + this.node.height;

	            if (!this.invert) {
	                points.push([-layoutData.width / 2, topY]); //左上
	                points.push([layoutData.width / 2, topY]); //右上

	                var bottomWidth = this.minNodeWidth;
	                if (nextLayoutData) {
	                    bottomWidth = nextLayoutData.width;
	                }                points.push([bottomWidth / 2, bottomY]); //右下
	                points.push([-bottomWidth / 2, bottomY]); //左下
	            } else {
	                //正金字塔结构的话，是从最上面一个 data 的 top 取min开始
	                var topWidth = this.minNodeWidth;
	                if (preLayoutData) {
	                    topWidth = preLayoutData.width;
	                }                points.push([-topWidth / 2, topY]); //左上
	                points.push([topWidth / 2, topY]); //右上
	                points.push([layoutData.width / 2, bottomY]); //右下
	                points.push([-layoutData.width / 2, bottomY]); //左下
	            }

	            return points;
	        }
	    }, {
	        key: "_drawGraphs",
	        value: function _drawGraphs() {
	            var me = this;
	            _$28.each(this.data, function (ld) {
	                var _polygon = new Polygon$4({
	                    context: {
	                        pointList: ld.points,
	                        fillStyle: ld.color,
	                        cursor: ld.cursor
	                    }
	                });
	                me.sprite.addChild(_polygon);
	                _polygon.nodeData = ld;
	                _polygon.on("mousedown mouseup panstart mouseover panmove mousemove panend mouseout tap click dblclick", function (e) {

	                    e.eventInfo = {
	                        title: me.field,
	                        nodes: [this.nodeData]
	                    };

	                    //fire到root上面去的是为了让root去处理tips
	                    me.root.fire(e.type, e);
	                    me.triggerEvent(me.node, e);
	                });

	                var textAlign = "center";
	                var textPoint = {
	                    x: ld.middlePoint.x,
	                    y: ld.middlePoint.y
	                };
	                if (me.label.align == "left") {
	                    textPoint.x = ld.points[0][0] - (ld.points[0][0] - ld.points[3][0]) / 2;
	                    textPoint.x -= 15;
	                    textAlign = "right";
	                }                if (me.label.align == "right") {
	                    textPoint.x = ld.points[1][0] - (ld.points[1][0] - ld.points[2][0]) / 2;
	                    textPoint.x += 15;
	                    textAlign = "left";
	                }
	                var _text = new Text$4(ld.label, {
	                    context: {
	                        x: textPoint.x,
	                        y: textPoint.y,
	                        fontSize: me.label.fontSize,
	                        fillStyle: me.label.align == "center" ? me.label.fontColor : ld.color,
	                        textAlign: textAlign,
	                        textBaseline: me.label.textBaseline
	                    }
	                });

	                me.sprite.addChild(_text);
	            });
	        }
	    }]);
	    return FunnelGraphs;
	}(GraphsBase);

	/** finds the zeros of a function, given two starting points (which must
	 * have opposite signs */
	function bisect(f, a, b, parameters) {
	    parameters = parameters || {};
	    var maxIterations = parameters.maxIterations || 100,
	        tolerance = parameters.tolerance || 1e-10,
	        fA = f(a),
	        fB = f(b),
	        delta = b - a;

	    if (fA * fB > 0) {
	        throw "Initial bisect points must have opposite signs";
	    }

	    if (fA === 0) return a;
	    if (fB === 0) return b;

	    for (var i = 0; i < maxIterations; ++i) {
	        delta /= 2;
	        var mid = a + delta,
	            fMid = f(mid);

	        if (fMid * fA >= 0) {
	            a = mid;
	        }

	        if ((Math.abs(delta) < tolerance) || (fMid === 0)) {
	            return mid;
	        }
	    }
	    return a + delta;
	}

	// need some basic operations on vectors, rather than adding a dependency,
	// just define here
	function zeros(x) { var r = new Array(x); for (var i = 0; i < x; ++i) { r[i] = 0; } return r; }
	function zerosM(x,y) { return zeros(x).map(function() { return zeros(y); }); }

	function dot(a, b) {
	    var ret = 0;
	    for (var i = 0; i < a.length; ++i) {
	        ret += a[i] * b[i];
	    }
	    return ret;
	}

	function norm2(a)  {
	    return Math.sqrt(dot(a, a));
	}

	function scale(ret, value, c) {
	    for (var i = 0; i < value.length; ++i) {
	        ret[i] = value[i] * c;
	    }
	}

	function weightedSum(ret, w1, v1, w2, v2) {
	    for (var j = 0; j < ret.length; ++j) {
	        ret[j] = w1 * v1[j] + w2 * v2[j];
	    }
	}

	/** minimizes a function using the downhill simplex method */
	function nelderMead(f, x0, parameters) {
	    parameters = parameters || {};

	    var maxIterations = parameters.maxIterations || x0.length * 200,
	        nonZeroDelta = parameters.nonZeroDelta || 1.05,
	        zeroDelta = parameters.zeroDelta || 0.001,
	        minErrorDelta = parameters.minErrorDelta || 1e-6,
	        minTolerance = parameters.minErrorDelta || 1e-5,
	        rho = (parameters.rho !== undefined) ? parameters.rho : 1,
	        chi = (parameters.chi !== undefined) ? parameters.chi : 2,
	        psi = (parameters.psi !== undefined) ? parameters.psi : -0.5,
	        sigma = (parameters.sigma !== undefined) ? parameters.sigma : 0.5,
	        maxDiff;

	    // initialize simplex.
	    var N = x0.length,
	        simplex = new Array(N + 1);
	    simplex[0] = x0;
	    simplex[0].fx = f(x0);
	    simplex[0].id = 0;
	    for (var i = 0; i < N; ++i) {
	        var point = x0.slice();
	        point[i] = point[i] ? point[i] * nonZeroDelta : zeroDelta;
	        simplex[i+1] = point;
	        simplex[i+1].fx = f(point);
	        simplex[i+1].id = i+1;
	    }

	    function updateSimplex(value) {
	        for (var i = 0; i < value.length; i++) {
	            simplex[N][i] = value[i];
	        }
	        simplex[N].fx = value.fx;
	    }

	    var sortOrder = function(a, b) { return a.fx - b.fx; };

	    var centroid = x0.slice(),
	        reflected = x0.slice(),
	        contracted = x0.slice(),
	        expanded = x0.slice();

	    for (var iteration = 0; iteration < maxIterations; ++iteration) {
	        simplex.sort(sortOrder);

	        if (parameters.history) {
	            // copy the simplex (since later iterations will mutate) and
	            // sort it to have a consistent order between iterations
	            var sortedSimplex = simplex.map(function (x) {
	                var state = x.slice();
	                state.fx = x.fx;
	                state.id = x.id;
	                return state;
	            });
	            sortedSimplex.sort(function(a,b) { return a.id - b.id; });

	            parameters.history.push({x: simplex[0].slice(),
	                                     fx: simplex[0].fx,
	                                     simplex: sortedSimplex});
	        }

	        maxDiff = 0;
	        for (i = 0; i < N; ++i) {
	            maxDiff = Math.max(maxDiff, Math.abs(simplex[0][i] - simplex[1][i]));
	        }

	        if ((Math.abs(simplex[0].fx - simplex[N].fx) < minErrorDelta) &&
	            (maxDiff < minTolerance)) {
	            break;
	        }

	        // compute the centroid of all but the worst point in the simplex
	        for (i = 0; i < N; ++i) {
	            centroid[i] = 0;
	            for (var j = 0; j < N; ++j) {
	                centroid[i] += simplex[j][i];
	            }
	            centroid[i] /= N;
	        }

	        // reflect the worst point past the centroid  and compute loss at reflected
	        // point
	        var worst = simplex[N];
	        weightedSum(reflected, 1+rho, centroid, -rho, worst);
	        reflected.fx = f(reflected);

	        // if the reflected point is the best seen, then possibly expand
	        if (reflected.fx < simplex[0].fx) {
	            weightedSum(expanded, 1+chi, centroid, -chi, worst);
	            expanded.fx = f(expanded);
	            if (expanded.fx < reflected.fx) {
	                updateSimplex(expanded);
	            }  else {
	                updateSimplex(reflected);
	            }
	        }

	        // if the reflected point is worse than the second worst, we need to
	        // contract
	        else if (reflected.fx >= simplex[N-1].fx) {
	            var shouldReduce = false;

	            if (reflected.fx > worst.fx) {
	                // do an inside contraction
	                weightedSum(contracted, 1+psi, centroid, -psi, worst);
	                contracted.fx = f(contracted);
	                if (contracted.fx < worst.fx) {
	                    updateSimplex(contracted);
	                } else {
	                    shouldReduce = true;
	                }
	            } else {
	                // do an outside contraction
	                weightedSum(contracted, 1-psi * rho, centroid, psi*rho, worst);
	                contracted.fx = f(contracted);
	                if (contracted.fx < reflected.fx) {
	                    updateSimplex(contracted);
	                } else {
	                    shouldReduce = true;
	                }
	            }

	            if (shouldReduce) {
	                // if we don't contract here, we're done
	                if (sigma >= 1) break;

	                // do a reduction
	                for (i = 1; i < simplex.length; ++i) {
	                    weightedSum(simplex[i], 1 - sigma, simplex[0], sigma, simplex[i]);
	                    simplex[i].fx = f(simplex[i]);
	                }
	            }
	        } else {
	            updateSimplex(reflected);
	        }
	    }

	    simplex.sort(sortOrder);
	    return {fx : simplex[0].fx,
	            x : simplex[0]};
	}

	/// searches along line 'pk' for a point that satifies the wolfe conditions
	/// See 'Numerical Optimization' by Nocedal and Wright p59-60
	/// f : objective function
	/// pk : search direction
	/// current: object containing current gradient/loss
	/// next: output: contains next gradient/loss
	/// returns a: step size taken
	function wolfeLineSearch(f, pk, current, next, a, c1, c2) {
	    var phi0 = current.fx, phiPrime0 = dot(current.fxprime, pk),
	        phi = phi0, phi_old = phi0,
	        phiPrime = phiPrime0,
	        a0 = 0;

	    a = a || 1;
	    c1 = c1 || 1e-6;
	    c2 = c2 || 0.1;

	    function zoom(a_lo, a_high, phi_lo) {
	        for (var iteration = 0; iteration < 16; ++iteration) {
	            a = (a_lo + a_high)/2;
	            weightedSum(next.x, 1.0, current.x, a, pk);
	            phi = next.fx = f(next.x, next.fxprime);
	            phiPrime = dot(next.fxprime, pk);

	            if ((phi > (phi0 + c1 * a * phiPrime0)) ||
	                (phi >= phi_lo)) {
	                a_high = a;

	            } else  {
	                if (Math.abs(phiPrime) <= -c2 * phiPrime0) {
	                    return a;
	                }

	                if (phiPrime * (a_high - a_lo) >=0) {
	                    a_high = a_lo;
	                }

	                a_lo = a;
	                phi_lo = phi;
	            }
	        }

	        return 0;
	    }

	    for (var iteration = 0; iteration < 10; ++iteration) {
	        weightedSum(next.x, 1.0, current.x, a, pk);
	        phi = next.fx = f(next.x, next.fxprime);
	        phiPrime = dot(next.fxprime, pk);
	        if ((phi > (phi0 + c1 * a * phiPrime0)) ||
	            (iteration && (phi >= phi_old))) {
	            return zoom(a0, a, phi_old);
	        }

	        if (Math.abs(phiPrime) <= -c2 * phiPrime0) {
	            return a;
	        }

	        if (phiPrime >= 0 ) {
	            return zoom(a, a0, phi);
	        }

	        phi_old = phi;
	        a0 = a;
	        a *= 2;
	    }

	    return a;
	}

	function conjugateGradient(f, initial, params) {
	    // allocate all memory up front here, keep out of the loop for perfomance
	    // reasons
	    var current = {x: initial.slice(), fx: 0, fxprime: initial.slice()},
	        next = {x: initial.slice(), fx: 0, fxprime: initial.slice()},
	        yk = initial.slice(),
	        pk, temp,
	        a = 1,
	        maxIterations;

	    params = params || {};
	    maxIterations = params.maxIterations || initial.length * 20;

	    current.fx = f(current.x, current.fxprime);
	    pk = current.fxprime.slice();
	    scale(pk, current.fxprime,-1);

	    for (var i = 0; i < maxIterations; ++i) {
	        a = wolfeLineSearch(f, pk, current, next, a);

	        // todo: history in wrong spot?
	        if (params.history) {
	            params.history.push({x: current.x.slice(),
	                                 fx: current.fx,
	                                 fxprime: current.fxprime.slice(),
	                                 alpha: a});
	        }

	        if (!a) {
	            // faiiled to find point that satifies wolfe conditions.
	            // reset direction for next iteration
	            scale(pk, current.fxprime, -1);

	        } else {
	            // update direction using Polak–Ribiere CG method
	            weightedSum(yk, 1, next.fxprime, -1, current.fxprime);

	            var delta_k = dot(current.fxprime, current.fxprime),
	                beta_k = Math.max(0, dot(yk, next.fxprime) / delta_k);

	            weightedSum(pk, beta_k, pk, -1, next.fxprime);

	            temp = current;
	            current = next;
	            next = temp;
	        }

	        if (norm2(current.fxprime) <= 1e-5) {
	            break;
	        }
	    }

	    if (params.history) {
	        params.history.push({x: current.x.slice(),
	                             fx: current.fx,
	                             fxprime: current.fxprime.slice(),
	                             alpha: a});
	    }

	    return current;
	}

	var SMALL = 1e-10;

	/** Returns the intersection area of a bunch of circles (where each circle
	 is an object having an x,y and radius property) */
	function intersectionArea(circles, stats) {
	    // get all the intersection points of the circles
	    var intersectionPoints = getIntersectionPoints(circles);

	    // filter out points that aren't included in all the circles
	    var innerPoints = intersectionPoints.filter(function (p) {
	        return containedInCircles(p, circles);
	    });

	    var arcArea = 0,
	        polygonArea = 0,
	        arcs = [],
	        i;

	    // if we have intersection points that are within all the circles,
	    // then figure out the area contained by them
	    if (innerPoints.length > 1) {
	        // sort the points by angle from the center of the polygon, which lets
	        // us just iterate over points to get the edges
	        var center = getCenter(innerPoints);
	        for (i = 0; i < innerPoints.length; ++i) {
	            var p = innerPoints[i];
	            p.angle = Math.atan2(p.x - center.x, p.y - center.y);
	        }
	        innerPoints.sort(function (a, b) {
	            return b.angle - a.angle;
	        });

	        // iterate over all points, get arc between the points
	        // and update the areas
	        var p2 = innerPoints[innerPoints.length - 1];
	        for (i = 0; i < innerPoints.length; ++i) {
	            var p1 = innerPoints[i];

	            // polygon area updates easily ...
	            polygonArea += (p2.x + p1.x) * (p1.y - p2.y);

	            // updating the arc area is a little more involved
	            var midPoint = { x: (p1.x + p2.x) / 2,
	                y: (p1.y + p2.y) / 2 },
	                arc = null;

	            for (var j = 0; j < p1.parentIndex.length; ++j) {
	                if (p2.parentIndex.indexOf(p1.parentIndex[j]) > -1) {
	                    // figure out the angle halfway between the two points
	                    // on the current circle
	                    var circle = circles[p1.parentIndex[j]],
	                        a1 = Math.atan2(p1.x - circle.x, p1.y - circle.y),
	                        a2 = Math.atan2(p2.x - circle.x, p2.y - circle.y);

	                    var angleDiff = a2 - a1;
	                    if (angleDiff < 0) {
	                        angleDiff += 2 * Math.PI;
	                    }

	                    // and use that angle to figure out the width of the
	                    // arc
	                    var a = a2 - angleDiff / 2,
	                        width = distance(midPoint, {
	                        x: circle.x + circle.radius * Math.sin(a),
	                        y: circle.y + circle.radius * Math.cos(a)
	                    });

	                    // clamp the width to the largest is can actually be
	                    // (sometimes slightly overflows because of FP errors)
	                    if (width > circle.radius * 2) {
	                        width = circle.radius * 2;
	                    }

	                    // pick the circle whose arc has the smallest width
	                    if (arc === null || arc.width > width) {
	                        arc = { circle: circle,
	                            width: width,
	                            p1: p1,
	                            p2: p2 };
	                    }
	                }
	            }

	            if (arc !== null) {
	                arcs.push(arc);
	                arcArea += circleArea(arc.circle.radius, arc.width);
	                p2 = p1;
	            }
	        }
	    } else {
	        // no intersection points, is either disjoint - or is completely
	        // overlapped. figure out which by examining the smallest circle
	        var smallest = circles[0];
	        for (i = 1; i < circles.length; ++i) {
	            if (circles[i].radius < smallest.radius) {
	                smallest = circles[i];
	            }
	        }

	        // make sure the smallest circle is completely contained in all
	        // the other circles
	        var disjoint = false;
	        for (i = 0; i < circles.length; ++i) {
	            if (distance(circles[i], smallest) > Math.abs(smallest.radius - circles[i].radius)) {
	                disjoint = true;
	                break;
	            }
	        }

	        if (disjoint) {
	            arcArea = polygonArea = 0;
	        } else {
	            arcArea = smallest.radius * smallest.radius * Math.PI;
	            arcs.push({ circle: smallest,
	                p1: { x: smallest.x, y: smallest.y + smallest.radius },
	                p2: { x: smallest.x - SMALL, y: smallest.y + smallest.radius },
	                width: smallest.radius * 2 });
	        }
	    }

	    polygonArea /= 2;
	    if (stats) {
	        stats.area = arcArea + polygonArea;
	        stats.arcArea = arcArea;
	        stats.polygonArea = polygonArea;
	        stats.arcs = arcs;
	        stats.innerPoints = innerPoints;
	        stats.intersectionPoints = intersectionPoints;
	    }

	    return arcArea + polygonArea;
	}

	/** returns whether a point is contained by all of a list of circles */
	function containedInCircles(point, circles) {
	    for (var i = 0; i < circles.length; ++i) {
	        if (distance(point, circles[i]) > circles[i].radius + SMALL) {
	            return false;
	        }
	    }
	    return true;
	}

	/** Gets all intersection points between a bunch of circles */
	function getIntersectionPoints(circles) {
	    var ret = [];
	    for (var i = 0; i < circles.length; ++i) {
	        for (var j = i + 1; j < circles.length; ++j) {
	            var intersect = circleCircleIntersection(circles[i], circles[j]);
	            for (var k = 0; k < intersect.length; ++k) {
	                var p = intersect[k];
	                p.parentIndex = [i, j];
	                ret.push(p);
	            }
	        }
	    }
	    return ret;
	}

	/** Circular segment area calculation. See http://mathworld.wolfram.com/CircularSegment.html */
	function circleArea(r, width) {
	    return r * r * Math.acos(1 - width / r) - (r - width) * Math.sqrt(width * (2 * r - width));
	}

	/** euclidean distance between two points */
	function distance(p1, p2) {
	    return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
	}

	/** Returns the overlap area of two circles of radius r1 and r2 - that
	have their centers separated by distance d. Simpler faster
	circle intersection for only two circles */
	function circleOverlap(r1, r2, d) {
	    // no overlap
	    if (d >= r1 + r2) {
	        return 0;
	    }

	    // completely overlapped
	    if (d <= Math.abs(r1 - r2)) {
	        return Math.PI * Math.min(r1, r2) * Math.min(r1, r2);
	    }

	    var w1 = r1 - (d * d - r2 * r2 + r1 * r1) / (2 * d),
	        w2 = r2 - (d * d - r1 * r1 + r2 * r2) / (2 * d);
	    return circleArea(r1, w1) + circleArea(r2, w2);
	}

	/** Given two circles (containing a x/y/radius attributes),
	returns the intersecting points if possible.
	note: doesn't handle cases where there are infinitely many
	intersection points (circles are equivalent):, or only one intersection point*/
	function circleCircleIntersection(p1, p2) {
	    var d = distance(p1, p2),
	        r1 = p1.radius,
	        r2 = p2.radius;

	    // if to far away, or self contained - can't be done
	    if (d >= r1 + r2 || d <= Math.abs(r1 - r2)) {
	        return [];
	    }

	    var a = (r1 * r1 - r2 * r2 + d * d) / (2 * d),
	        h = Math.sqrt(r1 * r1 - a * a),
	        x0 = p1.x + a * (p2.x - p1.x) / d,
	        y0 = p1.y + a * (p2.y - p1.y) / d,
	        rx = -(p2.y - p1.y) * (h / d),
	        ry = -(p2.x - p1.x) * (h / d);

	    return [{ x: x0 + rx, y: y0 - ry }, { x: x0 - rx, y: y0 + ry }];
	}

	/** Returns the center of a bunch of points */
	function getCenter(points) {
	    var center = { x: 0, y: 0 };
	    for (var i = 0; i < points.length; ++i) {
	        center.x += points[i].x;
	        center.y += points[i].y;
	    }
	    center.x /= points.length;
	    center.y /= points.length;
	    return center;
	}

	//算法来源 https://www.benfrederickson.com/venn-diagrams-with-d3.js/

	/** given a list of set objects, and their corresponding overlaps.
	updates the (x, y, radius) attribute on each set such that their positions
	roughly correspond to the desired overlaps */
	function venn(areas, parameters) {
	    parameters = parameters || {};
	    parameters.maxIterations = parameters.maxIterations || 500;
	    var initialLayout = parameters.initialLayout || bestInitialLayout;
	    var loss = parameters.lossFunction || lossFunction;

	    // add in missing pairwise areas as having 0 size
	    areas = addMissingAreas(areas);

	    // initial layout is done greedily
	    var circles = initialLayout(areas, parameters);

	    // transform x/y coordinates to a vector to optimize
	    var initial = [],
	        setids = [],
	        setid;
	    for (setid in circles) {
	        if (circles.hasOwnProperty(setid)) {
	            initial.push(circles[setid].x);
	            initial.push(circles[setid].y);
	            setids.push(setid);
	        }
	    }
	    var solution = nelderMead(function (values) {
	        var current = {};
	        for (var i = 0; i < setids.length; ++i) {
	            var setid = setids[i];
	            current[setid] = { x: values[2 * i],
	                y: values[2 * i + 1],
	                radius: circles[setid].radius
	                // size : circles[setid].size
	            };
	        }
	        return loss(current, areas);
	    }, initial, parameters);

	    // transform solution vector back to x/y points
	    var positions = solution.x;
	    for (var i = 0; i < setids.length; ++i) {
	        setid = setids[i];
	        circles[setid].x = positions[2 * i];
	        circles[setid].y = positions[2 * i + 1];
	    }

	    return circles;
	}

	var SMALL$1 = 1e-10;

	/** Returns the distance necessary for two circles of radius r1 + r2 to
	have the overlap area 'overlap' */
	function distanceFromIntersectArea(r1, r2, overlap) {
	    // handle complete overlapped circles
	    if (Math.min(r1, r2) * Math.min(r1, r2) * Math.PI <= overlap + SMALL$1) {
	        return Math.abs(r1 - r2);
	    }

	    return bisect(function (distance$$1) {
	        return circleOverlap(r1, r2, distance$$1) - overlap;
	    }, 0, r1 + r2);
	}

	/** Missing pair-wise intersection area data can cause problems:
	 treating as an unknown means that sets will be laid out overlapping,
	 which isn't what people expect. To reflect that we want disjoint sets
	 here, set the overlap to 0 for all missing pairwise set intersections */
	function addMissingAreas(areas) {
	    areas = areas.slice();

	    // two circle intersections that aren't defined
	    var ids = [],
	        pairs = {},
	        i,
	        j,
	        a,
	        b;
	    for (i = 0; i < areas.length; ++i) {
	        var area = areas[i];
	        if (area.sets.length == 1) {
	            ids.push(area.sets[0]);
	        } else if (area.sets.length == 2) {
	            a = area.sets[0];
	            b = area.sets[1];
	            pairs[[a, b]] = true;
	            pairs[[b, a]] = true;
	        }
	    }
	    ids.sort(function (a, b) {
	        return a > b;
	    });

	    for (i = 0; i < ids.length; ++i) {
	        a = ids[i];
	        for (j = i + 1; j < ids.length; ++j) {
	            b = ids[j];
	            if (!([a, b] in pairs)) {
	                areas.push({ 'sets': [a, b],
	                    'size': 0 });
	            }
	        }
	    }
	    return areas;
	}

	/// Returns two matrices, one of the euclidean distances between the sets
	/// and the other indicating if there are subset or disjoint set relationships
	function getDistanceMatrices(areas, sets, setids) {
	    // initialize an empty distance matrix between all the points
	    var distances = zerosM(sets.length, sets.length),
	        constraints = zerosM(sets.length, sets.length);

	    // compute required distances between all the sets such that
	    // the areas match
	    areas.filter(function (x) {
	        return x.sets.length == 2;
	    }).map(function (current) {
	        var left = setids[current.sets[0]],
	            right = setids[current.sets[1]],
	            r1 = Math.sqrt(sets[left].size / Math.PI),
	            r2 = Math.sqrt(sets[right].size / Math.PI),
	            distance$$1 = distanceFromIntersectArea(r1, r2, current.size);

	        distances[left][right] = distances[right][left] = distance$$1;

	        // also update constraints to indicate if its a subset or disjoint
	        // relationship
	        var c = 0;
	        if (current.size + 1e-10 >= Math.min(sets[left].size, sets[right].size)) {
	            c = 1;
	        } else if (current.size <= 1e-10) {
	            c = -1;
	        }
	        constraints[left][right] = constraints[right][left] = c;
	    });

	    return { distances: distances, constraints: constraints };
	}

	/// computes the gradient and loss simulatenously for our constrained MDS optimizer
	function constrainedMDSGradient(x, fxprime, distances, constraints) {
	    var loss = 0,
	        i;
	    for (i = 0; i < fxprime.length; ++i) {
	        fxprime[i] = 0;
	    }

	    for (i = 0; i < distances.length; ++i) {
	        var xi = x[2 * i],
	            yi = x[2 * i + 1];
	        for (var j = i + 1; j < distances.length; ++j) {
	            var xj = x[2 * j],
	                yj = x[2 * j + 1],
	                dij = distances[i][j],
	                constraint = constraints[i][j];

	            var squaredDistance = (xj - xi) * (xj - xi) + (yj - yi) * (yj - yi),
	                distance$$1 = Math.sqrt(squaredDistance),
	                delta = squaredDistance - dij * dij;

	            if (constraint > 0 && distance$$1 <= dij || constraint < 0 && distance$$1 >= dij) {
	                continue;
	            }

	            loss += 2 * delta * delta;

	            fxprime[2 * i] += 4 * delta * (xi - xj);
	            fxprime[2 * i + 1] += 4 * delta * (yi - yj);

	            fxprime[2 * j] += 4 * delta * (xj - xi);
	            fxprime[2 * j + 1] += 4 * delta * (yj - yi);
	        }
	    }
	    return loss;
	}

	/// takes the best working variant of either constrained MDS or greedy
	function bestInitialLayout(areas, params) {
	    var initial = greedyLayout(areas, params);
	    var loss = params.lossFunction || lossFunction;

	    // greedylayout is sufficient for all 2/3 circle cases. try out
	    // constrained MDS for higher order problems, take its output
	    // if it outperforms. (greedy is aesthetically better on 2/3 circles
	    // since it axis aligns)
	    if (areas.length >= 8) {
	        var constrained = constrainedMDSLayout(areas, params),
	            constrainedLoss = loss(constrained, areas),
	            greedyLoss = loss(initial, areas);

	        if (constrainedLoss + 1e-8 < greedyLoss) {
	            initial = constrained;
	        }
	    }
	    return initial;
	}

	/// use the constrained MDS variant to generate an initial layout
	function constrainedMDSLayout(areas, params) {
	    params = params || {};
	    var restarts = params.restarts || 10;

	    // bidirectionally map sets to a rowid  (so we can create a matrix)
	    var sets = [],
	        setids = {},
	        i;
	    for (i = 0; i < areas.length; ++i) {
	        var area = areas[i];
	        if (area.sets.length == 1) {
	            setids[area.sets[0]] = sets.length;
	            sets.push(area);
	        }
	    }

	    var matrices = getDistanceMatrices(areas, sets, setids),
	        distances = matrices.distances,
	        constraints = matrices.constraints;

	    // keep distances bounded, things get messed up otherwise.
	    // TODO: proper preconditioner?
	    var norm = norm2(distances.map(norm2)) / distances.length;
	    distances = distances.map(function (row) {
	        return row.map(function (value) {
	            return value / norm;
	        });
	    });

	    var obj = function obj(x, fxprime) {
	        return constrainedMDSGradient(x, fxprime, distances, constraints);
	    };

	    var best, current;
	    for (i = 0; i < restarts; ++i) {
	        var initial = zeros(distances.length * 2).map(Math.random);

	        current = conjugateGradient(obj, initial, params);
	        if (!best || current.fx < best.fx) {
	            best = current;
	        }
	    }
	    var positions = best.x;

	    // translate rows back to (x,y,radius) coordinates
	    var circles = {};
	    for (i = 0; i < sets.length; ++i) {
	        var set = sets[i];
	        circles[set.sets[0]] = {
	            x: positions[2 * i] * norm,
	            y: positions[2 * i + 1] * norm,
	            radius: Math.sqrt(set.size / Math.PI)
	        };
	    }

	    if (params.history) {
	        for (i = 0; i < params.history.length; ++i) {
	            scale(params.history[i].x, norm);
	        }
	    }
	    return circles;
	}

	/** Lays out a Venn diagram greedily, going from most overlapped sets to
	least overlapped, attempting to position each new set such that the
	overlapping areas to already positioned sets are basically right */
	function greedyLayout(areas, params) {
	    var loss = params && params.lossFunction ? params.lossFunction : lossFunction;
	    // define a circle for each set
	    var circles = {},
	        setOverlaps = {},
	        set;
	    for (var i = 0; i < areas.length; ++i) {
	        var area = areas[i];
	        if (area.sets.length == 1) {
	            set = area.sets[0];
	            circles[set] = { x: 1e10, y: 1e10,
	                rowid: circles.length,
	                size: area.size,
	                radius: Math.sqrt(area.size / Math.PI) };
	            setOverlaps[set] = [];
	        }
	    }
	    areas = areas.filter(function (a) {
	        return a.sets.length == 2;
	    });

	    // map each set to a list of all the other sets that overlap it
	    for (i = 0; i < areas.length; ++i) {
	        var current = areas[i];
	        var weight = current.hasOwnProperty('weight') ? current.weight : 1.0;
	        var left = current.sets[0],
	            right = current.sets[1];

	        // completely overlapped circles shouldn't be positioned early here
	        if (current.size + SMALL$1 >= Math.min(circles[left].size, circles[right].size)) {
	            weight = 0;
	        }

	        setOverlaps[left].push({ set: right, size: current.size, weight: weight });
	        setOverlaps[right].push({ set: left, size: current.size, weight: weight });
	    }

	    // get list of most overlapped sets
	    var mostOverlapped = [];
	    for (set in setOverlaps) {
	        if (setOverlaps.hasOwnProperty(set)) {
	            var size = 0;
	            for (i = 0; i < setOverlaps[set].length; ++i) {
	                size += setOverlaps[set][i].size * setOverlaps[set][i].weight;
	            }

	            mostOverlapped.push({ set: set, size: size });
	        }
	    }

	    // sort by size desc
	    function sortOrder(a, b) {
	        return b.size - a.size;
	    }
	    mostOverlapped.sort(sortOrder);

	    // keep track of what sets have been laid out
	    var positioned = {};
	    function isPositioned(element) {
	        return element.set in positioned;
	    }

	    // adds a point to the output
	    function positionSet(point, index) {
	        circles[index].x = point.x;
	        circles[index].y = point.y;
	        positioned[index] = true;
	    }

	    // add most overlapped set at (0,0)
	    positionSet({ x: 0, y: 0 }, mostOverlapped[0].set);

	    // get distances between all points. TODO, necessary?
	    // answer: probably not
	    // var distances = venn.getDistanceMatrices(circles, areas).distances;
	    for (i = 1; i < mostOverlapped.length; ++i) {
	        var setIndex = mostOverlapped[i].set,
	            overlap = setOverlaps[setIndex].filter(isPositioned);
	        set = circles[setIndex];
	        overlap.sort(sortOrder);

	        if (overlap.length === 0) {
	            // this shouldn't happen anymore with addMissingAreas
	            throw "ERROR: missing pairwise overlap information";
	        }

	        var points = [];
	        for (var j = 0; j < overlap.length; ++j) {
	            // get appropriate distance from most overlapped already added set
	            var p1 = circles[overlap[j].set],
	                d1 = distanceFromIntersectArea(set.radius, p1.radius, overlap[j].size);

	            // sample positions at 90 degrees for maximum aesthetics
	            points.push({ x: p1.x + d1, y: p1.y });
	            points.push({ x: p1.x - d1, y: p1.y });
	            points.push({ y: p1.y + d1, x: p1.x });
	            points.push({ y: p1.y - d1, x: p1.x });

	            // if we have at least 2 overlaps, then figure out where the
	            // set should be positioned analytically and try those too
	            for (var k = j + 1; k < overlap.length; ++k) {
	                var p2 = circles[overlap[k].set],
	                    d2 = distanceFromIntersectArea(set.radius, p2.radius, overlap[k].size);

	                var extraPoints = circleCircleIntersection({ x: p1.x, y: p1.y, radius: d1 }, { x: p2.x, y: p2.y, radius: d2 });

	                for (var l = 0; l < extraPoints.length; ++l) {
	                    points.push(extraPoints[l]);
	                }
	            }
	        }

	        // we have some candidate positions for the set, examine loss
	        // at each position to figure out where to put it at
	        var bestLoss = 1e50,
	            bestPoint = points[0];
	        for (j = 0; j < points.length; ++j) {
	            circles[setIndex].x = points[j].x;
	            circles[setIndex].y = points[j].y;
	            var localLoss = loss(circles, areas);
	            if (localLoss < bestLoss) {
	                bestLoss = localLoss;
	                bestPoint = points[j];
	            }
	        }

	        positionSet(bestPoint, setIndex);
	    }

	    return circles;
	}

	/** Given a bunch of sets, and the desired overlaps between these sets - computes
	the distance from the actual overlaps to the desired overlaps. Note that
	this method ignores overlaps of more than 2 circles */
	function lossFunction(sets, overlaps) {
	    var output = 0;

	    function getCircles(indices) {
	        return indices.map(function (i) {
	            return sets[i];
	        });
	    }

	    for (var i = 0; i < overlaps.length; ++i) {
	        var area = overlaps[i],
	            overlap;
	        if (area.sets.length == 1) {
	            continue;
	        } else if (area.sets.length == 2) {
	            var left = sets[area.sets[0]],
	                right = sets[area.sets[1]];
	            overlap = circleOverlap(left.radius, right.radius, distance(left, right));
	        } else {
	            overlap = intersectionArea(getCircles(area.sets));
	        }

	        var weight = area.hasOwnProperty('weight') ? area.weight : 1.0;
	        output += weight * (overlap - area.size) * (overlap - area.size);
	    }

	    return output;
	}

	// orientates a bunch of circles to point in orientation
	function orientateCircles(circles, orientation, orientationOrder) {
	    if (orientationOrder === null) {
	        circles.sort(function (a, b) {
	            return b.radius - a.radius;
	        });
	    } else {
	        circles.sort(orientationOrder);
	    }

	    var i;
	    // shift circles so largest circle is at (0, 0)
	    if (circles.length > 0) {
	        var largestX = circles[0].x,
	            largestY = circles[0].y;

	        for (i = 0; i < circles.length; ++i) {
	            circles[i].x -= largestX;
	            circles[i].y -= largestY;
	        }
	    }

	    if (circles.length == 2) {
	        // if the second circle is a subset of the first, arrange so that
	        // it is off to one side. hack for https://github.com/benfred/venn.js/issues/120
	        var dist = distance(circles[0], circles[1]);
	        if (dist < Math.abs(circles[1].radius - circles[0].radius)) {
	            circles[1].x = circles[0].x + circles[0].radius - circles[1].radius - 1e-10;
	            circles[1].y = circles[0].y;
	        }
	    }

	    // rotate circles so that second largest is at an angle of 'orientation'
	    // from largest
	    if (circles.length > 1) {
	        var rotation = Math.atan2(circles[1].x, circles[1].y) - orientation,
	            c = Math.cos(rotation),
	            s = Math.sin(rotation),
	            x,
	            y;

	        for (i = 0; i < circles.length; ++i) {
	            x = circles[i].x;
	            y = circles[i].y;
	            circles[i].x = c * x - s * y;
	            circles[i].y = s * x + c * y;
	        }
	    }

	    // mirror solution if third solution is above plane specified by
	    // first two circles
	    if (circles.length > 2) {
	        var angle = Math.atan2(circles[2].x, circles[2].y) - orientation;
	        while (angle < 0) {
	            angle += 2 * Math.PI;
	        }
	        while (angle > 2 * Math.PI) {
	            angle -= 2 * Math.PI;
	        }
	        if (angle > Math.PI) {
	            var slope = circles[1].y / (1e-10 + circles[1].x);
	            for (i = 0; i < circles.length; ++i) {
	                var d = (circles[i].x + slope * circles[i].y) / (1 + slope * slope);
	                circles[i].x = 2 * d - circles[i].x;
	                circles[i].y = 2 * d * slope - circles[i].y;
	            }
	        }
	    }
	}

	function disjointCluster(circles) {
	    // union-find clustering to get disjoint sets
	    circles.map(function (circle) {
	        circle.parent = circle;
	    });

	    // path compression step in union find
	    function find(circle) {
	        if (circle.parent !== circle) {
	            circle.parent = find(circle.parent);
	        }
	        return circle.parent;
	    }

	    function union(x, y) {
	        var xRoot = find(x),
	            yRoot = find(y);
	        xRoot.parent = yRoot;
	    }

	    // get the union of all overlapping sets
	    for (var i = 0; i < circles.length; ++i) {
	        for (var j = i + 1; j < circles.length; ++j) {
	            var maxDistance = circles[i].radius + circles[j].radius;
	            if (distance(circles[i], circles[j]) + 1e-10 < maxDistance) {
	                union(circles[j], circles[i]);
	            }
	        }
	    }

	    // find all the disjoint clusters and group them together
	    var disjointClusters = {},
	        setid;
	    for (i = 0; i < circles.length; ++i) {
	        setid = find(circles[i]).parent.setid;
	        if (!(setid in disjointClusters)) {
	            disjointClusters[setid] = [];
	        }
	        disjointClusters[setid].push(circles[i]);
	    }

	    // cleanup bookkeeping
	    circles.map(function (circle) {
	        delete circle.parent;
	    });

	    // return in more usable form
	    var ret = [];
	    for (setid in disjointClusters) {
	        if (disjointClusters.hasOwnProperty(setid)) {
	            ret.push(disjointClusters[setid]);
	        }
	    }
	    return ret;
	}

	function getBoundingBox(circles) {
	    var minMax = function minMax(d) {
	        var hi = Math.max.apply(null, circles.map(function (c) {
	            return c[d] + c.radius;
	        })),
	            lo = Math.min.apply(null, circles.map(function (c) {
	            return c[d] - c.radius;
	        }));
	        return { max: hi, min: lo };
	    };

	    return { xRange: minMax('x'), yRange: minMax('y') };
	}

	function normalizeSolution(solution, orientation, orientationOrder) {
	    if (orientation === null) {
	        orientation = Math.PI / 2;
	    }

	    // work with a list instead of a dictionary, and take a copy so we
	    // don't mutate input
	    var circles = [],
	        i,
	        setid;
	    for (setid in solution) {
	        if (solution.hasOwnProperty(setid)) {
	            var previous = solution[setid];
	            circles.push({ x: previous.x,
	                y: previous.y,
	                radius: previous.radius,
	                setid: setid });
	        }
	    }

	    // get all the disjoint clusters
	    var clusters = disjointCluster(circles);

	    // orientate all disjoint sets, get sizes
	    for (i = 0; i < clusters.length; ++i) {
	        orientateCircles(clusters[i], orientation, orientationOrder);
	        var bounds = getBoundingBox(clusters[i]);
	        clusters[i].size = (bounds.xRange.max - bounds.xRange.min) * (bounds.yRange.max - bounds.yRange.min);
	        clusters[i].bounds = bounds;
	    }
	    clusters.sort(function (a, b) {
	        return b.size - a.size;
	    });

	    // orientate the largest at 0,0, and get the bounds
	    circles = clusters[0];
	    var returnBounds = circles.bounds;

	    var spacing = (returnBounds.xRange.max - returnBounds.xRange.min) / 50;

	    function addCluster(cluster, right, bottom) {
	        if (!cluster) return;

	        var bounds = cluster.bounds,
	            xOffset,
	            yOffset,
	            centreing;

	        if (right) {
	            xOffset = returnBounds.xRange.max - bounds.xRange.min + spacing;
	        } else {
	            xOffset = returnBounds.xRange.max - bounds.xRange.max;
	            centreing = (bounds.xRange.max - bounds.xRange.min) / 2 - (returnBounds.xRange.max - returnBounds.xRange.min) / 2;
	            if (centreing < 0) xOffset += centreing;
	        }

	        if (bottom) {
	            yOffset = returnBounds.yRange.max - bounds.yRange.min + spacing;
	        } else {
	            yOffset = returnBounds.yRange.max - bounds.yRange.max;
	            centreing = (bounds.yRange.max - bounds.yRange.min) / 2 - (returnBounds.yRange.max - returnBounds.yRange.min) / 2;
	            if (centreing < 0) yOffset += centreing;
	        }

	        for (var j = 0; j < cluster.length; ++j) {
	            cluster[j].x += xOffset;
	            cluster[j].y += yOffset;
	            circles.push(cluster[j]);
	        }
	    }

	    var index = 1;
	    while (index < clusters.length) {
	        addCluster(clusters[index], true, false);
	        addCluster(clusters[index + 1], false, true);
	        addCluster(clusters[index + 2], true, true);
	        index += 3;

	        // have one cluster (in top left). lay out next three relative
	        // to it in a grid
	        returnBounds = getBoundingBox(circles);
	    }

	    // convert back to solution form
	    var ret = {};
	    for (i = 0; i < circles.length; ++i) {
	        ret[circles[i].setid] = circles[i];
	    }
	    return ret;
	}

	/** Scales a solution from venn.venn or venn.greedyLayout such that it fits in
	a rectangle of width/height - with padding around the borders. also
	centers the diagram in the available space at the same time */
	function scaleSolution(solution, width, height, padding) {
	    var circles = [],
	        setids = [];
	    for (var setid in solution) {
	        if (solution.hasOwnProperty(setid)) {
	            setids.push(setid);
	            circles.push(solution[setid]);
	        }
	    }

	    width -= 2 * padding;
	    height -= 2 * padding;

	    var bounds = getBoundingBox(circles),
	        xRange = bounds.xRange,
	        yRange = bounds.yRange;

	    if (xRange.max == xRange.min || yRange.max == yRange.min) {
	        console.log("not scaling solution: zero size detected");
	        return solution;
	    }

	    var xScaling = width / (xRange.max - xRange.min),
	        yScaling = height / (yRange.max - yRange.min),
	        scaling = Math.min(yScaling, xScaling),


	    // while we're at it, center the diagram too
	    xOffset = (width - (xRange.max - xRange.min) * scaling) / 2,
	        yOffset = (height - (yRange.max - yRange.min) * scaling) / 2;

	    var scaled = {};
	    for (var i = 0; i < circles.length; ++i) {
	        var circle = circles[i];
	        scaled[setids[i]] = {
	            radius: scaling * circle.radius,
	            x: padding + xOffset + (circle.x - xRange.min) * scaling,
	            y: padding + yOffset + (circle.y - yRange.min) * scaling
	        };
	    }

	    return scaled;
	}

	var _$29 = canvax._;
	var Text$5 = canvax.Display.Text;
	var Path$3 = canvax.Shapes.Path;
	var Circle$8 = canvax.Shapes.Circle;

	var VennGraphs = function (_GraphsBase) {
	    inherits$1(VennGraphs, _GraphsBase);

	    function VennGraphs(opt, root) {
	        classCallCheck$1(this, VennGraphs);

	        var _this = possibleConstructorReturn$1(this, (VennGraphs.__proto__ || Object.getPrototypeOf(VennGraphs)).call(this, opt, root));

	        _this.type = "venn";

	        //this.field = null;
	        _this.keyField = null;
	        _this.valueField = null;

	        //坚持一个数据节点的设置都在一个node下面
	        _this.node = {
	            //field : null, //node的id标识,而不是label

	            strokeStyle: null,
	            lineWidth: 2,
	            lineAlpha: 0,
	            fillStyle: null,
	            fillAlpha: 0.25,

	            focus: {
	                enabled: true,
	                lineAlpha: 0.3
	            },
	            select: {
	                enabled: true,
	                lineWidth: 2,
	                strokeStyle: "#666"
	            }
	        };

	        _this.label = {
	            field: null,
	            fontSize: 14,
	            //fontFamily : "Impact",
	            fontColor: null, //"#666",
	            fontWeight: "normal",
	            showInter: true
	        };

	        _this.vennData = null;

	        _$29.extend(true, _this, opt);

	        //_trimGraphs后，计算出来本次data的一些属性
	        _this._dataCircleLen = 0;
	        _this._dataLabelLen = 0;
	        _this._dataPathLen = 0;

	        _this.init();
	        return _this;
	    }

	    createClass$1(VennGraphs, [{
	        key: "init",
	        value: function init() {
	            this.sprite = new canvax.Display.Sprite({
	                id: "venn_graphs"
	            });
	            this.venn_circles = new canvax.Display.Sprite({
	                id: "venn_circles"
	            });
	            this.sprite.addChild(this.venn_circles);

	            this.venn_paths = new canvax.Display.Sprite({
	                id: "venn_paths"
	            });
	            this.sprite.addChild(this.venn_paths);

	            this.venn_labels = new canvax.Display.Sprite({
	                id: "venn_labels"
	            });
	            this.sprite.addChild(this.venn_labels);
	        }
	    }, {
	        key: "draw",
	        value: function draw(opt) {
	            !opt && (opt = {});
	            _$29.extend(true, this, opt);
	            this.data = this._trimGraphs();

	            this._widget();

	            this.sprite.context.x = this.root.padding.left;
	            this.sprite.context.y = this.root.padding.top;

	            this.fire("complete");
	        }
	    }, {
	        key: "resetData",
	        value: function resetData(dataFrame, dataTrigger) {
	            this.dataFrame = dataFrame;
	            this.data = this._trimGraphs();
	            this._widget();
	        }
	    }, {
	        key: "_trimGraphs",
	        value: function _trimGraphs() {
	            var me = this;
	            var data = me._vennData();
	            var layoutFunction = venn;
	            var loss = lossFunction;
	            var orientation = Math.PI / 2;
	            var orientationOrder = null;
	            var normalize = true;

	            var circles = {};
	            var textCentres = {};

	            this._dataCircleLen = 0;
	            this._dataLabelLen = 0;
	            this._dataPathLen = 0;

	            if (data.length > 0) {
	                var solution = layoutFunction(data, { lossFunction: loss });

	                if (normalize) {
	                    solution = normalizeSolution(solution, orientation, orientationOrder);
	                }
	                //第4个参数本是padding，但是这里的width,height已经是减去过padding的
	                //所以就传0
	                circles = scaleSolution(solution, this.width, this.height, 0);
	                textCentres = computeTextCentres(circles, data);
	            }
	            var circleInd = 0;
	            var pathInd = 0;
	            _$29.each(data, function (d, ind) {
	                if (d.label) {
	                    if (d.sets.length > 1 && !me.label.showInter) ; else {
	                        d.labelPosition = textCentres[d.nodeId];
	                        me._dataLabelLen++;
	                    }
	                }                if (d.sets.length > 1) {
	                    var _path = intersectionAreaPath(d.sets.map(function (set$$1) {
	                        return circles[set$$1];
	                    }));
	                    d.shape = {
	                        type: 'path',
	                        path: _path,
	                        pathInd: pathInd++
	                    };
	                    me._dataPathLen++;
	                } else if (d.sets.length == 1) {
	                    d.shape = _$29.extend({
	                        type: 'circle',
	                        circleInd: circleInd++
	                    }, circles[d.nodeId]);
	                    me._dataCircleLen++;
	                }
	            });

	            return data;
	        }
	    }, {
	        key: "_vennData",
	        value: function _vennData() {
	            var data = [];
	            var me = this;

	            for (var i = 0, l = this.dataFrame.length; i < l; i++) {
	                var rowData = me.dataFrame.getRowData(i);

	                var obj = {
	                    iNode: i,
	                    nodeId: null,
	                    rowData: rowData,
	                    sets: null,

	                    //size和value是同一个值，size是 vennLayout 需要用到的属性
	                    //value是 chartx中和其他图表的值属性保持统一，比如tips中就会读取value
	                    size: null,
	                    value: null,

	                    //这两个在绘制的时候赋值
	                    fillStyle: null,
	                    strokeStyle: null,

	                    label: null,
	                    labelPosition: null
	                };

	                for (var p in rowData) {

	                    var val = rowData[p];

	                    if (p == me.keyField) {
	                        if (!_$29.isArray(val)) {
	                            val = val.split(/[,|]/);
	                        }                        obj.sets = val;
	                        obj.nodeId = val.join();
	                    } else if (p == me.valueField) {
	                        obj.size = val;
	                        obj.value = val;
	                    } else if (p == me.label.field) {
	                        obj.label = val;
	                    }                }

	                data.push(obj);
	            }
	            return data;
	        }
	    }, {
	        key: "_getStyle",
	        value: function _getStyle(style, ind, nodeData, defColor) {
	            var color;
	            if (_$29.isString(style)) {
	                color = style;
	            }
	            if (_$29.isFunction(style)) {
	                color = style(nodeData);
	            }
	            if (!color && ind != undefined) {
	                color = this.root.getTheme(ind);
	            }
	            if (!color && defColor != undefined) {
	                color = defColor;
	            }
	            return color;
	        }
	    }, {
	        key: "_widget",
	        value: function _widget() {
	            var me = this;

	            //那么有多余的元素要去除掉 begin
	            if (me.venn_circles.children.length > me._dataCircleLen) {
	                for (var i = me._dataCircleLen; i < me.venn_circles.children.length; i++) {
	                    me.venn_circles.getChildAt(i--).destroy();
	                }
	            }            if (me.venn_paths.children.length > me._dataPathLen) {
	                for (var i = me._dataPathLen; i < me.venn_paths.children.length; i++) {
	                    me.venn_paths.getChildAt(i--).destroy();
	                }
	            }            if (me.venn_labels.children.length > me._dataLabelLen) {
	                for (var i = me._dataLabelLen; i < me.venn_labels.children.length; i++) {
	                    me.venn_labels.getChildAt(i--).destroy();
	                }
	            }            //那么有多余的元素要去除掉 end

	            var circleInd = 0;
	            var pathInd = 0;
	            var labelInd = 0;
	            _$29.each(this.data, function (nodeData, i) {
	                var shape = nodeData.shape;
	                var _shape;
	                var isNewShape = true;
	                if (shape) {
	                    var context;
	                    if (shape.type == 'circle') {
	                        var fillStyle = me._getStyle(me.node.fillStyle, shape.circleInd, nodeData);
	                        var strokeStyle = me._getStyle(me.node.strokeStyle, shape.circleInd, nodeData);

	                        nodeData.fillStyle = fillStyle;
	                        nodeData.strokeStyle = strokeStyle;

	                        context = {
	                            x: shape.x,
	                            y: shape.y,
	                            r: shape.radius,
	                            fillStyle: fillStyle,
	                            fillAlpha: me.node.fillAlpha,
	                            lineWidth: me.node.lineWidth,
	                            strokeStyle: strokeStyle,
	                            lineAlpha: me.node.lineAlpha
	                        };
	                        _shape = me.venn_circles.getChildAt(circleInd++);
	                        if (!_shape) {
	                            _shape = new Circle$8({
	                                pointChkPriority: false,
	                                hoverClone: false,
	                                context: context
	                            });
	                            me.venn_circles.addChild(_shape);
	                        } else {
	                            isNewShape = false;
	                            _shape.animate(context);
	                        }
	                    }                    if (nodeData.shape.type == 'path') {
	                        context = {
	                            path: shape.path,
	                            fillStyle: "#ffffff",
	                            fillAlpha: 0, //me.node.fillAlpha,
	                            lineWidth: me.node.lineWidth,
	                            strokeStyle: "#ffffff",
	                            lineAlpha: 0 //me.node.lineAlpha
	                        };

	                        _shape = me.venn_paths.getChildAt(pathInd++);
	                        if (!_shape) {
	                            _shape = new Path$3({
	                                pointChkPriority: false,
	                                context: context
	                            });
	                            me.venn_paths.addChild(_shape);
	                        } else {
	                            isNewShape = false;
	                            _shape.context.path = shape.path;
	                            //_shape.animate( context )
	                        }
	                    }
	                    _shape.nodeData = nodeData;
	                    nodeData._node = _shape;

	                    me.node.focus.enabled && _shape.hover(function (e) {
	                        me.focusAt(this.nodeData.iNode);
	                    }, function (e) {
	                        !this.nodeData.selected && me.unfocusAt(this.nodeData.iNode);
	                    });

	                    //新创建的元素才需要绑定事件，因为复用的原件已经绑定过事件了
	                    if (isNewShape) {
	                        _shape.on("mousedown mouseup panstart mouseover panmove mousemove panend mouseout tap click dblclick", function (e) {

	                            e.eventInfo = {
	                                title: null,
	                                nodes: [this.nodeData]
	                            };

	                            //fire到root上面去的是为了让root去处理tips
	                            me.root.fire(e.type, e);
	                            me.triggerEvent(me.node, e);
	                        });
	                    }                }

	                if (nodeData.label && me.label.enabled) {

	                    var fontColor = me._getStyle(me.label.fontColor, shape.circleInd, nodeData, "#999");
	                    var fontSize = me.label.fontSize;
	                    if (nodeData.sets.length > 1) {
	                        if (!me.label.showInter) {
	                            fontSize = 0;
	                        } else {
	                            fontSize -= 2;
	                        }
	                    }
	                    if (fontSize) {
	                        var _textContext = {
	                            x: nodeData.labelPosition.x,
	                            y: nodeData.labelPosition.y,
	                            fontSize: fontSize,
	                            //fontFamily: me.label.fontFamily,
	                            textBaseline: "middle",
	                            textAlign: "center",
	                            fontWeight: me.label.fontWeight,
	                            fillStyle: fontColor
	                        };

	                        var _txt = me.venn_labels.getChildAt(labelInd++);
	                        if (!_txt) {
	                            _txt = new Text$5(nodeData.label, {
	                                context: _textContext
	                            });
	                            me.venn_labels.addChild(_txt);
	                        } else {
	                            _txt.resetText(nodeData.label);
	                            _txt.animate(_textContext);
	                        }
	                    }
	                }
	            });
	        }
	    }, {
	        key: "focusAt",
	        value: function focusAt(ind) {
	            var nodeData = this.data[ind];
	            if (!this.node.focus.enabled || nodeData.focused) return;

	            var nctx = nodeData._node.context;
	            //nctx.lineAlpha += 0.5;
	            if (nodeData.sets.length > 1) {
	                //path
	                nctx.lineAlpha = 1;
	            } else {
	                //circle
	                nctx.lineAlpha = this.node.focus.lineAlpha;
	            }

	            nodeData.focused = true;
	        }
	    }, {
	        key: "unfocusAt",
	        value: function unfocusAt(ind) {
	            var nodeData = this.data[ind];
	            if (!this.node.focus.enabled || !nodeData.focused) return;
	            var nctx = nodeData._node.context;
	            //nctx.lineAlpha = 0.5;
	            nctx.lineAlpha = this.node.lineAlpha;
	            nodeData.focused = false;
	        }
	    }, {
	        key: "selectAt",
	        value: function selectAt(ind) {

	            var nodeData = this.data[ind];
	            if (!this.node.select.enabled || nodeData.selected) return;

	            var nctx = nodeData._node.context;
	            nctx.lineWidth = this.node.select.lineWidth;
	            nctx.lineAlpha = this.node.select.lineAlpha;
	            nctx.strokeStyle = this.node.select.strokeStyle;

	            nodeData.selected = true;
	        }
	    }, {
	        key: "unselectAt",
	        value: function unselectAt(ind) {
	            var nodeData = this.data[ind];
	            if (!this.node.select.enabled || !nodeData.selected) return;
	            var nctx = nodeData._node.context;
	            nctx.strokeStyle = this.node.strokeStyle;

	            nodeData.selected = false;
	        }
	    }]);
	    return VennGraphs;
	}(GraphsBase);
	function getOverlappingCircles(circles) {
	    var ret = {},
	        circleids = [];
	    for (var circleid in circles) {
	        circleids.push(circleid);
	        ret[circleid] = [];
	    }
	    for (var i = 0; i < circleids.length; i++) {
	        var a = circles[circleids[i]];
	        for (var j = i + 1; j < circleids.length; ++j) {
	            var b = circles[circleids[j]],
	                d = distance(a, b);

	            if (d + b.radius <= a.radius + 1e-10) {
	                ret[circleids[j]].push(circleids[i]);
	            } else if (d + a.radius <= b.radius + 1e-10) {
	                ret[circleids[i]].push(circleids[j]);
	            }
	        }
	    }
	    return ret;
	}

	function computeTextCentres(circles, areas) {
	    var ret = {},
	        overlapped = getOverlappingCircles(circles);
	    for (var i = 0; i < areas.length; ++i) {
	        var area = areas[i].sets,
	            areaids = {},
	            exclude = {};
	        for (var j = 0; j < area.length; ++j) {
	            areaids[area[j]] = true;
	            var overlaps = overlapped[area[j]];
	            for (var k = 0; k < overlaps.length; ++k) {
	                exclude[overlaps[k]] = true;
	            }
	        }

	        var interior = [],
	            exterior = [];
	        for (var setid in circles) {
	            if (setid in areaids) {
	                interior.push(circles[setid]);
	            } else if (!(setid in exclude)) {
	                exterior.push(circles[setid]);
	            }
	        }
	        var centre = computeTextCentre(interior, exterior);
	        ret[area] = centre;
	        if (centre.disjoint && areas[i].size > 0) {
	            console.log("WARNING: area " + area + " not represented on screen");
	        }
	    }
	    return ret;
	}
	function computeTextCentre(interior, exterior) {
	    var points = [],
	        i;
	    for (i = 0; i < interior.length; ++i) {
	        var c = interior[i];
	        points.push({ x: c.x, y: c.y });
	        points.push({ x: c.x + c.radius / 2, y: c.y });
	        points.push({ x: c.x - c.radius / 2, y: c.y });
	        points.push({ x: c.x, y: c.y + c.radius / 2 });
	        points.push({ x: c.x, y: c.y - c.radius / 2 });
	    }
	    var initial = points[0],
	        margin = circleMargin(points[0], interior, exterior);
	    for (i = 1; i < points.length; ++i) {
	        var m = circleMargin(points[i], interior, exterior);
	        if (m >= margin) {
	            initial = points[i];
	            margin = m;
	        }
	    }

	    // maximize the margin numerically
	    var solution = nelderMead(function (p) {
	        return -1 * circleMargin({ x: p[0], y: p[1] }, interior, exterior);
	    }, [initial.x, initial.y], { maxIterations: 500, minErrorDelta: 1e-10 }).x;
	    var ret = { x: solution[0], y: solution[1] };

	    // check solution, fallback as needed (happens if fully overlapped
	    // etc)
	    var valid = true;
	    for (i = 0; i < interior.length; ++i) {
	        if (distance(ret, interior[i]) > interior[i].radius) {
	            valid = false;
	            break;
	        }
	    }

	    for (i = 0; i < exterior.length; ++i) {
	        if (distance(ret, exterior[i]) < exterior[i].radius) {
	            valid = false;
	            break;
	        }
	    }

	    if (!valid) {
	        if (interior.length == 1) {
	            ret = { x: interior[0].x, y: interior[0].y };
	        } else {
	            var areaStats = {};
	            intersectionArea(interior, areaStats);

	            if (areaStats.arcs.length === 0) {
	                ret = { 'x': 0, 'y': -1000, disjoint: true };
	            } else if (areaStats.arcs.length == 1) {
	                ret = { 'x': areaStats.arcs[0].circle.x,
	                    'y': areaStats.arcs[0].circle.y };
	            } else if (exterior.length) {
	                // try again without other circles
	                ret = computeTextCentre(interior, []);
	            } else {
	                // take average of all the points in the intersection
	                // polygon. this should basically never happen
	                // and has some issues:
	                // https://github.com/benfred/venn.js/issues/48#issuecomment-146069777
	                ret = getCenter(areaStats.arcs.map(function (a) {
	                    return a.p1;
	                }));
	            }
	        }
	    }

	    return ret;
	}

	function circleMargin(current, interior, exterior) {
	    var margin = interior[0].radius - distance(interior[0], current),
	        i,
	        m;
	    for (i = 1; i < interior.length; ++i) {
	        m = interior[i].radius - distance(interior[i], current);
	        if (m <= margin) {
	            margin = m;
	        }
	    }

	    for (i = 0; i < exterior.length; ++i) {
	        m = distance(exterior[i], current) - exterior[i].radius;
	        if (m <= margin) {
	            margin = m;
	        }
	    }
	    return margin;
	}

	function circlePath(x, y, r) {
	    var ret = [];
	    ret.push("\nM", x, y);
	    ret.push("\nm", -r, 0);
	    ret.push("\na", r, r, 0, 1, 0, r * 2, 0);
	    ret.push("\na", r, r, 0, 1, 0, -r * 2, 0);
	    return ret.join(" ");
	}

	/** returns a svg path of the intersection area of a bunch of circles */
	function intersectionAreaPath(circles) {
	    var stats = {};
	    intersectionArea(circles, stats);
	    var arcs = stats.arcs;

	    if (arcs.length === 0) {
	        return "M 0 0";
	    } else if (arcs.length == 1) {
	        var circle = arcs[0].circle;
	        return circlePath(circle.x, circle.y, circle.radius);
	    } else {
	        // draw path around arcs
	        var ret = ["\nM", arcs[0].p2.x, arcs[0].p2.y];
	        for (var i = 0; i < arcs.length; ++i) {
	            var arc = arcs[i],
	                r = arc.circle.radius,
	                wide = arc.width > r;
	            ret.push("\nA", r, r, 0, wide ? 1 : 0, 1, arc.p1.x, arc.p1.y);
	        }
	        return ret.join(" ") + " z";
	    }
	}

	function _rebind(target, source, method) {
	    return function () {
	        var value = method.apply(source, arguments);
	        return value === source ? target : value;
	    };
	}

	function rebind (target, source) {
	    var i = 1,
	        n = arguments.length,
	        method;
	    while (++i < n) {
	        target[method = arguments[i]] = _rebind(target, source, source[method]);
	    }return target;
	}

	var arrays = {
	    merge: function merge(arrays) {
	        var n = arrays.length,
	            m,
	            i = -1,
	            j = 0,
	            merged,
	            array;

	        while (++i < n) {
	            j += arrays[i].length;
	        }merged = new Array(j);

	        while (--n >= 0) {
	            array = arrays[n];
	            m = array.length;
	            while (--m >= 0) {
	                merged[--j] = array[m];
	            }
	        }

	        return merged;
	    }
	};

	/**
	 * 修改优化了下面 node._value的代码部分
	 * 可以手动给中间节点添加value大于children的value总和的值
	 * 这样，就会有流失的效果
	 */

	var Hierarchy = function Hierarchy() {
	    var sort = layout_hierarchySort,
	        children = layout_hierarchyChildren,
	        value = layout_hierarchyValue;

	    function hierarchy(root) {
	        var stack = [root],
	            nodes = [],
	            node;

	        root.depth = 0;

	        while ((node = stack.pop()) != null) {
	            nodes.push(node);
	            if ((childs = children.call(hierarchy, node, node.depth)) && (n = childs.length)) {
	                var n, childs, child;
	                while (--n >= 0) {
	                    stack.push(child = childs[n]);
	                    child.parent = node;
	                    child.depth = node.depth + 1;
	                }
	                //如果这个节点上面有用户主动设置value，那么以用户设置为准
	                var _value = +value.call(hierarchy, node, node.depth);
	                if (_value && !isNaN(_value)) {
	                    node._value = _value;
	                }
	                if (value) node.value = 0;
	                node.children = childs;
	            } else {
	                if (value) node.value = +value.call(hierarchy, node, node.depth) || 0;
	                delete node.children;
	            }
	        }

	        layout_hierarchyVisitAfter(root, function (node) {
	            var childs, parent;
	            if (sort && (childs = node.children)) childs.sort(sort);
	            if (value && (parent = node.parent)) parent.value += node.value;

	            if (node._value && node._value > node.value) {
	                node.value = node._value;
	            }            delete node._value;
	        });

	        return nodes;
	    }

	    hierarchy.sort = function (x) {
	        if (!arguments.length) return sort;
	        sort = x;
	        return hierarchy;
	    };

	    hierarchy.children = function (x) {
	        if (!arguments.length) return children;
	        children = x;
	        return hierarchy;
	    };

	    hierarchy.value = function (x) {
	        if (!arguments.length) return value;
	        value = x;
	        return hierarchy;
	    };

	    // Re-evaluates the `value` property for the specified hierarchy.
	    hierarchy.revalue = function (root) {
	        if (value) {
	            layout_hierarchyVisitBefore(root, function (node) {
	                if (node.children) node.value = 0;
	            });
	            layout_hierarchyVisitAfter(root, function (node) {
	                var parent;
	                if (!node.children) node.value = +value.call(hierarchy, node, node.depth) || 0;
	                if (parent = node.parent) parent.value += node.value;

	                if (node._value && node._value > node.value) {
	                    node.value = node._value;
	                }                delete node._value;
	            });
	        }
	        return root;
	    };

	    return hierarchy;
	};

	Hierarchy.layout_hierarchyRebind = function (object, hierarchy) {
	    rebind(object, hierarchy, "sort", "children", "value");

	    object.nodes = object;
	    object.links = layout_hierarchyLinks;

	    return object;
	};

	function layout_hierarchyVisitBefore(node, callback) {
	    var nodes = [node];
	    while ((node = nodes.pop()) != null) {
	        callback(node);
	        if ((children = node.children) && (n = children.length)) {
	            var n, children;
	            while (--n >= 0) {
	                nodes.push(children[n]);
	            }
	        }
	    }
	}

	function layout_hierarchyVisitAfter(node, callback) {
	    var nodes = [node],
	        nodes2 = [];
	    while ((node = nodes.pop()) != null) {
	        nodes2.push(node);
	        if ((children = node.children) && (n = children.length)) {
	            var i = -1,
	                n,
	                children;
	            while (++i < n) {
	                nodes.push(children[i]);
	            }
	        }
	    }
	    while ((node = nodes2.pop()) != null) {
	        callback(node);
	    }
	}

	function layout_hierarchyChildren(d) {
	    return d.children;
	}

	function layout_hierarchyValue(d) {
	    return d.value;
	}

	function layout_hierarchySort(a, b) {
	    return b.value - a.value;
	}

	function layout_hierarchyLinks(nodes) {
	    return arrays.merge(nodes.map(function (parent) {
	        return (parent.children || []).map(function (child) {
	            return { source: parent, target: child };
	        });
	    }));
	}

	function Partition () {
	    var hierarchy = Hierarchy(),
	        size = [1, 1];

	    function position(node, x, dx, dy) {
	        var children = node.children;
	        node.x = x;
	        node.y = node.depth * dy;
	        node.dx = dx;
	        node.dy = dy;
	        if (children && (n = children.length)) {
	            var i = -1,
	                n,
	                c,
	                d;
	            dx = node.value ? dx / node.value : 0;
	            while (++i < n) {
	                position(c = children[i], x, d = c.value * dx, dy);
	                x += d;
	            }
	        }
	    }

	    function depth(node) {
	        var children = node.children,
	            d = 0;
	        if (children && (n = children.length)) {
	            var i = -1,
	                n;
	            while (++i < n) {
	                d = Math.max(d, depth(children[i]));
	            }
	        }
	        return 1 + d;
	    }

	    function partition(d, i) {
	        var nodes = hierarchy.call(this, d, i);
	        position(nodes[0], 0, size[0], size[1] / depth(nodes[0]));
	        return nodes;
	    }

	    partition.size = function (x) {
	        if (!arguments.length) return size;
	        size = x;
	        return partition;
	    };

	    return Hierarchy.layout_hierarchyRebind(partition, hierarchy);
	}

	/*
	* 太阳图
	*/

	var _$30 = canvax._;
	var Sector$2 = canvax.Shapes.Sector;
	var Circle$9 = canvax.Shapes.Circle;

	var sunburstGraphs = function (_GraphsBase) {
	    inherits$1(sunburstGraphs, _GraphsBase);

	    function sunburstGraphs(opt, root) {
	        classCallCheck$1(this, sunburstGraphs);

	        var _this = possibleConstructorReturn$1(this, (sunburstGraphs.__proto__ || Object.getPrototypeOf(sunburstGraphs)).call(this, opt, root));

	        _this.type = "sunburst";

	        _this.keyField = "name"; //key, parent指向的值
	        _this.valueField = 'value';

	        _this.parentField = 'parent';

	        //坚持一个数据节点的设置都在一个node下面
	        _this.node = {
	            strokeStyle: "#fff",
	            lineWidth: 1,
	            lineAlpha: 1,
	            fillStyle: null,
	            fillAlpha: 1,

	            blurAlpha: 0.4,
	            focus: {
	                enabled: true,
	                lineAlpha: 1
	            }

	        };

	        _$30.extend(true, _this, opt);

	        _this.data = []; //布局算法布局后的数据
	        _this.dataGroup = []; //data数据按照深度的分组

	        _this.init();
	        return _this;
	    }

	    createClass$1(sunburstGraphs, [{
	        key: "init",
	        value: function init() {
	            this.sprite = new canvax.Display.Sprite({
	                id: "sunburst_graphs"
	            });
	        }
	    }, {
	        key: "draw",
	        value: function draw(opt) {
	            !opt && (opt = {});
	            _$30.extend(true, this, opt);

	            this.data = this._trimGraphs();
	            this.dataGroup = this._getDataGroupOfDepth();

	            this._widget();

	            this.sprite.context.x = this.width / 2 + this.origin.x;
	            this.sprite.context.y = this.height / 2 + this.origin.y;

	            this.fire("complete");
	        }
	    }, {
	        key: "_trimGraphs",
	        value: function _trimGraphs() {

	            var me = this;
	            var radius = parseInt(Math.min(this.width, this.height) / 2);
	            var partition = Partition().sort(null).size([2 * Math.PI, radius * radius]).value(function (d) {
	                //return 1; 
	                return d[me.valueField]; //d.size
	            });

	            //安装深度分组
	            var _treeData = this._tansTreeData();
	            this.data = partition(_treeData, 0);

	            return this.data;
	        }
	    }, {
	        key: "_getDataGroupOfDepth",
	        value: function _getDataGroupOfDepth() {
	            var map = {};
	            _$30.each(this.data, function (d) {
	                map[d.depth] = [];
	            });
	            _$30.each(this.data, function (d) {
	                map[d.depth].push(d);
	            });

	            var arr = [];
	            for (var p in map) {
	                arr.push(map[p]);
	            }

	            return arr;
	        }
	    }, {
	        key: "_tansTreeData",
	        value: function _tansTreeData() {
	            var dataFrame = this.dataFrame;
	            var treeData = {};

	            var keyData = dataFrame.getFieldData(this.keyField);
	            var valueData = dataFrame.getFieldData(this.valueField);
	            var parentData = dataFrame.getFieldData(this.parentField); //用parentField去找index

	            function findChild(obj, parent, ki) {
	                var parentKey = parent ? parent.name : undefined;
	                for (var i = ki || 0; i < parentData.length; i++) {
	                    var key = parentData[i];
	                    if (!key && key !== 0) {
	                        key = undefined;
	                    }                    if (parentKey === key) {
	                        obj.name = keyData[i];
	                        obj.iNode = i;
	                        var value = valueData[i];
	                        if (!!value || value === 0) {
	                            obj.value = value;
	                        }                        //然后寻找到parent.key === obj.name的，作为children
	                        _$30.each(parentData, function (key, ki) {
	                            if (key === obj.name) {
	                                //这个是obj的children
	                                if (!obj.children) {
	                                    obj.children = [];
	                                }                                var child = {};
	                                findChild(child, obj, ki);
	                                obj.children.push(child);
	                            }
	                        });

	                        break;
	                    }                }            }            findChild(treeData);

	            return treeData;
	        }
	    }, {
	        key: "_widget",
	        value: function _widget() {

	            var me = this;

	            _$30.each(this.dataGroup, function (group, g) {
	                _$30.each(group, function (layoutData, i) {

	                    if (!layoutData.depth) {
	                        //最中间的大圆隐藏
	                        return;
	                    }
	                    var r = Math.sqrt(layoutData.y + layoutData.dy);
	                    var sectorContext = {
	                        r0: Math.sqrt(layoutData.y),
	                        r: Math.sqrt(layoutData.y) + 2,
	                        startAngle: layoutData.x * 180 / Math.PI,
	                        endAngle: (layoutData.x + layoutData.dx) * 180 / Math.PI, //secc.endAngle,

	                        fillStyle: layoutData.color || me.root.getTheme(layoutData.iNode),
	                        strokeStyle: me.node.strokeStyle,
	                        lineWidth: me.node.lineWidth,
	                        globalAlpha: 0
	                    };

	                    var sector = new Sector$2({
	                        id: "sector_" + g + "_" + i,
	                        context: sectorContext
	                    });

	                    sector.layoutData = layoutData;
	                    layoutData.sector = sector;
	                    layoutData.group = group; //所在的group

	                    me.sprite.addChild(sector);

	                    sector.hover(function (e) {
	                        me._focus(layoutData, group);
	                    }, function (e) {
	                        me._unfocus(layoutData, group);
	                    });
	                    sector.on("mousedown mouseup panstart mouseover panmove mousemove panend mouseout tap click dblclick", function (e) {
	                        //fire到root上面去的是为了让root去处理tips
	                        e.eventInfo = {
	                            iNode: layoutData.iNode
	                        };
	                        me.root.fire(e.type, e);
	                        me.triggerEvent(me.node, e);
	                    });

	                    if (g <= 1) {
	                        sector.context.r = r;
	                        sector.context.globalAlpha = 1;
	                    } else {
	                        //从第二组开始，延时动画出现
	                        setTimeout(function () {
	                            if (!sector.context) {
	                                //这个时候可能图表已经被销毁了
	                                return;
	                            }
	                            sector.context.globalAlpha = 1;
	                            sector.animate({
	                                r: r
	                            }, {
	                                duration: 350
	                            });
	                        }, 350 * (g - 1));
	                    }
	                });
	            });
	        }
	    }, {
	        key: "getNodesAt",
	        value: function getNodesAt(e) {
	            var nodes = [];
	            var iNode = e.eventInfo.iNode;
	            if (iNode !== undefined) {
	                var node = _$30.find(this.data, function (item) {
	                    return item.iNode == iNode;
	                });
	                node && nodes.push(node);
	            }            return nodes;
	        }
	    }, {
	        key: "_focus",
	        value: function _focus(layoutData, group) {
	            var me = this;
	            _$30.each(group, function (d) {
	                if (d !== layoutData) {
	                    d.sector.context.globalAlpha = me.node.blurAlpha;
	                    me._focusChildren(d, function (child) {
	                        child.sector.context.globalAlpha = me.node.blurAlpha;
	                    });
	                }
	            });
	            me._focusParent(layoutData);
	        }
	    }, {
	        key: "_unfocus",
	        value: function _unfocus(layoutData, group) {
	            _$30.each(this.data, function (d) {
	                d.sector && (d.sector.context.globalAlpha = 1);
	            });
	        }
	    }, {
	        key: "_focusChildren",
	        value: function _focusChildren(d, callback) {
	            var me = this;
	            if (d.children && d.children.length) {
	                _$30.each(d.children, function (child) {
	                    callback(child);
	                    me._focusChildren(child, callback);
	                });
	            }
	        }
	    }, {
	        key: "_focusParent",
	        value: function _focusParent(layoutData) {
	            var me = this;
	            if (layoutData.parent && layoutData.parent.sector && layoutData.parent.group) {
	                _$30.each(layoutData.parent.group, function (d) {
	                    if (d === layoutData.parent) {
	                        d.sector.context.globalAlpha = 1;
	                        me._focusParent(layoutData.parent);
	                    } else {
	                        d.sector.context.globalAlpha = me.node.blurAlpha;
	                    }
	                });
	            }
	        }
	    }]);
	    return sunburstGraphs;
	}(GraphsBase);

	function sankeyLayout () {
	    var sankey = {},
	        nodeWidth = 24,
	        nodePadding = 8,
	        size = [1, 1],
	        nodes = [],
	        links = [];

	    sankey.nodeWidth = function (_) {
	        if (!arguments.length) return nodeWidth;
	        nodeWidth = +_;
	        return sankey;
	    };

	    sankey.nodePadding = function (_) {
	        if (!arguments.length) return nodePadding;
	        nodePadding = +_;
	        return sankey;
	    };

	    sankey.nodes = function (_) {
	        if (!arguments.length) return nodes;
	        nodes = _;
	        return sankey;
	    };

	    sankey.links = function (_) {
	        if (!arguments.length) return links;
	        links = _;
	        return sankey;
	    };

	    sankey.size = function (_) {
	        if (!arguments.length) return size;
	        size = _;
	        return sankey;
	    };

	    sankey.layout = function (iterations) {
	        computeNodeLinks();
	        computeNodeValues();
	        computeNodeBreadths();
	        computeNodeDepths(iterations);
	        computeLinkDepths();
	        return sankey;
	    };

	    sankey.relayout = function () {
	        computeLinkDepths();
	        return sankey;
	    };

	    //d3
	    function d3_interpolateNumber(a, b) {
	        a = +a, b = +b;
	        return function (t) {
	            return a * (1 - t) + b * t;
	        };
	    }

	    sankey.link = function () {
	        var curvature = .5;

	        function link(d) {
	            var x0 = d.source.x + d.source.dx,
	                x1 = d.target.x,
	                xi = d3_interpolateNumber(x0, x1),
	                x2 = xi(curvature),
	                x3 = xi(1 - curvature),

	            //y0 = d.source.y + d.sy + d.dy / 2,
	            //y1 = d.target.y + d.ty + d.dy / 2;
	            y0 = d.source.y + d.sy,
	                y1 = d.target.y + d.ty;

	            var dy = d.dy;
	            if (dy < 1) {
	                dy = 1;
	            }
	            var path = "M" + x0 + "," + y0 + "C" + x2 + "," + y0 + " " + x3 + "," + y1 + " " + x1 + "," + y1;

	            path += "v" + dy;
	            path += "C" + x3 + "," + (y1 + dy) + " " + x2 + "," + (y0 + dy) + " " + x0 + "," + (y0 + dy);
	            path += "v" + -dy + "z";
	            return path;
	        }

	        link.curvature = function (_) {
	            if (!arguments.length) return curvature;
	            curvature = +_;
	            return link;
	        };

	        return link;
	    };

	    // Populate the sourceLinks and targetLinks for each node.
	    // Also, if the source and target are not objects, assume they are indices.
	    function computeNodeLinks() {
	        nodes.forEach(function (node) {
	            node.sourceLinks = [];
	            node.targetLinks = [];
	        });
	        links.forEach(function (link) {
	            var source = link.source,
	                target = link.target;
	            if (typeof source === "number") source = link.source = nodes[link.source];
	            if (typeof target === "number") target = link.target = nodes[link.target];
	            source.sourceLinks.push(link);
	            target.targetLinks.push(link);
	        });
	    }

	    function d3_sum(e, t) {
	        var n = 0,
	            r = e.length,
	            i,
	            s = -1;
	        if (arguments.length === 1) while (++s < r) {
	            isNaN(i = +e[s]) || (n += i);
	        } else while (++s < r) {
	            isNaN(i = +t.call(e, e[s], s)) || (n += i);
	        }return n;
	    }

	    function d3_min(e, t) {
	        var n = -1,
	            r = e.length,
	            i,
	            s;
	        if (arguments.length === 1) {
	            while (++n < r && ((i = e[n]) == null || i != i)) {
	                i = undefined;
	            }while (++n < r) {
	                (s = e[n]) != null && i > s && (i = s);
	            }
	        } else {
	            while (++n < r && ((i = t.call(e, e[n], n)) == null || i != i)) {
	                i = undefined;
	            }while (++n < r) {
	                (s = t.call(e, e[n], n)) != null && i > s && (i = s);
	            }
	        }
	        return i;
	    }

	    // Compute the value (size) of each node by summing the associated links.
	    function computeNodeValues() {
	        nodes.forEach(function (node) {
	            node.value = Math.max(d3_sum(node.sourceLinks, value), d3_sum(node.targetLinks, value));
	        });
	    }

	    // Iteratively assign the breadth (x-position) for each node.
	    // Nodes are assigned the maximum breadth of incoming neighbors plus one;
	    // nodes with no incoming links are assigned breadth zero, while
	    // nodes with no outgoing links are assigned the maximum breadth.
	    function computeNodeBreadths() {
	        var remainingNodes = nodes,
	            nextNodes,
	            x = 0;

	        while (remainingNodes.length) {
	            nextNodes = [];
	            remainingNodes.forEach(function (node) {
	                node.x = x;
	                node.dx = nodeWidth;
	                node.sourceLinks.forEach(function (link) {
	                    if (nextNodes.indexOf(link.target) < 0) {
	                        nextNodes.push(link.target);
	                    }
	                });
	            });
	            remainingNodes = nextNodes;
	            ++x;
	        }

	        //
	        moveSinksRight(x);
	        scaleNodeBreadths((size[0] - nodeWidth) / (x - 1));
	    }

	    function moveSinksRight(x) {
	        nodes.forEach(function (node) {
	            if (!node.sourceLinks.length) {
	                node.x = x - 1;
	            }
	        });
	    }

	    function scaleNodeBreadths(kx) {
	        nodes.forEach(function (node) {
	            node.x *= kx;
	        });
	    }

	    //d3 core
	    function d3_class(ctor, properties) {
	        if (Object.defineProperty) {
	            for (var key in properties) {
	                //TODO:d3这里不支持ie，要想办法解决
	                Object.defineProperty(ctor.prototype, key, {
	                    value: properties[key],
	                    enumerable: false
	                });
	            }
	        } else {
	            //ie解决方案
	            _.extend(ctor.prototype, properties);
	        }
	    }

	    var d3_nest = function d3_nest() {
	        var nest = {},
	            keys = [],
	            sortKeys = [],
	            sortValues,
	            rollup;

	        function map(mapType, array, depth) {
	            if (depth >= keys.length) return rollup ? rollup.call(nest, array) : sortValues ? array.sort(sortValues) : array;

	            var i = -1,
	                n = array.length,
	                key = keys[depth++],
	                keyValue,
	                object,
	                setter,
	                valuesByKey = new d3_Map(),
	                values;

	            while (++i < n) {
	                if (values = valuesByKey.get(keyValue = key(object = array[i]))) {
	                    values.push(object);
	                } else {
	                    valuesByKey.set(keyValue, [object]);
	                }
	            }

	            if (mapType) {
	                object = mapType();
	                setter = function setter(keyValue, values) {
	                    object.set(keyValue, map(mapType, values, depth));
	                };
	            } else {
	                object = {};
	                setter = function setter(keyValue, values) {
	                    object[keyValue] = map(mapType, values, depth);
	                };
	            }

	            valuesByKey.forEach(setter);
	            return object;
	        }

	        function entries(map, depth) {
	            if (depth >= keys.length) return map;

	            var array = [],
	                sortKey = sortKeys[depth++];

	            map.forEach(function (key, keyMap) {
	                array.push({
	                    key: key,
	                    values: entries(keyMap, depth)
	                });
	            });

	            return sortKey ? array.sort(function (a, b) {
	                return sortKey(a.key, b.key);
	            }) : array;
	        }

	        nest.map = function (array, mapType) {
	            return map(mapType, array, 0);
	        };

	        nest.entries = function (array) {
	            return entries(map(d3_map, array, 0), 0);
	        };

	        nest.key = function (d) {
	            keys.push(d);
	            return nest;
	        };

	        // Specifies the order for the most-recently specified key.
	        // Note: only applies to entries. Map keys are unordered!
	        nest.sortKeys = function (order) {
	            sortKeys[keys.length - 1] = order;
	            return nest;
	        };

	        // Specifies the order for leaf values.
	        // Applies to both maps and entries array.
	        nest.sortValues = function (order) {
	            sortValues = order;
	            return nest;
	        };

	        nest.rollup = function (f) {
	            rollup = f;
	            return nest;
	        };

	        return nest;
	    };

	    var d3_map = function d3_map(object, f) {
	        var map = new d3_Map();
	        if (object instanceof d3_Map) {
	            object.forEach(function (key, value) {
	                map.set(key, value);
	            });
	        } else if (Array.isArray(object)) {
	            var i = -1,
	                n = object.length,
	                o;
	            if (arguments.length === 1) while (++i < n) {
	                map.set(i, object[i]);
	            } else while (++i < n) {
	                map.set(f.call(object, o = object[i], i), o);
	            }
	        } else {
	            for (var key in object) {
	                map.set(key, object[key]);
	            }
	        }
	        return map;
	    };

	    function d3_Map() {
	        this._ = Object.create(null);
	    }

	    var d3_map_proto = "__proto__",
	        d3_map_zero = "\0";

	    d3_class(d3_Map, {
	        has: d3_map_has,
	        get: function get(key) {
	            return this._[d3_map_escape(key)];
	        },
	        set: function set(key, value) {
	            return this._[d3_map_escape(key)] = value;
	        },
	        remove: d3_map_remove,
	        keys: d3_map_keys,
	        values: function values() {
	            var values = [];
	            for (var key in this._) {
	                values.push(this._[key]);
	            }return values;
	        },
	        entries: function entries() {
	            var entries = [];
	            for (var key in this._) {
	                entries.push({
	                    key: d3_map_unescape(key),
	                    value: this._[key]
	                });
	            }return entries;
	        },
	        size: d3_map_size,
	        empty: d3_map_empty,
	        forEach: function forEach(f) {
	            for (var key in this._) {
	                f.call(this, d3_map_unescape(key), this._[key]);
	            }
	        }
	    });

	    function d3_map_escape(key) {
	        return (key += "") === d3_map_proto || key[0] === d3_map_zero ? d3_map_zero + key : key;
	    }

	    function d3_map_unescape(key) {
	        return (key += "")[0] === d3_map_zero ? key.slice(1) : key;
	    }

	    function d3_map_has(key) {
	        return d3_map_escape(key) in this._;
	    }

	    function d3_map_remove(key) {
	        return (key = d3_map_escape(key)) in this._ && delete this._[key];
	    }

	    function d3_map_keys() {
	        var keys = [];
	        for (var key in this._) {
	            keys.push(d3_map_unescape(key));
	        }return keys;
	    }

	    function d3_map_size() {
	        var size = 0;
	        for (var key in this._) {
	            ++size;
	        }return size;
	    }

	    function d3_map_empty() {
	        for (var key in this._) {
	            return false;
	        }return true;
	    }

	    function d3_ascending(a, b) {
	        return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
	    }

	    function computeNodeDepths(iterations) {
	        var nodesByBreadth = d3_nest().key(function (d) {
	            return d.x;
	        }).sortKeys(d3_ascending).entries(nodes).map(function (d) {
	            return d.values;
	        });

	        //
	        initializeNodeDepth();
	        resolveCollisions();
	        for (var alpha = 1; iterations > 0; --iterations) {
	            relaxRightToLeft(alpha *= .99);
	            resolveCollisions();
	            relaxLeftToRight(alpha);
	            resolveCollisions();
	        }

	        function initializeNodeDepth() {
	            var ky = d3_min(nodesByBreadth, function (nodes) {
	                return (size[1] - (nodes.length - 1) * nodePadding) / d3_sum(nodes, value);
	            });

	            nodesByBreadth.forEach(function (nodes) {
	                nodes.forEach(function (node, i) {
	                    node.y = i;
	                    node.dy = node.value * ky;
	                });
	            });

	            links.forEach(function (link) {
	                link.dy = link.value * ky;
	            });
	        }

	        function relaxLeftToRight(alpha) {
	            nodesByBreadth.forEach(function (nodes, breadth) {
	                nodes.forEach(function (node) {
	                    if (node.targetLinks.length) {
	                        var y = d3_sum(node.targetLinks, weightedSource) / d3_sum(node.targetLinks, value);
	                        node.y += (y - center(node)) * alpha;
	                    }
	                });
	            });

	            function weightedSource(link) {
	                return center(link.source) * link.value;
	            }
	        }

	        function relaxRightToLeft(alpha) {
	            nodesByBreadth.slice().reverse().forEach(function (nodes) {
	                nodes.forEach(function (node) {
	                    if (node.sourceLinks.length) {
	                        var y = d3_sum(node.sourceLinks, weightedTarget) / d3_sum(node.sourceLinks, value);
	                        node.y += (y - center(node)) * alpha;
	                    }
	                });
	            });

	            function weightedTarget(link) {
	                return center(link.target) * link.value;
	            }
	        }

	        function resolveCollisions() {
	            nodesByBreadth.forEach(function (nodes) {
	                var node,
	                    dy,
	                    y0 = 0,
	                    n = nodes.length,
	                    i;

	                // Push any overlapping nodes down.
	                nodes.sort(ascendingDepth);
	                for (i = 0; i < n; ++i) {
	                    node = nodes[i];
	                    dy = y0 - node.y;
	                    if (dy > 0) node.y += dy;
	                    y0 = node.y + node.dy + nodePadding;
	                }

	                // If the bottommost node goes outside the bounds, push it back up.
	                dy = y0 - nodePadding - size[1];
	                if (dy > 0) {
	                    y0 = node.y -= dy;

	                    // Push any overlapping nodes back up.
	                    for (i = n - 2; i >= 0; --i) {
	                        node = nodes[i];
	                        dy = node.y + node.dy + nodePadding - y0;
	                        if (dy > 0) node.y -= dy;
	                        y0 = node.y;
	                    }
	                }
	            });
	        }

	        function ascendingDepth(a, b) {
	            return a.y - b.y;
	        }
	    }

	    function computeLinkDepths() {
	        nodes.forEach(function (node) {
	            node.sourceLinks.sort(ascendingTargetDepth);
	            node.targetLinks.sort(ascendingSourceDepth);
	        });
	        nodes.forEach(function (node) {
	            var sy = 0,
	                ty = 0;
	            node.sourceLinks.forEach(function (link) {
	                link.sy = sy;
	                sy += link.dy;
	            });
	            node.targetLinks.forEach(function (link) {
	                link.ty = ty;
	                ty += link.dy;
	            });
	        });

	        function ascendingSourceDepth(a, b) {
	            return a.source.y - b.source.y;
	        }

	        function ascendingTargetDepth(a, b) {
	            return a.target.y - b.target.y;
	        }
	    }

	    function center(node) {
	        return node.y + node.dy / 2;
	    }

	    function value(link) {
	        return link.value;
	    }

	    return sankey;
	}

	/*
	* 太阳图
	*/

	var _$31 = canvax._;
	var Path$4 = canvax.Shapes.Path;
	var Rect$10 = canvax.Shapes.Rect;

	var sankeyGraphs = function (_GraphsBase) {
	    inherits$1(sankeyGraphs, _GraphsBase);

	    function sankeyGraphs(opt, root) {
	        classCallCheck$1(this, sankeyGraphs);

	        var _this = possibleConstructorReturn$1(this, (sankeyGraphs.__proto__ || Object.getPrototypeOf(sankeyGraphs)).call(this, opt, root));

	        _this.type = "sankey";

	        _this.keyField = null; //key, parent指向的值
	        _this.valueField = 'value';

	        //默认的情况下sankey图是在keyField中使用 a|b 来表示流向
	        //但是也可以keyField表示b 用parentField来表示a，和其他表示流向的图的数据格式保持一致
	        _this.parentField = null;

	        //坚持一个数据节点的设置都在一个node下面
	        _this.node = {
	            width: 18,
	            padding: 10,

	            fillStyle: null,
	            fillAlpha: 1,

	            blurAlpha: 0.4,
	            focus: {
	                enabled: true,
	                lineAlpha: 1
	            }

	        };

	        _this.line = {
	            strokeStyle: "blue",
	            lineWidth: 1,
	            lineAlpha: 1,

	            blurAlpha: 0.4,
	            focus: {
	                enabled: true,
	                lineAlpha: 1
	            }
	        };

	        _this.label = {
	            fontColor: "#666",
	            fontSize: 12,
	            align: "left", //left center right
	            verticalAlign: "middle", //top middle bottom
	            position: "right", //left,center right
	            offsetX: 0,
	            offsetY: 0
	        };

	        _$31.extend(true, _this, opt);

	        _this.init();
	        return _this;
	    }

	    createClass$1(sankeyGraphs, [{
	        key: "init",
	        value: function init() {
	            this.sprite = new canvax.Display.Sprite();
	            this._links = new canvax.Display.Sprite();
	            this._nodes = new canvax.Display.Sprite();
	            this._labels = new canvax.Display.Sprite();

	            this.sprite.addChild(this._links);
	            this.sprite.addChild(this._nodes);
	            this.sprite.addChild(this._labels);
	        }
	    }, {
	        key: "draw",
	        value: function draw(opt) {
	            !opt && (opt = {});
	            _$31.extend(true, this, opt);

	            this.data = this._trimGraphs();

	            this._widget();

	            this.sprite.context.x = this.origin.x;
	            this.sprite.context.y = this.origin.y;

	            this.fire("complete");
	        }
	    }, {
	        key: "_trimGraphs",
	        value: function _trimGraphs() {

	            var me = this;
	            var nodes = [];
	            var links = [];
	            var keyDatas = me.dataFrame.getFieldData(me.keyField);
	            var valueDatas = me.dataFrame.getFieldData(me.valueField);
	            var parentFields = me.dataFrame.getFieldData(me.parentField);

	            var nodeMap = {}; //name:ind
	            _$31.each(keyDatas, function (key, i) {
	                var nodeNames = [];
	                if (me.parentField) {
	                    nodeNames.push(parentFields[i]);
	                }                nodeNames = nodeNames.concat(key.split(/[,|]/));

	                _$31.each(nodeNames, function (name) {
	                    if (nodeMap[name] === undefined) {
	                        nodeMap[name] = nodes.length;
	                        nodes.push({
	                            name: name
	                        });
	                    }
	                });
	            });

	            _$31.each(keyDatas, function (key, i) {
	                //var nodeNames = key.split(/[,|]/);
	                var nodeNames = [];
	                if (me.parentField) {
	                    nodeNames.push(parentFields[i]);
	                }                nodeNames = nodeNames.concat(key.split(/[,|]/));

	                if (nodeNames.length == 2) {
	                    links.push({
	                        source: nodeMap[nodeNames[0]],
	                        target: nodeMap[nodeNames[1]],
	                        value: valueDatas[i]
	                    });
	                }
	            });

	            return sankeyLayout().nodeWidth(this.node.width).nodePadding(this.node.padding).size([this.width, this.height]).nodes(nodes).links(links).layout(16);
	        }
	    }, {
	        key: "_widget",
	        value: function _widget() {
	            this._drawNodes();
	            this._drawLinks();
	            this._drawLabels();
	        }
	    }, {
	        key: "_getColor",
	        value: function _getColor(style, node, ind) {
	            var me = this;
	            var color = style;
	            if (_$31.isArray(color)) {
	                color = color[ind];
	            }
	            if (_$31.isFunction(color)) {
	                color = color(node);
	            }
	            if (!color) {
	                color = me.root.getTheme(ind);
	            }
	            return color;
	        }
	    }, {
	        key: "_drawNodes",
	        value: function _drawNodes() {

	            var nodes = this.data.nodes();
	            var me = this;
	            _$31.each(nodes, function (node, i) {

	                var nodeColor = me._getColor(me.node.fillStyle, node, i);
	                var nodeEl = new Rect$10({
	                    xyToInt: false,
	                    context: {
	                        x: node.x,
	                        y: node.y,
	                        width: me.data.nodeWidth(),
	                        height: Math.max(node.dy, 1),
	                        fillStyle: nodeColor
	                    }
	                });
	                nodeEl.data = node;

	                me._nodes.addChild(nodeEl);
	            });
	        }
	    }, {
	        key: "_drawLinks",
	        value: function _drawLinks() {
	            var links = this.data.links();
	            var me = this;
	            _$31.each(links, function (link, i) {
	                var linkColor = me._getColor(me.line.strokeStyle, link, i);
	                var d = me.data.link()(link);

	                var path = new Path$4({
	                    xyToInt: false,
	                    context: {
	                        path: d,
	                        fillStyle: linkColor,
	                        //lineWidth: Math.max(1, link.dy),
	                        globalAlpha: 0.3,
	                        cursor: "pointer"
	                    }
	                });

	                path.link = link;
	                path.hover(function (e) {
	                    this.context.globalAlpha += 0.2;
	                }, function (e) {
	                    this.context.globalAlpha -= 0.2;
	                });

	                me._links.addChild(path);
	            });
	        }
	    }, {
	        key: "_drawLabels",
	        value: function _drawLabels() {

	            var nodes = this.data.nodes();
	            var me = this;
	            _$31.each(nodes, function (node) {
	                var align = me.label.align;

	                var x = node.x + me.data.nodeWidth() + 4;
	                /*
	                if( x > me.width/2 ){
	                    x  = node.x - 4;
	                    align = 'right';
	                } else {
	                    x += 4;
	                };
	                */
	                var y = node.y + Math.max(node.dy / 2, 1);

	                var label = new canvax.Display.Text(node.name, {
	                    context: {
	                        x: x,
	                        y: y,
	                        fillStyle: me.label.fontColor,
	                        fontSize: me.label.fontSize,
	                        textAlign: align,
	                        textBaseline: me.label.verticalAlign
	                    }
	                });
	                me._labels.addChild(label);

	                if (label.getTextWidth() + x > me.width) {
	                    label.context.x = node.x - 4;
	                    label.context.textAlign = 'right';
	                }            });
	        }
	    }]);
	    return sankeyGraphs;
	}(GraphsBase);

	var component = function (_Canvax$Event$EventDi) {
	    inherits$1(component, _Canvax$Event$EventDi);

	    function component(opt, data) {
	        classCallCheck$1(this, component);

	        var _this = possibleConstructorReturn$1(this, (component.__proto__ || Object.getPrototypeOf(component)).call(this, opt, data));

	        _this.enabled = false; //是否加载该组件
	        return _this;
	    }

	    createClass$1(component, [{
	        key: "init",
	        value: function init(opt, data) {}
	    }, {
	        key: "draw",
	        value: function draw() {}

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

	var Circle$10 = canvax.Shapes.Circle;
	var _$32 = canvax._;

	var Legend = function (_Component) {
	    inherits$1(Legend, _Component);

	    function Legend(data, opt, root) {
	        classCallCheck$1(this, Legend);

	        var _this = possibleConstructorReturn$1(this, (Legend.__proto__ || Object.getPrototypeOf(Legend)).call(this));

	        _this.root = root;
	        /* data的数据结构为
	        [
	            //descartes中用到的时候还会带入yAxis
	            {name: "uv", color: "#ff8533", field: '' ...如果手动传入数据只需要前面这三个 enabled: true, ind: 0, } //外部只需要传field和fillStyle就行了 activate是内部状态
	        ]
	        */

	        _this.data = data || [];

	        _this.width = 0;
	        _this.height = 0;

	        //一般来讲，比如柱状图折线图等，是按照传入的field来分组来设置图例的，那么legend.field都是null
	        //但是还有一种情况就是，是按照同一个field中的数据去重后来分组的，比如散点图中sex属性的男女两个分组作为图例，
	        //以及pie饼图中的每个数据的name字段都是作为一个图例
	        //那么就想要给legend主动设置一个field字段，然后legend自己从dataFrame中拿到这个field的数据来去重，然后分组做为图例
	        //这是一个很屌的设计
	        _this.field = null;

	        _this.icon = {
	            height: 30,
	            width: "auto",
	            shapeType: "circle",
	            radius: 5,
	            lineWidth: 1,
	            fillStyle: "#999",
	            onChecked: function onChecked() {},
	            onUnChecked: function onUnChecked() {}
	        };

	        _this.label = {
	            textAlign: "left",
	            textBaseline: "middle",
	            fillStyle: "#333", //obj.color
	            cursor: "pointer",
	            format: function format(name, info) {
	                return name;
	            }
	        };

	        //this.onChecked=function(){};
	        //this.onUnChecked=function(){};

	        _this._labelColor = "#999";

	        _this.position = "top"; //图例所在的方向top,right,bottom,left

	        _this.layoutType = "h"; //横向 top,bottom --> h left,right -- >v

	        _this.sprite = null;

	        if (opt) {
	            _$32.extend(true, _this, opt);
	        }
	        if (_this.position == "left" || _this.position == "right") {
	            _this.layoutType = 'v';
	        } else {
	            _this.layoutType = 'h';
	        }
	        _this.sprite = new canvax.Display.Sprite({
	            id: "LegendSprite"
	        });

	        _this._draw();
	        return _this;
	    }

	    createClass$1(Legend, [{
	        key: "pos",
	        value: function pos(_pos) {
	            _pos.x && (this.sprite.context.x = _pos.x + this.icon.radius);
	            _pos.y && (this.sprite.context.y = _pos.y);
	        }
	    }, {
	        key: "draw",
	        value: function draw() {
	            //图例组件运行开始运行的时候就需要计算好自己的高宽 所以早就在_draw中渲染好了， 
	            //组件统一调用draw的时候就不需要做任何处理了
	        }
	    }, {
	        key: "_draw",
	        value: function _draw() {
	            var me = this;

	            var viewWidth = this.root.width - this.root.padding.left - this.root.padding.right;
	            var viewHeight = this.root.height - this.root.padding.top - this.root.padding.bottom;

	            var maxItemWidth = 0;
	            var width = 0,
	                height = 0;
	            var x = 0,
	                y = 0;
	            var rows = 1;

	            _$32.each(this.data, function (obj, i) {

	                var _icon = new Circle$10({
	                    id: "legend_field_icon_" + i,
	                    context: {
	                        x: 0,
	                        y: me.icon.height / 3,
	                        fillStyle: !obj.enabled ? "#ccc" : obj.color || me._labelColor,
	                        r: me.icon.radius,
	                        cursor: "pointer"
	                    }
	                });

	                _icon.hover(function (e) {
	                    e.eventInfo = me._getInfoHandler(e, obj);
	                }, function (e) {
	                    delete e.eventInfo;
	                });
	                _icon.on("mousemove", function (e) {
	                    e.eventInfo = me._getInfoHandler(e, obj);
	                });
	                //阻止事件冒泡

	                _icon.on("click", function () {});

	                var txt = new canvax.Display.Text(me.label.format(obj.name, obj), {
	                    id: "legend_field_txt_" + i,
	                    context: {
	                        x: me.icon.radius + 3,
	                        y: me.icon.height / 3,
	                        textAlign: me.label.textAlign, //"left",
	                        textBaseline: me.label.textBaseline, //"middle",
	                        fillStyle: me.label.fillStyle, //"#333", //obj.color
	                        cursor: me.label.cursor //"pointer"
	                    }
	                });

	                txt.hover(function (e) {
	                    e.eventInfo = me._getInfoHandler(e, obj);
	                }, function (e) {
	                    delete e.eventInfo;
	                });
	                txt.on("mousemove", function (e) {
	                    e.eventInfo = me._getInfoHandler(e, obj);
	                });
	                txt.on("click", function () {});

	                var txtW = txt.getTextWidth();
	                var itemW = txtW + me.icon.radius * 2 + 20;

	                maxItemWidth = Math.max(maxItemWidth, itemW);

	                var spItemC = {
	                    height: me.icon.height
	                };

	                if (me.layoutType == "v") {
	                    if (y + me.icon.height > viewHeight) {
	                        x += maxItemWidth;
	                        y = 0;
	                    }
	                    spItemC.x = x;
	                    spItemC.y = y;
	                    y += me.icon.height;
	                    height = Math.max(height, y);
	                } else {
	                    if (x + itemW > viewWidth) {
	                        width = Math.max(width, x);
	                        x = 0;
	                        rows++;
	                    }                    spItemC.x = x;
	                    spItemC.y = me.icon.height * (rows - 1);
	                    x += itemW;
	                }                var sprite = new canvax.Display.Sprite({
	                    id: "legend_field_" + i,
	                    context: spItemC
	                });
	                sprite.addChild(_icon);
	                sprite.addChild(txt);

	                sprite.context.width = itemW;
	                me.sprite.addChild(sprite);

	                sprite.on("click", function (e) {

	                    //只有一个field的时候，不支持取消
	                    if (_$32.filter(me.data, function (obj) {
	                        return obj.enabled;
	                    }).length == 1) {
	                        if (obj.enabled) {
	                            return;
	                        }
	                    }
	                    obj.enabled = !obj.enabled;

	                    _icon.context.fillStyle = !obj.enabled ? "#ccc" : obj.color || me._labelColor;

	                    if (obj.enabled) {
	                        me.icon.onChecked(obj);
	                    } else {
	                        me.icon.onUnChecked(obj);
	                    }
	                });
	            });

	            if (this.layoutType == "h") {
	                me.width = me.sprite.context.width = width;
	                me.height = me.sprite.context.height = me.icon.height * rows;
	            } else {
	                me.width = me.sprite.context.width = x + maxItemWidth;
	                me.height = me.sprite.context.height = height;
	            }
	            //me.width = me.sprite.context.width  = width;
	            //me.height = me.sprite.context.height = height;
	        }
	    }, {
	        key: "_getInfoHandler",
	        value: function _getInfoHandler(e, data) {
	            return {
	                type: "legend",
	                //title : data.name,
	                nodes: [{
	                    name: data.name,
	                    fillStyle: data.color
	                }]
	            };
	        }
	    }], [{
	        key: "register",
	        value: function register(opt, app) {
	            //设置legendOpt
	            var legendOpt = _$32.extend(true, {
	                icon: {
	                    onChecked: function onChecked(obj) {
	                        app.show(obj.name, obj);
	                        app.componentsReset({ name: "legend" });
	                    },
	                    onUnChecked: function onUnChecked(obj) {
	                        app.hide(obj.name, obj);
	                        app.componentsReset({ name: "legend" });
	                    }
	                }
	            }, opt);

	            var legendData = opt.data;
	            if (legendData) {
	                _$32.each(legendData, function (item, i) {
	                    item.enabled = true;
	                    item.ind = i;
	                });
	                delete opt.data;
	            } else {
	                legendData = app.getLegendData();
	            }
	            //var _legend = new app.componentsMap.legend( legendData, legendOpt, this );
	            var _legend = new this(legendData, legendOpt, app);

	            if (_legend.layoutType == "h") {
	                app.padding[_legend.position] += _legend.height;
	            } else {
	                app.padding[_legend.position] += _legend.width;
	            }
	            if (app._coord && app._coord.type == 'rect') {
	                if (_legend.position == "top" || _legend.position == "bottom") {
	                    app.components.push({
	                        type: "once",
	                        plug: {
	                            draw: function draw() {
	                                _legend.pos({
	                                    x: app._coord.origin.x
	                                });
	                            }
	                        }
	                    });
	                }
	            }

	            //default right
	            var pos = {
	                x: app.width - app.padding.right,
	                y: app.padding.top
	            };
	            if (_legend.position == "left") {
	                pos.x = app.padding.left - _legend.width;
	            }            if (_legend.position == "top") {
	                pos.x = app.padding.left;
	                pos.y = app.padding.top - _legend.height;
	            }            if (_legend.position == "bottom") {
	                pos.x = app.padding.left;
	                pos.y = app.height - app.padding.bottom;
	            }
	            _legend.pos(pos);

	            app.components.push({
	                type: "legend",
	                plug: _legend
	            });

	            app.stage.addChild(_legend.sprite);
	        }
	    }]);
	    return Legend;
	}(component);

	var Line$7 = canvax.Shapes.Line;
	var Rect$11 = canvax.Shapes.Rect;
	var _$33 = canvax._;

	var dataZoom = function (_Component) {
	    inherits$1(dataZoom, _Component);

	    function dataZoom(opt, cloneChart) {
	        classCallCheck$1(this, dataZoom);

	        var _this = possibleConstructorReturn$1(this, (dataZoom.__proto__ || Object.getPrototypeOf(dataZoom)).call(this, opt, cloneChart));

	        _this._cloneChart = cloneChart;

	        //0-1
	        _this.range = {
	            start: 0,
	            end: null,
	            max: null, //可以外围控制智能在哪个区间拖动
	            min: 1 //最少至少选中了一个数据
	        };

	        _this.count = 1; //把w 均为为多少个区间， 同样多节点的line 和  bar， 这个count相差一
	        _this.dataLen = 1;
	        _this.layoutType = cloneChart.thumbChart._coord._xAxis.layoutType; //和line bar等得xAxis.layoutType 一一对应

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
	            eventEnabled: true,
	            fillStyle: '#000000',
	            alpha: 0.03
	        };

	        _this.w = 0;
	        _this.h = 26;

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

	        _this.disPart = {};
	        _this.barAddH = 8;
	        _this.barH = _this.h - _this.barAddH;
	        _this.barY = 0; //6 / 2;
	        _this.btnW = 8;
	        _this.btnFillStyle = _this.color;
	        _this._btnLeft = null;
	        _this._btnRight = null;
	        _this._underline = null;

	        _this.zoomBg = null;

	        opt && _$33.extend(true, _this, opt);
	        _this._computeAttrs(opt);

	        _this.sprite = new canvax.Display.Sprite({
	            id: "dataZoom",
	            context: {
	                x: _this.pos.x,
	                y: _this.pos.y
	            }
	        });
	        _this.sprite.noSkip = true;
	        _this.dataZoomBg = new canvax.Display.Sprite({
	            id: "dataZoomBg"
	        });
	        _this.dataZoomBtns = new canvax.Display.Sprite({
	            id: "dataZoomBtns"
	        });
	        _this.sprite.addChild(_this.dataZoomBg);
	        _this.sprite.addChild(_this.dataZoomBtns);

	        _this.widget();
	        _this._setLines();
	        _this.setZoomBg();
	        return _this;
	    }

	    //datazoom begin


	    createClass$1(dataZoom, [{
	        key: "draw",

	        //datazoom end


	        value: function draw() {
	            //这个组件可以在init的时候就绘制好
	        }
	    }, {
	        key: "destroy",
	        value: function destroy() {
	            this.sprite.destroy();
	        }
	    }, {
	        key: "reset",
	        value: function reset(opt, cloneChart) {

	            !opt && (opt = {});

	            var _preCount = this.count;
	            var _preStart = this.range.start;
	            var _preEnd = this.range.end;

	            opt && _$33.extend(true, this, opt);
	            this._cloneChart = cloneChart;
	            this._computeAttrs(opt);

	            if (_preCount != this.count || opt.range && (opt.range.start != _preStart || opt.range.end != _preEnd)) {
	                this.widget();
	                this._setLines();
	            }
	            this.setZoomBg();
	        }
	        //计算属性

	    }, {
	        key: "_computeAttrs",
	        value: function _computeAttrs(opt) {
	            var _cloneChart = this._cloneChart.thumbChart;

	            this.dataLen = _cloneChart._data.length - 1;
	            this.count = this.layoutType == "rule" ? this.dataLen - 1 : this.dataLen;

	            if (!this.range.max || this.range.max > this.count) {
	                this.range.max = this.count;
	            }
	            if (!this.range.end || this.range.end > this.dataLen - 1) {
	                this.range.end = this.dataLen - 1;
	            }

	            this.disPart = this._getDisPart();
	            this.barH = this.h - this.barAddH;
	        }
	    }, {
	        key: "_getRangeEnd",
	        value: function _getRangeEnd(end) {
	            if (end === undefined) {
	                end = this.range.end;
	            }
	            if (this.layoutType == "peak") {
	                end += 1;
	            }            return end;
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
	                    me._bgRect = new Rect$11({
	                        context: bgRectCtx
	                    });
	                    me.dataZoomBg.addChild(me._bgRect);
	                }
	            }

	            if (me.underline.enabled) {
	                var underlineCtx = {
	                    start: {
	                        x: me.range.start / me.count * me.w + me.btnW / 2,
	                        y: me.barY + me.barH
	                    },
	                    end: {
	                        x: me._getRangeEnd() / me.count * me.w - me.btnW / 2,
	                        y: me.barY + me.barH
	                    },
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
	                }            }

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
	                me._btnLeft = new Rect$11({
	                    id: 'btnLeft',
	                    dragEnabled: me.left.eventEnabled,
	                    context: btnLeftCtx
	                });
	                me._btnLeft.on("draging", function (e) {

	                    this.context.y = me.barY - me.barAddH / 2 + 1;
	                    if (this.context.x < 0) {
	                        this.context.x = 0;
	                    }                    if (this.context.x > me._btnRight.context.x - me.btnW - 2) {
	                        this.context.x = me._btnRight.context.x - me.btnW - 2;
	                    }                    if (me._btnRight.context.x + me.btnW - this.context.x > me.disPart.max) {
	                        this.context.x = me._btnRight.context.x + me.btnW - me.disPart.max;
	                    }
	                    if (me._btnRight.context.x + me.btnW - this.context.x < me.disPart.min) {
	                        this.context.x = me._btnRight.context.x + me.btnW - me.disPart.min;
	                    }
	                    me.rangeRect.context.width = me._btnRight.context.x - this.context.x - me.btnW;
	                    me.rangeRect.context.x = this.context.x + me.btnW;

	                    me._setRange();
	                });
	                me._btnLeft.on("dragend", function (e) {
	                    me.dragEnd(me.range);
	                });
	                this.dataZoomBtns.addChild(this._btnLeft);
	            }
	            var btnRightCtx = {
	                x: me._getRangeEnd() / me.count * me.w - me.btnW,
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
	                me._btnRight = new Rect$11({
	                    id: 'btnRight',
	                    dragEnabled: me.right.eventEnabled,
	                    context: btnRightCtx
	                });

	                me._btnRight.on("draging", function (e) {

	                    this.context.y = me.barY - me.barAddH / 2 + 1;
	                    if (this.context.x > me.w - me.btnW) {
	                        this.context.x = me.w - me.btnW;
	                    }                    if (this.context.x + me.btnW - me._btnLeft.context.x > me.disPart.max) {
	                        this.context.x = me.disPart.max - (me.btnW - me._btnLeft.context.x);
	                    }                    if (this.context.x + me.btnW - me._btnLeft.context.x < me.disPart.min) {
	                        this.context.x = me.disPart.min - me.btnW + me._btnLeft.context.x;
	                    }                    me.rangeRect.context.width = this.context.x - me._btnLeft.context.x - me.btnW;
	                    me._setRange();
	                });
	                me._btnRight.on("dragend", function (e) {

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
	                fillAlpha: me.center.alpha,
	                cursor: "move"
	            };
	            if (this.rangeRect) {
	                this.rangeRect.animate(rangeRectCtx, {
	                    onUpdate: setLines
	                });
	            } else {
	                //中间矩形拖拽区域
	                this.rangeRect = new Rect$11({
	                    id: 'btnCenter',
	                    dragEnabled: true,
	                    context: rangeRectCtx
	                });
	                this.rangeRect.on("draging", function (e) {

	                    this.context.y = me.barY + 1;
	                    if (this.context.x < me.btnW) {
	                        this.context.x = me.btnW;
	                    }                    if (this.context.x > me.w - this.context.width - me.btnW) {
	                        this.context.x = me.w - this.context.width - me.btnW;
	                    }                    me._btnLeft.context.x = this.context.x - me.btnW;
	                    me._btnRight.context.x = this.context.x + this.context.width;
	                    me._setRange("btnCenter");
	                });
	                this.rangeRect.on("dragend", function (e) {

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
	                }                this.dataZoomBtns.addChild(this.linesLeft);
	            }            if (!this.linesRight) {
	                this.linesRight = new canvax.Display.Sprite({ id: "linesRight" });
	                if (this.right.eventEnabled) {
	                    this._addLines({
	                        sprite: this.linesRight
	                    });
	                }                this.dataZoomBtns.addChild(this.linesRight);
	            }
	            if (!this.linesCenter) {
	                this.linesCenter = new canvax.Display.Sprite({ id: "linesCenter" });
	                this._addLines({
	                    count: 3,
	                    // dis    : 1,
	                    sprite: this.linesCenter,
	                    strokeStyle: this.btnFillStyle
	                });
	                this.dataZoomBtns.addChild(this.linesCenter);
	            }        }
	    }, {
	        key: "_getDisPart",
	        value: function _getDisPart() {
	            var me = this;
	            var min = Math.max(parseInt(me.range.min / 2 / me.count * me.w), 23);
	            //柱状图用得这种x轴布局，不需要 /2
	            if (this.layoutType == "peak") {
	                min = Math.max(parseInt(me.range.min / me.count * me.w), 23);
	            }
	            return {
	                min: min,
	                max: parseInt(me.range.max / me.count * me.w)
	            };
	        }
	    }, {
	        key: "_setRange",
	        value: function _setRange(trigger) {
	            var me = this;
	            var _end = me._getRangeEnd();
	            var _preDis = _end - me.range.start;

	            var start = me._btnLeft.context.x / me.w * me.count;
	            var end = (me._btnRight.context.x + me.btnW) / me.w * me.count;

	            if (this.layoutType == "peak") {
	                start = Math.round(start);
	                end = Math.round(end);
	            } else {
	                start = parseInt(start);
	                end = parseInt(end);
	            }

	            if (trigger == "btnCenter") {
	                //如果是拖动中间部分，那么要保持 end-start的总量一致
	                if (end - start != _preDis) {
	                    end = start + _preDis;
	                }
	            }
	            if (start != me.range.start || end != _end) {
	                me.range.start = start;
	                if (me.layoutType == "peak") {
	                    end -= 1;
	                }                me.range.end = end;

	                me.dragIng(me.range);
	            }
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
	                me._underline.context.start.x = linesLeft.context.x + me.btnW / 2;
	                me._underline.context.end.x = linesRight.context.x + me.btnW / 2;
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
	            var line = new Line$7({
	                id: o.id || '',
	                context: {
	                    x: o.x || 0,
	                    y: o.y || 0,
	                    start: {
	                        x: o.start ? o.start.x : 0,
	                        y: o.start ? o.start.y : 0
	                    },
	                    end: {
	                        x: o.end ? o.end.x : 0,
	                        y: o.end ? o.end.y : 6
	                    },
	                    lineWidth: o.lineWidth || 1,
	                    strokeStyle: o.strokeStyle || '#ffffff'
	                }
	            });
	            return line;
	        }
	    }, {
	        key: "setZoomBg",
	        value: function setZoomBg() {
	            //这里不是直接获取_graphs.sprite 而是获取 _graphs.core，切记切记

	            if (this.__graphssp) {
	                this.__graphssp.destroy();
	            }
	            var graphssp = this._cloneChart.thumbChart.graphsSprite;
	            var _coor = this._cloneChart.thumbChart._coord;

	            graphssp.id = graphssp.id + "_datazoomthumbChartbg";
	            graphssp.context.x = -_coor.origin.x; //0;

	            //TODO:这里为什么要 -2 的原因还没查出来。
	            graphssp.context.y = this.barY - 2; //this.barH + this.barY;
	            graphssp.context.scaleY = this.barH / _coor.height;
	            graphssp.context.scaleX = this.w / _coor.width;

	            this.dataZoomBg.addChild(graphssp, 0);

	            this.__graphssp = graphssp;

	            this._cloneChart.thumbChart.destroy();
	            this._cloneChart.cloneEl.parentNode.removeChild(this._cloneChart.cloneEl);
	        }
	    }], [{
	        key: "register",
	        value: function register(opt, app) {

	            var me = this;

	            //预设默认的opt.dataZoom
	            opt = _$33.extend({
	                h: 26
	            }, opt);

	            app.padding.bottom += opt.h;

	            //目前dataZoom是固定在bottom位置的
	            //_getDataZoomOpt中会矫正x
	            opt.pos = {
	                //x : 0, //x在_getDataZoomOpt中计算
	                y: app.height - app.padding.bottom
	            };

	            app.components.push({
	                type: "once",
	                plug: {
	                    draw: function draw() {
	                        //这个时候才能拿到_coord.width _coord.height等尺寸信息， 这个时候_coord也才绘制完成了
	                        var _dataZoom = new me(me._getDataZoomOpt(opt, app), me._getCloneChart(opt, app));
	                        app.components.push({
	                            type: "dataZoom",
	                            plug: _dataZoom
	                        });
	                        //app.graphsSprite.addChild( _dataZoom.sprite );
	                        app.stage.addChild(_dataZoom.sprite);
	                    }
	                }
	            });
	        }
	    }, {
	        key: "_getCloneChart",
	        value: function _getCloneChart(opt, app) {
	            var chartConstructor = app.constructor; //(barConstructor || Bar);
	            var cloneEl = app.el.cloneNode();
	            cloneEl.innerHTML = "";
	            cloneEl.id = app.el.id + "_currclone";
	            cloneEl.style.position = "absolute";
	            cloneEl.style.width = app.el.offsetWidth + "px";
	            cloneEl.style.height = app.el.offsetHeight + "px";
	            cloneEl.style.top = "10000px";
	            document.body.appendChild(cloneEl);

	            //var opt = _.extend(true, {}, me._opts);
	            //_.extend(true, opt, me.getCloneChart() );

	            //clone的chart只需要coord 和 graphs 配置就可以了
	            //因为画出来后也只需要拿graphs得sprite去贴图
	            var graphsOpt = [];
	            _$33.each(app._graphs, function (_g) {
	                var _field = _g.enabledField || _g.field;

	                if (_$33.flatten([_field]).length) {

	                    var _opts = _$33.extend(true, {}, _g._opts);

	                    _opts.field = _field;
	                    if (_g.type == "bar") {
	                        _$33.extend(true, _opts, {
	                            node: {
	                                fillStyle: "#ececec",
	                                radius: 0
	                            },
	                            animation: false,
	                            eventEnabled: false,
	                            label: {
	                                enabled: false
	                            }
	                        });
	                    }
	                    if (_g.type == "line") {
	                        _$33.extend(true, _opts, {
	                            line: {
	                                //lineWidth: 1,
	                                strokeStyle: "#ececec"
	                            },
	                            icon: {
	                                enabled: false
	                            },
	                            area: {
	                                alpha: 1,
	                                fillStyle: "#ececec"
	                            },
	                            animation: false,
	                            eventEnabled: false,
	                            label: {
	                                enabled: false
	                            }
	                        });
	                    }
	                    if (_g.type == "scat") {
	                        _$33.extend(true, _opts, {
	                            node: {
	                                fillStyle: "#ececec"
	                            }
	                        });
	                    }

	                    graphsOpt.push(_opts);
	                }
	            });
	            var opt = {
	                coord: app._opts.coord,
	                graphs: graphsOpt
	            };

	            if (opt.coord.horizontal) {
	                delete opt.coord.horizontal;
	            }
	            var thumbChart = new chartConstructor(cloneEl, app._data, opt, app.graphsMap, app.componentsMap);
	            thumbChart.draw();

	            return {
	                thumbChart: thumbChart,
	                cloneEl: cloneEl
	            };
	        }
	    }, {
	        key: "_getDataZoomOpt",
	        value: function _getDataZoomOpt(opt, app) {
	            //初始化 datazoom 模块
	            var dataZoomOpt = _$33.extend(true, {
	                w: app._coord.width,
	                pos: {
	                    x: app._coord.origin.x,
	                    y: 0 // opt中有传入  app._coord.origin.y + app._coord._xAxis.height
	                },
	                dragIng: function dragIng(range) {
	                    var trigger = {
	                        name: "dataZoom",
	                        left: app.dataFrame.range.start - range.start,
	                        right: range.end - app.dataFrame.range.end
	                    };

	                    _$33.extend(app.dataFrame.range, range);

	                    //不想要重新构造dataFrame，所以第一个参数为null
	                    app.resetData(null, trigger);
	                    app.fire("dataZoomDragIng");
	                },
	                dragEnd: function dragEnd(range) {
	                    app.updateChecked && app.updateChecked();
	                    app.fire("dataZoomDragEnd");
	                }
	            }, opt);

	            return dataZoomOpt;
	        }
	    }]);
	    return dataZoom;
	}(component);

	var BrokenLine$3 = canvax.Shapes.BrokenLine;
	var Sprite$1 = canvax.Display.Sprite;
	var Text$6 = canvax.Display.Text;
	var _$34 = canvax._;

	var MarkLine = function (_Component) {
	    inherits$1(MarkLine, _Component);

	    function MarkLine(opt, _yAxis) {
	        classCallCheck$1(this, MarkLine);

	        var _this = possibleConstructorReturn$1(this, (MarkLine.__proto__ || Object.getPrototypeOf(MarkLine)).call(this, opt, _yAxis));

	        _this._yAxis = _yAxis;
	        _this.w = 0;
	        _this.h = 0;
	        _this.field = null;
	        _this.origin = {
	            x: 0, y: 0
	        };

	        _this.markTo = null; //默认给所有字段都现实一条markline，有设置的话，配置给固定的几个 field 显示markline
	        _this.yVal = 0; //y 的值，可能是个function，均值计算就是个function

	        _this.line = {
	            y: 0,
	            list: [],
	            strokeStyle: '#999',
	            lineWidth: 1,
	            smooth: false,
	            lineType: 'dashed'
	        };

	        _this.label = {
	            enabled: false,
	            fillStyle: '#999999',
	            fontSize: 12,
	            text: null, //"markline",
	            lineType: 'dashed',
	            lineWidth: 1,
	            strokeStyle: "white",
	            format: null
	        };

	        _this._txt = null;
	        _this._line = null;

	        opt && _$34.extend(true, _this, opt);

	        _this.sprite = new Sprite$1();

	        _this.core = new Sprite$1({
	            context: {
	                x: _this.origin.x,
	                y: _this.origin.y
	            }
	        });

	        _this.sprite.addChild(_this.core);
	        return _this;
	    }

	    //markLine begin


	    createClass$1(MarkLine, [{
	        key: "_getYVal",

	        //markLine end

	        value: function _getYVal() {
	            var y = this.yVal;
	            if (_$34.isFunction(this.yVal)) {
	                y = this.yVal(this);
	            }
	            return y;
	        }
	    }, {
	        key: "_getYPos",
	        value: function _getYPos() {
	            return this._yAxis.getYposFromVal(this._getYVal());        }
	    }, {
	        key: "_getLabel",
	        value: function _getLabel() {
	            var str;
	            var yVal = this._getYVal();
	            if (_$34.isFunction(this.label.format)) {
	                str = this.label.format(yVal, this);
	            } else {
	                if (_$34.isString(this.label.text)) {
	                    str = this.label.text;
	                } else {
	                    str = yVal;
	                }            }            return str;
	        }
	    }, {
	        key: "draw",
	        value: function draw() {
	            var me = this;

	            var y = this._getYPos();

	            var line = new BrokenLine$3({ //线条
	                id: "line",
	                context: {
	                    y: y,
	                    pointList: me.line.list,
	                    strokeStyle: me.line.strokeStyle,
	                    lineWidth: me.line.lineWidth,
	                    lineType: me.line.lineType
	                }
	            });
	            me.core.addChild(line);
	            me._line = line;

	            if (me.label.enabled) {
	                var txt = new Text$6(me._getLabel(), { //文字
	                    context: me.label
	                });
	                this._txt = txt;
	                me.core.addChild(txt);

	                me._setTxtPos(y);
	            }

	            this.line.y = y;
	        }
	    }, {
	        key: "reset",
	        value: function reset(opt) {
	            opt && _$34.extend(true, this, opt);

	            var me = this;
	            var y = this._getYPos();

	            if (y != this.line.y) {
	                this._line.animate({
	                    y: y
	                }, {
	                    duration: 300,
	                    onUpdate: function onUpdate(obj) {
	                        if (me.label.enabled) {
	                            me._txt.resetText(me._getLabel());
	                            me._setTxtPos(obj.y);
	                            //me._txt.context.y = obj.y - me._txt.getTextHeight();
	                        }
	                    }
	                    //easing: 'Back.Out' //Tween.Easing.Elastic.InOut
	                });
	            }            this._line.context.strokeStyle = this.line.strokeStyle;

	            this.line.y = y;
	        }
	    }, {
	        key: "_setTxtPos",
	        value: function _setTxtPos(y) {
	            var me = this;
	            var txt = me._txt;
	            if (_$34.isNumber(me.label.x)) {
	                txt.context.x = me.label.x;
	            } else {
	                txt.context.x = this.w - txt.getTextWidth() - 5;
	            }
	            if (_$34.isNumber(me.label.y)) {
	                txt.context.y = me.label.y;
	            } else {
	                txt.context.y = y - txt.getTextHeight();
	            }
	        }
	    }], [{
	        key: "register",
	        value: function register(opt, app) {
	            var app = app;
	            var me = this;

	            if (!_$34.isArray(opt)) {
	                opt = [opt];
	            }
	            _$34.each(opt, function (ML) {
	                //如果markline有target配置，那么只现在target配置里的字段的 markline, 推荐
	                var field = ML.markTo;

	                if (field && _$34.indexOf(app.dataFrame.fields, field) == -1) {
	                    //如果配置的字段不存在，则不绘制
	                    return;
	                }

	                var _yAxis = app._coord._yAxis[0]; //默认为左边的y轴

	                if (field) {
	                    //如果有配置markTo就从me._coord._yAxis中找到这个markTo所属的yAxis对象
	                    _$34.each(app._coord._yAxis, function ($yAxis, yi) {
	                        var fs = _$34.flatten([$yAxis.field]);
	                        if (_$34.indexOf(fs, field) >= 0) {
	                            _yAxis = $yAxis;
	                        }
	                    });
	                }

	                if (ML.yAxisAlign) {
	                    //如果有配置yAxisAlign，就直接通过yAxisAlign找到对应的
	                    _yAxis = app._coord._yAxis[ML.yAxisAlign == "left" ? 0 : 1];
	                }

	                var y;
	                if (ML.y !== undefined && ML.y !== null) {
	                    y = Number(ML.y);
	                } else {
	                    //如果没有配置这个y的属性，就 自动计算出来均值
	                    //但是均值是自动计算的，比如datazoom在draging的时候
	                    y = function y() {
	                        var _fdata = app.dataFrame.getFieldData(field);
	                        var _count = 0;
	                        _$34.each(_fdata, function (val) {
	                            if (Number(val)) {
	                                _count += val;
	                            }
	                        });
	                        return _count / _fdata.length;
	                    };
	                }
	                if (!isNaN(y)) {
	                    //如果y是个function说明是均值，自动实时计算的，而且不会超过ydatasection的范围
	                    _yAxis.setWaterLine(y);
	                }
	                app.components.push({
	                    type: "once",
	                    plug: {
	                        draw: function draw() {

	                            var _fstyle = "#777";
	                            var fieldMap = app._coord.getFieldMapOf(field);
	                            if (fieldMap) {
	                                _fstyle = fieldMap.color;
	                            }                            var lineStrokeStyle = ML.line && ML.line.strokeStyle || _fstyle;
	                            var textFillStyle = ML.label && ML.label.fillStyle || _fstyle;

	                            me.creatOneMarkLine(app, ML, y, _yAxis, lineStrokeStyle, textFillStyle, field);
	                        }
	                    }
	                });
	            });
	        }
	    }, {
	        key: "creatOneMarkLine",
	        value: function creatOneMarkLine(app, ML, yVal, _yAxis, lineStrokeStyle, textFillStyle, field) {

	            var o = {
	                w: app._coord.width,
	                h: app._coord.height,
	                yVal: yVal,
	                origin: {
	                    x: app._coord.origin.x,
	                    y: app._coord.origin.y
	                },
	                line: {
	                    list: [[0, 0], [app._coord.width, 0]]
	                    //strokeStyle: lineStrokeStyle
	                },
	                label: {
	                    fillStyle: textFillStyle
	                },
	                field: field
	            };

	            if (lineStrokeStyle) {
	                o.line.strokeStyle = lineStrokeStyle;
	            }
	            var _markLine = new this(_$34.extend(true, ML, o), _yAxis);
	            app.components.push({
	                type: "markLine",
	                plug: _markLine
	            });
	            app.graphsSprite.addChild(_markLine.sprite);
	        }
	    }]);
	    return MarkLine;
	}(component);

	var _$35 = canvax._;
	var Rect$12 = canvax.Shapes.Rect;
	var Line$8 = canvax.Shapes.Line;

	var Tips = function (_Component) {
	    inherits$1(Tips, _Component);

	    function Tips(opt, app) {
	        classCallCheck$1(this, Tips);

	        var _this = possibleConstructorReturn$1(this, (Tips.__proto__ || Object.getPrototypeOf(Tips)).call(this));

	        _this.root = app;

	        _this.tipDomContainer = app.canvax.domView;
	        _this.cW = 0; //容器的width
	        _this.cH = 0; //容器的height

	        _this.dW = 0; //html的tips内容width
	        _this.dH = 0; //html的tips内容Height

	        _this.borderRadius = "5px"; //背景框的 圆角 

	        _this.sprite = null;
	        _this.content = null; //tips的详细内容

	        _this.fillStyle = "rgba(255,255,255,0.95)"; //"#000000";
	        _this.fontColor = "#999";
	        _this.strokeStyle = "#ccc";

	        _this.position = "right"; //在鼠标的左（右）边

	        _this._tipDom = null;

	        _this.offsetX = 10; //tips内容到鼠标位置的偏移量x
	        _this.offsetY = 10; //tips内容到鼠标位置的偏移量y

	        //所有调用tip的 event 上面 要附带有符合下面结构的eventInfo属性
	        //会deepExtend到this.indo上面来
	        _this.eventInfo = null;

	        _this.positionInRange = true; //false; //tip的浮层是否限定在画布区域
	        _this.enabled = true; //tips是默认显示的

	        _this.pointer = 'line'; //tips的指针,默认为直线，可选为：'line' | 'region'(柱状图中一般用region)
	        _this.pointerAnim = true;
	        _this._tipsPointer = null;

	        _$35.extend(true, _this, opt);
	        _this.sprite = new canvax.Display.Sprite({
	            id: "TipSprite"
	        });
	        var self = _this;
	        _this.sprite.on("destroy", function () {
	            self._tipDom = null;
	        });
	        return _this;
	    }

	    createClass$1(Tips, [{
	        key: "show",
	        value: function show(e) {

	            if (!this.enabled) return;

	            if (e.eventInfo) {
	                this.eventInfo = e.eventInfo;

	                var stage = e.target.getStage();
	                this.cW = stage.context.width;
	                this.cH = stage.context.height;

	                var content = this._setContent(e);
	                if (content) {
	                    this._setPosition(e);
	                    this.sprite.toFront();

	                    //比如散点图，没有hover到点的时候，也要显示，所有放到最下面
	                    //反之，如果只有hover到点的时候才显示point，那么就放这里
	                    //this._tipsPointerShow(e);
	                } else {
	                    this.hide();
	                }
	            }
	            this._tipsPointerShow(e);
	        }
	    }, {
	        key: "move",
	        value: function move(e) {
	            if (!this.enabled) return;

	            if (e.eventInfo) {
	                this.eventInfo = e.eventInfo;
	                var content = this._setContent(e);
	                if (content) {
	                    this._setPosition(e);

	                    //比如散点图，没有hover到点的时候，也要显示，所有放到最下面
	                    //反之，如果只有hover到点的时候才显示point，那么就放这里
	                    //this._tipsPointerMove(e)
	                } else {
	                    //move的时候hide的只有dialogTips, pointer不想要隐藏
	                    //this.hide();
	                    this._hideDialogTips();
	                }
	            }            this._tipsPointerMove(e);
	        }
	    }, {
	        key: "hide",
	        value: function hide() {
	            if (!this.enabled) return;
	            this._hideDialogTips();
	            this._tipsPointerHide();
	        }
	    }, {
	        key: "_hideDialogTips",
	        value: function _hideDialogTips() {
	            if (this.eventInfo) {
	                this.eventInfo = null;
	                this.sprite.removeAllChildren();
	                this._removeContent();
	            }        }

	        /**
	         *@pos {x:0,y:0}
	         */

	    }, {
	        key: "_setPosition",
	        value: function _setPosition(e) {
	            if (!this.enabled) return;
	            if (!this._tipDom) return;
	            var pos = e.pos || e.target.localToGlobal(e.point);
	            var x = this._checkX(pos.x + this.offsetX);
	            var y = this._checkY(pos.y + this.offsetY);

	            this._tipDom.style.cssText += ";visibility:visible;left:" + x + "px;top:" + y + "px;-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;";

	            if (this.position == "left") {
	                this._tipDom.style.left = this._checkX(pos.x - this.offsetX - this._tipDom.offsetWidth) + "px";
	            }        }

	        /**
	         *content相关-------------------------
	         */

	    }, {
	        key: "_creatTipDom",
	        value: function _creatTipDom(e) {
	            this._tipDom = document.createElement("div");
	            this._tipDom.className = "chart-tips";
	            this._tipDom.style.cssText += "；-moz-border-radius:" + this.borderRadius + "; -webkit-border-radius:" + this.borderRadius + "; border-radius:" + this.borderRadius + ";background:" + this.fillStyle + ";border:1px solid " + this.strokeStyle + ";visibility:hidden;position:absolute;enabled:inline-block;*enabled:inline;*zoom:1;padding:6px;color:" + this.fontColor + ";line-height:1.5";
	            this._tipDom.style.cssText += "; -moz-box-shadow:1px 1px 3px " + this.strokeStyle + "; -webkit-box-shadow:1px 1px 3px " + this.strokeStyle + "; box-shadow:1px 1px 3px " + this.strokeStyle + ";";
	            this._tipDom.style.cssText += "; border:none;white-space:nowrap;word-wrap:normal;";
	            this.tipDomContainer.appendChild(this._tipDom);
	        }
	    }, {
	        key: "_removeContent",
	        value: function _removeContent() {
	            if (!this._tipDom) return;
	            this.tipDomContainer.removeChild(this._tipDom);
	            this._tipDom = null;
	        }
	    }, {
	        key: "_setContent",
	        value: function _setContent(e) {
	            var tipxContent = this._getContent(e);
	            if (!tipxContent && tipxContent !== 0) {
	                return;
	            }
	            if (!this._tipDom) {
	                this._creatTipDom(e);
	            }
	            this._tipDom.innerHTML = tipxContent;
	            this.dW = this._tipDom.offsetWidth;
	            this.dH = this._tipDom.offsetHeight;

	            return tipxContent;
	        }
	    }, {
	        key: "_getContent",
	        value: function _getContent(e) {

	            var tipsContent;

	            if (this.content) {
	                tipsContent = _$35.isFunction(this.content) ? this.content(e.eventInfo) : this.content;
	            } else {
	                tipsContent = this._getDefaultContent(e.eventInfo);
	            }
	            return tipsContent;
	        }
	    }, {
	        key: "_getDefaultContent",
	        value: function _getDefaultContent(info) {
	            var str = "";
	            if (info.title !== undefined && info.title !== null && info.title !== "") {
	                str += "<div>" + info.title + "</div>";
	            }            _$35.each(info.nodes, function (node, i) {
	                if (!node.value && node.value !== 0) {
	                    return;
	                }                var style = node.color || node.fillStyle || node.strokeStyle;
	                var value = _typeof$1(node.value) == "object" ? JSON.stringify(node.value) : numAddSymbol(node.value);

	                str += "<div style='line-height:1.5'><span style='color:" + style + ";padding-right:8px;'>●</span>" + value + "</div>";
	            });
	            return str;
	        }

	        /*
	        _getDefaultContent_bak( info )
	        {
	              if( !info.nodes.length ){
	                return null;
	            };
	             var str  = "<table style='border:none'>";
	            var self = this;
	             if( info.title !== undefined && info.title !== null &&info.title !== "" ){
	                str += "<tr><td colspan='2'>"+ info.title +"</td></tr>"
	            };
	             _.each( info.nodes , function( node , i ){
	                if( node.value === undefined || node.value === null ){
	                    return;
	                };
	                 
	                str+= "<tr style='color:"+ (node.color || node.fillStyle || node.strokeStyle) +"'>";
	                
	                let tsStyle="style='border:none;white-space:nowrap;word-wrap:normal;'";
	                let label = node.label || node.field || node.name;
	                if( label ){
	                    label += "：";
	                } else {
	                    label = "";
	                };
	            
	                str+="<td "+tsStyle+">"+ label +"</td>";
	                str += "<td "+tsStyle+">"+ (typeof node.value == "object" ? JSON.stringify(node.value) : numAddSymbol(node.value)) +"</td></tr>";
	            });
	            str+="</table>";
	            return str;
	        }
	        */

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
	    }, {
	        key: "_tipsPointerShow",
	        value: function _tipsPointerShow(e) {
	            var _coord = this.root._coord;

	            //目前只实现了直角坐标系的tipsPointer
	            if (!_coord || _coord.type != 'rect') return;

	            if (!this.pointer) return;

	            var el = this._tipsPointer;
	            var y = _coord.origin.y - _coord.height;
	            var x = 0;
	            if (this.pointer == "line") {
	                x = _coord.origin.x + e.eventInfo.xAxis.x;
	            }
	            if (this.pointer == "region") {
	                x = _coord.origin.x + e.eventInfo.xAxis.x - _coord._xAxis.ceilWidth / 2;
	                if (e.eventInfo.xAxis.ind < 0) {
	                    //当没有任何数据的时候， e.eventInfo.xAxis.ind==-1
	                    x = _coord.origin.x;
	                }
	            }

	            if (!el) {
	                if (this.pointer == "line") {
	                    el = new Line$8({
	                        //xyToInt : false,
	                        context: {
	                            x: x,
	                            y: y,
	                            start: {
	                                x: 0,
	                                y: 0
	                            },
	                            end: {
	                                x: 0,
	                                y: _coord.height
	                            },
	                            lineWidth: 1,
	                            strokeStyle: "#cccccc"
	                        }
	                    });
	                }                if (this.pointer == "region") {
	                    el = new Rect$12({
	                        //xyToInt : false,
	                        context: {
	                            width: _coord._xAxis.ceilWidth,
	                            height: _coord.height,
	                            x: x,
	                            y: y,
	                            fillStyle: "#cccccc",
	                            globalAlpha: 0.3
	                        }
	                    });
	                }
	                this.root.graphsSprite.addChild(el, 0);
	                this._tipsPointer = el;
	            } else {
	                if (this.pointerAnim && _coord._xAxis.layoutType != "proportion") {
	                    if (el.__animation) {
	                        el.__animation.stop();
	                    }                    el.__animation = el.animate({
	                        x: x,
	                        y: y
	                    }, {
	                        duration: 200
	                    });
	                } else {
	                    el.context.x = x;
	                    el.context.y = y;
	                }
	            }
	        }
	    }, {
	        key: "_tipsPointerHide",
	        value: function _tipsPointerHide() {
	            var _coord = this.root._coord;
	            //目前只实现了直角坐标系的tipsPointer
	            if (!_coord || _coord.type != 'rect') return;

	            if (!this.pointer || !this._tipsPointer) return;
	            //console.log("hide");
	            this._tipsPointer.destroy();
	            this._tipsPointer = null;
	        }
	    }, {
	        key: "_tipsPointerMove",
	        value: function _tipsPointerMove(e) {

	            var _coord = this.root._coord;

	            //目前只实现了直角坐标系的tipsPointer
	            if (!_coord || _coord.type != 'rect') return;

	            if (!this.pointer || !this._tipsPointer) return;

	            //console.log("move");

	            var el = this._tipsPointer;
	            var x = _coord.origin.x + e.eventInfo.xAxis.x;
	            if (this.pointer == "region") {
	                x = _coord.origin.x + e.eventInfo.xAxis.x - _coord._xAxis.ceilWidth / 2;
	                if (e.eventInfo.xAxis.ind < 0) {
	                    //当没有任何数据的时候， e.eventInfo.xAxis.ind==-1
	                    x = _coord.origin.x;
	                }
	            }            var y = _coord.origin.y - _coord.height;

	            if (x == el.__targetX) {
	                return;
	            }
	            if (this.pointerAnim && _coord._xAxis.layoutType != "proportion") {
	                if (el.__animation) {
	                    el.__animation.stop();
	                }                el.__targetX = x;
	                el.__animation = el.animate({
	                    x: x,
	                    y: y
	                }, {
	                    duration: 200,
	                    onComplete: function onComplete() {
	                        delete el.__targetX;
	                        delete el.__animation;
	                    }
	                });
	            } else {
	                el.context.x = x;
	                el.context.y = y;
	            }
	        }
	    }], [{
	        key: "register",
	        value: function register(opt, app) {
	            //所有的tips放在一个单独的tips中
	            var _tips = new this(opt, app);
	            app.stage.addChild(_tips.sprite);
	            app.components.push({
	                type: "tips",
	                id: "tips",
	                plug: _tips
	            });
	        }
	    }]);
	    return Tips;
	}(component);

	var Line$9 = canvax.Shapes.Line;
	var _$36 = canvax._;

	var barTgi = function (_Component) {
	    inherits$1(barTgi, _Component);

	    function barTgi(opt, root) {
	        classCallCheck$1(this, barTgi);

	        var _this = possibleConstructorReturn$1(this, (barTgi.__proto__ || Object.getPrototypeOf(barTgi)).call(this));

	        _this._opt = opt;
	        _this.root = root;

	        _this.field = null;
	        _this.barField = null;

	        _this.data = null;
	        _this.barDatas = null;
	        _this._yAxis = null;

	        _this.yAxisAlign = "left";

	        _this.sprite = null;

	        _this.standardVal = 100;
	        _this.origin = {
	            x: 0,
	            y: 0
	        };
	        _this.line = {
	            lineWidth: 3,
	            strokeStyle: function strokeStyle(val, i) {
	                if (val >= this.standardVal) {
	                    return "#43cbb5";
	                } else {
	                    return "#ff6060";
	                }
	            }
	        };

	        _$36.extend(true, _this, opt);

	        _this._yAxis = _this.root._coord._yAxis[_this.yAxisAlign == "left" ? 0 : 1];
	        _this.sprite = new canvax.Display.Sprite({
	            id: "barTgiSprite",
	            context: {
	                x: _this.origin.x,
	                y: _this.origin.y
	            }
	        });
	        return _this;
	    }

	    createClass$1(barTgi, [{
	        key: "reset",
	        value: function reset(opt) {
	            _$36.extend(true, this, opt);
	            this.barDatas = null;
	            this.data = null;
	            this.sprite.removeAllChildren();
	            this.draw();
	        }
	    }, {
	        key: "draw",
	        value: function draw() {
	            var me = this;

	            _$36.each(me.root._graphs, function (_g) {
	                if (_g.type == "bar" && _g.data[me.barField]) {
	                    me.barDatas = _g.data[me.barField];
	                    return false;
	                }
	            });
	            this.data = _$36.flatten(me.root.dataFrame.getDataOrg(me.field));

	            if (!this.barDatas) {
	                return;
	            }

	            _$36.each(this.data, function (tgi, i) {
	                var y = me._yAxis.getYposFromVal(tgi);
	                var barData = me.barDatas[i];

	                var _tgiLine = new Line$9({
	                    context: {
	                        start: {
	                            x: barData.x,
	                            y: y
	                        },
	                        end: {
	                            x: barData.x + barData.width,
	                            y: y
	                        },
	                        lineWidth: 2,
	                        strokeStyle: me._getProp(me.line.strokeStyle, tgi, i)
	                    }
	                });
	                me.sprite.addChild(_tgiLine);
	            });
	        }
	    }, {
	        key: "_getProp",
	        value: function _getProp(val, tgi, i) {
	            var res = val;
	            if (_$36.isFunction(val)) {
	                res = val.apply(this, [tgi, i]);
	            }
	            return res;
	        }
	    }], [{
	        key: "register",
	        value: function register(opt, app) {

	            if (!_$36.isArray(opt)) {
	                opt = [opt];
	            }
	            var barTgiConstructor = this;

	            _$36.each(opt, function (barTgiOpt, i) {
	                app.components.push({
	                    type: "once",
	                    plug: {
	                        draw: function draw() {

	                            barTgiOpt = _$36.extend(true, {
	                                origin: {
	                                    x: app._coord.origin.x,
	                                    y: app._coord.origin.y
	                                }
	                            }, barTgiOpt);

	                            var _barTgi = new barTgiConstructor(barTgiOpt, app);
	                            app.components.push({
	                                type: "barTgi",
	                                plug: _barTgi
	                            });
	                            app.graphsSprite.addChild(_barTgi.sprite);
	                        }
	                    }
	                });
	            });
	        }
	    }]);
	    return barTgi;
	}(component);

	/**
	 * 皮肤组件，不是一个具体的ui组件
	 */

	var themeComponent = function () {
	    function themeComponent(theme, root) {
	        classCallCheck$1(this, themeComponent);

	        this._root = root;
	        this.colors = theme || [];
	    }

	    createClass$1(themeComponent, [{
	        key: "set",
	        value: function set$$1(colors) {
	            this.colors = colors;
	            return this.colors;
	        }
	    }, {
	        key: "get",
	        value: function get$$1(ind) {
	            return this.colors;
	        }
	    }, {
	        key: "mergeTo",
	        value: function mergeTo(colors) {
	            if (!colors) {
	                colors = [];
	            }            for (var i = 0, l = this.colors.length; i < l; i++) {
	                if (colors[i]) {
	                    colors[i] = this.colors[i];
	                } else {
	                    colors.push(this.colors[i]);
	                }
	            }
	            return colors;
	        }
	    }]);
	    return themeComponent;
	}();

	/**
	 * 水印组件
	 */

	var Text$7 = canvax.Display.Text;
	var _$37 = canvax._;

	var waterMark = function () {
	    function waterMark(opt, root) {
	        classCallCheck$1(this, waterMark);

	        this.root = root;
	        this.width = root.width;
	        this.height = root.height;

	        this.text = "chartx";
	        this.fontSize = 20;
	        this.fontColor = "#ccc";
	        this.strokeStyle = "#ccc";
	        this.lineWidth = 0;
	        this.alpha = 0.2;
	        this.rotation = 45;

	        _$37.extend(true, this, opt);

	        this.spripte = new canvax.Display.Sprite({
	            id: "watermark"
	        });
	        this.draw();
	    }

	    createClass$1(waterMark, [{
	        key: "draw",
	        value: function draw() {

	            var textEl = new canvax.Display.Text(this.text, {
	                context: {
	                    fontSize: this.fontSize,
	                    fillStyle: this.fontColor
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
	                    var _textEl = new canvax.Display.Text(this.text, {
	                        context: {
	                            rotation: this.rotation,
	                            fontSize: this.fontSize,
	                            strokeStyle: this.strokeStyle,
	                            lineWidth: this.lineWidth,
	                            fillStyle: this.fontColor,
	                            globalAlpha: this.alpha
	                        }
	                    });
	                    _textEl.context.x = textW * 1.5 * c + textW * .25;
	                    _textEl.context.y = textH * 5 * r;
	                    this.spripte.addChild(_textEl);
	                }
	            }
	        }
	    }], [{
	        key: "register",
	        value: function register(opt, app) {
	            var _water = new this(opt, app);
	            app.stage.addChild(_water.spripte);
	        }
	    }]);
	    return waterMark;
	}();

	var Line$10 = canvax.Shapes.Line;
	var Sprite$2 = canvax.Display.Sprite;
	var Text$8 = canvax.Display.Text;
	var _$38 = canvax._;

	var MarkLine$1 = function (_Component) {
	    inherits$1(MarkLine, _Component);

	    function MarkLine(opt, root) {
	        classCallCheck$1(this, MarkLine);

	        var _this = possibleConstructorReturn$1(this, (MarkLine.__proto__ || Object.getPrototypeOf(MarkLine)).call(this, opt));

	        _this.root = root;

	        _this.width = opt.width || 0;
	        _this.height = opt.height || 0;

	        //x,y都是准心的 x轴方向和y方向的 value值，不是真实的px，需要
	        _this.x = null, _this.y = null;

	        //准心的位置
	        _this.aimPoint = {
	            x: _this.width / 2,
	            y: _this.height / 2
	        };

	        //圆点，对应着坐标系统的原点
	        _this.origin = {
	            x: 0, y: 0
	        };

	        _this.line = {
	            y: 0,
	            strokeStyle: '#cccccc',
	            lineWidth: 1,
	            smooth: false,
	            lineType: 'solid'
	        };

	        //待开发
	        _this.node = {
	            enabled: false,
	            shapeType: "circle",
	            radius: 1,
	            fillStyle: "#999"
	        };

	        //待开发
	        _this.label = {
	            enabled: false,
	            fillStyle: '#999999',
	            fontSize: 12,
	            value: null,
	            lineType: 'dashed',
	            lineWidth: 1,
	            strokeStyle: "white"
	        };

	        _this._txt = null;
	        _this._node = null;
	        _this._hLine = null; //横向的线
	        _this._vLine = null; //竖向的线

	        opt && _$38.extend(true, _this, opt);

	        _this.sprite = new Sprite$2({
	            id: "cross_" + canvax.utils.getUID(),
	            context: {
	                x: _this.origin.x,
	                y: _this.origin.y
	            }
	        });
	        return _this;
	    }

	    //rect cross begin


	    createClass$1(MarkLine, [{
	        key: "draw",
	        value: function draw() {
	            var me = this;
	            var aimPoint = me.aimPoint;

	            me._hLine = new Line$10({ //横向线条
	                context: {
	                    start: {
	                        x: 0,
	                        y: -aimPoint.y
	                    },
	                    end: {
	                        x: me.width,
	                        y: -aimPoint.y
	                    },
	                    strokeStyle: me.line.strokeStyle,
	                    lineWidth: me.line.lineWidth,
	                    lineType: me.line.lineType
	                }
	            });
	            me.sprite.addChild(me._hLine);

	            me._vLine = new Line$10({ //线条
	                context: {
	                    start: {
	                        x: aimPoint.x,
	                        y: 0
	                    },
	                    end: {
	                        x: aimPoint.x,
	                        y: -me.height
	                    },
	                    strokeStyle: me.line.strokeStyle,
	                    lineWidth: me.line.lineWidth,
	                    lineType: me.line.lineType
	                }
	            });
	            me.sprite.addChild(me._vLine);
	        }
	    }], [{
	        key: "register",
	        value: function register(opt, app) {
	            //原则上一个直角坐标系中最佳只设置一个cross
	            var me = this;
	            if (!_$38.isArray(opt)) {
	                opt = [opt];
	            }            _$38.each(opt, function (cross, i) {
	                app.components.push({
	                    type: "once",
	                    plug: {
	                        draw: function draw() {

	                            var opt = _$38.extend(true, {
	                                origin: {
	                                    x: app._coord.origin.x,
	                                    y: app._coord.origin.y
	                                },
	                                width: app._coord.width,
	                                height: app._coord.height
	                            }, cross);

	                            var _cross = new me(opt, app);
	                            app.components.push({
	                                type: "cross" + i,
	                                plug: _cross
	                            });
	                            app.graphsSprite.addChild(_cross.sprite);
	                        }
	                    }
	                });
	            });
	        }
	    }]);
	    return MarkLine;
	}(component);

	var coord = {
	    rect: Rect$3,
	    polar: Polar
	};

	var graphs = {
	    bar: BarGraphs,
	    line: LineGraphs,
	    scat: ScatGraphs,
	    pie: PieGraphs,
	    radar: RadarGraphs,
	    cloud: CloudGraphs,
	    planet: PlanetGraphs,
	    funnel: FunnelGraphs,
	    venn: VennGraphs,
	    sunburst: sunburstGraphs,
	    sankey: sankeyGraphs
	};

	var components = {
	    theme: themeComponent,
	    legend: Legend,
	    dataZoom: dataZoom,
	    markLine: MarkLine,
	    tips: Tips,
	    barTgi: barTgi,
	    waterMark: waterMark,
	    cross: MarkLine$1

	    //皮肤设定begin ---------------
	    //如果数据库中有项目皮肤
	};var projectTheme = []; //从数据库中查询出来设计师设置的项目皮肤
	if (projectTheme && projectTheme.length) {
	    theme.set(projectTheme);
	}//皮肤设定end -----------------


	var chartx = {
	    canvax: canvax,
	    create: function create(el, _data, _opt) {
	        var chart = null;
	        var me = this;

	        var data = canvax._.clone(_data);
	        var opt = canvax._.extend(true, {}, _opt);

	        //这个el如果之前有绘制过图表，那么就要在instances中找到图表实例，然后销毁
	        var chart_id = canvax.$.query(el).getAttribute("chart_id");
	        if (chart_id != undefined) {
	            var _chart = me.instances[chart_id];
	            if (_chart) {
	                _chart.destroy();
	            }            delete me.instances[chart_id];
	        }
	        var Coord$$1 = Coord;
	        if (opt.coord && opt.coord.type) {
	            Coord$$1 = coord[opt.coord.type];
	        }        //try {
	        chart = new Coord$$1(el, data, opt, graphs, components);
	        if (chart) {
	            chart.draw();

	            me.instances[chart.id] = chart;
	            chart.on("destroy", function () {
	                me.instances[chart.id] = null;
	                delete me.instances[chart.id];
	            });
	        }        //} catch(err){
	        //    throw "Chatx Error：" + err
	        //};
	        return chart;
	    },
	    options: {}
	};

	for (var p in global$1) {
	    chartx[p] = global$1[p];
	}

	return chartx;

}());
