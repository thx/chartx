KISSY.add("dvix/components/yaxis/yAxis" , function(S, Dvix , Line , Tools){
    var Canvax = Dvix.Canvax;
    var yAxis = function(opt){
        this.w = 0;

        this.mode = 1                                  //模式( 1 = 正常 | 2 = 显示两条(最下面 + 最上面 且与背景线不对其))
        this.dis  = 6                                  //线到文本的距离

        this.line = {
                enabled : 1,                           //是否有line
                width   : 6,
                height  : 3,
                strokeStyle   : '#BEBEBE'
        }

        this.text = {
                fillStyle : 'blank',
                //fontSize  : 13//
                fontSize  : 12
        }

        this.data       = [];                          //{y:-100, content:'1000'}
        this.sprite     = null;
        this.txtSp      = null;
        this.lineSp     = null;

        this.init(opt)
    };

    yAxis.prototype = {
        init:function(opt){
            var self  = this;
            self._initConfig(opt)
            self.sprite = new Canvax.Display.Sprite();
        },
        setX:function($n){
            this.sprite.context.x = $n
        },
        setY:function($n){
            this.sprite.context.y = $n
        },
        draw:function(opt){
            var self  = this;
            self._configData(opt)
            self._widget()
        },

        //初始化配置
        _initConfig:function(opt){
          var self = this
            if(opt){
                self.dis  = opt.dis || opt.dis == 0 ? opt.dis : self.dis
                self.mode = opt.mode|| self.mode

                var line = opt.line
                if(line){
                    self.line.enabled = line.enabled == 0 ? 0 : self.line.enabled;
                    self.line.strokeStyle = line.strokeStyle || self.line.strokeStyle
                }

                var text = opt.text
                if(text){
                    self.text.fillStyle = text.fillStyle || self.text.fillStyle
                    self.text.fontSize  = text.fontSize  || self.text.fontSize
                }
            }
        },
        //配置数据
        _configData:function(opt){
            var self = this
            var opt = opt || {}

            self.data  = opt.data  || [];
        },

        _widget:function(){
            var self  = this;
            var arr = this.data

            if(self.mode == 2){
                var tmp = []
                if(arr.length > 2){
                    tmp.push(arr[0]), tmp.push(arr[arr.length - 1])
                    arr = tmp
                }
            }

            self.txtSp  = new Canvax.Display.Sprite(),  self.sprite.addChild(self.txtSp)
            self.lineSp = new Canvax.Display.Sprite(),  self.sprite.addChild(self.lineSp)

            var maxW = 0;
            for(var a = 0, al = arr.length; a < al; a++){
                var o = arr[a]
                var x = 0, y = o.y
                var content = Tools.numAddSymbol(o.content)
                //文字
                var txt = new Canvax.Display.Text(content,
                   {
                    context : {
                        x  : x,
                        y  : y,
                        fillStyle    : self.text.fillStyle,
                        fontSize     : self.text.fontSize,
                        // textBackgroundColor:'#0000ff',
                        textAlign    : self.mode == 2 ? "left" : "right",
                        textBaseline : "middle"
                   }
                })

                if(self.mode == 2){
                    if(arr.length == 2){
                        var h = txt.getTextHeight()
                        if(a == 0){
                            txt.context.y = y - parseInt(h / 2) - 2
                        }else if(a == 1){
                            txt.context.y = y + parseInt(h / 2) + 2
                        }
                    }
                }

                self.txtSp.addChild(txt);
                maxW = Math.max(maxW, txt.getTextWidth());

                //线条
                var line = new Line({
                    id      : a,
                    context : {
                        x           : 0,
                        y           : y,
                        xEnd        : self.line.width,
                        yEnd        : 0,
                        lineWidth   : self.line.height,
                        strokeStyle : self.line.strokeStyle
                    }
                })
                self.lineSp.addChild(line)
            }
            self.txtSp.context.x  = self.mode == 2 ? 0 : maxW;
            self.lineSp.context.x = maxW + self.dis

            if(self.line.enabled){
                self.w = maxW + self.dis + self.line.width
            } else {
                self.lineSp.context.visible = false
                self.w = maxW 
            }
        }
    };

    return  yAxis;

} , {
    requires : [
        "dvix/",
        "canvax/shape/Line",
        "dvix/utils/tools"
    ] 
})
