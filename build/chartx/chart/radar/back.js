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
            this.guidType     = "spider"; //蜘蛛网，也可以是 圆环（ ripple ）
            this.outerPointList    = []; //外围的
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
                    var ringEl;
                    if(this.guidType == "spider"){
                        ringEl = new Isogon({
                            id : "ring_isogon_" + i,
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
                    } else {
                        ringEl = new Circle({
                            id : "ring_circle_" + i,
                            context : {
                                x : r,
                                y : r,
                                r : this.r * rScale,
                                strokeStyle : this.strokeStyle,
                                lineWidth   : this.lineWidth,
                                fillStyle   : "RGBA(0,0,0,0)"
                            }
                        });
                    };
                    //给最外面的蜘蛛网添加事件，让它冒泡到外面去
                    if( i == l - 1 ) {
                        ringEl.hover(function(){},function(){});
                        ringEl.on("mousemove",function(){});
                        ringEl.on("click tap",function(){});
                        //然后要把最外面的isogon的rect范围作为sprite 的 width and height
                        var rectRange = ringEl.getRect();
                        var spc       = spt.context;
                        spc.width     = rectRange.width;
                        spc.height    = rectRange.height;

                        //并且计算最外网丝上面的对应顶点
                        if(this.guidType == "spider"){
                            this.outerPointList = ringEl.context.pointList;
                        } else {
                            //圆环的话，就需要自己计算了
                            var n = ys.length;
                            var dStep = 2 * Math.PI / n;
                            var beginDeg = -Math.PI / 2;
                            var deg = beginDeg;
                            for (var i = 0, end = n; i < end; i++) {
                                this.outerPointList.push([r * Math.cos(deg), r * Math.sin(deg)]);
                                deg += dStep;
                            };
                        };
                    };
                    spt.addChild( ringEl );
                };
    
                //从中心圆绘制朝外的射线
                for( var ii=0 , ll = this.outerPointList.length ; ii < ll ; ii++ ){
                    var line = new Line({
                        id : "line_"+ii,
                        context : {
                            xStart : r,
                            yStart : r,
                            xEnd   : this.outerPointList[ii][0] + r,
                            yEnd   : this.outerPointList[ii][1] + r,
                            lineWidth   : this.lineWidth,
                            strokeStyle : this.strokeStyle
                        }
                    });
                    spt.addChild( line );
                };
            }
        }
        return Back;
    } 
);
