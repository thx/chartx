define("chartx/utils/gradient-color",[],function(){function a(a,b,c){startRGB=this.colorRgb(a),startR=startRGB[0],startG=startRGB[1],startB=startRGB[2],endRGB=this.colorRgb(b),endR=endRGB[0],endG=endRGB[1],endB=endRGB[2],sR=(endR-startR)/c,sG=(endG-startG)/c,sB=(endB-startB)/c;for(var d=[],e=0;e<c;e++){var f=this.colorHex("rgb("+parseInt(sR*e+startR)+","+parseInt(sG*e+startG)+","+parseInt(sB*e+startB)+")");d.push(f)}return d}return a.prototype.colorRgb=function(a){var b=/^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/,a=a.toLowerCase();if(a&&b.test(a)){if(4===a.length){for(var c="#",d=1;d<4;d+=1)c+=a.slice(d,d+1).concat(a.slice(d,d+1));a=c}for(var e=[],d=1;d<7;d+=2)e.push(parseInt("0x"+a.slice(d,d+2)));return e}return a},a.prototype.colorHex=function(a){var b=a,c=/^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;if(/^(rgb|RGB)/.test(b)){for(var d=b.replace(/(?:(|)|rgb|RGB)*/g,"").split(","),e="#",f=0;f<d.length;f++){var g=Number(d[f]).toString(16);g=g<10?"0"+g:g,"0"===g&&(g+=g),e+=g}return 7!==e.length&&(e=b),e}if(!c.test(b))return b;var h=b.replace(/#/,"").split("");if(6===h.length)return b;if(3===h.length){for(var i="#",f=0;f<h.length;f+=1)i+=h[f]+h[f];return i}},a});