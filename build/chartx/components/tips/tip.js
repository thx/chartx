define(
    "chartx/components/tips/tip",
    [
         "canvax/index",
         "canvax/shape/Rect",
         "chartx/utils/tools"
    ],
    function( Canvax , Rect, Tools ){
        var Tip = function( opt , tipDomContainer ){
            this.enabled = true;
            this.tipDomContainer = tipDomContainer;
            this.cW      = 0;  //容器的width
            this.cH      = 0;  //容器的height
    
            this.dW      = 0;  //html的tips内容width
            this.dH      = 0;  //html的tips内容Height

            this.backR   = "5px";  //背景框的 圆角 
    
            this.sprite  = null;
            this.content = null; //tips的详细内容

            this.fillStyle   = "rgba(255,255,255,0.95)";//"#000000";
            this.text        = {
                fillStyle    : "#999"
            };
            this.strokeStyle = "#ccc";
            this.lineWidth   = 1;
            this.alpha       = 0.5;
            
            this._tipDom = null;
            //this._back   = null;

            this.offset = 10; //tips内容到鼠标位置的偏移量
        
            //所有调用tip的 event 上面 要附带有符合下面结构的tipsInfo属性
            //会deepExtend到this.indo上面来
            this.tipsInfo    = {
                //nodesInfoList : [],//[{value: , fillStyle : ...} ...]符合iNode的所有Group上面的node的集合
                //iGroup        : 0, //数据组的索引对应二维数据map的x
                //iNode         : 0  //数据点的索引对应二维数据map的y
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
                var self = this;
                this.sprite.on("destroy" , function(){
                    self._tipDom = null;
                });
            },
            show : function(e){
                if( !this.enabled ) return;
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
                if( !this.enabled ) return;
                this._setContent(e);
                this._resetBackSize(e);
                this.setPosition(e);
            },
            hide : function(){
                if( !this.enabled ) return;
                this.sprite.removeAllChildren();
                this._removeContent();
            },
            /**
             *@pos {x:0,y:0}
             */
            setPosition : function( e ){
                if(!this._tipDom) return;
                var pos = e.pos || e.target.localToGlobal( e.point );
                var x   = this._checkX( pos.x + this.offset );
                var y   = this._checkY( pos.y + this.offset );

                var _backPos = this.sprite.parent.globalToLocal( { x : x , y : y} );
                //this.sprite.context.x = _backPos.x;
                //this.sprite.context.y = _backPos.y;
                this._tipDom.style.cssText += ";visibility:visible;left:"+x+"px;top:"+y+"px;";
            },
            /**
             *content相关-------------------------
             */
            _initContent : function(e){
                this._tipDom = document.createElement("div");
                this._tipDom.className = "chart-tips";
                this._tipDom.style.cssText += "；-moz-border-radius:"+this.backR+"; -webkit-border-radius:"+this.backR+"; border-radius:"+this.backR+";background:"+this.fillStyle+";border:1px solid "+this.strokeStyle+";visibility:hidden;position:absolute;display:inline-block;*display:inline;*zoom:1;padding:6px;color:"+this.text.fillStyle+";line-height:1.5"
                this._tipDom.style.cssText += "; -moz-box-shadow:1px 1px 3px "+this.strokeStyle+"; -webkit-box-shadow:1px 1px 3px "+this.strokeStyle+"; box-shadow:1px 1px 3px "+this.strokeStyle+";"
                this.tipDomContainer.appendChild( this._tipDom );
                this._setContent(e);
            },
            _removeContent : function(){
                if(!this._tipDom){
                    return;
                };
                this.tipDomContainer.removeChild( this._tipDom );
                this._tipDom = null;
            },
            _setContent : function(e){
                if (!this._tipDom){
                    return;
                };
                var tipxContent = this._getContent(e);
                if( tipxContent === "_hide_" ){
                    this.hide();
                    return;
                }
                this._tipDom.innerHTML = tipxContent;
                this.dW = this._tipDom.offsetWidth;
                this.dH = this._tipDom.offsetHeight;
            },
            _getContent : function(e){
                _.extend( this.tipsInfo , (e.tipsInfo || e.eventInfo || {}) );
                var tipsContent = _.isFunction(this.content) ? this.content( this.tipsInfo ) : this.content ;
                if( !tipsContent && tipsContent != 0 ){
                    tipsContent = this._getDefaultContent( this.tipsInfo );
                }
                return tipsContent;
            },
            _getDefaultContent : function( info ){
                var str  = "<table>";
                var self = this;
                _.each( info.nodesInfoList , function( node , i ){

                    str+= "<tr style='color:"+ (node.color || node.fillStyle || node.strokeStyle) +"'>";
                    var prefixName = self.prefix[i];
                    if( prefixName ) {
                        str+="<td>"+ prefixName +"：</td>";
                    } else {
                        if( node.field ){
                            str+="<td>"+ node.field +"：</td>";
                        }
                    };

                    str += "<td>"+ Tools.numAddSymbol(node.value) +"</td></tr>";
                });
                str+="</table>";
                return str;
            },
            /**
             *Back相关-------------------------
             */
            _initBack : function(e){
                return
                var opt = {
                    x : 0,
                    y : 0,
                    width  : this.dW,
                    height : this.dH,
                    lineWidth : this.lineWidth,
                    //strokeStyle : "#333333",
                    fillStyle : this.fillStyle,
                    radius : [ this.backR ],
                    globalAlpha  : this.alpha
                };

                if( this.strokeStyle ){
                    opt.strokeStyle = this.strokeStyle;
                }
               
                /*
                this._back = new Rect({
                    id : "tipsBack",
                    context : opt
                });
                this.sprite.addChild( this._back );
                */
            },
            _resetBackSize:function(e){
                /*
                this._back.context.width  = this.dW;
                this._back.context.height = this.dH;
                */
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
