define(
    "chartx/chart/line/tips",
    [
        "canvax/index",
        "canvax/shape/Line",
        "canvax/shape/Circle",
        "chartx/components/tips/tip"
    ],
    function( Canvax , Line , Circle , Tip ){
        var Tips = function(opt , data , tipDomContainer){
            this.line      = {
                enabled      : 1
                 //strokeStyle : null
            };
            this.node      = {
                //strokeStyle : null
                //backFillStyle : null
            }

            this.sprite    = null;
            this._line     = null;
            this._nodes    = null;
            this._tip      = null;
            this._isShow   = false;
            this.enabled   = true;

            this.init(opt , data , tipDomContainer);
        };
    
        Tips.prototype = {
            init : function(opt , data , tipDomContainer){
                _.deepExtend(this , opt);
                this.sprite = new Canvax.Display.Sprite({
                    id : "tips"
                });
    
                //opt = _.deepExtend({
                //    prefix : data.yAxis.field
                //} , opt);
                
                this._tip = new Tip( opt , tipDomContainer );
    
            },
            show : function(e , tipsPoint){

                if( !this.enabled ) return;
                tipsPoint || ( tipsPoint = {} );
                tipsPoint = _.extend( this._getTipsPoint(e) , tipsPoint );
                
                this._initLine(e , tipsPoint);
                this._initNodes(e , tipsPoint);
    
                this.sprite.addChild(this._tip.sprite);
                this._tip.show(e , tipsPoint);

                this._isShow = true;
            },
            move : function(e){
                if( !this.enabled ) return;
                this._resetStatus(e);
                this._tip.move(e);
            },
            hide : function(e){
                if( !this.enabled ) return;
                this.sprite.removeAllChildren();
                this._line  = null;
                this._nodes = null;
                this._tip.hide(e);

                this._isShow = false;
            },
            _getTipsPoint : function(e){
                return e.target.localToGlobal( e.eventInfo.nodesInfoList[e.eventInfo.iGroup] );
            },
            _resetStatus : function(e){
                var tipsPoint = this._getTipsPoint(e);
                if(this._line){
                    this._line.context.x  = parseInt(tipsPoint.x);
                }
                this._resetNodesStatus(e , tipsPoint);
            },
    
            /**
             * line相关------------------------
             */
            _initLine : function(e , tipsInfo){
                var lineOpt = _.deepExtend({
                    x       : parseInt(tipsInfo.x),
                    y       : tipsInfo.lineTop || e.target.localToGlobal().y,
                    xStart  : 0,
                    yStart  : tipsInfo.lineH || e.target.context.height,
                    xEnd    : 0,
                    yEnd    : 0,
                    lineWidth   : 1,
                    strokeStyle : this.line.strokeStyle || "#cccccc" 
                } , this.line);
                if(this.line.enabled){
                    this._line = new Line({
                        id : "tipsLine",
                        context : lineOpt
                    });
                    this.sprite.addChild( this._line );
                }
            },
    
    
            /**
             *nodes相关-------------------------
             */
            _initNodes : function(e , tipsPoint){
                var self = this
                this._nodes = new Canvax.Display.Sprite({
                    id : "line-tipsNodes",
                    context : {
                        x   : parseInt(tipsPoint.x),
                        y   : e.target.localToGlobal().y
                    }
                });
                var self = this;

                _.each( e.eventInfo.nodesInfoList , function( node ){
                    
                    var csp = new Canvax.Display.Sprite({
                        context : {
                            y : e.target.context.height - Math.abs(node.y)
                        }
                    });

                    var bigCircle = new Circle({
                        context : {
                            r : node.r + 2 + 1 ,
                            fillStyle   : self.node.backFillStyle || "white",//node.fillStyle,
                            strokeStyle : self.node.strokeStyle || node.strokeStyle,
                            lineWidth   : node.lineWidth,
                            cursor      : 'pointer'
                        }
                    });

                    bigCircle.name = 'node', 
                    bigCircle.eventInfo = {
                        iGroup: node._groupInd,
                        iNode : e.eventInfo.iNode,
                        nodesInfoList : [node]
                    }

                    csp.addChild(bigCircle);

                    csp.addChild( new Circle({
                        context : {
                            r : node.r + 1,
                            fillStyle   : self.node.fillStyle || node.strokeStyle
                        }
                    }) );

                    self._nodes.addChild( csp );
                    bigCircle.on("mousemove", function(e) {
                        e.eventInfo = e.target.eventInfo
                        self._tip.move(e);
                    })
                    bigCircle.on("click", function(e) {
                        // e.target.eventInfo.nodeInfo = e.target.eventInfo.nodesInfoList[0]
                        // var eventInfo = _.clone(e.target.eventInfo)
                        // delete eventInfo.nodesInfoList
                        var o = {
                            eventInfo : _.clone(e.target.eventInfo)
                        }
                        self.sprite.fire("nodeclick", o);
                    })

                } );
                this.sprite.addChild( this._nodes );
            },
            _resetNodesStatus : function(e , tipsPoint){
                var self = this;
                if( this._nodes.children.length != e.eventInfo.nodesInfoList.length ){
                    this._nodes.removeAllChildren();
                    this._initNodes( e , tipsPoint );
                }
                this._nodes.context.x = parseInt(tipsPoint.x);
                _.each( e.eventInfo.nodesInfoList , function( node , i ){
                    var csps         = self._nodes.getChildAt(i).context;
                    csps.y           = e.target.context.height - Math.abs(node.y);

                    var bigCircle = self._nodes.getChildAt(i).getChildAt(0)
                    bigCircle.eventInfo = {
                        iGroup: node._groupInd,
                        iNode : e.eventInfo.iNode,
                        nodesInfoList : [node]
                    }
                });
            }
        };
        return Tips
    } 
);


define(
    "chartx/chart/line/xaxis",
    [
        "chartx/components/xaxis/xAxis"
    ],
    function( xAxisBase ){
        var xAxis = function( opt , data ){
            xAxis.superclass.constructor.apply( this , arguments );
        };
        Chartx.extend( xAxis , xAxisBase , {
            //覆盖xAxisBase 中的 _trimXAxis
            _trimXAxis : function( data , xGraphsWidth ){
                var max  = data.length
                var tmpData = [];
    
                if( max == 1 ){
                    tmpData.push({
                        content : data[0],
                        x       : parseInt( xGraphsWidth / 2 )
                    });
                } else {
                    for (var a = 0, al  = data.length; a < al; a++ ) {
                        var o = {
                            'content':data[a], 
                            'x':parseInt(a / (max - 1) * xGraphsWidth)
                        }
                        tmpData.push( o )
                    }
                }
                return tmpData;
            }
        } );
    
        return xAxis;
    }
);


