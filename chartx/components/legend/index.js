/*
 * legendData :
 * [
 *    { field : "uv" , value : 100 , fillStyle : "red" }
 *    ......
 * ]
 *
 **/
define(
    "chartx/components/legend/index" , 
    [
        "canvax/index",
        "canvax/shape/Circle"
    ],
    function(Canvax , Circle){
        var Legend = function(data , opt){
            this.data = data || [];
            this.w = 0;
            this.h = 0;
            this.tag = {
                height : 20
            }
            this.enabled = 1 ; //1,0 true ,false 

            this.icon = {
                r : 5,
                lineWidth : 1,
                fillStyle : "#999"
            }
            this.layoutType = "h" //横向 horizontal--> h

            this.sprite  = null;

            this.init( opt );
        };
    
        Legend.prototype = {
            init:function( opt ){
                if( opt ){
                    _.deepExtend( this , opt );
                };
                this.sprite = new Canvax.Display.Sprite({
                    id : "LegendSprite"
                });

                this.draw();
            },
            pos : function( pos ){
                this.sprite.context.x = pos.x;
                this.sprite.context.y = pos.y;
            },
            draw:function(opt , _xAxis , _yAxis){
                if( this.enabled ){ 
                    this._widget();
                } 
            },
            label : function( info ){
                return info.field+"："+info.value;
            },
            _widget:function(){
                var me = this;
 
                var width = 0,height = 0;
                _.each( this.data , function( obj , i ){

                    var icon   = new Circle({
                        context : {
                            x     : 0,
                            y     : me.tag.height/2 ,
                            fillStyle : obj.fillStyle,
                            r : me.icon.r,
                            cursor: "pointer"
                        }
                    });
                    
                    var content= me.label(obj);
                    var txt    = new Canvax.Display.Text( content , {
                        context : {
                            x : me.icon.r*2 ,
                            y : me.tag.height / 2,
                            textAlign : "left",
                            textBaseline : "middle",
                            fillStyle : "#333", //obj.fillStyle
                            cursor: "pointer"
                        }
                    } );
                
                    txt.hover(function(){

                    } , function(){

                    });

                    var txtW = txt.getTextWidth();
                    var itemW = txtW + me.icon.r*2 + 20;

                    var spItemC = {
                        height : me.tag.height
                    };
                    if( me.layoutType == "v" ){
                        spItemC.y = height;
                        width = Math.max( width , itemW );
                        height = me.tag.height*i;
                    } else {
                        spItemC.x = width ;
                        width += itemW;
                    };
                    var sprite = new Canvax.Display.Sprite({
                        context : spItemC
                    });
                    sprite.addChild( icon );
                    sprite.addChild(txt);

                    sprite.context.width = itemW;
                    me.sprite.addChild(sprite);
                } );

                me.w = me.sprite.context.width  = width;
                me.h = me.sprite.context.height = height;
            }
        };
        return Legend;
    
    } 
)




