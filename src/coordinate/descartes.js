import CoordinateBase from "./index"
import Canvax from "canvax2d"
import {parse2MatrixData} from "../utils/tools"
import DataFrame from "../utils/dataframe"
import CoordinateComponents from "../components/descartes/index"

const _ = Canvax._;
const Rect = Canvax.Shapes.Rect;
const Line = Canvax.Shapes.Line;

export default class Descartes extends CoordinateBase
{
    constructor( node, data, opts, graphsMap, componentsMap ){

        super( node, data, opts );

        this.graphsMap = graphsMap;
        this.componentsMap = componentsMap;

        var me = this;

        //坐标系统
        this._coordinate = null;
        this.coordinate = {
            xAxis : {
                //波峰波谷布局模型，默认是柱状图的，折线图种需要做覆盖
                layoutType    : "rule", //"peak",  
                //默认为false，x轴的计量是否需要取整， 这样 比如某些情况下得柱状图的柱子间隔才均匀。
                //比如一像素间隔的柱状图，如果需要精确的绘制出来每个柱子的间距是1px， 就必须要把这里设置为true
                posParseToInt : false
            }
        };

        
        opts = _.clone( opts );
        if( opts.coordinate.yAxis ){
            var _nyarr = [];
            //TODO: 因为我们的deep extend 对于数组是整个对象引用过去，所以，这里需要
            //把每个子元素单独clone一遍，恩恩恩， 在canvax中优化extend对于array的处理
            _.each( _.flatten([opts.coordinate.yAxis]) , function( yopt ){
                _nyarr.push( _.clone( yopt ) );
            } );
            opts.coordinate.yAxis = _nyarr;
        } else {
            opts.coordinate.yAxis = [];
        }

        //根据opt中得Graphs配置，来设置 coordinate.yAxis
        if( opts.graphs ){
            opts.graphs = _.flatten( [ opts.graphs ] );
            //有graphs的就要用找到这个graphs.field来设置coordinate.yAxis
            _.each( opts.graphs, function( graphs ){
                if( graphs.type == "bar" ){
                    //如果graphs里面有柱状图，那么就整个xAxis都强制使用 peak 的layoutType
                    me.coordinate.xAxis.layoutType = "peak";
                }
                if( graphs.field ){
                    //没有配置field的话就不绘制这个 graphs了
                    var align = "left"; //默认left
                    if( graphs.yAxisAlign == "right" ){
                        align = "right";
                    };

                    var optsYaxisObj = null;
                    optsYaxisObj = _.find( opts.coordinate.yAxis, function( obj, i ){
                        return obj.align == align || ( !obj.align && i == ( align == "left" ? 0 : 1 ));
                    } );
    
                    if( !optsYaxisObj ){
                        optsYaxisObj = {
                            align : align,
                            field : []
                        }
                        opts.coordinate.yAxis.push( optsYaxisObj );
                    } else {
                        if( !optsYaxisObj.align ){
                            optsYaxisObj.align = align;
                        }
                    }

                    if( !optsYaxisObj.field ){
                        optsYaxisObj.field = [];
                    } else {
                        if( !_.isArray( optsYaxisObj.field ) ){
                            optsYaxisObj.field = [ optsYaxisObj.field ];
                        }
                    }

                    if( _.isArray( graphs.field ) ){
                        optsYaxisObj.field = optsYaxisObj.field.concat( graphs.field )
                    } else {
                        optsYaxisObj.field.push( graphs.field )
                    }
                        
                }
            } );
        };
        //再梳理一遍yAxis，get没有align的手动配置上align
        //要手动把yAxis 按照 left , right的顺序做次排序
        var _lys=[],_rys=[];
        _.each( opts.coordinate.yAxis , function( yAxis , i ){
            if( !yAxis.align ){
                yAxis.align = i ?"right": "left";
            }
            if( yAxis.align == "left" ){
                _lys.push( yAxis );
            } else {
                _rys.push( yAxis );
            }
        } );
        opts.coordinate.yAxis = _lys.concat( _rys );

        
        //直角坐标系的绘图模块,是个数组，支持多模块
        this._graphs = [];

        //预设dataZoom的区间数据
        this.dataZoom = {
            h: 25,
            range: {
                start: 0,
                end: this._data.length - 1 -1 //因为第一行是title 要-1，然后end是0开始的索引继续-1
            }
        };

        _.extend(true, this, opts);

        //这里不要直接用data，而要用 this._data
        this.dataFrame = this.initData( this._data );

        //this.draw();
        this.tipsPointer = null;
    }

