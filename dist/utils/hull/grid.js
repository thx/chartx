"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.undefined = mod.exports;
  }
})(void 0, function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function Grid(points, cellSize) {
    this._cells = [];
    this._cellSize = cellSize;
    this._reverseCellSize = 1 / cellSize;

    for (var i = 0; i < points.length; i++) {
      var point = points[i];
      var x = this.coordToCellNum(point[0]);
      var y = this.coordToCellNum(point[1]);

      if (!this._cells[x]) {
        var array = [];
        array[y] = [point];
        this._cells[x] = array;
      } else if (!this._cells[x][y]) {
        this._cells[x][y] = [point];
      } else {
        this._cells[x][y].push(point);
      }
    }
  }

  Grid.prototype = {
    cellPoints: function cellPoints(x, y) {
      // (Number, Number) -> Array
      return this._cells[x] !== undefined && this._cells[x][y] !== undefined ? this._cells[x][y] : [];
    },
    rangePoints: function rangePoints(bbox) {
      // (Array) -> Array
      var tlCellX = this.coordToCellNum(bbox[0]);
      var tlCellY = this.coordToCellNum(bbox[1]);
      var brCellX = this.coordToCellNum(bbox[2]);
      var brCellY = this.coordToCellNum(bbox[3]);
      var points = [];

      for (var x = tlCellX; x <= brCellX; x++) {
        for (var y = tlCellY; y <= brCellY; y++) {
          Array.prototype.push.apply(points, this.cellPoints(x, y));
        }
      }

      return points;
    },
    removePoint: function removePoint(point) {
      // (Array) -> Array
      var cellX = this.coordToCellNum(point[0]);
      var cellY = this.coordToCellNum(point[1]);
      var cell = this._cells[cellX][cellY];
      var pointIdxInCell;

      for (var i = 0; i < cell.length; i++) {
        if (cell[i][0] === point[0] && cell[i][1] === point[1]) {
          pointIdxInCell = i;
          break;
        }
      }

      cell.splice(pointIdxInCell, 1);
      return cell;
    },
    trunc: Math.trunc || function (val) {
      // (number) -> number
      return val - val % 1;
    },
    coordToCellNum: function coordToCellNum(x) {
      // (number) -> number
      return this.trunc(x * this._reverseCellSize);
    },
    extendBbox: function extendBbox(bbox, scaleFactor) {
      // (Array, Number) -> Array
      return [bbox[0] - scaleFactor * this._cellSize, bbox[1] - scaleFactor * this._cellSize, bbox[2] + scaleFactor * this._cellSize, bbox[3] + scaleFactor * this._cellSize];
    }
  };

  function grid(points, cellSize) {
    return new Grid(points, cellSize);
  }

  exports["default"] = grid;
});