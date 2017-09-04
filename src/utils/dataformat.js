/**
* 把原始的数据
* field1 field2 field3
*   1      2      3
*   2      3      4
* 这样的数据格式转换为内部的
* [{field:'field1',index:0,data:[1,2]} ......]
* 这样的结构化数据格式。
*/

import {parse2MatrixData} from "./tools"
import _ from "underscore"

export default function( data , opt ){
            
    var dataFrame  = {    //数据框架集合
        org        : [],   //最原始的数据  
        data       : [],   //最原始的数据转化后的数据格式：[o,o,o] o={field:'val1',index:0,data:[1,2,3]}
        
        //后续dataFrame不在默认设置yAxis,xAxis,rAxis 这几个对象

        yAxis      : {     //y轴
            field  : null, //[],   //字段集合 对应this.data
            org    : []    //二维 原始数据[[100,200],[1000,2000]]
        },
        xAxis      : {     //x轴
            field  : [],   //字段 对应this.data
            org    : []    //原始数据['星期一','星期二']
        },
        rAxis      : {     //z轴
            field  : [],   //字段 对应this.data
            org    : []    //原始数据['星期一','星期二']
        },

        getRowData : _getRowData,
        getFieldData: _getFieldData,
        getDataOrg : getDataOrg
    }

    if( !data || data.length == 0 ){
        return dataFrame
    };

    //检测第一个数据是否为一个array, 否就是传入了一个json格式的数据
    if( data.length > 0 && !_.isArray( data[0] ) ){
        data = Tools.parse2MatrixData(data);
    };

    var arr = data;
    dataFrame.org = arr;
    var fileds = arr[0] ? arr[0] : []; //所有的字段集合

    var _coordinate;
    if( opt ){
        _coordinate = opt;
        if( opt.coordinate ){
            _coordinate = opt.coordinate
        }
        _coordinate.yAxis  && ( dataFrame.yAxis.field = _coordinate.yAxis.field );
        _coordinate.xAxis  && ( dataFrame.xAxis.field = _coordinate.xAxis.field );
        _coordinate.rAxis  && ( dataFrame.rAxis.field = _coordinate.rAxis.field );

    } else {
        this.yAxis && ( dataFrame.yAxis.field = this.yAxis.field );
        this.xAxis && ( dataFrame.xAxis.field = this.xAxis.field );
        this.rAxis && ( dataFrame.rAxis.field = this.rAxis.field );
    }

    var total = [];

    for(var a = 0, al = fileds.length; a < al; a++){
        var o = {};
        o.field = fileds[a];
        o.index = a;
        o.data  = [];
        total.push(o);
    }


    dataFrame.data = total;

    //已经处理成[o,o,o]   o={field:'val1',index:0,data:[1,2,3]}

    function getDataOrg( $field, format, totalList ){
        
        var arr = totalList || total;
        if( !arr ){
            return;
        }
        if( !format ){
            format = function( e ){ return e }
        };

        function _format( data ){
            for( var i=0,l=data.length; i<l; i++ ){
                data[i] = format( data[i] );
            };
            return data;
        };

        if( !_.isArray($field) ){
            $field = [$field];
        };

        //这个时候的arr只是totalList的过滤，还没有完全的按照$field 中的排序
        var newData = [];
        for( var i=0,l=$field.length; i<l ; i++ ){
            var fieldInTotal = false; //如果该field在数据里面根本没有，那么就说明是无效的field配置
            if( _.isArray($field[i]) ){
                newData.push( getDataOrg( $field[i], format, totalList ) );
            } else {
                for( var ii=0,iil=arr.length ; ii<iil ; ii++ ){
                     if( $field[i] == arr[ii].field ){
                         fieldInTotal = true;
                         newData.push( _format(arr[ii].data) );
                         break;
                     }
                }
                //干掉无效的field配置
                if( !fieldInTotal ){
                    $field.splice( i , 1 );
                    i--;
                    l--;
                };
            };
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
        xField = dataFrame.xAxis.field = [ total[0].field ];
    } else {
        //如果有配置好的xAxis字段
        if( _.isString(xField) ){
            xField = [xField];
        }
    }
     
    /*
     * 然后设置对应的yAxis数据
     */
    var yField = dataFrame.yAxis.field;
    if( yField == "" || (_.isArray(yField) && yField.length == 0) ){
        yField = [];
    } else if( !yField ){
        //如果yField没有，那么就自动获取除开xField 的所有字段    
        yField = _.difference( fileds , xField );
    } else if( _.isString( yField ) ){
        yField = [ yField ];
    };             
    dataFrame.yAxis.field = yField;


    //填充好total的data并且把属于yAxis的设置为number
    for(var a = 1, al = arr.length; a < al; a++){
        for(var b = 0, bl = arr[a].length; b < bl; b++){
            total[b].data.push( arr[a][b] );
        }
    };

    dataFrame.xAxis.org = getDataOrg( xField );
    dataFrame.yAxis.org = getDataOrg( yField , function( val ){
        if( val === undefined || val === null || val === "" ){
            return val;
        }
        return (isNaN(Number( val )) ? val : Number( val ))
    });

    /*
     * 然后设置对应的rAxis数据
     */
    var zField = dataFrame.rAxis.field;
    if( _.isString( zField ) ){
        zField = [ zField ];
    }             
    dataFrame.rAxis.field = zField;
    var allZFields = _.flatten(dataFrame.rAxis.field);
    if( allZFields.length > 0 ){
        dataFrame.rAxis.org = getDataOrg( zField );
    };

    /*
     * 获取一行数据
    */ 
    function _getRowData(index){
        var o = {}
        var data = dataFrame.data
        for(var a = 0, al = data.length; a < al; a++){
            if(data[a]){
                o[data[a].field] = data[a].data[index]
            }
        }
        return o
    }

    function _getFieldData( field ){
        var data;
        _.each( dataFrame.data , function( d ){
            if( d.field == field ){
                data = d;
            }
        } ); 
        if( data ){
            return data.data;
        } else {
            return [] 
        }
    }

    return dataFrame;
};