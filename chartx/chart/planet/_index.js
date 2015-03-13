define(
    "chartx/chart/planet/index",
    [
        'chartx/chart/index',
        "canvax/shape/Rect",
        'chartx/utils/tools',
        'chartx/utils/gradient-color',
        'chartx/utils/datasection',
        'chartx/utils/dataformat',
        'chartx/components/planet/Graphs',
        './tips'
    ],
    function(Chart, Rect,Tools, GradientColor, DataSection, DataFormat, Graphs, Tips){
        /*
         *@node chart在dom里的目标容器节点。
        */
        var Canvax = Chart.Canvax;
    
        return Chart.extend( {
    
            init:function(node, data, opts){
                this.event         = {
                    This    : this,
                    enabled : 1,
                    onClick   : this._click
                }

                this.cx            = '';                    //圆心
                this.cy            = ''
                this.initCX        = 60                     //默认圆心
                this.ringDis       = 10                     //环和环之间的距离     

                this.dataFrame     = {                      //数据格式
                    org     :      [],                          //原始数据 经trimData之后
                    orgData :      [],                          //原始数据转三维数组 方便交互数据
                    data    :      [],                          //经_initData之后的数据
                    back    :      {
                        rings   :  0,                                //分组(有几个环)
                        ringAg  :  0,                                //环与环之间距离的平均值
                        rdata   :  [],                               //实际半径集合(不算core)
                        data    :  []                                //根据此值绘制背景(不算core),[{},{},{}]
                        // minRdata:  [],                               //根据graphs.maxRdata计算得到的每个环最小的半径集合[]
                    },
                    graphs  :      {
                        data    :  [],                               //二维, 根据此值绘制各圆(算core),[[{},{},...],[...],[...]]
                        maxR    :  0,                                //行星最大直径
                        rdata   :  [],                               //行星,所有行星半径集合(不算core),[60, 50, 50, 40]
                        maxRdata:  [],                               //行星,每个环上最大行星半径集合(不算core),[60, 50, 50]
                        maxYdata:  []                                //行星,每个环上最大高度集合(不算core)(去除2个半径 最高和最低),[60, 50, 50]
                    }
                }
                this.graphs        = {
                    minR        : 1,
                    maxR        : 100,
                    layout      : {
                        mode    : 0                                  //模式(0 = 根据yAxis.field计算比例  |  1 = 上下错开)
                    },
                    core        : {
                        r       : {
                            normal:60
                        },
                        fillStyle : {
                            normal: '#70639c'
                        },
                        text    :{
                            content : '品牌',
                            place   : 'center',
                            fillStyle : {
                                normal : '#ffffff'
                            }
                        }
                    },
                    fillStyle   :  {
                        dNormals:  '#b28fce',                        //默认配色
                        normals :  '#b28fce',                        //自定义配色
                        overs   :  ['#ff0000','#ff9900','#ffff00','#009900','#00ff00','#0000ff','#660099']
                    }
                },
                this.back          = {
                    // enableds:  [],                               //哪些环显示,对应data长度[1,0,1,0](1 = 显示 | 0 不显示)
                    space       :  '',                             //在该距离内的环不予显示
                    fillStyle   :  {
                        first   :  '#e5dfec',
                        last    :  '#faf6ff',
                        normals :  [],
                    },
                    strokeStyle :  {
                        normals :  ['#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff']
                    }
                }
                
                this._bg           =  null;
                this._back         =  null;
                this._graphs       =  null;
                this._tips         =  null;

                _.deepExtend(this, opts);

                data = this._trimData(data)

                this.dataFrame.org = data

                _.deepExtend(this.dataFrame, this._initData(data, opts));

                // return
                this.cx = this.cx != '' ? this.cx : this.initCX, this.cy = this.cy != '' ? this.cy : parseInt(this.height / 2)

                this._countData()
            },
            draw:function(){
                // this.stageTip = new Canvax.Display.Sprite({
                //     id      : 'tip'
                // });
                this.stageCore   = new Canvax.Display.Sprite({
                    id      : 'core'
                });
                this.stageBg     = new Canvax.Display.Sprite({
                    id      : 'bg'
                });
    
                this.stage.addChild(this.stageBg);
                this.stage.addChild(this.stageCore);
                // this.stage.addChild(this.stageTip);

                if( this.rotate ) {
                    this._rotate( this.rotate );
                }
                this._initModule();                        //初始化模块  
    
                this._startDraw();                         //开始绘图
    
                this._drawEnd();                           //绘制结束，添加到舞台
              
                this._arguments = arguments;
    
            },
            _initData:DataFormat,
            _initModule:function(){
                this._bg     = new Canvax.Display.Sprite();
                this._back   = new Graphs(this.back, this);
                this._graphs = new Graphs(this.graphs, this);
                // this._tips   = new Tips(this.tips , this.dataFrame , this.canvax.getDomContainer());
            },
            _trimData:function(data){                      //调整数据
                var self = this
                var arr = []

                var n = _.indexOf(data[0], self.xAxis.field)
                for(var a = 0, al = data.length; a < al; a++){
                    if(!isNaN(data[a][n])){
                        !arr[data[a][n]] ? arr[data[a][n]] = [] : -1
                        arr[data[a][n]].push(data[a])
                    }
                }
                arr = _.flatten(arr,true)
                arr = _.compact(arr) 
                var index = 0
                var curIndex = 0
                for(var a = 0, al = arr.length; a < al; a++){
                    var orgIndex = arr[a][n]
                    if(curIndex != orgIndex){
                        curIndex = orgIndex
                        index++ 
                    }
                    arr[a][n] = index
                }
                arr.unshift(data[0])
                return arr
            },                                    
            _countData:function(){                         //计算数据
                var self = this
                                                           //原始数据转二维数组 方便交互数据
                var org = self.dataFrame.org, orgData = []
                var indexData = self._getDataFromOrg(self.xAxis.field)
                for(var a = 0, al = org.length; a < al; a++){
                    var index = indexData[a]
                    if(index){
                       !orgData[index] ? orgData[index] = [] : -1 
                       orgData[index].push(org[a + 1])
                    }
                }
                self.dataFrame.orgData = orgData       
                //-------------------------------------------原始数据转二维数组

                var backData = []
                
                var xDataOrg = self.dataFrame.xAxis.org[0] //初步规划背景数据结构    
                for(var a = 0, al = xDataOrg.length; a < al; a++){
                    !backData[xDataOrg[a]] ? backData[xDataOrg[a]] = [] : -1
                    var o = {
                        x           : self.cx,
                        y           : self.cy,
                        r           : {normal:125 * (a + 1)},
                        fillStyle   : {normal:''},
                        lineWidth   : {normal:2},
                        strokeStyle : {normal:self.back.strokeStyle.normals[xDataOrg[a] - 1]},
                        // enabled     : self.back.enableds[xDataOrg[a] - 1]
                    }
                    if(backData[xDataOrg[a]].length < 1){
                        backData[xDataOrg[a]].push(o)
                    }
                }
                
                if(!backData[0]){                               //背景有多少个环
                    backData.shift()
                    self.dataFrame.back.rings = backData.length
                }
                                                                //转一维数组
                self.dataFrame.back.data   = Tools.getChildsArr(backData)
                                                                //计算环与环之间距离的平均值
                self.dataFrame.back.ringAg = self._getBackRingAverage()

                var backData = self.dataFrame.back.data, rdata = [], ringAg = self.dataFrame.back.ringAg
                for(var a = 0, al = backData.length; a < al; a++){
                    rdata[a] = self.graphs.core.r.normal + ringAg * (a + 1)
                }
                self.dataFrame.back.rdata = rdata               //得到实际每个环的半径
                                                           //完成背景数据结构
                self.back.fillStyle.normals = new GradientColor(self.back.fillStyle.first, self.back.fillStyle.last,self.dataFrame.back.rings + 1)
                var enIndex = 0
                for(var a = 0, al = backData.length; a < al; a++){
                    var o = backData[a]
                    o.r = {normal:rdata[a]}
                    o.fillStyle = {normal:self.back.fillStyle.normals[a]}
                    if(a != 0){
                        if((a - enIndex) * ringAg > self.back.space){       //间隔显示环
                            enIndex = a
                        }else{
                            o.enabled = 0
                        }
                    }
                }
                //-------------------------------------------完成背景
                // self.graphs.fillStyle.normals = new GradientColor('#ff0000','#ffffff',self.dataFrame.back.rings)
                self.dataFrame.graphs.maxR  = self._getPlanetMaxR()
                                                                //环大小
                var numData = self._getDataFromOrg(self.graphs.size.field)
                var scaleData = Tools.getArrScalesAtArr(numData, Tools.getMaxAtArr(_.clone(numData)))
                var rdata = []
                for(var a = 0, al = scaleData.length; a < al; a++){
                    var scale = scaleData[a]
                    var r = self.graphs.minR + (self.dataFrame.graphs.maxR - self.graphs.minR) * scale
                        r = Math.round(r)
                    rdata.push(r)
                }
                self.dataFrame.graphs.rdata = rdata             //完成环大小

                                                                //初步规划行星数据结构
                var graphsData = [], maxRdata = []

                for(var a = 0, al = xDataOrg.length; a < al; a++){
                   !graphsData[xDataOrg[a]] ? graphsData[xDataOrg[a]] = [] : -1
                    var r = rdata[a]
                    var content = self._getDataFromOrg(self.graphs.info.field,a)[self.graphs.info.content]
                    var o = {
                        x          : a * 100,
                        y          : 100,
                        r          : {normal:r},
                        fillStyle  : {normal:self.graphs.fillStyle.normals[xDataOrg[a] - 1]},
                        text       : {content:content}
                    }
                    graphsData[xDataOrg[a]].push(o)

                                                                //每个环上最大行星半径集合    
                    !maxRdata[xDataOrg[a]] ? maxRdata[xDataOrg[a]] = [] : -1
                    maxRdata[xDataOrg[a]].push(r)                    //这个时候的maxRdata是一个二维数组[[],[]]
                    if(maxRdata[xDataOrg[a]].length > 1){           
                        var max = Tools.getMaxAtArr(maxRdata[xDataOrg[a]])
                        maxRdata[xDataOrg[a]] = [max]                //maxRdata转成一维数组
                    }
                }
                if(!graphsData[0]){                        
                    graphsData[0] = []
                    var o = {                                   //第一个品牌环
                        x          : self.cx,
                        y          : self.cy,
                        r          : {normal:self.graphs.core.r.normal},
                        fillStyle  : {normal:self.graphs.core.fillStyle.normal},
                        text       : self.graphs.core.text,
                        event      : {
                            enabled  : 0
                        }
                    }
                    graphsData[0].unshift(o)

                    maxRdata.shift()                            //完成每个环上最大行星半径集合
                }
                self.dataFrame.graphs.data  = graphsData
                self.dataFrame.graphs.maxRdata = Tools.getChildsArr(maxRdata)
                                                                //每个环上最大高度集合
                var maxYData = [], rdata = self.dataFrame.back.rdata, maxRdata = self.dataFrame.graphs.maxRdata
               
                for(var a = 0, al = rdata.length; a < al; a++){
                    var r = 2 * rdata[a] > self.height ? self.height : rdata[a]
                    r = 2 * r < self.height ? 2 * r : r
                    var dis = r - maxRdata[a] * 2 - 2 * 2
                    maxYData.push(dis)
                }
                self.dataFrame.graphs.maxYData = maxYData       //完成每个环上最大高度集合
 
                                                                //计算行星y
                var tmpData  = []
                if(self.graphs.layout.mode == 0){
                                                                     //y
                    var numData = self._getDataFromOrg(self.yAxis.field)
                                                                     //平均值 =平均值的numData[a]  y位于self.cy
                    var numAg   = Tools.getArrMergerNumber(numData) / numData.length 
                    var exAgMax  = 0                                      //大于平均值的最大值 
                    var exAgData = []                                     //大于平均值的集合
                    for(var a = 0, al = xDataOrg.length; a < al; a++){
                        var index = xDataOrg[a] - 1
                        var num = numData[a]
                            // num = num > 2 * numAg ? 2 * numAg : num
                        var y = self.cy + (numAg - num) / numAg * (maxYData[index] / 2)
                        if(num > 2 * numAg){
                            exAgMax = exAgMax < (num - numAg) ? (num - numAg) : exAgMax
                        }
                        if(num > numAg){                                  //位于self.cy之上
                            exAgData[a] = 1
                        }
                        tmpData[a] = {y:y}
                    }                                                     //self.cy上的做y比列计算
                    for(var a = 0, al = exAgData.length; a < al; a++){
                        var b = exAgData[a]
                        var index = xDataOrg[a] - 1
                        var num = numData[a]
                        if(b && exAgMax != 0){
                            tmpData[a].y = self.cy - (num - numAg)/ exAgMax * (maxYData[index] / 2)
                        }
                    }
                }else{                                               //上下错开排列
                                                                          //同一环中最多有几个行星
                    var max = Tools.getMaxChildArrLength(self.dataFrame.orgData) 
                                                                          //y轴分段
                    var yAg = max * 2 + 3
                    var yAgs=_.range(1,yAg + 1)
                    var yc  = parseInt(yAg / 2) + 1
                    var order = [yc + parseInt(yc/2), yc, yc - parseInt(yc/2)]
                    var orderlen = order.length
                    var groups = []
                    var places = []
                        places[0] = [0]
                    for(var a = 0, al = xDataOrg.length; a < al; a++){
                        var index = xDataOrg[a] - 1
                        var place = order[(index + 1) % orderlen]
                        var scale = (place - 1) / (yAg -1)
                        tmpData[a] = {}
                        tmpData[a].y = self.cy - (maxYData[index] / 2) + scale * maxYData[index]

                        if(xDataOrg[a - 1] && index == xDataOrg[a - 1] - 1){
                            // console.log(index + 1)
                            !groups[index + 1] ? groups[index + 1] = [] : -1
                            if(groups[index + 1].length == 0){
                                groups[index + 1].push(tmpData[a - 1])
                            }
                            groups[index + 1].push(tmpData[a])

                        }

                        !places[index + 1] ? places[index + 1] = [] : -1
                        places[index + 1].push(place)
                    }
                    var tmpIndex = -1
                    for(var a = 0, al = places.length; a < al; a++){
                        if(places[a].length > 1){
                            places[a] = self._getPlace(self._without(yAgs, places[a-1]), places[a].length, 1)
                            // console.log('-----------------------------')
                            for(var b = 0, bl = places[a].length; b < bl; b++){
                                var o = tmpData[tmpIndex]
                                var scale = (places[a][b] - 1) / (yAg -1)
                                o.y = self.cy - (maxYData[a - 1] / 2) + scale * maxYData[a - 1]
                                // console.log(places[a][b], o.y)
                                tmpIndex++
                            }
                        }else{
                            tmpIndex++
                        }
                    }
                }
                                                                //行星往环上靠
                for(var a = 0, al = tmpData.length; a < al; a++){
                    var o = tmpData[a]
                    var index = xDataOrg[a] - 1
                    var r = self.dataFrame.back.rdata[index]
                    var h = o.y - self.cy
                    o.x = self.cx + self._getDisForRH(r,h)
                    // o.x = self.dataFrame.back.rdata[a]
                }

                var tmpIndex = 0
                for(var a = 0, al = graphsData.length; a < al; a++){
                    for(var b = 0, bl = graphsData[a].length; b < bl; b++){
                        var o = graphsData[a][b]
                        if(a > 0){
                            // o.x = self.cx + self.dataFrame.back.rdata[a - 1]
                            o.x = tmpData[tmpIndex].x
                            o.y = tmpData[tmpIndex].y
                            // o.text = {content:numData[tmpIndex]}  //测试
                            tmpIndex++
                        }
                    }
                }
                                                           //行星颜色(不算core)
                for(var a = 1, al = graphsData.length; a < al; a++){
                    for(var b = 0, bl = graphsData[a].length; b < bl; b++){
                        var o = graphsData[a][b]
                        o.ringID = a, o.ID = (b + 1), o.orgData = self.dataFrame.orgData[a][b]
                        o.fillStyle = {normal:self._getGraphsFillStyle(o)}
                    }
                }
            },
            _without:function($arr,$values){
                var arr = _.clone($arr)
                for(var a = 0, al = $values.length; a < al; a++){
                    arr = _.without(arr,$values[a])
                }
                return arr
            },
            _getPlace:function($arr,$n,$place){
                var arr = []
                // $arr = [1,2,3,4,5]
                if($place == 1){                           //从两端开始排序
                    var index = 0
                    var b = true
                    for(var a = 0, al = $arr.length; a < al; a++){
                        if(b){
                            arr.push($arr[index])
                            index++
                        }else{
                            arr.push($arr[$arr.length - index])
                        }
                        b = !b
                    }
                }
                // }//else if($place == 2){                     //从中间开始排序
                //     var index = parseInt(arr.length / 2)
                //     console.log('index ' + index)
                // //}
                // console.log(arr)

                arr.length = $n
                // console.log(arr)
                return arr
            },
            _startDraw : function(){
                var self = this;
                var rect  = new Rect({
                        context:{
                            width       : self.width,
                            height      : self.height,
                            fillStyle   : self.back.fillStyle.last
                        }
                })
                self._bg.addChild(rect)

                self._back.draw({
                    data : self.dataFrame.back.data.reverse(),
                    event: {enabled : 0}
                }) 

                self._graphs.draw({
                    data : self.dataFrame.graphs.data,
                    event: {enabled : self.event.enabled}
                })
            },
    
            _drawEnd:function(){
                this.stageBg.addChild(this._bg)
                this.stageBg.addChild(this._back.sprite)
                this.stageCore.addChild(this._graphs.sprite);
                // this.stageTip.addChild(this._tips.sprite);
            },

            _getDataFromOrg:function(field,index){         //从原始数据中获取数据 该原始数据是_initData之后的(返回：具体值 | 数组)
                var self = this
                var data = self.dataFrame.data
                for(var a = 0, al = data.length; a < al; a++){
                    var o = data[a]
                    if(o.field == field){
                        if(isNaN(index)){
                            return o.data
                        }
                        if(o.data[index]){
                            return o.data[index]
                        }       
                    }
                }
            },
            _getPlanetMaxR:function(){                     //获取行星最大半径
                var self = this
                var r = 0
                r = parseInt((self.dataFrame.back.ringAg - self.ringDis) / 2)
                r = self.graphs.maxR < r ? self.graphs.maxR : r
                return r
            },
            _getBackRingAverage:function(){                //获取背景中环与环之间的距离均值
                var self = this
                return parseInt((self.width - self.initCX - self.graphs.core.r.normal) / (self.dataFrame.back.rings + 0.5))
            },
            _getDisForRH:function(r,h){                    //已知半径,高度,计算出圆心x到点x的距离
                return Math.sin( Math.acos( h/r ) ) * r 
            },

            _click:function(o){
                var self = this.This                            //this = this.event
                if(o.ringID != 0){
                    o.orgData = self._getOrgData(o.ringID, o.ID)
                }
                this.on(o)
            },
            _getOrgData:function(ringID, ID){              //根据ringID,ID获取原始数据
                var self = this
                var orgData = self.dataFrame.orgData
                return orgData[ringID][ID - 1]
            },
            _getGraphsFillStyle:function(o){
                //o.ringID = 哪个环(从1开始)  o.ID = 环上的哪个行星(从1开始) o.orgData = 原始数据(一维数据)
                var self = this
                var fillStyle = '';
                if( _.isArray(self.graphs.fillStyle.normals)){
                    fillStyle = self.graphs.fillStyle.normals[o.ringID - 1]
                }
                if( _.isFunction(self.graphs.fillStyle.normals)){
                    fillStyle = self.graphs.fillStyle.normals(o);
                }
                if(_.isString(self.graphs.fillStyle.normals)){
                    fillStyle = self.graphs.fillStyle.normals
                }
                if( !fillStyle || fillStyle == "" ){
                    fillStyle = self.graphs.fillStyle.dNormals[o.ringID - 1]
                }
                return fillStyle;
            }
        });
    
    } 
);
