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
import Canvax from "canvax"

const _ = Canvax._;

export default function( data, opt ){
    
    var dataFrame  = {        //数据框架集合
        length        : 0,
        org           : [],   //最原始的数据，一定是个行列式，因为如果发现是json格式数据，会自动转换为行列式
        data          : [],   //最原始的数据转化后的数据格式：[o,o,o] o={field:'val1',index:0,data:[1,2,3]}
        getRowData    : _getRowData,
        getFieldData  : _getFieldData,
        getDataOrg    : getDataOrg,
        fields        : [],
        range         : {
            start     : 0,
            end       : 0
        }
    };

    if( !data || data.length == 0 ){
        return dataFrame
    };

    //检测第一个数据是否为一个array, 否就是传入了一个json格式的数据
    if( data.length > 0 && !_.isArray( data[0] ) ){
        data = parse2MatrixData(data);
        dataFrame.length = data.length;
    } else {
        dataFrame.length = data.length - 1;
    };

    //设置好数据区间end值
    dataFrame.range.end = dataFrame.length - 1;
    //然后检查opts中是否有dataZoom.range
    if( opt && opt.dataZoom && opt.dataZoom.range ){
        _.extend( dataFrame.range, opt.dataZoom.range );
    };
    

    dataFrame.org = data;
    dataFrame.fields = data[0] ? data[0] : []; //所有的字段集合;

    var total = [];//已经处理成[o,o,o]   o={field:'val1',index:0,data:[1,2,3]}
    for(var a = 0, al = dataFrame.fields.length; a < al; a++){
        var o = {};
        o.field = dataFrame.fields[a];
        o.index = a;
        o.data  = [];
        total.push(o);
    };
    dataFrame.data = total;

    //填充好total的data并且把属于yAxis的设置为number
    for(var a = 1, al = data.length; a < al; a++){
        for(var b = 0, bl = data[a].length; b < bl; b++){
            
            /*
            var _val = data[a][b];
            if( !isNaN( _val ) ){
                _val = Number( _val );
            };
            */
            
            total[b].data.push( data[a][b] );
        }
    };

    //会按照$field的格式转换成对应一一对应的 org 的结构
    function getDataOrg( $field, format, totalList , lev){
        
        if( !lev ) lev = 0;

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
                newData.push( getDataOrg( $field[i], format, totalList , lev+1) );
            } else {
            
                var _fieldData = newData;
                if( !lev ){
                    _fieldData = [];
                };
                for( var ii=0,iil=arr.length ; ii<iil ; ii++ ){
                     if( $field[i] == arr[ii].field ){
                         fieldInTotal = true;
                         _fieldData.push( _format( arr[ii].data.slice( dataFrame.range.start, dataFrame.range.end+1 ) ) );
                         break;
                     }
                };
                if( !lev ){
                    newData.push( _fieldData );
                };
            };
        }
        return newData;
    };

    /*
     * 获取某一行数据
    */ 
    function _getRowData(index){
        var o = {}
        var data = dataFrame.data
        for(var a = 0; a < data.length; a++){
            o[data[a].field] = data[a].data[ dataFrame.range.start + index ]
        };
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
            return data.data.slice( dataFrame.range.start, dataFrame.range.end+1 );
        } else {
            return []
        }
    }

    return dataFrame;
}