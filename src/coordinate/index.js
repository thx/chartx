import Chart from "../chart"
import Canvax from "canvax2d"

const _ = Canvax._;

/**
 * 所有坐标系的基类，一些坐标系中复用的代码，沉淀在这里
 */

export default class Coordinate extends Chart
{
    constructor( node, data, opts, graphsMap, componentsMap )
    {
        super( node, data, opts );
    }

    //设置图例 begin
    _init_components_legend( e )
    {
        !e && (e={});
        var me = this;
        //设置legendOpt
        var legendOpt = _.extend(true, {
            onChecked : function( name ){
                me.add( name );
                me.componentsReset({ name : "legend" });
            },
            onUnChecked : function( name ){
                me.remove( name );
                me.componentsReset({ name : "legend" });
            }
        } , me._opts.legend);
        
        var _legend = new me.componentsMap.legend( me._getLegendData(), legendOpt, this );
    
        if( _legend.layoutType == "h" ){
            me.padding[ _legend.position ] += _legend.height;
        } else {
            me.padding[ _legend.position ] += _legend.width;
        };

        if( me._coordinate && me._coordinate.type == "descartes" ){
            if( _legend.position == "top" || _legend.position == "bottom" ){
                this.components.push( {
                    type : "once",
                    plug : {
                        draw : function(){
                            _legend.pos( { 
                                x : me._coordinate.origin.x + 5
                            } );
                        }
                    }
                } );
            }
        }
        
        //default right
        var pos = {
            x : me.width - me.padding.right,
            y : me.padding.top
        };
        if( _legend.position == "left" ){
            pos.x = me.padding.left - _legend.width;
        };
        if( _legend.position == "top" ){
            pos.x = me.padding.left;
            pos.y = me.padding.top - _legend.height*1.25;
        };
        if( _legend.position == "bottom" ){
            pos.x = me.padding.left;
            pos.y = me.height - me.padding.bottom*0.8;
        };

        _legend.pos( pos );

        this.components.push( {
            type : "legend",
            plug : _legend
        } );
        me.stage.addChild( _legend.sprite );
    }
}