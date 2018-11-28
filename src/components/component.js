import Canvax from "canvax"

export default class component extends Canvax.Event.EventDispatcher
{
    constructor(opt, app)
    {
        super( opt, app );
        this.enabled = false; //是否加载该组件
        this._opt = opt;
        this.app = app; //这个组件挂在哪个app上面（图表）
        this.__cid =  Canvax.utils.createId("comp_");
        
    }

    init( opt, data )
    {
              
    }

    draw()
    {

    }

    //组件的销毁
    destroy()
    {

    }

    reset()
    {
        
    }
    
}