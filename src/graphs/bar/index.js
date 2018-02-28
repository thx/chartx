import Canvax from "canvax2d"
import {numAddSymbol} from "../../utils/tools"
import GraphsBase from "../index"

const AnimationFrame = Canvax.AnimationFrame;
const BrokenLine = Canvax.Shapes.BrokenLine;
const Rect = Canvax.Shapes.Rect;
const _ = Canvax._;

export default class BarGraphs extends GraphsBase
{
    constructor(opts, root)
    {
        super(opts, root);

        this.type = "bar";

        this.enabledField = null;
 
        this.yAxisAlign = "left"; //默认设置为左y轴
        this._xAxis = this.root._coordinate._xAxis;

        //trimGraphs的时候是否需要和其他的 bar graphs一起并排计算，true的话这个就会和别的重叠
        //和css中得absolute概念一致，脱离文档流的绝对定位
        this.absolute = false; 

        this.node = {
            type      : "rect",
            width     : 0,
            _width    : 0,
            maxWidth  : 50,
            radius    : 4,
            fillStyle : null,
            fillAlpha : 0.95,
            _count    : 0, //总共有多少个bar
            xDis      : null
        };

        this.text = {
            enabled   : false,
            fillStyle : '#999',
            fontSize  : 12,
            format    : null,
            lineWidth : 1,
            strokeStyle : 'white'
        };

        this.sort = null;

        this._barsLen = 0;

        this.txtsSp = null;

        this.proportion = false;//比例柱状图，比例图首先肯定是个堆叠图

        _.extend(true, this, opts);

        this.init();
    }

