"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./intersect", "./grid", "./format", "./convex"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./intersect"), require("./grid"), require("./format"), require("./convex"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.intersect, global.grid, global.format, global.convex);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _intersect2, _grid, _format, _convex) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _intersect3 = _interopRequireDefault(_intersect2);

  var _grid2 = _interopRequireDefault(_grid);

  var _format2 = _interopRequireDefault(_format);

  var _convex2 = _interopRequireDefault(_convex);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /*
   (c) 2014-2019, Andrii Heonia
   Hull.js, a JavaScript library for concave hull generation by set of points.
   https://github.com/AndriiHeonia/hull
  */
  function _filterDuplicates(pointset) {
    var unique = [pointset[0]];
    var lastPoint = pointset[0];

    for (var i = 1; i < pointset.length; i++) {
      var currentPoint = pointset[i];

      if (lastPoint[0] !== currentPoint[0] || lastPoint[1] !== currentPoint[1]) {
        unique.push(currentPoint);
      }

      lastPoint = currentPoint;
    }

    return unique;
  }

  function _sortByX(pointset) {
    return pointset.sort(function (a, b) {
      return a[0] - b[0] || a[1] - b[1];
    });
  }

  function _sqLength(a, b) {
    return Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2);
  }

  function _cos(o, a, b) {
    var aShifted = [a[0] - o[0], a[1] - o[1]],
        bShifted = [b[0] - o[0], b[1] - o[1]],
        sqALen = _sqLength(o, a),
        sqBLen = _sqLength(o, b),
        dot = aShifted[0] * bShifted[0] + aShifted[1] * bShifted[1];

    return dot / Math.sqrt(sqALen * sqBLen);
  }

  function _intersect(segment, pointset) {
    for (var i = 0; i < pointset.length - 1; i++) {
      var seg = [pointset[i], pointset[i + 1]];

      if (segment[0][0] === seg[0][0] && segment[0][1] === seg[0][1] || segment[0][0] === seg[1][0] && segment[0][1] === seg[1][1]) {
        continue;
      }

      if ((0, _intersect3["default"])(segment, seg)) {
        return true;
      }
    }

    return false;
  }

  function _occupiedArea(pointset) {
    var minX = Infinity;
    var minY = Infinity;
    var maxX = -Infinity;
    var maxY = -Infinity;

    for (var i = pointset.length - 1; i >= 0; i--) {
      if (pointset[i][0] < minX) {
        minX = pointset[i][0];
      }

      if (pointset[i][1] < minY) {
        minY = pointset[i][1];
      }

      if (pointset[i][0] > maxX) {
        maxX = pointset[i][0];
      }

      if (pointset[i][1] > maxY) {
        maxY = pointset[i][1];
      }
    }

    return [maxX - minX, // width
    maxY - minY // height
    ];
  }

  function _bBoxAround(edge) {
    return [Math.min(edge[0][0], edge[1][0]), // left
    Math.min(edge[0][1], edge[1][1]), // top
    Math.max(edge[0][0], edge[1][0]), // right
    Math.max(edge[0][1], edge[1][1]) // bottom
    ];
  }

  function _midPoint(edge, innerPoints, convex) {
    var point = null,
        angle1Cos = MAX_CONCAVE_ANGLE_COS,
        angle2Cos = MAX_CONCAVE_ANGLE_COS,
        a1Cos,
        a2Cos;

    for (var i = 0; i < innerPoints.length; i++) {
      a1Cos = _cos(edge[0], edge[1], innerPoints[i]);
      a2Cos = _cos(edge[1], edge[0], innerPoints[i]);

      if (a1Cos > angle1Cos && a2Cos > angle2Cos && !_intersect([edge[0], innerPoints[i]], convex) && !_intersect([edge[1], innerPoints[i]], convex)) {
        angle1Cos = a1Cos;
        angle2Cos = a2Cos;
        point = innerPoints[i];
      }
    }

    return point;
  }

  function _concave(convex, maxSqEdgeLen, maxSearchArea, grid, edgeSkipList) {
    var midPointInserted = false;

    for (var i = 0; i < convex.length - 1; i++) {
      var edge = [convex[i], convex[i + 1]]; // generate a key in the format X0,Y0,X1,Y1

      var keyInSkipList = edge[0][0] + ',' + edge[0][1] + ',' + edge[1][0] + ',' + edge[1][1];

      if (_sqLength(edge[0], edge[1]) < maxSqEdgeLen || edgeSkipList.has(keyInSkipList)) {
        continue;
      }

      var scaleFactor = 0;

      var bBoxAround = _bBoxAround(edge);

      var bBoxWidth = void 0;
      var bBoxHeight = void 0;
      var midPoint = void 0;

      do {
        bBoxAround = grid.extendBbox(bBoxAround, scaleFactor);
        bBoxWidth = bBoxAround[2] - bBoxAround[0];
        bBoxHeight = bBoxAround[3] - bBoxAround[1];
        midPoint = _midPoint(edge, grid.rangePoints(bBoxAround), convex);
        scaleFactor++;
      } while (midPoint === null && (maxSearchArea[0] > bBoxWidth || maxSearchArea[1] > bBoxHeight));

      if (bBoxWidth >= maxSearchArea[0] && bBoxHeight >= maxSearchArea[1]) {
        edgeSkipList.add(keyInSkipList);
      }

      if (midPoint !== null) {
        convex.splice(i + 1, 0, midPoint);
        grid.removePoint(midPoint);
        midPointInserted = true;
      }
    }

    if (midPointInserted) {
      return _concave(convex, maxSqEdgeLen, maxSearchArea, grid, edgeSkipList);
    }

    return convex;
  }

  function hull(pointset, concavity, format) {
    var maxEdgeLen = concavity || 20;

    var points = _filterDuplicates(_sortByX(_format2["default"].toXy(pointset, format)));

    if (points.length < 4) {
      return points.concat([points[0]]);
    }

    var occupiedArea = _occupiedArea(points);

    var maxSearchArea = [occupiedArea[0] * MAX_SEARCH_BBOX_SIZE_PERCENT, occupiedArea[1] * MAX_SEARCH_BBOX_SIZE_PERCENT];
    var convex = (0, _convex2["default"])(points);
    var innerPoints = points.filter(function (pt) {
      return convex.indexOf(pt) < 0;
    });
    var cellSize = Math.ceil(1 / (points.length / (occupiedArea[0] * occupiedArea[1])));

    var concave = _concave(convex, Math.pow(maxEdgeLen, 2), maxSearchArea, (0, _grid2["default"])(innerPoints, cellSize), new Set());

    if (format) {
      return _format2["default"].fromXy(concave, format);
    } else {
      return concave;
    }
  }

  var MAX_CONCAVE_ANGLE_COS = Math.cos(90 / (180 / Math.PI)); // angle = 90 deg

  var MAX_SEARCH_BBOX_SIZE_PERCENT = 0.6;
  exports["default"] = hull;
});