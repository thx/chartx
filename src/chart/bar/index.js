import Chart from "../descartes"
import Canvax from "canvax2d"

import {numAddSymbol} from "../../utils/tools"
import Coordinate from "../../components/descartes/index"
import Graphs from "./graphs"
import Tips from "../../components/tips/index"

const _ = Canvax._;

export default class Bar extends Chart
{
    constructor( node, data, opts )
    {
        super( node, data, opts );

        this.type = "bar";
        
        //目前只有 bar有 checked 设置
        this._checkedList = []; //所有的选择对象
        this._currCheckedList = []; //当前可可视范围内的选择对象(根据dataZoom.start, dataZoom.end 过滤)

        //如果需要绘制百分比的柱状图
        if (opts.graphs && opts.graphs.proportion) {
            this._initProportion(node, data, opts);
        } else {
            _.extend( true, this, opts);
        };

        this.dataFrame = this.initData(data);
        //一些继承自该类的 constructor 会拥有_init来做一些覆盖，比如横向柱状图,柱折混合图...
        this._init && this._init(node, data, opts);
        this.draw();

    }

    draw( opt )
    {
        !opt && (opt ={});
        this.setStages(opt);
        if (this.rotate) {
            this._rotate(this.rotate);
        };
        this._initModule( opt ); //初始化模块  
        this.initPlugsModules( opt ); //初始化组件
        this._startDraw( opt ); //开始绘图
        
        this.drawPlugs( opt );  //绘图完，开始绘制插件

        if( this._coordinate.horizontal ){
            this._horizontal();
        };

        this.inited = true;
    }

    _startDraw(opt)
    {
        var me = this;
        !opt && (opt ={});

        //先绘制好坐标系统
        this._coordinate.draw( opt );

        //然后绘制主图形区域
        this._graphs.on( "complete", function(g) {
            me.fire("complete");
        });
        this._graphs.draw({
            w: this._coordinate.graphsWidth,
            h: this._coordinate.graphsHeight,
            pos: {
                x: this._coordinate.graphsX,
                y: this._coordinate.graphsY
            },
            sort: this._coordinate._yAxis.sort,
            inited: this.inited,
            resize: opt.resize
        });

        this.bindEvent();
    }
    
    _initModule(opt)
    {
        var me = this
        //首先是创建一个坐标系对象
        this._coordinate = new Coordinate( this.coordinate, this );
        this.core.addChild( this._coordinate.sprite );

        this._graphs = new Graphs(this.graphs, this);
        this.core.addChild(this._graphs.sprite);

        this._tips = new Tips(this.tips, this.canvax.domView);
        
        this.stageTip.addChild(this._tips.sprite);

    }

    _reset( opt , e )
    {
        var me = this;
        opt = !opt ? this : opt;
        me._removeChecked();
        this._coordinate.reset( opt.coordinate, this.dataFrame );
        this._graphs.reset( opt.graphs );
        this.plugsReset( opt , e );
    }

    //TODO：bar中用来改变yAxis.field的临时 方案
    add( field )
    {
        var displayObj = this._coordinate.getDisplayObjectOfField( field );
        if( !displayObj ) return;
        if( displayObj.enabled ) return;

        this._fieldChange(field , displayObj.yAxis );

        this._graphs.clean();
        this._reset( this );
    }

    remove( field )
    {
        var displayObj = this._coordinate.getDisplayObjectOfField( field );
        if( !displayObj ) return;
        if( !displayObj.enabled ) return;

        this._fieldChange(field, displayObj.yAxis);

        this._graphs.clean();
        this._reset( this );
    }

    //TODO: 这里目前是把graphs删除了重新绘制， 后续会在graphs提供add和remove来实现更加精细的操作
    //field改变的字段， _yAxis改变的字段对应的y轴
    _fieldChange(field, _yAxis)
    {
        //先设置好yAxis.field
        this._coordinate.setFieldDisplay( field );
        var newDisplayFieldsMap = this._coordinate.getFieldsOfDisplay();


        if( _yAxis ){
            if( _.isArray( this.coordinate.yAxis ) ){
                if( _yAxis.place == "left" ){
                    this.coordinate.yAxis[0].field =  newDisplayFieldsMap.left;
                } else {
                    this.coordinate.yAxis[1].field =  newDisplayFieldsMap.right;
                }
            } else {
                this.coordinate.yAxis.field = newDisplayFieldsMap.left;
            };
        }
    }
    


    //横向比例柱状图
    _initProportion(node, data, opts) 
    {
        !opts.tips && (opts.tips = {});

        opts.tips = _.extend(true, {
            content: function(info) {
                
                var str = "<table style='border:none'>";
                var self = this;
                _.each(info.nodesInfoList, function(node, i) {
                    str += "<tr style='color:" + (node.color || node.fillStyle) + "'>";
                   
                    var tsStyle="style='border:none;white-space:nowrap;word-wrap:normal;'";
                
                    str += "<td "+tsStyle+">" + node.field + "：</td>";
                    str += "<td "+tsStyle+">" + numAddSymbol(node.value);
                    if( node.vCount ){
                        str += "（" + Math.round(node.value / node.vCount * 100) + "%）";
                    };

                    str +="</td></tr>";
                });
                str += "</table>";
                return str;
            }
        } , opts.tips );

        _.extend(true, this, opts);
        _.each( _.flatten( [this.coordinate.yAxis] ) ,function( yAxis ){
            _.extend(true, yAxis, {
                dataSection: [0, 20, 40, 60, 80, 100],
                text: {
                    format: function(n) {
                        return n + "%"
                    }
                }
            });
        });
       
        !this.graphs && (this.graphs = {});
        _.extend(true, this.graphs, {
            bar: {
                radius: 0
            }
        });
    }

