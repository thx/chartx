import Canvax from "canvax2d"
import _ from "underscore"
import {numAddSymbol} from "../../utils/tools"
import {colors as themeColors} from "../theme"

var AnimationFrame = Canvax.AnimationFrame;
var BrokenLine = Canvax.Shapes.BrokenLine;
var Rect = Canvax.Shapes.Rect;

export default class Graphs extends Canvax.Event.EventDispatcher
{
    constructor(opt, root)
    {
        super(opt, root);

        this.data = [];
        this.w = 0;
        this.h = 0;
        this.root = root;
        this._yAxisFieldsMap = {}; //{"uv":{index:0,fillStyle:"" , ...} ...}
        this._setyAxisFieldsMap( opt );

        //存储graphs对应的xAxis 和 yAxis实例，后续柱折混合图里对修改传入的yAxis实例
        this._xAxis = this.root._coordinate._xAxis;
        this._yAxis = this.root._coordinate._yAxis;

        this.animation = true;

        this.pos = {
            x: 0,
            y: 0
        };

        this.colors = themeColors;

        this.bar = {
            width: 0,
            _width: 0,
            radius: 4,
            fillStyle : null,
            filter : function(){}, //用来定制bar的样式
            count: 0, //总共有多少个bar
            xDis: null
        };

        this.text = {
            enabled: false,
            fillStyle: '#999',
            fontSize: 12,
            format: null,
            lineWidth:1,
            strokeStyle: 'white'
        };

        this.checked = {
            enabled: false,
            fillStyle: '#00A8E6',
            strokeStyle: '#00A8E6',
            fillAlpha: 0.1,
            lineWidth: 2
        }

        this.sort = null;

        this._barsLen = 0;

        this.eventEnabled = true;

        this.sprite = null;
        this.txtsSp = null;
        this.checkedSp = null;

        _.deepExtend(this, opt);

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
        this.checkedSp = new Canvax.Display.Sprite({
            id: "checkedSp"
        });
    }

    setX($n) 
    {
        this.sprite.context.x = $n
    }

    setY($n) 
    {
        this.sprite.context.y = $n
    }

