define(
    "chartx/chart/map/index",
    [
        'canvax/index',
        'chartx/chart/index',
        'canvax/shape/Path',
        'canvax/shape/Polygon',
        //'chartx/chart/map/mapdata',
        'chartx/chart/map/map-data/params',
        'chartx/chart/map/map-data/geo-coord',
        'chartx/chart/map/map-data/text-fixed',
        'chartx/utils/projection/normal',
        './tips',
        'chartx/utils/dataformat'
    ],
    function( Canvax , Chart , Path , Polygon , mapParams , GeoCoord , TextFixed , Projection , Tips , DataFormat ){
    
        return Chart.extend({
            init : function( node , data , opts){
                this.mapType     = "china";//map类型 默认为中国地图
                this._mapDataMap = {};
                this.tips = {};
                this.normalColor = "#c9bbe6";
                this.area = {
                    strokeStyle : "white",
                    fillStyle   : this.normalColor,
                    lineWidth   : 3
                };

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

                this._mapScale = 1 //Math.min( this.width / 560 , this.height / 470 );

                
                this.sprite    = new Canvax.Display.Sprite({
                    id   : "mapSp"
                });
                this.stage.addChild( this.sprite );
            },
            draw : function(){
                this._initModule();
                var me = this;
                this._getMapData( this.mapType , function( md ){
                    me._widget( md );
                } );
            },
            _getMapData : function( mt , callback ){
                var me = this;
                this._mapDataMap[mt] = this._mapDataMap[mt] || {};
                mapParams.params[ mt ].getGeoJson( this._mapDataCallback( mt , callback ) );
            },
            /**
             * @param {string} mt mapType
             * @param {function} callback 
             */
            _mapDataCallback : function (mt, callback) {
                var self = this;
                return function ( md ) {
                    self._mapDataMap[mt].mapData = md;
                    self._mapDataMap[mt].rate = 0.75;
                    self._mapDataMap[mt].projection = Projection;
                    var d = self._getProjectionData(mt, md);     // 地图数据
                    _.isFunction(callback) && callback( d );
                };
            },
            /**
             * 按需加载相关地图 
             */
            _getProjectionData : function (mapType, mapData) {
                var normalProjection = this._mapDataMap[mapType].projection;
                var province = [];
                var bbox = this._mapDataMap[mapType].bbox 
                           || normalProjection.getBbox( mapData );
                
                var transform = this._getTransform(
                    bbox,
                    this._mapDataMap[mapType].rate
                );
                var lastTransform = this._mapDataMap[mapType].lastTransform || {scale:{}};
                
                var pathArray;
                if (transform.left != lastTransform.left
                    || transform.top != lastTransform.top
                    || transform.scale.x != lastTransform.scale.x
                    || transform.scale.y != lastTransform.scale.y
                ) {
                    //发生过变化，需要重新生成pathArray
                    pathArray     = normalProjection.geoJson2Path( mapData, transform);
                    lastTransform = _.clone(transform);
                }
                else {
                    transform = this._mapDataMap[mapType].transform;
                    pathArray = this._mapDataMap[mapType].pathArray;
                }
                
                this._mapDataMap[mapType].bbox = bbox;
                this._mapDataMap[mapType].transform = transform;
                this._mapDataMap[mapType].lastTransform = lastTransform;
                this._mapDataMap[mapType].pathArray = pathArray;
                
                var position = [transform.left, transform.top];
                for (var i = 0, l = pathArray.length; i < l; i++) {
                    /* for test
                    console.log(
                        mapData.features[i].properties.cp, // 经纬度度
                        pathArray[i].cp                    // 平面坐标
                    );
                    console.log(
                        this.pos2geo(mapType, pathArray[i].cp),  // 平面坐标转经纬度
                        this.geo2pos(mapType, mapData.features[i].properties.cp)
                    )
                    */
                    province.push(this._getSingleProvince(
                        mapType, pathArray[i], position
                    ));
                }
                
                // 中国地图加入南海诸岛
                if (mapType == 'china' && false) {
                    var leftTop = this.geo2pos(
                        mapType, 
                        GeoCoord['南海诸岛'] || _mapParams['南海诸岛'].textCoord
                    );
                    // scale.x : width  = 10.51 : 64
                    var scale = transform.scale.x / 10.5;
                    var textPosition = [
                        32 * scale + leftTop[0], 
                        83 * scale + leftTop[1]
                    ];
                    if (TextFixed['南海诸岛']) {
                        textPosition[0] += TextFixed['南海诸岛'][0];
                        textPosition[1] += TextFixed['南海诸岛'][1];
                    }
                    province.push({
                        name : this._nameChange(mapType, '南海诸岛'),
                        path : _mapParams['南海诸岛'].getPath(leftTop, scale),
                        position : position,
                        textX : textPosition[0],
                        textY : textPosition[1]
                    });
                    
                }
                return province;
            },
            /**
             * 百分比计算
             */
            parsePercent : function( value, maxValue ){
                if (typeof value === 'string') {
                    if (_trim(value).match(/%$/)) {
                        return parseFloat(value) / 100 * maxValue;
                    }

                    return parseFloat(value);
                }
                return value;
            },
            _getSingleProvince : function (mapType, path, position) {
                var textPosition;
                var name = path.properties.name;
                var textFixed = TextFixed[name] || [0, 0];
                if (GeoCoord[name]) {
                    // 经纬度直接定位不加textFixed
                    textPosition = this.geo2pos(
                        mapType, 
                        GeoCoord[name]
                    );
                } else if (path.cp) {
                    textPosition = [
                        path.cp[0] + textFixed[0], 
                        path.cp[1] + textFixed[1]
                    ];
                } else {
                    var bbox = this._mapDataMap[mapType].bbox;
                    textPosition = this.geo2pos(
                        mapType, 
                        [bbox.left + bbox.width / 2, bbox.top + bbox.height / 2]
                    );
                    textPosition[0] += textFixed[0];
                    textPosition[1] += textFixed[1];
                }
                
                path.name     =  name;
                path.position = position;
                path.textX    = textPosition[0];
                path.textY    = textPosition[1];
                return path;
            },
            /**
             * 获取缩放 
             */
            _getTransform : function (bbox, rate) {
                var width;
                var height;
                var graphWidth  = this.canvax.width;
                var graphHeight = this.canvax.height;
                
                width  = !width  ? graphWidth  : (this.parsePercent(width, graphWidth));
                height = !height ? graphHeight : (this.parsePercent(height, graphHeight));
                
                var mapWidth = bbox.width;
                var mapHeight = bbox.height;
                //var minScale;
                var xScale = (width / rate) / mapWidth;
                var yScale = height / mapHeight;
                if (xScale > yScale) {
                    //minScale = yScale;
                    xScale = yScale * rate;
                    width  = mapWidth * xScale;
                }
                else {
                    yScale = xScale;
                    xScale = yScale * rate;
                    height = mapHeight * yScale;
                }
                
                return {
                    left  : 0,
                    top   : 0,
                    width : width,
                    height: height,
                    baseScale : 1,
                    scale : {
                        x : xScale,
                        y : yScale
                    }
                };
            },


            _getDataForArea : function( area ){
                var data = null;
                var me   = this;
                _.each( this._dataFrame.xAxis.org[ 0 ] , function( areaData , i ){
                    if( areaData.indexOf( area.name ) >= 0 ){
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
            _widget : function( features ){
                var me = this;
                var mapDataList = features;

                _.each(mapDataList , function( md , i ){
                    var area_sp = new Canvax.Display.Sprite({
                        id   : "tips_"+i,
                        name : md.properties.name 
                    });
                    var shapeCtx = {
                        x:0,
                        y:0,
                        scaleX      : me._mapScale,
                        scaleY      : me._mapScale,
                        path        : md.path,
                        lineWidth   : me.area.lineWidth,
                        fillStyle   : me._getColor( me.area.fillStyle   , md ),
                        strokeStyle : me._getColor( me.area.strokeStyle , md )
                    };

                    var area   = new Path({
                        context : shapeCtx
                    });

                    area_sp.addChild( area );
                    
                    area.mapData = md;
                    area.on("mouseover hold" , function(e){
                        this.context.strokeStyle = me._getColor( me.area.strokeStyle , this.mapData  );
                        this.context.fillStyle   = me._getColor( me.area.fillStyle   , this.mapData  );
                        this.context.lineWidth   = me.area.lineWidth;
                        me._tips.show( me._setTipsInfoHand(e , this.mapData) );
                    });
                    area.on("mouseout release" , function(e){
                        this.context.strokeStyle = me._getColor( me.area.strokeStyle , this.mapData );
                        this.context.fillStyle   = me._getColor( me.area.fillStyle   , this.mapData );
                        this.context.lineWidth   = me.area.lineWidth;
                        me._tips.hide( e );
                    });

                    me.sprite.addChild( area_sp ); 
                });

            },
            _initModule : function(){
                this.tips.cPointStyle = this.area.strokeStyle;
                this.tips._mapScale    = this._mapScale;
                this._tips   = new Tips(this.tips , {
                    //context : "中国地图"
                } , this.canvax.getDomContainer());
                this.canvax.getHoverStage().addChild( this._tips.sprite );
            },
            _setTipsInfoHand : function( e , mapData ){

                var tipsInfo = {
                    area : {field : this.areaField , value :  mapData.name },
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
