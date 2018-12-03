import CoordComponents from "./polar/index"
import { _ } from "mmvis"

export default class Polar extends CoordComponents
{
    constructor( opt, app )
    {
        super( opt, app );
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
        _.each( this.app.getComponents({name:'graphs'}), function( _g ){
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
};