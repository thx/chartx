define("chartx/layout/venn/index",[],function(){var a=a||{version:"0.2"};return function(a){"use strict";function b(a,b,c,d){var e,f=0;for(e=0;e<b.length;++e)b[e]=0;for(e=0;e<c.length;++e)for(var g=a[2*e],h=a[2*e+1],i=e+1;i<c.length;++i){var j=a[2*i],k=a[2*i+1],l=c[e][i],m=d[e][i],n=(j-g)*(j-g)+(k-h)*(k-h),o=Math.sqrt(n),p=n-l*l;m>0&&o<=l||m<0&&o>=l||(f+=2*p*p,b[2*e]+=4*p*(g-j),b[2*e+1]+=4*p*(h-k),b[2*i]+=4*p*(j-g),b[2*i+1]+=4*p*(k-h))}return f}function c(a,b){a.sort(function(a,b){return b.radius-a.radius});var c;if(a.length>0){var d=a[0].x,e=a[0].y;for(c=0;c<a.length;++c)a[c].x-=d,a[c].y-=e}if(a.length>1){var f,g,h=Math.atan2(a[1].x,a[1].y)-b,i=Math.cos(h),j=Math.sin(h);for(c=0;c<a.length;++c)f=a[c].x,g=a[c].y,a[c].x=i*f-j*g,a[c].y=j*f+i*g}if(a.length>2){for(var k=Math.atan2(a[2].x,a[2].y)-b;k<0;)k+=2*Math.PI;for(;k>2*Math.PI;)k-=2*Math.PI;if(k>Math.PI){var l=a[1].y/(1e-10+a[1].x);for(c=0;c<a.length;++c){var m=(a[c].x+l*a[c].y)/(1+l*l);a[c].x=2*m-a[c].x,a[c].y=2*m*l-a[c].y}}}}function d(a){var b=function(b){var c=Math.max.apply(null,a.map(function(a){return a[b]+a.radius})),d=Math.min.apply(null,a.map(function(a){return a[b]-a.radius}));return{max:c,min:d}};return{xRange:b("x"),yRange:b("y")}}a.venn=function(b,c){c=c||{},c.maxIterations=c.maxIterations||500;var d,e=c.lossFunction||a.lossFunction,f=c.initialLayout||a.bestInitialLayout,g=c.fmin||a.fmin,h=f(b),i=[],j=[];for(d in h)h.hasOwnProperty(d)&&(i.push(h[d].x),i.push(h[d].y),j.push(d));for(var k=0,l=g(function(a){k+=1;for(var c={},d=0;d<j.length;++d){var f=j[d];c[f]={x:a[2*d],y:a[2*d+1],radius:h[f].radius}}return e(c,b)},i,c),m=l.solution,n=0;n<j.length;++n)d=j[n],h[d].x=m[2*n],h[d].y=m[2*n+1];return h};var e=1e-10;a.distanceFromIntersectArea=function(b,c,d){return Math.min(b,c)*Math.min(b,c)*Math.PI<=d+e?Math.abs(b-c):a.bisect(function(e){return a.circleOverlap(b,c,e)-d},0,b+c)},a.getDistanceMatrices=function(b,c,d){var e=a.zerosM(c.length,c.length),f=a.zerosM(c.length,c.length);return b.filter(function(a){return 2==a.sets.length}).map(function(b){var g=d[b.sets[0]],h=d[b.sets[1]],i=Math.sqrt(c[g].size/Math.PI),j=Math.sqrt(c[h].size/Math.PI),k=a.distanceFromIntersectArea(i,j,b.size);e[g][h]=e[h][g]=k;var l=0;b.size+1e-10>=Math.min(c[g].size,c[h].size)?l=1:b.size<=1e-10&&(l=-1),f[g][h]=f[h][g]=l}),{distances:e,constraints:f}},a.bestInitialLayout=function(b,c){var d=a.greedyLayout(b,c);if(b.length>=8){var e=a.constrainedMDSLayout(b,c),f=a.lossFunction(e,b),g=a.lossFunction(d,b);f+1e-8<g&&(d=e)}return d},a.constrainedMDSLayout=function(c,d){d=d||{};var e,f=d.restarts||10,g=[],h={};for(e=0;e<c.length;++e){var i=c[e];1==i.sets.length&&(h[i.sets[0]]=g.length,g.push(i))}var j=a.getDistanceMatrices(c,g,h),k=j.distances,l=j.constraints,m=a.norm2(k.map(a.norm2))/k.length;k=k.map(function(a){return a.map(function(a){return a/m})});var n,o,p=function(a,c){return b(a,c,k,l)};for(e=0;e<f;++e){var q=a.zeros(2*k.length).map(Math.random);o=a.minimizeConjugateGradient(p,q,d),(!n||o.fx<n.fx)&&(n=o)}var r=n.x,s={};for(e=0;e<g.length;++e){var t=g[e];s[t.sets[0]]={x:r[2*e]*m,y:r[2*e+1]*m,radius:Math.sqrt(t.size/Math.PI)}}if(d.history)for(e=0;e<d.history.length;++e)a.multiplyBy(d.history[e].x,m);return s},a.greedyLayout=function(b){function c(a,b){return b.size-a.size}function d(a){return a.set in r}function f(a,b){h[b].x=a.x,h[b].y=a.y,r[b]=!0}for(var g,h={},i={},j=0;j<b.length;++j){var k=b[j];1==k.sets.length&&(g=k.sets[0],h[g]={x:1e10,y:1e10,rowid:h.length,size:k.size,radius:Math.sqrt(k.size/Math.PI)},i[g]=[])}for(b=b.filter(function(a){return 2==a.sets.length}),j=0;j<b.length;++j){var l=b[j],m=l.hasOwnProperty("weight")?l.weight:1,n=l.sets[0],o=l.sets[1];l.size+e>=Math.min(h[n].size,h[o].size)&&(m=0),i[n].push({set:o,size:l.size,weight:m}),i[o].push({set:n,size:l.size,weight:m})}var p=[];for(g in i)if(i.hasOwnProperty(g)){var q=0;for(j=0;j<i[g].length;++j)q+=i[g][j].size*i[g][j].weight;p.push({set:g,size:q})}p.sort(c);var r={};for(f({x:0,y:0},p[0].set),j=1;j<p.length;++j){var s=p[j].set,t=i[s].filter(d);if(g=h[s],t.sort(c),0===t.length)throw"Need overlap information for set "+JSON.stringify(g);for(var u=[],v=0;v<t.length;++v){var w=h[t[v].set],x=a.distanceFromIntersectArea(g.radius,w.radius,t[v].size);u.push({x:w.x+x,y:w.y}),u.push({x:w.x-x,y:w.y}),u.push({y:w.y+x,x:w.x}),u.push({y:w.y-x,x:w.x});for(var y=v+1;y<t.length;++y)for(var z=h[t[y].set],A=a.distanceFromIntersectArea(g.radius,z.radius,t[y].size),B=a.circleCircleIntersection({x:w.x,y:w.y,radius:x},{x:z.x,y:z.y,radius:A}),C=0;C<B.length;++C)u.push(B[C])}var D=1e50,E=u[0];for(v=0;v<u.length;++v){h[s].x=u[v].x,h[s].y=u[v].y;var F=a.lossFunction(h,b);F<D&&(D=F,E=u[v])}f(E,s)}return h},a.classicMDSLayout=function(b){for(var c=[],d={},e=0;e<b.length;++e){var f=b[e];1==f.sets.length&&(d[f.sets[0]]=c.length,c.push(f))}var g=a.getDistanceMatrices(b,c,d).distances,h=mds.classic(g),i={};for(e=0;e<c.length;++e){var j=c[e];i[j.sets[0]]={x:h[e][0],y:h[e][1],radius:Math.sqrt(j.size/Math.PI)}}return i},a.lossFunction=function(b,c){function d(a){return a.map(function(a){return b[a]})}for(var e=0,f=0;f<c.length;++f){var g,h=c[f];if(1!=h.sets.length){if(2==h.sets.length){var i=b[h.sets[0]],j=b[h.sets[1]];g=a.circleOverlap(i.radius,j.radius,a.distance(i,j))}else g=a.intersectionArea(d(h.sets));var k=h.hasOwnProperty("weight")?h.weight:1;e+=k*(g-h.size)*(g-h.size)}}return e},a.disjointCluster=function(b){function c(a){return a.parent!==a&&(a.parent=c(a.parent)),a.parent}function d(a,b){var d=c(a),e=c(b);d.parent=e}b.map(function(a){a.parent=a});for(var e=0;e<b.length;++e)for(var f=e+1;f<b.length;++f){var g=b[e].radius+b[f].radius;a.distance(b[e],b[f])+1e-10<g&&d(b[f],b[e])}var h,i={};for(e=0;e<b.length;++e)h=c(b[e]).parent.setid,h in i||(i[h]=[]),i[h].push(b[e]);b.map(function(a){delete a.parent});var j=[];for(h in i)i.hasOwnProperty(h)&&j.push(i[h]);return j},a.normalizeSolution=function(b,e){function f(a,b,c){if(a){var d,e,f,g=a.bounds;b?d=m.xRange.max-g.xRange.min+n:(d=m.xRange.max-g.xRange.max-n,f=(g.xRange.max-g.xRange.min)/2-(m.xRange.max-m.xRange.min)/2,f<0&&(d+=f)),c?e=m.yRange.max-g.yRange.min+n:(e=m.yRange.max-g.yRange.max-n,f=(g.yRange.max-g.yRange.min)/2-(m.yRange.max-m.yRange.min)/2,f<0&&(e+=f));for(var h=0;h<a.length;++h)a[h].x+=d,a[h].y+=e,i.push(a[h])}}e=e||Math.PI/2;var g,h,i=[];for(h in b)if(b.hasOwnProperty(h)){var j=b[h];i.push({x:j.x,y:j.y,radius:j.radius,setid:h})}var k=a.disjointCluster(i);for(g=0;g<k.length;++g){c(k[g],e);var l=d(k[g]);k[g].size=(l.xRange.max-l.xRange.min)*(l.yRange.max-l.yRange.min),k[g].bounds=l}k.sort(function(a,b){return b.size-a.size}),i=k[0];for(var m=i.bounds,n=(m.xRange.max-m.xRange.min)/50,o=1;o<k.length;)f(k[o],!0,!1),f(k[o+1],!1,!0),f(k[o+2],!0,!0),o+=3,m=d(i);var p={};for(g=0;g<i.length;++g)p[i[g].setid]=i[g];return p},a.scaleSolution=function(a,b,c,e){var f=[],g=[];for(var h in a)a.hasOwnProperty(h)&&(g.push(h),f.push(a[h]));b-=2*e,c-=2*e;for(var i=d(f),j=i.xRange,k=i.yRange,l=b/(j.max-j.min),m=c/(k.max-k.min),n=Math.min(m,l),o=(b-(j.max-j.min)*n)/2,p=(c-(k.max-k.min)*n)/2,q={},r=0;r<f.length;++r){var s=f[r];q[g[r]]={radius:n*s.radius,x:e+o+(s.x-j.min)*n,y:e+p+(s.y-k.min)*n}}return q}}(a),function(a){"use strict";function b(a){for(var b=new Array(a),c=0;c<a;++c)b[c]=0;return b}function c(a,c){return b(a).map(function(){return b(c)})}function d(a,b){for(var c=0,d=0;d<a.length;++d)c+=a[d]*b[d];return c}function e(a){return Math.sqrt(d(a,a))}function f(a,b){for(var c=0;c<a.length;++c)a[c]*=b}function g(a,b,c,d,e){for(var f=0;f<a.length;++f)a[f]=b*c[f]+d*e[f]}a.bisect=function(a,b,c,d){d=d||{};var e=d.maxIterations||100,f=d.tolerance||1e-10,g=a(b),h=a(c),i=c-b;if(g*h>0)throw"Initial bisect points must have opposite signs";if(0===g)return b;if(0===h)return c;for(var j=0;j<e;++j){i/=2;var k=b+i,l=a(k);if(l*g>=0&&(b=k),Math.abs(i)<f||0===l)return k}return b+i},a.zerosM=c,a.zeros=b,a.norm2=e,a.multiplyBy=f,a.fmin=function(a,b,c){c=c||{};var d,e=c.maxIterations||200*b.length,f=c.nonZeroDelta||1.1,h=c.zeroDelta||.001,i=c.minErrorDelta||1e-6,j=c.rho||1,k=c.chi||2,l=c.psi||-.5,m=c.sigma||.5,n=c.callback,o=b.length,p=new Array(o+1);p[0]=b,p[0].fx=a(b);for(var q=0;q<o;++q){var r=b.slice();r[q]=r[q]?r[q]*f:h,p[q+1]=r,p[q+1].fx=a(r)}for(var s=function(a,b){return a.fx-b.fx},t=b.slice(),u=b.slice(),v=b.slice(),w=b.slice(),x=0;x<e&&(p.sort(s),n&&n(p),!(Math.abs(p[0].fx-p[o].fx)<i));++x){for(q=0;q<o;++q){t[q]=0;for(var y=0;y<o;++y)t[q]+=p[y][q];t[q]/=o}var z=p[o];if(g(u,1+j,t,-j,z),u.fx=a(u),u.fx<=p[0].fx)g(w,1+k,t,-k,z),w.fx=a(w),w.fx<u.fx?(d=p[o],p[o]=w,w=d):(d=p[o],p[o]=u,u=d);else if(u.fx>=p[o-1].fx){var A=!1;if(u.fx<=z.fx?(g(v,1+l,t,-l,z),v.fx=a(v),v.fx<z.fx?(d=p[o],p[o]=v,v=d):A=!0):(g(v,1-l*j,t,l*j,z),v.fx=a(v),v.fx<=u.fx?(d=p[o],p[o]=v,v=d):A=!0),A)for(q=1;q<p.length;++q)g(p[q],1-m,p[0],m-1,p[q]),p[q].fx=a(p[q])}else d=p[o],p[o]=u,u=d}return p.sort(s),{f:p[0].fx,solution:p[0]}},a.minimizeConjugateGradient=function(b,c,h){var i,j,k,l={x:c.slice(),fx:0,fxprime:c.slice()},m={x:c.slice(),fx:0,fxprime:c.slice()},n=c.slice(),o=1;h=h||{},k=h.maxIterations||5*c.length,l.fx=b(l.x,l.fxprime),i=l.fxprime.slice(),f(i,-1);for(var p=0;p<k;++p){if(h.history&&h.history.push({x:l.x.slice(),fx:l.fx,fxprime:l.fxprime.slice()}),o=a.wolfeLineSearch(b,i,l,m,o)){g(n,1,m.fxprime,-1,l.fxprime);var q=d(l.fxprime,l.fxprime),r=Math.max(0,d(n,m.fxprime)/q);g(i,r,i,-1,m.fxprime),j=l,l=m,m=j}else for(var s=0;s<i.length;++s)i[s]=-1*l.fxprime[s];if(e(l.fxprime)<=1e-5)break}return h.history&&h.history.push({x:l.x.slice(),fx:l.fx,fxprime:l.fxprime.slice()}),l};var h=1e-6,i=.1;a.wolfeLineSearch=function(a,b,c,e,f){function j(j,n,p){for(var q=0;q<16;++q)if(f=(j+n)/2,g(e.x,1,c.x,f,b),m=e.fx=a(e.x,e.fxprime),o=d(e.fxprime,b),m>k+h*f*l||m>=p)n=f;else{if(Math.abs(o)<=-i*l)return f;o*(n-j)>=0&&(n=j),j=f,p=m}return 0}var k=c.fx,l=d(c.fxprime,b),m=k,n=k,o=l,p=0;f=f||1;for(var q=0;q<10;++q){if(g(e.x,1,c.x,f,b),m=e.fx=a(e.x,e.fxprime),o=d(e.fxprime,b),m>k+h*f*l||q&&m>=n)return j(p,f,n);if(Math.abs(o)<=-i*l)return f;if(o>=0)return j(f,p,m);n=m,p=f,f*=2}return 0}}(a),function(a){"use strict";function b(b){for(var c=[],d=0;d<b.length;++d)for(var e=d+1;e<b.length;++e)for(var f=a.circleCircleIntersection(b[d],b[e]),g=0;g<f.length;++g){var h=f[g];h.parentIndex=[d,e],c.push(h)}return c}var c=1e-10;a.intersectionArea=function(d,e){var f,g=b(d),h=g.filter(function(b){return a.containedInCircles(b,d)}),i=0,j=0,k=[];if(h.length>1){var l=a.getCenter(h);for(f=0;f<h.length;++f){var m=h[f];m.angle=Math.atan2(m.x-l.x,m.y-l.y)}h.sort(function(a,b){return b.angle-a.angle});var n=h[h.length-1];for(f=0;f<h.length;++f){var o=h[f];j+=(n.x+o.x)*(o.y-n.y);for(var p={x:(o.x+n.x)/2,y:(o.y+n.y)/2},q=null,r=0;r<o.parentIndex.length;++r)if(n.parentIndex.indexOf(o.parentIndex[r])>-1){var s=d[o.parentIndex[r]],t=Math.atan2(o.x-s.x,o.y-s.y),u=Math.atan2(n.x-s.x,n.y-s.y),v=u-t;v<0&&(v+=2*Math.PI);var w=u-v/2,x=a.distance(p,{x:s.x+s.radius*Math.sin(w),y:s.y+s.radius*Math.cos(w)});(null===q||q.width>x)&&(q={circle:s,width:x,p1:o,p2:n})}k.push(q),i+=a.circleArea(q.circle.radius,q.width),n=o}}else{var y=d[0];for(f=1;f<d.length;++f)d[f].radius<y.radius&&(y=d[f]);var z=!1;for(f=0;f<d.length;++f)if(a.distance(d[f],y)>Math.abs(y.radius-d[f].radius)){z=!0;break}z?i=j=0:(i=y.radius*y.radius*Math.PI,k.push({circle:y,p1:{x:y.x,y:y.y+y.radius},p2:{x:y.x-c,y:y.y+y.radius},width:2*y.radius}))}return j/=2,e&&(e.area=i+j,e.arcArea=i,e.polygonArea=j,e.arcs=k,e.innerPoints=h,e.intersectionPoints=g),i+j},a.containedInCircles=function(b,d){for(var e=0;e<d.length;++e)if(a.distance(b,d[e])>d[e].radius+c)return!1;return!0},a.circleIntegral=function(a,b){var c=Math.sqrt(a*a-b*b);return b*c+a*a*Math.atan2(b,c)},a.circleArea=function(b,c){return a.circleIntegral(b,c-b)-a.circleIntegral(b,-b)},a.distance=function(a,b){return Math.sqrt((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y))},a.circleOverlap=function(b,c,d){if(d>=b+c)return 0;if(d<=Math.abs(b-c))return Math.PI*Math.min(b,c)*Math.min(b,c);var e=b-(d*d-c*c+b*b)/(2*d),f=c-(d*d-b*b+c*c)/(2*d);return a.circleArea(b,e)+a.circleArea(c,f)},a.circleCircleIntersection=function(b,c){var d=a.distance(b,c),e=b.radius,f=c.radius;if(d>=e+f||d<=Math.abs(e-f))return[];var g=(e*e-f*f+d*d)/(2*d),h=Math.sqrt(e*e-g*g),i=b.x+g*(c.x-b.x)/d,j=b.y+g*(c.y-b.y)/d,k=-(c.y-b.y)*(h/d),l=-(c.x-b.x)*(h/d);return[{x:i+k,y:j-l},{x:i-k,y:j+l}]},a.getCenter=function(a){for(var b={x:0,y:0},c=0;c<a.length;++c)b.x+=a[c].x,b.y+=a[c].y;return b.x/=a.length,b.y/=a.length,b}}(a),a});