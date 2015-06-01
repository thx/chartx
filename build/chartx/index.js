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
                fillStyle   : '#cc3300'
            }
            this.yAxis   = {
                lineWidth   : 1,
                fillStyle   : '#cc3300'
            }
            this.node    = {
                enabled     : 1,                 //是否有
                r           : 2,                 //半径 node 圆点的半径
                fillStyle   : '#cc3300',
                strokeStyle : '#cc3300',
                lineWidth   : 4
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

            _widget:function(){
                var self = this
                var xLine = new Line({
                    id      : 'x',
                    context : {
                        xStart      : 0,
                        yStart      : self.cross.y,
                        xEnd        : self.w,
                        yEnd        : self.cross.y,
                        lineWidth   : self.xAxis.lineWidth,
                        strokeStyle : self.xAxis.fillStyle
                    }
                });
                this.sprite.addChild(xLine);

                var yLine = new Line({
                    id      : 'y',
                    context : {
                        xStart      : self.cross.x,
                        yStart      : 0,
                        xEnd        : self.cross.x,
                        yEnd        : self.h,
                        lineWidth   : self.yAxis.lineWidth,
                        strokeStyle : self.yAxis.fillStyle
                    }
                });
                this.sprite.addChild(yLine);

                var nodepos = this.sprite.localToGlobal({x : this.cross.x ,  y: this.cross.y });
                var circle = new Circle({
                    context : {
                        x           : parseInt(nodepos.x),
                        y           : parseInt(nodepos.y),
                        r           : self._getProp( self.node.r ),
                        fillStyle   : self._getProp( self.node.fillStyle ) || "#ff0000",
                        strokeStyle : self._getProp( self.node.strokeStyle ) || '#cc3300',
                        lineWidth   : self._getProp( self.node.lineWidth ) || 4
                    }
                });
                this.sprite.getStage().addChild(circle);
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
                    strokeStyle : '#e5e5e5'
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
                            layoutData : self.xAxis.data,
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
                            layoutData : self.yAxis.data,
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


define(
    "chartx/components/line/Graphs" ,
    [
        "canvax/index",
        "canvax/shape/Rect",
        "chartx/utils/tools",
        "chartx/components/line/Group"
    ],
    function( Canvax , Rect, Tools, Group ){
        var Graphs = function(opt,root){
            this.w       = 0;   
            this.h       = 0; 
            this.y       = 0;

            //这里所有的opt都要透传给group
            this.opt     = opt;
            this.root    = root;
            this.ctx     = root.stage.context2D

            this.data    = [];                          //二维 [[{x:0,y:-100,...},{}],[]]
            this.disX    = 0;                           //点与点之间的间距
            this.groups  = [];                          //群组集合     
    
            this.iGroup  = 0;                           //群组索引(哪条线)
            this.iNode   = -1;                          //节点索引(那个点)
    
            this.sprite  = null;  
            this.induce  = null;                         

            this.init(opt);
        };
    
        Graphs.prototype = {
    
            init:function(opt){
                this.opt = opt;
                this.sprite = new Canvax.Display.Sprite();
            },
            setX:function($n){
                this.sprite.context.x = $n
            },
            setY:function($n){
                this.sprite.context.y = $n
            },
            getX:function(){
                return this.sprite.context.x
            },
            getY:function(){
                return this.sprite.context.y
            },
    
            draw:function(opt){
                _.deepExtend( this , opt );
                this._widget( opt );
            },
            /**
             * 生长动画
             */
            grow : function(){
                _.each(this.groups , function( g , i ){
                    g._grow();
                });
            },
            /*
             *@params opt
             *@params ind 最新添加的数据所在的索引位置
             **/
            add : function( opt , ind ){
                var self = this;
                _.deepExtend( this , opt );
                var group = new Group(
                    ind , //_groupInd
                    self.opt,
                    self.ctx
                );
                
                group.draw({
                    data       : ind > self.data.length-1 ? self.data[self.data.length-1]: self.data[ind]
                });
                self.sprite.addChildAt(group.sprite , ind);
                self.groups.splice(ind , 0 , group);

                _.each(this.groups , function( g , i ){
                    //_groupInd要重新计算
                    g._groupInd = i;
                    g.update({
                        data : self.data[i]
                    });
                });

            },
            /*
             *删除 ind
             **/
            remove : function( i ){
                var target = this.groups.splice( i , 1 )[0];
                target.destroy();    
            },
            /*
             * 更新下最新的状态
             **/
            update : function( opt ){
                _.deepExtend( this , opt );
                //剩下的要更新下位置
                var self = this;
                _.each(this.groups , function( g , i ){
                    g.update({
                        data : self.data[i]
                    });
                });
            },
            _widget:function( opt ){
                var self  = this;
                
                for(var a = 0,al = self.data.length; a < al; a++){
                    var group = new Group(
                        a , //_groupInd
                        self.opt,
                        self.ctx
                    );
                    
                    group.draw({
                        data       : self.data[a]
                    })
                    self.sprite.addChild(group.sprite);
                    self.groups.push(group);
                    
                }
                
                self.induce = new Rect({
                    id    : "induce",
                    context:{
                        y           : -self.h,
                        width       : self.w,
                        height      : self.h,
                        fillStyle   : '#000000',
                        globalAlpha : 0,
                        cursor      : 'pointer'
                    }
                });

                self.sprite.addChild(self.induce);
    
                self.induce.on("panstart mouseover", function(e){
                    e.tipsInfo = self._getInfoHandler(e);
                    self._fireHandler(e)
                })
                self.induce.on("panmove mousemove", function(e){
                    e.tipsInfo = self._getInfoHandler(e);
                    self._fireHandler(e)
                })
                self.induce.on("panend mouseout", function(e){
                    e.tipsInfo = self._getInfoHandler(e);
                    self._fireHandler(e)
                    self.iGroup = 0, self.iNode = -1
                })
                self.induce.on("tap click", function(e){
                    e.tipsInfo = self._getInfoHandler(e);
                    self._fireHandler(e)
                })
            },
            _getInfoHandler:function(e){
                var x = e.point.x, y = e.point.y - this.h;
                //todo:底层加判断
                x = x > this.w ? this.w : x
                var tmpINode = this.disX == 0 ? 0 : parseInt( (x + (this.disX / 2) ) / this.disX  );

                var _nodesInfoList = [];                 //节点信息集合
                var tmpIGroup = Tools.getDisMinATArr(y, _.pluck(_nodesInfoList , "y" ));
                for (var a = 0, al = this.groups.length; a < al; a++ ) {
                    var o = this.groups[a].getNodeInfoAt(tmpINode)
                    o && _nodesInfoList.push(o);
                };

                this.iGroup = tmpIGroup, this.iNode = tmpINode
                var node = {
                    iGroup        : this.iGroup,
                    iNode         : this.iNode,
                    nodesInfoList : _.clone(_nodesInfoList)
                };
                return node;
            },
            _fireHandler:function(e){
                var self = this;
                var o = {
                    eventType : e.type,
                    iGroup    : e.tipsInfo.iGroup,
                    iNode     : e.tipsInfo.iNode 
                };
                if(_.isFunction(self.root.event.on)){
                    self.root.event.on(o);
                };
            }
        };
    
        return Graphs;
    
    } 
)


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
            this._groupInd  = a;
            this._nodeInd   = -1;
            this.ctx        = ctx;
            this.w          = 0;   
            this.h          = 0; 
            this.y          = 0;

            this.colors     = ["#42a8d7",'#666666','#26b471', '#7aa1ff', '#fa8529', '#ff7c4d','#2494ed','#7aa1ff','#fa8529', '#ff7c4d'],

            this.line       = {                   //线
                enabled     : 1,
                strokeStyle : this.colors[ this._groupInd ],
                lineWidth   : 2,
                smooth      : true
            }


            this.node     = {                     //节点 
                enabled     : 1,                       //是否有
                corner      : false,                   //模式[false || 0 = 都有节点 | true || 1 = 拐角才有节点]
                r           : 2,                       //半径 node 圆点的半径
                fillStyle   : '#ffffff',
                strokeStyle : null,
                lineWidth   : 2
            }
    
            this.fill    = {                      //填充
                fillStyle   : null,
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

                //如果opt中没有node fill的设置，那么要把fill node 的style和line做同步
                !this.node.strokeStyle && ( this.node.strokeStyle = this.line.strokeStyle );
                !this.fill.fillStyle   && ( this.fill.fillStyle   = this.line.strokeStyle );
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
                self._nodeInd = $index;
                var o = _.clone(self.data[$index])
                if( o ){
                    o.r           = self._getProp(self.node.r);
                    o.fillStyle   = self._getProp(self.node.fillStyle) || "#ffffff";
                    o.strokeStyle = self._getProp(self.node.strokeStyle) || self._getColor( self.line.strokeStyle );
                    o.color       = self._getProp(self.node.strokeStyle) || self._getColor( self.line.strokeStyle ); //这个给tips里面的文本用
                    o.lineWidth   = self._getProp(self.node.lineWidth) || 2; 
                    o.alpha       = self._getProp(self.fill.alpha);
                    
                    o._groupInd   = self._groupInd;
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
                if( self._currPointList.length == 0 ){
                    return;
                }
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
                       self._circles && _.each( self._circles.children , function( circle , i ){
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
            _isNotNum : function( val ){
                return isNaN(val) || val === null || val === "" 
            },
            _filterEmptyValue : function( list ){
                
                //从左边开始 删除 value为非number的item
                for( var i=0,l=list.length ; i<l ; i++ ){
                    if( this._isNotNum(list[i].value) ){
                        list.shift();
                        l --;
                        i --;
                    } else {
                        break;
                    }
                };

                //从右边开始删除 value为非number的item
                for( var i=list.length-1 ; i > 0 ; i-- ){
                    if( this._isNotNum(list[i].value) ){
                        list.pop();
                    } else {
                        break;
                    }
                };
            },
            _widget:function(){
                var self  = this;

                self._filterEmptyValue( self.data );
            
                if( self.data.length == 0 ){
                    //filter后，data可能length==0
                    return;
                }

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
                        strokeStyle : self._getColor( self.line.strokeStyle ),
                        lineWidth   : self.line.lineWidth,
                        y           : self.y,
                        smooth      : self.line.smooth,
                        //smooth为true的话，折线图需要对折线做一些纠正，不能超过底部
                        smoothFilter    : function( rp ){
                            if( rp[1] > 0 ) {
                                rp[1] = 0;
                            }
                        }
                    }
                });
                if(!this.line.enabled){
                    bline.context.visible = false
                }
                self.sprite.addChild( bline );
                self._bline = bline;
                

                var fill_gradient = null;
                if( _.isArray( self.fill.alpha ) ){

                    //alpha如果是数据，那么就是渐变背景，那么就至少要有两个值
                    self.fill.alpha.length = 2 ;
                    if( self.fill.alpha[0] == undefined ){
                        self.fill.alpha[0] = 0;
                    };
                    if( self.fill.alpha[1] == undefined ){
                        self.fill.alpha[1] = 0;
                    };

                    //从bline中找到最高的点
                    var topP = _.min( bline.context.pointList , function(p){return p[1]} );
                    //创建一个线性渐变
                    fill_gradient  =  self.ctx.createLinearGradient(topP[0],topP[1],topP[0],0);

                    var rgb  = ColorFormat.colorRgb( self._getColor( self.fill.fillStyle ) );
                    var rgba0 = rgb.replace(')', ', '+ self._getProp( self.fill.alpha[0] ) +')').replace('RGB', 'RGBA');
                    fill_gradient.addColorStop( 0 , rgba0 );

                    var rgba1 = rgb.replace(')', ', '+ self.fill.alpha[1] +')').replace('RGB', 'RGBA');
                    fill_gradient.addColorStop( 1 , rgba1 );
                }

                var fill = new Path({            //填充
                    context : {
                        path        : self._fillLine( bline ), 
                        fillStyle   : fill_gradient || self._getColor( self.fill.fillStyle ),
                        globalAlpha : fill_gradient ? 1 : self.fill.alpha//self._getProp( self.fill.alpha )
                    }
                });
                self.sprite.addChild( fill );
                self._fill = fill;

                
                // var node =  new Canvax.Display.Sprite();
                // self.sprite.addChild(node)
                if( (self.node.enabled || list.length==1) && !!self.line.lineWidth ){                     //拐角的圆点
                    this._circles = new Canvax.Display.Sprite({ id : "circles"});
                    this.sprite.addChild(this._circles);
                    for(var a = 0,al = list.length; a < al; a++){
                        self._nodeInd   = a;
                        var strokeStyle = self._getProp( self.node.strokeStyle ) || self._getColor( self.line.strokeStyle);
                        var circle = new Circle({
                            id : "circle_" + a,
                            context : {
                                x           : self._currPointList[a][0],
                                y           : self._currPointList[a][1],
                                r           : self._getProp( self.node.r ),
                                fillStyle   : list.length == 1 ? strokeStyle : self._getProp( self.node.fillStyle ) || "#ffffff",
                                strokeStyle : strokeStyle,
                                lineWidth   : self._getProp( self.node.lineWidth ) || 2
                            }
                        });


                        if( self.node.corner ){           //拐角才有节点
                            var value = list[a].value;
                            var pre   = list[a - 1];
                            var next  = list[a + 1];
                            if(pre && next){
                                if(value == pre.value && value == next.value){
                                    circle.context.visible = false;
                                }
                            }
                        };
                        self._circles.addChild(circle);
                    }
                    self._nodeInd = -1
                }
            },
            _fillLine:function( bline ){                        //填充直线
                
                var fillPath = _.clone( bline.context.pointList );
                fillPath.push( 
                    [ fillPath[ fillPath.length -1 ][0] , 0 ],
                    [ fillPath[0][0] , 0 ],
                    [ fillPath[0][0] , fillPath[0][1] ]
                );
                
                return Tools.getPath(fillPath);

            }
        };
        return Group;
    }
)


