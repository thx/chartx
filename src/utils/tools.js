import _ from "underscore"

//扩展underscore，主要是deepExtend
export function mixinUnderscore()
{
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
        for (var _i = 0, _len = sharedObjectKeys.length; _i < _len; _i++) {
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
        for (var _j = 0, _len1 = sharedArrayKeys.length; _j < _len1; _j++) {
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
}


//如果应用传入的数据是[{name:name, sex:sex ...} , ...] 这样的数据，就自动转换为chartx需要的矩阵格式数据
export function parse2MatrixData( list )
{
    //检测第一个数据是否为一个array, 否就是传入了一个json格式的数据
    if( list.length > 0 && !_.isArray( list[0] ) ){
        var newArr = [];
        var fields = [];
        var fieldNum = 0;
        for( var i=0,l=list.length ; i<l ; i++ ){
            var row = list[i];
            if( i == 0 ){
                for( var f in row ){
                    fields.push( f ); 
                };
                newArr.push( fields );
                fieldNum = fields.length;
            };
            var _rowData = [];
            for( var ii=0 ; ii<fieldNum ; ii++ ){
                _rowData.push( row[ fields[ii] ] );
            };
            newArr.push( _rowData );
        };
        
        return newArr;
    } else {
        return list
    }

} 


/**
 * 数字千分位加','号
 * @param  {[Number]} $n [数字]
 * @param  {[type]} $s [千分位上的符号]
 * @return {[String]}    [根据$s提供的值 对千分位进行分隔 并且小数点上自动加上'.'号  组合成字符串]
 */
export function numAddSymbol($n,$s)
{
    var s = Number($n);
    var symbol = $s ? $s : ','
    if( !s ){
        return String($n);
    };
    if(s >= 1000){
        var num = parseInt(s/1000);
        return String($n.toString().replace( num , num + symbol ))
    } else {
        return String($n);
    }   
}

export function getEl(el){
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
}

//在一个数组中 返回比对$arr中的值离$n最近的值的索引
export function getDisMinATArr($n, $arr) {
    var index = 0
    var n = Math.abs($n - $arr[0])
    for (var a = 1, al = $arr.length ; a < al; a++ ) {
        if (n > Math.abs($n - $arr[a])) {
            n = Math.abs($n - $arr[a])
            index = a
        }
    }
    return index
}

/**
 * 获取一个path路径
 * @param  {[Array]} $arr    [数组]
 * @return {[String]}        [path字符串]
 */
export function getPath($arr){
    var M = 'M', L = 'L', Z = 'z'
    var s = '';
     if( _.isArray( $arr[0] ) ){
         s = M + $arr[0][0] + ' ' + $arr[0][1]
     } else {
         s = M + $arr[0].x + ' ' + $arr[0].y
     }
    for(var a = 1,al = $arr.length; a < al ; a++){
         var x = 0 , y = 0 , item = $arr[a]; 
         if( _.isArray( item ) ){
             x = item[0];
             y = item[1];
         } else {
             x = item.x;
             y = item.y;
         }
        s += ' ' + L + x + ' ' + y
    }
    // s += ' ' + Z
    return s
}