define(
    "chartx/chart/bar/yaxis",
    [
        "chartx/components/yaxis/yAxis"
    ],
    function( yAxisBase ){
        var yAxis = function( opt , data ){
            yAxis.superclass.constructor.apply( this , arguments );
        };
        Chartx.extend( yAxis , yAxisBase , {
            _setDataSection : function( data ){
                var arr = [];
                _.each( data.org , function( d , i ){
                    var varr = [];
                    var len  = d[0].length;
                    var vLen = d.length;
                    var min = 0;
                    for( var i = 0 ; i<len ; i++ ){
                        var count = 0;
                        for( var ii = 0 ; ii < vLen ; ii++ ){
                            count += d[ii][i];
                            min = Math.min( d[ii][i], min );
                        }
                        varr.push( count );
                    }
                    varr.push(min);
                    arr.push( varr );
                } );
                return _.flatten(arr);
            }
        } );
    
        return yAxis;
    } 
);