define(
    "chartx/components/planet/Graphs" ,
    [
        "canvax/index",
        "canvax/shape/Rect",
        "chartx/utils/tools",
        "canvax/animation/Tween",
        'chartx/components/planet/InfoCircle'
    ],
    function( Canvax , Rect, Tools, Tween , InfoCircle){
        var Graphs = function(opt, root){
            this.root       = root; 
            this.data       = [];                          //二维 [[o, o, ...],[]]
                                                           // o = {x:0, y:0, r:{normal:''}, ...}  见InfoCircle接口
            this.sprite     = null; 

            this.event      = {
                enabled       : 1
            }     
    
            this.init(opt)
        };
    
        Graphs.prototype = {
            init:function(opt){
                _.deepExtend(this, opt);
                this.sprite = new Canvax.Display.Sprite();
            },
            setX:function($n){
                this.sprite.context.x = $n
            },
            setY:function($n){
                this.sprite.context.y = $n
            },
            getX:function(){
                return this.sprite.context.x
            },
            getY:function(){
                return this.sprite.context.y
            },
    
            draw:function(opt){
                var self  = this;
                _.deepExtend(this, opt);
                self._widget()
            },
            _widget:function(){
                var self  = this;
                                /*
                var data = [ 
                    [ 
                        {x:self.cx, y:self.cy, r:{normal:50}, fillStyle:{normal:'#9a5fe2'}, text:{content:'品牌', fillStyle:{normal:'#ffffff'}, fontSize:{normal:16}}},
                      
                    ],
                    [ 
                        {x:189, y:145, r:{normal:50}, fillStyle:{normal:'#9a5fe2'}, text:{content:'测试1_1'}},
                        {x:170, y:300, r:{normal:30}, fillStyle:{normal:'#9a5fe2'}, text:{content:'测试1_2'}},
                      
                    ],
                    [
                        {x:307, y:123, r:{normal:60}, fillStyle:{normal:'#a275e9'}, text:{content:'测试2_1'}},
                    ],
                    [
                        {x:417, y:370, r:{normal:25}, fillStyle:{normal:'#b498e5'}, text:{content:'测试3_1'}},
                    ],
                ]
                */

                for(var a = 0, al = self.data.length; a < al; a++){
                    var groupSprite = new Canvax.Display.Sprite()
                                                           //如果是二维数组
                    if(self.data[0].length > 0){           
                        for(var b = 0, bl = self.data[a].length; b < bl; b++){
                            var o = self.data[a][b]
                            o.event = (o.event && o.event.enabled == 0) || self.event
                            var tmpX = o.x, tmpY = o.y
                            o.x = 0, o.y = 0
                            var circle = new InfoCircle(o, self.root, {ringID:a, ID:(b + 1), x:tmpX, y:tmpY})

                            circle.setX(tmpX), circle.setY(tmpY)
                            
                            if(o.enabled != 0){
                                groupSprite.addChild(circle.sprite)
                            }
                        }
                    }else{                                
                        var o = self.data[a]
                        o.event = self.event
                        var tmpX = o.x, tmpY = o.y
                        o.x = 0, o.y = 0

                        if(o.enabled != 0){
                            var circle = new InfoCircle(o, self.root, {ringID:a, x:tmpX, y:tmpY})
                            circle.setX(tmpX), circle.setY(tmpY)
                            groupSprite.addChild(circle.sprite)
                        }
                    }
                    self.sprite.addChild(groupSprite)
                }
            }
        };
        return Graphs;
    } 
)


