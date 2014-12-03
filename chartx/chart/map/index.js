define(
    "chartx/chart/map/index",
    [
        'chartx/chart/index',
        'canvax/shape/Path',
        'chartx/chart/map/mapdata',
        './tips'
    ],
    function( Chart , Path , mapData , Tips ){
    
        return Chart.extend({
            init : function(){
                this.itemStyle = {
                    strokeStyle : "white",
                    fillStyle   : "#c9bbe6",
                    lineWidth   : 3
                }
                this.itemHoverStyle = {
                    strokeStyle : "#9378ce",
                    fillStyle   : "#c9bbe6",
                    lineWidth   : 3
                }
            },
            draw : function(){
                this._initModule();
                this._widget();
            },
            _widget : function(){
                var me = this;
                var mapDataList = mapData.get();

                _.each(mapDataList , function( mapData , i ){
                    var map = new Path({
                        context : {
                            x:0,
                            y:0,
                            path :mapData.d ,
                            lineWidth   : me.itemStyle.lineWidth,
                            fillStyle   : me.itemStyle.fillStyle,
                            strokeStyle : me.itemStyle.strokeStyle
                        }
                    });
                    map.mapData = mapData;
                    map.on("mouseover hold" , function(e){
                        this.context.strokeStyle = me.itemHoverStyle.strokeStyle;
                        this.context.lineWidth   = me.itemHoverStyle.lineWidth; 
                        me._tips.show(e);
                    });
                    map.on("mouseout release" , function(e){
                        this.context.strokeStyle = me.itemStyle.strokeStyle;
                        this.context.lineWidth   = me.itemStyle.lineWidth;
                        me._tips.hide(e);
                    })
                    me.stage.addChild(map); 
                });

            },
            _initModule : function(){
                this._tips   = new Tips(this.tips , {
                    context : "中国地图"
                } , this.canvax.getDomContainer());
                this.canvax.getHoverStage().addChild( this._tips.sprite );
            }
            
        });
    }
);
