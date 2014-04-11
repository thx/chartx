KISSY.add("dvix/components/line/Group" , function(S, Dvix, Tools){
    var Canvax = Dvix.Canvax;
    var Group = function(opt){
        this.w       = 0;   
        this.h       = 0; 
        this.y       = 0;

        this.line    = {
                strokeStyle  : '#FF0000',
        }

        this.fill    = {
                strokeStyle  : '#FF0000',
                alpha        : 1
        }

        this.data       = [];                          //[{x:0,y:-100},{}]
        this.sprite     = null;                        

        this.init(opt)
    };

    Group.prototype = {

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

        draw:function(opt){
            var self  = this;
            self._configData(opt)
            self._widget()
        },
        getNodeInfoAt:function($index){
            var self = this
            var o = S.clone(self.data[$index])
            if(o){
                o.fillStyle = self.line.strokeStyle 
                o.alpha = self.fill.alpha
                return o
            }else{
                return null
            }
        },

        //初始化配置
        _initConfig:function(opt){
            var self = this

            if(opt){
                var line = opt.line
                if(line){
                    self.line.strokeStyle = line.strokeStyle || self.line.strokeStyle
                }
                var fill = opt.fill
                if(fill){
                    self.fill.strokeStyle = fill.strokeStyle || self.fill.strokeStyle
                    self.fill.alpha       = (fill.alpha      || fill.alpha == 0) ? fill.alpha : self.fill.alpha
                } 
            }
        },
        //配置数据
        _configData:function(opt){
            var self = this
            var opt = opt || {}

            self.w  = opt.w  || 0;
            self.h  = opt.h  || 0;
            self.y  = opt.y  || 0;

            self.data = opt.data  || []
        },

        _widget:function(){
            var self  = this;

            var list = []
            for(var a = 0,al = self.data.length; a < al; a++){
                var o = self.data[a]
                list.push([o.x, o.y])
            }
            self.sprite.addChild(new Canvax.Shapes.BrokenLine({
                context : {
                    pointList   : list,
                    strokeStyle : self.line.strokeStyle,
                    lineWidth   : 1,
                    y           : self.y
                }
            }))

            var d = self._fillLine({lines:self.data})
            self.sprite.addChild(new Canvax.Shapes.Path({
                context : {
                    path        : d, 
                    fillStyle   : self.fill.strokeStyle,
                    globalAlpha : self.fill.alpha
                }
            }))
        },

        _fillLine:function($o){                        //填充直线
            var L = 'L'
            var arr = $o.lines
            var d = Tools.getPath(arr)

            d += ' ' + L + ' ' + (Number(arr[arr.length - 1].x)) + ' ' + (-1.5)
            d += ' ' + L + ' ' + (Number(arr[0].x)) + ' ' + (-1.5)
            d += ' ' + L + ' ' + (Number(arr[0].x)) + ' ' + (Number(arr[0].y))

            return d
        }
    };

    return Group;

} , {
    requires : [
        "dvix/",
        "dvix/utils/tools",
    ] 
})
