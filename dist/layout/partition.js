"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./hierarchy"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./hierarchy"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.hierarchy);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _hierarchy) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function () {
    var hierarchy = (0, _hierarchy2["default"])(),
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

    return _hierarchy2["default"].layout_hierarchyRebind(partition, hierarchy);
  };

  var _hierarchy2 = _interopRequireDefault(_hierarchy);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }
});