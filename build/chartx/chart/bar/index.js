define(
    "chartx/chart/bar/graphs", [
        "canvax/index",
        "canvax/shape/Rect",
        "canvax/animation/Tween",
        "chartx/utils/tools"
    ],
    function(Canvax, Rect, Tween, Tools) {

        var Graphs = function(opt, root) {
            this.w = 0;
            this.h = 0;
            this.root = root;

            this.pos = {
                x: 0,
                y: 0
            };

            this._colors = ["#42a8d7", '#666666', "#6f8cb2", "#c77029", "#f15f60", "#ecb44f", "#ae833a", "#896149", "#4d7fff"];

            this.bar = {
                width: 22,
                radius: 4
            }
            this.text = {
                enabled: 0,
                fillStyle: '#999',
                fontSize: 12,
                format: null
            }

            this.eventEnabled = true;

            this.sprite = null;
            this.txtsSp = null;

            this.yDataSectionLen = 0; //y轴方向有多少个section

            _.deepExtend(this, opt);

            this.init();
        };

        Graphs.prototype = {
            init: function() {
                this.sprite = new Canvax.Display.Sprite({
                    id: "graphsEl"
                });
                this.txtsSp = new Canvax.Display.Sprite({
                    id: "txtsSp",
                    context: {
                        visible: false
                    }
                });
            },
            setX: function($n) {
                this.sprite.context.x = $n
            },
            setY: function($n) {
                this.sprite.context.y = $n
            },
            _getColor: function(c, groups, vLen, i, h, v, value) {
                var style = null;
                if (_.isString(c)) {
                    style = c
                }
                if (_.isArray(c)) {
                    var cl = c[i];
                    if (!_.isArray(cl)) {
                        cl = [cl];
                    }
                    style = cl[v];
                }
                if (_.isFunction(c)) {
                    style = c({
                        iGroup: i,
                        iNode: h,
                        iLay: v,
                        value: value
                    });
                }
                if (!style || style == "") {
                    style = this._colors[vLen > 1 ? v + i * groups % (vLen * (i + 1)) : i];
                }
                return style;
            },
            checkBarW: function(xDis) {
                if (this.bar.width >= xDis) {
                    this.bar.width = xDis - 1 > 1 ? xDis - 1 : 1;
                }
            },
            draw: function(data, opt) {
                _.deepExtend(this, opt);
                if (data.length == 0) {
                    return;
                };

                this.data = data;
                var me = this;
                var groups = data.length;
                _.each(data, function(h_group, i) {
                    /*
                    //h_group为横向的分组。如果yAxis.field = ["uv","pv"]的话，
                    //h_group就会为两组，一组代表uv 一组代表pv。
                    var spg = new Canvax.Display.Sprite({ id : "barGroup"+i });
                    */

                    //vLen 为一单元bar上面纵向堆叠的length
                    //比如yAxis.field = [
                    //    ["uv","pv"],  vLen == 2
                    //    "click"       vLen == 1
                    //]
                    var vLen = h_group.length;
                    if (vLen == 0) return;
                    var hLen = h_group[0].length;

                    for (h = 0; h < hLen; h++) {
                        var groupH;
                        if (i == 0) {
                            //横向的分组
                            groupH = new Canvax.Display.Sprite({
                                id: "barGroup_" + h
                            });
                            me.sprite.addChild(groupH);

                            //横向的分组区片感应区
                            var itemW = me.w / hLen;
                            var hoverRect = new Rect({
                                id: "bhr_" + h,
                                pointChkPriority: false,
                                context: {
                                    x: itemW * h,
                                    y: -me.h,
                                    width: itemW,
                                    height: me.h,
                                    fillStyle: "#ccc",
                                    globalAlpha: 0
                                }
                            });
                            groupH.addChild(hoverRect);
                            hoverRect.hover(function(e) {
                                this.context.globalAlpha = 0.1;
                            }, function(e) {
                                this.context.globalAlpha = 0;
                            });
                            hoverRect.iGroup = h, hoverRect.iNode = -1, hoverRect.iLay = -1;
                            hoverRect.on("panstart mouseover mousemove mouseout click", function(e) {
                                e.eventInfo = me._getInfoHandler(this, e);
                            });

                        } else {
                            groupH = me.sprite.getChildById("barGroup_" + h)
                        };

                        for (v = 0; v < vLen; v++) {
                            //单个的bar，从纵向的底部开始堆叠矩形
                            var rectData = h_group[v][h];
                            rectData.iGroup = h, rectData.iNode = i, rectData.iLay = v
                            var rectH = parseInt(Math.abs(rectData.y));
                            if (v > 0) {
                                rectH = rectH - parseInt(Math.abs(h_group[v - 1][h].y));
                            }
                            var fillStyle = me._getColor(me.bar.fillStyle, groups, vLen, i, h, v, rectData.value);
                            var rectCxt = {
                                x: Math.round(rectData.x - me.bar.width / 2),
                                y: parseInt(rectData.y),
                                width: parseInt(me.bar.width),
                                height: rectH,
                                fillStyle: fillStyle
                            };
                            if (!!me.bar.radius && v == vLen - 1) {
                                var radiusR = Math.min(me.bar.width / 2, rectH);
                                radiusR = Math.min(radiusR, me.bar.radius);
                                rectCxt.radius = [radiusR, radiusR, 0, 0];
                            };
                            var rectEl = new Rect({
                                context: rectCxt
                            });

                            groupH.addChild(rectEl);

                            rectEl.iGroup = h, rectEl.iNode = i, rectEl.iLay = v;
                            rectEl.on("panstart mouseover mousemove mouseout click", function(e) {
                                e.eventInfo = me._getInfoHandler(this, e);
                                if (e.type == "mouseover") {
                                    this.parent.getChildById("bhr_" + this.iGroup).context.globalAlpha = 0.1;
                                }
                                if (e.type == "mouseout") {
                                    this.parent.getChildById("bhr_" + this.iGroup).context.globalAlpha = 0;
                                }
                            });

                            //目前，只有再非堆叠柱状图的情况下才有柱子顶部的txt
                            if (vLen == 1) {
                                //文字
                                var content = rectData.value
                                if (_.isFunction(me.text.format)) {
                                    content = me.text.format(content);
                                } else {
                                    content = Tools.numAddSymbol(content);
                                };
                                
                                var context =  {
                                    fillStyle: me.text.fillStyle,
                                    fontSize: me.text.fontSize
                                };

                                var txt = new Canvax.Display.Text(content, context);
                                txt.context.x = rectData.x - txt.getTextWidth() / 2;
                                txt.context.y = rectCxt.y - txt.getTextHeight();
                                if (txt.context.y + me.h < 0) {
                                    txt.context.y = -me.h;
                                }
                                me.txtsSp.addChild(txt)
                            }
                        };
                    }
                });

                if (this.txtsSp.children.length > 0) {
                    this.sprite.addChild(this.txtsSp);
                };

                this.sprite.context.x = this.pos.x;
                this.sprite.context.y = this.pos.y;
            },
            /**
             * 生长动画
             */
            grow: function(callback) {
                var self = this;
                var timer = null;
                var growAnima = function() {
                    var bezierT = new Tween.Tween({
                            h: 0
                        })
                        .to({
                            h: self.h
                        }, 500)
                        .onUpdate(function() {
                            self.sprite.context.scaleY = this.h / self.h;
                        }).onComplete(function() {
                            self._growEnd();
                            cancelAnimationFrame(timer);
                            callback && callback(self);
                        }).start();
                    animate();
                };

                function animate() {
                    timer = requestAnimationFrame(animate);
                    Tween.update();

                };
                growAnima();
            },
            _growEnd: function() {
                if (this.text.enabled) {
                    this.txtsSp.context.visible = true
                }
            },
            _getInfoHandler: function(target) {
                var node = {
                    iGroup: target.iGroup,
                    iNode: target.iNode,
                    iLay: target.iLay,
                    nodesInfoList: this._getNodeInfo(target.iGroup, target.iNode, target.iLay)
                };
                return node
            },
            _getNodeInfo: function(iGroup, iNode, iLay) {
                var arr = [];
                var me = this;
                var groups = me.data.length;
                _.each(me.data, function(h_group, i) {
                    var node;
                    var vLen = h_group.length;
                    if (vLen == 0) return;
                    var hLen = h_group[0].length;
                    for (h = 0; h < hLen; h++) {
                        if (h == iGroup) {
                            for (v = 0; v < vLen; v++) {
                                if ((iNode == i || iNode == -1) && (iLay == v || iLay == -1)) {
                                    node = h_group[v][h]
                                    node.fillStyle = me._getColor(me.bar.fillStyle, groups, vLen, i, h, v, node.value);
                                    arr.push(node)
                                }
                            }
                        }
                    }
                })
                return arr;
            }
        };

        return Graphs;
    }
)


