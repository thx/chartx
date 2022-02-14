import Component from "../component"
import Canvax from "canvax"
import { getDefaultProps } from "../../utils/tools"
import numeral from "numeral"

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
            pointerColor : {
                detail: 'tips指针样式的颜色',
                default: "#ccc"
            },
            pointerLineWidth: {
                detail: 'pointer为line的时候，设置指针line的线宽，默认1.5',
                default: 1
            },
            pointerRegionAlpha: {
                detail: 'pointer为region的时候，设置指针region的透明度',
                default: 0.38
            },
            pointerAnim : {
                detail: 'tips移动的时候，指针是否开启动画',
                default: true
            },
            linkageName : {
                detail: 'tips的多图表联动，相同的图表会执行事件联动，这个属性注意要保证y轴的width是一致的',
                default: null
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

        this.tipDomContainer = document ? document.body : null; //this.app.canvax.domView;
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
            //me._tipDom = null;
            me._removeContent();
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

                //比如散点图，没有hover到点的时候，也要显示，所有放到最下面
                //反之，如果只有hover到点的时候才显示point，那么就放这里
                //this._tipsPointerShow(e);
            } else {
                this._hide(e);
            }

        };

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

                //比如散点图，没有hover到点的时候，也要显示，所有放到最下面
                //反之，如果只有hover到点的时候才显示point，那么就放这里
                //this._tipsPointerMove(e)
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
        
        //let x = this._checkX( e.clientX + this.offsetX);
        //let y = this._checkY( e.clientY + this.offsetY);
        var domBounding = this.app.canvax.el.getBoundingClientRect();

        let x = this._checkX( e.offsetX + domBounding.x + this.offsetX);
        let y = this._checkY( e.offsetY + domBounding.y + this.offsetY);

        this._tipDom.style.cssText += ";visibility:visible;left:" + x + "px;top:" + y + "px;";

        if (this.positionOfPoint == "left") {
            this._tipDom.style.left = this._checkX( e.x - this.offsetX - this._tipDom.offsetWidth ) + "px";
        };
    }

    /**
     *content相关-------------------------
     */
    _creatTipDom(e) {
        this._tipDom = document.createElement("div");
        this._tipDom.className = "chart-tips";
        this._tipDom.style.cssText += "; border-radius:" + this.borderRadius + "px;background:" + this.fillStyle + ";border:1px solid " + this.strokeStyle + ";visibility:hidden;position:fixed;z-index:99999;enabled:inline-block;*enabled:inline;*zoom:1;padding:6px;color:" + this.fontColor + ";line-height:1.5"
        this._tipDom.style.cssText += "; box-shadow:1px 1px 3px " + this.strokeStyle + ";"
        this._tipDom.style.cssText += "; border:none;white-space:nowrap;word-wrap:normal;"
        this._tipDom.style.cssText += "; text-align:left;pointer-events:none;"
        this._tipDom.style.cssText += "; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;"
        this.tipDomContainer && this.tipDomContainer.appendChild(this._tipDom);
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
            this._creatTipDom(e)
        };

        this._tipDom.innerHTML = tipxContent;
        this.dW = this._tipDom.offsetWidth;
        this.dH = this._tipDom.offsetHeight;

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

        let _coord = this.app.getComponent({name:'coord'});
        
        let str = "";
        if( !info.nodes.length && !info.tipsContent ){
            return str;
        };

        if( info.nodes.length ){
            str += "<table >"
            
            if (info.title !== undefined && info.title !== null && info.title !== "") {
                str += "<tr><td colspan='2' style='text-align:left;padding-left:3px;'>"
                str += "<span style='font-size:12px;padding:4px;color:#333;'>" + info.title + "</span>";
                str += "</td></tr>"
            }; 
            _.each(info.nodes, function (node, i) {
                
                // if (!node.value && node.value !== 0) {
                //     return;
                // };

                let hasValue = node.value || node.value === 0;
                
                let style = node.color || node.fillStyle || node.strokeStyle;
                let name,value;
                let fieldConfig = _coord.getFieldConfig( node.field );

                //node.name优先级最高，是因为像 pie funnel 等一维图表，会有name属性
                name = node.name || fieldConfig.name || node.field;
                value = fieldConfig.getFormatValue( node.value );

                if( !hasValue ){
                    style = "#ddd";
                    value = '--'
                }
                
                str += "<tr>"
                str += "<td style='padding:0px 6px;color:" + (!hasValue ? '#ddd' : '#a0a0a0;') + "'>"+name+"</td>"
                str += "<td style='padding:0px 6px;'><span style='color:"+style+"'>"+value+"</span></td>"
                str += "</tr>";

            });
            str += "</table>"
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
                        lineWidth: this.pointerLineWidth,
                        strokeStyle: this.pointerColor
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
                        fillStyle: this.pointerColor,
                        globalAlpha: this.pointerRegionAlpha
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
