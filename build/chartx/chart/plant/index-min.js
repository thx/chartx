define("chartx/chart/plant/index",["chartx/chart/index","chartx/utils/simple-data-format","chartx/chart/plant/graphs","chartx/components/polar/polar","chartx/components/tips/tip"],function(a,b,c,d,e){a.Canvax;return a.extend({init:function(a,b,c){this._node=a,this._data=b,this._opts=c,this._graphs=null,this._coordinate=null,this.dataFrame=this.initData(b),_.deepExtend(this,this._opts),this.padding.top=30,this.padding.bottom=30},draw:function(){this._initModule(),this._layout(),this._startDraw(),this._drawEnd(),this._bindEvent(),this.inited=!0},_initModule:function(){var a=this.width-this.padding.left-this.padding.right,b=this.height-this.padding.top-this.padding.bottom;this._coordinate=new d(_.deepExtend({w:a,h:b},this._opts.coordinate)),this._graphs=new c({coordinate:this._coordinate,options:this._opts.graphs,dataFrame:this.dataFrame}),this._tip=new e(this.tips,this.canvax.getDomContainer()),this._tip._getDefaultContent=this._getTipDefaultContent},_getTipDefaultContent:function(a){return"<span style='color:"+a.node.fillStyle+"'>"+a.node.data.name+"</span>"},_startDraw:function(){this._graphs.draw()},_layout:function(){var a=this._graphs.sprite.context;a.x=this.padding.left,a.y=this.padding.top},_drawEnd:function(){this.stage.addChild(this._graphs.sprite),this.stage.addChild(this._tip.sprite)},initData:b,_bindEvent:function(){var a=this;this._graphs.sprite.on("panstart mouseover",function(b){b.eventInfo&&a._tip.show(b)}),this._graphs.sprite.on("panmove mousemove",function(b){b.eventInfo&&a._tip.move(b)}),this._graphs.sprite.on("panend mouseout",function(b){a._tip.hide(b)}),this._graphs.sprite.on("tap click",function(b){a.fire("tap click",b)}),this._graphs.sprite.on("doubletap dblclick",function(b){a.fire("doubletap dblclick",b)})}})});