define(
    "chartx/chart/line/group", [
        "canvax/index",
        "canvax/shape/BrokenLine",
        "canvax/shape/Circle",
        "canvax/shape/Path",
        "chartx/utils/tools",
        "chartx/utils/colorformat",
        "canvax/animation/Tween",
        "chartx/chart/theme",
        "canvax/animation/AnimationFrame"
    ],
    function(Canvax, BrokenLine, Circle, Path, Tools, ColorFormat, Tween, Theme, AnimationFrame) {
        window.Canvax = Canvax
        var Group = function(field, a, opt, ctx, sort, yAxis, h, w) {
            this.field = field; //_groupInd 在yAxis.field中对应的值
            this._groupInd = a;
            this._nodeInd = -1;
            this._yAxis = yAxis;
            this.sort = sort;
            this.ctx = ctx;
            this.w = w;
            this.h = h;
            this.y = 0;

            this.animation = true;

            this.colors = Theme.colors;

            this.line = { //线
                enabled: 1,
                strokeStyle: this.colors[this._groupInd],
                lineWidth: 2,
                lineType: "solid",
                smooth: true
            };

            this.node = { //节点 
                enabled: 1, //是否有
                corner: false, //模式[false || 0 = 都有节点 | true || 1 = 拐角才有节点]
                r: 2, //半径 node 圆点的半径
                fillStyle: '#ffffff',
                strokeStyle: null,
                lineWidth: 3
            };

            this.fill = { //填充
                fillStyle: null,
                alpha: 0.05
            };

            this.dataOrg = []; //data的原始数据
            this.data = []; //data会在wight中过滤一遍，把两边的空节点剔除
            this.sprite = null;

            this._pointList = []; //brokenline最终的状态
            this._currPointList = []; //brokenline 动画中的当前状态
            this._bline = null;

            this.init(opt)
        };

        Group.prototype = {
            init: function(opt) {
                _.deepExtend(this, opt);

                //如果opt中没有node fill的设置，那么要把fill node 的style和line做同步
                //!this.node.strokeStyle && (this.node.strokeStyle = this._getLineStrokeStyle());
                //!this.fill.fillStyle && (this.fill.fillStyle = this._getLineStrokeStyle());

                this.sprite = new Canvax.Display.Sprite();
                var me = this;
                this.sprite.on("destroy" , function(){
                    if(me._growTween){
                        AnimationFrame.destroyTween( me._growTween );
                    }
                });
            },
            draw: function(opt) {
                _.deepExtend(this, opt);
                this._widget();
            },
            update: function(opt) {
                if(!this._bline){
                    return;
                }
                _.deepExtend(this, opt);
                if( opt.data ){
                    this._pointList = this._getPointList(this.data);
                    this._grow();
                }

                if( opt._groupInd !== undefined ){
                    var _strokeStyle = this._getLineStrokeStyle();
                    this._bline.context.strokeStyle = _strokeStyle;
                    this._fill.context.fillStyle = (this._getFillStyle() || _strokeStyle);
                    this._setNodesStyle();
                }
            },
            //自我销毁
            destroy: function() {
                this.sprite.remove();
            },
            //styleType , normals , groupInd
            _getColor: function(s) {
                var color = this._getProp(s);
                if (!color || color == "") {
                    color = this.colors[this._groupInd];
                };
                return color;
            },
            _getProp: function(s) {
                if (_.isArray(s)) {
                    return s[this._groupInd]
                }
                if (_.isFunction(s)) {

                    return s({
                        iGroup: this._groupInd,
                        iNode: this._nodeInd,
                        field: this.field
                    });
                }
                return s
            },

            //这个是tips需要用到的 
            getNodeInfoAt: function($index) {
                var self = this;
                self._nodeInd = $index;
                var o = _.clone(self.dataOrg[$index]);
                if (o && o.value != null && o.value != undefined && o.value !== "") {
                    o.r = self._getProp(self.node.r);
                    o.fillStyle = self._getProp(self.node.fillStyle) || "#ffffff";
                    o.strokeStyle = self._getProp(self.node.strokeStyle) || self._getLineStrokeStyle();
                    o.color = self._getProp(self.node.strokeStyle) || self._getLineStrokeStyle(); //这个给tips里面的文本用
                    o.lineWidth = self._getProp(self.node.lineWidth) || 2;
                    o.alpha = self._getProp(self.fill.alpha);
                    o.field = self.field;
                    o._groupInd = self._groupInd;
                    // o.fillStyle = '#cc3300'
                    return o
                } else {
                    return null
                }
            },
            resetData: function(opt) {
                var self = this;
                self._pointList = this._getPointList(opt.data);
                var plen = self._pointList.length;
                var cplen = self._currPointList.length;
                if (plen < cplen) {
                    for (var i = plen, l = cplen; i < l; i++) {
                        self._circles.removeChildAt(i);
                        l--;
                        i--;
                    };
                    self._currPointList.length = plen;
                };

                if (plen > cplen) {
                    diffLen = plen - cplen;
                    for (var i = 0; i < diffLen; i++) {
                        self._currPointList.push(_.clone(self._currPointList[cplen - 1]));
                    }
                };

                self._circles && self._circles.removeAllChildren();
                self._createNodes();
                self._grow();
            },
            _grow: function(callback) {
            
                var self = this;
                if (!self.animation) {
                    callback && callback(self);
                }
                if (self._currPointList.length == 0) {
                    return;
                };

                this._growTween = AnimationFrame.registTween({
                    from: self._getPointPosStr(self._currPointList),
                    to: self._getPointPosStr(self._pointList),
                    onUpdate: function() {
                        for (var p in this) {
                            var ind = parseInt(p.split("_")[2]);
                            var xory = parseInt(p.split("_")[1]);
                            self._currPointList[ind] && (self._currPointList[ind][xory] = this[p]); //p_1_n中间的1代表x or y
                        };
                        var _strokeStyle = self._getLineStrokeStyle();
                        self._bline.context.pointList = _.clone(self._currPointList);
                        self._bline.context.strokeStyle = _strokeStyle;

                        self._fill.context.path = self._fillLine(self._bline);
                        self._fill.context.fillStyle = self._getFillStyle() || _strokeStyle;
                        self._circles && _.each(self._circles.children, function(circle, i) {
                            var ind = parseInt(circle.id.split("_")[1]);
                            circle.context.y = self._currPointList[ind][1];
                            circle.context.x = self._currPointList[ind][0];
                        });
                    },
                    onComplete: function() {
                        self._growTween = null;
                        callback && callback(self);
                    }
                });
            },
            _getPointPosStr: function(list) {
                var obj = {};
                _.each(list, function(p, i) {
                    obj["p_1_" + i] = p[1]; //p_y==p_1
                    obj["p_0_" + i] = p[0]; //p_x==p_0
                });
                return obj;
            },
            _isNotNum: function(val) {
                return val === undefined || isNaN(val) || val === null || val === ""
            },
            _filterEmptyValue: function(list) {

                //从左边开始 删除 value为非number的item
                for (var i = 0, l = list.length; i < l; i++) {
                    if (this._isNotNum(list[i].value)) {
                        list.shift();
                        l--;
                        i--;
                    } else {
                        break;
                    }
                };

                //从右边开始删除 value为非number的item
                for (var i = list.length - 1; i > 0; i--) {
                    if (this._isNotNum(list[i].value)) {
                        list.pop();
                    } else {
                        break;
                    }
                };
            },
            _getPointList: function(data) {
                var self = this;

                self.dataOrg = _.clone(data);
                self._filterEmptyValue(data);

                var list = [];
                for (var a = 0, al = data.length; a < al; a++) {
                    var o = data[a];
                    list.push([
                        o.x,
                        o.y
                    ]);
                };
                return list;
            },
            _widget: function(){
                var me = this;
                me._pointList = this._getPointList(me.data);

                if (me._pointList.length == 0) {
                    //filter后，data可能length==0
                    return;
                };
                var list = [];
                if (me.animation) {
                    for (var a = 0, al = me.data.length; a < al; a++) {
                        var o = me.data[a];
                        var sourceInd = 0;
                        //如果是属于双轴中的右轴。
                        if (me._yAxis.place == "right") {
                            sourceInd = al - 1;
                        };
                        list.push([
                            o.x,
                            me.data[sourceInd].y
                        ]);
                    };
                } else {
                    list = me._pointList;
                };
                
                me._currPointList = list;

                var bline = new BrokenLine({ //线条
                    context: {
                        pointList: list,
                        //strokeStyle: me._getLineStrokeStyle(),
                        lineWidth: me.line.lineWidth,
                        y: me.y,
                        smooth: me.line.smooth,
                        lineType: me._getProp(me.line.lineType),
                        //smooth为true的话，折线图需要对折线做一些纠正，不能超过底部
                        smoothFilter: function(rp) {
                            if (rp[1] > 0) {
                                rp[1] = 0;
                            } else if( Math.abs(rp[1]) > me.h ) {
                                rp[1] = -me.h;
                            }
                        }
                    }
                });
                if (!this.line.enabled) {
                    bline.context.visible = false
                }
                me.sprite.addChild(bline);
                me._bline = bline;
                
                var _strokeStyle = me._getLineStrokeStyle();
                bline.context.strokeStyle = _strokeStyle;

                var fill = new Path({ //填充
                    context: {
                        path: me._fillLine(bline),
                        fillStyle: me._getFillStyle() || _strokeStyle, //fill_gradient || me._getColor(me.fill.fillStyle),
                        globalAlpha: _.isArray(me.fill.alpha) ? 1 : me.fill.alpha //me._getProp( me.fill.alpha )
                    }
                });
                me.sprite.addChild(fill);
                me._fill = fill;
                me._createNodes();
            },
            _getFillStyle: function( ) {
                var self = this;
            
                var fill_gradient = null;
                
                if( self.fill.fillStyle ){
                    if (_.isArray(self.fill.alpha)) {
                        //alpha如果是数据，那么就是渐变背景，那么就至少要有两个值
                        self.fill.alpha.length = 2;
                        if (self.fill.alpha[0] == undefined) {
                            self.fill.alpha[0] = 0;
                        };
                        if (self.fill.alpha[1] == undefined) {
                            self.fill.alpha[1] = 0;
                        };

                        //从bline中找到最高的点
                        var topP = _.min(self._bline.context.pointList, function(p) {
                            return p[1]
                        });
                        //创建一个线性渐变
                        fill_gradient = self.ctx.createLinearGradient(topP[0], topP[1], topP[0], 0);

                        var rgb = ColorFormat.colorRgb(self._getColor(self.fill.fillStyle));
                        var rgba0 = rgb.replace(')', ', ' + self._getProp(self.fill.alpha[0]) + ')').replace('RGB', 'RGBA');
                        fill_gradient.addColorStop(0, rgba0);

                        var rgba1 = rgb.replace(')', ', ' + self.fill.alpha[1] + ')').replace('RGB', 'RGBA');
                        fill_gradient.addColorStop(1, rgba1);

                        return fill_gradient;
                    };
                    return self._getColor(self.fill.fillStyle);
                } else {
                    return null;
                }
            },
            _getLineStrokeStyle: function() {
                var self = this;
                /*
                if (this.__lineStyleStyle) {
                    return this.__lineStyleStyle;
                };
                */
                
                if( this.line.strokeStyle.lineargradient ){
                    //如果填充是一个线性渐变
                    //从bline中找到最高的点
                    var topP = _.min(self._bline.context.pointList, function(p) {
                        return p[1]
                    });
                    var bottomP = _.max(self._bline.context.pointList, function(p) {
                        return p[1]
                    });
                    //创建一个线性渐变
                    this.__lineStyleStyle = self.ctx.createLinearGradient(topP[0], topP[1], topP[0], bottomP[1]);

                    if( !_.isArray( this.line.strokeStyle.lineargradient ) ){
                        this.line.strokeStyle.lineargradient = [this.line.strokeStyle.lineargradient];
                    };

                    _.each(this.line.strokeStyle.lineargradient , function( item , i ){
                        self.__lineStyleStyle.addColorStop( item.position , item.color);
                    });
                
                    /*
                    var rgb = ColorFormat.colorRgb(self._getColor(self.fill.fillStyle));
                    var rgba0 = rgb.replace(')', ', ' + self._getProp(self.fill.alpha[0]) + ')').replace('RGB', 'RGBA');
                    this.__lineStyleStyle.addColorStop(0, rgba0);

                    var rgba1 = rgb.replace(')', ', ' + self.fill.alpha[1] + ')').replace('RGB', 'RGBA');
                    this.__lineStyleStyle.addColorStop(1, rgba1);
                    */

                } else {
                    this.__lineStyleStyle = this._getColor(this.line.strokeStyle);
                }
                //this.line.strokeStyle = this.__lineStyleStyle;
                return this.__lineStyleStyle;
            },
            _setNodesStyle: function(){
                var self = this;
                var list = self._currPointList;
                if ((self.node.enabled || list.length == 1) && !!self.line.lineWidth) { //拐角的圆点
                    for (var a = 0, al = list.length; a < al; a++) {
                        self._nodeInd = a;
                        var nodeEl = self._circles.getChildAt( a );
                        var strokeStyle = self._getProp(self.node.strokeStyle) || self._getLineStrokeStyle(); 
                        nodeEl.context.fillStyle = list.length == 1 ? strokeStyle : self._getProp(self.node.fillStyle) || "#ffffff";
                        nodeEl.context.strokeStyle = strokeStyle;

                        /*
                        var sourceInd = 0;
                        if (self._yAxis.place == "right") {
                            sourceInd = al - 1;
                        };
                        if (a == sourceInd) {
                            nodeEl.context.fillStyle = nodeEl.context.strokeStyle;
                            nodeEl.context.r++;
                        };
                        */

                        self._nodeInd = -1;
                    }
                }
            },
            _createNodes: function() {
                var self = this;
                var list = self._currPointList;
                // var node =  new Canvax.Display.Sprite();
                // self.sprite.addChild(node)
                if ((self.node.enabled || list.length == 1) && !!self.line.lineWidth) { //拐角的圆点
                    this._circles = new Canvax.Display.Sprite({});
                    this.sprite.addChild(this._circles);
                    for (var a = 0, al = list.length; a < al; a++) {
                        var context = {
                            x: self._currPointList[a][0],
                            y: self._currPointList[a][1],
                            r: self._getProp(self.node.r),
                            lineWidth: self._getProp(self.node.lineWidth) || 2
                        };

                        var circle = new Circle({
                            id: "circle_"+a,
                            context: context
                        });

                        if (self.node.corner) { //拐角才有节点
                            var y = self._pointList[a][1];
                            var pre = self._pointList[a - 1];
                            var next = self._pointList[a + 1];
                            if (pre && next) {
                                if (y == pre[1] && y == next[1]) {
                                    circle.context.visible = false;
                                }
                            }
                        };
                        self._circles.addChild(circle);
                    }
                };
                this._setNodesStyle();
            },
            _fillLine: function(bline) { //填充直线
                var fillPath = _.clone(bline.context.pointList);
                if( fillPath.length == 0 ){
                    return "";
                }
                var baseY = 0;
                if (this.sort == "desc") {
                    baseY = -this.h;
                }
                fillPath.push(
                    [fillPath[fillPath.length - 1][0], baseY], [fillPath[0][0], baseY], [fillPath[0][0], fillPath[0][1]]
                );
                return Tools.getPath(fillPath);
            }
        };
        return Group;
    }
)

