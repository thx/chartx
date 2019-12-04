"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.undefined = mod.exports;
  }
})(void 0, function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = {
    toXy: function toXy(pointset, format) {
      if (format === undefined) {
        return pointset.slice();
      }

      return pointset.map(function (pt) {
        /*jslint evil: true */
        var _getXY = new Function('pt', 'return [pt' + format[0] + ',' + 'pt' + format[1] + '];');

        return _getXY(pt);
      });
    },
    fromXy: function fromXy(pointset, format) {
      if (format === undefined) {
        return pointset.slice();
      }

      return pointset.map(function (pt) {
        /*jslint evil: true */
        var _getObj = new Function('pt', 'const o = {}; o' + format[0] + '= pt[0]; o' + format[1] + '= pt[1]; return o;');

        return _getObj(pt);
      });
    }
  };
});