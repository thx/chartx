define(
    "chartx/components/planet/InfoCircle",
    [
        "canvax/index",
        "canvax/shape/Circle",
        "canvax/shape/Rect",
        "chartx/utils/deep-extend"
    ],
    function(Canvax, Circle, Rect){
        var InfoCircle = function(opt, root, fire){
            this.root      = root;
            this.fire      = fire;
            this.x         = 0;
            this.y         = 0;
            this.r         = {                             //半径
                normal       : 30,
                over         : 3
            },
            this.fillStyle = {                             //填充
                normal       : '#ff0000',                       //为空时不填充
                over         : '#ff0000'
            },
            this.strokeStyle = {                           //轮廓颜色 
                normal       : '#000000',
                over         : '#000000'
            },
            this.lineWidth = {                             //轮廓粗细
                normal       : 0,
                over         : 0
            }
            this.globalAlpha = {                           //填充透明度
                normal       : 1,
                over         : 1
            }

            this.text      = {                        //文字
                content      : '', 
                place        : 'right',                    //位置(center = 居中  |  right = 右侧)[right]
                fillStyle    : {                           //填充
                    normal     : '#000000', 
                    over       : '#000000'
                },
                fontSize     : {                           //大小
                    normal     : 12,
                    over       : 12           
                }
            }
            this.event     = {
                enabled      : 0
            }

            this.sprite    = null;
            this.circle    = null;

            this.init(opt)
        };
    
        InfoCircle.prototype = {
            init:function(opt){
                _.deepExtend(this, opt);

                var self  = this;
                self.sprite = new Canvax.Display.Sprite();

                var circle = new Circle({                  //圆
                    id : "circle",
                    context : {
                        x           : self.x || 0,
                        y           : self.y || 0,
                        r           : self.r.normal || 30,
                        fillStyle   : self.fillStyle.normal,
                        strokeStyle : self.strokeStyle.normal || '000000',
                        lineWidth   : self.lineWidth.normal   || 0,
                        globalAlpha : self.globalAlpha.normal,
                        cursor      : self.event.enabled ? 'pointer' : ''
                    }
                });
                self.circle = circle
                self.sprite.addChild(circle);

                var txt = new Canvax.Display.Text(         //文字
                    self.text.content,
                   {
                    context : {
                        fillStyle    : self.text.fillStyle.normal,
                        fontSize     : self.text.fontSize.normal
                   }
                })
                self.sprite.addChild(txt)

                var x = self.r.normal + 2, y = self.y - parseInt(txt.getTextHeight() / 2)
                if(self.text.place == 'center'){
                    x = self.x - parseInt(txt.getTextWidth() / 2)
                }
                txt.context.x = x, txt.context.y = y

                if(self.text.content){                     //文字感应区
                    var rect = new Rect({
                        context:{
                            x           : x - 2,
                            y           : y,
                            width       : txt.getTextWidth() + 2,
                            height      : txt.getTextHeight(),
                            fillStyle   : '#000000',
                            globalAlpha : 0,
                            cursor      : self.event.enabled ? 'pointer' : ''
                        }
                    })
                    self.sprite.addChild(rect) 
                }

                if(self.event.enabled){                    //事件
                    self._event(circle)
                    if(rect){
                        self._event(rect)
                    }
                }
            },
            setX:function($n){
                this.sprite.context.x = $n
            },
            setY:function($n){
                this.sprite.context.y = $n
            },
            _event:function($o){
                var self = this
                $o.on("mouseover", function(e){
                    self._mouseoverHandler(e)
                })
                $o.on("mouseout", function(e){
                    self._mouseoutHandler(e)
                })
                $o.on("click", function(e){
                    self._clickHandler(e)
                })
            },
            _mouseoverHandler:function($e){
                var self = this
                self.sprite.parent.toFront()
                self.fire.eventType = 'mouseover'
                self.root.event.onClick(self.fire)
                self._induce(true)
            },
            _mouseoutHandler:function($e){
                var self = this
                self.fire.eventType = 'mouseout'
                self.root.event.onClick(self.fire)
                self._induce(false)
            },
            _clickHandler:function($e){
                var self = this
                self.fire.eventType = 'click'
                self.root.event.onClick(self.fire)
            },
            _induce:function($b){
                var self = this
                var base = 1.1
                if(self.r.normal <= 5){
                    base = 1.3
                }
                var scale = $b ? base : 1
                self.circle.context.scaleX = self.circle.context.scaleY = scale
            }
        };
        return InfoCircle
    } 
)
