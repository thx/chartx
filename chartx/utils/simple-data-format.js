/**
* 把原始的数据
* field1 field2 field3
*   1      2      3
*   2      3      4
* 这样的数据格式转换为内部的
* {
* field1 : [1,2],
* field2 : [2,3],
* field3 : [3,4]
* }
* 这样的结构化数据格式。
*/
define(
    "chartx/utils/simple-data-format",
    [
        "chartx/utils/tools"
    ],
    function( Tools ){
        return function( data, opt ){

            var dataFrame  = {    //数据框架集合
                org        : [],   //最原始的数据 
                data       : {},
                fields     : []
            };

            if( !data || data.length == 0 ){
                return dataFrame
            };

            //检测第一个数据是否为一个array, 否就是传入了一个json格式的数据
            if( data.length > 0 && !_.isArray( data[0] ) ){
                data = Tools.json2MatrixData(data);
            };

            dataFrame.org  = _.clone(data);

            var titles = data.shift(0);

            _.each( titles , function(key , i){
                var arr = [];
                _.each(data , function(row){
                    arr.push( row[i] );
                });
                dataFrame.data[key] = arr;
            } );

            var arr = []
            if(opt && opt.field){
                arr = opt.field
            } else {
                arr = titles
            }
            
            dataFrame.fields = arr
            return dataFrame;
        }
    }
);
