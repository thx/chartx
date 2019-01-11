import Canvax from "canvax"
import {numAddSymbol} from "../../../utils/tools"
import GraphsBase from "../index"
import { _, event } from "mmvis"

const AnimationFrame = Canvax.AnimationFrame;
const Rect = Canvax.Shapes.Rect;

export default class BarGraphs extends GraphsBase
{
    constructor(opt, app)
    {
        super(opt, app);

        this.type = "bar";

        this.field  = null;
        this.enabledField = null;
 
        this.yAxisAlign = "left"; //默认设置为左y轴

        //trimGraphs的时候是否需要和其他的 bar graphs一起并排计算，true的话这个就会和别的重叠
        //和css中得absolute概念一致，脱离文档流的绝对定位
        this.absolute = false;
        
        this.proportion = false;//比例柱状图，比例图首先肯定是个堆叠图

        this.node = {
            shapeType : 'rect',
            width     : 0,
            _width    : 0,
            maxWidth  : 50,
            minWidth  : 1,
            minHeight : 0,

            radius    : 3,
            fillStyle : null,
            fillAlpha : 0.95,
            _count    : 0, //总共有多少个bar
            xDis      : null,
            filter    : null
        };

        this.label = {
            enabled   : false,
            animation : true,
            fontColor : null, //如果有设置text.fontColor那么优先使用fontColor
            fontSize  : 12,
            format    : null,
            lineWidth : 0,
            strokeStyle : null,

            rotation : 0,
            align : "center",  //left center right
            verticalAlign : "bottom", //top middle bottom
            position : "top", //top,topRight,right,rightBottom,bottom,bottomLeft,left,leftTop,center
            offsetX : 0,
            offsetY : 0
        };
        
        //分组的选中，不是选中具体的某个node，这里的选中靠groupRegion来表现出来
        this.select = {
            enabled : false,
            alpha : 0.2,
            fillStyle : null,
            _fillStyle : "#092848", //和bar.fillStyle一样可以支持array function
            triggerEventType : "click",
            width : 1,
            inds : [] //选中的列的索引集合,注意，这里的ind不是当前视图的ind，而是加上了dataFrame.range.start的全局ind
        };

        this._barsLen = 0;

        this.txtsSp = null;

        _.extend(true, this, opt);

        this.init();

    }

    init()
    {

        this.barsSp = new Canvax.Display.Sprite({
            id: "barsSp"
        });
        this.txtsSp = new Canvax.Display.Sprite({
            id: "txtsSp",
            context: {
                //visible: false
            }
        });
    }

    getNodesAt(index)
    {
        //该index指当前
        var data = this.data;
        
        var _nodesInfoList = []; //节点信息集合
        _.each( this.enabledField, function( fs, i ){
            if( _.isArray(fs) ){
                _.each( fs, function( _fs, ii ){
                    //fs的结构两层到顶了
                    var nodeData = data[ _fs ] ? data[ _fs ][ index ] : null;
                    nodeData && _nodesInfoList.push( nodeData );
                } );
            } else {
                var nodeData = data[ fs ] ? data[ fs ][ index ] : null;
                nodeData && _nodesInfoList.push( nodeData );
            }
        } );
        
        return _nodesInfoList;
    }

