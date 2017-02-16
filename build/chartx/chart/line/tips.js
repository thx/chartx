define(
    "chartx/chart/line/tips",
    [
        "canvax/index",
        "chartx/chart/line/markcolumn",
        "chartx/components/tips/tip"
    ],
    function( Canvax , markColumn, Tip ){
        var Tips = function(opt , data , tipDomContainer){

            this.sprite      = null;

            this._tip        = null;
            this._markColumn = null;

            this._isShow     = false;
            this.enabled     = true;

            this.induce      = null; //graphs中的induce，用来触发事件系统

            this.init(opt , data , tipDomContainer);
        };
    
        Tips.prototype = {
            init : function(opt , data , tipDomContainer){
                var me = this;

                _.deepExtend(this , opt);
                this.sprite = new Canvax.Display.Sprite({
                    id : "tips"
                });
                
                this._tip = new Tip( opt , tipDomContainer );
                this.sprite.addChild(this._tip.sprite);

                this._markColumn = new markColumn( _.extend({
                    line : {
                        eventEnabled: false
                    }
                }, opt) );
                this.sprite.addChild( this._markColumn.sprite );

                this._markColumn.on("mouseover" , function(e){
                    me.show( e );
                })
            },
            setInduce: function( induce ){
                this.induce = induce;
                var ictx = induce.context;
                var ictxLocPos = induce.localToGlobal();
                this.layout = {
                    x : ictxLocPos.x,
                    y : ictxLocPos.y,
                    width : ictx.width,
                    height : ictx.height
                };
                this._markColumn.y = this.layout.y;
                this._markColumn.h = this.layout.height;
            },
            reset: function( opt ){
                _.deepExtend(this._tip , opt);
            },
            //从柱状折图中传过来的tipsPoint参数会添加lineTop,lineH的属性用来绘制markCloumn
            show : function(e , tipsPoint){

                if( !this.enabled ) return;
                tipsPoint || ( tipsPoint = {} );
                tipsPoint = _.extend( this._getTipsPoint(e) , tipsPoint );
            
                this._tip.show(e , tipsPoint);

                this._markColumn.show(e , tipsPoint );

                this._isShow = true;
            },

            move : function(e){
                if( !this.enabled ) return;
                var tipsPoint = this._getTipsPoint(e);
                this._markColumn.move(e , tipsPoint);
                this._tip.move(e);
            },
            hide : function(e){
                if( !this.enabled ) return;
                this._tip.hide(e);
                this._markColumn.hide(e);

                this._isShow = false;
            },
            _getTipsPoint : function(e){
                var target = this.induce || e.target;
                return target.localToGlobal( e.eventInfo.nodesInfoList[e.eventInfo.iGroup] );
            }  
        };
        return Tips
    } 
);
