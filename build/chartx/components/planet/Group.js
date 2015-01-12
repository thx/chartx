define(
    "chartx/components/planet/Group" ,
    [
        "canvax/index",
        "canvax/shape/BrokenLine",
        "canvax/shape/Circle",
        "canvax/shape/Path",
        "chartx/utils/tools",
        "chartx/utils/deep-extend"
    ],
    function( Canvax, BrokenLine, Circle, Path, Tools){
        window.Canvax = Canvax
        var Group = function(opt){
            this.w       = 0;   
            this.h       = 0; 
            this.y       = 0;

            this.node    = {                     //节点 
                enabled     : 0,                           //是否有
                control     : function(){}, 
                mode        : 0,                           //模式[0 = 都有节点 | 1 = 拐角才有节点]
                r           : {                       //半径
                    normal       : 3,
                    over         : 3
                },
                fillStyle   : {                       //填充
                    normal       : '#ffffff',
                    over         : '#ffffff'
                },
                strokeStyle : {                       //轮廓颜色 
                    normal       : '',
                    over         : ''
                },
                lineWidth   : {                       //轮廓粗细
                    normal       : 2,
                    over         : 2
                }
            }
            this.line    = {                     //线
                strokeStyle : {
                    normal  : '',
                    over    : ''
                }
            }
    
            this.fill    = {                     //填充
                strokeStyle : {
                    normal       : '',
                    over         : ''
                },
                alpha       : 1
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
                    o.r = self.node.r.over
                    o.fillStyle = self.node.fillStyle.over
                    o.strokeStyle = self.node.strokeStyle.over
                    o.lineWidth = self.node.lineWidth.over
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
                        strokeStyle : self.line.strokeStyle.normal,
                        lineWidth   : 2,
                        y           : self.y,
                        smooth      : this.smooth 
                    }
                });
                self.sprite.addChild( bline );
                
                self.sprite.addChild(new Path({            //填充
                    context : {
                        path        : self._fillLine( bline ), 
                        fillStyle   : self.fill.strokeStyle.normal,
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
                                x           : o.x,
                                y           : o.y,
                                r           : self.node.r.normal,
                                fillStyle   : self.node.fillStyle.normal   || '#FFFFFF',
                                strokeStyle : self.node.strokeStyle.normal || self.line.strokeStyle.normal,
                                lineWidth   : self.node.lineWidth.normal
                            }
                        });

                        self.node.control()

                        var nodeEnabled = true 
                        if(self.node.mode == 1){           //拐角才有节点
                            var value = o.value
                            var pre   = self.data[a - 1]
                            var next  = self.data[a + 1]
                            if(pre && next){
                                if(value == pre.value && value == next.value){
                                    nodeEnabled = false
                                }
                            }
                        }
                        if(nodeEnabled){
                            self.sprite.addChild(circle);
                        }
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
