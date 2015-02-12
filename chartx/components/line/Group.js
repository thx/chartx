define(
    "chartx/components/line/Group" ,
    [
        "canvax/index",
        "canvax/shape/BrokenLine",
        "canvax/shape/Circle",
        "canvax/shape/Path",
        "chartx/utils/tools",
        "chartx/utils/colorformat",
        "chartx/utils/deep-extend"
    ],
    function( Canvax, BrokenLine, Circle, Path, Tools , ColorFormat ){
        window.Canvax = Canvax
        var Group = function( a , opt , ctx){
            this._groupInd = a;
            this.ctx       = ctx;
            this.w         = 0;   
            this.h         = 0; 
            this.y         = 0;

            this.colors    = ['#26b471', '#7aa1ff', '#fa8529', '#ff7c4d','#2494ed','#7aa1ff','#fa8529', '#ff7c4d'],

            this.line      = {                     //线
                strokeStyle : {
                    normal  : this.colors[ this._groupInd ],
                    over    : this.colors[ this._groupInd ]
                },
                smooth      : true
            }


            this.node     = {                     //节点 
                enabled     : 1,  //是否有
                control     : function(){}, 
                mode        : 0,  //模式[0 = 都有节点 | 1 = 拐角才有节点]
                r           : {   //半径 node 圆点的半径
                    normal  : 2,  //[2,2,2,2,2,2,2],
                    over    : 3   //[3,3,3,3,3,3,3]
                },
                fillStyle   :{//填充
                    normal  : '#ffffff',//['#FFFFFF', '#FFFFFF', '#FFFFFF','#FFFFFF', '#FFFFFF'],
                    over    : '#ffffff'
                },
                strokeStyle :{//轮廓颜色
                    normal  : this.line.strokeStyle.normal,
                    over    : this.line.strokeStyle.over
                },
                lineWidth   : {//轮廓粗细
                    normal  : 2, //[2,2,2,2,2,2,2],
                    over    : 2  //[2,2,2,2,2,2,2]
                }
            }
    
            this.fill    = {                     //填充
                fillStyle : {
                    normal  : this.line.strokeStyle.normal,
                    over    : this.line.strokeStyle.over
                },
                alpha       : 0.1
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
            //styleType , normals , groupInd
            _getColor : function( s ){
                var color = this._getProp( s );
                if( !color || color == "" ){
                    color = this.colors[ this._groupInd ];
                }
                return color;
            },
            _getProp : function( s ){
                if( _.isArray( s ) ){
                    return s[ this._groupInd ]
                }
                if( _.isFunction( s ) ){
                    return s( {
                        iGroup : this._groupInd
                    } );
                }
                return s
            },
            //这个是tips需要用到的 
            getNodeInfoAt:function($index){
                var self = this;
                var o = _.clone(self.data[$index])
                if( o ){
                    o.r           = self._getProp(self.node.r.over);
                    o.fillStyle   = self._getColor(self.node.fillStyle.over);
                    o.strokeStyle = self._getColor(self.node.strokeStyle.over);
                    o.color       = self._getColor(self.node.strokeStyle.over); //这个给tips里面的文本用
                    o.lineWidth   = self._getProp(self.node.lineWidth.over);
                    o.alpha       = self._getProp(self.fill.alpha);
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
                };
                
                var bline = new BrokenLine({               //线条
                    context : {
                        pointList   : list,
                        strokeStyle : self._getColor( self.line.strokeStyle.normal ),//self.line.strokeStyle.normal,
                        lineWidth   : 2,
                        y           : self.y,
                        smooth      : self.line.smooth 
                    }
                });
                self.sprite.addChild( bline );
                

                //从bline中找到最高的点

                var topP = _.min( bline.context.pointList , function(p){return p[1]} );
                //创建一个线性渐变
                var fill_gradient  =  self.ctx.createLinearGradient(topP[0],topP[1],topP[0],0);

                var rgb  = ColorFormat.colorRgb( self._getColor( self.fill.fillStyle.normal ) );
                var rgba0 = rgb.replace(')', ', '+ self._getProp( self.fill.alpha ) +')').replace('RGB', 'RGBA');
                fill_gradient.addColorStop( 0 , rgba0 );

                var rgba1 = rgb.replace(')', ', 0)').replace('RGB', 'RGBA');
                fill_gradient.addColorStop( 1 , rgba1 );

                var fill = new Path({            //填充
                    context : {
                        path        : self._fillLine( bline ), 
                        fillStyle   : fill_gradient,//self._getColor( self.fill.fillStyle.normal ),
                        globalAlpha : 1//self._getProp( self.fill.alpha )
                    }
                });
                self.sprite.addChild( fill );  

                
                // var node =  new Canvax.Display.Sprite();
                // self.sprite.addChild(node)
                if(self.node.enabled){                     //拐角的圆点
                    for(var a = 0,al = self.data.length; a < al; a++){
                        var o = self.data[a]
                        var circle = new Circle({
                            id : "circle",
                            context : {
                                x           : o.x,
                                y           : o.y,
                                r           : self._getProp( self.node.r.normal ),
                                fillStyle   : self._getColor( self.node.fillStyle.normal ),
                                strokeStyle : self._getColor( self.node.strokeStyle.normal ),
                                lineWidth   : self._getProp( self.node.lineWidth.normal )
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
