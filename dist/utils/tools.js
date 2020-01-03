"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.numAddSymbol = numAddSymbol;
exports.getDisMinATArr = getDisMinATArr;
exports.getPath = getPath;
exports.getDefaultProps = getDefaultProps;

var _canvax = require("canvax");

function numAddSymbol($n, $s) {
  var s = Number($n);
  var symbol = $s ? $s : ',';

  if (!s) {
    return String($n);
  }

  ;

  if (s >= 1000) {
    var num = parseInt(s / 1000);
    return String($n.toString().replace(num, num + symbol));
  } else {
    return String($n);
  }
} //在一个数组中 返回比对$arr中的值离$n最近的值的索引


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
/**
* 获取一个path路径
* @param  {[Array]} $arr    [数组]
* @return {[String]}        [path字符串]
*/


function getPath($arr) {
  var M = 'M',
      L = 'L',
      Z = 'z';
  var s = '';
  var start = {
    x: 0,
    y: 0
  };

  if (_canvax._.isArray($arr[0])) {
    start.x = $arr[0][0];
    start.y = $arr[0][1];
    s = M + $arr[0][0] + ' ' + $arr[0][1];
  } else {
    start = $arr[0];
    s = M + $arr[0].x + ' ' + $arr[0].y;
  }

  for (var a = 1, al = $arr.length; a < al; a++) {
    var x = 0,
        y = 0,
        item = $arr[a];

    if (_canvax._.isArray(item)) {
      x = item[0];
      y = item[1];
    } else {
      x = item.x;
      y = item.y;
    } //s += ' ' + L + x + ' ' + y


    if (x == start.x && y == start.y) {
      s += ' ' + Z;
    } else {
      s += ' ' + L + x + ' ' + y;
    }
  } // s += ' ' + Z


  return s;
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