    init()
    {
        this.sprite = new Canvax.Display.Sprite({
            id: "graphsEl"
        });

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
                    var node = data[ _fs ][ index ];
                    node && _nodesInfoList.push( node );
                } );
            } else {
                var node = data[ fs ][ index ];
                node && _nodesInfoList.push( node );
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


    //dataZoom中用
    setBarStyle($o)
    {
        var me = this
        var index = $o.iNode
        var group = me.barsSp.getChildById('barGroup_' + index)
        
        var fillStyle = $o.fillStyle || me._getColor(me.node.fillStyle)
        for (var a = 0, al = group.getNumChildren(); a < al; a++) {
            var rectEl = group.getChildAt(a)
            rectEl.context.fillStyle = fillStyle
        }
    }

    _getColor(c, groupsLen, vLen, i, h, v, value, field, _flattenField)
    {
        var fieldMap = this.root._coordinate.getFieldMapOf(field);
        var color = fieldMap.color;

        //field对应的索引，， 取颜色这里不要用i
        if (_.isString(c)) {
            color = c
        };
        if (_.isArray(c)) {
            color = _.flatten(c)[ _.indexOf( _flattenField, field ) ];
        };
        if (_.isFunction(c)) {
            color = c.apply(this, [{
                iGroup: i,
                iNode: h,
                iLay: v,
                field: field,
                value: value,
                xAxis: {
                    field: this._xAxis.field,
                    value: this._xAxis.layoutData[h].content
                }
            }]);
        };

        return color;
    }

    _getBarWidth(ceilWidth, ceilWidth2)
    {
        if (this.node.width) {
            if (_.isFunction(this.node.width)) {
                this.node._width = this.node.width(ceilWidth);
            } else {
                this.node._width = this.node.width;
            }
        } else {
            this.node._width = ceilWidth2 - Math.max(1, ceilWidth2 * 0.3);

            //这里的判断逻辑用意已经忘记了，先放着， 有问题在看
            if (this.node._width == 1 && ceilWidth > 3) {
                this.node._width = ceilWidth - 2;
            };
        };
        this.node._width < 1 && (this.node._width = 1);
        this.node._width = parseInt( this.node._width );
        if( this.node._width > this.node.maxWidth ){
            this.node._width = this.node.maxWidth;
        };
        return this.node._width;
    }

    add( field ){
        this.draw();
    }

    remove( field )
    {
        _.each( this.barsSp.children , function( h_groupSp, h ){
            var bar = h_groupSp.getChildById("bar_"+h+"_"+field);
            bar && bar.destroy();
        } );
 
        this.draw();
    }

    resetData( dataFrame , dataTrigger )
    {
        this.draw();
    }

    clean()
    {
        this.data = {};
        this.barsSp.removeAllChildren();
        if (this.text.enabled) {
            this.txtsSp.removeAllChildren();
        };
    }

    draw(opts)
    { 
        //第二个data参数去掉，直接trimgraphs获取最新的data
        _.extend(true, this, opts);

        var me = this;

        this.data = this._trimGraphs();

        if ( this.enabledField.length == 0 || this._dataLen == 0) {
            me._preDataLen = 0;
            this.clean();
            return;
        };

        var preDataLen = me._preDataLen; //纵向的分组，主要用于resetData的时候，对比前后data数量用

        var groupsLen = this.enabledField.length;
        var itemW = 0;

        me.node._count = 0;

        var _flattenField = _.flatten( [ this.field ] );

        _.each( this.enabledField , function(h_group, i) {
            h_group = _.flatten([ h_group ]);
            /*
            //h_group为横向的分组。如果yAxis.field = ["uv","pv"]的话，
            //h_group就会为两组，一组代表uv 一组代表pv。
            var spg = new Canvax.Display.Sprite({ id : "barGroup"+i });
            */

            //vLen 为一单元bar上面纵向堆叠的length
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
                var groupH = null;
                if (i == 0) {
                    //横向的分组
                    if (h <= preDataLen - 1) {
                        groupH = me.barsSp.getChildById("barGroup_" + h);
                    } else {
                        groupH = new Canvax.Display.Sprite({
                            id: "barGroup_" + h
                        });
                        me.barsSp.addChild(groupH);
                        groupH.iNode = h;
                    };
                } else {
                    groupH = me.barsSp.getChildById("barGroup_" + h);
                };

                //同上面，给txt做好分组
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

                for (var v = 0; v < vLen; v++) {
                    
                    me.node._count ++;

                    //单个的bar，从纵向的底部开始堆叠矩形
                    var rectData = me.data[h_group[v]][h];

                    rectData.iGroup = i, rectData.iNode = h, rectData.iLay = v;

                    var fillStyle = me._getColor(me.node.fillStyle, groupsLen, vLen, i, h, v, rectData.value, rectData.field, _flattenField);

                    rectData.fillStyle = fillStyle;

                    var rectH = rectData.y - rectData.fromY;

                    if( isNaN(rectH) || Math.abs(rectH) < 1 ){
                        rectH = 0;
                    };

                    var finalPos = {
                        x: Math.round(rectData.x),
                        y: rectData.fromY, 
                        width: me.node._width,
                        height: rectH,
                        fillStyle: fillStyle,
                        fillAlpha: me.node.fillAlpha,
                        scaleY: -1
                    };
                    rectData.width = finalPos.width;
                    
                    var rectCxt = {
                        x: finalPos.x,
                        y: rectData.yBasePoint.y,//0,
                        width: finalPos.width,
                        height: finalPos.height,
                        fillStyle: finalPos.fillStyle,
                        fillAlpha: me.node.fillAlpha,
                        scaleY: 0
                    };
                    
                    if ( !!me.node.radius && rectData.isLeaf && !me.proportion ) {
                        var radiusR = Math.min(me.node._width / 2, Math.abs(rectH));
                        radiusR = Math.min(radiusR, me.node.radius);
                        rectCxt.radius = [radiusR, radiusR, 0, 0];
                    };

                    if (!me.animation) {
                        delete rectCxt.scaleY;
                        rectCxt.y = finalPos.y;
                    };

                    var rectEl = null;
                    var barId = "bar_"+h+"_"+rectData.field;
                    if (h <= preDataLen - 1) {
                        rectEl = groupH.getChildById( barId );
                    };
                    if( rectEl ){
                        rectEl.context.fillStyle = fillStyle;
                    } else {
                        rectEl = new Rect({
                            id: barId,
                            context: rectCxt
                        });
                        rectEl.field = rectData.field;
                        groupH.addChild(rectEl);
                    };

                    rectEl.finalPos = finalPos;
                    rectEl.iGroup = i, rectEl.iNode = h, rectEl.iLay = v;

                    //叶子节点上面放置info
                    if (rectData.isLeaf && me.text.enabled) {
                        
                        //文字
                        var infosp = null;
                        var infospId = "infosp_" + h + "_" + rectData.field;
                        if (h <= preDataLen - 1) {
                            infosp = txtGroupH.getChildById( infospId );
                        } 
                        if( infosp ){
                            //do something
                        } else {
                            infosp = new Canvax.Display.Sprite({
                                id: infospId,
                                context: {
                                    y : rectData.yBasePoint.y,
                                    visible: false
                                }
                            });
                            infosp._hGroup = h;
                            txtGroupH.addChild(infosp);
                        };

                        var contents = [];
                        for (var c = vLen - 1; c >= 0; c--) {
                            //在baseNumber同一侧的数据放在一个叶子节点上面显示
                            if( 
                                rectData.value > rectData.yBasePoint.content 
                                === 
                                me.data[h_group[c]][h].value > me.data[h_group[c]][h].yBasePoint.content
                            ) {
                                contents.push(me.data[h_group[c]][h]);
                            }
                        }

                        var infoWidth = 0;
                        var infoHeight = 0;
                        
                        _.each(contents, function(cdata, ci) {
                            var content = cdata.value;
                            if (_.isFunction(me.text.format)) {
                                var _formatc = me.text.format.apply( me , [content , cdata]);
                                if(!!_formatc || _formatc==="" || _formatc===0){
                                    content = _formatc
                                }
                            };
                            if (!me.animation && _.isNumber(content)) {
                                content = numAddSymbol(content);
                            };

                            if( content === "" ){
                                return;
                            };

                            if (ci > 0 && infosp.children.length>0) {
                                txt = new Canvax.Display.Text("/", {
                                    context: {
                                        x: infoWidth + 2,
                                        fillStyle: "#999"
                                    }
                                });
                                infoWidth += txt.getTextWidth() + 2;
                                infosp.addChild(txt);
                            };

                            var txt = null;
                            if (h <= preDataLen - 1) {
                                txt = infosp.getChildById("info_txt_" + i + "_" + h + "_" + ci);
                            }
                            if( txt ){
                                //do something
                            } else {
                                txt = new Canvax.Display.Text( content , {
                                    id: "info_txt_" + i + "_" + h + "_" + ci,
                                    context: {
                                        x: infoWidth + 2,
                                        fillStyle: cdata.fillStyle,
                                        fontSize: me.text.fontSize,
                                        lineWidth: me.text.lineWidth,
                                        strokeStyle: me.text.strokeStyle
                                    }
                                });
                                infosp.addChild(txt);
                            };
                            txt._text = cdata.value;
                            txt._data = cdata;
                            infoWidth += txt.getTextWidth() + 2;
                            infoHeight = Math.max(infoHeight, txt.getTextHeight());

                            if( me.animation ){
                                var beginNumber = 0;
                                if( content >=100 ){
                                    beginNumber = 100;
                                }
                                if( content >=1000 ){
                                    beginNumber = 1000;
                                }
                                if( content >=10000 ){
                                    beginNumber = 10000;
                                }
                                if( content >=100000 ){
                                    beginNumber = 100900;
                                }
                                //beginNumber 和 content保持同样位数，这样动画的时候不会跳动
                                txt.resetText( beginNumber );
                            };
                        });

                        infosp._finalX = rectData.x + me.node._width/2 - infoWidth / 2;

                        //如果数据在basepoint下方
                        if( rectData.value < rectData.yBasePoint.content ){
                            infosp._finalY = rectData.y + 3; //3 只是个偏移量，没有什么特别的意思
                        } else {
                            infosp._finalY = rectData.y - infoHeight;
                        }
                       
                        infosp._centerX = rectData.x+me.node._width/2;
                        infosp.context.width = infoWidth;
                        infosp.context.height = infoHeight;

                        if (!me.animation) {
                            infosp.context.y = infosp._finalY;
                            infosp.context.x = infosp._finalX;
                            infosp.context.visible = true;
                        };
                    }
                };
            }
        });

        this.sprite.addChild(this.barsSp);

        //如果有text设置， 就要吧text的txtsSp也添加到sprite
        if (this.text.enabled) {
            this.sprite.addChild(this.txtsSp);
        };

        this.sprite.context.x = this.origin.x;
        this.sprite.context.y = this.origin.y;

        if (this.sort && this.sort == "desc") {
            this.sprite.context.y -= this.height;
        };

        this.grow(function() {
            me.fire("complete");
        }, {
            delay: 0,
            duration: 300
        });

        me._preDataLen = me._dataLen;
    }

    setEnabledField()
    {
        //要根据自己的 field，从enabledFields中根据enabled数据，计算一个 enabled版本的field子集
        this.enabledField = this.root._coordinate.getEnabledFields( this.field );
    }

    _trimGraphs()
    {
        var me = this;
        var _xAxis = this._xAxis;
        var xArr = _xAxis.layoutData;

        var _coor = this.root._coordinate;

        //用来计算下面的hLen
        this.setEnabledField();
        this.data = {};

        var layoutGraphs = [];
        var hLen = 0; //总共有多少列（ 一个xAxis单元分组内 ）
        var preHLen = 0; //自己前面有多少个列（ 一个xAxis单元分组内 ）
        var _preHLenOver = false;

        if( !this.absolute ){
            _.each( this.root._graphs , function( _g ){
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
        }

        var ceilWidth = _xAxis.ceilWidth;
        //x方向的二维长度，就是一个bar分组里面可能有n个子bar柱子，那么要二次均分
        var ceilWidth2 = ceilWidth / (hLen + 1);

        //知道了ceilWidth2 后 检测下 barW是否需要调整
        var barW = this._getBarWidth(ceilWidth, ceilWidth2);
        var barDis = ceilWidth2 - barW;
        if( this.node.xDis != null ){
            barDis = this.node.xDis;
        };
        
        var disLeft = (ceilWidth - barW*hLen - barDis*(hLen-1) ) / 2;
        if( preHLen ){
            disLeft += (barDis + barW) * preHLen;
        };

        //var tmpData = [];
        var _yAxis = this.yAxisAlign == "left" ? _coor._yAxisLeft : _coor._yAxisRight;

        //然后计算出对于结构的dataOrg
        var dataOrg = this.root.dataFrame.getDataOrg( this.enabledField );

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
                    if (!xArr[i]) {
                        return;
                    };

                    var vCount = val;
                    if (me.proportion) {
                        //先计算总量
                        vCount = 0;
                        _.each( hData, function(team, ti) {
                            vCount += team[i]
                        });
                    };
                    
                    var x = xArr[i].x - ceilWidth / 2 + disLeft + (barW + barDis)*b;

                    var y = 0;
                    if (me.proportion) {
                        y = -val / vCount * _yAxis.height;
                    } else {
                        y = _yAxis.getYposFromVal( val );
                    };

                    function _getFromY( tempBarData, v, i, val, y, yBasePoint ){
                        var preData = tempBarData[v - 1];
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
                                return _getFromY( tempBarData, v-1, i, val, y, yBasePoint );
                            }
                        } else {
                            if( preVal < yBaseNumber ){
                                //能找到，先把pre的isLeaf设置为false
                                preData[i].isLeaf = false;
                                return preY;
                            } else {
                                return _getFromY( tempBarData, v-1, i, val, y, yBasePoint );
                            }
                        }
                    }

                    //找到其着脚点,一般就是 yAxis.basePoint
                    var fromY = _getFromY(tempBarData, v, i, val, y, _yAxis.basePoint);
                    y += fromY - _yAxis.basePoint.y;

                    //如果有排序的话
                    //TODO:这个逻辑好像有问题
                    if (_yAxis.sort && _yAxis.sort == "desc") {
                        y = -(_yAxis.height - Math.abs(y));
                    };

                    var node = {
                        type   : "bar",
                        value  : val,
                        vInd   : v, //如果是堆叠图的话，这个node在堆叠中得位置
                        vCount : vCount, //纵向方向的总数,比瑞堆叠了uv(100),pv(100),那么这个vCount就是200，比例柱状图的话，外部tips定制content的时候需要用到
                        field  : me._getTargetField(b, v, i, me.enabledField),
                        fromX  : x,
                        fromY  : fromY,
                        x      : x,
                        y      : y,
                        width  : barW,
                        yBasePoint : _yAxis.basePoint,
                        isLeaf : true,
                        xAxis  : {
                            field: me._xAxis.field,
                            value: xArr[i].value,
                            layoutText: xArr[i].layoutText
                        },
                        nodeInd: i,
                        //rowData: this.root.dataFrame.getRowData( i );
                    };

                    if( !me.data[ node.field ] ){
                        me.data[ node.field ] = tempBarData[v];
                    };

                    tempBarData[v].push(node);

                });
            } );
            
            //tempBarData.length && tmpData.push( tempBarData );
        } );
            
        return me.data;
        //return tmpData;
    }

    _updateInfoTextPos(el) 
    {

        var infoWidth = 0;
        var infoHeight = 0;
        var cl = el.children.length;
        _.each(el.children, function(c, i) {
            if (c.getTextWidth) {
                c.context.x = infoWidth;
                infoWidth += c.getTextWidth() + (i < cl ? 2 : 0);
                infoHeight = Math.max(infoHeight, c.getTextHeight());
            };
        });
        el.context.x = el._centerX - infoWidth / 2;
        el.context.width = infoWidth;
        el.context.height = infoHeight;
    }

    /**
     * 生长动画
     */
    grow(callback, opts) 
    {

        var me = this;
        
        //先把已经不在当前range范围内的元素destroy掉
        if ( me._preDataLen > me._dataLen) {
            for (var i = me._dataLen, l = me._preDataLen; i < l; i++) {
                me.barsSp.getChildAt(i).destroy();
                me.text.enabled && me.txtsSp.getChildAt(i).destroy();
                i--;
                l--;
            };
        };

        if (!this.animation) {
            callback && callback(me);
            return;
        };
        var sy = 1;
        if (this.sort && this.sort == "desc") {
            sy = -1;
        };

        var optsions = _.extend({
            delay: Math.min(1000 / this._barsLen, 80),
            easing: "Linear.None",//"Back.Out",
            duration: 500
        }, opts);

        var barCount = 0;
        _.each(me.enabledField, function(h_group, g) {
            h_group = _.flatten([ h_group ]);
            var vLen = h_group.length;
            if (vLen == 0) return;

            for (var h = 0; h < me._dataLen; h++) {
                for (var v = 0; v < vLen; v++) {

                    var rectData = me.data[h_group[v]][h];

                    var group = me.barsSp.getChildById("barGroup_" + h);

                    var bar = group.getChildById("bar_" + h + "_" + rectData.field);

                    if (optsions.duration == 0) {
                        bar.context.scaleY = sy;
                        bar.context.y = sy * sy * bar.finalPos.y;
                        bar.context.x = bar.finalPos.x;
                        bar.context.width = bar.finalPos.width;
                        bar.context.height = bar.finalPos.height;
                    } else {
                        if (bar._tweenObj) {
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
                                if (arg.width < 3) {
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

                    //txt grow
                    if (me.text.enabled) {
                        var txtGroupH = me.txtsSp.getChildById("txtGroup_" + h);
                        var infosp = txtGroupH.getChildById( "infosp_" + h + "_" + rectData.field );
                        if(infosp){
                            infosp.animate({
                                y: infosp._finalY,
                                x: infosp._finalX
                            }, {
                                duration: optsions.duration,
                                easing: optsions.easing,
                                delay: h * optsions.delay,
                                onUpdate: function() {
                                    this.context && (this.context.visible = true);
                                },
                                onComplete: function() {}
                            });

                            _.each(infosp.children, function(txt) {
                                if (txt._text || txt._text===0) {
                                    if (txt._tweenObj) {
                                        AnimationFrame.destroyTween(txt._tweenObj);
                                    };
                                    txt._tweenObj = AnimationFrame.registTween({
                                        from: {
                                            v: txt.text
                                        },
                                        to: {
                                            v: txt._text
                                        },
                                        duration: optsions.duration + 100,
                                        delay: h * optsions.delay,
                                        onUpdate: function( arg ) {
                                            var content = arg.v;
                                            if (_.isFunction(me.text.format)) {
                                                var _formatc = me.text.format.apply( me , [content , txt._data]);
                                                if(!!_formatc || _formatc==="" || _formatc===0){
                                                    content = _formatc
                                                }
                                            } else if (_.isNumber(content)) {
                                                content = numAddSymbol(parseInt(content));
                                            };
                                            txt.resetText(content);
                                            if (txt.parent) {
                                                me._updateInfoTextPos(txt.parent);
                                            } else {
                                                txt.destroy();
                                            }
                                        }
                                    })
                                };
                            });
                        }
                    }

                };
            };
        });
    }
}