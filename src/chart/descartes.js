import Chart from "./chart"
import Canvax from "canvax2d"
import {parse2MatrixData} from "../utils/tools"
import DataFrame from "../utils/dataframe"

import Legend from "../components/legend/index"
import DataZoom from "../components/datazoom/index"
import MarkLine from "../components/markline/index"
import MarkPoint from "../components/markpoint/index"
import Anchor from "../components/anchor/index"


const _ = Canvax._;

export default class Descartes extends Chart
{
    constructor( node, data, opts ){

        super( node, data, opts );

        //坐标系统
        this._coordinate = null;
        this.coordinate = {
            xAxis : {
                //波峰波谷布局模型，默认是柱状图的，折线图种需要做覆盖
                layoutType    : "peak",  
                //默认为false，x轴的计量是否需要取整， 这样 比如某些情况下得柱状图的柱子间隔才均匀。
                //比如一像素间隔的柱状图，如果需要精确的绘制出来每个柱子的间距是1px， 就必须要把这里设置为true
                posParseToInt : false    
            }
        };

        //直角坐标系的绘图模块
        this._graphs = null;

        //直角坐标系的tooltip
        this._tips = null;

        //预设dataZoom的区间数据
        this.dataZoom = {
            h: 25,
            range: {
                start: 0,
                end: data.length - 1 -1 //因为第一行是title 要-1，然后end是0开始的索引继续-1
            }
        };

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

    //reset之前是应该已经 merge过了 opt ，  和准备好了dataFrame
    _resetData( e )
    {
        var me = this;
        this._coordinate.resetData( this.dataFrame );
        this._graphs.resetData( this.dataFrame);
        this.componentsReset( e );
    }

    initData(data, opt)
    {
        var d;
        var dataZoom = (this.dataZoom || (opt && opt.dataZoom));

        if ( this._opts.dataZoom ) {
            var datas = [data[0]];
            datas = datas.concat(data.slice( parseInt(dataZoom.range.start) + 1, parseInt(dataZoom.range.end) + 1 + 1));
            d = DataFrame.apply(this, [datas, opt]);
        } else {
            d = DataFrame.apply(this, arguments);
        };
        return d;
    }

    _horizontal() 
    {
        var me = this;

        _.each([me._graphs], function( _graphs ) {
            var ctx = _graphs.sprite.context;
            ctx.x += ((me.width - me.height) / 2);
            ctx.y += ((me.height - me.width) / 2) + me.padding.top;
            ctx.rotation = 90;
            ctx.rotateOrigin.x = me.height / 2;
            ctx.rotateOrigin.y = me.width / 2;
            ctx.scaleOrigin.x = me.height / 2;
            ctx.scaleOrigin.y = me.width / 2;
            ctx.scaleX = -1;

            _.each(_graphs.txtsSp.children, function(childSp) {
                _.each(childSp.children, function(cs) {
                    var ctx = cs.context;
                    var w = ctx.width;
                    var h = ctx.height;
    
                    ctx.scaleOrigin.x = w / 2;
                    ctx.scaleOrigin.y = h / 2;
                    ctx.scaleX = -1;
    
                    ctx.rotation = 90;
                    ctx.rotateOrigin.x = w / 2;
                    ctx.rotateOrigin.y = h / 2;
    
                    var _cfy = cs._finalY;
                    cs._finalY -= w / 2 - h / 2;
                    if( !cs.upOfYbaseNumber ){
                        //不在基准线之上的话
                        cs._finalY += w/2;
                    };
    
                    //TODO:这里暂时还不是最准确的计算， 后续完善
                    if( Math.abs(_cfy)+w > me._graphs.h ){
                        cs._finalY = -me._graphs.h + w / 2;
                    };
                });
            });
        });


        

    }

    initComponents( opt )
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
    componentsReset(e)
    {
        var me = this;
        _.each(this.components , function( p , i ){

            if( p.type == "dataZoom" ){
                if(!e || (e && e.trigger.name != "dataZoom")){
                    me.__cloneChart = me._getCloneChart();
                    p.plug.reset( {
                        //count : me._data.length-1
                    } , me.__cloneChart );
                }
                return
            };
            
            p.plug.reset && p.plug.reset( me[ p.type ] || {} );
            
        }); 
    }



    //设置图例 begin
    _initLegend( e )
    {
        !e && (e={});
        var me = this;
        //if( !this.legend || (this.legend && "enabled" in this.legend && !this.legend.enabled) ) return;
        //设置legendOpt
        var legendOpt = _.extend(true, {
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

        this.components.push( {
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
        var chartConstructor = this.constructor;//(barConstructor || Bar);
        var cloneEl = me.el.cloneNode();
        cloneEl.innerHTML = "";
        cloneEl.id = me.el.id + "_currclone";
        cloneEl.style.position = "absolute";
        cloneEl.style.width = me.el.offsetWidth + "px";
        cloneEl.style.height = me.el.offsetHeight + "px";
        cloneEl.style.top = "10000px";
        document.body.appendChild(cloneEl);

        //var opts = _.extend(true, {}, me._opts);
        //_.extend(true, opts, me.getCloneChart() );

        //clone的chart只需要coordinate 和 graphs 配置就可以了
        //因为画出来后也只需要拿graphs得sprite去贴图
        var opts = {
            coordinate : this.coordinate,
            graphs : me._opts.graphs
        };
        _.extend(true, opts, me.getCloneChart() );

        var thumbChart = new chartConstructor(cloneEl, me._data, opts);

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

        this.components.push( {
            type : "once",
            plug : {
                draw: function(){
                    me._dataZoom = new DataZoom( me.drawDataZoom() , me.__cloneChart );
                    me.components.push( {
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

            if( field && _.indexOf( me.dataFrame.fields , field ) == -1 ){
                //如果配置的字段不存在，则不绘制
                return;
            }

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
            } else {
                //如果没有配置这个y的属性，就 自动计算出来均值
                //但是均值是自动计算的，比如datazoom在draging的时候
                y = function(){
                    var _fdata = me.dataFrame.getFieldData( field );
                    var _count = 0;
                    _.each( _fdata, function( val ){
                        if( Number( val ) ){
                            _count += val;
                        }
                    } );
                    return _count / _fdata.length;
                }
            };

            if( !isNaN(y) ) {
                //如果y是个function说明是均值，自动实时计算的，而且不会超过ydatasection的范围
                _yAxis.setWaterLine( y );
            };

            me.components.push( {
                type : "once",
                plug : {
                    draw : function(){
                        me.drawMarkLine( ML, y, _yAxis, field );
                    }
                }
            } );

        } );
    }

    creatOneMarkLine( ML, yVal, _yAxis, lineStrokeStyle, textFillStyle, field )
    {
        var me = this;
        var o = {
            w: me._coordinate.graphsWidth,
            h: me._coordinate.graphsHeight,
            yVal: yVal,
            origin: {
                x: me._coordinate.graphsX,
                y: me._coordinate.graphsY
            },
            line: {
                list: [
                    [0, 0],
                    [me._coordinate.graphsWidth, 0]
                ],
                strokeStyle: lineStrokeStyle
            },
            text: {
                fillStyle: textFillStyle
            },
            field: field
        };

        var _markLine = new MarkLine( _.extend( true, ML, o) , _yAxis );
        me.components.push( {
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
            //e.stopPropagation();
        }, function(e) {
            this.context.hr--;
            //e.stopPropagation();
        });
        _mp.shape.on("mousemove", function(e) {
            //e.stopPropagation();
        });
        _mp.shape.on("tap click", function(e) {
            e.stopPropagation();
            e.eventInfo = _mp;
            //me.fire("markpointclick", e);
        });

        me.components.push( {
            type : "markPoint",
            plug : _mp
        } );

        me.core.addChild( _mp.sprite );

        return _mp;
    }


    _initAnchor( e )
    {
        
        var me = this;

        this.components.push( {
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

                    me.components.push( {
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