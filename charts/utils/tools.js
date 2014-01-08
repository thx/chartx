KISSY.add('charts/utils/tools',function(S){

   return {

       ////自动检测一个中文字符的高宽和一个英文字符的高宽
       probOneStrSize : function(){ 
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
				return $n;
			};
            if(s >= 1000){
                var num = parseInt(s/1000);
                return $n.toString().replace( num , num+symbol )
            } else {
                return s;
            }
            
		}


   }

});
