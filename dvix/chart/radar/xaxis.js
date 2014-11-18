define(
    "dvix/chart/radar/xaxis",
    [
        "canvax/index",
        "canvax/shape/Isogon",
        "dvix/utils/deep-extend"
    ],
    function( Canvax , Isogon ){
        var xAxis = function( opt , data ){
            this.dataOrg     = [];
            this.dataSection = [];
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
                        r : r + 6,
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
                        fillStyle : '#000000'
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
