define(
    "chartx/chart/tree/index",
    [ 
        "chartx/chart/index",
        "canvax/shape/Rect",
        "canvax/shape/Line",
        "canvax/shape/Circle",
        "chartx/layout/tree/dagre",
        "canvax/animation/Tween"
    ],
    function( Chart , Rect , Line , Circle , Dagre , Tween ){
        var Canvax = Chart.Canvax;
        return Chart.extend({
            init : function( node , data , opts ){
                _.deepExtend( this , opts );
                this.data   = data;
                this.nodeFillStyle   = "#6f8cb2";
                this.nodeStrokeStyle = "#c77029";
                this.linkStrokeStyle = "#896149";

                //所有node分布的 外围矩形范围
                this._nodesRect = {
                    left : 0,
                    top  : 0,
                    right  : 0,
                    bottom : 0
                }
                window._nodesRect = this._nodesRect;

                //用来触发scale 和 drag 的rect原件
                this._scaleDragHandRect = new Rect({
                    context : {
                        width : this.width,
                        height: this.height,
                        fillStyle   : "black",
                        globalAlpha : 0
                    }
                });
                this.stage.addChild(this._scaleDragHandRect);


                this.sprite  = new Canvax.Display.Sprite(); 
                this.stage.addChild( this.sprite );

                this.nodesSp = new Canvax.Display.Sprite({id:"nodesSprite"}); 
                this.sprite.addChild( this.nodesSp );

                this.linksSp = new Canvax.Display.Sprite({id:"linksSprite"}); 
                this.sprite.addChild( this.linksSp );

                

            },
            draw : function(){
                this.g = new Dagre.graphlib.Graph();

                this.g.setGraph({
                    //rankdir : "BT"
                });

                this.g.setDefaultEdgeLabel(function() { return {}; });

                this._initNodesAndLinks();

                this._widget();
                this._initNodesSpritePos();

                this._initEventHand();
            }, 
            _initEventHand : function(){
                var me = this;
                var isDragIng = false;
                this._scaleDragHandRect.on("mousedown" , function(e){
                    me._scaleDragHandRect.toFront();
                    isDragIng = true;
                    me._dragTreeBegin(e);
                });

                this._scaleDragHandRect.on("mousemove" , function(e){
                    if( isDragIng ){
                        me._dragTreeIng(e);
                    }
                });

                this._scaleDragHandRect.on("mouseup mouseout" , function(e){
                     me._scaleDragHandRect.toBack();
                     isDragIng = false;
                     me._dragTreeEnd(e);
                });
            },
            //最近一次move的point
            _lastDragPoint : null,
            //开始拖动tree
            _dragTreeBegin : function(e){
                this._lastDragPoint = e.point;
            },
            //tree 拖动中
            _dragTreeIng   : function(e){
                this.sprite.context.x += (e.point.x - this._lastDragPoint.x);
                this.sprite.context.y += (e.point.y - this._lastDragPoint.y);
                this._lastDragPoint = e.point;
            },
            //tree 拖动结束
            _dragTreeEnd   : function(e){
                this._lastDragPoint = null;
            },
            /**
             *添加节点
             *@data param 要添加的 子节点。一次添加一个 {id : { label : "text" }}
             *targetId 要添加到的目标node的Id
             */
            addTo : function( data , targetId ){
                for( i in data ){
                    if( this.data[i] ){
                        //说明已经有一个这样的id了
                        return;
                    } else {
                        this.data[i] = data[i];
                        
                        //然后建立好parent的link关系
                        if(!_.contains( this.data[targetId].link , i )){
                            this.data[targetId].link.push( i )
                        };

                        var obj = {};
                        obj[i]  = data[i];
                        var addShapes = this._initNodesAndLinks(obj);
                        obj = null;

                        this._setParentLink( data[i] , targetId );

                        addShapes.push( this._creatLinkLine( targetId , i ) );

                        this.g.setEdge( targetId , i );

                        this._updateLayout( function(){
                            _.each(addShapes , function(shape){
                                shape.context.globalAlpha = 1;
                            });
                            addShapes = null;
                        } );
                        
                    }
                };
            },
            remove : function(id){
                this._remove(id);
                this._updateLayout();
            },
            //删除某个节点，对应的所有子节点都会被删除
            _remove: function( id ){
                var me   = this;
                var node = this.data[id];
                _.each(node.parent , function(parent,i){
                    //先删除父亲节点和自己的关系
                    me.g.removeEdge( parent , id );

                    //然后删除代表关系的链接线
                    me.linksSp.getChildById("link_"+parent+"_"+id).remove();

                });
                _.each(node.link , function( child , i ){
                    me._remove( child );
                });
                delete this.data[id];
                this.g.removeNode(id);
                this.nodesSp.getChildById("label_"+id).remove();
                this.nodesSp.getChildById("rect_"+id).remove();
                node = null;
            },
            _setParentLink : function( child , parentNodeId ){
                if(!child.parent){
                    child.parent = [parentNodeId];
                } else if(!_.contains( child.parent , parentNodeId )) {
                    child.parent.push( parentNodeId );
                }
            },
            //根据data 来 初始化 node  也 连接线 的 shapes 到 sprite
            _initNodesAndLinks : function( data ){
                var me = this;
                var addShapes = null;
                !data ? (data = me.data) : (addShapes = []);
                for( var i in data ){
                    var dataNode = data[i];

                    //先创建text，根据text来计算node需要的width和height
                    var label =  new Canvax.Display.Text( dataNode.label , {
                        id : "label_"+i,
                        context : {
                            fillStyle    : "white",
                            textAlign    : "center",
                            textBaseline : "middle",
                            globalAlpha  : 0
                        }
                    });
                    dataNode.width  = label.getTextWidth()  + 20;
                    dataNode.height = label.getTextHeight() + 15;

                                        
                    var rect = new Rect({
                        id : "rect_"+i,
                        context : {
                            fillStyle   : this.nodeFillStyle,
                            strokeStyle : this.nodeStrokeStyle,
                            lineWidth   : 1,
                            width : dataNode.width,
                            height: dataNode.height,
                            globalAlpha : 0
                        }
                    });

                    this.nodesSp.addChild(rect);
                    this.nodesSp.addChild(label);

                    if(_.isArray(addShapes)){
                        addShapes.push(label);
                        addShapes.push(rect);
                    }


                    me.g.setNode( i , dataNode );

                    if( !dataNode.link ){
                        dataNode.link = [];
                    }

                    var links = dataNode.link;

                    if( links.length > 0 ){
                        _.each( links , function( childId , x ){
           
                            me._creatLinkLine( i , childId);
                       
                            me._setParentLink( data[ childId ] , i );

                            me.g.setEdge( i , childId );

                        } );
                    }
                }

                return addShapes;

            },
            _creatLinkLine : function( pId , cId ){
                var link = new Line({
                    id : "link_"+pId+"_"+cId,
                    context : {
                       strokeStyle : this.nodeStrokeStyle,
                       lineWidth   : 1,
                       globalAlpha : 0
                    }
                });
                this.linksSp.addChild(link);
                return link;
            },
            _widget : function(){
                var me = this;
                
                Dagre.layout(me.g);

                me.g.nodes().forEach(function(v) {
                    var node = me.g.node(v);
                    
                    var lc = me.nodesSp.getChildById("label_" + v).context;
                
                    lc.x = node.x;
                    lc.y = node.y;
                    lc.globalAlpha = 1;

                    var rc  = me.nodesSp.getChildById("rect_" + v).context;
                    rc.x  = node.x - node.width/2;
                    rc.y  = node.y - node.height/2;
                    rc.globalAlpha = 1;

                    me._nodesRect.left = Math.min( me._nodesRect.left , node.x - node.width/2 );
                    me._nodesRect.top  = Math.min( me._nodesRect.top  , node.y - node.height/2 );
                    me._nodesRect.right  = Math.max( me._nodesRect.right  , node.x + node.width/2  );
                    me._nodesRect.bottom = Math.max( me._nodesRect.bottom , node.y + node.height/2 );

                });
                me.g.edges().forEach(function(e) {
                    var edge = me.g.edge(e);
                    var lc = me.linksSp.getChildById("link_"+e.v+"_"+e.w).context;
                    lc.xStart = edge.points[0].x;
                    lc.yStart = edge.points[0].y;
                    lc.xEnd   = edge.points[2].x;
                    lc.yEnd   = edge.points[2].y;
                    lc.globalAlpha = 1;
                });
            },
            _updateLayout : function(callback){
                this._tweenLayout( this._getLayoutChanged() , callback);
            },
            //布局变动 {pos : posTo}
            _getLayoutChanged : function(){
                 var me = this;

                 //先记录所有shapes的原始位置
                 var pos = {};
                 _.each( me.nodesSp.children , function( childShape ){
                     var cc = childShape.context;
                     pos[childShape.id+"_x"] = cc.x;
                     pos[childShape.id+"_y"] = cc.y;
                 } );
                 _.each( me.linksSp.children , function( linkShape ){
                     var lc = linkShape.context;
                     pos[linkShape.id+"_xStart"] = lc.xStart;
                     pos[linkShape.id+"_yStart"] = lc.yStart;
                     pos[linkShape.id+"_xEnd"]   = lc.xEnd;
                     pos[linkShape.id+"_yEnd"]   = lc.yEnd;
                 } );

                 //然后重新layout计算目标布局
                 Dagre.layout( me.g );
                 var posTo = {};
                 me.g.nodes().forEach(function(v) {
                     var node = me.g.node(v);
                    
                     var labelId = "label_" + v;
                     posTo[ labelId + "_x" ] = node.x;
                     posTo[ labelId + "_y" ] = node.y;
                     var rectId  = "rect_" + v;
                     posTo[ rectId + "_x" ]  = node.x - node.width/2;
                     posTo[ rectId + "_y" ]  = node.y - node.height/2;
                     
                 });
                 me.g.edges().forEach(function(e) {
                     var edge   = me.g.edge(e);
                     var linkId = "link_"+e.v+"_"+e.w;
                     posTo[linkId+"_xStart"] = edge.points[0].x;
                     posTo[linkId+"_yStart"] = edge.points[0].y;
                     posTo[linkId+"_xEnd"]   = edge.points[2].x;
                     posTo[linkId+"_yEnd"]   = edge.points[2].y;
                 });

                 return {pos : pos , posTo : posTo}

            },
            /**
             * 重新布局动画
             */
            _tweenLayout : function( obj , callback){
                var me  = this;
                var timer = null;
                var growAnima = function(){
                   var bezierT = new Tween.Tween( obj.pos )
                   .to( obj.posTo, 300 )
                   .onUpdate( function (  ) {

                       for( var id in this ){
                           var val = this[id];
                           var p  = id.slice( id.lastIndexOf("_") ).replace("_","");
                           id  = id.substr( 0 , id.lastIndexOf("_") );

                           if( p == "x" || p == "y" ){
                               me.nodesSp.getChildById( id ).context[p] = val;
                           } else {
                               me.linksSp.getChildById( id ).context[p] = val;
                           }
                       };                       

                   } ).onComplete( function(){
                       cancelAnimationFrame( timer );
                       callback && callback();
                   }).start();
                   animate();
                };
                function animate(){
                    timer    = requestAnimationFrame( animate ); 
                    Tween.update();
                };
                growAnima();
            },

            //初次渲染的时候自动把拓扑图居中
            _initNodesSpritePos : function(){
                this.sprite.context.x = (this.width - (this._nodesRect.right - this._nodesRect.left)) / 2;
                this.sprite.context.y = 10;

            }
        });
    }
);
