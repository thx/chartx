define(
    "chartx/chart/funnel/index",
    [
        'chartx/chart/index',
        'chartx/utils/tools',
        'chartx/utils/datasection',
        './graphs',
        "chartx/components/tips/tip",
        'chartx/utils/simple-data-format'
    ],
    function(Chart , Tools, DataSection, Graphs, Tip, dataFormat){
        /*
         *@node chart在dom里的目标容器节点。
        */
        var Canvax = Chart.Canvax;

        return Chart.extend( {

            min     : 0,
            max     : 100,                               //最大 最小基础值 用于计算边长比例
            gap     : 2,                                 //每个梯形之间的距离

            _graphs : null,
            _tip    : null,

            init:function(node , data , opts){
                _.deepExtend( this , opts );

                this.dataFrame = this._initData( data, opts );
            },
            _setStages : function(){
                this.core    = new Canvax.Display.Sprite({
                    id      : 'core'
                });
                this.stageBg  = new Canvax.Display.Sprite({
                    id      : 'bg'
                });
                this.stageTip  = new Canvax.Display.Sprite({
                    id      : 'tip'
                });
    
                this.stage.addChild(this.stageBg);
                this.stage.addChild(this.core);
                this.stage.addChild(this.stageTip);
            },
            draw:function(){

                this._setStages();

                this._initModule();                        //初始化模块  
    
                this._startDraw();                         //开始绘图
    
                this._drawEnd();                           //绘制结束，添加到舞台

                this.inited = true;
                
            },
            _initData  : function(data, opt){
                var me = this
                var d = dataFormat.apply(this, arguments)

                var arr = []

                var xData = d.data[opt.xAxis.field], yData = d.data[opt.yAxis.field]
                _.each(xData, function(item, i){
                    arr.push({
                        name  : item,
                        value : yData[i]
                    })
                })
                d.graphs.org = _.sortBy(arr, 'value')
                return d
            },
            _initModule:function(){
                this._graphs = new Graphs(this.graphs)
                this._tip    = new Tip(this.tips, this.canvax.getDomContainer());
            },
            _startDraw : function( opt ){
                var me = this
                var w = (opt && opt.w) || me.width;
                var h = (opt && opt.h) || me.height;

                me.graphsw = w
                me.graphsH = h

                me.dataFrame.graphs.data = me._trimGraphs().data
                me._graphs.draw(me.dataFrame.graphs.data, {
                    pos  : {
                         x : 0 ,
                         y : 0
                    }
                });

                me._bindEvent();
            },
            _trimGraphs:function(){
                var me = this
                var tmpData = []
                var data = _.clone(me.dataFrame.graphs.org)
                var count = data.length                              //总共几个梯形
                var maxW = me.graphsw, maxH = me.graphsH
                var centerY = maxW / 2                               //y方向中线
                var aveH = (maxH - me.gap * (count - 1)) / count     //平均高度
                
                _.each(data, function(item, i){

                    var polygon = {}
                    item.polygon = polygon

                    var w = (item.value - me.min) / me.max * maxW

                    var tmpI = count - i
                    var y = (aveH + me.gap) * (tmpI - 1)
                    var wl= centerY - w / 2, wr = centerY + w / 2
                    var pre = tmpData[0]

                    if(i == 0){
                        polygon.pointList = [[wl, y], [wr, y], [centerY, maxH] ]
                    }else{
                        polygon.pointList = [[wl, y], [wr, y], [pre.polygon.topRightX, y + aveH], [pre.polygon.topLeftX, y + aveH]]
                    }
                    polygon.topLeftX = wl, polygon.topRightX = wr

                    item.text = {
                        label : item.name,
                        x     : maxW / 2,
                        y     : y + aveH / 2,
                    }

                    // item = me.graphs.filter && me.graphs.filter(item)

                    tmpData.unshift(item)
                })

                return {
                    data: tmpData
                };
            },
            _drawEnd:function(){
                // this.stageBg.addChild(this._back.sprite)
    
                // this.core.addChild(this._xAxis.sprite);
                this.core.addChild(this._graphs.sprite);
                // this.core.addChild(this._yAxis.sprite);
               
                this.stageTip.addChild(this._tip.sprite);

                //执行生长动画
                // this._graphs.grow();
            },
            _bindEvent  : function(){
                var me = this;
                me._graphs.sprite.on("panstart mouseover", function(e){
                    if( e.eventInfo ){
                        me._setXaxisYaxisToeventInfo(e);
                        me._tip.show( e );
                    }
                });
                me._graphs.sprite.on("panmove mousemove", function(e){
                    if( e.eventInfo ){
                        me._setXaxisYaxisToeventInfo(e);
                        me._tip.move( e );
                    }

                });
                me._graphs.sprite.on("panend mouseout", function(e){
                    if( e.eventInfo ){
                        me._tip.hide( e );
                    }
                });
            },
            _setXaxisYaxisToeventInfo : function( e ){
                var me = this;
                var iNode = e.eventInfo.iNode
                var data = me.dataFrame.graphs.data[iNode]
                e.eventInfo.nodesInfoList = [{field:data.name, value:data.value}]
               
            },
        });
    }
);
