define(
    "chartx/chart/line/tips",
    [
        "canvax/index",
        "canvax/shape/Line",
        "canvax/shape/Circle",
        "chartx/components/tips/tip"
    ],
    function( Canvax , Line , Circle , Tip ){
        var Tips = function(opt , data , tipDomContainer){
            this.line      = {
                enabled      : 1
            }
            this.sprite    = null;
            this._line     = null;
            this._nodes    = null;
            this._tip      = null;
            this._isShow   = false;
            this.enabled   = true;
            this.init(opt , data , tipDomContainer);
        };
    
        Tips.prototype = {
            init : function(opt , data , tipDomContainer){
                _.deepExtend(this , opt);
                this.sprite = new Canvax.Display.Sprite({
                    id : "tips"
                });
    
                opt = _.deepExtend({
                    prefix : data.yAxis.field
                } , opt);
                this._tip = new Tip( opt , tipDomContainer );
    
            },
            show : function(e){
                var tipsPoint = this._getTipsPoint(e);
                this._initLine(e , tipsPoint);
                this._initNodes(e , tipsPoint);
    
                this.sprite.addChild(this._tip.sprite);
                this._tip.show(e);

                this._isShow = true;
        
            },
            move : function(e){
                this._resetStatus(e);
                this._tip.move(e);
            },
            hide : function(e){
                this.sprite.removeAllChildren();
                this._line  = null;
                this._nodes = null;
                this._tip.hide(e);

                this._isShow = false;
            },
            _getTipsPoint : function(e){
                return e.target.localToGlobal( e.tipsInfo.nodesInfoList[e.tipsInfo.iGroup] );
            },
            _resetStatus : function(e){
                var tipsPoint = this._getTipsPoint(e);
                if(this._line){
                    this._line.context.x  = parseInt(tipsPoint.x);
                }
                this._resetNodesStatus(e , tipsPoint);
            },
    
            /**
             * line相关------------------------
             */
            _initLine : function(e , tipsPoint){
                
                var lineOpt = _.deepExtend({
                    x       : parseInt(tipsPoint.x),
                    y       : e.target.localToGlobal().y,
                    xStart  : 0,
                    yStart  : e.target.context.height,
                    xEnd    : 0,
                    yEnd    : 0,
                    //lineType    : "dashed",
                    lineWidth   : 1,
                    strokeStyle : "#cccccc" 
                } , this.line);
                if(this.line.enabled){
                    this._line = new Line({
                        id : "tipsLine",
                        context : lineOpt
                    });
                    this.sprite.addChild( this._line );
                }
            },
    
    
            /**
             *nodes相关-------------------------
             */
            _initNodes : function(e , tipsPoint){
                
                this._nodes = new Canvax.Display.Sprite({
                    id : "line-tipsNodes",
                    context : {
                        x   : parseInt(tipsPoint.x),
                        y   : e.target.localToGlobal().y
                    }
                });
                var self = this;
                _.each( e.tipsInfo.nodesInfoList , function( node ){
                    var csp = new Canvax.Display.Sprite({
                        context : {
                            y : e.target.context.height - Math.abs(node.y) 
                        }
                    });
                    csp.addChild( new Circle({
                        context : {
                            r : node.r + 2 + 2 ,
                            fillStyle   : "white",//node.fillStyle,
                            strokeStyle : node.strokeStyle,
                            lineWidth   : node.lineWidth
                        }
                    }) );

                    csp.addChild( new Circle({
                        context : {
                            r : node.r + 1,
                            fillStyle   : node.strokeStyle
                        }
                    }) );

                    self._nodes.addChild( csp );
                } );
                this.sprite.addChild( this._nodes );
            },
            _resetNodesStatus : function(e , tipsPoint){
                var self = this;
                if( this._nodes.children.length != e.tipsInfo.nodesInfoList.length ){
                    this._nodes.removeAllChildren();
                    this._initNodes( e , tipsPoint );
                }
                this._nodes.context.x = parseInt(tipsPoint.x);
                _.each( e.tipsInfo.nodesInfoList , function( node , i ){
                    var csps         = self._nodes.getChildAt(i).context;
                    csps.y           = e.target.context.height - Math.abs(node.y);
                });
            }
        }
        return Tips
    } 
);


