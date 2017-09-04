import Chart from "../chart"
import Canvax from "canvax2d"
import {parse2MatrixData,numAddSymbol} from "../../utils/tools"
import xAxis from "../../components/xaxis/index"
import yAxis from "./yaxis"
import Back from "../../components/back/index"
import Graphs from "./graphs"
import Tip from "../../components/tips/index"
import dataFormat from "../../utils/dataformat"
import DataZoom from "../../components/datazoom/index"
import Legend from "../../components/legend/index"
import MarkLine from "../../components/markline/index"
import MarkPoint from "../../components/markpoint/index"
import _ from "underscore"

export default class Bar extends Chart
{
	constructor(node, data, opts)
	{
		super(node , data, opts);

		this.type = "bar"

        data = parse2MatrixData(data);

        this._node = node;
        this._data = data;
        this._opts = opts;

        this._xAxis = null;
        this.xAxis = {
            layoutType: "peak",   //波峰波谷布局模型
            posParseToInt: false, //true
        };

        this._yAxis = null;
        this._back = null;
        this._graphs = null;
        this._tip = null;
        this._checkedList = []; //所有的选择对象
        this._currCheckedList = []; //当前可可视范围内的选择对象(根据dataZoom.start, dataZoom.end 过滤)

        this.dataZoom = {
            h: 30,
            range: {
                start: 0,
                end: data.length - 1 //因为第一行是title
            }
        };

        if (opts.proportion) {
            this.proportion = opts.proportion;
            this._initProportion(node, data, opts);
        } else {
            _.deepExtend(this, opts);
        };

        this.dataFrame = this._initData(data);
        
        //吧原始的field转换为对应结构的显示树
        //["uv"] --> [{field:'uv',enabled:true , fillStyle: }]
        this._fieldsDisplayMap = this.__setFieldsDisplay( this._opts.yAxis.field || this._opts.yAxis.bar.field );
        
        //一些继承自该类的constructor 会拥有_init来做一些覆盖，比如横向柱状图
        this._init && this._init(node, data, opts);

        this.draw();
	}

	init(node, data, opts) {

    }

    /*
     * 如果只有数据改动的情况
     */
    resetData(data , e) 
    {
        this._data = parse2MatrixData( data );

        this.dataFrame = this._initData(data, this);

        this.__reset( this , e );

        this.fire("_resetData");
    }

    __reset( opt , e )
    {
        var me = this;
        opt = !opt ? this : opt;

        me._removeChecked();

        this._xAxis.reset({
            animation: false
        } , this.dataFrame.xAxis);

        this.setYasixDataFrame();

        this._yAxis.reset( {
            animation: false
        } , this.dataFrame.yAxis);

        if( this._data.length ){
            this._graphs.resetData(this._trimGraphs());
            this._graphs.grow(function() {
                //callback
            }, {
                delay: 0
            });
        } else {
            this._graphs.clean();
            this._tip.hide();
        };

        this._plugsReset( opt , e );

    }

    //这里列举了所有可能影响到yAxis的 dataSection 的条件
    setYasixDataFrame()
    {
        if( this._graphs.average.enabled ){
            this.dataFrame.yAxis.org.push( [ this._getaverageData() ] );
        };
        if( this.markLine && this.markLine.y ){
            this.dataFrame.yAxis.org.push( [ this.markLine.y ] );
        };
    }

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

    //和原始field结构保持一致，但是对应的field换成 {field: , enabled:}结构
    __setFieldsDisplay( fields )
    {
        if( _.isString(fields) ){
            fields = [fields];
        };
        var clone_fields = _.clone( fields );
        for(var i = 0 , l=fields.length ; i<l ; i++) {
            if( _.isString( fields[i] ) ){
                clone_fields[i] = {
                    field : fields[i],
                    enabled : true
                }
            }
            if( _.isArray( fields[i] ) ){
                clone_fields[i] = this.__setFieldsDisplay( fields[i] );
            }
        };
        return clone_fields;
    }

