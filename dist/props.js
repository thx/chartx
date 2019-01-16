var chartx_props = (function () {
  'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
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

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  //坐标系组件
  var aa_test = function aa_test() {
    _classCallCheck(this, aa_test);
  };

  var _ = {};
  var breaker = {};
  var ArrayProto = Array.prototype,
      ObjProto = Object.prototype,
      FuncProto = Function.prototype; // Create quick reference variables for speed access to core prototypes.

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
      nativeKeys = Object.keys,
      nativeBind = FuncProto.bind;

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

    if (_typeof(target) !== "object" && !_.isFunction(target)) {
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

  var getDefaultProps = function getDefaultProps(dProps) {
    var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    for (var p in dProps) {
      if (!!p.indexOf("_")) {
        if (!dProps[p] || !dProps[p].propertys) {
          //如果这个属性没有子属性了，那么就说明这个已经是叶子节点了
          if (_.isObject(dProps[p]) && !_.isFunction(dProps[p]) && !_.isArray(dProps[p])) {
            target[p] = dProps[p].default;
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

  var _defaultProps = {
    layoutType: {
      detail: '布局方式',
      default: 'proportion'
    },
    dataSection: {
      detail: '轴数据集',
      default: []
    },
    sectionHandler: {
      detail: '自定义dataSection的计算公式',
      default: null
    },
    waterLine: {
      detail: '水位线',
      default: null,
      documentation: '水位data，需要混入 计算 dataSection， 如果有设置waterLine， dataSection的最高水位不会低于这个值'
    },
    middleweight: {
      detail: '区间等分线',
      default: null,
      documentation: '如果middleweight有设置的话 dataSectionGroup 为被middleweight分割出来的n个数组>..[ [0,50 , 100],[100,500,1000] ]'
    },
    symmetric: {
      detail: '自动正负对称',
      default: false,
      documentation: 'proportion下，是否需要设置数据为正负对称的数据，比如 [ 0,5,10 ] = > [ -10, 0 10 ]，象限坐标系的时候需要'
    },
    origin: {
      detail: '轴的起源值',
      default: null,
      documentation: '\
            1，如果数据中又正数和负数，则默认为0 <br />\
            2，如果dataSection最小值小于0，则baseNumber为最小值<br />\
            3，如果dataSection最大值大于0，则baseNumber为最大值<br />\
            4，也可以由用户在第2、3种情况下强制配置为0，则section会补充满从0开始的刻度值\
        '
    },
    sort: {
      detail: '排序',
      default: null
    },
    posParseToInt: {
      detail: '是否位置计算取整',
      default: false,
      documentation: '比如在柱状图中，有得时候需要高精度的能间隔1px的柱子，那么x轴的计算也必须要都是整除的'
    }
  };

  var axis =
  /*#__PURE__*/
  function () {
    _createClass(axis, null, [{
      key: "defaultProps",
      value: function defaultProps() {
        return _defaultProps;
      }
    }]);

    function axis(opt, dataOrg) {
      _classCallCheck(this, axis);

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

      this._axisLength = 1;
      this._cellCount = null;
      this._cellLength = null; //数据变动的时候要置空
      //默认的 dataSectionGroup = [ dataSection ], dataSection 其实就是 dataSectionGroup 去重后的一维版本

      this.dataSectionGroup = [];
      this.originPos = 0; //value为 origin 对应的pos位置

      this._originTrans = 0; //当设置的 origin 和datasection的min不同的时候，
      //min,max不需要外面配置，没意义

      this._min = null;
      this._max = null;

      _.extend(true, this, getDefaultProps(_defaultProps), opt);
    }

    _createClass(axis, [{
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
        this._axisLength = length;
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

        this._dataSectionLayout = [];

        _.each(this.dataSection, function (val, i) {
          var ind = i;

          if (me.layoutType == "proportion") {
            ind = me.getIndexOfVal(val);
          }
          var pos = parseInt(me.getPosOf({
            ind: i,
            val: val
          }), 10);

          me._dataSectionLayout.push({
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
        if (this.middleweight) {
          //支持多个量级的设置
          if (!_.isArray(this.middleweight)) {
            this.middleweight = [this.middleweight];
          }

          var dMin = _.min(this.dataSection);

          var dMax = _.max(this.dataSection);

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

          if (dMax > lastMW) {
            newDS.push(lastMW + (dMax - lastMW) / 2);
            newDS.push(dMax);
            newDSG.push([lastMW, lastMW + (dMax - lastMW) / 2, dMax]);
          } //好了。 到这里用简单的规则重新拼接好了新的 dataSection


          this.dataSection = newDS;
          this.dataSectionGroup = newDSG;
        }
      } //origin 对应 this.origin 的值

    }, {
      key: "_getOriginTrans",
      value: function _getOriginTrans(origin) {
        var pos = 0;
        var dsgLen = this.dataSectionGroup.length;
        var groupLength = this._axisLength / dsgLen;

        for (var i = 0, l = dsgLen; i < l; i++) {
          var ds = this.dataSectionGroup[i];

          if (this.layoutType == "proportion") {
            var min = _.min(ds);

            var max = _.max(ds);

            var amountABS = Math.abs(max - min);

            if (origin >= min && origin <= max) {
              pos = (origin - min) / amountABS * groupLength + i * groupLength;
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

        _.each(this._dataSectionLayout, function (item) {
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
        //先检查下 _dataSectionLayout 中有没有对应的记录
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
        //先检查下 _dataSectionLayout 中有没有对应的记录
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
        var pos;

        var cellCount = this._getCellCount(); //dataOrg上面的真实数据节点数，把轴分成了多少个节点


        if (this.layoutType == "proportion") {
          var dsgLen = this.dataSectionGroup.length;
          var groupLength = this._axisLength / dsgLen;

          for (var i = 0, l = dsgLen; i < l; i++) {
            var ds = this.dataSectionGroup[i];

            var min = _.min(ds);

            var max = _.max(ds);

            var val = "val" in opt ? opt.val : this.getValOfInd(opt.ind);

            if (val >= min && val <= max) {
              var _origin = this.origin; //如果 origin 并不在这个区间

              if (_origin < min || _origin > max) {
                _origin = min;
              }
              var maxGroupDisABS = Math.max(Math.abs(max - _origin), Math.abs(_origin - min));
              var amountABS = Math.abs(max - min);
              var h = maxGroupDisABS / amountABS * groupLength;
              pos = (val - _origin) / maxGroupDisABS * h + i * groupLength;

              if (isNaN(pos)) {
                pos = parseInt(i * groupLength);
              }
              break;
            }
          }
        } else {
          if (cellCount == 1) {
            //如果只有一数据，那么就全部默认在正中间
            pos = this._axisLength / 2;
          } else {
            //TODO 这里在非proportion情况下，如果没有opt.ind 那么getIndexOfVal 其实是有风险的，
            //因为可能有多个数据的val一样
            var valInd = "ind" in opt ? opt.ind : this.getIndexOfVal(opt.val);

            if (valInd != -1) {
              if (this.layoutType == "rule") {
                //line 的xaxis就是 rule
                pos = valInd / (cellCount - 1) * this._axisLength;
              }

              if (this.layoutType == "peak") {
                //bar的xaxis就是 peak

                /*
                pos = (this._axisLength/cellCount) 
                      * (valInd+1) 
                      - (this._axisLength/cellCount)/2;
                */
                var _cellLength = this.getCellLength();

                pos = _cellLength * (valInd + 1) - _cellLength / 2;
              }
            }
          }
        }
        !pos && (pos = 0);
        pos = Number(pos.toFixed(1)) + this._originTrans;
        return Math.abs(pos);
      }
    }, {
      key: "getValOfPos",
      value: function getValOfPos(pos) {
        //先检查下 _dataSectionLayout 中有没有对应的记录
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
        //先检查下 _dataSectionLayout 中有没有对应的记录
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
          var groupLength = this._axisLength / this.dataSectionGroup.length;

          _.each(this.dataSectionGroup, function (ds, i) {
            if (parseInt(ind / groupLength) == i || i == me.dataSectionGroup.length - 1) {
              var min = _.min(ds);

              var max = _.max(ds);

              val = min + (max - min) / groupLength * (ind - groupLength * i);
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
        //先检查下 _dataSectionLayout 中有没有对应的记录
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
          //先检查下 _dataSectionLayout 中有没有对应的记录
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

        var _axisLength = this._axisLength;
        var cellLength = _axisLength;

        var cellCount = this._getCellCount();

        if (cellCount) {
          if (this.layoutType == "proportion") {
            cellLength = 1;
          } else {
            //默认按照 peak 也就是柱状图的需要的布局方式
            cellLength = _axisLength / cellCount;

            if (this.layoutType == "rule") {
              if (cellCount == 1) {
                cellLength = _axisLength / 2;
              } else {
                cellLength = _axisLength / (cellCount - 1);
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
          cellCount = this._axisLength;
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

  ({
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

  });

  /**
   * 系统皮肤
   */

  //图表皮肤

  //十六进制颜色值的正则表达式

  var aRound = 360; //一圈的度数

  var Cos = Math.cos;
  var Sin = Math.sin;

  var Polar =
  /*#__PURE__*/
  function () {
    function Polar() {
      var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var dataFrame = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      _classCallCheck(this, Polar);

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

    _createClass(Polar, [{
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
    }], [{
      key: "filterPointsInRect",
      value: function filterPointsInRect(points, origin, width, height) {
        for (var i = 0, l = points.length; i < l; i++) {
          if (!Polar.checkPointInRect(points[i], origin, width, height)) {
            //该点不在root rect范围内，去掉
            points.splice(i, 1);
            i--, l--;
          }
        }
        return points;
      }
    }, {
      key: "checkPointInRect",
      value: function checkPointInRect(p, origin, width, height) {
        var _tansRoot = {
          x: p.x + origin.x,
          y: p.y + origin.y
        };
        return !(_tansRoot.x < 0 || _tansRoot.x > width || _tansRoot.y < 0 || _tansRoot.y > height);
      } //检查由n个相交点分割出来的圆弧是否在rect内

    }, {
      key: "checkArcInRect",
      value: function checkArcInRect(arc, r, origin, width, height) {
        var start = arc[0];
        var to = arc[1];
        var differenceR = to.radian - start.radian;

        if (to.radian < start.radian) {
          differenceR = Math.PI * 2 + to.radian - start.radian;
        }
        var middleR = (start.radian + differenceR / 2) % (Math.PI * 2);
        return Polar.checkPointInRect(Polar.getPointInRadianOfR(middleR, r), origin, width, height);
      } //获取某个点相对圆心的弧度值

    }, {
      key: "getRadianInPoint",
      value: function getRadianInPoint(point) {
        var pi2 = Math.PI * 2;
        return (Math.atan2(point.y, point.x) + pi2) % pi2;
      } //获取某个弧度方向，半径为r的时候的point坐标点位置

    }, {
      key: "getPointInRadianOfR",
      value: function getPointInRadianOfR(radian, r) {
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
      }
    }, {
      key: "getROfNum",
      value: function getROfNum(num, dataSection, width, height) {
        var r = 0;

        var maxNum = _.max(dataSection);

        var minNum = 0; //Math.min( this.rAxis.dataSection );

        var maxR = parseInt(Math.max(width, height) / 2);
        r = maxR * ((num - minNum) / (maxNum - minNum));
        return r;
      }
    }]);

    return Polar;
  }();

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
    }
    this.target = null;
    this.currentTarget = null;
    this.type = eventType;
    this.point = null;
    this._stopPropagation = false; //默认不阻止事件冒泡
  };

  Event.prototype = {
    stopPropagation: function stopPropagation() {
      this._stopPropagation = true;
    }
  };

  /**
   * Canvax
   *
   * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
   *
   * canvas 上委托的事件管理
   */
  var _mouseEvents = 'mousedown mouseup mouseover mousemove mouseout click dblclick';
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
      var types$$1 = _type;

      if (_.isString(_type)) {
        types$$1 = _type.split(/,| /);
      }

      _.each(types$$1, function (type) {
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
    _inherits(Dispatcher, _Manager);

    function Dispatcher() {
      _classCallCheck(this, Dispatcher);

      return _possibleConstructorReturn(this, _getPrototypeOf(Dispatcher).call(this));
    }

    _createClass(Dispatcher, [{
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
            } //然后，currentTarget要修正为自己


            e.currentTarget = this;
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

  //坐标系组件
  var allProps = {
    aa_test: aa_test
  };

  return allProps;

}());