define(
    "chartx/chart/line/xaxis",
    [
        "chartx/components/xaxis/xAxis"
    ],
    function( xAxisBase ){
        var xAxis = function( opt , data ){
            xAxis.superclass.constructor.apply( this , arguments );
        };
        Chartx.extend( xAxis , xAxisBase , {
            //覆盖xAxisBase 中的 _trimXAxis
            _trimXAxis : function( data , xGraphsWidth ){
                var max  = data.length
                var tmpData = [];
    
                if( max == 1 ){
                    tmpData.push({
                        content : data[0],
                        x       : parseInt( xGraphsWidth / 2 )
                    });
                } else {
                    for (var a = 0, al  = data.length; a < al; a++ ) {
                        var o = {
                            'content':data[a], 
                            'x':parseInt(a / (max - 1) * xGraphsWidth)
                        }
                        tmpData.push( o )
                    }
                }
                return tmpData;
            }
        } );
    
        return xAxis;
    }
);


define(
    "chartx/chart/line/group" ,
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
    "chartx/chart/line/graphs" ,
    [
        "canvax/index",
        "canvax/shape/Rect",
        "chartx/utils/tools",
        "chartx/chart/line/group"
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
                for ( var a = 0, al = this.groups.length; a < al; a++ ) {
                    var o = this.groups[a].getNodeInfoAt(tmpINode)
                    o && _nodesInfoList.push(o);
                };

                var tmpIGroup = Tools.getDisMinATArr(y, _.pluck(_nodesInfoList , "y" ));

                this.iGroup = tmpIGroup, this.iNode = tmpINode;
                var node = {
                    iGroup        : this.iGroup,
                    iNode         : this.iNode,
                    nodesInfoList : _.clone(_nodesInfoList)
                };
                return node;
            },
            _fireHandler:function(e){
                e.params  = {
                    iGroup : e.tipsInfo.iGroup,
                    iNode  : e.tipsInfo.iNode
                }
                this.root.fire( e.type , e );
            }
        };
    
        return Graphs;
    
    } 
)


