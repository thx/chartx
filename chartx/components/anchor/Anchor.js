define(
    "chartx/components/anchor/Anchor" , 
    [
        "canvax/index",
        "canvax/shape/Line",
        "canvax/shape/Circle"
    ],
    function(Canvax, Line, Circle){
        var Anchor = function(opt){
            this.w = 0;
            this.h = 0;
    
            this.enabled = 0 ; //1,0 true ,false 

            this.xAxis   = {
                lineWidth   : 1,
                fillStyle   : '#0088cf',
                lineType    : "dashed"
            }
            this.yAxis   = {
                lineWidth   : 1,
                fillStyle   : '#0088cf',
                lineType    : "dashed"
            }
            this.node    = {
                enabled     : 1,                 //是否有
                r           : 2,                 //半径 node 圆点的半径
                fillStyle   : '#0088cf',
                strokeStyle : '#0088cf',
                lineWidth   : 2
            }

            this.pos     = {
                x           : 0,
                y           : 0
            }   
            this.cross   = {
                x           : 0,
                y           : 0
            }

            this.sprite  = null;

            this.init( opt );
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
            draw:function(opt){
                this._initConfig( opt );
                this.sprite.context.x = this.pos.x;
                this.sprite.context.y = this.pos.y;
                if( this.enabled ){ 
                    this._widget();
                } 
            },
    
            //初始化配置
            _initConfig:function( opt ){
              	if( opt ){
                    _.deepExtend( this , opt );
                }
            },
            resetCross : function( cross ){
                this._xLine.context.yStart = cross.y;
                this._xLine.context.yEnd   = cross.y;
                this._yLine.context.xStart = cross.x;
                this._yLine.context.xEnd   = cross.x;

                var nodepos = this.sprite.localToGlobal( cross );
                this._circle.context.x     = nodepos.x;
                this._circle.context.y     = nodepos.y;
            },
            _widget:function(){
                var self = this
                self._xLine = new Line({
                    id      : 'x',
                    context : {
                        xStart      : 0,
                        yStart      : self.cross.y,
                        xEnd        : self.w,
                        yEnd        : self.cross.y,
                        lineWidth   : self.xAxis.lineWidth,
                        strokeStyle : self.xAxis.fillStyle,
                        lineType    : self.xAxis.lineType
                    }
                });
                this.sprite.addChild(self._xLine);

                self._yLine = new Line({
                    id      : 'y',
                    context : {
                        xStart      : self.cross.x,
                        yStart      : 0,
                        xEnd        : self.cross.x,
                        yEnd        : self.h,
                        lineWidth   : self.yAxis.lineWidth,
                        strokeStyle : self.yAxis.fillStyle,
                        lineType    : self.yAxis.lineType
                    }
                });
                this.sprite.addChild(self._yLine);

                var nodepos = this.sprite.localToGlobal({x : this.cross.x ,  y: this.cross.y });
                self._circle = new Circle({
                    context : {
                        x           : parseInt(nodepos.x),
                        y           : parseInt(nodepos.y),
                        r           : self._getProp( self.node.r ),
                        fillStyle   : self._getProp( self.node.fillStyle ) || "#ff0000",
                        strokeStyle : self._getProp( self.node.strokeStyle ) || '#cc3300',
                        lineWidth   : self._getProp( self.node.lineWidth ) || 4
                    }
                });
                this.sprite.getStage().addChild(self._circle);
            },
            _getProp : function( s ){
                if( _.isFunction( s ) ){
                    return s();
                }
                return s
            }           
        };
    
        return Anchor;
    
    } 
)
