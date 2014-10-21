KISSY.add('dvix/components/pie/Pie', function (S, Canvax, Sector, Line, Rect, Tools, Tween) {
    var Pie = function (opt, data) {
        this.data = data;
        this.sprite = null;
        this.branchSp = null;
        this.branchTxtSp = null;
        this.init(opt);
        this.colorIndex = 0;
        this.sectors = [];
        this.isMoving = false;
    };
    Pie.prototype = {
        init: function (opt) {
            _.deepExtend(this, opt);
            this.sprite = new Canvax.Display.Sprite();
            this.branchSp = new Canvax.Display.Sprite();
            this.branchTxtSp = new Canvax.Display.Sprite();
            this._configData();
            this._configColors();
        },
        setX: function ($n) {
            this.sprite.context.x = $n;
        },
        setY: function ($n) {
            this.sprite.context.y = $n;
        },
        //配置数据
        _configData: function () {
            var self = this;
            self.total = 0;
            self.currentAngle = 0;
            var data = self.data.data;
            var clickMoveDis = 20;
            if (data.length && data.length > 0) {
                if (data.length == 1) {
                    S.mix(data[0], {
                        start: 0,
                        end: 360,
                        percentage: 100,
                        txt: 100 + '%',
                        isMax: true
                    });
                } else {
                    for (var i = 0; i < data.length; i++) {
                        self.total += data[i].y;
                    }
                    if (self.total > 0) {
                        var maxIndex = 0;
                        for (var j = 0; j < data.length; j++) {
                            if (j > 0 && percentage * 100 > data[maxIndex].percentage) {
                                maxIndex = j;
                            }
                            var percentage = data[j].y / self.total;
                            var angle = 360 * percentage;
                            var endAngle = self.currentAngle + angle;
                            var cosV = Math.cos((self.currentAngle + angle / 2) / 180 * Math.PI);
                            var sinV = Math.sin((self.currentAngle + angle / 2) / 180 * Math.PI);
                            var midAngle = self.currentAngle + (endAngle - self.currentAngle) / 2;
<<<<<<< HEAD
                            
                            var quadrant = function (ang) {
                                if (0 <= ang && ang <= 90) {
                                    return 1;
                                } else if (90 < ang && ang <= 180) {
                                    return 2;
                                } else if (180 < ang && ang <= 270) {
                                    return 3;
                                } else if (270 < ang && ang < 360) {
                                    return 4;
                                }
                            }(midAngle);
=======
                            debugger;
                            var quadrant = function (ang) {
                                    if (0 <= ang && ang <= 90) {
                                        return 1;
                                    } else if (90 < ang && ang <= 180) {
                                        return 2;
                                    } else if (180 < ang && ang <= 270) {
                                        return 3;
                                    } else if (270 < ang && ang < 360) {
                                        return 4;
                                    }
                                }(midAngle);
>>>>>>> origin/add-pie-chart
                            S.mix(data[j], {
                                start: self.currentAngle,
                                end: endAngle,
                                outx: clickMoveDis * cosV,
                                outy: clickMoveDis * sinV,
                                centerx: (self.pie.r - 25) * cosV,
                                centery: (self.pie.r - 25) * sinV,
                                edgex: (self.pie.r + 30) * cosV,
                                edgey: (self.pie.r + 30) * sinV,
                                percentage: (percentage * 100).toFixed(1),
                                txt: (percentage * 100).toFixed(1) + '%',
                                quadrant: quadrant,
                                index: j,
                                isMax: false
                            });
                            self.currentAngle += angle;
                        }
                        data[maxIndex].isMax = true;
                    }
                }
            }
        },
        getColorByIndex: function (colors, index) {
            if (index >= colors.length) {
                index = index % colors.length;
            }
            return colors[index];
        },
        _configColors: function () {
            var defaultColors = [
<<<<<<< HEAD
                '#95CEFF',
                '#434348',
                '#90ED7D',
                '#F7A35C',
                '#8085E9',
                '#F15C80',
                '#E4D354',
                '#8085E8',
                '#8D4653',
                '#91E8E1'
            ];
=======
                    '#95CEFF',
                    '#434348',
                    '#90ED7D',
                    '#F7A35C',
                    '#8085E9',
                    '#F15C80',
                    '#E4D354',
                    '#8085E8',
                    '#8D4653',
                    '#91E8E1'
                ];
>>>>>>> origin/add-pie-chart
            this.colors = this.colors ? this.colors : defaultColors;
        },
        draw: function (opt) {
            this.setX(this.pie.x);
            this.setY(this.pie.y);
            this._widget();    //this.sprite.context.globalAlpha = 0;
            //this.sprite.context.globalAlpha = 0;
<<<<<<< HEAD
            
=======
            debugger;
>>>>>>> origin/add-pie-chart
            S.each(this.sectors, function (sec, index) {
                sec.context.r = 0;
                sec.context.startAngle = 0;
                sec.context.endAngle = 0;
            });
        },
        grow: function () {
            var self = this;
            var timer = null;
            var growAnima = function () {
                var pieOpen = new Tween.Tween({
<<<<<<< HEAD
                    alpha: 0,
                    r: 0
                }).to({
                    alpha: 1,
                    r: self.pie.r
                }, 800).onUpdate(function () {
                    var me = this;
                    self.sprite.context.globalAlpha = this.alpha;
                    for (var i = 0; i < self.sectors.length; i++) {
                        self.sectors[i].context.r = me.r;
                        if (i == 0) {
                            self.sectors[i].context.startAngle = self.sectors[i].startAngle;
                            self.sectors[i].context.endAngle = self.sectors[i].endAngle * me.alpha;
                        } else {
                            self.sectors[i].context.startAngle = self.sectors[i - 1].context.endAngle;
                            self.sectors[i].context.endAngle = self.sectors[i].context.startAngle + (self.sectors[i].endAngle - self.sectors[i].startAngle) * me.alpha;
                        }
                    }
                }).onComplete(function () {
                    cancelAnimationFrame(timer);
                    self.isMoving = false;
                }).start();
=======
                        alpha: 0,
                        r: 0
                    }).to({
                        alpha: 1,
                        r: self.pie.r
                    }, 800).onUpdate(function () {
                        var me = this;
                        self.sprite.context.globalAlpha = this.alpha;
                        for (var i = 0; i < self.sectors.length; i++) {
                            self.sectors[i].context.r = me.r;
                            if (i == 0) {
                                self.sectors[i].context.startAngle = self.sectors[i].startAngle;
                                self.sectors[i].context.endAngle = self.sectors[i].endAngle * me.alpha;
                            } else {
                                self.sectors[i].context.startAngle = self.sectors[i - 1].context.endAngle;
                                self.sectors[i].context.endAngle = self.sectors[i].context.startAngle + (self.sectors[i].endAngle - self.sectors[i].startAngle) * me.alpha;
                            }
                        }
                    }).onComplete(function () {
                        cancelAnimationFrame(timer);
                        self.isMoving = false;
                    }).start();
>>>>>>> origin/add-pie-chart
                animate();
            };
            function animate() {
                timer = requestAnimationFrame(animate);
                Tween.update();
            }
            ;
            self.isMoving = true;
            growAnima();
        },
        _showTip: function () {
            var self = this;
            if (self.pie && self.pie.tipCallback) {
                self.pie.tipCallback.isshow(true);
            }
        },
        _hideTip: function () {
            var self = this;
            if (self.pie && self.pie.tipCallback) {
                self.pie.tipCallback.isshow(false);
            }
        },
        _moveTip: function (pos) {
            var self = this;
            if (self.pie && self.pie.tipCallback) {
                self.pie.tipCallback.position(pos);
            }
        },
        _redrawTip: function (opt) {
            var self = this;
            if (self.pie && self.pie.tipCallback) {
                self.pie.tipCallback.update(opt);
            }
        },
        _widget: function () {
            var self = this;
            var data = self.data.data;
            if (data.length > 0 && self.total > 0) {
                self.sprite.addChild(self.branchSp);
                self.sprite.addChild(self.branchTxtSp);
                for (var i = 0; i < data.length; i++) {
                    if (self.colorIndex >= self.colors.length)
                        self.colorIndex = 0;
                    var fillColor = self.getColorByIndex(self.colors, i);    //指示线
                    //指示线
                    var branchLine = new Line({
<<<<<<< HEAD
                        context: {
                            xStart: data[i].centerx,
                            yStart: data[i].centery,
                            xEnd: data[i].edgex,
                            yEnd: data[i].edgey,
                            lineWidth: 1,
                            strokeStyle: fillColor,
                            lineType: 'solid'
                        }
                    });    //指示文字
                    //指示文字
                    var branchTxt = new Canvax.Display.Text(data[i].name + ' : ' + data[i].txt, {
                        context: {
                            x: data[i].edgex,
                            y: data[i].edgey,
                            //fillStyle: fillColor,
                            //strokeStyle: fillColor,              
                            fontSize: 11,
                            fontWeight: 'normal'
                        }
                    });                    
=======
                            context: {
                                xStart: data[i].centerx,
                                yStart: data[i].centery,
                                xEnd: data[i].edgex,
                                yEnd: data[i].edgey,
                                lineWidth: 1,
                                strokeStyle: fillColor,
                                lineType: 'solid'
                            }
                        });    //指示文字
                    //指示文字
                    var branchTxt = new Canvax.Display.Text(data[i].name + ' : ' + data[i].txt, {
                            context: {
                                x: data[i].edgex,
                                y: data[i].edgey,
                                //fillStyle: fillColor,
                                //strokeStyle: fillColor,              
                                fontSize: 11,
                                fontWeight: 'normal'
                            }
                        });
                    if (i == 1)
                        debugger;
>>>>>>> origin/add-pie-chart
                    var bwidth = branchTxt.getTextWidth();
                    var bheight = branchTxt.getTextHeight();
                    var bx = data[i].edgex;
                    var by = data[i].edgey;
                    var txtOffsetX = 10;
                    switch (data[i].quadrant) {
                    case 1:
                        bx += txtOffsetX;
                        by -= bheight / 2;
                        break;
                    case 2:
                        bx -= bwidth + txtOffsetX;
                        by -= bheight / 2;
                        break;
                    case 3:
                        bx -= bwidth + txtOffsetX;
                        by -= bheight / 2;
                        break;
                    case 4:
                        bx += txtOffsetX;
                        by -= bheight / 2;
                        break;
                    }
                    branchTxt.context.x = bx;
                    branchTxt.context.y = by;
                    self.branchSp.addChild(branchLine);
                    self.branchTxtSp.addChild(branchTxt);    //扇形主体
                    //扇形主体
                    var sector = new Sector({
<<<<<<< HEAD
                        context: {
                            //x: data[i].isMax ? 0 : data[i].outx,
                            //y: data[i].isMax ? 0 : data[i].outy,
                            //x: i == 1 ? data[i].outx : 0,
                            //y: i == 1 ? data[i].outy :0,
                            //shadowColor: "black",
                            //shadowOffsetX: 0,
                            //shadowOffsetY: 0,
                            //shadowBlur: 5,
                            r0: 20,
                            r: self.pie.r,
                            startAngle: data[i].start,
                            endAngle: data[i].end,
                            fillStyle: fillColor,
                            index: data[i].index,
                            lineWidth: 2,
                            strokeStyle: '#fff'    //clockwise: true
                        },
                        //clockwise: true
                        id: 'sector' + i
                    });
=======
                            context: {
                                //x: data[i].isMax ? 0 : data[i].outx,
                                //y: data[i].isMax ? 0 : data[i].outy,
                                //x: i == 1 ? data[i].outx : 0,
                                //y: i == 1 ? data[i].outy :0,
                                //shadowColor: "black",
                                //shadowOffsetX: 0,
                                //shadowOffsetY: 0,
                                //shadowBlur: 5,
                                r0: 20,
                                r: self.pie.r,
                                startAngle: data[i].start,
                                endAngle: data[i].end,
                                fillStyle: fillColor,
                                index: data[i].index,
                                lineWidth: 2,
                                strokeStyle: '#fff'    //clockwise: true
                            },
                            //clockwise: true
                            id: 'sector' + i
                        });
