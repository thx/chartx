define(
    "chartx/chart/map/markpoint",
    [
        "canvax/index",
        "canvax/shape/Circle",
        "chartx/components/tips/tip",
        "canvax/shape/Polygon",
        "canvax/animation/Tween"
    ],
    function( Canvax , Circle , Tip , Polygon , Tween ){
        var Tips = function( opt , data , tipDomContainer ){
            this.sprite      = null;

            this.cPointStyle = "white";

            this.init(opt , data , tipDomContainer);
        };

        Tips.prototype = {
            init : function(opt , data , tipDomContainer){
                _.deepExtend(this , opt);
                this.sprite = new Canvax.Display.Sprite({
                    id : "map-markpoint"
                });
            },
            _weight : function(e){
                
            }
        };

        return Tips;
    }
)
