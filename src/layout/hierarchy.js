import rebind from "./utils/rebind";
import arrays from "./utils/arrays";


var Hierarchy = function () {
    var sort = layout_hierarchySort,
        children = layout_hierarchyChildren,
        value = layout_hierarchyValue;

    function hierarchy(root) {
        var stack = [root],
            nodes = [],
            node;

        root.depth = 0;

        while ((node = stack.pop()) != null) {
            nodes.push(node);
            if ((childs = children.call(hierarchy, node, node.depth)) && (n = childs.length)) {
                var n, childs, child;
                while (--n >= 0) {
                    stack.push(child = childs[n]);
                    child.parent = node;
                    child.depth = node.depth + 1;
                }
                if (value) node.value = 0;
                node.children = childs;
            } else {
                if (value) node.value = +value.call(hierarchy, node, node.depth) || 0;
                delete node.children;
            }
        }

        layout_hierarchyVisitAfter(root, function (node) {
            var childs, parent;
            if (sort && (childs = node.children)) childs.sort(sort);
            if (value && (parent = node.parent)) parent.value += node.value;
        });

        return nodes;
    }

    hierarchy.sort = function (x) {
        if (!arguments.length) return sort;
        sort = x;
        return hierarchy;
    };

    hierarchy.children = function (x) {
        if (!arguments.length) return children;
        children = x;
        return hierarchy;
    };

    hierarchy.value = function (x) {
        if (!arguments.length) return value;
        value = x;
        return hierarchy;
    };

    // Re-evaluates the `value` property for the specified hierarchy.
    hierarchy.revalue = function (root) {
        if (value) {
            layout_hierarchyVisitBefore(root, function (node) {
                if (node.children) node.value = 0;
            });
            layout_hierarchyVisitAfter(root, function (node) {
                var parent;
                if (!node.children) node.value = +value.call(hierarchy, node, node.depth) || 0;
                if (parent = node.parent) parent.value += node.value;
            });
        }
        return root;
    };

    return hierarchy;
}

Hierarchy.layout_hierarchyRebind = function (object, hierarchy) {
    rebind(object, hierarchy, "sort", "children", "value");

    object.nodes = object;
    object.links = layout_hierarchyLinks;

    return object;
}

function layout_hierarchyVisitBefore(node, callback) {
    var nodes = [node];
    while ((node = nodes.pop()) != null) {
        callback(node);
        if ((children = node.children) && (n = children.length)) {
            var n, children;
            while (--n >= 0) nodes.push(children[n]);
        }
    }
}

function layout_hierarchyVisitAfter(node, callback) {
    var nodes = [node], nodes2 = [];
    while ((node = nodes.pop()) != null) {
        nodes2.push(node);
        if ((children = node.children) && (n = children.length)) {
            var i = -1, n, children;
            while (++i < n) nodes.push(children[i]);
        }
    }
    while ((node = nodes2.pop()) != null) {
        callback(node);
    }
}

function layout_hierarchyChildren(d) {
    return d.children;
}

function layout_hierarchyValue(d) {
    return d.value;
}

function layout_hierarchySort(a, b) {
    return b.value - a.value;
}

function layout_hierarchyLinks(nodes) {
    return arrays.merge(nodes.map(function (parent) {
        return (parent.children || []).map(function (child) {
            return { source: parent, target: child };
        });
    }));
}

export default Hierarchy;