define(
    "chartx/components/planet/InfoCircle",
    [
        "canvax/index",
        "canvax/shape/Circle",
        "canvax/shape/Rect"
    ],
    function(Canvax, Circle, Rect){
        var InfoCircle = function(opt, root, fire){
            this.root      = root;
            this.fire      = fire;
            this.x         = 0;
            this.y         = 0;
            this.r         = {                             //半径
                normal       : 30,
                over         : 3
            },
            this.fillStyle = {                             //填充
                normal       : '#ff0000',                       //为空时不填充
                over         : '#ff0000'
            },
            this.strokeStyle = {                           //轮廓颜色 
                normal       : '#000000',
                over         : '#000000'
            },
            this.lineWidth = {                             //轮廓粗细
                normal       : 0,
                over         : 0
            }
            this.globalAlpha = {                           //填充透明度
                normal       : 1,
                over         : 1
            }

            this.text      = {                        //文字
                content      : '', 
                place        : 'right',                    //位置(center = 居中  |  right = 右侧)[right]
                fillStyle    : {                           //填充
                    normal     : '#000000', 
                    over       : '#000000'
                },
                fontSize     : {                           //大小
                    normal     : 12,
                    over       : 12           
                }
            }
            this.event     = {
                enabled      : 0
            }

            this.sprite    = null;
            this.circle    = null;

            this.init(opt)
        };
    
        InfoCircle.prototype = {
            init:function(opt){
                _.deepExtend(this, opt);

                var self  = this;
                self.sprite = new Canvax.Display.Sprite();

                var circle = new Circle({                  //圆
                    id : "circle",
                    context : {
                        x           : self.x || 0,
                        y           : self.y || 0,
                        r           : self.r.normal || 30,
                        fillStyle   : self.fillStyle.normal,
                        strokeStyle : self.strokeStyle.normal || '000000',
                        lineWidth   : self.lineWidth.normal   || 0,
                        globalAlpha : self.globalAlpha.normal,
                        cursor      : self.event.enabled ? 'pointer' : ''
                    }
                });
                self.circle = circle
                self.sprite.addChild(circle);

                var txt = new Canvax.Display.Text(         //文字
                    self.text.content,
                   {
                    context : {
                        fillStyle    : self.text.fillStyle.normal,
                        fontSize     : self.text.fontSize.normal
                   }
                })
                self.sprite.addChild(txt)

                var x = self.r.normal + 2, y = self.y - parseInt(txt.getTextHeight() / 2)
                if(self.text.place == 'center'){
                    x = self.x - parseInt(txt.getTextWidth() / 2)
                }
                txt.context.x = x, txt.context.y = y

                if(self.text.content){                     //文字感应区
                    var rect = new Rect({
                        context:{
                            x           : x - 2,
                            y           : y,
                            width       : txt.getTextWidth() + 2,
                            height      : txt.getTextHeight(),
                            fillStyle   : '#000000',
                            globalAlpha : 0,
                            cursor      : self.event.enabled ? 'pointer' : ''
                        }
                    })
                    self.sprite.addChild(rect) 
                }
                if(self.event.enabled == 1){               //事件
                    self._event(circle)
                    if(rect){
                        self._event(rect)
                    }
                }
            },
            setX:function($n){
                this.sprite.context.x = $n
            },
            setY:function($n){
                this.sprite.context.y = $n
            },
            _event:function($o){
                var self = this
                $o.on("mouseover", function(e){
                    self._mouseoverHandler(e)
                })
                $o.on("mouseout", function(e){
                    self._mouseoutHandler(e)
                })
                $o.on("click", function(e){
                    self._clickHandler(e)
                })
            },
            _mouseoverHandler:function($e){
                var self = this
                self.sprite.parent.toFront()
                self.fire.eventType = 'mouseover'
                self.root.event.onClick(self.fire)
                self._induce(true)
            },
            _mouseoutHandler:function($e){
                var self = this
                self.fire.eventType = 'mouseout'
                self.root.event.onClick(self.fire)
                self._induce(false)
            },
            _clickHandler:function($e){
                var self = this
                self.fire.eventType = 'click'
                self.root.event.onClick(self.fire)
            },
            _induce:function($b){
                var self = this
                var base = 1.1
                if(self.r.normal <= 5){
                    base = 1.3
                }
                var scale = $b ? base : 1
                self.circle.context.scaleX = self.circle.context.scaleY = scale
            }
        };
        return InfoCircle
    } 
)


