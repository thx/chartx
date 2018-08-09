define("canvax/animation/Tween",[],function(){var a=a||function(){var b=[];return{getAll:function(){return b},removeAll:function(){b=[]},add:function(a){b.push(a)},remove:function(a){var c=_.indexOf(b,a);-1!==c&&b.splice(c,1)},update:function(c,d){if(0===b.length)return!1;var e=0;for(c=void 0!==c?c:a.now();e<b.length;){var f=b[e],g=f.update(c);if(!b[e])break;f===b[e]&&(g||d?e++:b.splice(e,1))}return!0}}}();return"undefined"==typeof window&&"undefined"!=typeof process?a.now=function(){var a=process.hrtime();return 1e3*a[0]+a[1]/1e6}:"undefined"!=typeof window&&void 0!==window.performance&&void 0!==window.performance.now?a.now=window.performance.now.bind(window.performance):void 0!==Date.now?a.now=Date.now:a.now=function(){return(new Date).getTime()},a.Tween=function(b){var c,d=b,e={},f={},g={},h=1e3,i=0,j=!1,k=!1,l=!1,m=0,n=null,o=a.Easing.Linear.None,p=a.Interpolation.Linear,q=[],r=null,s=!1,t=null,u=null,v=null;this.to=function(a,b){return f=a,void 0!==b&&(h=b),this},this.start=function(b){a.add(this),k=!0,s=!1,n=void 0!==b?b:a.now(),n+=m;for(var c in f){if(f[c]instanceof Array){if(0===f[c].length)continue;f[c]=[d[c]].concat(f[c])}void 0!==d[c]&&(e[c]=d[c],e[c]instanceof Array==!1&&(e[c]*=1),g[c]=e[c]||0)}return this},this.stop=function(){return k?(a.remove(this),k=!1,null!==v&&v.call(d,d),this.stopChainedTweens(),this):this},this.end=function(){return this.update(n+h),this},this.stopChainedTweens=function(){for(var a=0,b=q.length;b>a;a++)q[a].stop()},this.delay=function(a){return m=a,this},this.repeat=function(a){return i=a,this},this.repeatDelay=function(a){return c=a,this},this.yoyo=function(a){return j=a,this},this.easing=function(a){return o=a,this},this.interpolation=function(a){return p=a,this},this.chain=function(){return q=arguments,this},this.onStart=function(a){return r=a,this},this.onUpdate=function(a){return t=a,this},this.onComplete=function(a){return u=a,this},this.onStop=function(a){return v=a,this},this.update=function(a){var b,k,v;if(n>a)return!0;s===!1&&(null!==r&&r.call(d,d),s=!0),k=(a-n)/h,k=k>1?1:k,v=o(k);for(b in f)if(void 0!==e[b]){var w=e[b]||0,x=f[b];x instanceof Array?d[b]=p(x,v):("string"==typeof x&&(x="+"===x.charAt(0)||"-"===x.charAt(0)?w+parseFloat(x):parseFloat(x)),"number"==typeof x&&(d[b]=w+(x-w)*v))}if(null!==t&&t.call(d,v),1===k){if(i>0){isFinite(i)&&i--;for(b in g){if("string"==typeof f[b]&&(g[b]=g[b]+parseFloat(f[b])),j){var y=g[b];g[b]=f[b],f[b]=y}e[b]=g[b]}return j&&(l=!l),n=void 0!==c?a+c:a+m,!0}null!==u&&u.call(d,d);for(var z=0,A=q.length;A>z;z++)q[z].start(n+h);return!1}return!0}},a.Easing={Linear:{None:function(a){return a}},Quadratic:{In:function(a){return a*a},Out:function(a){return a*(2-a)},InOut:function(a){return(a*=2)<1?.5*a*a:-.5*(--a*(a-2)-1)}},Cubic:{In:function(a){return a*a*a},Out:function(a){return--a*a*a+1},InOut:function(a){return(a*=2)<1?.5*a*a*a:.5*((a-=2)*a*a+2)}},Quartic:{In:function(a){return a*a*a*a},Out:function(a){return 1- --a*a*a*a},InOut:function(a){return(a*=2)<1?.5*a*a*a*a:-.5*((a-=2)*a*a*a-2)}},Quintic:{In:function(a){return a*a*a*a*a},Out:function(a){return--a*a*a*a*a+1},InOut:function(a){return(a*=2)<1?.5*a*a*a*a*a:.5*((a-=2)*a*a*a*a+2)}},Sinusoidal:{In:function(a){return 1-Math.cos(a*Math.PI/2)},Out:function(a){return Math.sin(a*Math.PI/2)},InOut:function(a){return.5*(1-Math.cos(Math.PI*a))}},Exponential:{In:function(a){return 0===a?0:Math.pow(1024,a-1)},Out:function(a){return 1===a?1:1-Math.pow(2,-10*a)},InOut:function(a){return 0===a?0:1===a?1:(a*=2)<1?.5*Math.pow(1024,a-1):.5*(-Math.pow(2,-10*(a-1))+2)}},Circular:{In:function(a){return 1-Math.sqrt(1-a*a)},Out:function(a){return Math.sqrt(1- --a*a)},InOut:function(a){return(a*=2)<1?-.5*(Math.sqrt(1-a*a)-1):.5*(Math.sqrt(1-(a-=2)*a)+1)}},Elastic:{In:function(a){return 0===a?0:1===a?1:-Math.pow(2,10*(a-1))*Math.sin(5*(a-1.1)*Math.PI)},Out:function(a){return 0===a?0:1===a?1:Math.pow(2,-10*a)*Math.sin(5*(a-.1)*Math.PI)+1},InOut:function(a){return 0===a?0:1===a?1:(a*=2,1>a?-.5*Math.pow(2,10*(a-1))*Math.sin(5*(a-1.1)*Math.PI):.5*Math.pow(2,-10*(a-1))*Math.sin(5*(a-1.1)*Math.PI)+1)}},Back:{In:function(a){var b=1.70158;return a*a*((b+1)*a-b)},Out:function(a){var b=1.70158;return--a*a*((b+1)*a+b)+1},InOut:function(a){var b=2.5949095;return(a*=2)<1?.5*a*a*((b+1)*a-b):.5*((a-=2)*a*((b+1)*a+b)+2)}},Bounce:{In:function(b){return 1-a.Easing.Bounce.Out(1-b)},Out:function(a){return 1/2.75>a?7.5625*a*a:2/2.75>a?7.5625*(a-=1.5/2.75)*a+.75:2.5/2.75>a?7.5625*(a-=2.25/2.75)*a+.9375:7.5625*(a-=2.625/2.75)*a+.984375},InOut:function(b){return.5>b?.5*a.Easing.Bounce.In(2*b):.5*a.Easing.Bounce.Out(2*b-1)+.5}}},a.Interpolation={Linear:function(b,c){var d=b.length-1,e=d*c,f=Math.floor(e),g=a.Interpolation.Utils.Linear;return 0>c?g(b[0],b[1],e):c>1?g(b[d],b[d-1],d-e):g(b[f],b[f+1>d?d:f+1],e-f)},Bezier:function(b,c){for(var d=0,e=b.length-1,f=Math.pow,g=a.Interpolation.Utils.Bernstein,h=0;e>=h;h++)d+=f(1-c,e-h)*f(c,h)*b[h]*g(e,h);return d},CatmullRom:function(b,c){var d=b.length-1,e=d*c,f=Math.floor(e),g=a.Interpolation.Utils.CatmullRom;return b[0]===b[d]?(0>c&&(f=Math.floor(e=d*(1+c))),g(b[(f-1+d)%d],b[f],b[(f+1)%d],b[(f+2)%d],e-f)):0>c?b[0]-(g(b[0],b[0],b[1],b[1],-e)-b[0]):c>1?b[d]-(g(b[d],b[d],b[d-1],b[d-1],e-d)-b[d]):g(b[f?f-1:0],b[f],b[f+1>d?d:f+1],b[f+2>d?d:f+2],e-f)},Utils:{Linear:function(a,b,c){return(b-a)*c+a},Bernstein:function(b,c){var d=a.Interpolation.Utils.Factorial;return d(b)/d(c)/d(b-c)},Factorial:function(){var a=[1];return function(b){var c=1;if(a[b])return a[b];for(var d=b;d>1;d--)c*=d;return a[b]=c,c}}(),CatmullRom:function(a,b,c,d,e){var f=.5*(c-a),g=.5*(d-b),h=e*e,i=e*h;return(2*b-2*c+f+g)*i+(-3*b+3*c-2*f-g)*h+f*e+b}}},a});