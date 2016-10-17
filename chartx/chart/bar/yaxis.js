define(
    "chartx/chart/bar/yaxis",
    [
        "canvax/index",
        "chartx/components/yaxis/yAxis"
    ],
    function( Canvax , yAxisBase ){
        var yAxis = function( opt , data , data1){
            yAxis.superclass.constructor.apply( this , [ ( opt.bar ? opt.bar : opt ) , data , data1 ] );
        };
        Chartx.extend( yAxis , yAxisBase , {
            _setDataSection : function( data , data1 ){
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
                    };
                    varr.push(min);
                    arr.push( varr );
                } );
                if( !data1 ){
                    data1 = [];
                }
                return _.flatten(arr).concat( data1 );
            }
        } );
    
        return yAxis;
    } 
);
