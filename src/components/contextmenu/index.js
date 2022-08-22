import Component from "../component"
import Canvax from "canvax"
import { getDefaultProps } from "../../utils/tools"

let _ = Canvax._;

class contextMenu extends Component {

    static defaultProps(){
        return {
            enabled : {
                detail: '是否开启右键菜单',
                default: true
            },
            content : {
                detail : '自定义tips的内容（html）',
                default: null
            },
            containerIsBody: {
                detail: 'tips的html内容是否放到body下面，默认true，false则放到图表自身的容器内',
                default: true
            },
            borderRadius : {
                detail  : 'tips的边框圆角半径',
                default : 5
            },
            strokeStyle: {
                detail : 'tips边框颜色',
                default: '#ccc'
            },
            fillStyle : {
                detail : 'tips背景色',
                default: 'rgba(255,255,255,0.95)'
            },
            fontColor : {
                detail: 'tips文本颜色',
                default: '#999999'
            },
            positionOfPoint: {
                detail : 'tips在触发点的位置，默认在右侧',
                default: 'right'
            },
            offsetX : {
                detail: 'tips内容到鼠标位置的偏移量x',
                default: 10
            },
            offsetY : {
                detail: 'tips内容到鼠标位置的偏移量y',
                default: 10
            },
            
            onshow : {
                detail: 'show的时候的事件',
                default: function(){}
            },
            onmove : {
                detail: 'move的时候的事件',
                default: function(){}
            },
            onhide : {
                detail: 'hide的时候的事件',
                default: function(){}
            }
        }
    }

    constructor(opt, app) {
        super(opt, app);

        this.name = "contextmenu"
        
        this.cW = 0;  //容器的width
        this.cH = 0;  //容器的height

        this.dW = 0;  //html的tips内容width
        this.dH = 0;  //html的tips内容Height

        this._tipDom = null;
        this._tipsPointer = null;

        //所有调用tip的 event 上面 要附带有符合下面结构的eventInfo属性
        //会deepExtend到this.indo上面来
        this.eventInfo = null;

        this.sprite = null;
        this.sprite = new Canvax.Display.Sprite({
            id: "contextMenuSprite"
        });
        this.app.stage.addChild(this.sprite);

        let me = this;
        this.sprite.on("destroy", function() {
            me._removeContent();
        });

        this.isShow = false;

        _.extend(true, this, getDefaultProps( contextMenu.defaultProps() ), opt);

        this.tipDomContainer = document ? document.body : null; //右键菜单只能放body下面
        // if( document ){
        //     if( this.containerIsBody ){
        //         this.tipDomContainer = document.body; 
        //     } else {
        //         this.tipDomContainer = this.app.canvax.domView;
        //     }
        // }; // (document && this.containerIsBody) ? document.body : null; //this.app.canvax.domView;
        
    }

    show(e) {
        if (!this.enabled) return;

        if ( e.eventInfo ) {
            
            this.eventInfo = e.eventInfo;

            //TODO:这里要优化，canvax后续要提供直接获取canvax实例的方法
            let stage = e.target.getStage();
            if( stage ){
                this.cW = stage.context.width;
                this.cH = stage.context.height;
            } else {
                if( e.target.type == 'canvax' ){
                    this.cW = e.target.width;
                    this.cH = e.target.height;
                };
            };
            
            let content = this._setContent(e);
            if ( content ) {
                this._setPosition(e);
                this.sprite.toFront();
            } else {
                this._hideDialogMenus(e);
            }
        } else {
            this._hideDialogMenus(e);
        }

        this.onshow.apply( this, [e] );

        this.isShow = true;
        
    }
    
    hide(e){
        if (!this.enabled) return;
        
        this._hideDialogMenus(e);
        this.onhide.apply( this, [e] );
        this.isShow = false;
    }

    _hideDialogMenus() {
        if (this.eventInfo) {
            this.eventInfo = null;
            this.sprite.removeAllChildren();
            this._removeContent();
        };
    }

