define("chartx/chart/pie/3d",["chartx/chart/index","chartx/chart/pie/3d/pie","chartx/components/legend/index"],function(a,b,c){var d=a.Canvax;return a.extend({init:function(a,b,c){this.data=b,this.ignoreFields=[],this._opts=c,this.options=c,this.config={mode:1,event:{enabled:1}},this.xAxis={field:null},this.yAxis={field:null},this.rotation={x:45,y:0},this.thickness=26.25,_.deepExtend(this,c),this.dataFrame=this._initData(b,this)},draw:function(){this.stageBg=new d.Display.Sprite({id:"bg"}),this.core=new d.Display.Sprite({id:"core"}),this.stageTip=new d.Display.Stage({id:"stageTip"}),this.canvax.addChild(this.stageTip),this.stageTip.toFront(),this.stage.addChild(this.core),this._initModule(),this._startDraw(),this._drawEnd(),this.inited=!0},_initData:function(a,b){var c=[],a=_.clone(a);if(this.xAxis.field){var d=a.shift(),e=_.indexOf(d,this.xAxis.field),f=e+1;f>=d.length&&(f=0),this.yAxis.field&&(f=_.indexOf(d,this.yAxis.field)),_.each(a,function(a){var b=[];_.isArray(a)?(b.push(a[e]),b.push(a[f])):"object"==typeof a&&(b.push(a.name),b.push(a.y)),c.push(b)})}else c=a;var g={};if(g.org=c,g.data=[],_.isArray(c))for(var h=0;h<c.length;h++){var i={};_.isArray(c[h])?(i.name=c[h][0],i.y=parseFloat(c[h][1]),i.sliced=!1,i.selected=!1):"object"==typeof c[h]&&(i.name=c[h].name,i.y=parseFloat(c[h].y),i.sliced=c[h].sliced||!1,i.selected=c[h].selected||!1),i.name&&g.data.push(i)}if((c.length>0&&"asc"==b.sort||"desc"==b.sort)&&(g.org.sort(function(a,c){return"desc"==b.sort?a[1]-c[1]:"asc"==b.sort?c[1]-a[1]:void 0}),g.data.sort(function(a,c){return"desc"==b.sort?a.y-c.y:"asc"==b.sort?c.y-a.y:void 0})),g.data.length>0)for(h=0;h<g.data.length;h++)_.contains(this.ignoreFields,g.data[h].name)&&(g.data[h].ignored=!0,g.data[h].y=0);return g},_initModule:function(){var a=this,c=a.width,d=a.height;c-=this.padding.left+this.padding.right,d-=this.padding.top+this.padding.bottom;var e=2*Math.min(c,d)/3/2;a.dataLabel&&0==a.dataLabel.enabled&&(e=Math.min(c,d)/2,e-=e/11);var f=parseInt(a.innerRadius||0),g=2*e/3;f=f>=0?f:0,f=g>=f?f:g;var h=c/2+this.padding.left,i=d/2+this.padding.top;a.rotation.x=Math.max(0,Math.min(75,a.rotation.x)),a.rotation.y=Math.max(0,Math.min(75,a.rotation.y)),a.pie={x:h,y:i,r0:f,r:e,rotation:a.rotation,thickness:a.thickness,boundWidth:c,boundHeight:d,data:a.dataFrame,animation:a.animation,globalAlpha:a.globalAlpha,startAngle:parseInt(a.startAngle),colors:a.colors,focusCallback:{focus:function(b,c){a.fire("focus",b)},unfocus:function(b,c){a.fire("unfocus",b)}},checked:a.checked?a.checked:{enabled:!1}},a.dataLabel&&(a.pie.dataLabel=a.dataLabel),a._pie=new b(a.pie,a.tips,a.canvax.getDomContainer()),a._pie.sprite.on("mousedown mousemove mouseup click dblclick",function(b){a.fire(b.type,b)})},_startDraw:function(){this._pie.draw(this)},_drawEnd:function(){this.core.addChild(this._pie.sprite)},clear:function(){this.stageBg.removeAllChildren(),this.core.removeAllChildren(),this.stageTip.removeAllChildren()},reset:function(a){a=a||{},this.clear(),this._pie.clear();var b=a.data||this.data;_.deepExtend(this,a.options),this.dataFrame=this._initData(b,this.options),this.draw()},checkAt:function(a){this._pie&&this._pie.check(a)},uncheckAt:function(a){this._pie&&this._pie.uncheck(a)},focusAt:function(a){this._pie&&this._pie.focus(a)},unfocusAt:function(a){this._pie&&this._pie.unfocus(a)},uncheckAll:function(){this._pie&&this._pie.uncheckAll()},checkOf:function(a){this.checkAt(this._getIndexOfxName(a))},uncheckOf:function(a){this.uncheckAt(this._getIndexOfxName(a))},_getIndexOfxName:function(a){for(var b,c=this.getList(),d=0,e=c.length;e>d;d++)if(c[d].name==a){b=d;break}return b},_setLengend:function(){var a=this;if(!(!this.legend||this.legend&&"enabled"in this.legend&&!this.legend.enabled)){var b=_.deepExtend({legend:!0,label:function(a){return a.field},onChecked:function(b){a.add(b)},onUnChecked:function(b){a.remove(b)},layoutType:"v"},this._opts.legend);this._legend=new c(this._getLegendData(),b),this.stage.addChild(this._legend.sprite),this._legend.pos({x:this.width-this._legend.width,y:this.height/2-this._legend.h/2}),this.padding.right+=this._legend.width}},_getLegendData:function(){var a=[];return _.each(this.dataFrame.data,function(b,c){a.push({field:b.name,value:b.y,fillStyle:null})}),a},getByIndex:function(a){return this._pie._getByIndex(a)},getLabelList:function(){return this._pie.getLabelList()},getList:function(){var a,b=this,c=[];if(b._pie){var d=b._pie.getList();if(d.length>0)for(var e=0;e<d.length;e++){a=d[e];var f=b._pie.data.data[e];c.push({name:a.name,index:a.index,color:a.color,r:a.r,value:a.value,percentage:a.percentage,checked:f.checked})}}return c},getCheckedList:function(){var a=[];return _.each(this.getList(),function(b){b.checked&&a.push(b)}),a},remove:function(a){var b=this,c=b.data;if(a&&c.length>1)for(var d=1;d<c.length;d++)c[d][0]!=a||_.contains(b.ignoreFields,a)||b.ignoreFields.push(a);b.reset()},add:function(a){var b=this,c=b.data;if(a&&c.length>1)for(var d=1;d<c.length;d++)c[d][0]==a&&_.contains(b.ignoreFields,a)&&b.ignoreFields.splice(_.indexOf(b.ignoreFields,a),1);b.reset()}})});