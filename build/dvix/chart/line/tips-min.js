KISSY.add("dvix/chart/line/tips",function(a,b,c,d,e){var f=function(a,b,c){this.container=c,this.sprite=null,this.context=null,this._line=null,this._nodes=null,this._tip=null,this._back=null,this.prefix=b.yAxis.field,this.init(a)};return f.prototype={init:function(a){_.deepExtend(this,a),this.sprite=new b.Display.Sprite({id:"tips"})},show:function(a){var b=this._getTipsPoint(a);this._initLine(a,b),this._initNodes(a,b),this._initContext(a,b),this._initBack(a,b),this._moveContext()},move:function(a){this._resetPosition(a)},hide:function(){this.sprite.removeAllChildren(),this._removeContext()},_getTipsPoint:function(a){return a.target.localToGlobal(a.info.nodesInfoList[a.info.iGroup])},_resetPosition:function(a){var b=this._getTipsPoint(a);this._line.context.x=b.x,this._resetNodesPosition(a,b),this._resetContext(a),this._back.context.x=this._getBackX(a,b),this._moveContext()},_initLine:function(a,b){var d=_.deepExtend({x:b.x,y:a.target.localToGlobal().y,xStart:0,yStart:a.target.context.height,xEnd:0,yEnd:0,lineType:"dashed",lineWidth:1,strokeStyle:"#333333"},this.line);this._line=new c({id:"tipsLine",context:d}),this.sprite.addChild(this._line)},_initNodes:function(a,c){this._nodes=new b.Display.Sprite({id:"tipsNodes",context:{x:c.x,y:a.target.localToGlobal().y}});var e=this;_.each(a.info.nodesInfoList,function(b){e._nodes.addChild(new d({context:{y:a.target.context.height-Math.abs(b.y),r:3,fillStyle:b.fillStyle,strokeStyle:"#ffffff",lineWidth:3}}))}),this.sprite.addChild(this._nodes)},_resetNodesPosition:function(a,b){var c=this;this._nodes.context.x=b.x,_.each(a.info.nodesInfoList,function(b,d){c._nodes.getChildAt(d).context.y=a.target.context.height-Math.abs(b.y)})},_initContext:function(b){this._tip=a.all("<div class='chart-tips' style='visibility:hidden;position:absolute;<D-r>display:inline-block;*display:inline;*zoom:1;padding:6px;'></div>"),this._tip.html(this._getContext(b)),this.container.append(this._tip)},_removeContext:function(){this._tip.remove(),this._tip=null},_resetContext:function(a){this._tip.html(this._getContext(a))},_moveContext:function(){this._tip.css({visibility:"visible",left:this._back.context.x+"px",top:this._back.context.y+"px"})},_getContext:function(a){var b=this.context;return b||(b=this._getDefaultContext(a)),b},_getDefaultContext:function(a){var b="<table>",c=this;return _.each(a.info.nodesInfoList,function(a,d){b+="<tr style='color:"+a.fillStyle+"'><td>"+c.prefix[d]+"</td><td>"+a.value+"</td></tr>"}),b+="</table>"},_initBack:function(a,b){var c=this._tip.outerWidth(),d=this._tip.outerHeight(),f={x:this._getBackX(a,b),y:a.target.localToGlobal().y,width:c,height:d,lineWidth:1,strokeStyle:"#333333",fillStyle:"#ffffff",radius:[5]};this._back=new e({id:"tipsBack",context:f}),this.sprite.addChild(this._back)},_getBackX:function(a,b){var c=this._tip.outerWidth()+2,d=b.x-c/2,e=a.target.getStage().context.width;return 0>d&&(d=0),d+c>e&&(d=e-c),d}},f},{requires:["canvax/","canvax/shape/Line","canvax/shape/Circle","canvax/shape/Rect","dvix/utils/deep-extend"]});