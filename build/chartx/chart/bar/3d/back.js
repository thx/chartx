define('chartx/chart/bar/3d/back',
    [
        "canvax/index",
        "canvax/shape/Line",
        "chartx/utils/tools",
        "canvax/shape/Shapes",
        "chartx/utils/colorformat"
    ],
    function (Canvax, Line, Tools, Shapes, ColorFormat) {
        var Back = function (root) {

            var opt = root.back;
            this.root = root;
            this.w = 0;
            this.h = 0;
            this._depth = -100;

            this.pos = {
                x: 0,
                y: 0
            }

            this.enabled = 1;

            this.xOrigin = {                                //原点开始的x轴线
                enabled: 1,
                lineWidth: 1,
                strokeStyle: '#eee'
            }
            _.extend(this.yOrigin = {}, this.xOrigin, { //原点开始的y轴线
                biaxial: false
            });
            this.xAxis = {                                //x轴上的线
                enabled: 1,
                data: [],                      //[{y:100},{}]
                org: null,                    //x轴坐标原点，默认为上面的data[0]
                // data     : [{y:0},{y:-100},{y:-200},{y:-300},{y:-400},{y:-500},{y:-600},{y:-700}],
                lineType: 'solid',                //线条类型(dashed = 虚线 | '' = 实线)
                lineWidth: 1,
                strokeStyle: '#f5f5f5', //'#e5e5e5',
                filter: null
            };

            _.extend(this.yAxis = {}, this.xAxis);   //y轴上的线



            this.sprite = null;                       //总的sprite
            this.xAxisSp = null;                       //x轴上的线集合
            this.yAxisSp = null;                       //y轴上的线集合

            this.resize = false;
            this.isFillBackColor = 1;

            this.init(opt);
        };

        Back.prototype = {

            init: function (opt) {
                _.deepExtend(this, opt);
                if (opt && opt.depth) {
                    this._depth = -opt.depth;
                }
                this.sprite = new Canvax.Display.Sprite();
            },
            setX: function ($n) {
                this.sprite.context.x = $n
            },
            setY: function ($n) {
                this.sprite.context.y = $n
            },

            draw: function (opt) {
                _.deepExtend(this, opt);
                //this._configData(opt);
                this._widget();
                this.setX(this.pos.x);
                this.setY(this.pos.y);
            },
            update: function (opt) {
                this.sprite.removeAllChildren();
                this.draw(opt);
            },
            _drawLine: function (_id, _sprite, _context, _style) {
                var _line = _sprite.getChildById(_id) ||
                    new Line({
                        id: _id,
                        context: {
                            lineType: _style.lineType,
                            lineWidth: _style.lineWidth,
                            strokeStyle: _style.strokeStyle
                        }
                    });

                _.extend(_line.context, _context);

                //todo:line的context不能保留额外的值
                _line.zStart = _context.zStart;
                _line.zEnd = _context.zEnd;
                return _line;
            },
            drawBackground: function (_id, line1, line2, _globalAlpha, _sprite) {
                var me = this;
                var _fillStyle = '#000';

                var lc = line1.context;
                var lc2 = line2.context;
                var _pointList = [[lc.xStart, lc.yStart, line1.zStart], [lc.xEnd, lc.yEnd, line1.zEnd], [lc2.xEnd, lc2.yEnd, line2.zEnd], [lc2.xStart, lc2.yStart, line2.zStart]];

                var BackgroundRect = me.root.drawFace(_id, _pointList, _fillStyle, _fillStyle, _globalAlpha, _sprite);

                me.sprite.addChild(BackgroundRect);
            },
            _widget: function () {
                var self = this;
                var _depth = this._depth;
                if (!this.enabled) {
                    return
                }
                //Y轴显示不等比例数据时,通过添加背景色划分区域
                if( self.root && self.root._yAxis && self.root._yAxis.dataSectionGroup ){
                    self.yGroupSp  = new Canvax.Display.Sprite(),  self.sprite.addChild(self.yGroupSp);
                    for( var g = 0 , gl=self.root._yAxis.dataSectionGroup.length ; g < gl ; g++ ){
                        var yGroupHeight = self.root._yAxis.yGraphsHeight / gl ;

                        var _id="Back_section_"+g;
                        var _left = 0;
                        var _right = _left + self.w;
                        var _top = -yGroupHeight * g;
                        var _bottom = _top  -yGroupHeight;
                        var _pointList=[[_left,_top,0],[_left,_top,_depth],[_right,_top,_depth],[_right,_bottom,_depth],[_left,_bottom,_depth],[_left,_bottom,0]];
                        var groupRect = self.root.drawFace(_id, _pointList, "#000", "#000", 0.04 * (g % 2), self.yGroupSp);

                        self.yGroupSp.addChild(groupRect);
                    }
                }


                self.xAxisSp = self.sprite.getChildById('Back_xAsix') ||
                    new Canvax.Display.Sprite({
                        id: 'Back_xAsix'
                    }),
                    self.sprite.addChild(self.xAxisSp);
                self.yAxisSp = self.sprite.getChildById('Back_yAsix') ||
                    new Canvax.Display.Sprite({
                        id: 'Back_yAsix'
                    }),
                    self.sprite.addChild(self.yAxisSp);

                //x轴方向的线集合
                var arr = self.xAxis.data;
                if (self.xAxis.enabled) {
                    for (var a = 0, al = arr.length; a < al; a++) {
                        var o = arr[a];

                        var _id = "back_line_xAxis_" + a;
                        var _context = {
                            xStart: 0,
                            yStart: o.y,
                            xEnd: self.w,
                            yEnd: o.y,
                            zStart: _depth,
                            zEnd: _depth
                        };

                        var line = self._drawLine(_id, self.xAxisSp, _context, self.xAxis);


                        _.isFunction(self.xAxis.filter) && self.xAxis.filter({
                            layoutData: self.yAxis.data,
                            index: a,
                            line: line
                        });
                        self.xAxisSp.addChild(line);


                        //绘制Z轴的线条

                        var _id = "back_line_xAxis_z_" + a;
                        var _context = {
                            xStart: 0,
                            yStart: o.y,
                            xEnd: 0,
                            yEnd: o.y,
                            zStart: 0,
                            zEnd: _depth
                        };

                        var line = self._drawLine(_id, self.xAxisSp, _context, self.xAxis);
                        self.xAxisSp.addChild(line);

                    }

                    //原点开始的x轴线
                    if (self.xOrigin.enabled) {

                        var yAxisOrg = (self.xAxis.org == null ? 0 : _.find(self.xAxis.data, function (obj) {
                            return obj.content == self.xAxis.org
                        }).y );


                        var _id = "Back_xAxisOrg";
                        var _context = {
                            xStart: yAxisOrg,
                            yStart: 0,
                            xEnd: self.w,
                            yEnd: yAxisOrg,
                            zStart: 0,
                            zEnd: 0
                        };

                        var line = self._drawLine(_id, self.xAxisSp, _context, self.xOrigin);
                        self.xAxisSp.addChild(line);
                    }

                    //X轴背景
                    if (self.isFillBackColor) {
                        var _id = 'Back_xBackground';
                        var line1 = self.xAxisSp.getChildById('Back_xAxisOrg');
                        var line2 = self.xAxisSp.getChildById('back_line_xAxis_0');
                        var _globalAlpha = 0.04;
                        self.drawBackground(_id, line1, line2, _globalAlpha, self.sprite);

                    }
                }

                //y轴方向的线集合
                var arr = self.yAxis.data;
                if (self.yAxis.enabled) {
                    arr.unshift({x: 0.5}); //增加最左侧线条
                    arr.push({x: self.w}); //增加最右侧线条
                    for (var a = 0, al = arr.length; a < al; a++) {
                        var o = arr[a];

                        var _id = "back_line_yAxis_" + a;
                        var _context = {
                            xStart: o.x,
                            yStart: 0,
                            xEnd: o.x,
                            yEnd: -self.h,
                            zStart: _depth,
                            zEnd: _depth
                        };

                        var line = self._drawLine(_id, self.yAxisSp, _context, self.yAxis);
                        line.context.visible = o.x ? true : false;

                        _.isFunction(self.yAxis.filter) && self.yAxis.filter({
                            layoutData: self.xAxis.data,
                            index: a,
                            line: line
                        });
                        self.yAxisSp.addChild(line);


                        var _id = "back_line_yAxis_z_" + a;
                        var _context = {
                            xStart: o.x,
                            yStart: 0,
                            xEnd: o.x,
                            yEnd: 0,
                            zStart: 0,
                            zEnd: _depth
                        };

                        var line = self._drawLine(_id, self.yAxisSp, _context, self.yAxis);
                        line.context.visible = o.x ? true : false;


                        self.yAxisSp.addChild(line);
                    }

                    //原点开始的y轴线
                    if (self.yOrigin.enabled) {
                        var yAxisOrg = (self.yAxis.org == null ? 0 : _.find(self.yAxis.data, function (obj) {
                            return obj.content == self.yAxis.org
                        }).x );
                        var _id = "Back_yAxisOrg";
                        var _context = {
                            xStart: yAxisOrg,
                            yStart: 0,
                            xEnd: yAxisOrg,
                            yEnd: -self.h,
                            zStart: 0,
                            zEnd: 0
                        };

                        var line = self._drawLine(_id, self.yAxisSp, _context, self.yOrigin);
                        self.yAxisSp.addChild(line);
                    }
                    //Y轴背景
                    if (self.isFillBackColor) {
                        var _id = 'Back_yBackground';
                        var line1 = self.yAxisSp.getChildById('Back_yAxisOrg');
                        var line2 = self.yAxisSp.getChildById('back_line_yAxis_0');
                        var _globalAlpha = 0.1;
                        self.drawBackground(_id, line1, line2, _globalAlpha, self.sprite);
                    }

                }

                if (self.yOrigin.biaxial) {
                    //todo 暂不支持Y轴第二坐标
                }

                //back背景
                if (self.isFillBackColor) {
                    var _id = 'Back_Background';
                    var _num = self.xAxis.data.length - 1;
                    var line1 = self.xAxisSp.getChildById('back_line_xAxis_' + _num);
                    var line2 = self.xAxisSp.getChildById('back_line_xAxis_0');
                    var _globalAlpha = 0.02;
                    self.drawBackground(_id, line1, line2, _globalAlpha, self.sprite);

                }

            }

        }

        return Back;
    });