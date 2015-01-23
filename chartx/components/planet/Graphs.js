define(
    "chartx/components/planet/Graphs" ,
    [
        "canvax/index",
        "canvax/shape/Rect",
        "chartx/utils/tools",
        "canvax/animation/Tween",
        'chartx/components/planet/InfoCircle',
        "chartx/utils/deep-extend"
    ],
    function( Canvax , Rect, Tools, Tween , InfoCircle){
        var Graphs = function(opt, root){
            this.root       = root; 
            this.data       = [];                          //二维 [[o, o, ...],[]]
                                                           // o = {x:0, y:0, r:{normal:''}, ...}  见InfoCircle接口
            this.sprite     = null; 

            this.event      = {
                enabled       : 1
            }     
    
            this.init(opt)
        };
    
        Graphs.prototype = {
            init:function(opt){
                _.deepExtend(this, opt);
                this.sprite = new Canvax.Display.Sprite();
            },
            setX:function($n){
                this.sprite.context.x = $n
            },
            setY:function($n){
                this.sprite.context.y = $n
            },
            getX:function(){
                return this.sprite.context.x
            },
            getY:function(){
                return this.sprite.context.y
            },
    
            draw:function(opt){
                var self  = this;
                _.deepExtend(this, opt);
                self._widget()
            },
            _widget:function(){
                var self  = this;
                                /*
                var data = [ 
                    [ 
                        {x:self.cx, y:self.cy, r:{normal:50}, fillStyle:{normal:'#9a5fe2'}, text:{content:'品牌', fillStyle:{normal:'#ffffff'}, fontSize:{normal:16}}},
                      
                    ],
                    [ 
                        {x:189, y:145, r:{normal:50}, fillStyle:{normal:'#9a5fe2'}, text:{content:'测试1_1'}},
                        {x:170, y:300, r:{normal:30}, fillStyle:{normal:'#9a5fe2'}, text:{content:'测试1_2'}},
                      
                    ],
                    [
                        {x:307, y:123, r:{normal:60}, fillStyle:{normal:'#a275e9'}, text:{content:'测试2_1'}},
                    ],
                    [
                        {x:417, y:370, r:{normal:25}, fillStyle:{normal:'#b498e5'}, text:{content:'测试3_1'}},
                    ],
                ]
                */

                for(var a = 0, al = self.data.length; a < al; a++){
                    var groupSprite = new Canvax.Display.Sprite()
                                                           //如果是二维数组
                    if(self.data[0].length > 0){           
                        for(var b = 0, bl = self.data[a].length; b < bl; b++){
                            var o = self.data[a][b]
                            o.event = (o.event && o.event.enabled == 0) || self.event
                            var tmpX = o.x, tmpY = o.y
                            o.x = 0, o.y = 0
                            var circle = new InfoCircle(o, self.root, {ringID:a, ID:(b + 1), x:tmpX, y:tmpY})

                            circle.setX(tmpX), circle.setY(tmpY)
                            
                            if(o.enabled != 0){
                                groupSprite.addChild(circle.sprite)
                            }
                        }
                    }else{                                
                        var o = self.data[a]
                        o.event = self.event
                        var tmpX = o.x, tmpY = o.y
                        o.x = 0, o.y = 0

                        if(o.enabled != 0){
                            var circle = new InfoCircle(o, self.root, {ringID:a, x:tmpX, y:tmpY})
                            circle.setX(tmpX), circle.setY(tmpY)
                            groupSprite.addChild(circle.sprite)
                        }
                    }
                    self.sprite.addChild(groupSprite)
                }
            }
        };
        return Graphs;
    } 
)
