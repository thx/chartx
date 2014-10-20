KISSY.add("dvix/components/tips/Tip" , function(S, Canvax, Circle, Rect, Tools){
    var Tip = function(opt){
        this.w          = 0;
        this.h          = 0;
        this.data       = [[1,2]];                     //二维[[o,o,o],[]]
        /*
         * 二维数组中 一个数组代表一行
         * o = 
         *    content(文字内容)[]:展现次数
         *    fontSize(文字大小)[13]:13
         *    bold(文字粗体)[normal]:bold, 
         *    fillStyle(文字颜色)[#000000]:#000000
         *    y_align(同一列对齐方式 1 = 左对齐 | 2 = 居中对齐 | 3 = 右对齐)[2]:3
         *    x_align(同一行对齐方式 1 = 上对齐 | 2 = 居中对齐 | 3 = 下对齐)[2]:2
         *    sign(前标志位) = 
         *          enabled(是否有 1 = 是 | 0 = 否)[0]:0,
         *          radius(半径)[4]:4,
         *          disX(离文字的距离):4
         *          fillStyle(颜色)[0x000000]:0xFF0000,
         *          trim(是否根据其他的行拥有的标志位进行坐标调整)[0]:0
        */

        this.text       = {
            disX        : 4,                           //文字每一排之间的距离     
            disY        : 4                            //文字每一列之间的距离
        }

        this.back       = {
            enabled     : 1,
            disX        : 8,                           //文字离边框左右的距离
            disY        : 8,                           //文字离边框上下的距离
            strokeStyle : '#333333',
            thinkness   : 2,
            fillStyle   : '#FFFFFF',
            radius      : [4,4,4,4]
        }

        this._lay       = {                            //根据此对象设置集合文字坐标、对齐方式等
            x_maxH    : [],                            //每一行最大的高集合:[24,24,24]
            y_maxW    : [],                            //对应列最大的宽集合:[100,100]
            y_maxAllW : []                             //对应列最大的宽集合 包括标志位:[120,120]
        },

        this.sprite     = null;
        this.widgetSp   = null;
        this.txtSp      = null;
        this.backSp     = null;                       

        this.init(opt)
    };

    Tip.prototype = {

        init:function(opt){
            var self  = this;
            self._initConfig(opt);
            self.sprite = new Canvax.Display.Sprite();
        },
        setX:function($n){
            this.sprite.context.x = $n
        },
        setY:function($n){
            this.sprite.context.y = $n
        },

        draw:function(config){
            var self  = this;
            self._configData(config)
            self._widget()
        },

        //初始化配置
        _initConfig:function(opt){
            var self = this

            if(opt){
                var text = opt.text
                if(text){
                    self.text.disX = text.disX || self.text.disX
                    self.text.disY = text.disY || self.text.disY
                }

                var back = opt.back
                if(back){
                    self.back.enabled     = back.enabled == 0 ? 0 : self.back.enabled
                    self.back.disX = (back.disX || back.disX == 0) ? back.disX : self.back.disX
                    self.back.disY = (back.disY || back.disY == 0) ? back.disY : self.back.disY
                    self.back.strokeStyle = back.strokeStyle || self.back.strokeStyle
                    self.back.thinkness   = back.thinkness   || self.back.thinkness
                    self.back.fillStyle   = back.fillStyle   || self.back.fillStyle
                    self.back.radius      = back.radius      || self.back.radius
                }
            }
        },
        //配置数据
        _configData:function(config){
            var self = this
            if(config){
                self.data = config.data || self.data
            }
        },

        _widget:function(){
            var self  = this;

            // var sign = new Canvax.Shapes.Circle({
            //     context:{
            //         r         : 5,
            //         fillStyle : '#ff0000'
            //     }
            // })
            self.widgetSp = new Canvax.Display.Sprite(),  self.sprite.addChild(self.widgetSp)

            self.backSp   = new Canvax.Display.Sprite(),  self.widgetSp.addChild(self.backSp)
            self.txtSp    = new Canvax.Display.Sprite(),  self.widgetSp.addChild(self.txtSp)

            // self.sprite.addChild(sign)

            var _lay = self._lay
            var x_count = self.data.length             //有几行
            var y_count = 0                            //有几列
            if(self.data[0]){
                y_count = self.data[0].length
            }
            for(var a = 0, al = self.data.length; a < al; a++){
                var x_maxH    = 0                      //一行中最高的值
                var sign_maxW = 0 

                var rowTxtsSp = new Canvax.Display.Sprite()                //一行文字
                self.txtSp.addChild(rowTxtsSp)     
                for(var b = 0, bl = self.data[a].length; b < bl ; b++){
                    
                    var o = self.data[a][b]
                    var bold      = o.bold      || 'normal'
                    var fillStyle = o.fillStyle || '#000000'
                    var fontSize  = o.fontSize  || 13
                    var content   = Tools.numAddSymbol(o.content) || ''

                    var txt = new Canvax.Display.Text(content,             //单个文字
                       {
                        context : {
                            fillStyle   : fillStyle,
                            fontSize    : fontSize,
                            fontWeight  : bold,
                            // textBackgroundColor:'#ff2380',
                       }
                    })
                    rowTxtsSp.addChild(txt)

                    x_maxH = Math.max(x_maxH, txt.getTextHeight())

                    if(!_lay.y_maxW[b]){
                        _lay.y_maxW[b] = 0
                        _lay.y_maxAllW[b] = 0
                    }
                    if(_lay.y_maxW[b] < txt.getTextWidth()){
                        _lay.y_maxW[b] = txt.getTextWidth()
                        _lay.y_maxAllW[b] = _lay.y_maxW[b]
                    }
                    
                    if (o.sign && o.sign.enabled) {
                        var radius = o.sign.radius || 4
                        var disX   = o.sign.disX   || 4
                        _lay.y_maxAllW[b] = Number(_lay.y_maxW[b]) + Number(radius) * 2 + Number(disX)
                    }
                }
                _lay.x_maxH.push(x_maxH)  
            }
            for (var c = 0, cl = self.data.length; c < cl; c++ ) {
                var rowTxtsSp = self.txtSp.getChildAt(c)
                for (var d = 0, dl = self.data[c].length; d < dl; d++ ) {
                    var o = self.data[c][d]

                    var txt = rowTxtsSp.getChildAt(d)   
                    var x = Tools.getArrMergerNumber(_lay.y_maxAllW, 0, d - 1) + d * self.text.disY
                    var y = c > 0 ? Tools.getArrMergerNumber(_lay.x_maxH, 0, c - 1) + c * self.text.disX : 0
                    rowTxtsSp.context.y = y
                    y = 0

                    var initX = x 
                    var initY = y

                    var y_align = o.y_align || 2
                    var x_align = o.x_align || 2
                    if (y_align == 2) {                                    //一列居中
                        x = x + (_lay.y_maxAllW[d] - txt.getTextWidth())/2
                    }else if (y_align == 3) {                              //一列右对齐
                        x = x + _lay.y_maxAllW[d] - txt.getTextWidth()   
                    }
                    if (x_align == 2) {                                    //一排居中
                        y = y + (_lay.x_maxH[c] - txt.getTextHeight())/2
                    }else if (x_align == 3) {                              //一排下对齐
                        y = y + _lay.x_maxH[c] - txt.getTextHeight()
                    }
                    if (o.sign) {
                        var radius      = o.sign.radius    || 4
                        var disX        = o.sign.disX      || 4
                        var fillStyle   = o.sign.fillStyle || '#000000'

                        if (o.sign.enabled && o.sign.trim) {
                            var sign = new Circle({
                                context:{
                                    r         : radius,
                                    fillStyle : fillStyle
                                }
                            })
                            rowTxtsSp.addChild(sign)
                            sign.context.x = parseInt(radius),  sign.context.y = parseInt(y + txt.getTextHeight()/2)
                            x = sign.context.x + radius + disX
                        }
                    }
                    x = parseInt(x), y = parseInt(y)
                    txt.context.x = x, txt.context.y = y
                }
            }

            var w,h
            var disXs = (y_count - 1) * self.text.disY //文字一排的总距离
            var disYs = (x_count - 1) * self.text.disX //文字一列的总距离
            if(!self.back.enabled){
                self.back.disX = 0, self.back.disY = 0
            } 
            self.txtSp.context.x = self.back.disX, self.txtSp.context.y = self.back.disY
            w = Tools.getArrMergerNumber(_lay.y_maxAllW) + self.back.disX * 2 + disXs
            h = Tools.getArrMergerNumber(_lay.x_maxH)    + self.back.disY * 2 + disYs
            self.w = w, self.h = h 

            var x = parseInt(-w/2), y = parseInt(-h/2)
            self.widgetSp.context.x = x, self.widgetSp.context.y = y

            if(self.back.enabled){
                self.backSp.addChild(new Rect({
                    context : {
                        width       : w,
                        height      : h,
                        strokeStyle : self.back.strokeStyle,
                        lineWidth   : self.back.thinkness,
                        fillStyle   : self.back.fillStyle,
                        radius      : self.back.radius
                    }
                }))
            }
        }
    };

    return Tip;

} , {
    requires : [
        "canvax/",
        "canvax/shape/Circle",
        "canvax/shape/Rect",
        "dvix/utils/tools"
    ] 
})
