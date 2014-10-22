KISSY.add(function( S , Canvax , Line , Circle ){
    var Tips = function(opt , data , tipsContainer){
        this.container = tipsContainer;
        this.sprite    = null;
        this.context   = null; // tips的详细内容
        this._line     = null;
        this._nodes    = null;
        this._tip      = null;
        this._back     = null;

        //prefix  在tips里面放在具体value值前面的文案
        this.prefix  = data.yAxis.field;
        
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
            var tipsPoint = this._getTipsPoint(e);
            this._initLine(e , tipsPoint);
            this._initNodes(e , tipsPoint);
            this._initContext(e , tipsPoint);
            
            this._initBack(e , tipsPoint);
        },
        move : function(e){
            this._setX(e);
            this._moveAndResetContext(e);
        },
        hide : function(e){
            debugger
            this.sprite.removeAllChildren();
            this._removeContext();
        },
        _getTipsPoint : function(e){
            return e.target.localToGlobal( e.info.nodesInfoList[e.info.iGroup] );
        },
        _setX : function(e){
            var tipsPoint = this._getTipsPoint(e);
            this._line.context.x  = tipsPoint.x;
            this._resetNodesPosition(e , tipsPoint);
        },
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
                        fillStyle : "#ffffff",
                        strokeStyle : node.fillStyle,
                        lineWidth : 3
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
        _initContext : function(e , tipsPoint){
            this._tip = S.all("<div style='display:inline-block;*display:inline;*zoom:1;'></div>");
            this._tip.html( this._getContext(e) );
            this.container.append( this._tip );
        },
        _removeContext : function(){
            this._tip.remove();
            this._tip = null;
        },
        _moveAndResetContext : function(e){
            this._tip.html( this._getContext(e) );
        },
        _getContext : function(e){
            if( !this.context ){
                this.context = this._getDefaultContext(e)
            }
            return this.context;
        },
        _getDefaultContext : function(e){
            var str  = "<table>";
            var self = this;
            _.each( e.info.nodesInfoList , function( node , i ){
                str+= "<tr style='color:"+ node.fillStyle +"'><td>"+ self.prefix[i] +"</td><td>"+ node.value +"</td></tr>";
            });
            str+="</table>";
            return str;
        },
        _initBack : function(e){
            
        }
    }
    return Tips
} , {
    requires : [
        "canvax/",
        "canvax/shape/Line",
        "canvax/shape/Circle",
        "dvix/utils/deep-extend"
    ]
})
