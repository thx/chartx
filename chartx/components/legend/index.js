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
        "canvax/shape/Rect"
    ],
    function(Canvax , Rect){
        var Legend = function(data , opt){
            this.data = data || [];
            this.w = 0;
            this.h = 0;
            this.tag = {
                height : 20
            }
            this.enabled = 1 ; //1,0 true ,false 

            this.icon = {
                width : 6,
                height: 6,
                lineWidth : 1,
                fillStyle : "#999"
            }
            this.layoutType = "vertical"

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

                var max = 0;
                _.each( this.data , function( obj , i ){
                    var sprite = new Canvax.Display.Sprite({
                        context : {
                            height : me.tag.height,
                            y      : me.tag.height*i
                        }
                    });
                    var icon   = new Rect({
                        context : {
                            width : me.icon.width,
                            height: me.icon.height,
                            x     : 0,
                            y     : me.tag.height/2 - me.icon.height/2,
                            fillStyle : obj.fillStyle
                        }
                    });
                    sprite.addChild( icon );

                    var content= me.label(obj);
                    var txt    = new Canvax.Display.Text( content , {
                        context : {
                            x : me.icon.width+6,
                            y : me.tag.height / 2,
                            textAlign : "left",
                            textBaseline : "middle",
                            fillStyle : obj.fillStyle
                        }
                    } );
                    sprite.addChild(txt);

                    sprite.context.width = me.icon.width + 6 + txt.getTextWidth();
                    max = Math.max( max , sprite.context.width );
                    me.sprite.addChild(sprite);
                } );

                me.sprite.context.width  = max;
                me.sprite.context.height = me.sprite.children.length * me.tag.height;
                
                me.w = max+10;
                me.h = me.sprite.children.length * me.tag.height;
            }
        };
        return Legend;
    
    } 
)