define(
    "chartx/chart/line/graphs", [
        "canvax/index",
        "canvax/shape/Rect",
        "chartx/utils/tools",
        "chartx/chart/line/group"
    ],
    function(Canvax, Rect, Tools, Group) {
        var Graphs = function(opt, root) {
            this.w = 0;
            this.h = 0;
            this.y = 0;

            //这里所有的opt都要透传给 group
            this.opt = opt;
            this.root = root;
            this.ctx = root.stage.context2D;
            this.field = null;

            //一个记录了原始yAxis.field 一些基本信息的map
            //{ "uv" : {ind : 0 , _yAxis : , line} ...}
            this._yAxisFieldsMap = {};
            this._setyAxisFieldsMap();

            this.data = []; //二维 [[{x:0,y:-100,...},{}],[]]
            this.disX = 0; //点与点之间的间距
            this.groups = []; //群组集合     

            this.iGroup = 0; //群组索引(哪条线)
            this.iNode = -1; //节点索引(那个点)

            this.sprite = null;
            this.induce = null;

            this.eventEnabled = (opt.eventEnabled || true);

            this.init(opt);
        };
        Graphs.prototype = {
            init: function(opt) {
                this.opt = opt;
                this.sprite = new Canvax.Display.Sprite();
            },
            setX: function($n) {
                this.sprite.context.x = $n
            },
            setY: function($n) {
                this.sprite.context.y = $n
            },
            getX: function() {
                return this.sprite.context.x
            },
            getY: function() {
                return this.sprite.context.y
            },
            draw: function(opt) {
                _.deepExtend(this, opt);
                this._widget(opt);
                
                var me = this;
                _.each( this.groups , function( group ){
                    me._yAxisFieldsMap[group.field].line = group.line;
                } );
            },
            resetData: function(data, opt) {
                var me = this;
                me.data = data;
                opt && _.deepExtend(me, opt);
                
                for (var a = 0, al = me.field.length; a < al; a++) {
                    var group = me.groups[a];
                    group.resetData({
                        data: me.data[ me._yAxisFieldsMap[group.field].ind ]
                    });
                }
            },
            /**
             * 生长动画
             */
            grow: function(callback) {
                _.each(this.groups, function(g, i) {
                    g._grow(callback);
                });
            },
            _setyAxisFieldsMap: function() {
                var me = this;
                _.each(_.flatten(this._getYaxisField()), function(field, i) {
                    var _yAxisF = me._yAxisFieldsMap[field];
                    if( _yAxisF ){
                        me._yAxisFieldsMap[field].ind = i;
                    } else {
                        me._yAxisFieldsMap[field] = {
                            ind: i
                        };
                    }
                });
            },
            _addyAxisFieldsMap: function( field ){
                if( !this._yAxisFieldsMap[field] ){
                    var maxInd;
                    for( var f in this._yAxisFieldsMap ){
                        if( isNaN( maxInd ) ){
                            maxInd = 0;
                        };
                        maxInd = Math.max( this._yAxisFieldsMap[f].ind , maxInd );
                    };
                    this._yAxisFieldsMap[field] = {
                        ind : isNaN( maxInd )? 0 : ++maxInd
                    };
                };
            },
            _getYaxisField: function(i) {
                //这里要兼容从折柱混合图过来的情况
                //if (this.field) {
                //    return this.field;
                //}
                if (this.root.type && this.root.type.indexOf("line") >= 0) {
                    this.field = this.root._lineChart.dataFrame.yAxis.field;
                } else {
                    this.field = this.root.dataFrame.yAxis.field;
                };
                return this.field;
            },
            creatFields: function( field , fields){
                var me = this;
                var fs = [];
                _.each( fields , function( f , i ){
                    if( _.isArray(f) ){
                        fs.push( me.creatFields( field , f ) );
                    } else {
                        if( field == f ){
                            fs.push( f );
                        } else {
                            fs.push( null );
                        }
                    }
                } );
                return fs;
            },
            /*
            * 如果配置的yAxis有修改
            */
            yAxisFieldChange : function( yAxisChange , trimData ){
                !trimData && ( trimData = me.data );
                var me = this;
                _.isString( yAxisChange ) && (yAxisChange = [yAxisChange]);
                
                //如果新的yAxis.field有需要del的
                for( var i=0,l=me.field.length ; i<l ; i++ ){
                    var _f = me.field[i];
                    var dopy = _.find( yAxisChange , function( f ){
                        return f == _f
                    } );
                    if( !dopy ){
                        me.remove(i);
                        //delete me[ _f ];
                        me.field.splice( i , 1 );
                        delete me._yAxisFieldsMap[ _f ];
                        me.update({
                            data: trimData
                        });
                        i--;
                        l--;
                    };
                };

                //新的field配置有需要add的
                _.each( yAxisChange , function( opy , i ){
                    var fopy = _.find( me.groups ,function( f ){
                        return f.field == opy;
                    } );
                    if( !fopy ){
                        me.add({
                            data: trimData
                        }, opy);
                    };

                } );

                me._setyAxisFieldsMap();

                _.each( me.groups , function( g , i ){
                    g.update({
                        _groupInd : i
                    });
                } );
            },
            add: function(opt, field) {
                _.deepExtend(this, opt);
                //this._setyAxisFieldsMap();
                this._addyAxisFieldsMap( field );
                var creatFs = this.creatFields(field , this._getYaxisField());
                this._setGroupsForYfield( creatFs , this.data , this._yAxisFieldsMap[field].ind);
                this.update();
            },
            /*
             *删除 ind
             **/
            remove: function(i) {
                var target = this.groups.splice(i, 1)[0];
                target.destroy();
                //this.update();
            },
            /*
             * 更新下最新的状态
             **/
            update: function(opt) {
                opt && _.deepExtend(this, opt);
                //剩下的要更新下位置
                var self = this;
                _.each(this.groups, function(g, i) {
                    g.update({
                        data: self.data[i]
                    });
                });
            },

            _setGroupsForYfield: function(fields, data, groupInd) {
                var gs = [];
                var self = this;
                for (var i = 0, l = fields.length; i < l; i++) {
                    if(!data[i] || !fields[i]) continue;
                    var _sort = self.root._yAxis.sort;
                    var _biaxial = self.root.biaxial;
                    var _yAxis = self.root._yAxis;

                    var _groupInd = ((!groupInd && groupInd !== 0) ? i : groupInd);

                    //只有biaxial的情况才会有双轴，才会有 下面isArray(fields[i])的情况发生
                    if (_.isArray(fields[i])) {
                        self._setGroupsForYfield(fields[i], data[i], i);
                    } else {
                        if (_.isArray(_sort)) {
                            _sort = (_sort[_groupInd] || "asc");
                        };
                        if (_biaxial) {
                            if (_groupInd > 0) {
                                _yAxis = self.root._yAxisR
                            };
                        };

                        //记录起来该字段对应的应该是哪个_yAxis
                        var yfm = self._yAxisFieldsMap[fields[i]];
                        yfm._yAxis = _yAxis;
                        yfm._sort = _sort;
                        yfm._groupInd = _groupInd;

                        var group = new Group(
                            fields[i],
                            _groupInd,
                            self.opt,
                            self.ctx,
                            _sort,
                            _yAxis,
                            self.h,
                            self.w
                        );
                        group.draw({
                            data: data[i]
                        });
                        self.sprite.addChildAt(group.sprite , _groupInd);

                        var insert = false;
                        for( var gi=0,gl=self.groups.length ; gi<gl ; gi++ ){
                            if( self.groups[gi]._groupInd > _groupInd ){
                                self.groups.splice( gi , 0 , group );
                                insert=true;
                                break;
                            }
                        };
                        if( !insert ){
                            self.groups.push(group);
                        };
                        gs.push( group );
                    }
                };
                return gs;
            },
            _widget: function(opt) {
                var self = this;
                if (self.eventEnabled) {
                    self._setGroupsForYfield(self._getYaxisField(), self.data);
                    self.induce = new Rect({
                        id: "induce",
                        context: {
                            y: -self.h,
                            width: self.w,
                            height: self.h,
                            fillStyle: '#000000',
                            globalAlpha: 0,
                            cursor: 'pointer'
                        }
                    });

                    self.sprite.addChild(self.induce);

                    self.induce.on("panstart mouseover", function(e) {
                        e.eventInfo = self._getInfoHandler(e);
                    })
                    self.induce.on("panmove mousemove", function(e) {
                        e.eventInfo = self._getInfoHandler(e);
                    })
                    self.induce.on("panend mouseout", function(e) {
                        e.eventInfo = self._getInfoHandler(e);
                        self.iGroup = 0, self.iNode = -1
                    })
                    self.induce.on("tap click", function(e) {
                        e.eventInfo = self._getInfoHandler(e);
                    })
                }
            },
            _getInfoHandler: function(e) {
                // console.log(e)
                var x = e.point.x,
                    y = e.point.y - this.h;
                //todo:底层加判断
                x = x > this.w ? this.w : x;

                var tmpINode = this.disX == 0 ? 0 : parseInt((x + (this.disX / 2)) / this.disX);

                var _nodesInfoList = []; //节点信息集合

                for (var a = 0, al = this.groups.length; a < al; a++) {
                    var o = this.groups[a].getNodeInfoAt(tmpINode);
                    o && _nodesInfoList.push(o);
                };

                var tmpIGroup = Tools.getDisMinATArr(y, _.pluck(_nodesInfoList, "y"));

                this.iGroup = tmpIGroup, this.iNode = tmpINode;
                //iGroup 第几条线   iNode 第几个点   都从0开始
                var node = {
                    iGroup: this.iGroup,
                    iNode: this.iNode,
                    nodesInfoList: _.clone(_nodesInfoList)
                };
                return node;
            }
        };
        return Graphs;
    }
);

