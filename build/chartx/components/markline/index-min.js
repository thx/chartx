define("chartx/components/markline/index",["canvax/index","canvax/shape/BrokenLine","canvax/display/Sprite","canvax/display/Text"],function(a,b,c,d){var e=function(a,b){this._yAxis=b,this.w=0,this.h=0,this.field=null,this.origin={x:0,y:0},this.target=null,this.value=0,this.line={y:0,list:[],strokeStyle:"#999",lineWidth:1,smooth:!1,lineType:"dashed"},this.text={enabled:!1,content:"",fillStyle:"#999999",fontSize:12,format:null,lineType:"dashed",lineWidth:1,strokeStyle:"white"},this.filter=function(){},this._doneHandle=null,this.done=function(a){this._doneHandle=a},this.txt=null,this._line=null,a&&_.deepExtend(this,a),this.init()};return e.prototype={init:function(){var a=this;this.sprite=new c({context:{x:this.origin.x,y:this.origin.y}}),setTimeout(function(){a.widget()},10)},widget:function(){var a=this,c=new b({id:"line",context:{y:a.line.y,pointList:a.line.list,strokeStyle:a.line.strokeStyle,lineWidth:a.line.lineWidth,lineType:a.line.lineType}});if(a.sprite.addChild(c),a._line=c,a.text.enabled){var e=new d(a.text.content,{context:a.text});this.txt=e,a.sprite.addChild(e),_.isNumber(a.text.x)?(e.context.x=a.text.x,e.context.y=a.text.y):(e.context.x=this.w-e.getTextWidth(),e.context.y=a.line.y-e.getTextHeight())}a._done(),a.filter(a)},_done:function(){_.isFunction(this._doneHandle)&&this._doneHandle.apply(this,[])},reset:function(a,b){a&&_.deepExtend(this,a),this.line.y!=this._line.context.y&&this._line.animate({y:this.line.y},{duration:500,easing:"Back.Out"})}},e});