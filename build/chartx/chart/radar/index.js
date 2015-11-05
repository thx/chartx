define(
    "chartx/chart/radar/back",
    [
        "canvax/index",
        "canvax/shape/Isogon",
        "canvax/shape/Circle",
        "canvax/shape/Line"
    ],
    function( Canvax , Isogon , Circle , Line ){
        var Back = function( opt ){
            this.pos    = {x : 0 , y : 0};
            this.r      = 0; //蜘蛛网的最大半径
            this.yDataSection = [];
            this.xDataSection = [];
            this.strokeStyle  = "#e5e5e5";
            this.lineWidth    = 1;
            this.sprite       = null;
            this.init(opt);
        };
        Back.prototype = {
            init : function( opt ){
                _.deepExtend(this , opt); 
                this.sprite = new Canvax.Display.Sprite({
                    id : "back"
                });
            },
            draw : function( opt ){
                _.deepExtend(this , opt);
                this._widget();
            },
            setPosition : function( x , y){
                var spc = this.sprite.context;
                spc.x   = x;
                spc.y   = y;
            },
            _widget : function(){
                var r   = this.r;
                var spt = this.sprite;
                var ys  = this.yDataSection;
                if( ys.length == 1 && ys[0]==0 ){
                    ys.push(1)
                }
                var yMin = _.min(ys);
                var yMax = _.max(ys);
                for( var i=0 , l = ys.length ; i < l ; i++ ) {
                    var rScale = (ys[i]-yMin) / (yMax - yMin);
                    if( rScale == 0 ){
                        continue;
                    };
                    var isogon = new Isogon({
                        id : "isogon_" + i,
                        context : {
                            x : r,
                            y : r,
                            r : this.r * rScale,
                            n : this.xDataSection.length,
                            strokeStyle : this.strokeStyle,
                            lineWidth   : this.lineWidth,
                            fillStyle   : "RGBA(0,0,0,0)"
                        }
                    });
                    //给最外面的蜘蛛网添加事件，让它冒泡到外面去
                    if( i == l - 1 ) {
                        isogon.hover(function(){},function(){});
                        isogon.on("mousemove",function(){});
                        //然后要把最外面的isogon的rect范围作为sprite 的 width and height
                        var rectRange = isogon.getRect();
                        var spc       = spt.context;
                        spc.width     = rectRange.width;
                        spc.height    = rectRange.height;
                    }
                    spt.addChild( isogon );
                }
    
                var pointList = spt.children[ spt.children.length-1 ].context.pointList;
    
                for( var ii=0 , ll = pointList.length ; ii < ll ; ii++ ){
                    var line = new Line({
                        id : "line_"+ii,
                        context : {
                            xStart : r,
                            yStart : r,
                            xEnd   : pointList[ii][0] + r,
                            yEnd   : pointList[ii][1] + r,
                            lineWidth   : this.lineWidth,
                            strokeStyle : this.strokeStyle
                        }
                    });
                    spt.addChild( line );
                }
            }
        }
        return Back;
    } 
);