define(
    "chartx/components/tips/tip",
    [
         "canvax/index",
         "canvax/shape/Rect",
         "chartx/utils/tools"
    ],
    function( Canvax , Rect, Tools ){
        var Tip = function( opt , tipDomContainer ){
            this.tipDomContainer = tipDomContainer;
            this.cW      = 0;  //容器的width
            this.cH      = 0;  //容器的height
    
            this.dW      = 0;  //html的tips内容width
            this.dH      = 0;  //html的tips内容Height

            this.backR   = 5;  //背景框的 圆角 
    
            this.sprite  = null;
            this.content = null; //tips的详细内容

            this.fillStyle   = "#000000";
            this.text        = {
                fillStyle    : "#ffffff"
            };
            this.strokeStyle = null;
            this.lineWidth   = 1;
            this.alpha       = 0.5;
            
            this._tipDom = null;
            this._back   = null;

            this.offset = 10; //tips内容到鼠标位置的偏移量
        
            //所有调用tip的 event 上面 要附带有符合下面结构的tipsInfo属性
            //会deepExtend到this.indo上面来
            this.tipsInfo    = {
                //nodesInfoList : [],//[{value: , fillStyle : ...} ...]符合iNode的所有Group上面的node的集合
                //iGroup        : 0, //数据组的索引对应二维数据map的x
                //iNode         : 0  //数据点的索引对应二维数据map的y
            };
            this.prefix  = [];
            this.init(opt);
        }
        Tip.prototype = {
            init : function(opt){
                _.deepExtend( this , opt );
                this.sprite = new Canvax.Display.Sprite({
                    id : "TipSprite"
                });
            },
            show : function(e){
                this.hide();
                var stage = e.target.getStage();
                this.cW   = stage.context.width;
                this.cH   = stage.context.height;
    
                this._initContent(e);
                this._initBack(e);
                
                this.setPosition(e);

                this.sprite.toFront();
            },
            move : function(e){
                this._setContent(e);
                this._resetBackSize(e);
                this.setPosition(e);
            },
            hide : function(){
                this.sprite.removeAllChildren();
                this._removeContent();
            },
            /**
             *@pos {x:0,y:0}
             */
            setPosition : function( e ){
                if(!this._tipDom) return;
                var pos = e.pos || e.target.localToGlobal( e.point );
                var x   = this._checkX( pos.x + this.offset );
                var y   = this._checkY( pos.y + this.offset );

                var _backPos = this.sprite.parent.globalToLocal( { x : x , y : y} );
                this.sprite.context.x = _backPos.x;
                this.sprite.context.y = _backPos.y;
                this._tipDom.style.cssText += ";visibility:visible;left:"+x+"px;top:"+y+"px;";
            },
            /**
             *content相关-------------------------
             */
            _initContent : function(e){
                this._tipDom = document.createElement("div");
                this._tipDom.className = "chart-tips";
                this._tipDom.style.cssText += ";visibility:hidden;position:absolute;display:inline-block;*display:inline;*zoom:1;padding:6px;color:white;line-height:1.5"
                this.tipDomContainer.appendChild( this._tipDom );
                this._setContent(e);
            },
            _removeContent : function(){
                if(!this._tipDom){
                    return;
                }
                this.tipDomContainer.removeChild( this._tipDom );
                this._tipDom = null;
            },
            _setContent : function(e){
                if (!this._tipDom){
                    return;
                } 
                this._tipDom.innerHTML = this._getContent(e);
                this.dW = this._tipDom.offsetWidth;
                this.dH = this._tipDom.offsetHeight;
            },
            _getContent : function(e){
                _.deepExtend( this.tipsInfo , (e.tipsInfo || {}) );
                var tipsContent = _.isFunction(this.content) ? this.content( this.tipsInfo ) : this.content ;
                if( !tipsContent ){
                    tipsContent = this._getDefaultContent( this.tipsInfo );
                }
                return tipsContent;
            },
            _getDefaultContent : function( info ){
                var str  = "<table>";
                var self = this;
                _.each( info.nodesInfoList , function( node , i ){
                    str+= "<tr style='color:"+ self.text.fillStyle +"'>";
                    var prefixName = self.prefix[i];
                    if( prefixName ) {
                        str+="<td>"+ prefixName +"：</td>";
                    } else {
                        if( node.field ){
                            str+="<td>"+ node.field +"：</td>";
                        }
                    };

                    str += "<td>"+ Tools.numAddSymbol(node.value) +"</td></tr>";
                });
                str+="</table>";
                return str;
            },
            /**
             *Back相关-------------------------
             */
            _initBack : function(e){
                var opt = {
                    x : 0,
                    y : 0,
                    width  : this.dW,
                    height : this.dH,
                    lineWidth : this.lineWidth,
                    //strokeStyle : "#333333",
                    fillStyle : this.fillStyle,
                    radius : [ this.backR ],
                    globalAlpha  : this.alpha
                };

                if( this.strokeStyle ){
                    opt.strokeStyle = this.strokeStyle;
                }
               
                this._back = new Rect({
                    id : "tipsBack",
                    context : opt
                });
                this.sprite.addChild( this._back );
            },
            _resetBackSize:function(e){
                this._back.context.width  = this.dW;
                this._back.context.height = this.dH;
            },
    
            /**
             *获取back要显示的x
             *并且校验是否超出了界限
             */
            _checkX : function( x ){
                var w = this.dW + 2; //后面的2 是 两边的linewidth
                if( x < 0 ){
                    x = 0;
                }
                if( x + w > this.cW ){
                    x = this.cW - w;
                }
                return x
            },
    
            /**
             *获取back要显示的x
             *并且校验是否超出了界限
             */
            _checkY : function( y ){
                var h = this.dH + 2; //后面的2 是 两边的linewidth
                if( y < 0 ){
                    y = 0;
                }
                if( y + h > this.cH ){
                    y = this.cH - h;
                }
                return y
            }
        }
        return Tip
    } 
);


