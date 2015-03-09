define(
    "chartx/chart/map/index",
    [
        'chartx/chart/index',
        'canvax/shape/Path',
        'chartx/chart/map/mapdata',
        './tips',
        'chartx/utils/dataformat'
    ],
    function( Chart , Path , mapData , Tips , DataFormat ){
    
        return Chart.extend({
            init : function( node , data , opts){
                this.tips = {};
                this.normalColor = "#c9bbe6";
                this.area = {
                    normal : {
                        strokeStyle : "white",
                        fillStyle   : this.normalColor,
                        lineWidth   : 3
                    },
                    hover  : {
                        strokeStyle : "#9378ce",
                        fillStyle   : this.normalColor,
                        lineWidth   : 3
                    }
                }
                this.areaField = "area";

                this.tips = {
                    field : []
                }

                _.deepExtend( this , opts );

                this._dataFrame = DataFormat(data , {
                     xAxis : {field : [ this.areaField ]},
                     yAxis : {field : this.tips.field }
                });

                //DataFormat后会重新计算出来最后的field
                this.tips.field = this._dataFrame.yAxis.field;

                this._mapScale = Math.min( this.width / 560 , this.height / 470 );
            },
            draw : function(){
                this._initModule();
                this._widget();
            },
            _getDataForArea : function( area ){
                var data = null;
                var me   = this;
                _.each( this._dataFrame.xAxis.org[ 0 ] , function( areaData , i ){
                    if( areaData.indexOf( area.index ) >= 0 ){
                        data = me._dataFrame.org[ i+1 ];
                    }
                } );
                return data;
            },
            _getColor : function( c , area ){
                var color = c;
                if( _.isFunction( c ) ){
                    color = c( this._getDataForArea(area) );
                }
                //缺省颜色
                if( !color || color == "" ){
                    color = this.normalColor;
                }
                return color;
            },
            _widget : function(){
                var me = this;
                var mapDataList = mapData.get();

                _.each(mapDataList , function( mapData , i ){
                    var map = new Path({
                        context : {
                            x:0,
                            y:0,
                            scaleX      : me._mapScale,
                            scaleY      : me._mapScale,
                            path        : mapData.d,
                            lineWidth   : me.area.normal.lineWidth,
                            fillStyle   : me._getColor( me.area.normal.fillStyle   , mapData ),
                            strokeStyle : me._getColor( me.area.normal.strokeStyle , mapData )
                        }
                    });
                    map.mapData = mapData;
                    map.on("mouseover hold" , function(e){
                        this.context.strokeStyle = me._getColor( me.area.hover.strokeStyle , this.mapData  );
                        this.context.fillStyle   = me._getColor( me.area.hover.fillStyle   , this.mapData  );
                        this.context.lineWidth   = me.area.hover.lineWidth;
                        me._tips.show( me._setTipsInfoHand(e , this.mapData) );
                    });
                    map.on("mouseout release" , function(e){
                        this.context.strokeStyle = me._getColor( me.area.normal.strokeStyle , this.mapData );
                        this.context.fillStyle   = me._getColor( me.area.normal.fillStyle   , this.mapData );
                        this.context.lineWidth   = me.area.normal.lineWidth;
                        me._tips.hide( e );
                    })
                    me.stage.addChild(map); 
                });

            },
            _initModule : function(){
                this.tips.cPointStyle = this.area.hover.strokeStyle;
                this.tips._mapScale    = this._mapScale;
                this._tips   = new Tips(this.tips , {
                    //context : "中国地图"
                } , this.canvax.getDomContainer());
                this.canvax.getHoverStage().addChild( this._tips.sprite );
            },
            _setTipsInfoHand : function( e , mapData ){
                 
                var tipsInfo = {
                    area : {field : this.areaField , value :  mapData.index },
                    nodesInfoList : []
                };
                var me = this;


                //先计算好这个area是否在data中有传入数据
                var areaData = this._getDataForArea( mapData );

                if( areaData ){
                    _.each( this.tips.field , function( field , i ){
                        tipsInfo.nodesInfoList.push({
                            field  : field ,
                            value  : areaData[ _.indexOf( me._dataFrame.org[0] , field ) ]
                        });
                    } );
                }

                e.tipsInfo   = tipsInfo;
                return e;
            }
        });
    }
);
