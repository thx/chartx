define("dvix/components/xaxis/xAxis",["canvax/index","canvax/shape/Line","dvix/utils/tools","dvix/utils/deep-extend"],function(a,b,c){var d=function(a,b){this.w=0,this.h=0,this.disY=0,this.dis=6,this.line={enabled:1,width:1,height:4,strokeStyle:"#cccccc"},this.max={left:0,right:0,txtH:14},this.text={mode:1,fillStyle:"#999999",fontSize:13},this.display="block",this.disXAxisLine=6,this.disOriginX=0,this.xGraphsWidth=0,this.dataOrg=[],this.dataSection=[],this.data=[],this.layoutData=[],this.sprite=null,this.txtSp=null,this.lineSp=null,this.init(a,b)};return d.prototype={init:function(b,c){this.dataOrg=c.org,b&&_.deepExtend(this,b),this.dataSection=this._initDataSection(this.dataOrg),this.sprite=new a.Display.Sprite({id:"xAxisSprite"}),this._checkText()},_initDataSection:function(a){return _.flatten(a)},setX:function(a){this.sprite.context.x=a},setY:function(a){this.sprite.context.y=a},draw:function(a){this._initConfig(a),this.data=this._trimXAxis(this.dataSection,this.xGraphsWidth),this._trimLayoutData(),this.setX(this.pos.x+this.disOriginX),this.setY(this.pos.y),"none"!=this.display&&(this._widget(),this._layout())},_initConfig:function(a){a&&_.deepExtend(this,a),this.max.right=this.w,this.xGraphsWidth=this.w-this._getXAxisDisLine(),this.disOriginX=parseInt((this.w-this.xGraphsWidth)/2),this.max.left+=this.disOriginX,this.max.right-=this.disOriginX},_trimXAxis:function(a,b){for(var c=[],d=b/(a.length+1),e=0,f=a.length;f>e;e++){var g={content:a[e],x:parseInt(d*(e+1))};c.push(g)}return c},_getXAxisDisLine:function(){var a=this.disXAxisLine,b=2*a,c=a;return c=a+this.w%this.dataOrg.length,c=c>b?b:c,c=isNaN(c)?0:c},_checkText:function(){var b=new a.Display.Text("test",{context:{fontSize:this.text.fontSize}});this.max.txtH=b.getTextHeight(),this.h="none"==this.display?this.max.txtH:this.disY+this.line.height+this.dis+this.max.txtH},_widget:function(){var d=this.layoutData;this.txtSp=new a.Display.Sprite,this.sprite.addChild(this.txtSp),this.lineSp=new a.Display.Sprite,this.sprite.addChild(this.lineSp);for(var e=0,f=d.length;f>e;e++){var g=d[e],h=g.x,i=this.disY+this.line.height+this.dis,j=c.numAddSymbol(g.content),k=new a.Display.Text(j,{context:{x:h,y:i,fillStyle:this.text.fillStyle,fontSize:this.text.fontSize}});this.txtSp.addChild(k)}for(var d=1==this.text.mode?this.layoutData:this.data,e=0,f=d.length;f>e;e++){var g=d[e],h=g.x,l=new b({id:e,context:{xStart:h,yStart:this.disY,xEnd:h,yEnd:this.line.height+this.disY,lineWidth:this.line.width,strokeStyle:this.line.strokeStyle}});this.lineSp.addChild(l)}for(var e=0,f=this.txtSp.getNumChildren();f>e;e++){var k=this.txtSp.getChildAt(e),h=parseInt(k.context.x-k.getTextWidth()/2);k.context.x=h}},_layout:function(){var a=this.txtSp.getChildAt(0),b=this.txtSp.getChildAt(this.txtSp.getNumChildren()-1);a&&a.context.x<this.max.left&&(a.context.x=parseInt(this.max.left)),b&&Number(b.context.x+Number(b.getTextWidth()))>this.max.right&&(b.context.x=parseInt(this.max.right-b.getTextWidth()))},_trimLayoutData:function(){for(var b=[],d=this.data,e=0,f=0,g=d.length;g>f;f++){var h=d[f],i=c.numAddSymbol(h.content),j=new a.Display.Text(i,{context:{fillStyle:this.text.fillStyle,fontSize:this.text.fontSize}});e=Math.max(e,j.getTextWidth())}for(var k=this.max.right,l=Math.min(Math.floor(k/e),d.length),m=Math.max(Math.ceil(d.length/l-1),0),f=0;l>f;f++){var n=d[f+m*f];n&&b.push(n)}this.layoutData=b}},d});