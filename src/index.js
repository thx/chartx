//图表皮肤
import theme from "./theme"

//空坐标系

//坐标系
import Rect from "./coord/rect"
import Polar from "./coord/polar"

//graphs
import Bar from "./graphs/bar/index"
import Line from "./graphs/line/index"
import Scat from "./graphs/scat/index"
import Pie from "./graphs/pie/index"
import Radar from "./graphs/radar/index"

//components
import Legend from "./components/legend/index"
import DataZoom from "./components/datazoom/index"
import MarkLine from "./components/markline/index"
import MarkPoint from "./components/markpoint/index"
import Anchor from "./components/anchor/index"
import Tips from "./components/tips/index"
import BarTgi from "./components/bartgi/index"

var coord = {
    rect : Rect,
    polar : Polar
}

var graphs = {
    bar : Bar,
    line : Line,
    scat : Scat,
    pie : Pie,
    radar : Radar
}

var components = {
    legend : Legend,
    dataZoom : DataZoom,
    markLine : MarkLine,
    markPoint : MarkPoint,
    anchor : Anchor,
    tips : Tips,
    barTgi : BarTgi
}

//皮肤设定begin ---------------
//如果数据库中有项目皮肤
var projectTheme = []; //从数据库中查询出来设计师设置的项目皮肤
if( projectTheme && projectTheme.length ){
    theme.set( projectTheme );
};
//皮肤设定end -----------------


var Chartx = {
    create : function( el, data, opts ){
        var chart = null;
        if( opts.coord && opts.coord.type ){
            chart = new coord[ opts.coord.type ]( el, data, opts, graphs, components );
        };
        chart && chart.draw();
        return chart;
    }
};

export default Chartx;