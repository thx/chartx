/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 */
/* 
window.FlashCanvasOptions = {
    swfPath: "http://g.tbcdn.cn/thx/canvax/1.0.0/canvax/library/flashCanvas/"
};
*/
define(
    "canvax/core/Base",
    [
        "canvax/library/underscore",
        !document.createElement('canvas').getContext ? "canvax/library/flashCanvas/flashcanvas" : "" 
    ],
    function( _ , FlashCanvas ){
        var addOrRmoveEventHand = function( domHand , ieHand ){
            if( document[ domHand ] ){
                return function( el , type , fn ){
                    if( el.length ){
                        for(var i=0 ; i < el.length ; i++){
                            arguments.callee( el[i] , type , fn );
                        }
                    } else {
                        el[ domHand ]( type , fn , false );
                    }
                };
            } else {
                return function( el , type , fn ){
                    if( el.length ){
                        for(var i=0 ; i < el.length ; i++){
                            arguments.callee( el[i],type,fn );
                        }
                    } else {
                        el[ ieHand ]( "on"+type , function(){
                            return fn.call( el , window.event );
                        });
                    }
                };
            }
        };
        
        var Base = {
            mainFrameRate   : 60,//默认主帧率
            now : 0,
            // dom操作相关代码
            getEl : function(el){
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
            getOffset : function(el){
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
            //dom相关代码结束
            
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
                newDom.style.width  = _width + 'px';
                newDom.style.height = _height + 'px';
                newDom.style.left   = 0;
                newDom.style.top    = 0;
                //newDom.setAttribute('width', _width );
                //newDom.setAttribute('height', _height );
                newDom.setAttribute('width', _width * this._devicePixelRatio);
                newDom.setAttribute('height', _height * this._devicePixelRatio);
                newDom.setAttribute('id', id);
                return newDom;
            },
            canvasSupport : function() {
                return !!document.createElement('canvas').getContext;
            },
            createObject : function( proto , constructor ) {
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
            setContextStyle : function( ctx , style ){
                // 简单判断不做严格类型检测
                for(p in style){
                    if( p != "textBaseline" && ( p in ctx ) ){
                        if ( style[p] || _.isNumber( style[p] ) ) {
                            if( p == "globalAlpha" ){
                                //透明度要从父节点继承
                                ctx[p] *= style[p];
                            } else {
                                ctx[p] = style[p];
                            }
                        }
                    }
                };
                return;
            },
            creatClass : function(r, s, px){
                if (!s || !r) {
                    return r;
                }
                var sp = s.prototype, rp;
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
            initElement : function( canvas ){
                if( FlashCanvas && FlashCanvas.initElement){
                    FlashCanvas.initElement( canvas );
                }
            },
            //做一次简单的opt参数校验，保证在用户不传opt的时候 或者传了opt但是里面没有context的时候报错
            checkOpt    : function(opt){
                if( !opt ){
                  return {
                    context : {
                    
                    }
                  }   
                } else if( opt && !opt.context ) {
                  opt.context = {}
                  return opt;
                } else {
                  return opt;
                }
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
            /**
             * 简单的浅复制对象。
             * @param strict  当为true时只覆盖已有属性
             */
            copy: function(target, source, strict){ 
                if ( _.isEmpty(source) ){
                    return target;
                }
                for(var key in source){
                    if(!strict || target.hasOwnProperty(key) || target[key] !== undefined){
                        target[key] = source[key];
                    }
                }
                return target;
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
            setDeepExtend : function(){
                /*这里先给underscore 添加一个插件 deep-extend BEGIN*/
                //依赖underscore
                (function() {
                    var arrays, basicObjects, deepClone, deepExtend, deepExtendCouple, isBasicObject, __slice = [].slice;

                    deepClone = function(obj) {
                        var func, isArr;
                        if (!_.isObject(obj) || _.isFunction(obj)) {
                            return obj;
                        }
                        if (_.isDate(obj)) {
                            return new Date(obj.getTime());
                        }
                        if (_.isRegExp(obj)) {
                            return new RegExp(obj.source, obj.toString().replace(/.*\//, ""));
                        }
                        isArr = _.isArray(obj || _.isArguments(obj));
                        func = function(memo, value, key) {
                            if (isArr) {
                                memo.push(deepClone(value));
                            } else {
                                memo[key] = deepClone(value);
                            }
                            return memo;
                        };
                        return _.reduce(obj, func, isArr ? [] : {});
                    };

                    isBasicObject = function(object) {
                        return ( object==null || object==undefined || object.prototype === {}.prototype || object.prototype === Object.prototype) && _.isObject(object) && !_.isArray(object) && !_.isFunction(object) && !_.isDate(object) && !_.isRegExp(object) && !_.isArguments(object);
                    };

                    basicObjects = function(object) {
                        return _.filter(_.keys(object), function(key) {
                            return isBasicObject(object[key]);
                        });
                    };

                    arrays = function(object) {
                        return _.filter(_.keys(object), function(key) {
                            return _.isArray(object[key]);
                        });
                    };

                    deepExtendCouple = function(destination, source, maxDepth) {
                        if( !source ) {
                            return destination
                        }
                        var combine, recurse, sharedArrayKey, sharedArrayKeys, sharedObjectKey, sharedObjectKeys, _i, _j, _len, _len1;
                        if (maxDepth == null) {
                            maxDepth = 20;
                        }
                        if (maxDepth <= 0) {
                            console.warn('_.deepExtend(): Maximum depth of recursion hit.');
                            return _.extend(destination, source);
                        }
                        sharedObjectKeys = _.intersection(basicObjects(destination), basicObjects(source));
                        recurse = function(key) {
                            return source[key] = deepExtendCouple(destination[key], source[key], maxDepth - 1);
                        };
                        for (_i = 0, _len = sharedObjectKeys.length; _i < _len; _i++) {
                            sharedObjectKey = sharedObjectKeys[_i];
                            recurse(sharedObjectKey);
                        }
                        sharedArrayKeys = _.intersection(arrays(destination), arrays(source));
                        combine = function(key) {
                            //TODO:这里做点修改，array的话就不需要做并集了。直接整个array覆盖。因为
                            //在大部分的场景里，array的话，应该要看成是一个basicObject
                            return source[key];

                            //return source[key] = _.union(destination[key], source[key]);
                        };
                        for (_j = 0, _len1 = sharedArrayKeys.length; _j < _len1; _j++) {
                            sharedArrayKey = sharedArrayKeys[_j];
                            combine(sharedArrayKey);
                        }
                        return _.extend(destination, source);
                    };

                    deepExtend = function() {
                        var finalObj, maxDepth, objects, _i;
                        objects = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), maxDepth = arguments[_i++];
                        if (!_.isNumber(maxDepth)) {
                            objects.push(maxDepth);
                            maxDepth = 20;
                        }
                        if (objects.length <= 1) {
                            return objects[0];
                        }
                        if (maxDepth <= 0) {
                            return _.extend.apply(this, objects);
                        }
                        finalObj = objects.shift();
                        while (objects.length > 0) {
                            finalObj = deepExtendCouple(finalObj, deepClone(objects.shift()), maxDepth);
                        }
                        return finalObj;
                    };

                    _.mixin({
                        deepClone: deepClone,
                        isBasicObject: isBasicObject,
                        basicObjects: basicObjects,
                        arrays: arrays,
                        deepExtend: deepExtend
                    });

                }).call( window );

                /*deep-extend END*/
            }
        };
        Base.setDeepExtend();
        return Base
    }
);
