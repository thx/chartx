define("chartx/components/line/Graphs",["canvax/index","canvax/shape/Rect","chartx/utils/tools","canvax/animation/Tween","chartx/components/line/Group","chartx/utils/deep-extend"],function(a,b,c,d,e){var f=function(a,b){this.w=0,this.h=0,this.y=0,this.opt=a,this.root=b,this.ctx=b.stage.context2D,this.data=[],this.disX=0,this.groups=[],this.iGroup=0,this.iNode=-1,this._nodesInfoList=[],this.sprite=null,this.induce=null,this.event={enabled:0},this.init(a)};return f.prototype={init:function(b){this.opt=b,this.sprite=new a.Display.Sprite},setX:function(a){this.sprite.context.x=a},setY:function(a){this.sprite.context.y=a},getX:function(){return this.sprite.context.x},getY:function(){return this.sprite.context.y},draw:function(a){var b=this;_.deepExtend(this,a),b._widget()},grow:function(){function a(){c=requestAnimationFrame(a),d.update()}var b=this,c=null,e=function(){new d.Tween({h:0}).to({h:b.h},300).onUpdate(function(){b.sprite.context.scaleY=this.h/b.h}).onComplete(function(){cancelAnimationFrame(c)}).start();a()};e()},_widget:function(){for(var a=this,c=0,d=a.data.length;d>c;c++){var f=new e(c,a.opt,a.ctx);f.draw({data:a.data[c]}),a.sprite.addChild(f.sprite),a.groups.push(f)}a.induce=new b({id:"induce",context:{y:-a.h,width:a.w,height:a.h,fillStyle:"#000000",globalAlpha:0,cursor:a.event.enabled?"pointer":""}}),a.sprite.addChild(a.induce),a.induce.on("hold mouseover",function(b){b.tipsInfo=a._getInfoHandler(b),a._fireHandler(b)}),a.induce.on("drag mousemove",function(b){b.tipsInfo=a._getInfoHandler(b),a._fireHandler(b)}),a.induce.on("release mouseout",function(b){b.tipsInfo=a._getInfoHandler(b),a._fireHandler(b);var c={iGroup:a.iGroup,iNode:a.iNode};b.tipsInfo=c,a.iGroup=0,a.iNode=-1}),a.induce.on("click",function(b){b.tipsInfo=a._getInfoHandler(b),a._fireHandler(b)})},_getInfoHandler:function(a){var b=a.point.x,d=a.point.y-this.h,e=0==this.disX?0:parseInt((b+this.disX/2)/this.disX),f=c.getDisMinATArr(d,_.pluck(this._nodesInfoList,"y"));this._nodesInfoList=[];for(var g=0,h=this.groups.length;h>g;g++){var i=this.groups[g].getNodeInfoAt(e);this._nodesInfoList.push(i)}this.iGroup=f,this.iNode=e;var j={iGroup:this.iGroup,iNode:this.iNode,nodesInfoList:_.clone(this._nodesInfoList)};return j},_fireHandler:function(a){var b=this,c={eventType:a.type,iGroup:a.tipsInfo.iGroup+1,iNode:a.tipsInfo.iNode+1};b.root.event.on(c)}},f});