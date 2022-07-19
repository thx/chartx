"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _canvax = require("canvax");

var _default = {
  _eval: function _eval(code, target, paramName, paramValue) {
    return paramName ? new Function(paramName, code + "; return ".concat(target, ";"))(paramValue) : new Function(code + "; return ".concat(target, ";"))();
  },
  parse: function parse(code, range, data, variablesFromComponent) {
    try {
      var isVariablesDefined = range && range.length && range.length === 2 && range[1] > range[0]; // 若未定义

      if (!isVariablesDefined) {
        return this._eval(code, 'options');
      }

      var variablesInCode = this._eval(code, 'variables');

      if (typeof variablesInCode === 'function') {
        variablesInCode = variablesInCode(data) || {};
      }

      var variables = {};

      if (variablesFromComponent !== undefined) {
        variables = typeof variablesFromComponent === 'function' ? variablesFromComponent(data) : variablesFromComponent;
      }

      variables = _canvax._.extend(true, {}, variablesInCode, variables);
      var codeWithoutVariables = code.slice(0, range[0]) + code.slice(range[1]);
      return this._eval(codeWithoutVariables, 'options', 'variables', variables);
    } catch (e) {
      console.log('parse error');
      return {};
    }
  }
};
exports["default"] = _default;