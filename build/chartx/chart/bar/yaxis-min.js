define("chartx/chart/bar/yaxis",["chartx/components/yaxis/yAxis"],function(a){var b=function(a,c){b.superclass.constructor.apply(this,[a.bar?a.bar:a,c])};return Chartx.extend(b,a,{_setDataSection:function(a){var b=[];return _.each(a.org,function(a,c){for(var d=[],e=a[0].length,f=a.length,g=0,c=0;e>c;c++){for(var h=0,i=0;f>i;i++)h+=a[i][c],g=Math.min(a[i][c],g);d.push(h)}d.push(g),b.push(d)}),_.flatten(b)}}),b});