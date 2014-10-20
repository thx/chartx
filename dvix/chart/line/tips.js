KISSY.add(function( S , Canvax ){
    var Tips = function(){
        this.sprite = null;
        
        this.init();
    }

    Tips.prototype = {
        init : function( opt ){
            _.deepExtend( this , opt );
            this.sprite = new Canvax.Display.Sprite();
        },
        show : function(){
        
        },
        move : function(){
        
        },
        hide : function(){
        
        }
    }
    
} , {
    requires : [
        "canvax/",
        "dvix/utils/deep-extend"
    ]
})
