//图表基类
import Chart from "./chart"

//坐标系
import Descartes from "./coordinate/descartes"
import Polar from "./coordinate/polar"

//graphs
import Bar from "./graphs/bar/index"
import Line from "./graphs/line/index"
import Scat from "./graphs/scat/index"
import Pie from "./graphs/pie/index"

//components
import Legend from "./components/legend/index"
import DataZoom from "./components/datazoom/index"
import MarkLine from "./components/markline/index"
import MarkPoint from "./components/markpoint/index"
import Anchor from "./components/anchor/index"
import Tips from "./components/tips/index"
import BarTgi from "./components/bartgi/index"

var coordinate = {
    descartes : Descartes,
    polar : Polar
}

var graphs = {
    bar : Bar,
    line : Line,
    scat : Scat,
    pie : Pie
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

var Chartx = {
    create : function( el, data, opts ){
        var chart = null;
        if( opts.coordinate.type ){
            chart = new coordinate[ opts.coordinate.type ]( el, data, opts, graphs, components )
        }
        return chart;
    }
}

export default Chartx;