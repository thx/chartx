const _colors = ["#ff8533","#73ace6","#82d982","#e673ac","#cd6bed","#8282d9","#c0e650","#e6ac73","#6bcded","#73e6ac","#ed6bcd","#9966cc"];
export default {
    colors : _colors,
    set : function( colors ){
        this.colors = colors;
        return this.colors;
    },
    get : function( ){
        return this.colors
    }
}