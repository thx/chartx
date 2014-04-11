KISSY.add("dvix/chart/line/" , function(S, Dvix, Tools, DataSection, EventType, xAxis, yAxis, Back, Graphs, Tips){
    /*
     *@node chart在dom里的目标容器节点。
    */
    var Canvax = Dvix.Canvax;
    window.Canvax = Canvax
    var Line = function( node ){
        this.version       =  '0.1'                    //图表版本
        this.type          =  'line';                  //图表类型(折线图)
        this.canvax        =  null;                    //Canvax实例
        this.element       =  null;                    //chart 在页面里面的容器节点，也就是要把这个chart放在哪个节点里
        this.width         =  0;                       //图表区域宽
        this.height        =  0;                       //图表区域高
        this.config        =  {
            mode       : 1,                            //模式( 1 = 正常(y轴在背景左侧) | 2 = 叠加(y轴叠加在背景上))[默认：1]
            event      : {
                enabled : 1
            }
        }

        this.dataFrameOrg     =  {                        //数据框架集合
            org        :[],                            //最原始的数据  
            data       :[],                            //最原始的数据转化后的数据格式：[o,o,o] o={field:'val1',index:0,data:[1,2,3]}
            yAxis      :{                              //y轴
                fields     :  [],                      //字段集合 对应this.data
                org        :  [],                      //二维 原始数据[[100,200],[1000,2000]]
                section    :  [],                      //分段之后数据[200, 400, 600, 800, 1000, 1200, 1400, 1600]
                data       :  []                       //坐标数据[{y:100,content:'100'},{y:200,content:'200'}] 与back.data相同但当config.yAxis.mode=2时    该值进行删减且重算，back.data不受影响
            },
            xAxis      :{                              //x轴
                field      :  '',                      //字段 对应this.data
                org        :  [],                      //原始数据['星期一','星期二']
                data       :  []                       //坐标数据[{x:100,content:'星期一'},{x:200,content:'星期二'}]
            },
            graphs     :{                              //图形
                data       :  [],                      //二维 数据集合等[[{x:0,y:-100},{}],[]]
                disX       :  0                        //每两个点之间的距离
            }
        }
        this.dataFrame = {}

        this._chartWidth   =  0;                       //图表渲染区域宽(去掉左右留空)
        this._chartHeight  =  0;                       //图表渲染区域高(去掉上下留空)

        this._disX         =  0;                       //图表区域离左右的距离
        this._disY         =  6;                       //图表区域离上下的距离
        this._disYAndO     =  6;                       //y轴原点之间的距离

        this._disXAxisLine =  6;                       //x轴两端预留的最小值
        this._disYAxisTopLine =  6;                    //y轴顶端预留的最小值
        this._disOriginX   =  0;                       //背景中原点开始的x轴线与x轴的第一条竖线的偏移量

        this._yMaxHeight   =  0;                       //y轴最大高
        this._yGraphsHeight=  0;                       //y轴第一条线到原点的高

        this._xMaxWidth    =  0;                       //x轴最大宽(去掉y轴之后)
        this._xGraphsWidth =  0;                       //x轴宽(去掉两端)

        this._baseNumber   =  0;                       //基础点

        this._xAxis        =  null;
        this._yAxis        =  null;
        this._back         =  null;
        this._graphs       =  null;
        this._tips         =  null;

	   	this.init.apply(this , arguments);
    };

    Line.prototype = {

        init:function(node){
            var self = this;
            self.element = node;
            self.width   = parseInt(node.width());
            self.height  = parseInt(node.height());

            self.canvax = new Canvax({
                el : self.element
            })

            self.stage  = new Canvax.Display.Stage({
                id : "main",
                context : {
                   x : 0.5,
                   y : 0.5
                }
            });
            self.canvax.addChild( self.stage );

            self.stageTip = new Canvax.Display.Sprite({
                id      : 'tip'
            });

            self.core    = new Canvax.Display.Sprite({
                id      : 'core'
            });
            self.stageBg  = new Canvax.Display.Sprite({
                id      : 'bg'
            });

            self.stage.addChild(self.stageBg);
            self.stage.addChild(self.core);
            self.stage.addChild(self.stageTip);

        },
        draw:function(data, opt){
            var self = this;
            if( opt.rotate ) {
              self.rotate( opt.rotate );
            }
            self._initConfig(data, opt);               //初始化配置
            self._initModule(opt)                      //初始化模块                      
            self._initData();                          //初始化数据
            self._startDraw();                         //开始绘图
            self._drawEnd();                           //绘制结束，添加到舞台
          
            self._arguments = arguments;
            window.hoho = self;

        },
        clear:function(){
            var self = this
            self.stageBg.removeAllChildren()
            self.core.removeAllChildren()
            self.stageTip.removeAllChildren()
            // self.canvax.removeAllChildren()
        },
        rotate : function( angle ){
            var self = this;
            var currW = self.width;
            var currH = self.height;
            self.width  = currH;
            self.height = currW;

            _.each( self.stage.children , function( sprite ){
                sprite.context.rotation       = angle || -90;
                sprite.context.x              = ( currW - currH ) / 2 ;
                sprite.context.y              = ( currH - currW ) / 2 ;
                sprite.context.rotateOrigin.x = self.width  * sprite.context.$model.scaleX / 2;
                sprite.context.rotateOrigin.y = self.height * sprite.context.$model.scaleY / 2;
            });
        },
        reset:function(data, opt){
            var self = this
            self.clear()
            self.draw(data, opt)
        },
        _initConfig:function(data, opt){
            var self  = this;
            self.dataFrame = S.clone(self.dataFrameOrg)
            self.dataFrame.org = data;

            if(opt){
                self.config.mode = opt.mode || self.config.mode
                self._disXAxisLine    = (opt.disXAxisLine    || opt.disXAxisLine    == 0) ? opt.disXAxisLine    : self._disXAxisLine
                self._disYAxisTopLine = (opt.disYAxisTopLine || opt.disYAxisTopLine == 0) ? opt.disYAxisTopLine : self._disYAxisTopLine
                self._disYAndO        = (opt.disYAndO        || opt.disYAndO == 0       ) ? opt.disYAndO        : self._disYAndO
                var event = opt.event
                if(event){
                    self.config.event.enabled = event.enabled == 0 ? 0 : self.config.event.enabled
                }

                var yAxis = opt.yAxis
                if(yAxis){
                    self.dataFrame.yAxis.fields = yAxis.fields || self.dataFrame.yAxis.fields
                }

                var xAxis = opt.xAxis
                if(xAxis){
                    self.dataFrame.xAxis.field = xAxis.field || self.dataFrame.xAxis.field
                }
            }
        },

        _initModule:function(opt){
            var self  = this;
            self._xAxis  = new xAxis(opt.xAxis);
            self._yAxis  = new yAxis(opt.yAxis);
            self._back   = new Back(opt.back);
            self._graphs = new Graphs(opt.graphs);
            self._tips   = new Tips(opt.tips)
        },

        _initData:function(){
            var self = this;

            var total = []
            var arr = self.dataFrame.org

            for(var a = 0, al = arr[0].length; a < al; a++){
                var o = {}
                o.field = arr[0][a]
                o.index = a
                o.data  = []
                total.push(o)
            }

            for(var a = 1, al = arr.length; a < al; a++){
                for(var b = 0, bl = arr[a].length; b < bl; b++){
                    total[b].data.push(arr[a][b])
                }     
            }
            self.dataFrame.data = total
            //已经处理成[o,o,o]   o={field:'val1',index:0,data:[1,2,3]}

            var arr = self.dataFrame.data
            for(var a = 0, al = arr.length; a < al; a++){
                var o = arr[a]
                if(!self.dataFrame.xAxis.field){
                    if(a == 0){
                        self.dataFrame.xAxis.org = o.data
                    }
                    if(self.dataFrame.yAxis.fields.length == 0){
                        if(a != 0){
                            self.dataFrame.yAxis.org.push(o.data)
                        }
                    }else{
                        for(var b = 0, bl = self.dataFrame.yAxis.fields.length; b < bl; b++){
                            if(o.field == self.dataFrame.yAxis.fields[b]){
                                self.dataFrame.yAxis.org[b] = o.data
                            }
                        }
                    }
                }else{
                    if(o.field == self.dataFrame.xAxis.field){
                        self.dataFrame.xAxis.org = o.data
                    }
                    if(self.dataFrame.yAxis.fields.length == 0){
                        if(o.field != self.dataFrame.xAxis.field){
                            self.dataFrame.yAxis.org.push(o.data)
                        }
                    }else{
                        for(var b = 0, bl = self.dataFrame.yAxis.fields.length; b < bl; b++){
                            if(o.field == self.dataFrame.yAxis.fields[b]){
                                self.dataFrame.yAxis.org[b] = o.data
                            }
                        } 
                    }
                }
            }
        },
 
        _startDraw : function(){
            var self = this;
            // self.dataFrame.yAxis.org = [[201,245,288,546,123,1000,445],[500,200,700,200,100,300,400]]
            // self.dataFrame.xAxis.org = ['星期一','星期二','星期三','星期四','星期五','星期六','星期日']

            var arr = Tools.getChildsArr(self.dataFrame.yAxis.org)
            self.dataFrame.yAxis.section = DataSection.section(arr)

            self._baseNumber = self.dataFrame.yAxis.section[0]
            if(arr.length == 1){
                self.dataFrame.yAxis.section[0] = arr[0] * 2
                self._baseNumber = 0
            }

            self._chartWidth  = self.width  - 2 * self._disX
            self._chartHeight = self.height - 2 * self._disY

            self._yMaxHeight    = self._chartHeight - self._xAxis.h
            self._yGraphsHeight = self._yMaxHeight - self._getYAxisDisLine()
            self._trimYAxis()

            var x = self._disX
            var y = this.height - self._xAxis.h - self._disY

            self._yAxis.draw({
                data:self.dataFrame.yAxis.data
            });
            self._yAxis.setX(x), self._yAxis.setY(y)

            var _yAxisW = self._yAxis.w
            if(self.config.mode == 2){
                _yAxisW = 0
                self._disYAndO = 0
            }
            x = self._disX + _yAxisW + self._disYAndO

            self._xMaxWidth    = self._chartWidth - _yAxisW - self._disYAndO
            self._xGraphsWidth = self._xMaxWidth - self._getXAxisDisLine()
            self._disOriginX   = parseInt((self._xMaxWidth - self._xGraphsWidth) / 2)
            self._trimXAxis()
            self._xAxis.draw({
                w    :   self._xMaxWidth,
                max  :   {
                    left  : -(_yAxisW + self._disYAndO + self._disOriginX),
                    right : self._xGraphsWidth + self._disOriginX
                },
                data :   self.dataFrame.xAxis.data
            });
            self._xAxis.setX(x + self._disOriginX), self._xAxis.setY(y)

            self._back.draw({
                w    : self._chartWidth - _yAxisW - self._disYAndO,
                h    : y,
                xAxis:{
                    data:self.dataFrame.yAxis.data
                }
            });
            self._back.setX(x), self._back.setY(y)

            self.dataFrame.graphs.disX = self._getGraphsDisX()
            self._trimGraphs()
            self._graphs.draw({
                w    : self._xGraphsWidth,
                h    : self._yGraphsHeight,
                data : self.dataFrame.graphs.data,
                disX : self.dataFrame.graphs.disX
            })
            self._graphs.setX(x + self._disOriginX), self._graphs.setY(y)
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
        _trimYAxis:function(){
            var self = this
            var max = self.dataFrame.yAxis.section[self.dataFrame.yAxis.section.length - 1]
            var arr = self.dataFrame.yAxis.section
            var tmpData = []
            for (var a = 0, al = arr.length; a < al; a++ ) {
                var y = - (arr[a] - self._baseNumber) / (max - self._baseNumber) * self._yGraphsHeight
                y = isNaN(y) ? 0 : parseInt(y)                                                    
                tmpData[a] = { 'content':arr[a], 'y': y }
            }
            self.dataFrame.yAxis.data = tmpData
        },
        _getYAxisDisLine:function(){                   //获取y轴顶高到第一条线之间的距离         
            var self = this
            var disMin = self._disYAxisTopLine
            var disMax = 2 * disMin
            var dis = disMin
            dis = disMin + self._yMaxHeight % self.dataFrame.yAxis.section.length
            dis = dis > disMax ? disMax : dis
            return dis
        },

        _trimXAxis:function(){
            var self = this
            var max = self.dataFrame.xAxis.org.length
            var arr = self.dataFrame.xAxis.org
            var tmpData = []
            for (var a = 0, al  = arr.length; a < al; a++ ) {
                var o = {'content':arr[a], 'x':parseInt(a / (max - 1) * self._xGraphsWidth)}
                tmpData.push( o )
            }
            if(max == 1){
                o.x = parseInt(self._xGraphsWidth / 2)
            }
            self.dataFrame.xAxis.data = tmpData
        },
        _getXAxisDisLine:function(){                   //获取x轴两端预留的距离
            var self = this
            var disMin = self._disXAxisLine
            var disMax = 2 * disMin
            var dis = disMin
            dis = disMin + self._xMaxWidth % self.dataFrame.xAxis.org.length
            dis = dis > disMax ? disMax : dis
            dis = isNaN(dis) ? 0 : dis
            return dis
        },

        _trimGraphs:function(){
            var self = this                                                           
            var maxYAxis = self.dataFrame.yAxis.section[self.dataFrame.yAxis.section.length - 1]
            var maxXAxis = self.dataFrame.xAxis.org.length
            var arr = self.dataFrame.yAxis.org
            var tmpData = []
            for (var a = 0, al = arr.length; a < al; a++ ) {
                for (var b = 0, bl = arr[a].length ; b < bl; b++ ) {
                    !tmpData[a] ? tmpData[a] = [] : ''
                    var y = - (arr[a][b] - self._baseNumber) / (maxYAxis - self._baseNumber) * self._yGraphsHeight
                    y = isNaN(y) ? 0 : y
                    tmpData[a][b] = {'value':arr[a][b], 'x':b / (maxXAxis - 1) * self._xGraphsWidth,'y':y}
                }
            }
            if(maxXAxis == 1){
                if(tmpData[0] && tmpData[0][0]){
                    tmpData[0][0].x = parseInt(self._xGraphsWidth / 2)
                }
            }
            self.dataFrame.graphs.data = tmpData
        },
        //每两个点之间的距离
        _getGraphsDisX:function(){
            var self = this
            return self._xGraphsWidth / (self.dataFrame.xAxis.org.length - 1)
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
    };
    return Line;
} , {
    requires: [
        'dvix/',
        'dvix/utils/tools',
        'dvix/utils/datasection',
        'dvix/event/eventtype',
        'dvix/components/xaxis/xAxis',
        'dvix/components/yaxis/yAxis',
        'dvix/components/back/Back',
        'dvix/components/line/Graphs',
        'dvix/components/tips/Tips'
    ]
});
