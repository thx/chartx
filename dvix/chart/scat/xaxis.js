KISSY.add(function( S , xAxisBase ){
    var xAxis = function( opt , data ){
        this.xDis1 = 0; //x方向一维均分长度
        xAxis.superclass.constructor.apply( this , arguments );
    };
    S.extend( xAxis , xAxisBase , {
        _trimXAxis:function( data , xGraphsWidth ){
            var tmpData = [];
            this.xDis1  = xGraphsWidth / data.length;
            for (var a = 0, al  = data.length; a < al; a++ ) {
                var o = {
                    'content' : data[a], 
                    'x'       : this.xDis1 * (a+1) - this.xDis1/2
                }
                tmpData.push( o );
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
