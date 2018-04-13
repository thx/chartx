import Canvax from "canvax2d"

export default class component extends Canvax.Event.EventDispatcher
{
    constructor(opt, data)
    {
        super( opt, data );
        this.enabled = false; //是否加载该组件
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