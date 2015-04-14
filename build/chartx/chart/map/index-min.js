define("chartx/chart/map/index",["canvax/index","chartx/chart/index","canvax/shape/Path","canvax/shape/Polygon","chartx/chart/map/map-data/params","chartx/chart/map/map-data/geo-coord","chartx/chart/map/map-data/text-fixed","chartx/utils/projection/normal","./tips","chartx/utils/dataformat"],function(a,b,c,d,e,f,g,h,i,j){return b.extend({init:function(b,c,d){this.mapType="china",this._mapDataMap={},this.tips={},this.normalColor="#c9bbe6",this.area={strokeStyle:"white",fillStyle:this.normalColor,lineWidth:1,linkage:!1,text:!0},this.areaField="area",this.tips={field:[]},_.deepExtend(this,d),this._dataFrame=j(c,{xAxis:{field:[this.areaField]},yAxis:{field:this.tips.field}}),this.tips.field=this._dataFrame.yAxis.field,this._mapScale=1,this.sprite=new a.Display.Sprite({id:"mapSp"})},draw:function(){this.sprite.removeAllChildren(),this.stage.addChild(this.sprite),this._tips&&this._tips.hide(),this._initModule();var a=this;this._getMapData(this.mapType,function(b){a._widget(b),a._setSpPos()})},_setSpPos:function(){var a=this._mapDataMap[this.mapType].transform,b=this.sprite.context;b.width=a.width,b.height=a.height,b.x=(this.width-a.width)/2,b.y=(this.height-a.height)/2},_getMapData:function(a,b){this._mapDataMap[a]=this._mapDataMap[a]||{},e.params[a].getGeoJson(this._mapDataCallback(a,b))},_mapDataCallback:function(a,b){var c=this;return function(d){c._mapDataMap[a].mapData=d,c._mapDataMap[a].rate=.75,c._mapDataMap[a].projection=h;var e=c._getProjectionData(a,d);_.isFunction(b)&&b(e)}},_getProjectionData:function(a,b){var c,d=this._mapDataMap[a].projection,e=[],f=this._mapDataMap[a].bbox||d.getBbox(b),g=this._getTransform(f,this._mapDataMap[a].rate),h=this._mapDataMap[a].lastTransform||{scale:{}};g.left!=h.left||g.top!=h.top||g.scale.x!=h.scale.x||g.scale.y!=h.scale.y?(c=d.geoJson2Path(b,g),h=_.clone(g)):(g=this._mapDataMap[a].transform,c=this._mapDataMap[a].pathArray),this._mapDataMap[a].bbox=f,this._mapDataMap[a].transform=g,this._mapDataMap[a].lastTransform=h,this._mapDataMap[a].pathArray=c;for(var i=[g.left,g.top],j=0,k=c.length;k>j;j++)e.push(this._getSingleProvince(a,c[j],i));return e},parsePercent:function(a,b){return"string"==typeof a?_trim(a).match(/%$/)?parseFloat(a)/100*b:parseFloat(a):a},geo2pos:function(a,b){return this._mapDataMap[a].transform?this._mapDataMap[a].projection.geo2pos(this._mapDataMap[a].transform,b):null},_getSingleProvince:function(a,b,c){var d,e=b.properties.name,h=g[e]||[0,0];if(f[e])d=this.geo2pos(a,f[e]);else if(b.cp)d=[b.cp[0]+h[0],b.cp[1]+h[1]];else{var i=this._mapDataMap[a].bbox;d=this.geo2pos(a,[i.left+i.width/2,i.top+i.height/2]),d[0]+=h[0],d[1]+=h[1]}return b.name=e,b.position=c,b.textX=d[0],b.textY=d[1],b},_getTransform:function(a,b){var c,d,e=this.width,f=this.height;c=c?this.parsePercent(c,e):e,d=d?this.parsePercent(d,f):f;var g=a.width,h=a.height,i=c/b/g,j=d/h;return i>j?(i=j*b,c=g*i):(j=i,i=j*b,d=h*j),{left:0,top:0,width:c,height:d,baseScale:1,scale:{x:i,y:j}}},_getDataForArea:function(a){var b=null,c=this;return _.each(this._dataFrame.xAxis.org[0],function(d,e){d.indexOf(a.name)>=0&&(b=c._dataFrame.org[e+1])}),b},_getColor:function(a,b){var c=a;return _.isFunction(a)&&(c=a(this._getDataForArea(b))),c&&""!=c||(c=this.normalColor),c},_widget:function(b){var d=this,f=b;_.each(f,function(b,f){var g=new a.Display.Sprite({id:"tips_"+f,name:b.properties.name}),h={x:0,y:0,scaleX:d._mapScale,scaleY:d._mapScale,path:b.path,lineWidth:d.area.lineWidth,fillStyle:d._getColor(d.area.fillStyle,b),strokeStyle:d._getColor(d.area.strokeStyle,b)},i=new c({context:h});if(g.addChild(i),i.mapData=b,i.on("mouseover hold",function(a){this.context.cursor="pointer",this.context.lineWidth=d.area.lineWidth+1,d._tips.show(d._setTipsInfoHand(a,this.mapData))}),i.on("mouseout release",function(a){this.context.lineWidth=d.area.lineWidth,d._tips.hide(a)}),i.on("click",function(a){d.area.linkage&&(d.mapType=e.params[this.mapData.name]?this.mapData.name:"china"),d.fire("areaClick",a)}),g.on("click",function(){}),d.area.text){new a.Display.Text(_.isFunction(d.area.text)?d.area.text(this.mapData.name):this.mapData.name,{context:{x:x,y:y,fillStyle:self.text.fillStyle,textBaseline:"middle"}})}d.sprite.addChild(g)})},_initModule:function(){this.tips.cPointStyle=this.area.strokeStyle,this.tips._mapScale=this._mapScale,this._tips=new i(this.tips,{},this.canvax.getDomContainer()),this.canvax.getHoverStage().addChild(this._tips.sprite)},_setTipsInfoHand:function(a,b){var c={area:{field:this.areaField,value:b.name},nodesInfoList:[]},d=this,e=this._getDataForArea(b);return e&&_.each(this.tips.field,function(a){c.nodesInfoList.push({field:a,value:e[_.indexOf(d._dataFrame.org[0],a)]})}),a.tipsInfo=c,a}})});