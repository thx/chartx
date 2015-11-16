define(
    "chartx/chart/line/group", [
        "canvax/index",
        "canvax/shape/BrokenLine",
        "canvax/shape/Circle",
        "canvax/shape/Path",
        "chartx/utils/tools",
        "chartx/utils/colorformat",
        "canvax/animation/Tween",
        "chartx/chart/theme"
    ],
    function(Canvax, BrokenLine, Circle, Path, Tools, ColorFormat, Tween, Theme) {
        window.Canvax = Canvax
        var Group = function(field, a, opt, ctx, sort, yAxis, h, w) {
            this.field = field; //_groupInd在yAxis.field中对应的值
            this._groupInd = a;
            this._nodeInd = -1;
            this._yAxis = yAxis;
            this.sort = sort;
            this.ctx = ctx;
            this.w = w;
            this.h = h;
            this.y = 0;

            this.colors = Theme.colors;

            this.line = { //线
                enabled: 1,
                strokeStyle: this.colors[this._groupInd],
                lineWidth: 2,
                lineType: "solid",
                smooth: true
            };

            this.node = { //节点 
                enabled: 1, //是否有
                corner: false, //模式[false || 0 = 都有节点 | true || 1 = 拐角才有节点]
                r: 2, //半径 node 圆点的半径
                fillStyle: '#ffffff',
                strokeStyle: null,
                lineWidth: 3
            };

            this.fill = { //填充
                fillStyle: null,
                alpha: 0.05
            };

            this.dataOrg = []; //data的原始数据
            this.data = []; //data会在wight中过滤一遍，把两边的空节点剔除
            this.sprite = null;

            this._pointList = []; //brokenline最终的状态
            this._currPointList = []; //brokenline 动画中的当前状态
            this._bline = null;

            this.init(opt)
        };

        Group.prototype = {
            init: function(opt) {
                _.deepExtend(this, opt);

                //如果opt中没有node fill的设置，那么要把fill node 的style和line做同步
                !this.node.strokeStyle && (this.node.strokeStyle = this._getLineStrokeStyle());
                !this.fill.fillStyle && (this.fill.fillStyle = this._getLineStrokeStyle());
                this.sprite = new Canvax.Display.Sprite();
            },
            draw: function(opt) {
                _.deepExtend(this, opt);
                this._widget();
            },
            update: function(opt) {
                _.deepExtend(this, opt);
                this._pointList = this._getPointList(this.data);
                /*
                var list = [];
                for (var a = 0, al = this.data.length; a < al; a++) {
                    var o = this.data[a];
                    list.push([o.x, o.y]);
                };
                this._pointList = list;
                */
                this._grow();
            },
            //自我销毁
            destroy: function() {
                this.sprite.remove();
            },
            //styleType , normals , groupInd
            _getColor: function(s) {
                var color = this._getProp(s);
                if (!color || color == "") {
                    color = this.colors[this._groupInd];
                }
                return color;
            },
            _getProp: function(s) {
                if (_.isArray(s)) {
                    return s[this._groupInd]
                }
                if (_.isFunction(s)) {

                    return s({
                        iGroup: this._groupInd,
                        iNode: this._nodeInd,
                        field: this.field
                    });
                }
                return s
            },
            _getLineStrokeStyle: function() {
                if (this.__lineStyleStyle) {
                    return this.__lineStyleStyle;
                };
                this.__lineStyleStyle = this._getColor(this.line.strokeStyle);
                return this.__lineStyleStyle;
            },
            //这个是tips需要用到的 
            getNodeInfoAt: function($index) {
                var self = this;
                self._nodeInd = $index;
                var o = _.clone(self.dataOrg[$index]);
                if (o && o.value != null && o.value != undefined && o.value !== "") {
                    o.r = self._getProp(self.node.r);
                    o.fillStyle = self._getProp(self.node.fillStyle) || "#ffffff";
                    o.strokeStyle = self._getProp(self.node.strokeStyle) || self._getLineStrokeStyle();
                    o.color = self._getProp(self.node.strokeStyle) || self._getLineStrokeStyle(); //这个给tips里面的文本用
                    o.lineWidth = self._getProp(self.node.lineWidth) || 2;
                    o.alpha = self._getProp(self.fill.alpha);
                    o.field = self.field;
                    o._groupInd = self._groupInd;
                    // o.fillStyle = '#cc3300'
                    return o
                } else {
                    return null
                }
            },
            resetData: function(opt) {
                var self = this;
                self._pointList = this._getPointList(opt.data);
                var plen = self._pointList.length;
                var cplen = self._currPointList.length;
                if (plen < cplen) {
                    for (var i = plen, l = cplen; i < l; i++) {
                        self._circles.removeChildAt(i);
                        l--;
                        i--;
                    };
                    self._currPointList.length = plen;
                };

                if (plen > cplen) {
                    diffLen = plen - cplen;
                    for (var i = 0; i < diffLen; i++) {
                        self._currPointList.push(_.clone(self._currPointList[cplen - 1]));
                    }
                };

                self._circles && self._circles.removeAllChildren();
                self._createNodes();
                self._grow();
            },
            _grow: function(callback) {
                var self = this;
                var timer = null;
                if (self._currPointList.length == 0) {
                    return;
                }
                var growAnima = function() {
                    var fromObj = self._getPointPosStr(self._currPointList);
                    var toObj = self._getPointPosStr(self._pointList);

                    var bezierT = new Tween.Tween(fromObj)
                        .to(toObj, 1500)
                        .easing(Tween.Easing.Quintic.Out)
                        .onUpdate(function() {

                            for (var p in this) {
                                var ind = parseInt(p.split("_")[2]);
                                var xory = parseInt(p.split("_")[1]);
                                self._currPointList[ind] && (self._currPointList[ind][xory] = this[p]); //p_1_n中间的1代表x or y
                            };

                            self._bline.context.pointList = _.clone(self._currPointList);

                            self._fill.context.path = self._fillLine(self._bline);

                            self._circles && _.each(self._circles.children, function(circle, i) {
                                var ind = parseInt(circle.id.split("_")[1]);
                                circle.context.y = self._currPointList[ind][1];
                                circle.context.x = self._currPointList[ind][0];
                            });

                        }).onComplete(function() {
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
            _getPointPosStr: function(list) {
                var obj = {};
                _.each(list, function(p, i) {
                    obj["p_1_" + i] = p[1]; //p_y==p_1
                    obj["p_0_" + i] = p[0]; //p_x==p_0
                });
                return obj;
            },
            _isNotNum: function(val) {
                return isNaN(val) || val === null || val === ""
            },
            _filterEmptyValue: function(list) {

                //从左边开始 删除 value为非number的item
                for (var i = 0, l = list.length; i < l; i++) {
                    if (this._isNotNum(list[i].value)) {
                        list.shift();
                        l--;
                        i--;
                    } else {
                        break;
                    }
                };

                //从右边开始删除 value为非number的item
                for (var i = list.length - 1; i > 0; i--) {
                    if (this._isNotNum(list[i].value)) {
                        list.pop();
                    } else {
                        break;
                    }
                };
            },
            _getPointList: function(data) {
                var self = this;

                self.dataOrg = _.clone(data);
                self._filterEmptyValue(data);

                var list = [];
                for (var a = 0, al = data.length; a < al; a++) {
                    var o = data[a];
                    list.push([
                        o.x,
                        o.y
                    ]);
                };
                return list;
            },
            _widget: function() {
                var self = this;

                self._pointList = this._getPointList(self.data);

                if (self._pointList.length == 0) {
                    //filter后，data可能length==0
                    return;
                };

                var list = [];

                for (var a = 0, al = self.data.length; a < al; a++) {
                    var o = self.data[a];
                    var sourceInd = 0;
                    //如果是属于双轴中的右轴。
                    if (self._yAxis.place == "right") {
                        sourceInd = al - 1;
                    }
                    list.push([
                        o.x,
                        self.data[sourceInd].y
                    ]);
                };
                self._currPointList = list;

                var bline = new BrokenLine({ //线条
                    id: "brokenline_" + self._groupInd,
                    context: {
                        pointList: list,
                        strokeStyle: self._getLineStrokeStyle(),
                        lineWidth: self.line.lineWidth,
                        y: self.y,
                        smooth: self.line.smooth,
                        lineType: self._getProp(self.line.lineType),
                        //smooth为true的话，折线图需要对折线做一些纠正，不能超过底部
                        smoothFilter: function(rp) {
                            if (rp[1] > 0) {
                                rp[1] = 0;
                            }
                        }
                    }
                });
                if (!this.line.enabled) {
                    bline.context.visible = false
                }
                self.sprite.addChild(bline);
                self._bline = bline;


                var fill_gradient = null;
                if (_.isArray(self.fill.alpha)) {

                    //alpha如果是数据，那么就是渐变背景，那么就至少要有两个值
                    self.fill.alpha.length = 2;
                    if (self.fill.alpha[0] == undefined) {
                        self.fill.alpha[0] = 0;
                    };
                    if (self.fill.alpha[1] == undefined) {
                        self.fill.alpha[1] = 0;
                    };

                    //从bline中找到最高的点
                    var topP = _.min(bline.context.pointList, function(p) {
                        return p[1]
                    });
                    //创建一个线性渐变
                    fill_gradient = self.ctx.createLinearGradient(topP[0], topP[1], topP[0], 0);

                    var rgb = ColorFormat.colorRgb(self._getColor(self.fill.fillStyle));
                    var rgba0 = rgb.replace(')', ', ' + self._getProp(self.fill.alpha[0]) + ')').replace('RGB', 'RGBA');
                    fill_gradient.addColorStop(0, rgba0);

                    var rgba1 = rgb.replace(')', ', ' + self.fill.alpha[1] + ')').replace('RGB', 'RGBA');
                    fill_gradient.addColorStop(1, rgba1);
                }

                var fill = new Path({ //填充
                    context: {
                        path: self._fillLine(bline),
                        fillStyle: fill_gradient || self._getColor(self.fill.fillStyle),
                        globalAlpha: fill_gradient ? 1 : self.fill.alpha //self._getProp( self.fill.alpha )
                    }
                });
                self.sprite.addChild(fill);
                self._fill = fill;

                self._createNodes();

            },
            _createNodes: function() {
                var self = this;
                var list = self._currPointList;
                // var node =  new Canvax.Display.Sprite();
                // self.sprite.addChild(node)
                if ((self.node.enabled || list.length == 1) && !!self.line.lineWidth) { //拐角的圆点
                    this._circles = new Canvax.Display.Sprite({
                        id: "circles"
                    });
                    this.sprite.addChild(this._circles);
                    for (var a = 0, al = list.length; a < al; a++) {
                        self._nodeInd = a;
                        var strokeStyle = self._getProp(self.node.strokeStyle) || self._getLineStrokeStyle();
                        var context = {
                            x: self._currPointList[a][0],
                            y: self._currPointList[a][1],
                            r: self._getProp(self.node.r),
                            fillStyle: list.length == 1 ? strokeStyle : self._getProp(self.node.fillStyle) || "#ffffff",
                            strokeStyle: strokeStyle,
                            lineWidth: self._getProp(self.node.lineWidth) || 2
                        };

                        var sourceInd = 0;
                        if (self._yAxis.place == "right"){
                            sourceInd = al-1;
                        };

                        if( a == sourceInd ){
                            context.fillStyle = context.strokeStyle;
                            context.r ++;
                        }

                        var circle = new Circle({
                            id: "circle_" + a,
                            context: context
                        });

                        if (self.node.corner) { //拐角才有节点
                            var y = self._pointList[a][1];
                            var pre = self._pointList[a - 1];
                            var next = self._pointList[a + 1];
                            if (pre && next) {
                                if (y == pre[1] && y == next[1]) {
                                    circle.context.visible = false;
                                }
                            }
                        };
                        self._circles.addChild(circle);
                    }
                    self._nodeInd = -1
                }
            },
            _fillLine: function(bline) { //填充直线
                var fillPath = _.clone(bline.context.pointList);
                var baseY = 0;
                if (this.sort == "desc") {
                    baseY = -this.h;
                }
                fillPath.push(
                    [fillPath[fillPath.length - 1][0], baseY], [fillPath[0][0], baseY], [fillPath[0][0], fillPath[0][1]]
                );
                return Tools.getPath(fillPath);
            }
        };
        return Group;
    }
)