define(
    "chartx/chart/bar/xaxis",
    [
        "chartx/components/xaxis/xAxis"
    ],
    function( xAxisBase ){
        var xAxis = function( opt , data ){
            this.xDis1 = 0; //x方向一维均分长度
            xAxis.superclass.constructor.apply( this , arguments );
        };
        Chartx.extend( xAxis , xAxisBase , {
            _trimXAxis:function( data , xGraphsWidth ){
                
                var tmpData = [];
                this.xDis1  = xGraphsWidth / data.length;
                for (var a = 0, al  = data.length; a < al; a++ ) {
                    var o = {
                        'content' : data[a], 
                        'x'       : this.xDis1 * (a+1) - this.xDis1/2
                    }
                    tmpData.push( o );
                }
                
                return tmpData;
            } 
        } );
    
        return xAxis;
    } 
);


define(
    "chartx/chart/bar/yaxis",
    [
        "chartx/components/yaxis/yAxis"
    ],
    function( yAxisBase ){
        var yAxis = function( opt , data ){
            yAxis.superclass.constructor.apply( this , [ ( opt.bar ? opt.bar : opt ) , data ] );
        };
        Chartx.extend( yAxis , yAxisBase , {
            _setDataSection : function( data ){
                var arr = [];
                _.each( data.org , function( d , i ){
                    var varr = [];
                    var len  = d[0].length;
                    var vLen = d.length;
                    var min = 0;
                    for( var i = 0 ; i<len ; i++ ){
                        var count = 0;
                        for( var ii = 0 ; ii < vLen ; ii++ ){
                            count += d[ii][i];
                            min = Math.min( d[ii][i], min );
                        }
                        varr.push( count );
                    }
                    varr.push(min);
                    arr.push( varr );
                } );
                return _.flatten(arr);
            }
        } );
    
        return yAxis;
    } 
);


