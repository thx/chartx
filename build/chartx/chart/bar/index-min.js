define("chartx/chart/bar/graphs",["canvax/index","canvax/shape/Rect","canvax/animation/Tween","chartx/components/tips/tip","chartx/utils/tools"],function(a,b,c,d,e){var f=function(a,b,c,e){this.dataFrame=e,this.w=0,this.h=0,this.pos={x:0,y:0},this._colors=["#42a8d7","#666666","#6f8cb2","#c77029","#f15f60","#ecb44f","#ae833a","#896149"],this.bar={width:12,radius:2},this.text={enabled:0,fillStyle:"#999999",fontSize:12,textAlign:"left",format:null},this.eventEnabled=!0,this.sprite=null,this.txtsSp=null,this.yDataSectionLen=0,_.deepExtend(this,a),this._tip=new d(b,c),this.init()};return f.prototype={init:function(){this.sprite=new a.Display.Sprite({id:"graphsEl"}),this.txtsSp=new a.Display.Sprite({id:"txtsSp",context:{visible:!1}})},setX:function(a){this.sprite.context.x=a},setY:function(a){this.sprite.context.y=a},_getColor:function(a,b,c,d){var e=null;return _.isString(a)&&(e=a),_.isArray(a)&&(e=a[c]),_.isFunction(a)&&(e=a({iGroup:c,iNode:b,value:d})),e&&""!=e||(e=this._colors[c]),e},checkBarW:function(a){this.bar.width>=a&&(this.bar.width=a-1>1?a-1:1)},draw:function(c,d){if(_.deepExtend(this,d),0!=c.length){this.data=c;for(var f=c[0].length,g=0;f>g;g++){for(var h=new a.Display.Sprite({id:"barGroup"+g}),i=new a.Display.Sprite({id:"barGroupHover"+g}),j=0,k=c.length;k>j;j++){var l=c[j][g],m=this._getColor(this.bar.fillStyle,g,j,l.value),n=parseInt(Math.abs(l.y)),o={x:Math.round(l.x-this.bar.width/2),y:parseInt(l.y),width:parseInt(this.bar.width),height:n,fillStyle:m};if(this.bar.radius){var p=Math.min(this.bar.width/2,n);p=Math.min(p,this.bar.radius),o.radius=[p,p,0,0]}var q=new b({id:"bar_"+j+"_"+g,context:o}),r=this.h/(this.yDataSectionLen-1),s=Math.ceil(n/r)*r,t=new b({id:"bar_"+j+"_"+g+"hover",context:{x:Math.round(l.x-this.bar.width/2),y:-s,width:parseInt(this.bar.width),height:s,fillStyle:"black",globalAlpha:0,cursor:"pointer"}});if(t.target=q,t.row=g,t.column=j,this.eventEnabled){var u=this;t.on("mouseover",function(a){var b=this.target.context;b.x--,b.width+=2,u.sprite.addChild(u._tip.sprite),u._tip.show(u._setTipsInfoHandler(a,this.row,this.column))}),t.on("mousemove",function(a){u._tip.move(u._setTipsInfoHandler(a,this.row,this.column))}),t.on("mouseout",function(a){var b=this.target.context;b.x++,b.width-=2,u._tip.hide(a),u.sprite.removeChild(u._tip.sprite)})}var v=l.value;v=_.isFunction(this.text.format)?this.text.format(v):e.numAddSymbol(v);var w=new a.Display.Text(v,{context:{fillStyle:this.text.fillStyle,fontSize:this.text.fontSize,textAlign:this.text.textAlign}});w.context.x=l.x-w.getTextWidth()/2,w.context.y=o.y-w.getTextHeight(),w.context.y+this.h<0&&(w.context.y=-this.h),this.txtsSp.addChild(w),h.addChild(q),i.addChild(t)}this.sprite.addChild(h),this.sprite.addChild(i)}this.sprite.addChild(this.txtsSp),this.sprite.context.x=this.pos.x,this.sprite.context.y=this.pos.y}},grow:function(){function a(){d=requestAnimationFrame(a),c.update()}var b=this,d=null,e=function(){new c.Tween({h:0}).to({h:b.h},500).onUpdate(function(){b.sprite.context.scaleY=this.h/b.h}).onComplete(function(){b._growEnd(),cancelAnimationFrame(d)}).start();a()};e()},_growEnd:function(){this.text.enabled&&(this.txtsSp.context.visible=!0)},_setXaxisYaxisToTipsInfo:function(a){a.tipsInfo.xAxis={field:this.dataFrame.xAxis.field,value:this.dataFrame.xAxis.org[0][a.tipsInfo.iNode]};var b=this;_.each(a.tipsInfo.nodesInfoList,function(a,c){a.field=b.dataFrame.yAxis.field[c]})},_setTipsInfoHandler:function(a,b,c){return a.tipsInfo={iGroup:c,iNode:b,nodesInfoList:this._getNodeInfo(b)},this._setXaxisYaxisToTipsInfo(a),a},_getNodeInfo:function(a){var b=[],c=this;return _.each(this.data,function(d,e){var f=_.clone(d[a]);f.fillStyle=c._getColor(c.bar.fillStyle,a,e,f.value),b.push(f)}),b}},f}),define("chartx/chart/bar/tips",["chartx/components/tips/tip"],function(){}),define("chartx/chart/bar/xaxis",["chartx/components/xaxis/xAxis"],function(a){var b=function(a,c){this.xDis1=0,b.superclass.constructor.apply(this,arguments)};return Chartx.extend(b,a,{_trimXAxis:function(a,b){var c=[];this.xDis1=b/a.length;for(var d=0,e=a.length;e>d;d++){var f={content:a[d],x:this.xDis1*(d+1)-this.xDis1/2};c.push(f)}return c}}),b}),define("chartx/chart/bar/index",["chartx/chart/index","chartx/utils/tools","chartx/utils/datasection","./xaxis","chartx/components/yaxis/yAxis","chartx/components/back/Back","./graphs","chartx/utils/dataformat"],function(a,b,c,d,e,f,g,h){var i=a.Canvax;return a.extend({init:function(a,b,c){this._xAxis=null,this._yAxis=null,this._back=null,this._graphs=null,_.deepExtend(this,c),this.dataFrame=this._initData(b,this)},draw:function(){this.core=new i.Display.Sprite({id:"core"}),this.stageBg=new i.Display.Sprite({id:"bg"}),this.stage.addChild(this.stageBg),this.stage.addChild(this.core),this.rotate&&this._rotate(this.rotate),this._initModule(),this._startDraw(),this._drawEnd(),this._arguments=arguments},_initData:h,_initModule:function(){this._xAxis=new d(this.xAxis,this.dataFrame.xAxis),this._yAxis=new e(this.yAxis,this.dataFrame.yAxis),this._back=new f(this.back),this._graphs=new g(this.graphs,this.tips,this.canvax.getDomContainer(),this.dataFrame)},_startDraw:function(){var a=parseInt(this.height-this._xAxis.h);this._yAxis.draw({pos:{x:0,y:a},yMaxHeight:a});var b=this._yAxis.w;this._xAxis.draw({graphh:this.height,graphw:this.width,yAxisW:b}),this._xAxis.yAxisW!=b&&(this._yAxis.resetWidth(this._xAxis.yAxisW),b=this._xAxis.yAxisW);var c=this._yAxis.yGraphsHeight;this._back.draw({w:this._xAxis.w,h:c,xAxis:{data:this._yAxis.layoutData},yAxis:{data:this._xAxis.layoutData},pos:{x:b,y:a}}),this._graphs.draw(this._trimGraphs(),{w:this._xAxis.xGraphsWidth,h:this._yAxis.yGraphsHeight,pos:{x:b,y:a},yDataSectionLen:this._yAxis.dataSection.length}),this._graphs.grow()},_trimGraphs:function(){var a=this,b=this._xAxis.data,c=this._yAxis.dataOrg,d=c.length,e=this._xAxis.xDis1,f=e/(d+1);this._graphs.checkBarW(f);for(var g=this._yAxis.dataSection[this._yAxis.dataSection.length-1],h=[],i=0;d>i;i++)!h[i]&&(h[i]=[]),_.each(c[i],function(d,j){var k=b[j].x-e/2+f*(i+1);_.isArray(d)?(!h[i][j]&&(h[i][j]=[]),_.each(d,function(b,c){var d=-(b-a._yAxis._bottomNumber)/(g-a._yAxis._bottomNumber)*a._yAxis.yGraphsHeight;j>0&&(d+=h[i][j-1][c].y),h[i][j].push({value:b,x:k,y:d})})):h[i][j]={value:c[i][j],x:k,y:-(c[i][j]-a._yAxis._bottomNumber)/(g-a._yAxis._bottomNumber)*a._yAxis.yGraphsHeight}});return h},_drawEnd:function(){this.stageBg.addChild(this._back.sprite),this.core.addChild(this._xAxis.sprite),this.core.addChild(this._graphs.sprite),this.core.addChild(this._yAxis.sprite)}})});