define(
    "chartx/components/xaxis/xAxis" , 
    [
        "canvax/index",
        "canvax/shape/Line",
        "chartx/utils/tools"
    ],
    function(Canvax, Line , Tools){
        var xAxis = function(opt , data){
            this.graphw = 0;
            this.graphh = 0;
            this.yAxisW = 0;
            this.w = 0;
            this.h = 0;
    
            this.disY       = 1;
            this.dis        = 6;                           //线到文本的距离
    
            this.line = {
                    enabled : 1,                           //是否有line
                    width   : 1,
                    height  : 4,
                    strokeStyle   : '#cccccc'
            }
    
            this.text = {
                    fillStyle : '#999999',
                    fontSize  : 12,
                    rotation  : 0,
                    format    : null,
                    textAlign : null
            }
            this.maxTxtH = 0;

            this.pos = {
                x  : null,
                y  : null
            }
    
            //this.display = "block";
            this.enabled = 1 ; //1,0 true ,false 
    
            this.disXAxisLine =  6;                        //x轴两端预留的最小值
            this.disOriginX   =  0;                        //背景中原点开始的x轴线与x轴的第一条竖线的偏移量
            this.xGraphsWidth =  0;                        //x轴宽(去掉两端)
    
            this.dataOrg     = [];                          //源数据
            this.dataSection = [];                          //默认就等于源数据
            this.data        = [];                          //{x:100, content:'1000'}
            this.layoutData  = [];                          //this.data(可能数据过多),重新编排过滤后的数据集合, 并根据此数组展现文字和线条
            this.sprite      = null;

            this._textMaxWidth = 0;
            this.leftDisX      = 0; //x轴最左边需要的间距。默认等于第一个x value字符串长度的一半

            //过滤器，可以用来过滤哪些yaxis 的 节点是否显示已经颜色之类的
            //@params params包括 dataSection , 索引index，txt(canvax element) ，line(canvax element) 等属性
            this.filter       =  null; //function(params){}; 
    
            this.init(opt , data);
        };
    
        xAxis.prototype = {
            init:function( opt , data ){
                this.dataOrg = data.org;
                
                if( opt ){
                    _.deepExtend( this , opt );
                }
    
                if(this.dataSection.length == 0){
                    this.dataSection = this._initDataSection( this.dataOrg );
                }

                if(!this.line.enabled){
                    this.line.height = 1
                }

                this.sprite = new Canvax.Display.Sprite({
                    id : "xAxisSprite"
                });
                
                this._getTextMaxWidth();
                this._checkText(); 
    
            },
            /**
             *return dataSection 默认为xAxis.dataOrg的的faltten
             *即 [ [1,2,3,4] ] -- > [1,2,3,4]
             */
            _initDataSection : function( data ){
                return _.flatten(data);
            },
            setX:function($n){
                this.sprite.context.x = $n
            },
            setY:function($n){
                this.sprite.context.y = $n
            },
            draw:function(opt){
                // this.data = [{x:0,content:'0000'},{x:100,content:'10000'},{x:200,content:'20000'},{x:300,content:'30000'},{x:400,content:'0000'},{x:500,content:'10000'},{x:600,content:'20000'}]
                this._initConfig( opt );
                this.data = this._trimXAxis( this.dataSection , this.xGraphsWidth );
                this._trimLayoutData();

                this.setX( this.pos.x );
                this.setY( this.pos.y );
                
                if( this.enabled ){ //this.display != "none"
                    this._widget();

                    if( !this.text.rotation ){
                        this._layout();
                    }
                }
                // this.data = this.layoutData
            },
    
            //初始化配置
            _initConfig:function( opt ){
              	if( opt ){
                    _.deepExtend( this , opt );
                };

                this.yAxisW = Math.max( this.yAxisW , this.leftDisX );
                this.w      = this.graphw - this.yAxisW;
                if( this.pos.x == null ){
                    this.pos.x =  this.yAxisW + this.disOriginX;
                }
                if( this.pos.y == null ){
                    this.pos.y =  this.graphh - this.h;
                }

                this.xGraphsWidth = this.w - this._getXAxisDisLine()
                this.disOriginX   = parseInt((this.w - this.xGraphsWidth) / 2);
            },
            _trimXAxis:function( data , xGraphsWidth ){
                var tmpData = [];
                var dis  = xGraphsWidth / (data.length+1);
                for (var a = 0, al  = data.length; a < al; a++ ) {
                    var o = {
                        'content' : data[a], 
                        'x'       : parseInt( dis * (a+1) )
                    }
                    tmpData.push( o );
                }
                return tmpData;
            },
            _getXAxisDisLine:function(){//获取x轴两端预留的距离
                var disMin = this.disXAxisLine
                var disMax = 2 * disMin
                var dis    = disMin
                dis = disMin + this.w % this.dataOrg.length
                dis = dis > disMax ? disMax : dis
                dis = isNaN(dis) ? 0 : dis
                return dis
            }, 
            _checkText:function(){//检测下文字的高等
                if( !this.enabled ){ //this.display == "none"
                    this.dis = 0;
                    this.h   = 1; //this.dis;//this.max.txtH;
                } else {
                    var txt = new Canvax.Display.Text( this.dataSection[0] || "test" ,
                                {
                                    context : {
                                        fontSize    : this.text.fontSize
                                    }
                                });
                    this.maxTxtH = txt.getTextHeight();
                    
                    if( !!this.text.rotation ){
                        if( this.text.rotation % 90 == 0 ){
                            this.h        = this._textMaxWidth + this.line.height + this.disY + this.dis + 3;
                        } else {
                            var sinR      = Math.sin(Math.abs( this.text.rotation ) * Math.PI / 180);
                            var cosR      = Math.cos(Math.abs( this.text.rotation ) * Math.PI / 180);
                            this.h        = sinR * this._textMaxWidth + txt.getTextHeight() + 5; 
                            this.leftDisX = cosR * txt.getTextWidth() + 8;
                        }
                    } else {
                        this.h = this.disY + this.line.height + this.dis + this.maxTxtH;
                        this.leftDisX = txt.getTextWidth() / 2;
                    }
                }
            },
            _getFormatText : function( text ){
                if(_.isFunction( this.text.format )){
                    return this.text.format( text );
                } else {
                    return text
                }
            },
            _widget:function(){
                var arr = this.layoutData

              	for(var a = 0, al = arr.length; a < al; a++){
    
                    var xNode = new Canvax.Display.Sprite({id : "xNode"+a});

                  	var o = arr[a]
                  	var x = o.x, y = this.disY + this.line.height + this.dis

                  	var content = o.content;
                    if(_.isFunction( this.text.format )){
                        content = this.text.format( content );
                    } else {
                        content = Tools.numAddSymbol(content);
                    }

                    //文字
                  	var txt = new Canvax.Display.Text(content,
                       {
                        context : {
                            x  : x,
                            y  : y,
                            fillStyle   : this.text.fillStyle,
                            fontSize    : this.text.fontSize,
                            rotation    : -Math.abs(this.text.rotation),
                            textAlign   : this.text.textAlign || (!!this.text.rotation ? "right"  : "center"),
                            textBaseline: !!this.text.rotation ? "middle" : "top"
                       }
                  	});
                  	xNode.addChild(txt);
                    if( !!this.text.rotation ){
                        txt.context.x += 5;
                        txt.context.y += 3;
                    }

                    if(this.line.enabled){
                        //线条
                        var line = new Line({
                            context : {
                                xStart      : x,
                                yStart      : this.disY,
                                xEnd        : x,
                                yEnd        : this.line.height + this.disY,
                                lineWidth   : this.line.width,
                                strokeStyle : this.line.strokeStyle
                            }
                        });
                        xNode.addChild( line );
                    }

                    //这里可以由用户来自定义过滤 来 决定 该node的样式
                    _.isFunction(this.filter) && this.filter({
                        layoutData  : arr,
                        index       : a,
                        txt         : txt,
                        line        : line || null
                    });

                    this.sprite.addChild( xNode );
                };
                        
            },
            /*校验最后一个文本是否超出了界限。然后决定是否矫正*/
            _layout:function(){

                if(this.sprite.getNumChildren()==0)
                    return;
        
    			var popText = this.sprite.getChildAt(this.sprite.getNumChildren() - 1).getChildAt(0);
                if (popText) {
                    var pc = popText.context;
                    if( pc.textAlign == "center" &&
                        pc.x + popText.context.width / 2 > this.w ){
                        pc.x = this.w - popText.context.width / 2
                    };
                    if( pc.textAlign == "left" &&
                        pc.x + popText.context.width > this.w ){
                        pc.x = this.w - popText.context.width
                    };
                    if( this.sprite.getNumChildren() >= 2 ){
                        //倒数第二个text
                        var popPreText = this.sprite.getChildAt(this.sprite.getNumChildren() - 2).getChildAt(0);
              
                        var ppc = popPreText.context;
                        
                        //如果最后一个文本 和 倒数第二个 重叠了，就 隐藏掉
                        if( ppc.visible && pc.x < ppc.x + ppc.width ){
                            pc.visible = false;
                        }
                    }
    			}
            },
            _getTextMaxWidth : function(){
                var arr = this.dataSection;
                var maxLenText   = arr[0];
            
                for( var a=0,l=arr.length ; a < l ; a++ ){
                    if( arr[a].length > maxLenText.length ){
                        maxLenText = arr[a];
                    }
                };
                       
                var txt = new Canvax.Display.Text( maxLenText || "test" ,
                    {
                    context : {
                        fillStyle   : this.text.fillStyle,
                        fontSize    : this.text.fontSize
                    }
                });

                this._textMaxWidth = txt.getTextWidth();
                this._textMaxHeight = txt.getTextHeight();

                return this._textMaxWidth;
            },
            _trimLayoutData:function(){

                var tmp = []
                var arr = this.data

                var mw  = this._textMaxWidth;
    
                if( !!this.text.rotation ){
                    mw  = this._textMaxHeight * 1.5;
                };

                //总共能多少像素展现
                var n = Math.min( Math.floor( this.w / mw ) , arr.length - 1 ); //能展现几个

                if( n >= arr.length - 1 ){
                    this.layoutData = arr;
                } else {
                    //需要做间隔
                    var dis = Math.max( Math.ceil( arr.length / n - 1 ) , 0 );  //array中展现间隔
                    //存放展现的数据
                    for( var a = 0 ; a < n ; a++ ){
                        var obj = arr[a + dis*a];
                        obj && tmp.push( obj );
                    };
                    this.layoutData    = tmp;
                }; 
            }
        };
    
        return xAxis;
    
    } 
)


