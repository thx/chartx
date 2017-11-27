import Canvax from "canvax2d"
import markColumn from "./markcolumn"
import Tips from "../../components/tips/index"
import _ from "underscore"

export default class LineTips extends Canvax.Event.EventDispatcher
{
    constructor( opt, tipDomContainer, data )
    {
        super();

        this.sprite      = null;
        
        this._tips        = null;
        this._markColumn = null;

        this._isShow     = false;
        this.enabled     = true;

        this.induce      = null; //graphs中的induce，用来触发事件系统

        this.init(opt, tipDomContainer, data);
    }

    init( opt, tipDomContainer, data )
    {
        var me = this;

        _.deepExtend(this , opt);
        this.sprite = new Canvax.Display.Sprite({
            id : "tips"
        });
        
        this._tips = new Tips( opt , tipDomContainer );
        this.sprite.addChild(this._tips.sprite);

        this._markColumn = new markColumn( _.extend({
            line : {
                eventEnabled: false
            }
        }, opt) );
        this.sprite.addChild( this._markColumn.sprite );

        this._markColumn.on("mouseover", function(e){
            //因为柱折混合图中得 bar的tips移动到 折线的圆点上面的时候会  hide掉 tip
            //所以这里再show回去
            setTimeout(function(){
                if( me._isShow == false ){
                    //单独的在line中是不会执行到这里的，line中调用的show 始终会把_isShow 设置为 true
                    me.show(e);
                }
            }, 6)
        });

    }

    setInduce( induce )
    {
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
    }

    reset( opt )
    {
        _.deepExtend(this._tips , opt);
    }

    //从柱状折图中传过来的tipsPoint参数会添加lineTop,lineH的属性用来绘制markCloumn
    show(e)
    {
        if( !this.enabled || !e.eventInfo ) return;
      
        var tipsPoint = this._getTipsPoint(e);
        this._tips.show(e , tipsPoint);
        this._markColumn.show(e , tipsPoint );
        this._isShow = true;
    }

    move(e)
    {
        if( !this.enabled  || !e.eventInfo) return;
        var tipsPoint = this._getTipsPoint(e);
        this._markColumn.move(e , tipsPoint);
        this._tips.move(e);
    }

    hide(e)
    {
        if( !this.enabled ) return;
        this._tips.hide(e);
        this._markColumn.hide(e);
        this._isShow = false;
    }

    _getTipsPoint(e)
    {
        var target = this.induce || e.target;
        var point = target.localToGlobal( e.eventInfo.nodesInfoList[e.eventInfo.iGroup] );
        if( e.eventInfo.tipsLine ){
            point.x = e.eventInfo.tipsLine.x;
        }
        return point;
    }
}