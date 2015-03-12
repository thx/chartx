define(    
    'chartx/utils/datasection',
    [],
    function(){
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
    
        function getLinearTickPositions(arr) {
        	var scale = $cfg && $cfg.scale ? parseFloat($cfg.scale) :1
        	//返回的数组中的值 是否都为整数(思霏)  防止返回[8, 8.2, 8.4, 8.6, 8.8, 9]   应该返回[8, 9]
        	var isInt = $cfg && $cfg.isInt ? 1 : 0 
    
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
            
            var tickInterval = (max - min) * 0.3;//72 / 365;
            var magnitude = Math.pow(10, Math.floor(Math.log(tickInterval) / Math.LN10));
    
            tickInterval = normalizeTickInterval(tickInterval, magnitude);
            if(isInt){
            	tickInterval = Math.ceil(tickInterval)
            }
    
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
                return getLinearTickPositions($arr,$maxPart,$cfg)
    		}
    	};
    
    	return DataSection;
    
	}
);
