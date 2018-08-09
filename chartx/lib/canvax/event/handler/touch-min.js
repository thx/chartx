define("canvax/event/handler/touch",["canvax/core/Base","canvax/library/hammer"],function(a,b){var c=["pan","panstart","panmove","panend","pancancel","panleft","panright","panup","pandown","press","pressup","swipe","swipeleft","swiperight","swipeup","swipedown","tap"],d=function(){};return d.prototype={init:function(){var a=this,d=a.canvax,e=d.el;a._hammer=new b(e),_.each(c,function(b){a._hammer.on(b,function(b){d.updateRootOffset(),a.__touchHandler(b)})})},__touchHandler:function(a){var b=this,c=b.canvax;this.preventDefault?this._hammer.options.prevent_default=!0:this._hammer.options.prevent_default=!1,b.curPoints=b.__getCanvaxPointInTouchs(a),"panstart"==a.type&&_.each(b.curPointsTarget,function(a,c){if(a&&a.dragEnabled)return b._draging=!0,b._clone2hoverStage(a,c),a.context.globalAlpha=0,!1}),"panmove"==a.type&&b._draging&&_.each(b.curPointsTarget,function(c,d){c&&c.dragEnabled&&b._dragHander(a,c,d)}),"panend"==a.type&&b._draging&&(_.each(b.curPointsTarget,function(c,d){c&&c.dragEnabled&&b._dragEnd(a,c,0)}),b._draging=!1);var d=b.__getChildInTouchs(b.curPoints);b.__dispatchEventInChilds(a,d)?b.curPointsTarget=d:b.__dispatchEventInChilds(a,[c])},__getCanvaxPointInTouchs:function(a){var b=this,c=b.canvax,d=[];return _.each(a.pointers,function(a){a.x=a.pageX-c.rootOffset.left,a.y=a.pageY-c.rootOffset.top,d.push(a)}),d},__getChildInTouchs:function(a){var b=this,c=b.canvax,d=[];return _.each(a,function(a){d.push(c.getObjectsUnderPoint(a,1)[0])}),d}},d});