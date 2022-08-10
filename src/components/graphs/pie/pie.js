//单环pie

import Canvax from "canvax"

let { _,event } = Canvax;
let Sector = Canvax.Shapes.Sector
let Path = Canvax.Shapes.Path
let Text = Canvax.Display.Text
let AnimationFrame = Canvax.AnimationFrame

export default class Pie extends event.Dispatcher
{
    constructor( _graphs, data )
    {
        super();

        this.width = 0;
        this.height = 0;
        this.origin = {
            x : 0,
            y : 0
        };

        //这个pie所属的graphs对象
        this._graphs = _graphs;

        this.domContainer = _graphs.app.canvax.domView;

        this.data = data;

        this.sprite = null;
        this.textSp = null;
        this.sectorsSp = null;
        this.selectedSp = null;

        this.init();

        this.sectors = [];
        this.textMaxCount = 15;
        this.textList = [];

        this.completed = false;//首次加载动画是否完成
    }

    init()
    {

        this.sprite = new Canvax.Display.Sprite();

        this.sectorsSp = new Canvax.Display.Sprite();
        this.sprite.addChild(this.sectorsSp);

        this.selectedSp = new Canvax.Display.Sprite();
        this.sprite.addChild(this.selectedSp);

        if (this._graphs.label.enabled) {
            this.textSp = new Canvax.Display.Sprite();
        };

    }

    draw(opt)
    {
        let me = this;

        _.extend(true, this, opt);

        this.sprite.context.x = me.origin.x;
        this.sprite.context.y = me.origin.y;
 
        me._widget();
            
    }

