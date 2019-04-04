import rebind from "./utils/rebind";
import arrays from "./utils/arrays";

/**
 * 修改优化了下面 node._value的代码部分
 * 可以手动给中间节点添加value大于children的value总和的值
 * 这样，就会有流失的效果
 */


var Hierarchy = function () {
    var sort = layout_hierarchySort,
        children = layout_hierarchyChildren,
        value = layout_hierarchyValue;

    function hierarchy(app) {
        var stack = [app],
            nodes = [],
            node;

        app.depth = 0;

        while ((node = stack.pop()) != null) {
            nodes.push(node);
            if ((childs = children.call(hierarchy, node, node.depth)) && (n = childs.length)) {
                var n, childs, child;
                while (--n >= 0) {
                    stack.push(child = childs[n]);
                    child.parent = node;
                    child.depth = node.depth + 1;
                };

                //如果这个节点上面有用户主动设置value，那么以用户设置为准
                if( value ){
                    var _value = +value.call(hierarchy, node, node.depth);
                    if( _value && !isNaN(_value) ){
                        node._value = _value;
                    };
                };

                if (value) node.value = 0;
                node.children = childs;
            } else {
                if (value) node.value = +value.call(hierarchy, node, node.depth) || 0;
                delete node.children;
            }
        }

        Hierarchy.layout_hierarchyVisitAfter(app, function (node) {
            var childs, parent;
            if (sort && (childs = node.children)) childs.sort(sort);
            if (value && (parent = node.parent)) parent.value += node.value;

            if( node._value && node._value > node.value ){
                node.value = node._value;
            };
            delete node._value;

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
    hierarchy.revalue = function (app) {
        if (value) {
            Hierarchy.layout_hierarchyVisitBefore(app, function (node) {
                if (node.children) node.value = 0;
            });
            Hierarchy.layout_hierarchyVisitAfter(app, function (node) {
                var parent;
                if (!node.children) node.value = +value.call(hierarchy, node, node.depth) || 0;
                if (parent = node.parent) parent.value += node.value;

                if( node._value && node._value > node.value ){
                    node.value = node._value;
                };
                delete node._value;

            });
        }
        return app;
    };

    return hierarchy;
}

Hierarchy.layout_hierarchyRebind = function (object, hierarchy) {
    rebind(object, hierarchy, "sort", "children", "value");

    object.nodes = object;
    object.links = layout_hierarchyLinks;

    return object;
}

Hierarchy.layout_hierarchyVisitBefore = function(node, callback) {
    var nodes = [node];
    while ((node = nodes.pop()) != null) {
        callback(node);
        if ((children = node.children) && (n = children.length)) {
            var n, children;
            while (--n >= 0) nodes.push(children[n]);
        }
    }
}

Hierarchy.layout_hierarchyVisitAfter = function(node, callback) {
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