>>>>>>> origin/add-pie-chart
                    sector.__data = data[i];
                    sector.__colorIndex = i;
                    sector.__dataIndex = i;
                    sector.__isSelected = false;    //扇形事件
                    //扇形事件
                    sector.hover(function (e) {
<<<<<<< HEAD
                        if (!self.isMoving) {                            
=======
                        if (!self.isMoving) {
                            debugger;
>>>>>>> origin/add-pie-chart
                            //this.context.shadowBlur = 20;
                            var target = e.target;
                            var globalPoint = target.localToGlobal(e.point);
                            console.log(globalPoint.x, globalPoint.y);
                            self._redrawTip(this);
                            self._moveTip(globalPoint);
                            self._showTip();
                        }
                    }, function () {
                        if (!self.isMoving) {
                            //this.context.shadowBlur = 5;
                            self._hideTip();
                        }    //if (!self.isMoving) this.context.strokeStyle = self.getColorByIndex(self.colors, this.__colorIndex);
                    });
                    //if (!self.isMoving) this.context.strokeStyle = self.getColorByIndex(self.colors, this.__colorIndex);
                    sector.on('mousemove', function (e) {
                        var target = e.target;
                        var globalPoint = target.localToGlobal(e.point);
                        console.log(globalPoint.x, globalPoint.y);
                        self._moveTip(globalPoint);
                    });
                    sector.on('click', function () {
                        if (!this.__isSelected) {
                            this.context.x += data[this.__dataIndex].outx;
                            this.context.y += data[this.__dataIndex].outy;
                            this.__isSelected = true;
                        } else {
                            this.context.x -= data[this.__dataIndex].outx;
                            this.context.y -= data[this.__dataIndex].outy;
                            this.__isSelected = false;
                        }
                    });
                    self.sprite.addChild(sector);
                    self.sectors.push({
                        sector: sector,
                        context: sector.context,
                        r: self.pie.r,
                        startAngle: sector.context.startAngle,
                        endAngle: sector.context.endAngle,
                        color: fillColor
                    });
                }
            }
        }
    };
    return Pie;
}, {
    requires: [
        'canvax/',
        'canvax/shape/Sector',
        'canvax/shape/Line',
        'canvax/shape/Rect',
        'dvix/utils/tools',
        'canvax/animation/Tween',
        'dvix/utils/deep-extend'
    ]
});