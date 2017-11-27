import Chart from "../descartes"
import _ from "underscore"
import {parse2MatrixData,numAddSymbol} from "../../utils/tools"
import Coordinate from "../../components/descartes/index"
import Graphs from "./graphs"
import Tips from "./tips"
import dataFrame from "../../utils/dataframe"

export default class Line extends Chart
{
    constructor( node, data, opts )
    {
        super( node, data, opts );
        this.type = "line";
        this.coordinate.xAxis.layoutType = "rule";

        _.deepExtend(this, opts);
        this.dataFrame = this._initData(data);

        //一些继承自该类的 constructor 会拥有_init来做一些覆盖，暂时没有场景，先和bar保持一致
        this._init && this._init(node, data, opts);
        this.draw();
    }

    draw( opt ) 
    {
        !opt && (opt ={});
        this.setStages();
        if (this.rotate) {
            this._rotate(this.rotate);
        };
        this._initModule( opt ); //初始化模块  
        this.initPlugsModules( opt ); // 初始化组件
        this._startDraw( opt ); //开始绘图
        this.drawPlugs( opt ); //开始绘制插件
        this.inited = true;
    }

    reset(opt) 
    {
        
        var me = this;
        
        if (opt && opt.options) {
            _.deepExtend(this, opt.options);

            //如果有配置yAxis.field，说明要覆盖之前的yAxis.field配置
            if( opt.options.coordinate && opt.options.coordinate.yAxis && opt.options.coordinate.yAxis.field ){
                if( !opt.options.graphs ){
                    opt.options.graphs = {};
                };
                opt.options.graphs.yAxisChange = opt.options.coordinate.yAxis.field
            };
        };

        var d = ( this.dataFrame.org || [] );
        if (opt && opt.data) {
            this._data = Tools.parse2MatrixData( opt.data );; //加上这句，用来更新datazoom
            d = opt.data;
        };
        
        //不管opt里面有没有传入数据，option的改变也会影响到 dataFrame 。
        this.dataFrame = this._initData( d , this);

        this._reset( opt.options );
    }

    /*
     * 如果只有数据改动的情况
     */
    resetData(data , e) 
    {
        this._data = Tools.parse2MatrixData( data );
        this.dataFrame = this._initData(data, this);
        this._reset( this , e );
    }

    _reset( opt , e )
    {
        var me = this;
        opt = !opt ? this : opt;
        
        this._coordinate.reset( opt.coordinate, this.dataFrame );

        this._graphs.reset( opt.graphs , this.dataFrame);

        this.plugsReset( opt , e );
    }

    /*
     *添加一个yAxis字段，也就是添加一条brokenline折线
     *@params field 添加的字段
     **/
    add( field , targetYAxis) 
    {
        this._coordinate.addField( field, targetYAxis );
        this._graphs.add( field );
    }

    /*
     *删除一个yaxis字段，也就是删除一条brokenline线
     *@params target 也可以是字段名字，也可以是 index
     **/
    remove(target , _ind)
    {
        var ind = null;
        if (_.isNumber(target)) {
            //说明是索引
            ind = target;
        } else {
            //说明是名字，转换为索引
            ind = this._graphs.getIndexOfField( target );
        };
        if ( ind > -1 ) {
            this._remove(ind, target);
        };
    }

    _remove(ind, target)
    {
        this._coordinate.removeField( target );
        //然后就是删除graphs中对应的brokenline，并且把剩下的brokenline缓动到对应的位置
        this._graphs.remove(ind);
    }

    _initData(data, opt) 
    {
        var d;
        var dataZoom = (this.dataZoom || (opt && opt.dataZoom));

        if ( this._opts.dataZoom ) {
            var datas = [data[0]];
            datas = datas.concat(data.slice( parseInt(dataZoom.range.start) + 1, parseInt(dataZoom.range.end) + 1 + 1));
            d = dataFrame.apply(this, [datas, opt]);
        } else {
            d = dataFrame.apply(this, arguments);
        };
        return d;
    }

    _initModule(opt)
    {
        var me = this
        //首先是创建一个坐标系对象
        this._coordinate = new Coordinate( this.coordinate, this );
        this.core.addChild( this._coordinate.sprite );

        this._graphs = new Graphs(this.graphs, this);
        this.core.addChild(this._graphs.sprite);

        this._tip = new Tips(this.tips, this.canvax.domView, this.dataFrame);
        this._tip._markColumn.on("mouseover" , function(e){
        
            //新版本(canvax2.0.0)的canvax中这里的e.target 为_markColumn对象（这是对的）
            //所有需要用这个来修正下
            e.target = e.toTarget? e.toTarget : e.target;

            me._setXaxisYaxisToTipsInfo(e);    
            me._tip.show( e );
        });
        
        this.stageTip.addChild(this._tip.sprite);

        //initModule 里面全部都是只数据和module的设置，
        //所以_initPlugsModules里的plug还有可以修改layout的机会
        
    }

