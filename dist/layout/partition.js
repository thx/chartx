"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _hierarchy = _interopRequireDefault(require("./hierarchy"));

function _default() {
  var hierarchy = (0, _hierarchy["default"])(),
      size = [1, 1];

  function position(node, x, dx, dy) {
    var children = node.children;
    node.x = x;
    node.y = node.depth * dy;
    node.dx = dx;
    node.dy = dy;

    if (children && (n = children.length)) {
      var i = -1,
          n,
          c,
          d;
      dx = node.value ? dx / node.value : 0;

      while (++i < n) {
        position(c = children[i], x, d = c.value * dx, dy);
        x += d;
      }
    }
  }

  function depth(node) {
    var children = node.children,
        d = 0;

    if (children && (n = children.length)) {
      var i = -1,
          n;

      while (++i < n) {
        d = Math.max(d, depth(children[i]));
      }
    }

    return 1 + d;
  }

  function partition(d, i) {
    var nodes = hierarchy.call(this, d, i);
    position(nodes[0], 0, size[0], size[1] / depth(nodes[0]));
    return nodes;
  }

  partition.size = function (x) {
    if (!arguments.length) return size;
    size = x;
    return partition;
  };

  return _hierarchy["default"].layout_hierarchyRebind(partition, hierarchy);
}