import Chart from "../descartes"
import Canvax from "canvax2d"
import Coordinate from "../../components/descartes/index"
import Graphs from "./graphs"
import Tips from "./tips"

const _ = Canvax._;

export default class Line extends Chart
{
    constructor( node, data, opts )
    {
        super( node, data, opts );
        this.type = "line";
        this.coordinate.xAxis.layoutType = "rule";

        _.extend(true, this, opts);
        this.dataFrame = this.initData(data);

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

    /*
     *添加一个yAxis字段，也就是添加一条brokenline折线
     *@params field 添加的字段
     **/
    add( field , targetYAxis) 
    {
        this._coordinate.addField( field, targetYAxis );
        this._graphs.add( field );
        this.plugsReset(  );
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
        this.plugsReset(  );
    }


    _initModule(opt)
    {
        var me = this
        //首先是创建一个坐标系对象
        this._coordinate = new Coordinate( this.coordinate, this );
        this.core.addChild( this._coordinate.sprite );

        this._graphs = new Graphs(this.graphs, this);
        this.core.addChild(this._graphs.sprite);

        this._tips = new Tips(this.tips, this.canvax.domView, this.dataFrame);
        this._tips._markColumn.on("mouseover" , function(e){
            me._setXaxisYaxisToTipsInfo(e);
            me._tips.show( e );
        });
        
        this.stageTip.addChild(this._tips.sprite);

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

        //绘制完grapsh后，要把induce 给到 _tipss.induce
        this._tips.setInduce( this._graphs.induce );

        var me = this;
        this.bindEvent();
        this._tips.sprite.on('nodeclick', function(e) {
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

        var dataZoomOpt = _.extend(true, {
            w: me._coordinate.graphsWidth,
            pos: {
                x: me._coordinate.graphsX,
                y: me._coordinate.graphsY + me._coordinate._xAxis.height
            },
            dragIng : function( range , pixRange , count , width ){

                var trigger = {
                    name : "dataZoom",
                    left :  me.dataZoom.range.start - range.start,
                    right : range.end - me.dataZoom.range.end
                }

                _.extend( me.dataZoom.range , range );
                me.resetData( me._data , {
                    trigger : trigger
                });

                me.fire("dataZoomDragIng");
            }
        }, me.dataZoom);


        return dataZoomOpt;
    }

    getCloneChart(lineConstructor)
    {
        this._coordinate
        debugger
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
    drawMarkLine( ML, yVal, _yAxis , field )
    {
        var _fstyle = (field && this._graphs._yAxisFieldsMap[field]) ? this._graphs._yAxisFieldsMap[field].group.line.strokeStyle : "#999";
        var lineStrokeStyle =  ML.line && ML.line.strokeStyle || _fstyle;
        var textFillStyle = ML.text && ML.text.fillStyle || _fstyle;

        this.creatOneMarkLine( ML, yVal, _yAxis, lineStrokeStyle, textFillStyle, field );
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

    
    bindEvent( _setXaxisYaxisToTipsInfo )
    {
    
        var me = this;
        _setXaxisYaxisToTipsInfo || (_setXaxisYaxisToTipsInfo = me._setXaxisYaxisToTipsInfo);
        this.core.on("panstart mouseover", function(e) {
            if ( me._tips.enabled ) {
                _setXaxisYaxisToTipsInfo.apply(me, [e]);
                me._tips.show(e);
            };
            me.fire(e.type, e);
        });
        this.core.on("panmove mousemove", function(e) {
            if ( me._tips.enabled ) {
                _setXaxisYaxisToTipsInfo.apply(me, [e]);
                me._tips.move(e);
                me.fire(e.type, e);
            }
        });
        this.core.on("panend mouseout", function(e) {
            /*
            if (e.toTarget && ( e.toTarget.name == '_markcolumn_node' || e.toTarget.name == '_markcolumn_line')) {
                return
            };
            */
            if (me._tips.enabled) {
                me._tips.hide(e);
            }
        });
        this.core.on("tap", function(e) {
            if (me._tips.enabled) {
                me._tips.hide(e);
                _setXaxisYaxisToTipsInfo.apply(me, [e]);
                me._tips.show(e);
            }
        });
        this.core.on("click", function(e) {
            _setXaxisYaxisToTipsInfo.apply(me, [e]);
            me.fire("click", e.eventInfo);
        });
    }

    //把这个点位置对应的x轴数据和y轴数据存到tips的info里面
    //方便外部自定义tip是的content
    _setXaxisYaxisToTipsInfo(e)
    {

        if (!e.eventInfo) {
            return;
        };

        e.eventInfo.xAxis = this._coordinate._xAxis.data[ e.eventInfo.iNode ]; 
        e.eventInfo.xAxis && (e.eventInfo.title = e.eventInfo.xAxis.layoutText);
        e.eventInfo.dataZoom = this.dataZoom;
        e.eventInfo.rowData = this.dataFrame.getRowData( e.eventInfo.iNode );
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