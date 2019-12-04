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

  exports.default = function (target, source) {
    var i = 1,
        n = arguments.length,
        method;

    while (++i < n) {
      target[method = arguments[i]] = _rebind(target, source, source[method]);
    }

    return target;
  };

  function _rebind(target, source, method) {
    return function () {
      var value = method.apply(source, arguments);
      return value === source ? target : value;
    };
  }
});