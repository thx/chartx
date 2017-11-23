import Chart from "./chart"
import Canvax from "canvax2d"
import _ from "underscore"

import Legend from "../components/legend/index"
import DataZoom from "../components/datazoom/index"
import markLine from "../components/markline/index"
import markpoint from "../components/markpoint/index"
import Anchor from "../components/anchor/index"

export default class Descartes extends Chart
{
    constructor( node, data, opts ){
        super( node, data, opts );
    }

    //一些有必要的兼容代码，主要是兼容配置上面的变动
    compatible( opts )
    {
        //TODO 兼容老版配置代码
        //等全部的xy 配置都迁移到了coordinate系统下面 后 弃用
        if( !opts.coordinate ){
            opts.coordinate = {}
            if( opts.xAxis ) opts.coordinate.xAxis = opts.xAxis;
            if( opts.yAxis ) opts.coordinate.yAxis = opts.yAxis;
            if( opts.back ) opts.coordinate.back = opts.back;
        }
    }

    setStages()
    {
        this.stageTip = new Canvax.Display.Sprite({
            id: 'tip'
        });
        this.core = new Canvax.Display.Sprite({
            id: 'core'
        });

        this.stage.addChild(this.core);
        this.stage.addChild(this.stageTip);
    }

    initPlugsModules( opt )
    {
        if(this._opts.legend && this._initLegend){
            this._initLegend( opt );
        };
        if(this._opts.markLine && this._initMarkLine) {
            this._initMarkLine( opt );
        };
        if(this._opts.markPoint && this._initMarkPoint) {
            this._initMarkPoint( opt );
        };
        if(this._opts.dataZoom && this._initDataZoom) {
            this._initDataZoom( opt );
        };
        if(this._opts.anchor && this._initAnchor) {
            this._initAnchor( opt );
        };
    }

    //所有plug触发更新
    plugsReset(opt , e)
    {
        var me = this;
        _.each(this.plugs , function( p , i ){
            if( p.type == "markLine" ){
                p.plug.reset({
                    line: {
                        y : p.plug._yAxis.getYposFromVal( p.plug.value )
                    }
                } ,i);
                return
            };

            if( p.type == "markPoint" ){
                p.plug.reset();
                return
            };
            
            if( p.type == "dataZoom" ){
                if(!e || (e && e.trigger != "dataZoom")){
                    me.__cloneChart = me._getCloneChart();
                    p.plug.reset( {
                        count : me._data.length-1
                    } , me.__cloneChart.thumbChart._graphs.sprite );
                }
                return
            };
            p.plug.reset && p.plug.reset(opt);
            
        }); 
    }



    //设置图例 begin
    _initLegend( e )
    {
        !e && (e={});
        var me = this;
        //if( !this.legend || (this.legend && "enabled" in this.legend && !this.legend.enabled) ) return;
        //设置legendOpt
        var legendOpt = _.deepExtend({
            enabled:true,
            label  : function( info ){
               return info.field
            },
            onChecked : function( field ){
               me.add( field );
            },
            onUnChecked : function( field ){
               me.remove( field );
            }
        } , me._opts.legend);
        
        var _legend = new Legend( me._getLegendData() , legendOpt );
       
        _legend.draw = function(){
            me.drawLegend( _legend );
        };
        
        _legend.pos( {
            x : 0,
            y : me.padding.top + ( e.resize ? - _legend.height : 0 )
        } );

        !e.resize && (me.padding.top += _legend.height);

        this.plugs.push( {
            type : "legend",
            plug : _legend
        } );
        me.core.addChild( _legend.sprite );
    }

    //只有field为多组数据的时候才需要legend
    _getLegendData()
    {
        var me   = this;
        var data = [];
        _.each( me._coordinate.yAxisFields , function( f , i ){
            data.push({
                field : f,
                fillStyle : null
            });
        });
        return data;
    }
    ////设置图例end


    //datazoom begin
    _getCloneChart()
    {
        var me = this;
        barConstructor = this.constructor;//(barConstructor || Bar);
        var cloneEl = me.el.cloneNode();
        cloneEl.innerHTML = "";
        cloneEl.id = me.el.id + "_currclone";
        cloneEl.style.position = "absolute";
        cloneEl.style.width = me.el.offsetWidth + "px";
        cloneEl.style.height = me.el.offsetHeight + "px";
        cloneEl.style.top = "10000px";
        document.body.appendChild(cloneEl);

        var opts = _.deepExtend({}, me._opts);
        _.deepExtend(opts, me.getCloneChart() );

        delete opts.dataZoom;

        var thumbChart = new barConstructor(cloneEl, me._data, opts);
        thumbChart.draw();

        return {
            thumbChart: thumbChart,
            cloneEl: cloneEl
        }
    }