define(
    "chartx/chart/bar/index", [
        'chartx/chart/index',
        'chartx/utils/tools',
        'chartx/utils/datasection',
        './xaxis',
        './yaxis',
        //'chartx/components/yaxis/yAxis',
        'chartx/components/back/Back',
        './graphs',
        'chartx/components/tips/tip',
        'chartx/utils/dataformat'
    ],
    function(Chart, Tools, DataSection, xAxis, yAxis, Back, Graphs, Tip, dataFormat) {
        /*
         *@node chart在dom里的目标容器节点。
         */
        var Canvax = Chart.Canvax;
        return Chart.extend({
            _xAxis: null,
            _yAxis: null,
            _back: null,
            _graphs: null,
            _tip: null,

            init: function(node, data, opts) {
                this._opts = opts;
                _.deepExtend(this, opts);
                this.dataFrame = this._initData(data);
            },
            _setStages: function() {
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
            },
            draw: function() {

                this._setStages();

                this._initModule(); //初始化模块  

                this._startDraw(); //开始绘图

                this._drawEnd(); //绘制结束，添加到舞台

            },
            _initData: function(data, opt) {
                var d = dataFormat.apply(this, arguments);
                _.each(d.yAxis.field, function(field, i) {
                    if (!_.isArray(field)) {
                        field = [field];
                        d.yAxis.org[i] = [d.yAxis.org[i]];
                    }
                });
                return d;
            },
            _initModule: function() {
                this._xAxis = new xAxis(this.xAxis, this.dataFrame.xAxis);
                this._yAxis = new yAxis(this.yAxis, this.dataFrame.yAxis);
                this._back = new Back(this.back);
                this._tip = new Tip(this.tips, this.canvax.getDomContainer());

                //因为tips放在graphs中，so 要吧tips的conf传到graphs中
                this._graphs = new Graphs(
                    this.graphs,
                    this
                );
            },
            _startDraw: function(opt) {
                var w = (opt && opt.w) || this.width;
                var h = (opt && opt.h) || this.height;
                var y = parseInt(h - this._xAxis.h);

                //绘制yAxis
                this._yAxis.draw({
                    pos: {
                        x: 0,
                        y: y
                    },
                    yMaxHeight: y
                });

                var _yAxisW = this._yAxis.w;

                //绘制x轴
                this._xAxis.draw({
                    graphh: h,
                    graphw: w,
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
                        data: this._xAxis.layoutData
                    },
                    pos: {
                        x: _yAxisW,
                        y: y
                    }
                });

                var o = this._trimGraphs()
                //绘制主图形区域
                this._graphs.draw(o.data, {
                    w: this._xAxis.xGraphsWidth,
                    h: this._yAxis.yGraphsHeight,
                    pos: {
                        x: _yAxisW,
                        y: y
                    },
                    yDataSectionLen: this._yAxis.dataSection.length
                });
            },

            //把这个点位置对应的x轴数据和y轴数据存到tips的info里面
            //方便外部自定义tip是的content
            _setXaxisYaxisToTipsInfo: function(e) {
                e.eventInfo.xAxis = {
                    field: this.dataFrame.xAxis.field,
                    value: this.dataFrame.xAxis.org[0][e.eventInfo.iGroup]
                }
                var me = this;
                _.each(e.eventInfo.nodesInfoList, function(node, i) {
                    if (_.isArray(me.dataFrame.yAxis.field[node.iNode])) {
                        node.field = me.dataFrame.yAxis.field[node.iNode][node.iLay];
                    } else {
                        node.field = me.dataFrame.yAxis.field[node.iNode]
                    }
                });
            },
            _trimGraphs: function(_xAxis, _yAxis) {
                _xAxis || (_xAxis = this._xAxis);
                _yAxis || (_yAxis = this._yAxis);
                var xArr = _xAxis.data;
                var yArr = _yAxis.dataOrg;
                var hLen = yArr.length; //bar的横向分组length

                var xDis1 = _xAxis.xDis1;
                //x方向的二维长度，就是一个bar分组里面可能有n个子bar柱子，那么要二次均分
                var xDis2 = xDis1 / (hLen + 1);

                //知道了xDis2 后 检测下 barW是否需要调整
                this._graphs.checkBarW && this._graphs.checkBarW(xDis2);

                var maxYAxis = _yAxis.dataSection[_yAxis.dataSection.length - 1];
                var tmpData = [];
                var center  = [], yValueMaxs = [], yLen = []
                for (var b = 0; b < hLen; b++) {
                    !tmpData[b] && (tmpData[b] = []);
                    yValueMaxs[b] = 0
                    center[b] = {}
                    _.each(yArr[b], function(subv, v) {
                        !tmpData[b][v] && (tmpData[b][v] = []);
                        _.each(subv, function(val, i) {
                            if (!xArr[i]) {
                                return;
                            }
                            var x = xArr[i].x - xDis1 / 2 + xDis2 * (b + 1);
                            var y = -(val - _yAxis._bottomNumber) / (maxYAxis - _yAxis._bottomNumber) * _yAxis.yGraphsHeight;
                            if (v > 0) {
                                y += tmpData[b][v - 1][i].y
                            };
                            tmpData[b][v].push({
                                value: val,
                                x: x,
                                y: y
                            });
                            yValueMaxs[b] += Number(val)
                            yLen = subv.length
                        });
                    });
                }

                for (var a = 0, al = yValueMaxs.length; a < al; a++) {
                    center[a].agValue = yValueMaxs[a] / yLen
                    center[a].agPosition = -(yValueMaxs[a] / yLen - _yAxis._bottomNumber) / (maxYAxis - _yAxis._bottomNumber) * _yAxis.yGraphsHeight
                }
                //均值
                this.dataFrame.yAxis.center = center
                return {
                    data: tmpData
                };
            },
            _drawEnd: function() {
                var me = this
                this.stageBg.addChild(this._back.sprite)

                this.core.addChild(this._xAxis.sprite);
                this.core.addChild(this._graphs.sprite);
                this.core.addChild(this._yAxis.sprite);

                this.stageTip.addChild(this._tip.sprite);

                //执行生长动画
                this._graphs.grow(function(g) {
                    if ("markLine" in me._opts) {
                        me._initMarkLine(g);
                    }
                });

                this.bindEvent();
            },
            _initMarkLine: function(g) {
                var me = this
                require(['chartx/components/markline/index'], function(MarkLine) {
                    for (var a = 0, al = me._yAxis.dataOrg.length; a < al; a++) {
                        var index  = a
                        var center = me.dataFrame.yAxis.center[a].agPosition
                        var strokeStyle = g.sprite.children[0] ? g.sprite.children[0].children[a + 1].context.fillStyle : '#000000'
                        
                        var content = me.dataFrame.yAxis.field[a] + '均值'
                        if(me.markLine.text && me.markLine.text.enabled){
                            
                            if(_.isFunction(me.markLine.text.format)){
                                var o = {
                                    iGroup : index,
                                    value  : me.dataFrame.yAxis.center[index].agValue
                                }
                                content = me.markLine.text.format(o)
                            }
                        }
                        var o = {
                            w: me._xAxis.xGraphsWidth,
                            h: me._yAxis.yGraphsHeight,
                            origin: {
                                x: me._back.pos.x,
                                y: me._back.pos.y
                            },
                            field : _.isArray(me._yAxis.field[a]) ? me._yAxis.field[a][0] : me._yAxis.field[a],
                            line: {
                                y: center,
                                list: [
                                    [0, 0],
                                    [me._xAxis.xGraphsWidth, 0]
                                ],
                                strokeStyle: strokeStyle
                            },
                            text: {
                                content  : content,
                                fillStyle: strokeStyle
                            },
                        }

                        new MarkLine(_.deepExtend(o, me._opts.markLine)).done(function() {
                            me.core.addChild(this.sprite)
                        })
                    }
                })

            },
            bindEvent: function() {
                var me = this;
                this._graphs.sprite.on("panstart mouseover", function(e) {
                    me._setXaxisYaxisToTipsInfo(e);
                    me._tip.show(e);
                });
                this._graphs.sprite.on("panmove mousemove", function(e) {
                    me._setXaxisYaxisToTipsInfo(e);
                    me._tip.move(e);
                });
                this._graphs.sprite.on("panend mouseout", function(e) {
                    me._tip.hide(e);
                });
                this._graphs.sprite.on("tap click", function(e) {
                    me._setXaxisYaxisToTipsInfo(e);
                    me.fire("click", e);
                });
            }
        });
    }
);
