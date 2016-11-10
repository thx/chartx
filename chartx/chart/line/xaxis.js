define(
    "chartx/chart/line/xaxis",
    [
        "chartx/components/xaxis/xAxis"
    ],
    function( xAxisBase ){
        var xAxis = function( opt , data ){
            xAxis.superclass.constructor.apply( this , arguments );
        };
        Chartx.extend( xAxis , xAxisBase , {
            //覆盖xAxisBase 中的 _trimXAxis
            _trimXAxis : function( data , xGraphsWidth ){
                var max  = data.length
                var tmpData = [];
    
                if( max == 1 ){
                    tmpData.push({
                        content : data[0],
                        x       : parseInt( xGraphsWidth / 2 )
                    });
                } else {
                    for (var a = 0, al  = data.length; a < al; a++ ) {
                        //默认string类型的情况下是均分
                        var x = parseInt(a / (max - 1) * xGraphsWidth);

                        if( this.valType == "number" ){
                            //nam 刻度的x要根据 maxVal - minVal 来计算
                            x = xGraphsWidth * ( (data[a] - this.minVal) / (this.maxVal - this.minVal) );
                        };

                        var o = {
                            'content':data[a], 
                            'x': x
                        }
                        tmpData.push( o )
                    }
                }
                return tmpData;
            }
        } );
    
        return xAxis;
    }
);
