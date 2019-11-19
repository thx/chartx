"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "mmvis", "./dagre"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("mmvis"), require("./dagre"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.mmvis, global.dagre);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _mmvis, _dagre) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _dagre2 = _interopRequireDefault(_dagre);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  _mmvis.global.registerLayout('dagre', _dagre2["default"]);

  exports["default"] = _dagre2["default"];
});