define(
    "chartx/components/xaxis/xAxis_h" , 
    [
        "canvax/index",
        "canvax/shape/Line",
        "chartx/utils/tools",
        'chartx/utils/datasection'
    ],
    function(Canvax, Line , Tools, DataSection){
        var xAxis = function(opt , data){
            this.graphw = 0;
            this.graphh = 0;
            this.yAxisW = 0;
            this.w = 0;
            this.h = 0;
    
            this.disY       = 0
            this.dis        = 6;                           //线到文本的距离
    
            this.line = {
                    enabled : 1,                           //是否有line
                    width   : 1,
                    height  : 4,
                    strokeStyle   : '#cccccc'
            }
    
            // this.max  = { 
            //         left    : 0,                           //第一个文字最左侧坐标的最大值              
            //         right   : 0,                           //最后一个文字最右侧坐标的最大值
    
            //         txtH    : 14                           //文字最大高
            // }
    
            this.text = {
                    // mode      : 1,                         //模式(1 = 文字有几个线有几条 | 2 = 线不做过滤)
                    dis       : 0,                         //间隔(间隔几个文本展现)
                    fillStyle : '#999999',
                    fontSize  : 13,
                    rotation  : 0
            }
            this.maxTxtH = 0;

            this.pos = {
                x  : null,
                y  : null
            }
    
            //this.display = "block";
            this.enabled = 1 ; //1,0 true ,false 
    
            this.disXAxisLine =  6;                        //x轴两端预留的最小值
            this.disOriginX   =  0;                        //背景中原点开始的x轴线与x轴的第一条竖线的偏移量
            this.xGraphsWidth =  0;                        //x轴宽(去掉两端)
    
            this.dataOrg     = [];                          //源数据
            this.dataSection = [];                          //默认就等于源数据
            this.data        = [];                          //{x:100, content:'1000'}
            this.layoutData  = [];                          //this.data(可能数据过多),重新编排后的数据集合, 并根据此数组展现文字和线条
            this.sprite      = null;
            // this.txtSp       = null;
            // this.lineSp      = null;

            this._textMaxWidth = 0;
            this.leftDisX      = 0;                         //x轴最左边需要的间距。默认等于第一个x value字符串长度的一半

            this.textFormat  = null;
    
            this.init(opt , data)
        };
    
        xAxis.prototype = {
            init:function( opt , data ){
                _.deepExtend( this , opt );
                this._initData(data)
                this.text.rotation = -Math.abs( this.text.rotation );
                this.sprite = new Canvax.Display.Sprite({id : "xAxisSprite"});
                this._getTextMaxWidth();
                this._checkText();                              //检测
            },
            setX:function($n){
                this.sprite.context.x = $n
            },
            setY:function($n){
                this.sprite.context.y = $n
            },
            draw:function(opt){
                // this.data = [{x:0,content:'0000'},{x:100,content:'10000'},{x:200,content:'20000'},{x:300,content:'30000'},{x:400,content:'0000'},{x:500,content:'10000'},{x:600,content:'20000'}]
    
                this._initConfig( opt );
                this._trimXAxis()
                this._trimLayoutData();

                this.setX( this.pos.x ); //+ this.disOriginX );
                this.setY( this.pos.y );
                
                if( this.enabled ){ //this.display != "none"
                    this._widget();
                    if( !this.text.rotation ){
                        this._layout();
                    }
                }
                // this.data = this.layoutData
            },
    
            //初始化配置
            _initConfig:function( opt ){
              	if( opt ){
                    _.deepExtend( this , opt );
                }
                /*
                this.max.right = this.w;
                this.xGraphsWidth = this.w - this._getXAxisDisLine()
                this.disOriginX   = parseInt((this.w - this.xGraphsWidth) / 2);

                this.max.left  += this.disOriginX;
                this.max.right -= this.disOriginX;
                */
                // console.log(this.graphw, this.yAxisW)
                this.yAxisW = Math.max( this.yAxisW , this.leftDisX );
                this.w      = this.graphw - this.yAxisW;
                if( this.pos.x == null ){
                    this.pos.x =  this.yAxisW + this.disOriginX;
                }
                if( this.pos.y == null ){
                    this.pos.y =  this.graphh - this.h;
                }

                this.xGraphsWidth = this.w - this._getXAxisDisLine()
                this.disOriginX   = parseInt((this.w - this.xGraphsWidth) / 2);
            },
            _trimXAxis:function(){
                var arr = this.dataSection
                var tmpData = [];
                var max = this.dataSection[this.dataSection.length - 1]
                for (var a = 0, al  = arr.length; a < al; a++ ) {
                    var x = arr[a] / max * this.xGraphsWidth
                    x = isNaN(x) ? 0 : parseInt(x);
                    tmpData[a] = {content:this.dataSection[a], x:x}
                }
                this.data = tmpData
            },
            _getXAxisDisLine:function(){//获取x轴两端预留的距离
                var disMin = this.disXAxisLine
                var disMax = 2 * disMin
                var dis    = disMin
                dis = disMin + this.w % this.dataSection.length
                dis = dis > disMax ? disMax : dis
                dis = isNaN(dis) ? 0 : dis
                return dis
            }, 
            _initData  : function( data ){ 
                var arr =  _.flatten(data.org)
                this.dataOrg = data.org;

                this.dataSection = DataSection.section( arr , 3 );
            },
            _checkText:function(){//检测下文字的高等
                /*
                var txt = new Canvax.Display.Text('test',
                       {
                        context : {
                            fontSize    : this.text.fontSize
                       }
                })
                this.max.txtH = txt.getTextHeight();
                if( !this.enabled ){ //this.display == "none"
                    this.h = this.dis;//this.max.txtH;
                } else {
                    this.h = this.disY + this.line.height + this.dis + this.max.txtH
                }
                */
                if( !this.enabled ){ //this.display == "none"
                    this.h = this.dis;//this.max.txtH;
                } else {
                    var txt = new Canvax.Display.Text( this.dataSection[0] ,
                                {
                                    context : {
                                        fontSize    : this.text.fontSize
                                    }
                                });
                    this.maxTxtH = txt.getTextHeight();
                    
                    if( !!this.text.rotation ){
                        this.h = Math.cos(Math.abs( this.text.rotation ) * Math.PI / 180) * this._textMaxWidth;
                        this.leftDisX = Math.cos(Math.abs( this.text.rotation ) * Math.PI / 180)*txt.getTextWidth() + 8;
                    } else {
                        this.h = this.disY + this.line.height + this.dis + this.maxTxtH;
                        this.leftDisX = txt.getTextWidth() / 2;
                    }
                }
            },
            _widget:function(){
                /*
                var self = this
                var arr = this.layoutData
    
              	this.txtSp  = new Canvax.Display.Sprite(),  this.sprite.addChild(this.txtSp)
             	this.lineSp = new Canvax.Display.Sprite(),  this.sprite.addChild(this.lineSp)
              	for(var a = 0, al = arr.length; a < al; a++){
                  	var o = arr[a]
                  	var x = o.x, y = this.disY + this.line.height + this.dis

                  	var content = Tools.numAddSymbol(o.content)

                    if( _.isFunction(self.textFormat) ){
                        content = self.textFormat( content );
                    }

                  	//文字
                  	var txt = new Canvax.Display.Text(content,
                       {
                        context : {
                            x  : x,
                            y  : y,
                            fillStyle   : this.text.fillStyle,
                            fontSize    : this.text.fontSize,
                       }
                  	})
                  	this.txtSp.addChild(txt);
                } 
    
                // var arr = this.text.mode == 1 ? this.layoutData : this.data
                var arr = this.data
                for(var a = 0, al = arr.length; a < al; a++){
                    var o = arr[a]
                    var x = o.x
                    //线条
                    var line = new Line({
                        id      : a,
                        context : {
                            xStart      : x,
                            yStart      : this.disY,
                            xEnd        : x,
                            yEnd        : this.line.height + this.disY,
                            lineWidth   : this.line.width,
                            strokeStyle : this.line.strokeStyle
                        }
                    });
                    this.lineSp.addChild(line);
                }
    
               	for(var a = 0, al = this.txtSp.getNumChildren(); a < al; a++){
               		var txt = this.txtSp.getChildAt(a)
               		var x = parseInt(txt.context.x - txt.getTextWidth() / 2)
               		txt.context.x = x
               	}
                */
                var arr = this.layoutData

                for(var a = 0, al = arr.length; a < al; a++){
    
                    var xNode = new Canvax.Display.Sprite({id : "xNode"+a});

                    var o = arr[a]
                    var x = o.x, y = this.disY + this.line.height + this.dis

                    var content = Tools.numAddSymbol(o.content);
                    //文字
                    var txt = new Canvax.Display.Text(content,
                       {
                        context : {
                            x  : x,
                            y  : y,
                            fillStyle   : this.text.fillStyle,
                            fontSize    : this.text.fontSize,
                            rotation    : this.text.rotation,
                            textAlign   : !!this.text.rotation ? "right"  : "left",
                            textBaseline: !!this.text.rotation ? "middle" : "top"
                       }
                    });
                    xNode.addChild(txt);
                    if( !this.text.rotation ){
                        txt.context.x = parseInt(txt.context.x - txt.getTextWidth() / 2) ;
                    } else {
                        txt.context.x += 5;
                        txt.context.y += 3;
                    }

                    //线条
                    var line = new Line({
                        context : {
                            xStart      : x,
                            yStart      : this.disY,
                            xEnd        : x,
                            yEnd        : this.line.height + this.disY,
                            lineWidth   : this.line.width,
                            strokeStyle : this.line.strokeStyle
                        }
                    });
                    xNode.addChild( line );

                    //这里可以由用户来自定义过滤 来 决定 该node的样式
                    _.isFunction(this.filter) && this.filter({
                        layoutData  : arr,
                        index       : a,
                        txt         : txt,
                        line        : line
                    });

                    this.sprite.addChild( xNode );
                };
            },
            /*校验第一个和最后一个文本是否超出了界限。然后决定是否矫正*/
            _layout:function(){
                /*
    			var firstText = this.txtSp.getChildAt(0)
    			var popText = this.txtSp.getChildAt(this.txtSp.getNumChildren() - 1)
    
    			if(firstText && firstText.context.x < this.max.left){
    				firstText.context.x = parseInt(this.max.left)
    			}
    			if (popText && (Number(popText.context.x + Number(popText.getTextWidth())) > this.max.right)) {
    				popText.context.x = parseInt(this.max.right - popText.getTextWidth())
    			}
                */
                var popText = this.sprite.getChildAt(this.sprite.getNumChildren() - 1).getChildAt(0);
                // console.log(this.w,popText.getTextWidth() )
                if (popText && (Number(popText.context.x + Number(popText.getTextWidth())) > this.w)) {
                    popText.context.x = parseInt(this.w - popText.getTextWidth())
                    // console.log(popText.context.x)
                }
            },
            _getTextMaxWidth : function(){
                var arr = this.dataSection;
                var maxLenText   = arr[0];
                for( var a=0,l=arr.length ; a < l ; a++ ){
                    if( arr[a].length > maxLenText.length ){
                        maxLenText = arr[a];
                    }
                };
                       
                var txt = new Canvax.Display.Text( maxLenText ,
                    {
                    context : {
                        fillStyle   : this.text.fillStyle,
                        fontSize    : this.text.fontSize
                    }
                })

                this._textMaxWidth = txt.getTextWidth();

                return this._textMaxWidth;
            },
            _trimLayoutData:function(){
                /*
                var tmp = []
                var arr = this.data
                var textMaxWidth = 0
    
                for(var a = 0, al = arr.length; a < al; a++){
                    var o = arr[a]
                        
                    var content = Tools.numAddSymbol(o.content)
                    var txt = new Canvax.Display.Text(content,
                       {
                        context : {
                            fillStyle   : this.text.fillStyle,
                            fontSize    : this.text.fontSize
                       }
                    })
                    textMaxWidth = Math.max(textMaxWidth, txt.getTextWidth())           //获取文字最大宽
                }
                var maxWidth =  this.max.right                                          //总共能多少像素展现
                // console.log(Math.floor( maxWidth / (textMaxWidth + 30) ), arr.length)
                var n = Math.min( Math.floor( maxWidth / textMaxWidth ) , arr.length ); //能展现几个
                var dis = Math.max( Math.ceil( arr.length / n - 1 ) , 0 );                            //array中展现间隔
                if(this.text.dis){
                    dis = this.text.dis
                }

                //存放展现的数据
                for( var a = 0 ; a < n ; a++ ){
                    var obj = arr[a + dis*a];
                    obj && tmp.push( obj );
                }
     
                this.layoutData = tmp
                */
                if(this.text.rotation){
                    //如果 有 选择的话，就不需要过滤x数据，直接全部显示了
                    this.layoutData = this.data;
                    return;
                }
                var tmp = []
                var arr = this.data
    
                //总共能多少像素展现
                var n = Math.min( Math.floor( this.w / this._textMaxWidth ) , arr.length ); //能展现几个
                var dis = Math.max( Math.ceil( arr.length / n - 1 ) , 0 );                  //array中展现间隔
                if(this.text.dis){
                    dis = this.text.dis
                }

                //存放展现的数据
                for( var a = 0 ; a < n ; a++ ){
                    var obj = arr[a + dis*a];
                    obj && tmp.push( obj );
                }
     
                this.layoutData    = tmp;
            }
        };
    
        return xAxis;
    
    } 
)


