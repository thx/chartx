/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 模拟as3 DisplayList 的 现实对象基类
 */


define(
    "canvax/display/DisplayObject",
    [
        "canvax/event/EventDispatcher",
        "canvax/geom/Matrix",
        "canvax/display/Point",
        "canvax/core/Base",
        "canvax/geom/HitTestPoint",
        "canvax/animation/AnimationFrame",
        "canvax/core/PropertyFactory"
    ],
    function(EventDispatcher , Matrix , Point , Base , HitTestPoint , AnimationFrame , PropertyFactory){

        var DisplayObject = function(opt){
            arguments.callee.superclass.constructor.apply(this, arguments);
            var self = this;
    
            //如果用户没有传入context设置，就默认为空的对象
            opt      = Base.checkOpt( opt );
    
            //设置默认属性
            self.id  = opt.id || null;
    
            //相对父级元素的矩阵
            self._transform      = null;
    
            //心跳次数
            self._heartBeatNum   = 0;
    
            //元素对应的stage元素
            self.stage           = null;
    
            //元素的父元素
            self.parent          = null;
    
            self._eventEnabled   = false;   //是否响应事件交互,在添加了事件侦听后会自动设置为true
    
            self.dragEnabled     = "dragEnabled" in opt ? opt.dragEnabled : false;   //是否启用元素的拖拽

            self.xyToInt         = "xyToInt" in opt ? opt.xyToInt : true;    //是否对xy坐标统一int处理，默认为true，但是有的时候可以由外界用户手动指定是否需要计算为int，因为有的时候不计算比较好，比如，进度图表中，再sector的两端添加两个圆来做圆角的进度条的时候，圆circle不做int计算，才能和sector更好的衔接

            //创建好context
            self._createContext( opt );
    
            var UID = Base.createId(self.type);
    
            //如果没有id 则 沿用uid
            if(self.id == null){
                self.id = UID ;
            };
    
            self.init.apply(self , arguments);
    
            //所有属性准备好了后，先要计算一次this._updateTransform()得到_tansform
            this._updateTransform();
        };
        Base.creatClass( DisplayObject , EventDispatcher , {
            init : function(){},
            _createContext : function( opt ){
                var self = this;
                //所有显示对象，都有一个类似canvas.context类似的 context属性
                //用来存取改显示对象所有和显示有关的属性，坐标，样式等。
                //该对象为Coer.PropertyFactory()工厂函数生成
                self.context = null;
    
                //提供给Coer.PropertyFactory() 来 给 self.context 设置 propertys
                //这里不能用_.extend， 因为要保证_contextATTRS的纯粹，只覆盖下面已有的属性
                var _contextATTRS = Base.copy( {
                    width         : 0,
                    height        : 0,
                    x             : 0,
                    y             : 0,
                    scaleX        : 1,
                    scaleY        : 1,
                    scaleOrigin   : {
                        x : 0,
                        y : 0
                    },
                    rotation      : 0,
                    rotateOrigin  :  {
                        x : 0,
                        y : 0
                    },
                    visible       : true,
                    cursor        : "default",
                    //canvas context 2d 的 系统样式。目前就知道这么多
                    fillStyle     : null,//"#000000",
                    lineCap       : null,
                    lineJoin      : null,
                    lineWidth     : null,
                    miterLimit    : null,
                    shadowBlur    : null,
                    shadowColor   : null,
                    shadowOffsetX : null,
                    shadowOffsetY : null,
                    strokeStyle   : null,
                    globalAlpha   : 1,
                    font          : null,
                    textAlign     : "left",
                    textBaseline  : "top", 
                    arcScaleX_    : null,
                    arcScaleY_    : null,
                    lineScale_    : null,
                    globalCompositeOperation : null
                } , opt.context , true );            
    
                //然后看继承者是否有提供_context 对象 需要 我 merge到_context2D_context中去的
                if (self._context) {
                    _contextATTRS = _.extend(_contextATTRS , self._context );
                }
    
                //有些引擎内部设置context属性的时候是不用上报心跳的，比如做hitTestPoint热点检测的时候
                self._notWatch = false;
    
                _contextATTRS.$owner = self;
                _contextATTRS.$watch = function(name , value , preValue){
    
                    //下面的这些属性变化，都会需要重新组织矩阵属性_transform 
                    var transFormProps = [ "x" , "y" , "scaleX" , "scaleY" , "rotation" , "scaleOrigin" , "rotateOrigin, lineWidth" ];
    
                    if( _.indexOf( transFormProps , name ) >= 0 ) {
                        this.$owner._updateTransform();
                    };
    
                    if( this.$owner._notWatch ){
                        return;
                    };
    
                    if( this.$owner.$watch ){
                        this.$owner.$watch( name , value , preValue );
                    };
    
                    this.$owner.heartBeat( {
                        convertType:"context",
                        shape      : this.$owner,
                        name       : name,
                        value      : value,
                        preValue   : preValue
                    });
                    
                };
    
                //执行init之前，应该就根据参数，把context组织好线
                self.context = PropertyFactory( _contextATTRS );
            },
            /* @myself 是否生成自己的镜像 
             * 克隆又两种，一种是镜像，另外一种是绝对意义上面的新个体
             * 默认为绝对意义上面的新个体，新对象id不能相同
             * 镜像基本上是框架内部在实现  镜像的id相同 主要用来把自己画到另外的stage里面，比如
             * mouseover和mouseout的时候调用*/
            clone : function( myself ){
                var conf   = {
                    id      : this.id,
                    context : _.clone(this.context.$model)
                };
                if( this.img ){
                    conf.img = this.img;
                };
                var newObj = new this.constructor( conf , "clone");
                if( this.children ){
                    newObj.children = this.children;
                }
                if (!myself){
                    newObj.id       = Base.createId(newObj.type);
                };
                return newObj;
            },
            heartBeat : function(opt){
                //stage存在，才说self代表的display已经被添加到了displayList中，绘图引擎需要知道其改变后
                //的属性，所以，通知到stage.displayAttrHasChange
                var stage = this.getStage();
                if( stage ){
                    this._heartBeatNum ++;
                    stage.heartBeat && stage.heartBeat( opt );
                }
            },
            getCurrentWidth : function(){
               return Math.abs(this.context.width * this.context.scaleX);
            },
            getCurrentHeight : function(){
    	       return Math.abs(this.context.height * this.context.scaleY);
            },
            getStage : function(){
                if( this.stage ) {
                    return this.stage;
                };
                var p = this;
                if (p.type != "stage"){
                  while(p.parent) {
                    p = p.parent;
                    if (p.type == "stage"){
                      break;
                    }
                  };
                  if (p.type !== "stage") {
                    //如果得到的顶点display 的type不是Stage,也就是说不是stage元素
                    //那么只能说明这个p所代表的顶端display 还没有添加到displayList中，也就是没有没添加到
                    //stage舞台的childen队列中，不在引擎渲染范围内
                    return false;
                  }
                } 
                //一直回溯到顶层object， 即是stage， stage的parent为null
                this.stage = p;
                return p;
            },
            localToGlobal : function( point , container ){
                !point && ( point = new Point( 0 , 0 ) );
                var cm = this.getConcatenatedMatrix( container );
    
                if (cm == null) return Point( 0 , 0 );
                var m = new Matrix(1, 0, 0, 1, point.x , point.y);
                m.concat(cm);
                return new Point( m.tx , m.ty ); //{x:m.tx, y:m.ty};
            },
            globalToLocal : function( point , container) {
                !point && ( point = new Point( 0 , 0 ) );
    
                if( this.type == "stage" ){
                    return point;
                }
                var cm = this.getConcatenatedMatrix( container );
    
                if (cm == null) return new Point( 0 , 0 ); //{x:0, y:0};
                cm.invert();
                var m = new Matrix(1, 0, 0, 1, point.x , point.y);
                m.concat(cm);
                return new Point( m.tx , m.ty ); //{x:m.tx, y:m.ty};
            },
            localToTarget : function( point , target){
                var p = localToGlobal( point );
                return target.globalToLocal( p );
            },
            getConcatenatedMatrix : function( container ){
                var cm = new Matrix();
                for (var o = this; o != null; o = o.parent) {
                    cm.concat( o._transform );
                    if( !o.parent || ( container && o.parent && o.parent == container ) || ( o.parent && o.parent.type=="stage" ) ) {
                    //if( o.type == "stage" || (o.parent && container && o.parent.type == container.type ) ) {
                        return cm;//break;
                    }
                }
                return cm;
            },
            /*
             *设置元素的是否响应事件检测
             *@bool  Boolean 类型
             */
            setEventEnable : function( bool ){
                if(_.isBoolean(bool)){
                    this._eventEnabled = bool
                    return true;
                };
                return false;
            },
            /*
             *查询自己在parent的队列中的位置
             */
            getIndex   : function(){
                if(!this.parent) {
                  return;
                };
                return _.indexOf(this.parent.children , this)
            },
            /*
             *元素在z轴方向向下移动
             *@num 移动的层级
             */
            toBack : function( num ){
                if(!this.parent) {
                  return;
                }
                var fromIndex = this.getIndex();
                var toIndex = 0;
                
                if(_.isNumber( num )){
                  if( num == 0 ){
                     //原地不动
                     return;
                  };
                  toIndex = fromIndex - num;
                }
                var me = this.parent.children.splice( fromIndex , 1 )[0];
                if( toIndex < 0 ){
                    toIndex = 0;
                };
                this.parent.addChildAt( me , toIndex );
            },
            /*
             *元素在z轴方向向上移动
             *@num 移动的层数量 默认到顶端
             */
            toFront : function( num ){
                if(!this.parent) {
                  return;
                }
                var fromIndex = this.getIndex();
                var pcl = this.parent.children.length;
                var toIndex = pcl;
                
                if(_.isNumber( num )){
                  if( num == 0 ){
                     //原地不动
                     return;
                  }
                  toIndex = fromIndex + num + 1;
                }
                var me = this.parent.children.splice( fromIndex , 1 )[0];
                if(toIndex > pcl){
                    toIndex = pcl;
                }
                this.parent.addChildAt( me , toIndex-1 );
            },
            _transformHander : function( ctx ){
                var transForm = this._transform;
                if( !transForm ) {
                    transForm = this._updateTransform();
                };
                //运用矩阵开始变形
                ctx.transform.apply( ctx , transForm.toArray() );
                //ctx.globalAlpha *= this.context.globalAlpha;
            },
            _updateTransform : function() {
                var _transform = new Matrix();
                _transform.identity();
                var ctx = this.context;
                //是否需要Transform
                if(ctx.scaleX !== 1 || ctx.scaleY !==1 ){
                    //如果有缩放
                    //缩放的原点坐标
                    var origin = new Point(ctx.scaleOrigin);
                    if( origin.x || origin.y ){
                        _transform.translate( -origin.x , -origin.y );
                    }
                    _transform.scale( ctx.scaleX , ctx.scaleY );
                    if( origin.x || origin.y ){
                        _transform.translate( origin.x , origin.y );
                    };
                };
    
                var rotation = ctx.rotation;
                if( rotation ){
                    //如果有旋转
                    //旋转的原点坐标
                    var origin = new Point(ctx.rotateOrigin);
                    if( origin.x || origin.y ){
                        _transform.translate( -origin.x , -origin.y );
                    }
                    _transform.rotate( rotation % 360 * Math.PI/180 );
                    if( origin.x || origin.y ){
                        _transform.translate( origin.x , origin.y );
                    }
                };

                //如果有位移
                var x,y;
                if( this.xyToInt ){
                    var x = parseInt( ctx.x );//Math.round(ctx.x);
                    var y = parseInt( ctx.y );//Math.round(ctx.y);
    
                    if( parseInt(ctx.lineWidth , 10) % 2 == 1 && ctx.strokeStyle ){
                        x += 0.5;
                        y += 0.5;
                    }
                } else {
                    x = ctx.x;
                    y = ctx.y;
                };
    
                if( x != 0 || y != 0 ){
                    _transform.translate( x , y );
                };
                this._transform = _transform;
                //console.log(this.id+":tx_"+_transform.tx+":cx_"+this.context.x);
    
                return _transform;
            },
            //显示对象的选取检测处理函数
            getChildInPoint : function( point ){
                var result; //检测的结果
    
                //第一步，吧glob的point转换到对应的obj的层级内的坐标系统
                if( this.type != "stage" && this.parent && this.parent.type != "stage" ) {
                    point = this.parent.globalToLocal( point );
                };
    
                var x = point.x;
                var y = point.y;
    
                //这个时候如果有对context的set，告诉引擎不需要watch，因为这个是引擎触发的，不是用户
                //用户set context 才需要触发watch
                this._notWatch = true;
            
                //对鼠标的坐标也做相同的变换
                if( this._transform ){
                    var inverseMatrix = this._transform.clone().invert();
                    var originPos = [x, y];
                    originPos = inverseMatrix.mulVector( originPos );
    
                    x = originPos[0];
                    y = originPos[1];
                };
    
                var _rect = this._rect = this.getRect(this.context);
    
                if(!_rect){
                    return false;
                };
                if( !this.context.width && !!_rect.width ){
                    this.context.width = _rect.width;
                };
                if( !this.context.height && !!_rect.height ){
                    this.context.height = _rect.height;
                };
                if(!_rect.width || !_rect.height) {
                    return false;
                };
                //正式开始第一步的矩形范围判断
                if ( x    >= _rect.x
                    &&  x <= (_rect.x + _rect.width)
                    &&  y >= _rect.y
                    &&  y <= (_rect.y + _rect.height)
                ) {
                   //那么就在这个元素的矩形范围内
                   result = HitTestPoint.isInside( this , {
                       x : x,
                       y : y
                   } );
                } else {
                   //如果连矩形内都不是，那么肯定的，这个不是我们要找的shap
                   result = false;
                }
                this._notWatch = false;
                return result;
            },
            /*
            * animate
            * @param toContent 要动画变形到的属性集合
            * @param options tween 动画参数
            */
            animate : function( toContent , options ){
                var to = toContent;
                var from = {};
                for( var p in to ){
                    from[ p ] = this.context[p];
                };
                !options && (options = {});
                options.from = from;
                options.to = to;

                var self = this;
                var upFun = function(){};
                if( options.onUpdate ){
                    upFun = options.onUpdate;
                };
                var tween;
                options.onUpdate = function(){
                    //如果context不存在说明该obj已经被destroy了，那么要把他的tween给destroy
                    if (!self.context && tween) {
                        AnimationFrame.destroyTween(tween);
                        tween = null;
                        return;
                    };
                    for( var p in this ){
                        self.context[p] = this[p];
                    };
                    upFun.apply(self , [this]);
                };
                var compFun = function(){};
                if( options.onComplete ){
                    compFun = options.onComplete;
                };
                options.onComplete = function( opt ){
                    compFun.apply(self , arguments)
                };
                tween = AnimationFrame.registTween( options );
                return tween;
            },
            _render : function( ctx ){	
                if( !this.context.visible || this.context.globalAlpha <= 0 ){
                    return;
                }
                ctx.save();
                this._transformHander( ctx );
    
                //文本有自己的设置样式方式
                if( this.type != "text" ) {
                    Base.setContextStyle( ctx , this.context.$model );
                }
    
                this.render( ctx );
                ctx.restore();
            },
            render : function( ctx ) {
                //基类不提供render的具体实现，由后续具体的派生类各自实现
            },
            //从树中删除
            remove : function(){
                if( this.parent ){
                    this.parent.removeChild(this);
                    this.parent = null;
                }
            },
            //元素的自我销毁
            destroy : function(){
                this.remove();
                this.fire("destroy");
                //把自己从父节点中删除了后做自我清除，释放内存
                this.context = null;
                delete this.context;
            }
        } );
        return DisplayObject;
    } 
);
