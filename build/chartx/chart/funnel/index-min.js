define("chartx/chart/funnel/index",["chartx/chart/index","chartx/utils/tools","chartx/utils/datasection","./graphs","chartx/components/tips/tip","chartx/utils/simple-data-format"],function(a,b,c,d,e,f){var g=a.Canvax;return a.extend({dis:{left:2,right:2,top:2,bottom:2,backX:2,backY:2},_graphs:null,_tip:null,init:function(a,b,c){_.deepExtend(this,c),this.dataFrame=this._initData(b,c)},_setStages:function(){this.core=new g.Display.Sprite({id:"core"}),this.stageBg=new g.Display.Sprite({id:"bg"}),this.stageTip=new g.Display.Sprite({id:"tip"}),this.stage.addChild(this.stageBg),this.stage.addChild(this.core),this.stage.addChild(this.stageTip)},draw:function(){this._setStages(),this._initModule(),this._startDraw(),this._drawEnd()},_initData:f,_initModule:function(){this._graphs=new d(this.graphs)},_startDraw:function(a){this._graphs.draw(this._trimGraphs(),{pos:{x:0,y:0}})},_trimGraphs:function(){return[]},_drawEnd:function(){this.core.addChild(this._graphs.sprite)}})});