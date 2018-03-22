//图表皮肤
import globalTheme from "./theme"
//空坐标系，当一些非坐标系图表，就直接创建在emptyCoord上面
import emptyCoord from "./coord/index"

//坐标系
import Rect from "./coord/rect"
import Polar from "./coord/polar"

//graphs
import Bar from "./graphs/bar/index"
import Line from "./graphs/line/index"
import Scat from "./graphs/scat/index"
import Pie from "./graphs/pie/index"
import Radar from "./graphs/radar/index"
import Cloud from "./graphs/cloud/index"
import Planet from "./graphs/planet/index"

//components
import Legend from "./components/legend/index"
import DataZoom from "./components/datazoom/index"
import MarkLine from "./components/markline/index"
import MarkPoint from "./components/markpoint/index"
import Anchor from "./components/anchor/index"
import Tips from "./components/tips/index"
import BarTgi from "./components/bartgi/index"
import Theme from "./components/theme/index"
import WaterMark from "./components/watermark/index"

var coord = {
    rect : Rect,
    polar : Polar
}

var graphs = {
    bar   : Bar,
    line  : Line,
    scat  : Scat,
    pie   : Pie,
    radar : Radar,
    cloud : Cloud,
    planet: Planet
}

var components = {
    theme : Theme,
    legend : Legend,
    dataZoom : DataZoom,
    markLine : MarkLine,
    markPoint : MarkPoint,
    anchor : Anchor,
    tips : Tips,
    barTgi : BarTgi,
    waterMark : WaterMark
}


//皮肤设定begin ---------------
//如果数据库中有项目皮肤
var projectTheme = []; //从数据库中查询出来设计师设置的项目皮肤
if( projectTheme && projectTheme.length ){
    globalTheme.set( projectTheme );
};
//皮肤设定end -----------------


var Chartx = {
    create : function( el, data, opts ){
        var chart = null;
        var Coord = emptyCoord;
        if( opts.coord && opts.coord.type ){
            Coord = coord[ opts.coord.type ];
        };
        chart = new Coord( el, data, opts, graphs, components );
        chart && chart.draw();
        return chart;
    },
    options : {},
    getOptions : function( chartPark_cid ){
        //chartPark_cid,chartpark中的图表id
        var opts = {};
        _.extend( true, opts, this[ chartPark_cid ] || {} );
        return opts;
    },
    instances : {},
    getChart : function( chartId ){

    }
};

export default Chartx;