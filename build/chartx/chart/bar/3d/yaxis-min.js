define("chartx/chart/bar/3d/yaxis",["canvax/index","canvax/core/Base","canvax/shape/Line","chartx/utils/tools","chartx/utils/datasection"],function(a,b,c,d,e){var f=function(a){var b=a.yAxis,c=a.dataFrame.yAxis,d=a._getaverageData();this.root=a,this.w=0,this.enabled=1,this.dis=6,this.maxW=0,this.field=null,this.label="",this._label=null,this.line={enabled:1,width:4,lineWidth:1,strokeStyle:"#cccccc"},this.text={fillStyle:"#999",fontSize:12,format:null,rotation:0},this.pos={x:0,y:0},this.place="left",this.biaxial=!1,this.layoutData=[],this.dataSection=[],this.dataOrg=[],this.sprite=null,this.disYAxisTopLine=6,this.yMaxHeight=0,this.yGraphsHeight=0,this.baseNumber=null,this.basePoint=null,this.filter=null,this.isH=!1,this.animation=!0,this.resize=!1,this.sort=null,this.init(b,c,d)};return f.prototype={init:function(b,c,d){_.deepExtend(this,b),0!=this.text.rotation&&this.text.rotation%90==0&&(this.isH=!0),this._initData(c,d),this.sprite=new a.Display.Sprite},setX:function(a){this.sprite.context.x=a+("left"==this.place?this.maxW:0),this.pos.x=a},setY:function(a){this.sprite.context.y=a,this.pos.y=a},setAllStyle:function(a){_.each(this.sprite.children,function(b){_.each(b.children,function(b){"text"==b.type?b.context.fillStyle=a:"line"==b.type&&(b.context.strokeStyle=a)})})},resetData:function(a,b){b&&_.deepExtend(this,b),this.sprite.removeAllChildren(),this.dataSection=[],this._initData(a),this._trimYAxis(),this._widget()},update:function(a,b){this.sprite.removeAllChildren(),this.dataSection=[],_.deepExtend(this,a),this._initData(b),this._trimYAxis(),this._widget()},_getLabel:function(){this.label&&""!=this.label&&(this._label=this.sprite.getChildById("yAxis_label_"+this.label)||new a.Display.Text(this.label,{id:"yAxis_label_"+this.label,context:{fontSize:this.text.fontSize,textAlign:"left",textBaseline:this.isH?"top":"bottom",fillStyle:this.text.fillStyle,rotation:this.isH?-90:0}}))},draw:function(a){this.sprite.removeAllChildren(),a&&_.deepExtend(this,a),this._getLabel(),this.yGraphsHeight=this.yMaxHeight-this._getYAxisDisLine(),this._label&&(this.isH?this.yGraphsHeight-=this._label.getTextWidth():this.yGraphsHeight-=this._label.getTextHeight(),this._label.context.y=-this.yGraphsHeight-5),this._trimYAxis(),this._widget(),this.setX(this.pos.x),this.setY(this.pos.y),this.resize=!1},getYposFromVal:function(a){var b=this.dataSection[this.dataSection.length-1],c=-(a-this._bottomNumber)/(b-this._bottomNumber)*this.yGraphsHeight;return c=isNaN(c)?0:parseInt(c)},_trimYAxis:function(){for(var a=this.dataSection[this.dataSection.length-1],b=[],c=0,d=this.dataSection.length;d>c;c++)b[c]={content:this.dataSection[c],y:this.getYposFromVal(this.dataSection[c])};this.layoutData=b;var e=-(this.baseNumber-this._bottomNumber)/(a-this._bottomNumber)*this.yGraphsHeight;e=isNaN(e)?0:parseInt(e),this.basePoint={content:this.baseNumber,y:e}},_getYAxisDisLine:function(){var a=this.disYAxisTopLine,b=2*a,c=a;return c=a+this.yMaxHeight%this.dataSection.length,c=c>b?b:c},_setDataSection:function(a,b){var c=[];return _.each(a.org,function(a,b){for(var d=[],e=a[0].length,f=a.length,g=0,b=0;e>b;b++){for(var h=0,i=0;f>i;i++)h+=a[i][b],g=Math.min(a[i][b],g);d.push(h)}d.push(g),c.push(d)}),b||(b=[]),_.flatten(c).concat(b)},_initData:function(a,b){var c=this._setDataSection(a,b);if(this.dataOrg=a.org||a.data,0==this.dataSection.length&&(this.dataSection=e.section(c,3)),0==this.dataSection.length&&(this.dataSection=[0]),this.sort){var d="asc";if(_.isString(this.sort)&&(d=this.sort),_.isArray(this.sort)){var f=0;"right"==this.place&&(f=1),this.sort[f]&&(d=this.sort[f])}"desc"==d&&this.dataSection.reverse()}this._bottomNumber=this.dataSection[0],null==this.baseNumber&&(this.baseNumber=this._bottomNumber>0?this._bottomNumber:0)},resetWidth:function(a){var b=this;b.w=a,b.line.enabled?b.sprite.context.x=a-b.dis-b.line.width:b.sprite.context.x=a-b.dis},_widget:function(){var b=this;if(!b.enabled)return void(b.w=0);var e=this.layoutData;b.maxW=0,b._label&&b.sprite.addChild(b._label);for(var f=0,g=e.length;g>f;f++){var h=e[f],i=0,j=h.y,k=h.content;_.isFunction(b.text.format)&&(k=b.text.format(k,b)),(void 0===k||null===k)&&(k=d.numAddSymbol(h.content));var l=b.sprite.getChildById("yNode"+f)||new a.Display.Sprite({id:"yNode"+f}),m="left"==b.place?"right":"left";(90==b.text.rotation||-90==b.text.rotation)&&(m="center",f==e.length-1&&(m="right"));var n=j+(0==f?-3:0)+(f==e.length-1?3:0);(90==b.text.rotation||-90==b.text.rotation)&&(f==e.length-1&&(n=j-2),0==f&&(n=j));var o=l.getChildById("yAxis_txt_"+f)||new a.Display.Text(k,{id:"yAxis_txt_"+f,context:{fillStyle:b.text.fillStyle,fontSize:b.text.fontSize,rotation:-Math.abs(this.text.rotation),textAlign:m,textBaseline:"middle",globalAlpha:0}});if(o.context.x=i+("left"==b.place?-5:5),o.context.y=n+20,l.addChild(o),b.maxW=Math.max(b.maxW,o.getTextWidth()),(90==b.text.rotation||-90==b.text.rotation)&&(b.maxW=Math.max(b.maxW,o.getTextHeight())),b.line.enabled){var p=l.getChildById("yAxis_line_"+f)||new c({id:"yAxis_line_"+f,context:{lineWidth:b.line.lineWidth,strokeStyle:b.line.strokeStyle}});p.context.x=0+("left"==b.place?1:-1)*b.dis-2,p.context.y=j,p.context.xEnd=b.line.width,p.context.yEnd=0,l.addChild(p)}_.isFunction(b.filter)&&b.filter({layoutData:b.layoutData,index:f,txt:o,line:p}),b.sprite.addChild(l),o.context.y=o.context.y-20,o.context.globalAlpha=1}b.maxW+=b.dis,b.line.enabled?b.w=b.maxW+b.dis+b.line.width+b.pos.x:b.w=b.maxW+b.dis+b.pos.x}},f});