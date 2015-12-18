define("chartx/chart/bar/graphs",["canvax/index","canvax/shape/Rect","chartx/utils/tools","chartx/chart/theme","canvax/animation/AnimationFrame"],function(a,b,c,d,e){var f=function(a,b){this.data=[],this.w=0,this.h=0,this.root=b,this._yAxisFieldsMap={},this._setyAxisFieldsMap(),this.animation=!0,this.pos={x:0,y:0},this._colors=d.colors,this.bar={width:20,radius:4},this.text={enabled:!1,fillStyle:"#999",fontSize:12,format:null},this.average={enabled:!1,field:"average",fieldInd:-1,fillStyle:"#c4c9d6",data:null},this.sort=null,this.eventEnabled=!0,this.sprite=null,this.txtsSp=null,this.yDataSectionLen=0,_.deepExtend(this,a),this._initaverage(),this.init()};return f.prototype={init:function(){this.sprite=new a.Display.Sprite({id:"graphsEl"}),this.barsSp=new a.Display.Sprite({id:"barsSp"}),this.txtsSp=new a.Display.Sprite({id:"txtsSp",context:{}})},setX:function(a){this.sprite.context.x=a},setY:function(a){this.sprite.context.y=a},_setyAxisFieldsMap:function(){var a=this;_.each(_.flatten(this.root.dataFrame.yAxis.field),function(b,c){a._yAxisFieldsMap[b]=c})},_initaverage:function(){this.average.enabled&&_.each(this.root.dataFraem,function(a,b){a.field==this.average.field&&(this.average.fieldInd=b)})},_getColor:function(a,b,c,d,e,f,g,h){var i=null;return _.isString(a)&&(i=a),_.isArray(a)&&(i=_.flatten(a)[this._yAxisFieldsMap[h]]),_.isFunction(a)&&(i=a.apply(this,[{iGroup:d,iNode:e,iLay:f,field:h,value:g}])),i&&""!=i||(i=this._colors[this._yAxisFieldsMap[h]]),i},checkBarW:function(a){this.bar.width=parseInt(a)-parseInt(Math.max(1,.3*a)),this.bar.width<1&&(this.bar.width=1)},resetData:function(a,b){this.draw(a.data,b)},draw:function(d,e){if(_.deepExtend(this,e),0!=d.length){var f=0;this.data[0]&&(f=this.data[0][0].length),this.data=d;var g=this,i=d.length,j=0;_.each(d,function(d,e){var k=d.length;if(0!=k){var l=d[0].length;for(j=g.w/l,15>j&&(g.text.enabled=!1),h=0;h<l;h++){var m;if(0==e){if(h<=f-1?m=g.barsSp.getChildById("barGroup_"+h):(m=new a.Display.Sprite({id:"barGroup_"+h}),g.barsSp.addChild(m),m.iGroup=h,m.on("click mousedown mousemove mouseup",function(a){a.eventInfo||(a.eventInfo=g._getInfoHandler(this))})),g.eventEnabled){var n;h<=f-1?(n=m.getChildById("bhr_"+h),n.context.width=j,n.context.x=j*h):(n=new b({id:"bhr_"+h,pointChkPriority:!1,context:{x:j*h,y:-g.h,width:j,height:g.h,fillStyle:"#ccc",globalAlpha:0}}),m.addChild(n),n.hover(function(a){this.context.globalAlpha=.1},function(a){this.context.globalAlpha=0}),n.iGroup=h,n.iNode=-1,n.iLay=-1,n.on("panstart mouseover mousemove mouseout click",function(a){a.eventInfo=g._getInfoHandler(this,a)}))}}else m=g.barsSp.getChildById("barGroup_"+h);for(v=0;v<k;v++){var o=d[v][h];o.iGroup=h,o.iNode=e,o.iLay=v;var p=parseInt(Math.abs(o.y));v>0&&(p-=parseInt(Math.abs(d[v-1][h].y)));var q=parseInt(o.y),r=g._getColor(g.bar.fillStyle,i,k,e,h,v,o.value,o.field);o.fillStyle=r;var s={x:Math.round(o.x-g.bar.width/2),y:q,width:parseInt(g.bar.width),height:p,fillStyle:r,scaleY:1},t={x:s.x,y:0,width:s.width,height:s.height,fillStyle:s.fillStyle,scaleY:0};if(g.bar.radius&&v==k-1){var u=Math.min(g.bar.width/2,p);u=Math.min(u,g.bar.radius),t.radius=[u,u,0,0]}g.animation||(delete t.scaleY,t.y=s.y);var w;if(h<=f-1?w=m.getChildById("bar_"+e+"_"+h+"_"+v):(w=new b({id:"bar_"+e+"_"+h+"_"+v,context:t}),m.addChild(w)),w.finalPos=s,w.iGroup=h,w.iNode=e,w.iLay=v,g.eventEnabled&&w.on("panstart mouseover mousemove mouseout click",function(a){a.eventInfo=g._getInfoHandler(this,a),"mouseover"==a.type&&(this.parent.getChildById("bhr_"+this.iGroup).context.globalAlpha=.1),"mouseout"==a.type&&(this.parent.getChildById("bhr_"+this.iGroup).context.globalAlpha=0)}),v==k-1){var x,y=[o];if(x=h<=f-1?g.txtsSp.getChildById("infosp_"+e+"_"+h):new a.Display.Sprite({id:"infosp_"+e+"_"+h,context:{visible:!1}}),k>1)for(var z=k-2;z>=0;z--)y.unshift(d[z][h]);var A=0,B=0;_.each(y,function(b,d){var i=b.value;g.animation&&_.isFunction(g.text.format)&&(i=g.text.format(b.value)),g.animation&&_.isNumber(i)&&(i=c.numAddSymbol(i));var j;j=h<=f-1?x.getChildById("info_txt_"+e+"_"+h+"_"+d):new a.Display.Text(g.animation?0:i,{id:"info_txt_"+e+"_"+h+"_"+d,context:{x:A+2,fillStyle:b.fillStyle}}),j._text=i,x.addChild(j),A+=j.getTextWidth()+2,B=Math.max(B,j.getTextHeight()),k-2>=d&&(j=new a.Display.Text("/",{context:{x:A+2,fillStyle:"#999"}}),A+=j.getTextWidth()+2,x.addChild(j))}),x._finalX=o.x-A/2,x._finalY=s.y-B,x._centerX=o.x,g.animation||(x.context.y=s.y-B,x.context.x=o.x-A/2,x.context.visible=!0),g.txtsSp.addChild(x)}}}}}),this.sprite.addChild(this.barsSp),this.text.enabled&&this.sprite.addChild(this.txtsSp),this.average.enabled&&this.average.data&&(!this.averageSp&&(this.averageSp=new a.Display.Sprite({id:"averageSp"})),_.each(this.average.layoutData,function(a,c){var d,e={x:j*c,y:a.y,fillStyle:g.average.fillStyle,width:j,height:2};f-1>=c?(d=g.averageSp.getChildById("average_"+c),d.context.x=e.x,d.context.y=e.y,d.context.width=e.width):(d=new b({id:"average_"+c,context:e}),g.averageSp.addChild(d))}),this.sprite.addChild(g.averageSp)),this.sprite.context.x=this.pos.x,this.sprite.context.y=this.pos.y,this.sort&&"desc"==this.sort&&(this.sprite.context.y-=this.h)}},_updateInfoTextPos:function(a){var b=0,c=a.children.length;_.each(a.children,function(a,d){a.getTextWidth&&(a.context.x=b,b+=a.getTextWidth()+(c>d?2:0))}),a.context.x=a._centerX-b/2+1},grow:function(a,b){var d=this;if(!this.animation)return void(a&&a(d));var f=1;if(this.sort&&"desc"==this.sort&&(f=-1),d.barsSp.children.length>d.data[0][0].length)for(var g=d.data[0][0].length,i=d.barsSp.children.length;i>g;g++)d.barsSp.getChildAt(g).destroy(),d.txtsSp.getChildAt(g).destroy(),d.averageSp.getChildAt(g).destroy(),g--,i--;var j=_.extend({delay:80,easing:"Back.Out",duration:500},b);_.each(d.data,function(a,b){var g=a.length;if(0!=g){var i=a[0].length;for(h=0;h<i;h++)for(v=0;v<g;v++){var k=d.barsSp.getChildById("barGroup_"+h),l=k.getChildById("bar_"+b+"_"+h+"_"+v);if(0==j.duration?(l.context.scaleY=f,l.context.y=f*f*l.finalPos.y,l.context.x=l.finalPos.x,l.context.width=l.finalPos.width,l.context.height=l.finalPos.height):(l._tweenObj&&e.destroyTween(l._tweenObj),l._tweenObj=l.animate({scaleY:f,y:f*l.finalPos.y,x:l.finalPos.x,width:l.finalPos.width,height:l.finalPos.height},{duration:j.duration,easing:j.easing,delay:h*j.delay,onUpdate:function(a){},onComplete:function(a){a.width<3&&(this.context.radius=0)},id:l.id})),d.text.enabled){var m=d.txtsSp.getChildById("infosp_"+b+"_"+h);m.animate({y:m._finalY,x:m._finalX},{duration:j.duration,easing:j.easing,delay:h*j.delay,onUpdate:function(){this.context.visible=!0},onComplete:function(){}}),_.each(m.children,function(a){a._text&&e.registTween({from:{v:a.text},to:{v:a._text},duration:j.duration+300,delay:h*j.delay,onUpdate:function(){var b=this.v;_.isFunction(d.text.format)?b=d.text.format(b):_.isNumber(b)&&(b=c.numAddSymbol(parseInt(b))),a.resetText(b),a.parent?d._updateInfoTextPos(a.parent):a.destroy()}})})}}}}),window.setTimeout(function(){a&&a(d)},300*(this.barsSp.children.length-1))},_getInfoHandler:function(a){var b={iGroup:a.iGroup,iNode:a.iNode,iLay:a.iLay,nodesInfoList:this._getNodeInfo(a.iGroup,a.iNode,a.iLay)};return b},_getNodeInfo:function(a,b,c){var d=[],e=this,f=e.data.length;return void 0==a&&(a=0),void 0==b&&(b=-1),void 0==c&&(c=-1),_.each(e.data,function(g,i){var j,k=g.length;if(0!=k){var l=g[0].length;for(h=0;h<l;h++)if(h==a)for(v=0;v<k;v++)b!=i&&-1!=b||c!=v&&-1!=c||(j=g[v][h],j.fillStyle=e._getColor(e.bar.fillStyle,f,k,i,h,v,j.value,j.field),d.push(j))}}),d}},f});