define(
    'dvix/utils/tools',
    [],
    function(){
        return {
            ////自动检测一个中文字符的高宽和一个英文字符的高宽
            probOneStrSize:function(){ 
                S.all("body").append("<span style='line-height:1;visibility:hidden;position:absolute;left:0;top:0;' id='off-the-cuff-str'>8</span>");
                var oneStrNode = S.all("#off-the-cuff-str");
                var oneStrSize={
                    en : {
                        width : oneStrNode.width(),
                        height: oneStrNode.height()
                    }
                };
                oneStrNode.html("国");
                oneStrSize.cn={
                    width : oneStrNode.width(),
                    height: oneStrNode.height()
                };
                oneStrNode.remove();
                oneStrNode = null;
                //中英文字符的高宽探测结束
         
                return oneStrSize;
     
     
            },
            /**
     		 * 将二维数组转换成一维数组
     		 * @param  {[Array]} $arr [二维数组]
     		 * @return {[Array]}      [一维数组]
     	   */
     	   getChildsArr:function($arr){
     			var arr = []
     			for (var i = 0, l = $arr.length; i < l; i++){
     				var tmp = $arr[i]
     				arr = arr.concat(tmp);
     			}
     			return arr;
     	   },
     	   /**
     		 * 根据$start和$end 从一个数组中合并数据
     		 * @param  {[Array]} $arr    [数组]
     		 * @param  {[Number]} $start [开始的索引]
     		 * @param  {[Number]} $end   [结束的索引]
     		 * @return {[Number]}        [之和的数字]
     		 */
     		getArrMergerNumber:function($arr,$start,$end){
     			var n = 0
     			var start = $start ? $start : 0 
     			var end = $end || $end == 0 ? $end : $arr.length - 1
     			if (start > end) {
     				return n
     			}
     			for (var a = 0, al = $arr.length; a < al; a++) {
     				if(a >= start){
     					n = n + Number($arr[a])
     					if(a == end){
     						break;
     					}
     				}
     			}
     			return n
     		},
     		//在一个数组中 返回比对$arr中的值离$n最近的值的索引
     		getDisMinATArr:function($n, $arr) {
     			var index = 0
     			var n = Math.abs($n - $arr[0])
     			for (var a = 1, al = $arr.length ; a < al; a++ ) {
     				if (n > Math.abs($n - $arr[a])) {
     					n = Math.abs($n - $arr[a])
     					index = a
     				}
     			}
     			return index
     		},
            /**
     		* 计算数组中的每个值 占该数组总值的比例 并按原始索引返回对应的比例数组  比例总和为100
     		* @param  {[Array]} $arr    [数组]
     		* @return {[Array]}         [对应的比例数组]
     		*/
     	   getArrScales:function($arr){
     			var arr = []
     			var total = 0
     			var max = 0
     			var maxIndex = 0
     			var scales = []
     			for (var a = 0 , al = $arr.length; a < al; a++) {
     				$arr[a] = Number($arr[a])
     				total += $arr[a]
     			}
     			for (var b = 0, bl = $arr.length; b < bl; b++) {
     				var scale = Math.round($arr[b] / total * 100)
     				scales.push(scale)
     				
     				//最后一个
     				if (b == ($arr.length - 1)) {
     					var n = 0
     					for (var d = 0, dl = scales.length - 1; d < dl; d++ ) {
     						n += scales[d]
     					}
     					n = 100 - n
     					n = n < 0 ? 0 : n
     					scale = n
     					//如果最后一个大于前一个
     					// if(n > arr[arr.length - 1]){
     					// 	var dis = n - arr[arr.length - 1]
     					// 	n = arr[arr.length - 1]
     					// 	arr[0] += dis
     					// 	scale = n
     					// }
     				}
     				
     				arr.push(scale)
     			}
     			
     			total = 0
     			for (var c = 0, cl = arr.length; c < cl; c++) {
     				arr[c] = isNaN(arr[c]) || arr[c] < 0 ? 0 : arr[c]
     				if(max < arr[c]){
     					max = arr[c]
     					maxIndex = c
     				}
     				total += arr[c]
     			}
     			if(total > 100){
     				arr[maxIndex] = arr[maxIndex] - (total - 100)
     			}else if(total < 100){
     				arr[maxIndex] = arr[maxIndex] + (100 - total)
     			}
     			return arr
     	   },
            	/**
     		 * 数字千分位加','号
     		 * @param  {[Number]} $n [数字]
     		 * @param  {[type]} $s [千分位上的符号]
     		 * @return {[String]}    [根据$s提供的值 对千分位进行分隔 并且小数点上自动加上'.'号  组合成字符串]
     		 */
     		numAddSymbol:function($n,$s){
                 var s = Number($n);
     			var symbol = $s ? $s : ','
     			if( !s ){
     				return String($n);
     			};
                 if(s >= 1000){
                     var num = parseInt(s/1000);
                     return String($n.toString().replace( num , num + symbol ))
                 } else {
                     return String(s);
                 }   
     		},
            	/**
     		 * 获取一个path路径
     		 * @param  {[Array]} $arr    [数组]
     		 * @return {[String]}        [path字符串]
     		 */
     		getPath:function($arr){
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
        }
     
    }
);
