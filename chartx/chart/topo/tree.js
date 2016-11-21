/***
 *  data 的数据结构 为 
 *  data = {
 *      "节点id" ：{
 *         width  : 46, //单行文本可选，话会在_initNodesAndLinks中计算，但是多行文本必须自己计算出size
 *         height : 31, //同上
 *         label  : "德玛西亚", 
 *         ......
 *         link   : ["盖伦","德玛西亚皇子"], //值均为节点id,必须有
 *         parent : ["亚索"] //可不传 会在_initNodesAndLinks 中计算
 *      }
 *  }
 *
 */

define(
    "chartx/chart/topo/tree", [
        "chartx/chart/index",
        "canvax/shape/Rect",
        "canvax/shape/Line",
        "canvax/shape/Path",
        "canvax/shape/Circle",
        "chartx/layout/tree/dagre",
        "canvax/animation/Tween",
        "canvax/shape/Isogon",
        "chartx/components/tips/tip"
    ],
    function(Chart, Rect, Line, Path, Circle, Dagre, Tween, Isogon , Tip) {
        var Canvax = Chart.Canvax;
        return Chart.extend({
            init: function(node, data, opts) {
                this.data = this._initData(data);
                this.graph = {
                    rankdir: "TB",
                    nodesep: 20,//同级node之间的距离
                    edgesep: 20,
                    ranksep: 30 //排与排之间的距离
                };
                this.node = {
                    //width: 60,
                    //height: 60,
                    fillStyle: "#ffffff",
                    fillNormalStyle : "#ffffff",
                    strokeStyle: "#e5e5e5",
                    strokeNormalStyle : "#e5e5e5",
                    strokeStyleHover: "#58c592",
                    labelColor: "#666",
                    labelNormalColor:"#666"
                };
                this.link = {
                    r: 4,
                    strokeStyle : "#e5e5e5"
                };

                this.arrow = {
                    enabled: true
                };

                _.deepExtend(this, opts);


                //所有node分布的 外围矩形范围
                this._nodesRect = {
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0
                }
                //window._nodesRect = this._nodesRect;
                window.__me = this;
            },
            draw: function() {
                //用来触发scale 和 drag 的rect原件
                this._scaleDragHandRect = new Rect({
                    context: {
                        width: this.width,
                        height: this.height,
                        fillStyle: "black",
                        globalAlpha: 0
                    }
                });
                this.stage.addChild(this._scaleDragHandRect);


                this.sprite = new Canvax.Display.Sprite();
                this.stage.addChild(this.sprite);


                //如果有箭头
                if (this.arrow.enabled) {
                    this.arrowsSp = new Canvax.Display.Sprite({
                        id: "arrowsSp"
                    });
                    this.sprite.addChild(this.arrowsSp);
                };

                this.nodesSp = new Canvax.Display.Sprite({
                    id: "nodesSprite"
                });
                this.sprite.addChild(this.nodesSp);

                this.linksSp = new Canvax.Display.Sprite({
                    id: "linksSprite"
                });
                this.sprite.addChild(this.linksSp);


                this._tip    = new Tip(this.tips, this.canvax.getDomContainer());
                this._tip._getDefaultContent = this._getTipDefaultContent;
                this.sprite.addChild( this._tip.sprite );


                this.g = new Dagre.graphlib.Graph();

                this.g.setGraph(this.graph);

                this.g.setDefaultEdgeLabel(function() {
                    return {

                    };
                });

                this._initNodesAndLinks();

                this._widget();
                this._initNodesSpritePos();

                this._initEventHand();

                this.inited = true;
            },
            _getTipDefaultContent : function( nodeInfo ){
                var res;
                if( nodeInfo.label ){
                    res = "label"+"："+nodeInfo.label;
                } 
                return res;
            },
            /*
             * @data 为 
             * [ "id"       , "label" , "link"],
             * [ "limin"    , "李明"  , [] ],
             * [ "hanleilei", "韩雷雷", [] ]
             *
             * 转换为{
             *    limin : {
             *       label : "李明"
             *    }
             * }
             * */
            _initData: function(data) {
                var obj = {};
                var titles = data.shift();

                _.each(data, function(item) {
                    var idInd = _.indexOf(titles, "id");
                    var itemObj = {};
                    _.each(titles, function(t, ii) {
                        if (ii != idInd) {
                            itemObj[t] = item[ii];
                        }
                    });

                    obj[item[idInd]] = itemObj;
                });
                return obj;
            },
            _initEventHand: function() {
                var me = this;
                var isDragIng = false;
                this._scaleDragHandRect.on("mousedown", function(e) {
                    me._scaleDragHandRect.toFront();
                    isDragIng = true;
                    me._dragTreeBegin(e);
                });

                this._scaleDragHandRect.on("mousemove", function(e) {
                    if (isDragIng) {
                        me._dragTreeIng(e);
                    }
                });

                this._scaleDragHandRect.on("mouseup mouseout", function(e) {
                    me._scaleDragHandRect.toBack();
                    isDragIng = false;
                    me._dragTreeEnd(e);
                });
            },
            //最近一次move的point
            _lastDragPoint: null,
            //开始拖动tree
            _dragTreeBegin: function(e) {
                this._lastDragPoint = e.point;
            },
            //tree 拖动中
            _dragTreeIng: function(e) {
                this.sprite.context.x += (e.point.x - this._lastDragPoint.x);
                this.sprite.context.y += (e.point.y - this._lastDragPoint.y);
                this._lastDragPoint = e.point;
            },
            //tree 拖动结束
            _dragTreeEnd: function(e) {
                this._lastDragPoint = null;
            },
            /**
             *添加节点
             *@data param 要添加的 子节点。一次添加一个 {id : { label : "text" }}
             *targetId 要添加到的目标node的Id
             */
            addTo: function(data, targetId) {
                if (!this.data[targetId]) {
                    //要添加的目标节点不存在
                    return;
                }
                for (i in data) {
                    if (this.data[i]) {
                        //说明已经有一个这样的id了
                        return;
                    } else {
                        this.data[i] = data[i];

                        //然后建立好parent的link关系
                        if (!_.contains(this.data[targetId].link, i)) {
                            this.data[targetId].link.push(i)
                        };

                        var obj = {};
                        obj[i] = data[i];
                        var addShapes = this._initNodesAndLinks(obj);
                        obj = null;


                        //仅仅是在link的逻辑上面建立好父子关系
                        this._setParentLink(data[i], targetId);

                        //但是如果发现这个时候的target link的length为0的话，说明这个时候的target肯定没有tail
                        //那么就要手动建立一个
                        this.nodesSp.getChildById("node_" + targetId).addChild(this._getTail(targetId));

                        addShapes.push( this._creatLinkLine(targetId, i).line );
                        this.g.setEdge(targetId, i);

                        this._updateLayout(function() {
                            _.each(addShapes, function(shape) {
                                shape.context.globalAlpha = 1;
                            });
                            addShapes = null;
                        });

                    }
                };
            },
            remove: function(id) {

                var me = this;
                var parent = me.data[id].parent;
                me._remove(id);

                //然后要检测下parent的link是不是删除了自己后就link.length==0了
                //如果是==0，就要把parent的tail尾巴给干掉
                if (me.data[parent].link.length == 0) {
                    me.nodesSp.getChildById("node_" + parent).getChildById("tail_" + parent).remove();
                }

                this._updateLayout();
            },
            //删除某个节点，对应的所有子节点都会被删除
            _remove: function(id) {
                var me = this;
                var node = this.data[id];
                //从tree的末端开始删除
                for (var i = 0, l = node.link.length; i < l; i++) {
                    me._remove(node.link[i]);
                    i--;
                    l--;
                }

                //首先，删除父节点和自己的edge关系，已经edge对应的link连接线
                _.each(node.parent, function(parent, i) {
                    //先删除父亲节点和自己的关系
                    me.g.removeEdge(parent, id);
                    //然后删除代表关系的链接线
                    me.linksSp.getChildById("link_" + parent + "_" + id).remove();
                    if(me.arrow.enabled){
                        me.arrowsSp.getChildById("arrow_" + parent + "_" + id).remove();
                    };

                    //然后在parent的link中把自己给删除了
                    _.each(me.data[parent].link, function(target, i) {
                        if (target == id) {
                            me.data[parent].link.splice(i, 1);
                            return false;
                        }
                    });
                });

                delete this.data[id];
                this.g.removeNode(id);
                this.nodesSp.getChildById("node_" + id).remove();
                node = null;
            },
            _setParentLink: function(child, parentNodeId) {
                if (!child.parent) {
                    child.parent = [parentNodeId];
                } else if (!_.contains(child.parent, parentNodeId)) {
                    child.parent.push(parentNodeId);
                }
            },
            _getColor : function( color , nodeData , normal){
                var c = null;
                if( _.isString(color) ){
                    c = color;
                } else if ( _.isFunction(color) ) {
                    c = color.apply(this , [nodeData]);
                };
                return c || normal;
            },
            //@params nodeData 传入一个node的 data
            //要求返回一个sprite节点包括好的内容
            //业务的需求不同可以各自覆盖该方法
            //如果node的width and height都是没有默认 和配置，必须在这计算的话，
            //记得要给nodeData的width height 赋值
            getNodeContent: function(nodeData) {
                var sprite = new Canvax.Display.Sprite({});

                //先创建text，根据text来计算node需要的width和height
                var label = new Canvax.Display.Text(nodeData.label, {
                    context: {
                        fillStyle: this._getColor( this.node.labelColor, nodeData , this.node.labelNormalColor),
                        textAlign: "center",
                        textBaseline: "middle"
                    }
                });

                if (!nodeData.width) {
                    nodeData.width = label.getTextWidth() + 20;
                };
                if (!nodeData.height) {
                    nodeData.height = label.getTextHeight() + 15;
                };

                sprite.addChild(label);

                sprite.context.width = parseInt(nodeData.width);
                sprite.context.height = parseInt(nodeData.height);
                label.context.x = parseInt(nodeData.width / 2);
                label.context.y = parseInt(nodeData.height / 2);

                return sprite;

            },
            _getTail: function(nodeId) {
                var nodeData = this.data[nodeId];
                var begin, end;
                if (this.graph.rankdir == "TB") {
                    //如果是从上到下的结构,默认， 目前也先只做这个模式
                    begin = [nodeData.width / 2, nodeData.height];
                    end = [nodeData.width / 2, nodeData.height + this.graph.ranksep / 2];
                };
                if (this.graph.rankdir == "LR") {
                    //如果是从左到右模式
                    begin = [nodeData.width, nodeData.height / 2];
                    end = [nodeData.width + this.graph.ranksep / 2, nodeData.height / 2];
                }

                var link = new Line({
                    id: "tail_" + nodeId,
                    context: {
                        xStart: begin[0],
                        yStart: begin[1],
                        xEnd: end[0],
                        yEnd: end[1],
                        strokeStyle: this.link.strokeStyle,
                        lineWidth: 1
                    }
                });
                return link;
            },
            //根据data 来 初始化 node  也 连接线 的 shapes 到 sprite
            _initNodesAndLinks: function(data) {
                var me = this;
                var addShapes = null;
                !data ? (data = me.data) : (addShapes = []);
                for (var i in data) {
                    var nodeData = data[i];

                    //手动把i 设置为node的id
                    nodeData.id = i;

                    //如果nodeData中没有width
                    if (!nodeData.width && this.node.width) {
                        nodeData.width = this.node.width;
                    };
                    //如果nodeData中没有height
                    if (!nodeData.height && this.node.height) {
                        nodeData.height = this.node.height;
                    };

                    //getNodeContent中还会检测node是否有width和height，没有就自动补充
                    var nodeContent = this.getNodeContent(nodeData);

                    //现在设置好node 和 edge 的结构
                    me.g.setNode(i, nodeData);

                    if (!nodeData.link) {
                        nodeData.link = [];
                    }

                    var links = nodeData.link;

                    if (links.length > 0) {
                        _.each(links, function(childId, x) {
                            me._creatLinkLine(i, childId);
                            me._setParentLink(data[childId], i);
                            me.g.setEdge(i, childId);
                        });
                    }
                    //设置node 和 edge 的结构 end


                    //这个时候 开始绘制对应的cavnax节点用来显示了
                    var node = new Canvax.Display.Sprite({
                        id: "node_" + i,
                        context: {
                            globalAlpha: 0
                        }
                    });

                    var rect = new Rect({
                        id: "rect_" + i,
                        context: {
                            fillStyle: me._getColor( me.node.fillStyle, nodeData , me.node.fillNormalStyle),
                            strokeStyle: me._getColor( this.node.strokeStyle , nodeData , me.node.strokeNormalStyle),
                            lineWidth: 1,
                            width: nodeData.width,
                            height: nodeData.height
                        }
                    });

                    //在这个rect上面附加对应的node的信息。方便fire到侦听的事件中可以很方便的拿到位置等数据
                    rect.node = nodeData; //me.g.node(i);

                
                    //然后要看该dateNode是否有子节点，有的话就要给改node添加个尾巴
                    if (_.isArray(nodeData.link) && nodeData.link.length > 0) {
                        node.addChild(this._getTail(i));
                    };
                    node.addChild(rect);
                    node.addChild(nodeContent);
                    //node.addChild(this.getNodeContent(nodeData));

                    this.nodesSp.addChild(node);

                    //给node添加事件侦听
                    rect.hover(function(e) {
                        me.fire("nodeMouseover", e);
                        //在fire的时候已经把 e 的type 修改为了nodeMouseover 所以要修正
                        e.type = "mouseover";
                        e.eventInfo  = this.node;
                        me._tip.show(e);
                    }, function(e) {
                        me.fire("nodeMouseout", e);
                        e.type = "mouseout";
                        me._tip.hide();
                    });
                    rect.on("mousemove" , function(e){
                        e.eventInfo  = this.node;
                        me._tip.move(e);
                    });
                    rect.on("click", function(e) {
                        me.fire("nodeClick", e);
                    });
                    rect.on("dblclick", function(e) {
                        me.fire("nodeDblClick", e);
                    });
                    rect.on("mousedown", function(e) {
                        me.fire("nodeMousedown", e);
                        e.type = "mousedown";
                    });
                    rect.on("mouseup", function(e) {
                        me.fire("nodeMouseup", e);
                        e.type = "mouseop";
                    });
                    //时间侦听over

                    if (_.isArray(addShapes)) {
                        addShapes.push(node);
                    }
                }
                return addShapes;
            },
            //只创建一个link对应的Path，不设置具体的位置。
            _creatLinkLine: function(pId, cId) {
                var line = new Path({
                    id: "link_" + pId + "_" + cId,
                    context: {
                        path: "M0,0",
                        strokeStyle: this.link.strokeStyle,
                        lineWidth: 1
                    }
                });
                this.linksSp.addChild(line);

                var arrow;
                if(this.arrow.enabled){
                    var arrowC = {};
                    if (this.graph.rankdir == "TB") {
                        arrowC = {
                            scaleY: -1,
                            fillStyle: this.link.strokeStyle,
                            r: 6,
                            n: 3
                        }
                    };
                    if (this.graph.rankdir == "LR") {
                        arrowC = {
                            rotation : 90,
                            fillStyle: this.link.strokeStyle,
                            r: 6,
                            n: 3
                        }
                    };

                    arrow = new Isogon({
                        id : "arrow_" + pId + "_" + cId,
                        context: arrowC
                    });

                    this.arrowsSp.addChild(arrow);
                };
                
                return {
                    line : line,
                    arrow : arrow
                };
            },
            _getLinkPath: function(wbegin, wvControl, vTailPoint) {
                var me = this;
                var path = "M" + wbegin.x + "," + wbegin.y;
                if (vTailPoint.x == wbegin.x && (me.graph.rankdir == "TB" || me.graph.rankdir == "BT") ||
                    vTailPoint.y == wbegin.y && (me.graph.rankdir == "LR" || me.graph.rankdir == "RL")
                ) {

                    path += "L" + Math.ceil(vTailPoint.x) + "," + parseInt(vTailPoint.y);
                } else {
                    if (me.graph.rankdir == "TB") {
                        path += "L" + wbegin.x + "," + (wvControl.y + me.link.r);
                        path += "Q" + wbegin.x + "," + wvControl.y + ",";
                        path += ((vTailPoint.x > wbegin.x ? 1 : -1) * me.link.r + wbegin.x) + "," + wvControl.y;
                        path += "L" + vTailPoint.x + "," + vTailPoint.y
                    }
                    if (me.graph.rankdir == "LR") {
                        path += "L" + (wvControl.x + me.link.r) + "," + wbegin.y;
                        path += "Q" + wvControl.x + "," + wvControl.y + ",";
                        path += wvControl.x + "," + ((vTailPoint.y > wbegin.y ? 1 : -1) * me.link.r + wvControl.y);
                        path += "L" + vTailPoint.x + "," + vTailPoint.y;
                    }
                }
                return path;
            },
            _widget: function() {
                var me = this;

                Dagre.layout(me.g);

                me.g.nodes().forEach(function(v) {
                    var node = me.g.node(v);

                    var nodeSp = me.nodesSp.getChildById("node_" + v).context;
                    nodeSp.x = node.x - node.width / 2;
                    nodeSp.y = node.y - node.height / 2;
                    nodeSp.globalAlpha = 1;

                    me._nodesRect.left = Math.min(me._nodesRect.left, node.x - node.width / 2);
                    me._nodesRect.top = Math.min(me._nodesRect.top, node.y - node.height / 2);
                    me._nodesRect.right = Math.max(me._nodesRect.right, node.x + node.width / 2);
                    me._nodesRect.bottom = Math.max(me._nodesRect.bottom, node.y + node.height / 2);

                });

                me.g.edges().forEach(function(e) {

                    var edge = me.g.edge(e);
                    var vnode = me.g.node(e.v); //这个link的父端节点

                    var wbegin = edge.points[2]; //子节点的发射点

                    var vTailPoint = {
                        x: 0,
                        y: 0
                    }; //父节点的尾巴末端
                    var wvControl = {
                        x: 0,
                        y: 0
                    }; //从wbegin 发射到vTailPoint 的控制折点
                    if (me.graph.rankdir == "TB") {
                        vTailPoint = {
                            x: vnode.x,
                            y: vnode.y + vnode.height / 2 + me.graph.ranksep / 2
                        };
                        wvControl = {
                            x: wbegin.x,
                            y: vTailPoint.y
                        };
                    };
                    if (me.graph.rankdir == "LR") {
                        vTailPoint = {
                            x: vnode.x + vnode.width / 2 + me.graph.ranksep / 2,
                            y: vnode.y
                        };
                        wvControl = {
                            x: vTailPoint.x,
                            y: wbegin.y
                        };
                    };

                    var lc = me.linksSp.getChildById("link_" + e.v + "_" + e.w).context;
                    lc.path = me._getLinkPath(wbegin, wvControl, vTailPoint);

                    //箭头
                    if (me.arrow.enabled) {
                        var arrowC = {};
                        if (me.graph.rankdir == "TB") {
                            arrowC = {
                                x: wbegin.x,
                                y: wbegin.y - 3 - 2
                                //scaleY: -1,
                                //fillStyle: lc.strokeStyle
                            }
                        };
                        if (me.graph.rankdir == "LR") {
                            arrowC = {
                                x: wbegin.x - 3 - 2,
                                y: wbegin.y,
                                //scaleY: -1,
                                //rotation : 90,
                                //fillStyle: lc.strokeStyle
                            }
                        };
                        var ac = me.arrowsSp.getChildById("arrow_" + e.v + "_" + e.w);
                        _.extend( ac.context , arrowC );    
                    }
                });
            },
            _getPos: function() {
                //先记录所有shapes的原始位置
                var me = this;
                var pos = {};
                me.g.nodes().forEach(function(v) {
                    var node = me.g.node(v);
                    pos["node_" + v + "_x"] = node.x ? (node.x - node.width / 2) : 0;
                    pos["node_" + v + "_y"] = node.x ? (node.y - node.height / 2) : 0;
                });
                me.g.edges().forEach(function(e) {
                    var vnode = me.g.node(e.v); //这个link的父端节点
                    var edge = me.g.edge(e);
                    var vTailPoint, wbegin, wvControl;

                    if (edge.points) {
                        vTailPoint = {
                            x: vnode.x,
                            y: vnode.y + vnode.height / 2 + me.graph.ranksep * 5 / 10
                        }; //父节点的尾巴末端
                        wbegin = edge.points[2]; //子节点的发射点
                        wvControl = {
                            x: wbegin.x,
                            y: vTailPoint.y
                        }; //从wbegin 发射到vTailPoint 的控制折点
                  } else {
                        vTailPoint = wbegin = wvControl = {
                            x: 0,
                            y: 0
                        }
                    }

                    //父节点尾巴
                    pos["link_" + e.v + "_" + e.w + "_vTailPoint-x"] = vTailPoint.x;
                    pos["link_" + e.v + "_" + e.w + "_vTailPoint-y"] = vTailPoint.y;
                    //子节点的发射点
                    pos["link_" + e.v + "_" + e.w + "_wbegin-x"] = wbegin.x;
                    pos["link_" + e.v + "_" + e.w + "_wbegin-y"] = wbegin.y;
                    //控制点
                    pos["link_" + e.v + "_" + e.w + "_wvControl-x"] = wvControl.x;
                    pos["link_" + e.v + "_" + e.w + "_wvControl-y"] = wvControl.y;

                    //如果有箭头
                    if (me.arrow.enabled) {
                        //父节点尾巴
                        var __pos = {
                            x : wbegin.x,
                            y : wbegin.y
                        }
                        if (me.graph.rankdir == "TB") {
                            __pos.y = __pos.y-3-2;
                        }
                        if (me.graph.rankdir == "LR") {
                            __pos.x = __pos.x-3-2;
                        }
                        pos["arrow_" + e.v + "_" + e.w + "_x"] = __pos.x;
                        pos["arrow_" + e.v + "_" + e.w + "_y"] = __pos.y;
                    };

                });
                return pos;
            },
            //布局变动 {pos : posTo}
            _getLayoutChanged: function() {
                var me = this;

                var pos = this._getPos();

                //然后重新layout计算目标布局
                Dagre.layout(me.g);

                var posTo = me._getPos();

                return {
                    pos: pos,
                    posTo: posTo
                }

            },
            _updateLayout: function(callback) {
                this._tweenLayout(this._getLayoutChanged(), callback);
            },
            _creatPathOnTween: function() {

            },
            /**
             * 重新布局动画
             */
            _tweenLayout: function(obj, callback) {
                var me = this;
                var timer = null;
                var growAnima = function() {
                    
                    var bezierT = new Tween.Tween(obj.pos)
                        .to(obj.posTo, 300)
                        .onUpdate(function() {

                            var linkPaths = {}; //
                            for (var id in this) {
                                var val = this[id];
                                var p = id.slice(id.lastIndexOf("_")).replace("_", "");
                                id = id.substr(0, id.lastIndexOf("_"));

                                if (p == "x" || p == "y") {
                                    if(id.indexOf('arrow')>=0){
                                        me.arrowsSp.getChildById(id).context[p] = val;
                                    } else {
                                        me.nodesSp.getChildById(id).context[p] = val;
                                    };
                                } else {
                                    if (!linkPaths[id]) {
                                        linkPaths[id] = {};
                                    };
                                    var pointName = p.slice(0, p.indexOf("-"));
                                    var coordinateName = p.slice(p.indexOf("-") + 1);
                                    if (!linkPaths[id][pointName]) {
                                        linkPaths[id][pointName] = {};
                                    };
                                    linkPaths[id][pointName][coordinateName] = val;
                                }
                            };
                            for (var link in linkPaths) {
                                var l = linkPaths[link];
                                var path = me._getLinkPath(l.wbegin, l.wvControl, l.vTailPoint);
                                me.linksSp.getChildById(link).context.path = path;
                            };
                        }).onComplete(function() {
                            cancelAnimationFrame(timer);
                            callback && callback();
                        }).start();
                    animate();
                };

                function animate() {
                    timer = requestAnimationFrame(animate);
                    Tween.update();
                };
                growAnima();
            },

            //初次渲染的时候自动把拓扑图居中
            _initNodesSpritePos: function() {
                this.sprite.context.x = (this.width - (this._nodesRect.right - this._nodesRect.left)) / 2;
                this.sprite.context.y = 10;
            }
        });
    }
);