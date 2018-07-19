import Chart from "../../chart"
import Canvax from "canvax"

const _ = Canvax._;

/**
 * 所有坐标系的基类，一些坐标系中复用的代码，沉淀在这里
 * 空坐标系，一些非直角坐标系，极坐标系的图表，就会直接创建一个空坐标系图表，然后添加组件
 */
export default class Coord extends Chart
{
    constructor( node, data, opts, graphsMap, componentsMap )
    {
        super( node, data, opts );
        this.graphsMap = graphsMap;
        this.componentsMap = componentsMap;

        this._graphs = [];
        if( opts.graphs ){
            opts.graphs = _.flatten( [ opts.graphs ] );
        };

        _.extend(true, this, this.setDefaultOpts( opts ));
        
        //这里不要直接用data，而要用 this._data
        this.dataFrame = this.initData( this._data );

        //this.draw();
        this._tipsPointer = null;
    }

    setDefaultOpts( opts ){
        return opts;
    }

    //覆盖基类中得draw，和基类的draw唯一不同的是，descartes 会有 drawEndHorizontal 的操作
    draw( opts )
    {
        if( this._opts.theme ){
            //如果用户有配置皮肤组件，优先级最高
            //皮肤就是一组颜色

            //假如用户就只传了一个颜色值
            if( !_.isArray( this._opts.theme ) ){
                this._opts.theme = [this._opts.theme];
            };
            
            var _theme = new this.componentsMap.theme( this._opts.theme, this );
            this._theme = _theme.get(); //如果用户有设置图表皮肤组件，那么就全部用用户自己设置的，不再用下面的merge
            //this._theme = _theme.mergeTo( this._theme );
        };
        this.initModule( opts );     //初始化模块  
        this.initComponents( opts ); //初始化组件, 来自己chart.js模块

        if( this._coord && this._coord.horizontal ){
            this.drawBeginHorizontal && this.drawBeginHorizontal();
        };

        this.startDraw( opts );      //开始绘图
        this.drawComponents( opts ); //绘图完，开始绘制插件，来自己chart.js模块

        if( this._coord && this._coord.horizontal ){
            this.drawEndHorizontal && this.drawEndHorizontal();
        };

        this.inited = true;
    }

    initModule(opts)
    {
        var me = this
        //首先是创建一个坐标系对象
        if( this.CoordComponents ){
            this._coord = new this.CoordComponents( this.coord, this );
            this.coordSprite.addChild( this._coord.sprite );
        };

        _.each( this.graphs , function( graphs ){
            var _g = new me.graphsMap[ graphs.type ]( graphs, me );
            me._graphs.push( _g );
            me.graphsSprite.addChild( _g.sprite );
        } );
    }

    startDraw(opts)
    {
        var me = this;
        !opts && (opts ={});
        var _coord = this._coord;

        var width = this.width - this.padding.left - this.padding.right;
        var height = this.height - this.padding.top - this.padding.bottom;
        var origin = { x : this.padding.left,y : this.padding.top }

        if( this._coord ){
            //先绘制好坐标系统
            this._coord.draw( opts );
            width = this._coord.width;
            height = this._coord.height;
            origin = this._coord.origin;
        };

        if( this.dataFrame.length == 0 ){
            //如果没有数据，不需要绘制graphs
            me.fire("complete");
            return;
        };
    
        var graphsCount = this._graphs.length;
        var completeNum = 0;
        _.each( this._graphs, function( _g ){
            _g.on( "complete", function(g) {
                completeNum ++;
                if( completeNum == graphsCount ){
                    me.fire("complete");
                }
                _g.inited = true;
            });
            
            _g.draw({
                width  : width,
                height : height,
                origin : origin,
                inited : me.inited,
                resize : opts.trigger == "resize"
            });

        } );

        this.bindEvent();
    }

    //reset之前是应该已经 merge过了 opt ，  和准备好了dataFrame
    _resetData( dataTrigger )
    {
        var me = this;
        if( this._coord ){
            this._coord.resetData( this.dataFrame , dataTrigger);
        };
        
        _.each( this._graphs, function( _g ){
            _g.resetData( me.dataFrame , dataTrigger);
        } );

        this.componentsReset( dataTrigger );
    }


    //tips组件
    _init_components_tips ()
    {
        //所有的tips放在一个单独的tips中
		this.stageTips = new Canvax.Display.Stage({
		    id: "main-chart-stage-tips"
		});
        this.canvax.addChild( this.stageTips );

        var _tips = new this.componentsMap.tips(this.tips, this.canvax.domView, this.dataFrame, this._coord);
        this.stageTips.addChild(_tips.sprite);
        this.components.push({
            type : "tips",
            id : "tips",
            plug : _tips
        });
    }