define(
    "chartx/chart/radar/graphs",
    [
        "canvax/index",
        "canvax/shape/Polygon",
        "canvax/shape/Circle",
        "canvax/animation/Tween",
        "chartx/components/tips/tip",
        "chartx/chart/theme"
    ],
    function( Canvax , Polygon , Circle , Tween , Tip , Theme){
 
        var Graphs = function( opt , tipsOpt , domContainer ){
            this.pos    = {x : 0 , y : 0};
            this.r = 0; //蜘蛛网的最大半径
            this.data       = [];
            this.yDataSection  = [];
            this.xDataSection  = [];
            this._colors       = Theme.colors;
            this.fillStyle     = null;
            this.alpha         = 0.5;
            this.lineWidth     = 1;
            this.sprite = null ;
            this.currentAngInd = null;

            this.tips          = tipsOpt; //tip的confit
            this.domContainer  = domContainer;
            this._tip         = null; //tip的对象 tip的config 放到graphs的config中传递过来

            this._circlesSp    = [];//一个多边形上面的点的集合
    
            this.init( opt );
        };
    
        Graphs.prototype = {
            init : function( opt ){
                _.deepExtend(this , opt);
                this.sprite = new Canvax.Display.Sprite({ 
                    id : "graphsEl"
                });
                this._tip = new Tip( this.tips , this.domContainer );
                this.sprite.addChild(this._tip.sprite);
            },
            getFillStyle : function( i , ii , value){
                var fillStyle = null;
                if( _.isArray( this.fillStyle ) ){
                    fillStyle = this.fillStyle[i]
                }
                if( _.isFunction( this.fillStyle ) ){
                    fillStyle = this.fillStyle( i , ii , value );
                }
                if( !fillStyle || fillStyle=="" ){
                    fillStyle = this._colors[i];
                }
                return fillStyle;
            },
            draw : function(data , opt){
                this.data = data;
                _.deepExtend(this , opt);
                this._widget();
            },
            angOver : function(e , ind){
                this._tip.show( this._getTipsInfo(e,ind));
            },
            angMove : function(e , ind){
                if( ind != this.currentAngInd ){
                    if( this.currentAngInd != null ){
                        this._setCircleStyleForInd( this.currentAngInd );
                    }
                    this.currentAngInd = ind;
                    this._setCircleStyleForInd(ind);
                    
                }
                this._tip.move(this._getTipsInfo(e,ind));
            },
            angOut : function(e){
                this._setCircleStyleForInd( this.currentAngInd );
                this.currentAngInd = null;
                this._tip.hide(e)
            },
            _getTipsInfo : function(e,ind){
                e.tipsInfo = {
                    iGroup  : e.groupInd || 0,
                    iNode   : ind,
                    nodesInfoList : this._getTipsInfoList(e,ind)
                };
                return e;
            },
            _getTipsInfoList : function(e,ind){
                var list = [];
                var me   = this;
                _.each(this.data , function( group , i ){
                    list.push({
                        value : group[ind],
                        fillStyle : me.getFillStyle( i , ind , group[ind] )
                    });
                });
                return list;
            },
            _setCircleStyleForInd : function(ind){
                _.each( this._circlesSp , function( circles , i ){
                    //因为circles的sprite在该sprite里面索引为2
                    var circle = circles.getChildAt(ind); //group.getChildAt(2).getChildAt(ind);
                    if(!circle){
                        return;
                    }
                    var sCtx   = circle.context;
                    var s      = sCtx.fillStyle;
                    sCtx.fillStyle   = sCtx.strokeStyle;
                    sCtx.strokeStyle = s;
                } );
    
            },
            setPosition : function( x , y){
                var spc = this.sprite.context;
                spc.x   = x;
                spc.y   = y;
            },
            _widget : function(){
                
                if( this.data.length == 0 ){
                    return;
                }
                var n = this.data[ 0 ].length;
                if (!n || n < 2) { return; }
                var x = y = this.r;
                
                var dStep    = 2 * Math.PI / n;
                var beginDeg = -Math.PI / 2
                var deg      = beginDeg;
    
                var mxYDataSection = this.yDataSection[ this.yDataSection.length - 1 ];

                this._circlesSp     = [];
                
                for( var i=0,l=this.data.length ; i<l ; i++ ){
    
                    var pointList = []
                    var group     = new Canvax.Display.Sprite({
                        id : "radarGroup_"+i
                    });;
                    var circles   = new Canvax.Display.Sprite({
                        
                    });

                    this._circlesSp.push(circles);
    
                    for (var ii = 0, end = n ; ii < end; ii ++) {
                        var val = this.data[i][ii];
                        if( val == null || val == undefined ){
                            continue;
                        };
                        var r  = this.r * ( val / mxYDataSection );
                        var px = x + r * Math.cos(deg);
                        var py = y + r * Math.sin(deg);
                        pointList.push([ px , py ]);
                        deg += dStep;
    
                        circles.addChild(new Circle({
                            context : {
                                x : px,
                                y : py,
                                r : 5,
                                fillStyle   : this.getFillStyle(i , ii , val), //this._colors[i],
                                strokeStyle : "#ffffff",
                                lineWidth   : 2
                            }
                        }));
                    };
                    deg = beginDeg;

                    if( circles.children.length == 0 ){
                        circles.destroy();
                        continue;
                    };
    
                    var polygonBg = new Polygon({
                        id : "radar_bg_"+i,
                        context : {
                            pointList   : pointList,
                            globalAlpha : this.alpha,//0.5,
                            fillStyle   : this.getFillStyle(i)//this._colors[i]
                        }
                    });
                    var polygonBorder = new Polygon({
                        id : "radar_Border_"+i,
                        context : {
                            pointList : pointList,
                            lineWidth : 2,
                            cursor    : "pointer",
                            fillStyle : "RGBA(0,0,0,0)",
                            strokeStyle : this.getFillStyle(i)//this._colors[i]
                        }
                    });
    
                    //最开始该poly是在的group的index，用来mouseout的时候还原到本来的位置。
                    polygonBorder.groupInd = i;
                    polygonBorder.bg       = polygonBg
                    polygonBorder.hover(function(e){
                        e.groupInd = this.groupInd;
                        this.parent.toFront();
                        this.bg.context.globalAlpha += 0.3 
                    },function(){
                        var backCount = this.parent.parent.getNumChildren();
                        this.parent.toBack( backCount - this.groupInd - 1 );
                        this.bg.context.globalAlpha -= 0.3 

                    });
                    
                    polygonBorder.on("click" , function(e){    
                        e.groupInd = this.groupInd
                    });
    
                    group.addChild( polygonBg );
                    group.addChild( polygonBorder );
                    group.addChild( circles );
    
                    this.sprite.addChild( group );
                }
            }
        }; 
    
        return Graphs;
    
    }
)


