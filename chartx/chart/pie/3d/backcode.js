/**
 * Created by bujue on 2017/3/7.
 */
var ttt= {
    checkAt: function (index) {
        if (this._pie) {
            this._pie.check(index);
        }
    },
    uncheckAt: function (index) {
        if (this._pie) {
            this._pie.uncheck(index);
        }
    },
    focusAt: function (index) {
        if (this._pie) {
            this._pie.focus(index);
        }
    },
    unfocusAt: function (index) {
        if (this._pie) {
            this._pie.unfocus(index);
        }
    },

    uncheckAll: function () {
        if (this._pie) {
            this._pie.uncheckAll();
        }
    },
    checkOf: function (xvalue) {
        this.checkAt(this._getIndexOfxName(xvalue));
    },
    uncheckOf: function (xvalue) {
        this.uncheckAt(this._getIndexOfxName(xvalue));
    },
    _getIndexOfxName: function (xvalue) {
        var i;
        var list = this.getList();
        for (var ii = 0, il = list.length; ii < il; ii++) {
            if (list[ii].name == xvalue) {
                i = ii;
                break;
            }
        }
        return i;
    },

//设置图例 begin
    _setLengend: function () {
        var me = this;
        if (!this.legend || (this.legend && "enabled" in this.legend && !this.legend.enabled)) return;
        //设置legendOpt
        var legendOpt = _.deepExtend({
            legend: true,
            label: function (info) {
                return info.field
            },
            onChecked: function (field) {
                me.add(field);
            },
            onUnChecked: function (field) {
                me.remove(field);
            },
            layoutType: "v"
        }, this._opts.legend);
        this._legend = new Legend(this._getLegendData(), legendOpt);
        this.stage.addChild(this._legend.sprite);
        this._legend.pos({
            x: this.width - this._legend.width,
            y: this.height / 2 - this._legend.h / 2
        });

        this.padding.right += this._legend.width;
    },
    _getLegendData: function () {
        var me = this;
        var data = [];
        _.each(this.dataFrame.data, function (obj, i) {
            data.push({
                field: obj.name,
                value: obj.y,
                fillStyle: null
            });
        });

        return data;
    }
////设置图例end


    getByIndex: function (index) {
        return this._pie._getByIndex(index);
    },
    getLabelList: function () {
        return this._pie.getLabelList();
    },
    getList: function () {
        var self = this;
        var list = [];
        var item;
        if (self._pie) {
            var sectorList = self._pie.getList();
            if (sectorList.length > 0) {
                for (var i = 0; i < sectorList.length; i++) {
                    item = sectorList[i];
                    var idata = self._pie.data.data[i];

                    list.push({
                        name: item.name,
                        index: item.index,
                        color: item.color,
                        r: item.r,
                        value: item.value,
                        percentage: item.percentage,
                        checked: idata.checked
                    });
                }
            }
        }
        ;
        return list;
    },
    getCheckedList: function () {
        var cl = [];
        _.each(this.getList(), function (item) {
            if (item.checked) {
                cl.push(item);
            }
        });
        return cl;
    },

    remove: function (field) {
        var me = this;
        var data = me.data;
        if (field && data.length > 1) {
            for (var i = 1; i < data.length; i++) {
                if (data[i][0] == field && !_.contains(me.ignoreFields, field)) {
                    me.ignoreFields.push(field);
                    console.log(me.ignoreFields.toString());
                }
            }
        }
        me.reset();
    },
    add: function (field) {
        var me = this;
        var data = me.data;
        if (field && data.length > 1) {
            for (var i = 1; i < data.length; i++) {
                if (data[i][0] == field && _.contains(me.ignoreFields, field)) {
                    me.ignoreFields.splice(_.indexOf(me.ignoreFields, field), 1);
                }
            }
        }
        me.reset();
    },

    clear: function () {
        this.stageBg.removeAllChildren()
        this.core.removeAllChildren()
        this.stageTip.removeAllChildren();
    },
    reset: function (obj) {
        obj = obj || {};
        this.clear();
        this._pie.clear();
        var data = obj.data || this.data;
        _.deepExtend(this, obj.options);
        this.dataFrame = this._initData(data, this.options);
        this.draw();
    },
}
////////////////////////////////////////////////////////

var PI = Math.PI,
    deg2rad = (PI / 180), // degrees to radians
    sin = Math.sin,
    cos = Math.cos,
    round = Math.round;

/***
 EXTENSION TO THE SVG-RENDERER TO ENABLE 3D SHAPES
 ***/
////// HELPER METHODS //////

var dFactor = (4 * (Math.sqrt(2) - 1) / 3) / (PI / 2);

/** Method to construct a curved path
 * Can 'wrap' around more then 180 degrees
 */

/** Method to construct a curved path
 * Can 'wrap' around more then 180 degrees
 */
function curveTo(cx, cy, rx, ry, start, end, dx, dy) {
    var result = [];
    if ((end > start) && (end - start > PI / 2 + 0.0001)) {
        result = result.concat(curveTo(cx, cy, rx, ry, start, start + (PI / 2), dx, dy));
        result = result.concat(curveTo(cx, cy, rx, ry, start + (PI / 2), end, dx, dy));
    } else if ((end < start) && (start - end > PI / 2 + 0.0001)) {
        result = result.concat(curveTo(cx, cy, rx, ry, start, start - (PI / 2), dx, dy));
        result = result.concat(curveTo(cx, cy, rx, ry, start - (PI / 2), end, dx, dy));
    } else {
        var arcAngle = end - start;
        result = [
            'C',
            cx + (rx * cos(start)) - ((rx * dFactor * arcAngle) * sin(start)) + dx,
            cy + (ry * sin(start)) + ((ry * dFactor * arcAngle) * cos(start)) + dy,
            cx + (rx * cos(end)) + ((rx * dFactor * arcAngle) * sin(end)) + dx,
            cy + (ry * sin(end)) - ((ry * dFactor * arcAngle) * cos(end)) + dy,

            cx + (rx * cos(end)) + dx,
            cy + (ry * sin(end)) + dy
        ];
    }
    return result;
}