define(    
    "chartx/components/yaxis/yAxis" , 
    [
        "canvax/index",
        "canvax/shape/Line",
        "chartx/utils/tools",
        'chartx/utils/datasection'
    ],
    function( Canvax , Line , Tools , DataSection){
        var yAxis = function(opt , data){
            this.w = 0;
            this.enabled = 1;//true false 1,0都可以
            this.dis  = 6                                  //线到文本的距离
            this.line = {
                    enabled : 1,                           //是否有line
                    width   : 6,
                    lineWidth  : 3,
                    strokeStyle   : '#BEBEBE'
            }
            this.text = {
                    fillStyle : '#999999',
                    fontSize  : 12,
                    textAlign : "right",
                    format    : null
            }
            this.layoutData  = [];                           //dataSection对应的layout数据{y:-100, content:'1000'}
            this.dataSection = [];                           //从原数据dataOrg 中 结果datasection重新计算后的数据
            this.dataOrg     = [];                           //源数据

            this.sprite      = null;
            this.x           = 0;
            this.y           = 0;
            this.disYAxisTopLine =  6;                       //y轴顶端预留的最小值
            this.yMaxHeight      =  0;                       //y轴最大高
            this.yGraphsHeight   =  0;                       //y轴第一条线到原点的高

            this.baseNumber      =  null;
            this.basePoint       =  null;                    //value为baseNumber的point {x,y}
            
            //过滤器，可以用来过滤哪些yaxis 的 节点是否显示已经颜色之类的
            //@params params包括 dataSection , 索引index，txt(canvax element) ，line(canvax element) 等属性
            this.filter          =  null; //function(params){}; 

            this.init(opt , data);
        };
    
        yAxis.prototype = {
            init:function( opt , data ){
                _.deepExtend( this , opt );
                this._initData( data );
                this.sprite = new Canvax.Display.Sprite();
            },
            setX:function($n){
                this.sprite.context.x = $n
            },
            setY:function($n){
                this.sprite.context.y = $n
            },
            //删除一个字段
            update : function( opt , data ){
                //先在field里面删除一个字段，然后重新计算
                this.sprite.removeAllChildren();
                this.dataSection = [];
                _.deepExtend( this , opt );
                this._initData( data );
                this.draw();
            },
            draw:function( opt ){
                opt && _.deepExtend( this , opt );            
                this.yGraphsHeight = this.yMaxHeight  - this._getYAxisDisLine();
                this.setX( this.pos.x );
                this.setY( this.pos.y );
                this._trimYAxis();
                this._widget();
            },
            _trimYAxis:function(){
                var max = this.dataSection[ this.dataSection.length - 1 ];
                var tmpData = [];
                for (var a = 0, al = this.dataSection.length; a < al; a++ ) {
                    var y = - (this.dataSection[a] - this._bottomNumber) / (max - this._bottomNumber) * this.yGraphsHeight;
                    y = isNaN(y) ? 0 : parseInt(y);                                                    
                    tmpData[a] = { content : this.dataSection[a] , y : y };
                }

                this.layoutData = tmpData;

                //设置basePoint
                var basePy = - (this.baseNumber - this._bottomNumber) / (max - this._bottomNumber) * this.yGraphsHeight;
                basePy = isNaN(basePy) ? 0 : parseInt(basePy); 
                this.basePoint = {
                    content : this.baseNumber ,
                    y       : basePy
                }
            },
            _getYAxisDisLine:function(){                   //获取y轴顶高到第一条线之间的距离         
                var disMin = this.disYAxisTopLine
                var disMax = 2 * disMin
                var dis    = disMin
                dis = disMin + this.yMaxHeight % this.dataSection.length;
                dis = dis > disMax ? disMax : dis
                return dis
            },
            _initData  : function( data ){ 
                
                var arr = _.flatten( data.org ); //Tools.getChildsArr( data.org );
                this.dataOrg     = data.org;
               
                if( this.dataSection.length == 0 ){
                    //if( !this.enabled ){
                    //    arr.unshift( 0 );
                    //} 
                    this.dataSection = DataSection.section( arr , 3 );
                };

                //如果还是0
                if( this.dataSection.length == 0 ){
                    this.dataSection = [0]
                }
                this._bottomNumber = this.dataSection[0];
                if(arr.length == 1){
                    this.dataSection[0] = arr[0] * 2;
                    this._bottomNumber  = 0;
                }
                if( this.baseNumber == null ){
                    this.baseNumber = this._bottomNumber > 0 ? this._bottomNumber : 0;
                }
            },
            resetWidth : function( w ){
                var self = this;
                self.w   = w;
                if( self.line.enabled ){
                    self.sprite.context.x = w - self.dis - self.line.width;
                } else {
                    self.sprite.context.x = w - self.dis;
                }
            },
            _widget:function(){
                var self  = this;
                if( !self.enabled ){
                    self.w = 0;
                    return;
                }
                var arr = this.layoutData;
                var maxW = 0;
                for(var a = 0, al = arr.length; a < al; a++){
                    var o = arr[a];
                    var x = 0, y = o.y;
                    var content = o.content
                    if( _.isFunction(self.text.format) ){
                        content = self.text.format(content );
                    }else{
                        content = Tools.numAddSymbol(content);
                    }
                    var yNode = new Canvax.Display.Sprite({ id : "yNode"+a });
                     
                    //文字
                    var txt = new Canvax.Display.Text( content ,
                       {
                        context : {
                            x  : x,
                            y  : y + ( a == 0 ? -3 : 0 ),
                            fillStyle    : self.text.fillStyle,
                            fontSize     : self.text.fontSize,
                            textAlign    : self.text.textAlign,
                            textBaseline : "middle"
                       }
                    });
                    yNode.addChild( txt );
    
                    maxW = Math.max(maxW, txt.getTextWidth());
    
                    if( self.line.enabled ){
                        //线条
                        var line = new Line({
                            context : {
                                x           : 0 + self.dis,
                                y           : y,
                                xEnd        : self.line.width,
                                yEnd        : 0,
                                lineWidth   : self.line.lineWidth,
                                strokeStyle : self.line.strokeStyle
                            }
                        });                 
                        yNode.addChild( line );
                    }; 

                    //这里可以由用户来自定义过滤 来 决定 该node的样式
                    _.isFunction(self.filter) && self.filter({
                        layoutData  : self.dataSection,
                        index       : a,
                        txt         : txt,
                        line        : line
                    });

                    self.sprite.addChild( yNode );
                };

                maxW += self.dis;
                self.sprite.context.x = maxW;
                if( self.line.enabled ){
                    self.w = maxW + self.dis + self.line.width
                } else {
                    self.w = maxW + self.dis;
                }
            }
        };

        return  yAxis;
    } 
)