    /**
     *@pos {x:0,y:0}
     */
    _setPosition( e ) {
        //tips直接修改为fixed，所以定位直接用e.x e.y 2020-02-27
        if (!this.enabled) return;
        if (!this._tipDom) return;

        let domBounding = this.app.canvax.el.getBoundingClientRect();
        let domBX = domBounding.x || domBounding.left;
        let domBY = domBounding.y || domBounding.top;

        let x,y;
        if( this.containerIsBody ){
            let globalPoint = e.target.localToGlobal( e.point );
            x = this._checkX( globalPoint.x + domBX + this.offsetX);
            y = this._checkY( globalPoint.y + domBY + this.offsetY);
        } else {
            x = this._checkX( e.offsetX + domBX + this.offsetX);
            y = this._checkY( e.offsetY + domBY + this.offsetY);
            x -= domBX;
            y -= domBY;
        }
        
        this._tipDom.style.cssText += ";visibility:visible;left:" + x + "px;top:" + y + "px;";

        if (this.positionOfPoint == "left") {
            this._tipDom.style.left = this._checkX( e.x - this.offsetX - this._tipDom.offsetWidth ) + "px";
        };
    }

    /**
     *content相关-------------------------
     */
    _creatMenuDom(e) {
        if( document ){
            this._tipDom = document.createElement("div");
            this._tipDom.className = "context-menu-tips";
            this._tipDom.style.cssText += "; border-radius:" + this.borderRadius + "px;background:" + this.fillStyle + ";border:1px solid " + this.strokeStyle + ";visibility:hidden;position:"+( this.containerIsBody ? 'fixed' : 'absolute' )+";z-index:99999999;enabled:inline-block;*enabled:inline;*zoom:1;color:" + this.fontColor + ";line-height:1.5"
            this._tipDom.style.cssText += "; box-shadow:1px 1px 3px " + this.strokeStyle + ";"
            this._tipDom.style.cssText += "; border:none;white-space:nowrap;word-wrap:normal;"
            this._tipDom.style.cssText += "; text-align:left;"
            this._tipDom.style.cssText += "; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;"
            this._tipDom.onclick = () => {
                this.hide();
            };
            this.tipDomContainer && this.tipDomContainer.appendChild(this._tipDom);
            return this._tipDom;
        }
    }

    _removeContent() {
        if (!this._tipDom) return;
        this.tipDomContainer && this.tipDomContainer.removeChild(this._tipDom);
        this._tipDom = null;
    }

    _setContent(e) {
        let tipxContent = this._getContent(e);
        if (!tipxContent && tipxContent !== 0) {
            return;
        };

        if (!this._tipDom) {
            this._tipDom = this._creatMenuDom(e)
        };

        //小程序等场景就无法创建_tipDom
        if( this._tipDom ){
            this._tipDom.innerHTML = tipxContent;
            this.dW = this._tipDom.offsetWidth;
            this.dH = this._tipDom.offsetHeight;
        };
        
        return tipxContent
    }

    _getContent(e) {

        let tipsContent;

        if (this.content) {
            tipsContent = _.isFunction(this.content) ? this.content(e.eventInfo, e) : this.content;
        } else {
            tipsContent = ''
        };

        return tipsContent;
    }

     /**
     *检测是x方向超过了视窗
     */
     _checkX(x) {
        let w = this.dW + 2; //后面的2 是 两边的 linewidth
        let left = 0;
        let clientWidth = document.documentElement.clientWidth;
        if( x < left ){
            x = left;
        } else if( x + w > clientWidth ){
            x = clientWidth - w
        }
        return x;
    }

    /**
     *检测是y方向超过了视窗
     */
    _checkY(y) {
        let h = this.dH + 2; //后面的2 是 两边的 linewidth
        let top = 0; 
        let clientHeight = document.documentElement.clientHeight;
        if( y < top ){
            y = top;
        } else if( y + h > clientHeight ){
            y = clientHeight - h;
        }
        return y;
    }

}

Component.registerComponent( contextMenu, 'contextmenu' );
export default contextMenu;
