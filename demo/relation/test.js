function process(data) {
    var layoutOpts = this.layoutOpts && this.layoutOpts.graph || {};
    layoutOpts.nodesep = layoutOpts.nodesep || 50;
    layoutOpts.ranksep = layoutOpts.ranksep || 50;

    var customOps = this.layoutOpts && this.layoutOpts.customOps || {
        nodeTypeField: 'nodeType',
        nodeType: {
            pageKey: 'page',    //页面节点
            actionKey: 'action'  //行为节点 
        }
    }
    var pageKey = customOps.nodeType.pageKey,
        actionKey = customOps.nodeType.actionKey,
        nodeTypeField = customOps.nodeTypeField;
    var pages = [], actions = [], nodeMap = {};
    var pagesChains = [], pagesChainsMap = {}, tempPages = [];
    var actionChains = [], actionChainsMap = {};
    var Chains = function (nodeStart, nodeEnd, edge, weight) {
        this.from = nodeStart;
        this.to = nodeEnd;
        this.edge = edge;
        this.weight = weight;
        this.actions = [];
        this.addAction = function (action) {
            this.actions.push(action)
        }
        this.getActions = function () {
            return this.actions
        }
        this.getIndex = function (index) {
            return this.actions[index];
        }
        this.isExsit = function (action) {
            var result = false;
            for (var t = 0, len = this.actions.length; t < len; t++) {
                if (this.actions[t] === action) {
                    result = true;
                    break;
                }
            }
            return result;
        }

    };

    if (layoutOpts.customOps) {
        if (layoutOpts.customOps.nodeType) {
            pageKey = layoutOpts.customOps.nodeType.pageKey || 'page';
            actionKey = layoutOpts.customOps.nodeType.actionKey || 'action';
        }
        nodeTypeField = layoutOpts.customOps.nodeTypeField || 'nodeType'
    }

    for (var i = 0, len = data.nodes.length; i < len; i++) {
        var node = data.nodes[i];
        if (node[nodeTypeField] === pageKey) {
            pages.push(node);
        }
        if (node[nodeTypeField] === actionKey) {
            actions.push(node);
        }
        nodeMap[node.key] = node;
    }
    //按照页面的连线顺序整理页面NODE
    for (var t = 0; t < 2; t++) {
        for (var i = 0, len = data.edges.length; i < len; i++) {
            var edge = data.edges[i];
            var nodeStart = nodeMap[edge.key[0]];
            var nodeEnd = nodeMap[edge.key[1]];
            if (nodeStart && nodeEnd) {
                if (nodeStart[nodeTypeField] === pageKey && nodeEnd[nodeTypeField] === pageKey) {
                    if (!pagesChainsMap[nodeStart.key] && !pagesChainsMap[nodeEnd.key]) {
                        pagesChainsMap[nodeStart.key] = new Chains(nodeStart, nodeEnd, edge, 0);
                        pagesChainsMap[nodeEnd.key] = new Chains(nodeStart, nodeEnd, edge, 1);
                    } else if (pagesChainsMap[nodeStart.key]) {
                        pagesChainsMap[nodeEnd.key] = new Chains(nodeStart, nodeEnd, edge, pagesChainsMap[nodeStart.key].weight + 1);

                    } else if (pagesChainsMap[nodeEnd.key]) {
                        pagesChainsMap[nodeStart.key] = new Chains(nodeStart, nodeEnd, edge, pagesChainsMap[nodeStart.key].weight - 1);
                    }
                }

            }
        }
    }

    for (var key in pagesChainsMap) {
        var node = pagesChainsMap[key];
        tempPages.push(node);
    }

    tempPages.sort(function (a, b) {
        return a.weight < b.weight;
    });

    for (var i = 0, len = tempPages.length; i < len; i++) {
        var nodes = tempPages[i];

        if (i === 0) {
            pagesChains.push(nodes.from, nodes.to);
        } else {
            if (pagesChains.indexOf(nodes.to) == -1) {
                pagesChains.push(nodes.to);
            }
        }
    }

    //整理每个页面对应的行为链
    for (var i = 0, len = data.edges.length; i < len; i++) {
        var edge = data.edges[i];
        var nodeStart = nodeMap[edge.key[0]];
        var nodeEnd = nodeMap[edge.key[1]];
        if (nodeStart && nodeEnd) {
            if (nodeStart[nodeTypeField] === pageKey && nodeEnd[nodeTypeField] === actionKey) {
                if (!actionChainsMap[nodeStart.key]) {
                    actionChainsMap[nodeStart.key] = new Chains(nodeStart, nodeEnd, edge, 0);
                    actionChainsMap[nodeStart.key].addAction(
                        nodeEnd
                    );
                }
            }
        }
    }
    for (var key in actionChainsMap) {
        var chains = actionChainsMap[key];
        var isFind = true;
        var key = chains.to.key;
        while (isFind) {
            var results = [];
            for (var i = 0, len = data.edges.length; i < len; i++) {
                var edge = data.edges[i];
                var nodeStart = nodeMap[edge.key[0]];
                var nodeEnd = nodeMap[edge.key[1]];
                if (key === nodeStart.key && !chains.isExsit(nodeEnd)) {
                    chains.addAction(nodeEnd)
                    key = nodeEnd.key;
                } else {
                    results.push(false);
                }
            }
            if (results.length === len) {
                isFind = false;
            }
        }
    }
    //开始计算位置
    var maxHeight = 0;
    //第一行页面
    for (var i = 0, len = pagesChains.length; i < len; i++) {
        var node = pagesChains[i];
        maxHeight = Math.max(maxHeight, (node.height || 0));
    }
    for (var i = 0, len = pagesChains.length; i < len; i++) {
        var node = pagesChains[i];
        node.y = (maxHeight - (node.height || 0)) * 0.5
    }
    data.size.height += maxHeight;
    //每一列的宽带
    var maxWidth = [];
    for (var i = 0, len = pagesChains.length; i < len; i++) {
        var node = pagesChains[i];
        var actionMap = actionChainsMap[node.key];
        var list = actionMap ? actionChainsMap[node.key].getActions() : [];
        list.unshift(node);

        for (var m = 0, ml = list.length; m < ml; m++) {
            var node = list[m];
            maxWidth[i] = Math.max((maxWidth[i] || 0), (node.width || 0));
        }
        var distance = 0;
        for (var b = 0; b < maxWidth.length - 1; b++) {
            distance += maxWidth[b];
        }
        for (var m = 0, ml = list.length; m < ml; m++) {
            var node = list[m];
            node.x = distance + (maxWidth[i] - (node.width || 0)) * 0.5 + i * layoutOpts.nodesep
        }
        data.size.width += maxWidth[i] + layoutOpts.nodesep;
    }
    //每一行出第一行
    var actionChainsMax = 0;
    var maxHeight = [data.size.height];
    for (var key in actionChainsMap) {
        var actionChain = actionChainsMap[key];
        actionChainsMax = Math.max(actionChain.getActions().length);
    }
    for (var i = 1, ilen = actionChainsMax; i < ilen; i++) {
        var list = [];
        for (var j = 0, len = pagesChains.length; j < len; j++) {
            var node = pagesChains[j];
            var actionMap = actionChainsMap[node.key];
            var actionNode = actionMap ? actionMap.getIndex(i) : null
            if (actionNode) {
                list.push(actionNode)
            }
        }

        for (var a = 0, alen = list.length; a < alen; a++) {
            var node = list[a];
            maxHeight[i] = Math.max((maxHeight[i] || 0), (node.height || 0));
        }

        var distance = 0;
        for (var b = 0; b < maxHeight.length - 1; b++) {
            distance += maxHeight[b];
        }

        for (var a = 0, len = list.length; a < len; a++) {
            var node = list[a];
            node.y = distance + (maxHeight[i] - (node.height || 0)) * 0.5 + i * layoutOpts.ranksep
        }
        if (list.length > 0) {
            data.size.height += maxHeight[i] + layoutOpts.ranksep;
        }

    }

    //edge points 位置
    for (var i = 0, len = data.edges.length; i < len; i++) {
        var edge = data.edges[i];
        var nodeStart = nodeMap[edge.key[0]];
        var nodeEnd = nodeMap[edge.key[1]];
        var start, control, end;
        edge.points = [];
        if (nodeStart[nodeTypeField] === pageKey && nodeEnd[nodeTypeField] === pageKey) {
            //画横向箭头
            start = {
                x: nodeStart.x + nodeStart.width,
                y: nodeStart.y + nodeStart.height * 0.5
            };
            end = {
                x: nodeEnd.x,
                y: nodeEnd.y + nodeEnd.height * 0.5
            };
            control = {
                x: (start.x + end.x) * 0.5,
                y: (start.y + end.y) * 0.5,
            }
        } else {
            //画纵向箭头
            start = {
                x: nodeStart.x + nodeStart.width * 0.5,
                y: nodeStart.y + nodeStart.height
            };
            end = {
                x: nodeEnd.x + nodeEnd.width * 0.5,
                y: nodeEnd.y
            };
            control = {
                x: (start.x + end.x) * 0.5,
                y: (start.y + end.y) * 0.5,
            }
        }
        edge.points.push(
            start,
            control,
            end
        )

    }

    console.log(data);

    return data
}

process(data);