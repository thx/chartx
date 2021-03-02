
import global from "./global"

//2d图表元类
import "./chart"
//-----------------------------------------------

//坐标系
import "./components/coord/rect"
import "./components/coord/polar"
//-----------------------------------------------

//graphs
import "./components/graphs/bar/index"
import "./components/graphs/line/index"
import "./components/graphs/scat/index"
import "./components/graphs/pie/index"
import "./components/graphs/radar/index"
import "./components/graphs/cloud/index"
import "./components/graphs/planet/index"
import "./components/graphs/funnel/index"
import "./components/graphs/venn/index"
import "./components/graphs/sunburst/index"
import "./components/graphs/sankey/index"
import "./components/graphs/progress/index"
import "./components/graphs/relation/index"
import "./components/graphs/tree/index"
import "./components/graphs/force/index"
import "./components/graphs/map/index"
 

//-----------------------------------------------
//布局算法
import "./layout/dagre/index"
import "./layout/tree/index"

//-----------------------------------------------
//components
import "./components/legend/index"
import "./components/datazoom/index"
import "./components/markline/index"
import "./components/tips/index"
import "./components/bartgi/index"
import "./components/barguide/index"
import "./components/theme/index"
import "./components/watermark/index"
import "./components/cross/index"
import "./components/lineschedu/index"
import "./components/markcloumn/index"
import "./components/relation_backline/index"

//皮肤设定begin ---------------
//如果数据库中有项目皮肤
let projectTheme = []; //从数据库中查询出来设计师设置的项目皮肤
if( projectTheme && projectTheme.length ){
    global.setGlobalTheme( projectTheme );
};
//皮肤设定end -----------------

let chartx = {
    version : '__VERSION__',
    options : {}
};

for( let p in global ){
    chartx[ p ] = global[ p ];
};

export default chartx;