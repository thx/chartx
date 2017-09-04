import yAxisBase from "../../components/yaxis/index"
import _ from "underscore"

export default class yAxis extends yAxisBase
{
	constructor(opt , data)
	{
		super(( opt.bar ? opt.bar : opt ) , data );
	}

	_setDataSection( data )
	{
        var arr = [];
        var min;
        _.each( data.org , function( d , i ){
            if( !d.length ){
                return
            };

            //有数据的情况下 
            if( !_.isArray(d[0]) ){
                arr.push( d );
                return;
            };
            
            var varr = [];
            var len  = d[0].length;
            var vLen = d.length;
            
            for( var i = 0 ; i<len ; i++ ){
                var up_count = 0;
                var up_i = 0;

                var down_count = 0;
                var down_i = 0;

                for( var ii = 0 ; ii < vLen ; ii++ ){
                    !min && ( min = d[ii][i] )
                    min = Math.min( min, d[ii][i] );

                    if( d[ii][i] >=0 ){
                        up_count += d[ii][i];
                        up_i++
                    } else {
                        down_count += d[ii][i];
                        down_i ++
                    }
                }
                up_i && varr.push( up_count );
                down_i && varr.push( down_count );
            };
            arr.push( varr );
        } );
        arr.push( min );
        return _.flatten(arr);
    }
};
