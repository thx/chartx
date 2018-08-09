/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 事件派发类
 */


define(
    "canvax/event/EventDispatcher",
    [
        "canvax/core/Base",
        "canvax/event/EventManager"
    ],
    function( Base ,EventManager){

        var EventDispatcher = function(){
            arguments.callee.superclass.constructor.call(this, name);
        };
      
        Base.creatClass(EventDispatcher , EventManager , {
            on : function(type, listener){
                this._addEventListener( type, listener);
                return this;
            },
            addEventListener:function(type, listener){
                this._addEventListener( type, listener);
                return this;
            },
            un : function(type,listener){
                this._removeEventListener( type, listener);
                return this;
            },
            removeEventListener:function(type,listener){
                this._removeEventListener( type, listener);
                return this;
            },
            removeEventListenerByType:function(type){
                this._removeEventListenerByType( type);
                return this;
            },
            removeAllEventListeners:function(){
                this._removeAllEventListeners();
                return this;
            },
            fire : function(eventType , event){
                //因为需要在event上面冒泡传递信息，所以还是不用clone了
                var e       = event || {};//_.clone( event );
                var me      = this;
                if( _.isObject(eventType) && eventType.type ){
                    e         = _.extend( e , eventType );
                    eventType = eventType.type;
                };
                var preCurr = e ? e.currentTarget : null;
                _.each( eventType.split(" ") , function(evt){
                    var preEventType = null;
                    if( !e ){
                        e = { type : evt };
                    } else {
                        //把原有的e.type暂存起来
                        preEventType = e.type;
                        //如果有传递e过来
                        e.type = evt;
                    };
                    e.currentTarget = me;
                    me.dispatchEvent( e );
                    if( preEventType ){
                        e.type = preEventType;
                    }
                } );
                e.currentTarget = preCurr;
                return this;
            },
            dispatchEvent:function(event){
                
                if( this instanceof DisplayObjectContainer && event.point ){
                    var target = this.getObjectsUnderPoint( event.point , 1)[0];
                    if( target ){
                        target.dispatchEvent( event );
                    }
                    return;
                };
                
                if(this.context && event.type == "mouseover"){
                    //记录dispatchEvent之前的心跳
                    var preHeartBeat = this._heartBeatNum;
                    var pregAlpha    = this.context.globalAlpha;
                    this._dispatchEvent( event );
                    if( preHeartBeat != this._heartBeatNum ){
                        this._hoverClass = true;
                        if( this.hoverClone ){
                            var canvax = this.getStage().parent;
                            //然后clone一份obj，添加到_hoverStage 中
                            var activShape = this.clone(true);                     
                            activShape._transform = this.getConcatenatedMatrix();
                            canvax._hoverStage.addChildAt( activShape , 0 ); 
                            //然后把自己隐藏了
                            this._globalAlpha = pregAlpha;
                            this.context.globalAlpha = 0;
                        }
                    }
                    return;
                };
      
                this._dispatchEvent( event );
      
                if( this.context && event.type == "mouseout"){
                    if(this._hoverClass){
                        //说明刚刚over的时候有添加样式
                        var canvax = this.getStage().parent;
                        this._hoverClass = false;
                        canvax._hoverStage.removeChildById(this.id);
                        
                        if( this._globalAlpha ){
                            this.context.globalAlpha = this._globalAlpha;
                            delete this._globalAlpha;
                        }
                    }
                }
      
                return this;
            },
            hasEvent:function(type){
                return this._hasEventListener(type);
            },
            hasEventListener:function(type){
                return this._hasEventListener(type);
            },
            hover : function( overFun , outFun ){
                this.on("mouseover" , overFun);
                this.on("mouseout"  , outFun );
                return this;
            },
            once : function(type, listener){
                this.on(type , function(){
                    listener.apply(this , arguments);
                    this.un(type , arguments.callee);
                });
                return this;
            }
        });
      
        return EventDispatcher;
      
    }
);
