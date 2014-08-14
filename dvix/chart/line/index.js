KISSY.add(function(S, Chart, Tools, DataSection, EventType, xAxis, yAxis, Back, Graphs, Tips){
    /*
     *@node chart在dom里的目标容器节点。
    */
    var Canvax = Chart.Canvax;

    return Chart.extend( {

        init:function(node){

            this.config        =  {
                mode       : 1,                            //模式( 1 = 正常(y轴在背景左侧) | 2 = 叠加(y轴叠加在背景上))[默认：1]
                event      : {
                    enabled : 1
                }
            }

            this.dataFrame     =  {                        //数据框架集合
                org        :[],                            //最原始的数据  
                data       :[],                            //最原始的数据转化后的数据格式：[o,o,o] o={field:'val1',index:0,data:[1,2,3]}
                yAxis      :{                              //y轴
                    fields     :  [],                      //字段集合 对应this.data
                    org        :  [],                      //二维 原始数据[[100,200],[1000,2000]]
                    data       :  []                       //坐标数据[{y:100,content:'100'},{y:200,content:'200'}] 与back.data相同但当config.yAxis.mode=2时    该值进行删减且重算，back.data不受影响
                },
                xAxis      :{                              //x轴
                    field      :  null,                      //字段 对应this.data
                    org        :  [],                      //原始数据['星期一','星期二']
                    data       :  []                       //坐标数据[{x:100,content:'星期一'},{x:200,content:'星期二'}]
                },
                graphs     :{                              //图形
                    data       :  [],                      //二维 数据集合等[[{x:0,y:-100},{}],[]]
                    disX       :  0                        //每两个点之间的距离
                }
            }

            this._chartWidth   =  0;                       //图表渲染区域宽(去掉左右留空)
            this._chartHeight  =  0;                       //图表渲染区域高(去掉上下留空)

            this._disX         =  0;                       //图表区域离左右的距离
            this._disY         =  6;                       //图表区域离上下的距离
            this.disYAndO      =  6;                       //y轴原点之间的距离

            this._xAxis        =  null;
            this._yAxis        =  null;
            this._back         =  null;
            this._graphs       =  null;
            this._tips         =  null;


            this.stageTip = new Canvax.Display.Sprite({
                id      : 'tip'
            });

            this.core    = new Canvax.Display.Sprite({
                id      : 'core'
            });
            this.stageBg  = new Canvax.Display.Sprite({
                id      : 'bg'
            });

            this.stage.addChild(this.stageBg);
            this.stage.addChild(this.core);
            this.stage.addChild(this.stageTip);

        },
        draw:function(data, opt){
            if( opt.rotate ) {
              this.rotate( opt.rotate );
            }

            //根据data 和 opt中yAxis xAxis的field字段来分配this.dataFrame中的yAxis数据和xAxis数据
            this._initData( data , opt );

            this._initModule( opt , this.dataFrame );                      //初始化模块  

            this._startDraw();                         //开始绘图

            this._drawEnd();                           //绘制结束，添加到舞台
          
            this._arguments = arguments;

            //下面这个是全局调用测试的时候用的
            //window.hoho = this;
        },
        clear:function(){
            this.stageBg.removeAllChildren()
            this.core.removeAllChildren()
            this.stageTip.removeAllChildren()
        },
        rotate : function( angle ){
            var currW = this.width;
            var currH = this.height;
            this.width  = currH;
            this.height = currW;

            var self = this;
            _.each( self.stage.children , function( sprite ){
                sprite.context.rotation       = angle || -90;
                sprite.context.x              = ( currW - currH ) / 2 ;
                sprite.context.y              = ( currH - currW ) / 2 ;
                sprite.context.rotateOrigin.x = self.width  * sprite.context.$model.scaleX / 2;
                sprite.context.rotateOrigin.y = self.height * sprite.context.$model.scaleY / 2;
            });
        },
        reset:function(data, opt){
            this.clear()
            this.width   = parseInt(this.element.width());
            this.height  = parseInt(this.element.height());
            this.draw(data, opt)
        },
        _initModule:function(opt , data){
            this._xAxis  = new xAxis(opt.xAxis , data.xAxis);
            this._yAxis  = new yAxis(opt.yAxis , data.yAxis);
            this._back   = new Back(opt.back);
            this._graphs = new Graphs(opt.graphs);
            this._tips   = new Tips(opt.tips)
        },
        _startDraw : function(){
            var self = this;
            // self.dataFrame.yAxis.org = [[201,245,288,546,123,1000,445],[500,200,700,200,100,300,400]]
            // self.dataFrame.xAxis.org = ['星期一','星期二','星期三','星期四','星期五','星期六','星期日']
            

            //先计算出图表区域的大小
            self._chartWidth  = self.width  - 2 * self._disX
            self._chartHeight = self.height - 2 * self._disY

            var x = self._disX
            var y = this.height - self._xAxis.h - self._disY

            //绘制yAxis
            self._yAxis.draw({
                pos : {
                    x : x,
                    y : y
                },
                yMaxHeight : self._chartHeight - self._xAxis.h
            });


            var _yAxisW = self._yAxis.w
            if(self._yAxis.display == "none"){
                _yAxisW = 0
                self.disYAndO = 0
            }

            x = self._disX + _yAxisW + self.disYAndO

            //绘制x轴
            self._xAxis.draw({
                w    :   self._chartWidth - _yAxisW - self.disYAndO,
                max  :   {
                    left  : -(_yAxisW + self.disYAndO)
                },
                pos  : {
                    x : x,
                    y : y
                }
            });

            //绘制背景网格
            self._back.draw({
                w    : self._chartWidth - _yAxisW - self.disYAndO,
                h    : y,
                xAxis:{
                    data : self._yAxis.data
                }
            });
            self._back.setX(x), self._back.setY(y)

            self.dataFrame.graphs.disX = self._getGraphsDisX()
            self._trimGraphs()
            self._graphs.draw({
                w    : self._xAxis.xGraphsWidth,
                h    : self._yAxis.yGraphsHeight,
                data : self.dataFrame.graphs.data,
                disX : self.dataFrame.graphs.disX
            });
            //执行生长动画
            self._graphs.grow();

            self._graphs.setX(x + self._xAxis.disOriginX), self._graphs.setY(y)
                
            if(self.config.event.enabled){
                self._graphs.sprite.on(EventType.HOLD,function(e){
                    self._onInduceHandler(e)
                })
                self._graphs.sprite.on(EventType.DRAG,function(e){
                    self._onInduceHandler(e)
                })
                self._graphs.sprite.on(EventType.RELEASE,function(e){
                    self._offInduceHandler(e)
                })
            }
        },
        _trimGraphs:function(){
            var self = this                                                           
            var maxYAxis = self._yAxis.dataSection[ self._yAxis.dataSection.length - 1 ]
            var maxXAxis = self.dataFrame.xAxis.org.length
            var arr = self.dataFrame.yAxis.org
            var tmpData = []
            for (var a = 0, al = arr.length; a < al; a++ ) {
                for (var b = 0, bl = arr[a].length ; b < bl; b++ ) {
                    !tmpData[a] ? tmpData[a] = [] : ''
                    var y = - (arr[a][b] - self._yAxis._baseNumber) / (maxYAxis - self._yAxis._baseNumber) * self._yAxis.yGraphsHeight
                    y = isNaN(y) ? 0 : y
                    tmpData[a][b] = {'value':arr[a][b], 'x':b / (maxXAxis - 1) * self._xAxis.xGraphsWidth,'y':y}
                }
            }
            if(maxXAxis == 1){
                if(tmpData[0] && tmpData[0][0]){
                    tmpData[0][0].x = parseInt(self._xAxis.xGraphsWidth / 2)
                }
            }
            self.dataFrame.graphs.data = tmpData
        },
        //每两个点之间的距离
        _getGraphsDisX:function(){
            var self = this
            return self._xAxis.xGraphsWidth / (self.dataFrame.xAxis.org.length - 1)
        },

        _drawEnd:function(){
            var self = this;
            self.stageBg.addChild(self._back.sprite)

            self.core.addChild(self._xAxis.sprite);
            self.core.addChild(self._graphs.sprite);
            self.core.addChild(self._yAxis.sprite);

            self.stageTip.addChild(self._tips.sprite)
         
           
        },

        _onInduceHandler:function($evt){
            if(!$evt.info)
            return
            var self = this
            var strokeStyles = self._graphs.line.strokeStyle.overs
            var context = self._tips.opt.context
            var disTop = self._tips.opt.disTop
            var iGroup = $evt.info.iGroup, iNode = $evt.info.iNode
            var data = []
            var arr  = self.dataFrame.graphs.data
            for(var a = 0, al = arr.length; a < al; a++){
                if(!data[a]){
                    data[a] = []

                    var o = {
                        content  : context.prefix.values[a],
                        bold     : context.bolds[a],
                        fontSize : context.fontSizes[a],
                        fillStyle: context.fillStyles[a],
                        sign     : {
                            enabled   : 1,
                            trim      : 1,
                            fillStyle : strokeStyles[a]
                        }
                    }
                    data[a].push(o)
                }
                
                var o = {
                    content  : Tools.numAddSymbol(arr[a][iNode].value),
                    bold     : context.bolds[a],
                    fontSize : context.fontSizes[a],
                    fillStyle: context.fillStyles[a],
                    y_align  : 1
                }
                data[a].push(o)
            }
            var x = parseInt($evt.info.nodeInfo.stageX), y = parseInt(disTop)
            var tipsPoint = $evt.target.localToGlobal( $evt.info.nodeInfo , self.core );
            var tips = {
                w    : self.width,
                h    : self.height
            }
            tips.tip = {
                x    : tipsPoint.x,
                y    : tipsPoint.y,
                data : data
            }

            var yEnd = self._graphs.getY() - disTop
            tips.line = {
                x    : tipsPoint.x,
                y    : parseInt(self._graphs.getY()),
                yEnd : -yEnd
            }

            var data = []
            var arr = $evt.info.nodesInfoList
            for(var a = 0 , al = arr.length; a < al; a++){
                arr[a].y = $evt.target.context.height - Math.abs( arr[a].y )
                var circlePoint = $evt.target.localToGlobal( arr[a] , self.core );
                var o = {
                    x         : parseInt( circlePoint.x ),
                    y         : parseInt( circlePoint.y ),
                    fillStyle : strokeStyles[a]
                }
                data.push(o)
            }
            tips.nodes = {
                data : data
            }

            self._tips.remove()
            self._tips.draw(tips)
        },
        _offInduceHandler:function($evt){
            var self = this
            if(self._tips){
                self._tips.remove()
            }
        }
    });

} , {
    requires: [
        'dvix/chart/',
        'dvix/utils/tools',
        'dvix/utils/datasection',
        'dvix/event/eventtype',
        './xAxis',
        'dvix/components/yaxis/yAxis',
        'dvix/components/back/Back',
        'dvix/components/line/Graphs',
        'dvix/components/tips/Tips'
    ]
});
