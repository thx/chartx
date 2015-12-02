define(
    "chartx/components/datazoom/index", 
    [
        "canvax/index",
        "canvax/shape/Rect"
    ],
    function( Canvax , Rect ) {
        
        var dataZoom = function( opt ){
            this.range = {
                start : 0,
                end   : 0
            };
            this._doneHandle = null;
            this.done   = function( fn ){
                this._doneHandle = fn;
            };
            this.init();
        };

        dataZoom.prototype = {
            init : function(){
                var me = this;
                this.sprite  = new Canvax.Display.Sprite({ });
            }
        };

        return dataZoom;
    }
);
