import CoordComponents from "./rect/index"
import { _ } from "mmvis"

export default class Rect extends CoordComponents
{
    constructor( opt, app ){
        super( opt, app );
    }

    
    static setDefaultOpt( opt )
    {
        
        var coord = {
            xAxis : {
                //波峰波谷布局模型，默认是柱状图的，折线图种需要做覆盖
                layoutType    : "rule", //"peak",  
                //默认为false，x轴的计量是否需要取整， 这样 比如某些情况下得柱状图的柱子间隔才均匀。
                //比如一像素间隔的柱状图，如果需要精确的绘制出来每个柱子的间距是1px， 就必须要把这里设置为true
                posParseToInt : false
            }
        };

        //opt = _.clone( opt );
        if( opt.coord.yAxis ){
            var _nyarr = [];
            //TODO: 因为我们的deep extend 对于数组是整个对象引用过去，所以，这里需要
            //把每个子元素单独clone一遍，恩恩恩， 在canvax中优化extend对于array的处理
            _.each( _.flatten([opt.coord.yAxis]) , function( yopt ){
                _nyarr.push( _.clone( yopt ) );
            } );
            opt.coord.yAxis = _nyarr;
        } else {
            opt.coord.yAxis = [];
        }

        //根据opt中得Graphs配置，来设置 coord.yAxis
        if( opt.graphs ){

            opt.graphs = _.flatten( [opt.graphs] );
            
            //有graphs的就要用找到这个graphs.field来设置coord.yAxis
            for( var i=0; i<opt.graphs.length; i++ ){
                var graphs = opt.graphs[i];
                if( graphs.type == "bar" ){
                    //如果graphs里面有柱状图，那么就整个xAxis都强制使用 peak 的layoutType
                    coord.xAxis.layoutType = "peak";
                }
                if( graphs.field ){
                    //没有配置field的话就不绘制这个 graphs了
                    var align = "left"; //默认left
                    if( graphs.yAxisAlign == "right" ){
                        align = "right";
                    };

                    var optsYaxisObj = null;
                    optsYaxisObj = _.find( opt.coord.yAxis, function( obj, i ){
                        return obj.align == align || ( !obj.align && i == ( align == "left" ? 0 : 1 ));
                    } );
    
                    if( !optsYaxisObj ){
                        optsYaxisObj = {
                            align : align,
                            field : []
                        }
                        opt.coord.yAxis.push( optsYaxisObj );
                    } else {
                        if( !optsYaxisObj.align ){
                            optsYaxisObj.align = align;
                        }
                    }

                    if( !optsYaxisObj.field ){
                        optsYaxisObj.field = [];
                    } else {
                        if( !_.isArray( optsYaxisObj.field ) ){
                            optsYaxisObj.field = [ optsYaxisObj.field ];
                        }
                    }

                    if( _.isArray( graphs.field ) ){
                        optsYaxisObj.field = optsYaxisObj.field.concat( graphs.field )
                    } else {
                        optsYaxisObj.field.push( graphs.field )
                    }
                        
                } else {
                    //在，直角坐标系中，每个graphs一定要有一个field设置，如果没有，就去掉这个graphs
                    opt.graphs.splice(i--,1);
                }
            }

        };
        //再梳理一遍yAxis，get没有align的手动配置上align
        //要手动把yAxis 按照 left , right的顺序做次排序
        var _lys=[],_rys=[];
        _.each( opt.coord.yAxis , function( yAxis , i ){
            if( !yAxis.align ){
                yAxis.align = i ?"right": "left";
            }
            if( yAxis.align == "left" ){
                _lys.push( yAxis );
            } else {
                _rys.push( yAxis );
            }
        } );
        opt.coord.yAxis = _lys.concat( _rys );

        opt.coord = _.extend( true, coord, opt.coord );
        
        return opt;
    }
}