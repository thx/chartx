"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "mmvis", "./chart", "./components/coord/rect", "./components/coord/polar", "./components/graphs/bar/index", "./components/graphs/line/index", "./components/graphs/scat/index", "./components/graphs/pie/index", "./components/graphs/radar/index", "./components/graphs/cloud/index", "./components/graphs/planet/index", "./components/graphs/funnel/index", "./components/graphs/venn/index", "./components/graphs/sunburst/index", "./components/graphs/sankey/index", "./components/graphs/progress/index", "./components/graphs/relation/index", "./components/graphs/force/index", "./layout/dagre/index", "./layout/tree/index", "./components/legend/index", "./components/datazoom/index", "./components/markline/index", "./components/tips/index", "./components/bartgi/index", "./components/barguide/index", "./components/theme/index", "./components/watermark/index", "./components/cross/index", "./components/lineschedu/index", "./components/markcloumn/index"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("mmvis"), require("./chart"), require("./components/coord/rect"), require("./components/coord/polar"), require("./components/graphs/bar/index"), require("./components/graphs/line/index"), require("./components/graphs/scat/index"), require("./components/graphs/pie/index"), require("./components/graphs/radar/index"), require("./components/graphs/cloud/index"), require("./components/graphs/planet/index"), require("./components/graphs/funnel/index"), require("./components/graphs/venn/index"), require("./components/graphs/sunburst/index"), require("./components/graphs/sankey/index"), require("./components/graphs/progress/index"), require("./components/graphs/relation/index"), require("./components/graphs/force/index"), require("./layout/dagre/index"), require("./layout/tree/index"), require("./components/legend/index"), require("./components/datazoom/index"), require("./components/markline/index"), require("./components/tips/index"), require("./components/bartgi/index"), require("./components/barguide/index"), require("./components/theme/index"), require("./components/watermark/index"), require("./components/cross/index"), require("./components/lineschedu/index"), require("./components/markcloumn/index"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.mmvis, global.chart, global.rect, global.polar, global.index, global.index, global.index, global.index, global.index, global.index, global.index, global.index, global.index, global.index, global.index, global.index, global.index, global.index, global.index, global.index, global.index, global.index, global.index, global.index, global.index, global.index, global.index, global.index, global.index, global.index, global.index);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _mmvis) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
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
    _mmvis.global.setGlobalTheme(projectTheme);
  }

  ; //皮肤设定end -----------------

  var chartx = {
    version: '1.0.167',
    options: {}
  };

  for (var p in _mmvis.global) {
    chartx[p] = _mmvis.global[p];
  }

  ;
  exports["default"] = chartx;
});