"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDefaultProps = getDefaultProps;
exports.getDisMinATArr = getDisMinATArr;

var _canvax = require("canvax");

//在一个数组中 返回比对$arr中的值离$n最近的值的索引
function getDisMinATArr($n, $arr) {
  var index = 0;
  var n = Math.abs($n - $arr[0]);

  for (var a = 1, al = $arr.length; a < al; a++) {
    if (n > Math.abs($n - $arr[a])) {
      n = Math.abs($n - $arr[a]);
      index = a;
    }
  }

  return index;
}

function getDefaultProps(dProps) {
  var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  for (var p in dProps) {
    if (!!p.indexOf("_")) {
      if (!dProps[p] || !dProps[p].propertys) {
        //如果这个属性没有子属性了，那么就说明这个已经是叶子节点了
        if (_canvax._.isObject(dProps[p]) && !_canvax._.isFunction(dProps[p]) && !_canvax._.isArray(dProps[p])) {
          target[p] = dProps[p]["default"];
        } else {
          target[p] = dProps[p];
        }

        ;
      } else {
        target[p] = {};
        getDefaultProps(dProps[p].propertys, target[p]);
      }
    }

    ;
  }

  return target;
}