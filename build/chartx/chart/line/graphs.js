define(
    "chartx/chart/line/graphs", [
        "canvax/index",
        "canvax/shape/Rect",
        "chartx/utils/tools",
        "chartx/chart/line/group"
    ],
    function(Canvax, Rect, Tools, Group) {
        var Graphs = function(opt, root) {
            this.w = 0;
            this.h = 0;
            this.y = 0;

            //这里所有的opt都要透传给group
            this.opt = opt;
            this.root = root;
            this.ctx = root.stage.context2D;
            this.field = null;

            this._yAxisFieldsMap = {};
            this._setyAxisFieldsMap();

            this.data = []; //二维 [[{x:0,y:-100,...},{}],[]]
            this.disX = 0; //点与点之间的间距
            this.groups = []; //群组集合     

            this.iGroup = 0; //群组索引(哪条线)
            this.iNode = -1; //节点索引(那个点)

            this.sprite = null;
            this.induce = null;

            this.init(opt);
        };
        Graphs.prototype = {
            init: function(opt) {
                this.opt = opt;
                this.sprite = new Canvax.Display.Sprite();
            },
            setX: function($n) {
                this.sprite.context.x = $n
            },
            setY: function($n) {
                this.sprite.context.y = $n
            },
            getX: function() {
                return this.sprite.context.x
            },
            getY: function() {
                return this.sprite.context.y
            },

            draw: function(opt) {
                _.deepExtend(this, opt);
                this._widget(opt);
            },
            resetData: function(data, opt) {
                var self = this;
                self.data = data;
                opt && _.deepExtend(self, opt);
                for (var a = 0, al = self.data.length; a < al; a++) {
                    var group = self.groups[a];
                    group.resetData({
                        data: self.data[a]
                    });
                }
            },
            /**
             * 生长动画
             */
            grow: function(callback) {
                _.each(this.groups, function(g, i) {
                    g._grow(callback);
                });
            },
            _setyAxisFieldsMap : function(){
                var me = this;
                _.each( _.flatten( this._getYaxisField() ) , function( field , i ){
                     me._yAxisFieldsMap[ field ] = i;
                });
            },
            _getYaxisField: function(i) {
                //这里要兼容从折柱混合图过来的情况
                if( this.field ){
                    return this.field;
                }
                if (this.root.type && this.root.type.indexOf("line") >= 0) {
                    this.field = this.root._lineChart.dataFrame.yAxis.field;
                } else {
                    this.field = this.root.dataFrame.yAxis.field;
                };
                return this.field;
            },
            /*
             *@params opt
             *@params ind 最新添加的数据所在的索引位置
             **/
            add: function(opt, ind) {
                var self = this;
                _.deepExtend(this, opt);
                var group = new Group(
                    self._getYaxisField()[ind],
                    ind, //_groupInd
                    self.opt,
                    self.ctx
                );

                group.draw({
                    data: ind > self.data.length - 1 ? self.data[self.data.length - 1] : self.data[ind]
                });
                self.sprite.addChildAt(group.sprite, ind);
                self.groups.splice(ind, 0, group);

                _.each(this.groups, function(g, i) {
                    //_groupInd要重新计算
                    g._groupInd = i;
                    g.update({
                        data: self.data[i]
                    });
                });
            },
            /*
             *删除 ind
             **/
            remove: function(i) {
                var target = this.groups.splice(i, 1)[0];
                target.destroy();
            },
            /*
             * 更新下最新的状态
             **/
            update: function(opt) {
                _.deepExtend(this, opt);
                //剩下的要更新下位置
                var self = this;
                _.each(this.groups, function(g, i) {
                    g.update({
                        data: self.data[i]
                    });
                });
            },
            _setGroupsForYfield: function(fields, data, groupInd) {
                var self = this;
                for (var i = 0, l = fields.length; i < l; i++) {
                    var _sort = self.root._yAxis.sort;
                    var _biaxial = self.root.biaxial;
                    var _yAxis = self.root._yAxis;

                    var _groupInd = ((!groupInd && groupInd!==0) ? i : groupInd );

                    //只有biaxial的情况才会有双轴，才会有 下面isArray(fields[i])的情况发生
                    if (_.isArray(fields[i])) {
                        self._setGroupsForYfield(fields[i], data[i], i);
                    } else {
                        if (_.isArray(_sort)) {
                            _sort = (_sort[_groupInd] || "asc");
                        };
                        if (_biaxial) {
                            if (_groupInd > 0) {
                                _yAxis = self.root._yAxisR
                            };
                        };
                        var group = new Group(
                            fields[i],
                            self._yAxisFieldsMap[fields[i]],
                            self.opt,
                            self.ctx,
                            _sort,
                            _yAxis,
                            self.h,
                            self.w
                        );
                        group.draw({
                            data: data[i]
                        });
                        self.sprite.addChild(group.sprite);
                        self.groups.push(group);
                    }
                }
            },
            _widget: function(opt) {
                var self = this;
                self._setGroupsForYfield( self._getYaxisField() , self.data);
                self.induce = new Rect({
                    id: "induce",
                    context: {
                        y: -self.h,
                        width: self.w,
                        height: self.h,
                        fillStyle: '#000000',
                        globalAlpha: 0,
                        cursor: 'pointer'
                    }
                });

                self.sprite.addChild(self.induce);

                self.induce.on("panstart mouseover", function(e) {
                    e.eventInfo = self._getInfoHandler(e);
                })
                self.induce.on("panmove mousemove", function(e) {
                    e.eventInfo = self._getInfoHandler(e);
                })
                self.induce.on("panend mouseout", function(e) {
                    e.eventInfo = self._getInfoHandler(e);
                    self.iGroup = 0, self.iNode = -1
                })
                self.induce.on("tap click", function(e) {
                    e.eventInfo = self._getInfoHandler(e);
                })
            },
            _getInfoHandler: function(e) {
                var x = e.point.x,
                    y = e.point.y - this.h;
                //todo:底层加判断
                x = x > this.w ? this.w : x;

                var tmpINode = this.disX == 0 ? 0 : parseInt((x + (this.disX / 2)) / this.disX);

                var _nodesInfoList = []; //节点信息集合

                for (var a = 0, al = this.groups.length; a < al; a++) {
                    var o = this.groups[a].getNodeInfoAt(tmpINode);
                    o && _nodesInfoList.push(o);
                };

                var tmpIGroup = Tools.getDisMinATArr(y, _.pluck(_nodesInfoList, "y"));

                this.iGroup = tmpIGroup, this.iNode = tmpINode;
                //iGroup 第几条线   iNode 第几个点   都从0开始
                var node = {
                    iGroup: this.iGroup,
                    iNode: this.iNode,
                    nodesInfoList: _.clone(_nodesInfoList)
                };
                return node;
            }
        };
        return Graphs;
    }
)