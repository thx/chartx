define(
    "chartx/chart/line/tips",
    [
        "canvax/index",
        "chartx/chart/line/markcolumn",
        "chartx/components/tips/tip"
    ],
    function( Canvax , markColumn, Tip ){
        var Tips = function(opt , data , tipDomContainer){

            this.sprite      = null;

            this._tip        = null;
            this._markColumn = null;

            this._isShow     = false;
            this.enabled     = true;

            this.induce      = null; //graphs中的induce，用来触发事件系统

            this.init(opt , data , tipDomContainer);
        };
    
        Tips.prototype = {
            init : function(opt , data , tipDomContainer){
                var me = this;

                _.deepExtend(this , opt);
                this.sprite = new Canvax.Display.Sprite({
                    id : "tips"
                });
                
                this._tip = new Tip( opt , tipDomContainer );
                this.sprite.addChild(this._tip.sprite);

                this._markColumn = new markColumn( _.extend({
                    line : {
                        eventEnabled: false
                    }
                }, opt) );
                this.sprite.addChild( this._markColumn.sprite );

                this._markColumn.on("mouseover" , function(e){
                    me.show( e );
                })
            },
            setInduce: function( induce ){
                this.induce = induce;
                var ictx = induce.context;
                var ictxLocPos = induce.localToGlobal();
                this.layout = {
                    x : ictxLocPos.x,
                    y : ictxLocPos.y,
                    width : ictx.width,
                    height : ictx.height
                };
                this._markColumn.y = this.layout.y;
                this._markColumn.h = this.layout.height;
            },
            reset: function( opt ){
                _.deepExtend(this._tip , opt);
            },
            //从柱状折图中传过来的tipsPoint参数会添加lineTop,lineH的属性用来绘制markCloumn
            show : function(e , tipsPoint){

                if( !this.enabled ) return;
                tipsPoint || ( tipsPoint = {} );
                tipsPoint = _.extend( this._getTipsPoint(e) , tipsPoint );
            
                this._tip.show(e , tipsPoint);

                this._markColumn.show(e , tipsPoint );

                this._isShow = true;
            },

            move : function(e){
                if( !this.enabled ) return;
                var tipsPoint = this._getTipsPoint(e);
                this._markColumn.move(e , tipsPoint);
                this._tip.move(e);
            },
            hide : function(e){
                if( !this.enabled ) return;
                this._tip.hide(e);
                this._markColumn.hide(e);

                this._isShow = false;
            },
            _getTipsPoint : function(e){
                var target = this.induce || e.target;
                return target.localToGlobal( e.eventInfo.nodesInfoList[e.eventInfo.iGroup] );
            }  
        };
        return Tips
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
            this.resize = false;

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
                lineWidth: 4
            };

            this.text = {
                enabled : 0,
                fillStyle: null,
                strokeStyle: null,
                fontSize: 13,
                format: null,

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


            //从配置里面转换后的一些私有属性
            this.__lineStrokeStyle = null;

            this.init(opt)
        };

        Group.prototype = {
            init: function(opt) {
                _.deepExtend(this, opt);

                //如果opt中没有 node fill的设置，那么要把fill node 的style和line做同步
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
                };
                _.deepExtend(this, opt);
                if( opt.data ){
                    this._pointList = this._getPointList(this.data);
                    this._grow();
                };
                if( opt._groupInd !== undefined ){
                    var _strokeStyle = this._getLineStrokeStyle();
                    this._bline.context.strokeStyle = _strokeStyle;
                    this._fill.context.fillStyle = (this._getFillStyle() || _strokeStyle);
                    this._setNodesStyle();
                };
            },
            //自我销毁
            destroy: function() {
                var me = this;
                me.sprite.animate({
                    globalAlpha : 0
                } , {
                    duration: 300,
                    complate: function(){
                        me.sprite.remove();
                    }
                });
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
                    var obj = {
                        iGroup: this._groupInd,
                        iNode: this._nodeInd,
                        field: this.field
                    };
                    if( this._nodeInd >= 0 ){
                        obj.value = this.data[ this._nodeInd ].value;
                    };

                    return s.apply( this , [obj] );
                }
                return s
            },
            _createNodeInfo: function(){
                var me = this;
                var obj = {};
                obj.r = me._getProp(me.node.r);
                obj.fillStyle = me._getProp(me.node.fillStyle) || "#ffffff";
                obj.strokeStyle = me._getProp(me.node.strokeStyle) || me._getLineStrokeStyle();
                obj.color = obj.strokeStyle;
                obj.lineWidth = me._getProp(me.node.lineWidth) || 2;
                obj.alpha = me._getProp(me.fill.alpha);
                obj.field = me.field;
                obj._groupInd = me._groupInd;
                return obj
            },

            //这个是tips需要用到的 
            getNodeInfoAt: function($index) {
                var me = this;
                me._nodeInd = $index;
                var o = _.clone(me.dataOrg[$index]);
                if (o && o.value != null && o.value != undefined && o.value !== "") {
                    return _.extend(o , me._createNodeInfo());
                } else {
                    return null;
                }
            },
            //根据x方向的 val来 获取对应的node， 这个node可能刚好是一个node， 也可能两个node中间的某个位置
            getNodeInfoOfX: function( x ){
                var me = this;
                var nodeInfo;
                for( var i = 0,l = this.dataOrg.length; i<l; i++ ){
                    if( Math.abs( this.dataOrg[i].x - x) <= 1 ){
                        //左右相差不到1px的，都算
                        nodeInfo = this.getNodeInfoAt(i);
                        return nodeInfo;
                    }
                };

                var getPointFromXInLine = function( x , line ){
                    var p = {x : x, y: 0};
                    p.y = line[0][1] + ((line[1][1]-line[0][1])/(line[1][0]-line[0][0])) * (x - line[0][0]);
                    return p;
                };

                var point;
                var search = function( points ){

                    if( x<points[0][0] || x>points.slice(-1)[0][0] ){
                        return;
                    };

                    var midInd = parseInt(points.length / 2);
                    if( Math.abs(points[midInd][0] - x ) <= 1 ){
                        point = {
                            x: points[midInd][0],
                            y: points[midInd][1]
                        };
                        return;
                    };
                    var _pl = [];
                    if( x > points[midInd][0] ){
                        if( x < points[midInd+1][0]){
                            point = getPointFromXInLine( x , [ points[midInd] , points[midInd+1] ] );
                            return;
                        } else {
                            _pl = points.slice( midInd+1 );
                        }
                    } else {
                        if( x > points[midInd-1][0] ){
                            point = getPointFromXInLine( x , [ points[midInd-1] , points[midInd] ] );
                            return;
                        } else {
                            _pl = points.slice( 0 , midInd );
                        }
                    };
                    search(_pl);

                };
                
                search( this._bline.context.pointList );
                
                if(!point){
                    return null;
                }

                point.value = me._yAxis.getValFromYpos( point.y ); //null;
                me._nodeInd = -1;
                return _.extend( point, me._createNodeInfo());
            },
            reset: function(opt) {
                var me = this;
                me._pointList = this._getPointList(opt.data);
                var plen = me._pointList.length;
                var cplen = me._currPointList.length;
                if (plen < cplen) {
                    for (var i = plen, l = cplen; i < l; i++) {
                        me._circles && me._circles.removeChildAt(i);
                        me._texts && me._texts.removeChildAt(i);
                        l--;
                        i--;
                    };
                    me._currPointList.length = plen;
                };

                if (plen > cplen) {
                    diffLen = plen - cplen;
                    for (var i = 0; i < diffLen; i++) {
                        me._currPointList.push(_.clone(me._currPointList[cplen - 1]));
                    }
                };

                me._circles && me._circles.removeAllChildren();
                me._texts && me._texts.removeAllChildren();
                me._createNodes();
                me._createTexts();
                me._grow();
            },
            _grow: function(callback) {
            
                var me = this;
                if (!me.animation || me.resize) {
                    callback && callback(self);
                }
                if (me._currPointList.length == 0) {
                    return;
                };

                function _update( list ){
                    var _strokeStyle = me._getLineStrokeStyle();
                    me._bline.context.pointList = _.clone( list );
                    me._bline.context.strokeStyle = _strokeStyle;

                    me._fill.context.path = me._fillLine(me._bline);
                    me._fill.context.fillStyle = me._getFillStyle() || _strokeStyle;
                    me._circles && _.each(me._circles.children, function(circle, i) {
                        var ind = parseInt(circle.id.split("_")[1]);
                        circle.context.y = list[ind][1];
                        circle.context.x = list[ind][0];
                    });

                    me._texts && _.each(me._texts.children, function(text, i) {
                        var ind = parseInt(text.id.split("_")[1]);
                        text.context.y = list[ind][1] - 3;
                        text.context.x = list[ind][0];
                        me._checkTextPos( text , i );
                    });
                };

                this._growTween = AnimationFrame.registTween({
                    from: me._getPointPosStr(me._currPointList),
                    to: me._getPointPosStr(me._pointList),
                    desc: me.field + ' animation',
                    onUpdate: function() {
                        for (var p in this) {
                            var ind = parseInt(p.split("_")[2]);
                            var xory = parseInt(p.split("_")[1]);
                            me._currPointList[ind] && (me._currPointList[ind][xory] = this[p]); //p_1_n中间的1代表x or y
                        };
                        _update( me._currPointList );
                    },
                    onComplete: function() {
                        me._growTween = null;
                        //在动画结束后强制把目标状态绘制一次。
                        //解决在onUpdate中可能出现的异常会导致绘制有问题。
                        //这样的话，至少最后的结果会是对的。
                        _update( me._pointList );
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
            
                var me = this;

                me.dataOrg = _.clone(data);
                me._filterEmptyValue(data);

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
                if (me.animation && !me.resize) {
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
                };
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
                me._createTexts();
            },
            _getFillStyle: function( ) {

                var me = this;
            
                var fill_gradient = null;
                var _fillStyle = me.fill.fillStyle;

                if( !_fillStyle ){
                    //如果没有配置的fillStyle，那么就取对应的line.strokeStyle
                    _fillStyle = me._getLineStrokeStyle("fillStyle")
                }

                _fillStyle && (_fillStyle = me._getColor(me.fill.fillStyle));

                if (_.isArray(me.fill.alpha) && !(_fillStyle instanceof CanvasGradient)) {
                    //alpha如果是数组，那么就是渐变背景，那么就至少要有两个值
                    //如果拿回来的style已经是个gradient了，那么就不管了
                    me.fill.alpha.length = 2;
                    if (me.fill.alpha[0] == undefined) {
                        me.fill.alpha[0] = 0;
                    };
                    if (me.fill.alpha[1] == undefined) {
                        me.fill.alpha[1] = 0;
                    };

                    //从bline中找到最高的点
                    var topP = _.min(me._bline.context.pointList, function(p) {
                        return p[1]
                    });
                    //创建一个线性渐变
                    fill_gradient = me.ctx.createLinearGradient(topP[0], topP[1], topP[0], 0);

                    var rgb = ColorFormat.colorRgb( _fillStyle );
                    var rgba0 = rgb.replace(')', ', ' + me._getProp(me.fill.alpha[0]) + ')').replace('RGB', 'RGBA');
                    fill_gradient.addColorStop(0, rgba0);

                    var rgba1 = rgb.replace(')', ', ' + me.fill.alpha[1] + ')').replace('RGB', 'RGBA');
                    fill_gradient.addColorStop(1, rgba1);

                    _fillStyle = fill_gradient;
                };
            
                return _fillStyle;
            },
            _getLineStrokeStyle: function( from ) {
                var me = this;
                
                if( this.line.strokeStyle.lineargradient ){
                    //如果填充是一个线性渐变
                    //从bline中找到最高的点
                    var topP = _.min(me._bline.context.pointList, function(p) {
                        return p[1]
                    });
                    var bottomP = _.max(me._bline.context.pointList, function(p) {
                        return p[1]
                    });
                    if( from == "fillStyle" ){
                        bottomP = [ 0 , 0 ];
                    };
                    //var bottomP = [ 0 , 0 ];
                    //创建一个线性渐变
                    this.__lineStrokeStyle = me.ctx.createLinearGradient(topP[0], topP[1], topP[0], bottomP[1]);

                    if( !_.isArray( this.line.strokeStyle.lineargradient ) ){
                        this.line.strokeStyle.lineargradient = [this.line.strokeStyle.lineargradient];
                    };

                    _.each(this.line.strokeStyle.lineargradient , function( item , i ){
                        me.__lineStrokeStyle.addColorStop( item.position , item.color);
                    });

                } else {
                    this.__lineStrokeStyle = this._getColor(this.line.strokeStyle);
                }
                return this.__lineStrokeStyle;
            },
            _setNodesStyle: function(){
                var me = this;
                var list = me._currPointList;
                if ((me.node.enabled || list.length == 1) && !!me.line.lineWidth) { //拐角的圆点
                    for (var a = 0, al = list.length; a < al; a++) {
                        me._nodeInd = a;
                        var nodeEl = me._circles.getChildAt( a );
                        var strokeStyle = me._getProp(me.node.strokeStyle) || me._getLineStrokeStyle(); 
                        nodeEl.context.fillStyle = list.length == 1 ? strokeStyle : me._getProp(me.node.fillStyle) || "#ffffff";
                        nodeEl.context.strokeStyle = strokeStyle;

                        me._nodeInd = -1;
                    }
                }
            },
            _createNodes: function() {
                var me = this;
                var list = me._currPointList;

                if ((me.node.enabled || list.length == 1) && !!me.line.lineWidth) { //拐角的圆点
                    this._circles = new Canvax.Display.Sprite({});
                    this.sprite.addChild(this._circles);
                    for (var a = 0, al = list.length; a < al; a++) {
                        var context = {
                            x: me._currPointList[a][0],
                            y: me._currPointList[a][1],
                            r: me._getProp(me.node.r),
                            lineWidth: me._getProp(me.node.lineWidth) || 2
                        };

                        var circle = new Circle({
                            id: "circle_"+a,
                            context: context
                        });

                        if (me.node.corner) { //拐角才有节点
                            var y = me._pointList[a][1];
                            var pre = me._pointList[a - 1];
                            var next = me._pointList[a + 1];
                            if (pre && next) {
                                if (y == pre[1] && y == next[1]) {
                                    circle.context.visible = false;
                                }
                            }
                        };
                        me._circles.addChild(circle);
                    }
                };
                this._setNodesStyle();
            },
            _createTexts: function() {
                
                var me = this;
                var list = me._currPointList;

                if ( me.text.enabled ) { //节点上面的文本info
                    this._texts = new Canvax.Display.Sprite({});
                    this.sprite.addChild(this._texts);
                    
                    for (var a = 0, al = list.length; a < al; a++) {
                        me._nodeInd = a;
                        var fontFillStyle = me._getProp(me.text.fillStyle) || me._getProp(me.node.strokeStyle) || me._getLineStrokeStyle();
                        me._nodeInd = -1;
                        var context = {
                            x: me._currPointList[a][0],
                            y: me._currPointList[a][1] - 3,
                            fontSize: this.text.fontSize,
                            textAlign: "center",
                            textBaseline: "bottom",
                            fillStyle: fontFillStyle,
                            lineWidth:1,
                            strokeStyle:"#ffffff"
                        };

                        var content = me.data[ a ].value;
                        if (_.isFunction(me.text.format)) {
                            content = (me.text.format.apply( self , [content , a]) || content );
                        };

                        var text =  new Canvax.Display.Text( content , {
                            id: "text_"+a,
                            context: context
                        });

                        me._texts.addChild(text);
                        me._checkTextPos( text , a );

                    }
                };
                this._setNodesStyle();
            },
            _checkTextPos : function( text , ind ){
                var me = this;
                var list = me._currPointList;
                var pre = list[ ind - 1 ];
                var next = list[ ind + 1 ];
                if( ind == 0 ){
                    text.context.textAlign = "left"
                }; 
                if( ind == list.length-1 ){
                    text.context.textAlign = "right"
                };

                if( 
                    pre && next &&
                    ( pre[1] < text.context.y && next[1] < text.context.y )
                 ){
                    text.context.y += 7;
                    text.context.textBaseline = "top"
                }
              
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
        "chartx/chart/line/group",
        "chartx/chart/line/markcolumn",
        "canvax/core/Base",
        "canvax/event/EventDispatcher"
    ],
    function(Canvax, Rect, Tools, Group, markColumn, CanvaxBase , CanvaxEventDispatcher) {
        var Graphs = function(opt, root) {
            this.w = 0;
            this.h = 0;
            this.y = 0;

            //这里所有的opt都要透传给 group
            this.opt = opt;
            this.root = root;
            this.ctx = root.stage.context2D;
            this.dataFrame = opt.dataFrame || root.dataFrame; //root.dataFrame的引用
            this.data = []; //二维 [[{x:0,y:-100,...},{}],[]]

            //field默认从this.dataFrame.yAxis.field获取
            this.field = this.dataFrame.yAxis.field;

            //一个记录了原始yAxis.field 一些基本信息的map
            //{ "uv" : {ind : 0 , _yAxis : , line} ...}
            this._yAxisFieldsMap = {};
            this._setyAxisFieldsMap( this.field );

            
            this.disX = 0; //点与点之间的间距
            this.groups = []; //群组集合     

            this.iGroup = 0; //群组索引(哪条线)
            this.iNode = -1; //节点索引(那个点)

            this.sprite = null;
            this.induce = null;

            this.eventEnabled = true;

            //TODO:
            //暂时继承CanvaxEventDispatcher 只有 DisplayObject才行， 以为其他对象没有_eventMap
            //临时加上
            this._eventMap = {};

            this.init(opt);
        };
        CanvaxBase.creatClass( Graphs , CanvaxEventDispatcher , {
            init: function(opt) {
                this.opt = opt;
                _.deepExtend(this, opt);
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

                this.disX = this._getGraphsDisX();

                this.data = this._trimGraphs();
                
                this._widget(opt);
                
                var me = this;
                _.each( this.groups , function( group ){
                    me._yAxisFieldsMap[group.field].line = group.line;
                } );
            },
            reset: function(opt , dataFrame) {
                var me = this;

                if(dataFrame){
                    me.dataFrame = dataFrame;
                    me.data = me._trimGraphs();
                };

                if( opt ){
                    _.deepExtend(me, opt);
                    if( opt.yAxisChange ){
                        me.yAxisFieldChange( opt.yAxisChange , this.dataFrame);
                    };
                };

                this.disX = this._getGraphsDisX();

                for (var a = 0, al = me.field.length; a < al; a++) {
                    var group = me.groups[a];
                    group.reset({
                        data: me.data[ group.field ]
                    });
                };
            },
            //_yAxis, dataFrame
            _trimGraphs: function( ) {
                var self = this;
                //柱折混合图里面会把_yAxis设置为_yAxisR
                var _yAxis = self._yAxis || self.root._yAxis;
                var _dataFrame = self.dataFrame || self.root.dataFrame;

                var maxYAxis = _yAxis.dataSection[_yAxis.dataSection.length - 1];
                var tmpData = {}; //{"uv":[{}.. ,"click"]}
                var center = [];
                function __trimGraphs(_fields, _center, _firstLay) {
                    for (var i = 0, l = _fields.length; i < l; i++) {

                        var field = _fields[i];
                        
                        if (_firstLay && self.root.biaxial && i > 0) {
                            self._yAxisFieldsMap[ field ].yAxisInd = 1; //1代表右边的y轴
                            _yAxis = self.root._yAxisR;
                            maxYAxis = _yAxis.dataSection[_yAxis.dataSection.length - 1];
                        };

                        if (_.isArray( field )) {
                            var __center = [];
                            _center.push(__center);
                            __trimGraphs( field, __center );
                        } else {
                            var maxValue = 0;
                            _center[i] = {};

                            //单条line的全部data数据
                            var _lineData = _dataFrame.getFieldData(field);
                            if( !_lineData ) return;

                            var _groupData = [];
                            for (var b = 0, bl = _lineData.length; b < bl; b++) {

                                //不能用x轴组件的x值， 要脱离关系， 各自有自己的一套计算方法，以为x轴的数据是可能完全自定义的
                                //var x = self.root._xAxis.data[b].x;
                                //下面这个就是 完全自己的一套计算x position的方法
                                //var x = b * self.root._xAxis.xGraphsWidth / (bl-1);
                                
                                var x = self.root._xAxis.getPosX( {
                                    ind : b,
                                    dataLen : bl,
                                    layoutType : self.root.xAxis.layoutType
                                } );
                                
                                var y = -(_lineData[b] - _yAxis._bottomNumber) / (maxYAxis - _yAxis._bottomNumber) * _yAxis.yGraphsHeight
                                y = isNaN(y) ? 0 : y
                                _groupData.push( {
                                    value: _lineData[b],
                                    x: x,
                                    y: y
                                } );

                                maxValue += _lineData[b]
                            };

                            tmpData[ field ] = _groupData;

                            _center[i].agValue = maxValue / bl;
                            _center[i].agPosition = -(_center[i].agValue - _yAxis._bottomNumber) / (maxYAxis - _yAxis._bottomNumber) * _yAxis.yGraphsHeight;
                        }
                    }
                };

                __trimGraphs( self._getYaxisField(), center, true);

                //均值
                _dataFrame.yAxis.center = center;
                return tmpData;
            },
            /**
             * 生长动画
             */
            grow: function(callback) {
                var gi = 0;
                var gl = this.groups.length;
                var me = this;
                _.each(this.groups, function(g, i) {
                    g._grow(function(){
                        gi++;
                        callback( g );
                        if( gi == gl ){
                            me.fire("growComplete");
                        }
                    });
                });
                return this;
            },
            _setyAxisFieldsMap: function( fields ) {
                var me = this;
                me._yAxisFieldsMap = {};
                _.each(_.flatten( fields ), function(field, i) {
                    var _yAxisF = me._yAxisFieldsMap[field];
                    if( _yAxisF ){
                        me._yAxisFieldsMap[field].ind = i;
                    } else {
                        me._yAxisFieldsMap[field] = {
                            ind: i,
                            yAxisInd: 0 //0为依赖左边的y轴，1为右边的y轴
                        };
                    }
                });
            },
            //如果add的field是之前_yAxisFieldsMap中没有的，默认都是添加到左边的y轴
            _addNewField: function( field ){
                if( !this._yAxisFieldsMap[field] ){
                    var maxInd;
                    for( var f in this._yAxisFieldsMap ){
                        if( isNaN( maxInd ) ){
                            maxInd = 0;
                        };
                        maxInd = Math.max( this._yAxisFieldsMap[f].ind , maxInd );
                    };
                    this._yAxisFieldsMap[field] = {
                        ind : isNaN( maxInd )? 0 : ++maxInd,
                        yAxisInd : 0
                    };
                };
            },
            _getYaxisField: function(i) {
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
            yAxisFieldChange : function( yAxisChange , dataFrame ){
                this.dataFrame = dataFrame;
                this.data = this._trimGraphs();

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
                        me.field.splice( i , 1 );
                        delete me._yAxisFieldsMap[ _f ];
                        i--;
                        l--;
                    };
                };

                //然后把新的field设置好
                this.field = this.dataFrame.yAxis.field;
                //remove掉被去掉的field后，重新整理下 _yAxisFieldsMap
                me._setyAxisFieldsMap( this.field );


                //新的field配置有需要add的
                _.each( yAxisChange , function( opy , i ){
                    var fopy = _.find( me.groups ,function( f ){
                        return f.field == opy;
                    } );
                    if( !fopy ){
                        me.add(opy);
                    };

                } );

                _.each( me.groups , function( g , i ){
                    g.update( _.extend({
                        _groupInd : i
                    } , me.opt ));
                } );

                
            },
            //add 和 remove 都不涉及到 _yAxisFieldsMap 的操作,只有reset才会重新构建 _yAxisFieldsMap
            add: function(field , opt) {

                _.deepExtend(this, opt);

                this._addNewField( field );
                
                this.data = this._trimGraphs();
                
                var creatFs = this.creatFields(field , this._getYaxisField());
                
                this._setGroupsForYfield( creatFs );
                
                this.update();
            },
            /*
             *删除 ind
             **/
            remove: function(i) {
                this.groups.splice(i, 1)[0].destroy();
                this.data = this._trimGraphs();
                this.update();
            },
            /*
             * 更新下最新的状态
             **/
            update: function(opt) {
                var self = this;
                _.each(this.groups, function(g, i) {
                    g.update({
                        data: self.data[ g.field ]
                    });
                });
            },
            _setGroupsForYfield: function(fields) {

                var gs = [];
                var self = this;
                for (var i = 0, l = fields.length; i < l; i++) {
                    
                    //只有biaxial的情况才会有双轴，才会有 下面isArray(fields[i])的情况发生
                    if (_.isArray(fields[i])) {
                        self._setGroupsForYfield(fields[i]);
                    } else {
                        var _groupData = this.data[ fields[i] ];
                        if( !(fields[i] && _groupData) )  continue;

                        var _sort = self.root._yAxis.sort;
                        var _biaxial = self.root.biaxial;
                        var _yAxis = self.root._yAxis; 

                        //记录起来该字段对应的应该是哪个_yAxis
                        var yfm = self._yAxisFieldsMap[fields[i]];

                        if (_.isArray(_sort)) {
                            _sort = (_sort[yfm.yAxisInd] || "asc");
                        };
                        if (_biaxial) {
                            if (yfm.yAxisInd > 0) {
                                _yAxis = self.root._yAxisR
                            };
                        };

                        var _groupInd = yfm.ind;

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
                            data: _groupData,
                            resize : self.resize
                        });
                        self.sprite.addChildAt(group.sprite , i);

                        var insert = false;
                        //在groups数组中插入到比自己_groupInd小的元素前面去
                        for( var gi=0,gl=self.groups.length ; gi<gl ; gi++ ){
                            if( _groupInd < self.groups[gi]._groupInd ){
                                self.groups.splice( gi , 0 , group );
                                insert=true;
                                break;
                            }
                        };
                        //否则就只需要直接push就好了
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

                self._setGroupsForYfield( self.field );
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

                if (self.eventEnabled) {

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
                self.resize = false;
            },
            _getInfoHandler: function(e) {
                
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
            },
            getNodesInfoOfx: function( x ){
                var _nodesInfoList = []; //节点信息集合
                for (var a = 0, al = this.groups.length; a < al; a++) {
                    var o = this.groups[a].getNodeInfoOfX(x);
                    o && _nodesInfoList.push(o);
                };
                var node = {
                    iGroup: -1,
                    iNode: -1,
                    nodesInfoList: _.clone(_nodesInfoList)
                };
                return node;
            },
            createMarkColumn: function( x , opt ){
                var ml = new markColumn( opt );
                this.sprite.addChild( ml.sprite );
                ml.h = this.induce.context.height;
                ml.y = -ml.h;
                var e = {
                    eventInfo :  this.getNodesInfoOfx(x)
                }
                ml.show( e , {x : x} );
                ml.data = e.eventInfo;

                return ml;
            },
            //每两个点之间的距离
            _getGraphsDisX: function() {
                var dsl = this.dataFrame.org.length - 1;
                var n = this.w / (dsl - 1);
                if (dsl == 1) {
                    n = 0
                }
                return n
            },
        });
        
        return Graphs;
    }
);

define(
    "chartx/chart/line/index", [
        'chartx/chart/index',
        'chartx/utils/tools',
        'chartx/utils/datasection',
        'chartx/components/xaxis/xAxis',
        'chartx/components/yaxis/yAxis',
        'chartx/components/back/Back',
        'chartx/components/anchor/Anchor',
        'chartx/chart/line/graphs',
        'chartx/chart/line/tips',
        'chartx/utils/dataformat',
        'chartx/components/datazoom/index',
        'chartx/components/legend/index',
        'chartx/components/markline/index'
    ],
    function(Chart, Tools, DataSection, xAxis, yAxis, Back, Anchor, Graphs, Tips, dataFormat, DataZoom , Legend, MarkLine) {
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
                this._tips = null;

                this.xAxis = {
                    layoutType : "rule"
                };
                this.yAxis = {};
                this.graphs = {};

                this._markLines = [];

                this.biaxial = false;

                _.deepExtend(this, opts);

                this.dataFrame = this._initData(data, this);
            },
            draw: function( e ) {
                this._setLegend(e);
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
                this._startDraw( e ); //开始绘图
                this._endDraw();
                this.inited = true;
            },
            reset: function(opt) {
                var me = this;
                this._reset && this._reset( opt );
                
                if (opt && opt.options) {
                    _.deepExtend(this, opt.options);

                    //如果有配置yAxis.field，说明要覆盖之前的yAxis.field配置
                    if( opt.options.yAxis && opt.options.yAxis.field ){
                        if( !opt.options.graphs ){
                            opt.options.graphs = {};
                        };
                        opt.options.graphs.yAxisChange = opt.options.yAxis.field
                    };
                };

                var d = ( this.dataFrame.org || [] );
                if (opt && opt.data) {
                    d = opt.data;
                };
                
                //不管opt里面有没有传入数据，option的改变也会影响到dataFrame。
                this.dataFrame = this._initData( d , this);

                //如果markLine.y有配置，需要加入到yAxis.org中去,以为yAixs的dataSection区间可能就不一样了
                if( this.markLine && this.markLine.y ){
                    this.dataFrame.yAxis.org.push( this.markLine.y );
                };

                this.__reset( opt.options );
            },
            /*
             * 如果只有数据改动的情况
             */
            resetData: function(data) {
                this.dataFrame = this._initData(data, this);
                this.__reset();
            },
            __reset: function( opt ){
                opt = !opt ? this : opt;
                
                this._xAxis.reset( opt.xAxis , this.dataFrame.xAxis );
                this._yAxis.reset( opt.yAxis , this.dataFrame.yAxis );

                //_graphs比如最后reset
                this._graphs.reset( opt.graphs , this.dataFrame);

                _.each(this._markLines , function( ml , i ){
                    ml.reset({
                        line: {
                            y : ml._yAxis.getYposFromVal( ml.value )
                        }
                    } ,i);
                }); 
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
                this._yAxis.reset(this.yAxis, this.dataFrame.yAxis);

                //然后yAxis更新后，对应的背景也要更新
                this._back.update({
                    xAxis: {
                        data: this._yAxis.layoutData
                    }
                });

                this._graphs.add(field);
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

                this._yAxis.reset(this.yAxis, this.dataFrame.yAxis);

                //然后yAxis更新后，对应的背景也要更新
                this._back.update({
                    xAxis: {
                        data: this._yAxis.layoutData
                    }
                });
                //然后就是删除graphs中对应的brokenline，并且把剩下的brokenline缓动到对应的位置
                this._graphs.remove(ind);
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

                if( this.markLine && this.markLine.y ){
                    this.dataFrame.yAxis.org.push( this.markLine.y );
                };

                this._yAxis = new yAxis(this.yAxis, this.dataFrame.yAxis );

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

                this._tips = new Tips(this.tips, this.dataFrame, this.canvax.getDomContainer());
            },
            _startDraw: function(opt) {
                // this.dataFrame.yAxis.org = [[201,245,288,546,123,1000,445],[500,200,700,200,100,300,400]]
                // this.dataFrame.xAxis.org = ['星期一','星期二','星期三','星期四','星期五','星期六','星期日']
                var self = this;
                !opt && (opt ={});
                var w = opt.w || this.width;
                var h = opt.h || this.height;

                var y = this.height - this._xAxis.height;
                var graphsH = y - this.padding.top - this.padding.bottom;

                //绘制yAxis
                this._yAxis.draw({
                    pos: {
                        x: this.padding.left,
                        y: y - this.padding.bottom
                    },
                    yMaxHeight: graphsH,
                    resize : opt.resize
                });

                if (this.dataZoom.enabled) {
                    this.__cloneChart = this._getCloneLine();
                    this._yAxis.reset( {
                        animation: false
                    } , this.__cloneChart.thumbBar.dataFrame.yAxis);
                };

                var _yAxisW = this._yAxis.width;



                //如果有双轴
                var _yAxisRW = 0;
                if (this._yAxisR) {
                    this._yAxisR.draw({
                        pos: {
                            x: 0, //this.padding.right,
                            y: y - this.padding.bottom
                        },
                        yMaxHeight: graphsH,
                        resize : opt.resize
                    });
                    _yAxisRW = this._yAxisR.width;
                    this._yAxisR.setX(this.width - _yAxisRW - this.padding.right + 1);
                };

                //绘制x轴
                this._xAxis.draw({
                    graphh: h - this.padding.bottom,
                    graphw: this.width - _yAxisRW - this.padding.right,
                    yAxisW: _yAxisW,
                    resize: opt.resize
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
                    },
                    resize: opt.resize
                });

                this._graphs.draw({
                    w: this._xAxis.xGraphsWidth,
                    h: this._yAxis.yGraphsHeight,
                    smooth: this.smooth,
                    inited: this.inited,
                    resize: opt.resize
                });

                this._graphs.setX(_yAxisW), this._graphs.setY(y - this.padding.bottom);

                //绘制完grapsh后，要把induce 给到 _tips.induce
                this._tips.setInduce( this._graphs.induce );

                var me = this;


                //如果是双轴折线，那么graphs之后，还要根据graphs中的两条折线的颜色，来设置左右轴的颜色
                if (this.biaxial && 
                    (
                        (this.yAxis.text && !this.yAxis.text.fillStyle) || 
                        (this.yAxis.line && !this.yAxis.line.strokeStyle)
                    )
                    ) {
                    _.each(this._graphs.groups, function(group, i) {
                        var color = group._bline.context.strokeStyle;
                        if (i == 0) {
                            me._yAxis.setAllStyle(color);
                        } else {
                            me._yAxisR.setAllStyle(color);
                        }
                    });
                };

                //执行生长动画
                if (!this.inited) {
                    this._graphs.grow(function(g) {
                        me._initPlugs(me._opts, g);
                    }).on("growComplete" , function(){
                        me.fire("complete");
                        me._opts.markLine && me._initMarkLine();
                    });
                };

                this.bindEvent(this._graphs.sprite);
                this._tips.sprite.on('nodeclick', function(e) {
                    self._setXaxisYaxisToTipsInfo(e);
                    self.fire("nodeclick", e.eventInfo);
                })

                if (this._anchor.enabled) {
                    //绘制点位线
                    //debugger
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
                            y: y - _graphsH - this.padding.top
                        }
                    });
                    //this._anchor.setY(y)
                };

                if (this.dataZoom.enabled) {
                    this._initDataZoom();
                };

                //如果有 legend ，调整下位置,和设置下颜色
                if( this._legend && (!this._legend.inited || opt.resize) ){
            
                    this._legend.pos( { x : _yAxisW } );

                    _.each( this._graphs.groups , function( g ){
                        me._legend.setStyle( g.field , {
                            fillStyle : g.__lineStrokeStyle
                        } );
                    } );

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
                this.stageTip.addChild(this._tips.sprite);
            },

            //设置图例 begin
            _setLegend: function( e ){
                !e && (e={});
                var me = this;
                if( !this.legend || (this.legend && "enabled" in this.legend && !this.legend.enabled) ) return;
                //设置legendOpt
                var legendOpt = _.deepExtend({
                    enabled:true,
                    label  : function( info ){
                       return info.field
                    },
                    onChecked : function( field ){
                       me.add( field );
                    },
                    onUnChecked : function( field ){
                       me.remove( field );
                    }
                } , this._opts.legend);
                
                this._legend = new Legend( this._getLegendData() , legendOpt );
                this.stage.addChild( this._legend.sprite );
                this._legend.pos( {
                    x : 0,
                    y : this.padding.top + ( e.resize ? -this._legend.height : 0 )
                } );

                !e.resize && (this.padding.top += this._legend.height);
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
                //如果有配置opts.markLine.y， 就说明这个markline是用户自己要定义的
                if (opts.markLine && opts.markLine.y === undefined) {
                    this._initAverageLine(g);
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
                //初始化 datazoom 模块
                var dataZoomOpt = _.deepExtend({
                    w: me._xAxis.xGraphsWidth,
                    //h : me._xAxis.height,
                    pos: {
                        x: me._xAxis.pos.x,
                        y: me._xAxis.pos.y + me._xAxis.height
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
            _initMarkLine: function(){
                var me = this;
                if( !me.markLine.target && !me.markLine.field && me.markLine.y !== undefined ){
                    var _y = me.markLine.y;
                    if( !_.isArray(_y) ){
                        _y = [_y]
                    };
                    function getProp( obj , p , i , def){
                        if( obj == undefined ) return def;
                        if( obj[p] == undefined ) return def;
                        if( !_.isArray(obj[p]) ) return obj[p];
                        return obj[p][i] == undefined ? def : obj[p][i] 
                    };
                    _.each( _y , function( y , i ){
                        var posY = me._yAxis.getYposFromVal(y);
                        var strokeStyle = getProp(me.markLine , "strokeStyle" , i , "#999");
                        var yAxis = me._yAxis;
                        //TODO: 如果这样有双轴，还需要一个配置告诉我你这个markLine需要附属到哪个yAxis上面去
                        me._createMarkLine("",y, posY, "markline："+y, strokeStyle , yAxis);
                    } );
                }
            },
            //markline begin
            _initAverageLine: function(g, dataFrame) {
                var me = this;

                //如果markline有target配置，那么只现在target配置里的字段的 markline
                var _t = me.markLine.field || me.markLine.target;
                if( _t && !( ( _.isArray(_t) && _.indexOf( _t , g.field )>=0 ) || (_t === g.field) ) ){
                    return;
                };

                var index = g._groupInd;
                var pointList = _.clone(g._pointList);
                dataFrame || (dataFrame = me.dataFrame);
                var center = parseInt(dataFrame.yAxis.center[index].agPosition);
                var center_v = dataFrame.yAxis.center[index].agValue
                var content = g.field + '均值', strokeStyle = g.line.strokeStyle;
                if (me.markLine.text && me.markLine.text.enabled) {
                    if (_.isFunction(me.markLine.text.format)) {
                        var o = {
                            iGroup: index,
                            value: dataFrame.yAxis.center[index].agValue
                        }
                        content = me.markLine.text.format(o)
                    }
                };

                me._createMarkLine(g.field,center_v, center, content, strokeStyle , g._yAxis);
            },
            _createMarkLine: function( field, yVal, yPos, content, strokeStyle , yAxis){
                var me = this;
                var o = {
                    w: me._xAxis.xGraphsWidth,
                    h: me._yAxis.yGraphsHeight,
                    value: yVal,
                    origin: {
                        x: me._back.pos.x,
                        y: me._back.pos.y
                    },
                    line: {
                        y: yPos,
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
                    field: field
                };

                new MarkLine(_.deepExtend( me._opts.markLine, o) , yAxis).done(function() {
                    me.core.addChild(this.sprite);
                    me._markLines.push( this ); 
                });
            },
            //markline end

            bindEvent: function(spt, _setXaxisYaxisToTipsInfo) {
            
                var self = this;
                _setXaxisYaxisToTipsInfo || (_setXaxisYaxisToTipsInfo = self._setXaxisYaxisToTipsInfo);
                spt.on("panstart mouseover", function(e) {
                    if (self._tips.enabled && e.eventInfo.nodesInfoList.length > 0) {
                        //self._tips.hide(e);

                        _setXaxisYaxisToTipsInfo.apply(self, [e]);
                        
                        self._tips.show(e);
                    }
                });
                spt.on("panmove mousemove", function(e) {
                    if (self._tips.enabled) {
                        if (e.eventInfo.nodesInfoList.length > 0) {
                            _setXaxisYaxisToTipsInfo.apply(self, [e]);
                            if (self._tips._isShow) {
                                self._tips.move(e);
                            } else {
                                self._tips.show(e);
                            }
                        } else {
                            if (self._tips._isShow) {
                                self._tips.hide(e);
                            }
                        }
                    }
                });
                spt.on("panend mouseout", function(e) {
                    if (e.toTarget && ( e.toTarget.name == '_markcolumn_node' || e.toTarget.name == '_markcolumn_line')) {
                        return
                    }
                    if (self._tips.enabled) {
                        self._tips.hide(e);
                    }
                });
                spt.on("tap", function(e) {
                    if (self._tips.enabled && e.eventInfo.nodesInfoList.length > 0) {
                        self._tips.hide(e);
                        _setXaxisYaxisToTipsInfo.apply(self, [e]);
                        self._tips.show(e);
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

                var value;

                if( e.eventInfo.xAxis && e.eventInfo.xAxis.value ){
                    value = e.eventInfo.xAxis.value;
                } else {
                    value = this.dataFrame.xAxis.org[0][e.eventInfo.iNode];
                }

                var me = this;
                e.eventInfo.xAxis = _.extend({
                    field: this.dataFrame.xAxis.field,
                    value: value
                } , e.eventInfo.xAxis);

                e.eventInfo.dataZoom = me.dataZoom;

                e.eventInfo.rowData = this.dataFrame.getRowData( e.eventInfo.iNode );

                e.eventInfo.iNode += this.dataZoom.range.start;
            },
            //根据x轴分段索引和具体值,计算出处于Graphs中的坐标
            _getPosAtGraphs: function(index, num) {
                var x = this._xAxis.data[index].x;
                var y = this._graphs.data[ this._yAxis.field[0] ][index].y
                return {
                    x: x,
                    y: y
                }
            },
            
            createMarkColumn: function( xVal , opt){
                return this._graphs.createMarkColumn( this._xAxis.getPosX( {val : xVal} ) , _.extend(opt,{xVal: xVal}));
            },
            moveMarkColumnTo: function( mcl , xval , opt ){
                var x = this._xAxis.getPosX( {val : xval} );
                return mcl.move( {
                    eventInfo: this._graphs.getNodesInfoOfx( x )
                } , {
                    x: x,
                    xVal: xval
                });
            }
        });
        return Line;
    }
);