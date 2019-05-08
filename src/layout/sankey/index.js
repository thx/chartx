import { _ } from "mmvis"
export default function() {
    var sankey = {},
        nodeWidth = 24,
        nodePadding = 8,
        size = [1, 1],
        nodes = [],
        sort = function(a, b) {
            return a.y - b.y;
        },
        // sort = function(a, b) {
        //     return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
        // },
        links = [];

    sankey.nodeWidth = function (_) {
        if (!arguments.length) return nodeWidth;
        nodeWidth = +_;
        return sankey;
    };

    sankey.nodeSort = function (_) {
        if (!arguments.length) return sort;
        sort = _;
        return sankey;
    };

    sankey.nodePadding = function (_) {
        if (!arguments.length) return nodePadding;
        nodePadding = +_;
        return sankey;
    };

    sankey.nodes = function (_) {
        if (!arguments.length) return nodes;
        nodes = _;
        return sankey;
    };

    sankey.links = function (_) {
        if (!arguments.length) return links;
        links = _;
        return sankey;
    };

    sankey.size = function (_) {
        if (!arguments.length) return size;
        size = _;
        return sankey;
    };

    sankey.layout = function (iterations) {
        computeNodeLinks();
        computeNodeValues();
        computeNodeBreadths();
        computeNodeDepths(iterations);
        computeLinkDepths();
        return sankey;
    };

    sankey.relayout = function () {
        computeLinkDepths();
        return sankey;
    };

    //d3
    function d3_interpolateNumber(a, b) {
        a = +a, b = +b;
        return function (t) {
            return a * (1 - t) + b * t;
        };
    }

    sankey.link = function () {
        var curvature = .5;

        function link(d) {
            var x0 = d.source.x + d.source.dx,
                x1 = d.target.x,
                xi = d3_interpolateNumber(x0, x1),
                x2 = xi(curvature),
                x3 = xi(1 - curvature),
                //y0 = d.source.y + d.sy + d.dy / 2,
                //y1 = d.target.y + d.ty + d.dy / 2;
                y0 = d.source.y + d.sy,
                y1 = d.target.y + d.ty;
                
            var dy = d.dy;
            if( dy < 1 ){
                dy = 1;
            };

            var path = "M" + x0 + "," + y0 + "C" + x2 + "," + y0 + " " + x3 + "," + y1 + " " + x1 + "," + y1;

            path += "v"+dy;
            path += "C"+x3+","+(y1+dy)+" "+x2+","+(y0+dy)+" "+x0+","+(y0+dy);
            path += "v"+(-dy)+"z";
            return path;
          
        }

        link.curvature = function (_) {
            if (!arguments.length) return curvature;
            curvature = +_;
            return link;
        };

        return link;
    };

    // Populate the sourceLinks and targetLinks for each node.
    // Also, if the source and target are not objects, assume they are indices.
    function computeNodeLinks() {
        nodes.forEach(function (node) {
            node.sourceLinks = [];
            node.targetLinks = [];
        });
        links.forEach(function (link) {
            var source = link.source,
                target = link.target;
            if (typeof source === "number") source = link.source = nodes[link.source];
            if (typeof target === "number") target = link.target = nodes[link.target];
            source.sourceLinks.push(link);
            target.targetLinks.push(link);
        });
    }

    function d3_sum(e, t) {
        var n = 0,
            r = e.length,
            i, s = -1;
        if (arguments.length === 1)
            while (++s < r)
                isNaN(i = +e[s]) || (n += i);
        else
            while (++s < r)
                isNaN(i = +t.call(e, e[s], s)) || (n += i);
        return n
    }

    function d3_min(e, t) {
        var n = -1,
            r = e.length,
            i, s;
        if (arguments.length === 1) {
            while (++n < r && ((i = e[n]) == null || i != i))
                i = undefined;
            while (++n < r)
                (s = e[n]) != null && i > s && (i = s)
        } else {
            while (++n < r && ((i = t.call(e, e[n], n)) == null || i != i))
                i = undefined;
            while (++n < r)
                (s = t.call(e, e[n], n)) != null && i > s && (i = s)
        }
        return i
    }

    function d3_max(e, t) {
        var n = -1,
            r = e.length,
            i, s;
        if (arguments.length === 1) {
            while (++n < r && ((i = e[n]) == null || i != i))
                i = undefined;
            while (++n < r)
                (s = e[n]) != null && s > i && (i = s)
        } else {
            while (++n < r && ((i = t.call(e, e[n], n)) == null || i != i))
                i = undefined;
            while (++n < r)
                (s = t.call(e, e[n], n)) != null && s > i && (i = s)
        }
        return i
    }

    // Compute the value (size) of each node by summing the associated links.
    function computeNodeValues() {
        nodes.forEach(function (node) {
            node.value = Math.max(
                d3_sum(node.sourceLinks, value),
                d3_sum(node.targetLinks, value)
            );
        });
    }

    // Iteratively assign the breadth (x-position) for each node.
    // Nodes are assigned the maximum breadth of incoming neighbors plus one;
    // nodes with no incoming links are assigned breadth zero, while
    // nodes with no outgoing links are assigned the maximum breadth.
    function computeNodeBreadths() {
        var remainingNodes = nodes,
            nextNodes,
            x = 0;

        while (remainingNodes.length) {
            nextNodes = [];
            remainingNodes.forEach(function (node) {
                node.x = x;
                node.dx = nodeWidth;
                node.sourceLinks.forEach(function (link) {
                    if (nextNodes.indexOf(link.target) < 0) {
                        nextNodes.push(link.target);
                    }
                });
            });
            remainingNodes = nextNodes;
            ++x;
        }

        //
        moveSinksRight(x);
        scaleNodeBreadths((size[0] - nodeWidth) / (x - 1));
    }

    function moveSourcesRight() {
        nodes.forEach(function (node) {
            if (!node.targetLinks.length) {
                node.x = d3_min(node.sourceLinks, function (d) {
                    return d.target.x;
                }) - 1;
            }
        });
    }

    function moveSinksRight(x) {
        nodes.forEach(function (node) {
            if (!node.sourceLinks.length) {
                node.x = x - 1;
            }
        });
    }

    function scaleNodeBreadths(kx) {
        nodes.forEach(function (node) {
            node.x *= kx;
        });
    }



    //d3 core
    function d3_class(ctor, properties) {
        if (Object.defineProperty) {
            for (var key in properties) {
                //TODO:d3这里不支持ie，要想办法解决
                Object.defineProperty(ctor.prototype, key, {
                    value: properties[key],
                    enumerable: false
                });
            }
        } else {
            //ie解决方案
            _.extend(ctor.prototype, properties);
        }
    }

    var d3_nest = function () {
        var nest = {},
            keys = [],
            sortKeys = [],
            sortValues,
            rollup;

        function map(mapType, array, depth) {
            
            if (depth >= keys.length) return rollup ? rollup.call(nest, array) : (sortValues ? array.sort(sortValues) : array);

            var i = -1,
                n = array.length,
                key = keys[depth++],
                keyValue,
                object,
                setter,
                valuesByKey = new d3_Map,
                values;

            while (++i < n) {
                if (values = valuesByKey.get(keyValue = key(object = array[i]))) {
                    values.push(object);
                } else {
                    valuesByKey.set(keyValue, [object]);
                }
            }

            if (mapType) {
                object = mapType();
                setter = function (keyValue, values) {
                    object.set(keyValue, map(mapType, values, depth));
                };
            } else {
                object = {};
                setter = function (keyValue, values) {
                    object[keyValue] = map(mapType, values, depth);
                };
            }

            valuesByKey.forEach(setter);
            return object;
        }

        function entries(map, depth) {
            if (depth >= keys.length) return map;

            var array = [],
                sortKey = sortKeys[depth++];

            map.forEach(function (key, keyMap) {
                array.push({
                    key: key,
                    values: entries(keyMap, depth)
                });
            });

            return sortKey ? array.sort(function (a, b) {
                return sortKey(a.key, b.key);
            }) : array;
        }

        nest.map = function (array, mapType) {
            return map(mapType, array, 0);
        };

        nest.entries = function (array) {
            return entries(map(d3_map, array, 0), 0);
        };

        nest.key = function (d) {
            keys.push(d);
            return nest;
        };

        // Specifies the order for the most-recently specified key.
        // Note: only applies to entries. Map keys are unordered!
        nest.sortKeys = function (order) {
            sortKeys[keys.length - 1] = order;
            return nest;
        };

        // Specifies the order for leaf values.
        // Applies to both maps and entries array.
        nest.sortValues = function (order) {
            sortValues = order;
            return nest;
        };

        nest.rollup = function (f) {
            rollup = f;
            return nest;
        };

        return nest;
    };

    var d3_map = function (object, f) {
        var map = new d3_Map;
        if (object instanceof d3_Map) {
            object.forEach(function (key, value) {
                map.set(key, value);
            });
        } else if (Array.isArray(object)) {
            var i = -1,
                n = object.length,
                o;
            if (arguments.length === 1)
                while (++i < n) map.set(i, object[i]);
            else
                while (++i < n) map.set(f.call(object, o = object[i], i), o);
        } else {
            for (var key in object) map.set(key, object[key]);
        }
        return map;
    };

    function d3_Map() {
        this._ = Object.create(null);
    }

    var d3_map_proto = "__proto__", d3_map_zero = "\0";

    d3_class(d3_Map, {
        has: d3_map_has,
        get: function (key) {
            return this._[d3_map_escape(key)];
        },
        set: function (key, value) {
            return this._[d3_map_escape(key)] = value;
        },
        remove: d3_map_remove,
        keys: d3_map_keys,
        values: function () {
            var values = [];
            for (var key in this._) values.push(this._[key]);
            return values;
        },
        entries: function () {
            var entries = [];
            for (var key in this._) entries.push({
                key: d3_map_unescape(key),
                value: this._[key]
            });
            return entries;
        },
        size: d3_map_size,
        empty: d3_map_empty,
        forEach: function (f) {
            for (var key in this._) f.call(this, d3_map_unescape(key), this._[key]);
        }
    });

    function d3_map_escape(key) {
        return (key += "") === d3_map_proto || key[0] === d3_map_zero ? d3_map_zero + key : key;
    }

    function d3_map_unescape(key) {
        return (key += "")[0] === d3_map_zero ? key.slice(1) : key;
    }

    function d3_map_has(key) {
        return d3_map_escape(key) in this._;
    }

    function d3_map_remove(key) {
        return (key = d3_map_escape(key)) in this._ && delete this._[key];
    }

    function d3_map_keys() {
        var keys = [];
        for (var key in this._) keys.push(d3_map_unescape(key));
        return keys;
    }

    function d3_map_size() {
        var size = 0;
        for (var key in this._)++size;
        return size;
    }

    function d3_map_empty() {
        for (var key in this._) return false;
        return true;
    }

    function d3_sortKey(a, b) {
        return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }

    function computeNodeDepths(iterations) {
        
        var nodesByBreadth = d3_nest()
            .key(function (d) {
                return d.x;
            })
            .sortKeys( d3_sortKey )
            .entries(nodes)
            .map(function (d) {
                return d.values;
            });

        //
        initializeNodeDepth();
        resolveCollisions();
        for (var alpha = 1; iterations > 0; --iterations) {
            relaxRightToLeft(alpha *= .99);
            resolveCollisions();
            relaxLeftToRight(alpha);
            resolveCollisions();
        }

        function initializeNodeDepth() {
            var ky = d3_min(nodesByBreadth, function (nodes) {
                return (size[1] - (nodes.length - 1) * nodePadding) / d3_sum(nodes, value);
            });

            nodesByBreadth.forEach(function (nodes) {
                nodes.forEach(function (node, i) {
                    node.y = i;
                    node.dy = node.value * ky;
                });
            });

            links.forEach(function (link) {
                link.dy = link.value * ky;
            });
        }

        function relaxLeftToRight(alpha) {
            nodesByBreadth.forEach(function (nodes, breadth) {
                nodes.forEach(function (node) {
                    if (node.targetLinks.length) {
                        var y = d3_sum(node.targetLinks, weightedSource) / d3_sum(node.targetLinks, value);
                        node.y += (y - center(node)) * alpha;
                    }
                });
            });

            function weightedSource(link) {
                return center(link.source) * link.value;
            }
        }

        function relaxRightToLeft(alpha) {
            nodesByBreadth.slice().reverse().forEach(function (nodes) {
                nodes.forEach(function (node) {
                    if (node.sourceLinks.length) {
                        var y = d3_sum(node.sourceLinks, weightedTarget) / d3_sum(node.sourceLinks, value);
                        node.y += (y - center(node)) * alpha;
                    }
                });
            });

            function weightedTarget(link) {
                return center(link.target) * link.value;
            }
        }

        function resolveCollisions() {
            nodesByBreadth.forEach(function (nodes) {
                var node,
                    dy,
                    y0 = 0,
                    n = nodes.length,
                    i;

                // Push any overlapping nodes down.
                sort && nodes.sort( sort );
                for (i = 0; i < n; ++i) {
                    node = nodes[i];
                    dy = y0 - node.y;
                    if (dy > 0) node.y += dy;
                    y0 = node.y + node.dy + nodePadding;
                }

                // If the bottommost node goes outside the bounds, push it back up.
                dy = y0 - nodePadding - size[1];
                if (dy > 0) {
                    y0 = node.y -= dy;

                    // Push any overlapping nodes back up.
                    for (i = n - 2; i >= 0; --i) {
                        node = nodes[i];
                        dy = node.y + node.dy + nodePadding - y0;
                        if (dy > 0) node.y -= dy;
                        y0 = node.y;
                    }
                }
            });
        }

        function ascendingDepth(a, b) {
            return a.y - b.y;
        }
    }

    function computeLinkDepths() {
        nodes.forEach(function (node) {
            node.sourceLinks.sort(ascendingTargetDepth);
            node.targetLinks.sort(ascendingSourceDepth);
        });
        nodes.forEach(function (node) {
            var sy = 0,
                ty = 0;
            node.sourceLinks.forEach(function (link) {
                link.sy = sy;
                sy += link.dy;
            });
            node.targetLinks.forEach(function (link) {
                link.ty = ty;
                ty += link.dy;
            });
        });

        function ascendingSourceDepth(a, b) {
            return a.source.y - b.source.y;
        }

        function ascendingTargetDepth(a, b) {
            return a.target.y - b.target.y;
        }
    }

    function center(node) {
        return node.y + node.dy / 2;
    }

    function value(link) {
        return link.value;
    }

    return sankey;
};
