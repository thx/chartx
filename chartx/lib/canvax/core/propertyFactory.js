/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 属性工厂，ie下面用VBS提供支持
 * 来给整个引擎提供心跳包的触发机制
 */


define(
    "canvax/core/PropertyFactory",
    [
    ],
    function(){
    //定义封装好的兼容大部分浏览器的defineProperties 的 属性工厂
        var unwatchOne = {
            "$skipArray" : 0,
            "$watch"     : 1,
            "$fire"      : 2,//主要是get set 显性设置的 触发
            "$model"     : 3,
            "$accessor"  : 4,
            "$owner"     : 5,
            //"path"       : 6, //这个应该是唯一一个不用watch的不带$的成员了吧，因为地图等的path是在太大
            "$parent"    : 7  //用于建立数据的关系链
        }
    
        function PropertyFactory(scope, model, watchMore) {
    
            var stopRepeatAssign=true;
    
            var skipArray = scope.$skipArray, //要忽略监控的属性名列表
                pmodel = {}, //要返回的对象
                accessores = {}, //内部用于转换的对象
                VBPublics = _.keys( unwatchOne ); //用于IE6-8
    
                model = model || {};//这是pmodel上的$model属性
                watchMore = watchMore || {};//以$开头但要强制监听的属性
                skipArray = _.isArray(skipArray) ? skipArray.concat(VBPublics) : VBPublics;
    
            function loop(name, val) {
                if ( !unwatchOne[name] || (unwatchOne[name] && name.charAt(0) !== "$") ) {
                    model[name] = val
                };
                var valueType = typeof val;
                if (valueType === "function") {
                    if(!unwatchOne[name]){
                      VBPublics.push(name) //函数无需要转换
                    }
                } else {
                    if (_.indexOf(skipArray,name) !== -1 || (name.charAt(0) === "$" && !watchMore[name])) {
                        return VBPublics.push(name)
                    }
                    var accessor = function(neo) { //创建监控属性或数组，自变量，由用户触发其改变
                        var value = accessor.value, preValue = value, complexValue;
                        
                        if (arguments.length) {
                            //写操作
                            //set 的 值的 类型
                            var neoType = typeof neo;
    
                            if (stopRepeatAssign) {
                                return //阻止重复赋值
                            }
                            if (value !== neo) {
                                if( neo && neoType === "object" && !(neo instanceof Array) ){
                                    value = neo.$model ? neo : PropertyFactory(neo , neo);
                                    complexValue = value.$model;
                                } else {//如果是其他数据类型
                                    //if( neoType === "array" ){
                                    //    value = _.clone(neo);
                                    //} else {
                                        value = neo
                                    //}
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
                                var hasWatchModel = pmodel;
                                //所有的赋值都要触发watch的监听事件
                                if ( !pmodel.$watch ) {
                                  while( hasWatchModel.$parent ){
                                     hasWatchModel = hasWatchModel.$parent;
                                  }
                                }
                                if ( hasWatchModel.$watch ) {
                                  hasWatchModel.$watch.call(hasWatchModel , name, value, preValue);
                                }
                            }
                        } else {
                            //读操作
                            //读的时候，发现value是个obj，而且还没有defineProperty
                            //那么就临时defineProperty一次
                            if ( value && (valueType === "object") 
                               && !(value instanceof Array) 
                               && !value.$model) {
                                //建立和父数据节点的关系
                                value.$parent = pmodel;
                                value = PropertyFactory(value , value);
    
                                //accessor.value 重新复制为defineProperty过后的对象
                                accessor.value = value;
                            }
                            return value;
                        }
                    };
                    accessor.value = val;
                    
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
        window.PropertyFactory = PropertyFactory;
        return PropertyFactory;
});