define(
    "chartx/chart/line/index", [
        'chartx/chart/index',
        'chartx/utils/tools',
        'chartx/utils/datasection',
        'chartx/chart/line/xaxis',
        'chartx/components/yaxis/yAxis',
        'chartx/components/back/Back',
        'chartx/components/anchor/Anchor',
        'chartx/chart/line/graphs',
        'chartx/chart/line/tips',
        'chartx/utils/dataformat',
        'chartx/components/datazoom/index',
        'chartx/components/legend/index'
    ],
    function(Chart, Tools, DataSection, xAxis, yAxis, Back, Anchor, Graphs, Tips, dataFormat, DataZoom , Legend) {
        /*
         *@node chart在dom里的目标容器节点。
         */
        var Canvax = Chart.Canvax;

        var Line = Chart.extend({
            init: function(node, data, opts) {
                this._node = node;
                this._data = data;
                this._opts = opts;

                this.dataZoom = {
                    enabled: false,
                    range: {
                        start: 0,
                        end: data.length - 1 //因为第一行是title
                    }
                };
                if (opts.dataZoom) {
                    this.dataZoom.enabled = true;
                    this.padding.bottom += (opts.dataZoom.height || 46);
                };

                this._xAxis = null;
                this._yAxis = null;
                this._anchor = null;
                this._back = null;
                this._graphs = null;
                this._tip = null;

                this.xAxis = {};
                this.yAxis = {};
                this.graphs = {};

                this.biaxial = false;

                _.deepExtend(this, opts);
                this.dataFrame = this._initData(data, this);

                this._setLegend();
            },
            draw: function() {
                this.stageTip = new Canvax.Display.Sprite({
                    id: 'tip'
                });
                this.core = new Canvax.Display.Sprite({
                    id: 'core'
                });
                this.stageBg = new Canvax.Display.Sprite({
                    id: 'bg'
                });

                this.stage.addChild(this.stageBg);
                this.stage.addChild(this.core);
                this.stage.addChild(this.stageTip);

                if (this.rotate) {
                    this._rotate(this.rotate);
                };
                this._initModule(); //初始化模块  
                this._startDraw(); //开始绘图
                this._endDraw();
                this.inited = true;
            },
            reset: function(obj) {
                var me = this;
                this._reset && this._reset( obj );
                var d = ( this.dataFrame.org || [] );
                var yAxisChange;
                
                if (obj && obj.options) {
                    _.deepExtend(this, obj.options);
                    yAxisChange = (obj.options.yAxis && obj.options.yAxis.field);
                };
                if (obj && obj.data) {
                    d = obj.data;
                };
                
                var trimData = this._resetDataFrameAndGetTrimData( obj.data );
                if( yAxisChange ){
                    me._graphs.yAxisFieldChange( yAxisChange , trimData);
                };

                d && this.resetData(d , trimData);
            },
            /*
             * 如果只有数据改动的情况
             */
            resetData: function(data , trimData) {
                if( !trimData ){
                    trimData = _resetDataFrameAndGetTrimData( data );
                };
                this._graphs.resetData( trimData , {
                    disX: this._getGraphsDisX()
                });
            },
            _resetDataFrameAndGetTrimData: function( data ){
                this.dataFrame = this._initData(data, this);
                this._xAxis.resetData(this.dataFrame.xAxis);
                this._yAxis.resetData(this.dataFrame.yAxis);
                return this._trimGraphs();
            },
            /*
             *添加一个yAxis字段，也就是添加一条brokenline折线
             *@params field 添加的字段
             **/
            add: function( field ) {
                var self = this;
                if( _.indexOf( this.yAxis.field , field ) > 0 ){
                    //说明已经在field列表里了，该add操作无效
                    return
                };
                if( !self._graphs._yAxisFieldsMap[field] ){
                    this.yAxis.field.push( field );
                } else {
                    this.yAxis.field.splice( self._graphs._yAxisFieldsMap[ field ].ind , 0, field);
                };

                this.dataFrame = this._initData(this.dataFrame.org, this);
                this._yAxis.update(this.yAxis, this.dataFrame.yAxis);

                //然后yAxis更新后，对应的背景也要更新
                this._back.update({
                    xAxis: {
                        data: this._yAxis.layoutData
                    }
                });

                this._graphs.add({
                    data: this._trimGraphs()
                }, field);
            },
            /*
             *删除一个yaxis字段，也就是删除一条brokenline线
             *@params target 也可以是字段名字，也可以是 index
             **/
            remove: function(target , _ind) {
                var ind = null;
                if (_.isNumber(target)) {
                    //说明是索引
                    ind = target;
                } else {
                    //说明是名字，转换为索引
                    ind = _.indexOf(this.yAxis.field, target);
                };
                if (ind != null && ind != undefined && ind != -1) {
                    this._remove(ind);
                };
            },
            _remove: function(ind) {

                //首先，yAxis要重新计算
                //先在dataFrame中更新yAxis的数据
                this.dataFrame.yAxis.field.splice(ind, 1);
                this.dataFrame.yAxis.org.splice(ind, 1);
                //this.yAxis.field.splice(ind , 1);

                this._yAxis.update(this.yAxis, this.dataFrame.yAxis);

                //然后yAxis更新后，对应的背景也要更新
                this._back.update({
                    xAxis: {
                        data: this._yAxis.layoutData
                    }
                });
                //然后就是删除graphs中对应的brokenline，并且把剩下的brokenline缓动到对应的位置
                this._graphs.remove(ind);
                this._graphs.update({
                    data: this._trimGraphs()
                });
            },
            _initData: function(data, opt) {
                var d;
                var dataZoom = (this.dataZoom || (opt && opt.dataZoom));
                if (dataZoom && dataZoom.enabled) {
                    var datas = [data[0]];
                    datas = datas.concat(data.slice(dataZoom.range.start + 1, dataZoom.range.end + 1 + 1));
                    d = dataFormat.apply(this, [datas, opt]);
                } else {
                    d = dataFormat.apply(this, arguments);
                };
                return d;
            },
            _initModule: function() {
                this._xAxis = new xAxis(this.xAxis, this.dataFrame.xAxis);
                if (this.biaxial) {
                    this.yAxis.biaxial = true;
                };

                this._yAxis = new yAxis(this.yAxis, this.dataFrame.yAxis);
                //再折线图中会有双轴图表
                if (this.biaxial) {
                    this._yAxisR = new yAxis(_.extend(_.clone(this.yAxis), {
                        place: "right"
                    }), this.dataFrame.yAxis);
                };

                this._back = new Back(this.back);
                this.stageBg.addChild(this._back.sprite);

                this._anchor = new Anchor(this.anchor);
                this.stageBg.addChild(this._anchor.sprite);

                this._graphs = new Graphs(this.graphs, this);
                this._tip = new Tips(this.tips, this.dataFrame, this.canvax.getDomContainer());
            },
            _startDraw: function(opt) {
                // this.dataFrame.yAxis.org = [[201,245,288,546,123,1000,445],[500,200,700,200,100,300,400]]
                // this.dataFrame.xAxis.org = ['星期一','星期二','星期三','星期四','星期五','星期六','星期日']
                var self = this
                var w = (opt && opt.w) || this.width;
                var h = (opt && opt.h) || this.height;

                var y = this.height - this._xAxis.h;
                var graphsH = y - this.padding.top - this.padding.bottom;

                //绘制yAxis
                this._yAxis.draw({
                    pos: {
                        x: this.padding.left,
                        y: y - this.padding.bottom
                    },
                    yMaxHeight: graphsH
                });

                if (this.dataZoom.enabled) {
                    this.__cloneChart = this._getCloneLine();
                    this._yAxis.resetData(this.__cloneChart.thumbBar.dataFrame.yAxis, {
                        animation: false
                    });
                };

                var _yAxisW = this._yAxis.w;



                //如果有双轴
                var _yAxisRW = 0;
                if (this._yAxisR) {
                    this._yAxisR.draw({
                        pos: {
                            x: 0, //this.padding.right,
                            y: y - this.padding.bottom
                        },
                        yMaxHeight: graphsH
                    });
                    _yAxisRW = this._yAxisR.w;
                    this._yAxisR.setX(this.width - _yAxisRW - this.padding.right + 1);
                };

                //绘制x轴
                this._xAxis.draw({
                    graphh: h - this.padding.bottom,
                    graphw: this.width - _yAxisRW - this.padding.right,
                    yAxisW: _yAxisW
                });
                if (this._xAxis.yAxisW != _yAxisW) {
                    //说明在xaxis里面的时候被修改过了。那么要同步到yaxis
                    this._yAxis.resetWidth(this._xAxis.yAxisW);
                    _yAxisW = this._xAxis.yAxisW;
                };

                var _graphsH = this._yAxis.yGraphsHeight;
                //Math.abs(this._yAxis.layoutData[ 0 ].y - this._yAxis.layoutData.slice(-1)[0].y);

                //绘制背景网格
                this._back.draw({
                    w: this._xAxis.xGraphsWidth,
                    h: _graphsH,
                    xAxis: {
                        data: this._yAxis.layoutData
                    },
                    yAxis: {
                        data: this._xAxis.layoutData
                    },
                    yOrigin: {
                        biaxial: this.biaxial
                    },
                    pos: {
                        x: _yAxisW,
                        y: y - this.padding.bottom
                    }
                });

                this._graphs.draw({
                    w: this._xAxis.xGraphsWidth,
                    h: this._yAxis.yGraphsHeight,
                    data: this._trimGraphs(),
                    disX: this._getGraphsDisX(),
                    smooth: this.smooth,
                    inited: this.inited
                });

                this._graphs.setX(_yAxisW), this._graphs.setY(y - this.padding.bottom);

                var me = this;

                //执行生长动画
                if (!this.inited) {
                    this._graphs.grow(function(g) {
                        me._initPlugs(me._opts, g);
                    });
                };

                this.bindEvent(this._graphs.sprite);
                this._tip.sprite.on('nodeclick', function(e) {
                    self._setXaxisYaxisToTipsInfo(e);
                    self.fire("nodeclick", e.eventInfo);
                })

                if (this._anchor.enabled) {
                    //绘制点位线
                    var pos = this._getPosAtGraphs(this._anchor.xIndex, this._anchor.num);
                    this._anchor.draw({
                        w: this._xAxis.xGraphsWidth, //this.width - _yAxisW - _yAxisRW,
                        h: _graphsH,
                        cross: {
                            x: pos.x,
                            y: _graphsH + pos.y
                        },
                        pos: {
                            x: _yAxisW,
                            y: y - _graphsH
                        }
                    });
                    //, this._anchor.setY(y)
                };

                if (this.dataZoom.enabled) {
                    this._initDataZoom();
                };

                //如果有 legend，调整下位置,和设置下颜色
                if(this._legend && !this._legend.inited){
                    this._legend.pos( { x : _yAxisW } );

                    for( var f in this._graphs._yAxisFieldsMap ){
                        var ffill = this._graphs._yAxisFieldsMap[f].line.strokeStyle;
                        this._legend.setStyle( f , {fillStyle : ffill} );
                    };
                    this._legend.inited = true;
                };
            },
            _endDraw: function() {
                //this.stageBg.addChild(this._back.sprite);
                //this.stageBg.addChild(this._anchor.sprite);
                this.core.addChild(this._xAxis.sprite);
                this.core.addChild(this._yAxis.sprite);
                if (this._yAxisR) {
                    this.core.addChild(this._yAxisR.sprite);
                };
                this.core.addChild(this._graphs.sprite);
                this.stageTip.addChild(this._tip.sprite);
            },

            //设置图例 begin
            _setLegend: function(){
                var me = this;
                if( !this.legend || (this.legend && "enabled" in this.legend && !this.legend.enabled) ) return;
                //设置legendOpt
                var legendOpt = _.deepExtend({
                    enabled:true,
                    label  : function( info ){
                       return info.field
                    },
                    onChecked : function( field ){
                       //me._resetOfLengend( field );
                       me.add( field );
                    },
                    onUnChecked : function( field ){
                       //me._resetOfLengend( field );
                       me.remove( field );
                    }
                } , this._opts.legend);
                
                this._legend = new Legend( this._getLegendData() , legendOpt );
                this.stage.addChild( this._legend.sprite );
                this._legend.pos( {
                    x : 0,
                    y : this.padding.top
                } );

                this.padding.top += this._legend.height;
            },
            //只有field为多组数据的时候才需要legend
            _getLegendData : function(){
                var me   = this;
                var data = [];
                _.each( _.flatten(me.dataFrame.yAxis.field) , function( f , i ){
                    data.push({
                        field : f,
                        value : null,
                        fillStyle : null
                    });
                });
                return data;
            },
            ////设置图例end
            _initPlugs: function(opts, g) {
                if (opts.markLine) {
                    this._initMarkLine(g);
                };
                if (opts.markPoint) {
                    this._initMarkPoint(g);
                };
            },
            _getCloneLine: function(lineConstructor) {
                var me = this;
                lineConstructor = (lineConstructor || Line);
                var cloneEl = me.el.cloneNode();
                cloneEl.innerHTML = "";
                cloneEl.id = me.el.id + "_currclone";
                cloneEl.style.position = "absolute";
                cloneEl.style.width = me.el.offsetWidth + "px";
                cloneEl.style.height = me.el.offsetHeight + "px";
                cloneEl.style.top = "10000px";
                document.body.appendChild(cloneEl);

                var opts = _.deepExtend({}, me._opts);
                _.deepExtend(opts, {
                    graphs: {
                        line: {
                            lineWidth: 1,
                            strokeStyle: "#ececec"
                        },
                        node: {
                            enabled: false
                        },
                        fill: {
                            alpha: 0.5,
                            fillStyle: "#ececec"
                        },
                        animation: false,
                        eventEnabled: false,
                        text: {
                            enabled: false
                        }
                    },
                    dataZoom: {
                        enabled: false
                    },
                    xAxis: {
                        //enabled: false
                    },
                    yAxis: {
                        //enabled: false
                    }
                });

                var thumbBar = new lineConstructor(cloneEl, me._data, opts);
                thumbBar.draw();
                return {
                    thumbBar: thumbBar,
                    cloneEl: cloneEl
                }
            },
            _initDataZoom: function(g) {
                var me = this;
                //require(["chartx/components/datazoom/index"], function(DataZoom) {
                //初始化datazoom模块
                var dataZoomOpt = _.deepExtend({
                    w: me._xAxis.xGraphsWidth,
                    //h : me._xAxis.h,
                    pos: {
                        x: me._xAxis.pos.x,
                        y: me._xAxis.pos.y + me._xAxis.h
                    },
                    count : me._data.length-1,
                    dragIng : function( range ){
                        if (parseInt(range.start) == parseInt(me.dataZoom.range.start) && parseInt(range.end) == parseInt(me.dataZoom.range.end)) {
                            return;
                        };
                        me.dataZoom.range.start = parseInt(range.start);
                        me.dataZoom.range.end = parseInt(range.end);
                        me.resetData( me._data );
                    }
                }, me.dataZoom);

                var cloneEl = me.el.cloneNode();
                cloneEl.innerHTML = "";
                cloneEl.id = me.el.id + "_currclone";
                cloneEl.style.position = "absolute";
                cloneEl.style.top = "10000px";
                document.body.appendChild(cloneEl);

                var opts = _.deepExtend({}, me._opts);
                _.deepExtend(opts, {
                    graphs: {
                        line: {
                            lineWidth: 1,
                            strokeStyle: "#ececec"
                        },
                        node: {
                            enabled: false
                        },
                        fill: {
                            alpha: 0.5,
                            fillStyle: "#ececec"
                        },
                        animation: false
                    },
                    dataZoom: null
                });
                me._dataZoom = new DataZoom(dataZoomOpt);

                var graphssp = this.__cloneChart.thumbBar._graphs.sprite;
                graphssp.id = graphssp.id + "_datazoomthumbbarbg"
                graphssp.context.x = 0;
                graphssp.context.y = me._dataZoom.h - me._dataZoom.barY;
                graphssp.context.scaleY = me._dataZoom.barH / this.__cloneChart.thumbBar._graphs.h;

                me._dataZoom.dataZoomBg.addChild(graphssp);
                me.core.addChild(me._dataZoom.sprite);

                this.__cloneChart.thumbBar.destroy();
                this.__cloneChart.cloneEl.parentNode.removeChild(this.__cloneChart.cloneEl);

                //});
            },
            _initMarkPoint: function(g) {
                var me = this;
                require(["chartx/components/markpoint/index"], function(MarkPoint) {
                    _.each(g.data, function(node, i) {
                        var circle = g._circles.children[i];

                        var mpCtx = {
                            value: node.value,
                            markTarget: g.field,
                            point: circle.localToGlobal(),
                            r: circle.context.r + 2,
                            groupLen: g.data.length,
                            iNode: i,
                            iGroup: g._groupInd
                        };
                        if (me._opts.markPoint && me._opts.markPoint.shapeType != "circle") {
                            mpCtx.point.y -= circle.context.r + 3
                        };
                        new MarkPoint(me._opts, mpCtx).done(function() {
                            me.core.addChild(this.sprite);
                            var mp = this;
                            this.shape.hover(function(e) {
                                this.context.hr++;
                                this.context.cursor = "pointer";
                                e.stopPropagation();
                            }, function(e) {
                                this.context.hr--;
                                e.stopPropagation();
                            });
                            this.shape.on("mousemove", function(e) {
                                e.stopPropagation();
                            });
                            this.shape.on("tap click", function(e) {
                                e.stopPropagation();
                                e.eventInfo = mp;
                                me.fire("markpointclick", e);
                            });
                        });
                    });
                });
            },
            _initMarkLine: function(g, dataFrame) {
                var me = this;
                var index = g._groupInd;
                var pointList = _.clone(g._pointList);
                dataFrame || (dataFrame = me.dataFrame);
                var center = parseInt(dataFrame.yAxis.center[index].agPosition);
                require(['chartx/components/markline/index'], function(MarkLine) {
                    var content = g.field + '均值',
                        strokeStyle = g.line.strokeStyle;
                    if (me.markLine.text && me.markLine.text.enabled) {
                        if (_.isFunction(me.markLine.text.format)) {
                            var o = {
                                iGroup: index,
                                value: dataFrame.yAxis.center[index].agValue
                            }
                            content = me.markLine.text.format(o)
                        }
                    };

                    var _y = center;
                    
                    //如果markline有自己预设的y值
                    if( me.markLine.y != undefined ){
                        var _y = me.markLine.y;
                        if(_.isFunction(_y)){
                            _y = _y( g.field );
                        };

                        if( _y != undefined ){
                            _y = g._yAxis.tansValToPos(_y);
                        }
                    };

                    var o = {
                        w: me._xAxis.xGraphsWidth,
                        h: me._yAxis.yGraphsHeight,
                        origin: {
                            x: me._back.pos.x,
                            y: me._back.pos.y
                        },
                        line: {
                            y: _y,
                            list: [
                                [0, 0],
                                [me._xAxis.xGraphsWidth, 0]
                            ],
                            strokeStyle: strokeStyle
                        },
                        text: {
                            content: content,
                            fillStyle: strokeStyle
                        },
                        field: g.field
                    };

                    new MarkLine(_.deepExtend(o, me._opts.markLine)).done(function() {
                        me.core.addChild(this.sprite)
                    });
                })
            },
            bindEvent: function(spt, _setXaxisYaxisToTipsInfo) {
                var self = this;
                _setXaxisYaxisToTipsInfo || (_setXaxisYaxisToTipsInfo = self._setXaxisYaxisToTipsInfo);
                spt.on("panstart mouseover", function(e) {
                    if (self._tip.enabled && e.eventInfo.nodesInfoList.length > 0) {
                        self._tip.hide(e);
                        _setXaxisYaxisToTipsInfo.apply(self, [e]);
                        self._tip.show(e);
                    }
                });
                spt.on("panmove mousemove", function(e) {
                    if (self._tip.enabled) {
                        if (e.eventInfo.nodesInfoList.length > 0) {
                            _setXaxisYaxisToTipsInfo.apply(self, [e]);
                            if (self._tip._isShow) {
                                self._tip.move(e);
                            } else {
                                self._tip.show(e);
                            }
                        } else {
                            if (self._tip._isShow) {
                                self._tip.hide(e);
                            }
                        }
                    }
                });
                spt.on("panend mouseout", function(e) {
                    if (e.toTarget && e.toTarget.name == 'node') {
                        return
                    }
                    if (self._tip.enabled) {
                        self._tip.hide(e);
                    }
                });
                spt.on("tap", function(e) {
                    if (self._tip.enabled && e.eventInfo.nodesInfoList.length > 0) {
                        self._tip.hide(e);
                        _setXaxisYaxisToTipsInfo.apply(self, [e]);
                        self._tip.show(e);
                    }
                });
                spt.on("click", function(e) {
                    _setXaxisYaxisToTipsInfo.apply(self, [e]);
                    self.fire("click", e.eventInfo);
                });
            },
            //把这个点位置对应的x轴数据和y轴数据存到tips的info里面
            //方便外部自定义tip是的content
            _setXaxisYaxisToTipsInfo: function(e) {
                if (!e.eventInfo) {
                    return;
                };
                var me = this;
                e.eventInfo.xAxis = {
                    field: this.dataFrame.xAxis.field,
                    value: this.dataFrame.xAxis.org[0][e.eventInfo.iNode]
                };

                e.eventInfo.dataZoom = me.dataZoom;

                e.eventInfo.rowData = this.dataFrame.getRowData( e.eventInfo.iNode );

                e.eventInfo.iNode += this.dataZoom.range.start;
            },
            _trimGraphs: function(_yAxis, dataFrame) {

                _yAxis || (_yAxis = this._yAxis);
                dataFrame || (dataFrame = this.dataFrame);
                var self = this;

                var maxYAxis = _yAxis.dataSection[_yAxis.dataSection.length - 1];
                var arr = dataFrame.yAxis.org;
                var tmpData = [];
                var center = [];

                function _trimGraphs(_fields, _arr, _tmpData, _center, _firstLay) {
                    for (var i = 0, l = _fields.length; i < l; i++) {

                        //单条line的全部data数据
                        var _lineData = _arr[i];

                        if( !_lineData ) return;

                        var __tmpData = [];
                        _tmpData.push(__tmpData);

                        

                        if (_firstLay && self.biaxial && i > 0) {
                            _yAxis = self._yAxisR;
                            maxYAxis = _yAxis.dataSection[_yAxis.dataSection.length - 1];
                        };

                        if (_.isArray(_fields[i])) {
                            var __center = [];
                            _center.push(__center);
                            _trimGraphs(_fields[i], _lineData, __tmpData, __center);
                        } else {
                            var maxValue = 0;
                            _center[i] = {};
                            for (var b = 0, bl = _lineData.length; b < bl; b++) {
                                if (b >= self._xAxis.data.length) {
                                    //如果发现数据节点已经超过了x轴的节点，就扔掉
                                    break;
                                }
                                var x = self._xAxis.data[b].x;
                                var y = -(_lineData[b] - _yAxis._bottomNumber) / (maxYAxis - _yAxis._bottomNumber) * _yAxis.yGraphsHeight
                                y = isNaN(y) ? 0 : y
                                __tmpData[b] = {
                                    value: _lineData[b],
                                    x: x,
                                    y: y
                                };
                                maxValue += _lineData[b]
                            };
                            _center[i].agValue = maxValue / bl;
                            _center[i].agPosition = -(_center[i].agValue - _yAxis._bottomNumber) / (maxYAxis - _yAxis._bottomNumber) * _yAxis.yGraphsHeight;
                        }
                    }
                };

                function _getYaxisField(i) {
                    //这里要兼容从折柱混合图过来的情况
                    if (self.type && self.type.indexOf("line") >= 0) {
                        return self._lineChart.dataFrame.yAxis.field;
                    } else {
                        return self.dataFrame.yAxis.field;
                    };
                };

                _trimGraphs(_getYaxisField(), arr, tmpData, center, true);

                //均值
                dataFrame.yAxis.center = center;
                return tmpData;
            },
            //根据x轴分段索引和具体值,计算出处于Graphs中的坐标
            _getPosAtGraphs: function(index, num) {
                var x = this._xAxis.data[index].x;
                var y = this._graphs.data[0][index].y
                return {
                    x: x,
                    y: y
                }
            },
            //每两个点之间的距离
            _getGraphsDisX: function() {
                var dsl = this._xAxis.dataSection.length;
                var n = this._xAxis.xGraphsWidth / (dsl - 1);
                if (dsl == 1) {
                    n = 0
                }
                return n
            }
        });
        return Line;
    }
);