KISSY.add("dvix/chart/mirrorbar/" , function(S, Dvix, Tools, DataSection, EventType, yAxis, Back, Graphs, Tips){
    /*
     *@node chart在dom里的目标容器节点。
    */
    var Canvax = Dvix.Canvax;
    window.Canvax = Canvax
    var Mirrorbar = function( node ){
        this.version       =  '0.1'                    //图表版本
        this.type          =  'mirrorbar';             //图表类型(镜像直方图)
        this.canvax        =  null;                    //Canvax实例
        this.element       =  null;                    //chart 在页面里面的容器节点，也就是要把这个chart放在哪个节点里
        this.width         =  0;                       //图表区域宽
        this.height        =  0;                       //图表区域高
        this.config        =  {
            mode       : 1,                            //模式( 1 = 正常(y轴在背景左侧) | 2 = 叠加(y轴叠加在背景上))[默认：1]
            dataSection:{
                maxPart: 9,
            },
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
                section    :  {
                    length :  2,                       //用来标识外部数据传入几个数组
                    org    :  [],                      //分段之后数据[1800,1200,600,0,600,1200,1800]
                    data   :  [],                      //如果length >= 2 分段之后数据, 第一个和最后一个已删除[1200,600,0,600,1200]
                                                       //如果length == 1 分段之后数据, 第一个和最后一个不删除[0,600,1200]
                    spanABS:  0,                       //跨度,第一个值的绝对值 + 最后一个值的绝对值 
                },
                data       :  []                       //坐标数据[{y:100,content:'100'},{y:200,content:'200'}] 与back.data相同但当config.yAxis.mode=2时    该值进行删减且重算，back.data不受影响
            },
            graphs     :{                              //图形
                data       :  [],                      //二维 数据集合等[[{x:0,y:-100},{}],[]]
                disX       :  0                        //每两个点之间的距离
            }
        }

        this._chartWidth   =  0;                       //图表渲染区域宽(去掉左右留空)
        this._chartHeight  =  0;                       //图表渲染区域高(去掉上下留空)

        this._disX         =  10;                      //图表区域离左右的距离
        this._disY         =  10;                      //图表区域离上下的距离
        this._disYAndO     =  6;                       //y轴原点之间的距离

        this._yMaxHeight   =  0;                       //y轴最大高
        this._yGraphsHeight=  0;                       //y轴第一条线到原点的高

        this._xMaxWidth    =  0;                       //x轴最大宽(去掉y轴之后)
        this._xGraphsWidth =  0;                       //x轴宽(去掉两端)

        this._baseNumber   =  0;                       //基础点

        this._yAxis        =  null;
        this._back         =  null;
        this._graphs       =  null;
        this._tips         =  null;

	   	this.init.apply(this , arguments);
    };

    Mirrorbar.prototype = {

        init:function(node){
            var self = this;
            self.element = node;
            self.width   = parseInt(node.width());
            self.height  = parseInt(node.height());
          
            self.canvax = new Canvax({
                el : self.element
            })

            self.stageTip = new Canvax.Display.Stage({
                id      : 'tip',
                context : {
                    x : 0.5,
                    y : 0.5
                }
            });

            self.stage = new Canvax.Display.Stage({
                id      : 'core',
                context : {
                    x : 0.5,
                    y : 0.5
                }
            });
            self.stageBg = new Canvax.Display.Stage({
                id      : 'bg',
                context : {
                    x : 0.5,
                    y : 0.5
                }
            });
        },
        draw:function(data, opt){
            var self = this;
            self._initConfig(data, opt);               //初始化配置
            self._initModule(opt)                      //初始化模块                      
            self._initData();                          //初始化数据
            self._startDraw();                         //开始绘图
            self._drawEnd();                           //绘制结束，添加到舞台
        },
        _initConfig:function(data, opt){
            var self  = this;
            self.dataFrame.org = data;

            if(opt){
                self.config.mode = opt.mode || self.config.mode
                self._disX     = opt.disX      || self._disX
                self._disY     = opt.disY      || self._disY
                self._disYAndO = (opt.disYAndO || opt.disYAndO == 0) ? opt.disYAndO : self._disYAndO
                var event = opt.event
                if(event){
                    self.config.event.enabled = event.enabled == 0 ? 0 : self.config.event.enabled
                }

                var yAxis = opt.yAxis
                if(yAxis){
                    self.dataFrame.yAxis.fields = yAxis.fields || self.dataFrame.yAxis.fields
                }
            }
        },

        _initModule:function(opt){
            var self  = this;
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
            }
        },
 
        _startDraw : function(){
            var self = this;
            self._trimSection()

            self._chartWidth  = self.width  - 2 * self._disX
            self._chartHeight = self.height - 2 * self._disY

            self._yMaxHeight    = self._chartHeight
            self._yGraphsHeight = self._yMaxHeight
            self._trimYAxis()

            var x = self._disX
            var y = self.height - self._disY

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
            self._xGraphsWidth = self._xMaxWidth

            self._back.draw({
                w    : self._chartWidth - _yAxisW - self._disYAndO,
                h    : y,
                xAxis:{
                    data:self.dataFrame.yAxis.data
                }
            });
            self._back.setX(x), self._back.setY(y)

            return
            self._trimGraphs()
            self._graphs.draw({
                w    : self._xGraphsWidth,
                h    : self._yGraphsHeight,
                data : self.dataFrame.graphs.data,
                disX : self.dataFrame.graphs.disX
            })
            self._graphs.setX(x), self._graphs.setY(y)
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

        _trimSection:function(){                       //调整Section各数据
            var self = this
            self.dataFrame.yAxis.section.length  = self.dataFrame.yAxis.org.length
            self.dataFrame.yAxis.section.org     = self._getSection()
            if(self.dataFrame.yAxis.section.length >= 2){
                var arr = S.clone(self.dataFrame.yAxis.section.org)
                var spanABS = Math.abs(arr.shift()) +  Math.abs(arr.pop())
                self.dataFrame.yAxis.section.data = arr
                self.dataFrame.yAxis.section.spanABS = spanABS
            }else{
                self.dataFrame.yAxis.section.data = S.clone(self.dataFrame.yAxis.section.org)
            }
            console.log(self.dataFrame.yAxis.section)
        },

        _getSection:function(){                        //获取处理后的y轴数据(原始包含两端最大值的数组)
            var self = this
            var section = []
            var arr = self.dataFrame.yAxis.org
            var maxPart = parseInt((self.config.dataSection.maxPart - 1) / 2)


            console.log(DataSection.section([0,0,0,0,0,0], maxPart, {mode:1}))

            if(arr.length >= 2){
                var section1 = DataSection.section(arr[0], maxPart, {mode:1})
                var section2 = DataSection.section(arr[1], maxPart, {mode:1})

                var max1 = section1[section1.length - 1]
                var max2 = section2[section2.length - 1]

                if(max1 >= max2){
                    section2 = S.clone(section1)
                }else{
                    section1 = S.clone(section2)
                }

                if(section1[0] == 0){
                    section2.shift()
                }else{
                    section2.unshift(0)
                }     
                section2.sort(function(a,b){return b-a;})

                section = section2.concat(section1)
            }else{
                section = DataSection.section(arr[0], maxPart, {mode:1})

            }
            console.log('section = ' + section)
            return section
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

        _drawEnd:function(){
            var self = this;
            self.stageBg.addChild(self._back.sprite)

            self.stage.addChild(self._graphs.sprite);
            self.stage.addChild(self._yAxis.sprite);

            self.stageTip.addChild(self._tips.sprite)
         
            self.canvax.addChild(self.stageBg);
            self.canvax.addChild(self.stage);
            self.canvax.addChild(self.stageTip)
        },

        _onInduceHandler:function($evt){
            var self = this
            var strokeStyles = self._graphs.line.strokeStyle.overs
            var context = self._tips.opt.context
            var disTop = self._tips.opt.disTop
            var iGroup = $evt.info.iGroup, iNode = $evt.info.iNode

            var x = parseInt($evt.info.nodeInfo.stageX), y = parseInt(disTop)
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

            var tips = {
                w    : self.width,
                h    : self.height
            }
            tips.tip = {
                x    : x,
                y    : y,
                data : data
            }

            var yEnd = self._graphs.getY() - disTop
            tips.line = {
                x    : x,
                y    : parseInt(self._graphs.getY()),
                yEnd : -yEnd
            }

            var data = []
            var arr = $evt.info.nodesInfoList
            for(var a = 0, al = arr.length; a < al; a++){
                var o = {
                    x         : parseInt(arr[a].stageX),
                    y         : parseInt(arr[a].stageY),
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
    return Mirrorbar;
} , {
    requires: [
        'dvix/',
        'dvix/utils/tools',
        'dvix/utils/datasection',
        'dvix/event/eventtype',
        'dvix/components/yaxis/yAxis',
        'dvix/components/back/Back',
        'dvix/components/line/Graphs',
        'dvix/components/tips/Tips'
    ]
});
