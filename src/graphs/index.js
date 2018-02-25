import Canvax from "canvax2d"

const _ = Canvax._;

export default class GraphsBase extends Canvax.Event.EventDispatcher
{
    constructor(opts, root)
    {
        super( opts, root );

        //这里所有的opts都要透传给 group
        this._opts = opts || {};
        this.root = root;
        this.ctx = root.stage.canvas.getContext("2d");
        this.dataFrame = root.dataFrame; //root.dataFrame的引用

        this.data = null;
        this.field = null;
        this.sprite   = null;

        this.width = 0;
        this.height = 0;
        this.origin = {
            x: 0,
            y: 0
        };

        this.animation = true;
    }

    tipsPointerOf(e){}

    tipsPointerHideOf(e){}

    focusOf(field, ind){}
    
    unfocusOf(field, ind){}
    
    selectOf(field, ind){}

    unselectOf(field, ind){}

    remove( field ){}

    add( field ){}

}