define("chartx/chart/bar/graphs",["canvax/index","canvax/shape/Rect","chartx/utils/tools","chartx/chart/theme","canvax/animation/AnimationFrame","canvax/shape/BrokenLine"],function(a,b,c,d,e,f){var g=function(a,b){this.data=[],this.w=0,this.h=0,this.root=b,this._yAxisFieldsMap={},this._setyAxisFieldsMap(),this.animation=!0,this.pos={x:0,y:0},this._colors=d.colors,this.bar={width:0,_width:0,radius:4},this.text={enabled:!1,fillStyle:"#999",fontSize:12,format:null},this.average={enabled:!1,field:"average",fieldInd:-1,fillStyle:"#c4c9d6",data:null},this.checked={enabled:!1,fillStyle:"#00A8E6",strokeStyle:"#00A8E6",globalAlpha:.1,lineWidth:2},this.sort=null,this.eventEnabled=!0,this.sprite=null,this.txtsSp=null,this.checkedSp=null,this.yDataSectionLen=0,_.deepExtend(this,a),this._initaverage(),this.init()};return g.prototype={init:function(){this.sprite=new a.Display.Sprite({id:"graphsEl"}),this.barsSp=new a.Display.Sprite({id:"barsSp"}),this.txtsSp=new a.Display.Sprite({id:"txtsSp",context:{}}),this.checkedSp=new a.Display.Sprite({id:"checkedSp"})},setX:function(a){this.sprite.context.x=a},setY:function(a){this.sprite.context.y=a},_checked:function(a){var c=this,d=a.iGroup,e=c.barsSp.getChildById("barGroup_"+d);if(e){c.checkedSp.removeChildById("line_"+d),c.checkedSp.removeChildById("rect_"+d);var g=e.getChildAt(0),h=g.context.x+1,i=g.context.x+g.context.width-1,j=-c.h;if(a.checked){var k=new b({id:"rect_"+d,pointChkPriority:!1,context:{x:h,y:j,width:g.context.width,height:g.context.height,fillStyle:c.checked.fillStyle,globalAlpha:c.checked.globalAlpha}});c.checkedSp.addChild(k);var l=new f({id:"line_"+d,context:{pointList:[[h,j],[i,j]],strokeStyle:c.checked.strokeStyle,lineWidth:c.checked.lineWidth}});c.checkedSp.addChild(l)}}},removeAllChecked:function(){var a=this;a.checkedSp.removeAllChildren()},setBarStyle:function(a){for(var b=this,c=a.iGroup,d=b.barsSp.getChildById("barGroup_"+c),e=a.fillStyle||b._getColor(b.bar.fillStyle),f=0,g=d.getNumChildren();g>f;f++){var h=d.getChildAt(f);h.context.fillStyle=e}},_setyAxisFieldsMap:function(){var a=this;_.each(_.flatten(this.root.dataFrame.yAxis.field),function(b,c){a._yAxisFieldsMap[b]=c})},_initaverage:function(){this.average.enabled&&_.each(this.root.dataFraem,function(a,b){a.field==this.average.field&&(this.average.fieldInd=b)})},_getColor:function(a,b,c,d,e,f,g,h){var i=null;return _.isString(a)&&(i=a),_.isArray(a)&&(i=_.flatten(a)[this._yAxisFieldsMap[h]]),_.isFunction(a)&&(i=a.apply(this,[{iGroup:d,iNode:e,iLay:f,field:h,value:g}])),i&&""!=i||(i=this._colors[this._yAxisFieldsMap[h]]),i},checkBarW:function(a,b){this.bar.width&&_.isFunction(this.bar.width)&&(this.bar._width=this.bar.width(a)),this.bar.width||(this.bar._width=parseInt(b)-parseInt(Math.max(1,.3*b))),this.bar._width<1&&(this.bar._width=1)},resetData:function(a,b){this.draw(a.data,b)},draw:function(d,e){if(_.deepExtend(this,e),0!=d.length){var f=0;this.data[0]&&(f=this.data[0][0].length),this.data=d;var g=this,i=d.length,j=0;_.each(d,function(d,e){var k=d.length;if(0!=k){var l=d[0].length;for(j=g.w/l,15>j&&(g.text.enabled=!1),h=0;h<l;h++){var m;if(0==e){if(h<=f-1?m=g.barsSp.getChildById("barGroup_"+h):(m=new a.Display.Sprite({id:"barGroup_"+h}),g.barsSp.addChild(m),m.iGroup=h,m.on("click mousedown mousemove mouseup",function(a){a.eventInfo||(a.eventInfo=g._getInfoHandler(this))})),g.eventEnabled){var n;h<=f-1?(n=m.getChildById("bhr_"+h),n.context.width=j,n.context.x=j*h):(n=new b({id:"bhr_"+h,pointChkPriority:!1,context:{x:j*h,y:-g.h,width:j,height:g.h,fillStyle:"#ccc",globalAlpha:0}}),m.addChild(n),n.hover(function(a){this.context.globalAlpha=.1},function(a){this.context.globalAlpha=0}),n.iGroup=h,n.iNode=-1,n.iLay=-1,n.on("panstart mouseover mousemove mouseout click",function(a){a.eventInfo=g._getInfoHandler(this,a)}))}}else m=g.barsSp.getChildById("barGroup_"+h);for(v=0;v<k;v++){var o=d[v][h];o.iGroup=h,o.iNode=e,o.iLay=v;var p=parseInt(Math.abs(o.y));v>0&&(p-=parseInt(Math.abs(d[v-1][h].y)));var q=parseInt(o.y),r=g._getColor(g.bar.fillStyle,i,k,e,h,v,o.value,o.field);o.fillStyle=r;var s={x:Math.round(o.x-g.bar._width/2),y:q,width:parseInt(g.bar._width),height:p,fillStyle:r,scaleY:1},t={x:s.x,y:0,width:s.width,height:s.height,fillStyle:s.fillStyle,scaleY:0};if(g.bar.radius&&v==k-1){var u=Math.min(g.bar._width/2,p);u=Math.min(u,g.bar.radius),t.radius=[u,u,0,0]}g.animation||(delete t.scaleY,t.y=s.y);var w;if(h<=f-1?w=m.getChildById("bar_"+e+"_"+h+"_"+v):(w=new b({id:"bar_"+e+"_"+h+"_"+v,context:t}),m.addChild(w)),w.finalPos=s,w.iGroup=h,w.iNode=e,w.iLay=v,g.eventEnabled&&w.on("panstart mouseover mousemove mouseout click",function(a){a.eventInfo=g._getInfoHandler(this,a),"mouseover"==a.type&&(this.parent.getChildById("bhr_"+this.iGroup).context.globalAlpha=.1),"mouseout"==a.type&&(this.parent.getChildById("bhr_"+this.iGroup).context.globalAlpha=0)}),v==k-1&&g.text.enabled){var x,y=[o];if(h<=f-1?x=g.txtsSp.getChildById("infosp_"+e+"_"+h):(x=new a.Display.Sprite({id:"infosp_"+e+"_"+h,context:{visible:!1}}),x._hGroup=h,g.txtsSp.addChild(x)),k>1)for(var z=k-2;z>=0;z--)y.unshift(d[z][h]);var A=0,B=0;_.each(y,function(b,d){var i=b.value;!g.animation&&_.isFunction(g.text.format)&&(i=g.text.format(b.value)),!g.animation&&_.isNumber(i)&&(i=c.numAddSymbol(i));var j;h<=f-1?j=x.getChildById("info_txt_"+e+"_"+h+"_"+d):(j=new a.Display.Text(g.animation?0:i,{id:"info_txt_"+e+"_"+h+"_"+d,context:{x:A+2,fillStyle:b.fillStyle,fontSize:g.text.fontSize}}),x.addChild(j)),j._text=i,A+=j.getTextWidth()+2,B=Math.max(B,j.getTextHeight()),k-2>=d&&(j=new a.Display.Text("/",{context:{x:A+2,fillStyle:"#999"}}),A+=j.getTextWidth()+2,x.addChild(j))}),x._finalX=o.x-A/2,x._finalY=s.y-B,x._centerX=o.x,x.context.width=A,x.context.height=B,g.animation||(x.context.y=s.y-B,x.context.x=o.x-A/2,x.context.visible=!0)}}}}}),this.sprite.addChild(this.barsSp),this.sprite.addChild(this.checkedSp),this.text.enabled&&this.sprite.addChild(this.txtsSp),this.average.enabled&&this.average.data&&(!this.averageSp&&(this.averageSp=new a.Display.Sprite({id:"averageSp"})),_.each(this.average.layoutData,function(a,c){var d,e={x:j*c,y:a.y,fillStyle:g.average.fillStyle,width:j,height:2};f-1>=c?(d=g.averageSp.getChildById("average_"+c),d.context.x=e.x,d.context.y=e.y,d.context.width=e.width):(d=new b({id:"average_"+c,context:e}),g.averageSp.addChild(d))}),this.sprite.addChild(g.averageSp)),this.sprite.context.x=this.pos.x,this.sprite.context.y=this.pos.y,this.sort&&"desc"==this.sort&&(this.sprite.context.y-=this.h)}},_updateInfoTextPos:function(a){if("horizontal"!=this.root.type){var b=0,c=0,d=a.children.length;_.each(a.children,function(a,e){a.getTextWidth&&(a.context.x=b,b+=a.getTextWidth()+(d>e?2:0),c=Math.max(c,a.getTextHeight()))}),a.context.x=a._centerX-b/2+1,a.context.width=b,a.context.height=c}},grow:function(a,b){var d=this;if(!this.animation)return void(a&&a(d));var f=1;if(this.sort&&"desc"==this.sort&&(f=-1),d.barsSp.children.length>d.data[0][0].length)for(var g=d.data[0][0].length,i=d.barsSp.children.length;i>g;g++){d.barsSp.getChildAt(g).destroy();for(var j=0,k=d.txtsSp.children.length;k>j;j++)d.txtsSp.children[j]._hGroup==g&&(d.txtsSp.children[j].destroy(),j--,k--);d.averageSp&&d.averageSp.getChildAt(g).destroy(),g--,i--}var l=_.extend({delay:80,easing:"Back.Out",duration:500},b);_.each(d.data,function(a,b){var g=a.length;if(0!=g){var i=a[0].length;for(h=0;h<i;h++)for(v=0;v<g;v++){var j=d.barsSp.getChildById("barGroup_"+h),k=j.getChildById("bar_"+b+"_"+h+"_"+v);if(0==l.duration?(k.context.scaleY=f,k.context.y=f*f*k.finalPos.y,k.context.x=k.finalPos.x,k.context.width=k.finalPos.width,k.context.height=k.finalPos.height):(k._tweenObj&&e.destroyTween(k._tweenObj),k._tweenObj=k.animate({scaleY:f,y:f*k.finalPos.y,x:k.finalPos.x,width:k.finalPos.width,height:k.finalPos.height},{duration:l.duration,easing:l.easing,delay:h*l.delay,onUpdate:function(a){},onComplete:function(a){a.width<3&&(this.context.radius=0)},id:k.id})),d.text.enabled){var m=d.txtsSp.getChildById("infosp_"+b+"_"+h);"horizontal"==d.root.type&&(m.context.x=m._finalX),m.animate({y:m._finalY,x:m._finalX},{duration:l.duration,easing:l.easing,delay:h*l.delay,onUpdate:function(){this.context.visible=!0},onComplete:function(){}}),_.each(m.children,function(a){a._text&&e.registTween({from:{v:a.text},to:{v:a._text},duration:l.duration+300,delay:h*l.delay,onUpdate:function(){var b=this.v;_.isFunction(d.text.format)?b=d.text.format(b):_.isNumber(b)&&(b=c.numAddSymbol(parseInt(b))),a.resetText(b),a.parent?d._updateInfoTextPos(a.parent):a.destroy()}})})}}}}),window.setTimeout(function(){a&&a(d)},300*(this.barsSp.children.length-1))},_getInfoHandler:function(a){var b={iGroup:a.iGroup,iNode:a.iNode,iLay:a.iLay,nodesInfoList:this._getNodeInfo(a.iGroup,a.iNode,a.iLay)};return b},_getNodeInfo:function(a,b,c){var d=[],e=this,f=e.data.length;return void 0==a&&(a=0),void 0==b&&(b=-1),void 0==c&&(c=-1),_.each(e.data,function(g,i){var j,k=g.length;if(0!=k){var l=g[0].length;for(h=0;h<l;h++)if(h==a)for(v=0;v<k;v++)b!=i&&-1!=b||c!=v&&-1!=c||(j=g[v][h],j.fillStyle=e._getColor(e.bar.fillStyle,f,k,i,h,v,j.value,j.field),d.push(j))}}),d}},g});