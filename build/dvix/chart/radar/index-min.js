define("dvix/chart/radar/index",["dvix/chart/index","dvix/utils/tools","./xaxis","dvix/components/yaxis/yAxis","./back","./graphs","canvax/geom/HitTestPoint","dvix/utils/deep-extend"],function(a,b,c,d,e,f,g){var h=a.Canvax;return a.extend({init:function(){this.r=0,this._xAxis=null,this._yAxis=null,this._back=null,this._graphs=null,this.stageBg=new h.Display.Sprite({id:"bg"}),this.stageCore=new h.Display.Sprite({id:"graph"}),this.stage.addChild(this.stageBg),this.stage.addChild(this.stageCore)},_getR:function(){var a=Math.min(this.width,this.height);this.r||(this.r=a/2),this.r>a/2&&(this.r=a/2),this.r-=50},draw:function(){this._getR(),this._initModule(this,this.dataFrame),this._startDraw(),this._drawEnd();var a=this;this.stage.on("mousemove",function(b){var c=a._getPointBack(b),d=180*Math.atan2(c.y,c.x)/Math.PI,e=360/a._xAxis.dataSection.length;d=(360+d+90+e/2)%360;var f=parseInt(d/e);a._graphs.angHover(f)}),this.stage.on("mouseout",function(b){var c=a._back.sprite.getChildById("isogon_"+(a._yAxis.dataSection.length-1)),d=a._getPointBack(b);g.isInside(c,d)||a._graphs.angOut()})},_getPointBack:function(a){var b=this._back.sprite.globalToLocal(a.target.localToGlobal(a.point,this.sprite));return b.x-=this.r,b.y-=this.r,b},_initModule:function(a,b){this._xAxis=new c(a.xAxis,b.xAxis),this._yAxis=new d(a.yAxis,b.yAxis),this._back=new e(a.back),this._graphs=new f(a.graphs)},_startDraw:function(){var a=this.r,b={r:a,yDataSection:this._yAxis.dataSection,xDataSection:this._xAxis.dataSection};this._back.draw(b);var c=this._back.sprite.context,d=(this.width-c.width)/2,e=(this.height-c.height)/2;this._back.setPosition(d,e),this._graphs.draw(this._yAxis.dataOrg,b),this._graphs.setPosition(d,e),this._xAxis.draw({r:a}),this._xAxis.setPosition(d,e)},_drawEnd:function(){this.stageBg.addChild(this._back.sprite),this.stageCore.addChild(this._graphs.sprite),this.stageCore.addChild(this._xAxis.sprite)}})});