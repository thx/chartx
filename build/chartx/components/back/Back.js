define(
    "chartx/components/back/Back" ,
    [
         "canvax/index",
         "canvax/shape/Line",
         "chartx/utils/tools"
    ],
    function( Canvax, Line, Tools){
        var Back = function(opt){
            this.w       = 0;   
            this.h       = 0;
    
            this.pos     = {
                x : 0,
                y : 0
            }

            this.enabled = 1;
    
            this.xOrigin = {                                //原点开始的x轴线
                    enabled     : 1,
                    thinkness   : 1,
                    strokeStyle : '#e5e5e5'
            } 
            this.yOrigin = {                                //原点开始的y轴线               
                    enabled     : 1,
                    thinkness   : 1,
                    strokeStyle : '#e5e5e5',
                    biaxial     : false
            }
            this.xAxis   = {                                //x轴上的线
                    enabled     : 1,
                    data        : [],                      //[{y:100},{}]
                    // data        : [{y:0},{y:-100},{y:-200},{y:-300},{y:-400},{y:-500},{y:-600},{y:-700}],
                    lineType    : 'solid',                //线条类型(dashed = 虚线 | '' = 实线)
                    thinkness   : 1,
                    strokeStyle : '#f5f5f5', //'#e5e5e5',
                    filter      : null
            }
    
            this.yAxis   = {                                //y轴上的线
                    enabled     : 0,
                    data        : [],                      //[{x:100},{}]
                    // data        : [{x:100},{x:200},{x:300},{x:400},{x:500},{x:600},{x:700}],
                    lineType    : 'solid',                      //线条类型(dashed = 虚线 | '' = 实线)
                    thinkness   : 1,
                    strokeStyle : '#f5f5f5',//'#e5e5e5',
                    filter      : null
            } 
    
            this.sprite       = null;                       //总的sprite
            this.xAxisSp      = null;                       //x轴上的线集合
            this.yAxisSp      = null;                       //y轴上的线集合
    
            this.init(opt);
        };
    
        Back.prototype = {
    
            init:function(opt){
                _.deepExtend(this , opt); 
                this.sprite = new Canvax.Display.Sprite();
            },
            setX:function($n){
                this.sprite.context.x = $n
            },
            setY:function($n){
                this.sprite.context.y = $n
            },
    
            draw : function(opt){
                _.deepExtend( this , opt );
                //this._configData(opt);
                this._widget();
                this.setX(this.pos.x);
                this.setY(this.pos.y);
            },
            update : function( opt ){
                this.sprite.removeAllChildren();
                this.draw( opt );
            },
            _widget:function(){
                var self  = this;
                if(!this.enabled){
                    return
                }

                self.xAxisSp   = new Canvax.Display.Sprite(),  self.sprite.addChild(self.xAxisSp)
                self.yAxisSp   = new Canvax.Display.Sprite(),  self.sprite.addChild(self.yAxisSp)
   
                //x轴方向的线集合
                var arr = self.xAxis.data
                for(var a = 1, al = arr.length; a < al; a++){
                    var o = arr[a];
                    var line = new Line({
                        context : {
                            xStart      : 0,
                            yStart      : o.y,
                            xEnd        : self.w,
                            yEnd        : o.y,
                            lineType    : self.xAxis.lineType,
                            lineWidth   : self.xAxis.thinkness,
                            strokeStyle : self.xAxis.strokeStyle  
                        }
                    })
                    if(self.xAxis.enabled){
                        _.isFunction( self.xAxis.filter ) && self.xAxis.filter({
                            layoutData : self.yAxis.data,
                            index      : a,
                            line       : line
                        });
                        self.xAxisSp.addChild(line);
                    }
                };

                //y轴方向的线集合
                var arr = self.yAxis.data
                for(var a = 0, al = arr.length; a < al; a++){
                    var o = arr[a]
                    var line = new Line({
                        context : {
                            xStart      : o.x,
                            yStart      : 0,
                            xEnd        : o.x,
                            yEnd        : -self.h,
                            lineType    : self.yAxis.lineType,
                            lineWidth   : self.yAxis.thinkness,
                            strokeStyle : self.yAxis.strokeStyle,
                            visible     : o.x ? true : false
                        }
                    })
                    if(self.yAxis.enabled){
                        _.isFunction( self.yAxis.filter ) && self.yAxis.filter({
                            layoutData : self.xAxis.data,
                            index      : a,
                            line       : line
                        });
                        self.yAxisSp.addChild(line);
                    }
                }

                //原点开始的y轴线
                var line = new Line({
                    context : {
                        xEnd        : 0,
                        yEnd        : -self.h,
                        lineWidth   : self.yOrigin.thinkness,
                        strokeStyle : self.yOrigin.strokeStyle
                    }
                })
                if(self.yOrigin.enabled)
                    self.sprite.addChild(line)

                if( self.yOrigin.biaxial ){
                    var lineR = new Line({
                        context : {
                            xStart      : self.w,
                            xEnd        : self.w,
                            yEnd        : -self.h,
                            lineWidth   : self.yOrigin.thinkness,
                            strokeStyle : self.yOrigin.strokeStyle
                        }
                    })
                    if(self.yOrigin.enabled)
                        self.sprite.addChild(lineR)

                }
    
                //原点开始的x轴线
                var line = new Line({
                    context : {
                        xEnd        : self.w,
                        yEnd        : 0,
                        lineWidth   : self.xOrigin.thinkness,
                        strokeStyle : self.xOrigin.strokeStyle
                    }
                })
                if(self.xOrigin.enabled)
                    self.sprite.addChild(line)
            }
        };
    
        return Back;
    
    }
)
