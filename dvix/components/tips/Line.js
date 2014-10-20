KISSY.add("dvix/components/tips/Line" , function(S, Canvax, CanvaxLine, Tools){
    var Line = function(opt){

        this.xStart     = 0
        this.yStart     = 0
        this.xEnd       = 0
        this.yEnd       = 0

        this.line       = {
            lineType    : 'dashed',                //线条类型(dashed = 虚线 | '' = 实线)
            thinkness   : 1,
            strokeStyle : '#333333'
        }

        this.sprite     = null;           

        this.init(opt)
    };

    Line.prototype = {

        init:function(opt){
            _.deepExtend( this , opt );
            this.sprite = new Canvax.Display.Sprite( {
                id : "tipLine"
            });
        },
        setX:function($n){
            this.sprite.context.x = $n
        },
        setY:function($n){
            this.sprite.context.y = $n
        },

        draw : function(opt){
            var self  = this;
            _.deepExtend( this , opt );
            self._widget()
        },
        _widget:function(){
            var self  = this;
            var line = new CanvaxLine({
                context : {
                    xStart      : self.xStart,
                    yStart      : self.yStart,
                    xEnd        : self.xEnd,
                    yEnd        : self.yEnd,
                    lineType    : self.line.lineType,
                    lineWidth   : self.line.thinkness,
                    strokeStyle : self.line.strokeStyle
                }
            })
            self.sprite.addChild(line)
        }
    };

    return Line;

} , {
    requires : [
        "canvax/",
        "canvax/shape/Line",
        "dvix/utils/tools",
        "dvix/utils/deep-extend"
    ] 
})