var _attrs = ['side1', 'side2', 'inn', 'out', 'top'];

var pie={
    _widget: function () {
        var self = this;
        var data = self.data.data;
        var moreSecData;

        _.each(_attrs, function (item) {
            self['sectorsSp3d_' + item] = self.sectorsSp.getChildById('sector_sp_' + item) || new Canvax.Display.Sprite({
                    id: 'sector_sp_' + item
                });

        });


        if (data.length > 0 && self.total > 0) {
            self.branchSp && self.sprite.addChild(self.branchSp);
            for (var i = 0; i < data.length; i++) {
                if (self.colorIndex >= self.colors.length) self.colorIndex = 0;
                var fillColor = self.getColorByIndex(self.colors, i);
                var _sideFillStyle = ColorFormat.colorBrightness(fillColor, -0.2);

                //扇形主体

                var sectorsSp3d = self.sectorsSp.getChildById('sector_sp_' + i) || new Canvax.Display.Sprite({
                        id: 'sector_sp_' + i,
                        context: {
                            x: data[i].sliced ? data[i].outOffsetx : 0,
                            y: data[i].sliced ? data[i].outOffsety : 0
                        }
                    });


                var _SVGPaths = self.setPaths({
                    alpha: deg2rad * 45,  //0.7853981633974483,
                    beta: 0,
                    depth: 26.25,
                    end: deg2rad * (data[i].end + 360) - 0.0001,
                    innerR: self.r0,
                    r: self.r,
                    start: deg2rad * (data[i].start + 360) + 0.0001,
                    x: 0,
                    y: 0
                });

                _.each(_attrs, function (item) {

                    var _pathObj = new Path({
                        id: "path_" + item + '_' + data[i].index,
                        context: {
                            x: data[i].sliced ? data[i].outOffsetx : 0,
                            y: data[i].sliced ? data[i].outOffsety : 0,
                            path: _SVGPaths[item],
                            fillStyle: item === 'top' ? fillColor : _sideFillStyle,
                            index: data[i].index,
                            cursor: "pointer"
                        }
                    });
                    sectorsSp3d.addChild(_pathObj);

                    var _cloneTopPath = _pathObj.clone();
                    _cloneTopPath.id = 'sp_' + item + '_clone_' + data[i].index;
                    self['sectorsSp3d_' + item].addChild(_cloneTopPath);

                    if (item === 'top') {
                        _cloneTopPath.__data = data[i];
                        _cloneTopPath.__colorIndex = i;
                        _cloneTopPath.__dataIndex = i;
                        _cloneTopPath.__isSliced = data[i].sliced;

                        //扇形事件
                        _cloneTopPath.hover(function (e) {
                            var me = this;
                            if (self.tips.enabled) {
                                self._showTip(e, this.__dataIndex);
                            }
                            var secData = self.data.data[this.__dataIndex];
                            if (!secData.checked) {
                                self._sectorFocus(e, this.__dataIndex);
                                self.focus(this.__dataIndex);
                            }
                        }, function (e) {
                            if (self.tips.enabled) {
                                self._hideTip(e);
                            }
                            var secData = self.data.data[this.__dataIndex];
                            if (!secData.checked) {
                                self._sectorUnfocus(e, this.__dataIndex);
                                self.unfocus(this.__dataIndex);
                            }
                        });

                        _cloneTopPath.on('mousedown mouseup click mousemove dblclick', function (e) {
                            self._geteventInfo(e, this.__dataIndex);
                            if (e.type == "click") {
                                self.secClick(this, e);
                            }
                            ;
                            if (e.type == "mousemove") {
                                if (self.tips.enabled) {
                                    self._moveTip(e, this.__dataIndex);
                                }
                            }
                            ;
                        });


                    }

                });
                if (!data[i].ignored) {
                    self.sectorsSp.addChild(sectorsSp3d);
                }else{
                    //移除忽略的区域
                    _.each(_attrs, function (item) {
                        self['sectorsSp3d_' + item].removeChildById('sp_' + item + '_clone_' + data[i].index);
                    });
                }


                moreSecData = {
                    name: data[i].name,
                    value: data[i].y,
                    sector: sectorsSp3d,
                    r: self.r,
                    startAngle: data[i].start,
                    endAngle: data[i].end,
                    color: fillColor,
                    index: i,
                    percentage: data[i].percentage,
                    visible: true
                };

                self.sectors.push(moreSecData);
            }

            if (self.sectors.length > 0) {
                self.sectorMap = {};
                for (var i = 0; i < self.sectors.length; i++) {
                    self.sectorMap[self.sectors[i].index] = self.sectors[i];
                }
            }

            if (self.dataLabel.enabled) {
                self._startWidgetLabel();
            }

            //渲染顺序调整
            _attrs = ['side1', 'side2', 'inn', 'out', 'top'];
            _.each(_attrs, function (item) {
                self.sprite.addChild(self['sectorsSp3d_' + item]);
            })


            if(self.animation){
                _.each(_attrs, function (item) {
                    self['sectorsSp3d_' + item].context.globalAlpha = 0;
                });
            }

        }
    },
}