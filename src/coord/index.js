import Chart from "../chart"
import Canvax from "canvax2d"

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
    }

    //覆盖基类中得draw，和基类的draw唯一不同的是，descartes 会有 _horizontal 的操作
    draw( opts )
    {
        this.initModule( opts );     //初始化模块  
        this.initComponents( opts ); //初始化组件, 来自己chart.js模块
        this.startDraw( opts );      //开始绘图
        this.drawComponents( opts ); //绘图完，开始绘制插件，来自己chart.js模块

        if( this._coord && this._coord.horizontal ){
            this._horizontal();
        };

        this.inited = true;
    }

    initModule(opt)
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

    startDraw(opt)
    {
        var me = this;
        !opt && (opt ={});
        var _coord = this._coord;

        var width = this.width - this.padding.left - this.padding.right;
        var height = this.height - this.padding.top - this.padding.bottom;
        var origin = { x : 0,y : 0 }

        if( this._coord ){
            //先绘制好坐标系统
            this._coord.draw( opt );
            width = this._coord.width;
            height = this._coord.height;
            origin = this._coord.origin;
        };
    
        var graphsCount = this._graphs.length;
        var completeNum = 0;
        _.each( this._graphs, function( _g ){
            _g.on( "complete", function(g) {
                completeNum ++;
                if( completeNum == graphsCount ){
                    me.fire("complete");
                }
            });
            
            _g.draw({
                width : width,
                height: height,
                origin: origin,
                inited: me.inited
            });

        } );

        this.bindEvent();
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
    _init_components_matermark( waterMarkOpt )
    {
        var text = waterMarkOpt.content || "chartx";
        var sp = new Canvax.Display.Sprite({
            id : "watermark"
        });
        var textEl = new Canvax.Display.Text( text , {
            context: {
                fontSize: waterMarkOpt.fontSize || 20,
                strokeStyle : waterMarkOpt.strokeStyle || "#ccc",
                lineWidth : waterMarkOpt.lineWidth || 2
            }
        });

        var textW = textEl.getTextWidth();
        var textH = textEl.getTextHeight();

        var rowCount = parseInt(this.height / (textH*5)) +1;
        var coluCount = parseInt(this.width / (textW*1.5)) +1;

        for( var r=0; r< rowCount; r++){
            for( var c=0; c< coluCount; c++){
                //TODO:text 的 clone有问题
                //var cloneText = textEl.clone();
                var _textEl = new Canvax.Display.Text( text , {
                    context: {
                        rotation : 45,
                        fontSize: waterMarkOpt.fontSize || 25,
                        strokeStyle : waterMarkOpt.strokeStyle || "#ccc",
                        lineWidth : waterMarkOpt.lineWidth || 0,
                        fillStyle : waterMarkOpt.fillStyle || "#ccc",
                        globalAlpha: waterMarkOpt.globalAlpha || 0.1
                    }
                });
                _textEl.context.x = textW*1.5*c + textW*.25;
                _textEl.context.y = textH*5*r ;
                sp.addChild( _textEl );
            }
        }
        this.stage.addChild( sp );
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
        this._coord.addField( field );
        _.each( this._graphs, function( _g ){
            _g.add( field );
        } );
    }

    remove( field )
    {
        var me = this;
        this._coord.removeField( field );
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
            if ( _tips && !( e.toTarget && me._coord.induce && me._coord.induce.containsPoint( me._coord.induce.globalToLocal(e.target.localToGlobal(e.point) )) )) {
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