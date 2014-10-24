KISSY.add(function( S , Canvax , Rect ){
    var Tip = function( opt , data , tipsContainer ){
        this.sprite  = null;
        this.context = null; //tips的详细内容
        this._back   = null;

        //prefix  在tips里面放在具体value值前面的文案
        this.prefix  = data.yAxis.field;

        this.init(opt);
    }
    Tip.prototype = {
        init : function(opt){
            _.deepExtend( this , opt );
            this.sprite = new Canvax.Display.Sprite({
                id : "Tip"
            });
        },
        show : function(e){
            this._initContext(e);
            this._initBack(e);
        },
        move : function(){
        
        },
        hide : function(){
        
        },
        /**
         *@pos {x:0,y:0}
         */
        setPosition : function(pos){
            this.sprite.context.x = pos.x;
            this.sprite.context.y = pos.y;
            this._moveContext(pos)
        },
        /**
         *context相关-------------------------
         */
        _initContext : function(e){
            this._tip = S.all("<div class='chart-tips' style='visibility:hidden;position:absolute;<D-r>display:inline-block;*display:inline;*zoom:1;padding:6px;'></div>");
            this._tip.html( this._getContext(e) );
            this.container.append( this._tip );
        },
        _removeContext : function(){
            this._tip.remove();
            this._tip = null;
        },
        _resetContext : function(e){
            this._tip.html( this._getContext(e) );
        },
        _moveContext  : function(pos){
            this._tip.css({
                visibility : "visible",
                left       : pos.x+"px",
                top        : pos.y+"px"
            })
        },
        _getContext : function(e){
            var tipsContext = this.context;
            if( !tipsContext ){
                tipsContext = this._getDefaultContext(e);
            }
            return tipsContext;
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
        /**
         *Back相关-------------------------
         */
        _initBack : function(e){
            var w = this._tip.outerWidth();
            var h = this._tip.outerHeight();
            var opt = {
                x : 0,//this._getBackX( e , tipsPoint ),
                y : e.target.localToGlobal().y,
                width  : w,
                height : h,
                lineWidth : 1,
                strokeStyle : "#333333",
                fillStyle : "#ffffff",
                radius : [5]
            }
            this._back = new Rect({
                id : "tipsBack",
                context : opt
            });
            this.sprite.addChild( this._back );
        }

    }
} , {
    requires : [
        "canvax/",
        "canvax/shape/Rect",
        "dvix/utils/deep-extend"
    ]
});
