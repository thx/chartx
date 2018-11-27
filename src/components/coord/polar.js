import CoordBase from "./index"
import CoordComponents from "./polar/index"
import { _ } from "mmvis"

export default class Polar extends CoordBase
{
    constructor( node, data, opt, componentModules )
    {
        super( node, data, opt, componentModules );

        //坐标系统
        this.CoordComponents = CoordComponents;
        this._coord = null;

    }

    //设置这个坐标系下面特有的 opt 默认值
    //以及往this上面写部分默认数据
    //在CoordBase中被调用
    static setDefaultOpt( opt )
    {
      
        var coord = {
            rAxis : {
                field : []
            }
        };

        //根据graphs.field 来 配置 coord.rAxis.field -------------------
        if( !_.isArray( coord.rAxis.field ) ){
            coord.rAxis.field = [ coord.rAxis.field ];
        };
        if( opt.graphs ){
            //有graphs的就要用找到这个graphs.field来设置coord.rAxis
            var arrs = [];
            _.each( opt.graphs, function( graphs ){
                if( graphs.field ){
                    //没有配置field的话就不绘制这个 graphs了
                    var _fs = graphs.field;
                    if( !_.isArray( _fs ) ){
                        _fs = [ _fs ];
                    };
                    arrs = arrs.concat( _fs );
                };
            } );
        };
        coord.rAxis.field = coord.rAxis.field.concat( arrs );

        opt.coord = _.extend( true, coord, opt.coord );

        return opt
    }

    getLegendData()
    {
        var legendData = [
            //{name: "uv", style: "#ff8533", enabled: true, ind: 0}
        ];
        _.each( this._graphs, function( _g ){
            _.each( _g.getLegendData(), function( item ){
                
                if( _.find( legendData , function( d ){
                    return d.name == item.name
                } ) ) return;

                var data = _.extend(true, {}, item);
                data.color = item.fillStyle || item.color || item.style;

                legendData.push( data )
            } );
        } );
        return legendData;
    }

    //把这个点位置对应的x轴数据和y轴数据存到tips的info里面
    //方便外部自定义tip是的content
    setTipsInfo(e)
    {
        e.eventInfo = this._coord.getTipsInfoHandler(e);
        //如果具体的e事件对象中有设置好了得e.eventInfo.nodes，那么就不再遍历_graphs去取值
        if( !e.eventInfo.nodes || !e.eventInfo.nodes.length ){
            var nodes = [];
            var iNode = e.eventInfo.aAxis.ind;
            _.each( this._graphs, function( _g ){
                nodes = nodes.concat( _g.getNodesAt( iNode ) );
            } );
            e.eventInfo.nodes = nodes;
        };
    }
};