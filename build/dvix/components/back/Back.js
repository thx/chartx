KISSY.add("dvix/components/back/Back" , function(S, Dvix, Tools){
    var Canvax = Dvix.Canvax;
    var Back = function(opt){
        this.w       = 0;   
        this.h       = 0;

        this.xOrigin = {                                //原点开始的x轴线
                enabled     : 1,
                thinkness   : 1,
                strokeStyle : '#333333'
        } 
        this.yOrigin = {                                //原点开始的y轴线               
                enabled     : 1,
                thinkness   : 1,
                strokeStyle : '#BEBEBE'
        }
        this.xAxis   = {                                //x轴上的线
                enabled     : 1,
                w           : 0,
                data        : [],                      //[{y:100},{}]
                // data        : [{y:0},{y:-100},{y:-200},{y:-300},{y:-400},{y:-500},{y:-600},{y:-700}],
                lineType    : 'dashed',                //线条类型(dashed = 虚线 | '' = 实线)
                thinkness   : 1,
                strokeStyle : '#cccccc'
        }

        this.yAxis   = {                                //y轴上的线
                enabled     : 1,
                h           : 0,
                data        : [],                      //[{x:100},{}]
                // data        : [{x:100},{x:200},{x:300},{x:400},{x:500},{x:600},{x:700}],
                lineType    : '',                      //线条类型(dashed = 虚线 | '' = 实线)
                thinkness   : 1,
                strokeStyle : '#BEBEBE'
        } 

        this.sprite       = null;                       //总的sprite
        this.xOriginSp    = null;                       //原点开始的x轴线
        this.yOriginSp    = null;                       //原点开始的y轴线
        this.xAxisSp      = null;                       //x轴上的线集合
        this.yAxisSp      = null;                       //y轴上的线集合

        this.init(opt)
    };

    Back.prototype = {

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

        draw : function(opt){
            var self  = this;
            self._configData(opt)
            self._widget()
        },

        //初始化配置
        _initConfig:function(opt){
            var self = this
            if(opt){
                var xOrigin = opt.xOrigin
                if(xOrigin)
                    self.xOrigin.enabled     = xOrigin.enabled == 0 ? 0 : self.xOrigin.enabled;
                    self.xOrigin.thinkness   = xOrigin.thinkness   || self.xOrigin.thinkness;
                    self.xOrigin.strokeStyle = xOrigin.strokeStyle || self.xOrigin.strokeStyle;

                var yOrigin = opt.yOrigin
                if(yOrigin)
                    self.yOrigin.enabled = yOrigin.enabled == 0 ? 0 : self.yOrigin.enabled;
                
                var xAxis   = opt.xAxis
                if(xAxis)
                    self.xAxis.enabled      = xAxis.enabled  == 0  ? 0 : self.xAxis.enabled
                    self.xAxis.lineType     = xAxis.lineType == '' ? '': self.xAxis.lineType
                    self.xAxis.strokeStyle  = xAxis.strokeStyle || self.xAxis.strokeStyle;

                var yAxis   = opt.yAxis
                if(yAxis)
                    self.yAxis.enabled   = yAxis.enabled  == 0 ? 0 : self.yAxis.enabled,
                    self.yAxis.lineType  = yAxis.lineType == 'dashed' ? 'dashed' : self.yAxis.lineType;
            }
        },
        //配置数据
        _configData:function(opt){
            var self = this
            self.w  = opt.w  || 0;      
            self.h  = opt.h  || 0;
            if(opt.xAxis)
                self.xAxis.w    = opt.xAxis.w || self.w,
                self.xAxis.data = opt.xAxis.data;

            if(opt.yAxis)
                self.yAxis.h    = opt.yAxis.h || self.h,
                self.yAxis.data = opt.yAxis.data;
        },

        _widget:function(){
            var self  = this;
          
            self.xAxisSp   = new Canvax.Display.Sprite(),  self.sprite.addChild(self.xAxisSp)
            self.yAxisSp   = new Canvax.Display.Sprite(),  self.sprite.addChild(self.yAxisSp)
            self.xOriginSp = new Canvax.Display.Sprite(),  self.sprite.addChild(self.xOriginSp)
            self.yOriginSp = new Canvax.Display.Sprite(),  self.sprite.addChild(self.yOriginSp)

            //x轴上的线集合
            var arr = self.xAxis.data
            for(var a = 0, al = arr.length; a < al; a++){
                var o = arr[a]
                var line = new Canvax.Shapes.Line({
                    context : {
                        xStart      : 0,
                        yStart      : o.y,
                        xEnd        : self.xAxis.w,
                        yEnd        : o.y,
                        lineType    : self.xAxis.lineType,
                        lineWidth   : self.xAxis.thinkness,
                        strokeStyle : self.xAxis.strokeStyle  
                    }
                })
                if(self.xAxis.enabled)
                    self.xAxisSp.addChild(line);
            }

            //y轴上的线集合
            var arr = self.yAxis.data
            for(var a = 0, al = arr.length; a < al; a++){
                var o = arr[a]
                var line = new Canvax.Shapes.Line({
                    context : {
                        xStart      : o.x,
                        yStart      : 0,
                        xEnd        : o.x,
                        yEnd        : -self.yAxis.h,
                        lineType    : self.yAxis.lineType,
                        lineWidth   : self.yAxis.thinkness,
                        strokeStyle : self.yAxis.strokeStyle  
                    }
                })
                if(self.yAxis.enabled)
                    self.yAxisSp.addChild(line);
            }

            //原点开始的y轴线
            var line = new Canvax.Shapes.Line({
                context : {
                    xEnd        : 0,
                    yEnd        : -self.h,
                    lineWidth   : self.yOrigin.thinkness,
                    strokeStyle : self.yOrigin.strokeStyle
                }
            })
            if(self.yOrigin.enabled)
                self.yOriginSp.addChild(line)

            //原点开始的x轴线
            var line = new Canvax.Shapes.Line({
                context : {
                    xEnd        : self.w,
                    yEnd        : 0,
                    lineWidth   : self.xOrigin.thinkness,
                    strokeStyle : self.xOrigin.strokeStyle
                }
            })
            if(self.xOrigin.enabled)
                self.xOriginSp.addChild(line)
                line.context.y = -0.5
        }
    };

    return Back;

} , {
    requires : [
        "dvix/",
        "dvix/utils/tools",
    ] 
})
