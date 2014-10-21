KISSY.add(function( S , Canvax , Line ){
    var Tips = function(opt){
        this.sprite = null;
        this._line   = null;
        this._tip    = null;
        this._back   = null;
        
        this.init(opt);
    }

    Tips.prototype = {
        init : function(opt){
            _.deepExtend(this , opt);
            this.sprite = new Canvax.Display.Sprite({
                id : "tips"
            });
        },
        show : function(e){
            var tipsPoint = this.getTipsPoint(e);
            this.sprite.context.x = e.target.localToGlobal().x;
            this.sprite.context.y = e.target.localToGlobal().y;
            this._initLine(e , tipsPoint)
        },
        move : function(e){
            this._setX(e);
        },
        hide : function(e){
            this.sprite.removeAllChildren();
        },
        getTipsPoint : function(e){
            return e.target.localToGlobal( e.info.nodesInfoList[e.info.iGroup] );
        },
        _setX : function(e){
            var tipsPoint = this.getTipsPoint(e);
            this._line.context.x = tipsPoint.x;
        },
        _initLine : function(e , tipsPoint){
            var lineOpt = _.deepExtend({
                x       : tipsPoint.x,
                xStart  : 0,
                yStart  : e.target.context.height,
                xEnd    : 0,
                yEnd    : 0,
                lineType    : "dashed",
                lineWidth   : 1,
                strokeStyle : "#333333" 
            } , this.line);
            this._line = new Line({
                id : "tipsLine",
                context : lineOpt
            });
            this.sprite.addChild( this._line );
        }
    }
    return Tips
} , {
    requires : [
        "canvax/",
        "canvax/shape/Line",
        "dvix/utils/deep-extend"
    ]
})