    resetData( data )
    {
        let me = this;
        this.data = data;
        
        me.destroyLabel();

        let completedNum = 0;
        for (let i = 0; i < me.sectors.length; i++) {
            let sec = me.sectors[i];
            let secData = this.data.list[i];

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
        let me = this;
        let list = me.data.list;
        let total = me.data.total;

        //let moreSecData;
        if ( list.length > 0 && total > 0 ) {
            me.textSp && me.sprite.addChild(me.textSp);
            for (let i = 0; i < list.length; i++) {
                let item = list[i];
            
                //扇形主体          
                let sector = new Sector({
                    hoverClone: false,
                    xyToInt : false, //扇形不需要自动取整
                    context: {
                        x: item.focused ? item.outOffsetx : 0,
                        y: item.focused ? item.outOffsety : 0,
                        r0: item.innerRadius,
                        r: item.outRadius,
                        startAngle: item.startAngle,
                        endAngle: item.endAngle,
                        fillStyle: item.fillStyle,
                        //iNode: item.iNode,
                        cursor: "pointer"
                    },
                    id: 'sector' + i
                });
            
                sector.nodeData = item;

                item.focusEnabled && sector.hover(function(){
                    me.focusOf( this.nodeData );
                } , function(){
                    !this.nodeData.selected && me.unfocusOf( this.nodeData );
                });

                //触发注册的事件
                sector.on(event.types.get(), function (e) {
                    //me.fire( e.type, e );
                
                    e.eventInfo = {
                        trigger : 'this._graphs.node',//me._graphs.node,
                        nodes : [ this.nodeData ]
                    };

                    //图表触发，用来处理Tips
                    me._graphs.app.fire( e.type, e );

                });

                me.sectorsSp.addChildAt(sector, 0);
                me.sectors.push( sector );
                
            };

            if (me._graphs.label.enabled) {
                me._startWidgetLabel();
            };
        }
    }

    focusOf( node , callback)
    {
        if( node.focused ) return;
        let me = this;
        let sec = me.sectors[ node.iNode ];

        sec.animate({
            x: node.outOffsetx,
            y: node.outOffsety
        }, {
            duration: 100,
            onComplete: function () {
                callback && callback();
            }
        });
        node.focused = true;
    }

    unfocusOf( node, callback )
    {
        if( !node.focused ) return;
        let me = this;

        let sec = me.sectors[ node.iNode ];
        sec.animate({
            x: 0,
            y: 0
        }, {
            duration: 100,
            onComplete: function () {
                callback && callback();
            }
        });

        node.focused = false;
    }

    selectOf ( node ) 
    { 
        let me = this;
        if( !this.sectors.length || !node.selectEnabled ){
            return;
        };

        let sec = this.sectors[node.iNode];
     
        if ( node.selected ) {
            return
        };
        
        if (!node.focused) {
            node._focusTigger = "select";
            this.focusOf( node , function () {
                me.addCheckedSec(sec);
            });
        } else {
            this.addCheckedSec(sec);
        };
        node.selected = true;
    }

    unselectOf ( node ) 
    {
        let sec = this.sectors[ node.iNode ];
        if (!node.selected || !node.selectEnabled) {
            return
        };
        let me = this;
        me.cancelCheckedSec(sec, function() {
            if( node._focusTigger == "select" ){
                me.unfocusOf(node);
            };
        });
        node.selected = false;
    }

    addCheckedSec(sec, callback)
    {
        let secc = sec.context;
        let nodeData = sec.nodeData;

        if( !secc ) return;
        
        let sector = new Sector({
            xyToInt : false,
            context : {
                x: secc.x,
                y: secc.y,
                r0: secc.r - 1,
                r: secc.r + nodeData.selectedR,
                startAngle: secc.startAngle,
                endAngle: secc.startAngle, //secc.endAngle,
                fillStyle: secc.fillStyle,
                globalAlpha: nodeData.selectedAlpha
            },
            id: 'selected_' + sec.id
        });
        sec._selectedSec = sector

        this.selectedSp.addChild(sector);

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
        let selectedSec = sec._selectedSec;
        
        selectedSec.animate({
            startAngle: selectedSec.context.endAngle - 0.5
        }, {
            duration: this._getAngleTime( sec.context ),
            onComplete: function () {
                delete sec._selectedSec;
                selectedSec.destroy();
                callback && callback();
            }
        });
    }

    _getAngleTime (secc) 
    {
        return Math.abs(secc.startAngle - secc.endAngle) / 360 * 500
    }



    grow( callback ) 
    {
        let me = this;
        
        _.each(me.sectors, function (sec) {
            if (sec.context) {
                sec.context.r0 = 0;
                sec.context.r = 0;
                sec.context.startAngle = me._graphs.startAngle;
                sec.context.endAngle = me._graphs.startAngle;
            }
        });

        me._hideGrowLabel();

        let _tween = AnimationFrame.registTween({
            from: {
                process: 0
            },
            to: {
                process: 1
            },
            duration: 500,
            onUpdate: function( status ) {
                for (let i = 0; i < me.sectors.length; i++) {
                    let sec = me.sectors[i];
                    let nodeData = sec.nodeData;
                    let secc = sec.context;

                    let _startAngle = nodeData.startAngle;
                    let _endAngle   = nodeData.endAngle;
                    let _r  = nodeData.outRadius;
                    let _r0 = nodeData.innerRadius;

                    if (secc) {
                        secc.r = _r * status.process;
                        secc.r0 = _r0 * status.process;
                        if (i == 0) {
                            secc.startAngle = _startAngle;
                            secc.endAngle = _startAngle + (_endAngle - _startAngle) * status.process;
                        } else {
                            let lastEndAngle = function (iNode) {
                                let lastIndex = iNode - 1;
                                let lastSecc = me.sectors[lastIndex].context;
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
                        if( sec._selectedSec ){
                            sec._selectedSec.context.r0 = secc.r - 1;
                            sec._selectedSec.context.r  = secc.r + nodeData.selectedR;
                            sec._selectedSec.context.startAngle = secc.startAngle;
                            sec._selectedSec.context.endAngle = secc.endAngle;
                        }
                    }
                }
            },
            
            onComplete: function() {

                //把下面me.sprite._tweens.push( _tween );的 动画实例删除
                me.sprite._removeTween( _tween );

                me._showGrowLabel();
                me.completed = true;

                callback && callback();
            }
        });
        me.sprite._tweens.push( _tween );
    }


    _widgetLabel(quadrant, indexs, lmin, rmin, isEnd, ySpaceInfo) 
    {
        let me = this;
        let count = 0;
        let data = me.data.list;
        let minTxtDis = 15;
        let textOffsetX = 5;
        
        let currentIndex;
        let preY, currentY, adjustX, txtDis, bwidth, bheight, bx, by;
        let yBound, remainingNum, remainingY;
        
        let clockwise = quadrant == 2 || quadrant == 4;
        let isleft = quadrant == 2 || quadrant == 3;
        let isup = quadrant == 3 || quadrant == 4;
        let minY = isleft ? lmin : rmin;

        //text的绘制顺序做修正，text的Y值在饼图上半部分（isup）时，Y值越小的先画，反之Y值在饼图下部分时，Y值越大的先画.
        if (indexs.length > 0) {
            indexs.sort(function (a, b) {
                return isup ? data[a].edgey - data[b].edgey : data[b].edgey - data[a].edgey;
            })
        }
        
        for (let i = 0; i < indexs.length; i++) {
            currentIndex = indexs[i];
            let itemData = data[currentIndex];
            let outCircleRadius = itemData.outRadius + itemData.moveDis;

            //若Y值小于最小值，不画text    
            if (!itemData.enabled || itemData.y < minY || count >= me.textMaxCount) continue
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
            
            let currentX = (isleft ? -adjustX-textOffsetX : adjustX+textOffsetX);
            let globalX = currentX + me.origin.x;
            let globalY = currentY + me.origin.y;

            if( globalX > me._graphs.app.width || globalY < 0 || globalY > me._graphs.app.height ){
                return;
            };

            let pathStr = "M"+itemData.centerx+","+itemData.centery;
            pathStr += "Q"+itemData.outx+","+itemData.outy+","+currentX+","+currentY;
            
            let path = new Path({
                context: {
                    lineType: 'solid',
                    path : pathStr,
                    lineWidth: 1,
                    strokeStyle: itemData.fillStyle
                }
            });

            let textTxt = itemData.labelText;

            let textEle
            if( me.domContainer ){
                textEle = document.createElement("div");
                textEle.style.cssText = " ;position:absolute;left:-1000px;top:-1000px;color:" + itemData.fillStyle + ""
                textEle.innerHTML = textTxt;
                me.domContainer.appendChild(textEle);
                bwidth = textEle.offsetWidth;
                bheight = textEle.offsetHeight;
            } else {
                //小程序等版本里面没有domContainer， 需要直接用cavnas绘制
                textEle = new Text( textTxt, {
                    context: {
                        fillStyle : itemData.fillStyle
                    }
                } );
                me.textSp.addChild( textEle );
                bwidth = Math.ceil( textEle.getTextWidth() );
                bheight = Math.ceil( textEle.getTextHeight() );
            }
            
            bx = isleft ? -adjustX : adjustX;
            by = currentY;

            switch ( quadrant ) {
                case 1:
                    bx += textOffsetX;
                    by -= bheight / 2;
                    break;
                case 2:
                    bx -= (bwidth + textOffsetX);
                    by -= bheight / 2;
                    break;
                case 3:
                    bx -= (bwidth + textOffsetX);
                    by -= bheight / 2;
                    break;
                case 4:
                    bx += textOffsetX;
                    by -= bheight / 2;
                    break;
            };

            //如果是dom 的话就会有style属性
            if( textEle.style ){
                textEle.style.left = bx + me.origin.x + "px";
                textEle.style.top = by + me.origin.y + "px";
            } else if( textEle.context ) {
                textEle.context.x = bx;
                textEle.context.y = by;
            };
            

            me.textSp.addChild( path );
            
            me.textList.push({
                width: bwidth,
                height: bheight,
                x: bx + me.origin.x,
                y: by + me.origin.y,
                data: itemData,
                textTxt: textTxt,
                textEle: textEle
            });
        }
    }

    _startWidgetLabel()
    {
        let me = this;
        let data = me.data.list;
        let rMinPercentage = 0,
            lMinPercentage = 0,
            rMinY = 0,
            lMinY = 0;
        let quadrantsOrder = [];

        let quadrantInfo = [
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
        let widgetInfo = {
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

        for (let i = 0; i < data.length; i++) {
            let cur = data[i].quadrant;
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

        let overflowIndexs, sortedIndexs;
        
        if (widgetInfo.right.indexs.length > me.textMaxCount) {
            sortedIndexs = widgetInfo.right.indexs.slice(0);
            sortedIndexs.sort(function (a, b) {
                return data[b].y - data[a].y;
            });
            overflowIndexs = sortedIndexs.slice(me.textMaxCount);
            rMinPercentage = data[overflowIndexs[0]].percentage;
            rMinY = data[overflowIndexs[0]].y;
        }
        if (widgetInfo.left.indexs.length > me.textMaxCount) {
            sortedIndexs = widgetInfo.left.indexs.slice(0);
            sortedIndexs.sort(function (a, b) {
                return data[b].y - data[a].y;
            });
            overflowIndexs = sortedIndexs.slice(me.textMaxCount);
            lMinPercentage = data[overflowIndexs[0]].percentage;
            lMinY = data[overflowIndexs[0]].y;
        }

        quadrantsOrder.push(widgetInfo.right.startQuadrant);
        quadrantsOrder.push(widgetInfo.right.endQuadrant);
        quadrantsOrder.push(widgetInfo.left.startQuadrant);
        quadrantsOrder.push(widgetInfo.left.endQuadrant);

        let ySpaceInfo = {}

        for (let i = 0; i < quadrantsOrder.length; i++) {
            let isEnd = i == 1 || i == 3;
            me._widgetLabel(quadrantsOrder[i], quadrantInfo[quadrantsOrder[i] - 1].indexs, lMinY, rMinY, isEnd, ySpaceInfo)
        }
    }

    destroyLabel()
    {
        let me = this;
        if (this.textSp) {
            this.textSp.removeAllChildren();
        };
        _.each(this.textList, function (lab) {
            if( me.domContainer ){
                me.domContainer.removeChild( lab.textEle );
            }
        });
        this.textList = [];
    }

    _showGrowLabel()
    {
        if (this.textSp && this.textSp.context) {
            this.textSp.context.globalAlpha = 1;
            _.each(this.textList, function (lab) {
                if(lab.textEle.style){
                    lab.textEle.style.visibility = "visible"
                } 
            });
        }
    }

    _hideGrowLabel()
    {
        if (this.textSp && this.textSp.context) {
            this.textSp.context.globalAlpha = 0;
            _.each(this.textList, function (lab) {
                if(lab.textEle.style) {
                    lab.textEle.style.visibility = "hidden"
                }
            });
        }
    }
}