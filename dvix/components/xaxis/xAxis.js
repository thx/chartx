KISSY.add("dvix/components/xaxis/xAxis" , function(S, Dvix, Line , Tools){
    var Canvax = Dvix.Canvax;
    var xAxis = function(opt){
        this.w = 0;
        this.h = 24

        this.disY       = 6
        this.dis        = 6;                           //线到文本的距离

        this.line = {
                enabled : 1,                           //是否有line
                width   : 1,
                height  : 4,
                strokeStyle   : '#cccccc'
        }

        this.max  = { 
                left    : 0,                           //第一个文字最左侧坐标的最大值              
                right   : 0,                           //最后一个文字最右侧坐标的最大值

                txtH    : 14                           //文字最大高
        }

        this.text = {
                mode      : 1,                         //模式(1 = 文字有几个线有几条 | 2 = 线不做过滤)
                fillStyle : '#999999',
                fontSize  : 13
        }

        this.data       = [];                          //{x:100, content:'1000'}
        this.layoutData = [];                          //this.data(可能数据过多),重新编排后的数据集合, 并根据此数组展现文字和线条
        this.sprite     = null;
        this.txtSp      = null;
        this.lineSp     = null;

        this.init(opt)
    };

    xAxis.prototype = {
        init:function(opt){
            var self  = this;
            self._initConfig(opt);
            self.sprite = new Canvax.Display.Sprite();

            self._check()                              //检测
        },
        setX:function($n){
            this.sprite.context.x = $n
        },
        setY:function($n){
            this.sprite.context.y = $n
        },

        draw:function(opt){
            // this.data = [{x:0,content:'0000'},{x:100,content:'10000'},{x:200,content:'20000'},{x:300,content:'30000'},{x:400,content:'0000'},{x:500,content:'10000'},{x:600,content:'20000'}]
            var self  = this;
            self._configData(opt) 	
            self._trimLayoutData()
            self._widget()
            self._layout()
debugger
            self.h = self.disY + self.line.height + self.dis + self.max.txtH
        },
        getLayoutData:function(){                       //获取真正显示的数据组合
        	var self = this
        	return self.layoutData
        },

        //初始化配置
        _initConfig:function(opt){
        	var self = this
          	if(opt){
                self.disY = opt.disY || opt.disY == 0 ? opt.disY : self.disY
                self.dis  = opt.dis  || opt.dis  == 0 ? opt.dis  : self.dis

                var line = opt.line
                if(line){
                    self.line.enabled = line.enabled == 0 ? 0 : self.line.enabled;
                    self.line.height  = line.height || self.line.height;
                    self.line.strokeStyle = line.strokeStyle || self.line.strokeStyle
                }

                var text = opt.text
                if(text){
                    self.text.mode      = text.mode      || self.text.mode
                    self.text.fillStyle = text.fillStyle || self.text.fillStyle
                    self.text.fontSize  = text.fontSize  || self.text.fontSize
                }
            }
        },
         //配置数据
        _configData:function(opt){
          	var self = this
          	var opt = opt || {}

          	self.w  = opt.w  || 0;      
          	self.h  = opt.h  || 0;
          	self.max.right = self.w;

            self.data  = opt.data  || [];

          	if(opt.max)
            	self.max.left   = opt.max.left  || self.max.left,
            	self.max.right  = opt.max.right || self.max.right;
        },
        
        _check:function(){                             //检测下文字的高等
            var self = this
            var txt = new Canvax.Display.Text('test',
                   {
                    context : {
                        fontSize    : self.text.fontSize
                   }
            })
            self.max.txtH = txt.getTextHeight()
            self.h = self.disY + self.line.height + self.dis + self.max.txtH
            delete txt
        },

        _widget:function(){
            var self  = this;
            var arr = self.layoutData

          	self.txtSp  = new Canvax.Display.Sprite(),  self.sprite.addChild(self.txtSp)
         	self.lineSp = new Canvax.Display.Sprite(),  self.sprite.addChild(self.lineSp)

          	for(var a = 0, al = arr.length; a < al; a++){

              	var o = arr[a]
              	var x = o.x, y = self.disY + self.line.height + self.dis
              	var content = Tools.numAddSymbol(o.content)
              	//文字
              	var txt = new Canvax.Display.Text(content,
                   {
                    context : {
                        x  : x,
                        y  : y,
                        fillStyle   : self.text.fillStyle,
                        fontSize    : self.text.fontSize,
                        // textBackgroundColor:'#ff2380',
                        // textAlign   :"center",
                        // textBaseline:"middle"
                   }
              	})
              	self.txtSp.addChild(txt);
          	}

            var arr = self.text.mode == 1 ? self.layoutData : self.data
            for(var a = 0, al = arr.length; a < al; a++){
                var o = arr[a]
                var x = o.x
                //线条
                var line = new Line({
                    id      : a,
                    context : {
                        x           : x,
                        y           : 0,
                        xEnd        : 0,
                        yEnd        : self.line.height,
                        lineWidth   : self.line.width,
                        strokeStyle : self.line.strokeStyle
                    }
                })
                line.context.y = self.disY
                // console.log('line ' + x)
                self.lineSp.addChild(line)
            }

           	for(var a = 0, al = self.txtSp.getNumChildren(); a < al; a++){
           		var txt = self.txtSp.getChildAt(a)
           		var x = parseInt(txt.context.x - txt.getTextWidth() / 2)
           		txt.context.x = x
                // console.log(txt.context.x, txt.getTextWidth())
           	}
        },

        _layout:function(){
        	var self = this
			var firstText = self.txtSp.getChildAt(0)
			var popText = self.txtSp.getChildAt(self.txtSp.getNumChildren() - 1)

			if(firstText && firstText.context.x < self.max.left){
				firstText.context.x = parseInt(self.max.left)
			}
			if (popText && (Number(popText.context.x + Number(popText.getTextWidth())) > self.max.right)) {
				popText.context.x = parseInt(self.max.right - popText.getTextWidth())
			}
        },

        _trimLayoutData:function(){
            var self = this
            var tmp = []
            var max = 0                                                           //获取文字最大的length
            var arr = self.data
            var textMaxWidth = 0 

            for(var a = 0, al = arr.length; a < al; a++){
                var o = arr[a]
                var content = Tools.numAddSymbol(o.content)
                var txt = new Canvax.Display.Text(content,
                   {
                    context : {
                        fillStyle   : self.text.fillStyle,
                        fontSize    : self.text.fontSize
                   }
                })
                textMaxWidth = Math.max(textMaxWidth, txt.getTextWidth())         //获取文字最大宽
            }

            var maxWidth =  self.max.right                                         //总共能多少像素展现
            var n = Math.floor(maxWidth / (textMaxWidth + 10))                     //能展现几个
            n = n > arr.length ? arr.length : n
            var dis = Math.floor(arr.length / (n - 1))                             //array中展现间隔
            dis = arr.length == 2 && n == 2 ? 1 : dis       
            dis = arr.length == 1 && n == 1 ? 0 : dis       
                                                                                   //存放展现的数据
            for(var a = 0, al = arr.length; a < al; a++){
                var o = arr[dis * a]
                if(o){
                    tmp.push(arr[dis * a])
                }
            }
            if (tmp.length > n) {
                dis = Math.ceil(arr.length / (n - 1))
                dis = arr.length == 2 && n == 2 ? 1 : dis       
                dis = arr.length == 1 && n == 1 ? 0 : dis
                tmp = []                                                           
                for(a = 0, al = arr.length; a < al; a++){
                    o = arr[dis * a]
                    if (o) {
                        tmp.push(arr[dis * a])
                    }
                }
            }
          
            if (n == 1 && tmp.length == 0 ) {                                      //防止连第一条都没的情况
                tmp[0] = arr[0]
            }
            if (n == 2 && tmp.length == 1 && arr.length >= 2) {
                tmp[1] = arr[arr.length - 1]
            }
            self.layoutData = tmp
        }
    };

    return xAxis;

} , {
    requires : [
        "dvix/",
        "canvax/shape/Line",
        "dvix/utils/tools"
    ] 
})
