"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

/**
 * @fileOverview zoom controller
 * @author litao.lt@alibaba-in.com
 * @version 1.0
 */
function _default() {
  var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var mouse = {
    x: 0,
    y: 0,
    rx: 0,
    ry: 0
  };
  var scale = opt.scale || 1;
  var scaleMin = opt.scaleMin || 1;
  var scaleMax = opt.scaleMax || 8;
  var wx = 0;
  var wy = 0;
  var sx = 0;
  var sy = 0;

  var zoomedX = function zoomedX() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    return Math.floor((x - wx) * scale + sx);
  };

  var zoomedY = function zoomedY() {
    var y = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    return Math.floor((y - wy) * scale + sy);
  };

  var zoomedX_INV = function zoomedX_INV() {
    var mouseX = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    return Math.floor((mouseX - sx) * (1 / scale) + wx);
  };

  var zoomedY_INV = function zoomedY_INV() {
    var mouseY = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    return Math.floor((mouseY - sy) * (1 / scale) + wy);
  };

  var mouseMoveTo = function mouseMoveTo(point) {
    mouse.x = point.x;
    mouse.y = point.y;
    var xx = mouse.rx;
    var yy = mouse.ry;
    mouse.rx = zoomedX_INV(mouse.x);
    mouse.ry = zoomedY_INV(mouse.y);
    return {
      xx: xx,
      yy: yy
    };
  };

  var offset = function offset(pos) {
    mouse.x += pos.x;
    mouse.y += pos.y;
    return move(mouse);
  };

  var wheel = function wheel(e, point) {
    mouseMoveTo(point);
    wx = mouse.rx; //set world origin

    wy = mouse.ry;
    sx = mouse.x; //set screen origin

    sy = mouse.y; //判断上下滚动来设置scale的逻辑

    if (e.deltaY < 0) {
      scale = Math.min(scaleMax, scale * 1.1); //zoom in
    } else {
      scale = Math.max(scaleMin, scale * (1 / 1.1)); // zoom out is inverse of zoom in
    }

    ;
    return {
      scale: scale,
      x: zoomedX(),
      y: zoomedY()
    };
  };

  var move = function move(point) {
    var _mouseMoveTo = mouseMoveTo(point),
        xx = _mouseMoveTo.xx,
        yy = _mouseMoveTo.yy;

    wx -= mouse.rx - xx;
    wy -= mouse.ry - yy;
    mouse.rx = zoomedX_INV(mouse.x);
    mouse.ry = zoomedY_INV(mouse.y);
    return {
      scale: scale,
      x: zoomedX(),
      y: zoomedY()
    };
  };

  var getZoomedPoint = function getZoomedPoint() {
    var point = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      x: 0,
      y: 0
    };
    return {
      x: zoomedX(point.x),
      y: zoomedY(point.y)
    };
  };

  this.wheel = wheel;
  this.move = move;
  this.mouseMoveTo = mouseMoveTo;
  this.offset = offset;
  this.getZoomedPoint = getZoomedPoint;
}