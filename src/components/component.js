import Canvax from "canvax2d"

export default class component extends Canvax.Event.EventDispatcher
{
    constructor(opt, data)
    {
        super( opt, data );
        this.enabled = false; //是否加载该组件
        this.display = true;  //该组件是否显示，不显示的话就不占据物理空间
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