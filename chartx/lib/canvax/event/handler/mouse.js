/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 */
define(
    "canvax/event/handler/mouse",
    [
        "canvax/core/Base",
        "canvax/display/Point",
        "canvax/event/CanvaxEvent"
    ],
    function( Base , Point , CanvaxEvent ){
        var mouseHandler = function(){
        
        };
        mouseHandler.prototype = {
            init : function(){
                //依次添加上浏览器的自带事件侦听
                var me   = this;
                var root = this.canvax;
                _.each( ["click","dblclick","mousedown","mousemove","mouseup","mouseout"] , function( type ){
                    Base.addEvent( root.el , type , function( e ){
                        root.updateRootOffset();
                        me.__mouseHandler( e );
                        /*
                        me._stopBubble(e);
                        me._stopDefault(e);
                        */
                    } ); 
                } );   
            },
            /*
             * 鼠标事件处理函数
             * */
            __mouseHandler : function(e) {
                var me = this;
                var root = me.canvax;
            
                me.curPoints = [ new Point( 
                    CanvaxEvent.pageX( e ) - root.rootOffset.left , 
                    CanvaxEvent.pageY( e ) - root.rootOffset.top
                    )];
 
                var curMousePoint  = me.curPoints[0]; 
                var curMouseTarget = me.curPointsTarget[0];
 
                //mousedown的时候 如果 curMouseTarget.dragEnabled 为true。就要开始准备drag了
                if( e.type == "mousedown" ){
                   //如果curTarget 的数组为空或者第一个为falsh ，，，
                   if( !curMouseTarget ){
                     var obj = root.getObjectsUnderPoint( curMousePoint , 1)[0];
                     if(obj){
                       me.curPointsTarget = [ obj ];
                     }
                   }
                   curMouseTarget = me.curPointsTarget[0];
                   if ( curMouseTarget && curMouseTarget.dragEnabled ){
                       me._touching = true
                   }
                }
 
                var contains = document.compareDocumentPosition ? function (parent, child) {
                    if( !child ){
                        return false;
                    }
                    return !!(parent.compareDocumentPosition(child) & 16);
                } : function (parent, child) {
                    if( !child ){
                        return false;
                    }
                    return child !== child && (parent.contains ? parent.contains(child) : true);
                };

                if( e.type == "mouseup" || (e.type == "mouseout" && !contains(root.el , (e.toElement || e.relatedTarget) )) ){
                    if(me._draging == true){
                        //说明刚刚在拖动
                        me._dragEnd( e , curMouseTarget , 0 );
                        curMouseTarget.fire("dragend" , {
                            point : curMousePoint
                        });
                    };
                    me._draging  = false;
                    me._touching = false;
                };
 
                if( e.type == "mouseout" ){
                    if( !contains(root.el , (e.toElement || e.relatedTarget) ) ){
                        me.__getcurPointsTarget(e , curMousePoint);
                    }
                } else if( e.type == "mousemove" ){  //|| e.type == "mousedown" ){
                    //拖动过程中就不在做其他的mouseover检测，drag优先
                    if(me._touching && e.type == "mousemove" && curMouseTarget){
                        //说明正在拖动啊
                        if(!me._draging){
                            
                            //begin drag
                            //curMouseTarget.dragBegin && curMouseTarget.dragBegin(e);

                            curMouseTarget.fire("dragbegin" , {
                                point : curMousePoint
                            });
                            
                            curMouseTarget._globalAlpha = curMouseTarget.context.globalAlpha;

                            //先把本尊给隐藏了
                            curMouseTarget.context.globalAlpha = 0;
                                                 
                            //然后克隆一个副本到activeStage
                            var cloneObject = me._clone2hoverStage( curMouseTarget , 0 );

                            cloneObject.context.globalAlpha = curMouseTarget._globalAlpha;
                            
                        } else {
                            
                            //drag ing
                            me._dragHander( e , curMouseTarget , 0 );

                            curMouseTarget._notWatch = true;
                            curMouseTarget.fire("draging" , {
                                point : curMousePoint
                            });
                            curMouseTarget._notWatch = false;

                            //拖动中可能会限定其x,y轨迹。必须拖动的时候，x或者y轴恒定
                            //比如在kanga中的rect调整框的上下左右改变大小的时候x或者y有一个会是恒定的
                            var _dragDuplicate = root._hoverStage.getChildById( curMouseTarget.id );
                            var _dmt = curMouseTarget.getConcatenatedMatrix();
 
                            _dragDuplicate.context.x = _dmt.tx;//curMouseTarget.context.x;
                            _dragDuplicate.context.y = _dmt.ty;//curMouseTarget.context.y;
                        }
                        me._draging = true;
                    } else {
                        //常规mousemove检测
                        //move事件中，需要不停的搜索target，这个开销挺大，
                        //后续可以优化，加上和帧率相当的延迟处理
                        me.__getcurPointsTarget( e , curMousePoint );
                    }
 
                } else {
                    //其他的事件就直接在target上面派发事件
                    var child = curMouseTarget;
                    if( !child ){
                        child = root;
                    };
                    me.__dispatchEventInChilds( e , [ child ] );
                    me._cursorHander( child );
                }
                if( root.preventDefault ) {
                    //阻止默认浏览器动作(W3C) 
                    if ( e && e.preventDefault ) {
                        e.preventDefault(); 
                    } else {
                        window.event.returnValue = false;
                    }
                }
 
            },
            __getcurPointsTarget : function(e , point ) {
                var me     = this;
                var root   = me.canvax;
                var oldObj = me.curPointsTarget[0];
 
                var e = new CanvaxEvent( e );
 
                if( e.type=="mousemove"
                    && oldObj && oldObj._hoverClass && oldObj.pointChkPriority
                    && oldObj.getChildInPoint( point ) ){
                    //小优化,鼠标move的时候。计算频率太大，所以。做此优化
                    //如果有target存在，而且当前元素正在hoverStage中，而且当前鼠标还在target内,就没必要取检测整个displayList了
                    //开发派发常规mousemove事件
                    e.target = e.currentTarget = oldObj;
                    e.point  = oldObj.globalToLocal( point );
                    oldObj.dispatchEvent( e );
                    return;
                };
                var obj = root.getObjectsUnderPoint( point , 1)[0];
 
                if(oldObj && oldObj != obj || e.type=="mouseout") {
                    if( oldObj && oldObj.context ){
                        me.curPointsTarget[0] = null;
                        e.type     = "mouseout";
                        e.toTarget = obj; 
                        e.target   = e.currentTarget = oldObj;
                        e.point    = oldObj.globalToLocal( point );
                        oldObj.dispatchEvent( e );
                    }
                };
 
                if( obj && oldObj != obj ){ //&& obj._hoverable 已经 干掉了
                    me.curPointsTarget[0] = obj;
                    e.type       = "mouseover";
                    e.fromTarget = oldObj;
                    e.target     = e.currentTarget = obj;
                    e.point      = obj.globalToLocal( point );
                    obj.dispatchEvent( e );
                };
 
                if( e.type == "mousemove" && obj ){
                    e.target = e.currentTarget = oldObj;
                    e.point  = oldObj.globalToLocal( point );
                    oldObj.dispatchEvent( e );
                };
                me._cursorHander( obj , oldObj );
            },
            _cursorHander    : function( obj , oldObj ){
                if(!obj && !oldObj ){
                    this._setCursor("default");
                }
                if(obj && oldObj != obj && obj.context){
                    this._setCursor(obj.context.cursor);
                }
            },
            _setCursor : function(cursor) {
                if(this._cursor == cursor){
                  //如果两次要设置的鼠标状态是一样的
                  return;
                };
                this.canvax.el.style.cursor = cursor;
                this._cursor = cursor;
            }
        };
        return mouseHandler;
    } 
);


