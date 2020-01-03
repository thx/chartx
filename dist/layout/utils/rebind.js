"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

function _rebind(target, source, method) {
  return function () {
    var value = method.apply(source, arguments);
    return value === source ? target : value;
  };
}

function _default(target, source) {
  var i = 1,
      n = arguments.length,
      method;

  while (++i < n) {
    target[method = arguments[i]] = _rebind(target, source, source[method]);
  }

  return target;
}