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
            this.smooth        = false;
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
                            smooth : this.smooth,
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
                            smooth    : this.smooth,
                            strokeStyle : this.getFillStyle(i)//this._colors[i]
                        }
                    });
    
                    //最开始该poly是在的group的index，用来mouseout的时候还原到本来的位置。
                    polygonBorder.groupInd = i;
                    polygonBorder.bg       = polygonBg;
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
