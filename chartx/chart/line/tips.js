define(
    "chartx/chart/line/tips",
    [
        "canvax/index",
        "canvax/shape/Line",
        "canvax/shape/Circle",
        "chartx/components/tips/tip"
    ],
    function( Canvax , Line , Circle , Tip ){
        var Tips = function(opt , data , tipDomContainer){
            this.line      = {
                enabled      : 1,
                 //strokeStyle : null
            };
            this.node      = {
                //strokeStyle : null
                //backFillStyle : null
            }

            this.sprite    = null;
            this._line     = null;
            this._nodes    = null;
            this._tip      = null;
            this._isShow   = false;
            this.enabled   = true;

            this.init(opt , data , tipDomContainer);
        };
    
        Tips.prototype = {
            init : function(opt , data , tipDomContainer){
                _.deepExtend(this , opt);
                this.sprite = new Canvax.Display.Sprite({
                    id : "tips"
                });
    
                //opt = _.deepExtend({
                //    prefix : data.yAxis.field
                //} , opt);
                
                this._tip = new Tip( opt , tipDomContainer );
    
            },
            show : function(e , tipsPoint){
                if( !this.enabled ) return;
                tipsPoint || ( tipsPoint = {} );
                tipsPoint = _.extend( this._getTipsPoint(e) , tipsPoint );
                
                this._initLine(e , tipsPoint);
                this._initNodes(e , tipsPoint);
    
                this.sprite.addChild(this._tip.sprite);
                this._tip.show(e , tipsPoint);

                this._isShow = true;
            },
            move : function(e){
                if( !this.enabled ) return;
                this._resetStatus(e);
                this._tip.move(e);
            },
            hide : function(e){
                if( !this.enabled ) return;
                this.sprite.removeAllChildren();
                this._line  = null;
                this._nodes = null;
                this._tip.hide(e);

                this._isShow = false;
            },
            _getTipsPoint : function(e){
                return e.target.localToGlobal( e.eventInfo.nodesInfoList[e.eventInfo.iGroup] );
            },
            _resetStatus : function(e){
                var tipsPoint = this._getTipsPoint(e);
                if(this._line){
                    this._line.context.x  = parseInt(tipsPoint.x);
                }
                this._resetNodesStatus(e , tipsPoint);
            },
    
            /**
             * line相关------------------------
             */
            _initLine : function(e , tipsInfo){
                var lineOpt = _.deepExtend({
                    x       : parseInt(tipsInfo.x),
                    y       : tipsInfo.lineTop || e.target.localToGlobal().y,
                    xStart  : 0,
                    yStart  : tipsInfo.lineH || e.target.context.height,
                    xEnd    : 0,
                    yEnd    : 0,
                    lineWidth   : 1,
                    strokeStyle : this.line.strokeStyle || "#cccccc" 
                } , this.line);
                if(this.line.enabled){
                    this._line = new Line({
                        id : "tipsLine",
                        context : lineOpt
                    });
                    this.sprite.addChild( this._line );
                }
            },
    
    
            /**
             *nodes相关-------------------------
             */
            _initNodes : function(e , tipsPoint){
                var self = this
                this._nodes = new Canvax.Display.Sprite({
                    id : "line-tipsNodes",
                    context : {
                        x   : parseInt(tipsPoint.x),
                        y   : e.target.localToGlobal().y
                    }
                });
                var self = this;

                _.each( e.eventInfo.nodesInfoList , function( node ){
                    
                    var csp = new Canvax.Display.Sprite({
                        context : {
                            y : e.target.context.height - Math.abs(node.y) 
                        }
                    });

                    var bigCircle = new Circle({
                        context : {
                            r : node.r + 2 + 1 ,
                            fillStyle   : self.node.backFillStyle || "white",//node.fillStyle,
                            strokeStyle : self.node.strokeStyle || node.strokeStyle,
                            lineWidth   : node.lineWidth,
                            cursor      : 'pointer'
                        }
                    })
                    bigCircle.name = 'node', 
                    bigCircle.eventInfo = {
                        iGroup: node._groupInd,
                        iNode : e.eventInfo.iNode,
                        nodesInfoList : [node]
                    }

                    csp.addChild(bigCircle);

                    csp.addChild( new Circle({
                        context : {
                            r : node.r + 1,
                            fillStyle   : self.node.fillStyle || node.strokeStyle
                        }
                    }) );

                    self._nodes.addChild( csp );
                    bigCircle.on("mousemove", function(e) {
                        e.eventInfo = e.target.eventInfo
                        self._tip.move(e);
                    })
                    bigCircle.on("click", function(e) {
                        e.target.eventInfo.nodeInfo = e.target.eventInfo.nodesInfoList[0]
                        var eventInfo = _.clone(e.target.eventInfo)
                        delete eventInfo.nodesInfoList
                        var o = {
                            eventInfo : eventInfo
                        }
                        self.sprite.fire("nodeclick", o);
                    })

                } );
                this.sprite.addChild( this._nodes );
            },
            _resetNodesStatus : function(e , tipsPoint){
                var self = this;
                if( this._nodes.children.length != e.eventInfo.nodesInfoList.length ){
                    this._nodes.removeAllChildren();
                    this._initNodes( e , tipsPoint );
                }
                this._nodes.context.x = parseInt(tipsPoint.x);
                _.each( e.eventInfo.nodesInfoList , function( node , i ){
                    var csps         = self._nodes.getChildAt(i).context;
                    csps.y           = e.target.context.height - Math.abs(node.y);

                    var bigCircle = self._nodes.getChildAt(i).getChildAt(0)
                    bigCircle.eventInfo = {
                        iGroup: node._groupInd,
                        iNode : e.eventInfo.iNode,
                        nodesInfoList : [node]
                    }
                });
            }
        };
        return Tips
    } 
);
