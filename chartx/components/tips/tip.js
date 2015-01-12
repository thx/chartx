define(
    "chartx/components/tips/tip",
    [
         "canvax/index",
         "canvax/shape/Rect",
         "chartx/utils/deep-extend"
    ],
    function( Canvax , Rect ){
        var Tip = function( opt , tipDomContainer ){
            this.tipDomContainer = tipDomContainer;
            this.cW      = 0;  //容器的width
            this.cH      = 0;  //容器的height
    
            this.dW      = 0;  //html的tips内容width
            this.dH      = 0;  //html的tips内容Height

            this.backR   = 3;  //背景框的 圆角 
    
            this.sprite  = null;
            this.content = null; //tips的详细内容
            
            this._tipDom = null;
            this._back   = null;
        
            //所有调用tip的 event 上面 要附带有符合下面结构的tipsInfo属性
            //会deepExtend到this.indo上面来
            this.tipsInfo    = {
                nodesInfoList : [],//[{value: , fillStyle : ...} ...]符合iNode的所有Group上面的node的集合
                iGroup        : 0, //数据组的索引对应二维数据map的x
                iNode         : 0  //数据点的索引对应二维数据map的y
            };
            this.prefix  = [];
            this.init(opt);
        }
        Tip.prototype = {
            init : function(opt){
                _.deepExtend( this , opt );
                this.sprite = new Canvax.Display.Sprite({
                    id : "TipSprite"
                });
            },
            show : function(e){
                this.hide();
                var stage = e.target.getStage();
                this.cW   = stage.context.width;
                this.cH   = stage.context.height;
    
                this._initContent(e);
                this._initBack(e);
                
                this.setPosition(e);

                this.sprite.toFront();
            },
            move : function(e){
                this._setContent(e);
                this._resetBackSize(e);
                this.setPosition(e);
            },
            hide : function(){
                this.sprite.removeAllChildren();
                this._removeContent();
            },
            /**
             *@pos {x:0,y:0}
             */
            setPosition : function( e ){
                if(!this._tipDom) return;
                var pos = e.pos || e.target.localToGlobal( e.point );
                var x   = this._checkX( pos.x );
                var y   = this._checkY( pos.y );

                var _backPos = this.sprite.parent.globalToLocal( { x : x , y : y} );
                this.sprite.context.x = _backPos.x;
                this.sprite.context.y = _backPos.y;
                this._tipDom.style.cssText += ";visibility:visible;left:"+x+"px;top:"+y+"px;";
            },
            /**
             *content相关-------------------------
             */
            _initContent : function(e){
                this._tipDom = document.createElement("div");
                this._tipDom.className = "chart-tips";
                this._tipDom.style.cssText += ";visibility:hidden;position:absolute;display:inline-block;*display:inline;*zoom:1;padding:6px;"
                this.tipDomContainer.appendChild( this._tipDom );
                this._setContent(e);
            },
            _removeContent : function(){
                if(!this._tipDom){
                    return;
                }
                this.tipDomContainer.removeChild( this._tipDom );
                this._tipDom = null;
            },
            _setContent : function(e){
                if (!this._tipDom){
                    return;
                } 
                this._tipDom.innerHTML = this._getContent(e);
                this.dW = this._tipDom.offsetWidth;
                this.dH = this._tipDom.offsetHeight;
            },
            _getContent : function(e){
                _.deepExtend( this.tipsInfo , (e.tipsInfo || {}) );
                var tipsContent = _.isFunction(this.content) ? this.content( this.tipsInfo ) : this.content ;
                if( !tipsContent ){
                    tipsContent = this._getDefaultContent(e);
                }
                return tipsContent;
            },
            _getDefaultContent : function(e){
                var str  = "<table>";
                var self = this;
                _.each( self.tipsInfo.nodesInfoList , function( node , i ){
                    str+= "<tr style='color:"+ node.fillStyle +"'>";
                    var prefixName = self.prefix[i];
                    if( prefixName ) {
                        str+="<td>"+ prefixName +"</td>";
                    };
                    str += "<td>"+ node.value +"</td></tr>";
                });
                str+="</table>";
                return str;
            },
            /**
             *Back相关-------------------------
             */
            _initBack : function(e){
                var opt = {
                    x : 0,
                    y : 0,
                    width  : this.dW,
                    height : this.dH,
                    lineWidth : 1,
                    strokeStyle : "#333333",
                    fillStyle : "#ffffff",
                    radius : [ this.backR ]
                }
                this._back = new Rect({
                    id : "tipsBack",
                    context : opt
                });
                this.sprite.addChild( this._back );
            },
            _resetBackSize:function(e){
                this._back.context.width  = this.dW;
                this._back.context.height = this.dH;
            },
    
            /**
             *获取back要显示的x
             *并且校验是否超出了界限
             */
            _checkX : function( x ){
                var w = this.dW + 2; //后面的2 是 两边的linewidth
                if( x < 0 ){
                    x = 0;
                }
                if( x + w > this.cW ){
                    x = this.cW - w;
                }
                return x
            },
    
            /**
             *获取back要显示的x
             *并且校验是否超出了界限
             */
            _checkY : function( y ){
                var h = this.dH + 2; //后面的2 是 两边的linewidth
                if( y < 0 ){
                    y = 0;
                }
                if( y + h > this.cH ){
                    y = this.cH - h;
                }
                return y
            }
        }
        return Tip
    } 
);
