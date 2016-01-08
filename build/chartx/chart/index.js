define(
    "chartx/chart/index", [
        "canvax/index",
        "canvax/core/Base"
    ],
    function(Canvax, CanvaxBase) {
        var Chart = function(node, data, opts) {
            //为了防止用户在canvax加载了并且给underscore添加了deepExtend扩展后又加载了一遍underscore
            //检测一遍然后重新自己添加一遍扩展
            if (_ && !_.deepExtend) {
                CanvaxBase.setDeepExtend();
            }

            this.el = CanvaxBase.getEl(node) //chart 在页面里面的容器节点，也就是要把这个chart放在哪个节点里
            this.width = parseInt(this.el.offsetWidth) //图表区域宽
            this.height = parseInt(this.el.offsetHeight) //图表区域高

            this.padding = {
                top: 10,
                right: 10,
                bottom: 10,
                left: 10
            }

            //Canvax实例
            this.canvax = new Canvax({
                el: this.el
            });
            this.stage = new Canvax.Display.Stage({
                id: "main-chart-stage" + new Date().getTime()
            });
            this.canvax.addChild(this.stage);

            //为所有的chart添加注册事件的能力
            arguments.callee.superclass.constructor.apply(this, arguments);
            this.init.apply(this, arguments);
        };

        Chart.Canvax = Canvax;

        Chart.extend = function(props, statics, ctor) {
            var me = this;
            var BaseChart = function() {
                me.apply(this, arguments);
                if (ctor) {
                    ctor.apply(this, arguments);
                }
            };
            BaseChart.extend = me.extend;
            return CanvaxBase.creatClass(BaseChart, me, props, statics);
        };

        Chartx.extend = CanvaxBase.creatClass;

        CanvaxBase.creatClass(Chart, Canvax.Event.EventDispatcher, {
            inited : false,
            init: function() {},
            dataFrame: null, //每个图表的数据集合 都 存放在dataFrame中。
            draw: function() {},
            /*
             * chart的销毁 
             */
            destroy: function() {
                this.clean();
                this.el.innerHTML = "";
                this._destroy && this._destroy();
            },
            /*
             * 清除整个图表
             **/
            clean: function() {
                for (var i=0,l=this.canvax.children.length;i<l;i++){
                    var stage = this.canvax.getChildAt(i);
                    for( var s = 0 , sl=stage.children.length ; s<sl ; s++){
                        stage.getChildAt(s).destroy();
                        s--;
                        sl--;
                    }
                };
            },
            /**
             * 容器的尺寸改变重新绘制
             */
            resize: function() {
                this.clean();
                this.width = parseInt(this.el.offsetWidth);
                this.height = parseInt(this.el.offsetHeight);
                this.canvax.resize();
                this.inited = false;
                this.draw();
                this.inited = true;
            },
            /**
             * reset有两种情况，一是data数据源改变， 一个options的参数配置改变。
             * @param obj {data , options}
             */
            reset: function(obj) {
                /*如果用户有调用reset就说明用户是有想要绘制的 
                 *还是把这个权利交给使用者自己来控制吧
                if( !obj || _.isEmpty(obj)){
                    return;
                }
                */
                //如果只有数据的变化
                if (obj && obj.data && !obj.options && this.resetData) {
                    this.resetData( obj.data );
                    return;
                };
                if (obj && obj.options) {
                    //注意，options的覆盖用的是deepExtend
                    //所以只需要传入要修改的 option部分

                    _.deepExtend(this, obj.options);

                    //配置的变化有可能也会导致data的改变
                    this.dataFrame && (this.dataFrame = this._initData(this.dataFrame.org));
                }
                if (obj && obj.data) {
                    //数据集合，由_initData 初始化
                    this.dataFrame = this._initData(obj.data);
                }
                this.clean();
                this.canvax.getDomContainer().innerHTML = "";
                this.draw();
            },

            _rotate: function(angle) {
                var currW = this.width;
                var currH = this.height;
                this.width = currH;
                this.height = currW;

                var self = this;
                _.each(self.stage.children, function(sprite) {
                    sprite.context.rotation = angle || -90;
                    sprite.context.x = (currW - currH) / 2;
                    sprite.context.y = (currH - currW) / 2;
                    sprite.context.rotateOrigin.x = self.width * sprite.context.$model.scaleX / 2;
                    sprite.context.rotateOrigin.y = self.height * sprite.context.$model.scaleY / 2;
                });
            },

            //默认每个chart都要内部实现一个_initData
            _initData: function(data) {
                return data;
            }
        });

        return Chart;

    }
);