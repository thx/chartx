import Component from "../component"
import Canvax from "canvax"
import { numAddSymbol,getDefaultProps } from "../../utils/tools"

let _ = Canvax._;
let Rect = Canvax.Shapes.Rect;
let Line = Canvax.Shapes.Line;

class Tips extends Component {

    static defaultProps(){
        return {
            enabled : {
                detail: '是否开启Tips',
                default: true
            },
            content : {
                detail : '自定义tips的内容（html）',
                default: null
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
            positionInRange : {
                detail : 'tip的浮层是否限定在画布区域(废弃)',
                default: false
            },
            pointer : {
                detail : '触发tips的时候的指针样式',
                default: 'line',
                documentation: 'tips的指针,默认为直线，可选为："line" | "region"(柱状图中一般用region)'
            },
            pointerAnim : {
                detail: 'tips移动的时候，指针是否开启动画',
                default: true
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

        this.name = "tips"

        this.tipDomContainer = this.app.canvax.domView;
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
            id: "TipSprite"
        });
        this.app.stage.addChild(this.sprite);

        let me = this;
        this.sprite.on("destroy", function() {
            me._tipDom = null;
        });

        _.extend(true, this, getDefaultProps( Tips.defaultProps() ), opt);
        
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
                this._hideDialogTips(e);
            }
        } else {
            this._hideDialogTips(e);
        }