    //覆盖基类中得draw，和基类的draw唯一不同的是，descartes 会有 _horizontal 的操作
    draw( opts )
    {
        this.initModule( opts );     //初始化模块  
        this.initComponents( opts ); //初始化组件
        this.startDraw( opts );      //开始绘图
        this.drawComponents( opts ); //绘图完，开始绘制插件

        if( this._coordinate.horizontal ){
            this._horizontal();
        };

        this.inited = true;
    }

    initModule(opt)
    {
        var me = this
        //首先是创建一个坐标系对象
        this._coordinate = new CoordinateComponents( this.coordinate, this );
        this.coordinateSprite.addChild( this._coordinate.sprite );

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
        var _coor = this._coordinate;

        if( !_coor._yAxis.length ){
            //如果没有y轴数据
            return;
        }

        //先绘制好坐标系统
        _coor.draw( opt );

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
                width: _coor.width,
                height: _coor.height,
                origin: {
                    x: _coor.origin.x,
                    y: _coor.origin.y
                },
                sort: _coor._yAxis.sort,
                inited: me.inited
            });
        } );

        this.bindEvent();
    }

    //reset之前是应该已经 merge过了 opt ，  和准备好了dataFrame
    _resetData( dataTrigger )
    {
        var me = this;
        this._coordinate.resetData( this.dataFrame , dataTrigger);
        _.each( this._graphs, function( _g ){
            _g.resetData( me.dataFrame , dataTrigger);
        } );
        this.componentsReset( dataTrigger );
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

        var ctx = me.graphsSprite.context;
        ctx.x += ((me.width - me.height) / 2);
        ctx.y += ((me.height - me.width) / 2);
        ctx.rotation = 90;
        ctx.rotateOrigin.x = me.height / 2;
        ctx.rotateOrigin.y = me.width / 2;
        ctx.scaleOrigin.x = me.height / 2;
        ctx.scaleOrigin.y = me.width / 2;
        ctx.scaleX = -1;
     

        function _horizontalText( el ){
            if( el.children ){
                _.each( el.children, function( _el ){
                    _horizontalText( _el );
                } )
            }
            if( el.type == "text" ){
                var ctx = el.context;
                var w = ctx.width;
                var h = ctx.height;

                ctx.scaleOrigin.x = w / 2;
                ctx.scaleOrigin.y = h / 2;
                ctx.scaleX = -1;

                ctx.rotation = 90;
                ctx.rotateOrigin.x = w / 2;
                ctx.rotateOrigin.y = h / 2;
            }
        }

        _.each(me._graphs, function( _graphs ) {
            _horizontalText( _graphs.sprite );
        });
    }

    //只有field为多组数据的时候才需要legend
    _getLegendData()
    {
        var me   = this;
        var data = [];
        
        _.each( _.flatten(me._coordinate.fieldsMap) , function( map , i ){
            //因为yAxis上面是可以单独自己配置field的，所以，这部分要过滤出 legend data
            var isGraphsField = false;
            _.each( me.graphs, function( gopt ){
                if( _.indexOf( _.flatten([ gopt.field ]), map.field ) > -1 ){
                    isGraphsField = true;
                    return false;
                }
            } );

            if( isGraphsField ){
                data.push( {
                    enabled : map.enabled,
                    name    : map.field,
                    ind     : map.ind,
                    style   : map.style,
                    yAxis   : map.yAxis
                } );
            }
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
        var graphsOpt = [];
        _.each( this._graphs, function( _g ){
            var _field = _g.enabledField || _g.field;
            
            if( _.flatten([_field]).length ) {

                var _opts = _.extend( true, {} , _g._opts );
                
                _opts.field = _field;
                if( _g.type == "bar" ){
                    _.extend(true, _opts , {
                        bar: {
                            fillStyle: me.dataZoom.normalColor || "#ececec"
                        },
                        animation: false,
                        eventEnabled: false,
                        text: {
                            enabled: false
                        }
                    } )
                }
                if( _g.type == "line" ){
                    _.extend( true,  _opts , {
                        line: {
                            //lineWidth: 1,
                            strokeStyle: "#ececec"
                        },
                        node: {
                            enabled: false
                        },
                        fill: {
                            alpha: 0.6,
                            fillStyle: "#ececec"
                        },
                        animation: false,
                        eventEnabled: false,
                        text: {
                            enabled: false
                        }
                    } )
                }
                if( _g.type == "scat" ){
                    _.extend( true, _opts, {
                        node : {
                            fillStyle : "#ececec"
                        }
                    } )
                }

                graphsOpt.push( _opts );
            }
        } );
        var opts = {
            coordinate : this._opts.coordinate,
            graphs : graphsOpt
        };

        var thumbChart = new chartConstructor(cloneEl, me._data, opts, me.graphsMap, me.componentsMap);
        thumbChart.draw();

        return {
            thumbChart: thumbChart,
            cloneEl: cloneEl
        }
    }

    _init_components_datazoom()
    {
        var me = this;

        me.padding.bottom += me.dataZoom.h;

        this.components.push( {
            type : "once",
            plug : {
                draw: function(){
                    var _dataZoom = new me.componentsMap.dataZoom( me._getDataZoomOpt() , me._getCloneChart() );
                    me.components.push( {
                        type : "dataZoom",
                        plug : _dataZoom
                    } ); 
                    me.graphsSprite.addChild( _dataZoom.sprite );
                }
            }
        } );
    }

    _getDataZoomOpt()
    {
        var me = this;
        //初始化 datazoom 模块
        var dataZoomOpt = _.extend(true, {
            w: me._coordinate.width,
            pos: {
                x: me._coordinate.origin.x,
                y: me._coordinate.origin.y + me._coordinate._xAxis.height
            },
            dragIng: function(range) {
                var trigger = {
                    name : "dataZoom",
                    left :  me.dataZoom.range.start - range.start,
                    right : range.end - me.dataZoom.range.end
                };

                _.extend( me.dataZoom.range , range );
                me.resetData( me._data , trigger );
                me.fire("dataZoomDragIng");
            },
            dragEnd: function(range) {
                me.updateChecked && me.updateChecked();
                me.fire("dataZoomDragEnd");
            }
        }, me.dataZoom);

        return dataZoomOpt
    }
    //datazoom end


    //markLine begin
    _init_components_markline()
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

            if( ML.yAxisAlign ){
                //如果有配置yAxisAlign，就直接通过yAxisAlign找到对应的
                _yAxis = me._coordinate._yAxis[ ML.yAxisAlign=="left"?0:1 ];
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

                        var _fstyle = "#777";
                        var fieldMap = me._coordinate.getFieldMapOf( field );
                        if( fieldMap ){
                            _fstyle = fieldMap.color;
                        };
                        var lineStrokeStyle =  ML.line && ML.line.strokeStyle || _fstyle;
                        var textFillStyle = ML.text && ML.text.fillStyle || _fstyle;
        
                        me.creatOneMarkLine( ML, y, _yAxis, lineStrokeStyle, textFillStyle, field );
                    }
                }
            } );

        } );
    }

    creatOneMarkLine( ML, yVal, _yAxis, lineStrokeStyle, textFillStyle, field )
    {
        var me = this;
        var o = {
            w: me._coordinate.width,
            h: me._coordinate.height,
            yVal: yVal,
            origin: {
                x: me._coordinate.origin.x,
                y: me._coordinate.origin.y
            },
            line: {
                list: [
                    [0, 0],
                    [me._coordinate.width, 0]
                ]
                //strokeStyle: lineStrokeStyle
            },
            text: {
                fillStyle: textFillStyle
            },
            field: field
        };

        if( lineStrokeStyle ){
            o.line.strokeStyle = lineStrokeStyle;
        }

        var _markLine = new me.componentsMap.markLine( _.extend( true, ML, o) , _yAxis );
        me.components.push( {
            type : "markLine",
            plug : _markLine
        } );
        me.graphsSprite.addChild( _markLine.sprite );
    }
    //markLine end


    _init_components_markpoint() 
    {
    }

    _init_components_anchor( )
    {

    }

    _init_components_bartgi()
    {
        var me = this;
        
        if( !_.isArray( me.barTgi ) ){
            me.barTgi = [ me.barTgi ];
        };

        _.each( me.barTgi , function( barTgiOpt, i ){
            me.components.push( {
                type : "once",
                plug : {
                    draw: function(){

                        barTgiOpt = _.extend( true, {
                            origin: {
                                x: me._coordinate.origin.x,
                                y: me._coordinate.origin.y
                            }
                        } , barTgiOpt );

                        var _barTgi = new me.componentsMap.barTgi( barTgiOpt, me );
                        me.components.push( {
                            type : "barTgi",
                            plug : _barTgi
                        } ); 
                        me.graphsSprite.addChild( _barTgi.sprite );

                    }
                }
            } );
        } );
    }

    bindEvent()
    {
        var me = this;
        this.on("panstart mouseover", function(e) {
            var _tips = me.getComponentById("tips");
            if ( _tips ) {
                me._setTipsInfo.apply(me, [e]);
                _tips.show(e);
                me._tipsPointerShow( e, _tips, me._coordinate );
            };
        });
        this.on("panmove mousemove", function(e) {
            var _tips = me.getComponentById("tips");
            if ( _tips ) {
                me._setTipsInfo.apply(me, [e]);
                _tips.move(e);
                me._tipsPointerMove( e, _tips, me._coordinate );
            }
        });
        this.on("panend mouseout", function(e) {
            //如果e.toTarget有货，但是其实这个point还是在induce 的范围内的
            //那么就不要执行hide，顶多只显示这个点得tips数据
            var _tips = me.getComponentById("tips");
            if ( _tips && !( e.toTarget && me._coordinate.induce.containsPoint( me._coordinate.induce.globalToLocal(e.target.localToGlobal(e.point) )) )) {
                _tips.hide(e);
                me._tipsPointerHide( e, _tips, me._coordinate );
            }
        });
        this.on("tap", function(e) {
            var _tips = me.getComponentById("tips");
            if ( _tips ) {
                _tips.hide(e);
                me._setTipsInfo.apply(me, [e]);
                _tips.show(e);
                me._tipsPointerShow( e, _tips, me._coordinate );
            }
        });
    }

    //把这个点位置对应的x轴数据和y轴数据存到tips的info里面
    //方便外部自定义tip是的content
    _setTipsInfo(e)
    {
        e.eventInfo = this._coordinate.getTipsInfoHandler(e);

        //如果具体的e事件对象中有设置好了得e.eventInfo.nodes，那么就不再遍历_graphs去取值
        //比如鼠标移动到多柱子组合的具体某根bar上面，e.eventInfo.nodes = [ {bardata} ] 就有了这个bar的数据
        //那么tips就只显示这个bardata的数据
        if( !e.eventInfo.nodes || !e.eventInfo.nodes.length ){
            var nodes = [];
            var iNode = e.eventInfo.xAxis.ind;
            _.each( this._graphs, function( _g ){
                nodes = nodes.concat( _g.getNodesAt( iNode ) );
            } );
            e.eventInfo.nodes = nodes;
        }

        e.eventInfo.dataZoom = this.dataZoom;
        e.eventInfo.rowData = this.dataFrame.getRowData( iNode );
    }

    _tipsPointerShow( e, _tips, _coor )
    {
        if( !_tips.pointer ) return;
        var el = this.tipsPointer;        
        var y = _coor.origin.y - _coor.height;

        if( !el ){
            if( _tips.pointer == "line" ){
                var x = _coor.origin.x + e.eventInfo.xAxis.x;
                el = new Line({
                    //xyToInt : false,
                    context : {
                        x : x,
                        y : y,
                        start : {
                            x : 0,
                            y : 0
                        },
                        end : {
                            x : 0,
                            y : _coor.height
                        },
                        lineWidth : 1,
                        strokeStyle : "#cccccc"
                    }
                });
            };
            if( _tips.pointer == "shadow" ){
                var x = _coor.origin.x + e.eventInfo.xAxis.x - _coor._xAxis.ceilWidth/2;
                el = new Rect({
                    //xyToInt : false,
                    context : {
                        width : _coor._xAxis.ceilWidth,
                        height : _coor.height,
                        x : x,
                        y : y,
                        fillStyle : "#cccccc",
                        globalAlpha : 0.3
                    }
                });
            };
            
            this.graphsSprite.addChild( el, 0 );
            this.tipsPointer = el;
        } else {
            el.animate( {
                x : x,
                y : y
            } , {
                duration : 200
            });
        }
    }

    _tipsPointerHide( e, _tips, _coor )
    {
        if( !_tips.pointer  || !this.tipsPointer ) return;
        this.tipsPointer.destroy();
        this.tipsPointer = null;
    }

    _tipsPointerMove( e, _tips, _coor )
    {
        if( !_tips.pointer ) return;
        var el = this.tipsPointer;
        var x = _coor.origin.x + e.eventInfo.xAxis.x;
        if( _tips.pointer == "shadow" ){
            x = _coor.origin.x + e.eventInfo.xAxis.x - _coor._xAxis.ceilWidth/2;
        };
        var y = _coor.origin.y - _coor.height;

        if( x == el.__targetX ){
            return;
        };

        if( el.__animation ){
            el.__animation.stop();
        };
        el.__targetX = x;
        el.__animation = el.animate( {
            x : x,
            y : y
        } , {
            duration : 200,
            onComplete : function(){
                delete el.__targetX;
                delete el.__animation;
            }
        })
    }
}