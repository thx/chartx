define(
    "chartx/components/planet/Graphs" ,
    [
        "canvax/index",
        "canvax/shape/Rect",
        "chartx/utils/tools",
        "canvax/animation/Tween",
        "chartx/components/planet/Group",
        'chartx/components/planet/InfoCircle',
        "chartx/utils/deep-extend"
    ],
    function( Canvax , Rect, Tools, Tween , Group, InfoCircle){
        var Graphs = function(opt){
            this.w          = 0;   
            this.h          = 0; 
    
            this.data       = [];                          //二维 [[o, o, ...],[]]
                                                           // o = {x:0, y:0, r:{normal:''}, ...}  见InfoCircle接口
            this.sprite     = null;  
    
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

                for(var a = 0, al = self.data.length; a < al; a++){
                    var groupSprite = new Canvax.Display.Sprite()
                    for(var b = 0, bl = self.data[a].length; b < bl; b++){
                        var o = self.data[a][b]
                        var tmpX = o.x, tmpY = o.y
                        o.x = 0, o.y = 0

                        var circle = new InfoCircle(o)
                        circle.setX(tmpX), circle.setY(tmpY)
                       
                        groupSprite.addChild(circle.sprite)
                    }
                    self.sprite.addChild(groupSprite)
                }
            }
        };
        return Graphs;
    } 
)
