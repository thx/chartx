import Component from "../component"
import Canvax from "canvax2d"
import {numAddSymbol} from "../../utils/tools"

const _ = Canvax._;

export default class Tips extends Component
{
    constructor( opt, tipDomContainer )
    {
        super();

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
        
        this.place = "right"; //在鼠标的左（右）边
        
        this._tipDom = null;
        //this._back   = null;

        this.offset = 10; //tips内容到鼠标位置的偏移量
    
        //所有调用tip的 event 上面 要附带有符合下面结构的eventInfo属性
        //会deepExtend到this.indo上面来
        this.eventInfo    = null; 
        
        this.positionInRange = false; //tip的浮层是否限定在画布区域
        this.enabled = true; //tips是默认显示的

        this.pointer = 'line'; //tips的指针,默认为直线，可选为：'line' | 'shadow'
        this.pointerAnimate = true;

        this.init(opt);
    }

    init(opt)
    {
        _.extend(true, this , opt );
        this.sprite = new Canvax.Display.Sprite({
            id : "TipSprite"
        });
        var self = this;
        this.sprite.on("destroy" , function(){
            self._tipDom = null;
        });
    }

    show(e)
    {
        if( !this.enabled || !e.eventInfo ) return;
        this.hide();

        var stage = e.target.getStage();
        this.cW   = stage.context.width;
        this.cH   = stage.context.height;

        //this._creatTipDom(e);
        this._setContent(e);
        this.setPosition(e);

        this.sprite.toFront();
    }

    move(e)
    {
        if( !this.enabled || !e.eventInfo ) return;
        this._setContent(e);
        this.setPosition(e);
    }

    hide()
    {
        if( !this.enabled || !this.eventInfo ) return;
        this.eventInfo = null;
        this.sprite.removeAllChildren();
        this._removeContent();
    }

    /**
     *@pos {x:0,y:0}
     */
    setPosition( e )
    {
        if( !this.enabled ) return;
        if(!this._tipDom) return;
        var pos = e.pos || e.target.localToGlobal( e.point );
        var x   = this._checkX( pos.x + this.offset );
        var y   = this._checkY( pos.y + this.offset );

        this._tipDom.style.cssText += ";visibility:visible;left:"+x+"px;top:"+y+"px;-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;";
        
        if( this.place == "left" ){
            this._tipDom.style.left = this._checkX( pos.x - this.offset - this._tipDom.offsetWidth )+"px";
        };
    }

    /**
     *content相关-------------------------
     */
    _creatTipDom(e)
    {
        var me = this;
        this._tipDom = document.createElement("div");
        this._tipDom.className = "chart-tips";
        this._tipDom.style.cssText += "；-moz-border-radius:"+this.backR+"; -webkit-border-radius:"+this.backR+"; border-radius:"+this.backR+";background:"+this.fillStyle+";border:1px solid "+this.strokeStyle+";visibility:hidden;position:absolute;enabled:inline-block;*enabled:inline;*zoom:1;padding:6px;color:"+this.text.fillStyle+";line-height:1.5"
        this._tipDom.style.cssText += "; -moz-box-shadow:1px 1px 3px "+this.strokeStyle+"; -webkit-box-shadow:1px 1px 3px "+this.strokeStyle+"; box-shadow:1px 1px 3px "+this.strokeStyle+";"
        this._tipDom.style.cssText += "; border:none;white-space:nowrap;word-wrap:normal;"
        this.tipDomContainer.appendChild( this._tipDom );        
    }

    _removeContent()
    {
        if(!this._tipDom) return;
        this.tipDomContainer.removeChild( this._tipDom );
        this._tipDom = null;
    }

    _setContent(e)
    {
        var tipxContent = this._getContent(e);
        if( !tipxContent && tipxContent!==0 ){
            this.hide();
            return;
        };

        if( !this._tipDom ){
            this._creatTipDom(e)
        };

        this._tipDom.innerHTML = tipxContent;
        this.dW = this._tipDom.offsetWidth;
        this.dH = this._tipDom.offsetHeight;
    }

    _getContent(e)
    {
        this.eventInfo = e.eventInfo;
        var tipsContent;

        if( this.content ){
            tipsContent = _.isFunction(this.content) ? this.content( this.eventInfo ) : this.content;
        } else {
            tipsContent = this._getDefaultContent( this.eventInfo );
        };

        return tipsContent;
    }

    _getDefaultContent( info )
    {
        if( !info.nodes.length ){
            return null;
        }

        var str  = "<table style='border:none'>";
        var self = this;

        if( info.title !== undefined && info.title !== null &&info.title !== "" ){
            str += "<tr><td colspan='2'>"+ info.title +"</td></tr>"
        };

        _.each( info.nodes , function( node , i ){
            if( node.value === undefined || node.value === null ){
                return;
            };

            str+= "<tr style='color:"+ (node.color || node.fillStyle || node.strokeStyle) +"'>";
            var tsStyle="style='border:none;white-space:nowrap;word-wrap:normal;'";
            str+="<td "+tsStyle+">"+ (node.name || node.field || "") +"：</td>";
            str += "<td "+tsStyle+">"+ (typeof node.value == "object" ? JSON.stringify(node.value) : numAddSymbol(node.value)) +"</td></tr>";
        });
        str+="</table>";
        return str;
    }

    /**
     *获取back要显示的x
     *并且校验是否超出了界限
     */
    _checkX( x )
    {
        if( this.positionInRange ){
            var w = this.dW + 2; //后面的2 是 两边的 linewidth
            if( x < 0 ){
                x = 0;
            }
            if( x + w > this.cW ){
                x = this.cW - w;
            }
        }
        return x
    }

    /**
     *获取back要显示的x
     *并且校验是否超出了界限
     */
    _checkY( y )
    {
        if(this.positionInRange){
            var h = this.dH + 2; //后面的2 是 两边的 linewidth
            if( y < 0 ){
                y = 0;
            }
            if( y + h > this.cH ){
                y = this.cH - h;
            }
        }
        return y
    }
}