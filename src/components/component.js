import Canvax from "canvax"

export default class component extends Canvax.Event.EventDispatcher
{
    constructor(opt, data)
    {
        super( opt, data );
        this.enabled = false; //是否加载该组件
        this.app = null; //这个组件挂在哪个app上面（图表）
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