    _startDraw(opt)
    {
        var me = this;

        //初始化一些在开始绘制的时候就要处理的plug，这些plug可能会影响到布局，比如legend，datazoom

        this._coordinate.draw( opt );

        this._graphs.draw({
            x: this._coordinate.graphsX,
            y: this._coordinate.graphsY,
            w: this._coordinate.graphsWidth,
            h: this._coordinate.graphsHeight,
            smooth: this.smooth,
            inited: this.inited,
            resize: opt.resize
        }).on("complete" , function(){
            me.fire("complete");
        });

        //绘制完grapsh后，要把induce 给到 _tips.induce
        this._tip.setInduce( this._graphs.induce );

        var me = this;
        this.bindEvent(this.core);
        this._tip.sprite.on('nodeclick', function(e) {
            me._setXaxisYaxisToTipsInfo(e);
            me.fire("nodeclick", e.eventInfo);
        });
        
    }

    drawLegend( _legend )
    {
        _legend.pos( {
            x : this._coordinate.graphsX
        } );
        _.each( this._graphs.groups , function( g ){
            _legend.setStyle( g.field , {
                fillStyle : g.__lineStrokeStyle
            } );
        } );
    }

    //datazoom begin
    drawDataZoom()
    {
        var me = this;

        var dataZoomOpt = _.deepExtend({
            w: me._coordinate.graphsWidth,
            
            pos: {
                x: me._coordinate.graphsX,
                y: me._coordinate.graphsY + me._coordinate._xAxis.height
            },
            count : me._data.length-1-1,
            dragIng : function( range , pixRange , count , width ){

                //这个计算start end 和bar不同
                var itemW = width/count;
                var start = null, end = null;
                for( var i = 0; i<=count; i++ ){
                    if( start === null && (itemW*i + itemW/2) > pixRange.start){
                        start = i;
                    };
                    if( end === null && (itemW*i + itemW/2) > pixRange.end){
                        end = i;
                    };
                    if( end !== null ){
                        break;
                    }
                };

                if (start == me.dataZoom.range.start && end == me.dataZoom.range.end) {
                    return;
                };

                me.dataZoom.range.start = parseInt(start);
                me.dataZoom.range.end = parseInt(end);

                me.resetData( me._data , {
                    trigger : "dataZoom"
                });

                me.fire("dataZoomDragIng");
            }
        }, me.dataZoom);

        //这样里和bar不一样，需要减一个
        dataZoomOpt.range.end = parseInt(dataZoomOpt.range.end);
        dataZoomOpt.range.end --;

        return dataZoomOpt;
    }

    getCloneChart(lineConstructor)
    {
        return {
            graphs: {
                line: {
                    lineWidth: 1,
                    strokeStyle: "#ececec"
                },
                node: {
                    enabled: false
                },
                fill: {
                    alpha: 0.5,
                    fillStyle: "#ececec"
                },
                animation: false,
                eventEnabled: false,
                text: {
                    enabled: false
                }
            }
        }
    }

    //datazoom end


    //markpoint begin
    drawMarkPoint(e)
    {

        var me = this;
        var _t = me.markPoint.markTo;

        _.each( me._coordinate._yAxis , function( _yAxis , yi ){
            var fs = _.flatten([ _yAxis.field ]);
            _.each( fs , function( field , i ){
                if( _t && !( ( _.isArray(_t) && _.indexOf( _t , field )>=0 ) || (_t === field) || _.isFunction(_t) ) ){
                    return;
                };

                me.plugs.push( {
                    type : "once",
                    plug : {
                        draw : function(){
                            
                            var g = me._graphs._yAxisFieldsMap[field].group;
                            _.each(g.data, function(node, i) {

                                var circle = g._circles.children[i];
                                var mpCtx = {
                                    value: node.value,
                                    field: g.field,
                                    point: circle.localToGlobal(),
                                    r: circle.context.r + 2,
                                    groupLen: g.data.length,
                                    iNode: i,
                                    iGroup: g._groupInd
                                };

                                if( _.isFunction(_t) && !_t( mpCtx ) ){
                                    //如果MarkTo是个表达式函数，返回为false的话
                                    return;
                                };

                                if (me._opts.markPoint && me._opts.markPoint.shapeType != "circle") {
                                    mpCtx.point.y -= circle.context.r + 3
                                };

                                var _mp = me.creatOneMarkPoint(me._opts, mpCtx);

                                circle.on("heartBeat" , function(){
                                    _mp.rePosition( this.localToGlobal() )
                                });
                                
                            });

                        }
                    }
                } );

            } );
        } );
    }
    //markpoint end

