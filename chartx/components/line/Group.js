define(
    "chartx/components/line/Group" ,
    [
        "canvax/index",
        "canvax/shape/BrokenLine",
        "canvax/shape/Circle",
        "canvax/shape/Path",
        "chartx/utils/tools",
        "chartx/utils/deep-extend"
    ],
    function( Canvax, BrokenLine, Circle, Path, Tools){
        var Group = function(opt){
            this.w       = 0;   
            this.h       = 0; 
            this.y       = 0;
            

            this.node    = {
                enabled : 0
            }
            this.line    = {
                    strokeStyle  : '#FF0000',
            }
    
            this.fill    = {
                    strokeStyle  : '#FF0000',
                    alpha        : 1
            }
    
            this.data       = [];                          //[{x:0,y:-100},{}]
            this.sprite     = null;                        
    
            this.init( opt )
        };
    
        Group.prototype = {
            init:function(opt){
                _.deepExtend( this , opt );
                this.sprite = new Canvax.Display.Sprite();
            },
            setX:function($n){
                this.sprite.context.x = $n
            },
            setY:function($n){
                this.sprite.context.y = $n
            },
    
            draw:function(opt){
                var self  = this;
                _.deepExtend( this , opt );
                self._widget()
            },
            getNodeInfoAt:function($index){
                var self = this
                var o = _.clone(self.data[$index])
                if( o ){
                    o.fillStyle = self.line.strokeStyle 
                    o.alpha = self.fill.alpha
                    return o
                } else {
                    return null
                }
            },
            _widget:function(){
                var self  = this;
    
                var list = []
                for(var a = 0,al = self.data.length; a < al; a++){
                    var o = self.data[a]
                    list.push([o.x, o.y])
                }
                var bline = new BrokenLine({               //线条
                    context : {
                        pointList   : list,
                        strokeStyle : self.line.strokeStyle,
                        lineWidth   : 2,
                        y           : self.y,
                        smooth      : this.smooth 
                    }
                });
    
                self.sprite.addChild( bline );
                
                self.sprite.addChild(new Path({            //填充
                    context : {
                        path        : self._fillLine( bline ), 
                        fillStyle   : self.fill.strokeStyle,
                        globalAlpha : self.fill.alpha
                    }
                }))

                // var node =  new Canvax.Display.Sprite();
                // self.sprite.addChild(node)
                if(self.node.enabled){
                    for(var a = 0,al = self.data.length; a < al; a++){
                        var o = self.data[a]
                        var circle = new Circle({
                            id : "circle",
                            context : {
                                x : o.x,
                                y : o.y,
                                r : 3,
                                fillStyle   : '#ffffff',
                                strokeStyle : self.line.strokeStyle,
                                lineWidth   : 2
                            }
                        });
                        self.sprite.addChild( circle );
                    }
                }
            },
            _fillLine:function( bline ){                        //填充直线
                var fillPath = _.clone( bline.context.pointList );
                fillPath.push( 
                    [ fillPath[ bline.pointsLen -1 ][0] , -1.5 ],
                    [ fillPath[0][0] , -1.5 ],
                    [ fillPath[0][0] , fillPath[0][1] ]
                );
                
                return Tools.getPath(fillPath);
    
                var d = Tools.getPath(arr)
                d += ' ' + L + ' ' + (Number(arr[arr.length - 1].x)) + ' ' + (-1.5)
                d += ' ' + L + ' ' + (Number(arr[0].x)) + ' ' + (-1.5)
                d += ' ' + L + ' ' + (Number(arr[0].x)) + ' ' + (Number(arr[0].y))
    
                return d
            }
        };
        return Group;
    }
)
