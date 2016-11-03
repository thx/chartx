define("chartx/chart/original/planet",["chartx/chart/index","canvax/shape/Rect","chartx/utils/tools","chartx/utils/gradient-color","chartx/utils/datasection","chartx/utils/dataformat","chartx/chart/original/planet/graphs","chartx/chart/original/planet/xaxis","chartx/components/tips/tip"],function(a,b,c,d,e,f,g,h,i){var j=a.Canvax;return a.extend({init:function(a,b,c){this.event={This:this,enabled:1,listener:this._listener},this.cx="",this.cy="",this.initCX=60,this.dataFrame={org:[],orgData:[],data:[],back:{rings:0,ringAg:0,rdata:[],data:[]},graphs:{data:[],maxR:0,rdata:[],maxRdata:[],maxYData:[]}},this.graphs={disY:4,minR:1,maxR:100,layout:{mode:0},core:{r:{normal:60},fillStyle:{normal:"#70639c"},text:{content:"品牌",place:"center",fillStyle:{normal:"#ffffff"}}},fillStyle:{dNormals:"#b28fce",normals:"#b28fce",overs:["#ff0000","#ff9900","#ffff00","#009900","#00ff00","#0000ff","#660099"]},text:{fillStyle:{normal:"#ff0000"}}},this.back={ringDis:10,space:"",fillStyle:{first:"#e5dfec",last:"#faf6ff",normals:[]},strokeStyle:{normals:["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"]}},this._bg=null,this._back=null,this._xAxis=null,this._graphs=null,this._tip=null,_.deepExtend(this,c),b=this._trimData(b),this.dataFrame.org=b,_.deepExtend(this.dataFrame,this._initData(b,c)),this.cx=""!=this.cx?this.cx:this.initCX,this.cy=""!=this.cy?this.cy:parseInt(this.height/2),this._countData()},draw:function(){this.stageCore=new j.Display.Sprite({id:"core"}),this.stageBg=new j.Display.Sprite({id:"bg"}),this.stageTip=new j.Display.Sprite({id:"tip"}),this.stage.addChild(this.stageBg),this.stage.addChild(this.stageCore),this.stage.addChild(this.stageTip),this.rotate&&this._rotate(this.rotate),this._initModule(),this._startDraw(),this._drawEnd(),this.inited=!0},_initData:f,_initModule:function(){this._bg=new j.Display.Sprite,this._back=new g(this.back,this),this._xAxis=new h(this.xAxis.bar,this),this._graphs=new g(this.graphs,this),this._tip=new i(this.tips,this.canvax.getDomContainer())},_trimData:function(a){for(var b=this,c=[],d=_.indexOf(a[0],b.xAxis.field),e=0,f=a.length;f>e;e++)if(!isNaN(a[e][d])){var g=parseInt(a[e][d]);c[g]?-1:c[g]=[],c[g].push(a[e])}c=_.flatten(c,!0),c=_.compact(c);for(var g=0,h=0,e=0,f=c.length;f>e;e++){var i=parseInt(c[e][d]);h!=i&&(h=i,g++),c[e][d]=g}return c.unshift(a[0]),c},_countData:function(){for(var a=this,b=a.dataFrame.org,e=[],f=a._getDataFromOrg(a.xAxis.field),g=0,h=b.length;h>g;g++){var i=f[g];i&&(e[i]?-1:e[i]=[],e[i].push(b[g+1]))}a.dataFrame.orgData=e;for(var j=[],k=a.dataFrame.xAxis.org[0],g=0,h=k.length;h>g;g++){j[k[g]]?-1:j[k[g]]=[];var l={x:a.cx,y:a.cy,r:{normal:125*(g+1)},fillStyle:{normal:""},lineWidth:{normal:2},strokeStyle:{normal:a.back.strokeStyle.normals[k[g]-1]}};j[k[g]].length<1&&j[k[g]].push(l)}j[0]||(j.shift(),a.dataFrame.back.rings=j.length),a.dataFrame.back.data=_.flatten(j),a.dataFrame.back.ringAg=a._getBackRingAverage();for(var j=a.dataFrame.back.data,m=[],n=a.dataFrame.back.ringAg,g=0,h=j.length;h>g;g++)m[g]=a.graphs.core.r.normal+n*(g+1);a.dataFrame.back.rdata=m,a.back.fillStyle.normals=new d(a.back.fillStyle.first,a.back.fillStyle.last,a.dataFrame.back.rings+1);for(var o=0,g=0,h=j.length;h>g;g++){var l=j[g];l.r={normal:m[g]},l.fillStyle={normal:a.back.fillStyle.normals[g]},0!=g&&((g-o)*n>a.back.space?o=g:l.enabled=0)}a.dataFrame.graphs.maxR=a._getPlanetMaxR();for(var p=a._getDataFromOrg(a.graphs.size.field),q=c.getArrScalesAtArr(p,c.getMaxAtArr(_.clone(p))),m=[],g=0,h=q.length;h>g;g++){var r=q[g],s=a.graphs.minR+a.dataFrame.graphs.maxR*r;s=Math.round(s),s>a.dataFrame.graphs.maxR&&(s=a.dataFrame.graphs.maxR),m.push(s)}a.dataFrame.graphs.rdata=m;for(var t=[],u=[],g=0,h=k.length;h>g;g++){t[k[g]]?-1:t[k[g]]=[];var s=m[g],v=a._getDataFromOrg(a.graphs.info.field,g)[a.graphs.info.content],l={x:100*g,y:100,r:{normal:s},fillStyle:{normal:a.graphs.fillStyle.normals[k[g]-1]},text:{content:v,fillStyle:{normal:a.graphs.text.fillStyle.normal}}};if(t[k[g]].push(l),u[k[g]]?-1:u[k[g]]=[],u[k[g]].push(s),u[k[g]].length>1){var w=c.getMaxAtArr(u[k[g]]);u[k[g]]=[w]}}if(!t[0]){t[0]=[];var l={x:a.cx,y:a.cy,r:{normal:a.graphs.core.r.normal},fillStyle:{normal:a.graphs.core.fillStyle.normal},text:a.graphs.core.text,event:{enabled:0}};t[0].unshift(l),u.shift()}a.dataFrame.graphs.data=t,a.dataFrame.graphs.maxRdata=_.flatten(u);for(var x=[],m=a.dataFrame.back.rdata,u=a.dataFrame.graphs.maxRdata,g=0,h=m.length;h>g;g++){var s=2*m[g]>a.height?a.height:m[g];s=2*s<a.height?2*s:s;var y=s-2*u[g]-2*a.graphs.disY;x.push(y)}a.dataFrame.graphs.maxYData=x;var z=[];if(0==a.graphs.layout.mode){for(var p=a._getDataFromOrg(a.yAxis.field),A=c.getArrMergerNumber(p)/p.length,B=0,C=[],g=0,h=k.length;h>g;g++){var i=k[g]-1,D=p[g],E=a.cy+(A-D)/A*(x[i]/2);D>2*A&&(B=D-A>B?D-A:B),D>A&&(C[g]=1),z[g]={y:E}}for(var g=0,h=C.length;h>g;g++){var F=C[g],i=k[g]-1,D=p[g];F&&0!=B&&(z[g].y=a.cy-(D-A)/B*(x[i]/2))}for(var G=0,g=1,h=t.length;h>g;g++)for(var F=0,H=t[g].length;H>F;F++){var l=t[g][F],i=g-1,s=a.dataFrame.back.rdata[i],E=z[G].y,I=E-a.cy;l.x=a.cx+a._getDisForRH(s,I),l.y=E,l.ringID=g,l.ID=F+1,l.orgData=a.dataFrame.orgData[g][F],l.fillStyle={normal:a._getGraphsFillStyle(l)},G++}}else for(var w=c.getMaxChildArrLength(a.dataFrame.orgData),J=2*w+5,K=_.range(1,J+1),L=parseInt(J/2)+1,M=[L+parseInt(L/2),L,L-parseInt(L/2)],N=M.length,O=[[0]],g=1,h=t.length;h>g;g++)for(var F=0,H=t[g].length;H>F;F++){var l=t[g][F],i=g-1,P=_.flatten(O[g-1]).concat(_.flatten(O[g])),Q=a._getPlace(P,K,M[(i+1)%N],F%2?!0:!1),r=(Q-1)/(J-1),E=a.cy-x[i]/2+r*x[i],s=a.dataFrame.back.rdata[i],I=E-a.cy;l.x=a.cx+a._getDisForRH(s,I),l.y=E,l.ringID=g,l.ID=F+1,l.orgData=a.dataFrame.orgData[g][F],l.fillStyle={normal:a._getGraphsFillStyle(l)},O[g]?-1:O[g]=[],O[g].push(Q)}},_without:function(a,b){for(var c=_.clone(a),d=0,e=b.length;e>d;d++)c=_.without(c,b[d]);return c},_getPlace:function(a,b,c,d){var e=this,f="";if(-1==_.indexOf(a,c))f=c;else{var b=e._without(b,a);if(d)var g=1;else var g=b.length-1;f=b[g-1]}return f},_startDraw:function(){var a=this,c=new b({context:{width:a.width,height:a.height,fillStyle:a.back.fillStyle.last}});a._bg.addChild(c),a._back.draw({data:a.dataFrame.back.data.reverse(),event:{enabled:0}}),a._xAxis.draw({width:a.width}),a._graphs.draw({data:a.dataFrame.graphs.data,event:{enabled:a.event.enabled}})},_drawEnd:function(){this.stageBg.addChild(this._bg),this.stageBg.addChild(this._back.sprite),this.stageBg.addChild(this._xAxis.sprite),this._xAxis.gradient(),this.stageCore.addChild(this._graphs.sprite),this.stageTip.addChild(this._tip.sprite)},_getDataFromOrg:function(a,b){for(var c=this,d=c.dataFrame.data,e=0,f=d.length;f>e;e++){var g=d[e];if(g.field==a){if(isNaN(b))return g.data;if(g.data[b])return g.data[b]}}},_getPlanetMaxR:function(){var a=this,b=0;return b=parseInt(a.dataFrame.back.ringAg/2),b=a.graphs.maxR<b?a.graphs.maxR:b},_getBackRingAverage:function(){var a=this;return parseInt((a.width-a.initCX-a.graphs.core.r.normal)/(a.dataFrame.back.rings+.5))},_getDisForRH:function(a,b){return Math.sin(Math.acos(b/a))*a},_listener:function(a){var b=this.This;0!=a.ringID&&(a.orgData=b._getOrgData(a.ringID,a.ID)),this.on(a);var c=a.target;c.tipsInfo={ringID:a.ringID,ID:a.ID,orgData:a.orgData},_.isObject(b.tips)&&("mouseover"==a.eventType?b._tip.show(c):"mousemove"==a.eventType?b._tip.move(c):"mouseout"==a.eventType&&b._tip.hide(c))},_getOrgData:function(a,b){var c=this,d=c.dataFrame.orgData;return d[a][b-1]},_getGraphsFillStyle:function(a){var b=this,c="";return _.isArray(b.graphs.fillStyle.normals)&&(c=b.graphs.fillStyle.normals[a.ringID-1]),_.isFunction(b.graphs.fillStyle.normals)&&(c=b.graphs.fillStyle.normals(a)),_.isString(b.graphs.fillStyle.normals)&&(c=b.graphs.fillStyle.normals),c&&""!=c||(c=b.graphs.fillStyle.dNormals[a.ringID-1]),c}})});