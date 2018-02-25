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

    /*
     *添加一个yAxis字段，也就是添加一条brokenline折线
     *@params field 添加的字段
     **/
    add( field )
    {
        var me = this;
        this._coordinate.addField( field );
        _.each( this._graphs, function( _g ){
            _g.add( field );
        } );
    }

    remove( field )
    {
        var me = this;
        this._coordinate.removeField( field );
        _.each( this._graphs, function( _g ){
            _g.remove( field );
        } );
    }

    //坐标系图表的集中事件绑定处理
    bindEvent()
    {
        var me = this;
        this.on("panstart mouseover", function(e) {
            var _tips = me.getComponentById("tips");
            if ( _tips ) {
                me.setTipsInfo.apply(me, [e]);
                _tips.show(e);
                me._tipsPointerShow( e, _tips, me._coordinate );
                me._tipsPointerAtAllGraphs( e );
            };
        });
        this.on("panmove mousemove", function(e) {
            var _tips = me.getComponentById("tips");
            if ( _tips ) {
                me.setTipsInfo.apply(me, [e]);
                _tips.move(e);
                me._tipsPointerMove( e, _tips, me._coordinate );
                me._tipsPointerAtAllGraphs( e );
            };
        });
        this.on("panend mouseout", function(e) {
            //如果e.toTarget有货，但是其实这个point还是在induce 的范围内的
            //那么就不要执行hide，顶多只显示这个点得tips数据
            var _tips = me.getComponentById("tips");
            if ( _tips && !( e.toTarget && me._coordinate.induce && me._coordinate.induce.containsPoint( me._coordinate.induce.globalToLocal(e.target.localToGlobal(e.point) )) )) {
                _tips.hide(e);
                me._tipsPointerHide( e, _tips, me._coordinate );
                me._tipsPointerHideAtAllGraphs( e );
            };
        });
        this.on("tap", function(e) {
            var _tips = me.getComponentById("tips");
            if ( _tips ) {
                _tips.hide(e);
                me.setTipsInfo.apply(me, [e]);
                _tips.show(e);
                me._tipsPointerShow( e, _tips, me._coordinate );
                me._tipsPointerAtAllGraphs( e );
            };
        });
    }

    _tipsPointerAtAllGraphs( e )
    {
        _.each( this._graphs, function( _g ){
            _g.tipsPointerOf( e );
        });
    }

    _tipsPointerHideAtAllGraphs( e )
    {
        _.each( this._graphs, function( _g ){
            _g.tipsPointerHideOf( e );
        });
    }

}