/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * stage 类， 再as3中，stage则代表整个舞台。是唯一的根节点
 * 但是再canvax中，因为分层设计的需要。stage 舞台 同样代表一个canvas元素，但是不是再整个引擎设计
 * 里面， 不是唯一的根节点。而是会交由canvax类来统一管理其层级
 */
define(
    "canvax/display/Stage",
    [
        "canvax/display/DisplayObjectContainer",
        "canvax/core/Base"
    ],
    function( DisplayObjectContainer , Base ){
  
        var Stage = function( ){
            var self = this;
            self.type = "stage";
            self.context2D = null;
            //stage正在渲染中
            self.stageRending = false;
            self._isReady = false;
            arguments.callee.superclass.constructor.apply(this, arguments);
        };
        Base.creatClass( Stage , DisplayObjectContainer , {
            init : function(){},
            //由canvax的afterAddChild 回调
            initStage : function( context2D , width , height ){
               var self = this;
               self.context2D = context2D;
               self.context.width  = width;
               self.context.height = height;
               self.context.scaleX = Base._devicePixelRatio;
               self.context.scaleY = Base._devicePixelRatio;
               self._isReady = true;
            },
            render : function( context ){
                this.stageRending = true;
                //TODO：
                //clear 看似 很合理，但是其实在无状态的cavnas绘图中，其实没必要执行一步多余的clear操作
                //反而增加无谓的开销，如果后续要做脏矩阵判断的话。在说
                this.clear();
                Stage.superclass.render.call( this, context );
                this.stageRending = false;
            },
            heartBeat : function( opt ){
                //shape , name , value , preValue 
                //displayList中某个属性改变了
                if (!this._isReady) {
                   //在stage还没初始化完毕的情况下，无需做任何处理
                   return;
                };
                opt || ( opt = {} ); //如果opt为空，说明就是无条件刷新
                opt.stage   = this;

                //TODO临时先这么处理
                this.parent && this.parent.heartBeat(opt);
            },
            clear : function(x, y, width, height) {
                if(arguments.length >= 4) {
                    this.context2D.clearRect(x, y, width, height);
                } else {
                    this.context2D.clearRect( 0, 0,
                            this.context2D.canvas.width * Math.max(Base._devicePixelRatio,1),
                            this.context2D.canvas.height* Math.max(Base._devicePixelRatio,1)
                    );
                }
            }
        });
        return Stage;
    }
);
         
