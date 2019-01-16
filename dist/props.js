var chartxProps = (function () {
  'use strict';

  //坐标系组件
  let aa = class aa{};

  var _ = {};
  var breaker = {};
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;


  // Create quick reference variables for speed access to core prototypes.
  var
    push = ArrayProto.push,
    slice = ArrayProto.slice,
    concat = ArrayProto.concat,
    toString = ObjProto.toString,
    hasOwnProperty = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var 
    nativeForEach = ArrayProto.forEach,
    nativeMap = ArrayProto.map,
    nativeFilter = ArrayProto.filter,
    nativeEvery = ArrayProto.every,
    nativeSome = ArrayProto.some,
    nativeIndexOf = ArrayProto.indexOf,
    nativeIsArray = Array.isArray,
    nativeKeys = Object.keys,
    nativeBind = FuncProto.bind;


  var shallowProperty = function (key) {
    return function (obj) {
      return obj == null ? void 0 : obj[key];
    };
  };
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = shallowProperty('length');
  var isArrayLike = function (collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };



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
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
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

  //if (!_.isArguments(arguments)) {
  _.isArguments = function (obj) {
    return !!(obj && _.has(obj, 'callee'));
  };
  //}

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
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
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
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  _.isWindow = function (obj) {
    return obj != null && obj == obj.window;
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function (input, shallow, output) {
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






  // Return the minimum element (or element-based computation).
  _.min = function (obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
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
  _.max = function (obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = { computed: -Infinity, value: -Infinity };
    each(obj, function (value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed > result.computed && (result = { value: value, computed: computed });
    });
    return result.value;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function (obj, iterator, context) {
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
  var any = _.some = _.any = function (obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function (value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };
  // Return a version of the array that does not contain the specified value(s).
  _.without = function (array) {
    return _.difference(array, slice.call(arguments, 1));
  };
  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function (array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function (value) { return !_.contains(rest, value); });
  };
  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function (array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function (value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };
  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function (obj, iterator, context) {
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
  _.contains = _.include = function (obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function (value) {
      return value === target;
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function (obj, key) {
    return _.map(obj, function (value) { return value[key]; });
  };

  // Return a random integer between min and max (inclusive).
  _.random = function (min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // Shuffle a collection.
  _.shuffle = function (obj) {
    return _.sample(obj, Infinity);
  };

  _.sample = function (obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    var sample = isArrayLike(obj) ? _.clone(obj) : _.values(obj);
    var length = getLength(sample);
    n = Math.max(Math.min(n, length), 0);
    var last = length - 1;
    for (var index = 0; index < n; index++) {
      var rand = _.random(index, last);
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
  _.extend = function () {
    var options, name, src, copy,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false;
    if (typeof target === "boolean") {
      deep = target;
      target = arguments[1] || {};
      i = 2;
    }  if (typeof target !== "object" && !_.isFunction(target)) {
      target = {};
    }  if (length === i) {
      target = this;
      --i;
    }  for (; i < length; i++) {
      if ((options = arguments[i]) != null) {
        for (name in options) {
          src = target[name];
          copy = options[name];
          if (target === copy) {
            continue;
          }
          //if( deep && copy && _.isObject( copy ) &&  && !_.isArray( copy ) && !_.isFunction( copy ) ){
          if (deep && copy && _.isObject(copy) && copy.constructor === Object) {
            target[name] = _.extend(deep, src, copy);
          } else {
            target[name] = copy;
          }      }
      }
    }
    return target;
  };

  _.clone = function (obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend(true, {}, obj);
  };

  //********补存一些数学常用方法,暂放在这里文件下,后期多了单独成立一个类库  */
  // compute euclidian modulo of m % n
  // https://en.wikipedia.org/wiki/Modulo_operation
  _.euclideanModulo = (n, m) => {
    return ((n % m) + m) % m;
  };

  _.DEG2RAD = Math.PI / 180;
  _.RAD2DEG = 180 / Math.PI;

  _.degToRad = (degrees) => {
    return degrees * _.DEG2RAD;
  };

  _.radToDeg = (radians) => {
    return radians * _.RAD2DEG;
  };

  //TODO 所有的get xxx OfVal 在非proportion下面如果数据有相同的情况，就会有风险

  /**
  * 把原始的数据
  * field1 field2 field3
  *   1      2      3
  *   2      3      4
  * 这样的数据格式转换为内部的
  * [{field:'field1',index:0,data:[1,2]} ......]
  * 这样的结构化数据格式。
  */

  const RESOLUTION =  typeof (window) !== 'undefined' ? window.devicePixelRatio : 1;

  var addOrRmoveEventHand = function( domHand , ieHand ){
      if( document[ domHand ] ){
          function eventDomFn( el , type , fn ){
              if( el.length ){
                  for(var i=0 ; i < el.length ; i++){
                      eventDomFn( el[i] , type , fn );
                  }
              } else {
                  el[ domHand ]( type , fn , false );
              }
          }        return eventDomFn
      } else {
          function eventFn( el , type , fn ){
              if( el.length ){
                  for(var i=0 ; i < el.length ; i++){
                      eventFn( el[i],type,fn );
                  }
              } else {
                  el[ ieHand ]( "on"+type , function(){
                      return fn.call( el , window.event );
                  });
              }
          }        return eventFn
      }
  };

  var $ = {
      // dom操作相关代码
      query : function(el){
          if(_.isString(el)){
             return document.getElementById(el)
          }
          if(el.nodeType == 1){
             //则为一个element本身
             return el
          }
          if(el.length){
             return el[0]
          }
          return null;
      },
      offset : function(el){
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
              zoom = (bound.right - bound.left)/body.clientWidth; 
          } 
          if (zoom > 1){ 
              clientTop = 0; 
              clientLeft = 0; 
          } 
          var top = box.top/zoom + (window.pageYOffset || docElem && docElem.scrollTop/zoom || body.scrollTop/zoom) - clientTop, 
              left = box.left/zoom + (window.pageXOffset|| docElem && docElem.scrollLeft/zoom || body.scrollLeft/zoom) - clientLeft; 

          return { 
              top: top, 
              left: left 
          }; 
      },
      addEvent : addOrRmoveEventHand( "addEventListener" , "attachEvent" ),
      removeEvent : addOrRmoveEventHand( "removeEventListener" , "detachEvent" ),
      pageX: function(e) {
          if (e.pageX) return e.pageX;
          else if (e.clientX)
              return e.clientX + (document.documentElement.scrollLeft ?
                      document.documentElement.scrollLeft : document.body.scrollLeft);
          else return null;
      },
      pageY: function(e) {
          if (e.pageY) return e.pageY;
          else if (e.clientY)
              return e.clientY + (document.documentElement.scrollTop ?
                      document.documentElement.scrollTop : document.body.scrollTop);
          else return null;
      },
      /**
       * 创建dom
       * @param {string} id dom id 待用
       * @param {string} type : dom type， such as canvas, div etc.
       */
      createCanvas : function( _width , _height , id) {
          var canvas = document.createElement("canvas");
          canvas.style.position = 'absolute';
          canvas.style.width  = _width + 'px';
          canvas.style.height = _height + 'px';
          canvas.style.left   = 0;
          canvas.style.top    = 0;
          canvas.setAttribute('width', _width * RESOLUTION);
          canvas.setAttribute('height', _height * RESOLUTION);
          canvas.setAttribute('id', id);
          return canvas;
      },
      createView: function(_width , _height, id){
          var view = document.createElement("div");
          view.className = "canvax-view";
          view.style.cssText += "position:relative;width:100%;height:100%;";

          var stageView = document.createElement("div");
          stageView.style.cssText += "position:absolute;width:" + _width + "px;height:" + _height +"px;";

          //用来存放一些dom元素
          var domView = document.createElement("div");
          domView.style.cssText += "position:absolute;width:" + _width + "px;height:" + _height +"px;";

          view.appendChild(stageView);
          view.appendChild(domView);
          
          return {
              view : view,
              stageView: stageView,
              domView: domView
          }
      }
      //dom相关代码结束
  };

  /**
   * 系统皮肤
   */

  //图表皮肤

  //十六进制颜色值的正则表达式

  /**
   * Canvax
   *
   * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
   *
   * canvas 上委托的事件管理
   */

  /**
   * Canvax
   *
   * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
   *
   * canvas 上委托的事件管理
   */

  /**
   * Canvax
   *
   * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
   *
   * 事件管理类
   */

  /**
   * Canvax
   *
   * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
   *
   * 事件派发类
   */

  /**
   * Canvax
   *
   * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
   *
   */

  //这样的好处是document.compareDocumentPosition只会在定义的时候执行一次。
  var contains = (document && document.compareDocumentPosition) ? function (parent, child) {
      if( !child ){
          return false;
      }    return !!(parent.compareDocumentPosition(child) & 16);
  } : function (parent, child) {
      if( !child ){
          return false;
      }
      return child !== child && (parent.contains ? parent.contains(child) : true);
  };

  /**
   * Canvax
   *
   * @author 释剑 (李涛, litao.lt@alibaba-inc.com 
  */

  var Utils = {
      mainFrameRate   : 60,//默认主帧率
      now : 0,
      /*给文本检测高宽专用*/
      _pixelCtx   : null,
      __emptyFunc : function(){},
      //retina 屏幕优化
      _devicePixelRatio : typeof (window) !== 'undefined' ? window.devicePixelRatio : 1,
      _UID  : 0, //该值为向上的自增长整数值
      getUID:function(){
          return this._UID++;
      },
      createId : function( name ) {
          //if end with a digit, then append an undersBase before appending
          var charCode = name.charCodeAt(name.length - 1);
          if (charCode >= 48 && charCode <= 57) name += "_";
          return name + Utils.getUID();
      },
      canvasSupport : function() {
          return !!document.createElement('canvas').getContext;
      },

      initElement : function( canvas ){
          if( window.FlashCanvas && FlashCanvas.initElement){
              FlashCanvas.initElement( canvas );
          }        return canvas;
      },
      
      /**
       * 按照css的顺序，返回一个[上,右,下,左]
       */
      getCssOrderArr : function( r ){
          var r1; 
          var r2; 
          var r3; 
          var r4;

          if(typeof r === 'number') {
              r1 = r2 = r3 = r4 = r;
          }
          else if(r instanceof Array) {
              if (r.length === 1) {
                  r1 = r2 = r3 = r4 = r[0];
              }
              else if(r.length === 2) {
                  r1 = r3 = r[0];
                  r2 = r4 = r[1];
              }
              else if(r.length === 3) {
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
          return [r1,r2,r3,r4];
      },

      isWebGLSupported : function (){
          var contextOptions = { stencil: true };
          try
          {
              if (!window.WebGLRenderingContext) //不存在直接return
              {
                  return false;
              }
              var canvas = document.createElement('canvas'), 
                  gl = canvas.getContext('webgl', contextOptions) || canvas.getContext('experimental-webgl', contextOptions);
              return !!(gl && gl.getContextAttributes().stencil); //还要确实检测是否支持webGL模式
          }
          catch (e)
          {
              return false;
          }
      },
      checkOpt: function( opt ){
          if( !opt ){
              opt = {
                  context : {}
              };
          } else {
              if( !opt.context ){
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

  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var Tween = createCommonjsModule(function (module, exports) {
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
  		// If you remove a tween during an update, it may or may not be updated. However,
  		// if the removed tween was added during the current batch, then it will not be updated.
  		while (tweenIds.length > 0) {
  			this._tweensAddedDuringUpdate = {};

  			for (var i = 0; i < tweenIds.length; i++) {

  				var tween = this._tweens[tweenIds[i]];

  				if (tween && tween.update(time) === false) {
  					tween._isPlaying = false;

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

  	group: function group(group) {
  		this._group = group;
  		return this;
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

  	yoyo: function yoyo(yy) {

  		this._yoyo = yy;
  		return this;

  	},

  	easing: function easing(eas) {

  		this._easingFunction = eas;
  		return this;

  	},

  	interpolation: function interpolation(inter) {

  		this._interpolationFunction = inter;
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
  		elapsed = (this._duration === 0 || elapsed > 1) ? 1 : elapsed;

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

  	{

  		// Node.js
  		module.exports = TWEEN;

  	}

  })(commonjsGlobal);
  });

  /**
   * 设置 AnimationFrame begin
   */


  var lastTime = 0;

  var requestAnimationFrame,cancelAnimationFrame;

  if( typeof (window) !== 'undefined' ){
      requestAnimationFrame = window.requestAnimationFrame;
      cancelAnimationFrame  = window.cancelAnimationFrame;
      var vendors = ['ms', 'moz', 'webkit', 'o'];
      for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
          requestAnimationFrame = window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
          cancelAnimationFrame = window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
      }}
  if (!requestAnimationFrame) {
      requestAnimationFrame = function(callback, element) {
          var currTime = new Date().getTime();
          var timeToCall = Math.max(0, 16 - (currTime - lastTime));
          var id = setTimeout(function() {
                  callback(currTime + timeToCall);
              },
              timeToCall);
          lastTime = currTime + timeToCall;
          return id;
      };
  }if (!cancelAnimationFrame) {
      cancelAnimationFrame = function(id) {
          clearTimeout(id);
      };
  }

  /**
   * Canvax
   *
   * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
   *
   * 把canvax元素的context实现监听属性改动
   * 来给整个引擎提供心跳包的触发机制
   */

  var defineProperty = Object.defineProperty;
  //如果浏览器不支持ecma262v5的Object.defineProperties或者存在BUG，比如IE8
  //标准浏览器使用__defineGetter__, __defineSetter__实现
  try {
      defineProperty({}, "_", {
          value: "x"
      });
  } catch (e) {
      if ("__defineGetter__" in Object) {
          defineProperty = function(obj, prop, desc) {
              if ('value' in desc) {
                  obj[prop] = desc.value;
              }
              if ('get' in desc) {
                  obj.__defineGetter__(prop, desc.get);
              }
              if ('set' in desc) {
                  obj.__defineSetter__(prop, desc.set);
              }
              return obj
          };
      }
  }

  const PI_2 = Math.PI * 2;

  const RAD_TO_DEG = 180 / Math.PI;

  const DEG_TO_RAD = Math.PI / 180;

  ({
      //设备分辨率
      RESOLUTION: typeof (window) !== 'undefined' ? window.devicePixelRatio : 1,

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
          roundPixels: false,
      },

      TRANSFORM_MODE: 0,

      GC_MODE: 0,

      GC_MAX_IDLE: 60 * 60,

      GC_MAX_CHECK_COUNT: 60 * 10,

      WRAP_MODE: 0,

      SCALE_MODE: 0,

      PRECISION: 'mediump'

  });

  /**
   * Canvax
   *
   * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
   *
   * 模拟as3 DisplayList 的 现实对象基类
   */

  /** 
   * Canvax
   *
   * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
   *
   * 模拟as3的DisplayList 中的容器类
   */

  /**
   * Canvax
   *
   * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
   *
   * stage 类， 再as3中，stage则代表整个舞台。是唯一的根节点
   * 但是再canvax中，因为分层设计的需要。stage 舞台 同样代表一个canvas元素，但是不是再整个引擎设计
   * 里面， 不是唯一的根节点。而是会交由canvax类来统一管理其层级
   */

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

  /**
   * Canvax
   *
   * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
   *
   * 模拟as3 中 的sprite类，目前还只是个简单的容易。
   */

  /*
  * Graphics绘图法则
  * 单个grahics实例里的fill line 样式属性，都从对应shape.context 中获取
  * 
  */

  /**
   * Canvax
   *
   * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
   *
   * 模拟as3 DisplayList 中的shape 类
   */

  /**
   * Canvax--Text
   *
   * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
   *
   * 文本 类
   **/

  function Vector(x, y) {
      var vx = 0,vy = 0;
      if ( arguments.length == 1 && _.isObject( x ) ){
          var arg = arguments[0];
          if( _.isArray( arg ) ){
             vx = arg[0];
             vy = arg[1];
          } else if( arg.hasOwnProperty("x") && arg.hasOwnProperty("y") ) {
             vx = arg.x;
             vy = arg.y;
          }
      }
      this._axes = [vx, vy];
  }Vector.prototype = {
      distance: function (v) {
          var x = this._axes[0] - v._axes[0];
          var y = this._axes[1] - v._axes[1];

          return Math.sqrt((x * x) + (y * y));
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
      return (2 * (p1 - p2) + v0 + v1) * t3 
             + (- 3 * (p1 - p2) - 2 * v0 - v1) * t2
             + v0 * t + p1;
  }
  /**
   * 多线段平滑曲线 
   * opt ==> points , isLoop
   */
  function SmoothSpline ( opt ) {
      var points = opt.points;
      var isLoop = opt.isLoop;
      var smoothFilter = opt.smoothFilter;

      var len = points.length;
      if( len == 1 ){
          return points;
      }
      var ret = [];
      var distance  = 0;
      var preVertor = new Vector( points[0] );
      var iVtor     = null;
      for (var i = 1; i < len; i++) {
          iVtor = new Vector(points[i]);
          distance += preVertor.distance( iVtor );
          preVertor = iVtor;
      }

      preVertor = null;
      iVtor     = null;


      //基本上等于曲率
      var segs = distance / 6;

      segs = segs < len ? len : segs;
      for (var i = 0; i < segs; i++) {
          var pos = i / (segs-1) * (isLoop ? len : len - 1);
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
              p0 = points[(idx -1 + len) % len];
              p2 = points[(idx + 1) % len];
              p3 = points[(idx + 2) % len];
          }

          var w2 = w * w;
          var w3 = w * w2;

          var rp = [
                  interpolate(p0[0], p1[0], p2[0], p3[0], w, w2, w3),
                  interpolate(p0[1], p1[1], p2[1], p3[1], w, w2, w3)
                  ];

          _.isFunction(smoothFilter) && smoothFilter( rp );

          ret.push( rp );
      }
      return ret;
  }

  /**
   * Canvax
   *
   * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
   *
   * 数学 类
   *
   **/


  var _cache = {
      sin : {},     //sin缓存
      cos : {}      //cos缓存
  };
  var _radians = Math.PI / 180;

  /**
   * @param angle 弧度（角度）参数
   * @param isDegrees angle参数是否为角度计算，默认为false，angle为以弧度计量的角度
   */
  function sin(angle, isDegrees) {
      angle = (isDegrees ? angle * _radians : angle).toFixed(4);
      if(typeof _cache.sin[angle] == 'undefined') {
          _cache.sin[angle] = Math.sin(angle);
      }
      return _cache.sin[angle];
  }

  /**
   * @param radians 弧度参数
   */
  function cos(angle, isDegrees) {
      angle = (isDegrees ? angle * _radians : angle).toFixed(4);
      if(typeof _cache.cos[angle] == 'undefined') {
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
  function degreeTo360( angle ) {
      var reAng = (360 +  angle  % 360) % 360;//Math.abs(360 + Math.ceil( angle ) % 360) % 360;
      if( reAng == 0 && angle !== 0 ){
          reAng = 360;
      }
      return reAng;
  }

  function getIsgonPointList( n , r ){
      var pointList = [];
      var dStep = 2 * Math.PI / n;
      var beginDeg = -Math.PI / 2;
      var deg = beginDeg;
      for (var i = 0, end = n; i < end; i++) {
          pointList.push([r * Math.cos(deg), r * Math.sin(deg)]);
          deg += dStep;
      }    return pointList;
  }

  function getSmoothPointList( pList, smoothFilter ){
      //smoothFilter -- 比如在折线图中。会传一个smoothFilter过来做point的纠正。
      //让y不能超过底部的原点
      var List = [];

      var Len = pList.length;
      var _currList = [];
      _.each( pList, function( point, i ){

          if( isNotValibPoint( point ) ){
              //undefined , [ number, null] 等结构
              if( _currList.length ){
                  List = List.concat( _getSmoothGroupPointList( _currList, smoothFilter ) );
                  _currList = [];
              }

              List.push( point );
          } else {
              //有效的point 都push 进_currList 准备做曲线设置
              _currList.push( point );
          }        
          if( i == Len-1 ){
              if( _currList.length ){
                  List = List.concat( _getSmoothGroupPointList( _currList, smoothFilter ) );
                  _currList = [];
              }
          }
      } );

      return List;
  }

  function _getSmoothGroupPointList( pList, smoothFilter ){
      var obj = {
          points: pList
      };
      if (_.isFunction(smoothFilter)) {
          obj.smoothFilter = smoothFilter;
      }

      var currL = SmoothSpline(obj);
      if (pList && pList.length>0) {
          currL.push( pList[pList.length - 1] );
      }
      return currL;
  }

  function isNotValibPoint( point ){
      var res = !point || 
      (_.isArray(point) && point.length >= 2 && (!_.isNumber(point[0]) || !_.isNumber(point[1])) ) || 
      ( "x" in point && !_.isNumber(point.x) ) ||
      ( "y" in point && !_.isNumber(point.y) );

      return res;
  }
  function isValibPoint( point ){
      return !isNotValibPoint( point )
  }

  ({
      PI  : Math.PI  ,
      sin : sin      ,
      cos : cos      ,
      degreeToRadian : degreeToRadian,
      radianToDegree : radianToDegree,
      degreeTo360    : degreeTo360,
      getIsgonPointList : getIsgonPointList,
      getSmoothPointList: getSmoothPointList,
      isNotValibPoint : isNotValibPoint,
      isValibPoint : isValibPoint   
  });

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

  //坐标系组件

  let allProps = {
      aa: aa
  };

  return allProps;

}());