    //绘制图例
    drawLegend( _legend )
    {
        _legend.pos( { 
            x : this._coordinate.graphsX 
        } );
        for (var f in this._graphs._yAxisFieldsMap) {
            var ffill = this._graphs._yAxisFieldsMap[f].fillStyle;
            _legend.setStyle(f, {
                fillStyle: ffill
            });
        };
    }

    //datazoom begin
    drawDataZoom( _datazoom ) 
    {
        //TODO: 后续会修改在这里回掉一个_datazoom实例，然后在这里draw
        var me = this;
        //初始化 datazoom 模块
        var dataZoomOpt = _.extend(true, {
            w: me._coordinate.graphsWidth,
            pos: {
                x: me._coordinate.graphsX,
                y: me._coordinate.graphsY + me._coordinate._xAxis.height
            },
            dragIng: function(range , pixRange , count , width) {
                me.dataZoom.range = range;
                me.resetData( me._data , {
                    trigger : "dataZoom"
                });

                me._removeChecked();

                me.fire("dataZoomDragIng");
            },
            dragEnd: function(range) {
                me._updateChecked();
            }
        }, me.dataZoom);

        return dataZoomOpt
    }

    getCloneChart() 
    {
        return {
            graphs: {
                bar: {
                    fillStyle: this.dataZoom.normalColor || "#ececec"
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

    drawMarkLine( ML, yVal, _yAxis , field)
    {

        var _fstyle = field ? this._graphs._yAxisFieldsMap[field].fillStyle : "#999";
        var lineStrokeStyle =  ML.line && ML.line.strokeStyle || _fstyle;
        var textFillStyle = ML.text && ML.text.fillStyle || _fstyle;

        this.creatOneMarkLine( ML, yVal, _yAxis, lineStrokeStyle, textFillStyle, field );

    }
    //markLine end

    //markpoint begin
    drawMarkPoint() 
    {
        var me = this;

        me.plugs.push({
            type: "once",
            plug: {
                draw: function() {

                    var g = me._graphs;
                    var gOrigin = {
                        x: me._coordinate.graphsX + g.bar._width / 2,
                        y: me._coordinate.graphsY - 3
                    };
                    var _t = me.markPoint.markTo;

                    _.each(g.data, function(group, i) {
                        _.each(group, function(hgroup) {
                            _.each(hgroup, function(bar) {
                                if (_t && !((_.isArray(_t) && _.indexOf(_t, bar.field) >= 0) || (_t === bar.field) || _.isFunction(_t))) {
                                    return;
                                };

                                var barObj = _.clone(bar);
                                barObj.x += gOrigin.x;
                                barObj.y += gOrigin.y;
                                var mpCtx = {
                                    value: barObj.value,
                                    shapeType: "droplet",
                                    markTo: barObj.field,
                                    //注意，这里视觉上面的分组和数据上面的分组不一样，所以inode 和 iNode 给出去的时候要反过来
                                    iGroup: barObj.iGroup,
                                    iNode: barObj.iNode,
                                    iLay: barObj.iLay,
                                    point: {
                                        x: barObj.x,
                                        y: barObj.y
                                    }
                                };

                                if (_.isFunction(_t) && !_t(mpCtx)) {
                                    //如果MarkTo是个表达式函数，返回为false的话
                                    return;
                                };

                                me.creatOneMarkPoint(me._opts, mpCtx);

                            });
                        });
                    });

                }
            }
        });
    }
    //markpoint end

    //checked相关 begin
    getCheckedCurrList() 
    {
        var me = this
        return _.filter(me._getCurrCheckedList(), function(o) {
            return o
        })
    }

    getCheckedList() 
    { //获取选择之后的对象列表 列表中不含空对象 [eventInfo,evnetInfo,....]
        var me = this
        return _.filter(me._checkedList, function(o) {
            return o
        })
    }

    checkAt( index )
    {
        var me = this
        var i = index - me.dataZoom.range.start
        var o = me._graphs.getInfo(i)
        me._checkedList[index] = o
        me._checkedBar({
            iNode: i,
            checked: true
        });
        me._checkedMiniBar({
            iNode: index,
            checked: true
        });
        o.iNode = index;
        me.fire('checked', {
            eventInfo: o
        });
    }

    uncheckAt(index)
    { //取消选择某个对象 index是全局index
        var me = this;
        var i = index - me.dataZoom.range.start;
        if (me._checkedList[index]) {
            me._checked(me._graphs.getInfo(i));
        };
    }

    uncheckAll()
    {
        for (var i = 0, l = this._checkedList.length; i < l; i++) {
            var obj = this._checkedList[i];
            if (obj) {
                this.uncheckAt(i);
            }
        };
        this._checkedList = [];
        this._currCheckedList = [];
    }

    checkOf(xvalue)
    {
        //TODO:这个有个bug就是，如果当前dataRange是0-5， xvalue如果是在第6个的话，这里是无效的，因为getIndexOfVal取不到值
        //后续优化
        this.checkAt(this._coordinate._xAxis.getIndexOfVal(xvalue) + this.dataZoom.range.start);
    }

    uncheckOf(xvalue)
    {
        this.uncheckAt(this._coordinate._xAxis.getIndexOfVal(xvalue) + this.dataZoom.range.start);
    }

    getGroupChecked(e)
    {
        var checked = false;
        _.each(this.getCheckedList(), function(obj) {
            if (obj && obj.iNode == e.eventInfo.iNode) {
                checked = true;
            }
        });
        return checked
    }

    _removeChecked()
    {
        this._graphs.removeAllChecked()
    }

    _updateChecked()
    {
        var me = this
        me._currCheckedList = me._getCurrCheckedList()
        for (var a = 0, al = me._currCheckedList.length; a < al; a++) {
            var o = me._currCheckedList[a]
            me._checkedBar({
                iNode: o.iNode - me.dataZoom.range.start,
                checked: true,
            })
        }
    }

    _getCurrCheckedList()
    {
        var me = this
        return _.filter(me._checkedList, function(o) {
            if (o) {
                if (o.iNode >= me.dataZoom.range.start && o.iNode <= me.dataZoom.range.end) {
                    return o
                }
            }
        })
    }

    _checked(eventInfo)
    { //当点击graphs时 触发选中状态
        var me = this
        if (!me._graphs.checked.enabled) {
            return
        }
        var i = eventInfo.iNode + me.dataZoom.range.start

        var checked = true
        if (me._checkedList[i]) { //如果已经选中
            me._checkedList[i] = null
            checked = false
        } else { //如果没选中                           
            me._checkedList[i] = eventInfo
        }
        me._checkedBar({
            iNode: eventInfo.iNode,
            checked: checked
        })
        me._checkedMiniBar({
            iNode: i,
            checked: checked
        })

        eventInfo.iNode = i

        return checked;
    }

    _checkedBar($o)
    { //选择bar
        this._graphs.checkedAt($o)
    }

    _checkedMiniBar($o)
    { //选择缩略的bar
        if (this._opts.dataZoom) {
            var me = this
            var graphs = me.__cloneChart.thumbChart._graphs
            var fillStyle = ''
            if ($o.checked) {
                fillStyle = (me._opts.dataZoom.checked && me._opts.dataZoom.checked.fillStyle) || fillStyle
            }
            graphs.setBarStyle({
                iNode: $o.iNode,
                fillStyle: fillStyle
            })
        }
    }

    //checked相关 end

    _setTipsInfoHand(e)
    {
        this._setXaxisYaxisToTipsInfo(e);
    }

    bindEvent()
    {
        var me = this;
        this.core.on("panstart mouseover", function(e) {
            if( me._tips.enabled ){
                me._setTipsInfoHand(e);
                me._tips.show(e);
            };
            me.fire(e.type, e);
        });
        this.core.on("panmove mousemove", function(e) {
            if( me._tips.enabled ){
                me._setTipsInfoHand(e);
                me._tips.move(e);
            }
            me.fire(e.type, e);
        });
        this.core.on("panend mouseout", function(e) {
            if( me._tips.enabled ){
                me._tips.hide(e);
            }
            me.fire(e.type, e);
        });

        this.core.on("tap click dblclick mousedown mouseup", function(e) {
            var isAddStart = false;
            if (e.type == 'click') {
                //在click上面触发 checked
                me.fire('checkedBefor', e);
                
                if( e.eventInfo && e.eventInfo.iNode > -1 ){
                    if(me._checked( e.eventInfo ) ){
                        me.fire('checked' , e);
                    } else {
                        me.fire('unchecked' , e);
                    };
                    isAddStart = true;
                };
            };
            me._setTipsInfoHand(e , isAddStart);
            me.fire(e.type, e);
        });
    }

    //把这个点位置对应的x轴数据和y轴数据存到tips的info里面
    //方便外部自定义 tip 是的content
    _setXaxisYaxisToTipsInfo(e) 
    {
        var me = this;
        if (!e.eventInfo) {
            return;
        };

        _.each(e.eventInfo.nodesInfoList, function(node, i) {
            //把这个group当前是否选中状态记录
            if (me._checkedList[node.iNode + me.dataZoom.range.start]) {
                node.checked = true;
            } else {
                node.checked = false;
            };
        });
        e.eventInfo.xAxis = this._coordinate._xAxis.data[ e.eventInfo.iNode ];
        e.eventInfo.title = e.eventInfo.xAxis.field+"："+e.eventInfo.xAxis.layoutText;
        e.eventInfo.dataZoom = me.dataZoom;
        e.eventInfo.rowData = this.dataFrame.getRowData(e.eventInfo.iNode);
    }
}