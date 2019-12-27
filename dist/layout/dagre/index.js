"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mmvis = require("mmvis");

var _dagre = _interopRequireDefault(require("./dagre"));

_mmvis.global.registerLayout('dagre', _dagre["default"]);

var _default = _dagre["default"];
exports["default"] = _default;