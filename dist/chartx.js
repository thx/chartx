(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Chartx = factory());
}(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var test3 =
  /*#__PURE__*/
  function () {
    function test3() {
      _classCallCheck(this, test3);
    }

    _createClass(test3, [{
      key: "test333",
      value: function test333() {
        alert('test3');
      }
    }]);

    return test3;
  }();
  var test1 =
  /*#__PURE__*/
  function () {
    function test1() {
      _classCallCheck(this, test1);
    }

    _createClass(test1, [{
      key: "aa",
      value: function aa() {
        alert('test1');
      }
    }]);

    return test1;
  }();

  var aa_test = function aa_test() {
    _classCallCheck(this, aa_test);
  };

  //坐标系组件
  var allProps = {
    aa_test: aa_test
  };

  return allProps;

})));
