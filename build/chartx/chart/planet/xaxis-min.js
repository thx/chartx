define("chartx/chart/planet/xaxis",["canvax/index","canvax/shape/Rect"],function(a,b){var c=function(a){this.width=a.width,this.enabled=0,this.bar={dis:8,height:5},this.fillStyle={normal:["#70649a","#b28fce"]},this.radiusR=3,this.text={contents:["\u6781\u529b\u63a8\u8350","\u4e00\u822c\u63a8\u8350"],fillStyle:{normal:"#000000"},fontSize:{normal:12}},this.sprite=null,this.rect=null,this.init(a)};return c.prototype={init:function(a){_.deepExtend(this,a)},draw:function(a){var b=this;b._widget()},setX:function(a){this.sprite.context.x=a},setY:function(a){this.sprite.context.y=a},gradient:function(){var a=this,b=a.rect,c=a.sprite.getStage().context2D.createLinearGradient(b.context.x,b.context.y,b.context.x+b.context.width,b.context.y);c.addColorStop(0,a.fillStyle.normal[0]),c.addColorStop(1,a.fillStyle.normal[1]),b.context.fillStyle=c},_widget:function(){var c=this;if(c.enabled){c.sprite=new a.Display.Sprite,c.sprite.context.y=c.y,c.sprite.context.x=c.x;var d=c._creatTxt(c.text.contents[0]);c.sprite.addChild(d);var e=c._creatTxt(c.text.contents[1]);c.sprite.addChild(e);var f=c.width-d.getTextWidth()-e.getTextWidth()-2*this.bar.dis,g=new b({context:{x:0,y:0,width:f,height:c.bar.height,radius:[c.radiusR,c.radiusR,c.radiusR,c.radiusR]}});c.sprite.addChild(g),g.context.x=d.getTextWidth()+this.bar.dis,g.context.y=parseInt((d.getTextHeight()-c.bar.height)/2)+1,e.context.x=g.context.x+g.context.width+c.bar.dis,c.rect=g}},_creatTxt:function(b){var c=this;return new a.Display.Text(b,{context:{fillStyle:c.text.fillStyle.normal,fontSize:c.text.fontSize.normal}})}},c});