    getInfo(index) 
    {
        //该index指当前
        return this._getInfoHandler({
            iNode: index
        })
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

    checkedAt($o)
    {
        var me = this
        var index = $o.iNode
        var group = me.barsSp.getChildById('barGroup_' + index)
        if (!group) {
            return
        }

        me.checkedSp.removeChildById('line_' + index)
        me.checkedSp.removeChildById('rect_' + index)
        var hoverRect = group.getChildAt(0)
        var x0 = hoverRect.context.x
        var x1 = hoverRect.context.x + hoverRect.context.width,
            y = -me.h

        if ($o.checked && !me.checkedSp.getChildById("rect_" + index)) {
            var rect = new Rect({
                id: "rect_" + index,
                pointChkPriority: false,
                context: {
                    x: x0,
                    y: y,
                    width: hoverRect.context.width,
                    height: hoverRect.context.height,
                    fillStyle: me.checked.fillStyle,
                    fillAlpha: me.checked.fillAlpha
                }
            });
            me.checkedSp.addChild(rect)

            var line = new BrokenLine({
                id: "line_" + index,
                context: {
                    pointList: [
                        [x0, y],
                        [x1, y]
                    ],
                    strokeStyle: me.checked.strokeStyle,
                    lineWidth: me.checked.lineWidth
                }
            });
            me.checkedSp.addChild(line)
        }
    }

    removeAllChecked()
    {
        var me = this
        me.checkedSp.removeAllChildren()
    }

    setBarStyle($o)
    {
        var me = this
        var index = $o.iNode
        var group = me.barsSp.getChildById('barGroup_' + index)
        
        var fillStyle = $o.fillStyle || me._getColor(me.bar.fillStyle)
        for (var a = 0, al = group.getNumChildren(); a < al; a++) {
            var rectEl = group.getChildAt(a)
            rectEl.context.fillStyle = fillStyle
        }
    }

    _setyAxisFieldsMap( opt )
    {
        var me = this;
        !opt && ( opt = {} );
        //柱折混合图，会再opt里传入一份yAxisFields
        var yAxisFields = opt.yAxisFields || this.root._coordinate.yAxisFields;
        _.each( yAxisFields , function(field, i) {
            me._yAxisFieldsMap[field] = {
                index: i
            };
        });
    }

    _getColor(c, groups, vLen, i, h, v, value, field)
    {
        var style = null;
        if (_.isString(c)) {
            style = c
        };
        if (_.isArray(c)) {
            style = _.flatten(c)[this._yAxisFieldsMap[field].index];
        };
        if (_.isFunction(c)) {
            style = c.apply(this, [{
                iGroup: i,
                iNode: h,
                iLay: v,
                field: field,
                value: value,
                xAxis: {
                    field: this._xAxis.field,
                    value: this._xAxis.data[h].content
                }
            }]);
        };
        if (!style || style == "") {
            style = this.colors[this._yAxisFieldsMap[field].index];
        };
        return style;
    }

    _getBarWidth(xDis1, xDis2)
    {
        if (this.bar.width) {
            if (_.isFunction(this.bar.width)) {
                this.bar._width = this.bar.width(xDis1);
            } else {
                this.bar._width = this.bar.width;
            }
        } else {
            this.bar._width = parseInt(xDis2) - (parseInt(Math.max(1, xDis2 * 0.3)));

            //这里的判断逻辑用意已经忘记了，先放着， 有问题在看
            if (this.bar._width == 1 && xDis1 > 3) {
                this.bar._width = parseInt(xDis1) - 2;
            };
        };
        this.bar._width < 1 && (this.bar._width = 1);
        return this.bar._width;
    }

    add( field ){

    }
    remove( field )
    {

    }

    reset(opt)
    {
        this.draw( opt );
    }

    clean()
    {
        this.data = [];
        this.barsSp.removeAllChildren();
        this.checkedSp.removeAllChildren();
        if (this.text.enabled) {
            this.txtsSp.removeAllChildren();
        };
    }

    draw(opt)
    { //第二个data参数去掉，直接trimgraphs获取最新的data
        
        _.deepExtend(this, opt);

        var data = this._trimGraphs();

        if (data.length == 0 || data[0].length == 0) {
            this.clean();
            return;
        };

        var preLen = 0; //纵向的分组，主要用于resetData的时候，对比前后data数量用
        this.data[0] && (preLen = this.data[0][0].length);

        this.data = data;
        var me = this;
        var groups = data.length;
        var itemW = 0;

        me.bar.count = 0;

        _.each(data, function(h_group, i) {
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

            //if (h <= preLen - 1)的话说明本次绘制之前sprite里面已经有bar了。需要做特定的动画效果走过去

            var vLen = h_group.length;
            if (vLen == 0) return;

            //hlen为数据有多长
            var hLen = h_group[0].length; 

            //itemW 还是要跟着xAxis的xDis保持一致
            itemW = me.w / hLen;

            me._barsLen = hLen * groups;

            for (var h = 0; h < hLen; h++) {
                var groupH;
                if (i == 0) {
                    //横向的分组
                    if (h <= preLen - 1) {
                        groupH = me.barsSp.getChildById("barGroup_" + h);
                    } else {
                        groupH = new Canvax.Display.Sprite({
                            id: "barGroup_" + h
                        });
                        me.barsSp.addChild(groupH);
                        groupH.iNode = h;
                        groupH.on("click dblclick mousedown mousemove mouseup", function(e) {
                            if (!e.eventInfo) {
                                e.eventInfo = me._getInfoHandler(this);
                            };
                        });
                    };

                    if (me.eventEnabled) {
                        var hoverRect;
                        if (h <= preLen - 1) {
                            hoverRect = groupH.getChildById("bhr_" + h);
                            hoverRect.context.width = itemW;
                            hoverRect.context.x = itemW * h;
                        } else {
                            hoverRect = new Rect({
                                id: "bhr_" + h,
                                pointChkPriority: false,
                                hoverClone: false,
                                context: {
                                    x: itemW * h,
                                    y: (me.sort && me.sort == "desc") ? 0 : -me.h,
                                    width: itemW,
                                    height: me.h,
                                    fillStyle: "#ccc",
                                    fillAlpha: 0
                                }
                            });
                            groupH.addChild(hoverRect);
                            hoverRect.hover(function(e) {
                                this.context.fillAlpha = 0.1;
                            }, function(e) {
                                this.context.fillAlpha = 0;
                            });
                            hoverRect.iGroup = -1, hoverRect.iNode = h, hoverRect.iLay = -1;
                            hoverRect.on("panstart mouseover mousemove mouseout click", function(e) {
                                e.eventInfo = me._getInfoHandler(this, e);
                            });
                        }
                    };
                } else {
                    groupH = me.barsSp.getChildById("barGroup_" + h);
                };

                //同上面，给txt做好分组
                var txtGroupH;
                if (i == 0) {
                    if (h <= preLen - 1) {
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
                    
                    me.bar.count ++;

                    //单个的bar，从纵向的底部开始堆叠矩形
                    var rectData = h_group[v][h];
                    rectData.iGroup = i, rectData.iNode = h, rectData.iLay = v;

                    var fillStyle = me._getColor(me.bar.fillStyle, groups, vLen, i, h, v, rectData.value, rectData.field);

                    //根据第一行数据来配置下_yAxisFieldsMap中对应field的fillStyle
                    if ( h == 0 ) {
                        var _yMap = me._yAxisFieldsMap[ rectData.field ];
                        if (!_yMap.fillStyle) {
                            _yMap.fillStyle = fillStyle;
                        };
                    };

                    rectData.fillStyle = fillStyle;

                    var rectH = rectData.y - rectData.fromY;

                    if( isNaN(rectH) || Math.abs(rectH) < 1 ){
                        rectH = 0;
                    };

                    var finalPos = {
                        x: Math.round(rectData.x),
                        y: rectData.fromY, 
                        width: parseInt(me.bar._width),
                        height: rectH,
                        fillStyle: fillStyle,
                        scaleY: -1
                    };
                    rectData.width = finalPos.width;
                    
                    var rectCxt = {
                        x: finalPos.x,
                        y: rectData.yBasePoint.y,//0,
                        width: finalPos.width,
                        height: finalPos.height,
                        fillStyle: finalPos.fillStyle,
                        scaleY: 0
                    };
                    
                    if ( !!me.bar.radius && rectData.isLeaf ) {
                        var radiusR = Math.min(me.bar._width / 2, Math.abs(rectH));
                        radiusR = Math.min(radiusR, me.bar.radius);
                        rectCxt.radius = [radiusR, radiusR, 0, 0];
                    };

                    if (!me.animation) {
                        delete rectCxt.scaleY;
                        rectCxt.y = finalPos.y;
                    };

                    var rectEl;
                    if (h <= preLen - 1) {
                        rectEl = groupH.getChildById("bar_" + i + "_" + h + "_" + v);
                        rectEl.context.fillStyle = fillStyle;
                    } else {
                        rectEl = new Rect({
                            id: "bar_" + i + "_" + h + "_" + v,
                            context: rectCxt
                        });
                        groupH.addChild(rectEl);
                    };



                    rectEl.finalPos = finalPos;

                    rectEl.iGroup = i, rectEl.iNode = h, rectEl.iLay = v;

                    me.bar.filter.apply( rectEl, [ rectData , me] );

                    if (me.eventEnabled) {
                        rectEl.on("panstart mouseover mousemove mouseout click dblclick", function(e) {
                            e.eventInfo = me._getInfoHandler(this, e);
                            if (e.type == "mouseover") {
                                this.parent.getChildById("bhr_" + this.iNode).context.fillAlpha = 0.1;
                            }
                            if (e.type == "mouseout") {
                                this.parent.getChildById("bhr_" + this.iNode).context.fillAlpha = 0;
                            }
                        });
                    };

                    //叶子节点上面放置info
                    if (rectData.isLeaf && me.text.enabled) {
                        
                        //文字
                        var infosp;
                        if (h <= preLen - 1) {
                            infosp = txtGroupH.getChildById("infosp_" + i + "_" + h + "_" + v);
                        } else {
                            //console.log("infosp_" + i + "_" + h + "_" + v);
                            infosp = new Canvax.Display.Sprite({
                                id: "infosp_" + i + "_" + h + "_" + v,
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
                                h_group[c][h].value > h_group[c][h].yBasePoint.content
                            ) {
                                contents.push(h_group[c][h]);
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

                            var txt;
                            if (h <= preLen - 1) {
                                txt = infosp.getChildById("info_txt_" + i + "_" + h + "_" + ci);
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

                        infosp._finalX = rectData.x + me.bar._width/2 - infoWidth / 2;

                        
                        //如果数据在basepoint下方
                        if( rectData.value < rectData.yBasePoint.content ){
                            infosp._finalY = rectData.y + 3; //3 只是个偏移量，没有什么特别的意思
                        } else {
                            infosp._finalY = rectData.y - infoHeight;
                            infosp.upOfYbaseNumber = true;
                        }
                        //if( rectData.value )

                        infosp._centerX = rectData.x+me.bar._width/2;
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

        this.sprite.addChild(this.checkedSp)

        if (this.text.enabled) {
            this.sprite.addChild(this.txtsSp);
        };

        this.sprite.context.x = this.pos.x;
        this.sprite.context.y = this.pos.y;

        if (this.sort && this.sort == "desc") {
            this.sprite.context.y -= this.h;
        };

        this.grow(function() {
            me.fire("complete");
        }, {
            delay: 0,
            easing: me.proportion ? "Quadratic.Line" : "Quadratic.Out",
            duration: 300
        });

    }

    _trimGraphs()
    {
        
        var _xAxis = this._xAxis;
        var _yAxis = this._yAxis;

        var xArr = _xAxis.data;
        var hLen = 0;
        _.each( _yAxis, function( _yaxis ){
            hLen += _yaxis.field.length;
        } );

        var xDis1 = _xAxis.xDis;
        //x方向的二维长度，就是一个bar分组里面可能有n个子bar柱子，那么要二次均分
        var xDis2 = xDis1 / (hLen + 1);
        //知道了xDis2 后 检测下 barW是否需要调整
        var barW = this._getBarWidth(xDis1, xDis2);
        var barDis = xDis2 - barW;
        if( this.bar.xDis != null ){
            barDis = this.bar.xDis;
        };
        
        var disLeft,disRight;
        disLeft = disRight = (xDis1 - barW*hLen - barDis*(hLen-1) ) / 2;

        var tmpData = [];
        var me = this;

        
        _.each( _yAxis, function( _yaxis , yind ){
            //dataOrg和field是一一对应的
            _.each( _yaxis.dataOrg, function( hData, b ){
                //hData，可以理解为一根竹子 横向的分组数据，这个hData上面还可能有纵向的堆叠

                //tempBarData 一根柱子的数据， 这个柱子是个数据，上面可以有n个子元素对应的竹节
                var tempBarData = [];
                _.each( hData, function( vSectionData, v ){
                    tempBarData[v] = [];
                    //vSectionData 代表某个字段下面的一组数据比如 uv
                    _.each(vSectionData, function(val, i) {
                        if (!xArr[i]) {
                            return;
                        };

                        var vCount = 0;
                        if (me.proportion) {
                            //先计算总量
                            _.each( hData, function(team, ti) {
                                vCount += team[i]
                            });
                        };
                        
                        var x = xArr[i].x - xDis1 / 2 + disLeft + (barW + barDis)*b;
                        if( yind>0 ){
                            x += (barW + barDis)*(_yAxis[yind-1].dataOrg.length);
                        };

                        var y = 0;
                        if (me.proportion) {
                            y = -val / vCount * _yaxis.yGraphsHeight;
                        } else {
                            y = _yaxis.getYposFromVal( val );
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
                        var fromY = _getFromY(tempBarData, v, i, val, y, _yaxis.basePoint);
                        y += fromY - _yaxis.basePoint.y;


                        //如果有排序的话
                        //TODO:这个逻辑好像有问题
                        if (_yaxis.sort && _yaxis.sort == "desc") {
                            y = -(_yaxis.yGraphsHeight - Math.abs(y));
                        };

                        var node = {
                            value: val,
                            field: me._getTargetField(b, v, i, _yaxis.field),
                            fromX: x,
                            fromY: fromY,
                            x: x,
                            y: y,
                            yBasePoint: _yaxis.basePoint,
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

                        tempBarData[v].push(node);

                    });
                } );
                
                tempBarData.length && tmpData.push( tempBarData );
            } );
            
        } );
        return tmpData;
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
    grow(callback, opt) 
    {

        var me = this;
        if (!this.animation) {
            callback && callback(me);
            return;
        };
        var sy = 1;
        if (this.sort && this.sort == "desc") {
            sy = -1;
        };

        //先把已经不在当前range范围内的元素destroy掉
        if ( me.data[0] && me.data[0].length && me.barsSp.children.length > me.data[0][0].length) {
            for (var i = me.data[0][0].length, l = me.barsSp.children.length; i < l; i++) {
                me.barsSp.getChildAt(i).destroy();
                me.text.enabled && me.txtsSp.getChildAt(i).destroy();
                i--;
                l--;
            };
        };

        var options = _.extend({
            delay: Math.min(1000 / this._barsLen, 80),
            easing: "Back.Out",
            duration: 500
        }, opt);

        var barCount = 0;
        _.each(me.data, function(h_group, g) {
            var vLen = h_group.length;
            if (vLen == 0) return;
            var hLen = h_group[0].length;
            for (var h = 0; h < hLen; h++) {
                for (var v = 0; v < vLen; v++) {

                    var group = me.barsSp.getChildById("barGroup_" + h);

                    var bar = group.getChildById("bar_" + g + "_" + h + "_" + v);
                    //console.log("finalPos"+bar.finalPos.y)

                    if (options.duration == 0) {
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
                            duration: options.duration,
                            easing: options.easing,
                            delay: h * options.delay,
                            onUpdate: function(arg) {

                            },
                            onComplete: function(arg) {
                                if (arg.width < 3) {
                                    this.context.radius = 0;
                                }

                                barCount ++;

                                if( barCount === me.bar.count ){
                                    callback && callback(me);
                                }
                            },
                            id: bar.id
                        });
                    };



                    //txt grow
                    if (me.text.enabled) {
                        var txtGroupH = me.txtsSp.getChildById("txtGroup_" + h);

                        var infosp = txtGroupH.getChildById("infosp_" + g + "_" + h + "_" + v);
                        if(infosp){

                            infosp.animate({
                                y: infosp._finalY,
                                x: infosp._finalX
                            }, {
                                duration: options.duration,
                                easing: options.easing,
                                delay: h * options.delay,
                                onUpdate: function() {
                                    this.context.visible = true;
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
                                        duration: options.duration + 300,
                                        delay: h * options.delay,
                                        onUpdate: function() {
                                            var content = this.v;

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
        //callback && callback(me);
        /*
        window.setTimeout(function() {
            callback && callback(me);
        }, 300 * (this.barsSp.children.length - 1));
        */
    }

    _getInfoHandler(target) 
    {
        var node = {
            iGroup: target.iGroup,
            iNode: target.iNode,
            iLay: target.iLay,
            nodesInfoList: this._getNodeInfo(target.iGroup, target.iNode, target.iLay)
        };
        return node;
    }

    _getNodeInfo(iGroup, iNode, iLay) 
    {
        var arr = [];
        var me = this;
        var groups = me.data.length;

        iGroup == undefined && (iGroup = -1);
        iNode == undefined && (iNode = 0);
        iLay == undefined && (iLay = -1);

        _.each(me.data, function(h_group, i) {
            var node;
            var vLen = h_group.length;
            if (vLen == 0) return;
            var hLen = h_group[0].length;
            for (var h = 0; h < hLen; h++) {
                if (h == iNode) {
                    for (var v = 0; v < vLen; v++) {
                        if ((iGroup == i || iGroup == -1) && (iLay == v || iLay == -1)) {
                            node = h_group[v][h]
                            node.fillStyle = me._getColor(me.bar.fillStyle, groups, vLen, i, h, v, node.value, node.field);
                            arr.push(node)
                        }
                    }
                }
            }
        });
        return arr;
    }
}
