"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.colorRgb = colorRgb;
exports.colorRgba = colorRgba;
exports.hex2rgb = hex2rgb;
exports.hex2string = hex2string;
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
  //hex可能是“#ff0000” 也可能是 0xff0000
  if (hex.replace) {
    hex = parseInt(hex.replace("#", "0X"), 16);
  }

  ;
  out = out || [];
  out[0] = (hex >> 16 & 0xFF) / 255;
  out[1] = (hex >> 8 & 0xFF) / 255;
  out[2] = (hex & 0xFF) / 255;
  return out;
}

function hex2string(hex) {
  hex = hex.toString(16);
  hex = '000000'.substr(0, 6 - hex.length) + hex;
  return "#".concat(hex);
}

function rgb2hex(rgb) {
  return (rgb[0] * 255 << 16) + (rgb[1] * 255 << 8) + rgb[2] * 255;
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
}