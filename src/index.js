
import { global } from "mmvis"

import Chart from "./chart"

//空坐标系，当一些非坐标系图表，就直接创建在emptyCoord上面
//import emptyCoord from "./components/coord/index"

//坐标系
import Rect from "./components/coord/rect"
import Polar from "./components/coord/polar"

//graphs
import Bar from "./components/graphs/bar/index"
import Line from "./components/graphs/line/index"
import Scat from "./components/graphs/scat/index"
import Pie from "./components/graphs/pie/index"
import Radar from "./components/graphs/radar/index"
import Cloud from "./components/graphs/cloud/index"
import Planet from "./components/graphs/planet/index"
import Funnel from "./components/graphs/funnel/index"
import Venn from "./components/graphs/venn/index"
import Sunburst from "./components/graphs/sunburst/index"
import Sankey from "./components/graphs/sankey/index"

//components
import Legend from "./components/legend/index"
import DataZoom from "./components/datazoom/index"
import MarkLine from "./components/markline/index"
import Tips from "./components/tips/index"
import BarTgi from "./components/bartgi/index"
import BarGuide from "./components/barguide/index"
import Theme from "./components/theme/index"
import WaterMark from "./components/watermark/index"
import Cross from "./components/cross/index"
import lineSchedu from "./components/lineschedu/index"

global.registerComponent( Chart, 'chart' );

//global.registerComponent( emptyCoord, 'coord' );
global.registerComponent( Rect, 'coord', 'rect' );
global.registerComponent( Polar, 'coord', 'polar' );

global.registerComponent( Bar, 'graphs', 'bar' );
global.registerComponent( Line, 'graphs', 'line' );
global.registerComponent( Scat, 'graphs', 'scat' );
global.registerComponent( Pie, 'graphs', 'pie' );
global.registerComponent( Radar, 'graphs', 'radar' );
global.registerComponent( Cloud, 'graphs', 'cloud' );
global.registerComponent( Planet, 'graphs', 'planet' );
global.registerComponent( Funnel, 'graphs', 'funnel' );
global.registerComponent( Venn, 'graphs', 'venn' );
global.registerComponent( Sunburst, 'graphs', 'sunburst' );
global.registerComponent( Sankey, 'graphs', 'sankey' );

global.registerComponent( Theme, 'theme' );
global.registerComponent( Legend, 'legend' );
global.registerComponent( DataZoom, 'dataZoom' );
global.registerComponent( MarkLine, 'markLine' );
global.registerComponent( Tips, 'tips' );
global.registerComponent( BarTgi, 'barTgi' );
global.registerComponent( BarGuide, 'barGuide' );
global.registerComponent( WaterMark, 'waterMark' );
global.registerComponent( Cross, 'cross' );
global.registerComponent( lineSchedu, 'lineSchedu' )

//皮肤设定begin ---------------
//如果数据库中有项目皮肤
var projectTheme = []; //从数据库中查询出来设计师设置的项目皮肤
if( projectTheme && projectTheme.length ){
    global.setGlobalTheme( projectTheme );
};
//皮肤设定end -----------------

var chartx = {
    options : {}
};

for( var p in global ){
    chartx[ p ] = global[ p ];
};

export default chartx;
