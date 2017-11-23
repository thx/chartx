import Canvax from "canvax2d"
import _ from "underscore"
import {numAddSymbol} from "../../utils/tools"
import {colors as themeColors} from "../theme"

var AnimationFrame = Canvax.AnimationFrame;
var BrokenLine = Canvax.Shapes.BrokenLine;
var Rect = Canvax.Shapes.Rect;

export default class Graphs 
{
	constructor(opt, root)
	{
		this.data = [];
        this.w = 0;
        this.h = 0;
        this.root = root;
        this._yAxisFieldsMap = {}; //{"uv":{index:0,fillStyle:"" , ...} ...}
        this._setyAxisFieldsMap();

        this.animation = true;

        this.pos = {
            x: 0,
            y: 0
        };

        this._colors = themeColors;

        this.bar = {
            width: 0,
            _width: 0,
            radius: 4,
            fillStyle : null,
            filter : function(){}, //用来定制bar的样式
            count: 0 //总共有多少个bar
        };

        this.text = {
            enabled: false,
            fillStyle: '#999',
            fontSize: 12,
            format: null,
            lineWidth:1,
            strokeStyle: 'white'
        };

        this.average = {
            enabled: false,
            field: "average",
            fieldInd: -1,
            fillStyle: "#c4c9d6",
            data: null
        };

        this.checked = {
            enabled: false,
            fillStyle: '#00A8E6',
            strokeStyle: '#00A8E6',
            globalAlpha: 0.1,
            lineWidth: 2
        };

        this.hoverRect = {
            globalAlpha: 0.15,
            fillStyle: "#333"
        }

        this.sort = null;

        this._barsLen = 0;

        this.eventEnabled = true;

        this.sprite = null;
        this.txtsSp = null;
        this.checkedSp = null;

        this.yDataSectionLen = 0; //y轴方向有多少个section

        _.deepExtend(this, opt);

        this._initaverage();

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

    _checked($o) 
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
                    globalAlpha: me.checked.globalAlpha
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

    _setyAxisFieldsMap() 
    {
        var me = this;
        _.each(_.flatten(this.root.dataFrame.yAxis.field), function(field, i) {
            me._yAxisFieldsMap[field] = {
                index: i
            };
        });
    }

    _initaverage() 
    {
        if (this.average.enabled) {
            _.each(this.root.dataFraem, function(fd, i) {
                if (fd.field == this.average.field) {
                    this.average.fieldInd = i;
                }
            });
        }
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
                    field: this.root._xAxis.field,
                    value: this.root._xAxis.data[h].content
                }
            }]);
        };
        if (!style || style == "") {
            style = this._colors[this._yAxisFieldsMap[field].index];
        };
        return style;
    }

    //只用到了i v。 i＝＝ 一级分组， v 二级分组
    _getFieldFromIHV( i , h , v )
    {
        var yField = this.root._yAxis.field;
        var field = null;
        if( _.isString(yField[i]) ){
            field = yField[i];
        } else if( _.isArray(yField[i]) ){
            field = yField[i][v];
        }
        return field;
    }

    getBarWidth(xDis1, xDis2) 
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

    resetData(data, opt) 
    {
        this.draw(data.data, opt);
    }

    clean() 
    {
        this.data = [];
        this.barsSp.removeAllChildren();
        this.checkedSp.removeAllChildren();
        if (this.text.enabled) {
            this.txtsSp.removeAllChildren();
        };
        this.averageSp && this.averageSp.removeAllChildren();
    }

    draw(data, opt) 
    {
        _.deepExtend(this, opt);
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
                            hoverRect = groupH.getChildById("bhr_hoverRect_" + h);
                            hoverRect.context.width = itemW;
                            hoverRect.context.x = itemW * h;
                        } else {
                            hoverRect = new Rect({
                                id: "bhr_hoverRect_" + h,
                                pointChkPriority: false,
                                context: {
                                    x: itemW * h,
                                    y: (me.sort && me.sort == "desc") ? 0 : -me.h,
                                    width: itemW,
                                    height: me.h,
                                    fillStyle: me.hoverRect.fillStyle,
                                    globalAlpha: 0
                                }
                            });
                            groupH.addChild(hoverRect);
                            hoverRect.hover(function(e) {
                                this.context.globalAlpha = me.hoverRect.globalAlpha;
                            }, function(e) {
                                this.context.globalAlpha = 0;
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
                    if (h == 0) {
                        var _yMap = me._yAxisFieldsMap[ me._getFieldFromIHV( i , h , v ) ];
                        if (!_yMap.fillStyle) {
                            _yMap.fillStyle = fillStyle;
                        };
                    };

                    rectData.fillStyle = fillStyle;

                    var rectH = rectData.y - rectData.fromY;

                    if( isNaN(rectH) || Math.abs(rectH) < 1 ){
                        rectH = -1;
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
                                this.parent.getChildById("bhr_hoverRect_" + this.iNode).context.globalAlpha = me.hoverRect.globalAlpha;
                            }
                            if (e.type == "mouseout") {
                                this.parent.getChildById("bhr_hoverRect_" + this.iNode).context.globalAlpha = 0;
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

        //如果有average模块配置。
        if (this.average.enabled && this.average.data) {
            !this.averageSp && (this.averageSp = new Canvax.Display.Sprite({
                id: "averageSp"
            }));
            _.each(this.average.layoutData, function(average, i) {
                var averageRectC = {
                    x: itemW * i,
                    y: average.y,
                    fillStyle: me.average.fillStyle,
                    width: itemW,
                    height: 2
                };
                var averageLine;
                if (i <= preLen - 1) {
                    averageLine = me.averageSp.getChildById("average_" + i);
                    averageLine.context.x = averageRectC.x;
                    averageLine.context.y = averageRectC.y;
                    averageLine.context.width = averageRectC.width;
                } else {
                    averageLine = new Rect({
                        id: "average_" + i,
                        context: averageRectC
                    });
                    me.averageSp.addChild(averageLine);
                };

            });
            this.sprite.addChild(me.averageSp);
        };

        this.sprite.context.x = this.pos.x;
        this.sprite.context.y = this.pos.y;

        if (this.sort && this.sort == "desc") {
            this.sprite.context.y -= this.h;
        };
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
                me.averageSp && me.averageSp.getChildAt(i).destroy();
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
                                        onUpdate: function( obj ) {
                                            var content = obj.v;

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