    _getFieldsOfDisplay( maps )
    {
        var fields = [];
        !maps && ( maps = this._fieldsDisplayMap );
        for( var i=0,l=maps.length ; i<l ; i++ ){
            if( _.isArray(maps[i]) ){
                var _fs = this._getFieldsOfDisplay( maps[i] );
                _fs.length>0 && (fields[i] = _fs);
            } else if( maps[i].field && maps[i].enabled ) {
                fields[i] = maps[i].field;
            };
        };
        return fields;
    }

    //设置_fieldsDisplayMap中对应field 的 enabled状态
    _setFieldDisplay( field )
    {
        var me = this;
        function set( maps ){
            _.each( maps , function( map , i ){
                if( _.isArray( map ) ){
                    set( map )
                } else if( map.field && map.field == field ) {
                    map.enabled = !map.enabled;
                }
            } );
        }
        set( me._fieldsDisplayMap );
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
        this.checkAt(this._xAxis.getIndexOfVal(xvalue) + this.dataZoom.range.start);
    }

    uncheckOf(xvalue) 
    {
        this.uncheckAt(this._xAxis.getIndexOfVal(xvalue) + this.dataZoom.range.start);
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



    _setStages() 
    {
        this.core = new Canvax.Display.Sprite({
            id: 'core'
        });
        this.stageBg = new Canvax.Display.Sprite({
            id: 'bg'
        });
        this.stageTip = new Canvax.Display.Sprite({
            id: 'tip'
        });

        this.stage.addChild(this.stageBg);
        this.stage.addChild(this.core);
        this.stage.addChild(this.stageTip);

        if (this.rotate) {
            this._rotate(this.rotate);
        }
    }

    draw( e ) 
    {
        
        e = e || {};

        this._setStages(e);

        this._initModule(e); //初始化模块  

        this._startDraw(e); //开始绘图

        this._drawEnd(e); //绘制结束，添加到舞台

        this.inited = true;

    }

    _initData(data, opt) 
    {

        var d;
        if (this._opts.dataZoom) {
            var datas = [data[0]];
            datas = datas.concat(data.slice(this.dataZoom.range.start + 1, this.dataZoom.range.end + 1 + 1));
            d = dataFormat.apply(this, [datas, opt]);
        } else {
            d = dataFormat.apply(this, arguments);
        };

        //var d = dataFormat.apply(this, arguments);

        _.each(d.yAxis.field, function(field, i) {
            if (!_.isArray(field)) {
                field = [field];
                d.yAxis.org[i] = [d.yAxis.org[i]];
            }
        });
        return d;
    }

    _getaverageData() 
    {
        var averageData = [];
        var me = this;
        if (this._graphs && this._graphs.average && this._graphs.average.data) {
            return this._graphs.average.data
        };
        if (this._graphs.average.enabled) {
            _.each(this.dataFrame.data, function(fd, i) {
                if (fd.field == me._graphs.average.field) {
                    averageData = fd.data;
                }
            });
        };
        this._graphs.average.data = averageData;
        return averageData;
    }

    _setaverageLayoutData() 
    {
        var layoutData = [];
        var me = this;
        if (this._graphs.average.enabled) {
            var maxYAxis = this._yAxis.dataSection[this._yAxis.dataSection.length - 1];
            _.each(this._graphs.average.data, function(fd, i) {
                layoutData.push({
                    value: fd,
                    y: -(fd - me._yAxis.bottomNumber) / Math.abs(maxYAxis - me._yAxis.bottomNumber) * me._yAxis.yGraphsHeight
                });
            });
            this._graphs.average.layoutData = layoutData;
        };
    }

    _initModule() 
    {
        //因为tips放在graphs中，so 要吧tips的conf传到graphs中
        this._graphs = new Graphs(
            this.graphs,
            this
        );
        this.core.addChild(this._graphs.sprite);

        this._xAxis = new xAxis(this.xAxis, this.dataFrame.xAxis);
        this.core.addChild(this._xAxis.sprite);

        this.setYasixDataFrame();

        this._yAxis = new yAxis(this.yAxis, this.dataFrame.yAxis);
        this.core.addChild(this._yAxis.sprite);

        this._back = new Back(this.back , this._yAxis , this._xAxis);
        this.stageBg.addChild(this._back.sprite);

        this._tip = new Tip(this.tips, this.canvax.domView);
        this.stageTip.addChild(this._tip.sprite);

    }

    _startDraw(opt) 
    {
        var me = this;

        var w = (opt && opt.w) || this.width;
        var h = (opt && opt.h) || this.height;
        var y = parseInt(h - this._xAxis.height);

        //初始化一些在开始绘制的时候就要处理的plug，这些plug可能会影响到布局，比如legend，datazoom
        me._initPlugs_computLayout( opt );

        var graphsH = y - this.padding.top - this.padding.bottom;

        //绘制yAxis
        this._yAxis.draw({
            pos: {
                x: this.padding.left,
                y: y - this.padding.bottom
            },
            yMaxHeight: graphsH
        });

        var _yAxisW = this._yAxis.width;

        //绘制x轴
        this._xAxis.draw({
            graphh: h - this.padding.bottom,
            graphw: w - this.padding.right,
            yAxisW: _yAxisW
        });
        if (this._xAxis.yAxisW != _yAxisW) {
            //说明在xaxis里面的时候被修改过了。那么要同步到yaxis
            this._yAxis.resetWidth(this._xAxis.yAxisW);
            _yAxisW = this._xAxis.yAxisW;
        };

        var _graphsH = this._yAxis.yGraphsHeight;
        //绘制背景网格
        this._back.draw({
            w: this._xAxis.xGraphsWidth,
            h: _graphsH,
            xAxis: {
                data: this._yAxis.layoutData
            },
            yAxis: {
                data: this._xAxis.layoutData,
                xDis: this._xAxis.xDis
            },
            pos: {
                x: _yAxisW,
                y: y - this.padding.bottom
            }
        } , this);

        this._setaverageLayoutData();

        
        //绘制主图形区域
        var gd = this._trimGraphs().data;
        this._graphs.draw( gd , {
            w: this._xAxis.xGraphsWidth,
            h: this._yAxis.yGraphsHeight,
            pos: {
                x: _yAxisW,
                y: y - this.padding.bottom
            },
            yDataSectionLen: this._yAxis.dataSection.length,
            sort: this._yAxis.sort
        });

        me._initPlugs( opt );

    }



    //把这个点位置对应的x轴数据和y轴数据存到tips的info里面
    //方便外部自定义 tip 是的content
    _setXaxisYaxisToTipsInfo(e, isAddStart) 
    {
        if (!e.eventInfo) {
            return;
        };

        e.eventInfo.xAxis = {
            field: this.dataFrame.xAxis.field,
            value: this.dataFrame.xAxis.org[0][e.eventInfo.iNode]
        };
        var me = this;

        _.each(e.eventInfo.nodesInfoList, function(node, i) {
            //把这个group当前是否选中状态记录
            if (me._checkedList[node.iNode + me.dataZoom.range.start]) {
                node.checked = true;
            } else {
                node.checked = false;
            };
        });

        e.eventInfo.dataZoom = me.dataZoom;

        e.eventInfo.rowData = this.dataFrame.getRowData(e.eventInfo.iNode);
       
        if(!isAddStart){
            e.eventInfo.iNode += this.dataZoom.range.start;
        };
    }

    _trimGraphs(_xAxis, _yAxis) 
    {

        _xAxis || (_xAxis = this._xAxis);
        _yAxis || (_yAxis = this._yAxis);
        var xArr = _xAxis.data;
        var yArr = _yAxis.dataOrg;
        var hLen = _yAxis.field.length; //bar的横向分组length

        var xDis1 = _xAxis.xDis;

        //x方向的二维长度，就是一个bar分组里面可能有n个子bar柱子，那么要二次均分
        var xDis2 = xDis1 / (hLen + 1);
        
        //知道了xDis2 后 检测下 barW是否需要调整
        var barW = this._graphs.getBarWidth(xDis1, xDis2);

        var barDis = xDis2 - barW;
        if( this.graphs && this.graphs.bar && this.graphs.bar.xDis != undefined ){
            barDis = this.graphs.bar.xDis;
        };

        var maxYAxis = _yAxis.dataSection[_yAxis.dataSection.length - 1];
        var tmpData = [];
        var center = [],
            yValueMaxs = [],
            yLen = [];

        var me = this;

        var disLeft,disRight;
        disLeft = disRight = (xDis1 - barW*hLen - barDis*(hLen-1) ) / 2
        
        for (var b = 0; b < hLen; b++) {
            !tmpData[b] && (tmpData[b] = []);
            yValueMaxs[b] = 0;
            center[b] = {};
            var yArrList = yArr[b];

            _.each(yArrList, function(subv, v) {
                !tmpData[b][v] && (tmpData[b][v] = []);

                _.each(subv, function(val, i) {

                    if (!xArr[i]) {
                        return;
                    };

                    var vCount = 0;
                    if (me.proportion) {
                        //先计算总量
                        _.each(yArrList, function(team, ti) {
                            vCount += team[i]
                        });
                    };

                    //TODO：这里也是bar有自己计算x的公式， 要和line一样改造成调用xAxis的接口来计算
                    var x = xArr[i].x - xDis1 / 2 + xDis2 * (b + 1);
                    
                    var x = xArr[i].x - xDis1 / 2 + disLeft + barW*b + barDis*b  ;

                    var y = 0;
                    if (me.proportion) {
                        y = -val / vCount * _yAxis.yGraphsHeight;
                    } else {
                        y = _yAxis.getYposFromVal( val );
                    };

                    function _getFromY( tmpData, b, v, i, val, y, yBasePoint ){
                        var preData = tmpData[b][v - 1];
                        if( !preData ){
                            return yBasePoint.y;
                        };

                        var preY = preData[i].y;
                        var preVal = preData[i].value;
                        var yBaseNumber = yBasePoint.content;
                        if( val >= yBaseNumber ){
                            //如果大于基线的，那么就寻找之前所有大于基线的
                            if( preVal >= yBaseNumber ){
                                //能找到，先把pre的isLeaf设置为false
                                preData[i].isLeaf = false;
                                return preY;
                            } else {
                                return _getFromY( tmpData, b, v-1, i, val, y, yBasePoint );
                            }
                        } else {
                            if( preVal < yBaseNumber ){
                                //能找到，先把pre的isLeaf设置为false
                                preData[i].isLeaf = false;
                                return preY;
                            } else {
                                return _getFromY( tmpData, b, v-1, i, val, y, yBasePoint );
                            }
                        }
                    }

                    //找到其着脚点,一般就是 yAxis.basePoint
                    var fromY = _getFromY(tmpData, b, v, i, val, y, _yAxis.basePoint);
                    y += fromY - _yAxis.basePoint.y;


                    //如果有排序的话
                    //TODO:这个逻辑好像有问题
                    if (me._yAxis.sort && me._yAxis.sort == "desc") {
                        y = -(_yAxis.yGraphsHeight - Math.abs(y));
                    };

                    var node = {
                        value: val,
                        field: me._getTargetField(b, v, i, _yAxis.field),
                        fromX: x,
                        fromY: fromY,
                        x: x,
                        y: y,
                        yBasePoint: _yAxis.basePoint,
                        isLeaf: true,
                        xAxis: {
                            field: me._xAxis.field,
                            value: xArr[i].content,
                            layoutText: xArr[i].layoutText
                        }
                    };

                    if (me.proportion) {
                        node.vCount = vCount;
                    };

                    tmpData[b][v].push(node);

                    yValueMaxs[b] += Number(val)
                    yLen = subv.length
                });
            });
        };

        for (var a = 0, al = yValueMaxs.length; a < al; a++) {
            center[a].agValue = yValueMaxs[a] / yLen
            center[a].agPosition = -(yValueMaxs[a] / yLen - _yAxis.bottomNumber) / (maxYAxis - _yAxis.bottomNumber) * _yAxis.yGraphsHeight
        };
        //均值
        this.dataFrame.yAxis.center = center;

        return {
            data: tmpData
        };
    }

    _getTargetField(b, v, i, field) 
    {
        if (!field) {
            field = this._yAxis.field;
        };
        if (_.isString(field)) {
            return field;
        } else if (_.isArray(field)) {
            var res = field[b];
            if (_.isString(res)) {
                return res;
            } else if (_.isArray(res)) {
                return res[v];
            };
        }
    }

    _drawEnd() 
    {
        var me = this;

        //执行生长动画
        this._graphs.grow(function(g) {
            me._initPlugs_drawComplete( g );
        });

        this.bindEvent();
    }


    //所有plug触发更新
    _plugsReset(opt , e)
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


            if( p.type == "markLine" ){
                p.plug.reset({
                    line: {
                        y : p.plug._yAxis.getYposFromVal( p.plug.value )
                    }
                } ,i);
                return
            };
            
            if( p.type == "dataZoom" ){
                if(!e || (e && e.trigger != "dataZoom")){
                    me.__cloneChart = me._getCloneBar();
                    p.plug.reset( {
                        count : me._data.length-1
                    } , me.__cloneChart.thumbBar._graphs.sprite );
                }
                return
            }

            p.plug.reset && p.plug.reset();
            
        }); 
    }

    //这部分在startDraw开始的时候，因为要计算layout，但是不依赖其他绘图模块
    _initPlugs_computLayout(e)
    {

        if (this._opts.legend && e.trigger != "legend"){
            this._initLegend( e );
        };
        if (this._opts.dataZoom){
            //处理好因为dataZoom带来的layout的变动，和准备好initDataZoom需要的__cloneChart
            !this.inited && (this.padding.bottom += this.dataZoom.h);
            this.__cloneBar = this._getCloneBar();
        };

    }

    //这个部分就是依赖其他的绘图布局组件， 在 end draw就 马上要绘制的plugs，不在graphs的animate后面排队
    _initPlugs(e)
    {
        
        if (this._opts.legend && e.trigger != "legend"){
            this._setLegendPosAndStyle()
        }
        if (this._opts.dataZoom){
            this._initDataZoom( e );
        };
    }

    //这部分依赖于graphs的animate排队。等graphs的入场动画结束后绘制
    _initPlugs_drawComplete(e)
    {
        if (this._opts.markLine) {
            this._initMarkLine(e);
        };
        if (this._opts.markPoint) {
            this._initMarkPoint(e);
        };
    }


    //横向比例柱状图
    _initProportion(node, data, opts) 
    {
        !opts.tips && (opts.tips = {});

        opts.tips = _.deepExtend({
            content: function(info) {
                var str = "<table style='border:none'>";
                var self = this;
                _.each(info.nodesInfoList, function(node, i) {
                    str += "<tr style='color:" + (node.color || node.fillStyle) + "'>";
                    var prefixName = self.prefix[i];
                    var tsStyle="style='border:none;white-space:nowrap;word-wrap:normal;'";
                    if (prefixName) {
                        str += "<td "+tsStyle+">" + prefixName + "：</td>";
                    } else {
                        if (node.field) {
                            str += "<td "+tsStyle+">" + node.field + "：</td>";
                        }
                    };
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

        _.deepExtend(this, opts);
        _.deepExtend(this.yAxis, {
            dataSection: [0, 20, 40, 60, 80, 100],
            text: {
                format: function(n) {
                    return n + "%"
                }
            }
        });

        !this.graphs && (this.graphs = {});
        _.deepExtend(this.graphs, {
            bar: {
                radius: 0
            }
        });
    }



    //legend组件 begin
    _initLegend(e)
    {

        var me = this;
        if( !this.legend || (this.legend && "enabled" in this.legend && !this.legend.enabled) ) return;
        //设置legendOpt
        var legendOpt = _.deepExtend({
            enabled:true,
            label  : function( info ){
               return info.field
            },
            onChecked : function( field ){
               me._resetOfLengend( field );
            },
            onUnChecked : function( field ){
               me._resetOfLengend( field );
            }
        } , this._opts.legend);
        
        var _legend = new Legend( this._getLegendData() , legendOpt );
        this.stage.addChild( _legend.sprite );
        _legend.pos( {
            x : 0,
            y : this.padding.top
        } );

        this.padding.top += _legend.height;

        this.plugs.push( {
            type : "legend",
            plug : _legend
        } );
    }

    //TODO：bar中用来改变yAxis.field的临时 方案
    _resetOfLengend( field )
    {
        var me = this;
        
        //先设置好yAxis.field
        me._setFieldDisplay( field );
        _.deepExtend(this, {
            yAxis : {
                field : me._getFieldsOfDisplay()
            }
        });

        var _legend = _.find( me.plugs, function( plug ){ return plug.type == "legend" } ).plug;

        if( this.graphs && this.graphs.bar && _.isFunction( this.graphs.bar.fillStyle )){
            var _fillStyle = this.graphs.bar.fillStyle;
            this.graphs.bar.fillStyle = function( f ){
                var res = _fillStyle( f );
                if( !res ){
                    if( _legend ){
                        res = _legend.getStyle(f.field).fillStyle;
                    }
                }
                return res;
            }
        } else {
            _.deepExtend(this, {
                graphs : {
                    bar : {
                        fillStyle : function( f ){
                            if( _legend ){
                                return _legend.getStyle(f.field).fillStyle;
                            }
                        }
                    }
                }
            });
        }

        for (var i=0,l=this.canvax.children.length;i<l;i++){
            var stage = this.canvax.getChildAt(i);
            for( var s = 0 , sl=stage.children.length ; s<sl ; s++){
                var sp = stage.getChildAt(s);
                if(sp.id == "LegendSprite" || sp.id == "legend_tip"){
                    continue
                };
                stage.getChildAt(s).destroy();
                s--;
                sl--;
            }
        };
        
        this.dataFrame = this._initData( this._data );
        this.draw({
            trigger : "legend"
        });
    }

    //只有field为多组数据的时候才需要legend
    _getLegendData()
    {
        var me   = this;
        var data = [];
        _.each( _.flatten(me.dataFrame.yAxis.field) , function( f , i ){
            data.push({
                field : f,
                value : null,
                fillStyle : null
            });
        });
        return data;
    }

    _setLegendPosAndStyle()
    {
        
        var legend = _.find( this.plugs, function( plug ){ return plug.type == "legend" } ).plug;
        var _yAxisW = this._yAxis.width;
        legend.pos( { x : _yAxisW } );
        for( var f in this._graphs._yAxisFieldsMap ){
            var ffill = this._graphs._yAxisFieldsMap[f].fillStyle;
            legend.setStyle( f , {fillStyle : ffill} );
        };
    }
    //legend end

    //datazoom begin
    _initDataZoom() 
    {
        var me = this;

        //初始化 datazoom 模块

        var dataZoomOpt = _.deepExtend({
            w: me._xAxis.xGraphsWidth,
            count: me._data.length-1, //_data第一行是title，所以正式的count应该是 length-1
            //h : me._xAxis.height,
            pos: {
                x: me._xAxis.pos.x,
                y: me._xAxis.pos.y + me._xAxis.height
            },
            dragIng: function(range , pixRange , count , width) {

                //完美解决dataZoom对柱状图的区间选择问题
                var itemW = width/count;
                var start = 0;
                for( var i = 0; i<count; i++ ){
                    if((itemW*i + itemW/2) > pixRange.start){
                        start = i;
                        break;
                    }
                }
                var end = 0;
                for( var i = count-1 ; i>=0 ; i-- ){
                    if( (itemW*i + itemW/2) < pixRange.end ){
                        end = i;
                        break;
                    }
                }
                //完美解决dataZoom对柱状图的区间选择问题


                if( me.dataZoom.range.start == start && me.dataZoom.range.end == end ) {
                    return;
                };
                me.dataZoom.range.start = start;
                me.dataZoom.range.end = end;

                me.resetData( me._data , {
                    trigger : "dataZoom"
                });

                me._removeChecked();

                
                //console.log("start:"+me.dataZoom.range.start+"___end:"+me.dataZoom.range.end)
                /*
                me.dataFrame = me._initData(me._data, me._opts);
                me._xAxis.reset({
                    animation: false
                } , me.dataFrame.xAxis );

                me._graphs.average.data = null;
                me._graphs.w = me._xAxis.xGraphsWidth;
                me._getaverageData();
                me._setaverageLayoutData();

                me._graphs.resetData(me._trimGraphs());
                me._graphs.grow(function() {
                    //callback
                }, {
                    delay: 0,
                    easing: "Quadratic.Out",
                    duration: 300
                });

                me._removeChecked();
                */

                me.fire("_dataZoomDragIng");
            },
            dragEnd: function(range) {
                me._updateChecked()
            }
        }, me.dataZoom);

        
        me._dataZoom = new DataZoom(dataZoomOpt);

        var graphssp = this.__cloneBar.thumbBar._graphs.sprite;
        graphssp.id = graphssp.id + "_datazoomthumbbarbg"
        graphssp.context.x = 0;
        graphssp.context.y = me._dataZoom.barH + me._dataZoom.barY;

        graphssp.context.scaleY = me._dataZoom.barH / this.__cloneBar.thumbBar._graphs.h;

        me._dataZoom.setZoomBg( graphssp );

        this.__cloneBar.thumbBar.destroy();
        this.__cloneBar.cloneEl.parentNode.removeChild(this.__cloneBar.cloneEl);

        me.plugs.push( {
            type : "dataZoom",
            plug : me._dataZoom
        } ); 
        me.core.addChild( me._dataZoom.sprite );
    }

    _getCloneBar() 
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
        _.deepExtend(opts, {
            graphs: {
                bar: {
                    fillStyle: me.dataZoom.normalColor || "#ececec"
                },
                animation: false,
                eventEnabled: false,
                text: {
                    enabled: false
                },
                average: {
                    enabled: false
                }
            },
            dataZoom: {
                enabled: false
            },
            xAxis: {
                //enabled: false
            },
            yAxis: {
                //enabled: false
            }
        });

        delete opts.dataZoom;

        var thumbBar = new barConstructor(cloneEl, me._data, opts);
        thumbBar.draw();
        return {
            thumbBar: thumbBar,
            cloneEl: cloneEl
        }
    }
    //datazoom end




    _initMarkLine(g) 
    {
        var me = this;

        var _t = me.markLine.markTo;
        var yfieldFlat = _.flatten(me._yAxis.field);
        for (var i = 0, l = yfieldFlat.length; i < l; i++) {
            var _yField = yfieldFlat[i];
            if( _t && !( ( _.isArray(_t) && _.indexOf( _t , _yField )>=0 ) || (_t === _yField) ) ){
                return;
            };

            var _y = me._opts.markLine.y;
            var y = 0;
            var yPos = 0;
            var label = "";


            function getProp( obj , p , i , def){
                if( obj == undefined ) return def;
                if( obj[p] == undefined ) return def;
                if( !_.isArray(obj[p]) ) return obj[p];
                return obj[p][i] == undefined ? def : obj[p][i] 
            };
            var lineStrokeStyle = getProp( me.markLine.line, "strokeStyle" , i , g._yAxisFieldsMap[ _yField ].fillStyle );
            var textFillStyle = getProp( me.markLine.text, "fillStyle" , i , g._yAxisFieldsMap[ _yField ].fillStyle );

            if( _y !== undefined ){
                if( _.isArray( _y ) ){
                    y = _y[ i ];
                } else {
                    y = Number( _y );
                }
                
                if( y === undefined ) return;

                yPos = me._yAxis.getYposFromVal(y);
                label = _yField.field + '：markLine';
            } else {
                //没有配置y，则取均值
                //TODO: 后续需要center里面按照field存储
                if( !me.dataFrame.yAxis.center[i] ){
                    return
                }

                y = me.dataFrame.yAxis.center[i].agValue;
                
                if( y === undefined ) return;

                yPos = parseInt( me.dataFrame.yAxis.center[i].agPosition);
                label = _yField.field + '均值';
            };

            if (me.markLine.text && me.markLine.text.enabled) {
                if (_.isFunction(me.markLine.text.format)) {
                    var o = {
                        iGroup: i,
                        value: y
                    }
                    label = me.markLine.text.format(o)
                }
            };

            //bar 目前没有双y轴，所以最后一个参数传 me._yAxis
            me._createOneMarkLine( _yField , y, yPos, label, lineStrokeStyle , textFillStyle , me._yAxis);

        };
    }

    _createOneMarkLine( field, yVal, yPos, content, lineStrokeStyle, textFillStyle , yAxis)
    {
        var me = this;
        var o = {
            w: me._xAxis.xGraphsWidth,
            h: me._yAxis.yGraphsHeight,
            value: yVal,
            origin: {
                x: me._back.pos.x,
                y: me._back.pos.y
            },
            line: {
                y: yPos,
                list: [
                    [0, 0],
                    [me._xAxis.xGraphsWidth, 0]
                ],
                strokeStyle: lineStrokeStyle
            },
            text: {
                content: content,
                fillStyle: textFillStyle
            },
            field: field
        };

        var _markLine = new MarkLine(_.deepExtend( me._opts.markLine, o) , yAxis);

        me.plugs.push( {
            type : "markLine",
            plug : _markLine
        } );

        me.core.addChild( _markLine.sprite );
    }

    _initMarkPoint(g) 
    {
        var me = this;
        
        var gOrigin = {
            x: g.sprite.context.x + g.bar._width/2,
            y: g.sprite.context.y - 3
        };
        var _t = me.markPoint.markTo;

        _.each(g.data, function(group, i) {
            _.each(group, function(hgroup) {
                _.each(hgroup, function(bar) {
                    if( _t && !( ( _.isArray(_t) && _.indexOf( _t , bar.field )>=0 ) || (_t === bar.field) || _.isFunction(_t) ) ){
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

                    if( _.isFunction(_t) && !_t( mpCtx ) ){
                        //如果MarkTo是个表达式函数，返回为false的话
                        return;
                    };

                    var _mp = new MarkPoint(me._opts, mpCtx);
                    
                    _mp.shape.hover(function(e) {
                        _mp.sprite.context.globalAlpha += 0.1;
                        this.context.cursor = "pointer";
                        e.stopPropagation();
                    }, function(e) {
                        _mp.sprite.context.globalAlpha -= 0.1;
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

                });
            });
        });
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
        var me = this
        var graphs = me._graphs
        graphs._checked($o)
    }

    _checkedMiniBar($o) 
    { //选择缩略的bar
        if (this._opts.dataZoom) {
            var me = this
            var graphs = me.__cloneBar.thumbBar._graphs
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

    bindEvent() 
    {
        var me = this;
        this._graphs.sprite.on("panstart mouseover", function(e) {
            me._setXaxisYaxisToTipsInfo(e);
            me._tip.show(e);
            me.fire(e.type, e);
        });
        this._graphs.sprite.on("panmove mousemove", function(e) {
            me._setXaxisYaxisToTipsInfo(e);
            me._tip.move(e);
            me.fire(e.type, e);
        });
        this._graphs.sprite.on("panend mouseout", function(e) {
            me._tip.hide(e);
            me.fire(e.type, e);
        });
        this._graphs.sprite.on("tap click dblclick mousedown mouseup", function(e) {
            var isAddStart = false;
            if (e.type == 'click') {
                //在click上面触发 checked
                me.fire('checkedBefor', e);
                
                if( e.eventInfo.iNode > -1 ){
                    if(me._checked( e.eventInfo ) ){
                        me.fire('checked' , e);
                    } else {
                        me.fire('unchecked' , e);
                    };
                    isAddStart = true;
                };
            };
            me._setXaxisYaxisToTipsInfo(e , isAddStart);
            me.fire(e.type, e);
        });
    }
}