    _getTargetField(b, v, i, field) 
    {
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

    _getColor(color, nodeData)
    {
        var me = this;
        var field = nodeData.field;
        var _flattenField = _.flatten( [ this.field ] );

        var fieldMap = this.app.getComponent({name:'coord'}).getFieldMapOf(field);
       
        if (_.isFunction( color )) {
            color = color.apply(this, [ nodeData ]);
        };
        //field对应的索引，， 取颜色这里不要用i
        if (_.isString(color)) {
            color = color
        };
        if (_.isArray(color)) {
            color = _.flatten(color)[ _.indexOf( _flattenField, field ) ];
        };

        if( color && color.lineargradient ){
            var _style = me.ctx.createLinearGradient( nodeData.x, (nodeData.fromY+nodeData.rectHeight), nodeData.x, nodeData.fromY );
            _.each( color.lineargradient , function( item , i ){
                _style.addColorStop( item.position , item.color);
            });
            color = _style;
        };

        if( color === undefined || color === null ){
            //只有undefined(用户配置了function),null才会认为需要还原皮肤色
            //“”都会认为是用户主动想要设置的，就为是用户不想他显示
            color = fieldMap.color
        };

        return color;
    }

    _getBarWidth(cellWidth, ceilWidth2)
    {
        if (this.node.width) {
            if (_.isFunction(this.node.width)) {
                this.node._width = this.node.width(cellWidth);
            } else {
                this.node._width = this.node.width;
            }
        } else {
            this.node._width = ceilWidth2 - Math.max(1, ceilWidth2 * 0.2);
            
            //这里的判断逻辑用意已经忘记了，先放着， 有问题在看
            if (this.node._width == 1 && cellWidth > 3) {
                this.node._width = cellWidth - 2;
            };
        };
        this.node._width < 1 && (this.node._width = 1);
        this.node._width = parseInt( this.node._width );
        if( this.node._width > this.node.maxWidth ){
            this.node._width = this.node.maxWidth;
        };
        return this.node._width;
    }

    show( field ){
        this.draw();
    }

    hide( field )
    {
        _.each( this.barsSp.children , function( h_groupSp, h ){
            var _bar = h_groupSp.getChildById("bar_"+h+"_"+field);
            _bar && _bar.destroy();
        } );
        _.each( this.txtsSp.children , function( sp, h ){
            var _label = sp.getChildById("text_"+h+"_"+field);
            _label && _label.destroy();
        } );
        
        this.draw();
    }

    resetData( dataFrame , dataTrigger )
    {
        this.dataFrame = dataFrame;
        this.draw();
    }

    clean()
    {
        this.data = {};
        this.barsSp.removeAllChildren();
        if (this.label.enabled) {
            this.txtsSp.removeAllChildren();
        };
    }

    draw(opt)
    { 
        
        !opt && (opt ={});

        //第二个data参数去掉，直接trimgraphs获取最新的data
        _.extend(true, this, opt);

        var me = this;

        var animate = me.animation && !opt.resize;

        this.data = this._trimGraphs();

        if ( this.enabledField.length == 0 || this._dataLen == 0) {
            me._preDataLen = 0;
            this.clean();
            return;
        };

        var preDataLen = me._preDataLen; //纵向的分组，主要用于 resetData 的时候，对比前后data数量用

        var groupsLen = this.enabledField.length;
        var itemW = 0;

        me.node._count = 0;

        _.each( this.enabledField , function(h_group, i) {
            
            h_group = _.flatten([ h_group ]);
            /*
            //h_group为横向的分组。如果yAxis.field = ["uv","pv"]的话，
            //h_group就会为两组，一组代表uv 一组代表pv。
            var spg = new Canvax.Display.Sprite({ id : "barGroup"+i });
            */

            //vLen 为一单元bar上面纵向堆叠的 length
            //比如yAxis.field = [?
            //    ["uv","pv"],  vLen == 2
            //    "click"       vLen == 1
            //]

            //if (h <= preDataLen - 1)的话说明本次绘制之前sprite里面已经有bar了。需要做特定的动画效果走过去

            var vLen = h_group.length;
            if (vLen == 0) return;

            //itemW 还是要跟着xAxis的xDis保持一致
            itemW = me.width / me._dataLen;

            me._barsLen = me._dataLen * groupsLen;

            for (var h = 0; h < me._dataLen; h++) {

                //bar的group
                var groupH = null;
                if (i == 0) {
                    //横向的分组
                    if (h <= preDataLen - 1) {
                        groupH = me.barsSp.getChildById("barGroup_" + h);
                    } else {
                        groupH = new Canvax.Display.Sprite({
                            id: "barGroup_" + h
                        });
                        me.barsSp.addChild( groupH );
                        groupH.iNode = h;
                    };


                    var preGraphs = 0;
                    var barGraphs = me.app.getComponents({name:'graphs',type:'bar'});
                    _.each( barGraphs, function( graph, i ){
                        if( graph == me ){
                            preGraphs = i
                        };
                    } );
                    if( !preGraphs ){
                        //只有preGraphs == 0，第一组graphs的时候才需要加载这个region

                        //这个x轴单元 nodes的分组，添加第一个rect用来接受一些事件处理
                        //以及显示selected状态
                        var groupRegion;
                        var groupRegionWidth = itemW * me.select.width;
                        if( me.select.width > 1 ){
                            //说明是具体指
                            groupRegionWidth = me.select.width;
                        };
                        if (h <= preDataLen - 1) {
                            groupRegion = groupH.getChildById("group_region_" + h);
                            groupRegion.context.width = groupRegionWidth;
                            groupRegion.context.x = itemW * h + ( itemW - groupRegionWidth ) / 2;
                        } else {
                            groupRegion = new Rect({
                                id: "group_region_" + h,
                                pointChkPriority: false,
                                hoverClone: false,
                                xyToInt: false,
                                context: {
                                    x: itemW * h + ( itemW - groupRegionWidth ) / 2,
                                    y: -me.height,
                                    width: groupRegionWidth,
                                    height: me.height,
                                    fillStyle: me._getGroupRegionStyle( h ),
                                    globalAlpha: _.indexOf( me.select.inds, me.dataFrame.range.start + h ) > -1 ? me.select.alpha : 0
                                }
                            });
                            groupH.addChild(groupRegion);
                            
                            groupRegion.iNode = h;
                            //触发注册的事件
                            groupRegion.on( event.types.get() , function (e) {
                                
                                e.eventInfo = {
                                    iNode : this.iNode
                                    //TODO:这里设置了的话，会导致多graphs里获取不到别的graphs的nodes信息了
                                    //nodes : me.getNodesAt( this.iNode ) 
                                };

                                if( me.select.enabled && e.type == me.select.triggerEventType ){
                                    //如果开启了图表的选中交互
                                    var ind = me.dataFrame.range.start + this.iNode;

                                    //region触发的selected，需要把所有的graphs都执行一遍
                                    var allBarGraphs = me.app.getComponents({ name:'graphs' });
                                    if( _.indexOf( me.select.inds, ind ) > -1 ){
                                        //说明已经选中了
                                        _.each( allBarGraphs, function( barGraph ){
                                            barGraph.unselectAt( ind );
                                        })
                                    } else {
                                        _.each( allBarGraphs, function( barGraph ){
                                            barGraph.selectAt( ind );
                                        })
                                    };
                                    
                                };

                                //触发root统一设置e.eventInfo.nodes,所以上面不需要设置
                                me.app.fire( e.type, e );

                            });
                        }
                    };

                } else {
                    groupH = me.barsSp.getChildById("barGroup_" + h);
                };

                //txt的group begin
                var txtGroupH = null;
                if (i == 0) {
                    if (h <= preDataLen - 1) {
                        txtGroupH = me.txtsSp.getChildById("txtGroup_" + h);
                    } else {
                        txtGroupH = new Canvax.Display.Sprite({
                            id: "txtGroup_" + h
                        });
                        me.txtsSp.addChild(txtGroupH);
                        txtGroupH.iGroup = i;
                    };
                } else {
                    txtGroupH = me.txtsSp.getChildById("txtGroup_" + h);
                };
                //txt的group begin

                for (var v = 0; v < vLen; v++) {
                    
                    me.node._count ++;

                    //单个的bar，从纵向的底部开始堆叠矩形
                    var nodeData = me.data[h_group[v]][h];

                    nodeData.iGroup = i, nodeData.iNode = h, nodeData.iLay = v;

                    var rectHeight = nodeData.y - nodeData.fromY;

                    if( isNaN(rectHeight) ){
                        rectHeight = 0;
                    } else {
                        if( Math.abs(rectHeight) < me.node.minHeight ){
                            rectHeight = me.node.minHeight;
                        }
                    };

                    nodeData.rectHeight = rectHeight;

                    var fillStyle = me._getColor(me.node.fillStyle, nodeData);
                    nodeData.color = fillStyle;
                    //如果用户配置了渐变， 那么tips里面就取对应的中间位置的颜色
                    if( fillStyle instanceof CanvasGradient ){
                        if( me.node.fillStyle.lineargradient ){
                            var _middleStyle = me.node.fillStyle.lineargradient[ parseInt( me.node.fillStyle.lineargradient.length / 2 ) ];
                            if( _middleStyle ){
                                nodeData.color = _middleStyle.color
                            };
                        }
                    };

                    var finalPos = {
                        x         : Math.round(nodeData.x),
                        y         : nodeData.fromY, 
                        width     : me.node._width,
                        height    : rectHeight,
                        fillStyle : fillStyle,
                        fillAlpha : me.node.fillAlpha,
                        scaleY    : -1
                    };
                    nodeData.width = finalPos.width;
                    
                    var rectCtx = {
                        x         : finalPos.x,
                        y         : nodeData.yOriginPoint.pos,//0,
                        width     : finalPos.width,
                        height    : finalPos.height,
                        fillStyle : finalPos.fillStyle,
                        fillAlpha : me.node.fillAlpha,
                        scaleY    : 0
                    };
                    
                    if ( !!me.node.radius && nodeData.isLeaf && !me.proportion ) {
                        var radiusR = Math.min(me.node._width / 2, Math.abs(rectHeight));
                        radiusR = Math.min(radiusR, me.node.radius);
                        rectCtx.radius = [radiusR, radiusR, 0, 0];
                    };

                    if (!animate) {
                        delete rectCtx.scaleY;
                        rectCtx.y = finalPos.y;
                    };

                    var rectEl = null;
                    var barId = "bar_"+h+"_"+nodeData.field;
                    if (h <= preDataLen - 1) {
                        rectEl = groupH.getChildById( barId );
                    };
                    if( rectEl ){
                        rectEl.context.fillStyle = fillStyle;
                    } else {
                        rectEl = new Rect({
                            id: barId,
                            context: rectCtx
                        });
                        rectEl.field = nodeData.field;
                        groupH.addChild(rectEl);

                        rectEl.on(event.types.get(), function(e) {
                            e.eventInfo = {
                                trigger : me.node,
                                nodes : [ this.nodeData ]
                            };
                            
                            me.app.fire( e.type, e );
                        });
                        
                    };

                    rectEl.finalPos = finalPos;
                    rectEl.iGroup = i, rectEl.iNode = h, rectEl.iLay = v;

                    //nodeData, nodeElement ， data和图形之间互相引用的属性约定
                    rectEl.nodeData = nodeData;
                    nodeData.nodeElement = rectEl;

                    me.node.filter && me.node.filter.apply( rectEl, [ nodeData , me] );

                    //label begin ------------------------------
                    if ( me.label.enabled ) {

                        var value = nodeData.value;
                        if ( _.isFunction(me.label.format) ) {
                            var _formatc = me.label.format(value, nodeData);
                            if( _formatc !== undefined || _formatc !== null ){
                                value = _formatc
                            }
                        };

                        if( value === undefined || value === null || value === "" ){
                            continue;
                        };

                        if ( _.isNumber(value) ) {
                            value = numAddSymbol(value);
                        };
                        
                        var textCtx = {
                            fillStyle   : me.label.fontColor || finalPos.fillStyle,
                            fontSize    : me.label.fontSize,
                            lineWidth   : me.label.lineWidth,
                            strokeStyle : me.label.strokeStyle || finalPos.fillStyle,
                            //textAlign   : me.label.align,
                            textBaseline: me.label.verticalAlign,
                            rotation      : me.label.rotation
                        };
                        //然后根据position, offset确定x,y
                        var _textPos = me._getTextPos( finalPos , nodeData );
                        textCtx.x = _textPos.x;
                        textCtx.y = _textPos.y;
                        textCtx.textAlign = me._getTextAlign(  finalPos , nodeData  );

                        //文字
                        var textEl = null;
                        var textId = "text_" + h + "_" + nodeData.field;
                        if (h <= preDataLen - 1) {
                            textEl = txtGroupH.getChildById( textId );
                        }; 
                        if( textEl ){
                            //do something
                            textEl.resetText( value );
                            textEl.context.x = textCtx.x;
                            textEl.context.y = textCtx.y;

                        } else {
                            textEl = new Canvax.Display.Text( value , {
                                id: textId,
                                context: textCtx
                            });
                            textEl.field = nodeData.field;
                            txtGroupH.addChild( textEl );
                        };

                        if (!animate) {
                            //TODO：现在暂时没有做text的animate
                        };

                    }
                    //label end ------------------------------

                };
            }
        });

        this.sprite.addChild(this.barsSp);
        //如果有text设置， 就要吧text的txtsSp也添加到sprite
        if (this.label.enabled) {
            this.sprite.addChild(this.txtsSp);
        };

        this.sprite.context.x = this.origin.x;
        this.sprite.context.y = this.origin.y;

        this.grow(function() {
            me.fire("complete");
        }, {
            delay : 0,
            duration : 300,
            animate : animate
        });

        me._preDataLen = me._dataLen;
    }

    setEnabledField()
    {
        //要根据自己的 field，从enabledFields中根据enabled数据，计算一个 enabled版本的field子集
        this.enabledField = this.app.getComponent({name:'coord'}).filterEnabledFields( this.field );
    }

    _getGroupRegionStyle( iNode )
    {
        var me = this;
        var _groupRegionStyle = me.select.fillStyle;
        if (_.isArray( me.select.fillStyle )) {
            _groupRegionStyle = me.select.fillStyle[ iNode ];
        };
        if (_.isFunction( me.select.fillStyle )) {
            _groupRegionStyle = me.select.fillStyle.apply(this, [ {
                iNode : iNode,
                rowData : me.dataFrame.getRowDataAt( iNode )
            } ]);
        };
        if( _groupRegionStyle === undefined || _groupRegionStyle === null ){
            return me.select._fillStyle;
        };

        return _groupRegionStyle
    }

    _trimGraphs()
    {
        var me = this;
        var _coord = this.app.getComponent({name:'coord'});

        //用来计算下面的hLen
        this.setEnabledField();
        this.data = {};

        var layoutGraphs = [];
        var hLen = 0; //总共有多少列（ 一个xAxis单元分组内 ）
        var preHLen = 0; //自己前面有多少个列（ 一个xAxis单元分组内 ）
        var _preHLenOver = false;

        if( !this.absolute ){
            _.each( this.app.getComponents({name:'graphs'}) , function( _g ){
                if( !_g.absolute && _g.type == "bar" ) {
                    if( _g === me ){
                        _preHLenOver = true;
                    };
                    if( _preHLenOver ){
                        //排在me后面的 graphs，需要计算setEnabledField，才能计算出来 全部的hLen
                        _g.setEnabledField();
                    } else {
                        preHLen += _g.enabledField.length
                    }
                    hLen += _g.enabledField.length;
                    layoutGraphs.push( _g );
                }
            } );
        } else {
            layoutGraphs = [ this ];
            hLen = this.enabledField.length;
        };

        var cellWidth = _coord.getAxis({type:'xAxis'}).getCellLength();
        //x方向的二维长度，就是一个bar分组里面可能有n个子bar柱子，那么要二次均分
        var ceilWidth2 = cellWidth / (hLen + 1);

        //知道了ceilWidth2 后 检测下 barW是否需要调整
        var barW = this._getBarWidth(cellWidth, ceilWidth2);
        var barDis = ceilWidth2 - barW;
        if( this.node.xDis != null ){
            barDis = this.node.xDis;
        };
        
        var disLeft = (cellWidth - barW*hLen - barDis*(hLen-1) ) / 2;
        if( preHLen ){
            disLeft += (barDis + barW) * preHLen;
        };

        //var tmpData = [];

        //然后计算出对于结构的dataOrg
        var dataOrg = this.dataFrame.getDataOrg( this.enabledField );

        //dataOrg和field是一一对应的
        _.each( dataOrg, function( hData, b ){
            //hData，可以理解为一根竹子 横向的分组数据，这个hData上面还可能有纵向的堆叠

            //tempBarData 一根柱子的数据， 这个柱子是个数据，上面可以有n个子元素对应的竹节
            var tempBarData = [];
            _.each( hData, function( vSectionData, v ){
                tempBarData[v] = [];
                //vSectionData 代表某个字段下面的一组数据比如 uv

                me._dataLen = vSectionData.length;

                //vSectionData为具体的一个field对应的一组数据
                _.each(vSectionData, function(val, i) {

                    var vCount = val;
                    if (me.proportion) {
                        //先计算总量
                        vCount = 0;
                        _.each( hData, function(team, ti) {
                            vCount += team[i]
                        });
                    };

                    var field = me._getTargetField(b, v, i, me.enabledField);

                    //返回一个和value的结构对应的point结构{x:  y: }
                    var point = _coord.getPoint( {
                        iNode : i,
                        field : field,
                        value : {
                            //x:
                            y : val
                        }
                    } );

                    var _x = point.pos.x;

                    var x = _x - cellWidth / 2 + disLeft + (barW + barDis)*b;

                    var y = 0;
                    if (me.proportion) {
                        y = -val / vCount * _coord.height;
                    } else {
                        y = point.pos.y;
                    };

                    var yOriginPoint = _coord.getAxisOriginPoint( { field: field } );

                    function _getFromY( tempBarData, v, i, val, y ){
                        var preData = tempBarData[v - 1];
                        if( !preData ){
                            return yOriginPoint.pos;
                        };

                        var preY = preData[i].y;
                        var preVal = preData[i].value;
                        var yBaseNumber = yOriginPoint.value;
                        if( val >= yBaseNumber ){
                            //如果大于基线的，那么就寻找之前所有大于基线的
                            if( preVal >= yBaseNumber ){
                                //能找到，先把pre的isLeaf设置为false
                                preData[i].isLeaf = false;
                                return preY;
                            } else {
                                return _getFromY( tempBarData, v-1, i, val, y );
                            }
                        } else {
                            if( preVal < yBaseNumber ){
                                //能找到，先把pre的isLeaf设置为false
                                preData[i].isLeaf = false;
                                return preY;
                            } else {
                                return _getFromY( tempBarData, v-1, i, val, y );
                            }
                        }
                    }

                    //找到其着脚点,一般就是 yOriginPoint.pos
                    var fromY = _getFromY(tempBarData, v, i, val, y);
                    y += fromY - yOriginPoint.pos;

                    var nodeData = {
                        type          : "bar",
                        value         : val,
                        vInd          : v, //如果是堆叠图的话，这个node在堆叠中得位置
                        vCount        : vCount, //纵向方向的总数,比瑞堆叠了uv(100),pv(100),那么这个vCount就是200，比例柱状图的话，外部tips定制content的时候需要用到
                        field         : field,
                        fromX         : x,
                        fromY         : fromY,
                        x             : x,
                        y             : y,
                        width         : barW,
                        yOriginPoint  : yOriginPoint,
                        isLeaf        : true,
                        xAxis         : _coord.getAxis({type:'xAxis'}).getNodeInfoOfX( _x ),
                        iNode         : i,
                        rowData       : me.dataFrame.getRowDataAt( i ),
                        color         : null,

                        //focused       : false,  //是否获取焦点，外扩
                        selected      : false  //是否选中

                    };

                    if( !me.data[ nodeData.field ] ){
                        me.data[ nodeData.field ] = tempBarData[v];
                    };

                    //如果某个graph 配置了select ----start
                    var selectOpt = me.select;
                    if( !selectOpt ){
                        var barGraphs = me.app.getComponents({name:'graphs',type:'bar'});
                        _.each( barGraphs, function( barGraph ){
                            if( selectOpt ) return false;
                            if( !selectOpt && barGraph.select ){
                                selectOpt = barGraph.select;
                            };
                        } );
                    };
                    if( selectOpt && selectOpt.inds && selectOpt.inds.length ){
                        if( _.indexOf( selectOpt.inds, i ) > -1 ){
                            nodeData.selected = true;
                        };
                    };
                    //----end


                    tempBarData[v].push(nodeData);

                });
            } );
            
            //tempBarData.length && tmpData.push( tempBarData );
        } );
            
        return me.data;
        //return tmpData;
    }

    _getTextAlign( bar , nodeData ){
        var align = this.label.align;
        if( nodeData.value < nodeData.yOriginPoint.value ){
            if( align == "left" ){
                align = "right"
            } else if( align == "right" ){
                align = "left"
            }
        };
        return align;
    }
    
    _getTextPos( bar , nodeData ){

        var me = this;
        var point = {
            x : 0, y : 0
        };
        var x=bar.x ,y=bar.y;
        var isNegative = true; //是负数
        if( bar.y >= nodeData.y ){
            isNegative = false;
        };
        switch( me.label.position ){
            case "top" :
                x = bar.x + bar.width/2;
                y = bar.y + bar.height;
                if( isNegative ) {
                    y += 16
                };
                break;
            case "topRight" :
                x = bar.x + bar.width;
                y = bar.y + bar.height;
                if( isNegative ) {
                    y += 16
                };
                break;
            case "right" :
                x = bar.x + bar.width;
                y = bar.y + bar.height/2;
                break;
            case "rightBottom" :
                x = bar.x + bar.width;
                y = bar.y;
                break;
            case "bottom" :
                x = bar.x + bar.width/2;
                y = bar.y;
                break;
            case "bottomLeft" :
                x = bar.x;
                y = bar.y;
                break;
            case "left" :
                x = bar.x;
                y = bar.y + bar.height/2;
                break;
            case "leftTop" :
                x = bar.x;
                y = bar.y + bar.height;
                if( isNegative ) {
                    y += 16
                };
                break;
            case "center" :
                x = bar.x + bar.width/2;
                y = bar.y + bar.height/2;
                break;
        };
        x -= me.label.offsetX;

        var i = 1;
        if( nodeData.value < nodeData.yOriginPoint.value ){
            i = -1;
        };
        y -= i * me.label.offsetY;
        point.x = x;
        point.y = y;
        return point;
    }

    /**
     * 生长动画
     */
    grow(callback, opt) 
    {

        var me = this;
        //console.log( me._preDataLen+"|"+ me._dataLen)
        //先把已经不在当前range范围内的元素destroy掉
        if ( me._preDataLen > me._dataLen) {
            for (var i = me._dataLen, l = me._preDataLen; i < l; i++) {
                me.barsSp.getChildAt(i).destroy();
                me.label.enabled && me.txtsSp.getChildAt(i).destroy();
                i--;
                l--;
            };
        };

        if (!opt.animate) {
            callback && callback(me);
            return;
        };
        var sy = 1;

        var optsions = _.extend({
            delay: Math.min(1000 / this._barsLen, 80),
            easing: "Linear.None",//"Back.Out",
            duration: 500
        }, opt);

        var barCount = 0;
        _.each(me.enabledField, function(h_group, g) {
            h_group = _.flatten([ h_group ]);
            var vLen = h_group.length;
            if (vLen == 0) return;

            for (var h = 0; h < me._dataLen; h++) {
                for (var v = 0; v < vLen; v++) {

                    var nodeData = me.data[h_group[v]][h];

                    var group = me.barsSp.getChildById("barGroup_" + h);

                    var bar = group.getChildById("bar_" + h + "_" + nodeData.field);

                    if ( optsions.duration == 0 ) {
                        bar.context.scaleY = sy;
                        bar.context.y = sy * sy * bar.finalPos.y;
                        bar.context.x = bar.finalPos.x;
                        bar.context.width = bar.finalPos.width;
                        bar.context.height = bar.finalPos.height;
                    } else {

                        if ( bar._tweenObj ) {
                            AnimationFrame.destroyTween(bar._tweenObj);
                        };
                        bar._tweenObj = bar.animate({
                            scaleY: sy,
                            y: sy * bar.finalPos.y,
                            x: bar.finalPos.x,
                            width: bar.finalPos.width,
                            height: bar.finalPos.height
                        }, {
                            duration: optsions.duration,
                            easing: optsions.easing,
                            delay: h * optsions.delay,
                            onUpdate: function(arg) {

                            },
                            onComplete: function(arg) {
                                if (arg.width < 3 && this.context) {
                                    this.context.radius = 0;
                                }

                                barCount ++;

                                if( barCount === me.node._count ){
                                    callback && callback(me);
                                }
                            },
                            id: bar.id
                        });

                    };

                };
            };
        });
    }

    //这里的ind是包含了start的全局index
    selectAt( ind ){
        var me = this;
        if( _.indexOf( this.select.inds, ind ) > -1 ) return;

        this.select.inds.push( ind );

        _.each( this.data, function( list, f ){
            var nodeData = list[ ind ];
            nodeData.selected = true;
            me.setNodeElementStyle( nodeData );
        } );

        var index = ind - this.dataFrame.range.start;
        var group = this.barsSp.getChildById("barGroup_" + index);
        if( group ){
            var groupRegion = group.getChildById("group_region_"+index);
            if( groupRegion ){
                groupRegion.context.globalAlpha = this.select.alpha;
            }
        }
    }

    //这里的ind是包含了start的全局index
    unselectAt( ind ){
        var me = this;
        if( _.indexOf( this.select.inds, ind ) == -1 ) return;

        var _index = _.indexOf( this.select.inds, ind );
        this.select.inds.splice( _index, 1 );
        _.each( this.data, function( list, f ){
            var nodeData = list[ ind ];
            nodeData.selected = false;
            me.setNodeElementStyle( nodeData );
        } );

        var index = ind - this.dataFrame.range.start;
        var group = this.barsSp.getChildById("barGroup_" + index);
        if( group ){
            var groupRegion = group.getChildById("group_region_"+index);
            if( groupRegion ){
                groupRegion.context.globalAlpha = 0;
            }
        }
        
    }

    getSelectedRowList(){
        var rowDatas = [];
        var me = this;

        _.each( me.select.inds, function( ind ){
            var index = ind - me.dataFrame.range.start;
            rowDatas.push( me.dataFrame.getRowDataAt( index ) )
        } );

        return rowDatas;
    }

    setNodeElementStyle( nodeData ){
        var me = this;
        var fillStyle = me._getColor(me.node.fillStyle, nodeData);
        nodeData.nodeElement.context.fillStyle = fillStyle;
    }
}