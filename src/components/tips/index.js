import Component from "../component"
import Canvax from "canvax"
import { getDefaultProps } from "../../utils/tools"

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

        this.tipDomContainer = null;
        if( document ){
            if( this.containerIsBody ){
                this.tipDomContainer = document.body; 
            } else {
                this.tipDomContainer = this.app.canvax.domView;
            }
        }; // (document && this.containerIsBody) ? document.body : null; //this.app.canvax.domView;
        
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
            content.then( (content)=>{
                if ( content ) {
                    this._setPosition(e);
                    this.sprite.toFront();
                } else {
                    this._hideDialogTips(e);
                }
            } )
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
            content.then( content => {
                if (content) {
                    this._setPosition(e);
                } else {
                    //move的时候hide的只有dialogTips, pointer不想要隐藏
                    this._hideDialogTips();
                }
            } );
        };

        this._tipsPointerMove(e);

        this.onmove.apply( this, [e] );
    }
    
    hide(e){
        //console.log('tips hide')
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
        //let x = this._checkX( e.clientX + this.offsetX);
        //let y = this._checkY( e.clientY + this.offsetY);
        

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
            this._tipDom = document.createElement("div");
            this._tipDom.className = "chart-tips";
            this._tipDom.style.cssText += "; border-radius:" + this.borderRadius + "px;background:" + this.fillStyle + ";border:1px solid " + this.strokeStyle + ";visibility:hidden;position:"+( this.containerIsBody ? 'fixed' : 'absolute' )+";z-index:99999999;enabled:inline-block;*enabled:inline;*zoom:1;padding:6px;color:" + this.fontColor + ";line-height:1.5"
            this._tipDom.style.cssText += "; box-shadow:1px 1px 3px " + this.strokeStyle + ";"
            this._tipDom.style.cssText += "; border:none;white-space:nowrap;word-wrap:normal;"
            this._tipDom.style.cssText += "; text-align:left;pointer-events:none;"
            this._tipDom.style.cssText += "; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;"
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
        return new Promise( resolve => {
            
            let tipxContent = this._getContent(e);
            if (!tipxContent && tipxContent !== 0) {
                resolve('');
                return;
            };
    
            if (!this._tipDom) {
                this._tipDom = this._creatTipDom(e)
            };
    
            //小程序等场景就无法创建_tipDom
            if( this._tipDom ){
                if( tipxContent.then ){
                    tipxContent.then( tipxContent => {
                        this._tipDom.innerHTML = tipxContent;
                        this.dW = this._tipDom.offsetWidth;
                        this.dH = this._tipDom.offsetHeight;
                        resolve( tipxContent )
                    } )
                } else {
                    this._tipDom.innerHTML = tipxContent;
                    this.dW = this._tipDom.offsetWidth;
                    this.dH = this._tipDom.offsetHeight;
                    resolve( tipxContent )
                }
            };
        } );
    }

    _getContent(e) {

        let content = ''
        if( e.eventInfo.tipsContent ){
            content = _.isFunction(e.eventInfo.tipsContent) ? e.eventInfo.tipsContent(e.eventInfo, e) : e.eventInfo.tipsContent;
        };

        if( !content ){
            if( this.content ){
                content = _.isFunction(this.content) ? this.content(e.eventInfo, e) : this.content;
            } else {
                content = this._getDefaultContent(e.eventInfo);
            }
        };

        return content;
    }

    _getDefaultContent(info) {

        let _coord = this.app.getComponent({name:'coord'});
        
        let str = "";
        if( !info.nodes.length ){
            return str;
        };

        let hasNodesContent = false;

        if( info.nodes.length ){
            str += "<table >"
            
            if (info.title !== undefined && info.title !== null && info.title !== "") {
                str += "<tr><td colspan='2' style='text-align:left;padding-left:3px;'>"
                str += "<span style='font-size:12px;padding:4px;color:#333;'>" + info.title + "</span>";
                str += "</td></tr>";
                hasNodesContent = true;
            }; 
            _.each(info.nodes, function (node, i) {
                
                // if (!node.value && node.value !== 0) {
                //     return;
                // };
                
                let style = node.color || node.fillStyle || node.strokeStyle;
                let name,value;
                let fieldConfig = _coord.getFieldConfig( node.field  );

                //node.name优先级最高，是因为像 pie funnel cloud 等一维图表，会有name属性
                //关系图中会有content
                name = node.name || node.label || ( (fieldConfig || {}).name) || node.content || node.field || '';
                
                str += "<tr>"
                if( typeof node.value == 'object' ){
                    //主要是用在散点图的情况
                    if( node.value && node.value.x ){
                        let xfieldConfig = _coord.getFieldConfig( info.xAxis.field  );
                        let xName = (xfieldConfig && xfieldConfig.name) || info.xAxis.field;
                        let xvalue = xfieldConfig ? xfieldConfig.getFormatValue( node.value.x ) : node.value.x;
                        str += "<td style='padding:0px 6px;'>"+xName+"：<span style='color:"+style+"'>"+ xvalue +"</span></td>";
                        hasNodesContent = true;
                    }
                    if( node.value && node.value.y ){
                        value = fieldConfig ? fieldConfig.getFormatValue( node.value.y ) : node.value.y;
                        str += "<td style='padding:0px 6px;'>"+name+"：<span style='color:"+style+"'>"+ value +"</span></td>";
                        hasNodesContent = true;
                    }
                } else {
                    value = fieldConfig ? fieldConfig.getFormatValue( node.value ) : node.value;

                    let hasValue = node.value || node.value === 0;
    
                    if( !hasValue && !node.__no_value ){
                        style = "#ddd";
                        value = '--'
                    }
                    
                    
                    if( !node.__no__name ){
                        str += "<td style='padding:0px 6px;color:" + ( (!hasValue && !node.__no_value) ? '#ddd' : '#a0a0a0;') + "'>"+name+"</td>";
                        hasNodesContent = true;
                    }
                    if( !node.__no_value ){
                        str += "<td style='padding:0px 6px;font-weight:bold;'>";
                        str += "<span style='color:"+style+"'>"+value+"</span>";
                        if( node.subValue ){
                            str +="<span style='padding-left:6px;font-weight:normal;'>"+ node.subValue +"</span>";
                            hasNodesContent = true;
                        };
                        str += "</td>"
                    }
                }
                
                str += "</tr>";

            });
            str += "</table>"
        }
        if( !hasNodesContent ){
            str = "";
        }

        return str;
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
