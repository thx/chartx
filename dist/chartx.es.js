var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
}

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var classCallCheck = _classCallCheck;

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

var createClass = _createClass;

function createCommonjsModule$1(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _typeof_1 = createCommonjsModule$1(function (module) {
function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;
});

var _ = {};
var breaker = {};
var ArrayProto = Array.prototype,
    ObjProto = Object.prototype;
 // Create quick reference variables for speed access to core prototypes.

var push = ArrayProto.push,
    slice = ArrayProto.slice,
    concat = ArrayProto.concat,
    toString = ObjProto.toString,
    hasOwnProperty = ObjProto.hasOwnProperty; // All **ECMAScript 5** native function implementations that we hope to use
// are declared here.

var nativeForEach = ArrayProto.forEach,
    nativeMap = ArrayProto.map,
    nativeFilter = ArrayProto.filter,
    nativeEvery = ArrayProto.every,
    nativeSome = ArrayProto.some,
    nativeIndexOf = ArrayProto.indexOf,
    nativeIsArray = Array.isArray,
    nativeKeys = Object.keys;

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
  }

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
}); //if (!_.isArguments(arguments)) {

_.isArguments = function (obj) {
  return !!(obj && _.has(obj, 'callee'));
}; //}


if (typeof /./ !== 'function') {
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
  }

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
  }

  return -1;
};

_.isWindow = function (obj) {
  return obj != null && obj == obj.window;
}; // Internal implementation of a recursive `flatten` function.


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
}; // Flatten out an array, either recursively (by default), or just one level.


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
}; // Return the minimum element (or element-based computation).


_.min = function (obj, iterator, context) {
  if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
    return Math.min.apply(Math, obj);
  }

  if (!iterator && _.isEmpty(obj)) return Infinity;
  var result = {
    computed: Infinity,
    value: Infinity
  };
  each(obj, function (value, index, list) {
    var computed = iterator ? iterator.call(context, value, index, list) : value;
    computed < result.computed && (result = {
      value: value,
      computed: computed
    });
  });
  return result.value;
}; // Return the maximum element or (element-based computation).
// Can't optimize arrays of integers longer than 65,535 elements.
// See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)


_.max = function (obj, iterator, context) {
  if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
    return Math.max.apply(Math, obj);
  }

  if (!iterator && _.isEmpty(obj)) return -Infinity;
  var result = {
    computed: -Infinity,
    value: -Infinity
  };
  each(obj, function (value, index, list) {
    var computed = iterator ? iterator.call(context, value, index, list) : value;
    computed > result.computed && (result = {
      value: value,
      computed: computed
    });
  });
  return result.value;
}; // Return the first value which passes a truth test. Aliased as `detect`.


_.find = _.detect = function (obj, iterator, context) {
  var result;
  any(obj, function (value, index, list) {
    if (iterator.call(context, value, index, list)) {
      result = value;
      return true;
    }
  });
  return result;
}; // Determine if at least one element in the object matches a truth test.
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
}; // Return a version of the array that does not contain the specified value(s).


_.without = function (array) {
  return _.difference(array, slice.call(arguments, 1));
}; // Take the difference between one array and a number of other arrays.
// Only the elements present in just the first array will remain.


_.difference = function (array) {
  var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
  return _.filter(array, function (value) {
    return !_.contains(rest, value);
  });
}; // Produce a duplicate-free version of the array. If the array has already
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
    if (isSorted ? !index || seen[seen.length - 1] !== value : !_.contains(seen, value)) {
      seen.push(value);
      results.push(array[index]);
    }
  });
  return results;
}; // Return the results of applying the iterator to each element.
// Delegates to **ECMAScript 5**'s native `map` if available.


_.map = _.collect = function (obj, iterator, context) {
  var results = [];
  if (obj == null) return results;
  if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
  each(obj, function (value, index, list) {
    results.push(iterator.call(context, value, index, list));
  });
  return results;
}; // Determine if the array or object contains a given value (using `===`).
// Aliased as `include`.


_.contains = _.include = function (obj, target) {
  if (obj == null) return false;
  if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
  return any(obj, function (value) {
    return value === target;
  });
}; // Convenience version of a common use case of `map`: fetching a property.


_.pluck = function (obj, key) {
  return _.map(obj, function (value) {
    return value[key];
  });
}; // Return a random integer between min and max (inclusive).


_.random = function (min, max) {
  if (max == null) {
    max = min;
    min = 0;
  }

  return min + Math.floor(Math.random() * (max - min + 1));
}; // Shuffle a collection.


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

  if (_typeof_1(target) !== "object" && !_.isFunction(target)) {
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

        if (target === copy || copy === undefined) {
          continue;
        }

        if (deep && copy && _.isObject(copy) && copy.constructor === Object) {
          target[name] = _.extend(deep, src, copy);
        } else {
          target[name] = copy;
        }
      }
    }
  }

  return target;
};

_.clone = function (obj) {
  if (!_.isObject(obj)) return obj;
  return _.isArray(obj) ? obj.slice() : _.extend(true, {}, obj);
}; //********补存一些数学常用方法,暂放在这里文件下,后期多了单独成立一个类库  */
// compute euclidian modulo of m % n
// https://en.wikipedia.org/wiki/Modulo_operation


_.euclideanModulo = function (n, m) {
  return (n % m + m) % m;
};

_.DEG2RAD = Math.PI / 180;
_.RAD2DEG = 180 / Math.PI;

_.degToRad = function (degrees) {
  return degrees * _.DEG2RAD;
};

_.radToDeg = function (radians) {
  return radians * _.RAD2DEG;
};

function normalizeTickInterval(interval, magnitude) {
  var normalized, i; // var multiples = [1, 2, 2.5, 5, 10];

  var multiples = [1, 2, 5, 10]; // round to a tenfold of 1, 2, 2.5 or 5

  normalized = interval / magnitude; // normalize the interval to the nearest multiple

  for (var i = 0; i < multiples.length; i++) {
    interval = multiples[i];

    if (normalized <= (multiples[i] + (multiples[i + 1] || multiples[i])) / 2) {
      break;
    }
  } // multiply back to the correct magnitude


  interval *= magnitude;
  return interval;
}

function correctFloat(num) {
  return parseFloat(num.toPrecision(14));
}

function getLinearTickPositions(arr, $maxPart, $cfg) {
  arr = _.without(arr, undefined, null, "");
  var scale = $cfg && $cfg.scale ? parseFloat($cfg.scale) : 1; //返回的数组中的值 是否都为整数(思霏)  防止返回[8, 8.2, 8.4, 8.6, 8.8, 9]   应该返回[8, 9]

  var isInt = $cfg && $cfg.isInt ? 1 : 0;

  if (isNaN(scale)) {
    scale = 1;
  }

  var max = _.max(arr);

  var initMax = max;
  max *= scale;

  var min = _.min(arr);

  if (min == max) {
    if (max > 0) {
      min = 0;
      return [min, max]; // min= Math.round(max/2);
    } else if (max < 0) {
      return [max, 0]; //min = max*2;
    } else {
      max = 1;
      return [0, max];
    }
  }

  var length = max - min;

  if (length) {
    var tempmin = min; //保证min>0的时候不会出现负数

    min -= length * 0.05; // S.log(min +":"+ tempmin)

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
      tickPositions = []; // Populate the intermediate values

  pos = roundedMin;

  while (pos <= roundedMax) {
    // Place the tick on the rounded value
    tickPositions.push(pos); // Always add the raw tickInterval, not the corrected one.

    pos = correctFloat(pos + tickInterval); // If the interval is not big enough in the current min - max range to actually increase
    // the loop variable, we need to break out to prevent endless loop. Issue #619

    if (pos === lastPos) {
      break;
    } // Record the last value


    lastPos = pos;
  }

  if (tickPositions.length >= 3) {
    if (tickPositions[tickPositions.length - 2] >= initMax) {
      tickPositions.pop();
    }
  }

  return tickPositions;
}

var dataSection = {
  section: function section($arr, $maxPart, $cfg) {
    return _.uniq(getLinearTickPositions($arr, $maxPart, $cfg));
  }
};

var cloneOptions = function cloneOptions(opt) {
  return _.clone(opt);
};

var cloneData = function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
};

var getDefaultProps = function getDefaultProps(dProps) {
  var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  for (var p in dProps) {
    if (!!p.indexOf("_")) {
      if (!dProps[p] || !dProps[p].propertys) {
        //如果这个属性没有子属性了，那么就说明这个已经是叶子节点了
        if (_.isObject(dProps[p]) && !_.isFunction(dProps[p]) && !_.isArray(dProps[p])) {
          target[p] = dProps[p]["default"];
        } else {
          target[p] = dProps[p];
        }
      } else {
        target[p] = {};
        getDefaultProps(dProps[p].propertys, target[p]);
      }
    }
  }

  return target;
};

var axis =
/*#__PURE__*/
function () {
  createClass(axis, null, [{
    key: "defaultProps",
    value: function defaultProps() {
      return {
        layoutType: {
          detail: '布局方式',
          "default": 'proportion'
        },
        dataSection: {
          detail: '轴数据集',
          "default": []
        },
        sectionHandler: {
          detail: '自定义dataSection的计算公式',
          "default": null
        },
        waterLine: {
          detail: '水位线',
          "default": null,
          documentation: '水位data，需要混入 计算 dataSection， 如果有设置waterLine， dataSection的最高水位不会低于这个值'
        },
        middleWeight: {
          detail: '区间分隔线',
          "default": null,
          documentation: '如果middleweight有设置的话 dataSectionGroup 为被middleweight分割出来的n个数组>..[ [0,50 , 100],[100,500,1000] ]'
        },
        middleWeightPos: {
          detail: '区间分隔线的物理位置，百分比,默认 0.5 ',
          "default": null
        },
        symmetric: {
          detail: '自动正负对称',
          "default": false,
          documentation: 'proportion下，是否需要设置数据为正负对称的数据，比如 [ 0,5,10 ] = > [ -10, 0 10 ]，象限坐标系的时候需要'
        },
        origin: {
          detail: '轴的起源值',
          "default": null,
          documentation: '\
                    1，如果数据中又正数和负数，则默认为0 <br />\
                    2，如果dataSection最小值小于0，则baseNumber为最小值<br />\
                    3，如果dataSection最大值大于0，则baseNumber为最大值<br />\
                    4，也可以由用户在第2、3种情况下强制配置为0，则section会补充满从0开始的刻度值\
                '
        },
        sort: {
          detail: '排序',
          "default": null
        },
        posParseToInt: {
          detail: '是否位置计算取整',
          "default": false,
          documentation: '比如在柱状图中，有得时候需要高精度的能间隔1px的柱子，那么x轴的计算也必须要都是整除的'
        }
      };
    }
  }]);

  function axis(opt, dataOrg) {
    classCallCheck(this, axis);

    //源数据
    //这个是一个一定会有两层数组的数据结构，是一个标准的dataFrame数据
    // [ 
    //    [   
    //        [1,2,3],  
    //        [1,2,3]    //这样有堆叠的数据只会出现在proportion的axis里，至少目前是这样
    //    ] 
    //   ,[    
    //        [1,2,3] 
    //    ]   
    // ]
    this._opt = _.clone(opt);
    this.dataOrg = dataOrg || []; //3d中有引用到

    this.dataSectionLayout = []; //和dataSection一一对应的，每个值的pos，//get xxx OfPos的时候，要先来这里做一次寻找
    //轴总长
    //3d中有引用到

    this.axisLength = 1;
    this._cellCount = null;
    this._cellLength = null; //数据变动的时候要置空
    //默认的 dataSectionGroup = [ dataSection ], dataSection 其实就是 dataSectionGroup 去重后的一维版本

    this.dataSectionGroup = [];
    this.originPos = 0; //value为 origin 对应的pos位置

    this._originTrans = 0; //当设置的 origin 和datasection的min不同的时候，
    //min,max不需要外面配置，没意义

    this._min = null;
    this._max = null;

    _.extend(true, this, getDefaultProps(axis.defaultProps()), opt);
  }

  createClass(axis, [{
    key: "resetDataOrg",
    value: function resetDataOrg(dataOrg) {
      //配置和数据变化
      this.dataSection = [];
      this.dataSectionGroup = [];
      this.dataOrg = dataOrg;
      this._cellCount = null;
      this._cellLength = null;
    }
  }, {
    key: "setAxisLength",
    value: function setAxisLength(length) {
      this.axisLength = length;
      this.calculateProps();
    }
  }, {
    key: "calculateProps",
    value: function calculateProps() {
      var me = this;

      if (this.layoutType == "proportion") {
        if (this._min == null) {
          this._min = _.min(this.dataSection);
        }

        if (this._max == null) {
          this._max = _.max(this.dataSection);
        }
        //如果用户设置了origin，那么就已用户的设置为准

        if (!("origin" in this._opt)) {
          this.origin = 0; //this.dataSection[0];//_.min( this.dataSection );

          if (_.max(this.dataSection) < 0) {
            this.origin = _.max(this.dataSection);
          }

          if (_.min(this.dataSection) > 0) {
            this.origin = _.min(this.dataSection);
          }
        }
        this._originTrans = this._getOriginTrans(this.origin);
        this.originPos = this.getPosOfVal(this.origin);
      }

      this.dataSectionLayout = [];

      _.each(this.dataSection, function (val, i) {
        var ind = i;

        if (me.layoutType == "proportion") {
          ind = me.getIndexOfVal(val);
        }
        var pos = parseInt(me.getPosOf({
          ind: i,
          val: val
        }), 10);
        me.dataSectionLayout.push({
          val: val,
          ind: ind,
          pos: pos
        });
      });
    }
  }, {
    key: "getDataSection",
    value: function getDataSection() {
      //对外返回的dataSection
      return this.dataSection;
    }
  }, {
    key: "setDataSection",
    value: function setDataSection(_dataSection) {
      var me = this; //如果用户没有配置dataSection，或者用户传了，但是传了个空数组，则自己组装dataSection

      if (_.isEmpty(_dataSection) && _.isEmpty(this._opt.dataSection)) {
        if (this.layoutType == "proportion") {
          var arr = this._getDataSection();

          if ("origin" in me._opt) {
            arr.push(me._opt.origin);
          }

          if (arr.length == 1) {
            arr.push(arr[0] * .5);
          }

          if (this.waterLine) {
            arr.push(this.waterLine);
          }

          if (this.symmetric) {
            //如果需要处理为对称数据
            var _min = _.min(arr);

            var _max = _.max(arr);

            if (Math.abs(_min) > Math.abs(_max)) {
              arr.push(Math.abs(_min));
            } else {
              arr.push(-Math.abs(_max));
            }
          }

          for (var ai = 0, al = arr.length; ai < al; ai++) {
            arr[ai] = Number(arr[ai]);

            if (isNaN(arr[ai])) {
              arr.splice(ai, 1);
              ai--;
              al--;
            }
          }

          if (_.isFunction(this.sectionHandler)) {
            this.dataSection = this.sectionHandler(arr);
          }

          if (!this.dataSection || !this.dataSection.length) {
            this.dataSection = dataSection.section(arr, 3);
          }

          if (this.symmetric) {
            //可能得到的区间是偶数， 非对称，强行补上
            var _min = _.min(this.dataSection);

            var _max = _.max(this.dataSection);

            if (Math.abs(_min) > Math.abs(_max)) {
              this.dataSection.push(Math.abs(_min));
            } else {
              this.dataSection.unshift(-Math.abs(_max));
            }
          }

          if (this.dataSection.length == 0) {
            this.dataSection = [0];
          }

          this.dataSectionGroup = [_.clone(this.dataSection)];

          this._middleweight(); //如果有middleweight配置，需要根据配置来重新矫正下datasection


          this._sort();
        } else {
          //非proportion 也就是 rule peak 模式下面
          this.dataSection = _.flatten(this.dataOrg); //this._getDataSection();

          this.dataSectionGroup = [this.dataSection];
        }
      } else {
        this.dataSection = _dataSection || this._opt.dataSection;
        this.dataSectionGroup = [this.dataSection];
      }

      this._middleWeightPos();
    }
  }, {
    key: "_getDataSection",
    value: function _getDataSection() {
      //如果有堆叠，比如[ ["uv","pv"], "click" ]
      //那么这个 this.dataOrg， 也是个对应的结构
      //vLen就会等于2
      var vLen = 1;

      _.each(this.dataOrg, function (arr) {
        vLen = Math.max(arr.length, vLen);
      });

      if (vLen == 1) {
        return this._oneDimensional();
      }

      if (vLen > 1) {
        return this._twoDimensional();
      }
    }
  }, {
    key: "_oneDimensional",
    value: function _oneDimensional() {
      var arr = _.flatten(this.dataOrg); //_.flatten( data.org );


      for (var i = 0, il = arr.length; i < il; i++) {
        arr[i] = arr[i] || 0;
      }
      return arr;
    } //二维的yAxis设置，肯定是堆叠的比如柱状图，后续也会做堆叠的折线图， 就是面积图

  }, {
    key: "_twoDimensional",
    value: function _twoDimensional() {
      var d = this.dataOrg;
      var arr = [];
      var min;

      _.each(d, function (d, i) {
        if (!d.length) {
          return;
        }

        if (!_.isArray(d[0])) {
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
        }
        arr.push(varr);
      });

      arr.push(min);
      return _.flatten(arr);
    } //val 要被push到datasection 中去的 值
    //主要是用在markline等组件中，当自己的y值超出了yaxis的范围

  }, {
    key: "setWaterLine",
    value: function setWaterLine(val) {
      if (val <= this.waterLine) return;
      this.waterLine = val;

      if (val < _.min(this.dataSection) || val > _.max(this.dataSection)) {
        //waterLine不再当前section的区间内，需要重新计算整个datasection    
        this.setDataSection();
        this.calculateProps();
      }
    }
  }, {
    key: "_sort",
    value: function _sort() {
      if (this.sort) {
        var sort = this._getSortType();

        if (sort == "desc") {
          this.dataSection.reverse(); //dataSectionGroup 从里到外全部都要做一次 reverse， 这样就可以对应上 dataSection.reverse()

          _.each(this.dataSectionGroup, function (dsg, i) {
            dsg.reverse();
          });

          this.dataSectionGroup.reverse(); //dataSectionGroup reverse end
        }
      }
    }
  }, {
    key: "_getSortType",
    value: function _getSortType() {
      var _sort;

      if (_.isString(this.sort)) {
        _sort = this.sort;
      }

      if (!_sort) {
        _sort = "asc";
      }

      return _sort;
    }
  }, {
    key: "_middleweight",
    value: function _middleweight() {

      if (this.middleWeight) {
        //支持多个量级的设置
        if (!_.isArray(this.middleWeight)) {
          this.middleWeight = [this.middleWeight];
        }

        var dMin = _.min(this.dataSection);

        var dMax = _.max(this.dataSection);

        var newDS = [dMin];
        var newDSG = [];

        for (var i = 0, l = this.middleWeight.length; i < l; i++) {
          var preMiddleweight = dMin;

          if (i > 0) {
            preMiddleweight = this.middleWeight[i - 1];
          }
          var middleVal = preMiddleweight + parseInt((this.middleWeight[i] - preMiddleweight) / 2);
          newDS.push(middleVal);
          newDS.push(this.middleWeight[i]);
          newDSG.push([preMiddleweight, middleVal, this.middleWeight[i]]);
        }
        var lastMW = this.middleWeight.slice(-1)[0];

        if (dMax > lastMW) {
          newDS.push(lastMW + (dMax - lastMW) / 2);
          newDS.push(dMax);
          newDSG.push([lastMW, lastMW + (dMax - lastMW) / 2, dMax]);
        } //好了。 到这里用简单的规则重新拼接好了新的 dataSection


        this.dataSection = newDS;
        this.dataSectionGroup = newDSG;
      }
    }
  }, {
    key: "_middleWeightPos",
    value: function _middleWeightPos() {
      var me = this;

      if (this.middleWeightPos) {
        if (!_.isArray(this.middleWeightPos)) {
          this.middleWeightPos = [this.middleWeightPos];
        }
        //如果大于1了则默认按照均分设置

        var _count = 0;

        _.each(this.middleWeightPos, function (pos) {
          _count += pos;
        });

        if (_count < 1) {
          this.middleWeightPos.push(1 - _count);
        }

        if (_count > 1) {
          this.middleWeightPos = null;
        }
      }

      if (this.middleWeight) {
        if (!this.middleWeightPos) {
          this.middleWeightPos = [];
          var _prePos = 0;

          _.each(this.middleWeight, function () {
            var _pos = 1 / (me.middleWeight.length + 1);

            _prePos += _pos;
            me.middleWeightPos.push(_pos);
          });

          this.middleWeightPos.push(1 - _prePos);
        }
      } else {
        this.middleWeightPos = [1];
      }
    } //origin 对应 this.origin 的值

  }, {
    key: "_getOriginTrans",
    value: function _getOriginTrans(origin) {
      var pos = 0;
      var dsgLen = this.dataSectionGroup.length; //var groupLength = this.axisLength / dsgLen;

      for (var i = 0, l = dsgLen; i < l; i++) {
        var ds = this.dataSectionGroup[i];
        var groupLength = this.axisLength * this.middleWeightPos[i];
        var preGroupLenth = 0;

        _.each(this.middleWeightPos, function (mp, mi) {
          if (mi < i) {
            preGroupLenth += me.axisLength * mp;
          }
        });

        if (this.layoutType == "proportion") {
          var min = _.min(ds);

          var max = _.max(ds);

          var amountABS = Math.abs(max - min);

          if (origin >= min && origin <= max) {
            pos = (origin - min) / amountABS * groupLength + preGroupLenth;
            break;
          }
        }
      }

      if (this.sort == "desc") {
        //如果是倒序的
        pos = -(groupLength - pos);
      }
      return parseInt(pos);
    } //opt { val ind pos } 一次只能传一个

  }, {
    key: "_getLayoutDataOf",
    value: function _getLayoutDataOf(opt) {
      var props = ["val", "ind", "pos"];
      var prop;

      _.each(props, function (_p) {
        if (_p in opt) {
          prop = _p;
        }
      });

      var layoutData;

      _.each(this.dataSectionLayout, function (item) {
        if (item[prop] === opt[prop]) {
          layoutData = item;
        }
      });

      return layoutData || {};
    }
  }, {
    key: "getPosOfVal",
    value: function getPosOfVal(val) {
      /* val可能会重复，so 这里得到的会有问题，先去掉
      //先检查下 dataSectionLayout 中有没有对应的记录
      var _pos = this._getLayoutDataOf({ val : val }).pos;
      if( _pos != undefined ){
          return _pos;
      };
      */
      return this.getPosOf({
        val: val
      });
    }
  }, {
    key: "getPosOfInd",
    value: function getPosOfInd(ind) {
      //先检查下 dataSectionLayout 中有没有对应的记录
      var _pos = this._getLayoutDataOf({
        ind: ind
      }).pos;

      if (_pos != undefined) {
        return _pos;
      }
      return this.getPosOf({
        ind: ind
      });
    } //opt {val, ind} val 或者ind 一定有一个

  }, {
    key: "getPosOf",
    value: function getPosOf(opt) {
      var me = this;
      var pos;

      var cellCount = this._getCellCount(); //dataOrg上面的真实数据节点数，把轴分成了多少个节点


      if (this.layoutType == "proportion") {
        var dsgLen = this.dataSectionGroup.length; //var groupLength = this.axisLength / dsgLen;

        for (var i = 0, l = dsgLen; i < l; i++) {
          var ds = this.dataSectionGroup[i];
          var groupLength = this.axisLength * this.middleWeightPos[i];
          var preGroupLenth = 0;

          _.each(this.middleWeightPos, function (mp, mi) {
            if (mi < i) {
              preGroupLenth += me.axisLength * mp;
            }
          });

          var min = _.min(ds);

          var max = _.max(ds);

          var val = "val" in opt ? opt.val : this.getValOfInd(opt.ind);

          if (val >= min && val <= max) {
            var _origin = this.origin;
            var origiInRange = !(_origin < min || _origin > max); //如果 origin 并不在这个区间

            if (!origiInRange) {
              _origin = min;
            }

            var maxGroupDisABS = Math.max(Math.abs(max - _origin), Math.abs(_origin - min));
            var amountABS = Math.abs(max - min);
            var originPos = maxGroupDisABS / amountABS * groupLength;
            pos = (val - _origin) / maxGroupDisABS * originPos + preGroupLenth;

            if (isNaN(pos)) {
              pos = parseInt(preGroupLenth);
            }

            if (origiInRange) {
              //origin在区间内的时候，才需要便宜_originTrans
              pos += this._originTrans;
            }
            break;
          }
        }
      } else {
        if (cellCount == 1) {
          //如果只有一数据，那么就全部默认在正中间
          pos = this.axisLength / 2;
        } else {
          //TODO 这里在非proportion情况下，如果没有opt.ind 那么getIndexOfVal 其实是有风险的，
          //因为可能有多个数据的val一样
          var valInd = "ind" in opt ? opt.ind : this.getIndexOfVal(opt.val);

          if (valInd != -1) {
            if (this.layoutType == "rule") {
              //line 的xaxis就是 rule
              pos = valInd / (cellCount - 1) * this.axisLength;
            }

            if (this.layoutType == "peak") {
              //bar的xaxis就是 peak

              /*
              pos = (this.axisLength/cellCount) 
                    * (valInd+1) 
                    - (this.axisLength/cellCount)/2;
              */
              var _cellLength = this.getCellLength();

              pos = _cellLength * (valInd + 1) - _cellLength / 2;
            }
          }
        }
      }
      !pos && (pos = 0);
      pos = Number(pos.toFixed(1));
      return Math.abs(pos);
    }
  }, {
    key: "getValOfPos",
    value: function getValOfPos(pos) {
      //先检查下 dataSectionLayout 中有没有对应的记录
      var _val = this._getLayoutDataOf({
        pos: pos
      }).val;

      if (_val != undefined) {
        return _val;
      }
      return this._getValOfInd(this.getIndexOfPos(pos));
    } //ds可选

  }, {
    key: "getValOfInd",
    value: function getValOfInd(ind) {
      //先检查下 dataSectionLayout 中有没有对应的记录
      var _val = this._getLayoutDataOf({
        ind: ind
      }).val;

      if (_val != undefined) {
        return _val;
      }
      return this._getValOfInd(ind);
      /*
      if (this.layoutType == "proportion") {
      
      } else {
          //这里的index是直接的对应dataOrg的索引
          var org = ds ? ds : _.flatten(this.dataOrg);
          return org[ind];
      };
      */
    } //这里的ind

  }, {
    key: "_getValOfInd",
    value: function _getValOfInd(ind, ds) {
      var me = this;

      var org = _.flatten(this.dataOrg);

      var val;

      if (this.layoutType == "proportion") {
        var dsgLen = this.dataSectionGroup.length; //var groupLength = this.axisLength / dsgLen;

        _.each(this.dataSectionGroup, function (ds, i) {
          var groupLength = me.axisLength * me.middleWeightPos[i];
          var preGroupLenth = 0;

          _.each(me.middleWeightPos, function (mp, mi) {
            if (mi < i) {
              preGroupLenth += me.axisLength * mp;
            }
          });

          if (parseInt(ind / groupLength) == i || i == me.dataSectionGroup.length - 1) {
            var min = _.min(ds);

            var max = _.max(ds);

            val = min + (max - min) / groupLength * (ind - preGroupLenth);
            return false;
          }
        });
      } else {
        val = org[ind];
      }
      return val;
    }
  }, {
    key: "getIndexOfPos",
    value: function getIndexOfPos(pos) {
      //先检查下 dataSectionLayout 中有没有对应的记录
      var _ind = this._getLayoutDataOf({
        pos: pos
      }).ind;

      if (_ind != undefined) {
        return _ind;
      }
      var ind = 0;
      var cellLength = this.getCellLengthOfPos(pos);

      var cellCount = this._getCellCount();

      if (this.layoutType == "proportion") {
        //proportion中的index以像素为单位 所以，传入的像素值就是index
        return pos;
      } else {
        if (this.layoutType == "peak") {
          ind = parseInt(pos / cellLength);

          if (ind == cellCount) {
            ind = cellCount - 1;
          }
        }

        if (this.layoutType == "rule") {
          ind = parseInt((pos + cellLength / 2) / cellLength);

          if (cellCount == 1) {
            //如果只有一个数据
            ind = 0;
          }
        }
      }
      return ind;
    }
  }, {
    key: "getIndexOfVal",
    value: function getIndexOfVal(val) {
      var valInd = -1;

      if (this.layoutType == "proportion") {
        //先检查下 dataSectionLayout 中有没有对应的记录
        var _ind = this._getLayoutDataOf({
          val: val
        }).ind;

        if (_ind != undefined) {
          return _ind;
        }
        //所以这里要返回pos

        valInd = this.getPosOfVal(val);
      } else {
        _.each(this.dataOrg, function (arr) {
          _.each(arr, function (list) {
            var _ind = _.indexOf(list, val);

            if (_ind != -1) {
              valInd = _ind;
            }
          });
        });
      }

      return valInd;
    }
  }, {
    key: "getCellLength",
    value: function getCellLength() {
      if (this._cellLength !== null) {
        return this._cellLength;
      }

      var axisLength = this.axisLength;
      var cellLength = axisLength;

      var cellCount = this._getCellCount();

      if (cellCount) {
        if (this.layoutType == "proportion") {
          cellLength = 1;
        } else {
          //默认按照 peak 也就是柱状图的需要的布局方式
          cellLength = axisLength / cellCount;

          if (this.layoutType == "rule") {
            if (cellCount == 1) {
              cellLength = axisLength / 2;
            } else {
              cellLength = axisLength / (cellCount - 1);
            }
          }

          if (this.posParseToInt) {
            cellLength = parseInt(cellLength);
          }
        }
      }
      this._cellLength = cellLength;
      return cellLength;
    } //这个getCellLengthOfPos接口主要是给tips用，因为tips中只有x信息

  }, {
    key: "getCellLengthOfPos",
    value: function getCellLengthOfPos(pos) {
      return this.getCellLength();
    } //pos目前没用到，给后续的高级功能预留接口

  }, {
    key: "getCellLengthOfInd",
    value: function getCellLengthOfInd(pos) {
      return this.getCellLength();
    }
  }, {
    key: "_getCellCount",
    value: function _getCellCount() {
      if (this._cellCount !== null) {
        return this._cellCount;
      }

      var cellCount = 0;

      if (this.layoutType == "proportion") {
        cellCount = this.axisLength;
      } else {
        if (this.dataOrg.length && this.dataOrg[0].length && this.dataOrg[0][0].length) {
          cellCount = this.dataOrg[0][0].length;
        }
      }
      this._cellCount = cellCount;
      return cellCount;
    }
  }]);

  return axis;
}();

/**
* 把原始的数据
* field1 field2 field3
*   1      2      3
*   2      3      4
* 这样的数据格式转换为内部的
* [{field:'field1',index:0,data:[1,2]} ......]
* 这样的结构化数据格式。
*/

function parse2MatrixData(list) {
  if (list === undefined || list === null) {
    list = [];
  }

  if (list.length > 0 && !_.isArray(list[0])) {
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

function parse2JsonData(list) {
  var newArr = list; //检测第一个数据是否为一个array, 否就是传入了一个json格式的数据

  if (list.length > 0 && _.isArray(list[0])) {
    newArr = [];
    var fields = list[0];
    var fl = fields.length;

    for (var i = 1, l = list.length; i < l; i++) {
      var obj = {};

      for (var fi = 0; fi < fl; fi++) {
        obj[fields[fi]] = list[i][fi];
      }
      newArr.push(obj);
    }
    return newArr;
  }
}

function dataFrame (dataOrg, opt) {
  var dataFrame = {
    //数据框架集合
    length: 0,
    org: [],
    //最原始的数据，一定是个行列式，因为如果发现是json格式数据，会自动转换为行列式
    jsonOrg: [],
    //原始数据的json格式
    data: [],
    //最原始的数据转化后的数据格式(range取段过后的数据)：[o,o,o] o={field:'val1',index:0,data:[1,2,3]}
    getRowDataAt: _getRowDataAt,
    getRowDataOf: _getRowDataOf,
    getFieldData: _getFieldData,
    getDataOrg: getDataOrg,
    resetData: _resetData,
    fields: [],
    range: {
      start: 0,
      end: 0
    },
    filters: {} //数据过滤器，在range的基础上

  };

  function _initHandle(dataOrg) {
    //数据做一份拷贝，避免污染源数据
    dataOrg = JSON.parse(JSON.stringify(dataOrg, function (k, v) {
      if (v === undefined) {
        return null;
      }

      return v;
    }));

    if (!dataOrg || dataOrg.length == 0) {
      return dataFrame;
    }

    if (dataOrg.length > 0 && !_.isArray(dataOrg[0])) {
      dataFrame.jsonOrg = dataOrg;
      dataOrg = parse2MatrixData(dataOrg);
      dataFrame.org = dataOrg;
    } else {
      dataFrame.org = dataOrg;
      dataFrame.jsonOrg = parse2JsonData(dataOrg);
    }

    dataFrame.range.end = dataOrg.length - 1 - 1; //然后检查opts中是否有dataZoom.range

    if (opt) {
      //兼容下dataZoom 和 datazoom 的大小写配置
      var _datazoom = opt.dataZoom || opt.datazoom;

      _datazoom && _datazoom.range && _.extend(dataFrame.range, _datazoom.range);
    }

    if (dataOrg.length && dataOrg[0].length && !~dataOrg[0].indexOf("__index__")) {
      //如果数据中没有用户自己设置的__index__，那么就主动添加一个__index__，来记录元数据中的index
      for (var i = 0, l = dataOrg.length; i < l; i++) {
        if (!i) {
          dataOrg[0].push("__index__");
        } else {
          dataOrg[i].push(i - 1);
          dataFrame.jsonOrg[i - 1]["__index__"] = i - 1;
        }
      }
    }
    dataFrame.fields = dataOrg[0] ? dataOrg[0] : []; //所有的字段集合;

    return dataFrame;
  }

  function _resetData(dataOrg) {
    if (dataOrg) {
      //重置一些数据
      dataFrame.org = [];
      dataFrame.jsonOrg = [];
      dataFrame.fields = [];
      dataFrame.data = [];

      var tempRange = _.extend(true, {}, dataFrame.range);

      _initHandle(dataOrg); //一些当前状态恢复到dataFrame里去 begin


      _.extend(true, dataFrame.range, tempRange);

      if (dataFrame.range.end > dataFrame.length - 1) {
        dataFrame.range.end = dataFrame.length - 1;
      }

      if (dataFrame.range.start > dataFrame.length - 1 || dataFrame.range.start > dataFrame.range.end) {
        dataFrame.range.start = 0;
      }
    }
    //比如datazoom修改了dataFrame.range

    dataFrame.data = _getData();
  }

  function _getData() {
    var total = []; //已经处理成[o,o,o]   o={field:'val1',index:0,data:[1,2,3]}

    for (var a = 0, al = dataFrame.fields.length; a < al; a++) {
      var o = {};
      o.field = dataFrame.fields[a];
      o.index = a;
      o.data = [];
      total.push(o);
    }

    var rows = _getValidRows(function (rowData) {
      _.each(dataFrame.fields, function (_field) {
        var _val = rowData[_field];

        if (!isNaN(_val) && _val !== "" && _val !== null) {
          _val = Number(_val);
        }

        var gData = _.find(total, function (g) {
          return g.field == _field;
        });

        gData && gData.data.push(_val);
      });
    }); //到这里保证了data一定是行列式


    dataFrame.length = rows.length;
    return total;
  }

  function _getValidRows(callback) {
    var validRowDatas = [];

    _.each(dataFrame.jsonOrg.slice(dataFrame.range.start, dataFrame.range.end + 1), function (rowData) {
      var validRowData = true;

      if (_.keys(dataFrame.filters).length) {
        _.each(dataFrame.filters, function (filter) {
          if (_.isFunction(filter) && !filter(rowData)) {
            validRowData = false;
            return false;
          }
        });
      }

      if (validRowData) {
        callback && callback(rowData);
        validRowDatas.push(rowData);
      }
    });

    return validRowDatas;
  }

  function getDataOrg($field, format, totalList, lev) {
    if (!lev) lev = 0;

    var arr = totalList || _getData();

    if (!arr) {
      return;
    }

    if (!format) {
      format = function format(e) {
        return e;
      };
    }

    function _format(d) {
      for (var i = 0, l = d.length; i < l; i++) {
        d[i] = format(d[i]);
      }
      return d;
    }

    if (!_.isArray($field)) {
      $field = [$field];
    }

    var newData = [];

    for (var i = 0, l = $field.length; i < l; i++) {

      if (_.isArray($field[i])) {
        newData.push(getDataOrg($field[i], format, totalList, lev + 1));
      } else {
        var _fieldData = newData;

        if (!lev) {
          _fieldData = [];
        }

        for (var ii = 0, iil = arr.length; ii < iil; ii++) {
          if ($field[i] == arr[ii].field) {

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
   * 获取某一行数据,当前dataFrame.data中
  */

  function _getRowDataAt(index) {
    var o = {};
    var data = dataFrame.data;

    for (var a = 0; a < data.length; a++) {
      o[data[a].field] = data[a].data[index];
    }
    return o;
  }
  /**
   * obj => {uv: 100, pv: 10 ...}
   */


  function _getRowDataOf(obj) {
    !obj && (obj = {});
    var arr = [];
    var expCount = 0;

    for (var p in obj) {
      expCount++;
    }

    if (expCount) {
      for (var i = dataFrame.range.start; i <= dataFrame.range.end; i++) {
        var matchNum = 0;

        _.each(dataFrame.data, function (fd) {
          if (fd.field in obj && fd.data[i] == obj[fd.field]) {
            matchNum++;
          }
        });

        if (matchNum == expCount) {
          //说明这条数据是完全和查询
          arr.push(_getRowDataAt(i));
        }
      }
    }
    return arr;
  }

  function _getFieldData(field) {
    var list = [];

    var _f = _.find(dataFrame.data, function (obj) {
      return obj.field == field;
    });

    _f && (list = _f.data);
    return list;
  }

  _initHandle(dataOrg);

  dataFrame.data = _getData();
  return dataFrame;
}

var RESOLUTION = typeof window !== 'undefined' ? window.devicePixelRatio : 1;

var addOrRmoveEventHand = function addOrRmoveEventHand(domHand, ieHand) {
  if (document[domHand]) {
    var eventDomFn = function eventDomFn(el, type, fn) {
      if (el.length) {
        for (var i = 0; i < el.length; i++) {
          eventDomFn(el[i], type, fn);
        }
      } else {
        el[domHand](type, fn, false);
      }
    };
    return eventDomFn;
  } else {
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
    return eventFn;
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
    canvas.setAttribute('width', _width * RESOLUTION);
    canvas.setAttribute('height', _height * RESOLUTION);
    canvas.setAttribute('id', id);
    return canvas;
  },
  createView: function createView(_width, _height, id) {
    var view = document.createElement("div");
    view.className = "canvax-view";
    view.style.cssText += "position:relative;width:100%;height:100%;";
    var stageView = document.createElement("div");
    stageView.style.cssText += "position:absolute;width:" + _width + "px;height:" + _height + "px;"; //用来存放一些dom元素

    var domView = document.createElement("div");
    domView.style.cssText += "position:absolute;width:" + _width + "px;height:" + _height + "px;";
    view.appendChild(stageView);
    view.appendChild(domView);
    return {
      view: view,
      stageView: stageView,
      domView: domView
    };
  } //dom相关代码结束

};

/**
 * 系统皮肤
 */
var _colors = ["#ff8533", "#73ace6", "#82d982", "#e673ac", "#cd6bed", "#8282d9", "#c0e650", "#e6ac73", "#6bcded", "#73e6ac", "#ed6bcd", "#9966cc"];
var globalTheme = {
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

var parse = {
  _eval: function _eval(code, target, paramName, paramValue) {
    return paramName ? new Function(paramName, code + "; return ".concat(target, ";"))(paramValue) : new Function(code + "; return ".concat(target, ";"))();
  },
  parse: function parse(code, range, data, variablesFromComponent) {
    try {
      var isVariablesDefined = range && range.length && range.length === 2 && range[1] > range[0]; // 若未定义

      if (!isVariablesDefined) {
        return this._eval(code, 'options');
      }

      var variablesInCode = this._eval(code, 'variables');

      if (typeof variablesInCode === 'function') {
        variablesInCode = variablesInCode(data) || {};
      }

      var variables = {};

      if (variablesFromComponent !== undefined) {
        variables = typeof variablesFromComponent === 'function' ? variablesFromComponent(data) : variablesFromComponent;
      }

      variables = _.extend(true, {}, variablesInCode, variables);
      var codeWithoutVariables = code.slice(0, range[0]) + code.slice(range[1]);
      return this._eval(codeWithoutVariables, 'options', 'variables', variables);
    } catch (e) {
      console.log('parse error');
      return {};
    }
  }
};

//图表皮肤
var globalAnimationEnabled = true; //是否开启全局的动画开关

var global$1 = {
  create: function create(el, _data, _opt) {
    var chart = null;
    var me = this;
    var data = cloneData(_data);
    var opt = cloneOptions(_opt);

    var _destroy = function _destroy() {
      me.instances[chart.id] = null;
      delete me.instances[chart.id];
    }; //这个el如果之前有绘制过图表，那么就要在instances中找到图表实例，然后销毁


    var chart_id = $.query(el).getAttribute("chart_id");

    if (chart_id != undefined) {
      var _chart = me.instances[chart_id];

      if (_chart) {
        _chart.destroy();

        _chart.off && _chart.off("destroy", _destroy);
      }
      delete me.instances[chart_id];
    }

    var dimension = 2; //3d图表的话，本地调试的时候自己在全局chartx3d上面提供is3dOpt变量

    if (me.__dimension == 3 || me.is3dOpt && me.is3dOpt(_opt)) {
      dimension = 3;
    }

    var componentModules = me._getComponentModules(dimension); //如果用户没有配置coord，说明这个图表是一个默认目标系的图表，比如标签云


    var Chart = me._getComponentModule('chart', dimension); //try {


    chart = new Chart(el, data, opt, componentModules);

    if (chart) {
      chart.draw();
      me.instances[chart.id] = chart;
      chart.on("destroy", _destroy);
    }
    //    throw "Chatx Error：" + err
    //};

    return chart;
  },
  setGlobalTheme: function setGlobalTheme(colors) {
    globalTheme.set(colors);
  },
  getGlobalTheme: function getGlobalTheme() {
    return globalTheme.get();
  },
  parse: parse,
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
        return value;
      }) || {};
    };

    return parse(decodeURIComponent(this.options[chartPark_cid] || '%7B%7D'));
  },
  getOptionsNew: function getOptionsNew(chartPark_cid, data, variables) {
    var chartConfig = this.options[chartPark_cid];
    var code = decodeURIComponent(chartConfig.code);
    var range = chartConfig.range;
    return parse.parse(code, range, data, variables);
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
    var chartConfig = this.options[chartPark_cid];
    var optionsFromChartPark = typeof chartConfig === 'string' ? this.getOptionsOld(chartPark_cid) : this.getOptionsNew(chartPark_cid, data || [], variables || {});

    if (userOptions) {
      optionsFromChartPark = _.extend(true, optionsFromChartPark, userOptions);
    }
    return optionsFromChartPark;
  },
  calculateOptions: function calculateOptions(chartPark_cid, data, variables) {
    return this.getOptions(chartPark_cid, undefined, data, variables);
  },
  components: {
    c_2d: {
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
    },
    c_3d: {//所有3d组件,同上
    }
  },
  _getComponentModules: function _getComponentModules(dimension) {
    var comps = this.components.c_2d;

    if (dimension == 3) {
      comps = this.components.c_3d;
    }

    if (!comps.modules) {
      comps.modules = {};
    }

    if (!comps.get) {
      comps.get = function (name, type) {
        if (!type) {
          type = "empty";
        }
        name = name.toLowerCase();
        type = type.toLowerCase();
        var _module = comps.modules[name];

        if (_module && _module[type]) {
          return _module[type];
        }
      };
    }
    return comps;
  },

  /**
   * @param {compModule} 要注册进去的模块名称
   * @param {name} 要获取的comp名称
   * @param { dimension | type } 后面可以传传两个参数 
   * @param { dimension } 如果有四个参数，那么第三个肯定是type，第四个肯定是dimension 
   */
  registerComponent: function registerComponent(compModule, name) {
    var dimension = 2;
    var type = "empty";

    if (arguments.length == 3) {
      var arg2 = arguments[2];

      if (_.isNumber(arg2)) {
        if (arg2 == 3) {
          dimension = 3;
        }
      }

      if (_.isString(arg2)) {
        type = arg2;
      }
    }

    if (arguments.length == 4) {
      //那么肯定是有传 type  dimension 两个值
      type = arguments[2];

      if (arguments[3] == 3) {
        dimension = 3;
      }
    }

    var comps = this._getComponentModules(dimension).modules;

    name = name.toLowerCase();
    type = type.toLowerCase();
    var _comp = comps[name];

    if (!_comp) {
      _comp = comps[name] = {};
    }

    if (!_comp[type]) {
      _comp[type] = compModule;
    }
    return comps;
  },

  /**
   * 
   * @param {name} 要获取的comp名称
   * @param { dimension | type } 后面可以传传两个参数 
   * @param { dimension } 如果有三个参数，那么第二个肯定是type，第三个肯定是dimension 
   */
  _getComponentModule: function _getComponentModule(name) {
    var dimension = 2;
    var type = "empty";

    if (arguments.length == 2) {
      var arg1 = arguments[1];

      if (_.isNumber(arg1)) {
        if (arg1 == 3) {
          dimension = 3;
        }
      }

      if (_.isString(arg1)) {
        type = arg1;
      }
    }

    if (arguments.length == 3) {
      //那么肯定是有传 type  dimension 两个值
      type = arguments[1];

      if (arguments[2] == 3) {
        dimension = 3;
      }
    }
    name = name.toLowerCase();
    type = type.toLowerCase();

    var _comp = this._getComponentModules(dimension).modules[name];

    return _comp ? _comp[type] : undefined;
  },
  setAnimationEnabled: function setAnimationEnabled(bool) {
    globalAnimationEnabled = bool;
  },
  getAnimationEnabled: function getAnimationEnabled(bool) {
    return globalAnimationEnabled;
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

    var _loop = function _loop() {
      if (n == 'chart') return "continue";
      allProps[n] = {
        detail: n,
        propertys: {} //typeMap: {}

      };

      if (n == 'graphs') {
        _graphNames = _.map(allModules.graphs, function (val, key) {
          return key;
        });
        allProps.graphs.documentation = "可选的graphs类型有：\n" + _graphNames.join('\n');
      }
      allConstructorProps = {}; //整个原型链路上面的 defaultProps

      protoModule = null;

      for (mn in allModules[n]) {
        if (protoModule) break;
        protoModule = allModules[n][mn].prototype;
      }

      function _setProps(m) {
        var constructorModule = m.constructor.__proto__; //m.constructor;

        if (!constructorModule._isComponentRoot) {
          _setProps(constructorModule.prototype);
        }

        if (constructorModule.defaultProps && _.isFunction(constructorModule.defaultProps)) {
          var _dprops = constructorModule.defaultProps();

          _.extend(allConstructorProps, _dprops);
        }
      }

      _setProps(protoModule);

      allProps[n].propertys = _.extend(allConstructorProps, allProps[n].propertys);

      var _loop2 = function _loop2() {
        module = allModules[n][mn];
        moduleProps = module.defaultProps ? module.defaultProps() : {}; //处理props上面所有的 _props 依赖 begin

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
              var _module = p._props[k];

              if (_module.defaultProps) {
                var _moduleProps;

                var allConstructorProps;

                (function () {
                  var _setProps = function _setProps(m) {
                    if (m.__proto__.__proto__) {
                      _setProps(m.__proto__);
                    }

                    if (m.defaultProps && _.isFunction(m.defaultProps)) {
                      var _dprops = m.defaultProps();

                      if (_dprops._props) {
                        //如果子元素还有 _props 依赖， 那么就继续处理
                        setChildProps(_dprops);
                      }
                      _dprops && _.extend(allConstructorProps, _dprops);
                    }
                  };

                  _moduleProps = _module.defaultProps(); //先把ta原型上面的所有属性都添加到 _moduleProps 

                  allConstructorProps = {};

                  _setProps(_module.__proto__);

                  _moduleProps = _.extend(allConstructorProps, _moduleProps);

                  if (_propsIsArray) {
                    _.extend(p, _moduleProps);
                  } else {
                    p[k].propertys = _moduleProps;
                    setChildProps(p[k].propertys);
                  }
                })();
              }
            }
          }
        }
        setChildProps(moduleProps); //处理props上面所有的 _props 依赖 end
        //这里不能用下面的 extend 方法，

        moduleProps = _.extend({}, allConstructorProps, moduleProps); //如果原型上面是有type 属性的，那么说明，自己是type分类路由的一个分支，放到typeMap下面

        if (allConstructorProps.type) {
          if (!allProps[n].typeMap) allProps[n].typeMap = {};

          if (n == 'graphs') {
            moduleProps.type.values = _graphNames;
            moduleProps.type.documentation = "可选的graphs类型有：\n" + _graphNames.join('\n');
          }
          allProps[n].typeMap[mn] = moduleProps;
        } else {
          _.extend(allProps[n].propertys, moduleProps);
        }
      };

      for (mn in allModules[n]) {
        _loop2();
      }
    };

    for (var n in allModules) {
      var _graphNames;

      var allConstructorProps;
      var protoModule;
      var mn;
      var mn;
      var module;
      var moduleProps;

      var _ret = _loop();

      if (_ret === "continue") continue;
    }
    this.props = allProps; //计算全量的 props 属性用来提供智能提示 begin

    return this.props;
  }
};

//十六进制颜色值的正则表达式 
var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
/*16进制颜色转为RGB格式*/

function colorRgb(hex) {
  var sColor = hex.toLowerCase();

  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      var sColorNew = "#";

      for (var i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }

      sColor = sColorNew;
    } //处理六位的颜色值  


    var sColorChange = [];

    for (var i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
    }

    return "RGB(" + sColorChange.join(",") + ")";
  } else {
    return sColor;
  }
}
function colorRgba(hex, a) {
  return colorRgb(hex).replace(')', ',' + a + ')').replace('RGB', 'RGBA');
}
function hexTorgb(hex, out) {
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
function hexTostring(hex) {
  hex = hex.toString(16);
  hex = '000000'.substr(0, 6 - hex.length) + hex;
  return "#".concat(hex);
}
function rgbTohex(rgb) {
  return (rgb[0] * 255 << 16) + (rgb[1] * 255 << 8) + rgb[2] * 255;
}

var color = /*#__PURE__*/Object.freeze({
  __proto__: null,
  colorRgb: colorRgb,
  colorRgba: colorRgba,
  hexTorgb: hexTorgb,
  hexTostring: hexTostring,
  rgbTohex: rgbTohex
});

var aRound = 360; //一圈的度数

var Cos = Math.cos;
var Sin = Math.sin;

var Polar =
/*#__PURE__*/
function () {
  function Polar() {
    var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var dataFrame = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    classCallCheck(this, Polar);

    this._opt = _.clone(opt);
    this.dataFrame = dataFrame;
    this.axisLength = 1;
    this.dataOrg = [];
    this.startAngle = this._opt.startAngle;
    this.allAngles = Math.min(360, this._opt.allAngles);
    this.sort = this._opt.sort;
    this.layoutData = []; //和dataSection一一对应的，每个值的pos,agend,dregg,centerPos

    this.maxRadius = 0; //最大半径值

    this.minRadius = 0; //最小半径值 
  }

  createClass(Polar, [{
    key: "calculateProps",
    value: function calculateProps() {
      var _this = this;

      var axisLength = 0;
      var percentage = 0;
      var currentAngle = 0;
      var opt = this._opt;
      var angle, endAngle, cosV, sinV, midAngle, quadrant;
      var percentFixedNum = 2;
      var outRadius = opt.node.outRadius;
      var innerRadius = opt.node.innerRadius;
      var moveDis = opt.node.moveDis;
      this.layoutData.forEach(function (item, i) {
        if (!item.enabled) return;
        axisLength += isNaN(+item.value) ? 0 : +item.value;

        if (item.radiusField) {
          _this.maxRadius = Math.max(item.radiusValue, axisLength);
          _this.minRadius = Math.min(item.radiusValue, axisLength);
        }
      });
      this.axisLength = axisLength;

      if (axisLength > 0) {
        //原始算法
        // currentAngle = + opt.startAngle % 360;
        // limitAngle = opt.allAngles + me.startAngle % me.allAngles;
        //新的算法
        //这里只是计算每个扇区的初始位置,所以这里求模就可以啦
        currentAngle = _.euclideanModulo(this.startAngle, aRound); // opt.allAngles = opt.allAngles > 0 ? opt.allAngles : aRound;
        // limitAngle = opt.allAngles + _.euclideanModulo(opt.startAngle, opt.allAngles);

        this.layoutData.forEach(function (item, i) {
          percentage = item.value / axisLength; //enabled为false的sec，比率就设置为0

          if (!item.enabled) {
            percentage = 0;
          }
          angle = _this.allAngles * percentage; //旧的算法
          // endAngle = currentAngle + angle > limitAngle ? limitAngle : me.currentAngle + angle;

          endAngle = currentAngle + angle;
          midAngle = currentAngle + angle * 0.5;
          cosV = Cos(_.degToRad(midAngle));
          sinV = Sin(_.degToRad(midAngle));
          cosV = cosV.toFixed(5);
          sinV = sinV.toFixed(5);
          quadrant = _this.getAuadrant(midAngle); //如果用户在配置中制定了半径字段,这里需要计算相对的半径比例值

          if (!!item.radiusField) {
            // var _rr = Number(item.rowData[opt.node.radius]);
            outRadius = parseInt((opt.node.outRadius - opt.node.innerRadius) * ((item.radiusValue - _this.minRadius) / (_this.maxRadius - _this.minRadius)) + opt.node.innerRadius);
          }

          _.extend(item, {
            outRadius: outRadius,
            innerRadius: innerRadius,
            startAngle: currentAngle,
            //起始角度
            endAngle: endAngle,
            //结束角度
            midAngle: midAngle,
            //中间角度
            moveDis: moveDis,
            outOffsetx: moveDis * 0.7 * cosV,
            //focus的事实外扩后圆心的坐标x
            outOffsety: moveDis * 0.7 * sinV,
            //focus的事实外扩后圆心的坐标y
            centerx: outRadius * cosV,
            centery: outRadius * sinV,
            outx: (outRadius + moveDis) * cosV,
            outy: (outRadius + moveDis) * sinV,
            edgex: (outRadius + moveDis) * cosV,
            edgey: (outRadius + moveDis) * sinV,
            orginPercentage: percentage,
            percentage: (percentage * 100).toFixed(percentFixedNum),
            quadrant: quadrant,
            //象限
            isRightSide: quadrant == 1 || quadrant == 4 ? 1 : 0,
            cosV: cosV,
            sinV: sinV
          });

          currentAngle += angle;
        });
      }
    }
    /**
     *  重设数据后,需要调用setDataFrame与calculateProps 重新计算layoutData
     * @param {ArryObject} dataFrame 
     */

  }, {
    key: "resetData",
    value: function resetData(dataFrame) {
      this.dataFrame = dataFrame || [];
      this.axisLength = 1;
      this.dataOrg = [];
      this.startAngle = this._opt.startAngle || -90;
      this.allAngles = this._opt.allAngles || 360;
      this.layoutData = [];
    }
  }, {
    key: "setOption",
    value: function setOption() {
      var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      Object.assign(this._opt, opt);
      this.startAngle = this._opt.startAngle;
      this.allAngles = Math.min(360, this._opt.allAngles);
      this.sort = this._opt.sort;
    }
  }, {
    key: "setDataFrame",
    value: function setDataFrame(dataFrame) {
      var _this2 = this;

      var data = [];
      var opt = this._opt;
      var field = opt.field;
      var labelField = opt.groupField || opt.label.field || opt.field;
      var radiusField = opt.node.radius;
      dataFrame = dataFrame || this.dataFrame;
      this.dataFrame = dataFrame;
      this.dataOrg = [];

      for (var i = 0, l = dataFrame.length; i < l; i++) {
        var rowData = dataFrame.getRowDataAt(i);
        var layoutData = {
          rowData: rowData,
          //把这一行数据给到layoutData引用起来
          enabled: true,
          //是否启用，显示在列表中
          value: rowData[field],
          label: rowData[labelField],
          iNode: i
        };
        this.dataOrg.push(rowData[field]);

        if (this._isFiled(radiusField, layoutData)) {
          layoutData.radiusField = radiusField;
          layoutData.radiusValue = rowData[radiusField];
        }

        data.push(layoutData);
      }

      if (this.sort) {
        this.dataOrg = [];
        data.sort(function (a, b) {
          if (_this2.sort == 'asc') {
            return a.value - b.value;
          } else {
            return b.value - a.value;
          }
        }); //重新设定下ind

        _.each(data, function (d, i) {
          d.iNode = i;

          _this2.dataOrg.push(d);
        });
      }
      this.layoutData = data;
      return data;
    }
  }, {
    key: "getLayoutData",
    value: function getLayoutData() {
      return this.layoutData || [];
    }
  }, {
    key: "_isFiled",
    value: function _isFiled(field, layoutData) {
      return field && _.isString(field) && field in layoutData.rowData;
    }
  }, {
    key: "getAuadrant",
    value: function getAuadrant(ang) {
      //获取象限
      ang = _.euclideanModulo(ang, aRound);
      var angleRatio = parseInt(ang / 90);
      var _quadrant = 0;

      switch (angleRatio) {
        case 0:
          _quadrant = 1;
          break;

        case 1:
          _quadrant = 2;
          break;

        case 2:
          _quadrant = 3;
          break;

        case 3:
        case 4:
          _quadrant = 4;
          break;
      }

      return _quadrant;
    }
    /**
     * 通过值或者索引返回数据集对象
     * @param {Object} opt {val:xxx} 或 {ind:xxx} 
     */

  }, {
    key: "_getLayoutDataOf",
    value: function _getLayoutDataOf(opt) {
      //先提供 具体值 和 索引的计算
      var props = [{
        val: "value"
      }, {
        ind: "iNode"
      }];
      var prop = props[Object.keys(opt)[0]];
      var layoutData;

      _.each(this.layoutData, function (item) {
        if (item[prop] === opt[prop]) {
          layoutData = item;
        }
      });

      return layoutData || {};
    }
  }, {
    key: "getRadiansAtR",
    value: function getRadiansAtR() {//基类不实现
    }
  }, {
    key: "getPointsOfR",
    value: function getPointsOfR(r, angleList) {
      var points = [];

      _.each(angleList, function (_a) {
        //弧度
        var _r = Math.PI * _a / 180;

        var point = Polar.getPointInRadianOfR(_r, r);
        points.push(point);
      });

      return points;
    }
  }]);

  return Polar;
}();

Polar.filterPointsInRect = function (points, origin, width, height) {
  for (var i = 0, l = points.length; i < l; i++) {
    if (!Polar.checkPointInRect(points[i], origin, width, height)) {
      //该点不在root rect范围内，去掉
      points.splice(i, 1);
      i--, l--;
    }
  }
  return points;
};

Polar.checkPointInRect = function (p, origin, width, height) {
  var _tansRoot = {
    x: p.x + origin.x,
    y: p.y + origin.y
  };
  return !(_tansRoot.x < 0 || _tansRoot.x > width || _tansRoot.y < 0 || _tansRoot.y > height);
}; //检查由n个相交点分割出来的圆弧是否在rect内


Polar.checkArcInRect = function (arc, r, origin, width, height) {
  var start = arc[0];
  var to = arc[1];
  var differenceR = to.radian - start.radian;

  if (to.radian < start.radian) {
    differenceR = Math.PI * 2 + to.radian - start.radian;
  }
  var middleR = (start.radian + differenceR / 2) % (Math.PI * 2);
  return Polar.checkPointInRect(Polar.getPointInRadianOfR(middleR, r), origin, width, height);
}; //获取某个点相对圆心的弧度值


Polar.getRadianInPoint = function (point) {
  var pi2 = Math.PI * 2;
  return (Math.atan2(point.y, point.x) + pi2) % pi2;
}; //获取某个弧度方向，半径为r的时候的point坐标点位置


Polar.getPointInRadianOfR = function (radian, r) {
  var pi = Math.PI;
  var x = Math.cos(radian) * r;

  if (radian == pi / 2 || radian == pi * 3 / 2) {
    //90度或者270度的时候
    x = 0;
  }
  var y = Math.sin(radian) * r;

  if (radian % pi == 0) {
    y = 0;
  }
  return {
    x: x,
    y: y
  };
};

Polar.getROfNum = function (num, dataSection, width, height) {
  var r = 0;

  var maxNum = _.max(dataSection);

  var minNum = 0; //Math.min( this.rAxis.dataSection );

  var maxR = parseInt(Math.max(width, height) / 2);
  r = maxR * ((num - minNum) / (maxNum - minNum));
  return r;
};

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * canvas 上委托的事件管理
 */

var Event = function Event(evt) {
  var eventType = "CanvaxEvent";

  if (_.isString(evt)) {
    eventType = evt;
  }

  if (_.isObject(evt) && evt.type) {
    eventType = evt.type;

    _.extend(this, evt);
  }
  this.target = null;
  this.currentTarget = null;
  this.type = eventType;
  this.point = null;
  var me = this;
  this._stopPropagation = false; //默认不阻止事件冒泡

  this.stopPropagation = function () {
    me._stopPropagation = true;

    if (_.isObject(evt)) {
      evt._stopPropagation = true;
    }
  };

  this._preventDefault = false; //是否组织事件冒泡

  this.preventDefault = function () {
    me._preventDefault = true;

    if (_.isObject(evt)) {
      evt._preventDefault = true;
    }
  };
};

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

var assertThisInitialized = _assertThisInitialized;

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof_1(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized(self);
}

var possibleConstructorReturn = _possibleConstructorReturn;

var getPrototypeOf = createCommonjsModule$1(function (module) {
function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;
});

var setPrototypeOf = createCommonjsModule$1(function (module) {
function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;
});

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
  if (superClass) setPrototypeOf(subClass, superClass);
}

var inherits = _inherits;

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * canvas 上委托的事件管理
 */
var _mouseEvents = 'mousedown mouseup mouseover mousemove mouseout click dblclick wheel keydown keypress keyup';
var types = {
  _types: _mouseEvents.split(/,| /),
  register: function register(evts) {
    if (!evts) {
      return;
    }

    if (_.isString(evts)) {
      evts = evts.split(/,| /);
    }
    this._types = _mouseEvents.split(/,| /).concat(evts);
  },
  get: function get() {
    return this._types;
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

var Manager = function Manager() {
  //事件映射表，格式为：{type1:[listener1, listener2], type2:[listener3, listener4]}
  this._eventMap = {};
};

Manager.prototype = {
  /**
   * 判断events里面是否有用户交互事件
   */
  _setEventEnable: function _setEventEnable() {
    if (this.children) return; //容器的_eventEnabled不受注册的用户交互事件影响

    var hasInteractionEvent = false;

    for (var t in this._eventMap) {
      if (_.indexOf(types.get(), t) > -1) {
        hasInteractionEvent = true;
      }
    }
    this._eventEnabled = hasInteractionEvent;
  },

  /*
   * 注册事件侦听器对象，以使侦听器能够接收事件通知。
   */
  _addEventListener: function _addEventListener(_type, listener) {
    if (typeof listener != "function") {
      //listener必须是个function呐亲
      return false;
    }

    var addResult = true;
    var self = this;
    var types = _type;

    if (_.isString(_type)) {
      types = _type.split(/,| /);
    }

    _.each(types, function (type) {
      var map = self._eventMap[type];

      if (!map) {
        map = self._eventMap[type] = [];
        map.push(listener); //self._eventEnabled = true;

        self._setEventEnable();

        return true;
      }

      if (_.indexOf(map, listener) == -1) {
        map.push(listener); //self._eventEnabled = true;

        self._setEventEnable();

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

          this._setEventEnable(); //如果这个如果这个时候child没有任何事件侦听

          /*
          if(_.isEmpty(this._eventMap)){
              //那么该元素不再接受事件的检测
              this._eventEnabled = false;
          }
          */

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

      this._setEventEnable(); //如果这个如果这个时候child没有任何事件侦听

      /*
      if(_.isEmpty(this._eventMap)){
          //那么该元素不再接受事件的检测
          this._eventEnabled = false;
      }
      */


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
      if (!e.currentTarget) e.currentTarget = this;
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

var Dispatcher =
/*#__PURE__*/
function (_Manager) {
  inherits(Dispatcher, _Manager);

  function Dispatcher() {
    classCallCheck(this, Dispatcher);

    return possibleConstructorReturn(this, getPrototypeOf(Dispatcher).call(this));
  }

  createClass(Dispatcher, [{
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
    } //params 要传给evt的eventhandler处理函数的参数，会被merge到Canvax event中

  }, {
    key: "fire",
    value: function fire(eventType, params) {
      //{currentTarget,point,target,type,_stopPropagation}
      var e = new Event(eventType);

      if (params) {
        for (var p in params) {
          if (p != "type") {
            e[p] = params[p];
          }
        }
      }
      var me = this;

      _.each(eventType.split(" "), function (eType) {
        //然后，currentTarget要修正为自己
        e.currentTarget = me;
        me.dispatchEvent(e);
      });

      return this;
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(evt) {
      //this instanceof DisplayObjectContainer ==> this.children
      //TODO: 这里import DisplayObjectContainer 的话，在displayObject里面的import EventDispatcher from "../event/EventDispatcher";
      //会得到一个undefined，感觉是成了一个循环依赖的问题，所以这里换用简单的判断来判断自己是一个容易，拥有children
      if (this.children && evt.point) {
        var target = this.getObjectsUnderPoint(evt.point, 1)[0];

        if (target) {
          target.dispatchEvent(evt);
        }

        return;
      }

      if (this.context && evt.type == "mouseover") {
        //记录dispatchEvent之前的心跳
        var preHeartBeat = this._heartBeatNum;
        var pregAlpha = this.context.$model.globalAlpha;

        this._dispatchEvent(evt);

        if (preHeartBeat != this._heartBeatNum) {
          this._hoverClass = true;

          if (this.hoverClone) {
            var canvax = this.getStage().parent; //然后clone一份obj，添加到_bufferStage 中

            var activShape = this.clone(true);
            activShape._transform = this.getConcatenatedMatrix();

            canvax._bufferStage.addChildAt(activShape, 0); //然后把自己隐藏了
            //用一个临时变量_globalAlpha 来存储自己之前的alpha


            this._globalAlpha = pregAlpha;
            this.context.globalAlpha = 0;
          }
        }

        return;
      }

      this._dispatchEvent(evt);

      if (this.context && evt.type == "mouseout") {
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

  return Dispatcher;
}(Manager);

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 */
var _hammerEventTypes = ["pan", "panstart", "panmove", "panend", "pancancel", "panleft", "panright", "panup", "pandown", "press", "pressup", "swipe", "swipeleft", "swiperight", "swipeup", "swipedown", "tap"];

var Handler = function Handler(canvax, opt) {
  this.canvax = canvax;
  this.curPoints = [{
    x: 0,
    y: 0
  }]; //X,Y 的 point 集合, 在touch下面则为 touch的集合，只是这个touch被添加了对应的x，y
  //当前激活的点对应的obj，在touch下可以是个数组,和上面的 curPoints 对应

  this.curPointsTarget = [];
  this._touching = false; //正在拖动，前提是_touching=true

  this._draging = false; //当前的鼠标状态

  this._cursor = "default";
  this.target = this.canvax.view; //mouse体统中不需要配置drag,touch中会用到第三方的touch库，每个库的事件名称可能不一样，
  //就要这里配置，默认实现的是hammerjs的,所以默认可以在项目里引入hammerjs http://hammerjs.github.io/

  this.drag = {
    start: "panstart",
    move: "panmove",
    end: "panend"
  };

  _.extend(true, this, opt);
}; //这样的好处是document.compareDocumentPosition只会在定义的时候执行一次。


var contains = document && document.compareDocumentPosition ? function (parent, child) {
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
Handler.prototype = {
  init: function init() {
    //依次添加上浏览器的自带事件侦听
    var me = this;

    if (me.target.nodeType == undefined) {
      //如果target.nodeType没有的话， 说明该target为一个jQuery对象 or kissy 对象or hammer对象
      //即为第三方库，那么就要对接第三方库的事件系统。默认实现hammer的大部分事件系统
      types.register(_hammerEventTypes);
    }

    $.addEvent(me.target, "contextmenu", function (e) {
      if (e && e.preventDefault) {
        e.preventDefault();
      } else {
        window.event.returnValue = false;
      }
    });

    _.each(types.get(), function (type) {
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
    me.curPoints = [{
      x: $.pageX(e) - root.viewOffset.left,
      y: $.pageY(e) - root.viewOffset.top
    }]; //理论上来说，这里拿到point了后，就要计算这个point对应的target来push到curPointsTarget里，
    //但是因为在drag的时候其实是可以不用计算对应target的。
    //所以放在了下面的me.__getcurPointsTarget( e , curMousePoint );常规mousemove中执行

    var curMousePoint = me.curPoints[0];
    var curMouseTarget = me.curPointsTarget[0];

    if ( //这几个事件触发过来，是一定需要检测 curMouseTarget 的
    _.indexOf(['mousedown', 'mouseover', 'click'], e.type) > -1 && !curMouseTarget) {
      if (!curMouseTarget) {
        var obj = root.getObjectsUnderPoint(curMousePoint, 1)[0];

        if (obj) {
          me.curPointsTarget = [obj];
        }
      }
      curMouseTarget = me.curPointsTarget[0];
    }
    //mousedown的时候 如果 curMouseTarget.dragEnabled 为true。就要开始准备drag了

    if (e.type == "mousedown") {
      //如果curTarget 的数组为空或者第一个为false ，，，
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
          curMouseTarget.fire("dragstart"); //有可能该child没有hover style

          if (!curMouseTarget._globalAlpha) {
            curMouseTarget._globalAlpha = curMouseTarget.context.$model.globalAlpha;
          }

          curMouseTarget.context.globalAlpha = 0; //然后克隆一个副本到activeStage

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

    if (root.preventDefault || e._preventDefault) {
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
    var e = new Event(e);

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
    root.updateViewOffset(); // touch 下的 curPointsTarget 从touches中来
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
            me._draging = true; //有可能该child没有hover style

            if (!child._globalAlpha) {
              child._globalAlpha = child.context.$model.globalAlpha;
            }

            me._clone2hoverStage(child, i); //先把本尊给隐藏了


            child.context.globalAlpha = 0;
            child.fire("dragstart");
            return false;
          }
        });
      }

      if (e.type == me.drag.move) {
        if (me._draging) {
          _.each(me.curPointsTarget, function (child, i) {
            if (child && child.dragEnabled) {
              me._dragIngHander(e, child, i);
            }
          });
        }
      }

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
        x: $.pageX(touch) - root.viewOffset.left,
        y: $.pageY(touch) - root.viewOffset.top
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

    _.each(childs, function (child, i) {
      if (child) {
        var ce = new Event(e); //ce.target = ce.currentTarget = child || this;

        ce.stagePoint = me.curPoints[i];
        ce.point = child.globalToLocal(ce.stagePoint);
        child.dispatchEvent(ce);
      }
    });
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

    var _point = target.globalToLocal(me.curPoints[i]); //要对应的修改本尊的位置，但是要告诉引擎不要watch这个时候的变化


    target._noHeart = true;
    var _moveStage = target.moveing;
    target.moveing = true;
    target.context.x += _point.x - target._dragPoint.x;
    target.context.y += _point.y - target._dragPoint.y;
    target.fire("draging");
    target.moveing = _moveStage;
    target._noHeart = false; //同步完毕本尊的位置
    //这里只能直接修改_transform 。 不能用下面的修改x，y的方式。

    var _dragDuplicate = root._bufferStage.getChildById(target.id);

    _dragDuplicate._transform = target.getConcatenatedMatrix(); //worldTransform在renderer的时候计算

    _dragDuplicate.worldTransform = null; //setWorldTransform都统一在render中执行，这里注释掉
    //_dragDuplicate.setWorldTransform();
    //直接修改的_transform不会出发心跳上报， 渲染引擎不制动这个stage需要绘制。
    //所以要手动出发心跳包

    _dragDuplicate.heartBeat();
  },
  //drag结束的处理函数
  //TODO: dragend的还需要处理end的点是否还在元素上面，要恢复hover状态
  _dragEnd: function _dragEnd(e, target, i) {
    var me = this;
    var root = me.canvax; //_dragDuplicate 复制在_bufferStage 中的副本

    var _dragDuplicate = root._bufferStage.getChildById(target.id);

    _dragDuplicate && _dragDuplicate.destroy();
    target.context.globalAlpha = target._globalAlpha;
  }
};



var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Event: Event,
  Dispatcher: Dispatcher,
  Handler: Handler,
  Manager: Manager,
  types: types
});

var version = "0.0.89";

var index_es = /*#__PURE__*/Object.freeze({
	__proto__: null,
	$: $,
	Polar: Polar,
	_: _,
	axis: axis,
	cloneData: cloneData,
	cloneOptions: cloneOptions,
	color: color,
	dataFrame: dataFrame,
	dataSection: dataSection,
	event: index,
	getDefaultProps: getDefaultProps,
	global: global$1,
	version: version
});

var interopRequireDefault = createCommonjsModule(function (module) {
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;
});

unwrapExports(interopRequireDefault);

function _classCallCheck$1(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var classCallCheck$1 = _classCallCheck$1;

function _defineProperties$1(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass$1(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties$1(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties$1(Constructor, staticProps);
  return Constructor;
}

var createClass$1 = _createClass$1;

var _typeof_1$1 = createCommonjsModule(function (module) {
function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;
});

function _assertThisInitialized$1(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

var assertThisInitialized$1 = _assertThisInitialized$1;

function _possibleConstructorReturn$1(self, call) {
  if (call && (_typeof_1$1(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized$1(self);
}

var possibleConstructorReturn$1 = _possibleConstructorReturn$1;

var getPrototypeOf$1 = createCommonjsModule(function (module) {
function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;
});

var setPrototypeOf$1 = createCommonjsModule(function (module) {
function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;
});

function _inherits$1(subClass, superClass) {
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
  if (superClass) setPrototypeOf$1(subClass, superClass);
}

var inherits$1 = _inherits$1;

function _classCallCheck$2(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var classCallCheck$2 = _classCallCheck$2;

function _defineProperties$2(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass$2(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties$2(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties$2(Constructor, staticProps);
  return Constructor;
}

var createClass$2 = _createClass$2;

function createCommonjsModule$2(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _typeof_1$2 = createCommonjsModule$2(function (module) {
function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;
});

function _assertThisInitialized$2(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

var assertThisInitialized$2 = _assertThisInitialized$2;

function _possibleConstructorReturn$2(self, call) {
  if (call && (_typeof_1$2(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized$2(self);
}

var possibleConstructorReturn$2 = _possibleConstructorReturn$2;

var getPrototypeOf$2 = createCommonjsModule$2(function (module) {
function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;
});

var setPrototypeOf$2 = createCommonjsModule$2(function (module) {
function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;
});

function _inherits$2(subClass, superClass) {
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
  if (superClass) setPrototypeOf$2(subClass, superClass);
}

var inherits$2 = _inherits$2;

function _classCallCheck$1$1(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var classCallCheck$1$1 = _classCallCheck$1$1;

function _defineProperties$1$1(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass$1$1(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties$1$1(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties$1$1(Constructor, staticProps);
  return Constructor;
}

var createClass$1$1 = _createClass$1$1;

function createCommonjsModule$1$1(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _typeof_1$1$1 = createCommonjsModule$1$1(function (module) {
function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;
});

var _$1 = {};
var breaker$1 = {};
var ArrayProto$1 = Array.prototype,
    ObjProto$1 = Object.prototype;
 // Create quick reference variables for speed access to core prototypes.

var push$1 = ArrayProto$1.push,
    slice$1 = ArrayProto$1.slice,
    concat$1 = ArrayProto$1.concat,
    toString$1 = ObjProto$1.toString,
    hasOwnProperty$1 = ObjProto$1.hasOwnProperty; // All **ECMAScript 5** native function implementations that we hope to use
// are declared here.

var nativeForEach$1 = ArrayProto$1.forEach,
    nativeMap$1 = ArrayProto$1.map,
    nativeFilter$1 = ArrayProto$1.filter,
    nativeEvery$1 = ArrayProto$1.every,
    nativeSome$1 = ArrayProto$1.some,
    nativeIndexOf$1 = ArrayProto$1.indexOf,
    nativeIsArray$1 = Array.isArray,
    nativeKeys$1 = Object.keys;

var shallowProperty$1 = function shallowProperty(key) {
  return function (obj) {
    return obj == null ? void 0 : obj[key];
  };
};

var MAX_ARRAY_INDEX$1 = Math.pow(2, 53) - 1;
var getLength$1 = shallowProperty$1('length');

var isArrayLike$1 = function isArrayLike(collection) {
  var length = getLength$1(collection);
  return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX$1;
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

_$1.keys = nativeKeys$1 || function (obj) {
  if (obj !== Object(obj)) throw new TypeError('Invalid object');
  var keys = [];

  for (var key in obj) {
    if (_$1.has(obj, key)) keys.push(key);
  }

  return keys;
};

_$1.has = function (obj, key) {
  return hasOwnProperty$1.call(obj, key);
};

var each$1 = _$1.each = _$1.forEach = function (obj, iterator, context) {
  if (obj == null) return;

  if (nativeForEach$1 && obj.forEach === nativeForEach$1) {
    obj.forEach(iterator, context);
  } else if (obj.length === +obj.length) {
    for (var i = 0, length = obj.length; i < length; i++) {
      if (iterator.call(context, obj[i], i, obj) === breaker$1) return;
    }
  } else {
    var keys = _$1.keys(obj);

    for (var i = 0, length = keys.length; i < length; i++) {
      if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker$1) return;
    }
  }
};

_$1.compact = function (array) {
  return _$1.filter(array, _$1.identity);
};

_$1.filter = _$1.select = function (obj, iterator, context) {
  var results = [];
  if (obj == null) return results;
  if (nativeFilter$1 && obj.filter === nativeFilter$1) return obj.filter(iterator, context);
  each$1(obj, function (value, index, list) {
    if (iterator.call(context, value, index, list)) results.push(value);
  });
  return results;
};

each$1(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function (name) {
  _$1['is' + name] = function (obj) {
    return toString$1.call(obj) == '[object ' + name + ']';
  };
}); //if (!_.isArguments(arguments)) {

_$1.isArguments = function (obj) {
  return !!(obj && _$1.has(obj, 'callee'));
}; //}


if (typeof /./ !== 'function') {
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
  return obj === true || obj === false || toString$1.call(obj) == '[object Boolean]';
};

_$1.isNull = function (obj) {
  return obj === null;
};

_$1.isEmpty = function (obj) {
  if (obj == null) return true;
  if (_$1.isArray(obj) || _$1.isString(obj)) return obj.length === 0;

  for (var key in obj) {
    if (_$1.has(obj, key)) return false;
  }

  return true;
};

_$1.isElement = function (obj) {
  return !!(obj && obj.nodeType === 1);
};

_$1.isArray = nativeIsArray$1 || function (obj) {
  return toString$1.call(obj) == '[object Array]';
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

  if (nativeIndexOf$1 && array.indexOf === nativeIndexOf$1) return array.indexOf(item, isSorted);

  for (; i < length; i++) {
    if (array[i] === item) return i;
  }

  return -1;
};

_$1.isWindow = function (obj) {
  return obj != null && obj == obj.window;
}; // Internal implementation of a recursive `flatten` function.


var flatten$1 = function flatten(input, shallow, output) {
  if (shallow && _$1.every(input, _$1.isArray)) {
    return concat$1.apply(output, input);
  }

  each$1(input, function (value) {
    if (_$1.isArray(value) || _$1.isArguments(value)) {
      shallow ? push$1.apply(output, value) : flatten(value, shallow, output);
    } else {
      output.push(value);
    }
  });
  return output;
}; // Flatten out an array, either recursively (by default), or just one level.


_$1.flatten = function (array, shallow) {
  return flatten$1(array, shallow, []);
};

_$1.every = _$1.all = function (obj, iterator, context) {
  iterator || (iterator = _$1.identity);
  var result = true;
  if (obj == null) return result;
  if (nativeEvery$1 && obj.every === nativeEvery$1) return obj.every(iterator, context);
  each$1(obj, function (value, index, list) {
    if (!(result = result && iterator.call(context, value, index, list))) return breaker$1;
  });
  return !!result;
}; // Return the minimum element (or element-based computation).


_$1.min = function (obj, iterator, context) {
  if (!iterator && _$1.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
    return Math.min.apply(Math, obj);
  }

  if (!iterator && _$1.isEmpty(obj)) return Infinity;
  var result = {
    computed: Infinity,
    value: Infinity
  };
  each$1(obj, function (value, index, list) {
    var computed = iterator ? iterator.call(context, value, index, list) : value;
    computed < result.computed && (result = {
      value: value,
      computed: computed
    });
  });
  return result.value;
}; // Return the maximum element or (element-based computation).
// Can't optimize arrays of integers longer than 65,535 elements.
// See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)


_$1.max = function (obj, iterator, context) {
  if (!iterator && _$1.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
    return Math.max.apply(Math, obj);
  }

  if (!iterator && _$1.isEmpty(obj)) return -Infinity;
  var result = {
    computed: -Infinity,
    value: -Infinity
  };
  each$1(obj, function (value, index, list) {
    var computed = iterator ? iterator.call(context, value, index, list) : value;
    computed > result.computed && (result = {
      value: value,
      computed: computed
    });
  });
  return result.value;
}; // Return the first value which passes a truth test. Aliased as `detect`.


_$1.find = _$1.detect = function (obj, iterator, context) {
  var result;
  any$1(obj, function (value, index, list) {
    if (iterator.call(context, value, index, list)) {
      result = value;
      return true;
    }
  });
  return result;
}; // Determine if at least one element in the object matches a truth test.
// Delegates to **ECMAScript 5**'s native `some` if available.
// Aliased as `any`.


var any$1 = _$1.some = _$1.any = function (obj, iterator, context) {
  iterator || (iterator = _$1.identity);
  var result = false;
  if (obj == null) return result;
  if (nativeSome$1 && obj.some === nativeSome$1) return obj.some(iterator, context);
  each$1(obj, function (value, index, list) {
    if (result || (result = iterator.call(context, value, index, list))) return breaker$1;
  });
  return !!result;
}; // Return a version of the array that does not contain the specified value(s).


_$1.without = function (array) {
  return _$1.difference(array, slice$1.call(arguments, 1));
}; // Take the difference between one array and a number of other arrays.
// Only the elements present in just the first array will remain.


_$1.difference = function (array) {
  var rest = concat$1.apply(ArrayProto$1, slice$1.call(arguments, 1));
  return _$1.filter(array, function (value) {
    return !_$1.contains(rest, value);
  });
}; // Produce a duplicate-free version of the array. If the array has already
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
  each$1(initial, function (value, index) {
    if (isSorted ? !index || seen[seen.length - 1] !== value : !_$1.contains(seen, value)) {
      seen.push(value);
      results.push(array[index]);
    }
  });
  return results;
}; // Return the results of applying the iterator to each element.
// Delegates to **ECMAScript 5**'s native `map` if available.


_$1.map = _$1.collect = function (obj, iterator, context) {
  var results = [];
  if (obj == null) return results;
  if (nativeMap$1 && obj.map === nativeMap$1) return obj.map(iterator, context);
  each$1(obj, function (value, index, list) {
    results.push(iterator.call(context, value, index, list));
  });
  return results;
}; // Determine if the array or object contains a given value (using `===`).
// Aliased as `include`.


_$1.contains = _$1.include = function (obj, target) {
  if (obj == null) return false;
  if (nativeIndexOf$1 && obj.indexOf === nativeIndexOf$1) return obj.indexOf(target) != -1;
  return any$1(obj, function (value) {
    return value === target;
  });
}; // Convenience version of a common use case of `map`: fetching a property.


_$1.pluck = function (obj, key) {
  return _$1.map(obj, function (value) {
    return value[key];
  });
}; // Return a random integer between min and max (inclusive).


_$1.random = function (min, max) {
  if (max == null) {
    max = min;
    min = 0;
  }

  return min + Math.floor(Math.random() * (max - min + 1));
}; // Shuffle a collection.


_$1.shuffle = function (obj) {
  return _$1.sample(obj, Infinity);
};

_$1.sample = function (obj, n, guard) {
  if (n == null || guard) {
    if (!isArrayLike$1(obj)) obj = _$1.values(obj);
    return obj[_$1.random(obj.length - 1)];
  }

  var sample = isArrayLike$1(obj) ? _$1.clone(obj) : _$1.values(obj);
  var length = getLength$1(sample);
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

  if (_typeof_1$1$1(target) !== "object" && !_$1.isFunction(target)) {
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

        if (target === copy || copy === undefined) {
          continue;
        }

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
}; //********补存一些数学常用方法,暂放在这里文件下,后期多了单独成立一个类库  */
// compute euclidian modulo of m % n
// https://en.wikipedia.org/wiki/Modulo_operation


_$1.euclideanModulo = function (n, m) {
  return (n % m + m) % m;
};

_$1.DEG2RAD = Math.PI / 180;
_$1.RAD2DEG = 180 / Math.PI;

_$1.degToRad = function (degrees) {
  return degrees * _$1.DEG2RAD;
};

_$1.radToDeg = function (radians) {
  return radians * _$1.RAD2DEG;
};

var cloneOptions$1 = function cloneOptions(opt) {
  return _$1.clone(opt);
};

var cloneData$1 = function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
};

var RESOLUTION$1 = typeof window !== 'undefined' ? window.devicePixelRatio : 1;

var addOrRmoveEventHand$1 = function addOrRmoveEventHand(domHand, ieHand) {
  if (document[domHand]) {
    var eventDomFn = function eventDomFn(el, type, fn) {
      if (el.length) {
        for (var i = 0; i < el.length; i++) {
          eventDomFn(el[i], type, fn);
        }
      } else {
        el[domHand](type, fn, false);
      }
    };
    return eventDomFn;
  } else {
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
    return eventFn;
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
  addEvent: addOrRmoveEventHand$1("addEventListener", "attachEvent"),
  removeEvent: addOrRmoveEventHand$1("removeEventListener", "detachEvent"),
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
    canvas.setAttribute('width', _width * RESOLUTION$1);
    canvas.setAttribute('height', _height * RESOLUTION$1);
    canvas.setAttribute('id', id);
    return canvas;
  },
  createView: function createView(_width, _height, id) {
    var view = document.createElement("div");
    view.className = "canvax-view";
    view.style.cssText += "position:relative;width:100%;height:100%;";
    var stageView = document.createElement("div");
    stageView.style.cssText += "position:absolute;width:" + _width + "px;height:" + _height + "px;"; //用来存放一些dom元素

    var domView = document.createElement("div");
    domView.style.cssText += "position:absolute;width:" + _width + "px;height:" + _height + "px;";
    view.appendChild(stageView);
    view.appendChild(domView);
    return {
      view: view,
      stageView: stageView,
      domView: domView
    };
  } //dom相关代码结束

};

/**
 * 系统皮肤
 */
var _colors$1 = ["#ff8533", "#73ace6", "#82d982", "#e673ac", "#cd6bed", "#8282d9", "#c0e650", "#e6ac73", "#6bcded", "#73e6ac", "#ed6bcd", "#9966cc"];
var globalTheme$1 = {
  colors: _colors$1,
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

var parse$1 = {
  _eval: function _eval(code, target, paramName, paramValue) {
    return paramName ? new Function(paramName, code + "; return ".concat(target, ";"))(paramValue) : new Function(code + "; return ".concat(target, ";"))();
  },
  parse: function parse(code, range, data, variablesFromComponent) {
    try {
      var isVariablesDefined = range && range.length && range.length === 2 && range[1] > range[0]; // 若未定义

      if (!isVariablesDefined) {
        return this._eval(code, 'options');
      }

      var variablesInCode = this._eval(code, 'variables');

      if (typeof variablesInCode === 'function') {
        variablesInCode = variablesInCode(data) || {};
      }

      var variables = {};

      if (variablesFromComponent !== undefined) {
        variables = typeof variablesFromComponent === 'function' ? variablesFromComponent(data) : variablesFromComponent;
      }

      variables = _$1.extend(true, {}, variablesInCode, variables);
      var codeWithoutVariables = code.slice(0, range[0]) + code.slice(range[1]);
      return this._eval(codeWithoutVariables, 'options', 'variables', variables);
    } catch (e) {
      console.log('parse error');
      return {};
    }
  }
};

//图表皮肤
var globalAnimationEnabled$1 = true; //是否开启全局的动画开关

var global$2 = {
  create: function create(el, _data, _opt) {
    var chart = null;
    var me = this;
    var data = cloneData$1(_data);
    var opt = cloneOptions$1(_opt);

    var _destroy = function _destroy() {
      me.instances[chart.id] = null;
      delete me.instances[chart.id];
    }; //这个el如果之前有绘制过图表，那么就要在instances中找到图表实例，然后销毁


    var chart_id = $$1.query(el).getAttribute("chart_id");

    if (chart_id != undefined) {
      var _chart = me.instances[chart_id];

      if (_chart) {
        _chart.destroy();

        _chart.off && _chart.off("destroy", _destroy);
      }
      delete me.instances[chart_id];
    }

    var dimension = 2; //3d图表的话，本地调试的时候自己在全局chartx3d上面提供is3dOpt变量

    if (me.__dimension == 3 || me.is3dOpt && me.is3dOpt(_opt)) {
      dimension = 3;
    }

    var componentModules = me._getComponentModules(dimension); //如果用户没有配置coord，说明这个图表是一个默认目标系的图表，比如标签云


    var Chart = me._getComponentModule('chart', dimension); //try {


    chart = new Chart(el, data, opt, componentModules);

    if (chart) {
      chart.draw();
      me.instances[chart.id] = chart;
      chart.on("destroy", _destroy);
    }
    //    throw "Chatx Error：" + err
    //};

    return chart;
  },
  setGlobalTheme: function setGlobalTheme(colors) {
    globalTheme$1.set(colors);
  },
  getGlobalTheme: function getGlobalTheme() {
    return globalTheme$1.get();
  },
  parse: parse$1,
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
        return value;
      }) || {};
    };

    return parse(decodeURIComponent(this.options[chartPark_cid] || '%7B%7D'));
  },
  getOptionsNew: function getOptionsNew(chartPark_cid, data, variables) {
    var chartConfig = this.options[chartPark_cid];
    var code = decodeURIComponent(chartConfig.code);
    var range = chartConfig.range;
    return parse$1.parse(code, range, data, variables);
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
    var chartConfig = this.options[chartPark_cid];
    var optionsFromChartPark = typeof chartConfig === 'string' ? this.getOptionsOld(chartPark_cid) : this.getOptionsNew(chartPark_cid, data || [], variables || {});

    if (userOptions) {
      optionsFromChartPark = _$1.extend(true, optionsFromChartPark, userOptions);
    }
    return optionsFromChartPark;
  },
  calculateOptions: function calculateOptions(chartPark_cid, data, variables) {
    return this.getOptions(chartPark_cid, undefined, data, variables);
  },
  components: {
    c_2d: {
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
    },
    c_3d: {//所有3d组件,同上
    }
  },
  _getComponentModules: function _getComponentModules(dimension) {
    var comps = this.components.c_2d;

    if (dimension == 3) {
      comps = this.components.c_3d;
    }

    if (!comps.modules) {
      comps.modules = {};
    }

    if (!comps.get) {
      comps.get = function (name, type) {
        if (!type) {
          type = "empty";
        }
        name = name.toLowerCase();
        type = type.toLowerCase();
        var _module = comps.modules[name];

        if (_module && _module[type]) {
          return _module[type];
        }
      };
    }
    return comps;
  },

  /**
   * @param {compModule} 要注册进去的模块名称
   * @param {name} 要获取的comp名称
   * @param { dimension | type } 后面可以传传两个参数 
   * @param { dimension } 如果有四个参数，那么第三个肯定是type，第四个肯定是dimension 
   */
  registerComponent: function registerComponent(compModule, name) {
    var dimension = 2;
    var type = "empty";

    if (arguments.length == 3) {
      var arg2 = arguments[2];

      if (_$1.isNumber(arg2)) {
        if (arg2 == 3) {
          dimension = 3;
        }
      }

      if (_$1.isString(arg2)) {
        type = arg2;
      }
    }

    if (arguments.length == 4) {
      //那么肯定是有传 type  dimension 两个值
      type = arguments[2];

      if (arguments[3] == 3) {
        dimension = 3;
      }
    }

    var comps = this._getComponentModules(dimension).modules;

    name = name.toLowerCase();
    type = type.toLowerCase();
    var _comp = comps[name];

    if (!_comp) {
      _comp = comps[name] = {};
    }

    if (!_comp[type]) {
      _comp[type] = compModule;
    }
    return comps;
  },

  /**
   * 
   * @param {name} 要获取的comp名称
   * @param { dimension | type } 后面可以传传两个参数 
   * @param { dimension } 如果有三个参数，那么第二个肯定是type，第三个肯定是dimension 
   */
  _getComponentModule: function _getComponentModule(name) {
    var dimension = 2;
    var type = "empty";

    if (arguments.length == 2) {
      var arg1 = arguments[1];

      if (_$1.isNumber(arg1)) {
        if (arg1 == 3) {
          dimension = 3;
        }
      }

      if (_$1.isString(arg1)) {
        type = arg1;
      }
    }

    if (arguments.length == 3) {
      //那么肯定是有传 type  dimension 两个值
      type = arguments[1];

      if (arguments[2] == 3) {
        dimension = 3;
      }
    }
    name = name.toLowerCase();
    type = type.toLowerCase();

    var _comp = this._getComponentModules(dimension).modules[name];

    return _comp ? _comp[type] : undefined;
  },
  setAnimationEnabled: function setAnimationEnabled(bool) {
    globalAnimationEnabled$1 = bool;
  },
  getAnimationEnabled: function getAnimationEnabled(bool) {
    return globalAnimationEnabled$1;
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

    var _loop = function _loop() {
      if (n == 'chart') return "continue";
      allProps[n] = {
        detail: n,
        propertys: {} //typeMap: {}

      };

      if (n == 'graphs') {
        _graphNames = _$1.map(allModules.graphs, function (val, key) {
          return key;
        });
        allProps.graphs.documentation = "可选的graphs类型有：\n" + _graphNames.join('\n');
      }
      allConstructorProps = {}; //整个原型链路上面的 defaultProps

      protoModule = null;

      for (mn in allModules[n]) {
        if (protoModule) break;
        protoModule = allModules[n][mn].prototype;
      }

      function _setProps(m) {
        var constructorModule = m.constructor.__proto__; //m.constructor;

        if (!constructorModule._isComponentRoot) {
          _setProps(constructorModule.prototype);
        }

        if (constructorModule.defaultProps && _$1.isFunction(constructorModule.defaultProps)) {
          var _dprops = constructorModule.defaultProps();

          _$1.extend(allConstructorProps, _dprops);
        }
      }

      _setProps(protoModule);

      allProps[n].propertys = _$1.extend(allConstructorProps, allProps[n].propertys);

      var _loop2 = function _loop2() {
        module = allModules[n][mn];
        moduleProps = module.defaultProps ? module.defaultProps() : {}; //处理props上面所有的 _props 依赖 begin

        function setChildProps(p) {
          if (p._props) {
            var _propsIsArray = _$1.isArray(p._props);

            for (var k in p._props) {
              if (!_propsIsArray) {
                p[k] = {
                  detail: k,
                  propertys: {}
                };
              }
              var _module = p._props[k];

              if (_module.defaultProps) {
                var _moduleProps;

                var allConstructorProps;

                (function () {
                  var _setProps = function _setProps(m) {
                    if (m.__proto__.__proto__) {
                      _setProps(m.__proto__);
                    }

                    if (m.defaultProps && _$1.isFunction(m.defaultProps)) {
                      var _dprops = m.defaultProps();

                      if (_dprops._props) {
                        //如果子元素还有 _props 依赖， 那么就继续处理
                        setChildProps(_dprops);
                      }
                      _dprops && _$1.extend(allConstructorProps, _dprops);
                    }
                  };

                  _moduleProps = _module.defaultProps(); //先把ta原型上面的所有属性都添加到 _moduleProps 

                  allConstructorProps = {};

                  _setProps(_module.__proto__);

                  _moduleProps = _$1.extend(allConstructorProps, _moduleProps);

                  if (_propsIsArray) {
                    _$1.extend(p, _moduleProps);
                  } else {
                    p[k].propertys = _moduleProps;
                    setChildProps(p[k].propertys);
                  }
                })();
              }
            }
          }
        }
        setChildProps(moduleProps); //处理props上面所有的 _props 依赖 end
        //这里不能用下面的 extend 方法，

        moduleProps = _$1.extend({}, allConstructorProps, moduleProps); //如果原型上面是有type 属性的，那么说明，自己是type分类路由的一个分支，放到typeMap下面

        if (allConstructorProps.type) {
          if (!allProps[n].typeMap) allProps[n].typeMap = {};

          if (n == 'graphs') {
            moduleProps.type.values = _graphNames;
            moduleProps.type.documentation = "可选的graphs类型有：\n" + _graphNames.join('\n');
          }
          allProps[n].typeMap[mn] = moduleProps;
        } else {
          _$1.extend(allProps[n].propertys, moduleProps);
        }
      };

      for (mn in allModules[n]) {
        _loop2();
      }
    };

    for (var n in allModules) {
      var _graphNames;

      var allConstructorProps;
      var protoModule;
      var mn;
      var mn;
      var module;
      var moduleProps;

      var _ret = _loop();

      if (_ret === "continue") continue;
    }
    this.props = allProps; //计算全量的 props 属性用来提供智能提示 begin

    return this.props;
  }
};

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * canvas 上委托的事件管理
 */

var Event$1 = function Event(evt) {
  var eventType = "CanvaxEvent";

  if (_$1.isString(evt)) {
    eventType = evt;
  }

  if (_$1.isObject(evt) && evt.type) {
    eventType = evt.type;

    _$1.extend(this, evt);
  }
  this.target = null;
  this.currentTarget = null;
  this.type = eventType;
  this.point = null;
  var me = this;
  this._stopPropagation = false; //默认不阻止事件冒泡

  this.stopPropagation = function () {
    me._stopPropagation = true;

    if (_$1.isObject(evt)) {
      evt._stopPropagation = true;
    }
  };

  this._preventDefault = false; //是否组织事件冒泡

  this.preventDefault = function () {
    me._preventDefault = true;

    if (_$1.isObject(evt)) {
      evt._preventDefault = true;
    }
  };
};

function _assertThisInitialized$1$1(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

var assertThisInitialized$1$1 = _assertThisInitialized$1$1;

function _possibleConstructorReturn$1$1(self, call) {
  if (call && (_typeof_1$1$1(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized$1$1(self);
}

var possibleConstructorReturn$1$1 = _possibleConstructorReturn$1$1;

var getPrototypeOf$1$1 = createCommonjsModule$1$1(function (module) {
function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;
});

var setPrototypeOf$1$1 = createCommonjsModule$1$1(function (module) {
function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;
});

function _inherits$1$1(subClass, superClass) {
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
  if (superClass) setPrototypeOf$1$1(subClass, superClass);
}

var inherits$1$1 = _inherits$1$1;

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * canvas 上委托的事件管理
 */
var _mouseEvents$1 = 'mousedown mouseup mouseover mousemove mouseout click dblclick wheel keydown keypress keyup';
var types$1 = {
  _types: _mouseEvents$1.split(/,| /),
  register: function register(evts) {
    if (!evts) {
      return;
    }

    if (_$1.isString(evts)) {
      evts = evts.split(/,| /);
    }
    this._types = _mouseEvents$1.split(/,| /).concat(evts);
  },
  get: function get() {
    return this._types;
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

var Manager$1 = function Manager() {
  //事件映射表，格式为：{type1:[listener1, listener2], type2:[listener3, listener4]}
  this._eventMap = {};
};

Manager$1.prototype = {
  /**
   * 判断events里面是否有用户交互事件
   */
  _setEventEnable: function _setEventEnable() {
    if (this.children) return; //容器的_eventEnabled不受注册的用户交互事件影响

    var hasInteractionEvent = false;

    for (var t in this._eventMap) {
      if (_$1.indexOf(types$1.get(), t) > -1) {
        hasInteractionEvent = true;
      }
    }
    this._eventEnabled = hasInteractionEvent;
  },

  /*
   * 注册事件侦听器对象，以使侦听器能够接收事件通知。
   */
  _addEventListener: function _addEventListener(_type, listener) {
    if (typeof listener != "function") {
      //listener必须是个function呐亲
      return false;
    }

    var addResult = true;
    var self = this;
    var types = _type;

    if (_$1.isString(_type)) {
      types = _type.split(/,| /);
    }

    _$1.each(types, function (type) {
      var map = self._eventMap[type];

      if (!map) {
        map = self._eventMap[type] = [];
        map.push(listener); //self._eventEnabled = true;

        self._setEventEnable();

        return true;
      }

      if (_$1.indexOf(map, listener) == -1) {
        map.push(listener); //self._eventEnabled = true;

        self._setEventEnable();

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

          this._setEventEnable(); //如果这个如果这个时候child没有任何事件侦听

          /*
          if(_.isEmpty(this._eventMap)){
              //那么该元素不再接受事件的检测
              this._eventEnabled = false;
          }
          */

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

      this._setEventEnable(); //如果这个如果这个时候child没有任何事件侦听

      /*
      if(_.isEmpty(this._eventMap)){
          //那么该元素不再接受事件的检测
          this._eventEnabled = false;
      }
      */


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
      if (!e.currentTarget) e.currentTarget = this;
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

var Dispatcher$1 =
/*#__PURE__*/
function (_Manager) {
  inherits$1$1(Dispatcher, _Manager);

  function Dispatcher() {
    classCallCheck$1$1(this, Dispatcher);

    return possibleConstructorReturn$1$1(this, getPrototypeOf$1$1(Dispatcher).call(this));
  }

  createClass$1$1(Dispatcher, [{
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
    } //params 要传给evt的eventhandler处理函数的参数，会被merge到Canvax event中

  }, {
    key: "fire",
    value: function fire(eventType, params) {
      //{currentTarget,point,target,type,_stopPropagation}
      var e = new Event$1(eventType);

      if (params) {
        for (var p in params) {
          if (p != "type") {
            e[p] = params[p];
          }
        }
      }
      var me = this;

      _$1.each(eventType.split(" "), function (eType) {
        //然后，currentTarget要修正为自己
        e.currentTarget = me;
        me.dispatchEvent(e);
      });

      return this;
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(evt) {
      //this instanceof DisplayObjectContainer ==> this.children
      //TODO: 这里import DisplayObjectContainer 的话，在displayObject里面的import EventDispatcher from "../event/EventDispatcher";
      //会得到一个undefined，感觉是成了一个循环依赖的问题，所以这里换用简单的判断来判断自己是一个容易，拥有children
      if (this.children && evt.point) {
        var target = this.getObjectsUnderPoint(evt.point, 1)[0];

        if (target) {
          target.dispatchEvent(evt);
        }

        return;
      }

      if (this.context && evt.type == "mouseover") {
        //记录dispatchEvent之前的心跳
        var preHeartBeat = this._heartBeatNum;
        var pregAlpha = this.context.$model.globalAlpha;

        this._dispatchEvent(evt);

        if (preHeartBeat != this._heartBeatNum) {
          this._hoverClass = true;

          if (this.hoverClone) {
            var canvax = this.getStage().parent; //然后clone一份obj，添加到_bufferStage 中

            var activShape = this.clone(true);
            activShape._transform = this.getConcatenatedMatrix();

            canvax._bufferStage.addChildAt(activShape, 0); //然后把自己隐藏了
            //用一个临时变量_globalAlpha 来存储自己之前的alpha


            this._globalAlpha = pregAlpha;
            this.context.globalAlpha = 0;
          }
        }

        return;
      }

      this._dispatchEvent(evt);

      if (this.context && evt.type == "mouseout") {
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

  return Dispatcher;
}(Manager$1);

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 */
var _hammerEventTypes$1 = ["pan", "panstart", "panmove", "panend", "pancancel", "panleft", "panright", "panup", "pandown", "press", "pressup", "swipe", "swipeleft", "swiperight", "swipeup", "swipedown", "tap"];

var Handler$1 = function Handler(canvax, opt) {
  this.canvax = canvax;
  this.curPoints = [{
    x: 0,
    y: 0
  }]; //X,Y 的 point 集合, 在touch下面则为 touch的集合，只是这个touch被添加了对应的x，y
  //当前激活的点对应的obj，在touch下可以是个数组,和上面的 curPoints 对应

  this.curPointsTarget = [];
  this._touching = false; //正在拖动，前提是_touching=true

  this._draging = false; //当前的鼠标状态

  this._cursor = "default";
  this.target = this.canvax.view; //mouse体统中不需要配置drag,touch中会用到第三方的touch库，每个库的事件名称可能不一样，
  //就要这里配置，默认实现的是hammerjs的,所以默认可以在项目里引入hammerjs http://hammerjs.github.io/

  this.drag = {
    start: "panstart",
    move: "panmove",
    end: "panend"
  };

  _$1.extend(true, this, opt);
}; //这样的好处是document.compareDocumentPosition只会在定义的时候执行一次。


var contains$1 = document && document.compareDocumentPosition ? function (parent, child) {
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
Handler$1.prototype = {
  init: function init() {
    //依次添加上浏览器的自带事件侦听
    var me = this;

    if (me.target.nodeType == undefined) {
      //如果target.nodeType没有的话， 说明该target为一个jQuery对象 or kissy 对象or hammer对象
      //即为第三方库，那么就要对接第三方库的事件系统。默认实现hammer的大部分事件系统
      types$1.register(_hammerEventTypes$1);
    }

    $$1.addEvent(me.target, "contextmenu", function (e) {
      if (e && e.preventDefault) {
        e.preventDefault();
      } else {
        window.event.returnValue = false;
      }
    });

    _$1.each(types$1.get(), function (type) {
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
    me.curPoints = [{
      x: $$1.pageX(e) - root.viewOffset.left,
      y: $$1.pageY(e) - root.viewOffset.top
    }]; //理论上来说，这里拿到point了后，就要计算这个point对应的target来push到curPointsTarget里，
    //但是因为在drag的时候其实是可以不用计算对应target的。
    //所以放在了下面的me.__getcurPointsTarget( e , curMousePoint );常规mousemove中执行

    var curMousePoint = me.curPoints[0];
    var curMouseTarget = me.curPointsTarget[0];

    if ( //这几个事件触发过来，是一定需要检测 curMouseTarget 的
    _$1.indexOf(['mousedown', 'mouseover', 'click'], e.type) > -1 && !curMouseTarget) {
      if (!curMouseTarget) {
        var obj = root.getObjectsUnderPoint(curMousePoint, 1)[0];

        if (obj) {
          me.curPointsTarget = [obj];
        }
      }
      curMouseTarget = me.curPointsTarget[0];
    }
    //mousedown的时候 如果 curMouseTarget.dragEnabled 为true。就要开始准备drag了

    if (e.type == "mousedown") {
      //如果curTarget 的数组为空或者第一个为false ，，，
      if (curMouseTarget && curMouseTarget.dragEnabled) {
        //鼠标事件已经摸到了一个
        me._touching = true;
      }
    }

    if (e.type == "mouseup" || e.type == "mouseout" && !contains$1(root.view, e.toElement || e.relatedTarget)) {
      if (me._draging == true) {
        //说明刚刚在拖动
        me._dragEnd(e, curMouseTarget, 0);

        curMouseTarget.fire("dragend");
      }
      me._draging = false;
      me._touching = false;
    }

    if (e.type == "mouseout") {
      if (!contains$1(root.view, e.toElement || e.relatedTarget)) {
        me.__getcurPointsTarget(e, curMousePoint, true);
      }
    } else if (e.type == "mousemove") {
      //|| e.type == "mousedown" ){
      //拖动过程中就不在做其他的mouseover检测，drag优先
      if (me._touching && e.type == "mousemove" && curMouseTarget) {
        //说明正在拖动啊
        if (!me._draging) {
          //begin drag
          curMouseTarget.fire("dragstart"); //有可能该child没有hover style

          if (!curMouseTarget._globalAlpha) {
            curMouseTarget._globalAlpha = curMouseTarget.context.$model.globalAlpha;
          }

          curMouseTarget.context.globalAlpha = 0; //然后克隆一个副本到activeStage

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

    if (root.preventDefault || e._preventDefault) {
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
    var e = new Event$1(e);

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
    root.updateViewOffset(); // touch 下的 curPointsTarget 从touches中来
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
            me._draging = true; //有可能该child没有hover style

            if (!child._globalAlpha) {
              child._globalAlpha = child.context.$model.globalAlpha;
            }

            me._clone2hoverStage(child, i); //先把本尊给隐藏了


            child.context.globalAlpha = 0;
            child.fire("dragstart");
            return false;
          }
        });
      }

      if (e.type == me.drag.move) {
        if (me._draging) {
          _$1.each(me.curPointsTarget, function (child, i) {
            if (child && child.dragEnabled) {
              me._dragIngHander(e, child, i);
            }
          });
        }
      }

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
        x: $$1.pageX(touch) - root.viewOffset.left,
        y: $$1.pageY(touch) - root.viewOffset.top
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

    _$1.each(childs, function (child, i) {
      if (child) {
        var ce = new Event$1(e); //ce.target = ce.currentTarget = child || this;

        ce.stagePoint = me.curPoints[i];
        ce.point = child.globalToLocal(ce.stagePoint);
        child.dispatchEvent(ce);
      }
    });
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

    var _point = target.globalToLocal(me.curPoints[i]); //要对应的修改本尊的位置，但是要告诉引擎不要watch这个时候的变化


    target._noHeart = true;
    var _moveStage = target.moveing;
    target.moveing = true;
    target.context.x += _point.x - target._dragPoint.x;
    target.context.y += _point.y - target._dragPoint.y;
    target.fire("draging");
    target.moveing = _moveStage;
    target._noHeart = false; //同步完毕本尊的位置
    //这里只能直接修改_transform 。 不能用下面的修改x，y的方式。

    var _dragDuplicate = root._bufferStage.getChildById(target.id);

    _dragDuplicate._transform = target.getConcatenatedMatrix(); //worldTransform在renderer的时候计算

    _dragDuplicate.worldTransform = null; //setWorldTransform都统一在render中执行，这里注释掉
    //_dragDuplicate.setWorldTransform();
    //直接修改的_transform不会出发心跳上报， 渲染引擎不制动这个stage需要绘制。
    //所以要手动出发心跳包

    _dragDuplicate.heartBeat();
  },
  //drag结束的处理函数
  //TODO: dragend的还需要处理end的点是否还在元素上面，要恢复hover状态
  _dragEnd: function _dragEnd(e, target, i) {
    var me = this;
    var root = me.canvax; //_dragDuplicate 复制在_bufferStage 中的副本

    var _dragDuplicate = root._bufferStage.getChildById(target.id);

    _dragDuplicate && _dragDuplicate.destroy();
    target.context.globalAlpha = target._globalAlpha;
  }
};



var index$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Event: Event$1,
  Dispatcher: Dispatcher$1,
  Handler: Handler$1,
  Manager: Manager$1,
  types: types$1
});

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com 
*/
var Utils = {
  mainFrameRate: 60,
  //默认主帧率
  now: 0,

  /*给文本检测高宽专用*/
  _pixelCtx: null,
  __emptyFunc: function __emptyFunc() {},
  //retina 屏幕优化
  _devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
  _UID: 0,
  //该值为向上的自增长整数值
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
    var contextOptions = {
      stencil: true
    };

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
Utils._pixelCtx = Utils.initElement($$1.createCanvas(1, 1, "_pixelCanvas")).getContext('2d');

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
      if (isNaN(this.a) || isNaN(this.b) || isNaN(this.c) || isNaN(this.d) || isNaN(this.tx) || isNaN(this.ty)) {
        //不是一个合格的矩阵
        return null;
      }
      return [this.a, this.b, this.c, this.d, this.tx, this.ty];
    } //webgl的glsl需要用的时候，需要传入transpose 来转换为一个3*3完整矩阵


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
 * Point
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 */
var Point =
/*#__PURE__*/
function () {
  function Point() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    classCallCheck$2(this, Point);

    if (arguments.length == 1 && _typeof_1$2(arguments[0]) == 'object') {
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

  createClass$2(Point, [{
    key: "toArray",
    value: function toArray() {
      return [this.x, this.y];
    }
  }]);

  return Point;
}();

var Tween = createCommonjsModule$2(function (module, exports) {
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

})();
});

/**
 * 设置 AnimationFrame begin
 */

var lastTime = 0;
var requestAnimationFrame, cancelAnimationFrame;

if (typeof window !== 'undefined') {
  requestAnimationFrame = window.requestAnimationFrame;
  cancelAnimationFrame = window.cancelAnimationFrame;
  var vendors = ['ms', 'moz', 'webkit', 'o'];

  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    requestAnimationFrame = window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    cancelAnimationFrame = window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }
}

if (!requestAnimationFrame) {
  requestAnimationFrame = function requestAnimationFrame(callback, element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = setTimeout(function () {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };
}

if (!cancelAnimationFrame) {
  cancelAnimationFrame = function cancelAnimationFrame(id) {
    clearTimeout(id);
  };
}

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

  if (!global$2.getAnimationEnabled()) {
    //如果全局动画被禁用，那么下面两项强制设置为0
    //TODO:其实应该直接执行回调函数的
    opt.duration = 0;
    opt.delay = 0;
  }
  var tween = {};
  var tid = "tween_" + Utils.getUID();
  opt.id && (tid = tid + "_" + opt.id);

  if (opt.from && opt.to) {
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
      tween._isCompleteed = true; //opt.onComplete.apply( this , [this] ); //执行用户的conComplete

      opt.onComplete(opt.from);
    }).onStop(function () {
      destroyFrame({
        id: tid
      });
      tween._isStoped = true; //opt.onStop.apply( this , [this] );

      opt.onStop(opt.from);
    }).repeat(opt.repeat).delay(opt.delay).easing(Tween.Easing[opt.easing.split(".")[0]][opt.easing.split(".")[1]]);
    tween.id = tid;
    tween.start();
    animate();
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

    var valueType = _typeof_1$2(val);

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
          var neoType = _typeof_1$2(neo);

          if (stopRepeatAssign) {
            return; //阻止重复赋值
          }

          if (value !== neo) {
            if (neo && neoType === "object" && !(neo instanceof Array) && !neo.addColorStop // neo instanceof CanvasGradient
            ) {
                value = neo.$model ? neo : Observe(neo);
                complexValue = value.$model;
              } else {
              //如果是其他数据类型
              value = neo;
            }

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
            value = Observe(value);
            value.$watch = pmodel.$watch; //accessor.value = value;

            model[name] = value;
          }
          return value;
        }
      }; //accessor.value = val;


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
var defineProperty = Object.defineProperty; //如果浏览器不支持ecma262v5的Object.defineProperties或者存在BUG，比如IE8
//标准浏览器使用__defineGetter__, __defineSetter__实现

try {
  defineProperty({}, "_", {
    value: "x"
  });
  var defineProperties = Object.defineProperties;
} catch (e) {
  if ("__defineGetter__" in Object) {
    defineProperty = function defineProperty(obj, prop, desc) {
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
          defineProperty(obj, prop, descs[prop]);
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

var TRANSFORM_PROPS = ["x", "y", "scaleX", "scaleY", "rotation", "scaleOrigin", "rotateOrigin"]; //所有和样式相关的属性
//appha 有 自己的 处理方式

var STYLE_PROPS = ["lineWidth", "strokeAlpha", "strokeStyle", "fillStyle", "fillAlpha", "globalAlpha"];

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

var settings = {
  //设备分辨率
  RESOLUTION: typeof window !== 'undefined' ? window.devicePixelRatio : 1,

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

var DisplayObject =
/*#__PURE__*/
function (_event$Dispatcher) {
  inherits$2(DisplayObject, _event$Dispatcher);

  function DisplayObject(opt) {
    var _this;

    classCallCheck$2(this, DisplayObject);

    _this = possibleConstructorReturn$2(this, getPrototypeOf$2(DisplayObject).call(this, opt)); //相对父级元素的矩阵

    _this._transform = null;
    _this.worldTransform = null; //_transform如果有修改，则_transformChange为true，renderer的时候worldTransform

    _this._transformChange = false; //心跳次数

    _this._heartBeatNum = 0; //元素对应的stage元素

    _this.stage = null; //元素的父元素

    _this.parent = null;
    _this.xyToInt = "xyToInt" in opt ? opt.xyToInt : true; //是否对xy坐标统一int处理，默认为true，但是有的时候可以由外界用户手动指定是否需要计算为int，因为有的时候不计算比较好，比如，进度图表中，再sector的两端添加两个圆来做圆角的进度条的时候，圆circle不做int计算，才能和sector更好的衔接

    _this.moveing = false; //如果元素在最轨道运动中的时候，最好把这个设置为true，这样能保证轨迹的丝搬顺滑，否则因为xyToInt的原因，会有跳跃

    _this.clip = null; //裁剪的图形对象
    //创建好context

    _this.context = _this._createContext(opt);
    _this.type = opt.type || "DisplayObject";
    _this.id = opt.id || Utils.createId(_this.type);
    _this._trackList = []; //一个元素可以追踪另外元素的变动

    _this.init.apply(assertThisInitialized$2(_this), arguments); //所有属性准备好了后，先要计算一次this._updateTransform()得到_tansform


    _this._updateTransform();

    _this._tweens = [];

    var me = assertThisInitialized$2(_this);

    _this.on("destroy", function () {
      me.cleanAnimates();
    });

    return _this;
  }

  createClass$2(DisplayObject, [{
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
        globalAlpha: optCtx.globalAlpha || 1 //样式部分迁移到shape中

      }; //平凡的clone数据非常的耗时，还是走回原来的路
      //var _contextATTRS = _.extend( true , _.clone(CONTEXT_DEFAULT), opt.context );

      _$1.extend(true, _contextATTRS, opt.context); //有些引擎内部设置context属性的时候是不用上报心跳的，比如做热点检测的时候


      self._notWatch = false; //不需要发心跳信息

      self._noHeart = false; //_contextATTRS.$owner = self;

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
      }; //执行init之前，应该就根据参数，把context组织好线


      return Observe(_contextATTRS);
    } //TODO:track目前还没测试过,需要的时候再测试

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
      } //一直回溯到顶层object， 即是stage， stage的parent为null


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

      var context = this.context; //是否需要scale

      if (context.scaleX !== 1 || context.scaleY !== 1) {
        //如果有缩放
        //缩放的原点坐标
        var origin = new Point(context.scaleOrigin);

        _transform.translate(-origin.x, -origin.y);

        _transform.scale(context.scaleX, context.scaleY);

        _transform.translate(origin.x, origin.y);
      }
      var rotation = context.rotation;

      if (rotation) {
        //如果有旋转
        //旋转的原点坐标
        var origin = new Point(context.rotateOrigin);

        _transform.translate(-origin.x, -origin.y);

        _transform.rotate(rotation % 360 * Math.PI / 180);

        _transform.translate(origin.x, origin.y);
      }

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
    } //获取全局的世界坐标系内的矩阵
    //世界坐标是从上而下的，所以只要和parent的直接坐标相乘就好了

  }, {
    key: "setWorldTransform",
    value: function setWorldTransform() {
      var cm = new Matrix();
      cm.concat(this._transform);
      this.parent && cm.concat(this.parent.worldTransform);
      this.worldTransform = cm;
      return this.worldTransform;
    } //显示对象的选取检测处理函数

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
      var y = point.y; //对鼠标的坐标也做相同的变换

      if (this.worldTransform) {
        var inverseMatrix = this.worldTransform.clone().invert();
        var originPos = [x * settings.RESOLUTION, y * settings.RESOLUTION];
        originPos = inverseMatrix.mulVector(originPos);
        x = originPos[0];
        y = originPos[1];
      }

      if (this.graphics) {
        result = this.containsPoint({
          x: x,
          y: y
        });
      }

      if (this.type == "text") {
        //文本框的先单独处理
        var _rect = this.getRect();

        if (!_rect.width || !_rect.height) {
          return false;
        }

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
          } //circle,ellipse等就没有points


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
          this.animate(to[p], _$1.extend({}, options), context[p]); //如果是个object

          continue;
        }

        if (isNaN(to[p]) && to[p] !== '' && to[p] !== null) {
          //undefined已经被isNaN过滤了
          //只有number才能继续走下去执行tween，而非number则直接赋值完事，
          //TODO:不能用_.isNumber 因为 '1212' 这样的其实可以计算
          context[p] = to[p];
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

        self._removeTween(tween);
      };

      options.onStop = function () {
        self._removeTween(tween);
      };

      options.desc = "tweenType:DisplayObject.animate__id:" + this.id + "__objectType:" + this.type;
      tween = AnimationFrame.registTween(options);

      this._tweens.push(tween);

      return tween;
    }
  }, {
    key: "_removeTween",
    value: function _removeTween(tween) {
      for (var i = 0; i < this._tweens.length; i++) {
        if (tween == this._tweens[i]) {
          this._tweens.splice(i, 1);

          break;
        }
      }
    }
  }, {
    key: "removeAnimate",
    value: function removeAnimate(animate) {
      animate.stop();

      this._removeTween(animate);
    } //清楚所有的动画

  }, {
    key: "cleanAnimates",
    value: function cleanAnimates() {
      this._cleanAnimates();
    } //清楚所有的动画

  }, {
    key: "_cleanAnimates",
    value: function _cleanAnimates() {
      while (this._tweens.length) {
        this._tweens.shift().stop();
      }
    } //从树中删除

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
    } //元素的自我销毁

  }, {
    key: "_destroy",
    value: function _destroy() {
      this.remove();
      this.fire("destroy"); //把自己从父节点中删除了后做自我清除，释放内存

      this.context = null;
      delete this.context;
    }
  }]);

  return DisplayObject;
}(index$1.Dispatcher);

var DisplayObjectContainer =
/*#__PURE__*/
function (_DisplayObject) {
  inherits$2(DisplayObjectContainer, _DisplayObject);

  function DisplayObjectContainer(opt) {
    var _this;

    classCallCheck$2(this, DisplayObjectContainer);

    _this = possibleConstructorReturn$2(this, getPrototypeOf$2(DisplayObjectContainer).call(this, opt));
    _this.children = [];
    _this.mouseChildren = []; //所有的容器默认支持event 检测，因为 可能有里面的shape是eventEnable是true的
    //如果用户有强制的需求让容器下的所有元素都 不可检测，可以调用
    //DisplayObjectContainer的 setEventEnable() 方法

    _this._eventEnabled = true;
    return _this;
  }

  createClass$2(DisplayObjectContainer, [{
    key: "addChild",
    value: function addChild(child, index) {
      if (!child) {
        return;
      }

      if (this.getChildIndex(child) != -1) {
        child.parent = this;
        return child;
      }

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
    } //集合类的自我销毁

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
    } //集合类的自我销毁

  }, {
    key: "cleanAnimates",
    value: function cleanAnimates() {
      //依次销毁所有子元素
      for (var i = 0, l = this.children.length; i < l; i++) {
        this.getChildAt(i).cleanAnimates();
      }

      this._cleanAnimates();
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
    } //获取x,y点上的所有object  num 需要返回的obj数量

  }, {
    key: "getObjectsUnderPoint",
    value: function getObjectsUnderPoint(point, num) {
      var result = [];

      for (var i = this.children.length - 1; i >= 0; i--) {
        var child = this.children[i];

        if (child == null || !child.context.$model.visible) {
          //不管是集合还是非集合，如果不显示的都不接受点击检测
          continue;
        }

        if (child instanceof DisplayObjectContainer) {
          if (!child._eventEnabled) {
            //容易一般默认 _eventEnabled == true; 但是如果被设置成了false
            //如果容器设置了不接受事件检测，那么下面所有的元素都不接受事件检测
            continue;
          }

          if (child.mouseChildren && child.getNumChildren() > 0) {
            var objs = child.getObjectsUnderPoint(point);

            if (objs.length > 0) {
              result = result.concat(objs);
            }
          }
        } else {
          if (!child._eventEnabled && !child.dragEnabled) {
            continue;
          }

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

var Stage =
/*#__PURE__*/
function (_DisplayObjectContain) {
  inherits$2(Stage, _DisplayObjectContain);

  function Stage(opt) {
    var _this;

    classCallCheck$2(this, Stage);

    opt.type = "stage";
    _this = possibleConstructorReturn$2(this, getPrototypeOf$2(Stage).call(this, opt));
    _this.canvas = null;
    _this.ctx = null; //渲染的时候由renderer决定,这里不做初始值
    //stage正在渲染中

    _this.stageRending = false;
    _this._isReady = false;
    return _this;
  } //由canvax的afterAddChild 回调


  createClass$2(Stage, [{
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

      opt.stage = this; //TODO临时先这么处理

      this.parent && this.parent.heartBeat(opt);
    }
  }]);

  return Stage;
}(DisplayObjectContainer);

var SystemRenderer =
/*#__PURE__*/
function () {
  function SystemRenderer() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : RENDERER_TYPE.UNKNOWN;
    var app = arguments.length > 1 ? arguments[1] : undefined;
    var options = arguments.length > 2 ? arguments[2] : undefined;

    classCallCheck$2(this, SystemRenderer);

    this.type = type; //2canvas,1webgl

    this.app = app;

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
  } //如果引擎处于静默状态的话，就会启动


  createClass$2(SystemRenderer, [{
    key: "startEnter",
    value: function startEnter() {
      var self = this;

      if (!self.requestAid) {
        self.requestAid = AnimationFrame.registFrame({
          id: "enterFrame",
          //同时肯定只有一个enterFrame的task
          task: function task() {
            self.enterFrame.apply(self);
          }
        });
      }
    }
  }, {
    key: "enterFrame",
    value: function enterFrame() {
      var self = this; //不管怎么样，enterFrame执行了就要把
      //requestAid null 掉

      self.requestAid = null;
      Utils.now = new Date().getTime();

      if (self._heartBeat) {
        //var _begin = new Date().getTime();
        this.app.children.length && self.render(this.app); //var _end = new Date().getTime();
        //$(document.body).append( "<br />render："+ (_end - _begin) );

        self._heartBeat = false; //渲染完了，打上最新时间挫

        self._preRenderTime = new Date().getTime();
      }
    }
  }, {
    key: "_convertCanvax",
    value: function _convertCanvax(opt) {
      var me = this;

      _$1.each(me.app.children, function (stage) {
        stage.context[opt.name] = opt.value;
      });
    }
  }, {
    key: "heartBeat",
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

var CanvasGraphicsRenderer =
/*#__PURE__*/
function () {
  function CanvasGraphicsRenderer(renderer) {
    classCallCheck$2(this, CanvasGraphicsRenderer);

    this.renderer = renderer;
  }
  /**
  * @param displayObject
  * @stage 也可以displayObject.getStage()获取。
  */


  createClass$2(CanvasGraphicsRenderer, [{
    key: "render",
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
        var line = data.hasLine() && data.strokeAlpha && !isClip;
        ctx.lineWidth = data.lineWidth;

        if (data.type === SHAPES.POLY) {
          //只第一次需要beginPath()
          ctx.beginPath();
          this.renderPolygon(shape.points, shape.closed, ctx, isClip);

          if (fill) {
            ctx.globalAlpha = data.fillAlpha * globalAlpha;
            ctx.fillStyle = fillStyle;
            ctx.fill();
          }

          if (line) {
            ctx.globalAlpha = data.strokeAlpha * globalAlpha;
            ctx.strokeStyle = strokeStyle;
            ctx.stroke();
          }
        } else if (data.type === SHAPES.RECT) {
          if (isClip) {
            //ctx.beginPath();
            //rect本身已经是个close的path
            ctx.rect(shape.x, shape.y, shape.width, shape.height); //ctx.closePath();
          }

          if (fill) {
            ctx.globalAlpha = data.fillAlpha * globalAlpha;
            ctx.fillStyle = fillStyle;
            ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
          }

          if (line) {
            ctx.globalAlpha = data.strokeAlpha * globalAlpha;
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
            ctx.globalAlpha = data.strokeAlpha * globalAlpha;
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
            ctx.globalAlpha = data.strokeAlpha * globalAlpha;
            ctx.strokeStyle = strokeStyle;
            ctx.stroke();
          }
        }
      }
    }
  }, {
    key: "renderPolygon",
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

var CanvasRenderer =
/*#__PURE__*/
function (_SystemRenderer) {
  inherits$2(CanvasRenderer, _SystemRenderer);

  function CanvasRenderer(app) {
    var _this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    classCallCheck$2(this, CanvasRenderer);

    _this = possibleConstructorReturn$2(this, getPrototypeOf$2(CanvasRenderer).call(this, RENDERER_TYPE.CANVAS, app, options));
    _this.CGR = new CanvasGraphicsRenderer(assertThisInitialized$2(_this));
    return _this;
  }

  createClass$2(CanvasRenderer, [{
    key: "render",
    value: function render(app) {
      var me = this;
      me.app = app;

      _$1.each(_$1.values(app.convertStages), function (convertStage) {
        me.renderStage(convertStage.stage);
      });

      app.convertStages = {};
    }
  }, {
    key: "renderStage",
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
    key: "_render",
    value: function _render(stage, displayObject, globalAlpha) {
      var ctx = stage.ctx;

      if (!ctx) {
        return;
      }
      var $MC = displayObject.context.$model;

      if (!displayObject.worldTransform) {
        //第一次在舞台中渲染
        displayObject.fire("render");
      }

      if (!displayObject.worldTransform || displayObject._transformChange || displayObject.parent && displayObject.parent._transformChange) {
        displayObject.setWorldTransform();
        displayObject.fire("transform");
        displayObject._transformChange = true;
      }
      globalAlpha *= $MC.globalAlpha;

      if (!$MC.visible || displayObject.isClip) {
        return;
      }
      var worldMatrixArr = displayObject.worldTransform.toArray();

      if (worldMatrixArr) {
        ctx.setTransform.apply(ctx, worldMatrixArr);
      } else {
        //如果这个displayObject的世界矩阵有问题，那么就不绘制了
        return;
      }
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
        ctx.setTransform.apply(ctx, _clip.worldTransform.toArray()); //如果 graphicsData.length==0 的情况下才需要执行_draw来组织graphics数据

        if (!_clip.graphics.graphicsData.length) {
          //当渲染器开始渲染app的时候，app下面的所有displayObject都已经准备好了对应的世界矩阵
          _clip._draw(_clip.graphics); //_draw会完成绘制准备好 graphicsData

        }
        this.CGR.render(_clip, stage, globalAlpha, isClipSave);
        _clip._transformChange = false;
        ctx.clip();
      }

      if (displayObject.graphics) {
        //如果 graphicsData.length==0 的情况下才需要执行_draw来组织 graphics 数据
        if (!displayObject.graphics.graphicsData.length) {
          //当渲染器开始渲染app的时候，app下面的所有displayObject都已经准备好了对应的世界矩阵
          displayObject._draw(displayObject.graphics); //_draw会完成绘制准备好 graphicsData

        }
        //事件检测的时候需要用到graphics.graphicsData

        if (!!globalAlpha) {
          //默认要设置为实线
          ctx.setLineDash([]); //然后如果发现这个描边非实线的话，就设置为虚线

          if ($MC.lineType && $MC.lineType != 'solid') {
            ctx.setLineDash($MC.lineDash);
          }
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
    key: "_clear",
    value: function _clear(stage) {
      var ctx = stage.ctx;
      ctx.setTransform.apply(ctx, stage.worldTransform.toArray());
      ctx.clearRect(0, 0, this.app.width, this.app.height);
    }
  }]);

  return CanvasRenderer;
}(SystemRenderer);

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

var Application =
/*#__PURE__*/
function (_DisplayObjectContain) {
  inherits$2(Application, _DisplayObjectContain);

  function Application(opt) {
    var _this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    classCallCheck$2(this, Application);

    opt.type = "canvax";
    _this = possibleConstructorReturn$2(this, getPrototypeOf$2(Application).call(this, opt));
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
    _this.renderer = autoRenderer(assertThisInitialized$2(_this), options);
    _this.event = null; //该属性在systenRender里面操作，每帧由心跳上报的 需要重绘的stages 列表

    _this.convertStages = {};
    _this.context.$model.width = _this.width;
    _this.context.$model.height = _this.height; //然后创建一个用于绘制激活 shape 的 stage 到activation

    _this._bufferStage = null;

    _this._creatHoverStage(); //设置一个默认的matrix做为app的世界根节点坐标


    _this.worldTransform = new Matrix().identity();
    return _this;
  }

  createClass$2(Application, [{
    key: "registEvent",
    value: function registEvent(opt) {
      //初始化事件委托到root元素上面
      this.event = new index$1.Handler(this, opt);
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

      try {
        this.view.removeChild(this.stageView);
        this.view.removeChild(this.domView);
        this.el.removeChild(this.view);
      } catch (e) {}
      this.el.innerHTML = "";
      this.event = null;
      this._bufferStage = null;
    }
  }, {
    key: "resize",
    value: function resize(opt) {
      //重新设置坐标系统 高宽 等。
      this.width = parseInt(opt && "width" in opt || this.el.offsetWidth, 10);
      this.height = parseInt(opt && "height" in opt || this.el.offsetHeight, 10); //this.view  width height都一直设置为100%
      //this.view.style.width  = this.width +"px";
      //this.view.style.height = this.height+"px";

      this.viewOffset = $$1.offset(this.view);
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
      }); //该stage不参与事件检测

      this._bufferStage._eventEnabled = false;
      this.addChild(this._bufferStage);
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
      try {
        this.stageView.removeChild(stage.canvas);
      } catch (error) {}
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
      var canvas = $$1.createCanvas(this.width, this.height, "curr_base64_canvas");
      var ctx = canvas.getContext("2d");

      _$1.each(this.children, function (stage) {
        ctx.drawImage(stage.canvas, 0, 0);
      });

      return canvas.toDataURL();
    }
  }]);

  return Application;
}(DisplayObjectContainer);

var Sprite =
/*#__PURE__*/
function (_DisplayObjectContain) {
  inherits$2(Sprite, _DisplayObjectContain);

  function Sprite(opt) {
    classCallCheck$2(this, Sprite);

    opt = Utils.checkOpt(opt);
    opt.type = "sprite";
    return possibleConstructorReturn$2(this, getPrototypeOf$2(Sprite).call(this, opt));
  }

  return Sprite;
}(DisplayObjectContainer);

var GraphicsData =
/*#__PURE__*/
function () {
  function GraphicsData(lineWidth, strokeStyle, strokeAlpha, fillStyle, fillAlpha, shape) {
    classCallCheck$2(this, GraphicsData);

    this.lineWidth = lineWidth;
    this.strokeStyle = strokeStyle;
    this.strokeAlpha = strokeAlpha;
    this.fillStyle = fillStyle;
    this.fillAlpha = fillAlpha;
    this.shape = shape;
    this.type = shape.type;
    this.holes = []; //这两个可以被后续修改， 具有一票否决权
    //比如polygon的 虚线描边。必须在fill的poly上面设置line为false

    this.fill = true;
    this.line = true;
  }

  createClass$2(GraphicsData, [{
    key: "clone",
    value: function clone() {
      var cloneGraphicsData = new GraphicsData(this.lineWidth, this.strokeStyle, this.strokeAlpha, this.fillStyle, this.fillAlpha, this.shape);
      cloneGraphicsData.fill = this.fill;
      cloneGraphicsData.line = this.line;
      return cloneGraphicsData;
    }
  }, {
    key: "addHole",
    value: function addHole(shape) {
      this.holes.push(shape);
    } //从宿主graphics中同步最新的style属性

  }, {
    key: "synsStyle",
    value: function synsStyle(style) {
      //console.log("line:"+this.line+"__fill:"+this.fill)
      //从shape中把绘图需要的style属性同步过来
      if (this.line) {
        this.lineWidth = style.lineWidth;
        this.strokeStyle = style.strokeStyle;
        this.strokeAlpha = style.strokeAlpha;
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

var arcToSegmentsCache = {},
    segmentToBezierCache = {},
    boundsOfCurveCache = {},
    _join = Array.prototype.join;
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
  } // Convert into cubic bezier segments <= 90deg


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
    bounds.push({
      x: bound[0].x + fx,
      y: bound[0].y + fy
    });
    bounds.push({
      x: bound[1].x + fx,
      y: bound[1].y + fy
    });
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

var Rectangle =
/*#__PURE__*/
function () {
  function Rectangle() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    classCallCheck$2(this, Rectangle);

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = SHAPES.RECT;
    this.closed = true;
  }

  createClass$2(Rectangle, [{
    key: "clone",
    value: function clone() {
      return new Rectangle(this.x, this.y, this.width, this.height);
    }
  }, {
    key: "copy",
    value: function copy(rectangle) {
      this.x = rectangle.x;
      this.y = rectangle.y;
      this.width = rectangle.width;
      this.height = rectangle.height;
      return this;
    }
  }, {
    key: "contains",
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

      return false; //当x和 width , y和height都 为正或者都未负数的情况下，才可能在范围内
    }
  }]);

  return Rectangle;
}();

var Circle =
/*#__PURE__*/
function () {
  function Circle() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var radius = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    classCallCheck$2(this, Circle);

    this.x = x;
    this.y = y;
    this.radius = radius;
    this.type = SHAPES.CIRC;
    this.closed = true;
  }

  createClass$2(Circle, [{
    key: "clone",
    value: function clone() {
      return new Circle(this.x, this.y, this.radius);
    }
  }, {
    key: "contains",
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
    key: "getBounds",
    value: function getBounds() {
      return new Rectangle(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }
  }]);

  return Circle;
}();

var Ellipse =
/*#__PURE__*/
function () {
  function Ellipse() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    classCallCheck$2(this, Ellipse);

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = SHAPES.ELIP;
    this.closed = true;
  }

  createClass$2(Ellipse, [{
    key: "clone",
    value: function clone() {
      return new Ellipse(this.x, this.y, this.width, this.height);
    }
  }, {
    key: "contains",
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
    key: "getBounds",
    value: function getBounds() {
      return new Rectangle(this.x - this.width, this.y - this.height, this.width, this.height);
    }
  }]);

  return Ellipse;
}();

var Polygon =
/*#__PURE__*/
function () {
  function Polygon() {
    for (var _len = arguments.length, points = new Array(_len), _key = 0; _key < _len; _key++) {
      points[_key] = arguments[_key];
    }

    classCallCheck$2(this, Polygon);

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

  createClass$2(Polygon, [{
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

var Graphics =
/*#__PURE__*/
function () {
  function Graphics(shape) {
    classCallCheck$2(this, Graphics);

    this.lineWidth = 1;
    this.strokeStyle = null;
    this.strokeAlpha = 1;
    this.fillStyle = null;
    this.fillAlpha = 1; //比如path m 0 0 l 0 0 m 1 1 l 1 1
    //就会有两条graphicsData数据产生

    this.graphicsData = [];
    this.currentPath = null;
    this.dirty = 0; //用于检测图形对象是否已更改。 如果这是设置为true，那么图形对象将被重新计算。

    this.clearDirty = 0; //用于检测我们是否清除了图形webGL数据

    this._webGL = {};
    this.worldAlpha = 1;
    this.tint = 0xFFFFFF; //目标对象附加颜色

    this.Bound = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
  }

  createClass$2(Graphics, [{
    key: "setStyle",
    value: function setStyle(context) {
      //从 shape 中把绘图需要的style属性同步过来
      var model = context.$model;
      this.lineWidth = model.lineWidth;
      this.strokeStyle = model.strokeStyle;
      this.strokeAlpha = model.strokeAlpha * model.globalAlpha;
      this.fillStyle = model.fillStyle;
      this.fillAlpha = model.fillAlpha * model.globalAlpha;
      var g = this; //一般都是先设置好style的，所以 ， 当后面再次设置新的style的时候
      //会把所有的data都修改
      //TODO: 后面需要修改, 能精准的确定是修改 graphicsData 中的哪个data

      if (this.graphicsData.length) {
        _$1.each(this.graphicsData, function (gd, i) {
          gd.synsStyle(g);
        });
      }
    }
  }, {
    key: "clone",
    value: function clone() {
      var clone = new Graphics();
      clone.dirty = 0; // copy graphics data

      for (var i = 0; i < this.graphicsData.length; ++i) {
        clone.graphicsData.push(this.graphicsData[i].clone());
      }

      clone.currentPath = clone.graphicsData[clone.graphicsData.length - 1];
      return clone;
    }
  }, {
    key: "moveTo",
    value: function moveTo(x, y) {
      var shape = new Polygon([x, y]);
      shape.closed = false;
      this.drawShape(shape);
      return this;
    }
  }, {
    key: "lineTo",
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
    key: "quadraticCurveTo",
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
    key: "bezierCurveTo",
    value: function bezierCurveTo$1(cpX, cpY, cpX2, cpY2, toX, toY) {
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
    key: "arcTo",
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
    key: "arc",
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
      var startY = cy + Math.sin(startAngle) * radius; // If the currentPath exists, take its points. Otherwise call `moveTo` to start a path.

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
    key: "drawRect",
    value: function drawRect(x, y, width, height) {
      this.drawShape(new Rectangle(x, y, width, height));
      return this;
    }
  }, {
    key: "drawCircle",
    value: function drawCircle(x, y, radius) {
      this.drawShape(new Circle(x, y, radius));
      return this;
    }
  }, {
    key: "drawEllipse",
    value: function drawEllipse(x, y, width, height) {
      this.drawShape(new Ellipse(x, y, width, height));
      return this;
    }
  }, {
    key: "drawPolygon",
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
    key: "clear",
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
    key: "drawShape",
    value: function drawShape(shape) {
      if (this.currentPath) {
        if (this.currentPath.shape.points.length <= 2) {
          this.graphicsData.pop();
        }
      } //this.currentPath = null;


      this.beginPath();
      var data = new GraphicsData(this.lineWidth, this.strokeStyle, this.strokeAlpha, this.fillStyle, this.fillAlpha, shape);
      this.graphicsData.push(data);

      if (data.type === SHAPES.POLY) {
        data.shape.closed = data.shape.closed;
        this.currentPath = data;
      }

      this.dirty++;
      return data;
    }
  }, {
    key: "beginPath",
    value: function beginPath() {
      this.currentPath = null;
    }
  }, {
    key: "closePath",
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
    key: "updateLocalBounds",
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
    key: "getBound",
    value: function getBound() {
      return this.updateLocalBounds().Bound;
    }
  }, {
    key: "destroy",
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

var Shape =
/*#__PURE__*/
function (_DisplayObject) {
  inherits$2(Shape, _DisplayObject);

  function Shape(opt) {
    var _this;

    classCallCheck$2(this, Shape);

    opt = Utils.checkOpt(opt);
    var styleContext = {
      cursor: opt.context.cursor || "default",
      fillAlpha: opt.context.fillAlpha || 1,
      //context2d里没有，自定义
      fillStyle: opt.context.fillStyle || null,
      //"#000000",
      lineCap: opt.context.lineCap || "round",
      //默认都是直角
      lineJoin: opt.context.lineJoin || "round",
      //这两个目前webgl里面没实现
      miterLimit: opt.context.miterLimit || null,
      //miterLimit 属性设置或返回最大斜接长度,只有当 lineJoin 属性为 "miter" 时，miterLimit 才有效。
      strokeAlpha: opt.context.strokeAlpha || 1,
      //context2d里没有，自定义
      strokeStyle: opt.context.strokeStyle || null,
      lineType: opt.context.lineType || "solid",
      //context2d里没有，自定义线条的type，默认为实线
      lineDash: opt.context.lineDash || [6, 3],
      lineWidth: opt.context.lineWidth || null
    };

    var _context = _$1.extend(true, styleContext, opt.context);

    opt.context = _context;

    if (opt.id === undefined && opt.type !== undefined) {
      opt.id = Utils.createId(opt.type);
    }
    _this = possibleConstructorReturn$2(this, getPrototypeOf$2(Shape).call(this, opt)); //over的时候如果有修改样式，就为true

    _this._hoverClass = false;
    _this.hoverClone = true; //是否开启在hover的时候clone一份到active stage 中 

    _this.pointChkPriority = true; //在鼠标mouseover到该节点，然后mousemove的时候，是否优先检测该节点

    _this._eventEnabled = false; //是否响应事件交互,在添加了事件侦听后会自动设置为true

    _this.dragEnabled = opt.dragEnabled || false; //"dragEnabled" in opt ? opt.dragEnabled : false;   //是否启用元素的拖拽
    //拖拽drag的时候显示在activShape的副本

    _this._dragDuplicate = null;
    _this.type = _this.type || "shape"; //处理所有的图形一些共有的属性配置,把除开id,context之外的所有属性，全部挂载到this上面

    _this.initCompProperty(opt); //如果该元素是clone而来，则不需要绘制


    if (!_this.isClone) {
      //如果是clone对象的话就直接
      _this.graphics = new Graphics();

      _this._draw(_this.graphics);
    } else {
      _this.graphics = null;
    }

    return _this;
  }

  createClass$2(Shape, [{
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
  }]);

  return Shape;
}(DisplayObject);

var Text =
/*#__PURE__*/
function (_DisplayObject) {
  inherits$2(Text, _DisplayObject);

  function Text(text, opt) {
    var _this;

    classCallCheck$2(this, Text);

    opt.type = "text";

    if (text === null || text === undefined) {
      text = "";
    }
    opt.context = _$1.extend({
      font: "",
      fontSize: 13,
      //字体大小默认13
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
    _this = possibleConstructorReturn$2(this, getPrototypeOf$2(Text).call(this, opt));
    _this._reNewline = /\r?\n/;
    _this.fontProperts = ["fontStyle", "fontVariant", "fontWeight", "fontSize", "fontFamily"];
    _this.context.font = _this._getFontDeclaration();
    _this.text = text.toString();
    _this.context.width = _this.getTextWidth();
    _this.context.height = _this.getTextHeight();
    return _this;
  }

  createClass$2(Text, [{
    key: "$watch",
    value: function $watch(name, value, preValue) {
      //context属性有变化的监听函数
      if (_$1.indexOf(this.fontProperts, name) >= 0) {
        this.context[name] = value; //如果修改的是font的某个内容，就重新组装一遍font的值，
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
      var y = 0; //更具textAlign 和 textBaseline 重新矫正 xy

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


function SmoothSpline (opt) {
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
  iVtor = null; //基本上等于曲率

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
  sin: {},
  //sin缓存
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

var BrokenLine =
/*#__PURE__*/
function (_Shape) {
  inherits$2(BrokenLine, _Shape);

  function BrokenLine(opt) {
    var _this;

    classCallCheck$2(this, BrokenLine);

    opt = Utils.checkOpt(opt);

    var _context = _$1.extend(true, {
      lineType: null,
      smooth: false,
      pointList: [],
      //{Array}  // 必须，各个顶角坐标
      smoothFilter: Utils.__emptyFunc
    }, opt.context);

    if (!opt.isClone && _context.smooth) {
      _context.pointList = myMath.getSmoothPointList(_context.pointList, _context.smoothFilter);
    }
    opt.context = _context;
    opt.type = "brokenline";
    _this = possibleConstructorReturn$2(this, getPrototypeOf$2(BrokenLine).call(this, opt)); //保存好原始值

    _this._pointList = _context.pointList;
    return _this;
  }

  createClass$2(BrokenLine, [{
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

        if (myMath.isValibPoint(point)) {
          if (!beginPath) {
            graphics.moveTo(point[0], point[1]);
          } else {
            graphics.lineTo(point[0], point[1]);
          }
          beginPath = true;
        } else {
          beginPath = false;
        }
      }

      return this;
    }
  }]);

  return BrokenLine;
}(Shape);

var Circle$1 =
/*#__PURE__*/
function (_Shape) {
  inherits$2(Circle, _Shape);

  function Circle(opt) {
    classCallCheck$2(this, Circle);

    opt = _$1.extend(true, {
      type: "circle",
      xyToInt: false,
      context: {
        r: 0
      }
    }, Utils.checkOpt(opt));
    return possibleConstructorReturn$2(this, getPrototypeOf$2(Circle).call(this, opt));
  }

  createClass$2(Circle, [{
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

var Path =
/*#__PURE__*/
function (_Shape) {
  inherits$2(Path, _Shape);

  function Path(opt) {
    classCallCheck$2(this, Path);

    var _context = _$1.extend(true, {
      pointList: [],
      //从下面的path中计算得到的边界点的集合
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
    return possibleConstructorReturn$2(this, getPrototypeOf$2(Path).call(this, opt));
  }

  createClass$2(Path, [{
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
      var cs = data; // command chars

      var cc = ['m', 'M', 'l', 'L', 'v', 'V', 'h', 'H', 'z', 'Z', 'c', 'C', 'q', 'Q', 't', 'T', 's', 'S', 'a', 'A'];
      cs = cs.replace(/  /g, ' ');
      cs = cs.replace(/ /g, ','); //cs = cs.replace(/(.)-/g, "$1,-");

      cs = cs.replace(/(\d)-/g, '$1,-');
      cs = cs.replace(/,,/g, ',');
      var n; // create pipes so that we can split the data

      for (n = 0; n < cc.length; n++) {
        cs = cs.replace(new RegExp(cc[n], 'g'), '|' + cc[n]);
      } // create array


      var arr = cs.split('|');
      var ca = []; // init context point

      var cpx = 0;
      var cpy = 0;

      for (n = 1; n < arr.length; n++) {
        var str = arr[n];
        var c = str.charAt(0);
        str = str.slice(1);
        str = str.replace(new RegExp('e,-', 'g'), 'e-'); //有的时候，比如“22，-22” 数据可能会经常的被写成22-22，那么需要手动修改
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
          var y1 = cpy; // convert l, H, h, V, and v to L

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
    } //重新根的path绘制 graphics

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

var Droplet =
/*#__PURE__*/
function (_Path) {
  inherits$2(Droplet, _Path);

  function Droplet(opt) {
    var _this;

    classCallCheck$2(this, Droplet);

    opt = _$1.extend(true, {
      type: "droplet",
      context: {
        hr: 0,
        //{number},  // 必须，水滴横宽（中心到水平边缘最宽处距离）
        vr: 0 //{number},  // 必须，水滴纵高（中心到尖端距离）

      }
    }, Utils.checkOpt(opt));

    var my = _this = possibleConstructorReturn$2(this, getPrototypeOf$2(Droplet).call(this, opt));

    _this.context.$model.path = _this.createPath();
    return _this;
  }

  createClass$2(Droplet, [{
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

var Ellipse$1 =
/*#__PURE__*/
function (_Shape) {
  inherits$2(Ellipse, _Shape);

  function Ellipse(opt) {
    classCallCheck$2(this, Ellipse);

    opt = _$1.extend(true, {
      type: "ellipse",
      context: {
        hr: 0,
        //{number},  // 必须，水滴横宽（中心到水平边缘最宽处距离）
        vr: 0 //{number},  // 必须，水滴纵高（中心到尖端距离）

      }
    }, Utils.checkOpt(opt));
    return possibleConstructorReturn$2(this, getPrototypeOf$2(Ellipse).call(this, opt));
  }

  createClass$2(Ellipse, [{
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

var Polygon$1 =
/*#__PURE__*/
function (_Shape) {
  inherits$2(Polygon, _Shape);

  function Polygon(opt) {
    classCallCheck$2(this, Polygon);

    var _context = _$1.extend(true, {
      lineType: null,
      smooth: false,
      pointList: [],
      //{Array}  // 必须，各个顶角坐标
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
    return possibleConstructorReturn$2(this, getPrototypeOf$2(Polygon).call(this, opt));
  }

  createClass$2(Polygon, [{
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
      return;
    }
  }]);

  return Polygon;
}(Shape);

var Isogon =
/*#__PURE__*/
function (_Polygon) {
  inherits$2(Isogon, _Polygon);

  function Isogon(opt) {
    classCallCheck$2(this, Isogon);

    var _context = _$1.extend(true, {
      pointList: [],
      //从下面的r和n计算得到的边界值的集合
      r: 0,
      //{number},  // 必须，正n边形外接圆半径
      n: 0 //{number},  // 必须，指明正几边形

    }, opt.context);

    _context.pointList = myMath.getIsgonPointList(_context.n, _context.r);
    opt.context = _context;
    opt.type = "isogon";
    return possibleConstructorReturn$2(this, getPrototypeOf$2(Isogon).call(this, opt));
  }

  createClass$2(Isogon, [{
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
}(Polygon$1);

var Line =
/*#__PURE__*/
function (_Shape) {
  inherits$2(Line, _Shape);

  function Line(opt) {
    classCallCheck$2(this, Line);

    var _context = _$1.extend(true, {
      start: {
        x: 0,
        // 必须，起点横坐标
        y: 0 // 必须，起点纵坐标

      },
      end: {
        x: 0,
        // 必须，终点横坐标
        y: 0 // 必须，终点纵坐标

      }
    }, opt.context);

    opt.context = _context;
    opt.type = "line";
    return possibleConstructorReturn$2(this, getPrototypeOf$2(Line).call(this, opt));
  }

  createClass$2(Line, [{
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
      graphics.moveTo(model.start.x, model.start.y);
      graphics.lineTo(model.end.x, model.end.y);
      return this;
    }
  }]);

  return Line;
}(Shape);

var Rect =
/*#__PURE__*/
function (_Shape) {
  inherits$2(Rect, _Shape);

  function Rect(opt) {
    classCallCheck$2(this, Rect);

    var _context = _$1.extend(true, {
      width: 0,
      height: 0,
      radius: []
    }, opt.context);

    opt.context = _context;
    opt.type = "rect";
    return possibleConstructorReturn$2(this, getPrototypeOf$2(Rect).call(this, opt));
  }

  createClass$2(Rect, [{
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
      var model = this.context.$model; //左上、右上、右下、左下角的半径依次为r1、r2、r3、r4
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

var Sector =
/*#__PURE__*/
function (_Shape) {
  inherits$2(Sector, _Shape);

  function Sector(opt) {
    classCallCheck$2(this, Sector);

    var _context = _$1.extend(true, {
      pointList: [],
      //边界点的集合,私有，从下面的属性计算的来
      r0: 0,
      // 默认为0，内圆半径指定后将出现内弧，同时扇边长度 = r - r0
      r: 0,
      //{number},  // 必须，外圆半径
      startAngle: 0,
      //{number},  // 必须，起始角度[0, 360)
      endAngle: 0,
      //{number},  // 必须，结束角度(0, 360]
      clockwise: false //是否顺时针，默认为false(顺时针)

    }, opt.context);

    opt.context = _context;
    opt.regAngle = [];
    opt.isRing = false; //是否为一个圆环

    opt.type = "sector";
    return possibleConstructorReturn$2(this, getPrototypeOf$2(Sector).call(this, opt));
  }

  createClass$2(Sector, [{
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
      var model = this.context.$model; // 形内半径[0,r)

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
      endAngle = myMath.degreeToRadian(endAngle); //处理下极小夹角的情况
      //if( endAngle - startAngle < 0.025 ){
      //    startAngle -= 0.003
      //}

      var G = graphics; //G.beginPath();

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
            G.currentPath.strokeAlpha = 0;
            G.currentPath.line = false;
          }

          if (model.lineWidth && model.strokeStyle && model.strokeAlpha) {
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
      } //G.closePath();

    }
  }]);

  return Sector;
}(Shape);

var Line$1 =
/*#__PURE__*/
function (_Shape) {
  inherits$2(Line, _Shape);

  function Line(opt) {
    classCallCheck$2(this, Line);

    var _context = _$1.extend(true, {
      control: {
        x: 0,
        // 必须，起点横坐标
        y: 0 // 必须，起点纵坐标

      },
      point: {
        x: 0,
        // 必须，终点横坐标
        y: 0 // 必须，终点纵坐标

      },
      angle: null,
      // control的存在，也就是为了计算出来这个angle
      theta: 30,
      // 箭头夹角
      headlen: 6,
      // 斜边长度
      lineWidth: 1,
      strokeStyle: '#666',
      fillStyle: null
    }, opt.context);

    opt.context = _context;
    opt.type = "arrow";
    return possibleConstructorReturn$2(this, getPrototypeOf$2(Line).call(this, opt));
  }

  createClass$2(Line, [{
    key: "watch",
    value: function watch(name, value, preValue) {
      //并不清楚是start.x 还是end.x， 当然，这并不重要
      if (name == "x" || name == "y" || name == "theta" || name == "headlen" || name == "angle") {
        this.graphics.clear();
      }
    }
  }, {
    key: "draw",
    value: function draw(graphics) {
      var model = this.context.$model;
      var fromX = model.control.x;
      var fromY = model.control.y;
      var toX = model.point.x;
      var toY = model.point.y; // 计算各角度和对应的P2,P3坐标 

      var angle = model.angle != null ? model.angle - 180 : Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
          angle1 = (angle + model.theta) * Math.PI / 180,
          angle2 = (angle - model.theta) * Math.PI / 180,
          topX = model.headlen * Math.cos(angle1),
          topY = model.headlen * Math.sin(angle1),
          botX = model.headlen * Math.cos(angle2),
          botY = model.headlen * Math.sin(angle2);
      var arrowX = toX + topX;
      var arrowY = toY + topY;
      graphics.moveTo(arrowX, arrowY);
      graphics.lineTo(toX, toY);
      graphics.lineTo(toX + botX, toY + botY);

      if (model.fillStyle) {
        graphics.lineTo(arrowX, arrowY);
        graphics.closePath();
      }
      return this;
    }
  }]);

  return Line;
}(Shape);

var Canvax = {
  version: "2.0.67",
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
  Circle: Circle$1,
  Droplet: Droplet,
  Ellipse: Ellipse$1,
  Isogon: Isogon,
  Line: Line,
  Path: Path,
  Polygon: Polygon$1,
  Rect: Rect,
  Sector: Sector,
  Arrow: Line$1
};
Canvax.AnimationFrame = AnimationFrame;
Canvax.utils = Utils;

var chart = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_createClass2=interopRequireDefault(createClass$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_inherits2=interopRequireDefault(inherits$1),_canvax=interopRequireDefault(Canvax),_padding=20,Chart=function(t){function o(t,e,i,n){var a;return (0, _classCallCheck2.default)(this,o),(a=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(o).call(this))).componentModules=n,a._node=t,a._data=e,a._opt=i,a.dataFrame=a.initData(e,i),a.el=index_es.$.query(t),a.width=parseInt(a.el.offsetWidth),a.height=parseInt(a.el.offsetHeight),a.padding=null,a.canvax=new _canvax.default.App({el:a.el,webGL:!1}),a.canvax.registEvent(),a.id="chartx_"+a.canvax.id,a.el.setAttribute("chart_id",a.id),a.el.setAttribute("chartx_version","2.0"),a.stage=new _canvax.default.Display.Stage({id:"main-chart-stage"}),a.canvax.addChild(a.stage),a.setCoord_Graphs_Sp(),a.__highModules=["theme","coord","graphs"],a.components=[],a.inited=!1,a.init(),a}return (0, _inherits2.default)(o,t),(0, _createClass2.default)(o,[{key:"init",value:function(){var a=this,e=this._opt;for(var n in this.padding=this._getPadding(),index_es._.each(this.__highModules,function(n){if(e[n]){var t=index_es._.flatten([e[n]]);"theme"==n&&(t=[t]),index_es._.each(t,function(t){if(("coord"!=n||t.type)&&("graphs"!=n||t.field||t.keyField)){var e=a.componentModules.get(n,t.type);if(e){var i=new e(t,a);a.components.push(i);}}});}}),this._opt)if(-1==index_es._.indexOf(this.__highModules,n)){var t=this._opt[n];index_es._.isArray(t)||(t=[t]),index_es._.each(t,function(t){var e=a.componentModules.get(n,t.type);if(e){var i=new e(t,a);a.components.push(i);}});}}},{key:"draw",value:function(t){var i=this;t=t||{};var e=this.getComponent({name:"coord"});e&&e.horizontal&&this._drawBeginHorizontal();var n=this.width-this.padding.left-this.padding.right,a=this.height-this.padding.top-this.padding.bottom,o={x:this.padding.left,y:this.padding.top};if(e&&(e.draw(t),n=e.width,a=e.height,o=e.origin),0!=this.dataFrame.length){var s=this.getComponents({name:"graphs"}),r=s.length,h=0;t=index_es._.extend(t,{width:n,height:a,origin:o}),index_es._.each(s,function(e){e.on("complete",function(t){++h==r&&i.fire("complete"),e.inited=!0;}),e.draw(t);});for(var d=0,l=this.components.length;d<l;d++){var p=this.components[d];-1==index_es._.indexOf(this.__highModules,p.name)&&p.draw(t);}this._bindEvent(),e&&e.horizontal&&this._drawEndHorizontal();}else i.fire("complete");}},{key:"_drawBeginHorizontal",value:function(){var t=this.padding,e=t.top;t.top=t.right,t.right=t.bottom,t.bottom=t.left,t.left=e;}},{key:"_drawEndHorizontal",value:function(){var t=this.graphsSprite.context;t.x+=(this.width-this.height)/2,t.y+=(this.height-this.width)/2,t.rotation=90,t.rotateOrigin={x:this.height/2,y:this.width/2},this._horizontalGraphsText();}},{key:"_horizontalGraphsText",value:function(){index_es._.each(this.getComponents({name:"graphs"}),function(t){!function e(t){if(t.children&&index_es._.each(t.children,function(t){e(t);}),"text"==t.type&&!t.__horizontal){var i=t.context;i.width,i.height,i.rotation=i.rotation-90,t.__horizontal=!0;}}(t.sprite);});}},{key:"_getPadding",value:function(){var t=_padding;this._opt.coord&&"padding"in this._opt.coord&&(index_es._.isObject(this._opt.coord.padding)||(t=this._opt.coord.padding));var e={top:t,right:t,bottom:t,left:t};return this._opt.coord&&"padding"in this._opt.coord&&index_es._.isObject(this._opt.coord.padding)&&(e=index_es._.extend(e,this._opt.coord.padding)),e}},{key:"getTheme",value:function(t){var e=index_es.global.getGlobalTheme(),i=this.getComponent({name:"theme"});return i&&(e=i.get()),null!=t?e[t%e.length]||"#ccc":e}},{key:"setCoord_Graphs_Sp",value:function(){this.coordSprite=new _canvax.default.Display.Sprite({id:"coordSprite"}),this.stage.addChild(this.coordSprite),this.graphsSprite=new _canvax.default.Display.Sprite({id:"graphsSprite"}),this.stage.addChild(this.graphsSprite);}},{key:"destroy",value:function(){this.clean(),this.el&&(this.el.removeAttribute("chart_id"),this.el.removeAttribute("chartx_version"),this.canvax.destroy(),this.el=null),this._destroy&&this._destroy(),this.fire("destroy");}},{key:"clean",value:function(){for(var t=0,e=this.canvax.children.length;t<e;t++)for(var i=this.canvax.getChildAt(t),n=0,a=i.children.length;n<a;n++)i.getChildAt(n).destroy(),n--,a--;this.setCoord_Graphs_Sp(),this.components=[],this.canvax.domView.innerHTML="";}},{key:"resize",value:function(){var t=parseInt(this.el.offsetWidth),e=parseInt(this.el.offsetHeight);t==this.width&&e==this.height||(this.width=t,this.height=e,this.canvax.resize(),this.inited=!1,this.clean(),this.init(),this.draw({resize:!0}),this.inited=!0);}},{key:"reset",value:function(t,e){t&&(this._opt=t),e&&(this._data=e),this.dataFrame=this.initData(this._data,t),this.clean(),this.init(),this.draw();}},{key:"resetData",value:function(t,e){var i=this;this._data=t;var n=this.dataFrame.org.length;if(this.dataFrame.resetData(t),!n)return this.clean(),this.init(),void this.draw(this._opt);var a=this.getComponent({name:"coord"});a&&a.resetData(this.dataFrame,e),index_es._.each(this.getComponents({name:"graphs"}),function(t){t.resetData(i.dataFrame,e);}),this.componentsReset(e),a&&a.horizontal&&this._horizontalGraphsText(),this.fire("resetData");}},{key:"initData",value:function(){return index_es.dataFrame.apply(this,arguments)}},{key:"componentsReset",value:function(i){var n=this;index_es._.each(this.components,function(t,e){-1==index_es._.indexOf(n.__highModules,t.name)&&(i&&i.comp&&i.comp.__cid==t.__cid||t.reset&&t.reset(n[t.type]||{},n.dataFrame));});}},{key:"getComponentById",value:function(e){var i;return index_es._.each(this.components,function(t){if(t.id&&t.id==e)return i=t,!1}),i}},{key:"getComponent",value:function(t){return this.getComponents(t)[0]}},{key:"getComponents",value:function(n,t){var a=[],o=0;for(var e in t=t||this.components,n)o++;return o?(index_es._.each(t,function(t){var e=0;for(var i in n)JSON.stringify(t[i])==JSON.stringify(n[i])&&e++;o==e&&a.push(t);}),a):t}},{key:"getGraph",value:function(t){return this.getGraphs(t)[0]}},{key:"getGraphs",value:function(t){return this.getComponents(t,this.getComponents({name:"graphs"}))}},{key:"getGraphById",value:function(e){var i;return index_es._.each(this.getComponents({name:"graphs"}),function(t){if(t.id==e)return i=t,!1}),i}},{key:"getCoord",value:function(t){return this.getComponent(index_es._.extend(!0,{name:"coord"},t))}},{key:"getLegendData",value:function(){var n=this,a=[];if(index_es._.each(this.getComponents({name:"graphs"}),function(t){index_es._.each(t.getLegendData(),function(e){if(!index_es._.find(a,function(t){return t.name==e.name})){var t=index_es._.extend(!0,{},e);t.color=e.fillStyle||e.color||e.style,a.push(t);}});}),a.length)return a;var t=n.getComponent({name:"coord"});return index_es._.each(index_es._.flatten(t.fieldsMap),function(e,t){var i=!1;index_es._.each(n._opt.graphs,function(t){if(-1<index_es._.indexOf(index_es._.flatten([t.field]),e.field))return !(i=!0)}),i&&a.push({enabled:e.enabled,name:e.field,field:e.field,ind:e.ind,color:e.color,yAxis:e.yAxis});}),a}},{key:"show",value:function(e,i){var t=this.getComponent({name:"coord"});t&&t.show(e,i),index_es._.each(this.getComponents({name:"graphs"}),function(t){t.show(e,i);}),this.componentsReset(i);}},{key:"hide",value:function(e,i){var t=this.getComponent({name:"coord"});t&&t.hide(e,i),index_es._.each(this.getComponents({name:"graphs"}),function(t){t.hide(e,i);}),this.componentsReset(i);}},{key:"_bindEvent",value:function(){var n=this;this.on(index_es.event.types.get(),function(e){e.eventInfo&&index_es._.each(this.getGraphs(),function(t){t.triggerEvent(e);});var t=n.getComponent({name:"tips"}),i=n.getComponent({name:"coord"});t&&(n._setGraphsTipsInfo.apply(n,[e]),"mouseover"!=e.type&&"mousedown"!=e.type||(t.show(e),n._tipsPointerAtAllGraphs(e)),"mousemove"==e.type&&(t.move(e),n._tipsPointerAtAllGraphs(e)),"mouseout"!=e.type||e.toTarget&&i&&i.induce&&i.induce.containsPoint(i.induce.globalToLocal(e.target.localToGlobal(e.point)))||(t.hide(e),n._tipsPointerHideAtAllGraphs(e)));});}},{key:"_setGraphsTipsInfo",value:function(e){e.eventInfo||(e.eventInfo={});var t=this.getComponent({name:"coord"});if(t&&(e.eventInfo=t.getTipsInfoHandler(e)),"tipsEnabled"in e.eventInfo||(e.eventInfo.tipsEnabled=!0),!e.eventInfo.nodes||!e.eventInfo.nodes.length){var i=[],n=e.eventInfo.iNode;index_es._.each(this.getComponents({name:"graphs"}),function(t){i=i.concat(t.getNodesAt(n,e));}),e.eventInfo.nodes=i;}}},{key:"_tipsPointerAtAllGraphs",value:function(e){index_es._.each(this.getComponents({name:"graphs"}),function(t){t.tipsPointerOf(e);});}},{key:"_tipsPointerHideAtAllGraphs",value:function(e){index_es._.each(this.getComponents({name:"graphs"}),function(t){t.tipsPointerHideOf(e);});}}]),o}(index_es.event.Dispatcher);index_es.global.registerComponent(Chart,"chart");var _default=Chart;exports.default=_default;
});

unwrapExports(chart);

var component = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_assertThisInitialized2=interopRequireDefault(assertThisInitialized$1),_createClass2=interopRequireDefault(createClass$1),_inherits2=interopRequireDefault(inherits$1),_canvax=interopRequireDefault(Canvax),Component=function(e){function i(e,t){var r;return (0, _classCallCheck2.default)(this,i),r=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(i).call(this,e,t)),index_es._.extend(!0,(0, _assertThisInitialized2.default)(r),(0, index_es.getDefaultProps)(i.defaultProps()),e),r.name="component",r.type=null,r._opt=e,r.app=t,r.width=0,r.height=0,r.pos={x:0,y:0},r.margin={top:0,right:0,bottom:0,left:0},r.__cid=_canvax.default.utils.createId("comp_"),r}return (0, _inherits2.default)(i,e),(0, _createClass2.default)(i,null,[{key:"defaultProps",value:function(){return {enabled:{detail:"是否开启该组件",default:!1}}}},{key:"_isComponentRoot",value:function(){return !0}}]),(0, _createClass2.default)(i,[{key:"init",value:function(){}},{key:"draw",value:function(){}},{key:"destroy",value:function(){}},{key:"reset",value:function(){}},{key:"resetData",value:function(){console.log((this.type||"")+"暂无resetData的实现");}},{key:"setPosition",value:function(e){(e=e||this.pos).x&&(this.sprite.context.x=e.x),e.y&&(this.sprite.context.y=e.y);}},{key:"layout",value:function(){}}]),i}(index_es.event.Dispatcher);exports.default=Component;
});

unwrapExports(component);

var coord = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_assertThisInitialized2=interopRequireDefault(assertThisInitialized$1),_createClass2=interopRequireDefault(createClass$1),_inherits2=interopRequireDefault(inherits$1),_component=interopRequireDefault(component),_canvax=interopRequireDefault(Canvax),coordBase=function(e){function r(e,i){var t;return (0, _classCallCheck2.default)(this,r),t=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(r).call(this,e,i)),index_es._.extend(!0,(0, _assertThisInitialized2.default)(t),(0, index_es.getDefaultProps)(r.defaultProps())),t.name="coord",t._opt=e,t.app=i,t.dataFrame=t.app.dataFrame,t.sprite=new _canvax.default.Display.Sprite({name:"coord_"+e.type}),t.app.coordSprite.addChild(t.sprite),t.fieldsMap=null,t.induce=null,t._axiss=[],t}return (0, _inherits2.default)(r,e),(0, _createClass2.default)(r,null,[{key:"defaultProps",value:function(){return {type:{detail:"坐标系组件",documentation:"坐标系组件，可选值有'rect'（二维直角坐标系）,'polar'（二维极坐标系）,'box'（三维直角坐标系） ",insertText:"type: ",default:"",values:["rect","polar","box","polar3d"]},width:{detail:"坐标系width",default:0},height:{detail:"坐标系height",default:0},origin:{detail:"坐标系原点",propertys:{x:{detail:"原点x位置",default:0},y:{detail:"原点x位置",default:0}}}}}}]),(0, _createClass2.default)(r,[{key:"setFieldsMap",value:function(e){var n=this,l=0,s=e.type||"yAxis",i=[];return index_es._.each(this.getAxiss(e),function(e){e.field&&(i=i.concat(e.field));}),function e(i){index_es._.isString(i)&&(i=[i]);for(var t=index_es._.clone(i),r=0,a=i.length;r<a;r++)index_es._.isString(i[r])&&(t[r]={field:i[r],enabled:!0,color:n.app.getTheme(l),ind:l++},t[r][s]=n.getAxis({type:s,field:i[r]})),index_es._.isArray(i[r])&&(t[r]=e(i[r]));return t}(i)}},{key:"setFieldEnabled",value:function(r){!function t(e){index_es._.each(e,function(e,i){index_es._.isArray(e)?t(e):e.field&&e.field==r&&(e.enabled=!e.enabled);});}(this.fieldsMap);}},{key:"getFieldMapOf",value:function(r){var a=null;return function t(e){index_es._.each(e,function(e,i){if(index_es._.isArray(e))t(e);else if(e.field&&e.field==r)return a=e,!1});}(this.fieldsMap),a}},{key:"getEnabledFieldsOf",value:function(r){var a=[],n=r?r.type:"yAxis";return index_es._.each(this.fieldsMap,function(e,i){if(index_es._.isArray(e)){var t=[];index_es._.each(e,function(e,i){e[n]===r&&e.field&&e.enabled&&t.push(e.field);}),t.length&&a.push(t);}else e[n]===r&&e.field&&e.enabled&&a.push(e.field);}),a}},{key:"filterEnabledFields",value:function(e){var t=this,r=[];return index_es._.isArray(e)||(e=[e]),index_es._.each(e,function(e){if(index_es._.isArray(e)){var i=[];index_es._.each(e,function(e){t.getFieldMapOf(e).enabled&&i.push(e);}),i.length&&r.push(i);}else t.getFieldMapOf(e).enabled&&r.push(e);}),r}},{key:"getAxisDataFrame",value:function(e){return {field:e,org:this.dataFrame.getDataOrg(e,function(e){return null==e||""==e?e:isNaN(Number(e))?e:Number(e)})}}},{key:"hide",value:function(e){this.changeFieldEnabled(e);}},{key:"show",value:function(e){this.changeFieldEnabled(e);}},{key:"getSizeAndOrigin",value:function(){return {width:this.width,height:this.height,origin:this.origin}}},{key:"getPoint",value:function(){}},{key:"getAxisOriginPoint",value:function(){}},{key:"getOriginPos",value:function(){}},{key:"getAxis",value:function(e){return this.getAxiss(e)[0]}},{key:"getAxiss",value:function(l){var s=[],u=0;for(var e in l)u++;return index_es._.each(this._axiss,function(e){var i=0;for(var t in l)if("field"==t){var r=index_es._.flatten([e[t]]),a=index_es._.flatten([l[t]]),n=!0;index_es._.each(a,function(e){-1==index_es._.indexOf(r,e)&&(n=!1);}),n&&i++;}else JSON.stringify(e[t])==JSON.stringify(l[t])&&i++;u==i&&s.push(e);}),s}}]),r}(_component.default);exports.default=coordBase;
});

unwrapExports(coord);

var tools = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.numAddSymbol=numAddSymbol,exports.getDisMinATArr=getDisMinATArr,exports.getPath=getPath;function numAddSymbol(r,t){var e=Number(r),n=t||",";if(!e)return String(r);if(1e3<=e){var i=parseInt(e/1e3);return String(r.toString().replace(i,i+n))}return String(r)}function getDisMinATArr(r,t){for(var e=0,n=Math.abs(r-t[0]),i=1,a=t.length;i<a;i++)n>Math.abs(r-t[i])&&(n=Math.abs(r-t[i]),e=i);return e}function getPath(r){var t="",e={x:0,y:0};t=index_es._.isArray(r[0])?(e.x=r[0][0],e.y=r[0][1],"M"+r[0][0]+" "+r[0][1]):(e=r[0],"M"+r[0].x+" "+r[0].y);for(var n=1,i=r.length;n<i;n++){var a=0,s=0,u=r[n];s=index_es._.isArray(u)?(a=u[0],u[1]):(a=u.x,u.y),a==e.x&&s==e.y?t+=" z":t+=" L"+a+" "+s;}return t}
});

unwrapExports(tools);
var tools_1 = tools.numAddSymbol;
var tools_2 = tools.getDisMinATArr;
var tools_3 = tools.getPath;

var axis$1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_assertThisInitialized2=interopRequireDefault(assertThisInitialized$1),_createClass2=interopRequireDefault(createClass$1),_inherits2=interopRequireDefault(inherits$1),Axis=function(e){function a(e,t,l){var i;return (0, _classCallCheck2.default)(this,a),i=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(a).call(this,e,t)),index_es._.extend(!0,(0, _assertThisInitialized2.default)(i),(0, index_es.getDefaultProps)(a.defaultProps())),i}return (0, _inherits2.default)(a,e),(0, _createClass2.default)(a,null,[{key:"defaultProps",value:function(){return {field:{detail:"轴字段配置",documentation:"目前x轴的field只支持单维度设置，也就是说只支持一条x轴",default:[]},layoutType:{detail:"布局方式",default:"rule"},width:{detail:"轴宽",default:0},height:{detail:"轴高",default:0},enabled:{detail:"是否显示轴",default:!0},animation:{detail:"是否开启动画",default:!0},title:{detail:"轴名称",propertys:{shapeType:"text",textAlign:{detail:"水平对齐方式",default:"center"},textBaseline:{detail:"基线对齐方式",default:"middle"},strokeStyle:{detail:"文本描边颜色",default:null},lineHeight:{detail:"行高",default:0},text:{detail:"轴名称的内容",default:""},fontColor:{detail:"颜色",default:"#999"},fontSize:{detail:"字体大小",default:12}}},tickLine:{detail:"刻度线",propertys:{enabled:{detail:"是否开启",default:!0},lineWidth:{detail:"刻度线宽",default:1},lineLength:{detail:"刻度线长度",default:4},distance:{detail:"和前面一个元素的距离",default:2},strokeStyle:{detail:"描边颜色",default:"#cccccc"}}},axisLine:{detail:"轴线配置",propertys:{enabled:{detail:"是否有轴线",default:!0},position:{detail:"轴线的位置",documentation:'default在align的位置（left，right），可选 "center" 和 具体的值',default:"default"},lineWidth:{detail:"轴线宽度",default:1},strokeStyle:{detail:"轴线的颜色",default:"#cccccc"}}},label:{detail:"刻度文本",propertys:{enabled:{detail:"是否显示刻度文本",default:!0},fontColor:{detail:"文本颜色",default:"#999"},fontSize:{detail:"字体大小",default:12},rotation:{detail:"旋转角度",default:0},format:{detail:"label文本的格式化处理函数",default:null},distance:{detail:"和轴线之间的间距",default:2},textAlign:{detail:"水平方向对齐方式",default:"center"},lineHeight:{detail:"文本的行高",default:1},evade:{detail:"是否开启逃避算法,目前的逃避只是隐藏",default:!0}}},filter:{detail:"过滤函数",documentation:"可以用来过滤哪些yaxis 的 节点是否显示已经颜色之类的",default:null},trimLayout:{detail:"自定义的显示规则函数",documentation:"如果用户有手动的 trimLayout ，那么就全部visible为true，然后调用用户自己的过滤程序",default:null}}}}]),(0, _createClass2.default)(a,[{key:"drawWaterLine",value:function(e){"proportion"==this.layoutType&&e>=this._min&&e<=this._max||(this.dataSection=[],this.setWaterLine(e),this._initHandle(),this.draw());}}]),a}(index_es.axis);exports.default=Axis;
});

unwrapExports(axis$1);

var xaxis = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_assertThisInitialized2=interopRequireDefault(assertThisInitialized$1),_createClass2=interopRequireDefault(createClass$1),_inherits2=interopRequireDefault(inherits$1),_canvax=interopRequireDefault(Canvax),_axis=interopRequireDefault(axis$1),Line=_canvax.default.Shapes.Line,xAxis=function(t){function l(t,e,i){var a;return (0, _classCallCheck2.default)(this,l),(a=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(l).call(this,t,e.org))).type="xAxis",a._coord=i||{},a._title=null,a._axisLine=null,a._formatTextSection=[],a._textElements=[],a.pos={x:0,y:0},a.layoutData=[],a.sprite=null,a.isH=!1,index_es._.extend(!0,(0, _assertThisInitialized2.default)(a),(0, index_es.getDefaultProps)(l.defaultProps()),t),a.init(t),a}return (0, _inherits2.default)(l,t),(0, _createClass2.default)(l,null,[{key:"defaultProps",value:function(){return {}}}]),(0, _createClass2.default)(l,[{key:"init",value:function(t){this._setField(),this._initHandle(t),this.sprite=new _canvax.default.Display.Sprite({id:"xAxisSprite_"+(new Date).getTime()}),this.rulesSprite=new _canvax.default.Display.Sprite({id:"xRulesSprite_"+(new Date).getTime()}),this.sprite.addChild(this.rulesSprite);}},{key:"_initHandle",value:function(t){var a=this;t&&(!t.isH||t.label&&void 0!==t.label.rotaion||(this.label.rotation=90)),this.setDataSection(),a._formatTextSection=[],a._textElements=[],index_es._.each(a.dataSection,function(t,e){a._formatTextSection[e]=a._getFormatText(t,e);var i=new _canvax.default.Display.Text(a._formatTextSection[e],{context:{fontSize:a.label.fontSize}});a._textElements[e]=i;}),0!=this.label.rotation&&(this.label.textAlign="right"),this._getTitle(),this._setXAxisHeight();}},{key:"_setField",value:function(t){t&&(this.field=t),this.field=index_es._.flatten([this.field])[0];}},{key:"draw",value:function(t){t&&index_es._.extend(!0,this,t),this.setAxisLength(this.width),this._trimXAxis(),this._widget(t),this.setX(this.pos.x),this.setY(this.pos.y);}},{key:"resetData",value:function(t){this._setField(t.field),this.resetDataOrg(t.org),this._initHandle(),this.draw();}},{key:"setX",value:function(t){this.sprite.context.x=t,this.pos.x=t;}},{key:"setY",value:function(t){this.sprite.context.y=t,this.pos.y=t;}},{key:"_getTitle",value:function(){this.title.text&&(this._title?this._title.resetText(this.title.text):this._title=new _canvax.default.Display.Text(this.title.text,{context:{fontSize:this.title.fontSize,textAlign:this.title.textAlign,textBaseline:this.title.textBaseline,fillStyle:this.title.fontColor,strokeStyle:this.title.strokeStyle,lineWidth:this.title.lineWidth,rotation:this.isH?-180:0}}));}},{key:"_setXAxisHeight",value:function(){var h=this;if(h.enabled){var o=0;this.label.enabled&&index_es._.each(h.dataSection,function(t,e){var i=h._textElements[e],a=i.getTextWidth(),l=i.getTextHeight(),s=l;if(h.label.rotation)if(90==h.label.rotation)s=a;else{var n=Math.sin(Math.abs(h.label.rotation)*Math.PI/180),r=Math.cos(Math.abs(h.label.rotation)*Math.PI/180);s=parseInt(n*a),parseInt(r*a);}o=Math.max(o,s);}),this.height=o+this.tickLine.lineLength+this.tickLine.distance+this.label.distance,this._title&&(this.height+=this._title.getTextHeight());}else h.height=0;}},{key:"getNodeInfoOfX",value:function(t){var e=this.getIndexOfPos(t),i=this.getValOfInd(e),a=this.getPosOf({ind:e,val:i});return this._getNodeInfo(e,i,a)}},{key:"getNodeInfoOfVal",value:function(t){var e=this.getIndexOfVal(t),i=this.getPosOf({ind:e,val:t});return this._getNodeInfo(e,t,i)}},{key:"_getNodeInfo",value:function(t,e,i){return {ind:t,value:e,text:this._getFormatText(e,t),x:i,field:this.field,layoutType:this.layoutType}}},{key:"_trimXAxis",value:function(){for(var t=[],e=this.dataSection,i=0,a=e.length;i<a;i++){var l=this._formatTextSection[i],s=this._textElements[i],n={ind:i,value:e[i],text:l,x:this.getPosOf({val:e[i],ind:i}),textWidth:s.getTextWidth(),field:this.field,visible:null};t.push(n);}return this.layoutData=t,this._trimLayoutData(),t}},{key:"_getFormatText",value:function(t){var e=t;return index_es._.isFunction(this.label.format)&&(e=this.label.format.apply(this,arguments)),index_es._.isNumber(e)&&"proportion"==this.layoutType&&(e=(0, tools.numAddSymbol)(e)),e}},{key:"_widget",value:function(t){var e=this;if(t=t||{},e.enabled){for(var i=e.layoutData,a=0,l=0,s=i.length;l<s;l++){index_es._.isFunction(e.filter)&&e.filter({layoutData:i,index:l});var n=i[l];if(n.visible){var r=n.x,h=e.tickLine.lineLength+e.tickLine.distance+e.label.distance,o=e.rulesSprite.getChildAt(a),u={x:n._text_x||n.x,y:h,fillStyle:this.label.fontColor,fontSize:this.label.fontSize,rotation:-Math.abs(this.label.rotation),textAlign:this.label.textAlign,lineHeight:this.label.lineHeight,textBaseline:this.label.rotation?"middle":"top",globalAlpha:1};this.label.rotation&&90!=this.label.rotation&&(u.x+=5,u.y+=3);var d={x:r,y:this.tickLine.distance,end:{x:0,y:this.tickLine.lineLength},lineWidth:this.tickLine.lineWidth,strokeStyle:this.tickLine.strokeStyle},x=300,_=a*Math.min(1e3/i.length,25);e.animation&&!t.resize||(_=x=0),o?(o._tickLine&&e.tickLine.enabled&&o._tickLine.animate(d,{duration:x,id:o._tickLine.id}),o._txt&&e.label.enabled&&(o._txt.animate(u,{duration:x,id:o._txt.id}),o._txt.resetText(n.text))):(o=new _canvax.default.Display.Sprite({id:"xNode"+a}),e.tickLine.enabled&&(o._tickLine=new Line({id:"xAxis_tickline_"+a,context:d}),o.addChild(o._tickLine)),e.label.enabled&&(o._txt=new _canvax.default.Display.Text(n.text,{id:"xAxis_txt_"+a,context:u}),o.addChild(o._txt),e.animation&&!t.resize&&(o._txt.context.y+=20,o._txt.context.globalAlpha=0,o._txt.animate({y:u.y,globalAlpha:1},{duration:500,delay:_,id:o._txt.id}))),e.rulesSprite.addChild(o)),a++;}}if(this.rulesSprite.children.length>=a){s=a;for(var f=this.rulesSprite.children.length;s<f;s++)this.rulesSprite.getChildAt(s).remove(),s--,f--;}if(this.axisLine.enabled){var c={start:{x:0,y:0},end:{x:this.width,y:0},lineWidth:this.axisLine.lineWidth,strokeStyle:this.axisLine.strokeStyle};if(this._axisLine)this._axisLine.animate(c);else{var v=new Line({context:c});this.sprite.addChild(v),this._axisLine=v;}}this._title&&(this._title.context.y=this.height-this._title.getTextHeight()/2,this._title.context.x=this.width/2,this.sprite.addChild(this._title));}else e.height=0;}},{key:"_trimLayoutData",value:function(){var t=this.layoutData.length;this.enabled&&t&&("proportion"==this.layoutType&&this._checkOver(),"peak"==this.layoutType&&this._checkOver(),"rule"==this.layoutType&&this._checkOver());}},{key:"_getRootPR",value:function(){var t=0;return this._coord.app&&(t=this._coord.app.padding.right),t}},{key:"_checkOver",value:function(){var o=this,u=o.layoutData,d=u.length,x=o.label.textAlign;if(this.label.evade&&!o.trimLayout)!function t(e){var i=u[e];if(void 0!==i){i.visible=!0;for(var a=e;a<d-1;a++){var l=u[a+1],s=l.textWidth,n=i.textWidth;o.label.rotation&&(s=Math.min(s,22),n=Math.min(n,22));var r=l.x,h=i.x+n;if("center"==x&&(r=l.x-s/2,h=i.x+n/2),"right"==x&&(r=l.x-s,h=i.x),a==d-2&&r+s>o.width+o._getRootPR()&&("center"==x&&l.x+s/2>o.width&&(r=o.width-s,l._text_x=o.width-s/2+o._getRootPR()),"left"==x&&l.x+s>o.width&&(r=o.width-s,l._text_x=o.width-s)),!(r-h<1)){t(a+1);break}if(a==d-2)return l.visible=!0,void(i.visible=!1);l.visible=!1;}}}(0);else{var t;index_es._.each(u,function(t){t.visible=!0;}),o.trimLayout&&o.trimLayout(u);for(var e=d-1;0<=e&&!t;e--)u[e].visible&&(t=u[e]);t&&("center"==x&&t.x+t.textWidth/2>o.width&&(t._text_x=o.width-t.textWidth/2+o._getRootPR()),"left"==x&&t.x+t.textWidth>o.width&&(t._text_x=o.width-t.textWidth));}}}]),l}(_axis.default);exports.default=xAxis;
});

unwrapExports(xaxis);

var yaxis = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_assertThisInitialized2=interopRequireDefault(assertThisInitialized$1),_createClass2=interopRequireDefault(createClass$1),_inherits2=interopRequireDefault(inherits$1),_canvax=interopRequireDefault(Canvax),_axis=interopRequireDefault(axis$1),Line=_canvax.default.Shapes.Line,yAxis=function(t){function a(t,e,i){var l;return (0, _classCallCheck2.default)(this,a),(l=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(a).call(this,t,e.org))).type="yAxis",l._coord=i||{},l._title=null,l._axisLine=null,l.maxW=0,l.pos={x:0,y:0},l.yMaxHeight=0,l.layoutData=[],l.sprite=null,l.isH=!1,index_es._.extend(!0,(0, _assertThisInitialized2.default)(l),(0, index_es.getDefaultProps)(a.defaultProps()),t),l.init(t),l}return (0, _inherits2.default)(a,t),(0, _createClass2.default)(a,null,[{key:"defaultProps",value:function(){return {align:{detail:"左右轴设置",default:"left"},layoutType:{detail:"布局方式",default:"proportion"}}}}]),(0, _createClass2.default)(a,[{key:"init",value:function(t){this._setField(),this._initHandle(t),this.sprite=new _canvax.default.Display.Sprite({id:"yAxisSprite_"+(new Date).getTime()}),this.rulesSprite=new _canvax.default.Display.Sprite({id:"yRulesSprite_"+(new Date).getTime()}),this.sprite.addChild(this.rulesSprite);}},{key:"_initHandle",value:function(t){t&&(!t.isH||t.label&&void 0!==t.label.rotaion||(this.label.rotation=90),t.label&&t.label.textAlign||(this.label.textAlign="left"==this.align?"right":"left")),this.setDataSection(),this._getTitle(),this._setYaxisWidth();}},{key:"_setField",value:function(t){t&&(this.field=t),index_es._.isArray(this.field)||(this.field=[this.field]);}},{key:"draw",value:function(t){index_es._.extend(!0,this,t||{}),this.height=parseInt(this.yMaxHeight-this._getYAxisDisLine()),this.setAxisLength(this.height),this.sprite.cleanAnimates(),this._trimYAxis(),this._widget(t),this.setX(this.pos.x),this.setY(this.pos.y);}},{key:"resetData",value:function(t){this._setField(t.field),this.resetDataOrg(t.org),this._initHandle(),this.draw();}},{key:"setX",value:function(t){this.sprite.context.x=t,this.pos.x=t;}},{key:"setY",value:function(t){this.sprite.context.y=t,this.pos.y=t;}},{key:"_getTitle",value:function(){if(this.title.text)if(this._title)this._title.resetText(this.title.text);else{var t=0;"left"==this.align?t=-90:(t=90,this.isH&&(t=270)),this._title=new _canvax.default.Display.Text(this.title.text,{context:{fontSize:this.title.fontSize,textAlign:this.title.textAlign,textBaseline:this.title.textBaseline,fillStyle:this.title.fontColor,strokeStyle:this.title.strokeStyle,lineWidth:this.title.lineWidth,rotation:t}});}}},{key:"_setYaxisWidth",value:function(){}},{key:"_trimYAxis",value:function(){for(var t=this,e=[],i=0,l=this.dataSection.length;i<l;i++){var a={value:this.dataSection[i],y:-Math.abs(this.getPosOf({val:this.dataSection[i],ind:i})),visible:!0,text:""},s=a.value;index_es._.isFunction(t.label.format)&&(s=t.label.format.apply(this,[s,i])),null==s&&"proportion"==t.layoutType&&(s=(0, tools.numAddSymbol)(a.value)),a.text=s,e.push(a);}for(var n=0,r=0,h=e.length;r<h;r++)0!=r&&(0==n?e[r].text==e[n].text?e[r].visible=!1:n=r:(e[r].text==e[n].text&&(e[n].visible=!1),n=r));this.layoutData=e,this.trimLayout&&this.trimLayout(e);}},{key:"_getYAxisDisLine",value:function(){var t=0;return t=0<(t=0+this.yMaxHeight%this.dataSection.length)?0:t}},{key:"resetWidth",value:function(t){var e=this;e.width=t,"left"==e.align&&(e.rulesSprite.context.x=e.width);}},{key:"_widget",value:function(t){var e=this;if(t=t||{},e.enabled){for(var i=this.layoutData,l=0,a=e.maxW=0,s=i.length;a<s;a++){index_es._.isFunction(e.filter)&&e.filter({layoutData:i,index:a});var n=i[a];if(n.visible){var r=n.y,h=e.label.textAlign,o=r+(0==a?-3:0)+(a==i.length-1?3:0);90!=e.label.rotation&&-90!=e.label.rotation||(h="center",a==i.length-1&&(o=r-2,h="right"),0==a&&(o=r));var u=16;n.value==e.origin&&(u=0),n.value<e.origin&&(u=-16);var d,x,_=0;if(e.tickLine.enabled&&(d={x:_="left"==e.align?-e.tickLine.lineLength-e.tickLine.distance:e.tickLine.distance,y:r,end:{x:e.tickLine.lineLength,y:0},lineWidth:e.tickLine.lineWidth,strokeStyle:e._getStyle(e.tickLine.strokeStyle)}),e.label.enabled){var c="left"==e.align?_-e.label.distance:_+e.tickLine.lineLength+e.label.distance;this.isH&&(c+=4*("left"==e.align?-1:1)),x={x:c,y:o,fillStyle:e._getStyle(e.label.fontColor),fontSize:e.label.fontSize,rotation:-Math.abs(e.label.rotation),textAlign:h,textBaseline:"middle",lineHeight:e.label.lineHeight,globalAlpha:1};}var f=300;e.animation&&!t.resize||(f=0);var p=this.rulesSprite.getChildAt(l);p?(p._tickLine&&e.tickLine.enabled&&p._tickLine.animate(d,{duration:f,id:p._tickLine.id}),p._txt&&e.label.enabled&&(p._txt.animate(x,{duration:f,id:p._txt.id}),p._txt.resetText(n.text))):(p=new _canvax.default.Display.Sprite({id:"_node"+l}),e.tickLine.enabled&&(p._tickLine=new Line({id:"yAxis_tickline_"+l,context:d}),p.addChild(p._tickLine)),e.label.enabled&&(p._txt=new _canvax.default.Display.Text(n.text,{id:"yAxis_txt_"+l,context:x}),p.addChild(p._txt),90==e.label.rotation||-90==e.label.rotation?e.maxW=Math.max(e.maxW,p._txt.getTextHeight()):e.maxW=Math.max(e.maxW,p._txt.getTextWidth()),e.animation&&!t.resize&&(p._txt.context.y=r+u,p._txt.context.globalAlpha=0,p._txt.animate({y:x.y,globalAlpha:1},{duration:300,id:p._txt.id}))),e.rulesSprite.addChild(p)),l++;}}if(e.rulesSprite.children.length>=l){s=l;for(var g=e.rulesSprite.children.length;s<g;s++)e.rulesSprite.getChildAt(s).remove(),s--,g--;}e.width||"width"in e._opt||(e.width=parseInt(e.maxW+e.label.distance),e.tickLine.enabled&&(e.width+=parseInt(e.tickLine.lineLength+e.tickLine.distance)),e._title&&(e.width+=e._title.getTextHeight()));var y=0;if("left"==e.align&&(e.rulesSprite.context.x=e.width,y=e.width),e.axisLine.enabled){var v={start:{x:y,y:0},end:{x:y,y:-e.height},lineWidth:e.axisLine.lineWidth,strokeStyle:e._getStyle(e.axisLine.strokeStyle)};if(this._axisLine)this._axisLine.animate(v);else{var b=new Line({context:v});this.sprite.addChild(b),this._axisLine=b;}}this._title&&(this._title.context.y=-this.height/2,this._title.context.x=this._title.getTextHeight()/2,"right"==this.align&&(this._title.context.x=this.width-this._title.getTextHeight()/2),this.sprite.addChild(this._title));}else e.width=0;}},{key:"_getStyle",value:function(t){var e=t;return index_es._.isFunction(t)&&(e=t.call(this,this)),t||(e="#999"),e}}]),a}(_axis.default);exports.default=yAxis;
});

unwrapExports(yaxis);

var grid = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_assertThisInitialized2=interopRequireDefault(assertThisInitialized$1),_createClass2=interopRequireDefault(createClass$1),_inherits2=interopRequireDefault(inherits$1),_canvax=interopRequireDefault(Canvax),Line=_canvax.default.Shapes.Line,Rect=_canvax.default.Shapes.Rect,rectGrid=function(e){function l(e,i){var t;return (0, _classCallCheck2.default)(this,l),t=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(l).call(this,e,i)),index_es._.extend(!0,(0, _assertThisInitialized2.default)(t),(0, index_es.getDefaultProps)(l.defaultProps())),t.width=0,t.height=0,t._coord=i,t.pos={x:0,y:0},t.sprite=null,t.xAxisSp=null,t.yAxisSp=null,t.init(e),t}return (0, _inherits2.default)(l,e),(0, _createClass2.default)(l,null,[{key:"defaultProps",value:function(){return {enabled:{detail:"是否开启grid绘制",default:!0},line:{detail:"网格线条配置",propertys:{xDimension:{detail:"一维方向的网格线",propertys:{enabled:{detail:"是否开启",default:!0},data:[],lineType:{detail:"线的样式，虚线或者实现",default:"solid"},lineWidth:{detail:"线宽",default:1},strokeStyle:{detail:"线颜色",default:"#f0f0f0"}}},yDimension:{detail:"二维方向的网格线",propertys:{enabled:{detail:"是否开启",default:!1},data:[],lineType:{detail:"线的样式，虚线或者实现",default:"solid"},lineWidth:{detail:"线宽",default:1},strokeStyle:{detail:"线颜色",default:"#f0f0f0"}}}}},fill:{detail:"背景色配置",propertys:{xDimension:{detail:"以为方向的背景色块，x方向",propertys:{enabled:{detail:"是否开启",default:!1},splitVals:{detail:"从x轴上面用来分割区块的vals",default:null},fillStyle:{detail:"背景颜色",default:null},alpha:{detail:"背景透明度",default:null}}},yDimension:{detail:"以为方向的背景色块，y方向",propertys:{enabled:{detail:"是否开启",default:!1},splitVals:{detail:"从x轴上面用来分割区块的vals",default:null},fillStyle:{detail:"背景颜色",default:null},alpha:{detail:"背景透明度",default:null}}}}}}}}]),(0, _createClass2.default)(l,[{key:"init",value:function(e){index_es._.extend(!0,this,e),this.sprite=new _canvax.default.Display.Sprite;}},{key:"setX",value:function(e){this.sprite.context.x=e;}},{key:"setY",value:function(e){this.sprite.context.y=e;}},{key:"draw",value:function(e){index_es._.extend(!0,this,e),this._widget(),this.setX(this.pos.x),this.setY(this.pos.y);}},{key:"clean",value:function(){this.sprite.removeAllChildren();}},{key:"reset",value:function(e){this.sprite.removeAllChildren(),this.draw(e);}},{key:"_widget",value:function(){var u=this;if(this.enabled){var o=u._coord._yAxis[0],p=u._coord._xAxis;this.fillSp=new _canvax.default.Display.Sprite,this.sprite.addChild(this.fillSp),index_es._.each([u.fill.xDimension,u.fill.yDimension],function(a,n){var e=n?o:p,i=[];if(a.enabled){a.splitVals?(i=[e.dataSection[0]].concat(index_es._.flatten([a.splitVals]))).push(e.dataSection.slice(-1)[0]):i=e.dataSection;var t=[];if(2<=i.length){for(var l=[],s=0,r=i.length;s<r;s++){var d=e.getPosOf({val:i[s]});if(l.length){if(1==l.length){if(d-l[0]<1)continue;l.push(d),t.push(l),l=[l[1]];}}else l.push(d);}index_es._.each(t,function(e,i){var t={fillStyle:u.getProp(a.fillStyle,i,"#000"),fillAlpha:u.getProp(a.alpha,i,i%2*.02)};n?(t.x=0,t.y=-e[0],t.width=u.width,t.height=-(e[1]-e[0])):(t.x=e[0],t.y=0,t.width=e[1]-e[0],t.height=-u.height);var l=new Rect({context:t});u.fillSp.addChild(l);});}}}),u.xAxisSp=new _canvax.default.Display.Sprite,u.sprite.addChild(u.xAxisSp),u.yAxisSp=new _canvax.default.Display.Sprite,u.sprite.addChild(u.yAxisSp);for(var e=0,i=(l=o.layoutData).length;e<i;e++){if((a=l[e]).visible){var t=new Line({id:"back_line_"+e,context:{y:a.y,lineType:u.getProp(u.line.xDimension.lineType,e,"solid"),lineWidth:u.getProp(u.line.xDimension.lineWidth,e,1),strokeStyle:u.getProp(u.line.xDimension.strokeStyle,e,"#f0f0f0"),visible:!0}});u.line.xDimension.enabled&&(u.xAxisSp.addChild(t),t.context.start.x=0,t.context.end.x=u.width);}}var l;for(e=0,i=(l=p.layoutData).length;e<i;e++){var a=l[e];t=new Line({context:{x:a.x,start:{x:0,y:0},end:{x:0,y:-u.height},lineType:u.getProp(u.line.yDimension.lineType,e,"solid"),lineWidth:u.getProp(u.line.yDimension.lineWidth,e,1),strokeStyle:u.getProp(u.line.yDimension.strokeStyle,e,"#f0f0f0"),visible:!0}});u.line.yDimension.enabled&&u.yAxisSp.addChild(t);}}}},{key:"getProp",value:function(e,i,t){var l=t;return null!=e&&null!=e&&((index_es._.isString(e)||index_es._.isNumber(e))&&(l=e),index_es._.isFunction(e)&&(l=e.apply(this,[i,t])),index_es._.isArray(e)&&(l=e[i])),l}}]),l}(index_es.event.Dispatcher);exports.default=rectGrid;
});

unwrapExports(grid);

var rect = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_assertThisInitialized2=interopRequireDefault(assertThisInitialized$1),_createClass2=interopRequireDefault(createClass$1),_inherits2=interopRequireDefault(inherits$1),_index=interopRequireDefault(coord),_canvax=interopRequireDefault(Canvax),_xaxis=interopRequireDefault(xaxis),_yaxis=interopRequireDefault(yaxis),_grid=interopRequireDefault(grid),Rect=function(i){function s(i,e){var t;return (0, _classCallCheck2.default)(this,s),t=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(s).call(this,i,e)),index_es._.extend(!0,(0, _assertThisInitialized2.default)(t),(0, index_es.getDefaultProps)(s.defaultProps()),t.setDefaultOpt(i,e)),t.type="rect",t._xAxis=null,t._yAxis=[],t._yAxisLeft=null,t._yAxisRight=null,t._grid=null,t.init(i),t}return (0, _inherits2.default)(s,i),(0, _createClass2.default)(s,null,[{key:"defaultProps",value:function(){return {horizontal:{detail:"横向翻转坐标系",documentation:"横向翻转坐标系",insertText:"horizontal: ",default:!1,values:[!0,!1]},_props:{xAxis:_xaxis.default,yAxis:_yaxis.default,grid:_grid.default}}}}]),(0, _createClass2.default)(s,[{key:"setDefaultOpt",value:function(i,e){var t={field:this.dataFrame.fields[0],xAxis:{layoutType:"rule",posParseToInt:!1},grid:{}};if(index_es._.extend(!0,t,i),t.yAxis){var s=[];index_es._.each(index_es._.flatten([t.yAxis]),function(i){s.push(index_es._.clone(i));}),t.yAxis=s;}else t.yAxis=[];for(var a=index_es._.flatten([e._opt.graphs]),n=0;n<a.length;n++){var r=a[n];if("bar"==r.type&&(t.xAxis.layoutType="peak"),r.field){var h="left";"right"==r.yAxisAlign&&(h="right");var l=null;(l=index_es._.find(t.yAxis,function(i,e){return i.align==h||!i.align&&e==("left"==h?0:1)}))?l.align||(l.align=h):(l={align:h,field:[]},t.yAxis.push(l)),l.field?index_es._.isArray(l.field)||(l.field=[l.field]):l.field=[],index_es._.isArray(r.field)?l.field=l.field.concat(r.field):l.field.push(r.field);}}var x=[],o=[];return index_es._.each(t.yAxis,function(i,e){i.align||(i.align=e?"right":"left"),"left"==i.align?x.push(i):o.push(i);}),t.yAxis=x.concat(o),t.horizontal&&(t.xAxis.isH=!0,index_es._.each(t.yAxis,function(i){i.isH=!0;})),"enabled"in t&&(index_es._.extend(!0,t.xAxis,{enabled:t.enabled}),index_es._.each(t.yAxis,function(i){index_es._.extend(!0,i,{enabled:t.enabled});}),t.grid.enabled=t.enabled),"animation"in t&&(index_es._.extend(!0,t.xAxis,{animation:t.animation}),index_es._.each(t.yAxis,function(i){index_es._.extend(!0,i,{animation:t.animation});}),t.grid.animation=t.animation),t}},{key:"init",value:function(){this._initModules(),this.fieldsMap=this.setFieldsMap({type:"yAxis"});}},{key:"resetData",value:function(i){var t=this;this.dataFrame=i;var e=this.getAxisDataFrame(this.xAxis.field);this._xAxis.resetData(e),index_es._.each(this._yAxis,function(i){var e=t.getAxisDataFrame(i.field);i.resetData(e);}),this._resetXY_axisLine_pos();this._yAxisLeft||this._yAxisRight;this._grid.reset({animation:!1});}},{key:"draw",value:function(i){i=i||{};var e=this.app.padding,t=i.height||this.app.height,s=i.width||this.app.width;if(this.horizontal){var a=s;s=t,t=a;}var n=t-this._xAxis.height-e.bottom,r=0,h=0;this._yAxisLeft&&(this._yAxisLeft.draw({pos:{x:e.left,y:n},yMaxHeight:n-e.top,resize:i.resize}),r=this._yAxisLeft.width),this._yAxisRight&&(this._yAxisRight.draw({pos:{x:0,y:n},yMaxHeight:n-e.top,resize:i.resize}),h=this._yAxisRight.width),this._xAxis.draw({pos:{x:e.left+r,y:n},width:s-r-e.left-h-e.right,resize:i.resize}),this._yAxisRight&&this._yAxisRight.setX(r+e.left+this._xAxis.width),this._grid.draw({width:this._xAxis.width,height:this._yAxis[0].height,pos:{x:r+e.left,y:n},resize:i.resize}),this.width=this._xAxis.width,this.height=this._yAxis[0].height,this.origin.x=r+e.left,this.origin.y=n,this._initInduce(),this._resetXY_axisLine_pos(),this.horizontal&&this._horizontal({w:s,h:t});}},{key:"_resetXY_axisLine_pos",value:function(){var i,t=this;this._xAxis.enabled&&("center"==this._xAxis.axisLine.position&&(i=-this._yAxis[0].height/2),"center"==this._xAxis.axisLine.position&&(i=-this._yAxis[0].height/2),index_es._.isNumber(this._xAxis.axisLine.position)&&(i=-this._yAxis[0].getPosOfVal(this._xAxis.axisLine.position)),void 0!==i&&(this._xAxis._axisLine.context.y=i)),index_es._.each(this._yAxis,function(i){var e;i.enabled&&("center"==i.axisLine.position&&(e=t._xAxis.width/2),index_es._.isNumber(i.axisLine.position)&&(e=t._xAxis.getPosOfVal(i.axisLine.position)),void 0!==e&&(i._axisLine.context.x=e));});}},{key:"getSizeAndOrigin",value:function(){var i={width:this.width,height:this.height,origin:this.origin};if(this.horizontal){var e=this.app.padding,t=e.bottom,s=e.right;i={width:this._yAxis[0].height,height:this._xAxis.width,origin:{x:this._xAxis.height+t,y:this._yAxis[0].height+s}};}return i}},{key:"_initModules",value:function(){this._grid=new _grid.default(this.grid,this),this.sprite.addChild(this._grid.sprite);var i=this.getAxisDataFrame(this.xAxis.field);this._xAxis=new _xaxis.default(this.xAxis,i,this),this._axiss.push(this._xAxis),this.sprite.addChild(this._xAxis.sprite);var e,t,s,a,n=this.yAxis;index_es._.isArray(n)||(n=[n]),(e=index_es._.find(n,function(i){return "left"==i.align}))&&(s=this.getAxisDataFrame(e.field),this._yAxisLeft=new _yaxis.default(e,s,this),this._yAxisLeft.axis=e,this.sprite.addChild(this._yAxisLeft.sprite),this._yAxis.push(this._yAxisLeft),this._axiss.push(this._yAxisLeft)),(t=index_es._.find(n,function(i){return "right"==i.align}))&&(a=this.getAxisDataFrame(t.field),this._yAxisRight=new _yaxis.default(t,a,this),this._yAxisRight.axis=t,this.sprite.addChild(this._yAxisRight.sprite),this._yAxis.push(this._yAxisRight),this._axiss.push(this._yAxisRight));}},{key:"_horizontal",value:function(i){var t=i.h,s=i.w;index_es._.each([this.sprite.context],function(i){i.x+=(t-s)/2,i.y+=(s-t)/2;var e={x:s/2,y:t/2};i.rotation=90,i.rotateOrigin=e;});}},{key:"changeFieldEnabled",value:function(i){this.setFieldEnabled(i);var e=this.getFieldMapOf(i),t=e.yAxis||e.rAxis,s=this.getEnabledFieldsOf(t);t.resetData(this.getAxisDataFrame(s)),this._resetXY_axisLine_pos(),this._grid.reset({animation:!1});}},{key:"_initInduce",value:function(){var e=this;e.induce=new _canvax.default.Shapes.Rect({id:"induce",context:{x:e.origin.x,y:e.origin.y-e.height,width:e.width,height:e.height,fillStyle:"#000000",globalAlpha:0,cursor:"pointer"}}),e.sprite.getChildById("induce")||e.sprite.addChild(e.induce),e.induce.on(index_es.event.types.get(),function(i){e.fire(i.type,i),e.app.fire(i.type,i);});}},{key:"getTipsInfoHandler",value:function(i){var e=i.point.x;i.target!==this.induce&&(e=this.induce.globalToLocal(i.target.localToGlobal(i.point)).x);var t=this._xAxis.getNodeInfoOfX(e),s={xAxis:t,dimension_1:t,title:t.text,iNode:t.ind,nodes:[]};return i.eventInfo&&(index_es._.extend(!0,s,i.eventInfo),s.xAxis&&(i.eventInfo.xAxis=t)),s}},{key:"getPoint",value:function(i){var e={x:0,y:void 0},t={type:"yAxis",field:i.field},s=this.getAxis({type:"xAxis"}),a=this.getAxis(t),n=i.iNode||0,r=i.value;"x"in r||(r.x=index_es._.flatten(s.dataOrg)[n]),e.x=s.getPosOf({ind:n,val:r.x});var h=r.y;return isNaN(h)||null==h||""===h?e.y=void 0:e.y=-a.getPosOfVal(h),{pos:e,value:r}}},{key:"getAxisOriginPoint",value:function(i){var e=this.getAxis(i);return {pos:-e.originPos,value:e.origin}}},{key:"getOriginPos",value:function(i){var e={type:"yAxis",field:i.field},t=this.getAxis({type:"xAxis"}),s=this.getAxis(e);return {x:t.originPos,y:-s.originPos}}}]),s}(_index.default);index_es.global.registerComponent(Rect,"coord","rect");var _default=Rect;exports.default=_default;
});

unwrapExports(rect);

var grid$1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_assertThisInitialized2=interopRequireDefault(assertThisInitialized$1),_createClass2=interopRequireDefault(createClass$1),_inherits2=interopRequireDefault(inherits$1),_canvax=interopRequireDefault(Canvax),Line=_canvax.default.Shapes.Line,Circle=_canvax.default.Shapes.Circle,Polygon=_canvax.default.Shapes.Polygon,polarGrid=function(e){function l(e,t){var i;return (0, _classCallCheck2.default)(this,l),(i=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(l).call(this,e,t))).width=0,i.height=0,i.app=t,i.pos={x:0,y:0},i.dataSection=[],i.sprite=null,i.induce=null,index_es._.extend(!0,(0, _assertThisInitialized2.default)(i),(0, index_es.getDefaultProps)(l.defaultProps()),e),i.init(e),i}return (0, _inherits2.default)(l,e),(0, _createClass2.default)(l,null,[{key:"defaultProps",value:function(){return {enabled:{detail:"是否开启grid",default:!1},ring:{detail:"环背景线",propertys:{shapeType:{detail:"线的图形样式，默认poly，可选circle",default:"poly"},lineType:{detail:"线条样式，sold实线，dashed虚线",default:"sold"},lineWidth:{detail:"线宽",default:1},strokeStyle:{detail:"线颜色",default:"#e5e5e5"},fillStyle:{detail:"环填充色,支持函数配置",default:null},fillAlpha:{detail:"环填充的透明度",default:.5}}},ray:{detail:"射线",propertys:{enabled:{detail:"是否开启",default:!0},lineWidth:{detail:"线宽",default:1},strokeStyle:{detail:"线颜色",default:"#e5e5e5"}}}}}}]),(0, _createClass2.default)(l,[{key:"init",value:function(){this.sprite=new _canvax.default.Display.Sprite;}},{key:"setX",value:function(e){this.sprite.context.x=e;}},{key:"setY",value:function(e){this.sprite.context.y=e;}},{key:"draw",value:function(e){index_es._.extend(!0,this,e),this._widget(),this.setX(this.pos.x),this.setY(this.pos.y);}},{key:"clean",value:function(){this.sprite.removeAllChildren();}},{key:"reset",value:function(){}},{key:"_widget",value:function(){var s=this;index_es._.each(this.dataSection,function(e,t){if(e){var i,l=s.app.getROfNum(e),r=s.app.getPointsOfR(l),a={lineWidth:s.ring.lineWidth,strokeStyle:s._getStyle(s.ring.strokeStyle,t-1),fillStyle:s._getStyle(s.ring.fillStyle,t-1),fillAlpha:s.ring.fillAlpha},n=Circle;i="circle"==s.ring.shapeType?(a.r=l,new n({context:a})):(a.pointList=[],index_es._.each(r,function(e,t){t<r.length&&a.pointList.push([e.x,e.y]);}),new(n=Polygon)({context:a})),s.sprite.addChildAt(i,0),t==s.dataSection.length-1&&(a.fillAlpha=0,a.fillStyle="#ffffff",s.induce=new n({context:a}),s.sprite.addChild(s.induce));index_es._.each(r,function(e){var t=new Line({context:{end:e,lineWidth:s.ring.lineWidth,strokeStyle:s.ring.strokeStyle}});s.sprite.addChild(t);});}});}},{key:"_getStyle",value:function(e,t){return index_es._.isArray(e)?e[t%e.length]:e}}]),l}(index_es.event.Dispatcher);exports.default=polarGrid;
});

unwrapExports(grid$1);

var polar = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_assertThisInitialized2=interopRequireDefault(assertThisInitialized$1),_createClass2=interopRequireDefault(createClass$1),_inherits2=interopRequireDefault(inherits$1),_index=interopRequireDefault(coord),_canvax=interopRequireDefault(Canvax),_grid=interopRequireDefault(grid$1),Polar=function(t){function a(t,i){var e;return (0, _classCallCheck2.default)(this,a),(e=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(a).call(this,t,i))).type="polar",index_es._.extend(!0,(0, _assertThisInitialized2.default)(e),(0, index_es.getDefaultProps)(a.defaultProps()),e.setDefaultOpt(t,i)),e.init(t),e}return (0, _inherits2.default)(a,t),(0, _createClass2.default)(a,null,[{key:"defaultProps",value:function(){return {allAngle:{detail:"坐标系总角度",documentation:"",default:360,values:[0,360]},startAngle:{detail:"坐标系起始角度",documentation:"",default:0,values:[0,360]},radius:{detail:"坐标系的最大半径",documentation:"默认自动计算view的高宽，如果squareRange==true，则会取Math.min(width,height)",default:"auto",values:null},aAxis:{detail:"角度轴",documentation:"类似直角坐标系中的x轴",propertys:{data:[],angleList:[],layoutData:[],field:{detail:"数据字段",documentation:"",default:""},layoutType:{detail:"布局类型",documentation:"",default:"proportion"},beginAngle:{detail:"起始角度",documentation:"",default:-90},enabled:{detail:"是否显示",documentation:"",default:!1},label:{detail:"文本配置",documentation:"",propertys:{enabled:{detail:"是否显示",documentation:"",default:!0},format:{detail:"label的格式化处理函数",documentation:"",default:null},fontColor:{detail:"label颜色",documentation:"",default:"#666"}}}}},rAxis:{detail:"半径维度轴",documentation:"类似直角坐标系中的y轴维度",propertys:{field:{detail:"数据字段",documentation:"",default:""},dataSection:{detail:"轴的显示数据",documentation:"默认根据源数据中自动计算，用户也可以手动指定",default:!1},enabled:{detail:"是否显示",documentation:"",default:!1}}}}}}]),(0, _createClass2.default)(a,[{key:"setDefaultOpt",value:function(t,i){var e={rAxis:{field:[]},aAxis:{},grid:{}};index_es._.extend(!0,e,t),index_es._.isArray(e.rAxis.field)||(e.rAxis.field=[e.rAxis.field]);var a=index_es._.flatten([i._opt.graphs]),n=[];return index_es._.each(a,function(t){if(t.field){var i=t.field;index_es._.isArray(i)||(i=[i]),n=n.concat(i);}}),e.rAxis.field=e.rAxis.field.concat(n),t.aAxis&&t.aAxis.field?e.aAxis.enabled=!0:e.grid.enabled=!1,e}},{key:"init",value:function(){this._initModules(),this.fieldsMap=this.setFieldsMap({type:"rAxis"});}},{key:"_initModules",value:function(){this.grid.enabled&&(this._grid=new _grid.default(this.grid,this),this.sprite.addChild(this._grid.sprite)),this.aAxis.enabled&&this.grid.enabled&&(this._aAxisScaleSp=new _canvax.default.Display.Sprite({id:"aAxisScaleSp"}),this.sprite.addChild(this._aAxisScaleSp)),this._axiss.push({type:"rAxis",field:this.rAxis.field});}},{key:"draw",value:function(){this._computeAttr(),this.rAxis.dataSection=this._getRDataSection(),this.aAxis.data=this.app.dataFrame.getFieldData(this.aAxis.field),this._setAAxisAngleList(),this.grid.enabled&&(this._grid.draw({pos:this.origin,width:this.width,height:this.height,dataSection:this.rAxis.dataSection},this),this.aAxis.enabled&&this._drawAAxis(),this._initInduce());}},{key:"resetData",value:function(){}},{key:"changeFieldEnabled",value:function(t){this.setFieldEnabled(t),this.rAxis.dataSection=this._getRDataSection(),this.aAxis.data=this.app.dataFrame.getFieldData(this.aAxis.field),this.grid.enabled&&this._grid.reset({dataSection:this.rAxis.dataSection},this);}},{key:"_getRDataSection",value:function(){var i=this;if(this._opt.rAxis&&this._opt.rAxis.dataSection)return this._opt.rAxis.dataSection;var e=[];return index_es._.each(index_es._.flatten([i.rAxis.field]),function(t){e=e.concat(i.app.dataFrame.getFieldData(t));}),e.push(0),index_es.dataSection.section(e,3)}},{key:"_computeAttr",value:function(){var t,i,e=this.app.padding,a=this.app.width,n=this.app.height;"width"in this._opt||(this.width=a-e.left-e.right),"height"in this._opt||(this.height=n-e.top-e.bottom);for(var s=this.width,r=this.height,l=0,o=0,h=0,u=0,d=[this.startAngle],c=0,f=parseInt((this.startAngle+this.allAngle)/90)-parseInt(this.startAngle/90);c<=f;c++){var p=90*parseInt(this.startAngle/90)+90*c;-1==index_es._.indexOf(d,p)&&p>d.slice(-1)[0]&&d.push(p);}var g=this.startAngle+this.allAngle;-1==index_es._.indexOf(d,g)&&d.push(g),index_es._.each(d,function(t){t%=360;var i=Math.sin(t*Math.PI/180);180==t&&(i=0);var e=Math.cos(t*Math.PI/180);270!=t&&90!=t||(e=0),l=Math.min(l,i),o=Math.max(o,i),h=Math.min(h,e),u=Math.max(u,e);}),i=(Math.abs(h)+Math.abs(u))/(Math.abs(l)+Math.abs(o));var x=Math.min(s,r);if(1==i)s=r=x;else{var _=r*i;s<_?r=s/i:s=_;}var v=e.left+(this.width-s)/2,m=e.top+(this.height-r)/2;this.origin={x:v+s*(h/(h-u)),y:m+r*(l/(l-o))};var A={top:this.origin.y-m,right:v+s-this.origin.x,bottom:m+r-this.origin.y,left:this.origin.x-v},y=[],b=[["right","bottom"],["bottom","left"],["left","top"],["top","right"]];index_es._.each(d,function(t){t%=360;var i=parseInt(t/90),e=b[i];t%90==0&&(e=[["right","bottom","left","top"][i]]);var a=Math.sin(t*Math.PI/180);180==t&&(a=0);var n=Math.cos(t*Math.PI/180);270!=t&&90!=t||(n=0),index_es._.each(e,function(t){var i;"top"!=t&&"bottom"!=t||a&&(i=Math.abs(A[t]/a)),"right"!=t&&"left"!=t||n&&(i=Math.abs(A[t]/n)),y.push(i);});}),t=index_es._.min(y),this.aAxis.label.enabled&&(t-=20),this.radius=t;}},{key:"getMaxDisToViewOfOrigin",value:function(){var t=this.origin,i=this.app.padding,e=this.app.width,a=this.app.height,n=e-i.left-i.right,s=a-i.top-i.bottom,r=[t.x-i.left,n+i.left-t.x,t.y-i.top,s+i.top-t.y];return index_es._.max(r)}},{key:"getRadiansAtR",value:function(t,i,e){var n=this;null==i&&(i=this.width),null==e&&(e=this.height);var a,s,r=[],l=this.app.padding,o={x:this.origin.x-l.left-(this.width-i)/2,y:this.origin.y-l.top-(this.height-e)/2},h=o.y;h<t&&(a=Math.sqrt(Math.pow(t,2)-Math.pow(h,2)),r=r.concat(this._filterPointsInRect([{x:-a,y:-h},{x:a,y:-h}],o,i,e)));var u=i-o.x;u<t&&(s=Math.sqrt(Math.pow(t,2)-Math.pow(u,2)),r=r.concat(this._filterPointsInRect([{x:u,y:-s},{x:u,y:s}],o,i,e)));var d=e-o.y;d<t&&(a=Math.sqrt(Math.pow(t,2)-Math.pow(d,2)),r=r.concat(this._filterPointsInRect([{x:a,y:d},{x:-a,y:d}],o,i,e)));var c=o.x;c<t&&(s=Math.sqrt(Math.pow(t,2)-Math.pow(c,2)),r=r.concat(this._filterPointsInRect([{x:-c,y:s},{x:-c,y:-s}],o,i,e)));var f=[];0==r.length?f.push([{point:{x:t,y:0},radian:0},{point:{x:t,y:0},radian:2*Math.PI}]):index_es._.each(r,function(t,i){var e=i==r.length-1?0:i+1,a=r.slice(e,e+1)[0];f.push([{point:t,radian:n.getRadianInPoint(t)},{point:a,radian:n.getRadianInPoint(a)}]);});for(var p=0,g=f.length;p<g;p++)this._checkArcInRect(f[p],t,o,i,e)||(f.splice(p,1),p--,g--);return f}},{key:"_filterPointsInRect",value:function(t,i,e,a){for(var n=0,s=t.length;n<s;n++)this._checkPointInRect(t[n],i,e,a)||(t.splice(n,1),n--,s--);return t}},{key:"_checkPointInRect",value:function(t,i,e,a){var n=t.x+i.x,s=t.y+i.y;return !(n<0||e<n||s<0||a<s)}},{key:"_checkArcInRect",value:function(t,i,e,a,n){var s=t[0],r=t[1],l=r.radian-s.radian;r.radian<s.radian&&(l=2*Math.PI+r.radian-s.radian);var o=(s.radian+l/2)%(2*Math.PI);return this._checkPointInRect(this.getPointInRadianOfR(o,i),e,a,n)}},{key:"getRadianInPoint",value:function(t){var i=2*Math.PI;return (Math.atan2(t.y,t.x)+i)%i}},{key:"getPointInRadianOfR",value:function(t,i){var e=Math.PI,a=Math.cos(t)*i;t!=e/2&&t!=3*e/2||(a=0);var n=Math.sin(t)*i;return t%e==0&&(n=0),{x:a,y:n}}},{key:"getROfNum",value:function(t){var i=index_es._.max(this.rAxis.dataSection);return this.radius*((t-0)/(i-0))}},{key:"getPointsOfR",value:function(a){var n=this,s=[];return index_es._.each(n.aAxis.angleList,function(t){var i=Math.PI*t/180,e=n.getPointInRadianOfR(i,a);s.push(e);}),s}},{key:"_setAAxisAngleList",value:function(){var e=this;e.aAxis.angleList=[];var t=this.aAxis.data;if("proportion"==this.aAxis.layoutType){t=[];for(var i=0,a=this.aAxis.data.length;i<a;i++)t.push(i);}var n=this.allAngle,s=index_es._.max(t);"proportion"==this.aAxis.layoutType&&s++,index_es._.each(t,function(t){var i=(n*((t-0)/(s-0))+e.aAxis.beginAngle+n)%n;e.aAxis.angleList.push(i);});}},{key:"_drawAAxis",value:function(){var r=this,t=r.getROfNum(index_es._.max(this.rAxis.dataSection)),l=r.getPointsOfR(t+3);r._aAxisScaleSp.context.x=this.origin.x,r._aAxisScaleSp.context.y=this.origin.y,index_es._.each(this.aAxis.data,function(t,i){var e=l[i],a=index_es._.isFunction(r.aAxis.label.format)?r.aAxis.label.format(t):t,n={value:t,text:a,iNode:i,field:r.aAxis.field};if(r._getProp(r.aAxis.label.enabled,n)){var s={x:e.x,y:e.y,fillStyle:r._getProp(r.aAxis.label.fontColor,n)};index_es._.extend(s,r._getTextAlignForPoint(Math.atan2(e.y,e.x))),r._aAxisScaleSp.addChild(new _canvax.default.Display.Text(a,{context:s})),r.aAxis.layoutData.push(a);}});}},{key:"_getTextAlignForPoint",value:function(t){var i="center",e="bottom";return t>-Math.PI/2&&t<0&&(i="left",e="bottom"),0==t&&(i="left",e="middle"),0<t&&t<Math.PI/2&&(i="left",e="top"),t==Math.PI/2&&(i="center",e="top"),t>Math.PI/2&&t<Math.PI&&(i="right",e="top"),t!=Math.PI&&t!=-Math.PI||(i="right",e="middle"),t>-Math.PI&&t<-Math.PI/2&&(i="right",e="bottom"),{textAlign:i,textBaseline:e}}},{key:"getAxisNodeOf",value:function(t){var i=this.getAAxisIndOf(t);if(void 0!==i)return {ind:i,value:this.aAxis.data[i],text:this.aAxis.layoutData[i],angle:this.aAxis.angleList[i]}}},{key:"getAAxisIndOf",value:function(t){var n=this;if(void 0!==t.aAxisInd)return t.aAxisInd;if(n.aAxis.angleList.length){var i=t.point,s=(180*n.getRadianInPoint(i)/Math.PI-n.aAxis.beginAngle)%n.allAngle,r=(Math.sqrt(Math.pow(i.x,2)+Math.pow(i.y,2)),0),l=n.aAxis.angleList.length;return index_es._.each(n.aAxis.angleList,function(t,i){t=(t-n.aAxis.beginAngle)%n.allAngle;var e=i+1,a=(n.aAxis.angleList[e]-n.aAxis.beginAngle)%n.allAngle;if(i==l-1&&(e=0,a=n.allAngle),t<=s&&s<=a)return r=s-t<a-s?i:e,!1}),r}}},{key:"_initInduce",value:function(){var i=this;i.induce=this._grid.induce,i.induce&&i.induce.on(index_es.event.types.get(),function(t){i.fire(t.type,t),i.app.fire(t.type,t);});}},{key:"getTipsInfoHandler",value:function(t){var i=this.getAxisNodeOf(t),e={nodes:[]};return i&&(e.aAxis=i,e.title=i.text,e.iNode=i.ind),t.eventInfo&&(e=index_es._.extend(e,t.eventInfo)),e}},{key:"getPoint",value:function(){}},{key:"getSizeAndOrigin",value:function(){}},{key:"_getProp",value:function(t,i,e){var a=t;return index_es._.isFunction(t)&&(a=t.apply(this,[i])),!a&&e&&(a=e),a}}]),a}(_index.default);index_es.global.registerComponent(Polar,"coord","polar");var _default=Polar;exports.default=_default;
});

unwrapExports(polar);

var graphs = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_assertThisInitialized2=interopRequireDefault(assertThisInitialized$1),_createClass2=interopRequireDefault(createClass$1),_inherits2=interopRequireDefault(inherits$1),_component=interopRequireDefault(component),_canvax=interopRequireDefault(Canvax),AnimationFrame=_canvax.default.AnimationFrame,GraphsBase=function(e){function r(e,t){var n;(0, _classCallCheck2.default)(this,r),n=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(r).call(this,e,t)),index_es._.extend(!0,(0, _assertThisInitialized2.default)(n),(0, index_es.getDefaultProps)(r.defaultProps())),n.name="graphs",n._opt=e||{},n.app=t,n.ctx=t.stage.canvas.getContext("2d"),n.dataFrame=t.dataFrame,n.data=null,n.width=0,n.height=0,n.origin={x:0,y:0},n.inited=!1,n.sprite=new _canvax.default.Display.Sprite({name:"graphs_"+e.type}),n.app.graphsSprite.addChild(n.sprite),n._growTween=null;var i=(0, _assertThisInitialized2.default)(n);return n.sprite.on("destroy",function(){i._growTween&&(AnimationFrame.destroyTween(i._growTween),i._growTween=null);}),n}return (0, _inherits2.default)(r,e),(0, _createClass2.default)(r,null,[{key:"defaultProps",value:function(){return {type:{detail:"绘图组件",default:"",insertText:"type: ",values:["bar","line","pie","scat"]},animation:{detail:"是否开启入场动画",default:!0},aniDuration:{detail:"动画时长",default:500}}}}]),(0, _createClass2.default)(r,[{key:"tipsPointerOf",value:function(){}},{key:"tipsPointerHideOf",value:function(){}},{key:"focusAt",value:function(){}},{key:"unfocusAt",value:function(){}},{key:"selectAt",value:function(){}},{key:"unselectAt",value:function(){}},{key:"getSelectedList",value:function(){return []}},{key:"getSelectedRowList",value:function(){return []}},{key:"hide",value:function(){}},{key:"show",value:function(){}},{key:"getLegendData",value:function(){}},{key:"triggerEvent",value:function(e){var t=(e.eventInfo.trigger||this)["on"+e.type];t&&index_es._.isFunction(t)&&(e.eventInfo&&e.eventInfo.nodes&&e.eventInfo.nodes.length?1==e.eventInfo.nodes.length?t.apply(this,[e,e.eventInfo.nodes[0]]):t.apply(this,[e,e.eventInfo.nodes]):t.apply(this,arguments));}},{key:"grow",value:function(t,e){e=e||{};var n=this,i=this.aniDuration;this.animation||(i=0);var r=0,a=1;"from"in e&&(r=e.from),"to"in e&&(a=e.to),this._growTween=AnimationFrame.registTween({from:{process:r},to:{process:a},duration:i,onUpdate:function(e){index_es._.isFunction(t)&&t(e.process);},onComplete:function(){this._growTween=null,n.fire("complete");}});}}]),r}(_component.default);exports.default=GraphsBase;
});

unwrapExports(graphs);

var bar = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_assertThisInitialized2=interopRequireDefault(assertThisInitialized$1),_createClass2=interopRequireDefault(createClass$1),_inherits2=interopRequireDefault(inherits$1),_canvax=interopRequireDefault(Canvax),_index2=interopRequireDefault(graphs),AnimationFrame=_canvax.default.AnimationFrame,Rect=_canvax.default.Shapes.Rect,BarGraphs=function(e){function a(e,t){var i;return (0, _classCallCheck2.default)(this,a),(i=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(a).call(this,e,t))).type="bar",i.enabledField=null,i.node={_width:0,_count:0},i.select={_fillStyle:"#092848"},i._barsLen=0,i.txtsSp=null,index_es._.extend(!0,(0, _assertThisInitialized2.default)(i),(0, index_es.getDefaultProps)(a.defaultProps()),e),i.init(),i}return (0, _inherits2.default)(a,e),(0, _createClass2.default)(a,null,[{key:"defaultProps",value:function(){return {field:{detail:"字段设置",documentation:"支持二维数组格式的设置，一维方向就是横向分组，二维方向就是纵向的堆叠",default:null},yAxisAlign:{detail:"绘制在哪根y轴上面",default:"left"},absolute:{detail:"是否脱离graphs的位置计算",documentation:"                    trimGraphs的时候是否需要和其他的 bar graphs一起并排计算，                    true的话这个就会和别的重叠,                    和css中得absolute概念一致，脱离文档流的绝对定位",default:!1},proportion:{detail:"比例柱状图",default:!1},node:{detail:"单个数据对应的图形设置",propertys:{width:{detail:"bar的宽度",default:0},maxWidth:{detail:"最大width",default:50},minWidth:{detail:"最小width",default:1},minHeight:{detail:"最小height",default:0},radius:{detail:"叶子节点的圆角半径",default:3},fillStyle:{detail:"bar填充色",default:null},fillAlpha:{detail:"bar透明度",default:.95},xDis:{detail:"单分组内bar之间的间隔",default:null},filter:{detail:"bar过滤处理器",default:null}}},label:{detail:"文本设置",propertys:{enabled:{detail:"是否开启",default:!1},fontColor:{detail:"文本颜色",default:null,documentation:"如果有设置text.fontColor那么优先使用fontColor"},fontSize:{detail:"文本字体大小",default:12},format:{detail:"文本格式化处理函数",default:null},lineWidth:{detail:"文本描边线宽",default:0},strokeStyle:{detail:"文本描边颜色",default:null},rotation:{detail:"旋转角度",default:0},textAlign:{detail:"水平对齐方式",documentation:"left center right",default:"center"},verticalAlign:{detail:"垂直基线对齐方式",documentation:"top middle bottom",default:"bottom"},position:{detail:"文本布局位置",documentation:"top,topRight,right,rightBottom,bottom,bottomLeft,left,leftTop,center",default:"top"},offsetX:{detail:"x偏移量",default:0},offsetY:{detail:"y偏移量",default:0}}},select:{detail:"分组选中",documentation:"                    分组的选中，不是选中具体的某个node，这里的选中靠groupRegion来表现出来,                    目前只有在第一个graphs bar 上配置有效",propertys:{enabled:{detail:"是否开启",default:!1},inds:{detail:"选中的分组索引集合",documentation:"选中的列的索引集合,注意，这里的ind不是当前视图的ind，而是加上了dataFrame.range.start的全局ind",default:[]},width:{detail:"选中态背景宽度",default:1},alpha:{detail:"选中态背景透明度",default:.2},fillStyle:{detail:"选中态背景填充色",default:null},triggerEventType:{detail:"触发选中效果的事件",default:"click"}}}}}}]),(0, _createClass2.default)(a,[{key:"init",value:function(){this.barsSp=new _canvax.default.Display.Sprite({id:"barsSp"}),this.txtsSp=new _canvax.default.Display.Sprite({id:"txtsSp",context:{}});}},{key:"getNodesAt",value:function(a){var l=this.data,n=[];return index_es._.each(this.enabledField,function(e,t){if(index_es._.isArray(e))index_es._.each(e,function(e,t){var i=l[e]?l[e][a]:null;i&&n.push(i);});else{var i=l[e]?l[e][a]:null;i&&n.push(i);}}),n}},{key:"_getTargetField",value:function(e,t,i,a){if(index_es._.isString(a))return a;if(index_es._.isArray(a)){var l=a[e];if(index_es._.isString(l))return l;if(index_es._.isArray(l))return l[t]}}},{key:"_getColor",value:function(e,t){var i=t.field,a=index_es._.flatten([this.field]),l=this.app.getComponent({name:"coord"}).getFieldMapOf(i);if(index_es._.isFunction(e)&&(e=e.apply(this,[t])),index_es._.isString(e)&&(e=e),index_es._.isArray(e)&&(e=index_es._.flatten(e)[index_es._.indexOf(a,i)]),e&&e.lineargradient&&e.lineargradient.length)if(0!=t.rectHeight){var n=this.ctx.createLinearGradient(t.x,t.fromY+t.rectHeight,t.x,t.fromY);index_es._.each(e.lineargradient,function(e){n.addColorStop(e.position,e.color);}),e=n;}else e=e.lineargradient[parseInt(e.lineargradient.length/2)].color;return null==e&&(e=l.color),e}},{key:"_getBarWidth",value:function(e,t){return this.node.width?index_es._.isFunction(this.node.width)?this.node._width=this.node.width(e):this.node._width=this.node.width:(this.node._width=t-Math.max(1,.2*t),1==this.node._width&&3<e&&(this.node._width=e-2)),this.node._width<1&&(this.node._width=1),this.node._width=parseInt(this.node._width),this.node._width>this.node.maxWidth&&(this.node._width=this.node.maxWidth),this.node._width}},{key:"show",value:function(){this.draw();}},{key:"hide",value:function(a){index_es._.each(this.barsSp.children,function(e,t){var i=e.getChildById("bar_"+t+"_"+a);i&&i.destroy();}),index_es._.each(this.txtsSp.children,function(e,t){var i=e.getChildById("text_"+t+"_"+a);i&&i.destroy();}),this.draw();}},{key:"resetData",value:function(e){this.dataFrame=e,this.draw();}},{key:"clean",value:function(){this.data={},this.barsSp.removeAllChildren(),this.label.enabled&&this.txtsSp.removeAllChildren();}},{key:"draw",value:function(e){e=e||{},index_es._.extend(!0,this,e);var A=this,k=A.animation&&!e.resize;if(this.data=this._trimGraphs(),0==this.enabledField.length||0==this._dataLen)return A._preDataLen=0,void this.clean();var F=A._preDataLen,D=this.enabledField.length,L=0,I=A.node._count=0,O=A.app.getComponents({name:"graphs",type:"bar"});index_es._.each(O,function(e,t){e==A&&(I=t);}),index_es._.each(this.enabledField,function(e,t){var i=(e=index_es._.flatten([e])).length;if(0!=i){L=A.width/A._dataLen,A._barsLen=A._dataLen*D;for(var a=0;a<A._dataLen;a++){var l=null;if(0==t){if(a<=F-1?l=A.barsSp.getChildById("barGroup_"+a):(l=new _canvax.default.Display.Sprite({id:"barGroup_"+a}),A.barsSp.addChild(l),l.iNode=a),!I){var n,r=L*A.select.width;1<A.select.width&&(r=A.select.width),a<=F-1?((n=l.getChildById("group_region_"+a)).context.width=r,n.context.x=L*a+(L-r)/2,n.context.globalAlpha=-1<index_es._.indexOf(A.select.inds,A.dataFrame.range.start+a)?A.select.alpha:0):(n=new Rect({id:"group_region_"+a,pointChkPriority:!1,hoverClone:!1,xyToInt:!1,context:{x:L*a+(L-r)/2,y:-A.height,width:r,height:A.height,fillStyle:A._getGroupRegionStyle(a),globalAlpha:-1<index_es._.indexOf(A.select.inds,A.dataFrame.range.start+a)?A.select.alpha:0}}),l.addChild(n),n.iNode=a,n.on(index_es.event.types.get(),function(e){e.eventInfo={iNode:this.iNode},C.bind(this)(e),A.app.fire(e.type,e);}));}}else l=A.barsSp.getChildById("barGroup_"+a);var d=null;0==t?a<=F-1?d=A.txtsSp.getChildById("txtGroup_"+a):(d=new _canvax.default.Display.Sprite({id:"txtGroup_"+a}),A.txtsSp.addChild(d),d.iGroup=t):d=A.txtsSp.getChildById("txtGroup_"+a);for(var s=0;s<i;s++){A.node._count++;var o=A.data[e[s]][a];o.iGroup=t,o.iNode=a,o.iLay=s;var h=o.y-o.fromY;isNaN(o.value)?h=0:Math.abs(h)<A.node.minHeight&&(h=A.node.minHeight),o.rectHeight=h;var u=A._getColor(A.node.fillStyle,o);if((o.color=u)instanceof CanvasGradient&&A.node.fillStyle.lineargradient){var f=A.node.fillStyle.lineargradient[parseInt(A.node.fillStyle.lineargradient.length/2)];f&&(o.color=f.color);}var c={x:Math.round(o.x),y:o.fromY,width:A.node._width,height:h,fillStyle:u,fillAlpha:A.node.fillAlpha,scaleY:-1};o.width=c.width;var _={x:c.x,y:o.yOriginPoint.pos,width:c.width,height:c.height,fillStyle:c.fillStyle,fillAlpha:A.node.fillAlpha,scaleY:0};if(A.node.radius&&o.isLeaf&&!A.proportion){var p=Math.min(A.node._width/2,Math.abs(h));p=Math.min(p,A.node.radius),_.radius=[p,p,0,0];}k||(delete _.scaleY,_.y=c.y);var m=null,v="bar_"+a+"_"+o.field;if(a<=F-1&&(m=l.getChildById(v)),m?m.context.fillStyle=u:((m=new Rect({id:v,context:_})).field=o.field,l.addChild(m),m.on(index_es.event.types.get(),function(e){e.eventInfo={trigger:A.node,nodes:[this.nodeData]},C.bind(this)(e),A.app.fire(e.type,e);})),m.finalPos=c,m.iGroup=t,m.iNode=a,m.iLay=s,(m.nodeData=o).nodeElement=m,A.node.filter&&A.node.filter.apply(m,[o,A]),A.label.enabled){var g=o.value;if(index_es._.isFunction(A.label.format)){var y=A.label.format(g,o);void 0===y&&null===y||(g=y);}if(null==g||""===g)continue;index_es._.isNumber(g)&&(g=(0, tools.numAddSymbol)(g));var b={fillStyle:A.label.fontColor||c.fillStyle,fontSize:A.label.fontSize,lineWidth:A.label.lineWidth,strokeStyle:A.label.strokeStyle||c.fillStyle,textBaseline:A.label.verticalAlign,rotation:A.label.rotation},x=A._getTextPos(c,o);b.x=x.x,b.y=x.y,b.textAlign=A._getTextAlign(c,o);var w=null,S="text_"+a+"_"+o.field;a<=F-1&&(w=d.getChildById(S)),w?(w.resetText(g),w.context.x=b.x,w.context.y=b.y):((w=new _canvax.default.Display.Text(g,{id:S,context:b})).field=o.field,d.addChild(w));}}}}function C(e){if(A.select.enabled&&e.type==A.select.triggerEventType){var t=A.dataFrame.range.start+this.iNode;-1<index_es._.indexOf(A.select.inds,t)?index_es._.each(O,function(e){e.unselectAt(t);}):index_es._.each(O,function(e){e.selectAt(t);});}}}),this.sprite.addChild(this.barsSp),this.label.enabled&&this.sprite.addChild(this.txtsSp),this.sprite.context.x=this.origin.x,this.sprite.context.y=this.origin.y,this.grow(function(){A.fire("complete");},{delay:0,duration:300,animate:k}),A._preDataLen=A._dataLen;}},{key:"setEnabledField",value:function(){this.enabledField=this.app.getComponent({name:"coord"}).filterEnabledFields(this.field);}},{key:"_getGroupRegionStyle",value:function(e){var t=this,i=t.select.fillStyle;return index_es._.isArray(t.select.fillStyle)&&(i=t.select.fillStyle[e]),index_es._.isFunction(t.select.fillStyle)&&(i=t.select.fillStyle.apply(this,[{iNode:e,rowData:t.dataFrame.getRowDataAt(e)}])),null==i?t.select._fillStyle:i}},{key:"_trimGraphs",value:function(){var p=this,m=this.app.getComponent({name:"coord"});this.setEnabledField(),this.data={};var t=[],i=0,a=0,l=!1;this.absolute?(t=[this],i=this.enabledField.length):index_es._.each(p.app.getComponents({name:"graphs",type:"bar"}),function(e){e.absolute||(e===p&&(l=!0),l?e.setEnabledField():a+=e.enabledField.length,i+=e.enabledField.length,t.push(e));});var v=m.getAxis({type:"xAxis"}).getCellLength(),e=v/(i+1),g=this._getBarWidth(v,e),y=e-g;null!=this.node.xDis&&(y=this.node.xDis);var b=(v-g*i-y*(i-1))/2;a&&(b+=(y+g)*a);var n=this.dataFrame.getDataOrg(this.enabledField),r=p.getGraphSelectOpt();return !p.select.inds.length&&r&&r.inds&&r.inds.length&&(p.select.inds=index_es._.clone(r.inds)),index_es._.each(n,function(f,c){var _=[];index_es._.each(f,function(e,u){_[u]=[],p._dataLen=e.length,index_es._.each(e,function(e,i){var a=e;p.proportion&&(a=0,index_es._.each(f,function(e,t){a+=e[i];}));var t=p._getTargetField(c,u,i,p.enabledField),l=m.getPoint({iNode:i,field:t,value:{y:e}}),n=l.pos.x,r=n-v/2+b+(g+y)*c,d=0;d=p.proportion?-e/a*m.height:l.pos.y,isNaN(d)&&(d=0);var h=m.getAxisOriginPoint({field:t});var s=function e(t,i,a,l,n){var r=t[i-1];if(!r)return h.pos;var d=r[a].y,s=r[a].value,o=h.value;return o<=l?o<=s?(r[a].isLeaf=!1,d):e(t,i-1,a,l):s<o?(r[a].isLeaf=!1,d):e(t,i-1,a,l)}(_,u,i,e);d+=s-h.pos;var o={type:"bar",value:e,vInd:u,vCount:a,field:t,fromX:r,fromY:s,x:r,y:d,width:g,yOriginPoint:h,isLeaf:!0,xAxis:m.getAxis({type:"xAxis"}).getNodeInfoOfX(n),iNode:i,rowData:p.dataFrame.getRowDataAt(i),color:null,selected:!1};p.data[o.field]||(p.data[o.field]=_[u]),-1<index_es._.indexOf(p.select.inds,i)&&(o.selected=!0),_[u].push(o);});});}),p.data}},{key:"_getTextAlign",value:function(e,t){var i=this.label.textAlign;return t.value<t.yOriginPoint.value&&("left"==i?i="right":"right"==i&&(i="left")),i}},{key:"_getTextPos",value:function(e,t){var i={x:0,y:0},a=e.x,l=e.y,n=!0;switch(e.y>=t.y&&(n=!1),this.label.position){case"top":a=e.x+e.width/2,l=e.y+e.height,n&&(l+=16);break;case"topRight":a=e.x+e.width,l=e.y+e.height,n&&(l+=16);break;case"right":a=e.x+e.width,l=e.y+e.height/2;break;case"rightBottom":a=e.x+e.width,l=e.y;break;case"bottom":a=e.x+e.width/2,l=e.y;break;case"bottomLeft":a=e.x,l=e.y;break;case"left":a=e.x,l=e.y+e.height/2;break;case"leftTop":a=e.x,l=e.y+e.height,n&&(l+=16);break;case"center":a=e.x+e.width/2,l=e.y+e.height/2;}a-=this.label.offsetX;var r=1;return t.value<t.yOriginPoint.value&&(r=-1),l-=r*this.label.offsetY,i.x=a,i.y=l,i}},{key:"grow",value:function(d,e){var s=this;if(s._preDataLen>s._dataLen)for(var t=s._dataLen,i=s._preDataLen;t<i;t++)s.barsSp.getChildAt(t).destroy(),s.label.enabled&&s.txtsSp.getChildAt(t).destroy(),t--,i--;if(e.animate){var o=index_es._.extend({delay:Math.min(1e3/this._barsLen,80),easing:"Linear.None",duration:500},e),h=0;index_es._.each(s.enabledField,function(e,t){var i=(e=index_es._.flatten([e])).length;if(0!=i)for(var a=0;a<s._dataLen;a++)for(var l=0;l<i;l++){var n=s.data[e[l]][a],r=s.barsSp.getChildById("barGroup_"+a).getChildById("bar_"+a+"_"+n.field);0==o.duration?(r.context.scaleY=1,r.context.y=1*r.finalPos.y,r.context.x=r.finalPos.x,r.context.width=r.finalPos.width,r.context.height=r.finalPos.height):(r._tweenObj&&AnimationFrame.destroyTween(r._tweenObj),r._tweenObj=r.animate({scaleY:1,y:1*r.finalPos.y,x:r.finalPos.x,width:r.finalPos.width,height:r.finalPos.height},{duration:o.duration,easing:o.easing,delay:a*o.delay,onUpdate:function(){},onComplete:function(e){e.width<3&&this.context&&(this.context.radius=0),++h===s.node._count&&d&&d(s);},id:r.id}));}});}else d&&d(s);}},{key:"selectAt",value:function(e){var a=this;if(!(-1<index_es._.indexOf(this.select.inds,e))){this.select.inds.push(e);var l=e-this.dataFrame.range.start;index_es._.each(this.data,function(e,t){var i=e[l];i.selected=!0,a.setNodeElementStyle(i);});var t=this.barsSp.getChildById("barGroup_"+l);if(t){var i=t.getChildById("group_region_"+l);i&&(i.context.globalAlpha=this.select.alpha);}}}},{key:"unselectAt",value:function(e){var a=this;if(-1!=index_es._.indexOf(this.select.inds,e)){var t=index_es._.indexOf(this.select.inds,e);this.select.inds.splice(t,1);var l=e-this.dataFrame.range.start;index_es._.each(this.data,function(e,t){var i=e[l];i.selected=!1,a.setNodeElementStyle(i);});var i=this.barsSp.getChildById("barGroup_"+l);if(i){var n=i.getChildById("group_region_"+l);n&&(n.context.globalAlpha=0);}}}},{key:"getSelectedRowList",value:function(){var t=[],i=this;return index_es._.each(i.select.inds,function(e){t.push(i.dataFrame.jsonOrg[e]);}),t}},{key:"setNodeElementStyle",value:function(e){var t=this._getColor(this.node.fillStyle,e);e.nodeElement.context.fillStyle=t;}},{key:"getGraphSelectOpt",value:function(){var t=this._opt.select;if(!t){var e=this.app.getComponents({name:"graphs",type:"bar"});index_es._.each(e,function(e){if(t)return !1;!t&&e._opt.select&&(t=e.select);});}return t}}]),a}(_index2.default);index_es.global.registerComponent(BarGraphs,"graphs","bar");var _default=BarGraphs;exports.default=_default;
});

unwrapExports(bar);

var group = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_assertThisInitialized2=interopRequireDefault(assertThisInitialized$1),_createClass2=interopRequireDefault(createClass$1),_inherits2=interopRequireDefault(inherits$1),_canvax=interopRequireDefault(Canvax),AnimationFrame=_canvax.default.AnimationFrame,BrokenLine=_canvax.default.Shapes.BrokenLine,Circle=_canvax.default.Shapes.Circle,Isogon=_canvax.default.Shapes.Isogon,Path=_canvax.default.Shapes.Path,LineGraphsGroup=function(e){function s(e,t,i,l,n,a,r){var o;return (0, _classCallCheck2.default)(this,s),(o=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(s).call(this)))._graphs=r,o._opt=i,o.fieldMap=e,o.field=null,o.iGroup=t,o._yAxis=e.yAxis,o.ctx=l,o.w=a,o.h=n,o.y=0,o.line={strokeStyle:e.color},o.data=[],o.sprite=null,o._pointList=[],o._currPointList=[],o._bline=null,index_es._.extend(!0,(0, _assertThisInitialized2.default)(o),(0, index_es.getDefaultProps)(s.defaultProps()),i),o.field=e.field,o.init(i),o}return (0, _inherits2.default)(s,e),(0, _createClass2.default)(s,null,[{key:"defaultProps",value:function(){return {line:{detail:"线配置",propertys:{enabled:{detail:"是否开启",default:!0},strokeStyle:{detail:"线的颜色",default:void 0},lineWidth:{detail:"线的宽度",default:2},lineType:{detail:"线的样式",default:"solid"},smooth:{detail:"是否平滑处理",default:!0}}},node:{detail:"单个数据节点配置，对应线上的小icon图形",propertys:{enabled:{detail:"是否开启",default:!0},shapeType:{detail:"节点icon的图形类型，默认circle",documentation:'可选有"isogon"(正多边形)，"path"（自定义path路径，待实现）',default:"circle"},isogonPointNum:{detail:'shapeType为"isogon"时有效，描述正多边形的边数',default:3},path:{detail:"shapeType为path的时候，描述图形的path路径",default:null},corner:{detail:"拐角才有节点",default:!1},radius:{detail:"节点半径",default:3},fillStyle:{detail:"节点图形的背景色",default:"#ffffff"},strokeStyle:{detail:"节点图形的描边色，默认和line.strokeStyle保持一致",default:null},lineWidth:{detail:"节点图形边宽大小",default:2},visible:{detail:"节点是否显示,支持函数",default:!0}}},label:{detail:"文本配置",propertys:{enabled:{detail:"是否开启",default:!1},fontColor:{detail:"文本颜色",default:null},strokeStyle:{detail:"文本描边色",default:null},fontSize:{detail:"文本字体大小",default:12},format:{detail:"文本格式化处理函数",default:null}}},area:{detail:"面积区域配置",propertys:{enabled:{detail:"是否开启",default:!0},fillStyle:{detail:"面积背景色",default:null},alpha:{detail:"面积透明度",default:.2}}}}}}]),(0, _createClass2.default)(s,[{key:"init",value:function(){this.sprite=new _canvax.default.Display.Sprite;}},{key:"draw",value:function(e,t){index_es._.extend(!0,this,e),this.data=t,this._widget(e);}},{key:"destroy",value:function(){var e=this;e.sprite.animate({globalAlpha:0},{duration:300,onComplete:function(){e.sprite.remove();}});}},{key:"_getColor",value:function(e,t){var i=this._getProp(e,t);return null==i&&(i=this._getLineStrokeStyle(),e&&e.lineargradient&&(i=e.lineargradient[parseInt(e.lineargradient.length/2)].color),i&&index_es._.isString(i)||(i=this.fieldMap.color)),i}},{key:"_getProp",value:function(e,t){if(index_es._.isArray(e))return e[this.iGroup];if(index_es._.isFunction(e)){var i=[];return null!=t&&i.push(this.data[t]),e.apply(this,i)}return e}},{key:"getNodeInfoAt",value:function(e,t){var i=this.data[e];if(t&&t.eventInfo&&t.eventInfo.dimension_1&&"proportion"==t.eventInfo.dimension_1.layoutType)for(var l,n=0,a=this.data.length;n<a;n++){var r=this.data[n],o=Math.abs(r.x-e);(null==l||o<l)&&(l=o,i=r);}return i}},{key:"resetData",value:function(e,t){var i=this;e&&(this.data=e),i._pointList=this._getPointList(this.data);var l={left:0,right:i._pointList.length-i._currPointList.length};t&&index_es._.extend(l,t.params),l.left&&(0<l.left&&(this._currPointList=this._pointList.slice(0,l.left).concat(this._currPointList)),l.left<0&&this._currPointList.splice(0,Math.abs(l.left))),l.right&&(0<l.right&&(this._currPointList=this._currPointList.concat(this._pointList.slice(-l.right))),l.right<0&&this._currPointList.splice(this._currPointList.length-Math.abs(l.right))),i._createNodes(),i._createTexts(),i._grow();}},{key:"_grow",value:function(e){var a=this;function n(e){a._bline.context.pointList=index_es._.clone(e),a._bline.context.strokeStyle=a._getLineStrokeStyle(e),a._area.context.path=a._fillLine(a._bline),a._area.context.fillStyle=a._getFillStyle();var n=0;index_es._.each(e,function(e,t){if(index_es._.isNumber(e[1])){if(a._nodes){var i=a._nodes.getChildAt(n);i&&(i.context.x=e[0],i.context.y=e[1]);}if(a._labels){var l=a._labels.getChildAt(n);l&&(l.context.x=e[0],l.context.y=e[1]-3,a._checkTextPos(l,t));}n++;}});}a.data.length?(this._growTween=AnimationFrame.registTween({from:a._getPointPosStr(a._currPointList),to:a._getPointPosStr(a._pointList),desc:a.field,onUpdate:function(e){for(var t in e){var i=parseInt(t.split("_")[2]),l=parseInt(t.split("_")[1]);a._currPointList[i]&&(a._currPointList[i][l]=e[t]);}n(a._currPointList);},onComplete:function(){a.sprite._removeTween(a._growTween),a._growTween=null,n(a._pointList),e&&e(a);}}),this.sprite._tweens.push(this._growTween)):e&&e(a);}},{key:"_getPointPosStr",value:function(e){var i={};return index_es._.each(e,function(e,t){e&&(i["p_1_"+t]=e[1],i["p_0_"+t]=e[0]);}),i}},{key:"_getPointList",value:function(e){for(var t=[],i=0,l=e.length;i<l;i++){var n=e[i];t.push([n.x,n.y]);}return t}},{key:"_widget",value:function(e){var t=this;if(e=e||{},t._pointList=this._getPointList(t.data),0!=t._pointList.length){var i=[];if(e.animation)for(var l=this._getFirstNode(),n=l?l.y:void 0,a=0,r=t.data.length;a<r;a++){var o=t.data[a];i.push([o.x,index_es._.isNumber(o.y)?n:o.y]);}else i=t._pointList;var s={pointList:t._currPointList=i,lineWidth:t.line.lineWidth,y:t.y,strokeStyle:t._getLineStrokeStyle(i),smooth:t.line.smooth,lineType:t._getProp(t.line.lineType),smoothFilter:function(e){0<e[1]?e[1]=0:Math.abs(e[1])>t.h&&(e[1]=-t.h);},lineCap:"round"},u=new BrokenLine({context:s});u.on(index_es.event.types.get(),function(e){e.eventInfo={trigger:t.line,nodes:[]},t._graphs.app.fire(e.type,e);}),this.line.enabled||(u.context.visible=!1),t.sprite.addChild(u),t._bline=u;var _=new Path({context:{path:t._fillLine(u),fillStyle:t._getFillStyle(),globalAlpha:index_es._.isArray(t.area.alpha)?1:t.area.alpha}});_.on(index_es.event.types.get(),function(e){e.eventInfo={trigger:t.area,nodes:[]},t._graphs.app.fire(e.type,e);}),this.area.enabled||(_.context.visible=!1),t.sprite.addChild(_),t._area=_,t._createNodes(),t._createTexts();}}},{key:"_getFirstNode",value:function(){for(var e=null,t=0,i=this.data.length;t<i;t++){var l=this.data[t];if(index_es._.isNumber(l.y)&&(null!==e&&"right"!=this._yAxis.align||(e=l),"right"!==this._yAxis.align&&null!==e))break}return e}},{key:"_getFillStyle",value:function(){var e=this,t=null,i=e._getProp(e.area.fillStyle)||e._getLineStrokeStyle(null,"fillStyle");if(index_es._.isArray(e.area.alpha)&&!(i instanceof CanvasGradient)){e.area.alpha.length=2,null==e.area.alpha[0]&&(e.area.alpha[0]=0),null==e.area.alpha[1]&&(e.area.alpha[1]=0);var l=index_es._.min(e._bline.context.pointList,function(e){return e[1]});if(void 0===l[0]||void 0===l[1])return null;t=e.ctx.createLinearGradient(l[0],l[1],l[0],0);var n=index_es.color.colorRgb(i),a=n.replace(")",", "+e._getProp(e.area.alpha[0])+")").replace("RGB","RGBA");t.addColorStop(0,a);var r=n.replace(")",", "+e.area.alpha[1]+")").replace("RGB","RGBA");t.addColorStop(1,r),i=t;}return i}},{key:"_getLineStrokeStyle",value:function(e,t){var i;if(!this._opt.line||!this._opt.line.strokeStyle)return this.line.strokeStyle;if(this._opt.line.strokeStyle.lineargradient){e=e||this._bline.context.pointList;var l=index_es._.min(e,function(e){return e[1]}),n=index_es._.max(e,function(e){return e[1]});return "fillStyle"==t&&(n=[0,0]),void 0===l[0]||void 0===l[1]||void 0===n[1]?null:(i=this.ctx.createLinearGradient(l[0],l[1],l[0],n[1]),index_es._.each(this._opt.line.strokeStyle.lineargradient,function(e,t){i.addColorStop(e.position,e.color);}),i)}return i=this._getColor(this._opt.line.strokeStyle)}},{key:"_createNodes",value:function(){var e=this,t=e._currPointList;this._nodes||(this._nodes=new _canvax.default.Display.Sprite({}),this.sprite.addChild(this._nodes));for(var i=0,l=0,n=t.length;l<n;l++){var a=e._getColor(e.node.strokeStyle||e.line.strokeStyle,l);if(e.data[l].color=a,e.node.enabled){var r=e._currPointList[l];if(r&&index_es._.isNumber(r[1])){var o={x:r[0],y:r[1],r:e._getProp(e.node.radius,l),lineWidth:e._getProp(e.node.lineWidth,l)||2,strokeStyle:a,fillStyle:e._getProp(e.node.fillStyle,l),visible:!!e._getProp(e.node.visible,l)},s=Circle,u=e._getProp(e.node.shapeType,l);"isogon"==u&&(s=Isogon,o.n=e._getProp(e.node.isogonPointNum,l)),"path"==u&&(s=Path,o.path=e._getProp(e.node.path,l));var _=e._nodes.children[i];if(_?_.type==u?index_es._.extend(_.context,o):(_.destroy(),_=new s({context:o}),e._nodes.addChildAt(_,i)):(_=new s({context:o}),e._nodes.addChild(_)),e.node.corner){var d=e._pointList[l][1],h=e._pointList[l-1],f=e._pointList[l+1];h&&f&&d==h[1]&&d==f[1]&&(_.context.visible=!1);}i++;}}}if(e._nodes.children.length>i)for(var p=i,c=e._nodes.children.length;p<c;p++)e._nodes.children[p].destroy(),p--,c--;}},{key:"_createTexts",value:function(){var e=this,t=e._currPointList;if(e.label.enabled){this._labels||(this._labels=new _canvax.default.Display.Sprite({}),this.sprite.addChild(this._labels));for(var i=0,l=0,n=t.length;l<n;l++){var a=t[l];if(a&&index_es._.isNumber(a[1])){var r={x:a[0],y:a[1]-3,fontSize:this.label.fontSize,textAlign:"center",textBaseline:"bottom",fillStyle:e._getColor(e.label.fontColor,l),lineWidth:1,strokeStyle:"#ffffff"},o=e.data[l].value;if(index_es._.isFunction(e.label.format)&&(o=e.label.format(o,e.data[l])||o),null!=o&&null!=o){var s=this._labels.children[i];s?(s.resetText(o),index_es._.extend(s.context,r)):(s=new _canvax.default.Display.Text(o,{context:r}),e._labels.addChild(s),e._checkTextPos(s,l)),i++;}}}if(e._labels.children.length>i)for(var u=i,_=e._labels.children.length;u<_;u++)e._labels.children[u].destroy(),u--,_--;}}},{key:"_checkTextPos",value:function(e,t){var i=this._currPointList,l=i[t-1],n=i[t+1];l&&n&&l[1]<e.context.y&&n[1]<e.context.y&&(e.context.y+=7,e.context.textBaseline="top");}},{key:"_fillLine",value:function(e){var i=index_es._.clone(e.context.pointList),t="",l=-this._yAxis.originPos,n=null;function a(){n.push([n[n.length-1][0],l],[n[0][0],l],[n[0][0],n[0][1]]),t+=(0, tools.getPath)(n),n=null;}return index_es._.each(i,function(e,t){index_es._.isNumber(e[1])?(null===n&&(n=[]),n.push(e)):n&&n.length&&a(),t==i.length-1&&index_es._.isNumber(e[1])&&a();}),t}},{key:"getNodeInfoOfX",value:function(n){for(var e=this,t=0,i=this.data.length;t<i;t++)if(null!==this.data[t].value&&Math.abs(this.data[t].x-n)<=1)return this.data[t];function a(e,t){var i={x:e,y:0};return i.y=t[0][1]+(t[1][1]-t[0][1])/(t[1][0]-t[0][0])*(e-t[0][0]),i}var r;return this._bline&&function e(t){if(!(n<t[0][0]||n>t.slice(-1)[0][0])){var i=parseInt(t.length/2);if(Math.abs(t[i][0]-n)<=1)r={x:t[i][0],y:t[i][1]};else{var l=[];if(n>t[i][0]){if(n<t[i+1][0])return void(r=a(n,[t[i],t[i+1]]));l=t.slice(i+1);}else{if(n>t[i-1][0])return void(r=a(n,[t[i-1],t[i]]));l=t.slice(0,i);}e(l);}}}(this._bline.context.pointList),r&&null!=r.y?{type:"line",iGroup:e.iGroup,iNode:-1,field:e.field,value:this._yAxis.getValOfPos(-r.y),x:r.x,y:r.y,rowData:null,color:e._getProp(e.node.strokeStyle)||e._getLineStrokeStyle()}:null}}]),s}(index_es.event.Dispatcher);exports.default=LineGraphsGroup;
});

unwrapExports(group);

var line = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_assertThisInitialized2=interopRequireDefault(assertThisInitialized$1),_createClass2=interopRequireDefault(createClass$1),_inherits2=interopRequireDefault(inherits$1),_group=interopRequireDefault(group),_index=interopRequireDefault(graphs),LineGraphs=function(e){function r(e,t){var i;return (0, _classCallCheck2.default)(this,r),(i=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(r).call(this,e,t))).type="line",i.enabledField=null,i.groups=[],index_es._.extend(!0,(0, _assertThisInitialized2.default)(i),(0, index_es.getDefaultProps)(r.defaultProps()),e),i.init(),i}return (0, _inherits2.default)(r,e),(0, _createClass2.default)(r,null,[{key:"defaultProps",value:function(){return {field:{detail:"字段配置，支持二维数组格式",default:null},yAxisAlign:{detail:"绘制在哪根y轴上面",default:"left"},_props:[_group.default]}}}]),(0, _createClass2.default)(r,[{key:"init",value:function(){}},{key:"draw",value:function(e){return e=e||{},this.width=e.width,this.height=e.height,index_es._.extend(!0,this.origin,e.origin),this.sprite.context.x=this.origin.x,this.sprite.context.y=this.origin.y,this.data=this._trimGraphs(),this._setGroupsForYfield(this.data,null,e),this.animation&&!e.resize?this.grow():this.fire("complete"),this}},{key:"resetData",value:function(e,t){var i=this;e&&(i.dataFrame=e,i.data=i._trimGraphs()),index_es._.each(i.groups,function(e){e.resetData(i.data[e.field].data,t);});}},{key:"setEnabledField",value:function(){this.enabledField=this.app.getComponent({name:"coord"}).filterEnabledFields(this.field);}},{key:"_trimGraphs",value:function(){var l=this,d=this.app.getComponent({name:"coord"}),p={};return l.setEnabledField(),index_es._.each(index_es._.flatten(l.enabledField),function(e,t){var i=l.app.getComponent({name:"coord"}).getFieldMapOf(e),r=l.dataFrame.getFieldData(e);if(r){for(var a=[],s=0,n=r.length;s<n;s++){var u=d.getPoint({iNode:s,field:e,value:{y:r[s]}}),o={type:"line",iGroup:t,iNode:s,field:e,value:r[s],x:u.pos.x,y:u.pos.y,rowData:l.dataFrame.getRowDataAt(s),color:i.color};a.push(o);}p[e]={yAxis:i.yAxis,field:e,data:a};}}),p}},{key:"grow",value:function(i){var r=0,a=this.groups.length,s=this;return index_es._.each(this.groups,function(e,t){e._grow(function(){r++,i&&i(e),r==a&&s.fire("complete");});}),this}},{key:"show",value:function(e){var i=this;-1!=index_es._.indexOf(index_es._.flatten([i.field]),e)&&(this.data=this._trimGraphs(),this._setGroupsForYfield(this.data,e),index_es._.each(this.groups,function(e,t){e.resetData(i.data[e.field].data);}));}},{key:"hide",value:function(e){var i=this,t=i.getGroupIndex(e);!this.groups.length||t<0||(this.groups.splice(t,1)[0].destroy(),this.data=this._trimGraphs(),index_es._.each(this.groups,function(e,t){e.resetData(i.data[e.field].data);}));}},{key:"getGroupIndex",value:function(e){for(var t=-1,i=0,r=this.groups.length;i<r;i++)if(this.groups[i].field===e){t=i;break}return t}},{key:"getGroup",value:function(e){return this.groups[this.getGroupIndex(e)]}},{key:"_setGroupsForYfield",value:function(e,o,l){var d=this;l=l||{},o=o&&index_es._.flatten([o]);var p=index_es._.flatten([this.field]);index_es._.each(e,function(e,t){if(!o||-1!=index_es._.indexOf(o,t)){var i=d.app.getComponent({name:"coord"}).getFieldMapOf(t),r=index_es._.indexOf(p,t),a=new _group.default(i,r,d._opt,d.ctx,d.height,d.width,d);a.draw({animation:d.animation&&!l.resize},e.data);for(var s=!1,n=0,u=d.groups.length;n<u;n++)if(r<d.groups[n].iGroup){d.groups.splice(n,0,a),s=!0,d.sprite.addChildAt(a.sprite,n);break}s||(d.groups.push(a),d.sprite.addChild(a.sprite));}});}},{key:"getNodesAt",value:function(i,r){var a=[];return index_es._.each(this.groups,function(e){var t=e.getNodeInfoAt(i,r);t&&a.push(t);}),a}},{key:"getNodesOfPos",value:function(i){var r=[];return index_es._.each(this.groups,function(e){var t=e.getNodeInfoOfX(i);t&&r.push(t);}),r}}]),r}(_index.default);index_es.global.registerComponent(LineGraphs,"graphs","line");var _default=LineGraphs;exports.default=_default;
});

unwrapExports(line);

var intersect_1 = createCommonjsModule(function (module, exports) {
function ccw(e,t,c,r,u,n){var a=(n-t)*(c-e)-(r-t)*(u-e);return 0<a||!(a<0)}function intersect(e,t){var c=e[0][0],r=e[0][1],u=e[1][0],n=e[1][1],a=t[0][0],o=t[0][1],s=t[1][0],d=t[1][1];return ccw(c,r,a,o,s,d)!==ccw(u,n,a,o,s,d)&&ccw(c,r,u,n,a,o)!==ccw(c,r,u,n,s,d)}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _default=intersect;exports.default=_default;
});

unwrapExports(intersect_1);

var grid_1 = createCommonjsModule(function (module, exports) {
function Grid(e,t){this._cells=[],this._cellSize=t,this._reverseCellSize=1/t;for(var l=0;l<e.length;l++){var i=e[l],r=this.coordToCellNum(i[0]),o=this.coordToCellNum(i[1]);if(this._cells[r])this._cells[r][o]?this._cells[r][o].push(i):this._cells[r][o]=[i];else{var s=[];s[o]=[i],this._cells[r]=s;}}}function grid(e,t){return new Grid(e,t)}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0,Grid.prototype={cellPoints:function(e,t){return void 0!==this._cells[e]&&void 0!==this._cells[e][t]?this._cells[e][t]:[]},rangePoints:function(e){for(var t=this.coordToCellNum(e[0]),l=this.coordToCellNum(e[1]),i=this.coordToCellNum(e[2]),r=this.coordToCellNum(e[3]),o=[],s=t;s<=i;s++)for(var c=l;c<=r;c++)Array.prototype.push.apply(o,this.cellPoints(s,c));return o},removePoint:function(e){for(var t,l=this.coordToCellNum(e[0]),i=this.coordToCellNum(e[1]),r=this._cells[l][i],o=0;o<r.length;o++)if(r[o][0]===e[0]&&r[o][1]===e[1]){t=o;break}return r.splice(t,1),r},trunc:Math.trunc||function(e){return e-e%1},coordToCellNum:function(e){return this.trunc(e*this._reverseCellSize)},extendBbox:function(e,t){return [e[0]-t*this._cellSize,e[1]-t*this._cellSize,e[2]+t*this._cellSize,e[3]+t*this._cellSize]}};var _default=grid;exports.default=_default;
});

unwrapExports(grid_1);

var format = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _default={toXy:function(t,e){return void 0===e?t.slice():t.map(function(t){return new Function("pt","return [pt"+e[0]+",pt"+e[1]+"];")(t)})},fromXy:function(t,e){return void 0===e?t.slice():t.map(function(t){return new Function("pt","const o = {}; o"+e[0]+"= pt[0]; o"+e[1]+"= pt[1]; return o;")(t)})}};exports.default=_default;
});

unwrapExports(format);

var convex_1 = createCommonjsModule(function (module, exports) {
function _cross(e,n,t){return (n[0]-e[0])*(t[1]-e[1])-(n[1]-e[1])*(t[0]-e[0])}function _upperTangent(e){for(var n=[],t=0;t<e.length;t++){for(;2<=n.length&&_cross(n[n.length-2],n[n.length-1],e[t])<=0;)n.pop();n.push(e[t]);}return n.pop(),n}function _lowerTangent(e){for(var n=e.reverse(),t=[],r=0;r<n.length;r++){for(;2<=t.length&&_cross(t[t.length-2],t[t.length-1],n[r])<=0;)t.pop();t.push(n[r]);}return t.pop(),t}function convex(e){var n=_upperTangent(e),t=_lowerTangent(e).concat(n);return t.push(e[0]),t}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _default=convex;exports.default=_default;
});

unwrapExports(convex_1);

var hull_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _intersect2=interopRequireDefault(intersect_1),_grid=interopRequireDefault(grid_1),_format=interopRequireDefault(format),_convex=interopRequireDefault(convex_1);function _filterDuplicates(e){for(var t=[e[0]],r=e[0],n=1;n<e.length;n++){var o=e[n];r[0]===o[0]&&r[1]===o[1]||t.push(o),r=o;}return t}function _sortByX(e){return e.sort(function(e,t){return e[0]-t[0]||e[1]-t[1]})}function _sqLength(e,t){return Math.pow(t[0]-e[0],2)+Math.pow(t[1]-e[1],2)}function _cos(e,t,r){var n=[t[0]-e[0],t[1]-e[1]],o=[r[0]-e[0],r[1]-e[1]],u=_sqLength(e,t),i=_sqLength(e,r);return (n[0]*o[0]+n[1]*o[1])/Math.sqrt(u*i)}function _intersect(e,t){for(var r=0;r<t.length-1;r++){var n=[t[r],t[r+1]];if(!(e[0][0]===n[0][0]&&e[0][1]===n[0][1]||e[0][0]===n[1][0]&&e[0][1]===n[1][1])&&(0, _intersect2.default)(e,n))return !0}return !1}function _occupiedArea(e){for(var t=1/0,r=1/0,n=-1/0,o=-1/0,u=e.length-1;0<=u;u--)e[u][0]<t&&(t=e[u][0]),e[u][1]<r&&(r=e[u][1]),e[u][0]>n&&(n=e[u][0]),e[u][1]>o&&(o=e[u][1]);return [n-t,o-r]}function _bBoxAround(e){return [Math.min(e[0][0],e[1][0]),Math.min(e[0][1],e[1][1]),Math.max(e[0][0],e[1][0]),Math.max(e[0][1],e[1][1])]}function _midPoint(e,t,r){for(var n,o,u=null,i=MAX_CONCAVE_ANGLE_COS,_=MAX_CONCAVE_ANGLE_COS,a=0;a<t.length;a++)n=_cos(e[0],e[1],t[a]),o=_cos(e[1],e[0],t[a]),i<n&&_<o&&!_intersect([e[0],t[a]],r)&&!_intersect([e[1],t[a]],r)&&(i=n,_=o,u=t[a]);return u}function _concave(e,t,r,n,o){for(var u=!1,i=0;i<e.length-1;i++){var _=[e[i],e[i+1]],a=_[0][0]+","+_[0][1]+","+_[1][0]+","+_[1][1];if(!(_sqLength(_[0],_[1])<t||o.has(a))){for(var f=0,c=_bBoxAround(_),l=void 0,s=void 0,d=void 0;l=(c=n.extendBbox(c,f))[2]-c[0],s=c[3]-c[1],f++,null===(d=_midPoint(_,n.rangePoints(c),e))&&(r[0]>l||r[1]>s););l>=r[0]&&s>=r[1]&&o.add(a),null!==d&&(e.splice(i+1,0,d),n.removePoint(d),u=!0);}}return u?_concave(e,t,r,n,o):e}function hull(e,t,r){var n=t||20,o=_filterDuplicates(_sortByX(_format.default.toXy(e,r)));if(o.length<4)return o.concat([o[0]]);var u=_occupiedArea(o),i=[u[0]*MAX_SEARCH_BBOX_SIZE_PERCENT,u[1]*MAX_SEARCH_BBOX_SIZE_PERCENT],_=(0, _convex.default)(o),a=o.filter(function(e){return _.indexOf(e)<0}),f=Math.ceil(1/(o.length/(u[0]*u[1]))),c=_concave(_,Math.pow(n,2),i,(0, _grid.default)(a,f),new Set);return r?_format.default.fromXy(c,r):c}var MAX_CONCAVE_ANGLE_COS=Math.cos(90/(180/Math.PI)),MAX_SEARCH_BBOX_SIZE_PERCENT=.6,_default=hull;exports.default=_default;
});

unwrapExports(hull_1);

var scat = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_assertThisInitialized2=interopRequireDefault(assertThisInitialized$1),_createClass2=interopRequireDefault(createClass$1),_inherits2=interopRequireDefault(inherits$1),_canvax=interopRequireDefault(Canvax),_index=interopRequireDefault(graphs),_index2=interopRequireDefault(hull_1),Circle=_canvax.default.Shapes.Circle,Rect=_canvax.default.Shapes.Rect,Line=_canvax.default.Shapes.Line,Polygon=_canvax.default.Shapes.Polygon,ScatGraphs=function(e){function l(e,t){var i;return (0, _classCallCheck2.default)(this,l),(i=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(l).call(this,e,t))).type="scat",i._rData=null,i._rMaxValue=null,i._rMinValue=null,i._groupData={},index_es._.extend(!0,(0, _assertThisInitialized2.default)(i),(0, index_es.getDefaultProps)(l.defaultProps()),e),i.init(),i}return (0, _inherits2.default)(l,e),(0, _createClass2.default)(l,null,[{key:"defaultProps",value:function(){return {field:{detail:"字段配置",default:null},groupField:{detail:"分组字段",default:null,documentation:"分组字段，如果area配置enabled为true，那么需要groupField来构建几个area"},dataFilter:{detail:"散点过滤数据",default:null,documentation:"数据过滤器，可以和groupField实现交叉过滤"},aniOrigin:{detail:"节点动画的原点",default:"default",documentation:"可选的还有center（坐标正中）、origin（坐标原点）"},node:{detail:"单数据节点图形设置",propertys:{dataKey:{detail:"元素的数据id，默认索引匹配",default:"__index__"},shapeType:{detail:"图形类型",default:"circle",documentation:"节点的现状可以是圆 ，也可以是rect，也可以是三角形，后面两种后面实现"},maxRadius:{detail:"节点最大半径",default:25},minRadius:{detail:"节点最小半径",default:5},radius:{detail:"半径",default:null},radiusScale:{detail:"半径缩放比例",documentation:"在计算好真实半径后缩放，主要用在,缩略图中，比如datazoom的缩略图",default:1},normalRadius:{detail:"默认半径",default:15},fillStyle:{detail:"节点景色",default:null},fillAlpha:{detail:"节点透明度",default:.8},strokeStyle:{detail:"节点描边颜色",default:null},lineWidth:{detail:"节点描边线宽",default:0},strokeAlpha:{detail:"节点描边透明度",default:1},focus:{detail:"节点hover态设置",propertys:{enabled:{detail:"是否开启",default:!0},lineWidth:{detail:"hover后的边框大小",default:6},strokeAlpha:{detail:"hover后的边框透明度",default:.2},fillAlpha:{detail:"hover后的背景透明度",default:.8}}},select:{detail:"节点选中态设置",propertys:{enabled:{detail:"是否开启",default:!1},lineWidth:{detail:"选中后的边框大小",default:8},strokeAlpha:{detail:"选中后的边框透明度",default:.4},fillAlpha:{detail:"选中后的背景透明度",default:1}}}}},line:{detail:"每个节点和指标轴线的连线",propertys:{enabled:{detail:"是否开启",default:!1},lineWidth:{detail:"连线宽",default:1},strokeStyle:{detail:"连线颜色",default:"#ccc"},lineType:{detail:"连线类型",default:"dashed"}}},area:{detail:"散点集合组成的面",propertys:{enabled:{detail:"是否开启",default:!1},concavity:{detail:"凹凸系数，默认80，越大越凸",default:88},quantile:{detail:"散点用来计入面积的分位数",default:8},fillStyle:{detail:"散点集合面的背景色",default:null},fillAlpha:{detail:"散点集合面的透明度",default:.15},strokeStyle:{detail:"散点集合面的描边颜色",default:null},lineWidth:{detail:"散点集合面的描边线宽",default:0},strokeAlpha:{detail:"散点集合面的描边透明度",default:.5}}},label:{detail:"文本设置",propertys:{enabled:{detail:"是否开启",default:!0},field:{detail:"获取label的字段",default:null},format:{detail:"label格式化处理函数",default:function(e){return e}},fontSize:{detail:"label字体大小",default:13},fontColor:{detail:"字体颜色",default:"#888"},strokeStyle:{detail:"字体描边颜色",default:"#ffffff"},lineWidth:{detail:"描边大小",default:0},textAlign:{detail:"水平对齐方式",default:"center"},verticalAlign:{detail:"垂直基线对齐方式",default:"middle"},position:{detail:"文本布局位置",documentation:"auto(目前等于center，还未实现),center,top,right,bottom,left",default:"center"},offsetX:{detail:"x方向偏移量",default:0},offsetY:{detail:"y方向偏移量",default:0}}}}}}]),(0, _createClass2.default)(l,[{key:"init",value:function(){this._shapesp=new _canvax.default.Display.Sprite({id:"scat_shapesp"}),this._textsp=new _canvax.default.Display.Sprite({id:"textsp"}),this._linesp=new _canvax.default.Display.Sprite({id:"textsp"}),this._areasp=new _canvax.default.Display.Sprite({id:"areasp"}),this.sprite.addChild(this._areasp),this.sprite.addChild(this._linesp),this.sprite.addChild(this._shapesp),this.sprite.addChild(this._textsp);}},{key:"draw",value:function(e){e=e||{},index_es._.extend(!0,this,e),this.data=this._trimGraphs(),this._widget(),this.sprite.context.x=this.origin.x,this.sprite.context.y=this.origin.y;var t=this;return !this.animation||e.resize||t.inited?this.fire("complete"):this.grow(function(){t.fire("complete");}),this}},{key:"resetData",value:function(e){this.dataFrame=e,this.data=this._trimGraphs(),this._widget(),this.grow();}},{key:"getNodesAt",value:function(){return []}},{key:"_trimGraphs",value:function(){var e=[];this._groupData={};var t=this.app.getComponent({name:"coord"}),i=this.dataFrame.length;this._rData=null,this._rMaxValue=null,this._rMinValue=null;for(var l=0;l<i;l++){var a=this.dataFrame.getRowDataAt(l),s=t.getFieldMapOf(this.field),n=t.getPoint({iNode:l,field:this.field,value:{y:a[this.field]}});if(null!=n.pos.x&&null!=n.pos.y){var r={type:"scat",rowData:a,x:n.pos.x,y:n.pos.y,value:n.value,field:this.field,fieldColor:s.color,iNode:l,focused:!1,selected:!1,radius:null,fillStyle:null,color:null,strokeStyle:null,strokeAlpha:1,lineWidth:0,shapeType:null,label:null,fillAlpha:1,nodeElement:null};if(this._setR(r),this._setFillStyle(r),this._setFillAlpha(r),this._setStrokeStyle(r),this._setLineWidth(r),this._setStrokeAlpha(r),this._setNodeType(r),this._setText(r),!this.dataFilter||!index_es._.isFunction(this.dataFilter)||this.dataFilter.apply(this,[r])){if(this.groupField){var d=a[this.groupField];d&&(this._groupData[d]||(this._groupData[d]=[]),this._groupData[d].push(r));}else this._groupData.all||(this._groupData.all=[]),this._groupData.all.push(r);e.push(r);}}}return e}},{key:"_setR",value:function(e){var t=this.node.normalRadius,i=e.rowData;if(null!=this.node.radius){if(index_es._.isString(this.node.radius)&&i[this.node.radius]){this._rData||this._rMaxValue||this._rMinValue||(this._rData=this.dataFrame.getFieldData(this.node.radius),this._rMaxValue=index_es._.max(this._rData),this._rMinValue=index_es._.min(this._rData));var l=i[this.node.radius];t=this._rMaxValue==this._rMinValue?this.node.minRadius+(this.node.maxRadius-this.node.minRadius)/2:this.node.minRadius+(l-this._rMinValue)/(this._rMaxValue-this._rMinValue)*(this.node.maxRadius-this.node.minRadius);}index_es._.isFunction(this.node.radius)&&(t=this.node.radius(i)),isNaN(parseInt(this.node.radius))||(t=parseInt(this.node.radius));}return t=Math.max(t*this.node.radiusScale,2),e.radius=t,this}},{key:"_setText",value:function(e){null!=this.label.field&&index_es._.isString(this.label.field)&&e.rowData[this.label.field]&&(e.label=this.label.format(e.rowData[this.label.field],e));}},{key:"_setFillStyle",value:function(e){return e.color=e.fillStyle=this._getStyle(this.node.fillStyle,e),this}},{key:"_setFillAlpha",value:function(e){return e.fillAlpha=this._getProp(this.node.fillAlpha,e),this}},{key:"_setStrokeAlpha",value:function(e){return e.strokeAlpha=this._getProp(this.node.strokeAlpha,e),this}},{key:"_setStrokeStyle",value:function(e){return e.strokeStyle=this._getStyle(this.node.strokeStyle||this.node.fillStyle,e),this}},{key:"_getProp",value:function(e,t){var i=e;return index_es._.isArray(e)&&(i=e[t.iGroup]),index_es._.isFunction(e)&&(i=e.apply(this,[t])),i}},{key:"_getStyle",value:function(e,t){var i=e;return index_es._.isArray(e)&&(i=e[t.iGroup]),index_es._.isFunction(e)&&(i=e.apply(this,[t])),i=i||t.fieldColor}},{key:"_setLineWidth",value:function(e){return e.lineWidth=this._getProp(this.node.lineWidth,e),this}},{key:"_setNodeType",value:function(e){var t=this.node.shapeType;return index_es._.isArray(t)&&(t=t[e.iGroup]),index_es._.isFunction(t)&&(t=t(e)),t=t||"circle",e.shapeType=t,this}},{key:"_widget",value:function(){var e=this,o=this;if(index_es._.each(index_es._.flatten([o._shapesp.children,o._textsp.children,o._linesp.children]),function(e){e.__used=!1;}),index_es._.each(o.data,function(e,t){var i=o._getNodeElement(e,t);i||(e.__isNew=!0);var l=o._getNodeContext(e),a="circle"==e.shapeType?Circle:Rect;if(i?i.animate(l):(i=new a({id:"shape_"+t,hoverClone:!1,context:l}),o._shapesp.addChild(i),i.on(index_es.event.types.get(),function(e){e.eventInfo={title:null,trigger:o.node,nodes:[this.nodeData]},this.nodeData.label&&(e.eventInfo.title=this.nodeData.label),"mouseover"==e.type&&o.focusAt(this.nodeData.iNode),"mouseout"==e.type&&(this.nodeData.selected||o.unfocusAt(this.nodeData.iNode)),o.app.fire(e.type,e);})),i.__used=!0,i.nodeData=e,i.iNode=t,e.nodeElement=i,o.line.enabled){var s=i.lineElement,n={start:{x:l.x,y:l.y+l.r},end:{x:l.x,y:0},lineWidth:o.line.lineWidth,strokeStyle:o.line.strokeStyle,lineType:o.line.lineType};s?s.animate(n):(s=new Line({context:n}),o._linesp.addChild(s)),s.__used=!0,i.lineElement=s;}if(e.label&&o.label.enabled){var r=i.labelElement,d={};r?(r.resetText(e.label),d=o._getTextContext(r,l),r.animate(d)):(r=new _canvax.default.Display.Text(e.label,{id:"scat_text_"+t,context:{}}),d=o._getTextContext(r,l),index_es._.extend(r.context,d),o._textsp.addChild(r)),r.__used=!0,(i.labelElement=r).nodeElement=i;}}),o.area.enabled){o._areasp.removeAllChildren();var t=0,i=function(){a=e._groupData[l],s={name:l,iGroup:t,data:a},n=[],index_es._.each(a,function(e){n=n.concat(function(e,t){if(!t||1==t)return [[e.x,e.y]];for(var i=[],l=0;l<t;l++){var a=360/(t-1)*l,s=e.radius+3,n=e.x+Math.cos(2*Math.PI/360*a)*s,r=e.y+Math.sin(2*Math.PI/360*a)*s;i.push([n,r]);}return i}(e,o.area.quantile));}),r=(0, _index2.default)(n,o.area.concavity),d=o.app.getTheme(t),u=o._getStyle(o.area.fillStyle,s)||d,h=o._getProp(o.area.fillAlpha,s),f=o._getStyle(o.area.strokeStyle,s)||d,p=o._getProp(o.area.lineWidth,s),_=o._getProp(o.area.strokeAlpha,s),c=new Polygon({context:{pointList:r,fillStyle:u,fillAlpha:h,strokeStyle:f,lineWidth:p,strokeAlpha:_,smooth:!1}}),o._areasp.addChild(c),t++;};for(var l in this._groupData){var a,s,n,r,d,u,h,f,p,_,c;i();}}index_es._.each(index_es._.flatten([o._shapesp.children,o._textsp.children,o._linesp.children]),function(e){e.__used||e.animate({globalAlpha:0,r:0},{onComplete:function(){e.destroy();}});});}},{key:"_getNodeElement",value:function(e,t){var i,l=this.node.dataKey;if(l){index_es._.isString(l)&&(l=l.split(","));for(var a=0,s=this._shapesp.children.length;a<s;a++){for(var n=this._shapesp.children[a],r=!0,d=0,o=l.length;d<o;d++){var u=l[d];if(n.nodeData.rowData[u]!=e.rowData[u]){r=!1;break}}if(r&&l.length){i=n;break}}}else i=this._shapesp.getChildAt(t);return i}},{key:"_getTextPosition",value:function(e,t){var i=0,l=0;switch(this.label.position){case"center":i=t.x,l=t.y;break;case"top":i=t.x,l=t.y-t.r;break;case"right":i=t.x+t.r,l=t.y;break;case"bottom":i=t.x,l=t.y+t.r;break;case"left":i=t.x-t.r,l=t.y;break;case"auto":i=t.x,l=t.y,e.getTextWidth()>2*t.r&&(l=t.y+t.r+.5*e.getTextHeight());}return {x:i+this.label.offsetX,y:l+this.label.offsetY}}},{key:"_getTextContext",value:function(e,t){var i=this._getTextPosition(e,t),l=this.label.fontSize;e.getTextWidth()>2*t.r&&(l-=2);var a={x:i.x,y:i.y,fillStyle:this.label.fontColor||t.fillStyle,fontSize:l,strokeStyle:this.label.strokeStyle||t.fillStyle,lineWidth:this.label.lineWidth,textAlign:this.label.textAlign,textBaseline:this.label.verticalAlign};return this.animation&&!this.inited&&this._setCtxAniOrigin(a),a}},{key:"_setCtxAniOrigin",value:function(e){if("default"==this.aniOrigin&&(e.y=0),"origin"==this.aniOrigin){var t=this.app.getComponent({name:"coord"}).getOriginPos({field:this.field});e.x=t.x,e.y=t.y;}"center"==this.aniOrigin&&(e.x=this.width/2,e.y=-this.height/2);}},{key:"_getNodeContext",value:function(e){if("circle"==e.shapeType)return this._getCircleContext(e)}},{key:"_getCircleContext",value:function(e){var t={x:e.x,y:e.y,r:e.radius,fillStyle:e.fillStyle,strokeStyle:e.strokeStyle,strokeAlpha:e.strokeAlpha,lineWidth:e.lineWidth,fillAlpha:e.fillAlpha,cursor:"pointer"};return !this.animation||this.inited&&!e.__isNew||(this._setCtxAniOrigin(t),t.r=1),t}},{key:"grow",value:function(t){var i=0,l=this.data.length-1,a=this;index_es._.each(this.data,function(e){e.__isNew&&a._growNode(e,function(){i+=1,delete e.__isNew,i==l&&t&&t();});});}},{key:"_growNode",value:function(e,t){var i=this;e.nodeElement.animate({x:e.x,y:e.y,r:e.radius},{onUpdate:function(e){if(this.labelElement&&this.labelElement.context){var t=i._getTextPosition(this.labelElement,e);this.labelElement.context.x=t.x,this.labelElement.context.y=t.y;}this.lineElement&&this.lineElement.context&&(this.lineElement.context.start.y=e.y+e.r);},delay:Math.round(300*Math.random()),onComplete:function(){t&&t();}});}},{key:"focusAt",value:function(e){var t=this.data[e];if(this.node.focus.enabled&&!t.focused){var i=t.nodeElement.context;i.lineWidth=this.node.focus.lineWidth,i.strokeAlpha=this.node.focus.strokeAlpha,i.fillAlpha=this.node.focus.fillAlpha,t.focused=!0;}}},{key:"unfocusAt",value:function(e){var t=this.data[e];if(this.node.focus.enabled&&t.focused){var i=t.nodeElement.context;i.lineWidth=t.lineWidth,i.strokeAlpha=t.strokeAlpha,i.fillAlpha=t.fillAlpha,i.strokeStyle=t.strokeStyle,t.focused=!1;}}},{key:"selectAt",value:function(e){var t=this.data[e];if(this.node.select.enabled&&!t.selected){var i=t.nodeElement.context;i.lineWidth=this.node.select.lineWidth,i.strokeAlpha=this.node.select.strokeAlpha,i.fillAlpha=this.node.select.fillAlpha,t.selected=!0;}}},{key:"unselectAt",value:function(e){var t=this.data[e];if(this.node.select.enabled&&t.selected){var i=t.nodeElement.context;t.focused?(i.lineWidth=this.node.focus.lineWidth,i.strokeAlpha=this.node.focus.strokeAlpha,i.fillAlpha=this.node.focus.fillAlpha):(i.lineWidth=t.lineWidth,i.strokeAlpha=t.strokeAlpha,i.fillAlpha=t.fillAlpha),t.selected=!1;}}},{key:"getNodesOfPos",value:function(){return []}}]),l}(_index.default);index_es.global.registerComponent(ScatGraphs,"graphs","scat");var _default2=ScatGraphs;exports.default=_default2;
});

unwrapExports(scat);

var pie = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_createClass2=interopRequireDefault(createClass$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_inherits2=interopRequireDefault(inherits$1),_canvax=interopRequireDefault(Canvax),Sector=_canvax.default.Shapes.Sector,Path=_canvax.default.Shapes.Path,AnimationFrame=_canvax.default.AnimationFrame,Pie=function(e){function s(e,t){var n;return (0, _classCallCheck2.default)(this,s),(n=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(s).call(this))).width=0,n.height=0,n.origin={x:0,y:0},n._graphs=e,n.domContainer=e.app.canvax.domView,n.data=t,n.sprite=null,n.textSp=null,n.sectorsSp=null,n.selectedSp=null,n.init(),n.sectors=[],n.textMaxCount=15,n.textList=[],n.completed=!1,n}return (0, _inherits2.default)(s,e),(0, _createClass2.default)(s,[{key:"init",value:function(){this.sprite=new _canvax.default.Display.Sprite,this.sectorsSp=new _canvax.default.Display.Sprite,this.sprite.addChild(this.sectorsSp),this.selectedSp=new _canvax.default.Display.Sprite,this.sprite.addChild(this.selectedSp),this._graphs.label.enabled&&(this.textSp=new _canvax.default.Display.Sprite);}},{key:"draw",value:function(e){var t=this;index_es._.extend(!0,this,e),this.sprite.context.x=t.origin.x,this.sprite.context.y=t.origin.y,t._widget();}},{key:"resetData",value:function(e){var t=this;this.data=e,t.destroyLabel();for(var n=0,s=0;s<t.sectors.length;s++){var a=t.sectors[s],i=this.data.list[s];a.animate({r:i.outRadius,startAngle:i.startAngle,endAngle:i.endAngle},{duration:280,onComplete:function(){++n==t.sectors.length&&t._graphs.label.enabled&&t._startWidgetLabel();}});}}},{key:"_widget",value:function(){var t=this,e=t.data.list,n=t.data.total;if(0<e.length&&0<n){t.textSp&&t.sprite.addChild(t.textSp);for(var s=0;s<e.length;s++){var a=e[s],i=new Sector({hoverClone:!1,xyToInt:!1,context:{x:a.focused?a.outOffsetx:0,y:a.focused?a.outOffsety:0,r0:a.innerRadius,r:a.outRadius,startAngle:a.startAngle,endAngle:a.endAngle,fillStyle:a.fillStyle,cursor:"pointer"},id:"sector"+s});(i.nodeData=a).focusEnabled&&i.hover(function(e){t.focusOf(this.nodeData);},function(e){this.nodeData.selected||t.unfocusOf(this.nodeData);}),i.on(index_es.event.types.get(),function(e){e.eventInfo={trigger:t._graphs.node,nodes:[this.nodeData]},t._graphs.app.fire(e.type,e);}),t.sectorsSp.addChildAt(i,0),t.sectors.push(i);}t._graphs.label.enabled&&t._startWidgetLabel();}}},{key:"focusOf",value:function(e,t){if(!e.focused){this.sectors[e.iNode].animate({x:e.outOffsetx,y:e.outOffsety},{duration:100,onComplete:function(){t&&t();}}),e.focused=!0;}}},{key:"unfocusOf",value:function(e,t){if(e.focused){this.sectors[e.iNode].animate({x:0,y:0},{duration:100,onComplete:function(){t&&t();}}),e.focused=!1;}}},{key:"selectOf",value:function(e){var t=this;if(this.sectors.length&&e.selectEnabled){var n=this.sectors[e.iNode];e.selected||(e.focused?this.addCheckedSec(n):(e._focusTigger="select",this.focusOf(e,function(){t.addCheckedSec(n);})),e.selected=!0);}}},{key:"unselectOf",value:function(e){var t=this.sectors[e.iNode];if(e.selected&&e.selectEnabled){var n=this;n.cancelCheckedSec(t,function(){"select"==e._focusTigger&&n.unfocusOf(e);}),e.selected=!1;}}},{key:"addCheckedSec",value:function(e,t){var n=e.context,s=e.nodeData;if(n){var a=new Sector({xyToInt:!1,context:{x:n.x,y:n.y,r0:n.r-1,r:n.r+s.selectedR,startAngle:n.startAngle,endAngle:n.startAngle,fillStyle:n.fillStyle,globalAlpha:s.selectedAlpha},id:"selected_"+e.id});e._selectedSec=a,this.selectedSp.addChild(a),this.completed?a.animate({endAngle:n.endAngle},{duration:this._getAngleTime(n),onComplete:function(){t&&t();}}):a.context.endAngle=n.endAngle;}}},{key:"cancelCheckedSec",value:function(e,t){var n=e._selectedSec;n.animate({startAngle:n.context.endAngle-.5},{duration:this._getAngleTime(e.context),onComplete:function(){delete e._selectedSec,n.destroy(),t&&t();}});}},{key:"_getAngleTime",value:function(e){return Math.abs(e.startAngle-e.endAngle)/360*500}},{key:"grow",value:function(e){var d=this;index_es._.each(d.sectors,function(e,t){e.context&&(e.context.r0=0,e.context.r=0,e.context.startAngle=d._graphs.startAngle,e.context.endAngle=d._graphs.startAngle);}),d._hideGrowLabel();var t=AnimationFrame.registTween({from:{process:0},to:{process:1},duration:500,onUpdate:function(e){for(var t=0;t<d.sectors.length;t++){var n=d.sectors[t],s=n.nodeData,a=n.context,i=s.startAngle,r=s.endAngle,l=s.outRadius,o=s.innerRadius;if(a){if(a.r=l*e.process,a.r0=o*e.process,0==t)a.startAngle=i,a.endAngle=i+(r-i)*e.process;else{var c=function(e){var t=e-1,n=d.sectors[t].context;return 0==t?n?n.endAngle:0:n?n.endAngle:arguments.callee(t)}(t);a.startAngle=c,a.endAngle=a.startAngle+(r-i)*e.process;}n._selectedSec&&(n._selectedSec.context.r0=a.r-1,n._selectedSec.context.r=a.r+s.selectedR,n._selectedSec.context.startAngle=a.startAngle,n._selectedSec.context.endAngle=a.endAngle);}}},onComplete:function(){d.sprite._removeTween(t),d._showGrowLabel(),d.completed=!0,e&&e();}});d.sprite._tweens.push(t);}},{key:"_widgetLabel",value:function(e,t,n,s,a,i){var r,l,o,c,d,u,h,f,p,g,x,v,_=this,y=0,m=_.data.list,b=2==e||3==e,S=3==e||4==e,A=b?n:s;0<t.length&&t.sort(function(e,t){return S?m[e].edgey-m[t].edgey:m[t].edgey-m[e].edgey});for(var C=0;C<t.length;C++){r=t[C];var w=m[r],k=w.outRadius+w.moveDis;if(!(!w.enabled||w.y<A||y>=_.textMaxCount)){y++,o=w.edgey,c=Math.abs(w.edgex),d=o-l,0!=C&&(Math.abs(d)<15||S&&d<0||!S&&0<d)&&(o=S?l+15:l-15,0<k-Math.abs(o)&&(c=Math.sqrt(Math.pow(k,2)-Math.pow(o,2))),(b&&-c>w.edgex||!b&&c<w.edgex)&&(c=Math.abs(w.edgex))),a&&(g=b?i.left:i.right,x=t.length-C,v=S?g-15*x:g+15*x,(S&&v<o||!S&&o<v)&&(o=v)),l=o,a||(b?i.left=l:i.right=l);var D=b?-c-5:c+5,R=D+_.origin.x,q=o+_.origin.y;if(R>_._graphs.app.width||q<0||q>_._graphs.app.height)return;var L="M"+w.centerx+","+w.centery;L+="Q"+w.outx+","+w.outy+","+D+","+o;var M=new Path({context:{lineType:"solid",path:L,lineWidth:1,strokeStyle:w.fillStyle}}),Q=w.labelText,O=document.createElement("div");switch(O.style.cssText=" ;position:absolute;left:-1000px;top:-1000px;color:"+w.fillStyle,O.innerHTML=Q,_.domContainer.appendChild(O),u=O.offsetWidth,h=O.offsetHeight,f=b?-c:c,p=o,e){case 1:f+=5,p-=h/2;break;case 2:case 3:f-=u+5,p-=h/2;break;case 4:f+=5,p-=h/2;}O.style.left=f+_.origin.x+"px",O.style.top=p+_.origin.y+"px",_.textSp.addChild(M),_.textList.push({width:u,height:h,x:f+_.origin.x,y:p+_.origin.y,data:w,textTxt:Q,textEle:O});}}}},{key:"_startWidgetLabel",value:function(){for(var e,t,n=this,s=n.data.list,a=0,i=0,r=[],l=[{indexs:[],count:0},{indexs:[],count:0},{indexs:[],count:0},{indexs:[],count:0}],o={right:{startQuadrant:4,endQuadrant:1,clockwise:!0,indexs:[]},left:{startQuadrant:3,endQuadrant:2,clockwise:!1,indexs:[]}},c=0;c<s.length;c++){var d=s[c].quadrant;l[d-1].indexs.push(c),l[d-1].count++;}1<l[0].count&&l[0].indexs.reverse(),1<l[2].count&&l[2].indexs.reverse(),l[0].count>l[3].count&&(o.right.startQuadrant=1,o.right.endQuadrant=4,o.right.clockwise=!1),l[1].count>l[2].count&&(o.left.startQuadrant=2,o.left.endQuadrant=3,o.left.clockwise=!0),o.right.indexs=l[o.right.startQuadrant-1].indexs.concat(l[o.right.endQuadrant-1].indexs),o.left.indexs=l[o.left.startQuadrant-1].indexs.concat(l[o.left.endQuadrant-1].indexs),o.right.indexs.length>n.textMaxCount&&((t=o.right.indexs.slice(0)).sort(function(e,t){return s[t].y-s[e].y}),e=t.slice(n.textMaxCount),s[e[0]].percentage,a=s[e[0]].y),o.left.indexs.length>n.textMaxCount&&((t=o.left.indexs.slice(0)).sort(function(e,t){return s[t].y-s[e].y}),e=t.slice(n.textMaxCount),s[e[0]].percentage,i=s[e[0]].y),r.push(o.right.startQuadrant),r.push(o.right.endQuadrant),r.push(o.left.startQuadrant),r.push(o.left.endQuadrant);var u={};for(c=0;c<r.length;c++){var h=1==c||3==c;n._widgetLabel(r[c],l[r[c]-1].indexs,i,a,h,u);}}},{key:"destroyLabel",value:function(){var t=this;this.textSp&&this.textSp.removeAllChildren(),index_es._.each(this.textList,function(e){t.domContainer.removeChild(e.textEle);}),this.textList=[];}},{key:"_showGrowLabel",value:function(){this.textSp&&this.textSp.context&&(this.textSp.context.globalAlpha=1,index_es._.each(this.textList,function(e){e.textEle.style.visibility="visible";}));}},{key:"_hideGrowLabel",value:function(){this.textSp&&this.textSp.context&&(this.textSp.context.globalAlpha=0,index_es._.each(this.textList,function(e){e.textEle.style.visibility="hidden";}));}}]),s}(index_es.event.Dispatcher);exports.default=Pie;
});

unwrapExports(pie);

var pie$1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_assertThisInitialized2=interopRequireDefault(assertThisInitialized$1),_createClass2=interopRequireDefault(createClass$1),_inherits2=interopRequireDefault(inherits$1),_pie=interopRequireDefault(pie),_index=interopRequireDefault(graphs),PieGraphs=function(e){function a(e,t){var i;return (0, _classCallCheck2.default)(this,a),(i=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(a).call(this,e,t))).type="pie",index_es._.extend(!0,(0, _assertThisInitialized2.default)(i),(0, index_es.getDefaultProps)(a.defaultProps()),e),i.init(),i}return (0, _inherits2.default)(a,e),(0, _createClass2.default)(a,null,[{key:"defaultProps",value:function(){return {field:{detail:"字段配置",default:null},groupField:{detail:"分组字段",default:null,documentation:"groupField主要是给legend用的， 所有在legend中需要显示的分组数据，都用groupField"},sort:{detail:"排序，默认不排序，可以配置为asc,desc",default:null},startAngle:{detail:"起始角度",default:-90},allAngle:{detail:"全部角度",default:360},node:{detail:"单个节点（扇形）配置",propertys:{radius:{detail:"半径",default:null,documentation:"每个扇形单元的半径，也可以配置一个字段，就成了丁格尔玫瑰图"},innerRadius:{detail:"内径",default:0},outRadius:{detail:"外径",default:null},minRadius:{detail:"最小的半径厚度",default:10,documentation:"outRadius - innerRadius ， 也就是radius的最小值"},moveDis:{detail:"hover偏移量",default:15,documentation:"要预留moveDis位置来hover sector 的时候外扩"},fillStyle:{detail:"单个图形背景色",default:null},focus:{detail:"图形的hover设置",propertys:{enabled:{detail:"是否开启",default:!0}}},select:{detail:"图形的选中效果",propertys:{enabled:{detail:"是否开启",default:!0},radius:{detail:"选中效果图形的半径厚度",default:5},alpha:{detail:"选中效果图形的透明度",default:.7}}}}},label:{detail:"label",propertys:{field:{detail:"获取label的字段",default:null},enabled:{detail:"是否开启",default:!1},format:{detail:"label的格式化函数，支持html",default:null}}}}}}]),(0, _createClass2.default)(a,[{key:"init",value:function(){this.data=this._dataHandle();}},{key:"_computerProps",value:function(){var e=this.width,t=this.height;if(!this.node.outRadius){var i=Math.min(e,t)/2;this.label.enabled&&(i-=this.node.moveDis),this.node.outRadius=parseInt(i);}null!==this.node.radius&&index_es._.isNumber(this.node.radius)&&(this.node.radius=Math.max(this.node.radius,this.node.minRadius),this.node.innerRadius=this.node.outRadius-this.node.radius),this.node.outRadius-this.node.innerRadius<this.node.minRadius&&(this.node.innerRadius=this.node.outRadius-this.node.minRadius),this.node.innerRadius<0&&(this.node.innerRadius=0);}},{key:"draw",value:function(e){e=e||{},index_es._.extend(!0,this,e),this._computerProps(),this._pie=new _pie.default(this,this._trimGraphs(this.data)),this._pie.draw(e);var t=this;this.animation&&!e.resize?this._pie.grow(function(){t.fire("complete");}):this.fire("complete"),this.sprite.addChild(this._pie.sprite);}},{key:"show",value:function(e){this._setEnabled(e,!0);}},{key:"hide",value:function(e){this._setEnabled(e,!1);}},{key:"_setEnabled",value:function(t,i){var e=this;index_es._.each(this.data,function(e){if(e.label===t)return e.enabled=i,!1}),e._pie.resetData(e._trimGraphs(e.data));}},{key:"_dataHandle",value:function(){for(var i=this,e=[],t=i.dataFrame,a=0,l=t.length;a<l;a++){var n=t.getRowDataAt(a),r={type:"pie",rowData:n,focused:!1,focusEnabled:i.node.focus.enabled,selected:!1,selectEnabled:i.node.select.enabled,selectedR:i.node.select.radius,selectedAlpha:i.node.select.alpha,enabled:!0,fillStyle:null,color:null,value:n[i.field],label:n[i.groupField||i.label.field||i.field],labelText:null,iNode:a},s=i._getColor(i.node.fillStyle,r);r.fillStyle=r.color=s,e.push(r);}return e.length&&i.sort&&(e.sort(function(e,t){return "asc"==i.sort?e.value-t.value:t.value-e.value}),index_es._.each(e,function(e,t){e.iNode=t;})),e}},{key:"_trimGraphs",value:function(e){var i=this,t=0;i.currentAngle=0+i.startAngle%360;var a=i.allAngle+i.startAngle%i.allAngle,l=0,n=0;if(e.length){for(var r=0;r<e.length;r++)if(e[r].enabled&&(t+=e[r].value,i.node.radius&&index_es._.isString(i.node.radius)&&i.node.radius in e[r].rowData)){var s=Number(e[r].rowData[i.node.radius]);l=Math.max(l,s),n=Math.min(n,s);}if(0<t)for(var u=0;u<e.length;u++){var d=e[u].value/t;e[u].enabled||(d=0);var o=+(100*d).toFixed(2),f=i.allAngle*d,h=i.currentAngle+f>a?a:i.currentAngle+f,c=Math.cos((i.currentAngle+f/2)/180*Math.PI),p=Math.sin((i.currentAngle+f/2)/180*Math.PI),_=i.currentAngle+f/2;c=c.toFixed(5),p=p.toFixed(5);var v=function(e){a<=e&&(e=a),e%=i.allAngle;var t=parseInt(e/90);if(0<=e)switch(t){case 0:return 1;case 1:return 2;case 2:return 3;case 3:case 4:return 4}else if(e<0)switch(t){case 0:return 4;case-1:return 3;case-2:return 2;case-3:case-4:return 1}}(_),m=i.node.outRadius;if(i.node.radius&&index_es._.isString(i.node.radius)&&i.node.radius in e[u].rowData){var b=Number(e[u].rowData[i.node.radius]);m=parseInt((i.node.outRadius-i.node.innerRadius)*((b-n)/(l-n))+i.node.innerRadius);}var g=i.node.moveDis;index_es._.extend(e[u],{outRadius:m,innerRadius:i.node.innerRadius,startAngle:i.currentAngle,endAngle:h,midAngle:_,moveDis:g,outOffsetx:.7*g*c,outOffsety:.7*g*p,centerx:m*c,centery:m*p,outx:(m+g)*c,outy:(m+g)*p,edgex:(m+g)*c,edgey:(m+g)*p,orginPercentage:d,percentage:o,quadrant:v,labelDirection:1==v||4==v?1:0,iNode:u}),e[u].labelText=i._getLabelText(e[u]),i.currentAngle+=f,i.currentAngle>a&&(i.currentAngle=a);}}return {list:e,total:t}}},{key:"_getColor",value:function(e,t){var i=t.iNode,a=e;return index_es._.isArray(e)&&(a=e[i]),index_es._.isFunction(e)&&(a=s.apply(this,[t])),a=a||this.app.getTheme(i)}},{key:"_getLabelText",value:function(e){var t;if(this.label.enabled)if(this.label.format)index_es._.isFunction(this.label.format)&&(t=this.label.format(e.label,e));else{var i=this.label.field||this.groupField;t=i?e.rowData[i]+"："+e.percentage+"%":e.percentage+"%";}return t}},{key:"getList",value:function(){return this.data}},{key:"getLegendData",value:function(){var t=[];return index_es._.each(this.data,function(e){t.push({name:e.label,color:e.fillStyle,enabled:e.enabled});}),t}},{key:"tipsPointerOf",value:function(){}},{key:"tipsPointerHideOf",value:function(){}},{key:"focusAt",value:function(e){var t=this._pie.data.list[e];this.node.focus.enabled&&this._pie.focusOf(t);}},{key:"unfocusAt",value:function(e){var t=this._pie.data.list[e];t.node.focus.enabled&&this._pie.unfocusOf(t);}},{key:"selectAt",value:function(e){var t=this._pie.data.list[e];this.node.select.enabled&&this._pie.selectOf(t);}},{key:"unselectAt",value:function(e){var t=this._pie.data.list[e];this.node.select.enabled&&this._pie.unselectOf(t);}}]),a}(_index.default);index_es.global.registerComponent(PieGraphs,"graphs","pie");var _default=PieGraphs;exports.default=_default;
});

unwrapExports(pie$1);

var radar = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_assertThisInitialized2=interopRequireDefault(assertThisInitialized$1),_createClass2=interopRequireDefault(createClass$1),_inherits2=interopRequireDefault(inherits$1),_canvax=interopRequireDefault(Canvax),_index=interopRequireDefault(graphs),Polygon=_canvax.default.Shapes.Polygon,Circle=_canvax.default.Shapes.Circle,RadarGraphs=function(e){function a(e,t){var i;return (0, _classCallCheck2.default)(this,a),(i=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(a).call(this,e,t))).type="radar",i.enabledField=null,i.groups={},index_es._.extend(!0,(0, _assertThisInitialized2.default)(i),(0, index_es.getDefaultProps)(a.defaultProps()),e),i.init(),i}return (0, _inherits2.default)(a,e),(0, _createClass2.default)(a,null,[{key:"defaultProps",value:function(){return {field:{detail:"字段配置",default:null},line:{detail:"线配置",propertys:{enabled:{detail:"是否显示",default:!0},lineWidth:{detail:"线宽",default:2},strokeStyle:{detail:"线颜色",default:null}}},area:{detail:"面积区域配置",propertys:{enabled:{detail:"是否显示",default:!0},fillStyle:{detail:"面积背景色",default:null},fillAlpha:{detail:"面积透明度",default:.1}}},node:{detail:"线上面的单数据节点图形配置",propertys:{enabled:{detail:"是否显示",default:!0},strokeStyle:{detail:"边框色",default:"#ffffff"},radius:{detail:"半径",default:4},lineWidth:{detail:"边框大小",default:1}}}}}}]),(0, _createClass2.default)(a,[{key:"init",value:function(){}},{key:"draw",value:function(e){e=e||{};index_es._.extend(!0,this,e),this.data=this._trimGraphs(),this._widget(),this.sprite.context.x=this.origin.x,this.sprite.context.y=this.origin.y,this.fire("complete");}},{key:"_widget",value:function(){var u=this,d=this.app.getComponent({name:"coord"}),f=0;index_es._.each(this.data,function(e,t){var i={},a=[];index_es._.each(e,function(e,t){a.push([e.point.x,e.point.y]);});var l=d.getFieldMapOf(t),n=u._getStyle(u.line.strokeStyle,f,l.color,l),r={pointList:a,cursor:"pointer"};u.line.enabled&&(r.lineWidth=u.line.lineWidth,r.strokeStyle=n),u.area.enabled&&(r.fillStyle=u._getStyle(u.area.fillStyle,f,l.color,l),r.fillAlpha=u._getStyle(u.area.fillAlpha,f,1,l));var o=new Polygon({hoverClone:!1,context:r});if(i.area=o,u.sprite.addChild(o),o.__hoverFillAlpha=o.context.fillAlpha+.2,o.__fillAlpha=o.context.fillAlpha,o.on(index_es.event.types.get(),function(e){"mouseover"==e.type&&(this.context.fillAlpha=this.__hoverFillAlpha),"mouseout"==e.type&&(this.context.fillAlpha=this.__fillAlpha),u.app.fire(e.type,e);}),u.node.enabled){var s=[];index_es._.each(e,function(e,t){a.push([e.point.x,e.point.y]);var i=new Circle({context:{cursor:"pointer",x:e.point.x,y:e.point.y,r:u.node.radius,lineWidth:u.node.lineWidth,strokeStyle:u.node.strokeStyle,fillStyle:n}});u.sprite.addChild(i),i.iNode=t,i.nodeData=e,i._strokeStyle=n,i.on(index_es.event.types.get(),function(e){e.aAxisInd=this.iNode,e.eventInfo={trigger:u.node,nodes:[this.nodeData]},u.app.fire(e.type,e);}),s.push(i);}),i.nodes=s;}u.groups[t]=i,f++;});}},{key:"tipsPointerOf",value:function(e){var a=this;a.tipsPointerHideOf(e),e.eventInfo&&e.eventInfo.nodes&&index_es._.each(e.eventInfo.nodes,function(i){a.data[i.field]&&index_es._.each(a.data[i.field],function(e,t){i.iNode==t&&a.focusOf(e);});});}},{key:"tipsPointerHideOf",value:function(){var i=this;index_es._.each(i.data,function(e,t){index_es._.each(e,function(e){i.unfocusOf(e);});});}},{key:"focusOf",value:function(e){if(!e.focused){var t=this.groups[e.field].nodes[e.iNode];t.context.r+=1,t.context.fillStyle=this.node.strokeStyle,t.context.strokeStyle=t._strokeStyle,e.focused=!0;}}},{key:"unfocusOf",value:function(e){if(e.focused){var t=this.groups[e.field].nodes[e.iNode];--t.context.r,t.context.fillStyle=t._strokeStyle,t.context.strokeStyle=this.node.strokeStyle,e.focused=!1;}}},{key:"hide",value:function(e){var t=this.app.getComponent({name:"coord"});this.enabledField=t.filterEnabledFields(this.field);var i=this.groups[e];i&&(i.area.context.visible=!1,index_es._.each(i.nodes,function(e){e.context.visible=!1;}));}},{key:"show",value:function(e){var t=this.app.getComponent({name:"coord"});this.enabledField=t.filterEnabledFields(this.field);var i=this.groups[e];i&&(i.area.context.visible=!0,index_es._.each(i.nodes,function(e){e.context.visible=!0;}));}},{key:"_trimGraphs",value:function(){var s=this,u=this.app.getComponent({name:"coord"});this.enabledField=u.filterEnabledFields(this.field);var e={};return index_es._.each(this.enabledField,function(l){var n=s.dataFrame.getFieldData(l),r=u.getFieldMapOf(l),o=[];index_es._.each(u.aAxis.angleList,function(e,t){var i=Math.PI*e/180,a=u.getPointInRadianOfR(i,u.getROfNum(n[t]));o.push({type:"radar",field:l,iNode:t,rowData:s.dataFrame.getRowDataAt(t),focused:!1,value:n[t],point:a,color:r.color});}),e[l]=o;}),e}},{key:"_getStyle",value:function(e,t,i,a){var l=i;return (index_es._.isString(e)||index_es._.isNumber(e))&&(l=e),index_es._.isArray(e)&&(l=e[t]),index_es._.isFunction(e)&&(l=e(t,a)),null==l&&(l=i),l}},{key:"getNodesAt",value:function(a){var l=this.data,n=[];return index_es._.each(this.enabledField,function(e,t){if(index_es._.isArray(e))index_es._.each(e,function(e,t){var i=l[e][a];i&&n.push(i);});else{var i=l[e][a];i&&n.push(i);}}),n}}]),a}(_index.default);index_es.global.registerComponent(RadarGraphs,"graphs","radar");var _default=RadarGraphs;exports.default=_default;
});

unwrapExports(radar);

var dispatch_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var noop={value:function(){}};function dispatch(){for(var e,t=0,n=arguments.length,r={};t<n;++t){if(!(e=arguments[t]+"")||e in r)throw new Error("illegal type: "+e);r[e]=[];}return new Dispatch(r)}function Dispatch(e){this._=e;}function parseTypenames(e,r){return e.trim().split(/^|\s+/).map(function(e){var t="",n=e.indexOf(".");if(0<=n&&(t=e.slice(n+1),e=e.slice(0,n)),e&&!r.hasOwnProperty(e))throw new Error("unknown type: "+e);return {type:e,name:t}})}function get(e,t){for(var n,r=0,o=e.length;r<o;++r)if((n=e[r]).name===t)return n.value}function set(e,t,n){for(var r=0,o=e.length;r<o;++r)if(e[r].name===t){e[r]=noop,e=e.slice(0,r).concat(e.slice(r+1));break}return null!=n&&e.push({name:t,value:n}),e}Dispatch.prototype=dispatch.prototype={constructor:Dispatch,on:function(e,t){var n,r=this._,o=parseTypenames(e+"",r),i=-1,a=o.length;if(!(arguments.length<2)){if(null!=t&&"function"!=typeof t)throw new Error("invalid callback: "+t);for(;++i<a;)if(n=(e=o[i]).type)r[n]=set(r[n],e.name,t);else if(null==t)for(n in r)r[n]=set(r[n],e.name,null);return this}for(;++i<a;)if((n=(e=o[i]).type)&&(n=get(r[n],e.name)))return n},copy:function(){var e={},t=this._;for(var n in t)e[n]=t[n].slice();return new Dispatch(e)},call:function(e,t){if(0<(n=arguments.length-2))for(var n,r,o=new Array(n),i=0;i<n;++i)o[i]=arguments[i+2];if(!this._.hasOwnProperty(e))throw new Error("unknown type: "+e);for(i=0,n=(r=this._[e]).length;i<n;++i)r[i].value.apply(t,o);},apply:function(e,t,n){if(!this._.hasOwnProperty(e))throw new Error("unknown type: "+e);for(var r=this._[e],o=0,i=r.length;o<i;++o)r[o].value.apply(t,n);}};var _default=dispatch;exports.default=_default;
});

unwrapExports(dispatch_1);

var cloud_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _dispatch=interopRequireDefault(dispatch_1),cloudRadians=Math.PI/180,cw=64,ch=2048,cloud=function(){var S=[256,256],c=cloudText,f=cloudFont,d=cloudFontSize,s=cloudFontNormal,h=cloudFontNormal,x=cloudRotate,y=cloudPadding,R=archimedeanSpiral,r=[],v=1/0,g=(0, _dispatch.default)("word","end"),p=null,z=Math.random,m={},w=cloudCanvas;function M(t,r,e){S[0],S[1];for(var n,a,o,u=r.x,i=r.y,l=Math.sqrt(S[0]*S[0]+S[1]*S[1]),c=R(S),f=z()<.5?1:-1,d=-f;(n=c(d+=f))&&(a=~~n[0],o=~~n[1],!(Math.min(Math.abs(a),Math.abs(o))>=l));)if(r.x=u+a,r.y=i+o,!(r.x+r.x0<0||r.y+r.y0<0||r.x+r.x1>S[0]||r.y+r.y1>S[1])&&(!e||!cloudCollide(r,t,S[0]))&&(!e||collideRects(r,e))){for(var s,h=r.sprite,x=r.width>>5,y=S[0]>>5,v=r.x-(x<<4),g=127&v,p=32-g,m=r.y1-r.y0,w=(r.y+r.y0)*y+(v>>5),M=0;M<m;M++){for(var b=s=0;b<=x;b++)t[w+b]|=s<<p|(b<x?(s=h[M*x+b])>>>g:0);w+=y;}return delete r.sprite,!0}return !1}return m.canvas=function(t){return arguments.length?(w=functor(t),m):w},m.start=function(){var e=function(t){t.width=t.height=1;var r=Math.sqrt(t.getContext("2d").getImageData(0,0,1,1).data.length>>2);t.width=(cw<<5)/r,t.height=ch/r;var e=t.getContext("2d");return e.fillStyle=e.strokeStyle="red",e.textAlign="center",{context:e,ratio:r}}(w()),n=zeroArray((S[0]>>5)*S[1]),a=null,o=r.length,u=-1,i=[],l=r.map(function(t,r){return t.text=c.call(this,t,r),t.font=f.call(this,t,r),t.style=s.call(this,t,r),t.weight=h.call(this,t,r),t.rotate=x.call(this,t,r),t.size=~~d.call(this,t,r),t.padding=y.call(this,t,r),t}).sort(function(t,r){return r.size-t.size});return p&&clearInterval(p),p=setInterval(t,0),t(),m;function t(){for(var t=Date.now();Date.now()-t<v&&++u<o&&p;){var r=l[u];r.x=S[0]*(z()+.5)>>1,r.y=S[1]*(z()+.5)>>1,cloudSprite(e,r,l,u),r.hasText&&M(n,r,a)&&(i.push(r),g.call("word",m,r),a?cloudBounds(a,r):a=[{x:r.x+r.x0,y:r.y+r.y0},{x:r.x+r.x1,y:r.y+r.y1}],r.x-=S[0]>>1,r.y-=S[1]>>1);}o<=u&&(m.stop(),g.call("end",m,i,a));}},m.stop=function(){return p&&(clearInterval(p),p=null),m},m.timeInterval=function(t){return arguments.length?(v=null==t?1/0:t,m):v},m.words=function(t){return arguments.length?(r=t,m):r},m.size=function(t){return arguments.length?(S=[+t[0],+t[1]],m):S},m.font=function(t){return arguments.length?(f=functor(t),m):f},m.fontStyle=function(t){return arguments.length?(s=functor(t),m):s},m.fontWeight=function(t){return arguments.length?(h=functor(t),m):h},m.rotate=function(t){return arguments.length?(x=functor(t),m):x},m.text=function(t){return arguments.length?(c=functor(t),m):c},m.spiral=function(t){return arguments.length?(R=spirals[t]||t,m):R},m.fontSize=function(t){return arguments.length?(d=functor(t),m):d},m.padding=function(t){return arguments.length?(y=functor(t),m):y},m.random=function(t){return arguments.length?(z=t,m):z},m.on=function(){var t=g.on.apply(g,arguments);return t===g?m:t},m};function cloudText(t){return t.text}function cloudFont(){return "serif"}function cloudFontNormal(){return "normal"}function cloudFontSize(t){return Math.sqrt(t.value)}function cloudRotate(){return 30*(~~(6*Math.random())-3)}function cloudPadding(){return 1}function cloudSprite(t,r,e,n){if(!r.sprite){var a=t.context,o=t.ratio;a.clearRect(0,0,(cw<<5)/o,ch/o);var u=0,i=0,l=0,c=e.length;for(--n;++n<c;){r=e[n],a.save(),a.font=r.style+" "+r.weight+" "+~~((r.size+1)/o)+"px "+r.font;var f=a.measureText(r.text+"m").width*o,d=r.size<<1;if(r.rotate){var s=Math.sin(r.rotate*cloudRadians),h=Math.cos(r.rotate*cloudRadians),x=f*h,y=f*s,v=d*h,g=d*s;f=Math.max(Math.abs(x+g),Math.abs(x-g))+31>>5<<5,d=~~Math.max(Math.abs(y+v),Math.abs(y-v));}else f=f+31>>5<<5;if(l<d&&(l=d),cw<<5<=u+f&&(i+=l,l=u=0),ch<=i+d)break;a.translate((u+(f>>1))/o,(i+(d>>1))/o),r.rotate&&a.rotate(r.rotate*cloudRadians),a.fillText(r.text,0,0),r.padding&&(a.lineWidth=2*r.padding,a.strokeText(r.text,0,0)),a.restore(),r.width=f,r.height=d,r.xoff=u,r.yoff=i,r.x1=f>>1,r.y1=d>>1,r.x0=-r.x1,r.y0=-r.y1,r.hasText=!0,u+=f;}for(var p=a.getImageData(0,0,(cw<<5)/o,ch/o).data,m=[];0<=--n;)if((r=e[n]).hasText){for(var w=(f=r.width)>>5,M=(d=r.y1-r.y0,0);M<d*w;M++)m[M]=0;if(null==(u=r.xoff))return;i=r.yoff;for(var b=0,S=-1,R=0;R<d;R++){for(M=0;M<f;M++){var z=w*R+(M>>5),q=p[(i+R)*(cw<<5)+(u+M)<<2]?1<<31-M%32:0;m[z]|=q,b|=q;}b?S=R:(r.y0++,d--,R--,i++);}r.y1=r.y0+S,r.sprite=m.slice(0,(r.y1-r.y0)*w);}}}function cloudCollide(t,r,e){e>>=5;for(var n,a=t.sprite,o=t.width>>5,u=t.x-(o<<4),i=127&u,l=32-i,c=t.y1-t.y0,f=(t.y+t.y0)*e+(u>>5),d=0;d<c;d++){for(var s=n=0;s<=o;s++)if((n<<l|(s<o?(n=a[d*o+s])>>>i:0))&r[f+s])return !0;f+=e;}return !1}function cloudBounds(t,r){var e=t[0],n=t[1];r.x+r.x0<e.x&&(e.x=r.x+r.x0),r.y+r.y0<e.y&&(e.y=r.y+r.y0),r.x+r.x1>n.x&&(n.x=r.x+r.x1),r.y+r.y1>n.y&&(n.y=r.y+r.y1);}function collideRects(t,r){return t.x+t.x1>r[0].x&&t.x+t.x0<r[1].x&&t.y+t.y1>r[0].y&&t.y+t.y0<r[1].y}function archimedeanSpiral(t){var r=t[0]/t[1];return function(t){return [r*(t*=.1)*Math.cos(t),t*Math.sin(t)]}}function rectangularSpiral(t){var e=4*t[0]/t[1],n=0,a=0;return function(t){var r=t<0?-1:1;switch(Math.sqrt(1+4*r*t)-r&3){case 0:n+=e;break;case 1:a+=4;break;case 2:n-=e;break;default:a-=4;}return [n,a]}}function zeroArray(t){for(var r=[],e=-1;++e<t;)r[e]=0;return r}function cloudCanvas(){return document.createElement("canvas")}function functor(t){return "function"==typeof t?t:function(){return t}}var spirals={archimedean:archimedeanSpiral,rectangular:rectangularSpiral},_default=cloud;exports.default=_default;
});

unwrapExports(cloud_1);

var cloud = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_assertThisInitialized2=interopRequireDefault(assertThisInitialized$1),_createClass2=interopRequireDefault(createClass$1),_inherits2=interopRequireDefault(inherits$1),_canvax=interopRequireDefault(Canvax),_index=interopRequireDefault(graphs),_cloud=interopRequireDefault(cloud_1),Text=_canvax.default.Display.Text,CloudGraphs=function(e){function o(e,t){var i;(0, _classCallCheck2.default)(this,o),(i=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(o).call(this,e,t))).type="cloud";var n=(0, _assertThisInitialized2.default)(i);return i.node={_maxFontSizeVal:0,_minFontSizeVal:null},index_es._.extend(!0,(0, _assertThisInitialized2.default)(i),(0, index_es.getDefaultProps)(o.defaultProps()),e),i.node.fontColor=function(e){return n.app.getTheme(e.iNode)},i.init(),i}return (0, _inherits2.default)(o,e),(0, _createClass2.default)(o,null,[{key:"defaultProps",value:function(){return {field:{detail:"字段配置",default:null},node:{detail:"节点文字配置",propertys:{fontFamily:{detail:"字体设置",default:"Impact"},fontColor:{detail:"文字颜色",default:"#999"},fontSize:{detail:"文本字体大小",default:function(){return this.minFontSize+Math.random()*this.maxFontSize}},maxFontSize:{detail:"文本最大字体大小",default:30},minFontSize:{detail:"文本最小字体大小",default:16},fontWeight:{detail:"fontWeight",default:"normal"},format:{detail:"文本格式化处理函数",default:null},padding:{detail:"文本间距",default:10},rotation:{detail:"文本旋转角度",default:function(){return 30*(~~(6*Math.random())-3)}},strokeStyle:{detail:"文本描边颜色",default:null},select:{detail:"文本选中效果",propertys:{enabled:{detail:"是否开启选中",default:!0},lineWidth:{detail:"选中后的文本描边宽",default:2},strokeStyle:{detail:"选中后的文本描边色",default:"#666"}}},focus:{detail:"文本hover效果",propertys:{enabled:{detail:"是否开启hover效果",default:!0}}}}}}}}]),(0, _createClass2.default)(o,[{key:"init",value:function(){}},{key:"draw",value:function(e){e=e||{},index_es._.extend(!0,this,e),this._drawGraphs(),this.sprite.context.x=this.width/2,this.sprite.context.y=this.height/2,this.fire("complete");}},{key:"getDaraFrameIndOfVal",value:function(e){var t=this,i=this.dataFrame,n=index_es._.find(i.data,function(e){return e.field==t.field});return index_es._.indexOf(n.data,e)}},{key:"_getFontSize",value:function(e,t){var i=this.node.minFontSize;if(index_es._.isFunction(this.node.fontSize)&&(i=this.node.fontSize(e)),index_es._.isString(this.node.fontSize)&&this.node.fontSize in e){t=Number(e[this.node.fontSize]);isNaN(t)||(i=this.node.minFontSize+(this.node.maxFontSize-this.node.minFontSize)/(this.node._maxFontSizeVal-this.node._minFontSizeVal)*(t-this.node._minFontSizeVal));}return index_es._.isNumber(this.node.fontSize)&&(i=this.node.fontSize),i}},{key:"_getRotate",value:function(e,t){var i=this.node.rotation;return index_es._.isFunction(this.node.rotation)&&(i=this.node.rotation(e,t)||0),i}},{key:"_getFontColor",value:function(e){var t;return index_es._.isString(this.node.fontColor)&&(t=this.node.fontColor),index_es._.isFunction(this.node.fontColor)&&(t=this.node.fontColor(e)),null==t&&(t="#ccc"),t}},{key:"_drawGraphs",value:function(){var a=this;index_es._.isString(this.node.fontSize)&&index_es._.each(a.dataFrame.getFieldData(this.node.fontSize),function(e){a.node._maxFontSizeVal=Math.max(a.node._maxFontSizeVal,e),a.node._minFontSizeVal=Math.min(a.node._minFontSizeVal,e);}),(0, _cloud.default)().size([a.width,a.height]).words(a.dataFrame.getFieldData(a.field).map(function(e,t){var i=a.app.dataFrame.getRowDataAt(a.getDaraFrameIndOfVal(e)),n={type:"cloud",rowData:i,field:a.field,value:e,text:null,size:a._getFontSize(i,e),iNode:t,color:null};n.fontColor=a._getFontColor(n);var o=e;return a.node.format&&(o=a.node.format(e,n)),n.text=o||e,n})).padding(a.node.padding).rotate(function(e,t){return a._getRotate(e,t)}).font(a.node.fontFamily).fontSize(function(e){return e.size}).on("end",function(n,e){a.data=n,a.sprite.removeAllChildren(),index_es._.each(n,function(e,t){e.iNode=t,e.dataLen=n.length,e.focused=!1,e.selected=!1;var i=new Text(e.text,{context:{x:e.x,y:e.y,fontSize:e.size,fontFamily:e.font,rotation:e.rotate,textBaseline:"middle",textAlign:"center",cursor:"pointer",fontWeight:a.node.fontWeight,fillStyle:e.fontColor}});a.sprite.addChild(i),a.node.focus.enabled&&i.hover(function(e){a.focusAt(this.nodeData.iNode);},function(e){this.nodeData.selected||a.unfocusAt(this.nodeData.iNode);}),((i.nodeData=e)._node=i).on(index_es.event.types.get(),function(e){e.eventInfo={trigger:a.node,title:null,nodes:[this.nodeData]},this.nodeData.text&&(e.eventInfo.title=this.nodeData.text),a.app.fire(e.type,e);});});}).start();}},{key:"focusAt",value:function(e){var t=this.data[e];this.node.focus.enabled&&!t.focused&&(t._node.context.fontSize+=3,t.focused=!0);}},{key:"unfocusAt",value:function(e){var t=this.data[e];this.node.focus.enabled&&t.focused&&(t._node.context.fontSize-=3,t.focused=!1);}},{key:"selectAt",value:function(e){var t=this.data[e];if(this.node.select.enabled&&!t.selected){var i=t._node.context;i.lineWidth=this.node.select.lineWidth,i.strokeAlpha=this.node.select.strokeAlpha,i.strokeStyle=this.node.select.strokeStyle,t.selected=!0;}}},{key:"unselectAt",value:function(e){var t=this.data[e];this.node.select.enabled&&t.selected&&(t._node.context.strokeStyle=this.node.strokeStyle,t.selected=!1);}}]),o}(_index.default);index_es.global.registerComponent(CloudGraphs,"graphs","cloud");var _default2=CloudGraphs;exports.default=_default2;
});

unwrapExports(cloud);

var group$1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_createClass2=interopRequireDefault(createClass$1),_canvax=interopRequireDefault(Canvax),Circle=_canvax.default.Shapes.Circle,PlanetGroup=function(){function a(t,e,i){(0, _classCallCheck2.default)(this,a),this._opt=t,this.dataFrame=e,this._graphs=i,this.app=i.app,this.field=null,this.iGroup=0,this.groupLen=1,this.rRange={start:0,to:0},this.width=0,this.height=0,this.selectInds=[],this.layoutType="radian",this.pit={radius:30},this.planets=[],this.maxRingNum=0,this.ringNum=0,index_es._.extend(!0,this,(0, index_es.getDefaultProps)(a.defaultProps()),t),this.node.maxRadius>this.pit.radius&&(this.pit.radius=this.node.maxRadius),this.init();}return (0, _createClass2.default)(a,null,[{key:"defaultProps",value:function(){return {sort:{detail:"排序",default:"desc"},sortField:{detail:"用来排序的字段",default:"null"},node:{detail:"单个数据节点图形配置",propertys:{maxRadius:{detail:"最大半径",default:30},minRadius:{detail:"最小半径",default:5},radius:{detail:"半径",default:15,documentation:'也可以是个function,也可以配置{field:"pv"}来设置字段， 自动计算r'},lineWidth:{detail:"描边线宽",default:1},strokeStyle:{detail:"描边颜色",default:"#ffffff"},fillStyle:{detail:"图形填充色",default:"#f2fbfb"},strokeAlpha:{detail:"边框透明度",default:.6},focus:{detail:"hover态设置",propertys:{enabled:{detail:"是否开启",default:!0},strokeAlpha:{detail:"hover时候边框透明度",default:.7},lineWidth:{detail:"hover时候边框大小",default:2},strokeStyle:{detail:"hover时候边框颜色",default:"#fff"}}},select:{detail:"选中态设置",propertys:{enabled:{detail:"是否开启",default:!1},strokeAlpha:{detail:"选中时候边框透明度",default:1},lineWidth:{detail:"选中时候边框大小",default:2},strokeStyle:{detail:"选中时候边框颜色",default:"#fff"},triggerEventType:{detail:"触发事件",default:"click"}}}}},label:{detail:"文本设置",propertys:{enabled:{detail:"是否开启",default:!0},fontColor:{detail:"文本颜色",default:"#666666"},fontSize:{detail:"文本字体大小",default:13},textAlign:{detail:"水平对齐方式",default:"center"},verticalAlign:{detail:"基线对齐方式",default:"middle"},position:{detail:"文本布局位置",default:"center"},offsetX:{detail:"x方向偏移量",default:0},offsetY:{detail:"y方向偏移量",default:0}}}}}}]),(0, _createClass2.default)(a,[{key:"init",value:function(){var t=this.app.getComponent({name:"coord"});this.sprite=new _canvax.default.Display.Sprite({id:"group_"+this.iGroup,context:{x:t.origin.x,y:t.origin.y}}),this._trimGraphs(),this.draw();}},{key:"_trimGraphs",value:function(){var a=this,t=this.app.getComponent({name:"coord"}).getMaxDisToViewOfOrigin();(t-this.rRange.to)/(2*this.pit.radius)<this.groupLen-1-this.iGroup&&(this.rRange.to=t-(this.groupLen-1-this.iGroup)*this.pit.radius*2),this.rRange.to-this.rRange.start<2*this.pit.radius&&(this.rRange.to=this.rRange.start+2*this.pit.radius),this.maxRingNum||(this.maxRingNum=parseInt((this.rRange.to-this.rRange.start)/(2*this.pit.radius),10),this.ringNum=this.maxRingNum),this.rRange.to=this.rRange.start+this.ringNum*this.pit.radius*2;for(var e=[],i=this.dataFrame.length,n=0;n<i;n++){var l=this.dataFrame.getRowDataAt(n),s={type:"planet",groupLen:this.groupLen,iGroup:a.iGroup,iNode:n,nodeElement:null,labelElement:null,rowData:l,iRing:null,iPlanet:null,fillStyle:null,color:null,strokeStyle:null,pit:null,ringInd:-1,field:a.field,label:l[a.field],focused:!1,selected:!!~index_es._.indexOf(this.selectInds,l.__index__)};e.push(s);}a.sortField&&(e=e.sort(function(t,e){var i=a.sortField;return "desc"==a.sort?e.rowData[i]-t.rowData[i]:t.rowData[i]-e.rowData[i]}),index_es._.each(e,function(t,e){t.iNode=e;})),this._rings=this["_setRings_"+this.layoutType+"Range"](e),this.planets=e;}},{key:"_setRings_radianRange",value:function(i){for(var o=this,a=[],t=this.app.getComponent({name:"coord"}),e=0,n=this.ringNum;e<n;e++){var l=e*this.pit.radius*2+this.pit.radius+this.rRange.start;o._graphs.center.enabled||(l=e*this.pit.radius*2+this.rRange.start);var s=t.getRadiansAtR(l,o.width,o.height);Math.atan(this.pit.radius/l);a.push({arcs:s,pits:[],planets:[],radius:l,max:0});}var d=0;index_es._.each(a,function(l,t){var s=2*Math.asin(o.pit.radius/l.radius);0==l.radius&&(s=2*Math.PI);var r=0;index_es._.each(l.arcs,function(t){var e=o._getDiffRadian(t[0].radian,t[1].radian);if(s<=e){var i=parseInt(e/s,10);r+=i;for(var a=0;a<i;a++){var n={hasRadish:!1,start:(t[0].radian+s*a+2*Math.PI)%(2*Math.PI)};n.middle=(n.start+s/2+2*Math.PI)%(2*Math.PI),n.to=(n.start+s+2*Math.PI)%(2*Math.PI),l.pits.push(n);}}}),l.max=r,d+=r,l.pits=index_es._.shuffle(l.pits);});var r=0;return index_es._.each(a,function(n,t){if(r>=i.length)return !1;var e=Math.ceil(n.max/d*i.length);e=Math.min(n.max,e),n.planets=i.slice(r,r+e),t==a.length-1&&(n.planets=i.slice(r)),r+=e,index_es._.each(n.planets,function(t,e){if(!(e>=n.pits.length)){var i=index_es._.filter(n.pits,function(t){return !t.hasRadish}),a=i[parseInt(Math.random()*i.length)];a.hasRadish=!0,t.pit=a;}});}),a}},{key:"_getDiffRadian",value:function(t,e){var i=e-t;return e<t&&(i=(e+2*Math.PI-t)%(2*Math.PI)),i}},{key:"_setRings_indexRange",value:function(){}},{key:"_setRings_valRange",value:function(){}},{key:"draw",value:function(){var M=this,D=this.app.getComponent({name:"coord"});index_es._.each(this._rings,function(b,k){var P={rotation:0};1==b.arcs.length&&0==b.arcs[0][0].radian&&b.arcs[0][1].radian==2*Math.PI&&(P.rotation=parseInt(360*Math.random()));var A=new _canvax.default.Display.Sprite({context:P});index_es._.each(b.planets,function(t,e){if(t.pit){var i=D.getPointInRadianOfR(t.pit.middle,b.radius),a=M._getRProp(M.node.radius,k,e,t),n=M.node.maxRadius-a,l=parseInt(Math.random()*n),s=parseInt(360*Math.random())*Math.PI/180;0!=l&&(i.x+=Math.sin(s)*l,i.y+=Math.cos(s)*l);var r=M.node;t.selected&&(r=M.node.select);var o=M._getProp(M.node.fillStyle,t),d=M._getProp(r.strokeStyle,t),h=M._getProp(r.strokeAlpha,t),u=M._getProp(r.lineWidth,t),p={x:i.x,y:i.y,r:a,fillStyle:o,lineWidth:u,strokeStyle:d,strokeAlpha:h,cursor:"pointer"};t.color=t.fillStyle=o,t.strokeStyle=d,t.iRing=k,t.iPlanet=e;var f=new Circle({hoverClone:!1,context:p});if(f.on(index_es.event.types.get(),function(t){t.eventInfo={title:null,trigger:M.node,nodes:[this.nodeData]},this.nodeData.label&&(t.eventInfo.title=this.nodeData.label),M.node.focus.enabled&&("mouseover"==t.type&&M.focusAt(this.nodeData),"mouseout"==t.type&&M.unfocusAt(this.nodeData)),M.node.select.enabled&&t.type==M.node.select.triggerEventType&&(this.nodeData.selected?M.unselectAt(this.nodeData):M.selectAt(this.nodeData)),M.app.fire(t.type,t);}),((f.nodeData=t).nodeElement=f).ringInd=k,f.planetIndInRing=e,A.addChild(f),M._graphs.animation){var c=f.context.r,m=f.context.globalAlpha;f.context.r=1,f.context.globalAlpha=.1,f.animate({r:c,globalAlpha:m},{delay:Math.round(1500*Math.random()),onComplete:function(){f.labelElement&&(f.labelElement.context.visible=!0);var t=f.clone();A.addChildAt(t,0),t.animate({r:c+10,globalAlpha:0},{onComplete:function(){t.destroy();}});}});}var _={x:i.x,y:i.y,fontSize:M.label.fontSize,textAlign:M.label.textAlign,textBaseline:M.label.verticalAlign,fillStyle:M.label.fontColor,rotation:-P.rotation,rotateOrigin:{x:0,y:0}},g=new _canvax.default.Display.Text(t.label,{context:_}),v=g.getTextWidth(),x=g.getTextHeight();if(2*a<v&&(_.fontSize=M.label.fontSize-3),index_es._.isFunction(M.label.position)){var y=M.label.position({node:f,circleR:a,circleCenter:{x:i.x,y:i.y},textWidth:v,textHeight:x});_.rotation=-P.rotation,_.rotateOrigin={x:-(y.x-_.x),y:-(y.y-_.y)},_.x=y.x,_.y=y.y;}"auto"==M.label.position&&2*a<v&&R(),"bottom"==M.label.position&&R(),_.x+=M.label.offsetX,_.y+=M.label.offsetY,g=new _canvax.default.Display.Text(t.label,{context:_}),((f.labelElement=g).nodeData=t).labelElement=g,M._graphs.animation&&(g.context.visible=!1),A.addChild(g);}function R(){_.y=i.y+a+3,_.rotation=-P.rotation,_.rotateOrigin={x:0,y:-(a+.7*x)};}}),M.sprite.addChild(A);});}},{key:"_getRProp",value:function(e,t,i,a){var n=this;if(index_es._.isString(e)&&-1<index_es._.indexOf(n.dataFrame.fields,e)){null==this.__rValMax&&null==this.__rValMax&&(this.__rValMax=0,this.__rValMin=0,index_es._.each(n.planets,function(t){n.__rValMax=Math.max(n.__rValMax,t.rowData[e]),n.__rValMin=Math.min(n.__rValMin,t.rowData[e]);}));var l=a.rowData[e];return n.node.minRadius+(l-this.__rValMin)/(this.__rValMax-this.__rValMin)*(n.node.maxRadius-n.node.minRadius)}return n._getProp(e,a)}},{key:"_getProp",value:function(t,e){var i=this.iGroup;return index_es._.isFunction(t)?t.apply(this,[e,i]):t}},{key:"getPlanetAt",value:function(e){var i=e;return index_es._.isNumber(e)&&index_es._.each(this.planets,function(t){if(t.rowData.__index__==e)return i=t,!1}),i}},{key:"selectAt",value:function(t){if(this.node.select.enabled){var e=this.getPlanetAt(t);e.selected=!0,e.nodeElement&&(e.nodeElement.context.lineWidth=this._getProp(this.node.select.lineWidth,e),e.nodeElement.context.strokeStyle=this._getProp(this.node.select.strokeStyle,e),e.nodeElement.context.strokeAlpha=this._getProp(this.node.select.strokeAlpha,e));for(var i=0;i<this.selectInds.length;i++)if(t===this.selectInds[i]){this.selectInds.splice(i--,1);break}}}},{key:"unselectAt",value:function(t){if(this.node.select.enabled){var e=this.getPlanetAt(t);e.selected=!1,e.nodeElement&&(e.nodeElement.context.lineWidth=this._getProp(this.node.lineWidth,e),e.nodeElement.context.strokeAlpha=this._getProp(this.node.strokeAlpha,e)),this.selectInds.push(t);}}},{key:"getSelectedNodes",value:function(){return index_es._.filter(this.planets,function(t){return t.selected})}},{key:"focusAt",value:function(t){if(this.node.focus.enabled){var e=this.getPlanetAt(t);e.selected||(e.focused=!0,e.nodeElement&&(e.nodeElement.context.lineWidth=this._getProp(this.node.focus.lineWidth,e),e.nodeElement.context.strokeStyle=this._getProp(this.node.focus.strokeStyle,e),e.nodeElement.context.strokeAlpha=this._getProp(this.node.focus.strokeAlpha,e)));}}},{key:"unfocusAt",value:function(t){if(this.node.focus.enabled){var e=this.getPlanetAt(t);e.selected||(e.focused=!1,e.nodeElement&&(e.nodeElement.context.lineWidth=this._getProp(this.node.lineWidth,e),e.nodeElement.context.strokeAlpha=this._getProp(this.node.strokeAlpha,e)));}}}]),a}();exports.default=PlanetGroup;
});

unwrapExports(group$1);

var planet = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_assertThisInitialized2=interopRequireDefault(assertThisInitialized$1),_createClass2=interopRequireDefault(createClass$1),_inherits2=interopRequireDefault(inherits$1),_canvax=interopRequireDefault(Canvax),_index=interopRequireDefault(graphs),_group=interopRequireDefault(group$1),Text=_canvax.default.Display.Text,Circle=_canvax.default.Shapes.Circle,Line=_canvax.default.Shapes.Line,Rect=_canvax.default.Shapes.Rect,Sector=_canvax.default.Shapes.Sector,PlanetGraphs=function(e){function n(e,t){var i;return (0, _classCallCheck2.default)(this,n),(i=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(n).call(this,e,t))).type="planet",i.groupDataFrames=[],i.groupField=null,i._ringGroups=[],i.grid={rings:{_section:[]}},index_es._.extend(!0,(0, _assertThisInitialized2.default)(i),(0, index_es.getDefaultProps)(n.defaultProps()),e),0!=i.center.radius&&i.center.enabled||(i.center.radius=0,i.center.margin=0,i.center.enabled=!1),i.__scanIngCurOration=0,i.init(),i}return (0, _inherits2.default)(n,e),(0, _createClass2.default)(n,null,[{key:"defaultProps",value:function(){return {field:{detail:"字段设置",default:null},center:{detail:"中心点设置",propertys:{enabled:{detail:"是否显示中心",default:!0},text:{detail:"中心区域文本",default:"center"},radius:{detail:"中心圆半径",default:30},fillStyle:{detail:"中心背景色",default:"#70629e"},fontSize:{detail:"中心字体大小",default:15},fontColor:{detail:"中心字体颜色",default:"#ffffff"},margin:{detail:"中区区域和外围可绘图区域距离",default:20},cursor:{detail:"中心节点的鼠标手势",default:"default"}}},selectInds:{detail:"选中的数据索引",default:[]},grid:{detail:"星系图自己的grid",propertys:{rings:{detail:"环配置",propertys:{fillStyle:{detail:"背景色",default:null},strokeStyle:{detail:"环线色",default:null},lineWidth:{detail:"环线宽",default:1},count:{detail:"分几环",default:3}}},rays:{detail:"射线配置",propertys:{count:{detail:"射线数量",default:0},globalAlpha:{detail:"线透明度",default:.4},strokeStyle:{detail:"线色",default:"#10519D"},lineWidth:{detail:"线宽",default:1}}}}},bewrite:{detail:"planet的趋势描述",propertys:{enabled:{detail:"是否开启趋势描述",default:!1},text:{detail:"描述文本",default:null},fontColor:{detail:"fontColor",default:"#999"},fontSize:{detail:"fontSize",default:12}}},scan:{detail:"扫描效果",propertys:{enabled:{detail:"是否开启扫描效果",default:!1},fillStyle:{detail:"扫描效果颜色",default:null},alpha:{detail:"起始透明度",default:.6},angle:{detail:"扫描效果的覆盖角度",default:90},r:{detail:"扫描效果覆盖的半径",default:null},repeat:{detail:"扫描次数",default:3}}},_props:[_group.default]}}}]),(0, _createClass2.default)(n,[{key:"init",value:function(){this.gridSp=new _canvax.default.Display.Sprite({id:"gridSp"}),this.groupSp=new _canvax.default.Display.Sprite({id:"groupSp"}),this.scanSp=new _canvax.default.Display.Sprite({id:"scanSp"}),this.centerSp=new _canvax.default.Display.Sprite({id:"centerSp"}),this.sprite.addChild(this.gridSp),this.sprite.addChild(this.groupSp),this.sprite.addChild(this.scanSp),this.sprite.addChild(this.centerSp);}},{key:"draw",value:function(e){e=e||{},index_es._.extend(!0,this,e),this._dataGroupHandle(),this._drawGroups(),this._drawBack(),this._drawBewrite(),this._drawCenter(),this._drawScan(),this.fire("complete");}},{key:"_getMaxR",value:function(){var e;try{e=this.graphs.group.circle.maxRadius;}catch(e){}return null==e&&(e=30),e}},{key:"_drawGroups",value:function(){var a=this,r=this.center.radius+this.center.margin,l=a.app.getComponent({name:"coord"}).getMaxDisToViewOfOrigin()-a.center.radius-a.center.margin,s=this._getMaxR();index_es._.each(this.groupDataFrames,function(e,t){var i=r+l*(e.length/a.dataFrame.length),n=new _group.default(index_es._.extend(!0,{iGroup:t,groupLen:a.groupDataFrames.length,rRange:{start:r,to:i},width:a.width-2*s,height:a.height-2*s,selectInds:a.selectInds},a._opt),e,a);r=n.rRange.to,a._ringGroups.push(n),a.grid.rings._section.push({radius:n.rRange.to});}),index_es._.each(a._ringGroups,function(e){a.sprite.addChild(e.sprite);});}},{key:"_drawCenter",value:function(){var t=this;this.center.enabled&&(this._center=new Circle({hoverClone:!1,context:{x:this.origin.x,y:this.origin.y,fillStyle:this.center.fillStyle,r:this.center.radius,cursor:this.center.cursor}}),this._centerTxt=new Text(this.center.text,{context:{x:this.origin.x,y:this.origin.y,fontSize:this.center.fontSize,textAlign:"center",textBaseline:"middle",fillStyle:this.center.fontColor}}),this._center.on(index_es.event.types.get(),function(e){e.eventInfo={title:t.center.text,trigger:t.center,nodes:[t.center]},t.center.onclick&&("mousedown"==e.type&&(t._center.context.r+=2),"mouseup"==e.type&&(t._center.context.r-=2)),t.app.fire(e.type,e);}),this.centerSp.addChild(this._center),this.centerSp.addChild(this._centerTxt));}},{key:"_drawBack",value:function(){var e=this,t=this.app.getComponent({name:"coord"});if(1==e.grid.rings._section.length){var i=(e.grid.rings._section[0].radius-e.center.radius)/e.grid.rings.count;e.grid.rings._section=[];for(var n=0;n<e.grid.rings.count;n++)e.grid.rings._section.push({radius:e.center.radius+i*(n+1)});}else e.grid.rings.count=e.grid.rings._section.length;for(n=e.grid.rings._section.length-1;0<=n;n--){var a=e.grid.rings._section[n];e.gridSp.addChild(new Circle({context:{x:t.origin.x,y:t.origin.y,r:a.radius,lineWidth:e._getBackProp(e.grid.rings.lineWidth,n),strokeStyle:e._getBackProp(e.grid.rings.strokeStyle,n),fillStyle:e._getBackProp(e.grid.rings.fillStyle,n)}}));}if(1<e.grid.rays.count){var r=t.origin.x,l=t.origin.y,s=360/e.grid.rays.count,o=t.getMaxDisToViewOfOrigin();e.grid.rings._section.length&&(o=e.grid.rings._section.slice(-1)[0].radius);n=0;for(var d=e.grid.rays.count;n<d;n++){var c=s*n/180*Math.PI,u=r+o*Math.cos(c),p=l+o*Math.sin(c);e.gridSp.addChild(new Line({context:{start:{x:r,y:l},end:{x:u,y:p},lineWidth:e._getBackProp(e.grid.rays.lineWidth,n),strokeStyle:e._getBackProp(e.grid.rays.strokeStyle,n),globalAlpha:e.grid.rays.globalAlpha}}));}}var h=new Rect({name:"clipRect",context:{x:t.origin.x-e.app.width/2,y:t.origin.y-e.height/2,width:e.app.width,height:e.height}});e.gridSp.clipTo(h),e.sprite.addChild(h);}},{key:"_getBackProp",value:function(e,t){var i=null;return index_es._.isFunction(e)&&(i=e.apply(this,[{scaleInd:t,count:this.grid.rings._section.length,groups:this._ringGroups,graphs:this}])),(index_es._.isString(e)||index_es._.isNumber(e))&&(i=e),index_es._.isArray(e)&&(i=e[t]),i}},{key:"_drawBewrite",value:function(){var a=this;if(a.bewrite.enabled){var e,r,t,i,n=function(e,t,i,n){i.context.x=e*a.center.radius+20*e,l.addChild(i),l.addChild(new Line({context:{lineType:"dashed",start:{x:i.context.x,y:0},end:{x:e*(t?s/2-r/2:s),y:0},lineWidth:1,strokeStyle:"#ccc"}})),t&&(t.context.x=e*(s/2),l.addChild(t),l.addChild(new Line({context:{lineType:"dashed",start:{x:e*(s/2+r/2),y:0},end:{x:e*s,y:0},lineWidth:1,strokeStyle:"#ccc"}}))),n.context.x=e*s,l.addChild(n);};a.bewrite.text&&(e=new _canvax.default.Display.Text(a.bewrite.text,{context:{fillStyle:a.bewrite.fontColor,fontSize:a.bewrite.fontSize,textBaseline:"middle",textAlign:"center"}}),r=e.getTextWidth()),t=new _canvax.default.Display.Text("强",{context:{fillStyle:a.bewrite.fontColor,fontSize:a.bewrite.fontSize,textBaseline:"middle",textAlign:"center"}}),i=new _canvax.default.Display.Text("弱",{context:{fillStyle:a.bewrite.fontColor,fontSize:a.bewrite.fontSize,textBaseline:"middle",textAlign:"center"}});var l=new _canvax.default.Display.Sprite({context:{x:this.origin.x,y:this.origin.y}});a.sprite.addChild(l);var s=a.width/2;n(1,e.clone(),t.clone(),i.clone()),n(-1,e.clone(),t.clone(),i.clone());}}},{key:"scan",value:function(){var t=this;this._scanAnim&&this._scanAnim.stop();var e=t._getScanSp();360==t.__scanIngCurOration&&(e.context.rotation=0),t._scanAnim=e.animate({rotation:360,globalAlpha:1},{duration:(360-t.__scanIngCurOration)/360*1e3,onUpdate:function(e){t.__scanIngCurOration=e.rotation;},onComplete:function(){e.context.rotation=0,t._scanAnim=e.animate({rotation:360},{duration:1e3,repeat:1e3,onUpdate:function(e){t.__scanIngCurOration=e.rotation;}});}});}},{key:"_drawScan",value:function(e){var t=this;if(t.scan.enabled){var i=t._getScanSp();360==t.__scanIngCurOration&&(i.context.rotation=0),t._scanAnim&&t._scanAnim.stop(),t._scanAnim=i.animate({rotation:360,globalAlpha:1},{duration:(360-t.__scanIngCurOration)/360*1e3,onUpdate:function(e){t.__scanIngCurOration=e.rotation;},onComplete:function(){i.context.rotation=0,t._scanAnim=i.animate({rotation:360},{duration:1e3,repeat:t.scan.repeat-2,onUpdate:function(e){t.__scanIngCurOration=e.rotation;},onComplete:function(){i.context.rotation=0,t._scanAnim=i.animate({rotation:360,globalAlpha:0},{duration:1e3,onUpdate:function(e){t.__scanIngCurOration=e.rotation;},onComplete:function(){i.destroy(),t.__scanSp=null,delete t.__scanSp,t.__scanIngCurOration=0,e&&e();}});}});}});}}},{key:"_getScanSp",value:function(){var e=this,t=e.__scanSp;if(!t){t=new _canvax.default.Display.Sprite({context:{x:this.origin.x,y:this.origin.y,globalAlpha:0,rotation:e.__scanIngCurOration}}),e.scanSp.addChild(t),e.__scanSp=t;for(var i=e.scan.r||e.height/2-10,n=e.scan.fillStyle||e.center.fillStyle,a=e.scan.angle,r=0,l=a;r<l;r++){var s=new Sector({context:{r:i,fillStyle:n,clockwise:!0,startAngle:360-r,endAngle:359-r,globalAlpha:e.scan.alpha-e.scan.alpha/a*r}});t.addChild(s);}var o=new Line({context:{end:{x:i,y:0},lineWidth:1,strokeStyle:n}});t.addChild(o);}return t}},{key:"_dataGroupHandle",value:function(){var i=index_es._.indexOf(this.dataFrame.fields,this.groupField);if(0<=i){var n=this.dataFrame.org[0],a={};for(var e in index_es._.each(this.dataFrame.org,function(e,t){t&&(a[e[i]]||(a[e[i]]=[index_es._.clone(n)]),a[e[i]].push(e));}),a)this.groupDataFrames.push((0, index_es.dataFrame)(a[e]));}else this.groupDataFrames.push(this.dataFrame);}},{key:"show",value:function(e,t){this.getAgreeNodeData(t,function(e){e.nodeElement&&(e.nodeElement.context.visible=!0),e.labelElement&&(e.labelElement.context.visible=!0);});}},{key:"hide",value:function(e,t){this.getAgreeNodeData(t,function(e){e.nodeElement&&(e.nodeElement.context.visible=!1),e.labelElement&&(e.labelElement.context.visible=!1);});}},{key:"getAgreeNodeData",value:function(n,a){index_es._.each(this._ringGroups,function(e){index_es._.each(e._rings,function(e,t){index_es._.each(e.planets,function(e,t){var i=e.rowData;n.params.name==i[n.params.field]&&a&&a(e);});});});}},{key:"getLayoutNodes",value:function(){var t=[];return index_es._.each(this._ringGroups,function(e){index_es._.each(e.planets,function(e){e.pit&&t.push(e);});}),t}},{key:"getInvalidNodes",value:function(){var t=[];return index_es._.each(this._ringGroups,function(e){index_es._.each(e.planets,function(e){e.pit||t.push(e);});}),t}},{key:"selectAt",value:function(t){index_es._.each(this._ringGroups,function(e){e.selectAt(t);});}},{key:"selectAll",value:function(){var t=this;index_es._.each(t.dataFrame.getFieldData("__index__"),function(e){t.selectAt(e);});}},{key:"unselectAt",value:function(t){index_es._.each(this._ringGroups,function(e){e.unselectAt(t);});}},{key:"unselectAll",value:function(){var t=this;index_es._.each(t.dataFrame.getFieldData("__index__"),function(e){t.unselectAt(e);});}},{key:"getSelectedNodes",value:function(){var t=[];return index_es._.each(this._ringGroups,function(e){t=t.concat(e.getSelectedNodes());}),t}},{key:"getSelectedRowList",value:function(){var i=[];return index_es._.each(this._ringGroups,function(e){var t=[];index_es._.each(e.getSelectedNodes(),function(e){t.push(e.rowData);}),i=i.concat(t);}),i}},{key:"getNodesAt",value:function(){}},{key:"resetData",value:function(e){this.clean(),this.dataFrame=e,this._dataGroupHandle(),this._drawGroups(),this._drawScan();}},{key:"clean",value:function(){this.groupDataFrames=[],index_es._.each(this._ringGroups,function(e){e.sprite.destroy();}),this._ringGroups=[];}}]),n}(_index.default);index_es.global.registerComponent(PlanetGraphs,"graphs","planet");var _default=PlanetGraphs;exports.default=_default;
});

unwrapExports(planet);

var funnel = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_assertThisInitialized2=interopRequireDefault(assertThisInitialized$1),_createClass2=interopRequireDefault(createClass$1),_inherits2=interopRequireDefault(inherits$1),_canvax=interopRequireDefault(Canvax),_index=interopRequireDefault(graphs),Text=_canvax.default.Display.Text,Polygon=_canvax.default.Shapes.Polygon,FunnelGraphs=function(e){function a(e,t){var i;return (0, _classCallCheck2.default)(this,a),(i=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(a).call(this,e,t))).type="funnel",i.dataOrg=[],i.data=[],i._maxVal=null,i._minVal=null,index_es._.extend(!0,(0, _assertThisInitialized2.default)(i),(0, index_es.getDefaultProps)(a.defaultProps()),e),i.init(),i}return (0, _inherits2.default)(a,e),(0, _createClass2.default)(a,null,[{key:"defaultProps",value:function(){return {field:{detail:"字段配置",default:null},sort:{detail:"排序规则",default:null},maxNodeWidth:{detail:"最大的元素宽",default:null},minNodeWidth:{detail:"最小的元素宽",default:0},minVal:{detail:"漏斗的塔尖",default:0},node:{detail:"单个元素图形配置",propertys:{height:{detail:"高",default:0,documentation:"漏斗单元高，如果options没有设定， 就会被自动计算为 this.height/dataOrg.length"}}},label:{detail:"文本配置",propertys:{enabled:{detail:"是否开启文本",default:!0},textAlign:{detail:"文本布局位置(left,center,right)",default:"center"},textBaseline:{detail:"文本基线对齐方式",default:"middle"},format:{detail:"文本格式化处理函数",default:function(e){return (0, tools.numAddSymbol)(e)}},fontSize:{detail:"文本字体大小",default:13},fontColor:{detail:"文本颜色",default:"#ffffff",documentation:"align为center的时候的颜色，align为其他属性时候取node的颜色"}}}}}}]),(0, _createClass2.default)(a,[{key:"init",value:function(){}},{key:"_computerAttr",value:function(){this.field&&(this.dataOrg=this.dataFrame.getFieldData(this.field)),this._maxVal=index_es._.max(this.dataOrg),this._minVal=index_es._.min(this.dataOrg),this.maxNodeWidth||(this.maxNodeWidth=.7*this.width),this.node.height||(this.node.height=this.height/this.dataOrg.length);}},{key:"draw",value:function(e){e=e||{},index_es._.extend(!0,this,e);this.animation&&e.resize;this._computerAttr(),this.data=this._trimGraphs(),this._drawGraphs(),this.sprite.context.x=this.origin.x+this.width/2,this.sprite.context.y=this.origin.y;}},{key:"_trimGraphs",value:function(){if(this.field){var a=this,l=[];return index_es._.each(this.dataOrg,function(e,t){var i={type:"funnel",field:a.field,rowData:a.dataFrame.getRowDataAt(t),value:e,width:a._getNodeWidth(e),color:a.app.getTheme(t),cursor:"pointer",label:"",middlePoint:null,iNode:-1,points:[]};l.push(i);}),this.sort&&(l=l.sort(function(e,t){return "desc"==a.sort?t.value-e.value:e.value-t.value})),index_es._.each(l,function(e,t){e.iNode=t,e.label=a.label.format(e.value,e);}),index_es._.each(l,function(e,t){e.points=a._getPoints(e,l[t+1],l[t-1]),e.middlePoint={x:0,y:(e.iNode+.5)*a.node.height};}),l}}},{key:"_getNodeWidth",value:function(e){var t=this.minNodeWidth+(this.maxNodeWidth-this.minNodeWidth)/(this._maxVal-this.minVal)*(e-this.minVal);return parseInt(t)}},{key:"_getPoints",value:function(e,t,i){var a=[],l=e.iNode*this.node.height,n=l+this.node.height;if("asc"!==this.sort){a.push([-e.width/2,l]),a.push([e.width/2,l]);var r=this.minNodeWidth;t&&(r=t.width),a.push([r/2,n]),a.push([-r/2,n]);}else{var s=this.minNodeWidth;i&&(s=i.width),a.push([-s/2,l]),a.push([s/2,l]),a.push([e.width/2,n]),a.push([-e.width/2,n]);}return a}},{key:"_drawGraphs",value:function(){var n=this;index_es._.each(this.data,function(e){var t=new Polygon({context:{pointList:e.points,fillStyle:e.color,cursor:e.cursor}});n.sprite.addChild(t),t.nodeData=e,t.on(index_es.event.types.get(),function(e){e.eventInfo={trigger:n.node,title:n.field,nodes:[this.nodeData]},n.app.fire(e.type,e);});var i="center",a={x:e.middlePoint.x,y:e.middlePoint.y};"left"==n.label.textAlign&&(a.x=e.points[0][0]-(e.points[0][0]-e.points[3][0])/2,a.x-=15,i="right"),"right"==n.label.textAlign&&(a.x=e.points[1][0]-(e.points[1][0]-e.points[2][0])/2,a.x+=15,i="left");var l=new Text(e.label,{context:{x:a.x,y:a.y,fontSize:n.label.fontSize,fillStyle:"center"==n.label.textAlign?n.label.fontColor:e.color,textAlign:i,textBaseline:n.label.textBaseline}});n.sprite.addChild(l);});}}]),a}(_index.default);index_es.global.registerComponent(FunnelGraphs,"graphs","funnel");var _default2=FunnelGraphs;exports.default=_default2;
});

unwrapExports(funnel);

var fmin = createCommonjsModule(function (module, exports) {
(function (global, factory) {
     factory(exports) ;
}(commonjsGlobal, function (exports) {
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

    function gradientDescent(f, initial, params) {
        params = params || {};
        var maxIterations = params.maxIterations || initial.length * 100,
            learnRate = params.learnRate || 0.001,
            current = {x: initial.slice(), fx: 0, fxprime: initial.slice()};

        for (var i = 0; i < maxIterations; ++i) {
            current.fx = f(current.x, current.fxprime);
            if (params.history) {
                params.history.push({x: current.x.slice(),
                                     fx: current.fx,
                                     fxprime: current.fxprime.slice()});
            }

            weightedSum(current.x, 1, current.x, -learnRate, current.fxprime);
            if (norm2(current.fxprime) <= 1e-5) {
                break;
            }
        }

        return current;
    }

    function gradientDescentLineSearch(f, initial, params) {
        params = params || {};
        var current = {x: initial.slice(), fx: 0, fxprime: initial.slice()},
            next = {x: initial.slice(), fx: 0, fxprime: initial.slice()},
            maxIterations = params.maxIterations || initial.length * 100,
            learnRate = params.learnRate || 1,
            pk = initial.slice(),
            c1 = params.c1 || 1e-3,
            c2 = params.c2 || 0.1,
            temp,
            functionCalls = [];

        if (params.history) {
            // wrap the function call to track linesearch samples
            var inner = f;
            f = function(x, fxprime) {
                functionCalls.push(x.slice());
                return inner(x, fxprime);
            };
        }

        current.fx = f(current.x, current.fxprime);
        for (var i = 0; i < maxIterations; ++i) {
            scale(pk, current.fxprime, -1);
            learnRate = wolfeLineSearch(f, pk, current, next, learnRate, c1, c2);

            if (params.history) {
                params.history.push({x: current.x.slice(),
                                     fx: current.fx,
                                     fxprime: current.fxprime.slice(),
                                     functionCalls: functionCalls,
                                     learnRate: learnRate,
                                     alpha: learnRate});
                functionCalls = [];
            }


            temp = current;
            current = next;
            next = temp;

            if ((learnRate === 0) || (norm2(current.fxprime) < 1e-5)) break;
        }

        return current;
    }

    exports.bisect = bisect;
    exports.nelderMead = nelderMead;
    exports.conjugateGradient = conjugateGradient;
    exports.gradientDescent = gradientDescent;
    exports.gradientDescentLineSearch = gradientDescentLineSearch;
    exports.zeros = zeros;
    exports.zerosM = zerosM;
    exports.norm2 = norm2;
    exports.weightedSum = weightedSum;
    exports.scale = scale;

}));
});

var circleintersection = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.intersectionArea=intersectionArea,exports.containedInCircles=containedInCircles,exports.circleArea=circleArea,exports.distance=distance,exports.circleOverlap=circleOverlap,exports.circleCircleIntersection=circleCircleIntersection,exports.getCenter=getCenter;var SMALL=1e-10;function intersectionArea(e,r){var t,n=getIntersectionPoints(e),a=n.filter(function(r){return containedInCircles(r,e)}),i=0,c=0,s=[];if(1<a.length){var l=getCenter(a);for(t=0;t<a.length;++t){var o=a[t];o.angle=Math.atan2(o.x-l.x,o.y-l.y);}a.sort(function(r,e){return e.angle-r.angle});var u=a[a.length-1];for(t=0;t<a.length;++t){var x=a[t];c+=(u.x+x.x)*(x.y-u.y);for(var d={x:(x.x+u.x)/2,y:(x.y+u.y)/2},h=null,y=0;y<x.parentIndex.length;++y)if(-1<u.parentIndex.indexOf(x.parentIndex[y])){var f=e[x.parentIndex[y]],p=Math.atan2(x.x-f.x,x.y-f.y),g=Math.atan2(u.x-f.x,u.y-f.y),v=g-p;v<0&&(v+=2*Math.PI);var M=g-v/2,I=distance(d,{x:f.x+f.radius*Math.sin(M),y:f.y+f.radius*Math.cos(M)});I>2*f.radius&&(I=2*f.radius),(null===h||h.width>I)&&(h={circle:f,width:I,p1:x,p2:u});}null!==h&&(s.push(h),i+=circleArea(h.circle.radius,h.width),u=x);}}else{var A=e[0];for(t=1;t<e.length;++t)e[t].radius<A.radius&&(A=e[t]);var C=!1;for(t=0;t<e.length;++t)if(distance(e[t],A)>Math.abs(A.radius-e[t].radius)){C=!0;break}C?i=c=0:(i=A.radius*A.radius*Math.PI,s.push({circle:A,p1:{x:A.x,y:A.y+A.radius},p2:{x:A.x-SMALL,y:A.y+A.radius},width:2*A.radius}));}return c/=2,r&&(r.area=i+c,r.arcArea=i,r.polygonArea=c,r.arcs=s,r.innerPoints=a,r.intersectionPoints=n),i+c}function containedInCircles(r,e){for(var t=0;t<e.length;++t)if(distance(r,e[t])>e[t].radius+SMALL)return !1;return !0}function getIntersectionPoints(r){for(var e=[],t=0;t<r.length;++t)for(var n=t+1;n<r.length;++n)for(var a=circleCircleIntersection(r[t],r[n]),i=0;i<a.length;++i){var c=a[i];c.parentIndex=[t,n],e.push(c);}return e}function circleArea(r,e){return r*r*Math.acos(1-e/r)-(r-e)*Math.sqrt(e*(2*r-e))}function distance(r,e){return Math.sqrt((r.x-e.x)*(r.x-e.x)+(r.y-e.y)*(r.y-e.y))}function circleOverlap(r,e,t){if(r+e<=t)return 0;if(t<=Math.abs(r-e))return Math.PI*Math.min(r,e)*Math.min(r,e);var n=e-(t*t-r*r+e*e)/(2*t);return circleArea(r,r-(t*t-e*e+r*r)/(2*t))+circleArea(e,n)}function circleCircleIntersection(r,e){var t=distance(r,e),n=r.radius,a=e.radius;if(n+a<=t||t<=Math.abs(n-a))return [];var i=(n*n-a*a+t*t)/(2*t),c=Math.sqrt(n*n-i*i),s=r.x+i*(e.x-r.x)/t,l=r.y+i*(e.y-r.y)/t,o=-(e.y-r.y)*(c/t),u=-(e.x-r.x)*(c/t);return [{x:s+o,y:l-u},{x:s-o,y:l+u}]}function getCenter(r){for(var e={x:0,y:0},t=0;t<r.length;++t)e.x+=r[t].x,e.y+=r[t].y;return e.x/=r.length,e.y/=r.length,e}
});

unwrapExports(circleintersection);
var circleintersection_1 = circleintersection.intersectionArea;
var circleintersection_2 = circleintersection.containedInCircles;
var circleintersection_3 = circleintersection.circleArea;
var circleintersection_4 = circleintersection.distance;
var circleintersection_5 = circleintersection.circleOverlap;
var circleintersection_6 = circleintersection.circleCircleIntersection;
var circleintersection_7 = circleintersection.getCenter;

var layout = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.venn=venn,exports.distanceFromIntersectArea=distanceFromIntersectArea,exports.getDistanceMatrices=getDistanceMatrices,exports.bestInitialLayout=bestInitialLayout,exports.constrainedMDSLayout=constrainedMDSLayout,exports.greedyLayout=greedyLayout,exports.lossFunction=lossFunction,exports.disjointCluster=disjointCluster,exports.normalizeSolution=normalizeSolution,exports.scaleSolution=scaleSolution;function venn(i,n){(n=n||{}).maxIterations=n.maxIterations||500;var e,t=n.initialLayout||bestInitialLayout,a=n.lossFunction||lossFunction,s=t(i=addMissingAreas(i),n),r=[],o=[];for(e in s)s.hasOwnProperty(e)&&(r.push(s[e].x),r.push(s[e].y),o.push(e));for(var u=(0, fmin.nelderMead)(function(n){for(var e={},t=0;t<o.length;++t){var r=o[t];e[r]={x:n[2*t],y:n[2*t+1],radius:s[r].radius};}return a(e,i)},r,n).x,c=0;c<o.length;++c)e=o[c],s[e].x=u[2*c],s[e].y=u[2*c+1];return s}var SMALL=1e-10;function distanceFromIntersectArea(e,t,r){return Math.min(e,t)*Math.min(e,t)*Math.PI<=r+SMALL?Math.abs(e-t):(0, fmin.bisect)(function(n){return (0, circleintersection.circleOverlap)(e,t,n)-r},0,e+t)}function addMissingAreas(n){n=n.slice();var e,t,r,i,a=[],s={};for(e=0;e<n.length;++e){var o=n[e];1==o.sets.length?a.push(o.sets[0]):2==o.sets.length&&(s[[r=o.sets[0],i=o.sets[1]]]=!0,s[[i,r]]=!0);}for(a.sort(function(n,e){return e<n}),e=0;e<a.length;++e)for(r=a[e],t=e+1;t<a.length;++t)[r,i=a[t]]in s||n.push({sets:[r,i],size:0});return n}function getDistanceMatrices(n,a,s){var o=(0, fmin.zerosM)(a.length,a.length),u=(0, fmin.zerosM)(a.length,a.length);return n.filter(function(n){return 2==n.sets.length}).map(function(n){var e=s[n.sets[0]],t=s[n.sets[1]],r=distanceFromIntersectArea(Math.sqrt(a[e].size/Math.PI),Math.sqrt(a[t].size/Math.PI),n.size);o[e][t]=o[t][e]=r;var i=0;n.size+1e-10>=Math.min(a[e].size,a[t].size)?i=1:n.size<=1e-10&&(i=-1),u[e][t]=u[t][e]=i;}),{distances:o,constraints:u}}function constrainedMDSGradient(n,e,t,r){var i,a=0;for(i=0;i<e.length;++i)e[i]=0;for(i=0;i<t.length;++i)for(var s=n[2*i],o=n[2*i+1],u=i+1;u<t.length;++u){var c=n[2*u],l=n[2*u+1],h=t[i][u],g=r[i][u],f=(c-s)*(c-s)+(l-o)*(l-o),x=Math.sqrt(f),m=f-h*h;0<g&&x<=h||g<0&&h<=x||(a+=2*m*m,e[2*i]+=4*m*(s-c),e[2*i+1]+=4*m*(o-l),e[2*u]+=4*m*(c-s),e[2*u+1]+=4*m*(l-o));}return a}function bestInitialLayout(n,e){var t=greedyLayout(n,e),r=e.lossFunction||lossFunction;if(8<=n.length){var i=constrainedMDSLayout(n,e);r(i,n)+1e-8<r(t,n)&&(t=i);}return t}function constrainedMDSLayout(n,e){var t,r=(e=e||{}).restarts||10,i=[],a={};for(t=0;t<n.length;++t){var s=n[t];1==s.sets.length&&(a[s.sets[0]]=i.length,i.push(s));}var o=getDistanceMatrices(n,i,a),u=o.distances,c=o.constraints,l=(0, fmin.norm2)(u.map(fmin.norm2))/u.length;u=u.map(function(n){return n.map(function(n){return n/l})});function h(n,e){return constrainedMDSGradient(n,e,u,c)}var g,f;for(t=0;t<r;++t){var x=(0, fmin.zeros)(2*u.length).map(Math.random);f=(0, fmin.conjugateGradient)(h,x,e),(!g||f.fx<g.fx)&&(g=f);}var m=g.x,y={};for(t=0;t<i.length;++t){var d=i[t];y[d.sets[0]]={x:m[2*t]*l,y:m[2*t+1]*l,radius:Math.sqrt(d.size/Math.PI)};}if(e.history)for(t=0;t<e.history.length;++t)(0, fmin.scale)(e.history[t].x,l);return y}function greedyLayout(n,e){for(var t,r=e&&e.lossFunction?e.lossFunction:lossFunction,i={},a={},s=0;s<n.length;++s){var o=n[s];1==o.sets.length&&(t=o.sets[0],i[t]={x:1e10,y:1e10,rowid:i.length,size:o.size,radius:Math.sqrt(o.size/Math.PI)},a[t]=[]);}for(n=n.filter(function(n){return 2==n.sets.length}),s=0;s<n.length;++s){var u=n[s],c=u.hasOwnProperty("weight")?u.weight:1,l=u.sets[0],h=u.sets[1];u.size+SMALL>=Math.min(i[l].size,i[h].size)&&(c=0),a[l].push({set:h,size:u.size,weight:c}),a[h].push({set:l,size:u.size,weight:c});}var g=[];for(t in a)if(a.hasOwnProperty(t)){var f=0;for(s=0;s<a[t].length;++s)f+=a[t][s].size*a[t][s].weight;g.push({set:t,size:f});}function x(n,e){return e.size-n.size}g.sort(x);var m={};function y(n){return n.set in m}function d(n,e){i[e].x=n.x,i[e].y=n.y,m[e]=!0;}for(d({x:0,y:0},g[0].set),s=1;s<g.length;++s){var v=g[s].set,p=a[v].filter(y);if(t=i[v],p.sort(x),0===p.length)throw "ERROR: missing pairwise overlap information";for(var M=[],z=0;z<p.length;++z){var R=i[p[z].set],I=distanceFromIntersectArea(t.radius,R.radius,p[z].size);M.push({x:R.x+I,y:R.y}),M.push({x:R.x-I,y:R.y}),M.push({y:R.y+I,x:R.x}),M.push({y:R.y-I,x:R.x});for(var _=z+1;_<p.length;++_)for(var L=i[p[_].set],P=distanceFromIntersectArea(t.radius,L.radius,p[_].size),w=(0, circleintersection.circleCircleIntersection)({x:R.x,y:R.y,radius:I},{x:L.x,y:L.y,radius:P}),F=0;F<w.length;++F)M.push(w[F]);}var S=1e50,A=M[0];for(z=0;z<M.length;++z){i[v].x=M[z].x,i[v].y=M[z].y;var b=r(i,n);b<S&&(S=b,A=M[z]);}d(A,v);}return i}function lossFunction(e,n){var t=0;for(var r=0;r<n.length;++r){var i,a=n[r];if(1!=a.sets.length){if(2==a.sets.length){var s=e[a.sets[0]],o=e[a.sets[1]];i=(0, circleintersection.circleOverlap)(s.radius,o.radius,(0, circleintersection.distance)(s,o));}else i=(0, circleintersection.intersectionArea)(a.sets.map(function(n){return e[n]}));t+=(a.hasOwnProperty("weight")?a.weight:1)*(i-a.size)*(i-a.size);}}return t}function orientateCircles(n,e,t){var r;if(null===t?n.sort(function(n,e){return e.radius-n.radius}):n.sort(t),0<n.length){var i=n[0].x,a=n[0].y;for(r=0;r<n.length;++r)n[r].x-=i,n[r].y-=a;}2==n.length&&(0, circleintersection.distance)(n[0],n[1])<Math.abs(n[1].radius-n[0].radius)&&(n[1].x=n[0].x+n[0].radius-n[1].radius-1e-10,n[1].y=n[0].y);if(1<n.length){var s,o,u=Math.atan2(n[1].x,n[1].y)-e,c=Math.cos(u),l=Math.sin(u);for(r=0;r<n.length;++r)s=n[r].x,o=n[r].y,n[r].x=c*s-l*o,n[r].y=l*s+c*o;}if(2<n.length){for(var h=Math.atan2(n[2].x,n[2].y)-e;h<0;)h+=2*Math.PI;for(;h>2*Math.PI;)h-=2*Math.PI;if(h>Math.PI){var g=n[1].y/(1e-10+n[1].x);for(r=0;r<n.length;++r){var f=(n[r].x+g*n[r].y)/(1+g*g);n[r].x=2*f-n[r].x,n[r].y=2*f*g-n[r].y;}}}}function disjointCluster(n){function e(n){return n.parent!==n&&(n.parent=e(n.parent)),n.parent}n.map(function(n){n.parent=n;});for(var t=0;t<n.length;++t)for(var r=t+1;r<n.length;++r){var i=n[t].radius+n[r].radius;(0, circleintersection.distance)(n[t],n[r])+1e-10<i&&(a=n[r],s=n[t],o=void 0,o=e(a),u=e(s),o.parent=u);}var a,s,o,u,c,l={};for(t=0;t<n.length;++t)(c=e(n[t]).parent.setid)in l||(l[c]=[]),l[c].push(n[t]);n.map(function(n){delete n.parent;});var h=[];for(c in l)l.hasOwnProperty(c)&&h.push(l[c]);return h}function getBoundingBox(n){function e(e){return {max:Math.max.apply(null,n.map(function(n){return n[e]+n.radius})),min:Math.min.apply(null,n.map(function(n){return n[e]-n.radius}))}}return {xRange:e("x"),yRange:e("y")}}function normalizeSolution(n,e,t){null===e&&(e=Math.PI/2);var r,i,u=[];for(i in n)if(n.hasOwnProperty(i)){var a=n[i];u.push({x:a.x,y:a.y,radius:a.radius,setid:i});}var s=disjointCluster(u);for(r=0;r<s.length;++r){orientateCircles(s[r],e,t);var o=getBoundingBox(s[r]);s[r].size=(o.xRange.max-o.xRange.min)*(o.yRange.max-o.yRange.min),s[r].bounds=o;}s.sort(function(n,e){return e.size-n.size});var c=(u=s[0]).bounds,l=(c.xRange.max-c.xRange.min)/50;function h(n,e,t){if(n){var r,i,a,s=n.bounds;e?r=c.xRange.max-s.xRange.min+l:(r=c.xRange.max-s.xRange.max,(a=(s.xRange.max-s.xRange.min)/2-(c.xRange.max-c.xRange.min)/2)<0&&(r+=a)),t?i=c.yRange.max-s.yRange.min+l:(i=c.yRange.max-s.yRange.max,(a=(s.yRange.max-s.yRange.min)/2-(c.yRange.max-c.yRange.min)/2)<0&&(i+=a));for(var o=0;o<n.length;++o)n[o].x+=r,n[o].y+=i,u.push(n[o]);}}for(var g=1;g<s.length;)h(s[g],!0,!1),h(s[g+1],!1,!0),h(s[g+2],!0,!0),g+=3,c=getBoundingBox(u);var f={};for(r=0;r<u.length;++r)f[u[r].setid]=u[r];return f}function scaleSolution(n,e,t,r){var i=[],a=[];for(var s in n)n.hasOwnProperty(s)&&(a.push(s),i.push(n[s]));e-=2*r,t-=2*r;var o=getBoundingBox(i),u=o.xRange,c=o.yRange;if(u.max==u.min||c.max==c.min)return console.log("not scaling solution: zero size detected"),n;for(var l=e/(u.max-u.min),h=t/(c.max-c.min),g=Math.min(h,l),f=(e-(u.max-u.min)*g)/2,x=(t-(c.max-c.min)*g)/2,m={},y=0;y<i.length;++y){var d=i[y];m[a[y]]={radius:g*d.radius,x:r+f+(d.x-u.min)*g,y:r+x+(d.y-c.min)*g};}return m}
});

unwrapExports(layout);
var layout_1 = layout.venn;
var layout_2 = layout.distanceFromIntersectArea;
var layout_3 = layout.getDistanceMatrices;
var layout_4 = layout.bestInitialLayout;
var layout_5 = layout.constrainedMDSLayout;
var layout_6 = layout.greedyLayout;
var layout_7 = layout.lossFunction;
var layout_8 = layout.disjointCluster;
var layout_9 = layout.normalizeSolution;
var layout_10 = layout.scaleSolution;

var venn = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_assertThisInitialized2=interopRequireDefault(assertThisInitialized$1),_createClass2=interopRequireDefault(createClass$1),_inherits2=interopRequireDefault(inherits$1),_canvax=interopRequireDefault(Canvax),_index=interopRequireDefault(graphs),Text=_canvax.default.Display.Text,Path=_canvax.default.Shapes.Path,Circle=_canvax.default.Shapes.Circle,VennGraphs=function(e){function i(e,t){var n;return (0, _classCallCheck2.default)(this,i),(n=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(i).call(this,e,t))).type="venn",n.vennData=null,index_es._.extend(!0,(0, _assertThisInitialized2.default)(n),(0, index_es.getDefaultProps)(i.defaultProps()),e),n._dataCircleLen=0,n._dataLabelLen=0,n._dataPathLen=0,n.init(),n}return (0, _inherits2.default)(i,e),(0, _createClass2.default)(i,null,[{key:"defaultProps",value:function(){return {keyField:{detail:"key字段",default:"name"},valueField:{detail:"value字段",default:"value"},node:{detail:"单个节点配置",propertys:{strokeStyle:{detail:"边框颜色",default:null},lineWidth:{detail:"边框大小",default:2},strokeAlpha:{detail:"边框透明度",default:0},fillStyle:{detail:"背景色",default:null},fillAlpha:{detail:"背景透明度",default:.25},focus:{detail:"hover设置",propertys:{enabled:{detail:"是否开启",default:!0},strokeAlpha:{detail:"边框透明度",default:.3}}},select:{detail:"选中设置",propertys:{enabled:{detail:"是否开启",default:!0},lineWidth:{detail:"描边宽度",default:2},strokeStyle:{detail:"描边颜色",default:"#666666"}}}}},label:{detail:"文本设置",propertys:{field:{detail:"获取文本的字段",default:null},fontSize:{detail:"字体大小",default:14},fontColor:{detail:"文本颜色",default:null},fontWeight:{detail:"fontWeight",default:"normal"},showInter:{detail:"是否显示相交部分的文本",default:!0}}}}}}]),(0, _createClass2.default)(i,[{key:"init",value:function(){this.venn_circles=new _canvax.default.Display.Sprite({id:"venn_circles"}),this.sprite.addChild(this.venn_circles),this.venn_paths=new _canvax.default.Display.Sprite({id:"venn_paths"}),this.sprite.addChild(this.venn_paths),this.venn_labels=new _canvax.default.Display.Sprite({id:"venn_labels"}),this.sprite.addChild(this.venn_labels);}},{key:"draw",value:function(e){e=e||{},index_es._.extend(!0,this,e),this.data=this._trimGraphs(),this._widget(),this.sprite.context.x=this.app.padding.left,this.sprite.context.y=this.app.padding.top,this.fire("complete");}},{key:"resetData",value:function(e){this.dataFrame=e,this.data=this._trimGraphs(),this._widget();}},{key:"_trimGraphs",value:function(){var i=this,e=i._vennData(),t=layout.venn,n=layout.lossFunction,l=Math.PI/2,a={},r={};if(this._dataCircleLen=0,this._dataLabelLen=0,(this._dataPathLen=0)<e.length){var s=t(e,{lossFunction:n});s=(0, layout.normalizeSolution)(s,l,null),a=(0, layout.scaleSolution)(s,this.width,this.height,0),r=computeTextCentres(a,e);}var o=0,d=0;return index_es._.each(e,function(e,t){if(e.label&&(1<e.sets.length&&!i.label.showInter||(e.labelPosition=r[e.nodeId],i._dataLabelLen++)),1<e.sets.length){var n=intersectionAreaPath(e.sets.map(function(e){return a[e]}));e.shape={type:"path",path:n,pathInd:d++},i._dataPathLen++;}else 1==e.sets.length&&(e.shape=index_es._.extend({type:"circle",circleInd:o++},a[e.nodeId]),i._dataCircleLen++);}),e}},{key:"_vennData",value:function(){for(var e=[],t=this,n=0,i=this.dataFrame.length;n<i;n++){var l=t.dataFrame.getRowDataAt(n),a={type:"venn",iNode:n,nodeId:null,rowData:l,sets:null,size:null,value:null,fillStyle:null,strokeStyle:null,label:null,labelPosition:null};for(var r in l){var s=l[r];r==t.keyField?(index_es._.isArray(s)||(s=s.split(/[,|]/)),a.sets=s,a.nodeId=s.join()):r==t.valueField?(a.size=s,a.value=s):r==t.label.field&&(a.label=s);}e.push(a);}return e}},{key:"_getStyle",value:function(e,t,n,i){var l;return index_es._.isString(e)&&(l=e),index_es._.isFunction(e)&&(l=e(n)),l||null==t||(l=this.app.getTheme(t)),l||null==i||(l=i),l}},{key:"_widget",value:function(){var c=this;if(c.venn_circles.children.length>c._dataCircleLen)for(var e=c._dataCircleLen;e<c.venn_circles.children.length;e++)c.venn_circles.getChildAt(e--).destroy();if(c.venn_paths.children.length>c._dataPathLen)for(e=c._dataPathLen;e<c.venn_paths.children.length;e++)c.venn_paths.getChildAt(e--).destroy();if(c.venn_labels.children.length>c._dataLabelLen)for(e=c._dataLabelLen;e<c.venn_labels.children.length;e++)c.venn_labels.getChildAt(e--).destroy();var f=0,p=0,v=0;index_es._.each(this.data,function(e,t){var n,i=e.shape,l=!0;if(i){var a;if("circle"==i.type){var r=c._getStyle(c.node.fillStyle,i.circleInd,e),s=c._getStyle(c.node.strokeStyle,i.circleInd,e);e.fillStyle=r,e.strokeStyle=s,a={x:i.x,y:i.y,r:i.radius,fillStyle:r,fillAlpha:c.node.fillAlpha,lineWidth:c.node.lineWidth,strokeStyle:s,strokeAlpha:c.node.strokeAlpha},(n=c.venn_circles.getChildAt(f++))?(l=!1,n.animate(a)):(n=new Circle({pointChkPriority:!1,hoverClone:!1,context:a}),c.venn_circles.addChild(n));}"path"==e.shape.type&&(a={path:i.path,fillStyle:"#ffffff",fillAlpha:0,lineWidth:c.node.lineWidth,strokeStyle:"#ffffff",strokeAlpha:0},(n=c.venn_paths.getChildAt(p++))?(l=!1,n.context.path=i.path):(n=new Path({pointChkPriority:!1,context:a}),c.venn_paths.addChild(n))),(n.nodeData=e)._node=n,c.node.focus.enabled&&n.hover(function(e){c.focusAt(this.nodeData.iNode);},function(e){this.nodeData.selected||c.unfocusAt(this.nodeData.iNode);}),l&&n.on(index_es.event.types.get(),function(e){e.eventInfo={trigger:c.node,title:null,nodes:[this.nodeData]},c.app.fire(e.type,e);});}if(e.label&&c.label.enabled){var o=c._getStyle(c.label.fontColor,i.circleInd,e,"#999"),d=c.label.fontSize;if(1<e.sets.length&&(c.label.showInter?d-=2:d=0),d){var u={x:e.labelPosition.x,y:e.labelPosition.y,fontSize:d,textBaseline:"middle",textAlign:"center",fontWeight:c.label.fontWeight,fillStyle:o},h=c.venn_labels.getChildAt(v++);h?(h.resetText(e.label),h.animate(u)):(h=new Text(e.label,{context:u}),c.venn_labels.addChild(h));}}});}},{key:"focusAt",value:function(e){var t=this.data[e];if(this.node.focus.enabled&&!t.focused){var n=t._node.context;1<t.sets.length?n.strokeAlpha=1:n.strokeAlpha=this.node.focus.strokeAlpha,t.focused=!0;}}},{key:"unfocusAt",value:function(e){var t=this.data[e];this.node.focus.enabled&&t.focused&&(t._node.context.strokeAlpha=this.node.strokeAlpha,t.focused=!1);}},{key:"selectAt",value:function(e){var t=this.data[e];if(this.node.select.enabled&&!t.selected){var n=t._node.context;n.lineWidth=this.node.select.lineWidth,n.strokeAlpha=this.node.select.strokeAlpha,n.strokeStyle=this.node.select.strokeStyle,t.selected=!0;}}},{key:"unselectAt",value:function(e){var t=this.data[e];this.node.select.enabled&&t.selected&&(t._node.context.strokeStyle=this.node.strokeStyle,t.selected=!1);}}]),i}(_index.default);function getOverlappingCircles(e){var t={},n=[];for(var i in e)n.push(i),t[i]=[];for(var l=0;l<n.length;l++)for(var a=e[n[l]],r=l+1;r<n.length;++r){var s=e[n[r]],o=(0, circleintersection.distance)(a,s);o+s.radius<=a.radius+1e-10?t[n[r]].push(n[l]):o+a.radius<=s.radius+1e-10&&t[n[l]].push(n[r]);}return t}function computeTextCentres(e,t){for(var n={},i=getOverlappingCircles(e),l=0;l<t.length;++l){for(var a=t[l].sets,r={},s={},o=0;o<a.length;++o){r[a[o]]=!0;for(var d=i[a[o]],u=0;u<d.length;++u)s[d[u]]=!0;}var h=[],c=[];for(var f in e)f in r?h.push(e[f]):f in s||c.push(e[f]);var p=computeTextCentre(h,c);(n[a]=p).disjoint&&0<t[l].size&&console.log("WARNING: area "+a+" not represented on screen");}return n}function computeTextCentre(t,n){var e,i=[];for(e=0;e<t.length;++e){var l=t[e];i.push({x:l.x,y:l.y}),i.push({x:l.x+l.radius/2,y:l.y}),i.push({x:l.x-l.radius/2,y:l.y}),i.push({x:l.x,y:l.y+l.radius/2}),i.push({x:l.x,y:l.y-l.radius/2});}var a=i[0],r=circleMargin(i[0],t,n);for(e=1;e<i.length;++e){var s=circleMargin(i[e],t,n);r<=s&&(a=i[e],r=s);}var o=(0, fmin.nelderMead)(function(e){return -1*circleMargin({x:e[0],y:e[1]},t,n)},[a.x,a.y],{maxIterations:500,minErrorDelta:1e-10}).x,d={x:o[0],y:o[1]},u=!0;for(e=0;e<t.length;++e)if((0, circleintersection.distance)(d,t[e])>t[e].radius){u=!1;break}for(e=0;e<n.length;++e)if((0, circleintersection.distance)(d,n[e])<n[e].radius){u=!1;break}if(!u)if(1==t.length)d={x:t[0].x,y:t[0].y};else{var h={};(0, circleintersection.intersectionArea)(t,h),d=0===h.arcs.length?{x:0,y:-1e3,disjoint:!0}:1==h.arcs.length?{x:h.arcs[0].circle.x,y:h.arcs[0].circle.y}:n.length?computeTextCentre(t,[]):(0, circleintersection.getCenter)(h.arcs.map(function(e){return e.p1}));}return d}function circleMargin(e,t,n){var i,l,a=t[0].radius-(0, circleintersection.distance)(t[0],e);for(i=1;i<t.length;++i)(l=t[i].radius-(0, circleintersection.distance)(t[i],e))<=a&&(a=l);for(i=0;i<n.length;++i)(l=(0, circleintersection.distance)(n[i],e)-n[i].radius)<=a&&(a=l);return a}function circlePath(e,t,n){var i=[];return i.push("\nM",e,t),i.push("\nm",-n,0),i.push("\na",n,n,0,1,0,2*n,0),i.push("\na",n,n,0,1,0,2*-n,0),i.join(" ")}function intersectionAreaPath(e){var t={};(0, circleintersection.intersectionArea)(e,t);var n=t.arcs;if(0===n.length)return "M 0 0";if(1==n.length){var i=n[0].circle;return circlePath(i.x,i.y,i.radius)}for(var l=["\nM",n[0].p2.x,n[0].p2.y],a=0;a<n.length;++a){var r=n[a],s=r.circle.radius,o=r.width>s;l.push("\nA",s,s,0,o?1:0,1,r.p1.x,r.p1.y);}return l.join(" ")+" z"}index_es.global.registerComponent(VennGraphs,"graphs","venn");var _default=VennGraphs;exports.default=_default;
});

unwrapExports(venn);

var rebind = createCommonjsModule(function (module, exports) {
function _rebind(r,t,n){return function(){var e=n.apply(t,arguments);return e===t?r:e}}function _default(e,r){for(var t,n=1,u=arguments.length;++n<u;)e[t=arguments[n]]=_rebind(e,r,r[t]);return e}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=_default;
});

unwrapExports(rebind);

var arrays = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _default={merge:function(e){for(var r,t,o,f=e.length,l=-1,u=0;++l<f;)u+=e[l].length;for(t=new Array(u);0<=--f;)for(r=(o=e[f]).length;0<=--r;)t[--u]=o[r];return t}};exports.default=_default;
});

unwrapExports(arrays);

var hierarchy = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _rebind=interopRequireDefault(rebind),_arrays=interopRequireDefault(arrays),Hierarchy=function h(){var o=layout_hierarchySort,c=layout_hierarchyChildren,f=layout_hierarchyValue;function v(e){var r,u=[e],a=[];for(e.depth=0;null!=(r=u.pop());)if(a.push(r),(l=c.call(v,r,r.depth))&&(t=l.length)){for(var t,l,i;0<=--t;)u.push(i=l[t]),i.parent=r,i.depth=r.depth+1;if(f){var n=+f.call(v,r,r.depth);n&&!isNaN(n)&&(r._value=n);}f&&(r.value=0),r.children=l;}else f&&(r.value=+f.call(v,r,r.depth)||0),delete r.children;return h.layout_hierarchyVisitAfter(e,function(e){var r,u;o&&(r=e.children)&&r.sort(o),f&&(u=e.parent)&&(u.value+=e.value),e._value&&e._value>e.value&&(e.value=e._value),delete e._value;}),a}return v.sort=function(e){return arguments.length?(o=e,v):o},v.children=function(e){return arguments.length?(c=e,v):c},v.value=function(e){return arguments.length?(f=e,v):f},v.revalue=function(e){return f&&(h.layout_hierarchyVisitBefore(e,function(e){e.children&&(e.value=0);}),h.layout_hierarchyVisitAfter(e,function(e){var r;e.children||(e.value=+f.call(v,e,e.depth)||0),(r=e.parent)&&(r.value+=e.value),e._value&&e._value>e.value&&(e.value=e._value),delete e._value;})),e},v};function layout_hierarchyChildren(e){return e.children}function layout_hierarchyValue(e){return e.value}function layout_hierarchySort(e,r){return r.value-e.value}function layout_hierarchyLinks(e){return _arrays.default.merge(e.map(function(r){return (r.children||[]).map(function(e){return {source:r,target:e}})}))}Hierarchy.layout_hierarchyRebind=function(e,r){return (0, _rebind.default)(e,r,"sort","children","value"),(e.nodes=e).links=layout_hierarchyLinks,e},Hierarchy.layout_hierarchyVisitBefore=function(e,r){for(var u=[e];null!=(e=u.pop());)if(r(e),(t=e.children)&&(a=t.length))for(var a,t;0<=--a;)u.push(t[a]);},Hierarchy.layout_hierarchyVisitAfter=function(e,r){for(var u=[e],a=[];null!=(e=u.pop());)if(a.push(e),(l=e.children)&&(t=l.length))for(var t,l,i=-1;++i<t;)u.push(l[i]);for(;null!=(e=a.pop());)r(e);};var _default=Hierarchy;exports.default=_default;
});

unwrapExports(hierarchy);

var partition = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=_default;var _hierarchy=interopRequireDefault(hierarchy);function _default(){var a=(0, _hierarchy.default)(),u=[1,1];function r(e,r){var t=a.call(this,e,r);return function e(r,t,a,u){var i=r.children;if(r.x=t,r.y=r.depth*u,r.dx=a,r.dy=u,i&&(n=i.length)){var n,l,h,f=-1;for(a=r.value?a/r.value:0;++f<n;)e(l=i[f],t,h=l.value*a,u),t+=h;}}(t[0],0,u[0],u[1]/function e(r){var t=r.children,a=0;if(t&&(u=t.length))for(var u,i=-1;++i<u;)a=Math.max(a,e(t[i]));return 1+a}(t[0])),t}return r.size=function(e){return arguments.length?(u=e,r):u},_hierarchy.default.layout_hierarchyRebind(r,a)}
});

unwrapExports(partition);

var sunburst = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_assertThisInitialized2=interopRequireDefault(assertThisInitialized$1),_createClass2=interopRequireDefault(createClass$1),_inherits2=interopRequireDefault(inherits$1),_canvax=interopRequireDefault(Canvax),_index=interopRequireDefault(graphs),_partition=interopRequireDefault(partition),Sector=_canvax.default.Shapes.Sector,sunburstGraphs=function(e){function i(e,t){var a;return (0, _classCallCheck2.default)(this,i),(a=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(i).call(this,e,t))).type="sunburst",index_es._.extend(!0,(0, _assertThisInitialized2.default)(a),(0, index_es.getDefaultProps)(i.defaultProps()),e),a.data=[],a.dataGroup=[],a.init(),a}return (0, _inherits2.default)(i,e),(0, _createClass2.default)(i,null,[{key:"defaultProps",value:function(){return {keyField:{detail:"key字段",default:"name"},valueField:{detail:"value字段",default:"value"},parentField:{detail:"parent字段",default:"parent"},node:{detail:"单个节点图形设置",propertys:{strokeStyle:{detail:"描边色",default:"#ffffff"},lineWidth:{detail:"描边线宽",default:1},strokeAlpha:{detail:"描边边框透明度",default:1},fillStyle:{detail:"背景色",default:null},fillAlpha:{detail:"背景透明度",default:1},blurAlpha:{detail:"非激活状态透明度",documentation:"比如选中其中一项，其他不先关的要降低透明度",default:.4}}}}}}]),(0, _createClass2.default)(i,[{key:"init",value:function(){}},{key:"draw",value:function(e){e=e||{},index_es._.extend(!0,this,e),this.data=this._trimGraphs(),this.dataGroup=this._getDataGroupOfDepth(),this._widget(),this.sprite.context.x=this.width/2+this.origin.x,this.sprite.context.y=this.height/2+this.origin.y,this.fire("complete");}},{key:"_trimGraphs",value:function(){var t=this,e=parseInt(Math.min(this.width,this.height)/2),a=(0, _partition.default)().sort(null).size([2*Math.PI,e*e]).value(function(e){return e[t.valueField]}),i=this._tansTreeData();return this.data=a(i,0),this.data}},{key:"_getDataGroupOfDepth",value:function(){var t={};index_es._.each(this.data,function(e){t[e.depth]=[];}),index_es._.each(this.data,function(e){t[e.depth].push(e);});var e=[];for(var a in t)e.push(t[a]);return e}},{key:"_tansTreeData",value:function(){var e=this.dataFrame,t={},s=e.getFieldData(this.keyField),o=e.getFieldData(this.valueField),h=e.getFieldData(this.parentField);return function i(r,e,t){for(var a=e?e.name:void 0,n=t||0;n<h.length;n++){var l=h[n];if(l||0===l||(l=void 0),a===l){r.name=s[n],r.iNode=n;var u=o[n];!u&&0!==u||(r.value=u),index_es._.each(h,function(e,t){if(e===r.name){r.children||(r.children=[]);var a={};i(a,r,t),r.children.push(a);}});break}}}(t),t}},{key:"_widget",value:function(){var u=this;index_es._.each(this.dataGroup,function(n,l){index_es._.each(n,function(t,e){if(t.depth){var a=Math.sqrt(t.y+t.dy),i={r0:Math.sqrt(t.y),r:Math.sqrt(t.y)+2,startAngle:180*t.x/Math.PI,endAngle:180*(t.x+t.dx)/Math.PI,fillStyle:t.color||u.app.getTheme(t.iNode),strokeStyle:u.node.strokeStyle,lineWidth:u.node.lineWidth,globalAlpha:0},r=new Sector({id:"sector_"+l+"_"+e,context:i});(r.layoutData=t).sector=r,t.group=n,u.sprite.addChild(r),r.hover(function(e){u._focus(t,n);},function(e){u._unfocus(t,n);}),r.on(index_es.event.types.get(),function(e){e.eventInfo={trigger:u.node,iNode:t.iNode},u.app.fire(e.type,e);}),l<=1?(r.context.r=a,r.context.globalAlpha=1):setTimeout(function(){r.context&&(r.context.globalAlpha=1,r.animate({r:a},{duration:350}));},350*(l-1));}});});}},{key:"getNodesAt",value:function(t){var e=[];if(void 0!==t){var a=index_es._.find(this.data,function(e){return e.iNode==t});a.type="sunburst",a&&e.push(a);}return e}},{key:"_focus",value:function(t,e){var a=this;index_es._.each(e,function(e){e!==t&&(e.sector.context.globalAlpha=a.node.blurAlpha,a._focusChildren(e,function(e){e.sector.context.globalAlpha=a.node.blurAlpha;}));}),a._focusParent(t);}},{key:"_unfocus",value:function(){index_es._.each(this.data,function(e){e.sector&&(e.sector.context.globalAlpha=1);});}},{key:"_focusChildren",value:function(e,t){var a=this;e.children&&e.children.length&&index_es._.each(e.children,function(e){t(e),a._focusChildren(e,t);});}},{key:"_focusParent",value:function(t){var a=this;t.parent&&t.parent.sector&&t.parent.group&&index_es._.each(t.parent.group,function(e){e===t.parent?(e.sector.context.globalAlpha=1,a._focusParent(t.parent)):e.sector.context.globalAlpha=a.node.blurAlpha;});}}]),i}(_index.default);index_es.global.registerComponent(sunburstGraphs,"graphs","sunburst");var _default=sunburstGraphs;exports.default=_default;
});

unwrapExports(sunburst);

var sankey = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=_default;function _default(){var t={},e=24,i=8,f=[1,1],c=[],a=function(n,t){return n.y-t.y},s=[];function l(n,t){var r,e=0,u=n.length,o=-1;if(1===arguments.length)for(;++o<u;)isNaN(r=+n[o])||(e+=r);else for(;++o<u;)isNaN(r=+t.call(n,n[o],o))||(e+=r);return e}function h(n,t){var r,e,u=-1,o=n.length;if(1===arguments.length){for(;++u<o&&(null==(r=n[u])||r!=r);)r=void 0;for(;++u<o;)null!=(e=n[u])&&e<r&&(r=e);}else{for(;++u<o&&(null==(r=t.call(n,n[u],u))||r!=r);)r=void 0;for(;++u<o;)null!=(e=t.call(n,n[u],u))&&e<r&&(r=e);}return r}t.nodeWidth=function(n){return arguments.length?(e=+n,t):e},t.nodeSort=function(n){return arguments.length?(a=n,t):a},t.nodePadding=function(n){return arguments.length?(i=+n,t):i},t.nodes=function(n){return arguments.length?(c=n,t):c},t.links=function(n){return arguments.length?(s=n,t):s},t.size=function(n){return arguments.length?(f=n,t):f},t.layout=function(n){return c.forEach(function(n){n.sourceLinks=[],n.targetLinks=[];}),s.forEach(function(n){var t=n.source,r=n.target;"number"==typeof t&&(t=n.source=c[n.source]),"number"==typeof r&&(r=n.target=c[n.target]),t.sourceLinks.push(n),r.targetLinks.push(n);}),c.forEach(function(n){n.value=Math.max(l(n.sourceLinks,E),l(n.targetLinks,E));}),function(){var t,n=c,r=0;for(;n.length;)t=[],n.forEach(function(n){n.x=r,n.dx=e,n.sourceLinks.forEach(function(n){t.indexOf(n.target)<0&&t.push(n.target);});}),n=t,++r;(function(t){c.forEach(function(n){n.sourceLinks.length||(n.x=t-1);});})(r),function(t){c.forEach(function(n){n.x*=t;});}((f[0]-e)/(r-1));}(),function(n){var t=v().key(function(n){return n.x}).sortKeys(k).entries(c).map(function(n){return n.values});(function(){var r=h(t,function(n){return (f[1]-(n.length-1)*i)/l(n,E)});t.forEach(function(n){n.forEach(function(n,t){n.y=t,n.dy=n.value*r;});}),s.forEach(function(n){n.dy=n.value*r;});})(),o();for(var r=1;0<n;--n)u(r*=.99),o(),e(r),o();function e(r){function e(n){return p(n.source)*n.value}t.forEach(function(n,t){n.forEach(function(n){if(n.targetLinks.length){var t=l(n.targetLinks,e)/l(n.targetLinks,E);n.y+=(t-p(n))*r;}});});}function u(r){function e(n){return p(n.target)*n.value}t.slice().reverse().forEach(function(n){n.forEach(function(n){if(n.sourceLinks.length){var t=l(n.sourceLinks,e)/l(n.sourceLinks,E);n.y+=(t-p(n))*r;}});});}function o(){t.forEach(function(n){var t,r,e,u=0,o=n.length;for(a&&n.sort(a),e=0;e<o;++e)0<(r=u-(t=n[e]).y)&&(t.y+=r),u=t.y+t.dy+i;if(0<(r=u-i-f[1]))for(u=t.y-=r,e=o-2;0<=e;--e)0<(r=(t=n[e]).y+t.dy+i-u)&&(t.y-=r),u=t.y;});}}(n),_(),t},t.relayout=function(){return _(),t},t.link=function(){var h=.5;function t(n){var t,r,e=n.source.x+n.source.dx,u=n.target.x,o=(t=+(t=e),r=+(r=u),function(n){return t*(1-n)+r*n}),i=o(h),f=o(1-h),c=n.source.y+n.sy,a=n.target.y+n.ty,s=n.dy;s<1&&(s=1);var l="M"+e+","+c+"C"+i+","+c+" "+f+","+a+" "+u+","+a;return l+="v"+s,l+="C"+f+","+(a+s)+" "+i+","+(c+s)+" "+e+","+(c+s),l+="v"+-s+"z"}return t.curvature=function(n){return arguments.length?(h=+n,t):h},t};var v=function(){var l,h,v={},y=[],t=[];function g(r,n,e){if(e>=y.length)return h?h.call(v,n):l?n.sort(l):n;for(var t,u,o,i,f=-1,c=n.length,a=y[e++],s=new d;++f<c;)(i=s.get(t=a(u=n[f])))?i.push(u):s.set(t,[u]);return o=r?(u=r(),function(n,t){u.set(n,g(r,t,e));}):(u={},function(n,t){u[n]=g(r,t,e);}),s.forEach(o),u}return v.map=function(n,t){return g(t,n,0)},v.entries=function(n){return function r(n,e){if(e>=y.length)return n;var u=[],o=t[e++];return n.forEach(function(n,t){u.push({key:n,values:r(t,e)});}),o?u.sort(function(n,t){return o(n.key,t.key)}):u}(g(r,n,0),0)},v.key=function(n){return y.push(n),v},v.sortKeys=function(n){return t[y.length-1]=n,v},v.sortValues=function(n){return l=n,v},v.rollup=function(n){return h=n,v},v},r=function(n,t){var r=new d;if(n instanceof d)n.forEach(function(n,t){r.set(n,t);});else if(Array.isArray(n)){var e,u=-1,o=n.length;if(1===arguments.length)for(;++u<o;)r.set(u,n[u]);else for(;++u<o;)r.set(t.call(n,e=n[u],u),e);}else for(var i in n)r.set(i,n[i]);return r};function d(){this._=Object.create(null);}var u="__proto__",o="\0";function y(n){return (n+="")===u||n[0]===o?o+n:n}function g(n){return (n+="")[0]===o?n.slice(1):n}function k(n,t){return n<t?-1:t<n?1:t<=n?0:NaN}function _(){function t(n,t){return n.source.y-t.source.y}function r(n,t){return n.target.y-t.target.y}c.forEach(function(n){n.sourceLinks.sort(r),n.targetLinks.sort(t);}),c.forEach(function(n){var t=0,r=0;n.sourceLinks.forEach(function(n){n.sy=t,t+=n.dy;}),n.targetLinks.forEach(function(n){n.ty=r,r+=n.dy;});});}function p(n){return n.y+n.dy/2}function E(n){return n.value}return function(n,t){if(Object.defineProperty)for(var r in t)Object.defineProperty(n.prototype,r,{value:t[r],enumerable:!1});else index_es._.extend(n.prototype,t);}(d,{has:function(n){return y(n)in this._},get:function(n){return this._[y(n)]},set:function(n,t){return this._[y(n)]=t},remove:function(n){return (n=y(n))in this._&&delete this._[n]},keys:function(){var n=[];for(var t in this._)n.push(g(t));return n},values:function(){var n=[];for(var t in this._)n.push(this._[t]);return n},entries:function(){var n=[];for(var t in this._)n.push({key:g(t),value:this._[t]});return n},size:function(){var n=0;for(var t in this._)++n;return n},empty:function(){for(var n in this._)return !1;return !0},forEach:function(n){for(var t in this._)n.call(this,g(t),this._[t]);}}),t}
});

unwrapExports(sankey);

var sankey$1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_assertThisInitialized2=interopRequireDefault(assertThisInitialized$1),_createClass2=interopRequireDefault(createClass$1),_inherits2=interopRequireDefault(inherits$1),_canvax=interopRequireDefault(Canvax),_index=interopRequireDefault(graphs),_index2=interopRequireDefault(sankey),Path=_canvax.default.Shapes.Path,Rect=_canvax.default.Shapes.Rect,sankeyGraphs=function(e){function i(e,t){var a;return (0, _classCallCheck2.default)(this,i),(a=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(i).call(this,e,t))).type="sankey",index_es._.extend(!0,(0, _assertThisInitialized2.default)(a),(0, index_es.getDefaultProps)(i.defaultProps()),e),a.init(),a}return (0, _inherits2.default)(i,e),(0, _createClass2.default)(i,null,[{key:"defaultProps",value:function(){return {keyField:{detail:"key字段",default:null},valueField:{detail:"value字段",default:"value"},parentField:{detail:"parent字段",default:null},node:{detail:"node",propertys:{width:{detail:"节点宽",default:18},padding:{detail:"节点间距",default:10},sort:{detail:"节点排序字段",default:function(e,t){return e.y-t.y}},fillStyle:{detail:"节点背景色",default:null}}},line:{detail:"线设置",propertys:{strokeStyle:{detail:"线颜色",default:"blue"},alpha:{detail:"线透明度",default:.3},focus:{detail:"图形的hover设置",propertys:{enabled:{detail:"是否开启",default:!0}}}}},label:{detail:"文本设置",propertys:{fontColor:{detail:"文本颜色",default:"#666666"},fontSize:{detail:"文本字体大小",default:12},textAlign:{detail:"水平对齐方式",default:"left"},verticalAlign:{detail:"垂直对齐方式",default:"middle"},format:{detail:"文本格式函数",default:null}}}}}}]),(0, _createClass2.default)(i,[{key:"init",value:function(){this._links=new _canvax.default.Display.Sprite,this._nodes=new _canvax.default.Display.Sprite,this._labels=new _canvax.default.Display.Sprite,this.sprite.addChild(this._links),this.sprite.addChild(this._nodes),this.sprite.addChild(this._labels);}},{key:"draw",value:function(e){e=e||{},index_es._.extend(!0,this,e),this.data=this._trimGraphs(),this._widget(),this.sprite.context.x=this.origin.x,this.sprite.context.y=this.origin.y,this.fire("complete");}},{key:"_trimGraphs",value:function(){var i=this,l=[],n=[],e=i.dataFrame.getFieldData(i.keyField),r=i.dataFrame.getFieldData(i.valueField),s=i.dataFrame.getFieldData(i.parentField),d={};return index_es._.each(e,function(e,t){var a=[];i.parentField&&a.push(s[t]),a=a.concat(e.split(/[|]/)),index_es._.each(a,function(e){void 0===d[e]&&(d[e]=l.length,l.push({name:e}));});}),index_es._.each(e,function(e,t){var a=[];i.parentField&&a.push(s[t]),2==(a=a.concat(e.split(/[|]/))).length&&n.push({source:d[a[0]],target:d[a[1]],value:r[t]});}),(0, _index2.default)().nodeWidth(this.node.width).nodePadding(this.node.padding).nodeSort(this.node.sort).size([this.width,this.height]).nodes(l).links(n).layout(16)}},{key:"_widget",value:function(){this._drawNodes(),this._drawLinks(),this._drawLabels();}},{key:"_getColor",value:function(e,t,a){var i=e;return index_es._.isArray(i)&&(i=i[a]),index_es._.isFunction(i)&&(i=i(t)),i=i||this.app.getTheme(a)}},{key:"_drawNodes",value:function(){var e=this.data.nodes(),l=this;index_es._.each(e,function(e,t){var a=l._getColor(l.node.fillStyle,e,t),i=new Rect({xyToInt:!1,context:{x:e.x,y:e.y,width:l.data.nodeWidth(),height:Math.max(e.dy,1),fillStyle:a}});i.data=e,l._nodes.addChild(i);});}},{key:"_drawLinks",value:function(){var e=this.data.links(),n=this;index_es._.each(e,function(e,t){var a=n._getColor(n.line.strokeStyle,e,t),i=n.data.link()(e),l=new Path({xyToInt:!1,context:{path:i,fillStyle:a,globalAlpha:n.line.alpha,cursor:"pointer"}});l.__glpha=n.line.alpha,l.link=e,l.on(index_es.event.types.get(),function(e){n.line.focus.enabled&&("mouseover"==e.type&&(this.__glpha+=.1),"mouseout"==e.type&&(this.__glpha-=.1));var t=this.link;t.type="sankey",e.eventInfo={trigger:n.node,title:t.source.name+" --<span style='position:relative;top:-0.5px;font-size:16px;left:-3px;'>></span> "+t.target.name,nodes:[t]},n.app.fire(e.type,e);}),n._links.addChild(l);});}},{key:"_drawLabels",value:function(){var e=this.data.nodes(),r=this;index_es._.each(e,function(e){var t=r.label.textAlign,a=e.x+r.data.nodeWidth()+4,i=e.y+Math.max(e.dy/2,1),l=r.label.format?r.label.format(e.name,e):e.name,n=new _canvax.default.Display.Text(l,{context:{x:a,y:i,fillStyle:r.label.fontColor,fontSize:r.label.fontSize,textAlign:t,textBaseline:r.label.verticalAlign}});r._labels.addChild(n),n.getTextWidth()+a>r.width&&(n.context.x=e.x-4,n.context.textAlign="right");});}}]),i}(_index.default);index_es.global.registerComponent(sankeyGraphs,"graphs","sankey");var _default2=sankeyGraphs;exports.default=_default2;
});

unwrapExports(sankey$1);

var progress = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_assertThisInitialized2=interopRequireDefault(assertThisInitialized$1),_createClass2=interopRequireDefault(createClass$1),_inherits2=interopRequireDefault(inherits$1),_canvax=interopRequireDefault(Canvax),_index=interopRequireDefault(graphs),Progress=function(e){function i(e,t){var l;return (0, _classCallCheck2.default)(this,i),(l=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(i).call(this,e,t))).type="progress",index_es._.extend(!0,(0, _assertThisInitialized2.default)(l),(0, index_es.getDefaultProps)(i.defaultProps()),e),l.bgNodeData=null,l.init(),l}return (0, _inherits2.default)(i,e),(0, _createClass2.default)(i,null,[{key:"defaultProps",value:function(){return {node:{detail:"进度条设置",propertys:{width:{detail:"进度条的宽度",default:20},radius:{detail:"进度条两端的圆角半径",default:10},fillStyle:{detail:"进度条的填充色",documentation:"可以是单个颜色，也可以是数组，也可以是一个函数,也可以是个lineargradient",default:null}}},label:{detail:"进度值文本",propertys:{enabled:{detail:"是否启用label",default:"true"},unit:{detail:"单位值，默认%",default:"%"},unitColor:{detail:"单位值的颜色",default:null},unitFontSize:{detail:"单位值的大小",default:14},fontColor:{detail:"label颜色",default:null},fontSize:{detail:"label文本大小",default:26},fixNum:{detail:"toFixed的位数",default:2},format:{detail:"label格式化处理函数",default:function(e){return e.toFixed(this.label.fixNum)}},lineWidth:{detail:"label文本描边线宽",default:null},strokeStyle:{detail:"label描边颜色",default:null},rotation:{detail:"label旋转角度",default:0},textAlign:{detail:"label textAlign",default:"center",values:["left","center","right"]},verticalAlign:{detail:"label verticalAlign",default:"middle",values:["top","middle","bottom"]},position:{detail:"label位置",default:"origin"},offsetX:{detail:"label在x方向的偏移量",default:0},offsetY:{detail:"label在y方向的偏移量",default:0}}},bgEnabled:{detail:"是否开启背景",default:!0},bgColor:{detail:"进度条背景颜色",default:"#f7f7f7"},radius:{detail:"半径",default:null},allAngle:{detail:"总角度",documentation:"默认为null，则和坐标系同步",default:null},startAngle:{detail:"其实角度",documentation:"默认为null，则和坐标系同步",default:null}}}}]),(0, _createClass2.default)(i,[{key:"init",value:function(){}},{key:"draw",value:function(e){e=e||{};var t=this;index_es._.extend(!0,this,e),t.grow(function(e){t.data=t._trimGraphs(e),t._widget();}),this.sprite.context.x=this.origin.x,this.sprite.context.y=this.origin.y;}},{key:"_trimGraphs",value:function(o){var s=this;null==o&&(o=1);var e=this.app.getComponent({name:"coord"});this.enabledField=e.filterEnabledFields(this.field);var u=s.startAngle||e.startAngle,f=s.allAngle||e.allAngle;startAngle,allAngle;this.bgNodeData=this._getNodeData(u,f),this.bgNodeData.fillStyle=this._getStyle(this.bgNodeData,this.bgColor);var t={};return index_es._.each(this.enabledField,function(r){var e=s.dataFrame.getFieldData(r),d=[];index_es._.each(e,function(e,t){e*=o;var l=d.slice(-1)[0],i=l?l.endAngle:u,a=f*(e/100),n=s._getNodeData(i,a,r,e,t);n.fillStyle=s._getStyle(n,s.node.fillStyle),d.push(n);}),t[r]=d;}),t}},{key:"_getNodeData",value:function(e,t,l,i,a){var n=this,r=this.app.getComponent({name:"coord"}),d=e+t/2,o=e+t,s=Math.PI*e/180,u=Math.PI*d/180,f=Math.PI*o/180,_=n.radius||r.radius,g=_-n.node.width,h={field:l,value:i,text:i,iNode:a,allAngle:t,startAngle:e,middleAngle:d,endAngle:o,startRadian:s,middleRadian:u,endRadian:f,outRadius:_,innerRadius:g,startOutPoint:r.getPointInRadianOfR(s,_),middleOutPoint:r.getPointInRadianOfR(u,_),endOutPoint:r.getPointInRadianOfR(f,_),startInnerPoint:r.getPointInRadianOfR(s,g),middleInnerPoint:r.getPointInRadianOfR(u,g),endInnerPoint:r.getPointInRadianOfR(f,g),rowData:n.dataFrame.getRowDataAt(a),fillStyle:null};return l&&n.label.format&&index_es._.isFunction(n.label.format)&&(h.text=n.label.format.apply(this,[i,h])),h}},{key:"_widget",value:function(){var h=this;if(h.bgEnabled){var e=h._getPathStr(this.bgNodeData);h._bgPathElement?h._bgPathElement.context.path=e:(h._bgPathElement=new _canvax.default.Shapes.Path({context:{path:e}}),h.sprite.addChild(h._bgPathElement)),h._bgPathElement.context.fillStyle=this.bgNodeData.fillStyle;}index_es._.each(this.data,function(e){index_es._.each(e,function(e,t){var l=h._getPathStr(e),i="progress_bar_"+e.field+"_"+t,a=h.sprite.getChildById(i);if(a?a.context.path=l:(a=new _canvax.default.Shapes.Path({id:i,context:{path:l}}),h.sprite.addChild(a)),a.context.fillStyle=e.fillStyle,h.label.enabled){var n="progress_label_"+e.field+"_sprite_"+t,r=h.sprite.getChildById(n);r||(r=new _canvax.default.Display.Sprite({id:n}),h.sprite.addChild(r)),r.context.x=h.label.offsetX-6,r.context.y=h.label.offsetY;var d={fillStyle:h.label.fontColor||e.fillStyle,fontSize:h.label.fontSize,lineWidth:h.label.lineWidth,strokeStyle:h.label.strokeStyle,textAlign:h.label.textAlign,textBaseline:h.label.verticalAlign,rotation:h.label.rotation},o="progress_label_"+e.field+"_"+t;if(s=r.getChildById(o))s.resetText(e.text),index_es._.extend(s.context,d);else{var s=new _canvax.default.Display.Text(e.text,{id:o,context:d});r.addChild(s);}var u="progress_label_"+e.field+"_symbol_"+t,f=r.getChildById(u),_={x:s.getTextWidth()/2+2,y:3,fillStyle:h.label.unitColor||h.label.fontColor||e.fillStyle,fontSize:h.label.unitFontSize,textAlign:"left",textBaseline:h.label.verticalAlign};if(f)index_es._.extend(f.context,_);else{var g=h.label.unit;f=new _canvax.default.Display.Text(g,{id:u,context:_});r.addChild(f);}}});});}},{key:"_getPathStr",value:function(e){var t="M"+e.startOutPoint.x+" "+e.startOutPoint.y;t+="A"+e.outRadius+" "+e.outRadius+" 0 0 1 "+e.middleOutPoint.x+" "+e.middleOutPoint.y,t+="A"+e.outRadius+" "+e.outRadius+" 0 0 1 "+e.endOutPoint.x+" "+e.endOutPoint.y;return e.allAngle,t+="L"+e.endInnerPoint.x+" "+e.endInnerPoint.y,t+="A"+e.innerRadius+" "+e.innerRadius+" 0 0 0 "+e.middleInnerPoint.x+" "+e.middleInnerPoint.y,t+="A"+e.innerRadius+" "+e.innerRadius+" 0 0 0 "+e.startInnerPoint.x+" "+e.startInnerPoint.y,t+="Z"}},{key:"_getStyle",value:function(e,t,l){var i=this.app.getComponent({name:"coord"}).getFieldMapOf(e.field);if(l=l||(i?i.color:"#171717"),t&&(index_es._.isString(t)&&(a=t),index_es._.isArray(t)&&(a=t[e.iNode]),index_es._.isFunction(t)&&(a=t.apply(this,arguments)),t&&t.lineargradient)){var a=this.ctx.createLinearGradient(e.startOutPoint.x,e.startOutPoint.y,e.endOutPoint.x,e.endOutPoint.y);index_es._.each(t.lineargradient,function(e,t){a.addColorStop(e.position,e.color);});}return a=a||l}}]),i}(_index.default);index_es.global.registerComponent(Progress,"graphs","progress");var _default2=Progress;exports.default=_default2;
});

unwrapExports(progress);

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }
}

var arrayWithoutHoles = _arrayWithoutHoles;

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

var iterableToArray = _iterableToArray;

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var nonIterableSpread = _nonIterableSpread;

function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || nonIterableSpread();
}

var toConsumableArray = _toConsumableArray;

var data = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.checkDataIsJson=checkDataIsJson,exports.jsonToArrayForRelation=jsonToArrayForRelation,exports.arrayToTreeJsonForRelation=arrayToTreeJsonForRelation;var defaultFieldKey="__key__",childrenKey="children";function checkDataIsJson(e,n,r){childrenKey=r;return !!index_es._.isArray(e)&&(index_es._.every(e,function(e){return index_es._.isObject(e)})&&index_es._.every(e,function(e){return !index_es._.isArray(e[n])}),index_es._.some(e,function(e){return childrenKey in e}))}function jsonToArrayForRelation(e,n,r){childrenKey=r;var a=[],c=new WeakMap,s=n.field||defaultFieldKey,_=n.node&&n.node.content&&n.node.content.field;if(!checkDataIsJson(e,s,childrenKey))return console.error("该数据不能正确绘制，请提供数组对象形式的数据！"),a;var l=[],u=0,v=void 0;index_es._.each(e,function(e){l.push(e);});for(var i=function(){v[s]||(v[s]=u);var e=v[childrenKey];e&&(index_es._.each(e,function(e){c.set(e,{parentIndex:u,parentNode:v});}),l=l.concat(e.reverse()));var r={};index_es._.each(v,function(e,n){n!==childrenKey&&(r[n]=e);}),a.push(r);var n=c.get(v);if(n){var i=n.parentIndex,o=n.parentNode,t={};t.key=[i,u].join(","),_&&(t[_]=[o[_],v[_]].join("_")),a.push(t);}u++;};v=l.pop();)i();return a}function arrayToTreeJsonForRelation(e,r){var t={},a={};index_es._.each(e,function(e){var n=e[r.field];1==n.split(",").length?t[n]=e:a[n]=e;});var n=[];return index_es._.each(t,function(e,r){var i=!0;index_es._.each(a,function(e,n){if(n.split(",")[1]==r)return i=!1}),i&&(n.push(e),e.__inRelation=!0);}),function n(e){index_es._.each(e,function(i,e){if(!i.__cycle){var o=i[r.field];index_es._.each(a,function(e,n){if(n.split(",")[0]==o){var r=t[n.split(",")[1]];r&&(i.children||(i.children=[]),i.children.push(r),r.__inRelation&&(r.__cycle=!0));}}),i.children&&i.children.length&&n(i.children);}});}(n),n}
});

unwrapExports(data);
var data_1 = data.checkDataIsJson;
var data_2 = data.jsonToArrayForRelation;
var data_3 = data.arrayToTreeJsonForRelation;

var relation = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _toConsumableArray2=interopRequireDefault(toConsumableArray),_classCallCheck2=interopRequireDefault(classCallCheck$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_assertThisInitialized2=interopRequireDefault(assertThisInitialized$1),_createClass2=interopRequireDefault(createClass$1),_inherits2=interopRequireDefault(inherits$1),_canvax=interopRequireDefault(Canvax),_index=interopRequireDefault(graphs),Rect=_canvax.default.Shapes.Rect,Path=_canvax.default.Shapes.Path,Arrow=_canvax.default.Shapes.Arrow,Circle=_canvax.default.Shapes.Circle,Relation=function(e){function n(e,t){var a;if((0, _classCallCheck2.default)(this,n),(a=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(n).call(this,e,t))).type="relation",index_es._.extend(!0,(0, _assertThisInitialized2.default)(a),(0, index_es.getDefaultProps)(n.defaultProps()),e),"dagre"===a.layout){var i={graph:{rankdir:"TB",nodesep:10,ranksep:10,edgesep:10,acyclicer:"greedy"},node:{},edge:{}};index_es._.extend(!0,i,a.layoutOpts),index_es._.extend(!0,a.layoutOpts,i),a.rankdir?a.layoutOpts.graph.rankdir=a.rankdir:a.rankdir=a.layoutOpts.graph.rankdir;}return a.domContainer=t.canvax.domView,a.induce=null,a.init(),a}return (0, _inherits2.default)(n,e),(0, _createClass2.default)(n,null,[{key:"defaultProps",value:function(){return {field:{detail:"key字段设置",documentation:"",default:null},childrenField:{detail:"树结构数据的关联字段",documentation:"如果是树结构的关联数据，不是行列式，那么就通过这个字段来建立父子关系",default:"children"},rankdir:{detail:"布局方向",default:null},node:{detail:"单个节点的配置",propertys:{shapeType:{detail:"节点图形，目前只支持rect",default:"rect"},maxWidth:{detail:"节点最大的width",default:200},width:{detail:"内容的width",default:null},height:{detail:"内容的height",default:null},radius:{detail:"圆角角度",default:6},fillStyle:{detail:"节点背景色",default:"#ffffff"},strokeStyle:{detail:"描边颜色",default:"#e5e5e5"},padding:{detail:"node节点容器到内容的边距",default:10},content:{detail:"节点内容配置",propertys:{field:{detail:"内容字段",documentation:"默认content字段",default:"content"},fontColor:{detail:"内容文本颜色",default:"#666"},format:{detail:"内容格式化处理函数",default:null},textAlign:{detail:"textAlign",default:"center"},textBaseline:{detail:"textBaseline",default:"middle"}}}}},line:{detail:"两个节点连线配置",propertys:{isTree:{detail:"是否树结构的连线",documentation:"非树结构启用该配置可能会有意想不到的惊喜，慎用",default:!1},inflectionRadius:{detail:"树状连线的拐点圆角半径",default:0},shapeType:{detail:"连线的图形样式 brokenLine or bezier",default:"bezier"},lineWidth:{detail:"线宽",default:1},strokeStyle:{detail:"连线的颜色",default:"#e5e5e5"},lineType:{detail:"连线样式（虚线等）",default:"solid"},arrow:{detail:"是否有箭头",default:!0}}},layout:{detail:"采用的布局引擎,比如dagre",default:"dagre"},layoutOpts:{detail:"布局引擎对应的配置,dagre详见dagre的官方wiki",propertys:{}},status:{detail:"一些开关配置",propertys:{transform:{detail:"是否启动拖拽缩放整个画布",propertys:{fitView:{detail:"自动缩放",default:""},enabled:{detail:"是否开启",default:!0},scale:{detail:"缩放值",default:1},scaleOrigin:{detail:"缩放原点",default:{x:0,y:0}}}}}}}}}]),(0, _createClass2.default)(n,[{key:"init",value:function(){this.initInduce(),this.nodesSp=new _canvax.default.Display.Sprite({id:"nodesSp"}),this.edgesSp=new _canvax.default.Display.Sprite({id:"edgesSp"}),this.graphsSp=new _canvax.default.Display.Sprite({id:"graphsSp"}),this.graphsSp.addChild(this.edgesSp),this.graphsSp.addChild(this.nodesSp),this._grahsSpClone=new _canvax.default.Display.Sprite({id:"graphsSp_clone"}),this.sprite.addChild(this.graphsSp),this.sprite.addChild(this._grahsSpClone),window.gsp=this.graphsSp;}},{key:"initInduce",value:function(){var n=this;this.induce=new Rect({id:"induce",context:{width:0,height:0,fillStyle:"#000000",globalAlpha:0}}),this.sprite.addChild(this.induce);var e=!1,t=null,a=n.app.canvax.domView.style.cursor,s=null,r=0;this.induce.on(index_es.event.types.get(),function(i){n.status.transform.enabled&&("mousedown"==i.type&&(n.induce.toFront(),e=!0,t=i.point,n.app.canvax.domView.style.cursor="move"),"mouseup"!=i.type&&"mouseout"!=i.type||(n.induce.toBack(),e=!1,t=null,n.app.canvax.domView.style.cursor=a),"mousemove"==i.type&&e&&(n.graphsSp.context.x+=i.point.x-t.x,n.graphsSp.context.y+=i.point.y-t.y,t=i.point),"wheel"==i.type&&(Math.abs(i.deltaY)>Math.abs(r)&&(r=i.deltaY),s=s||setTimeout(function(){var e=i.deltaY/30*.02;Math.abs(e)<.04&&(e=.04*Math.sign(e)),.08<Math.abs(e)&&(e=.08*Math.sign(e));var t=n.status.transform.scale+e;t<=.1&&(t=.1),1<=t&&(t=1);var a=i.target.localToGlobal(i.point);n.scale(t,a),s=null,r=0;},32),i.preventDefault()));});}},{key:"scale",value:function(){}},{key:"draw",value:function(e){e=e||{},index_es._.extend(!0,this,e),this.data=e.data||this._initData(),"dagre"==this.layout?this.dagreLayout(this.data):"tree"==this.layout?this.treeLayout(this.data):index_es._.isFunction(this.layout)&&this.layout(this.data),this.widget(),this.sprite.context.x=this.origin.x,this.sprite.context.y=this.origin.y,"autoZoom"==this.status.transform.fitView&&(this.sprite.context.scaleX=this.width/this.data.size.width,this.sprite.context.scaleY=this.height/this.data.size.height);var t=(this.width-this.data.size.width)/2;t<0&&(t=0),this.graphsSp.context.x=t,this._grahsSpClone.context.x=t;}},{key:"_initData",value:function(){var e={nodes:[],edges:[],size:{width:0,height:0}},t=this.app._data;(0, data.checkDataIsJson)(t,this.field,this.childrenField)?(this.jsonData=(0, data.jsonToArrayForRelation)(t,this,this.childrenField),this.dataFrame=this.app.dataFrame=(0, index_es.dataFrame)(this.jsonData)):"tree"==this.layout&&(this.jsonData=(0, data.arrayToTreeJsonForRelation)(this.app.dataFrame.jsonOrg,this));for(var a={},i=0;i<this.dataFrame.length;i++){var n=this.dataFrame.getRowDataAt(i),s=index_es._.flatten([(n[this.field]+"").split(",")]),r=this._getContent(n),l={type:"relation",iNode:i,rowData:n,key:1==s.length?s[0]:s,content:r,ctype:this._checkHtml(r)?"html":"canvas",element:null,width:null,height:null,x:null,y:null,shapeType:null,source:null,target:null};index_es._.extend(l,this._getElementAndSize(l)),1==s.length?(l.shapeType=this.getProp(this.node.shapeType,l),e.nodes.push(l),a[l.key]=l):(l.shapeType=this.getProp(this.line.shapeType,l),e.edges.push(l));}return index_es._.each(e.edges,function(e){var t=e.key;e.source=a[t[0]],e.target=a[t[1]];}),e}},{key:"dagreLayout",value:function(e){var t=index_es.global.layout.dagre,a=new t.graphlib.Graph;return a.setGraph(this.layoutOpts.graph),a.setDefaultEdgeLabel(function(){return {}}),index_es._.each(e.nodes,function(e){a.setNode(e.key,e);}),index_es._.each(e.edges,function(e){a.setEdge.apply(a,(0, _toConsumableArray2.default)(e.key).concat([e]));}),t.layout(a),e.size.width=a.graph().width,e.size.height=a.graph().height,e}},{key:"treeLayout",value:function(){var e=index_es.global.layout.tree().separation(function(e,t){return (e.width+t.width)/2+10}),t=e.nodes(this.jsonData[0]).reverse();e.links(t);}},{key:"widget",value:function(){var r=this;index_es._.each(this.data.edges,function(e){r.line.isTree&&r._setTreePoints(e);var t=r.getProp(r.line.lineWidth,e),a=r.getProp(r.line.strokeStyle,e),i=new Path({context:{path:r._getPathStr(e,r.line.inflectionRadius),lineWidth:t,strokeStyle:a}}),n=e.points.slice(-2,-1)[0];if("bezier"==r.line.shapeType&&("TB"!=r.rankdir&&"BT"!=r.rankdir||(n.x+=(e.source.x-e.target.x)/20),"LR"!=r.rankdir&&"RL"!=r.rankdir||(n.y+=(e.source.y-e.target.y)/20)),r.edgesSp.addChild(i),r.line.arrow){var s=new Arrow({context:{control:n,point:e.points.slice(-1)[0],strokeStyle:a}});r.edgesSp.addChild(s);}}),index_es._.each(this.data.nodes,function(t){var a=new Rect({context:{x:t.x-t.width/2,y:t.y-t.height/2,width:t.width,height:t.height,lineWidth:1,fillStyle:r.getProp(r.node.fillStyle,t),strokeStyle:r.getProp(r.node.strokeStyle,t),radius:index_es._.flatten([r.getProp(r.node.radius,t)])}});a.nodeData=t,r.nodesSp.addChild(a),a.on(index_es.event.types.get(),function(e){e.eventInfo={trigger:r.node,nodes:[this.nodeData]},r.app.fire(e.type,e);}),"canvas"==t.ctype&&(t.element.context.x=t.x-t.width/2,t.element.context.y=t.y-t.height/2,r.nodesSp.addChild(t.element)),"html"==t.ctype&&a.on("transform",function(){var e="undefined"!=typeof window?window.devicePixelRatio:1;t.element.style.transform="matrix("+a.worldTransform.clone().scale(1/e,1/e).toArray().join()+")",t.element.style.transformOrigin="left top",t.element.style.marginLeft=r.getProp(r.node.padding,t)*r.status.transform.scale+"px",t.element.style.marginTop=r.getProp(r.node.padding,t)*r.status.transform.scale+"px",t.element.style.visibility="visible";});}),this.induce.context.width=this.width,this.induce.context.height=this.height;}},{key:"_setTreePoints",value:function(e){var t=e.points;"TB"!=this.rankdir&&"BT"!=this.rankdir||(t[0]={x:e.source.x,y:e.source.y+("BT"==this.rankdir?-1:1)*e.source.height/2},t.splice(1,0,{x:e.source.x,y:t.slice(-2,-1)[0].y})),"LR"!=this.rankdir&&"RL"!=this.rankdir||(t[0]={x:e.source.x+("RL"==this.rankdir?-1:1)*e.source.width/2,y:e.source.y},t.splice(1,0,{x:t.slice(-2,-1)[0].x,y:e.source.y})),e.points=t;}},{key:"_getPathStr",value:function(e,h){var u=e.points,t=u[0],a=u.slice(-1)[0],p="M"+t.x+" "+t.y;return "bezier"==e.shapeType&&(3==u.length&&(p+=",Q"+u[1].x+" "+u[1].y+" "+a.x+" "+a.y),4==u.length&&(p+=",C"+u[1].x+" "+u[1].y+" "+u[2].x+" "+u[2].y+" "+a.x+" "+a.y)),"brokenLine"==e.shapeType&&index_es._.each(u,function(a,e){if(e)if(h&&e<u.length-1){var t=u[e-1],i=u[e+1],n=h,s=Math.max(Math.abs(t.x-a.x)/2,Math.abs(t.y-a.y)/2),r=Math.max(Math.abs(i.x-a.x)/2,Math.abs(i.y-a.y)/2);if(n=index_es._.min([n,s,r]),a.x==t.x&&a.y==t.y||a.x==i.x&&a.y==i.y||Math.atan2(a.y-t.y,a.x-t.x)==Math.atan2(i.y-a.y,i.x-a.x))return;var l=function(e){var t=Math.atan2(e.y-a.y,e.x-a.x);return {x:a.x+n*Math.cos(t),y:a.y+n*Math.sin(t)}},o=l(t),d=l(i);p+=",L"+o.x+" "+o.y+",Q"+a.x+" "+a.y+" "+d.x+" "+d.y;}else p+=",L"+a.x+" "+a.y;}),p}},{key:"_checkHtml",value:function(e){return /<[^>]+>/g.test(e)}},{key:"_getContent",value:function(e){var t;return this._isField(this.node.content.field)&&(t=e[this.node.content.field]),this.node.content.format&&index_es._.isFunction(this.node.content.format)&&(t=this.node.content.format.apply(this,[t,e])),t}},{key:"_isField",value:function(e){return ~this.dataFrame.fields.indexOf(e)}},{key:"_getElementAndSize",value:function(e){var t=e.ctype;return this._isField(t)&&(t=e.rowData[t]),"canvas"==(t=t||"canvas")?this._getEleAndsetCanvasSize(e):"html"==t?this._getEleAndsetHtmlSize(e):void 0}},{key:"_getEleAndsetCanvasSize",value:function(e){var t=this,a=e.content,i=e.rowData.width,n=e.rowData.height,s=new _canvax.default.Display.Sprite({}),r=new _canvax.default.Display.Text(a,{context:{fillStyle:t.getProp(t.node.content.fontColor,e),textAlign:t.getProp(t.node.content.textAlign,e),textBaseline:t.getProp(t.node.content.textBaseline,e)}});return i=i||r.getTextWidth()+t.getProp(t.node.padding,e)*t.status.transform.scale*2,n=n||r.getTextHeight()+t.getProp(t.node.padding,e)*t.status.transform.scale*2,s.addChild(r),s.context.width=parseInt(i),s.context.height=parseInt(n),r.context.x=parseInt(i/2),r.context.y=parseInt(n/2),{element:s,width:i,height:n}}},{key:"_getEleAndsetHtmlSize",value:function(e){var t=this,a=e.content,i=e.rowData.width,n=e.rowData.height,s=document.createElement("div");return s.className="chartx_relation_node",s.style.cssText+="; position:absolute;visibility:hidden;",s.style.cssText+="; color:"+t.getProp(t.node.content.fontColor,e)+";",s.style.cssText+="; text-align:"+t.getProp(t.node.content.textAlign,e)+";",s.style.cssText+="; vertical-align:"+t.getProp(t.node.content.textBaseline,e)+";",s.innerHTML=a,this.domContainer.appendChild(s),{element:s,width:i=i||s.offsetWidth+t.getProp(t.node.padding,e)*t.status.transform.scale*2,height:n=n||s.offsetHeight+t.getProp(t.node.padding,e)*t.status.transform.scale*2}}},{key:"getNodesAt",value:function(){}},{key:"getProp",value:function(e,t){var a=e;return this._isField(e)?a=t.rowData[e]:(index_es._.isArray(e)&&(a=e[t.iNode]),index_es._.isFunction(e)&&(a=e.apply(this,[t]))),a}}]),n}(_index.default);index_es.global.registerComponent(Relation,"graphs","relation");var _default=Relation;exports.default=_default;
});

unwrapExports(relation);

var interopRequireWildcard = createCommonjsModule(function (module) {
function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function _getRequireWildcardCache() {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || _typeof_1$1(obj) !== "object" && typeof obj !== "function") {
    return {
      "default": obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj["default"] = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

module.exports = _interopRequireWildcard;
});

unwrapExports(interopRequireWildcard);

var force = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.forceCenter=center,exports.forceCollide=collide,exports.forceLink=link,exports.forceManyBody=manyBody,exports.forceRadial=radial,exports.forceSimulation=simulation,exports.forceX=x$2,exports.forceY=y$2;var _typeof2=interopRequireDefault(_typeof_1$1);function center(o,a){var u;function n(){var t,n,e=u.length,r=0,i=0;for(t=0;t<e;++t)r+=(n=u[t]).x,i+=n.y;for(r=r/e-o,i=i/e-a,t=0;t<e;++t)(n=u[t]).x-=r,n.y-=i;}return null==o&&(o=0),null==a&&(a=0),n.initialize=function(t){u=t;},n.x=function(t){return arguments.length?(o=+t,n):o},n.y=function(t){return arguments.length?(a=+t,n):a},n}function tree_add(t){var n=+this._x.call(null,t),e=+this._y.call(null,t);return add(this.cover(n,e),n,e,t)}function add(t,n,e,r){if(isNaN(n)||isNaN(e))return t;var i,o,a,u,l,f,c,s,h,y=t._root,d={data:r},v=t._x0,x=t._y0,p=t._x1,_=t._y1;if(!y)return t._root=d,t;for(;y.length;)if((f=n>=(o=(v+p)/2))?v=o:p=o,(c=e>=(a=(x+_)/2))?x=a:_=a,!(y=(i=y)[s=c<<1|f]))return i[s]=d,t;if(u=+t._x.call(null,y.data),l=+t._y.call(null,y.data),n===u&&e===l)return d.next=y,i?i[s]=d:t._root=d,t;for(;i=i?i[s]=new Array(4):t._root=new Array(4),(f=n>=(o=(v+p)/2))?v=o:p=o,(c=e>=(a=(x+_)/2))?x=a:_=a,(s=c<<1|f)==(h=(a<=l)<<1|o<=u););return i[h]=y,i[s]=d,t}function addAll(t){var n,e,r,i,o=t.length,a=new Array(o),u=new Array(o),l=1/0,f=1/0,c=-1/0,s=-1/0;for(e=0;e<o;++e)isNaN(r=+this._x.call(null,n=t[e]))||isNaN(i=+this._y.call(null,n))||((a[e]=r)<l&&(l=r),c<r&&(c=r),(u[e]=i)<f&&(f=i),s<i&&(s=i));if(c<l||s<f)return this;for(this.cover(l,f).cover(c,s),e=0;e<o;++e)add(this,a[e],u[e],t[e]);return this}function tree_cover(t,n){if(isNaN(t=+t)||isNaN(n=+n))return this;var e=this._x0,r=this._y0,i=this._x1,o=this._y1;if(isNaN(e))i=(e=Math.floor(t))+1,o=(r=Math.floor(n))+1;else{for(var a,u,l=i-e,f=this._root;t<e||i<=t||n<r||o<=n;)switch(u=(n<r)<<1|t<e,(a=new Array(4))[u]=f,f=a,l*=2,u){case 0:i=e+l,o=r+l;break;case 1:e=i-l,o=r+l;break;case 2:i=e+l,r=o-l;break;case 3:e=i-l,r=o-l;}this._root&&this._root.length&&(this._root=f);}return this._x0=e,this._y0=r,this._x1=i,this._y1=o,this}function tree_data(){var n=[];return this.visit(function(t){if(!t.length)for(;n.push(t.data),t=t.next;);}),n}function tree_extent(t){return arguments.length?this.cover(+t[0][0],+t[0][1]).cover(+t[1][0],+t[1][1]):isNaN(this._x0)?void 0:[[this._x0,this._y0],[this._x1,this._y1]]}function Quad(t,n,e,r,i){this.node=t,this.x0=n,this.y0=e,this.x1=r,this.y1=i;}function tree_find(t,n,e){var r,i,o,a,u,l,f,c=this._x0,s=this._y0,h=this._x1,y=this._y1,d=[],v=this._root;for(v&&d.push(new Quad(v,c,s,h,y)),null==e?e=1/0:(c=t-e,s=n-e,h=t+e,y=n+e,e*=e);l=d.pop();)if(!(!(v=l.node)||(i=l.x0)>h||(o=l.y0)>y||(a=l.x1)<c||(u=l.y1)<s))if(v.length){var x=(i+a)/2,p=(o+u)/2;d.push(new Quad(v[3],x,p,a,u),new Quad(v[2],i,p,x,u),new Quad(v[1],x,o,a,p),new Quad(v[0],i,o,x,p)),(f=(p<=n)<<1|x<=t)&&(l=d[d.length-1],d[d.length-1]=d[d.length-1-f],d[d.length-1-f]=l);}else{var _=t-this._x.call(null,v.data),g=n-this._y.call(null,v.data),w=_*_+g*g;if(w<e){var m=Math.sqrt(e=w);c=t-m,s=n-m,h=t+m,y=n+m,r=v.data;}}return r}function tree_remove(t){if(isNaN(o=+this._x.call(null,t))||isNaN(a=+this._y.call(null,t)))return this;var n,e,r,i,o,a,u,l,f,c,s,h,y=this._root,d=this._x0,v=this._y0,x=this._x1,p=this._y1;if(!y)return this;if(y.length)for(;;){if((f=o>=(u=(d+x)/2))?d=u:x=u,(c=a>=(l=(v+p)/2))?v=l:p=l,!(y=(n=y)[s=c<<1|f]))return this;if(!y.length)break;(n[s+1&3]||n[s+2&3]||n[s+3&3])&&(e=n,h=s);}for(;y.data!==t;)if(!(y=(r=y).next))return this;return (i=y.next)&&delete y.next,r?i?r.next=i:delete r.next:n?(i?n[s]=i:delete n[s],(y=n[0]||n[1]||n[2]||n[3])&&y===(n[3]||n[2]||n[1]||n[0])&&!y.length&&(e?e[h]=y:this._root=y)):this._root=i,this}function removeAll(t){for(var n=0,e=t.length;n<e;++n)this.remove(t[n]);return this}function tree_root(){return this._root}function tree_size(){var n=0;return this.visit(function(t){if(!t.length)for(;++n,t=t.next;);}),n}function tree_visit(t){var n,e,r,i,o,a,u=[],l=this._root;for(l&&u.push(new Quad(l,this._x0,this._y0,this._x1,this._y1));n=u.pop();)if(!t(l=n.node,r=n.x0,i=n.y0,o=n.x1,a=n.y1)&&l.length){var f=(r+o)/2,c=(i+a)/2;(e=l[3])&&u.push(new Quad(e,f,c,o,a)),(e=l[2])&&u.push(new Quad(e,r,c,f,a)),(e=l[1])&&u.push(new Quad(e,f,i,o,c)),(e=l[0])&&u.push(new Quad(e,r,i,f,c));}return this}function tree_visitAfter(t){var n,e=[],r=[];for(this._root&&e.push(new Quad(this._root,this._x0,this._y0,this._x1,this._y1));n=e.pop();){var i=n.node;if(i.length){var o,a=n.x0,u=n.y0,l=n.x1,f=n.y1,c=(a+l)/2,s=(u+f)/2;(o=i[0])&&e.push(new Quad(o,a,u,c,s)),(o=i[1])&&e.push(new Quad(o,c,u,l,s)),(o=i[2])&&e.push(new Quad(o,a,s,c,f)),(o=i[3])&&e.push(new Quad(o,c,s,l,f));}r.push(n);}for(;n=r.pop();)t(n.node,n.x0,n.y0,n.x1,n.y1);return this}function defaultX(t){return t[0]}function tree_x(t){return arguments.length?(this._x=t,this):this._x}function defaultY(t){return t[1]}function tree_y(t){return arguments.length?(this._y=t,this):this._y}function quadtree(t,n,e){var r=new Quadtree(null==n?defaultX:n,null==e?defaultY:e,NaN,NaN,NaN,NaN);return null==t?r:r.addAll(t)}function Quadtree(t,n,e,r,i,o){this._x=t,this._y=n,this._x0=e,this._y0=r,this._x1=i,this._y1=o,this._root=void 0;}function leaf_copy(t){for(var n={data:t.data},e=n;t=t.next;)e=e.next={data:t.data};return n}var treeProto=quadtree.prototype=Quadtree.prototype;function constant(t){return function(){return t}}function jiggle(){return 1e-6*(Math.random()-.5)}function x(t){return t.x+t.vx}function y(t){return t.y+t.vy}function collide(r){var o,a,_=1,u=1;function n(){for(var t,n,s,h,d,v,p,e=o.length,r=0;r<u;++r)for(n=quadtree(o,x,y).visitAfter(l),t=0;t<e;++t)s=o[t],v=a[s.index],p=v*v,h=s.x+s.vx,d=s.y+s.vy,n.visit(i);function i(t,n,e,r,i){var o=t.data,a=t.r,u=v+a;if(!o)return h+u<n||r<h-u||d+u<e||i<d-u;if(o.index>s.index){var l=h-o.x-o.vx,f=d-o.y-o.vy,c=l*l+f*f;c<u*u&&(0===l&&(c+=(l=jiggle())*l),0===f&&(c+=(f=jiggle())*f),c=(u-(c=Math.sqrt(c)))/c*_,s.vx+=(l*=c)*(u=(a*=a)/(p+a)),s.vy+=(f*=c)*u,o.vx-=l*(u=1-u),o.vy-=f*u);}}}function l(t){if(t.data)return t.r=a[t.data.index];for(var n=t.r=0;n<4;++n)t[n]&&t[n].r>t.r&&(t.r=t[n].r);}function e(){if(o){var t,n,e=o.length;for(a=new Array(e),t=0;t<e;++t)n=o[t],a[n.index]=+r(n,t,o);}}return "function"!=typeof r&&(r=constant(null==r?1:+r)),n.initialize=function(t){o=t,e();},n.iterations=function(t){return arguments.length?(u=+t,n):u},n.strength=function(t){return arguments.length?(_=+t,n):_},n.radius=function(t){return arguments.length?(r="function"==typeof t?t:constant(+t),e(),n):r},n}function index(t){return t.index}function find(t,n){var e=t.get(n);if(!e)throw new Error("node not found: "+n);return e}function link(s){var h,y,o,a,d,u=index,e=function(t){return 1/Math.min(a[t.source.index],a[t.target.index])},r=constant(30),v=1;function n(t){for(var n=0,e=s.length;n<v;++n)for(var r,i,o,a,u,l,f,c=0;c<e;++c)i=(r=s[c]).source,a=(o=r.target).x+o.vx-i.x-i.vx||jiggle(),u=o.y+o.vy-i.y-i.vy||jiggle(),a*=l=((l=Math.sqrt(a*a+u*u))-y[c])/l*t*h[c],u*=l,o.vx-=a*(f=d[c]),o.vy-=u*f,i.vx+=a*(f=1-f),i.vy+=u*f;}function i(){if(o){var t,n,e=o.length,r=s.length,i=new Map(o.map(function(t,n){return [u(t,n,o),t]}));for(t=0,a=new Array(e);t<r;++t)(n=s[t]).index=t,"object"!==(0, _typeof2.default)(n.source)&&(n.source=find(i,n.source)),"object"!==(0, _typeof2.default)(n.target)&&(n.target=find(i,n.target)),a[n.source.index]=(a[n.source.index]||0)+1,a[n.target.index]=(a[n.target.index]||0)+1;for(t=0,d=new Array(r);t<r;++t)n=s[t],d[t]=a[n.source.index]/(a[n.source.index]+a[n.target.index]);h=new Array(r),l(),y=new Array(r),f();}}function l(){if(o)for(var t=0,n=s.length;t<n;++t)h[t]=+e(s[t],t,s);}function f(){if(o)for(var t=0,n=s.length;t<n;++t)y[t]=+r(s[t],t,s);}return null==s&&(s=[]),n.initialize=function(t){o=t,i();},n.links=function(t){return arguments.length?(s=t,i(),n):s},n.id=function(t){return arguments.length?(u=t,n):u},n.iterations=function(t){return arguments.length?(v=+t,n):v},n.strength=function(t){return arguments.length?(e="function"==typeof t?t:constant(+t),l(),n):e},n.distance=function(t){return arguments.length?(r="function"==typeof t?t:constant(+t),f(),n):r},n}treeProto.copy=function(){var t,n,e=new Quadtree(this._x,this._y,this._x0,this._y0,this._x1,this._y1),r=this._root;if(!r)return e;if(!r.length)return e._root=leaf_copy(r),e;for(t=[{source:r,target:e._root=new Array(4)}];r=t.pop();)for(var i=0;i<4;++i)(n=r.source[i])&&(n.length?t.push({source:n,target:r.target[i]=new Array(4)}):r.target[i]=leaf_copy(n));return e},treeProto.add=tree_add,treeProto.addAll=addAll,treeProto.cover=tree_cover,treeProto.data=tree_data,treeProto.extent=tree_extent,treeProto.find=tree_find,treeProto.remove=tree_remove,treeProto.removeAll=removeAll,treeProto.root=tree_root,treeProto.size=tree_size,treeProto.visit=tree_visit,treeProto.visitAfter=tree_visitAfter,treeProto.x=tree_x,treeProto.y=tree_y;var noop={value:function(){}};function dispatch(){for(var t,n=0,e=arguments.length,r={};n<e;++n){if(!(t=arguments[n]+"")||t in r||/[\s.]/.test(t))throw new Error("illegal type: "+t);r[t]=[];}return new Dispatch(r)}function Dispatch(t){this._=t;}function parseTypenames(t,r){return t.trim().split(/^|\s+/).map(function(t){var n="",e=t.indexOf(".");if(0<=e&&(n=t.slice(e+1),t=t.slice(0,e)),t&&!r.hasOwnProperty(t))throw new Error("unknown type: "+t);return {type:t,name:n}})}function get(t,n){for(var e,r=0,i=t.length;r<i;++r)if((e=t[r]).name===n)return e.value}function set(t,n,e){for(var r=0,i=t.length;r<i;++r)if(t[r].name===n){t[r]=noop,t=t.slice(0,r).concat(t.slice(r+1));break}return null!=e&&t.push({name:n,value:e}),t}Dispatch.prototype=dispatch.prototype={constructor:Dispatch,on:function(t,n){var e,r=this._,i=parseTypenames(t+"",r),o=-1,a=i.length;if(!(arguments.length<2)){if(null!=n&&"function"!=typeof n)throw new Error("invalid callback: "+n);for(;++o<a;)if(e=(t=i[o]).type)r[e]=set(r[e],t.name,n);else if(null==n)for(e in r)r[e]=set(r[e],t.name,null);return this}for(;++o<a;)if((e=(t=i[o]).type)&&(e=get(r[e],t.name)))return e},copy:function(){var t={},n=this._;for(var e in n)t[e]=n[e].slice();return new Dispatch(t)},call:function(t,n){if(0<(e=arguments.length-2))for(var e,r,i=new Array(e),o=0;o<e;++o)i[o]=arguments[o+2];if(!this._.hasOwnProperty(t))throw new Error("unknown type: "+t);for(o=0,e=(r=this._[t]).length;o<e;++o)r[o].value.apply(n,i);},apply:function(t,n,e){if(!this._.hasOwnProperty(t))throw new Error("unknown type: "+t);for(var r=this._[t],i=0,o=r.length;i<o;++i)r[i].value.apply(n,e);}};var taskHead,taskTail,frame=0,timeout=0,interval=0,pokeDelay=1e3,clockLast=0,clockNow=0,clockSkew=0,clock="object"===("undefined"==typeof performance?"undefined":(0, _typeof2.default)(performance))&&performance.now?performance:Date,setFrame="object"===("undefined"==typeof window?"undefined":(0, _typeof2.default)(window))&&window.requestAnimationFrame?window.requestAnimationFrame.bind(window):function(t){setTimeout(t,17);};function now(){return clockNow||(setFrame(clearNow),clockNow=clock.now()+clockSkew)}function clearNow(){clockNow=0;}function Timer(){this._call=this._time=this._next=null;}function timer(t,n,e){var r=new Timer;return r.restart(t,n,e),r}function timerFlush(){now(),++frame;for(var t,n=taskHead;n;)0<=(t=clockNow-n._time)&&n._call.call(null,t),n=n._next;--frame;}function wake(){clockNow=(clockLast=clock.now())+clockSkew,frame=timeout=0;try{timerFlush();}finally{frame=0,nap(),clockNow=0;}}function poke(){var t=clock.now(),n=t-clockLast;pokeDelay<n&&(clockSkew-=n,clockLast=t);}function nap(){for(var t,n,e=taskHead,r=1/0;e;)e=e._call?(r>e._time&&(r=e._time),(t=e)._next):(n=e._next,e._next=null,t?t._next=n:taskHead=n);taskTail=t,sleep(r);}function sleep(t){frame||(timeout=timeout&&clearTimeout(timeout),24<t-clockNow?(t<1/0&&(timeout=setTimeout(wake,t-clock.now()-clockSkew)),interval=interval&&clearInterval(interval)):(interval||(clockLast=clock.now(),interval=setInterval(poke,pokeDelay)),frame=1,setFrame(wake)));}function x$1(t){return t.x}function y$1(t){return t.y}Timer.prototype=timer.prototype={constructor:Timer,restart:function(t,n,e){if("function"!=typeof t)throw new TypeError("callback is not a function");e=(null==e?now():+e)+(null==n?0:+n),this._next||taskTail===this||(taskTail?taskTail._next=this:taskHead=this,taskTail=this),this._call=t,this._time=e,sleep();},stop:function(){this._call&&(this._call=null,this._time=1/0,sleep());}};var initialRadius=10,initialAngle=Math.PI*(3-Math.sqrt(5));function simulation(c){var o,a=1,n=.001,u=1-Math.pow(n,1/300),l=0,f=.6,s=new Map,t=timer(r),e=dispatch("tick","end");function r(){i(),e.call("tick",o),a<n&&(t.stop(),e.call("end",o));}function i(t){var n,e,r=c.length;void 0===t&&(t=1);for(var i=0;i<t;++i)for(a+=(l-a)*u,s.forEach(function(t){t(a);}),n=0;n<r;++n)null==(e=c[n]).fx?e.x+=e.vx*=f:(e.x=e.fx,e.vx=0),null==e.fy?e.y+=e.vy*=f:(e.y=e.fy,e.vy=0);return o}function h(){for(var t,n=0,e=c.length;n<e;++n){if((t=c[n]).index=n,null!=t.fx&&(t.x=t.fx),null!=t.fy&&(t.y=t.fy),isNaN(t.x)||isNaN(t.y)){var r=initialRadius*Math.sqrt(n),i=n*initialAngle;t.x=r*Math.cos(i),t.y=r*Math.sin(i);}(isNaN(t.vx)||isNaN(t.vy))&&(t.vx=t.vy=0);}}function y(t){return t.initialize&&t.initialize(c),t}return null==c&&(c=[]),h(),o={tick:i,restart:function(){return t.restart(r),o},stop:function(){return t.stop(),o},nodes:function(t){return arguments.length?(c=t,h(),s.forEach(y),o):c},alpha:function(t){return arguments.length?(a=+t,o):a},alphaMin:function(t){return arguments.length?(n=+t,o):n},alphaDecay:function(t){return arguments.length?(u=+t,o):+u},alphaTarget:function(t){return arguments.length?(l=+t,o):l},velocityDecay:function(t){return arguments.length?(f=1-t,o):1-f},force:function(t,n){return 1<arguments.length?(null==n?s.delete(t):s.set(t,y(n)),o):s.get(t)},find:function(t,n,e){var r,i,o,a,u,l=0,f=c.length;for(null==e?e=1/0:e*=e,l=0;l<f;++l)(o=(r=t-(a=c[l]).x)*r+(i=n-a.y)*i)<e&&(u=a,e=o);return u},on:function(t,n){return 1<arguments.length?(e.on(t,n),o):e.on(t)}}}function manyBody(){var i,l,f,c,r=constant(-30),s=1,h=1/0,y=.81;function n(t){var n,e=i.length,r=quadtree(i,x$1,y$1).visitAfter(o);for(f=t,n=0;n<e;++n)l=i[n],r.visit(a);}function e(){if(i){var t,n,e=i.length;for(c=new Array(e),t=0;t<e;++t)n=i[t],c[n.index]=+r(n,t,i);}}function o(t){var n,e,r,i,o,a=0,u=0;if(t.length){for(r=i=o=0;o<4;++o)(n=t[o])&&(e=Math.abs(n.value))&&(a+=n.value,u+=e,r+=e*n.x,i+=e*n.y);t.x=r/u,t.y=i/u;}else for((n=t).x=n.data.x,n.y=n.data.y;a+=c[n.data.index],n=n.next;);t.value=a;}function a(t,n,e,r){if(!t.value)return !0;var i=t.x-l.x,o=t.y-l.y,a=r-n,u=i*i+o*o;if(a*a/y<u)return u<h&&(0===i&&(u+=(i=jiggle())*i),0===o&&(u+=(o=jiggle())*o),u<s&&(u=Math.sqrt(s*u)),l.vx+=i*t.value*f/u,l.vy+=o*t.value*f/u),!0;if(!(t.length||h<=u))for(t.data===l&&!t.next||(0===i&&(u+=(i=jiggle())*i),0===o&&(u+=(o=jiggle())*o),u<s&&(u=Math.sqrt(s*u)));t.data!==l&&(a=c[t.data.index]*f/u,l.vx+=i*a,l.vy+=o*a),t=t.next;);}return n.initialize=function(t){i=t,e();},n.strength=function(t){return arguments.length?(r="function"==typeof t?t:constant(+t),e(),n):r},n.distanceMin=function(t){return arguments.length?(s=t*t,n):Math.sqrt(s)},n.distanceMax=function(t){return arguments.length?(h=t*t,n):Math.sqrt(h)},n.theta=function(t){return arguments.length?(y=t*t,n):Math.sqrt(y)},n}function radial(e,l,f){var c,s,h,r=constant(.1);function n(t){for(var n=0,e=c.length;n<e;++n){var r=c[n],i=r.x-l||1e-6,o=r.y-f||1e-6,a=Math.sqrt(i*i+o*o),u=(h[n]-a)*s[n]*t/a;r.vx+=i*u,r.vy+=o*u;}}function i(){if(c){var t,n=c.length;for(s=new Array(n),h=new Array(n),t=0;t<n;++t)h[t]=+e(c[t],t,c),s[t]=isNaN(h[t])?0:+r(c[t],t,c);}}return "function"!=typeof e&&(e=constant(+e)),null==l&&(l=0),null==f&&(f=0),n.initialize=function(t){c=t,i();},n.strength=function(t){return arguments.length?(r="function"==typeof t?t:constant(+t),i(),n):r},n.radius=function(t){return arguments.length?(e="function"==typeof t?t:constant(+t),i(),n):e},n.x=function(t){return arguments.length?(l=+t,n):l},n.y=function(t){return arguments.length?(f=+t,n):f},n}function x$2(e){var i,o,a,r=constant(.1);function n(t){for(var n,e=0,r=i.length;e<r;++e)(n=i[e]).vx+=(a[e]-n.x)*o[e]*t;}function u(){if(i){var t,n=i.length;for(o=new Array(n),a=new Array(n),t=0;t<n;++t)o[t]=isNaN(a[t]=+e(i[t],t,i))?0:+r(i[t],t,i);}}return "function"!=typeof e&&(e=constant(null==e?0:+e)),n.initialize=function(t){i=t,u();},n.strength=function(t){return arguments.length?(r="function"==typeof t?t:constant(+t),u(),n):r},n.x=function(t){return arguments.length?(e="function"==typeof t?t:constant(+t),u(),n):e},n}function y$2(e){var i,o,a,r=constant(.1);function n(t){for(var n,e=0,r=i.length;e<r;++e)(n=i[e]).vy+=(a[e]-n.y)*o[e]*t;}function u(){if(i){var t,n=i.length;for(o=new Array(n),a=new Array(n),t=0;t<n;++t)o[t]=isNaN(a[t]=+e(i[t],t,i))?0:+r(i[t],t,i);}}return "function"!=typeof e&&(e=constant(null==e?0:+e)),n.initialize=function(t){i=t,u();},n.strength=function(t){return arguments.length?(r="function"==typeof t?t:constant(+t),u(),n):r},n.y=function(t){return arguments.length?(e="function"==typeof t?t:constant(+t),u(),n):e},n}
});

unwrapExports(force);
var force_1 = force.forceCenter;
var force_2 = force.forceCollide;
var force_3 = force.forceLink;
var force_4 = force.forceManyBody;
var force_5 = force.forceRadial;
var force_6 = force.forceSimulation;
var force_7 = force.forceX;
var force_8 = force.forceY;

var force_1$1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_assertThisInitialized2=interopRequireDefault(assertThisInitialized$1),_createClass2=interopRequireDefault(createClass$1),_inherits2=interopRequireDefault(inherits$1),_canvax=interopRequireDefault(Canvax),_index=interopRequireDefault(graphs),force$1=interopRequireWildcard(force),Rect=_canvax.default.Shapes.Rect,Path=_canvax.default.Shapes.Path,Arrow=_canvax.default.Shapes.Arrow,Circle=_canvax.default.Shapes.Circle,Text=_canvax.default.Display.Text,Line=_canvax.default.Shapes.Line,Force=function(e){function i(e,t){var a;return (0, _classCallCheck2.default)(this,i),(a=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(i).call(this,e,t))).type="force",index_es._.extend(!0,(0, _assertThisInitialized2.default)(a),(0, index_es.getDefaultProps)(i.defaultProps()),e),a.domContainer=t.canvax.domView,a.init(),a}return (0, _inherits2.default)(i,e),(0, _createClass2.default)(i,null,[{key:"defaultProps",value:function(){return {keyField:{detail:"key字段",default:"key"},valueField:{detail:"value字段",default:"value"},node:{detail:"单个节点的配置",propertys:{shapeType:{detail:"节点图形",default:"circle"},maxWidth:{detail:"节点最大的width",default:200},width:{detail:"内容的width",default:null},height:{detail:"内容的height",default:null},radius:{detail:"圆角角度",default:6},fillStyle:{detail:"节点背景色",default:"#acdf7d"},strokeStyle:{detail:"描边颜色",default:"#e5e5e5"},padding:{detail:"node节点容器到内容的边距",default:10},content:{detail:"节点内容配置",propertys:{field:{detail:"内容字段",documentation:"默认content字段",default:"content"},fontColor:{detail:"内容文本颜色",default:"#666"},format:{detail:"内容格式化处理函数",default:null},textAlign:{detail:"textAlign",default:"center"},textBaseline:{detail:"textBaseline",default:"middle"}}}}},line:{detail:"两个节点连线配置",propertys:{lineWidth:{detail:"线宽",default:1},strokeStyle:{detail:"连线的颜色",default:"#e5e5e5"},lineType:{detail:"连线样式（虚线等）",default:"solid"},arrow:{detail:"是否有箭头",default:!0}}},status:{detail:"一些开关配置",propertys:{transform:{detail:"是否启动拖拽缩放整个画布",propertys:{fitView:{detail:"自动缩放",default:""},enabled:{detail:"是否开启",default:!0},scale:{detail:"缩放值",default:1},scaleOrigin:{detail:"缩放原点",default:{x:0,y:0}}}}}}}}}]),(0, _createClass2.default)(i,[{key:"init",value:function(){this.nodesSp=new _canvax.default.Display.Sprite({id:"nodesSp"}),this.edgesSp=new _canvax.default.Display.Sprite({id:"edgesSp"}),this.graphsSp=new _canvax.default.Display.Sprite({id:"graphsSp"}),this.graphsSp.addChild(this.edgesSp),this.graphsSp.addChild(this.nodesSp),this.sprite.addChild(this.graphsSp);}},{key:"draw",value:function(e){e=e||{},index_es._.extend(!0,this,e),this.data=e.data||this._initData(),this.widget();}},{key:"_initData",value:function(){for(var e={nodes:[],edges:[],size:{width:this.app.width,height:this.app.height}},a={},t=0;t<this.dataFrame.length;t++){var i=this.dataFrame.getRowDataAt(t),l=index_es._.flatten([(i[this.keyField]+"").split(",")]),r=this._getContent(i),n=1==l.length?l[0]:l,d=new _canvax.default.Display.Sprite({id:"nodeSp_"+n});this.graphsSp.addChild(d);var o={type:"force",iNode:t,rowData:i,key:n,content:r,ctype:this._checkHtml(r)?"html":"canvas",element:d,width:null,height:null,radius:1,x:null,y:null,shapeType:null,source:null,target:null};1==l.length?(o.shapeType=this.getProp(this.node.shapeType,o),e.nodes.push(o),a[o.key]=o):(o.shapeType="line",e.edges.push(o));}return index_es._.each(e.edges,function(e){var t=e.key;e.source=a[t[0]],e.target=a[t[1]];}),e}},{key:"widget",value:function(){var l=this,r=this,t=this.keyField,a=this.valueField,e=this.data.edges.map(function(e){return {source:e.source[t],target:e.target[t],value:e.rowData[a],nodeData:e}}),i=this.data.nodes.map(function(e){var t=Object.create(e);return t.id=e.key,t.nodeData=e,t}),n=this.data.size,d=n.width,o=n.height,s=force$1.forceSimulation(i).force("link",force$1.forceLink(e).id(function(e){return e.id})).force("charge",force$1.forceManyBody()).force("center",force$1.forceCenter(d/2,o/2)).force("x",force$1.forceX(d/2).strength(.045)).force("y",force$1.forceY(o/2).strength(.045));i.forEach(function(e){var t=r.getProp(r.node.fillStyle,e.nodeData),a=r.getProp(r.node.strokeStyle,e.nodeData),i=new Circle({context:{r:8,fillStyle:t,strokeStyle:a}});e.nodeData.element.addChild(i);var l=new Text(e.nodeData.rowData.label,{context:{fontSize:11,fillStyle:"#bfa08b",textBaseline:"middle",textAlign:"center",globalAlpha:.7}});e.nodeData.element.addChild(l);}),e.forEach(function(e){var t=r.getProp(r.line.lineWidth,e.nodeData),a=r.getProp(r.line.strokeStyle,e.nodeData),i=new Line({context:{lineWidth:t,strokeStyle:a,start:{x:0,y:0},end:{x:0,y:0},globalAlpha:.4}});l.edgesSp.addChild(i),e.line=i;}),s.on("tick",function(){s.alpha()<=.05?s.stop():(i.forEach(function(e){var t=e.nodeData.element.context;t&&(t.x=e.x,t.y=e.y);}),e.forEach(function(e){var t=e.line.context;t&&(t.start.x=e.source.x,t.start.y=e.source.y,t.end.x=e.target.x,t.end.y=e.target.y);}));});}},{key:"_checkHtml",value:function(e){return /<[^>]+>/g.test(e)}},{key:"_getContent",value:function(e){var t;return this._isField(this.node.content.field)&&(t=e[this.node.content.field]),this.node.content.format&&index_es._.isFunction(this.node.content.format)&&(t=this.node.content.format.apply(this,[t,e])),t}},{key:"_isField",value:function(e){return ~this.dataFrame.fields.indexOf(e)}},{key:"getNodesAt",value:function(){}},{key:"getProp",value:function(e,t){var a=e;return this._isField(e)&&t.rowData?a=t.rowData[e]:(index_es._.isArray(e)&&(a=e[t.iNode]),index_es._.isFunction(e)&&(a=e.apply(this,[t]))),a}}]),i}(_index.default);index_es.global.registerComponent(Force,"graphs","force");var _default=Force;exports.default=_default;
});

unwrapExports(force_1$1);

var dagre = createCommonjsModule(function (module, exports) {
var _typeof2=interopRequireDefault(_typeof_1$1);!function(e){if("object"===((0, _typeof2.default)(exports))&&"undefined"!='object')module.exports=e();else {("undefined"!=typeof window?window:"undefined"!=typeof commonjsGlobal?commonjsGlobal:"undefined"!=typeof self?self:this).dagre=e();}}(function(){return function a(i,s,u){function c(t,e){if(!s[t]){if(!i[t]){var r="function"==typeof commonjsRequire&&commonjsRequire;if(!e&&r)return r(t,!0);if(f)return f(t,!0);var n=new Error("Cannot find module '"+t+"'");throw n.code="MODULE_NOT_FOUND",n}var o=s[t]={exports:{}};i[t][0].call(o.exports,function(e){return c(i[t][1][e]||e)},o,o.exports,a,i,s,u);}return s[t].exports}for(var f="function"==typeof commonjsRequire&&commonjsRequire,e=0;e<u.length;e++)c(u[e]);return c}({1:[function(e,t,r){t.exports={graphlib:e("./lib/graphlib"),layout:e("./lib/layout"),debug:e("./lib/debug"),util:{time:e("./lib/util").time,notime:e("./lib/util").notime},version:e("./lib/version")};},{"./lib/debug":6,"./lib/graphlib":7,"./lib/layout":9,"./lib/util":29,"./lib/version":30}],2:[function(e,t,r){var i=e("./lodash"),n=e("./greedy-fas");t.exports={run:function(r){var e="greedy"===r.graph().acyclicer?n(r,function(t){return function(e){return t.edge(e).weight}}(r)):function(r){var n=[],o={},a={};return i.forEach(r.nodes(),function t(e){if(i.has(a,e))return;a[e]=!0;o[e]=!0;i.forEach(r.outEdges(e),function(e){i.has(o,e.w)?n.push(e):t(e.w);});delete o[e];}),n}(r);i.forEach(e,function(e){var t=r.edge(e);r.removeEdge(e),t.forwardName=e.name,t.reversed=!0,r.setEdge(e.w,e.v,t,i.uniqueId("rev"));});},undo:function(n){i.forEach(n.edges(),function(e){var t=n.edge(e);if(t.reversed){n.removeEdge(e);var r=t.forwardName;delete t.reversed,delete t.forwardName,n.setEdge(e.w,e.v,t,r);}});}};},{"./greedy-fas":8,"./lodash":10}],3:[function(e,t,r){var s=e("./lodash"),c=e("./util");function u(e,t,r,n,o,a){var i={width:0,height:0,rank:a,borderType:t},s=o[t][a-1],u=c.addDummyNode(e,"border",i,r);o[t][a]=u,e.setParent(u,n),s&&e.setEdge(s,u,{weight:1});}t.exports=function(i){s.forEach(i.children(),function e(t){var r=i.children(t),n=i.node(t);if(r.length&&s.forEach(r,e),s.has(n,"minRank")){n.borderLeft=[],n.borderRight=[];for(var o=n.minRank,a=n.maxRank+1;o<a;++o)u(i,"borderLeft","_bl",t,n,o),u(i,"borderRight","_br",t,n,o);}});};},{"./lodash":10,"./util":29}],4:[function(e,t,r){var n=e("./lodash");function o(t){n.forEach(t.nodes(),function(e){a(t.node(e));}),n.forEach(t.edges(),function(e){a(t.edge(e));});}function a(e){var t=e.width;e.width=e.height,e.height=t;}function i(e){e.y=-e.y;}function s(e){var t=e.x;e.x=e.y,e.y=t;}t.exports={adjust:function(e){var t=e.graph().rankdir.toLowerCase();"lr"!==t&&"rl"!==t||o(e);},undo:function(e){var t=e.graph().rankdir.toLowerCase();"bt"!==t&&"rl"!==t||function(r){n.forEach(r.nodes(),function(e){i(r.node(e));}),n.forEach(r.edges(),function(e){var t=r.edge(e);n.forEach(t.points,i),n.has(t,"y")&&i(t);});}(e);"lr"!==t&&"rl"!==t||(function(r){n.forEach(r.nodes(),function(e){s(r.node(e));}),n.forEach(r.edges(),function(e){var t=r.edge(e);n.forEach(t.points,s),n.has(t,"x")&&s(t);});}(e),o(e));}};},{"./lodash":10}],5:[function(e,t,r){function n(){var e={};e._next=e._prev=e,this._sentinel=e;}function o(e){e._prev._next=e._next,e._next._prev=e._prev,delete e._next,delete e._prev;}function a(e,t){if("_next"!==e&&"_prev"!==e)return t}(t.exports=n).prototype.dequeue=function(){var e=this._sentinel,t=e._prev;if(t!==e)return o(t),t},n.prototype.enqueue=function(e){var t=this._sentinel;e._prev&&e._next&&o(e),e._next=t._next,t._next._prev=e,(t._next=e)._prev=t;},n.prototype.toString=function(){for(var e=[],t=this._sentinel,r=t._prev;r!==t;)e.push(JSON.stringify(r,a)),r=r._prev;return "["+e.join(", ")+"]"};},{}],6:[function(e,t,r){var o=e("./lodash"),a=e("./util"),i=e("./graphlib").Graph;t.exports={debugOrdering:function(t){var e=a.buildLayerMatrix(t),n=new i({compound:!0,multigraph:!0}).setGraph({});return o.forEach(t.nodes(),function(e){n.setNode(e,{label:e}),n.setParent(e,"layer"+t.node(e).rank);}),o.forEach(t.edges(),function(e){n.setEdge(e.v,e.w,{},e.name);}),o.forEach(e,function(e,t){var r="layer"+t;n.setNode(r,{rank:"same"}),o.reduce(e,function(e,t){return n.setEdge(e,t,{style:"invis"}),t});}),n}};},{"./graphlib":7,"./lodash":10,"./util":29}],7:[function(e,t,r){var n;if("function"==typeof e)try{n=e("graphlib");}catch(e){}n=n||window.graphlib,t.exports=n;},{graphlib:31}],8:[function(e,t,r){var u=e("./lodash"),c=e("./graphlib").Graph,f=e("./data/list");t.exports=function(t,e){if(t.nodeCount()<=1)return [];var r=function(e,o){var a=new c,i=0,s=0;u.forEach(e.nodes(),function(e){a.setNode(e,{v:e,in:0,out:0});}),u.forEach(e.edges(),function(e){var t=a.edge(e.v,e.w)||0,r=o(e),n=t+r;a.setEdge(e.v,e.w,n),s=Math.max(s,a.node(e.v).out+=r),i=Math.max(i,a.node(e.w).in+=r);});var t=u.range(s+i+3).map(function(){return new f}),r=i+1;return u.forEach(a.nodes(),function(e){l(t,r,a.node(e));}),{graph:a,buckets:t,zeroIdx:r}}(t,e||o),n=function(e,t,r){var n,o=[],a=t[t.length-1],i=t[0];for(;e.nodeCount();){for(;n=i.dequeue();)d(e,t,r,n);for(;n=a.dequeue();)d(e,t,r,n);if(e.nodeCount())for(var s=t.length-2;0<s;--s)if(n=t[s].dequeue()){o=o.concat(d(e,t,r,n,!0));break}}return o}(r.graph,r.buckets,r.zeroIdx);return u.flatten(u.map(n,function(e){return t.outEdges(e.v,e.w)}),!0)};var o=u.constant(1);function d(o,a,i,e,n){var s=n?[]:void 0;return u.forEach(o.inEdges(e.v),function(e){var t=o.edge(e),r=o.node(e.v);n&&s.push({v:e.v,w:e.w}),r.out-=t,l(a,i,r);}),u.forEach(o.outEdges(e.v),function(e){var t=o.edge(e),r=e.w,n=o.node(r);n.in-=t,l(a,i,n);}),o.removeNode(e.v),s}function l(e,t,r){r.out?r.in?e[r.out-r.in+t].enqueue(r):e[e.length-1].enqueue(r):e[0].enqueue(r);}},{"./data/list":5,"./graphlib":7,"./lodash":10}],9:[function(e,t,r){var f=e("./lodash"),n=e("./acyclic"),o=e("./normalize"),i=e("./rank"),s=e("./util").normalizeRanks,u=e("./parent-dummy-chains"),d=e("./util").removeEmptyRanks,l=e("./nesting-graph"),h=e("./add-border-segments"),p=e("./coordinate-system"),_=e("./order"),v=e("./position"),g=e("./util"),c=e("./graphlib").Graph;t.exports=function(a,e){var r=e&&e.debugTiming?g.time:g.notime;r("layout",function(){var t=r("  buildLayoutGraph",function(){return r=a,n=new c({multigraph:!0,compound:!0}),e=O(r.graph()),n.setGraph(f.merge({},b,A(e,y),f.pick(e,m))),f.forEach(r.nodes(),function(e){var t=O(r.node(e));n.setNode(e,f.defaults(A(t,x),w)),n.setParent(e,r.parent(e));}),f.forEach(r.edges(),function(e){var t=O(r.edge(e));n.setEdge(e,f.merge({},j,A(t,E),f.pick(t,k)));}),n;var r,n,e;});r("  runLayout",function(){var c,e;c=t,(e=r)("    makeSpaceForEdgeLabels",function(){var r,n;(n=(r=c).graph()).ranksep/=2,f.forEach(r.edges(),function(e){var t=r.edge(e);t.minlen*=2,"c"!==t.labelpos.toLowerCase()&&("TB"===n.rankdir||"BT"===n.rankdir?t.width+=t.labeloffset:t.height+=t.labeloffset);});}),e("    removeSelfEdges",function(){var r;r=c,f.forEach(r.edges(),function(e){if(e.v===e.w){var t=r.node(e.v);t.selfEdges||(t.selfEdges=[]),t.selfEdges.push({e:e,label:r.edge(e)}),r.removeEdge(e);}});}),e("    acyclic",function(){n.run(c);}),e("    nestingGraph.run",function(){l.run(c);}),e("    rank",function(){i(g.asNonCompoundGraph(c));}),e("    injectEdgeLabelProxies",function(){var o;o=c,f.forEach(o.edges(),function(e){var t=o.edge(e);if(t.width&&t.height){var r=o.node(e.v),n={rank:(o.node(e.w).rank-r.rank)/2+r.rank,e:e};g.addDummyNode(o,"edge-proxy",n,"_ep");}});}),e("    removeEmptyRanks",function(){d(c);}),e("    nestingGraph.cleanup",function(){l.cleanup(c);}),e("    normalizeRanks",function(){s(c);}),e("    assignRankMinMax",function(){var r,n;r=c,n=0,f.forEach(r.nodes(),function(e){var t=r.node(e);t.borderTop&&(t.minRank=r.node(t.borderTop).rank,t.maxRank=r.node(t.borderBottom).rank,n=f.max(n,t.maxRank));}),r.graph().maxRank=n;}),e("    removeEdgeLabelProxies",function(){var r;r=c,f.forEach(r.nodes(),function(e){var t=r.node(e);"edge-proxy"===t.dummy&&(r.edge(t.e).labelRank=t.rank,r.removeNode(e));});}),e("    normalize.run",function(){o.run(c);}),e("    parentDummyChains",function(){u(c);}),e("    addBorderSegments",function(){h(c);}),e("    order",function(){_(c);}),e("    insertSelfEdges",function(){var o,e;o=c,e=g.buildLayerMatrix(o),f.forEach(e,function(e){var n=0;f.forEach(e,function(e,t){var r=o.node(e);r.order=t+n,f.forEach(r.selfEdges,function(e){g.addDummyNode(o,"selfedge",{width:e.label.width,height:e.label.height,rank:r.rank,order:t+ ++n,e:e.e,label:e.label},"_se");}),delete r.selfEdges;});});}),e("    adjustCoordinateSystem",function(){p.adjust(c);}),e("    position",function(){v(c);}),e("    positionSelfEdges",function(){var s;s=c,f.forEach(s.nodes(),function(e){var t=s.node(e);if("selfedge"===t.dummy){var r=s.node(t.e.v),n=r.x+r.width/2,o=r.y,a=t.x-n,i=r.height/2;s.setEdge(t.e,t.label),s.removeNode(e),t.label.points=[{x:n+2*a/3,y:o-i},{x:n+5*a/6,y:o-i},{x:n+a,y:o},{x:n+5*a/6,y:o+i},{x:n+2*a/3,y:o+i}],t.label.x=t.x,t.label.y=t.y;}});}),e("    removeBorderNodes",function(){var i;i=c,f.forEach(i.nodes(),function(e){if(i.children(e).length){var t=i.node(e),r=i.node(t.borderTop),n=i.node(t.borderBottom),o=i.node(f.last(t.borderLeft)),a=i.node(f.last(t.borderRight));t.width=Math.abs(a.x-o.x),t.height=Math.abs(n.y-r.y),t.x=o.x+t.width/2,t.y=r.y+t.height/2;}}),f.forEach(i.nodes(),function(e){"border"===i.node(e).dummy&&i.removeNode(e);});}),e("    normalize.undo",function(){o.undo(c);}),e("    fixupEdgeLabelCoords",function(){var r;r=c,f.forEach(r.edges(),function(e){var t=r.edge(e);if(f.has(t,"x"))switch("l"!==t.labelpos&&"r"!==t.labelpos||(t.width-=t.labeloffset),t.labelpos){case"l":t.x-=t.width/2+t.labeloffset;break;case"r":t.x+=t.width/2+t.labeloffset;}});}),e("    undoCoordinateSystem",function(){p.undo(c);}),e("    translateGraph",function(){function r(e){var t=e.x,r=e.y,n=e.width,o=e.height;a=Math.min(a,t-n/2),i=Math.max(i,t+n/2),s=Math.min(s,r-o/2),u=Math.max(u,r+o/2);}var n,a,i,s,u,e,t,o;n=c,a=Number.POSITIVE_INFINITY,i=0,s=Number.POSITIVE_INFINITY,u=0,e=n.graph(),t=e.marginx||0,o=e.marginy||0,f.forEach(n.nodes(),function(e){r(n.node(e));}),f.forEach(n.edges(),function(e){var t=n.edge(e);f.has(t,"x")&&r(t);}),a-=t,s-=o,f.forEach(n.nodes(),function(e){var t=n.node(e);t.x-=a,t.y-=s;}),f.forEach(n.edges(),function(e){var t=n.edge(e);f.forEach(t.points,function(e){e.x-=a,e.y-=s;}),f.has(t,"x")&&(t.x-=a),f.has(t,"y")&&(t.y-=s);}),e.width=i-a+t,e.height=u-s+o;}),e("    assignNodeIntersects",function(){var i;i=c,f.forEach(i.edges(),function(e){var t,r,n=i.edge(e),o=i.node(e.v),a=i.node(e.w);r=n.points?(t=n.points[0],n.points[n.points.length-1]):(n.points=[],t=a,o),n.points.unshift(g.intersectRect(o,t)),n.points.push(g.intersectRect(a,r));});}),e("    reversePoints",function(){var r;r=c,f.forEach(r.edges(),function(e){var t=r.edge(e);t.reversed&&t.points.reverse();});}),e("    acyclic.undo",function(){n.undo(c);});}),r("  updateInputGraph",function(){var n,o;n=a,o=t,f.forEach(n.nodes(),function(e){var t=n.node(e),r=o.node(e);t&&(t.x=r.x,t.y=r.y,o.children(e).length&&(t.width=r.width,t.height=r.height));}),f.forEach(n.edges(),function(e){var t=n.edge(e),r=o.edge(e);t.points=r.points,f.has(r,"x")&&(t.x=r.x,t.y=r.y);}),n.graph().width=o.graph().width,n.graph().height=o.graph().height;});});};var y=["nodesep","edgesep","ranksep","marginx","marginy"],b={ranksep:50,edgesep:20,nodesep:50,rankdir:"tb"},m=["acyclicer","ranker","rankdir","align"],x=["width","height"],w={width:0,height:0},E=["minlen","weight","width","height","labeloffset"],j={minlen:1,weight:1,width:0,height:0,labeloffset:10,labelpos:"r"},k=["labelpos"];function A(e,t){return f.mapValues(f.pick(e,t),Number)}function O(e){var r={};return f.forEach(e,function(e,t){r[t.toLowerCase()]=e;}),r}},{"./acyclic":2,"./add-border-segments":3,"./coordinate-system":4,"./graphlib":7,"./lodash":10,"./nesting-graph":11,"./normalize":12,"./order":17,"./parent-dummy-chains":22,"./position":24,"./rank":26,"./util":29}],10:[function(e,t,r){var n;if("function"==typeof e)try{n={cloneDeep:e("lodash/cloneDeep"),constant:e("lodash/constant"),defaults:e("lodash/defaults"),each:e("lodash/each"),filter:e("lodash/filter"),find:e("lodash/find"),flatten:e("lodash/flatten"),forEach:e("lodash/forEach"),forIn:e("lodash/forIn"),has:e("lodash/has"),isUndefined:e("lodash/isUndefined"),last:e("lodash/last"),map:e("lodash/map"),mapValues:e("lodash/mapValues"),max:e("lodash/max"),merge:e("lodash/merge"),min:e("lodash/min"),minBy:e("lodash/minBy"),now:e("lodash/now"),pick:e("lodash/pick"),range:e("lodash/range"),reduce:e("lodash/reduce"),sortBy:e("lodash/sortBy"),uniqueId:e("lodash/uniqueId"),values:e("lodash/values"),zipObject:e("lodash/zipObject")};}catch(e){}n=n||window._,t.exports=n;},{"lodash/cloneDeep":227,"lodash/constant":228,"lodash/defaults":229,"lodash/each":230,"lodash/filter":232,"lodash/find":233,"lodash/flatten":235,"lodash/forEach":236,"lodash/forIn":237,"lodash/has":239,"lodash/isUndefined":258,"lodash/last":261,"lodash/map":262,"lodash/mapValues":263,"lodash/max":264,"lodash/merge":266,"lodash/min":267,"lodash/minBy":268,"lodash/now":270,"lodash/pick":271,"lodash/range":273,"lodash/reduce":274,"lodash/sortBy":276,"lodash/uniqueId":286,"lodash/values":287,"lodash/zipObject":288}],11:[function(e,t,r){var v=e("./lodash"),g=e("./util");t.exports={run:function(t){var r=g.addDummyNode(t,"root",{},"_root"),n=function(o){var a={};return v.forEach(o.children(),function(e){!function t(e,r){var n=o.children(e);n&&n.length&&v.forEach(n,function(e){t(e,r+1);});a[e]=r;}(e,1);}),a}(t),o=v.max(v.values(n))-1,a=2*o+1;t.graph().nestingRoot=r,v.forEach(t.edges(),function(e){t.edge(e).minlen*=a;});var i=function(r){return v.reduce(r.edges(),function(e,t){return e+r.edge(t).weight},0)}(t)+1;v.forEach(t.children(),function(e){!function i(s,u,c,f,d,l,h){var e=s.children(h);if(!e.length)return void(h!==u&&s.setEdge(u,h,{weight:0,minlen:c}));var p=g.addBorderNode(s,"_bt"),_=g.addBorderNode(s,"_bb"),t=s.node(h);s.setParent(p,h);t.borderTop=p;s.setParent(_,h);t.borderBottom=_;v.forEach(e,function(e){i(s,u,c,f,d,l,e);var t=s.node(e),r=t.borderTop?t.borderTop:e,n=t.borderBottom?t.borderBottom:e,o=t.borderTop?f:2*f,a=r!==n?1:d-l[h]+1;s.setEdge(p,r,{weight:o,minlen:a,nestingEdge:!0}),s.setEdge(n,_,{weight:o,minlen:a,nestingEdge:!0});});s.parent(h)||s.setEdge(u,p,{weight:0,minlen:d+l[h]});}(t,r,a,i,o,n,e);}),t.graph().nodeRankFactor=a;},cleanup:function(t){var e=t.graph();t.removeNode(e.nestingRoot),delete e.nestingRoot,v.forEach(t.edges(),function(e){t.edge(e).nestingEdge&&t.removeEdge(e);});}};},{"./lodash":10,"./util":29}],12:[function(e,t,r){var n=e("./lodash"),l=e("./util");t.exports={run:function(t){t.graph().dummyChains=[],n.forEach(t.edges(),function(e){!function(e,t){var r,n,o,a=t.v,i=e.node(a).rank,s=t.w,u=e.node(s).rank,c=t.name,f=e.edge(t),d=f.labelRank;if(u===i+1)return;for(e.removeEdge(t),o=0,++i;i<u;++o,++i)f.points=[],n={width:0,height:0,edgeLabel:f,edgeObj:t,rank:i},r=l.addDummyNode(e,"edge",n,"_d"),i===d&&(n.width=f.width,n.height=f.height,n.dummy="edge-label",n.labelpos=f.labelpos),e.setEdge(a,r,{weight:f.weight},c),0===o&&e.graph().dummyChains.push(r),a=r;e.setEdge(a,s,{weight:f.weight},c);}(t,e);});},undo:function(o){n.forEach(o.graph().dummyChains,function(e){var t,r=o.node(e),n=r.edgeLabel;for(o.setEdge(r.edgeObj,n);r.dummy;)t=o.successors(e)[0],o.removeNode(e),n.points.push({x:r.x,y:r.y}),"edge-label"===r.dummy&&(n.x=r.x,n.y=r.y,n.width=r.width,n.height=r.height),e=t,r=o.node(e);});}};},{"./lodash":10,"./util":29}],13:[function(e,t,r){var n=e("../lodash");t.exports=function(o,a,e){var i,s={};n.forEach(e,function(e){for(var t,r,n=o.parent(e);n;){if((t=o.parent(n))?(r=s[t],s[t]=n):(r=i,i=n),r&&r!==n)return void a.setEdge(r,n);n=t;}});};},{"../lodash":10}],14:[function(e,t,r){var n=e("../lodash");t.exports=function(o,e){return n.map(e,function(e){var t=o.inEdges(e);if(t.length){var r=n.reduce(t,function(e,t){var r=o.edge(t),n=o.node(t.v);return {sum:e.sum+r.weight*n.order,weight:e.weight+r.weight}},{sum:0,weight:0});return {v:e,barycenter:r.sum/r.weight,weight:r.weight}}return {v:e}})};},{"../lodash":10}],15:[function(e,t,r){var u=e("../lodash"),o=e("../graphlib").Graph;t.exports=function(a,r,n){var i=function(e){var t;for(;e.hasNode(t=u.uniqueId("_root")););return t}(a),s=new o({compound:!0}).setGraph({root:i}).setDefaultNodeLabel(function(e){return a.node(e)});return u.forEach(a.nodes(),function(o){var e=a.node(o),t=a.parent(o);(e.rank===r||e.minRank<=r&&r<=e.maxRank)&&(s.setNode(o),s.setParent(o,t||i),u.forEach(a[n](o),function(e){var t=e.v===o?e.w:e.v,r=s.edge(t,o),n=u.isUndefined(r)?0:r.weight;s.setEdge(t,o,{weight:a.edge(e).weight+n});}),u.has(e,"minRank")&&s.setNode(o,{borderLeft:e.borderLeft[r],borderRight:e.borderRight[r]}));}),s};},{"../graphlib":7,"../lodash":10}],16:[function(e,t,r){var c=e("../lodash");function o(t,e,r){for(var n=c.zipObject(r,c.map(r,function(e,t){return t})),o=c.flatten(c.map(e,function(e){return c.sortBy(c.map(t.outEdges(e),function(e){return {pos:n[e.w],weight:t.edge(e).weight}}),"pos")}),!0),a=1;a<r.length;)a<<=1;var i=2*a-1;--a;var s=c.map(new Array(i),function(){return 0}),u=0;return c.forEach(o.forEach(function(e){var t=e.pos+a;s[t]+=e.weight;for(var r=0;0<t;)t%2&&(r+=s[t+1]),s[t=t-1>>1]+=e.weight;u+=e.weight*r;})),u}t.exports=function(e,t){for(var r=0,n=1;n<t.length;++n)r+=o(e,t[n-1],t[n]);return r};},{"../lodash":10}],17:[function(e,t,r){var f=e("../lodash"),d=e("./init-order"),l=e("./cross-count"),a=e("./sort-subgraph"),n=e("./build-layer-graph"),i=e("./add-subgraph-constraints"),s=e("../graphlib").Graph,h=e("../util");function p(t,e,r){return f.map(e,function(e){return n(t,e,r)})}function _(e,n){var o=new s;f.forEach(e,function(r){var e=r.graph().root,t=a(r,e,o,n);f.forEach(t.vs,function(e,t){r.node(e).order=t;}),i(r,o,t.vs);});}function v(r,e){f.forEach(e,function(e){f.forEach(e,function(e,t){r.node(e).order=t;});});}t.exports=function(e){var t=h.maxRank(e),r=p(e,f.range(1,t+1),"inEdges"),n=p(e,f.range(t-1,-1,-1),"outEdges"),o=d(e);v(e,o);for(var a,i=Number.POSITIVE_INFINITY,s=0,u=0;u<4;++s,++u){_(s%2?r:n,2<=s%4),o=h.buildLayerMatrix(e);var c=l(e,o);c<i&&(u=0,a=f.cloneDeep(o),i=c);}v(e,a);};},{"../graphlib":7,"../lodash":10,"../util":29,"./add-subgraph-constraints":13,"./build-layer-graph":15,"./cross-count":16,"./init-order":18,"./sort-subgraph":20}],18:[function(e,t,r){var i=e("../lodash");t.exports=function(n){var o={},e=i.filter(n.nodes(),function(e){return !n.children(e).length}),t=i.max(i.map(e,function(e){return n.node(e).rank})),a=i.map(i.range(t+1),function(){return []});var r=i.sortBy(e,function(e){return n.node(e).rank});return i.forEach(r,function e(t){if(i.has(o,t))return;o[t]=!0;var r=n.node(t);a[r.rank].push(t);i.forEach(n.successors(t),e);}),a};},{"../lodash":10}],19:[function(e,t,r){var a=e("../lodash");t.exports=function(e,t){var n={};return a.forEach(e,function(e,t){var r=n[e.v]={indegree:0,in:[],out:[],vs:[e.v],i:t};a.isUndefined(e.barycenter)||(r.barycenter=e.barycenter,r.weight=e.weight);}),a.forEach(t.edges(),function(e){var t=n[e.v],r=n[e.w];a.isUndefined(t)||a.isUndefined(r)||(r.indegree++,t.out.push(n[e.w]));}),function(r){var e=[];function t(t){return function(e){e.merged||(a.isUndefined(e.barycenter)||a.isUndefined(t.barycenter)||e.barycenter>=t.barycenter)&&function(e,t){var r=0,n=0;e.weight&&(r+=e.barycenter*e.weight,n+=e.weight);t.weight&&(r+=t.barycenter*t.weight,n+=t.weight);e.vs=t.vs.concat(e.vs),e.barycenter=r/n,e.weight=n,e.i=Math.min(t.i,e.i),t.merged=!0;}(t,e);}}function n(t){return function(e){e.in.push(t),0==--e.indegree&&r.push(e);}}for(;r.length;){var o=r.pop();e.push(o),a.forEach(o.in.reverse(),t(o)),a.forEach(o.out,n(o));}return a.map(a.filter(e,function(e){return !e.merged}),function(e){return a.pick(e,["vs","i","barycenter","weight"])})}(a.filter(n,function(e){return !e.indegree}))};},{"../lodash":10}],20:[function(e,t,r){var g=e("../lodash"),y=e("./barycenter"),b=e("./resolve-conflicts"),m=e("./sort");function x(e,t){g.isUndefined(e.barycenter)?(e.barycenter=t.barycenter,e.weight=t.weight):(e.barycenter=(e.barycenter*e.weight+t.barycenter*t.weight)/(e.weight+t.weight),e.weight+=t.weight);}t.exports=function r(n,e,o,a){var t=n.children(e),i=n.node(e),s=i?i.borderLeft:void 0,u=i?i.borderRight:void 0,c={};s&&(t=g.filter(t,function(e){return e!==s&&e!==u}));var f=y(n,t);g.forEach(f,function(e){if(n.children(e.v).length){var t=r(n,e.v,o,a);c[e.v]=t,g.has(t,"barycenter")&&x(e,t);}});var d=b(f,o);l=d,h=c,g.forEach(l,function(e){e.vs=g.flatten(e.vs.map(function(e){return h[e]?h[e].vs:e}),!0);});var l,h;var p=m(d,a);if(s&&(p.vs=g.flatten([s,p.vs,u],!0),n.predecessors(s).length)){var _=n.node(n.predecessors(s)[0]),v=n.node(n.predecessors(u)[0]);g.has(p,"barycenter")||(p.barycenter=0,p.weight=0),p.barycenter=(p.barycenter*p.weight+_.order+v.order)/(p.weight+2),p.weight+=2;}return p};},{"../lodash":10,"./barycenter":14,"./resolve-conflicts":19,"./sort":21}],21:[function(e,t,r){var f=e("../lodash"),d=e("../util");function l(e,t,r){for(var n;t.length&&(n=f.last(t)).i<=r;)t.pop(),e.push(n.vs),r++;return r}t.exports=function(e,t){var r=d.partition(e,function(e){return f.has(e,"barycenter")}),n=r.lhs,o=f.sortBy(r.rhs,function(e){return -e.i}),a=[],i=0,s=0,u=0;n.sort(function(r){return function(e,t){return e.barycenter<t.barycenter?-1:e.barycenter>t.barycenter?1:r?t.i-e.i:e.i-t.i}}(!!t)),u=l(a,o,u),f.forEach(n,function(e){u+=e.vs.length,a.push(e.vs),i+=e.barycenter*e.weight,s+=e.weight,u=l(a,o,u);});var c={vs:f.flatten(a,!0)};s&&(c.barycenter=i/s,c.weight=s);return c};},{"../lodash":10,"../util":29}],22:[function(e,t,r){var i=e("./lodash");t.exports=function(c){var f=function(n){var o={},a=0;return i.forEach(n.children(),function e(t){var r=a;i.forEach(n.children(t),e);o[t]={low:r,lim:a++};}),o}(c);i.forEach(c.graph().dummyChains,function(e){for(var t=c.node(e),r=t.edgeObj,n=function(e,t,r,n){var o,a,i=[],s=[],u=Math.min(t[r].low,t[n].low),c=Math.max(t[r].lim,t[n].lim);o=r;for(;o=e.parent(o),i.push(o),o&&(t[o].low>u||c>t[o].lim););a=o,o=n;for(;(o=e.parent(o))!==a;)s.push(o);return {path:i.concat(s.reverse()),lca:a}}(c,f,r.v,r.w),o=n.path,a=n.lca,i=0,s=o[i],u=!0;e!==r.w;){if(t=c.node(e),u){for(;(s=o[i])!==a&&c.node(s).maxRank<t.rank;)i++;s===a&&(u=!1);}if(!u){for(;i<o.length-1&&c.node(s=o[i+1]).minRank<=t.rank;)i++;s=o[i];}c.setParent(e,s),e=c.successors(e)[0];}});};},{"./lodash":10}],23:[function(e,t,r){var v=e("../lodash"),g=e("../graphlib").Graph,n=e("../util");function o(c,e){var f={};return v.reduce(e,function(e,n){var a=0,i=0,s=e.length,u=v.last(n);return v.forEach(n,function(e,t){var r=function(t,e){if(t.node(e).dummy)return v.find(t.predecessors(e),function(e){return t.node(e).dummy})}(c,e),o=r?c.node(r).order:s;!r&&e!==u||(v.forEach(n.slice(i,t+1),function(n){v.forEach(c.predecessors(n),function(e){var t=c.node(e),r=t.order;!(r<a||o<r)||t.dummy&&c.node(n).dummy||d(f,e,n);});}),i=t+1,a=o);}),n}),f}function c(u,e){var i={};function c(t,e,r,n,o){var a;v.forEach(v.range(e,r),function(e){a=t[e],u.node(a).dummy&&v.forEach(u.predecessors(a),function(e){var t=u.node(e);t.dummy&&(t.order<n||t.order>o)&&d(i,e,a);});});}return v.reduce(e,function(n,o){var a,i=-1,s=0;return v.forEach(o,function(e,t){if("border"===u.node(e).dummy){var r=u.predecessors(e);r.length&&(a=u.node(r[0]).order,c(o,s,t,i,a),s=t,i=a);}c(o,s,o.length,a,n.length);}),o}),i}function d(e,t,r){if(r<t){var n=t;t=r,r=n;}var o=e[t];o||(e[t]=o={}),o[r]=!0;}function l(e,t,r){if(r<t){var n=t;t=r,r=n;}return v.has(e[t],r)}function f(e,t,s,u){var c={},f={},d={};return v.forEach(t,function(e){v.forEach(e,function(e,t){c[e]=e,f[e]=e,d[e]=t;});}),v.forEach(t,function(e){var i=-1;v.forEach(e,function(e){var t=u(e);if(t.length)for(var r=((t=v.sortBy(t,function(e){return d[e]})).length-1)/2,n=Math.floor(r),o=Math.ceil(r);n<=o;++n){var a=t[n];f[e]===e&&i<d[a]&&!l(s,e,a)&&(f[a]=e,f[e]=c[e]=c[a],i=d[a]);}});}),{root:c,align:f}}function h(n,e,t,r,o){var a,i,s,u,c,f,d,l={},h=(a=n,i=e,s=t,u=o,c=new g,f=a.graph(),d=function(s,u,c){return function(e,t,r){var n,o=e.node(t),a=e.node(r),i=0;if(i+=o.width/2,v.has(o,"labelpos"))switch(o.labelpos.toLowerCase()){case"l":n=-o.width/2;break;case"r":n=o.width/2;}if(n&&(i+=c?n:-n),n=0,i+=(o.dummy?u:s)/2,i+=(a.dummy?u:s)/2,i+=a.width/2,v.has(a,"labelpos"))switch(a.labelpos.toLowerCase()){case"l":n=a.width/2;break;case"r":n=-a.width/2;}return n&&(i+=c?n:-n),n=0,i}}(f.nodesep,f.edgesep,u),v.forEach(i,function(e){var o;v.forEach(e,function(e){var t=s[e];if(c.setNode(t),o){var r=s[o],n=c.edge(r,t);c.setEdge(r,t,Math.max(d(a,e,o),n||0));}o=e;});}),c),p=o?"borderLeft":"borderRight";function _(e,t){for(var r=h.nodes(),n=r.pop(),o={};n;)o[n]?e(n):(o[n]=!0,r.push(n),r=r.concat(t(n))),n=r.pop();}return _(function(e){l[e]=h.inEdges(e).reduce(function(e,t){return Math.max(e,l[t.v]+h.edge(t))},0);},h.predecessors.bind(h)),_(function(e){var t=h.outEdges(e).reduce(function(e,t){return Math.min(e,l[t.w]-h.edge(t))},Number.POSITIVE_INFINITY),r=n.node(e);t!==Number.POSITIVE_INFINITY&&r.borderType!==p&&(l[e]=Math.max(l[e],t));},h.successors.bind(h)),v.forEach(r,function(e){l[e]=l[t[e]];}),l}function p(i,e){return v.minBy(v.values(e),function(e){var o=Number.NEGATIVE_INFINITY,a=Number.POSITIVE_INFINITY;return v.forIn(e,function(e,t){var r,n=(r=t,i.node(r).width/2);o=Math.max(e+n,o),a=Math.min(e-n,a);}),o-a})}function _(i,s){var e=v.values(s),u=v.min(e),c=v.max(e);v.forEach(["u","d"],function(a){v.forEach(["l","r"],function(e){var t,r=a+e,n=i[r];if(n!==s){var o=v.values(n);(t="l"===e?u-v.min(o):c-v.max(o))&&(i[r]=v.mapValues(n,function(e){return e+t}));}});});}function y(n,o){return v.mapValues(n.ul,function(e,t){if(o)return n[o.toLowerCase()][t];var r=v.sortBy(v.map(n,t));return (r[1]+r[2])/2})}t.exports={positionX:function(a){var i,e=n.buildLayerMatrix(a),s=v.merge(o(a,e),c(a,e)),u={};v.forEach(["u","d"],function(o){i="u"===o?e:v.values(e).reverse(),v.forEach(["l","r"],function(e){"r"===e&&(i=v.map(i,function(e){return v.values(e).reverse()}));var t=("u"===o?a.predecessors:a.successors).bind(a),r=f(a,i,s,t),n=h(a,i,r.root,r.align,"r"===e);"r"===e&&(n=v.mapValues(n,function(e){return -e})),u[o+e]=n;});});var t=p(a,u);return _(u,t),y(u,a.graph().align)},findType1Conflicts:o,findType2Conflicts:c,addConflict:d,hasConflict:l,verticalAlignment:f,horizontalCompaction:h,alignCoordinates:_,findSmallestWidthAlignment:p,balance:y};},{"../graphlib":7,"../lodash":10,"../util":29}],24:[function(e,t,r){var a=e("../lodash"),i=e("../util"),n=e("./bk").positionX;t.exports=function(r){(function(r){var e=i.buildLayerMatrix(r),n=r.graph().ranksep,o=0;a.forEach(e,function(e){var t=a.max(a.map(e,function(e){return r.node(e).height}));a.forEach(e,function(e){r.node(e).y=o+t/2;}),o+=t+n;});})(r=i.asNonCompoundGraph(r)),a.forEach(n(r),function(e,t){r.node(t).x=e;});};},{"../lodash":10,"../util":29,"./bk":23}],25:[function(e,t,r){var s=e("../lodash"),i=e("../graphlib").Graph,u=e("./util").slack;function c(a,i){return s.forEach(a.nodes(),function n(o){s.forEach(i.nodeEdges(o),function(e){var t=e.v,r=o===t?e.w:t;a.hasNode(r)||u(i,e)||(a.setNode(r,{}),a.setEdge(o,r,{}),n(r));});}),a.nodeCount()}function f(t,r){return s.minBy(r.edges(),function(e){if(t.hasNode(e.v)!==t.hasNode(e.w))return u(r,e)})}function d(e,t,r){s.forEach(e.nodes(),function(e){t.node(e).rank+=r;});}t.exports=function(e){var t,r,n=new i({directed:!1}),o=e.nodes()[0],a=e.nodeCount();n.setNode(o,{});for(;c(n,e)<a;)t=f(n,e),r=n.hasNode(t.v)?u(e,t):-u(e,t),d(n,e,r);return n};},{"../graphlib":7,"../lodash":10,"./util":28}],26:[function(e,t,r){var n=e("./util").longestPath,o=e("./feasible-tree"),a=e("./network-simplex");t.exports=function(e){switch(e.graph().ranker){case"network-simplex":s(e);break;case"tight-tree":!function(e){n(e),o(e);}(e);break;case"longest-path":i(e);break;default:s(e);}};var i=n;function s(e){a(e);}},{"./feasible-tree":25,"./network-simplex":27,"./util":28}],27:[function(e,t,r){var p=e("../lodash"),n=e("./feasible-tree"),f=e("./util").slack,o=e("./util").longestPath,d=e("../graphlib").alg.preorder,s=e("../graphlib").alg.postorder,a=e("../util").simplify;function i(e){e=a(e),o(e);var t,r=n(e);for(h(r),l(r,e);t=c(r);)v(r,e,t,_(r,e,t));}function l(a,i){var e=s(a,a.nodes());e=e.slice(0,e.length-1),p.forEach(e,function(e){var t,r,n,o;r=i,n=e,o=(t=a).node(n).parent,t.edge(n,o).cutvalue=u(t,r,n);});}function u(u,c,f){var d=u.node(f).parent,l=!0,e=c.edge(f,d),h=0;return e||(l=!1,e=c.edge(d,f)),h=e.weight,p.forEach(c.nodeEdges(f),function(e){var t,r,n=e.v===f,o=n?e.w:e.v;if(o!==d){var a=n===l,i=c.edge(e).weight;if(h+=a?i:-i,t=f,r=o,u.hasEdge(t,r)){var s=u.edge(f,o).cutvalue;h+=a?-s:s;}}}),h}function h(e,t){arguments.length<2&&(t=e.nodes()[0]),function t(r,n,o,a,e){var i=o,s=r.node(a);n[a]=!0;p.forEach(r.neighbors(a),function(e){p.has(n,e)||(o=t(r,n,o,e,a));});s.low=i;s.lim=o++;e?s.parent=e:delete s.parent;return o}(e,{},1,t);}function c(t){return p.find(t.edges(),function(e){return t.edge(e).cutvalue<0})}function _(t,r,e){var n=e.v,o=e.w;r.hasEdge(n,o)||(n=e.w,o=e.v);var a=t.node(n),i=t.node(o),s=a,u=!1;a.lim>i.lim&&(s=i,u=!0);var c=p.filter(r.edges(),function(e){return u===g(t,t.node(e.v),s)&&u!==g(t,t.node(e.w),s)});return p.minBy(c,function(e){return f(r,e)})}function v(e,t,r,n){var o,a,i,s,u=r.v,c=r.w;e.removeEdge(u,c),e.setEdge(n.v,n.w,{}),h(e),l(e,t),o=e,a=t,i=p.find(o.nodes(),function(e){return !a.node(e).parent}),s=(s=d(o,i)).slice(1),p.forEach(s,function(e){var t=o.node(e).parent,r=a.edge(e,t),n=!1;r||(r=a.edge(t,e),n=!0),a.node(e).rank=a.node(t).rank+(n?r.minlen:-r.minlen);});}function g(e,t,r){return r.low<=t.lim&&t.lim<=r.lim}(t.exports=i).initLowLimValues=h,i.initCutValues=l,i.calcCutValue=u,i.leaveEdge=c,i.enterEdge=_,i.exchangeEdges=v;},{"../graphlib":7,"../lodash":10,"../util":29,"./feasible-tree":25,"./util":28}],28:[function(e,t,r){var i=e("../lodash");t.exports={longestPath:function(o){var a={};i.forEach(o.sources(),function t(e){var r=o.node(e);if(i.has(a,e))return r.rank;a[e]=!0;var n=i.min(i.map(o.outEdges(e),function(e){return t(e.w)-o.edge(e).minlen}));return n!==Number.POSITIVE_INFINITY&&null!=n||(n=0),r.rank=n});},slack:function(e,t){return e.node(t.w).rank-e.node(t.v).rank-e.edge(t).minlen}};},{"../lodash":10}],29:[function(e,t,r){var s=e("./lodash"),a=e("./graphlib").Graph;function i(e,t,r,n){for(var o;o=s.uniqueId(n),e.hasNode(o););return r.dummy=t,e.setNode(o,r),o}function u(r){return s.max(s.map(r.nodes(),function(e){var t=r.node(e).rank;if(!s.isUndefined(t))return t}))}t.exports={addDummyNode:i,simplify:function(n){var o=(new a).setGraph(n.graph());return s.forEach(n.nodes(),function(e){o.setNode(e,n.node(e));}),s.forEach(n.edges(),function(e){var t=o.edge(e.v,e.w)||{weight:0,minlen:1},r=n.edge(e);o.setEdge(e.v,e.w,{weight:t.weight+r.weight,minlen:Math.max(t.minlen,r.minlen)});}),o},asNonCompoundGraph:function(t){var r=new a({multigraph:t.isMultigraph()}).setGraph(t.graph());return s.forEach(t.nodes(),function(e){t.children(e).length||r.setNode(e,t.node(e));}),s.forEach(t.edges(),function(e){r.setEdge(e,t.edge(e));}),r},successorWeights:function(r){var e=s.map(r.nodes(),function(e){var t={};return s.forEach(r.outEdges(e),function(e){t[e.w]=(t[e.w]||0)+r.edge(e).weight;}),t});return s.zipObject(r.nodes(),e)},predecessorWeights:function(r){var e=s.map(r.nodes(),function(e){var t={};return s.forEach(r.inEdges(e),function(e){t[e.v]=(t[e.v]||0)+r.edge(e).weight;}),t});return s.zipObject(r.nodes(),e)},intersectRect:function(e,t){var r,n,o=e.x,a=e.y,i=t.x-o,s=t.y-a,u=e.width/2,c=e.height/2;if(!i&&!s)throw new Error("Not possible to find intersection inside of the rectangle");n=Math.abs(s)*u>Math.abs(i)*c?(s<0&&(c=-c),r=c*i/s,c):(i<0&&(u=-u),(r=u)*s/i);return {x:o+r,y:a+n}},buildLayerMatrix:function(n){var o=s.map(s.range(u(n)+1),function(){return []});return s.forEach(n.nodes(),function(e){var t=n.node(e),r=t.rank;s.isUndefined(r)||(o[r][t.order]=e);}),o},normalizeRanks:function(r){var n=s.min(s.map(r.nodes(),function(e){return r.node(e).rank}));s.forEach(r.nodes(),function(e){var t=r.node(e);s.has(t,"rank")&&(t.rank-=n);});},removeEmptyRanks:function(r){var n=s.min(s.map(r.nodes(),function(e){return r.node(e).rank})),o=[];s.forEach(r.nodes(),function(e){var t=r.node(e).rank-n;o[t]||(o[t]=[]),o[t].push(e);});var a=0,i=r.graph().nodeRankFactor;s.forEach(o,function(e,t){s.isUndefined(e)&&t%i!=0?--a:a&&s.forEach(e,function(e){r.node(e).rank+=a;});});},addBorderNode:function(e,t,r,n){var o={width:0,height:0};4<=arguments.length&&(o.rank=r,o.order=n);return i(e,"border",o,t)},maxRank:u,partition:function(e,t){var r={lhs:[],rhs:[]};return s.forEach(e,function(e){t(e)?r.lhs.push(e):r.rhs.push(e);}),r},time:function(e,t){var r=s.now();try{return t()}finally{console.log(e+" time: "+(s.now()-r)+"ms");}},notime:function(e,t){return t()}};},{"./graphlib":7,"./lodash":10}],30:[function(e,t,r){t.exports="0.8.4";},{}],31:[function(e,t,r){var n=e("./lib");t.exports={Graph:n.Graph,json:e("./lib/json"),alg:e("./lib/alg"),version:n.version};},{"./lib":47,"./lib/alg":38,"./lib/json":48}],32:[function(e,t,r){var i=e("../lodash");t.exports=function(t){var r,n={},o=[];function a(e){i.has(n,e)||(n[e]=!0,r.push(e),i.each(t.successors(e),a),i.each(t.predecessors(e),a));}return i.each(t.nodes(),function(e){r=[],a(e),r.length&&o.push(r);}),o};},{"../lodash":49}],33:[function(e,t,r){var s=e("../lodash");t.exports=function(t,e,r){s.isArray(e)||(e=[e]);var n=(t.isDirected()?t.successors:t.neighbors).bind(t),o=[],a={};return s.each(e,function(e){if(!t.hasNode(e))throw new Error("Graph does not have node: "+e);!function t(r,e,n,o,a,i){s.has(o,e)||(o[e]=!0,n||i.push(e),s.each(a(e),function(e){t(r,e,n,o,a,i);}),n&&i.push(e));}(t,e,"post"===r,a,n,o);}),o};},{"../lodash":49}],34:[function(e,t,r){var a=e("./dijkstra"),i=e("../lodash");t.exports=function(r,n,o){return i.transform(r.nodes(),function(e,t){e[t]=a(r,t,n,o);},{})};},{"../lodash":49,"./dijkstra":35}],35:[function(e,t,r){var n=e("../lodash"),o=e("../data/priority-queue");t.exports=function(t,e,r,n){return function(e,r,a,t){function n(e){var t=e.v!==i?e.v:e.w,r=u[t],n=a(e),o=s.distance+n;if(n<0)throw new Error("dijkstra does not allow negative edge weights. Bad edge: "+e+" Weight: "+n);o<r.distance&&(r.distance=o,r.predecessor=i,c.decrease(t,o));}var i,s,u={},c=new o;e.nodes().forEach(function(e){var t=e===r?0:Number.POSITIVE_INFINITY;u[e]={distance:t},c.add(e,t);});for(;0<c.size()&&(i=c.removeMin(),(s=u[i]).distance!==Number.POSITIVE_INFINITY);)t(i).forEach(n);return u}(t,String(e),r||a,n||function(e){return t.outEdges(e)})};var a=n.constant(1);},{"../data/priority-queue":45,"../lodash":49}],36:[function(e,t,r){var n=e("../lodash"),o=e("./tarjan");t.exports=function(t){return n.filter(o(t),function(e){return 1<e.length||1===e.length&&t.hasEdge(e[0],e[0])})};},{"../lodash":49,"./tarjan":43}],37:[function(e,t,r){var n=e("../lodash");t.exports=function(t,e,r){return function(e,o,t){var u={},r=e.nodes();return r.forEach(function(n){u[n]={},u[n][n]={distance:0},r.forEach(function(e){n!==e&&(u[n][e]={distance:Number.POSITIVE_INFINITY});}),t(n).forEach(function(e){var t=e.v===n?e.w:e.v,r=o(e);u[n][t]={distance:r,predecessor:n};});}),r.forEach(function(i){var s=u[i];r.forEach(function(e){var a=u[e];r.forEach(function(e){var t=a[i],r=s[e],n=a[e],o=t.distance+r.distance;o<n.distance&&(n.distance=o,n.predecessor=r.predecessor);});});}),u}(t,e||o,r||function(e){return t.outEdges(e)})};var o=n.constant(1);},{"../lodash":49}],38:[function(e,t,r){t.exports={components:e("./components"),dijkstra:e("./dijkstra"),dijkstraAll:e("./dijkstra-all"),findCycles:e("./find-cycles"),floydWarshall:e("./floyd-warshall"),isAcyclic:e("./is-acyclic"),postorder:e("./postorder"),preorder:e("./preorder"),prim:e("./prim"),tarjan:e("./tarjan"),topsort:e("./topsort")};},{"./components":32,"./dijkstra":35,"./dijkstra-all":34,"./find-cycles":36,"./floyd-warshall":37,"./is-acyclic":39,"./postorder":40,"./preorder":41,"./prim":42,"./tarjan":43,"./topsort":44}],39:[function(e,t,r){var n=e("./topsort");t.exports=function(e){try{n(e);}catch(e){if(e instanceof n.CycleException)return !1;throw e}return !0};},{"./topsort":44}],40:[function(e,t,r){var n=e("./dfs");t.exports=function(e,t){return n(e,t,"post")};},{"./dfs":33}],41:[function(e,t,r){var n=e("./dfs");t.exports=function(e,t){return n(e,t,"pre")};},{"./dfs":33}],42:[function(e,t,r){var u=e("../lodash"),c=e("../graph"),f=e("../data/priority-queue");t.exports=function(e,o){var a,t=new c,i={},s=new f;function r(e){var t=e.v===a?e.w:e.v,r=s.priority(t);if(void 0!==r){var n=o(e);n<r&&(i[t]=a,s.decrease(t,n));}}if(0===e.nodeCount())return t;u.each(e.nodes(),function(e){s.add(e,Number.POSITIVE_INFINITY),t.setNode(e);}),s.decrease(e.nodes()[0],0);var n=!1;for(;0<s.size();){if(a=s.removeMin(),u.has(i,a))t.setEdge(a,i[a]);else{if(n)throw new Error("Input graph is not connected: "+e);n=!0;}e.nodeEdges(a).forEach(r);}return t};},{"../data/priority-queue":45,"../graph":46,"../lodash":49}],43:[function(e,t,r){var f=e("../lodash");t.exports=function(a){var i=0,s=[],u={},c=[];return a.nodes().forEach(function(e){f.has(u,e)||!function t(e){var r=u[e]={onStack:!0,lowlink:i,index:i++};s.push(e);a.successors(e).forEach(function(e){f.has(u,e)?u[e].onStack&&(r.lowlink=Math.min(r.lowlink,u[e].index)):(t(e),r.lowlink=Math.min(r.lowlink,u[e].lowlink));});if(r.lowlink===r.index){for(var n,o=[];n=s.pop(),u[n].onStack=!1,o.push(n),e!==n;);c.push(o);}}(e);}),c};},{"../lodash":49}],44:[function(e,t,r){var i=e("../lodash");function n(r){var n={},o={},a=[];if(i.each(r.sinks(),function e(t){if(i.has(o,t))throw new s;i.has(n,t)||(o[t]=!0,n[t]=!0,i.each(r.predecessors(t),e),delete o[t],a.push(t));}),i.size(n)!==r.nodeCount())throw new s;return a}function s(){}((t.exports=n).CycleException=s).prototype=new Error;},{"../lodash":49}],45:[function(e,t,r){var a=e("../lodash");function n(){this._arr=[],this._keyIndices={};}(t.exports=n).prototype.size=function(){return this._arr.length},n.prototype.keys=function(){return this._arr.map(function(e){return e.key})},n.prototype.has=function(e){return a.has(this._keyIndices,e)},n.prototype.priority=function(e){var t=this._keyIndices[e];if(void 0!==t)return this._arr[t].priority},n.prototype.min=function(){if(0===this.size())throw new Error("Queue underflow");return this._arr[0].key},n.prototype.add=function(e,t){var r=this._keyIndices;if(e=String(e),a.has(r,e))return !1;var n=this._arr,o=n.length;return r[e]=o,n.push({key:e,priority:t}),this._decrease(o),!0},n.prototype.removeMin=function(){this._swap(0,this._arr.length-1);var e=this._arr.pop();return delete this._keyIndices[e.key],this._heapify(0),e.key},n.prototype.decrease=function(e,t){var r=this._keyIndices[e];if(t>this._arr[r].priority)throw new Error("New priority is greater than current priority. Key: "+e+" Old: "+this._arr[r].priority+" New: "+t);this._arr[r].priority=t,this._decrease(r);},n.prototype._heapify=function(e){var t=this._arr,r=2*e,n=1+r,o=e;r<t.length&&(o=t[r].priority<t[o].priority?r:o,n<t.length&&(o=t[n].priority<t[o].priority?n:o),o!==e&&(this._swap(e,o),this._heapify(o)));},n.prototype._decrease=function(e){for(var t,r=this._arr,n=r[e].priority;0!==e&&!(r[t=e>>1].priority<n);)this._swap(e,t),e=t;},n.prototype._swap=function(e,t){var r=this._arr,n=this._keyIndices,o=r[e],a=r[t];r[e]=a,r[t]=o,n[a.key]=e,n[o.key]=t;};},{"../lodash":49}],46:[function(e,t,r){var u=e("./lodash");t.exports=o;var s="\0",n="\0",c="";function o(e){this._isDirected=!u.has(e,"directed")||e.directed,this._isMultigraph=!!u.has(e,"multigraph")&&e.multigraph,this._isCompound=!!u.has(e,"compound")&&e.compound,this._label=void 0,this._defaultNodeLabelFn=u.constant(void 0),this._defaultEdgeLabelFn=u.constant(void 0),this._nodes={},this._isCompound&&(this._parent={},this._children={},this._children[n]={}),this._in={},this._preds={},this._out={},this._sucs={},this._edgeObjs={},this._edgeLabels={};}function f(e,t){e[t]?e[t]++:e[t]=1;}function a(e,t){--e[t]||delete e[t];}function d(e,t,r,n){var o=""+t,a=""+r;if(!e&&a<o){var i=o;o=a,a=i;}return o+c+a+c+(u.isUndefined(n)?s:n)}function i(e,t){return d(e,t.v,t.w,t.name)}o.prototype._nodeCount=0,o.prototype._edgeCount=0,o.prototype.isDirected=function(){return this._isDirected},o.prototype.isMultigraph=function(){return this._isMultigraph},o.prototype.isCompound=function(){return this._isCompound},o.prototype.setGraph=function(e){return this._label=e,this},o.prototype.graph=function(){return this._label},o.prototype.setDefaultNodeLabel=function(e){return u.isFunction(e)||(e=u.constant(e)),this._defaultNodeLabelFn=e,this},o.prototype.nodeCount=function(){return this._nodeCount},o.prototype.nodes=function(){return u.keys(this._nodes)},o.prototype.sources=function(){var t=this;return u.filter(this.nodes(),function(e){return u.isEmpty(t._in[e])})},o.prototype.sinks=function(){var t=this;return u.filter(this.nodes(),function(e){return u.isEmpty(t._out[e])})},o.prototype.setNodes=function(e,t){var r=arguments,n=this;return u.each(e,function(e){1<r.length?n.setNode(e,t):n.setNode(e);}),this},o.prototype.setNode=function(e,t){return u.has(this._nodes,e)?1<arguments.length&&(this._nodes[e]=t):(this._nodes[e]=1<arguments.length?t:this._defaultNodeLabelFn(e),this._isCompound&&(this._parent[e]=n,this._children[e]={},this._children[n][e]=!0),this._in[e]={},this._preds[e]={},this._out[e]={},this._sucs[e]={},++this._nodeCount),this},o.prototype.node=function(e){return this._nodes[e]},o.prototype.hasNode=function(e){return u.has(this._nodes,e)},o.prototype.removeNode=function(e){var t=this;if(u.has(this._nodes,e)){var r=function(e){t.removeEdge(t._edgeObjs[e]);};delete this._nodes[e],this._isCompound&&(this._removeFromParentsChildList(e),delete this._parent[e],u.each(this.children(e),function(e){t.setParent(e);}),delete this._children[e]),u.each(u.keys(this._in[e]),r),delete this._in[e],delete this._preds[e],u.each(u.keys(this._out[e]),r),delete this._out[e],delete this._sucs[e],--this._nodeCount;}return this},o.prototype.setParent=function(e,t){if(!this._isCompound)throw new Error("Cannot set parent in a non-compound graph");if(u.isUndefined(t))t=n;else{for(var r=t+="";!u.isUndefined(r);r=this.parent(r))if(r===e)throw new Error("Setting "+t+" as parent of "+e+" would create a cycle");this.setNode(t);}return this.setNode(e),this._removeFromParentsChildList(e),this._parent[e]=t,this._children[t][e]=!0,this},o.prototype._removeFromParentsChildList=function(e){delete this._children[this._parent[e]][e];},o.prototype.parent=function(e){if(this._isCompound){var t=this._parent[e];if(t!==n)return t}},o.prototype.children=function(e){if(u.isUndefined(e)&&(e=n),this._isCompound){var t=this._children[e];if(t)return u.keys(t)}else{if(e===n)return this.nodes();if(this.hasNode(e))return []}},o.prototype.predecessors=function(e){var t=this._preds[e];if(t)return u.keys(t)},o.prototype.successors=function(e){var t=this._sucs[e];if(t)return u.keys(t)},o.prototype.neighbors=function(e){var t=this.predecessors(e);if(t)return u.union(t,this.successors(e))},o.prototype.isLeaf=function(e){return 0===(this.isDirected()?this.successors(e):this.neighbors(e)).length},o.prototype.filterNodes=function(r){var n=new this.constructor({directed:this._isDirected,multigraph:this._isMultigraph,compound:this._isCompound});n.setGraph(this.graph());var o=this;u.each(this._nodes,function(e,t){r(t)&&n.setNode(t,e);}),u.each(this._edgeObjs,function(e){n.hasNode(e.v)&&n.hasNode(e.w)&&n.setEdge(e,o.edge(e));});var a={};return this._isCompound&&u.each(n.nodes(),function(e){n.setParent(e,function e(t){var r=o.parent(t);return void 0===r||n.hasNode(r)?a[t]=r:r in a?a[r]:e(r)}(e));}),n},o.prototype.setDefaultEdgeLabel=function(e){return u.isFunction(e)||(e=u.constant(e)),this._defaultEdgeLabelFn=e,this},o.prototype.edgeCount=function(){return this._edgeCount},o.prototype.edges=function(){return u.values(this._edgeObjs)},o.prototype.setPath=function(e,r){var n=this,o=arguments;return u.reduce(e,function(e,t){return 1<o.length?n.setEdge(e,t,r):n.setEdge(e,t),t}),this},o.prototype.setEdge=function(){var e,t,r,n,o=!1,a=arguments[0];"object"===(0, _typeof2.default)(a)&&null!==a&&"v"in a?(e=a.v,t=a.w,r=a.name,2===arguments.length&&(n=arguments[1],o=!0)):(e=a,t=arguments[1],r=arguments[3],2<arguments.length&&(n=arguments[2],o=!0)),e=""+e,t=""+t,u.isUndefined(r)||(r=""+r);var i=d(this._isDirected,e,t,r);if(u.has(this._edgeLabels,i))return o&&(this._edgeLabels[i]=n),this;if(!u.isUndefined(r)&&!this._isMultigraph)throw new Error("Cannot set a named edge when isMultigraph = false");this.setNode(e),this.setNode(t),this._edgeLabels[i]=o?n:this._defaultEdgeLabelFn(e,t,r);var s=function(e,t,r,n){var o=""+t,a=""+r;if(!e&&a<o){var i=o;o=a,a=i;}var s={v:o,w:a};n&&(s.name=n);return s}(this._isDirected,e,t,r);return e=s.v,t=s.w,Object.freeze(s),this._edgeObjs[i]=s,f(this._preds[t],e),f(this._sucs[e],t),this._in[t][i]=s,this._out[e][i]=s,this._edgeCount++,this},o.prototype.edge=function(e,t,r){var n=1===arguments.length?i(this._isDirected,e):d(this._isDirected,e,t,r);return this._edgeLabels[n]},o.prototype.hasEdge=function(e,t,r){var n=1===arguments.length?i(this._isDirected,e):d(this._isDirected,e,t,r);return u.has(this._edgeLabels,n)},o.prototype.removeEdge=function(e,t,r){var n=1===arguments.length?i(this._isDirected,arguments[0]):d(this._isDirected,e,t,r),o=this._edgeObjs[n];return o&&(e=o.v,t=o.w,delete this._edgeLabels[n],delete this._edgeObjs[n],a(this._preds[t],e),a(this._sucs[e],t),delete this._in[t][n],delete this._out[e][n],this._edgeCount--),this},o.prototype.inEdges=function(e,t){var r=this._in[e];if(r){var n=u.values(r);return t?u.filter(n,function(e){return e.v===t}):n}},o.prototype.outEdges=function(e,t){var r=this._out[e];if(r){var n=u.values(r);return t?u.filter(n,function(e){return e.w===t}):n}},o.prototype.nodeEdges=function(e,t){var r=this.inEdges(e,t);if(r)return r.concat(this.outEdges(e,t))};},{"./lodash":49}],47:[function(e,t,r){t.exports={Graph:e("./graph"),version:e("./version")};},{"./graph":46,"./version":50}],48:[function(e,t,r){var a=e("./lodash"),n=e("./graph");t.exports={write:function(e){var t={options:{directed:e.isDirected(),multigraph:e.isMultigraph(),compound:e.isCompound()},nodes:function(o){return a.map(o.nodes(),function(e){var t=o.node(e),r=o.parent(e),n={v:e};return a.isUndefined(t)||(n.value=t),a.isUndefined(r)||(n.parent=r),n})}(e),edges:function(n){return a.map(n.edges(),function(e){var t=n.edge(e),r={v:e.v,w:e.w};return a.isUndefined(e.name)||(r.name=e.name),a.isUndefined(t)||(r.value=t),r})}(e)};a.isUndefined(e.graph())||(t.value=a.clone(e.graph()));return t},read:function(e){var t=new n(e.options).setGraph(e.value);return a.each(e.nodes,function(e){t.setNode(e.v,e.value),e.parent&&t.setParent(e.v,e.parent);}),a.each(e.edges,function(e){t.setEdge({v:e.v,w:e.w,name:e.name},e.value);}),t}};},{"./graph":46,"./lodash":49}],49:[function(e,t,r){var n;if("function"==typeof e)try{n={clone:e("lodash/clone"),constant:e("lodash/constant"),each:e("lodash/each"),filter:e("lodash/filter"),has:e("lodash/has"),isArray:e("lodash/isArray"),isEmpty:e("lodash/isEmpty"),isFunction:e("lodash/isFunction"),isUndefined:e("lodash/isUndefined"),keys:e("lodash/keys"),map:e("lodash/map"),reduce:e("lodash/reduce"),size:e("lodash/size"),transform:e("lodash/transform"),union:e("lodash/union"),values:e("lodash/values")};}catch(e){}n=n||window._,t.exports=n;},{"lodash/clone":226,"lodash/constant":228,"lodash/each":230,"lodash/filter":232,"lodash/has":239,"lodash/isArray":243,"lodash/isEmpty":247,"lodash/isFunction":248,"lodash/isUndefined":258,"lodash/keys":259,"lodash/map":262,"lodash/reduce":274,"lodash/size":275,"lodash/transform":284,"lodash/union":285,"lodash/values":287}],50:[function(e,t,r){t.exports="2.1.7";},{}],51:[function(e,t,r){var n=e("./_getNative")(e("./_root"),"DataView");t.exports=n;},{"./_getNative":163,"./_root":208}],52:[function(e,t,r){var n=e("./_hashClear"),o=e("./_hashDelete"),a=e("./_hashGet"),i=e("./_hashHas"),s=e("./_hashSet");function u(e){var t=-1,r=null==e?0:e.length;for(this.clear();++t<r;){var n=e[t];this.set(n[0],n[1]);}}u.prototype.clear=n,u.prototype.delete=o,u.prototype.get=a,u.prototype.has=i,u.prototype.set=s,t.exports=u;},{"./_hashClear":172,"./_hashDelete":173,"./_hashGet":174,"./_hashHas":175,"./_hashSet":176}],53:[function(e,t,r){var n=e("./_listCacheClear"),o=e("./_listCacheDelete"),a=e("./_listCacheGet"),i=e("./_listCacheHas"),s=e("./_listCacheSet");function u(e){var t=-1,r=null==e?0:e.length;for(this.clear();++t<r;){var n=e[t];this.set(n[0],n[1]);}}u.prototype.clear=n,u.prototype.delete=o,u.prototype.get=a,u.prototype.has=i,u.prototype.set=s,t.exports=u;},{"./_listCacheClear":188,"./_listCacheDelete":189,"./_listCacheGet":190,"./_listCacheHas":191,"./_listCacheSet":192}],54:[function(e,t,r){var n=e("./_getNative")(e("./_root"),"Map");t.exports=n;},{"./_getNative":163,"./_root":208}],55:[function(e,t,r){var n=e("./_mapCacheClear"),o=e("./_mapCacheDelete"),a=e("./_mapCacheGet"),i=e("./_mapCacheHas"),s=e("./_mapCacheSet");function u(e){var t=-1,r=null==e?0:e.length;for(this.clear();++t<r;){var n=e[t];this.set(n[0],n[1]);}}u.prototype.clear=n,u.prototype.delete=o,u.prototype.get=a,u.prototype.has=i,u.prototype.set=s,t.exports=u;},{"./_mapCacheClear":193,"./_mapCacheDelete":194,"./_mapCacheGet":195,"./_mapCacheHas":196,"./_mapCacheSet":197}],56:[function(e,t,r){var n=e("./_getNative")(e("./_root"),"Promise");t.exports=n;},{"./_getNative":163,"./_root":208}],57:[function(e,t,r){var n=e("./_getNative")(e("./_root"),"Set");t.exports=n;},{"./_getNative":163,"./_root":208}],58:[function(e,t,r){var n=e("./_MapCache"),o=e("./_setCacheAdd"),a=e("./_setCacheHas");function i(e){var t=-1,r=null==e?0:e.length;for(this.__data__=new n;++t<r;)this.add(e[t]);}i.prototype.add=i.prototype.push=o,i.prototype.has=a,t.exports=i;},{"./_MapCache":55,"./_setCacheAdd":210,"./_setCacheHas":211}],59:[function(e,t,r){var n=e("./_ListCache"),o=e("./_stackClear"),a=e("./_stackDelete"),i=e("./_stackGet"),s=e("./_stackHas"),u=e("./_stackSet");function c(e){var t=this.__data__=new n(e);this.size=t.size;}c.prototype.clear=o,c.prototype.delete=a,c.prototype.get=i,c.prototype.has=s,c.prototype.set=u,t.exports=c;},{"./_ListCache":53,"./_stackClear":215,"./_stackDelete":216,"./_stackGet":217,"./_stackHas":218,"./_stackSet":219}],60:[function(e,t,r){var n=e("./_root").Symbol;t.exports=n;},{"./_root":208}],61:[function(e,t,r){var n=e("./_root").Uint8Array;t.exports=n;},{"./_root":208}],62:[function(e,t,r){var n=e("./_getNative")(e("./_root"),"WeakMap");t.exports=n;},{"./_getNative":163,"./_root":208}],63:[function(e,t,r){t.exports=function(e,t,r){switch(r.length){case 0:return e.call(t);case 1:return e.call(t,r[0]);case 2:return e.call(t,r[0],r[1]);case 3:return e.call(t,r[0],r[1],r[2])}return e.apply(t,r)};},{}],64:[function(e,t,r){t.exports=function(e,t){for(var r=-1,n=null==e?0:e.length;++r<n&&!1!==t(e[r],r,e););return e};},{}],65:[function(e,t,r){t.exports=function(e,t){for(var r=-1,n=null==e?0:e.length,o=0,a=[];++r<n;){var i=e[r];t(i,r,e)&&(a[o++]=i);}return a};},{}],66:[function(e,t,r){var n=e("./_baseIndexOf");t.exports=function(e,t){return !!(null==e?0:e.length)&&-1<n(e,t,0)};},{"./_baseIndexOf":95}],67:[function(e,t,r){t.exports=function(e,t,r){for(var n=-1,o=null==e?0:e.length;++n<o;)if(r(t,e[n]))return !0;return !1};},{}],68:[function(e,t,r){var f=e("./_baseTimes"),d=e("./isArguments"),l=e("./isArray"),h=e("./isBuffer"),p=e("./_isIndex"),_=e("./isTypedArray"),v=Object.prototype.hasOwnProperty;t.exports=function(e,t){var r=l(e),n=!r&&d(e),o=!r&&!n&&h(e),a=!r&&!n&&!o&&_(e),i=r||n||o||a,s=i?f(e.length,String):[],u=s.length;for(var c in e)!t&&!v.call(e,c)||i&&("length"==c||o&&("offset"==c||"parent"==c)||a&&("buffer"==c||"byteLength"==c||"byteOffset"==c)||p(c,u))||s.push(c);return s};},{"./_baseTimes":125,"./_isIndex":181,"./isArguments":242,"./isArray":243,"./isBuffer":246,"./isTypedArray":257}],69:[function(e,t,r){t.exports=function(e,t){for(var r=-1,n=null==e?0:e.length,o=Array(n);++r<n;)o[r]=t(e[r],r,e);return o};},{}],70:[function(e,t,r){t.exports=function(e,t){for(var r=-1,n=t.length,o=e.length;++r<n;)e[o+r]=t[r];return e};},{}],71:[function(e,t,r){t.exports=function(e,t,r,n){var o=-1,a=null==e?0:e.length;for(n&&a&&(r=e[++o]);++o<a;)r=t(r,e[o],o,e);return r};},{}],72:[function(e,t,r){t.exports=function(e,t){for(var r=-1,n=null==e?0:e.length;++r<n;)if(t(e[r],r,e))return !0;return !1};},{}],73:[function(e,t,r){var n=e("./_baseProperty")("length");t.exports=n;},{"./_baseProperty":117}],74:[function(e,t,r){var n=e("./_baseAssignValue"),o=e("./eq");t.exports=function(e,t,r){(void 0===r||o(e[t],r))&&(void 0!==r||t in e)||n(e,t,r);};},{"./_baseAssignValue":79,"./eq":231}],75:[function(e,t,r){var o=e("./_baseAssignValue"),a=e("./eq"),i=Object.prototype.hasOwnProperty;t.exports=function(e,t,r){var n=e[t];i.call(e,t)&&a(n,r)&&(void 0!==r||t in e)||o(e,t,r);};},{"./_baseAssignValue":79,"./eq":231}],76:[function(e,t,r){var n=e("./eq");t.exports=function(e,t){for(var r=e.length;r--;)if(n(e[r][0],t))return r;return -1};},{"./eq":231}],77:[function(e,t,r){var n=e("./_copyObject"),o=e("./keys");t.exports=function(e,t){return e&&n(t,o(t),e)};},{"./_copyObject":143,"./keys":259}],78:[function(e,t,r){var n=e("./_copyObject"),o=e("./keysIn");t.exports=function(e,t){return e&&n(t,o(t),e)};},{"./_copyObject":143,"./keysIn":260}],79:[function(e,t,r){var n=e("./_defineProperty");t.exports=function(e,t,r){"__proto__"==t&&n?n(e,t,{configurable:!0,enumerable:!0,value:r,writable:!0}):e[t]=r;};},{"./_defineProperty":153}],80:[function(e,t,r){var g=e("./_Stack"),y=e("./_arrayEach"),b=e("./_assignValue"),m=e("./_baseAssign"),x=e("./_baseAssignIn"),w=e("./_cloneBuffer"),E=e("./_copyArray"),j=e("./_copySymbols"),k=e("./_copySymbolsIn"),A=e("./_getAllKeys"),O=e("./_getAllKeysIn"),I=e("./_getTag"),S=e("./_initCloneArray"),C=e("./_initCloneByTag"),N=e("./_initCloneObject"),L=e("./isArray"),M=e("./isBuffer"),T=e("./isMap"),P=e("./isObject"),F=e("./isSet"),D=e("./keys"),B=1,R=2,G=4,U="[object Arguments]",z="[object Function]",q="[object GeneratorFunction]",V="[object Object]",K={};K[U]=K["[object Array]"]=K["[object ArrayBuffer]"]=K["[object DataView]"]=K["[object Boolean]"]=K["[object Date]"]=K["[object Float32Array]"]=K["[object Float64Array]"]=K["[object Int8Array]"]=K["[object Int16Array]"]=K["[object Int32Array]"]=K["[object Map]"]=K["[object Number]"]=K[V]=K["[object RegExp]"]=K["[object Set]"]=K["[object String]"]=K["[object Symbol]"]=K["[object Uint8Array]"]=K["[object Uint8ClampedArray]"]=K["[object Uint16Array]"]=K["[object Uint32Array]"]=!0,K["[object Error]"]=K[z]=K["[object WeakMap]"]=!1,t.exports=function r(n,o,a,e,t,i){var s,u=o&B,c=o&R,f=o&G;if(a&&(s=t?a(n,e,t,i):a(n)),void 0!==s)return s;if(!P(n))return n;var d=L(n);if(d){if(s=S(n),!u)return E(n,s)}else{var l=I(n),h=l==z||l==q;if(M(n))return w(n,u);if(l==V||l==U||h&&!t){if(s=c||h?{}:N(n),!u)return c?k(n,x(s,n)):j(n,m(s,n))}else{if(!K[l])return t?n:{};s=C(n,l,u);}}var p=(i=i||new g).get(n);if(p)return p;if(i.set(n,s),F(n))return n.forEach(function(e){s.add(r(e,o,a,e,n,i));}),s;if(T(n))return n.forEach(function(e,t){s.set(t,r(e,o,a,t,n,i));}),s;var _=f?c?O:A:c?keysIn:D,v=d?void 0:_(n);return y(v||n,function(e,t){v&&(e=n[t=e]),b(s,t,r(e,o,a,t,n,i));}),s};},{"./_Stack":59,"./_arrayEach":64,"./_assignValue":75,"./_baseAssign":77,"./_baseAssignIn":78,"./_cloneBuffer":135,"./_copyArray":142,"./_copySymbols":144,"./_copySymbolsIn":145,"./_getAllKeys":159,"./_getAllKeysIn":160,"./_getTag":168,"./_initCloneArray":177,"./_initCloneByTag":178,"./_initCloneObject":179,"./isArray":243,"./isBuffer":246,"./isMap":250,"./isObject":251,"./isSet":254,"./keys":259}],81:[function(e,t,r){function n(e){if(!o(e))return {};if(a)return a(e);i.prototype=e;var t=new i;return i.prototype=void 0,t}var o=e("./isObject"),a=Object.create;function i(){}t.exports=n;},{"./isObject":251}],82:[function(e,t,r){var n=e("./_baseForOwn"),o=e("./_createBaseEach")(n);t.exports=o;},{"./_baseForOwn":88,"./_createBaseEach":148}],83:[function(e,t,r){var c=e("./isSymbol");t.exports=function(e,t,r){for(var n=-1,o=e.length;++n<o;){var a=e[n],i=t(a);if(null!=i&&(void 0===s?i==i&&!c(i):r(i,s)))var s=i,u=a;}return u};},{"./isSymbol":256}],84:[function(e,t,r){var a=e("./_baseEach");t.exports=function(e,n){var o=[];return a(e,function(e,t,r){n(e,t,r)&&o.push(e);}),o};},{"./_baseEach":82}],85:[function(e,t,r){t.exports=function(e,t,r,n){for(var o=e.length,a=r+(n?1:-1);n?a--:++a<o;)if(t(e[a],a,e))return a;return -1};},{}],86:[function(e,t,r){var c=e("./_arrayPush"),f=e("./_isFlattenable");t.exports=function e(t,r,n,o,a){var i=-1,s=t.length;for(n=n||f,a=a||[];++i<s;){var u=t[i];0<r&&n(u)?1<r?e(u,r-1,n,o,a):c(a,u):o||(a[a.length]=u);}return a};},{"./_arrayPush":70,"./_isFlattenable":180}],87:[function(e,t,r){var n=e("./_createBaseFor")();t.exports=n;},{"./_createBaseFor":149}],88:[function(e,t,r){var n=e("./_baseFor"),o=e("./keys");t.exports=function(e,t){return e&&n(e,t,o)};},{"./_baseFor":87,"./keys":259}],89:[function(e,t,r){var o=e("./_castPath"),a=e("./_toKey");t.exports=function(e,t){for(var r=0,n=(t=o(t,e)).length;null!=e&&r<n;)e=e[a(t[r++])];return r&&r==n?e:void 0};},{"./_castPath":133,"./_toKey":223}],90:[function(e,t,r){var o=e("./_arrayPush"),a=e("./isArray");t.exports=function(e,t,r){var n=t(e);return a(e)?n:o(n,r(e))};},{"./_arrayPush":70,"./isArray":243}],91:[function(e,t,r){var n=e("./_Symbol"),o=e("./_getRawTag"),a=e("./_objectToString"),i=n?n.toStringTag:void 0;t.exports=function(e){return null==e?void 0===e?"[object Undefined]":"[object Null]":i&&i in Object(e)?o(e):a(e)};},{"./_Symbol":60,"./_getRawTag":165,"./_objectToString":205}],92:[function(e,t,r){t.exports=function(e,t){return t<e};},{}],93:[function(e,t,r){var n=Object.prototype.hasOwnProperty;t.exports=function(e,t){return null!=e&&n.call(e,t)};},{}],94:[function(e,t,r){t.exports=function(e,t){return null!=e&&t in Object(e)};},{}],95:[function(e,t,r){var n=e("./_baseFindIndex"),o=e("./_baseIsNaN"),a=e("./_strictIndexOf");t.exports=function(e,t,r){return t==t?a(e,t,r):n(e,o,r)};},{"./_baseFindIndex":85,"./_baseIsNaN":101,"./_strictIndexOf":220}],96:[function(e,t,r){var n=e("./_baseGetTag"),o=e("./isObjectLike");t.exports=function(e){return o(e)&&"[object Arguments]"==n(e)};},{"./_baseGetTag":91,"./isObjectLike":252}],97:[function(e,t,r){var i=e("./_baseIsEqualDeep"),s=e("./isObjectLike");t.exports=function e(t,r,n,o,a){return t===r||(null==t||null==r||!s(t)&&!s(r)?t!=t&&r!=r:i(t,r,n,o,e,a))};},{"./_baseIsEqualDeep":98,"./isObjectLike":252}],98:[function(e,t,r){var _=e("./_Stack"),v=e("./_equalArrays"),g=e("./_equalByTag"),y=e("./_equalObjects"),b=e("./_getTag"),m=e("./isArray"),x=e("./isBuffer"),w=e("./isTypedArray"),E="[object Arguments]",j="[object Array]",k="[object Object]",A=Object.prototype.hasOwnProperty;t.exports=function(e,t,r,n,o,a){var i=m(e),s=m(t),u=i?j:b(e),c=s?j:b(t),f=(u=u==E?k:u)==k,d=(c=c==E?k:c)==k,l=u==c;if(l&&x(e)){if(!x(t))return !1;f=!(i=!0);}if(l&&!f)return a=a||new _,i||w(e)?v(e,t,r,n,o,a):g(e,t,u,r,n,o,a);if(!(1&r)){var h=f&&A.call(e,"__wrapped__"),p=d&&A.call(t,"__wrapped__");if(h||p)return o(h?e.value():e,p?t.value():t,r,n,a=a||new _)}return l&&(a=a||new _,y(e,t,r,n,o,a))};},{"./_Stack":59,"./_equalArrays":154,"./_equalByTag":155,"./_equalObjects":156,"./_getTag":168,"./isArray":243,"./isBuffer":246,"./isTypedArray":257}],99:[function(e,t,r){var n=e("./_getTag"),o=e("./isObjectLike");t.exports=function(e){return o(e)&&"[object Map]"==n(e)};},{"./_getTag":168,"./isObjectLike":252}],100:[function(e,t,r){var h=e("./_Stack"),p=e("./_baseIsEqual");t.exports=function(e,t,r,n){var o=r.length,a=o,i=!n;if(null==e)return !a;for(e=Object(e);o--;){var s=r[o];if(i&&s[2]?s[1]!==e[s[0]]:!(s[0]in e))return !1}for(;++o<a;){var u=(s=r[o])[0],c=e[u],f=s[1];if(i&&s[2]){if(void 0===c&&!(u in e))return !1}else{var d=new h;if(n)var l=n(c,f,u,e,t,d);if(!(void 0===l?p(f,c,3,n,d):l))return !1}}return !0};},{"./_Stack":59,"./_baseIsEqual":97}],101:[function(e,t,r){t.exports=function(e){return e!=e};},{}],102:[function(e,t,r){var n=e("./isFunction"),o=e("./_isMasked"),a=e("./isObject"),i=e("./_toSource"),s=/^\[object .+?Constructor\]$/,u=Function.prototype,c=Object.prototype,f=u.toString,d=c.hasOwnProperty,l=RegExp("^"+f.call(d).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");t.exports=function(e){return !(!a(e)||o(e))&&(n(e)?l:s).test(i(e))};},{"./_isMasked":185,"./_toSource":224,"./isFunction":248,"./isObject":251}],103:[function(e,t,r){var n=e("./_getTag"),o=e("./isObjectLike");t.exports=function(e){return o(e)&&"[object Set]"==n(e)};},{"./_getTag":168,"./isObjectLike":252}],104:[function(e,t,r){var n=e("./_baseGetTag"),o=e("./isLength"),a=e("./isObjectLike"),i={};i["[object Float32Array]"]=i["[object Float64Array]"]=i["[object Int8Array]"]=i["[object Int16Array]"]=i["[object Int32Array]"]=i["[object Uint8Array]"]=i["[object Uint8ClampedArray]"]=i["[object Uint16Array]"]=i["[object Uint32Array]"]=!0,i["[object Arguments]"]=i["[object Array]"]=i["[object ArrayBuffer]"]=i["[object Boolean]"]=i["[object DataView]"]=i["[object Date]"]=i["[object Error]"]=i["[object Function]"]=i["[object Map]"]=i["[object Number]"]=i["[object Object]"]=i["[object RegExp]"]=i["[object Set]"]=i["[object String]"]=i["[object WeakMap]"]=!1,t.exports=function(e){return a(e)&&o(e.length)&&!!i[n(e)]};},{"./_baseGetTag":91,"./isLength":249,"./isObjectLike":252}],105:[function(e,t,r){var n=e("./_baseMatches"),o=e("./_baseMatchesProperty"),a=e("./identity"),i=e("./isArray"),s=e("./property");t.exports=function(e){return "function"==typeof e?e:null==e?a:"object"==(0, _typeof2.default)(e)?i(e)?o(e[0],e[1]):n(e):s(e)};},{"./_baseMatches":110,"./_baseMatchesProperty":111,"./identity":241,"./isArray":243,"./property":272}],106:[function(e,t,r){var n=e("./_isPrototype"),o=e("./_nativeKeys"),a=Object.prototype.hasOwnProperty;t.exports=function(e){if(!n(e))return o(e);var t=[];for(var r in Object(e))a.call(e,r)&&"constructor"!=r&&t.push(r);return t};},{"./_isPrototype":186,"./_nativeKeys":202}],107:[function(e,t,r){var o=e("./isObject"),a=e("./_isPrototype"),i=e("./_nativeKeysIn"),s=Object.prototype.hasOwnProperty;t.exports=function(e){if(!o(e))return i(e);var t=a(e),r=[];for(var n in e)("constructor"!=n||!t&&s.call(e,n))&&r.push(n);return r};},{"./_isPrototype":186,"./_nativeKeysIn":203,"./isObject":251}],108:[function(e,t,r){t.exports=function(e,t){return e<t};},{}],109:[function(e,t,r){var i=e("./_baseEach"),s=e("./isArrayLike");t.exports=function(e,n){var o=-1,a=s(e)?Array(e.length):[];return i(e,function(e,t,r){a[++o]=n(e,t,r);}),a};},{"./_baseEach":82,"./isArrayLike":244}],110:[function(e,t,r){var n=e("./_baseIsMatch"),o=e("./_getMatchData"),a=e("./_matchesStrictComparable");t.exports=function(t){var r=o(t);return 1==r.length&&r[0][2]?a(r[0][0],r[0][1]):function(e){return e===t||n(e,t,r)}};},{"./_baseIsMatch":100,"./_getMatchData":162,"./_matchesStrictComparable":199}],111:[function(e,t,r){var o=e("./_baseIsEqual"),a=e("./get"),i=e("./hasIn"),s=e("./_isKey"),u=e("./_isStrictComparable"),c=e("./_matchesStrictComparable"),f=e("./_toKey");t.exports=function(r,n){return s(r)&&u(n)?c(f(r),n):function(e){var t=a(e,r);return void 0===t&&t===n?i(e,r):o(n,t,3)}};},{"./_baseIsEqual":97,"./_isKey":183,"./_isStrictComparable":187,"./_matchesStrictComparable":199,"./_toKey":223,"./get":238,"./hasIn":240}],112:[function(e,t,r){var c=e("./_Stack"),f=e("./_assignMergeValue"),d=e("./_baseFor"),l=e("./_baseMergeDeep"),h=e("./isObject"),p=e("./keysIn"),_=e("./_safeGet");t.exports=function n(o,a,i,s,u){o!==a&&d(a,function(e,t){if(h(e))u=u||new c,l(o,a,t,i,n,s,u);else{var r=s?s(_(o,t),e,t+"",o,a,u):void 0;void 0===r&&(r=e),f(o,t,r);}},p);};},{"./_Stack":59,"./_assignMergeValue":74,"./_baseFor":87,"./_baseMergeDeep":113,"./_safeGet":209,"./isObject":251,"./keysIn":260}],113:[function(e,t,r){var _=e("./_assignMergeValue"),v=e("./_cloneBuffer"),g=e("./_cloneTypedArray"),y=e("./_copyArray"),b=e("./_initCloneObject"),m=e("./isArguments"),x=e("./isArray"),w=e("./isArrayLikeObject"),E=e("./isBuffer"),j=e("./isFunction"),k=e("./isObject"),A=e("./isPlainObject"),O=e("./isTypedArray"),I=e("./_safeGet"),S=e("./toPlainObject");t.exports=function(e,t,r,n,o,a,i){var s=I(e,r),u=I(t,r),c=i.get(u);if(c)_(e,r,c);else{var f=a?a(s,u,r+"",e,t,i):void 0,d=void 0===f;if(d){var l=x(u),h=!l&&E(u),p=!l&&!h&&O(u);f=u,l||h||p?f=x(s)?s:w(s)?y(s):h?v(u,!(d=!1)):p?g(u,!(d=!1)):[]:A(u)||m(u)?m(f=s)?f=S(s):(!k(s)||n&&j(s))&&(f=b(u)):d=!1;}d&&(i.set(u,f),o(f,u,n,a,i),i.delete(u)),_(e,r,f);}};},{"./_assignMergeValue":74,"./_cloneBuffer":135,"./_cloneTypedArray":139,"./_copyArray":142,"./_initCloneObject":179,"./_safeGet":209,"./isArguments":242,"./isArray":243,"./isArrayLikeObject":245,"./isBuffer":246,"./isFunction":248,"./isObject":251,"./isPlainObject":253,"./isTypedArray":257,"./toPlainObject":282}],114:[function(e,t,r){var a=e("./_arrayMap"),i=e("./_baseIteratee"),s=e("./_baseMap"),u=e("./_baseSortBy"),c=e("./_baseUnary"),f=e("./_compareMultiple"),d=e("./identity");t.exports=function(e,n,r){var o=-1;n=a(n.length?n:[d],c(i));var t=s(e,function(t,e,r){return {criteria:a(n,function(e){return e(t)}),index:++o,value:t}});return u(t,function(e,t){return f(e,t,r)})};},{"./_arrayMap":69,"./_baseIteratee":105,"./_baseMap":109,"./_baseSortBy":124,"./_baseUnary":127,"./_compareMultiple":141,"./identity":241}],115:[function(e,t,r){var n=e("./_basePickBy"),o=e("./hasIn");t.exports=function(r,e){return n(r,e,function(e,t){return o(r,t)})};},{"./_basePickBy":116,"./hasIn":240}],116:[function(e,t,r){var u=e("./_baseGet"),c=e("./_baseSet"),f=e("./_castPath");t.exports=function(e,t,r){for(var n=-1,o=t.length,a={};++n<o;){var i=t[n],s=u(e,i);r(s,i)&&c(a,f(i,e),s);}return a};},{"./_baseGet":89,"./_baseSet":122,"./_castPath":133}],117:[function(e,t,r){t.exports=function(t){return function(e){return null==e?void 0:e[t]}};},{}],118:[function(e,t,r){var n=e("./_baseGet");t.exports=function(t){return function(e){return n(e,t)}};},{"./_baseGet":89}],119:[function(e,t,r){var s=Math.ceil,u=Math.max;t.exports=function(e,t,r,n){for(var o=-1,a=u(s((t-e)/(r||1)),0),i=Array(a);a--;)i[n?a:++o]=e,e+=r;return i};},{}],120:[function(e,t,r){t.exports=function(e,n,o,a,t){return t(e,function(e,t,r){o=a?(a=!1,e):n(o,e,t,r);}),o};},{}],121:[function(e,t,r){var n=e("./identity"),o=e("./_overRest"),a=e("./_setToString");t.exports=function(e,t){return a(o(e,t,n),e+"")};},{"./_overRest":207,"./_setToString":213,"./identity":241}],122:[function(e,t,r){var d=e("./_assignValue"),l=e("./_castPath"),h=e("./_isIndex"),p=e("./isObject"),_=e("./_toKey");t.exports=function(e,t,r,n){if(!p(e))return e;for(var o=-1,a=(t=l(t,e)).length,i=a-1,s=e;null!=s&&++o<a;){var u=_(t[o]),c=r;if(o!=i){var f=s[u];void 0===(c=n?n(f,u,s):void 0)&&(c=p(f)?f:h(t[o+1])?[]:{});}d(s,u,c),s=s[u];}return e};},{"./_assignValue":75,"./_castPath":133,"./_isIndex":181,"./_toKey":223,"./isObject":251}],123:[function(e,t,r){var n=e("./constant"),o=e("./_defineProperty"),a=e("./identity"),i=o?function(e,t){return o(e,"toString",{configurable:!0,enumerable:!1,value:n(t),writable:!0})}:a;t.exports=i;},{"./_defineProperty":153,"./constant":228,"./identity":241}],124:[function(e,t,r){t.exports=function(e,t){var r=e.length;for(e.sort(t);r--;)e[r]=e[r].value;return e};},{}],125:[function(e,t,r){t.exports=function(e,t){for(var r=-1,n=Array(e);++r<e;)n[r]=t(r);return n};},{}],126:[function(e,t,r){var n=e("./_Symbol"),o=e("./_arrayMap"),a=e("./isArray"),i=e("./isSymbol"),s=1/0,u=n?n.prototype:void 0,c=u?u.toString:void 0;t.exports=function e(t){if("string"==typeof t)return t;if(a(t))return o(t,e)+"";if(i(t))return c?c.call(t):"";var r=t+"";return "0"==r&&1/t==-s?"-0":r};},{"./_Symbol":60,"./_arrayMap":69,"./isArray":243,"./isSymbol":256}],127:[function(e,t,r){t.exports=function(t){return function(e){return t(e)}};},{}],128:[function(e,t,r){var h=e("./_SetCache"),p=e("./_arrayIncludes"),_=e("./_arrayIncludesWith"),v=e("./_cacheHas"),g=e("./_createSet"),y=e("./_setToArray");t.exports=function(e,t,r){var n=-1,o=p,a=e.length,i=!0,s=[],u=s;if(r)i=!1,o=_;else if(200<=a){var c=t?null:g(e);if(c)return y(c);i=!1,o=v,u=new h;}else u=t?[]:s;e:for(;++n<a;){var f=e[n],d=t?t(f):f;if(f=r||0!==f?f:0,i&&d==d){for(var l=u.length;l--;)if(u[l]===d)continue e;t&&u.push(d),s.push(f);}else o(u,d,r)||(u!==s&&u.push(d),s.push(f));}return s};},{"./_SetCache":58,"./_arrayIncludes":66,"./_arrayIncludesWith":67,"./_cacheHas":131,"./_createSet":152,"./_setToArray":212}],129:[function(e,t,r){var n=e("./_arrayMap");t.exports=function(t,e){return n(e,function(e){return t[e]})};},{"./_arrayMap":69}],130:[function(e,t,r){t.exports=function(e,t,r){for(var n=-1,o=e.length,a=t.length,i={};++n<o;){var s=n<a?t[n]:void 0;r(i,e[n],s);}return i};},{}],131:[function(e,t,r){t.exports=function(e,t){return e.has(t)};},{}],132:[function(e,t,r){var n=e("./identity");t.exports=function(e){return "function"==typeof e?e:n};},{"./identity":241}],133:[function(e,t,r){var n=e("./isArray"),o=e("./_isKey"),a=e("./_stringToPath"),i=e("./toString");t.exports=function(e,t){return n(e)?e:o(e,t)?[e]:a(i(e))};},{"./_isKey":183,"./_stringToPath":222,"./isArray":243,"./toString":283}],134:[function(e,t,r){var n=e("./_Uint8Array");t.exports=function(e){var t=new e.constructor(e.byteLength);return new n(t).set(new n(e)),t};},{"./_Uint8Array":61}],135:[function(e,t,r){var n=e("./_root"),o="object"==(0, _typeof2.default)(r)&&r&&!r.nodeType&&r,a=o&&"object"==(0, _typeof2.default)(t)&&t&&!t.nodeType&&t,i=a&&a.exports===o?n.Buffer:void 0,s=i?i.allocUnsafe:void 0;t.exports=function(e,t){if(t)return e.slice();var r=e.length,n=s?s(r):new e.constructor(r);return e.copy(n),n};},{"./_root":208}],136:[function(e,t,r){var n=e("./_cloneArrayBuffer");t.exports=function(e,t){var r=t?n(e.buffer):e.buffer;return new e.constructor(r,e.byteOffset,e.byteLength)};},{"./_cloneArrayBuffer":134}],137:[function(e,t,r){var n=/\w*$/;t.exports=function(e){var t=new e.constructor(e.source,n.exec(e));return t.lastIndex=e.lastIndex,t};},{}],138:[function(e,t,r){var n=e("./_Symbol"),o=n?n.prototype:void 0,a=o?o.valueOf:void 0;t.exports=function(e){return a?Object(a.call(e)):{}};},{"./_Symbol":60}],139:[function(e,t,r){var n=e("./_cloneArrayBuffer");t.exports=function(e,t){var r=t?n(e.buffer):e.buffer;return new e.constructor(r,e.byteOffset,e.length)};},{"./_cloneArrayBuffer":134}],140:[function(e,t,r){var f=e("./isSymbol");t.exports=function(e,t){if(e!==t){var r=void 0!==e,n=null===e,o=e==e,a=f(e),i=void 0!==t,s=null===t,u=t==t,c=f(t);if(!s&&!c&&!a&&t<e||a&&i&&u&&!s&&!c||n&&i&&u||!r&&u||!o)return 1;if(!n&&!a&&!c&&e<t||c&&r&&o&&!n&&!a||s&&r&&o||!i&&o||!u)return -1}return 0};},{"./isSymbol":256}],141:[function(e,t,r){var c=e("./_compareAscending");t.exports=function(e,t,r){for(var n=-1,o=e.criteria,a=t.criteria,i=o.length,s=r.length;++n<i;){var u=c(o[n],a[n]);if(u)return s<=n?u:u*("desc"==r[n]?-1:1)}return e.index-t.index};},{"./_compareAscending":140}],142:[function(e,t,r){t.exports=function(e,t){var r=-1,n=e.length;for(t=t||Array(n);++r<n;)t[r]=e[r];return t};},{}],143:[function(e,t,r){var c=e("./_assignValue"),f=e("./_baseAssignValue");t.exports=function(e,t,r,n){var o=!r;r=r||{};for(var a=-1,i=t.length;++a<i;){var s=t[a],u=n?n(r[s],e[s],s,r,e):void 0;void 0===u&&(u=e[s]),o?f(r,s,u):c(r,s,u);}return r};},{"./_assignValue":75,"./_baseAssignValue":79}],144:[function(e,t,r){var n=e("./_copyObject"),o=e("./_getSymbols");t.exports=function(e,t){return n(e,o(e),t)};},{"./_copyObject":143,"./_getSymbols":166}],145:[function(e,t,r){var n=e("./_copyObject"),o=e("./_getSymbolsIn");t.exports=function(e,t){return n(e,o(e),t)};},{"./_copyObject":143,"./_getSymbolsIn":167}],146:[function(e,t,r){var n=e("./_root")["__core-js_shared__"];t.exports=n;},{"./_root":208}],147:[function(e,t,r){var n=e("./_baseRest"),u=e("./_isIterateeCall");t.exports=function(s){return n(function(e,t){var r=-1,n=t.length,o=1<n?t[n-1]:void 0,a=2<n?t[2]:void 0;for(o=3<s.length&&"function"==typeof o?(n--,o):void 0,a&&u(t[0],t[1],a)&&(o=n<3?void 0:o,n=1),e=Object(e);++r<n;){var i=t[r];i&&s(e,i,r,o);}return e})};},{"./_baseRest":121,"./_isIterateeCall":182}],148:[function(e,t,r){var s=e("./isArrayLike");t.exports=function(a,i){return function(e,t){if(null==e)return e;if(!s(e))return a(e,t);for(var r=e.length,n=i?r:-1,o=Object(e);(i?n--:++n<r)&&!1!==t(o[n],n,o););return e}};},{"./isArrayLike":244}],149:[function(e,t,r){t.exports=function(u){return function(e,t,r){for(var n=-1,o=Object(e),a=r(e),i=a.length;i--;){var s=a[u?i:++n];if(!1===t(o[s],s,o))break}return e}};},{}],150:[function(e,t,r){var s=e("./_baseIteratee"),u=e("./isArrayLike"),c=e("./keys");t.exports=function(i){return function(e,t,r){var n=Object(e);if(!u(e)){var o=s(t,3);e=c(e),t=function(e){return o(n[e],e,n)};}var a=i(e,t,r);return -1<a?n[o?e[a]:a]:void 0}};},{"./_baseIteratee":105,"./isArrayLike":244,"./keys":259}],151:[function(e,t,r){var o=e("./_baseRange"),a=e("./_isIterateeCall"),i=e("./toFinite");t.exports=function(n){return function(e,t,r){return r&&"number"!=typeof r&&a(e,t,r)&&(t=r=void 0),e=i(e),void 0===t?(t=e,e=0):t=i(t),r=void 0===r?e<t?1:-1:i(r),o(e,t,r,n)}};},{"./_baseRange":119,"./_isIterateeCall":182,"./toFinite":279}],152:[function(e,t,r){var n=e("./_Set"),o=e("./noop"),a=e("./_setToArray"),i=n&&1/a(new n([,-0]))[1]==1/0?function(e){return new n(e)}:o;t.exports=i;},{"./_Set":57,"./_setToArray":212,"./noop":269}],153:[function(e,t,r){var n=e("./_getNative"),o=function(){try{var e=n(Object,"defineProperty");return e({},"",{}),e}catch(e){}}();t.exports=o;},{"./_getNative":163}],154:[function(e,t,r){var v=e("./_SetCache"),g=e("./_arraySome"),y=e("./_cacheHas");t.exports=function(e,t,r,n,o,a){var i=1&r,s=e.length,u=t.length;if(s!=u&&!(i&&s<u))return !1;var c=a.get(e);if(c&&a.get(t))return c==t;var f=-1,d=!0,l=2&r?new v:void 0;for(a.set(e,t),a.set(t,e);++f<s;){var h=e[f],p=t[f];if(n)var _=i?n(p,h,f,t,e,a):n(h,p,f,e,t,a);if(void 0!==_){if(_)continue;d=!1;break}if(l){if(!g(t,function(e,t){if(!y(l,t)&&(h===e||o(h,e,r,n,a)))return l.push(t)})){d=!1;break}}else if(h!==p&&!o(h,p,r,n,a)){d=!1;break}}return a.delete(e),a.delete(t),d};},{"./_SetCache":58,"./_arraySome":72,"./_cacheHas":131}],155:[function(e,t,r){var n=e("./_Symbol"),d=e("./_Uint8Array"),l=e("./eq"),h=e("./_equalArrays"),p=e("./_mapToArray"),_=e("./_setToArray"),o=n?n.prototype:void 0,v=o?o.valueOf:void 0;t.exports=function(e,t,r,n,o,a,i){switch(r){case"[object DataView]":if(e.byteLength!=t.byteLength||e.byteOffset!=t.byteOffset)return !1;e=e.buffer,t=t.buffer;case"[object ArrayBuffer]":return !(e.byteLength!=t.byteLength||!a(new d(e),new d(t)));case"[object Boolean]":case"[object Date]":case"[object Number]":return l(+e,+t);case"[object Error]":return e.name==t.name&&e.message==t.message;case"[object RegExp]":case"[object String]":return e==t+"";case"[object Map]":var s=p;case"[object Set]":var u=1&n;if(s=s||_,e.size!=t.size&&!u)return !1;var c=i.get(e);if(c)return c==t;n|=2,i.set(e,t);var f=h(s(e),s(t),n,o,a,i);return i.delete(e),f;case"[object Symbol]":if(v)return v.call(e)==v.call(t)}return !1};},{"./_Symbol":60,"./_Uint8Array":61,"./_equalArrays":154,"./_mapToArray":198,"./_setToArray":212,"./eq":231}],156:[function(e,t,r){var b=e("./_getAllKeys"),m=Object.prototype.hasOwnProperty;t.exports=function(e,t,r,n,o,a){var i=1&r,s=b(e),u=s.length;if(u!=b(t).length&&!i)return !1;for(var c=u;c--;){var f=s[c];if(!(i?f in t:m.call(t,f)))return !1}var d=a.get(e);if(d&&a.get(t))return d==t;var l=!0;a.set(e,t),a.set(t,e);for(var h=i;++c<u;){var p=e[f=s[c]],_=t[f];if(n)var v=i?n(_,p,f,t,e,a):n(p,_,f,e,t,a);if(!(void 0===v?p===_||o(p,_,r,n,a):v)){l=!1;break}h=h||"constructor"==f;}if(l&&!h){var g=e.constructor,y=t.constructor;g!=y&&"constructor"in e&&"constructor"in t&&!("function"==typeof g&&g instanceof g&&"function"==typeof y&&y instanceof y)&&(l=!1);}return a.delete(e),a.delete(t),l};},{"./_getAllKeys":159}],157:[function(e,t,r){var n=e("./flatten"),o=e("./_overRest"),a=e("./_setToString");t.exports=function(e){return a(o(e,void 0,n),e+"")};},{"./_overRest":207,"./_setToString":213,"./flatten":235}],158:[function(e,r,t){(function(e){var t="object"==(0, _typeof2.default)(e)&&e&&e.Object===Object&&e;r.exports=t;}).call(this,"undefined"!=typeof commonjsGlobal?commonjsGlobal:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});},{}],159:[function(e,t,r){var n=e("./_baseGetAllKeys"),o=e("./_getSymbols"),a=e("./keys");t.exports=function(e){return n(e,a,o)};},{"./_baseGetAllKeys":90,"./_getSymbols":166,"./keys":259}],160:[function(e,t,r){var n=e("./_baseGetAllKeys"),o=e("./_getSymbolsIn"),a=e("./keysIn");t.exports=function(e){return n(e,a,o)};},{"./_baseGetAllKeys":90,"./_getSymbolsIn":167,"./keysIn":260}],161:[function(e,t,r){var n=e("./_isKeyable");t.exports=function(e,t){var r=e.__data__;return n(t)?r["string"==typeof t?"string":"hash"]:r.map};},{"./_isKeyable":184}],162:[function(e,t,r){var a=e("./_isStrictComparable"),i=e("./keys");t.exports=function(e){for(var t=i(e),r=t.length;r--;){var n=t[r],o=e[n];t[r]=[n,o,a(o)];}return t};},{"./_isStrictComparable":187,"./keys":259}],163:[function(e,t,r){var n=e("./_baseIsNative"),o=e("./_getValue");t.exports=function(e,t){var r=o(e,t);return n(r)?r:void 0};},{"./_baseIsNative":102,"./_getValue":169}],164:[function(e,t,r){var n=e("./_overArg")(Object.getPrototypeOf,Object);t.exports=n;},{"./_overArg":206}],165:[function(e,t,r){var n=e("./_Symbol"),o=Object.prototype,a=o.hasOwnProperty,i=o.toString,s=n?n.toStringTag:void 0;t.exports=function(e){var t=a.call(e,s),r=e[s];try{var n=!(e[s]=void 0);}catch(e){}var o=i.call(e);return n&&(t?e[s]=r:delete e[s]),o};},{"./_Symbol":60}],166:[function(e,t,r){var n=e("./_arrayFilter"),o=e("./stubArray"),a=Object.prototype.propertyIsEnumerable,i=Object.getOwnPropertySymbols,s=i?function(t){return null==t?[]:(t=Object(t),n(i(t),function(e){return a.call(t,e)}))}:o;t.exports=s;},{"./_arrayFilter":65,"./stubArray":277}],167:[function(e,t,r){var n=e("./_arrayPush"),o=e("./_getPrototype"),a=e("./_getSymbols"),i=e("./stubArray"),s=Object.getOwnPropertySymbols?function(e){for(var t=[];e;)n(t,a(e)),e=o(e);return t}:i;t.exports=s;},{"./_arrayPush":70,"./_getPrototype":164,"./_getSymbols":166,"./stubArray":277}],168:[function(e,t,r){var n=e("./_DataView"),o=e("./_Map"),a=e("./_Promise"),i=e("./_Set"),s=e("./_WeakMap"),u=e("./_baseGetTag"),c=e("./_toSource"),f="[object Map]",d="[object Promise]",l="[object Set]",h="[object WeakMap]",p="[object DataView]",_=c(n),v=c(o),g=c(a),y=c(i),b=c(s),m=u;(n&&m(new n(new ArrayBuffer(1)))!=p||o&&m(new o)!=f||a&&m(a.resolve())!=d||i&&m(new i)!=l||s&&m(new s)!=h)&&(m=function(e){var t=u(e),r="[object Object]"==t?e.constructor:void 0,n=r?c(r):"";if(n)switch(n){case _:return p;case v:return f;case g:return d;case y:return l;case b:return h}return t}),t.exports=m;},{"./_DataView":51,"./_Map":54,"./_Promise":56,"./_Set":57,"./_WeakMap":62,"./_baseGetTag":91,"./_toSource":224}],169:[function(e,t,r){t.exports=function(e,t){return null==e?void 0:e[t]};},{}],170:[function(e,t,r){var s=e("./_castPath"),u=e("./isArguments"),c=e("./isArray"),f=e("./_isIndex"),d=e("./isLength"),l=e("./_toKey");t.exports=function(e,t,r){for(var n=-1,o=(t=s(t,e)).length,a=!1;++n<o;){var i=l(t[n]);if(!(a=null!=e&&r(e,i)))break;e=e[i];}return a||++n!=o?a:!!(o=null==e?0:e.length)&&d(o)&&f(i,o)&&(c(e)||u(e))};},{"./_castPath":133,"./_isIndex":181,"./_toKey":223,"./isArguments":242,"./isArray":243,"./isLength":249}],171:[function(e,t,r){var n=RegExp("[\\u200d\\ud800-\\udfff\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff\\ufe0e\\ufe0f]");t.exports=function(e){return n.test(e)};},{}],172:[function(e,t,r){var n=e("./_nativeCreate");t.exports=function(){this.__data__=n?n(null):{},this.size=0;};},{"./_nativeCreate":201}],173:[function(e,t,r){t.exports=function(e){var t=this.has(e)&&delete this.__data__[e];return this.size-=t?1:0,t};},{}],174:[function(e,t,r){var n=e("./_nativeCreate"),o=Object.prototype.hasOwnProperty;t.exports=function(e){var t=this.__data__;if(n){var r=t[e];return "__lodash_hash_undefined__"===r?void 0:r}return o.call(t,e)?t[e]:void 0};},{"./_nativeCreate":201}],175:[function(e,t,r){var n=e("./_nativeCreate"),o=Object.prototype.hasOwnProperty;t.exports=function(e){var t=this.__data__;return n?void 0!==t[e]:o.call(t,e)};},{"./_nativeCreate":201}],176:[function(e,t,r){var n=e("./_nativeCreate");t.exports=function(e,t){var r=this.__data__;return this.size+=this.has(e)?0:1,r[e]=n&&void 0===t?"__lodash_hash_undefined__":t,this};},{"./_nativeCreate":201}],177:[function(e,t,r){var n=Object.prototype.hasOwnProperty;t.exports=function(e){var t=e.length,r=new e.constructor(t);return t&&"string"==typeof e[0]&&n.call(e,"index")&&(r.index=e.index,r.input=e.input),r};},{}],178:[function(e,t,r){var o=e("./_cloneArrayBuffer"),a=e("./_cloneDataView"),i=e("./_cloneRegExp"),s=e("./_cloneSymbol"),u=e("./_cloneTypedArray");t.exports=function(e,t,r){var n=e.constructor;switch(t){case"[object ArrayBuffer]":return o(e);case"[object Boolean]":case"[object Date]":return new n(+e);case"[object DataView]":return a(e,r);case"[object Float32Array]":case"[object Float64Array]":case"[object Int8Array]":case"[object Int16Array]":case"[object Int32Array]":case"[object Uint8Array]":case"[object Uint8ClampedArray]":case"[object Uint16Array]":case"[object Uint32Array]":return u(e,r);case"[object Map]":return new n;case"[object Number]":case"[object String]":return new n(e);case"[object RegExp]":return i(e);case"[object Set]":return new n;case"[object Symbol]":return s(e)}};},{"./_cloneArrayBuffer":134,"./_cloneDataView":136,"./_cloneRegExp":137,"./_cloneSymbol":138,"./_cloneTypedArray":139}],179:[function(e,t,r){var n=e("./_baseCreate"),o=e("./_getPrototype"),a=e("./_isPrototype");t.exports=function(e){return "function"!=typeof e.constructor||a(e)?{}:n(o(e))};},{"./_baseCreate":81,"./_getPrototype":164,"./_isPrototype":186}],180:[function(e,t,r){var n=e("./_Symbol"),o=e("./isArguments"),a=e("./isArray"),i=n?n.isConcatSpreadable:void 0;t.exports=function(e){return a(e)||o(e)||!!(i&&e&&e[i])};},{"./_Symbol":60,"./isArguments":242,"./isArray":243}],181:[function(e,t,r){var n=/^(?:0|[1-9]\d*)$/;t.exports=function(e,t){var r=(0, _typeof2.default)(e);return !!(t=null==t?9007199254740991:t)&&("number"==r||"symbol"!=r&&n.test(e))&&-1<e&&e%1==0&&e<t};},{}],182:[function(e,t,r){var o=e("./eq"),a=e("./isArrayLike"),i=e("./_isIndex"),s=e("./isObject");t.exports=function(e,t,r){if(!s(r))return !1;var n=(0, _typeof2.default)(t);return !!("number"==n?a(r)&&i(t,r.length):"string"==n&&t in r)&&o(r[t],e)};},{"./_isIndex":181,"./eq":231,"./isArrayLike":244,"./isObject":251}],183:[function(e,t,r){var n=e("./isArray"),o=e("./isSymbol"),a=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,i=/^\w*$/;t.exports=function(e,t){if(n(e))return !1;var r=(0, _typeof2.default)(e);return !("number"!=r&&"symbol"!=r&&"boolean"!=r&&null!=e&&!o(e))||(i.test(e)||!a.test(e)||null!=t&&e in Object(t))};},{"./isArray":243,"./isSymbol":256}],184:[function(e,t,r){t.exports=function(e){var t=(0, _typeof2.default)(e);return "string"==t||"number"==t||"symbol"==t||"boolean"==t?"__proto__"!==e:null===e};},{}],185:[function(e,t,r){var n,o=e("./_coreJsData"),a=(n=/[^.]+$/.exec(o&&o.keys&&o.keys.IE_PROTO||""))?"Symbol(src)_1."+n:"";t.exports=function(e){return !!a&&a in e};},{"./_coreJsData":146}],186:[function(e,t,r){var n=Object.prototype;t.exports=function(e){var t=e&&e.constructor;return e===("function"==typeof t&&t.prototype||n)};},{}],187:[function(e,t,r){var n=e("./isObject");t.exports=function(e){return e==e&&!n(e)};},{"./isObject":251}],188:[function(e,t,r){t.exports=function(){this.__data__=[],this.size=0;};},{}],189:[function(e,t,r){var n=e("./_assocIndexOf"),o=Array.prototype.splice;t.exports=function(e){var t=this.__data__,r=n(t,e);return !(r<0)&&(r==t.length-1?t.pop():o.call(t,r,1),--this.size,!0)};},{"./_assocIndexOf":76}],190:[function(e,t,r){var n=e("./_assocIndexOf");t.exports=function(e){var t=this.__data__,r=n(t,e);return r<0?void 0:t[r][1]};},{"./_assocIndexOf":76}],191:[function(e,t,r){var n=e("./_assocIndexOf");t.exports=function(e){return -1<n(this.__data__,e)};},{"./_assocIndexOf":76}],192:[function(e,t,r){var o=e("./_assocIndexOf");t.exports=function(e,t){var r=this.__data__,n=o(r,e);return n<0?(++this.size,r.push([e,t])):r[n][1]=t,this};},{"./_assocIndexOf":76}],193:[function(e,t,r){var n=e("./_Hash"),o=e("./_ListCache"),a=e("./_Map");t.exports=function(){this.size=0,this.__data__={hash:new n,map:new(a||o),string:new n};};},{"./_Hash":52,"./_ListCache":53,"./_Map":54}],194:[function(e,t,r){var n=e("./_getMapData");t.exports=function(e){var t=n(this,e).delete(e);return this.size-=t?1:0,t};},{"./_getMapData":161}],195:[function(e,t,r){var n=e("./_getMapData");t.exports=function(e){return n(this,e).get(e)};},{"./_getMapData":161}],196:[function(e,t,r){var n=e("./_getMapData");t.exports=function(e){return n(this,e).has(e)};},{"./_getMapData":161}],197:[function(e,t,r){var o=e("./_getMapData");t.exports=function(e,t){var r=o(this,e),n=r.size;return r.set(e,t),this.size+=r.size==n?0:1,this};},{"./_getMapData":161}],198:[function(e,t,r){t.exports=function(e){var r=-1,n=Array(e.size);return e.forEach(function(e,t){n[++r]=[t,e];}),n};},{}],199:[function(e,t,r){t.exports=function(t,r){return function(e){return null!=e&&(e[t]===r&&(void 0!==r||t in Object(e)))}};},{}],200:[function(e,t,r){var n=e("./memoize");t.exports=function(e){var t=n(e,function(e){return 500===r.size&&r.clear(),e}),r=t.cache;return t};},{"./memoize":265}],201:[function(e,t,r){var n=e("./_getNative")(Object,"create");t.exports=n;},{"./_getNative":163}],202:[function(e,t,r){var n=e("./_overArg")(Object.keys,Object);t.exports=n;},{"./_overArg":206}],203:[function(e,t,r){t.exports=function(e){var t=[];if(null!=e)for(var r in Object(e))t.push(r);return t};},{}],204:[function(e,t,r){var n=e("./_freeGlobal"),o="object"==(0, _typeof2.default)(r)&&r&&!r.nodeType&&r,a=o&&"object"==(0, _typeof2.default)(t)&&t&&!t.nodeType&&t,i=a&&a.exports===o&&n.process,s=function(){try{var e=a&&a.require&&a.require("util").types;return e||i&&i.binding&&i.binding("util")}catch(e){}}();t.exports=s;},{"./_freeGlobal":158}],205:[function(e,t,r){var n=Object.prototype.toString;t.exports=function(e){return n.call(e)};},{}],206:[function(e,t,r){t.exports=function(t,r){return function(e){return t(r(e))}};},{}],207:[function(e,t,r){var u=e("./_apply"),c=Math.max;t.exports=function(a,i,s){return i=c(void 0===i?a.length-1:i,0),function(){for(var e=arguments,t=-1,r=c(e.length-i,0),n=Array(r);++t<r;)n[t]=e[i+t];t=-1;for(var o=Array(i+1);++t<i;)o[t]=e[t];return o[i]=s(n),u(a,this,o)}};},{"./_apply":63}],208:[function(e,t,r){var n=e("./_freeGlobal"),o="object"==("undefined"==typeof self?"undefined":(0, _typeof2.default)(self))&&self&&self.Object===Object&&self,a=n||o||Function("return this")();t.exports=a;},{"./_freeGlobal":158}],209:[function(e,t,r){t.exports=function(e,t){return "__proto__"==t?void 0:e[t]};},{}],210:[function(e,t,r){t.exports=function(e){return this.__data__.set(e,"__lodash_hash_undefined__"),this};},{}],211:[function(e,t,r){t.exports=function(e){return this.__data__.has(e)};},{}],212:[function(e,t,r){t.exports=function(e){var t=-1,r=Array(e.size);return e.forEach(function(e){r[++t]=e;}),r};},{}],213:[function(e,t,r){var n=e("./_baseSetToString"),o=e("./_shortOut")(n);t.exports=o;},{"./_baseSetToString":123,"./_shortOut":214}],214:[function(e,t,r){var a=Date.now;t.exports=function(r){var n=0,o=0;return function(){var e=a(),t=16-(e-o);if(o=e,0<t){if(800<=++n)return arguments[0]}else n=0;return r.apply(void 0,arguments)}};},{}],215:[function(e,t,r){var n=e("./_ListCache");t.exports=function(){this.__data__=new n,this.size=0;};},{"./_ListCache":53}],216:[function(e,t,r){t.exports=function(e){var t=this.__data__,r=t.delete(e);return this.size=t.size,r};},{}],217:[function(e,t,r){t.exports=function(e){return this.__data__.get(e)};},{}],218:[function(e,t,r){t.exports=function(e){return this.__data__.has(e)};},{}],219:[function(e,t,r){var o=e("./_ListCache"),a=e("./_Map"),i=e("./_MapCache");t.exports=function(e,t){var r=this.__data__;if(r instanceof o){var n=r.__data__;if(!a||n.length<199)return n.push([e,t]),this.size=++r.size,this;r=this.__data__=new i(n);}return r.set(e,t),this.size=r.size,this};},{"./_ListCache":53,"./_Map":54,"./_MapCache":55}],220:[function(e,t,r){t.exports=function(e,t,r){for(var n=r-1,o=e.length;++n<o;)if(e[n]===t)return n;return -1};},{}],221:[function(e,t,r){var n=e("./_asciiSize"),o=e("./_hasUnicode"),a=e("./_unicodeSize");t.exports=function(e){return o(e)?a(e):n(e)};},{"./_asciiSize":73,"./_hasUnicode":171,"./_unicodeSize":225}],222:[function(e,t,r){var n=e("./_memoizeCapped"),a=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,i=/\\(\\)?/g,o=n(function(e){var o=[];return 46===e.charCodeAt(0)&&o.push(""),e.replace(a,function(e,t,r,n){o.push(r?n.replace(i,"$1"):t||e);}),o});t.exports=o;},{"./_memoizeCapped":200}],223:[function(e,t,r){var n=e("./isSymbol");t.exports=function(e){if("string"==typeof e||n(e))return e;var t=e+"";return "0"==t&&1/e==-1/0?"-0":t};},{"./isSymbol":256}],224:[function(e,t,r){var n=Function.prototype.toString;t.exports=function(e){if(null!=e){try{return n.call(e)}catch(e){}try{return e+""}catch(e){}}return ""};},{}],225:[function(e,t,r){var n="\\ud800-\\udfff",o="["+n+"]",a="[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]",i="\\ud83c[\\udffb-\\udfff]",s="[^"+n+"]",u="(?:\\ud83c[\\udde6-\\uddff]){2}",c="[\\ud800-\\udbff][\\udc00-\\udfff]",f="(?:"+a+"|"+i+")"+"?",d="[\\ufe0e\\ufe0f]?",l=d+f+("(?:\\u200d(?:"+[s,u,c].join("|")+")"+d+f+")*"),h="(?:"+[s+a+"?",a,u,c,o].join("|")+")",p=RegExp(i+"(?="+i+")|"+h+l,"g");t.exports=function(e){for(var t=p.lastIndex=0;p.test(e);)++t;return t};},{}],226:[function(e,t,r){var n=e("./_baseClone");t.exports=function(e){return n(e,4)};},{"./_baseClone":80}],227:[function(e,t,r){var n=e("./_baseClone");t.exports=function(e){return n(e,5)};},{"./_baseClone":80}],228:[function(e,t,r){t.exports=function(e){return function(){return e}};},{}],229:[function(e,t,r){var n=e("./_baseRest"),d=e("./eq"),l=e("./_isIterateeCall"),h=e("./keysIn"),p=Object.prototype,_=p.hasOwnProperty,o=n(function(e,t){e=Object(e);var r=-1,n=t.length,o=2<n?t[2]:void 0;for(o&&l(t[0],t[1],o)&&(n=1);++r<n;)for(var a=t[r],i=h(a),s=-1,u=i.length;++s<u;){var c=i[s],f=e[c];(void 0===f||d(f,p[c])&&!_.call(e,c))&&(e[c]=a[c]);}return e});t.exports=o;},{"./_baseRest":121,"./_isIterateeCall":182,"./eq":231,"./keysIn":260}],230:[function(e,t,r){t.exports=e("./forEach");},{"./forEach":236}],231:[function(e,t,r){t.exports=function(e,t){return e===t||e!=e&&t!=t};},{}],232:[function(e,t,r){var n=e("./_arrayFilter"),o=e("./_baseFilter"),a=e("./_baseIteratee"),i=e("./isArray");t.exports=function(e,t){return (i(e)?n:o)(e,a(t,3))};},{"./_arrayFilter":65,"./_baseFilter":84,"./_baseIteratee":105,"./isArray":243}],233:[function(e,t,r){var n=e("./_createFind")(e("./findIndex"));t.exports=n;},{"./_createFind":150,"./findIndex":234}],234:[function(e,t,r){var a=e("./_baseFindIndex"),i=e("./_baseIteratee"),s=e("./toInteger"),u=Math.max;t.exports=function(e,t,r){var n=null==e?0:e.length;if(!n)return -1;var o=null==r?0:s(r);return o<0&&(o=u(n+o,0)),a(e,i(t,3),o)};},{"./_baseFindIndex":85,"./_baseIteratee":105,"./toInteger":280}],235:[function(e,t,r){var n=e("./_baseFlatten");t.exports=function(e){return (null==e?0:e.length)?n(e,1):[]};},{"./_baseFlatten":86}],236:[function(e,t,r){var n=e("./_arrayEach"),o=e("./_baseEach"),a=e("./_castFunction"),i=e("./isArray");t.exports=function(e,t){return (i(e)?n:o)(e,a(t))};},{"./_arrayEach":64,"./_baseEach":82,"./_castFunction":132,"./isArray":243}],237:[function(e,t,r){var n=e("./_baseFor"),o=e("./_castFunction"),a=e("./keysIn");t.exports=function(e,t){return null==e?e:n(e,o(t),a)};},{"./_baseFor":87,"./_castFunction":132,"./keysIn":260}],238:[function(e,t,r){var o=e("./_baseGet");t.exports=function(e,t,r){var n=null==e?void 0:o(e,t);return void 0===n?r:n};},{"./_baseGet":89}],239:[function(e,t,r){var n=e("./_baseHas"),o=e("./_hasPath");t.exports=function(e,t){return null!=e&&o(e,t,n)};},{"./_baseHas":93,"./_hasPath":170}],240:[function(e,t,r){var n=e("./_baseHasIn"),o=e("./_hasPath");t.exports=function(e,t){return null!=e&&o(e,t,n)};},{"./_baseHasIn":94,"./_hasPath":170}],241:[function(e,t,r){t.exports=function(e){return e};},{}],242:[function(e,t,r){var n=e("./_baseIsArguments"),o=e("./isObjectLike"),a=Object.prototype,i=a.hasOwnProperty,s=a.propertyIsEnumerable,u=n(function(){return arguments}())?n:function(e){return o(e)&&i.call(e,"callee")&&!s.call(e,"callee")};t.exports=u;},{"./_baseIsArguments":96,"./isObjectLike":252}],243:[function(e,t,r){var n=Array.isArray;t.exports=n;},{}],244:[function(e,t,r){var n=e("./isFunction"),o=e("./isLength");t.exports=function(e){return null!=e&&o(e.length)&&!n(e)};},{"./isFunction":248,"./isLength":249}],245:[function(e,t,r){var n=e("./isArrayLike"),o=e("./isObjectLike");t.exports=function(e){return o(e)&&n(e)};},{"./isArrayLike":244,"./isObjectLike":252}],246:[function(e,t,r){var n=e("./_root"),o=e("./stubFalse"),a="object"==(0, _typeof2.default)(r)&&r&&!r.nodeType&&r,i=a&&"object"==(0, _typeof2.default)(t)&&t&&!t.nodeType&&t,s=i&&i.exports===a?n.Buffer:void 0,u=(s?s.isBuffer:void 0)||o;t.exports=u;},{"./_root":208,"./stubFalse":278}],247:[function(e,t,r){var n=e("./_baseKeys"),o=e("./_getTag"),a=e("./isArguments"),i=e("./isArray"),s=e("./isArrayLike"),u=e("./isBuffer"),c=e("./_isPrototype"),f=e("./isTypedArray"),d=Object.prototype.hasOwnProperty;t.exports=function(e){if(null==e)return !0;if(s(e)&&(i(e)||"string"==typeof e||"function"==typeof e.splice||u(e)||f(e)||a(e)))return !e.length;var t=o(e);if("[object Map]"==t||"[object Set]"==t)return !e.size;if(c(e))return !n(e).length;for(var r in e)if(d.call(e,r))return !1;return !0};},{"./_baseKeys":106,"./_getTag":168,"./_isPrototype":186,"./isArguments":242,"./isArray":243,"./isArrayLike":244,"./isBuffer":246,"./isTypedArray":257}],248:[function(e,t,r){var n=e("./_baseGetTag"),o=e("./isObject");t.exports=function(e){if(!o(e))return !1;var t=n(e);return "[object Function]"==t||"[object GeneratorFunction]"==t||"[object AsyncFunction]"==t||"[object Proxy]"==t};},{"./_baseGetTag":91,"./isObject":251}],249:[function(e,t,r){t.exports=function(e){return "number"==typeof e&&-1<e&&e%1==0&&e<=9007199254740991};},{}],250:[function(e,t,r){var n=e("./_baseIsMap"),o=e("./_baseUnary"),a=e("./_nodeUtil"),i=a&&a.isMap,s=i?o(i):n;t.exports=s;},{"./_baseIsMap":99,"./_baseUnary":127,"./_nodeUtil":204}],251:[function(e,t,r){t.exports=function(e){var t=(0, _typeof2.default)(e);return null!=e&&("object"==t||"function"==t)};},{}],252:[function(e,t,r){t.exports=function(e){return null!=e&&"object"==(0, _typeof2.default)(e)};},{}],253:[function(e,t,r){var n=e("./_baseGetTag"),o=e("./_getPrototype"),a=e("./isObjectLike"),i=Function.prototype,s=Object.prototype,u=i.toString,c=s.hasOwnProperty,f=u.call(Object);t.exports=function(e){if(!a(e)||"[object Object]"!=n(e))return !1;var t=o(e);if(null===t)return !0;var r=c.call(t,"constructor")&&t.constructor;return "function"==typeof r&&r instanceof r&&u.call(r)==f};},{"./_baseGetTag":91,"./_getPrototype":164,"./isObjectLike":252}],254:[function(e,t,r){var n=e("./_baseIsSet"),o=e("./_baseUnary"),a=e("./_nodeUtil"),i=a&&a.isSet,s=i?o(i):n;t.exports=s;},{"./_baseIsSet":103,"./_baseUnary":127,"./_nodeUtil":204}],255:[function(e,t,r){var n=e("./_baseGetTag"),o=e("./isArray"),a=e("./isObjectLike");t.exports=function(e){return "string"==typeof e||!o(e)&&a(e)&&"[object String]"==n(e)};},{"./_baseGetTag":91,"./isArray":243,"./isObjectLike":252}],256:[function(e,t,r){var n=e("./_baseGetTag"),o=e("./isObjectLike");t.exports=function(e){return "symbol"==(0, _typeof2.default)(e)||o(e)&&"[object Symbol]"==n(e)};},{"./_baseGetTag":91,"./isObjectLike":252}],257:[function(e,t,r){var n=e("./_baseIsTypedArray"),o=e("./_baseUnary"),a=e("./_nodeUtil"),i=a&&a.isTypedArray,s=i?o(i):n;t.exports=s;},{"./_baseIsTypedArray":104,"./_baseUnary":127,"./_nodeUtil":204}],258:[function(e,t,r){t.exports=function(e){return void 0===e};},{}],259:[function(e,t,r){var n=e("./_arrayLikeKeys"),o=e("./_baseKeys"),a=e("./isArrayLike");t.exports=function(e){return a(e)?n(e):o(e)};},{"./_arrayLikeKeys":68,"./_baseKeys":106,"./isArrayLike":244}],260:[function(e,t,r){var n=e("./_arrayLikeKeys"),o=e("./_baseKeysIn"),a=e("./isArrayLike");t.exports=function(e){return a(e)?n(e,!0):o(e)};},{"./_arrayLikeKeys":68,"./_baseKeysIn":107,"./isArrayLike":244}],261:[function(e,t,r){t.exports=function(e){var t=null==e?0:e.length;return t?e[t-1]:void 0};},{}],262:[function(e,t,r){var n=e("./_arrayMap"),o=e("./_baseIteratee"),a=e("./_baseMap"),i=e("./isArray");t.exports=function(e,t){return (i(e)?n:a)(e,o(t,3))};},{"./_arrayMap":69,"./_baseIteratee":105,"./_baseMap":109,"./isArray":243}],263:[function(e,t,r){var a=e("./_baseAssignValue"),i=e("./_baseForOwn"),s=e("./_baseIteratee");t.exports=function(e,n){var o={};return n=s(n,3),i(e,function(e,t,r){a(o,t,n(e,t,r));}),o};},{"./_baseAssignValue":79,"./_baseForOwn":88,"./_baseIteratee":105}],264:[function(e,t,r){var n=e("./_baseExtremum"),o=e("./_baseGt"),a=e("./identity");t.exports=function(e){return e&&e.length?n(e,a,o):void 0};},{"./_baseExtremum":83,"./_baseGt":92,"./identity":241}],265:[function(e,t,r){var n=e("./_MapCache"),s="Expected a function";function u(o,a){if("function"!=typeof o||null!=a&&"function"!=typeof a)throw new TypeError(s);function i(){var e=arguments,t=a?a.apply(this,e):e[0],r=i.cache;if(r.has(t))return r.get(t);var n=o.apply(this,e);return i.cache=r.set(t,n)||r,n}return i.cache=new(u.Cache||n),i}u.Cache=n,t.exports=u;},{"./_MapCache":55}],266:[function(e,t,r){var n=e("./_baseMerge"),o=e("./_createAssigner")(function(e,t,r){n(e,t,r);});t.exports=o;},{"./_baseMerge":112,"./_createAssigner":147}],267:[function(e,t,r){var n=e("./_baseExtremum"),o=e("./_baseLt"),a=e("./identity");t.exports=function(e){return e&&e.length?n(e,a,o):void 0};},{"./_baseExtremum":83,"./_baseLt":108,"./identity":241}],268:[function(e,t,r){var n=e("./_baseExtremum"),o=e("./_baseIteratee"),a=e("./_baseLt");t.exports=function(e,t){return e&&e.length?n(e,o(t,2),a):void 0};},{"./_baseExtremum":83,"./_baseIteratee":105,"./_baseLt":108}],269:[function(e,t,r){t.exports=function(){};},{}],270:[function(e,t,r){var n=e("./_root");t.exports=function(){return n.Date.now()};},{"./_root":208}],271:[function(e,t,r){var n=e("./_basePick"),o=e("./_flatRest")(function(e,t){return null==e?{}:n(e,t)});t.exports=o;},{"./_basePick":115,"./_flatRest":157}],272:[function(e,t,r){var n=e("./_baseProperty"),o=e("./_basePropertyDeep"),a=e("./_isKey"),i=e("./_toKey");t.exports=function(e){return a(e)?n(i(e)):o(e)};},{"./_baseProperty":117,"./_basePropertyDeep":118,"./_isKey":183,"./_toKey":223}],273:[function(e,t,r){var n=e("./_createRange")();t.exports=n;},{"./_createRange":151}],274:[function(e,t,r){var a=e("./_arrayReduce"),i=e("./_baseEach"),s=e("./_baseIteratee"),u=e("./_baseReduce"),c=e("./isArray");t.exports=function(e,t,r){var n=c(e)?a:u,o=arguments.length<3;return n(e,s(t,4),r,o,i)};},{"./_arrayReduce":71,"./_baseEach":82,"./_baseIteratee":105,"./_baseReduce":120,"./isArray":243}],275:[function(e,t,r){var n=e("./_baseKeys"),o=e("./_getTag"),a=e("./isArrayLike"),i=e("./isString"),s=e("./_stringSize");t.exports=function(e){if(null==e)return 0;if(a(e))return i(e)?s(e):e.length;var t=o(e);return "[object Map]"==t||"[object Set]"==t?e.size:n(e).length};},{"./_baseKeys":106,"./_getTag":168,"./_stringSize":221,"./isArrayLike":244,"./isString":255}],276:[function(e,t,r){var n=e("./_baseFlatten"),o=e("./_baseOrderBy"),a=e("./_baseRest"),i=e("./_isIterateeCall"),s=a(function(e,t){if(null==e)return [];var r=t.length;return 1<r&&i(e,t[0],t[1])?t=[]:2<r&&i(t[0],t[1],t[2])&&(t=[t[0]]),o(e,n(t,1),[])});t.exports=s;},{"./_baseFlatten":86,"./_baseOrderBy":114,"./_baseRest":121,"./_isIterateeCall":182}],277:[function(e,t,r){t.exports=function(){return []};},{}],278:[function(e,t,r){t.exports=function(){return !1};},{}],279:[function(e,t,r){var n=e("./toNumber");t.exports=function(e){return e?(e=n(e))!==1/0&&e!==-1/0?e==e?e:0:17976931348623157e292*(e<0?-1:1):0===e?e:0};},{"./toNumber":281}],280:[function(e,t,r){var n=e("./toFinite");t.exports=function(e){var t=n(e),r=t%1;return t==t?r?t-r:t:0};},{"./toFinite":279}],281:[function(e,t,r){var n=e("./isObject"),o=e("./isSymbol"),a=/^\s+|\s+$/g,i=/^[-+]0x[0-9a-f]+$/i,s=/^0b[01]+$/i,u=/^0o[0-7]+$/i,c=parseInt;t.exports=function(e){if("number"==typeof e)return e;if(o(e))return NaN;if(n(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=n(t)?t+"":t;}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(a,"");var r=s.test(e);return r||u.test(e)?c(e.slice(2),r?2:8):i.test(e)?NaN:+e};},{"./isObject":251,"./isSymbol":256}],282:[function(e,t,r){var n=e("./_copyObject"),o=e("./keysIn");t.exports=function(e){return n(e,o(e))};},{"./_copyObject":143,"./keysIn":260}],283:[function(e,t,r){var n=e("./_baseToString");t.exports=function(e){return null==e?"":n(e)};},{"./_baseToString":126}],284:[function(e,t,r){var i=e("./_arrayEach"),s=e("./_baseCreate"),u=e("./_baseForOwn"),c=e("./_baseIteratee"),f=e("./_getPrototype"),d=e("./isArray"),l=e("./isBuffer"),h=e("./isFunction"),p=e("./isObject"),_=e("./isTypedArray");t.exports=function(e,n,o){var t=d(e),r=t||l(e)||_(e);if(n=c(n,4),null==o){var a=e&&e.constructor;o=r?t?new a:[]:p(e)&&h(a)?s(f(e)):{};}return (r?i:u)(e,function(e,t,r){return n(o,e,t,r)}),o};},{"./_arrayEach":64,"./_baseCreate":81,"./_baseForOwn":88,"./_baseIteratee":105,"./_getPrototype":164,"./isArray":243,"./isBuffer":246,"./isFunction":248,"./isObject":251,"./isTypedArray":257}],285:[function(e,t,r){var n=e("./_baseFlatten"),o=e("./_baseRest"),a=e("./_baseUniq"),i=e("./isArrayLikeObject"),s=o(function(e){return a(n(e,1,i,!0))});t.exports=s;},{"./_baseFlatten":86,"./_baseRest":121,"./_baseUniq":128,"./isArrayLikeObject":245}],286:[function(e,t,r){var n=e("./toString"),o=0;t.exports=function(e){var t=++o;return n(e)+t};},{"./toString":283}],287:[function(e,t,r){var n=e("./_baseValues"),o=e("./keys");t.exports=function(e){return null==e?[]:n(e,o(e))};},{"./_baseValues":129,"./keys":259}],288:[function(e,t,r){var n=e("./_assignValue"),o=e("./_baseZipObject");t.exports=function(e,t){return o(e||[],t||[],n)};},{"./_assignValue":75,"./_baseZipObject":130}]},{},[1])(1)});
});

var dagre$1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _dagre=interopRequireDefault(dagre);index_es.global.registerLayout("dagre",_dagre.default);var _default=_dagre.default;exports.default=_default;
});

unwrapExports(dagre$1);

var tree = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _hierarchy=interopRequireDefault(hierarchy),TREE=function(){var f=(0, _hierarchy.default)().sort(null).value(null),_=layout_treeSeparation,y=[1,1],d=null;function t(e,t){var r=f.call(this,e,t),n=r[0],l=function(e){var t,r={A:null,children:[e]},n=[r];for(;null!=(t=n.pop());)for(var l,a=t.children,i=0,u=a.length;i<u;++i)n.push((a[i]=l={_:a[i],parent:t,children:(l=a[i].children)&&l.slice()||[],A:null,a:null,z:0,m:0,c:0,s:0,t:null,i:i}).a=l);return r.children[0]}(n);if(_hierarchy.default.layout_hierarchyVisitAfter(l,p),l.parent.m=-l.z,_hierarchy.default.layout_hierarchyVisitBefore(l,s),d)_hierarchy.default.layout_hierarchyVisitBefore(n,m);else{var a=n,i=n,u=n;_hierarchy.default.layout_hierarchyVisitBefore(n,function(e){e.x<a.x&&(a=e),e.x>i.x&&(i=e),e.depth>u.depth&&(u=e);});var o=_(a,i)/2-a.x,h=y[0]/(i.x+_(i,a)/2+o),c=y[1]/(u.depth||1);_hierarchy.default.layout_hierarchyVisitBefore(n,function(e){e.x=(e.x+o)*h,e.y=e.depth*c;});}return r}function p(e){var t=e.children,r=e.parent.children,n=e.i?r[e.i-1]:null;if(t.length){layout_treeShift(e);var l=(t[0].z+t[t.length-1].z)/2;n?(e.z=n.z+_(e._,n._),e.m=e.z-l):e.z=l;}else n&&(e.z=n.z+_(e._,n._));e.parent.A=function(e,t,r){if(t){for(var n,l=e,a=e,i=t,u=l.parent.children[0],o=l.m,h=a.m,c=i.m,f=u.m;i=layout_treeRight(i),l=layout_treeLeft(l),i&&l;)u=layout_treeLeft(u),(a=layout_treeRight(a)).a=e,0<(n=i.z+c-l.z-o+_(i._,l._))&&(layout_treeMove(layout_treeAncestor(i,e,r),e,n),o+=n,h+=n),c+=i.m,o+=l.m,f+=u.m,h+=a.m;i&&!layout_treeRight(a)&&(a.t=i,a.m+=c-h),l&&!layout_treeLeft(u)&&(u.t=l,u.m+=o-f,r=e);}return r}(e,n,e.parent.A||r[0]);}function s(e){e._.x=e.z+e.parent.m,e.m+=e.parent.m;}function m(e){e.x*=y[0],e.y=e.depth*y[1];}return t.separation=function(e){return arguments.length?(_=e,t):_},t.size=function(e){return arguments.length?(d=null==(y=e)?m:null,t):d?null:y},t.nodeSize=function(e){return arguments.length?(d=null==(y=e)?null:m,t):d?y:null},_hierarchy.default.layout_hierarchyRebind(t,f)};function layout_treeSeparation(e,t){return e.parent==t.parent?1:2}function layout_treeLeft(e){var t=e.children;return t.length?t[0]:e.t}function layout_treeRight(e){var t,r=e.children;return (t=r.length)?r[t-1]:e.t}function layout_treeMove(e,t,r){var n=r/(t.i-e.i);t.c-=n,t.s+=r,e.c+=n,t.z+=r,t.m+=r;}function layout_treeShift(e){for(var t,r=0,n=0,l=e.children,a=l.length;0<=--a;)(t=l[a]).z+=r,t.m+=r,r+=t.s+(n+=t.c);}function layout_treeAncestor(e,t,r){return e.a.parent===t.parent?e.a:r}index_es.global.registerLayout("tree",TREE);var _default=TREE;exports.default=_default;
});

unwrapExports(tree);

var trigger = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),Trigger=function e(r){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};(0, _classCallCheck2.default)(this,e),this.comp=r,this.params=t;};exports.default=Trigger;
});

unwrapExports(trigger);

var legend = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_assertThisInitialized2=interopRequireDefault(assertThisInitialized$1),_createClass2=interopRequireDefault(createClass$1),_inherits2=interopRequireDefault(inherits$1),_component=interopRequireDefault(component),_canvax=interopRequireDefault(Canvax),_trigger=interopRequireDefault(trigger),Circle=_canvax.default.Shapes.Circle,Legend=function(e){function a(e,t){var i;return (0, _classCallCheck2.default)(this,a),(i=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(a).call(this,e,t))).name="legend",index_es._.extend(!0,(0, _assertThisInitialized2.default)(i),(0, index_es.getDefaultProps)(a.defaultProps()),e),i.data=i._getLegendData(e),!e.direction&&e.position&&("left"==i.position||"right"==i.position?i.direction="v":i.direction="h"),i.sprite=new _canvax.default.Display.Sprite({id:"LegendSprite",context:{x:i.pos.x,y:i.pos.y}}),i.app.stage.addChild(i.sprite),i.widget(),i.layout(),i}return (0, _inherits2.default)(a,e),(0, _createClass2.default)(a,null,[{key:"defaultProps",value:function(){return {data:{detail:"图例数据",default:[],documentation:'                    数据结构为：{name: "uv", color: "#ff8533", field: "" ...}                    如果手动传入数据只需要前面这三个 enabled: true, ind: 0                    外部只需要传field和fillStyle就行了                    '},position:{detail:"图例位置",documentation:"图例所在的方向top,right,bottom,left",default:"top"},direction:{detail:"图例布局方向",default:"h",documentation:"横向 top,bottom --\x3e h left,right -- >v"},textAlign:{detail:"水平方向的对其，默认居左对其",default:"left",documentation:"可选left，center，right"},verticalAlign:{detail:"垂直方向的对其方式，默认居中（待实现）",default:"middle",documentation:"可选top，middle，bottom"},icon:{detail:"图标设置",propertys:{height:{detail:"高",default:26},width:{detail:"图标宽",default:"auto"},shapeType:{detail:"图标的图形类型，目前只实现了圆形",default:"circle"},radius:{detail:"图标（circle）半径",default:5},lineWidth:{detail:"图标描边宽度",default:1},fillStyle:{detail:"图标颜色，一般会从data里面取，这里是默认色",default:"#999"}}},label:{detail:"文本配置",propertys:{textAlign:{detail:"水平对齐方式",default:"left"},textBaseline:{detail:"文本基线对齐方式",default:"middle"},fontColor:{detail:"文本颜色",default:"#333333"},cursor:{detail:"鼠标样式",default:"pointer"},format:{detail:"文本格式化处理函数",default:null}}},activeEnabled:{detail:"是否启动图例的",default:!0},tipsEnabled:{detail:"是否开启图例的tips",default:!1}}}}]),(0, _createClass2.default)(a,[{key:"_getLegendData",value:function(e){var t=e.data;return t?index_es._.each(t,function(e,t){e.enabled=!0,e.ind=t;}):t=this.app.getLegendData(),t||[]}},{key:"layout",value:function(){var e,t=this.app,i=this.width+this.margin.left+this.margin.right,a=this.height+this.margin.top+this.margin.bottom,n=t.padding.left,l=t.padding.top;return "right"==this.position&&(n=t.width-t.padding.right-i),"bottom"==this.position&&(l=t.height-t.padding.bottom-a/2),"left"==this.position||"right"==this.position?(t.padding[this.position]+=i,e=i,t.height-t.padding.top-t.padding.bottom):"top"!=this.position&&"bottom"!=this.position||(t.padding[this.position]+=a,e=t.width-t.padding.right-t.padding.left,a),"center"==this.textAlign&&(n+=e/2-this.width/2),"right"==this.textAlign&&(n+=e-this.width),this.pos={x:n,y:l},this.pos}},{key:"draw",value:function(){var e=this.app.getComponent({name:"coord"});e&&"rect"==e.type&&("left"!=this.textAlign||"top"!=this.position&&"bottom"!=this.position||(this.pos.x=e.getSizeAndOrigin().origin.x+this.icon.radius)),this.setPosition();}},{key:"widget",value:function(){var d=this,s=this.app.width-this.app.padding.left-this.app.padding.right,p=this.app.height-this.app.padding.top-this.app.padding.bottom,u=0,h=0,f=0,c=0,g=0,m=1,_=!1;index_es._.each(this.data,function(t,e){if(!_){var i=new Circle({id:"legend_field_icon_"+e,context:{x:0,y:d.icon.height/3,fillStyle:t.enabled?t.color||"#999":"#ccc",r:d.icon.radius,cursor:"pointer"}});i.on(index_es.event.types.get(),function(e){});var a=t.name;d.label.format&&(a=d.label.format(t.name,t));var n=new _canvax.default.Display.Text(a,{id:"legend_field_txt_"+e,context:{x:d.icon.radius+3,y:d.icon.height/3,textAlign:d.label.textAlign,textBaseline:d.label.textBaseline,fillStyle:d.label.fontColor,cursor:d.label.cursor}});n.on(index_es.event.types.get(),function(e){});var l=n.getTextWidth()+2*d.icon.radius+20;u=Math.max(u,l);var r={height:d.icon.height};if("v"==d.direction){if(g+d.icon.height>p){if(.3*s<c)return void(_=!0);c+=u,g=0;}r.x=c,r.y=g,g+=d.icon.height,f=Math.max(f,g);}else{if(s<c+l){if(d.icon.height*(m+1)>.3*p)return void(_=!0);c=0,m++;}r.x=c,r.y=d.icon.height*(m-1),c+=l,h=Math.max(h,c);}var o=new _canvax.default.Display.Sprite({id:"legend_field_"+e,context:r});o.addChild(i),o.addChild(n),o.context.width=l,d.sprite.addChild(o),o.on(index_es.event.types.get(),function(e){if("click"==e.type&&d.activeEnabled){if(1==index_es._.filter(d.data,function(e){return e.enabled}).length&&t.enabled)return;t.enabled=!t.enabled,i.context.fillStyle=t.enabled?t.color||"#999":"#ccc",t.enabled?d.app.show(t.name,new _trigger.default(this,t)):d.app.hide(t.name,new _trigger.default(this,t));}d.tipsEnabled&&("mouseover"!=e.type&&"mousemove"!=e.type||(e.eventInfo=d._getInfoHandler(e,t)),"mouseout"==e.type&&delete e.eventInfo,d.app.fire(e.type,e));});}}),"h"==this.direction?(d.width=d.sprite.context.width=h,d.height=d.sprite.context.height=d.icon.height*m):(d.width=d.sprite.context.width=c+u,d.height=d.sprite.context.height=f);}},{key:"_getInfoHandler",value:function(e,t){return {type:"legend",triggerType:"legend",trigger:this,tipsEnabled:this.tipsEnabled,nodes:[{name:t.name,fillStyle:t.color}]}}}]),a}(_component.default);index_es.global.registerComponent(Legend,"legend");var _default=Legend;exports.default=_default;
});

unwrapExports(legend);

var datazoom = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_assertThisInitialized2=interopRequireDefault(assertThisInitialized$1),_createClass2=interopRequireDefault(createClass$1),_inherits2=interopRequireDefault(inherits$1),_component=interopRequireDefault(component),_canvax=interopRequireDefault(Canvax),_trigger=interopRequireDefault(trigger),Line=_canvax.default.Shapes.Line,Rect=_canvax.default.Shapes.Rect,dataZoom=function(t){function n(t,e){var i;return (0, _classCallCheck2.default)(this,n),(i=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(n).call(this,t,e))).name="dataZoom",i._cloneChart=null,i.count=1,i.dataLen=1,i.axisLayoutType=null,i.dragIng=function(){},i.dragEnd=function(){},i.disPart={},i._btnLeft=null,i._btnRight=null,i._underline=null,i.sprite=new _canvax.default.Display.Sprite({id:"dataZoom",context:{x:i.pos.x,y:i.pos.y}}),i.sprite.noSkip=!0,i.dataZoomBg=new _canvax.default.Display.Sprite({id:"dataZoomBg"}),i.dataZoomBtns=new _canvax.default.Display.Sprite({id:"dataZoomBtns"}),i.sprite.addChild(i.dataZoomBg),i.sprite.addChild(i.dataZoomBtns),e.stage.addChild(i.sprite),index_es._.extend(!0,(0, _assertThisInitialized2.default)(i),(0, index_es.getDefaultProps)(n.defaultProps()),t),"margin"in t||("bottom"==i.position&&(i.margin.top=10),"top"==i.position&&(i.margin.bottom=10)),i.axis=null,i.layout(),i}return (0, _inherits2.default)(n,t),(0, _createClass2.default)(n,null,[{key:"defaultProps",value:function(){return {position:{detail:"位置",default:"bottom"},direction:{detail:"方向",default:"h"},height:{detail:"高",default:26},width:{detail:"宽",default:100},color:{detail:"颜色",default:"#008ae6"},range:{detail:"范围设置",propertys:{start:{detail:"开始位置",default:0},end:{detail:"结束位置，默认为null，表示到最后",default:null},max:{detail:"可以外围控制智能在哪个区间拖动",default:null},min:{detail:"最少至少选中了几个数据",default:1}}},left:{detail:"左边按钮",propertys:{eventEnabled:{detail:"是否响应事件",default:!0},fillStyle:{detail:"颜色，默认取组件.color",default:null}}},right:{detail:"右边按钮",propertys:{eventEnabled:{detail:"是否响应事件",default:!0},fillStyle:{detail:"颜色，默认取组件.color",default:null}}},center:{detail:"中间位置设置",propertys:{eventEnabled:{detail:"是否响应事件",default:!0},fillStyle:{detail:"填充色",default:"#000000"},alpha:{detail:"透明度",default:.015}}},bg:{detail:"背景设置",propertys:{enabled:{detail:"是否开启",default:!0},fillStyle:{detail:"填充色",default:""},strokeStyle:{detail:"边框色",default:"#e6e6e6"},lineWidth:{detail:"线宽",default:1}}},graphAlpha:{detail:"图形的透明度",default:.6},graphStyle:{detail:"图形的颜色",default:"#dddddd"},underline:{detail:"underline",propertys:{enabled:{detail:"是否开启",default:!0},strokeStyle:{detail:"线条色",default:null},lineWidth:{detail:"线宽",default:2}}},btnOut:{detail:"left,right按钮突出的大小",default:6},btnHeight:{detail:"left,right按钮高",default:20,documentation:"left,right按钮的高，不在left，right下面，统一在这个属性里， 以为要强制保持一致"},btnWidth:{detail:"left,right按钮的宽",default:8,documentation:"left,right按钮的宽，不在left，right下面，统一在这个属性里， 以为要强制保持一致"}}}}]),(0, _createClass2.default)(n,[{key:"layout",value:function(){var t=this.app;"bottom"==this.position&&(this.pos.y=t.height-(this.height+t.padding.bottom+this.margin.bottom),t.padding.bottom+=this.height+this.margin.top+this.margin.bottom),"top"==this.position&&(this.pos.y=t.padding.top+this.margin.top,t.padding.top+=this.height+this.margin.top+this.margin.bottom);}},{key:"_getCloneChart",value:function(){var d=this,r=this.app,s=r.getCoord(),t=r.constructor,e=r.el.cloneNode();e.innerHTML="",e.id=r.el.id+"_currclone",e.style.position="absolute",e.style.width=this.width+"px",e.style.height=this.btnHeight+"px",e.style.top="10000px",document.body.appendChild(e);var h=[];index_es._.each(r.getComponents({name:"graphs"}),function(t){var e=t.enabledField||t.field;if(index_es._.flatten([e]).length){var i=index_es._.extend(!0,{},t._opt);i.field=e;var n={};"bar"==t.type&&(n={node:{}},d.graphStyle&&(n.node.fillStyle=d.graphStyle)),"line"==t.type&&(n={line:{lineWidth:1},node:{enabled:!1},area:{}},d.graphStyle&&(n.line.strokeStyle=d.graphStyle,n.area.fillStyle=d.graphStyle));var a=s.height||r.el.offsetHeight,o=d.btnHeight/a||1;"scat"==t.type&&(n={node:{radiusScale:o}},d.graphStyle),h.push(index_es._.extend(!0,i,n,{label:{enabled:!1},animation:!1}));}});var i={coord:r._opt.coord,graphs:h};i.coord.horizontal&&delete i.coord.horizontal,i.coord.enabled=!1,i.coord.padding=0;var n=new t(e,r._data,i,r.componentModules);return n.draw(),{thumbChart:n,cloneEl:e}}},{key:"_setDataZoomOpt",value:function(){var e=this.app,t=e.getComponent({name:"coord"}).getSizeAndOrigin(),o=this;index_es._.extend(!0,this,{width:parseInt(t.width),pos:{x:t.origin.x},dragIng:function(a){var t;"proportion"==o.axisLayoutType?(t=new _trigger.default(o,{min:a.start,max:a.end}),e.dataFrame.filters.datazoom=function(t){var e=t[o.axis.field],i=o.axis.getValOfPos(a.start),n=o.axis.getValOfPos(a.end);return i<=e&&e<=n}):(t=new _trigger.default(o,{left:e.dataFrame.range.start-a.start,right:a.end-e.dataFrame.range.end}),index_es._.extend(e.dataFrame.range,a)),e.resetData(null,t),e.fire("dataZoomDragIng");},dragEnd:function(){e.updateChecked&&e.updateChecked(),e.fire("dataZoomDragEnd");}});}},{key:"draw",value:function(){this._setDataZoomOpt(),this._cloneChart=this._getCloneChart(),this.axis=this._cloneChart.thumbChart.getComponent({name:"coord"})._xAxis,this.axisLayoutType=this.axis.layoutType,this._computeAttrs(),this.widget(),this._setLines(),this.setZoomBg(),this.setPosition();}},{key:"destroy",value:function(){this.sprite.destroy();}},{key:"reset",value:function(t){t=t||{};var e=this.count,i=this.range.start,n=this.range.end;t&&index_es._.extend(!0,this,t),this._cloneChart=this._getCloneChart(),this._computeAttrs(t),e==this.count&&(!t.range||t.range.start==i&&t.range.end==n)||(this.widget(),this._setLines()),this.setZoomBg();}},{key:"_computeAttrs",value:function(){var t=this._cloneChart.thumbChart;switch(this.dataLen=t.dataFrame.length,this.axisLayoutType){case"rule":this.count=this.dataLen-1;break;case"peak":this.count=this.dataLen;break;case"proportion":this.count=this.width;}(!this._opt.range||this._opt.range&&!this._opt.range.max||this.range.max>this.count)&&(this.range.max=this.count-1),(!this._opt.range||this._opt.range&&!this._opt.range.end||this.range.end>this.dataLen-1)&&(this.range.end=this.dataLen-1,"proportion"==this.axisLayoutType&&(this.range.end=this.count-1)),!this.direction&&this.position&&("left"==this.position||"right"==this.position?this.direction="v":this.direction="h"),this.disPart=this._getDisPart(),this.btnHeight=this.height-this.btnOut;}},{key:"_getDisPart",value:function(){var t=this,e=Math.max(parseInt(t.range.min/2/t.count*t.width),23),i=parseInt((t.range.max+1)/t.count*t.width);return "peak"==this.axisLayoutType&&(e=Math.max(parseInt(t.range.min/t.count*t.width),23)),"proportion"==this.axisLayoutType&&(i=t.width),{min:e,max:i}}},{key:"_getRangeEnd",value:function(t){return void 0===t&&(t=this.range.end),"peak"==this.axisLayoutType&&(t+=1),"proportion"==this.axisLayoutType&&(t+=1),t}},{key:"widget",value:function(){function t(){e._setLines.apply(e,arguments);}var e=this;if(e.bg.enabled){var i={x:0,y:0,width:e.width,height:e.btnHeight,lineWidth:e.bg.lineWidth,strokeStyle:e.bg.strokeStyle,fillStyle:e.bg.fillStyle};e._bgRect?e._bgRect.animate(i,{onUpdate:t}):(e._bgRect=new Rect({context:i}),e.dataZoomBg.addChild(e._bgRect));}if(e.underline.enabled){var n={start:{x:e.range.start/e.count*e.width+e.btnWidth/2,y:e.btnHeight},end:{x:e._getRangeEnd()/e.count*e.width-e.btnWidth/2,y:e.btnHeight},lineWidth:e.underline.lineWidth,strokeStyle:e.underline.strokeStyle||e.color};e._underline?e._underline.animate(n,{onUpdate:t}):(e._underline=e._addLine(n),e.dataZoomBg.addChild(e._underline));}var a={x:e.range.start/e.count*e.width,y:-e.btnOut/2+1,width:e.btnWidth,height:e.btnHeight+e.btnOut,fillStyle:e.left.fillStyle||e.color,cursor:e.left.eventEnabled&&"move"};e._btnLeft?e._btnLeft.animate(a,{onUpdate:t}):(e._btnLeft=new Rect({id:"btnLeft",dragEnabled:e.left.eventEnabled,context:a}),e._btnLeft.on("draging",function(t){this.context.y=-e.btnOut/2+1,this.context.x<0&&(this.context.x=0),this.context.x>e._btnRight.context.x-e.btnWidth-2&&(this.context.x=e._btnRight.context.x-e.btnWidth-2),e._btnRight.context.x+e.btnWidth-this.context.x>=e.disPart.max&&(this.context.x=e._btnRight.context.x+e.btnWidth-e.disPart.max),e._btnRight.context.x+e.btnWidth-this.context.x<e.disPart.min&&(this.context.x=e._btnRight.context.x+e.btnWidth-e.disPart.min),e.rangeRect.context.width=e._btnRight.context.x-this.context.x-e.btnWidth,e.rangeRect.context.x=this.context.x+e.btnWidth,e._setRange();}),e._btnLeft.on("dragend",function(t){e.dragEnd(e.range);}),this.dataZoomBtns.addChild(this._btnLeft));var o={x:e._getRangeEnd()/e.count*e.width-e.btnWidth,y:-e.btnOut/2+1,width:e.btnWidth,height:e.btnHeight+e.btnOut,fillStyle:e.right.fillStyle||e.color,cursor:e.right.eventEnabled&&"move"};e._btnRight?e._btnRight.animate(o,{onUpdate:t}):(e._btnRight=new Rect({id:"btnRight",dragEnabled:e.right.eventEnabled,context:o}),e._btnRight.on("draging",function(t){this.context.y=-e.btnOut/2+1,this.context.x>e.width-e.btnWidth&&(this.context.x=e.width-e.btnWidth),this.context.x+e.btnWidth-e._btnLeft.context.x>=e.disPart.max&&(this.context.x=e.disPart.max-(e.btnWidth-e._btnLeft.context.x)),this.context.x+e.btnWidth-e._btnLeft.context.x<e.disPart.min&&(this.context.x=e.disPart.min-e.btnWidth+e._btnLeft.context.x),e.rangeRect.context.width=this.context.x-e._btnLeft.context.x-e.btnWidth,e._setRange();}),e._btnRight.on("dragend",function(t){e.dragEnd(e.range);}),this.dataZoomBtns.addChild(this._btnRight));var d={x:a.x+e.btnWidth,y:1,width:o.x-a.x-e.btnWidth,height:this.btnHeight-1,fillStyle:e.center.fillStyle,fillAlpha:e.center.alpha,cursor:"move"};this.rangeRect?this.rangeRect.animate(d,{onUpdate:t}):(this.rangeRect=new Rect({id:"btnCenter",dragEnabled:!0,context:d}),this.rangeRect.on("draging",function(t){this.context.y=1,this.context.x<e.btnWidth&&(this.context.x=e.btnWidth),this.context.x>e.width-this.context.width-e.btnWidth&&(this.context.x=e.width-this.context.width-e.btnWidth),e._btnLeft.context.x=this.context.x-e.btnWidth,e._btnRight.context.x=this.context.x+this.context.width,e._setRange("btnCenter");}),this.rangeRect.on("dragend",function(t){e.dragEnd(e.range);}),this.dataZoomBtns.addChild(this.rangeRect)),this.linesLeft||(this.linesLeft=new _canvax.default.Display.Sprite({id:"linesLeft"}),this.left.eventEnabled&&this._addLines({sprite:this.linesLeft}),this.dataZoomBtns.addChild(this.linesLeft)),this.linesRight||(this.linesRight=new _canvax.default.Display.Sprite({id:"linesRight"}),this.right.eventEnabled&&this._addLines({sprite:this.linesRight}),this.dataZoomBtns.addChild(this.linesRight)),this.linesCenter||(this.linesCenter=new _canvax.default.Display.Sprite({id:"linesCenter"}),this._addLines({count:3,sprite:this.linesCenter,strokeStyle:this.color}),this.dataZoomBtns.addChild(this.linesCenter));}},{key:"_setRange",value:function(t){var e=this,i=e._getRangeEnd(),n=i-e.range.start,a=e._btnLeft.context.x/e.width*e.count,o=(e._btnRight.context.x+e.btnWidth)/e.width*e.count;o="peak"==this.axisLayoutType?(a=Math.round(a),Math.round(o)):(this.axisLayoutType,a=parseInt(a),parseInt(o)),"btnCenter"==t&&o-a!=n&&(o=a+n),a==e.range.start&&o==i||(e.range.start=a,"peak"==e.axisLayoutType&&--o,e.range.end=o,e.dragIng(e.range)),e._setLines();}},{key:"_setLines",value:function(){var t=this,e=this.linesLeft,i=this.linesRight,n=this.linesCenter,a=this._btnLeft,o=this._btnRight,d=this.rangeRect;e.context.x=a.context.x+(a.context.width-e.context.width)/2,e.context.y=a.context.y+(a.context.height-e.context.height)/2,i.context.x=o.context.x+(o.context.width-i.context.width)/2,i.context.y=o.context.y+(o.context.height-i.context.height)/2,n.context.x=d.context.x+(d.context.width-n.context.width)/2,n.context.y=d.context.y+(d.context.height-n.context.height)/2,t.underline.enabled&&(t._underline.context.start.x=e.context.x+t.btnWidth/2,t._underline.context.end.x=i.context.x+t.btnWidth/2);}},{key:"_addLines",value:function(t){for(var e=t.count||2,i=t.sprite,n=t.dis||2,a=0,o=e;a<o;a++)i.addChild(this._addLine({x:a*n,strokeStyle:t.strokeStyle||""}));i.context.width=a*n-1,i.context.height=6;}},{key:"_addLine",value:function(t){var e=t||{};return new Line({id:e.id||"",context:{x:e.x||0,y:e.y||0,start:{x:e.start?e.start.x:0,y:e.start?e.start.y:0},end:{x:e.end?e.end.x:0,y:e.end?e.end.y:6},lineWidth:e.lineWidth||1,strokeStyle:e.strokeStyle||"#ffffff"}})}},{key:"setZoomBg",value:function(){this.__graphssp&&this.__graphssp.destroy();var t=this._cloneChart.thumbChart.graphsSprite;t.setEventEnable(!1);var e=this._cloneChart.thumbChart.getComponent({name:"coord"});t.id=t.id+"_datazoomthumbChartbg",t.context.x=-e.origin.x,t.context.scaleY=this.btnHeight/e.height,t.context.scaleX=this.width/e.width,t.context.globalAlpha=this.graphAlpha,this.dataZoomBg.addChild(t,0),this.__graphssp=t,this._cloneChart.thumbChart.destroy(),this._cloneChart.cloneEl.parentNode.removeChild(this._cloneChart.cloneEl);}}]),n}(_component.default);index_es.global.registerComponent(dataZoom,"dataZoom");var _default=dataZoom;exports.default=_default;
});

unwrapExports(datazoom);

var markline = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_assertThisInitialized2=interopRequireDefault(assertThisInitialized$1),_createClass2=interopRequireDefault(createClass$1),_inherits2=interopRequireDefault(inherits$1),_component=interopRequireDefault(component),_canvax=interopRequireDefault(Canvax),BrokenLine=_canvax.default.Shapes.BrokenLine,Sprite=_canvax.default.Display.Sprite,Text=_canvax.default.Display.Text,MarkLine=function(e){function l(e,t){var i;return (0, _classCallCheck2.default)(this,l),(i=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(l).call(this,e,t))).name="markLine",i._yAxis=null,i.line={y:0,list:[]},i._txt=null,i._line=null,i.sprite=new Sprite,i.app.graphsSprite.addChild(i.sprite),index_es._.extend(!0,(0, _assertThisInitialized2.default)(i),(0, index_es.getDefaultProps)(l.defaultProps()),e),i}return (0, _inherits2.default)(l,e),(0, _createClass2.default)(l,null,[{key:"defaultProps",value:function(){return {markTo:{detail:"标准哪个目标字段",default:null},yVal:{detail:"组件的值",default:0,documentation:"可能是个function，均值计算就是个function"},line:{detail:"线的配置",propertys:{strokeStyle:{detail:"线的颜色",default:"#999999"},lineWidth:{detail:"线宽",default:1},lineType:{detail:"线样式",default:"dashed"}}},label:{detail:"文本",propertys:{enabled:{detail:"是否开启",default:!1},fontColor:{detail:"文本字体颜色",default:"#999999"},fontSize:{detail:"文本字体大小",default:12},text:{detail:"文本内容",default:null},format:{detail:"文本格式化函数",default:null}}}}}}]),(0, _createClass2.default)(l,[{key:"draw",value:function(){this._calculateProps(),this.setPosition(),this.widget();}},{key:"_calculateProps",value:function(){var e=this._opt,l=e.markTo,t=this.app.getComponent({name:"coord"});if(!l||-1!=index_es._.indexOf(this.app.dataFrame.fields,l)){var i,a=t._yAxis[0];l&&index_es._.each(t._yAxis,function(e,t){var i=index_es._.flatten([e.field]);0<=index_es._.indexOf(i,l)&&(a=e);}),e.yAxisAlign&&(a=t._yAxis["left"==e.yAxisAlign?0:1]),i=void 0!==e.y&&null!==e.y?Number(e.y):function(){var e=this.app.dataFrame.getFieldData(l),t=0;return index_es._.each(e,function(e){Number(e)&&(t+=e);}),t/e.length},isNaN(i)||a.drawWaterLine(i);var n="#777",r=t.getFieldMapOf(l);r&&(n=r.color);var s=e.line&&e.line.strokeStyle||n,u=e.label&&e.label.fontColor||n;this._yAxis=a,this.width=t.width,this.height=t.height,this.yVal=i,this.pos={x:t.origin.x,y:t.origin.y},this.line.list=[[0,0],[this.width,0]],this.label.fontColor=u,s&&(this.line.strokeStyle=s);}}},{key:"widget",value:function(){var e=this,t=this._getYPos(),i=new BrokenLine({id:"line",context:{y:t,pointList:e.line.list,strokeStyle:e.line.strokeStyle,lineWidth:e.line.lineWidth,lineType:e.line.lineType}});if(e.sprite.addChild(i),e._line=i,e.label.enabled){var l=new Text(e._getLabel(),{context:e.label});this._txt=l,e.sprite.addChild(l),e._setTxtPos(t);}this.line.y=t;}},{key:"reset",value:function(e){e&&index_es._.extend(!0,this,e);var t=this,i=this._getYPos();i!=this.line.y&&this._line.animate({y:i},{duration:300,onUpdate:function(e){t.label.enabled&&(t._txt.resetText(t._getLabel()),t._setTxtPos(e.y));}}),this._line.context.strokeStyle=this.line.strokeStyle,this.line.y=i;}},{key:"_setTxtPos",value:function(e){var t=this,i=t._txt;"left"==this._yAxis.align?i.context.x=5:i.context.x=this.width-i.getTextWidth()-5,index_es._.isNumber(t.label.y)?i.context.y=t.label.y:i.context.y=e-i.getTextHeight();}},{key:"_getYVal",value:function(e){var t=e=e||this.yVal;return index_es._.isFunction(e)&&(t=e.apply(this)),t}},{key:"_getYPos",value:function(){return -this._yAxis.getPosOfVal(this._getYVal())}},{key:"_getLabel",value:function(){var e=this._getYVal();return index_es._.isFunction(this.label.format)?this.label.format(e,this):index_es._.isString(this.label.text)?this.label.text:e}}]),l}(_component.default);index_es.global.registerComponent(MarkLine,"markLine");var _default=MarkLine;exports.default=_default;
});

unwrapExports(markline);

var tips = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _typeof2=interopRequireDefault(_typeof_1$1),_classCallCheck2=interopRequireDefault(classCallCheck$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_assertThisInitialized2=interopRequireDefault(assertThisInitialized$1),_createClass2=interopRequireDefault(createClass$1),_inherits2=interopRequireDefault(inherits$1),_component=interopRequireDefault(component),_canvax=interopRequireDefault(Canvax),Rect=_canvax.default.Shapes.Rect,Line=_canvax.default.Shapes.Line,Tips=function(t){function o(t,e){var i;(0, _classCallCheck2.default)(this,o),(i=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(o).call(this,t,e))).name="tips",i.tipDomContainer=i.app.canvax.domView,i.cW=0,i.cH=0,i.dW=0,i.dH=0,i._tipDom=null,i._tipsPointer=null,i.eventInfo=null,i.sprite=null,i.sprite=new _canvax.default.Display.Sprite({id:"TipSprite"}),i.app.stage.addChild(i.sprite);var n=(0, _assertThisInitialized2.default)(i);return i.sprite.on("destroy",function(){n._tipDom=null;}),index_es._.extend(!0,(0, _assertThisInitialized2.default)(i),(0, index_es.getDefaultProps)(o.defaultProps()),t),i}return (0, _inherits2.default)(o,t),(0, _createClass2.default)(o,null,[{key:"defaultProps",value:function(){return {enabled:{detail:"是否开启Tips",default:!0},content:{detail:"自定义tips的内容（html）",default:null},borderRadius:{detail:"tips的边框圆角半径",default:5},strokeStyle:{detail:"tips边框颜色",default:"#ccc"},fillStyle:{detail:"tips背景色",default:"rgba(255,255,255,0.95)"},fontColor:{detail:"tips文本颜色",default:"#999999"},positionOfPoint:{detail:"tips在触发点的位置，默认在右侧",default:"right"},offsetX:{detail:"tips内容到鼠标位置的偏移量x",default:10},offsetY:{detail:"tips内容到鼠标位置的偏移量y",default:10},positionInRange:{detail:"tip的浮层是否限定在画布区域",default:!0},pointer:{detail:"触发tips的时候的指针样式",default:"line",documentation:'tips的指针,默认为直线，可选为："line" | "region"(柱状图中一般用region)'},pointerAnim:{detail:"tips移动的时候，指针是否开启动画",default:!0}}}}]),(0, _createClass2.default)(o,[{key:"show",value:function(t){if(this.enabled){if(t.eventInfo){this.eventInfo=t.eventInfo;var e=t.target.getStage();e?(this.cW=e.context.width,this.cH=e.context.height):"canvax"==t.target.type&&(this.cW=t.target.width,this.cH=t.target.height),this._setContent(t)?(this._setPosition(t),this.sprite.toFront()):this.hide(t);}this._tipsPointerShow(t);}}},{key:"move",value:function(t){if(this.enabled){if(t.eventInfo)this.eventInfo=t.eventInfo,this._setContent(t)?this._setPosition(t):this._hideDialogTips();this._tipsPointerMove(t);}}},{key:"hide",value:function(t){this.enabled&&(this._hideDialogTips(t),this._tipsPointerHide(t));}},{key:"_hideDialogTips",value:function(){this.eventInfo&&(this.eventInfo=null,this.sprite.removeAllChildren(),this._removeContent());}},{key:"_setPosition",value:function(t){if(this.enabled&&this._tipDom){var e=t.pos||t.target.localToGlobal(t.point),i=this._checkX(e.x+this.offsetX),n=this._checkY(e.y+this.offsetY);this._tipDom.style.cssText+=";visibility:visible;left:"+i+"px;top:"+n+"px;-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;","left"==this.positionOfPoint&&(this._tipDom.style.left=this._checkX(e.x-this.offsetX-this._tipDom.offsetWidth)+"px");}}},{key:"_creatTipDom",value:function(){this._tipDom=document.createElement("div"),this._tipDom.className="chart-tips",this._tipDom.style.cssText+="; border-radius:"+this.borderRadius+"px;background:"+this.fillStyle+";border:1px solid "+this.strokeStyle+";visibility:hidden;position:absolute;enabled:inline-block;*enabled:inline;*zoom:1;padding:6px;color:"+this.fontColor+";line-height:1.5",this._tipDom.style.cssText+="; box-shadow:1px 1px 3px "+this.strokeStyle+";",this._tipDom.style.cssText+="; border:none;white-space:nowrap;word-wrap:normal;",this._tipDom.style.cssText+="; text-align:left;",this.tipDomContainer.appendChild(this._tipDom);}},{key:"_removeContent",value:function(){this._tipDom&&(this.tipDomContainer.removeChild(this._tipDom),this._tipDom=null);}},{key:"_setContent",value:function(t){var e=this._getContent(t);if(e||0===e)return this._tipDom||this._creatTipDom(t),this._tipDom.innerHTML=e,this.dW=this._tipDom.offsetWidth,this.dH=this._tipDom.offsetHeight,e}},{key:"_getContent",value:function(t){return this.content?index_es._.isFunction(this.content)?this.content(t.eventInfo,t):this.content:this._getDefaultContent(t.eventInfo)}},{key:"_getDefaultContent",value:function(t){var r="";return t.nodes.length&&(void 0!==t.title&&null!==t.title&&""!==t.title&&(r+="<div style='font-size:14px;border-bottom:1px solid #f0f0f0;padding:4px;margin-bottom:6px;'>"+t.title+"</div>"),index_es._.each(t.nodes,function(t,e){var i=t.color||t.fillStyle||t.strokeStyle,n=t.name||t.field||t.content,o="object"==(0, _typeof2.default)(t.value)?JSON.stringify(t.value):(0, tools.numAddSymbol)(t.value),s=t.value||0==t.value;r+="<div style='line-height:1.5;font-size:12px;padding:0 4px;'>",i&&(r+="<span style='background:"+i+";margin-right:8px;margin-top:7px;float:left;width:8px;height:8px;border-radius:4px;overflow:hidden;font-size:0;'></span>"),n&&(r+="<span style='margin-right:5px;'>"+n,s&&(r+="："),r+="</span>"),s&&(r+=o),r+="</div>";})),r}},{key:"_checkX",value:function(t){if(this.positionInRange){var e=this.dW+2;t<0&&(t=0),t+e>this.cW&&(t=this.cW-e);}return t}},{key:"_checkY",value:function(t){if(this.positionInRange){var e=this.dH+2;t<0&&(t=0),t+e>this.cH&&(t=this.cH-e);}return t}},{key:"_tipsPointerShow",value:function(t){if(t.eventInfo&&t.eventInfo.xAxis){var e=this.app.getComponent({name:"coord"});if(e&&"rect"==e.type&&this.pointer){var i=this._tipsPointer,n=e.origin.y-e.height,o=0;if("line"==this.pointer&&(o=e.origin.x+t.eventInfo.xAxis.x),"region"==this.pointer){var s=e._xAxis.getCellLengthOfPos(t.eventInfo.xAxis.x);o=e.origin.x+t.eventInfo.xAxis.x-s/2,t.eventInfo.xAxis.ind<0&&(o=e.origin.x);}if(i)this.pointerAnim&&"proportion"!=e._xAxis.layoutType?(i.__animation&&i.__animation.stop(),i.__animation=i.animate({x:o,y:n},{duration:200})):(i.context.x=o,i.context.y=n);else{if("line"==this.pointer&&(i=new Line({context:{x:o,y:n,start:{x:0,y:0},end:{x:0,y:e.height},lineWidth:1,strokeStyle:"#cccccc"}})),"region"==this.pointer){s=e._xAxis.getCellLengthOfPos(o);i=new Rect({context:{width:s,height:e.height,x:o,y:n,fillStyle:"#cccccc",globalAlpha:.3}});}this.app.graphsSprite.addChild(i,0),this._tipsPointer=i;}}}}},{key:"_tipsPointerHide",value:function(t){if(t.eventInfo&&t.eventInfo.xAxis){var e=this.app.getComponent({name:"coord"});e&&"rect"==e.type&&this.pointer&&this._tipsPointer&&(this._tipsPointer.destroy(),this._tipsPointer=null);}}},{key:"_tipsPointerMove",value:function(t){if(t.eventInfo&&t.eventInfo.xAxis){var e=this.app.getComponent({name:"coord"});if(e&&"rect"==e.type&&this.pointer&&this._tipsPointer){var i=this._tipsPointer,n=e.origin.x+t.eventInfo.xAxis.x;if("region"==this.pointer){var o=e._xAxis.getCellLengthOfPos(t.eventInfo.xAxis.x);n=e.origin.x+t.eventInfo.xAxis.x-o/2,t.eventInfo.xAxis.ind<0&&(n=e.origin.x);}var s=e.origin.y-e.height;n!=i.__targetX&&(this.pointerAnim&&"proportion"!=e._xAxis.layoutType?(i.__animation&&i.__animation.stop(),i.__targetX=n,i.__animation=i.animate({x:n,y:s},{duration:200,onComplete:function(){delete i.__targetX,delete i.__animation;}})):(i.context.x=n,i.context.y=s));}}}}]),o}(_component.default);index_es.global.registerComponent(Tips,"tips");var _default=Tips;exports.default=_default;
});

unwrapExports(tips);

var bartgi = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_assertThisInitialized2=interopRequireDefault(assertThisInitialized$1),_createClass2=interopRequireDefault(createClass$1),_inherits2=interopRequireDefault(inherits$1),_component=interopRequireDefault(component),_canvax=interopRequireDefault(Canvax),Line=_canvax.default.Shapes.Line,barTgi=function(e){function i(e,t){var a;return (0, _classCallCheck2.default)(this,i),(a=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(i).call(this,e,t))).name="barTgi",a.data=null,a.barDatas=null,a._yAxis=null,a.sprite=null,a.pos={x:0,y:0},index_es._.extend(!0,(0, _assertThisInitialized2.default)(a),(0, index_es.getDefaultProps)(i.defaultProps()),e),a._yAxis=a.app.getComponent({name:"coord"})._yAxis["left"==a.yAxisAlign?0:1],a.sprite=new _canvax.default.Display.Sprite,a.app.graphsSprite.addChild(a.sprite),a}return (0, _inherits2.default)(i,e),(0, _createClass2.default)(i,null,[{key:"defaultProps",value:function(){return {field:{detail:"字段配置",default:null},barField:{detail:"这个bartgi组件对应的bar Graph 的field",default:null},yAxisAlign:{detail:"这个bartgi组件回到到哪个y轴",default:"left"},standardVal:{detail:"tgi标准线",default:100},line:{detail:"bar对应的tgi线配置",propertys:{lineWidth:{detail:"线宽",default:3},strokeStyle:{detail:"线颜色",default:function(e){return e>=this.standardVal?"#43cbb5":"#ff6060"}}}}}}}]),(0, _createClass2.default)(i,[{key:"reset",value:function(e){index_es._.extend(!0,this,e),this.barDatas=null,this.data=null,this.sprite.removeAllChildren(),this.draw();}},{key:"draw",value:function(){var l=this,e=this.app.getComponent({name:"coord"});this.pos={x:e.origin.x,y:e.origin.y},this.setPosition(),index_es._.each(l.app.getComponents({name:"graphs"}),function(e){if("bar"==e.type&&e.data[l.barField])return l.barDatas=e.data[l.barField],!1}),this.data=index_es._.flatten(l.app.dataFrame.getDataOrg(l.field)),this.barDatas&&index_es._.each(this.data,function(e,t){var a=-l._yAxis.getPosOfVal(e),i=l.barDatas[t],r=new Line({context:{start:{x:i.x,y:a},end:{x:i.x+i.width,y:a},lineWidth:2,strokeStyle:l._getProp(l.line.strokeStyle,e,t)}});l.sprite.addChild(r);});}},{key:"_getProp",value:function(e,t,a){var i=e;return index_es._.isFunction(e)&&(i=e.apply(this,[t,a])),i}}]),i}(_component.default);index_es.global.registerComponent(barTgi,"barTgi");var _default2=barTgi;exports.default=_default2;
});

unwrapExports(bartgi);

var barguide = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_assertThisInitialized2=interopRequireDefault(assertThisInitialized$1),_createClass2=interopRequireDefault(createClass$1),_inherits2=interopRequireDefault(inherits$1),_component=interopRequireDefault(component),_canvax=interopRequireDefault(Canvax),barGuide=function(e){function l(e,t){var a;return (0, _classCallCheck2.default)(this,l),(a=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(l).call(this,e,t))).name="barGuide",a.data=null,a.barDatas=null,a._yAxis=null,a.sprite=null,index_es._.extend(!0,(0, _assertThisInitialized2.default)(a),(0, index_es.getDefaultProps)(l.defaultProps()),e),a._yAxis=a.app.getComponent({name:"coord"})._yAxis["left"==a.yAxisAlign?0:1],a.sprite=new _canvax.default.Display.Sprite,a.app.graphsSprite.addChild(a.sprite),a}return (0, _inherits2.default)(l,e),(0, _createClass2.default)(l,null,[{key:"defaultProps",value:function(){return {field:{detail:"字段配置",default:null},barField:{detail:"这个guide对应的bar Graph 的field",default:null},yAxisAlign:{detail:"这个guide组件回到到哪个y轴",default:"left"},node:{detail:"单个节点配置",propertys:{shapeType:{detail:"节点绘制的图形类型",default:"circle"},lineWidth:{detail:"图表描边线宽",default:3},radius:{detail:"图形半径",default:6},fillStyle:{detail:"填充色",default:"#19dea1"},strokeStyle:{detail:"描边色",default:"#fff"}}},label:{detail:"文本配置",propertys:{fontSize:{detail:"字体大小",default:12},fontColor:{detail:"字体颜色",default:"#19dea1"},verticalAlign:{detail:"垂直对齐方式",default:"bottom"},textAlign:{detail:"水平对齐方式",default:"center"},strokeStyle:{detail:"文本描边颜色",default:"#fff"},lineWidth:{detail:"文本描边线宽",default:0},format:{detail:"文本格式处理函数",default:null}}}}}}]),(0, _createClass2.default)(l,[{key:"reset",value:function(e){index_es._.extend(!0,this,e),this.barDatas=null,this.data=null,this.sprite.removeAllChildren(),this.draw();}},{key:"draw",value:function(){var s=this,e=this.app.getComponent({name:"coord"});this.pos={x:e.origin.x,y:e.origin.y},this.setPosition(),index_es._.each(s.app.getComponents({name:"graphs"}),function(e){if("bar"==e.type&&e.data[s.barField])return s.barDatas=e.data[s.barField],!1}),this.data=index_es._.flatten(s.app.dataFrame.getDataOrg(s.field)),this.barDatas&&index_es._.each(this.data,function(e,t){var a=-s._yAxis.getPosOfVal(e),l=s.barDatas[t],i=new _canvax.default.Shapes.Circle({context:{x:l.x+l.width/2,y:a,r:s.node.radius,fillStyle:s.node.fillStyle,strokeStyle:s.node.strokeStyle,lineWidth:s.node.lineWidth}}),r=e;index_es._.isFunction(s.label.format)&&(r=s.label.format(e,l));var n=new _canvax.default.Display.Text(r,{context:{x:l.x+l.width/2,y:a-s.node.radius-1,fillStyle:s.label.fontColor,lineWidth:s.label.lineWidth,strokeStyle:s.label.strokeStyle,fontSize:s.label.fontSize,textAlign:s.label.textAlign,textBaseline:s.label.verticalAlign}});s.sprite.addChild(i),s.sprite.addChild(n);});}},{key:"_getProp",value:function(e,t,a){var l=e;return index_es._.isFunction(e)&&(l=e.apply(this,[t,a])),l}}]),l}(_component.default);index_es.global.registerComponent(barGuide,"barGuide");var _default=barGuide;exports.default=_default;
});

unwrapExports(barguide);

var theme = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_createClass2=interopRequireDefault(createClass$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_inherits2=interopRequireDefault(inherits$1),_component=interopRequireDefault(component),Theme=function(e){function u(e,r){var t;return (0, _classCallCheck2.default)(this,u),(t=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(u).call(this,e,r))).name="theme",t.colors=e||[],t}return (0, _inherits2.default)(u,e),(0, _createClass2.default)(u,[{key:"set",value:function(e){return this.colors=e,this.colors}},{key:"get",value:function(){var e=this.colors;return index_es._.isArray(e)||(e=[e]),e}},{key:"mergeTo",value:function(e){e=e||[];for(var r=0,t=this.colors.length;r<t;r++)e[r]?e[r]=this.colors[r]:e.push(this.colors[r]);return e}}]),u}(_component.default);index_es.global.registerComponent(Theme,"theme");var _default=Theme;exports.default=_default;
});

unwrapExports(theme);

var watermark = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_assertThisInitialized2=interopRequireDefault(assertThisInitialized$1),_createClass2=interopRequireDefault(createClass$1),_inherits2=interopRequireDefault(inherits$1),_canvax=interopRequireDefault(Canvax),_component=interopRequireDefault(component),waterMark=function(e){function a(e,t){var r;return (0, _classCallCheck2.default)(this,a),(r=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(a).call(this,e,t))).name="waterMark",r.width=r.app.width,r.height=r.app.height,index_es._.extend(!0,(0, _assertThisInitialized2.default)(r),(0, index_es.getDefaultProps)(a.defaultProps()),e),r.spripte=new _canvax.default.Display.Sprite({id:"watermark"}),r.app.stage.addChild(r.spripte),r.draw(),r}return (0, _inherits2.default)(a,e),(0, _createClass2.default)(a,null,[{key:"defaultProps",value:function(){return {text:{detail:"水印内容",default:"chartx"},fontSize:{detail:"字体大小",default:20},fontColor:{detail:"水印颜色",default:"#cccccc"},alpha:{detail:"水印透明度",default:.2},rotation:{detail:"水印旋转角度",default:45}}}}]),(0, _createClass2.default)(a,[{key:"draw",value:function(){for(var e=new _canvax.default.Display.Text(this.text,{context:{fontSize:this.fontSize,fillStyle:this.fontColor}}),t=e.getTextWidth(),r=e.getTextHeight(),a=parseInt(this.height/(5*r))+1,i=parseInt(this.width/(1.5*t))+1,l=0;l<a;l++)for(var s=0;s<i;s++){var u=new _canvax.default.Display.Text(this.text,{context:{rotation:this.rotation,fontSize:this.fontSize,fillStyle:this.fontColor,globalAlpha:this.alpha}});u.context.x=1.5*t*s+.25*t,u.context.y=5*r*l,this.spripte.addChild(u);}}}]),a}(_component.default);index_es.global.registerComponent(waterMark,"waterMark");var _default=waterMark;exports.default=_default;
});

unwrapExports(watermark);

var cross = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_assertThisInitialized2=interopRequireDefault(assertThisInitialized$1),_createClass2=interopRequireDefault(createClass$1),_inherits2=interopRequireDefault(inherits$1),_component=interopRequireDefault(component),_canvax=interopRequireDefault(Canvax),Line=_canvax.default.Shapes.Line,Cross=function(e){function r(e,t){var i;return (0, _classCallCheck2.default)(this,r),(i=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(r).call(this,e,t))).name="cross",i.width=e.width||0,i.height=e.height||0,i.x=null,i.y=null,i._hLine=null,i._vLine=null,index_es._.extend(!0,(0, _assertThisInitialized2.default)(i),(0, index_es.getDefaultProps)(r.defaultProps()),e),i._yAxis=i.app.getComponent({name:"coord"})._yAxis["left"==i.yAxisAlign?0:1],i.sprite=new _canvax.default.Display.Sprite,i.app.graphsSprite.addChild(i.sprite),i}return (0, _inherits2.default)(r,e),(0, _createClass2.default)(r,null,[{key:"defaultProps",value:function(){return {aimPoint:{detail:"准心位置",propertys:{x:{detail:"x",default:0},y:{detail:"y",default:0}}},line:{detail:"线配置",propertys:{strokeStyle:{detail:"线颜色",default:"#cccccc"},lineWidth:{detail:"线宽",default:1},lineType:{detail:"线样式类型",default:"solid"}}}}}}]),(0, _createClass2.default)(r,[{key:"draw",value:function(){var e=this,t=this.app.getComponent({name:"coord"});this.pos={x:t.origin.x,y:t.origin.y},this.width=t.width,this.height=t.height,this.aimPoint={x:this.width/2,y:this.height/2},this.setPosition(),e._hLine=new Line({context:{start:{x:0,y:-this.aimPoint.y},end:{x:e.width,y:-this.aimPoint.y},strokeStyle:e.line.strokeStyle,lineWidth:e.line.lineWidth,lineType:e.line.lineType}}),e.sprite.addChild(e._hLine),e._vLine=new Line({context:{start:{x:this.aimPoint.x,y:0},end:{x:this.aimPoint.x,y:-e.height},strokeStyle:e.line.strokeStyle,lineWidth:e.line.lineWidth,lineType:e.line.lineType}}),e.sprite.addChild(e._vLine);}}]),r}(_component.default);index_es.global.registerComponent(Cross,"cross");var _default=Cross;exports.default=_default;
});

unwrapExports(cross);

var lineschedu = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_assertThisInitialized2=interopRequireDefault(assertThisInitialized$1),_createClass2=interopRequireDefault(createClass$1),_inherits2=interopRequireDefault(inherits$1),_component=interopRequireDefault(component),_canvax=interopRequireDefault(Canvax),lineSchedu=function(e){function a(e,t){var i;return (0, _classCallCheck2.default)(this,a),(i=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(a).call(this,e,t))).name="lineSchedu",index_es._.extend(!0,(0, _assertThisInitialized2.default)(i),(0, index_es.getDefaultProps)(a.defaultProps()),e),i.lineDatas=null,i.sprite=new _canvax.default.Display.Sprite,i.app.graphsSprite.addChild(i.sprite),i}return (0, _inherits2.default)(a,e),(0, _createClass2.default)(a,null,[{key:"defaultProps",value:function(){return {lineField:{detail:"对应的line字段",default:null},style:{detail:"默认色",default:"#3995ff"},fillStyle:{detail:"节点填充色",default:"#ffffff"},lineWidth:{detail:"线宽",default:2},radius:{detail:"圆点半径",default:6},timeFontSize:{detail:"时间文本大小",default:14},timeFontColor:{detail:"时间文本颜色",default:"#606060"},listFontSize:{detail:"列表信息文本大小",default:12}}}}]),(0, _createClass2.default)(a,[{key:"reset",value:function(e){index_es._.extend(!0,this,e),this.lineDatas=null,this.sprite.removeAllChildren(),this.draw();}},{key:"draw",value:function(){var e=this,t=this.app.getComponent({name:"coord"});this.pos={x:t.origin.x,y:t.origin.y},this.setPosition();var i=e.app.getComponent({name:"graphs",type:"line",field:e.lineField});e.lineDatas=i.data[e.lineField].data;var a=this.app.getComponent({name:"coord"}).getAxis({type:"xAxis"}).getIndexOfVal(this.time);if(-1!=a){var l=this.lineDatas[a];if(null!=l.y){var r=e._getNodeY(l,t),n=l.x,s=new _canvax.default.Display.Sprite({context:{x:n-20}});this.sprite.addChild(s);var u=0,o=new _canvax.default.Display.Text(e.time,{context:{fillStyle:this.timeFontColor||this.style,fontSize:this.timeFontSize}});s.addChild(o);u=o.getTextHeight();var d=o.getTextWidth(),h=new _canvax.default.Display.Text(index_es._.flatten([e.list]).join("\n"),{context:{y:u,fillStyle:this.listFontColor||this.style,fontSize:this.listFontSize}});s.addChild(h),u+=h.getTextHeight(),(d=Math.max(d,h.getTextWidth()))+n-20>t.width+e.app.padding.right&&(s.context.x=t.width+e.app.padding.right,o.context.textAlign="right",h.context.textAlign="right");var p=0;"online"==e.status?(p=r-(this.radius+3)-u,Math.abs(p)>t.origin.y&&(p=-t.origin.y,r=-(t.origin.y-(this.radius+3)-u))):0<(p=r+(this.radius+3))+u&&(p=-u,r=-(this.radius+3)-u),s.context.y=p;var f=new _canvax.default.Shapes.BrokenLine({context:{pointList:[[n,r],[n,l.y]],strokeStyle:e.style,lineWidth:e.lineWidth}});e.sprite.addChild(f);var c=new _canvax.default.Shapes.Circle({context:{x:n,y:r,r:e.radius,fillStyle:e.fillStyle,strokeStyle:e.style,lineWidth:e.lineWidth}});e.sprite.addChild(c);}}}},{key:"_getNodeY",value:function(e,t){var i=this.app.height,a=(t.height,e.y);return "online"==this.status?a-=Math.min(50,.3*(i-Math.abs(a))):a+=Math.min(50,.3*Math.abs(a)),a}}]),a}(_component.default);index_es.global.registerComponent(lineSchedu,"lineSchedu");var _default=lineSchedu;exports.default=_default;
});

unwrapExports(lineschedu);

var markcloumn = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _classCallCheck2=interopRequireDefault(classCallCheck$1),_possibleConstructorReturn2=interopRequireDefault(possibleConstructorReturn$1),_getPrototypeOf2=interopRequireDefault(getPrototypeOf$1),_assertThisInitialized2=interopRequireDefault(assertThisInitialized$1),_createClass2=interopRequireDefault(createClass$1),_inherits2=interopRequireDefault(inherits$1),_component=interopRequireDefault(component),_canvax=interopRequireDefault(Canvax),Line=_canvax.default.Shapes.Line,Circle=_canvax.default.Shapes.Circle,Text=_canvax.default.Display.Text,markCloumn=function(e){function i(e,t){var l;return (0, _classCallCheck2.default)(this,i),(l=(0, _possibleConstructorReturn2.default)(this,(0, _getPrototypeOf2.default)(i).call(this,e,t))).name="markcloumn",index_es._.extend(!0,(0, _assertThisInitialized2.default)(l),(0, index_es.getDefaultProps)(i.defaultProps()),e),l.sprite=new _canvax.default.Display.Sprite,l.app.graphsSprite.addChild(l.sprite),l._line=null,l._lineSp=new _canvax.default.Display.Sprite,l.sprite.addChild(l._lineSp),l.nodes=[],l._nodes=new _canvax.default.Display.Sprite,l.sprite.addChild(l._nodes),l._labels=new _canvax.default.Display.Sprite,l.sprite.addChild(l._labels),l}return (0, _inherits2.default)(i,e),(0, _createClass2.default)(i,null,[{key:"defaultProps",value:function(){return {xVal:{detail:"x的value值",default:null},x:{detail:"x的像素值",default:null},markTo:{detail:"标准哪个目标字段",documentation:"如果设置了这个字段，那么line的起点将是这个graphs上的node节点",default:null},line:{detail:"线的配置",propertys:{enabled:{detail:"是否开启",default:!0},lineWidth:{detail:"线宽",default:2},strokeStyle:{detail:"线的颜色",default:"#d5d5d5"},lineType:{detail:"线的样式，虚线(dashed)实线(solid)",default:"solid"},startY:{detail:"startY",default:0},endY:{detail:"startY",default:null}}},node:{detail:"数据图形节点",propertys:{enabled:{detail:"是否开启",default:!0},radius:{detail:"节点半径",default:5},fillStyle:{detail:"节点图形的背景色",default:"#ffffff"},strokeStyle:{detail:"节点图形的描边色，默认和line.strokeStyle保持一致",default:null},lineWidth:{detail:"节点图形边宽大小",default:2}}},label:{detail:"文本",propertys:{enabled:{detail:"是否开启",default:!1},fontColor:{detail:"文本字体颜色",default:null},fontSize:{detail:"文本字体大小",default:12},text:{detail:"文本内容",documentation:"可以是函数",default:null},format:{detail:"文本格式化函数",default:null}}}}}}]),(0, _createClass2.default)(i,[{key:"draw",value:function(e){e=e||{},this.width=e.width,this.height=e.height,this.origin=e.origin,this.sprite.context.x=this.origin.x,this.sprite.context.y=this.origin.y,this._widget();}},{key:"reset",value:function(e){e&&index_es._.extend(!0,this,e),this._widget();}},{key:"_widget",value:function(){var i,n=this,e=this.app.getComponent({name:"coord"})._xAxis;if(null!=this.xVal&&(i=e.getNodeInfoOfVal(this.xVal)),null!=this.x&&(i=e.getNodeInfoOfPos(this.x)),i){n.nodes=[],n.on("complete",function(){n._drawLine(i),n._drawNodes(i),n._drawLabels(i);});var a=0,r=this.app.getGraphs();index_es._.each(r,function(l){function e(){if(a++,!n.markTo||-1!=index_es._.flatten([l.field]).indexOf(n.markTo)){var e=l.getNodesOfPos(i.x);if(n.markTo){var t=index_es._.find(e,function(e){return e.field==n.markTo});t&&(n.nodes=[t]);}else n.nodes=n.nodes.concat(e);}a==r.length&&n.fire("complete");}l.inited?e():l.on("complete",function(){e();});});}}},{key:"_drawLine",value:function(e){var t=this;if(t.line.enabled){var l=index_es._.extend(!0,{x:parseInt(e.x),start:{x:0,y:0},end:{x:0,y:-t.height},lineWidth:1,strokeStyle:"#cccccc"},this.line);if(null!=t.line.endY){var i=0;index_es._.isNumber(t.line.endY)&&(i=t.line.endY),"auto"==t.line.endY&&index_es._.each(t.nodes,function(e){i=Math.min(e.y);}),l.end.y=i;}this._line?index_es._.extend(this._line.context,l):(this._line=new Line({context:l}),this._lineSp.addChild(this._line),this._line.on(index_es.event.types.get(),function(e){e.eventInfo={xAxis:{},nodes:t.nodes},null!=t.xVal&&(e.eventInfo.xAxis.value=t.xVal,e.eventInfo.xAxis.text=t.xVal+"",e.eventInfo.title=t.xVal+""),t.app.fire(e.type,e);}));}}},{key:"_drawNodes",value:function(){var i=this;i.node.enabled&&(i._nodes.removeAllChildren(),index_es._.each(i.nodes,function(t){var e=index_es._.extend({x:t.x,y:t.y,cursor:"pointer",r:i.node.radius,lineWidth:i.node.lineWidth||t.lineWidth,strokeStyle:i.node.strokeStyle||t.color,fillStyle:i.node.fillStyle||t.fillStyle}),l=new Circle({context:e});l.nodeData=t,l.on(index_es.event.types.get(),function(e){e.eventInfo={xAxis:{},nodes:[t]},null!=i.xVal&&(e.eventInfo.xAxis.value=i.xVal,e.eventInfo.xAxis.text=i.xVal+"",e.eventInfo.title=i.xVal+""),i.app.fire(e.type,e);}),i._nodes.addChild(l);}));}},{key:"_drawLabels",value:function(){var n=this;n.node.enabled&&(n._labels.removeAllChildren(),index_es._.each(n.nodes,function(e){var t={x:e.x,y:e.y-n.node.radius-2,fillStyle:n.label.fontColor||e.color,fontSize:n.label.fontSize,textAlign:"center",textBaseline:"bottom"},l=n.label.text;if(index_es._.isFunction(l)&&(l=l.apply(n,[e])),l){var i=new Text(l,{context:t});n._labels.addChild(i),i.localToGlobal().x+i.getTextWidth()/2>n.app.width&&(i.context.x=n.app.width-i.getTextWidth()/2-i.parent.localToGlobal().x);}}));}}]),i}(_component.default);index_es.global.registerComponent(markCloumn,"markcloumn");var _default=markCloumn;exports.default=_default;
});

unwrapExports(markcloumn);

var dist = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var projectTheme=[];projectTheme&&projectTheme.length&&index_es.global.setGlobalTheme(projectTheme);var chartx={version:"1.0.168",mmvisVersion:index_es.version,options:{}};for(var p in index_es.global)chartx[p]=index_es.global[p];var _default=chartx;exports.default=_default;
});

var index$2 = unwrapExports(dist);

export default index$2;
