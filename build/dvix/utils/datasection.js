KISSY.add('dvix/utils/datasection',function(S){
	 function normalizeTickInterval(interval, magnitude) {
        var normalized, i;
        // var multiples = [1, 2, 2.5, 5, 10];
        var multiples = [1, 2, 5, 10];
        // round to a tenfold of 1, 2, 2.5 or 5
        normalized = interval / magnitude;

        // normalize the interval to the nearest multiple
        for (i = 0; i < multiples.length; i++) {
            interval = multiples[i];
            if (normalized <= (multiples[i] + (multiples[i + 1] || multiples[i])) / 2) {
                break;
            }
        }

        // multiply back to the correct magnitude
        interval *= magnitude;

        return interval;
    }

    /**
     * Fix JS round off float errors
     * @param {Number} num
     */

    function correctFloat(num) {
        return parseFloat(
            num.toPrecision(14));
    }

    /**
     * Set the tick positions of a linear axis to round values like whole tens or every five.
     */

    function getLinearTickPositions(arr,$maxPart,$cfg) {
    	var scale = $cfg && $cfg.scale ? parseFloat($cfg.scale) :1

		if(isNaN(scale)){
			scale = 1
		}
        // var max = arrayMax(arr);
        var max = Math.max.apply(null,arr)
        var initMax = max
        max *= scale
        // var min = arrayMin(arr);
        var min = Math.min.apply(null,arr) 

        if(min==max){
        	if(max>=0){
        		min= 0
        		// min= Math.round(max/2);
        	}
        	else{
        		min=max*2;
        	}
        }

        var length = max - min;
        if (length) {
        	var tempmin = min //保证min>0的时候不会出现负数
        	min -= length * 0.05;
            // S.log(min +":"+ tempmin)
            if(min<0 && tempmin>=0){
            	min=0
            }
            max += length * 0.05;
        }
        
        var tickInterval = (max - min) * 72 / 365;
        var magnitude = Math.pow(10, Math.floor(Math.log(tickInterval) / Math.LN10));

        tickInterval = normalizeTickInterval(tickInterval, magnitude);

        var pos,
            lastPos,
            roundedMin = correctFloat(Math.floor(min / tickInterval) * tickInterval),
            roundedMax = correctFloat(Math.ceil(max / tickInterval) * tickInterval),
            tickPositions = [];

        // Populate the intermediate values
        pos = roundedMin;
        while (pos <= roundedMax) {

            // Place the tick on the rounded value
            tickPositions.push(pos);

            // Always add the raw tickInterval, not the corrected one.
            pos = correctFloat(pos + tickInterval) 

            // If the interval is not big enough in the current min - max range to actually increase
            // the loop variable, we need to break out to prevent endless loop. Issue #619
            if (pos === lastPos) {
                break;
            }

            // Record the last value
            lastPos = pos;
        }
        if(tickPositions.length >= 3){
        	if(tickPositions[tickPositions.length - 2] >= initMax){
				tickPositions.pop()
			}
        }
        return tickPositions;
    }
	
	var DataSection  = {
		
		section:function($arr,$maxPart,$cfg){
			var arr = []
			// S.log($arr)
			if($cfg && $cfg.mode == 1){
				arr = oldSection($arr,$maxPart,$cfg)	
			}else{
				arr = getLinearTickPositions($arr,$maxPart,$cfg)
				if(arr.length < 1){
					arr = oldSection($arr,$maxPart,$cfg)		
				}
			}
			
			return arr
		}
	};

	function oldSection($arr,$maxPart,$cfg){
		var _max = Math.max.apply(null,$arr)   //所有数据中最大值
		var _min = Math.min.apply(null,$arr) 
		var _count =  $arr.length               //总共有几条数据
		var _maxPart = $maxPart ? $maxPart : 9  //当前 最多有几个分段
		var arr = []
		var tmpMax = _max
		var tmpMin = 0
		var l = String(Math.ceil(_max)).length
		var scale = 1
		$cfg || ($cfg = {})
		scale = parseFloat($cfg.scale)
		if(!isNaN(scale)){
			_max *= scale
		}
		if (_max % Math.pow(10, l - 1) != 0) {
			//千位数以上 
			if (l >= 3) {
				if (parseInt(_max / Math.pow(10, l - 2)) % 2 == 0) {
					tmpMax = parseInt(_max / Math.pow(10, l - 2)) * Math.pow(10, l - 2) + 2 * Math.pow(10, l - 2)
				}else {
					tmpMax = parseInt(_max / Math.pow(10, l - 2)) * Math.pow(10, l - 2) + Math.pow(10, l - 2)
				}
			}else {
				tmpMax = parseInt(_max / Math.pow(10, l - 1) + 1) * Math.pow(10, l - 1)
			}
		}
		l = String(tmpMax).length
		if (_maxPart >= _count ) { _maxPart = _count }
		var part = _maxPart
		//十位数以上
		if (l >= 2) {
			for (var a = 1, al = tmpMax / Math.pow(10, l - 2) ; a <= al; a++ ) {
				if (tmpMax / (a *  Math.pow(10, l - 2)) == parseInt(tmpMax / (a *  Math.pow(10, l - 2)))) {
					if (tmpMax / (a *  Math.pow(10, l - 2)) <= _maxPart) {
						if (_maxPart - tmpMax / (a *  Math.pow(10, l - 2)) < part) {
							part = _maxPart - tmpMax / (a *  Math.pow(10, l - 2))
						}
					}
				}
			}
			for (var b = 0, bl = _maxPart - part; b < bl; b++ ) {
				arr[b] = tmpMax / (_maxPart - part) * (b + 1)
			}
			//个位数及小数点
		}else if (l <= 1) {
			for (var c = 1, cl = tmpMax ; c <= cl; c++ ) {
				if (tmpMax / c == parseInt(tmpMax / c)) {
					if (tmpMax / c <= _maxPart) {
						if (_maxPart - tmpMax / c < part) {
							part = _maxPart - tmpMax / c
						}
					}
				}
			}
			for (var d = 0, dl = _maxPart - part; d < dl; d++ ) {
				arr[d] = tmpMax / (_maxPart - part) * (d + 1)
			}
		}
		if (arr.length < 1) {
			arr = [0]
		}
		// arr = [10330000,10360000]
		return arr
	}

	return DataSection;

	}
);
