import Canvax from "canvax2d"
import markColumn from "./markcolumn"
import Tips from "../../components/tips/index"

const _ = Canvax._;

export default class LineTips extends Canvax.Event.EventDispatcher
{
    constructor( opt, tipDomContainer, data , _coordinate)
    {
        super();

        this.sprite      = null;
        
        this._tips        = null;
        this._markColumn = null;

        this._isShow     = false;
        this.enabled     = true;

        this._coordinate = _coordinate;

        this.init(opt, tipDomContainer, data);
    }

    init( opt, tipDomContainer, data )
    {
        var me = this;

        _.extend(true, this , opt);
        this.sprite = new Canvax.Display.Sprite({
            id : "tips"
        });
        
        this._tips = new Tips( opt , tipDomContainer );
        this.sprite.addChild(this._tips.sprite);

        this._markColumn = new markColumn( opt);
        this.sprite.addChild( this._markColumn.sprite );
    }

    reset( opt )
    {
        _.extend(true, this._tips , opt);
    }

    //从柱状折图中传过来的tipsPoint参数会添加lineTop,lineH的属性用来绘制markCloumn
    show(e)
    {
        if( !this.enabled || !e.eventInfo ) return;
    
        var tipsPoint = this._getTipsPoint(e);

        this._tips.show(e , tipsPoint);

        this._markColumn.show(e , tipsPoint , {
            y : this._coordinate.induce.localToGlobal().y,
            h : this._coordinate.induce.context.height
        });
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
        if( !e.eventInfo.nodes.length ){
            return;
        }
        return e.target.localToGlobal( e.eventInfo.nodes[0] );
    }
}