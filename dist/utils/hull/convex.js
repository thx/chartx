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

  function _cross(o, a, b) {
    return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  }

  function _upperTangent(pointset) {
    var lower = [];

    for (var l = 0; l < pointset.length; l++) {
      while (lower.length >= 2 && _cross(lower[lower.length - 2], lower[lower.length - 1], pointset[l]) <= 0) {
        lower.pop();
      }

      lower.push(pointset[l]);
    }

    lower.pop();
    return lower;
  }

  function _lowerTangent(pointset) {
    var reversed = pointset.reverse(),
        upper = [];

    for (var u = 0; u < reversed.length; u++) {
      while (upper.length >= 2 && _cross(upper[upper.length - 2], upper[upper.length - 1], reversed[u]) <= 0) {
        upper.pop();
      }

      upper.push(reversed[u]);
    }

    upper.pop();
    return upper;
  } // pointset has to be sorted by X


  function convex(pointset) {
    var upper = _upperTangent(pointset),
        lower = _lowerTangent(pointset);

    var convex = lower.concat(upper);
    convex.push(pointset[0]);
    return convex;
  }

  exports["default"] = convex;
});