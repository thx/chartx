define(
    "chartx/chart/map/tips",
    [
        "canvax/index",
        "chartx/components/tips/tip",
        "chartx/utils/deep-extend"
    ],
    function( Canvax , Tip  ){
        var Tips = function( opt , data , tipDomContainer ){
            this.sprite = null;

            this._triangle = null;
            this._tip      = null;
            
            this.init(opt , data , tipDomContainer)
        };

        Tips.prototype = {
            init : function(opt , data , tipDomContainer){
                _.deepExtend(this , opt);
                this.sprite = new Canvax.Display.Sprite({
                    id : "tips"
                });
    
                opt = _.deepExtend({
                    prefix : data.field,
                    context: "中国地图"
                } , opt);
                this._tip      = new Tip( opt , tipDomContainer );
            },
            show : function(e){
                this.sprite.addChild( this._tip.sprite );
                this._tip.show(e);
                this.sprite.toFront();
            },
            move : function(e){
                this._tip.move(e);
            },
            hide : function(e){
                this._tip.hide(e);
                //this.sprite.remove();
            }
        };

        return Tips;
    }
)
