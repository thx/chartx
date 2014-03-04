KISSY.add("dvix/components/tips/Nodes" , function(S, Dvix, Tools){
    var Canvax = Dvix.Canvax;
    var Nodes = function(opt){

        this.data       = [];                          //[o,o,o]
        /*
         * o = 
         *    x
         *    y
         *    radius(半径)[4]:4
         *    fillStyle(填充颜色)[#000000]:#000000                                
         *    strokeStyle(边框颜色)[#000000]:#000000
         *    thinkness(边框粗细)[1.5]:2                            
        */

        this.sprite     = null;           

        this.init(opt)
    };

    Nodes.prototype = {

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

            var arr = self.data
            for(var a = 0, al = arr.length; a < al; a++){
                var o = arr[a]
                var radius     = o.radius      || 4
                var fillStyle  = o.fillStyle   || '#000000'
                var strokeStyle= o.strokeStyle || '#000000'
                var thinkness  = (o.thinkness  || o.thinkness == 0) ? o.thinkness : 1.5  

                var sign = new Canvax.Shapes.Circle({
                    context:{
                        r           : radius,
                        fillStyle   : fillStyle,
                        strokeStyle : strokeStyle,
                        lineWidth   : thinkness,
                    }
                })
                self.sprite.addChild(sign)
                sign.context.x = o.x, sign.context.y = o.y
            }
        }
    };

    return Nodes;

} , {
    requires : [
        "dvix/",
        "dvix/utils/tools",
    ] 
})
