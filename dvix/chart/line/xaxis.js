KISSY.add(function( S , xAxisBase ){
    var xAxis = function( opt , data ){
        xAxis.superclass.constructor.apply( this , arguments );
    };
    S.extend( xAxis , xAxisBase , {
        //覆盖xAxisBase 中的 _trimXAxis
        _trimXAxis : function( data , xGraphsWidth ){
            var max  = data.length
            var tmpData = [];

            if( max == 1 ){
                tmpData.push({
                    content : data[0],
                    x       : parseInt( xGraphsWidth / 2 )
                })
            } else {
                for (var a = 0, al  = data.length; a < al; a++ ) {
                    var o = {'content':data[a], 'x':parseInt(a / (max - 1) * xGraphsWidth)}
                    tmpData.push( o )
                }
            }
            return tmpData;
        }
    } );

    return xAxis;
} , {
    requires : [
        "dvix/components/xaxis/xAxis"
    ]
});
