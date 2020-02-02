"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

function _default() {
  var mouse = {
    x: 0,
    //鼠标在画布坐标系内的x，可以理解为全局的缩放原点x
    y: 0,
    //鼠标在画布坐标系内的y，可以理解为全局的缩放原点y
    rx: 0,
    //mouse real (world) pos
    ry: 0
  }; // lazy programmers globals

  var scale = 1;
  var wx = 0; //world zoom origin

  var wy = 0;
  var sx = 0; //mouse screen pos

  var sy = 0; // converts from world coord to screen pixel coord

  var zoomedX = function zoomedX() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    // scale & origin X
    return Math.floor((x - wx) * scale + sx);
  };

  var zoomedY = function zoomedY() {
    var y = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    // scale & origin Y
    return Math.floor((y - wy) * scale + sy);
  }; // Inverse does the reverse of a calculation. Like (3 - 1) * 5 = 10   the inverse is 10 * (1/5) + 1 = 3
  // multiply become 1 over ie *5 becomes * 1/5  (or just /5)
  // Adds become subtracts and subtract become add.
  // and what is first become last and the other way round.
  // inverse function converts from screen pixel coord to world coord


  var zoomedX_INV = function zoomedX_INV() {
    var mouseX = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    // scale & origin INV
    return Math.floor((mouseX - sx) * (1 / scale) + wx);
  };

  var zoomedY_INV = function zoomedY_INV() {
    var mouseY = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    // scale & origin INV
    return Math.floor((mouseY - sy) * (1 / scale) + wy);
  };

  var mouseMoveTo = function mouseMoveTo(point) {
    mouse.x = point.x;
    mouse.y = point.y;
    var xx = mouse.rx; // get last real world pos of mouse

    var yy = mouse.ry;
    mouse.rx = zoomedX_INV(mouse.x); // get the mouse real world pos via inverse scale and translate

    mouse.ry = zoomedY_INV(mouse.y);
    return {
      xx: xx,
      yy: yy
    };
  };

  var wheel = function wheel(e, point) {
    mouseMoveTo(point);
    wx = mouse.rx; //set world origin

    wy = mouse.ry;
    sx = mouse.x; //set screen origin

    sy = mouse.y; //判断上下滚动来设置scale的逻辑

    if (e.deltaY < 0) {
      scale = Math.min(5, scale * 1.1); //zoom in
    } else {
      scale = Math.max(0.1, scale * (1 / 1.1)); // zoom out is inverse of zoom in
    }

    ;
    return {
      scale: scale,
      x: zoomedX(),
      y: zoomedY()
    };
  };

  var drag = function drag(point) {
    var _mouseMoveTo = mouseMoveTo(point),
        xx = _mouseMoveTo.xx,
        yy = _mouseMoveTo.yy;

    wx -= mouse.rx - xx; // move the world origin by the distance 

    wy -= mouse.ry - yy; // moved in world coords
    // wx wy 变了，重新计算rx ry

    mouse.rx = zoomedX_INV(mouse.x);
    mouse.ry = zoomedY_INV(mouse.y);
    return {
      scale: scale,
      x: zoomedX(),
      y: zoomedY()
    };
  }; //计算point通过zoom计算后的偏移位置新 point


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
  this.drag = drag;
  this.mouseMoveTo = mouseMoveTo;
  this.getZoomedPoint = getZoomedPoint;
}