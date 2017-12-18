import Canvax from "canvax2d"

const _ = Canvax._;

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