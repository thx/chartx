//单环pie

import Canvax from "canvax2d"


const Sector = Canvax.Shapes.Sector
const Path = Canvax.Shapes.Path
const Rect = Canvax.Shapes.Rect
const AnimationFrame = Canvax.AnimationFrame
const _ = Canvax._;


export default class Pie extends Canvax.Event.EventDispatcher
{
    constructor( opts, _graphs, data )
    {
        super();

        this._opts = opts;

        this.width = 0;
        this.height = 0;
        this.origin = {
            x : 0,
            y : 0
        };

        //这个pie所属的graphs对象
        this._graphs = _graphs;
        this.moveDis = _graphs.moveDis;
        this.innerRadius = _graphs.innerRadius;
        //this.outRadius = _graphs.outRadius;
        this.domContainer = _graphs.root.canvax.domView;

        this.data = data;

        this.sprite = null;
        this.labelSp = null;
        this.sectorsSp = null;
        this.checkedSp = null;

        this.init(opts);

        this.sectors = [];
        this.labelMaxCount = 15;
        this.labelList = [];

        this.completed = false;//首次加载动画是否完成
    }

    init(opts)
    {
        _.extend(true, this, opts);

        this.sprite = new Canvax.Display.Sprite();

        this.sectorsSp = new Canvax.Display.Sprite();
        this.sprite.addChild(this.sectorsSp);

        this.checkedSp = new Canvax.Display.Sprite();
        this.sprite.addChild(this.checkedSp);

        if (this._graphs.label.enabled) {
            this.labelSp = new Canvax.Display.Sprite();
        };

    }

    draw(opts)
    {
        var me = this;

        _.extend(true, this, opts);

        this.sprite.context.x = me.origin.x;
        this.sprite.context.y = me.origin.y;
 
        me._widget();
            
        if (this.animation) {
            me.grow();
        } else {
            me.completed = true;
        }
    }

    resetData( data )
    {
        var me = this;
        this.data = data;
        
        me.destroyLabel();

        var completedNum = 0;
        for (var i = 0; i < me.sectors.length; i++) {
            var sec = me.sectors[i];
            var secData = this.data.list[i];

            sec.animate({
                r : secData.outRadius,
                startAngle : secData.startAngle,
                endAngle : secData.endAngle
            },{
                duration : 280,
                onComplete : function(){
                    completedNum++;
                    if( completedNum == me.sectors.length ){
                        if ( me._graphs.label.enabled ) {
                            me._startWidgetLabel();
                        };
                    }
                }
            });
        }
    }

