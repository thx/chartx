define(
    "dvix/chart/radar/graphs",
    [
        "canvax/index",
        "canvax/shape/Polygon",
        "canvax/shape/Circle",
        "canvax/animation/Tween"
    ],
    function( Canvax , Polygon , Circle , Tween ){
 
        var Graphs = function( opt , data ){
            this.pos    = {x : 0 , y : 0};
            this.r = 0; //蜘蛛网的最大半径
            this.dataOrg  = [];
            this.yDataSection = [];
            this.xDataSection = [];
            this._colors       = ["#6f8cb2" , "#c77029" , "#f15f60" , "#ecb44f" , "#ae833a" , "#896149"];
            this.lineWidth   = 1;
            this.sprite = null ;
            this.currentAngInd = null;
    
            this.init( data );
    
        };
    
        Graphs.prototype = {
            init : function( opt ){
                _.deepExtend(this , opt);
                this.sprite = new Canvax.Display.Sprite({ 
                    id : "graphsEl"
                });
            },
            getFillStyle : function( i , ii , value){
                var fillStyle = null;
                if( _.isArray( this.fillStyle ) ){
                    fillStyle = this.fillStyle[ii]
                }
                if( _.isFunction( this.fillStyle ) ){
                    fillStyle = this.fillStyle( i , ii , value );
                }
                if( !fillStyle || fillStyle=="" ){
                    fillStyle = this._colors[ii];
                }
                return fillStyle;
            },
            draw : function(data , opt){
                this.dataOrg = data;
                _.deepExtend(this , opt);
                this._widget();
            },
            angHover : function(ind){
                if( ind != this.currentAngInd ){
                    if( this.currentAngInd != null ){
                        this._setCircleStyleForInd( this.currentAngInd );
                    }
                    this.currentAngInd = ind;
                    this._setCircleStyleForInd(ind)
                }
            },
            angOut : function(){
                this._setCircleStyleForInd( this.currentAngInd );
                this.currentAngInd = null;
            },
            _setCircleStyleForInd : function(ind){
                _.each( this.sprite.children , function( group , i ){
                    //因为circles的sprite在该sprite里面索引为2
                    var circle = group.getChildAt(2).getChildAt(ind);
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
                if( this.dataOrg.length == 0 ){
                    return;
                }
                var n = this.dataOrg[ 0 ].length;
                if (!n || n < 2) { return; }
                var x = y = this.r;
                
                var dStep    = 2 * Math.PI / n;
                var beginDeg = -Math.PI / 2
                var deg      = beginDeg;
    
                var mxYDataSection = this.yDataSection[ this.yDataSection.length - 1 ];
                
                for( var i=0,l=this.dataOrg.length ; i<l ; i++ ){
    
                    var pointList = []
                    var group     = new Canvax.Display.Sprite({
                        id : "radarGroup_"+i
                    });;
                    var circles   = new Canvax.Display.Sprite({
                        
                    });
    
                    for (var ii = 0, end = n ; ii < end; ii ++) {
                        var r  = this.r * ( this.dataOrg[i][ii] / mxYDataSection );
                        var px = x + r * Math.cos(deg);
                        var py = y + r * Math.sin(deg);
                        pointList.push([ px , py ]);
                        deg += dStep;
    
                        circles.addChild(new Circle({
                            context : {
                                x : px,
                                y : py,
                                r : 5,
                                fillStyle   : this._colors[i],
                                strokeStyle : "#ffffff",
                                lineWidth   : 2
                            }
                        }));
                    }
                    deg = beginDeg;
    
                    var polygonBg = new Polygon({
                        id : "radar_bg_"+i,
                        context : {
                            pointList   : pointList,
                            globalAlpha : 0.3,
                            fillStyle   : this._colors[i]
                        }
                    });
                    var polygonBorder = new Polygon({
                        id : "radar_Border_"+i,
                        context : {
                            pointList : pointList,
                            lineWidth : 2,
                            strokeStyle : this._colors[i]
                        }
                    });
    
                    //最开始该poly是在的group的index，用来mouseout的时候还原到本来的位置。
                    polygonBorder.originInd = i;
                    polygonBorder.hover(function(){
                        this.parent.toFront();
                    },function(){
                        var backCount = this.parent.parent.getNumChildren();
                        this.parent.toBack( backCount - this.originInd - 1 );
                    })
    
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
