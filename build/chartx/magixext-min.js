define("chartx/magixext",[window.KISSY?"magix/view":"magix",window.KISSY?"node":null],function(a){a=a.View||a,a.prototype.createChart=function(a){var b,c,d,e,f=window._||KISSY,g=arguments;g.length>1&&!f.isObject(g[0])?(b=g[0],c=g[1],d=g[2],e=g[3]):(b=a.type,c=a.el,d=a.data,e=a.opts);var h=this,i={then:function(a){return this.chart?(f.isFunction(a)&&a(this.chart),this):(this._promiseHand.push(a),this)},chart:null,_promiseHand:[]},j=window.KISSY?KISSY.all:$;if(c=c.replace(/(^\s*)|(\s*$)/g,""),"#"!=c.slice(0,1)&&"."!=c.slice(0,1)&&(c="#"+c),j=j("#"+this.id+" "+c),0!=j.length){j[0].getAttribute("id")||j[0].setAttribute("id","chart_"+((new Date).getTime()+"_"+Math.floor(100*Math.random())+"_"+Math.floor(100*Math.random())));var k=j[0].getAttribute("id");return h.manage("chart_"+k,Chartx.create[b](k,d,e).then(function(a){i.chart=a,f.each(i._promiseHand,function(b){f.isFunction(b)&&b(a)}),i._promiseHand=[]})),i}}});