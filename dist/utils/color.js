"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.colorRgb = colorRgb;
exports.colorRgba = colorRgba;
exports.gradient = gradient;
exports.hex2rgb = hex2rgb;
exports.rgb2hex = rgb2hex;
exports.rgba2rgb = rgba2rgb;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

//十六进制颜色值的正则表达式 
var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
/*16进制颜色转为RGB格式*/

function colorRgb(hex) {
  var sColor = hex.toLowerCase();

  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      var sColorNew = "#";

      for (var i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }

      sColor = sColorNew;
    } //处理六位的颜色值  


    var sColorChange = [];

    for (var _i = 1; _i < 7; _i += 2) {
      sColorChange.push(parseInt("0x" + sColor.slice(_i, _i + 2)));
    }

    return "RGB(" + sColorChange.join(",") + ")";
  } else {
    return sColor;
  }
}

;

function colorRgba(hex, a) {
  return colorRgb(hex).replace(')', ',' + a + ')').replace('RGB', 'RGBA');
}

;

function hex2rgb(hex, out) {
  var rgb = [];

  for (var i = 1; i < 7; i += 2) {
    rgb.push(parseInt("0x" + hex.slice(i, i + 2)));
  }

  return rgb;
}

function rgb2hex(rgb) {
  var r = rgb[0];
  var g = rgb[1];
  var b = rgb[2];
  var hex = (r << 16 | g << 8 | b).toString(16);
  return "#" + new Array(Math.abs(hex.length - 7)).join("0") + hex;
}

function rgba2rgb(RGBA_color) {
  var background_color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "#ffffff";

  var _RGBA_color$match = RGBA_color.match(/[\d\.]+/g),
      _RGBA_color$match2 = (0, _slicedToArray2["default"])(_RGBA_color$match, 4),
      r = _RGBA_color$match2[0],
      g = _RGBA_color$match2[1],
      b = _RGBA_color$match2[2],
      a = _RGBA_color$match2[3];

  var _colorRgb$match = colorRgb(background_color).match(/[\d\.]+/g),
      _colorRgb$match2 = (0, _slicedToArray2["default"])(_colorRgb$match, 3),
      br = _colorRgb$match2[0],
      bg = _colorRgb$match2[1],
      bb = _colorRgb$match2[2];

  return "RGB(" + [(1 - a) * br + a * r, (1 - a) * bg + a * g, (1 - a) * bb + a * b].join(',') + ")";
} // 计算渐变过渡色


function gradient(startColor, endColor) {
  var step = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;
  // 将 hex 转换为rgb
  var sColor = hex2rgb(startColor);
  var eColor = hex2rgb(endColor); // 计算R\G\B每一步的差值

  var rStep = (eColor[0] - sColor[0]) / step;
  var gStep = (eColor[1] - sColor[1]) / step;
  var bStep = (eColor[2] - sColor[2]) / step;
  var gradientColorArr = [];

  for (var i = 0; i < step; i++) {
    // 计算每一步的hex值
    gradientColorArr.push(rgb2hex([parseInt(rStep * i + sColor[0]), parseInt(gStep * i + sColor[1]), parseInt(bStep * i + sColor[2])]));
  }

  return gradientColorArr;
}