"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _global = _interopRequireDefault(require("./global"));

require("./chart");

require("./components/coord/rect");

require("./components/coord/polar");

require("./components/graphs/bar/index");

require("./components/graphs/line/index");

require("./components/graphs/scat/index");

require("./components/graphs/pie/index");

require("./components/graphs/radar/index");

require("./components/graphs/cloud/index");

require("./components/graphs/planet/index");

require("./components/graphs/funnel/index");

require("./components/graphs/venn/index");

require("./components/graphs/sunburst/index");

require("./components/graphs/sankey/index");

require("./components/graphs/progress/index");

require("./components/graphs/relation/index");

require("./components/graphs/tree/index");

require("./components/graphs/force/index");

require("./components/graphs/map/index");

require("./layout/dagre/index");

require("./layout/tree/index");

require("./components/legend/index");

require("./components/datazoom/index");

require("./components/markline/index");

require("./components/tips/index");

require("./components/bartgi/index");

require("./components/barguide/index");

require("./components/theme/index");

require("./components/watermark/index");

require("./components/cross/index");

require("./components/lineschedu/index");

require("./components/markcloumn/index");

require("./components/relation_backline/index");

require("./components/title/index");

require("./components/linemarkpoint/index");

//2d图表元类
//-----------------------------------------------
//坐标系
//-----------------------------------------------
//graphs
//-----------------------------------------------
//布局算法
//-----------------------------------------------
//components
//皮肤设定begin ---------------
//如果数据库中有项目皮肤
var projectTheme = []; //从数据库中查询出来设计师设置的项目皮肤

if (projectTheme && projectTheme.length) {
  _global["default"].setGlobalTheme(projectTheme);
}

; //皮肤设定end -----------------

var chartx = {
  version: '1.1.98',
  options: {}
};

for (var p in _global["default"]) {
  chartx[p] = _global["default"][p];
}

;
var _default = chartx;
exports["default"] = _default;