    _widget() 
    {
        var me = this;
        var list = me.data.list;
        var total = me.data.total;

        var moreSecData;
        if ( list.length > 0 && total > 0 ) {
            me.labelSp && me.sprite.addChild(me.labelSp);
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
            
                //扇形主体          
                var sector = new Sector({
                    hoverClone: false,
                    xyToInt : false, //扇形不需要自动取整
                    context: {
                        x: item.sliced ? item.outOffsetx : 0,
                        y: item.sliced ? item.outOffsety : 0,
                        r0: me.innerRadius,
                        r: item.outRadius,
                        startAngle: item.startAngle,
                        endAngle: item.endAngle,
                        fillStyle: item.fillStyle,
                        //ind: item.ind,
                        cursor: "pointer"
                    },
                    id: 'sector' + i
                });
            
                sector.data = item;
               
                //扇形slice
                me._graphs.focus.enabled && sector.hover(function (e) {
                    var secData = this.data;
                    if (!secData.checked) {
                        me.focusAt( secData.ind );
                    }
                }, function (e) {
                    var secData = this.data;
                    if (!secData.checked) {
                        me.unfocusAt( secData.ind );
                    }
                });

                //触发注册的事件
                sector.on('mousedown mouseup click mousemove dblclick', function (e) {
                    if( me[ "on"+e.type ] && _.isFunction( me[ "on"+e.type ] ) ){
                        //如果有在pie的配置上面注册对应的事件，则触发
                        me[ "on"+e.type ]( e ,);
                    }
                });
                me.sectorsSp.addChildAt(sector, 0);
                me.sectors.push( sector );
            };

            if (me._graphs.label.enabled) {
                me._startWidgetLabel();
            };
        }
    }

    focusAt (ind, callback) 
    {
        var me = this;
        var sec = me.sectors[ind];
        var secData = me.data.list[ind];
        secData.sliced = true;
        sec.animate({
            x: secData.outOffsetx,
            y: secData.outOffsety
        }, {
            duration: 100,
            onComplete: function () {
                callback && callback();
            }
        });
    }

    unfocusAt (ind, callback) 
    {
        var me = this;
        var sec = me.sectors[ind];
        var secData = me.data.list[ind];
        secData.sliced = false;
        sec.animate({
            x: 0,
            y: 0
        }, {
            duration: 100,
            onComplete: function () {
                callback && callback();
            }
        });
    }

    checkAt (ind) 
    {
        var me = this;
        if( !this.sectors.length ){
            return;
        };

        var sec = this.sectors[ind];
        var secData = this.data.list[ind];
        if (secData.checked) {
            return
        };
        
        if (!secData.sliced) {
            this.focusAt(ind, function () {
                me.addCheckedSec(sec);
            });
        } else {
            this.addCheckedSec(sec);
        };
        secData.checked = true;
    }

    uncheckAt (ind) 
    {
        var sec = this.sectors[ind];
        var secData = this.data.list[ind];
        if (!secData.checked) {
            return
        };
        var me = this;
        me.cancelCheckedSec(sec, function () {
            me.unfocus(ind);
        });
        secData.checked = false;
    }

    uncheckAll () {
        var me = this;
        _.each(this.sectors, function (sec, i) {
            var secData = me.data.list[i];
            if (secData.checked) {
                me.uncheckAt( i );
            }
        });
    }

    addCheckedSec(sec, callback)
    {
        var secc = sec.context;
        if( !secc ) return;
        
        var sector = new Sector({
            xyToInt : false,
            context : {
                x: secc.x,
                y: secc.y,
                r0: secc.r - 1,
                r: secc.r + this.checked.r,
                startAngle: secc.startAngle,
                endAngle: secc.startAngle, //secc.endAngle,
                fillStyle: secc.fillStyle,
                globalAlpha: this.checked.globalAlpha
            },
            id: 'checked_' + sec.id
        });
        sec._checkedSec = sector

        this.checkedSp.addChild(sector);

        if( this.completed ){
            sector.animate({
                endAngle: secc.endAngle
            }, {
                duration: this._getAngleTime(secc),
                onComplete: function () {
                    callback && callback();
                }
            });
        } else {
            sector.context.endAngle = secc.endAngle;
        }
    }

    cancelCheckedSec (sec, callback) 
    {
        var checkedSec = sec._checkedSec;
        
        checkedSec.animate({
            startAngle: checkedSec.context.endAngle - 0.5
        }, {
            duration: this._getAngleTime( sec.context ),
            onComplete: function () {
                delete sec._checkedSec;
                checkedSec.destroy();
                callback && callback();
            }
        });
    }

    _getAngleTime (secc) 
    {
        return Math.abs(secc.startAngle - secc.endAngle) / 360 * 500
    }



    grow() 
    {
        var me = this;
        
        _.each(me.sectors, function (sec, ind) {
            if (sec.context) {
                sec.context.r0 = 0;
                sec.context.r = 0;
                sec.context.startAngle = me._graphs.startAngle;
                sec.context.endAngle = me._graphs.startAngle;
            }
        });

        me._hideGrowLabel();

        AnimationFrame.registTween({
            from: {
                process: 0
            },
            to: {
                process: 1
            },
            duration: 500,
            onUpdate: function ( status ) {
                for (var i = 0; i < me.sectors.length; i++) {
                    var sec = me.sectors[i];
                    var secc = sec.context;

                    var _startAngle = sec.data.startAngle;
                    var _endAngle = sec.data.endAngle;
                    var _r = sec.data.outRadius;
                    var _r0 = sec.data.innerRadius;

                    if (secc) {
                        secc.r = _r * status.process;
                        secc.r0 = _r0 * status.process;
                        if (i == 0) {
                            secc.startAngle = _startAngle;
                            secc.endAngle = _startAngle + (_endAngle - _startAngle) * status.process;
                        } else {
                            var lastEndAngle = function (ind) {
                                var lastIndex = ind - 1;
                                var lastSecc = me.sectors[lastIndex].context;
                                if (lastIndex == 0) {
                                    return lastSecc ? lastSecc.endAngle : 0;
                                }
                                if (lastSecc) {
                                    return lastSecc.endAngle;
                                } else {
                                    return arguments.callee(lastIndex);
                                }
                            } (i);
                            secc.startAngle = lastEndAngle;
                            secc.endAngle = secc.startAngle + ( _endAngle - _startAngle ) * status.process;
                        }
                        //如果已经被选中，有一个选中态
                        if( sec._checkedSec ){
                            sec._checkedSec.context.r0 = secc.r - 1;
                            sec._checkedSec.context.r  = secc.r + me.checked.r;
                            sec._checkedSec.context.startAngle = secc.startAngle;
                            sec._checkedSec.context.endAngle = secc.endAngle;
                        }
                    }
                }
            },
            
            onComplete: function () {
                me._showGrowLabel();
                me.completed = true;
            }
        });
    }


    _widgetLabel(quadrant, indexs, lmin, rmin, isEnd, ySpaceInfo) 
    {
        var me = this;
        var count = 0;
        var data = me.data.list;
        var minTxtDis = 15;
        var labelOffsetX = 5;
        
        var currentIndex;
        var preY, currentY, adjustX, txtDis, bwidth, bheight, bx, by;
        var yBound, remainingNum, remainingY;
        
        var clockwise = quadrant == 2 || quadrant == 4;
        var isleft = quadrant == 2 || quadrant == 3;
        var isup = quadrant == 3 || quadrant == 4;
        var minY = isleft ? lmin : rmin;

        //label的绘制顺序做修正，label的Y值在饼图上半部分（isup）时，Y值越小的先画，反之Y值在饼图下部分时，Y值越大的先画.
        if (indexs.length > 0) {
            indexs.sort(function (a, b) {
                return isup ? data[a].edgey - data[b].edgey : data[b].edgey - data[a].edgey;
            })
        }
        
        for (var i = 0; i < indexs.length; i++) {
            currentIndex = indexs[i];
            var itemData = data[currentIndex];
            var outCircleRadius = itemData.outRadius + me.moveDis;

            //若Y值小于最小值，不画label    
            if (!itemData.enabled || itemData.y < minY || count >= me.labelMaxCount) continue
            count++;
            currentY = itemData.edgey;
            adjustX = Math.abs(itemData.edgex);
            txtDis = currentY - preY;

            if (i != 0 && ((Math.abs(txtDis) < minTxtDis) || (isup && txtDis < 0) || (!isup && txtDis > 0))) {
                currentY = isup ? preY + minTxtDis : preY - minTxtDis;
                if (outCircleRadius - Math.abs(currentY) > 0) {
                    adjustX = Math.sqrt(Math.pow(outCircleRadius, 2) - Math.pow(currentY, 2));
                }

                if ((isleft && (-adjustX > itemData.edgex)) || (!isleft && (adjustX < itemData.edgex))) {
                    adjustX = Math.abs(itemData.edgex);
                }
            }

            if (isEnd) {
                yBound = isleft ? ySpaceInfo.left : ySpaceInfo.right;
                remainingNum = indexs.length - i;
                remainingY = isup ? yBound - remainingNum * minTxtDis : yBound + remainingNum * minTxtDis;
                if ((isup && currentY > remainingY) || !isup && currentY < remainingY) {
                    currentY = remainingY;
                }
            }

            preY = currentY;
            if (!isEnd) {
                if (isleft) {
                    ySpaceInfo.left = preY;
                } else {
                    ySpaceInfo.right = preY;
                }
            };


            //指示线
            /**
            [
                [ itemData.centerx , itemData.centery ], //startAngle
                [ itemData.outx , itemData.outy ],  //二次贝塞尔控制点
                [ isleft ? -adjustX-labelOffsetX : adjustX+labelOffsetX, currentY] //endAngle
            ]
            */
            var pathStr = "M"+itemData.centerx+","+itemData.centery;
            pathStr += "Q"+itemData.outx+","+itemData.outy+","+(isleft ? -adjustX-labelOffsetX : adjustX+labelOffsetX)+","+currentY;
            
            var path = new Path({
                context: {
                    lineType: 'solid',
                    path : pathStr,
                    lineWidth: 1,
                    strokeStyle: itemData.fillStyle
                }
            });

            
         
            //指示文字

            var labelTxt = itemData.label;
            //如果用户format过，那么就用用户指定的格式
            //如果没有就默认拼接
            if( !this._graphs.label.format ){
                if( labelTxt ){
                    labelTxt = labelTxt + "：" + itemData.percentage + "%" 
                } else {
                    labelTxt = itemData.percentage + "%" 
                }
            };

            var branchTxt = document.createElement("div");
            branchTxt.style.cssText = " ;position:absolute;left:-1000px;top:-1000px;color:" + itemData.fillStyle + ""
            branchTxt.innerHTML = labelTxt;
            me.domContainer.appendChild(branchTxt);
            bwidth = branchTxt.offsetWidth;
            bheight = branchTxt.offsetHeight;

            bx = isleft ? -adjustX : adjustX;
            by = currentY;

            switch (quadrant) {
                case 1:
                    bx += labelOffsetX;
                    by -= bheight / 2;
                    break;
                case 2:
                    bx -= (bwidth + labelOffsetX);
                    by -= bheight / 2;
                    break;
                case 3:
                    bx -= (bwidth + labelOffsetX);
                    by -= bheight / 2;
                    break;
                case 4:
                    bx += labelOffsetX;
                    by -= bheight / 2;
                    break;
            };

            branchTxt.style.left = bx + me.origin.x + "px";
            branchTxt.style.top = by + me.origin.y + "px";

            me.labelSp.addChild( path );
            
            me.labelList.push({
                width: bwidth,
                height: bheight,
                x: bx + me.origin.x,
                y: by + me.origin.y,
                data: itemData,
                labelTxt: labelTxt,
                labelEle: branchTxt
            });
        }
    }

    _startWidgetLabel()
    {
        var me = this;
        var data = me.data.list;
        var rMinPercentage = 0,
            lMinPercentage = 0,
            rMinY = 0,
            lMinY = 0;
        var quadrantsOrder = [];

        var quadrantInfo = [
            {
                indexs: [],
                count: 0
            }, {
                indexs: [],
                count: 0
            }, {
                indexs: [],
                count: 0
            }, {
                indexs: [],
                count: 0
            }
        ];

        //默认从top开始画
        var widgetInfo = {
            right: {
                startQuadrant: 4,
                endQuadrant: 1,
                clockwise: true,
                indexs: []
            },
            left: {
                startQuadrant: 3,
                endQuadrant: 2,
                clockwise: false,
                indexs: []
            }
        };

        for (var i = 0; i < data.length; i++) {
            var cur = data[i].quadrant;
            quadrantInfo[cur - 1].indexs.push(i);
            quadrantInfo[cur - 1].count++;
        }

        //1,3象限的绘制顺序需要反转
        if (quadrantInfo[0].count > 1) quadrantInfo[0].indexs.reverse();
        if (quadrantInfo[2].count > 1) quadrantInfo[2].indexs.reverse();

        if (quadrantInfo[0].count > quadrantInfo[3].count) {
            widgetInfo.right.startQuadrant = 1;
            widgetInfo.right.endQuadrant = 4;
            widgetInfo.right.clockwise = false;
        }

        if (quadrantInfo[1].count > quadrantInfo[2].count) {
            widgetInfo.left.startQuadrant = 2;
            widgetInfo.left.endQuadrant = 3;
            widgetInfo.left.clockwise = true;
        }

        widgetInfo.right.indexs = quadrantInfo[widgetInfo.right.startQuadrant - 1].indexs.concat(quadrantInfo[widgetInfo.right.endQuadrant - 1].indexs);
        widgetInfo.left.indexs = quadrantInfo[widgetInfo.left.startQuadrant - 1].indexs.concat(quadrantInfo[widgetInfo.left.endQuadrant - 1].indexs);

        var overflowIndexs, sortedIndexs;
        
        if (widgetInfo.right.indexs.length > me.labelMaxCount) {
            sortedIndexs = widgetInfo.right.indexs.slice(0);
            sortedIndexs.sort(function (a, b) {
                return data[b].y - data[a].y;
            });
            overflowIndexs = sortedIndexs.slice(me.labelMaxCount);
            rMinPercentage = data[overflowIndexs[0]].percentage;
            rMinY = data[overflowIndexs[0]].y;
        }
        if (widgetInfo.left.indexs.length > me.labelMaxCount) {
            sortedIndexs = widgetInfo.left.indexs.slice(0);
            sortedIndexs.sort(function (a, b) {
                return data[b].y - data[a].y;
            });
            overflowIndexs = sortedIndexs.slice(me.labelMaxCount);
            lMinPercentage = data[overflowIndexs[0]].percentage;
            lMinY = data[overflowIndexs[0]].y;
        }

        quadrantsOrder.push(widgetInfo.right.startQuadrant);
        quadrantsOrder.push(widgetInfo.right.endQuadrant);
        quadrantsOrder.push(widgetInfo.left.startQuadrant);
        quadrantsOrder.push(widgetInfo.left.endQuadrant);

        var ySpaceInfo = {}

        for (var i = 0; i < quadrantsOrder.length; i++) {
            var isEnd = i == 1 || i == 3;
            me._widgetLabel(quadrantsOrder[i], quadrantInfo[quadrantsOrder[i] - 1].indexs, lMinY, rMinY, isEnd, ySpaceInfo)
        }
    }

    destroyLabel()
    {
        var me = this;
        if (this.labelSp) {
            this.labelSp.removeAllChildren();
        };
        _.each(this.labelList, function (lab) {
            me.domContainer.removeChild( lab.labelEle );
        });
        this.labelList = [];
    }

    _showGrowLabel()
    {
        if (this.labelSp) {
            this.labelSp.context.globalAlpha = 1;
            _.each(this.labelList, function (lab) {
                lab.labelEle.style.visibility = "visible"
            });
        }
    }

    _hideGrowLabel()
    {
        if (this.labelSp) {
            this.labelSp.context.globalAlpha = 0;
            _.each(this.labelList, function (lab) {
                lab.labelEle.style.visibility = "hidden"
            });
        }
    }
}