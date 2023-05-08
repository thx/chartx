"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.a = createCommonjsModule;
exports.b = commonjsRequire;
exports.c = void 0;
var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};
exports.c = commonjsGlobal;

function commonjsRequire() {
  throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

function createCommonjsModule(fn, module) {
  return module = {
    exports: {}
  }, fn(module, module.exports), module.exports;
}