    //添加水印
    _init_components_watermark( waterMarkOpt )
    {
        var _water = new this.componentsMap.waterMark( waterMarkOpt, this );
        this.stage.addChild( _water.spripte );
    }

    //设置图例 begin
    _init_components_legend( e )
    {
        !e && (e={});
        var me = this;
        //设置legendOpt
        var legendOpt = _.extend(true, {
            icon : {
                onChecked : function( obj ){
                    me.show( obj.name , obj );
                    me.componentsReset({ name : "legend" });
                },
                onUnChecked : function( obj ){
                    me.hide( obj.name , obj );
                    me.componentsReset({ name : "legend" });
                }
            }
        } , me._opts.legend);

        var legendData = me._opts.legend.data;
        if( legendData ){
            _.each( legendData, function( item, i ){
                item.enabled = true;
                item.ind = i;
            } );
            delete me._opts.legend.data;
        } else {
            legendData = me._getLegendData();
        }
        
        var _legend = new me.componentsMap.legend( legendData, legendOpt, this );
    
        if( _legend.layoutType == "h" ){
            me.padding[ _legend.position ] += _legend.height;
        } else {
            me.padding[ _legend.position ] += _legend.width;
        };

        if( me._coord && me._coord.type == "descartes" ){
            if( _legend.position == "top" || _legend.position == "bottom" ){
                this.components.push( {
                    type : "once",
                    plug : {
                        draw : function(){
                            _legend.pos( { 
                                x : me._coord.origin.x + 5
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
            pos.y = me.padding.top - _legend.height;
        };
        if( _legend.position == "bottom" ){
            pos.x = me.padding.left;
            pos.y = me.height - me.padding.bottom;
        };

        _legend.pos( pos );

        this.components.push( {
            type : "legend",
            plug : _legend
        } );

        me.stage.addChild( _legend.sprite );
    }


    show( field , legendData)
    {
        var me = this;
        this._coord.addField( field , legendData);
        _.each( this._graphs, function( _g ){
            _g.show( field , legendData);
        } );
    }

    hide( field , legendData)
    {
        var me = this;
        this._coord.removeField( field , legendData );
        _.each( this._graphs, function( _g ){
            _g.hide( field , legendData );
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
                me._tipsPointerShow( e, _tips, me._coord );
                me._tipsPointerAtAllGraphs( e );
            };
        });
        this.on("panmove mousemove", function(e) {
            var _tips = me.getComponentById("tips");
            if ( _tips ) {
                me.setTipsInfo.apply(me, [e]);
                _tips.move(e);
                me._tipsPointerMove( e, _tips, me._coord );
                me._tipsPointerAtAllGraphs( e );
            };
        });
        this.on("panend mouseout", function(e) {
            //如果e.toTarget有货，但是其实这个point还是在induce 的范围内的
            //那么就不要执行hide，顶多只显示这个点得tips数据
            var _tips = me.getComponentById("tips");
            if ( _tips && !( e.toTarget && me._coord && me._coord.induce && me._coord.induce.containsPoint( me._coord.induce.globalToLocal(e.target.localToGlobal(e.point) )) )) {
                _tips.hide(e);
                me._tipsPointerHide( e, _tips, me._coord );
                me._tipsPointerHideAtAllGraphs( e );
            };
        });
        this.on("tap", function(e) {
            var _tips = me.getComponentById("tips");
            if ( _tips ) {
                _tips.hide(e);
                me.setTipsInfo.apply(me, [e]);
                _tips.show(e);
                me._tipsPointerShow( e, _tips, me._coord );
                me._tipsPointerAtAllGraphs( e );
            };
        });
    }

    //默认的基本tipsinfo处理，极坐标和笛卡尔坐标系统会覆盖
    setTipsInfo(e)
    {
        if( !e.eventInfo.nodes || !e.eventInfo.nodes.length ){
            var nodes = [];
            _.each( this._graphs, function( _g ){
                nodes = nodes.concat( _g.getNodesAt( e ) );
            } );
            e.eventInfo.nodes = nodes;
        }
    }

    _tipsPointerShow( e, _tips, _coord )
    {   
    }

    _tipsPointerHide( e, _tips, _coord )
    {
    }

    _tipsPointerMove( e, _tips, _coord )
    {   
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