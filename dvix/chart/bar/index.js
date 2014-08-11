KISSY.add(function(S, Dvix, Tools, DataSection, EventType, xAxis, yAxis, Back, Graphs, Tips){
    /*
     *@node chart在dom里的目标容器节点。
    */
    var Canvax = Dvix.Canvax;
    window.Canvax = Canvax
    var Line = function( node ){
        this.version       =  '0.1'                    //图表版本
        this.type          =  'bar';                  //图表类型(折线图)
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
        this.disYAndO      =  6;                       //y轴原点之间的距离


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
            this.element = node;
            this.width   = parseInt(node.width());
            this.height  = parseInt(node.height());

            this.canvax = new Canvax({
                el : this.element
            })

            this.stage  = new Canvax.Display.Stage({
                id : "main",
                context : {
                   x : 0.5,
                   y : 0.5
                }
            });
            this.canvax.addChild( this.stage );

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

            this._initConfig(data, opt);               //初始化配置

            this._initData();                          //初始化数据

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
        _initConfig:function(data, opt){
            this.dataFrame     = S.clone(this.dataFrameOrg)
            this.dataFrame.org = data;

            if( opt ){
                this.config.mode = opt.mode || this.config.mode
                this.disYAndO        = (opt.disYAndO        || opt.disYAndO == 0       ) ? opt.disYAndO        : this.disYAndO
                var event = opt.event
                if(event){
                    this.config.event.enabled = event.enabled == 0 ? 0 : this.config.event.enabled
                }

                var yAxis = opt.yAxis
                if( yAxis ){
                    this.dataFrame.yAxis.fields = yAxis.fields || this.dataFrame.yAxis.fields
                }

                var xAxis = opt.xAxis
                if( xAxis ){
                    this.dataFrame.xAxis.field = xAxis.field || this.dataFrame.xAxis.field
                }
            }
        },

        _initModule:function(opt , data){
            this._xAxis  = new xAxis(opt.xAxis , data.xAxis);
            this._yAxis  = new yAxis(opt.yAxis , data.yAxis);
            this._back   = new Back(opt.back);
            this._graphs = new Graphs(opt.graphs);
            this._tips   = new Tips(opt.tips)
        },

        _initData:function(){
            var self = this;

            var total = []
            var arr = self.dataFrame.org;

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

                //如果没有配置xAxis的字段。
                if(!self.dataFrame.xAxis.field){

                    //那么默认第一个字段就为xAxis的数据字段
                    if(a == 0){
                        self.dataFrame.xAxis.org = o.data
                    }

                    //如果yAxis的字段集合（yAxis可以为集合）也没有配置
                    if(self.dataFrame.yAxis.fields.length == 0){

                        //那么除开第一个字段外（因为这个时候第一个字段为xAxis字段）都默认设置为yAxis字段
                        if(a != 0){
                            self.dataFrame.yAxis.org.push(o.data)
                        }

                    } else {
                        //当然，如果yAxis有配置，自然 所有的 配置里面都设置为yAxis字段
                        for(var b = 0, bl = self.dataFrame.yAxis.fields.length; b < bl; b++){
                            if(o.field == self.dataFrame.yAxis.fields[b]){
                                self.dataFrame.yAxis.org[b] = o.data
                            }
                        }
                    }
                } else {
                    //如果有配置xAxis字段，当然，就用配置的xAxis了
                    if(o.field == self.dataFrame.xAxis.field){
                        self.dataFrame.xAxis.org = o.data
                    }
                    //那么y呢？
                    //如果y有配置就用除开xAxis以外的所有字段
                    if(self.dataFrame.yAxis.fields.length == 0){
                        if(o.field != self.dataFrame.xAxis.field){
                            self.dataFrame.yAxis.org.push(o.data)
                        }
                    } else {
                        //没有就用x以外的所有字段
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
            if(self.config.mode == 2){
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

            //绘制主图形区域
            this._graphs.draw( this._trimGraphs() , {
                w    : this._xAxis.xGraphsWidth,
                h    : this._yAxis.yGraphsHeight,
                pos  : {
                     x : x + this._xAxis.disOriginX ,
                     y : y
                }
            });

            //执行生长动画
            self._graphs.grow();

            return

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

            var xArr     = this._xAxis.data;
            var yArr     = this._yAxis.dataOrg;
            var fields   = yArr.length;

            var xDis1    = this._xAxis.xDis1;
            //x方向的二维长度，就是一个bar分组里面可能有n个子bar柱子，那么要二次均分
            var xDis2    = xDis1 / (fields+1);

            var maxYAxis = this._yAxis.dataSection[ this._yAxis.dataSection.length - 1 ];
            var tmpData  = [];
            for( var a = 0 , al = xArr.length; a < al ; a++ ){
                for( var b = 0 ; b < fields ; b ++ ){
                    !tmpData[b] && (tmpData[b] = []);
                    var y = -(yArr[b][a]-this._yAxis._baseNumber) / (maxYAxis - this._yAxis._baseNumber) * this._yAxis.yGraphsHeight;
                    var x = xArr[a].x - xDis1/2 + xDis2 * (b+1)
                    tmpData[b][a] = {
                        value : yArr[b][a],
                        x     : x,
                        y     : y
                    }
                }
            };
            return tmpData;
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
        './xAxis',
        'dvix/components/yaxis/yAxis',
        'dvix/components/back/Back',
        './Graphs',
        'dvix/components/tips/Tips'
    ]
});
