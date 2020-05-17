"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _canvax = require("canvax");

var _projection = _interopRequireDefault(require("./projection"));

var rate = 0.75;
/**
 * 
 * @param {Object} geoData 
 * @param {Object} graphBBox 绘制在什么位置{x,y,width,height} 
 */

function _default(geoData, graphBBox) {
  var specialArea = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  //先过一遍解码，么有编码的数据会直接返回
  geoData.json = decode(geoData.json);

  var data = _getProjectionData(geoData, graphBBox, specialArea);

  return data;
}

var _getProjectionData = function _getProjectionData(geoData, graphBBox, specialArea) {
  var province = [];

  var bbox = geoData.bbox || _projection["default"].getBbox(geoData.json, specialArea);

  var transform = _getTransform(bbox, graphBBox, rate);

  var lastTransform = geoData.lastTransform || {
    scale: {}
  };
  var pathArray;

  if (transform.left != lastTransform.left || transform.top != lastTransform.top || transform.scale.x != lastTransform.scale.x || transform.scale.y != lastTransform.scale.y) {
    //发生过变化，需要重新生成pathArray
    pathArray = _projection["default"].geoJson2Path(geoData.json, transform, specialArea);
    lastTransform = _canvax._.clone(transform);
  } else {
    transform = geoData.transform;
    pathArray = geoData.pathArray;
  }

  geoData.bbox = bbox;
  geoData.transform = transform;
  geoData.lastTransform = lastTransform;
  geoData.pathArray = pathArray;
  var position = [transform.left, transform.top];

  for (var i = 0, l = pathArray.length; i < l; i++) {
    province.push(_getSingleProvince(geoData, pathArray[i], position, bbox));
  }

  ;
  return province;
};

var _getTransform = function _getTransform(bbox, graphBBox, rate) {
  var width = graphBBox.width,
      height = graphBBox.height;
  var mapWidth = bbox.width;
  var mapHeight = bbox.height; //var minScale;

  var xScale = width / rate / mapWidth;
  var yScale = height / mapHeight;

  if (xScale > yScale) {
    //minScale = yScale;
    xScale = yScale * rate;
    width = mapWidth * xScale;
  } else {
    yScale = xScale;
    xScale = yScale * rate;
    height = mapHeight * yScale;
  }

  return {
    left: 0,
    top: 0,
    width: width,
    height: height,
    baseScale: 1,
    scale: {
      x: xScale,
      y: yScale
    }
  };
};

var _getSingleProvince = function _getSingleProvince(geoData, path, position, bbox) {
  var textPosition;
  var name = path.properties.name;
  var textFixed = [0, 0];

  if (path.cp) {
    textPosition = [path.cp[0] + textFixed[0], path.cp[1] + textFixed[1]];
  } else {
    textPosition = geo2pos(geoData, [bbox.left + bbox.width / 2, bbox.top + bbox.height / 2]);
    textPosition[0] += textFixed[0];
    textPosition[1] += textFixed[1];
  }

  path.name = name;
  path.position = position;
  path.textX = textPosition[0];
  path.textY = textPosition[1];
  return path;
};
/**
 * 经纬度转平面坐标
 * @param {Object} p
 */


var geo2pos = function geo2pos(geoData, p) {
  if (!geoData.transform) {
    return null;
  }

  ;
  return _projection["default"].geo2pos(geoData.transform, p);
}; //geoJson有的加过密，比如百度图表库的geoJson


var decode = function decode(geoData) {
  if (!geoData.UTF8Encoding) {
    return geoData;
  }

  var features = geoData.features;

  for (var f = 0; f < features.length; f++) {
    var feature = features[f];
    var coordinates = feature.geometry.coordinates;
    var encodeOffsets = feature.geometry.encodeOffsets;

    for (var c = 0; c < coordinates.length; c++) {
      var coordinate = coordinates[c];

      if (feature.geometry.type === 'Polygon') {
        coordinates[c] = decodePolygon(coordinate, encodeOffsets[c]);
      } else if (feature.geometry.type === 'MultiPolygon') {
        for (var c2 = 0; c2 < coordinate.length; c2++) {
          var polygon = coordinate[c2];
          coordinate[c2] = decodePolygon(polygon, encodeOffsets[c][c2]);
        }
      }
    }
  } // Has been decoded


  geoData.UTF8Encoding = false;
  return geoData;
};

var decodePolygon = function decodePolygon(coordinate, encodeOffsets) {
  var result = [];
  var prevX = encodeOffsets[0];
  var prevY = encodeOffsets[1];

  for (var i = 0; i < coordinate.length; i += 2) {
    var x = coordinate.charCodeAt(i) - 64;
    var y = coordinate.charCodeAt(i + 1) - 64; // ZigZag decoding

    x = x >> 1 ^ -(x & 1);
    y = y >> 1 ^ -(y & 1); // Delta deocding

    x += prevX;
    y += prevY;
    prevX = x;
    prevY = y; // Dequantize

    result.push([x / 1024, y / 1024]);
  }

  return result;
};