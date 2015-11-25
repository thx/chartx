/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 模拟as3 中 的Movieclip类，目前还只是个简单的容易。
 */


define(
    "canvax/display/Movieclip",
    [
        "canvax/display/DisplayObjectContainer",
        "canvax/core/Base"
    ],
    function(DisplayObjectContainer , Base){
      
        var Movieclip = function( opt ){
      
            var self = this;
            opt = Base.checkOpt( opt );
            self.type = "movieclip";
            self.currentFrame  = 0;
            self.autoPlay      = opt.autoPlay   || false;//是否自动播放
            self.repeat        = opt.repeat     || 0;//是否循环播放,repeat为数字，则表示循环多少次，为true or !运算结果为true 的话表示永久循环
      
            self.overPlay      = opt.overPlay   || false; //是否覆盖播放，为false只播放currentFrame 当前帧,true则会播放当前帧 和 当前帧之前的所有叠加
      
            self._frameRate    = Base.mainFrameRate;
            self._speedTime    = parseInt(1000/self._frameRate);
            self._preRenderTime= 0;
      
            self._context = {
                //r : opt.context.r || 0   //{number},  // 必须，圆半径
            }
            arguments.callee.superclass.constructor.apply(this, [ opt ] );
        };
      
        Base.creatClass(Movieclip , DisplayObjectContainer , {
            init : function(){
               
            },
            getStatus    : function(){
                //查询Movieclip的autoPlay状态
                return this.autoPlay;
            },
            getFrameRate : function(){
                return this._frameRate;
            },
            setFrameRate : function(frameRate) {
                
                var self = this;
                if(self._frameRate  == frameRate) {
                    return;
                }
                self._frameRate  = frameRate;
      
                //根据最新的帧率，来计算最新的间隔刷新时间
                self._speedTime = parseInt( 1000/self._frameRate );
            }, 
            afterAddChild:function(child , index){
               if(this.children.length==1){
                  return;
               }
      
               if( index != undefined && index <= this.currentFrame ){
                  //插入当前frame的前面 
                  this.currentFrame++;
               }
            },
            afterDelChild:function(child,index){
               //记录下当前帧
               var preFrame = this.currentFrame;
      
               //如果干掉的是当前帧前面的帧，当前帧的索引就往上走一个
               if(index < this.currentFrame){
                  this.currentFrame--;
               }
      
               //如果干掉了元素后当前帧已经超过了length
               if((this.currentFrame >= this.children.length) && this.children.length>0){
                  this.currentFrame = this.children.length-1;
               };
            },
            _goto:function(i){
               var len = this.children.length;
               if(i>= len){
                  i = i%len;
               }
               if(i<0){
                  i = this.children.length-1-Math.abs(i)%len;
               }
               this.currentFrame = i;
            },
            gotoAndStop:function(i){
               this._goto(i);
               if(!this.autoPlay){
                 //再stop的状态下面跳帧，就要告诉stage去发心跳
                 this._preRenderTime = 0;
                 this.getStage().heartBeat();
                 return;
               }
               this.autoPlay = false;
            },
            stop:function(){
               if(!this.autoPlay){
                 return;
               }
               this.autoPlay = false;
            },
            gotoAndPlay:function(i){
               this._goto(i);
               this.play();
            },
            play:function(){
               if(this.autoPlay){
                 return;
               }
               this.autoPlay = true;
               var canvax = this.getStage().parent;
               if(!canvax._heartBeat && canvax._taskList.length==0){
                   //手动启动引擎
                   canvax.__startEnter();
               }
               this._push2TaskList();
               
               this._preRenderTime = new Date().getTime();
            },
            _push2TaskList : function(){
               //把enterFrame push 到 引擎的任务列表
               if(!this._enterInCanvax){
                 this.getStage().parent._taskList.push( this );
                 this._enterInCanvax=true;
               }
            },
            //autoPlay为true 而且已经把__enterFrame push 到了引擎的任务队列，
            //则为true
            _enterInCanvax:false, 
            __enterFrame:function(){
               var self = this;
               if((Base.now-self._preRenderTime) >= self._speedTime ){
                   //大于_speedTime，才算完成了一帧
                   //上报心跳 无条件心跳吧。
                   //后续可以加上对应的 Movieclip 跳帧 心跳
                   self.getStage().heartBeat();
               }
      
            },
            next  :function(){
               var self = this;
               if(!self.autoPlay){
                   //只有再非播放状态下才有效
                   self.gotoAndStop(self._next());
               }
            },
            pre   :function(){
               var self = this;
               if(!self.autoPlay){
                   //只有再非播放状态下才有效
                   self.gotoAndStop(self._pre());
               }
            },
            _next : function(){
               var self = this;
               if(this.currentFrame >= this.children.length-1){
                   this.currentFrame = 0;
               } else {
                   this.currentFrame++;
               }
               return this.currentFrame;
            },
      
            _pre : function(){
               var self = this;
               if(this.currentFrame == 0){
                   this.currentFrame = this.children.length-1;
               } else {
                   this.currentFrame--;
               }
               return this.currentFrame;
            },
            render:function(ctx){
                //这里也还要做次过滤，如果不到speedTime，就略过
      
                //TODO：如果是改变moviclip的x or y 等 非帧动画 属性的时候加上这个就会 有漏帧现象，先注释掉
                /* 
                if( (Base.now-this._preRenderTime) < this._speedTime ){
                   return;
                }
                */
      
                //因为如果children为空的话，Movieclip 会把自己设置为 visible:false，不会执行到这个render
                //所以这里可以不用做children.length==0 的判断。 大胆的搞吧。
      
                if( !this.overPlay ){
                    this.getChildAt(this.currentFrame)._render(ctx);
                } else {
                    for(var i=0 ; i <= this.currentFrame ; i++){
                        this.getChildAt(i)._render(ctx);
                    }
                }
      
                if(this.children.length == 1){
                    this.autoPlay = false;
                }
      
                //如果不循环
                if( this.currentFrame == this.getNumChildren()-1 ){
                    //那么，到了最后一帧就停止
                    if(!this.repeat) {
                        this.stop();
                        if( this.hasEvent("end") ){
                            this.fire("end");
                        }
                    }
                    //使用掉一次循环
                    if( _.isNumber( this.repeat ) && this.repeat > 0 ) {
                       this.repeat -- ;
                    }
                }
      
                if(this.autoPlay){
                    //如果要播放
                    if( (Base.now-this._preRenderTime) >= this._speedTime ){
                        //先把当前绘制的时间点记录
                        this._preRenderTime = Base.now;
                        this._next();
                    }
                    this._push2TaskList();
                } else {
                    //暂停播放
                    if(this._enterInCanvax){
                        //如果这个时候 已经 添加到了canvax的任务列表
                        this._enterInCanvax=false;
                        var tList = this.getStage().parent._taskList;
                        tList.splice( _.indexOf(tList , this) , 1 ); 
                    }
                }
      
            } 
        });
      
        return Movieclip;
      
    }
)