    //markline begin
    drawMarkLine( field, yVal, _yAxis , ML)
    {
        var me = this;

        var yPos=0, label='';
        var label = "markline";
        
        if( yVal !== undefined && yVal !== null ){
            yPos = _yAxis.getYposFromVal(yVal);
            field && (label = field);
        } else {
            //没有配置y，则取均值
            if( !field ){
                //如果没有配置y值，也没有配置所属哪个field，那么就不画
                return;
            };

            var average = me._graphs.data[field].average;
            yVal = average.value;
            if( yVal === undefined || yVal === null ) return;
            yPos = parseInt( average.position );
            label = field + '均值';
        };
        label += ("："+yVal);

        var o = {
            value  : yVal,
        };

        if( field ){
            o.i = me._graphs._yAxisFieldsMap[field].ind;
            o.field = field;
        }

        if (ML.text && ML.text.enabled) {
            if (_.isFunction(ML.text.format)) {
                label = ML.text.format(o)
            }
        };

        function getProp( obj , p , def){
            var val;
            if( !obj || ( obj && !obj[p] ) ){
                return def;
            };
            if( _.isFunction( obj[p] ) ){
                return obj[p]( o );
            };
            return obj[p];
        };
        var g = field && me._graphs._yAxisFieldsMap[field].group;
        var lineStrokeStyle = getProp( ML.line, "strokeStyle" , (g ? g.line.strokeStyle : "#999") );
        var textFillStyle = getProp( ML.text, "fillStyle" , (g ? g.line.strokeStyle : "#999") );
    
        this.creatOneMarkLine( yVal, yPos, lineStrokeStyle, label, textFillStyle, field, ML, _yAxis);
    }
    //markline end

    drawAnchor( _anchor )
    {
        var pos = {
            x : this._coordinate._xAxis.data[ this.anchor.xIndex ].x,
            y : this._coordinate.graphsHeight + this._graphs.data[ this._coordinate._yAxis[0].field[0] ].groupData[ this.anchor.xIndex ].y
        };
        _anchor.aim( pos );
    }

    
    bindEvent(spt, _setXaxisYaxisToTipsInfo)
    {
    
        var me = this;
        _setXaxisYaxisToTipsInfo || (_setXaxisYaxisToTipsInfo = me._setXaxisYaxisToTipsInfo);
        spt.on("panstart mouseover", function(e) {
            if (me._tip.enabled && e.eventInfo && e.eventInfo.nodesInfoList.length > 0) {
                //me._tip.hide(e);
                _setXaxisYaxisToTipsInfo.apply(me, [e]);
                me._tip.show(e);
            }
        });
        spt.on("panmove mousemove", function(e) {
            if (me._tip.enabled && e.eventInfo) {
                if (e.eventInfo.nodesInfoList.length > 0) {
                    _setXaxisYaxisToTipsInfo.apply(me, [e]);
                    if (me._tip._isShow) {
                        me._tip.move(e);
                    } else {
                        me._tip.show(e);
                    }
                } else {
                    if (me._tip._isShow) {
                        me._tip.hide(e);
                    }
                }
            }
        });
        spt.on("panend mouseout", function(e) {
            if (e.toTarget && ( e.toTarget.name == '_markcolumn_node' || e.toTarget.name == '_markcolumn_line')) {
                return
            }
            if (me._tip.enabled) {
                me._tip.hide(e);
            }
        });
        spt.on("tap", function(e) {
            if (me._tip.enabled && e.eventInfo && e.eventInfo.nodesInfoList.length > 0) {
                me._tip.hide(e);
                _setXaxisYaxisToTipsInfo.apply(me, [e]);
                me._tip.show(e);
            }
        });
        spt.on("click", function(e) {
            _setXaxisYaxisToTipsInfo.apply(me, [e]);
            me.fire("click", e.eventInfo);
        });
    }

    //把这个点位置对应的x轴数据和y轴数据存到tips的info里面
    //方便外部自定义tip是的content
    _setXaxisYaxisToTipsInfo(e)
    {

        if (!e.eventInfo || !this._coordinate._xAxis.dataOrg.length) {
            return;
        };

        var value;

        if( e.eventInfo.xAxis && e.eventInfo.xAxis.value ){
            value = e.eventInfo.xAxis.value;
        } else {
            value = this._coordinate._xAxis.dataOrg[0][e.eventInfo.iNode];
        }

        var me = this;
        e.eventInfo.xAxis = _.extend({
            field: this._coordinate._xAxis.field[0],
            value: value
        } , e.eventInfo.xAxis);

        e.eventInfo.dataZoom = me.dataZoom;

        e.eventInfo.rowData = this.dataFrame.getRowData( e.eventInfo.iNode );

        e.eventInfo.iNode += parseInt(this.dataZoom.range.start);
    }
    
    createMarkColumn( xVal , opt)
    {
        return this._graphs.createMarkColumn( this._coordinate.getPosX( {val : xVal} ) , _.extend(opt,{xVal: xVal}));
    }

    moveMarkColumnTo( mcl , xval , opt )
    {
        var x = this._coordinate.getPosX( {val : xval} );
        return mcl.move( {
            eventInfo: this._graphs.getNodesInfoOfx( x )
        } , {
            x: x,
            xVal: xval
        });
    }
}