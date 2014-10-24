KISSY.add(function( S , Canvax , Line , Circle , Tip ){
    var Tips = function(opt , data , tipDomContainer){
        this.sprite    = null;
        this.context   = null; 
        this._line     = null;
        this._nodes    = null;
        this._tip      = null;

        this.init(opt);
        this._tip      = new Tip(opt , data , tipDomContainer );
    };

    Tips.prototype = {
        init : function(opt){
            _.deepExtend(this , opt);
            this.sprite = new Canvax.Display.Sprite({
                id : "tips"
            });
            this.sprite.addChild(this._tip.sprite);
        },
        show : function(e){
            var tipsPoint = this._getTipsPoint(e);
            this._initLine(e , tipsPoint);
            this._initNodes(e , tipsPoint);
            this._tip.show(e);
            //this._initContext(e , tipsPoint);
            //this._initBack(e , tipsPoint);

            //initBack后 要把tip show，然后把xy对应到back的xy上面来
            //this._moveContext();

        },
        move : function(e){
            this._resetPosition(e);
        },
        hide : function(e){
            this.sprite.removeAllChildren();
            this._removeContext();
        },
        _getTipsPoint : function(e){
            return e.target.localToGlobal( e.info.nodesInfoList[e.info.iGroup] );
        },
        _resetPosition : function(e){
            var tipsPoint = this._getTipsPoint(e);
            this._line.context.x  = tipsPoint.x;
            this._resetNodesPosition(e , tipsPoint);

            //在setBack之前一定要先先reset Context,
            //因为back需要context最新的width和height
            this._resetContext(e);
            this._back.context.x  = this._getBackX(e , tipsPoint);
            this._moveContext();
        },

        /**
         * line相关------------------------
         */
        _initLine : function(e , tipsPoint){
            var lineOpt = _.deepExtend({
                x       : tipsPoint.x,
                y       : e.target.localToGlobal().y,
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
        },



        /**
         *nodes相关-------------------------
         */
        _initNodes : function(e , tipsPoint){
            this._nodes = new Canvax.Display.Sprite({
                id : "tipsNodes",
                context : {
                    x   : tipsPoint.x,
                    y   : e.target.localToGlobal().y
                }
            });
            var self = this;
            _.each( e.info.nodesInfoList , function( node ){
                self._nodes.addChild( new Circle({
                    context : {
                        y : e.target.context.height - Math.abs(node.y),
                        r : 3,
                        fillStyle   : node.fillStyle,
                        strokeStyle : "#ffffff",
                        lineWidth   : 3
                    }
                }) )
            } );
            this.sprite.addChild( this._nodes );
        },
        _resetNodesPosition : function(e , tipsPoint){
            var self = this;
            this._nodes.context.x = tipsPoint.x;
            _.each( e.info.nodesInfoList , function( node , i ){
                self._nodes.getChildAt(i).context.y = e.target.context.height - Math.abs(node.y);
            });
        },

        
        
        /**
         *获取back要显示的x
         */
        _getBackX : function( e , tipsPoint ){
            var w      = this._tip.outerWidth() + 2; //后面的2 是 两边的linewidth
            var x      = tipsPoint.x - w / 2;
            var stageW = e.target.getStage().context.width
            if( x < 0 ){
                x = 0;
            }
            if( x + w > stageW ){
                x = stageW - w;
            }
            return x
        }
    }
    return Tips
} , {
    requires : [
        "canvax/",
        "canvax/shape/Line",
        "canvax/shape/Circle",
        "dvix/components/tips/tip",
        "dvix/utils/deep-extend"
    ]
});
