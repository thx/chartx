define(
    "chartx/components/markpoint/index",
    [
         "canvax/index",
         "canvax/animation/Tween"
    ],
    function( Canvax , Tween ){
        var markPoint = function( userOpts , chartOpts , data ){
            this.markTarget = null; //markpoint标准的对应元素
            this.data       = data; //这里的data来自加载markpoint的各个chart，结构都会有不一样，但是没关系。data在markpoint本身里面不用作业务逻辑，只会在fillStyle 等是function的时候座位参数透传给用户
            this.point      = {
                x : 0 , y : 0
            };
            this.normalColor = "#6B95CF";
            this.shapeType   = "droplet";//"circle";
            this.fillStyle   = null;
            this.strokeStyle = null;
            this.lineWidth   = 1;
            this.globalAlpha = 0.7;

            this.duration    = 800;//如果有动画，则代表动画时长
            this.easing      = Tween.Easing.Linear.None;//动画类型

            //droplet opts
            this.hr = 5;
            this.vr = 8;

            //circle opts
            this.r  = 5;
            
            this.sprite = null;
            this.shape  = null;

            this.iGroup = null;
            this.iNode  = null;
            this.iLay   = null;

            this._doneHandle = null;
            this.done   = function( fn ){
                this._doneHandle = fn;
            };

            this.realTime = false; //是否是实时的一个点，如果是的话会有动画
            this.tween    = null;  // realTime 为true的话，tween则为对应的一个缓动对象
            this.filter  = function(){};//过滤函数

            if( "markPoint" in userOpts ){
                this.enabled = true;
                _.deepExtend( this , userOpts.markPoint );
            };
            chartOpts && _.deepExtend( this , chartOpts );

            
            this.init();
        }
        markPoint.prototype = {
            init : function(){
                var me = this;
                this.sprite  = new Canvax.Display.Sprite({ 
                    context : {
                        x : this.point.x,
                        y : this.point.y
                    }
                });
                this.sprite.on("destroy" , function( e ){
                    if (me.tween) {
                        me.tween.stop();
                        Tween.remove( me.tween );
                    };
                    if(me.timer){
                        cancelAnimationFrame(me.timer);
                    }
                });
                setTimeout( function(){
                    me.widget();
                } , 10 );
            },
            widget : function(){
                this._fillStyle   = this._getColor( this.fillStyle   , this.data );
                this._strokeStyle = this._getColor( this.strokeStyle , this.data );
                switch (this.shapeType.toLocaleLowerCase()){
                    case "circle" :
                        this._initCircleMark();
                        break;
                    case "droplet" :
                        this._initDropletMark();
                        break;
                };
               
            },
            _getColor : function( c , data , normalColor ){
                var color = c;
                if( _.isFunction( c ) ){
                    color = c( data );
                }
                //缺省颜色
                if( (!color || color == "") ){
                    //如果有传normal进来，就不管normalColor参数是什么，都直接用
                    if( arguments.length >= 3 ){
                        color = normalColor;
                    } else {
                        color = this.normalColor;
                    }
                }
                return color;
            },
            _done : function(){
                this.shape.context.visible   = true;
                this.shapeBg && (this.shapeBg.context.visible = true);
                _.isFunction( this._doneHandle ) && this._doneHandle.apply( this , [] );
                _.isFunction(this.filter) && this.filter( this );
            },
            _initCircleMark  : function(){
                var me = this;
                require(["canvax/shape/Circle"] , function( Circle ){
                    var ctx = {
                        r : me.r,
                        fillStyle   : me._fillStyle,
                        lineWidth   : me.lineWidth,
                        strokeStyle : me._strokeStyle,
                        globalAlpha : me.globalAlpha,
                        cursor      : "point",
                        visible     : false
                    };
                    me.shape = new Circle({
                        context : ctx
                    });
                    me.sprite.addChild( me.shape );
                    me._realTimeAnimate();
                    me._done();
                });
            },
            destroy : function(){
                if(this.tween){
                    this.tween.stop();
                }
                this.sprite.destroy();
            },
            _realTimeAnimate : function(){
                var me = this;
                if( me.realTime ){
                    if( !me.shapeBg ){
                        me.shapeBg = me.shape.clone();
                        me.sprite.addChildAt( me.shapeBg , 0 );
                    };
                
                    me.timer = null;
                    var growAnima = function(){
                       me.tween = new Tween.Tween( { r : me.r , alpha : me.globalAlpha } )
                       .to( { r : me.r * 3 , alpha : 0 }, me.duration )
                       .onUpdate( function (  ) {
                           me.shapeBg.context.r = this.r;
                           me.shapeBg.context.globalAlpha = this.alpha;
                       } ).repeat(Infinity).delay(800)
                       .easing( me.easing )
                       .start();
                       animate();
                    };
                    function animate(){
                        //console.log(1);
                        me.timer    = requestAnimationFrame( animate ); 
                        Tween.update();
                    };
                    growAnima();
                }

            },
            _initDropletMark : function(){
                var me = this;
                require(["canvax/shape/Droplet"] , function( Droplet ){
                    var ctx = {
                        y      : -me.vr,
                        scaleY : -1,
                        hr     : me.hr,
                        vr     : me.vr,
                        fillStyle   : me._fillStyle,
                        lineWidth   : me.lineWidth,
                        strokeStyle : me._strokeStyle,
                        globalAlpha : me.globalAlpha,
                        cursor  : "point",
                        visible : false
                    };
                    
                    me.shape = new Droplet({
                        context : ctx
                    });

                    me.sprite.addChild( me.shape );
                    me._done();
                    
                });
            }
        }
        return markPoint
    } 
);
