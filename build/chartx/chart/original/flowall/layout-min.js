define("chartx/chart/original/flowall/layout",[],function(){function a(a,b,c){b.pos={x:(c.w/3-b.w)/2,y:c.node.marginTop};var d=c.node.marginTop;_.each(a.nodes,function(a,e){a!==b&&(a.pos={x:(c.w/3-b.w)/2+2*c.w/3,y:d},d+=c.node.marginTop+a.h)});var e=0;_.each(a.edges,function(a,b){var c=a.from.pos.y+e,d=a.from.pos.x+a.from.w-2,f="M"+d+","+c,g={x:(a.to.pos.x-d)/2+d,y:c};f+="C"+g.x+","+g.y+","+g.x+","+a.to.pos.y+","+(a.to.pos.x+1)+","+a.to.pos.y,f+="v"+a.to.flowinH,f+="C"+g.x+","+(a.to.pos.y+a.to.flowinH)+","+g.x+","+(c+a.to.flowinH)+","+d+","+(c+a.to.flowinH),a.path=f,e+=a.to.flowinH})}function b(a,b){return _.isFunction(a)?a(b):void 0}return function(c,d){var e={w:0,h:0,node:{w:0,maxW:150,h:0,maxH:0,minH:20,marginTop:20,fillStyle:"#60ADE4"},edge:{}};_.deepExtend(e,d),e.node.w||(e.node.w=Math.min(e.w/3,e.node.maxW));var f=0,g=0;if(c.maxLinks>1){g=c.maxLinks,e.node.maxH||(e.node.maxH=e.h/g-e.node.marginTop);var h;_.each(c.nodes,function(a,c){a.w=e.node.w,a.link?h=a:f=Math.max(f,a.value),a.fillStyle=b(e.node.fillStyle,a)}),_.each(c.nodes,function(a,b){a.link||(a.h=e.node.h||a.value/f*e.node.maxH,a.h=Math.max(e.node.minH,a.h),a.flowinH=a.flowin/a.value*a.h,h.h?h.h+=a.flowinH:h.h=a.flowinH)}),a(c,h,e)}else _.each(c.nodes,function(a,b){a.link&&(g++,f=Math.max(f,a.value))}),e.node.maxH||(e.node.maxH=e.h/g-e.node.marginTop);return c}});