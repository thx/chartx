/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 */
define(
    "canvax/event/handler/touch",
    [
        "canvax/core/Base",
        "canvax/library/hammer"
    ],
    function( Base , Hammer ){
        var EventsTypes = [ 
            "pan","panstart","panmove","panend","pancancel","panleft","panright","panup","pandown",
            "press" , "pressup",
            "swipe" , "swipeleft" , "swiperight" , "swipeup" , "swipedown",
            "tap"
        ];
        var touchHandler = function(){
        
        };
        touchHandler.prototype = {
            init : function(){
                var me        = this;
                var root      = me.canvax;
                var el        = root.el;
                
                me._hammer = new Hammer( el );
                _.each( EventsTypes , function( et ){
                    me._hammer.on(et , function( e ){
                        root.updateRootOffset();
                        me.__touchHandler( e );
                        /*
                        me._stopBubble(e);
                        me._stopDefault(e);
                        */
                    });
                } );
            },
            /*
             *触屏事件处理函数
             * */
            __touchHandler : function( e ) {
                var me   = this;
                var root = me.canvax;
                //用hamer的方式来阻止执行浏览器默认事件
                if( this.preventDefault ) {
                    this._hammer.options.prevent_default = true
                } else {
                    this._hammer.options.prevent_default = false
                }
 
                //touch下的curPointsTarget 从touches中来
                //获取canvax坐标系统里面的坐标
                me.curPoints = me.__getCanvaxPointInTouchs( e );

                //drag开始
                if( e.type == "panstart"){
                    //dragstart的时候touch已经准备好了target，curPointsTarget里面只要有一个是有效的
                    //就认为drags开始
                    _.each( me.curPointsTarget , function( child , i ){
                        if( child && child.dragEnabled ){
                           //只要有一个元素就认为正在准备drag了
                           me._draging = true;
                           //然后克隆一个副本到activeStage
                           me._clone2hoverStage( child , i );
                           //先把本尊给隐藏了
                           child.context.globalAlpha = 0;
 
                           return false;
                        }
                    } ) 
                }
 
                //dragIng
                if( e.type == "panmove"){
                    if( me._draging ){
                        _.each( me.curPointsTarget , function( child , i ){
                            if( child && child.dragEnabled) {
                               me._dragHander( e , child , i);
                            }
                        } )
                    }
                };
 
                //drag结束
                if( e.type == "panend"){
                    if( me._draging ){
                        _.each( me.curPointsTarget , function( child , i ){
                            if( child && child.dragEnabled) {
                                me._dragEnd( e , child , 0 );
                            }
                        } );
                        me._draging = false;
                    }
                }
 
                var childs = me.__getChildInTouchs( me.curPoints );
                if( me.__dispatchEventInChilds( e , childs ) ){
                    me.curPointsTarget = childs;
                } else {
                    //如果当前没有一个target，就把事件派发到canvax上面
                    me.__dispatchEventInChilds( e , [ root ] );
                };
            },
            
            //从touchs中获取到对应touch , 在上面添加上canvax坐标系统的x，y
            __getCanvaxPointInTouchs : function( e ){
                var me        = this;
                var root      = me.canvax;
                var curTouchs = [];
                _.each( e.pointers , function( touch ){
                   touch.x = touch.pageX - root.rootOffset.left , 
                   touch.y = touch.pageY - root.rootOffset.top
                   curTouchs.push( touch );
                });
                return curTouchs;
            },
            __getChildInTouchs : function( touchs ){
                var me   = this;
                var root = me.canvax;
                var touchesTarget = [];
                _.each( touchs , function(touch){
                    touchesTarget.push( root.getObjectsUnderPoint( touch , 1)[0] );
                } );
                return touchesTarget;
            }
        };
        return touchHandler;
    } 
);



