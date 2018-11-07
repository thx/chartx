import { _ } from "mmvis"

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
    var start = {
        x : 0,
        y : 0
    }
    if( _.isArray( $arr[0] ) ){
        start.x = $arr[0][0];
        start.y = $arr[0][1];
        s = M + $arr[0][0] + ' ' + $arr[0][1]
    } else {
        start = $arr[0];
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
        //s += ' ' + L + x + ' ' + y
        if( x == start.x && y == start.y ){
            s += ' ' + Z
        } else {
            s += ' ' + L + x + ' ' + y
        }
    }
    
    // s += ' ' + Z
    return s
}


export function cloneOptions( opt ){
    //保存function的标识
    var JsonSerialize = {
        prefix: '[[JSON_FUN_PREFIX_',
        suffix: '_JSON_FUN_SUFFIX]]'
    };

    /**
	 * chartOption 转成可保存的字符串（支持function）
	 */
	var stringify = function(obj){
		return JSON.stringify(obj, function(key, value){
			if(typeof value === 'function'){
				return JsonSerialize.prefix + value.toString() + JsonSerialize.suffix;
			}
		    return value;
		});
    }
    
	/**
	 * 获取已保存的chartOption（包含function）转成对象
	 */
	var parse = function(string){
		try{
			return JSON.parse( string ,function(key, value){
				if((typeof value === 'string') && 
				   (value.indexOf(JsonSerialize.suffix) > 0) && 
				   (value.indexOf(JsonSerialize.prefix) == 0)
				){
					return (new Function('return ' + value.replace(JsonSerialize.prefix, '').replace(JsonSerialize.suffix, '')))();
				}
				
				return value;
			})||{};
		} catch(e){
            return {};
		};
    }
    
    return parse( stringify( opt ) );

}

export function cloneData( data ){
    return JSON.parse( JSON.stringify( data ) );
}