define(
    "chartx/chart/radar/xaxis",
    [
        "canvax/index",
        "canvax/shape/Isogon"
    ],
    function( Canvax , Isogon ){
        var xAxis = function( opt , data ){
            this.dataOrg     = [];
            this.dataSection = [];
            this.color       = "#000000";
            this.sprite      = null;
            this.init(opt , data);
        };
        xAxis.prototype = {
            init : function(opt , data){
                this.sprite  = new Canvax.Display.Sprite({
                    id        : 'xAxis'
                });
    
                this.dataOrg = data.org;
                _.deepExtend(this , opt);
                this.dataSection = _.flatten( this.dataOrg );
            },
            draw : function(opt){
                _.deepExtend(this , opt);
                this.data = this._trimXAxis();
                this._widget();
            },
            setPosition : function( x , y){
                var spc = this.sprite.context;
                spc.x   = x;
                spc.y   = y;
            },
            _trimXAxis : function(){
                var tmpData  = [];
                var r = this.r ;
                var isogon   = new Isogon({
                    context  : {
                        x : r,
                        y : r,
                        r : r + 2,
                        n : this.dataSection.length
                    }
                });
                var me = this;
                
                //因为pointList的最后一个元素 是 和 第一个数据重复的。
                isogon.context.pointList.pop();
    
                _.each( isogon.context.pointList , function(point , i){
                    tmpData.push({
                        content : me.dataSection[i],
                        x       : point[0],
                        y       : point[1]
                    });
                } );
    
                return tmpData;
            },
            _widget : function(){
                var me = this;
                _.each( this.data , function(item){
                    var c = {
                        x : item.x + me.r,
                        y : item.y + me.r,
                        fillStyle : me.color
                    }
    
                    c = _.deepExtend( c , me._getTextAlignForPoint(Math.atan2(item.y , item.x)) );
                    me.sprite.addChild(new Canvax.Display.Text(item.content,{
                        context : c
                    }));
                    
                } );
            },
            /**
             *把弧度分为4大块区域-90 --> 0 , 0-->90 , 90-->180, -180-->-90
             **/
            _getTextAlignForPoint : function(r){
                var textAlign    = "center";
                var textBaseline = "bottom";
    
                /* 默认的就不用判断了
                if(r==-Math.PI/2){
                    return {
                        textAlign    : "center",
                        textBaseline : "bottom"
                    }
                }
                */
                if(r>-Math.PI/2 && r<0){
                    textAlign    = "left";
                    textBaseline = "bottom";
                }
                if(r==0){
                    textAlign    = "left";
                    textBaseline = "middle";
                }
                if(r>0 && r<Math.PI/2){
                    textAlign    = "left";
                    textBaseline = "top";
                }
                if(r==Math.PI/2){
                    textAlign    = "center";
                    textBaseline = "top";
                }
                if(r>Math.PI/2 && r<Math.PI){
                    textAlign    = "right";
                    textBaseline = "top";
                }
                if(r==Math.PI || r == -Math.PI){
                    textAlign    = "right";
                    textBaseline = "middle";
                }
                if(r>-Math.PI && r < -Math.PI/2){
                    textAlign    = "right";
                    textBaseline = "bottom";
                }
                return {
                    textAlign    : textAlign,
                    textBaseline : textBaseline
                }
            }
        };
        return xAxis;
    }
);


