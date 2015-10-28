define(
    "chartx/chart/original/planet",
    [
        'chartx/chart/index',
        "canvax/shape/Rect",
        'chartx/utils/tools',
        'chartx/utils/gradient-color',
        'chartx/utils/datasection',
        'chartx/utils/dataformat',
        'chartx/chart/original/planet/graphs',
        'chartx/chart/original/planet/xaxis',
        'chartx/components/tips/tip',
    ],
    function(Chart, Rect,Tools, GradientColor, DataSection, DataFormat, Graphs, XAxis, Tip){
        /*
         *@node chart在dom里的目标容器节点。
        */
        var Canvax = Chart.Canvax;
    
        return Chart.extend( {
    
            init:function(node, data, opts){
                this.event         = {
                    This    : this,
                    enabled : 1,
                    listener   : this._listener
                }

                this.cx            = '';                    //圆心
                this.cy            = ''
                this.initCX        = 60                     //默认圆心

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
                        maxYData:  []                                //行星,每个环上最大高度集合(不算core)(去除2个半径 最高和最低),[60, 50, 50]
                    }
                }
                this.graphs        = {
                    disY        : 4,                                 //行星与容器上、下之间的最小距离
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
                    },
                    text        :  {
                        fillStyle: {
                            normal : '#ff0000'
                        }
                    }
                },
                this.back          = {
                    // enableds:  [],                               //哪些环显示,对应data长度[1,0,1,0](1 = 显示 | 0 不显示)
                    ringDis     :  10,                             //环和环之间的距离
                    space       :  '',                             //在该距离内的环不予显示
                    fillStyle   :  {
                        first   :  '#e5dfec',
                        last    :  '#faf6ff',
                        normals :  []
                    },
                    strokeStyle :  {
                        normals :  ['#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff']
                    }
                }
                
                this._bg           =  null;
                this._back         =  null;
                this._xAxis        =  null;
                this._graphs       =  null;
                this._tip          =  null;

                _.deepExtend(this, opts);

                data = this._trimData(data)

                this.dataFrame.org = data

                _.deepExtend(this.dataFrame, this._initData(data, opts));

                // return
                this.cx = this.cx != '' ? this.cx : this.initCX, this.cy = this.cy != '' ? this.cy : parseInt(this.height / 2)

                this._countData()
            },
            draw:function(){
                this.stageCore   = new Canvax.Display.Sprite({
                    id      : 'core'
                });
                this.stageBg     = new Canvax.Display.Sprite({
                    id      : 'bg'
                });
                this.stageTip = new Canvax.Display.Sprite({
                    id      : 'tip'
                });
    
                this.stage.addChild(this.stageBg);
                this.stage.addChild(this.stageCore);
                this.stage.addChild(this.stageTip);

                if( this.rotate ) {
                    this._rotate( this.rotate );
                }
                this._initModule();                        //初始化模块  
    
                this._startDraw();                         //开始绘图
    
                this._drawEnd();                           //绘制结束，添加到舞台

                this.inited = true;
              
            },
            _initData:DataFormat,
            _initModule:function(){
                this._bg     = new Canvax.Display.Sprite();
                this._back   = new Graphs(this.back, this);
                this._xAxis  = new XAxis(this.xAxis.bar, this)
                this._graphs = new Graphs(this.graphs, this);
                this._tip    = new Tip(this.tips, this.canvax.getDomContainer());
            },
            _trimData:function(data){                      //调整数据
                var self = this
                var arr = []

                var n = _.indexOf(data[0], self.xAxis.field)
                for(var a = 0, al = data.length; a < al; a++){
                    if(!isNaN(data[a][n])){
                        var index = parseInt(data[a][n])
                        !arr[index] ? arr[index] = [] : -1
                        arr[index].push(data[a])
                    }
                }
                arr = _.flatten(arr,true)
                arr = _.compact(arr) 
                var index = 0
                var curIndex = 0
                for(var a = 0, al = arr.length; a < al; a++){
                    var orgIndex = parseInt(arr[a][n])
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
                        strokeStyle : {normal:self.back.strokeStyle.normals[xDataOrg[a] - 1]}
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
                    // var r = self.graphs.minR + Math.abs((self.dataFrame.graphs.maxR - self.graphs.minR)) * scale
                    var r = self.graphs.minR + self.dataFrame.graphs.maxR * scale
                        r = Math.round(r)
                        if(r > self.dataFrame.graphs.maxR){
                            r = self.dataFrame.graphs.maxR
                        }
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
                        text       : {content:content, fillStyle:{normal:self.graphs.text.fillStyle.normal}}
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
                    // console.log(r)
                    var dis = r - maxRdata[a] * 2 - self.graphs.disY * 2
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
                    var tmpIndex = 0
                    for(var a = 1, al = graphsData.length; a < al; a++){
                        for(var b = 0, bl = graphsData[a].length; b < bl; b++){
                            var o = graphsData[a][b]
                            var index = a - 1
                            var r = self.dataFrame.back.rdata[index]
                            var y = tmpData[tmpIndex].y
                            var h = y - self.cy
                            o.x = self.cx + self._getDisForRH(r,h), o.y = y
                            o.ringID = a, o.ID = (b + 1), o.orgData = self.dataFrame.orgData[a][b]
                            o.fillStyle = {normal:self._getGraphsFillStyle(o)}
                            // o.text = {content:numData[tmpIndex]}
                            tmpIndex++
                        }
                    }
                }else{                                               //上下错开排列
                                                                          //同一环中最多有几个行星
                    var max = Tools.getMaxChildArrLength(self.dataFrame.orgData) 
                                                                          //y轴分段
                    var yAg = max * 2 + 5
                    var yAgs=_.range(1, yAg + 1)
                    var yc  = parseInt(yAg / 2) + 1
                    // var order = [yc + parseInt((yc - 1) * (yc - 1) / yc), yc, yc - parseInt((yc - 1) * (yc - 2) / yc), yc + parseInt((yc - 1) * (yc - 2) / yc), yc - parseInt((yc - 1) * (yc - 1) / yc)]
                    var order = [yc + parseInt(yc/2), yc, yc - parseInt(yc/2)]
                    // console.log(order)
                    var orderlen = order.length
                    var groups = []
                    var places = [[0]]
                    // console.log('yAg :' + yAg)
                    // console.log('yAgs :' + yAgs)
                    for(var a = 1, al = graphsData.length; a < al; a++){
                        for(var b = 0, bl = graphsData[a].length; b < bl; b++){
                            var o = graphsData[a][b]
                            var index = a - 1
                            var prePlaces = _.flatten(places[a - 1]).concat(_.flatten(places[a]))
                            var place = self._getPlace(prePlaces, yAgs, order[(index + 1) % orderlen], (b % 2 ? true : false))
                            var scale = (place - 1) / (yAg -1)
                            var y = self.cy - (maxYData[index] / 2) + scale * maxYData[index]
                            var r = self.dataFrame.back.rdata[index]
                            var h = y - self.cy
                            o.x = self.cx + self._getDisForRH(r,h), o.y = y         //行星往环上靠
                            o.ringID = a, o.ID = (b + 1), o.orgData = self.dataFrame.orgData[a][b]
                            o.fillStyle = {normal:self._getGraphsFillStyle(o)}

                            // o.text = {content:place}
                            !places[a] ? places[a] = [] : -1
                            places[a].push(place)
                        }
                    }
                    // console.log(places)
                }
            },
            _without:function($arr,$values){
                var arr = _.clone($arr)
                for(var a = 0, al = $values.length; a < al; a++){
                    arr = _.without(arr,$values[a])
                }
                return arr
            },
            _getPlace:function(prePlaces, curPlaces, place, b){
                var self = this
                // console.log('------------------------')
                // console.log(prePlaces,b)
                // console.log(curPlaces)
                var n = ''
                // console.log(prePlaces,':',curPlaces,':',place)
                if(_.indexOf(prePlaces, place) == -1){
                    n = place
                }else{
                    var curPlaces = self._without(curPlaces, prePlaces)
                    // console.log('curPlaces ' + curPlaces)
                    /*
                    var dis = 0
                    if(curPlaces.length % 2 == 0){
                        var index = curPlaces.length / 2
                    }else{
                        var index = (curPlaces.length - 1) / 2
                    }
                    n = curPlaces[index - 1]
                    */
                    if(b){
                        var index = 1
                    }else{
                        var index = curPlaces.length - 1
                    }
                    n = curPlaces[index - 1]
                }
                // console.log(n)
                return n
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

                self._xAxis.draw({
                    width: self.width
                })

                self._graphs.draw({
                    data : self.dataFrame.graphs.data,
                    event: {enabled : self.event.enabled}
                })
            },
    
            _drawEnd:function(){
                this.stageBg.addChild(this._bg)
                this.stageBg.addChild(this._back.sprite)
                this.stageBg.addChild(this._xAxis.sprite), this._xAxis.gradient()
                this.stageCore.addChild(this._graphs.sprite);
                this.stageTip.addChild(this._tip.sprite);
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
                // r = parseInt((self.dataFrame.back.ringAg - self.back.ringDis) / 2)
                r = parseInt((self.dataFrame.back.ringAg) / 2)
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

            _listener:function(o){
                var self = this.This                            //this = this.event
                if(o.ringID != 0){
                    o.orgData = self._getOrgData(o.ringID, o.ID)
                }
                this.on(o)
                var e = o.target
                e.tipsInfo = {
                    ringID : o.ringID,
                    ID     : o.ID,
                    orgData: o.orgData
                }
                if(_.isObject(self.tips)){
                    if(o.eventType == 'mouseover'){
                        self._tip.show(e);
                    }else if(o.eventType == 'mousemove'){
                        self._tip.move(e);
                    }else if(o.eventType == 'mouseout'){
                        self._tip.hide(e);
                    }
                }
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
