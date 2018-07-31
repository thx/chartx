import Component from "../component"
import Canvax from "canvax"
import {numAddSymbol} from "../../utils/tools"

const _ = Canvax._;
const Rect = Canvax.Shapes.Rect;
const Line = Canvax.Shapes.Line;

export default class Tips extends Component
{
    constructor( opt, app )
    {
        super();

        this.root    = app;

        this.tipDomContainer = app.canvax.domView;
        this.cW      = 0;  //容器的width
        this.cH      = 0;  //容器的height

        this.dW      = 0;  //html的tips内容width
        this.dH      = 0;  //html的tips内容Height

        this.borderRadius  = "5px";  //背景框的 圆角 

        this.sprite  = null;
        this.content = null; //tips的详细内容

        this.fillStyle   = "rgba(255,255,255,0.95)";//"#000000";
        this.fontColor = "#999";
        this.strokeStyle = "#ccc";
        
        this.position = "right"; //在鼠标的左（右）边
        
        this._tipDom = null;

        this.offsetX = 10; //tips内容到鼠标位置的偏移量x
        this.offsetY = 10; //tips内容到鼠标位置的偏移量y
    
        //所有调用tip的 event 上面 要附带有符合下面结构的eventInfo属性
        //会deepExtend到this.indo上面来
        this.eventInfo    = null; 
        
        this.positionInRange = false; //tip的浮层是否限定在画布区域
        this.enabled = true; //tips是默认显示的

        this.pointer = 'line'; //tips的指针,默认为直线，可选为：'line' | 'region'(柱状图中一般用region)
        this.pointerAnim = true;
        this._tipsPointer = null;

        _.extend(true, this , opt );
        this.sprite = new Canvax.Display.Sprite({
            id : "TipSprite"
        });
        var self = this;
        this.sprite.on("destroy" , function(){
            self._tipDom = null;
        });
    }

    static register( opt,app )
    {
        //所有的tips放在一个单独的tips中
		app.stageTips = new Canvax.Display.Stage({
		    id: "main-chart-stage-tips"
		});
        app.canvax.addChild( app.stageTips );

        var _tips = new this(opt, app);
        app.stageTips.addChild( _tips.sprite );
        app.components.push({
            type : "tips",
            id : "tips",
            plug : _tips
        });
    }

    show(e)
    {
        
        if( !this.enabled ) return;

        if( e.eventInfo ){
            this.eventInfo = e.eventInfo;

            var stage = e.target.getStage();
            this.cW   = stage.context.width;
            this.cH   = stage.context.height;

            var content = this._setContent(e);
            if( content ){
                this._setPosition(e);
                this.sprite.toFront();

                //比如散点图，没有hover到点的时候，也要显示，所有放到最下面
                //反之，如果只有hover到点的时候才显示point，那么就放这里
                //this._tipsPointerShow(e);
            } else {
                this.hide();
            }
            
        };

        this._tipsPointerShow(e)
    }

    move(e)
    {
        if( !this.enabled ) return;

        if( e.eventInfo ){
            this.eventInfo = e.eventInfo;
            var content = this._setContent(e);
            if( content ){
                this._setPosition(e);

                //比如散点图，没有hover到点的时候，也要显示，所有放到最下面
                //反之，如果只有hover到点的时候才显示point，那么就放这里
                //this._tipsPointerMove(e)
            } else {
                //move的时候hide的只有dialogTips, pointer不想要隐藏
                //this.hide();
                this._hideDialogTips();
            }
        };
        this._tipsPointerMove(e)
    }

    hide()
    {
        if( !this.enabled ) return;
        this._hideDialogTips();
        this._tipsPointerHide()
    }

    _hideDialogTips()
    {
        if( this.eventInfo ){
            this.eventInfo = null;
            this.sprite.removeAllChildren();
            this._removeContent();
        };
    }

    /**
     *@pos {x:0,y:0}
     */
    _setPosition( e )
    {
        if( !this.enabled ) return;
        if(!this._tipDom) return;
        var pos = e.pos || e.target.localToGlobal( e.point );
        var x   = this._checkX( pos.x + this.offsetX );
        var y   = this._checkY( pos.y + this.offsetY );

        this._tipDom.style.cssText += ";visibility:visible;left:"+x+"px;top:"+y+"px;-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;";
        
        if( this.position == "left" ){
            this._tipDom.style.left = this._checkX( pos.x - this.offsetX - this._tipDom.offsetWidth )+"px";
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
        this._tipDom.style.cssText += "；-moz-border-radius:"+this.borderRadius+"; -webkit-border-radius:"+this.borderRadius+"; border-radius:"+this.borderRadius+";background:"+this.fillStyle+";border:1px solid "+this.strokeStyle+";visibility:hidden;position:absolute;enabled:inline-block;*enabled:inline;*zoom:1;padding:6px;color:"+this.fontColor+";line-height:1.5"
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
            return;
        };

        if( !this._tipDom ){
            this._creatTipDom(e)
        };

        this._tipDom.innerHTML = tipxContent;
        this.dW = this._tipDom.offsetWidth;
        this.dH = this._tipDom.offsetHeight;

        return tipxContent
    }