define(    
    "chartx/components/yaxis/yAxis_h" , 
    [
        "canvax/index",
        "canvax/shape/Line",
        "chartx/utils/tools"//,
        // 'chartx/utils/datasection'
    ],
    function( Canvax , Line , Tools){
        var yAxis = function(opt , data){
            this.w = 0;
            this.enabled = 1;//true false 1,0都可以
            this.dis  = 6                                  //线到文本的距离
    
            this.line = {
                    enabled : 1,                           //是否有line
                    width   : 6,
                    height  : 3,
                    strokeStyle   : '#BEBEBE'
            }
     
            this.text = {
                    fillStyle : '#999999',
                    //fontSize  : 13//
                    fontSize  : 12
            }
    
            this.data        = [];                          //{y:-100, content:'1000'}
            this.dataOrg     = [];
    
    
            this.sprite      = null;
            this.txtSp       = null;
            this.lineSp      = null;
            
            //yAxis的左上角坐标
            this.x           = 0;
            this.y           = 0;
            
            this.disYAxisTopLine =  6;                       //y轴顶端预留的最小值
            this.yMaxHeight      =  0;                       //y轴最大高
            this.yGraphsHeight   =  0;                       //y轴第一条线到原点的高
            this.yDis1           =  0;                       //y轴每一组的高

            //最终显示到y轴上面的文本的格式化扩展
            //比如用户的数据是80 但是 对应的显示要求确是80%
            //后面的%符号就需要用额外的contentFormat来扩展
            this.textFormat   =  null;   

            this.init(opt , data);
        };
    
        yAxis.prototype = {
            init:function( opt , data ){
                _.deepExtend( this , opt );
                this._initData( data );
                this.sprite = new Canvax.Display.Sprite();
            },
            setX:function($n){
                this.sprite.context.x = $n
            },
            setY:function($n){
                this.sprite.context.y = $n
            },
            //删除一个字段
            update : function( opt , data ){
                //先在field里面删除一个字段，然后重新计算
                this.sprite.removeAllChildren();
                _.deepExtend( this , opt );
                this._initData( data );
                this.draw();
            },
            draw:function( opt ){
                opt && _.deepExtend( this , opt );            
    
                this.yGraphsHeight = this.yMaxHeight  - this._getYAxisDisLine();
                this.yDis1         = this.yGraphsHeight / this.dataOrg.length 
    
                this.setX( this.pos.x );
                this.setY( this.pos.y );
                this._trimYAxis();
                this._widget();
            },
            _trimYAxis:function(){
                var arr = this.dataOrg
                var tmpData = [];
                for(var a = 0, al = arr.length; a < al; a++){
                    var y = - (a + 1) * this.yDis1 + this.yDis1 / 2
                    y = isNaN(y) ? 0 : parseInt(y);
                    tmpData[a] = {content:this.dataOrg[a], y:y}
                }
                this.data = tmpData
             },
            _getYAxisDisLine:function(){                   //获取y轴顶高到第一条线之间的距离         
                var disMin = this.disYAxisTopLine
                var disMax = 2 * disMin
                var dis    = disMin
                dis = disMin + this.yMaxHeight % this.dataOrg.length;
                dis = dis > disMax ? disMax : dis
                return dis
            },
            _initData  : function( data ){ 
                this.dataOrg     = data.org[0];
            },
            _widget:function(){
                var self  = this;
                if( !self.enabled ){
                    self.w = 0;
                    return;
                }
                
                self.txtSp  = new Canvax.Display.Sprite(),  self.sprite.addChild(self.txtSp)
                self.lineSp = new Canvax.Display.Sprite(),  self.sprite.addChild(self.lineSp)
                
                var arr = this.data
                var maxW = 0;
                for(var a = 0, al = arr.length; a < al; a++){
                    var o = arr[a];
                    var x = 0, y = o.y;
                    
                    var content = Tools.numAddSymbol( o.content );

                    if( _.isFunction(self.textFormat) ){
                        content = self.textFormat( content );
                    }

                    //文字
                    var txt = new Canvax.Display.Text( content ,
                       {
                        context : {
                            x  : x,
                            y  : y,
                            fillStyle    : self.text.fillStyle,
                            fontSize     : self.text.fontSize,
                            // textBackgroundColor:'#0000ff',
                            textAlign    : "right",
                            textBaseline : "middle"
                       }
                    })
    
    
                    self.txtSp.addChild(txt);
                    maxW = Math.max(maxW, txt.getTextWidth());
    
                    //线条
                    var line = new Line({
                        id      : a,
                        context : {
                            x           : 0,
                            y           : y,
                            xEnd        : self.line.width,
                            yEnd        : 0,
                            lineWidth   : self.line.height,
                            strokeStyle : self.line.strokeStyle
                        }
                    })
                    self.lineSp.addChild(line)
                }
                self.txtSp.context.x  = maxW;
                self.lineSp.context.x = maxW + self.dis
                if(self.line.enabled){
                    self.w = maxW + self.dis + self.line.width
                } else {
                    self.lineSp.context.visible = false
                    self.w = maxW + self.dis;
                }
            }
        };
        return  yAxis;
    } 
)
