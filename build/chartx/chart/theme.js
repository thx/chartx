define(
    "chartx/chart/theme",[
        "chartx/utils/colorformat"
    ],
    function( ColorFormat ){
    	var brandColor = "#ff6600";
        var colors = ["#ff8533","#73ace6","#82d982","#e673ac","#cd6bed","#8282d9","#c0e650","#e6ac73","#6bcded","#73e6ac","#ed6bcd","#9966cc"]
        var Theme = {
            colors : colors,
            brandColor : brandColor
        };
        return Theme;
    }
);