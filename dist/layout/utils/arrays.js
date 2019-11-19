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
    merge: function merge(arrays) {
      var n = arrays.length,
          m,
          i = -1,
          j = 0,
          merged,
          array;

      while (++i < n) {
        j += arrays[i].length;
      }

      merged = new Array(j);

      while (--n >= 0) {
        array = arrays[n];
        m = array.length;

        while (--m >= 0) {
          merged[--j] = array[m];
        }
      }

      return merged;
    }
  };
});