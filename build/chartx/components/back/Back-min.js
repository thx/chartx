define("chartx/components/back/Back",["canvax/index","canvax/shape/Line","canvax/shape/Rect","chartx/utils/tools"],function(a,b,c,d){var e=function(a){this.w=0,this.h=0,this.root=null,this.pos={x:0,y:0},this.enabled=1,this.xOrigin={enabled:1,lineWidth:1,strokeStyle:"#e6e6e6"},this.yOrigin={enabled:1,lineWidth:1,strokeStyle:"#e6e6e6",biaxial:!1},this.xAxis={enabled:1,data:[],org:null,lineType:"solid",lineWidth:1,strokeStyle:"#f0f0f0",filter:null},this.yAxis={enabled:0,data:[],org:null,lineType:"solid",lineWidth:1,strokeStyle:"#f0f0f0",filter:null},this.sprite=null,this.xAxisSp=null,this.yAxisSp=null,this.animation=!0,this.resize=!1,this.init(a)};return e.prototype={init:function(b){_.deepExtend(this,b),this.sprite=new a.Display.Sprite},setX:function(a){this.sprite.context.x=a},setY:function(a){this.sprite.context.y=a},draw:function(a,b){this.root=b,_.deepExtend(this,a),this._widget(),this.setX(this.pos.x),this.setY(this.pos.y)},update:function(a){this.sprite.removeAllChildren(),this.draw(a)},_widget:function(){var d=this;if(this.enabled){if(d.root&&d.root._yAxis&&d.root._yAxis.dataSectionGroup){d.yGroupSp=new a.Display.Sprite,d.sprite.addChild(d.yGroupSp);for(var e=0,f=d.root._yAxis.dataSectionGroup.length;e<f;e++){var g=d.root._yAxis.yGraphsHeight/f,h=new c({context:{x:0,y:-g*e,width:d.w,height:-g,fillStyle:"#000",globalAlpha:.025*(e%2)}});d.yGroupSp.addChild(h)}}d.xAxisSp=new a.Display.Sprite,d.sprite.addChild(d.xAxisSp),d.yAxisSp=new a.Display.Sprite,d.sprite.addChild(d.yAxisSp);for(var i=d.xAxis.data,j=0,k=i.length;j<k;j++){var l=i[j],m=new b({id:"back_line_"+j,context:{xStart:0,yStart:l.y,xEnd:0,yEnd:l.y,lineType:d.xAxis.lineType,lineWidth:d.xAxis.lineWidth,strokeStyle:d.xAxis.strokeStyle}});d.xAxis.enabled&&(_.isFunction(d.xAxis.filter)&&d.xAxis.filter({layoutData:d.yAxis.data,index:j,line:m}),d.xAxisSp.addChild(m),this.animation&&!this.resize?m.animate({xStart:0,xEnd:d.w},{duration:500,delay:80*(k-j),id:m.id}):(m.context.xStart=0,m.context.xEnd=d.w))}for(var i=d.yAxis.data,j=0,k=i.length;j<k;j++){var l=i[j],m=new b({context:{xStart:l.x,yStart:0,xEnd:l.x,yEnd:-d.h,lineType:d.yAxis.lineType,lineWidth:d.yAxis.lineWidth,strokeStyle:d.yAxis.strokeStyle,visible:!!l.x}});d.yAxis.enabled&&(_.isFunction(d.yAxis.filter)&&d.yAxis.filter({layoutData:d.xAxis.data,index:j,line:m}),d.yAxisSp.addChild(m))}var n=null==d.yAxis.org?0:_.find(d.yAxis.data,function(a){return a.content==d.yAxis.org}).x,m=new b({context:{xStart:n,xEnd:n,yEnd:-d.h,lineWidth:d.yOrigin.lineWidth,strokeStyle:d.yOrigin.strokeStyle}});if(d.yOrigin.enabled&&d.sprite.addChild(m),d.yOrigin.biaxial){var o=new b({context:{xStart:d.w,xEnd:d.w,yEnd:-d.h,lineWidth:d.yOrigin.lineWidth,strokeStyle:d.yOrigin.strokeStyle}});d.yOrigin.enabled&&d.sprite.addChild(o)}var p=null==d.xAxis.org?0:_.find(d.xAxis.data,function(a){return a.content==d.xAxis.org}).y,m=new b({context:{yStart:p,xEnd:d.w,yEnd:p,lineWidth:d.xOrigin.lineWidth,strokeStyle:d.xOrigin.strokeStyle}});d.xOrigin.enabled&&d.sprite.addChild(m)}}},e});