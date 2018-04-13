import CoordBase from "../index"
import Canvax from "canvax2d"
import {parse2MatrixData} from "../../utils/tools"
import DataFrame from "../../utils/dataframe"
import CoordComponents from "../descartes/index"

const _ = Canvax._;
const Rect = Canvax.Shapes.Rect;
const Line = Canvax.Shapes.Line;

export default class Descartes extends CoordBase
{
    constructor( node, data, opts, graphsMap, componentsMap ){

        super( node, data, opts, graphsMap, componentsMap );

        //坐标系统
        this.CoordComponents = CoordComponents;
        this._coord = null;

    }

    //设置这个坐标系下面特有的 opts 默认值
    //以及往this上面写部分默认数据
    //在CoordBase中被调用
    setDefaultOpts( opts )
    {
        var me = this;
        this.coord = {
            xAxis : {
                //波峰波谷布局模型，默认是柱状图的，折线图种需要做覆盖
                layoutType    : "rule", //"peak",  
                //默认为false，x轴的计量是否需要取整， 这样 比如某些情况下得柱状图的柱子间隔才均匀。
                //比如一像素间隔的柱状图，如果需要精确的绘制出来每个柱子的间距是1px， 就必须要把这里设置为true
                posParseToInt : false
            }
        };

        opts = _.clone( opts );
        if( opts.coord.yAxis ){
            var _nyarr = [];
            //TODO: 因为我们的deep extend 对于数组是整个对象引用过去，所以，这里需要
            //把每个子元素单独clone一遍，恩恩恩， 在canvax中优化extend对于array的处理
            _.each( _.flatten([opts.coord.yAxis]) , function( yopt ){
                _nyarr.push( _.clone( yopt ) );
            } );
            opts.coord.yAxis = _nyarr;
        } else {
            opts.coord.yAxis = [];
        }

        //根据opt中得Graphs配置，来设置 coord.yAxis
        if( opts.graphs ){
            //有graphs的就要用找到这个graphs.field来设置coord.yAxis
            _.each( opts.graphs, function( graphs ){
                if( graphs.type == "bar" ){
                    //如果graphs里面有柱状图，那么就整个xAxis都强制使用 peak 的layoutType
                    me.coord.xAxis.layoutType = "peak";
                }
                if( graphs.field ){
                    //没有配置field的话就不绘制这个 graphs了
                    var align = "left"; //默认left
                    if( graphs.yAxisAlign == "right" ){
                        align = "right";
                    };

                    var optsYaxisObj = null;
                    optsYaxisObj = _.find( opts.coord.yAxis, function( obj, i ){
                        return obj.align == align || ( !obj.align && i == ( align == "left" ? 0 : 1 ));
                    } );
    
                    if( !optsYaxisObj ){
                        optsYaxisObj = {
                            align : align,
                            field : []
                        }
                        opts.coord.yAxis.push( optsYaxisObj );
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
        _.each( opts.coord.yAxis , function( yAxis , i ){
            if( !yAxis.align ){
                yAxis.align = i ?"right": "left";
            }
            if( yAxis.align == "left" ){
                _lys.push( yAxis );
            } else {
                _rys.push( yAxis );
            }
        } );
        opts.coord.yAxis = _lys.concat( _rys );

        var _orgDataLen = this._data.length; //如果原数据是json格式
        if( _.isArray( this._data[0] )){
            //如果原数据是行列式
            _orgDataLen = this._data.length - 1;
        };

        //预设dataZoom的区间数据
        this.dataZoom = {
            h: 25,
            range: {
                start: 0,
                end: _orgDataLen ? _orgDataLen - 1 : 0
            }
        };
        if( opts.dataZoom && opts.dataZoom.range ){
            if( "end" in opts.dataZoom.range && opts.dataZoom.range.end > this.dataZoom.range.end ){
                opts.dataZoom.range.end = this.dataZoom.range.end;
            };

            if( opts.dataZoom.range.end < opts.dataZoom.range.start ){
                opts.dataZoom.range.start = opts.dataZoom.range.end
            };
        };
        
        return opts;
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
        
        _.each( _.flatten(me._coord.fieldsMap) , function( map , i ){
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
                    field   : map.field,
                    ind     : map.ind,
                    color   : map.color,
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

        //clone的chart只需要coord 和 graphs 配置就可以了
        //因为画出来后也只需要拿graphs得sprite去贴图
        var graphsOpt = [];
        _.each( this._graphs, function( _g ){
            var _field = _g.enabledField || _g.field;
            
            if( _.flatten([_field]).length ) {

                var _opts = _.extend( true, {} , _g._opts );
                
                _opts.field = _field;
                if( _g.type == "bar" ){
                    _.extend(true, _opts , {
                        node: {
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
                        area: {
                            alpha: 1,
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
            coord : this._opts.coord,
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
            w: me._coord.width,
            pos: {
                x: me._coord.origin.x,
                y: me._coord.origin.y + me._coord._xAxis.height
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

    //rect cross begin
    _init_components_cross()
    {
        //原则上一个直角坐标系中最佳只设置一个cross
        var me = this;
        if( !_.isArray( me.cross ) ){
            me.cross = [ me.cross ];
        };
        _.each( me.cross, function( cross , i){
            me.components.push( {
                type : "once",
                plug : {
                    draw: function(){

                        var opts = _.extend( true, {
                            origin: {
                                x: me._coord.origin.x,
                                y: me._coord.origin.y
                            },
                            width : me._coord.width,
                            height : me._coord.height
                        } , cross );

                        var _cross = new me.componentsMap.cross( opts, me );
                        me.components.push( {
                            type : "cross"+i,
                            plug : _cross
                        } ); 
                        me.graphsSprite.addChild( _cross.sprite );

                    }
                }
            } );
        });
    }

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

            var _yAxis = me._coord._yAxis[0]; //默认为左边的y轴
            
            if( field ){
                //如果有配置markTo就从me._coord._yAxis中找到这个markTo所属的yAxis对象
                _.each( me._coord._yAxis, function( $yAxis, yi ){
                    var fs = _.flatten([ $yAxis.field ]);
                    if( _.indexOf( fs, field ) >= 0 ){
                        _yAxis = $yAxis;
                    }
                } );
            }

            if( ML.yAxisAlign ){
                //如果有配置yAxisAlign，就直接通过yAxisAlign找到对应的
                _yAxis = me._coord._yAxis[ ML.yAxisAlign=="left"?0:1 ];
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
                        var fieldMap = me._coord.getFieldMapOf( field );
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
            w: me._coord.width,
            h: me._coord.height,
            yVal: yVal,
            origin: {
                x: me._coord.origin.x,
                y: me._coord.origin.y
            },
            line: {
                list: [
                    [0, 0],
                    [me._coord.width, 0]
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
                                x: me._coord.origin.x,
                                y: me._coord.origin.y
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



    //把这个点位置对应的x轴数据和y轴数据存到tips的info里面
    //方便外部自定义tip是的content
    setTipsInfo(e)
    {
        
        e.eventInfo = this._coord.getTipsInfoHandler(e);

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
    }


    //TODO：这个可以抽一个tipsPointer组件出来
    _tipsPointerShow( e, _tips, _coord )
    {
        
        if( !_tips.pointer ) return;

        //console.log("show");

        var el = this._tipsPointer;        
        var y = _coord.origin.y - _coord.height;
        var x = 0;
        if( _tips.pointer == "line" ){
            x = _coord.origin.x + e.eventInfo.xAxis.x;
        }
        if( _tips.pointer == "shadow" ){
            x = _coord.origin.x + e.eventInfo.xAxis.x - _coord._xAxis.ceilWidth/2;
            if( e.eventInfo.xAxis.ind < 0 ){
                //当没有任何数据的时候， e.eventInfo.xAxis.ind==-1
                x = _coord.origin.x;
            }
        }

        if( !el ){
            if( _tips.pointer == "line" ){
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
                            y : _coord.height
                        },
                        lineWidth : 1,
                        strokeStyle : "#cccccc"
                    }
                });
            };
            if( _tips.pointer == "shadow" ){
                el = new Rect({
                    //xyToInt : false,
                    context : {
                        width : _coord._xAxis.ceilWidth,
                        height : _coord.height,
                        x : x,
                        y : y,
                        fillStyle : "#cccccc",
                        globalAlpha : 0.3
                    }
                });
            };
            
            this.graphsSprite.addChild( el, 0 );
            this._tipsPointer = el;
        } else {
            if( _tips.pointerAnimate && _coord._xAxis.layoutType != "proportion" ){
                if( el.__animation ){
                    el.__animation.stop();
                };
                el.__animation = el.animate( {
                    x : x,
                    y : y
                } , {
                    duration : 200
                });
            } else {
                el.context.x = x;
                el.context.y = y;
            }
        }
    }

    _tipsPointerHide( e, _tips, _coord )
    {
        if( !_tips.pointer  || !this._tipsPointer ) return;
        //console.log("hide");
        this._tipsPointer.destroy();
        this._tipsPointer = null;
    }

    _tipsPointerMove( e, _tips, _coord )
    {
        if( !_tips.pointer ) return;

        //console.log("move");

        var el = this._tipsPointer;
        var x = _coord.origin.x + e.eventInfo.xAxis.x;
        if( _tips.pointer == "shadow" ){
            x = _coord.origin.x + e.eventInfo.xAxis.x - _coord._xAxis.ceilWidth/2;
            if( e.eventInfo.xAxis.ind < 0 ){
                //当没有任何数据的时候， e.eventInfo.xAxis.ind==-1
                x = _coord.origin.x;
            }
        };
        var y = _coord.origin.y - _coord.height;

        if( x == el.__targetX ){
            return;
        };

        if( _tips.pointerAnimate && _coord._xAxis.layoutType != "proportion"){
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
        } else {
            el.context.x = x;
            el.context.y = y;
        }
    }
}