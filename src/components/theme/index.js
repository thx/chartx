import theme from "../../theme"

const _ = Canvax._;

/**
 * 皮肤组件，不是一个具体的ui组件
 */

export default class themeComponent
{
    constructor( opts , root )
    {
        super( opts , root );
        this.colors = theme.get();
    }

    set( colors )
    {
        this.colors = colors;
        return this.colors;
    }

    get()
    {
        return this.colors
    }

}