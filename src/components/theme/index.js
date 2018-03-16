/**
 * 皮肤组件，不是一个具体的ui组件
 */

export default class themeComponent
{
    constructor( theme , root )
    {
        this._root = root;
        this.colors = theme || [];
    }

    set( colors )
    {
        this.colors = colors;
        return this.colors;
    }

    get( ind )
    {
        return this.colors
    }

    mergeTo( colors )
    {
        if( !colors ){
            colors = [];
        };
        for( var i=0,l=this.colors.length; i<l; i++ ){
            if( colors[i] ){
                colors[i] = this.colors[i]
            } else {
                colors.push( this.colors[i] );
            }
        };
    
        return colors;
    }

}