define(
    "chartx/chart/line/index",
    [
        'chartx/chart/index',
        'chartx/utils/tools',
        'chartx/utils/datasection',
        './xaxis',
        'chartx/components/yaxis/yAxis',
        'chartx/components/back/Back',
        'chartx/components/anchor/Anchor',
        'chartx/chart/line/graphs',
        './tips',
        'chartx/utils/dataformat'
    ],
    function(Chart, Tools, DataSection, xAxis, yAxis, Back, Anchor, Graphs, Tips , dataFormat){
        /*
         *@node chart在dom里的目标容器节点。
        */
        var Canvax = Chart.Canvax;
    
        return Chart.extend( {
    
            init:function(node , data , opts){
                this._xAxis   =  null;
                this._yAxis   =  null;
                this._anchor  =  null;
                this._back    =  null;
                this._graphs  =  null;
                this._tips    =  null;

                //this._preTipsInode =  null; //如果有tips的话，最近的一次tip是在iNode

                _.deepExtend( this , opts );
                this.dataFrame = this._initData( data , this );
            },
            draw:function(){
                this.stageTip = new Canvax.Display.Sprite({
                    id      : 'tip'
                });
                this.core     = new Canvax.Display.Sprite({
                    id      : 'core'
                });
                this.stageBg  = new Canvax.Display.Sprite({
                    id      : 'bg'
                });
    
                this.stage.addChild( this.stageBg );
                this.stage.addChild( this.core );
                this.stage.addChild( this.stageTip );

                if( this.rotate ) {
                    this._rotate( this.rotate );
                }
                this._initModule();                        //初始化模块  
    
                this._startDraw();                         //开始绘图
              
                this._arguments = arguments;
    
            },
            /*
             *添加一个yAxis字段，也就是添加一条brokenline折线
             *@params field 添加的字段
             *@params ind 添加到哪个位置 默认在最后面
             **/
            add : function( field , ind ){
            
                if( _.indexOf( this.yAxis.field , field ) >= 0 ){
                    return;
                }

                var i = this.yAxis.field.length;
                if( ind != undefined && ind != null ){
                    i = ind;
                };


                //首先，yAxis要重新计算
                if( ind == undefined ){
                    this.yAxis.field.push( field );
                    ind = this.yAxis.field.length-1;
                } else {
                    this.yAxis.field.splice(ind , 0 , field);
                }
                this.dataFrame = this._initData( this.dataFrame.org , this );

                this._yAxis.update( this.yAxis , this.dataFrame.yAxis );

                //然后yAxis更新后，对应的背景也要更新
                this._back.update({
                    xAxis:{
                        data : this._yAxis.layoutData
                    }
                });

                this._graphs.add({
                    data : this._trimGraphs()
                } , ind);
                //this._graphs.update();


            },
            /*
             *删除一个yaxis字段，也就是删除一条brokenline线
             *@params target 也可以是字段名字，也可以是 index
             **/
            remove : function( target ){
                var ind = null;
                if( _.isNumber(target) ){
                    //说明是索引
                    ind = target;
                } else {
                    //说明是名字，转换为索引
                    ind = _.indexOf( this.yAxis.field , target );
                }
                if( ind != null && ind != undefined && ind != -1 ){
                    this._remove(ind);
                }
            },
            _remove : function( ind ){
            
                //首先，yAxis要重新计算
                //先在dataFrame中更新yAxis的数据
                this.dataFrame.yAxis.field.splice(ind , 1);
                this.dataFrame.yAxis.org.splice(ind , 1);
                //this.yAxis.field.splice(ind , 1);

                this._yAxis.update( this.yAxis , this.dataFrame.yAxis );

                //然后yAxis更新后，对应的背景也要更新
                this._back.update({
                    xAxis:{
                        data : this._yAxis.layoutData
                    }
                });

                //然后就是删除graphs中对应的brokenline，并且把剩下的brokenline缓动到对应的位置
                this._graphs.remove(ind);
                this._graphs.update({
                    data : this._trimGraphs()
                });
            },
            _initData  : dataFormat,
            _initModule:function(){
                this._xAxis  = new xAxis(this.xAxis , this.dataFrame.xAxis);
                this._yAxis  = new yAxis(this.yAxis , this.dataFrame.yAxis);
                this._back   = new Back(this.back);
                this._anchor = new Anchor(this.anchor);
                this._graphs = new Graphs( this.graphs, this);
                this._tips   = new Tips(this.tips , this.dataFrame , this.canvax.getDomContainer());

                this.stageBg.addChild(this._back.sprite);
                this.stageBg.addChild(this._anchor.sprite);
                this.core.addChild(this._xAxis.sprite);
                this.core.addChild(this._yAxis.sprite);
                this.core.addChild(this._graphs.sprite);
                this.stageTip.addChild(this._tips.sprite);
            },
            _startDraw : function(){
                // this.dataFrame.yAxis.org = [[201,245,288,546,123,1000,445],[500,200,700,200,100,300,400]]
                // this.dataFrame.xAxis.org = ['星期一','星期二','星期三','星期四','星期五','星期六','星期日']
                var y = this.height - this._xAxis.h;
                
                //绘制yAxis
                this._yAxis.draw({
                    pos : {
                        x : 0,
                        y : y
                    },
                    yMaxHeight : y
                });
 
                var _yAxisW = this._yAxis.w;
                
                //绘制x轴
                this._xAxis.draw({
                    graphh :   this.height,
                    graphw :   this.width,
                    yAxisW :   _yAxisW
                });
                if( this._xAxis.yAxisW != _yAxisW ){
                    //说明在xaxis里面的时候被修改过了。那么要同步到yaxis
                    this._yAxis.resetWidth( this._xAxis.yAxisW );
                    _yAxisW = this._xAxis.yAxisW;
                };

                var _graphsH = this._yAxis.yGraphsHeight;
                //Math.abs(this._yAxis.layoutData[ 0 ].y - this._yAxis.layoutData.slice(-1)[0].y);

                //绘制背景网格
                this._back.draw({
                    w    : this._xAxis.w ,
                    h    : _graphsH,
                    xAxis:{
                        data : this._yAxis.layoutData
                    },
                    yAxis:{
                        data : this._xAxis.layoutData
                    },
                    pos  : {
                        x : _yAxisW,
                        y : y
                    }
                });
            
                

                this._graphs.draw({
                    w    : this._xAxis.xGraphsWidth,
                    h    : this._yAxis.yGraphsHeight,
                    data : this._trimGraphs(),
                    disX : this._getGraphsDisX(),
                    smooth : this.smooth
                });

                this._graphs.setX( _yAxisW ), this._graphs.setY(y)
    
                //执行生长动画
                this._graphs.grow();
    
                var self = this;
                this._graphs.sprite.on( "panstart mouseover" ,function(e){
                    if( self._tips.enabled &&
                        //self._preTipsInode && self._preTipsInode != e.tipsInfo.iNode &&
                        e.tipsInfo.nodesInfoList.length > 0
                        ){
                            self._setXaxisYaxisToTipsInfo(e);
                            self._tips.show( e );

                            //触发
                            //self.fire( "" , e );
                    }
                });
                this._graphs.sprite.on( "panmove mousemove" ,function(e){
                    if( self._tips.enabled ){
                        if( e.tipsInfo.nodesInfoList.length > 0 ){
                            self._setXaxisYaxisToTipsInfo(e);
                            if( self._tips._isShow ){
                                self._tips.move( e );
                            } else {
                                self._tips.show( e );
                            }
                        } else {
                            if( self._tips._isShow ){
                                self._tips.hide( e );
                            }
                        }
                    }
                });
                this._graphs.sprite.on( "panend mouseout" ,function(e){
                    if( self._tips.enabled ){
                        self._tips.hide( e );
                    }
                });


                if(this._anchor.enabled){
                    //绘制点位线
                    var pos = this._getPosAtGraphs(this._anchor.xIndex, this._anchor.num)
                    this._anchor.draw({
                        w    : this.width - _yAxisW,
                        h    : _graphsH,
                        cross  : {
                            x : pos.x,
                            y : _graphsH + pos.y
                        },
                        pos   : {
                            x : _yAxisW,
                            y : y - _graphsH
                        }
                    });
                    //, this._anchor.setY(y)
                }
            },
            //把这个点位置对应的x轴数据和y轴数据存到tips的info里面
            //方便外部自定义tip是的content
            _setXaxisYaxisToTipsInfo : function( e ){
                e.tipsInfo.xAxis = {
                    field : this.dataFrame.xAxis.field,
                    value : this.dataFrame.xAxis.org[0][ e.tipsInfo.iNode ]
                }
                var me = this;
                _.each( e.tipsInfo.nodesInfoList , function( node , i ){
                    node.field = me.dataFrame.yAxis.field[ node._groupInd ];
                } );
            },
            _trimGraphs:function(){
                var maxYAxis = this._yAxis.dataSection[ this._yAxis.dataSection.length - 1 ];
                var arr      = this.dataFrame.yAxis.org;
                var tmpData  = [];
                for (var a = 0, al = arr.length; a < al; a++ ) {
                    for (var b = 0, bl = arr[a].length ; b < bl; b++ ) {
                        !tmpData[a] ? tmpData[a] = [] : '';
                        if( b >= this._xAxis.data.length ){
                            break;
                        }
                        var x = this._xAxis.data[b].x;
                        var y = - (arr[a][b] - this._yAxis._bottomNumber) / (maxYAxis - this._yAxis._bottomNumber) * this._yAxis.yGraphsHeight
                        y = isNaN(y) ? 0 : y
                        tmpData[a][b] = {
                            value : arr[a][b],
                            x : x,
                            y : y
                        };
                    }
                }
                return tmpData
            },
            //根据x轴分段索引和具体值,计算出处于Graphs中的坐标
            _getPosAtGraphs:function(index,num){
                //debugger
                var x = this._xAxis.data[index].x;
                var y = this._graphs.data[0][index].y
                return {x:x, y:y}
            },
            //每两个点之间的距离
            _getGraphsDisX:function(){
                var dsl = this._xAxis.dataSection.length;
                var n   = this._xAxis.xGraphsWidth / (dsl - 1);
                if( dsl == 1){
                    n = 0
                }
                return n
            }
        });
    } 
);