    _initDataZoom()
    {
        var me = this;

        me.padding.bottom += me.dataZoom.h;
        me.__cloneChart = me._getCloneChart();

        this.plugs.push( {
            type : "once",
            plug : {
                draw: function(){
                    
                    me._dataZoom = new DataZoom( me.drawDataZoom() );
                    
                    var graphssp = me.__cloneChart.thumbChart._graphs.sprite;
                    graphssp.id = graphssp.id + "_datazoomthumbChartbg"
                    graphssp.context.x = 0;
                    graphssp.context.y = me._dataZoom.barH + me._dataZoom.barY;

                    graphssp.context.scaleY = me._dataZoom.barH / me.__cloneChart.thumbChart._graphs.h;

                    me._dataZoom.setZoomBg( graphssp );

                    me.__cloneChart.thumbChart.destroy();
                    me.__cloneChart.cloneEl.parentNode.removeChild(me.__cloneChart.cloneEl);

                    me.plugs.push( {
                        type : "dataZoom",
                        plug : me._dataZoom
                    } ); 
                    me.core.addChild( me._dataZoom.sprite );
                }
            }
        } );
    }
    //datazoom end


    //markLine begin
    _initMarkLine() 
    {
        var me = this;

        if( !_.isArray( me.markLine ) ){
            me.markLine = [ me.markLine ];
        };

        _.each( me.markLine, function( ML ){
            //如果markline有target配置，那么只现在target配置里的字段的 markline, 推荐
            var field = ML.markTo;
            var _yAxis = me._coordinate._yAxis[0]; //默认为左边的y轴
            
            if( field ){
                //如果有配置markTo就从me._coordinate._yAxis中找到这个markTo所属的yAxis对象
                _.each( me._coordinate._yAxis, function( $yAxis, yi ){
                    var fs = _.flatten([ $yAxis.field ]);
                    if( _.indexOf( fs, field ) >= 0 ){
                        _yAxis = $yAxis;
                    }
                } );
            }

            var y;
            if( ML.y !== undefined && ML.y !== null ){
                y = Number( ML.y );
            };
            if( !isNaN(y) ) {
                _yAxis.resetDataSection( y );
            };

            var name = field;

            me.plugs.push( {
                type : "once",
                plug : {
                    draw : function(){
                        me.drawMarkLine( name , y, _yAxis, ML);
                    }
                }
            } );
        } );
    }

    creatOneMarkLine( yVal, yPos, lineStrokeStyle, label, textFillStyle, field, ML, _yAxis)
    {
        var me = this;
        var o = {
            w: me._coordinate.graphsWidth,
            h: me._coordinate.graphsHeight,
            value: yVal,
            origin: {
                x: me._coordinate.graphsX,
                y: me._coordinate.graphsY
            },
            line: {
                y: yPos,
                list: [
                    [0, 0],
                    [me._coordinate.graphsWidth, 0]
                ],
                strokeStyle: lineStrokeStyle
            },
            text: {
                content: label, 
                fillStyle: textFillStyle
            },
            field: field
        };

        var _markLine = new MarkLine(_.deepExtend( ML, o) , _yAxis);
        me.plugs.push( {
            type : "markLine",
            plug : _markLine
        } );
        me.core.addChild( _markLine.sprite );
    }
    //markLine end


    _initMarkPoint() 
    {
        //目前由bar和line各自覆盖
        this.drawMarkPoint();
    }

    creatOneMarkPoint( opts, mpCtx )
    {
        var me = this;
        var _mp = new MarkPoint( opts, mpCtx );
        _mp.shape.hover(function(e) {
            this.context.hr++;
            this.context.cursor = "pointer";
            e.stopPropagation();
        }, function(e) {
            this.context.hr--;
            e.stopPropagation();
        });
        _mp.shape.on("mousemove", function(e) {
            e.stopPropagation();
        });
        _mp.shape.on("tap click", function(e) {
            e.stopPropagation();
            e.eventInfo = _mp;
            me.fire("markpointclick", e);
        });

        me.plugs.push( {
            type : "markPoint",
            plug : _mp
        } );

        me.core.addChild( _mp.sprite );

        return _mp;
    }


    _initAnchor( e )
    {
        
        var me = this;

        this.plugs.push( {
            type : "once",
            plug : {
                draw: function(){

                    var _anchor = new Anchor( me.anchor );
                    me.core.addChild(_anchor.sprite);
                    
                    var _graphsH = me._coordinate.graphsHeight;
                    var _graphsW = me._coordinate.graphsWidth;

                    _anchor.draw({
                        w: _graphsW, 
                        h: _graphsH,
                        //cross: {
                        //    x: 0,
                        //    y: _graphsH + 0
                        //},
                        pos: {
                            x: me._coordinate.graphsX,
                            y: me._coordinate.graphsY - _graphsH
                        }
                    });

                    me._anchor = _anchor;

                    me.drawAnchor( _anchor );

                    me.plugs.push( {
                        type : "anchor",
                        plug : {
                            draw : function(){
                                me.drawAnchor( _anchor );
                            }
                        }
                    } );

                }
            }
        } );
    }
}