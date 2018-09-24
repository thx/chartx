import CoordBase from "./index"
import Canvax from "canvax"
import {parse2MatrixData} from "../../utils/tools"
import DataFrame from "../../utils/dataframe"
import CoordComponents from "./ui_rect/index"

const _ = Canvax._;

export default class Rect extends CoordBase
{
    constructor( node, data, opts, graphsMap, componentsMap ){

        super( node, data, opts, graphsMap, componentsMap );
        //坐标系统
        this.CoordComponents = CoordComponents;
        this._coord = null;
    }

    //设置这个坐标系下面特有的 opts 默认值
    //以及往this上面写部分默认数据
    //在CoordBase中被调用
    setDefaultOpts( opts )
    {
        var me = this;
        me.coord = {
            xAxis : {
                //波峰波谷布局模型，默认是柱状图的，折线图种需要做覆盖
                layoutType    : "rule", //"peak",  
                //默认为false，x轴的计量是否需要取整， 这样 比如某些情况下得柱状图的柱子间隔才均匀。
                //比如一像素间隔的柱状图，如果需要精确的绘制出来每个柱子的间距是1px， 就必须要把这里设置为true
                posParseToInt : false
            }
        };

        opts = _.clone( opts );
        if( opts.coord.yAxis ){
            var _nyarr = [];
            //TODO: 因为我们的deep extend 对于数组是整个对象引用过去，所以，这里需要
            //把每个子元素单独clone一遍，恩恩恩， 在canvax中优化extend对于array的处理
            _.each( _.flatten([opts.coord.yAxis]) , function( yopt ){
                _nyarr.push( _.clone( yopt ) );
            } );
            opts.coord.yAxis = _nyarr;
        } else {
            opts.coord.yAxis = [];
        }

        //根据opt中得Graphs配置，来设置 coord.yAxis
        if( opts.graphs ){
            //有graphs的就要用找到这个graphs.field来设置coord.yAxis
            for( var i=0; i<opts.graphs.length; i++ ){
                var graphs = opts.graphs[i];
                if( graphs.type == "bar" ){
                    //如果graphs里面有柱状图，那么就整个xAxis都强制使用 peak 的layoutType
                    me.coord.xAxis.layoutType = "peak";
                }
                if( graphs.field ){
                    //没有配置field的话就不绘制这个 graphs了
                    var align = "left"; //默认left
                    if( graphs.yAxisAlign == "right" ){
                        align = "right";
                    };

                    var optsYaxisObj = null;
                    optsYaxisObj = _.find( opts.coord.yAxis, function( obj, i ){
                        return obj.align == align || ( !obj.align && i == ( align == "left" ? 0 : 1 ));
                    } );
    
                    if( !optsYaxisObj ){
                        optsYaxisObj = {
                            align : align,
                            field : []
                        }
                        opts.coord.yAxis.push( optsYaxisObj );
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
                    opts.graphs.splice(i--,1);
                }
            }

        };
        //再梳理一遍yAxis，get没有align的手动配置上align
        //要手动把yAxis 按照 left , right的顺序做次排序
        var _lys=[],_rys=[];
        _.each( opts.coord.yAxis , function( yAxis , i ){
            if( !yAxis.align ){
                yAxis.align = i ?"right": "left";
            }
            if( yAxis.align == "left" ){
                _lys.push( yAxis );
            } else {
                _rys.push( yAxis );
            }
        } );
        opts.coord.yAxis = _lys.concat( _rys );
        
        return opts;
    }

    drawBeginHorizontal()
    {
        //横向了之后， 要把4个padding值轮换一下
        //top,right 对调 ， bottom,left 对调
        var padding = this.padding;
        
        var num = padding.top;
        padding.top = padding.right;
        padding.right = padding.bottom;
        padding.bottom = padding.left;
        padding.left = num;

    }
    drawGraphsEnd()
    {
        this._coord.drawGraphsEnd();
    }

    //绘制完毕后的横向处理
    drawEndHorizontal() 
    {
        var me = this;

        var ctx = me.graphsSprite.context;
        ctx.x += ((me.width - me.height) / 2);
        ctx.y += ((me.height - me.width) / 2);
        ctx.rotation = 90;
        ctx.rotateOrigin = { x : me.height/2, y : me.width/2 };
        
        function _horizontalText( el ){
            
            if( el.children ){
                _.each( el.children, function( _el ){
                    _horizontalText( _el );
                } )
            };
            if( el.type == "text" ){
                
                var ctx = el.context;
                var w = ctx.width;
                var h = ctx.height;

                ctx.rotation = ctx.rotation - 90;
                
            };
        }

        _.each(me._graphs, function( _graphs ) {
            _horizontalText( _graphs.sprite );
        });
    }

    //只有field为多组数据的时候才需要legend，给到legend组件来调用
    getLegendData()
    {
        var me   = this;
        var data = [];
        
        _.each( _.flatten(me._coord.fieldsMap) , function( map , i ){
            //因为yAxis上面是可以单独自己配置field的，所以，这部分要过滤出 legend data
            var isGraphsField = false;
            _.each( me.graphs, function( gopt ){
                if( _.indexOf( _.flatten([ gopt.field ]), map.field ) > -1 ){
                    isGraphsField = true;
                    return false;
                }
            } );

            if( isGraphsField ){
                data.push( {
                    enabled : map.enabled,
                    name    : map.field,
                    field   : map.field,
                    ind     : map.ind,
                    color   : map.color,
                    yAxis   : map.yAxis
                } );
            }
        });
        return data;
    }
    ////设置图例end

    //把这个点位置对应的x轴数据和y轴数据存到 tips 的 info 里面
    //方便外部自定义 tip 是的 content
    setTipsInfo(e)
    {
        
        e.eventInfo = this._coord.getTipsInfoHandler(e);

        //如果具体的e事件对象中有设置好了得 e.eventInfo.nodes，那么就不再遍历_graphs去取值
        //比如鼠标移动到多柱子组合的具体某根bar上面，e.eventInfo.nodes = [ {bardata} ] 就有了这个bar的数据
        //那么tips就只显示这个bardata的数据
        if( !e.eventInfo.nodes || !e.eventInfo.nodes.length ){
            var nodes = [];
            var iNode = e.eventInfo.xAxis.ind;
            _.each( this._graphs, function( _g ){
                nodes = nodes.concat( _g.getNodesAt( iNode ) );
            } );
            e.eventInfo.nodes = nodes;
        }

    }


}