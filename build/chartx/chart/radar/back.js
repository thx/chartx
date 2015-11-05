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
                            lineWidth   : this.lineWidth
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