        this._tipsPointerShow(e);
        this.onshow.apply( this, [e] );
        
    }

    move(e) {
        if (!this.enabled) return;

        if (e.eventInfo) {
            this.eventInfo = e.eventInfo;
            let content = this._setContent(e);
            if (content) {
                this._setPosition(e);
            } else {
                //move的时候hide的只有dialogTips, pointer不想要隐藏
                this._hideDialogTips();
            }
        };
        this._tipsPointerMove(e);

        this.onmove.apply( this, [e] );
    }
    
    hide(e){
        this._hide(e);
        this.onhide.apply( this, [e] );
    }

    _hide(e) {

        if (!this.enabled) return;
        this._hideDialogTips(e);
        this._tipsPointerHide(e);

    }

    _hideDialogTips() {
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

        let x = this._checkX( e.clientX + this.offsetX);
        let y = this._checkY( e.clientY + this.offsetY);

        this._tipDom.style.cssText += ";visibility:visible;left:" + x + "px;top:" + y + "px;";

        if (this.positionOfPoint == "left") {
            this._tipDom.style.left = this._checkX( e.x - this.offsetX - this._tipDom.offsetWidth ) + "px";
        };
    }

    /**
     *content相关-------------------------
     */
    _creatTipDom(e) {
        if( document ){
            let _tipDom = document.createElement("div");
            _tipDom.className = "chart-tips";
            _tipDom.style.cssText += "; border-radius:" + this.borderRadius + "px;background:" + this.fillStyle + ";border:1px solid " + this.strokeStyle + ";visibility:hidden;position:fixed;enabled:inline-block;*enabled:inline;*zoom:1;padding:6px;color:" + this.fontColor + ";line-height:1.5"
            _tipDom.style.cssText += "; box-shadow:1px 1px 3px " + this.strokeStyle + ";"
            _tipDom.style.cssText += "; border:none;white-space:nowrap;word-wrap:normal;"
            _tipDom.style.cssText += "; text-align:left;pointer-events:none;"
            _tipDom.style.cssText += "; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;"
            this.tipDomContainer && this.tipDomContainer.appendChild(_tipDom);
            return _tipDom;
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
            this._tipDom = this._creatTipDom(e)
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
            tipsContent = this._getDefaultContent(e.eventInfo);
        };

        return tipsContent;
    }

    _getDefaultContent(info) {
        
        let str = "";
        if( !info.nodes.length && !info.tipsContent ){
            return str;
        };

        if( info.nodes.length ){
            if (info.title !== undefined && info.title !== null && info.title !== "") {
                str += "<div style='font-size:14px;border-bottom:1px solid #f0f0f0;padding:4px;margin-bottom:6px;'>" + info.title + "</div>";
            }; 
            _.each(info.nodes, function (node, i) {
                /*
                if (!node.value && node.value !== 0) {
                    return;
                };
                */
                let style = node.color || node.fillStyle || node.strokeStyle;
                let name = node.name || node.field || node.content || node.label;
                let value = typeof(node.value) == "object" ? JSON.stringify(node.value) : numAddSymbol(node.value);
                let hasVal = node.value || node.value == 0

                str += "<div style='line-height:1.5;font-size:12px;padding:0 4px;'>"
                if( style ){
                    str += "<span style='background:" + style + ";margin-right:8px;margin-top:7px;float:left;width:8px;height:8px;border-radius:4px;overflow:hidden;font-size:0;'></span>";
                };
                if( name ){
                    str += "<span style='margin-right:5px;'>"+name;
                    hasVal && (str += "：");
                    str += "</span>";
                };
                hasVal && (str += value);
                str += "</div>";
            });
        }
        if( info.tipsContent ){
            str += info.tipsContent;
        }

        return str;
    }

    /**
     *检测是x方向超过了视窗
     */
    _checkX(x) {
        let w = this.dW + 2; //后面的2 是 两边的 linewidth
        let scrollLeft = document.body.scrollLeft;
        let clientWidth = document.body.clientWidth;
        if( x < scrollLeft ){
            x = scrollLeft;
        } else if( x + w > clientWidth ){
            x = scrollLeft + (clientWidth - w)
        }
        return x;
    }

    /**
     *检测是y方向超过了视窗
     */
    _checkY(y) {
        let h = this.dH + 2; //后面的2 是 两边的 linewidth
        let scrollTop = document.body.scrollTop;
        let clientHeight = document.documentElement.clientHeight;
        if( y < scrollTop ){
            y = scrollTop;
        } else if( y + h > clientHeight ){
            y = scrollTop + (clientHeight - h)
        }
        return y;
    }


    _tipsPointerShow(e) {
        //legend等组件上面的tips是没有xAxis等轴信息的
        if( !e.eventInfo || !e.eventInfo.xAxis ) {
            return;
        };
        let _coord = this.app.getComponent({name:'coord'});

        //目前只实现了直角坐标系的tipsPointer
        if (!_coord || _coord.type != 'rect') return;

        if (!this.pointer) return;

        //自动检测到如果数据里有一个柱状图的数据， 那么就启用region的pointer
        e.eventInfo.nodes.forEach(node => {
            if(node.type == "bar"){
                this.pointer = "region"
            }
        });

        let el = this._tipsPointer;
        let y = _coord.origin.y - _coord.height;
        let x = 0;
        if (this.pointer == "line") {
            x = _coord.origin.x + e.eventInfo.xAxis.x;
        }
        if (this.pointer == "region") {
            let regionWidth = _coord._xAxis.getCellLengthOfPos( e.eventInfo.xAxis.x );
            x = _coord.origin.x + e.eventInfo.xAxis.x - regionWidth / 2;
            if (e.eventInfo.xAxis.ind < 0) {
                //当没有任何数据的时候， e.eventInfo.xAxis.ind==-1
                x = _coord.origin.x;
            }
        }

        if (!el) {
            if (this.pointer == "line") {
                el = new Line({
                    //xyToInt : false,
                    context: {
                        x: x,
                        y: y,
                        start: {
                            x: 0,
                            y: 0
                        },
                        end: {
                            x: 0,
                            y: _coord.height
                        },
                        lineWidth: 1,
                        strokeStyle: "#cccccc"
                    }
                });
            };
            if (this.pointer == "region") {
                let regionWidth = _coord._xAxis.getCellLengthOfPos( x );
                el = new Rect({
                    //xyToInt : false,
                    context: {
                        width: regionWidth,
                        height: _coord.height,
                        x: x,
                        y: y,
                        fillStyle: "#cccccc",
                        globalAlpha: 0.3
                    }
                });
            };

            this.app.graphsSprite.addChild(el, 0);
            this._tipsPointer = el;
        } else {
            if (this.pointerAnim && _coord._xAxis.layoutType != "proportion") {
                if (el.__animation) {
                    el.__animation.stop();
                };
                el.__animation = el.animate({
                    x: x,
                    y: y
                }, {
                        duration: 200
                    });
            } else {
                el.context.x = x;
                el.context.y = y;
            }
        }
    }

    _tipsPointerHide(e) {
        //legend等组件上面的tips是没有xAxis等轴信息的
        if( !e.eventInfo || !e.eventInfo.xAxis ) {
            return;
        };

        let _coord = this.app.getComponent({name:'coord'});
        //目前只实现了直角坐标系的tipsPointer
        if (!_coord || _coord.type != 'rect') return;

        if (!this.pointer || !this._tipsPointer) return;
      
        this._tipsPointer.destroy();
        this._tipsPointer = null;
    }

    _tipsPointerMove(e) {
        //legend等组件上面的tips是没有xAxis等轴信息的
        if( !e.eventInfo || !e.eventInfo.xAxis ) {
            return;
        };
        let _coord = this.app.getComponent({name:'coord'});

        //目前只实现了直角坐标系的tipsPointer
        if (!_coord || _coord.type != 'rect') return;

        if (!this.pointer || !this._tipsPointer) return;

        //console.log("move");

        let el = this._tipsPointer;
        let x = _coord.origin.x + e.eventInfo.xAxis.x;
        if (this.pointer == "region") {
            let regionWidth = _coord._xAxis.getCellLengthOfPos( e.eventInfo.xAxis.x );
            x = _coord.origin.x + e.eventInfo.xAxis.x - regionWidth / 2;
            if (e.eventInfo.xAxis.ind < 0) {
                //当没有任何数据的时候， e.eventInfo.xAxis.ind==-1
                x = _coord.origin.x;
            }
        };
        let y = _coord.origin.y - _coord.height;

        if (x == el.__targetX) {
            return;
        };

        if (this.pointerAnim && _coord._xAxis.layoutType != "proportion") {
            if (el.__animation) {
                el.__animation.stop();
            };
            el.__targetX = x;
            el.__animation = el.animate({
                x: x,
                y: y
            }, {
                    duration: 200,
                    onComplete: function () {
                        delete el.__targetX;
                        delete el.__animation;
                    }
                })
        } else {
            el.context.x = x;
            el.context.y = y;
        }
    }

}

Component.registerComponent( Tips, 'tips' );
export default Tips;
