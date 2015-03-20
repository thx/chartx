define(
    "chartx/components/line/Group" ,
    [
        "canvax/index",
        "canvax/shape/BrokenLine",
        "canvax/shape/Circle",
        "canvax/shape/Path",
        "chartx/utils/tools",
        "chartx/utils/colorformat",
        "canvax/animation/Tween",
    ],
    function( Canvax, BrokenLine, Circle, Path, Tools , ColorFormat , Tween ){
        window.Canvax = Canvax
        var Group = function( a , opt , ctx){
            this._groupInd = a;
            this._nodeInd  = -1;
            this.ctx       = ctx;
            this.w         = 0;   
            this.h         = 0; 
            this.y         = 0;

            this.colors    = ['#26b471', '#7aa1ff', '#fa8529', '#ff7c4d','#2494ed','#7aa1ff','#fa8529', '#ff7c4d'],

            this.line      = {                     //线
                strokeStyle : {
                    normal  : this.colors[ this._groupInd ],
                    over    : null//this.colors[ this._groupInd ]
                },
                smooth      : true
            }


            this.node     = {                     //节点 
                enabled     : 1,  //是否有
                control     : function(){}, 
                mode        : 0,  //模式[0 = 都有节点 | 1 = 拐角才有节点]
                r           : {   //半径 node 圆点的半径
                    normal  : 2,  
                    over    : 3  
                },
                fillStyle   :{//填充
                    normal  : '#ffffff',
                    over    : '#ffffff'
                },
                strokeStyle :{//轮廓颜色
                    normal  : null,
                    over    : null
                },
                lineWidth   : {//轮廓粗细
                    normal  : 2, 
                    over    : 2 
                }
            }
    
            this.fill    = {                     //填充
                fillStyle : {
                    normal  : null, 
                    over    : null 
                },
                gradient    : true,
                alpha       : 0.1
            }
    
            this.data       = [];                          //[{x:0,y:-100},{}]
            this.sprite     = null;                        
           

            this._pointList = [];//brokenline最终的状态
            this._currPointList = [];//brokenline 动画中的当前状态

            this.init( opt )
        };
    
        Group.prototype = {
            init:function(opt){
                _.deepExtend( this , opt );

                if( !this.line.strokeStyle.over ){
                    this.line.strokeStyle.over = this.line.strokeStyle.normal;
                }

                //如果opt中没有node fill的设置，那么要把fill node 的style和line做同步
                !this.node.strokeStyle.normal && ( this.node.strokeStyle.normal = this.line.strokeStyle.normal );
                !this.node.strokeStyle.over   && ( this.node.strokeStyle.over   = this.line.strokeStyle.over   );
                !this.fill.fillStyle.normal   && ( this.fill.fillStyle.normal   = this.line.strokeStyle.normal );
                !this.fill.fillStyle.over     && ( this.fill.fillStyle.over     = this.line.strokeStyle.over   );
      
                this.sprite = new Canvax.Display.Sprite();
            },
            draw:function(opt){
                _.deepExtend( this , opt );
                this._widget();
            },
            update : function(opt){
                _.deepExtend( this , opt );
                var list = [];
                for(var a = 0,al = this.data.length; a < al; a++){
                    var o = this.data[a];
                    list.push([ o.x , o.y ]);
                };
                this._pointList = list; 
                this._grow();
            },
            //自我销毁
            destroy : function(){
                this.sprite.remove();
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
                        iGroup : this._groupInd,
                        iNode  : this._nodeInd
                    } );
                }
                return s
            },
            //这个是tips需要用到的 
            getNodeInfoAt:function($index){
                var self = this;
                self._nodeInd = $index
                var o = _.clone(self.data[$index])
                if( o ){
                    o.r           = self._getProp(self.node.r.over);
                    o.fillStyle   = self._getProp(self.node.fillStyle.over) || "#ffffff";
                    o.strokeStyle = self._getProp(self.node.strokeStyle.over) || self._getColor( self.line.strokeStyle.over );
                    o.color       = self._getProp(self.node.strokeStyle.over) || self._getColor( self.line.strokeStyle.over ); //这个给tips里面的文本用
                    o.lineWidth   = self._getProp(self.node.lineWidth.over) || 2; 
                    o.alpha       = self._getProp(self.fill.alpha);
                    // o.fillStyle = '#cc3300'
                    // console.log(o.fillStyle)
                    return o
                } else {
                    return null
                }
            },
            _grow : function(){
                var self  = this;
                var timer = null;
                var growAnima = function(){
                   var bezierT = new Tween.Tween( self._getPointY( self._currPointList ) )
                   .to( self._getPointY( self._pointList ), 1500 )
                   .easing( Tween.Easing.Quintic.Out )
                   .onUpdate( function (  ) {

                       for( var p in this ){
                           self._currPointList[ parseInt( p.split("_")[1] ) ][1] = this[p];
                       };
                       self._bline.context.pointList = _.clone(self._currPointList);
                       self._fill.context.path       = self._fillLine( self._bline );
                       _.each( self._circles.children , function( circle , i ){
                           var ind = parseInt(circle.id.split("_")[1]);
                           circle.context.y = self._currPointList[ ind ][1];
                       } );

                   } ).onComplete( function(){
                       cancelAnimationFrame( timer );
                   }).start();
                   animate();
                };
                function animate(){
                    timer    = requestAnimationFrame( animate ); 
                    Tween.update();
                };
                growAnima();

            },
            _getPointY : function( list ){
                var obj = {};
                _.each( list , function( p , i ){
                    obj["p_"+i] = p[1]
                } );
                return obj;
            },
            _widget:function(){
                var self  = this;
   
                var list = [];
                for(var a = 0,al = self.data.length; a < al; a++){
                    var o = self.data[a];
                    list.push([
                        o.x ,
                        o.y
                    ]);
                };
                self._pointList = list;

                list = [];
                for(var a = 0,al = self.data.length; a < al; a++){
                    var o = self.data[a];
                    list.push([ 
                        o.x ,
                        self.data[0].y
                    ]);
                };
                self._currPointList = list;


                var bline = new BrokenLine({               //线条
                    id : "brokenline_" + self._groupInd,
                    context : {
                        pointList   : list,
                        strokeStyle : self._getColor( self.line.strokeStyle.normal ),//self.line.strokeStyle.normal,
                        lineWidth   : 2,
                        y           : self.y,
                        smooth      : self.line.smooth 
                    },
                    //smooth为true的话，折线图需要对折线做一些纠正，不能超过底部
                    smoothFilter    : function( rp ){
                        if( rp[1] > 0 ) {
                            rp[1] = 0;
                        }
                    }
                });
                self.sprite.addChild( bline );
                self._bline = bline;
                

                var fill_gradient = null;
                if( self.fill.gradient ){
                    //从bline中找到最高的点
                    var topP = _.min( bline.context.pointList , function(p){return p[1]} );
                    //创建一个线性渐变
                    fill_gradient  =  self.ctx.createLinearGradient(topP[0],topP[1],topP[0],0);

                    var rgb  = ColorFormat.colorRgb( self._getColor( self.fill.fillStyle.normal ) );
                    var rgba0 = rgb.replace(')', ', '+ self._getProp( self.fill.alpha ) +')').replace('RGB', 'RGBA');
                    fill_gradient.addColorStop( 0 , rgba0 );

                    var rgba1 = rgb.replace(')', ', 0)').replace('RGB', 'RGBA');
                    fill_gradient.addColorStop( 1 , rgba1 );
                }

                var fill = new Path({            //填充
                    context : {
                        path        : self._fillLine( bline ), 
                        fillStyle   : fill_gradient || self._getColor( self.fill.fillStyle.normal ),
                        globalAlpha : fill_gradient ? 1 : self.fill.alpha//self._getProp( self.fill.alpha )
                    }
                });
                self.sprite.addChild( fill );
                self._fill = fill;

                
                // var node =  new Canvax.Display.Sprite();
                // self.sprite.addChild(node)
                if(self.node.enabled){                     //拐角的圆点
                    this._circles = new Canvax.Display.Sprite({ id : "circles"});
                    this.sprite.addChild(this._circles);
                    for(var a = 0,al = self.data.length; a < al; a++){
                        self._nodeInd = a;
                        var circle = new Circle({
                            id : "circle_" + a,
                            context : {
                                x           : self._currPointList[a][0],
                                y           : self._currPointList[a][1],
                                r           : self._getProp( self.node.r.normal ),
                                fillStyle   : self._getProp( self.node.fillStyle.normal ) || "#ffffff",
                                strokeStyle : self._getProp( self.node.strokeStyle.normal ) || self._getColor( self.line.strokeStyle.normal ),
                                lineWidth   : self._getProp( self.node.lineWidth.normal ) || 2
                            }
                        });

                        self.node.control()

                        var nodeEnabled = true 
                        if( self.node.mode == 1 ){           //拐角才有节点
                            var value = self.data[a].value
                            var pre   = self.data[a - 1]
                            var next  = self.data[a + 1]
                            if(pre && next){
                                if(value == pre.value && value == next.value){
                                    nodeEnabled = false
                                }
                            }
                        }
                        if(nodeEnabled){
                            self._circles.addChild(circle);
                        }
                    }
                    self._nodeInd = -1
                }
            },
            _fillLine:function( bline ){                        //填充直线
                
                var fillPath = _.clone( bline.context.pointList );
                fillPath.push( 
                    [ fillPath[ fillPath.length -1 ][0] , -1.5 ],
                    [ fillPath[0][0] , -1.5 ],
                    [ fillPath[0][0] , fillPath[0][1] ]
                );
                
                return Tools.getPath(fillPath);

            }
        };
        return Group;
    }
)
