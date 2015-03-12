define(
    "chartx/components/anchor/Anchor" , 
    [
        "canvax/index",
        "canvax/shape/Line",
        "chartx/utils/deep-extend"
    ],
    function(Canvax, Line){
        var Anchor = function(opt , data){
            this.w = 0;
            this.h = 0;
    
            this.enabled = 0 ; //1,0 true ,false 

            this.xAxis   = {
                lineWidth   : 1,
                fillStyle   : '#ff0000'
            }
            this.yAxis   = {
                lineWidth   : 1,
                fillStyle   : '#ff0000'
            }

            this.pos     = {
                x           : 0,
                y           : 0
            }   

            this.sprite  = null;

            this.init(opt )
        };
    
        Anchor.prototype = {
            init:function( opt ){
                if( opt ){
                    _.deepExtend( this , opt );
                }
    
                this.sprite = new Canvax.Display.Sprite({
                    id : "AnchorSprite"
                });
            },
            setX:function($n){
                this.sprite.context.x = $n
            },
            setY:function($n){
                this.sprite.context.y = $n
            },
            draw:function(opt){
                this._initConfig( opt );
                
                if( this.enabled ){ 
                    this._widget();
                    this._layout();
                } 
            },
    
            //初始化配置
            _initConfig:function( opt ){
              	if( opt ){
                    _.deepExtend( this , opt );
                }
            },

            _widget:function(){
                var self = this
                var xLine = new Line({
                    id      : 'x',
                    context : {
                        xStart      : 0,
                        yStart      : 0,
                        xEnd        : self.w,
                        yEnd        : 0,
                        lineWidth   : self.xAxis.lineWidth,
                        strokeStyle : self.xAxis.fillStyle
                    }
                });
                this.sprite.addChild(xLine);
                xLine.context.y = self.pos.y

                var yLine = new Line({
                    id      : 'y',
                    context : {
                        xStart      : 0,
                        yStart      : 0,
                        xEnd        : 0,
                        yEnd        : self.h,
                        lineWidth   : self.yAxis.lineWidth,
                        strokeStyle : self.yAxis.fillStyle
                    }
                });
                this.sprite.addChild(yLine);
                yLine.context.x = self.pos.x
            },
            _layout:function(){

            }           
        };
    
        return Anchor;
    
    } 
)
