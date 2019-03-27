function process(data) {
    var layoutOpts = this.layoutOpts || {};
    layoutOpts.nodesep = layoutOpts.nodesep || 30;
    layoutOpts.ranksep = layoutOpts.ranksep || 30;

    var customOps = this.layoutOpts && this.layoutOpts.customOps || {}
    var pageKey = customOps.nodeType && customOps.nodeType.pageKey || 'page',
        actionKey = customOps.nodeType && customOps.nodeType.actionKey || 'action',
        nodeTypeField = customOps.nodeTypeField || 'nodeType';

    var nodeMap = {}, pagesChains = [], pagesChainsMap = {},
        actionChainsMap = {}, pageCount = 0;
    var Chains = function (nodeStart, nodeEnd, edge, weight) {
        this.from = nodeStart;  //开始node
        this.to = nodeEnd;      //结束node
        this.edge = edge;       //边数据 
        this.weight = weight;   //权重
        this.actions = [];      //页面下的所有行为 

        //按照顺序添加行为
        this.addAction = function (action) {
            this.actions.push(action)
        }

        //得到行为列表
        this.getActions = function () {
            return this.actions
        }

        //根据索引得到行为
        this.getIndex = function (index) {
            return this.actions[index];
        }

        //判断改行为是否存在
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
    var ChainManage = function () {
        this.chainsMap = {};
        this.addChain = function (key, nodeStart, nodeEnd, edge, weight) {
            this.chainsMap[key] = new Chains(nodeStart, nodeEnd, edge, weight);
        };
        this.get = function (key) {
            if (key) {
                return this.chainsMap[key];
            }
            return this.chainsMap;
        };
        this.isExsit = function (key) {
            return !!this.get(key);
        }
        this.toArray = function () {
            var tempPages = [];
            for (var key in this.chainsMap) {
                var node = this.get(key);
                tempPages.push(node);
            };
            //按照权重排序
            tempPages.sort(function (a, b) {
                return a.weight < b.weight;
            });
            return tempPages;
        };
        //按照节点顺序返回链
        this.getChains = function (tempPages) {
            var pagesChains = [];
            var tempPages = this.toArray();
            for (var i = 0, len = tempPages.length; i < len; i++) {
                var nodes = tempPages[i];
                if (i === 0) {
                    pagesChains.push(nodes.from, nodes.to);
                } else {
                    if (pagesChains.indexOf(nodes.from) == -1) {
                        pagesChains.push(nodes.from);
                    }
                    if (pagesChains.indexOf(nodes.to) == -1) {
                        pagesChains.push(nodes.to);
                    }
                }
            }
            return pagesChains;
        }

    }
    var eachEdge = function (edges, fn) {
        for (var i = 0, len = edges.length; i < len; i++) {
            var edge = edges[i];
            var nodeStart = nodeMap[edge.key[0]];
            var nodeEnd = nodeMap[edge.key[1]];
            fn(edge, nodeStart, nodeEnd, i);
        }
    }
    var getNodeTypeRelation = function (start, end) {
        var nodeTypeStart = start.rowData[nodeTypeField];
        var nodeTypeEnd = end.rowData[nodeTypeField];
        if (nodeTypeStart === pageKey && nodeTypeEnd === pageKey) {
            return pageKey
        } else if (nodeTypeStart === pageKey && nodeTypeEnd === actionKey) {
            return [pageKey, actionKey].join('+');
        }
        return actionKey
    }

    //将数组转换为对象
    for (var i = 0, len = data.nodes.length; i < len; i++) {
        var node = data.nodes[i];
        if (node.rowData[nodeTypeField] === pageKey) {
            pageCount++;
        }
        nodeMap[node.key] = node;
    }


    pagesChainsMap = new ChainManage();
    //按照页面的连线顺序整理页面NODE
    while (pageCount--) {
        eachEdge(data.edges, function (edge, nodeStart, nodeEnd, i) {
            if (nodeStart && nodeEnd) {
                if (getNodeTypeRelation(nodeStart, nodeEnd) === pageKey) {
                    if (!pagesChainsMap.isExsit(nodeStart.key) && !pagesChainsMap.isExsit(nodeEnd.key)) {
                        pagesChainsMap.addChain(nodeStart.key, nodeStart, nodeEnd, edge, 0);
                        pagesChainsMap.addChain(nodeEnd.key, nodeStart, nodeEnd, edge, 1);
                    } else if (pagesChainsMap.isExsit(nodeStart.key)) {
                        var weight = pagesChainsMap.get(nodeStart.key).weight + 1;
                        pagesChainsMap.addChain(nodeEnd.key, nodeStart, nodeEnd, edge, weight);
                    } else if (pagesChainsMap.isExsit(nodeEnd.key)) {
                        var weight = pagesChainsMap.get(nodeEnd.key).weight - 1;
                        pagesChainsMap.addChain(nodeStart.key, nodeStart, nodeEnd, edge, weight);
                    }
                }

            }
        })
    }

    pagesChains = pagesChainsMap.getChains();

    //整理每个页面对应的行为链
    actionChainsMap = new ChainManage();
    eachEdge(data.edges, function (edge, nodeStart, nodeEnd, i) {
        if (nodeStart && nodeEnd) {
            var nodeType = [pageKey, actionKey].join('+');
            if (getNodeTypeRelation(nodeStart, nodeEnd) === nodeType) {
                if (!actionChainsMap.isExsit(nodeStart.key)) {
                    actionChainsMap.addChain(nodeStart.key, nodeStart, nodeEnd, edge, 0);
                    actionChainsMap.get(nodeStart.key).addAction(nodeEnd);
                }
            }
        }
    });

    for (var key in actionChainsMap.get()) {
        var chains = actionChainsMap.get(key);
        var isFind = true;
        var key = chains.to && chains.to.key;
        while (isFind) {
            var results = [];
            eachEdge(data.edges, function (edge, nodeStart, nodeEnd, i) {
                if (key === nodeStart.key && !chains.isExsit(nodeEnd)) {
                    chains.addAction(nodeEnd)
                    key = nodeEnd.key;
                } else {
                    results.push(false);
                }
            })
            if (results.length === data.edges.length) {
                isFind = false;
            }
        }
    }
    //开始计算位置
    var maxHeight = 0;
    //第一行页面,节点的位置需要是节点的中心点
    for (var i = 0, len = pagesChains.length; i < len; i++) {
        var node = pagesChains[i];
        maxHeight = Math.max(maxHeight, (node.height || 0));
    }
    for (var i = 0, len = pagesChains.length; i < len; i++) {
        var node = pagesChains[i];
        // node.y = (maxHeight - (node.height || 0)) * 0.5;
        node.y = maxHeight * 0.5;
    }
    data.size.height += maxHeight;
    //每一列的宽带
    var maxWidth = [];
    for (var i = 0, len = pagesChains.length; i < len; i++) {
        var node = pagesChains[i];
        var actionMap = actionChainsMap.get(node.key);
        var list = actionMap ? actionChainsMap.get(node.key).getActions() : [];
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
            node.x = distance + maxWidth[i] * 0.5 + i * layoutOpts.nodesep
        }
        data.size.width += maxWidth[i] + layoutOpts.nodesep;
    }
    //每一行出第一行
    var actionChainsMax = 0;
    var maxHeight = [data.size.height];
    for (var key in actionChainsMap.get()) {
        var actionChain = actionChainsMap.get(key);
        actionChainsMax = Math.max(actionChain.getActions().length);
    }
    for (var i = 1, ilen = actionChainsMax; i < ilen; i++) {
        var list = [];
        for (var j = 0, len = pagesChains.length; j < len; j++) {
            var node = pagesChains[j];
            var actionMap = actionChainsMap.get(node.key);
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
            node.y = distance + maxHeight[i] * 0.5 + i * layoutOpts.ranksep
        }
        if (list.length > 0) {
            data.size.height += maxHeight[i] + layoutOpts.ranksep;
        }

    }

    //edge points 位置 线条上的文字位置根据实际需求再加
    eachEdge(data.edges, function (edge, nodeStart, nodeEnd, index) {
        var start, control, end;
        edge.points = [];
        if (getNodeTypeRelation(nodeStart, nodeEnd) === pageKey) {
            //画横向箭头
            start = {
                x: nodeStart.x + nodeStart.width * 0.5,
                y: nodeStart.y
            };
            end = {
                x: nodeEnd.x - nodeEnd.width * 0.5,
                y: nodeEnd.y
            };

            control = {
                x: (start.x + end.x) * 0.5,
                y: (start.y + end.y) * 0.5,
            }
        } else {
            //画纵向箭头
            start = {
                x: nodeStart.x,
                y: nodeStart.y + nodeStart.height * 0.5
            };
            end = {
                x: nodeEnd.x,
                y: nodeEnd.y - nodeEnd.height * 0.5
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
    });

    //console.log(data);
    nodeMap = null; pagesChains = null; pagesChainsMap = null;
    actionChainsMap = null;
    return data
}
console.time('start');
process(data);
console.timeEnd('start');