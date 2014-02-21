KISSY.add("canvax/animation/Animation" , function(S){
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
        || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame){
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame){
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }


    if ( Date.now === undefined ) {
        Date.now = function () {
            return new Date().valueOf();
        };
    }

    var Animation = Animation || ( function () {
        var _tweens = [];
        return {
            REVISION: '12',
            getAll: function () {
               return _tweens;
            },
            removeAll: function () {
               _tweens = [];
            },
            add: function ( tween ) {
               _tweens.push( tween );
            },
            remove: function ( tween ) {
                var i = _.indexOf( tween , _tweens );
                if ( i !== -1 ) {
                    _tweens.splice( i, 1 );
                }
            },
            update: function ( time ) {
                if ( _tweens.length === 0 ) return false;
                var i = 0;
                time = time !== undefined ? time : ( typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now() );

                while ( i < _tweens.length ) {
                    if ( _tweens[ i ].update( time ) ) {
                        i++;
                    } else {
                        _tweens.splice( i, 1 );
                    }
                }
                return true;
            }
        };
    } )();

    Animation.Tween = function ( object ) {

        var _object = object;
        var _valuesStart = {};
        var _valuesEnd = {};
        var _valuesStartRepeat = {};
        var _duration = 1000;
        var _repeat = 0;
        var _yoyo = false;
        var _isPlaying = false;
        var _reversed = false;
        var _delayTime = 0;
        var _startTime = null;
        var _easingFunction = Animation.Easing.Linear.None;
        var _interpolationFunction = Animation.Interpolation.Linear;
        var _chainedTweens = [];
        var _onStartCallback = null;
        var _onStartCallbackFired = false;
        var _onUpdateCallback = null;
        var _onCompleteCallback = null;

        // Set all starting values present on the target object
        for ( var field in object ) {
            _valuesStart[ field ] = parseFloat(object[field], 10);
        }

        this.to = function ( properties, duration ) {
            if ( duration !== undefined ) {
                _duration = duration;
            }
            _valuesEnd = properties;
            return this;
        };

        this.start = function ( time ) {
            Animation.add( this );
            _isPlaying = true;
            _onStartCallbackFired = false;
            _startTime = time !== undefined ? time : ( typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now() );
            _startTime += _delayTime;
            for ( var property in _valuesEnd ) {
                if ( _valuesEnd[ property ] instanceof Array ) {
                    if ( _valuesEnd[ property ].length === 0 ) {
                        continue;
                    }
                    _valuesEnd[ property ] = [ _object[ property ] ].concat( _valuesEnd[ property ] );
                }
                _valuesStart[ property ] = _object[ property ];

                if( ( _valuesStart[ property ] instanceof Array ) === false ) {
                    _valuesStart[ property ] *= 1.0; // Ensures we're using numbers, not strings
                }
                _valuesStartRepeat[ property ] = _valuesStart[ property ] || 0;
            }
            return this;
        };
        this.stop = function () {
            if ( !_isPlaying ) {
                return this;
            }
            Animation.remove( this );
            _isPlaying = false;
            this.stopChainedTweens();
            return this;
        };

        this.stopChainedTweens = function () {
            for ( var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++ ) {
                _chainedTweens[ i ].stop();
            }
        };
        this.delay = function ( amount ) {
            _delayTime = amount;
            return this;
        };
        this.repeat = function ( times ) {
            _repeat = times;
            return this;
        };
        this.yoyo = function( yoyo ) {
            _yoyo = yoyo;
            return this;
        };
        this.easing = function ( easing ) {
            _easingFunction = easing;
            return this;
        };
        this.interpolation = function ( interpolation ) {
            _interpolationFunction = interpolation;
            return this;
        };
        this.chain = function () {
            _chainedTweens = arguments;
            return this;
        };
        this.onStart = function ( callback ) {
            _onStartCallback = callback;
            return this;
        };
        this.onUpdate = function ( callback ) {
            _onUpdateCallback = callback;
            return this;
        };
        this.onComplete = function ( callback ) {
            _onCompleteCallback = callback;
            return this;
        };
        this.update = function ( time ) {
            var property;
            if ( time < _startTime ) {
                return true;
            }

            if ( _onStartCallbackFired === false ) {
                if ( _onStartCallback !== null ) {
                    _onStartCallback.call( _object );
                }
                _onStartCallbackFired = true;
            }

            var elapsed = ( time - _startTime ) / _duration;
            elapsed = elapsed > 1 ? 1 : elapsed;

            var value = _easingFunction( elapsed );

            for ( property in _valuesEnd ) {
                var start = _valuesStart[ property ] || 0;
                var end = _valuesEnd[ property ];
                if ( end instanceof Array ) {
                    _object[ property ] = _interpolationFunction( end, value );
                } else {
                    if ( typeof(end) === "string" ) {
                        end = start + parseFloat(end, 10);
                    }

                    if ( typeof(end) === "number" ) {
                        _object[ property ] = start + ( end - start ) * value;
                    }
                }
            }
            if ( _onUpdateCallback !== null ) {
                _onUpdateCallback.call( _object, value );
            }

            if ( elapsed == 1 ) {
                if ( _repeat > 0 ) {
                    if( isFinite( _repeat ) ) {
                        _repeat--;
                    }

                    for( property in _valuesStartRepeat ) {
                        if ( typeof( _valuesEnd[ property ] ) === "string" ) {
                            _valuesStartRepeat[ property ] = _valuesStartRepeat[ property ] + parseFloat(_valuesEnd[ property ], 10);
                        }

                        if (_yoyo) {
                            var tmp = _valuesStartRepeat[ property ];
                            _valuesStartRepeat[ property ] = _valuesEnd[ property ];
                            _valuesEnd[ property ] = tmp;
                            _reversed = !_reversed;
                        }
                        _valuesStart[ property ] = _valuesStartRepeat[ property ];

                    }
                    _startTime = time + _delayTime;
                    return true;
                } else {
                    if ( _onCompleteCallback !== null ) {
                        _onCompleteCallback.call( _object );

                    }
                    for ( var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++ ) {
                        _chainedTweens[ i ].start( time );
                    }
                    return false;
                }
            }
            return true;
        };
    };
    Animation.Easing = {
        Linear: {
            None: function ( k ) {
                return k;
            }
        },
        Quadratic: {
            In: function ( k ) {
                return k * k;
            },
            Out: function ( k ) {
                return k * ( 2 - k );
            },
            InOut: function ( k ) {
                if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
                return - 0.5 * ( --k * ( k - 2 ) - 1 );
            }
        },
        Cubic: {
            In: function ( k ) {
                return k * k * k;
            },
            Out: function ( k ) {
                return --k * k * k + 1;
            },
            InOut: function ( k ) {
                if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
                return 0.5 * ( ( k -= 2 ) * k * k + 2 );
            }
        },
        Quartic: {
            In: function ( k ) {
                return k * k * k * k;
            },
            Out: function ( k ) {
                return 1 - ( --k * k * k * k );
            },
            InOut: function ( k ) {
                if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
                return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );
            }
        },
        Quintic: {
            In: function ( k ) {
                return k * k * k * k * k;
            },
            Out: function ( k ) {
                return --k * k * k * k * k + 1;
            },
            InOut: function ( k ) {
                if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
                return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );
            }
        },
        Sinusoidal: {
            In: function ( k ) {
                return 1 - Math.cos( k * Math.PI / 2 );
            },
            Out: function ( k ) {
                return Math.sin( k * Math.PI / 2 );
            },
            InOut: function ( k ) {
                return 0.5 * ( 1 - Math.cos( Math.PI * k ) );
            }
        },
        Exponential: {
            In: function ( k ) {
                return k === 0 ? 0 : Math.pow( 1024, k - 1 );
            },
            Out: function ( k ) {
                return k === 1 ? 1 : 1 - Math.pow( 2, - 10 * k );
            },
            InOut: function ( k ) {
                if ( k === 0 ) return 0;
                if ( k === 1 ) return 1;
                if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 1024, k - 1 );
                return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );
            }
        },
        Circular: {
            In: function ( k ) {
                return 1 - Math.sqrt( 1 - k * k );
            },
            Out: function ( k ) {
                return Math.sqrt( 1 - ( --k * k ) );
            },
            InOut: function ( k ) {
                if ( ( k *= 2 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
                return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);
            }
        },
        Elastic: {
            In: function ( k ) {
                var s, a = 0.1, p = 0.4;
                if ( k === 0 ) return 0;
                if ( k === 1 ) return 1;
                if ( !a || a < 1 ) { a = 1; s = p / 4; }
                else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
                return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
            },
            Out: function ( k ) {
                var s, a = 0.1, p = 0.4;
                if ( k === 0 ) return 0;
                if ( k === 1 ) return 1;
                if ( !a || a < 1 ) { a = 1; s = p / 4; }
                else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
                return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );
            },
            InOut: function ( k ) {
                var s, a = 0.1, p = 0.4;
                if ( k === 0 ) return 0;
                if ( k === 1 ) return 1;
                if ( !a || a < 1 ) { a = 1; s = p / 4; }
                else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
                if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
                return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;
            }
        },
        Back: {
            In: function ( k ) {
                var s = 1.70158;
                return k * k * ( ( s + 1 ) * k - s );
            },
            Out: function ( k ) {
                var s = 1.70158;
                return --k * k * ( ( s + 1 ) * k + s ) + 1;
            },
            InOut: function ( k ) {
                var s = 1.70158 * 1.525;
                if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
                return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );
            }
        },
        Bounce: {
            In: function ( k ) {
                return 1 - Animation.Easing.Bounce.Out( 1 - k );
            },
            Out: function ( k ) {
                if ( k < ( 1 / 2.75 ) ) {
                    return 7.5625 * k * k;
                } else if ( k < ( 2 / 2.75 ) ) {
                    return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
                } else if ( k < ( 2.5 / 2.75 ) ) {
                    return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
                } else {
                    return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
                }
            },
            InOut: function ( k ) {
                if ( k < 0.5 ) return Animation.Easing.Bounce.In( k * 2 ) * 0.5;
                return Animation.Easing.Bounce.Out( k * 2 - 1 ) * 0.5 + 0.5;
            }
        }
    };
    Animation.Interpolation = {
        Linear: function ( v, k ) {
            var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = Animation.Interpolation.Utils.Linear;
            if ( k < 0 ) return fn( v[ 0 ], v[ 1 ], f );
            if ( k > 1 ) return fn( v[ m ], v[ m - 1 ], m - f );
            return fn( v[ i ], v[ i + 1 > m ? m : i + 1 ], f - i );
        },
        Bezier: function ( v, k ) {
            var b = 0, n = v.length - 1, pw = Math.pow, bn = Animation.Interpolation.Utils.Bernstein, i;
            for ( i = 0; i <= n; i++ ) {
                b += pw( 1 - k, n - i ) * pw( k, i ) * v[ i ] * bn( n, i );
            }
            return b;
        },
        CatmullRom: function ( v, k ) {
            var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = Animation.Interpolation.Utils.CatmullRom;
            if ( v[ 0 ] === v[ m ] ) {
                if ( k < 0 ) i = Math.floor( f = m * ( 1 + k ) );
                return fn( v[ ( i - 1 + m ) % m ], v[ i ], v[ ( i + 1 ) % m ], v[ ( i + 2 ) % m ], f - i );
            } else {
                if ( k < 0 ) return v[ 0 ] - ( fn( v[ 0 ], v[ 0 ], v[ 1 ], v[ 1 ], -f ) - v[ 0 ] );
                if ( k > 1 ) return v[ m ] - ( fn( v[ m ], v[ m ], v[ m - 1 ], v[ m - 1 ], f - m ) - v[ m ] );
                return fn( v[ i ? i - 1 : 0 ], v[ i ], v[ m < i + 1 ? m : i + 1 ], v[ m < i + 2 ? m : i + 2 ], f - i );
            }
        },
        Utils: {
            Linear: function ( p0, p1, t ) {
                return ( p1 - p0 ) * t + p0;
            },
            Bernstein: function ( n , i ) {
                var fc = Animation.Interpolation.Utils.Factorial;
                return fc( n ) / fc( i ) / fc( n - i );
            },
            Factorial: ( function () {
                var a = [ 1 ];
                return function ( n ) {
                    var s = 1, i;
                    if ( a[ n ] ) return a[ n ];
                    for ( i = n; i > 1; i-- ) s *= i;
                    return a[ n ] = s;
                };
            } )(),
            CatmullRom: function ( p0, p1, p2, p3, t ) {
                var v0 = ( p2 - p0 ) * 0.5, v1 = ( p3 - p1 ) * 0.5, t2 = t * t, t3 = t * t2;
                return ( 2 * p1 - 2 * p2 + v0 + v1 ) * t3 + ( - 3 * p1 + 3 * p2 - 2 * v0 - v1 ) * t2 + v0 * t + p1;
            }
        }
    };

    return Animation;
})
;KISSY.add("canvax/core/Base" , function(S){

    var classTypes = {};
    "Boolean Number String Function Array Date RegExp Object Error".replace(/[^, ]+/g, function(name) {
        classTypes["[object " + name + "]"] = name.toLowerCase()
    });

    var Base = {
        mainFrameRate   : 40,//默认主帧率
        now : 0,

        /*像素检测专用*/
        _pixelCtx   : null,

        __emptyFunc : function(){},
        //retina 屏幕优化
        _devicePixelRatio : window.devicePixelRatio || 1,
        /**
         * 创建dom
         * @param {string} id dom id 待用
         * @param {string} type : dom type， such as canvas, div etc.
         */
        _createCanvas : function(id, _width , _height) {
            var newDom = document.createElement("canvas");

            newDom.style.position = 'absolute';
            newDom.style.width = _width + 'px';
            newDom.style.height = _height + 'px';
            //newDom.setAttribute('width', _width );
            //newDom.setAttribute('height', _height );
            newDom.setAttribute('width', _width * this._devicePixelRatio);
            newDom.setAttribute('height', _height * this._devicePixelRatio);


            newDom.setAttribute('id', id);
            return newDom;
        },
        createObject : function(proto, constructor) {
            var newProto;
            var ObjectCreate = Object.create;
            if (ObjectCreate) {
                newProto = ObjectCreate(proto);
            } else {
                Base.__emptyFunc.prototype = proto;
                newProto = new Base.__emptyFunc();
            }
            newProto.constructor = constructor;
            return newProto;
        },

        creatClass : function(r, s, px){
            if (!s || !r) {
                return r;
            }

            var sp = s.prototype,
                rp;

            // add prototype chain
            rp = Base.createObject(sp, r);
            r.prototype = _.extend(rp, r.prototype);
            r.superclass = Base.createObject(sp, s);

            // add prototype overrides
            if (px) {
                _.extend(rp, px);
            }

            return r;
        },
        debugMode : false,
        log : function() {
            var self = this;
            if (!self.debugMode) {
                return;
            } else if ( "Error" in window ) {
                for (var k in arguments) {
                    throw new Error(arguments[k]);
                }
            } else if ("console" in window && console.log) {
                for (var k in arguments) {
                    console.log(arguments[k]);
                }
            }

            return self;
        },
        initElement : function( canvas ){
            if(typeof FlashCanvas != "undefined" && FlashCanvas.initElement){
                FlashCanvas.initElement( canvas );
            }
        },


        getContext1 : function(_ctx) {
            if (!_ctx) {
                //if (window.G_vmlCanvasManager) {
                //    var _div = document.createElement('div');
                //    _div.style.position = 'absolute';
                //    _div.style.top = '-1000px';
                //    document.body.appendChild(_div);

                //    _ctx = G_vmlCanvasManager.initElement(_div).getContext('2d');
                //} else {


                   //上面注释掉的为兼容excanvas的代码，下面的这个判断为兼容flashCanvas的代码
                   var canvas = document.createElement('canvas')

                   
                   if(typeof FlashCanvas != "undefined" && FlashCanvas.initElement){
                      FlashCanvas.initElement(canvas);
                   }
                   

                    _ctx = canvas.getContext('2d');
                //}
            }
            return _ctx;
        },

        _UID  : 0, //该值为向上的自增长整数值
        getUID:function(){
            return this._UID++;
        },
        createId : function(name) {
            //if end with a digit, then append an undersBase before appending
            var charCode = name.charCodeAt(name.length - 1);
            if (charCode >= 48 && charCode <= 57) name += "_";
            return name + Base.getUID();
        },
        getType : function(obj) { //取得类型
            if (obj == null) {
                return String(obj)
            }
            // 早期的webkit内核浏览器实现了已废弃的ecma262v4标准，可以将正则字面量当作函数使用，因此typeof在判定正则时会返回function
            return typeof obj === "object" || typeof obj === "function" ?
                classTypes[Object.prototype.toString.call(obj)] || "object" :
                typeof obj
        }

    }

    return Base

},{
    requires : [
      !window._ ? "canvax/library/underscore" : "", 
    ]
})
;KISSY.add("canvax/core/propertyFactory" , function(S,Base){
    //定义封装好的兼容大部分浏览器的defineProperties 的 属性工厂

    unwatchOne = {
        "$skipArray" : 0,
        "$watch"     : 1,
        "$fire"      : 2,//主要是get set 显性设置的 触发
        "$model"     : 3,
        "$accessor"  : 4,
        "$owner"     : 5,
        "path"       : 6 //这个应该是唯一一个不用watch的不带$的成员了吧，因为地图等的path是在太大
    }

    function propertyFactory(scope, model, watchMore) {

        var stopRepeatAssign=true;

        var skipArray = scope.$skipArray, //要忽略监控的属性名列表
            pmodel = {}, //要返回的对象
            accessores = {}, //内部用于转换的对象
            callSetters = [],
            callGetters = [],
            VBPublics = _.keys(unwatchOne); //用于IE6-8

        model = model || {};//这是pmodel上的$model属性
        watchMore = watchMore || {};//以$开头但要强制监听的属性
        skipArray = _.isArray(skipArray) ? skipArray.concat(VBPublics) : VBPublics;

        function loop(name, val) {
            if ( !unwatchOne[name] || (unwatchOne[name] && name.charAt(0) !== "$") ) {
                model[name] = val
            };
            var valueType = Base.getType(val);
            if (valueType === "function") {
                if(!unwatchOne[name]){
                  VBPublics.push(name) //函数无需要转换
                }
            } else {
                if (_.indexOf(skipArray,name) !== -1 || (name.charAt(0) === "$" && !watchMore[name])) {
                    return VBPublics.push(name)
                }
                var accessor, oldArgs;
                if (valueType === "object" && typeof val.get === "function" && _.keys(val).length <= 2) {
                    var setter = val.set;
                    var getter = val.get;
                    accessor = function(neo) { 
                        //创建计算属性，因变量，基本上由其他监控属性触发其改变
                        var value = accessor.value, preValue = value;
                        if (arguments.length) {
                            //走的setter
                            if (stopRepeatAssign) {
                                return //阻止重复赋值
                            }
                            if (typeof setter === "function") {
                                setter.call(pmodel, neo)
                            }
                            if (oldArgs !== neo) { //只检测用户的传参是否与上次是否一致
                                oldArgs = neo;
                                value = accessor.value = model[name] = neo ;
                                pmodel.$fire && pmodel.$fire(name, value, preValue);
                            }
                        } else {
                            //走的getter
                            neo = accessor.value = model[name] = getter.call(pmodel);
                            if (value !== neo) {
                                oldArgs = void 0;
                                pmodel.$fire && pmodel.$fire(name, neo, value)
                            }
                            return neo
                        }
                    }
                    callGetters.push(accessor)
                } else {
                    accessor = function(neo) { //创建监控属性或数组，自变量，由用户触发其改变
                        var value = accessor.value, preValue = value, complexValue;
                        if (arguments.length) {

                            //set 的 值的 类型
                            var neoType = Base.getType(neo);

                            if (stopRepeatAssign) {
                                return //阻止重复赋值
                            }
                            if (value !== neo) {

                                //if (valueType === "array" || valueType === "object") {

                                if( neoType === "array" || neoType === "object" ){

                                    value = neo.$model ? neo : propertyFactory(neo , neo);

                                    complexValue = value.$model;


                                } else {//如果是其他数据类型
                                    value = neo
                                }
                                accessor.value = value;
                                model[name] = complexValue ? complexValue : value;//更新$model中的值
                                if (!complexValue) {
                                    pmodel.$fire && pmodel.$fire(name, value, preValue)
                                }

                                if(valueType != neoType){
                                    //如果set的值类型已经改变，
                                    //那么也要把对应的valueType修改为对应的neoType
                                    valueType = neoType;
                                }
                                
                                //所有的赋值都要触发watch的监听事件
                                pmodel.$watch && pmodel.$watch.call(pmodel , name, value, preValue)


                            }
                        } else {

                            if ((valueType === "array" || valueType === "object") && !value.$model) {
                                value = propertyFactory(value , value);
                                accessor.value = value;
                            }
                            return value;

                        }
                    }
                    accessor.value = val;
                    callSetters.push(name)
                };
                accessores[name] = {
                    set: accessor,
                    get: accessor,
                    enumerable: true
                }
            }
        };
        
        for (var i in scope) {
            loop(i, scope[i])
        };

        pmodel = defineProperties(pmodel, accessores, VBPublics);//生成一个空的ViewModel

        _.forEach(VBPublics,function(name) {
            if (scope[name]) {//先为函数等不被监控的属性赋值
                if(typeof scope[name] == "function" ){
                   pmodel[name] = function(){
                      scope[name].apply(this , arguments);
                   }
                } else {
                   pmodel[name] = scope[name];
                }
            }
        });

        pmodel.$model = model;
        pmodel.$accessor = accessores;

        pmodel.hasOwnProperty = function(name) {
            return name in pmodel.$model
        };

        stopRepeatAssign = false;

        return pmodel
    }
    var defineProperty = Object.defineProperty
        //如果浏览器不支持ecma262v5的Object.defineProperties或者存在BUG，比如IE8
        //标准浏览器使用__defineGetter__, __defineSetter__实现
        try {
            defineProperty({}, "_", {
                value: "x"
            })
            var defineProperties = Object.defineProperties
        } catch (e) {
            if ("__defineGetter__" in Object) {
                defineProperty = function(obj, prop, desc) {
                    if ('value' in desc) {
                        obj[prop] = desc.value
                    }
                    if ('get' in desc) {
                        obj.__defineGetter__(prop, desc.get)
                    }
                    if ('set' in desc) {
                        obj.__defineSetter__(prop, desc.set)
                    }
                    return obj
                };
                defineProperties = function(obj, descs) {
                    for (var prop in descs) {
                        if (descs.hasOwnProperty(prop)) {
                            defineProperty(obj, prop, descs[prop])
                        }
                    }
                    return obj
                };
            }
        }
    //IE6-8使用VBScript类的set get语句实现
    if (!defineProperties && window.VBArray) {
        window.execScript([
                "Function parseVB(code)",
                "\tExecuteGlobal(code)",
                "End Function"
                ].join("\n"), "VBScript");

        function VBMediator(description, name, value) {
            var fn = description[name] && description[name].set;
            if (arguments.length === 3) {
                fn(value);
            } else {
                return fn();
            }
        };
        defineProperties = function(publics, description, array) {
            publics = array.slice(0);
            publics.push("hasOwnProperty");
            var className = "VBClass" + setTimeout("1"), owner = {}, buffer = [];
            buffer.push(
                    "Class " + className,
                    "\tPrivate [__data__], [__proxy__]",
                    "\tPublic Default Function [__const__](d, p)",
                    "\t\tSet [__data__] = d: set [__proxy__] = p",
                    "\t\tSet [__const__] = Me", //链式调用
                    "\tEnd Function");
            _.forEach(publics,function(name) { //添加公共属性,如果此时不加以后就没机会了
                if (owner[name] !== true) {
                    owner[name] = true //因为VBScript对象不能像JS那样随意增删属性
                buffer.push("\tPublic [" + name + "]") //你可以预先放到skipArray中
                }
            });
            for (var name in description) {
                owner[name] = true
                    buffer.push(
                            //由于不知对方会传入什么,因此set, let都用上
                            "\tPublic Property Let [" + name + "](val)", //setter
                            "\t\tCall [__proxy__]([__data__], \"" + name + "\", val)",
                            "\tEnd Property",
                            "\tPublic Property Set [" + name + "](val)", //setter
                            "\t\tCall [__proxy__]([__data__], \"" + name + "\", val)",
                            "\tEnd Property",
                            "\tPublic Property Get [" + name + "]", //getter
                            "\tOn Error Resume Next", //必须优先使用set语句,否则它会误将数组当字符串返回
                            "\t\tSet[" + name + "] = [__proxy__]([__data__],\"" + name + "\")",
                            "\tIf Err.Number <> 0 Then",
                            "\t\t[" + name + "] = [__proxy__]([__data__],\"" + name + "\")",
                            "\tEnd If",
                            "\tOn Error Goto 0",
                            "\tEnd Property")
            }
            buffer.push("End Class"); //类定义完毕
            buffer.push(
                    "Function " + className + "Factory(a, b)", //创建实例并传入两个关键的参数
                    "\tDim o",
                    "\tSet o = (New " + className + ")(a, b)",
                    "\tSet " + className + "Factory = o",
                    "End Function");
            window.parseVB(buffer.join("\r\n"));//先创建一个VB类工厂
            return  window[className + "Factory"](description, VBMediator);//得到其产品
        }
    }

    return propertyFactory;





} , {
   requires : [
     "canvax/core/Base" 
       ]
});
;KISSY.add("canvax/display/Bitmap" , function(S , Shape , Base){
  var Bitmap = function(opt){
      var self = this;
      self.type = "bitmap";

      //TODO:这里不负责做img 的加载，所以这里的img是必须已经准备好了的img元素
      //如果img没准备好，会出现意想不到的错误，我不给你负责
      self.img  = opt.img || null; //bitmap的图片来源，可以是页面上面的img 也可以是某个canvas


      opt.context || (opt.context = {});
      self._context = {
          dx     : opt.context.dx     || 0, //图片切片的x位置
          dy     : opt.context.dy     || 0, //图片切片的y位置
          dWidth : opt.context.dWidth || 0, //切片的width
          dHeight: opt.context.dHeight|| 0  //切片的height
      }


      arguments.callee.superclass.constructor.apply(this, arguments);

  };

  Base.creatClass( Bitmap , Shape , {
      draw : function(ctx, style) {
          if (!this.img) {
              //img都没有画个毛
              return;
          };
          var image = this.img;
          if(!style.width || !style.height ){
              ctx.drawImage(image, 0, 0);
          } else {
              if(!style.dWidth || !style.dHeight ){
                 ctx.drawImage(image, 0, 0, style.width, style.height);
              } else {
                 ctx.drawImage(image , style.dx , style.dy , style.dWidth , style.dHeight,0, 0, style.width, style.height );
              }
          }
      }
  });

  return Bitmap;

} , {
  requires:[
    "canvax/display/Shape",
    "canvax/core/Base"
  ]
})
;KISSY.add("canvax/display/DisplayObject" , function(S , EventDispatcher , Matrix , Point , Base , HitTestPoint , propertyFactory){

    var DisplayObject = function(opt){
        arguments.callee.superclass.constructor.apply(this, arguments);
        var self = this;

        //设置默认属性
        self.id = opt.id || null;

        //相对父级元素的矩阵
        self._transform = null;

        //相对stage的全局矩阵
        //如果父子结构有变动，比如移动到另外个容器里面去了
        //就要对应的修改新为的矩阵
        //怎么修改呢。self._transformStage=null就好了
        self._transformStage = null;

        self._eventId = null;

        //心跳次数
        self._heartBeatNum = 0;

        //元素对应的stage元素
        self.stage  = null;

        //元素的父元素
        self.parent = null;

        self._eventEnabled = false; //是否响应事件交互

        self.dragEnabled   = false;   //是否启用元素的拖拽

        //创建好context
        self._createContext( opt );

        var UID = Base.createId(self.type);

        //给每个元素添加eventid，EventManager 事件管理器中要用
        self._eventId = UID;

        //如果没有id 则 沿用uid
        if(self.id == null){
            self.id = UID ;
        }

        self.init.apply(self , arguments);

    };
    
    Base.creatClass( DisplayObject , EventDispatcher , {
    //DisplayObject.prototype = {
        init : function(){
            //TODO: 这个方法由各派生类自己实现
        },
        _createContext : function( opt ){
            var self = this;
            //所有显示对象，都有一个类似canvas.context类似的 context属性
            //用来存取改显示对象所有和显示有关的属性，坐标，样式等。
            //该对象为Coer.propertyFactory()工厂函数生成
            self.context = null;

            //如果用户没有传入context设置，就默认为空的对象
            opt.context || (opt.context = {});

            //提供给Coer.propertyFactory() 来 给 self.context 设置 propertys
            var _contextATTRS = {
                width         : opt.context.width         || 0,
                height        : opt.context.height        || 0,
                x             : opt.context.x             || 0,
                y             : opt.context.y             || 0,
                alpha         : opt.context.alpha         || 1,
                scaleX        : opt.context.scaleX        || 1,
                scaleY        : opt.context.scaleY        || 1,
                scaleOrigin   : opt.context.scaleOrigin   || {
                  x : 0,
                  y : 0
                },
                rotation      : opt.context.rotation      || 0,
                rotateOrigin  : opt.context.rotateOrigin  ||  {
                  x:0,
                  y:0
                },
                visible       : opt.context.visible       || true,
                cursor        : opt.context.cursor        || "default"
            };


            var _context2D_context = {
                //canvas context 2d 的 系统样式。目前就知道这么多
                fillStyle     : opt.context.fillStyle      || null,
                lineCap       : opt.context.lineCap        || null,
                lineJoin      : opt.context.lineJoin       || null,
                lineWidth     : opt.context.lineWidth      || null,
                miterLimit    : opt.context.miterLimit     || null,
                shadowBlur    : opt.context.shadowBlur     || null,
                shadowColor   : opt.context.shadowColor    || null,
                shadowOffsetX : opt.context.shadowOffsetX  || null,
                shadowOffsetY : opt.context.shadowOffsetY  || null,
                strokeStyle   : opt.context.strokeStyle    || null,
                globalAlpha   : opt.context.globalAlpha    || null,
                font          : opt.context.font           || null,
                textAlign     : opt.context.textAlign      || "left",
                textBaseline  : opt.context.textBaseline   || "top",
                arcScaleX_    : opt.context.arcScaleX_     || null,
                arcScaleY_    : opt.context.arcScaleY_     || null,
                lineScale_    : opt.context.lineScale_     || null,
                globalCompositeOperation : opt.context.globalCompositeOperation || "source-over"
            };

            _contextATTRS = _.extend( _contextATTRS , _context2D_context );

            //然后看继承者是否有提供_context 对象 需要 我 merge到_context2D_context中去的
            if (self._context) {
                _contextATTRS = _.extend(self._context , _contextATTRS);
            }

            //有些引擎内部设置context属性的时候是不用上报心跳的，比如做hitTestPoint热点检测的时候
            self._notWatch = false;

            _contextATTRS.$owner = self;
            _contextATTRS.$watch = function(name , value , preValue){

                if(this.$owner._notWatch){
                    return;
                };

                //TODO 暂时所有的属性都上报，有时间了在来慢慢梳理
                var stage = this.$owner.getStage(); 

                if(stage.stageRending){
                    //如果这个时候stage正在渲染中，嗯。那么所有的 attrs的 set 都忽略
                    //TODO：先就这么处理，如果后续发现这些忽略掉的set，会影响到渲染，那么就在
                    //考虑加入 在这里加入设置下一step的心跳的机制
                    return
                };

                //stage存在，才说self代表的display已经被添加到了displayList中，绘图引擎需要知道其改变后
                //的属性，所以，通知到stage.displayAttrHasChange
                this.$owner.heartBeat( {
                    convertType:"context",
                    shape   : this.$owner,
                    name    : name,
                    value   : value,
                    preValue: preValue
                });
            };

            //执行init之前，应该就根据参数，把context组织好线
            self.context = propertyFactory( _contextATTRS );

        },
        /* @myself 是否生成自己的镜像 
         * 克隆又两种，一种是镜像，另外一种是绝对意义上面的新个体
         * 默认为绝对意义上面的新个体，新对象id不能相同
         * 镜像基本上是框架内部在实现  镜像的id相同 主要用来把自己画到另外的stage里面，比如
         * mouseover和mouseout的时候调用*/
        clone:function(myself){
            var newObj = _.clone(this);
            newObj.parent = null;
            newObj.stage  = null;
            //newObj.context= propertyFactory(this.context.$model);
            if(!myself){
              //新对象的id不能相同
              newObj.id             = Base.createId(newObj.type);
              newObj._eventId       = newObj.id;
              newObj.context        = propertyFactory(this.context.$model);
              newObj.context.$owner = newObj;
              newObj.context.$watch = this.context.$watch;
            }
            return newObj;
        },
        heartBeat : function(opt){
           this._heartBeatNum ++;
           var stage = this.getStage();
           stage.heartBeat && stage.heartBeat(opt);
        },
        getCurrentWidth : function(){
           return Math.abs(this.context.width * this.context.scaleX);
        },
        getCurrentHeight : function(){
	       return Math.abs(this.context.height * this.context.scaleY);
        },
        getStage : function(){
            if(this.stage) {
                return this.stage;
            }
            var p = this;
            if (p.type != "stage"){
              while(p.parent) {
                p = p.parent;
                if (p.type == "stage"){
                  break;
                }
              };
  
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
            
        },
        localToGlobal : function(x, y){
            var cm = this._transformStage;
            if(!cm){
                cm = this.getConcatenatedMatrix();
                this._transformStage , cm;
            }

            //自己克隆，避免影响倒this._transformStage
            cm=cm.clone();
                
            if (cm == null) return {x:0, y:0};
            var m = new Matrix(1, 0, 0, 1, x, y);
            m.concat(cm);
            return {x:m.tx, y:m.ty};
        },
        globalToLocal : function(x, y) {
            var cm = this._transformStage;
            if(!cm){
                cm = this.getConcatenatedMatrix();
                this._transformStage = cm;
            }
            
            //自己克隆，避免影响倒this._transformStage
            cm=cm.clone();


            if (cm == null) return {x:0, y:0};
            cm.invert();
            var m = new Matrix(1, 0, 0, 1, x, y);
            m.concat(cm);
            return {x:m.tx, y:m.ty};
        },
        localToTarget : function(x, y, target){
            var p = localToGlobal(x, y);
            return target.globalToLocal(p.x, p.y);
        },
        getConcatenatedMatrix : function(){
            //TODO: cache the concatenated matrix to get better performance
            var cm = this._transformStage;
            if(cm){
                return cm;
            }
            cm = new Matrix();
            for (var o = this; o != null; o = o.parent) {
                cm.concat( o._transform );
                if( !o.parent || o.type=="stage" ) break;
            }
            this._transformStage = cm;
            return cm;
        },
        /*
         *设置元素的是否响应事件检测
         *@bool  Boolean 类型
         */
        setEventEnable : function( bool ){
            if(_.isBoolean(bool)){
                this._eventEnabled = bool
                return true;
            };
            return false;
        },
        /*
         *查询自己在parent的队列中的位置
         */
        getIndex   : function(){
           if(!this.parent) {
             return;
           };
           return _.indexOf(this.parent.children , this)

        },
        /*
         *元素在z轴方向向下移动
         *@index 移动的层级
         */
        toBack : function(index){
           if(!this.parent) {
             return;
           }
           var fromIndex = this.getIndex();
           var toIndex = 0;
           
           if(_.isNumber(index)){
             if(index == 0){
                //原地不动
                return;
             }
             toIndex = fromIndex-index;
           }
           var me = this.parent.children.splice( fromIndex , 1 )[0];
           if( toIndex < 0 ){
               toIndex = 0;
           } 
           this.parent.addChildAt( me , toIndex );

        },
        /*
         *元素在z轴方向向上移动
         *@index 移动的层数量 默认到顶端
         */
        toFront : function(index){

           if(!this.parent) {
             return;
           }
           var fromIndex = this.getIndex();
           var pcl = this.parent.children.length;
           var toIndex = pcl;
           
           if(_.isNumber(index)){
             if(index == 0){
                //原地不动
                return;
             }
             toIndex = fromIndex+index+1;
           }
           var me = this.parent.children.splice( fromIndex , 1 )[0];
           if(toIndex > pcl){
               toIndex = pcl;
           }
           this.parent.addChildAt( me , toIndex-1 );
        },
        _transformHander : function(context, toGlobal){

            context.transform.apply(context , this._updateTransform().toArray());
 
            //设置透明度
            context.globalAlpha *= this.context.alpha;
        },
        _updateTransform : function() {
            
            
            var _transform = this._transform || new Matrix();

            _transform.identity();

            //是否需要Transform
           

            if(this.context.scaleX !== 1 || this.context.scaleY!==1){
                //如果有缩放
                //缩放的原点坐标
                var origin = new Point(this.context.scaleOrigin);
                if( origin.x || origin.y ){
                    _transform.translate( -origin.x , -origin.y );
                }

                _transform.scale( this.context.scaleX , this.context.scaleY );
                if( origin.x || origin.y ){
                    _transform.translate( origin.x , origin.y );
                };
            };


            var rotation = this.context.rotation;
            if(rotation){
                //如果有旋转
                //旋转的原点坐标
                var origin = new Point(this.context.rotateOrigin);
                if( origin.x || origin.y ){
                    _transform.translate( -origin.x , -origin.y );
                }
                _transform.rotate( rotation%360 * Math.PI/180);
                if( origin.x || origin.y ){
                    _transform.translate( origin.x , origin.y );
                }

            };
            
            if(this.context.x!=0 || this.context.y!=0){
               //如果有位移
               _transform.translate( this.context.x , this.context.y );
            }

            this._transform = _transform;

            //更新_transform  对应的全局_transformStage 也要滞空，好在下次使用_transformStage的时候能
            //this._transformStage = null;
            return _transform;
        },
        getRect:function(style){
            return style
        },
        //显示对象的选取检测处理函数
        hitTestPoint : function( mouseX , mouseY){
            var result; //检测的结果
            var x = mouseX ;
            var y = mouseY ;

            //这个时候如果有对context的set，告诉引擎不需要watch，因为这个是引擎触发的，不是用户
            //用户set context 才需要触发watch
            this._notWatch = true;
        
            //对鼠标的坐标也做相同的变换
            if( this._transform ){
                var inverseMatrix = this._transform.clone().invert();

                var originPos = [x, y];
                inverseMatrix.mulVector( originPos , [ x , y , 1 ] );

               
                x = originPos[0];
                y = originPos[1];
            }

            // 快速预判并保留判断矩形
            if(!this._rect) {
                //如果没有图像的_rect
                this._rect = this.getRect(this.context);
                if(!this._rect){
                   return false;
                };
                if( !this.context.width && !!this._rect.width ){
                    this.context.width = this._rect.width;
                }
                if( !this.context.height && !!this._rect.height ){
                    this.context.height = this._rect.height;
                }
            };

            if(!this._rect.width || !this._rect.height) {
                return false;
            }

            //正式开始第一步的矩形范围判断
           
            if (x >= this._rect.x
                && x <= (this._rect.x + this._rect.width)
                && y >= this._rect.y
                && y <= (this._rect.y + this._rect.height)
            ) {
               //那么就在这个元素的矩形范围内
               //return true;
               result = HitTestPoint.isInside( this , x , y );

            } else {
               //如果连矩形内都不是，那么肯定的，这个不是我们要找的shap
               result = false;
            }
            this._notWatch = false;

            return result;

        },
        _render : function(context, noTransform, globalTransform){	
            if(!this.context.visible || this.context.alpha <= 0){
                return;
            }
            context.save();
            if(!noTransform) {
                this._transformHander(context, globalTransform);
            }
            this.render(context);
            context.restore();
        },
        render : function(context) {
            //基类不提供render的具体实现，由后续具体的派生类各自实现
        },
        //从树中删除
        remove : function(){
            if( this.parent ){
                this.parent.removeChild(this);
            }
        },
        //元素的自我销毁
        destroy : function(){
            this.remove();

            //把自己从父节点中删除了后做自我清除，释放内存
            this.context = null;
            delete this.context;

        },
        toString : function(){
            var result;
            
            if (!this.parent) {
              return this.id+"(stage)";
            }
            for(var o = this ; o != null; o = o.parent) {		
                //prefer id over name if specified
                var s = o.id+"("+ o.type +")";
                result = result == null ? s : (s + "-->" + result);
                if (o == o.parent || !o.parent) break;
            }

            return result; 
        }

    } );

    return DisplayObject;

} , {
    requires : [
      "canvax/event/EventDispatcher",
      "canvax/geom/Matrix",
      "canvax/display/Point",
      "canvax/core/Base",
      "canvax/utils/HitTestPoint",
      "canvax/core/propertyFactory"
    ]
});
;KISSY.add("canvax/display/DisplayObjectContainer" , function(S ,Base, DisplayObject){

    DisplayObjectContainer = function(opt){
       var self = this;
       self.children = [];
       self.mouseChildren = [];
       arguments.callee.superclass.constructor.apply(this, arguments);

       //所有的容器默认支持event 检测，因为 可能有里面的shape是eventEnable是true的
       //如果用户有强制的需求让容器下的所有元素都 不可检测，可以调用
       //DisplayObjectContainer的 setEventEnable() 方法
       self._eventEnabled = true;
    };

    Base.creatClass( DisplayObjectContainer , DisplayObject , {
        addChild : function(child){
            if( !child ) {
                return;
            } 
            if( !(child instanceof DisplayObject) ){
                //TODO:尼玛啊，这个东西一加上就会导致hover的事情没法触发
                //主要是因为clone这个方法还有待改善
                //return false;
            }
            if(this.getChildIndex(child) != -1) {
                child.parent = this;
                return child;
            }

            //如果他在别的子元素中，那么就从别人那里删除了
            if(child.parent) {
                child.parent.removeChild(child);
            }
            this.children.push( child );
            child.parent = this;
            if(this.heartBeat){
               this.heartBeat({
                 convertType : "children",
                 target      : child,
                 src         : this
               });
            }

            if(this.afterAddChild){
               this.afterAddChild(child);
            }

            return child;
        },
        addChildAt : function(child, index) {
            if(this.getChildIndex(child) != -1) {
                child.parent = this;
                return child;
            }

            if(child.parent) {
                child.parent.removeChild(child);
            }
            this.children.splice(index, 0, child);
            child.parent = this;
            
            //上报children心跳
            if(this.heartBeat){
               this.heartBeat({
                 convertType : "children",
                 target       : child,
                 src      : this
               });
            }
            
            if(this.afterAddChild){
               this.afterAddChild(child,index);
            }

            return child;
        },
        removeChild : function(child) {
            return this.removeChildAt(_.indexOf( this.children , child ));
        },
        removeChildAt : function(index) {

            if (index < 0 || index > this.children.length - 1) {
                return false;
            }
            var child = this.children[index];
            if (child != null) {
                child.parent = null;
            }
            this.children.splice(index, 1);
            
            if(this.heartBeat){
               this.heartBeat({
                 convertType : "children",
                 target       : child,
                 src      : this
               });
            };
            
            if(this.afterDelChild){
               this.afterDelChild(child , index);
            }

            return child;
        },
        removeChildById : function( id ) {	
            for(var i = 0, len = this.children.length; i < len; i++) {
                if(this.children[i].id == id) {
                    return this.removeChildAt(i);
                }
            }
            return false;
        },
        removeAllChildren : function() {
            while(this.children.length > 0) {
                this.removeChildAt(0);
            }
        },
        //集合类的自我销毁
        destroy : function(){
            if( this.parent ){
                this.parent.removeChild(this);
            }

            //依次销毁所有子元素
            //TODO：这个到底有没有必要。还有待商榷
            for(var i = 0, len = this.children.length; i < len; i++) {
                var child = this.children[i];
                child.destroy();
            }
            //this = null;
        },
        /*
         *@id 元素的id
         *@boolen 是否深度查询，默认就在第一层子元素中查询
         **/
        getChildById : function(id , boolen){
            if(!boolen) {
                for(var i = 0, len = this.children.length; i < len; i++){
                    if(this.children[i].id == id) {
                        return this.children[i];
                    }
                }
            } else {
                //深度查询
                //TODO:暂时未实现
                return null
            }
            return null;
        },
        getChildAt : function(index) {
            if (index < 0 || index > this.children.length - 1) return null;
            return this.children[index];
        },
        getChildIndex : function(child) {
            return _.indexOf( this.children , child );
        },
        setChildIndex : function(child, index){
            if(child.parent != this) return;
            var oldIndex = _.indexOf( this.children , child );
            if(index == oldIndex) return;
            this.children.splice(oldIndex, 1);
            this.children.splice(index, 0, child);
        },
        contains : function(child) {
            return this.getChildIndex(child) != -1;
        },
        getNumChildren : function() {
            return this.children.length;
        },
        //获取x,y点上的所有object  num 需要返回的obj数量
        getObjectsUnderPoint : function(x, y , num) {
            var result = [];
            for(var i = this.children.length - 1; i >= 0; i--) {
                var child = this.children[i];

                if(child == null || !child._eventEnabled) {
                    continue;
                }

                if( child instanceof DisplayObjectContainer ) {
                    //是集合
                    if (child.mouseChildren && child.getNumChildren() > 0){
                       var objs = child.getObjectsUnderPoint(x, y);
                       if (objs.length > 0){
                          result = result.concat( objs );
                       }
                    }		
                } else {
                    //非集合，可以开始做hitTestPoint了
                    if (child.hitTestPoint(x, y)) {
                        result.push(child);
                        if (num != undefined && !isNaN(num)){
                           if(result.length == num){
                              return result;
                           }
                        }
                    }
                }
            }
            return result;
        },
        render : function(context) {
            
            for(var i = 0, len = this.children.length; i < len; i++) {
                var child = this.children[i];
                child._render(context);
            }
        }
    });

    return DisplayObjectContainer;

},{
   requires:[
     "canvax/core/Base",
     "canvax/display/DisplayObject"
   ]
})
;KISSY.add("canvax/display/Movieclip" , function(S , DisplayObjectContainer,Base){
  var Movieclip = function( opt ){

      var self = this;

      opt.context || (opt.context = {});

      self.type = "movieclip";
      self.currentFrame  = 0;
      self.autoPlay     = opt.autoPlay   || false;//是否自动播放
      self.repeat       = opt.repeat     || 0;//是否循环播放,repeat为数字，则表示循环多少次，为true or !运算结果为true 的话表示永久循环

      self.overPlay     = opt.overPlay   || false; //是否覆盖播放，为false只播放currentFrame 当前帧,true则会播放当前帧 和 当前帧之前的所有叠加

      self._frameRate    = Base.mainFrameRate;
      self._speedTime    = parseInt(1000/self._frameRate);
      self._preRenderTime= 0;

      self._context = {
          //r : opt.context.r || 0   //{number},  // 必须，圆半径
      }
      arguments.callee.superclass.constructor.apply(this, arguments);
  };

  Base.creatClass(Movieclip , DisplayObjectContainer , {
      init : function(){
         
      },
      getStatus    : function(){
          //查询Movieclip的autoPlay状态
          return this.autoPlay;
      },
      getFrameRate : function(){
          return this._frameRate;
      },
      setFrameRate : function(frameRate) {
          
          var self = this;
          if(self._frameRate  == frameRate) {
              return;
          }
          self._frameRate  = frameRate;

          //根据最新的帧率，来计算最新的间隔刷新时间
          self._speedTime = parseInt( 1000/self._frameRate );
      }, 
      afterAddChild:function(child , index){
         if(this.children.length==1){
            return;
         }

         if( index != undefined && index <= this.currentFrame ){
            //插入当前frame的前面 
            this.currentFrame++;
         }
      },
      afterDelChild:function(child,index){
         //记录下当前帧
         var preFrame = this.currentFrame;

         //如果干掉的是当前帧前面的帧，当前帧的索引就往上走一个
         if(index < this.currentFrame){
            this.currentFrame--;
         }

         //如果干掉了元素后当前帧已经超过了length
         if((this.currentFrame >= this.children.length) && this.children.length>0){
            this.currentFrame = this.children.length-1;
         };
      },
      _goto:function(i){
         var len = this.children.length;
         if(i>= len){
            i = i%len;
         }
         if(i<0){
            i = this.children.length-1-Math.abs(i)%len;
         }
         this.currentFrame = i;
      },
      gotoAndStop:function(i){
         this._goto(i);
         if(!this.autoPlay){
           //再stop的状态下面跳帧，就要告诉stage去发心跳
           this._preRenderTime = 0;
           this.getStage().heartBeat();
           return;
         }
         this.autoPlay = false;
      },
      stop:function(){
         if(!this.autoPlay){
           return;
         }
         this.autoPlay = false;
      },
      gotoAndPlay:function(i){
         this._goto(i);
         this.play();

         /*
         if(this.autoPlay){
           return;
         }
         this.autoPlay = true;
         var canvax = this.getStage().parent;
         if(!canvax._heartBeat && canvax._taskList.length==0){
             //手动启动引擎 
             //canvax.__enterFrame();
             canvax.__startEnter();
             //requestAnimationFrame( _.bind(canvax.__enterFrame,canvax) );
         }
 
         this._push2TaskList();

         //因为有goto设置好了currentFrame 所以这里不需要_next
         //this._next();
         this._preRenderTime = new Date().getTime();
         */

      },
      play:function(){
         if(this.autoPlay){
           return;
         }
         this.autoPlay = true;
         var canvax = this.getStage().parent;
         if(!canvax._heartBeat && canvax._taskList.length==0){
             //手动启动引擎
             //canvax.__enterFrame();
             canvax.__startEnter();
             //requestAnimationFrame( _.bind(canvax.__enterFrame,canvax) );
         }
         this._push2TaskList();
         
         this._preRenderTime = new Date().getTime();
         //this._next();
      },
      _push2TaskList : function(){
         //把enterFrame push 到 引擎的任务列表
         if(!this._enterInCanvax){
           this.getStage().parent._taskList.push( this );
           this._enterInCanvax=true;
         }
      },
      //autoPlay为true 而且已经把__enterFrame push 到了引擎的任务队列，
      //则为true
      _enterInCanvax:false, 
      __enterFrame:function(){
         var self = this;
         if((Base.now-self._preRenderTime) >= self._speedTime ){
             //大于_speedTime，才算完成了一帧
             
             //上报心跳 无条件心跳吧。
             //后续可以加上对应的 Movieclip 跳帧 心跳
             self.getStage().heartBeat();
         }

      },
      next  :function(){
         var self = this;
         if(!self.autoPlay){
             //只有再非播放状态下才有效
             self.gotoAndStop(self._next());
         }
      },
      pre   :function(){
         var self = this;
         if(!self.autoPlay){
             //只有再非播放状态下才有效
             self.gotoAndStop(self._pre());
         }
      },
      _next : function(){
         var self = this;
         if(this.currentFrame >= this.children.length-1){
             this.currentFrame = 0;
         } else {
             this.currentFrame++;
         }
         return this.currentFrame;
      },

      _pre : function(){
         var self = this;
         if(this.currentFrame == 0){
             this.currentFrame = this.children.length-1;
         } else {
             this.currentFrame--;
         }
         return this.currentFrame;
      },
      render:function(ctx){
          //这里也还要做次过滤，如果不到speedTime，就略过
          if( (Base.now-this._preRenderTime) < this._speedTime ){
             return;
          }

          //因为如果children为空的话，Movieclip 会把自己设置为 visible:false，不会执行到这个render
          //所以这里可以不用做children.length==0 的判断。 大胆的搞吧。

          if( !this.overPlay ){
              this.getChildAt(this.currentFrame)._render(ctx);
          } else {
              for(var i=0 ; i <= this.currentFrame ; i++){
                  this.getChildAt(i)._render(ctx);
              }
          }

          if(this.children.length == 1){
              this.autoPlay = false;
          }

          //console.log(this.currentFrame)
          
          //如果不循环
          if( this.currentFrame == this.getNumChildren()-1 ){
              //那么，到了最后一帧就停止
              if(!this.repeat) {
                  this.stop();
                  if( this.hasEvent("end") ){
                      this.fire("end");
                  }
              }

              //使用掉一次循环
              if( _.isNumber( this.repeat ) && this.repeat > 0 ) {
                 this.repeat -- ;
              }
          }

          if(this.autoPlay){
              //如果要播放
              if( (Base.now-this._preRenderTime) >= this._speedTime ){
                  //先把当前绘制的时间点记录
                  this._preRenderTime = Base.now;
                  this._next();
              }
              this._push2TaskList();
          } else {
              //暂停播放
              if(this._enterInCanvax){
                  //如果这个时候 已经 添加到了canvax的任务列表
                  this._enterInCanvax=false;
                  var tList = this.getStage().parent._taskList;
                  tList.splice( _.indexOf(tList , this) , 1 ); 
              }
          }

      } 
  });

  return Movieclip;

} , {
  requires:[
    "canvax/display/DisplayObjectContainer",
    "canvax/core/Base"
  ]
})
;KISSY.add("canvax/display/Point" , function(S){
   var Point = function(x,y){
       if(arguments.length==1 && typeof arguments[0] == 'object' ){
          var arg=arguments[0]
          if( "x" in arg && "y" in arg ){
             this.x = arg.x*1;
             this.y = arg.y*1;
          } else {
             var i=0;
             for (var p in arg){
                 if(i==0){
                   this.x = arg[p]*1;
                 } else {
                   this.y = arg[p]*1;
                   break;
                 }
                 i++;
             }
          }

          return;

       }


       x || (x=0);
       y || (y=0);
       this.x = x*1;
       this.y = y*1;
   };

   return Point;
},{requires:[
  
]})
;KISSY.add("canvax/display/Shape" , function( S , DisplayObject , vec2 , Base  ){

   var Shape = function(opt){
       
       var self = this;
       //元素是否有hover事件 和 chick事件，由addEvenetLister和remiveEventLister来触发修改
       self._hoverable = false;
       self._clickable = false;

       //over的时候如果有修改样式，就为true
       self._hoverClass = false;

       //拖拽drag的时候显示在activShape的副本
       self._dragDuplicate = null;

       //元素是否 开启 drag 拖动，这个有用户设置传入
       //self.draggable = opt.draggable || false;

       self.type = self.type || "shape" ;
       opt.draw && (self.draw=opt.draw);
       arguments.callee.superclass.constructor.apply(this , arguments);
       self._rect = null;
   };

   Base.creatClass(Shape , DisplayObject , {
      init : function(){
      },
      /*
       *下面两个方法为提供给 具体的 图形类覆盖实现，本shape类不提供具体实现
       *draw() 绘制   and   setRect()获取该类的矩形边界
      */
      draw:function(){
      
      },
      getRect:function(style){
          return style
      },
      setContextStyle : function(ctx, style) {
          // 简单判断不做严格类型检测
          for (p in style){
              if(p in ctx){
                if (style[p]) {
                  ctx[p] = style[p];
                }
              }
          }
          return;
      },
      drawEnd : function(ctx){
          if(this._hasFillAndStroke){
              //如果在子shape类里面已经实现stroke fill 等操作， 就不需要统一的d
              return;
          }


          //style 要从diaplayObject的 context上面去取
          var style = this.context;
        
          //fill stroke 之前， 就应该要closepath 否则线条转角口会有缺口。
          //drawTypeOnly 由继承shape的具体绘制类提供
          if ( this.drawTypeOnly != "stroke" ){
             ctx.closePath();
          }


          if ( style.strokeStyle || style.lineWidth ){
              ctx.stroke();
          }
          //比如贝塞尔曲线画的线,drawTypeOnly==stroke，是不能使用fill的，后果很严重
          if (style.fillStyle && this.drawTypeOnly!="stroke"){
              ctx.fill();
          }
          
      },


      render : function(){
         var self = this;
         var style = self.context;
         var context = self.getStage().context2D;

         if (style){
           self.setContextStyle( context ,style );
         }
         
         if (self.context.type == "shape"){
             //type == shape的时候，自定义绘画
             //这个时候就可以使用self.graphics绘图接口了，该接口模拟的是as3的接口
             self.draw.apply( self );
         } else {
             //这个时候，说明该shape是调用已经绘制好的 shape 模块，这些模块全部在../shape目录下面
             if(self.draw){
                 context.beginPath();
                 self.draw( context , style );
                 self.drawEnd(context);
             }        
         }
      }
      ,
      /*
       * 画虚线
       */
      dashedLineTo:function(ctx, x1, y1, x2, y2, dashLength) {
            dashLength = typeof dashLength == 'undefined'
                         ? 5 : dashLength;
            var deltaX = x2 - x1;
            var deltaY = y2 - y1;
            var numDashes = Math.floor(
                Math.sqrt(deltaX * deltaX + deltaY * deltaY) / dashLength
            );
            for (var i = 0; i < numDashes; ++i) {
                ctx[i % 2 === 0 ? 'moveTo' : 'lineTo'](
                    x1 + (deltaX / numDashes) * i,
                    y1 + (deltaY / numDashes) * i
                );
            }
      }
   });

   return Shape;

},{
  requires:[
    "canvax/display/DisplayObject",
    "canvax/geom/Vector",
    "canvax/core/Base"
  ]
})
;KISSY.add("canvax/display/Sprite" , function(S , DisplayObjectContainer,Base){
  var Sprite = function(){
      var self = this;
      self.type = "sprite";
      arguments.callee.superclass.constructor.apply(this, arguments);
  };

  Base.creatClass(Sprite , DisplayObjectContainer , {
      init : function(){
      
      }
  });

  return Sprite;

} , {
  requires:[
    "canvax/display/DisplayObjectContainer",
    "canvax/core/Base"
  ]
})
;KISSY.add("canvax/display/Stage" , function( S , DisplayObjectContainer , Base,StageEvent ){
  
   var Stage = function( opt ){

       var self = this;
    
       self.type = "stage";
       self.context2D = null;
       //stage正在渲染中
       self.stageRending=false;


       self._isReady = false;

       arguments.callee.superclass.constructor.apply(this, arguments);

   };


 
   Base.creatClass( Stage , DisplayObjectContainer , {
       init : function(){
       },
       //由canvax的afterAddChild 回调
       initStage : function( context2D , width , height ){
          var self = this;
          self.context2D = context2D;
          self.context.width  = width;
          self.context.height = height;
          self.context.scaleX = Base._devicePixelRatio;
          self.context.scaleY = Base._devicePixelRatio;

          self._isReady = true;

       },
       render : function(context){
           this.stageRending = true;
           if(!context) context = this.context2D;
           this.clear();
           var dragTarget = this.dragTarget;
           if( dragTarget ) {
               //handle drag target
               var p = dragTarget.globalToLocal(this.mouseX, this.mouseY);
               dragTarget.context.x = p.x;
               dragTarget.context.y = p.y;
           }
           Stage.superclass.render.call(this, context);

           this.stageRending = false;
           
       },
       heartBeat : function( opt ){
           //shape , name , value , preValue 
           //displayList中某个属性改变了
           var self = this;

           if (!self._isReady) {
              //在stage还没初始化完毕的情况下，无需做任何处理
              return;
           };

           opt || (opt = {}); //如果opt为空，说明就是无条件刷新
           opt.stage   = self;

           //TODO临时先这么处理
           self.parent && self.parent.heartBeat(opt);
       },
       clear : function(x, y, width, height) {
           if(arguments.length >= 4) {
               this.context2D.clearRect(x, y, width, height);
           } else {
               this.context2D.clearRect(0, 0, this.context2D.canvas.width, this.context2D.canvas.height);
           }
       }
       
   });

   return Stage;

},{
  requires:[
    "canvax/display/DisplayObjectContainer",
    "canvax/core/Base",
    "canvax/event/StageEvent"
  ]
});
;KISSY.add("canvax/display/Text" ,
    function(S , DisplayObject , Base) {
        var Text = function(text , opt) {
            var self = this;
            self.type = "text";
            self._reNewline = /\r?\n/;

            opt.context || (opt.context = {})
            self._context = {
                fontSize       : opt.context.fontSize       || 13 , //字体大小默认13
                fontWeight     : opt.context.fontWeight     || "normal",
                fontFamily     : opt.context.fontFamily     || "微软雅黑",
                textDecoration : opt.context.textDecoration || '',  
                fontStyle      : opt.context.fontStyle      || 'blank',
                lineHeight     : opt.context.lineHeight     || 1.3,
                //下面两个在displayObject中有
                //textAlign      : opt.context.textAlign      || 'left',
                //textBaseline   : opt.context.textBaseline   || 'top',
                textBackgroundColor:opt.context.textBackgroundColor|| ''

            };
            self.text  = text.toString();

            arguments.callee.superclass.constructor.apply(this, [opt]);
        }
        Base.creatClass(Text , DisplayObject , {
            init : function(text , opt){
               var self = this;
            },
            render : function( ctx ){
               var textLines = this.text.split(this._reNewline);

               this.context.width = this._getTextWidth(ctx, textLines);
               this.context.height = this._getTextHeight(ctx, textLines);

               this.clipTo && this.clipContext(this, ctx);

               this._renderTextBackground(ctx, textLines);
               this._renderText(ctx, textLines);

              
               this.clipTo && ctx.restore();
             
            },
            _renderText: function(ctx, textLines) {
                ctx.save();
                this._setShadow(ctx);
                this._renderTextFill(ctx, textLines);
                this._renderTextStroke(ctx, textLines);
                this._removeShadow(ctx);
                ctx.restore();
            },
            /**
             * @private
             * @param {CanvasRenderingContext2D} ctx Context to render on
             * @param {Array} textLines Array of all text lines
             */
            _renderTextFill: function(ctx, textLines) {
                if (!this.context.fillStyle ) return;

                this._boundaries = [ ];
                var lineHeights = 0;

                for (var i = 0, len = textLines.length; i < len; i++) {
                    var heightOfLine = this._getHeightOfLine(ctx, i, textLines);
                    lineHeights += heightOfLine;

                    this._renderTextLine(
                            'fillText',
                            ctx,
                            textLines[i],
                            this._getLeftOffset(),
                            this._getTopOffset() + lineHeights,
                            i
                            );
                }
            },

            /**
             * @private
             * @param {CanvasRenderingContext2D} ctx Context to render on
             * @param {Array} textLines Array of all text lines
             */
            _renderTextStroke: function(ctx, textLines) {
                if (!this.context.strokeStyle && !this._skipFillStrokeCheck) return;

                var lineHeights = 0;

                ctx.save();
                if (this.strokeDashArray) {
                    // Spec requires the concatenation of two copies the dash list when the number of elements is odd
                    if (1 & this.strokeDashArray.length) {
                        this.strokeDashArray.push.apply(this.strokeDashArray, this.strokeDashArray);
                    }
                    supportsLineDash && ctx.setLineDash(this.strokeDashArray);
                }

                ctx.beginPath();
                for (var i = 0, len = textLines.length; i < len; i++) {
                    var heightOfLine = this._getHeightOfLine(ctx, i, textLines);
                    lineHeights += heightOfLine;

                    this._renderTextLine(
                            'strokeText',
                            ctx,
                            textLines[i],
                            this._getLeftOffset(),
                            this._getTopOffset() + lineHeights,
                            i
                            );
                }
                ctx.closePath();
                ctx.restore();
            },
            _renderTextLine: function(method, ctx, line, left, top, lineIndex) {
                // lift the line by quarter of fontSize
                top -= this.context.fontSize / 4;

                // short-circuit
                if (this.context.textAlign !== 'justify') {
                    this._renderChars(method, ctx, line, left, top, lineIndex);
                    return;
                }

                var lineWidth = ctx.measureText(line).width;
                var totalWidth = this.context.width;

                if (totalWidth > lineWidth) {
                    // stretch the line
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
                }
                else {
                    this._renderChars(method, ctx, line, left, top, lineIndex);
                }
            },
            _renderChars: function(method, ctx, chars, left, top) {
                ctx[method](chars, left, top);
            },
            _setShadow: function(ctx) {
                if (!this.shadow) return;

                ctx.shadowColor = "red";
                ctx.shadowBlur = 1;
                ctx.shadowOffsetX = 1;
                ctx.shadowOffsetY = 1;
            },
            _removeShadow: function(ctx) {
                ctx.shadowColor = '';
                ctx.shadowBlur = ctx.shadowOffsetX = ctx.shadowOffsetY = 0;
            },

            _getHeightOfLine: function() {
                return this.context.fontSize * this.context.lineHeight;
            },
            _getTextWidth: function(ctx, textLines) {
                var maxWidth = ctx.measureText(textLines[0] || '|').width;

                for (var i = 1, len = textLines.length; i < len; i++) {
                    var currentLineWidth = ctx.measureText(textLines[i]).width;
                    if (currentLineWidth > maxWidth) {
                        maxWidth = currentLineWidth;
                    }
                }
                return maxWidth;
            },
            _getTextHeight: function(ctx, textLines) {
                return this.context.fontSize * textLines.length * this.context.lineHeight;
            },
            clipContext: function(receiver, ctx) {
                ctx.save();
                ctx.beginPath();
                receiver.clipTo(ctx);
                ctx.clip();
            },
            _renderTextBackground: function(ctx, textLines) {
                this._renderTextBoxBackground(ctx);
                this._renderTextLinesBackground(ctx, textLines);
            },
            _renderTextBoxBackground: function(ctx) {
                if (!this.context.backgroundColor) return;

                ctx.save();
                ctx.fillStyle = this.context.backgroundColor;

                ctx.fillRect(
                        this._getLeftOffset(),
                        this._getTopOffset(),
                        this.context.width,
                        this.context.height
                        );

                ctx.restore();
            },
            _getLeftOffset: function() {
                var l = 0;
                switch(this.context.textAlign){
                    case "left":
                         l = 0;
                         break; 
                    case "center":
                         l = -this.context.width / 2;
                         break;
                    case "right":
                         l = -this.context.width;
                         break;
                }
                return l;
            },

            /**
             * @private
             * @return {Number} Top offset
             */
            _getTopOffset: function() {
                var t = 0;
                switch(this.context.textBaseline){
                    case "top":
                         t = 0;
                         break; 
                    case "middle":
                         t = -this.context.height / 2;
                         break;
                    case "bottom":
                         t = -this.context.height;
                         break;
                }
                return t;

            },
            _renderTextLinesBackground: function(ctx, textLines) {
                if (!this.context.textBackgroundColor) return;

                ctx.save();
                ctx.fillStyle = this.context.textBackgroundColor;

                for (var i = 0, len = textLines.length; i < len; i++) {

                    if (textLines[i] !== '') {

                        var lineWidth = this._getLineWidth(ctx, textLines[i]);
                        var lineLeftOffset = this._getLineLeftOffset(lineWidth);

                        ctx.fillRect(
                                this._getLeftOffset() + lineLeftOffset,
                                this._getTopOffset() + (i * this.context.fontSize * this.context.lineHeight),
                                lineWidth,
                                this.context.fontSize * this.context.lineHeight
                                );
                    }
                }
                ctx.restore();
            },
            _getLineWidth: function(ctx, line) {
                return this.context.textAlign === 'justify'
                    ? this.context.width
                    : ctx.measureText(line).width;
            },
            _getLineLeftOffset: function(lineWidth) {
                if (this.context.textAlign === 'center') {
                    return (this.context.width - lineWidth) / 2;
                }
                if (this.context.textAlign === 'right') {
                    return this.context.width - lineWidth;
                }
                return 0;
            }

            
        });

        return Text;
    },
    {
        requires : [
         "canvax/display/DisplayObject",
         "canvax/core/Base"
        ]
    }
);
;KISSY.add("canvax/event/EventBase" , function(S,core){
    var EventBase = function(type, bubbles, cancelable) {
        this.type = type;
        this.target = null;
        this.currentTarget = null;	
        this.params = null;

        this.bubbles = bubbles != undefined ? bubbles : false; //TODO Not implemented yet.
        this.cancelable = cancelable != undefined ? cancelable : false;	//TODO Not implemented yet.
    }

    /**
     * @private Not implemented yet.
     */
    EventBase.prototype.stopPropagation = function() {
        //TODO
    }

    /**
     * @private Not implemented yet.
     */
    EventBase.prototype.preventDefault = function() {
        //TODO
    }

    /**
     * Duplicates an instance of the Event object.
     */
    EventBase.prototype.clone = function() {
        return Base.copy(this);
    }

    /**
     * Deletes all properties of the Event object.
     */
    EventBase.prototype.dispose = function() {
        delete this.type;
        delete this.target;
        delete this.currentTarget;
        delete this.params;
    }

    /**
     * Returns a string of the Event object.
     */
    EventBase.prototype.toString = function() {
        return "[EventBase type=" + this.type + "]";
    }


    return EventBase;


} , {
    requires : [
        "canvax/core/Base"
        ]
});
;KISSY.add("canvax/event/EventDispatcher" , function(S , Base ,EventManager){

  var EventDispatcher = function(){

      arguments.callee.superclass.constructor.call(this, name);

  };

  Base.creatClass(EventDispatcher , EventManager , {
         
      on : function(type, listener){
        this._addEventListener( type, listener);
      },
      addEventListener:function(type, listener){
        this._addEventListener( type, listener);
      },
      un : function(type,listener){
        this._removeEventListener( type, listener);
      },
      removeEventListener:function(type,listener){
        this._removeEventListener( type, listener);
      },
      removeEventListenerByType:function(type){
        this._removeEventListenerByType( type);
      },
      removeAllEventListeners:function(){
        this._removeAllEventListeners();
      },
      fire : function(event){
        if(_.isString(event)){
          //如果是str，比如mouseover
          event = {type : event};
        } else {
    
        }
        this.dispatchEvent(event);

      },
      dispatchEvent:function(event){
        if(event.type == "mouseover"){
           //记录dispatchEvent之前的心跳
           var preHeartBeat = this._heartBeatNum;
           this._dispatchEvent(event);
           if(preHeartBeat != this._heartBeatNum){
               this._hoverClass = true;
               var canvax = this.getStage().parent;
               //如果前后心跳不一致，说明有mouseover 属性的修改，也就是有hover态
               //那么该该心跳包肯定已经 巴shape添加到了canvax引擎的convertStages队列中
               //把该shape从convertStages中干掉，重新添加到专门渲染hover态shape的_hoverStage中
               if(_.values(canvax.convertStages[this.getStage().id].convertShapes).length > 1){
                   //如果还有其他元素也上报的心跳，那么该画的还是得画，不管了

               } else {
                   delete canvax.convertStages[this.getStage().id];
               }

               //然后clone一份obj，添加到_hoverStage 中
               var activShape = this.clone(true);
               activShape._transform = activShape.getConcatenatedMatrix();
               canvax._hoverStage.addChild(activShape);
           }
           return;
        }

        this._dispatchEvent(event);

        if(event.type == "mouseout"){
            if(this._hoverClass){
                //说明刚刚over的时候有添加样式
                var canvax = this.getStage().parent;
                this._hoverClass = false;
                canvax._hoverStage.removeChildById(this.id);
            }
        }

      },
      hasEvent:function(type){
        return this._hasEventListener(type);
      },
      hasEventListener:function(type){
        return this._hasEventListener(type);
      },
      hover : function( overFun , outFun ){
        this.on("mouseover" , overFun);
        this.on("mouseout"  , outFun );
      },
      once : function(type, listener){
        this.on(type , function(){
            listener.apply(this , arguments);
            this.un(type , arguments.callee);
        })
      }
  });

  return EventDispatcher;

},{
  requires:[
    "canvax/core/Base",
    "canvax/event/EventManager"
  ]
});
;KISSY.add("canvax/event/EventManager" , function(S){
    /**
     * 构造函数.
     * @name EventDispatcher
     * @class EventDispatcher类是可调度事件的类的基类，它允许显示列表上的任何对象都是一个事件目标。
     */
    var EventManager = function() {
        //事件映射表，格式为：{type1:[listener1, listener2], type2:[listener3, listener4]}
        this._eventMap = {};
    };

    EventManager.prototype = { 
        /*
         * 注册事件侦听器对象，以使侦听器能够接收事件通知。
         */
        _addEventListener : function(type, listener) {

            if(typeof listener != "function"){
              //listener必须是个function呐亲
              return false;
            }
           
            if(type == "mouseover"){
               this._hoverable = true;
            }
            if(type == "click"){
               this._clickable = true;
            }

            var map = this._eventMap[type];
            if(!map){
              map = this._eventMap[type] = [];
              map.push(listener);
              this._eventEnabled = true;
              return true;
            }

            if(_.indexOf(map ,listener) == -1) {
              map.push(listener);
              this._eventEnabled = true;
              return true;
            }

            //addEventError
            return false;
        },
        /**
         * 删除事件侦听器。
         */
        _removeEventListener : function(type, listener) {
            if(arguments.length == 1) return this.removeEventListenerByType(type);

            var map = this._eventMap[type];
            if(!map){
                return false;
            }

            for(var i = 0; i < map.length; i++) {
                var li = map[i];
                if(li === listener) {
                    map.splice(i, 1);
                    if(map.length == 0) { 
                        delete this._eventMap[type];
                        if(type == "mouseover"){
                            this._hoverable = false;
                        }
                        if(type == "click" ){
                            this._clickable = false;
                        }

                        //如果这个如果这个时候child没有任何事件侦听
                        if(_.isEmpty(this._eventMap)){
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
        _removeEventListenerByType : function(type) {
            var map = this._eventMap[type];
            if(!map) {
                delete this._eventMap[type];
                if(type=="mouseover"){
                  this._hoverable = false;
                }
                if(type=="click"){
                  this._clickable = false;
                }
                //如果这个如果这个时候child没有任何事件侦听
                if(_.isEmpty(this._eventMap)){
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
        _removeAllEventListeners : function() {	
            this._eventMap = {};
            this._hoverable = false;
            this._chickable = false;
            this._eventEnabled = false;
        },
        /**
        * 派发事件，调用事件侦听器。
        */
        _dispatchEvent : function(event) {
            var map = this._eventMap[event.type];
            if(!map){
                return false;
            }

            if(!event.target) event.target = this;
            map = map.slice();

            for(var i = 0; i < map.length; i++) {
                var listener = map[i];
                if(typeof(listener) == "function") {
                    listener.call(this, event);
                }
            }
            return true;
        },
        /**
           * 检查是否为指定事件类型注册了任何侦听器。
           */
        _hasEventListener : function(type) {
            var map = this._eventMap[type];
            return map != null && map.length > 0;
        }
    }

    return EventManager;


},{
    requires:[
        ]
});
;KISSY.add("canvax/event/StageEvent" , function(S,EventBase,Base){
    var StageEvent = function(type, bubbles, cancelable) {
        EventBase.call(this, type, bubbles, cancelable);

        this.mouseX = 0;
        this.mouseY = 0;
    }

    Base.creatClass(StageEvent , EventBase , {
        toString : function() {
        return "[StageEvent type=" + this.type + ", mouseX=" + this.mouseX + ", mouseY=" + this.mouseY + "]";
    }

    });

    //Stage event types
    StageEvent.ENTER_FRAME = "enterframe";
    StageEvent.MOUSE_DOWN = "mousedown";
    StageEvent.MOUSE_UP = "mouseup";
    StageEvent.MOUSE_MOVE = "mousemove";
    StageEvent.MOUSE_OVER = "mouseover";
    StageEvent.MOUSE_OUT = "mouseout";


    return StageEvent;

} , {
    requires : [
        "canvax/event/EventBase",
        "canvax/core/Base"
        ]
})


;KISSY.add("canvax/geom/Matrix" , function(S,Base){
  
    var Matrix = function(a, b, c, d, tx, ty){
        this.a = a != undefined ? a : 1;
        this.b = b != undefined ? b : 0;
        this.c = c != undefined ? c : 0;
        this.d = d != undefined ? d : 1;
        this.tx = tx != undefined ? tx : 0;
        this.ty = ty != undefined ? ty : 0;
    };

    Base.creatClass( Matrix , function(){} , {
        concat : function(mtx){
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
        concatTransform : function(x, y, scaleX, scaleY, rotation){
            var cos = 1;
            var sin = 0;
            if(rotation%360){
                var r = rotation * Math.PI / 180;
                cos = Math.cos(r);
                sin = Math.sin(r);
            }

            this.concat(new Matrix(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y));
            return this;
        },
        rotate : function(angle){
            //目前已经提供对顺时针逆时针两个方向旋转的支持
            var cos = Math.cos(angle);
            var sin = Math.sin(angle);

            var a = this.a;
            var c = this.c;
            var tx = this.tx;

            if (angle>0){
                this.a = a * cos - this.b * sin;
                this.b = a * sin + this.b * cos;
                this.c = c * cos - this.d * sin;
                this.d = c * sin + this.d * cos;
                this.tx = tx * cos - this.ty * sin;
                this.ty = tx * sin + this.ty * cos;
            } else {
                var st = Math.sin(Math.abs(angle));
                var ct = Math.cos(Math.abs(angle));

                this.a = a*ct + this.b*st;
                this.b = -a*st + this.b*ct;
                this.c = c*ct + this.d*st;
                this.d = -c*st + ct*this.d;
                this.tx = ct*tx + st*this.ty;
                this.ty = ct*this.ty - st*tx;
            }
            return this;


        },
        scale : function(sx, sy){
            this.a *= sx;
            this.d *= sy;
            this.tx *= sx;
            this.ty *= sy;
            return this;
        },
        translate : function(dx, dy){
            this.tx += dx;
            this.ty += dy;
            return this;
        },
        identity : function(){
            //初始化
            this.a = this.d = 1;
            this.b = this.c = this.tx = this.ty = 0;
            return this;
        },
        invert : function(){
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
        clone : function(){
            return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
        },
        toString : function(){
            return "(a="+this.a+", b="+this.b+", c="+this.c+", d="+this.d+", tx="+this.tx+", ty="+this.ty+")";
        },
        toArray : function(){
            return [ this.a , this.b , this.c , this.d , this.tx , this.ty ];
        },
        /**
         * 矩阵左乘向量
         */
        mulVector : function(out , v) {
            var aa = this.a, ac = this.c, atx = this.tx;
            var ab = this.b, ad = this.d, aty = this.ty;

            out[0] = v[0] * aa + v[1] * ac + atx;
            out[1] = v[0] * ab + v[1] * ad + aty;

            return out;
        }


    } );

    return Matrix;

},{
   requires:[
     "canvax/core/Base"
   ]
});
;KISSY.add("canvax/geom/Vector" , function(S,Base){
        var vector = {
            add : function(out, v1, v2) {
                out[0] = v1[0]+v2[0];
                out[1] = v1[1]+v2[1];
                return out;
            },
            sub : function(out, v1, v2) {
                out[0] = v1[0]-v2[0];
                out[1] = v1[1]-v2[1];
                return out;
            },
            length : function(v) {
                return Math.sqrt( this.lengthSquare(v) );
            },
            lengthSquare : function(v) {
                return v[0]*v[0]+v[1]*v[1];
            },
            mul : function(out, v1, v2) {
                out[0] = v1[0]*v2[0];
                out[1] = v1[1]*v2[1];
                return out;
            },
            dot : function(v1, v2) {
                return v1[0]*v2[0]+v1[1]*v2[1];
            },
            scale : function(out, v, s) {
                out[0] = v[0]*s;
                out[1] = v[1]*s;
                return out;
            },
            normalize : function(out, v) {
                var d = vector.length(v);
                if(d === 0){
                    out[0] = 0;
                    out[1] = 0;
                }else{
                    out[0] = v[0]/d;
                    out[1] = v[1]/d;
                }
                return out;
            },
            distance : function(v1, v2) {
                return Math.sqrt(
                    (v1[0] - v2[0]) * (v1[0] - v2[0]) +
                    (v1[1] - v2[1]) * (v1[1] - v2[1])
                );
            },
            negate : function(out, v) {
                out[0] = -v[0];
                out[1] = -v[1];
            },
            middle : function(out, v1, v2) {
                out[0] = (v1[0]+v2[0])/2;
                out[1] = (v1[1]+v2[1])/2;
                return out;
            }
        };

        return vector;
},{
   requires:[
     "canvax/core/Base"
   ]
});
;KISSY.add("canvax/index" ,
   function( S , DisplayObjectContainer , Stage , Base , StageEvent , propertyFactory , Sprite , Text , Shape , Movieclip , Bitmap , Point , Shapes , Animation , ImagesLoader ){
   var Canvax=function(opt){
       var self = this;
       self.type = "canvax";
       
       self.el = opt.el || null;

       //如果这个时候el里面已经有东西了。嗯，也许曾经这个el被canvax干过一次了。
       //那么要先清除这个el的所有内容。
       self.el.html("");

       self.mouseTarget = null;
       self.dragTarget = null;

       //每帧 由 心跳 上报的 需要重绘的stages 列表
       self.convertStages = {};

       self.rootOffset = {
          left:0,top:0
       };
       self.mouseX = 0;
       self.mouseY = 0;

       self._heartBeat = false;//心跳，默认为false，即false的时候引擎处于静默状态 true则启动渲染
       
       //设置帧率
       self._speedTime = parseInt(1000/Base.mainFrameRate);
       self._preRenderTime = 0;

       //任务列表, 如果_taskList 不为空，那么主引擎就一直跑
       //为 含有__enterFrame 方法 DisplayObject 的对象列表
       //比如Movieclip的__enterFrame方法。
       self._taskList = [];
       
       self._Event = null;

       self._hoverStage = null;
       
       //为整个项目提供像素检测的容器
       self._pixelCtx = null;

       self._isReady = false;

       /**
        *交互相关属性
        * */
       //接触canvas
       self._touching = false;
       //正在拖动，前提是_touching=true
       self._draging =false;

       //当前的鼠标状态
       self._cursor  = "default";
       
       arguments.callee.superclass.constructor.apply(this, arguments);
       
   };
   
   Base.creatClass(Canvax , DisplayObjectContainer , {
       init : function(){
          var self = this;

          self.context.width = self.el.width();
          self.context.height = self.el.height();

          //然后创建一个用于绘制激活shape的 stage到activation
          self._creatHoverStage();

          //初始化事件委托到root元素上面
          self._initEvent();

          //创建一个如果要用像素检测的时候的容器
          self.createPixelContext();
          
          self._isReady = true;
       },
       _creatHoverStage : function(){
          //TODO:创建stage的时候一定要传入width height  两个参数
          
          var self = this;
          self._hoverStage = new Stage( {
            id : "activCanvas"+(new Date()).getTime(),
            context : {
              width : self.context.width,
              height: self.context.height
            }
          } );
          self.addChild( self._hoverStage );
       },
       _initEvent : function(){
          //初始绑定事件，为后续的displayList的事件分发提供入口
          var self = this;
          self.rootOffset = self.el.offset();
          self._Event = new StageEvent();
          self.el.on("click" , function(e){
               self.__mouseHandler(e);
          });

          //delegate mouse events on the el
          self.el.on("mousedown" , function(e){
               self.__mouseHandler(e);
          });  
          self._moveStep = 0;
          self.el.on("mousemove" , function(e){
               if(self._moveStep<1){
                  self._moveStep++;
                  return;
               }
               self._moveStep = 0;
               self.__mouseHandler(e);
          });  
          self.el.on("mouseup" , function(e){
               self.__mouseHandler(e);
          });
          self.el.on("mouseout" , function(e){
               self.__mouseHandler(e);
          });
       },
       /**
        * 获取像素拾取专用的上下文
        * @return {Object} 上下文
       */
       createPixelContext : function() {
           
           var self = this;
           var _pixelCanvas = null;
           if(S.all("#_pixelCanvas").length==0){
              _pixelCanvas=Base._createCanvas("_pixelCanvas" , self.context.width , self.context.height); 
           } else {
              _pixelCanvas=S.all("#_pixelCanvas")[0];
           }
           
           document.body.appendChild( _pixelCanvas );

           Base.initElement( _pixelCanvas );

           _pixelCanvas.style.display = "none";

           Base._pixelCtx = _pixelCanvas.getContext('2d');

       },
       /*
        * 鼠标事件处理函数
        * */
       __mouseHandler : function(event) {
           var self = this;
           var mouseX = event.pageX - self.rootOffset.left;
           var mouseY = event.pageY - self.rootOffset.top;
           
           //stage拥有mouseX and mouseY
           self.mouseX = mouseX;
           self.mouseY = mouseY;

           if(event.type == "mousedown"){
              
              if(!self.mouseTarget){
                var obj = self.getObjectsUnderPoint(self.mouseX, self.mouseY, 1)[0];
                if(obj){
                  self.mouseTarget = obj;
                }
              }
              self.mouseTarget && self.dragEnabled && (self._touching = true);
           }

           if(event.type == "mouseup" || event.type == "mouseout"){
              if(self._draging == true){
                 //说明刚刚在拖动
                 self._dragEnd();
              }
              self._draging  = false;
              self._touching = false;
           }

           if(event.type=="mouseout"){
              self.__getMouseTarget(event);
           }
 
           if( event.type == "mousemove" || event.type == "mousedown" ){
               //拖动过程中就不在做其他的mouseover检测，drag优先
               if(self._touching && event.type == "mousemove" && self.mouseTarget){
                  //说明正在拖动啊
                  if(!self._draging){
                     //begin drag
                     self.mouseTarget.dragBegin && self.mouseTarget.dragBegin(event);
                     
                     //先把本尊给隐藏了
                     self.mouseTarget.context.visible = false;
                                          
                     //然后克隆一个副本到activeStage
                     self._clone2hoverStage();
                  } else {
                     //drag ing
                     self._dragIng();
                  }
                  self._draging = true;
                  return self;
               }
               //常规mousemove检测
               //move事件中，需要不停的搜索target，这个开销挺大，
               //后续可以优化，加上和帧率相当的延迟处理
               this.__getMouseTarget(event);

           } else {
               //其他的事件就直接在target上面派发事件
               if(this.mouseTarget){
                   //event
                   var e = _.extend(self._Event , event);
                   e.target = e.currentTarget = this.mouseTarget || this;
                   e.mouseX = this.mouseX;
                   e.mouseY = this.mouseY;

                   //dispatch event
                   this.mouseTarget.dispatchEvent(e);
               }
           }
           //disable text selection on the canvas, works like a charm.	
           try {
               event.preventDefault();
               event.stopPropagation();
           } catch(e){}
       },
       __getMouseTarget : function(event) {

           var oldObj = this.mouseTarget;
           if( event.type=="mousemove" && oldObj && oldObj.hitTestPoint( this.mouseX, this.mouseY ) ){
               //小优化,鼠标move的时候。计算频率太大，所以。做此优化
               //如果有target存在，而且当前鼠标还在target内,就没必要取检测整个displayList了
               return;
           }
           var obj = this.getObjectsUnderPoint(this.mouseX, this.mouseY, 1)[0];
           var e = _.extend(this._Event , event);

           e.target = e.currentTarget = obj;
           e.mouseX = this.mouseX;
           e.mouseY = this.mouseY;

           this._cursorHander( obj , oldObj );

           if(oldObj && oldObj != obj || e.type=="mouseout") {
               if(!oldObj){
                  return;
               }
               this.mouseTarget = null;
               e.type = "mouseout";
               e.target = e.currentTarget = oldObj;
               //之所以放在dispatchEvent(e)之前，是因为有可能用户的mouseout处理函数
               //会有修改visible的意愿
               if(!oldObj.context.visible){
                  oldObj.context.visible = true;
               }
               oldObj.dispatchEvent(e);
               //this.setCursor("default");
           };
           if(obj && oldObj != obj && obj._hoverable){
               this.mouseTarget = obj;
               e.type = "mouseover";
               e.target = e.currentTarget = obj;
               obj.dispatchEvent(e);
               //this.setCursor(obj.context.cursor);
           };

       },
       //克隆一个元素到hover stage中去
       _clone2hoverStage : function(){
           var self = this;
           var _dragDuplicate = self._hoverStage.getChildById(self.mouseTarget.id);
           if(!_dragDuplicate){
               _dragDuplicate = self.mouseTarget.clone(true);
               _dragDuplicate._transform = _dragDuplicate.getConcatenatedMatrix();
               self._hoverStage.addChild( _dragDuplicate );
           }
           _dragDuplicate.context = propertyFactory(self.mouseTarget.context.$model);
           _dragDuplicate.context.$owner = _dragDuplicate;
           _dragDuplicate.context.$watch = self.mouseTarget.context.$watch;
           _dragDuplicate.context.visible = true;

           _dragDuplicate._dragPoint = _dragDuplicate.globalToLocal(self.mouseX , self.mouseY)
       },
       //drag 中 的处理函数
       _dragIng  : function(){
           var self = this;
           var _dragDuplicate = self._hoverStage.getChildById(self.mouseTarget.id);
           _dragDuplicate.context.x = self.mouseX - _dragDuplicate._dragPoint.x; 
           _dragDuplicate.context.y = self.mouseY - _dragDuplicate._dragPoint.y;  
           self.mouseTarget.drag && self.mouseTarget.drag(event);
       },
       //drag结束的处理函数
       _dragEnd  : function(){
           var self = this;
           self.dragEnd && self.dragEnd(event);  
           //拖动停止， 那么要先把本尊给显示出来先
           //这里还可以做优化，因为拖动停止了但是还是在hover状态，没必要把本尊显示的。
           //self.mouseTarget.context.visible = true;

           //_dragDuplicate 复制在_hoverStage 中的副本
           var _dragDuplicate = self._hoverStage.getChildById(self.mouseTarget.id);
           self.mouseTarget.context = _dragDuplicate.context;
           self.mouseTarget.context.$owner = self.mouseTarget;
           //这个时候的target还是隐藏状态呢
           self.mouseTarget.context.visible = false;
           self.mouseTarget._updateTransform();
           if(event.type == "mouseout"){
               _dragDuplicate.destroy();
           }
       },
       _cursorHander    : function( obj , oldObj ){
           if(!obj && !oldObj ){
               this.setCursor("default");
           }
           if(obj && oldObj != obj){
               this.setCursor(obj.context.cursor);
           }
       },
       setCursor : function(cursor) {
           if(this._cursor == cursor){
             //如果两次要设置的鼠标状态是一样的
             return;
           }
           this.el.css("cursor" , cursor);
           this._cursor = cursor;
       },
       setFrameRate : function(frameRate) {
          if(Base.mainFrameRate == frameRate) {
              return;
          }
          Base.mainFrameRate = frameRate;

          //根据最新的帧率，来计算最新的间隔刷新时间
          this._speedTime = parseInt(1000/Base.mainFrameRate);
       },

       //如果引擎处于静默状态的话，就会启动
       __startEnter : function(){
          var self = this;
          if(!self.requestAid){
              //self.requestAid = requestAnimationFrame( _.bind( self.__enterFrame , self) );
              self.requestAid = requestAnimationFrame( function(){
                 self.__enterFrame();
              } );

          }
       },
       __enterFrame : function(){
           var self = this;

           //不管怎么样，__enterFrame执行了就要把
           //requestAid null 掉
           self.requestAid = null;
           Base.now = new Date().getTime();

           if(self._heartBeat){

               if((Base.now-self._preRenderTime) < self._speedTime ){
                   //事件speed不够，下一帧再来
                   self.__startEnter();
                   //self.requestAid = requestAnimationFrame( _.bind(self.__enterFrame,self) );
                   return;
               }

               _.each(_.values(self.convertStages) , function(convertStage){
                  convertStage.stage._render(convertStage.stage.context2D);
               });
           
               self._heartBeat = false;
               //debugger;
               self.convertStages = {};

               //渲染完了，打上最新时间挫
               self._preRenderTime = new Date().getTime();
           }
           
           //先跑任务队列,因为有可能再具体的hander中会把自己清除掉
           //所以跑任务和下面的length检测分开来
           if(self._taskList.length > 0){
              for(var i=0,l=self._taskList.length;i<l;i++){
                 var obj = self._taskList[i];
                 if(obj.__enterFrame){
                    obj.__enterFrame();
                 } else {
                    self.__taskList.splice(i-- , 1);
                 }
              }  
           }
           //如果依然还有任务。 就继续enterFrame.
           if(self._taskList.length > 0){
              self.__startEnter();
              //self.requestAid = requestAnimationFrame( _.bind(self.__enterFrame,self) );
           }
       },
       afterAddChild : function(stage){
           var canvas = Base._createCanvas( stage.id , this.context.width , this.context.height );
           if(this.children.length == 1){
               this.el.append( canvas );
           } else if(this.children.length>1) {
               this.el[0].insertBefore( canvas , this._hoverStage.context2D.canvas);
           };

           Base.initElement( canvas );

           stage.initStage( canvas.getContext("2d") , this.context.width , this.context.height ); 

       },
       afterDelChild : function(stage){
       
       },
       heartBeat : function( opt ){
           //displayList中某个属性改变了
           var self = this;
//console.log("heartBeat")
           //心跳包有两种，一种是某元素的可视属性改变了。一种是children有变动
           //分别对应convertType  为 context  and children
           if (opt.convertType == "context"){
               var stage   = opt.stage;
               var shape   = opt.shape;
               var name    = opt.name;
               var value   = opt.value;
               var preValue=opt.preValue;

               if (!self._isReady) {
                   //在还没初始化完毕的情况下，无需做任何处理
                   return;
               }

               if(!self.convertStages[stage.id]){
                   self.convertStages[stage.id]={
                       stage : stage,
                       convertShapes : {}
                   }
               };

               if(shape){
                   if (!self.convertStages[stage.id].convertShapes[shape.id]){
                       self.convertStages[stage.id].convertShapes[shape.id]={
                           shape : shape,
                           convertType : null,
                           convertLog  : []
                       }
                   }
                   var ss = self.convertStages[stage.id].convertShapes[shape.id];
                   ss.convertLog.push(name,value,preValue);
               }
           }

           if (opt.convertType == "children"){
               //元素结构变化，比如addchild removeChild等
               var target = opt.target;
               var stage = opt.src.getStage();
               if( stage || (target.type=="stage") ){
                   //如果操作的目标元素是Stage
                   stage = stage || target;
                   if(!self.convertStages[stage.id]) {
                       self.convertStages[stage.id]={
                           stage : stage ,
                           convertShapes : {}
                       }
                   }
               }
           }

           if(!opt.convertType){
               //无条件要求刷新
               var stage = opt.stage;
               if(!self.convertStages[stage.id]) {
                   self.convertStages[stage.id]={
                       stage : stage ,
                       convertShapes : {}
                   }
               }
           }

           if (!self._heartBeat){
              //如果发现引擎在静默状态，那么就唤醒引擎
              self._heartBeat = true;
              self.__startEnter();
              //self.requestAid = requestAnimationFrame( _.bind(self.__enterFrame,self) );
           } else {
              //否则智慧继续确认心跳
              self._heartBeat = true;
           }
                
       }
       
   } );

   Canvax.propertyFactory = propertyFactory;

   //给Canvax 添加静态对象，指向stage ,shape,text,sprite等类
   Canvax.Display ={
      Stage     : Stage,
      Sprite    : Sprite,
      Text      : Text,
      Shape     : Shape,
      Movieclip : Movieclip,
      Bitmap    : Bitmap,
      Point     : Point
   }
   //所有自定义shape的集合，可以直接再这个上面获取不必强制引入use('canvax/shape/Circle')这样
   Canvax.Shapes    = Shapes;

   Canvax.Utils     = {
       ImagesLoader : ImagesLoader
   };
   
   Canvax.Animation = Animation;

   return Canvax;
} , {
   requires : [
    "canvax/display/DisplayObjectContainer" ,
    "canvax/display/Stage", 
    "canvax/core/Base",
    "canvax/event/StageEvent",
    "canvax/core/propertyFactory",
    
    "canvax/display/Sprite",
    "canvax/display/Text",
    "canvax/display/Shape",
    "canvax/display/Movieclip",
    "canvax/display/Bitmap",
    "canvax/display/Point",

    "canvax/shape/Shapes", //所有自定义shape的集合

    "canvax/animation/Animation",
    "canvax/utils/ImagesLoader",
  
    //如果用户没有加载underscore，作为被选方案，自己加载一个进来
    !window._ ? "canvax/library/underscore" : ""

    //如果用户没有加载flashcavnas在ie下面，并且也没有加载excanvas，就默认加载自己准备的flashcanvas进来
    //( !document.createElement('canvas').getContext && !window.FlashCanvas && !window.G_vmlCanvasManager ) ? "canvax/library/flashCanvas/flashcanvas" : ""
    ]
});
;KISSY.add("canvax/shape/Beziercurve" , function(S,Shape,Base){
  var Beziercurve = function(opt){
      var self=this;
      self.type = "beziercurve";
      self.drawTypeOnly = "stroke";//线条只能描边，填充的画出了问题别怪我没提醒


      //在diaplayobject组织context的之前就要把 这个 shape 需要的 style 字段 提供出来
      //displayobject 会merge 到 context去
      opt.context || (opt.context = {});
      self._context = {
           xStart : opt.context.xStart  || 0 , //        : {number} 必须，起点横坐标
           yStart : opt.context.yStart  || 0 , //       : {number},   必须，起点纵坐标
           cpX1   : opt.context.cpX1    || 0 , //       : {number},  // 必须，第一个关联点横坐标
           cpY1   : opt.context.cpY1    || 0 , //      : {number},  // 必须，第一个关联点纵坐标
           cpX2   : opt.context.cpX2    || 0 , //第二个关联点横坐标  缺省即为二次贝塞尔曲线
           cpY2   : opt.context.cpY2    || 0 , //       : {number},  // 可选，第二个关联点纵坐标
           xEnd   : opt.context.xEnd    || 0 , //       : {number},  // 必须，终点横坐标
           yEnd   : opt.context.yEnd    || 0   //       : {number},  // 必须，终点纵坐标
      }

      
      arguments.callee.superclass.constructor.apply(this , arguments);
  };

  Base.creatClass(Beziercurve , Shape , {
    draw : function(ctx, style) {
        ctx.moveTo(style.xStart, style.yStart);
        if (typeof style.cpX2 != 'undefined' && typeof style.cpY2 != 'undefined') {
            ctx.bezierCurveTo(
                style.cpX1, style.cpY1,
                style.cpX2, style.cpY2,
                style.xEnd, style.yEnd
                );
        } else {
            ctx.quadraticCurveTo(
                style.cpX1, style.cpY1,
                style.xEnd, style.yEnd
                );
        }

    },
    getRect : function(style) {
        var _minX = Math.min(style.xStart, style.xEnd, style.cpX1);
        var _minY = Math.min(style.yStart, style.yEnd, style.cpY1);
        var _maxX = Math.max(style.xStart, style.xEnd, style.cpX1);
        var _maxY = Math.max(style.yStart, style.yEnd, style.cpY1);
        var _x2 = style.cpX2;
        var _y2 = style.cpY2;

        if (typeof _x2 != 'undefined'
                && typeof _y2 != 'undefined'
           ) {
               _minX = Math.min(_minX, _x2);
               _minY = Math.min(_minY, _y2);
               _maxX = Math.max(_maxX, _x2);
               _maxY = Math.max(_maxY, _y2);
           }

        var lineWidth = style.lineWidth || 1;
        return {
              x : _minX - lineWidth,
              y : _minY - lineWidth,
              width : _maxX - _minX + lineWidth,
              height : _maxY - _minY + lineWidth
        };
    }
  });

  return Beziercurve;


} , {
  requires : [
    "canvax/display/Shape",
    "canvax/core/Base"
  ]
});
;KISSY.add("canvax/shape/BrokenLine" , function(S , Shape , Polygon , Base){
   var BrokenLine = function(opt){
       var self = this;
       self.type = "brokenLine";
       self.drawTypeOnly = "stroke";

       opt.context || (opt.context={})
       self._context = {
           pointList  : opt.context.pointList || [] //{Array}  // 必须，各个顶角坐标
       }
       
       
       arguments.callee.superclass.constructor.apply(this, arguments);
   }

   Base.creatClass(BrokenLine , Shape , {
       draw : function(ctx, style) {
           var pointList = style.pointList.$model;
           if (pointList.length < 2) {
               // 少于2个点就不画了~
               return;
           }
           if (!style.lineType || style.lineType == 'solid') {
               //默认为实线
               ctx.moveTo(pointList[0][0],pointList[0][1]);
               for (var i = 1, l = pointList.length; i < l; i++) {
                   ctx.lineTo(pointList[i][0],pointList[i][1]);
               }
           } else if (style.lineType == 'dashed' || style.lineType == 'dotted') {
               //画虚线的方法  by loutongbing@baidu.com
               var lineWidth = style.lineWidth || 1;
               var dashPattern = [ lineWidth * (style.lineType == 'dashed' ? 6 : 1), lineWidth * 4 ];
               ctx.moveTo(pointList[0][0],pointList[0][1]);
               for (var i = 1, l = pointList.length; i < l; i++) {
                   var fromX = pointList[i - 1][0];
                   var toX = pointList[i][0];
                   var fromY = pointList[i - 1][1];
                   var toY = pointList[i][1];
                   var dx = toX - fromX;
                   var dy = toY - fromY;
                   var angle = Math.atan2(dy, dx);
                   var x = fromX;
                   var y = fromY;
                   var idx = 0;
                   var draw = true;
                   var dashLength;
                   var nx;
                   var ny;

                   while (!((dx < 0 ? x <= toX : x >= toX) && (dy < 0 ? y <= toY : y >= toY))) {
                       dashLength = dashPattern[
                           idx++ % dashPattern.length
                           ];
                       nx = x + (Math.cos(angle) * dashLength);
                       x = dx < 0 ? Math.max(toX, nx) : Math.min(toX, nx);
                       ny = y + (Math.sin(angle) * dashLength);
                       y = dy < 0 ? Math.max(toY, ny) : Math.min(toY, ny);
                       if (draw) {
                           ctx.lineTo(x, y);
                       } else {
                           ctx.moveTo(x, y);
                       }
                       draw = !draw;
                   }
               }
           }


           return;
       },
       getRect :  function(style) {
           return Polygon.prototype.getRect(style);
       }


   
   });

   return BrokenLine;

} , {
   requires:[
     "canvax/display/Shape",
     "canvax/shape/Polygon",
     "canvax/core/Base"
   ]
});
;KISSY.add("canvax/shape/Circle" ,
    function(S , Shape , Base) {
        var Circle = function(opt) {
            var self = this;
            self.type = "circle";

            opt.context || (opt.context = {})
            self._context = {
                //x : 0 , // {number},  // 丢弃
                //y : 0 , //{number},  // 丢弃，圆心xy坐标 都 为原点
                r : opt.context.r || 0   //{number},  // 必须，圆半径
            }


            arguments.callee.superclass.constructor.apply(this, arguments);
        }

        Base.creatClass(Circle , Shape , {
           /**
             * 创建圆形路径
             * @param {Context2D} ctx Canvas 2D上下文
             * @param {Object} style 样式
             */
            draw : function(ctx, style) {
                if (!style) {
                  return;
                }
                //ctx.arc(this.get("x"), this.get("y"), style.r, 0, Math.PI * 2, true);
                ctx.arc(0 , 0, style.r, 0, Math.PI * 2, true);
            },

            /**
             * 返回矩形区域，用于局部刷新和文字定位
             * @param {Object} style
             */
            getRect : function(style) {
                var lineWidth;
                if (style.fillStyle || style.strokeStyle ) {
                    lineWidth = style.lineWidth || 1;
                } else {
                    lineWidth = 0;
                }
                return {
                    x : Math.round(0 - style.r - lineWidth / 2),
                    y : Math.round(0 - style.r - lineWidth / 2),
                    width : style.r * 2 + lineWidth,
                    height : style.r * 2 + lineWidth
                };
            }

        });

        return Circle;
    },
    {
        requires : [
         "canvax/display/Shape",
         "canvax/core/Base"
        ]
    }
);
;KISSY.add("canvax/shape/Droplet" , function(S,Shape,Base){

  var Droplet = function(opt){
      var self = this;
      self.type = "droplet";

      opt.context || (opt.context={});
      self._context = {
          hr : opt.context.hr || 0 , //{number},  // 必须，水滴横宽（中心到水平边缘最宽处距离）
          vr : opt.context.vr || 0   //{number},  // 必须，水滴纵高（中心到尖端距离）
      }


      arguments.callee.superclass.constructor.apply(this, arguments);
  };

  Base.creatClass( Droplet , Shape , {
      draw : function(ctx, style) {

          ctx.moveTo( 0 , style.hr);
          ctx.bezierCurveTo(
              style.hr,
              style.hr,
              style.hr * 3 / 2,
              - style.hr / 3,
              0,
              - style.vr
              );
          ctx.bezierCurveTo(
              - style.hr * 3 / 2,
              - style.hr / 3,
              - style.hr,
              style.hr,
              0,
              style.hr
              );
          return;
      },
      getRect : function(style){
          var lineWidth;
          if (style.fillStyle || style.strokeStyle) {
              lineWidth = style.lineWidth || 1;
          } else {
              lineWidth = 0;
          }
          return {
                x : Math.round(0 - style.hr - lineWidth / 2),
                y : Math.round(0 - style.vr - lineWidth / 2),
                width : style.hr * 2 + lineWidth,
                height : style.hr + style.vr + lineWidth
          };

      }

  } );

  return Droplet;

},{
  requires:[
    "canvax/display/Shape",
    "canvax/core/Base"
  ]
});
;KISSY.add("canvax/shape/Ellipse" , function(S,Shape,Base){

   var Ellipse = function(opt){
       var self = this;
       self.type = "ellipse";

       opt.context || (opt.context={})
       self._context = {
           //x             : 0 , //{number},  // 丢弃
           //y             : 0 , //{number},  // 丢弃，原因同circle
           hr : opt.context.hr || 0 , //{number},  // 必须，椭圆横轴半径
           vr : opt.context.vr || 0   //{number},  // 必须，椭圆纵轴半径
       }

       arguments.callee.superclass.constructor.apply(this, arguments);
   };

   Base.creatClass(Ellipse , Shape , {
       draw :  function(ctx, style) {
           var r = (style.hr > style.vr) ? style.hr : style.vr;
           var ratioX = style.hr / r; //横轴缩放比率
           var ratioY = style.vr / r;
           
           ctx.scale(ratioX, ratioY);
           ctx.arc(
               0, 0, r, 0, Math.PI * 2, true
               );
           if ( document.createElement('canvas').getContext ){
              //ie下面要想绘制个椭圆出来，就不能执行这步了
              //算是excanvas 实现上面的一个bug吧
              ctx.scale(1/ratioX, 1/ratioY);

           }
           return;
       },
       getRect : function(style){
           var lineWidth;
           if (style.fillStyle || style.strokeStyle) {
               lineWidth = style.lineWidth || 1;
           }
           else {
               lineWidth = 0;
           }
           return {
                 x : Math.round(0 - style.hr - lineWidth / 2),
                 y : Math.round(0 - style.vr - lineWidth / 2),
                 width : style.hr * 2 + lineWidth,
                 height : style.vr * 2 + lineWidth
           };

       }
   });

   return Ellipse;

} , {
   requires : [
      "canvax/display/Shape",
      "canvax/core/Base"
   ]
});
;KISSY.add("canvax/shape/Heart" , function(S , Shape , Base){

   var Heart = function(opt){
       var self = this;
       this.type = "heart";
       opt.context || (opt.context = {});
       self._context = {
           //x             : 0,//{number},  // 必须，心形内部尖端横坐标
           //y             : 0,//{number},  // 必须，心形内部尖端纵坐标
           hr : opt.context.hr || 0,//{number},  // 必须，心形横宽（中轴线到水平边缘最宽处距离）
           vr : opt.context.vr || 0 //{number},  // 必须，心形纵高（内尖到外尖距离）
       }
       arguments.callee.superclass.constructor.apply(this , arguments);

   };



   Base.creatClass(Heart , Shape , {
       draw : function(ctx, style) {
           ctx.moveTo(0,0 );
           ctx.bezierCurveTo(
               style.hr / 2,
               - style.vr * 2 / 3,
               style.hr * 2,
               style.vr / 3,
               0,
               style.vr
               );
           ctx.bezierCurveTo(
               - style.hr *  2,
               style.vr / 3,
               - style.hr / 2,
               - style.vr * 2 / 3,
               0,
               0
               );
           return;
       },
       getRect : function(style){
           var lineWidth;
           if (style.fillStyle || style.strokeStyle ) {
               lineWidth = style.lineWidth || 1;
           } else {
               lineWidth = 0;
           }
           return {
                 x : Math.round(0 - style.hr - lineWidth / 2),
                 y : Math.round(0 - style.vr / 4 - lineWidth / 2),
                 width : style.hr * 2 + lineWidth,
                 height : style.vr * 5 / 4 + lineWidth
           };

       }
   });

   return Heart;


} , {
   requires : [
     "canvax/display/Shape",
     "canvax/core/Base"
   ]
})
;KISSY.add("canvax/shape/Isogon" , function(S , Shape , math , Base){

  var Isogon = function(opt){
      var self = this;
      this.type = "isogon";

      opt.context || (opt.context={});
      self._context = {
           pointList : [],//从下面的r和n计算得到的边界值的集合
           //x             : 0,//{number},  // 必须，正n边形外接圆心横坐标
           //y             : 0,//{number},  // 必须，正n边形外接圆心纵坐标
           r :opt.context.r  || 0,//{number},  // 必须，正n边形外接圆半径
           n :opt.context.n  || 0 //{number},  // 必须，指明正几边形
      }

      arguments.callee.superclass.constructor.apply(this, arguments);
  };


  var sin = math.sin;
  var cos = math.cos;
  var PI = Math.PI;

  Base.creatClass(Isogon , Shape , {
      /**
       * 创建n角星（n>=3）路径
       * @param {Context2D} ctx Canvas 2D上下文
       * @param {Object} style 样式
       */
      draw : function(ctx, style) {
          var n = style.n;
          if (!n || n < 2) { return; }

          var x = 0;
          var y = 0;
          var r = style.r;

          var dStep = 2 * PI / n;
          var deg = -PI / 2;
          var xStart = x + r * cos(deg);
          var yStart = y + r * sin(deg);
          deg += dStep;

          // 记录边界点，用于判断insight
          var pointList = style.pointList = [];
          pointList.push([xStart, yStart]);
          for (var i = 0, end = n - 1; i < end; i ++) {
              pointList.push([x + r * cos(deg), y + r * sin(deg)]);
              deg += dStep;
          }
          pointList.push([xStart, yStart]);

          // 绘制
          ctx.moveTo(pointList[0][0], pointList[0][1]);
          for (var i = 0; i < pointList.length; i ++) {
              ctx.lineTo(pointList[i][0], pointList[i][1]);
          }

          return;
      },

      /**
       * 返回矩形区域，用于局部刷新和文字定位
       * @param {Object} style
       */
      getRect : function(style) {
          var lineWidth;
          if (style.strokeStyle || style.fillStyle) {
              lineWidth = style.lineWidth || 1;
          }
          else {
              lineWidth = 0;
          }
          return {
              x : Math.round(0 - style.r - lineWidth / 2),
              y : Math.round(0 - style.r - lineWidth / 2),
              width : style.r * 2 + lineWidth,
              height : style.r * 2 + lineWidth
          };
      }

  });

  return Isogon;


}, {
  requires : [
    "canvax/display/Shape",
    "canvax/utils/Math",
    "canvax/core/Base"
  ] 
});
;KISSY.add("canvax/shape/Line" , function(S,Shape,Base){
  var Line = function(opt){
      var self = this;
      this.type = "line";
      this.drawTypeOnly = "stroke";
      opt.context || (opt.context={})
      self._context = {
           lineType      : opt.context.lineType || null, //可选 虚线 实现 的 类型
           xStart        : opt.context.xStart || 0 ,//{number},  // 必须，起点横坐标
           yStart        : opt.context.yStart || 0 ,//{number},  // 必须，起点纵坐标
           xEnd          : opt.context.xEnd   || 0 ,//{number},  // 必须，终点横坐标
           yEnd          : opt.context.yEnd   || 0 //{number},  // 必须，终点纵坐标
      }
      arguments.callee.superclass.constructor.apply(this, arguments);
  };

  
  Base.creatClass( Line , Shape , {
      /**
       * 创建线条路径
       * @param {Context2D} ctx Canvas 2D上下文
       * @param {Object} style 样式
       */
      draw : function(ctx, style) {
          if (!style.lineType || style.lineType == 'solid') {
              //默认为实线
              ctx.moveTo(style.xStart, style.yStart);
              ctx.lineTo(style.xEnd, style.yEnd);
          } else if (style.lineType == 'dashed' || style.lineType == 'dotted') {
              var dashLength =(style.lineWidth || 1) * (style.lineType == 'dashed' ? 5 : 1);
              this.dashedLineTo(
                  ctx,
                  style.xStart, style.yStart,
                  style.xEnd, style.yEnd,
                  dashLength
              );
          }
      },

      /**
       * 返回矩形区域，用于局部刷新和文字定位
       * @param {Object} style
       */
      getRect:function(style) {
          var lineWidth = style.lineWidth || 1;
          return {
              x : Math.min(style.xStart, style.xEnd) - lineWidth,
                y : Math.min(style.yStart, style.yEnd) - lineWidth,
                width : Math.abs(style.xStart - style.xEnd)
                    + lineWidth,
                height : Math.abs(style.yStart - style.yEnd)
                    + lineWidth
          };
      }

  } );

  return Line;


} , {
  requires : [
    "canvax/display/Shape",
    "canvax/core/Base"
  ]
});
;KISSY.add("canvax/shape/Path" , function( S , Shape , Base){

   var Path=function(opt){
       var self = this;
       self.type = "path";

       opt.context || (opt.context={});
       self._context = {
           $pointList : [], //从下面的path中计算得到的边界点的集合
           path : opt.context.path || ""  //字符串 必须，路径。例如:M 0 0 L 0 10 L 10 10 Z (一个三角形)
                                    //M = moveto
                                    //L = lineto
                                    //H = horizontal lineto
                                    //V = vertical lineto
                                    //C = curveto
                                    //S = smooth curveto
                                    //Q = quadratic Belzier curve
                                    //T = smooth quadratic Belzier curveto
                                    //Z = closepath
       }
       arguments.callee.superclass.constructor.apply(this , arguments);
   };
 
   Base.creatClass( Path , Shape , {
        _parsePathData : function(data) {
            if (!data) {
                return [];
            }

           
            // command string
            var cs = data;

            // command chars
            var cc = [
                'm', 'M', 'l', 'L', 'v', 'V', 'h', 'H', 'z', 'Z',
                'c', 'C', 'q', 'Q', 't', 'T', 's', 'S', 'a', 'A'
            ];
            cs = cs.replace(/  /g, ' ');
            cs = cs.replace(/ /g, ',');
            //cs = cs.replace(/(.)-/g, "$1,-");
            cs = cs.replace(/(\d)-/g,'$1,-');
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
                        points.push(
                            cpx + p.shift(), cpy + p.shift(),
                            cpx + p.shift(), cpy + p.shift()
                        );
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
                        points.push(
                            ctlPtx, ctlPty,
                            cpx + p.shift(), cpy + p.shift()
                        );
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
                        rx = p.shift();
                        ry = p.shift();
                        psi = p.shift();
                        fa = p.shift();
                        fs = p.shift();

                        x1 = cpx, y1 = cpy;
                        cpx = p.shift(), cpy = p.shift();
                        cmd = 'A';
                        points = this._convertPoint(
                            x1, y1, cpx, cpy, fa, fs, rx, ry, psi
                        );
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
                        points = this._convertPoint(
                            x1, y1, cpx, cpy, fa, fs, rx, ry, psi
                        );
                        break;

                    }

                    ca.push({
                        command : cmd || c,
                        points : points
                    });
                }

                if (c === 'z' || c === 'Z') {
                    ca.push({
                        command : 'z',
                        points : []
                    });
                }
            }

            return ca;

        },

        _convertPoint : function(x1, y1, x2, y2, fa, fs, rx, ry, psiDeg) {
            var psi = psiDeg * (Math.PI / 180.0);
            var xp = Math.cos(psi) * (x1 - x2) / 2.0
                     + Math.sin(psi) * (y1 - y2) / 2.0;
            var yp = -1 * Math.sin(psi) * (x1 - x2) / 2.0
                     + Math.cos(psi) * (y1 - y2) / 2.0;

            var lambda = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);

            if (lambda > 1) {
                rx *= Math.sqrt(lambda);
                ry *= Math.sqrt(lambda);
            }

            var f = Math.sqrt((((rx * rx) * (ry * ry))
                    - ((rx * rx) * (yp * yp))
                    - ((ry * ry) * (xp * xp))) / ((rx * rx) * (yp * yp)
                    + (ry * ry) * (xp * xp))
                );

            if (fa === fs) {
                f *= -1;
            }
            if (isNaN(f)) {
                f = 0;
            }

            var cxp = f * rx * yp / ry;
            var cyp = f * -ry * xp / rx;

            var cx = (x1 + x2) / 2.0
                     + Math.cos(psi) * cxp
                     - Math.sin(psi) * cyp;
            var cy = (y1 + y2) / 2.0
                    + Math.sin(psi) * cxp
                    + Math.cos(psi) * cyp;

            var vMag = function(v) {
                return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
            };
            var vRatio = function(u, v) {
                return (u[0] * v[0] + u[1] * v[1]) / (vMag(u) * vMag(v));
            };
            var vAngle = function(u, v) {
                return (u[0] * v[1] < u[1] * v[0] ? -1 : 1)
                        * Math.acos(vRatio(u, v));
            };
            var theta = vAngle([ 1, 0 ], [ (xp - cxp) / rx, (yp - cyp) / ry ]);
            var u = [ (xp - cxp) / rx, (yp - cyp) / ry ];
            var v = [ (-1 * xp - cxp) / rx, (-1 * yp - cyp) / ry ];
            var dTheta = vAngle(u, v);

            if (vRatio(u, v) <= -1) {
                dTheta = Math.PI;
            }
            if (vRatio(u, v) >= 1) {
                dTheta = 0;
            }
            if (fs === 0 && dTheta > 0) {
                dTheta = dTheta - 2 * Math.PI;
            }
            if (fs === 1 && dTheta < 0) {
                dTheta = dTheta + 2 * Math.PI;
            }
            return [ cx, cy, rx, ry, theta, dTheta, psi, fs ];
        },

        /**
         * 创建路径
         * @param {Context2D} ctx Canvas 2D上下文
         * @param {Object} style 样式
         */
        draw : function(ctx, style) {
            var path = style.path;

            var pathArray = this._parsePathData(path);

            // 平移坐标
            var x =  0;
            var y =  0;

            var p;
            // 记录边界点，用于判断inside
            var $pointList = style.$pointList = [];
            var singlePointList = [];
            for (var i = 0, l = pathArray.length; i < l; i++) {
                if (pathArray[i].command.toUpperCase() == 'M') {
                    singlePointList.length > 0 
                    && $pointList.push(singlePointList);
                    singlePointList = [];
                }
                p = pathArray[i].points;
                for (var j = 0, k = p.length; j < k; j += 2) {
                    singlePointList.push([p[j] + x, p[j+1] + y]);
                }
            }
            singlePointList.length > 0 && $pointList.push(singlePointList);
            
            var c;
            for (var i = 0, l = pathArray.length; i < l; i++) {
                c = pathArray[i].command;
                p = pathArray[i].points;
                // 平移变换
                for (var j = 0, k = p.length; j < k; j++) {
                    if (j % 2 === 0) {
                        p[j] += x;
                    } else {
                        p[j] += y;
                    }
                }
                switch (c) {
                    case 'L':
                        ctx.lineTo(p[0], p[1]);
                        break;
                    case 'M':
                        ctx.moveTo(p[0], p[1]);
                        break;
                    case 'C':
                        ctx.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
                        break;
                    case 'Q':
                        ctx.quadraticCurveTo(p[0], p[1], p[2], p[3]);
                        break;
                    case 'A':
                        var cx = p[0];
                        var cy = p[1];
                        var rx = p[2];
                        var ry = p[3];
                        var theta = p[4];
                        var dTheta = p[5];
                        var psi = p[6];
                        var fs = p[7];
                        var r = (rx > ry) ? rx : ry;
                        var scaleX = (rx > ry) ? 1 : rx / ry;
                        var scaleY = (rx > ry) ? ry / rx : 1;

                        ctx.translate(cx, cy);
                        ctx.rotate(psi);
                        ctx.scale(scaleX, scaleY);
                        ctx.arc(0, 0, r, theta, theta + dTheta, 1 - fs);
                        ctx.scale(1 / scaleX, 1 / scaleY);
                        ctx.rotate(-psi);
                        ctx.translate(-cx, -cy);
                        break;
                    case 'z':
                        ctx.closePath();
                        break;
                }
            }

            return;
        },

        /**
         * 返回矩形区域，用于局部刷新和文字定位
         * @param {Object} style 样式
         */
        getRect : function(style) {
            var lineWidth;
            if (style.strokeStyle || style.fillStyle) {
                lineWidth = style.lineWidth || 1;
            }
            else {
                lineWidth = 0;
            }

            var minX = Number.MAX_VALUE;
            var maxX = Number.MIN_VALUE;

            var minY = Number.MAX_VALUE;
            var maxY = Number.MIN_VALUE;

            // 平移坐标
            var x = 0;
            var y = 0;

            var pathArray = this._parsePathData(style.path);
            for (var i = 0; i < pathArray.length; i++) {
                var p = pathArray[i].points;

                for (var j = 0; j < p.length; j++) {
                    if (j % 2 === 0) {
                        if (p[j] + x < minX) {
                            minX = p[j] + x;
                        }
                        if (p[j] + x > maxX) {
                            maxX = p[j] + x;
                        }
                    } else {
                        if (p[j] + y < minY) {
                            minY = p[j] + y;
                        }
                        if (p[j] + y > maxY) {
                            maxY = p[j] + y;
                        }
                    }
                }
            }

            var rect;
            if (minX === Number.MAX_VALUE
                || maxX === Number.MIN_VALUE
                || minY === Number.MAX_VALUE
                || maxY === Number.MIN_VALUE
            ) {
                rect = {
                    x : 0,
                    y : 0,
                    width : 0,
                    height : 0
                };
            }
            else {
                rect = {
                    x : Math.round(minX - lineWidth / 2),
                    y : Math.round(minY - lineWidth / 2),
                    width : maxX - minX + lineWidth,
                    height : maxY - minY + lineWidth
                };
            }
            return rect;
        }
     
   } );

   return Path;

} , {
   requires : [
     "canvax/display/Shape",
     "canvax/core/Base"
   ]
});
;KISSY.add("canvax/shape/Polygon" , function(S , Shape , Base){

   var Polygon=function(opt){
       var self = this;
       self.type = "polygon";
       self._hasFillAndStroke = true;
       opt.context || (opt.context = {});
       self._context = {
           lineType      : opt.context.lineType  || null,
           pointList     : opt.context.pointList || []  //{Array},   // 必须，多边形各个顶角坐标
       }
       arguments.callee.superclass.constructor.apply(this, arguments);

   };

  
   Base.creatClass( Polygon , Shape , {
       draw : function(ctx, style) {
           ctx.save();
           ctx.beginPath();
           this.buildPath(ctx, style);
           ctx.closePath();

           if ( style.strokeStyle || style.lineWidth ) {
               ctx.stroke();
           }

           if (style.fillStyle) {
               if (style.lineType == 'dashed' || style.lineType == 'dotted') {
                      // 特殊处理，虚线围不成path，实线再build一次
                      ctx.beginPath();
                      this.buildPath(
                          ctx, 
                          {
                           lineType:  "solid",
                           lineWidth: style.lineWidth,
                           pointList: style.pointList
                          }
                          );
                      ctx.closePath();
                  }
               ctx.fill();
           }

           ctx.restore();

           return true;
    
       },
       buildPath : function(ctx, style) {
           var pointList = style.pointList.$model;
           // 开始点和结束点重复
           var start = pointList[0];
           var end = pointList[pointList.length-1];
           if (start && end) {
               if (start[0] == end[0] &&
                   start[1] == end[1]) {
                       // 移除最后一个点
                       pointList.pop();
                   }
           }
           if (pointList.length < 2) {
               return;
           }
        
           if (!style.lineType || style.lineType == 'solid') {
               //默认为实线
               ctx.moveTo(pointList[0][0],pointList[0][1]);
               for (var i = 1, l = pointList.length; i < l; i++) {
                   ctx.lineTo(pointList[i][0],pointList[i][1]);
               }
               ctx.lineTo(pointList[0][0], pointList[0][1]);
           } else if (style.lineType == 'dashed' || style.lineType == 'dotted') {
               var dashLength= (style.lineWidth || 1)*(style.lineType == 'dashed'? 5 : 1 );
               ctx.moveTo(pointList[0][0],pointList[0][1]);
               for (var i = 1, l = pointList.length; i < l; i++) {
                   this.dashedLineTo(
                           ctx,
                           pointList[i - 1][0], pointList[i - 1][1],
                           pointList[i][0], pointList[i][1],
                           dashLength
                           );
               }
               this.dashedLineTo(
                       ctx,
                       pointList[pointList.length - 1][0], 
                       pointList[pointList.length - 1][1],
                       pointList[0][0],
                       pointList[0][1],
                       dashLength
                       );
           }
           
           return;
       },
       getRect : function(style) {
           var minX =  Number.MAX_VALUE;
           var maxX =  Number.MIN_VALUE;
           var minY = Number.MAX_VALUE;
           var maxY = Number.MIN_VALUE;

           var pointList = style.pointList.$model;
           for(var i = 0, l = pointList.length; i < l; i++) {
               if (pointList[i][0] < minX) {
                   minX = pointList[i][0];
               }
               if (pointList[i][0] > maxX) {
                   maxX = pointList[i][0];
               }
               if (pointList[i][1] < minY) {
                   minY = pointList[i][1];
               }
               if (pointList[i][1] > maxY) {
                   maxY = pointList[i][1];
               }
           }

           var lineWidth;
           if (style.strokeStyle || style.fillStyle  ) {
               lineWidth = style.lineWidth || 1;
           } else {
               lineWidth = 0;
           }
           return {
               x : Math.round(minX - lineWidth / 2),
               y : Math.round(minY - lineWidth / 2),
               width : maxX - minX + lineWidth,
               height : maxY - minY + lineWidth
           };
       }

   } );

   return Polygon;


},{
   requires:[
     "canvax/display/Shape",
     "canvax/core/Base"
   ]
});
;KISSY.add("canvax/shape/Rect" , function( S , Shape , Base){
  var Rect = function(opt){
      var self = this;
      self.type = "rect";

      opt.context || (opt.context = {});
      self._context = {
           //x             : 0,//{number},  // 必须，左上角横坐标
           //y             : 0,//{number},  // 必须，左上角纵坐标
           width         : opt.context.width || 0,//{number},  // 必须，宽度
           height        : opt.context.height|| 0,//{number},  // 必须，高度
           radius        : opt.context.radius|| []     //{array},   // 默认为[0]，圆角 
      }
      arguments.callee.superclass.constructor.apply(this, arguments);
  };

  Base.creatClass( Rect , Shape , {
      /**
       * 绘制圆角矩形
       * @param {Context2D} ctx Canvas 2D上下文
       * @param {Object} style 样式
       */
      _buildRadiusPath: function(ctx, style) {
          //左上、右上、右下、左下角的半径依次为r1、r2、r3、r4
          //r缩写为1         相当于 [1, 1, 1, 1]
          //r缩写为[1]       相当于 [1, 1, 1, 1]
          //r缩写为[1, 2]    相当于 [1, 2, 1, 2]
          //r缩写为[1, 2, 3] 相当于 [1, 2, 3, 2]
          var x = 0;
          var y = 0;
          var width = this.context.width;
          var height = this.context.height;
          var r = style.radius.$model;
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
          ctx.moveTo(x + r1, y);
          ctx.lineTo(x + width - r2, y);
          r2 !== 0 && ctx.quadraticCurveTo(
                  x + width, y, x + width, y + r2
                  );
          ctx.lineTo(x + width, y + height - r3);
          r3 !== 0 && ctx.quadraticCurveTo(
                  x + width, y + height, x + width - r3, y + height
                  );
          ctx.lineTo(x + r4, y + height);
          r4 !== 0 && ctx.quadraticCurveTo(
                  x, y + height, x, y + height - r4
                  );
          ctx.lineTo(x, y + r1);
          r1 !== 0 && ctx.quadraticCurveTo(x, y, x + r1, y);
      },

      /**
       * 创建矩形路径
       * @param {Context2D} ctx Canvas 2D上下文
       * @param {Object} style 样式
       */
      draw : function(ctx, style) {
          if(!style.$model.radius.length) {
              var x = 0;
              var y = 0;

              //ctx.moveTo(x, y);
              /*
              ctx.lineTo(x + this.context.width, y);
              ctx.lineTo(x + this.context.width, y + this.context.height);
              ctx.lineTo(x, y + this.context.height);
              ctx.lineTo(x, y);
              */

              if(!!ctx.fillStyle){
                 ctx.fillRect(x,y,this.context.width,this.context.height)
              }
              
              if(!!ctx.lineWidth){
                 ctx.strokeRect(x,y,this.context.width,this.context.height);
              }
              //ctx.rect(x, y, this.get("width"), this.get("height"));
          } else {
              this._buildRadiusPath(ctx, style);
          }
          return;
      },

      /**
       * 返回矩形区域，用于局部刷新和文字定位
       * @param {Object} style
       */
      getRect : function(style) {
              var lineWidth;
              if (style.fillStyle || style.strokeStyle) {
                  lineWidth = style.lineWidth || 1;
              }
              else {
                  lineWidth = 0;
              }
              return {
                    x : Math.round(0 - lineWidth / 2),
                    y : Math.round(0 - lineWidth / 2),
                    width : this.context.width + lineWidth,
                    height : this.context.height + lineWidth
              };
          }

  } );

  return Rect;

} , {
  requires : [
    "canvax/display/Shape",
    "canvax/core/Base"
  ]
});
;KISSY.add("canvax/shape/Sector" , function(S,Shape,math,Polygon , Base){
 
   var Sector = function(opt){
       var self = this;
       self.type = "sector";

       opt.context || (opt.context={})
       self._context = {
           pointList : [],//边界点的集合,私有，从下面的属性计算的来
           //x             : {number},  // 必须，圆心横坐标
           //y             : {number},  // 必须，圆心纵坐标
           r0: opt.context.r0 || 0,// 默认为0，内圆半径指定后将出现内弧，同时扇边长度 = r - r0
           r : opt.context.r  || 0,//{number},  // 必须，外圆半径
           startAngle : opt.context.startAngle || 0,//{number},  // 必须，起始角度[0, 360)
           endAngle   : opt.context.endAngle   || 0 //{number},  // 必须，结束角度(0, 360]
       }
       arguments.callee.superclass.constructor.apply(this , arguments);
   };



   Base.creatClass(Sector , Shape , {
       draw : function(ctx, style) {
           
                var x = 0;   // 圆心x
                var y = 0;   // 圆心y
                var r0 = typeof style.r0 == 'undefined'     // 形内半径[0,r)
                         ? 0 : style.r0;
                var r = style.r;                            // 扇形外半径(0,r]
                var startAngle = style.startAngle;          // 起始角度[0,360)
                var endAngle = style.endAngle;              // 结束角度(0,360]
                var PI2 = Math.PI * 2;

                startAngle = math.degreeToRadian(startAngle);
                endAngle = math.degreeToRadian(endAngle);

                //sin&cos已经在tool.math.缓存了，放心大胆的重复调用
                //ctx.moveTo(
                //    math.cos(startAngle) * r0 + x,
                //    y - math.sin(startAngle) * r0
                //);

                //ctx.lineTo(
                //    math.cos(startAngle) * r + x,
                //    y - math.sin(startAngle) * r
                //);

                ctx.arc(x, y, r, PI2 - startAngle, PI2 - endAngle, true);

                //ctx.lineTo(
                //    math.cos(endAngle) * r0 + x,
                //    y - math.sin(endAngle) * r0
                //);

                if (r0 !== 0) {
                    ctx.arc(x, y, r0, PI2 - endAngle, PI2 - startAngle, false);
                }

                return;
        },
        getRect : function(style){
            var x = 0;   // 圆心x
            var y = 0;   // 圆心y
            var r0 = typeof style.r0 == 'undefined'     // 形内半径[0,r)
                ? 0 : style.r0;
            var r = style.r;                            // 扇形外半径(0,r]
            var startAngle = style.startAngle;          // 起始角度[0,360)
            var endAngle = style.endAngle;              // 结束角度(0,360]
            var pointList = [];
            if (startAngle < 90 && endAngle > 90) {
                pointList.push([
                        x, y - r
                        ]);
            }
            if (startAngle < 180 && endAngle > 180) {
                pointList.push([
                        x - r, y
                        ]);
            }
            if (startAngle < 270 && endAngle > 270) {
                pointList.push([
                        x, y + r
                        ]);
            }
            if (startAngle < 360 && endAngle > 360) {
                pointList.push([
                        x + r, y
                        ]);
            }

            startAngle = math.degreeToRadian(startAngle);
            endAngle = math.degreeToRadian(endAngle);


            pointList.push([
                    math.cos(startAngle) * r0 + x,
                    y - math.sin(startAngle) * r0
                    ]);

            pointList.push([
                    math.cos(startAngle) * r + x,
                    y - math.sin(startAngle) * r
                    ]);

            pointList.push([
                    math.cos(endAngle) * r + x,
                    y - math.sin(endAngle) * r
                    ]);

            pointList.push([
                    math.cos(endAngle) * r0 + x,
                    y - math.sin(endAngle) * r0
                    ]);

                
            style.pointList = pointList;
            
            return Polygon.prototype.getRect(style);

        }

   });

   return Sector;

},{
   requires:[
     "canvax/display/Shape",
     "canvax/utils/Math",
     "canvax/shape/Polygon",
     "canvax/core/Base"
   ]
});
;KISSY.add("canvax/shape/Shapes" , 
      function(S,Beziercurve,BrokenLine,Circle,Droplet,Ellipse,Heart,Isogon,Line,Path,Polygon,Sector,Rect){

          var Shapes={
              Beziercurve : Beziercurve, //贝塞尔曲线
              BrokenLine  : BrokenLine,  //折线
              Circle      : Circle,      //圆形
              Droplet     : Droplet,     //水滴型
              Ellipse     : Ellipse,     //椭圆形
              Heart       : Heart,       //心形
              Isogon      : Isogon,      //正多边形
              Line        : Line,        //直线
              Path        : Path,        //路径
              Polygon     : Polygon,     //非规则多边形
              Sector      : Sector,      //扇形
              Rect        : Rect         //矩形
          }

          return Shapes;

} , {
    requires:[
      "canvax/shape/Beziercurve",
      "canvax/shape/BrokenLine",
      "canvax/shape/Circle",
      "canvax/shape/Droplet",
      "canvax/shape/Ellipse",
      "canvax/shape/Heart",
      "canvax/shape/Isogon",
      "canvax/shape/Line",
      "canvax/shape/Path",
      "canvax/shape/Polygon",
      "canvax/shape/Sector",
      "canvax/shape/Rect"
    ]
})
;KISSY.add("canvax/utils/HitTestPoint" , function(S , Base){
    /**
     * 图形空间辅助类
     * isInside：是否在区域内部
     * isOutside：是否在区域外部
     * getTextWidth：测算单行文本宽度
     * TODO:本检测只为进一步的 详细 检测。也就是说 进过了基本的矩形范围检测后才会
     * 使用本检测方法
     */
    var HitTestPoint={};

    /**
     * 包含判断
     * @param {string} shape : 图形
     * @param {number} x ： 横坐标
     * @param {number} y ： 纵坐标
     */
    function isInside(shape , x, y) {
        if (!shape || !shape.type) {
            // 无参数或不支持类型
            return false;
        }
        var zoneType = shape.type;


        // 未实现或不可用时则数学运算，主要是line，brokenLine
        var _mathReturn = _mathMethod(zoneType, shape, x, y);

        if (typeof _mathReturn != 'undefined') {
            return _mathReturn;
        }

        if (zoneType != 'beziercurve'&& shape.buildPath && Base._pixelCtx.isPointInPath) {
               return _buildPathMethod(shape, Base._pixelCtx, x, y);
        } else if (Base._pixelCtx.getImageData) {
            return _pixelMethod(shape, x, y);
        }

        // 上面的方法都行不通时
        switch (zoneType) {
            //心形----------------------10
            case 'heart':
                return true;    // Todo，不精确
                //水滴----------------------11
            case 'droplet':
                return true;    // Todo，不精确
            case 'ellipse':
                return true;     // Todo，不精确
                //路径，椭圆，曲线等-----------------13
            default:
                return false;   // Todo，暂不支持
        }
    }

    /**
     * 用数学方法判断，三个方法中最快，但是支持的shape少
     *
     * @param {string} zoneType ： 图形类型
     * * @param {number} x ： 横坐标
     * @param {number} y ： 纵坐标
     * @return {boolean=} true表示坐标处在图形中
     */
    function _mathMethod(zoneType,shape,x, y) {
        // 在矩形内则部分图形需要进一步判断
        switch (zoneType) {
            //线-----------------------1
            case 'line':
                return _isInsideLine(shape.context, x, y);
                //折线----------------------2
            case 'brokenLine':
                return _isInsideBrokenLine(shape, x, y);
                //文本----------------------3
            case 'text':
                return true;
                //圆环----------------------4
            case 'ring':
                return _isInsideRing(shape , x, y);
                //矩形----------------------5
            case 'rect':
                return true;
                //圆形----------------------6
            case 'circle':
                return _isInsideCircle(shape , x, y);
                //椭圆
            case 'ellipse':
                return _isPointInElipse(shape , x , y);
                //扇形----------------------7
            case 'sector':
                return _isInsideSector(shape , x, y);
                //path---------------------8
            case 'path':
                return _isInsidePath(shape , x, y);
                //多边形-------------------9
            case 'polygon':
            case 'star':
            case 'isogon':
                return _isInsidePolygon(shape , x, y);
                //图片----------------------10
            case 'image':
                return true;
        }
    }

    /**
     * 通过buildPath方法来判断，三个方法中较快，但是不支持线条类型的shape，
     * 而且excanvas不支持isPointInPath方法
     *
     * @param {Object} shapeClazz ： shape类
     * @param {Object} context : 上下文
     * @param {Object} area ：目标区域
     * @param {number} x ： 横坐标
     * @param {number} y ： 纵坐标
     * @return {boolean} true表示坐标处在图形中
     */
    function _buildPathMethod(shape, context, x, y) {
        var area = shape.context;
        // 图形类实现路径创建了则用类的path
        context.beginPath();
        shape.buildPath(context, area);
        context.closePath();
        return context.isPointInPath(x, y);
    }

    /**
     * 通过像素值来判断，三个方法中最慢，但是支持广,不足之处是excanvas不支持像素处理
     *
     * @param {Object} shapeClazz ： shape类
     * @param {Object} area ：目标区域
     * @param {number} x ： 横坐标
     * @param {number} y ： 纵坐标
     * @return {boolean} true表示坐标处在图形中
     */
    function _pixelMethod(shape, x, y) {
        var area = shape.context;

        var _context = Base._pixelCtx;

        

        _context.save();
        _context.beginPath();
        shape.setContextStyle(_context , area);
       
        _context.transform.apply( _context , shape.getConcatenatedMatrix().toArray() );

        //这个时候肯定是做过矩形范围检测过来的
        //所以，shape._rect 肯定都是已经有值的
        _context.clearRect( shape._rect.x-10 , shape._rect.y-10 , shape._rect.width+20 , shape._rect.height+20 );


        shape.draw(_context,  area);
        shape.drawEnd(_context);
        _context.closePath();
        _context.restore();

        //对鼠标的坐标也做相同的变换
        var _transformStage = shape.getConcatenatedMatrix()
        if( _transformStage ){
            var inverseMatrix = _transformStage.clone();

            var originPos = [x, y];
            inverseMatrix.mulVector( originPos , [ x , y , 1 ] );

            x = originPos[0];
            y = originPos[1];
        }
        

        return _isPainted(_context, x , y);
    }

    /**
     * 坐标像素值，判断坐标是否被作色
     *
     * @param {Object} context : 上下文
     * @param {number} x : 横坐标
     * @param {number} y : 纵坐标
     * @param {number=} unit : 触发的精度，越大越容易触发，可选，缺省是为1
     * @return {boolean} 已经被画过返回true
     */
    function _isPainted(context, x, y, unit) {
        var pixelsData;

        if (typeof unit != 'undefined') {
            unit = Math.floor((unit || 1 )/ 2);
            pixelsData = context.getImageData(
                    x - unit,
                    y - unit,
                    unit + unit,
                    unit + unit
                    ).data;
        }
        else {
            pixelsData = context.getImageData(x, y, 1, 1).data;
        }

        var len = pixelsData.length;
        while (len--) {
            if (pixelsData[len] !== 0) {
                return true;
            }
        }

        return false;
    }

    /**
     * !isInside
     */
    function isOutside(shape, x, y) {
        return !isInside(shape, x, y);
    }

    /**
     * 线段包含判断
     */
    function _isInsideLine(area , x, y) {
        var _x1 = area.xStart;
        var _y1 = area.yStart;
        var _x2 = area.xEnd;
        var _y2 = area.yEnd;
        var _l = area.lineWidth;
        var _a = 0;
        var _b = _x1;

        if (_x1 !== _x2) {
            _a = (_y1 - _y2) / (_x1 - _x2);
            _b = (_x1 * _y2 - _x2 * _y1) / (_x1 - _x2) ;
        }
        else {
            return Math.abs(x - _x1) <= _l / 2;
        }

        var _s = (_a * x - y + _b) * (_a * x - y + _b) / (_a * _a + 1);
        return  _s <= _l / 2 * _l / 2;
    }

    function _isInsideBrokenLine(shape, x, y) {
        var area = shape.context;
        var pointList = area.pointList.$model;
        var lineArea;
        var insideCatch = false;
        for (var i = 0, l = pointList.length - 1; i < l; i++) {
            lineArea = {
                xStart : pointList[i][0],
                yStart : pointList[i][1],
                xEnd : pointList[i + 1][0],
                yEnd : pointList[i + 1][1],
                lineWidth : area.lineWidth
            };
            if (!_isInsideRectangle(
                        {
                            x : Math.min(lineArea.xStart, lineArea.xEnd)
                - lineArea.lineWidth,
               y : Math.min(lineArea.yStart, lineArea.yEnd)
                - lineArea.lineWidth,
               width : Math.abs(lineArea.xStart - lineArea.xEnd)
                + lineArea.lineWidth,
               height : Math.abs(lineArea.yStart - lineArea.yEnd)
                + lineArea.lineWidth
                        },
                        x,y
                        )
               ) {
                   // 不在矩形区内跳过
                   continue;
               }
            insideCatch = _isInsideLine(lineArea, x, y);
            if (insideCatch) {
                break;
            }
        }
        return insideCatch;
    }

    function _isInsideRing(shape , x, y) {
        var area = shape.context;
        if (_isInsideCircle(shape , x, y)
                && !_isInsideCircle(
                    shape,
                    x, y,
                    area.r0 || 0
                    )
           ){
               // 大圆内，小圆外
               return true;
           }
        return false;
    }

    /**
     * 矩形包含判断
     */
    function _isInsideRectangle(shape, x, y) {

        if (x >= shape.x
                && x <= (shape.x + shape.width)
                && y >= shape.y
                && y <= (shape.y + shape.height)
           ) {
               return true;
           }
        return false;
    }

    /**
     * 圆形包含判断
     */
    function _isInsideCircle(shape, x, y , r) {
        var area = shape.context;
        !r && (r=area.r);
        return (x * x + y * y) < r * r;
    }

    /**
     * 扇形包含判断
     */
    function _isInsideSector(shape, x, y) {
        var area = shape.context
        if (!_isInsideCircle(shape, x, y)
                || (area.r0 > 0 && _isInsideCircle( shape ,x, y , area.r0))
           ){
               // 大圆外或者小圆内直接false
               return false;
           }
        else {
            // 判断夹角
            var angle = (360
                    - Math.atan2(y , x )
                    / Math.PI
                    * 180)
                % 360;
            var endA = (360 + area.endAngle) % 360;
            var startA = (360 + area.startAngle) % 360;
            if (endA > startA) {
                return (angle >= startA && angle <= endA);
            } else {
                return !(angle >= endA && angle <= startA);
            }

        }
    }

    /*
     *椭圆包含判断
     * */
    function _isPointInElipse(shape , x , y) {
        var area=shape.context;
        var center={x:0,y:0};
        //x半径
        var XRadius = area.hr;
        var YRadius = area.vr;

        var p = {
            x : x,
            y : y
        }
        
        var iRes;

        p.x -= center.x;
        p.y -= center.y;

        p.x *= p.x;
        p.y *= p.y;

        XRadius *= XRadius;
        YRadius *= YRadius;

        iRes = YRadius * p.x + XRadius * p.y - XRadius * YRadius;

        return (iRes < 0);
    }

    /**
     * 多边形包含判断
     * 警告：下面这段代码会很难看，建议跳过~
     */
    function _isInsidePolygon(shape, x, y) {
        /**
         * 射线判别法
         * 如果一个点在多边形内部，任意角度做射线肯定会与多边形要么有一个交点，要么有与多边形边界线重叠
         * 如果一个点在多边形外部，任意角度做射线要么与多边形有一个交点，
         * 要么有两个交点，要么没有交点，要么有与多边形边界线重叠。
         */
        var area = shape.context ? shape.context : shape;
        var polygon = area.pointList.$model || area.pointList;
        var i;
        var j;
        var N = polygon.length;
        var inside = false;
        var redo = true;
        var v;

        for (i = 0; i < N; ++i) {
            // 是否在顶点上
            if (polygon[i][0] == x && polygon[i][1] == y ) {
                redo = false;
                inside = true;
                break;
            }
        }

        if (redo) {
            redo = false;
            inside = false;
            for (i = 0,j = N - 1;i < N;j = i++) {
                if ((polygon[i][1] < y && y < polygon[j][1])
                        || (polygon[j][1] < y && y < polygon[i][1])
                   ) {
                       if (x <= polygon[i][0] || x <= polygon[j][0]) {
                           v = (y - polygon[i][1])
                               * (polygon[j][0] - polygon[i][0])
                               / (polygon[j][1] - polygon[i][1])
                               + polygon[i][0];
                           if (x < v) {          // 在线的左侧
                               inside = !inside;
                           }
                           else if (x == v) {   // 在线上
                               inside = true;
                               break;
                           }
                       }
                   }
                else if (y == polygon[i][1]) {
                    if (x < polygon[i][0]) {    // 交点在顶点上
                        polygon[i][1] > polygon[j][1] ? --y : ++y;
                        //redo = true;
                        break;
                    }
                }
                else if (polygon[i][1] == polygon[j][1] // 在水平的边界线上
                        && y == polygon[i][1]
                        && ((polygon[i][0] < x && x < polygon[j][0])
                            || (polygon[j][0] < x && x < polygon[i][0]))
                        ) {
                            inside = true;
                            break;
                        }
            }
        }
        return inside;
    }

    /**
     * 路径包含判断，依赖多边形判断
     */
    function _isInsidePath(shape, x, y) {
        var area = shape.context;
        var pointList = area.$pointList || area.pointList.$model;
        var insideCatch = false;
        for (var i = 0, l = pointList.length; i < l; i++) {
            insideCatch = _isInsidePolygon(
                    { pointList : pointList[i] }, x, y
                    );
            if (insideCatch) {
                break;
            }
        }
        return insideCatch;
    }

    /**
     * 测算单行文本欢度
     * @param {Object} text
     * @param {Object} textFont
     */
    function getTextWidth(text, textFont) {
        Base._pixelCtx.save();
        if (textFont) {
            Base._pixelCtx.font = textFont;
        }
        var width = Base._pixelCtx.measureText(text).width;
        Base._pixelCtx.restore();

        return width;
    }

    HitTestPoint = {
        isInside : isInside,
        isOutside : isOutside,
        getTextWidth : getTextWidth
    };

    return HitTestPoint;

},{
    requires : [
        "canvax/core/Base"
        ]
});
;KISSY.add("canvax/utils/ImagesLoader" , function( S , Base , EventDispatcher ){
   var ImagesLoader = function( urls ){
       arguments.callee.superclass.constructor.apply(this, arguments);
       this.urls  = urls || [];   //要加载的images
       this.images= []; //正在加载的img
       this.loads = 0;  //已经加载了多少回来
       this.init();
   };

   Base.creatClass( ImagesLoader , EventDispatcher , {
       init      : function(){
           this.images.length = this.urls.length;
       },
       _loadHand : function( i , callback ) {
           var img  = new Image();

          
           var self = this;
        

           img.onload = function () {
               //if (img.complete == true) {
               
               //把这个img 查到 它的url在urls中对应的index中去
               self.images.splice( i , 1 , img );
               callback(i , img);
               
               //}
               //alert(i)
           }
           return img;


           /*
           //做浏览器嗅探添加不同的侦听
           var appname = navigator.appName.toLowerCase();

           if (appname.indexOf("netscape") == -1) {
               //ie
               img.onreadystatechange = function () {
                   if (img.readyState == "complete") {
                       callback(i , img);
                   }
               };
           } else {
               //标准浏览器
               img.onload = function () {
                   //if (img.complete == true) {
                       callback(i , img);
                   //}
               }
           }
           return img;
           */

       },
       _load    : function( i , src , callback ){
           //必须先在src赋值前注册事件
           this._loadHand( i , callback ).src = src+"?t="+new Date().getTime();
       },
       start   : function(){
           //开始加载
           var self = this;

           if(this.urls.length > 0){
              for( var i = 0,l = this.urls.length ; i < l ; i++ ){
                 var url = this.urls[ i ];

                 self._load( i , url , function( i , img ){
                      //回传对应的索引 和 img对象
                      self.loads = self.loads+1 ;

                      if( self.hasEvent("secSuccess") ){
                          self.fire( {
                              index : i,
                              img   : img,
                              type  : "secSuccess"
                          } );
                      } 

                      if(self.loads == l){
                         //已经load完了
                         if( self.hasEvent("success") ){
                             //alert('loads' + self.loads);
                             self.fire( {
                                images : self.images,
                                type   : "success"
                             } );
                         }
                      }
                 } );
              }
           }
       }
       
   });

   return ImagesLoader;

} , {
   requires : [
      "canvax/core/Base",
      "canvax/event/EventDispatcher"
   ]
}); 
;KISSY.add("canvax/utils/Math" , function(S){
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

        return {
            sin : sin,
            cos : cos,
            degreeToRadian : degreeToRadian,
            radianToDegree : radianToDegree
        };
 
},{
  requires:[]
})
