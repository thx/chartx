define(
    "chartx/chart/index",
    [
        "canvax/index",
        "canvax/core/Base",
        "chartx/utils/deep-extend"
    ],
    function( Canvax , CanvaxBase ){
        var Chart = function(node , data , opts){
            this.el     =  Chartx.getEl(node) //chart 在页面里面的容器节点，也就是要把这个chart放在哪个节点里
            this.width  =  parseInt( this.el.offsetWidth )  //图表区域宽
            this.height =  parseInt( this.el.offsetHeight ) //图表区域高

    
            //Canvax实例
            this.canvax =  new Canvax({
                el : this.el
            });
            this.stage  =  new Canvax.Display.Stage({
                id : "main-chart-stage" + new Date().getTime()
            });
    
            this.canvax.addChild( this.stage );
    
            //为所有的chart添加注册事件的能力
            arguments.callee.superclass.constructor.apply(this, arguments);
    
            this.init.apply(this , arguments);

        };
    
        Chart.Canvax = Canvax;
    
        Chart.extend = function(props, statics, ctor) {
            var me = this;
            var BaseChart = function() {
                me.apply(this , arguments);
                if ( ctor ) {
                    ctor.apply(this, arguments);
                }
            };
            BaseChart.extend = me.extend;
            return CanvaxBase.creatClass(BaseChart, me, props, statics);
        };

        Chartx.extend = CanvaxBase.creatClass;
        
        CanvaxBase.creatClass( Chart , Canvax.Event.EventDispatcher , {
            init   : function(){},
            draw   : function(){},
            /*
             * 清除整个图表
             **/
            clear : function(){
                _.each( this.canvax.children , function( stage , i ){
                    stage.removeAllChildren();
                } );
            },
            /**
             * 容器的尺寸改变重新绘制
             */
            resize : function(){
                this.clear();
                this.width   = parseInt( this.el.offsetWidth );
                this.height  = parseInt( this.el.offsetHeight );
                this.canvax.resize();
                this.draw();
            },
            /**
             * reset有两种情况，一是data数据源改变， 一个options的参数配置改变。
             * @param obj {data , options}
             */
            reset : function( obj ){
                if( !obj || _.isEmpty(obj)){
                    return;
                }
                //如果要切换新的数据源
                if( obj.options ){
                    //注意，options的覆盖用的是deepExtend
                    //所以只需要传入要修改的 option部分

                    _.deepExtend( this , obj.options );

                    //配置的变化有可能也会导致data的改变
                    this.dataFrame = this._initData( this.dataFrame.org );
                }
                if( obj.data ){
                    //数据集合，由_initData 初始化
                    this.dataFrame = this._initData( obj.data );
                }
                this.clear();
                this.draw();
            },
            
            _rotate : function( angle ){
                var currW = this.width;
                var currH = this.height;
                this.width  = currH;
                this.height = currW;
    
                var self = this;
                _.each( self.stage.children , function( sprite ){
                    sprite.context.rotation       = angle || -90;
                    sprite.context.x              = ( currW - currH ) / 2 ;
                    sprite.context.y              = ( currH - currW ) / 2 ;
                    sprite.context.rotateOrigin.x = self.width  * sprite.context.$model.scaleX / 2;
                    sprite.context.rotateOrigin.y = self.height * sprite.context.$model.scaleY / 2;
                });
            },

            //默认每个chart都要内部实现一个_initData
            _initData  : function( data ){
                return data;
            }
        });
    
        return Chart;
    
    }
)
