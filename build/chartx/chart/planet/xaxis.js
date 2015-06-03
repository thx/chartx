define(
    "chartx/chart/planet/xaxis",
    [
        "canvax/index",
        "canvax/shape/Rect",
    ],
    function(Canvax, Rect){
        var xaxis = function(opt){
            this.width      = opt.width
            this.enabled    = 0
            this.bar        = {
                dis        : 8,                            //文字与bar的距离
                height     : 5
            }

            this.fillStyle  = {
                normal     : ['#70649a', '#b28fce']
            }

            this.radiusR    = 3
            this.text       = {
                contents   :['极力推荐','一般推荐'],
                fillStyle  :{
                    normal : '#000000'
                },
                fontSize   :{
                    normal : 12
                }
            }

            this.sprite     = null;  
            this.rect       = null;
            this.init(opt)
        };
        xaxis.prototype = {
            init:function(opt){
                var self = this
                _.deepExtend(this, opt);
            },
            draw:function(opt){
                var self  = this;
                // _.deepExtend(this, opt);
                self._widget()
            },
            setX:function($n){
                this.sprite.context.x = $n
            },
            setY:function($n){
                this.sprite.context.y = $n
            },
            gradient:function(){
                var self = this
                var rect = self.rect
                var gradient = self.sprite.getStage().context2D.createLinearGradient(rect.context.x, rect.context.y, rect.context.x + rect.context.width, rect.context.y)
                gradient.addColorStop(0, self.fillStyle.normal[0]) 
                gradient.addColorStop(1, self.fillStyle.normal[1]) 
                rect.context.fillStyle = gradient
            },
            _widget:function(){
                var self = this
                if(self.enabled){
                    self.sprite = new Canvax.Display.Sprite();
                    self.sprite.context.y = self.y
                    self.sprite.context.x = self.x

                    var txt1 = self._creatTxt(self.text.contents[0])
                    self.sprite.addChild(txt1)

                    var txt2 = self._creatTxt(self.text.contents[1])
                    self.sprite.addChild(txt2)

                    var w = self.width - txt1.getTextWidth() - txt2.getTextWidth() - this.bar.dis * 2

                    var rect = new Rect({
                        context:{
                            x           : 0,
                            y           : 0,
                            width       : w,
                            height      : self.bar.height,
                            // fillStyle   : self.fillStyle.normal,
                            radius      : [self.radiusR , self.radiusR, self.radiusR, self.radiusR]
                        }
                    })
                    self.sprite.addChild(rect)

                    rect.context.x = txt1.getTextWidth() + this.bar.dis, rect.context.y = parseInt((txt1.getTextHeight() - self.bar.height) / 2) + 1
                    txt2.context.x = rect.context.x + rect.context.width + self.bar.dis

                    self.rect = rect
                }
            },
            _creatTxt:function(content){
                var self = this
                return new Canvax.Display.Text(         
                        content,
                        {
                            context : {
                                fillStyle    : self.text.fillStyle.normal,
                                fontSize     : self.text.fontSize.normal
                            }
                        }
                       )
            }
        }
    
        return xaxis;
    }
);
