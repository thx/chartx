KISSY.add(function( S , xAxisBase , DataSection ){
    var xAxis = function( opt , data ){
        this.xDis = 0; //x方向一维均分长度
        xAxis.superclass.constructor.apply( this , arguments );
    };
    S.extend( xAxis , xAxisBase , {
        _initDataSection  : function( arr ){ 
            var arr = _.flatten( arr ); //Tools.getChildsArr( data.org );
            var dataSection = DataSection.section(arr);
            this._baseNumber = dataSection[0];

            if( dataSection.length == 1 ){
                //TODO;散点图中的xaxis不应该只有一个值，至少应该有个区间
                dataSection.push( 100 );
            }
            return dataSection;
        },
        /**
         *@param data 就是上面 _initDataSection计算出来的dataSection
         */
        _trimXAxis : function( data , xGraphsWidth ){
            var tmpData = [];
            this.xDis  = xGraphsWidth / (data.length-1);
            for (var a = 0, al  = data.length; a < al; a++ ) {
                var o = {
                    'content' : data[a], 
                    'x'       : this.xDis * a
                }
                tmpData.push( o );
            }
            return tmpData;
        } 
    } );

    return xAxis;
} , {
    requires : [
        "dvix/components/xaxis/xAxis",
        "dvix/utils/datasection"
    ]
});
