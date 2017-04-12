define("canvax/display/Text",["canvax/display/DisplayObject","canvax/core/Base"],function(a,b){var c=function(a,c){var d=this;d.type="text",d._reNewline=/\r?\n/,d.fontProperts=["fontStyle","fontVariant","fontWeight","fontSize","fontFamily"],c=b.checkOpt(c),d._context=_.deepExtend({fontSize:13,fontWeight:"normal",fontFamily:"微软雅黑,sans-serif",textDecoration:null,fillStyle:"blank",strokeStyle:null,lineWidth:0,lineHeight:1.2,backgroundColor:null,textBackgroundColor:null},c.context),d._context.font=d._getFontDeclaration(),d.text=a.toString(),arguments.callee.superclass.constructor.apply(this,[c])};return b.creatClass(c,a,{$watch:function(a,b,c){_.indexOf(this.fontProperts,a)>=0&&(this._context[a]=b,this._notWatch=!1,this.context.font=this._getFontDeclaration(),this.context.width=this.getTextWidth(),this.context.height=this.getTextHeight())},init:function(a,b){var c=this.context;c.width=this.getTextWidth(),c.height=this.getTextHeight()},render:function(a){for(p in this.context.$model)p in a&&"textBaseline"!=p&&this.context.$model[p]&&(a[p]=this.context.$model[p]);this._renderText(a,this._getTextLines())},resetText:function(a){this.text=a.toString(),this.heartBeat()},getTextWidth:function(){var a=0;return b._pixelCtx.save(),b._pixelCtx.font=this.context.font,a=this._getTextWidth(b._pixelCtx,this._getTextLines()),b._pixelCtx.restore(),a},getTextHeight:function(){return this._getTextHeight(b._pixelCtx,this._getTextLines())},_getTextLines:function(){return this.text.split(this._reNewline)},_renderText:function(a,b){a.save(),this._renderTextStroke(a,b),this._renderTextFill(a,b),a.restore()},_getFontDeclaration:function(){var a=this,b=[];return _.each(this.fontProperts,function(c){var d=a._context[c];"fontSize"==c&&(d=parseFloat(d)+"px"),d&&b.push(d)}),b.join(" ")},_renderTextFill:function(a,b){if(this.context.fillStyle){this._boundaries=[];for(var c=0,d=0,e=b.length;e>d;d++){var f=this._getHeightOfLine(a,d,b);c+=f,this._renderTextLine("fillText",a,b[d],0,this._getTopOffset()+c,d)}}},_renderTextStroke:function(a,b){if(this.context.strokeStyle&&this.context.lineWidth){var c=0;a.save(),this.strokeDashArray&&(1&this.strokeDashArray.length&&this.strokeDashArray.push.apply(this.strokeDashArray,this.strokeDashArray),supportsLineDash&&a.setLineDash(this.strokeDashArray)),a.beginPath();for(var d=0,e=b.length;e>d;d++){var f=this._getHeightOfLine(a,d,b);c+=f,this._renderTextLine("strokeText",a,b[d],0,this._getTopOffset()+c,d)}a.closePath(),a.restore()}},_renderTextLine:function(a,b,c,d,e,f){if(e-=this._getHeightOfLine()/4,"justify"!==this.context.textAlign)return void this._renderChars(a,b,c,d,e,f);var g=b.measureText(c).width,h=this.context.width;if(h>g)for(var i=c.split(/\s+/),j=b.measureText(c.replace(/\s+/g,"")).width,k=h-j,l=i.length-1,m=k/l,n=0,o=0,p=i.length;p>o;o++)this._renderChars(a,b,i[o],d+n,e,f),n+=b.measureText(i[o]).width+m;else this._renderChars(a,b,c,d,e,f)},_renderChars:function(a,b,c,d,e){b[a](c,0,e)},_getHeightOfLine:function(){return this.context.fontSize*this.context.lineHeight},_getTextWidth:function(a,b){for(var c=a.measureText(b[0]||"|").width,d=1,e=b.length;e>d;d++){var f=a.measureText(b[d]).width;f>c&&(c=f)}return c},_getTextHeight:function(a,b){return this.context.fontSize*b.length*this.context.lineHeight},_getTopOffset:function(){var a=0;switch(this.context.textBaseline){case"top":a=0;break;case"middle":a=-this.context.height/2;break;case"bottom":a=-this.context.height}return a},getRect:function(){var a=this.context,b=0,c=0;return"center"==a.textAlign&&(b=-a.width/2),"right"==a.textAlign&&(b=-a.width),"middle"==a.textBaseline&&(c=-a.height/2),"bottom"==a.textBaseline&&(c=-a.height),{x:b,y:c,width:a.width,height:a.height}}}),c});