    _getContent(e)
    {
       
        var tipsContent;

        if( this.content ){
            tipsContent = _.isFunction(this.content) ? this.content( e.eventInfo ) : this.content;
        } else {
            tipsContent = this._getDefaultContent( e.eventInfo );
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
            
            let tsStyle="style='border:none;white-space:nowrap;word-wrap:normal;'";
            let label = node.label || node.field;
            if( label ){
                label += "：";
            } else {
                label = "";
            };
        
            str+="<td "+tsStyle+">"+ label +"</td>";
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


    _tipsPointerShow( e )
    {
        var _coord = this.root._coord;
        
        //目前只实现了直角坐标系的tipsPointer
        if( !_coord || _coord.type != 'rect' ) return;

        if( !this.pointer ) return;

        var el = this._tipsPointer;        
        var y = _coord.origin.y - _coord.height;
        var x = 0;
        if( this.pointer == "line" ){
            x = _coord.origin.x + e.eventInfo.xAxis.x;
        }
        if( this.pointer == "region" ){
            x = _coord.origin.x + e.eventInfo.xAxis.x - _coord._xAxis.ceilWidth/2;
            if( e.eventInfo.xAxis.ind < 0 ){
                //当没有任何数据的时候， e.eventInfo.xAxis.ind==-1
                x = _coord.origin.x;
            }
        }

        if( !el ){
            if( this.pointer == "line" ){
                el = new Line({
                    //xyToInt : false,
                    context : {
                        x : x,
                        y : y,
                        start : {
                            x : 0,
                            y : 0
                        },
                        end : {
                            x : 0,
                            y : _coord.height
                        },
                        lineWidth : 1,
                        strokeStyle : "#cccccc"
                    }
                });
            };
            if( this.pointer == "region" ){
                el = new Rect({
                    //xyToInt : false,
                    context : {
                        width : _coord._xAxis.ceilWidth,
                        height : _coord.height,
                        x : x,
                        y : y,
                        fillStyle : "#cccccc",
                        globalAlpha : 0.3
                    }
                });
            };
            
            this.root.graphsSprite.addChild( el, 0 );
            this._tipsPointer = el;
        } else {
            if( this.pointerAnim && _coord._xAxis.layoutType != "proportion" ){
                if( el.__animation ){
                    el.__animation.stop();
                };
                el.__animation = el.animate( {
                    x : x,
                    y : y
                } , {
                    duration : 200
                });
            } else {
                el.context.x = x;
                el.context.y = y;
            }
        }
    }

    _tipsPointerHide( )
    {
        var _coord = this.root._coord;
        //目前只实现了直角坐标系的tipsPointer
        if( !_coord || _coord.type != 'rect' ) return;

        if( !this.pointer  || !this._tipsPointer ) return;
        //console.log("hide");
        this._tipsPointer.destroy();
        this._tipsPointer = null;
    }

    _tipsPointerMove( e )
    {

        var _coord = this.root._coord;
        
        //目前只实现了直角坐标系的tipsPointer
        if( !_coord || _coord.type != 'rect' ) return;

        if( !this.pointer || !this._tipsPointer ) return;

        //console.log("move");

        var el = this._tipsPointer;
        var x = _coord.origin.x + e.eventInfo.xAxis.x;
        if( this.pointer == "region" ){
            x = _coord.origin.x + e.eventInfo.xAxis.x - _coord._xAxis.ceilWidth/2;
            if( e.eventInfo.xAxis.ind < 0 ){
                //当没有任何数据的时候， e.eventInfo.xAxis.ind==-1
                x = _coord.origin.x;
            }
        };
        var y = _coord.origin.y - _coord.height;

        if( x == el.__targetX ){
            return;
        };

        if( this.pointerAnim && _coord._xAxis.layoutType != "proportion"){
            if( el.__animation ){
                el.__animation.stop();
            };
            el.__targetX = x;
            el.__animation = el.animate( {
                x : x,
                y : y
            } , {
                duration : 200,
                onComplete : function(){
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