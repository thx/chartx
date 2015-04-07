define(
    "chartx/utils/dataformat",
    [],
    function(){
        /**
         * 把原始的数据
         * field1 field2 field3
         *   1      2      3
         *   2      3      4
         * 这样的数据格式转换为内部的
         * [{field:'field1',index:0,data:[1,2]} ......]
         * 这样的结构化数据格式。
         */
        return function( data , opt ){
    
              var dataFrame  = {    //数据框架集合
                    org        : [],   //最原始的数据  
                    data       : [],   //最原始的数据转化后的数据格式：[o,o,o] o={field:'val1',index:0,data:[1,2,3]}
                    yAxis      : {     //y轴
                        field  : [],   //字段集合 对应this.data
                        org    : []    //二维 原始数据[[100,200],[1000,2000]]
                    },
                    xAxis      : {     //x轴
                        field  : [],   //字段 对应this.data
                        org    : []    //原始数据['星期一','星期二']
                    }
                }

                if( !data || data.length == 0 ){
                    return dataFrame
                }
    
                var arr = data;
                dataFrame.org = arr;
                var fileds = arr[0] ? arr[0] : []; //所有的字段集合
    
                this.yAxis && ( dataFrame.yAxis.field = this.yAxis.field );
                this.xAxis && ( dataFrame.xAxis.field = this.xAxis.field );

                if( opt ){
                    opt.yAxis && ( dataFrame.yAxis.field , opt.yAxis.field );
                    opt.xAxis && ( dataFrame.xAxis.field , opt.xAxis.field );
                }

                var total = [];
    
                for(var a = 0, al = fileds.length; a < al; a++){
                    var o = {};
                    o.field = fileds[a];
                    o.index = a;
                    o.data  = [];
                    total.push(o);
                }
    
                for(var a = 1, al = arr.length; a < al; a++){
                    for(var b = 0, bl = arr[a].length; b < bl; b++){
                        total[b].data.push(arr[a][b]);
                    }     
                }
    
                dataFrame.data = total;
                //已经处理成[o,o,o]   o={field:'val1',index:0,data:[1,2,3]}
    
                var getDataOrg = function( $field , totalList ){
                    var arr = _.filter( totalList , function( obj ){
                        return _.some( $field , function( field ){
                            return obj.field == field;
                        } ); 
                    } );
                    //这个时候的arr只是totalList的过滤，还没有完全的按照$field 中的排序
                    var newData = [];
                    for( var i=0,l=$field.length; i<l ; i++ ){
                        for( var ii=0,iil=arr.length ; ii<iil ; ii++ ){
                             if( $field[i] == arr[ii].field ){
                                 newData.push( arr[ii].data );
                                 break;
                             }
                        }
                    }
                    return newData;
                }
    
                /*
                 * 先设置xAxis的数据
                 */
                var xField = dataFrame.xAxis.field;
                if( !xField || xField=="" || (_.isArray(xField) && (xField.length == 0 || !_.find(total , function( obj ){
                        if( _.indexOf( xField , obj.field ) >= 0 ){
                            return true;
                        } else {
                            return false;
                        }
                    }) ) ) ){
                    dataFrame.xAxis.org = [ total[0].data  ];
                    xField = dataFrame.xAxis.field = [ total[0].field ];
                } else {
                    //如果有配置好的xAxis字段
                    if( _.isString(xField) ){
                        xField = [xField];
                    }
                    dataFrame.xAxis.org = getDataOrg( xField , total );
                }
                 
                /*
                 * 然后设置对应的yAxis数据
                 */
                var yField = dataFrame.yAxis.field;
                if( !yField || yField=="" || (_.isArray(yField) && yField.length == 0) ){
                    //如果yField没有，那么就自动获取除开xField 的所有字段    
                    yField = _.difference( fileds , xField );
                } else if( _.isString( yField ) ){
                    yField = [ yField ];
                }             
                dataFrame.yAxis.field = yField;
                dataFrame.yAxis.org   = getDataOrg( yField , total );


                return dataFrame;
            }

    }
)