define(
    "chartx/chart/radar/index",
    [
        'chartx/chart/index',
        'chartx/utils/tools',
        './xaxis',
        'chartx/components/yaxis/yAxis',
        './back',
        './graphs',
        'canvax/geom/HitTestPoint',
        'chartx/utils/dataformat'
    ],
    function( Chart , Tools ,  xAxis, yAxis, Back, Graphs , HitTestPoint ,dataFormat){
        /*
         *@node chart在dom里的目标容器节点。
        */
        var Canvax = Chart.Canvax;
    
        return Chart.extend( {
    
            init:function(node , data , opts){
                this.r             = 0 
    
                this._xAxis        = null;
                this._yAxis        = null;
                this._back         = null;
                this._graphs       = null;

                this._labelH       = 20; //预留给label的height
                
                _.deepExtend( this , opts );
                this.dataFrame = this._initData( data , this );
            },
            _initData : dataFormat,
            _getR : function(){
                var minWorH = Math.min( 
                    this.width - this.padding.left - this.padding.right,
                    this.height - this.padding.top - this.padding.bottom
                );
                if( !this.r ) {
                    this.r = minWorH / 2
                };
                if( this.r > minWorH / 2 ){
                     this.r = minWorH / 2
                };
                this.r -= this._labelH;
            },
            draw:function(){
                this.stageBg       = new Canvax.Display.Sprite({
                    id        : 'bg'
                });
                this.stageCore     = new Canvax.Display.Sprite({
                    id        : 'graph'
                });
    
                this.stage.addChild(this.stageBg);
                this.stage.addChild(this.stageCore);
    
                //计算一下半径
                this._getR();
    
                //初始化模块
                this._initModule( this , this.dataFrame );                        
    
                //开始绘图
                this._startDraw();
    
                //绘制结束，添加到舞台
                this._drawEnd();                           
    
                var me = this;

                this.stage.on("mouseover" , function(e){
                    me._graphs.angOver( e , me._getCurrAng(e) );
                });
                this.stage.on("mousemove" , function(e){
                    me._graphs.angMove( e , me._getCurrAng(e) );
                });
                this.stage.on("mouseout",function(e){
                    
                    //找到最外围的那个
                    var lastIsogon = me._back.sprite.getChildById("isogon_" + (me._yAxis.dataSection.length-1));
                    var origPoint  = me._getPointBack(e);
                    if( !lastIsogon || !HitTestPoint.isInside( lastIsogon , origPoint )){
                        me._graphs.angOut( );
                    }
                });
                this.stage.on("click" , function(e){
                    e.eventInfo = {
                        field : _.isArray(me.yAxis.field) ? me.yAxis.field[e.groupInd] : me.yAxis.field
                    };
                    var itemInd = me._getCurrAng(e);

                    if( e.eventInfo.field ){
                        e.eventInfo.role = {
                            name : me._xAxis.dataSection[ itemInd ],
                            value: me._yAxis.dataOrg[e.groupInd][itemInd]
                        };
                    } else {
                        e.eventInfo.role = null
                    }
                    me.fire("click" , e);
                });

                this.inited = true;
            },
            _getCurrAng   : function(e){
                var origPoint = this._getPointBack(e);
    
                //该point对应的角度
                var angle = Math.atan2( origPoint.y , origPoint.x ) * 180 / Math.PI;
    
                //目前当前的r是 从-PI 到PI 的 值，所以转换过来的页是180 到 -180的范围值。
                //需要转换到0-360度
                //另外因为蜘蛛网的起始角度为-90度，所以还要+90 来把角度转换到对应的范围里面
                var itemAng = 360 / this._xAxis.dataSection.length;
    
                angle = ( 360 + angle + 90 + itemAng/2 ) % 360;
    
                var ind = parseInt(angle / itemAng);

                return ind;

            },
            _getPointBack : function(e){
                //先把point转换到_back的坐标系内
                //可能e.target会是 来自_graph的 polygon，
                //所以再这里把所有的point都转换到back上面。。。。。
                //方便得到该point所在的整个雷达上面的位置(角度，弧度)
                var origPoint  = this._back.sprite.globalToLocal( e.target.localToGlobal( e.point , this.sprite ) );
                origPoint.x   -= this.r;
                origPoint.y   -= this.r;
                return origPoint;
            },
            _initModule:function(opt , data){
                this._xAxis  = new xAxis(opt.xAxis , data.xAxis);
                this._yAxis  = new yAxis(opt.yAxis , data.yAxis);
                this._back   = new Back( opt.back );
                this._graphs = new Graphs( opt.graphs , opt.tips , this.canvax.getDomContainer());
            },
            _startDraw : function(){
                
                var r = this.r;
                var backAndGraphsOpt = {
                    r    : r,
                    yDataSection : this._yAxis.dataSection,
                    xDataSection : this._xAxis.dataSection
                };
                
                //绘制背景网格
                this._back.draw( backAndGraphsOpt );
            
                var backSpc = this._back.sprite.context;

                var backX   = ( this.width  - backSpc.width ) / 2;
                var backY   = this.padding.top + this._labelH;//( this.height - backSpc.height ) / 2;
    
                this._back.setPosition(backX , backY);
    
                //绘制雷达图形区域
                this._graphs.draw( this._yAxis.dataOrg , backAndGraphsOpt );
                this._graphs.setPosition(backX , backY);
    
                //绘制xAxis标注
                this._xAxis.draw({
                    r : r
                });
                this._xAxis.setPosition(backX , backY);
            },
            _drawEnd:function(){
                this.stageBg.addChild(this._back.sprite);
                this.stageCore.addChild(this._xAxis.sprite);
                this.stageCore.addChild(this._graphs.sprite);
            }
        });
        
    } 
);
