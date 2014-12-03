define(
    "chartx/chart/line/tips",
    [
        "canvax/index",
        "canvax/shape/Line",
        "canvax/shape/Circle",
        "chartx/components/tips/tip",
        "chartx/utils/deep-extend"
    ],
    function( Canvax , Line , Circle , Tip ){
        var Tips = function(opt , data , tipDomContainer){
            this.sprite    = null;
            this._line     = null;
            this._nodes    = null;
            this._tip      = null;
            this.init(opt , data , tipDomContainer);
        };
    
        Tips.prototype = {
            init : function(opt , data , tipDomContainer){
                _.deepExtend(this , opt);
                this.sprite = new Canvax.Display.Sprite({
                    id : "tips"
                });
    
                opt = _.deepExtend({
                    prefix : data.yAxis.field
                } , opt);
                this._tip      = new Tip( opt , tipDomContainer );
    
            },
            show : function(e){
                var tipsPoint = this._getTipsPoint(e);
                this._initLine(e , tipsPoint);
                this._initNodes(e , tipsPoint);
    
                this.sprite.addChild(this._tip.sprite);
                this._tip.show(e);
        
            },
            move : function(e){
                this._resetPosition(e);
    
                this._tip.move(e);
            },
            hide : function(e){
                this.sprite.removeAllChildren();
                this._line  = null;
                this._nodes = null;
                this._tip.hide(e);
            },
            _getTipsPoint : function(e){
                return e.target.localToGlobal( e.info.nodesInfoList[e.info.iGroup] );
            },
            _resetPosition : function(e){
                var tipsPoint = this._getTipsPoint(e);
                this._line.context.x  = tipsPoint.x;
                this._resetNodesPosition(e , tipsPoint);
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
            }
        }
        return Tips
    } 
);
